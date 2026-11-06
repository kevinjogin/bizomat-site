---
title: "Predictive, agile or hybrid: choosing how to deliver engineering and product projects"
description: "Plan-driven delivery suits stable requirements and costly change; agile suits uncertainty and cheap change. How to read a project, combine the two deliberately and avoid empty rituals."
publishDate: 2026-10-09
category: "Projects"
tags:
  - projects
  - product-development
author: "BIZOMAT"
featured: false
draft: false
---

A product business is developing a connected controller for irrigation pumps: an enclosure and circuit board that will be tooled and certified, firmware that runs on the board and a phone dashboard for farmers. The engineering manager has used traditional stage-gated plans for years. The software developers want to work in two-week sprints. The managing director has read that agile is faster. Everyone is partly right, and a single method applied to the whole project would serve parts of it badly.

How a project is delivered matters as much as what it delivers. Some work suits a **predictive** approach, sometimes called plan-driven or waterfall: requirements are defined early, the work is planned in sequence and changes are controlled because they are expensive. Other work suits an **adaptive** approach, usually called agile: the product is built in short cycles, priorities change as people learn and feedback from users drives what comes next. Many engineering and product projects need both, combined deliberately in a **hybrid** approach.

This article explains the spectrum of delivery approaches, the difference between iterative and incremental development, how to read a project to decide which approach fits, what agile methods such as Scrum and Kanban actually involve, how hybrid approaches work for products that combine hardware, software and compliance, and the mistakes that make each approach fail. It is general information for project managers, engineers and owners of product and engineering businesses.

## A spectrum, not a choice of two

Delivery approaches sit on a spectrum:

- **Predictive**: scope, time and cost are planned in detail early; work proceeds through sequential phases; the result is delivered once, at the end, or in a few large pieces. Change is controlled because late change is expensive.
- **Iterative**: the solution is refined through repeated cycles, such as successive prototypes, each improving on the last.
- **Incremental**: the solution is delivered in usable pieces, each adding capability.
- **Adaptive (agile)**: iterative and incremental together, in short, time-boxed cycles, with priorities adjusted after each cycle based on feedback.
- **Hybrid**: a deliberate combination, typically a predictive framework of stages and gates with adaptive delivery inside some or all of them.

A useful distinction: **iterative** means doing it again to improve it; **incremental** means adding another usable piece. A series of prototypes is iterative; a building handed over floor by floor is incremental. Agile methods combine both.

## Delivery cadence and life cycle

Two related choices follow from the approach:

- **Delivery cadence**: how often the project delivers something usable. It may be a single delivery at the end, multiple deliveries of phased components, periodic releases on a regular schedule, or continuous delivery of small changes.
- **Life cycle**: the sequence of phases from start to finish, separated by **gates** where decisions are made to continue, change course or stop.

The three should be consistent. A predictive approach usually has a few sequential phases and one or few deliveries. An adaptive approach has short repeating cycles and frequent delivery. Mismatches, such as frequent sprints feeding a release that can only happen once a year, produce rework, waiting and confused governance.

## Reading the project: what pushes which way

| Factor | Pushes towards predictive | Pushes towards adaptive |
|---|---|---|
| **Requirements** | Stable, clear and well understood | Emerging, uncertain or changing |
| **Cost of late change** | High, such as tooling, construction or certified hardware | Low, such as software, documents and processes |
| **Regulation and safety** | Heavily regulated, requiring documented evidence | Lighter regulatory burden |
| **Ability to deliver in pieces** | Only useful once complete | Useful in partial increments |
| **Customer involvement** | Limited, at milestones | Available frequently |
| **Size and interfaces** | Large, with many interfaces and suppliers | Small to medium, few interfaces |
| **Contracts** | Fixed scope and price | Flexible scope, time and materials, or capped |
| **Team** | Distributed, part-time, new to agile | Dedicated, co-located or well connected, experienced |

Most engineering projects score differently on different parts of the work. The building, tooling or certified hardware may push strongly towards predictive, while the software, the user interface or the process design push towards adaptive. That is the case for a hybrid. The [read the constraints, then tailor the method](/reados/collections/project-sponsors-governance-and-decisions/read-the-constraints-then-tailor-the-method/) article explains how the binding constraint should shape the method.

## What agile methods involve

Agile is a family of methods built on a few shared ideas: value working results over documentation for its own sake, collaborate closely with customers, respond to change rather than rigidly following a plan, and put capable people and their interactions ahead of process. Its practices matter more than its vocabulary.

**Scrum** is the best-known agile framework:

- **Roles**: a product owner who owns and prioritises the list of work; a Scrum master who coaches the team and removes obstacles; and the developers who do the work and organise themselves.
- **Artefacts**: a **product backlog**, the ordered list of everything that might be built; a **sprint backlog**, the work selected for the current cycle; and the **increment**, the usable result of each cycle.
- **Events**: a **sprint**, a fixed cycle of one to four weeks; sprint planning; a short daily stand-up; a **sprint review** with stakeholders to show the increment and gather feedback; and a **retrospective** to improve how the team works.
- **Definition of done**: the shared standard an item must meet to count as complete, including testing and documentation.

**Kanban** is an alternative that uses a visual board of work stages, explicit limits on work in progress and continuous flow rather than fixed cycles. It suits support, maintenance and work that arrives unpredictably.

Common supporting practices include **user stories**, short descriptions of a capability from a user's point of view with acceptance criteria; relative estimation; and prioritisation methods such as must, should, could and won't.

## Iteration also works in hardware

Agile methods were developed for software, but their underlying idea, learning quickly through short cycles and real feedback, applies to physical products too, particularly early on:

- **Rapid prototyping**: 3D printing, machined prototypes and breadboard electronics allow several design iterations in weeks rather than months.
- **Early user testing**: putting rough prototypes in front of users reveals usability problems before the design is fixed.
- **Time-boxed design cycles**: fixed periods with a review at the end keep design teams converging rather than polishing indefinitely.

The cost of change in hardware rises sharply at certain points: design freeze, tooling commitment, certification and production. Those points are natural gates. Before them, iterate freely; after them, control change carefully. The [cost you commit before you spend](/reados/collections/specifications-product-quality-and-sustainability/the-cost-you-commit-before-you-spend/) article explains why design-stage decisions fix most of a product's cost.

## How hybrid approaches work

A practical hybrid for engineering and product work usually has:

1. **A predictive framework** of stages and gates: concept, design, design freeze, tooling, verification and certification, launch. Gates are where investment decisions are made and where compliance evidence is reviewed.
2. **Adaptive delivery inside stages** where the work suits it: design iterations before freeze, and software, firmware and digital services developed in sprints throughout.
3. **Integration milestones** where hardware and software must come together, planned in the predictive framework so that sprints have fixed points to aim at.
4. **A shared definition of done** that includes the documentation, testing and compliance evidence the gates require, so agile work does not reach a gate unprepared.
5. **One backlog or requirements list** for the product, with clear ownership of priorities, so hardware and software teams work from the same picture.

```figure
type: svg
title: A hybrid: gates outside, sprints inside
alt: A row of five stages with gates between them: concept, design to freeze, tooling and compliance, pilot and launch. Inside the early stages, short loops represent hardware design iterations; a parallel lane of loops represents firmware and app sprints that meet the hardware at integration milestones.
caption: The predictive frame holds the expensive, hard-to-change decisions; iteration happens inside it where change is cheap.
viewbox: 0 0 640 210
body:
<rect class="bx" x="10" y="20" width="110" height="40" rx="6"/>
<rect class="bx" x="135" y="20" width="110" height="40" rx="6"/>
<rect class="bx" x="260" y="20" width="110" height="40" rx="6"/>
<rect class="bx" x="385" y="20" width="110" height="40" rx="6"/>
<rect class="bxa" x="510" y="20" width="120" height="40" rx="6"/>
<text class="tx txs" x="65" y="45" text-anchor="middle">Concept</text>
<text class="tx txs" x="190" y="45" text-anchor="middle">Design to freeze</text>
<text class="tx txs" x="315" y="45" text-anchor="middle">Tooling, compliance</text>
<text class="tx txs" x="440" y="45" text-anchor="middle">Pilot</text>
<text class="txb" x="570" y="45" text-anchor="middle">Launch</text>
<path class="la" d="M127 14V66M252 14V66M377 14V66M502 14V66"/>
<path class="ln flow" d="M30 110a25 18 0 1 0 50 0a25 18 0 1 0 -50 0M150 110a25 18 0 1 0 50 0a25 18 0 1 0 -50 0"/>
<text class="tx txs" x="20" y="146">hardware iterations</text>
<path class="la flow" d="M30 176a20 14 0 1 0 40 0a20 14 0 1 0 -40 0M110 176a20 14 0 1 0 40 0a20 14 0 1 0 -40 0M190 176a20 14 0 1 0 40 0a20 14 0 1 0 -40 0M270 176a20 14 0 1 0 40 0a20 14 0 1 0 -40 0M350 176a20 14 0 1 0 40 0a20 14 0 1 0 -40 0"/>
<text class="tx txs" x="420" y="180">firmware and app sprints</text>
```

Regulated products show why hybrids are common. Many products need documented design control, risk management and test evidence for compliance, while their software benefits from rapid iteration. Building the documentation and evidence into each sprint, rather than writing it at the end, lets both needs be met.

## Measure progress in a way that suits the approach

Each approach needs its own evidence of progress:

- **Predictive work** is usually tracked against milestones and a baseline plan, with measures such as completed and accepted deliverables, schedule variance and earned value. The risk is reporting effort spent rather than results achieved.
- **Adaptive work** is tracked by working increments delivered and accepted, the rate at which the team completes backlog items and how much of the backlog remains, often shown on a burn-up chart. The risk is counting activity, such as stories closed, without checking that the increments are usable and valued.
- **Hybrid work** needs both, joined at the integration milestones and gates. A simple rule helps: report progress by what has been demonstrated to work, whether that is an accepted drawing, a passed test or a feature used by real customers.

Plan near-term work in detail and later work at a higher level, refining it as the project approaches. This rolling approach to planning keeps forecasts honest in both styles of delivery.

## Contracts and governance

Delivery approach and contract type need to fit. A fixed-price, fixed-scope contract assumes the scope can be defined in advance; using agile delivery inside it creates tension when priorities change. Options include fixing time and cost while allowing scope to vary within an agreed priority list, contracting in stages with a decision at each, or using time-and-materials contracts with spending caps and regular reviews.

Governance should match too. Agile teams still need oversight, but it works best through regular reviews of working results, budget burn and forecasts, not through detailed task-level plans that the team will change every fortnight.

## Tailor the method, not the principles

Whatever approach is chosen, the underlying disciplines remain: clear objectives and benefits, understood stakeholders, managed risk, defined quality, controlled spending and honest reporting. Tailoring means adjusting how these are done to suit the work, not abandoning them. Too much process wastes time and buries small projects; too little leaves large or risky ones uncontrolled. Both are failures of tailoring. Record the tailoring decisions and the reasons, and revisit them as the project learns.

## Common failures of each approach

**Predictive approaches fail when:**

- Requirements are uncertain but treated as fixed, so the result meets the specification but not the need.
- Feedback arrives only at the end, when change is most expensive.
- Detailed plans for distant work give false confidence.

**Agile approaches fail when:**

- Rituals are adopted without the substance: stand-ups and sprints with no working increments and no user feedback.
- Nobody genuinely owns priorities, so the backlog becomes a wish list.
- Technical quality, documentation and compliance work are deferred and pile up.
- The cost of change in hardware or contracts is ignored.

**Hybrid approaches fail when:**

- The two halves are not integrated: hardware and software teams plan separately and meet only at the end.
- Gates demand evidence that the agile teams never planned to produce.
- The organisation calls a predictive project with weekly meetings "agile".

## A worked example

This is an illustrative example. A 25-person Australian business is developing a connected controller for irrigation pumps: an enclosure and circuit board, embedded firmware and a phone app that alerts farmers to faults and lets them adjust schedules.

**Reading the project.** The enclosure and board have a high cost of late change: tooling, board production runs and electrical safety and electromagnetic compatibility testing all follow design freeze. The firmware and app are uncertain, because the team does not yet know which features farmers will value, and cheap to change.

**The hybrid.** The project uses five stages with gates: concept, design to freeze, tooling and compliance testing, pilot, and launch. Within the concept and design stages, the hardware team runs three-week design iterations with printed enclosures and prototype boards, testing them with three farmers. The firmware and app teams run two-week sprints throughout, with a sprint review that includes a farmer on video call. Integration milestones are fixed in the plan: first firmware on prototype board, full system on pilot hardware, and compliance-ready firmware before testing.

**Definition of done.** Each sprint's definition of done includes updated test records and change notes, so the evidence needed at the compliance gate accumulates as the work progresses rather than being written at the end.

**What changed.** Sprint reviews reveal that farmers care far more about reliable SMS fault alerts than about the scheduling screens the team had prioritised. The backlog is reordered and the scheduling features are simplified. Hardware design freeze happens on the planned date after the third iteration, and the enclosure is tooled once, without later changes.

**Result.** The pilot units go to twenty farms with a product that does fewer things than originally planned but the most valued ones well. The compliance testing gate passes with evidence already assembled. The business launches on the schedule set at the concept gate.

```figure
type: compare
title: What iteration changed in a pump controller project
cols: Planned | Delivered
caption: Hardware froze on the planned date and the compliance gate passed with evidence already assembled.
- App priorities | Scheduling screens | Reliable SMS fault alerts
- Scope | Many features | Fewer, the most valued, done well
- Evidence | Written at the end | Accumulated sprint by sprint
- *Launch | Date set at the concept gate | Met
```

## Applying this in an Australian business

- **Assess each part of the project** for requirement stability, cost of change and regulation.
- **Use predictive planning** where late change is expensive and evidence is required.
- **Use short, feedback-driven cycles** where requirements are uncertain and change is cheap.
- **Iterate hardware early**, before freeze, with rapid prototypes and users.
- **Combine deliberately**: stages and gates around adaptive delivery, with integration milestones.
- **Build compliance evidence into each cycle.**
- **Match contracts and governance** to the approach.
- **Record tailoring decisions** and revisit them.

## Questions to ask before choosing an approach

- Which parts of this project are uncertain, and which are well understood?
- Where does the cost of change jump, and what are the points of no return?
- How often can users or customers give us real feedback?
- What evidence will regulators, certifiers or customers require, and when?
- Does our contract allow scope to change, and who decides priorities?
- Are we adopting practices because they help, or because they are fashionable?

## Bringing it together

There is no single best way to deliver a project. Predictive approaches suit stable requirements and costly change; adaptive approaches suit uncertainty and cheap change; most engineering and product projects contain both. Read each part of the project for requirement stability, cost of change, regulation and the possibility of feedback, then combine approaches deliberately: a framework of stages and gates where commitment and evidence matter, short cycles with real feedback where learning matters, and fixed integration points where the two meet. Keep the underlying disciplines, tailor how they are applied, and judge the approach by the value it delivers rather than the rituals it uses.

---

*Source: BIZOMAT editorial notes, drawing on earlier BIZOMAT project management study material on development approaches and life cycles, agile and hybrid delivery, tailoring and managing uncertainty in modern projects. The worked example is illustrative. This article is general information.*
