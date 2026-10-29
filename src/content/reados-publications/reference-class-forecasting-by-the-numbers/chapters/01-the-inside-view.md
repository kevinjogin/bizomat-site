---
book: reference-class-forecasting-by-the-numbers
chapterSlug: the-inside-view
order: 1
title: "The inside view and the plan on the table"
description: "How Bay 4's A$2.40m estimate was built, why inside-view estimates run optimistic, and a first look at 24 past projects: 20 over budget, median ratio 1.14."
draft: false
---

An estimate is usually built by looking hard at the project in front of you: what has to be bought, built, installed and commissioned, what each item will cost, how long each step will take and what might go wrong. That way of seeing a project is called the **inside view**, and it is indispensable. Nobody can order a machine, sign a building contract or plan a shutdown without it. It also has a well-documented weakness. Estimates built this way, however careful, tend to come in low and short, and they do so in a consistent direction rather than at random.

This chapter sets out the running case, a factory expansion called Bay 4, and shows how its estimate was built from the inside. It explains why that method leans towards optimism, quotes what large-scale published research has found about how often projects meet their budgets, defines the alternative, the **outside view**, and takes a first look at what the business's own records say. It ends with the line in the estimate that nobody could explain: a contingency of A$120,000, excluding GST, set at "what we always use".

## The plan on the table

This is an illustration. A precision machining business in western Sydney, with about sixty staff, wants to add a fourth production bay. Bay 4 is a 600 m² extension to the factory, two five-axis machining centres with their tooling, a pallet automation system so that the machines can run unattended overnight, and the software and network work needed to schedule the pallets and monitor the machines. The project team is the operations manager, the production engineer, the finance manager and the owner, with a builder and an automation integrator giving prices.

The team built its estimate the usual way, item by item. All money in this book is in Australian dollars excluding GST, and in 2026 dollars unless stated.

- **Building works, A$860,000.** A builder's budget price for the extension, slab, services, crane rails and approvals, worked up from a concept drawing. That is about A$1,433 per square metre of floor.
- **Machines, A$1,000,000.** Supplier quotations for the two machining centres with tooling, freight, rigging and installation.
- **Automation, A$280,000.** An integrator's budget quotation for the pallet system, its controls and its interface to both machines.
- **Software and network, A$140,000.** An allowance for scheduling and monitoring software, licences, network cabling and switches, and integration with the business's existing systems.
- **Contingency, A$120,000.** Five per cent of the base cost is A$114,000, rounded up to a round figure. It is 5.0% of the approved budget.

The base cost is **A$2.28 million**, the contingency brings the approved budget to **A$2.40 million**, and the plan runs **36 weeks** from approval to the first production shift.

```figure
type: stack
title: Bay 4's inside-view budget of A$2.40m
unit: A$'000
caption: This is an illustration. Four components priced from quotations and allowances make up the A$2.28m base; the A$120k contingency is 5% of the approved budget.
- Building works | 860 | builder's budget price
- Machines | 1000 | supplier quotations
- Automation | 280 | integrator's budget quotation
- Software and network | 140 | allowance
- Contingency | 120 | "what we always use"
```

Nothing about this estimate is careless. The machine prices are firm quotations, the building price came from a builder who has worked on the site before, and the team walked through the schedule week by week. That is exactly the point: the estimates for the business's earlier projects were built with the same care, and most of them still finished over budget.

## What the inside view is

The inside view treats the project as a unique case and forecasts it from its own particulars: its scope, its plan, its suppliers, its risks as the team sees them. Kahneman and Tversky (1979) drew the distinction this book rests on. **Singular information** is about the case at hand: this building, this integrator, this schedule. **Distributional information** is about how cases of the same kind have turned out. People forecasting a project naturally reach for singular information, because it is detailed, specific and feels relevant. Distributional information feels remote and generic, and is usually ignored, although it is the better predictor.

An inside-view estimate is a story of how the project will go, with a price attached to each step. Stories are built from the events people can foresee. The events that actually drive overruns are mostly the ones nobody listed: a network operator demanding a new substation, a gripper that has to be redesigned after trials, a data migration that turns out to be three times the size. Each was unforeseeable as a specific event. As a class of event, something of that kind happens on most projects.

The inside view still has to be done well. A careless base estimate cannot be rescued by any later correction, and the components, quantities and quotations are what every later chapter works from. [Estimating project costs from cost drivers, not templates](/reados/collections/project-estimates-schedules-and-costs/estimating-project-costs-from-cost-drivers/) covers how to build that base. This book is about what to do once it exists.

## Why it runs optimistic

Four well-described effects push inside-view estimates in the same direction.

- **The planning fallacy.** People forecast the time and cost of their own plans from the best-case path through them, even when they know that similar plans in the past took longer. The plan is imagined going to plan.
- **Optimism bias.** People overrate their own skill and luck, and underrate the chance of bad events. Lovallo and Kahneman (2003) described how this distorts business forecasts by executives who are otherwise rigorous.
- **Strategic misrepresentation.** When an estimate decides whether a project goes ahead, there is pressure, deliberate or not, to present a number that wins approval. Flyvbjerg's research separates this political-economic explanation from the psychological ones, and finds both at work.
- **Uniqueness bias.** Teams see their project as different from earlier ones, so the earlier ones seem not to apply. Chapter 3 returns to this when choosing which past projects count.

In a small business the second and fourth effects usually matter most. Nobody at the Bay 4 table is trying to mislead the owner. But the owner wants Bay 4, the operations manager has argued for it for two years, and A$2.40 million is close to the figure the owner had in mind before any prices came in. Those facts shape an estimate without anyone deciding that they should.

```figure
type: compare
title: Two ways of looking at Bay 4
cols: Inside view | Outside view
caption: The two views answer different questions. The outside view does not replace the estimate; it tests and corrects it.
- Starts from | Bay 4's scope, quotations and plan | How similar past projects actually turned out
- Main evidence | Singular: this site, these suppliers | Distributional: a class of comparable projects
- Typical error | Too low and too short, in a consistent direction | Wider spread, centred on what happened
- Handles unknown events | Only those someone thought to list | All of them, in the proportion they occurred
- *Output | A base cost and a plan | A ratio to apply to the base, at a chosen confidence
```

## What published research shows

The largest published body of evidence on project outcomes comes from Bent Flyvbjerg's database of more than 16,000 projects of many types worldwide. The supplementary material to *How Big Things Get Done* (Flyvbjerg and Gardner, 2023), drawn from that database, reports that **47.9%** of projects were delivered on budget or better, **8.5%** on budget and on time, and **0.5%** on budget, on time and on benefits.

```figure
type: stats
title: Delivery against budget, time and benefits in the Flyvbjerg database
caption: Published results, from the supplementary material to How Big Things Get Done (Flyvbjerg and Gardner, 2023), drawn from the Flyvbjerg database of 16,000+ projects. Mostly large projects worldwide, not small Australian businesses.
- 47.9% | on budget or better
- 8.5% | on budget and on time
- *0.5% | on budget, on time and on benefits
```

Those are mostly large projects, many of them public, and Bay 4 is a small private one. The figures should not be read as Bay 4's odds. Their lesson is about direction and compounding: fewer than half of projects met their budget, and each further condition cut the share sharply. A business forecasting its own project from its own records is in a better position, because its records describe its own estimators, suppliers, site and habits. Flyvbjerg's research has called this pattern, over budget, over time and short of benefits, repeated across project types, an iron law of project management. Whether it holds for a particular business is an empirical question, and the business can answer it from its own files.

## The outside view

The **outside view** forecasts a project from the outcomes of a class of similar past projects, then adjusts for what is genuinely known to be different. Applied to cost, the method is called **reference class forecasting**: choose a reference class, find the distribution of outcomes in it, and place the new project on that distribution at a chosen level of confidence. The outcome is measured as a **cost ratio**:

**cost ratio = final cost ÷ approved budget at the decision to proceed**

with both in the same year's dollars. A ratio of 1.00 means the project finished exactly on budget, 1.14 means 14% over, and 0.92 means 8% under. Chapter 2, [Measuring overrun: baselines, real dollars and scope](/reados/publications/reference-class-forecasting-by-the-numbers/measuring-overrun/), sets out how to measure it consistently, because the answer depends heavily on which budget the final cost is compared with.

The business has kept project files since 2011. Twenty-four capital projects are complete: seven machine purchases, eight building works, five automation projects and four software projects. Their approved budgets range from A$75,000 for a laser marking station to A$1.15 million for a 400 m² factory extension, and together they total A$7.095 million. Each has an approved budget, a final cost and a planned and actual duration, all converted to 2026 dollars.

## A first look at the business's own record

This is an illustration. Sorted from lowest to highest, the 24 cost ratios are:

0.92, 0.97, 0.99, 1.00, 1.02, 1.03, 1.05, 1.06, 1.08, 1.10, 1.11, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.31, 1.38, 1.45, 1.52, 1.68, 1.95, 2.60

Three things stand out.

- **Twenty of the 24 finished over budget.** Only four finished at or under: a compressed-air ring main at 0.92, a laser marking station at 0.97, a CNC lathe at 0.99 and a coordinate measuring machine exactly on 1.00. That is 4 in 24, or 16.7%.
- **The middle project finished 14% over.** With 24 ratios, the median lies halfway between the 12th and 13th, 1.13 and 1.15, so it is **1.14**. Half the projects finished below 14% over budget and half above it.
- **The spread is lopsided.** The best project came in 8% under budget. The worst, the first ERP system, cost 2.60 times its budget. Overruns ran as large as 160%, savings no larger than 8%.

```figure
type: bars
title: Where the 24 past projects finished against budget
unit: projects
max: 8
caption: This is an illustration. Counts of cost ratios in each band. Four of 24 finished at or under budget; four finished more than 50% over.
- At or under budget, 1.00 or less | 4
- Up to 10% over, 1.01 to 1.10 | 6
- *10 to 20% over, 1.11 to 1.20 | 4 | contains the median, 1.14
- 20 to 30% over, 1.21 to 1.30 | 3
- 30 to 50% over, 1.31 to 1.50 | 3
- More than 50% over, above 1.50 | 4
```

If Bay 4 turned out like the median past project, it would cost about 2.40 × 1.14 = **A$2.736 million**, A$336,000 more than the approved budget. That is not yet a forecast. Chapter 3 asks whether all 24 projects belong in the class, Chapter 4 reads the distribution properly and Chapter 5 turns it into a budget. But the first look already says that, on this business's own record, a budget of A$2.40 million is closer to a best case than a middle case.

These ratios already include each past project's own contingency, because they compare the final cost with the whole approved budget. The four projects that met their budgets did so with whatever contingency they carried. The twenty that overran exhausted theirs and kept going.

## The error: a contingency nobody could trace

This is an illustration. When the finance manager reviewed the Bay 4 estimate, the first request was for the basis of each line. The machines had quotations, the building had a builder's budget price, the automation had an integrator's quotation and the software had a written allowance listing licences, cabling and integration days. The contingency line said "5%, standard". Asked where the standard came from, the team found it in the template used for the last three projects, P22 to P24, each of which had carried a 5% line. Those projects finished at **1.18, 1.15 and 1.31** times their approved budgets.

The contingency was not derived from the risks in the estimate, and not from the record of past projects. It was a habit. Habits like this survive because nobody checks them against outcomes, and because a small, round contingency makes the total look careful.

The record makes the gap plain. Only 4 of the 24 past projects finished within budgets that already included their contingency, so on the business's own history a project in this class has about a **1 in 6** chance of finishing within its approved budget. Merely reaching an even chance of staying within budget would have needed the median uplift of 14% on the approved budget. For Bay 4 that is a total of A$2.736 million, which means a contingency of 2,736 − 2,280 = **A$456,000**, or 20.0% of the base cost rather than 5%.

```figure
type: checklist
title: Questions the contingency line should answer
caption: This is an illustration. The Bay 4 contingency failed the first three. A contingency with no stated basis cannot be reviewed, and cannot be learned from.
- State what the contingency is meant to cover | identified risks, unknown events, or both
- Record the method and the evidence behind the amount | a risk list, a reference class or both
- State the chance of overrun it is meant to give | a confidence level, not a percentage of habit
- x Copy a percentage from the last project's template | 5% on P22 to P24, which finished at 1.15 to 1.31
- ? Who may spend it, and who decides when it runs out | answered in Chapter 5
```

The correction was not to replace 5% with another round number. The team kept the A$120,000 in the inside-view estimate, labelled as an inside-view allowance with no stated basis, and agreed that the budget for approval would be set from the reference class once it had been checked. The next four chapters do that work.

## What the outside view does not do

Taking the outside view does not mean abandoning the estimate. The base cost of A$2.28 million is still the best account of what Bay 4 is expected to need if things go as planned, and it is the number that ratios are applied to. Nor does the outside view say which events will occur. It says how much, in total, events of the kinds that occurred before have added to projects like this one, and how often.

It also does not excuse a poor estimate. A reference class records what happened to projects estimated in a particular way by a particular business. If the business changes how it estimates, for instance by obtaining full tenders instead of budget prices, the class may overstate future overruns for a while. That is a reason to record how each estimate was made, which Chapter 3 covers, not a reason to discard the record.


An outside view corrects an estimate after it is built; definition work improves it before approval. *Front-End Planning by the Numbers* measures how much of a project's exposure can be removed in the front end, starting with [Plan slowly, deliver quickly: where a project's money is exposed](/reados/publications/front-end-planning-by-the-numbers/plan-slowly-deliver-quickly/).

## Exercise: what a 5% contingency would have covered

Suppose that each of the 24 past projects had carried an extra 5% contingency on top of its approved budget. How many of them would have finished within that enlarged budget? How many with an extra 10%? What uplift on Bay 4's approved budget would match the median past project, and what total budget does that give?

**Worked answer.** A project finishes within its approved budget plus 5% if its cost ratio is 1.05 or less. In the sorted list, seven ratios meet that: 0.92, 0.97, 0.99, 1.00, 1.02, 1.03 and 1.05, so 7 of 24, or **29.2%**. With an extra 10%, the limit is 1.10, and ten ratios meet it, adding 1.06, 1.08 and 1.10, so 10 of 24, or **41.7%**. Even doubling the habitual contingency would have left most past projects over budget. Matching the median needs an uplift of 1.14 − 1 = **14%** on the approved budget: 2,400 × 0.14 = A$336,000, for a total of **A$2.736 million**. Because the past ratios were measured against approved budgets that already included contingency, the uplift applies to the A$2.40 million budget, not to the A$2.28 million base, a point Chapter 5 develops.
