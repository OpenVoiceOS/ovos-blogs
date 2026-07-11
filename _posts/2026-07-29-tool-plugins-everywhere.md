---
title: "Tool Plugins Everywhere: One ToolBox, Reachable Four Ways"
excerpt: "An OPM ToolBox is now callable in-process by agents, over the OVOS messagebus via PHAL, over plain HTTP with UTCP, and over MCP — all from the same installed plugin."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-07-29T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## One Plugin, Every Call Path

OVOS is a plugin-first platform. Speech engines, wake word detectors, intent parsers — every major capability is a swappable plugin discovered through the OPM (OVOS Plugin Manager) entry-point system. A recent addition extends that model to arbitrary callable *tools*: weather lookups, home-control actions, web searches, or anything else an author wants an LLM agent to be able to invoke.

The plugin type is the **`ToolBox`**, defined in `ovos-plugin-manager` (PR #340) under the entry-point group **`opm.agents.toolbox`**. What makes it interesting is not the type itself but its reach: a single installed ToolBox becomes callable four different ways without the author writing any protocol-specific code.

---

## The ToolBox Plugin Type

A `ToolBox` is an abstract base class that groups related tools. The author implements one method — `discover_tools()` — returning a list of `AgentTool` definitions. Each `AgentTool` carries everything an LLM needs to call it:

- `name` — the unique, snake_case identifier the model uses
- `description` — a natural-language explanation of what the tool does
- `argument_schema` — a Pydantic model describing the inputs
- `output_schema` — a Pydantic model describing the result
- `tool_call` — the Python function that actually runs

Because arguments and outputs are Pydantic models, every tool exposes a real JSON Schema for free. That schema is what flows to the LLM, and it is also what every call path below reuses verbatim.

The base class already knows how to talk to the OVOS messagebus. When bound to a bus, each ToolBox registers a discovery broadcast handler on `ovos.persona.tools.discover` and a private call channel on `ovos.persona.tools.<toolbox_id>.call`. This is the in-process path: the OVOS agent loop discovers toolboxes and invokes their tools directly, in the same process, with no network hop. For the common case — a persona running tools locally — nothing else is needed.

Three more surfaces build on top of that same registry.

---

## The PHAL Route: Tools on the Messagebus

[`ovos-PHAL-plugin-tools`](https://github.com/OpenVoiceOS/ovos-PHAL-plugin-tools) is a PHAL service that loads *every* installed ToolBox at startup and aggregates them behind one flat, `ovos.tools.*` messagebus API. Any skill, service, or bus client can enumerate and call tools without knowing which package provides them.

| Event | What it does |
|---|---|
| `ovos.tools.list` | Returns every tool with its argument and output JSON Schema |
| `ovos.tools.get` | Returns the schema for one named tool (`{"name": "..."}`) |
| `ovos.tools.invoke` | Calls a tool by name (`{"name": "...", "args": {...}}`) |
| `ovos.tools.reload` | Re-scans for toolboxes installed while OVOS is running |

Every reply arrives on `<event>.response`.

```python
from ovos_bus_client import MessageBusClient
from ovos_bus_client.message import Message

bus = MessageBusClient()
bus.run_in_thread()

# list all tools
bus.emit(Message("ovos.tools.list"))
# invoke a tool
bus.emit(Message("ovos.tools.invoke", {"name": "multiply", "args": {"a": 3, "b": 4}}))
```

The invoke handler validates the arguments against the tool's schema, runs it, and returns either `{"name": ..., "result": {...}}` or `{"name": ..., "error": "..."}`. One bad plugin cannot take down the rest — load failures are logged and skipped.

---

## UTCP and MCP: Tools over HTTP

[`ovos-persona-server` PR #37](https://github.com/OpenVoiceOS/ovos-persona-server/pull/37) wires the same ToolBox registry into the server's HTTP layer, exposing it through two standard agent protocols at once.

**UTCP (Universal Tool Calling Protocol)** is served directly by the FastAPI app:

- `GET /tools/manual` — a UTCP manual listing every installed tool, its JSON Schema, and the URL to call it. An optional `request_base_url` query parameter lets the manual advertise a public address instead of `localhost`.
- `POST /tools/{name}` — call a tool over plain HTTP, passing arguments as JSON. No agent framework required; anything that can make an HTTP request can use it.

**MCP (Model Context Protocol)** is mounted onto the same Uvicorn process at `/mcp`, using the streamable-HTTP transport, so it shares the server's port (8337 by default) and lifespan. Each tool becomes a FastMCP tool with the exact same schema it has everywhere else. MCP support lives behind the **`[mcp]` extra** (`pip install ovos-persona-server[mcp]`); when the `mcp` package is present the server mounts it automatically, and when it is not the server runs UTCP-only. A standalone stdio entry point (`ovos-persona-tools-mcp`) is also available for clients that prefer a subprocess.

All three server surfaces read from one registry built from the `opm.agents.toolbox` entry points. Install a new ToolBox, restart the server, and it appears in the UTCP manual and the MCP tool list simultaneously — and, if the PHAL provider is running, on the bus as well.

---

## The Other Direction: Consuming External Tools

The routes above *expose* OVOS tools to the outside world. [`ovos-tool-adapters`](https://github.com/OpenVoiceOS/ovos-tool-adapters) is the mirror image — it lets an OVOS persona *consume* external tools. It ships two ToolBox plugins (entry points `ovos-mcp-toolbox` and `ovos-utcp-toolbox`) that wrap a remote MCP or UTCP server and present its tools to the OVOS agent loop as an ordinary ToolBox. Point a persona at a public MCP server in its JSON config and the agent gains those tools, with the server's real JSON Schema forwarded to the LLM — no protocol awareness in the persona itself.

Because these adapters are themselves `opm.agents.toolbox` plugins, tools pulled in from a remote MCP server can be re-exposed through the very same PHAL bus API and persona-server HTTP routes. The abstraction closes the loop.

---

## The Big Picture

```
              ┌──────────────────────────┐
              │  OPM ToolBox plugin      │
              │  (opm.agents.toolbox)    │
              └────────────┬─────────────┘
                           │  discovered by
     ┌──────────────┬──────┴───────┬──────────────────┐
     │              │              │                  │
 agent loop     PHAL plugin   persona-server     tool-adapters
 (in-process)   (bus API)     (HTTP API)         (consume remote
 direct call    ovos.tools.*  /tools/manual UTCP  MCP/UTCP servers
                              /tools/{name} HTTP   as toolboxes)
                              /mcp          MCP
```

An author writes one plugin against one small interface. Agents calling in-process, skills on the bus, HTTP clients speaking UTCP, and LLM clients speaking MCP all reach the same capability with the same schema — and the plugin author never has to think about any of those call paths.

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
