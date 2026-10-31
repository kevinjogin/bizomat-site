---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: random-numbers-you-can-trust
order: 2
title: "Random numbers you can trust"
description: "How pseudo-random generators work, seeds and reproducible streams, turning uniform numbers into Gaussian ones with Box–Muller, testing a generator's spread and tails, and the shortcuts that fail."
draft: false
---

Every stochastic simulation rests on a stream of random numbers, and almost nobody looks at them. They come out of a library function or a spreadsheet cell, they look random, and the simulation is built on top. Most of the time that is fine, because the generators in modern software are good. But "most of the time" is not good enough for a model whose purpose is to estimate how often something unusual happens, because unusual outcomes depend on the tails of the random inputs and on the absence of hidden patterns among millions of draws. A few minutes spent testing the random numbers, and a few lines making them reproducible, prevent errors that are otherwise almost impossible to find.

This chapter explains what a pseudo-random generator is, how to make its output reproducible, how to turn uniform numbers into Gaussian ones, and how to test the result. Its error is a spreadsheet whose answers changed every time anyone typed in it.

## Pseudo-random numbers

A computer cannot produce genuinely random numbers without special hardware. What it produces instead are pseudo-random numbers: a deterministic sequence, calculated from an internal state that is updated at each call, designed so that the output passes every statistical test of randomness that matters for its intended use. The sequence is fixed by its starting state, the **seed**: the same seed always gives the same sequence. That is a feature, not a weakness, because it makes a simulation repeatable.

A generator for simulation work needs four properties.

- **Uniformity.** Each output, scaled to lie between 0 and 1, should be equally likely to fall anywhere in that interval.
- **Independence.** No output should be predictable from the ones before it by any simple pattern; successive pairs, triples and longer groups should fill their spaces evenly.
- **A long period.** Every generator eventually repeats. The period should be far longer than the total number of draws in the largest simulation. A generator with a period of 2³² ≈ 4.3 × 10⁹ sounds generous until a 100,000-day simulation of BT-1, which draws about 5,800 numbers a day, uses 5.8 × 10⁸ of them, more than an eighth of the period.
- **Reproducible streams.** It should be possible to start many independent streams, one for each simulated day or each random input, from different seeds without the streams overlapping.

Well-tested generators such as the Mersenne Twister, described in the references, or the newer generators provided by most numerical libraries meet all four. The default generators in older languages and some spreadsheets may not, and the default seeding, usually from the clock, defeats reproducibility.

## Seeds and streams for BT-1

The engineer organised the random numbers so that any simulated day could be re-run by itself. Day number i uses seed i, so day 4,817 can be regenerated exactly to look at what happened in it. Within each day, the process flow noise and the washdown arrival times draw from **separate streams**, seeded from the day number in different ways. The separation matters in Chapter 10: when comparing two designs, the engineer wants the same process flow and the same washdown times in both, so that differences in the results come from the design and not from different luck. If both inputs drew from one stream, changing the washdown rule would shift which numbers the process flow received, and the comparison would be muddied.

```figure
type: checklist
title: Random number housekeeping for a simulation
caption: None of these takes more than a few lines of code, and together they make every result traceable to the numbers that produced it.
- Use a well-tested generator with a long period | Far longer than the total number of draws.
- Seed every run explicitly | Record the seed with the results.
- Give each simulated day its own seed | So any day can be re-run alone.
- Give each random input its own stream | So changing one input does not reshuffle the others.
- Test the output once | Mean, spread, tails and correlation, as below.
- x Rely on clock seeding or volatile cells | The results cannot be reproduced or checked.
```

## From uniform to Gaussian

Generators produce uniform numbers between 0 and 1. The process flow noise needs Gaussian numbers with mean 0 and standard deviation 1, which are then scaled. The standard way to make them is the **Box–Muller transformation**: from two independent uniform numbers u₁ and u₂, it produces two independent standard Gaussian numbers

z₁ = √(−2 ln u₁) × cos(2π u₂)     z₂ = √(−2 ln u₁) × sin(2π u₂)

The transformation is exact, not an approximation: if u₁ and u₂ are truly uniform and independent, z₁ and z₂ are exactly Gaussian and independent. Only u₁ must be kept away from exactly zero, where the logarithm fails. Two equivalent alternatives are the polar method, which avoids the trigonometric functions, and the inverse of the normal distribution applied to a single uniform number, which is what NORM.S.INV(RAND()) does in a spreadsheet. Faster methods exist for very large simulations, but any of these is adequate for BT-1.

### A shortcut to avoid

An old shortcut adds twelve uniform numbers and subtracts 6. The sum has mean 0 and variance 12 × 1/12 = 1, and by the central limit theorem its distribution is close to Gaussian near the middle. It fails in the tails, which is where rare-event questions live: it can never exceed 6 in magnitude, and well before that its tails are too thin.

```figure
type: compare
title: Tail probabilities of the twelve-uniform shortcut against a true Gaussian
rowhead: Beyond
cols: True Gaussian | Sum of twelve uniforms minus 6 | Ratio
caption: Exact values for one tail. The shortcut is good to 2% at 2 standard deviations, a quarter short at 3, nearly four times short at 4 and useless beyond.
- 2 standard deviations | 0.0228 | 0.0223 | 0.98
- 3 standard deviations | 0.00135 | 0.00101 | 0.75
- 4 standard deviations | 3.17 × 10⁻⁵ | 8.5 × 10⁻⁶ | 0.27
- * 5 standard deviations | 2.87 × 10⁻⁷ | 2.1 × 10⁻⁹ | 0.007
```

Whether the thin tails matter depends on the system. The engineer ran 40,000 simulated days of BT-1 both ways. With Box–Muller, the discharge limit was exceeded on 5.39% of days; with the shortcut, on 5.17%, a difference well within sampling error. The tank does not respond to individual draws: its 43-minute time constant adds up the effect of hundreds of process-flow increments, and by the central limit theorem their sum is close to Gaussian whatever the shape of each one. A system that responded to single large draws, such as the trip of a fast-acting protection in a simulation of a noisy instrument signal, would be badly misled by the shortcut. There is no reason to take the risk; Box–Muller is as easy to write.

### Random times for events

Washdowns need a different transformation. In a Poisson process with a rate of r events per hour, the time between one event and the next follows an exponential distribution with mean 1 ÷ r. An exponential time is made from a uniform number u by t = −ln(1 − u) ÷ r. For BT-1's washdowns, at r = 0.25 per hour, u = 0.5 gives a gap of ln 2 ÷ 0.25 = 2.8 hours, the median; u = 0.1 gives 0.42 hours, about 25 minutes; and u = 0.9 gives 9.2 hours, longer than a production day. The formula uses 1 − u rather than u only so that a uniform generator that can return exactly zero never asks for the logarithm of zero. Chapter 8 builds the washdown schedule from these gaps and checks that their counts per day behave as the records do.

## Testing the output

Before the first production run, the engineer drew one million Gaussian numbers from the generator with Box–Muller and checked them against what a standard Gaussian should give.

```figure
type: compare
title: One million Gaussian draws against expectation
rowhead: Test
cols: Found | Expected | Verdict
caption: This is an illustration. Seed 2026. The counts beyond 4 and 5 standard deviations are small numbers and scatter like Poisson counts: 80 against an expected 63 is about two standard deviations of that scatter, and 3 against 0.6 is unusual but not alarming on its own. Repeating with other seeds gave 50 to 65 beyond 4, and 0 or 1 beyond 5.
- Mean | −0.0013 | 0, ±0.002 | Pass
- Standard deviation | 1.0010 | 1, ±0.0014 | Pass
- Correlation with the previous draw | 0.0008 | 0, ±0.002 | Pass
- Beyond ±2 | 45,768 | 45,500 | Pass
- Beyond ±3 | 2,738 | 2,700 | Pass
- Beyond ±4 | 80 | 63 | Within scatter
- Beyond ±5 | 3 | 0.6 | Repeated with other seeds
```

The expected counts beyond each level come from the normal distribution: the [normal distribution out-of-tolerance tool](/tools/normal-out-of-spec/), which gives the fraction outside lower and upper limits for a normal quantity with a stated mean and standard deviation, gives 4.55% beyond ±2 and 63.3 ppm beyond ±4 for a mean of 0, a standard deviation of 1 and limits at ±2 and ±4, with an expected count for any stated quantity.

### Testing independence

The correlation with the previous draw tests only one kind of dependence. Two further checks catch most of the rest. The first is a lag plot: plot each uniform draw against the next for a few thousand pairs, and the points should fill the unit square evenly with no lines, stripes or empty bands. Poor old generators show their structure immediately in such a plot, as regular lattices of points. The second is a uniformity count: divide the interval from 0 to 1 into, say, 100 equal bins, count a million draws into them, and compare the counts with the expected 10,000 each by a chi-square test; the statistic should be near its 99 degrees of freedom. Neither test proves a generator is good, since no finite test can, but a generator that fails either is certainly bad, and both take minutes.

### Testing the spread formally

A sample standard deviation of 1.0010 from a million draws is obviously close to 1, but in smaller test samples the question of how close is close enough needs a test. The [standard deviation chi-square check](/tools/standard-deviation-chi-square-check/) tests a sample standard deviation against a target value: from the sample size, the sample standard deviation, the target and a significance level it gives the chi-square statistic, the critical values, the p-value, a confidence interval for the true standard deviation and a decision. For a test sample of 10,000 draws with a standard deviation of 1.0081, against a target of 1 at 5% two-sided, it gives a statistic of 10,161.6 against critical values of 9,723.7 and 10,278.1, a p-value of 0.25 and a 95% interval of **0.994 to 1.022**: the spread is consistent with the target. The same tool checks, in Chapter 4, that the simulated process flow has the standard deviation the model intends.

The tool's own check, that the data should be normal, is the point of the tail counts above: the chi-square test of a standard deviation is sensitive to departures from normality, so it is a fair test of a Gaussian generator but not of, say, the twelve-uniform shortcut, whose thin tails would make it look slightly too consistent.

## The error: answers that changed when anyone typed

The first version of the BT-1 model was a spreadsheet: one row per 10-second step, 5,760 rows per day, with the process flow noise from NORM.S.INV(RAND()) in each row and a macro to repeat the day 2,000 times and count exceedances. The engineer reported an exceedance on 5.6% of days. A colleague reviewing the workbook corrected a typing error in a column heading, and the result on the summary sheet changed to 4.9%. Typing the heading back changed it again, to 5.3%.

RAND is a volatile function: every change anywhere in the workbook makes it draw new numbers in every cell, so every edit re-ran the simulation with different random numbers. The three answers were all honest estimates from 2,000 days each, and Chapter 6 shows that estimates of a 5% probability from 2,000 days scatter by about ±1 percentage point, so the differences were just sampling error. But nobody could reproduce any of them, the review could not check the reported 5.6%, and the colleague, reasonably, did not trust a model whose answer moved when a label was edited.

The model was rebuilt in a short script with a seeded generator, a seed per day and separate streams for the two inputs, as described above. Its answers were reproducible exactly, and the scatter between runs of different lengths could be measured rather than argued about. A spreadsheet can be made reproducible, by pasting random numbers as fixed values or using a seeded add-in, but a model that will be run thousands of times and reviewed is usually better as a short script.

## How this applies to a small Australian business

Whatever tool you simulate in, use its best available generator, seed it explicitly and record the seed with the results. Draw each random input from its own stream so that design comparisons see the same luck. Test the random numbers once against the distribution you intend, paying particular attention to the tails if the question is about rare events. Avoid shortcuts such as adding uniform numbers to imitate a Gaussian. And if a reviewer cannot reproduce your number exactly from your files, the review has not happened yet.

## Exercise: counting the draws

A simulation of BT-1 uses a 10-second step over a 16-hour production day, with one Gaussian draw per step for the process flow, plus on average eight uniform draws per day for washdown times. (a) How many draws does one day use? (b) How many does a 100,000-day run use? (c) What fraction of the period of a generator with period 2³² is that, and why does it matter?

**Worked answer.** (a) 16 × 3,600 ÷ 10 = 5,760 steps, each needing one Gaussian draw; Box–Muller makes two Gaussians from two uniforms, so that is **5,760 uniform draws** plus about eight more, roughly 5,770 a day. (b) **About 5.8 × 10⁸** for 100,000 days. (c) 5.8 × 10⁸ ÷ 4.3 × 10⁹ = **13%** of the period. With one stream per day seeded from the day number, different days' streams are segments of the same cycle, and with this much of the cycle used, some segments are likely to overlap, so some simulated days would quietly share their random numbers. A generator with a period many orders of magnitude longer, and a documented method for independent streams, removes the problem.
