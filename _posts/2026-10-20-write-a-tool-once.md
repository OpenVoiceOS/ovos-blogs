---
title: "Write a Tool Once, Use It Everywhere"
excerpt: "An OVOS tool plugin is a short Python class. Once installed, the same tool answers on the OVOS messagebus, over MCP, over UTCP and inside agentic personas."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Write a Tool Once, Use It Everywhere

You have a small piece of logic that an assistant should use. Here it is how long a trip takes, from its distance and speed. You want a skill on the device, a persona, Claude Code and a UTCP agent to use it. You write it once, as an OVOS tool plugin.

## Write the plugin

A tool plugin subclasses `ToolBox` from [ovos-plugin-manager](https://github.com/OpenVoiceOS/ovos-plugin-manager). Each tool has a name and a description for the model. It also has a Pydantic model for its arguments, one for its output, and a function. This is the whole package, `ovos_trip_tools/__init__.py`:

```python
from typing import List

from ovos_plugin_manager.templates.agent_tools import AgentTool, ToolArguments, ToolBox, ToolOutput
from pydantic import Field


class TripTimeArgs(ToolArguments):
    distance_km: float = Field(description="Distance to travel, in kilometres.")
    speed_kmh: float = Field(description="Average speed, in kilometres per hour.")


class TripTimeOutput(ToolOutput):
    hours: int
    minutes: int


def trip_time(args: TripTimeArgs) -> TripTimeOutput:
    total_minutes = round(args.distance_km / args.speed_kmh * 60)
    return TripTimeOutput(hours=total_minutes // 60, minutes=total_minutes % 60)


class TripToolBox(ToolBox):
    def __init__(self, config=None, bus=None):
        super().__init__(toolbox_id="ovos-trip-tools", config=config, bus=bus)

    def discover_tools(self) -> List[AgentTool]:
        return [AgentTool(name="trip_time",
                          description="Estimate how long a trip takes from its distance and average speed.",
                          argument_schema=TripTimeArgs,
                          output_schema=TripTimeOutput,
                          tool_call=trip_time)]
```

The `pyproject.toml` registers it under the `opm.agents.toolbox` entry point:

```toml
[project.entry-points."opm.agents.toolbox"]
ovos-trip-tools = "ovos_trip_tools:TripToolBox"
```

After `uv pip install -e .`, a direct call validates the arguments and the output:

```python
>>> TripToolBox().call_tool("trip_time", {"distance_km": 130, "speed_kmh": 100})
TripTimeOutput(hours=1, minutes=18)
```

## On the OVOS messagebus

A toolbox bound to the bus answers there. The PHAL plugin below binds every installed toolbox. A component that knows the toolbox sends `ovos.persona.tools.<toolbox_id>.call` with the tool `name` and its `kwargs`:

```python
answer = client.wait_for_response(Message("ovos.persona.tools.ovos-trip-tools.call",
    {"name": "trip_time", "kwargs": {"distance_km": 130, "speed_kmh": 100}}))
```

```text
{'result': {'hours': 1, 'minutes': 18}, 'toolbox_id': 'ovos-trip-tools'}
```

[ovos-PHAL-plugin-tools](https://github.com/OpenVoiceOS/ovos-PHAL-plugin-tools) loads every installed toolbox and gives skills one flat list. Enable it under `"PHAL": {"ovos-phal-plugin-tools": {"enabled": true}}` in `mycroft.conf`. A caller then needs only the tool name. `ovos.tools.invoke` takes the arguments in `args`:

```python
listed = client.wait_for_response(Message("ovos.tools.list"))
invoked = client.wait_for_response(Message("ovos.tools.invoke",
    {"name": "trip_time", "args": {"distance_km": 130, "speed_kmh": 100}}))
```

```text
ovos.tools.list: ['trip_time']
ovos.tools.invoke: {'name': 'trip_time', 'result': {'hours': 1, 'minutes': 18}}
```

## Over MCP and UTCP

[ovos-persona-server](https://github.com/OpenVoiceOS/ovos-persona-server) also loads every installed toolbox. Start it with `--mcp`:

```bash
uv pip install --prerelease=allow 'ovos-persona-server[mcp]' ovos-solver-failure-plugin
echo '{"name": "tools", "handlers": ["ovos-solver-failure-plugin"]}' > tools.json
ovos-persona-server --persona tools.json --host 127.0.0.1 --port 8340 --mcp
```

The persona file is required, but the tools do not use the persona. Any MCP client, Claude Code included, then sees the tool at `/mcp`:

```text
['trip_time']
False {"hours": 1, "minutes": 18}
```

A UTCP client registers the manual at `/utcp` under the name `ovos_persona` and calls the tool, with the arguments in the `body` field:

```text
['ovos_persona.trip_time']
{'hours': 1, 'minutes': 18}
```

A plain HTTP client posts the arguments:

```bash
curl -s -X POST http://127.0.0.1:8340/tools/trip_time \
  -H 'Content-Type: application/json' -d '{"distance_km": 130, "speed_kmh": 100}'
```

```text
{"hours":1,"minutes":18}
```

## Inside a persona

An agentic persona from [ovos-agentic-loop](https://github.com/OpenVoiceOS/ovos-agentic-loop) lists the toolbox by its id: `"toolboxes": ["ovos-trip-tools"]`. MCP and UTCP toolboxes can go in the same list. [Your OVOS Persona Uses Any MCP or UTCP Tool](https://blog.openvoiceos.org/posts/2026-10-20-persona-uses-mcp-and-utcp-tools) shows such a persona.

## Limits

- The bus has no authorization. Every component on the bus can call every tool.
- The PHAL plugin's list is flat. When two toolboxes own a tool of the same name, call it with `ovos.persona.tools.<toolbox_id>.call`.
- The MCP, UTCP and HTTP endpoints have no authentication. The server binds to all interfaces unless you pass `--host 127.0.0.1`. Keep it on localhost, or put a proxy with authentication in front of it.

Report issues on [ovos-plugin-manager](https://github.com/OpenVoiceOS/ovos-plugin-manager/issues), [ovos-PHAL-plugin-tools](https://github.com/OpenVoiceOS/ovos-PHAL-plugin-tools/issues) or [ovos-persona-server](https://github.com/OpenVoiceOS/ovos-persona-server/issues).

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
