---
title: "The real cost of running AI: tokens, latency, hardware and the choice between local and cloud"
description: "AI bills grow quietly as usage and prompts grow. How to calculate cost per request and per outcome, manage speed, size hardware for local models and decide between cloud and local."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - finance
  - systems
author: "KEVOS®"
featured: false
draft: false
---

Early AI pilots often look cheap. A few people try an assistant, the monthly bill is small, and the business case writes itself. Then usage grows, prompts get longer as more documents are added to each request, conversation histories pile up, a larger model is chosen for quality, and the bill climbs to many times the forecast. Meanwhile, users complain that answers are slow, and someone suggests buying servers to run models locally without a clear view of whether that would be cheaper.

AI costs are manageable when they are understood. Most usage-based AI is priced by the amount of text processed, so costs follow design choices: how much context is sent, how long outputs are, which model is used and how often the same work is repeated. Speed follows similar choices. And the choice between using a cloud service and running models on the business's own hardware depends on volume, utilisation, data requirements, skills and the quality the task needs, not on a general belief that one is cheaper.

This article explains how AI costs are built up, how to calculate cost per request and per outcome, what drives speed, how caching, batching and model routing reduce cost, how to estimate hardware for local models and how to compare cloud and local options on total cost. It is general information. Prices for models and hardware vary widely and change frequently, so the figures here are illustrations; use current prices for real decisions.

## How AI usage is priced

Hosted language models are usually priced per **token**, a small piece of text averaging somewhat less than a word in English. Prices are quoted per million tokens, with separate rates for:

- **Input tokens**: everything sent to the model, including instructions, examples, retrieved documents, conversation history and the user's message.
- **Output tokens**: the text the model generates, usually priced several times higher than input.

Other costs include **embeddings** for search systems, priced per token embedded; **search and database services**; **tool and application calls**; and the infrastructure that runs the application.

## Calculating cost per request

Consider an illustrative model priced at $3 per million input tokens and $15 per million output tokens. A request with 3,000 input tokens, covering instructions, a few retrieved passages and the question, and a 400-token answer costs:

- Input: 3,000 × $3 ÷ 1,000,000 = $0.009
- Output: 400 × $15 ÷ 1,000,000 = $0.006
- Total: about $0.015 per request

At 20,000 requests a month, that is about $300. If the application instead sends 10,000 input tokens per request, by including whole documents and long histories, the cost rises to about $0.036 per request, or about $720 a month, for the same number of questions. Context size is often the biggest cost lever. Choosing a larger model can multiply prices again, so the same design might cost several times as much on a premium model as on a mid-range one.

## Embedding and search costs

Systems that answer from documents also pay to prepare and search them. Each document is converted into embeddings when it is added, and again whenever it changes or the embedding model is replaced. Embedding is usually cheap per token, but large document collections, frequent updates and a change of embedding model, which requires re-embedding everything, can add up. Vector and text search services charge for storage and queries, and costs grow with the size of the collection. Removing duplicate and obsolete documents reduces these costs as well as improving answers.

## Better unit measures

Cost per request is a start, but business decisions need costs per unit of value:

- **Cost per user** per month, for budgeting tools used by staff.
- **Cost per outcome**, such as per resolved enquiry, per document processed or per report drafted, which can be compared with the cost of doing the work another way.
- **Cost per successful outcome**, which accounts for failures, retries and human rework.

An assistant that costs $0.05 per enquiry but resolves only half of them without staff involvement has a different value from one that costs $0.10 and resolves 90%. The [is your AI a feature or a tool](/reados/collections/ai-in-business-practice/ai-feature-or-ai-tool/) article explains how these economics differ between AI used inside the business and AI built into products sold to customers, including the risk that costs grow with every customer.

## What drives speed

Users experience two kinds of delay:

- **Time to first token**: how long before the answer starts appearing, affected by model size, input length and service load.
- **Generation time**: how long the full answer takes, roughly proportional to output length.

Longer inputs, longer outputs, larger models and multi-step processes such as retrieval, reranking and agent loops all add time. **Streaming**, showing text as it is generated, improves perceived speed for interactive use. For background tasks, such as overnight processing of documents, speed matters less than throughput and cost.

## Reducing cost and delay

- **Send less context**: retrieve fewer, better passages after reranking; summarise long conversation histories; remove unnecessary instructions.
- **Limit output length** to what the task needs.
- **Route by difficulty**: send simple tasks, such as classification and short answers, to smaller, cheaper and faster models, and reserve large models for complex work.
- **Cache**: reuse answers to frequent identical questions, reuse retrieved results, and use provider features that discount repeated prompt content where available.
- **Batch**: process non-urgent work in batches, which many providers offer at lower prices.
- **Control concurrency**: manage how many requests run at once to avoid hitting service limits, with queues for peaks.
- **Measure before optimising**: log tokens, latency and cost per request by application and feature, so effort goes where the money is.

## Running models locally: hardware basics

Open-weight models can be run on the business's own computers or rented servers. Their main hardware requirement is memory. A model's memory footprint is roughly its number of parameters multiplied by the bytes used to store each one:

- A 7-billion-parameter model stored at 16 bits, or 2 bytes, per parameter needs about 14 GB just for its weights.
- **Quantisation** stores parameters with fewer bits. At 4 bits, the same model needs roughly 3.5 to 4 GB, small enough for a capable desktop graphics card.
- A 70-billion-parameter model needs about 140 GB at 16 bits, which requires several high-end graphics cards, or roughly 35 to 40 GB at 4 bits.

Additional memory is needed for the context being processed and for serving several users at once. **Graphics processing units** run models much faster than ordinary processors, and their own memory, **video memory**, is usually the limiting factor. Quantisation reduces memory and cost but can reduce quality, so evaluate quantised models on the actual task.

## Cloud or local

| Factor | Favours cloud services | Favours local or self-hosted models |
|---|---|---|
| Model quality needed | The most capable models, often only available as services | Tasks where a smaller open-weight model is good enough |
| Volume and utilisation | Low, variable or uncertain usage | High, steady usage that keeps hardware busy |
| Data requirements | Provider terms and regions meet obligations | Data that must stay on premises or under direct control |
| Connectivity | Reliable internet | Sites with poor connectivity or a need to work offline |
| Skills | Limited in-house operations capacity | Staff able to run, patch, secure and monitor models |
| Speed of change | Easy access to new models | Stable workloads that do not need the latest models |

Local is not automatically more private: unencrypted disks, synchronised laptops and applications that send data elsewhere can undermine it. Cloud is not automatically insecure: providers offer strong security and data commitments, which should be checked in contracts.

### A simple cost comparison

Consider an illustrative local server with suitable graphics cards costing $40,000, used over three years, plus about $10,000 a year for power, hosting, maintenance and staff time. Its annual cost is about $13,300 in depreciation plus $10,000, or about $23,300. If the business's cloud usage for the same work is $1,500 a month, or $18,000 a year, the cloud is cheaper. If usage grows to $4,000 a month, or $48,000 a year, and a local model meets the quality requirement, the server could pay for itself, provided it is kept busy and the business has the skills to run it.

Include the hidden costs on both sides: evaluation and testing of open-weight models, security and patching, upgrades as better models appear, and the risk of hardware sitting idle.

## The rest of the total cost

Model usage is often not the largest cost of an AI system. Total cost of ownership also includes design and development, integration with business systems, evaluation and monitoring, content and data management, security reviews, support, training and the change management needed for people to use the system well. These costs continue after launch. Compare them with the value delivered, as with any equipment or system investment; the [buying for the whole life of equipment](/reados/collections/investment-appraisal-and-business-cases/buying-for-the-whole-life-of-equipment/) article sets out the whole-of-life approach.

## Pricing AI features for customers

When AI is part of a product or service sold to customers, its running costs grow with every customer and every use. Flat subscription prices can become unprofitable if a minority of heavy users drive most of the usage. Options include usage limits within plans, higher tiers for heavy use, charging per task for expensive features, and designing features so that their cost per use is known and bounded. Model price changes, in either direction, can shift margins quickly, so review pricing against actual usage regularly.

## Energy and emissions

Running models consumes electricity, in provider data centres or on the business's own hardware. For businesses reporting emissions or energy use, AI workloads are part of the picture. Smaller models, shorter prompts, caching and avoiding unnecessary requests reduce energy use along with cost. Providers increasingly publish information about the energy sources and efficiency of their services, which can inform choices.

## Budget controls

- **Tag usage** by application, feature and team.
- **Set spend alerts and caps** at provider and application level.
- **Apply quotas** per user or customer for heavy features.
- **Forecast** with expected growth in users, requests and context size.
- **Review monthly** the largest cost drivers and the cost per outcome.
- **Protect public-facing systems** from abuse that runs up bills, with rate limits and authentication.

## A worked example

This is an illustrative example. A business launches an internal assistant that answers staff questions from policies, procedures and product information. The first month's bill is about $800. Six months later, with more users and more documents, it reaches about $6,500 a month, and users complain about slow answers.

**Analysis.** Logs show an average of about 12,000 input tokens per request. The system sends the full text of every retrieved document and the entire conversation history with each question. A large model handles every request, including simple questions about office hours and leave forms. About a quarter of questions are repeats.

**Changes.**

- Retrieval is changed to send the top five reranked passages, about 2,500 tokens, instead of whole documents.
- Conversation history is summarised after a few turns.
- Simple, frequently asked questions are routed to a smaller model, and identical questions are answered from a cache with a short expiry.
- Output length is limited for routine answers.
- Spend alerts and monthly cost reviews are introduced.

**Result.** The monthly bill falls to about $1,700 at the same usage, average response time halves, and scores on the business's test set of questions are unchanged. The team considers a local server but decides that, at this volume, the cloud service remains cheaper and needs less operational effort.

## Applying this in an Australian business

- **Measure tokens, latency and cost** per request and per outcome.
- **Treat context size** as the first cost lever.
- **Route tasks** to the smallest model that meets the quality standard.
- **Use caching and batching** where suitable.
- **Estimate local hardware** from model size, quantisation and concurrency.
- **Compare cloud and local** on total cost, utilisation, data needs and skills.
- **Count the full cost of ownership**, not just usage charges.
- **Set budgets, alerts and reviews.**

## Where AI costs go wrong

- **Forecasting from pilot usage** without growth in users and context.
- **Sending whole documents** and full histories with every request.
- **Using the largest model for everything.**
- **Buying hardware** that sits idle.
- **Ignoring evaluation, operations and support costs.**
- **No spend controls** on public-facing features.
- **Comparing prices per token** rather than cost per successful outcome.

## Questions to ask about AI costs

- What does each request cost, and what drives it?
- What is the cost per successful outcome compared with the alternative?
- How much context are we sending, and is all of it needed?
- Which tasks could use smaller models or caching?
- At what volume would local hosting pay, and do we have the skills?
- What controls stop costs running away?

## Bringing it together

The cost of running AI follows design choices: how much text is sent, how much is generated, which model is used and how often work is repeated. Measure cost per request and per successful outcome, manage context size first, route tasks to the smallest suitable model, and use caching, batching and limits. Size local hardware from model size and quantisation, and compare cloud and local options on total cost, utilisation, data requirements and skills. Count the full cost of ownership and keep budgets under active control. The result is AI that stays affordable as it becomes useful.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® AI academy lessons on cost per request and per user, inference, embedding and retrieval costs, build versus buy, cloud versus local inference, latency and throughput, concurrency, caching and batching, and hardware and quantisation, together with established practice. Prices and the worked example are illustrative. This article is general information.*
