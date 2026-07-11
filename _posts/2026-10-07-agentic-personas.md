---
title: "One Agentic Plugin Became Seven: ovos-persona Learns to Reason and Use Tools"
excerpt: "The MoU asked for one agentic plugin. We shipped seven reasoning-loop architectures, five built-in toolboxes, and MCP/UTCP tool discovery — turning personas from single-shot LLM calls into local, private agents."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-10-07T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## One Agentic Plugin Became Seven

Until now, an OVOS persona was a single-shot thing: your words went to an LLM, the LLM answered, and that was the whole story. No looking things up, no multi-step reasoning, no calling a tool and coming back with a real answer. Fine for chit-chat, a long way from an *agent*.

That changes today. The **"Consume UTCP/MCP/A2A → agentic plugin"** deliverable is **complete** — and it delivered more than the one plugin the MoU asked for. Instead of a single agentic loop, we shipped **seven** distinct reasoning-loop architectures plus **five built-in toolboxes**, all as standard OPM plugins for `ovos-persona`.

## Seven ways to think

The core work lives in [**ovos-agentic-loop**](https://github.com/OpenVoiceOS/ovos-agentic-loop). A "loop" wraps an LLM and a set of tools and decides *how* the model reasons from your question to an answer. Each one implements a published agent pattern, and each registers as an `opm.agents.chat` plugin, so a persona config just names the one it wants:

- **ReAct** (`ovos-react-loop`) — interleaves reasoning and acting. Every iteration the LLM emits a *Thought → Action → Observation* triplet: think a step, call one tool, read the result, think again, until it emits `FINAL_ANSWER:`. Simple and predictable — one LLM call per iteration — but it cannot backtrack if an early tool call was wrong.
- **Plan-and-Execute** (`ovos-plan-execute-loop`) — a planner LLM first writes a numbered list of 3–7 sub-tasks; each step then runs through its own mini-ReAct sub-loop; a final synthesize call turns the collected step outputs into the answer. The plan is auditable up front, at the cost of more LLM calls. Best when a task has more than ~3 tool calls, where plain ReAct loses track of earlier observations.
- **Reflexion** (`ovos-reflexion-loop`) — wraps ReAct in an outer *episode* loop. After each attempt the model evaluates its own answer; if it falls short, it writes a short verbal critique that is prepended to the next episode's prompt. It often reaches a correct answer in two episodes that one ReAct pass would never recover from. Stops at `SATISFACTORY` or `max_reflections` (default 3).
- **Self-Ask** (`ovos-self-ask-loop`) — decomposes a multi-hop question into a chain of simpler follow-up questions, answering each (typically via one search tool) before asking the next. Its grammar is deliberately simpler than ReAct's JSON — a plain `query → result` — so smaller LLMs follow the format more reliably. Works with a single search tool, or with none at all as a pure decomposer.
- **Chain-of-Thought** (`ovos-chain-of-thought-loop`) — a single LLM call that reasons step by step before committing to a `FINAL ANSWER:`. No tools, no iteration — the lowest latency and cost of all seven. Ideal for arithmetic, logic puzzles, and multi-step instructions where no external information is needed; hallucination-prone on factual questions.
- **CRITIC** (`ovos-critic-loop`) — *draft → critique → revise*. The model drafts an answer, a second call flags the verifiable claims in it, each claim is checked with a tool, and only the incorrect facts are rewritten — the rest of the answer is preserved. Cheaper than Reflexion for factual corrections because it never re-runs the whole task. With no tools registered it falls back to a plain draft.
- **Tree-of-Thoughts** (`ovos-tree-of-thoughts-loop`) — beam search over reasoning paths. At each depth it generates several candidate steps, scores each with an evaluator LLM call, and keeps only the top `beam_width` branches for the next level. It can explore and abandon a dead-end branch before committing, at the price of the most LLM calls. Good for problems with several competing strategies.

Different problems want different strategies, and because these are all swappable plugins behind one interface, you change strategy by editing config — not code. They also compose: Reflexion literally wraps ReAct internally, and Plan-and-Execute uses a mini-ReAct per step.

## Tools, discovered automatically

A reasoning loop is only as good as the tools it can reach. `ovos-agentic-loop` ships **five built-in toolboxes** as `opm.agents.toolbox` plugins: `ovos-math-tools` (calculator, unit conversion, statistics, equation solving), `ovos-clock-tools`, `ovos-web-search-tools`, `ovos-filesystem-tools`, and `ovos-shell-tools`. The security defaults are conservative — the shell toolbox is disabled unless you set `allow_shell: true`, the filesystem toolbox can be pinned to a subtree via `root_path`, and the math toolbox parses expressions with an `ast` allowlist rather than ever calling `eval()`. A sixth, `ovos-skill-md-toolbox`, turns any installed `SKILL.md` file into an agent tool.

For everything else, [**ovos-tool-adapters**](https://github.com/OpenVoiceOS/ovos-tool-adapters) bridges external tool servers into the same interface. It ships two toolboxes — `ovos-mcp-toolbox` (Model Context Protocol) and `ovos-utcp-toolbox` (Universal Tool Calling Protocol) — that connect to an external server, discover every tool it exposes, and forward the server's real JSON Schema to the LLM so the model sees the actual input shape. MCP supports stdio, SSE, and streamable-HTTP transports; UTCP supports whatever the installed UTCP version does (HTTP, SSE, CLI, WebSocket, and more). A daemon-thread event loop keeps sessions alive between calls, and a missing `mcp`/`utcp` package degrades gracefully to an empty tool list instead of breaking the agent.

This closes a nice loop of its own. OVOS speech servers already expose their capabilities over these protocols, so an OVOS agent can call **OVOS's own STT, TTS, and translation** as tools — alongside any third-party MCP or UTCP server you wire up.

## What it looks like in config

A persona is configured in JSON: name a loop in `solvers`, hand that loop a `brain` (any OVOS chat/LLM plugin — the loop bundles no LLM of its own), and list the toolboxes it may use.

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

Swap `ovos-react-loop` for `ovos-plan-execute-loop`, `ovos-reflexion-loop`, or `ovos-tree-of-thoughts-loop` and the same persona now reasons a different way — no other changes required. (Point `ovos-chat-openai-plugin` at an Ollama URL, as above, and the whole thing runs locally.)

## Why this matters

- **Local and private by default.** These are agents that run on *your* stack. Point the loop at a local LLM and a local tool server, and no part of the reasoning or the data has to leave the device.
- **Strategies are swappable.** Reasoning is no longer baked into the assistant. Pick the loop that fits the task, benchmark alternatives, or ship different personas with different brains.
- **It's a real plugin ecosystem.** Loops and toolboxes are ordinary OPM entry points. New reasoning architectures and new tool adapters can be added by the community without touching `ovos-persona` itself.

One agentic plugin was the ask. Seven loop architectures, five built-in toolboxes, and open MCP/UTCP tool discovery is what shipped — and it turns OVOS personas from talkers into doers.

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
