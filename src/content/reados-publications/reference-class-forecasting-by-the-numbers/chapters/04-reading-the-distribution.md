---
book: reference-class-forecasting-by-the-numbers
chapterSlug: reading-the-distribution
order: 4
title: "Reading the distribution: medians, percentiles and P-values"
description: "Read 24 cost ratios as a distribution: mean 1.267 against median 1.140, PERCENTILE.INC step by step to P80 1.408 and P90 1.632, what a P-value means, and small-sample limits."
draft: false
---

A reference class is a list of outcomes. To forecast from it, the list has to be read as a distribution: where the middle is, how far it spreads, and how likely a given overrun is. The tools are few and simple, a sorted list, a median and a handful of percentiles, but each has conventions that change the answer, and a small class has limits that the arithmetic does not announce.

This chapter reads the Bay 4 reference class of 24 projects. It sorts the ratios, compares the mean with the median and with the aggregate ratio, computes the 50th, 70th, 80th and 90th percentiles step by step, explains what a P-value means and what it assumes, and shows how much the upper percentiles depend on a few projects. It ends with a forecast that used the average as its middle and a different percentile function for its upper end, and moved Bay 4's budget by up to A$439,000, excluding GST.

## The sorted record

This is an illustration. The first step is to sort the 24 cost ratios from lowest to highest and number them. Every percentile is read from this list.

```figure
type: bars
title: The 24 cost ratios in rank order
unit: ×
max: 2.6
caption: This is an illustration. Rank, project and cost ratio. The highlighted rows bracket the median (ranks 12 and 13) and the 80th percentile (ranks 19 and 20).
- 1, P12 compressed-air ring main | 0.92
- 2, P16 laser marking station | 0.97
- 3, P03 CNC lathe | 0.99
- 4, P07 coordinate measuring machine | 1.00
- 5, P01 vertical machining centre | 1.02
- 6, P13 wire EDM | 1.03
- 7, P10 horizontal machining centre | 1.05
- 8, P06 hardstand and drainage | 1.06
- 9, P20 5-axis machining centre | 1.08
- 10, P19 office fit-out | 1.10
- 11, P09 bar-feed retrofit | 1.11
- * 12, P02 mezzanine office | 1.13
- * 13, P23 tool presetting and storage | 1.15
- 14, P22 solar PV and battery | 1.18
- 15, P17 quality management system | 1.21
- 16, P15 factory extension | 1.24
- 17, P04 robot deburring cell | 1.27
- 18, P24 dust and mist extraction | 1.31
- * 19, P11 CAM system replacement | 1.38
- * 20, P14 pallet pool | 1.45
- 21, P08 switchboard and power upgrade | 1.52
- 22, P18 collaborative robot cell | 1.68
- 23, P21 monitoring and MES pilot | 1.95
- 24, P05 first ERP system | 2.60
```

The shape is visible at a glance. The first two-thirds of the list climbs slowly, from 0.92 to about 1.27. The last third climbs faster, and the last four values climb steeply. The distribution is **skewed to the right**: overruns can be large, savings cannot.

## Three different middles

**The mean** is the sum of the 24 ratios divided by 24: **1.267**. **The median** is the middle value: with 24 values, halfway between the 12th and 13th, (1.13 + 1.15) ÷ 2 = **1.140**. **The aggregate ratio** is the total final cost of all 24 projects divided by their total approved budgets: A$8,658k ÷ A$7,095k = **1.220**.

They answer different questions. The median is the typical project: half finished below 1.140 and half above. The mean is pulled up by the right-hand tail; 16 of the 24 projects finished at or below it, so as a forecast it is closer to a two-in-three outcome than an even one. The aggregate ratio weights each project by its size, so it describes the business's capital spending as a whole: across all 24 projects, every approved dollar became A$1.22 of final cost. The large projects, mostly machines and buildings, overran less than the small software projects, which is why the aggregate sits below the mean.

The spread shows the same skew. The 25th percentile is at position 1 + 0.25 × 23 = 6.75, so 1.03 + 0.75 × 0.02 = **1.045**; the 75th percentile, worked in the exercise below, is **1.3275**. The middle half of the projects finished between 4.5% and about 33% over budget. The upper quartile sits 0.19 above the median and the lower quartile only 0.095 below it: the distribution stretches twice as far upwards in its middle half, and much further in its tail.

For forecasting a single project, the median and the percentiles above it are the useful measures. The mean has its place in a portfolio, where many projects' overruns add up, and Chapter 6 uses the gap between mean and median as a measure of the tail.

## Percentiles by linear interpolation

A **percentile** is the value below which a given share of the outcomes falls. The 80th percentile, written **P80**, is the ratio that 80% of the class finished at or below. With a small class, the percentile usually falls between two recorded values, and a convention is needed to fill the gap. This book uses linear interpolation between ranks, which is what the spreadsheet function PERCENTILE.INC does, and one of the conventions catalogued by Hyndman and Fan (1996).

```figure
type: formula
title: PERCENTILE.INC by hand
formula: position = 1 + p × (n − 1)
formula: value = lower value + fraction × (upper value − lower value)
caption: This is an illustration for the 24 Bay 4 ratios. The position's whole number picks the lower value; its fraction sets how far to move towards the next one.
- p | The percentile as a fraction, 0.80 for P80
- n | The number of values, 24
- lower value | The value at the whole-number part of the position
- fraction | The decimal part of the position
step: P50: position 1 + 0.5 × 23 = 12.5; 1.13 + 0.5 × 0.02 = 1.140
step: P70: position 1 + 0.7 × 23 = 17.1; 1.27 + 0.1 × 0.04 = 1.274
step: P80: position 1 + 0.8 × 23 = 19.4; 1.38 + 0.4 × 0.07 = 1.408
step: P90: position 1 + 0.9 × 23 = 21.7; 1.52 + 0.7 × 0.16 = 1.632
```

Taking P80 slowly: the position is 1 + 0.8 × 23 = 19.4. The 19th value is 1.38 (P11) and the 20th is 1.45 (P14). The percentile lies 0.4 of the way from the first to the second: 1.38 + 0.4 × (1.45 − 1.38) = **1.408**. In a spreadsheet, `=PERCENTILE.INC(range, 0.8)` returns the same value.

## Checking against the record

Each percentile can be checked by counting. Five projects finished above 1.408: P14, P08, P18, P21 and P05. That is 5 of 24, or **20.8%**, close to the 20% that P80 implies. Above P90, 1.632, there are three: P18, P21 and P05, or **12.5%**. Above P70, 1.274, there are seven, **29.2%**. Above the median, twelve, exactly half. The counts do not match the percentages exactly because 24 projects cannot be split into exact fifths and tenths, and the interpolation places each percentile between two real outcomes.

```figure
type: compare
title: The class at four confidence levels
rowhead: Level
cols: Cost ratio | Bay 4 budget at A$2.40m × ratio | Past projects above
caption: This is an illustration. Budgets in 2026 dollars excluding GST. The last column counts the 24 past projects that finished above each ratio.
- P50 | 1.140 | A$2.736m | 12 of 24, 50.0%
- P70 | 1.274 | A$3.058m | 7 of 24, 29.2%
- * P80 | 1.408 | A$3.379m | 5 of 24, 20.8%
- P90 | 1.632 | A$3.917m | 3 of 24, 12.5%
```

## Reading it the other way: the chance of exceeding a budget

Percentiles answer the question "what budget gives an 80% chance?". Decision-makers often ask the reverse: "if we approve this figure, how likely are we to need more?". The record answers that directly. Divide the proposed budget by Bay 4's approved A$2.40 million to get a ratio, and count the past projects that finished above it.

This is an illustration. A budget of A$2.40 million is a ratio of 1.00, and 20 of 24 past projects finished above that, **83.3%**. A budget of A$3.0 million is a ratio of 1.25, exceeded by 8 of 24, **33.3%**. A budget of A$3.6 million is a ratio of 1.50, exceeded by 4, **16.7%**. A budget of A$5.0 million is a ratio of 2.083, exceeded only by P05, one project in 24.

```figure
type: line
title: Share of past projects that would have exceeded each Bay 4 budget
x: Bay 4 budget, A$m in 2026 dollars excluding GST
y: Past projects exceeding, %
ymin: 0
ymax: 90
caption: This is an illustration. Each point counts the 24 past projects whose cost ratio was above the budget divided by A$2.40m. The curve falls steeply to about A$3.0m and flattens into a long tail.
- 2.4 | 83.3
- 2.7 | 54.2
- 3.0 | 33.3
- 3.3 | 25.0
- 3.6 | 16.7
- 4.0 | 12.5
- 5.0 | 4.2
```

The curve shows the cost of confidence. Moving from A$2.4 million to A$3.0 million cuts the share of overruns from 83% to 33%; each further A$600,000 buys much less, because the projects that remain above the line are the ones that overran by half or more. That flattening is the tail, which Chapter 6 measures, and the counts in this form are what a board member can check for themselves on the sorted list.

## What a P-value means

The Australian Government Department of Finance describes a P90 estimate as one with enough contingency that there is a 90 per cent likelihood it will not be exceeded. The same reading applies at any level: a P80 budget has an 80% likelihood of not being exceeded and a 20% likelihood of being exceeded.

For Bay 4, the statement "the P80 budget is A$3.379 million" means: if Bay 4's final cost relative to its approved budget behaves like a random draw from the business's 24 past projects, there is about an 80% chance that it will finish at or below A$3.379 million. That sentence carries three assumptions, and each should be stated when the number is used.

- **The class is relevant.** Bay 4 is the same kind of undertaking, by the same business, as the projects in the class. Chapter 3 tested this.
- **The base estimate was made the same way.** The ratios measure the gap between the business's usual estimates and outcomes. A base estimate built much more carefully, or much less, would sit differently against the class.
- **The future resembles the past.** Supplier markets, approvals and the business's own capabilities have not shifted in a way the class cannot see.

A P-value is a statement about a distribution, not a promise. A project with a P80 budget that overruns has not proved the forecast wrong, any more than a coin landing tails disproves a 50% chance. Whether the forecasts were right is a question about many forecasts together, which Chapter 10 addresses. [Thinking in probabilities](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/) sets out the broader idea of probability as a degree of belief that evidence can test.

## How much 24 projects can say

Twenty-four projects is a good record for a small business and a small sample for statistics. The percentiles in the upper part of the distribution rest on very few projects.

P90 is interpolated between the 21st and 22nd values, and only three projects lie above it. If P18, the collaborative robot cell, had finished at 1.55 instead of 1.68, P90 would have been 1.52 + 0.7 × 0.03 = **1.541** instead of 1.632, and Bay 4's P90 budget would have been A$218,000 lower. One project's outcome moves the P90 budget by more than the whole of Bay 4's original contingency.

The extreme value behaves differently. If P05 had finished at 1.70 instead of 2.60, it would still be the 24th value and P90 and P80 would not change at all, but the mean would fall from 1.267 to 1.229. Percentiles are robust to the size of the most extreme outcome and sensitive to the values near their own rank. The mean is the opposite.

A further check is to resample the class: draw 24 ratios at random, with replacement, from the 24 recorded, compute P80, and repeat many times. In 10,000 such resamples of the Bay 4 class, the middle 90% of the P80 values ran from **1.234 to 1.680**. On a A$2.40 million budget that is a range from about A$2.96 million to A$4.03 million. The P80 of 1.408 is the best single estimate the record gives, but it is not a precise one. Chapter 8 uses the same resampling idea, which goes back to Efron (1979), to combine components.

```figure
type: stats
title: Limits of a 24-project class
caption: This is an illustration. Resampling figures from 10,000 random resamples of the 24 ratios. The P80 is the best estimate available, with a wide band around it.
- 3 | projects above P90 | P18, P21 and P05
- A$218k | change in Bay 4's P90 budget | if P18 had finished at 1.55
- *1.234 to 1.680 | middle 90% of resampled P80s | against 1.408 from the record
- Above P90 | the record says little | Chapter 6 reads the tail
```

The practical consequences are modest but important. Report percentiles to two or three decimal places for arithmetic, but discuss them in rounded terms. Do not quote percentiles beyond P90 from a class of this size, because they would rest on two or three projects. And treat each new completed project as a material addition to the class, not a footnote.

## Presenting the distribution

A distribution is easy to compute and easy to misread, so how it is shown to the people deciding matters as much as the arithmetic. The Bay 4 paper follows four habits.

- **Show the sorted list with names.** Each ratio is labelled with its project, so that a reader can see that the top of the distribution is software, automation and a power upgrade, and can question any record they remember differently.
- **Pair every percentile with a count.** "P80 is 1.408; five of the 24 past projects finished above it" is harder to misunderstand than either half alone.
- **State the size of the class and the convention.** "24 projects, PERCENTILE.INC" takes six words and stops two people from computing two different answers from the same data.
- **Give a range, not a point, for the middle.** The middle half of past projects finished between 4.5% and about 33% over. A board that hears only "14%" will treat it as a target.

These habits also make the forecast auditable later. When Bay 4 is complete, anyone can see where its outcome would have sat in the list that was used to approve it.

## The error: an average and a different function

This is an illustration. The first draft of the Bay 4 forecast was prepared by a staff member who had not seen the convention. It showed a "P50" budget of **A$3.040 million** and a "P80" budget of **A$3.480 million**.

The "P50" was the AVERAGE of the ratios, 1.267, applied to A$2.40 million. It was A$304,000 above the true P50 of A$2.736 million. Because 16 of 24 projects finished at or below the mean, the budget labelled P50 was in fact about a two-in-three budget, which overstated the money needed for an even chance and understated how far the upper percentiles were above it.

The "P80" came from PERCENTILE.EXC, a different spreadsheet function. It places the percentile at position p × (n + 1) rather than 1 + p × (n − 1). For P80 that is 0.8 × 25 = **20**, the 20th value exactly, **1.45**, and a budget of A$3.480 million, A$101,000 above the PERCENTILE.INC value. At P90 the gap widens: PERCENTILE.EXC gives position 0.9 × 25 = 22.5, halfway between 1.68 and 1.95, so **1.815**, and a budget of A$4.356 million against A$3.917 million, a difference of A$439,000.

```figure
type: compare
title: Three ways to compute the same levels
rowhead: Level
cols: PERCENTILE.INC, the book's convention | PERCENTILE.EXC | AVERAGE
caption: This is an illustration. Bay 4 budgets on A$2.40m. The conventions agree near the middle and diverge in the tail, where the data are thinnest.
- P50 | 1.140, A$2.736m | 1.140, A$2.736m | 1.267, A$3.040m
- *P80 | 1.408, A$3.379m | 1.450, A$3.480m | not a percentile
- P90 | 1.632, A$3.917m | 1.815, A$4.356m | not a percentile
```

Neither function is wrong; they are different conventions, and with a large sample they converge. With 24 projects, they diverge most exactly where the decision is made. The error was caught when the finance manager recomputed P80 by hand from the sorted list and got 1.408. The correction was procedural: the class file now states the convention, PERCENTILE.INC, beside the data, every percentile in a decision paper is shown with its position and the two values it lies between, and the word "average" is not used for the median.

## Exercise: the 75th percentile

The owner asks for a budget with a three-in-four chance of not being exceeded. Using PERCENTILE.INC, compute P75 for the 24 ratios, the Bay 4 budget it implies, and the number of past projects that finished above it.

**Worked answer.** The position is 1 + 0.75 × 23 = **18.25**. The 18th value is 1.31 (P24) and the 19th is 1.38 (P11), so P75 = 1.31 + 0.25 × (1.38 − 1.31) = **1.3275**, about 1.328. The Bay 4 budget is 2,400 × 1.3275 = **A$3.186 million**. Six past projects finished above 1.3275: P11, P14, P08, P18, P21 and P05, which is 6 of 24, exactly **25%**. Chapter 5, [Uplifts and contingency: from a percentile to a budget](/reados/publications/reference-class-forecasting-by-the-numbers/uplifts-and-contingency/), turns a chosen level like this into a budget with a visible contingency.
