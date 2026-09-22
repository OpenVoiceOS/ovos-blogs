---
title: "Three Wake-Word Engines You Already Had, as OVOS Plugins"
excerpt: "Precise models run on onnxruntime, Vosk keyword spotting runs in any of its languages. wakewordlab's compact neural models run with a Silero pre-filter. Each is one plugin package and one hotwords entry in mycroft.conf."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-09-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Three Wake-Word Engines You Already Had, as OVOS Plugins

A wake-word engine is the part of a voice assistant that listens all day for one phrase. Several free engines exist, each with its own model format and runtime, and each is only useful to an OVOS device once something loads it behind the listener's `hotwords` contract. This post covers three such plugins: `ovos-ww-plugin-precise-onnx`, `ovos-ww-plugin-vosk` and `ovos-ww-plugin-wakewordlab`. They are for people who configure a device. If you run a default image you use the first one without knowing it.

All three register under the `opm.wake_word` entry-point group of `ovos-plugin-manager`, so the listener discovers them by the `module` name in `mycroft.conf` and nothing else changes.

## Precise models on onnxruntime

Precise is the engine the Mycroft community trained its wake words with. Its models were TensorFlow Lite files. `ovos-ww-plugin-precise-onnx` runs the same models converted to ONNX, with `onnxruntime` and `sonopy` for the audio features and no TensorFlow on the device. The [precise-lite-models](https://github.com/OpenVoiceOS/precise-lite-models) repository carries the converted community set: `hey_mycroft`, `computer`, `hey_chatterbox`, `hey_firefox`, `hey_k9`, `hey_kit`, `hey_moxie`, `hey_scout`, `jarvis`, `marvin`, `sheila`, `android`, `christopher`, `athena` and `hey_robin`, most in both `.onnx` and `.tflite` form.

```bash
pip install ovos-ww-plugin-precise-onnx
```

```json
{
  "listener": {"wake_word": "hey_mycroft"},
  "hotwords": {
    "hey_mycroft": {
      "module": "ovos-ww-plugin-precise-onnx",
      "model": "https://github.com/OpenVoiceOS/precise-lite-models/raw/master/wakewords/en/hey_mycroft.onnx",
      "trigger_level": 3,
      "sensitivity": 0.5
    }
  }
}
```

Version 0.1.0 (stable on PyPI) in a fresh environment downloads the model from that URL and, fed two seconds of silence, stays quiet:

```python
import numpy as np
from ovos_ww_plugin_precise_onnx import PreciseOnnxHotwordPlugin

p = PreciseOnnxHotwordPlugin(key_phrase="hey_mycroft", config={
    "model": "https://github.com/OpenVoiceOS/precise-lite-models/raw/master/wakewords/en/hey_mycroft.onnx",
    "trigger_level": 3, "sensitivity": 0.5})
for _ in range(20):
    p.update(np.zeros(1600, dtype=np.int16).tobytes())
print(p.found_wake_word())
```

```
False
```

## Vosk keyword spotting, in any Vosk language

`ovos-ww-plugin-vosk` takes a different route: it runs the [Vosk](https://alphacephei.com/vosk/) speech recognizer over short audio chunks in keyword mode and compares the transcript with one or more sample phrases. There is no wake-word model to train. Any phrase in any language Vosk has a model for works, and the plugin downloads the model for the configured language on first use.

```bash
pip install ovos-ww-plugin-vosk
```

```json
{
  "listener": {"wake_word": "hey_computer"},
  "hotwords": {
    "hey_computer": {"module": "ovos-ww-plugin-vosk", "listen": true}
  }
}
```

Four keys matter when a phrase is hard to catch. `samples` lists the transcripts to accept, so "hey microsoft" can stand in for "hey mycroft". `rule` sets how a transcript is compared with the samples. `full_vocab` switches from keyword mode to the model's whole vocabulary. `time_between_checks` sets the seconds between inferences, from 0.2 to 3. A second entry point, `ovos-ww-plugin-vosk-multi`, matches several phrases at once.

Version 0.1.10 (stable on PyPI, `vosk` 0.3.45) builds a two-word grammar for "hey computer" and, on three seconds of silence, returns `False`. The model download on first run is the slow part.

## wakewordlab's compact neural models

[wakewordlab](https://github.com/ubermorgenland/wakewordlab) is a third-party library of compact neural wake-word models with a Silero voice-activity pre-filter. The detector only runs when someone is speaking. `ovos-ww-plugin-wakewordlab` wraps it. `model` is a wake-word slug or a path to a `.wkw` or `.onnx` file, `threshold` is the confidence cut-off, `vad` and `vad_threshold` control the pre-filter, and `license_key` unlocks the library's commercial models. `wakewordlab.list_models()` prints what is available. Models download on first use into `~/.cache/wakewordlab/models/`.

```json
{
  "hotwords": {
    "hey jarvis": {
      "module": "ovos-ww-plugin-wakewordlab",
      "model": "hey_jarvis",
      "threshold": 0.5,
      "vad": true,
      "vad_threshold": 0.5
    }
  }
}
```

This plugin has GitHub releases (0.0.1a2) and no package on PyPI, so it cannot be installed with `pip install ovos-ww-plugin-wakewordlab` as its README says. It was not run for this post for that reason. The library itself, `wakewordlab` 0.1.1, is on PyPI.

## Which one

Precise ONNX is the default on OVOS images and the right choice when a community model for your phrase exists. Vosk fits a phrase or a language nobody trained a model for. The cost is a speech-recognition model in memory and a slower check. wakewordlab fits a device that needs voice-activity detection anyway and wants a small neural detector. It stays experimental until it reaches PyPI. A phrase none of them covers is what [WakeForge](https://github.com/TigreGotico/wakeforge) trains, and `ovos-ww-plugin-wakeforge` runs.

## Limits

None of these plugins was tested against a real voice here. Silence proving negative is the check that was run. Vosk's keyword mode is only as good as the model's vocabulary for the phrase. The Precise community models are English-heavy. Bugs go to each plugin's issue tracker on GitHub: [precise-onnx](https://github.com/OpenVoiceOS/ovos-ww-plugin-precise-onnx/issues), [vosk](https://github.com/OpenVoiceOS/ovos-ww-plugin-vosk/issues), [wakewordlab](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakewordlab/issues).

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
