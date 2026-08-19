---
title: "Own Your Assistant: Introducing the OVOS Wake Word Speaker Validator"
excerpt: "Tired of your open-source voice assistant accidentally activating when someone on TV says a similar phrase? Or maybe you just don't want your house guests commandeering your smart home? "
coverImage: "/assets/blog/ww-validator/thumb.png"
date: "2025-11-01T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ww-validator/thumb.png"
---

## Own Your Assistant: Introducing the OVOS Wake Word Speaker Validator

Tired of your open-source voice assistant accidentally activating when someone on TV says a similar phrase? Or maybe you just don't want your house guests commandeering your smart home? OpenVoiceOS is excited to introduce a game-changing layer of security and precision to your voice assistant experience: the **OVOS Wake Word Speaker Validator\!**

This innovative plugin takes wake word detection a huge step further. It doesn't just check *if* the wake word was spoken; it verifies *who* spoke it.

-----

### Your Voice is the Key

The concept is simple yet powerful: **Speaker Validation.**

1.  **Voice Enrollment:** You begin by providing the validator with a list of your voice samples—specifically, `.wav` files of you saying the wake word—in your `mycroft.conf` configuration.
    ```json
    "listener": {
        "ww_validator": {
            "module": "ovos-ww-speaker-validator",
            "ovos-ww-speaker-validator": {
                "threshold": 0.5,
                "ww_samples": ["/home/user/my_voice_sample_1.wav", "/home/user/my_voice_sample_2.wav"]
            }
        }
    }
    ```
2.  **Embedding Generation:** The plugin uses these files to create a unique **voice embedding** (a numerical representation of your voice's characteristics) and stores it for comparison.
3.  **Real-Time Vetting:** When your wake word is detected, the audio is captured, and a new embedding is generated from the spoken phrase.
4.  **The Bouncer:** The new embedding is immediately compared against the known, enrolled embeddings.
      * **Match!** If the speaker is recognized as an authorized user, the wake word is accepted, and the assistant proceeds to listen for your command.
      * **No Match!** If the speaker is unknown (a guest, a TV show, or a false positive from a poor-quality mic), **the audio is completely ignored,** and the assistant stays dormant.

-----

### The End of False Activations

This extra layer of security offers some amazing benefits:

  * **Goodbye, False Positives:** Say goodbye to those annoying phantom activations caused by background noise or similar-sounding words on the radio or TV. Since the wake word must be followed by a recognized voice, your assistant stays silent when it's not being addressed by you.
  * **Household Security:** Effectively **block guests from voice-controlling your house** or accessing sensitive information. Your assistant becomes truly personal, responding only to authorized family members.
  * **Empower Less-Accurate Engines:** You can now safely use less computationally expensive or less accurate wake word engines. The speaker validator acts as a robust second-stage filter, **filtering out the majority of false alarms** that those simpler engines might generate, giving you better performance without sacrificing reliability.

The **OVOS Wake Word Speaker Validator** is about putting you in control. It's an easy, powerful way to make your OpenVoiceOS experience more reliable, more personal, and more secure. Get started today and let your assistant finally recognize its true owner\!

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
