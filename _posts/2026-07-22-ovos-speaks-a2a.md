---
title: "OVOS Speaks A2A: A Two-Way Bridge Between Personas and Agents"
excerpt: "The ovos-persona-server can now expose any persona as an Agent2Agent server, while a companion solver plugin lets a persona borrow its reasoning from a remote A2A agent. A third plugin brings the same bridge to HiveMind satellites."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-07-22T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## OVOS Speaks A2A: A Two-Way Bridge Between Personas and Agents

Any OVOS persona can now talk to outside agent frameworks, and borrow reasoning from them too. Three new pieces make OVOS both a server and a client on the [Agent2Agent (A2A)](https://a2a-protocol.org) protocol, an open standard for agent interoperability. A HiveMind topology where some nodes hold local knowledge and others proxy out to cloud reasoning stops being a custom integration and becomes a matter of configuration.

An A2A server publishes a discovery document — the *agent card* — at `GET /.well-known/agent.json`, and accepts work as [JSON-RPC 2.0](https://www.jsonrpc.org/specification) requests, both blocking and streaming over Server-Sent Events. A client needs to know nothing about what runs inside the server: it reads the card, sends a message, and reads the reply.

1. [**`ovos-persona-server`**](https://github.com/OpenVoiceOS/ovos-persona-server) gains an A2A endpoint, so any OVOS persona becomes an A2A agent other tools can call.
2. [**`ovos-a2a-solver-plugin`**](https://github.com/OpenVoiceOS/ovos-a2a-agent-plugin) goes the other way, letting a persona hand its reasoning to a remote A2A agent.
3. [**`hivemind-a2a-agent-plugin`**](https://github.com/JarbasHiveMind/hivemind-a2a-agent-plugin) brings the same client-side bridge to the HiveMind bus, so a satellite can be answered by an external A2A agent.

The first makes OVOS an A2A *server*; the other two make it an A2A *client*. All three are new code, not yet released to PyPI — the install commands below use git until that lands.

---

## Personas as Agents

The persona server already speaks several dialects — it ships an OpenAI-compatible route plus adapters for Anthropic, Gemini, Bedrock, Cohere and TGI. The A2A endpoint joins that list.

It is built on the official [`a2a-sdk`](https://a2a-protocol.org), pulled in through a new optional extra (`a2a-sdk>=0.3.0`). The extra lives on the [`dev` branch](https://github.com/OpenVoiceOS/ovos-persona-server/tree/dev) and has not shipped to PyPI yet, so install straight from git and enable the endpoint by passing a public base URL:

```bash
pip install "ovos-persona-server[a2a] @ git+https://github.com/OpenVoiceOS/ovos-persona-server.git@dev"
ovos-persona-server --persona my_persona.json \
                    --a2a-base-url http://localhost:8337/a2a
```

The A2A adapter is a Starlette application mounted at `/a2a` on the existing FastAPI server (default port `8337`). It exposes two things:

- **`GET /a2a/.well-known/agent.json`** — the agent card, built from the loaded persona. It carries the persona's name, its description (falling back to `OVOS Persona: <name>`), a single `chat` skill ("Multi-turn conversation with an OVOS persona"), text input/output modes, and `capabilities.streaming: true`.
- **`POST /a2a`** — the JSON-RPC task endpoint, handling `message/send` (blocking) and `message/stream` (SSE).

Behind the endpoint sits `OVOSPersonaAgentExecutor`, which delegates each incoming message to the persona. The persona's `stream()` call is synchronous, so it is offloaded with `asyncio.to_thread` to keep the event loop free, and each sentence chunk it produces is emitted as an A2A artifact-update event. Streaming callers see those chunks live over SSE; blocking callers get the same events collected into a final result by the framework. The persona's normal solver chain runs unchanged — the A2A layer is purely a transport in front of it.

```bash
curl http://localhost:8337/a2a/.well-known/agent.json | jq '.name, .capabilities.streaming'
```

Any A2A-aware client — an orchestration framework, another agent, a custom tool — can now discover and drive an OVOS persona without knowing it is OVOS at all.

---

## Agents as Persona Brains

The reverse direction is `ovos-a2a-solver-plugin`, a `ChatEngine` plugin for [ovos-persona](https://github.com/OpenVoiceOS/ovos-persona) — the same engine interface used by local LLM solvers. Instead of running a model, it forwards the conversation to a remote A2A agent and returns the reply.

Two naming details worth being precise about. First, the code lives in the [`OpenVoiceOS/ovos-a2a-agent-plugin`](https://github.com/OpenVoiceOS/ovos-a2a-agent-plugin) repository, but its packaged name (declared in `pyproject.toml`) is **`ovos-a2a-solver-plugin`** — repo and package do not share a name. Second, the name you put in a persona config is its entry point, **`ovos-a2a-solver`** (registered under the `opm.agents.chat` group, class `A2AChatEngine`), which is different again from the package name. The package is not on PyPI yet, so install it from git, then set the entry point as a persona's engine:

```bash
pip install git+https://github.com/OpenVoiceOS/ovos-a2a-agent-plugin.git
```

```yaml
# ~/.config/mycroft/personas/my-a2a-persona.yaml
name: my-a2a-persona
engine: ovos-a2a-solver
engine_config:
  agent_url: "https://my-a2a-agent.example.com"   # required
  auth_header: "Bearer <token>"                    # optional
  timeout: 60                                       # seconds (default 60)
  streaming: false                                  # true → SSE via tasks/sendSubscribe
```

Only `agent_url` is required. `auth_header` is passed through verbatim as the `Authorization` header, `timeout` is the HTTP timeout in seconds, and `streaming` switches the client between the blocking `tasks/send` and the streaming `tasks/sendSubscribe` call — the latter requires the server to advertise `capabilities.streaming: true` on its card.

Note the method names here, `tasks/send` and `tasks/sendSubscribe`, are the older A2A dialect, while the persona-server endpoint above speaks the current spec's `message/send` and `message/stream`. This is not a typo: the persona-server side is built on the official `a2a-sdk`, which speaks current-spec method names, while this plugin ships its own small hand-rolled client that still speaks the older dialect. Both are valid JSON-RPC calls against a server that supports them, but if you point this plugin at a server that only understands the newer method names, the call will fail — check what your target A2A server accepts.

Under the hood the plugin ships a small standalone `A2AClient` that can fetch an agent card and submit tasks on its own, independent of the plugin manager:

```python
from ovos_a2a_solver import A2AClient

with A2AClient("https://my-a2a-agent.example.com") as client:
    card = client.fetch_agent_card()
    print(card.name, card.skills)
    print(client.send_task("Summarise the A2A spec in one sentence."))
```

The persona keeps everything it already owns — wake words, TTS, session state, user management — and simply borrows its reasoning from the remote agent. Each side stays inside its own domain.

---

## HiveMind Satellites Answering via A2A

[`hivemind-a2a-agent-plugin`](https://github.com/JarbasHiveMind/hivemind-a2a-agent-plugin) — hosted under the JarbasHiveMind org rather than OpenVoiceOS, since that's where the rest of HiveMind-core lives — moves that same client bridge down to the HiveMind bus. It registers under the `hivemind.agent.protocol` entry point, so HiveMind-core discovers it once installed, and it is selected as the hive's `agent_protocol`. It is not on PyPI yet, so install it from git:

```bash
pip install git+https://github.com/JarbasHiveMind/hivemind-a2a-agent-plugin.git
```

```json
{
  "hivemind": {
    "agent_protocol": "hivemind-a2a-agent-plugin",
    "a2a_agent": {
      "agent_url": "http://localhost:9999",
      "auth_header": "Bearer secret",
      "timeout": 60,
      "streaming": false
    }
  }
}
```

A satellite — a voice client, a phone, a headless node with no local intelligence of its own — sends an utterance up to the HiveMind master. The plugin forwards it to the configured A2A server as a JSON-RPC `tasks/send` (or `tasks/sendSubscribe`) task, then streams the response back down to the satellite that asked. The end user hears an answer; where the reasoning happened is an infrastructure detail. Any compliant A2A backend — a LangChain agent, a Google ADK service, a custom FastAPI app — can sit behind it.

---

## The Pattern

Put the three together and OVOS sits on both ends of the same protocol, in three flows:

- **Server**: an external A2A client calls the `/a2a` endpoint, which hands the request to an OVOS persona and its existing solver chain.
- **Solver**: an OVOS persona uses `ovos-a2a-solver` to send its reasoning out to a remote A2A agent, then returns that agent's answer.
- **HiveMind**: a HiveMind satellite sends its query up through `hivemind-a2a-agent-plugin`, which forwards it to a remote A2A agent and streams the answer back down.

```
  external A2A client  →  /a2a endpoint  →  OVOS persona  →  its solver chain
                                                                    │
  OVOS persona  →  ovos-a2a-solver  →  remote A2A agent  ───────────┘
  HiveMind satellite  →  a2a-agent-plugin  →  remote A2A agent
```

The same persona can *serve* other agents over A2A and *consume* other agents through it.

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
