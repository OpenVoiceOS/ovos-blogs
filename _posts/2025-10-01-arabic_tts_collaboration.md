---
title: "Voices of Inclusion: Reflections on Our Collaboration"
excerpt: "As the External Collaborations Lead at Planet Blind Tech, I recently had the privilege of working closely with OpenVoiceOS on a groundbreaking project: training an open-source Arabic voice."
coverImage: "/assets/blog/arabic_tts_collaboration/thumb.png"
date: "2025-10-01T00:00:00.000Z"
author:
  name:  Shams Al-Din
  picture: "https://yt3.googleusercontent.com/0tRngpJPVj_kWIEULAE9OS2nTP3r8W60W4yesooO39S-EYUxlmu1CCEdn_zI1ym04i729fCO6w=s160-c-k-c0x00ffffff-no-rj"
ogImage:
  url: "/assets/blog/arabic_tts_collaboration/thumb.png"
---

## Voices of Inclusion: Reflections on Our Collaboration

As the **External Collaborations Lead** at [**Planet Blind Tech**](https://www.youtube.com/@planetblindtech), I recently had the privilege of working closely with **OpenVoiceOS** on a groundbreaking project: **training an open-source Arabic voice**. This effort was far more than a technical experiment; it was a meaningful step toward **digital inclusion for blind and visually impaired communities**.

I first encountered their project while exploring the intersections between assistive technology and speech synthesis. It was clear that our missions aligned. Their dedication to creating open voice technologies resonated with our own pursuit of accessible tools for blind users. The chance to contribute to an Arabic TTS (Text-to-Speech) voice felt like the bridge we had long been waiting for.

Our team’s role focused on two essential tasks: **gathering datasets and testing the resulting models**. The process was not without its hurdles. The initial dataset we worked with fell short of the desired quality. Yet, the **patience, openness, and technical guidance** from our partners encouraged us to refine our approach. Together, we introduced a more robust datase and trained a model with [Phoonnx](https://github.com/TigreGotico/phoonnx) and the eSpeak phonemizer, which produced results that genuinely reflected the richness of the Arabic language.

**Hear the results**: Examples of the new Arabic Open-Source Voices.


<audio controls>
  <source src="/assets/blog/arabic_tts_collaboration/dii_ar.wav" type="audio/wav">
  Your browser does not support the audio element.
</audio>

<audio controls>
  <source src="/assets/blog/arabic_tts_collaboration/miro_ar.wav" type="audio/wav">
  Your browser does not support the audio element.
</audio>

<audio controls>
  <source src="/assets/blog/arabic_tts_collaboration/miro_ar_v2.wav" type="audio/wav">
  Your browser does not support the audio element.
</audio>

The impact of this work is already tangible. An **Arabic open-source voice** is not just another model, it is a lifeline for blind individuals who rely on screen readers and accessible applications. For the first time, many users can envision a future where they are not tied to proprietary voices or limited to languages that do not fully capture their identity. This achievement lowers barriers, empowers developers to integrate the voice into assistive tools, and above all, gives blind users a sense of agency.

What began as a collaboration to create a voice has evolved into something larger: a **demonstration of what open technology can mean for inclusion**. For our community, this project is more than sound, it is **dignity, independence, and opportunity**. And for me personally, it stands as a reminder of the transformative power of working together across communities to ensure no voice, and no person, is left unheard.

You can find the collected datasets and trained models on huggingface:

- [Arabic TTS Model - Dii](https://huggingface.co/OpenVoiceOS/phoonnx_ar-SA_dii_espeak)
- [Arabic TTS Model - Miro](https://huggingface.co/OpenVoiceOS/phoonnx_ar-SA_miro_espeak)
- [Arabic TTS Model - Miro (V2)](https://huggingface.co/OpenVoiceOS/phoonnx_ar-SA_miro_espeak_V2)
- [Arabic G2P Dataset](https://huggingface.co/datasets/TigreGotico/arabic_g2p)
- [Synthetic Arabic TTS Training Data - Miro with Diacritics](https://huggingface.co/datasets/TigreGotico/tts-train-synthetic-miro_ar-diacritics)
- [Synthetic Arabic TTS Training Data - Dii with Diacritics](https://huggingface.co/datasets/TigreGotico/tts-train-synthetic-dii_ar-diacritics)

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
