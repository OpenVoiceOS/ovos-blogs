---
title: "Precise Wake Word Engine Goes ONNX!"
excerpt: "For years, the OpenVoiceOS community has relied on the Precise wake word engine. It's the core of how you bring your voice assistant to life! However, as technology evolves, so must we. The time has come to ensure future compatibility and even better performance on modern hardware."
coverImage: "/assets/blog/precise_onnx/thumb.png"
date: "2025-11-03T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/precise_onnx/thumb.png"
---

## Precise Wake Word Engine Goes ONNX!

-----

For years, the OpenVoiceOS community has relied on the [Precise-lite](https://github.com/OpenVoiceOS/ovos-ww-plugin-precise-lite) wake word engine. It's the core of how you bring your voice assistant to life! However, as technology evolves, so must we. The time has come to ensure future compatibility and even better performance on modern hardware.

## The Problem: Outdated Dependencies

The original Precise implementation depended heavily on `tflite_runtime` and specific, older versions of other packages, notably requiring `numpy<2.0.0`. This setup has been a growing headache:

  * **⚠️ Deprecation:** `tflite_runtime` is becoming increasingly difficult to install and maintain, especially with recent versions of Python.
  * **🐍 Python Version Incompatibility:** The strict dependency on older packages was creating friction and installation failures for users adopting newer Python releases.

This friction was an unnecessary barrier to entry for new users and a source of frustration for existing ones. We knew we had to fix it.

-----

## The Solution: Migrating to ONNX!

We've completely overhauled the Precise wake word plugin by **exporting Precise models to the ONNX format** (Open Neural Network Exchange).

This is a **game-changer** for stability and future-proofing!

### Introducing `ovos-ww-plugin-precise-onnx`

We are thrilled to announce the official release of the new plugin: [`ovos-ww-plugin-precise-onnx`](https://github.com/OpenVoiceOS/ovos-ww-plugin-precise-onnx)!

By adopting ONNX, we eliminate the reliance on the problematic `tflite-runtime` package. ONNX provides a standardized, performant, and future-proof format for machine learning models, ensuring better compatibility across different systems and hardware.

You can find **all available Precise models**, now converted to ONNX, in our dedicated repository: [`precise-lite-models`](https://github.com/OpenVoiceOS/precise-lite-models).

-----

## The Unexpected Performance Bonus

While the primary goal was to fix installation woes, the move to ONNX has delivered an **unexpected performance boost!**

Initial testing on a **Raspberry Pi 5** shows a significant reduction in CPU usage:

| Wake Word Engine               | RPi 5 Listener Process CPU Usage (Approx.) |
|:-------------------------------|--------------------------------------------|
| **Precise (`tflite-runtime`)** | ~1.8% - 2.6%                               |
| **Precise (ONNX)**             | **~1.0% - 1.3%**                           |

That's a **massive efficiency gain**, allowing your OVOS system to dedicate more resources to running skills and other tasks! This makes OpenVoiceOS even lighter and faster on edge devices like the Raspberry Pi.

-----

## Get the Upgrade Today!

This migration ensures that the popular and powerful Precise engine remains a **stable, high-performance option** for the OpenVoiceOS community for years to come. Enjoy the easier installation, greater stability, and lower CPU usage!

Update your installation and try the new **ONNX-powered Precise** for yourself!

  * **New Plugin:** [`ovos-ww-plugin-precise-onnx`](https://github.com/OpenVoiceOS/ovos-ww-plugin-precise-onnx)
  * **ONNX Models:** [`precise-lite-models`](https://github.com/OpenVoiceOS/precise-lite-models)


---

## Help Us Build Voice for Everyone 

If you believe that voice assistants should be open, inclusive, and user-controlled, we invite you to support OVOS: 

- **💸 Donate**: Your contributions help us pay for infrastructure, development, and legal protections. 

- **📣 Contribute Open Data**: Speech models need diverse, high-quality data. If you can share voice samples, transcripts, or datasets under open licenses, let's collaborate. 

- **🌍 Help Translate**: OVOS is global by nature. Translators make our platform accessible to more communities every day. 

We're not building this for profit. We're building it for people. And with your help, we can ensure open voice has a future—transparent, private, and community-owned. 

👉 [Support the project here](https://www.openvoiceos.org/contribution)
