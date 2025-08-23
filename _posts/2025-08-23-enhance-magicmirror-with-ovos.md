---
title: "Mirror, Mirror… Who’s My Persona Today? (OVOS + MagicMirror² + Local LLM)"
date: "2025-08-23T14:00:00.000Z"
coverImage: "/assets/blog/enhance-magicmirror-with-ovos/thumbnail.png"
excerpt: "Daily-driver setup: keep skills first, add OVOS Persona right after the high-confidence matchers, and run a tiny local LLM. MagicMirror² shows the vibes with wakeword visuals and YouTube casting."
author:
  name: "Gaëtan Trellu"
  picture: "https://github.com/goldyfruit.png"
ogImage:
  url: "/assets/blog/enhance-magicmirror-with-ovos/thumbnail.png"
---

# Mirror, Mirror… Who’s My Persona Today?

*Daily-driver edition: practical, speedy, and just cheeky enough 😏.*

> OVOS = **Open Voice OS**.

The demo shows our smart mirror flipping **personas** on command—*Friendly*, *Snobby*, *Smarty Pants*—while everything runs **locally**. Below is the *daily-driver* recipe we actually use: classic skills stay in charge, personas jump in when it’s chat time, and **MagicMirror²** handles the visuals. No devices were harmed. ☁️❌

🎥 **Watch:** [https://www.youtube.com/watch?v=DDkEbAySH0I](https://www.youtube.com/watch?v=DDkEbAySH0I)

---

## Why personas (and why this layout)?

In OVOS, a persona is a **runtime-swappable reasoning preset**. It can route a question to an LLM, change tone/verbosity, and gracefully handle open-ended chatter.
This layout keeps your **high-confidence skills first** (timers, weather, music, home control), then lets the persona shine for the fuzzy stuff. Best of both worlds. ✨

---

## TL;DR (copy/paste speed-run)

1. Install OVOS with the **ovos-installer TUI**, select **alpha** channel, and **do NOT enable GUI** (MagicMirror² is the face).
2. In **`mycroft.conf`** (e.g., `~/.config/mycroft/mycroft.conf` or `/etc/mycroft/mycroft.conf`), add **`ovos-persona-pipeline-plugin-high`** *after* your high matchers.
3. Drop the persona JSON files below (Local LLM, Friendly, Snobby, Smarty Pants) and run **Ollama** for the model.
4. Set up **MagicMirror²** with **MMM-ShareToMirror** + **MMM-ovos-wakeword** and the **OVOS skill** `ovos-skill-share-to-mirror`.
5. Say “Switch to **Local LLM** persona,” and enjoy your mirror’s new mood. ☕️

---

## 1) Install OVOS via the **TUI** (choose *alpha* & **do NOT enable GUI**)

```bash
sudo sh -c "$(curl -fsSL https://raw.githubusercontent.com/OpenVoiceOS/ovos-installer/main/installer.sh)"
```

Inside the TUI:

* **Channel:** pick **Alpha** (latest persona goodness)
* **Method:** `virtualenv` (or `containers`)
* **Profile:** **OVOS**
* **Features:** enable **Skills** ✅ and **do NOT enable GUI** ❌ (MagicMirror² provides visuals)

Keep your config path handy: `~/.config/mycroft/mycroft.conf` (user) or `/etc/mycroft/mycroft.conf` (system).

---

## 2) Add **ovos-persona** to today’s pipeline (daily-driver)

Edit your config at `~/.config/mycroft/mycroft.conf` or `/etc/mycroft/mycroft.conf`. Insert persona after the high-confidence matchers:

```json
{
  "intents": {
    "pipeline": [
      "ovos-stop-pipeline-plugin-high",
      "ovos-converse-pipeline-plugin",
      "ovos-ocp-pipeline-plugin-high",
      "ovos-padatious-pipeline-plugin-high",
      "ovos-adapt-pipeline-plugin-high",
      "ovos-m2v-pipeline-high",

      "ovos-persona-pipeline-plugin-high",

      "ovos-ocp-pipeline-plugin-medium",
      "ovos-fallback-pipeline-plugin-high",
      "ovos-stop-pipeline-plugin-medium",
      "ovos-adapt-pipeline-plugin-medium",
      "ovos-fallback-pipeline-plugin-medium",
      "ovos-fallback-pipeline-plugin-low"
    ]
  }
}
```

> Why here? Skills get first crack at clear commands. Persona handles open-ended “hmm, let’s think” questions—without stepping on your timers and lights. 🔦

---

## 3) Personas (drop these into `~/.config/ovos_persona/`)

All four personas use a local LLM via **Ollama**’s OpenAI-style `/v1` API. Adjust `model` to taste (`gemma3:4b` is a great default).

### `local-llm.json` — base persona

```json
{
  "name": "Local LLM",
  "solvers": ["ovos-solver-openai-plugin"],
  "ovos-solver-openai-plugin": {
    "api_url": "http://127.0.0.1:11434/v1",
    "key": "ollama",
    "model": "gemma3:4b",
    "system_prompt": "helpful, witty, concise; prefers practical answers.",
    "temperature": 0.6
  }
}
```

### `friendly.json`

```json
{
  "name": "Friendly",
  "solvers": ["ovos-solver-openai-plugin"],
  "ovos-solver-openai-plugin": {
    "api_url": "http://127.0.0.1:11434/v1",
    "key": "ollama",
    "model": "gemma3:4b",
    "system_prompt": "kind, upbeat, plain language, one actionable next step; no emojis.",
    "temperature": 0.7
  }
}
```

### `snobby.json`

```json
{
  "name": "Snobby",
  "solvers": ["ovos-solver-openai-plugin"],
  "ovos-solver-openai-plugin": {
    "api_url": "http://127.0.0.1:11434/v1",
    "key": "ollama",
    "model": "gemma3:4b",
    "system_prompt": "precise, mildly sardonic librarian; terse and technically correct; no emojis.",
    "temperature": 0.5
  }
}
```

### `smarty-pants.json`

```json
{
  "name": "Smarty Pants",
  "solvers": ["ovos-solver-openai-plugin"],
  "ovos-solver-openai-plugin": {
    "api_url": "http://127.0.0.1:11434/v1",
    "key": "ollama",
    "model": "gemma3:4b",
    "system_prompt": "clever explainer; tiny examples; 1–2 sentences per idea; playful but clear; no fluff.",
    "temperature": 0.65
  }
}
```

### 🎭 Note on “vibe” vs model

Even with the **same** persona file, different models behave differently:

* **`gemma3:4b`** – friendly, concise; great default on Pi/mini-PC.
* **`qwen2.5:1.5b`** – very small & literal; bump temperature slightly if it feels too dry.
* **`llama3.1:8b`** – more capable but chattier; lower temperature & `max_tokens` to keep replies snappy.

Think of the persona JSON as the **style guide**, and the model as the **actor**—casting changes the performance. 🎬

---

## 4) Run a local model with **Ollama**

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull gemma3:4b
ollama serve &                # http://127.0.0.1:11434/v1
curl -s http://127.0.0.1:11434/v1/models | jq .
```

---

## 5) Install **MagicMirror²**

```bash
# prerequisites: Node 18+, git
git clone https://github.com/MagicMirrorOrg/MagicMirror ~/MagicMirror
cd ~/MagicMirror
node --run install-mm
cp config/config.js.sample config/config.js
# start on the local display
node --run start
# or as a web server:
# node --run server
```

If you run server-only, set `address: "0.0.0.0"` and add your LAN to `ipWhitelist` in `config/config.js`.

---

## 6) Add **MMM-ShareToMirror** + **ovos-skill-share-to-mirror**

* Module: [https://github.com/smartgic/MMM-ShareToMirror](https://github.com/smartgic/MMM-ShareToMirror)
* Skill:  [https://github.com/smartgic/ovos-skill-share-to-mirror](https://github.com/smartgic/ovos-skill-share-to-mirror)

### Install the module

```bash
cd ~/MagicMirror/modules
git clone https://github.com/smartgic/MMM-ShareToMirror.git
cd MMM-ShareToMirror && npm install
```

Add to `~/MagicMirror/config/config.js`:

```js
{
  module: "MMM-ShareToMirror",
  position: "bottom_center",
  config: {
    port: 8570,
    https: { enabled: false },
    invisible: true,
    overlay: {
      width: "70vw",
      maxWidth: "1280px",
      aspectRatio: "16 / 9",
      zIndex: 9999,
      borderRadius: "16px",
      boxShadow: "0 10px 36px rgba(0,0,0,.5)"
    },
    caption: { enabled: false, lang: "en" },
    quality: { target: "auto", lock: false }
  }
}
```

### Install the OVOS skill (pip method)

```bash
pip install "git+https://github.com/smartgic/ovos-skill-share-to-mirror.git"
```

Create skill settings at
`~/.config/mycroft/skills/ovos-skill-share-to-mirror.smartgic/settings.json`:

```json
{
  "base_url": "http://<MIRROR_IP>:8570",
  "verify_ssl": false,
  "request_timeout": 6,
  "caption_enabled": false,
  "caption_lang": "en",
  "quality_target": "auto",
  "quality_lock": false,
  "search_backend": "yt_dlp",
  "youtube_api_key": ""
}
```

Restart OVOS services so the skill gets picked up. Now you can say:
**“Play a video about espresso on the mirror.”**
…and the skill will drive the MMM-ShareToMirror overlay.

#### More handy intents for this skill

* **“Play \<query> on the mirror.”** — search + play
* **“Pause the mirror video.” / “Resume the mirror video.”**
* **“Stop the mirror video.”**
* **“Show captions on the mirror.” / “Hide captions on the mirror.”**
* **“Set mirror quality to high/auto/low.”**
* **“Open this YouTube link on the mirror.”** *(if used with a URL or clipboard helper)*
* **“Close the mirror overlay.”** *(hides the player)*

---

## 7) Add **MMM-ovos-wakeword** (+ OVOS side ping)

* Module: [https://github.com/smartgic/MMM-ovos-wakeword](https://github.com/smartgic/MMM-ovos-wakeword)

### Install the module

```bash
cd ~/MagicMirror/modules
git clone https://github.com/smartgic/MMM-ovos-wakeword.git
```

Add to `~/MagicMirror/config/config.js` (and allow your LAN):

```js
let config = {
  address: "0.0.0.0",
  port: 8080,
  ipWhitelist: ["127.0.0.1","::1","::ffff:192.168.1.1/24"],

  modules: [
    // ... other modules ...
    {
      module: "MMM-ovos-wakeword",
      position: "lower_third",
      config: {
        title: "Open Voice OS",
        apiKey: "CHANGE-ME-TO-A-RANDOM-STRING",
        maxMessages: 1,
        opacity: 0.5
      }
    }
  ]
}
```

### Install the OVOS PHAL plugin to send the wake cue

```bash
pip install ovos-phal-plugin-mm-wakeword
```

Create `~/.config/OpenVoiceOS/ovos-phal-plugin-mm-wakeword.json`:

```json
{
  "url": "http://<MIRROR_IP>:8080",
  "key": "CHANGE-ME-TO-A-RANDOM-STRING",
  "message": "Listening...",
  "timeout": 10,
  "verify": false
}
```

Restart OVOS (`systemctl --user restart ovos`).
Say your wake word — the mirror flashes “Listening…” then fades. ✨

---

## 8) Use it (talk to your mirror like it’s totally normal)

* “**Switch to Local LLM persona.**”
* “**Switch to Friendly.**”
* “**Talk to Snobby about pour-over coffee.**”
* “**Smarty Pants, explain Kubernetes like I’m five.**”
* “**Play lo-fi beats on the mirror.**”
* “**List personas.**”

*If your mirror starts giving life advice, that’s on you.* 😇

---

That’s it—your **daily-driver** setup is ready. Skills stay crisp, personas bring the charm, and your mirror finally has the personality it deserves. Now go ask it for a pep talk before your next meeting. 💪🪞
