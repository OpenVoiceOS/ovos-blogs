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

Most "voice assistants" are products. You ask a question, they answer, and how they do it is a black box you're not meant to open. OpenVoiceOS is a different kind of thing, and the [**OVOS architecture repository**](https://github.com/OpenVoiceOS/architecture) is where we finally wrote down exactly *what* kind of thing.

Its own framing is the clearest: OVOS is a **voice operating system** — not a voice assistant. A voice assistant is a product that answers questions. A voice OS is a *platform*. It defines the boundary between what a user says and the computation that runs; it arbitrates which application handles each utterance; it manages conversation state across turns; and it provides a stable interface that third-party applications run against without knowing anything about each other. The architecture repo is the source of truth for that interface — the ABI of the voice OS.

---

## The operating-system analogy is not a metaphor

The repository draws the comparison directly, and it holds up point for point:

| Operating system | Voice OS equivalent |
|---|---|
| Process scheduler | Pipeline plugin ordering |
| IPC / message passing | The bus and the MSG-1 envelope |
| Shared memory | The session carrier |
| Process supervision | The handler-lifecycle trio |
| Loadable kernel modules | Pipeline and transformer plugins |
| System-call ABI | The `match(utterances, lang, session) → Match` contract |

The consequence is worth sitting with. Because there's a stable ABI, OVOS is a **runtime**, not a monolith: you can swap the scheduler (pipeline ordering), the NLU engines (pipeline plugins), the dialogue policy (converse and context), or the output layer (TTS, display) — in any combination — and everything else keeps working. A skill written against the intent stack runs on any conformant orchestrator, under any pipeline configuration, in any supported language. That is precisely the property an operating system gives you, and precisely the property most voice products don't.

---

## What's actually specified

The repository is **20 specifications**, grouped by the subsystem they govern. Each has a stable ID, a version, and normative text:

- **The intent stack** — `INTENT-1` (sentence template grammar), `INTENT-2` (locale resource formats), `INTENT-3` (intent definition), `INTENT-4` (intent and entity registration). This is how a skill declares what it understands.
- **Bus and session** — `MSG-1` (the bus message envelope), `SESSION-1` (the session carrier wire shape), `SESSION-2` (session lifecycle and state ownership), `BRIDGE-1` (bus bridging and opaque relay). This is how components talk and how state travels with a conversation.
- **The pipeline** — `PIPELINE-1` (the utterance lifecycle), plus the plugins that live in it: `TRANSFORM-1`, `CONTEXT-1`, `CONVERSE-1`, `STOP-1`, `PERSONA-1`, `FALLBACK-1`, `COMMON-QUERY-1`. This is how an utterance becomes an action.
- **Audio and display** — `AUDIO-IN-1` (audio input), `AUDIO-1` (audio output), `GUI-1` (the display subsystem).
- **Media** — `OCP-1`, the OVOS Common Playback virtual media player.

The point of splitting it this way is that a spec is a contract with a scope. You can implement `STOP-1` correctly without re-reading the whole platform, and someone auditing your stop behaviour knows exactly which document is the referee.

---

## RFC-2119, and what "Draft" means here

The specs are written in **RFC-2119 language** — the MUST / SHOULD / MAY vocabulary that standards bodies use so that "correct" is not a matter of opinion. When a spec says a component MUST emit an event, an implementation that doesn't isn't making a reasonable alternative choice; it's wrong, and the spec is the evidence.

Every spec in the repository is currently at **Draft** status, and the repo is careful about what that word means. A Draft spec here is still **prescriptive**: where an implementation diverges from it, the divergence is treated as an implementation bug, not a defect in the specification. Draft signals "we may still revise the text," not "this is optional." It's an honest label — the specs are young, they'll change — but they are already the authority, not a wish list.

---

## Not the same as the message models

It's worth heading off a natural confusion. There is a separate OVOS effort, [ovos-pydantic-models](https://github.com/OpenVoiceOS/ovos-pydantic-models), that specifies what each bus *message looks like* — the exact fields of a `speak` or a `recognizer_loop:utterance` payload. These architecture specs are the other half: they specify how components *behave* — how the pipeline orders work, how a session propagates, how a stop cascades. Payload shape versus runtime behaviour. Two complementary bodies of work, deliberately kept apart, and together they're what let a second, independent implementation of OVOS be more than a hopeful guess.

## Why write it down at all

An unwritten platform can't be reimplemented, can't be conformance-tested, and can't be trusted to stay stable as the code churns beneath it. Writing the ABI down changes all three. A satellite, a bridge, a from-scratch client, or a competing orchestrator now has a target to build against and a document to be judged by. Skill authors get guarantees they can rely on across releases. And OVOS itself gets the thing every mature platform eventually needs: a definition of "correct" that lives outside any one codebase, so the platform can outlast the particular lines of Python that implement it today.

That's the difference between a product and an operating system. One does what its vendor allows. The other publishes its contracts and invites you to build.

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
