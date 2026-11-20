---
title: "A fresh look at an old face: OVOS Visage"
excerpt: "OpenVoiceOS has a new spec-compatible GUI called Visage: an animated face, lip-synced speech, and a full set of skill pages, inspired by the original Mycroft Mark 2 concept."
coverImage: "/assets/blog/visage-gui/cover.png"
date: "2026-11-19T00:00:00.000Z"
author:
  name: "Mike Gray"
  picture: "https://github.com/mikejgray.png"
ogImage:
  url: "/assets/blog/visage-gui/cover.png"
---

In the early days of Mycroft AI's offerings, there was the Mark 1. It was a cute little proof of concept device that had LED eyes that blinked, a mouth that changed based on what it was doing, and not much else. They decided to capitalize on the runaway success of the Mark 1 with a Kickstarter for the Mark 2, the last device they released before they shut their doors.

[In the Kickstarter](https://www.kickstarter.com/projects/aiforeveryone/mycroft-mark-ii-the-open-voice-assistant), the video showed a vertical pill-shaped device with a cute animated face, animations for common skills, and a visual design language that was exciting and fresh. The Mark 2 that shipped looked much different; the screen was in landscape, not portrait, and the GUI was quite different. There was no face, the visual design language was entirely different, and while it was feature-rich...it lacked the pizazz of the original video.

Fast forward a handful of years. In 2026, generative AI exploded. Frontier models improved to the point that their output was generally more trustworthy (given sufficient tests and guard rails). I started to wonder: could it be possible to give these devices to everyone without taking on the burden of custom hardware?

## Mark 1

The first question that came to my mind was "is it possible to emulate the Mark 1 in a browser, so that everyone can have one?" Using a mix of Claude Opus 5.5 and Fable 5.1, I came up with a plan.

First, in order to minimize how much code duplication would be required, I wanted to create a virtual version of the Arduino board that powers the Mark 1. OpenVoiceOS had already invested the time in making that code accessible and understandable. Pointing Claude at it led to a virtual Arduino that responded the same way in short order.

OpenVoiceOS has supported the Mark 1 for a number of years. Its skills and core logic emit the code required to drive the Mark 1 (assuming you're running the correct plugin). This made it trivial to point it at the virtual Arduino.

Finally, there was the virtual Mark 1 itself. I've always been more backend-oriented, so for me AI has been a joy - UIs are now accessible to me! Claude got to work creating not just a very basic representation of the Mark 1 LED arrays, but even emulating the acrylic over the front of the mouth that muted the LEDs. Later, community member Timon van Hasselt (timonvanhasselt) pointed me to work Gaëtan Trellu (goldyfruit) had done to make a basic version of the Mark 1 in the browser. I adopted that design, which was now enhanced with the full featureset of the emulator.

![The virtual Mark 1 faceplate: two rings of blue LED eyes and a dot-matrix mouth in an open, mid-word shape](/assets/blog/visage-gui/virtual-mark1.png)
*The virtual Mark 1, with the mouth on its "wide open" viseme.*

## Mark 2

[The virtual Mark 1](https://github.com/OscillateLabsLLC/ovos-virtual-mark1) generated some excitement in the community, and I was eager to see what else was possible. I got to thinking about the old Mark 2 Kickstarter, and how often I and other community members lamented that we never got a device like the concept. Ever since I first got involved with the Mycroft and OpenVoiceOS communities, I wanted to have a GUI with that fun little animated face.

Shortly after releasing the Mark 1 emulator I fired up Claude again and came up with a plan using the original Kickstarter video as inspiration. Over the course of about a day I had Claude generate a browser-based version of the original Mark 2 concept GUI that could actually respond to a live OpenVoiceOS instance. It didn't have all of the features of the concept video, but it had the right look and feel, and one of the faces. At my prompting, Claude added a nice touch that I would have struggled to handle myself: animating the mouth so that there were smooth transitions from grapheme to grapheme.

I updated the [Kokoro text-to-speech plugin](https://github.com/OscillateLabsLLC/ovos-tts-plugin-kokoro) I'd released as a proof of concept a couple months earlier to emit exact viseme data, which happened to be produced natively by the Kokoro models, and added a new dimension to the face. Its mouth moved with the speech it emitted in a highly realistic way. Visage was born.

![Left: the browser version showing an hourly forecast in a pill-shaped device frame, with the face speaking in a badge. Right: the full-size face mid-word, with a rounded mouth shape](/assets/blog/visage-gui/mark2-concept.png)
*The browser-based Mark 2 concept answering a live OVOS instance (left), and the face mid-word with its mouth shape taken from Kokoro's viseme output (right).*

## Visage

The community responded to the Mark 2 concept with more enthusiasm. Amidst questions of what additional features might be added, I started to think about how to keep Visage maintainable in the long-term. For the last couple of years I've used [Flutter](https://flutter.dev/), a framework for creating native multi-platform applications from a single codebase, and it seemed to be a natural fit. I pulled Claude out again and started with a conversion from the web version to a Flutter-native version. It took a couple of hours to get full feature parity and make sure the codebase was composable and extensible, and I had a working concept that ran first on macOS and then on Linux.

![Left: the native Visage window on macOS, with a short answer in a glowing ring and the face in a badge. Right: aperture eyes and an orb mouth speaking over the idle page](/assets/blog/visage-gui/visage-native.png)
*The Flutter version running natively on macOS, with one of its swappable faces.*

From there, I worked to enhance Visage, spread across most of a week. I wanted a consistent visual design language, but I also wanted to make sure Visage was performant and resource-friendly. Adding more features took up many hours, and working on its performance took several more - the initial design worked but scaled poorly.

I released the Flutter version of [Visage on GitHub](https://github.com/OscillateLabsLLC/ovos-gui-visage) and shared it with the community. Visage is the first full-featured GUI released for OpenVoiceOS specifically. Over the course of the next couple of weeks, I worked with Claude to make Visage more OS-native and have different operating modes, such as "peek" (shrink down to a small face widget when not actively in use) and "kiosk" (full screen, potentially useful for devices such as the Mycroft Mark 2).

![Peek mode while OVOS speaks: glowing oval eyes and a bar-graph mouth over the idle page](/assets/blog/visage-gui/peek-mode.png)
*Peek mode, expanded while OVOS is speaking.*

![Kiosk mode on a wide display: the portrait frame centred with black bars at the sides](/assets/blog/visage-gui/kiosk.png)
*Kiosk mode on a wide display.*

The most important change came after all of this. At the request of OVOS' lead developer JarbasAI, I spent several days making Visage fully compliant with the upcoming OVOS GUI spec, while retaining backwards compatibility with the existing GUI protocol.

Visage is ready to visualize your OVOS instance for both now and the foreseeable future of the platform.

## Installation

Full installation instructions are available at the [Visage GitHub page](https://github.com/OscillateLabsLLC/ovos-gui-visage). Visage currently only supports macOS and Linux, but if there is interest, other operating systems could become an option.

Visage has not been tested on a Mycroft Mark 2 at the time of this writing. It should theoretically work in landscape orientation, but has been designed for portrait.

## The future

The future of personal, private, open-source voice assistants is bright - and now it's also visual. Visage is the first of what I expect to be many GUIs that support OVOS. Feature requests, pull requests, and bug reports are very welcome!

## About the author

Mike Gray is the founder and principal developer for [Oscillate Labs LLC,](https://oscillatelabs.net/) which specializes in apps, voice assistants, and AI tools that run on your own hardware. By day, he is an AWS cloud specialist and DevOps engineer. Mike has released several notable projects for OVOS via Oscillate Labs, including the Rust messagebus port that powers new default OVOS installations, the Home Assistant skill, and Switchboard, a new deterministic intent engine meant to replace Padatious and Adapt. Since 2023, [he has shared community blog posts about making OpenVoiceOS and Neon AI work for you](https://oscillatelabs.net/posts/).
