---
book: demand-and-benefit-forecasts-by-the-numbers
chapterSlug: ramp-up-curves
order: 4
title: "Ramp-up curves: how fast the volume arrives"
description: "Customer onboarding and line learning as two ramps, a logistic S-curve fitted to rig 2 (midpoint 8.80 months), and a flat 70% first year that the line could not have filled."
draft: false
---

A forecast of steady-state volume says how much a plant will fill once it is established. A business case also has to say how quickly it gets there, because the early years are discounted least and carry the fixed costs in full. The canning plant's business case answered that question with two percentages: 70% of the steady volume in the first year and 95% in the second. Those two numbers are as much a forecast as the 25.32m cans, and they can be tested in the same way, against the business's own record and against the physical limits of the line.

This chapter separates the ramp-up into its two parts: how fast customers arrive, and how fast the line learns to run at its full rate. It sets out the chain of steps that a new brand must go through before its first commercial run, fits an S-curve to the business's record from the launch of its second mobile rig, and compares the result with the business case. It explains why the first year of operation is the right place to measure a forecast and how a ramp-up can become an excuse. It ends with a first month that neither the customers nor the line could have produced.

## Two ramps, not one

This is an illustration. The plant's volume in any month is limited by two things at once. The **demand-side ramp** is the arrival of customers: each new brand must sign, order cans, trial and then begin regular runs, and the number of brands in regular production builds up over months. The **line-side ramp** is the plant learning to run: crews learn the equipment, settings are refined, faults are found and fixed, and the effective running rate climbs towards the 9,000 cans an hour assumed at maturity.

For the plant, the operations manager's plan for line-side learning, based on the equipment supplier's commissioning experience and the crew's training plan, was an effective rate of 5,000 cans an hour in month 1, then 6,000, 6,800, 7,400, 7,900, 8,300, 8,600 and 8,800, reaching 9,000 in month 9 and staying there. Averaged over the first twelve months that is 7,900 cans an hour, 87.8% of the mature rate.

Line learning follows a well-studied pattern of its own. [Learning curves: unit and cumulative-average models](/reados/publications/modular-projects-by-the-numbers/learning-curves/) in *Modular Projects by the Numbers* fits such curves from recorded hours, and [Ramp-up: from first flake to nameplate output](/reados/publications/first-of-a-kind-technology-by-the-numbers/ramp-up-to-nameplate/) in *First-of-a-Kind Technology by the Numbers* shows how much slower the climb is when the equipment itself is unproven. The plant's line is a standard design, so its learning is short. For this plant the demand-side ramp is the slower of the two, and it is the one the business case got most wrong.

The two ramps combine simply: in any month the plant fills the lesser of what its customers order and what its line can run in the scheduled hours. A month-by-month model therefore needs two rows, one for the cans customers are expected to order and one for the line's capacity at that month's effective rate after changeovers, and it takes the lower of the two. Modelling only one ramp hides whichever limit is binding, and the binding limit changes as the months pass: early on it may be the line, later almost always the customers.

## The onboarding chain

A brewer already using the mobile rigs can move to the plant quickly: its cans and labels exist, and its liquid is known. A new brand cannot. Before its first commercial run it must pass through a chain of steps, each with its own lead time:

```figure
type: timeline
title: Onboarding chain for a new brand
caption: This is an illustration. About 18 weeks, or 4.1 months, from a signed supply agreement to the first commercial run. Most of it is the printed-can lead time, which the plant does not control.
- Week 0 | Supply agreement signed | volumes, price, can format and liquid specification agreed
- Weeks 0–14 | Artwork approved and printed cans ordered | 14-week lead time from the can maker
- * Weeks 14–18 | Three trial runs over four weeks | fill level, seam checks, shelf-life and pasteurisation checks
- Week 18 | First commercial run | about 4.1 months after signing
```

The chain sets a hard floor under the demand-side ramp. A brand that signs a supply agreement in month 1 cannot fill commercially before about month 5. For the plant to have new brands running in January 2025, their supply agreements had to be signed by the end of August 2024, while the unit was still being fitted out. In February 2024, when the forecast was made, none had been signed.

## The rig 2 record and the S-curve

The business had one record of a ramp-up: the launch of its second mobile rig in mid-2021. The finance manager expressed each month's volume as a share of the rig's mature level. Over the first 24 months the shares were 0.08, 0.10, 0.14, 0.18, 0.24, 0.30, 0.38, 0.46, 0.53, 0.61, 0.67, 0.72, then 0.77, 0.81, 0.85, 0.87, 0.90, 0.92, 0.93, 0.95, 0.96, 0.97, 0.98 and 0.98. The rig first reached half its mature volume in month 9 and 90% in month 17. Its average share in the first twelve months was **0.367**, and in the second twelve **0.908**.

That shape, slow at first, fastest in the middle and slow again near the top, is an S-curve, and the simplest S-curve is the **logistic**. Fitting it to the 24 monthly shares by least squares gives a midpoint of **8.80 months** and a steepness of **0.290 a month**.

```figure
type: formula
title: The logistic ramp-up curve
formula: share in month m = 1 ÷ (1 + e^(−k × (m − m₅₀)))
caption: This is an illustration. Fitted to rig 2's 24 monthly shares by least squares. The time from 10% to 90% of mature volume is 2 × ln 9 ÷ k.
- m₅₀ | the month at which volume reaches half its mature level: 8.80 for rig 2
- k | steepness a month: 0.290 for rig 2
- e | the base of natural logarithms, about 2.718
step: month 1: 1 ÷ (1 + e^(−0.290 × (1 − 8.80))) = 0.094
step: month 9: 1 ÷ (1 + e^(−0.290 × 0.20)) = 0.514
step: 10% to 90%: 2 × 2.197 ÷ 0.290 = 15.2 months
```

The fitted curve gives shares of 0.094 in month 1, 0.307 in month 6, 0.514 in month 9, 0.717 in month 12, 0.935 in month 18 and 0.988 in month 24, and a first-year average of **0.368**, within a thousandth of the record. It takes **15.2 months** to climb from 10% to 90% of mature volume. Two parameters therefore summarise the whole record, and they can be compared directly with any proposed ramp.

The S-shape has a long history in the study of how new products spread. Bass (1969) modelled adoption as driven partly by **innovators**, who adopt on their own initiative, and partly by **imitators**, who adopt because others already have; the result is a cumulative curve that rises slowly, accelerates as imitation takes hold and flattens as the market is used up. The logistic is close to the special case in which imitation dominates. For a contract filler the mechanism is plausible: brands hear about a filler from other brands, and a filler with visible customers wins more of them. This book fits the simpler curve because the business has one short record, not enough to separate the two effects.

## The business case's ramp as a curve

The business case did not describe its ramp month by month; it simply took 70% of steady volume in year 1. It is still possible to ask what S-curve that implies. Keeping the steepness at a brisk 0.5 a month, a logistic whose first-year average is 70% has its midpoint at **3.77 months**. Its month-1 share is 0.200, its month-3 share 0.405, and its second-year average 0.998.

```figure
type: line
title: Ramp-up shares, rig 2 record against the fitted curve and the business case's equivalent
x: Month after launch
y: Share of mature volume
ymin: 0
ymax: 1
legend: Rig 2 record | Fitted logistic, midpoint 8.80 | Inside view equivalent, midpoint 3.77
mark: 4.1 | First new brand possible
caption: This is an illustration. The business case's 70% first year implies half the mature volume by month 4, when a brand signing at start-up could only just have begun. The record reached half in month 9.
- 1 | 0.08 | 0.094 | 0.200
- 2 | 0.10 | 0.122 | 0.292
- 3 | 0.14 | 0.157 | 0.405
- 4 | 0.18 | 0.199 | 0.528
- 5 | 0.24 | 0.249 | 0.649
- 6 | 0.30 | 0.307 | 0.753
- 7 | 0.38 | 0.372 | 0.834
- 8 | 0.46 | 0.442 | 0.892
- 9 | 0.53 | 0.514 | 0.932
- 10 | 0.61 | 0.586 | 0.957
- 11 | 0.67 | 0.654 | 0.974
- 12 | 0.72 | 0.717 | 0.984
- 13 | 0.77 | 0.772 | 0.990
- 14 | 0.81 | 0.819 | 0.994
- 15 | 0.85 | 0.858 | 0.996
- 16 | 0.87 | 0.890 | 0.998
- 17 | 0.90 | 0.915 | 0.999
- 18 | 0.92 | 0.935 | 0.999
- 19 | 0.93 | 0.951 | 1.000
- 20 | 0.95 | 0.963 | 1.000
- 21 | 0.96 | 0.972 | 1.000
- 22 | 0.97 | 0.979 | 1.000
- 23 | 0.98 | 0.984 | 1.000
- 24 | 0.98 | 0.988 | 1.000
```

Seen as a curve, the business case's ramp is not a mild optimism. It claims the plant would reach in four months what the business's own rig took nine months to reach, and it claims this for a plant whose new customers could not start for four months at all.

## What the ramp is worth

The ramp affects the business case through the first two years' contribution. To separate its effect from the volume question, apply each ramp to the same steady volume: the record-based expected volume of 15.367m cans from [Testing each driver against the record](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/testing-the-drivers/), at its contribution of A$0.124 a can, excluding GST.

```figure
type: compare
title: First two years under three ramps, at the expected volume of 15.367m cans
rowhead: Ramp
cols: Year-1 share | Year-1 volume | Year-1 contribution | Year-2 share | Year-2 volume | Year-2 contribution
caption: This is an illustration. A$ excluding GST, at A$0.124 a can. The record and the fitted curve agree; the business case's ramp adds A$634.8k of first-year contribution that the record does not support.
- Business case, flat 70% and 95% | 0.700 | 10.757m | A$1,336.5k | 0.950 | 14.599m | A$1,813.8k
- * Rig 2 record | 0.367 | 5.647m | A$701.7k | 0.908 | 13.946m | A$1,732.7k
- Fitted logistic | 0.368 | 5.654m | A$702.5k | 0.919 | 14.118m | A$1,754.0k
```

The difference between the business case's ramp and the record is A$634.8k of contribution in year 1 and A$81.1k in year 2. That is real money for a business of this size, but it is a one-off delay, not a permanent loss. A shortfall in the steady volume repeats every year for ten years. Chapter 7 shows how much less the ramp matters to the NPV than the steady volume does. The board's mistake would be to treat a slow ramp as the explanation for a shortfall that is really in the steady state, which is the next point.

## Why the first year matters, and how a ramp becomes an excuse

Flyvbjerg (2005), writing in *Transportation Research Part A* about travel demand forecasts, argued that accuracy should be measured by comparing the forecast made **at the decision to build** with actual demand in the **first year of operation**. The first year is when the decision's assumptions meet reality, before later events and later forecasts blur the comparison. Defenders of a weak first year often say that demand is still ramping up and that the forecast will be met later. Sometimes it is. But if a slow ramp was foreseeable, it belonged in the forecast, and a forecast that left it out was optimistic in its timing even if its steady state turns out right. If the ramp later stalls below the forecast, the claim that it was still ramping has deferred the recognition of a shortfall by a year or more.

Australian evidence points the same way. Li and Hensher (2010), reviewing toll roads in Australia, found that their traffic forecasts carried a sizeable error, especially in the first year of operation. For the plant, the practical rule is to measure each year against the ramp-adjusted forecast for that year and, separately, to watch whether the underlying run-rate is heading for the steady state. Chapter 8 does that with a deseasonalised run-rate, and the dip a new operation goes through before improving is the subject of [The J-curve: why changes often get worse before they get better](/reados/collections/valuing-time-delay-and-uncertainty/the-j-curve-planning-for-the-dip-before-improvement/).

## The error: a first month nobody could fill

This is an illustration. The business case's 70% first year, spread evenly, meant 17.724m cans in 2025, or **1.477m cans a month** from January 2025. The reviewer phased the year month by month and tested month 1 against both ramps.

On the line side, the forecast's run mix at 70% of steady volume implies about 34 runs a month, taking 50.6 hours of changeover out of the 333.3 hours scheduled. At month 1's effective rate of 5,000 cans an hour, the remaining 282.8 hours could fill **1.414m cans**. The plan asked for more than the line could fill in its first month, even with every customer in place. By month 2, at 6,000 cans an hour, capacity rises to 1.697m and the line-side limit no longer binds.

On the demand side, the problem was worse. Most of the forecast volume came from brands that had not signed anything, and the 18-week onboarding chain meant that none of them could fill before about May 2025 even if they signed on the day the plant opened. The flat 70% assumed customers who could not physically have been there.

The error was detected only because the reviewer phased the annual figure into months: at an annual level, 70% sounds cautious. It was corrected by replacing the flat percentage with the fitted S-curve, so that year 1 was taken at 0.368 of steady volume and year 2 at about 0.92, and by adding the onboarding chain to the sales plan, so that the sales manager's targets were for signed agreements by date, not for customers in general.

In the event, the plant filled **34.0k cans** in January 2025, 2.3% of the flat plan's 1.477m. Over 2025 it filled **7.133m cans**, 0.402 of the business case's first-year 17.724m, but 1.263 times the 5.647m given by the rig 2 ramp applied to the expected volume of 15.367m. The first year was slow against the business case and not slow at all against the record. Whether the steady state follows is a separate question, which Chapters 8 to 10 answer.

## Exercise: signing before start-up

The sales manager argues that the plant's ramp will be faster than rig 2's, because supply agreements can be signed and cans ordered while the plant is being built. Suppose this moves the midpoint of the logistic two months earlier, to 6.80 months, with the steepness unchanged at 0.290 a month. What are the first- and second-year average shares, and what is the year-1 volume and extra contribution at the expected steady volume of 15.367m cans and A$0.124 a can?

**Worked answer.** Averaging the logistic with midpoint 6.80 and k = 0.290 over months 1 to 12 gives a first-year share of **0.482**, and over months 13 to 24, **0.951**. Year-1 volume is 0.482 × 15.367m = **7.414m cans**, against 5.654m on the fitted rig 2 curve, an increase of **1.760m cans**. At A$0.124 a can that is about **A$218.6k** of extra contribution, excluding GST. The argument is sound in principle, because the onboarding chain is the main source of delay and some of it can be run before start-up. It is only worth what the signed agreements show, though. A useful condition is to count only brands with signed agreements and printed cans on order by the start of the build's last quarter, and to fall back to the rig 2 curve for the rest.
