---
title: "How we distilled HuBERT into 1.22 MB for wake words"
excerpt: "HuBERT-base has about 95 million parameters. WakeHuBERT tiny, its streaming student, has about 0.64 million, and its int8 file gzips to 1.22 MB. Here is how we distilled it, and the new OVOS wake word plugin whose models run on it."
coverImage: "/assets/blog/wakeforge/thumb.jpg"
date: "2026-10-02T00:00:00.000Z"
author:
  name: JarbasAI
  picture: "https://avatars.githubusercontent.com/u/33701864"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/wakeforge/thumb.jpg"
---

## How we distilled HuBERT into 1.22 MB for wake words

[HuBERT](https://ai.meta.com/blog/hubert-self-supervised-representation-learning-for-speech-recognition-generation-and-compression/) is a self-supervised speech model from Meta AI ([paper](https://arxiv.org/abs/2106.07447)). It learned about speech from recordings with no labels, and its inner layers describe speech well enough that a small classifier on top can learn a lot from very little data. The base model, [facebook/hubert-base-ls960](https://huggingface.co/facebook/hubert-base-ls960), has about 95 million parameters and looks at whole utterances at once. A wake word engine listens all day, on small devices, to a live stream. HuBERT-base is far too large and slow for that.

So we distilled it. [**WakeHuBERT tiny**](https://huggingface.co/TigreGotico/wakehubert-tiny) has about 0.64 million parameters. Its int8 build is 1.46 MB, and the float32 build is 3.3 MB. It is strictly causal, so it streams. And it keeps enough of what HuBERT knows that a wake word classifier trained on its features, from synthetic speech only, detects the word in real recordings.

To put the sizes in a form everyone remembers, here they are in 3.5-inch "1.44 MB" floppy disks. Formatted with FAT12, such a disk holds 1,457,664 bytes of files (2,847 sectors of 512 bytes). In the table, 1 MB is 1,000,000 bytes.

| model | parameters | file | floppy disks |
|---|---|---|---|
| HuBERT-base | about 95 million | 377.6 MB | 260 |
| DistilHuBERT, ONNX float32 | about 23.5 million | 94.0 MB | 65 |
| DistilHuBERT, ONNX int8 | about 23.5 million | 50.4 MB | 35 |
| WakeHuBERT tiny, float32 | about 0.64 million | 3.3 MB | 3 |
| WakeHuBERT tiny, int8 | about 0.64 million | 1.46 MB | 2 |
| WakeHuBERT tiny, int8, gzip -9 | about 0.64 million | 1.22 MB | **1** |

The int8 student misses a single floppy by 5,181 bytes. Compressed with `gzip -9`, it fits, with 238 KB to spare.

Yes, that is where the 1.22 MB in the title comes from. Nobody runs a gzipped model: `onnxruntime` loads the 1.46 MB file. We gzipped it only so it would fit on a floppy, and so the headline would have a smaller number in it. We admit the clickbait.

We were not the first to shrink HuBERT. [DistilHuBERT](https://arxiv.org/abs/2110.01900) ([model](https://huggingface.co/ntu-spml/distilhubert)) cuts it to a quarter of the size, and our first wake word experiments ran on an [ONNX export of it](https://huggingface.co/TigreGotico/distillhubert-onnx). It works, and it is an option on a laptop with compute to spare, but it is still far too heavy for a single-board computer. That is why we distilled our own.

👉 [**WakeHuBERT tiny on Hugging Face**](https://huggingface.co/TigreGotico/wakehubert-tiny) (Apache-2.0)

---

### The teacher and the student

The teacher is [HuBERT-base](https://huggingface.co/facebook/hubert-base-ls960). The student is a log-mel front end followed by a causal temporal convolutional network: a strided convolution, dilated depthwise-separable convolution blocks and a small projection. It uses only convolution, batch norm and ReLU, which quantise well. The log-mel front end is part of the ONNX graph, so the student takes the raw 16 kHz waveform and gives 128-dimensional features at 50 frames per second.

Each output frame depends only on audio that came before it, within a receptive field of 2.5 seconds. Keep 2.5 seconds of context and the streamed features are the same as the offline ones.

The student learned to predict three of the teacher's layers: 4, 8 and 12. The teacher heard clean speech. The student heard the same speech with noise, reverberation and background talkers, so it learned to describe the speech and ignore the rest.

### What worked, and what did not

**Masked distillation worked.** During training, spans of the student's input were hidden, each frame masked at probability 0.065, and the student still had to reproduce the teacher. The [model card](https://huggingface.co/TigreGotico/wakehubert-tiny) reports this as the largest single gain in robustness found in the experiments.

**Width helped.** A wider student was better.

**Lookahead did not help.** Giving the student a little future audio, at the cost of latency, did not make it better.

**Other teachers were no better.** We also distilled students from [WavLM](https://huggingface.co/microsoft/wavlm-base-plus) and [XEUS](https://huggingface.co/espnet/xeus). Neither beat the HuBERT student. All of these students are published in the [**Onnx feature extractors**](https://huggingface.co/collections/TigreGotico/onnx-feature-extractors) collection, the ONNX featurizers for wake word experiments: the WakeHuBERT, WakeWav and WakeXeus families. They can all be used with wakeforge.

The last step was quantisation. The static int8 build, the 1.46 MB file, gives features that agree with float32 at a mean cosine similarity of 0.998.

You can use WakeHuBERT on its own, outside OVOS:

```python
import numpy as np, onnxruntime as ort
from huggingface_hub import hf_hub_download

path = hf_hub_download("TigreGotico/wakehubert-tiny", "wakehubert.onnx")
sess = ort.InferenceSession(path)
feats = sess.run(None, {"waveform": np.zeros((1, 24000), np.float32)})[0]  # (1, 75, 128)
```

The [model card](https://huggingface.co/TigreGotico/wakehubert-tiny) has the full architecture, the training data and an evaluation.

---

### What it lets you do: the wakeforge plugin

The new [**OVOS wakeforge wake word plugin**](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge) runs wake word models built on [WakeHuBERT](https://huggingface.co/TigreGotico/wakehubert-tiny). This is the ready-to-use part: it ships the featurizer in both builds and ready models, and the runtime needs only `onnxruntime` and `numpy`.

```bash
pip install --pre ovos-ww-plugin-wakeforge
```

The ready models are trained from synthetic speech, so a word that nobody has ever recorded is not out of reach. The featurizer and the models were made with [wakeforge](https://github.com/TigreGotico/wakeforge), our research framework for wake word experiments. It is not a one-click model maker, but it is open, and anyone who wants to experiment with their own word can use the same toolkit we did. The rest of this post explains how the models are trained, what we learned on the way, and how they score on real speech.

---

### The wake word heads

On top of [WakeHuBERT](https://huggingface.co/TigreGotico/wakehubert-tiny) sits a small GRU classifier with a hidden size of 128. One model per word is enough. We tried an ensemble of six models, and once the training data was right it barely helped.

The heads are trained with the research bench in [wakeforge](https://github.com/TigreGotico/wakeforge) (`scripts/research/head_bench.py`). The bench is a research script, the one we used to run these experiments, not a packaged training tool. Each positive clip becomes eight augmented copies. The augmentation includes a device-response stage that imitates cheap hardware: a limited microphone band, a coloured frequency response, level changes, clipping and self-noise. Babble and noise are mixed in on top.

The checkpoint we keep is the one with the best recall at zero false accepts on held-out calibration speech. The result is exported to the plugin's format with `ww_trainer-export-plugin`.

---

### The data recipe: text-to-speech plus voice cloning

This is the part we think is new. Every word starts as a grid of text-to-speech voices that covers every variant of the language: every English accent, every Portuguese voice. Any [OVOS TTS plugin](https://github.com/orgs/OpenVoiceOS/repositories?q=ovos-tts-plugin) can supply the voices, proprietary services such as Edge and Google included, and [phoonnx](https://github.com/TigreGotico/phoonnx) alone exposes thousands of models across languages. Each voice says the word at 5 speaking rates and 3 pitches, with 3 spellings that change the delivery ("jarvis", "jarvis!", "jarvis?").

The clips are then voice-cloned onto real speakers with [Chatterbox](https://github.com/resemble-ai/chatterbox), through [voiceclonnx](https://github.com/TigreGotico/voiceclonnx), a pure-ONNX voice cloning library. Cloning works across languages, so one pool of reference speakers serves every language.

For Catalan, Galician and Basque we add more voices through phoonnx: the ILENIA voices, BSC Matxa and Projecte AINA for Catalan and Proxecto Nós from the University of Vigo for Galician, and the HiTZ voices for Basque.

---

### What we learned

**Sound-alike negatives hurt.** It seems obvious to teach the model what the word is *not*, with synthetic near-homophones such as "commuter" or "come pewter" for "computer". On real speech it backfired. On real "computer" recordings, at 1 false activation per hour, recall dropped from 90.5% to 55.2% when the sound-alikes were added.

**More of one voice is not more data.** Adding a single multi-speaker Piper voice as extra positives also made the models slightly worse.

**Voice coverage is what matters.** The full voice grid made the difference. On real "jarvis" recordings, recall at 1 false activation per hour went from 85.4% for our earlier model to 99.0–99.5% (two training seeds).

The synthetic-only models never see real recordings during training. Real recordings are used only to test them.

---

### "Wake up" in every language

OVOS can put its listener to sleep. While it sleeps, it ignores the wake word on its own: you say the wake word followed by "wake up". That second phrase should be in your language, so we are training a "wake up" model per language:

| language | phrase |
|---|---|
| Spanish | despierta |
| Portuguese | acorda |
| Catalan | desperta |
| Galician | desperta |
| Basque | esnatu |
| Danish | vågn op |
| German | aufwachen |
| Italian | sveglia |
| Dutch | wakker worden |

If your language is missing, tell us how you say it in [this issue](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge/issues/18).

---

### Open data

Every word's training set is a public dataset, `TigreGotico/synthetic-wakeword-<word>`, under CC BY 4.0. They are grouped in collections per language:

- [Synthetic Wake Word Datasets — English](https://huggingface.co/collections/TigreGotico/synthetic-wake-word-datasets-english-68ee52b6976ed8a20c8cf98f)
- [Synthetic Wake Word Datasets — Portuguese](https://huggingface.co/collections/TigreGotico/synthetic-wake-word-datasets-portuguese-6abfa4d3e2403afc19ecc153)
- [Synthetic Wake Word Datasets — Spanish](https://huggingface.co/collections/TigreGotico/synthetic-wake-word-datasets-spanish-6abfa4d371befb841d5b8387)
- [Synthetic Wake Word Datasets — Danish](https://huggingface.co/collections/TigreGotico/synthetic-wake-word-datasets-danish-6abfa4d334feaaa5b0f62629)
- [Synthetic "Wake Up" Datasets](https://huggingface.co/collections/TigreGotico/synthetic-wake-up-datasets-6abfa4d36352ca4f97723790)

The sound-alike negatives are published separately, as [not-wake-words-soundalikes-en](https://huggingface.co/datasets/TigreGotico/not-wake-words-soundalikes-en) and [not-wake-words-soundalikes-pt](https://huggingface.co/datasets/TigreGotico/not-wake-words-soundalikes-pt). Read the finding above before you use them: in our tests they cost a lot of recall on real speech.

---

### Try it

Install the plugin, then set it as your wake word engine in `~/.config/mycroft/mycroft.conf`:

```json
{
  "listener": {
    "wake_word": "jarvis"
  },
  "hotwords": {
    "jarvis": {
      "module": "ovos-ww-plugin-wakeforge",
      "model": "jarvis",
      "listen": true
    }
  }
}
```

Restart OVOS and say "jarvis". If you experiment with [wakeforge](https://github.com/TigreGotico/wakeforge) and export a model of your own, point `model` at its ONNX file instead; the [plugin README](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge) lists every option. Bugs and questions go to the [issue tracker](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge/issues).

---

### Built in the Open, Funded for the Commons

WakeHuBERT, wakeforge and the plugin were developed by [TigreGótico](https://tigregotico.pt) for OpenVoiceOS. As we shared when [**OpenVoiceOS received its NGI Zero Commons Fund grant**](https://blog.openvoiceos.org/posts/2025-10-20-ngi), that funding goes toward the plumbing a community project rarely has the resources to polish. A wake word engine that anyone can train for their own word and language, from open data, is that kind of plumbing.

This work is part of the OpenVoiceOS **From Beta to Breakthrough** milestone, funded through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of [DG Communications Networks, Content and Technology](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en) under grant agreement No [101135429](https://cordis.europa.eu/project/id/101135429). Additional funding is made available by the [Swiss State Secretariat for Education, Research and Innovation](https://www.sbfi.admin.ch/sbfi/en/home.html) (SERI).

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
