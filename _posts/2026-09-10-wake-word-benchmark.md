---
title: "The Wake-Word League: 59 Fighters on 27 Boards"
excerpt: "The OVOS Plugin Arena runs every wake-word plugin, as the listener stacks it, over labelled clips and publishes the detection rows. It is a measurement pipeline that keeps filling in, not a settled ranking."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-09-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## The Wake-Word League

Wake-word engines are compared by anecdote more than any other part of a voice assistant: this one "never fires", that one "wakes on the television". The wake-word league of the [OVOS Plugin Arena](https://openvoiceos.github.io/ovos-plugin-arena/) replaces the anecdote with a per-clip measurement of the real plugins, published row by row. This post is for people who choose a wake-word engine or train one. It describes a pipeline that is running, and it makes no claim about which engine is best.

## What is measured

Each fighter is a real OVOS `HotWordEngine` configured the way the listener would stack it. The bench streams one labelled clip through it, 80 ms at a time, wrapped in leading and trailing silence so streaming buffers warm as a live microphone would. It records the engine's binary decision and its latency. A clip is a positive (the phrase is present) or a negative drawn from a shared not-wake-word pool: other speech, ESC-50 environmental sounds, FMA music, ambient noise and public-domain recordings.

Per dataset and language the arena scores `error_rate` (wrong decisions over scored clips, the primary metric), `accuracy`, `false_accept_rate`, `false_reject_rate` and `latency_ms_median`. A fighter is never scored on the corpus it was trained on. The registry's `trained_on` field excludes the pair, so the community Precise models sit out their own recordings.

## Fighters and boards

The registry holds 59 wake-word fighters: Precise ONNX, openWakeWord, microWakeWord, Vosk, WakeForge, wakewordlab and a server-backed detector, several of them in stacked variants with a Silero VAD verifier, the speaker verifier, or a different threshold. Detection rows are published to Hugging Face per dataset, for example [`OpenVoiceOS/ovos-wake-word-bench-synthetic-wakewords-hey_mycroft`](https://huggingface.co/datasets/OpenVoiceOS/ovos-wake-word-bench-synthetic-wakewords-hey_mycroft) with 52 prediction files, beside `hey_jarvis` and `community-computer` sets.

The published boards can be counted from the site's own data files:

```python
import json, urllib.request
base = "https://openvoiceos.github.io/ovos-plugin-arena/data/"
boards = [...]  # every benchmark-wake_word-*.json the site serves
total = ranked = 0
for b in boards:
    d = json.load(urllib.request.urlopen(base + b))
    for e in d["entries"]:
        total += 1
        ranked += not e.get("unranked")
print("boards", len(boards), "entries", total, "ranked", ranked)
```

```
boards 27 entries 1036 ranked 456
```

Twenty-seven boards cover ten community phrases, six Picovoice benchmark phrases, ten synthetic phrases and a "sam" set, in English and one in Spanish (`ey ordenador`). Of the 1,036 board entries, 456 clear the 30-scored-clip floor a board needs before it ranks a fighter or seeds a battle; the other 580 show as unranked, most of them on the synthetic phrases, where the published sweeps hold 10 clips per fighter. A ranked row looks like this, from the `amelia` community board: `vosk-ww-amelia`, 40 clips, error rate 0.6, false-reject rate 0.6, median latency 76 ms.

## Reading it honestly

Those numbers describe the pipeline, not a verdict. Most boards carry 40 entries because the same fighters run everywhere. A fighter for one phrase running on another phrase's clips is expected to reject everything, so its row measures false accepts, not usefulness. The synthetic positives are TTS voices, easier than a family at breakfast. Human blind votes on wake-word battles are few, so the ladder is benchmark-seeded. What the league gives you is the prediction rows. They say which clip each engine got wrong, at which latency, under which version.

## Reproduce a row

```bash
git clone https://github.com/OpenVoiceOS/ovos-plugin-arena
cd ovos-plugin-arena
uv venv .venv
uv pip install --python .venv/bin/python --prerelease=allow -e ".[hf,audio]" ovos-ww-plugin-openwakeword
.venv/bin/python benchmarks/ww_hey_mycroft.py --competitors openwakeword-hey-mycroft --max-samples 50
```

`docs/reproduce-a-row.md` explains matching a local run against a published row, revision for revision.

## Limits

Boards fill as sweeps land, so counts change. Quote a row's `plugin_versions` and dataset revision when you cite one. Only English and one Spanish phrase have boards. The clips are 16 kHz mono and say nothing about far-field microphones or echo. Wrong rows and missing fighters go to the [arena issue tracker](https://github.com/OpenVoiceOS/ovos-plugin-arena/issues).

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
