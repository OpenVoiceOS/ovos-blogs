---
title: "Meet ovos-control-panel: your OVOS device, in a web page"
excerpt: "OpenVoiceOS has had a control panel for a while, but nobody ever told you about it. It runs on the device, needs no cloud and no account, and lets you see that things work, change settings and install a voice. This post is what it can do today, and where it is going."
coverImage: "/assets/blog/control-panel/cover.png"
date: "2026-12-18T20:00:00.000Z"
author:
  name: "andlo"
  picture: "https://github.com/andlo.png"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/control-panel/cover.png"
---

OpenVoiceOS has a control panel. If that is news to you, you are not alone:
it was never announced. It grew quietly in its repo, one page at a time,
and people found it by accident or not at all. This post fixes that.

[ovos-control-panel](https://github.com/OpenVoiceOS/ovos-control-panel) was
started by TigreGotico for OpenVoiceOS, funded through NLnet's NGI0 Commons
Fund. Jarbas has since handed it over to me to look after, so this is also
my way of saying hello as its maintainer.

## The problem it solves

OVOS is built from many small parts. That is its strength: you pick the
wake word, the speech to text, the voice, the skills and the solvers that
fit your hardware and your language. But it also means that a lot of what
you can change lives in `mycroft.conf`, in plugin names you have to know,
and in log files you have to find.

For a developer that is fine. For the person who just wants the kitchen
speaker to use another voice, or wants to know why it stopped answering,
it is a wall. The control panel is a door in that wall.

## What it is

The control panel is a web page that runs **on the device itself**. You
open it in a browser on your phone or computer, on your own network.

- **No cloud, no account, no internet.** Every file the page needs ships in
  the package. It works on a device that has never been online.
- **It only changes your own layer** of `mycroft.conf`, and it copies the
  old file to a backup before every save. You can always go back.
- **It never runs shell commands.** By default it only listens on the
  device itself, and it needs an access token before it will listen on the
  network.
- **It is for everybody:** it works with a keyboard and a screen reader,
  follows the device language (also right-to-left), works on a phone, and
  follows your light or dark setting.

Install it with `pip install ovos-control-panel` and open
`http://127.0.0.1:8500` on the device. The
[getting started guide](https://github.com/OpenVoiceOS/ovos-control-panel/blob/dev/docs/getting-started.md)
walks you through the first few minutes, including setting a token so you
can reach it from your phone.

![The dashboard, with every service ready](/assets/blog/control-panel/dashboard-wide.png)

![The same dashboard on a device set to Arabic: the whole page turns right to left](/assets/blog/control-panel/dashboard-rtl-arabic.png)

## What it can do

The everyday pages are always in the menu:

- **Dashboard** shows whether the message bus and each OVOS service answer.
  When something is wrong, this is where you see it first.
- **Setup** walks a fresh device through language, plugins and a first
  question.
- **Voice** lets you pick the wake word, speech to text, the voice and the
  language, without knowing a single plugin name.
- **Skills** is one page for the skills you have and the skills you can
  get. More about it below.
- **Try it** sends a typed question through the device, the same way a
  spoken one would go.
- **Backup** downloads a copy of your settings and puts one back.

Below an "Advanced" divider come the groups for the people who like to
look under the hood: **Plugins** (find, install, update and remove OVOS
plugins), **Intents** (dry-run a sentence and see which skill would take
it), **Transformers**, **Personas** (the ordered list of solvers that
answer you), **Translate**, **Servers** (point speech and translation at
your own servers, with failover), **Network**, **Sensors**, **Media**,
**Send over sound**, the **Mark-1 faceplate**, and more.

![Plugins recommended for your language, and the search](/assets/blog/control-panel/plugins-wide.png)

### Skills: install, update and remove

The **Skills** page shows the skills on the device, with what to say to
them, and lets you change their settings, turn them off, update them or
remove them. Under **Find more** you can search for new skills and install
them, and the device picks them up without a restart.

Before anything is installed, the panel asks pip what the install would do,
without doing it. If it would downgrade an OVOS package or change something
it shouldn't, or if it would fail, you see that first and decide.

A few things happen without you asking:

- **Pages the device can't use are hidden.** No Mark-1 page on a device
  without a Mark-1, no Sensors page without a sensor plugin. If you reach
  such a page anyway, it tells you what is missing and where to get it.
- **Plugins are checked first too**, the same way as skills: a dry run
  before the install, and a warning if it would downgrade OVOS or fail.
- **Every page links to its own page in the manual**, so help is one click
  away.

![Seeing which skill would take a sentence](/assets/blog/control-panel/intents-wide.png)

## An example: Emkay

[Emkay](https://emkay.ai) runs the whole OVOS stack in a browser tab. It
has no server, so it has no port for a control panel to listen on. Still,
when you tap ⚙ in Emkay, the panel you get is the stock ovos-control-panel,
not a copy written for Emkay.

That works because the panel is an ordinary Python web app. Emkay builds it
inside its worker, next to OVOS, and a Service Worker in the browser acts as
its network. The panel does not know it is in a browser. It reads and writes
`mycroft.conf` and talks to the message bus, just as it does on a Raspberry
Pi.

The same panel also reaches Home Assistant. With
[ha-ovos-integration](https://github.com/andlo/ha-ovos-integration) and
its small PHAL plugin on the device, Home Assistant shows what the panel
can set as entities: language, units, voice, wake word, each skill on or
off, a "Problem" sensor from the dashboard, and restart buttons. HA's
requests travel over the device's own connection, and the panel on the
device does the reading and writing. So you can turn off listening at night
with an automation, and the panel never has to be opened on the network.

For me that is the real point: one panel, written once, that works on a Pi,
on a Mark II, in a browser tab and from Home Assistant.

## Where it is going: a small shell, and pages from anywhere

Today every page is part of the panel's own code. That doesn't scale. The
person who knows best what a Mark-1 page should show is the person who
maintains the Mark-1 plugin, not me.

So the plan is to make the panel a **small shell**. The shell does the sign
in, the menu, the languages, the look and the safety checks. Every page,
also the panel's own, is registered the same way, through an entry point,
like any other OVOS plugin:

```toml
[project.entry-points."opm.control_panel.page"]
emkay-guardian = "ovos_skill_guardian.panel:PAGE"
```

Most pages from outside the panel would be **data pages**: only HTML, JS
and language files, talking to the device over a bus bridge that only
passes the messages the page lists. That way a skill or a PHAL plugin can
bring its own page without adding FastAPI or any other dependency. It only
uses the message bus it already listens to.

That opens some nice doors:

- **A plugin brings its own settings page.** Install a sensor plugin, and
  its page shows up in the menu. Remove it, and the page goes too.
- **Hardware brings its own pages.** The Mark-1 page can move to the Mark-1
  plugin. Emkay's hardware setup and Guardian, its network log, can ship as
  pages in their own packages, instead of as Emkay-only screens.
- **Distributions get their own look.** The menu, the page order and the
  branding (name, logo, colours) become settings in `mycroft.conf`, so a
  distribution can set its own defaults in the system layer.

The contract is written down as a draft in
[docs/pages.md (#131)](https://github.com/OpenVoiceOS/ovos-control-panel/pull/131),
and the discussion is in
[#115](https://github.com/OpenVoiceOS/ovos-control-panel/issues/115).
Nothing is built yet. If you maintain a skill or a plugin, I would love to
hear from you there: would you ship a page with your plugin like this?

## Why it matters for OVOS

OVOS can do an amazing amount, but much of it is hidden unless you know
where to look. The control panel makes that visible:

- **Easier to start.** A new user can get a working device, a voice in
  their own language and the skills they want, without editing a file.
- **Easier to help.** "Open the dashboard and tell me what is red" is a
  much better start for a support question than "send me your logs".
- **Easier to show your work.** When plugins and skills can bring their own
  pages, the work people put into OVOS gets a face that users can see.
- **The same everywhere.** One panel for every OVOS device, whether it is a
  Pi, a Mark II, a tab in a browser or an entity in Home Assistant.

## Try it, and tell us what you think

```
pip install ovos-control-panel
```

The [manual](https://github.com/OpenVoiceOS/ovos-control-panel/blob/dev/docs/README.md)
has a page for every page. Bugs, ideas and wishes go in the
[issues](https://github.com/OpenVoiceOS/ovos-control-panel/issues), and
pull requests are very welcome, also for translations.
