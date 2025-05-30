---
title: "OVOS and Mycroft: A Fork That Wasn't Meant to Be"
excerpt: "How OpenVoiceOS emerged not as a rebellious fork but as a necessary continuation of the Mycroft project, driven by the core community to create a truly open voice assistant."
coverImage: "/assets/blog/common/cover.png"
date: "2025-05-20T00:00:00.000Z"
author:
  name: Peter Steenbergen
  picture: "https://avatars.githubusercontent.com/u/641281"
ogImage:
  url: "/assets/blog/common/cover.png"
---

You're probably familiar with what happened between OpenOffice and LibreOffice. 

Once upon a time, OpenOffice was the open-source office suite. But after Oracle acquired Sun Microsystems (and with it, OpenOffice), the community grew uneasy. Development stagnated, trust eroded, and eventually the project was handed off to the Apache Foundation. By then, most of the core contributors had already left and started something new: LibreOffice, a true community-led fork with a renewed focus on transparency, independence, and rapid improvement. 

But OpenOffice never really died. It just stopped moving. For over a decade, it's existed in a kind of zombie state—still present in Linux package managers, still confusing users, but stuck at what is essentially LibreOffice 4.1, frozen in time circa 2013. 

This ghost of a project, abandoned but not buried, continues to haunt the free software world. 

Now let's talk about Mycroft and OpenVoiceOS (OVOS). You might assume it followed the same pattern: a promising open-source assistant slowly losing steam, then replaced by a fork. But that's not quite what happened—and more importantly, we didn't fall into the same trap. 

In fact, we nearly did. The parallels are striking. But the outcome was different.

## Fork vs. Fragmentation 

The OpenOffice/LibreOffice split happened early enough that LibreOffice could carry the torch—but not without baggage. OpenOffice stuck around, unmaintained but still visible, creating years of fragmentation and user confusion. 

Mycroft, on the other hand, was never formally abandoned. The company kept control of the name, infrastructure, and cloud services. But over time, the development slowed, the community was sidelined, and contributions that might've helped sustain it were rejected. 

Meanwhile, a growing group of experienced Mycroft implementers were building tools, fixes, and improvements on their own—quietly preparing for the inevitable. When Mycroft finally collapsed in 2023, there was already a fully functional continuation waiting in the wings: OpenVoiceOS.

## The Cloud Dependency That Wasn't Meant to Last 

LibreOffice could fork and go—because OpenOffice was local-first and fully open. Mycroft? Not so much. 

Despite claiming to be an open-source voice assistant, critical pieces of Mycroft's architecture were tied to proprietary cloud infrastructure—from the Selene backend to STT and TTS services. The project was open in code, but not in practice. 

When the company refused community patches that would enable local-first or self-hosted alternatives, it left only one path forward: rebuild the stack independently. 

That's exactly what the community did. OVOS gradually replaced every closed or brittle part of the system transforming Mycroft into something truly modular and self-sustaining.

## OVOS Was Built by the Core Community 

OpenVoiceOS didn't appear overnight. It grew organically from the work of developers who had been using Mycroft in the real world: integrating it into smart homes, hacking around limitations, maintaining plugins, and submitting fixes. 

These weren't just fans. These were the people already doing the work. 

So when the Mycroft name became off-limits and the company asked a community project to stop calling itself "MycroftOS", the spark was lit. 

"You can't call it that." 

"Okay then… any name ideas?" 

"What if we all shipped our tools together under one banner?" 

Thus, in 2020, OpenVoiceOS was born—not just as a fork, but as the next step forward. Only in hindsight does the LibreOffice/OpenOffice comparison make sense. At the time, this wasn't a rebellion. It was a survival move.

## Open by Philosophy, Not Just License 

OVOS wasn't born out of a desire to fork Mycroft, much like the ooo-build project wasn't intended to create a fork of OpenOffice. For many years, the OpenOffice.org community, which wasn't part of Sun Microsystems, had wanted a more egalitarian structure for the project. Ximian and then Novell maintained ooo-build, a patchset designed to make building OpenOffice easier on Linux and to address the challenges they faced when trying to contribute to the mainline development, which was often blocked. ooo-build wasn't a fork—it was simply a way to make contributions and development more sustainable. 

Mycroft made the same mistake. It rejected patches that might have enabled its independence. It chose control over collaboration, and that decision slowly alienated its most dedicated contributors. 

In much the same way, OVOS didn't start as a fork of Mycroft. It began as a community-driven initiative, focused on solving problems, removing the barriers that Mycroft had put in place, and taking ownership of the parts that Mycroft had neglected or restricted. The decision to move away from Mycroft's centralization wasn't driven by a desire to create something entirely separate but by the necessity of building a more open, flexible platform. 

Unlike Mycroft, which maintained its tight cloud dependency and gatekept contributions that could have improved its autonomy, OVOS embraced open-source principles to create a system that was open by philosophy—not just by license. 

OVOS accepts patches. It welcomes modules. It encourages users to opt out of cloud features. That open philosophy is what allowed it to stay alive while Mycroft faded away.

## No Zombie Packages, No Confusion 

What if Mycroft had been packaged in major Linux distros? What if it lingered in Debian or Fedora long after development stopped? 

We might've seen exactly the kind of split that plagues OpenOffice vs LibreOffice: two versions in the wild, one dead but still visible. 

But Mycroft never reached that kind of distro integration. So when the project went quiet, it actually disappeared—leaving room for OpenVoiceOS to step in cleanly as its spiritual successor, without ghosts in the repo.

## So Is Mycroft Still Alive? 

Technically? Maybe. On paper, the company still exists. The website is down. The forums were handed off to Neon. The code is still out there. But there was never a "Part 2" to the CEO's final blog post". It's unclear if it'll ever come back—and if it did, would it even be Mycroft anymore? 

More importantly: it doesn't matter. Because the people who built it, extended it, deployed it, and cared for it—they're all here, building OpenVoiceOS.

## Final Thoughts: This Time, It Was Different 

We didn't set out to repeat history. The LibreOffice/OpenOffice comparison only became obvious later. But we were lucky. When the trademark doors closed, a community window opened. The people who had carried Mycroft through its best years simply moved forward together. Not with a fork—but with a continuation. OpenVoiceOS is not "just a fork." It's the next chapter of the same story—written by those who knew it best. And this time, there's no one left to say, "You can't call it that."

## Help Us Build Voice for Everyone 

If you believe that voice assistants should be open, inclusive, and user-controlled, we invite you to support OVOS: 

- **💸 Donate**: Your contributions help us pay for infrastructure, development, and legal protections. 

- **📣 Contribute Open Data**: Speech models need diverse, high-quality data. If you can share voice samples, transcripts, or datasets under open licenses, let's collaborate. 

- **🌍 Help Translate**: OVOS is global by nature. Translators make our platform accessible to more communities every day. 

We're not building this for profit. We're building it for people. And with your help, we can ensure open voice has a future—transparent, private, and community-owned. 

👉 [Support the project here](https://www.openvoiceos.org/contribution)
