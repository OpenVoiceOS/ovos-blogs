---
title: "A Frisian Voice for OVOS — and the Notebooks to Train Your Own"
excerpt: "Community contributor fdemelo trained a Frisian (Frysk / fy-NL) text-to-speech voice with phoonnx, our open ONNX neural TTS engine. And because the training notebooks are public, you can now do the same for your language."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-28T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## A Frisian Voice for OVOS

Most languages have no synthetic voice. Not because they don't deserve one, but because building text-to-speech has always meant costly recordings, closed toolchains, and a market big enough to justify the work. A language with a few hundred thousand speakers rarely clears that bar for commercial vendors.

OVOS now has a Frisian voice, and a community member built it, not us. Here's the voice, how it works, and how to train one for your own language.

---

## Meet the Frisian Voice

Frisian (Frysk, `fy-NL`) is a minority language of the Netherlands, spoken mainly in the province of Friesland. It's an official language with a small speaker community and almost no commercial voice-tech support.

Community contributor **fdemelo** trained the voice. It runs on **phoonnx**, our neural TTS engine, and ships as the "dii" speaker:

**[OpenVoiceOS/phoonnx_fy-NL_dii_unicode](https://huggingface.co/OpenVoiceOS/phoonnx_fy-NL_dii_unicode)**

Thank you to fdemelo for the work. Someone noticed a language without a voice and gave it one.

---

## What phoonnx Actually Is

phoonnx is a multilingual phonemization and text-to-speech library built around ONNX models — a portable model format that runs fast without a GPU. The Frisian voice is a VITS neural model exported to ONNX, so it runs fully offline on ordinary hardware.

The other half of phoonnx is phonemization: turning written text into the sound units a model can learn from. phoonnx supports several phonemizers, from `espeak-ng` and gruut to model-based grapheme-to-phoneme engines. It also has a plain Unicode phonemization path — the `_unicode` in the Frisian model's name refers to it. That path matters for minority languages: when no pronunciation tool exists yet for a language, you can still train a working voice straight from its written form instead of waiting for tooling that may never come.

---

## Train a Voice for Your Language

The tools fdemelo used are public:

- **[TTS training notebook (VITS)](https://github.com/TigreGotico/notebooks/blob/main/tts/train_vits.ipynb)** — trains a phoonnx/VITS voice end to end.
- **[Synthetic dataset generation guide](https://github.com/TigreGotico/notebooks/blob/main/tts/tts_dataset_gen.ipynb)** — builds a training corpus when you don't already have hours of recorded speech.

The pipeline, in rough strokes:

1. **Gather a dataset** of `(text, audio)` pairs in your language.
2. **Phonemize** the text so the model learns how words are pronounced.
3. **Train** a VITS / phoonnx model on those pairs.
4. **Export** the trained model to ONNX.
5. **Publish** it on HuggingFace so anyone can use it.
6. **Use it in OVOS** by pointing your TTS plugin at your model.

For the Frisian voice, that last step is a few lines in your OVOS config:

```json
"tts": {
  "module": "ovos-tts-plugin-phoonnx",
  "ovos-tts-plugin-phoonnx": {
    "lang": "fy-NL",
    "voice": "OpenVoiceOS/phoonnx_fy-NL_dii_unicode"
  }
}
```

No proprietary licenses, no cloud training bill, no vendor deciding your language isn't worth the engineering time.

If you're working with a low-resource language where recorded speech is scarce, the synthetic dataset generation guide helps you bootstrap a corpus from little existing data.

---

## Part of a Growing Family

Frisian isn't alone. OVOS already ships community and minority-language voices for **Asturian** (`phoonnx_ast_*`) and **Aragonese** (`phoonnx_an_*`), built with the same phoonnx pipeline. Frisian is the newest addition, and more are in progress: each finished voice makes the next one easier.

If your language isn't on the list yet, that's an invitation, not a no.

---

## Why This Matters

A voice for a language is a small act of preservation. It says the language belongs in the future — in the devices we talk to, the assistants we build, the tools the next generation will use.

Doing it the OVOS way means:

- **No commercial gatekeepers.** No one decides your language is too small to matter.
- **Fully local and offline.** The voice runs on your device. Nothing goes to a server.
- **Community-owned.** The model, the notebooks, and the pipeline are all open. What fdemelo built, anyone can inspect, improve, and build on.

Language technology shouldn't be a privilege the market hands out. It should be something a community can build for itself. The Frisian voice is proof that it can. The notebooks are how we hand you the keys.

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
