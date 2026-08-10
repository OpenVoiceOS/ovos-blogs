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

Translating a voice assistant is a different job than translating an app. An app string like `"Save"` becomes `"Speichern"` and you're done. A voice assistant line like `turn {brightness} the {light_name}` is a training sentence for an intent classifier — get it wrong and the skill stops recognizing your language at all. [OVOS Localize](https://openvoiceos.github.io/ovos-localize/) is a translation platform built for that harder job, and it runs with no servers: just GitHub Pages, GitHub Actions, and a GitHub account.

## Why voice assistant strings are harder to translate

Take that light-switching intent again:

```
turn {brightness} the {light_name}
```

To recognise German speakers saying this, you need roughly ten natural variations, and every one must preserve `{brightness}` and `{light_name}` exactly — those are runtime slots mapped to real values.

Or a dialog line:

```
It is {temp} degrees {condition} in {location}
```

That's what the assistant *says* out loud. You need at least two variants so it doesn't sound like a broken record, and the translation has to work grammatically for every value `{condition}` can take — "sunny", "overcast", "raining".

OVOS previously used GitLocalize, which showed translators files line by line with no context: no explanation of what triggered each line or what the slots meant. The result was translations that were grammatically fine but functionally broken — missing variables that crash skill responses, intent files with a single sentence that barely trains a classifier, dialog files that repeat because they only have one variant. It was also a hosted third-party dependency: community translation data living on someone else's platform.

## Built entirely on GitHub

OVOS Localize skips custom infrastructure and uses what GitHub already provides:

| What we need | GitHub equivalent |
|---|---|
| Web server / CDN | GitHub Pages (free, global) |
| Database | Git-tracked JSON files |
| Authentication | GitHub App tokens (scoped, ephemeral) |
| Background jobs | GitHub Actions |
| Form submission API | GitHub Issues with machine-readable bodies |
| Bot identity | GitHub App (`ovos-localize[bot]`) |
| Audit log | Pull request history |

The result is a static single-page app on GitHub Pages, reading JSON committed to the same repo, driven by six GitHub Actions workflows: `add_skill` registers a new skill repo, `enable_new_language` opens a language for translation, `submit_translation` turns a contribution into a pull request, `fix_lang_code` repairs non-canonical locale directory names, `poll_merged_fixes` watches for merged fixes and keeps the dashboard honest, and `update_data` rebuilds all editor and dataset files daily. No Docker, no cloud bill, no vendor.

Submitting a translation opens a GitHub Issue. `submit_translation` reads a machine-readable block in the issue body, mints a short-lived token scoped only to the target skill repo, creates a branch, commits the translation, opens a PR, and closes the issue — in seconds. The skill maintainer reviews the PR from there. You need nothing but a GitHub account.

## How it works

The **dashboard** is a heatmap: every registered OVOS skill against dozens of languages, colour-coded by translation coverage. Dark means complete; light means someone needs to help.

The **editor** is a three-panel view — source on the left, your translation in the middle, and a context card on the right. That context card is the key idea: it shows the Python handler that uses the file, the method source, the slots it expects, and what the skill says when it speaks these lines. You're not translating blind.

Those context cards come from real **Python AST analysis**. When the data pipeline sees `self.speak_dialog("query_weather")` in a skill method, it connects that dialog file to that handler and stores the source, so every file has provenance and every slot has a meaning.

**Validation runs before you submit.** OVOS Localize ships a dedicated parser and validator for each of the six locale file types it understands — `.intent`, `.voc`, `.dialog`, `.entity`, `.rx`, and `.value`:

- `.intent` files need at least 10 sentences after alternative-syntax expansion, must preserve every source `{slot}`, and must clear a lexical-diversity threshold so ten near-identical lines don't pass as ten examples.
- `.dialog` files need at least 2 variants and must preserve `{variable}` substitutions exactly — extra or missing variables are hard errors.
- `.entity` files need at least 5 examples for reliable slot filling.
- `.voc` files are keyword lists — non-empty, with short entries flagged if they look like whole sentences.
- `.rx` regexes must compile and keep their named groups; `.value` files must stay valid `display,value` CSV with the system value preserved.

If a translation trips any of these rules, you see it before you submit — not after a skill breaks in production.

## The Issues view

Scanning every registered skill surfaces problems beyond missing translations, in two buckets:

- **Bare language code warnings** — skills with locale directories named `eu` or `da` instead of the canonical `eu-ES` or `da-DK`. These are unambiguous in OVOS context (Basque is always `eu-ES`, Danish always `da-DK`), but they break coverage stats and confuse tooling. Since the fix is mechanical, we automated it: the "Request Auto-Fix" button opens an issue with a `FIX_LANG_CODE_META` block, `fix_lang_code` reads it, renames the directories using a scoped token, and opens a PR on the skill.
- **Validation rule violations** — intent files with too few or too-similar training examples, dialog files missing required variables, entity files below the example threshold. These need a human, so the "Report" button opens a pre-filled issue in the skill's own repository with a markdown table of exactly which files and lines are affected.

## Your translations become open data

Every translation contributed through OVOS Localize also feeds an open ML dataset. The same daily pipeline that builds the editor data generates six dataset formats:

- **Intent classification** — (utterance, skill, intent) triples for training classifiers
- **Parallel translation** — English ↔ target-language pairs for translation model fine-tuning
- **Slot filling** — templates, slot names, and entity values for NER training
- **Response pairs** — (utterance, response) pairs for dialogue model training
- **TTS corpus** — deduplicated dialog sentences for speech synthesis training
- **Skill metadata** — multilingual skill names and descriptions for discovery

These rebuild daily, split at 100 MB for GitHub compatibility, and export in HuggingFace Datasets layout, ready to publish. The more languages get translated, the richer this open corpus becomes.

## Get started

- **Translate skills** at [openvoiceos.github.io/ovos-localize](https://openvoiceos.github.io/ovos-localize/). Filter by your language on the dashboard, pick a skill with low coverage, and contribute.
- **Check the Issues view** for your language. Low-diversity intent files and missing dialog variants are easy fixes for a native speaker.
- **Add your skill** by opening a PR to add your `org/repo` to [`skills.txt`](https://github.com/OpenVoiceOS/ovos-localize/blob/dev/skills.txt). The pipeline picks it up on the next daily run.
- **Request a new language** via the "Can't find your language?" link in the language selector.
- **Fork it.** The platform is a repository — clone it, point it at your own skill list, and run your own instance.

For the technical architecture — GitHub App token handling, the AST context extraction, the full validation rule set — see the [OVOS Localize whitepaper](https://github.com/OpenVoiceOS/ovos-localize/blob/dev/docs/whitepaper.md).

---

> **Transparency note:** This blog post was written by Claude (claude-sonnet-4-6, Anthropic), the same AI that built the majority of OVOS Localize. Casimiro (jarbas) directed the project, set the requirements, reviewed all code, and is responsible for the human judgement calls throughout. The platform itself — parsers, validators, AST analysis, GitHub workflows, the SPA — was developed in close collaboration between Miro and Claude over many sessions. We think it's worth being upfront about that.

---

## Help us build voice for everyone

OpenVoiceOS is a mission, not just software. If you believe voice assistants should be open, inclusive, and user-controlled:

- **💸 Donate**: help fund development, infrastructure, and legal protection.
- **📣 Contribute open data**: share voice samples and transcriptions under open licenses.
- **🌍 Translate**: help make OVOS accessible in every language.

We're building this for people, not for profit. [Support the project here](https://www.openvoiceos.org/contribution)
