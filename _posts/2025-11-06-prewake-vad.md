---
title: "OVOS Just Got a Noise Filter: Better Listening, Less Interruption"
excerpt: "We're thrilled to announce a new feature in OpenVoiceOS that aims to improve how your device listens. This new logic improves performance, reduces false activations, and makes OVOS an even more delightful and reliable voice assistant"
coverImage: "/assets/blog/prewake-vad/thumb.png"
date: "2025-11-06T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/prewake-vad/thumb.png"
---

## OVOS Just Got a Noise Filter: Better Listening, Less Interruption

We're thrilled to announce a new feature in OpenVoiceOS (OVOS) that aims to improve how your device listens: **Pre-Wake-VAD** (Voice Activity Detection). This new logic improves performance, reduces false activations, and makes OVOS an even more delightful and reliable voice assistant.

---

### The Old Way vs. The New Breakthrough

Before **Pre-Wake-VAD**, the OVOS listener loop operated in a straightforward manner:

- 1.  The system was **always listening** for the wake word (WW).
- 2.  Upon hearing the WW, it started recording the user's request.
- 3.  **VAD** was used *after* the wake word to detect when the user **finished speaking**.

This constant listening for the wake word consumed more CPU and, critically, was susceptible to false activations. Random noises, music, or even animal sounds could sometimes trigger the wake word.

#### The **Pre-Wake-VAD** Logic: A Smarter Sequence

With the new feature, we've flipped the script. The system now follows a more intelligent, two-stage listening process:

- 1.  **Wait for Speech (VAD First):** The system first waits to detect *any* human speech using **VAD**.
- 2.  **Listen for Wake Word (WW Second):** Only *after* speech is detected does the system engage the more CPU-intensive **wake word engine**.
- 3.  **Timeout:** If the wake word is not detected within 5 seconds of the initial speech detection, the system assumes it was not an activation and returns to the VAD-only 'wait for speech' state.

---

### Two Massive Wins for OVOS Users

This seemingly small change delivers two enormous benefits:

#### CPU Reduction

VAD is inherently less expensive to run than a complex wake word engine. By spending the vast majority of its idle time in the low-cost VAD stage, OVOS uses slightly less CPU overall. This is fantastic news for users running OVOS on resource-constrained or battery-powered devices.

#### Reduced False Activations

This is the real game-changer. The wake word engine no longer has to focus on distinguishing **wake-word speech** from **non-speech** sounds like music, background noise, or random audio spikes.

* The **VAD** acts as a powerful **noise filter**, ensuring only *actual human speech* reaches the wake word engine.
* The **wake word engine** can now concentrate solely on its core task: distinguishing **wake-word speech** from **non-wake-word speech**.

This collaborative approach has been shown to massively reduce the false activation rate of OVOS, making your interaction with the assistant smoother and less interrupted!

---

### A Huge Boost for the Vosk Wake Word Plugin

The introduction of Pre-Wake-VAD is particularly exciting for the popular [**Vosk wake word plugin**](https://github.com/OpenVoiceOS/ovos-ww-plugin-vosk).

For those unfamiliar, the Vosk plugin is incredible because it allows users to change their wake word simply by editing a text string in a config file, no data collection, no model training required! However, this flexibility sometimes came with a higher false activation rate.

With **Pre-Wake-VAD**, that concern is largely eliminated. By getting rid of false positives caused by non-speech audio, this new feature makes the versatile, text-configurable Vosk plugin far more usable and reliable for everyone.

Stay tuned! We’ll be sharing the comprehensive benchmark results in an upcoming blog post, but early results confirm a massive difference in false activations!

---

## How to Enable Pre-Wake-VAD

To start using this new noise-filtering feature, you need to ensure you have the correct version of the listener package and update your configuration file.

You must be running at least version **0.5.0** of the listener package. You can update it using pip:

```bash
pip install --upgrade ovos-dinkum-listener
```

Add the following parameter inside the `"listener"` section of your `mycroft.conf` file to enable the Pre-Wake-VAD logic:

```json
{
  "listener": {
    "vad_pre_wake_enabled": true
  }
}
```

Once both steps are complete, restart your OVOS service, and you'll be using the new, smarter listening loop!

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
