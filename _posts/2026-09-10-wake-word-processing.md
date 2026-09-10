---
title: "Before and After the Wake Word: Pre-Wake VAD and Verifier Plugins"
excerpt: "ovos-dinkum-listener wraps the wake-word engine in two stages. Pre-wake voice-activity detection keeps the engine idle until someone speaks, and a verifier chain can reject a detection before the assistant starts recording."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-09-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Before and After the Wake Word

A wake-word engine answers one question: was the phrase in this audio? Everything around that question belongs to the listener, [`ovos-dinkum-listener`](https://github.com/OpenVoiceOS/ovos-dinkum-listener), and two stages of it are configurable. Before the engine runs, voice-activity detection (VAD) decides whether anyone is speaking at all. After the engine fires, a chain of verifier plugins can look at the same audio and veto the detection. Together they cut false activations from the two directions they come from: noise that never was speech, and speech that was not meant for the assistant.

This post is for people who configure a listener. The speaker verifier, one plugin in the second stage, has its own post.

## Stage one: pre-wake VAD

With `vad_pre_wake_enabled` set, the listener's voice loop enters a `PRE_WAKE_VAD` state instead of feeding every frame to the wake-word engine. The configured VAD plugin (Silero is the recommended one) watches the microphone, and only when it reports speech does the engine see audio. Music, a vacuum cleaner or a door slam never reach the wake-word model, so they cannot trigger it, and the engine spends no CPU on them.

```json
{
  "listener": {
    "vad_pre_wake_enabled": true,
    "VAD": {
      "module": "ovos-vad-plugin-silero",
      "ovos-vad-plugin-silero": {"threshold": 0.2}
    }
  }
}
```

The flag defaults to `false`, so an existing configuration behaves as before until it is turned on. The change landed in ovos-dinkum-listener PR #189.

## Stage two: the verifier chain

After the engine fires, the listener hands the captured wake-word audio to every installed verifier plugin. A verifier implements one method, `verify(chunk) -> bool`, from the `HotWordVerifier` template in `ovos-plugin-manager` (PR #341), and registers under the `opm.wake_word.verifier` entry-point group. The listener discovers installed verifiers on its own (PR #191); configuration is only needed to change a threshold or switch one off.

```json
{
  "listener": {
    "ww_verifiers": {
      "ovos-ww-verifier-speaker": {"threshold": 0.45},
      "ovos-ww-verifier-silero": {"enabled": false}
    }
  }
}
```

The chain's rule is strict and fail-open. Any verifier that returns `False` discards the detection, and `recognizer_loop:record_begin` never fires. A verifier that raises is logged and skipped, so a broken plugin never locks the microphone. This is the chain from `ovos-dinkum-listener` 0.9.1a1 driven with three stub verifiers in a fresh environment:

```python
from ovos_dinkum_listener.voice_loop.hotwords import HotwordContainer
from ovos_plugin_manager.templates.hotwords import HotWordVerifier

class Accept(HotWordVerifier):
    def verify(self, chunk): return True
class Reject(HotWordVerifier):
    def verify(self, chunk): return False
class Broken(HotWordVerifier):
    def verify(self, chunk): raise RuntimeError("boom")

hc = HotwordContainer.__new__(HotwordContainer)
for label, chain in (("no verifiers", []), ("accept", [Accept()]),
                     ("accept + reject", [Accept(), Reject()]),
                     ("broken only", [Broken()]), ("broken + reject", [Broken(), Reject()])):
    hc.verifiers = chain
    print(f"{label:16} -> {hc.verify(b'\x00' * 32000)}")
```

```
no verifiers     -> True
accept           -> True
accept + reject  -> False
broken only      -> True
broken + reject  -> False
```

The first verifier built on the hook is [`ovos-ww-verifier-plugin-speaker`](https://github.com/OpenVoiceOS/ovos-ww-verifier-plugin-speaker), which compares the voice against enrolled household profiles (PyPI 0.0.2a4, prerelease). The listener's README also names `ovos-ww-verifier-silero`, a VAD check after the fact; no package or repository of that name exists under OpenVoiceOS, so treat that example as the shape of the configuration rather than a plugin to install. Running a Silero verifier and pre-wake VAD together would apply the same model twice, which is why the README says to pick one.

## What this replaces

Before these stages, every false activation had one remedy: a stricter engine threshold, which also made the assistant miss real wake words. Pre-wake VAD and verifiers take the two kinds of false activation out of the engine's hands. The engine can stay sensitive, VAD removes the non-speech, and a verifier removes the speech that was not for the device.

## Limits

Pre-wake VAD adds the VAD model's latency in front of every activation and depends on the VAD plugin's own accuracy. A verifier only sees the wake-word window, about a second of audio. Neither stage runs unless configured or installed, and the listener needs a restart to pick up a newly installed verifier. Bugs go to the [listener's issue tracker](https://github.com/OpenVoiceOS/ovos-dinkum-listener/issues).

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
