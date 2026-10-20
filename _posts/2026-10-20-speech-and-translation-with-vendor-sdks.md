---
title: "Use OVOS Speech and Translation with the OpenAI, ElevenLabs and DeepL SDKs"
excerpt: "The OVOS speech and translation servers answer the APIs of OpenAI, ElevenLabs, Amazon, DeepL and others. Code written for those SDKs speaks, listens and translates with your own plugins after one URL change. Here is what we ran, and what does not work yet."
coverImage: "/assets/blog/protocol_interoperability/thumb.png"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAI
  picture: "https://avatars.githubusercontent.com/u/33701864"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/protocol_interoperability/thumb.png"
---

## Use OVOS Speech and Translation with the OpenAI, ElevenLabs and DeepL SDKs

[`ovos-tts-server`](https://github.com/OpenVoiceOS/ovos-tts-server), [`ovos-stt-http-server`](https://github.com/OpenVoiceOS/ovos-stt-server) and [`ovos-translate-server`](https://github.com/OpenVoiceOS/ovos-translate-server) each run one OVOS plugin and answer the HTTP APIs of several cloud vendors. Code written for the vendor SDK changes one URL and gets its speech, transcript or translation from your machine.

You may have an app built on the OpenAI or ElevenLabs SDK, a script that calls DeepL, or a device that speaks MaryTTS. The vendor API is the contract that code already follows. The servers keep that contract and swap what is behind it. Each vendor has its own URL prefix, so all of them answer at the same time. The servers accept any API key and ignore it, so put a reverse proxy in front for authentication.

Every output below is copied from a run of the official SDK against the latest alpha of each server.

## Speech out

We ran `ovos-tts-server` 1.15.3a1 with `ovos-tts-plugin-espeakng`:

```bash
uv pip install --prerelease=allow 'ovos-tts-server[audio]' ovos-tts-plugin-espeakng
ovos-tts-server --engine ovos-tts-plugin-espeakng
```

```python
from openai import OpenAI

client = OpenAI(api_key="unused", base_url="http://localhost:9666/openai/v1")
audio = client.audio.speech.create(model="tts-1", voice="alloy",
                                   input="Hello from OVOS.", response_format="wav")
open("hello.wav", "wb").write(audio.content)
```

```text
WAV 22050 Hz, 1 ch, 1.28 s
```

The default `mp3` format and the streaming response work too. The `elevenlabs` SDK 2.73.1 listed the voice `default` and returned 1.99 s of MP3 with `base_url="http://localhost:9666/elevenlabs"`. `boto3` Polly returned 1.64 s of MP3 with `endpoint_url="http://localhost:9666/amazon-polly"`.

## Speech in

We ran `ovos-stt-http-server` 0.28.0a1 with `ovos-stt-plugin-vosk` and a 16 kHz WAV clip of "turn on the kitchen light":

```python
client = OpenAI(api_key="unused", base_url="http://localhost:8080/openai/v1")
with open("kitchen.wav", "rb") as f:
    print(client.audio.transcriptions.create(model="whisper-1", file=f).text)
```

```text
turn on the kitchen light
```

The `groq`, `elevenlabs` (Scribe), `ibm-watson` and `assemblyai` SDKs returned the same transcript from their own prefixes.

## Translation

We ran `ovos-translate-server` 0.11.3a4 with `ovos-google-translate-plugin`. The DeepL SDK needs a trailing slash on `server_url`. It joins its paths with `urllib.parse.urljoin`, which drops the last path segment when the slash is missing.

```python
import deepl

translator = deepl.Translator("unused:fx", server_url="http://localhost:9686/deepl/")
print(translator.translate_text("good morning", target_lang="PT-PT").text)
print(translator.translate_text("good morning", source_lang="EN", target_lang="DE").text)
```

```text
bom dia
Guten Morgen
```

`boto3` Amazon Translate, `libretranslatepy`, `azure-ai-translation-text` and the `google-cloud-translate` v2 client returned the same translations.

## Limits

The runs found gaps, and some have fixes in review:

- The MaryTTS route does not work with the released `ovos-tts-plugin-marytts`. The plugin refuses `en-US`, and the server lists languages in a form that MaryTTS clients do not send. Fixes are in review in [ovos-tts-plugin-marytts#43](https://github.com/OpenVoiceOS/ovos-tts-plugin-marytts/pull/43) and [ovos-tts-server#169](https://github.com/OpenVoiceOS/ovos-tts-server/pull/169). With both, the plugin spoke `en-US`, `en-GB` and `de-DE` through the server.
- The STT routes read WAV. FLAC and MP3 uploads to the OpenAI route give an empty transcript, and `verbose_json` reports a wrong `duration`. Fixes are in review in [ovos-stt-server#141](https://github.com/OpenVoiceOS/ovos-stt-server/pull/141) and [ovos-stt-server#142](https://github.com/OpenVoiceOS/ovos-stt-server/pull/142).
- The Deepgram route reads the WAV header as audio, so its transcript starts with noise.
- The `elevenlabs` SDK 3 lists voices with `GET /v2/voices`, which the TTS server does not serve. SDK 2 works.
- Language detection needs a detection plugin (`--detect-engine`). Without one, the detect calls fail or answer `und`.
- The vendor model names and voice names are accepted and ignored. Quality, speed and languages come from the OVOS plugin.

The full status tables and a recipe for each vendor are in the `docs/api-compatibility.md` page of each repository. Report problems on the issue tracker of [the TTS server](https://github.com/OpenVoiceOS/ovos-tts-server/issues), [the STT server](https://github.com/OpenVoiceOS/ovos-stt-server/issues) or [the translate server](https://github.com/OpenVoiceOS/ovos-translate-server/issues).

---

### Built in the Open, Funded for the Commons

This work is part of the OpenVoiceOS **From Beta to Breakthrough** milestone, funded through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of [DG Communications Networks, Content and Technology](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en) under grant agreement No [101135429](https://cordis.europa.eu/project/id/101135429). Additional funding is made available by the [Swiss State Secretariat for Education, Research and Innovation](https://www.sbfi.admin.ch/sbfi/en/home.html) (SERI).

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
