---
title: "Three Public Servers for OVOS: Speech, Voice and Translation"
excerpt: "TigreGótico hosts three open endpoints in Portugal — onnx-asr for speech to text, phoonnx for text to speech, and linguonnx for translation and language ID — so you can try OVOS, or run it on a Raspberry Pi, without loading a single model locally."
coverImage: "/assets/blog/common/cover.png"
date: "2026-08-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/common/cover.png"
---

# Three Public Servers for OVOS: Speech, Voice and Translation

[TigreGótico Lda](https://tigregotico.pt) hosts three public endpoints for the
OpenVoiceOS community, in Portugal:

| service | endpoint | engine |
|---|---|---|
| Speech to text | `https://stt.openvoiceos.pt` | [onnx-asr](https://github.com/TigreGotico/onnx-asr) |
| Text to speech | `https://tts.openvoiceos.pt` | [phoonnx](https://github.com/TigreGotico/phoonnx) |
| Translation and language ID | `https://translate.openvoiceos.pt` | [linguonnx](https://github.com/TigreGotico/linguonnx) |

Point an OVOS device at them and it speaks, listens and translates without
downloading a model. That is the whole idea: a Raspberry Pi or a similar low-power
board offloads the heavy part over HTTP and keeps its CPU for everything else.

Live uptime and response times are on the
[status page](https://tigregotico.github.io/public-servers/).

## Read this before you rely on them

These servers are a **best-effort community service, offered with no warranty of
any kind**. Please read this part:

- There is no uptime guarantee and no SLA.
- There is no support commitment. Nobody is on call for them.
- They can change, move or disappear, without notice.
- They are **not for production use**. Do not put a product, a customer or an
  automation you care about behind them.
- If you depend on any of this, run your own instance. Every piece is open source
  and installable, and the servers exist so that you can decide whether the stack
  is worth self-hosting.

They are here to be tried, demoed, and used on small hardware by people who accept
that the endpoint may be gone tomorrow.

## What each one is

**onnx-asr** is a lightweight ASR package that runs modern speech recognition
models on `onnxruntime`, with no PyTorch, no Transformers and no FFmpeg. The
public endpoint chooses a model per language, so a client passes audio and a `lang`
and gets back a transcript.

**phoonnx** does multilingual phonemization and text to speech over ONNX voices,
reaching more than a thousand languages and voices across its bundled voice
indexes. The endpoint holds one default voice per supported language, and
`phoonnx.openvoiceos.pt` takes a voice name per request when you want a specific
one.

**linguonnx** does machine translation and text-side language identification on
the CPU, again through `onnxruntime` and without torch. Its registry reaches 586
routable languages, and when no single model covers a pair it chains small models
through a pivot language. On the configuration this server runs, Portuguese to
Basque goes through Galician, over two Marian models of 84 MB and 153 MB. The
route depends on the limits the caller sets — a different size budget or hop
preference can send the same pair through a different language, or through one
large multilingual model in a single hop — and the translator reports which
models and pivots it used. The full story is in the original announcement on the
TigreGótico site:
[linguonnx: Offline Translation and Language ID on ONNX](https://tigregotico.pt/blog/2026-08-10-linguonnx-offline-translation-and-language-id).

## Pointing OVOS at them

```json
{
  "stt": {
    "module": "ovos-stt-plugin-server",
    "ovos-stt-plugin-server": {"url": "https://stt.openvoiceos.pt/stt"}
  },
  "tts": {
    "module": "ovos-tts-plugin-server",
    "ovos-tts-plugin-server": {"host": "https://tts.openvoiceos.pt"}
  },
  "language": {
    "detection_module": "ovos-lang-detector-plugin-server",
    "translation_module": "ovos-translate-plugin-server",
    "ovos-lang-detector-plugin-server": {"host": "https://translate.openvoiceos.pt"},
    "ovos-translate-plugin-server": {"host": "https://translate.openvoiceos.pt"}
  }
}
```

The client plugins are thin HTTP wrappers. They hold no model and no engine, so a
device that uses them installs almost nothing.

## What to expect, honestly

**Warm requests are quick. Cold ones in rare languages are not.** A model that is
already loaded answers fast. A language served only by a large multilingual model
has to load that model first, and the largest one in the linguonnx registry is
4.9 GB. That first request can take minutes. Ask again and it is fast, until the
model is evicted to make room for another.

**Routable is not the same as usable.** 586 languages route somewhere, and a few
of them route to a model that answers in the wrong language: MADLAD covers
Chuvash, and asked for Chuvash it replies in Russian. The registry records that
per language, and the servers inherit it. Treat the tail as something to test
before you trust it, not as a supported language list.

**Shared machines are shared.** These endpoints have no per-user quota and no
queue guarantees. Somebody else's cold 4.9 GB load is your slow request.

## Run your own

Every service here is a package you can install:

- [`onnx-asr`](https://github.com/TigreGotico/onnx-asr) behind
  [`ovos-stt-http-server`](https://github.com/OpenVoiceOS/ovos-stt-http-server)
- [`phoonnx`](https://github.com/TigreGotico/phoonnx) behind
  [`ovos-tts-server`](https://github.com/OpenVoiceOS/ovos-tts-server)
- [`ovos-plugin-linguonnx`](https://github.com/OpenVoiceOS/ovos-plugin-linguonnx)
  behind [`ovos-translate-server`](https://github.com/OpenVoiceOS/ovos-translate-server),
  which turns any OVOS language plugin into a micro service

The same client configuration above works against your own host: change the URLs.
That is the point of the public trio — try the stack cheaply, then own it.

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
