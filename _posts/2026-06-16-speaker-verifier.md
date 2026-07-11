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

We've all been there. You're hosting friends, someone spots your OVOS device across the room, grins, and shouts: *"Hey Mycroft, order a thousand cheeseburgers!"* Hilarious. Or the TV plays an advert with a familiar wake word and your assistant perks up at thin air.

Today we're introducing a building block that tackles both problems at once: the [**OVOS Wake Word Verifier Plugin — Speaker**](https://github.com/OpenVoiceOS/ovos-ww-verifier-plugin-speaker). It teaches OpenVoiceOS to recognise **who** is speaking, not just **what** was said.

---

### Wake Word Verifiers: A Gate After the Gate

Detecting a wake word is the *first* gate. But that gate doesn't care whether the "Hey Mycroft" came from you, a guest, the television, or the dog's squeaky toy that happens to sound vaguely like your hotword. It just opens.

To fix this, [**ovos-dinkum-listener PR #191**](https://github.com/OpenVoiceOS/ovos-dinkum-listener/pull/191) added a general **wake word verifier framework**. After a wake word engine fires, the captured audio is passed through any installed *verifier plugins* before recording or intent handling begins. The plumbing lives in [**ovos-plugin-manager PR #341**](https://github.com/OpenVoiceOS/ovos-plugin-manager/pull/341), which defines a `HotWordVerifier` plugin template and a new `opm.wake_word.verifier` entry-point type — so verifiers are discovered automatically, just like wake word engines, STT, or TTS plugins.

When more than one verifier is installed, they vote, and the rule is deliberately strict:

- If **any** verifier returns `False`, the detection is silently discarded.
- If **all** of them accept (or none are configured), the wake proceeds as normal.
- The chain is **fail-open on error**: if a verifier raises an unexpected exception, the listener logs it and lets the detection through rather than locking you out of your own house. Only an explicit rejection suppresses the wake.

The speaker verifier is the first plugin to use this hook.

It's the natural next step in a longer story. We've been steadily teaching OVOS to be pickier about what it acts on: first by filtering *non-speech* noise before the wake word engine even runs, with [**Pre-Wake-VAD**](https://blog.openvoiceos.org/posts/2025-11-06-prewake-vad), and then by dropping nonsensical transcriptions before they reach intent handling, with the [**Transcription Validator Plugin**](https://blog.openvoiceos.org/posts/2025-07-22-ovos-transcription-validator-plugin). Pre-Wake-VAD asks *"is this even speech?"*, the Transcription Validator asks *"does this make sense?"* — and now the speaker verifier adds *"and are **you** allowed to say it?"* Three gates, each catching a different kind of false activation.

---

### Meet the Speaker Verifier

The speaker verifier answers a simple question: *"Do I recognise this voice?"*

Here's the flow:

1. A wake word engine detects an activation (e.g. "Hey Mycroft").
2. The verifier extracts a **speaker embedding** — a fixed-length numeric fingerprint of the voice — from the captured audio, using the [`speakeronnx`](https://github.com/TigreGotico/speakeronnx) embedding library.
3. It compares that embedding against your **enrolled household profiles** using cosine similarity.
4. If the voice matches someone enrolled, the wake goes through. If not, it's **silently dropped** before any intent is processed.

So when Alice and Bob enroll their voices, *their* commands work normally — but the guest's "thousand cheeseburgers" stunt, and the TV's stray wake words, never make it past the gate. Concretely, a rejected activation suppresses `recognizer_loop:record_begin` on the bus — the listener never even starts recording the command.

### Two Wins: Fewer False Activations and Real Control

This delivers two things at once:

- **Fewer false activations.** Random audio from the TV, radio, or a podcast might trip the wake word engine, but it won't match an enrolled voice — so it gets rejected. No more spurious "listening" beeps in the middle of movie night.
- **More control at home.** Only enrolled people can actually issue commands. A visitor can't fire off routines, blast music, place orders, or poke at your smart home just because they know the magic words.

---

### Privacy by Design

Voice recognition and privacy can feel like opposites — but they don't have to be. This plugin was built privacy-first:

- Profiles are stored as **numeric embeddings** in a local JSON file under `~/.local/share/ovos_speaker_verifier/profiles.json`. Each profile is the L2-normalised mean of the embeddings extracted from your enrollment clips.
- **No audio is retained** after the embedding is extracted.
- Embeddings **cannot be reversed** back into audio.
- Everything runs **locally** — no cloud, no account, no audio leaving your device.

Your voiceprint is yours, it stays on your hardware, and it's just a list of numbers.

---

### Getting Started

**1. Install the plugin:**

```bash
pip install ovos-ww-verifier-plugin-speaker
```

**2. Enroll the people in your household** with the `ovos-speaker-enroll` CLI. A few short clips per person (roughly 5–30 seconds of audio total) is enough; more clips make for a more robust profile:

```bash
ovos-speaker-enroll Alice clip1.wav clip2.wav clip3.wav
ovos-speaker-enroll Bob   morning_command.wav evening_command.wav
```

**3. Enable the verifier** in `~/.config/mycroft/mycroft.conf`. The listener loads wake word verifiers from `listener.ww_verifiers`, keyed by the plugin's entry-point name:

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

Restart your OVOS service, and unrecognised voices will be turned away at the door. Installing the plugin is actually enough to switch it on — the listener runs every installed verifier that isn't explicitly disabled. To install it without activating it, set `"enabled": false`.

---

### A Note on Tuning

The `threshold` controls how strict the match must be. It defaults to `0.45`, calibrated for the default `wespeaker-resnet34` model. Lower it for noisier rooms or distant microphones; raise it for a stricter gate.

One important gotcha: **the threshold is model-specific and does not transfer between models.** Cosine-similarity scales differ enormously across architectures — in our tests the same enrolled-vs-guest pair scored ~0.95 / 0.89 on `titanet-small` but ~0.17 / 0.14 on `campplus`. So if you swap `model` for one of the other supported options (`wespeaker-ecapa512`, `campplus`, `eres2net`, `titanet-large`, `redimnet-b2`, and more — all downloaded on first use and cached locally), you'll need to re-tune `threshold`. You can also set `per_profile_thresholds` to be stricter for some people than others.

There are two independent "fail-open" behaviours worth keeping straight. The framework-level one, above, is about *errors*: a crashing verifier never suppresses a wake. The plugin's own `fail_open: true` config is about *enrolment*: with no profiles enrolled yet, the verifier accepts everything, so installing the plugin never accidentally bricks your assistant. Enroll first, then tighten up.

---

### Honest Caveat: A One-Second Window, and Early Days

Two things to be upfront about.

First, on accuracy. The verifier only ever sees the **wake-word audio window** — the "hey mycroft" itself, roughly a second of speech — not the full command that follows. Speaker identity from a clip that short is inherently weaker than identity from a whole sentence, and audio under about half a second can produce unreliable embeddings. In practice this means a clearly, naturally spoken hotword works best; a mumbled or clipped one is where a genuine speaker is most likely to be wrongly turned away. It's a real gate, not a biometric lock.

Second, on ergonomics. Enrolling a voice today means recording a few WAV clips and running the `ovos-speaker-enroll` command-line tool. That's fine if you're comfortable in a terminal, but it's clearly **not the friendly, guided experience** this deserves — no "repeat after me" prompt, no GUI, no managing profiles from your dashboard.

This is a foundational first release. The hard part — the verifier framework in the listener and the speaker-matching engine itself — is solid and well-tested today, driven end-to-end through a real listener in the test suite. The enrolment *experience* is where this feature still has growing to do: spoken enrollment, a proper UI, and easier profile management are all on the roadmap. We'd rather ship the working foundation now and improve the ergonomics in the open than sit on it until everything's perfect.

If you have ideas — or want to help build that nicer enrollment flow — we'd love to hear from you.

---

### Built in the Open, Funded for the Commons

The speaker verifier was developed by [TigreGótico](https://tigregotico.pt) for OpenVoiceOS, and funded through the [NGI0 Commons Fund](https://nlnet.nl/project/OpenVoiceOS) established by [NLnet](https://nlnet.nl) with support from the European Commission's [Next Generation Internet](https://ngi.eu) programme.

This is exactly the kind of work that grant makes possible. As we shared when [**OpenVoiceOS received its NGI Zero Commons Fund grant**](https://blog.openvoiceos.org/posts/2025-10-20-ngi), the funding lets us invest in the unglamorous-but-essential plumbing — privacy, reliability, listener internals — that a community project rarely has the resources to polish. Speaker verification is a textbook example: a privacy-first feature, built in the open, with no commercial incentive to lock it behind a cloud account.

It's a small plugin with a big payoff: your assistant finally knows the difference between *you* and *everyone else who happens to be in the room*.

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
