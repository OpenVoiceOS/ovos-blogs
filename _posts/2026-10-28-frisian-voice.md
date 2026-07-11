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

Most of the world's languages have no synthetic voice. Not because they don't deserve one, but because building text-to-speech has always meant costly recordings, closed toolchains, and a commercial reason to bother. For a language with a few hundred thousand speakers and no market to chase, that reason rarely shows up.

We think that's exactly backwards. Open voice technology should serve the languages that commercial vendors pass over. Today we get to share a new voice that does just that, and we're even happier about *how* it arrived: a member of our community trained it.

---

## Meet the Frisian Voice

Frisian (Frysk, `fy-NL`) is a minority language of the Netherlands, spoken mainly in the province of Friesland. It's an official language with a small, proud speaker community and almost no commercial voice-tech support behind it. It is precisely the kind of language open voice tech exists for.

OVOS now has a Frisian voice, trained by community contributor **fdemelo**. It runs on **phoonnx**, our neural TTS engine, and ships as the "dii" speaker. You can find the model here:

**[OpenVoiceOS/phoonnx_fy-NL_dii_unicode](https://huggingface.co/OpenVoiceOS/phoonnx_fy-NL_dii_unicode)**

A warm, genuine thank-you to fdemelo for the time and care poured into this. This is the community at its best: someone noticed a language that deserved a voice and decided to give it one.

---

## What phoonnx Actually Is

phoonnx is a multilingual phonemization and text-to-speech library built around ONNX models. Under the hood, a voice like the Frisian one is a VITS neural model exported to ONNX, so it runs fast and fully offline on ordinary hardware, no GPU and no cloud round-trip required.

The other half of phoonnx is phonemization: turning written text into the sound units a model can learn from. phoonnx supports a whole family of phonemizers, from `espeak-ng` and gruut to model-based grapheme-to-phoneme engines. It also carries a plain Unicode phonemization path, which is what the `_unicode` in the Frisian model's name refers to. That path matters for minority languages: when no polished pronunciation tool exists for a language yet, you can still train a working voice straight from its written form instead of waiting for tooling that may never come.

---

## Train a Voice for YOUR Language

Here's the part we're most excited about. The tools fdemelo used are not locked away. They're public notebooks, and they're waiting for you:

- **[TTS training notebook (VITS)](https://github.com/TigreGotico/notebooks/blob/main/tts/train_vits.ipynb)** — trains a phoonnx/VITS voice end to end.
- **[Synthetic dataset generation guide](https://github.com/TigreGotico/notebooks/blob/main/tts/tts_dataset_gen.ipynb)** — helps you build a training corpus when you don't already have hours of recorded speech.

The pipeline, in rough strokes, looks like this:

1. **Gather a dataset** of `(text, audio)` pairs in your language.
2. **Phonemize** the text so the model learns how words are pronounced.
3. **Train** a VITS / phoonnx model on those pairs.
4. **Export** the trained model to ONNX.
5. **Publish** it on HuggingFace so anyone can use it.
6. **Use it in OVOS** by pointing your TTS plugin at your model.

For the Frisian voice specifically, that last step is a few lines in your OVOS config:

```json
"tts": {
  "module": "ovos-tts-plugin-phoonnx",
  "ovos-tts-plugin-phoonnx": {
    "lang": "fy-NL",
    "voice": "OpenVoiceOS/phoonnx_fy-NL_dii_unicode"
  }
}
```

That's it. No proprietary licenses, no cloud training bill you can't afford, no vendor deciding your language isn't worth their engineers' time.

And if you're working with a low-resource language where recorded speech is scarce, the synthetic dataset generation guide is there to help you bootstrap a corpus. It's how a language with little existing data can still end up with a real, usable voice.

---

## Part of a Growing Family

Frisian isn't alone. OVOS already ships community and minority-language voices for **Asturian** (`phoonnx_ast_*`) and **Aragonese** (`phoonnx_an_*`), built with the very same phoonnx pipeline. Frisian is the newest member of that family, and it won't be the last: we keep training further minority-language voices, and every one we finish makes the next one easier.

If your language isn't on the list yet, that's not a "no." That's an invitation.

---

## Why This Matters

A voice for a language is a small act of preservation. It says the language belongs in the future, not only the past: in the devices we talk to, the assistants we build, the tools our children will grow up using.

Doing it the OVOS way means:

- **No commercial gatekeepers.** No one gets to decide your language is too small to matter.
- **Fully local and offline.** The voice runs on your device. Nothing is sent to a server.
- **Community-owned.** The model, the notebooks, and the pipeline are all open. What fdemelo built, anyone can inspect, improve, and build upon.

Language technology shouldn't be a privilege the market hands out. It should be something a community can build for itself. The Frisian voice is proof that it can, and the notebooks are how we hand you the keys.

We can't wait to hear what your language sounds like.

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
