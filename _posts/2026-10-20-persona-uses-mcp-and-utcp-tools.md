---
title: "Your OVOS Persona Uses Any MCP or UTCP Tool"
excerpt: "An OVOS persona can call the tools of any MCP server or UTCP manual while it answers. The model asks for the tool, OVOS runs it, and the tool's value goes into the answer."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-20T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## Your OVOS Persona Uses Any MCP or UTCP Tool

You ask your assistant: "What time is it in Tokyo? Also translate 'have a safe trip' into Portuguese." A language model alone guesses the time. With tools, it asks a clock and a translator, and it answers with their values.

This post shows an OVOS persona that does this. The clock is the reference MCP time server. The translator is [ovos-translate-server](https://github.com/OpenVoiceOS/ovos-translate-server), through its UTCP manual. Neither one needs code written for OVOS.

## The parts

- [ovos-agentic-loop](https://github.com/OpenVoiceOS/ovos-agentic-loop) runs the model in a loop with tools. The `ovos-native-toolcall-loop` handler uses the model's own tool calls.
- [ovos-tool-adapters](https://github.com/OpenVoiceOS/ovos-tool-adapters) turns an MCP server into the toolbox `ovos-mcp-toolbox`, and a UTCP manual into `ovos-utcp-toolbox`.
- [ovos-persona-server](https://github.com/OpenVoiceOS/ovos-persona-server) serves the persona over an OpenAI-compatible chat API.

The brain must be a model that returns OpenAI tool calls. This example runs Qwen2.5 3B Instruct on a local [llama.cpp](https://github.com/ggml-org/llama.cpp) server. The `--jinja` option turns on tool calls:

```bash
llama-server -m qwen2.5-3b-instruct-q4_k_m.gguf --jinja --port 8090
```

## Install and start

```bash
uv pip install --prerelease=allow ovos-persona-server ovos-agentic-loop \
    'ovos-tool-adapters[mcp,utcp]' ovos-openai-plugin \
    ovos-translate-server ovos-google-translate-plugin
ovos-translate-server --tx-engine ovos-google-translate-plugin --port 9687
```

The persona file, `travel.json`, names the brain and both toolboxes. Each toolbox reads the section with its own name, inside the loop's section. `uvx` starts the time server as a process:

```json
{
  "name": "travel-helper",
  "handlers": ["ovos-native-toolcall-loop"],
  "ovos-native-toolcall-loop": {
    "brain": "ovos-chat-openai-plugin",
    "ovos-chat-openai-plugin": {"api_url": "http://127.0.0.1:8090/v1", "key": "none", "model": "qwen2.5-3b-instruct"},
    "toolboxes": ["ovos-mcp-toolbox", "ovos-utcp-toolbox"],
    "ovos-mcp-toolbox": {"transport": "stdio", "command": "uvx", "args": ["mcp-server-time"], "timeout": 60},
    "ovos-utcp-toolbox": {
      "utcp_config": {"manual_call_templates": [
        {"name": "ovos_translate", "call_template_type": "http", "url": "http://127.0.0.1:9687/utcp", "http_method": "GET"}
      ]},
      "timeout": 30
    }
  }
}
```

```bash
ovos-persona-server --persona travel.json --port 8338
```

## Ask

```bash
curl -s http://127.0.0.1:8338/openai/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model": "travel-helper", "messages": [{"role": "user", "content": "What time is it in Tokyo? Also translate \"have a safe trip\" into Portuguese."}]}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"
```

```text
The current time in Tokyo is 12:40 PM on Tuesday, and it is not DST (Daylight Saving Time).

The translation of "have a safe trip" into Portuguese is "tenha uma viagem segura".
```

The request ran at 03:40 UTC, which is 12:40 in Tokyo. The translate server's log shows the call that the UTCP toolbox made:

```text
"GET /translate/auto/pt-br/have%20a%20safe%20trip HTTP/1.1" 200 OK
```

## Use your own tools

Any MCP server works the same way. Use `"transport": "stdio"` with a command, or `"transport": "http"` with a `url`. Any UTCP manual works through `manual_call_templates`. The OVOS speech servers and ovos-persona-server publish UTCP manuals at `/utcp`, so one OVOS box can use the tools of another. A persona can also list OVOS tool plugins next to these toolboxes.

## Limits

- The model must return OpenAI tool calls. Some hosted gateways return no tool calls, whatever the request. With such a gateway, the model answers from memory and no tool runs.
- The UTCP toolbox renames tools so that a model accepts the name. `ovos_translate.translate` becomes `ovos_translate_translate`.
- The persona runs every tool call itself, with the rights of its process. The `stdio` transport starts the command that the persona file names. Load persona files only from people you trust.
- The model chooses the arguments. Asked for "Portuguese", this model chose `pt-br`, not `pt-pt`. Name the variant in the question when it matters.

## Report issues

Open an issue on [ovos-agentic-loop](https://github.com/OpenVoiceOS/ovos-agentic-loop/issues) for the loop, or on [ovos-tool-adapters](https://github.com/OpenVoiceOS/ovos-tool-adapters/issues) for the MCP and UTCP toolboxes.

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
