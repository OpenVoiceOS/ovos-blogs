---
title: "Introducing the First Phonemizer for Barranquenho"
excerpt: "Today marks an exciting milestone for linguistic preservation! We're thrilled to announce the development of the very first phonemizer for Barranquenho, a truly unique Ibero-Romance language spoken in the Portuguese municipality of Barrancos."
coverImage: "/assets/blog/barranquenho/thumb.png"
date: "2025-12-12T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/barranquenho/thumb.png"
---

## Introducing the First Phonemizer for Barranquenho

Today marks an exciting milestone for linguistic preservation! We're thrilled to announce the release of [g2p_barranquenho](https://github.com/TigreGotico/g2p_barranquenho),  the **very first Grapheme-to-Phoneme (G2P) phonemizer for [Barranquenho](https://en.wikipedia.org/wiki/Barranquenho)**, a truly unique Ibero-Romance language spoken in the Portuguese municipality of Barrancos.

This isn't about a technical achievement; it's a step towards safeguarding and revitalizing a language that embodies a rich cultural heritage.

### Why Barranquenho, and Why Now?

Barranquenho stands at a fascinating crossroads of Portuguese and Spanish linguistic traditions, reflecting centuries of cross-border interaction. Despite its distinctiveness, resources for Barranquenho have historically been scarce, making it a challenging language for digital representation and AI development.

However, a monumental effort from the Barrancos Municipal Council is changing that. Just recently, the Council made available three foundational linguistic documents, an "enormous step" for Barranquenho culture:

* **Dicionário de Barranquenho (Barranquenho Dictionary)**
* **Convenção Ortográfica do Barranquenho (Barranquenho Orthographic Convention)**
* **Gramática Básica do Barranquenho (Basic Barranquenho Grammar)**

These publications, highlighted in their official announcement ["Un Enormi Passu para u Barranquenhu i para a Cultura Barranquenha!"](https://cm-barrancos.pt/21976/un-enormi-passu-para-u-barranquenhu-i-para-a-cultura-barranquenha), provide the crucial backbone for our work. The **Convenção Ortográfica do Barranquenho** in particular has been instrumental, offering the consistent rules we needed to build our G2P model.

### What is a G2P Phonemizer?

In simple terms, a G2P phonemizer is a system that takes a written word (graphemes) and converts it into its phonetic representation (phonemes). Think of it as teaching a computer how to "pronounce" a word, even if it's never heard it before. For Barranquenho, this means translating its unique spelling into the [International Phonetic Alphabet (IPA)](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet).

Our rule-based phonemizer accounts for Barranquenho's distinct phonetic features, including vowel allophony, nasalization, and the specific pronunciations of consonants like 'r' and 's', which can vary significantly from standard Portuguese or Spanish. 

> "Un Enormi Passu para u Barranquenhu i para a Cultura Barranquenha" -> "ũ ẽjoɾmj pasu paɾɐ u bɐrɐ͂keɲu j paɾɐ ɐ kultuɾɐ bɐrɐ͂keɲɐ"

### The Power of this First Step

There is still a long way to go before Barranquenho speakers no longer need to switch to Portuguese or Spanish to interact with voice technology. The creation of this G2P phonemizer is more than just a cool linguistic tool; it's the **foundational layer** for developing advanced AI capabilities for Barranquenho. With a reliable way to map written words to their sounds, we can unlock:

* **Speech-to-Text (STT) Systems:** Imagine speaking in Barranquenho and having your words accurately transcribed. This could revolutionize documentation, communication, and accessibility. 
* **Text-to-Speech (TTS) Systems:** Give digital voices the ability to speak Barranquenho, opening doors for educational tools, audiobooks, and interactive experiences.

This work aligns perfectly with our mission of making voice AI accessible for everyone in any language.

### Join Us: Help Bring Barranquenho Voices to AI!

While the orthographic convention gives us the rules for pronunciation, **real-world speech data is invaluable** for training robust AI models.

**We are putting out a call to the Barranquenho community and anyone passionate about linguistic preservation:**

**We need recordings of spoken Barranquenho!**

Whether you're a native speaker, an enthusiast, or a linguist, your voice can help us create the next generation of Barranquenho AI resources. If you are interested in contributing, please reach out to us!. Every voice counts, and together, we can ensure that Barranquenho thrives in the digital age.

Let's make some noise for Barranquenho! 📢

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
