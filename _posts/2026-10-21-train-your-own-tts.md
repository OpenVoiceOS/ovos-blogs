---
title: "Train Your Own TTS the OVOS Way"
excerpt: "A step-by-step guide to a new OVOS voice: build a training set, train it on a free Kaggle GPU, export it to ONNX and make OVOS speak with it."
coverImage: "/assets/blog/phoonnx/thumb.png"
date: "2026-10-21T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/phoonnx/thumb.png"
---

## Train Your Own TTS the OVOS Way

This guide shows how to make a text-to-speech voice for OVOS yourself. You build a training set, train a voice on a free GPU, export it to ONNX, and configure OVOS to speak with it. Every step is a public notebook or a few lines of Python, and the result runs offline on your own device.

Our [synthetic voices post](https://blog.openvoiceos.org/posts/2025-06-26-making-synthetic-voices-from-scratch) explains why we make voices this way, and the [phoonnx post](https://blog.openvoiceos.org/posts/2025-10-06-phoonnx) introduces the engine. This post is the practical part: what to click and what to type.

## Step 1: Get training data

A voice learns from pairs of text and audio in one speaker's voice. You can make these pairs, or you can start from ours.

The [ngi0-notebooks](https://github.com/OpenVoiceOS/ngi0-notebooks) repository holds a chain of notebooks for this. The [pipeline guide](https://github.com/OpenVoiceOS/ngi0-notebooks/blob/dev/docs/pipeline.md) describes the full chain. In short:

- `tts_dataset_gen` writes sentences and speaks them with a donor TTS voice. It also works for languages that have no free recordings.
- `tts_corpus_ingest` reads a real speech corpus instead: a Hugging Face dataset, an LJSpeech folder or a CSV file.
- `tts_enhance` removes noise from each clip.
- `tts_voice_convert` changes every clip to one target voice. Our voices "miro" (male) and "dii" (female) come from this step.
- `tts_measure` and `tts_select` score each clip and keep the good ones.
- `tts_publish` uploads the finished set to Hugging Face.

Each notebook reads a manifest and writes a manifest, so you can run them one at a time and skip the ones you do not need.

If you do not want to build data, use ours. The training sets for all our voices are public in two collections: [synthetic TTS datasets](https://huggingface.co/collections/TigreGotico/synthetic-tts-datasets) and [voice-converted datasets](https://huggingface.co/collections/TigreGotico/tts-voice-converted-datasets). The second one holds the data for our minority-language voices: Asturian, Aragonese, Frisian and Kabyle.

## Step 2: Train on Kaggle

Open [`train_vits.ipynb`](https://github.com/OpenVoiceOS/ngi0-notebooks/blob/dev/notebooks/train_vits.ipynb) with its [Open in Kaggle](https://kaggle.com/kernels/welcome?src=https://github.com/OpenVoiceOS/ngi0-notebooks/blob/dev/notebooks/train_vits.ipynb) badge. In the Kaggle settings panel, turn on Internet and a GPU.

You must set one value. Set `DATASET_DIRS` to the output of `tts_dataset_gen`, or set `HF_DATASET` to a published dataset, such as `TigreGotico/tts-vc-mcv-scripted-v24.0-fy-nl-dii`, and set `LANG` to its language. Then choose Run All.

The notebook does not start from zero. It downloads a finished voice in your language and trains that voice further on your data. By default it trains for one hour (`MAX_TRAIN_HOURS`) and saves checkpoints, so a later run continues from the last one.

At the end it exports the voice as an `.onnx` file with a `.json` settings file. It also speaks some sentences that were kept out of training, next to the recordings of the same sentences. Listen to them. The notebook does not measure how good the voice sounds.

## Step 3: Publish and use it in OVOS

Upload the `.onnx` and `.json` files to a Hugging Face model repository. Then install phoonnx, which includes the OVOS plugin:

```bash
pip install --pre phoonnx
```

The plugin knows only the voices in its catalog, so add your voice to the local catalog once. This example uses our Frisian voice in place of yours:

```python
from phoonnx.model_manager import TTSModelManager, TTSModelInfo

repo = "https://huggingface.co/OpenVoiceOS/phoonnx_fy-NL_dii_unicode/resolve/main"
manager = TTSModelManager()
manager.load()
manager.add_voice(TTSModelInfo(
    voice_id="my-voice",
    lang="fy-NL",
    model_url=f"{repo}/dii_fy-NL.onnx",
    config_url=f"{repo}/dii_fy-NL.json",
))
manager.save()
```

Then select it in `mycroft.conf`:

```json
"tts": {
  "module": "ovos-tts-plugin-phoonnx",
  "ovos-tts-plugin-phoonnx": {
    "lang": "fy-NL",
    "voice": "my-voice"
  }
}
```

To test it without a full OVOS install, call the plugin directly:

```python
import wave
from phoonnx.opm import PhoonnxTTSPlugin

tts = PhoonnxTTSPlugin(config={"lang": "fy-NL", "voice": "my-voice"})
tts.get_tts("Goeie moarn, hoe giet it mei dy?", "test.wav")
with wave.open("test.wav") as f:
    print(f.getframerate(), "Hz,", round(f.getnframes() / f.getframerate(), 2), "s")
```

```
22050 Hz, 2.09 s
```

The first call downloads the model. After that, the voice works offline. Set `HF_HUB_OFFLINE=1` on a device with no network: without it, each start waits about 20 seconds for a Hugging Face check to time out.

## Limits

- A short training run gives a voice that can be less clear than the voice it started from. On 20 new English sentences, a speech recogniser misheard 4.4% of the words of a fine-tuned voice, against 1.1% for its base voice. Compare the two before you use your voice.
- The fine-tuned voice can keep the accent of its base voice. When the notebook finds no base voice in your language, it stops and lists the choices. `BASE = "none"` trains from zero, and the notebook does not recommend it.
- Donor synthesis with OmniVoice and training both need a GPU.
- The OVOS plugin cannot load a voice from a local file path. Publish the files to a URL first.

## Voices you can use today

Our own voices, miro and dii, are in the [OpenVoiceOS voices collection](https://huggingface.co/collections/OpenVoiceOS/openvoiceos-voices-miro-and-dii). Community models that we exported to ONNX for phoonnx are in the [phoonnx community exports collection](https://huggingface.co/collections/OpenVoiceOS/phoonnx-community-tts-exports). If your language is missing from both, the steps above are how to add it.

Report problems with the notebooks in [ngi0-notebooks](https://github.com/OpenVoiceOS/ngi0-notebooks/issues) and problems with the engine or plugin in [phoonnx](https://github.com/TigreGotico/phoonnx/issues).

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
