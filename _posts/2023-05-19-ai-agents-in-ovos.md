---
title: "AI Agents in OpenVoiceOS: Intelligent Conversations, Modular Architecture, and Custom Personas"
excerpt: "Explore how OpenVoiceOS uses a modular AI agent system—featuring solvers, personas, and transformers—for flexible, private, and smart voice-first experiences."
coverImage: "https://haieng.com/wp-content/uploads/2017/10/test-image-500x500.jpg"
date: "2025-04-19T00:00:00.000Z"
author:
  name: Peter Steenbergen
  picture: "https://avatars.githubusercontent.com/u/641281"
ogImage:
  url: "/assets/blog/common/cover.png"
---

OpenVoiceOS (OVOS) introduces a flexible and modular system for integrating AI agents into voice-first environments. This is made possible through a layered architecture built around solvers, personas, and persona routing components. This section explains how these parts work together to enable intelligent conversations with customizable behavior.

## 🧠 Solver Plugins (Low-Level AI)

At the core of the AI agent system are solver plugins. These are simple black-box components responsible for handling a single task: receiving a text input (typically a question) and returning a text output (typically an answer).

**Key Features:**

- **Input/Output:** Plain text in, plain text out.  
- **Functionality:** Usually question-answering, though more specialized solvers exist (e.g., summarization, multiple choice).  
- **Language Adaptation:** Solvers are automatically wrapped with a translation layer if they don't support the user's language.  
- **Fallback Behavior:** If a solver returns `None`, higher-level systems will attempt fallback options.

## 👤 Personas (Agent Definition Layer)

A persona represents a higher-level abstraction over solver plugins. It behaves like an AI agent with a defined personality and behavior, built by combining one or more solvers in a specific order.

**Key Features:**

- **Composition:** Each persona consists of a name, a list of solver plugins, and optional configuration.  
- **Chained Execution:** Solvers are tried one-by-one until a response is generated.  
- **Customizable Behavior:** Different personas can emulate different personalities or knowledge domains.

> Personas don't need to use LLMs—no beefy GPU required. Any solver plugin can define a persona.

```json
{
  "name": "OldSchoolBot",
  "solvers": [
    "ovos-solver-wikipedia-plugin",
    "ovos-solver-ddg-plugin",
    "ovos-solver-plugin-wolfram-alpha",
    "ovos-solver-wordnet-plugin",
    "ovos-solver-rivescript-plugin",
    "ovos-solver-failure-plugin"
  ],
  "ovos-solver-plugin-wolfram-alpha": {
    "appid": "Y7353-XXX"
  }
}
```

## 🦙 Persona Server (LLM-Compatible Endpoint)

The `persona-server` exposes any defined persona as an OpenAI- or Ollama-compatible API, making personas drop-in replacements for LLMs.

**Use Cases:**

* Integrate OVOS personas with OpenAI/Ollama-compatible tools.
* Plug into OpenWebUI for a chat interface.
* Use with HomeAssistant for smart home interactions.

**Usage:**

```bash
$ ovos-persona-server --persona my_persona.json
```

## 🔁 Persona Pipeline (Runtime Routing in OVOS-Core)

Inside OVOS-Core, the `persona-pipeline` plugin handles interaction logic for AI agents.

**Key Features:**

* **Persona Registry:** Multiple personas defined or discovered.
* **Session Control:** "I want to talk with {persona\_name}" to switch.
* **Session End:** Stop persona use anytime.
* **Fallback Handling:** Use a default persona on failure.
* **Extensible:** Future system-level enhancements via messagebus.

```json
{
  "intents": {
    "persona": {
      "handle_fallback": true,
      "default_persona": "Remote Llama"
    },
    "pipeline": [
      "stop_high",
      "converse",
      "ocp_high",
      "padatious_high",
      "adapt_high",
      "ovos-persona-pipeline-plugin-high",
      "ocp_medium",
      "...",
      "fallback_medium",
      "ovos-persona-pipeline-plugin-low",
      "fallback_low"
    ]
  }
}
```

## 🤝 Collaborative Agents via MoS (Mixture of Solvers)

One of OVOS’s most advanced features is its ability to use **MoS** strategies to combine multiple solvers for smarter answers.

**Flexible Plugin Design:** MoS strategies are just solver plugins and can be composed or nested.

**How It Works:**

* Delegates a query to several solvers.
* Uses strategies like voting, reranking, or generation to determine the final response.

**Examples:**

* **The King:** Central reranker selects the best answer.
* **Democracy:** Solvers vote for the most agreed response.
* **Duopoly:** Two LLMs discuss answers, then a president chooses.

> 🌀 MoS strategies can be recursive for deep collaboration trees.

## 🔌 Bonus: OVOS as a Solver Plugin

You can expose `ovos-core` itself as a solver plugin to allow OVOS to act as an agent in other local apps.

**Use Cases:**

* Chain OVOS instances via Docker.
* Use skills in a collaborative AI/MoS setup.
* Do **not** use `ovos-bus-solver-plugin` inside a local persona (infinite loop risk!).

```json
{
  "name": "Open Voice OS",
  "solvers": [
    "ovos-solver-bus-plugin",
    "ovos-solver-failure-plugin"
  ],
  "ovos-solver-bus-plugin": {
    "autoconnect": true,
    "host": "127.0.0.1",
    "port": 8181
  }
}
```

## 🔧 Transformer Plugins (Runtime Modifiers)

Transformers operate independently from personas but can complement them. They modify OVOS’s internal pipeline.

**Scope:** Transformers work in OVOS Core, not within personas (unless called internally).

**Integration Points:**

* **Utterance Transformers:** Between STT and NLP.
* **Dialog Transformers:** Between NLP and TTS.

### ✅ OVOS Transcription Validator

Validates STT output using LLMs before passing to NLP.

```json
"utterance_transformers": {
  "ovos-transcription-validator-plugin": {
    "model": "gemma3:1b",
    "ollama_url": "http://192.168.1.200:11434",
    "prompt_template": "/path/to/template.txt",
    "error_sound": true,
    "mode": "reprompt"
  }
}
```

> Prevents triggering skills from garbage STT like: “Potato stop green light now yes.”

### 🗣️ Dialog Transformer

Rewrites final responses using prompts.

**Prompt Use Cases:**

* "Explain it to a 5-year-old"
* "Sound like an angry old man"
* "Add more 'dude'ness"

```json
"dialog_transformers": {
  "ovos-dialog-transformer-openai-plugin": {
    "rewrite_prompt": "rewrite the text as if you were explaining it to a 5-year-old"
  }
}
```

## 🧩 Summary Table

| Component                   | Role                                                          |
| --------------------------- | ------------------------------------------------------------- |
| **Solver Plugin**           | Stateless text-to-text inference (e.g., Q\&A, summarization). |
| **Persona**                 | Named agent composed of ordered solver plugins.               |
| **Persona Pipeline**        | Handles persona activation/routing in OVOS core.              |
| **Transformer Plugins**     | Modify utterances or responses in the pipeline.               |
| **Dialog Transformer**      | Rewrites assistant replies based on tone/intent.              |
| **Transcription Validator** | Filters invalid transcriptions before skills/NLP.             |

---

By decoupling solvers, personas, and management layers, OpenVoiceOS empowers developers and users with highly customizable AI experiences—adaptable to voice or text across any platform.