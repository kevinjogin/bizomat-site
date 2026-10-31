---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: verify-validate-and-decide
order: 10
title: "Verify, validate and decide"
description: "Checking that a stochastic model is coded right and that it matches the plant, testing how much its answers depend on uncertain inputs, comparing design options fairly and reporting a decision."
draft: false
---

A simulation earns trust in three stages. **Verification** asks whether the code does what the model says: is the equation integrated correctly, are the random inputs what they claim to be? **Validation** asks whether the model describes the real plant well enough for the question: do its outputs match what the plant actually does? **Sensitivity** asks how much the answers depend on inputs that are not known exactly. Only after all three does the model have a right to inform a decision, and even then its answers should be presented with the uncertainty that each stage has revealed.

This chapter assembles BT-1's verification tests from the earlier chapters, validates the model against the tank's level log, measures its sensitivity to its uncertain inputs, compares the design options and sets out the recommendation. Its error is a validation that compared unlike days and nearly rejected a sound model.

## Verification: the exact cases

Every chapter of this book has included a test against a case with a known exact answer. Together they form the verification record of the model, and each one tests a different part of the code.

```figure
type: compare
title: BT-1's verification record
rowhead: Test
cols: Exact or expected | Simulated | Part of the code tested
caption: This is an illustration. Each test isolates one part of the model and compares it with a closed-form result. A model that passes all of them can still be wrong about the plant, which is what validation tests, but it is not wrong about its own equations.
- Gaussian generator, one million draws | σ = 1, 63 beyond ±4 | σ = 1.0010, 50 to 80 by seed | Random numbers, Chapter 2
- Blocked outlet, white noise, 30 min | σ = 0.167 m at every step | 0.166 to 0.170 m | Euler–Maruyama noise scaling, Chapter 3
- Process flow autocorrelation at 120 s | 0.368 | 0.368 | Exact Ornstein–Uhlenbeck update, Chapter 4
- Drain from 2.50 to 0.10 m, no inflow | 59.98 min | 59.98 min at 10 s | Heun's method and the outflow equation, Chapter 5
- Alarm to overflow, white noise | P(within 20 min) = 0.180 | 0.178 to 0.181, corrected | First-passage detection, Chapter 7
- Washdowns per day | mean 4.0, variance 4.0 | 4.02 and 3.98 | Event generator, Chapter 8
```

The record has a second use: it is a regression test. Whenever the model is changed, for a new option or a new input, the whole set is rerun, and any test that no longer passes points to the change that broke it.

## Validation: the model against the plant

Validation compares the model's outputs with the plant's. BT-1's level transmitter, LT-1, logs the level every 10 s, and the engineer had 40 production days of it, the same days whose inflow records were used to build the model. That is not a fully independent test, since the inputs were estimated from the same period, but it tests the parts of the model that were not fitted: the tank's response, the outflow equation and the way the inputs combine. The engineer compared three outputs.

- **Days with an exceedance.** The log shows the level above 1.85 m on 2 of the 32 full production days; the model predicts 5.3% of days, or about 1.7 in 32. Two is entirely consistent with an expected 1.7.
- **Mean daily maximum.** The log gives 1.47 m with a standard deviation of 0.21 m over the 32 full days; the model gives 1.50 m with 0.20 m.
- **The shape of the distribution.** The 90th percentile of the daily maximum is about 1.76 m in the log and 1.77 m in the model; the lowest daily maxima, around 1.0 m, are similar too.

### Testing the means

The [two-sample comparison tool](/tools/two-sample-t/) compares two means with Welch's t-test, which does not assume equal variances, and gives the difference, its standard error, the t statistic, the degrees of freedom, the two-sided p-value and a confidence interval for the difference. With the logged mean of 1.47 m, standard deviation 0.21 m and 32 days, against a separate 2,000-day validation run of the model with mean 1.497 m and standard deviation 0.202 m, at 5%, it gives a difference of −0.027 m with a standard error of 0.037 m, t = −0.72 on 32 degrees of freedom, a p-value of **0.48** and a 95% interval for the difference of **−0.10 to +0.05 m**. The model's mean daily maximum is consistent with the plant's. The tool's own check, that the samples should be independent, random and roughly normal, holds for daily maxima from independent days, though their distribution is a little skewed; with 32 days, Welch's test is robust to that.

The interval also says how good the validation is: the data cannot rule out a model error of up to about 0.1 m in the mean daily maximum. That is a property of having 32 days of plant data, not of the model, and it is part of what the report must say.

## The error: comparing unlike days

The first validation used all 40 logged days and gave a logged mean daily maximum of 1.41 m with a standard deviation of 0.23 m. Against the model's 1.497 m, the two-sample tool gave t = −2.37, a p-value of **0.023** and a 95% interval for the difference of −0.16 to −0.01 m: the plant's daily maxima were significantly lower than the model's. A reviewer suggested reducing the washdown flow in the model until it matched.

Before changing anything, the engineer looked at the logged days with the lowest maxima. Eight of the 40 were Fridays on which the plant had run a single shift, 8 hours instead of 16, with fewer washdowns and less time for them to stack. The model simulates 16-hour days. Comparing all 40 logged days with simulated full days compared unlike things, and the "significant difference" measured the half-days, not a fault in the model. With the 32 full days, the difference vanished, as above.

Tuning the washdown flow to fit would have been worse than useless. It would have made the model match an average of two kinds of day while describing neither, and lowered the predicted exceedances on full days, the days that matter. The rule is to make the simulated conditions match the logged ones before comparing, and when a model fails validation, to find out why before adjusting it. A parameter changed to force agreement hides the cause of the disagreement.

### Validating the inputs too

Output validation tests whether the pieces combine correctly. The inputs need their own checks, and BT-1's model had them from earlier chapters: the simulated process flow's spread and autocorrelation against FT-1's log in Chapter 4, and the simulated washdown counts and gaps against the line logs in Chapter 8. An input that matches its records and an output that matches the plant together give much more confidence than either alone, because a model can match its outputs for the wrong reasons, with two errors cancelling, and that is much less likely when each input has been checked separately.

### What the model leaves out

Every model omits things, and the report should list them so that a reader can judge whether any matters. BT-1's model leaves out:

- **Night-time flows.** Each simulated day starts at 0.82 m and covers 16 production hours. Cleaning crews on the night shift occasionally run large washdowns, which the model does not include.
- **Changes in the orifice.** Its discharge coefficient is taken as 0.62 throughout. Fats or solids building up on the plate would raise the level for a given flow; a partial blockage is a slow version of the fault in Chapter 7.
- **Rain.** BT-1 is roofed and its bund drains elsewhere, so rain does not enter it; a tank open to the weather would need rainfall events as another random input.
- **Production changes.** The inputs describe the present product mix and lines. A new filling line or a change in cleaning practice changes them, and the model with them.

None of these was judged to change the recommendation, but each is a reason to revisit the model if it changes, and the list tells the next engineer where to look first.

## Sensitivity: what the answers depend on

Every input to the model is an estimate from 40 days of records. The washdown rate, 4.1 a day from 163 washdowns, is uncertain by about ±16% at 95%, since a count of 163 has a standard deviation of about 13. The washdown flow, from flowmeter differences, is uncertain by perhaps ±7%. The process flow's standard deviation and correlation time are better known but not exactly. The engineer reran 20,000 days, with the same random numbers, changing one input at a time.

```figure
type: compare
title: Sensitivity of the exceedance probability to the model's inputs
rowhead: Input changed
cols: Lower value | Days with an exceedance | Upper value | Days with an exceedance
caption: This is an illustration. 20,000 days with common random numbers; base case 5.5%. The answer depends far more on the washdown inputs than on the sampling error of ±0.3 points, so improving those estimates is worth more than running longer.
- Washdown rate, ±15% | 3.4 a day | 3.6% | 4.6 a day | 7.7%
- * Washdown flow, ±10% | 2.7 L/s | 2.7% | 3.3 L/s | 9.9%
- Process flow σ, ±15% | 0.68 L/s | 4.3% | 0.92 L/s | 7.0%
- Process flow τc, ÷2 and ×2 | 60 s | 3.8% | 240 s | 9.7%
```

The exceedance probability roughly doubles or halves across the plausible range of the washdown flow, and moves nearly as much with the washdown rate and the process flow's correlation time. The sampling interval of a 100,000-day run, ±0.14 points, is negligible beside them. The sensitivity study therefore set the plant's next action on data: log each washdown's actual flow for a month with a clamp-on flowmeter, which would narrow the most influential input far more cheaply than any amount of extra simulation.

## Comparing the options

Three options were compared, each simulated over 100,000 days with common random numbers: the same process flow and the same washdown requests in each, so that the differences come from the options and not from luck. Because the answers are so sensitive to the washdown inputs, each option was also run under a pessimistic case, with the washdown rate 15% higher and the washdown flow 10% higher together.

```figure
type: compare
title: Design options for BT-1
rowhead: Option
cols: Days with an exceedance, base | Overflows, base | Days with an exceedance, pessimistic | Overflows, pessimistic | Other effect
caption: This is an illustration. Base case 100,000 days; pessimistic case 20,000 days with washdowns 15% more frequent and 10% larger. Overflow intervals assume 240 production days a year. Costs are indicative and exclude GST.
- Present tank and rules | 5.3% | 24, about 1 in 17 years | 13.3% | 33, about 1 in 2.5 years | none
- * Spaced washdown rule | 0.68% | 0, at least 139 years | 3.3% | 0 | 6.9% of washdowns held, 11.6 min on average; control change about A$6,000
- Tank 2.5 m in diameter | 0.28% | 0, at least 139 years | 1.2% | 0 | none in production; new tank about A$85,000
```

Under the base inputs, both changes cut exceedances by an order of magnitude and remove overflows from anything the simulation can detect. The spaced rule is far cheaper but costs production some waiting, and it is less robust: under the pessimistic inputs, its exceedances rise to 3.3% of days, while the larger tank's stay near 1%. Both options keep overflows at zero in the pessimistic runs.

### Comparing fairly

Common random numbers made these comparisons much sharper than independent runs would have. Because each option saw the same days, a day that was quiet for one option was quiet for all, and the differences between options were measured almost without sampling noise. That also means the results are paired, day by day, and a test of the difference should use the day-by-day differences, not two independent samples: an unpaired comparison of paired results throws away the precision the common random numbers bought.

## The recommendation

The engineer's report recommended the spaced washdown rule at once, because it is cheap, quick to implement and removes almost all of the present risk under the inputs as measured. It recommended logging the washdown flows and rates for three months, and reviewing the larger tank if the measured washdowns turned out at the pessimistic end, or if the planned fifth filling line went ahead. It stated the uncertainty plainly: the exceedance figures could be half or twice the values given, depending on inputs not yet measured precisely, and the overflow results rest on 100,000 simulated days, a rule-of-three bound and the agreement of three methods, not on plant experience.

### Saying "rare" without saying "never"

Rare-event results are easily misread. "No overflow in 100,000 simulated days" becomes "the tank cannot overflow" within one retelling. The report therefore gave every overflow result as an interval or a bound with its basis: "at least 139 years between overflows, at 95% confidence, from 100,000 simulated days", not "no overflows". It also translated the probabilities into the terms the plant thinks in: an overflow interval of 17 years means roughly a one-in-four chance of at least one overflow in a five-year period, which is a very different message from "once in 17 years" to a manager who expects to be in the job for five.

```figure
type: checklist
title: What a stochastic simulation report should contain
caption: A reader should be able to see what the model is, why it is trusted, what it depends on and how precise each answer is.
- The question and the decision it informs | Including what counts as acceptable.
- The model, its equations and inputs | With the data each input came from.
- The verification record | Exact cases, and the convergence of the time step.
- The validation | What was compared with plant data, and how closely it agreed.
- Each answer with its sampling interval | And the number of runs behind it.
- The sensitivity to uncertain inputs | Which inputs matter most, and how much.
- The options compared on the same random numbers | Including a pessimistic case.
- ? What would change the recommendation | The measurements or events that should trigger a review.
```

## How this applies to a small Australian business

Before acting on a simulation, list the exact cases it has passed, compare it with plant data under matching conditions, and rerun it with each uncertain input at the ends of its plausible range. Compare options on the same random numbers, and include a pessimistic case. Present the answers with both their sampling intervals and their sensitivity to inputs, and say what further data would most improve them. For anything regulated, such as a trade waste discharge, the simulation informs the plant's discussion with its utility or regulator; it does not replace their requirements or approval.

## Exercise: a validation with few events

After the spaced rule is introduced, the plant logs 60 full production days with no exceedance. (a) Under the model's base prediction of 0.68% of days, how many exceedances were expected in 60 days, and what is the chance of seeing none? (b) Under the pessimistic prediction of 3.3%, what is that chance? (c) What can the 60 days say about the two predictions?

**Worked answer.** (a) 60 × 0.0068 = **0.41** expected, and the chance of none is (1 − 0.0068)⁶⁰ = e^(−0.41) approximately = **66%**. (b) 60 × 0.033 = 1.98 expected; the chance of none is (1 − 0.033)⁶⁰ = **13%**. (c) Zero exceedances in 60 days is quite likely under the base prediction and somewhat unlikely, but far from impossible, under the pessimistic one. The data lean towards the base case without ruling out the pessimistic one; in rule-of-three terms, they bound the exceedance rate below 3 ÷ 60 = 5% of days at 95% confidence. Months more data, or the planned washdown flow log, would be needed to settle it, which is why the report tied the decision on the larger tank to measured inputs rather than to a short run of good days.
