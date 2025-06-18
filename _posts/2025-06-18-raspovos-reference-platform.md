---
title: "A Reference Platform for Voice Assistant Development and a Plug-and-Play Entry Point for Users"
excerpt: "Introducing raspOVOS: a ready-to-use Raspberry Pi image that brings the power of OpenVoiceOS (OVOS) to your fingertips."
date: "2025-06-18T00:00:00.000Z"
author:
  name:  JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
coverImage: "https://github.com/OpenVoiceOS/raspOVOS/blob/dev/logo.png?raw=true"
ogImage:
  url: "https://github.com/OpenVoiceOS/raspOVOS/blob/dev/logo.png?raw=true"
---


We’re excited to introduce **raspOVOS**, a ready-to-use Raspberry Pi image that brings the power of OpenVoiceOS (OVOS) to your fingertips. Whether you’re a developer building next-generation voice assistants or a curious user wanting a local, private smart speaker, raspOVOS is your ideal starting point.

---

### 🚀 What is raspOVOS?

raspOVOS is a heavily customized version of Raspberry Pi OS that transforms your Raspberry Pi into a fully functional, offline-capable voice assistant. 

Built using [dtcooper/rpi-image-modifier](https://github.com/dtcooper/rpi-image-modifier), it automates the setup process and ensures every system is preconfigured with OpenVoiceOS services, dependencies, and performance tweaks.

We’ve split raspOVOS into three distinct editions to better match the capabilities of each Raspberry Pi model and your preferred use case:

- 🟢 **[Online Edition](https://github.com/OpenVoiceOS/raspOVOS/releases/tag/raspOVOS-bookworm-arm64-lite-2025-06-18)** _(RPi 3 optimized)_
  Lightweight and cloud-reliant, perfect for older hardware. Uses online STT/TTS for minimal CPU usage and lower memory demands. m2v and common query intent pipelines are disabled
- 🟡 **[Hybrid Edition](https://github.com/OpenVoiceOS/raspOVOS/releases/tag/raspOVOS-bookworm-arm64-hybrid-2025-06-18)** _(RPi 4 optimized)_
  A balance of performance and flexibility. Offline TTS with online STT. The best compromise without maxing out memory or compute.
- 🔴 **[Offline Edition](https://github.com/OpenVoiceOS/raspOVOS/releases/tag/raspOVOS-bookworm-arm64-offline-2025-06-18)** _(RPi 5 optimized)_
  Fully self-contained voice assistant. Runs everything locally including STT and TTS. Perfect for privacy first setups or when internet is unreliable.

Check out the [Getting Started Guide](https://openvoiceos.github.io/ovos-technical-manual/51-install_raspovos) for detailed instructions.

Find the latest images on the [Releases](https://github.com/OpenVoiceOS/raspOVOS/releases) page.

---

### 🙌 A User-Friendly Entry Point

raspOVOS isn’t just for developers, it's also the perfect solution for everyday users who want to use OpenVoiceOS without any technical hassle. Flash the image, plug in a mic and speaker, power up, and you’re greeted by an OVOS assistant ready to help.

Out of the box, raspOVOS:

* Logs in automatically as the `ovos` user (password: `ovos`)
* Starts all OVOS services at boot
* Includes all default OVOS skills
* Fully pre-configured for multiple languages including English, Spanish, Catalan, Galician, Basque, Dutch, German, Portuguese, Italian, and more

---

### 💡 Smart Design Choices

Under the hood, raspOVOS does a lot to ensure a reliable experience:

* Custom user `ovos` with appropriate permissions (`sudo`, `audio`, etc.)
* Audio and media stack tuned for voice interactions
* Preloaded models to avoid the need for a huge download on first boot
* Splash screen and I2C audio board support
* Improved system performance via ZRAM and optimized boot settings

For advanced users, self-hosting your own [STT](https://openvoiceos.github.io/ovos-technical-manual/200-stt_server/) and [TTS](https://openvoiceos.github.io/ovos-technical-manual/201-tts_server/) servers is encouraged for privacy and performance.

---

### 🧪 A Developer Reference Platform

For developers, raspOVOS serves as a standardized foundation to build, test, and deploy OVOS-based voice applications. 

It ships with preinstalled development tools, preloaded language models, and a complete audio stack including PipeWire and DLNA support.

```bash
  echo "                              =============================="
  echo "                              --- Welcome to OpenVoiceOS ---"
  echo "                               raspOVOS development Edition"
  echo "                              =============================="
  echo ""
  echo "Web Interfaces:"
  echo "  ovos-yaml-editor        (port 9210) Web editor for OVOS configuration"
  echo "  ovos-skill-config-tool  (port 8000) Web editor for individual skill settings"
  echo ""
  echo "OVOS Tool COMMANDs:"
  echo "  ovos-config            Manage your local OVOS configuration files"
  echo "  ovos-listen            Activate the microphone to listen for a command"
  echo "  ovos-speak  <phrase>   Have OVOS speak a phrase to the user"
  echo "  ovos-say-to <phrase>   Send an utterance to OVOS as if spoken by a user"
  echo "  ovos-simple-cli        Chat with your device through the terminal"
  echo "  ovos-docs-viewer       OVOS documentation viewer util"
  echo
  echo "OVOS packages utils:"
  echo "  ovos-install            Install ovos packages with version constraints"
  echo "  ovos-update             Update all OVOS and skill-related packages"
  echo "  ovos-force-reinstall    Force a reinstall of all ovos packages, for when you completely break your system"
  echo "  ovos-freeze             Export installed OVOS packages to requirements.txt"
  echo "  ovos-outdated           List outdated OVOS and skill-related packages"
  echo "  ovos-reset-brain        Reset 'OVOS brain' to a blank state by uninstalling all skills"
  echo
  echo "OVOS plugin utils:"
  echo "  ls-skills               List skill_id for all installed skills"
  echo "  ls-stt                  List installed STT (Speech-To-Text) plugins"
  echo "  ls-tts                  List installed TTS (Text-To-Speech) plugins"
  echo "  ls-ww                   List installed WakeWord plugins"
  echo "  ls-tx                   List installed Translation plugins"
  echo
  echo "OVOS Log Viewer:"
  echo "  ovos-logs [COMMAND] --help      Small tool to help navigate the logs"
  echo "  ologs                           View all logs realtime"
  echo
  echo "Misc Helpful COMMANDs:"
  echo "  ovos-status             List OVOS-related systemd services"
  echo "  ovos-restart            Restart all OVOS-related systemd services"
  echo "  ovos-commands           Usage examples for installed skills"
  echo "  ovos-server-status      Check live status of OVOS public servers"
  echo "  ovos-manual             OVOS technical manual in your terminal"
  echo "  ovos-skills-info        Skills documentation in your terminal"
  echo "  ovos-support            Compile logs and put together a support package"
  echo "  ovos-help               Show this message"
  echo
```
---

## Help Us Build Voice for Everyone

If you believe that voice assistants should be open, inclusive, and user-controlled, we invite you to support OVOS:

* **💸 Donate**: Your contributions help us pay for infrastructure, development, and legal protections.

* **📣 Contribute Open Data**: Speech models need diverse, high-quality data. If you can share voice samples, transcripts, or datasets under open licenses, let’s collaborate.

* **🌍 Help Translate**: OVOS is global by nature. Translators make our platform accessible to more communities every day.

We’re not building this for profit. We’re building it for people. And with your help, we can ensure open voice has a future—transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)

-----

![image](https://gist.github.com/user-attachments/assets/ce1ca88f-ac37-4a91-a428-bb85a75eaa25)

raspOVOS was made possible thanks to the **ILENIA** project, funded by:

> **Ministerio para la Transformación Digital y de la Función Pública** and the
> **Plan de Recuperación, Transformación y Resiliencia**, funded by the **EU – NextGenerationEU**,
> under reference **2022/TL22/00215337**.
