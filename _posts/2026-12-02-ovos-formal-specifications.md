---
title: "OVOS Is a Voice Operating System — and Now It Has a Written Protocol Spec"
excerpt: "The OVOS architecture repository is a set of formal, implementation-agnostic specifications for how a voice OS's components talk to each other: 20 specs covering the intent stack, the bus and sessions, the pipeline, audio, GUI, and media. Written in RFC-2119 language, so 'correct' stops being a matter of opinion."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-12-02T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## OVOS Is a Voice Operating System — and Now It Has a Written Protocol Spec

Most voice assistants are products: you ask a question, they answer, and how they do it stays a black box. OpenVoiceOS calls itself a **voice operating system**, not a voice assistant, and the [**OVOS architecture repository**](https://github.com/OpenVoiceOS/architecture) now writes down exactly what that means. It is the wire contract of the platform: the documented rulebook that lets independent components — skills, satellite devices, orchestrators built by different people, on different hardware — talk to each other without knowing anything about each other's internals.

For someone using a voice assistant, this is what makes it possible to mix and match: run a skill written by one developer on a device built by another, swap the app that turns speech into an action, or move your setup to different hardware, and have the pieces keep working together. Until now, the rules for how those pieces cooperate lived only in code scattered across projects. The architecture repo makes it one document.

*The rest of this post is for developers and maintainers building on OVOS — skill authors, satellite/bridge builders, and anyone writing an orchestrator.*

---

## Why it matters: the OS analogy holds point for point

This table maps the spec pieces to familiar operating-system concepts. It's an illustrative comparison, not an exact equivalence — treat it as a way in, not a spec in itself.

| Operating system concept | Voice OS equivalent | In plain terms |
|---|---|---|
| Process scheduler | Pipeline plugin ordering | Decides which piece of software handles what you said, and in what order it's tried |
| IPC / message passing | The bus and the MSG-1 envelope | The shared channel components use to send each other messages |
| Shared memory | The session carrier | The bit of state that travels with a conversation so components stay in sync |
| Process supervision | The handler-lifecycle trio | The rules for starting, tracking, and stopping a request as it's handled |
| Loadable kernel modules | Pipeline and transformer plugins | Swappable building blocks — e.g. the natural-language understanding (NLU) engine that figures out intent, or the text-to-speech (TTS) engine that generates the reply |
| System-call ABI | The `match()` contract every intent handler implements | The fixed shape every plugin must expose so the rest of the system can call it |

Because there is a stable contract, OVOS is a runtime, not a monolith. You can swap the scheduler (pipeline ordering), the NLU engines (pipeline plugins), the dialogue policy (converse and context), or the output layer (TTS, display), in any combination, and everything else keeps working. A skill written against the intent stack runs on any conformant orchestrator, under any pipeline configuration, in any supported language.

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

## How to try it

Read the specs at [github.com/OpenVoiceOS/architecture](https://github.com/OpenVoiceOS/architecture). If you maintain a skill, check it against `INTENT-1` through `INTENT-4`. If you are building a satellite, a bridge, or a competing orchestrator, `MSG-1`, `SESSION-1`, and `PIPELINE-1` are the contracts to implement against.

You don't have to implement the spec machinery from scratch: [**ovos-spec-tools**](https://github.com/OpenVoiceOS/ovos-spec-tools) is a reference implementation with the sentence-template expander, the locale resource loader, the dialog renderer, language matching, and the `ovos-spec-lint` linter. Depend on it instead of reimplementing that plumbing yourself. Where your implementation and the spec disagree, that is a bug report against your code, not a request to change the document.

An unwritten platform cannot be reimplemented, cannot be checked for conformance, and cannot be trusted to stay stable as the code underneath it changes. Writing the spec down is the first step toward fixing all three. A conformance corpus and test harness are the planned next step, expected to live in `ovos-spec-tools`; they are not built yet. What's already true today: skill authors get a document that defines "correct" outside any one codebase, instead of having to read implementation source to guess at the contract.

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
