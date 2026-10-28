---
book: reference-class-forecasting-by-the-numbers
chapterSlug: measuring-overrun
order: 2
title: "Measuring overrun: baselines, real dollars and scope"
description: "Measure overrun as final cost over the budget approved at the decision to proceed, in 2026 dollars, scope changes included. P05 reads 2.60, not the 1.30 first reported."
draft: true
---

A reference class is only as good as the numbers in it, and the same project can produce very different overrun figures depending on how it is measured. Compare the final cost with the first rough estimate and the overrun looks enormous. Compare it with the budget as it stood after the last top-up and the project looks nearly on target. Mix 2011 dollars with 2025 dollars and ordinary inflation masquerades as overrun. Leave out the projects whose scope grew and the class quietly loses its worst outcomes.

This chapter sets out the measurement rules that the Bay 4 reference class follows: one ratio for cost and one for time, a single baseline at the decision to proceed, conversion to real 2026 dollars with a price index, and scope changes kept in. It works two of the business's records through those rules and ends with a ratio that was recorded as 1.30 when it should have been 2.60.

## Two ratios

The cost outcome of each past project is recorded as a **cost ratio** and its time outcome as a **schedule ratio**. Ratios rather than dollars or weeks let a A$75,000 marking station and a A$1.15 million factory extension sit in one class: what is compared is how far each project moved from what was approved, not how big it was.

```figure
type: formula
title: The two outcome measures
formula: cost ratio = final cost ÷ approved budget at the decision to proceed
formula: schedule ratio = actual duration ÷ planned duration at the decision to proceed
caption: This is an illustration. Both measures use the plan as approved, not a later revision. A ratio above 1.00 is an overrun; 1.24 means 24% over.
- final cost | All capital cost to complete the approved scope, in 2026 dollars excluding GST
- approved budget | The budget, including any contingency, at the decision to proceed, in 2026 dollars
- durations | Weeks from the decision to proceed to first production or handover
step: P15 factory extension: 1,426 ÷ 1,150 = 1.24 cost; 52 ÷ 40 = 1.30 schedule
step: P05 first ERP system: 468 ÷ 180 = 2.60 cost; 56 ÷ 26 = 2.15 schedule
```

Both parts of each ratio must cover the same things. If the approved budget for a machine included freight and rigging, so must its final cost; if the business's own staff time was excluded from the budget, it is excluded from the final cost too. The Bay 4 business records external spending only, excluding GST, on both sides. That understates the true cost of projects that consumed a lot of internal effort, such as the ERP system, but it does so consistently, and Bay 4's estimate is built the same way.

## Which budget is the baseline

A project usually has several budgets over its life, and each gives a different ratio.

- **The concept estimate** is the first number, often a rough figure in a strategy discussion. It was never approved, it may not exist on file for every project, and comparing outcomes with it measures how rough early numbers are, which is a different question.
- **The approved budget at the decision to proceed** is the number on which the owner committed money. It is the number a reference class needs, because the forecast it will correct is also a budget for a decision to proceed.
- **Re-approved budgets and later forecasts** absorb the overrun as it happens. Measured against the last forecast before completion, almost every project looks close to on budget, because the forecast was revised to match what was being spent.

Flyvbjerg and thirteen co-authors (2018), in *Five things you should know about cost overrun*, argue for measuring overrun against the budget at the decision to build, in real terms, and using all valid data. The reasoning is that the decision is the point at which the budget does its work: it is what the decision-maker weighs against the benefits. Measured from any later point, the overrun that would have changed the decision is hidden.

This is an illustration. The first ERP system, P05, had four candidate baselines, all in 2026 dollars.

```figure
type: compare
title: One project, four baselines
rowhead: Baseline
cols: Budget | Cost ratio | What the ratio measures
caption: This is an illustration. P05's final cost of A$468k against four budgets. Only the approved budget at the decision to proceed measures what the decision relied on.
- Concept estimate in a planning meeting | A$150k | 3.12 | How rough an early guess was
- *Approved budget at the decision to proceed | A$180k | 2.60 | How far the outcome moved from what was committed
- Re-approved budget after a mid-project top-up | A$360k | 1.30 | Only the overrun after the top-up
- Last forecast, a few weeks before completion | A$455k | 1.03 | Almost nothing
```

The same reasoning applies to time. The planned duration is the one approved with the budget, not a re-baselined programme. P05 was planned at 26 weeks and took 56, a schedule ratio of 56 ÷ 26 = **2.15**, however many times its programme was redrawn along the way.

## Real dollars, not nominal

The business's 24 projects span 2011 to 2025. A dollar in 2012 bought more than a dollar in 2025, so a raw comparison of the budget and final cost of a project that ran across several years counts general price rises as overrun. Absolute sizes, which Chapter 3 uses to judge similarity, are also distorted. Every amount in the class is therefore converted to **2026 dollars** with a price index.

The conversion multiplies a nominal amount by the ratio of the index in 2026 to the index in the year the money was committed or spent:

**amount in 2026 dollars = nominal amount × index(2026) ÷ index(year)**

The business uses one broad price index for all projects, taken from a published series such as the Australian Bureau of Statistics producer price indexes, and records which series it used. The values below are illustrative, not ABS figures.

```figure
type: compare
title: Illustrative price index used for conversion to 2026 dollars
rowhead: Year
cols: Index value | Factor to 2026 dollars
caption: This is an illustration. Index values are invented for teaching and are not ABS figures. The factor is 127.8 divided by the year's index.
- 2019 | 100.0 | 1.2780
- 2020 | 101.6 | 1.2579
- 2022 | 112.0 | 1.1411
- 2023 | 118.4 | 1.0794
- *2026 | 127.8 | 1.0000
```

### Worked conversion: the factory extension

This is an illustration. P15, a 400 m² factory extension, was approved in 2019 with a budget of **A$900,000** in 2019 dollars. It ran for 52 weeks across 2019 and 2020. The project file records **A$420,000** spent in 2019 and **A$707,000** spent in 2020, a nominal total of A$1,127,000.

- Approved budget: 900,000 × 1.2780 = **A$1,150,200**, recorded as A$1,150k.
- 2019 spending: 420,000 × 1.2780 = A$536,760.
- 2020 spending: 707,000 × 127.8 ÷ 101.6 = A$889,317.
- Final cost: 536,760 + 889,317 = **A$1,426,077**, recorded as A$1,426k.
- Cost ratio: 1,426,077 ÷ 1,150,200 = **1.24**.

The nominal ratio, 1,127,000 ÷ 900,000, is 1.252. About 1.2 percentage points of P15's apparent overrun was general inflation during 2020; the remaining 24% was the project. Each year's spending is converted at its own year's index. Converting the whole nominal final cost at the approval year's index gives 1,127,000 × 1.2780 = A$1,440,306 and the nominal ratio of 1.252 again, which is the error the conversion exists to remove.

### When the index matters

For a short project whose money is committed and spent in the same year, the index cancels: both sides of the ratio are multiplied by the same factor. The index earns its keep in three situations. First, long projects that span years of high inflation, where a nominal ratio overstates the overrun. Second, comparing sizes across years, so that a 2012 project and a 2025 project can be judged comparable. Third, applying the class to a new budget, which must be in the same dollars as the ratios.

The third point has a consequence for Bay 4. Its A$2.40 million budget is in 2026 dollars, and the reference class is in 2026 dollars, so any forecast from the class is also in 2026 dollars. If Bay 4's spending runs into 2027, price escalation over that period is a separate allowance, added on top. It is not overrun and it is not in the ratios.

A broad index removes general inflation, not the price movements specific to one project. P15's main causes were wet weather and a rise in steel prices. The part of the steel rise that exceeded general inflation stays in P15's ratio, correctly: the business chose when to build and what to build with, and a future building project faces the same kind of exposure.

## Scope changes stay in

It is tempting to remove scope changes before measuring overrun, on the argument that a project which grew was a different project. The business's records resist that. P05's scope grew as the ERP system was customised to match how the business worked; P18, a collaborative robot cell, had its guarding redesigned after the safety assessment; P21, a monitoring pilot, needed its network rebuilt. In each case the scope change was how the overrun happened. Removing it would remove the overrun, and the class would then describe projects that never existed.

The business chose the scope of each past project, and it will choose the scope of Bay 4. Scope growth that serves the purpose the project was approved for is part of the outcome and stays in the ratio. This is consistent with the 2018 paper's position that overrun should be measured against the budget at the decision to build, without adjustment for later changes.

There is one exception. A genuinely separate decision, approved separately with its own budget and its own purpose, is a separate project and gets its own record. If the business had decided, halfway through P15, to add a second, unrelated storage shed, that shed would be its own project. The test is whether the extra work would have been approved on its own merits at the original decision. Customisation that the ERP needed to work does not pass that test; it was always part of getting a working ERP.

## When a project is finished

The final cost needs a defined end point too. A machine project might be called finished at the first production shift, at the end of the defects period, or when the last invoice is paid, and the cost can differ between those points. The business uses the same end point as its plans do: the schedule ratio stops at the first production shift or handover, and the final cost includes everything spent to deliver the approved scope, including invoices that arrive afterwards, rectification of defects found in the first months and retention released at the end of the defects period.

Two practical rules follow. A project stays open in the record until its costs stop moving, typically three to six months after handover, and its ratio is marked provisional until then. And costs that belong to running the asset, such as tooling consumed in production, service contracts and licence renewals after the first year, are excluded, because they were not in the approved budget either. P21's network rebuild was a project cost; its later annual licence fees are not.

## The error: a ratio measured from the top-up

This is an illustration. When the class was first compiled, P05 was entered with a cost ratio of **1.30**. The person compiling it took the approved budget from the project's final cost report, which showed the budget as it stood at completion: **A$360,000** in 2026 dollars, after a top-up approved about five months into the project. With a final cost of A$468,000, 468 ÷ 360 = 1.30.

The original approval, in the minutes of the meeting that decided to proceed, was **A$180,000**. Measured against that, 468 ÷ 180 = **2.60**. The top-up halved the recorded overrun by moving the baseline halfway towards the outcome.

The error mattered beyond P05. With 1.30 in place of 2.60, the class's 80th percentile ratio, which Chapter 4 explains, fell from 1.408 to 1.338, and its 90th percentile from 1.632 to 1.499. Applied to Bay 4's A$2.40 million, the 80th-percentile budget would have been A$3.211 million instead of A$3.379 million, A$168,000 too low, and the 90th-percentile budget A$3.598 million instead of A$3.917 million, A$319,000 too low. One project's baseline moved the forecast for a different project by six figures.

```figure
type: bars
title: Effect of P05's baseline on Bay 4's budget at two confidence levels
unit: A$'000
max: 4000
caption: This is an illustration. Measuring P05 from its re-approved budget understated Bay 4's 80th-percentile budget by A$168k and its 90th-percentile budget by A$319k.
- 80th percentile, P05 at 1.30 | 3211
- *80th percentile, P05 at 2.60 | 3379
- 90th percentile, P05 at 1.30 | 3598
- *90th percentile, P05 at 2.60 | 3917
```

It was caught when the finance manager checked each record against its source. The rule applied was simple: every approved budget in the class must be traced to the minute or approval document of the decision to proceed, not to a cost report. P05 went wrong because it had a top-up, and that is the pattern to watch for: the projects that most needed extra money are the ones most at risk of having their baselines rewritten. The corrected record now holds both numbers, the original approval and the top-up, with dates, and the ratio uses the original.

## A measurement routine

The rules reduce to a short routine, applied the same way to every past project and, later, to Bay 4 itself.

```figure
type: steps
title: Measuring one past project
caption: The same routine, applied the same way, makes every ratio in the class comparable.
- Find the decision to proceed | the minute or approval document, with its date, budget and planned duration
- Confirm what the budget covered | external costs, contingency, GST treatment, and the same scope on both sides
- Total the final cost by year of spending | from invoices or the cost ledger, excluding GST
- Convert to 2026 dollars | each year's spending at its own index, the budget at the approval year's index
- * Compute both ratios | final cost over approved budget; actual weeks over planned weeks
- Record the main causes of variance | in a few words, without removing any cost
```

The business also keeps nominal figures and index values beside the converted ones. When the index series is revised, or the class is rolled forward to 2027 dollars, the conversion can be redone without going back to the invoices. [Learning from project risk](/reados/collections/project-planning-and-control/learning-from-project-risk/) describes the wider habit of gathering evidence on how contingency was used against what was estimated; this routine is its numerical core. Chapter 3, [Choosing the reference class](/reados/publications/reference-class-forecasting-by-the-numbers/choosing-the-reference-class/), decides which of the measured projects belong in the class for Bay 4.

## Exercise: converting the five-axis machine

This is an illustration. P20, a five-axis machining centre, was approved in 2022 with a budget of **A$780,000** in 2022 dollars and a planned duration of 26 weeks. A shipping delay pushed it into 2023. The file records **A$350,000** spent in 2022 and **A$520,000** spent in 2023, and the machine went into production after 32 weeks. Using the index table above, convert the budget and the final cost to 2026 dollars, and calculate the cost ratio, the nominal ratio and the schedule ratio.

**Worked answer.** The approved budget is 780,000 × 127.8 ÷ 112.0 = **A$890,036**, recorded as A$890k. The 2022 spending converts to 350,000 × 127.8 ÷ 112.0 = A$399,375 and the 2023 spending to 520,000 × 127.8 ÷ 118.4 = A$561,284, a final cost of **A$960,659**, recorded as A$961k. The cost ratio is 960,659 ÷ 890,036 = **1.08**. The nominal ratio is 870,000 ÷ 780,000 = 1.115, so the nominal figures would have reported an overrun of about 11.5% where the real overrun was about 7.9%: roughly 31% of the apparent overrun was general inflation in 2023. The schedule ratio is 32 ÷ 26 = **1.23**. The real ratio is the one that belongs in the class, because Bay 4's budget and every forecast drawn from the class are in 2026 dollars.
