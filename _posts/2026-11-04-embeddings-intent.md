---
title: "Teaching OVOS to Match Meaning: Embeddings-Based Intent Parsing"
excerpt: "Intent matching has always leaned on keyword and template engines. This R&D work explores semantic-embedding pipelines that generalize to unseen phrasings, alongside strong minimal-dependency baselines for constrained devices."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-11-04T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Teaching OVOS to Match Meaning: Embeddings-Based Intent Parsing

Ask a voice assistant "what's the forecast" when a skill only knows "what's the weather," and a keyword engine misses. Nobody wrote down that phrasing, so it doesn't match. That gap is why we built new intent-matching pipelines for OVOS that work on meaning instead of exact words — and why we're also publishing strong no-dependency baselines for devices too small to run them.

Intent matching decides which skill handles what you said. OVOS has long relied on keyword and template engines like **Padatious** and **Adapt**. They are fast, transparent, and run comfortably on a Raspberry Pi, but they only recognize phrasings someone anticipated. Every new way of asking the same question means another line added to a training list.

This R&D explored a different approach: match by meaning. It produced several pipelines, not one winner — the comparison itself is the result. All of them register under the same `opm.pipeline` entry point, so switching between them is a configuration change, not a rewrite.

---

## What Shipped

**Embeddings turn a sentence into a vector.** Sentences with similar meaning land near each other in that space, so "what's the forecast" and "what's the weather" end up as neighbors even though they share no words. Matching becomes a nearest-neighbor search instead of a template check, and the effect often carries across languages, since multilingual embedding spaces tend to place the same meaning in the same region regardless of which language it was spoken in.

One consequence matters beyond accuracy: if each intent is represented by stored example vectors ("prototypes") and matching just finds the nearest one, adding or removing an intent needs no retraining. You add or drop example vectors and you're done — useful on a system where skills get installed and uninstalled at will.

Two pipelines came out of this work, targeting different resource budgets:

- **[ovos-m2v-pipeline](https://github.com/OpenVoiceOS/ovos-m2v-pipeline)** uses model2vec, which distills a full sentence-transformer into small, fast *static* embeddings — no transformer forward-pass at inference time. It supports two modes: a trained classifier head (a hierarchical domain-then-intent classifier) for sharper decision boundaries on a fixed intent set, and a **prototype mode** that drops the head entirely and matches by nearest neighbor, trading some accuracy for the ability to add or remove intents without retraining ([PR #30](https://github.com/OpenVoiceOS/ovos-m2v-pipeline/pull/30)). It stays tiny and CPU-friendly — a good fit for embedded hardware.

- **[ovos-hierarchical-knn-pipeline](https://github.com/OpenVoiceOS/ovos-hierarchical-knn-pipeline)** pairs IBM Granite embeddings with a FAISS vector index. Granite runs as an ONNX model with CLS pooling at 768 dimensions, and the pipeline ships an AVX2 `quint8` build, a `uint8` build, and full-precision F32, so the same code adapts to what a given CPU can do. FAISS handles fast k-nearest-neighbor search over the stored examples, with L2-normalized vectors so nearest-neighbor becomes cosine similarity. It trades a larger footprint — `faiss-cpu` plus the Granite weights — for potentially better semantic discrimination.

Both plug into the OVOS pipeline as OPM intent plugins, exactly like Padatious or Adapt.

Not every device wants to load an embedding model. A voice satellite with tight memory, no GPU, and a need for instant cold starts is a real target, so this work also produced two minimum-dependency baselines that download no weights and warm up instantly:

- **[nebulento](https://github.com/OpenVoiceOS/nebulento)** is a fuzzy matcher built on `rapidfuzz`, offering several string-similarity strategies (ratio, Damerau-Levenshtein, and others) so you can trade precision against recall per deployment.
- **[palavreado](https://github.com/OpenVoiceOS/palavreado)** is a keyword-and-entity engine in the Adapt tradition: each intent is a set of required and optional keyword slots, an intent fires only when every required slot is filled, and optional regex or simplematch patterns pull out entities.

Both are tiny and fast, with near-zero footprint. They will never generalize the way an embedding model can, but they set an honest baseline, and on constrained hardware they may be the right answer outright.

---

## Measuring It Honestly

We are not declaring a winner, because we don't have the numbers to back one yet. nebulento's own README publishes per-strategy accuracy on OVOS evaluation datasets like `intents-for-eval` and `massive`, useful for tuning nebulento itself but not a cross-pipeline comparison. Systematic, apples-to-apples benchmarking across all of these pipelines is running through the **OVOS Plugin Arena's intent prediction runner**, which tests each plugin against shared datasets under identical conditions. That work is ongoing; there is no published cross-pipeline leaderboard yet, and this post makes no accuracy or ranking claims.

---

## Why This Matters

The point isn't to crown one intent engine — it's to give OVOS a spectrum of options that all speak the same OPM plugin interface:

- Better generalization: matching by meaning routes unseen phrasings correctly.
- Multilingual reach: embedding spaces often align related meanings across languages.
- No retraining to edit intents: prototype-style matching adds and removes examples freely.
- Swappable plugins: a device picks the tool that fits its budget, from a near-zero-footprint fuzzy matcher up to a Granite-plus-FAISS semantic index.

Voice assistants run on everything from beefy servers to tiny satellites. This work aims to make sure an intent engine fits whatever the hardware is, and that choosing between them stays a config change, not a rewrite.

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
