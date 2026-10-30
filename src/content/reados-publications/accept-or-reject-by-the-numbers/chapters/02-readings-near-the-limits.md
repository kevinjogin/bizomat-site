---
book: accept-or-reject-by-the-numbers
chapterSlug: readings-near-the-limits
order: 2
title: "Readings near the limits"
description: "What a reading near a tolerance limit says about true size: the uncertainty budget tool, test uncertainty ratio, combining the reading with the process, and false accept and reject rates."
draft: false
---

Most measured parts are nowhere near their limits, and for them the gauge's uncertainty makes no difference: a bush reading 25.010 mm is inside a 25.000 to 25.021 mm tolerance however the gauge errs. The decisions that matter are the few readings close to a limit, where the gauge's error could put a good part's reading outside or a bad part's inside. For those readings, the question is not "is the reading in tolerance?" but "how likely is the true size to be in tolerance, given this reading?"

This chapter answers that question for BU-25's bore. It builds the air gauge's uncertainty budget with the WORKOS measurement uncertainty budget tool, shows how the reading combines with what the process distribution already says, tabulates the probability that a bush is truly oversize for readings near the upper limit, and counts how many bushes a shift the simple rule "accept if the reading is in tolerance" gets wrong. The error is a test uncertainty ratio taken as proof that the gauge's error does not matter.

## The gauge's uncertainty budget

A gauge's uncertainty is built from its contributors, each expressed as a standard uncertainty, a standard deviation, and combined by root-sum-square, the method of the Guide to the Expression of Uncertainty in Measurement. The [measurement uncertainty budget tool](/tools/measurement-uncertainty-budget/) does this for a dimensional measurement: it takes the gauge's calibration uncertainty, its resolution, its repeatability, any Abbe offset and tilt, the length measured, the part's expansion coefficient and the uncertainty of its temperature, and reports each contributor, the combined and expanded uncertainty, the test uncertainty ratio against the tolerance, and guard-banded acceptance limits inside the tolerance.

This is an illustration. The air gauge's calibration certificate gives an expanded uncertainty of 1.0 µm at k = 2, its display resolves 0.5 µm, and repeat readings on production bushes, which include each bush's small form errors, have a standard deviation of 1.0 µm. The plug sits in the bore with no Abbe offset. The bore is 25 mm long in steel with an expansion coefficient of 11.5 µm/m·K, and its temperature relative to the master is known to within ±0.5 K.

```figure
type: compare
title: The air gauge's uncertainty budget, from the WORKOS tool
cols: Standard uncertainty, µm | How it is derived
rowhead: Contributor
- Calibration | 0.500 | certificate's 1.0 µm at k = 2, divided by 2
- Resolution | 0.144 | 0.5 µm display step, divided by √12
- * Repeatability | 1.000 | standard deviation of repeat readings on production bushes
- Abbe error | 0.000 | no offset between the plug and the bore
- Temperature | 0.083 | 25 mm × 11.5 µm/m·K × 0.5 K, as a rectangular limit, divided by √3
- Combined | 1.130 | root-sum-square of the above
- Expanded, k = 2 | 2.26 | the combined uncertainty doubled
caption: This is an illustration. Repeatability dominates the budget. The tool also reports a test uncertainty ratio of 21 ÷ (2 × 2.26) = 4.64, above its default minimum of 4.
```

The test uncertainty ratio, the tolerance band divided by twice the expanded uncertainty, is 4.64. A common rule of thumb asks for at least 4, and many shops stop at that: the gauge is "good enough". The rest of the chapter shows what a ratio of 4.64 still means for decisions near the limit.

## Reading and truth

A gauge reading is the true size plus an error. With the budget above, the error has a standard deviation of 1.13 µm: about two in three readings are within 1.13 µm of the true size, and about 95% within 2.26 µm. A bush whose true bore is 25.0205 mm, half a micrometre inside the upper limit, will read above 25.021 mm about a third of the time; a bush at 25.0215 mm, half a micrometre outside, will read inside the limit about a third of the time.

That is the view from the part: given its true size, what will it read? Inspection needs the opposite view: given the reading, what is the true size? The answer depends on the reading and on the process, because the process says which true sizes are common. BU-25's bores are spread around 25.0125 mm with a standard deviation of 3.5 µm. A reading of 25.021 mm could come from a bush at 25.022 mm read low or from a bush at 25.020 mm read high, but bushes at 25.020 mm are about four times as common in this process as bushes at 25.022 mm, so the second explanation is the more likely.

## Combining the reading with the process

When both the process distribution and the measurement error are normal, Bayes' rule has a neat result. The true size, given the reading, is also normally distributed. Its mean is a weighted average of the reading and the process mean, and its spread is smaller than either the process spread or the measurement error alone.

```figure
type: formula
title: True size given a reading, normal process and normal error
formula: Weight on the reading w = σp² ÷ (σp² + σm²)
formula: Best estimate of true size = w × reading + (1 − w) × process mean
formula: Remaining uncertainty = √(1 ÷ (1/σp² + 1/σm²))
caption: For BU-25, σp = 3.5 µm and σm = 1.13 µm, so w = 0.906: the best estimate moves 9.4% of the way from the reading back towards the process mean of 25.0125 mm, and its remaining uncertainty is 1.075 µm.
- σp | process standard deviation, from the capability study
- σm | measurement standard uncertainty, from the budget
- w | how much the reading is trusted relative to the process
```

The pull back towards the process mean is called shrinkage. It is small when the gauge is much better than the process spread, as here, and large when the gauge is poor. A reading of 25.021 mm, exactly at the limit, gives a best estimate of 25.0202 mm: the bush is more likely inside the limit than outside. JCGM 106, the metrology guide to conformity assessment, sets out this approach, which it describes as using prior knowledge of the measured quantity.

## How likely is a bush oversize?

From the distribution of the true size given the reading, the probability that the bore is truly above 25.021 mm follows directly.

```figure
type: compare
title: Probability that a BU-25 bore is truly oversize, given the air gauge reading
cols: Best estimate of true size, mm | Probability truly above 25.021 mm
rowhead: Reading, mm
- 25.0190 | 25.01839 | 0.75%
- 25.0195 | 25.01884 | 2.2%
- 25.0200 | 25.01929 | 5.6%
- 25.0205 | 25.01975 | 12.2%
- * 25.0210 | 25.02020 | 22.8%
- 25.0215 | 25.02065 | 37.3%
- 25.0220 | 25.02110 | 53.8%
- 25.0230 | 25.02201 | 82.6%
caption: This is an illustration. Process mean 25.0125 mm, standard deviation 3.5 µm; measurement standard uncertainty 1.13 µm. A reading at the limit has only a 23% chance of being truly oversize; a reading 1 µm over has a 54% chance.
```

Two results stand out. A bush that reads exactly at the limit has only a 22.8% chance of being oversize, not the 50% that a naive "it could be either way" would suggest, because the process makes undersize-of-limit bushes more often than oversize ones. And a bush that reads 1 µm over the limit is barely more likely bad than good. A rule that rejects every reading above 25.021 mm therefore rejects many good bushes near the line, while a rule that accepts every reading at or below 25.021 mm still accepts bushes with up to a 23% chance of being oversize.

Ignoring the process, treating every true size as equally likely, would give 50% at the limit and 81% at 1 µm over. The difference is the value of the prior: it is information about the bush that the gauge did not provide, and it is free. It also explains a pattern inspectors often notice without being able to account for: re-measured borderline parts tend to come back slightly further inside the limit than their first reading, because the first reading was more likely high than low.

## Counting the wrong decisions

The table describes single bushes. The shift's totals come from combining it with how often each reading occurs. Integrating over the process distribution and the gauge error gives the expected number of wrong decisions per shift for the rule "accept if the reading is between 25.000 and 25.021 mm".

```figure
type: stats
title: Decisions per shift of 2,000 bushes, accepting readings within the tolerance
caption: This is an illustration. Calculated by integrating over BU-25's bore distribution and the air gauge's error. Costs at A$400 per escape and A$6.50 per false reject, excluding GST.
- 15.5 | bushes truly out of tolerance
- 3.54 | out-of-tolerance bushes accepted: escapes
- 9.59 | good bushes rejected
- A$1,416 | cost of escapes per shift
- A$62 | cost of false rejects per shift
- A$1,478 | total cost of wrong decisions per shift
```

The simple rule lets about 3.5 out-of-tolerance bushes a shift through, almost a quarter of all the bad bushes, and at A$400 each they dominate the cost. Almost all are barely oversize: of the escapes above the upper limit, 87% are within 1 µm of it and 99% within 2 µm, bushes the gauge reads just inside the limit. Whether a bush 1 µm oversize actually harms the customer depends on the fit it makes with its mating rod, which is a design question rather than an inspection one; *Fits That Work* covers how such fits are chosen. For inspection, the drawing is the contract, and an oversize bush is a nonconforming bush, however slightly it misses. The 9.6 false rejects are cheap by comparison. A ratio of 60 to 1 between the costs means that the acceptance limit should sit inside the tolerance, accepting a few more false rejects to cut escapes, and Chapter 3 finds where.

## Separating the process spread from the gauge

The prior needs the process's true spread, and the obvious way to get it, a capability study measured with the same air gauge, gives something slightly different: the spread of the readings, which includes the gauge's error. Because independent errors add as variances, the observed spread is the square root of the true process variance plus the measurement variance.

This is an illustration. BU-25's capability study measured 125 bushes on the air gauge and found a standard deviation of 3.68 µm. Subtracting the gauge's contribution gives √(3.68² − 1.13²) = 3.50 µm, the process's own spread used throughout this book. The difference looks small, but it matters at the tails: with a standard deviation of 3.68 µm instead of 3.50, the predicted fraction above 25.021 mm would rise from 0.76% to about 1.0%, and every probability in the table above would shift.

The correction works only when the gauge's error is well known and noticeably smaller than the observed spread. If the gauge contributes most of the observed spread, subtracting it leaves a number dominated by the uncertainty of both, and the capability study should be repeated with a better gauge. A useful rule is that the measurement standard uncertainty should be no more than about a third of the observed process standard deviation for the correction to be trusted; here it is 1.13 ÷ 3.68 = 0.31, just inside. Chapter 4 returns to how a gauge study measures the gauge's own contribution.

## When the prior matters most

The pull of the process prior depends on how the gauge compares with the process. When the gauge is much better than the process spread, the weight on the reading is close to 1, the prior hardly changes the estimate, and the probability of being out of tolerance rises sharply around the limit. When the gauge is poor relative to the process, the weight falls, the estimate is pulled strongly towards the process mean, and readings well outside the limit may still be more likely good than bad. A process running well inside its tolerance gives a strong prior in favour of every part; a process running close to a limit, like BU-25's oversize side, gives a strong prior that some parts near that limit are bad.

Two practical consequences follow. First, a process improvement changes the meaning of every reading: if BU-25's mean were centred at 25.0105 mm, a reading of 25.021 mm would be less likely oversize than it is now. Acceptance limits worked out with a prior must be revisited when the process changes. Second, the prior is only valid for parts that came from the process it describes. A bush from a new set-up, or from the other lathe if it runs differently, needs its own prior. Using the wrong prior is worse than using none, because it gives false confidence in exactly the parts that need the most care. The related chapter of *Inspecting to the Drawing*, [Decide near the limits](/reados/publications/inspecting-to-the-drawing/decide-near-the-limits/), treats the measurement side of the same decision for a first-article inspection, where there is no process history to use.

## The error: a test uncertainty ratio taken as proof

This is an illustration. When the air gauge was bought, its test uncertainty ratio of 4.64 was recorded as satisfying the shop's rule of at least 4, and the acceptance limits were set at the tolerance limits. A year later, the cylinder maker returned a batch with a note that several bushes were oversize.

The quality engineer's investigation measured 40 bushes that had been accepted with readings above 25.019 mm on the bench gauge, whose uncertainty is a quarter of the air gauge's. Six were oversize by 0.5 to 2 µm. That was consistent with the calculation above: the rule accepts about 3.5 oversize bushes a shift, almost all of them from readings in the last two micrometres below the limit. The test uncertainty ratio had been taken as proof that the gauge's error did not matter, when it only showed that the error was small compared with the tolerance. With a process running close to the upper limit, a small error near that limit still decided the fate of many bushes. The correction, in Chapter 3, was a guard band chosen from the costs.

## Exercise: a better gauge

This is an illustration. A new air gauge has a combined standard uncertainty of 0.50 µm. A bush reads 25.0200 mm.

1. What is the weight on the reading?
2. What is the best estimate of the true size, and its remaining uncertainty?
3. What is the probability that the bush is truly above 25.021 mm? Compare it with the old gauge's 5.6%.

**Worked answer.**

1. w = 3.5² ÷ (3.5² + 0.5²) = 12.25 ÷ 12.50 = **0.98**.
2. Working in micrometres above 25.000 mm: best estimate = 0.98 × 20.0 + 0.02 × 12.5 = 19.85, so **25.01985 mm**. Remaining uncertainty = √(1 ÷ (1/12.25 + 1/0.25)) = √(1 ÷ 4.0816) = **0.495 µm**.
3. The bush is oversize if its true size exceeds 21.0, which is (21.0 − 19.85) ÷ 0.495 = 2.32 standard deviations above the estimate. The probability is about **1.0%**, against 5.6% with the old gauge. The better gauge narrows the uncertainty and leaves the estimate nearer the reading, so it is far more decisive near the limit.
