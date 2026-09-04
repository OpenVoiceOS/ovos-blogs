---
title: "Only You Can Order the Cheeseburgers: Speaker Verification Comes to OVOS"
excerpt: "A new wake word verifier plugin teaches OpenVoiceOS to recognise *who* is speaking, not just *what* was said. Enrolled household voices get through the wake gate; the TV advert and the guest who thinks he's funny don't."
coverImage: "/assets/blog/common/cover.png"
date: "2026-06-16T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/common/cover.png"
---

## Only You Can Order the Cheeseburgers: Speaker Verification Comes to OVOS

A wake word engine only checks *what* was said. It doesn't check *who* said it. A guest who shouts "Hey Mycroft, order a thousand cheeseburgers" gets through. So does a TV advert that happens to say your hotword. The [**OVOS Wake Word Verifier Plugin — Speaker**](https://github.com/OpenVoiceOS/ovos-ww-verifier-plugin-speaker) closes that gap: it checks the voice against your household's enrolled profiles before anything else happens.

**Try it now:**

```bash
pip install ovos-ww-verifier-plugin-speaker
ovos-speaker-enroll Alice clip1.wav clip2.wav clip3.wav
```

Enable it in `~/.config/mycroft/mycroft.conf`:

```json
{
  "listener": {
    "ww_verifiers": {
      "ovos-ww-verifier-speaker": {
        "model": "wespeaker-resnet34",
        "threshold": 0.45,
        "fail_open": true
      }
    }
  }
}
```

Restart your OVOS service. Enroll first, then tighten `threshold` — with no profiles enrolled, the plugin accepts everyone by design, so installing it never locks you out.

---

### A Gate After the Gate

A wake word engine's job stops at detection: it can't tell you from a guest, or from the dog's squeaky toy. [**ovos-dinkum-listener PR #191**](https://github.com/OpenVoiceOS/ovos-dinkum-listener/pull/191) adds a **wake word verifier framework** to close that gap — after a wake word fires, the captured audio passes through any installed verifier plugins before recording or intent handling starts. [**ovos-plugin-manager PR #341**](https://github.com/OpenVoiceOS/ovos-plugin-manager/pull/341) defines the `HotWordVerifier` template and a new `opm.wake_word.verifier` entry point, so verifiers are discovered the same way wake word engines, STT, and TTS plugins already are.

The voting rule is strict:

- If **any** verifier returns `False`, the detection is silently discarded.
- If **all** verifiers accept (or none are configured), the wake proceeds normally.
- The chain is **fail-open on error**: if a verifier raises an exception, the listener logs it and lets the detection through instead of locking you out.

The speaker verifier is the first plugin built on this hook, and the third gate in a pattern OVOS has been building for a while: [**Pre-Wake-VAD**](https://blog.openvoiceos.org/posts/2025-11-06-prewake-vad) asks "is this even speech?" before the wake word engine runs; the [**Transcription Validator Plugin**](https://blog.openvoiceos.org/posts/2025-07-22-ovos-transcription-validator-plugin) asks "does this make sense?" after transcription; the speaker verifier asks "are *you* allowed to say it?"

---

### How It Works

1. A wake word engine detects an activation ("Hey Mycroft").
2. The verifier extracts a **speaker embedding** — a fixed-length numeric fingerprint of the voice — using the [`speakeronnx`](https://github.com/TigreGotico/speakeronnx) library.
3. It compares that embedding against enrolled household profiles with cosine similarity.
4. A match lets the wake through. No match, and it's dropped silently: `recognizer_loop:record_begin` never fires on the bus, so the listener never starts recording.

Two effects fall out of this directly. Random audio from the TV or radio won't match an enrolled voice, so it stops tripping the assistant. And a visitor who knows the hotword still can't fire routines, play music, or touch your smart home — only enrolled voices can.

---

### Privacy by Design

- Profiles are the L2-normalised mean of your enrollment clips' embeddings, stored locally in `~/.local/share/ovos_speaker_verifier/profiles.json`.
- No audio is retained after the embedding is extracted.
- Embeddings cannot be reversed back into audio.
- Everything runs locally — no cloud, no account.

Your voiceprint stays on your hardware, as a list of numbers.

---

### Tuning

`threshold` (default `0.45`) is calibrated for the default `wespeaker-resnet34` model, and **does not transfer between models**: cosine-similarity scales differ by architecture. In our tests, the same enrolled-vs-guest pair scored ~0.95 / 0.89 on `titanet-small` but ~0.17 / 0.14 on `campplus`. Swap `model` for one of the other supported options — `wespeaker-ecapa512`, `campplus`, `eres2net`, `titanet-large`, `redimnet-b2`, and more, all downloaded and cached on first use — and re-tune `threshold` to match. `per_profile_thresholds` lets you set a stricter bar for some people than others.

Two "fail-open" settings look similar but do different jobs. The framework-level one is about *errors*: a crashing verifier never suppresses a wake. The plugin's `fail_open: true` is about *enrolment*: before you've enrolled anyone, the verifier accepts everything, so installing it doesn't brick the assistant.

---

### What's Still Rough

The verifier only sees the wake-word window itself — roughly a second of audio, not the full command that follows. Speaker identity from a clip that short is weaker than from a whole sentence, and audio under about half a second can produce unreliable embeddings. A clearly spoken hotword works best; a mumbled one is where a genuine household member is most likely to get turned away wrongly. This is a real gate, not a biometric lock.

Enrolment is also still command-line only: record a few WAV clips, run `ovos-speaker-enroll`. That's fine at a terminal, but it's not the guided "repeat after me" experience this deserves yet.

The verifier framework and the matching engine are solid — tested end-to-end through a real listener in the test suite. The enrolment experience is what still needs work: spoken enrollment, a GUI, and easier profile management are next. If you want to help build that, we'd like to hear from you.

---

### Built in the Open, Funded for the Commons

The speaker verifier was developed by [TigreGótico](https://tigregotico.pt) for OpenVoiceOS, funded through the [NGI0 Commons Fund](https://nlnet.nl/project/OpenVoiceOS) established by [NLnet](https://nlnet.nl) with support from the European Commission's [Next Generation Internet](https://ngi.eu) programme.

As we shared when [**OpenVoiceOS received its NGI Zero Commons Fund grant**](https://blog.openvoiceos.org/posts/2025-10-20-ngi), that funding goes toward the plumbing a community project rarely has the resources to polish: privacy, reliability, listener internals. Speaker verification fits the pattern — privacy-first, built in the open, no cloud account required.

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
