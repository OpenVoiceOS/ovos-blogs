---
title: "OVOS Speaks Wyoming: Use OpenVoiceOS Engines from Home Assistant"
excerpt: "Three bridges expose any OVOS STT, TTS, or wake-word plugin as a Wyoming service, so Home Assistant's Assist pipelines can run the OVOS engine catalog. Deploy them with one docker-compose file."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-14T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## OVOS Speaks Wyoming

The open-source voice world has two thriving hearts. On one side, OpenVoiceOS, with its sprawling catalog of pluggable STT, TTS, and wake-word engines. On the other, Home Assistant's Assist stack, built around a small protocol called **Wyoming**.

Both are open. Both are private-by-default. And yet, for the longest time, they couldn't share a single engine. If you had built the perfect offline voice pipeline in OVOS, you couldn't offer it to Home Assistant. Two communities solving the same problem, separated by a wire format.

That changes with a set of bridges that let Home Assistant run any OVOS engine. This work ships as an extra beyond our grant's Expose deliverable.

---

## What Wyoming is, briefly

Wyoming is the peer-to-peer voice protocol behind Home Assistant's Assist stack, originally from the rhasspy project. It's deliberately simple: it frames audio and events over a plain socket, so a client like Home Assistant can hand audio to a service and get transcriptions, synthesized speech, or wake-word detections back. That simplicity is exactly what makes it a good meeting point.

Our approach is honest and unglamorous: these are **bridges**, adapters that expose existing OVOS plugins over the Wyoming wire protocol. There's no reimplementation and no forking of engines. Your OVOS plugin runs as it always has; the bridge is a thin server that speaks Wyoming to Home Assistant and OVOS plugin calls to the engine. One direction only: the bridges are Wyoming *servers* that let Home Assistant consume OVOS engines.

---

## Three bridges

There is one bridge per stage of the voice pipeline:

- **[wyoming-ovos-stt](https://github.com/OpenVoiceOS/wyoming-ovos-stt)** exposes any OVOS speech-to-text plugin, for example an `onnx-asr` model, as a Wyoming ASR service.
- **[wyoming-ovos-tts](https://github.com/OpenVoiceOS/wyoming-ovos-tts)** exposes any OVOS text-to-speech plugin, such as a phoonnx or piper voice, as a Wyoming TTS service.
- **[wyoming-ovos-wakeword](https://github.com/OpenVoiceOS/wyoming-ovos-wakeword)** exposes any OVOS wake-word plugin as a Wyoming wake service.

Each bridge is a small Python service that takes two things: which OVOS plugin to load, and where to listen. On the command line the plugin is a required `--plugin-name` (the same value you would put under `module` in `mycroft.conf`), and the listen address is `--uri`, which defaults to `stdio://` and also accepts a `tcp://host:port` address. The plugin's own settings — language, model, voice — are read from `mycroft.conf` exactly as they would be inside a running OVOS. Nothing about the engine changes; the bridge just wraps it.

Point Home Assistant at one of these and the corresponding OVOS engine appears as a provider you can select in Assist. Because the bridge is thin, whatever the underlying plugin supports — streaming, language selection, custom models — comes along for the ride.

---

## Deploying the bridges

The easiest way to run all of this is with containers. The **[ovos-wyoming-docker](https://github.com/OpenVoiceOS/ovos-wyoming-docker)** repository ships a `docker-compose.yml` with ready-made images for specific engines and voices, so you don't have to hand-assemble a Python environment on your voice box. The images are published under the `jarbasai/ovos-wyoming-*` namespace, and the compose file wires each one to a stable host port:

- **STT:** a Chromium-based recognizer (`jarbasai/ovos-wyoming-chromium`) on host port **10500**, and a server-backed STT image on **10501**.
- **TTS:** a family of voices, each on its own port, including Matxa (10601), Mimic (10603), NOS (10604), and SAM (10605), plus Google-Translate and remote-server variants.
- **Wake word:** a `wakewords` image on host port **10900**.

Inside every container the bridge listens on port 8080; the compose file maps that to the host port shown above, so all the services land in the ~10500-10900 range. Each service also mounts your `mycroft.conf`, which is where you set the plugin's language, model, or voice.

Bring one up like any other compose service:

```bash
# from the ovos-wyoming-docker checkout
docker compose up -d wyoming-ovos-tts-sam
```

That publishes the SAM voice bridge on host port 10605. Then, in Home Assistant, wire it in through the UI:

**Settings → Devices & Services → Add Integration → Wyoming Protocol**, and enter the host and port of the running bridge (for example your voice box's address and `10605`). Home Assistant connects to the service and offers it as a TTS, STT, or wake-word provider for your Assist pipelines.

The exact image names and host ports live in the compose file, but the shape is the same across all three bridges: run the container, note the host port, add it in Home Assistant. Prefer to run without Docker? Each bridge is a plain Python service; give it a `--plugin-name` and a `--uri` such as `tcp://0.0.0.0:10605`, and point Home Assistant at that address instead.

---

## Why this matters

The point isn't a clever protocol trick. It's the end of a quiet lock-in.

- **No lock-in.** Your choice of STT, TTS, or wake word is no longer tied to which assistant you happened to start with.
- **Mix and match.** Run OVOS wake-word detection in front of a Home Assistant pipeline, or a phoonnx voice inside Assist. Compose the best of both stacks.
- **The whole OVOS catalog, reachable.** Every OVOS plugin — the growing family of offline STT and TTS engines, dozens of voices and languages — becomes available to Home Assistant users through a single integration.
- **Private and offline.** Nothing here phones home. These bridges keep audio on your own hardware, on your own network, exactly where both communities want it.

Two open ecosystems, one protocol, and finally, shared engines.

---

This work is part of the OpenVoiceOS **From Beta to Breakthrough** milestone, funded through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of [DG Communications Networks, Content and Technology](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en) under grant agreement No [101135429](https://cordis.europa.eu/project/id/101135429). Additional funding is made available by the [Swiss State Secretariat for Education, Research and Innovation](https://www.sbfi.admin.ch/sbfi/en/home.html) (SERI).

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
