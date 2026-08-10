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

Home Assistant's Assist voice pipelines only work with speech engines that speak Wyoming, its voice protocol. OpenVoiceOS (OVOS) has a much larger catalog of speech-to-text (STT), text-to-speech (TTS), and wake-word plugins. Until now, none of them worked with Assist. Three new bridges close that gap: they expose any OVOS plugin as a Wyoming service, so you can pick from the whole OVOS catalog inside Home Assistant.

---

## What Wyoming is, briefly

Wyoming is the peer-to-peer voice protocol behind Home Assistant's Assist stack, originally from the rhasspy project. It frames audio and events over a plain socket. A client such as Home Assistant hands audio to a service and gets back transcriptions, synthesized speech, or wake-word detections.

The bridges are adapters, not reimplementations. Each one wraps an existing OVOS plugin and speaks Wyoming on one side, the OVOS plugin API on the other. Your OVOS plugin runs exactly as it always has. The bridges are Wyoming *servers*: Home Assistant connects to them, not the other way around.

---

## Three bridges, one per pipeline stage

- **[wyoming-ovos-stt](https://github.com/OpenVoiceOS/wyoming-ovos-stt)** exposes any OVOS speech-to-text plugin, for example an `onnx-asr` model, as a Wyoming ASR service.
- **[wyoming-ovos-tts](https://github.com/OpenVoiceOS/wyoming-ovos-tts)** exposes any OVOS text-to-speech plugin, such as a phoonnx or piper voice, as a Wyoming TTS service.
- **[wyoming-ovos-wakeword](https://github.com/OpenVoiceOS/wyoming-ovos-wakeword)** exposes any OVOS wake-word plugin as a Wyoming wake service.

Each bridge takes two required arguments: `--plugin-name`, the OVOS plugin to load (the same value you would put under `module` in `mycroft.conf`), and `--uri`, where it listens, either `unix://` or `tcp://host:port`. The plugin reads its own settings (language, model, voice) from `mycroft.conf`, the same file it would read inside a running OVOS instance.

Point Home Assistant at a bridge and the OVOS engine behind it appears as a provider in Assist. Whatever the plugin supports, such as streaming, language selection, or custom models, works through the bridge too, since the bridge does not touch that logic.

---

## Deploying the bridges

The **[ovos-wyoming-docker](https://github.com/OpenVoiceOS/ovos-wyoming-docker)** repository ships a `docker-compose.yml` with ready-made images, so you do not have to assemble a Python environment by hand. Images are published under the `jarbasai/ovos-wyoming-*` namespace:

- **STT:** a Chromium-based recognizer (`jarbasai/ovos-wyoming-chromium`) on host port **10500**, and a server-backed STT image on **10501**.
- **TTS:** a family of voices, each on its own port, including Matxa (10601), Mimic (10603), NOS (10604), and SAM (10605), plus a Google-Translate-backed variant and remote-server variants.
- **Wake word:** a `wakewords` image on host port **10900**.

Inside every container the bridge listens on port 8080. The compose file maps that to the host port shown above, so the services land in the ~10500-10900 range. Each service also mounts your `mycroft.conf`, where you set the plugin's language, model, or voice.

Clone the repository and start a service like any other compose service:

```bash
git clone https://github.com/OpenVoiceOS/ovos-wyoming-docker
cd ovos-wyoming-docker
docker compose up -d wyoming-ovos-tts-sam
```

That publishes the SAM voice bridge on host port 10605. In Home Assistant, go to **Settings → Devices & Services → Add Integration → Wyoming Protocol**, and enter the IP address of the machine running the container, plus the port (for example `10605`). Home Assistant connects and offers it as a TTS, STT, or wake-word provider for your Assist pipelines.

The exact image names and host ports live in the compose file. The pattern is the same for all three bridges: run the container, note the host port, add it in Home Assistant.

To run without Docker, each bridge is a plain Python service. Give it a `--plugin-name` and a `--uri` such as `tcp://0.0.0.0:10605`, and point Home Assistant at that address instead.

---

## Why this matters

Your choice of STT, TTS, or wake word is no longer tied to which assistant you started with. You can run OVOS wake-word detection in front of a Home Assistant pipeline, or a phoonnx voice inside Assist. Every plugin in the OVOS catalog, the full family of STT and TTS engines with their voices and languages, becomes available to Home Assistant users through one integration.

Most of these engines run offline: the bridge and the plugin keep audio on your own hardware and network, and don't send your data anywhere else. The Google-Translate-backed TTS variant is the exception — it calls out to Google, same as any other Google Translate TTS use. Pick an offline voice, such as SAM, Mimic, NOS, or Matxa, if that matters to you.

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
