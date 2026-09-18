---
title: "What Is in the OVOS Intent Corpus v6"
excerpt: "The corpus the OVOS intent classifier trains on holds 2.2 million rows over 52 locales. Two locales are more than half of it, 37 locales share 3 percent, and 54 of 257 labels have under 50 rows. This post gives the numbers and a script that reproduces one table from the public tag."
coverImage: "/assets/blog/intent-corpus-v6/thumb.png"
date: "2026-09-18T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/intent-corpus-v6/thumb.png"
---

## What Is in the OVOS Intent Corpus v6

[OpenVoiceOS/ovos-intents-v5-templates](https://huggingface.co/datasets/OpenVoiceOS/ovos-intents-v5-templates)
at tag `v6` is the corpus the OVOS intent classifier trains on. Each row is one
utterance and the intent label it belongs to, built from the locale resource
files of the skills themselves. The repository name says v5; the content
version is the tag.

## Why a user cares

The classifier can only learn what the corpus holds. A language with four rows
in the corpus is not a language the model has learned. It is a language the
corpus mentions. Before we ask why a locale gets an intent wrong, we count what
the model saw of that locale. The counts below come from one pass over the tag,
streamed over the Hub API and never stored.

## The numbers

54 locale directories in, 2,206,359 rows out: 2,204,939 train rows and 1,420
gold test rows, over 45 skill ids and 257 labels. Sixteen rows in two stale
directories (`arb`, `es-419`) carry no label and count for nothing.

**Locales.** `en-US` is 37.62 percent of the corpus and `ca-ES` is 13.21
percent, so two locales are more than half of everything. 37 of the 52 locales
with rows hold under 1 percent each, and together they hold 67,622 rows, 3.06
percent of the corpus. The thinnest eight hold 2 to 4 rows apiece: `ar-XX`,
`cmn-CN`, `is-IS`, `nn-NO`, `zsm-MY`, `ms-MY`, `uk-UA`, `vi-VN`. The Gini
coefficient across locales is 0.84. Gold test rows exist for 19 locales only,
and 977 of the 1,420 are English.

**Skills.** Five skills hold 1.87 million of the 2.2 million rows: date-time
684,489, pokepedia 456,953, wallpapers 305,159, alerts 230,943, mark1-ctrl
194,999. The starved skills are the conversational ones: meal-plan 97 rows,
randomness 126, ddg 172, wordnet 186.

**Labels.** 54 of the 257 labels have under 50 rows in the whole corpus. The
largest label, `ovos-skill-date-time.openvoiceos:what_time_will_it_be`, holds
506,267 rows. A label under 50 rows is one the classifier has almost no chance
to separate from its neighbours.

## Reproduce the locale table

The script needs Python 3 and nothing else. It walks the tag over the Hub
API, streams each `.jsonl` file, counts rows with a label, and prints rows per
locale. It ran in 70 seconds on one CPU box.

```python
"""Rows per locale in the OVOS intent corpus, read from the tag and never stored."""
import collections
import gzip
import io
import json
import urllib.request

REPO = "OpenVoiceOS/ovos-intents-v5-templates"
REV = "v6"
API = f"https://huggingface.co/api/datasets/{REPO}/tree/{REV}"
RESOLVE = f"https://huggingface.co/datasets/{REPO}/resolve/{REV}"


def tree(path=""):
    return json.load(urllib.request.urlopen(f"{API}/{path}".rstrip("/"), timeout=60))


def rows(path):
    request = urllib.request.Request(f"{RESOLVE}/{path}", headers={"Accept-Encoding": "gzip"})
    with urllib.request.urlopen(request, timeout=600) as response:
        raw = gzip.GzipFile(fileobj=response) if response.headers.get("Content-Encoding") == "gzip" else response
        for line in io.TextIOWrapper(raw, encoding="utf-8"):
            if line.strip():
                yield json.loads(line)


by_locale = collections.Counter()
skipped = 0
for locale in (x["path"] for x in tree() if x["type"] == "directory"):
    for entry in tree(locale):
        if entry["path"].endswith(".jsonl"):
            for row in rows(entry["path"]):
                if "label" in row:
                    by_locale[locale] += 1
                else:
                    skipped += 1

total = sum(by_locale.values())
print(f"{len(by_locale)} locales with labelled rows, {total} rows, {skipped} rows without a label skipped")
print(f"{'locale':8} {'rows':>8} {'share':>7}")
for locale, n in by_locale.most_common():
    print(f"{locale:8} {n:8} {100 * n / total:6.2f}%")
```

The first lines of its output, and the last five:

```text
52 locales with labelled rows, 2206359 rows, 16 rows without a label skipped
locale       rows   share
en-US      830044  37.62%
ca-ES      291559  13.21%
fr-FR      166913   7.57%
gl-ES      107515   4.87%
pt-BR       97902   4.44%
de-DE       95383   4.32%
nl-NL       85609   3.88%
es-ES       84392   3.82%
sv-SE       80652   3.66%
pt-PT       67816   3.07%
...
ar-XX           2   0.00%
cmn-CN          2   0.00%
is-IS           2   0.00%
nn-NO           2   0.00%
zsm-MY          2   0.00%
```

The per-skill and per-label counts above are the same loop with two more
counters: the skill id is the part of `label` before the colon.

## Where a contributor helps most

The thin locales are a translation problem, not a build problem. The corpus is
built from the skill resource files, so a locale grows when the skills gain
that locale. The 37 locales under 1 percent, and the 28 with under 50 rows,
are where one afternoon of translation changes what the model can learn.

Translations go in through [ovos-localize](https://openvoiceos.github.io/ovos-localize/).
Pick your languages, edit the intent and dialog files in the browser beside
the English source and the skill code that uses them, and submit. A GitHub
Action bot turns the submission into a pull request on the skill repository.

## Limits

- The corpus is a candidate. No accuracy claim about a model trained on it is
  supported until the golden evaluation report exists.
- The counts above join train and gold rows. A count over train rows only
  reads 235 labels over 44 skills and 32 labels under 50 rows.
- Two skill ids for one skill, `ovos-skill-easter-eggs.openvoiceos` (1,111
  train rows) and `skill-easter-eggs.openvoiceos` (53 gold rows), are a
  builder defect, and 17 of the 54 thin labels are that split. The fix,
  [ovos-m2v-pipeline#207](https://github.com/OpenVoiceOS/ovos-m2v-pipeline/pull/207),
  is merged and takes effect at the next tag.
- Typed slots such as `{number:offset}` are absent from the corpus. The
  builder does not render them yet.

## Where to report issues

Corpus and builder problems go to
[ovos-m2v-pipeline issues](https://github.com/OpenVoiceOS/ovos-m2v-pipeline/issues).
A missing or wrong translation goes to the skill repository, through
ovos-localize.

This work is part of the OpenVoiceOS **From Beta to Breakthrough** milestone, funded through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of [DG Communications Networks, Content and Technology](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en) under grant agreement No [101135429](https://cordis.europa.eu/project/id/101135429). Additional funding is made available by the [Swiss State Secretariat for Education, Research and Innovation](https://www.sbfi.admin.ch/sbfi/en/home.html) (SERI).

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
