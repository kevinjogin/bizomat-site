---
book: modular-projects-by-the-numbers
chapterSlug: one-project-or-twelve
order: 1
title: "One project or twelve: starting from the outcome"
description: "Define twelve packing cells by their outcome: 10 cases a minute, a pallet every 6 minutes, 36 positions and A$2.16m a year, then sketch bespoke against modular delivery."
draft: true
---

A request to automate twelve packing stations usually arrives as a request for twelve machines. That is a description of a deliverable, and it hides the question that decides almost everything else: what must be different when the work is finished? This chapter starts from that question. It sets out the outcome the running case must deliver, turns it into numbers that any proposed design can be checked against, and only then works back to the equipment.

It then sketches the two ways of delivering the programme that the rest of the book compares, bespoke and modular, explains why repetition changes the economics, and shows why twelve similar installations should be managed as one programme rather than twelve separate projects. It ends with a brief that was written from the deliverable instead of the outcome, and what that would have cost.

## Start from what must change

An outcome is the change in the business that justifies the spending. A deliverable is the thing bought or built to cause it. The two are easy to confuse because the deliverable is concrete and the outcome is not, and because the people who write the first brief are often the people who will specify the equipment. Writing the outcome first, in measurable terms, does three jobs. It gives every later design choice a test. It shows which parts of the work are really the same on every line and which differ. And it keeps the benefit visible, so that the programme can be judged on what it achieved, not on whether the machines were delivered.

This is an illustration. The snack-food manufacturer in the running case packs product by hand at the end of twelve lines on three sites: six at site A, four at site B and two at site C. Each line runs two shifts, and each shift has two operators at the end of the line, one erecting and packing cases and one stacking full cases on pallets. That is four positions per line and 48 across the business.

The outcome the business wants can be written in five measures:

- **Throughput:** every line runs at its full rate of 120 packs a minute without the end of line holding it back.
- **Labour:** three of the four end-of-line positions on each line are no longer needed, 36 in all. One person per line remains across the two shifts, to load case blanks and labels, clear faults and move finished pallets.
- **Manual handling:** repetitive lifting of full cases onto pallets stops.
- **Quality:** every case leaves with the right count and weight, and underweight cases are rejected before they are palletised.
- **Value:** a net benefit of A$180,000 a year per line, excluding GST, after the cell's own running costs.

Each measure is a test. A design that cannot keep up with 120 packs a minute fails the first. A design that palletises but leaves cases to be packed by hand fails the second. Neither failure is visible in a request for "twelve machines".

## The line sets the duty

The end of line must absorb whatever the line produces, so its duty comes from the line's rate when it is running, not from its average over a day. Each line delivers 120 packs a minute into cases of 12, which is 10 cases a minute or 600 an hour. Each pallet carries 10 cases per layer and 6 layers, 60 cases, so a pallet is completed every 6 minutes, or 10 pallets an hour when the line runs at full rate.

```figure
type: steps
title: From packs to pallets on one line
caption: This is an illustration. The duty the end-of-line cell must meet comes from the line's running rate, not its average.
- 120 packs a minute | the line's rate when it is running
- 12 packs per case | 120 ÷ 12 = 10 cases a minute, 600 an hour
- 10 cases per layer, 6 layers | 60 cases per pallet
- * A pallet every 6 minutes | 60 ÷ 10 = 6 minutes, 10 pallets an hour at full rate
```

The same arithmetic gives the manual handling the programme removes. If each full case weighs about 3 kg and a line runs for about 7 hours of each 8-hour shift, the stacking operator lifts 600 × 7 = 4,200 cases a shift, about 12.6 tonnes. Across 12 lines and two shifts, that is 24 line-shifts and about 100,800 lifts a day, a little over 300 tonnes. The case weight and running hours are illustrative, but the order of magnitude is the point: the manual-handling outcome is large, repetitive and measurable, and it belongs in the brief beside the money.

## What the outcome is worth

The case's benefit of A$180,000 a year per cell is a net figure. As an illustration of how such a number is built, three positions at a fully loaded cost of A$80,000 a year each save A$240,000, and the cell's maintenance, power, consumables and the remaining operator's added duties cost about A$60,000 a year, leaving A$180,000. Across twelve cells the benefit is A$2.16m a year, all excluding GST.

```figure
type: stats
title: The outcome in numbers
caption: This is an illustration. These five numbers are the yardstick for every later design, schedule and cost decision in the book.
- * 10 cases a minute | duty per cell | 120 packs a minute in cases of 12
- 1 pallet every 6 minutes | per cell at full rate | 60 cases per pallet
- 36 positions | no longer needed | 3 of 4 on each of 12 lines
- A$180,000 a year | net benefit per cell | A$3,461.54 a week, excluding GST
- A$2.16m a year | net benefit, all 12 cells | once every cell is running
```

The weekly figure matters as much as the annual one. A cell that starts a week earlier earns A$180,000 ÷ 52 = A$3,461.54 more; a cell that starts a week later loses it. Every week the twelfth cell waits costs the same as a week of the first cell's benefit. That turns schedule into money, and it is why the comparison between delivery options in this book is made on when benefits start as well as on what the cells cost.

## Working back to the deliverable

With the outcome written down, the deliverable follows from asking what the work at the end of the line consists of, and which of those tasks must be automated to remove three positions out of four. On every line the tasks are the same: erect a case from a flat blank, pack 12 packs into it in the right arrangement, close and seal it, check its weight, label it, and stack it on a pallet in the right pattern. The finished pallet then goes to the site's existing stretch wrapper, which is outside the programme.

The deliverable is therefore an **end-of-line cell**: case erector, case packer, checkweigher with reject, and robot palletiser, with their guarding and controls. That deliverable came from the outcome, and every part of it can be traced to one of the five measures. The checkweigher exists because of the quality measure. The case erector exists because of the labour measure, since a cell without it would leave a person erecting cases. The palletiser's speed exists because of the throughput measure.

```figure
type: tree
title: Working back from the outcome to the cell
caption: This is an illustration. Each part of the deliverable is traced to the outcome measure that requires it; anything that traces to nothing is a candidate for removal.
- Outcome: twelve lines packed and palletised without manual handling | A$180,000 a year per line, net
  - Throughput: 10 cases a minute at every line's running rate | sets the speed of every machine in the cell
  - Labour: 3 of 4 positions removed | requires erecting, packing and palletising, not one of them
    - Case erector | removes hand erecting
    - Case packer | removes hand packing
    - * Robot palletiser | removes repetitive lifting
  - Quality: right count and weight | checkweigher with reject before the palletiser
```

Working backwards also shows what is not in the deliverable. A new stretch wrapper, a warehouse system or faster lines might be good ideas, but none is needed for the outcome, and each would add scope, interfaces and risk. Keeping them out is a decision, recorded in the brief, not an oversight.

## Bespoke or modular, sketched

There are two broad ways to deliver twelve cells. In the **bespoke** option, each cell is engineered for its own line, its parts are ordered, and it is assembled and commissioned in place, with about three weeks of disrupted production. Each cell is a separate small project, and it benefits only a little from the ones before it, because each design is a little different and much of the work happens on the factory floor.

In the **modular** option, one standard cell is designed once, proved on a pilot, and then built repeatedly in an integrator's workshop. Each cell is tested before it ships and is installed on its skids over a long weekend, about three working days of disruption. Differences between lines are handled at the interfaces and by settings, not by redesign.

This is an illustration. The case's figures, developed and checked over the following chapters, compare as follows.

```figure
type: compare
title: Bespoke and modular delivery of twelve cells, first sketch
cols: Bespoke | Modular
caption: This is an illustration, excluding GST. Modular costs more before the first cell runs, then costs less per cell and finishes sooner; Chapter 9 compares the options in full.
- Cost per cell | A$860,000 | A$720,600 for the first, falling to A$635,819
- One-off design and emulation model | included in each cell | A$520,000, once
- * Programme cost | A$10.32m | about A$8.45m
- Production disruption per cell | 15 working days | 3 working days
- First cell's benefit starts | week 22 | week 35
- Last cell's benefit starts | week 92 | week 68
```

The modular option is not better on every line of the table. Its first cell starts earning 13 weeks later than the bespoke option's first pair, because the standard design, the emulation model and the pilot come first. By week 52, the bespoke programme has earned A$332,308 of benefit and the modular programme A$90,000. The modular programme catches up later, as cells come out of the workshop every two or three weeks while bespoke cells are still being installed in pairs. Chapter 9, [Comparing bespoke and modular](/reados/publications/modular-projects-by-the-numbers/comparing-bespoke-and-modular/), sets out the full comparison of cost, time and risk.

## Why repetition matters

Twelve copies of one design are cheaper and faster than twelve different designs for four reasons, and each is developed in a later chapter.

First, **design is done once**. In the case, a modular design of 3,000 engineering hours replaces 700 hours on each of twelve bespoke cells, 8,400 hours in all. Second, **people learn**. The integrator's assembly crew builds the same cell again and again, and the hours fall with each one, at a rate described by a learning curve. Third, **problems are found once**. A fault designed out of the standard is designed out of every later cell, and a fault found on the pilot never reaches a working line. Fourth, **exposure is short**. A cell that arrives tested and goes in over a long weekend spends three days disrupting a working site rather than fifteen, and the chance that something goes wrong while the line is opened up falls with the time, as Chapter 7, [Short exposure windows](/reados/publications/modular-projects-by-the-numbers/short-exposure-windows/), quantifies.

Repetition has conditions. The lines must be similar enough that one design fits all of them with only interface and setting changes. The standard must be good, because a poor standard is copied twelve times. And the standard must be kept: a programme that allows each site to modify its cell soon has twelve bespoke cells that were merely ordered together.

## One programme, not twelve projects

A **project** delivers a defined result once. A **programme** is a group of related projects managed together because the whole is worth more than the parts. Twelve cells delivered as twelve projects, each with its own engineer, budget and timetable, will drift apart: each project optimises its own cell, and the benefits of repetition are lost without anyone deciding to lose them.

Managed as a programme, some decisions are made once, centrally, and bind every cell: the module's design and boundary, the interface specification, the acceptance test, the build cadence, the change-control rules and the benefit measures. Other decisions belong to each installation: the site survey, the in-feed connection, the shutdown window, the local training. Writing down which decisions sit at which level is a small task with a large effect, because most variant creep starts as a local decision that should have been a programme decision.

```figure
type: compare
title: Which decisions sit at programme level and which at each installation
cols: Programme decides once | Each installation decides
caption: This is an illustration. Decisions in the left column bind all twelve cells; changing one goes through programme change control.
- Design | module design, parts list, software version | none: the cell is built to the standard
- Interfaces | interface specification and tolerances | site-side works to meet them
- Testing | acceptance test and pass criteria | test dates and witnesses
- Schedule | build cadence and installation sequence | shutdown window, permits and isolations
- * Benefits | benefit measures and review dates | local counts and records
```

The programme view also changes how the business looks at risk. A bespoke cell's risks are mostly local and are met afresh on each line. A modular programme concentrates risk early, in the standard design and the pilot, and reduces it for every cell that follows. That is a better shape of risk, provided the early stages are funded and given the time they need.

## The error: a palletiser per line

This is an illustration. The first brief for the programme was written at site A by an engineer who knew its lines well. It asked for "one robot palletiser per line, rated at 8 cases a minute". Two things in that sentence came from the deliverable, not the outcome.

The rating was taken from the production report, which showed each line averaging 96,000 packs over a 16-hour day. That is 100 packs a minute, or about 8.3 cases, averaged across all the time the line was stopped for changeovers, cleaning and faults. When the line runs, it runs at 120 packs a minute and 10 cases a minute. A palletiser at 8 cases a minute falls behind by 2 cases a minute, and an accumulation conveyor holding 24 cases would fill in 24 ÷ 2 = 12 minutes. After that, the end of line would hold the line to 8 × 12 = 96 packs a minute, 80% of its rate, for as long as it ran.

The scope was also narrower than the outcome. Site A's lines have old mechanical case erectors feeding the hand-packers, so the engineer assumed every line did. At sites B and C, the packers erect cases by hand from flat blanks. A palletiser alone would remove the stacking task and leave case erecting and packing manual on every line. Instead of three positions per line, it would have removed about one.

The error was found at the outcome review, when the steering group asked two questions of the brief: which positions disappear on each line, and what rate the end of line must accept when the line is running. Neither answer matched the outcome. The brief was rewritten from the five measures, and the deliverable became the full cell described above. The lesson is not that the engineer was careless. A deliverable-first brief carries the assumptions of whoever writes it, and the outcome measures are the only test that exposes them before money is spent.

```figure
type: checklist
title: Checks on a programme brief before it goes to design
caption: The two open questions are this chapter's error. Each would have been caught by testing the brief against the outcome measures.
- Outcome written in measurable terms | throughput, labour, handling, quality and value
- Duty taken from the running rate, not the daily average | 10 cases a minute, not 8
- Every task that must stop is listed for every site | erecting, packing, checking and palletising
- Items outside the outcome are named as out of scope | stretch wrapper, warehouse system
- x Copying one site's equipment list as the brief for all | sites B and C erect cases by hand
- ? Which positions disappear on each line, and when | answered line by line before design starts
```

## Exercise: a slower line

The business is considering a thirteenth line at site C. It would run a larger pack at 90 packs a minute in cases of 12, with the same pallet pattern of 10 cases per layer and 6 layers, and its end of line would need the same four positions as the others. Should this line receive a different cell, and how often would it complete a pallet?

**Worked answer.** The line would deliver 90 ÷ 12 = **7.5 cases a minute**, so a pallet of 60 cases would be completed every 60 ÷ 7.5 = **8 minutes**, 7.5 pallets an hour. The standard cell is designed for 10 cases a minute, so it can absorb this line's output with a margin of 2.5 cases a minute, which also helps it catch up after a short stop. The labour, handling and quality outcomes are the same as on every other line, because the same tasks would otherwise be done by hand. The outcome does not call for a different cell. It calls for the standard cell with its speed set to the line, which is a setting, not a design change. Building a slower bespoke cell for this line would save little hardware cost and would lose the design, testing and learning that the other twelve cells share.
