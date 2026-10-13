---
title: "Digging Gold: the ovos-tui-client and the Klondike Mercantile"
excerpt: "There are close to a thousand OVOS-related repos on GitHub. Some of them are gold. Here's how a terminal test bench grew into a store that actually tests what it lists - and why that makes it a good place to go prospecting."
coverImage: "/assets/blog/digging-gold-klondike-mercantile/cover.png"
date: "2026-10-01T10:00:00.000Z"
author:
  name: "andlo"
  picture: "https://github.com/andlo.png"
ogImage:
  url: "/assets/blog/digging-gold-klondike-mercantile/cover.png"
---

Search GitHub for OpenVoiceOS skills and plugins and you'll find a lot.
The Klondike Mercantile crawler has looked at close to a thousand
candidate repos so far and keeps 553 of them: skills, plugins of every
kind, tools and infrastructure. Some of it is polished and maintained.
Some of it was a weekend experiment from 2021. Some of it installs
fine, loads fine, and then never gets to answer a single question,
because another skill grabs every sentence first.

From the outside, all three look the same: a repo with a README and a
`skill.json`. That's the gold rush problem. The river is full of
shiny things, and most of them are pyrite. What you need is someone to
do the assay.

This post is about two pieces that ended up doing exactly that: a
terminal client that tests skills on a real, running OVOS - and a
skill store that took the same idea and runs it on everything it lists.

## Panning by hand: the ovos-tui-client

I wrote about [`ovos-tui-client`](https://github.com/andlo/ovos-tui-client)
[back in July](/posts/2026-07-24-a-terminal-client-for-testing-ovos):
a split-pane terminal UI where you type instead of talk, and watch logs,
the conversation and a plain-English activity feed of what OVOS is
doing. That's still the heart of it. But the part I use most now is
testing.

Most OVOS skills ship **golden utterances**: sentences, each with the
skill and intent that should handle it. The skill's own CI checks those
against the skill alone. The TUI sends the same sentences to **your
real, running OVOS**, with every other skill, fallback and pipeline
plugin present. That's the difference that matters. An isolated test
can't tell you that Wikipedia picks up *"can you tell me the weather"*
before the weather skill does, or that a pipeline plugin gets there
first, or that the skill never loaded at all.

`Ctrl+P` → `Test: Weather - All`, and every sentence is played as if you
typed it, each in its own session, with a verdict:

![A finished test run in ovos-tui-client: three sentences reach the weather skill, one is taken by Wikipedia](/assets/blog/digging-gold-klondike-mercantile/tui-verdicts.png)

*"can you tell me the weather" ends up in Wikipedia, not the weather
skill. Exactly the kind of collision a skill's own CI can't see.*

A failure isn't just a red cross. Because the activity pane is right
there, you see *who* took the sentence and *why*: which pipeline stage
matched, which fallback caught it, which providers answered and with
what confidence. That's the part that helps you actually understand
what OVOS is doing, instead of just knowing that it did the wrong thing.

### Reports that say what they were tested against

A test result is only worth something if you know what produced it.
After a run, the TUI saves a readable `.md` (paste it straight into an
issue) and a `.report.json` in a small, store-agnostic format. The
report carries a manifest: the release channel (stable, testing or
alpha - worked out automatically, also on installs the OVOS installer
didn't make), the installed version of every skill tested, language,
STT and TTS plugins, and each sentence with what handled it. No
hostname, IP or user name, and OVOS's replies are left out unless you
ask for them, since "14 degrees in *your town*" is personal data.

![The shareable report: channel, how it was detected, the core stack and the version of every skill tested](/assets/blog/digging-gold-klondike-mercantile/tui-report.png)

The same thing runs without the UI, for cron or CI:

```bash
ovos-tui --run all
ovos-tui --run ovos-skill-weather.openvoiceos --report -
```

One detail took a while to get right: the golden utterances are taken
from the **tag of the installed version**, not the repo's default
branch. Before that, a skill whose `main` had moved on produced failures
for intents the installed release simply didn't have yet - one skill
alone gave 73 false failures in a single run on stable. A test bench
that cries wolf is worse than none.

### What it found

Running whole installs this way, on a stable box and an alpha box side
by side, turns up real things. A few examples from the last weeks:

- **On stable, padatious drops the closing `}` of any intent line that
  ends in a slot**, so every such intent quietly stops matching. Reported
  as [ovos-padatious-pipeline-plugin#175](https://github.com/OpenVoiceOS/ovos-padatious-pipeline-plugin/issues/175);
  a scan found 14 of my own skills affected.
- **On alpha, newer `ovos-workshop` rejects two slots next to each other**
  (`{value} {unit}`), which broke a converter skill that worked fine on
  stable.
- **"Play white noise" never reached the white-noise skill** - the OCP
  pipeline took it first. Same for six other skills with "play …"
  phrases.

None of these would show up in a skill's own CI. All of them show up the
moment you test against a real install with a realistic set of skills.

## From one pan to the whole river: the Klondike Mercantile

The [Klondike Mercantile](https://andlo.github.io/ovos-klondike-mercantile/)
started as a directory: crawl GitHub for everything OVOS, cross-reference
it with PyPI, GitHub releases, the official OVOS skill store and OVOS
Localize, and present it with honest labels - *Looks Complete*,
*Incomplete*, *Inferred* - and a plain-language "why this assessment?".

That's useful, but it only tells you what a repo *looks* like. The
obvious next step was to take the TUI idea and point it at the store.
So every "Looks Complete" skill is now tested, nightly, against each OVOS
release channel - **stable**, **testing** (what the OVOS installer
gives you) and **alpha** - installed with that channel's own constraint
files from `ovos-releases`:

- **Level 1, installs:** `pip install` under the channel's constraints.
- **Level 2, loads:** booted in MiniCroft in every language it ships.
- **Level 3, routes:** its own golden utterances, sent through a normal
  pipeline. At least 80% of them have to reach the skill.

And then there's the one I'm most happy with:

- **The Klondike test:** the same sentences, but on a *well-equipped*
  install - the installer's default skills, its extra skills, and a
  curated profile of good skills and pipeline plugins (including the
  common-reading pipeline). A skill that still gets its sentences there
  isn't just working; it plays nicely with others.

The result shows up where you look for skills: a label per channel on
every card, plus one quality label - **🎯 Routes** for level 3, and
**⛏ Klondike Gold** for skills that also pass the Klondike test. It's a
pick, not a medal, on purpose: gold is something you dig for. Labels
come from testing first (it's the channel on its way to becoming the
next stable), alpha second, and say which. The "Recommended" sort and
the "works on testing / alpha" filters use them, so the good stuff
floats to the top instead of being buried under abandoned experiments.

![A store card: Unit Converter passes on stable, testing and alpha, and wears the Klondike Gold label](/assets/blog/digging-gold-klondike-mercantile/klondike-card.png)

*That's the converter skill from above - the one that broke on alpha
because of two adjacent slots. Fixed, re-released, and now gold on all
three channels.*

For maintainers there's a shields.io badge per skill and channel for
the README, and a **Request test** button on the detail page. The detail
page also shows exactly what was tested: which versions of ovos-core,
workshop and padatious, which languages, which skills were loaded next
to it, and which tag the golden utterances came from.

![The "Tested on OVOS" section of a detail page: level 3 on testing, routing against the installer's default skills, and the Klondike profile run](/assets/blog/digging-gold-klondike-mercantile/klondike-tested.png)

### What the robots can't test, people can

Some skills can't be tested in a CI runner: they need an API key, a
microphone array, a Mark II. That's where the two pieces meet again.
Run the test with `ovos-tui-client` on your own device, and the report
can be pasted into the skill's detail page on Klondike, where it's
shown as a community confirmation - with the channel, versions and
notes ("OpenWeather API key set", "Raspberry Pi 5 with ReSpeaker") from
the manifest. The TUI client doesn't know Klondike exists; it just
writes a report. Any store could accept the same file.

## So: is there gold in Klondike?

I think so - and more importantly, you can now *see* where it is. Out of
553 entries, 172 are skills, and around 90 of them get tested on every
channel every night. When a card says ⛏ Klondike Gold, it means that
skill installed, loaded, and answered its own sentences on a realistic,
crowded install, on the channel most of you are running. That's a
different promise than "this repo has a nice README."

It also helps the other direction. A skill that fails on stable because
of someone else's pin, or loses its sentences to a greedy pipeline
plugin, is now visible - to its author, and to whoever maintains the
thing doing the grabbing. Several of the bugs above were found this way
and are already fixed.

And I'd like to think it's a small demo of what an official OVOS store
*could* offer: list only what's been tested, test it automatically per
channel, and let the community fill in the rest from real devices.

## What's next

- **Generated utterances.** Many skills don't ship golden files yet.
  I've proposed an `ovoscope generate` command that builds them from a
  skill's `.intent` files ([ovoscope#224](https://github.com/OpenVoiceOS/ovoscope/pull/224)),
  which both the TUI and Klondike could use. Until that's settled
  upstream, generated results won't earn public badges.
- **More eyes on alpha.** The point of all this is to help push
  components from alpha to testing to stable with confidence. The more
  installs that run the tests and share reports, the better that picture
  gets.

If you maintain a skill: go look it up on Klondike, see how it does on
each channel, and grab the badge. If it doesn't route - now you know
where to start digging.

## References

- [Klondike Mercantile](https://andlo.github.io/ovos-klondike-mercantile/) - the store ([source](https://github.com/andlo/ovos-klondike-mercantile))
- [ovos-tui-client](https://github.com/andlo/ovos-tui-client) - and its manual on [testing](https://andlo.github.io/ovos-tui-client/testing/) and [headless runs](https://andlo.github.io/ovos-tui-client/headless/)
- [ovos-releases](https://github.com/OpenVoiceOS/ovos-releases) - the channel constraint files
- [ovoscope](https://github.com/OpenVoiceOS/ovoscope) - golden-utterance testing for skills

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software — it's a mission.

If you believe voice assistants should be open, inclusive, and
user-controlled, there are many ways to help:

- **💸 Donate** — support development, infrastructure, and long-term sustainability
- **📣 Contribute open data** — share voice samples and transcriptions under open licenses
- **🌍 Translate** — help make OpenVoiceOS accessible in every language

We're not building this for profit.

We're building it for people.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
