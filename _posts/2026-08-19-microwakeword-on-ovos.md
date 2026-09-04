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

If your ESPHome voice satellite wakes on "Okay Nabu" or "Hey Jarvis", your full OVOS install can now wake on the exact same model — no retraining, no format conversion.

[microWakeWord](https://github.com/kahrendt/microWakeWord) is the TFLite-based wake word engine ESPHome built for its voice satellites. It runs streaming inference on microcontrollers, but the same models work just as well on a full Linux box. The [ESPHome micro-wake-word-models](https://github.com/esphome/micro-wake-word-models) repository publishes a set of ready-to-use models, and any `.tflite` file that follows the microWakeWord input convention works out of the box.

[`ovos-ww-plugin-microwakeword`](https://github.com/OpenVoiceOS/ovos-ww-plugin-microwakeword) exposes all of it as a standard OVOS hotword plugin — the same interface used by Precise, OpenWakeWord, Vosk, and every other wake word backend. Nothing else in your OVOS stack changes: point a `hotwords` entry at this module and pick a model.

---

## Supported Models

The plugin knows the official ESPHome models by short name and downloads them on first use:

| `model_name`  | Phrase         | v1 | v2 |
|---|---|---|---|
| `okay_nabu`   | Okay Nabu      | ✓  | ✓  |
| `hey_jarvis`  | Hey Jarvis     | ✓  | ✓  |
| `alexa`       | Alexa          | ✓  | ✓  |
| `hey_mycroft` | Hey Mycroft    | –  | ✓  |
| `vad`         | Voice activity | –  | ✓  |

`hey_mycroft` and `vad` (voice activity) exist only as v2. Everything else comes in both versions; set `model_version` to choose.

Beyond the catalogue, any community-trained or custom `.tflite` model works as long as it follows the microWakeWord input signature — `[1, 1, 40]` int8 log-mel features. Point the `model` key at an absolute file path or an `https://` URL and the plugin loads it directly. A model with a different input shape raises `ValueError` at load time instead of misbehaving silently.

---

## Try It

Install the plugin:

```bash
pip install ovos-ww-plugin-microwakeword
```

The package pulls in `ai-edge-litert` on Linux x86_64 (`tflite-runtime` elsewhere) as the interpreter runtime, plus `pymicro-features` — a wrapper around the same C audio frontend ESPHome uses on-device.

A minimal `mycroft.conf` entry, using an official model by name:

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

To load a community model or your own `.tflite`, use `model` — it takes precedence over `model_name`:

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
| `sliding_window_size` | `10` | Consecutive 10 ms frames averaged before the cutoff is tested. Mirrors ESPHome's `sliding_window_average_size`. |
| `refractory_frames` | `40` | Frames (~400 ms) ignored after a trigger, so one spoken phrase doesn't double-fire. |

---

## How Detection Works

Audio arrives as 16 kHz int16 PCM. `pymicro-features` turns each 10 ms frame into a 40-dimensional log-mel feature slice and quantizes it to int8. That slice — shape `[1, 1, 40]` — goes into the TFLite interpreter, which returns a uint8 value the plugin dequantizes into a probability.

These are streaming models: the recurrent and convolutional state lives inside the graph as TFLite resource variables, so each `invoke()` advances the internal state on its own. There is no external state tensor to thread through and no buffering of a fixed audio window. Resetting is just `allocate_tensors()`, which clears that state.

`sliding_window_size` averages consecutive per-frame probabilities before comparing against `probability_cutoff`, smoothing out single-frame spikes. Once a detection fires, `refractory_frames` suppresses further triggers for roughly 400 ms so one spoken phrase produces one event.

---

## A Note on Testing: These Models Expect Real Voices

microWakeWord models are trained on human speech and are picky about it. In the plugin's own end-to-end tests, feeding synthesized TTS audio of the wake phrase does not reliably trigger detection — the positive-path test soft-skips for exactly that reason, while the negative case (a phrase that should never fire) is a hard assertion. Validate a wake word by speaking it, not by piping a TTS clip through the recognizer. If a model seems unresponsive on synthetic audio, that is expected, not a broken install.

## When the Phrase You Want Isn't in the Catalogue

The ESPHome catalogue is convenient but finite. If you want a wake phrase nobody has published — a product name, a personal assistant name, a language the catalogue doesn't cover — you have to train one. That's what [WakeForge](https://github.com/TigreGotico/wakeforge) and its companion [`ovos-ww-plugin-wakeforge`](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge) are for: a training pipeline for your own OVOS wake word models, and a plugin to run them. microWakeWord gives you instant access to an existing library of phrases; WakeForge covers everything that library is missing.

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
