---
title: "The Intent Benchmark: 114 Fighters, 12 Languages, Every Row Replayable"
excerpt: "The OVOS Plugin Arena's intent leagues score every intent pipeline plugin on one 50-intent dataset in 12 languages. Each prediction row is published on Hugging Face with its dataset revision and plugin version, and a public ladder is seeded from the result."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-09-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## The Intent Benchmark

Intent matching decides which skill answers you. OVOS has more than a dozen engines that can do it, from Adapt keyword rules to embedding classifiers, and until this benchmark existed the only way to compare them was to install a few and guess. The intent leagues of the [OVOS Plugin Arena](https://openvoiceos.github.io/ovos-plugin-arena/) replace the guess with a measurement anyone can rerun.

This post is for people who choose or build intent pipeline plugins. If you talk to an assistant and never open `mycroft.conf`, the takeaway is that the plugins in a default install are measured against each other in public.

## One dataset, four leagues

Every intent fighter runs over [`intents-for-eval`](https://huggingface.co/datasets/OpenVoiceOS/intents-for-eval): 50 intents, between 1,354 and 1,384 test rows per language, 12 languages (ca-ES, da-DK, de-DE, en-US, es-ES, eu-ES, fr-FR, gl-ES, it-IT, nl-NL, pt-BR, pt-PT), slot annotations, Apache-2.0. The rows sit in buckets: templates, in-distribution phrasings, paraphrases, far out-of-domain requests, ASR noise and typos. A row whose reference intent is `null` is out of scope, and the correct answer to it is no intent at all.

Fighters are grouped by what they are allowed to learn from:

| League | Allowed input | Registered fighters |
|---|---|---|
| `intent_zero_shot` | nothing but the templates a skill registers, as they arrive | 1 |
| `intent_online` | a training pass over those templates at boot | 86 |
| `intent_offline` | a pretrained artefact that never sees the device's templates | 22 |
| `intent_keyword` | Adapt-style required and optional vocabulary rules | 5 |

A fighter is a JSON file in `registry/competitors/`, and its `config` field is a `mycroft.conf` fragment: a real `intents.pipeline` list plus per-plugin settings. When a fighter scores well, its configuration is something you paste into your own device.

## What a prediction row carries

The benchmark scripts publish one JSONL file per fighter per language to [`OpenVoiceOS/ovos-intent-bench-intents-for-eval`](https://huggingface.co/datasets/OpenVoiceOS/ovos-intent-bench-intents-for-eval): 204 files across the 12 languages, 17 fighters in en-US. Every row records the utterance, the reference intent and slots, the prediction and the pipeline stage that produced it. It also records the exact plugin versions, the dataset revision, the runner version, latency and peak memory. Nothing in a row depends on the machine that read it, so any number on the board can be recomputed from the files.

This is the whole of the check, in a fresh environment with only `huggingface_hub` installed:

```python
import json
from huggingface_hub import hf_hub_download

repo = "OpenVoiceOS/ovos-intent-bench-intents-for-eval"
for name in ("ovos-stock", "m2v-prototype", "kw-slot-palavreado", "trident"):
    path = hf_hub_download(repo, f"predictions/en-US/{name}.jsonl", repo_type="dataset")
    rows = [json.loads(l) for l in open(path)]
    acc = sum(r["prediction"] == r["reference_intent"] for r in rows) / len(rows)
    ood = [r for r in rows if r["reference_intent"] is None]
    fpr = sum(r["prediction"] is not None for r in ood) / len(ood)
    print(f"{name:20} rows={len(rows)} accuracy={acc:.3f} ood_false_positive_rate={fpr:.3f}")
```

```
ovos-stock           rows=1381 accuracy=0.291 ood_false_positive_rate=0.041
m2v-prototype        rows=1381 accuracy=0.748 ood_false_positive_rate=0.796
kw-slot-palavreado   rows=1381 accuracy=0.247 ood_false_positive_rate=0.020
trident              rows=1381 accuracy=0.778 ood_false_positive_rate=0.429
```

Read the two columns together. `ovos-stock`, the Padatious plus Adapt pipeline a default install runs, answers 29 percent of the rows correctly and stays quiet on 96 percent of the out-of-scope ones. `m2v-prototype`, the zero-shot embedding matcher, answers 75 percent correctly and fires on 80 percent of the requests it should have rejected. Accuracy alone would call the second one better; the false-positive column says it will answer questions nobody asked. That is what the far-out-of-domain bucket is in the dataset for.

## From rows to a board

The `assemble` workflow turns the rows into two things. The benchmark board sorts fighters by the league's primary metric. Accuracy, macro-F1, out-of-scope false-positive rate and slot exact match are all computed and shown. The ladder is a Bradley-Terry fit with bootstrap confidence intervals. It is seeded from auto-battles derived from the rows: one battle per sample where exactly one fighter was right, at a quarter of a human vote's weight. Blind A/B votes cast as GitHub issues refine it. A fighter needs at least 30 scored rows on a language before it seeds anything.

The en-US intent board as published lists 85 entries and is marked provisional: it carries millions of auto-votes and one human vote. The ladder reflects the benchmark rather than human preference, and the board says so in its own metadata.

## Reproduce a row

```bash
git clone https://github.com/OpenVoiceOS/ovos-plugin-arena
cd ovos-plugin-arena
uv venv .venv
uv pip install --python .venv/bin/python --prerelease=allow -e ".[hf,audio]"
uv pip install --python .venv/bin/python --prerelease=allow ovos-padatious ovos-adapt-parser
.venv/bin/python benchmarks/intent_intents_for_eval.py --langs en-US --competitors ovos-stock --max-samples 20
```

The arena is a repository, not a PyPI package, so the checkout is the install; a fighter's plugins are installed beside it, and the two packages above provide the Padatious and Adapt pipeline plugins that `ovos-stock` runs.

The full en-US run over all fighters takes about 15 minutes on a CPU. `docs/reproduce-a-row.md` in the repository walks through matching one published row against a local run, revision for revision.

## Limits

Ensembles dominate the top of the ladder: `trident`, `tmpl-slot-jurebes` and `cascade-soft` combine two or three plugins, so a high rank names a configuration, not a single engine. The `massive-templates` companion dataset, 52 languages of templates, has a benchmark script and no published prediction rows. Numbers move as plugins release. Quote the row's `plugin_version` and `dataset_revision`, not the board's rank, when you cite one. Slot exact match is computed only where the dataset annotates slots.

Wrong rows, missing fighters and dataset problems go to the [arena issue tracker](https://github.com/OpenVoiceOS/ovos-plugin-arena/issues).

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
