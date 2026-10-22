---
title: "What your schedule quietly decides: who spends the slack and when you find out you were wrong"
description: "Schedules hide two big decisions: who may use spare time, and when the hardest, least reversible work happens. How to keep a slack ledger and buy early proof before the point of no return."
publishDate: 2026-10-08
category: "Business"
tags:
  - operations
  - validation
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

A project schedule looks like a neutral list of dates. It is not. Hidden inside it are two decisions that matter more than most of the dates themselves, and almost nobody makes them on purpose. The first is **who is allowed to spend the spare time**. The second is **when the hardest, least reversible work happens**, and therefore when the business finds out whether its plan actually works.

Spare time in a schedule, usually called **float** or slack, is real contingency. Often it is larger than any contingency anyone declared. Yet it has no owner, no budget line and no record of who used it. A crew reschedules for convenience, a supplier delivery is accepted a fortnight late because the schedule "had room", a person is moved to more visible work. None of this is recorded as spending, because schedules record dates, not entitlements. The days simply disappear, and the next report shows a smaller number in a column few people read.

Meanwhile, perfectly sensible rules for ordering work push difficulty towards the end. The activity most capable of proving the plan wrong, such as running a new line on real product or migrating the real data, ends up scheduled after the old equipment is sold, the money is spent and the launch is announced. This article explains how float is spent without anyone deciding, how to keep a simple ledger for it, why good sequencing rules defer risk to the worst moment, and how to buy early proof before the point of no return. It is general information for anyone planning projects in a small business.

## Float belongs to the chain, not the task

Float appears when one chain of work is shorter than the chain beside it: the shorter chain has room to slip without delaying completion. Scheduling tools usually print that room against every task on the chain. Each task owner reads it as personal headroom. Five people can each be told they have two weeks, and between them they have two weeks.

Four misreadings follow:

- **Float shown against my task is mine.** Total float belongs to the whole chain. The first person to use it spends it for everyone downstream.
- **Using float is free because the finish date did not move.** The date did not move; the protection did. Every day used is a day of variation the schedule can no longer absorb, and the loss surfaces later, blamed on whatever goes wrong next.
- **Cutting float is efficiency.** Tightening estimates on work that is not critical turns a buffer into a commitment. Sometimes that is right, because slack does invite drift. But it should be a decision, not a side effect.
- **Someone would notice.** There is no float account and no notice to the people whose protection just shrank. The evidence of spending is a lower number in a later report, indistinguishable from ordinary progress.

So the business really holds two contingencies. One is in money, sits in the budget and has an owner and rules. The other is in days, sits in the network of tasks and has none of those, and it is often the larger of the two.

## A simple float ledger

Turning float into a managed reserve takes a few hours, not new software:

1. **Record float by chain at the start.** List each chain of work and how much spare time it has. This is the opening balance.
2. **Give each chain an owner.** Usually the person accountable for the finish date, not the person doing an individual task.
3. **Set the rule.** A task owner may absorb a delay as long as the next task's earliest start does not move. Beyond that, using the shared float needs the chain owner's agreement.
4. **Log each use.** Date, chain, days used, who used it, why (slippage, resequencing, a supplier delay, tighter estimates) and what remains.
5. **Set triggers.** When a chain's remaining float falls below one reporting period, treat it as critical. When total float has shrunk a lot while the finish date has not moved, review the schedule as if it had been re-planned.
6. **Review monthly.** Separate float lost to slippage from float spent deliberately. Deliberate spending that bought nothing, not a shorter finish, lower cost or reduced risk, is protection given away for free.

```figure
type: steps
title: A simple float ledger
caption: The schedule holds a second contingency, in time, that nobody owns unless someone is given it.
- Record float by chain | the opening balance
- Give each chain an owner
- Set the rule | when shared float needs approval
- Log each use | who, why, what remains
- Set triggers | low float means critical
- *Review monthly | slippage or deliberate spend?
```

Where work is contracted out, agree in the contract who owns the float in the joint programme. If the contract is silent, the contractor's schedule tends to absorb slack the customer paid for, and the customer learns this during a delay claim.

## The critical path is a forecast, not a promise

Owners are often shown a line of red tasks and told it is the critical path. It is useful information, but it is calculated, not discovered. It is only as good as the schedule behind it:

> If the scope is complete, the logic is real, the durations are achievable, the people and equipment are available and the calendars are right, this sequence currently determines the earliest finish.

That statement is less comforting than a date, and much more useful. It points attention at what has to stay true. A critical path built on missing work, artificial links or optimistic durations can be precise and wrong. Zero float produced by a forced date is not a plan; it measures the gap between the demand and reality. And the critical path moves: near-critical chains can take over with little warning, especially when their float is being spent unseen. The [how confident is that finish date](/reados/collections/project-estimates-schedules-and-costs/how-confident-is-that-finish-date/) article covers why parallel streams lower the real odds of finishing on time.

## Good sequencing rules push difficulty late

Two pieces of project advice are both correct and pull against each other. The first: influence over a project is highest at the start and falls, while the cost of change rises, so resolve what matters early. The second is a set of rules for ordering work:

- **Follow the dependencies.** Each task follows what it genuinely needs.
- **Level resources.** Schedule work for when the people and equipment are free.
- **Let the team find its feet.** Save the most demanding work until the team is experienced.
- **Protect the early stages.** Start with easy wins, so the project is not cancelled before it gets going.

Each rule is sensible. Every one of them defers difficulty. Work that integrates everything sits at the end by definition. The scarcest specialists are free last. The team is most experienced at the end. The riskiest work is kept away from the fragile early stage. Applied together, competent rules produce a schedule in which the hardest, least reversible work happens exactly when the business can least change anything and pays most for trying.

The useful distinction is between two questions:

- **When is it easiest to do this work?** Every sequencing rule answers this.
- **When is it cheapest to be wrong about it?** No sequencing rule asks this.

The gap between the two answers is risk the schedule creates silently.

```figure
type: balance
title: Two questions about when to do the work
left: When is it easiest?
right: When is it cheapest to be wrong?
tilt: right
caption: Every sequencing rule answers the first question; none asks the second.
- Follow the dependencies | Before the point of no return
- Level resources | While a failure can still be absorbed
- Let the team find its feet | With a partial proof, done small
- Protect the early stages | Not after the money is spent
```

## Find the point of no return

The **point of no return** is rarely written down. It is the moment after which every remaining option costs real money: the old machine is sold, the deposit is non-refundable, the building is modified, the launch is announced, the staff are hired. Find it for each major commitment by asking: if we reversed this the day after committing, what would it cost?

Then list every activity scheduled **after** that point that could still prove a key assumption wrong: a performance target, a quality standard, a customer requirement, a throughput or cost rate. These are the proofs that will arrive too late to change anything cheaply.

For each one, ask what **partial proof** could happen before the point of no return:

| Rule that pushed it late | What it defers | Early partial proof to consider |
|---|---|---|
| Follow the dependencies | Testing the whole system | A small-scale trial of the critical interface |
| Level resources | Work needing the scarcest specialists | Pay for a few specialist days early, on the riskiest assumption |
| Let the team find its feet | The most demanding task | A rehearsal on a representative sample with the real team |
| Protect the early stages | The work most likely to fail | A deliberately hard first case, done small |

Then compare the cost of the early proof with the cost of being wrong after the point of no return. The second figure is often large enough to end the argument. Where the business decides not to buy an early proof, the owner should accept that risk knowingly, not discover it later as a note in a risk list. The [learn before you commit](/reados/collections/growth-business-models-and-new-markets/learn-before-you-commit/) article covers staging commitments so information arrives in time.

## A worked example

This is an illustration. A small brewery is installing a new canning line to replace a bottling line. The project has three chains: building works for the new packaging room, which are on the critical path; an electrical upgrade with 15 days of float; and trade waste approval with the water authority, with 10 days of float.

**Float.** Over six weeks, the electrician moves the switchboard work back eight days to suit another job, and the brewery accepts a cable delivery six days late because "the schedule had room". Nobody records either. The electrical chain's 15 days of float are down to one, and it is about to become the critical path. When the owner starts a float ledger, this shows up immediately. The owner asks the electrician to commit to fixed dates for the remaining work, and the chain owner, the project lead, now approves any further use.

```figure
type: bars
title: The brewery's electrical float, spent without a record
unit: days
caption: Two unrecorded decisions left one day of float; the chain was about to become critical.
- Opening float | 15
- Switchboard work moved for another job | −8
- Cable delivery accepted late | −6
- *Remaining | 1
```

**Sequencing.** The plan, built from sensible rules, puts the hardest test last: running the canning line at full speed on real beer, checking seam quality and fill levels. That would happen after the old bottling line is sold, the first can order of 200,000 printed cans is paid for and launch dates are agreed with two bottle shop chains. If the seams fail, the brewery would have no way to package beer for weeks.

The owner identifies the point of no return as selling the bottling line, and buys a partial proof before it: a two-day factory acceptance test at the canning-line supplier, using the brewery's own beer and a pallet of its printed cans, with seam inspections by an independent technician. The test costs about $4,000 including travel. The cost of a failed line after the sale, in lost sales and emergency contract packing, would run to several weeks of revenue. The trial reveals a seam setting problem with the brewery's can supplier, which is corrected before shipping. The bottling line is sold only after the line passes on-site testing.

```figure
type: timeline
title: Moving the hardest test before the point of no return
caption: About $4,000 against several weeks of lost sales and emergency contract packing if the seams failed after the sale.
- *Before | Two-day factory test | the brewery's own beer and printed cans, seams checked independently
- Point of no return | Selling the bottling line
- After | Commitments locked in | 200,000 printed cans paid for; launch dates agreed with two chains
```

## How this applies to a small Australian business

- **List your chains of work** and the float each has, at the start of a significant project.
- **Name an owner** for each chain's float.
- **Record every use of float**, with a reason.
- **Treat the critical path as conditional**, and check the assumptions behind it.
- **Find the point of no return** for each major commitment.
- **List the proofs scheduled after it**, and buy partial proofs earlier where the cost of being wrong is high.
- **Write float ownership into contracts** with key contractors.
- **Record why the order of work was chosen**, while the reasoning is fresh.

## Signals worth watching

- Several people each believe they have the same spare time.
- Supplier delays accepted because "the schedule had room".
- Chains quietly becoming critical.
- Key tests scheduled after equipment is sold or launches are announced.
- Easy work first, with no early test of the hard part.
- A critical path that depends on forced dates.

## Common mistakes

- **Reading float as belonging to individual tasks.**
- **Spending float without recording it.**
- **Tightening estimates on non-critical work** without deciding to spend the buffer.
- **Treating the critical path as fixed.**
- **Letting sequencing rules decide** when the business finds out it is wrong.
- **Recording deferred risks** instead of accepting or reducing them.

## Frequently asked questions

**Do we need scheduling software to track float?** No. A simple table of chains, opening float and a log of uses is enough for most small-business projects.

**Isn't some float meant to be used?** Yes. That is what it is for. The point is to use it deliberately, with the owner of the chain agreeing, so you know how much protection remains.

**What if early proof is expensive?** Compare it with the cost of being wrong after the point of no return. Often a small, partial proof captures most of the value.

**Should contractors share their float?** It depends on the contract. Agree it in writing, because otherwise it becomes an argument during a delay claim.

**How do we find the point of no return?** For each major commitment, ask what it would cost to undo the day after you make it. Where that cost jumps, you have found it.

## Questions to ask

- How much float did this project start with, and how much is left?
- Who decided each time float was used?
- Which chains are close to becoming critical?
- What has to be true for our critical path and finish date to hold?
- What is our point of no return, and which proofs are scheduled after it?
- What partial proof could we buy before it?

## Bringing it together

A schedule quietly decides who may spend spare time and when the business learns whether its plan works. Treat float as a reserve owned by the chain, record each use and set triggers for when protection runs low. Read the critical path as a conditional forecast. Recognise that good sequencing rules push the hardest work late, find the point of no return, and buy partial proof of key assumptions before it. A few deliberate decisions at the start turn a list of dates into a plan that finds problems while they are still cheap.

---

*Source: KEVOS® notes, drawing on teaching material on critical path scheduling, float, resource levelling and project life cycles, and the US Government Accountability Office's Schedule Assessment Guide. Examples and figures in this article are illustrations. This article is general information.*
