---
title: "OpenVoiceOS 2026 Roadmap: From Beta to Breakthrough"
excerpt: "We at OpenVoiceOS are proud to share our 2026 roadmap. In 2026, we will be formalizing core subsystems, expanding session and tool support, creating new infrastructure such as the OVOS Plugin Arena, extending third-party server compatibility, and strengthening multilingual and generative capabilities."
coverImage: "/assets/blog/ngi_roadmap/thumb.png"
date: "2026-01-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi_roadmap/thumb.png"
---


# OpenVoiceOS 2026 Roadmap: From Beta to Breakthrough

We at OpenVoiceOS (OVOS) are proud to share our 2026 roadmap. OVOS is a fully open-source, modular voice assistant
framework built to give users, developers, and organizations full control over their voice assistant experience, while
remaining privacy-first and fully transparent.

This roadmap is supported by the [**NGI Zero Commons Fund**](https://blog.openvoiceos.org/posts/2025-10-20-ngi), and much of the work has been happening openly since late
October 2025. The detectives among our readers can already explore early prototypes or draft PRs to see many of the
developments referenced here. Highlights from 2025 include [pre-wake-VAD settings](https://blog.openvoiceos.org/posts/2025-11-06-prewake-vad) to reduce false activations, [migration of precise wake word models to ONNX](https://blog.openvoiceos.org/posts/2025-11-03-precise-onnx), and research on [TTS models for minority languages](https://blog.openvoiceos.org/posts/2025-12-09-ast).

In 2026, we will build on this foundation by formalizing core subsystems, expanding session and tool support, creating
new infrastructure such as the OVOS Plugin Arena, extending third-party server compatibility, and strengthening
multilingual and generative capabilities.

---

## Disclaimer

This roadmap reflects current development priorities for 2026 and summarizes work supported by the NGI Zero Commons Fund. It is not a binding commitment or a finalized project plan. The items described here represent active work, ongoing research, and intended directions rather than guaranteed deliverables. Specific details may change as development progresses, community feedback is incorporated, or technical constraints evolve. All implementations remain subject to revision based on practical findings and upstream ecosystem changes.

---

## OVOS Release Strategy

Since 2025, we have followed a [rolling release model](https://github.com/OpenVoiceOS/ovos-releases) based on [semantic versioning](https://semver.org/) and [constraints files](https://pip.pypa.io/en/stable/user_guide/#constraints-files).
Our **alpha** channel is fully automated: every pull request triggers a pre-release, with [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) enforcing versioning.
In contrast, **stable** and **testing** channels have not yet had formal schedules; although release workflows have been
validated, we have not defined when these releases should be pushed.

In 2026, we will introduce **codename releases**, corresponding to stable releases. These will freeze all OVOS package
versions at a specific point in time, providing reproducible, production-ready deployments, while the rolling alpha
channel continues to support bleeding-edge development. Scheduled codename releases will give our users and partners
predictable and auditable upgrade points.

What should be the theme behind our release names? Fictional Towns? Famous Robots? Deep Sea
Fish? [Join the discussion on github!](https://github.com/OpenVoiceOS/ovos-releases/issues/5)

---

## Key Initiatives for 2026

### Modular Core & Intent Handling

Our 2025 modularization allows the [intent handling pipeline](https://openvoiceos.github.io/ovos-technical-manual/pipelines_overview/) to be fully customizable via plugins, enabling us to focus
development on individual repositories without affecting **ovos-core** stability.

In 2026, we will continue refining core subsystems, and we plan to experiment with an embeddings-based intent plugin as a potential replacement for
[Padatious](https://openvoiceos.github.io/ovos-technical-manual/padatious_pipeline/). The existing [ovos-m2v-pipeline](https://openvoiceos.github.io/ovos-technical-manual/m2v_pipeline/) validated this approach in 2025. Our goal now is to drop the classifier
head, making the plugin more universal and multilingual, while keeping backward compatibility with existing skills and
pipelines. 

**Compatibility with existing skills is a top priority as we evaluate alternatives.**

---

### OVOS and the LLM ecosystem

[Personas](https://openvoiceos.github.io/ovos-technical-manual/150-personas) were introduced in 2025 as stacks of [**solver plugins**](https://openvoiceos.github.io/ovos-technical-manual//360-solver_plugins), which function as black boxes: they receive a list of
messages and produce a response, much like a large language model. The **[ovos-persona pipeline](https://openvoiceos.github.io/ovos-technical-manual/153-persona_pipeline)** replaced or augmented
classic skills, enabling generative responses when skill matching fails or as a full skill replacement.

Building on persona work, 2026 will [expand OVOS’s role in the LLM ecosystem](https://blog.openvoiceos.org/posts/2025-10-24-protocol_interoperability) by exposing OVOS plugins as callable tools.
STT, TTS, and persona plugins will become accessible to external LLMs via MCP, UTCP and A2A protocols.

We want to be explicit: as part of the NGI-funded roadmap we currently have **no plans to expose OVOS skills as tools** or consume tools in OVOS. This
scope is reserved for **individual solver plugins**. In 2026, our focus is on exposing STT, TTS, and MT plugins as tools, and personas as A2A agents.

---

### Memory Plugin Abstraction

Memory handling will become a fully formalized plugin type. These plugins receive the user utterance and session ID,
returning a structured message history for submission to a persona. Currently, short-term memory is hardcoded in 
**ovos-persona** as the last N turns. With this new abstraction, any memory backend can be plugged in, including
retrieval-augmented generation via **ovos-persona-server** OpenAI-compatible endpoints.

---

### OVOS Plugin Arena

We will create the OVOS Plugin Arena in 2026 as a platform for benchmarking and evaluating plugins. Plugins will be
measured against reference datasets, and users can participate in ongoing “battles,” producing a continuous ELO-style
ranking. The results will be visible through a web UI, allowing the community to observe and influence plugin adoption
over time.

---

### Persona & GUI Session Support

Previously, **ovos-persona** and the GUI largely assumed a single-user, single-device environment. In 2026, both components will
fully respect session IDs, enabling multi-device, multi-user deployments. This matters for distributed environments
like Hivemind satellites, where each session maintains its own persona and GUI state.

---

### Pyhtmx GUI Adoption

The OVOS community has developed a [new **pyhtmx GUI**](https://github.com/femelo/pyhtmx-gui-client), which we will officially adopt in 2026. Figma designs will be
created for all default skills and interactions to ensure a consistent and modern user experience. 

The legacy Qt5 GUI has been in life support for some time and is expected to be deprecated unless maintainers emerge, if you are interested in keeping the old QT mycroft-gui alive get in touch!

---

### Wake Word Datasets

We are introducing a **new repository** for wake word training and synthetic dataset generation. The focus is on
producing high-quality, reproducible data and providing a flexible platform for experimentation with different wake word
architectures. No architecture is mandated; the goal is [robust training data and easy experimentation](https://huggingface.co/collections/TigreGotico/synthetic-wakeword-datasets).

---

### Language & TTS Model Research

We will continue training multilingual TTS models using VITS via [Phoonnx](https://blog.openvoiceos.org/posts/2025-10-06-phoonnx). Each supported language will receive two
single-speaker models, a male voice (Miro) and a female voice (Dii), to maintain a recognizable OVOS identity. Minority
languages will continue to be supported, following our [2025 work with Aragonese and Asturian](https://blog.openvoiceos.org/posts/2025-12-09-ast) and our [Arabic collaboration with Planet Blind Tech](https://blog.openvoiceos.org/posts/2025-10-01-arabic_tts_collaboration).

---

### Third-Party Server Compatibility

Beyond formal protocols like MCP, OVOS continues to expand interoperability via compatible implementations with popular APIs, 
enabling seamless integration of OVOS plugins with applications that may not even be aware of OVOS.  

OVOS itself can operate as a persona behind the persona server, becoming a drop-in replacement for existing LLM applications,
this approach has already been demonstrated in [Home Assistant](https://blog.openvoiceos.org/posts/2025-09-17-ovos_ha_dream_team) as a proof of concept.

While [ovos-persona-server](https://openvoiceos.github.io/ovos-technical-manual/202-persona_server) currently supports OpenAI compatible chat endpoints, 2026 will extend OpenAI compatibility to include embeddings and files, enabling RAG solutions.

[ovos-stt-server](https://openvoiceos.github.io/ovos-technical-manual/200-stt_server/) and [ovos-tts-server](https://openvoiceos.github.io/ovos-technical-manual/201-tts_server) will also be extended to be compatible with OpenAI, MaryTTS, and potentially other popular service provider APIs. 

---

### Miscellaneous UX & Tools

Additional improvements will target developer and integrator efficiency, including a web-based configuration UI, message-bus monitoring and export utilities, and end-to-end testing frameworks for skills and message flows.

In 2025, we quietly introduced several prototypes already shipping in raspOVOS: the [ovos-yaml-editor](https://github.com/OpenVoiceOS/ovos-yaml-editor), the [ovoscope](https://github.com/TigreGotico/ovoscope) test harness, and, near year-end, the public release of [ovos-busmon](https://github.com/TigreGotico/ovos-busmon). Throughout 2026, these tools will be consolidated, refined, and formally incorporated into the OVOS toolchain.

---

## 2026 Vision

In 2026, we are consolidating OVOS as a modular, production-ready voice assistant platform while embracing agentic,
LLM-compatible paradigms. Personas continue to evolve with session-aware behavior and tool integration, memory
management is formalized through plugins, and the OVOS Plugin Arena will provide community-guided evaluation.

Wake word, TTS, and STT research ensures robust, multilingual, and high-quality interactions, while the new pyhtmx GUI
and session-aware GUI closes remaining gaps in usability. With codename releases, extended third-party server
compatibility, and ongoing open development, OVOS continues to be a versatile, privacy-first platform capable of
powering both traditional voice assistant workflows and emerging generative AI applications.

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
