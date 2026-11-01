---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: how-many-runs
order: 6
title: "How many runs"
description: "Turning simulated days into estimates with confidence intervals: standard errors of means, intervals for probabilities and rare counts, run counts for a stated precision, and correlated output."
draft: false
---

A stochastic simulation produces estimates, not answers. Simulate 2,000 days of BT-1 and count the days with an exceedance, and the fraction is an estimate of the true probability, with a sampling error that would make another 2,000 days give a somewhat different count. The error is not a defect of the model; it is the price of estimating a probability by counting, and it can be calculated and reduced to any level by running more days. What cannot be tolerated is reporting an estimate without it, or misjudging its size by treating correlated outputs as independent.

This chapter calculates the precision of the three kinds of output BT-1's simulation produces, means, probabilities and rare counts, works out how many simulated days each needs, and shows how the number of runs grows as the event becomes rarer. Its error is a confidence interval calculated from correlated samples, which was ten times too narrow.

## Means

Each simulated day is independent of the others: it has its own seed and its own random inputs. Any quantity measured once per day, such as the daily maximum level, is therefore a set of independent values, and the ordinary rules of sampling apply. The mean of n values has a standard error of s ÷ √n, where s is their standard deviation, and an approximate 95% confidence interval of ±1.96 standard errors.

From 100,000 simulated days, BT-1's daily maximum level averaged **1.495 m** with a standard deviation of **0.199 m**. The standard error of the mean is 0.199 ÷ √100,000 = 0.00063 m, so the mean daily maximum is 1.495 m ± 0.0012 m at 95%: known to about a millimetre.

### How many days for a stated precision

Turned around, the same formula gives the number of days needed for a stated precision. The [sample size to estimate a mean](/tools/sample-size-mean/) tool calculates the number of measurements needed to estimate a mean within a margin E at 90, 95 or 99% confidence, from a standard deviation and, optionally, a finite population. With a standard deviation of 0.199 m, a margin of 0.005 m and 95% confidence, it gives **6,086 days**, using the normal approximation n = (1.96 × s ÷ E)². The tool's own check applies directly: the standard deviation must come from a pilot run or experience, which is the standard practice in simulation too. The engineer ran a pilot of 2,000 days, which gave a standard deviation of 0.202 m, close enough to plan from.

## Probabilities

The fraction of days with an exceedance is a probability estimated by counting. If the true probability is p and n days are simulated, the count of exceedance days is binomial, and the estimate p̂ = count ÷ n has a standard error of √(p(1 − p) ÷ n). From 100,000 days, 5,341 had an exceedance, so p̂ = 5.34%, with a standard error of √(0.0534 × 0.9466 ÷ 100,000) = 0.071 percentage points and a 95% interval of **5.20% to 5.48%**.

```figure
type: compare
title: Precision of the exceedance probability by number of simulated days
rowhead: Days simulated
cols: 95% interval half-width | Interval around 5.3%
caption: This is an illustration. Normal approximation to the binomial with p = 5.34%. The precision improves only with the square root of the number of days: a hundred times as many days for ten times the precision.
- 100 | ±4.4 points | 0.9% to 9.7%
- 1,000 | ±1.4 points | 3.9% to 6.7%
- 2,000 | ±1.0 point | 4.3% to 6.3%
- 10,000 | ±0.44 points | 4.9% to 5.8%
- * 100,000 | ±0.14 points | 5.20% to 5.48%
```

The row for 2,000 days explains the spreadsheet episode of Chapter 2: three runs of 2,000 days giving 5.6%, 4.9% and 5.3% were all well inside the ±1 point that 2,000 days allow. The row for 100 days is a warning: a short pilot run cannot distinguish a 2% problem from an 8% one.

### Relative precision and rare events

For rare events, the useful measure is the precision relative to the probability itself. The relative standard error is √((1 − p) ÷ (n p)), roughly 1 ÷ √(expected count). To estimate a probability to within ±10% at 95% confidence, the expected count must be about 400: n ≈ 400 (1 − p) ÷ p. For the exceedance, with p = 5.3%, that is about **7,000 days**. For the overflow, with a probability of about 2.4 × 10⁻⁴ per day, it is about **1.6 million days**.

```figure
type: bars
title: Simulated days needed for ±10% relative precision at 95% confidence
unit: days
caption: This is an illustration. n ≈ 400 (1 − p) ÷ p. The number grows in inverse proportion to the probability, which is why rare events need the methods of Chapter 9 rather than more of the same.
- Daily maximum above 1.6 m, p = 26% | 1,100
- Exceedance of 1.85 m, p = 5.3% | 7,100
- Daily maximum above 2.2 m, p = 0.32% | 125,000
- * Overflow at 2.50 m, p = 0.024% | 1,670,000
```

## Counts of rare events

When the count is small, the normal approximation fails and the Poisson distribution, which describes the count of rare independent events, gives the interval. From 100,000 days the simulation produced 24 overflow days. The exact 95% Poisson interval for a count of 24 runs from 15.4 to 35.7, so the overflow probability lies between **1.54 × 10⁻⁴ and 3.57 × 10⁻⁴** per production day. At 240 production days a year, that is an expected interval between overflows of between **12 and 27 years**, with a point estimate of 17 years. That is a wide interval from 100,000 days of simulation, and it is the honest one; Chapter 9 shows how to narrow it without simulating millions of days.

```figure
type: stats
title: BT-1's answers from 100,000 simulated days, with their precision
caption: This is an illustration. Heun's method, 10 s step, correlated process flow, Poisson washdowns. Each figure carries its 95% interval from the number of days simulated, not from any uncertainty in the model's inputs, which Chapter 10 considers separately.
- 1.495 ± 0.001 m | mean daily maximum level
- 5.34 ± 0.14% | days with an exceedance of 3.0 L/s
- 9.3 min | mean duration of one exceedance
- 12 to 27 years | expected interval between overflows
```

## The error: an interval from correlated samples

Before the 100,000-day runs, a colleague had estimated the fraction of time BT-1 discharges above 3.0 L/s from a single continuous simulated run of 30 production days, sampled every 10 s: 172,800 level values. The fraction of values above 1.85 m was 0.06%, and the colleague attached a binomial standard error of √(p ÷ n), which with n = 172,800 gave a relative error of about ±10% and a 95% interval of 0.049% to 0.073%. The figure went into a draft report as "0.061%, 95% interval 0.049% to 0.073%".

The interval was far too narrow. Values 10 s apart are not independent: once the level is above 1.85 m, it stays there for about 9 minutes on average, so the 106 values above the limit in those 30 days came from only about two exceedance episodes. The real information in the run was two episodes, not 106 independent samples, and an estimate based on two events has a relative error of the order of ±70%, not ±10%. The 100,000-day runs later put the true fraction of time at 0.061%, so the estimate happened to be close, but its stated precision was overstated about sevenfold, and a second 30-day run could easily have given half or twice the value.

The fix is to measure precision on independent units. Here that means the day: compute the time above the limit for each simulated day, and calculate the standard error of the mean daily time across days. For a single long run that cannot be divided into independent days, such as a simulation of continuous operation, the method of **batch means** does the same job: divide the run into batches much longer than the longest correlation time in the output, here several hours, compute the output for each batch, and treat the batch results as independent. The precision then comes from the number of batches, not the number of samples.

```figure
type: checklist
title: Reporting a simulated estimate
caption: Every number from a stochastic simulation is an estimate, and its precision is part of the result.
- Measure on independent units | Days with their own seeds, or batches longer than the correlations.
- Report a confidence interval with every estimate | From the standard error for means and probabilities, Poisson for rare counts.
- Size the run from a pilot | Use the pilot's spread to calculate the days needed.
- Aim for about 400 events | For ±10% relative precision on a probability.
- x Treat samples within a run as independent | The interval will be too narrow, often by many times.
```

## Percentiles

Some questions are about a level rather than a probability: what daily maximum is exceeded on only 1% of days? The answer is the 99th percentile of the simulated daily maxima, read from the sorted values. Its precision comes from the same binomial arithmetic, applied to ranks. Of n sorted values, the rank of the 99th percentile is 0.99 n, and the count of values below the true percentile is binomial with standard deviation √(n × 0.99 × 0.01). For 100,000 days that is √990 = 31 ranks, so a 95% interval for the percentile runs from the value at rank 98,938 to the value at rank 99,062. Reading those two values from the sorted list gives the interval directly, with no assumption about the shape of the distribution. For BT-1 the 99th percentile lies between 2.0 and 2.1 m, since 1.6% of days exceed 2.0 m and 0.7% exceed 2.1 m, and the rank interval narrows it to a few millimetres. The same method gives the interval on any percentile, and it is the right way to report a design level such as "the level exceeded on 1 day in 100".

## Deciding when to stop

It is tempting to run a simulation in batches and stop as soon as the interval looks narrow enough. That works if the stopping rule is set in advance on the width of the interval alone, but it biases the estimate if the decision is influenced by the estimate itself, for instance by stopping when the answer looks favourable. The safest practice is the one used here: run a pilot, calculate the number of days needed for the required precision, run that number, and report the result. If the result is then not precise enough, because the pilot's spread was optimistic, run a second, separately seeded batch of the size the first batch's spread calls for, and combine them.

## Sampling precision is not the whole uncertainty

A confidence interval from the number of runs measures only one source of uncertainty: the luck of the simulated days. It says nothing about whether the model's inputs are right. Chapter 4 showed that a 15% error in the process flow's standard deviation moved the exceedance probability from 5.5% to 7.0%, a change ten times wider than the sampling interval of 100,000 days. Once the sampling error is well below the effect of plausible input errors, further runs buy nothing, and effort is better spent on the inputs: a longer flow log, a check of the washdown rate, a sensitivity study. Chapter 10 reports both kinds of uncertainty side by side for exactly this reason.

## The precision of a difference

Design questions are usually comparisons: does option B reduce exceedances compared with option A? If the two options are simulated with independent random numbers, the standard error of the difference between their estimates is the square root of the sum of their squared standard errors. With 100,000 days each, an exceedance probability of 5.34% for the present tank and, say, 2.5% for an option has standard errors of 0.071 and 0.049 percentage points, so the difference of 2.8 points has a standard error of √(0.071² + 0.049²) = 0.087 points: the difference is known to within about ±0.17 points, and there is no doubt about it. A subtler option, changing the probability by a few tenths of a point, would be lost in that noise unless many more days were run, or unless the comparison used common random numbers, which cancel most of the shared luck and are the subject of Chapter 10's comparison.

## Making each run count for more

Running more days is not the only way to improve precision. Two techniques, both simple, are worth knowing. **Common random numbers**, introduced in Chapter 2, give two compared designs the same inputs, so their difference is estimated far more precisely than either value; Chapter 10 uses it. **Control variates** use a quantity whose exact mean is known, such as the average inflow over the day, to correct each day's output for its luck: a day with more inflow than average will tend to have a higher maximum level, and adjusting for that removes part of the scatter. Neither changes the expected answer; both reduce the number of days needed for a given precision.

## How this applies to a small Australian business

Decide before running a simulation how precise each answer needs to be, run a short pilot to estimate the spread, and size the main run from it. Report every estimate with its interval, calculated on independent units. Expect to need about 400 occurrences of an event to estimate its probability to within ±10%, and when that would take more simulated time than is practical, use the rare-event methods of Chapter 9 instead of a longer run. Keep the pilot's seeds separate from the main run's, so that the main result does not reuse the days that were used to plan it.

## Exercise: the time above the limit

From 100,000 days, BT-1 spent a total of 58,723 minutes above 1.85 m, in 6,342 separate exceedances. (a) What is the mean time above the limit per production day, and the fraction of the 16-hour day it represents? (b) What is the mean duration of one exceedance? (c) If the daily time above the limit has a standard deviation of 3.8 minutes across days, what is the 95% interval on the mean daily time?

**Worked answer.** (a) 58,723 ÷ 100,000 = **0.587 minutes a day**, which is 0.587 ÷ 960 = **0.061%** of the production day. (b) 58,723 ÷ 6,342 = **9.3 minutes**. (c) The standard error is 3.8 ÷ √100,000 = 0.012 minutes, so the 95% interval is 0.587 ± 0.024, **0.563 to 0.611 minutes a day**, about ±4%. That is much tighter than the colleague's 30-day estimate could support, because it rests on 100,000 independent days containing over 6,000 exceedances.
