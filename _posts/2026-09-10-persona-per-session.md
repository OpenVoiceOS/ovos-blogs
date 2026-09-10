---
title: "One Device, a Different Persona per Session"
excerpt: "ovos-persona keeps the active persona inside the OVOS Session instead of one global slot. A kitchen satellite, an office satellite and a second wake word can each talk to a different assistant on the same core."
coverImage: "/assets/blog/ngi/thumb.png"
date: "2026-09-10T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ngi/thumb.png"
---

## One Device, a Different Persona per Session

A persona in OVOS is a named stack of solvers with its own prompt and memory. It is the assistant you summon by name and dismiss when you are done. Before this change the persona service held one active persona for the whole device. Summon a persona from the kitchen and the office got it too. [`ovos-persona`](https://github.com/OpenVoiceOS/ovos-persona) tracks the active persona per session instead.

This is for people who run more than one client against one OVOS core: HiveMind satellites, several wake words, or a phone and a speaker. On a single device with one microphone nothing changes.

## What a session is, and what changed

Every message on the OVOS bus carries a `Session` in its context: the language, the pipeline, the active skills, and the identity of the client the utterance came from. The [OVOS-PERSONA-1](https://github.com/OpenVoiceOS/architecture/blob/dev/persona.md) specification adds one field to it, `persona_id`, and makes it the authoritative record of which persona a session is talking to. Summoning a persona sets `session.persona_id`; dismissing clears it. The persona service reads the field off the message it is handling and answers as that persona. Two sessions on the same core hold two different personas without touching each other.

The bus client carries the field from version 1.5.0 (`ovos-bus-client` PR #192). The persona service landed the per-session tracking in `ovos-persona` PR #140. On the bus, a summon emits `ovos.persona.activated` and a dismiss emits `ovos.persona.dismissed`, each with the session that changed.

## Seeing it

Install `ovos-persona` (`pip install --pre ovos-persona`; the run below is 0.9.0a21 with `ovos-bus-client` 2.11.15a1) and drive the service with two sessions on a fake bus:

```python
from ovos_bus_client.message import Message
from ovos_bus_client.session import Session
from ovos_persona import PersonaService
from ovos_utils.fakebus import FakeBus

svc = PersonaService(bus=FakeBus())
kitchen = Session("kitchen", persona_id="ChefBot")
office = Session("office")

def active(sess):
    msg = Message("recognizer_loop:utterance", {"utterances": ["hi"]},
                  {"session": sess.serialize()})
    return svc.get_active_persona(msg, include_default=False)

print("kitchen ->", active(kitchen), "| office ->", active(office))
office = svc._with_persona_id(office, "WorkBot")   # what a summon does to the session
print("after summon in office:", active(office), "| kitchen still", active(kitchen))
office = svc._with_persona_id(office, None)        # what a dismiss does
print("after dismiss in office:", active(office))
```

```
kitchen -> ChefBot | office -> None
after summon in office: WorkBot | kitchen still ChefBot
after dismiss in office: None
```

The office session summoned and dismissed a persona and the kitchen session never noticed. In a running system the summon and dismiss happen through speech ("talk to ChefBot", "stop talking to ChefBot") or through the `ovos.persona.*` bus messages. The session travels with every message, so the same isolation holds across a HiveMind hive.

## What it unblocks

- A different persona per wake word. Each hotword can start its own session, so "hey chef" and "hey tutor" reach different assistants on one device.
- A different persona per HiveMind satellite. The satellite's session carries its own `persona_id`, so a children's room and a workshop talk to different assistants through the same core.
- A different TTS voice per persona, because the persona is known per session at the point where the answer is spoken.

## Limits

The persona's memory backend decides whether conversation history is also per session. The built-in short-term memory and the `ovos-memory-plugins` backends key their state by `session_id`. Other backends may not. A session with no `persona_id` falls back to the configured default persona, if one is set. The in-memory `active_personas` dictionary from before the change is still read for compatibility, but the session field wins when both are present. Bugs go to the [ovos-persona issue tracker](https://github.com/OpenVoiceOS/ovos-persona/issues).

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
