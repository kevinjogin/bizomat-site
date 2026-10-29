---
book: first-of-a-kind-technology-by-the-numbers
chapterSlug: ramp-up-to-nameplate
order: 7
title: "Ramp-up: from first flake to nameplate output"
description: "Exponential ramp-up curves for a proven and a novel line (2.8 against 21.9 months to 90%), Duane reliability growth, and a linear ramp that overstated contribution by A$3.46 million."
draft: false
---

A plant that passes its qualification run does not produce its nameplate output in its first month. It starts below design rate, stops more often than it will later, and climbs as operators, maintainers and engineers find and fix what the drawings did not show. For a proven line that climb takes weeks, because most of the lessons have already been learnt on earlier plants. For a first-of-a-kind plant it can take years, and it is often where the largest part of the difference between paper and outcome is lost.

This chapter models ramp-up as a curve with three numbers, fits one curve to each option, and measures what the difference costs. It then models reliability growth, the climb in time between stoppages, with the method that Duane published in 1964. The yield throughout is the 78.9% established in [Chapter 6](/reados/publications/first-of-a-kind-technology-by-the-numbers/qualification-testing/), and the error case is a straight-line ramp borrowed from the wrong kind of plant.

## Why pioneer plants start up slowly

The RAND study of pioneer process plants by Merrow, Phillips and Myers (1981), introduced in Chapter 3, found that most of the variation in plant performance after start-up was explained by two things: how much new technology the plant contained, and whether it processed solids. A later RAND report on solids processing (Merrow, 1986) found that the key performance problems of solids-handling plants came from physical and mechanical difficulties, not from the process chemistry, and that newer plants showed no tendency to perform better. Option B is new technology handling wet solids, and all three of its novel elements, the hydrocyclone stage, the closed water loop and the fines sorter, deal with the hardest part of the stream: wet plastic fines.

Research on manufacturing ramp-up explains why the climb is slow even when everything eventually works. Terwiesch and Bohn (2001) describe ramp-up as a period of learning by experiment, in which every trial run to find a cause competes with production for the same equipment, and in which learning early is worth more than learning late because the plant then produces at the higher rate for longer. Bohn and Terwiesch (1999) add that yield matters most when capacity is constrained, as it is during ramp-up, when every tonne lost to a stoppage or a rejected bag cannot be made up later. Argote and Epple's (1990) review of learning curves in manufacturing is a reminder that organisations learn at very different rates, so a supplier's ramp-up on its 41st plant says little about an owner's on its first.

## A ramp-up curve with three numbers

**Attainment** in a month is the plant's average feed rate that month as a share of the 3.0 t/h design rate. A simple and widely used shape for its climb is an exponential approach to a plateau:

**attainment(t) = plateau − (plateau − first-month level) × e^(−t ÷ τ)**

where t is months after start-up, with t = 0 the first month, and τ, the **time constant**, is the number of months in which the remaining gap closes by about 63%. The months needed to reach a target level follow directly: **t = τ × ln((plateau − first-month level) ÷ (plateau − target))**.

Three numbers therefore describe the whole start-up, and each can be argued about separately. The first-month level says how well commissioning went. The plateau says whether the plant will ever reach design rate; a first-of-a-kind plant often settles below it because a bottleneck the pilot did not reveal limits throughput. The time constant says how fast the team learns.

This is an illustration. For **Option A**, the proven line, the curve is attainment(t) = 1.00 − 0.40e^(−t/2): 60% in the first month, a plateau at design rate and a time constant of 2 months. It reaches 90% after 2 × ln(0.40 ÷ 0.10) = **2.77 months**. That matches Supplier A's references: of the 8 reference plants contacted in Chapter 4, 7 reached 90% of design throughput within 4 months.

For **Option B**, the expected first-of-a-kind curve is attainment(t) = 0.93 − 0.68e^(−t/7): 25% in the first month, a plateau of 93% and a time constant of 7 months. It reaches 80% after 11.6 months and 90% after 7 × ln(0.68 ÷ 0.03) = **21.85 months**. There is no reference class for these numbers, because no full-scale plant of this kind exists. They are the book's own teaching values, set by judgement from the pioneer-plant findings: a slow first month while the loop, cyclones and sorter are tuned together, a time constant long enough for several rounds of finding and fixing faults, and a plateau below design rate because the fines-handling steps are expected to limit throughput.

```figure
type: line
title: Expected attainment after start-up, proven line against novel process
x: Months after start-up
y: Attainment, % of design feed rate
legend: Option A, proven | Option B, novel
ymin: 0
ymax: 100
mark: 21.85 | B reaches 90%
caption: This is an illustration. A follows 1.00 − 0.40e^(−t/2) and passes 90% at 2.77 months; B follows 0.93 − 0.68e^(−t/7), passes 90% at 21.85 months and levels off at 93%.
- 0 | 60.0 | 25.0
- 1 | 75.7 | 34.1
- 2 | 85.3 | 41.9
- 3 | 91.1 | 48.7
- 6 | 98.0 | 64.1
- 9 | 99.6 | 74.2
- 12 | 99.9 | 80.8
- 18 | 100.0 | 87.8
- 24 | 100.0 | 90.8
- 36 | 100.0 | 92.6
```

## What the slow start costs

Over the first 12 months, A averages **91.5%** of design rate and B **58.1%**. Over the first 24 months, A averages **95.8%** and B **72.4%**.

To turn attainment into money, value each tonne of feed not processed at the margin it would have earned. Fixed costs are paid whatever the throughput, so the margin is the flake revenue and avoided residue disposal, less the bale's opportunity cost, the variable cost and disposal of the residue. For A at 72% yield that is 0.72 × (1,050 + 160) − 250 − 110 − 160 = **A$351.20 per tonne of feed**, excluding GST. For B at 78.9% yield it is **A$429.37** a tonne. Against running at design rate from the first month, the contribution lost in the first 24 months is **A$535,540** for A and **A$4,265,225** for B, undiscounted.

```figure
type: compare
title: What ramp-up costs each option
cols: Option A, proven | Option B, novel
caption: This is an illustration, at 72% yield for A and 78.9% for B, against design throughput from the first month. B's steady lead over A falls from A$2,423,600 a year on paper to A$766,091 once its yield and plateau are corrected.
- Months to 90% of design rate | 2.77 | 21.85
- Average attainment, first 12 months | 91.5% | 58.1%
- Average attainment, first 24 months | 95.8% | 72.4%
- * Contribution lost in first 24 months | A$535,540 | A$4,265,225
- Steady contribution a year | A$4,721,600 at 100% | A$5,487,691 at 93%
```

The plateau costs B something every year after the climb is over. At 93% of design rate and 78.9% yield its steady contribution is **A$5,487,691** a year, against A$6,028,700 at full rate, a loss of A$541,009 a year. Its lead over A in steady operation is **A$766,091** a year, about a third of the A$2,423,600 the paper comparison in Chapter 1 promised. A slow climb followed by a lower plateau is the pattern the pioneer-plant research leads one to expect, and it hits B where its case was strongest: the extra flake its yield was meant to produce.

## How far the curve can move

Each of B's three numbers is a judgement, so the board asked how far the result moves when they change. This is an illustration. The simulation in Chapter 8 treats a time constant of 7 months as B's median and 10 months as its P80. At 10 months B would take **31.2 months** to reach 90%, average 65.9% over its first 24 months, and lose **A$5,266,739** of contribution in that time, about A$1.0 million more than the expected case. If instead a qualification run on the recycler's own bales found and fixed the worst start-up problems before the full plant was built, Chapter 9 assumes a time constant of 4 months and a plateau of 97%. B would then reach 90% in **9.3 months**, average 83.5% over 24 months and lose **A$2,554,925**, about A$1.7 million less than the expected case.

Two lessons follow. The time constant matters as much as the plateau, because a slow climb loses output early, when it is worth most after discounting and when the business has the least cash to spare. And the time constant is the parameter that preparation changes most. Operators trained on the pilot before start-up, spare wear parts chosen from what failed during qualification, the supplier's engineers on site through the first months, and a fault log reviewed every week all shorten it. Each costs little compared with a month of lost output, which for B at 78.9% yield is worth about A$6,400 for every point of attainment.

## Reliability growth

Throughput attainment and reliability are linked: a plant that stops often cannot hold its rate. Duane (1964), analysing failure data from several products during their development, found that when **cumulative MTBF** (total operating hours divided by total failures so far) was plotted against cumulative operating hours on log-log axes, the points fell close to a straight line. The slope of that line, α, measures how fast the team finds and removes causes of failure. In the Duane model the current, or **instantaneous**, MTBF is the cumulative value divided by 1 − α. O'Connor and Kleyner set out how the model is used to plan and track reliability growth.

```figure
type: formula
title: Duane reliability growth for Option B's wet section
formula: cumulative MTBF(T) = 60 h × (T ÷ 100 h)^α
formula: instantaneous MTBF(T) = cumulative MTBF(T) ÷ (1 − α)
caption: This is an illustration with α = 0.4, the book's teaching value. The full-scale wet section reaches the 500 h qualified in Chapter 6 only after 5,590 operating hours, about 11.2 months at 500 h a month.
- T | cumulative operating hours since start-up
- α | growth rate, the slope of the line on log-log axes
- 60 h | cumulative MTBF observed over the first 100 operating hours
step: At 1,000 h: cumulative 150.7 h, instantaneous 251.2 h
step: At 3,000 h: cumulative 233.9 h, instantaneous 389.8 h
step: Instantaneous 500 h when T = 100 × (500 × 0.6 ÷ 60)^(1 ÷ 0.4) = 5,590 h
```

This is an illustration. For B's full-scale wet section, the case assumes a cumulative MTBF of **60 h** over the first 100 operating hours, an instantaneous MTBF of 100 h at that point, and **α = 0.4**, a growth rate that needs an active programme of recording every stop, finding its cause and fixing it. At 1,000 h the instantaneous MTBF is 251.2 h; at 3,000 h it is 389.8 h; it reaches the 500 h target at **5,590 operating hours**, about **11.2 months** after start-up. By then the section will have stopped about 19 times (5,590 ÷ 300.0 h cumulative MTBF).

This explains a puzzle. A qualification run on the pilot can show 500 h between stops, and the full plant can still stop every few days for its first months. The pilot's components have been refined over its 400 hours and the qualification run; the full plant has ten hydrocyclones instead of one, a sorter four times as wide and a 120 m³ loop, each with its own new ways to stop. Qualification shows the process can reach the target; reliability growth says how long the full plant takes to get there.

## The error: a linear ramp borrowed from proven lines

The first business case for B assumed a **linear ramp from 50% to 100% of design rate over 6 months**, a shape the finance manager had taken from a proven line's commissioning plan. It gives 58.3% in the first month, 100% from the sixth, and averages of **89.6%** over 12 months and **94.8%** over 24 months.

```figure
type: compare
title: The business case's linear ramp against the expected curve for Option B
cols: Linear plan | Expected curve | Gap, points
rowhead: Month after start-up
caption: This is an illustration. Over 24 months the linear plan averages 94.8% against 72.4%, overstating B's contribution by A$3,460,152 undiscounted at 78.9% yield.
- 0 | 58.3% | 25.0% | 33.3
- 1 | 66.7% | 34.1% | 32.6
- 2 | 75.0% | 41.9% | 33.1
- 3 | 83.3% | 48.7% | 34.6
- 4 | 91.7% | 54.6% | 37.1
- 5 | 100.0% | 59.7% | 40.3
- * Average, first 24 months | 94.8% | 72.4% | 22.4
```

The independent reviewer asked where the ramp had come from, and then for the ramp-up records of comparable pioneer plants rather than proven lines. There were none for this process, which was the point: a ramp taken from proven equipment describes a plant whose lessons have already been learnt. Against the expected first-of-a-kind curve, the linear ramp overstated B's average attainment over its first 24 months by **22.4 points** (94.8% − 72.4%) and its contribution over those 24 months by **A$3,460,152**, undiscounted. The business case was corrected to use the first-of-a-kind curve, and the linear ramp was kept only as the plan for A, whose references support it.

The pattern is familiar outside process plants. [The J-curve: why changes often get worse before they get better](/reados/collections/valuing-time-delay-and-uncertainty/the-j-curve-planning-for-the-dip-before-improvement/) describes the same dip for operational changes, and [Ramp-up curves: how fast the volume arrives](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/ramp-up-curves/) in *Demand and Benefit Forecasts by the Numbers* models the market-side ramp, which is a different question: how fast customers take the product, not how fast the plant can make it. The recycler sells all the flake it makes, so here the constraint is technical. For the mathematics of learning curves fitted to repeated builds, see [Learning curves: unit and cumulative-average models](/reados/publications/modular-projects-by-the-numbers/learning-curves/) in *Modular Projects by the Numbers*.

A ramp-up curve is also a tracking tool. Once a plant starts, the observed attainment each month can be compared with the expected curve, and a shortfall flagged before it becomes a year's lost output. [Chapter 10](/reados/publications/first-of-a-kind-technology-by-the-numbers/choosing-and-following-through/) does that for the line the board chose.

## Exercise: a slower growth rate

The independent reviewer argues that a team with no experience of wash lines will not sustain α = 0.4, and that 0.3 is more realistic. With the same starting point, a cumulative MTBF of 60 h at 100 operating hours, how many operating hours would B's wet section need to reach an instantaneous MTBF of 500 h?

**Worked answer.** The instantaneous MTBF is 500 h when the cumulative MTBF is 500 × (1 − 0.3) = 350 h. Solving 60 × (T ÷ 100)^0.3 = 350 gives T = 100 × (350 ÷ 60)^(1 ÷ 0.3) = **35,732 h**, about **71.5 months** at 500 h a month, against 5,590 h and 11.2 months at α = 0.4. At 5,590 h the slower team's instantaneous MTBF would be only 286.6 h. A change of 0.1 in the growth rate multiplies the time to target more than six times, because the hours depend on the growth rate through an exponent of 1 ÷ α. The growth rate is a property of the owner's team and its fault-finding discipline more than of the equipment, which is why the pioneer-plant research found that newer plants did not simply start up better, and why the owner's operating team featured in Chapter 4.
