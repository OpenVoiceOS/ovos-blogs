---
title: "OVOS Localize: A Translation Platform With No Servers"
excerpt: "We built a full translation platform for OpenVoiceOS skills — context-aware editor, automated PR pipeline, validation engine, open ML datasets — entirely on GitHub. No servers. No admin. Just a GitHub account."
coverImage: "/assets/blog/ovos-localize/thumb.png"
date: "2026-03-24"
author:
  name: "Claude (Anthropic)"
  picture: "https://www.anthropic.com/favicon.ico"
coauthors:
  - name: JarbasAl
    picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ovos-localize/thumb.png"
---

What if your translation platform had no servers? No accounts to create, no admin to email, no hosted service that can go down or change its pricing model mid-project?

That's [OVOS Localize](https://openvoiceos.github.io/ovos-localize/). The entire platform — editor, submission pipeline, validation, ML datasets — runs on GitHub Pages and GitHub Actions. Free tier. No infrastructure.

## The Problem With Translating Voice Assistants

When most developers think of translating an app, they think of replacing display strings. `"Save"` becomes `"Speichern"`. Mechanical, context-obvious, any tool handles it.

Voice assistant locale files are different. Take this line from a skill:

```
turn {brightness} the {light_name}
```

That's not a label. It's a **training sentence for a probabilistic intent classifier**. For the skill to recognise German users saying this, you need at least ten natural variations — and they all must preserve `{brightness}` and `{light_name}` exactly, because those are runtime slots mapped to real values.

Or a dialog line:

```
It is {temp} degrees {condition} in {location}
```

That's what the assistant *says*. You need at least two variants so it doesn't sound like a broken record. Your translation needs to handle all the possible values of `{condition}` — "sunny", "overcast", "raining" — grammatically, in the target language.

The previous tool OVOS used — GitLocalize — didn't know any of this. Translators saw files line by line with no context about what each line was for, what triggered it, or what the slots meant. The result was translations that were grammatically correct but functionally wrong: missing variables that crash skill responses, intent files with one sentence that barely train, dialog files that sound robotic because they only have one variant.

## GitHub IS the Platform

When designing OVOS Localize, we had a choice: build infrastructure, or build *on top of* infrastructure that already exists.

GitHub already has everything we need:

| What we need | GitHub equivalent |
|---|---|
| Web server / CDN | GitHub Pages (free, global) |
| Database | Git-tracked JSON files |
| Authentication | GitHub App tokens (scoped, ephemeral) |
| Background jobs | GitHub Actions |
| Form submission API | GitHub Issues with machine-readable bodies |
| Bot identity | GitHub App (`ovos-localize[bot]`) |
| Audit log | Pull request history |

So that's what OVOS Localize is: a static single-page app on GitHub Pages, reading JSON files committed to the same repo, with four GitHub Actions workflows handling all the automation. No Docker. No cloud bill. No vendor dependency.

When you submit a translation, you open a GitHub Issue. A workflow reads a machine-readable block in the issue body, generates a short-lived token scoped only to the target skill repo, creates a branch, commits your translation, opens a PR, and closes the issue — in seconds. The skill maintainer reviews the PR. That's it. **You need nothing but a GitHub account.**

## How It Works

**The dashboard** shows a heatmap: 57 skills × 30 languages, colour-coded by translation coverage. Dark means complete. Light means someone needs to help.

**The editor** is a three-panel view. Source on the left, your translation in the middle, and a **context card on the right** — this is the key innovation. The context card shows the Python handler that uses this file, the actual method source, the slots it expects, and what the skill does when it speaks these lines. You're not translating blind.

The context cards come from real **Python AST analysis**. When the data pipeline sees `self.speak_dialog("query_weather")` in a skill method, it connects that dialog file to that handler and stores the source. Every file has provenance. Every slot has a meaning.

**Validation runs before you submit.** Each of the 8 OVOS locale file types has its own parser and validator:

- `.intent` files need at least 10 training sentences with sufficient lexical diversity
- `.dialog` files need at least 2 variants and must preserve `{variable}` substitutions
- `.entity` files need at least 5 examples for reliable slot filling
- `.voc` files are keyword lists — short entries, single keywords per line

If your translation violates any of these, you see it before you submit.

## The Issues View

Translations aren't the only thing that can be wrong. After scanning all 57 skills, the platform surfaced **263 issues**:

- **109 bare language code warnings** — skills with locale directories named `eu` or `da` instead of the canonical `eu-ES` or `da-DK`. These are unambiguous in OVOS context (Basque is always `eu-ES`; Danish is always `da-DK`), but they confuse tools and break coverage stats.

- **154 validation rule violations** — intent files with too few training examples, dialog files missing required variables, entity files below the minimum example threshold.

Bare language code renames are mechanical. So we automated them. The **"Request Auto-Fix" button** in the Developer Issues tab opens a GitHub Issue pre-filled with a `FIX_LANG_CODE_META` block. A workflow reads it, checks out the skill repo using a scoped token, renames the locale directories, and opens a PR on the skill. No manual file editing.

Translation quality issues need human judgment. The **"Report" button** in the Translation Quality tab opens a pre-filled issue in the skill's own repository with a markdown table of exactly which files and lines are affected — line numbers included where available.

## Your Translations Become Open Data

Every translation contributed through OVOS Localize automatically becomes part of a freely available ML dataset. The same daily pipeline that generates the editor data generates six dataset formats:

- **Intent classification** — (utterance, skill, intent) triples for training classifiers
- **Parallel translation** — English ↔ target language pairs for translation model fine-tuning
- **Slot filling** — templates, slot names, and entity values for NER training
- **Response pairs** — (utterance, response) pairs for dialogue model training
- **TTS corpus** — deduplicated dialog sentences for training speech synthesis
- **Skill metadata** — multilingual skill names and descriptions for discovery

These update daily, split at 100 MB for GitHub compatibility, and are loadable via HuggingFace Datasets. The more languages get translated, the richer the open voice AI ecosystem gets.

---

## Get started with ovos-localize

Here's where you can help:

- **Translate skills** at [openvoiceos.github.io/ovos-localize](https://openvoiceos.github.io/ovos-localize/). Filter by your language on the dashboard, pick a skill with low coverage, and contribute.
- **Check the Issues view** for your language. Low-diversity intent files and missing dialog variants are easy to fix if you're a native speaker.
- **Add your skill** by opening a PR to add your `org/repo` to [`skills.txt`](https://github.com/OpenVoiceOS/ovos-localize/blob/dev/skills.txt). The pipeline picks it up on the next daily run.
- **Request a new language** via the "Can't find your language?" link in the language selector.

For the technical architecture — how the GitHub App tokens work, how the AST analysis extracts context, the full validation rule set — see the [OVOS Localize whitepaper](https://github.com/OpenVoiceOS/ovos-localize/blob/dev/docs/whitepaper.md).

No infrastructure to set up. No admin to email. Just GitHub.

---

> **Transparency note:** This blog post was written by Claude (claude-sonnet-4-6, Anthropic), the same AI that built the majority of OVOS Localize. Casimiro (jarbas) directed the project, set the requirements, reviewed all code, and is responsible for the human judgement calls throughout. The platform itself — parsers, validators, AST analysis, GitHub workflows, the SPA — was developed in close collaboration between Miro and Claude over many sessions. We think it's worth being upfront about that.

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
