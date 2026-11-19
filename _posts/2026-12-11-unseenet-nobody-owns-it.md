---
title: "Nobody owns it: from OpenVoiceOS to Unseenet"
excerpt: "OpenVoiceOS exists so that the voice assistant in your home is yours, not a company's. The same problem goes far beyond voice. This is about Unseenet, a discussion network I am building on the ideas of the old Usenet: nobody owns it, nobody can switch it off, and you decide what you post and what you see."
coverImage: "/assets/blog/unseenet/cover.png"
date: "2026-12-11T20:00:00.000Z"
author:
  name: "andlo"
  picture: "https://github.com/andlo.png"
coauthors:
  - name: "Claude (Anthropic)"
    picture: "https://www.anthropic.com/favicon.ico"
ogImage:
  url: "/assets/blog/unseenet/cover.png"
---

*This post is not really about voice assistants. But it is about the same
thing OpenVoiceOS is about, so I hope you will bear with me.*

## What OpenVoiceOS really is

It is easy to describe OpenVoiceOS as "an open source voice assistant".
That is true, but it is not the point. OVOS is a set of building blocks:
a messagebus, wake words, speech recognition, intents, skills, voices.
You can put them together into a voice assistant, or into something
nobody has thought of yet.

The point is *why* it exists. A voice assistant is a microphone in your
home. With the closed ones you cannot really know when it listens, where
the recordings go, who hears them, what they are used for, or for how
long they are kept. You are told, in a privacy policy, and you can
choose to trust it. You cannot check it.

OVOS is the free alternative. You can read every line. You choose where
speech recognition runs, and it can run on your own machine. You choose
which skills may talk to the internet. If you do not like a part, you
swap it for another. Nobody can switch it off from far away, and nobody
can change the rules under you.

## It is not only voice

Once you start looking, the same pattern is everywhere. The computers,
phones and tablets we use run on platforms owned by a handful of large
companies. The places where we talk to each other - Facebook, X, TikTok,
Instagram and the rest - are owned and run by private companies too.

They tell us they do not censor, and that they do not misuse our data.
Maybe that is true. But we cannot check it, and we have no say in it.
As users, and as citizens, we have almost no influence on what happens:

- what we see is sorted by an algorithm made to keep us scrolling;
- an account can be closed, and every group and conversation with it;
- what was said can be removed, or quietly made harder to find;
- who talked to whom, when and from where can be logged, sold, or
  handed over;
- the whole place can be bought, changed or closed.

None of this needs bad intentions. It is simply what owning the place
where people talk lets you do.

## It used to be different

When I first got on the internet, a lot of the talking happened on
**Usenet**. Usenet was newsgroups: `comp.lang.python`, `rec.music`,
`dk.snak` and thousands of others. You connected to *your* news server,
typically the one at your university or your internet provider. Your
server passed articles on to its neighbours, and they passed them on, and
before long your post had travelled around the world.

Nobody owned Usenet. There was no head office, no single server to
switch off, and nobody who could make a post disappear from the whole
network. Anyone could run a server, and you could read it with any
newsreader, because the way it all worked was written down in open
documents: RFCs. [RFC 977](https://www.rfc-editor.org/rfc/rfc977) from
1986 described NNTP, the protocol news servers and readers speak, later
replaced by [RFC 3977](https://www.rfc-editor.org/rfc/rfc3977), and the
articles themselves were described in RFC 1036 and later
[RFC 5536](https://www.rfc-editor.org/rfc/rfc5536).

Usenet was not perfect. It drowned in spam, it had no encryption, and
anyone could pretend to be anyone. But it had the shape I keep coming
back to: **a network that belongs to the people who use and run it.**

## So I asked: can we do that again?

What would it take to build a place to talk that:

- nobody owns, and nobody can take down, block or censor;
- has no single place where anyone can be forced to remove posts;
- lets *you* decide what you post and what you see;
- lets you be anonymous if you want to;
- and still has some kind of say for the people using it - because
  "nobody decides anything" is not the same as freedom?

That is where **Unseenet** comes from. *Usenet, unseen.*

![Unseenet: clients reach nodes over Tor, nodes are onion services that peer with each other, a web entrance lets a browser in, and a gateway links other networks](/assets/blog/unseenet/overview.svg)

## How Unseenet works

Unseenet takes the Usenet model and adds what we have learned since.

**Nodes, like the old news servers.** Anyone can run a node: on a
Raspberry Pi, in a container in a homelab, on a free cloud VM, or even
from a USB stick. Nodes exchange groups and posts with each other, the
way news servers did. There is no central server and no company.

**Every node is hidden.** Each node is a Tor onion service. It has no
address outside Tor, needs no public IP and no port forwarding, and
nobody needs to know where it is. Everything goes over Tor, so nobody
watching your connection sees what you read or write, and your node does
not learn where you are.

**You are your key.** There is no account, no e-mail and no phone number.
Your client makes a key, and that key is you. You can have as many as
you like - one for each group, if you want to keep them apart. A name
like `@lorensen` is optional.

**Every post is signed, private things are encrypted.** Nobody can change
your post or post in your name, because every post is signed by its
author's key. Closed groups and private messages are encrypted end to
end; the nodes that carry them only see ciphertext.

**Spam costs something.** Posting costs a little proof-of-work, and a new
key has to "ripen" before it can post cheaply. That keeps the floods
out without a central moderator.

**An open protocol.** Unseenet speaks a strict profile of NNTP - the old
Usenet protocol - and every part of it is written down in numbered
documents, the [UN-RFC series](https://unseenet.org/spec/). The
documents are the authority, and the code is one implementation of them.
Anybody can write their own node or client, exactly like in the old days.

### Why it is so hard to shut down

To silence Unseenet you would have to find the nodes, and they are onion
services with no location. You would have to stop all of them, and
anyone can start a new one tomorrow, at home, in a few minutes. Taking
down one node only affects that node; the same posts live on at the
others. The more people run nodes, the harder this gets - for a company,
and for a government.

That is not a promise that nobody can ever be found. What you write and
who you tell can still give you away, and Tor cannot hide anyone from an
adversary who can watch the whole internet at once. The
[threat model](https://unseenet.org/guide/threats/) says plainly what is
hidden from whom.

## Usenet, Facebook and chat in one client

Unseenet is the old newsgroups, but it is not only that. Everything
people know from today's networks is built on the same technique:
articles in groups, carried the same way. In the client you get:

- **threaded discussions**, like in the newsgroups, with replies that
  quote;
- **chats**, one per person or per group;
- **feeds and a timeline**, like Facebook: posts with comments
  underneath, and people you follow;
- **private posts** that only the receiver can read;
- **sites and pages**, pictures and reactions.

![A group with threads in the Unseenet web client](/assets/blog/unseenet/web-threads.png)

The timeline is the feeds *you* chose to follow, newest first. No
algorithm pushes anything up or down, and nobody is told whom you
follow. If you want friends first, or a subject out of sight, you write
your own rules. They run only in your own client, nobody else sees them,
and *Show all* always shows what is there without them.

![The Unseenet timeline: the feeds you follow, newest first](/assets/blog/unseenet/timeline.png)

There is a terminal client, a graphical client, a bootable USB stick, and
a web client. The web client runs the Unseenet core in the browser with
Pyodide - the same trick Emkay uses to run OVOS in a browser tab - and
reaches the onion nodes through a web entrance. Try it at
[entrance.unseenet.net](https://entrance.unseenet.net/). The entrance can
see your IP address, so for the full protection you open it in Tor
Browser or use one of the other clients.

## How Unseenet compares

Other networks each do a few things well. This is how they line up:

![Unseenet compared to Discord, Matrix, Nostr, Reddit and forums, old Usenet, Mastodon and Facebook and X](/assets/blog/unseenet/comparison.png)

## Who decides, then? Moderation and councils

"Nobody controls it" is easy to say and easy to oversell. Some things
*can* be decided on Unseenet - they are just split between many people,
so nobody rules alone:

- **The author** can edit or withdraw their own post.
- **A group's owner and moderators** can withdraw posts and ban people
  *in that group*, and nowhere else.
- **A node operator** decides which groups their own node carries. That
  affects only their node.
- **A hierarchy maintainer**, for example whoever looks after `dk.*`, can
  block someone across the hierarchy - but only on nodes whose operators
  chose to honour it, and clients say plainly what was hidden, by whom
  and why.
- **You** decide what you see. Spam reports and content labels come from
  people *you* choose to follow, and they only describe. Your client
  decides what to hide, blur or show.

Nobody can remove a post from the whole network, change a word of
someone else's post, or read a closed group they were not given.

A network nobody owns still has a few things everybody shares: which
names belong to whom, which nodes there are, which hierarchies exist.
Somebody has to keep those lists, and whoever keeps them could steer the
network. Before version 0.7 that was one key: mine, as the project's
founder. That is exactly the kind of power Unseenet should not have.

So from version 0.7 those lists move to **councils**. A council is a
group of keys, and it changes only when a majority of its members sign
exactly the same change. Each member is a small program, a **replica**,
running on its own machine. A replica does not judge: it reads public
posts, applies rules written down in the RFCs, and signs what those
rules give. Every replica computes the same answer from the same public
data, and anybody can repeat the work and check it.

Anybody can become a member - also a big company or a government. That
is safe because getting in is slow and public: first you run as a
*shadow* that signs nothing, then on probation, and only after about
eight months as a full member. Taking over a council would take most of
a year for every seat, in full view. And if a council is captured
anyway, people can found a new one from the last state they trust, and
each client and node chooses which to follow. A council only has power
because people choose to follow it.

To be honest about today: the names council has started with three
members, all run by me on different machines. The machinery runs by
itself, but its crew does not yet. A council is only really alive when
several people, on different infrastructure, sit in it. If you want to
help, you can run a replica on a Raspberry Pi. [Who runs
Unseenet?](https://unseenet.org/guide/council/) explains it all.

## The price

The protection that shields a whistleblower also shields people with bad
intentions, and a network without accounts cannot check anyone's age or
identity. Unseenet's answer is limited power spread over owners,
moderators, operators and maintainers, and readers who choose what they
follow - not a central authority. I think a free place to talk is worth
that price, just as Tor and encrypted messaging are.

And to be clear: **Unseenet is pre-alpha** and has not had a security
review. Try it, pick it apart, tell me what you find - but do not rely
on it yet to protect anyone whose safety depends on it.

It is also very small. As far as I know, the only ones on it so far are
me, Emkay (a bot) and four made-up test profiles. But I cannot really
tell, and that is the point: nothing is logged and nobody is watched, so
there is no list of users to look at.

## Back to voice

So why is this on the OpenVoiceOS blog? Because it is the same idea.
OVOS exists so that the assistant in your home answers to you, not to a
company. Unseenet exists so that the place where you talk answers to the
people talking, not to an owner. Both are built from open parts, both are
described in open documents, and both get stronger the more people run
them themselves.

And they can meet. There is already an MCP server for Unseenet, so an
assistant can read what is new in your groups. A skill that reads your
groups aloud is not far away.

## Links

- Unseenet: [unseenet.org](https://unseenet.org/)
- Try it in the browser: [entrance.unseenet.net](https://entrance.unseenet.net/)
- Why it matters: [unseenet.org/guide/why](https://unseenet.org/guide/why/)
- How it works: [unseenet.org/guide](https://unseenet.org/guide/)
- The protocol, UN-RFC 0000 and on: [unseenet.org/spec](https://unseenet.org/spec/)
- The councils: [unseenet.org/guide/council](https://unseenet.org/guide/council/)
- Code: [github.com/unseenet](https://github.com/unseenet)
