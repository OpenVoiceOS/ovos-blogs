---
title: "A real use case with OVOS and Hivemind"
excerpt: "A practical example of OVOS and Hivemind running locally on standard hardware, designed for home automation and basic AI assistant tasks — especially suited for supporting people with disabilities."
coverImage: "/public/assets/blog/A-real-use-case-with-OVOS-and-Hivemind/Thumbnail_3D_case.jpg"
date: "2025-07-28T00:00:00.000Z"
author:
  name: "Menne Bos"
  picture: "https://github.com/MenneBos.png"
ogImage:
  url: "/public/assets/blog/A-real-use-case-with-OVOS-and-Hivemind/Thumbnail_3D_case.jpg"
---

# Why Home Automation with OVOS matters

Over the past five years, I’ve visited many people with disabilities in their homes and witnessed firsthand how much effort it can take to control everyday things like lights, heating, doors, curtains, and appliances. Often, this leads to less comfort than what’s technically possible. Giving people access to voice-activated home automation isn't just convenient—it offers them greater independence, comfort, and peace of mind.

Such a system typically consists of two core components: a home automation gateway and a voice assistant. OVOS (Open Voice OS) is a voice-first assistant that integrates seamlessly with home automation systems. Its full focus on voice means that every part of the system—from wakeword to intent—is designed with spoken interaction in mind.

![The satellite in a 3D-printed case](/assets/blog/A-real-use-case-with-OVOS-and-Hivemind/Sat_kitchen_smallest.jpg) 

With OVOS, I can fully customize and control intents for things like switching on lights, playing music, or interacting with an AI assistant. That level of control is often missing in commercial systems. Sometimes, when you ask them to close the curtains, they might suggest where to buy new ones instead.

## OVOS and Hivemind filling Real Needs

I'm using an OVOS server with Hivemind satellites, which allows me to adapt the system to virtually any use case. These lightweight, low-cost satellites make it feasible to have a voice assistant in every room. What’s more, I can easily customize the enclosures to suit specific situations—like fitting them into a bathroom, or attaching one to a wheelchair. Thanks to their low power consumption, the satellites can even be powered directly from a wheelchair battery.

Looking ahead, the next step is integrating a personal AI assistant directly into the voice assistant. This enables a private, fully offline solution—something that’s becoming increasingly important for privacy, reliability, and autonomy.

<video src="https://www.youtube.com/shorts/C_xS87EbsiM" controls title="Start coffee machine with voice"></video>

<video src="https://www.youtube.com/watch?v=PRzGxmTCFb0" controls title="Talk with the GenAI assistant"></video>

### How did I built a Smarter Living with OVOS, Hivemind, and Raspberry Pi Satellites

In this showcase, I’ve built a basic voice setup using Open Voice OS (OVOS) and Hivemind. The OVOS server runs on a compact Intel NUC with a 5th-gen i5 processor. It hosts both the OVOS core and a Generative AI model (Ollama running Gemma3:1B), which enables offline voice control and (some) intelligence and context-aware responses. By linking OVOS to my Homey gateway, I can control lighting, audio, and various smart devices with natural speech.

To expand voice coverage throughout the house, I added Raspberry Pi Zero 2W units as satellites. These low-power devices use local voice activation (VAD) to detect the wakeword ("Hey Mycroft"). Once triggered, they record the spoken command and forward the audio to the Hivemind listener on the OVOS server. Hivemind then routes the audio to OVOS, which parses the utterance and executes the appropriate intent—whether it’s starting a radio stream, sending a message to the AI assistant, or toggling a device via the Homey API.

![Only a few components are required](/assets/blog/A-real-use-case-with-OVOS-and-Hivemind/Sat_assembled_smallest.jpg) 

While OVOS and Hivemind are still evolving, this setup already proves itself in real-world use. It’s stable enough for friendly testing and flexible enough to grow with future needs.

## Conclusion

OVOS has key features for controlling the house:
- fine control on intents to enable predictive outcomes
- satellite architecture for use case flexibility
- [future] Integrated with local or private GenAI

### More links

+- [3D drawings](https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/tree/main/Mechanics)  
+- [PCB drawings](https://github.com/MenneBos/ovos-skill-HomeyFlowTrigger/tree/main/Hardware/KiCad_OVOS_sat)  
+- [OVOS technical manual](https://openvoiceos.github.io/ovos-technical-manual/)  
+- [Hivemind documentation](https://jarbashivemind.github.io/HiveMind-community-docs/)  

## Help Us Build Voice for Everyone 

If you believe that voice assistants should be open, inclusive, and user-controlled, we invite you to support OVOS: 

- **💸 Donate**: Your contributions help us pay for infrastructure, development, and legal protections. 

- **📣 Contribute Open Data**: Speech models need diverse, high-quality data. If you can share voice samples, transcripts, or datasets under open licenses, let's collaborate. 

- **🌍 Help Translate**: OVOS is global by nature. Translators make our platform accessible to more communities every day. 

We're not building this for profit. We're building it for people. And with your help, we can ensure open voice has a future—transparent, private, and community-owned. 

👉 [Support the project here](https://www.openvoiceos.org/contribution)
