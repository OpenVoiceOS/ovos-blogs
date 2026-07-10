---
title: "Every OVOS Bus Message, Now a Typed Model You Can Validate"
excerpt: "ovos-pydantic-models is a machine-readable specification of the OVOS MessageBus: 617 message types, each a Pydantic model with validated fields. Build a message and get it right, or receive one and check it — before a malformed payload becomes a mystery bug three services away."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-11-11T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Every OVOS Bus Message, Now a Typed Model You Can Validate

The message bus is the nervous system of an OVOS device. The listener puts an utterance on it; the intent pipeline picks it up; a skill answers; the audio stack speaks. Every one of those hand-offs is a message — a `message_type` string, a `data` payload, and a `context`. For years, the only way to know what any given message actually *contained* was to read the code that emitted it. What fields does `speak` carry? Is `lang` required? Does `recognizer_loop:utterance` hold a string or a list? The answers lived in handlers scattered across a dozen repositories, learned by grep and by getting it wrong.

[**ovos-pydantic-models**](https://github.com/OpenVoiceOS/ovos-pydantic-models) replaces that folklore with something you can import. It is a typed Pydantic v2 model for every message that flows over the OVOS MessageBus — the package's own words are worth quoting: *"the authoritative, machine-readable specification of the OVOS MessageBus protocol."* Not prose about the bus. The bus, written down as code that runs.

---

## What "machine-readable specification" actually buys you

A specification you can only read is a specification you can drift away from. A specification you can *execute* keeps you honest. Because each message type is a real Pydantic model, the same definition does four jobs at once: it type-checks your code, it serializes and deserializes payloads, it generates documentation, and it validates messages in integration tests. One source of truth, four uses, no copies to fall out of sync.

The coverage is not a token sample. The package ships **617 message-type models**, organized by the subsystem that owns them:

- **Listener / STT** — `RecognizerLoopUtteranceMessage`, `RecognizerLoopWakeWordMessage`, the `recognizer_loop:state.*` trio, `MycroftMicMuteMessage`, `OpmWwQueryMessage`.
- **Intent pipeline** — `add_context` / `remove_context` / `clear_context`, the fallback register/ping/pong set, `skill.converse.*`, `stop:global` and `stop:skill`, `CompleteIntentFailureMessage`.
- **Audio / TTS** — `SpeakMessage`, the `mycroft.audio.service.*` transport controls, the `ovos.languages.tts` query/response pair.

Each model carries the same three-part envelope — `message_type`, `data`, `context` — and each `data` shape is itself a typed model, so the fields inside a payload are specified too, not just the message name.

---

## Using it

Constructing a message is the part where mistakes usually happen quietly. Here they happen loudly, at the moment you make them:

```python
from ovos_pydantic_models import SpeakMessage, SpeakData

# Build a message — the fields are typed, so a wrong shape raises immediately
msg = SpeakMessage(data=SpeakData(utterance="Hello, world!", lang="en-us"))

print(msg.message_type)     # "speak"
print(msg.model_dump())     # {"message_type": "speak", "data": {...}, "context": {...}}
```

And the other direction — validating something that arrived over the wire, where you have the least control over what you're handed:

```python
from ovos_pydantic_models import RecognizerLoopUtteranceMessage

raw = {"message_type": "recognizer_loop:utterance",
       "data": {"utterances": ["play some jazz"], "lang": "en-us"}}

msg = RecognizerLoopUtteranceMessage.model_validate(raw)
print(msg.data.utterances)   # ["play some jazz"]
```

If a required field is missing or a type is wrong, Pydantic raises a `ValidationError` that names the exact field and the exact problem — at the boundary, where it is cheap to fix, instead of ten stack frames downstream where it looks like something else's bug. There is no single generic `Message` catch-all doing loose duck-typing: each of the 617 types is its own model, which is precisely what makes the errors specific.

---

## How the index was built — and why it's beta

Six hundred and seventeen models is more than anyone wants to hand-curate, and hand-curation is exactly how you miss the message that only appears in one skill's emit call. So the inventory wasn't written from memory — it was **discovered from the code itself**. We parsed the abstract syntax tree (AST) of the entire OVOS repository set — nearly two hundred repos — walking each codebase to find every place a bus message is emitted or consumed, so that "what messages exist?" is answered by the source, not by recollection. Each message type that turned up was then **auto-documented with an LLM**, which drafted the field descriptions and model scaffolding from the surrounding code.

That pipeline is what makes 617 models tractable, and it's also why we label the result honestly: **the index is beta until a human reviews it.** AST discovery finds messages a person would forget; LLM drafting fills them in quickly; neither guarantees every field description is right. The models are structurally usable today — they validate real payloads — but individual entries get promoted from "generated" to "reviewed" as maintainers work through them. We would rather ship a complete, clearly-marked-beta index than a small, hand-blessed one that silently omits half the bus.

A follow-up [coverage pass (PR #9)](https://github.com/OpenVoiceOS/ovos-pydantic-models/pull/9) shows the method in action: it scanned the repositories for messages that were flowing in the wild but still had no model, and added roughly forty of them — stop events, pipeline lifecycle messages, and parts of the PHAL hardware-abstraction surface that had been undocumented. The goal is not "most of the bus." It is the whole bus, so that a model failing to exist is a bug to file, not a shrug.

---

## Where this sits

One clarification worth making, because it's easy to assume otherwise: this is *not* the same thing as the [OVOS Formal Specifications](https://github.com/OpenVoiceOS/architecture). Those specs describe how components *behave* — how the pipeline orders plugins, how a session is carried, how a stop propagates — the runtime contract, in RFC-2119 language. ovos-pydantic-models describes what the messages themselves *look like* — the data shapes on the wire. Behaviour versus payload; two complementary efforts, deliberately kept separate. If you're implementing a skill or a plugin, you'll usually reach for the message models; if you're re-implementing an orchestrator, you'll want both.

## Why it matters

For a skill or plugin author, this turns "what does this message look like?" from an archaeology project into an import statement — and turns a malformed payload from a silent, far-away failure into an immediate, named error. For anyone building a *compatible* implementation — a bridge, an alternate client, a satellite — it is a concrete target you can validate yourself against instead of guessing from behaviour. And for OVOS itself, it is groundwork: you cannot confidently evolve a protocol you cannot precisely describe, and now the description is 617 models deep and runs on every import.

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
