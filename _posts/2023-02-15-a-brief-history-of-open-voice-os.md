---
title: "A Brief History of Open Voice OS"
excerpt: "Explore the history of Open Voice OS, from its roots in MycroftAI to becoming a leading open-source voice assistant system."
coverImage: "/assets/blog/hello-world/cover.jpg"
date: "2023-02-15T00:00:00.000Z"
author:
  name: Strongthany
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/hello-world/cover.jpg"
---

OpenVoiceOS has become one of the leading open-source voice assistant systems, though it hasn't always been in that position. Through this post, we'll explore the history of OVOS and get some insight into how it grew into what it is today.

We begin back in 2015, not with OVOS itself, but with the start of MycroftAI, which exploded onto the scene when it launched its [Kickstarter for Mark I](https://www.kickstarter.com/projects/aiforeveryone/mycroft-an-open-source-artificial-intelligence-for), their first smart speaker, produced in-house. Mycroft pledged to be different from other voice assistants by focusing on user privacy. This brought their project widespread attention and led them to meet their crowdfunding goal. Over the next few years, the project passed several important milestones, including the release of the [MycroftAI Mimic TTS](https://mycroft.ai/blog/vocalidmimic/) (Text-to-Speech) engine in February 2016 and the public release of the Mycroft software under the GPL license in May of the same year. By October 2017, the Mycroft-core repositories were [relicensed under Apache 2.0](https://mycroft.ai/blog/right-license/), a move that would set the stage for the formation of new, derivative projects.

From there, community involvement continued to grow and expand. Some of these contributions would lay the groundwork for what would eventually become OVOS. Aditya Mehra ([Aix](https://github.com/AIIX)), who released a [Mycroft extension for the Gnome shell](https://github.com/AIIX/Mycroft-AI-Gnome-Shell-Extension) in June 2016, became a contributor on the desktop integration team and went on to release the [MycroftAI plasmoid](https://mycroft.ai/blog/mycroft-gets-a-plasmoid) for the KDE Plasma desktop in January 2017. The plasmoid project was later incubated under KDE itself, also by Aditya Mehra.

In December 2017, Casimiro Ferreira ([JarbasAI](https://github.com/JarbasAl)) created the first version of his "[personal backend](https://github.com/OpenVoiceOS/ovos-personal-backend)," which was a reverse-engineered version of MycroftAI's backend. Personal Backend was designed to be simple and permissively licensed under Apache 2.0, making it more accessible to other projects. It continues as an optional component of OpenVoiceOS.

MycroftAI would go on in 2018 to launch its [second Kickstarter](https://www.kickstarter.com/projects/aiforeveryone/mycroft-mark-ii-the-open-voice-assistant?ref=profile_created). The Mark II was to be a more featured version of their Mark I, complete with a touchscreen to provide a more advanced user interface. Mycroft reached their fundraising goal quickly, promoting the success as an achievement for open-source projects and offering hope for fast progress. This sadly would not be the case due to several issues in development. Owing to lackluster progress on the Mark II device, slow response to community-led projects, and other more technical concerns, multiple downstream partners decided to maintain their own forks of the core software. This enabled them to continue feature development without waiting for the parent project. One such fork was called mycroft-lib and was originally maintained by Jarbas on behalf of [Chatterbox](https://hellochatterbox.com), another related voice assistant project.

mycroft-lib, during its early existence, was described not as a fork of Mycroft but as a superset. It obligated itself to remain compatible with upstream changes and restricted itself to performance improvements and bug fixes.

September 2018 also saw the creation of the [Mycroft-GUI](https://mycroft.ai/blog/the-mycroft-gui-the-screen-is-dead-long-live-the-screen/) framework currently also used by OVOS, a collaboration between MycroftAI developers and KDE developers based on KDE frameworks, and currently maintained by Aditya Mehra.

In 2019, [MycroftOS](https://www.j1nx.nl/dev-mycroftos-a-bare-minimal-os-based-on-buildroot) was renamed to [OpenVoiceOS – Mycroft Edition](https://community.mycroft.ai/t/openvoiceos-a-bare-minimal-production-type-of-os-based-on-buildroot/4708/199) to avoid trademark issues. mycroft-lib was renamed to [Holmes](https://github.com/HelloChatterbox/HolmesIV) for the same reasons and then adopted by OpenVoiceOS. In October, the MycroftAI backend, called [selene](https://mycroft.ai/blog/open-sourcing-the-mycroft-backend/), was open-sourced under the AGPL license, but this did not lead to wide adoption due to its complexity and license choice.

Chatterbox focused on its closed-source products and stopped maintaining Holmes. OpenVoiceOS then decided to create [ovos-core](https://github.com/OpenVoiceOS/ovos-core) and maintain it themselves.

March 2020 marked a turning point in Mycroft's relationship with outside developers. Casimiro Ferreira and Aditya Mehra partnered to create a [VOIP skill](https://github.com/JarbasSkills/skill-voip) and, along with Peter Steenbergen ([j1nx](https://github.com/j1nx)), formed the OpenVoiceOS project, centered around OVOS-Mycroft Edition. Chance ([ChanceNcounter](https://github.com/ChanceNCounter)), one of the maintainers of [lingua-franca](https://mycroft.ai/blog/lingua-franca-v0-1-released/) (mycroft's NLP library), and Daniel ([NeonDaniel](https://github.com/NeonDaniel)), developer for NeonAi, joined shortly after. The project continues to grow to this day with Parker Seaman ([Strongthany](http://github.com/5trongthany/)) recently joining the team as community manager. Around the same time, Michael Lewis became the CEO of MycroftAI.

Today, OVOS-Core is widely adopted by community projects and is quickly becoming the backbone of the open-source voice assistant movement. After the recent shuttering of MycroftAI due to lack of funding, OpenVoiceOS represents the survival of the Mycroft community, continues the nonprofit side of Mycroft development, and guarantees the future of privacy-focused, open-source voice assistants.

Want to get involved? Check out [code](https://github.com/OpenVoiceOS) and chat with the community on [Matrix](https://matrix.to/#/!XFpdtmgyCoPDxOMPpH:matrix.org?via=matrix.org).
