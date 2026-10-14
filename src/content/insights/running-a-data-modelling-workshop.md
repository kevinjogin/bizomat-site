---
title: "Running a data-modelling workshop: capturing what a business system must record, in the business's own words"
description: "Many system failures start with a misunderstood data model. How to run a workshop that captures the things, rules and history a system must handle, using real examples and plain language."
publishDate: 2026-10-09
category: "Projects"
tags:
  - systems
  - design
  - communication
author: "KEVOS®"
featured: false
draft: false
---

When a new business system disappoints, the cause is often not a software bug but a misunderstanding about what the system needed to record. The developer assumed each customer had one delivery address; the business has customers with forty sites. The system treats a product as a single thing; the business sells the same product in three pack sizes with different prices. The design records only the current status of a job; the business needs to know when each stage happened and who approved it. These are **data model** problems, and they are expensive to fix once a system is built.

A data model describes the things a system keeps information about, what it records about each, how they relate and what rules apply. Developers and analysts usually produce it, but the knowledge it depends on sits with the people who do the work: sales staff, schedulers, storepersons, engineers, accounts staff and managers. A well-run **data-modelling workshop** brings those people together to describe their world in their own words, so the design reflects how the business actually operates.

This article explains why data modelling should involve the business, the levels of data model, who should attend a workshop, how to prepare, a step-by-step method for running the session, techniques that help, how to resolve common disagreements, what the workshop should produce and the mistakes to avoid. It is general information for project managers, business analysts, system owners and managers commissioning software.

## Why model data with the business

Developers can draw a data model from documents and interviews, but workshops add things that individual interviews miss:

- **Shared definitions.** People in different departments often use the same word for different things, or different words for the same thing. A workshop exposes these differences directly.
- **Exceptions.** Experienced staff remember the awkward cases: the customer who pays for three companies, the part supplied by two vendors under different numbers, the job split across two sites.
- **Rules.** Many business rules are unwritten and known only to the people who apply them.
- **Ownership.** People who helped shape the model understand and trust the system built on it.

Time spent in a workshop is small compared with the cost of redesigning a database after go-live.

## Levels of data model

| Level | Purpose | Audience | Typical content |
|---|---|---|---|
| Conceptual | Agree what the business needs to keep track of | Business and project team | Main things, their definitions and relationships, in plain language |
| Logical | Specify the data precisely, independent of any product | Analysts and developers, reviewed by the business | Entities, attributes, keys, relationships, rules |
| Physical | Implement the design in a particular database | Developers and database administrators | Tables, columns, data types, indexes, constraints |

The workshop focuses on the **conceptual** model and on the business content of the logical model: the things, definitions, relationships, key facts and rules. Technical details come later.

## Who should attend

A productive workshop typically has six to ten people:

- **People who do the work** in each area the system covers, including experienced staff who know the exceptions.
- **A manager or system owner** who can make decisions when definitions conflict.
- **A facilitator**, often a business analyst, who guides the discussion and keeps it moving.
- **A modeller**, who captures the model as it emerges, sometimes the same person as the facilitator.
- **A developer or vendor representative**, who listens, asks clarifying questions and flags constraints.

Larger groups slow down. If many areas are involved, run several focused workshops and a final session to join the pieces.

## Preparing

Good preparation makes the session far more productive:

- **Collect real documents**: forms, quotes, orders, job sheets, invoices, reports, labels and spreadsheets currently used.
- **Gather screenshots** of existing systems.
- **Choose real examples**, including typical and awkward cases from the past few months.
- **Draft a list of candidate terms** found in the documents, such as customer, site, job, quote, item and asset.
- **State the purpose and scope** of the system in a few sentences.
- **Book enough time**: two or three sessions of two to three hours each usually work better than one long day.

## Running the session: a step-by-step method

1. **Confirm the purpose and scope.** Agree what the system is for and which processes it covers.
2. **List the things.** Ask what the business needs to keep track of. Nouns from the collected documents are a good starting point. Write each on a card or sticky note.
3. **Define each thing in a sentence.** For example: "A site is a physical location where we deliver goods or perform work for a customer." Definitions reveal disagreements quickly.
4. **Decide how each thing is identified.** Ask how people tell one from another: a customer number, a serial number, a job number. Note where identifiers are missing or duplicated today.
5. **Describe relationships as sentences.** For example: "Each customer may have one or more sites. Each site belongs to exactly one customer." Test each sentence against real cases.
6. **Capture the important facts about each thing.** These become attributes, such as a site's address, access instructions and contact. Focus on facts people use, not every field on old forms.
7. **Record the rules.** Ask what must always or never be true: "A job cannot be invoiced until it is completed", "A part must have a unit of measure".
8. **Ask about history.** For each thing, ask whether the business needs to know what was true in the past, such as previous prices, earlier revisions or who changed a status and when.
9. **Walk through real examples.** Take a recent typical case and an awkward one and trace them through the model. If the model cannot represent them, refine it.
10. **Capture open questions and decisions.** Record who will resolve each question and by when.

## Writing relationships as sentences

Relationship sentences make cardinality, the "one" or "many" on each side, understandable without diagrams:

| Sentence | What it means for the design |
|---|---|
| Each customer may have one or more sites | A customer can exist before any site is recorded; sites link to customers |
| Each site belongs to exactly one customer | A site cannot be shared between customers |
| Each job is performed at exactly one site | Jobs link to sites |
| Each job may use many parts, and each part may be used on many jobs | A linking record, such as part usage, is needed |
| Each asset is of exactly one asset type | Asset types group assets with shared characteristics |

When participants disagree about a sentence, the disagreement is usually important. "Each site belongs to exactly one customer" may be wrong if a shopping centre's management company and its tenants are both customers at the same site.

## Techniques that help

- **Sticky notes on a wall or whiteboard**, or an online equivalent, so the model can be rearranged easily.
- **Colour coding** for things, events and rules.
- **Example tables**: writing three or four real records for a thing makes abstract discussions concrete.
- **Event-focused workshops**: listing business events in time order, such as "quote sent", "order received", "job scheduled" and "invoice issued", helps identify the things and facts each event creates. This approach, known as event storming, was popularised in software design during the 2010s.
- **A create, read, update and delete check**: for each thing, ask which process creates it, which ones use it, which change it and whether it is ever removed. Gaps reveal missing processes.

## Facilitating well

The facilitator's job is to draw out knowledge, not to design the system in front of the group. Practical habits help:

- **Use the business's language.** Avoid technical terms such as entity, cardinality and foreign key; talk about things, facts and rules.
- **Keep a parking area** for topics that matter but are outside the current discussion, such as screen layouts or report formats.
- **Time-box debates.** If a definition cannot be agreed in ten minutes, record the options and refer the decision to the system owner.
- **Invite quieter participants directly.** Front-line staff often hold the most valuable knowledge about exceptions but may defer to managers.
- **Ask for stories.** "Tell me about the last time this went wrong" uncovers rules and exceptions better than abstract questions.
- **Photograph the wall** at the end of each session and circulate a short summary within a day, so corrections arrive while memories are fresh.

## Resolving common disagreements

**Same word, different meanings.** "Customer" may mean the company that places the order, the one that pays, the one that receives the goods or the end user. Rather than forcing one meaning, the model may need separate roles: ordering party, billing account, delivery site and end user.

**Different words, same thing.** Sales calls it a project, operations a job and finance a cost centre. Agree one term for the system, record the synonyms in a glossary and show the agreed term on screens.

**Exceptions versus rules.** Decide whether an exception should be supported by the design or handled outside the system. Rare exceptions can be expensive to build in; frequent ones are expensive to leave out.

**Today versus the future.** Participants may describe how things are done now, constrained by old systems. Ask how they would like it to work, and whether planned changes, such as new products, markets or sites, will affect the model.

Unresolved disagreements should go to the system owner for a decision, recorded with the reasoning.

## What the workshop should produce

- **A conceptual model diagram** showing the main things and relationships.
- **A glossary** with agreed definitions and synonyms.
- **Relationship sentences** confirmed against examples.
- **A list of key facts** for each thing.
- **A list of rules.**
- **History requirements.**
- **Worked examples** traced through the model.
- **Open questions and decisions**, with owners and dates.

These outputs feed the logical and physical design, and they remain useful for training, reporting and future changes. The [requirements that can be traced and tested](/insights/requirements-that-can-be-traced-and-tested/) article explains how to turn such outputs into requirements that can be checked during testing.

## From workshop to design

After the workshop, the modeller or developer turns the conceptual model into a logical design, adding precise attributes, identifiers and rules. Hold a short review session where the design is explained back to participants using the same sentences and examples. Changes are cheap at this point and become steadily more expensive as building progresses.

When the system is tested, use the workshop's real examples as test cases. If the awkward job that shaped the model in the workshop cannot be entered in the finished system, something has gone wrong.

## Common mistakes

- **Copying the old system's structure**, including its limitations.
- **Starting with screens** before agreeing the data.
- **Inviting only managers**, who may not know the exceptions front-line staff deal with daily.
- **Skipping definitions**, so the same word means different things to different people.
- **Ignoring history requirements** until reports are needed.
- **Never testing with real examples.**
- **Losing the outputs**, so later changes are made without understanding the original reasoning.

## A worked example

This is an illustrative example. An equipment hire business with 60 staff is replacing a system that records hires against customer names and equipment descriptions. A developer has proposed a design based on interviews with the general manager.

**Workshop.** The business runs two three-hour workshops with a branch manager, two hire desk staff, a workshop supervisor, an accounts officer, the general manager, a facilitator and the developer.

**Findings.** Definitions reveal that "customer" means three things: the company with a credit account, the site where equipment is delivered and the person who placed the order, who may work for a subcontractor. The workshop separates accounts, sites and contacts. Relationship sentences show that equipment must be tracked individually by asset number for servicing and safety inspections, but quoted and booked by equipment type, because customers ask for "a 10-metre boom lift", not a particular unit. History questions reveal that the business must know who had each asset on each date, to handle damage claims and infringement notices.

**Changes to the design.** The developer's original design held one customer table and one equipment table. The revised model includes accounts, sites, contacts, equipment types, individual assets, bookings, hire periods, inspections and damage reports.

**Result.** The workshops took about 36 person-hours. The developer estimates that discovering the same issues after building would have cost several weeks of rework. Staff recognise their own language and examples in the new system, which helps adoption.

## Applying this in an Australian business

- **Run data-modelling workshops** before designing or configuring major systems.
- **Invite front-line staff** who know the exceptions.
- **Bring real documents and examples.**
- **Define terms** and record synonyms in a glossary.
- **Write relationships as sentences** and test them.
- **Ask about history** for every important thing.
- **Use workshop examples as test cases** later.
- **Keep the outputs** for future changes and training.

## Questions worth considering

- Do the people who will use our next system understand and agree with its data model?
- Which words mean different things in different parts of our business?
- Which awkward cases would break a simple design?
- What history will we need to report on in two years' time?
- Where are the definitions behind our current systems written down?

## Bringing it together

A data model decides what a business system can record and report, and it is far cheaper to get right before building than after. A workshop with the people who do the work, guided by a facilitator, can capture the things, definitions, relationships, facts, rules and history the system must handle, tested against real examples. Prepare with real documents, write relationships as sentences, resolve disagreements deliberately, keep the outputs and use the workshop's examples to test the finished system.

---

*Source: KEVOS® editorial notes, drawing on general business analysis and data modelling practice. The worked example is illustrative. This article is general information.*
