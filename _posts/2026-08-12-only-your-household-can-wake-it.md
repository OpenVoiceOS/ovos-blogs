---
title: "Only Your Household Can Wake It: Speaker Verification for OVOS"
excerpt: "speakeronnx and ovos-ww-verifier-plugin-speaker add a household enrollment layer on top of any wake word engine. Guests and background voices are silently rejected before any command is processed — locally, no audio retained."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-08-12T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Only Your Household Can Wake It

Wake word engines are trained to recognize a phrase. They are not trained to recognize a person. "Hey Mycroft" from a guest, from a neighbor through a wall, or from a TV in the next room all look the same to the wake word model. The assistant activates regardless.

[`ovos-ww-verifier-plugin-speaker`](https://github.com/OpenVoiceOS/ovos-ww-verifier-plugin-speaker) adds a second gate after the wake word fires: it checks whether the voice that spoke belongs to an enrolled household member. If not, the activation is silently dropped before any intent pipeline runs.

---

## How It Works

OVOS has a **wake word verifier** extension point. After any wake word engine fires, the configured verifier plugin receives the audio segment that triggered it and returns `True` (accept) or `False` (reject). The verifier runs after detection, so it operates only when something has already been flagged — no continuous speaker analysis.

`ovos-ww-verifier-plugin-speaker` uses [`speakeronnx`](https://github.com/TigreGotico/speakeronnx), a pure ONNX-runtime speaker embedding library with no PyTorch dependency. It extracts a fixed-length numeric embedding from the audio, compares it against each enrolled profile using cosine similarity, and accepts if any profile exceeds the configured threshold.

---

## Enrolling Household Members

```bash
pip install ovos-ww-verifier-plugin-speaker

ovos-speaker-enroll Alice clip1.wav clip2.wav clip3.wav
ovos-speaker-enroll Bob morning_command.wav evening_command.wav
```

More clips per person (5–30 s total) produce a more robust profile. Profiles are stored as numeric vectors in `~/.local/share/ovos_speaker_verifier/profiles.json`. No audio is written after enrollment; embeddings cannot be reversed into audio.

---

## Privacy by Design

The verification model runs entirely on-device. The enrolled embedding is a compact vector — it carries no recoverable speech, no transcription, and no biometric identifier beyond "sounds like this person." Audio captured for a wake word trigger is processed in memory and discarded immediately.

This is a deliberately narrow capability: the plugin does not perform continuous diarization, does not build a speaker graph, and does not log who spoke when. It answers only one question, at activation time: "is this one of the people who enrolled this device?"

---

## Connecting to Pre-Wake VAD

The speaker verifier works best alongside the [Pre-Wake VAD](https://blog.openvoiceos.org/posts/2025-11-06-prewake-vad) feature introduced earlier. Pre-Wake VAD filters out non-speech sounds before the wake word engine runs; speaker verification filters out unrecognized voices after it fires. The two stages are complementary:

1. VAD: discard background noise and music before reaching the wake word engine.
2. Wake word: detect the trigger phrase.
3. Speaker verifier: confirm the voice belongs to a household member.

Each stage reduces the false-positive surface without requiring changes to any other component.

---

## Configuration

```json
{
  "listener": {
    "wake_word_enabled": true,
    "wake_word_verifier": "ovos-ww-verifier-plugin-speaker",
    "ovos-ww-verifier-plugin-speaker": {
      "threshold": 0.75
    }
  }
}
```

Lower threshold → more permissive (easier for enrolled users); higher threshold → stricter (better at rejecting non-enrolled voices). Default is 0.75.

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
