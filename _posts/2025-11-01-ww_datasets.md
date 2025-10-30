---
title: "Building Better Wake Words: Why Data Matters and How You Can Get Started"
excerpt: "Wake word systems live and die by the data they’re trained on. A model trained on a few speakers in quiet rooms might work fine in the lab but fail the moment it hears a new accent, microphone, or background noise.  High-quality, diverse datasets are the foundation of any robust wake word system. They capture different voices, devices, and environments, helping models generalize and reducing false triggers or missed activations."
coverImage: "/assets/blog/ww_datasets/thumb.png"
date: "2025-11-01T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ww_datasets/thumb.png"
---


## Building Better Wake Words: Why Data Matters and How You Can Get Started

### What Are Wake Words?

Wake words — short trigger phrases like *“Hey Computer,” “Alexa,”* or *“Hey Mycroft”* — are the key that wakes up your voice assistant. They signal when the system should start listening and processing commands.

A good wake word detector should respond quickly and accurately to the right phrase — and stay silent the rest of the time. That simple goal hides a complex challenge: real-world speech is unpredictable, noisy, and incredibly diverse.

---

### Why Quality Data Is Essential

Wake word systems live and die by the data they’re trained on. A model trained on a few speakers in quiet rooms might work fine in the lab but fail the moment it hears a new accent, microphone, or background noise.

High-quality, diverse datasets are the foundation of any robust wake word system. They capture different voices, devices, and environments, helping models generalize and reducing false triggers or missed activations.

But collecting this kind of data is difficult — and responsibly gathering diverse speech samples at scale is even harder. That’s why open, shareable datasets are so important.

---

### Common Challenges in Wake Word Research

Developers and researchers often run into the same issues when building wake word systems:

* **Data scarcity** – Few open datasets exist for wake word detection.
* **Imbalance** – Far more “non-wake” samples than “wake” ones.
* **Noise sensitivity** – Background sounds and reverb can break performance.
* **Speaker diversity** – Models often fail to generalize to new voices or accents.

OpenVoiceOS has been organizing a growing collection of open datasets — both wake word–specific and general audio corpora — to make it easier for anyone to build, train, and benchmark detection systems.

---

## 🗣️ Wake Word Datasets

### Synthetic Data

Generated specifically for controlled experiments, these synthetic and augmented datasets include speech created using TTS and voice cloning. These datasets are a work in progress, expect more data to be added over time.

👉 [Synthetic Wake Word Collection](https://huggingface.co/collections/TigreGotico/synthetic-wakeword-datasets)

---

### Mycroft / OpenVoiceOS Community Data

Real-world samples collected by the Mycroft and OpenVoiceOS communities. These recordings include multiple speakers, accents, and recording setups.

👉 [OVOS Community Wake Words Dataset](https://huggingface.co/datasets/OpenVoiceOS/ovos-community-wakewords-dataset)

| Wake Word        | Samples | Notes                            |
| ---------------- | ------- | -------------------------------- |
| `amelia`         | 223     |                                  |
| `athena`         | 482     |                                  |
| `computer`       | 470     | used to train Precise-Lite model |
| `cristopher`     | 3       |                                  |
| `ey_ordenador`   | 48      | Spanish                          |
| `hey_chatterbox` | 116     | used to train Precise-Lite model |
| `hey_computer`   | 14      |                                  |
| `hey_firefox`    | 3       |                                  |
| `hey_floyd`      | 96      |                                  |
| `hey_k9`         | 46      |                                  |
| `hey_kit`        | 5       |                                  |
| `hey_mike`       | 2       |                                  |
| `hey_moxie`      | 4       |                                  |
| `hey_savant`     | 115     |                                  |
| `hey_scout`      | 34      |                                  |
| `hey_ziggy`      | 26      |                                  |

---

### Qualcomm Snapdragon Keyword Dataset

A balanced, multi-speaker dataset featuring four English keywords recorded by 50 speakers.

👉 [Qualcomm Keyword Speech Dataset](https://www.qualcomm.com/developer/software/keyword-speech-dataset)

| Wake Word        | Samples | Notes        |
| ---------------- | ------- | ------------ |
| `hey_snapdragon` | 1,112   | 50 speakers  |
| `hi_galaxy`      | 934     | 200 speakers |
| `hi_lumina`      | 1,112   | 50 speakers  |
| `hey_android`    | 1,112   | 50 speakers  |


---

### Google Speech Commands

A widely used dataset for keyword spotting — also useful for building wake word or “not-wake” word datasets.

| Wake Word | Samples | Notes                            |
| --------- | ------- | -------------------------------- |
| `marvin`  | 2,100   | used to train Precise-Lite model |
| `sheila`  | 2,022   | used to train Precise-Lite model |
| `stop`    | 3,872   |                                  |
| `yes`     | 4,044   |                                  |
| `no`      | 3,941   |                                  |

---

### Pico Benchmark

Designed to compare wake word detection engines. Over 300 recordings per wake word from more than 50 speakers.

👉 [GitHub Repository](https://github.com/Picovoice/wake-word-benchmark)
👉 [HuggingFace Mirror](https://huggingface.co/datasets/domdomegg/picovoice-wake-word-benchmark)

| Wake Word      | Samples |
| -------------- | ------- |
| `alexa`        | 329     |
| `computer`     | 411     |
| `jarvis`       | 384     |
| `smart_mirror` | 369     |
| `snowboy`      | 401     |
| `view_glass`   | 399     |

---

### Alexa Dataset (Kaggle)

A small dataset of Alexa wake word samples.

👉 [Kaggle – Alexa Wake Word Dataset](https://www.kaggle.com/datasets/aanhari/alexa-dataset)

| Wake Word | Samples |
| --------- | ------- |
| `alexa`   | 738     |

---

### NAR Dataset

Recordings made with the Nao robot in real domestic environments — includes speech and background sounds with natural noise and reverb.

👉 [NAR Dataset on Hugging Face](https://huggingface.co/datasets/TigreGotico/NAR)

👉 [Official Page](https://team.inria.fr/perception/nard/)

| Wake Word | Samples |
| --------- | ------- |
| `stop`    | 20      |
| `yes`     | 20      |
| `no`      | 20      |

---

### Multilingual Spoken Words Corpus

Massive dataset of spoken words across 50 languages — ideal for multilingual research and cross-lingual training.

👉 [MLCommons Multilingual Spoken Words](https://mlcommons.org/datasets/multilingual-spoken-words/)
👉 [Hugging Face Mirror](https://huggingface.co/datasets/MLCommons/ml_spoken_words)

---

## 🔊 Auxiliary “Not Wake Word” and Noise Datasets

These datasets aren’t wake words themselves — but they’re incredibly useful as *negative samples* or background noise when training detection systems.

### [DipCo – Dinner Party Corpus, Interspeech 2020](https://zenodo.org/records/8122551)

👉 [Hugging Face Mirror](https://huggingface.co/datasets/huckiyang/DiPCo)
Simulated dinner-party recordings with multiple speakers, overlapping speech, and background music — perfect for training models to handle real-world noise.

---

### [FMA (3 Seconds)](https://huggingface.co/datasets/TigreGotico/FMA_3secs)

3-second clips from the Free Music Archive — ideal for background and false trigger testing.

---

### [MIT Environmental Impulse Response Dataset](https://huggingface.co/datasets/davidscripka/MIT_environmental_impulse_responses)

271 audio files of real-world acoustic impulse responses — great for simulating room reverberation and microphone characteristics.

---

### [Public Domain Sounds (3 Seconds)](https://huggingface.co/datasets/TigreGotico/public_domain_sounds_3secs)

635 copyright-free environmental recordings, chopped into 3-second clips — a versatile source of background sounds.

---

### [Freiburg 106](https://huggingface.co/datasets/TigreGotico/building_106_kitchen_3secs)

Environmental recordings from a kitchen environment, split into short clips.

---

### [ESC-50: Environmental Sound Classification](https://huggingface.co/datasets/TigreGotico/ESC-50)

2,000 labeled 5-second environmental recordings across 50 sound classes — a go-to dataset for environmental noise classification and augmentation.

---

### [AudioSet](https://huggingface.co/datasets/agkphysics/AudioSet)

10-second clips from YouTube, labeled across hundreds of sound categories — a powerful general-purpose dataset for sound event modeling.

---

## Why Share All This?

Open datasets are the backbone of reproducible wake word research. By sharing and cataloging these resources, we hope to make it easier for anyone — from academic researchers to hobbyists — to train, compare, and improve wake word detection systems.

These collections combine real, synthetic, and environmental data that together form a strong foundation for open-source wake word development.

---

## What’s Next

OpenVoiceOS is preparing a new round of **wake word benchmarks** that will put existing models and engines to the test across these datasets — from quiet labs to noisy kitchens.

While many community projects (like Precise) have carried open wake word detection forward, they’re still **hard to train**, **data-hungry**, and **don’t generalize well** to new voices. Our upcoming work aims to change that — with better evaluation standards, more data diversity, and open comparisons.

Stay tuned — benchmarks are coming soon. 👀

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)


