---
title: "OpenVoice OS @ Speechday 2026"
excerpt: "A recap of our visit to the fourth Dutch Speech Tech Day in Hilversum, the Netherlands"
coverImage: "/assets/blog/OpenVoiceOS-@-Speechday-2026/sound-and-vision-main-venue.jpg"
date: "2026-02-05T13:00:00.000Z"
author:
  name: "Timon van Hasselt"
  picture: ""
ogImage:
  url: "/assets/blog/OpenVoiceOS-@-Speechday-2026/sound-and-vision-main-venue.jpg"
---

On Monday, February 2, 2026, Peter Steenbergen and I attended the [fourth Dutch Speech Tech Day](https://sites.google.com/view/dutchspeechtechday2026) at “Beeld & Geluid” (Sound & Vision) in Hilversum, The Netherlands. It was our first time attending this annual meeting of approximately 100 researchers, innovators, and speech technology enthusiasts, held in the inspiring Radio & Television archive building.

![The exterior of the Sound & Vision building, modern and colorful](/assets/blog/OpenVoiceOS-@-Speechday-2026/sound-and-vision-building.png)
![The main venue at Sound & Vision](/assets/blog/OpenVoiceOS-@-Speechday-2026/sound-and-vision-main-venue.jpg)
![Peter at the infomarket stand](/assets/blog/OpenVoiceOS-@-Speechday-2026/peter-in-the-infomarket-stand.JPG)

## OVOS & VisioLab

We represented OpenVoice OS to promote our FOSS (free and open-source) framework. I was also there on behalf of VisioLab (the tech innovation department of Visio). My pitch focused on the [VoiceLab project](https://voicelab.visio.org), which centers on testing and prototyping new voice interactions for the blind and visually impaired—early adopters of voice-first interfacing. Additionally, we looked for collaborators to help build a truly open-source Dutch TTS through the subproject [The Voice of Holland](https://voicelab.visio.org/spraakmakers/#ai-stem-van-nederland).

![Timon and Peter in front of our info-stand](/assets/blog/OpenVoiceOS-@-Speechday-2026/timon-and-peter-at-the-infostand.JPG)

We had many fascinating conversations with like-minded people. Once visitors realized we had no commercial interest and were simply there to learn, exchange knowledge, and promote a sovereign platform, the ice broke quickly. It was refreshing to connect as peers in such an open environment.

## LEGO

![9 modules visualized in LEGO blocks, the OVOS pipeline](/assets/blog/OpenVoiceOS-@-Speechday-2026/ovos-lego-modules.jpg)

The interest in OpenVoiceOS was wonderful to see. Using LEGO blocks as a metaphor for the framework's modularity proved to be a great conversation starter ("Hey, what’s that LEGO all about?"). These modules—including voice activity detection, automatic speech recognition (ASR), and intent matching—form the OVOS pipeline. 

This modularity aligned perfectly with the day's themes. New speech models appearing weekly on HuggingFace were the "talk of the town." I especially enjoyed demonstrating this flexibility: just the evening before the event, I swapped my favorite [OVOS-Google-STT plugin](https://github.com/OpenVoiceOS/ovos-stt-plugin-chromium) for a newly released offline, open-source ASR model ([NVIDIA parakeet-tdt-0.6-v3-onnx](https://huggingface.co/istupakov/parakeet-tdt-0.6b-v3-onnx)). 

Thanks to an Apache 2.0 licensed [OVOS-onnx-ASR-plugin](https://github.com/TigreGotico/ovos-stt-plugin-onnx-asr) created by the OVOS lead developer only hours after the model's release—wow, that was fast!—we could give a live demo of a completely local setup.

It performed with the speed of proprietary online plugins; you couldn't tell the difference from the outside! The next challenge is testing this on a Raspberry Pi 4 to see if we can maintain that performance.

## AI Voice Personas

We also discussed the rise of AI speech agents —essentially LLMs with speech I/O. While new shiny agents like [unmute.sh](https://unmute.sh) are impressive, they often require significant hardware to achieve low latency. According to their [GitHub documentation](https://github.com/kyutai-labs/unmute#using-multiple-gpus), they run STT, TTS, and the LLM server on three separate GPUs to reach their target performance. 

Our focus remains on local, private home devices that -just work- and are fast and usable without a massive backend. Our work on ["OVOS-persona"](https://openvoiceos.github.io/ovos-technical-manual/150-personas/) is ongoing; whether it acts as the start of the pipeline or a fallback, the goal is to provide users with modular choices. They are in control.

## Looking Forward

It was a pleasure to meet organizers and researchers like Matt Coler (University of Groningen). We share the ambition to support "small" or underexposed languages and user groups, such as people with speech disorders or specific dialects. By joining forces with this network of innovators, we can reduce dependency on Big Tech and prove that we can be self-sufficient in speech technology.

![Selfie of Matt Coler and Timon](/assets/blog/OpenVoiceOS-@-Speechday-2026/timon-and-matt-coler.JPG)

## References

- [Dutch Speech Tech Day 2026](https://sites.google.com/view/dutchspeechtechday2026)
- [VoiceLab Visio](https://voicelab.visio.org)
- [OVOS Technical Manual - Personas](https://openvoiceos.github.io/ovos-technical-manual/150-personas/)
- [OVOS ONNX ASR Plugin](https://github.com/TigreGotico/ovos-stt-plugin-onnx-asr)
