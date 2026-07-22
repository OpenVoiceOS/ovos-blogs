---
title: "From One Fairy-Tale Skill to a Whole Reading Pipeline"
excerpt: "How a 2018 Mycroft fairytale skill, two false starts, and one offhand comment from Jarbas turned into an 8-provider common-reading pipeline for OVOS."
coverImage: "/assets/blog/from-one-fairytale-skill-to-a-whole-reading-pipeline/cover.png"
date: "2026-07-22T00:00:00.000Z"
author:
  name: "andlo"
  picture: "https://github.com/andlo.png"
ogImage:
  url: "/assets/blog/from-one-fairytale-skill-to-a-whole-reading-pipeline/cover.png"
---

I've been addicted to OVOS since the old days when it was still
Mycroft. Over the years I built a handful of fun skills - things like
an `auto-volume-skill`, a `picroft-google-aiy-voicekit-skill`, later on
an OpenVSCode skill and a web terminal skill, among others - and, in
November 2018,
`fairytalez-skill` - "Mycroft is telling fairytales" - pulling from
fairytalez.com's collection of over 2,000 stories. Jarbas was actually
the one who walked me through scraping the site properly back then -
my first real lesson in it. The skill got genuinely good community
mileage for a first attempt: a fellow community member sent PRs
polishing the dialog phrasing, and the community translated it into ten
languages through translate.mycroft.ai. Users found real bugs - you
couldn't interrupt a story once it started, a curly quote in a story
crashed the client with a Unicode error, people asked for configurable
sources. Ordinary early-skill growing pains.

Mycroft eventually gave way to OVOS, and the skill got ported straight
across as `ovos-skill-fairytalez` - same scope, same content, just made
OVOS-compatible. The old Mycroft-era repo is still up, archived under
the name `ZZZfairytalez-skill`.

Later, wanting both Andersen's and Grimm's tales in one place, I built
a genuinely new skill, `ovos-skill-fairytales` (note the "s", a
different skill from the "z" one before it), with both collections
bundled in. It's up and working today as a standalone skill - but it
doesn't play nicely with the provider/pipeline approach I eventually
landed on. Around the same time, I also tried a single skill that did
roughly what the pipeline plugin does now: one skill trying to
orchestrate reading across several sources by itself.

What actually got me to the pipeline plugin wasn't Jarbas reviewing any
of that code - it was goldyfruit noticing I'd been busy creating new
GitHub repos and commenting that it sounded like I had something fun
going on. Jarbas chimed in on the same thread and mentioned, almost in
passing, that it sounded like it wanted to be a pipeline rather than a
skill - a dedicated stage in the intent pipeline, the same way
Padatious or `ocp_high` are stages, rather than a skill competing for
matches inside `converse()`. That's honestly one of my favorite things
about this community: people who are genuinely excellent at this will
still just show up in a thread to say "that sounds cool" and casually
hand you the right idea.

That became `ovos-common-reading-pipeline-plugin`.

## The problem with "just one more skill"

Every attempt before the pipeline ran into the same wall: teaching one
skill about more sources doesn't scale, and it doesn't compose. What if
someone else wants to add their own favorite fairy tale collection?
What if the collection isn't fairy tales at all, but articles, or
papers, or the daily news? Every new source means either forking my
skill or writing a new one that collides with it on intents - two
skills, each registering their own "tell me a story" intent, each with
no idea the other exists. Say "tell me a story" and you'd get whichever
skill Padatious felt like that day. Not exactly the kind of experience
you want to hand someone.

This is exactly the problem OCP (`ovos-common-play`) already solved for
media playback: instead of every music/podcast/radio skill fighting
over "play" intents, OCP owns the intent and skills just answer "can
you play this?" on the bus. Reading text aloud needed the same split:
one thing owning the conversation, any number of sources just
answering "do you have this?"

## How it actually works

The plugin owns nothing but the conversation. It matches an utterance
like "read me a story from Grimm" or "read me something" using
`padacioso`-trained intents, then broadcasts a plain messagebus request:

```
ovos.common_reading.search
{"phrase": "...", "collection_hint": "grimm", "content_type": "story", ...}
```

Any installed **provider** skill that thinks it can help replies with a
title, a confidence score, and an opaque `content_id`. Highest
confidence wins (and if nobody's very sure, the plugin double-checks
with the user before committing). Once something's chosen, the plugin
asks that one provider for the actual text:

```
ovos.common_reading.fetch_content.<provider_skill_id>
```

...and gets back plain paragraphs to read aloud, sentence by sentence,
with bookmarking and "continue" support. Providers don't know or care
about TTS, pacing, or intents. They just answer two questions: "do you
have this?" and "here's the text."

That's the whole trick, really — the same one OCP already proved works.

## What "provider" turns out to mean, in practice

I expected to build two or three of these and call it done. Instead
each new provider surfaced its own small design problem, and answering
them is honestly the more interesting part of the story:

- **`ovos-skill-andersen-tales`** and **`ovos-skill-grimm-tales`**
  scrape live per-language sources (andersenstories.com,
  grimmstories.com) - 7 and 8 real languages respectively, no
  translation needed because the sources themselves are multilingual.
- **`ovos-skill-andrew-lang-tales`**, **`ovos-skill-bechstein-tales`**,
  and **`ovos-skill-cosquin-tales`** pull from Project Gutenberg -
  English, German, and French respectively - with a **bundled index**
  built once at dev time, so browsing/matching needs no internet at
  all. Each one only speaks its own language and *refuses to load
  entirely* on any other device language, rather than loading fully and
  silently declining every search. Building these taught me more than
  I expected about HTML quirks: drop-cap `<span>` tags splitting the
  first word of a story, pages that don't declare their charset and get
  silently mangled by `requests`, scholarly footnotes that need to be
  excluded from what gets read aloud.
- **`ovos-skill-ovosblog`**, **`ovos-skill-arxiv-papers`**, and
  **`ovos-skill-365tomorrows-stories`** go the opposite direction:
  they machine-translate, because their content (a blog post, a paper
  abstract, a 600-word flash-fiction story) is short enough that
  translation risk is low, unlike a fairy tale's literary prose. They
  disclose the translation to the user before reading it, and simply
  decline to answer at all if no translation plugin is configured -
  never silently falling back to English.

None of that was planned upfront. It fell out of actually building
enough providers to notice the pattern: **some sources should refuse to
load in unsupported languages, others should always load and translate
per-search** - and the right call depends entirely on the content, not
on the plugin.

## The part voice doesn't solve for you: finding the thing

Here's the honest limitation, and it's not one this plugin - or any
plugin - actually fixes. Having 8 providers and hundreds of stories
behind them doesn't help much if you can't find the one you actually
want. On a screen, you browse: a list of titles, a cover image, a
"maybe this one" moment of scanning. With voice, there's none of that.
You either already know the exact title, or you're stuck describing
what you're after and hoping `collection_hint`/`content_type`/fuzzy
title matching guesses right - or you say "surprise me" and take
whatever the provider hands you.

That's a real, structural limitation of voice as an interface, not
something specific to this plugin - the same problem OCP has for media,
the same problem any "read/play me something" system has. More
providers and a bigger library make it *worse* in one sense, not
better: more good stories to miss because you didn't know to ask for
them by name. I don't have a fix for this beyond what's already here
(fuzzy matching, "surprise me", collection hints) - it's just worth
naming honestly as a limitation rather than pretending voice search is
as easy as scrolling a list.

## Where this can go

Right now there are 8 providers covering fairy tales, folklore, a
technical blog, science papers, and daily flash fiction - Andersen,
Grimm, Andrew Lang, Bechstein, Cosquin, the OVOS blog itself, arXiv,
and 365tomorrows. That's already a wider spread than I expected when I
started, and it barely scratches what's out there: Aesop, Japanese
folklore, Norwegian folk tales, and half a dozen other Gutenberg
collections are sitting in the project's issue tracker waiting for
someone (maybe you?) to pick them up. And that's just Gutenberg - any
RSS feed, any scrapeable archive, any API with text in it is a
provider waiting to be written.

If you want to add one, `ovos-skill-common-reading-example` is a
working template covering both patterns (RSS feed, static page
scraping), the bus protocol, caching, and the judgment calls every
provider has to make (translate or not, what a human actually calls
your source out loud, what's worth reading vs. skipping). It's real,
tested code, not pseudocode - copy it, rename the class, and go.

## References

- [ovos-common-reading-pipeline-plugin](https://github.com/andlo/ovos-common-reading-pipeline-plugin)
- [ovos-skill-common-reading-example](https://github.com/andlo/ovos-skill-common-reading-example) (template for new providers)
- [ovos-skill-andersen-tales](https://github.com/andlo/ovos-skill-andersen-tales)
- [ovos-skill-grimm-tales](https://github.com/andlo/ovos-skill-grimm-tales)
- [ovos-skill-andrew-lang-tales](https://github.com/andlo/ovos-skill-andrew-lang-tales)
- [ovos-skill-bechstein-tales](https://github.com/andlo/ovos-skill-bechstein-tales)
- [ovos-skill-cosquin-tales](https://github.com/andlo/ovos-skill-cosquin-tales)
- [ovos-skill-ovosblog](https://github.com/andlo/ovos-skill-ovosblog)
- [ovos-skill-arxiv-papers](https://github.com/andlo/ovos-skill-arxiv-papers)
- [ovos-skill-365tomorrows-stories](https://github.com/andlo/ovos-skill-365tomorrows-stories)

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
