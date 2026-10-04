---
title: "New default wake words, and any wake word with no training"
excerpt: "OVOS ships 27 calibrated wake word models, in five languages, and uses them by default. And with WakePhoneHuBERT, you can type any wake word in any language and use it at once, with no training at all."
coverImage: "/assets/blog/wakeforge/thumb.jpg"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAI
  picture: "https://avatars.githubusercontent.com/u/33701864"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/wakeforge/thumb.jpg"
---

## New default wake words, and any wake word with no training

Two pieces of wake word work come together in this post. The first: OVOS has a set of trained wake word models that you can trust, and the default configuration uses them. The second: a small model that lets you use a wake word that nobody trained, in your own language, by typing how it sounds.

---

### 27 wake words with a threshold that means something

The [**OVOS wakeforge plugin**](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge) loads ready models by name from [OpenVoiceOS/wakehubert-wakewords](https://huggingface.co/OpenVoiceOS/wakehubert-wakewords). 27 of them are calibrated:

alexa, android, hello nabu, hey chatterbox, hey computer, hey floyd, hey jarvis, hey k9, hey marvin, hey mycroft, hey potato, hey rhasspy, hey robin, hey scout, hey ziggy, home assistant, jarvis, marvin, okay nabu, sheila, stop and wake up in English; "hey stemcom" and "wakker worden" in Dutch; "aufwachen" in German; "despierta" in Spanish; and "sveglia" in Italian.

On a calibrated model, a threshold of **0.5 gives about one false activation per hour** on the calibration audio. That is the same on every word, so the threshold is a real sensitivity knob. Raise it if the assistant wakes up when nobody called it. Lower it if it misses you. Each model also has its own default, which counts a missed wake word as worse than a false one.

Every model was trained on **synthetic speech only**. Nobody recorded a hundred people saying "okay nabu". Where real recordings exist, we tested on them. False activations are counted on 46.5 hours of speech, noise and household audio:

| Model | Recall on real people | False activations per hour |
|---|---|---|
| `wakehubert_jarvis` (384 clips) | 98.4% | 0.69 |
| `wakehubert_alexa` (315 clips) | 98.4% | 0.60 |
| `wakehubert_hey_floyd` (96 clips) | 91.7% | 0.47 |
| `wakehubert_hey_chatterbox` (116 clips) | 82.8% | 0.09 |
| `wakehubert_sheila` (212 clips) | 88.7% | 2.08 |
| `wakehubert_marvin` (195 clips) | 73.3% | 0.77 |

At a threshold of 0.8, "jarvis" goes to 93.8% recall and 0.15 false activations per hour, and "alexa" to 91.4% and 0.28. The [model page](https://huggingface.co/OpenVoiceOS/wakehubert-wakewords) has every word, and the [demo Space](https://huggingface.co/spaces/OpenVoiceOS/wakehubert-wakewords-space) lets you try them in your browser.

---

### In OVOS by default

The default configuration uses these models:

- **"wake up"**, the word that wakes OVOS from sleep mode, runs on `wakehubert_wake_up`.
- **"hey mycroft"** runs on the Precise ONNX model first. If that cannot load, it falls back to `wakehubert_hey_mycroft`, then to Vosk.

To use another word, name the model:

```json
{
  "listener": {"wake_word": "jarvis"},
  "hotwords": {
    "jarvis": {
      "module": "ovos-ww-plugin-wakeforge",
      "model": "wakehubert_jarvis",
      "listen": true
    }
  }
}
```

Install the plugin with `pip install --pre ovos-ww-plugin-wakeforge`.

---

### Any wake word, with no training: WakePhoneHuBERT

A trained model needs a training run for each word. [**WakePhoneHuBERT**](https://huggingface.co/TigreGotico/wakephonehubert) removes that step. It is a 3.5 MB streaming model that hears speech as phones, the sounds of a language written in IPA, from a head trained on speech in 24 languages. You give it the phones of your wake word, and it listens for them. No recordings, no training.

The `ovos-ww-plugin-wakeforge-zeroshot` engine in the same plugin runs it. This is how the Portuguese "wake up" word is set in the default configuration for `pt-PT`, with two phrases:

```json
"wake_up": {
  "module": "ovos-ww-plugin-wakeforge-zeroshot",
  "ipa": ["ɐ k ɔ ɾ d ɐ", "d ɨ ʃ p ɛ ɾ t ɐ"],
  "wakeup": true,
  "fallback_ww": "wake_up_vosk"
}
```

All 49 language files of the default configuration set "wake up" this way, so it works in languages where nobody trained a model. To get the phones of your own phrase, run `espeak-ng -q --ipa -v en-us "hey luna"`. The [WakePhoneHuBERT Space](https://huggingface.co/spaces/TigreGotico/wakephonehubert-space) shows the phones it hears from your microphone, and spots a word that you type, all in the browser.

---

### How well it works, honestly

It works well for some words and badly for others, so measure yours. On real speakers, at one false activation per hour, it found 87.0% of "jarvis" and 76.4% of "computer", better than every trained head we had for "computer". It found only 41.6% of "alexa", where a trained model is needed.

We also measured it in OVOS. On 50 synthetic "hey luna" clips it found 94%, with no false activations in 30 minutes of read speech. On 96 real "hey floyd" recordings from the community, the default threshold found only 19.8%. With `"threshold": -0.3` it found 96.9%, with 4.7 false activations per hour. Real voices score lower than synthetic ones, so if the engine misses you, lower the threshold a little.

For your everyday wake word, a trained model is still better. For a language or a name with no model, the zero-shot engine works today.

---

### Built in the Open, Funded for the Commons

This work was developed by [TigreGótico](https://tigregotico.pt) for OpenVoiceOS and is part of the OpenVoiceOS **From Beta to Breakthrough** milestone, funded through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of [DG Communications Networks, Content and Technology](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en) under grant agreement No [101135429](https://cordis.europa.eu/project/id/101135429). Additional funding is made available by the [Swiss State Secretariat for Education, Research and Innovation](https://www.sbfi.admin.ch/sbfi/en/home.html) (SERI).

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
