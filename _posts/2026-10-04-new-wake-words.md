---
title: "Wake word freedom: train any wake word without recordings"
excerpt: "OVOS can now train a new wake word from synthetic speech alone, with no real recordings. You get twenty-one ready wake words today, \"wake up\" can come to every language, the Precise ONNX plugin is being retired, and you can ask us for the wake word you want."
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

## Wake word freedom: train any wake word without recordings

For years, a new wake word meant collecting recordings: hundreds of real people saying the word, in different rooms, on different microphones. That is why OVOS users had so few wake words to choose from, and why a word in a less common language was often out of reach.

That is no longer the case. OVOS can now train a new wake word **without any real recordings**, from synthetic speech alone. Text-to-speech voices say the word, voice cloning spreads it across many speakers, and the model learns from that. Recordings of real people are used only to test the result. This is much easier than training a Precise model ever was. A future post will show how you can train your own wake word.

The models run in a new plugin, [**ovos-ww-plugin-wakeforge**](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge). If you want to know how they work inside, read [How we distilled HuBERT into 1.22 MB for wake words](https://blog.openvoiceos.org/posts/2026-10-02-wakeforge-wake-words).

---

### Many more wake words, today

These wake words are ready to use:

- **Assistant names:** "alexa", "jarvis", "hey jarvis", "computer", "hey computer", "android", "home assistant", "hey mycroft"
- **Hey + a name:** "hey chatterbox", "hey floyd", "hey k9", "hey marvin", "hey rhasspy", "hey robin", "hey scout"
- **Nabu:** "okay nabu", "hello nabu"
- **Single words:** "marvin", "sheila", "stop", "wake up"

You do not download anything by hand. Name the wake word in your configuration, and the plugin downloads that model the first time it is used, checks the file against its published checksum, and keeps it in the cache. All of these models are English and licensed Apache-2.0, and everything runs offline on your device. The [model page](https://huggingface.co/OpenVoiceOS/wakehubert-wakewords) lists each model with its test results.

---

### Sleep mode, and "wake up" in your language

OVOS has a sleep mode, built into its listener. Say "go to sleep" or "nap time", and the [naptime skill](https://github.com/OpenVoiceOS/ovos-skill-naptime) puts the assistant to sleep. While it sleeps, speech recognition does not run at all, so nothing you say is transcribed or sent anywhere, even after an accidental activation. Use it for a meeting, a private conversation, or an evening when you do not want to be interrupted. The skill can also mute the audio while the assistant sleeps.

A sleeping assistant does not answer to its name alone. To wake it, you say two things in a row: its name, such as "hey mycroft", and then, within ten seconds, the wake-up word, "wake up". Both are detected locally, on your device. If only the name is heard, the assistant stays asleep.

The two words have different jobs. The name is your choice, and it does not need to belong to any language. "Wake up" is a command, and people give commands in their own language. Until now that was a problem: a good wake-up model for another language needed recordings of people saying it, so the wake-up word stayed in English.

Because no recordings are needed any more, "wake up" can be trained for any language, and everyone can have a sleep mode that wakes in their own language. The English `wake_up` model is ready today. To use it as the wake-up word, add this to your `mycroft.conf`:

```json
{
  "listener": {
    "stand_up_word": "wake_up"
  },
  "hotwords": {
    "wake_up": {
      "module": "ovos-ww-plugin-wakeforge",
      "model": "wakehubert_wake_up",
      "wakeup": true
    }
  }
}
```

A follow-up post covers "wake up" in other languages.

---

### The threshold is a real sensitivity knob

With most wake word engines, the threshold is a guess, and 0.5 means something different for every word. Nineteen of these models are *calibrated*: the score is adjusted so that a threshold of 0.5 gives about one false activation per hour on the audio it was calibrated on. Every model also has its own tuned default. If your assistant wakes up when nobody called it, raise the threshold toward 0.8 or 0.9. If it misses you, lower it. The rate on your own audio will differ somewhat. The "computer" and "hey mycroft" models are not calibrated yet.

The models are also good at ignoring words that only sound similar. Timon, one of the OVOS maintainers, tried "alexa" in the browser demo and found that "it's very good in not responding on alex, alexia, alexander, alles (a Dutch word), etc." Some wake words in this set do sound like each other, for example "jarvis" and "hey jarvis". If you run two similar wake words at the same time, raise their thresholds. The model page lists every known pair.

---

### How it compares

We tested our models against [openWakeWord](https://github.com/dscripka/openWakeWord) and [microWakeWord](https://github.com/kahrendt/microWakeWord) on the same audio, with false activations counted on 31.1 hours of public speech and noise. The table shows the share of wake words detected at one false activation per hour. A dash means that system has no model for the word.

| Wake word (test clips) | wakeforge | openWakeWord | microWakeWord |
|---|---|---|---|
| alexa, real speakers (315) | 89.2% | 97.5% | 98.7% |
| hey jarvis, synthetic voices (384) | 97.4% | 97.4% | 79.7% |
| okay nabu, synthetic voices (386) | 95.9% | – | 60.1% |
| hey rhasspy, synthetic voices (374) | 100.0% | 100.0% | – |

On real speakers saying "alexa", the established alternatives are ahead, and we are working on it. The synthetic voices are ones no model was trained on, but real speakers are the stronger test.

---

### Retiring the Precise ONNX plugin

We are retiring [ovos-ww-plugin-precise-onnx](https://github.com/OpenVoiceOS/ovos-ww-plugin-precise-onnx). It has been on life support for a while. Nobody trains new Precise models any more, so the plugin exists only to run old ones, and the new models will make those obsolete over time.

If you use it today, switch to the wakeforge plugin. Install it:

```bash
pip install --pre ovos-ww-plugin-wakeforge
```

Then put this in your `mycroft.conf`:

```json
{
  "listener": {
    "wake_word": "hey_mycroft"
  },
  "hotwords": {
    "hey_mycroft": {
      "module": "ovos-ww-plugin-wakeforge",
      "model": "wakehubert_hey_mycroft",
      "listen": true
    }
  }
}
```

For another word, change `hey_mycroft` to that word and the model to `wakehubert_<word>`, for example `wakehubert_hey_jarvis`. To change the sensitivity, add `"threshold": 0.8` to the hotword. Restart OVOS and say your wake word. Our "hey mycroft" model does not yet do as well on our tests as the other two engines, and a better one is in the works.

Before you change anything, you can try every model with your own voice in the [WakeHuBERT wake words Space](https://huggingface.co/spaces/OpenVoiceOS/wakehubert-wakewords-space). It runs in your browser and shows a live score for each word. The [plugin README](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge) lists every option, and bugs go to its [issue tracker](https://github.com/OpenVoiceOS/ovos-ww-plugin-wakeforge/issues).

---

### Wake word freedom: ask for yours

Your assistant should answer to the name you choose, in your language. If the wake word you want is not in the list, join us in the [OVOS chat on Matrix](https://matrix.to/#/#OpenVoiceOS:matrix.org) and ask for it. Tell us the word and the language, and we will train a model for you.

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
