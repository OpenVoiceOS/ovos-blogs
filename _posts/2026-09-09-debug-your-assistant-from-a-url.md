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

This post is for people who run or build OVOS and want to watch what it's doing internally. If that's not you, the short version: OVOS now has a browser-based debugger for its internal event stream.

The OVOS messagebus carries every event the platform processes: utterances, intent matches, skill activations, TTS requests, session state. Today that stream mostly goes to a terminal as scrolling text. Finding one message in a running system means writing a throwaway listener or grepping log files after the fact.

[`ovos-busmon`](https://github.com/OpenVoiceOS/ovos-busmon) puts the bus in your browser instead: filters, JSON inspection, capture export, and message injection when you need to force a bug to reproduce. Try it live at [openvoiceos.github.io/ovos-busmon](https://openvoiceos.github.io/ovos-busmon/) — no install, no server.

---

## Two Ways to Connect

The monitor is a single static page. It detects which transport to use automatically, so you never configure that by hand.

### Zero-server: open the page

Open [openvoiceos.github.io/ovos-busmon](https://openvoiceos.github.io/ovos-busmon/) and it connects to `ws://localhost:8181/core` by default. Set host, port, and path in the connection panel, or as query parameters, to point it at any reachable OVOS device:

```
https://openvoiceos.github.io/ovos-busmon/?host=192.168.1.10&port=8181&path=/core
```

No backend, nothing to install. It is a static page, so it's also on GitHub Pages: anyone on a laptop that can reach an OVOS device opens that URL and watches the device's bus within seconds.

One browser caveat: Chromium-based browsers allow a `ws://localhost` connection from an `https://` page, because localhost counts as a trustworthy origin. Safari and some Firefox builds block it. If the connection is refused, use the **Download standalone HTML** button. Save the file and open it as `file://`; it works with no origin restrictions.

### Always-on: run the FastAPI service

For a monitor that stays up, install the package and run it:

```bash
pip install ovos-busmon
ovos-busmon
# Listens on http://127.0.0.1:8005 by default
```

Here the connection to the bus happens server-side, through `ovos-bus-client`, and the same UI is served over HTTP. The page pulls events over Server-Sent Events and REST instead of a browser WebSocket. The API is small:

| Endpoint | What it does |
|---|---|
| `GET /` | The same static UI (auto-switches to the SSE transport) |
| `GET /api/status` | Health, buffer stats, and which bus it is attached to |
| `GET /api/messages` | Ring-buffer contents, with `?since_id=N&limit=M` paging |
| `GET /api/stream` | SSE live tail |
| `POST /api/send` | Inject a message onto the bus |
| `GET /api/export` | JSONL download of the whole capture buffer |

The service keeps a ring buffer (a fixed-size queue that overwrites its oldest entries once full) of recent messages, 2000 by default. A client that reconnects, or one you open a minute late, pages back through what it missed via `since_id` instead of starting blind.

Configuration is environment variables, or a `.env` file. There are no flags to memorize, and it's easy to drop into a container or systemd unit:

| Variable | Default | Meaning |
|---|---|---|
| `OVOS_BUS_HOST` | `localhost` | Messagebus host to attach to |
| `OVOS_BUS_PORT` | `8181` | Messagebus port |
| `BUSMON_HOST` | `127.0.0.1` | Address the HTTP service binds to |
| `BUSMON_PORT` | `8005` | Port the HTTP service binds to |
| `BUSMON_USERNAME` / `BUSMON_PASSWORD` | `ovos` / `ovos` | HTTP Basic auth |
| `BUFFER_SIZE` | `2000` | Ring-buffer capacity |

A Docker Compose file ships with the repo. It binds the service to `127.0.0.1:8005` only and sets `OVOS_BUS_HOST=host.docker.internal` so the container can still reach a bus running on the host.

`BUSMON_USERNAME` and `BUSMON_PASSWORD` default to `ovos` / `ovos`. Set both to something else before you run the service unattended. Otherwise, anyone who can reach the port logs in with a password taken straight from the docs.

---

## Filtering the Firehose

Both modes share the same interface, built for cutting a busy bus down to what matters:

- **Message type**, with glob patterns (wildcard matching, e.g. `recognizer_loop:*` for the input side, `ovos.*` for namespaced events, or an exact type like `speak`).
- **Full-text search** across type, data, context, and session.
- **Session ID, source, and destination** — isolate one conversation or one skill.
- **Sort** newest-first or oldest-first, and **pause/resume** capture to freeze the view and read.

Each message expands into syntax-highlighted JSON, so you can inspect the full payload without leaving the page. Export what you find as JSONL or JSON, client-side from the buffer or via `/api/export` in service mode, to attach to a bug report or replay later.

---

## Injecting Messages

The **Inject** panel, backed by `POST /api/send`, puts an arbitrary message onto the bus: pick a type, write a JSON payload, send. You can reproduce a skill's behavior by emitting the exact message that triggers it, instead of staging the whole voice pipeline to trigger one intent handler.

That power is why injection is meant for local, personal administration only, even when you run it as an always-on service. Keep the default `127.0.0.1` binding, change `BUSMON_USERNAME` and `BUSMON_PASSWORD` from their `ovos` / `ovos` defaults, add TLS if you move it off localhost, and never expose the injection endpoint to an untrusted network. Anyone who can reach it can log in and emit any message on your bus.

---

`ovos-busmon` logs nothing to disk beyond what you explicitly export. Zero-server for a quick look, the FastAPI service for a permanent one, and an inject panel for when watching is not enough.

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
