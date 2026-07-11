---
title: "Debug Your Assistant from a URL: the OVOS Messagebus Monitor"
excerpt: "ovos-busmon is a single web page that connects to your OVOS messagebus over WebSocket — no install. Or run it as a small FastAPI service. Filter by type, session, or source; export JSONL; inject messages to reproduce bugs."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-09-09T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Debug Your Assistant from a URL

Developing for OVOS has always meant reading logs. The messagebus carries every event the platform processes — utterances, intent matches, skill activations, TTS requests, session state changes, HiveMind traffic — but it all streams past as text in a terminal. Finding the one message you care about in a running system means writing a throwaway listener or grepping through log files after the fact.

[`ovos-busmon`](https://github.com/OpenVoiceOS/ovos-busmon) gives you something better: a live view of the bus in your browser, with filters, JSON inspection, capture export, and — when you need it — message injection.

---

## Two Modes, One UI

The monitor UI is a single static page, and it works two different ways depending on how you open it. It detects which transport to use automatically, so you never configure that by hand.

### Mode 1 — fully in-browser, zero server

Open the page and it opens a WebSocket **straight to the OVOS messagebus** — no backend, nothing to install. By default it connects to `ws://localhost:8181/core`; you can change the host, port, and path in the connection panel or pass them as query parameters:

```
index.html?host=192.168.1.10&port=8181&path=/core
```

Because it is just a static file, it can be hosted on GitHub Pages. That is the point of the title: anyone on a laptop that can reach an OVOS device opens a URL and is watching that device's bus seconds later, with no local setup at all.

One browser caveat worth knowing: Chromium-based browsers allow a `ws://localhost` connection from an `https://` page, because localhost counts as a trustworthy origin. Safari and some Firefox builds block it. If the connection is refused, the UI has a **Download standalone HTML** button — save that file, open it locally as `file://`, and you get identical functionality with no origin restrictions.

### Mode 2 — the FastAPI service

For a monitor that is always on, install the package and run the service:

```bash
pip install ovos-busmon
ovos-busmon
# Listens on http://127.0.0.1:8005 by default
```

Here the connection to the bus happens **server-side**, through `ovos-bus-client`, and the same UI is served over HTTP. Instead of a browser WebSocket, the page pulls events over Server-Sent Events and REST. The service exposes a small, honest API:

| Endpoint | What it does |
|---|---|
| `GET /` | The same static UI (auto-switches to the SSE transport) |
| `GET /api/status` | Health, buffer stats, and which bus it is attached to |
| `GET /api/messages` | Ring-buffer contents, with `?since_id=N&limit=M` paging |
| `GET /api/stream` | SSE live tail |
| `POST /api/send` | Inject a message onto the bus |
| `GET /api/export` | JSONL download of the whole capture buffer |

The service keeps a ring buffer of recent messages (2000 by default), so a client that reconnects — or one you open a minute late — can page back through what it missed via `since_id` rather than starting blind.

---

## Configuration Is Environment Variables

There are no `--host` / `--port` flags to memorise. Everything is set through environment variables (or a `.env` file), which makes the service easy to drop into a container or a systemd unit:

| Variable | Default | Meaning |
|---|---|---|
| `OVOS_BUS_HOST` | `localhost` | Messagebus host to attach to |
| `OVOS_BUS_PORT` | `8181` | Messagebus port |
| `BUSMON_HOST` | `127.0.0.1` | Address the HTTP service binds to |
| `BUSMON_PORT` | `8005` | Port the HTTP service binds to |
| `BUSMON_USERNAME` / `BUSMON_PASSWORD` | `ovos` / `ovos` | HTTP Basic auth |
| `BUFFER_SIZE` | `2000` | Ring-buffer capacity |

A Docker Compose file ships with the repo. It binds the service to `127.0.0.1:8005` only and sets `OVOS_BUS_HOST=host.docker.internal` so the container can still reach a bus running on the host.

---

## Filtering the Firehose

Whichever mode you use, the interface is the same, and it is built for cutting a busy bus down to the events that matter:

- **Message type**, with glob patterns — `recognizer_loop:*` to watch the input side, `ovos.*` for the namespaced events, or an exact type like `speak`.
- **Full-text search** across type, data, context, and session — match any string anywhere in the payload.
- **Session ID, source, and destination** — isolate one conversation or one skill.
- **Sort** newest-first or oldest-first, and **pause/resume** capture when you want to freeze the view and read.

Each message expands into syntax-highlighted JSON, so you inspect the full payload without leaving the page. When you have the events you want, export the capture as JSONL or JSON — client-side from the buffer, or via `/api/export` in service mode — to attach to a bug report or replay later.

---

## It Can Talk Back

The monitor is not read-only. The **Inject** panel — backed by `POST /api/send` — puts an arbitrary message onto the bus: pick a type, write a JSON payload, send. This is the feature that turns the tool from a viewer into a workbench. You can reproduce a skill's behaviour by emitting the exact message that triggers it, instead of staging the whole voice pipeline to get there. Debugging an intent handler no longer requires speaking to your assistant on a loop.

That power is exactly why the injection surface is meant for **local, personal administration only**. The service binds to `127.0.0.1` by default, HTTP Basic auth guards the endpoint, and the guidance is blunt: keep the localhost binding, add TLS if you ever move it, and never expose the injection endpoint to an untrusted network. Anyone who can reach it can emit any message on your bus.

---

## HiveMind-Ready

Because you can filter on source and destination, the monitor maps cleanly onto how HiveMind routes traffic. Satellites, relays, and the central node all tag their messages with routing context, so you can follow a single utterance from a satellite, through a relay, to the core and back — without stitching together log files from several machines by hand.

---

`ovos-busmon` is a developer and diagnostics tool, and it stays in that lane: it logs nothing to disk beyond what you explicitly export. Zero-server for a quick look, a proper service for a permanent one, and an inject panel for when watching is not enough. It is the observability layer the OVOS developer experience has been missing.

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
