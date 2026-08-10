---
title: "Your Assistant Remembers: Long-Term and Local-First Memory for OVOS Personas"
excerpt: "ovos-memory-plugins gives OVOS personas a memory: rolling LLM summarization for the gist of long chats, fully on-device RAG for exact recall, plus lightweight keyword, recency, entity, and ensemble backends — all behind one config key, all able to run without touching the cloud."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-08-05T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Your Assistant Remembers

A voice assistant is stateless by default. Ask about the weather, get an answer, move on — next time you speak, nothing you said before is remembered. Fine for one-off commands. For a persona you talk to every day, it means no continuity, no sense of who you are, no way to follow up on yesterday's conversation.

In plain terms: right now, if you tell your assistant your dog's name on Monday, it has no idea by Tuesday. With [`ovos-memory-plugins`](https://github.com/OpenVoiceOS/ovos-memory-plugins), that changes. Depending on which memory a persona is set up with, it can recall the gist of a long conversation, look up something you said days ago, or just remember the last few things you said so "and what about tomorrow?" makes sense. Everything runs on the device — nothing about your conversations is sent to a cloud service.

Setting this up today means editing a persona's configuration file, so this post is aimed at people who build or configure OVOS personas, not at end users tapping a settings screen. If you just run OVOS and talk to it, the takeaway is: memory is coming to personas, and it stays local. The rest of this post is for the people wiring that up.

## For persona builders: how it works

[`ovos-memory-plugins`](https://github.com/OpenVoiceOS/ovos-memory-plugins) is a bundle of memory backends that plug into [`ovos-persona`](https://github.com/OpenVoiceOS/ovos-persona) through one well-defined seam. A persona activates exactly one backend with a single line of JSON.

### How to try it

Install the package, pick a backend, and add its `memory_module` key to a persona's JSON file:

```bash
pip install ovos-memory-plugins
```

```json
{
  "name": "MyAssistant",
  "solvers": ["ovos-solver-openai-plugin"],
  "memory_module": "ovos-memory-plugin-recency"
}
```

Drop the file in your `ovos-persona` personas directory and the persona starts remembering the last few turns — no models, no extra setup. The sections below cover the other backends, and what to configure for each.

### The seam: one small contract

A memory plugin does not answer questions. The persona still owns the chat engine and any tools; the memory plugin owns **conversation state and context assembly**. Each backend is an `AgentContextManager` from `ovos-plugin-manager`, registered under the `opm.agents.memory` entry-point group, and the whole contract is three methods (`ovos_plugin_manager.templates.agents`):

```python
get_history(session_id) -> List[AgentMessage]
update_history(new_messages, session_id) -> None
build_conversation_context(utterance, session_id) -> List[AgentMessage]
```

Before every turn, the persona calls `build_conversation_context`, sends the returned message list to the chat engine, then calls `update_history` with the new exchange. Two invariants hold for every backend: the first message may be a `system` message carrying the persona's base prompt, and the last message is always the current user utterance. Because the interface is this narrow, backends are interchangeable — swap recall strategies without touching the persona.

### Long-term summarization

`ovos-memory-plugin-longterm` keeps a compact running summary of a long conversation. Every `summarize_every` exchanges (default 6), it sends the oldest turns to an OpenAI-compatible **chat** endpoint, replaces those turns with the returned summary, and keeps only the last `recent_window` exchanges verbatim. The next turn's context is: system prompt, then rolling summary, then the recent verbatim turns, then the utterance.

```
Session store (JSON or SQLite)
  rolling_summary  <- LLM summarizes every N exchanges
  recent_window    <- last few exchanges, verbatim
```

This trades exact recall for a bounded, cheap-to-carry context — the gist of a long chat instead of every word. The endpoint is just a URL, so point it at a local `llama.cpp` or Ollama server and the summarization never leaves your machine:

```json
{
  "memory_module": "ovos-memory-plugin-longterm",
  "ovos-memory-plugin-longterm": {
    "api_url": "http://localhost:8000/v1",
    "model": "mistral",
    "summarize_every": 8,
    "recent_window": 4,
    "backend": "sqlite",
    "db_path": "~/.local/share/ovos/assistant_memory.db"
  }
}
```

### Local-first RAG

When the assistant needs to recall a specific fact rather than a gist, use `ovos-memory-plugin-local-rag`. It stores every exchange as an embedding in a vector store and, at query time, retrieves the top-k most semantically similar past turns and injects them as context — so relevant history surfaces without the entire transcript overflowing the context window.

"Local" is the point: retrieval runs entirely in-process. The plugin loads an OVOS text-embeddings plugin and an `EmbeddingsDB` plugin directly — no HTTP, no API key. The `local-rag` extra pulls a default offline stack of `ovos-gguf-embeddings-plugin` (a LaBSE GGUF embedding model) and `ovos-chromadb-embeddings-plugin` (a persistent on-disk vector store), so everything — the embedding and the search — stays on the device. An earlier server-coupled HTTP variant was removed outright (PR #9) in favor of this local-first design.

```json
{
  "memory_module": "ovos-memory-plugin-local-rag",
  "ovos-memory-plugin-local-rag": {
    "embeddings_plugin": "ovos-gguf-embeddings-plugin",
    "embeddings_db_plugin": "ovos-chromadb-embeddings-plugin",
    "embeddings_db_config": {"path": "~/.local/share/ovos/local_rag_db"},
    "retrieval": {"max_num_results": 5, "min_score": null}
  }
}
```

Retrieved chunks can be woven into the conversation via `inject_mode`: a separate `system` message (the default, which keeps the base prompt stable and cacheable), folded into the system prompt, prepended to the user turn, or — for tool-calling models — presented as a synthetic `search_memory` tool result. The store, the embedding model, and the injection style are all swappable; point `embeddings_db_plugin` at `ovos-qdrant-embeddings-plugin` and the same retrieval logic runs against a shared Qdrant instead.

### Lighter backends, and an ensemble

Summarization and RAG are the heavyweights. The family also covers cheaper strategies:

- **`ovos-memory-plugin-lexical`** — keyword recall using SQLite's built-in FTS5 index (a full-text search index) and `bm25()` ranking (a formula that scores how well a passage matches search terms). No embeddings, no extra dependencies (`sqlite3` is stdlib), fully offline. Use it when the exact term matters more than the meaning.
- **`ovos-memory-plugin-recency`** — the lightest option: a sliding window of the most recent turns, bounded by count and optionally by age. No LLM, no embeddings.
- **`ovos-memory-plugin-entity`** — durable facts about the user (name, preferences, relationships, goals). After each exchange it asks a local OpenAI-compatible endpoint to extract short fact lines and merges them, deduplicated, into a per-session store, then re-injects them every turn. If the endpoint is unreachable, extraction simply no-ops.
- **`ovos-memory-plugin-composite`** — a pure orchestrator that stores nothing itself. It loads several of the above as members, fuses the retriever hits (RAG + lexical) into one deduplicated ranked list via reciprocal-rank fusion (a method for merging several ranked lists by each item's position, not its raw score), folds in the summary and facts from the others, and writes every new exchange through to all of them. A member that fails to load or raises is simply skipped. This is how a persona's single `memory_module` slot combines hybrid recall — semantic, keyword, and durable facts at once.

The overview table in the repo lays out the trade-offs: which backends run fully offline, which need a chat endpoint, and how each persists state.

### One config key

Every backend keys its state by `session_id`, so memory is naturally per-session. In a shared household each person's conversation stays separate, and a guest session carries its own — or an empty — window. The persona resolves the backend and its per-plugin config block by name at load time, the same mechanism used for solver configs. Enabling memory is one key:

```json
{
  "name": "MyAssistant",
  "solvers": ["ovos-solver-openai-plugin"],
  "memory_module": "ovos-memory-plugin-local-rag"
}
```

Nothing else about the persona changes. It just starts remembering — and with a local-first backend, it remembers without anything leaving the device.

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
