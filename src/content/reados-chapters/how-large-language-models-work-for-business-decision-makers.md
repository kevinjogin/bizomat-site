---
title: "How large language models work, for business decision-makers: tokens, training, context and limits"
description: "You do not need to build an AI model to use one well, but you do need to know how it works. Tokens, training, context windows, settings and why models invent things, in plain terms."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - systems
  - strategy
author: "BIZOMAT"
featured: false
draft: false
---

Large language models, the technology behind chat assistants and many new business tools, are now part of everyday work. They draft emails, summarise reports, answer questions about documents, classify enquiries, extract data from forms and help write software. Many businesses use them through ordinary software without thinking about what is underneath.

Decision-makers do not need to understand the mathematics. They do need a working understanding of how these models produce their answers, because that explains their strengths and their failures. It explains why a model can write a convincing paragraph about a product that does not exist, why it forgets earlier parts of a long conversation, why the same question can get different answers, why costs are quoted in tokens and why giving the model the right documents matters more than asking it cleverly.

This article explains, in plain terms, how large language models work: tokens and prediction, the transformer architecture, how models are trained, context windows, the settings that control output, why models invent information and how to choose between models. It is general information for managers and professionals deciding how to use these tools. The technology changes quickly, so check current capabilities and terms for any specific product.

## Prediction, one token at a time

A large language model is a program that predicts what text should come next. Given some text, it calculates the probability of each possible next piece of text, chooses one, adds it to the text and repeats. Generating a paragraph means making hundreds of these predictions in sequence. Models that work this way are called **autoregressive**.

The pieces are called **tokens**. A token might be a whole common word, part of a longer word, a number or a punctuation mark. In English, a token averages somewhat less than a word, so a 1,000-word document is typically somewhat more than 1,000 tokens. Model limits, speed and prices are all measured in tokens: tokens in the prompt you send and tokens in the output the model generates.

This simple mechanism has a profound consequence. The model is not looking facts up in a database. It is producing text that is statistically plausible given its training and the text in front of it. Often plausible and true coincide. Sometimes they do not.

## The transformer and attention

Modern language models are built on an architecture called the **transformer**. Its key idea is **attention**: when the model processes a token, it can weigh the relevance of every other token in the text, near or far, and combine information from the most relevant ones.

A helpful analogy is a search. Each token produces a **query**, describing what it is looking for; every token offers a **key**, describing what it contains, and a **value**, the information it carries. Where a query matches a key strongly, that token's value contributes more. In the sentence "The pump failed because its seal was worn", attention lets the model connect "its" with "pump".

Because attention on its own does not know word order, models add **positional information** to each token. The model stacks many layers of attention and processing, often dozens, each refining the representation of the text. The learned numbers in these layers are the model's **parameters**, which can number in the billions.

Two broad families of transformer models matter for business use:

- **Encoder-style models** read text and produce representations of its meaning. They suit classification, search and **embeddings**, which are lists of numbers capturing meaning so that similar texts have similar embeddings. Embeddings power semantic search and retrieval systems.
- **Decoder-style, or generative, models** produce text one token at a time. Chat assistants and writing tools use these.

## How models are trained

Training usually happens in stages:

1. **Pretraining**: the model learns to predict the next token across a very large body of text. This is where it acquires language, general knowledge and patterns of reasoning. It is extremely expensive and done by a small number of organisations.
2. **Instruction tuning**: the model is further trained on examples of instructions and good responses, so it follows requests rather than simply continuing text.
3. **Alignment**: the model is trained, often using human feedback on which responses are better, to be more helpful, honest and harmless, and to refuse some requests.

```figure
type: steps
title: How a language model is trained
caption: The result predicts plausible text one token at a time; it does not look facts up.
- Pretraining | predict the next token across vast text
- Instruction tuning | follow requests
- *Alignment | helpful, honest, harmless
```

Two consequences follow. First, a model's built-in knowledge stops at its **training cut-off**; it knows nothing after that unless information is supplied. Second, the model does not know your business: your products, prices, customers, procedures or documents, unless you give them to it.

## The context window

The **context window** is the amount of text, measured in tokens, that a model can consider at one time. It includes everything: instructions, the conversation so far, any documents supplied and the output being generated. Context windows have grown large, enough for long reports, but they are still limits.

Practical points:

- **The model has no memory between sessions** unless the application stores and resupplies information. A chat tool that seems to remember is usually re-sending earlier conversation or stored notes.
- **Long conversations get truncated** or summarised when they exceed the window, so earlier instructions can be lost.
- **More context is not always better.** Models can pay less attention to information buried in the middle of very long inputs, and long inputs cost more and run slower. Supplying the most relevant material works better than supplying everything.

## Settings that shape the output

Applications control generation with **inference parameters**:

- **Temperature** sets how much randomness enters the choice of each token. Low temperatures give more consistent, predictable output, suited to extraction and classification. Higher temperatures give more varied output, suited to brainstorming.
- **Top-p**, or nucleus sampling, limits choices to the most probable tokens that together make up a set share of probability.
- **Maximum output length** caps the tokens generated, controlling cost and length.
- **Stop sequences** tell the model where to end.

Even at low temperatures, outputs are not guaranteed to be identical every time. Systems that need consistent results should also constrain the output format, validate it and test it.

## Prompts and instructions

Everything a model knows about the task comes from its training and its prompt. Applications usually combine several parts:

- **System instructions** set the model's role, rules, tone and output format, and are applied to every request.
- **Examples**, sometimes called few-shot examples, show the model what good input and output look like. A handful of well-chosen examples often improves consistency more than longer instructions.
- **Supplied material**, such as documents, records or search results, gives the facts for this request.
- **The user's request** itself.

Clear, specific instructions work better than vague ones: state the audience, the format, what to do when information is missing and what not to do. Ask for structured output, such as defined fields, when the result will be used by another system. Keep prompts under version control and test changes, because small wording changes can alter behaviour.

Instructions are guidance, not a security boundary. Text inside documents or user messages can attempt to override them, so applications must enforce important limits, such as what data can be accessed and which actions can be taken, outside the model.

## Why models invent things

Language models sometimes produce confident statements that are false: invented citations, non-existent product features, wrong figures or plausible but incorrect explanations. This is often called **hallucination**. It happens because the model generates plausible text rather than retrieving verified facts, and nothing in the basic mechanism checks truth.

Risk rises when the question is outside the model's knowledge, when it concerns specific facts such as numbers, dates, names and references, when the answer requires information the model was not given, or when the prompt pressures it to answer rather than admit uncertainty.

Mitigations are well established:

- **Ground answers in supplied sources**, such as retrieved company documents, and require citations to them.
- **Instruct the model to say when it does not know**, and design the application to accept that answer.
- **Constrain outputs** to defined formats and validate them, for example checking extracted values against business rules.
- **Use tools for exact work**, such as calculators, databases and search, rather than the model's own recall.
- **Keep humans responsible** for decisions and for checking outputs where errors matter.
- **Test systematically** before relying on the system; the [is the AI good enough to rely on](/reados/collections/ai-in-business-practice/is-the-ai-good-enough-to-rely-on/) article covers testing and acceptance.

## Strengths and limits

| Usually strong at | Usually weak at, without extra design |
|---|---|
| Drafting and rewriting text in a given style | Exact facts, figures and references from memory |
| Summarising supplied documents | Information after its training cut-off |
| Classifying and routing enquiries | Knowing your private business information |
| Extracting structured data from text | Exact arithmetic and counting |
| Translating and explaining | Guaranteeing identical outputs |
| Assisting with code and formulas | Long multi-step tasks without checks |
| Answering questions about provided material | Knowing when it is wrong |

## Choosing a model

Models differ in capability, speed, cost, context length, supported inputs such as images and audio, and terms of use. Key choices include:

- **Size and capability versus cost and speed.** Smaller models are cheaper and faster and may be good enough for narrow tasks such as classification; larger models handle more complex reasoning and writing.
- **Hosted versus open-weight models.** Hosted models are used through a provider's service under its contract. **Open-weight** models release their parameters under a licence, so a business can run them on its own or rented hardware, gaining control at the cost of operating them. Open-weight is not the same as open source; licences vary and may restrict uses.
- **Data handling.** Check where data is processed and stored, whether inputs are used for training, retention periods and security commitments. Australian privacy obligations apply when personal information is involved.

Whichever model is chosen, record which model and version an application uses, because behaviour can change when providers update models.

## Using models responsibly in a business

- **Start from the work**, not the technology. The [adopting AI: start with the work](/reados/collections/ai-in-business-practice/adopting-ai-start-with-the-work/) article covers choosing use cases.
- **Do not paste confidential or personal information** into tools without suitable agreements and controls.
- **Decide what the model may do on its own** and where humans must approve; the [governing AI decisions](/reados/collections/ai-in-business-practice/governing-ai-decisions/) article covers setting these limits.
- **Respect intellectual property**, checking terms for generated content and the material you supply.
- **Keep records** of significant AI-assisted outputs and decisions.

## A worked example

This is an illustrative example. A parts distributor trials a language model to draft replies to customer emails about order status. In the first trial, staff paste emails into a general chat tool. Replies read well, but some contain invented delivery dates and tracking details, because the model has no access to order data and fills the gap with plausible text.

**Redesign.** The business builds a simple workflow:

- The system looks up the order in the business system using the order number in the email.
- The model receives the email, the order record and an approved reply template, with instructions to use only the supplied record and to say when information is missing.
- Temperature is set low for consistent wording.
- The draft shows which fields came from the order record, and a staff member approves or edits every reply.
- A set of 100 past emails, including tricky cases, is used to test the workflow before go-live.

**Result.** Drafting time falls from about six minutes to about two minutes per email. Invented details disappear from tested drafts, and the few errors that remain, such as misreading an ambiguous request, are caught in review. The business keeps human approval in place and reviews a sample of replies each month.

```figure
type: compare
title: Order-status replies, designed twice
cols: General chat tool | Designed workflow
best: 2
caption: Drafting fell from about six minutes to two per email, with human approval kept in place.
- Order data | None: gaps filled with plausible text | Looked up from the order number
- Instructions | Ad hoc | Use only the record; say when information is missing
- Testing | None | 100 past emails, including tricky cases
- *Result | Invented dates and tracking | Invented details gone from tested drafts
```

## Applying this in an Australian business

- **Understand the mechanism**: prediction of plausible text, not retrieval of facts.
- **Supply the information** the model needs, rather than relying on its memory.
- **Choose settings** to suit the task, with low temperature for consistency.
- **Design against invented content** with grounding, constraints, tools and review.
- **Choose models** on capability, cost, speed and data terms.
- **Protect confidential and personal information.**
- **Record model versions** and test after changes.
- **Keep people accountable** for decisions.

## Where businesses go wrong with language models

- **Treating fluent output as verified fact.**
- **Asking for information the model was never given.**
- **Pasting sensitive data** into consumer tools.
- **Assuming the model remembers** earlier sessions.
- **Overloading prompts** with irrelevant material.
- **Deploying without testing** on real and difficult cases.
- **Ignoring model updates** that change behaviour.

## Questions to ask about a language model application

- What information does the model need, and how does it get it?
- How will invented or wrong content be caught?
- What settings are used, and why?
- Which model and version is used, and on what data terms?
- What may the system do without human approval?
- How was it tested, and how will it be monitored?

## Bringing it together

Large language models predict plausible text one token at a time, using transformer networks trained on vast amounts of text and tuned to follow instructions. They work within a context window, have no memory between sessions unless given one, know nothing of your business unless told, and can produce fluent falsehoods. Used with that understanding, by grounding them in your information, choosing appropriate settings and models, constraining and checking outputs and keeping people accountable, they can save substantial time on writing, summarising, classifying and extracting work. The result is useful AI that the business can trust for the right tasks.

---

*Source: BIZOMAT editorial notes, drawing on earlier BIZOMAT AI academy lessons on transformers and large language models, attention, training and alignment, context windows, inference parameters and model selection, together with established AI practice. The worked example is illustrative. This article is general information; check current product capabilities and terms.*
