---
title: "Call OVOS Speech Servers From Any AI Agent"
excerpt: "OVOS STT, TTS, and translation servers now describe themselves over UTCP and mount an MCP endpoint. Any agent that speaks either protocol can discover and call them — no custom client, no wrapper code."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-07-15T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Call OVOS Speech Servers From Any AI Agent

If you want an AI agent to transcribe, speak, or translate through OVOS, you no longer write a client for it. The server describes its own tools; the agent reads that description and calls them.

In plain terms: if you use Claude Desktop, or another AI assistant that supports MCP or UTCP, and you want it to talk to your OVOS speech server directly, this is what makes that possible. Point the assistant at the server and it can transcribe audio, read text aloud, or translate it, without you writing any integration code.

The rest of this post is developer- and integrator-facing: it covers how the servers describe themselves, what each one exposes, and how to call them by hand. If you just want the assistant hookup, the paragraph above is the whole story — add the server to your assistant's config and it works.

OpenVoiceOS runs three small HTTP servers for speech: one for transcription, one for synthesis, one for translation. Each already exposed plain REST endpoints, but pointing an agent at them meant hand-writing a client — reading the docs, hard-coding routes, mapping parameters by hand for every agent runtime. Three pull requests remove that step by teaching the servers to describe themselves in two agent-native protocols, **MCP** (Model Context Protocol) and **UTCP** (Universal Tool Calling Protocol):

- [ovos-stt-server #75](https://github.com/OpenVoiceOS/ovos-stt-server/pull/75)
- [ovos-tts-server #100](https://github.com/OpenVoiceOS/ovos-tts-server/pull/100)
- [ovos-translate-server #16](https://github.com/OpenVoiceOS/ovos-translate-server/pull/16)

## Two Protocols, One Goal

The two protocols make different trade-offs, so each server ships both.

### UTCP — always on, zero deps

Every updated server gains a `GET /utcp` endpoint that returns a UTCP 1.0 JSON document describing every HTTP tool the server already exposes. It pulls in no extra package, so it is always available. The document's `base_url` — the address the manual tells callers to use — is worked out from the incoming request instead of being hard-coded. That means the URLs it advertises stay correct even if the server sits behind a reverse proxy (a middle server that forwards requests to it under a different address).

```bash
# STT server (default port 8080)
curl -s http://localhost:8080/utcp | jq '.tools[].name'
# "stt"  "lang_detect"  "status"

# TTS server (default port 9666)
curl -s http://localhost:9666/utcp | jq '.tools[].name'
# "tts_status"  "tts_synthesize_v2"  "tts_synthesize_legacy"
```

UTCP describes the existing REST surface. An agent that reads the manual calls the same routes a `curl` user would — the protocol is a description layer, not a new server.

### MCP — opt-in, one install

Each server also grows an optional `/mcp` mount, built on FastMCP and served over streamable HTTP with SSE transport, alongside the existing FastAPI app. It carries a single dependency (`mcp>=1.0.0`) gated behind the `[mcp]` extra. Install the extra and the mount appears; leave it out and `create_app()` still builds the normal server — the MCP code degrades gracefully instead of crashing on a missing import.

For STT and translate, `/mcp` mounts automatically once the extra is installed. The TTS server keeps it behind an explicit `--mcp` flag:

```bash
# STT and translate: install the [mcp] extra, /mcp mounts automatically
ovos-stt-http-server --engine ovos-stt-plugin-chromium         # port 8080
ovos-translate-server --engine ovos-lang-detector-plugin-fastlang

# TTS: same, with an explicit opt-in flag
ovos-tts-server --engine ovos-tts-plugin-piper --mcp           # port 9666
```

Add the server to your Claude Desktop config and the assistant can transcribe audio, synthesize speech, or translate text on demand, the same way it calls any other MCP tool.

## What Each Server Exposes

The MCP tool set is smaller than the full HTTP API on purpose: the tools an LLM actually reaches for, not every legacy route.

| Server | UTCP tools | MCP tools |
|---|---|---|
| ovos-stt-server | `stt`, `lang_detect`, `status` | `transcribe` |
| ovos-tts-server | `tts_synthesize_v2`, `tts_synthesize_legacy`, `tts_status` | `synthesize` |
| ovos-translate-server | `ovos_translate.translate`, `ovos_translate.translate_with_source`, `ovos_translate.detect_language`, `ovos_translate.classify_language`, `ovos_translate.supported_languages` | `translate`, `detect_language` |

The STT `transcribe` tool takes **one** of `audio_b64` (base64 raw PCM) or `audio_path` (a file the server can read), plus a BCP-47 `lang` (default `"auto"`) and a `sample_rate` (default `16000`). When `lang="auto"` hits an engine with no audio language detection, the call falls back to the engine's default language instead of erroring — a partial result beats a failed request.

The translate server's MCP tools follow the same pattern: `translate` takes the text and an optional target-language parameter, and `detect_language` takes the text with an optional source-language hint. Both fall back to sensible defaults when the optional parameter is left out, the same way the STT tools do.

## Trying It End-to-End (For Developers)

The rest of this section is for developers wiring up a client. It uses raw HTTP and Python and assumes you're comfortable with both — skip it if you just want the assistant hookup described above.

The STT round-trip from an MCP client:

```python
import asyncio
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

async def main():
    async with streamablehttp_client("http://localhost:8080/mcp") as (r, w, _):
        async with ClientSession(r, w) as s:
            await s.initialize()
            tools = await s.list_tools()
            print([t.name for t in tools.tools])   # ['transcribe']
            res = await s.call_tool("transcribe", {"audio_path": "hello.wav"})
            print(res.content[0].text)              # hello world this is a test
asyncio.run(main())
```

For TTS, the `synthesize` tool returns a base64-encoded WAV artifact (the TTS server defaults to port 9666, translate to 9686).

This path is exercised in CI, not just documented. Each PR adds live-HTTP end-to-end tests that boot the real app with a stub engine, fetch `GET /utcp` and check the advertised URLs, then drive the MCP `initialize → list_tools → call_tool` sequence over streamable HTTP. The STT branch carries a `fix(mcp)` commit for exactly this reason: a live run caught two problems a mocked test would have missed — the mounted sub-app's lifespan was not propagated, and `lang=auto` failed on engines without audio language detection.

## Consuming It From OVOS Itself

The same protocols work in the other direction. [`ovos-tool-adapters`](https://github.com/OpenVoiceOS/ovos-tool-adapters) ships `MCPToolBox` and `UTCPToolBox`, registered as `opm.agents.toolbox` plugins (`ovos-mcp-toolbox`, `ovos-utcp-toolbox`). Name one in a persona's `toolboxes` list and the [OVOS agentic loop](https://github.com/OpenVoiceOS/ovos-agentic-loop) consumes every tool the remote server advertises, with no protocol-specific code in the persona.

Each toolbox keeps one session open per server in a background thread, instead of reconnecting for every single tool call. Each tool's JSON Schema is translated into a Pydantic model at discovery time, so the LLM sees the server's real input schema rather than a generic blob. `MCPToolBox` speaks stdio (subprocess), SSE, and streamable HTTP; `UTCPToolBox` supports whatever transports the installed UTCP version provides. If the `mcp` or `utcp` package is absent, the toolbox returns an empty tool list and logs a warning instead of taking down the loop.

## Why This Matters

The OVOS speech stack is built around the idea that every capability should be a swappable plugin. MCP and UTCP extend that outward: any agent runtime, any orchestrator, any tool-aware assistant can call OVOS speech capabilities without knowing how they are implemented. A HiveMind node, a Claude Desktop session, and a `UTCPToolBox` in an agentic pipeline all see the same typed interface.

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
