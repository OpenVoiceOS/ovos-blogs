---
title: "AGENTS.md and SKILL.md: Making Every OVOS Repo Legible to Your AI"
excerpt: "We're rolling out AGENTS.md and SKILL.md across the OpenVoiceOS repositories — not to flood ourselves with AI-generated pull requests, but to put a capable coding assistant in the hands of every user who wants to customize their own assistant."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-11-25T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## AGENTS.md and SKILL.md: Making Every OVOS Repo Legible to Your AI

Let's be honest about where we are. Coding agents are everywhere now, and for a lot of people — including people who would never call themselves programmers — "describe what you want and let an AI draft it" has become a genuinely useful way to make software do their bidding. For personal, private tinkering, that's not a threat. It's empowering.

We have our reservations about AI coding agents, and we're still working out how, and how much, to use them in our own development. But one thing is already clear: their most exciting place is in the hands of *users*. And a voice assistant you fully control is exactly the kind of software people should be able to bend to their own needs. So we're doing something concrete about it: **rolling out `AGENTS.md` and `SKILL.md` across the OpenVoiceOS repositories.**

---

## Two files, two jobs

These are small, plain-text files that live in a repository and make it legible — to a human, and to an AI assistant working on that human's behalf.

**`AGENTS.md`** is the repo's orientation guide for a coding agent. It says, in one place, what the project is, how it's laid out, how to install and run the tests, and which conventions matter. When you point a coding assistant at an OVOS repo, `AGENTS.md` is what stops it from guessing — it can build, test, and follow house style because the repo told it how.

**`SKILL.md`** captures a reusable *capability* — a distilled piece of the project's domain knowledge, written so an agent can pick it up and apply it. Think of it as the repo teaching your assistant the thing it knows how to do, so that "help me add a new intent to this skill" or "wire up a plugin the OVOS way" draws on real project knowledge instead of a generic guess.

Together they turn a repository from something you have to reverse-engineer into something your assistant can read and reason about from the first prompt.

---

## What this is *not*

We want to be equally clear about the other side of this.

**This is not an invitation for AI-generated pull requests.** For OpenVoiceOS's own development, we would rather use AI on our own terms — inside our safeguards, behind our review, and validated by our own test harnesses like [ovoscope](https://github.com/TigreGotico/ovoscope) and the HiveMind conformance suites. A voice platform that people trust with a microphone in their home is not a place for unreviewed, machine-authored code to land upstream. The bar for the core stays exactly where it was: human judgment, real tests, deliberate review.

So the audience for `AGENTS.md` and `SKILL.md` is not a firehose of drive-by contributions. It's **you, the user**, working on **your** deployment: writing a personal skill, tweaking a plugin's behaviour, wiring two pieces together for a setup only you have. The kind of change that's yours to make and yours to run.

---

## Why this fits OVOS

The whole point of OpenVoiceOS is that it's *yours* — offline, private, and user-controlled, not a rented appliance that does only what a vendor allows. Documentation that a coding assistant can read is a natural extension of that. It lowers the floor for the person who has an idea for how their assistant should behave but not a decade of Python behind them.

We're rolling these files out across the repositories over the coming period. As each repo gains its `AGENTS.md` and `SKILL.md`, working on it — by hand or with an assistant at your side — gets a little more approachable. That's the goal: not to build OVOS *with* AI, but to make OVOS something anyone can build *on*, whatever tools they bring.

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
