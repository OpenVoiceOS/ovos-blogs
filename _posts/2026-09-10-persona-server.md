---
title: "Install ovos-persona-server and Talk to It"
excerpt: "One process serves any OVOS persona over the OpenAI chat API, and speaks A2A, MCP and UTCP beside it. This is the install, a persona file, and one real round trip with the official OpenAI SDK."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-09-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Install ovos-persona-server and Talk to It

[`ovos-persona-server`](https://github.com/OpenVoiceOS/ovos-persona-server) is one process that serves an OVOS persona to anything that speaks the OpenAI chat API. A persona is a JSON file naming a chain of handler plugins. The model behind it can be any OpenAI-compatible endpoint or a local GGUF, or there can be no model at all, since plugins such as wordnet and rivescript answer without one. The same process exposes the persona as an A2A agent and its tools over UTCP and MCP. It also carries Ollama, Cohere, Anthropic, Gemini, Bedrock and TGI shaped routes for clients written against those SDKs.

This is the entry post: install it, write a persona, talk to it. The deeper surfaces have their own posts: the A2A bridge, tool plugins over UTCP and MCP, the OpenAI-compatible routes across the speech servers, and the agentic loops.

## Install

```bash
uv pip install --prerelease=allow 'ovos-persona-server[a2a,mcp]' ovos-openai-plugin ovos-solver-failure-plugin
```

The `a2a` extra brings `a2a-sdk`, the `mcp` extra brings `fastmcp`. A `rag` extra adds files, vector stores and search. It needs a text-embeddings plugin such as `ovos-gguf-plugin`, which runs fully offline with `all-MiniLM-L6-v2`. The run below is version 0.17.8a2.

## A persona file

```json
{
  "name": "livebot",
  "solvers": ["ovos-chat-openai-plugin", "ovos-solver-failure-plugin"],
  "ovos-chat-openai-plugin": {"api_url": "https://llm.openvoiceos.pt/v1", "key": "none", "model": "big-pickle"}
}
```

`api_url` is any OpenAI-compatible endpoint, here the project's own gateway. A local llama.cpp or Ollama server works the same way. The failure plugin at the end of the chain answers when the model does not.

```bash
ovos-persona-server --persona livebot.json --port 8337 --a2a-base-url http://127.0.0.1:8337/a2a --mcp
```

## One round trip

The official OpenAI SDK (3.11.0), pointed at the server, in a fresh environment:

```python
import openai
c = openai.OpenAI(base_url="http://127.0.0.1:8337/openai/v1", api_key="none")
print([m.id for m in c.models.list().data])
r = c.chat.completions.create(model="livebot",
    messages=[{"role": "user", "content": "Reply with exactly the word PONG and nothing else."}])
print(r.choices[0].message.content)
chunks = [ch.choices[0].delta.content or "" for ch in c.chat.completions.create(
    model="livebot", messages=[{"role": "user", "content": "Count from 1 to 3, digits only, space separated."}],
    stream=True)]
print(len(chunks), "".join(chunks))
```

```
['livebot']
PONG
3 1 2 3
```

The persona is the model id. One process can hold several personas, and the `model` field of the request picks one. On the same server, `/openai/v1/files` and `/openai/v1/vector_stores` answer 200, `/tools/manual` returns the UTCP manual of every installed toolbox, and `/a2a/.well-known/agent-card.json` returns the persona's agent card. The A2A, UTCP and MCP posts show those round trips.

## Limits

- `tool_choice="required"` answers 422. The engine contract cannot force a tool call.
- Embeddings, file search and vector stores need an embeddings plugin. Without one, `/openai/v1/embeddings` answers 501, as it did in this run.
- History is the client's by default. `CHAT_MEMORY=transparent` makes the server hold it per caller, keyed by the `user` field or the A2A `context_id`. On a server with several callers the retrieval memory backends recall across callers. That scope is under decision.
- Versions before 0.17.6a1 skipped server memory on the tool-capable chat branch, answered 307 on `/openai/v1/files` and `/vector_stores`, and surfaced an upstream 401 as a 500. Install the latest alpha.

Bugs and questions go to the [issue tracker](https://github.com/OpenVoiceOS/ovos-persona-server/issues).

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
