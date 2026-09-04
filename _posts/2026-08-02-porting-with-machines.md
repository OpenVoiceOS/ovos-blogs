---
title: "Porting With Machines, and the Licence Question We Could Not Answer"
excerpt: "We rewrote several C, C++ and Java programs (espeak-ng's G2P, Cotovia, AhoTTS, HermiT) as pure Python, with an AI reading the original source and a human orchestrating. No human on our side read the originals. That raises two separate questions: can the output be owned at all, and is it a derivative of the input? We kept the upstream licences because that was cheaper than answering. We still think the question is open."
coverImage: "/assets/blog/porting-with-machines/cover.png"
date: "2026-08-02T00:00:00.000Z"
author:
  name: JarbasAI
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/porting-with-machines/cover.png"
---

## Porting With Machines, and the Licence Question We Could Not Answer

> This blog was originally posted in the [TigreGotico website](https://tigregotico.pt/blog/2026-08-02-porting-with-machines/)

We rewrote a handful of old programs in Python, each one linked here beside the
original it came from. The G2P front-end of
[espeak-ng](https://github.com/espeak-ng/espeak-ng) became
[espyak](https://github.com/TigreGotico/espyak). The Galician and Spanish
transcription rules of [Cotovia](https://gtm.uvigo.es/en/transfer/software/cotovia/)
became [pycotovia](https://github.com/TigreGotico/pycotovia). The Basque linguistic
processing of [AhoTTS](https://github.com/aholab/AhoTTS) became
[ahotts-g2p](https://github.com/TigreGotico/ahotts-g2p). The
[EYE](https://github.com/eyereasoner/eye) N3 reasoner became
[pyeye](https://github.com/TigreGotico/pyeye), and the OWL 2 DL reasoner
[HermiT](http://www.hermit-reasoner.com/) became
[pyhermit](https://github.com/TigreGotico/pyhermit). C, C++ and Java, most of them
older than a decade.

The motive was ordinary. A C program that phonemizes Galician is excellent until you
want it inside a Python speech stack on an ARM board: a compiler, a toolchain,
cross-compilation, a subprocess boundary to marshal text across. A Java reasoner
needs a JVM; pure Python needs `pip install`, and you can open the file that decides
where the stress goes and change it.

The ports were done semi-autonomously: an AI read the original source and wrote the
Python, a human directed the work and checked the output against the original
binary. On several of them nobody on our side ever read the original source; the
model did, and we read the diffs and the parity tests.

That leaves a question we could not answer: **is the result a derivative work, and
who owns it?**

We are engineers. Nothing here is legal advice, and we are not qualified to give
any: this is a description of a decision we made and the reasoning behind it.

---

## Two questions that keep getting conflated

Reimplementing a program by reading its source is not new. What is new is the
arrangement: the reader is a machine, the implementer is the same machine, and
the humans in the loop never saw the original.

There are two independent questions here, almost always collapsed into one, though
you can answer yes to one and no to the other.

1. **Can the output be owned at all?** Copyright attaches to works with authors.
   If a machine produced the code, who is the author?
2. **Is the output a derivative of the input?** Whoever authored it, if anyone
   did, does the result infringe the original?

A **derivative work** is a work based on a pre-existing one, such as a translation
or a port. **Copyleft** licences (the GPL family) let you use and modify code on
the condition that what you distribute stays under the same terms. **Permissive**
licences (MIT, Apache-2.0, BSD) let you ship the result inside proprietary software.
The **LGPL** sits between the two.

---

## Question one: is there an author?

Copyright needs a human author. The US Copyright Office has held this consistently
in its [AI policy guidance](https://copyright.gov/ai/ai_policy_guidance.pdf), and in
[*Thaler v. Perlmutter*](https://media.cadc.uscourts.gov/opinions/docs/2025/03/23-5233.pdf)
the D.C. Circuit agreed: the Copyright Act "requires all eligible work to be authored
in the first instance by a human being" (No. 23-5233, D.C. Cir., 18 March 2025). The
Supreme Court [denied certiorari](https://www.scotusblog.com/cases/thaler-v-perlmutter/)
on 2 March 2026, leaving that holding in place. The European standard lands in a similar place: protection requires the
"author's own intellectual creation", which presupposes an author who creates.

Neither says AI-assisted work is unprotectable, only that what a machine generates
on its own is not, and where the line falls depends on how much a human
contributed: in our ports, real but thin, choosing the target, structuring the
package, judging the parity failures. It is not obvious that this makes us the
author of the transcription rules.

That produces an awkward object: a licence is a grant of permission by a rights
holder, so if nobody holds rights in the output, the licence file at the root of the
repository is decoration, and the argument eats its own tail. Anyone arguing that
machine-generated code is unowned is arguing that their own release terms are
unenforceable, before they get anywhere near upstream's.

---

## Question two: is it derived?

This one does not care who the author is. Infringement turns on access to the
original plus substantial similarity to its protected **expression**, the
particular way the thing was written, not what it does, and we had access: the
model read the source, and that half is not in dispute.

The similarity half is where the language change matters less than people expect.
Translating a novel produces a derivative work; changing the language defeats a
claim of literal copying, but not a claim about structure, the order of the
transformations, the decomposition into functions, the shape of the rule tables.

A tool does not launder anything, either: if you direct a copy and ship the
result, you made it, and "the model wrote it" is no more a defence than "the
compiler emitted it".

---

## The strongest argument on the other side

There is a serious case that a cross-language reimplementation is fine. In
[*SAS Institute v World Programming*](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62010CJ0406)
(CJEU, C-406/10, 2 May 2012), the Court held that "neither the functionality of a
computer program nor the programming language and the format of data files used in a
computer program in order to exploit certain of its functions constitute a form of
expression of that program". The
[Software Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009L0024)
says the same in Article 1(2): "Ideas and principles which underlie any element of a
computer program, including those which underlie its interfaces, are not protected by
copyright under this Directive." The Court also held that a licensee may observe,
study or test a program's functioning to determine the ideas behind it, and
reimplement them.

That means what a phonemizer *does*, turning this grapheme sequence into that
phoneme, is not owned by anyone: the Galician stress rules are facts about
Galician, and the OWL 2 direct semantics are a published W3C specification. A
reimplementation reproducing behaviour rather than expression is lawful, and a
rewrite across languages sits much further from infringement than a copy-paste.

The gap between that argument and our situation is the source: *SAS* is about
studying behaviour, and our model read the code.

---

## The precedent that already exists, and how far it reaches

The "machine output has no author, so no copyright attaches" argument is not a
thought experiment: model distillation and synthetic training data both rest on
it, industry-wide. The clearest public statement is
[Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), a widely used open TTS
model whose card says it was trained exclusively on permissive or non-copyrighted
audio, listing among the permissible sources:

> Synthetic audio generated by closed TTS models from large providers

footnoted to the US Copyright Office's
[AI policy guidance](https://copyright.gov/ai/ai_policy_guidance.pdf): machine
output has no human author, so nothing subsists to infringe by training on it. The
model ships Apache-2.0, and the card also excludes synthetic audio from *open* TTS
models and custom voice clones, a sign the authors worked out where the argument
stops.

That precedent solves the other half of the problem. Kokoro's argument is about the
**input**: what they consumed was itself machine-generated, so the claim is it
carried no copyright to begin with. Our situation is the mirror image: what we
consumed, espeak-ng's C, Cotovia's C++, and HermiT's Java, is human-written and
copyrighted by named people at named universities, and what came *out* was
machine-written, so the argument lands on our output, not our input, and does not
travel upstream.

There is a further asymmetry: Kokoro's residual exposure, if any, is contractual
rather than copyright, and that obligation survives even where copyright does not.
Copyleft does not work that way; nobody clicks "I agree" to the GPL, and it binds
you only if what you made is a derivative work.

So it collapses back onto the question nobody has answered. If a cross-language,
machine-written reimplementation is not a derivative work, the GPL was never engaged.
If it is one, it applied from the first line. There is no third state.

---

## Clean rooms, and whether two models make one

The classic answer to this problem is the clean-room protocol: one team reads the
original and writes a functional specification of what the program does, and a
second team, which has never seen the original, implements only from that
specification. That is how the PC BIOS was reimplemented, and why it survived.

The obvious modern move runs one model to read and describe, and a different
model with a fresh context to implement, structurally the same protocol. It has
the right shape, but a clean room is not a technical construct, it is an
**evidentiary** one, whose entire value is demonstrating the separation to
somebody who assumes you cheated. The two-model version means something only if
the discipline holds:

- The two sides genuinely never share context. Not "we told it to forget", but separate
  runs, separate transcripts.
- The specification carries behaviour and nothing else. No pseudocode that mirrors
  the original's control flow. No identifier names. No function ordering. Those are
  expression, and a specification full of them is the original in a costume.
- Both sides' records are kept, because a clean room you cannot evidence is a story.

If the reading side emits structure, the taint passes straight through, and you
have a derivative work with extra steps and a larger token bill.

We did not do this: the implementing model read the source directly, which is why
the pycotovia README says, in public:

> Because the implementing AI **read the GPL source**, this is **not a clean-room
> reimplementation** and we make no such claim. It is a source-derived port.

We would rather have that written down than have to answer it later.

---

## What we did

We kept the upstream licences: copyleft in, copyleft out; permissive in,
permissive out. `espyak` is GPL-3.0-or-later, matching espeak-ng; not even a hard
case, since it bundles espeak-ng's own data files verbatim (`dictsource`,
`phsource`, `lang`), and no theory of authorship touches files copied unchanged.
`pycotovia` is GPL-3.0, matching Cotovia (GPL-3.0+). `ahotts-g2p` and
`pyAhoTTS-Iparrahotsa` are GPL-3.0, matching AhoTTS. `pyeye` is MIT, matching EYE.
`pyhermit` is LGPL-3.0, matching HermiT.

We did this not because we established it was required, but because the asymmetry
made the decision without needing the answer: copyleft costs us almost nothing
here, while a permissive licence on something that should have been copyleft is
the worse mistake, discovered late and in public, after people have built on
terms you were not entitled to offer.

That asymmetry is worth watching for in general: nothing complains when a
structural port of an LGPL original quietly becomes Apache-2.0 in translation.
Going back over the whole set turned up two of these, both undramatic: a wrapper declaring Apache-2.0 whose upstream
is MIT, and repositories whose README named a licence with no corresponding file.
You check, you fix what needs fixing, and the interesting question stays open.

You do not need to resolve the law to make this decision; you take the branch
where being wrong is survivable.

---

## The same question, pointing the other way

The same logic applies to code we receive: somebody opens a pull request written by
a model, and the question is what they are granting us.

Most projects handle this with the
[Developer Certificate of Origin](https://developercertificate.org/): the
`Signed-off-by:` line certifying that you wrote the contribution, or that it came
from a compatible source you have the right to submit. It is how the Linux kernel
and QEMU establish where their code came from.

For a machine-written patch neither limb is straightforwardly true: if machine
output carries no copyright, the contributor holds no rights in it; if instead it
derives from training data, the rights belong to whoever wrote that data. Either
way they cannot grant what they do not hold, and the signature, though not
dishonest, transfers something that was never theirs to transfer.

The consequences differ sharply. On the first branch, material nobody owns can be
used by anyone, but copyleft cannot attach to material carrying none, so a GPL
project taking in machine-written patches quietly accumulates parts its own
licence may not reach. The second has teeth: if a model reproduces memorised
training data verbatim, more common with idioms than with novel logic, you have
accepted somebody else's copyrighted code on an assurance from a contributor who
had no way to check, and that lands hardest on the projects with the most careful
provenance.

Debian is working through this. A
[general resolution on LLM usage](https://www.debian.org/vote/2026/vote_002) reached
its discussion period in July 2026, ranging from forbidding LLM-assisted
contributions outright to permitting them under disclosure and accountability,
and nothing is decided. An
[earlier attempt in 2024](https://lwn.net/Articles/972331/) also ended without a
resolution: the objection was not that the concern was baseless but that a rule
nobody can enforce is not worth adopting.

We are poorly placed to be strict: we ship ports written by a model, and a
project that publishes machine-written code while refusing machine-written
contributions holds two incompatible positions at once.

Licensing is not the only axis this argument runs along, though it is the one this
post is about. Codeberg adopted two member-approved motions in July 2026 and
[set out its reasoning](https://blog.codeberg.org/protecting-our-floss-commons-from-llms.html)
almost without mentioning licences: energy and hardware cost, crawler traffic,
unmaintained single-use projects, and the review burden low-effort patches put on
maintainers. That is separate from whether the code can be licensed. Debian is
voting on the first and has not concluded; Codeberg acted on the second.

---

## The part we are not going to pretend is settled

We may not have needed to do any of that.

Take the three arguments together. Functionality is not protected; the CJEU said so
directly. Purely machine-generated output may have no human author, so there may be
no new copyright to worry about and, awkwardly, none of ours either. And a two-model
protocol run with real discipline might be a genuine clean room, in which case the
port never touched protected expression at all.

If all three hold, some of these ports could have been permissively licensed with a
clear conscience. If none hold, our conservative choice was simply correct. We do
not know which, we did not test it, and we are not interested in being the case that
settles it.

The question does not go away by being ignored. This kind of porting is becoming
ordinary, and there is a great deal of unmaintained C worth moving somewhere it can
be maintained. Every one of those ports faces the same two questions, and most will
answer by not asking. So will every project that merges a patch it did not write,
which is to say all of them.

---

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
