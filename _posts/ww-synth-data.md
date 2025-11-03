---
title: "Generating Robust Wake Word Datasets with Open-Source Synthetic Data"
excerpt: "We introduce a powerful collection of scripts that automate the creation of high-quality, synthetic wake word datasets. Learn how Text-to-Speech, Voice Cloning, and Acoustic Augmentation combine to create thousands of production-ready audio samples."
coverImage: "/assets/blog/ww_datasets/synth_cover.png"
date: "2025-11-08T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ww_datasets/synth_cover.png"
---

## Generating Robust Wake Word Datasets with Open-Source Synthetic Data

In our previous blog, [ww-datasets.md](ww-datasets.md), we established that a wake word model is only as good as the data it’s trained on. Models require **massive diversity**—in voices, accents, and acoustic environments—to function reliably in the real world. Collecting tens of thousands of real-world recordings is difficult and expensive, especially for niche or non-English wake words.

The solution? **Synthetic Data Generation.**

We are thrilled to announce the open-sourcing of the **Synthetic Dataset Generator**—a comprehensive and battle-tested suite of scripts that automates the creation of robust, production-ready wake word datasets for any language or phrase. By treating Text-to-Speech (TTS) and Voice Conversion (VC) as core tools, we can generate high-quality datasets that are massive, diverse, and easy to reproduce, drastically lowering the barrier to entry for custom wake word development.

This pipeline manages everything: from creating positive and hard-negative audio samples to applying real-world acoustic distortion.

---

### 1. Core Synthesis: Creating the Positive Samples

The first step is to generate thousands of clean samples of the wake word itself (the **positive samples**). This is handled primarily by the **`ovos_ww_synth.py`** script, driven by the various OpenVoiceOS TTS plugins.

This script is built to maximize voice and engine diversity:

* **Multi-Engine Support:** It integrates popular, high-quality open-source TTS engines like **Piper** alongside common cloud-based engines like **Edge** and **Google**.
* **Voice Conversion (VC):** Crucially, the script doesn't stop at the default TTS voices. It uses a **Voice Conversion** step to re-voice the synthesized audio using random references from a large speaker dataset. This simulates a diverse pool of speakers, making the resulting model robust against new voices.

The foundation for this voice cloning is the high-performance **`chatterbox-onnx`** model, packaged for easy voice cloning. By leveraging its zero-shot capabilities, we can inject diverse speaker characteristics with only a few seconds of reference audio.

---

### 2. Generating Hard Negative Samples: The Confusables

A great wake word model must be resilient to false alarms, meaning it must differentiate the target phrase from words that *sound* similar—known as **Hard Negative Samples**.

To systematically generate these critical samples, we integrate two cutting-edge research approaches:

1.  **Grapheme Augmentation:** It uses an algorithm to perform systematic single-grapheme edits (insertion, deletion, substitution) on the wake word. For example, for 'Hey Computer,' it might generate 'Hey Contooter' or 'Hey Conpater'.
2.  **LLM Enhancement:** It uses a local Large Language Model (LLM) to refine or expand this list, ensuring the generated words are phonetically similar but are actual, commonly used words.

These generated words are then cleaned up using **`normalize_txt.sh`** (converting to lowercase, sorting, and deduplicating), and finally fed back into the TTS synthesis pipeline to generate the necessary audio files.

---

### 3. Acoustic Augmentation: Training for the Real World

Clean synthetic data is a great start, but models trained only on studio-perfect audio will struggle the moment they encounter a noisy living room or a car. This is where **Acoustic Augmentation** comes in.

The **`augment.py`** script takes the synthetic (or recorded) audio and applies real-world distortions to mimic challenging environments:

* **Noise and Music Mixing:** Blending in various levels of background noise, music, or speech. The script allows controlling the Signal-to-Noise Ratio (SNR) to simulate noisy to quiet environments.
* **Reverb:** Applying real-world Impulse Responses (RIRs) to simulate different room acoustics, from small offices to large, echoey spaces.
* **Pitch and Speed Perturbation:** Slightly altering the speaker's pitch and speaking rate to simulate natural variations and device inconsistencies.

This final step ensures the models are trained on the chaos of real-world audio, not just the pristine audio of a data center.


---

### Join the Open Data Movement

This synthetic data pipeline drastically lowers the bar for creating state-of-the-art, open-source wake word models for **any phrase** and **any language**.

You can find all these scripts, guides, and further details in the dedicated GitHub repository:

👉 **Synthetic Dataset Generator Scripts:** [https://github.com/TigreGotico/synthetic_dataset_generator](https://github.com/TigreGotico/synthetic_dataset_generator)

To utilize the cutting-edge voice cloning features in the synthesis scripts, check out the `chatterbox-onnx` repository:

👉 **Chatterbox ONNX for Voice Cloning:** [https://github.com/TigreGotico/chatterbox-onnx](https://github.com/TigreGotico/chatterbox-onnx)

---

## What’s Next

In a next blog post we will dive into the technical details of the **model architectures** used to consume these diverse datasets and the **benchmarks** that prove this open-source approach can compete with closed-source alternatives by comparing various popular FOSS wake word engines across many datasets.
