---
title: "How to Contribute to OpenVoiceOS"
excerpt: "OpenVoiceOS is a collaborative effort across many small repositories. This is how a pull request moves from draft to merge, who reviews it, and what we ask of its commits."
coverImage: "/assets/blog/contributing/thumb.png"
date: "2025-10-11T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/contributing/thumb.png"
---

## How to Contribute to OpenVoiceOS

OpenVoiceOS is a collaborative effort across many small repositories. Starting on an open-source project can feel intimidating, and you might worry about a mistake or a rule you did not know. The process below is built so that neither costs you anything. This is how we handle **pull requests (PRs)** and what to expect when you contribute.

---

## The short version

* **Open a draft PR early.** Do not wait for perfection; we want to see work in progress.
* **The bot reviews first, where it can.** On our larger repositories CodeRabbit reviews every non-draft PR automatically. On smaller ones a maintainer requests it.
* **Anyone can review.** You do not have to be a maintainer to review another PR.
* **Use Conventional Commits** (for example `feat: add new command`).
* **History is squashed.** We squash-merge your PR, so a tidy local history is optional.
* **Ask.** If anything is unclear, ask in the PR.

---

## Who reviews

OpenVoiceOS is volunteer-driven. A small core team owns the overall architecture and merges PRs, but they are not the only people reviewing code. Everyone is welcome to review PRs.

1.  **Any input counts.** A review comment, a suggestion, or "I tested this with X and it works" all help.
2.  **Reviewing teaches.** Reading others' code shows how OpenVoiceOS works underneath.

When you open your own PR, consider reading a few others too.

---

## Opening a pull request

Open PRs early, even when the code is incomplete. Early eyes mean feedback while the design is still cheap to change.

### The bot

When a PR is marked ready for review, the **CodeRabbit** bot reviews it first on repositories where it runs automatically; its platform rule skips repositories under ten stars, so on a small repository a maintainer requests the review. It catches style problems and small mistakes before a human reads it. While you are still working, keep the PR a **draft** and the bot stays out of the way; mark it **ready for review** when you want feedback.

### Commits

A PR may pile up commits while you work. We **squash-merge every PR** into `dev`, so all of them become one commit that links back to the PR. Spend the time on the change, not on rewriting local history.

### Code style

We loosely follow **PEP8**. Match the style of the surrounding code; CI and the bot handle the rest.

---

## After you open a PR

1.  **Bot review.** CodeRabbit gives the first round of feedback, automatically or on a maintainer's request.
2.  **Maintainer review.** The core team reviews functionality and design.
3.  **Iteration.** Expect a few rounds of changes; switch back to draft while you work on them.
4.  **Merge.** When the checks pass and the review is done, a maintainer merges into `dev`.

### If a PR is not merged

This happens, most often because the architecture or the direction moved. It is not a judgment of the work. Where it fits, we suggest an alternative, such as shipping the change as a standalone plugin you maintain.

---

## If something is unclear

Ask in the PR. If a commit message needs a change or the code needs a small refinement, a maintainer fixes it or walks you through it. Questions about the process itself go to the [community docs](https://github.com/OpenVoiceOS/community-docs/issues).

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
