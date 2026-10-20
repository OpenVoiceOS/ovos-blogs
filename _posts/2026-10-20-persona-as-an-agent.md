---
title: "Your OVOS Persona as an Agent Other Agents Can Call"
excerpt: "ovos-persona-server publishes a persona as an A2A agent, and its tools over MCP, UTCP and stdio. Other agents, Claude Code, Claude Desktop, opencode and Mistral Vibe can then use them."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Your OVOS Persona as an Agent Other Agents Can Call

You built an OVOS persona, a travel guide with a Wikipedia tool. You want other software to use it: an agent framework that delegates questions, Claude Code while you write, and Claude Desktop on your laptop.

[ovos-persona-server](https://github.com/OpenVoiceOS/ovos-persona-server) does this from one process. [Install ovos-persona-server and talk to it](https://blog.openvoiceos.org/posts/2026-09-10-persona-server) covers the install and the chat API. This post covers the agent protocols.

There are two kinds of access. A2A talks to the **persona**: the other agent sends a question and gets the persona's answer. MCP, UTCP and stdio publish the persona's **tools**: the other agent runs the Wikipedia search itself.

## Start the server

```bash
uv pip install --prerelease=allow 'ovos-persona-server[a2a,mcp]' ovos-wikipedia-plugin ovos-openai-plugin
```

The persona file, `guide.json`, names the model and the toolbox settings:

```json
{
  "name": "guide",
  "description": "A travel guide that answers in one short sentence.",
  "handlers": ["ovos-chat-openai-plugin"],
  "ovos-chat-openai-plugin": {"api_url": "https://llm.openvoiceos.pt/v1", "key": "none", "model": "big-pickle"},
  "ovos-wikipedia-tools": {"lang": "en"}
}
```

```bash
CHAT_MEMORY=transparent ovos-persona-server --persona guide.json --port 8339 \
    --mcp --a2a-base-url http://127.0.0.1:8339/a2a
```

`CHAT_MEMORY=transparent` makes the server keep the history of each A2A conversation, so a follow-up question reaches the same context.

## Another agent asks the persona (A2A)

The agent card is at `/a2a/.well-known/agent-card.json`. It offers A2A 1.0 and 0.3 on the same URL. This script uses the official `a2a-sdk` client:

```python
import asyncio, uuid
import httpx
from a2a.client import ClientConfig, create_client
from a2a.types import Message, Part, Role, SendMessageRequest

async def main():
    config = ClientConfig(streaming=False, httpx_client=httpx.AsyncClient(timeout=120))
    client = await create_client("http://127.0.0.1:8339/a2a", client_config=config)
    message = Message(message_id=str(uuid.uuid4()), role=Role.ROLE_USER,
                      parts=[Part(text="Name one thing to see in Évora.")])
    async for event in client.send_message(SendMessageRequest(message=message)):
        print(event.task.artifacts[0].parts[0].text)

asyncio.run(main())
```

```text
Chapel of Bones (Capela dos Ossos)
```

## Claude Code uses the tools (MCP)

```bash
claude mcp add --transport http ovos-persona http://127.0.0.1:8339/mcp
claude mcp get ovos-persona
```

```text
ovos-persona:
  Scope: Local config (private to you in this project)
  Status: ✔ Connected
  Type: http
  URL: http://127.0.0.1:8339/mcp
```

Any MCP client sees the same tool. The reference Python client listed it and searched for Évora:

```text
['search_wikipedia']
False {"results": [["Évora", "Évora, officially the Most Noble and Ever Loyal City of Évora, is a city and a municipality in Portugal. ...
```

`False` is the `is_error` flag of the result. A tool that fails returns `True` with the error text.

## Claude Desktop uses the tools (stdio)

Claude Desktop starts local MCP servers as processes, so it takes a command, not a URL. The `ovos-persona-tools-mcp` command serves the same tools over stdio and needs no running server. Add this to `claude_desktop_config.json`, with absolute paths:

```json
{
  "mcpServers": {
    "ovos-persona": {
      "command": "/home/me/.venv/bin/ovos-persona-tools-mcp",
      "env": {"PERSONA_PATH": "/home/me/personas/guide.json"}
    }
  }
}
```

We ran this entry with the reference MCP client in place of Claude Desktop. It listed `search_wikipedia`, and a search for Porto returned the Wikipedia summary of Porto.

## opencode and Mistral Vibe use the tools

opencode reads MCP servers from `opencode.json` in the project folder:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "ovos-persona": {"type": "remote", "url": "http://127.0.0.1:8339/mcp", "enabled": true}
  }
}
```

`opencode mcp list` then shows `✓ ovos-persona connected`.

Mistral Vibe reads them from `~/.vibe/config.toml`:

```toml
[[mcp_servers]]
name = "ovos-persona"
transport = "streamable-http"
url = "http://127.0.0.1:8339/mcp"
```

Write this entry in the file. `vibe mcp add` sets OAuth login for an HTTP server, and the persona server does not use OAuth. Vibe loads the tools when it starts and gives each one the server name as a prefix, so the tool is `ovos_persona_search_wikipedia`.

Both clients can also start the stdio command. In opencode, use `"type": "local"`, `"command": ["/home/me/.venv/bin/ovos-persona-tools-mcp"]` and `"environment": {"PERSONA_PATH": "/home/me/personas/guide.json"}`. In Vibe, use `transport = "stdio"`, the same `command` and `env = { PERSONA_PATH = "/home/me/personas/guide.json" }`.

## Any UTCP agent uses the tools

`GET /utcp` returns a UTCP 1.0 manual. A UTCP client calls each tool over plain HTTP. The manual puts the arguments in a `body` field:

```python
client = await UtcpClient.create(config={"manual_call_templates": [
    {"name": "ovos_persona", "call_template_type": "http", "url": "http://127.0.0.1:8339/utcp", "http_method": "GET"}]})
print(await client.call_tool("ovos_persona.search_wikipedia", {"body": {"query": "Évora", "lang": "en"}}))
```

```text
{'results': [['Évora', "Évora, officially the Most Noble and Ever Loyal City of Évora, is a city and a municipality in Portugal. ...
```

## Limits

- The endpoints have no authentication. Bind the server to localhost, or put a proxy with authentication in front of it.
- MCP, UTCP and stdio publish tools only. To reach the persona itself, use A2A or the chat API.
- Without `CHAT_MEMORY=transparent`, the server keeps no history, and an A2A follow-up question loses its context.

The [agent guide](https://github.com/OpenVoiceOS/ovos-persona-server/blob/dev/docs/ai-agents.md) and the [A2A guide](https://github.com/OpenVoiceOS/ovos-persona-server/blob/dev/docs/a2a.md) give every option. Report issues on the [ovos-persona-server tracker](https://github.com/OpenVoiceOS/ovos-persona-server/issues).

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
