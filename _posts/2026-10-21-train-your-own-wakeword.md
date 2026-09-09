---
title: "Train Your Own Wake Word for OVOS: WakeForge and a Notebook Anyone Can Run"
excerpt: "Custom wake words have always been gated by data, especially recordings of your chosen phrase. WakeForge, a research-grade training suite, tackles this with frozen self-supervised featurizers and a public Colab/Kaggle notebook, so any user can train a personal wake word for their own name, language, or secret phrase."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-21T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## From Notebook to Wake Word

"Hey Mycroft" works fine, until you want your assistant to answer to your own name, a word in your language, or a private phrase nobody else would guess. A wake-word model is tiny. The exported files usually run under 1 MB. Training one has always been out of reach for most users anyway, because it takes data you don't have.

Two NGI0-funded deliverables close that gap: **WakeForge**, a wake-word trainer R&D suite, and a public, user-facing training notebook. Together they let you build a custom wake word yourself, on free cloud hardware, with no machine-learning background.

## Why Custom Wake Words Are Hard

A wake-word detector answers one question thousands of times a second: did someone just say the phrase, or not? Training it needs two kinds of audio. **Positive samples** are recordings of the wake phrase itself. **Negative audio** is everything else (speech, background noise, music) so the model learns what to ignore.

Negatives are easy to collect. The world is full of audio that isn't your wake word. Positives are the bottleneck. A dependable detector traditionally wants hundreds or thousands of recordings of the exact phrase. Those recordings need to come from many voices in many conditions. ww-trainer states the design target for a useful detector as better than ~90% recall, without false-triggering more than once per hour. No individual user records that much data. That data problem is why "just train your own" was never a real option before.

---

## What WakeForge Is

[WakeForge](https://github.com/TigreGotico/wakeforge) is a research-grade training suite for wake-word detection. The package on PyPI is `wakeforge`; its CLI commands and Python module still carry the older name **ww_trainer**, so you see both names. It is not one fixed model but an experimentation surface: **11 built-in featurizers × 15 classifier heads × 15 loss functions**, driven by genetic and Bayesian hyperparameter search, plus 12 notebooks covering the pipeline from data prep to export. A researcher can sweep architectures and losses; a user can skip all of that and run one notebook.

Every component exports to ONNX, so the trained models run anywhere: inference needs only `onnxruntime` and `numpy`, no PyTorch on the device. Detectors span hardware tiers from `esp32_nano` (sub-1 KB, int8) up to `hubert_medium`, so the same suite targets a microcontroller or a GPU server.

The trick behind small-data training is **frozen self-supervised featurizers**. Self-supervised speech models such as HuBERT and Wav2Vec2-BERT already learned general representations of human speech from large amounts of unlabeled audio. WakeForge uses these as pre-exported ONNX front-ends and keeps them frozen, training only a small classifier head on top. (The HuBERT path has its own notebook, `nb08_wakehubert.ipynb`, if you want to see how it works internally.)

Because the speech understanding is already done, that head needs far less of your own data. Freezing the featurizer also keeps training and inference features identical. The trade-off, stated plainly by the project, is that a frozen featurizer can't adapt to your data the way a fully-trained one could.

## Solving the Data Problem

Better features lower the bar, but you still need some positives and plenty of negatives. WakeForge ships both:

- **Synthetic positives**: no recordings of your phrase? The `ww_trainer-datagen` command (the `datagen` extra) generates them with TTS plus pure-ONNX voice conversion ([voiceclonnx](https://github.com/TigreGotico/voiceclonnx)), synthesizing positives across many voices and styles. Ready-made [synthetic wake-word datasets](https://huggingface.co/collections/TigreGotico/synthetic-wakeword-datasets) are published as examples; the older standalone [synthetic_dataset_generator](https://github.com/TigreGotico/synthetic_dataset_generator) repository is archived.
- **[notwakeword datasets](https://huggingface.co/collections/TigreGotico/notwakeword-datasets)**: curated negative/background collections, so you don't assemble hours of "everything except the wake word" yourself. Larger runs add hard-negative mining on top (training on extra negatives that sound close to the wake word, so the model learns the fine distinctions).
- **[ONNX feature extractors](https://huggingface.co/collections/TigreGotico/onnx-feature-extractors)**: the frozen self-supervised front-ends, exported so training and runtime use the same features.

The project's own caveat: synthetic data is good for getting a model working and smoke-testing it, but a wake word you rely on every day still benefits from some real, far-field recordings in the mix.

---

## Train It Yourself

The [public quickstart notebook](https://github.com/TigreGotico/wakeforge/blob/dev/notebooks/kaggle_quickstart.ipynb), `kaggle_quickstart`, is the user-facing entry point. It runs on a free Colab or Kaggle GPU (a T4, a common free-tier cloud graphics card), so you need only a browser. A full run takes roughly 25 to 40 minutes.

If you'd rather skip the notebook, the same flow is a CLI command. Install the package from PyPI with the `datagen` and `torchcodec` extras (prerelease versions only, so ask for them) and call the quickstart:

```bash
pip install --pre "wakeforge[datagen,torchcodec]"
ww_trainer-quickstart --wake-word "hey jarvis" --output-dir ./hey_jarvis
# -> ./hey_jarvis/model/best_f1.onnx  (featurizer alongside it under model/)
```

The flow underneath:

```text
1. Bring or generate positives
   - Record a handful of samples of your phrase, OR
   - Use the synthetic generator to create them with TTS / voice conversion
2. Pick negatives
   - Grab a notwakeword dataset for background/speech audio
3. Train
   - Frozen SSL featurizer -> small classifier head
4. Export to ONNX
   - Produces a featurizer .onnx + a head .onnx
5. Load it in OVOS
   - via the ovos-ww-plugin-wakeforge runtime plugin
```

Step 5 is the step users most often get wrong. A WakeForge model is a **featurizer + head ONNX pair**, and the plugin that loads exactly that pair is **[ovos-ww-plugin-wakeforge](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge)**. In `mycroft.conf`, point one hotword at the two files (local paths or URLs) and set a detection `threshold`. The plugin handles the rest:

- Score smoothing (`smoothing`, default `ema`, with `ema_alpha` and `window_size`).
- A `patience` count of consecutive frames before firing (default 3).
- A debounce interval, `debounce_sec` (default 1.0), the minimum gap between repeat firings.
- An optional `vad` (voice activity detection, a separate check for "is anyone speaking at all") channel.
- A stateful `streaming` GRU (a small recurrent neural-network layer that keeps a memory of recent audio) head.

Those keys and defaults are read from version 0.0.1a2 of the plugin, installed with `pip install --pre ovos-ww-plugin-wakeforge`; it pulls only `onnxruntime`, no PyTorch.

WakeForge exports use their own format. They don't drop into the Precise, microWakeWord or wakewordlab plugins, which each load different model types.

## Why This Matters

Wake words used to be fixed: your assistant answered only to the phrases someone else picked and trained for you. Local, user-trainable wake words change that: pick any name, in any language, and detection runs entirely on your device once the model is trained. No cloud service hears your phrase at that stage. Training itself, using the recommended notebook flow, runs on cloud GPUs, and synthetic data generation calls a cloud TTS service, so the pipeline as a whole is not offline end-to-end. Only inference is.

Results depend on your data and your phrase, and a production detector still wants some real recordings. No trained default wake-word models ship from this work yet; what ships is the trainer, the notebook and the runtime plugin. Training a custom wake word is no longer a research project. It is a notebook you can open, and one entry in a wider collection of OVOS training notebooks for wake words, voices and intents. Bugs and questions go to the [wakeforge issue tracker](https://github.com/TigreGotico/wakeforge/issues).

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
