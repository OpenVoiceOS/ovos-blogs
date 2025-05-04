---
title: "OpenVoiceOS now available on containers"
excerpt: "Learn how OpenVoiceOS is now available as containerized services for easier installation and management."
coverImage: "/assets/blog/hello-world/cover.jpg"
date: "2023-05-02T00:00:00.000Z"
author:
  name: Strongthany
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/hello-world/cover.jpg"
---

Given that OpenVoice OS is a complex suite of software, running the micro-services via containers makes sense for better simplicity. A container provides an efficient way to run the platform's various services with isolation and a microservice approach. By making use of a container system, it is much easier to manage, update and overall work with the various services that make up OpenVoice OS.

These services have been divided into containers to provide isolation and follow a microservice approach. These containers include:

- ovos_messagebus: Message bus service which acts as the nervous system of Open Voice OS.
- ovos_phal: PHAL is the Platform/Hardware Abstraction Layer of the platform, which completely replaces the concept of hardcoded enclosure from mycroft-core.
- ovos_phal_admin: This service is intended to handle any OS-level interactions requiring escalation of privileges.
- ovos_audio: The audio service handles playback and queuing of tracks.
- ovos_listener: The speech client is responsible for loading STT, VAD, and Wake Word plugins.
- ovos_core: The core service is responsible for loading skills and intent parsers.
- ovos_cli: The command line for Open Voice OS.
- ovos_gui_websocket: The WebSocket process to handle messages for the Open Voice OS GUI.
- ovos_gui: Open Voice OS graphical user interface

To allow data persistence, Docker/Podman volumes are required which avoid downloading requirements every time that the containers are re-created. These volumes include:

- ovos_listener_records: Wake word and utterance records.
- ovos_models: Models downloaded by precise-lite.
- ovos_vosk: Data downloaded by VOSK during the initial boot.

Our community member [Goldyfruit][1] has stated &#8220;we are bringing a new way to install skills, each skill will have its own container which provides better flexibility and isolation.&#8221; A community member of Mycroft before moving over to OVOS, Goldy had contributed greatly to porting Mycroft to a container based system. When asked how they want the project to impact OVOS, Goldyfruit said &#8220;I think containers is an easy way to help new people to join OVOS. It&#8217;s not disruptive, not that much to do on the host. Just run `docker compose` and that's it (in a wonderful world :p)"

For more information on how to get started, check out our [GitHub repository][2]. We encourage anyone who is interested to participate and make use of our software, and with the container based approach we hope to make it easier for people to set up and use OVOS. You can connect with us in our [Matrix rooms][3]. Come say hi! Best of luck and see you soon!

[1]: https://github.com/goldyfruit
[2]: https://github.com/OpenVoiceOS/ovos-docker/
[3]: https://matrix.to/#/!XFpdtmgyCoPDxOMPpH:matrix.org?via=matrix.org
