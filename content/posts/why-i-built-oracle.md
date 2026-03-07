---
title: "Why I Built Oracle"
description: "Every journaling app asks you to pour out your soul — then stores it on someone else's server. I built Oracle because I needed a journal that was actually safe."
date: 2026-03-07
category: Company
readingTime: 6
---

I've been journaling since I was 17. Through breakups, career pivots, therapy sessions, spiritual awakenings, and dark nights of the soul — my journal has been the one constant. The place where I could be completely, devastatingly honest.

But here's the thing that always nagged me: **every digital journal I used was storing my most intimate thoughts on someone else's server.**

Think about that for a second. The entries where you confess what you really feel about your family. The ones where you process trauma. The late-night spirals where you write things you'd never say out loud. All of it, sitting in a database controlled by a company whose business model you don't fully understand.

That's not privacy. That's a liability.

## The Breaking Point

The moment Oracle became inevitable was when I read a privacy policy for a popular journaling app. Buried deep in the legal language was a clause that essentially said: *"We may use your content to improve our services and train our models."*

They were training AI on people's journal entries.

I closed my laptop, stared at the wall for a while, and thought: *There has to be another way.*

## The Non-Negotiable

I set one rule before writing a single line of code: **raw journal entries must never leave the user's device.** Not encrypted-then-uploaded. Not anonymized-then-stored. *Never. Leave. The device.*

This constraint shaped everything. It meant:

- The AI had to run locally, not in the cloud
- Encryption had to happen before storage, with a key only the user controls
- The backend could only ever see anonymized, noise-injected data — if anything at all

It turns out that when you make privacy the *architecture* instead of a *feature*, you end up building something fundamentally different from what exists.

## Why Local AI Changes Everything

Most AI journaling apps work like this: you write an entry, it gets sent to OpenAI or Google, their servers process it, and a response comes back. Your most private thoughts traverse the internet, land on third-party infrastructure, and get processed by models you can't audit.

Oracle works differently. The AI — a fine-tuned Llama 3.2 model — runs on your machine through Ollama. Your entry is read in local memory, analyzed in local memory, and the insight is generated in local memory. Nothing leaves. There's no API call. No cloud. Just you and your CPU.

The AI is trained in Cognitive Behavioral Therapy (CBT) and Jungian archetypal psychology. It doesn't give you medical advice. Instead, it asks probing questions to help you uncover patterns you might not see yourself. It's like having a thoughtful friend who's read a lot of Jung and knows when to ask *"What do you think that dream was really about?"*

## The Collective Without the Compromise

The most ambitious part of Oracle is what we call the "State of the Soul" — a collective map of human emotion and behavior. The question was: *Can we learn from millions of people without knowing anything about any individual?*

The answer is yes, through three layers of mathematical privacy:

1. **Generalization** strips away specifics (your age becomes a range, your city becomes a country)
2. **Differential Privacy** flips a mathematical coin to inject noise — so even we can't tell if a data point is real or a decoy
3. **K-Anonymity** ensures no data point is ever stored unless at least 5 people share that category

The result is a "Multidimensional Wellness Compass" that can map trends across the collective human experience — *without ever identifying a single person.*

## What Oracle Is Really About

Oracle isn't a product built to capture a market. It's a journal built because I needed one that respected the weight of what I was writing.

When you sit down to write about your shadow, your fears, your grief — you deserve to know that those words exist for you and you alone. Not for an algorithm. Not for an ad targeting system. Not for a model training pipeline.

You deserve a sanctuary.

That's what Oracle is.

---

*If any of this resonates, [Oracle is free to try](https://app.oraclethejournal.com). No credit card. No data collection. Just you and your thoughts, cryptographically sealed.*
