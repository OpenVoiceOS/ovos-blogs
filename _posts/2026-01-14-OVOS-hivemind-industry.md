---
title: "OVOS & HiveMind in the Manufacturing Industry"
excerpt: "The COALA and WASABI EU projects have built an entire industrial voice-assistant framework around OVOS + HiveMind, integrating them with their own tools, UI, and conversation engines."
coverImage: "/assets/blog/ovos-hivemind-industry/thumb.png"
date: "2026-01-14T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/ovos-hivemind-industry/thumb.png"
---

# OVOS & HiveMind in the Manufacturing Industry

> This blog was originally posted in the [TigreGotico website](https://tigregotico.pt/blog/2025-11-26-OVOS-hivemind-industry)

As the lead developer of **[OpenVoiceOS](https://openvoiceos.org)**, maintained by a non-profit, and the creator of **[HiveMind](https://jarbashivemind.github.io/HiveMind-community-docs/)**, I’ve always believed in open, privacy-respecting voice technology. What I did not anticipate was how quickly these tools would end up in industrial research, especially without any direct involvement from me.

The **[COALA](https://coala-ai.de)** and **[WASABI](https://wasabiproject.eu)** EU projects have built an entire industrial voice-assistant framework around [OVOS](https://openvoiceos.org) + [HiveMind](https://jarbashivemind.github.io/HiveMind-community-docs/), integrating them with their own tools, UI, and conversation engines.

I am not involved with these deployments, but the fact that the stack is being adopted organically is a strong validation of its design.

---

# WASABI Open Call

The 2nd [WASABI Open Call](https://wasabiproject.eu/wp-content/uploads/2025/08/WASABI_Guide_for_Applicants_2nd-OC_vFIN.pdf) to provide financial support to at least 10 experiments led by SMEs recently closed.
This open call is designed to support AI-based digital assistance experiments involving SMEs from manufacturing.

All WASABI Open Call experiments are required to:

* run the **WASABI/COALA OVOS Docker stack**
* connect via **HiveMind**
* develop a custom **OVOS Skill** containing their industrial logic

The usage of OVOS/Hivemind is explained in these 2 documents from the Wasabi project:
- [Deliverable D2.1](https://wasabiproject.eu/wp-content/uploads/2024/01/WASABI_D2.1_template_v0.7_FINAL.pdf)
- [Deliverable D2.4](https://files.wasabiproject.eu/wp-content/uploads/2023/Docs/wp2/Deliverables/D2.4/WASABI_D2.4_Joint%20WASABI%20Demonstrator_v0.5_final.pdf)

![wasabi_ovos](/assets/blog/ovos-hivemind-industry/wasabi_stack.png)

---

## Examples of Industrial Applications

### **1. Worker Guidance & Assembly Support**

Experiments like **[TICONAI](https://wasabiproject.eu/ticonai-2)** and **[SKITE](https://wasabiproject.eu/skite-main-2)** are using OVOS skills to guide workers during complex tasks such as assembling components, validating procedures, or providing step-by-step instructions hands-free.

### **2. Quality Control and Error Reduction**

Projects like **[WALLABI](https://wasabiproject.eu/wallabi)** and **[HUMANENERDIA](https://wasabiproject.eu/humanenerdia)** focus on providing workers with real-time instructions and checklists to prevent mistakes. Voice assistants help operators verify settings, remember safety checks, or cross-check parameters.

### **3. Predictive Maintenance Assistance**

Experiments such as **[GENIUS-PM](https://wasabiproject.eu/genius-pm)** use the assistant to give maintenance techs quick access to machine health data, fault explanations, and repair steps—especially when their hands are occupied.

### **4. Logistics, Material Handling & Warehouse Support**

**[VELO](https://wasabiproject.eu/velo-2)** and **[AIVEA](https://wasabiproject.eu/aivea)** use voice to help workers locate items, confirm inventory, or check delivery tasks while moving around a shop floor.

### **5. Onboarding and Training**

**[ONBOARD](https://wasabiproject.eu/onboard)** and **[AI-MODE](https://wasabiproject.eu/ai-mode)** test how new employees can be guided through tasks using voice guidance, reducing the burden on supervisors.

### **6. Sustainability, Waste Tracking & Resource Efficiency**

**[VAFER](https://wasabiproject.eu/vafer)** integrates voice interfaces with systems that monitor recycling, material reuse, and resource flows—hands-free reporting in factory environments.

All of these rely on OVOS and on HiveMind for routing communication between devices, Android UI, and backend systems.

---

# What COALA/WASABI Built on Top of OVOS

Although the projects produced no open-source industrial skills, they did create several components around OVOS + HiveMind:

### **1. A RASA-based Domain Assistant (DA)**

Earlier COALA research developed a **RASA NLP pipeline** trained on manufacturing conversations (about quality checks, troubleshooting, machine operation).
In WASABI, this RASA engine is plugged into OVOS as a **skill**, handling domain-specific dialog.

### **2. The COALA Android App**

An Android front-end for workers, connecting to OVOS through HiveMind.

Early version released here:
[https://github.com/BIBA-GmbH/Mycroft-Android](https://github.com/BIBA-GmbH/Mycroft-Android)

Features include:

* login via Keycloak
* text or voice chat
* UI for instructions, warnings, and notes
* HiveMind-based messaging

### **3. A Full Docker-Based Industrial Stack**

Both projects ship a preconfigured Docker environment bundling:

* OVOS
* HiveMind
* Keycloak (user management)
* RASA NLP engine
* COALA connector services

This forms the standard industrial voice-assistant stack that all WASABI experiments must deploy.

### **4. An Industrial Speech Dataset**

COALA published a speech dataset recorded in factories and workshops:
[https://zenodo.org/record/8268928](https://zenodo.org/record/8268928)

---

# Why Industry Chooses OVOS + HiveMind

The appeal is straightforward:

* **Full transparency** (crucial for regulated sectors)
* **Local/edge deployment** (no cloud dependency)
* **Easy to integrate into existing equipment**
* **Modular enough for custom proprietary skills**
* **Distributed voice networks** (HiveMind satellites across a factory)

In short: the combination is flexible, vendor-neutral, and respects industrial data constraints.

---

# Closing Thoughts

I didn’t set out to build an industrial standard.
I set out to build something open, reliable, and user-controlled.

Seeing OVOS and HiveMind adopted by COALA/WASABI, without my involvement or promotion, is a quiet but powerful sign that open-source voice technology is maturing.

A transparent, modular voice stack is no longer just a community dream.

It’s becoming part of the industrial toolset used to guide workers, reduce errors, improve maintenance, and ensure safer operations.

This is only the beginning.

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
