---
title: "Making Synthetic Voices From Scratch"
excerpt: "Ever had your beloved OpenVoiceOS assistant respond with a blank stare, or worse, utter something completely nonsensical, after you *thought* you said something perfectly clear? We've all been there."
date: "2025-07-22T00:00:00.000Z"
author:
  name:  JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
coverImage: "https://raw.githubusercontent.com/OpenVoiceOS/ovos_assets/refs/heads/master/OVOS_transcript_Validator.png"
ogImage:
  url: "https://raw.githubusercontent.com/OpenVoiceOS/ovos_assets/refs/heads/master/OVOS_transcript_Validator.png"
---


## No More Mumbo Jumbo! Introducing the OVOS Transcription Validator Plugin

Ever had your beloved OpenVoiceOS assistant respond with a blank stare, or worse, utter something completely nonsensical, after you *thought* you said something perfectly clear? We've all been there. It's like your voice assistant has suddenly decided to speak in tongues, leaving you wondering if you accidentally invoked a poltergeist instead of playing your favorite song.

Well, prepare to banish those garbled woes! We're thrilled to introduce a fantastic new addition to the OVOS ecosystem: the **OVOS Transcription Validator Plugin!**

---

### What's the Big Deal?

Imagine your voice assistant as a highly sophisticated bouncer at the VIP section of a club. Before any "utterance" gets past the velvet rope and into the processing pipeline, this new plugin gives it a thorough once-over. Is it coherent? Is it complete? Does it even make sense in the language you're speaking? If the answer is "nope!" then our bouncer politely (or with an optional "buzz" sound if you prefer!) sends it packing.

No more "Potatoes stop green light now yes" triggering your smart home, or "Play the next song, but make it sound like a cat" confusing your music library. This plugin acts as a quality control gate, ensuring that only valid and meaningful transcriptions move forward, dramatically improving the accuracy and reliability of your voice assistant.

---

### How Does This Magic Happen?

The secret sauce lies in the power of Large Language Models (LLMs)! This plugin leverages the impressive capabilities of LLMs to analyze your spoken input. While it originally rocked with local powerhouses like Ollama, we're super excited to announce that it's now also compatible with **any LLM that speaks the OpenAI API protocol!** This means even more flexibility for you to choose the brain behind your bouncer.

Here's the lowdown on how it works:

1.  You speak, and your voice assistant's Speech-to-Text (STT) engine does its best to transcribe it.
2.  The Transcription Validator Plugin steps in, taking that transcription and the language you spoke.
3.  It sends this information to your chosen LLM (be it a local Ollama model or one accessible via the OpenAI API).
4.  The LLM, with its vast knowledge of language and context, makes a quick decision: "True, this makes sense!" or "False, this is pure gibberish!"
5.  If it's a "False," the utterance is cancelled, preventing any further confusion. You can even configure it to play a little error sound or gently prompt you to repeat yourself.

---

### Get Started and Say Goodbye to Gobbledygook!

Ready to upgrade your OVOS experience and finally have conversations that make sense? Setting up the OVOS Transcription Validator Plugin is a breeze. Check out the [GitHub repository](https://github.com/TigreGotico/ovos-transcription-validator-plugin) for all the installation and configuration details.

So, go forth and chat with your OpenVoiceOS assistant with renewed confidence! With the OVOS Transcription Validator Plugin, your conversations will be clearer, your commands more precise, and those moments of "What on Earth did I just say?!" will become a distant, funny memory.

Happy chatting!

---

## Help Us Build Voice for Everyone 

If you believe that voice assistants should be open, inclusive, and user-controlled, we invite you to support OVOS: 

- **💸 Donate**: Your contributions help us pay for infrastructure, development, and legal protections. 

- **📣 Contribute Open Data**: Speech models need diverse, high-quality data. If you can share voice samples, transcripts, or datasets under open licenses, let's collaborate. 

- **🌍 Help Translate**: OVOS is global by nature. Translators make our platform accessible to more communities every day. 

We're not building this for profit. We're building it for people. And with your help, we can ensure open voice has a future—transparent, private, and community-owned. 

👉 [Support the project here](https://www.openvoiceos.org/contribution)
