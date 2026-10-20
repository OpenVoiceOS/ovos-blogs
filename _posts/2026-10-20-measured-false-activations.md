---
title: "What wakes your assistant by mistake? We measured it"
excerpt: "We played an hour of real false-activation audio through the OVOS listener, with and without the pre-wake VAD and the wake word verifiers. Here is what each filter removes, what it costs, and a script to measure your own room."
coverImage: "/assets/blog/prewake-vad/thumb.png"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAI
  picture: "https://avatars.githubusercontent.com/u/33701864"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/prewake-vad/thumb.png"
---

## What wakes your assistant by mistake? We measured it

When we [introduced the pre-wake VAD](https://blog.openvoiceos.org/posts/2025-11-06-prewake-vad), we said it would reduce false activations. A claim like that needs a number. So we built a small tool that plays recordings through the real OVOS listener and counts two things: how many real wake words it hears, and how many times per hour it wakes up when nobody called it.

---

### The test

The positives are real people. We used the "hey floyd" and "hey chatterbox" recordings from the [OVOS community wake word dataset](https://huggingface.co/datasets/OpenVoiceOS/ovos-community-wakewords-dataset).

The negatives are an hour of the [wake_word_noise](https://huggingface.co/datasets/OpenVoiceOS/wake_word_noise) dataset. Most of it is audio that really woke an OVOS device by mistake: room noise, taps on the microphone, coughs and half-heard words. That makes it a hard and honest test.

The audio runs through the real listener loop, not a copy of it. The wake word engine is the [wakeforge plugin](https://blog.openvoiceos.org/posts/2026-10-02-wakeforge-wake-words) with its ready models.

---

### The results

| Wake word | Setup | Wake words heard | False activations per hour |
|---|---|---|---|
| hey chatterbox | engine only | 81.0% | 4.9 |
| hey chatterbox | pre-wake VAD | 81.9% | 4.9 |
| hey chatterbox | Silero verifier | 69.8% | 4.9 |
| hey chatterbox | both | 78.4% | 4.9 |
| hey floyd | engine only | 91.7% | 1.0 |
| hey floyd | pre-wake VAD | 93.8% | 0 |
| hey floyd | Silero verifier | 79.2% | 1.0 |
| hey floyd | both | 82.3% | 0 |

The audio went into the listener in 128 ms chunks, as a default OVOS microphone delivers it, with a quiet noise floor before each wake word, as a real room has. Three things stand out.

**The pre-wake VAD costs nothing.** It lost no wake words, and it removed the one false activation of "hey floyd". It is on by default, and it should stay on.

**The Silero verifier is not worth it.** It did not remove a single false activation that the VAD did not also remove, and it threw away 11 to 13 of every 100 real wake words. It is off by default. Leave it off unless your own measurement shows a gain.

**The worst false activations are words.** Three of the five "hey chatterbox" false activations come from one phrase in the noise set: "a cheddar block". Say it fast and you will hear why. No VAD can reject it, because it is speech. Only a better model, or a higher threshold, removes it.

We also played 5.4 hours of read English through the loop with "hey floyd". The engine woke up 0.56 times per hour, with or without the VAD. Against speech, a VAD cannot help.

---

### When the TV is the problem

A voice on the TV is speech too, so the VAD lets it through. For that case, the [speaker verifier](https://blog.openvoiceos.org/posts/2026-09-26-speaker-verifier) accepts a wake word only from enrolled voices. We tested it with households of four people from LibriSpeech. At the default threshold, it let through 0.36% of outsiders and rejected 5% of household members.

---

### A bug we found on the way

We also ran the Vosk wake word plugin through the same loop. It heard only 36.5% of the "hey floyd" clips, and 85.4% with the pre-wake VAD. The plugin transcribed only the audio since its previous check, every 0.64 seconds. A wake word that crossed a check boundary was cut in two and missed, and whether that happened depended on where the word fell. With smaller 64 ms chunks it heard nothing at all, because the plugin also counted its checks in calls instead of audio time.

The [fix](https://github.com/OpenVoiceOS/ovos-ww-plugin-vosk/pull/49) counts audio time, and each check transcribes the last three seconds. Vosk then heard all 96 clips, alone and with the VAD. It woke up twice in the hour of noise, and never in 30 minutes of read speech. Once the fix is merged, it ships in the next alpha.

---

### Measure your own room

These numbers are for our audio. Your TV, your room and your voices are different. The script that made the table is `examples/measure_false_activations.py` in [ovos-dinkum-listener](https://github.com/OpenVoiceOS/ovos-dinkum-listener). Record an hour of your normal evening, a few clips of your family saying the wake word, and run it:

```bash
python measure_false_activations.py \
    --module ovos-ww-plugin-wakeforge --ww-config '{"model": "wakehubert_hey_floyd"}' \
    --vad ovos-vad-plugin-silero --verifier ovos-ww-verifier-silero \
    --positives my_wake_words/ --negatives my_evening/ --out results.json
```

The [technical manual](https://openvoiceos.github.io/beta-technical-manual/) has a set of wake word guides that use these numbers: stop wake-ups from the TV, tune the threshold, compare engines on your own audio, and train a wake word for your own name.

---

### Built in the Open, Funded for the Commons

This work is part of the OpenVoiceOS **From Beta to Breakthrough** milestone, funded through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of [DG Communications Networks, Content and Technology](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en) under grant agreement No [101135429](https://cordis.europa.eu/project/id/101135429). Additional funding is made available by the [Swiss State Secretariat for Education, Research and Innovation](https://www.sbfi.admin.ch/sbfi/en/home.html) (SERI).

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
