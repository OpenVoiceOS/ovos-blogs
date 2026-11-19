---
title: "Emkay, part 2: Emkay and beyond"
excerpt: "One Emkay in a browser became a small ecosystem: Emkay Home with HiveMind, Home Assistant, a skill store where every skill is tested on a running Emkay, and fixes and new parts that went back to OpenVoiceOS."
coverImage: "/assets/blog/emkay-and-beyond/cover.png"
date: "2026-11-27T20:00:00.000Z"
author:
  name: "andlo"
  picture: "https://github.com/andlo.png"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/emkay-and-beyond/cover.png"
---

*This is part 2 of 3. [Part 1](/posts/2026-11-20-emkay-ovos-in-a-browser)
is about why Emkay runs OVOS in a browser. [Part 3](/posts/2026-12-04-emkay-dev)
is about Emkay Dev.*

Once Emkay worked on my phone, the next question came fast. What about the
house? One Emkay on its own is fine. But a tablet in the kitchen, a phone
by the bed and a PC in the office should feel like one assistant, not
three.

I think of Emkay as an ecosystem more than a distro. It has four parts:

- **Emkay**, OVOS in the browser, on the devices you already have.
- **Emkay Home**, the OpenVoiceOS for the house.
- **The skill store**, with skills that are tested on a running Emkay.
- **Emkay Dev**, for making skills (that is part 3).

## Emkay Home: HiveMind, packed the same way

[Emkay Home](https://github.com/emkay-voice/emkay-home) is OVOS with
[HiveMind](https://github.com/JarbasHiveMind/HiveMind-core) in front,
packed in the same "open the page, tap here and there, done" style as
Emkay. It runs on an old PC, a Raspberry Pi, an LXC container, or as a
Home Assistant app. One install line, and at the end it shows the address
of the machine, the way Home Assistant does.

The Emkays in the house become HiveMind satellites of it. You pair a
device by scanning a QR code. Pairing links are never mailed. Emkay Home
makes its own certificate by default, so nothing in the house depends on a
certificate service on the internet.

On a machine with a GPU, Emkay Home can also do speech to text and text to
speech for the devices. Then a slow phone gets a fast brain.

Emkay Home is optional. Every Emkay runs fine on its own. Home just ties
them together.

## Where should Emkay think?

In Emkay this is one button: "Where should Emkay think?" You choose on the
device, Emkay Home, or Home Assistant's Assist. Emkay keeps its face and
behaves the same way whichever brain it uses. The control panel even opens
the same way on a satellite as on a stand-alone Emkay.

## Home Assistant, the simple way

For Home Assistant there are two parts, and neither of them is only for
Emkay:

- **[ha-ovos-integration](https://github.com/andlo/ha-ovos-integration)**
  shows any OVOS device in Home Assistant. Its control panel settings
  become entities. An automation can then, for example, turn off listening
  at night.
- **[ovos-phal-plugin-ha-link](https://github.com/emkay-voice/ovos-phal-plugin-ha-link)**
  runs on the OVOS device and connects to Home Assistant by itself. That
  means no open ports, and it works behind NAT.

For lights and heating there is
[ovos-assist-pipeline-plugin](https://github.com/emkay-voice/ovos-assist-pipeline-plugin).
It is an intent pipeline plugin that gives what Assist understands to Home
Assistant. It runs before the solvers, so "is the heating on in the
bedroom" goes to Home Assistant and not to Wikipedia.

## Guardian: what left the house?

Privacy is not only about the microphone. Skills fetch weather, news and
answers from the web. So Emkay keeps a network log with
[ovos-network-log](https://github.com/emkay-voice/ovos-network-log). It
records every request OVOS and its skills make: when, where, and who
asked. It never records what was sent.

[ovos-skill-guardian](https://github.com/emkay-voice/ovos-skill-guardian)
reads that log back to you. Ask "what went out today?" and it tells you.
Say "go offline", and nothing leaves the device. Both work on any OVOS,
not only Emkay.

## The skill store

[The Emkay skill store](https://store.emkay.ai) lists 122 skills, with
icons, example phrases, and in all of Emkay's languages. It is fed from
the [OVOS Klondike Mercantile](https://github.com/andlo/ovos-klondike-mercantile)
skill directory.

![store.emkay.ai](/assets/blog/emkay-and-beyond/store.png)

Nobody publishes to the store. A skill gets there because it is well
made. Every night, each skill is installed on a running Emkay and tested
with its own example phrases. Skills without examples, like common query
providers and voices, are tested to load and to make no network calls a
browser refuses. If a skill does not work in Emkay, it is not in the
store.

Tap "Get", and the skill installs on the Emkay in the same browser. From
every skill you can also open its code in Emkay Dev. More about that in
part 3.

## What went back to OVOS

Running OVOS in a place it was not made for finds bugs. I have tried to
send the fixes upstream as PRs, and many are merged. A few examples:

- The Wikipedia plugin asks the API in a way a browser may read, and
  scores pages so the right answer reaches common query.
- A bare "stop" stops what OCP plays.
- Fixes in `ovos-utils`, `ovos-date-parser`, `ovos-workshop`,
  `ovos-localize` and the Padatious pipeline.
- A lot of Danish translations across the skills.
- [ovos-control-panel](https://github.com/OpenVoiceOS/ovos-control-panel)
  got a phone layout, a Danish translation and much more. I maintain it
  for OVOS.

Other parts started for Emkay but are useful for any OVOS. Apart from the
ones above, there is the offline Wikipedia fallback
[ovos-skill-wiki-offline](https://github.com/emkay-voice/ovos-skill-wiki-offline),
a LAN [intercom](https://github.com/emkay-voice/ovos-skill-intercom), the
[routing judge](https://github.com/emkay-voice/ovos-routing-judge) for
golden-utterance tests, and a set of reading providers for the common
reading pipeline. They all use normal OVOS names, each in its own repo.

![Emkay Capsule (a concept render): a 3D-printable shell for a phone, after the 2018 Mark II concept](/assets/blog/emkay-and-beyond/capsule.jpg)

And then there is the fun one. [Emkay Capsule](https://github.com/emkay-voice/emkay-capsule)
is a 3D-printable shell that turns an old Android phone into a small
smart speaker. It is inspired by the round Mark II concept from the 2018
Kickstarter. It is only an idea so far, but I like the circle it closes.

In [part 3](/posts/2026-12-04-emkay-dev) I go back to what got me hooked
on Mycroft in the first place: making skills.
