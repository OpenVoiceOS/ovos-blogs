---
title: "OVOS Localize: A Translation Platform With No Servers"
excerpt: "A full translation platform for OpenVoiceOS skills — context-aware editor, automated PR pipeline, a validation engine tuned to voice-assistant file types, and open ML datasets — running entirely on GitHub. No servers, no admin, no vendor. Just a GitHub account, and forkable by anyone."
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

What if your translation platform had no servers? No account to create, no admin to email, no hosted service that can go down, change its pricing, or shut off mid-project?

That's [OVOS Localize](https://openvoiceos.github.io/ovos-localize/). The entire platform — editor, submission pipeline, validation, ML datasets — runs on GitHub Pages and GitHub Actions. Free tier. No infrastructure. And because it's just a repository, anyone can fork the whole thing and run their own instance.

## The Problem With Translating Voice Assistants

When most developers think of translating an app, they think of replacing display strings. `"Save"` becomes `"Speichern"`. Mechanical, context-obvious, any tool handles it.

Voice assistant locale files are different. Take this line from a skill:

```
turn {brightness} the {light_name}
```

That's not a label. It's a **training sentence for a probabilistic intent classifier**. For the skill to recognise German users saying this, you need roughly ten natural variations — and they all must preserve `{brightness}` and `{light_name}` exactly, because those are runtime slots mapped to real values.

Or a dialog line:

```
It is {temp} degrees {condition} in {location}
```

That's what the assistant *says*. You need at least two variants so it doesn't sound like a broken record, and your translation has to handle every possible value of `{condition}` — "sunny", "overcast", "raining" — grammatically, in the target language.

The tool OVOS used before — GitLocalize — knew none of this. Translators saw files line by line, with no context about what each line was for, what triggered it, or what the slots meant. The result was translations that were grammatically correct but functionally wrong: missing variables that crash skill responses, intent files with a single sentence that barely trains, dialog files that sound robotic because they only have one variant. And it was a hosted third-party dependency — community data living on someone else's platform.

## GitHub IS the Platform

When designing OVOS Localize, we had a choice: build infrastructure, or build *on top of* infrastructure that already exists.

GitHub already has everything a translation platform needs:

| What we need | GitHub equivalent |
|---|---|
| Web server / CDN | GitHub Pages (free, global) |
| Database | Git-tracked JSON files |
| Authentication | GitHub App tokens (scoped, ephemeral) |
| Background jobs | GitHub Actions |
| Form submission API | GitHub Issues with machine-readable bodies |
| Bot identity | GitHub App (`ovos-localize[bot]`) |
| Audit log | Pull request history |

So that's what OVOS Localize is: a static single-page app on GitHub Pages, reading JSON committed to the same repo, with a small set of GitHub Actions workflows handling every piece of automation. There are six of them, and their names map directly to what the platform does: `add_skill` registers a new skill repo, `enable_new_language` opens a language for translation, `submit_translation` turns a contribution into a pull request, `fix_lang_code` repairs non-canonical locale directory names, `poll_merged_fixes` watches for merged fixes and keeps the dashboard honest, and `update_data` rebuilds all the editor and dataset files on a daily schedule. No Docker. No cloud bill. No vendor.

When you submit a translation, you open a GitHub Issue. `submit_translation` reads a machine-readable block in the issue body, mints a short-lived token scoped only to the target skill repo, creates a branch, commits your translation, opens a PR, and closes the issue — in seconds. The skill maintainer reviews the PR. That's it. **You need nothing but a GitHub account.**

## How It Works

**The dashboard** is a heatmap: every registered OVOS skill against dozens of languages, colour-coded by translation coverage. Dark means complete. Light means someone needs to help.

**The editor** is a three-panel view. Source on the left, your translation in the middle, and a **context card on the right** — this is the key idea. The context card shows the Python handler that uses this file, the actual method source, the slots it expects, and what the skill does when it speaks these lines. You're not translating blind.

Those context cards come from real **Python AST analysis**. When the data pipeline sees `self.speak_dialog("query_weather")` in a skill method, it connects that dialog file to that handler and stores the source. Every file has provenance. Every slot has a meaning.

**Validation runs before you submit.** OVOS Localize ships a dedicated parser and validator for each of the six locale file types it understands — `.intent`, `.voc`, `.dialog`, `.entity`, `.rx`, and `.value` — with rules tuned to what each one is actually for:

- `.intent` files need at least 10 sentences after alternative-syntax expansion, must preserve every source `{slot}`, and must clear a lexical-diversity threshold so ten near-identical lines don't pass as ten examples.
- `.dialog` files need at least 2 variants and must preserve `{variable}` substitutions exactly — extra or missing variables are hard errors.
- `.entity` files need at least 5 examples for reliable slot filling.
- `.voc` files are keyword lists — non-empty, with short entries flagged if they look like whole sentences.
- `.rx` regexes must compile and keep their named groups; `.value` files must stay valid `display,value` CSV with the system value preserved.

If your translation trips any of these, you see it before you submit, not after a skill breaks in production.

## The Issues View

Translations aren't the only thing that can be wrong. Scanning every registered skill surfaces hundreds of issues, in two buckets:

- **Bare language code warnings** — skills with locale directories named `eu` or `da` instead of the canonical `eu-ES` or `da-DK`. These are unambiguous in OVOS context (Basque is always `eu-ES`; Danish is always `da-DK`), but they confuse tooling and break coverage stats. The renames are mechanical, so we automated them: the **"Request Auto-Fix" button** opens an issue with a `FIX_LANG_CODE_META` block, `fix_lang_code` reads it, renames the directories using a scoped token, and opens a PR on the skill.

- **Validation rule violations** — intent files with too few or too-similar training examples, dialog files missing required variables, entity files below the example threshold. These need human judgment, so the **"Report" button** opens a pre-filled issue in the skill's own repository with a markdown table of exactly which files and lines are affected.

## Your Translations Become Open Data

Every translation contributed through OVOS Localize feeds an open ML dataset. The same daily pipeline that builds the editor data generates six dataset formats:

- **Intent classification** — (utterance, skill, intent) triples for training classifiers
- **Parallel translation** — English ↔ target-language pairs for translation model fine-tuning
- **Slot filling** — templates, slot names, and entity values for NER training
- **Response pairs** — (utterance, response) pairs for dialogue model training
- **TTS corpus** — deduplicated dialog sentences for speech synthesis training
- **Skill metadata** — multilingual skill names and descriptions for discovery

These rebuild daily, split at 100 MB for GitHub compatibility, and are exported in HuggingFace Datasets layout, ready to publish. The more languages get translated, the richer that open corpus becomes.

---

## Get started with ovos-localize

Here's where you can help:

- **Translate skills** at [openvoiceos.github.io/ovos-localize](https://openvoiceos.github.io/ovos-localize/). Filter by your language on the dashboard, pick a skill with low coverage, and contribute.
- **Check the Issues view** for your language. Low-diversity intent files and missing dialog variants are easy to fix if you're a native speaker.
- **Add your skill** by opening a PR to add your `org/repo` to [`skills.txt`](https://github.com/OpenVoiceOS/ovos-localize/blob/dev/skills.txt). The pipeline picks it up on the next daily run.
- **Request a new language** via the "Can't find your language?" link in the language selector.
- **Fork it.** The platform is a repository — clone it, point it at your own skill list, and run your own instance.

For the technical architecture — how the GitHub App tokens work, how the AST analysis extracts context, the full validation rule set — see the [OVOS Localize whitepaper](https://github.com/OpenVoiceOS/ovos-localize/blob/dev/docs/whitepaper.md).

No infrastructure to set up. No admin to email. Just GitHub.

---

> **Transparency note:** This blog post was written by Claude (claude-sonnet-4-6, Anthropic), the same AI that built the majority of OVOS Localize. Casimiro (jarbas) directed the project, set the requirements, reviewed all code, and is responsible for the human judgement calls throughout. The platform itself — parsers, validators, AST analysis, GitHub workflows, the SPA — was developed in close collaboration between Miro and Claude over many sessions. We think it's worth being upfront about that.

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
