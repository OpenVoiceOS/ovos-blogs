---
title: "OpenVoiceOS – Buildroot Edition: A Secure, Robust, and Easy-to-Use Embedded Operating System for Your Smart Speaker & Voice Assistant Devices"
excerpt: "Explore the Buildroot edition of OpenVoiceOS, designed to provide a high-performance, small-footprint embedded OS for smart speakers and voice assistants."
coverImage: "/assets/blog/common/cover.png"
date: "2023-02-02T00:00:00.000Z"
author:
  name: Peter Steenbergen
  picture: "https://avatars.githubusercontent.com/u/641281"
ogImage:
  url: "/assets/blog/common/cover.png"
---

The Buildroot edition of OpenVoiceOS is a custom embedded operating system created using [Buildroot](https://buildroot.org/), a popular and efficient tool for generating embedded Linux systems. This means that OpenVoiceOS comes with all the benefits Buildroot brings, such as a small footprint, optimized performance, and up-to-date security fixes.

What really sets the Buildroot edition apart is its focus on providing a ready-to-use firmware for voice-enabled embedded devices. With the increasing popularity of voice assistants and smart speakers, there's a growing demand for reliable and secure embedded systems that can integrate with voice technology.

OpenVoiceOS, and specifically the Buildroot edition, addresses this need by offering a stable firmware optimized for low-power embedded devices. This allows you to create your own privacy-respecting Smart Speaker & Voice Assistant. Smart speakers are becoming increasingly popular and feature-rich, and there are several features that are considered most important and widely used by users:

**Voice Assistance:** The most important feature of a smart speaker is the ability to use voice commands and questions such as voice-activated music playback, setting reminders, and answering questions. The Buildroot edition of OpenVoiceOS comes pre-installed with all the skills you need to ask common questions such as "what will the [weather](https://github.com/OpenVoiceOS/skill-ovos-weather) be like today?", "Set an [alarm](https://github.com/NeonGeckoCom/skill-alerts) for 8 am tomorrow morning" or "Who is Elon Musk?". With the possible integration of [ChatGPT](https://chat.openai.com/) as a [fallback skill](https://github.com/OpenVoiceOS/skill-ovos-fallback-chatgpt), your OpenVoiceOS will always respond with something interesting to say.

**Home Automation:** Smart speakers are often used as a hub for controlling other smart devices, such as lights, locks, and thermostats. [Home Assistant](https://www.home-assistant.io/) is a very popular and also FOSS system to control your IOT devices and is already [supported](https://github.com/OpenVoiceOS/ovos-PHAL-plugin-homeassistant). More IOT platforms will be supported in the future by our [Common IOT](https://github.com/OpenVoiceOS/ovos-PHAL-plugin-commonIOT) integration framework.

**Music & Video Streaming:** Smart speakers often have built-in support for popular music streaming services. [YouTube Music](https://openvoiceos.github.io/community-docs/playing_music/#youtube-music), [Spotifyd](https://openvoiceos.github.io/community-docs/spotifyd/), [Airplay](https://openvoiceos.github.io/community-docs/airplay/), and even plain [Bluetooth connectivity](https://openvoiceos.github.io/community-docs/btspeaker/) are included by default. OpenVoiceOS uses OCP ([OpenVoiceOS Common Play](https://openvoiceos.github.io/community-docs/OCP/)) and is a full-fledged multimedia player designed around open standards like MPRIS, allowing it to be controlled by external players and clients such as the Spotify App on your mobile device or [KDEConnect](https://openvoiceos.github.io/community-docs/kdeconnect/).

**Multi-room Audio:** Many smart speakers support multi-room audio, allowing users to play music in multiple rooms of their home. As a work in progress, OpenVoiceOS comes pre-installed with [Snapcast](https://github.com/badaix/snapcast) and [ROC-Toolkit](https://roc-streaming.org/), which will soon allow you to play your music fully synced between your OpenVoiceOS devices across your home or office.

**Voice Calls:** Although in early stages and on hold for a bit because of other tasks, OpenVoiceOS has the option to make and receive voice and video calls utilizing the [VOIP technology](https://github.com/baresip/baresip/).

In conclusion, OpenVoiceOS – The Buildroot edition is a cutting-edge, high-performance yet small-footprint embedded operating system that offers the benefits of Buildroot and is specifically designed for voice-enabled low-power embedded devices to create your own Smart Speaker with Voice Assistant with all the most commonly used features you would expect in such a device.
