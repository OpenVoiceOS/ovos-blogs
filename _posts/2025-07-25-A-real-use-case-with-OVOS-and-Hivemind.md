---
title: "A real use case with OVOS and Hivemind"
excerpt: "A practical example of OVOS and Hivemind running locally on standard hardware, designed for home automation and basic AI assistant tasks — especially suited for supporting people with disabilities."
coverImage: "/assets/blog/common/cover.png"
date: "2025-07-25T00:00:00.000Z"
author:
  name: "Menne Bos"
  picture: "https://github.com/MenneBos.png"
ogImage:
  url: "https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/blob/main/Media/Sat_kitchen_small.png"
---

# Why Home Automation with OVOS matters

Over the past five years, I’ve visited many people with disabilities in their homes and witnessed firsthand how much effort it can take to control everyday things like lights, heating, doors, curtains, and appliances. Often, this leads to less comfort than what’s technically possible. Giving people access to voice-activated home automation isn't just convenient—it offers them greater independence, comfort, and peace of mind.

Such a system typically consists of two core components: a home automation gateway and a voice assistant. OVOS (Open Voice OS) is a voice-first assistant that integrates seamlessly with home automation systems. Its full focus on voice means that every part of the system—from wakeword to intent—is designed with spoken interaction in mind.

With OVOS, I can fully customize and control intents for things like switching on lights, playing music, or interacting with an AI assistant. That level of control is often missing in commercial systems. Sometimes, when you ask them to close the curtains, they might suggest where to buy new ones instead.

## OVOS and Hivemind filling Real Needs

I'm using an OVOS server with Hivemind satellites, which allows me to adapt the system to virtually any use case. These lightweight, low-cost satellites make it feasible to have a voice assistant in every room. What’s more, I can easily customize the enclosures to suit specific situations—like fitting them into a bathroom, or attaching one to a wheelchair. Thanks to their low power consumption, the satellites can even be powered directly from a wheelchair battery.

Looking ahead, the next step is integrating a personal AI assistant directly into the voice assistant. This enables a private, fully offline solution—something that’s becoming increasingly important for privacy, reliability, and autonomy.

### How did I built a Smarter Living with OVOS, Hivemind, and Raspberry Pi Satellites

In this showcase, I’ve built a basic voice setup using Open Voice OS (OVOS) and Hivemind. The OVOS server runs on a compact Intel NUC with a 5th-gen i5 processor. It hosts both the OVOS core and a Generative AI model (Ollama running Gemma3:1B), which enables offline voice control and (some) intelligence and context-aware responses. By linking OVOS to my Homey gateway, I can control lighting, audio, and various smart devices with natural speech.

To expand voice coverage throughout the house, I added Raspberry Pi Zero 2W units as satellites. These low-power devices use local voice activation (VAD) to detect the wakeword ("Hey Mycroft"). Once triggered, they record the spoken command and forward the audio to the Hivemind listener on the OVOS server. Hivemind then routes the audio to OVOS, which parses the utterance and executes the appropriate intent—whether it’s starting a radio stream, sending a message to the AI assistant, or toggling a device via the Homey API.

While OVOS and Hivemind are still evolving, this setup already proves itself in real-world use. It’s stable enough for friendly testing and flexible enough to grow with future needs.

## The Show case

The showcase is using Dutch language. Trust me, the system does what it should do.
Satellites: Components https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/blob/main/Media/Sat_components.jpg
Satellites: Assembled https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/blob/main/Media/Sat_assembled.jpg
Satellite: In kitchen https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/blob/main/Media/Sat_kitchen.jpg
Satellite: In sleeping room https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/blob/main/Media/Sat_sleepingroom.jpg
Controlling Curtains in sleeping room [video]: https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/blob/main/Media/Open_Curtain_SleepingRoom.mp4
Controlling the coffee machine [video]: https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/blob/main/Media/Coffee_automation.mp4
Useing the AI assistant [video]: https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/blob/main/Media/GenAI_assistant.mp4

### Including Images

More information on OVOS and Hivemind:
OVOS: https://ovoshatchery.github.io/community-docs/
Hivemind: https://jarbashivemind.github.io/HiveMind-community-docs/

## Conclusion

OVOS has key feature for controlling the house:
- fine control on intents to enable predictive outcomes
- satellite architecture for flexibility
- [future] Integrated with local or private GenAI

👉 [Support the project here](https://www.openvoiceos.org/contribution)