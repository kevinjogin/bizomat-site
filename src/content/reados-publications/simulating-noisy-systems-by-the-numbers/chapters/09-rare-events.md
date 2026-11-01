---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: rare-events
order: 9
title: "Rare events"
description: "Estimating events that happen once in years: what zero events in a run can show, extrapolating along the tail, splitting runs at an intermediate level, and why a fitted normal tail misleads."
draft: false
---

The plant's second question was about overflows, and overflows are rare. Chapter 6 found 24 in 100,000 simulated production days, an expected interval of about 17 years with a 95% range of 12 to 27 years, and that took a hundred thousand days of simulation. For the spaced washdown rule of Chapter 8, the same 100,000 days produced no overflows at all. Neither result is satisfying: one is imprecise, and the other says only that overflows have become too rare to count. Simulating ten or a hundred times longer is one answer, and sometimes the right one, but there are cheaper ways to learn about events that a simulation rarely reaches.

This chapter sets out three of them: what can be concluded from zero events, how to extrapolate along the tail of a distribution, and how to concentrate simulation effort on the paths that are heading for a rare event. It also connects the shape of BT-1's tail to the physics of escape over a barrier. Its error is a tail fitted with a normal distribution, which put the overflow interval at nearly nineteen thousand years.

## What zero events can show

When a simulation of n independent days produces no events, the probability per day is not zero; it is merely small enough that n days did not catch one. A one-sided 95% upper bound on it follows from the Poisson distribution: no events in n trials is consistent with any probability up to about 3 ÷ n. This is the **rule of three** described by Hanley and Lippman-Hand in the references. For the spaced washdown rule, 100,000 days with no overflow give an upper bound of 3 × 10⁻⁵ per production day: at 240 production days a year, an expected interval between overflows of **at least 139 years**, at 95% confidence.

The same bound comes from the [MTBF confidence bounds](/tools/mtbf-confidence-bounds/) tool, which calculates confidence bounds on the mean time between failures for a constant failure rate from operating hours and failures in a time-terminated record, including the bound when no failures have occurred. Treating each simulated production day as 16 operating hours, 100,000 days are 1,600,000 hours; with no failures and 95% confidence, the tool gives a lower bound of **534,000 hours**, which is 534,000 ÷ 3,840 production hours a year = 139 years, and, against a requirement of, say, 100 years or 384,000 hours, the verdict that the requirement is demonstrated. The tool is written for equipment failures, but its arithmetic applies to any events that occur independently at a constant rate, which simulated days with independent seeds are.

The rule of three gives only a bound, not an estimate. It says the spaced rule makes overflows rarer than once in 139 years; it cannot say whether they are once in 200 years or once in 20,000. For the plant's purposes that may be enough. When it is not, the methods below estimate the probability itself.

## Extrapolating along the tail

The overflow level, 2.50 m, sits at the far end of the distribution of daily maximum levels. Levels a little lower are reached far more often: 1,622 of the 100,000 days exceeded 2.0 m, 316 exceeded 2.2 m. If the tail follows a regular shape, the frequent exceedances of lower levels can be used to extrapolate to the rare one.

For BT-1, the logarithm of the probability that the daily maximum exceeds a level L falls almost linearly with L above about 2.0 m, which is the signature of an exponential tail.

```figure
type: line
title: Chance that the daily maximum exceeds a level, log scale
x: Level, m
y: log₁₀ of the chance per production day
ymin: -4
ymax: 0
mark: 1.85 | discharge limit
caption: This is an illustration. 100,000 simulated days. Above about 2.0 m the points fall on a nearly straight line, falling by a factor of about 2.3 for each 0.1 m; a straight line through the four points from 2.0 to 2.3 m, all reached on 135 or more days, extrapolates to 2.6 × 10⁻⁴ at 2.5 m, against 2.4 × 10⁻⁴ counted directly.
- 1.6 | -0.58
- 1.7 | -0.83
- 1.8 | -1.13
- 1.9 | -1.45
- 2.0 | -1.79
- 2.1 | -2.14
- 2.2 | -2.50
- 2.3 | -2.87
- 2.4 | -3.21
- 2.5 | -3.62
```

A straight line fitted to the points from 2.0 to 2.3 m has a slope of −3.6 per metre and predicts a probability of **2.6 × 10⁻⁴** at 2.5 m, an overflow interval of about 16 years, close to the 24 counted directly. The four fitted points rest on at least 135 days each, so a run of a few tens of thousands of days could have made the same extrapolation. The method is only as good as the assumption that the tail's shape continues beyond the data, so it should be applied over a modest distance, a few times the spacing of well-counted points, and checked against direct counts wherever they exist.

### The physics of the straight line

Why should the tail be exponential? The source behind this book has a chapter on large fluctuations and the escape of a particle from a potential well, and the result it builds on, due to Kramers, is that a system pushed by noise over a barrier does so at a rate proportional to exp(−barrier ÷ noise intensity). The logarithm of the rate is linear in the barrier height. BT-1 has no potential well, but its rare high levels come from a similar mechanism: each extra 0.1 m of height needs roughly one more coincidence, another washdown arriving early or the process flow staying high a little longer, and each extra coincidence multiplies the probability by a roughly constant factor. A tail produced by stacking independent coincidences is close to exponential, which is why the straight-line extrapolation works here. A tail produced by a single smooth Gaussian disturbance, by contrast, falls like exp(−L²), much faster, and a straight line would overstate it.

## Splitting: spending effort on the paths that matter

Direct simulation wastes most of its effort: 98% of simulated days never come near 2.0 m, and they contribute nothing to the overflow estimate. **Splitting**, also called multilevel splitting, redirects the effort. Each day is simulated normally until it either ends or first reaches an intermediate level, here 2.0 m. Every day that reaches the intermediate level is then continued, from its exact state at that moment, many times over, each continuation with fresh random numbers for the rest of the day. The overflow probability is the product of two probabilities that are each much easier to estimate: the chance of reaching 2.0 m, and the chance of going on to 2.5 m from there.

```figure
type: formula
title: Splitting at an intermediate level
formula: P(overflow) = P(reach 2.0 m) × P(reach 2.5 m | reached 2.0 m)
caption: Each factor is estimated from many more events than the overflow itself. The state at the intermediate level, the level, the process flow and any washdowns running, must be saved and restored exactly, while everything that has not yet happened is drawn afresh.
- P(reach 2.0 m) | fraction of directly simulated days that reach 2.0 m
- P(reach 2.5 m given 2.0 m) | fraction of continuations from the saved states that reach 2.5 m
step: Typical run: 173 of 10,000 days reach 2.0 m, so P = 0.0173
step: 20 continuations each, 3,460 in all, of which 73 reach 2.5 m, so P = 0.0211
step: Estimate 0.0173 × 0.0211 = 3.7 × 10⁻⁴ per day
```

The engineer compared the two methods by repeating each six times with independent seeds, each repeat using 10,000 directly simulated days.

```figure
type: compare
title: Six repeats of a 10,000-day overflow estimate
rowhead: Method
cols: Estimates, × 10⁻⁴ per day | Mean | Scatter between repeats
caption: This is an illustration. Same model, independent seeds. Splitting at 2.0 m with 20 continuations per crossing costs about 15% more computing than direct simulation but roughly halves the scatter, the same gain as about three to four times as many direct days.
- Direct simulation | 6, 4, 3, 3, 1, 3 | 3.3 | ±1.6
- * Splitting at 2.0 m | 4.5, 3.5, 3.7, 4.2, 2.1, 2.3 | 3.3 | ±1.0
```

Splitting is not magic. Its gain depends on how much the fate of a path after the intermediate level depends on the state saved there: at BT-1, a day that reaches 2.0 m with a washdown still running is far more likely to overflow than one that reaches it at the end of a washdown, and the twenty continuations from one saved state share that starting advantage or handicap. More intermediate levels, say 1.9, 2.1 and 2.3 m, each with its own splitting, would reduce the scatter further. The general rule is that splitting pays when the rare event is reached by climbing through a sequence of less rare stages, which is exactly the situation in which the tail is exponential. The book by Rubino and Tuffin in the references covers splitting and its relative, importance sampling, in depth.

### Importance sampling, briefly

The other main family of rare-event methods changes the random inputs themselves. **Importance sampling** simulates with the inputs deliberately biased towards the rare event, for example washdowns arriving at twice their real rate, so that overflows become common, and then weights each simulated day by the ratio of its probability under the real inputs to its probability under the biased ones. The weighted average is an unbiased estimate of the real probability. Done well, it can reduce the effort by orders of magnitude; done badly, with a bias that overshoots, its weights become wildly variable and the estimate worse than direct simulation. It needs more care than splitting, and its weights must be derived correctly for every biased input, so it is best kept for problems where splitting does not help, such as an event that happens in one sudden step rather than by climbing through intermediate levels.

## Three estimates, one answer

The engineer now had three independent estimates of the present tank's overflow probability, made by different methods.

- Direct simulation of 100,000 days: 24 overflows, **2.4 × 10⁻⁴** per day, 95% interval 1.5 to 3.6 × 10⁻⁴.
- Straight-line extrapolation from 2.0 to 2.3 m: **2.6 × 10⁻⁴** per day.
- Splitting, six repeats of 10,000 days: mean **3.3 × 10⁻⁴** per day, with a standard error of the mean of about 0.4 × 10⁻⁴.

The three agree within their uncertainties, and together they put the expected interval between overflows at roughly 12 to 20 years. Agreement between methods with different weaknesses is the strongest evidence a rare-event estimate can have short of decades of plant records. Had they disagreed, the disagreement would have pointed to a fault: an extrapolation over a bend in the tail, a splitting state saved incompletely, or a direct run too short to trust.

## The error: a normal tail

Before any of this, a consultant engaged by the plant had estimated the overflow risk from a short simulation of 2,000 days. Too few to count overflows, the run gave the mean and standard deviation of the daily maximum, about 1.50 m and 0.20 m, and the consultant fitted a normal distribution to them. The overflow level is 5.05 standard deviations above the mean, and the normal tail beyond it is 2.2 × 10⁻⁷ per day: an overflow interval of about **19,000 years**. The report concluded that overflow was not a credible risk.

The error lies in the shape of the tail, not in the arithmetic. The daily maximum is not normally distributed: its upper tail, built by stacked washdowns, is roughly exponential, and an exponential tail lies far above a normal one at large distances. The engineer showed it with the 100,000-day results: at 2.2 m, the normal fit predicts 2.0 × 10⁻⁴ per day and the simulation counted 3.2 × 10⁻³, sixteen times more; at 2.4 m, the normal fit is too low by a factor of 225; at the overflow level, by more than a thousand.

```figure
type: compare
title: Normal fit against simulated tail of the daily maximum
rowhead: Level
cols: Simulated, 100,000 days | Normal with mean 1.495 m and σ 0.199 m | Simulated ÷ normal
caption: This is an illustration. The normal fit matches near the middle of the distribution and fails increasingly in the tail. Any estimate of a rare event that depends on the shape of a fitted distribution must check that shape where data exist.
- 1.7 m | 0.147 | 0.151 | 1.0
- 2.0 m | 0.0162 | 0.0056 | 2.9
- 2.2 m | 0.0032 | 0.00020 | 16
- 2.4 m | 0.00061 | 0.0000027 | 225
- * 2.5 m | 0.00024 | 0.00000022 | about 1,100
```

The general lesson is that the mean and standard deviation say almost nothing about a distribution's far tail. Any estimate of a rare event must rest on the tail itself: counted directly, extrapolated from levels near it where counts exist, or reached by splitting. A fitted distribution is acceptable only if its fit has been checked in the tail, at levels as close to the one of interest as the data allow.

## How this applies to a small Australian business

When a simulation produces no events of interest, report the rule-of-three bound rather than "never". When it produces a handful, report the Poisson interval and expect it to be wide. To do better, plot the logarithm of the exceedance probability against the level and extrapolate a short distance along a well-supported straight stretch, or split the simulation at an intermediate level. Never estimate a rare event from a mean and standard deviation alone. Where two methods are possible, use both, and treat agreement between them as the real test of the answer.

## Exercise: the bigger tank

A tank 2.5 m in diameter instead of 2.0 m was simulated for 100,000 days: 52 days exceeded 2.0 m, 12 exceeded 2.1 m, 2 exceeded 2.2 m and none reached 2.5 m. (a) What does the rule of three say about overflow? (b) What slope per metre do the counts at 2.0 and 2.1 m suggest, and roughly what would straight-line extrapolation to 2.5 m give? (c) How much weight would you put on the answer to (b), and why?

**Worked answer.** (a) No overflows in 100,000 days gives an upper bound of 3 × 10⁻⁵ per day, an interval of **at least 139 years** at 95% confidence, the same as for the spaced rule. (b) The counts fall from 52 to 12, a factor of 4.3 over 0.1 m, a slope of log₁₀ 4.3 ÷ 0.1 = −6.4 per metre. From 5.2 × 10⁻⁴ at 2.0 m, falling 6.4 decades per metre for 0.5 m, gives 5.2 × 10⁻⁴ × 10^(−3.2) ≈ **3 × 10⁻⁷ per day**, an interval of the order of 10,000 years. (c) **Little weight beyond its order of magnitude.** The slope rests on two counts, one of them only 12, and the extrapolation runs five times the spacing of the data; the larger tank's tail is also steeper, so the mechanism may differ. The safe conclusion is the rule-of-three bound, with the extrapolation as a sign that the true interval is probably much longer; splitting at 2.0 m would firm it up.
