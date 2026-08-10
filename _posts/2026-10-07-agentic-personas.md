---
title: "One Agentic Plugin Became Eight: ovos-persona Learns to Reason and Use Tools"
excerpt: "The MoU asked for one agentic plugin. We shipped eight reasoning-loop architectures, six built-in toolboxes, and MCP/UTCP tool discovery — turning personas from single-shot LLM calls into local, private agents."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-07T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## One Agentic Plugin Became Eight

An OVOS persona used to be a single-shot thing: your words went to an LLM, the LLM answered, and that was the whole exchange. No looking things up, no multi-step reasoning, no calling a tool and returning with a real answer.

That changes now. Your assistant can look things up, do multi-step tasks, and use tools before it answers you. Under the hood, it registers as an `opm.agents.chat` plugin — an OVOS building block for `ovos-persona` — but what matters to you is simpler: ask something that needs a calculation, a search, or several steps, and the assistant can now go get the pieces instead of guessing.

The **"Consume UTCP/MCP/A2A → agentic plugin"** deliverable is complete, and it shipped more than the one plugin the MoU asked for: **eight** distinct reasoning-loop architectures and **six built-in toolboxes**, all as standard OPM plugins for `ovos-persona`.

## Eight ways to think

The core work lives in [**ovos-agentic-loop**](https://github.com/OpenVoiceOS/ovos-agentic-loop). A "loop" wraps an LLM and a set of tools and decides *how* the model reasons from your question to an answer. Each one implements a published agent pattern and registers as an `opm.agents.chat` plugin, so a persona config just names the one it wants. In plain terms: each loop below is a different strategy for turning your question into an answer, trading speed against thoroughness.

- **ReAct** (`ovos-react-loop`, short for Reason+Act) — interleaves reasoning and acting. In plain terms: it thinks a step, calls one tool, reads the result, then thinks again, repeating until it has an answer. Each iteration the LLM emits a *Thought → Action → Observation* triplet, ending when it emits `FINAL_ANSWER:`. It costs one LLM call per step, but it cannot backtrack if an early tool call was wrong.
- **Plan-and-Execute** (`ovos-plan-execute-loop`) — a planner LLM first writes a numbered list of 3–7 sub-tasks. In plain terms: it makes a to-do list before doing anything, then works through the list. Each step runs through its own mini-ReAct sub-loop, and a final call turns the collected results into the answer. The plan is visible up front, but this costs more LLM calls. It works best when a task needs more than about three tool calls, a point where plain ReAct starts to forget earlier observations.
- **Reflexion** (`ovos-reflexion-loop`) — wraps ReAct in an outer *episode* loop. In plain terms: it tries an answer, checks its own work, and tries again if it wasn't good enough. After each attempt the model evaluates its own answer. If the answer falls short, the model writes a short critique and carries it into the next attempt. It stops when it judges the answer `SATISFACTORY`, or after `max_reflections` (default 3) attempts.
- **Self-Ask** (`ovos-self-ask-loop`) — decomposes a multi-hop question into a chain of simpler follow-up questions. In plain terms: it breaks a hard question into smaller questions and answers them one at a time, typically using a single search tool. Its format is simpler than ReAct's — a plain `query → result` — so smaller LLMs follow it more reliably. It also works with no tools at all, as a pure question-breaker.
- **Chain-of-Thought** (`ovos-chain-of-thought-loop`) — a single LLM call that reasons step by step before committing to a `FINAL ANSWER:`. In plain terms: it thinks out loud once, with no tool calls and no back-and-forth, so it is the fastest and cheapest of the eight. It suits arithmetic, logic puzzles, and multi-step instructions that need no outside information. It is more prone to hallucination on factual questions, since it never checks anything.
- **CRITIC** (`ovos-critic-loop`) — *draft → critique → revise*. In plain terms: it writes a first answer, then fact-checks its own claims and only fixes the ones that were wrong. The model drafts an answer, a second call flags the verifiable claims in it, and each flagged claim is checked with a tool. Only the incorrect facts are rewritten; the rest of the answer stays as written. This is cheaper than Reflexion for factual corrections, since it never redoes the whole task. With no tools registered, it falls back to a plain draft.
- **Tree-of-Thoughts** (`ovos-tree-of-thoughts-loop`) — beam search over reasoning paths. In plain terms: it explores several possible next steps at once, scores them, and keeps only the most promising ones before going further. At each depth it generates several candidate steps, scores each with an evaluator LLM call, and keeps only the top `beam_width` branches for the next level. It can abandon a dead-end branch before committing to it, at the cost of the most LLM calls of any loop here. It suits problems with several competing strategies.
- **Native Tool-Call** (`ovos-native-toolcall-loop`) — uses the LLM provider's own function-calling feature instead of parsing text for actions. In plain terms: if your LLM already knows how to call tools natively, this loop lets it do that directly, which is more reliable than text-parsing. If the configured LLM does not support native tool calls, it falls back to the ReAct text loop automatically, so it works with any brain.

Different problems want different strategies. Because these are all swappable plugins behind one interface, you change strategy by editing config, not code. They also compose: Reflexion wraps ReAct internally, and Plan-and-Execute uses a mini-ReAct per step.

## Tools, discovered automatically

A reasoning loop is only as good as the tools it can reach. `ovos-agentic-loop` ships six built-in toolboxes as `opm.agents.toolbox` plugins: `ovos-math-tools` (calculator, unit conversion, statistics, equation solving), `ovos-clock-tools`, `ovos-web-search-tools`, `ovos-filesystem-tools`, `ovos-shell-tools`, and `ovos-skill-md-toolbox`, which turns any installed `SKILL.md` file into an agent tool. The security defaults are conservative: the shell toolbox is disabled unless you set `allow_shell: true`, the filesystem toolbox can be pinned to a subtree via `root_path`, and the math toolbox parses expressions with an `ast` allowlist rather than calling `eval()`.

For everything else, [**ovos-tool-adapters**](https://github.com/OpenVoiceOS/ovos-tool-adapters) bridges external tool servers into the same interface. It ships two toolboxes — `ovos-mcp-toolbox` (Model Context Protocol) and `ovos-utcp-toolbox` (Universal Tool Calling Protocol) — that connect to an external server, discover every tool it exposes, and forward the server's real JSON Schema to the LLM so the model sees the actual input shape. MCP supports stdio, SSE, and streamable-HTTP transports; UTCP supports whatever the installed UTCP version does (HTTP, SSE, CLI, WebSocket, and more). A daemon-thread event loop keeps sessions alive between calls, and a missing `mcp` or `utcp` package degrades gracefully to an empty tool list instead of breaking the agent.

OVOS speech servers already expose their own capabilities over these protocols, so an OVOS agent can call OVOS's own STT, TTS, and translation as tools — alongside any third-party MCP or UTCP server you wire up.

## For developers: config only, no code changes

This section is for developers configuring a persona directly. A persona is configured in JSON: name a loop in `solvers`, hand that loop a `brain` (any OVOS chat/LLM plugin — the loop bundles no LLM of its own), and list the toolboxes it may use.

```json
{
  "solvers": ["ovos-react-loop"],
  "ovos-react-loop": {
    "brain": "ovos-chat-openai-plugin",
    "ovos-chat-openai-plugin": {"api_url": "http://localhost:11434/v1"},
    "toolboxes": ["ovos-math-tools", "ovos-utcp-toolbox"],
    "ovos-utcp-toolbox": {
      "utcp_config": {"tool_providers": [{"url": "http://localhost:8080/utcp"}]}
    },
    "max_iterations": 10
  }
}
```

Swap `ovos-react-loop` for `ovos-plan-execute-loop`, `ovos-reflexion-loop`, or `ovos-tree-of-thoughts-loop` and the same persona reasons a different way, with no other changes required. Point `ovos-chat-openai-plugin` at an Ollama URL, as above, and the whole thing runs locally.

## Why this matters

- **Local and private by default.** These agents run on your own stack. Point the loop at a local LLM and a local tool server, and none of the reasoning or the data has to leave the device.
- **Strategies are swappable.** Reasoning is no longer baked into the assistant. Pick the loop that fits the task, benchmark alternatives, or ship different personas with different brains.
- **It's a real plugin ecosystem.** Loops and toolboxes are ordinary OPM entry points. New reasoning architectures and new tool adapters can be added by the community without touching `ovos-persona` itself.

One agentic plugin was the requirement. Eight loop architectures, six built-in toolboxes, and open MCP/UTCP tool discovery is what shipped, and it turns OVOS personas from talkers into doers.

---

This work is part of the OpenVoiceOS **From Beta to Breakthrough** milestone, funded through the [NGI0 Commons Fund](https://nlnet.nl/commonsfund), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of [DG Communications Networks, Content and Technology](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en) under grant agreement No [101135429](https://cordis.europa.eu/project/id/101135429). Additional funding is made available by the [Swiss State Secretariat for Education, Research and Innovation](https://www.sbfi.admin.ch/sbfi/en/home.html) (SERI).

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it's a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here's how you can help:

- **Donate 💸**: Help us fund development, infrastructure, and legal protection.
- **Contribute Open Data 📣**: Share voice samples and transcriptions under open licenses.
- **Translate 🌍**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
