---
book: blending-bulk-solids-by-the-numbers
chapterSlug: mixing-as-a-random-walk
order: 4
title: "Mixing as a random walk: how fast a blend approaches random"
description: "Mixing mechanisms, why the excess variance of a blend decays exponentially, how to fit the decay rate and predict a blend time, and what a dispersion coefficient says about a blender."
draft: false
---

Watch a blender from above and the motion looks purposeful: ribbons sweep material from end to end, paddles lift and drop it, a drum turns it over. Follow a single particle and the motion looks random: it is carried a little way, jostled, dropped somewhere else, carried again. Over many such steps each particle performs something close to a random walk through the blender, and a blend made of many particles doing random walks loses its initial pattern in a predictable way.

This chapter describes the three mechanisms by which particles mix, shows that they lead to an exponential decay of the blend's excess variance, fits that decay to Plant C's premix data, and uses the fit to predict a blend time. It also shows what happens when a target is set below the random-mixture limit: the fit predicts a time, and no blend ever gets there.

## Three mechanisms

Lacey distinguished three ways particles mix, and the distinction is still useful.

- **Convective mixing** moves groups of particles from one place to another: a ribbon carrying material along the trough, a paddle throwing a lump across, a drum turning a bed over. It mixes coarsely and quickly.
- **Diffusive mixing** moves individual particles short distances at random as the bed is sheared and dilated. It mixes finely and slowly, and it is the mechanism most like a random walk.
- **Shear mixing** slides layers past each other, stretching and thinning regions of different composition until diffusion can finish them off.

Every real blender uses all three in some proportion. A ribbon blender is mostly convective along its length and diffusive and shear across it; a tumbling drum mixes mainly by diffusion and shear in its moving surface layer. Whichever dominates, the result at the scale of scrutiny looks like the outcome of many small random steps.

## Why the variance decays exponentially

The random-walk picture leads to a definite prediction. Kadanoff's lectures, like most texts on statistical physics, show how a random walk on a lattice becomes the diffusion equation when the steps are small and many, and the [diffusion book's first chapter](/reados/publications/diffusion-by-the-numbers/diffusion-is-a-random-walk/) works the same idea for atoms in steel. Apply it to the composition of a blend in a closed vessel of length L. Any initial pattern of composition can be written as a sum of smooth waves, and the diffusion equation makes each wave fade exponentially, the long ones slowest. After a short time only the longest wave, about one blender length, is left, and the excess variance of the samples decays as

s²(t) − σ_R² = (s²(0) − σ_R²) × e^(−k t)

with a rate k = π² D ÷ L², where D is an effective dispersion coefficient for the blender, with units of m²/s. The excess over σ_R² decays; σ_R² itself, the random limit, is the floor the variance approaches but cannot pass.

Convective mixing is not diffusive, but its large-scale shuffling has the same effect on the samples: after the first few turns, each turn removes a roughly constant fraction of what is left of the pattern. That is why the exponential form fits data from most batch blenders, whatever their mechanism, once the first minute or two is past.

```figure
type: formula
title: Excess variance of a batch blend against time
formula: s²(t) = σ_R² + (s₀² − σ_R²) e^(−k t)     ln(s² − σ_R²) = ln(s₀² − σ_R²) − k t     k ≈ π² D ÷ L²
caption: The excess variance above the random limit falls by the same fraction every minute. Plotting its logarithm against time gives a straight line whose slope is −k. D is an effective dispersion coefficient and L the length over which composition must even out.
- s² | sample variance at blend time t
- σ_R² | random-mixture variance for the sample mass, Chapter 2
- k | mixing rate constant, per minute
- D | effective dispersion coefficient of the blender, m²/s
- L | length of the blender, the longest distance a pattern must cross
step: Premix: k = 0.662 per minute from the fit below; L = 1.5 m; D = 0.01103 s⁻¹ × 1.5² ÷ π² = 0.0025 m²/s
```

## Fitting the premix data

The plant ran a second premix study, stopping the blender after 2, 4, 6, 8, 10 and 12 minutes and taking ten 0.5 g samples each time. This is an illustration. The standard deviations were 3.24, 1.62, 0.90, 0.51, 0.35 and 0.29 percentage points. With σ_R² = 0.266² = 0.0707, the excess variances and their natural logarithms are:

```figure
type: compare
title: Premix mixing study, excess variance above the random limit
rowhead: Blend time
cols: s, percentage points | s² − σ_R² | ln(s² − σ_R²)
caption: This is an illustration. Ten 0.5 g samples at each time; σ_R² = 0.0707. The logarithm falls by about 1.3 every two minutes, a straight line.
- 2 min | 3.24 | 10.43 | 2.344
- 4 min | 1.62 | 2.554 | 0.938
- 6 min | 0.90 | 0.739 | −0.302
- 8 min | 0.51 | 0.189 | −1.664
- 10 min | 0.35 | 0.0518 | −2.960
- 12 min | 0.29 | 0.0134 | −4.313
```

A straight-line fit of ln(s² − σ_R²) against time gives the rate. The [linear calibration check tool](/tools/linear-calibration-check/) is designed for calibrating an instrument against reference standards, but at its core it is a least-squares straight-line fit with standard errors and an inverse prediction interval, which is exactly what is needed here. Entering the six blend times as the "reference values" and the six logarithms as the "readings", it gives:

- intercept **3.641** and slope **−0.662 per minute**, so k = 0.662 per minute, and the excess variance falls by a factor of e every 1.51 minutes;
- a residual standard deviation of **0.036** on the logarithms, with 4 degrees of freedom: the points lie very close to a straight line.

The tool's statistical tests of zero intercept and unit slope are meaningful for an instrument calibration and meaningless here, and its warning about "offset and gain" can be ignored. What it adds that a spreadsheet trendline does not is the inverse prediction: given a target reading, it finds the reference value, here the blend time, with a confidence interval.

## Predicting the blend time

The plant's acceptance criterion from Chapter 3 is s ≤ 1.5 σ_R, so s² ≤ 2.25 σ_R² and the excess s² − σ_R² ≤ 1.25 × 0.0707 = 0.0884. Its logarithm is **−2.426**. Entered as the new reading, the linear calibration check tool returns a blend time of **9.16 minutes**, with a 95% interval of **9.00 to 9.33 minutes**.

That interval covers only the uncertainty of the fitted line from these six points. Batch-to-batch variation in the raw materials, the fill level and the loading sequence add more, which is why the plant's chosen 12 minutes, from Chapter 3, keeps a margin of nearly three minutes over the predicted 9.2.

The fitted rate also gives the blender's effective dispersion coefficient. With k = 0.662 per minute = 0.0110 per second and the trough length L = 1.5 m, D = k L² ÷ π² = **0.0025 m²/s**. On its own the number means little, but it is a property of the blender and the material at this fill and speed, and it predicts how the blend time scales with the length of a larger blender of the same design, if D stays the same: k falls with L², so a blender twice as long needs four times as long to blend. Chapter 5 examines whether D does stay the same.

```figure
type: stats
title: What the premix mixing fit says
caption: This is an illustration. From the linear calibration check tool's straight-line fit of six points. The interval reflects the fit only, not batch-to-batch variation.
- 0.662 per min | mixing rate constant k
- 1.51 min | time for the excess variance to fall by a factor of e
- 9.2 min | predicted time to reach s = 1.5 σ_R, 95% interval 9.0 to 9.3
- 0.0025 m²/s | effective dispersion coefficient along the 1.5 m trough
```

## The first minutes and the loading pattern

The exponential model describes the blend after its first minute or two. Before that, the loading pattern dominates. If the stabiliser is tipped in as one layer on top of the polypropylene, the longest distance any stabiliser must travel is the full depth and length of the bed, and the early variance is close to the perfectly segregated value. If it is spread along the trough in several portions, or added in the middle of the polypropylene charge, the distances are shorter and the blend starts much closer to random. The rate constant does not change; the starting point does, and with it the time to reach a target.

Plant C's loading procedure puts half the polypropylene in first, then the stabiliser spread along the trough from three bags, then the rest of the polypropylene, with the ribbon running slowly during loading. The intercept of the fit, 3.641, corresponds to an extrapolated starting excess of e^3.641 = 38 square percentage points, a standard deviation of about 6.2 percentage points: far below the 40 points of a fully segregated 20% blend, because the loading had already done part of the job.

## When longer mixing makes things worse

The exponential model assumes the blender only mixes. Some blenders, with some materials, also unmix. A free-flowing blend whose components differ in size or density can segregate inside the blender, especially in tumbling blenders, where the moving surface layer sorts particles as a heap does. The variance then falls to a minimum and rises again, and the best blend time is a minimum, not a plateau. Long blending can also break fragile particles, generate fines, warm the material or build up static charge that makes fine particles cling to walls and to each other. Each of these changes the blend.

The premix's results at 15 and 20 minutes stayed at the random limit, so this blender and these powders show no sign of it. A blend time study should still extend past the chosen time to check, as Plant C's did: a curve that turns upwards after its minimum is a warning that the blend time must be controlled tightly and that the blend may also segregate after discharge, the subject of Chapters 6 and 7.

### What the dispersion coefficient depends on

The effective dispersion coefficient is not a property of the powder alone. It rises with the agitator's speed, falls as the fill level approaches the top of the ribbon, and depends on the particles' flowability: a cohesive powder moves in clumps that mix convectively but resist diffusion within each clump. That is why a blend time found for one fill level, speed and material does not transfer automatically to another.

## The error: a target below the floor

This is an illustration. A new customer for the stabilised compound asked for evidence that the premix was uniform to a CV of 1.0% or better. A technician, keen to help, took the first study's data, fitted ln s² against time, including the 15-minute point, and solved for s = 0.20, a CV of 1.0% at 20%. The fit predicted about 14 minutes. The blender was run for 15 and then 20 minutes. Neither result came below a CV of 1.3%.

The engineer saw two problems, one in the target and one in the fit. The target was impossible at the sample mass used: the random limit at 0.5 g is a CV of **1.33%**, and no amount of mixing can take a blend of these particles below it. The fit had hidden that, because it modelled ln s² as a straight line all the way down, as if the variance could fall to zero. Fitting ln s² without subtracting σ_R² also bent the line: with the 15-minute point included, the linear calibration check tool gave a slope of −0.398 instead of −0.662, a residual standard deviation of 0.63 instead of 0.036, and an interval of about ±4.8 minutes on its prediction, all signs that a straight line was the wrong model for those numbers.

```figure
type: compare
title: Two fits of the same premix data
rowhead: Fit
cols: What is fitted | Slope, per minute | Residual SD | Prediction
caption: This is an illustration. Subtracting the random limit straightens the data and gives a reliable rate. Fitting the raw variance assumes it can fall to zero, bends the line and predicts a time to reach a target the particles cannot reach.
- * Excess variance, 2 to 12 min | ln(s² − σ_R²) | −0.662 | 0.036 | 9.2 min to s = 1.5 σ_R
- Raw variance, 2 to 15 min | ln s² | −0.398 | 0.63 | about 14 min to s = 0.20, unreachable
```

The answer to the customer was not more mixing. At a 1 g sample the random limit is √(0.0707 ÷ 2) = 0.188 percentage points, a CV of 0.94%, so a 1.0% CV is just possible at 1 g, with no margin. At 2 g it is 0.66%. The plant offered evidence at 2 g samples, which better represents the premix content of the customer's test pieces anyway, and showed a CV of 0.8% at 12 minutes. If the customer had needed 1% at 0.5 g, the only route would have been a finer polypropylene carrier powder, which Chapter 9 discusses.

## How this applies to a small Australian business

A short blend time study, with samples at five or six times and the random limit calculated first, tells you three things: how fast your blender mixes this material, how long it needs to reach your criterion, and whether that criterion is achievable at all. Fit the logarithm of the excess variance, not of the raw variance, and treat any target below the random limit as a question about the particles or the sample size, not the blender.

Record the conditions with the result: fill level, agitator speed, loading pattern, material lots and the time the blender was stopped for each sample. A blend time is only valid for the conditions it was measured under, and a later change to any of them is a reason to repeat a short study rather than assume the old time still holds.

## Exercise: the half-full blender

A trial with the premix blender half full, 100 kg, gives standard deviations of 2.10 percentage points at 2 minutes and 0.62 at 6 minutes, with the same 0.5 g samples. Estimate the rate constant and the time to reach s = 1.5 σ_R, assuming the exponential model holds.

**Worked answer.** The excess variances are 2.10² − 0.0707 = 4.339 and 0.62² − 0.0707 = 0.3137. The rate is k = ln(4.339 ÷ 0.3137) ÷ 4 = ln(13.83) ÷ 4 = 2.627 ÷ 4 = **0.657 per minute**, almost the same as when full. Reaching an excess of 0.0884 from 0.3137 at 6 minutes takes a further ln(0.3137 ÷ 0.0884) ÷ 0.657 = 1.267 ÷ 0.657 = 1.93 minutes, so about **7.9 minutes** in all. The half-full blender starts better mixed after loading but mixes at the same rate. With only two points, the estimate has no measure of its own uncertainty; a real study would use more.
