---
title: "OpenVoiceOS + Home Assistant: A Voice Automation Dream Team"
excerpt: "In the world of open-source smart homes, some things just click. When you let Home Assistant handle the automation and let OVOS (Open Voice OS) handle the voice, you get a powerful partnership where each project shines. It’s a perfect synergy"
coverImage: "/assets/blog/common/cover.png"
date: "2025-08-01T00:00:00.000Z"
author:
  name:  JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/common/cover.png"
---

# OpenVoiceOS + Home Assistant: A Voice Automation Dream Team

<img width="455" height="295" alt="2025-07-29_14-06" src="https://gist.github.com/user-attachments/assets/a98cff02-c2c0-43ad-94bf-0e0cbef92027" />

In the world of open-source smart homes, some things just click. When you let Home Assistant handle the automation and let OVOS (Open Voice OS) handle the voice, you get a powerful partnership where each project shines. It’s a perfect synergy: one is the undisputed champion of home automation, and the other is a flexible, private powerhouse for voice interaction.

Home Assistant excels at orchestrating your devices and routines, while OVOS provides unparalleled flexibility and privacy in voice interactions. Together, they create a system that's not only robust but also truly yours.

Let's explore how you can bring these two together to create a truly magical smart home experience.

-----

## Give Home Assistant an OVOS-Powered Voice

The most direct way to get started is to enhance Home Assistant's built-in voice capabilities with the specialized tools from the OVOS ecosystem. Our main goal is to make OVOS's powerful tools accessible to as many people as possible. 

To achieve this, we've developed dedicated Wyoming integrations that act as bridges, allowing **any** OVOS Text-to-Speech (TTS), Speech-to-Text (STT), or Wakeword plugin to be exposed to Home Assistant. 

This means you're not limited to a few options; you gain immediate access to the **entire rich ecosystem** of OVOS voice plugins, bringing a vast array of languages, voices, and recognition models directly into your Home Assistant setup.


* [Wyoming OVOS STT](https://github.com/TigreGotico/wyoming-ovos-stt): Convert spoken commands into text for Home Assistant to understand.
* [Wyoming OVOS TTS](https://github.com/TigreGotico/wyoming-ovos-tts): Enable Home Assistant to speak responses using OVOS's diverse voice options.
* [Wyoming OVOS Wakeword](https://github.com/TigreGotico/wyoming-ovos-wakeword): Integrate custom wakewords, allowing your Home Assistant setup to respond only when it hears your chosen trigger phrase.

The [OVOS Wyoming Docker](https://github.com/TigreGotico/ovos-wyoming-docker) project makes getting these services up and running a breeze.

### **Plugin Highlights: Multi-language TTS powered by ILENIA**

For us, accessibility is key. That includes language accessibility. We're proud that this integration allows us to bring high-quality, publicly funded voices from projects like **ILENIA** to a wider audience. Now, Home Assistant users can easily access fantastic, natural-sounding voices for languages like Catalan and Galician.

* **Matxa TTS for Catalan:** The [`ovos-tts-plugin-matxa-multispeaker-cat`](https://github.com/OpenVoiceOS/ovos-tts-plugin-matxa-multispeaker-cat) provides multi-speaker text-to-speech capabilities for the Catalan language.
* **NosTTS for Galician:** The [`ovos-tts-plugin-nos`](https://github.com/OpenVoiceOS/ovos-tts-plugin-nos) offers robust text-to-speech in Galician.

It’s a great example of how open collaboration benefits everyone.

<img width="274" height="107" alt="image" src="https://gist.github.com/user-attachments/assets/e539f12c-83c1-457c-a515-2373f3ad2247" />

### **Setting up Wyoming Services in Home Assistant:**

When configuring Wyoming services in Home Assistant, you'll typically refer to the [official Home Assistant documentation](https://www.home-assistant.io/integrations/wyoming/). This process usually involves simply entering the IP address of your Docker container (or the host running your OVOS Wyoming services) into the Home Assistant web interface.

<img width="397" height="294" alt="image" src="https://gist.github.com/user-attachments/assets/836ba781-0ffe-49cc-942b-a3dbc6fb3c41" />

<img width="700" height="815" alt="image" src="https://gist.github.com/user-attachments/assets/3a7b629d-9c92-4b4e-8d03-d11b2207be66" />

-----

## Let OVOS Be the Brains of the Conversation

Want to take it a step further? You can set up OVOS as a full-fledged conversational agent for Home Assistant using the **Ollama integration**.

<img width="377" height="180" alt="image" src="https://gist.github.com/user-attachments/assets/26b697a7-ff33-4635-98b7-388c4fcdbf1d" />

In this setup, Home Assistant passes the user's text to the ovos-persona-server. OVOS then figures out what you want and tells Home Assistant what to answer. It’s like hiring a brilliant conversationalist to augment your smart home interactions.

Here’s the cool part: because ovos-persona-server uses Ollama-compatible endpoints, you can connect it to any app that supports the Ollama or OpenAI APIs. The possibilities are huge!

<img width="566" height="514" alt="image" src="https://gist.github.com/user-attachments/assets/6f4f4115-89d5-45ec-af63-f972fe0888d8" />

-----


## OVOS with the Voice Pe

Everyone is talking about [Home Assistant Voice Preview Edition](https://www.home-assistant.io/voice-pe), a dedicated hardware device for voice control. If you own one, you can now easily integrate it with everything discussed so far.

<img width="584" height="925" alt="image" src="https://gist.github.com/user-attachments/assets/7e4e3756-12b8-4004-89a9-03b991bf0ab9" />

-----

## Welcome Your OVOS Devices into Home Assistant with HiveMind

If you have dedicated OVOS devices, the [HiveMind HomeAssistant](https://github.com/JarbasHiveMind/hivemind-homeassistant) project is where the real magic happens. This integration makes your OVOS devices show up as native entities in Home Assistant, giving you a beautiful, unified control panel.


### **Setting up HiveMind Integration:**

To integrate your OVOS devices via HiveMind, you'll typically add the HiveMind integration in Home Assistant. This involves providing connection details such as a `name` for the integration, an `access_key`, `password`, `site_id`, `host` (IP address or hostname of your HiveMind server), and the `port` (defaulting to 5678). You may also have options to `allow_self_signed` certificates or enable `legacy_audio` depending on your setup.

<img width="383" height="744" alt="image" src="https://gist.github.com/user-attachments/assets/95f9c857-0cf4-4662-a183-69ec2a2f8b70" />

### **Exposed Controls for OVOS Devices:**

Once integrated, HiveMind exposes a comprehensive set of controls for your OVOS devices directly within Home Assistant. This allows you to manage various aspects of your OVOS device from the Home Assistant UI, including:

  * Changing the `Listening Mode` (e.g., wakeword, always listening)
  * `Microphone Mute` toggle
  * `OCP Player` status and controls
  * Actions like `Reboot Device`, `Restart OVOS`, and `Shutdown Device`
  * Toggling `Sleep Mode` and `SSH Service`
  * Manually `Start Listening` or `Stop` listening
  * Controlling volume level

<img width="326" height="719" alt="image" src="https://gist.github.com/user-attachments/assets/662e9826-3622-40e2-87ec-1def236ba776" />

### **Notifications Integration:**

HiveMind also enables your OVOS devices to function as notification targets within Home Assistant. This means you can configure Home Assistant automations to send spoken notifications directly to your OVOS devices, allowing them to "speak" alerts, reminders, or any other information you configure. This is exposed as a "Speak" notifier entity in Home Assistant.


<img width="351" height="192" alt="image" src="https://gist.github.com/user-attachments/assets/00e7cda1-3240-4011-bdba-d66a2eca7b8d" />

### **Media Player and Music Assistant Integration:**

A fantastic feature of HiveMind integration is that your OVOS devices will show up as standard media players within Home Assistant. This allows you to control media playback on your OVOS devices directly from Home Assistant's media player interface. Furthermore, this integration extends to services like Music Assistant, enabling you to stream music and other audio content from Music Assistant through your OVOS devices, making them a seamless part of your whole-home audio system.

<img width="563" height="260" alt="image" src="https://gist.github.com/user-attachments/assets/57871380-f7ea-400e-b68d-bef0276bcb9c" />

<img width="1053" height="599" alt="image" src="https://gist.github.com/user-attachments/assets/ac0b08bf-971e-4362-aa90-a40a253116a2" />

-----

## Give OVOS the Keys to the Kingdom

Finally, with the fantastic [Skill HomeAssistant](https://github.com/OscillateLabsLLC/skill-homeassistant) from community member mikejgray, you can give OVOS direct control over Home Assistant.

Install this skill, and your OVOS device can now command your smart home. Just say, "Hey Mycroft, turn on the living room lights," and watch the magic happen. It’s the classic voice assistant experience, but fully private, customizable, and powered by two best-in-class open-source projects.

-----

## The Perfect Match

When you let OVOS do the talking and Home Assistant do the automating, you get the best of both worlds. It’s a flexible, powerful, and fun combination that lets you build a smart home that is truly your own.

**A Note on This Early Preview Release**:

We're incredibly excited to share this integration with you! Please keep in mind that this is an early preview release and is still under active development. While it's functional and powerful, it hasn't undergone extensive testing and may have rough edges. We're actively working to refine it, and your feedback is invaluable! 

If you encounter any pain points or have ideas for improvements, please consider opening an issue or, even better, a Pull Request on our GitHub repositories. Your contributions help us make this even better for everyone. Thanks for being an early adopter and helping us shape the future of open-source voice!# OVOS + Home Assistant: A Voice Automation Dream Team

<img width="455" height="295" alt="2025-07-29_14-06" src="https://gist.github.com/user-attachments/assets/a98cff02-c2c0-43ad-94bf-0e0cbef92027" />


In the world of open-source smart homes, some things just click. When you let Home Assistant handle the automation and let OVOS (Open Voice OS) handle the voice, you get a powerful partnership where each project shines. It’s a perfect synergy: one is the undisputed champion of home automation, and the other is a flexible, private powerhouse for voice interaction.

Home Assistant excels at orchestrating your devices and routines, while OVOS provides unparalleled flexibility and privacy in voice interactions. Together, they create a system that's not only robust but also truly yours.

Let's explore how you can bring these two together to create a truly magical smart home experience.

-----

## Give Home Assistant an OVOS-Powered Voice

The most direct way to get started is to enhance Home Assistant's built-in voice capabilities with the specialized tools from the OVOS ecosystem. Our main goal is to make OVOS's powerful tools accessible to as many people as possible. 

To achieve this, we've developed dedicated Wyoming integrations that act as bridges, allowing **any** OVOS Text-to-Speech (TTS), Speech-to-Text (STT), or Wakeword plugin to be exposed to Home Assistant. 

This means you're not limited to a few options; you gain immediate access to the **entire rich ecosystem** of OVOS voice plugins, bringing a vast array of languages, voices, and recognition models directly into your Home Assistant setup.


* [Wyoming OVOS STT](https://github.com/TigreGotico/wyoming-ovos-stt): Convert spoken commands into text for Home Assistant to understand.
* [Wyoming OVOS TTS](https://github.com/TigreGotico/wyoming-ovos-tts): Enable Home Assistant to speak responses using OVOS's diverse voice options.
* [Wyoming OVOS Wakeword](https://github.com/TigreGotico/wyoming-ovos-wakeword): Integrate custom wakewords, allowing your Home Assistant setup to respond only when it hears your chosen trigger phrase.

The [OVOS Wyoming Docker](https://github.com/TigreGotico/ovos-wyoming-docker) project makes getting these services up and running a breeze.

### **Plugin Highlights: Multi-language TTS powered by ILENIA**

For us, accessibility is key. That includes language accessibility. We're proud that this integration allows us to bring high-quality, publicly funded voices from projects like **ILENIA** to a wider audience. Now, Home Assistant users can easily access fantastic, natural-sounding voices for languages like Catalan and Galician.

* **Matxa TTS for Catalan:** The [`ovos-tts-plugin-matxa-multispeaker-cat`](https://github.com/OpenVoiceOS/ovos-tts-plugin-matxa-multispeaker-cat) provides multi-speaker text-to-speech capabilities for the Catalan language.
* **NosTTS for Galician:** The [`ovos-tts-plugin-nos`](https://github.com/OpenVoiceOS/ovos-tts-plugin-nos) offers robust text-to-speech in Galician.

It’s a great example of how open collaboration benefits everyone.

<img width="274" height="107" alt="image" src="https://gist.github.com/user-attachments/assets/e539f12c-83c1-457c-a515-2373f3ad2247" />

### **Setting up Wyoming Services in Home Assistant:**

When configuring Wyoming services in Home Assistant, you'll typically refer to the [official Home Assistant documentation](https://www.home-assistant.io/integrations/wyoming/). This process usually involves simply entering the IP address of your Docker container (or the host running your OVOS Wyoming services) into the Home Assistant web interface.

<img width="397" height="294" alt="image" src="https://gist.github.com/user-attachments/assets/836ba781-0ffe-49cc-942b-a3dbc6fb3c41" />

<img width="700" height="815" alt="image" src="https://gist.github.com/user-attachments/assets/3a7b629d-9c92-4b4e-8d03-d11b2207be66" />

-----

## Let OVOS Be the Brains of the Conversation

Want to take it a step further? You can set up OVOS as a full-fledged conversational agent for Home Assistant using the **Ollama integration**.

<img width="377" height="180" alt="image" src="https://gist.github.com/user-attachments/assets/26b697a7-ff33-4635-98b7-388c4fcdbf1d" />

In this setup, Home Assistant passes the user's text to the ovos-persona-server. OVOS then figures out what you want and tells Home Assistant what to answer. It’s like hiring a brilliant conversationalist to augment your smart home interactions.

Here’s the cool part: because ovos-persona-server uses Ollama-compatible endpoints, you can connect it to any app that supports the Ollama or OpenAI APIs. The possibilities are huge!

<img width="566" height="514" alt="image" src="https://gist.github.com/user-attachments/assets/6f4f4115-89d5-45ec-af63-f972fe0888d8" />

-----


## OVOS with the Voice Pe

Everyone is talking about [Home Assistant Voice Preview Edition](https://www.home-assistant.io/voice-pe), a dedicated hardware device for voice control. If you own one, you can now easily integrate it with everything discussed so far.

<img width="584" height="925" alt="image" src="https://gist.github.com/user-attachments/assets/7e4e3756-12b8-4004-89a9-03b991bf0ab9" />

-----

## Welcome Your OVOS Devices into Home Assistant with HiveMind

If you have dedicated OVOS devices, the [HiveMind HomeAssistant](https://github.com/JarbasHiveMind/hivemind-homeassistant) project is where the real magic happens. This integration makes your OVOS devices show up as native entities in Home Assistant, giving you a beautiful, unified control panel.


### **Setting up HiveMind Integration:**

To integrate your OVOS devices via HiveMind, you'll typically add the HiveMind integration in Home Assistant. This involves providing connection details such as a `name` for the integration, an `access_key`, `password`, `site_id`, `host` (IP address or hostname of your HiveMind server), and the `port` (defaulting to 5678). You may also have options to `allow_self_signed` certificates or enable `legacy_audio` depending on your setup.

<img width="383" height="744" alt="image" src="https://gist.github.com/user-attachments/assets/95f9c857-0cf4-4662-a183-69ec2a2f8b70" />

### **Exposed Controls for OVOS Devices:**

Once integrated, HiveMind exposes a comprehensive set of controls for your OVOS devices directly within Home Assistant. This allows you to manage various aspects of your OVOS device from the Home Assistant UI, including:

  * Changing the `Listening Mode` (e.g., wakeword, always listening)
  * `Microphone Mute` toggle
  * `OCP Player` status and controls
  * Actions like `Reboot Device`, `Restart OVOS`, and `Shutdown Device`
  * Toggling `Sleep Mode` and `SSH Service`
  * Manually `Start Listening` or `Stop` listening
  * Controlling volume level

<img width="326" height="719" alt="image" src="https://gist.github.com/user-attachments/assets/662e9826-3622-40e2-87ec-1def236ba776" />

### **Notifications Integration:**

HiveMind also enables your OVOS devices to function as notification targets within Home Assistant. This means you can configure Home Assistant automations to send spoken notifications directly to your OVOS devices, allowing them to "speak" alerts, reminders, or any other information you configure. This is exposed as a "Speak" notifier entity in Home Assistant.


<img width="351" height="192" alt="image" src="https://gist.github.com/user-attachments/assets/00e7cda1-3240-4011-bdba-d66a2eca7b8d" />

### **Media Player and Music Assistant Integration:**

A fantastic feature of HiveMind integration is that your OVOS devices will show up as standard media players within Home Assistant. This allows you to control media playback on your OVOS devices directly from Home Assistant's media player interface. Furthermore, this integration extends to services like Music Assistant, enabling you to stream music and other audio content from Music Assistant through your OVOS devices, making them a seamless part of your whole-home audio system.

<img width="563" height="260" alt="image" src="https://gist.github.com/user-attachments/assets/57871380-f7ea-400e-b68d-bef0276bcb9c" />

<img width="1053" height="599" alt="image" src="https://gist.github.com/user-attachments/assets/ac0b08bf-971e-4362-aa90-a40a253116a2" />

-----

## Give OVOS the Keys to the Kingdom

Finally, with the fantastic [Skill HomeAssistant](https://github.com/OscillateLabsLLC/skill-homeassistant) from community member mikejgray, you can give OVOS direct control over Home Assistant.

Install this skill, and your OVOS device can now command your smart home. Just say, "Hey Mycroft, turn on the living room lights," and watch the magic happen. It’s the classic voice assistant experience, but fully private, customizable, and powered by two best-in-class open-source projects.

-----

## The Perfect Match

When you let OVOS do the talking and Home Assistant do the automating, you get the best of both worlds. It’s a flexible, powerful, and fun combination that lets you build a smart home that is truly your own.

**A Note on This Early Preview Release**:

We're incredibly excited to share this integration with you! Please keep in mind that this is an early preview release and is still under active development. While it's functional and powerful, it hasn't undergone extensive testing and may have rough edges. We're actively working to refine it, and your feedback is invaluable! 

If you encounter any pain points or have ideas for improvements, please consider opening an issue or, even better, a Pull Request on our GitHub repositories. Your contributions help us make this even better for everyone. Thanks for being an early adopter and helping us shape the future of open-source voice!

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
