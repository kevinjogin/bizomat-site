---
title: "Mapping dependencies across your projects: complexity lives in the connections"
description: "Counting projects understates complexity. How to map shared people, decisions, systems and timing across your work, find concentration points and reduce coupling with modular design."
publishDate: 2026-10-04
category: "Business"
tags:
  - systems
  - strategy
  - operations
author: "KEVOS®"
featured: false
draft: false
---

A business can look manageable on paper and still be overloaded in practice. It has six customer projects and two internal improvement projects, each with its own plan and each reporting that it is broadly on track. Yet deliveries keep slipping, the same people are in every urgent meeting and small changes take weeks to agree. The problem is not the number of projects. It is the connections between them.

Most businesses count and manage the parts: projects, people, machines, departments. Complexity often sits in the relationships between those parts: the engineer every project needs, the approval every decision waits for, the shared system every change touches, the step that cannot start until another finishes elsewhere. Eight independent projects can be easier to run than three that are tightly connected.

This article explains what structural complexity means in practical terms, where it accumulates, how to map dependencies across projects with a simple matrix, how to find concentration points, and how modular design and deliberate sequencing can reduce the coordination burden without pretending that every connection can be removed.

## What structural complexity means

Researchers in engineering systems, including Oehmen and colleagues, describe **structural complexity** as arising from the number and types of elements in a project or portfolio and the number and types of relationships between them. They also emphasise that organisational and technical systems are tightly linked: team structures, information flows and technical designs shape one another rather than operating separately. A 2017 literature review by San Cristóbal found that definitions of project complexity vary, but interdependence repeatedly appears as a core dimension.

The practical implication is that adding one more independent project may cost little, while adding one small dependency to a highly connected system can create consequences across many projects. The management burden grows through coordination, not just through count.

## Common misreadings

- **The organisation chart shows how work happens.** It shows reporting lines. It does not show who is the only person who understands a critical interface, which decision every project waits for, or which supplier appears in five plans.
- **A dependency list is enough.** Lists identify relationships but not their pattern. Ten dependencies concentrated on one person can be more dangerous than fifty spread evenly.
- **More communication solves it.** Meetings increase information flow but also consume capacity. Communication helps when it connects the right interfaces. Unstructured communication can simply add load.
- **Standardisation always reduces complexity.** Common platforms reduce local variation but can create tight coupling. A single shared system may simplify interfaces while making its failure or overload a problem for everyone.

## Where complexity accumulates

### Shared scarce capabilities

A specialist, a key machine, a test facility, a shutdown window or an approvals person can sit at the centre of several projects. Each project's demand on that resource looks reasonable on its own. Together they create a queue.

### Technical interfaces

Complexity rises when products, systems or processes exchange information, materials, energy, decisions or tolerances across boundaries. A change on one side propagates to the other. Poorly defined interfaces cause rework, because nobody is sure what a change affects.

### Decision interfaces

Some of the costliest dependencies are decisions. If several projects need the same person or meeting to resolve issues, the time it takes to get a decision becomes a constraint for all of them.

### Organisational handoffs

Each handoff between people or departments adds interpretation, waiting and potential conflict. The problem is often not the number of departments but how many times each piece of work has to cross between them.

### Timing dependencies

Some work cannot create value until something else reaches a certain point: a system must be live before a process can change, or a supplier must be qualified before a product can launch. When sequence is wrong, work accumulates without becoming usable.

## A simple dependency map

Leaders do not need specialist software to see dependencies. A **dependency matrix** in a spreadsheet is often enough:

1. **List the projects or major activities** down the left side.
2. **List the shared resources** across the top: key people, machines, systems, suppliers, decision-makers and other projects that must deliver something first.
3. **Mark each cell** where a project depends on that resource in the coming period, and note how critical the dependency is, for example high, medium or low.
4. **Total each column** to see which resources are depended on most.
5. **Look along each row** to see which projects have the most dependencies.

The columns with the most high-criticality marks are **concentration points**: single people, machines, systems or decisions on which many projects depend. These are where delay and risk spread fastest. For a richer picture, the same information can be drawn as a network diagram, with projects and resources as points and dependencies as lines, which makes clusters easy to see.

Start with the most important projects and the next few months. A complete map of everything is rarely needed and quickly goes out of date.

```figure
type: steps
title: Building a dependency matrix
caption: Columns with many high-criticality marks are concentration points.
- List projects | down the side
- List shared resources | across the top
- Mark dependencies | with criticality
- Total each column | most depended-on resources
- *Read each row | most dependent projects
```

## Coupling and modularity

**Coupling** describes how strongly a change in one part forces changes in others. Tightly coupled parts must be changed together. Loosely coupled parts can change independently.

**Modularity** is a way of designing work so that parts are loosely coupled: each module has clearly defined inputs and outputs, and its internal workings can change without disturbing the rest. Oehmen and colleagues identify modularity as a major strategy for managing complexity. It applies beyond product design:

- **A modular process** defines exactly what information or material passes between steps, so each step can improve without renegotiating the whole process.
- **A modular team** has enough end-to-end responsibility to deliver its work without constant negotiation with other teams.
- **A modular portfolio** separates projects so that trying something new in one does not destabilise the others.

Modularity creates options. A module with a stable interface can be changed, replaced, paused or scaled more easily. But modularity requires deliberately designed interfaces. Splitting an integrated problem into separate projects without defining how they connect does not reduce complexity. It hides it until the parts are put back together.

## An interface criticality review

For important projects and shared resources, ask:

| Test | Question |
|---|---|
| Dependency | What does this project need from others to succeed? |
| Concentration | Which people, systems or decisions are depended on by many projects? |
| Coupling | If this changes, how far could the effects spread? |
| Interface maturity | Are inputs, outputs, standards and decision rights stable and agreed? |
| Substitutability | Could something or someone else fill this role if it failed? |
| Modularity | Could this be changed without redesigning other things? |
| Timing | What must be true before this creates usable value? |

## Ways to respond

Once a critical dependency is visible, there are several responses, and the review should choose deliberately among them:

- **Eliminate** it by changing the design or scope so the dependency is no longer needed.
- **Buffer** it by scheduling slack or holding stock in front of the dependency.
- **Duplicate** it by training a second person, adding a second machine or qualifying a second supplier.
- **Resequence** the work so projects do not need the same resource at the same time.
- **Stabilise the interface** by agreeing clear inputs, outputs and decision rights.
- **Delegate** decisions to reduce the load on a single decision-maker.
- **Accept** it deliberately because the integration creates more value than independence would.

Treat these as investment decisions, not just scheduling adjustments. Training a second specialist or qualifying a second supplier costs money, and the dependency map shows where that spending would relieve the most pressure.

```figure
type: tree
title: Responses to a critical dependency
caption: Training a second person or qualifying a second supplier costs money now to buy independence later.
- A critical dependency
  - Eliminate | change the design or scope
  - Buffer | slack or stock in front of it
  - Duplicate | second person, machine or supplier
  - Resequence | avoid simultaneous demand
  - Stabilise the interface | inputs, outputs, decision rights
  - Delegate | spread the decisions
  - *Accept | when integration is worth more
```

## Dependencies outside the business

Some of the most consequential dependencies sit outside the business. A single supplier may provide a component used by several products. One subcontractor may be booked by three of your projects in the same month. A customer's approval process may hold up work across several jobs. A regulator's inspection schedule may decide when several installations can be completed.

Include these in the dependency matrix as columns, just like internal resources. External concentration points are often harder to relieve, because you cannot train a second person at your supplier or speed up a regulator. The available responses are different: qualifying a second supplier, booking subcontractor capacity earlier, agreeing a regular approval rhythm with a customer, or sequencing work around known inspection timeframes. Seeing the external dependencies in the same view as the internal ones helps decide where to act first.

## Keeping the map useful

A dependency map is only useful while it reflects reality. Projects start and finish, people change roles and priorities shift. A practical rhythm for a small business is a short monthly review of the matrix, plus an update whenever a major project starts, finishes or changes scope. Assign one person to maintain it, keep it simple enough that updating takes minutes rather than hours, and bring it to the meetings where resources and priorities are decided. A map that sits in a folder is a record. A map that informs scheduling and staffing decisions is a management tool.

## A worked example

This is an illustration. An engineering and fabrication business with 20 staff is running six customer projects and two internal projects: a new business management system and a new website. Every project reports green individually, yet three customer deliveries have slipped in the past two months and the owner feels permanently behind.

The owner and the project leads build a dependency matrix for the next three months. The column totals reveal three concentration points:

- **The senior design engineer** is needed for drawing approvals on five of the six customer projects.
- **The owner** approves all customer variations on all six projects and is the decision-maker for the new management system, a total of seven projects.
- **The CNC programmer** is needed by four projects in the same six-week period.

The matrix also shows that a planned change to how the new management system records job costs would affect quoting, purchasing and job reporting on every live project at once.

```figure
type: bars
title: Concentration points across eight projects
unit: projects
caption: Every project reported green on its own; the delays came from the connections between them.
- *The owner: variations and the new system | 7
- Senior design engineer: drawing approvals | 5
- CNC programmer: in the same six weeks | 4
```

The team responds:

- **Delegate**: project leads can approve variations under $3,000, which covers most of the owner's variation approvals.
- **Duplicate**: a second engineer is authorised to approve standard details from a library of approved designs, leaving the senior engineer to focus on non-standard work.
- **Resequence**: CNC programming is scheduled as a planned resource with weekly slots agreed across projects, rather than first come, first served.
- **Resequence**: the job-costing change is held until two large projects close.
- **Accept**: the website project has almost no dependencies on the rest and continues unchanged.

Over the following quarter, drawing approvals stop being the main reason for delay, the owner's approval queue shrinks and the business delivers its next five projects on time. Nothing about the individual project plans changed. The connections between them did.

```figure
type: compare
title: How the fabrication business responded
cols: Concentration | Response
caption: Nothing about the individual project plans changed; the connections between them did.
- Delegate | Owner approving every variation | Project leads approve variations under $3,000
- Duplicate | Senior engineer approving all drawings | A second engineer approves standard details from a library
- Resequence | CNC programming first come, first served | Weekly slots agreed across projects
- Resequence | Job-costing change hitting every live job | Held until two large projects close
- Accept | Website project | Almost no dependencies; continues unchanged
```

## How this applies to a small Australian business

Small businesses are especially prone to concentration, because a few capable people naturally become involved in everything. Practical steps:

- **Build a simple dependency matrix** for your current projects and the next few months.
- **Find the concentration points**: people, machines, systems and decisions that many projects need.
- **Delegate decisions** with clear limits to reduce queues at the top.
- **Train second people** for the most depended-on skills.
- **Schedule shared resources** deliberately rather than first come, first served.
- **Sequence internal improvement projects** around customer commitments.
- **Define interfaces** when splitting work between people or suppliers.
- **Revisit the map** monthly or when a major project starts or finishes.

The articles on [systems integration](/reados/collections/business-systems-and-operating-rhythm/systems-integration-making-the-parts-work-together/) and [key-person dependence](/reados/collections/starting-funding-and-structuring-a-business/key-person-dependence-in-a-small-business/) cover related ideas.

## Signals worth watching

- The same person appearing in every urgent discussion.
- Projects individually on track while cross-project deadlines slip.
- Coordination meetings multiplying faster than productive work.
- Changes in one area causing unexpected rework in several others.
- Decisions waiting for a small number of people or meetings.
- Teams creating workarounds because shared services are too slow.
- Resource plans that look fine on paper while queues for shared resources grow.
- Small changes requiring many people to agree.

## Common mistakes

- **Counting projects** rather than mapping connections.
- **Relying on the organisation chart** to understand how work flows.
- **Treating more meetings** as the answer to coordination problems.
- **Splitting work without defining interfaces.**
- **Over-centralising decisions** in one person.
- **Starting internal projects** that touch every customer project at the busiest time.
- **Mapping everything once** and never updating it.

## Frequently asked questions

**How detailed should the dependency matrix be?** Detailed enough to reveal the main concentration points, and no more. A dozen columns covering key people, machines, systems and decisions is usually enough for a small business.

**Is interdependence always bad?** No. Many valuable outcomes require integration. The aim is to know which dependencies are deliberate and valuable and which are accidental and costly.

**What if the concentration point is the owner?** That is common. Start by delegating routine decisions with clear limits, and look at where the owner's involvement adds real value. The article on key-person dependence covers this in more detail.

## Questions to ask

- Which few connections create the most coordination effort in our business?
- Which person, machine, system or decision is depended on by the most projects?
- Which dependencies are deliberate, and which are accidents of how we work?
- Where would clearer interfaces let teams work more independently?
- Are we sequencing work around real dependencies or only around project priority?
- What would stop if one critical person or resource were unavailable for a month?

## Bringing it together

Complexity is often less visible than workload because it lives between projects, people, systems and decisions. Map dependencies with a simple matrix, find the concentration points, and choose deliberately whether to eliminate, buffer, duplicate, resequence, stabilise, delegate or accept each critical dependency. Use modular design with clearly defined interfaces where independence creates value, and revisit the map as work changes. Manage the connections with the same seriousness as the parts.

---

*Source: KEVOS® notes, drawing on published engineering-systems research on structural complexity and modularity by Oehmen and colleagues, and a 2017 review of project complexity by San Cristóbal. Examples and figures in this article are illustrations.*
