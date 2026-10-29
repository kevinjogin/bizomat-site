---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: measured-performance-and-sample-size
order: 6
title: "Measured performance: sample sizes for means and comparisons"
description: "A 95% interval for the BPU-5's usable energy from 12 DVT units, sample sizes for a mean and for a supplier comparison, and a 3-pack test that nearly cost A$85,000 a year."
draft: true
---

A pass-fail test records one bit per unit: it passed or it did not. Many of the things a development programme needs to know are quantities, such as how much energy the battery delivers, how hot the hottest cell gets or how long a charge takes, and a measured value carries far more information per unit tested than a pass mark. This chapter shows how to use that information: how to put a confidence interval on a measured mean, how many units are needed to estimate a mean to a stated precision, and how many are needed to compare two options fairly.

The running case supplies the data. The BPU-5's twelve DVT units were each discharged on a standard test, and their usable energy is compared with the 4.50 kWh claimed at concept. Earlier, a comparison of two cell suppliers on three packs each had suggested that the dearer supplier gave 2.7% more energy. The chapter works both, and shows how the second nearly committed the business to a cost it could not justify.

## Why a measurement beats a pass mark

[Pass-fail tests: what a small sample can and cannot show](/reados/publications/prototypes-and-simulation-by-the-numbers/pass-fail-tests-and-small-samples/) showed how weak a small pass-fail sample is: three passes from three trials support a lower 95% bound on reliability of only 0.368. Measured data are stronger for a simple reason. Each result says not only which side of a limit the unit fell but by how much, so a dozen measurements give an estimate of both the centre and the spread of the population, and from those an estimate of how many units would fall below any limit of interest.

This is an illustration. If the DVT energy test had been run as pass-fail against a limit of 4.40 kWh, the record would read "7 of 12 passed", and nothing more could be said. Recorded as numbers, the same twelve tests show that the mean is about 4.41 kWh, that units differ from one another by a standard deviation of about 0.06 kWh, and that the claim of 4.50 kWh is not met by the design as built. Each of those statements changes a decision; the pass count changes none.

The price is that the analysis now rests on a model of the spread, usually that results are roughly normal and independent. Twelve results cannot prove normality, but they can show gross departures, such as one unit far from the rest, and the methods below are not sensitive to modest departures when the question is about the mean.

## The DVT measurements

This is an illustration. All amounts are Australian dollars excluding GST. Each of the twelve DVT units, built with the 100 Ah cells, was charged to full, rested, and discharged at 3 kW at 25 °C ambient until the battery management system cut off, with the DC energy recorded by the test bay's logger. The results, in kWh, were:

**4.38, 4.45, 4.36, 4.47, 4.40, 4.33, 4.52, 4.41, 4.39, 4.44, 4.30, 4.46**

Their sum is 52.91 kWh, so the mean is 52.91 ÷ 12 = **4.409 kWh**. The sample standard deviation, which divides the sum of squared deviations by n − 1 = 11, is **0.0626 kWh**. The lowest unit gave 4.30 kWh and the highest 4.52 kWh; only one of the twelve reached the 4.50 kWh claim.

## A confidence interval for the mean

The mean of twelve units is itself uncertain, because a different twelve would give a slightly different mean. Its standard error is the standard deviation divided by the square root of the sample size: 0.0626 ÷ √12 = **0.0181 kWh**.

Because the standard deviation is estimated from the same twelve results, the interval uses Student's t distribution rather than the normal. For a two-sided 95% interval with 11 degrees of freedom, t(0.975, 11) = **2.201**. The half-width is 2.201 × 0.0181 = **0.040 kWh**, and the 95% confidence interval for the mean usable energy is

**4.409 ± 0.040 = 4.369 to 4.449 kWh.**

The claim of 4.50 kWh lies well outside it. Measured as a t statistic, the claim is (4.409 − 4.50) ÷ 0.0181 = **−5.03** standard errors from the observed mean, a distance that chance alone would very rarely produce with 11 degrees of freedom. The shortfall is 0.091 kWh, or **2.0%** of the claim. It is small, but Chapter 7 shows that 2% at the top of the energy budget matters when the question is whether the unit lasts a long site day.

Two cautions apply. First, the interval describes the mean of units built the DVT way, not the range of individual units. A 95% prediction interval for one further unit is wider: 4.409 ± 2.201 × 0.0626 × √(1 + 1/12) = 4.409 ± 0.143, or about **4.27 to 4.55 kWh**. Second, the interval covers only random variation. If the logger read 1% high, every result would be about 0.044 kWh high and the interval would be shifted by that amount without any sign in the data. The meter's calibration belongs in the test record for that reason.

```figure
type: range
title: DVT usable energy: twelve units, the mean's interval and the claim
caption: This is an illustration. Twelve DVT units with 100 Ah cells, 3 kW discharge at 25 °C. The 95% interval for the mean (4.369 to 4.449 kWh) does not reach the concept claim of 4.50 kWh.
min: 4.20
max: 4.60
unit: kWh
ticks: 4.20 | 4.30 | 4.40 | 4.50 | 4.60
- Twelve DVT units, lowest to highest | 4.30 | 4.52 | sd 0.0626 kWh
- Prediction interval for one more unit | 4.27 | 4.55 | 95%
- * 95% interval for the mean | 4.369 | 4.449 | mean 4.409 kWh
- Concept claim | 4.50 | 4.50 | outside the interval
```

## Unit-to-unit and measurement variation

The standard deviation of 0.0626 kWh mixes two sources: real differences between units, from cell capacity, wiring resistance and the battery management system's calibration, and the scatter of the test itself, from charge termination, rest time and ambient temperature. They matter for different decisions. Unit-to-unit variation is what customers experience and what the energy budget must cover; measurement variation is noise that makes every comparison need more units.

The way to separate them is to repeat the test on the same unit. Suppose, as an assumed value for illustration, that three repeat discharges of one DVT unit had a standard deviation of 0.02 kWh. Variances add for independent sources, so the unit-to-unit standard deviation would be √(0.0626² − 0.02²) = **0.059 kWh**. In this case the test is not the main source of spread, and tightening the procedure would not shrink the sample sizes below much. If the repeat scatter had been close to the total, the better investment would be in the test method, not in more units.

## How many units to estimate a mean

Before DVT, the test technician needed to say how many units the energy test should cover. The NIST/SEMATECH e-Handbook of Statistical Methods (section 7.2.2.2, "Sample sizes required") sets out the inputs: the confidence level, the precision wanted, and a planning value for the standard deviation. To estimate a mean within ±E at 95% confidence, the first approximation is

n = (z × σ ÷ E)²

where z = 1.96 for 95% two-sided. The only spread available before DVT came from the three EVT packs from each supplier, which gave standard deviations of 0.080 and 0.0917 kWh, so the team took **0.08 kWh** as a cautious planning value. To estimate the mean within ±0.05 kWh:

(1.96 × 0.08 ÷ 0.05)² = **9.83**, rounded up to **10** units.

Because the standard deviation will itself be estimated from the sample, the handbook's method then replaces z with t and repeats the calculation until it settles. Here it settles at **13** units. A DVT build of 12 sits between the two answers, which is close enough for the decision the test supports. With hindsight, the observed standard deviation of 0.0626 kWh would have given (1.96 × 0.0626 ÷ 0.05)² = 6.0, so **7** units by the first approximation and 9 with the t correction. A cautious planning value costs units; an optimistic one gives an interval wider than promised.

The arithmetic is quick, and the WORKOS [Sample Size to Estimate a Mean calculator](/tools/sample-size-mean/) reproduces it for any precision and confidence.

## Comparing two suppliers

A comparison of two means needs more units than an estimate of one, because both means are uncertain and the question is about their difference. The smallest difference worth detecting, δ, must be chosen first, from what the difference is worth; then the significance level α (the chance of declaring a difference that is not there) and the power 1 − β (the chance of detecting a difference of δ if it is there). For two groups of equal size with common standard deviation σ, the normal approximation gives, per group,

n = 2 × (z(1 − α/2) + z(1 − β))² × σ² ÷ δ²

With α = 0.05 two-sided (z = 1.96), power 0.90 (z = 1.2816), σ = 0.08 kWh and δ = 0.10 kWh:

2 × (1.96 + 1.2816)² × 0.0064 ÷ 0.01 = **13.45**, so **14** packs per supplier. A t-based calculation adds about one more.

Halving the difference to be detected quadruples the sample: for δ = 0.05 kWh the same formula gives 53.8, or **54** packs per supplier. That is the practical reason to set δ from economics rather than from curiosity. A difference that would not change the purchasing decision does not need to be detectable, and asking for one buys a test the business cannot afford.

```figure
type: formula
title: Sample sizes for a mean and for a two-group comparison
caption: This is an illustration. Planning standard deviation 0.08 kWh from the EVT packs; normal approximations, rounded up. The t correction adds a few units for a mean and about one per group for a comparison.
formula: n = (z × σ ÷ E)²
formula: n per group = 2 × (z(1 − α/2) + z(1 − β))² × σ² ÷ δ²
- z, E | 1.96 for 95% two-sided; E is the precision wanted on the mean
- σ | planning standard deviation, 0.08 kWh before DVT; 0.0626 kWh observed at DVT
- α, 1 − β | significance 0.05 two-sided; power 0.90, so z(1 − β) = 1.2816
- δ | smallest difference between suppliers worth detecting
step: Mean within ±0.05 kWh: (1.96 × 0.08 ÷ 0.05)² = 9.83, so 10 units (13 with t)
step: Suppliers, δ = 0.10 kWh: 2 × 3.2416² × 0.0064 ÷ 0.01 = 13.45, so 14 per supplier
step: Suppliers, δ = 0.05 kWh: 53.8, so 54 per supplier
```

## The error: a supplier choice made on three packs each

This is an illustration. At EVT, the lead electrical engineer had three packs built with cells from each of two shortlisted suppliers and ran the standard discharge on each. The results were:

- **Supplier A:** 4.33, 4.49, 4.41 kWh; mean 4.41, standard deviation 0.080.
- **Supplier B:** 4.45, 4.63, 4.51 kWh; mean 4.53, standard deviation 0.0917.

Supplier B's packs averaged 0.12 kWh more, **2.7%** above supplier A's. Supplier B's cells cost A$85 more per pack, and purchasing proposed switching on the strength of the result: at the year-1 volume of 1,000 units, a commitment of **A$85,000 a year**.

The DVT review asked for the uncertainty before approving the change. Welch's t-test, which does not assume equal variances, gives a standard error for the difference of √(0.080² ÷ 3 + 0.0917² ÷ 3) = 0.0702 kWh, so t = 0.12 ÷ 0.0702 = **1.708**, with about **3.93** degrees of freedom. The critical value at 95% two-sided is about 2.80, and the two-sided p-value is **0.164**. The 95% interval for the difference runs from **−0.076 to 0.316 kWh**: the data are consistent with supplier B being worse, the same, or much better. Six packs could not tell.

The same arithmetic run forward shows why. With σ = 0.08 kWh and three packs per group, the chance of detecting a true 0.10 kWh difference at α = 0.05 is at most about one in three, even before the t penalty for tiny samples. The test was not designed to answer the question it was used for.

The correction was the comparison the formula called for: **14 packs per supplier**, each tested by the same method on the same bay. The means were **4.41 kWh for A and 4.44 kWh for B**, a difference of **0.03 kWh**. With a standard deviation near the DVT value, the 95% interval on a difference from 14 packs each is about ±0.05 kWh, so the true advantage could be anything from nothing to about 0.08 kWh. At its observed value, 0.03 kWh is 0.7% of the pack's energy, for a price increase equal to 1.9% of the target unit cost of A$4,400. The business stayed with supplier A.

The comparison took 28 pack tests, run off the critical path. It saved a decision worth A$85,000 a year that rested on six numbers. The WORKOS [Process Change Trial calculator](/tools/process-change-trial/) carries out both halves of this work: the sample size per group for the smallest worthwhile difference, and the Welch test on the results.

```figure
type: compare
title: Two supplier comparisons on the same question
cols: 3 packs each (EVT) | 14 packs each (DVT)
caption: This is an illustration. The small test's 0.12 kWh difference was within its own noise. The comparison sized by the formula found 0.03 kWh, not worth A$85 a pack.
- Means, A and B | 4.41 and 4.53 kWh | 4.41 and 4.44 kWh
- Difference | 0.12 kWh (2.7%) | 0.03 kWh (0.7%)
- 95% interval on the difference | −0.076 to 0.316 kWh | about ±0.05 kWh around 0.03
- Chance of detecting a true 0.10 kWh | about one in three or less | 0.90 by design
- * Decision | switch to B, A$85,000 a year | stay with A
```

## Choosing the difference worth detecting

The most important input to a comparison is the one people skip: δ. In the supplier case it follows from money. A pack that delivers more energy is worth something only if the extra energy changes what customers can do, or allows a cheaper design elsewhere. If 0.10 kWh were the smallest gain that would justify A$85 a pack, the test should be powered to find 0.10 kWh, and 14 packs per supplier is right. If the business would switch only for 0.20 kWh, the same formula gives four packs per supplier, and the EVT test would nearly have been adequate.

The same thinking applies to any measured comparison in development: two fan models, two thermal pad materials, two inverter firmware settings. The engineer should write down, before testing, the smallest difference that would change the choice, the planning standard deviation and its source, and the resulting sample size. When the sample size is unaffordable, the honest options are to accept a larger δ, reduce the measurement noise, or decide on other grounds and say so. Testing a handful and treating the result as evidence is not one of them.

Comparisons also need fairness in how units are tested. The 14 packs from each supplier were tested in alternating order on the same bay, so that a drift in ambient temperature or meter calibration over the fortnight would affect both suppliers alike. Testing all of A in the first week and all of B in the second would have confounded the supplier with the week. Demonstrating the measured performance of something new raises the same questions at a larger scale: [Qualification testing: run length, feed envelope and yield basis](/reados/publications/first-of-a-kind-technology-by-the-numbers/qualification-testing/) in *First-of-a-Kind Technology by the Numbers* covers how long, and over what range of conditions, a new process must run before its measured output can be relied on.

## What the DVT energy result decided

The interval of 4.369 to 4.449 kWh, with a standard deviation near 0.06 kWh, became an input to the next model. The concept claim of 4.50 kWh was withdrawn from the product data, and the question it had been meant to answer, whether the unit lasts a site day on enough days, was handed to the simulation in [Monte Carlo in a spreadsheet: will the unit last the day](/reados/publications/prototypes-and-simulation-by-the-numbers/monte-carlo-for-the-working-day/), which uses a mean of 4.41 kWh and a standard deviation of 0.06 kWh. The shortfall itself, 2% against the claim, was not a design issue in isolation; whether it mattered depended on the spread of site demand, which the measurement could not show.

```figure
type: checklist
title: Before a measured result goes into a review
caption: Each item is a question the DVT review asked of the energy test or the supplier comparison.
- Method fixed and written down | charge, rest, 3 kW discharge at 25 °C, cut-off by the battery management system
- Meter calibration current | a 1% bias moves every result by about 0.044 kWh
- Mean reported with its interval, not alone | 4.409 kWh, 95% interval 4.369 to 4.449
- Smallest difference worth detecting stated before testing | 0.10 kWh for the supplier comparison
- Sample size from the formula, not from what was on hand | 14 per supplier, not 3
- Test order alternated between options | avoids confounding the option with the week
- x A difference declared from a handful of units | 0.12 kWh from 3 packs each, p = 0.164
```

## Exercise: tightening the estimate

For the PVT build, the product manager wants the mean usable energy estimated within **±0.03 kWh** at 95% confidence, using the DVT standard deviation as the planning value. How many units must be tested, and is the 30-unit PVT build enough?

**Worked answer.** With σ = 0.0626 kWh, n = (1.96 × 0.0626 ÷ 0.03)² = 16.7, so **17 units** by the first approximation. Replacing z with t and repeating the calculation raises the answer to about **20 units**, because the standard deviation will be estimated from the sample. Either way, the 30-unit PVT build is enough, and testing all 30 would give a half-width of about 2.045 × 0.0626 ÷ √30 = 0.023 kWh. Any change to the cells or the battery management system alters the population being measured, so the PVT units must be tested as built rather than inferred from the DVT data.
