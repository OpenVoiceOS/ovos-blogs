---
title: "OVOS Is a Voice Operating System — and Now It Has a Written ABI"
excerpt: "The OVOS architecture repository is a set of formal, implementation-agnostic specifications for how a voice OS's components talk to each other: 20 specs covering the intent stack, the bus and sessions, the pipeline, audio, GUI, and media. Written in RFC-2119 language, so 'correct' stops being a matter of opinion."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-12-02T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## OVOS Is a Voice Operating System — and Now It Has a Written ABI

Most voice assistants are products: you ask a question, they answer, and how they do it stays a black box. OpenVoiceOS calls itself a **voice operating system**, not a voice assistant, and the [**OVOS architecture repository**](https://github.com/OpenVoiceOS/architecture) now writes down exactly what that means. It is the ABI of the platform: the documented contract that lets independent components — skills, satellites, orchestrators — talk to each other without knowing anything about each other's internals.

A voice OS defines the boundary between what a user says and the computation that runs. It arbitrates which application handles each utterance, manages conversation state across turns, and gives third-party applications a stable interface to run against. Until now, that interface lived only in code. The architecture repo makes it a document.

---

## Why it matters: the OS analogy holds point for point

| Operating system | Voice OS equivalent |
|---|---|
| Process scheduler | Pipeline plugin ordering |
| IPC / message passing | The bus and the MSG-1 envelope |
| Shared memory | The session carrier |
| Process supervision | The handler-lifecycle trio |
| Loadable kernel modules | Pipeline and transformer plugins |
| System-call ABI | The `match(utterances, lang, session) → Match` contract |

Because there is a stable ABI, OVOS is a runtime, not a monolith. You can swap the scheduler (pipeline ordering), the NLU engines (pipeline plugins), the dialogue policy (converse and context), or the output layer (TTS, display), in any combination, and everything else keeps working. A skill written against the intent stack runs on any conformant orchestrator, under any pipeline configuration, in any supported language.

---

## What shipped: 20 specifications

The repository holds 20 specifications, grouped by the subsystem they govern. Each has a stable ID, a version, and normative text:

- **The intent stack** — `INTENT-1` (sentence template grammar), `INTENT-2` (locale resource formats), `INTENT-3` (intent definition), `INTENT-4` (intent and entity registration). This is how a skill declares what it understands.
- **Bus and session** — `MSG-1` (the bus message envelope), `SESSION-1` (the session carrier wire shape), `SESSION-2` (session lifecycle and state ownership), `BRIDGE-1` (bus bridging and opaque relay). This is how components talk and how state travels with a conversation.
- **The pipeline** — `PIPELINE-1` (the utterance lifecycle), plus the plugins that live in it: `TRANSFORM-1`, `CONTEXT-1`, `CONVERSE-1`, `STOP-1`, `PERSONA-1`, `FALLBACK-1`, `COMMON-QUERY-1`. This is how an utterance becomes an action.
- **Audio and display** — `AUDIO-IN-1` (audio input), `AUDIO-1` (audio output), `GUI-1` (the display subsystem).
- **Media** — `OCP-1`, the OVOS Common Playback virtual media player.

Splitting the spec this way keeps each contract scoped. You can implement `STOP-1` correctly without reading the whole platform, and someone auditing your stop behaviour knows exactly which document is the referee.

The specs are written in **RFC-2119 language** — the MUST / SHOULD / MAY vocabulary standards bodies use so "correct" is not a matter of opinion. When a spec says a component MUST emit an event, an implementation that skips it is not making a reasonable alternative choice. It is wrong, and the spec is the evidence.

Every spec in the repository is currently at **Draft** status. Draft here still means **prescriptive**: where an implementation diverges from the text, that is treated as an implementation bug, not a defect in the spec. Draft signals "we may still revise the wording," not "this is optional."

---

## Not the same as the message models

There is a separate OVOS effort, [ovos-pydantic-models](https://github.com/OpenVoiceOS/ovos-pydantic-models), that specifies what each bus message looks like — the exact fields of a `speak` or a `recognizer_loop:utterance` payload. The architecture specs cover the other half: how components behave — how the pipeline orders work, how a session propagates, how a stop cascades. Payload shape versus runtime behaviour, deliberately kept as two separate bodies of work.

---

## How to use it

Read the specs at [github.com/OpenVoiceOS/architecture](https://github.com/OpenVoiceOS/architecture). If you maintain a skill, check it against `INTENT-1` through `INTENT-4`. If you are building a satellite, a bridge, or a competing orchestrator, `MSG-1`, `SESSION-1`, and `PIPELINE-1` are the contracts to implement against. Where your implementation and the spec disagree, that is a bug report against your code, not a request to change the document.

An unwritten platform cannot be reimplemented, cannot be conformance-tested, and cannot be trusted to stay stable as the code underneath it changes. Writing the ABI down fixes all three: skill authors get guarantees that hold across releases, and OVOS gets a definition of "correct" that lives outside any one codebase.

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
