---
book: front-end-planning-by-the-numbers
chapterSlug: the-harvest-deadline
order: 8
title: "A fixed deadline: the cost of delay as a cliff"
description: "A step cost of delay at 31 January 2028, A$630k plus A$41k a week, and a seeded simulation: a 44.2% chance of missing on the rush path against 5.3% on the planned path."
draft: true
---

Most projects lose a little for each week they are late: a week's lost production, a week's extra rent, a week's interest. Northbank's upgrade is different. If the new rooms and grader are ready on Monday 31 January 2028, the 2028 harvest goes through them. If they are ready a day later, the grader cannot be used that season at all, because the packing line runs from intake in February until stored fruit runs out in late October. The cost of delay is not a slope. It is a cliff, and the question that matters is not how late the project might be but how likely it is to be late at all.

This chapter writes the cost of delay as a function, shows why a constant weekly rate would understate it badly, and explains a simple schedule simulation in plain terms. It then gives the results for both paths, shows why the rush path's median completion date is a trap, and ends with a deadline that was set one week too late, which made the plan look nearly twice as safe as it was.

## The cost of delay function

This is an illustration. Let L be the number of weeks the upgrade is ready after the deadline of week 65, Monday 31 January 2028. Northbank's cost of delay, in A$k excluding GST, is

C(L) = 0 if L ≤ 0; C(L) = 630 + 41 × min(L, 12) if L > 0.

It has two parts.

The **step** of A$630k is incurred as soon as the project is late by any amount. It is the grader's benefit for the 2028 season, A$560k, which is lost because the line cannot be stopped to install and commission the grader once packing has begun, plus A$70k to remobilise the installers and commissioning engineers after the season ends.

The **weekly rate** of A$41k applies for each week the new rooms are late during the 12-week intake. Without them, 4,000 bins a week stay in hired cold storage at A$4.20 a bin, A$16.8k, and about 1,100 bins a week are handled twice, at A$22 a bin, A$24.2k. After 12 weeks the intake is over and the rate stops, so the cost of delay reaches its maximum of **A$1,122k** at L = 12.

The case treats rooms and grader as ready on one date, because they share the new power supply and the same commissioning period. A project whose parts could be finished and used separately would need a function for each part.

```figure
type: bars
title: Cost of delay by weeks late
unit: A$'000
max: 1200
caption: This is an illustration. Being ready on time costs nothing; being half a week late costs A$650.5k. After the step, each week adds A$41k until intake ends at 12 weeks.
- On time (L = 0) | 0
- * Half a week late | 650.5
- 1 week late | 671
- 2 weeks late | 712
- 4 weeks late | 794
- 8 weeks late | 958
- 12 weeks or more | 1122
```

## Why a constant rate misleads here

The usual way to price delay is a rate per day or per week, multiplied by the expected days late. [What is a day worth? Pricing delay before deciding whether to speed up](/reados/collections/valuing-time-delay-and-uncertainty/what-is-a-day-of-delay-worth/) sets out that linear case and how to build the rate. It works well when each week of delay costs roughly the same as the last, as it does for a factory extension whose output starts whenever it is finished. Reinertsen (2009) argues for putting a number on the cost of delay rather than leaving it implicit, because so many decisions trade time against money. The number need not be a constant rate, and for a seasonal asset it is not.

The difference is large. If Northbank priced lateness at its weekly rate alone, A$41k a week with no step, the same simulation used below would give an expected cost of delay of about A$122k on the rush path and A$3k on the front-end path. With the step included the figures are **A$400k** and **A$36k**. The constant rate would understate the rush path's cost of delay by more than two thirds and the front-end path's by more than nine tenths, and it would make the two paths look far closer than they are.

The step also changes which number to watch. Under a constant rate, the expected number of weeks late is what matters. Under a step, the **probability of being late at all** dominates, because the first hour of lateness costs as much as the next ten weeks of it. A plan that is usually a few days late is a very bad plan here, even though it is "nearly on time".

## A schedule simulation in plain terms

The probability of missing the deadline needs a view of how long delivery might take. Northbank uses the simplest model that captures the main features of real project durations.

Each path has a planned duration: 52 weeks for the rush path and 36 for the front-end path. The actual duration is the planned duration multiplied by a **ratio**. A ratio of 1.00 means delivery took exactly as long as planned; 1.20 means 20% longer. The ratio is uncertain, so the model draws it at random many times. Two numbers describe each path's ratio:

- the **median**, the ratio that is exceeded half the time: 1.18 for the rush path, 1.05 for the front-end path;
- the **spread**, σ, which sets how widely the ratio varies around the median: 0.16 for the rush path, 0.08 for the front-end path.

The model draws the logarithm of the ratio from a normal distribution, which keeps every ratio positive and allows long overruns to happen more often than equally long underruns, as they do in practice. These medians and spreads are **assumptions for the illustration, not data**. The rush path's are higher because it starts delivery with the scope, supply, ground conditions and approvals still unknown; the front-end path's are lower because those are known. A business with records of its own projects would take the ratios from them, which is the subject of *Reference Class Forecasting by the Numbers*.

```figure
type: steps
title: How the schedule simulation works
caption: This is an illustration. The random number generator is seeded (mulberry32, seed 20261028), so anyone running the model gets the same 20,000 results.
- Draw a ratio | the logarithm of the ratio from a normal distribution with the path's median and spread
- Compute the ready week | start week + planned weeks × ratio: week 2 + 52 × ratio, or week 22 + 36 × ratio
- Compare with the deadline | weeks late L = ready week − 65
- Price the outcome | cost of delay C(L), and A$14k for each week beyond the planned duration
- Repeat 20,000 times | the share of runs with L above zero is the chance of missing; the averages are the expected costs
```

A run misses the deadline when its ratio exceeds the room the plan has left. The rush path has 63 weeks from its start to the deadline, so it misses when the ratio exceeds 63 ÷ 52 = **1.2115**. The front-end path has 43 weeks, so it misses when the ratio exceeds 43 ÷ 36 = **1.1944**. Because the model is simple, the chance of exceeding each threshold can also be computed directly from the normal distribution, which is a useful check on the simulation: 43.5% for the rush path and 5.4% for the front-end path, against simulated values of 44.2% and 5.3%.

## Results for both paths

This is an illustration. The two paths have similar thresholds, about 1.2 in both cases, but very different distributions of the ratio. The rush path's median ratio of 1.18 sits just below its threshold, so nearly half its runs fall on the wrong side. The front-end path's median of 1.05 sits well below its threshold, and its narrower spread means few runs reach it.

```figure
type: compare
title: Simulated delivery for the two paths
cols: Rush path | Front-end path
rowhead: Result
caption: This is an illustration from 20,000 seeded runs. Ready weeks count from week 0, Monday 2 November 2026; the deadline is week 65.
- P10 ready week | 52.0 | 56.1
- Median ready week | 63.5 | 59.9
- P80 ready week | 72.3 | 62.5
- P90 ready week | 77.3 | 63.9
- * Chance of missing the deadline | 44.2% | 5.3%
- Mean weeks late, when late | 8.2 | 1.5
- Expected cost of delay | A$400k | A$36k
- Expected time-related cost | A$152k | A$34k
```

The rush path's P80 ready week is 72.3, more than seven weeks into the harvest. Its P90 is 77.3. The front-end path's P90 is week 63.9, still more than a week inside the deadline. When the front-end path is late, it is late by 1.5 weeks on average; when the rush path is late, by 8.2 weeks.

```figure
type: range
title: Ready week from P10 to P90, with the deadline
min: 50
max: 80
ticks: 50 | 65 | 80
caption: This is an illustration. Each band runs from the P10 to the P90 ready week in the simulation. Only the rush path's band crosses the deadline by a wide margin.
- Rush path | 52.0 | 77.3 | median week 63.5
- Front-end path | 56.1 | 63.9 | median week 59.9
- * Deadline, 31 January 2028 | 65 | 65 | week 65
```

### What the model leaves out

The model treats delivery as one block of work with one uncertain ratio. Real delivery is a network of paths, and the latest of several paths sets the ready date, which tends to make real overruns somewhat worse than a single ratio suggests. It also ignores the line-change window inside the schedule: if the grader arrived in late January rather than early November, its installation and trials might not fit before the deadline even if everything else did. And it treats the rush path's late discoveries, such as the supply upgrade that would add about 14 weeks if found on site, as part of its wider spread rather than as separate events. None of these would make the rush path look better. For a decision between two paths whose risks differ by a factor of eight, the simple model is enough; for setting a contingency on a single path, Chapter 9's critical path and a component model would be the next step.

These results complete the expected totals previewed in Chapter 1. The rush path's expected A$7,451k includes A$400k of expected cost of delay and A$152k of time-related cost; the front-end path's A$6,562k includes A$36k and A$34k. Of the A$889k expected saving, A$482k comes from these two lines alone, which is why Chapter 6 found that the deadline, not the fees, set the limit on how long the front end could run.

## The trap of the median

A planner who uses the median ratio alone gets a single date for each path. The rush path's is week 2 + 52 × 1.18 = week 63.4, which is **1.6 weeks before the deadline**. The front-end path's is week 22 + 36 × 1.05 = week 59.8, 5.2 weeks before. On that view both plans meet the deadline, and the rush path even looks comfortable: it starts 20 weeks earlier and has a median finish only 3.6 weeks later.

The median hides the spread, and with a step cost the spread is everything. A median finish 1.6 weeks early with a wide spread means a chance of missing close to one in two. The same thing holds whenever the cost of an outcome changes sharply at a threshold: the expected cost depends on how much of the distribution lies beyond the threshold, not on where its middle lies. The only honest way to compare the paths is to report the chance of missing and the expected cost of delay alongside the median, as the comparison figure does.

The ratios themselves deserve the same scrutiny. [Schedule, benefits and the cost of delay](/reados/publications/reference-class-forecasting-by-the-numbers/schedule-and-benefit-forecasts/) in *Reference Class Forecasting by the Numbers* takes schedule ratios from a reference class of similar past projects and prices the P50 and P80 delays; Northbank's assumed medians and spreads should be replaced by such a record as soon as the business has one. The cost of delay is also only as good as the benefit forecast behind it: the A$630k step rests on the grader's A$560k a year, and an optimistic grader benefit would overstate the cliff. [Scenarios, sensitivity and switching values](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/scenarios-and-switching-values/) in *Demand and Benefit Forecasts by the Numbers* shows how to test how far a benefit forecast can fall before a decision changes.

## The error: the deadline set one week late

This is an illustration. The first schedule check, run early in FEL 3, well before the week 19 gate review, used **first fruit intake, week 66** (Monday 7 February 2028), as the deadline. It was an easy date to choose: it was in the harvest plan, everyone knew it, and it was the day benefits began.

When the check was circulated, the packhouse manager pointed out that the rooms are not ready when the refrigeration is switched on. Empty rooms need about a week to pull down to holding temperature before fruit can go in, and the grader needs a trial week on fruit from the store before the harvest arrives. The date by which the project must be complete is therefore **week 65**, Monday 31 January 2028, one week earlier.

With the wrong date, the front-end path missed only when its ratio exceeded 44 ÷ 36 = 1.2222, and the simulation gave a **2.8%** chance of missing and an expected cost of delay of **A$20k**. With the correct date the figures are **5.3%** and **A$36k**. One week on the deadline nearly halved the apparent risk. On the rush path the same mistake would have lowered the chance of missing from 44.2% to 40.3% and the expected cost of delay from A$400k to A$362k: a smaller relative change, because so much of its distribution lies well past either date. The wrong date flattered the better-defined plan most, which is exactly where a reader would have relied on it.

The error was found because someone who would run the new rooms read the schedule. The correction was to define the deadline formally, in element C2 of the definition index, as **the date the asset must be ready for use**, worked back from first use through commissioning, pull-down and trials, with the packhouse manager signing off the working-back. Every later schedule check uses that date, including the schedule redrawn for Gate 3 after the independent review of Chapter 3.

## Exercise: a less certain delivery

Suppose the front-end path's delivery were less predictable than assumed: the median ratio stays at 1.05 but the spread rises from 0.08 to 0.12. Using the same seeded simulation, what are the chance of missing the 31 January 2028 deadline and the expected cost of delay? Check the probability directly.

**Worked answer.** The threshold is unchanged at 43 ÷ 36 = 1.1944. The simulation gives a **14.2%** chance of missing and an expected cost of delay of **A$105k**, against 5.3% and A$36k with σ = 0.08. The direct check is ln(1.1944 ÷ 1.05) ÷ 0.12 = 0.1289 ÷ 0.12 = 1.074 standard deviations, and the chance of exceeding it is **14.1%**, which agrees with the simulation. The median ready week is still 59.9, but the P90 moves to week 66.1, past the deadline. Widening the spread by half nearly triples the chance of missing, even though nothing about the plan's median has changed. Keeping the spread narrow, by defining the work before committing to it, is worth as much against a cliff as moving the median.
