---
title: "A Colombian Spanish Voice Pair for OVOS"
excerpt: "Two phoonnx voices for Colombian Spanish, Miro and Dii. They exist because a member of the Colombian Spanish community asked. Both run offline on a CPU and load from Hugging Face."
coverImage: "/assets/blog/common/cover.png"
date: "2026-09-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/common/cover.png"
---

## A Colombian Spanish Voice Pair for OVOS

Spanish text-to-speech voices are not rare. Voices that sound like Colombia rather than Madrid are rare. A member of the Colombian Spanish community asked for one. Two are the answer: [`phoonnx_es-CO_miro_espeak`](https://huggingface.co/OpenVoiceOS/phoonnx_es-CO_miro_espeak) (male) and [`phoonnx_es-CO_dii_espeak`](https://huggingface.co/OpenVoiceOS/phoonnx_es-CO_dii_espeak) (female). They are the same donor-voice pair OVOS uses for its other languages.

## What they are

Both are VITS models trained with [phoonnx](https://github.com/TigreGotico/phoonnx), exported to ONNX, and phonemized with espeak-ng, which is what the `_espeak` suffix means. They synthesize on a CPU without a GPU or a network connection. Each model repository carries the `.onnx` weights, the phoonnx JSON config, a Piper-format config and the token table.

The training data is public: [`TigreGotico/tts-train-synthetic-miro_es-CO`](https://huggingface.co/datasets/TigreGotico/tts-train-synthetic-miro_es-CO) and [`tts-train-synthetic-dii_es-CO`](https://huggingface.co/datasets/TigreGotico/tts-train-synthetic-dii_es-CO). Miro and Dii are the recorded voices of two real people, and the voice identities belong to TigreGótico. The models are published under **CC BY-NC-ND 4.0**: non-commercial use, unmodified, with attribution. Commercial use or a derivative voice needs an agreement with TigreGótico.

## Try it

Install phoonnx with `pip install --pre phoonnx` (the run below is 1.91.2a1). The `espeak-ng` binary must be on the machine, because the phonemizer calls it. Then:

```python
import wave
from huggingface_hub import hf_hub_download
from phoonnx.config import SynthesisConfig
from phoonnx.voice import TTSVoice

repo = "OpenVoiceOS/phoonnx_es-CO_miro_espeak"
voice = TTSVoice.load(hf_hub_download(repo, "miro_es-CO.onnx"),
                      hf_hub_download(repo, "miro_es-CO.json"))
config = SynthesisConfig(noise_scale=0.667, length_scale=1.0, noise_w_scale=0.8)
with wave.open("es_co.wav", "wb") as f:
    voice.synthesize_wav("Buenos días, ¿cómo amaneció?", f, config)
```

```
es_co.wav: RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz
```

In OVOS, the `ovos-tts-plugin-phoonnx` plugin ships inside the `phoonnx` package. Point it at either voice in `mycroft.conf`:

```json
{
  "tts": {
    "module": "ovos-tts-plugin-phoonnx",
    "ovos-tts-plugin-phoonnx": {
      "voice": "OpenVoiceOS/phoonnx_es-CO_dii_espeak"
    }
  }
}
```

## Limits

The voices are trained on synthetic data built from a donor voice. They carry the donor's timbre with Colombian pronunciation, not a Colombian speaker's own voice. Pronunciation quality is bounded by espeak-ng's Spanish rules. A word espeak-ng gets wrong, the voice gets wrong. There is no hosted demo, and the public TTS server serves `en-US` only, so the snippet above is the way to hear them. Pronunciation feedback and word lists go to the [phoonnx issue tracker](https://github.com/TigreGotico/phoonnx/issues).

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
