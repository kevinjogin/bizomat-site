---
book: blending-bulk-solids-by-the-numbers
chapterSlug: measuring-mixedness
order: 3
title: "Measuring mixedness: variance, Lacey's index and comparing blenders"
description: "Turn sample results into a measure of mixedness, compare it with the random limit, see why Lacey's index can mislead, and compare blend times or blenders with confidence intervals and an F test."
draft: false
---

A blend is judged by sampling it. A set of samples, each at the scale of scrutiny, gives a set of compositions, and their scatter says how well the blend is mixed. Turning that scatter into a decision, whether the blend is good enough, whether it needs longer, whether one blender is better than another, needs two things: a reference to compare it with, and an allowance for the fact that a handful of samples gives only an estimate of the true scatter.

This chapter uses Plant C's stabiliser premix to work through both. It calculates the premix's random-mixture limit, measures its mixedness after three blend times, shows why the most quoted mixing index nearly always looks excellent, and uses an F test to decide when more blending stops helping.

## The premix and its random limit

The premix is 20% stabiliser powder in polypropylene powder, made in 200 kg batches in a 500 L ribbon blender. The laboratory assays its stabiliser content on samples of 0.5 g, which is about the amount of premix that ends up in the 50 g of compound used for the compound's own stabiliser test. That makes 0.5 g the scale of scrutiny. This is an illustration.

The particles are not alike. The stabiliser powder has a median size of about 150 µm and a density of about 1,150 kg/m³, so a typical particle weighs π ÷ 6 × (150 µm)³ × 1,150 kg/m³ = **2.03 µg**. The polypropylene powder is coarser, about 600 µm, at 905 kg/m³: about **102 µg** a particle. Putting these into the random-mixture formula from Chapter 2, with p = 0.20 for the stabiliser:

σ_R² = 0.20 × 0.80 × (0.80 × 2.03 + 0.20 × 102.4) µg ÷ 0.5 g = **7.07 × 10⁻⁶**

so σ_R = 0.00266, or **0.27 percentage points** around 20%, a CV of 1.33%.

The bracket holds a lesson. The stabiliser is the component being measured, but the term that dominates is 0.20 × 102.4 µg from the coarse polypropylene particles, more than twelve times the stabiliser's 0.80 × 2.03 µg. When the minor component is not very minor, the size of the major component's particles matters too: a 0.5 g sample contains only about 3,900 polypropylene particles, and their count fluctuates.

## Measuring a batch

To find how long the premix needs, the plant ran a batch and stopped the blender after 5, 10 and 15 minutes, taking ten 0.5 g samples each time from ten fixed positions spread through the blender: near each end, the middle, the top and the bottom, by a sampling spear inserted from the top. Each was assayed for stabiliser.

```figure
type: compare
title: Stabiliser content of ten samples at three blend times
rowhead: Blend time
cols: Results, % stabiliser | Mean | Standard deviation s | s ÷ σ_R
caption: This is an illustration. σ_R = 0.266 percentage points for 0.5 g samples. At 5 minutes the scatter is 4.6 times the random limit; by 10 and 15 minutes it is close to it.
- 5 min | 21.6, 18.9, 19.4, 21.1, 20.8, 18.2, 19.9, 21.5, 18.7, 19.9 | 20.00 | 1.21 | 4.55
- 10 min | 20.3, 19.6, 20.1, 19.8, 20.5, 19.9, 20.4, 19.5, 20.2, 19.7 | 20.00 | 0.35 | 1.32
- * 15 min | 20.2, 19.7, 20.0, 19.8, 20.4, 20.1, 19.6, 20.3, 19.9, 20.0 | 20.00 | 0.26 | 0.97
```

The ratio s ÷ σ_R is the most useful single number. A value near 1 means the blend is as good as a random mixture of these particles can be. A value well above 1 means it is still partly segregated. At 5 minutes the premix is far from random; at 10 minutes it is within about a third of the limit; at 15 minutes it is at it.

### Planning a blend test

The test has to be planned so that its samples can show what they are meant to show. Plant C's procedure for a blend time study is set out below; most of its steps exist to stop the sampling from adding variation or hiding it.

```figure
type: steps
title: Plant C's blend time study for the premix
caption: This is an illustration. Fixed positions make results comparable between blend times; the sample mass is the scale of scrutiny; the random limit is calculated before the first sample is taken, so the results have something to be compared with.
- Calculate σ_R for the sample mass | 0.266 percentage points at 0.5 g
- Choose fixed sampling positions | ten, covering both ends, the middle, top and bottom
- Stop the blender at each blend time | 5, 10 and 15 minutes
- Take one sample at each position | by spear, the same depth and orientation each time
- Assay every sample | the same method and analyst, randomised order
- * Compare s with σ_R and with the specification | then test differences between times
```

Fixed positions also allow a second look at the data: whether the scatter has a pattern. If the samples near one end of a ribbon blender are consistently high and those near the other end low, the blender is moving material too slowly from end to end, and longer blending, a different fill level or a change of agitator may help. If the scatter has no pattern, the blend is behaving randomly at that time. In the premix data there is no consistent pattern by position at any of the three times.

## Lacey's mixing index

Lacey proposed a mixing index that puts the sample variance on a scale from 0 for a perfectly segregated blend to 1 for a random one:

M = (σ₀² − s²) ÷ (σ₀² − σ_R²)

where σ₀² = p (1 − p) is the perfectly segregated variance from Chapter 1. It is widely quoted, and it has a weakness that matters in practice. For the premix, σ₀² = 0.20 × 0.80 = **0.16**, while the sample variances are of the order of 10⁻⁴ to 10⁻⁶. At 5 minutes, with s = 0.0121 as a fraction, s² = 1.46 × 10⁻⁴ and

M = (0.16 − 0.000146) ÷ (0.16 − 0.0000071) = **0.9991**

At 10 minutes M = 0.99997, and at 15 minutes M = 1.0000. Every result rounds to 1. The index compresses all the practically important differences into the fourth or fifth decimal place, because the gap between a perfectly segregated blend and any reasonable blend is enormous compared with the gap between a reasonable blend and a random one.

```figure
type: compare
title: Two ways to report the same three samples
rowhead: Blend time
cols: Lacey index M | s ÷ σ_R | CV of samples
caption: This is an illustration. Lacey's index cannot distinguish a blend with 4.6 times the random scatter from a random one at three decimal places. The ratio to the random limit, and the CV against a stated tolerance, carry the information a decision needs.
- 5 min | 0.9991 | 4.55 | 6.05%
- 10 min | 0.99997 | 1.32 | 1.75%
- 15 min | 1.0000 | 0.97 | 1.29%
```

Lacey's index is useful for following the early stages of mixing, when s² is still a sizeable fraction of σ₀², and for comparing published studies. For deciding whether a production blend is good enough, the sample CV against the specification, and s against σ_R, are better.

## The error: a blend time cut on a Lacey index

This is an illustration. Before this study, a contractor had reviewed the premix process to save time and reported, from a single set of samples at 5 minutes, a Lacey index of 0.999 and the conclusion that the blend was "fully mixed at 5 minutes". The blend time was cut from 15 to 5 minutes. Over the following month, the compound's stabiliser content, measured by the quality laboratory on every lot, became noticeably more variable, and two lots failed the customer's oxidative stability test.

The engineer's review found the index had been computed correctly but read wrongly. A Lacey index of 0.999 is exactly what a blend with five times the random scatter gives, because σ₀² is so large. The samples' CV of 6% was the number that mattered: at 1% premix in the compound, a premix lot with ±12% stabiliser variation at two standard deviations passes that variation into the compound, slice by slice, as the premix feeder draws through the premix bag. The blend time was restored to 15 minutes while this study was run, and the contractor's report was annotated.

### The mean matters too

A blend can be uniform and wrong. If the weighing of the stabiliser into the batch was out by 3%, every sample would read about 19.4% with a tiny scatter, and a test that looked only at the scatter would pass it. The mean of the ten samples, with its confidence interval, checks the batch's overall content. At 15 minutes the mean is 20.00% with a standard deviation of 0.258; with 9 degrees of freedom the 95% t value is 2.262, so the mean is known to within 2.262 × 0.258 ÷ √10 = **±0.18 percentage points**. The batch's content is confirmed to about 1% of its value. At 5 minutes the same calculation gives ±0.87 percentage points, because the scatter is larger: an unmixed blend cannot even tell you its own average reliably.

## How sure is a sample standard deviation?

Ten samples give an estimate of the true standard deviation, not the true value. For samples from a normal distribution, (n − 1) s² ÷ σ² follows a chi-square distribution with n − 1 degrees of freedom, and the NIST/SEMATECH e-Handbook sets out the resulting confidence interval for σ:

s × √[(n − 1) ÷ χ²_upper] ≤ σ ≤ s × √[(n − 1) ÷ χ²_lower]

For n = 10, the 95% chi-square points with 9 degrees of freedom are 2.700 and 19.023, so the interval runs from 0.688 s to 1.826 s. At 10 minutes, with s = 0.35, the true standard deviation lies between **0.24 and 0.64 percentage points** with 95% confidence. The random limit, 0.27, is inside that range. Ten samples cannot tell a 10-minute blend from a random one, and they cannot rule out a blend 2.4 times worse than random either.

That width is a property of ten samples, and it is wider than most people expect. Halving it needs roughly four times as many samples. Chapter 10 returns to how many samples a blend test needs.

## Measurement error inside the scatter

The scatter of the results is not all blend. The assay itself has a repeatability, and independent sources of variation add as variances: the observed variance is the blend's variance plus the measurement variance. The laboratory's repeatability for the stabiliser assay, found by assaying the same well-mixed reference sample ten times, is a standard deviation of about 0.10 percentage points. This is an illustration.

At 15 minutes, the blend's own standard deviation is therefore √(0.258² − 0.10²) = **0.238**, a little below the observed 0.258, and at 10 minutes √(0.35² − 0.10²) = 0.335. The correction is small here because the assay is much better than the blend, contributing 15% of the observed variance at 15 minutes. When the two are similar it matters a great deal: a blend test with a poor assay can never show a blend to be better than the assay, and can make a good blend look bad. As a rule, the assay's standard deviation should be well under half the blend standard deviation you need to demonstrate; otherwise, improve the assay or average repeat assays before judging the blend.

## Comparing blend times with an F test

The practical question is when longer blending stops helping. Comparing two blend times means comparing two variances, and the [two-variance F test tool](/tools/two-variance-f-test/) does exactly that from summary statistics. It calculates the ratio of the sample variances, the critical values of the F distribution for the chosen significance level and test direction, the p-value and a confidence interval for the ratio of the standard deviations, and says whether the spreads differ.

```figure
type: compare
title: Does blending longer reduce the scatter?
rowhead: Comparison
cols: F, variance ratio | p-value | 95% interval for σ ratio | Tool verdict
caption: This is an illustration. One-sided tests at 5% significance, 9 and 9 degrees of freedom, rejection region above 3.18. Going from 5 to 10 minutes clearly helps; going from 10 to 15 minutes may or may not.
- 5 min against 10 min | 11.95 | 0.0005 | 1.72 to 6.94 | * sample 1 spread larger
- 10 min against 15 min | 1.84 | 0.19 | 0.68 to 2.72 | no evidence spreads differ
```

From 5 to 10 minutes the variance ratio is 11.95 with a p-value of 0.0005: the 10-minute blend is clearly more uniform. From 10 to 15 minutes the ratio is 1.84 with a p-value of 0.19: there is no evidence that the extra five minutes helped, though the interval for the ratio of standard deviations, 0.68 to 2.72, is wide enough that it might have. The tool's own check is worth repeating: the F test assumes roughly normal data and is not robust to outliers, so a single bad sample can produce a false difference. Plot the results before testing them.

The plant set the blend time at **12 minutes**: past the point where the data show a clear improvement, with a margin for batch-to-batch variation, and with a check every tenth batch, using ten samples, that s stays below 1.5 σ_R.

## How this applies to a small Australian business

Measure a blend's quality against two references: the specification the product must meet, and the random-mixture limit the particles allow. Report the CV and the ratio s ÷ σ_R rather than a mixing index close to 1. Use enough samples to know what you are looking at, and before deciding that a change has helped or done nothing, compare the variances with an F test and look at its confidence interval rather than at two numbers on a page.

Keep the raw results, not just the summary. Ten numbers per blend time, with their positions, cost nothing to store and let someone check a later conclusion, look for a pattern by position, or recompute the statistics if the sample mass or the assay changes.

## Exercise: a smaller sample

The laboratory proposes assaying 0.1 g samples of the premix instead of 0.5 g. (a) What is the random-mixture standard deviation at 0.1 g? (b) If the 15-minute blend's true standard deviation at 0.5 g is the random value, what CV should the plant expect at 0.1 g, and would the 12-minute blend look worse?

**Worked answer.** (a) σ_R² scales with 1 ÷ M, so at 0.1 g it is 7.07 × 10⁻⁶ × 5 = 3.54 × 10⁻⁵, and σ_R = 0.00595, or **0.59 percentage points**. (b) The CV would be 0.59 ÷ 20 = **3.0%**, against 1.33% at 0.5 g. The blend would look worse by a factor of √5 = 2.24 without having changed at all, because a smaller sample holds fewer particles. The specification and acceptance limits must say which sample mass they apply to.
