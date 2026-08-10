---
title: "ovos-judge: from vibe-coded alpha to a tool you can trust"
excerpt: "ovos-judge is an LLM judge that drives a live OVOS persona and grades what comes back. It started as a 100% AI-written alpha with no human review. Here's the adversarial hardening pass that just landed — and the bug unit tests hid from us."
coverImage: "/assets/blog/common/cover.png"
date: "2026-08-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/common/cover.png"
---

# ovos-judge: from vibe-coded alpha to a tool you can trust

*This post was drafted by an AI assistant (Claude) and is pending human review.*

## What ovos-judge is

`ovoscope` gives OpenVoiceOS skills a deterministic test suite: fixed input, fixed expected output, pass or fail. That's the right tool for regression testing, but it can't tell you how a skill behaves against the messy, open-ended things real users say.

`ovos-judge` is the generative complement. It's an LLM-driven QA tool: a configurable chat LLM plays the **judge**. It writes test utterances, sends them to a running OVOS instance or persona through a chat plugin, captures both the spoken response and the MessageBus events fired along the way, and then evaluates whether the skill behaved correctly — all from a real-time browser UI. Where ovoscope asks "does this exact input produce this exact output," ovos-judge asks "does this skill hold up under a live, conversational, LLM-generated attack surface." Together they cover the two ends of testing a voice assistant: deterministic regression and generative, live evaluation.

## The honest origin

We're not going to bury this: ovos-judge started as a 100% "vibe-coded" project. An AI wrote every line — Python, JavaScript, HTML, CSS, the CI workflow, the docs — and no human reviewed the code before it shipped as an alpha. It had a working demo and passing tests, and that was it. The README said so plainly from day one, because "the AI was confident" is not evidence, and we'd rather name that risk than let someone find out the hard way.

## What the hardening pass actually did

An adversarial security review went through the HTTP surface and the session storage layer looking for ways to break it, not ways to confirm it worked. It found real issues and they got fixed:

- LLM-generated content going into the HTML export wasn't escaped — a stored XSS waiting to happen the first time a judge model produced something clever. It's autoescaped now.
- The server bound to all interfaces by default. It now binds to loopback (`127.0.0.1`) unless you explicitly open it up.
- Session ids weren't validated and session store files had no permission restrictions. Both are locked down now, and request bodies are capped so an oversized payload gets a clean 413 instead of falling through unchecked.

Separately, a functional bug turned up that had nothing to do with security and everything to do with test discipline: the persona-drive path called `Persona.chat()` with an outdated signature — keyword `lang=` and dict-shaped messages — against the *current* `ovos-persona` API, which expects a message list and a `Session` object. Every unit test mocked `persona.chat()` with a permissive `**kwargs` signature, so the mismatch never surfaced. Against a real target it would raise `TypeError` on the first turn. The fix rebuilds the call with the current signature, and the regression test now asserts against the real signature instead of a mock that happily accepts anything.

Around that: a LICENSE and funding attribution were added, and CI was brought up toward the rest of the org's standard (coverage, lint, end-to-end run, a floor-pinned `ovos-plugin-manager`).

## Why "deployed and used it" is the part that matters

The unit tests were green the whole time the persona bug existed. That's the point of naming it here: a green suite tells you the code agrees with its own mocks, not that it works. The bug only showed up when the tool was run the way a user runs it — a real server over HTTP and WebSocket, a real persona target, restart-recovery checked, adversarial inputs thrown at the HTTP surface on purpose. That's not a nice-to-have extra step; it's the validation doctrine ovos-judge itself exists to make easy for *other* OVOS skills. It would have been a little embarrassing to skip it on ovos-judge itself.

## Where that leaves it

ovos-judge is still maturing, and we're not claiming otherwise. What changed is that it went through an adversarial pass instead of resting on AI confidence, a real bug that unit tests had hidden got caught and fixed, and it was actually deployed and used like a user before we called any of this done. AI-authored tooling can be genuinely useful — but only once someone stops trusting the model's confidence and puts it under real pressure. That's what turns an alpha into something you can build on.
