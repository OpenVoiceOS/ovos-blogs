---
title: "Introducing ovos-judge: an LLM QA tool for OpenVoiceOS"
excerpt: "ovos-judge is an LLM judge that drives a live OVOS instance or persona and grades how it behaves — generated test phrasings, live bus events, a browser UI, and a headless CLI mode for CI."
coverImage: "/assets/blog/common/cover.png"
date: "2026-08-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/common/cover.png"
---

# Introducing ovos-judge: an LLM QA tool for OpenVoiceOS

*Drafted by an AI assistant and pending human review.*

`ovos-judge` is a new LLM-driven QA tool for OpenVoiceOS. An LLM "judge" writes test utterances, sends them to a running OVOS instance — or a persona through a chat plugin — and captures both the spoken reply and the MessageBus events that fired along the way, then grades whether the skill behaved as it should. It ships with a browser UI for interactive testing and a headless CLI mode you can drop straight into CI.

## Why you'd want it

Hand-written tests only cover the phrasings someone thought to write down. Real users say things differently every time, and a skill that passes every scripted test can still stumble the moment the wording changes. ovos-judge probes a much wider set of generated phrasings automatically and evaluates how the assistant actually responds to each one.

Think of it as the generative, live complement to `ovoscope`. ovoscope gives you deterministic, exact-bus-message regression tests — the same input always has to produce the same expected output. ovos-judge covers the other end: an LLM generates varied test utterances on the fly, drives a live persona or OVOS instance with them, and judges the outcome. Neither replaces the other — a solid test suite for a skill wants both the fixed regression checks and the open-ended, generative pass.

## How to use it

Install it from PyPI:

```bash
pip install ovos-judge
```

Launch the web UI:

```bash
ovos-judge
```

By default this serves a local browser UI on `127.0.0.1:8888`. Pass `--host 0.0.0.0` if you want to expose it beyond your own machine, and `--port` to run it on a different port.

In the UI, pick the **Judge LLM** chat plugin that will write and evaluate the test utterances, then choose the **target persona** — a bundled persona, a persona JSON file, or persona JSON pasted inline. Set the bus host and port, the max number of rounds, and a timeout, then write a **Test Prompt** describing in plain language what you want tested. Click **Start Test** and watch the live conversation stream: utterance, response, and a pass/fail evaluation for each round, with running passed/failed counts. When the session finishes, read the **Summary** and export it as **JSON** or **HTML** to share or archive.

For CI, skip the UI entirely and run a session headlessly from a config file:

```bash
ovos-judge --config session.json --output result.json
```

This runs the session once and exits `0` if everything passed or `1` if anything failed, with `--output` writing the full result for use as a CI artifact.

## Get started

ovos-judge is open source and ready to try against your own skills and personas. Head to the repository to get started:

[https://github.com/TigreGotico/ovos-judge](https://github.com/TigreGotico/ovos-judge)
