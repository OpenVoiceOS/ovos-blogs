---
title: "Train Your Own Wake Word for OVOS: WakeForge and a Notebook Anyone Can Run"
excerpt: "Custom wake words have always been gated by data — especially recordings of your chosen phrase. WakeForge, a research-grade training suite, tackles this with frozen self-supervised featurizers and a public Colab/Kaggle notebook, so any user can train a personal wake word for their own name, language, or secret phrase."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-21T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Train Your Own Wake Word for OVOS

Saying "Hey Mycroft" works fine, until you want your assistant to answer to something else. Maybe you want it to wake to your own name, a word in your language, or a private phrase nobody else would guess. On paper, a wake word is a tiny model — the exported files are typically under 1 MB. In practice, training one has always been out of reach for most users, and the reason is almost always data.

Two NGI0-funded deliverables are now complete: the wake-word trainer R&D suite — **WakeForge** — and a **public, user-facing wake-word training notebook**. Together they make custom wake words something you can build yourself, on free cloud hardware, without a machine-learning background.

## Why Custom Wake Words Are Hard

A wake-word detector answers one question thousands of times per second: *did someone just say the phrase, or not?* To learn that, it needs two kinds of audio. First, **positive samples** — recordings of the wake phrase itself. Second, **negative audio** — lots of speech, background noise, music, and everyday sound that is *not* the wake word, so the model learns what to ignore.

Collecting negatives is tedious but easy; there is endless audio in the world that isn't your wake word. The real bottleneck is positives. A robust detector traditionally wants hundreds or thousands of recordings of the exact phrase, spoken by many voices, in many conditions — enough to fire reliably (better than ~90% recall) while almost never false-triggering (under one false alarm per hour). No individual user is going to record that. This single data problem is why "just train your own" has never been a real answer, until now.

---

## What WakeForge Is

[WakeForge](https://github.com/TigreGotico/ww-trainer) is a research-grade training suite for wake-word detection. It is not one fixed model — it's a whole experimentation surface: **11 built-in featurizers × 15 classifier heads × 15 loss functions**, driven by genetic and Bayesian hyperparameter search, plus 12 notebooks that document the full pipeline from data prep to export. A researcher can sweep architectures and losses; a user can ignore all of that and run one notebook.

Every component exports to ONNX, and that is the point that makes the models deployable everywhere: runtime inference needs only `onnxruntime` and `numpy` — no PyTorch on the device. Trained detectors span hardware tiers from `esp32_nano` (sub-1 KB, int8) up to `hubert_medium`, so the same suite targets an ESP32 microcontroller or a GPU server.

The trick that makes small-data training work is **frozen self-supervised featurizers**. Self-supervised speech models — like HuBERT and Wav2Vec2-BERT — have already learned rich, general representations of human speech from large amounts of unlabeled audio. WakeForge uses these as pre-exported ONNX front-ends and keeps them **frozen**, training only a small classifier head on top. (The HuBERT path has its own notebook, `nb08_wakehubert.ipynb`, if you want to look under the hood.)

Because the heavy lifting of understanding speech is already done, that little head needs far less of your own data to reach a usable result. Freezing the featurizer also guarantees the features are identical at training and inference time — the honest trade-off, which the project states plainly, being that a frozen featurizer can't adapt to your data the way a fully-trained one could.

## Solving the Data Problem

Better features lower the bar, but you still need *some* positives and plenty of negatives. WakeForge ships the pieces to get both:

- **[Synthetic dataset generator](https://github.com/TigreGotico/synthetic_dataset_generator)** — when you have zero recordings of your phrase, generate them. It uses TTS plus pure-ONNX voice conversion ([voiceclonnx](https://github.com/TigreGotico/voiceclonnx)) to synthesize positive samples across many voices and styles. Ready-made [synthetic wake-word datasets](https://huggingface.co/collections/TigreGotico/synthetic-wakeword-datasets) are published as examples.
- **[notwakeword datasets](https://huggingface.co/collections/TigreGotico/notwakeword-datasets)** — curated negative/background collections, so you don't have to assemble hours of "everything except the wake word" yourself. For larger runs the suite adds hard-negative mining on top.
- **[ONNX feature extractors](https://huggingface.co/collections/TigreGotico/onnx-feature-extractors)** — the frozen self-supervised front-ends, exported to ONNX so the same features used in training are available efficiently at runtime.

A fair warning the project makes itself: synthetic data is excellent for getting a model working and smoke-testing it, but a wake word you rely on every day still benefits from some **real, far-field recordings** in the mix.

---

## Train It Yourself

The [public quickstart notebook](https://github.com/TigreGotico/ww-trainer/pull/20) — `kaggle_quickstart` — is the user-facing entry point. It runs on a free Colab or Kaggle GPU, so you need nothing more than a browser; a full run takes roughly 25–40 minutes on a free Kaggle T4. On the command line it collapses to a single string:

```bash
wakeforge-quickstart "hey jarvis" ./hey_jarvis
# -> ./hey_jarvis/best_f1_featurizer.onnx  +  ./hey_jarvis/best_f1.onnx
```

Under the hood, the flow is:

```text
1. Bring or generate positives
   - Record a handful of samples of your phrase, OR
   - Use the synthetic generator to create them with TTS / voice conversion
2. Pick negatives
   - Grab a notwakeword dataset for background/speech audio
3. Train
   - Frozen SSL featurizer -> small classifier head
4. Export to ONNX
   - Produces a featurizer .onnx + a head .onnx (best_f1_featurizer.onnx + best_f1.onnx)
5. Load it in OVOS
   - via the ovos-ww-plugin-wakeforge runtime plugin
```

Step 5 is the part it's easy to get wrong: a WakeForge model is a **featurizer + head ONNX pair**, and the plugin built to load exactly that pair is **[ovos-ww-plugin-wakeforge](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge)**. In `mycroft.conf` you point one hotword at the two files (local paths or URLs) and set a detection `threshold`; the plugin adds the runtime niceties a real always-on detector needs — score smoothing, a `patience` count of consecutive frames before firing, a debounce interval, an optional VAD channel, and a stateful streaming GRU head. Point it at your exported files and your assistant starts listening for *your* word. (WakeForge exports are their own format — they aren't drop-in for the Precise, microWakeWord, or wakewordlab plugins, which each load their own model types.)

## Why This Matters

Wake words are the front door to a voice assistant, and until now that door came with a fixed set of keys. Local, user-trainable wake words change that. You can pick any name, in any language, and keep the whole pipeline offline — no cloud service ever hears your phrase, because detection runs entirely on your device. Personal, private, and yours to name.

We didn't invent accuracy claims here, and we won't; results depend on your data and your phrase, and a production detector still wants some real recordings. What we *can* say is that the barrier has moved. Training a custom wake word is no longer a research project. It's a notebook you can open right now — and it's one entry in a wider collection of OVOS training notebooks for wake words, voices, and intents.

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
