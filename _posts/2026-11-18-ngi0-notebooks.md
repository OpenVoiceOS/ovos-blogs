---
title: "One Notebook Per Thing You Want to Build: The OVOS Training Notebooks"
excerpt: "A single collection of runnable, documented notebooks for training OVOS voices, wake words, and intent classifiers — plus benchmarking and interoperability recipes. Open a browser, run a cell, build the piece you need."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-11-18T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## One Notebook Per Thing You Want to Build

Across this series we've written about a lot of things you *can* build on OpenVoiceOS — a wake word tuned to your own name, a text-to-speech voice for a language the market ignores, an intent parser that matches meaning instead of keywords. Each of those posts ends with the same implicit promise: *you can do this yourself.*

This post is about making that promise concrete. Gathered into one place is a collection of documented, runnable notebooks — one per thing you might actually want to build — that turn "you can do this" into "open this notebook and run it." Most run on free Colab or Kaggle GPUs, so the price of entry is a browser and some curiosity.

It's an NGI0 deliverable in its own right, and it ties together the training work from the rest of the grant into a single, navigable entry point.

---

## Voices

If you want to give OVOS a new voice — your own, a character's, or a language that has none:

- **`train_vits`** — train a phoonnx/VITS text-to-speech voice end to end, from a dataset of paired text and audio through to an ONNX model you can drop into OVOS.
- **`tts_dataset_gen`** — build the training corpus in the first place, including synthetic-data recipes for low-resource languages where recorded speech is scarce.
- **`asr2tts`** — turn existing speech recordings into a TTS-ready dataset by transcribing them, a practical shortcut when you have audio but no transcripts.

## Wake Words

If you want your assistant to answer to something other than the default:

- **`kaggle_quickstart_ww`** — the user-facing quickstart for training a custom wake word with WakeForge, the no-prior-ML-experience path.
- **`synthetic_ww_dataset`** — generate the positive samples of your wake phrase you almost certainly don't have thousands of recordings of.
- **`tts2ww_full_pipeline`** — the whole journey in one place: synthesize a wake-word dataset with TTS, then train a detector on it.

## Intents

If you want to explore how OVOS decides which skill you meant:

- **`ovos_intent_classifier_monolingual`** and **`ovos_intent_classifier_multilingual`** — train and evaluate embedding-based intent classifiers, single-language and cross-language.
- **`ovos_intent_benchmark`** — run intent pipelines against shared datasets under identical conditions, the reproducible way to compare engines.

## And a few more

The collection also carries recipes beyond training: **`speaker_verification`** for enrolling household voices, **`bus_message_validation`** for checking messages against the OVOS pydantic models, **`interop_mcp_utcp_clients`** for calling OVOS speech servers as tools from an agent, and **`arena_prediction_runner`** for producing the predictions the Plugin Arena ranks.

---

## Why Notebooks

There's a deliberate choice here. We could have written more prose, more reference docs, more "here's how it works in principle." Instead, the artifact is a thing you *run*. A notebook is documentation that executes: it explains a step and then performs it, in front of you, on real data, with output you can inspect. When it finishes, you don't have a summary of how training works — you have a trained model.

That matters most for the people these are really for: not just ML engineers, but curious users, language communities, tinkerers, and educators who want to build something for themselves without a research background. Voice technology shouldn't be a thing that only large labs can make. A notebook you can open in a browser is one of the most honest ways we know to say *this is yours to build.*

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
