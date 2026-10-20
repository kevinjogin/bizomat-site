---
book: fits-that-work
chapterSlug: use-statistics-without-losing-the-limits
order: 3
title: "Use statistics without losing the limits"
description: "Compare worst-case and statistical stacks, test distribution and correlation assumptions, and recognise why a drawing tolerance is not a standard deviation."
draft: true
---

A worst-case stack can look conservative when most production lies near the middle of each component tolerance. That observation may justify investigating a statistical model. It does not justify replacing the sum of tolerances with a square root and calling the assembly proven.

A statistical stack predicts variation under assumptions about populations and their relationships. The useful engineering question is whether those assumptions describe the parts that will actually be assembled, including changes between suppliers, batches, machines and time periods.

## Begin with a population model

Let H, C and S now represent varying component dimensions. The gap still follows G = H − C − S. Its mean is the mean housing span minus the two mean internal lengths. If the three variables are independent, its variance is the sum of their variances.

For this illustration only, assume each Revision A component is normally distributed, centred on its nominal dimension, and has a standard deviation equal to one-third of its drawing half-width. These are invented process assumptions. They cannot be inferred from the drawing.

| Input | Assumed mean | Assumed standard deviation |
|---|---:|---:|
| H | 60.00 mm | 0.060 / 3 = 0.020000 mm |
| C | 52.00 mm | 0.040 / 3 = 0.013333 mm |
| S | 6.00 mm | 0.030 / 3 = 0.010000 mm |

The predicted gap standard deviation is:

**sG = √(0.020000² + 0.013333² + 0.010000²) = 0.026034 mm**, approximately.

Three times this value is about 0.078102 mm. A mean-plus-or-minus-three-standard-deviations interval is therefore approximately **1.921898 to 2.078102 mm**. This is narrower than the worst-case interval of 1.87 to 2.13 mm, but it is a different kind of statement.

Normal distributions have unbounded tails. This model even permits some individual component sizes outside the drawing limits. If incoming inspection removes those parts, the accepted population is truncated and must be modelled accordingly. Neither the normal model nor its three-standard-deviation interval guarantees that every assembly conforms.

## Test the interpretation of a tolerance

Suppose instead that every value inside each component's drawing limits is equally likely, with independent uniform distributions. A uniform variable on a symmetric interval with half-width t has standard deviation t / √3. The gap standard deviation would then be:

**√((0.06² + 0.04² + 0.03²) / 3) = 0.045092 mm**, approximately.

The dimensions and limits have not changed. The statistical answer has changed because the assumed populations changed. This is why assigning “tolerance divided by three” automatically is not an innocent spreadsheet convention.

In the uniform model, all possible gap values still lie inside 1.87 to 2.13 mm. Three times the calculated standard deviation is approximately 0.13528 mm, slightly larger than the 0.13 mm physical half-width. A three-sigma interval is not a universal statement about possible values. Its interpretation depends on the distribution.

The purpose of this comparison is to expose assumptions, not to recommend uniform distributions whenever data are missing. When evidence is weak, retain the deterministic bounds and identify what data would make a probabilistic decision credible.

## Include correlation with the right sign

Independence is often convenient and sometimes wrong. Components machined on the same equipment, measured against a shared reference or selected from matched batches can vary together.

For the signed gap model, the full variance expression is:

**Var(G) = Var(H) + Var(C) + Var(S) − 2Cov(H,C) − 2Cov(H,S) + 2Cov(C,S).**

Covariance describes joint variation. Positive correlation between C and S increases gap variation because both lengths enter with the same negative sign. Positive correlation between H and C can reduce it because their signs are opposite. A reduction is legitimate only when the dependency is real, measured and maintained.

In the normal teaching model, assume only C and S have correlation 0.6. The additional variance is **2 × 0.6 × 0.013333 × 0.010000 ≈ 0.000160 mm²**. The resulting gap standard deviation is approximately **0.028944 mm**, and three standard deviations are approximately **0.086833 mm**.

This does not establish that correlation is 0.6 in any factory. It shows why a recorded assembly pairing and a source for the covariance matter. Randomly shuffling one column of data before calculation would destroy the pairing and change the answer.

## Separate centring from spread

A narrow process can be consistently in the wrong place. Suppose the housing mean shifts upward by 0.03 mm and the cartridge mean shifts downward by 0.01 mm, while the spacer mean remains unchanged. The mean gap becomes:

**60.03 − 51.99 − 6.00 = 2.04 mm.**

Its standard deviation need not change. Reporting only a smaller spread would hide the reduced upper-side margin. Tool offsets, cavity differences and thermal conditions can move means without producing dramatic scatter in a short sample.

Keep mean and variation estimates tied to the period and process conditions that produced them. A pooled dataset can be wide because several stable populations have different means. Alternatively, a pooled average can conceal a continuing drift. Examine sequence and groups before treating all observations as interchangeable.

## Use simulation to inspect a model

A simulation is useful for investigating nonlinear relationships, selection rules or mixed populations. It is not evidence that its input distributions are correct. Record the random seed, number of trials, units, distributions, dependencies and acceptance rule.

Check the code against a case with a known answer before trusting a complicated model. For the present linear normal case, the simulated mean and standard deviation should approach the analytical values as the trial count grows. An unexplained disagreement is a debugging signal.

Do not report a precise failure rate when no failures occurred in a finite run. Zero observed failures in a simulation or trial is not a proof of zero probability. A rare-event claim needs an appropriate statistical method and evidence about the model itself.

## Exercise: challenge a favourable result

A report says, “The stack is acceptable because RSS is 0.078 mm.” List the information missing from that statement.

At minimum, ask what RSS represents, which component standard deviations were used, how means were estimated, whether the inputs are independent, what distributional assumptions apply, which operating state was modelled, and what level of nonconformance is acceptable. Also ask whether inspection or selective assembly changes the input population.

For a numerical check, recalculate the mean gap after H increases by 0.02 mm and S increases by 0.01 mm. The mean increases by **0.01 mm**, because the contributions have opposite signs. A tighter statistical spread cannot compensate automatically for that shift.

Keep the deterministic and statistical results beside each other. The next chapter adds a physical effect that neither reference-temperature result has yet addressed.
