---
book: first-of-a-kind-technology-by-the-numbers
chapterSlug: contingency-that-grows-with-novelty
order: 8
title: "Contingency and schedule allowances that grow with novelty"
description: "Cost and schedule allowances graded by readiness: element P50s and P80s, a 10,000-run simulation giving B a P80 of A$22.9m, and the errors of a flat 10% and of adding P80s."
draft: false
---

The earlier chapters measured the novel process's novelty element by element: three critical elements at TRL 6, 5 and 7, 40% of the capital cost in plant that has never run at full scale, a pilot that ran a tenth of the size, and a start-up expected to take nearly two years. This chapter turns those findings into the two allowances a board funds: money above the estimate, and months beyond the plan.

It argues that the allowance must grow with novelty, element by element, sets out the book's teaching table of growth factors by readiness, applies it to both options, combines the elements by simulation, and shows the two mistakes the recycler made on the way: a flat 10% that was far too small, and a correction that overshot by adding percentiles that do not add.

## Why one percentage cannot fit both plants

A contingency allowance is money held for cost growth that the estimate cannot yet place: quantities that grow as design proceeds, rework, commissioning fixes and the parts of the scope nobody thought of. How much growth to expect depends on what is being built. The RAND pioneer-plant study by Merrow, Phillips and Myers (1981), covered in Chapter 3, found that most of the variation in cost-estimation error among its 44 process plants was explained by how far a plant's technology departed from that of earlier plants, how well the project and site were defined, and how complex the plant was. Option A departs from nothing; Option B departs in 40% of its capital cost.

The same direction appears in a different field. The US Government Accountability Office's 2006 assessment of major weapon programmes (GAO-06-391) found that programmes which began development with mature technologies averaged **4.8 per cent** research and development cost growth, against **34.9 per cent** for those that began with immature technologies. Those are US defence programmes, quoted for the direction and rough size of the effect, not as a rate for a recycling plant. The lesson for the recycler is only that a single percentage applied to both options would be wrong for at least one of them.

Where a reference class of similar completed projects exists, the outside view gives the allowance directly, as [Uplifts and contingency: from a percentile to a budget](/reados/publications/reference-class-forecasting-by-the-numbers/uplifts-and-contingency/) in *Reference Class Forecasting by the Numbers* shows. Option A has something close to one, in Supplier A's 41 lines. Option B has none, because no plant like it has been built. The allowance then has to be built from the parts, graded by how much is known about each.

## The book's teaching table

The table below is **the book's own, illustrative**. It is not a published set of values, and no study is claimed to support these exact numbers. It is a teaching device that captures the direction of the evidence: elements that are proven in the same duty grow a little and predictably; elements that have only been shown in a laboratory or a pilot grow more, and with a much wider spread. Each factor multiplies the element's estimate: a P50 factor of 1.35 means the element is as likely as not to finish above 135% of its estimate, and a P80 factor of 1.75 means a 20% chance of finishing above 175%.

```figure
type: compare
title: Cost-growth factors by readiness, the book's teaching values
cols: P50 factor | P80 factor | P80 ÷ P50
rowhead: Readiness of the element
caption: Illustrative values chosen for this book, not published rates. The integration element is graded 1.05 and 1.12 for A, and 1.10 and 1.25 for B, because interfaces change around novel plant.
- TRL 9, proven in operation | 1.05 | 1.12 | 1.07
- TRL 8, complete system qualified | 1.10 | 1.25 | 1.14
- TRL 7, prototype in the operational environment | 1.20 | 1.45 | 1.21
- TRL 6, prototype in a relevant environment | 1.35 | 1.75 | 1.30
- * TRL 5, component in a relevant environment | 1.50 | 2.10 | 1.40
```

Two features matter more than any single number. The median rises with immaturity, so the expected cost grows; and the gap between P50 and P80 widens, so the uncertainty grows faster still. A business that has its own records of completed projects should calibrate its own table from them, by estimate class and by novelty; [Estimate classes: reading a number by how much is defined](/reados/publications/front-end-planning-by-the-numbers/estimate-classes-and-ranges/) in *Front-End Planning by the Numbers* covers the definition side of the same question.

## Applying the table element by element

This is an illustration. All amounts are A$ excluding GST.

**Option A.** Every element is at TRL 9, including integration at 1.05 and 1.12, so the A$16,000,000 estimate becomes a sum of element P50s of **A$16,800,000** and a sum of element P80s of **A$17,920,000**.

**Option B.** The four proven elements are graded at TRL 9, integration at 1.10 and 1.25, and the three novel elements at their own levels. The A$17,500,000 estimate becomes a sum of element P50s of **A$20,515,000**, 1.172 times the estimate, and a sum of element P80s of **A$24,271,000**, 1.387 times. The novel elements, A$7,000,000 of estimate, have a P50 of A$9,330,000 and a P80 of **A$12,095,000**; the proven and integration elements, A$10,500,000 of estimate, have a P50 of A$11,185,000 and a P80 of A$12,176,000.

```figure
type: bars
title: Option B: allowance from estimate to element P80, by element
unit: A$'000
max: 2100
caption: This is an illustration. The three novel elements, highlighted, are 40% of the estimate but carry A$5,095,000 of the A$6,771,000 between estimate and summed P80s, 75.2% of it.
- * Hydrocyclone wash and separation, TRL 6 | 2100 | 2,800 to 4,900
- * Closed-loop water treatment, TRL 5 | 1870 | 1,700 to 3,570
- * Hyperspectral fines sorter, TRL 7 | 1125 | 2,500 to 3,625
- Electrical, controls, building, installation | 800 | 3,200 to 4,000
- Bale breaking, shredding, granulating | 432 | 3,600 to 4,032
- Pre-wash and friction washing | 228 | 1,900 to 2,128
- Drying, silos and bagging | 216 | 1,800 to 2,016
```

The table also explains why the sorter's rescoring in Chapter 4 mattered. Scored at TRL 9 on its maker's food-processing record, the sorter's P50 would have been A$375,000 lower and its P80 A$825,000 lower than at the TRL 7 its duty supports.

## Schedule allowances

Novelty stretches time as well as cost. Novel elements need more design iterations, longer factory testing and, above all, longer commissioning before the first saleable flake. The case grades the schedule from decision to first saleable flake in the same way. Option A's planned 16 months takes factors of 1.05 at P50 and 1.12 at P80: **16.8 and 17.9 months**. Option B's planned 17 months takes 1.25 and 1.50: **21.3 and 25.5 months**. A month of delay costs more than a month of overhead, because it postpones every later month of contribution. In the case's net-present-value model, moving A's first saleable flake from month 16 to its P50 of 16.8 costs A$352,824; moving B's from month 17 to 21.25 costs A$2,618,875, before any effect on ramp-up. Chapter 10 sets these steps out in full. The [Schedule Risk Check tool](/tools/schedule-risk/) reproduces this kind of allowance for a simple programme.

## From elements to a total: simulation

Element percentiles cannot simply be added. The P80 of a total is the value it stays below in 80% of outcomes, and it is reached when some elements run high and others low, not when all of them sit at their own 80th percentile together. Combining them needs a simulation, described in detail in [Forecasting by component: simulation and correlation](/reados/publications/reference-class-forecasting-by-the-numbers/forecasting-by-component/) in *Reference Class Forecasting by the Numbers*.

The recycler's simulation ran **10,000 trials** for each option. In each trial, every element's growth factor was drawn from a lognormal distribution fitted to its P50 and P80: the median is the P50 factor, and the spread is ln(P80 ÷ P50) ÷ 0.8416, since the 80th percentile of a standard normal distribution lies 0.8416 standard deviations above its median. Elements were drawn independently. The schedule factor was drawn the same way, and for Option B the ramp-up time constant of Chapter 7 was drawn with a median of 7 months and a P80 of 10.

The fitted spreads show how differently the elements behave. A TRL 9 element has a spread of ln(1.12 ÷ 1.05) ÷ 0.8416 = 0.077, so its cost rarely strays far from 5% above estimate. The TRL 5 water loop has a spread of ln(2.10 ÷ 1.50) ÷ 0.8416 = 0.400: its mean factor is 1.625, above its median of 1.50, and its P90 factor is about 2.50, two and a half times its estimate. One immature element can therefore move the total more than all the proven elements together.

Option B also carried one discrete risk that a smooth distribution does not capture: the **water-loop failure scenario**. With a probability of **15%**, the closed loop fails to hold its quality at full scale and the plant has to add conventional effluent treatment, at **A$1.2 million** more capital, **4 months** more schedule and **A$15 a tonne** more variable cost. Its expected capital cost alone is 0.15 × A$1,200,000 = A$180,000, but its real weight is in the tail.

The results:

- **Option A:** capital cost P50 **A$16,837,555**, P80 **A$17,330,037**. Contingency to P80 is **A$1,330,037**, 8.3% of the estimate. First saleable flake at month 16.8 at P50 and 17.9 at P80.
- **Option B:** capital cost P50 **A$21,096,294**, P80 **A$22,899,181**. Contingency to P80 is **A$5,399,181**, 30.9% of the estimate. First saleable flake at month **21.9** at P50 and **26.5** at P80.

```figure
type: range
title: Capital cost, from estimate to simulated P80, with the two rejected allowances
min: 15
max: 25
unit: A$m
ticks: 15 | 17.5 | 20 | 22.5 | 25
caption: This is an illustration, rounded to A$0.01m. B's simulated P50 to P80 runs from A$21.10m to A$22.90m. A flat 10% put B at A$19.25m, below the whole band; summed element P80s put it at A$24.27m, above it.
- Option A, estimate to simulated P80 | 16.00 | 17.33
- Option A, simulated P50 to P80 | 16.84 | 17.33
- Option B, estimate to simulated P80 | 17.50 | 22.90
- * Option B, simulated P50 to P80 | 21.10 | 22.90
- Option B with a flat 10% | 19.25 | 19.25 | first error
- Option B, sum of element P80s | 24.27 | 24.27 | second error
```

B's simulated P50 is A$581,294 above its sum of element P50s, for two reasons: lognormal factors are skewed upwards, so a high draw adds more than a low draw takes away, and the failure scenario adds A$1.2 million in 15% of trials. The independence assumption works the other way. If one cause, such as fines behaving differently at full scale, pushed the hydrocyclones, the loop and the sorter up together, the true P80 would sit between the simulated A$22,899,181 and the summed A$24,271,000. The recycler kept independence for the base case and noted the correlation as a reason not to cut the allowance further.

## The errors: a flat 10%, then adding P80s

The first draft of the board paper applied the recycler's usual **10% contingency** to both options. For A that gave A$17,600,000, close to its simulated P80. For B it gave **A$19,250,000**: A$1,265,000 below even the sum of element P50s of A$20,515,000, and A$3,649,181 short of the simulated P80. Funding B at that level would have meant approving a budget that it would more likely than not overrun.

The independent reviewer found this by setting the allowance against the simulated distribution. The finance manager corrected it the quick way, by funding B at the **sum of element P80s, A$24,271,000**. That overshot. Adding P80s assumes that every element finishes at its own 80th percentile at once, and the simulation put the sum above even its P90 of A$23,929,111, so the chance of needing it was under 10%. The sum was **A$1,371,819** above the simulated P80 of the total, a 6.0% overstatement, money that would have been locked up and, being available, would probably have been spent.

Both errors were found the same way: the reviewer compared the proposed allowance with the simulated distribution of the total. The board paper now funds each option to its simulated P80, A$17,330,037 for A and A$22,899,181 for B, holds the contingency centrally rather than spreading it across the element budgets, and records the water-loop scenario as a named risk with its own trigger. The [Contingency Allowance tool](/tools/contingency/) performs the same comparison of an estimate against its percentiles.

## Holding and releasing the allowance

An allowance graded by element can also be managed by element. The recycler's paper set three rules. The contingency is held by the managing director, not by the project team or the supplier, and is drawn only through change control with the cause recorded against an element. Each novel element has a named event that retires part of its risk: the hydrocyclones' factory test at full flow, the loop's first 500 hours at steady concentration, the sorter's acceptance on the recycler's own fines. And when such an event passes, the element is regraded and the release is recorded, so that the board sees the allowance shrink for a reason rather than simply being spent.

```figure
type: stats
title: The two options' allowances at a glance
caption: This is an illustration. Simulated capital cost and start month, 10,000 trials each, element factors from the book's teaching table, with B's 15% water-loop failure scenario included.
- A$1,330,037 | Option A contingency to P80 | 8.3% of the A$16.0m estimate
- * A$5,399,181 | Option B contingency to P80 | 30.9% of the A$17.5m estimate
- 16.8 and 17.9 | Option A start month, P50 and P80 | planned month 16
- * 21.9 and 26.5 | Option B start month, P50 and P80 | planned month 17
```

## What the allowances say about the choice

On estimates, B costs A$1,500,000 more than A. At P80, it costs A$5,569,144 more, and its contingency is about four times A's. It also starts producing about five months later at the median and nearly nine months later at P80. None of this makes B the wrong choice by itself; a large enough yield advantage could pay for it. Chapter 9 asks whether any way of buying the risk down makes B worth that price, and puts each option's whole distribution into one net-present-value comparison.

## Exercise: the water loop after its retest

After the Chapter 5 retest at the full-scale bleed ratio, the reviewer agrees that the closed-loop water treatment has been shown as a representative system under realistic conditions and can be rated **TRL 6** instead of TRL 5. Using the teaching table, how much do the water loop's P50 and P80 fall, and what are B's new sums of element P50s and P80s?

**Worked answer.** The loop's estimate is A$1,700,000. At TRL 5 its P80 is 1,700,000 × 2.10 = A$3,570,000; at TRL 6 it is 1,700,000 × 1.75 = **A$2,975,000**, a fall of **A$595,000**. Its P50 falls from 1,700,000 × 1.50 = A$2,550,000 to 1,700,000 × 1.35 = A$2,295,000, a fall of **A$255,000**. B's sum of element P50s becomes A$20,260,000 and its sum of element P80s A$23,676,000. Rerunning the simulation with the loop at TRL 6, and the failure scenario unchanged, lowers B's simulated P80 from A$22,899,181 to A$22,363,281, a fall of A$535,900: less than the element's own A$595,000, because the total's P80 does not move one for one with any single element's. System readiness is now TRL 6, set by the hydrocyclone stage, which is where the next test effort would buy most.
