---
title: "OVOS Personas That Remember"
excerpt: "A persona keeps a separate memory for each device and each person, and plugins keep facts across restarts. This post shows the setup and the output of real runs."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## OVOS Personas That Remember

An OVOS persona is a named assistant with its own chat engine. A memory plugin decides what the persona remembers: the last turns of a conversation, facts about you, or a summary.

### Why it matters

A voice assistant that forgets your last sentence is hard to talk to. An assistant that tells one family member what another one said is worse. The persona memory solves both. Each conversation has a session id, every device has its own session, and the memory keeps a separate history for each session. With `CHAT_MEMORY=transparent`, the persona server uses the OpenAI `user` field as the session, so each person who calls it gets their own history.

### Remember what you said

`ovos-persona` ships a short-term memory that keeps the last messages of each session in RAM. With `max_history` set to 7, it keeps the last three exchanges and the new question. We ran a small script that sends the bus events `ovos-core` sends around each answer, from two devices:

```text
living-room> My name is Rita. I parked on level 3.
  Hello Rita, your car is parked on Level 3, parking attendant will assist you soon.
living-room> Which level did I park on? Answer with the number only.
  3
garage> Where did I park? If you do not know, say UNKNOWN.
  UNKNOWN. Can you provide more context or details about your vehicle and location?
```

Three exchanges later, the living room had forgotten the level too. That is the window doing its job. The full script is on the [Make a persona remember](https://openvoiceos.github.io/beta-technical-manual/persona-remember/) page of the technical manual.

### One memory per person on a server

`ovos-persona-server` serves personas over the OpenAI and Ollama APIs. Start it with `CHAT_MEMORY=transparent`, and it keeps the history of each caller:

```bash
pip install --pre ovos-persona-server ovos-openai-plugin
CHAT_MEMORY=transparent ovos-persona-server --personas-dir ~/personas
```

The server trusts the `user` value and does not check it, so this setup fits trusted clients only.

Alice and Bob both talked to the persona `ada`, and Alice also asked the persona `bo`. The answers come from the runs on the manual pages:

```text
alice -> ada: Remember this: my cat is called Pixel. Reply only with OK.   OK.
alice -> ada: What is my cat called? Answer with the name only.           Pixel.
bob   -> ada: What is my cat called? If you do not know, say UNKNOWN.     UNKNOWN.
alice -> bo:  What is my cat called? If you do not know, say UNKNOWN.     UNKNOWN.
```

Bob does not get Alice's answer, and each persona keeps its own memory.

### Memory that survives a restart

[ovos-memory-plugins](https://github.com/OpenVoiceOS/ovos-memory-plugins) adds backends that write to disk. `entity` asks the chat model for durable facts about the user and stores them per user in a JSON file. `longterm` keeps a rolling summary. `lexical` and `local-rag` index past exchanges and your own documents. All of them load through the same `memory_module` key in the persona file.

One setting matters for every one of them: `ovos-chat-openai-plugin` removes system messages unless `allow_system_prompts` is `true`, and the memory plugins that recall context add it as a system message by default. Without the setting, the persona answers as if it remembers nothing, and the log says `dropped 1 system message(s) before the request`. The recipes that add recalled context set it. `entity` and `longterm` always send their context as a system message, so they need `allow_system_prompts`. The retrieval memories `lexical`, `local-rag` and `composite` read `inject_mode`. For these three, you can set `inject_mode` to `user` instead, and the memory adds its context to the user message, which the plugin does not remove. A `composite` that includes `entity` or `longterm` still sends their part as a system message, so it needs `allow_system_prompts`.

### Limits

- The short-term memory is in RAM. A restart clears it.
- `max_history` counts messages, not exchanges. In the bus flow, the new question takes one slot, so use an odd number, such as 7. The persona server writes the question and the answer as a pair, so use an even number there.
- Fact extraction and summaries are only as good as the chat model. With a small demo model, `entity` stored the city but lost the cat's name, and a `longterm` summary can drop a detail, because the chat model decides what it keeps.
- The retrieval backends recall from all sessions by default. Set `scope` to `session` when several people share one assistant.
- These features are on the prerelease channel, so the install needs `--pre`.

### Read more and report issues

- [Personas and Memory](https://openvoiceos.github.io/beta-technical-manual/personas-and-memory/) in the technical manual, one page per task
- [ovos-persona](https://github.com/OpenVoiceOS/ovos-persona/issues), [ovos-memory-plugins](https://github.com/OpenVoiceOS/ovos-memory-plugins/issues) and [ovos-persona-server](https://github.com/OpenVoiceOS/ovos-persona-server/issues) issue trackers

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
