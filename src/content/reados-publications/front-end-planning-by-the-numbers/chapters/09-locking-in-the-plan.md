---
book: front-end-planning-by-the-numbers
chapterSlug: locking-in-the-plan
order: 9
title: "Locking in the plan: long-lead orders, readiness and change after approval"
description: "What Gate 3 commits (A$3,200k, 51.8%), long-lead dates and the critical path, a ready-for-delivery check, and a fifth cold room at week 30 that would lift P(miss) to 39.1%."
draft: false
---

Approval is the moment the front end's work turns into commitments. Before Gate 3, Northbank could change its mind for the price of some studies. After it, the business has signed fixed-price packages, placed orders with lead times of half a year, accepted a connection offer and set a builder to work. The plan's value now depends on two things: that the commitments made at approval are the right ones, made on time, and that the plan is not quietly unpicked by changes that each look reasonable on their own.

This chapter sets out what Northbank committed at approval, the long-lead items and approvals that drive the delivery schedule, and the critical path to readiness at week 58. It describes a ready-for-delivery check to apply before money is committed, and the change control that protects the plan afterwards. It ends with a request, ten weeks after approval, for a fifth cold room, and the arithmetic that sent it to a second stage.

## What approval commits

This is an illustration. At Gate 3, week 22, Monday 5 April 2027, Northbank's board approved a delivery budget of **A$6,700k** excluding GST: the Class 3 delivery base of A$6,180k plus A$520k of contingency. With the A$248k already spent on the front end, total funding was A$6,948k.

On the same day it let the two largest packages at fixed prices: the refrigeration plant and rooms for **A$1,720k** and the optical grader and packing-line work for **A$1,480k**. That is **A$3,200k committed, 51.8% of the delivery base**, on the day the business had spent only A$248k, 3.9% of the total. The remaining A$2,980k (building and civil A$2,050k, electrical A$560k, fire services A$190k and design, approvals and management A$180k) was let over the following weeks as the permit arrived and the design was completed.

Committing half the delivery money at once was deliberate. The packages carry the two longest lead times, and their fixed prices rest on specifications that FEL 3 had written and tendered. Paulson (1976) observed that the ability to influence a project's cost is greatest early, while little has been spent, and falls steeply as the project proceeds. Gate 3 is where that curve turns: from here on, most cost changes are increases. The point of locking the plan is to protect what the front end bought, not to stop the business learning. *Stage Gates and Stopping Rules by the Numbers* draws the same line between money spent and money committed in [Committing before you know: spending, committing and the gate plan](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/committing-before-you-know/), where a tooling order placed ten days after a gate commits far more than that gate approved.

## Long-lead items and approvals

Five items set the pace of delivery. Two are approvals that the business cannot hurry; three are equipment with manufacturing lead times. The front end started the approvals early and placed the equipment orders on the day of approval.

```figure
type: timeline
title: Long-lead items, approvals and the delivery plan
caption: This is an illustration. Week 0 is Monday 2 November 2026. The distributor's connection works and the imported grader both arrive at week 52, the first day of the November to January line-change window.
- Week 8 | Planning permit lodged | 16 weeks; granted week 24, 19 April 2027
- Week 12 to 20 | Distributor connection applied for and offered | offer received week 20, 22 March 2027
- Week 22 | Gate 3: connection accepted, plant and grader ordered | connection works 30 weeks; plant 26 weeks; grader 30 weeks
- Week 24 to 40 | Site works | civil, ground improvement, slabs, building frame
- Week 26 to 36 | Insulated panels ordered and delivered | 10 weeks; delivered week 36, 12 July 2027
- Week 36 to 46 | Panels and cold rooms erected | rooms complete 6 weeks before power is available
- Week 48 to 52 | Refrigeration plant delivered and installed | plant arrives week 48, 4 October 2027
- * Week 52 | Power on; grader delivered | 1 November 2027; both long-lead chains converge
- Week 52 to 56 | Refrigeration commissioning and pull-down; grader installed | inside the line-change window
- Week 56 to 58 | Trials | planned ready week 58, 13 December 2027; 7 weeks of float to 31 January 2028
```

Ordering on the day of approval matters because the lead times are long and the path is tight. If the grader order had slipped four weeks after Gate 3, while someone reconsidered the supplier's terms, the grader would have arrived at week 56, been installed by week 60 and trialled by week 62, leaving 3 weeks of float instead of 7. That is the reason the grader's specification and tender were part of FEL 3, at a cost of A$10k for the two long-lead tenders: they let the order go out the day the money was approved.

### What goes into a long-lead order

A long-lead order placed in a hurry can lose the time it was meant to save. Northbank's orders for the plant and the grader each stated five things beyond the price. The **specification** was the one tendered in FEL 3, with the duty, the fruit sizes and the throughput written as measurable requirements, so that the order could not drift towards the supplier's standard model. The **delivery date** was a date, not a lead time, so that a late start at the factory was the supplier's problem to recover. **Hold points** gave the project engineer a chance to see the grader tested at the factory on sample fruit before it was shipped, when a fault costs weeks rather than a season. **Payment** was tied to milestones, with the largest part on delivery and acceptance rather than on order. And the **interfaces** (power supply, plinths, control signals and the packing-line connection) were listed with the party responsible for each, which is the item that the slab error in Chapter 7 showed to matter.

## The critical path to readiness

The critical path is the longest chain of dependent work from approval to readiness; any delay on it delays the finish. For Northbank it runs through two chains that converge at week 52. One is the distributor's connection: offer accepted at week 22, 30 weeks of works, power on at week 52. The other is the grader: ordered at week 22, 30 weeks to arrive, installed from week 52. Refrigeration commissioning needs the power, and grader installation needs the line stopped, which can only happen from 1 November. After week 52, commissioning, pull-down, installation and trials take six weeks to the planned ready date of week 58.

The site works, panels and rooms are not critical: the rooms are finished at week 46, six weeks before power is available. That slack is useful, but it is not float for the project. A delay to the rooms of up to six weeks costs nothing; a delay of one week to the connection or the grader costs a week of the project's seven. Knowing which is which tells the project manager where to spend attention, and it tells the business where an early start would help and where, as the slab in Chapter 7 showed, it would only spend money.

Converging chains need watching from outside the site. Neither the distributor's works nor the grader's manufacture happens on Northbank's land, and both can slip for months without anyone on site noticing. The project engineer therefore tracked them as milestones in the weekly report: the distributor's design, materials and outage booking for the connection, and the grader's factory build, factory test, shipping and customs clearance. A slip at any milestone triggered a rerun of the schedule simulation, so that the business saw the change in its chance of missing the harvest while there was still time to respond, for example by air-freighting a component or booking a temporary generator for commissioning. The refrigeration plant, arriving at week 48 with four weeks of installation before power on, was the nearest thing to a third critical chain and was tracked the same way.

## A ready-for-delivery check

The definition index of Chapter 3 scores the whole project. Before money is committed, Northbank also applies a narrower check: the execution section, elements C1 to C7, must each be at level 1 or 2, and a short list of owner decisions and preconditions must be recorded as done. At Gate 3 the final ratings were C1 level 2, C2 level 1, C3 level 2, C4 level 2, C5 level 2, C6 level 1 and C7 level 2, so the execution section passed.

Victoria's Gateway Review Process applies a similar idea in the public sector, with independent reviews of readiness for market and readiness for service among its six gates. Northbank's version is smaller and is run by the project engineer and the finance manager, with the independent reviewer's comments from Chapter 3 attached.

Readiness also covers the people who will do the work. Before site works began, Northbank confirmed which contractor would manage health and safety on the construction site, that a written safety plan existed for a site that would share access roads and forklift routes with a working packhouse, and how deliveries of panels and plant would be kept clear of bin traffic. In Victoria those duties arise under the *Occupational Health and Safety Act 2004* (Vic) and its regulations, and the business took its requirements and guidance from WorkSafe Victoria. Safe Work Australia's *Model Code of Practice: Construction work* (November 2024) is national model guidance for the jurisdictions that have adopted the model work health and safety laws, which Victoria has not.

```figure
type: checklist
title: Ready-for-delivery check at Gate 3
caption: This is an illustration. Every item except the last was evidenced before the packages were let. The open item is the risk carried from element B7, which returns in Chapter 10.
- Execution elements C1 to C7 at level 1 or 2 | final ratings: C2 and C6 at level 1, the rest at level 2
- Funding in place for the Class 3 total | A$6,948k, including contingency and the front end
- Owner decisions recorded | four rooms, packing-line layout two, plant sized for old and new rooms
- Long-lead specifications approved and orders ready to sign | plant, grader, panels
- Approvals in train with dates | permit lodged week 8; connection offer received week 20
- Deadline defined as ready for use | week 65, worked back from first intake (Chapter 8)
- Change control and decision rights agreed | who may approve what, and when the sponsor decides
- ? Stormwater detention requirement confirmed | not assessed; carried as an accepted risk
```

## Change control after the gate

Change is not the enemy. Some changes after approval are unavoidable, such as a supplier's drawing that differs from the concept, and some are improvements worth having. The aim of change control is to make sure each change is priced in money **and time** before anyone agrees to it, and that the person who agrees to it is the one entitled to spend the money and carry the risk.

The same change costs more after approval for three reasons. Work already designed has to be redesigned. Contractors on fixed prices price variations without the competition they faced at tender, and commonly add a margin above their tendered rate; [Lump sum contracts: price certainty and what it costs](/reados/publications/project-teams-and-contracts-by-the-numbers/lump-sum-contracts/) in *Project Teams and Contracts by the Numbers* works through why. And a change that touches the critical path consumes float that the deadline needs.

Northbank's rule is short. A change that fits within the remaining contingency and does not touch the critical path can be approved by the project manager and recorded. Anything else goes to the managing director as sponsor, with a cost estimate, a rerun of the schedule simulation and a note of which definition elements it affects. Contingency is held for the risks of the approved scope; new scope is funded separately or not at all. The general discipline of baselines and changes is set out in [Issue, change and configuration control: keeping project baselines true while the project changes](/reados/collections/project-planning-and-control/issue-change-and-configuration-control/).

```figure
type: decision
title: Routing a change request after Gate 3
question: Is it within the approved scope, within the remaining contingency, and off the critical path?
caption: The question is asked before anyone agrees in principle. A change that fails any part goes to the sponsor with its schedule effect computed.
- All three | project manager approves | recorded in the change register; contingency drawn down
- Approved scope, but on the critical path | sponsor decides | schedule simulation rerun; chance of missing the deadline stated
- * New scope | sponsor decides on separate funding | compare adding now with deferring to a later stage
- Effect unknown | not approved until assessed | the request waits; the work does not
```

## The error: a fifth room at week 30

This is an illustration. In week 30, Monday 31 May 2027, the sales team asked for a fifth 1,000-bin cold room. A large grower had offered to supply Northbank from 2028 if storage could be guaranteed. The operations manager agreed in principle at a site meeting and asked the builder to "allow for room 5", without raising a change request and without the C7 check.

The builder's request for drawings brought it to the project engineer, who raised the change request the procedure required. The assessment had four parts.

- **Cost.** Room 5 would have cost A$340k if included in FEL 3. At week 30 it needed A$38k of redesign, because the refrigeration plant, the electrical load and the building frame had been designed for four new rooms, and a variation premium of A$57k, about 15% on the redesigned work, from contractors who no longer faced competition. Total **A$435k**, 1.28 times the FEL 3 cost. It would have used 83.7% of the A$520k contingency, which was not held for new scope.
- **Time.** Four more weeks of delivery, on the critical path through the refrigeration commissioning.
- **Deadline risk.** With 40 planned weeks instead of 36, the schedule simulation gave a **39.1%** chance of missing 31 January 2028, against 5.3%, and an expected cost of delay of **A$286k** against A$36k.
- **Definition.** Elements B3 (refrigeration duty), B2 (electrical supply) and C2 (schedule) would all have dropped back a level until the redesign was done.

The sponsor's decision was to **defer room 5 to a second stage after the harvest**, built from June 2028 when the site was clear, for A$340k plus A$25k to remobilise, **A$365k**. The grower's offer was accepted for 2029, with hired storage covering the extra bins in 2028. The approved scope did not change.

```figure
type: compare
title: Room 5 at three points in time
cols: Capital cost | Delivery weeks added | Chance of missing 31 Jan 2028 | Expected cost of delay
rowhead: Room 5 added
caption: This is an illustration. The same 1,000-bin room costs least when it is in the front end's scope and most when it is added during delivery, where its real cost is the deadline risk.
- In FEL 3, before approval | A$340k | 0 | 5.3% | A$36k
- At week 30, during delivery | A$435k | 4 | 39.1% | A$286k
- * Stage 2, from June 2028 | A$365k | 0 | 5.3% | A$36k
```

The lesson was not that room 5 was a bad idea. It was that "agree in principle" had skipped the step that would have shown its price. The change register now records the date a request is made and the date it is assessed, and nobody on the project may tell a contractor to allow for a change before the assessment exists.

## Exercise: room 5 now or later

Compare the expected cost of adding room 5 at week 30 with deferring it to a second stage after the 2028 harvest. Include the capital cost, the extra expected cost of delay, the extra expected time-related cost of A$4k from the longer delivery, and, for deferral, one season of room 5's benefit forgone: 1,000 bins kept out of hired storage for 30 weeks at A$4.20 a bin-week, and 1,000 bins not handled twice at A$22 a bin.

**Worked answer.** Adding now: capital A$435k, plus extra expected cost of delay A$286k − A$36k = A$250k, plus A$4k of time-related cost, gives **A$689k**. Deferring: capital A$365k, plus the season's benefit forgone of 1,000 × 30 × A$4.20 = A$126k for storage and 1,000 × A$22 = A$22k for handling, A$148k, gives **A$513k**. Deferral is better by **A$176k**. The deferral costs A$25k more in capital than doing the work in FEL 3 would have, and gives up one season of benefit; adding now looks only A$70k dearer on capital, but its largest cost is the extra chance of losing the whole grader season. The comparison is decided by the deadline, not by the price of the room.
