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

Every time you speak to a voice assistant, something has to decide *which skill you meant*. Say "what's the weather," and the assistant has to route those words to the weather skill and nothing else. This is intent matching, and it is one of the oldest, most load-bearing problems in the whole pipeline.

Historically, OVOS has solved it with keyword and template engines like **Padatious** and **Adapt**. These are fast, transparent, and run comfortably on a Raspberry Pi. But they share a weakness: they only recognize what you told them to expect. If a skill was trained on "what's the weather" but a user asks "what's the forecast," a keyword engine can simply miss, because nobody enumerated that phrasing. You end up maintaining ever-growing lists of example sentences, one per way of saying the same thing.

This embeddings-based intent R&D set out to explore a different question: what if intent matching worked on *meaning* instead of *words*? This is research and exploration, not a single finished winner. We built and compared several pipelines, and the interesting result is the comparison itself. Crucially, all of them register under the same `opm.pipeline` entry point, so swapping one for another is a configuration change rather than a rewrite.

---

## The Embedding Approach

An embedding turns a sentence into a vector, a point in a high-dimensional space where sentences with similar meaning land near each other. "What's the forecast" and "what's the weather" end up as neighbours even though they share almost no words.

For intent matching, this changes the game. Instead of asking "does this utterance match a template," you ask "which registered intent example is this utterance *closest* to in meaning." The payoff is generalization to phrasings never seen in training, and it often carries across languages too, because multilingual embedding spaces tend to place the same meaning near the same region regardless of the language it was spoken in.

There is a second, subtler payoff. Similarity matching does not *require* a trained classifier on top of the embeddings. If you keep a stored example (a "prototype") for each intent and just find the nearest one, then **adding or removing an intent needs no retraining at all** — you add or drop its example vectors and you are done. That property matters enormously for a system where skills are installed and uninstalled at will.

---

## Two Embedding Pipelines

We built two distinct semantic pipelines, deliberately targeting different resource budgets.

The first is **[ovos-m2v-pipeline](https://github.com/OpenVoiceOS/ovos-m2v-pipeline)**, built on model2vec. model2vec produces very small, fast *static* embeddings, distilled down from a full sentence-transformer so there is no transformer forward-pass at inference time. The pipeline supports two modes, and it is worth being precise about this: it can train and run a **classifier head** on top of those embeddings (a hierarchical domain-then-intent classifier), *and* it has a **prototype mode** that drops the head entirely ([PR #30](https://github.com/OpenVoiceOS/ovos-m2v-pipeline/pull/30)). In prototype mode, each intent is represented by stored example embeddings and matching is pure nearest-neighbour similarity — so intents can be added or removed with no retraining step. The classifier mode can squeeze out sharper decision boundaries when the intent set is fixed; the prototype mode buys flexibility. The whole thing stays tiny and CPU-friendly, a strong fit for embedded hardware.

The second reaches for richer representations: **[ovos-hierarchical-knn-pipeline](https://github.com/OpenVoiceOS/ovos-hierarchical-knn-pipeline)**, whose `HierarchicalKNNIntentPipeline` pairs **IBM Granite embeddings** with a **FAISS** vector index. Granite runs as an ONNX model with CLS pooling at 768 dimensions, and the pipeline ships several quantized variants (an AVX2 `quint8` build, a `uint8` build, and full-precision F32) so the same code adapts to what a given CPU can do. FAISS provides the fast k-nearest-neighbour search over the stored intent examples, with L2-normalized vectors so nearest-neighbour becomes cosine similarity — and it stays fast even as the number of registered examples grows. This trades a larger footprint (`faiss-cpu` plus the Granite weights) for potentially better semantic discrimination.

Both drop into the OVOS pipeline as OPM intent plugins, exactly like Padatious or Adapt.

---

## Don't Forget the Baselines

Not every device wants to load an embedding model. A voice satellite with tight memory, no GPU, and a preference for instant cold starts is a real and common target. So part of this work was building a strong *non-ML floor* — engines that download no weights and warm up instantly.

Two minimum-dependency engines fill that role. **[nebulento](https://github.com/OpenVoiceOS/nebulento)** is a fuzzy matcher built on `rapidfuzz`; it offers a family of string-similarity strategies (ratio, Damerau-Levenshtein and others) so you can trade precision against recall per deployment. **[palavreado](https://github.com/OpenVoiceOS/palavreado)** is a keyword-and-entity engine in the Adapt tradition: each intent is a set of **required** and **optional** keyword slots, an intent fires only when every required slot is filled, and optional regex or simplematch autoregex patterns pull out entities. Both are tiny, fast, and carry near-zero footprint — nothing to fetch, nothing to warm up. They will never generalize the way an embedding model can, but they establish an honest baseline, and on constrained hardware they may simply be the right answer.

---

## Measuring It Honestly

It would be easy to declare a winner here. We are deliberately not doing that, because we do not yet have the numbers to back such a claim.

nebulento's own README does publish per-strategy accuracy on OVOS evaluation datasets like `intents-for-eval` and `massive`, which is useful for tuning nebulento itself — but that is a single engine measured against a fixed set of strategies, not a cross-pipeline comparison. Systematic, apples-to-apples benchmarking *across* all of these pipelines is being carried out through the **OVOS Plugin Arena's intent prediction runner**, which runs each plugin against shared datasets under identical conditions. That benchmarking work is ongoing, there is no published cross-pipeline leaderboard yet, and this post makes no accuracy or ranking claims. When the Arena results are ready, they will speak for themselves.

---

## Why This Matters

The point of this exploration is not to crown one intent engine. It is to give OVOS a *spectrum* of options that all speak the same OPM plugin interface:

- **Better generalization**, matching by meaning so unseen phrasings still route correctly.
- **Multilingual reach**, since embedding spaces often align related meanings across languages.
- **No retraining to edit intents**, because prototype-style similarity matching adds and removes examples freely.
- **Swappable plugins**, so a device can pick the right tool for its budget, from a near-zero-footprint fuzzy matcher up to a Granite-plus-FAISS semantic index.

Voice assistants run everywhere from beefy servers to tiny satellites. The goal of this research is to make sure that whatever the hardware, there is an intent engine that fits, and that choosing between them is a config change, not a rewrite.

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
