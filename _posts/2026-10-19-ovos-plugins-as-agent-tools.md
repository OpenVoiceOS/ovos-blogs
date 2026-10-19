---
title: "Use OVOS Plugins as Tools for Any AI Agent"
excerpt: "OVOS tool plugins, personas and speech servers answer over MCP, UTCP, A2A and the OVOS messagebus. An agent that speaks one of these protocols can call them without custom client code."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-19T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Use OVOS Plugins as Tools for Any AI Agent

An OVOS tool plugin is a small Python package that gives an agent one or more typed tools, such as a Wikipedia search. OVOS can serve those tools, a whole persona, and the speech services to other agents over MCP, UTCP, A2A and its own messagebus.

In [Building an Open and Interoperable Voice Ecosystem](https://blog.openvoiceos.org/posts/2025-10-24-protocol_interoperability) we described this as a plan. [Call OVOS Speech Servers From Any AI Agent](https://blog.openvoiceos.org/posts/2026-07-15-mcp-utcp-speech-servers) covered the speech servers. This post covers the rest: tool plugins and personas.

## Why it matters

You write a tool once, as an OVOS plugin. The same tool then works in an OVOS persona, on a device's messagebus, in Claude Code, and in any other MCP client. You do not write one adapter for each agent framework.

![Tools exposed by OVOS](/assets/blog/protocol_interoperability/tools.png)

## Give Claude Code your OVOS tools

[ovos-persona-server](https://github.com/OpenVoiceOS/ovos-persona-server) loads every installed tool plugin and serves it on an MCP endpoint. This example installs the Wikipedia tool plugin:

```bash
uv pip install --prerelease=allow 'ovos-persona-server[a2a,mcp]' ovos-wikipedia-plugin ovos-openai-plugin ovos-solver-failure-plugin
```

The persona file names the model that answers. Any OpenAI-compatible endpoint works:

```json
{
  "name": "guide",
  "description": "A travel guide that answers in one short sentence.",
  "solvers": ["ovos-chat-openai-plugin", "ovos-solver-failure-plugin"],
  "ovos-chat-openai-plugin": {"api_url": "https://llm.openvoiceos.pt/v1", "key": "none", "model": "big-pickle"}
}
```

Start the server with MCP and A2A, then register it in Claude Code:

```bash
ovos-persona-server --persona guide.json --port 8337 --mcp --a2a-base-url http://127.0.0.1:8337/a2a
claude mcp add --transport http ovos-persona http://127.0.0.1:8337/mcp
claude mcp get ovos-persona
```

```text
ovos-persona:
  Scope: Local config (private to you in this project)
  Status: ✔ Connected
  Type: http
  URL: http://127.0.0.1:8337/mcp
```

Any MCP client sees the same tool. A Python client that lists the tools and searches for Évora prints this:

```text
['search_wikipedia']
{"results": [["Évora", "Évora, officially the Most Noble and Ever Loyal City of Évora, is a city and a municipality in Portugal. ...
```

## The same tools in opencode and Mistral Vibe

opencode reads MCP servers from `opencode.json` in the project folder:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "ovos-persona": {"type": "remote", "url": "http://127.0.0.1:8337/mcp", "enabled": true}
  }
}
```

`opencode mcp list` then shows `✓ ovos-persona connected`.

Mistral Vibe reads them from `~/.vibe/config.toml`:

```toml
[[mcp_servers]]
name = "ovos-persona"
transport = "streamable-http"
url = "http://127.0.0.1:8337/mcp"
```

Write this entry in the file. `vibe mcp add` sets OAuth login for an HTTP server, and the persona server does not use OAuth. Vibe loads the tools when it starts and gives each one the server name as a prefix, so the tool is `ovos_persona_search_wikipedia`.

## Talk to a persona as an A2A agent

With `--a2a-base-url`, the same process serves the persona as an [A2A](https://a2a-protocol.org) agent. The agent card is at `/a2a/.well-known/agent-card.json`. We asked the persona a question with the official `a2a-sdk` client:

```python
config = ClientConfig(streaming=False, httpx_client=httpx.AsyncClient(timeout=120))
client = await create_client("http://127.0.0.1:8337/a2a/", client_config=config)
msg = Message(message_id=str(uuid.uuid4()), role=Role.ROLE_USER, parts=[Part(text="Name one thing to see in Évora.")])
async for event in client.send_message(SendMessageRequest(message=msg)):
    print(event.task.artifacts[0].parts[0].text)
```

```text
The Roman Temple of Évora (Templo Romano), a well-preserved 1st-century structure often called the Temple of Diana, is a top attraction in the city.
```

The [A2A guide](https://github.com/OpenVoiceOS/ovos-persona-server/blob/dev/docs/a2a.md) explains the card, streaming and the public URL behind a proxy.

## Tools on the device's messagebus

[ovos-PHAL-plugin-tools](https://github.com/OpenVoiceOS/ovos-PHAL-plugin-tools) gives skills and other bus clients the same tools. It answers `ovos.tools.list`, `ovos.tools.get` and `ovos.tools.invoke`. On a test bus, a client sent two messages:

```python
tools = client.wait_for_response(Message("ovos.tools.list"))
answer = client.wait_for_response(Message("ovos.tools.invoke",
    {"name": "search_wikipedia", "args": {"query": "Évora", "lang": "en"}}), timeout=30)
```

```text
['search_wikipedia']
Évora
```

## Write your own tool

A tool plugin subclasses `ToolBox` from [ovos-plugin-manager](https://github.com/OpenVoiceOS/ovos-plugin-manager/blob/dev/docs/api/agent-tools.md). It declares its tools with Pydantic argument and output models, and registers under the `opm.agents.toolbox` entry point. The persona server and the PHAL plugin load every installed toolbox. An agentic persona loads the toolboxes that its configuration names.

## Limits

- The UTCP 1.2 client rejects the UTCP manuals of the persona and STT servers. It loads the TTS manual but cannot call its synthesis tools, because they return raw WAV. The translate server's manual loads and works.
- `ovos-persona-server[mcp]` and `ovos-translate-server[mcp]` require different major versions of `fastmcp`. Install them in separate environments.
- The MCP, UTCP and A2A endpoints have no authentication. Bind them to localhost, or put a proxy with authentication in front of them.
- The A2A agent card leaves `protocolVersion` empty on its interface and `tags` empty on its skill. The `a2a-sdk` server logs a warning about this.
- Claude Desktop starts only local commands from `claude_desktop_config.json`. For an HTTP endpoint, use `npx -y mcp-remote http://127.0.0.1:8337/mcp` as the command.

## Report issues

Open an issue on the repository of the component: [ovos-persona-server](https://github.com/OpenVoiceOS/ovos-persona-server/issues), [ovos-PHAL-plugin-tools](https://github.com/OpenVoiceOS/ovos-PHAL-plugin-tools/issues) or [ovos-plugin-manager](https://github.com/OpenVoiceOS/ovos-plugin-manager/issues). Each server's agent guide is in its `docs/ai-agents.md`.

---

This work is part of the OpenVoiceOS **From Beta to Breakthrough** milestone, funded through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of [DG Communications Networks, Content and Technology](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en) under grant agreement No [101135429](https://cordis.europa.eu/project/id/101135429). Additional funding is made available by the [Swiss State Secretariat for Education, Research and Innovation](https://www.sbfi.admin.ch/sbfi/en/home.html) (SERI).

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
