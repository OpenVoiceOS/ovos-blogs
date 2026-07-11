---
title: "Point Your OpenAI Code at Your Own Voice Stack"
excerpt: "The OVOS speech servers now speak OpenAI (and MaryTTS). Keep your existing code, swap the base URL, and run speech-to-text, text-to-speech, and chat locally and private."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-09-30T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Point Your OpenAI Code at Your Own Voice Stack

A lot of software already knows how to talk to one company's cloud. It calls `openai.audio.speech.create(...)` to synthesize a voice, `openai.audio.transcriptions.create(...)` to turn speech into text, and `openai.chat.completions.create(...)` to reason over it. That code works fine, right up until you remember that every word of audio and every private document is leaving your machine.

What if you kept all of that code, changed one line, and pointed it at **your own** self-hosted, offline voice stack instead?

That is what these releases do. The OVOS speech servers now expose **drop-in OpenAI-compatible** HTTP endpoints — and, for TTS, **MaryTTS-compatible** ones too — as part of the **Third-Party Server Compatibility** work.

---

## What's Compatible Now

The idea is small: the OVOS servers act as a compatible *front-end* to local plugins. Your app thinks it is talking to a cloud API. It is really talking to a local Piper voice, a local Whisper model, or your own persona running on hardware you control.

| OVOS Server | Compatible API Surface | PR |
|-------------|------------------------|----|
| `ovos-tts-server` | OpenAI `audio.speech` | [#88](https://github.com/OpenVoiceOS/ovos-tts-server/pull/88) |
| `ovos-tts-server` | MaryTTS `/process`, `/voices`, `/locales` | [#94](https://github.com/OpenVoiceOS/ovos-tts-server/pull/94) |
| `ovos-stt-http-server` | OpenAI `audio.transcriptions` (and `audio.translations`) | [#77](https://github.com/OpenVoiceOS/ovos-stt-http-server/pull/77) |
| `ovos-persona-server` | OpenAI `chat.completions`, `embeddings`, `files`, vector stores | [#11](https://github.com/OpenVoiceOS/ovos-persona-server/pull/11) |
| `ovos-openai-plugin` | RAG memory built on the persona-server vector-store API | [#54](https://github.com/OpenVoiceOS/ovos-openai-plugin/pull/54) |

The `ovos-tts-server` OpenAI route mounts `/openai`, so its `audio.speech` endpoint lands at `/openai/v1/audio/speech`. The MaryTTS router is deliberately available both under `/marytts` and at the bare `/process` path, because real MaryTTS clients — including Home Assistant's `marytts` integration and `ovos-tts-plugin-marytts` — hardcode the root path and cannot be pointed at a sub-prefix.

Alongside the compatible surfaces, the servers picked up a large set of vendor backends, so you can mix and match behind the same client-facing API. `ovos-stt-http-server` grew dedicated routers for **Deepgram, Google, AssemblyAI, Azure, AWS Transcribe, IBM Watson, Wit.ai, Speechmatics, Vosk, Kaldi, and Whisper.cpp**; `ovos-tts-server` added an **ElevenLabs**-compatible router next to the OpenAI and MaryTTS ones, while the audio itself is rendered by whatever OVOS TTS plugin you load (Piper and friends). Pick a cloud vendor when you want one, keep everything local when you don't. The client code never has to know which it is.

---

## Show Me the Code

Here is the whole point in one snippet. This is ordinary `openai` SDK code. The only thing that changed is `base_url`.

```python
from openai import OpenAI

# Point the SDK at your local OVOS speech servers.
# The API key is ignored by the local servers — nothing leaves your network.
tts = OpenAI(base_url="http://localhost:9666/openai/v1", api_key="local")
stt = OpenAI(base_url="http://localhost:8080/v1", api_key="local")

# --- Text to speech (served by a local Piper voice) ---
speech = tts.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="Hello from my own private voice stack.",
)
speech.stream_to_file("hello.wav")

# --- Speech to text (served by a local Whisper model) ---
with open("hello.wav", "rb") as audio:
    result = stt.audio.transcriptions.create(
        model="whisper-1",
        file=audio,
    )
print(result.text)
```

For the reasoning layer, `ovos-persona-server` speaks `chat.completions`, so agent frameworks that expect OpenAI can drive a fully local persona:

```python
llm = OpenAI(base_url="http://localhost:8337/openai/v1", api_key="local")

reply = llm.chat.completions.create(
    model="ovos-persona",
    messages=[{"role": "user", "content": "What's the weather like?"}],
)
print(reply.choices[0].message.content)
```

The persona server is not OpenAI-only. It mounts parallel routers for **Ollama**, **Cohere**, **Anthropic**, **Gemini**, **AWS Bedrock**, and **HuggingFace TGI**, each under its own prefix (`/ollama/api/...`, `/cohere/v1/...`, `/anthropic/v1/...`, and so on). One process can answer clients written against several different vendor SDKs at once, all backed by the same local persona.

---

## Retrieval Without the Cloud

The same persona server also implements the OpenAI **files** and **vector-store** endpoints (`/openai/v1/files`, `/openai/v1/vector_stores`), which is what makes local RAG possible. Upload documents, let the server chunk and embed them with an OVOS embeddings plugin, and search them — all on your own box.

`ovos-openai-plugin` ships `PersonaServerRAGMemory` to close the loop. It is an OVOS persona *memory* plugin: before each turn it searches a persona-server vector store and injects the retrieved chunks into the conversation, then hands off to the persona's normal chat backend to write the answer. RAG composes with any chat engine instead of owning the round-trip. Everything is configurable from the persona's JSON block — how many results to retrieve, a minimum score to drop weak hits, whether to query on the latest utterance or fold in prior turns, and whether the context lands in the system prompt, a developer message, or a tool call:

```json
{
  "name": "kb-assistant",
  "solvers": ["ovos-chat-openai-plugin"],
  "memory_module": "ovos-openai-rag-memory-plugin",
  "ovos-openai-rag-memory-plugin": {
    "api_url": "http://localhost:8337/openai/v1",
    "vector_store_id": "vs_...",
    "retrieval": {"max_num_results": 5, "query_mode": "history"},
    "inject_mode": "system"
  }
}
```

A private knowledge base, a local chat model, and OpenAI-shaped clients in front of both — with no document ever leaving the network.

---

## Why This Matters

- **Privacy by default.** Audio, transcripts, and documents stay on your network. The endpoint your app talks to is on `localhost`.
- **Offline.** No internet round-trip, no rate limits, no surprise outages. Your voice stack keeps working on a train, a boat, or an air-gapped lab.
- **No lock-in.** The API surface is a shared shape, not a leash. Point the same client at OVOS today, a cloud vendor tomorrow, and back again — by changing a URL.
- **Drop-in migration.** Existing OpenAI-SDK apps adopt your private stack with a one-line diff, not a rewrite.

Open, user-controlled voice technology only works if it meets people where they already are. A great deal of software already speaks OpenAI. Now it can speak to OVOS instead — privately, and on your own terms.

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
