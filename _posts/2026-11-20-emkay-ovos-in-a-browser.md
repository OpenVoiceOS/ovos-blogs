---
title: "Emkay, part 1: From one big repo to OVOS in a browser tab"
excerpt: "Mycroft felt like one big repo and a skills folder. OpenVoiceOS is hundreds of small, sharp parts. Emkay puts the whole stack in a web page, so the hardware is the same everywhere and you can get going in a minute."
coverImage: "/assets/blog/emkay-ovos-in-a-browser/cover.png"
date: "2026-11-20T20:00:00.000Z"
author:
  name: "andlo"
  picture: "https://github.com/andlo.png"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/emkay-ovos-in-a-browser/cover.png"
---

*This is the first of three posts about Emkay. This one is about where the
idea came from and what Emkay is. [Part 2](/posts/2026-11-27-emkay-and-beyond)
is about what grew around it, and [part 3](/posts/2026-12-04-emkay-dev) is
about Emkay Dev. That part should make it easy for others, also people who
are not nerds, to make skills and understand what goes on inside OVOS.*

## The old days: it felt like one big repo

When I started with Mycroft, it felt like getting a voice assistant meant
cloning one repo. That was not quite true. `mycroft-core` held most of it:
the messagebus, the speech client, the audio service, the skill loader and
the settings. But the install script cloned a lot more than that, and it
did a fair bit of magic along the way. Skills were git repos too, and the
skill manager cloned each one into a folder, where the skill loader picked
them up.

In its own way that was easy to understand. You knew where most things
were. If something broke, you opened the one repo and went looking. And it
was easy to get started with, because you ran one script and waited.

The OVOS installer does much the same job, in a much more modern and
readable way. Both have the same hard task: to handle the whole OVOS stack,
the skills, the hardware, and many different platforms.

## Then came OpenVoiceOS

OpenVoiceOS has added an incredible amount since then. The biggest change
is plugins. Wake word, speech to text, text to speech, the intent pipeline,
audio, the hardware layer (PHAL): each one is a plugin that you can swap.
The core was split into many small parts. Each part is very good at its one
job, and it can be used for other things, and in other combinations.

That is a big strength. It is also why OVOS can feel hard to get an
overview of. When I counted, the OpenVoiceOS organisation on GitHub had
391 repositories, and 283 of them were not archived. That is not a
complaint. It is what a modular system looks like. But for a newcomer,
"where do I start?" is a fair question.

## Many assistants, one set of parts

What you get in return is that OVOS can be put together for almost any
device. A few examples:

- **[raspOVOS](https://github.com/OpenVoiceOS/raspOVOS)** is a ready image
  for a Raspberry Pi.
- **The Mark II** runs OVOS with its own screen, buttons and sound board.
- **A Fairphone 4** runs OVOS natively, on the phone itself, in Termux.

Each of them is built from the OVOS parts that fit that device and its
hardware best. That is the whole point of the modular design.

## The hardware is the hard part

The fun and the pain are both in the hardware. On the Mark II, some parts
of the sound board have no drivers in the kernel. They must be compiled in
a special way, for the kernel you happen to run. A Raspberry Pi has no
microphone at all, so you need to add one, and then make OVOS find it. Then
you are into ALSA, PulseAudio or PipeWire, and sample rates, and which card
is the default.

I have spent many happy hours on that, and I will spend more. It is a good
hobby. But it is not the quick way to see if a voice assistant is something
for you.

I wanted a way to get going faster. Something that works, and looks good
in an acceptable way. And preferably on a device you already have.

## So I made Emkay

[Emkay](https://emkay.ai) runs the whole OVOS stack in a browser. It is
Python in WebAssembly (Pyodide), with the messagebus, the skills, the
intent pipeline and the plugins all inside one web page. The name is
"M K", after Mycroft's Mark 1 and Mark II.

![emkay.ai: open a web page, say "Hey Emkay"](/assets/blog/emkay-ovos-in-a-browser/emkay-ai.png)

The trick is that the browser becomes the hardware. Microphone, speaker,
screen, volume, location and network all come from the browser, through
browser plugins for OVOS. A browser on a phone and a browser on a laptop
look much the same to OVOS. So the "hardware" is easy to recognise from
device to device, and the driver problem goes away.

That is why Emkay suddenly ran on my phone. It also runs on a tablet in
the kitchen, and on my work PC while I work. No install, no Linux drivers,
no venvs, no "that package does not build on this Python".

![The Emkay screen showing the time](/assets/blog/emkay-ovos-in-a-browser/emkay-faces.png)

## Easy, and private

From the start I had two requirements. It had to be easy to get started
with. And it had to be private. I think those two are the best arguments
for an open voice assistant.

So by default nothing leaves the device:

- The wake word ("hey M K") is an openWakeWord model that runs in the page.
- Speech to text is Whisper, running on the device in the browser.
- Text to speech is Piper, also on the device.

The first time, the speech models are downloaded, and Emkay tells you
while it happens. After that, what you say stays on the phone. You can
choose OpenVoiceOS' public servers instead, but Emkay never falls back to
them on its own. The screen always shows where Emkay listens: on the
device, on a server, or at home.

## As close to stock OVOS as possible

Emkay is not a fork. It runs the OVOS alpha channel and the same intent
pipeline that the OVOS installer sets up. Where the browser needs
something different, that is done the OVOS way, as plugins. There is a
PHAL plugin for the browser, an audio plugin, and STT and TTS plugins.
Each of them lives in its own repo with a normal OVOS name, and anyone can
use them.

Emkay is an early alpha. It needs a modern browser, and some older
browsers cannot run the on-device speech. But on most phones, tablets and
PCs you open [emkay.ai](https://emkay.ai), tap once, and say "Hey Emkay".

In [part 2](/posts/2026-11-27-emkay-and-beyond) I write about what grew
around Emkay: Emkay Home, Home Assistant, the skill store, and the fixes
that went back to OVOS.
