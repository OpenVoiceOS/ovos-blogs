---
title: "The Plugin Arena: Blind Battles, ELO Rankings, and Votes as GitHub Issues"
excerpt: "ovos-plugin-arena is a GitHub-native benchmark for STT, TTS, wake word, and intent plugins. Predictions live on HuggingFace, votes are GitHub Issues, and the leaderboard rebuilds itself every hour with no server to run."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-08-26T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## The Plugin Arena

"Which STT plugin should I use?" is one of the most common questions in the OVOS community, and for a long time the honest answer was "try a few and see." A real comparison needs hardware, audio corpora, labelled datasets, and hours of computation that most users do not have on hand. So people guessed, or copied whatever the last person recommended.

[`ovos-plugin-arena`](https://github.com/OpenVoiceOS/ovos-plugin-arena) replaces the guessing with data. It is a blind A/B evaluation platform for OVOS plugins — STT, TTS, wake word, and intent — built entirely on GitHub and HuggingFace, with no server infrastructure behind the canonical instance. The repository *is* the arena: fighters, datasets, benchmarks, votes, and leaderboards are all files and issues in the repo.

The leaderboard is live right now: **[openvoiceos.github.io/ovos-plugin-arena](https://openvoiceos.github.io/ovos-plugin-arena/)**.

---

## Fighters are shippable configs

Every competitor — a "fighter" — is a JSON file in `registry/competitors/`, and its `config` field is a valid `mycroft.conf` fragment: an `intents` section with a real `pipeline` plus per-plugin config blocks. That is the important part. You are not benchmarking an abstract "plugin"; you are benchmarking a concrete, copy-pasteable configuration. When a fighter wins, its config is something you can drop straight into your own deployment.

The arena is organised into leagues, one per capability:

| League | Benchmark | Ranking signal |
|---|---|---|
| `intent`, `intent_keyword`, `intent_template` | `benchmarks/intent_*.py` over `intents-for-eval` (12 langs) and `massive-templates` (52 langs) | accuracy / macro-F1 / OOD false-positive rate / slot exact-match |
| `stt` | `benchmarks/stt_minds14.py` over MInDS-14 | word error rate |
| `wake_word` | `benchmarks/ww_hey_mycroft.py` over ww-bench | detection error / false-accept / false-reject |
| `tts` | `benchmarks/tts_intents_prompts.py` | human votes only |

Each benchmark is a single reproducible Python script that trains or configures each fighter, runs it over a test split, and writes prediction rows. Crucially, the numbers are not AI-generated: every prediction row comes from actually running the real OVOS plugins over the published datasets, and every row records the pinned dataset revision it came from, so any run can be reproduced from scratch.

## Predictions on HuggingFace

The benchmark scripts publish their outputs to HuggingFace datasets, one repo per modality. The arena reads those pre-computed predictions rather than running plugins live. That single design choice is what makes the whole thing serverless: assembling battles and rebuilding boards never needs a GPU, never needs the plugins installed, and works on a static host. It also keeps everything reproducible — the predictions are public artifacts anyone can inspect or replay.

## Battles

A daily `assemble.yml` Action reads the HuggingFace prediction datasets and builds the battle pools. Each battle pairs two fighters' outputs on the *same* input and will be shown to a voter anonymously — a true blind comparison, where you judge the result without knowing which plugin produced it.

Battle ids are content hashes of the pairing, which has a nice property: re-running `assemble` produces the same ids for the same pairings, so a daily refresh never invalidates votes that are already open. The pools grow without throwing away accumulated signal.

## Votes as GitHub Issues

Voting needs no arena account and no backend. When a voter picks A / B / Tie / Both wrong in the web UI, their browser opens a prefilled GitHub issue:

```
https://github.com/OpenVoiceOS/ovos-plugin-arena/issues/new
  ?template=vote.yml&labels=vote&title=vote|<battle_id>|<choice>
```

Submitting the issue **is** the vote. The title is machine-parsed in the format `vote|<battle_id>|<choice>`, and the issue template tells voters plainly: submit as-is, do not edit the title. An optional comment field lets a voter explain *why* — for instance, why both candidates were wrong.

A scheduled Action, `tally.yml`, runs hourly. It reads every `vote`-labelled issue, deduplicates so it is one vote per user per battle, replays ELO deterministically from the ordered issue history, commits the updated `leaderboard-*.json` files, and closes the processed vote issues. Because the tally commit lands with `[skip ci]`, GitHub Pages redeploys on the Action's completion rather than on the push, and the refreshed leaderboard is live shortly after.

The vote log, then, is simply the GitHub issue history: public, auditable, and replayable from scratch at any time. There is no hidden database of votes to trust — there is only the issue tracker.

## ELO Rankings

Every fighter enters at a baseline ELO of **1200**. From there, results move both participants' ratings using standard ELO math (K-factor 32, dropping to 16 once a fighter has fought enough battles to stabilise).

A brand-new arena would otherwise start cold, so the board can be *seeded* from the objective benchmark scores. Before any human vote exists, the arena derives deterministic auto-battles from the benchmark metrics — one auto-battle per sample where exactly one fighter got it right — and applies them at a reduced (quarter) K-factor. Human votes then move ratings at full weight on top of that seed. The result is a board that already reflects measured quality on day one, which human blind votes refine over time. The `tts` league is the exception: with no objective metric, it runs on human votes alone.

Because battles are blind and always between exactly two options, the vote dynamics are not skewed by which plugin is more famous or more familiar — only by which output a listener actually preferred.

## Fork Your Own Arena

The entire system is designed to be forked. A language community, a hardware vendor, or an organisation with its own plugin roster can stand up a private leaderboard without provisioning anything:

1. Fork the repository on GitHub.
2. In Settings → Pages, set Source to "GitHub Actions".
3. Set the repo variables `ASTRO_SITE`, `ASTRO_BASE`, and `HF_PREDICTIONS` in Settings → Variables — the last one points the arena at your own HuggingFace prediction datasets.
4. Run `assemble.yml` to build the initial battle pools (it also runs daily).
5. Voters open issues; `tally.yml` runs hourly and keeps the boards current.

No servers, no databases, no accounts. Pages activates once the repo is public — GitHub Pages on free plans requires it — and from then on the arena maintains itself.

## Zero Infra, Real Signal

The pattern here is the point. Where a conventional approach would reach for a web server, a database, and an authentication layer, the arena leans on platform-native primitives instead: static prediction files on HuggingFace, JSON leaderboards in git, votes as issues, tallying and deployment as scheduled Actions. The same job gets done, auditably and reproducibly, at zero marginal cost — and anyone can fork the whole thing.

That turns plugin comparison from a one-off benchmark that goes stale into a community-owned resource that keeps improving every time someone casts a vote.

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
