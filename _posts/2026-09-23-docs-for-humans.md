---
title: "Docs for Humans: Two Audiences, One Toolchain"
excerpt: "OVOS documentation splits by audience: a User Guide for people running an assistant, and a Technical Manual for people building on the platform. The manual is live as a MkDocs site on GitHub Pages; the guide follows the same toolchain."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-09-23T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Docs for Humans

Documentation for open-source projects tends to fail in one of two directions. It is either written entirely for developers (dense, assuming prior knowledge, skipping the basics) or written entirely for newcomers, stopping well short of the depth that contributors and integrators need. Trying to serve both from one table of contents usually serves neither.

OVOS has had a technical manual for years. What it has not had is a clean separation between those two readers, or a user-facing site that someone who has never run a voice assistant can follow from a blank SD card to a working setup.

That is what the documentation split fixes: two dedicated documents, each shaped around one audience.

---

## The OVOS User Guide

The User Guide is the friendly guide to Open Voice OS for people who want to install, use and customize their assistant. Its repository is not public, so this post links nothing; what follows describes its plan. The organizing principle is that a reader should reach a working OVOS instance by following this guide alone, without reading source code or learning how the message bus works.

The guide is structured as a path, not a reference dump. Its sections follow the order a real person hits them:

- **Get Started**: what OVOS is, and choosing a setup that fits your hardware
- **Install**: the OVOS installer, the raspOVOS Raspberry Pi image, and Docker
- **First Steps**: a first-boot checklist, how to talk to OVOS, and managing the services
- **Everyday Use**: the built-in skills and playing media
- **Customize**: configuration basics, changing the voice, changing the wake word, adding skills, and the web interface
- **Troubleshoot**: common issues, audio problems, and where the log files live
- **Community**: where to get help when the docs run out

The tone is conversational, technical terms are explained where they first appear, and concrete commands stand in for abstract description wherever possible.

The User Guide is built with **MkDocs Material**. That theme does real work. It gives instant search with highlighting, one-click copy on every code block, a light and dark toggle, and a tabbed top navigation that keeps the seven sections one click apart. For a first-time reader who does not yet know the vocabulary, searching for a symptom and copying a fix matters more than any prose.

A note on honesty: the guide has a structure and a toolchain, not a public address. We would rather say that than pretend the whole guide is live.

---

## The Technical Manual

[`beta-technical-manual`](https://github.com/OpenVoiceOS/beta-technical-manual) is the reference for developers building skills, writing plugins, and integrating with the platform. It assumes you know Python and have a rough mental model of how the pieces fit together, and then it goes deep. It is published at [openvoiceos.github.io/beta-technical-manual](https://openvoiceos.github.io/beta-technical-manual/), and its navigation runs Get Started, Concepts, Pipeline, Language, Skills, Plugins, Agents, Production and Reference. The older `ovos-technical-manual` site is the previous edition and is not kept in step.

The scope is broad because the platform is:

- **Architecture**: the bus service, the listener/speech service, core, audio, GUI, the PHAL hardware-abstraction layer, the plugin manager, and configuration
- **Intent pipelines**: Adapt, Padatious, Model2Vec, Converse, Stop, Persona, Common Query, OCP and Fallback, each documented as its own pipeline plugin
- **Plugin development**: the full OPM surface, from microphone, VAD and wake word to STT, TTS, G2P, transformers, translation and OCP stream/media plugins
- **Skill development**: anatomy, dialog, intent design, settings, the skill API, runtime requirements, continuous conversation, and advanced skill types like fallback, common-query, media and universal skills
- **Self-hosting**: running your own persona, STT, TTS and translation servers, plus HiveMind integration
- **AI agents**: personas, LLM transformers and specialized solvers

This is the material that has to stay in step with the architecture spec repositories, and it is written for a reader who is comfortable jumping between a page and the code it describes.

---

## One Toolchain

Both are MkDocs projects on the **mkdocs-material** theme, deployed to GitHub Pages. The previous edition of the manual ran on the classic **readthedocs** theme. The manual that ships uses Material, so a reader moving between the guide and the manual gets the same search, copy button and theme toggle.

They also share the operational model. Both are static sites, with no server, no CMS and no paid hosting. Both build from Markdown through GitHub Actions; a push to the manual's `master` branch deploys the site. That keeps the barrier to contributing a doc fix as low as editing a text file.

---

## Why the Split Matters

A platform aiming for a stable release needs documentation that matches that ambition. A stable release is not only correct code; it is something a person can learn to use without asking on a forum at every step. The User Guide is the accessible on-ramp. The Technical Manual gives the developer community a reference that tracks the spec repositories. Errors in the manual go to its [issue tracker](https://github.com/OpenVoiceOS/beta-technical-manual/issues).

Splitting them means neither has to compromise. The guide can stay gentle without going shallow, and the manual can stay deep without turning away newcomers at the door. Between them, they let someone grow from "I just want this to work" to "I want to write a plugin" without ever hitting a wall the docs cannot get them past.

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
