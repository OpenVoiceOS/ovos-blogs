---
title: "Owning What the Machine Writes"
excerpt: "Six months of coding agents at OpenVoiceOS: what they are good at, where they made a mess, why we kept them, and what we expect from contributors who use them. We have no policy for or against AI-written code. We have a rule: a human directs it, and a human owns it."
coverImage: "/assets/blog/common/cover.png"
date: "2026-09-05T00:00:00.000Z"
author:
  name: JarbasAI
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/common/cover.png"
---

## Owning What the Machine Writes

For about six months, most of the code landing in OpenVoiceOS has not been
typed by me. I review it. I direct it. I curse at it. I barely write it.

Some days I feel like a condom for a coding agent. I am the thin layer between
it and the codebase, and my job is to make sure nothing bad gets through.

Before we say anything to contributors about doing the same, here is what
that has been like.

### What it did to us

It made us absurdly productive. Coding agents are very good at the work an
ecosystem like ours is made of: plugins against a known interface, skills
against a known template, documentation that has to match the code, and code
review against a spec. Those tasks have a clear shape and a checkable result.
The agents do them fast and mostly right.

We had to learn the tools. They are here, and they are not going away.
Pretending otherwise would have meant watching every other project get faster
while we argued.

They also cover the gaps in what we know. A small team cannot speak forty
languages. An agent can read a Galician corpus, an Occitan phonology paper and
a Frisian test suite in one afternoon. Frontend design has always been our
weakest point. The web interfaces we shipped this year were designed with an
agent doing most of the visual work, and they say so on their own About pages.

### Documentation

OVOS is a volunteer project. Nobody is on a payroll. Everyone here has a real
job and does this on the side. In that setting, documentation always loses to
features. Ours lagged the code by up to a year, because no volunteer spends
their evenings rewriting a page that will be stale again next month.

That changed. An agent now updates the affected docs on every pull request,
as part of the change and not after it.

A recurring audit reads the whole
[beta technical manual](https://openvoiceos.github.io/beta-technical-manual/)
against the source on the development branch. If the docs describe a version
that does not exist, that is a bug, and it gets fixed at the source, whichever
side is wrong. The beta manual is the working copy the agents keep in step
with the code. Maintainers sync it into the main manual by hand.

Every step-by-step guide is replayed in a clean environment by an agent
playing a named user who has never seen the project. It reports where a real
person would fall off.

The whole thing runs as a loop. A panel of reviewers with different
backgrounds reads the result cold and tries to break it: a domain expert, an
editor, a programme officer who reads budgets but not code, a self-hoster
with a Raspberry Pi. Their findings go back in.

The manual is longer, more accessible, better-looking and, for the first
time, validated. No human was going to do that here. Either the agents did
it or it did not get done. The one exception is someone paying us to work on
docs instead of features, and that never happens. A word of thanks to NLnet
for letting documentation be a funded part of our grant.

### Quality assurance

QA surprised me most. An agent can launch a full OVOS stack, instrument the
skills, drive utterances through the real pipeline and read the bus traffic
back. Diagnosing a bug and fixing it has never been faster.

Where the work has a running system to check against, the agents are at their
best. Where it does not, on green-field work with no spec and no tests, they
are at their worst. That is where most of the mess below came from.

### Where it went wrong

I was impressed enough to let the agents work autonomously. In HiveMind,
where the codebase is small and the protocol is written down, that went fine.
In OVOS it did not.

The agents do genuinely dumb things at a rate that never drops to zero. When
we relaxed our review gates to move faster, the commit history became a mess.
I got tired of fighting the AI's code style on every pull request. I started
merging as-is and fixing afterwards. That only works because we have a
pre-release channel where every alpha is expected to be rough. On a stable
branch it would be reckless.

Two things I hate. The first is the tone. These models write in a
recognisable register, and it leaks into commit messages, pull request bodies
and documentation unless someone stops it. The second is the history: a
tangle of retries and amendments that no human would produce. Both are
survivable. Every commit names the model that produced it, and every one is
easy to revert. But they are a cost.

Before a stable release the human work grows. Every alpha we merged without a
fight has to be read properly at least once, and that review is much larger
than it used to be. We do it about once a year. It is still worth it: we fix
bugs faster, we ship more, and the test harnesses we built to survive the
agents catch regressions we used to hear about from users.

### What we do about it

We do not hide any of this, and we make it checkable.

Every commit an agent contributed to carries a trailer naming the model that
produced it. Anyone can count them with one API call. Every pull request or
issue an agent opens starts with a header saying so, and saying it was not
human-reviewed. An automated reviewer reads every pull request beside the
human one, and our contribution guide says so.

The web interfaces state it in their own About page.

![The About page of the OVOS control panel: the project attribution, the NGI0 and NLnet funding credit, and the line "Made with the help of AI".](/assets/blog/owning-what-the-machine-writes/about.png)

None of that was imposed on us. It is what taking responsibility for
machine-written code looks like once you have merged enough of it. It also
lines up with the
[policy on generative AI](https://nlnet.nl/foundation/policies/generativeAI/)
that NLnet, who [fund part of this work](https://blog.openvoiceos.org/posts/2025-10-20-ngi),
adopted for their grantees. It asks for two things: say publicly that you use
these tools, and mark provenance on each contribution. The FSFE's
[note on the copyrightability of machine-generated code](https://fsfe.org/news/2026/news-20260825-01.html#recommendation-AI-usage)
ends in the same place: record which system assisted, how much, and what the
human did, in a form a machine can read. A project cannot decide what it
thinks about these tools if it cannot see where they were used.

### What actually works

These practices hold it together. They are the useful part of the story, so
here they are for anyone who wants to try the same.

**Write the spec down, then build against it.** The
[OpenVoiceOS architecture repository](https://github.com/OpenVoiceOS/architecture)
was not created for agents. It exists because a project heading for 1.0
needs a written definition of "compliant": the message envelope, sessions, the
pipeline, intents, every subsystem specified in normative language and
versioned clause by clause. It became the most valuable thing we could hand
an agent. A spec is context that does not drift, and it is the yardstick for
every review. When a reviewer can point at a clause and say "this violates
§6.1", the argument is over.
[ovos-test-harness](https://github.com/OpenVoiceOS/ovos-test-harness) turns
those clauses into scenario tests against the real installed daemon, so
"compliant" is a number and not an opinion.

**Tests as sentences.** For everything that understands language, the test is
the language. Skills carry golden utterances: real phrasings that must
resolve to the right intent, replayed through the shipped pipeline by
[ovoscope](https://github.com/OpenVoiceOS/ovoscope) on every pull request.
Parsers are developed against natural-language cases before any code exists.
An agent can extend a corpus in a language none of us speak. It cannot fake
passing one.

**Every fix proves it was a fix.** A regression test that passes against the
unfixed code proves nothing. Every fix shows the test red before and green
after. Agents will happily write a test that passes for the wrong reason.
This rule catches it every time.

**Review to refute, not to confirm.** Before anything merges, a second pass
tries to break it: trace the code paths, reproduce the claim, report what it
could not break. Negative results are evidence. Most real bugs we caught this
year were found by a review whose only job was to prove the change wrong.

**Gates are not validation.** Green CI is permission to review, not
permission to believe. Before a deliverable counts, someone deploys it and
uses it as a user would: the documented quickstart, verbatim, then a real
round trip, then restart it, cut the network, feed it bad credentials. The
severe bugs live in the recovery paths, and tests rarely go there.

**Small units, real attribution, easy reverts.** One pull request per logical
change. One commit per pull request. The model named on every commit it
touched. A pre-release channel where rough alphas are expected, so a bad
merge costs a revert and not a release.

**Draft means the agent is still working.** A pull request stays in draft
while an agent works on it, and while its CI is red. It leaves draft only when
it is ready for a human to read. So a maintainer can ignore every draft and
every red pull request without missing anything: the ones that need attention
are the ones that have come out of draft, and nothing else.

**Tell the agent how your project works.** An `AGENTS.md` at the root of a
repository, with layout, test commands, conventions and the traps specific to
that codebase, is the cheapest improvement we found. It makes the repository
easier for a person too, because most of those conventions were never written
down before.

### What this means for contributors

Everything above is about our own use of these tools. We choose the agent, we
write the safeguards, we own the result. Contributions are different.

Frankly, we would rather drive our own agents inside our own guardrails than
deal with a stream of AI-generated pull requests from people who did not read
what they submitted. That stream is unavoidable. So here is where we stand.

We are adding `AGENTS.md` across our repositories. It tells a coding agent how
each repository is laid out, how to run the tests, and what the conventions
are. Whatever arrives from a contributor's agent will at least match the
shape of the project. We cannot stop the tools from being used, so we make
them easier to use well.

We will not block pull requests because an AI wrote them. We also will not
pretend we cannot tell. If you submit code you did not read, you will get a
review we did not read either, because our agent wrote it. Talk like a bot,
get answered like a bot.

Here is the rule that matters. It is your name on the pull request, not the
model's. Your reputation is on the line, not the agent's. Saying "the AI did
that" when a reviewer finds a problem is not an excuse. It is an admission
that you did not do your due diligence. A human must direct the agent at
every step and must own its output as if they had typed it. As far as this
project is concerned, they did.

That is not a policy for or against AI-assisted contributions. We do not have
one, and we do not recommend either way. We treat the tools as a fact of the
environment. What we do not want is automated slop: pull requests generated
and submitted without a person reading, understanding and standing behind
them. Those get closed.

The [licensing side](https://blog.openvoiceos.org/posts/2026-08-02-porting-with-machines)
of AI-assisted porting is a post of its own, and it ends without a tidy
answer. This one does not have a tidy answer either. It has a rule, and the
rule is ownership.

---

*This post was drafted with AI assistance and rewritten, reviewed and owned by
its human author, which is exactly the standard it describes.*
