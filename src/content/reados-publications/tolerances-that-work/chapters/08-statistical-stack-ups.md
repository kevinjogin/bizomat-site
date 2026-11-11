---
book: tolerances-that-work
chapterSlug: statistical-stack-ups
order: 8
title: "Statistical stack-ups and process capability"
description: "Use root-sum-square and simulation to estimate how often an assembly falls outside its limits, and see how part distributions, mean shifts and capability change the answer."
draft: false
---

The worst-case method asks whether any combination of conforming parts could fail. A statistical method asks a different question: how often will real combinations fail? For an assembly of several parts, the answer can be "almost never", even when the worst case fails, because it is unlikely that every part will sit at its least favourable limit at once.

That difference can save a great deal of manufacturing cost. It also carries a real risk, because the statistical answer is only as good as its assumptions about how the parts vary. This chapter explains the root-sum-square method, tests the revised Northgate design with it, and then uses simulation to show how quickly the answer changes when the assumptions are wrong.

## The root-sum-square method

If several independent dimensions are added together, the variance of the sum is the sum of their variances. When each dimension is normally distributed and centred in its tolerance, and its tolerance equals three standard deviations, the tolerance of the sum is:

**T = √(t₁² + t₂² + … + tₙ²)**

where each t is an equal bilateral tolerance multiplied by its sensitivity. This is the root-sum-square (RSS) formula. Under its assumptions, about 99.73% of assemblies fall within the mean ± T, the same proportion that falls within three standard deviations of a normal distribution.

RSS grows much more slowly than the worst-case sum as more links are added. Five equal tolerances of ±0.05 mm give a worst case of ±0.25 mm but an RSS result of ±0.112 mm.

## The revised Northgate design

Chapter 7 left Northgate with a revised design: housing dimension A = 41.80 ± 0.03 mm and spacer S = 16.00 ± 0.03 mm, with the supplier-controlled ring and bearings unchanged. Its worst case is −0.01 mm to 0.41 mm, failing narrowly at both ends of the 0.05 mm to 0.40 mm requirement.

The RSS calculation uses the same equal bilateral tolerances:

T = √(0.03² + 0.03² + 0.06² + 0.03² + 0.06²) = √0.0099 = **±0.0995 mm**

With the mean of 0.20 mm, the statistical range is **0.101 mm to 0.299 mm**, well inside the requirement.

If each tolerance really is three standard deviations, the standard deviation of the float is 0.0995 ÷ 3 = 0.0332 mm. The lower limit, 0.05 mm, is 4.5 standard deviations below the mean, and the upper limit is 6.0 standard deviations above. The normal distribution then predicts about **3 assemblies in a million** below 0.05 mm and effectively none above 0.40 mm. The [tolerance stack design tool](/tools/tolerance-stack-design/) in BIZOMAT Tools gives the same result: an RSS range of 0.101 to 0.299 mm, a float standard deviation of 0.0332 mm and predicted rejects of 0.0003%, when each part's capability index Cp is set to 1.0.

## Where the variation comes from

RSS also shows which parts matter. Each link's share of the total variance is its tolerance squared divided by the sum of squares:

| Link | ± tolerance | Share of variance |
|---|---|---|
| A, housing | 0.03 | 9.1% |
| t, ring | 0.03 | 9.1% |
| B1, bearing | 0.06 | 36.4% |
| S, spacer | 0.03 | 9.1% |
| B2, bearing | 0.06 | 36.4% |

```figure
type: stack
title: Share of float variance in the revised design
unit: % of variance
caption: The two bearings supply nearly three-quarters of the variance; tightening the housing or spacer barely helps.
- Bearing B1 | 36.4
- Bearing B2 | 36.4
- Housing A | 9.1
- Ring t | 9.1
- Spacer S | 9.1
```

The two bearings contribute almost three-quarters of the variance. Tightening the housing or spacer further would barely change the result. That is why the select-fit option in Chapter 7, which effectively removes most of the bearing variation, is so powerful. Variance contribution is the most useful single output of a statistical stack-up, because it tells you where to spend effort.

## RSS does not rescue a badly centred design

Consider the initial design again: mean float 0.35 mm, with A and S at ±0.05 mm. Its RSS tolerance is √0.0131 = ±0.1145 mm, giving 0.236 mm to 0.464 mm. Even statistically, the upper end exceeds 0.40 mm. With a standard deviation of 0.038 mm, the upper limit is only about 1.3 standard deviations above the mean, and roughly **9.5% of assemblies** would be predicted to have too much float.

The statistical method narrows the spread, but it cannot fix a mean in the wrong place. Centre the design first, then use statistics to judge the spread.

## The assumptions behind RSS

Every RSS result rests on assumptions that should be stated beside it:

1. **Independence.** The dimensions vary independently. Parts machined in the same set-up, or two bearings from the same production lot, may vary together.
2. **Normal distributions.** Each dimension is roughly bell-shaped. Machined dimensions affected by tool wear can be skewed or flat-topped; bought-in parts may have been sorted, leaving gaps or truncated distributions.
3. **Centred processes.** Each dimension's mean sits at the middle of its tolerance. In practice, machinists often aim towards maximum material to leave room for rework, so holes run small and shafts large.
4. **Tolerance equals three standard deviations.** This corresponds to a process capability index Cp of 1.0. A more capable process has a smaller spread; a less capable one has a larger spread and produces some parts outside tolerance.
5. **Enough parts.** Statistical averaging needs volume. For a handful of assemblies, any combination is possible.

When those assumptions do not hold, the predicted failure rate can be wrong by orders of magnitude.

## Testing the assumptions with simulation

A Monte Carlo simulation replaces the formula with direct sampling. For each simulated assembly, a value is drawn for every dimension from an assumed distribution, the gap is calculated and the result is recorded. After a large number of trials, the fraction of assemblies outside the limits is counted directly. Simulation can handle non-normal distributions, mean shifts, non-linear equations and correlated parts, which the RSS formula cannot.

This is an illustration. Northgate simulated the revised design, several million assemblies per case, under three sets of assumptions. The simulation used a simple random sampler with fixed starting seeds so that the results can be reproduced; rounded results are shown. In case 3, "half their tolerance" means half of ±0.03 mm, a shift of 0.015 mm on each part.

| Case | Assumptions | Mean float | Fraction outside 0.05 to 0.40 mm |
|---|---|---|---|
| 1 | All parts normal, centred, tolerance = 3σ | 0.200 | About 3 per million |
| 2 | Bearings and ring spread evenly across their whole tolerance; machined parts as case 1 | 0.200 | About 0.04%, or 430 per million |
| 3 | As case 2, with housing and spacer means each shifted by half their tolerance in the direction that closes the gap | 0.170 | About 0.87% |

Case 1 simply reproduces the RSS prediction. Case 2 uses a uniform distribution for the bought-in parts, a cautious assumption when nothing is known about how the bearing manufacturer's widths are distributed within its tolerance. The failure rate rises more than a hundredfold. Case 3 adds a modest and very common production habit, machining slightly off-centre, and the failure rate rises again to almost one assembly in a hundred.

```figure
type: stats
title: Simulated assemblies outside 0.05 to 0.40 mm, revised design
caption: Several million simulated assemblies per case. The answer moves by orders of magnitude with the assumptions, not the arithmetic.
- 3 ppm | Case 1 | all parts normal and centred
- 430 ppm | Case 2 | bearings and ring spread evenly across their tolerance
- *≈ 8,700 ppm | Case 3 | case 2 plus machined means shifted half a tolerance
```

None of these cases is "the answer". Together they show the range of plausible outcomes and the assumptions that drive them. That is the honest output of a statistical tolerance analysis.

## Allowing for imperfect processes

Two practical approaches help bridge the gap between ideal statistics and the workshop:

- **Inflate the RSS result.** A long-standing practice, often attributed to work by Arthur Bender in the 1960s, multiplies the RSS tolerance by a factor, commonly 1.5, to allow for shifts and non-normality. For the revised Northgate design, 1.5 × 0.0995 = ±0.149 mm, giving 0.051 mm to 0.349 mm. That just fits. The factor is a rule of thumb, not a law, but it gives a result between the optimism of pure RSS and the pessimism of worst case.
- **Specify capability.** If a statistical tolerance is used in design, the parts must be made by processes that justify it. That means requiring evidence such as a process capability index Cpk of at least 1.33 on the critical dimensions, which corresponds to the nearest tolerance limit being at least four standard deviations from the process mean. ASME Y14.5 provides a statistical tolerance symbol for this purpose, and the drawing can carry a note stating the capability requirement.

```figure
type: range
title: The same revised design under three methods
min: -0.05
max: 0.45
unit: mm
ticks: −0.05 | 0.05 | 0.20 | 0.40 | 0.45
caption: Inflated RSS sits between the optimism of pure RSS and the pessimism of worst case.
- *Requirement | 0.05 | 0.40
- Worst case | -0.01 | 0.41
- 1.5 × RSS | 0.051 | 0.349
- RSS | 0.101 | 0.299
```

Capability indices tie the stack-up to production data. Cp compares the tolerance width with six standard deviations; Cpk does the same using the distance from the mean to the nearer limit, so it also reflects centring. A supplier who reports Cpk values for the housing and spacer dimensions, and a bearing supplier who can describe its width distributions, together turn assumptions into evidence.

## Making the decision

Northgate now has a clear choice:

- **Revised design with statistical acceptance.** Likely failure rates between a few per million and under one per cent, depending on how well the machined parts are centred and how the bearings are distributed. Requires capability evidence for A and S, and preferably information about bearing width distribution.
- **Select-fit spacer.** Guaranteed to work on a worst-case basis, at the cost of assembly measurement and stocked spacer grades.

For a low-cost guide roller in moderate volumes, with a failure that is detected easily at assembly by checking float with feeler gauges, the statistical option with a capability requirement may be entirely reasonable. For a product where a failure would be hidden until it caused damage in the field, the select-fit option is the safer choice. The numbers inform the decision; they do not make it.

## The failure case: statistics without a capability requirement

This is an illustration. Northgate released the revised design on the strength of the RSS result. The housing and spacer drawings carried their size tolerances, but no capability requirement. Six months later the spacer moved to a new supplier, and the housing supplier changed its finishing tool for the groove.

The float check at assembly, a feeler gauge test on every unit, began to find units below 0.05 mm: three in the first 400. Measurements of the parts explained why. The new spacers averaged about 16.015 mm, and the housings' groove dimension A averaged about 41.785 mm. Both shifts were within tolerance, and both closed the gap. It was simulation case 3 in production. That case predicts about 0.87% of assemblies outside the limits, or about three or four in 400, which is what the assembly line found.

### How it is detected

Two signals pointed to the cause. The assembly float check showed a trend, not random scatter: the mean float fell from about 0.20 mm to about 0.17 mm. The parts were then measured against their mean, not just against their limits. A part inside tolerance can still break a statistical analysis if its mean has moved.

### How it is corrected

The drawings for A and S now carry a note requiring a process capability index Cpk of at least 1.33, with control chart evidence supplied with each delivery. The spacer supplier was asked to aim at the middle of the tolerance rather than the long end. The assembly float check stayed in place, because it detects the failure before a unit leaves the factory.

The Library book [Fits That Work](/reados/publications/fits-that-work/use-statistics-without-losing-the-limits/) goes further into correlation, mixed populations and how inspection changes the population a statistical model describes.

## Common mistakes

- **Using RSS for two or three parts.** With few links, the averaging effect is small and extreme combinations are not rare.
- **Ignoring bought-in part distributions.** Assuming that bearings or fasteners are normal and centred without evidence can hide the largest risk.
- **Reporting a failure rate without assumptions.** "3 ppm" means nothing unless the distributions and capability assumed are stated.
- **Using statistical tolerances on the drawing without capability requirements.** Then nothing obliges production to match the analysis.
- **Fixing spread when the mean is wrong.** Centre first.

## Questions to ask

- How many links are in the chain, and how many assemblies will be made?
- What evidence exists about the actual distributions and centring of each dimension?
- Which links dominate the variance, and is effort focused there?
- How sensitive is the predicted failure rate to plausible changes in assumptions?
- How would a failure be detected, and what would it cost?

## Exercise: the new spacer supplier's capability

The new spacer supplier sends control chart data for the spacer length, specified as 16.00 ± 0.03 mm: subgroups of five, a grand average X̄ of 16.012 mm and an average range R̄ of 0.012 mm. The drawing now requires Cpk of at least 1.33. Does the process meet the requirement? What would change if it were centred?

**Worked answer.** For subgroups of five, the standard constant d₂ is 2.326, so the process standard deviation is R̄ ÷ d₂ = 0.012 ÷ 2.326 = **0.00516 mm**.

- Cp = tolerance width ÷ 6σ = 0.06 ÷ (6 × 0.00516) = **1.94**. The spread is small compared with the tolerance.
- Cpk = distance from the mean to the nearer limit ÷ 3σ = (16.03 − 16.012) ÷ (3 × 0.00516) = **1.16**. That is below 1.33, so the process **does not meet** the requirement.

The [process capability check tool](/tools/process-capability-check/) in BIZOMAT Tools gives the same Cp and Cpk, predicts about 242 parts per million outside tolerance, and warns that the process is off-centre. If the supplier centred its process at 16.000 mm with the same spread, Cpk would rise to equal Cp, 1.94, and the process would comfortably pass. The fault is the aim, not the machine. This is also the shift that closed the float in the failure case. A spacer that averages long by 0.012 mm takes 0.012 mm out of every assembly's float. The tool's checks also ask for confirmation that the chart shows a stable process, because capability figures from an unstable process mean little.

**Try it on your own stack-up.** Take the stack-up from the previous chapter's exercise. Calculate the RSS range and the variance share of each link. Then build a simple spreadsheet simulation: for each row, generate a random value for each dimension using a normal distribution for machined parts and a uniform distribution for any bought-in part you know little about, and calculate the gap. Copy the row ten thousand times and count the gaps outside the limits. Repeat with a mean shift on one machined part and compare.

Stack-ups so far have used only dimensions at room temperature, with rigid parts. The next chapter adds temperature, deflection and the allocation of a tolerance budget between parts.
