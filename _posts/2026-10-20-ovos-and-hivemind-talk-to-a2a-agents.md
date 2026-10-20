---
title: "OVOS and HiveMind Talk to A2A Agents"
excerpt: "Two plugins let an OVOS persona and a HiveMind hub answer through any agent that speaks the A2A protocol, including another OVOS persona."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## OVOS and HiveMind Talk to A2A Agents

You have an agent that speaks [A2A](https://a2a-protocol.org): a LangGraph or CrewAI service, a hosted assistant, or a second OVOS box. You want your voice assistant to hand questions to it, and your HiveMind clients to get their answers from it with a `QUERY`.

Two plugins do this. [ovos-a2a-solver-plugin](https://github.com/OpenVoiceOS/ovos-a2a-agent-plugin) is a persona handler. [hivemind-a2a-agent-plugin](https://github.com/JarbasHiveMind/hivemind-a2a-agent-plugin) is an agent protocol for hivemind-core. Both use the official `a2a-sdk` client. They read the agent card and speak A2A 1.0 or 0.3, whichever the agent offers.

## The remote agent

In this example the remote agent is an OVOS travel-guide persona, served by ovos-persona-server at `http://127.0.0.1:8339/a2a` with `CHAT_MEMORY=transparent`. [Your OVOS Persona as an Agent Other Agents Can Call](https://blog.openvoiceos.org/posts/2026-10-20-persona-as-an-agent) shows how to start it. Any other A2A agent works the same way.

## An OVOS persona answers through the agent

```bash
uv pip install --prerelease=allow ovos-a2a-solver-plugin ovos-persona
```

The persona lists the plugin id, `ovos-a2a-solver`, as its handler. `agent_url` is the part of the URL before `/.well-known/agent-card.json`:

```python
from ovos_bus_client.session import Session
from ovos_persona import Persona
from ovos_plugin_manager.templates.agents import AgentMessage, MessageRole

persona = Persona("remote guide", {
    "name": "remote guide",
    "handlers": ["ovos-a2a-solver"],
    "ovos-a2a-solver": {"agent_url": "http://127.0.0.1:8339/a2a", "timeout": 60},
})
session = Session("kitchen")
for question in ["Name one thing to see in Évora.", "How old is it?"]:
    answer = persona.chat([AgentMessage(role=MessageRole.USER, content=question)], session)
    print(f"{question} -> {answer}")
```

```text
Name one thing to see in Évora. -> The Roman Temple of Évora (Templo Romano de Évora), often called the Temple of Diana.This first-century structure is one of the best-preserved Roman ruins on the Iberian Peninsula, with remaining granite columns and a marble base.It stands in the city's historic center.
How old is it? -> The Roman Temple of Évora dates to the 1st century AD, making it roughly 2,000 years old.Some scholars place construction around the 1st to 3rd centuries, built during the Roman period when the city was known as Liberalitas Julia.
```

The answers vary from run to run, because the remote persona uses a language model. The sentences have no space between them. That comes from the remote server: its A2A answer already joins them that way, and the plugin returns the text it receives.

The second question works because the plugin keeps the A2A `contextId` that the agent assigned to the session `kitchen`. On a device, put the same settings in a persona file under `~/.config/ovos_persona/`, and ovos-core asks the agent when you talk to that persona.

## A HiveMind hub answers through the agent

```bash
uv pip install --prerelease=allow hivemind-core hivemind-a2a-agent-plugin
```

Select the plugin in `~/.config/hivemind-core/server.json`:

```json
{
  "agent_protocol": {
    "module": "hivemind-a2a-agent-plugin",
    "hivemind-a2a-agent-plugin": {"agent_url": "http://127.0.0.1:8339/a2a", "timeout": 60}
  },
  "network_protocol": {"hivemind-websocket-plugin": {}}
}
```

Add a client and start the hub. The log names the plugin:

```bash
hivemind-core add-client --name kitchen-sat --access-key kitchen-key \
    --password 'Correct-Horse-Battery-77' --allow recognizer_loop:utterance
hivemind-core listen
```

```text
hivemind_core.service:run:441 - INFO - Agent protocol: A2AAgentProtocol
hivemind_a2a_agent_plugin:__post_init__:99 - INFO - A2AAgentProtocol: configured for A2A agent at http://127.0.0.1:8339/a2a
```

A client asks with a HiveMind `QUERY` that carries the utterance. The plugin's README has the full client script, built on hivemind-bus-client. The hub answered with `speak` messages:

```text
The Roman Temple of Évora (Templo de Diana), a well-preserved 1st-century Roman temple with Corinthian columns, in the city center.
```

## When the agent cannot answer

When the agent is down, the persona plugin logs the error and returns no answer. On a device, the persona service then speaks its error dialog. With `ovos-solver-failure-plugin` (`uv pip install --prerelease=allow ovos-solver-failure-plugin`) as a second handler, the persona answers with one of that plugin's three lines instead, chosen at random. One run answered:

```text
404 brain not found
```

The HiveMind plugin answers with an error sentence, so a client that sends a `QUERY` is never left waiting:

```text
Error validating A2A agent at http://127.0.0.1:1: could not fetch or parse its agent card (Network communication error fetching agent card from http://127.0.0.1:1/.well-known/agent-card.json: All connection attempts failed)
```

## Limits

- The hub answers `QUERY` messages only. A voice satellite and `hivemind-client terminal` send the utterance as a `BUS` message. The hub forwards it and the plugin does not answer it.
- A2A has no encryption of its own. Use an `https://` `agent_url` for an agent on another machine, and the `auth_header` setting when the agent asks for a token.
- The plugins send only the newest user message. The remote agent must keep the history of each conversation itself.

Report issues on [ovos-a2a-agent-plugin](https://github.com/OpenVoiceOS/ovos-a2a-agent-plugin/issues) or [hivemind-a2a-agent-plugin](https://github.com/JarbasHiveMind/hivemind-a2a-agent-plugin/issues).

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
