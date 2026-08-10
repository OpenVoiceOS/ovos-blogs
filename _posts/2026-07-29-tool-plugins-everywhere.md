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

## Write a Tool Once, Call It Four Ways

This post is for plugin and persona authors, not for people who just talk to their OVOS device. If you write skills or tools for OVOS, it saves you real work. If you only use a voice assistant at home, nothing about your day-to-day experience changes — this is infrastructure under the hood.

An LLM agent needs tools: weather lookups, home-control actions, web searches, anything you want it to be able to invoke. Until now, wiring a tool into OVOS meant writing protocol-specific code for every surface you wanted it to reach — the agent loop, the messagebus, an HTTP API, MCP (Model Context Protocol, a standard way for LLM tools to describe themselves to an AI agent). Now that work is mostly gone: write one plugin and it becomes callable in-process, over the messagebus, over plain HTTP, and over MCP, with no protocol-specific code in the plugin itself. Some surfaces still need their own setup, covered below.

The plugin type is the **`ToolBox`**, defined in `ovos-plugin-manager` (OPM, the library that manages OVOS plugins) via [PR #340](https://github.com/OpenVoiceOS/ovos-plugin-manager/pull/340), under the entry-point group **`opm.agents.toolbox`**. Install one and it is reachable four different ways.

---

## The ToolBox Plugin Type

A `ToolBox` is an abstract base class that groups related tools. The author implements one method, `discover_tools()`, which returns a list of `AgentTool` definitions. Each `AgentTool` carries what an LLM needs to call it:

- `name` — the unique, snake_case identifier the model uses
- `description` — a natural-language explanation of what the tool does
- `argument_schema` — a Pydantic model (a Python class that describes and validates a piece of data) describing the inputs
- `output_schema` — a Pydantic model describing the result
- `tool_call` — the Python function that runs

Because arguments and outputs are Pydantic models, every tool gets a real JSON Schema (a standard description of a data shape, used by LLM tool-calling APIs) for free. That schema is what reaches the LLM, and every call path below reuses it.

A `ToolBox` also knows how to talk to the OVOS messagebus, the internal system that OVOS components use to send each other messages. Once connected to it, a ToolBox announces itself on one channel and listens for calls on another, so the OVOS agent loop can find it and invoke its tools directly, in the same process, with no network hop. For a persona running tools locally, nothing else is needed.

Three more surfaces build on the same registry.

---

## The PHAL Route: Tools on the Messagebus

PHAL (the Plugin-based Hardware Abstraction Layer, OVOS's service for connecting hardware and system features to the messagebus) gets its own tools plugin: [`ovos-PHAL-plugin-tools`](https://github.com/OpenVoiceOS/ovos-PHAL-plugin-tools). It loads every installed ToolBox at startup and aggregates them behind one flat `ovos.tools.*` messagebus API. Any skill, service, or bus client can enumerate and call tools without knowing which package provides them. This requires deploying `ovos-PHAL-plugin-tools` as a separate PHAL plugin — it does not happen automatically just by installing a ToolBox.

| Event | What it does |
|---|---|
| `ovos.tools.list` | Returns every tool with its argument and output JSON Schema |
| `ovos.tools.get` | Returns the schema for one named tool (`{"name": "..."}`) |
| `ovos.tools.invoke` | Calls a tool by name (`{"name": "...", "args": {...}}`) |
| `ovos.tools.reload` | Re-scans for toolboxes installed while OVOS is running |

Every reply arrives on `<event>.response`. For developers who want to try it, here is the shape of a call:

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

The invoke handler validates the arguments against the tool's schema, runs it, and returns either `{"name": ..., "result": {...}}` or `{"name": ..., "error": "..."}`. Each toolbox loads inside its own try/except block, so one bad plugin does not stop the others from loading — the failure is logged and skipped ([source](https://github.com/OpenVoiceOS/ovos-PHAL-plugin-tools/blob/dev/ovos_phal_plugin_tools/__init__.py)).

---

## UTCP and MCP: Tools over HTTP

[`ovos-persona-server` PR #37](https://github.com/OpenVoiceOS/ovos-persona-server/pull/37) wires the same ToolBox registry into the server's HTTP layer, exposing it through two standard agent protocols at once. Both give an outside caller the ability to run whatever tools your toolboxes expose, so treat these endpoints like any other network service you're responsible for locking down — put them behind your own authentication or network boundary before exposing them beyond your own machine.

**UTCP (Universal Tool Calling Protocol, a lighter alternative to MCP that skips a persistent connection)** is served directly by the server's web API:

- `GET /tools/manual` — a UTCP manual listing every installed tool, its JSON Schema, and the URL to call it. An optional `request_base_url` query parameter lets the manual advertise a public address instead of `localhost`.
- `POST /tools/{name}` — call a tool over plain HTTP, passing arguments as JSON. No agent framework required; anything that can make an HTTP request can use it.

**MCP** shares the same process and port as the rest of the server (8337 by default), mounted at `/mcp` using the streamable-HTTP transport. Each tool becomes an MCP tool with the same schema it has everywhere else. MCP support needs the **`[mcp]` extra** installed (`pip install ovos-persona-server[mcp]`); when that package is present, the server mounts the MCP route automatically, and when it is not, the server runs UTCP-only. A standalone entry point, `ovos-persona-tools-mcp`, is also available for clients that prefer a subprocess instead of hitting the HTTP port.

All three server surfaces read from one registry built from the `opm.agents.toolbox` entry points. Install a new ToolBox, restart the server, and it appears in the UTCP manual and the MCP tool list at once — and, if the PHAL plugin is running, on the bus too.

---

## Consuming External Tools, Not Just Exposing Them

The routes above expose OVOS tools to the outside world. [`ovos-tool-adapters`](https://github.com/OpenVoiceOS/ovos-tool-adapters) does the opposite: it lets an OVOS persona consume external tools. It ships two ToolBox plugins, `ovos-mcp-toolbox` and `ovos-utcp-toolbox`, that wrap a remote MCP or UTCP server and present its tools to the OVOS agent loop as an ordinary ToolBox. Point a persona at a public MCP server in its JSON config, add the matching entry to `ovos-tool-adapters`, and the agent gains those tools, with the server's real JSON Schema forwarded to the LLM — no protocol-specific handling needed in the persona itself.

Because these adapters are themselves `opm.agents.toolbox` plugins, tools pulled in from a remote MCP server can be re-exposed through the same PHAL bus API and persona-server HTTP routes. The loop closes: a remote tool can end up reachable in-process, on the bus, over UTCP, and over MCP, same as a tool written locally.

---

## The Shape of It

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

Write one plugin against one small interface. Agents calling in-process, skills on the bus, HTTP clients speaking UTCP, and LLM clients speaking MCP all reach the same tool through the same schema, and the plugin author never has to think about any of those call paths beyond the setup each surface needs — installing the PHAL plugin for the bus, or the `[mcp]` extra for MCP.

A few things this does not cover yet: none of the four paths are benchmarked for latency against each other, and there is no support for streaming or long-running async tools — a tool call runs to completion and returns one JSON reply. If you hit either of these limits, that's the current edge of the feature, not a bug.

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
