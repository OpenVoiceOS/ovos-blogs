---
title: "Let an OVOS Persona Use Tools and Agents From Anywhere"
excerpt: "OVOS personas can call tools on any MCP server, and OVOS has plugins that pass a question to a remote A2A agent. This post shows what works with the released alphas and what does not yet."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-19T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Let an OVOS Persona Use Tools and Agents From Anywhere

OVOS can also be the client. An agentic persona can call the tools of any MCP server, and a persona or a HiveMind satellite can pass a question to a remote A2A agent.

[Use OVOS Plugins as Tools for Any AI Agent](https://blog.openvoiceos.org/posts/2026-10-19-ovos-plugins-as-agent-tools) shows the other direction, where OVOS serves its tools to other agents. The idea behind both directions is in [Building an Open and Interoperable Voice Ecosystem](https://blog.openvoiceos.org/posts/2025-10-24-protocol_interoperability).

## Why it matters

Many tools exist as MCP servers, and many agents speak A2A. An OVOS persona can use them without a wrapper for each one. You name the server in the persona's configuration, and the tools appear next to the persona's own tool plugins.

![Agentic personas in OVOS](/assets/blog/protocol_interoperability/agentic_personas.png)

## Call an MCP server from OVOS

[ovos-tool-adapters](https://github.com/OpenVoiceOS/ovos-tool-adapters) turns a remote MCP server into an OVOS toolbox. This example uses the MCP endpoint of [ovos-translate-server](https://github.com/OpenVoiceOS/ovos-translate-server):

```bash
uv pip install --prerelease=allow 'ovos-translate-server[mcp]' ovos-google-translate-plugin 'ovos-tool-adapters[mcp]' ovos-agentic-loop
ovos-translate-server --tx-engine ovos-google-translate-plugin --port 9686 --mcp
```

The toolbox finds the server's tools and calls one of them:

```python
from ovos_tool_adapters.mcp import MCPToolBox

toolbox = MCPToolBox(config={"transport": "http", "url": "http://127.0.0.1:9686/mcp", "timeout": 30})
toolbox.refresh_tools()
print(sorted(toolbox.tools))
print(toolbox.call_tool("translate", {"text": "good morning, see you tomorrow",
                                      "target_lang": "pt", "source_lang": "en"}).content)
```

```text
['detect_language', 'translate']
bom dia, até amanhã
```

## Give the tools to an agentic persona

[ovos-agentic-loop](https://github.com/OpenVoiceOS/ovos-agentic-loop) runs a language model in a loop with tools. Its configuration names the toolboxes, and each toolbox's settings go under its own name, inside the loop's section:

```json
{
  "name": "translator",
  "solvers": ["ovos-react-loop"],
  "ovos-react-loop": {
    "brain": "ovos-chat-openai-plugin",
    "ovos-chat-openai-plugin": {"api_url": "https://llm.openvoiceos.pt/v1", "key": "none", "model": "big-pickle"},
    "toolboxes": ["ovos-mcp-toolbox"],
    "ovos-mcp-toolbox": {"transport": "http", "url": "http://127.0.0.1:9686/mcp", "timeout": 30}
  }
}
```

With this configuration, the loop loads the remote tools at start:

```text
toolboxes [('ovos-mcp-toolbox', ['detect_language', 'translate'])]
```

If you put the toolbox settings at the top level of the persona, the loop does not find them. The toolbox then loads no tools and logs `failed to connect to MCP server: 'command'`.

## Ask a remote A2A agent

Two plugins pass a question to an [A2A](https://a2a-protocol.org) agent and return its answer:

- [ovos-a2a-solver-plugin](https://github.com/OpenVoiceOS/ovos-a2a-agent-plugin) is a persona solver. It lets a persona use a remote agent as its brain, or as one step in its solver chain.
- [hivemind-a2a-agent-plugin](https://github.com/JarbasHiveMind/hivemind-a2a-agent-plugin) is a HiveMind agent plugin. It connects hivemind-core to an A2A agent, so a HiveMind satellite keeps its own wake word, STT and TTS and gets its answers from that agent.

The remote agent is meant to be any A2A agent: another OVOS persona served by ovos-persona-server, or an agent from another framework.

## Limits

- The released A2A plugins, `ovos-a2a-solver-plugin` 0.0.2a2 and `hivemind-a2a-agent-plugin` 0.1.1a1, speak an A2A draft from before version 1.0. Agents built on `a2a-sdk` 1.x, including ovos-persona-server, reject their requests.
- `ovos-agentic-loop` 0.2.3a3 cannot load the brain that its configuration names when it runs with `ovos-plugin-manager` 2.12. The loop starts with no model and answers `Error: no brain configured.`
- `ovos-tool-adapters` 0.1.6a3 imports `utcp.client`, which UTCP 1.x does not have. Its UTCP toolbox loads no tools with UTCP 1.x. The MCP toolbox works.
- The MCP and A2A endpoints in these examples have no authentication. Run them on localhost or behind a proxy with authentication.

## Report issues

Open an issue on the repository of the component: [ovos-agentic-loop](https://github.com/OpenVoiceOS/ovos-agentic-loop/issues), [ovos-tool-adapters](https://github.com/OpenVoiceOS/ovos-tool-adapters/issues), [ovos-a2a-agent-plugin](https://github.com/OpenVoiceOS/ovos-a2a-agent-plugin/issues) or [hivemind-a2a-agent-plugin](https://github.com/JarbasHiveMind/hivemind-a2a-agent-plugin/issues).

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
