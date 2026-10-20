---
title: "Answer From Your Own Documents, Fully Local"
excerpt: "An OVOS persona can answer from your own notes and manuals through a memory plugin. The index is a SQLite file on your machine, and no vector database is necessary."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Answer From Your Own Documents, Fully Local

The `lexical` backend of [ovos-memory-plugins](https://github.com/OpenVoiceOS/ovos-memory-plugins) indexes your documents in a local SQLite full-text index. For each question, it adds the matching passages to the prompt of an OVOS persona.

### Why it matters

A chat model knows nothing about your bakery's opening hours, your boiler manual or your family's routines. Retrieval-augmented generation (RAG) fixes that: find the right passage, then let the model answer from it. Most RAG setups need an embedding model and a vector database. For a home assistant with a few dozen documents, a BM25 keyword index in one SQLite file does the job, with no extra service and an index that never leaves the machine.

### Install and index

```bash
pip install --pre ovos-persona ovos-memory-plugins ovos-openai-plugin
```

We indexed one small document, `bakery.md`:

```markdown
# Pixel Bakery opening hours
The Pixel Bakery on Rua Augusta opens at 07:15 and closes at 14:30 from Monday to Saturday.
It is closed on Sundays. The house speciality is the cardamom bun.
```

```python
from ovos_memory_plugins.lexical import LexicalMemory

mem = LexicalMemory(config={"db_path": "~/docs.db"})
mem.store(open("bakery.md").read(), session_id="docs", metadata={"source": "bakery.md"})
mem.close()
```

### Point a persona at the index

The persona file names the memory plugin and the same database. The plugin expands `~` to your home directory:

```json
{
  "name": "librarian",
  "handlers": ["ovos-chat-openai-plugin"],
  "ovos-chat-openai-plugin": {
    "api_url": "https://llama.smartgic.io/v1",
    "key": "sk-none",
    "model": "qwen2.5:7b",
    "allow_system_prompts": true,
    "system_prompt": "Answer in at most twenty words."
  },
  "memory_module": "ovos-memory-plugin-lexical",
  "ovos-memory-plugin-lexical": {
    "db_path": "~/docs.db",
    "retrieval": {"max_num_results": 3}
  }
}
```

Two questions to the persona, with a small demo model behind it:

```text
Q When does the Pixel Bakery close on Saturday?
A The Pixel Bakery closes at 14:30 on Saturdays.
Q What is the house speciality at the Pixel Bakery?
A The house specialty at the Pixel Bakery is the cardamom bun.
```

The demo model runs on a community server. Set `api_url` to a chat server on your own machine, and nothing leaves it.

### The setting that makes it work

`ovos-chat-openai-plugin` removes system messages unless `allow_system_prompts` is `true`. The memory adds the passages as a system message. We asked the same two questions with the persona above and the setting off:

```text
Q When does the Pixel Bakery close on Saturday?
A I don't have information about a specific "Pixel Bakery".Can you provide more context or details?
Q What is the house speciality at the Pixel Bakery?
A I couldn't find any information on a "Pixel Bakery".It's possible it's a fictional or non-existent location.
```

The log says `dropped 1 system message(s) before the request` when the setting is off. With the setting on, the answers are the ones above. As an alternative, set `inject_mode` to `user` in the memory section. The memory then adds the passages to the user message, the plugin keeps it, and the answers are correct with the setting off.

### Limits

- BM25 matches words, not meaning. A question with other words than the document can miss. The `local-rag` backend uses embeddings, and a `composite` memory merges both.
- The `lexical` backend also stores every exchange in the same index, and by default it recalls from all sessions. Setting `scope` to `session` keeps the exchanges apart, but it also hides the documents indexed under `docs`, because a search then finds only what is stored under the id of the caller's session. With several users, store each document under the `session_id` of every user who needs it. Or keep shared documents in a vector store on `ovos-persona-server`, and read it with the read-only `ovos-openai-rag-memory-plugin`.
- These features are on the prerelease channel, so the install needs `--pre`.

### Read more and report issues

- [Answer from your own documents](https://openvoiceos.github.io/beta-technical-manual/persona-local-documents/) in the technical manual, with every step
- [ovos-memory-plugins issues](https://github.com/OpenVoiceOS/ovos-memory-plugins/issues)

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
