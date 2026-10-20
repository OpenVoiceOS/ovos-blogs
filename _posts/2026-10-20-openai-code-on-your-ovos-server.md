---
title: "Point Your OpenAI Code at Your Own OVOS Server"
excerpt: "Code written for the OpenAI SDK runs against ovos-persona-server: chat, function calling with your own tools, embeddings, files and vector stores. Change base_url and keep the rest. Every output below came from a real run."
coverImage: "/assets/blog/protocol_interoperability/thumb.png"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAI
  picture: "https://avatars.githubusercontent.com/u/33701864"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/protocol_interoperability/thumb.png"
---

## Point Your OpenAI Code at Your Own OVOS Server

[`ovos-persona-server`](https://github.com/OpenVoiceOS/ovos-persona-server) answers the OpenAI API with an OVOS persona. Code written for the OpenAI SDK talks to it after one change: `base_url`.

Plain chat is the simple case. This post covers function calling with your own tools, embeddings, files and vector stores, and a persona that answers from your own documents. Each output below is copied from a run of the official `openai` SDK (3.35.1) against `ovos-persona-server` 0.18.7a2. The persona used `ovos-chat-openai-plugin` with `qwen2.5:7b` on an Ollama host.

## Install

```bash
uv pip install --prerelease=allow 'ovos-persona-server[rag]' ovos-openai-plugin ovos-gguf-plugin ovos-chromadb-embeddings-plugin
ovos-persona-server --persona llm.json
```

```python
from openai import OpenAI

client = OpenAI(api_key="unused", base_url="http://localhost:8337/openai/v1")
```

The persona name is the model name. `client.models.list()` returned `['llm']`.

## Your own functions, called by the model

The model asks for a call. Your code runs the function and sends the result back. The model writes the answer.

```python
import json

def get_weather(city):
    return {"city": city, "temp_c": 21, "sky": "sunny"}

tools = [{"type": "function", "function": {
    "name": "get_weather", "description": "Current weather for a city",
    "parameters": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]}}}]
messages = [{"role": "user", "content": "What's the weather in Lisbon right now?"}]
first = client.chat.completions.create(model="llm", messages=messages, tools=tools)
call = first.choices[0].message.tool_calls[0]
messages.append(first.choices[0].message.model_dump(exclude_none=True))
messages.append({"role": "tool", "tool_call_id": call.id,
                 "content": json.dumps(get_weather(**json.loads(call.function.arguments)))})
print(client.chat.completions.create(model="llm", messages=messages, tools=tools).choices[0].message.content)
```

```text
The current weather in Lisbon is sunny with a temperature of 21 degrees Celsius.
```

The first reply had `finish_reason` `tool_calls` and the call `get_weather({"city": "Lisbon"})`. Streaming works too: the call arrives as one `tool_calls` delta. `tool_choice="none"` gives a text answer, and a named function forces that function.

## Embeddings, files and vector stores

These calls let an OpenAI client put documents in front of a persona. The server embeds locally with `ovos-gguf-plugin` and `all-MiniLM-L6-v2`, and keeps the vectors in ChromaDB. The [RAG docs](https://github.com/OpenVoiceOS/ovos-persona-server/blob/dev/docs/rag.md) give the configuration.

```python
e = client.embeddings.create(model="x", input=["cats purr", "the moon"])
print(len(e.data), len(e.data[0].embedding))

cats = client.files.create(file=("cats.txt", b"the cat sat on the mat. cats are fluffy animals that purr."),
                           purpose="assistants")
moon = client.files.create(file=("moon.txt", b"the moon orbits the earth and affects ocean tides."),
                           purpose="assistants")
store = client.vector_stores.create(name="kb")
for f in (cats, moon):
    client.vector_stores.files.create(vector_store_id=store.id, file_id=f.id)
hits = client.vector_stores.search(vector_store_id=store.id, query="fluffy animal on a mat")
print([h.filename for h in hits.data])
```

```text
2 384
['cats.txt', 'moon.txt']
```

The best match comes first. `encoding_format="base64"` also works.

## A persona that answers from your documents

`ovos-openai-plugin` ships `ovos-openai-rag-memory-plugin`. Before each turn, it searches a vector store and passes the hits to the chat engine. Set it as the persona's `memory_module`, with `api_url` pointing at the server above and `vector_store_id` from the store you made.

A file in the store said that the office cat is called Bartolomeu. We asked "What is the name of the office cat?":

| Config | Answer |
| :--- | :--- |
| default `inject_mode` (`system`) | `I don't have any information about an office cat. ...` |
| `inject_mode: "user"` | `The name of the office cat is Bartolomeu.` |

The default fails with `ovos-chat-openai-plugin` because that chat engine drops system messages it did not write. Set `inject_mode: "user"`, or `allow_system_prompts: true` in the chat engine config. This is the one setting to get right.

## Other SDKs

The same persona answered "What is the capital of Portugal? One word." with `Lisbon.` through `anthropic`, `ollama`, `google-genai`, `cohere`, `boto3` Bedrock `converse` and `huggingface_hub` `text_generation`. Each SDK only needs its base URL set to the vendor prefix, for example `http://localhost:8337/anthropic`.

## Limits

- `tool_choice="required"` answers 422. The OVOS chat engine contract has no way to force a tool call.
- The Hugging Face `chat_completion` call gets 404. `text_generation` works.
- Tools need a chat engine that supports them. `ovos-chat-openai-plugin` does.
- Deleting a file that is still in a vector store fails in 0.18.7a2. Detach it first with `client.vector_stores.files.delete(...)`.
- In 0.18.7a2, the search `score` is a distance, so a lower value is a closer match. The OpenAI API reports a similarity, where higher is closer. The order of the hits is right.
- The files and vector stores cover what a client needs to test and use retrieval. They are not a document platform.

Report problems on the [ovos-persona-server issue tracker](https://github.com/OpenVoiceOS/ovos-persona-server/issues).

---

### Built in the Open, Funded for the Commons

This work is part of the OpenVoiceOS **From Beta to Breakthrough** milestone, funded through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of [DG Communications Networks, Content and Technology](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en) under grant agreement No [101135429](https://cordis.europa.eu/project/id/101135429). Additional funding is made available by the [Swiss State Secretariat for Education, Research and Innovation](https://www.sbfi.admin.ch/sbfi/en/home.html) (SERI).

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
