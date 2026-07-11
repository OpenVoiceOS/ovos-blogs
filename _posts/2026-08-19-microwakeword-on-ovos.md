---
title: "microWakeWord on OVOS: The ESPHome Wake-Word Catalogue as a Standard Hotword Plugin"
excerpt: "ovos-ww-plugin-microwakeword wraps the microWakeWord TFLite models built for ESPHome voice satellites, so the same wake words that run on an ESP32-S3 run unchanged on a full OVOS install — as an ordinary hotword plugin."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-08-19T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## microWakeWord on OVOS

[microWakeWord](https://github.com/kahrendt/microWakeWord) is a TFLite-based wake word detection framework built for ESPHome's voice satellites. It was designed to run streaming inference on microcontrollers, but the same models are accurate enough for full Linux deployments. The [ESPHome micro-wake-word-models](https://github.com/esphome/micro-wake-word-models) repository publishes a set of ready-to-use models, and any `.tflite` file that follows the microWakeWord input convention works out of the box.

[`ovos-ww-plugin-microwakeword`](https://github.com/OpenVoiceOS/ovos-ww-plugin-microwakeword) exposes all of it as a standard OVOS hotword plugin — the same interface used by Precise, OpenWakeWord, Vosk, and every other wake word backend. Nothing about the rest of your OVOS stack changes; you point a `hotwords` entry at this module and pick a model.

---

## Supported Models

The plugin knows about the official ESPHome models by short name and downloads them on first use:

| `model_name`  | Phrase         | v1 | v2 |
|---|---|---|---|
| `okay_nabu`   | Okay Nabu      | ✓  | ✓  |
| `hey_jarvis`  | Hey Jarvis     | ✓  | ✓  |
| `alexa`       | Alexa          | ✓  | ✓  |
| `hey_mycroft` | Hey Mycroft    | –  | ✓  |
| `vad`         | Voice activity | –  | ✓  |

`hey_mycroft` and the `vad` (voice-activity) model exist only as v2. Everything else is available as both v1 and v2; set `model_version` to choose.

Beyond the catalogue, any community-trained or custom `.tflite` model is compatible as long as it follows the microWakeWord input signature — `[1, 1, 40]` int8 log-mel features. Point the `model` key at an absolute file path or an `https://` URL and the plugin loads it directly; a model with any other input shape raises `ValueError` at load time rather than misbehaving silently.

---

## Installation

```bash
pip install ovos-ww-plugin-microwakeword
```

The package declares `ai-edge-litert` on Linux x86_64 and `tflite-runtime` on other platforms as the interpreter runtime, alongside `pymicro-features` — a wrapper around the exact same C audio frontend that ESPHome uses for on-device inference.

---

## Configuration

A minimal entry, using an official model by name:

```json
{
  "hotwords": {
    "okay nabu": {
      "module": "ovos-ww-plugin-microwakeword",
      "model_name": "okay_nabu",
      "model_version": 1,
      "probability_cutoff": 0.5,
      "sliding_window_size": 10,
      "refractory_frames": 40
    }
  }
}
```

To load a community model or your own `.tflite`, use `model`, which takes precedence over `model_name`:

```json
{
  "hotwords": {
    "my phrase": {
      "module": "ovos-ww-plugin-microwakeword",
      "model": "https://example.com/my_phrase.tflite",
      "probability_cutoff": 0.6
    }
  }
}
```

The full set of keys:

| Key | Default | What it does |
|---|---|---|
| `model` | *(auto)* | Path or `https://` URL to a `.tflite` file. Overrides `model_name`. |
| `model_name` | `okay_nabu` | Short name of an official ESPHome model, auto-downloaded on first use. |
| `model_version` | `1` | `1` or `2` — picks the model subdirectory in the ESPHome repo. |
| `probability_cutoff` | `0.5` | Detection threshold in [0, 1]. Higher trades misses for fewer false triggers. |
| `sliding_window_size` | `10` | How many consecutive 10 ms frames are averaged before the cutoff is tested. Mirrors ESPHome's `sliding_window_average_size`. |
| `refractory_frames` | `40` | Frames (~400 ms) ignored after a trigger, to prevent double-fires on one phrase. |

---

## How Detection Works

Audio arrives as 16 kHz int16 PCM. `pymicro-features` turns each 10 ms frame into a 40-dimensional log-mel feature slice and quantizes it to int8. That slice — shape `[1, 1, 40]` — goes into the TFLite interpreter, which returns a uint8 value the plugin dequantizes into a probability.

The interesting part is that these are *streaming* models. The recurrent and convolutional state lives inside the graph as TFLite resource variables, so each successive `invoke()` advances the internal state on its own — there is no external state tensor to thread through, and no buffering of a fixed window of audio. Resetting is just `allocate_tensors()`, which clears that state.

On top of the raw per-frame probability, `sliding_window_size` averages consecutive frames before comparing against `probability_cutoff`, which smooths out single-frame spikes. Once a detection fires, `refractory_frames` suppresses further triggers for roughly 400 ms so a single spoken phrase produces a single event.

---

## The ESPHome Connection

If you run Home Assistant with ESPHome voice satellites, you already use microWakeWord — it is the default wake word engine on those devices. This plugin means the exact model that wakes your ESP32-S3 satellite can wake a full OVOS instance, with no retraining and no format conversion. Because the audio frontend is the same C implementation ESPHome ships, behaviour lines up closely between the microcontroller and the desktop. The growing ESPHome model repository effectively doubles as a catalogue of ready-to-use OVOS wake words.

---

## A Note on Testing: These Models Expect Real Voices

One honest caveat worth stating plainly: microWakeWord models are trained on human speech, and they are picky about it. In the plugin's own end-to-end tests, feeding synthesized TTS audio of the wake phrase does *not* reliably trigger detection — the positive-path test soft-skips rather than hard-fails for exactly that reason, while the negative case (a phrase that should never fire) is a hard assertion. The practical takeaway: validate a wake word by actually speaking it, not by piping a TTS clip through the recognizer. If a model seems unresponsive on synthetic audio, that is expected behaviour, not a broken install.

## When the Phrase You Want Isn't in the Catalogue

The ESPHome catalogue is convenient but finite. If you want a wake phrase nobody has published — a product name, a personal assistant name, a language the catalogue doesn't cover — you have to train one. That is where [WakeForge](https://github.com/TigreGotico/wakeforge) and its companion [`ovos-ww-plugin-wakeforge`](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge) come in: a training pipeline for producing your own OVOS wake word models, and a plugin to run them. microWakeWord gives you instant access to an existing library of phrases; WakeForge covers everything that library is missing. Together they mean you are never stuck with someone else's choice of wake word.

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
