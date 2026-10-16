---
title: "Prompting, retrieval or fine-tuning: choosing how to adapt an AI model to your business"
description: "When an AI model gets things wrong, the fix is often not fine-tuning. How to choose between better prompts, retrieval, tools and fine-tuning, and what each costs to build and maintain."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - systems
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

A general-purpose language model rarely does exactly what a business needs straight away. It may not know the products, use the wrong tone, produce inconsistent formats, misclassify documents in the business's own categories, or be too slow and expensive for high-volume work. Faced with these problems, teams often jump to the most technical-sounding answer: train the model on our data. Sometimes that is right. More often, a better prompt, a retrieval system or a connection to existing business systems solves the problem faster, cheaper and with less to maintain.

There is a ladder of ways to adapt a model, and each rung changes something different. Prompting changes what the model is asked to do. Retrieval changes what information it has. Tools change what it can do. Fine-tuning changes the model itself. Choosing well starts with diagnosing what is actually wrong.

This article explains each method, what problems it solves, its costs and risks, and a practical way to choose. It is general information for managers and technical teams deciding how to build AI applications. Specific platforms and models differ in what they support; the principles apply broadly.

## The adaptation ladder

| Method | What it changes | Best for | Main costs |
|---|---|---|---|
| Prompting | The instructions, examples and format requested | Behaviour, tone, format, task definition | Design and testing time; longer prompts cost more per request |
| Retrieval | The information supplied with each request | Business facts, documents, current information | Ingestion, search infrastructure and content management |
| Tools | What the model can look up or do | Exact data, calculations, actions in other systems | Integration, permissions and safety controls |
| Fine-tuning | The model's parameters | Consistent specialised behaviour, domain language, cheaper smaller models | Training data, training runs, hosting, retraining |
| Training a new model | Everything | Rarely justified outside large technology organisations | Very high |

Most successful applications combine several rungs: a well-designed prompt, retrieved business information, tools for exact data and, sometimes, a fine-tuned model.

## Prompting: interface design for models

A prompt is the interface between the application and the model. Good prompt design is closer to writing a clear specification than to finding magic words:

- **System instructions** define the role, rules, audience, tone and what to do when information is missing.
- **Few-shot examples** show good inputs and outputs, often improving consistency more than extra instructions.
- **Structured outputs** ask the model to return defined fields, such as a JSON object matching a **schema**, which the application validates. Invalid outputs can be rejected or retried.
- **Context engineering** decides what information goes into the context window for each request and in what order, keeping it relevant and within limits.
- **Templates and versioning** keep prompts under change control, with tests run before changes go live.

Prompting is the cheapest method to try and change. Exhaust it before moving up the ladder.

## Retrieval: supplying knowledge

If the model gives wrong or invented facts about the business, the usual fix is **retrieval-augmented generation**: retrieving relevant passages from business documents at question time and instructing the model to answer from them with citations. Retrieval keeps knowledge in documents that can be updated and controlled, and answers can be traced. Fine-tuning is a poor way to teach facts: it is expensive to update, does not provide sources and still allows errors.

## Tools: exact data and actions

When the task needs live data, exact calculations or actions, give the model **tools**, also called function calling. The model decides that it needs, for example, an order's status, and the application calls the business system and returns the result. Tools suit stock levels, prices, account balances, calculations, bookings and updates to records. Actions that change things need permissions, limits and often human approval.

## Fine-tuning: changing the model

**Fine-tuning** continues training an existing model on examples of the inputs and outputs the business wants. It changes the model's parameters, so the desired behaviour no longer has to be described in every prompt.

Fine-tuning suits:

- **Consistent specialised behaviour** at high volume, such as classifying documents into many business-specific categories or producing a strict house format.
- **Domain language** the base model handles poorly.
- **Smaller, cheaper, faster models** that match a large model's performance on a narrow task.

Fine-tuning does not suit teaching facts that change, fixing problems that better prompts or retrieval would solve, or tasks with little good training data.

### How fine-tuning works

- **Supervised fine-tuning** trains on pairs of inputs and ideal outputs.
- **Parameter-efficient fine-tuning** methods, such as LoRA, train a small set of additional parameters instead of the whole model, reducing cost and allowing several adaptations of one base model. QLoRA combines this with a compressed base model to reduce memory needs further.
- **Preference tuning** methods, such as reinforcement learning from human feedback and direct preference optimisation, train on comparisons between better and worse responses. These are mainly used by model developers but are available for some business uses.

### Training data

Data quality matters more than quantity. Useful practices:

- **Collect real examples** that represent the inputs the system will see, including difficult and unusual cases.
- **Write or verify ideal outputs** carefully; errors in training data become errors in the model.
- **Remove personal and confidential information** that is not needed, and confirm the right to use the data.
- **Split data** into training, validation and test sets, keeping the test set untouched for final evaluation.
- **Balance categories**, so rare but important cases are represented.

### Risks of fine-tuning

- **Forgetting**: a fine-tuned model can lose some general abilities while gaining specialised ones. Test general behaviour as well as the target task.
- **Licensing**: check that the base model's licence and the provider's terms permit the intended use, and that the business owns or may use the training data.
- **Maintenance**: when base models are updated or retired, fine-tuned models may need retraining. Keep training data, settings and evaluation results so this can be repeated.
- **Overconfidence**: a fine-tuned model can be confidently wrong in its specialised area. Keep evaluation and human review where errors matter.

## Choosing: start from the symptom

| Symptom | First thing to try | If that is not enough |
|---|---|---|
| Wrong or invented business facts | Retrieval with citations | Better content and search; tools for live data |
| Inconsistent output format | Structured outputs with schema validation | Few-shot examples; fine-tuning at high volume |
| Wrong tone or style | Clear instructions and examples | Fine-tuning for high-volume consistent style |
| Poor classification into business categories | Category definitions and examples in the prompt | Fine-tuning a smaller model on labelled examples |
| Needs live data or calculations | Tools | Tighter tool design and validation |
| Too slow or costly at volume | Smaller model, shorter prompts, caching | Fine-tuning a smaller model; routing between models |

**Model routing** sends simple requests to smaller, cheaper models and complex ones to larger models, and provides fallbacks when a model or service fails.

Symptoms often overlap. A customer service assistant might need retrieval for policy facts, tools for order data, structured outputs for its hand-off to the ticketing system and a consistent tone set by instructions and examples. Address each symptom with the method that fits it, rather than expecting one method to fix everything.

Whatever method is used, measure against a fixed test set before and after each change. Without measurement, adaptation becomes guesswork. The [is the AI good enough to rely on](/reados/collections/ai-in-business-practice/is-the-ai-good-enough-to-rely-on/) article covers building benchmarks and acceptance rules.

## Signs it is time to move up the ladder

Moving to a more complex method makes sense when evidence, not frustration, shows the current one has reached its limit:

- **Prompt changes stop improving results** on the test set, or fixing one case breaks others.
- **Prompts grow very long** with rules and examples, raising cost and latency on every request.
- **Retrieved information is correct but the model still applies it inconsistently** in a narrow, repeated task.
- **Volume is high enough** that a smaller, specialised model would save meaningful money.
- **Good labelled data exists**, or can be created at reasonable cost.

If none of these apply, more work on prompts, content or tools is usually the better investment.

## Production safeguards

Whatever the method, applications in daily use need engineering safeguards:

- **Validation** of every structured output against its schema and business rules, with rejection or retry when it fails.
- **Timeouts and retries** for slow or failed model calls, with limits so costs do not run away.
- **Fallbacks**, such as a second model, a simpler rule-based path or a hand-off to a person, when the primary model is unavailable.
- **Caching** of repeated requests and retrieved results to save cost and time.
- **Guardrails** that check inputs and outputs for prohibited content, personal information and attempts to override instructions.
- **Logging** of model versions, prompts, inputs and outputs, within privacy limits, so problems can be investigated.

These safeguards matter as much as the adaptation method in determining whether an application can be trusted.

## Ownership and change control

Prompts, retrieval settings, tool definitions and fine-tuned models are all parts of a business system and need owners. Agree who may change each part, how changes are tested and approved, and how they are rolled back if results worsen. Keep a simple record for each application: the model and version, prompt versions, data sources, training data sets for any fine-tuned model, evaluation results and known limitations. Treat a prompt change in a customer-facing or decision-making application with the same care as a change to business rules in other software, because its effect can be just as large.

## Costs over the life of the application

Compare not only the cost to build but the cost to keep the application working. Prompts are cheap to change but run on every request. Retrieval needs content management and infrastructure. Tools need integration maintenance as business systems change. Fine-tuning needs data preparation, training runs, hosting for custom models and retraining when base models change. Whether the AI is part of a product or an internal tool also changes the economics, as the [is your AI a feature or a tool](/reados/collections/ai-in-business-practice/ai-feature-or-ai-tool/) article explains.

## A worked example

This is an illustrative example. A manufacturer receives about 2,000 warranty claims a month and wants an AI system to read each claim, extract key fields and assign one of 40 failure codes, saving technicians' time.

**Step 1: prompting.** The team writes instructions listing the 40 codes with short definitions and adds ten examples. On a test set of 300 historical claims with known codes, the model assigns the correct code about 78% of the time, and output formats vary.

**Step 2: structure and retrieval.** Structured outputs with a schema fix the format problems. For each claim, the system retrieves the full definitions and three similar past claims for the most likely codes. Accuracy rises to about 86%, but the large model is slow and costly at this volume.

**Step 3: fine-tuning.** The team prepares 3,000 historical claims with verified codes, removing customer personal information, and fine-tunes a smaller model using a parameter-efficient method. On the untouched test set, it assigns the correct code about 93% of the time, at a fraction of the per-claim cost of the large model.

**Operation.** Claims where the model's confidence is low, about one in six, go to a technician. A monthly sample of automated decisions is reviewed, and the training data and evaluation are kept so the model can be retrained when the base model is updated or new failure codes are added.

## Applying this in an Australian business

- **Diagnose the symptom** before choosing a method.
- **Exhaust prompting** first, with structured outputs and examples.
- **Use retrieval for knowledge** and tools for live data and actions.
- **Fine-tune for consistent specialised behaviour** or cheaper models at volume.
- **Prepare training data carefully**, removing personal information.
- **Check licences and terms** for models and data.
- **Measure every change** against a fixed test set.
- **Plan for maintenance** as models change.

## Where adaptation goes wrong

- **Fine-tuning to teach facts** that retrieval would supply.
- **Skipping prompt design** and jumping to training.
- **Poor or unrepresentative training data.**
- **No untouched test set.**
- **Ignoring forgetting** of general abilities.
- **No plan for retraining** when base models change.
- **Letting models act** without tools, permissions and checks.

## Questions to ask before adapting a model

- What exactly is going wrong: facts, format, style, categories, data, speed or cost?
- What is the cheapest method that could fix it?
- How will we measure improvement?
- Do we have good, permitted training data if fine-tuning is needed?
- What will it cost to maintain over the next few years?
- Where must humans stay involved?

## Bringing it together

Adapting a language model to a business is a choice between methods that change different things. Prompting defines the task and format; retrieval supplies business knowledge with sources; tools provide exact data and actions; fine-tuning changes the model for consistent specialised behaviour or cheaper operation at volume. Start from the symptom, use the cheapest method that could work, measure every change against a fixed test set and account for maintenance as well as build cost. Most strong applications combine several methods. The result is AI that fits the business without unnecessary complexity.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® AI academy lessons on prompting versus retrieval versus fine-tuning, supervised and parameter-efficient fine-tuning, preference tuning, training data preparation, evaluation and licensing risks, prompt design, structured outputs, tool calling and model routing, together with established AI practice. The worked example is illustrative. This article is general information.*
