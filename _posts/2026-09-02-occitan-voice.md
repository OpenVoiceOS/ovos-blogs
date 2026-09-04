---
title: "An Occitan Voice for OVOS"
excerpt: "Two new text-to-speech voices for Occitan, miro and dii, built with phoonnx by fine-tuning the closest available donor language rather than starting from nothing."
coverImage: "/assets/blog/common/cover.png"
date: "2026-09-02T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/common/cover.png"
---

We've written before about building
[TTS voices for Asturian and Aragonese](https://blog.openvoiceos.org/posts/2025-12-09-ast)
by cloning a donor voice onto a large multi-speaker ASR dataset. The same
approach now has a third result: two new voices for
**[Occitan](https://en.wikipedia.org/wiki/Occitan_language)**, a Romance
language spoken across southern France, parts of Italy and Spain's Val
d'Aran, with far less speech-technology support than the languages around it.

## Miro and Dii, in Occitan

The two voices are
[`phoonnx_oc_miro_unicode`](https://huggingface.co/OpenVoiceOS/phoonnx_oc_miro_unicode)
(male) and
[`phoonnx_oc_dii_unicode`](https://huggingface.co/OpenVoiceOS/phoonnx_oc_dii_unicode)
(female) — the same donor-voice pair used for the Asturian and Aragonese
releases. Instead of training from scratch, each was fine-tuned from the
matching Aragonese model (`phoonnx_an_miro_unicode` and
`phoonnx_an_dii_unicode`), Aragonese being the closest available language
to Occitan among our existing voices. The training data is
[`tts_vc_mcv-scripted-v23.0_oc_miro`](https://huggingface.co/datasets/TigreGotico/tts_vc_mcv-scripted-v23.0_oc_miro)
and
[`tts_vc_mcv-scripted-v23.0_oc_dii`](https://huggingface.co/datasets/TigreGotico/tts_vc_mcv-scripted-v23.0_oc_dii),
built the same way as the Asturian/Aragonese sets: Mozilla Common Voice
scripted-speech recordings revoiced onto a single consistent donor voice
through zero-shot cloning, then used to train a
[phoonnx](https://github.com/TigreGotico/phoonnx) VITS model exported to
ONNX for CPU inference. Both models are trained directly on graphemes —
there is no Occitan phonemizer we could plug in yet, so pronunciation
comes from the model alone rather than from an IPA front end.

## Try it yourself

Install `phoonnx` and run:

```python
import wave
from phoonnx.config import SynthesisConfig
from phoonnx.voice import TTSVoice

voice = TTSVoice.from_hf("OpenVoiceOS/phoonnx_oc_miro_unicode")
synthesis_config = SynthesisConfig(noise_scale=0.667, length_scale=1.0, noise_w_scale=0.8)

with wave.open("output.wav", "wb") as wav_file:
    voice.synthesize_wav("Bon jorn, cossí vas?", wav_file, synthesis_config)
```

Or point [`ovos-tts-plugin-phoonnx`](https://github.com/OpenVoiceOS/ovos-tts-plugin-phoonnx)
at either model by name in `mycroft.conf`:

```json
{
  "tts": {
    "module": "ovos-tts-plugin-phoonnx",
    "ovos-tts-plugin-phoonnx": {
      "voice": "OpenVoiceOS/phoonnx_oc_dii_unicode"
    }
  }
}
```

We don't have a hosted demo for these voices yet — our public TTS server at
[tts.openvoiceos.pt](https://tts.openvoiceos.pt) does not currently serve
`oc`, and neither HuggingFace repo ships a pre-rendered audio sample — so
for now, downloading the model and running the snippet above is the way to
hear it.

## Build your own

The training path is documented and repeatable for other under-resourced
languages: the whitepaper on
[hybrid TTS dataset synthesis](https://tigregotico.github.io/whitepaper_hybrid_synthetic_tts_dataset.pdf)
covers the method, and the
[`ngi0-notebooks`](https://github.com/OpenVoiceOS/ngi0-notebooks) collection
carries runnable notebooks for the whole pipeline: `tts_dataset_gen` for
building the training corpus (including synthetic-data recipes for
languages with little recorded speech), and `train_vits` for training the
phoonnx/VITS model itself, from paired text and audio through to the ONNX
file. Neither notebook needs a research background to run — that's the
point of writing them down.

As with Asturian and Aragonese, these results are a first, imperfect step,
meant to prove the approach rather than to sound polished. If you speak
Occitan and have pronunciation feedback, lexicon data, or want to help
build a phonemizer for it, we'd like to hear from you.

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
