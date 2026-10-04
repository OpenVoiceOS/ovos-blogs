---
title: "A sensitivity knob for wake words, and a small base model to build on"
excerpt: "Nineteen ready OVOS wake word models now have a calibrated threshold that means something, and WakePhoneHuBERT, a 3.5 MB streaming base model, adds speaker-aware voice activity and phone output for voice apps."
coverImage: "/assets/blog/wakeforge/thumb.jpg"
date: "2026-10-04T00:00:00.000Z"
author:
  name: JarbasAI
  picture: "https://avatars.githubusercontent.com/u/33701864"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/wakeforge/thumb.jpg"
---

## A sensitivity knob for wake words, and a small base model to build on

Most wake word engines give you a threshold and no idea what it means. Is 0.7 strict or lax? Is 0.95 safe? The answer is different for every model, so you end up guessing, saying the word a few times and hoping.

The ready models of the [**OVOS wakeforge plugin**](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge) now come with a threshold that means the same thing on every word. This post covers how that works, which words are available, how the models are made, and a second piece of work that came out of the same effort: **WakePhoneHuBERT**, a small streaming base model for voice apps.

---

### The threshold now means something

Each calibrated model maps its raw score so that a threshold of **0.5 targets about one false activation per hour** on the calibration audio (LibriSpeech development speech, babble and AudioSet noise). Raise the threshold and you get fewer false activations and fewer detections. Lower it and you get the opposite.

Each model also has a default threshold, chosen to maximise F2, which weighs finding the word above never firing by mistake. For a quiet living room that is a sensible start. For a noisy kitchen with a television, raise it.

Two cautions. On audio unlike the calibration audio, the false activation rate at 0.5 differs from word to word, so treat 0.5 as a reference point and the measured table below as the guide. And similar-sounding words can trigger each other's models: the README lists the pairs, and the advice is to raise the thresholds when two models run side by side.

### Which words

There are 19 calibrated models, each a small classifier running on an int8 feature extractor, so the whole thing is light enough for a single-board computer:

alexa, android, hello nabu, hey chatterbox, hey computer, hey floyd, hey jarvis, hey k9, hey marvin, hey rhasspy, hey robin, hey scout, home assistant, jarvis, marvin, okay nabu, sheila, stop and wake up.

The repository also holds two older models that are not calibrated. "computer" is one of them. Their scores are not mapped to a false activation rate, so their thresholds sit close to 1 and mean something different on each model.

Models are named `wakehubert_<word>` and downloaded from [OpenVoiceOS/wakehubert-wakewords](https://huggingface.co/OpenVoiceOS/wakehubert-wakewords) on Hugging Face the first time you use one. The plugin checks the download against the SHA-256 listed in the repository's `models.json` and reuses the cached file afterwards.

### How the models are made

Every calibrated model was trained on **synthetic speech only**. A word is typed, a grid of text-to-speech voices says it at several speeds and pitches, and the clips are cloned onto many speaker voices. A small classifier is trained on top of the features of [WakeHuBERT tiny](https://huggingface.co/TigreGotico/wakehubert-tiny). Nobody has to record a hundred people saying "okay nabu". The framework that does this is [wakeforge](https://github.com/TigreGotico/wakeforge), which is open: it is a research framework, not a one-click model maker, but anyone can use the same recipe for their own word.

The models are then tested on voices they never saw. Where public recordings of real speakers exist, we test on those too: "alexa" and "jarvis" on the Picovoice wake word benchmark, "marvin", "sheila" and "stop" on the Speech Commands test set. For the other words the test voices are held-out synthetic ones, which measure less, because recall on real speakers can be lower.

Some of the real-speaker results, measured through the plugin at each model's default threshold. False activations are counted over 46.5 h of negative audio (speech, non-speech and household audio).

| model | default threshold | recall | false activations per hour |
|---|---|---|---|
| `wakehubert_jarvis` (384 real recordings) | 0.57 | 98.4% | 0.69 |
| `wakehubert_alexa` (315 real recordings) | 0.40 | 86.7% | 0.69 |
| `wakehubert_marvin` (195 real recordings) | 0.06 | 73.3% | 0.77 |
| `wakehubert_sheila` (212 real recordings) | 0.47 | 88.7% | 2.08 |
| `wakehubert_stop` (411 real recordings) | 0.14 | 86.6% | 2.06 |

Raising the threshold does what the knob promises. At 0.8, "alexa" falls to 73.3% recall with 0.13 false activations per hour, and "jarvis" to 93.8% with 0.15. "sheila" and "stop" are the noisiest at their defaults, about two false activations per hour, so raise them if that is too many. "marvin" is the odd one: its calibration is steep, and its recall and false activation rate barely change between 0.06 and 0.8.

The full table, with every word, is in the [plugin README](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge).

---

### Use it in OVOS

Install the plugin, using the `--pre` flag because it has prerelease versions only:

```bash
pip install --pre ovos-ww-plugin-wakeforge
```

Then put this in `mycroft.conf`, naming the hotword to match the model:

```json
{
  "listener": {
    "wake_word": "jarvis"
  },
  "hotwords": {
    "jarvis": {
      "module": "ovos-ww-plugin-wakeforge",
      "model": "wakehubert_jarvis",
      "threshold": 0.8,
      "listen": true
    }
  }
}
```

Leave `threshold` out to use the model's default. A model you trained yourself with wakeforge is used by pointing `model` at its ONNX file instead of a ready model name.

---

### WakePhoneHuBERT: a base model for voice apps

The feature extractor under these models is trained only to be good at wake words. We wondered what else a tiny streaming model could carry, so we built **WakePhoneHuBERT**. It keeps the WakeHuBERT tiny trunk frozen, so its main output is identical to the published int8 model and every wake word head keeps working, and it adds two small heads:

- **Active-speaker voice activity.** A usual voice activity detector fires on any speech, near or far. This one is trained to stay quiet on talkers who are not the foreground speaker. On babble made of background talkers its mean output is 0.048, where Silero VAD's is 0.70. On 94.96% of frames it agrees with its foreground-only target where a foreground speaker is present.
- **Phone output.** Frame-level probabilities over a shared IPA phone inventory, covering several languages.

The whole model is 3.5 MB (1.63 million parameters) and streams. One call on a 1.5 s window, run every 80 ms as the plugin would, takes about 3.2 ms on one CPU thread of a server under other load. WakeHuBERT tiny alone takes about 1 ms.

It is meant as a **feature extractor to build on**, not a finished product. A small head trained on its outputs does a task that a bare tiny model does poorly. In a frozen-feature benchmark, a linear phone recogniser on WakePhoneHuBERT's features has a phone error rate of 35.9% on LibriSpeech test-clean, against 53.9% for WakeHuBERT tiny. Language identification over ten languages rises from 58.5% to 72.4% accuracy. Read with no training at all, the mean phone posteriors of a clip identify its language 47.9% of the time, where chance is 10%.

Three things it can do directly, with no training:

- **Language identification**, as above.
- **Phone alignment.** Aligning a transcript to the phone output puts 70.5% of word boundaries within 50 ms of a reference aligner on LibriSpeech test-clean. A small trained head on the same features reaches 94.7%.
- **Zero-shot keyword spotting from typed phones.** Type a word, convert it to phones, and score the phone output against it, with no training for that word. We tried three words on real-speaker recordings, at one false activation per hour:

| word | zero-shot | trained heads |
|---|---|---|
| computer | 76.4% | 64.5% to 73.5% |
| jarvis | 87.0% | 95.3% to 98.7% |
| alexa | 41.6% | 79.4% to 91.1% |

For "computer", spotting from typed phones beat every head we trained. For "jarvis" the trained heads win by 8 to 12 points, and for "alexa" zero-shot spotting is far behind. So it works for some words and not others, and we cannot yet say which in advance.

Some honest limits. The phone output is not accurate in absolute terms: its zero-shot phone error rate is 38.8% on read English and between 48% and 79% on the other languages we tested. It was trained mostly on isolated words from read speech, and spontaneous speech is not measured. The trunk was trained to discard speaker detail, so this is not a model for speaker identification.

And the result that matters most for this post: **on the three words we tested, WakePhoneHuBERT does not improve wake word detection over WakeHuBERT tiny.** With the same training recipe, "alexa" is within the seed-to-seed spread, "jarvis" is equal or lower, and "computer" is lower by 4.9 to 9.0 points. The three words and two seeds do not rule out a recipe that uses the extra outputs differently, but for wake words, WakeHuBERT tiny remains the model to use. That is why the ready models above run on it.

All these figures come from our paper draft, which is not yet published. The model and a demo will be public soon.

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
