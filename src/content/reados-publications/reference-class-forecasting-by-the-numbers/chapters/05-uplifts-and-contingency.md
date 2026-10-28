---
book: reference-class-forecasting-by-the-numbers
chapterSlug: uplifts-and-contingency
order: 5
title: "Uplifts and contingency: from a percentile to a budget"
description: "Turn a percentile into an uplift, a budget and a contingency: Bay 4 at P50 A$2.736m and P80 A$3.379m, who holds which money, and an uplift applied to the wrong base."
draft: true
---

A percentile is a statement about a distribution. A budget is a commitment of money, with someone accountable for it. Between the two sit three steps: convert the chosen percentile into an **uplift**, apply it to the right base, and decide who holds the difference between the estimate and the budget. Each step is simple, and each has a characteristic mistake.

This chapter takes Bay 4's reference class through those steps. It defines the uplift, computes Bay 4's budget and contingency at four confidence levels, discusses how to choose the level, and splits the result between a project contingency and an owner's reserve. It compares the result with a screening allowance, notes how Australian Government guidance uses P50 and P90, and ends with an uplift that was applied to the wrong base and then had the old contingency added back on top.

## From a ratio to an uplift

The uplift is the percentage added to a budget to reach a chosen percentile of the reference class. Flyvbjerg, Glenting and Rønnest (2004) set out the first published method for doing this for a class of projects: choose the acceptable chance of overrun, read the matching uplift from the reference class, and apply it to the budget. The Bay 4 calculation follows the same idea with the business's own records.

```figure
type: formula
title: From a percentile to a budget and a contingency
formula: uplift = percentile ratio − 1
formula: budget = approved budget × percentile ratio
formula: contingency = budget − base cost
caption: This is an illustration. The ratio is applied to the approved budget because the class ratios were measured against approved budgets that already included contingency.
- percentile ratio | The cost ratio at the chosen percentile, from Chapter 4
- approved budget | Bay 4's A$2.40m, the inside-view base plus its A$120k contingency
- base cost | Bay 4's A$2.28m, the sum of the four priced components
step: P80 uplift: 1.408 − 1 = 0.408, or 40.8%
step: P80 budget: 2,400 × 1.408 = A$3,379k
step: P80 contingency: 3,379 − 2,280 = A$1,099k
```

The base for the uplift follows from how the ratios were measured, not from preference. Chapter 2 defined each past project's ratio as its final cost divided by its approved budget at the decision to proceed, and those budgets included whatever contingency each project carried. The ratio therefore describes how far outcomes moved from a budget of the same kind as Bay 4's A$2.40 million. Had the business recorded ratios against base estimates before contingency, the uplift would apply to the A$2.28 million base instead, and the percentiles would be higher. The rule is to apply the ratio to the same kind of number it was measured against.

## Bay 4 at four confidence levels

This is an illustration. All money is in 2026 dollars, excluding GST.

```figure
type: compare
title: Bay 4's budget and contingency at four confidence levels
rowhead: Level
cols: Ratio | Uplift on A$2.40m | Budget | Contingency over the A$2.28m base | Contingency as share of base
caption: This is an illustration. Contingency is the budget minus the base cost, so it includes the original A$120k. Chance of overrun at each level: 50%, 30%, 20% and 10%.
- P50 | 1.140 | 14.0% | A$2,736k | A$456k | 20.0%
- P70 | 1.274 | 27.4% | A$3,058k | A$778k | 34.1%
- * P80 | 1.408 | 40.8% | A$3,379k | A$1,099k | 48.2%
- P90 | 1.632 | 63.2% | A$3,917k | A$1,637k | 71.8%
```

The numbers are large next to the original A$120,000, and they should be read carefully. The contingency at P80, A$1.099 million, is not a forecast that A$1.099 million of identified risks will occur. It is the amount that, on this business's record, has been needed to bring four in five projects home, with the specific causes unknown in advance. Most of it will not be needed in most outcomes; in one outcome in five, it will not be enough.

The uplift also grows faster than the confidence level. Moving from P50 to P70, 20 points of confidence, costs 13.4 points of uplift. Moving from P80 to P90, half as many points of confidence, costs 22.4 points. That is the right-hand skew of Chapter 4 seen from the budget side.

```figure
type: line
title: Uplift on Bay 4's approved budget by confidence level
x: Confidence level, P-value
y: Uplift on A$2.40m, %
ymin: 0
ymax: 70
caption: This is an illustration. Each step up in confidence costs more than the last, because the upper percentiles come from the projects that overran by half or more.
- 50 | 14.0
- 70 | 27.4
- 80 | 40.8
- 90 | 63.2
```

## Choosing the confidence level

No level is correct in general. The choice weighs the cost of overrunning a budget against the cost of setting aside money that may not be used.

- **What an overrun does to the business.** If running out of money would force the business to stop the project half built, refinance on poor terms or delay other commitments, a high level is warranted. If an overrun can be absorbed from cash flow over a few months, a lower level may do.
- **What the reserved money costs.** Money held back is money not used elsewhere. For a business with spare borrowing capacity, the cost is interest and a little flexibility; for one at its limit, it may be the next opportunity.
- **How many projects share the risk.** An organisation running many similar projects can budget each nearer P50, because overruns and underruns partly offset across the portfolio. A business making one large commitment every few years has no portfolio to average over.

Bay 4's approved budget is about twice that of P15, the business's largest past project, and it falls in the last category. The owner's working choice, subject to the component forecast in Chapter 8 and the tail actions in Chapter 9, is to fund Bay 4 to the whole-class P80 and to test affordability at P90.

Governments face the same choice and have written rules for it. HM Treasury's Green Book supplementary guidance applies explicit optimism-bias adjustments to estimates where better local data is missing. The Australian Government's Cost Estimation Guidance works with P50 and P90 outturn estimates, and requires a probabilistic method for projects seeking Commonwealth funding with an anticipated outturn cost above A$25 million. Bay 4 is far below that threshold and privately funded, so none of this applies to it. The logic transfers: a P50 to manage the project against and a P90 to make sure the money exists.

One discipline matters more than the level chosen: choose it before seeing the dollar figures, and record why. A level picked after the budgets are on the table tends to be the one whose number feels acceptable, which brings the inside view back by another door. The Bay 4 paper states the level, the reasons for it in two or three sentences and the count of past projects that exceeded it, so that the choice can be reviewed against the outcome later, as Chapter 10 does.

## Who holds which contingency

A single contingency of A$1.099 million handed to the project team would invite a familiar result: money allocated to a project tends to be spent by it. The business splits the money between two holders, following the distinction that [From estimate to commitment](/reados/collections/project-estimates-schedules-and-costs/from-estimate-to-commitment/) draws between contingency, which is fast and delegated, and reserve, which is held and released by the owner.

- **Project budget, to P50: A$2.736 million.** The project manager runs the job to this figure. It includes a project contingency of A$456,000: the original A$120,000 and A$336,000 more. The project manager may draw on it, within delegated limits, for events of the kinds the class contains, with a short written record of each draw.
- **Owner's reserve, P50 to P80: A$643,000.** Held by the owner, outside the project budget. Releasing it is a decision by the owner, on a written request that shows what happened, what has been spent and what the forecast to complete now is.
- **Affordability margin, P80 to P90: A$538,000.** Not approved and not set aside, but tested: could the business find a further A$538,000 if Bay 4 reached P90, and what would it give up to do so? Chapter 9 takes up that test.

```figure
type: stack
title: Bay 4's P80 funding of A$3,379k by holder
unit: A$'000
caption: This is an illustration. The project manager controls the first three segments, A$2,736k at P50; the owner holds the reserve to P80. The P90 margin of A$538k is tested for affordability but not funded.
- Base cost, four components | 2280 | priced from quotations and allowances
- Original contingency | 120 | the inside view's A$120k, kept and relabelled
- Added project contingency | 336 | from the original to P50
- Owner's reserve | 643 | from P50 to P80, released by the owner
```

The split also creates information. If the project has drawn its whole project contingency by the time the building is closed in, the owner knows early that Bay 4 is tracking above its median, while there are still decisions left to make. A single pooled contingency would hide that until it ran out.

## Rules for drawing it down

Contingency that can be spent without a record is soon indistinguishable from the base budget. The business applies three rules to Bay 4's project contingency.

- **Each draw names its cause.** A short entry records what happened, which component it affected, the amount and the date; a line such as "rock in footings, building, A$38k" is enough. Scope additions that were not part of the approved purpose are not contingency draws; they go to the owner as changes.
- **Draws are compared with progress.** At each monthly report, the share of project contingency used is set beside the share of the work complete. Using half the contingency by the time the building is closed in, when the riskiest integration work has not started, is a warning in itself.
- **The forecast to complete is redone at each draw.** A draw that is small in itself but reveals a pattern, such as a third supplier delay on imported equipment, changes the forecast for the rest of the job and should be reported as such.

The same rules make the outcome useful afterwards. When Bay 4 is complete, the record of draws shows which kinds of event consumed the contingency, and that is exactly what the next project's reference class record needs.

## What the uplift does not cover

The uplift corrects the cost estimate for the overruns the class contains, in the dollars the class is measured in. Several things sit outside it and must be budgeted separately if they apply.

- **Escalation.** The class and the forecast are in 2026 dollars, as Chapter 2 explained. Spending that falls in 2027 needs a separate escalation allowance at the expected rate of price rises.
- **Cost of delay.** The ratios measure the project's own spending, not the contribution lost while Bay 4 is late. Chapter 7 puts a number on that, and for Bay 4 it is of the same order as the cost overrun.
- **Financing and internal effort.** The business records external spending only, on both sides of the ratio, so interest and the time of its own staff are outside the uplift.
- **Line-item allocation.** The uplift is a project-level figure and should stay a separate line. Spreading it across the quotations would turn it into allowances that each package manager regards as theirs, and would hide that the machines, on their own record, need almost none of it while the software needs much more. Chapter 8 forecasts by component for that reason.

## A screening allowance compared

Where a business has no records, a screening method is a reasonable start. The [Contingency Allowance tool](/tools/contingency/) gives a screening contingency of between 9% and 25% of base cost from ratings of estimate uncertainty, complexity and risk, and describes itself as a screening heuristic rather than a quantified risk analysis.

This is an illustration. At its highest rating, 25% on Bay 4's A$2.28 million base gives A$2.850 million, a ratio of 1.1875 on the approved budget. Ten of the 24 past projects finished above that ratio, so on the business's own record, the highest screening allowance would leave about a 42% chance of overrun, between the class's P50 and P70. That is not a fault in the tool, which is built for when no record exists. It shows why a business that has records should use them: they describe its own estimating and its own projects, and here they say a great deal more contingency is needed than a generic allowance would give.

## The error: the wrong base, then the old contingency on top

This is an illustration. The first draft of the Bay 4 decision paper set the P80 budget as follows: base cost A$2.28 million, uplifted by 40.8% to **A$3.210 million**, plus "our normal contingency" of A$120,000, total **A$3.330 million**.

Two errors were in that line, and they partly cancelled. The uplift had been applied to the base, not to the approved budget the ratios were measured against, which understated the P80 budget by 120 × 1.408 = A$169,000. The old contingency had then been added on top, as though the class's overruns were in addition to a normal contingency rather than inclusive of it, which overstated it by A$120,000. The net result was A$49,000 below the correct A$3.379 million. Because the total looked close to the right number, nobody questioned the method.

The finance manager found it by recomputing from the definition: P80 budget equals approved budget times P80 ratio, 2,400 × 1.408 = A$3,379k. The first attempted fix moved the uplift onto the A$2.40 million but kept the A$120,000 line, giving A$3.499 million, now A$120,000 too high. The A$120,000 was already inside the A$2.40 million; it had been counted twice.

```figure
type: compare
title: Three versions of the P80 budget
rowhead: Version
cols: Calculation | Budget | Against correct
caption: This is an illustration. The first draft's two errors partly offset, which is why it looked plausible. Only the consistent definition gives A$3,379k.
- First draft | 2,280 × 1.408 + 120 | A$3,330k | A$49k low
- First fix | 2,400 × 1.408 + 120 | A$3,499k | A$120k high
- * Correct | 2,400 × 1.408 | A$3,379k | none
```

The lasting correction was a line in the class file stating what the ratios are measured against, approved budgets including contingency, and a rule that every budget in a decision paper is shown as one multiplication from the approved budget, with the base cost and the resulting contingency shown separately underneath. The original A$120,000 is not deleted; it becomes the first part of the project contingency, as the stack above shows. Chapter 9, [Cutting the tail before approval](/reados/publications/reference-class-forecasting-by-the-numbers/cutting-the-tail/), looks at whether the P80 can be brought down honestly, by changing the project rather than the arithmetic.

## Exercise: a P70 project budget with a P90 reserve

The owner considers an alternative: run the project to a P70 budget, and hold an owner's reserve from P70 to P90. Compute the project budget, the project contingency over the base, the owner's reserve and the total approved funding. How does the reserve compare with the P50 to P80 split above?

**Worked answer.** The P70 budget is 2,400 × 1.274 = 3,057.6, so **A$3,058k**, an uplift of 27.4%. The project contingency over the base is 3,058 − 2,280 = **A$778k**, which is the original A$120k plus A$658k. The P90 budget is 2,400 × 1.632 = 3,916.8, so **A$3,917k**, and the owner's reserve is 3,917 − 3,058 = **A$859k**. Total approved funding is A$3,917k, A$538k more than the P80 arrangement. The reserve is larger than the P50 to P80 reserve of A$643k, and it sits above a project budget that past projects exceeded seven times in 24. The arrangement gives more security but ties up more money, and it gives the project manager A$322k more to spend before the owner is involved, which weakens the early warning that the P50 split provides.
