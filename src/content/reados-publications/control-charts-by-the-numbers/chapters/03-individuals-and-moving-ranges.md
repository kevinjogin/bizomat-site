---
book: control-charts-by-the-numbers
chapterSlug: individuals-and-moving-ranges
order: 3
title: "Individuals and moving ranges"
description: "Charting one reading per period: the moving range estimate of σ, individuals limits, why an outlier can hide itself, setting a clean baseline, and the extra care that single readings need."
draft: false
---

Some processes give one number at a time. A heat-treatment batch yields one hardness result worth recording, a mixing tank one viscosity, a furnace run one carbon content, a destructive test one strength value per lot. There is no subgroup of five consecutive parts to average, because the batch is the unit and the next batch is hours or days away. For these processes the individuals chart, also called the X chart or I–MR chart, plots each reading against limits estimated from the differences between successive readings.

This chapter sets up an individuals chart for SP-12's case hardness with the BIZOMAT individuals tool, explains the moving-range estimate and why it is used, and works through a case in which a bad batch inflated its own limits and escaped notice. It then sets out the extra care that single readings need, because they get none of the protection that averaging gives.

## SP-12's hardness

This is an illustration. After turning, SP-12 spools are case hardened in batches of about 2,000 by a heat treater, and one spool from each batch is tested on a Rockwell tester. The drawing specifies 56 to 62 HRC. Twelve consecutive batches gave these results, in order: 58.2, 57.6, 58.4, 58.9, 57.8, 58.1, 58.6, 57.9, 58.3, 60.1, 58.0 and 58.5 HRC.

Every result is inside the specification, and the lowest is 1.6 HRC above the lower limit. A specification check would pass all twelve batches without comment. The question the chart asks is different: is the heat treatment behaving consistently, or has something changed that the specification's wide window would not reveal until it was too late?

## The moving range

With one reading per period there is no within-subgroup range. The individuals chart borrows one: the moving range, the absolute difference between each reading and the one before it. Successive readings are close together in time, so their difference is mostly common-cause variation, and the average moving range estimates the short-term spread in the same way that R̄ did for subgroups. For a pair of normal readings, the expected range is 1.128σ, so σ is estimated as MR̄ ÷ 1.128.

```figure
type: formula
title: Individuals chart limits from the moving range
formula: MRᵢ = |xᵢ − xᵢ₋₁|, for i = 2 to k
formula: σ̂ = MR̄ ÷ 1.128; limits = x̄ ± 3σ̂ = x̄ ± 2.66 MR̄
caption: The constant 1.128 is d₂ for subgroups of two; 3 ÷ 1.128 = 2.66. The moving range chart itself, if drawn, has an upper limit of 3.267 MR̄. This is an illustration with SP-12's twelve hardness results.
- Mean | x̄ = 58.367 HRC
- Average of 11 moving ranges | MR̄ = 0.8455 HRC
step: σ̂ = 0.8455 ÷ 1.128 = 0.7495 HRC
step: Limits: 58.367 ± 3 × 0.7495 = 56.118 to 60.615 HRC
```

Why not simply calculate the standard deviation of all twelve readings? Because the chart's purpose is to detect changes in the process over time, and an overall standard deviation includes those changes in its estimate. If the process mean drifted slowly across the twelve batches, the overall standard deviation would grow with the drift and widen the limits until they could not see it. The moving range responds only to the jump between neighbours, so a slow drift barely affects it. It is the individuals chart's version of rational subgrouping.

## The tool's verdict

The [individuals control chart check](/tools/individuals-chart-check/) performs the calculation for up to twelve readings in time order. It gives the mean, the moving ranges and their average, σ estimated from the average moving range, the upper and lower limits, and which readings fall outside them, with a table of readings, moving ranges and status. It warns that limits from few readings are rough, recommends recalculating with 20 to 25 readings, and reminds the user to apply run rules as well.

```figure
type: stats
title: SP-12's twelve hardness results in the individuals tool
caption: This is an illustration. Readings 58.2 to 58.5 HRC as listed above. The tool reports the process in control; batch 10 at 60.1 HRC sits inside the upper limit of 60.615 HRC.
- 58.367 HRC | Mean | twelve batches
- 0.8455 HRC | Average moving range | largest 2.10 HRC, from batch 10 to 11
- 0.7495 HRC | Estimated σ | MR̄ ÷ 1.128
- * 56.118 to 60.615 HRC | Control limits | no reading outside
```

On these numbers the heat treatment looks in control, and batch 10 looks like a high but ordinary result. The next section shows why that conclusion was wrong.

## The error: an outlier that hid itself

This is an illustration. Two weeks later, a customer's incoming inspection found that spools from batch 10 had a case depth at the deep end of their range, and asked whether the batch had been treated differently. The heat treater's records showed that the quench oil temperature controller had faulted during that batch, and the oil had run about 20 K cooler than usual, quenching harder. Batch 10 had had a special cause, and the chart had not caught it.

The reason is in the moving ranges. A single high reading creates two large moving ranges, one going up into it and one coming down out of it: here 1.8 and 2.1 HRC, against an average of about 0.57 HRC for the other nine. Those two values raised the average moving range from 0.570 to 0.8455 HRC, raised σ̂ from 0.505 to 0.750 HRC, and pushed the upper limit from 59.725 to 60.615 HRC, just enough to let 60.1 HRC inside. The outlier had widened the net it should have been caught in.

```figure
type: compare
title: SP-12's hardness limits with and without batch 10 in the baseline
cols: Mean, HRC | MR̄, HRC | σ̂, HRC | Upper limit, HRC | Batch 10 at 60.1 HRC
rowhead: Baseline
caption: This is an illustration. With twelve readings, one outlier carries two of the eleven moving ranges. Removed from the baseline because of its known cause, it falls well outside the limits calculated from the other eleven.
- All twelve batches | 58.367 | 0.8455 | 0.7495 | 60.615 | inside
- * Eleven batches, batch 10 removed | 58.209 | 0.5700 | 0.5053 | 59.725 | outside
```

The remedy is to set limits from a clean baseline. In Phase I, a reading with a known special cause is removed from the baseline and the limits recalculated; the reading is then judged against the new limits, where batch 10 is 0.375 HRC above the upper limit and plainly special. The general lessons are that individuals charts built from few readings are fragile, that an obvious outlier should be investigated before it is used to set the limits it will be judged against, and that a chart's verdict is worth more when the baseline is 20 or more readings, as the tool advises, so that one bad value carries less weight.

The heat treater added the quench oil temperature to each batch record, and the plant now charts that too, since it is the cause and hardness is the effect. Charting a cause has a further advantage: it signals before the parts are made, while a chart of the effect can only signal after.

## Single readings need more care

An individuals chart gives up the two protections that averaging provides in an X̄ chart. It is less sensitive: a shift of one standard deviation is detected after about 44 readings on average, against about 4.5 subgroups of five on SP-12's X̄ chart, as Chapter 4 calculates. And it is more exposed to the shape of the distribution: the central limit theorem pulls averages towards the normal, but single readings keep whatever shape the process gives them. Hardness, strength, viscosity and roughness are often skewed, and three-sigma limits calculated as if they were normal will give more false alarms on the long tail and fewer on the short one.

Three habits help. Look at a histogram or a normal probability plot of the baseline before relying on the limits. Where a transformation such as the logarithm makes the data roughly normal, chart the transformed values. And where batches are frequent enough, consider whether a moving average of two or three readings, or one of the charts in Chapters 5 and 6, would serve better than single points.

## Overall spread against the moving range

For the twelve hardness results, the ordinary standard deviation is 0.656 HRC, smaller than the moving-range estimate of 0.750 HRC. That surprises people who have learned that the moving range gives the smaller, short-term figure. Both behaviours have the same cause. A single isolated outlier adds one large deviation to the overall calculation but two large moving ranges, so it inflates the moving-range estimate more. A slow drift does the opposite: it adds many moderate deviations from the overall mean but changes successive readings only a little, so it inflates the overall standard deviation more. Comparing the two estimates is therefore a quick diagnostic. A moving-range σ well below the overall σ suggests drift or shifts between periods; one well above suggests isolated outliers. Either way, the baseline deserves a closer look before limits are fixed.

## Batches with several readings

When a batch can give more than one reading, it is tempting to treat the readings as a subgroup and draw an X̄–R chart. For batch processes that is often a mistake. This is an illustration. Suppose the heat treater tested two spools from every batch. The two spools would differ by the variation within a batch, perhaps 0.2 HRC, while batches differ from each other by more, about 0.5 HRC, because each batch has its own furnace load, quench oil temperature and timing. An X̄ chart with limits from the within-batch ranges would set its limits from 0.2 HRC of variation and flag nearly every batch, because the ordinary batch-to-batch variation, which is common cause for this process, would look special.

The rational subgroup for a batch process is usually the batch itself. The right chart plots the batch average as an individual reading, with limits from the moving range of batch averages, and if needed a second chart of the within-batch ranges to watch uniformity inside each batch. That arrangement, sometimes called a three-way chart, sets each limit from the variation it is meant to judge. It is the batch-process version of Chapter 2's rule: group what should be alike and compare what might differ.

## The moving range chart

The moving ranges can also be charted, with an upper limit of 3.267 MR̄, to watch for changes in short-term variability. For SP-12's twelve batches that limit is 2.762 HRC, and the largest moving range, 2.10 HRC, is inside it. Many practitioners leave the moving range chart out, because successive moving ranges share a reading and are correlated, which makes its signals harder to interpret, and because a jump large enough to signal there usually shows on the individuals chart too. SP-12's procedure plots it but acts only on a signal confirmed by a cause in the batch records.

## Run rules on an individuals chart

Because single readings are noisy and the chart is slow to react, run rules earn their keep on an individuals chart more than on an X̄ chart. A run of eight batches on one side of the centre line is a sign that the heat treatment's mean has moved, even if no batch is beyond a limit; a run of six steadily rising or falling batches suggests a drift, such as quench oil ageing between changes. The same caution applies as in Chapter 2: each rule adds false alarms, so a small set of rules agreed in advance is better than reacting to every pattern the eye finds. SP-12's procedure uses beyond-limits and eight-on-one-side for hardness, and reviews the quench oil temperature chart whenever either fires.

The tool handles twelve readings at a time, which suits a quick check of the latest batches. For a baseline of 20 to 25 readings or more, the same formulas can be applied in a spreadsheet: the mean, the moving ranges, MR̄ ÷ 1.128, and limits at three times that either side. The tool then serves as a check on the spreadsheet for the most recent twelve.

## Measurement matters more

With one reading per batch, the measurement's own scatter is a larger share of what the chart sees. A Rockwell hardness test has a repeatability of a fraction of a point on a well-maintained tester, and a single test on a single spool also samples the spool's own variation along its length. If the measurement's standard deviation were, say, 0.3 HRC against a process σ of 0.5 HRC, about a quarter of the variance on the chart would be measurement, by the variance sum rule of Chapter 1. Two practical steps follow: keep the tester calibrated and its test blocks current, and where the cost allows, test two spools per batch and chart their average, which halves the measurement's variance contribution and brings back a little of the averaging that individuals charts lack.

## Exercise: the next twelve batches

After the quench controller was repaired, the next twelve batches gave 58.4, 58.0, 58.7, 58.2, 57.9, 58.6, 58.3, 58.1, 58.8, 58.5, 58.2 and 58.6 HRC. Calculate the mean, the average moving range, σ̂ and the limits. Is any batch outside them, and how do the limits compare with the clean baseline of eleven batches above?

**Worked answer.** This is an illustration. The readings sum to 700.3, so the mean is **58.358 HRC**. The eleven moving ranges are 0.4, 0.7, 0.5, 0.3, 0.7, 0.3, 0.2, 0.7, 0.3, 0.3 and 0.4, summing to 4.8, so MR̄ = **0.4364 HRC** and σ̂ = 0.4364 ÷ 1.128 = **0.3868 HRC**. The limits are 58.358 ± 3 × 0.3868 = **57.198 to 59.519 HRC**. No batch is outside them; the highest, 58.8 HRC, is 0.72 HRC below the upper limit. The spread is smaller than the clean baseline's σ̂ of 0.505 HRC, which suggests the quench controller had been erratic for longer than the one bad batch showed. With 23 clean batches now available, the plant should combine them into a new baseline, as the tool recommends, rather than keep limits from eleven.
