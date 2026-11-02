---
book: control-charts-by-the-numbers
chapterSlug: variation-is-a-random-variable
order: 1
title: "Variation is a random variable"
description: "A measured dimension as a random variable: mean, standard deviation and the normal distribution, how independent sources of variation add, subgroup means, and predicting parts out of tolerance."
draft: false
---

No two spools come off a lathe the same. The cutting tool deflects a little differently each time, the bar stock varies in hardness, the spindle warms and cools, coolant temperature drifts, and the gauge that measures the result has its own scatter. None of these causes can be predicted part by part, but together they produce a pattern that can be predicted very well: a spread of diameters with a stable centre and a stable width. Treating each measurement as a random variable, a quantity whose individual values are uncertain but whose distribution is known, is the starting point of every control chart.

This chapter sets out the few properties of random variables that the rest of the book uses: the mean and standard deviation, the normal distribution and why it appears so often, the rule by which independent sources of variation add, and the reduced spread of a subgroup's average. It then uses the KEVOS® out-of-tolerance tool to predict how many SP-12 spools fall outside their limits, and ends with a supplier's capability claim built on the wrong standard deviation.

## Mean, spread and the normal curve

A random variable is described by the values it can take and how often it takes each. For a measured diameter, two numbers carry most of that description. The mean, μ, is the long-run average: the centre the process aims at. The standard deviation, σ, is the typical distance of a single part from the mean, the square root of the variance, which is the average squared distance.

This is an illustration. SP-12's land diameter, measured over a stable period, has a mean of 12.0010 mm and a standard deviation of about 0.0022 mm. Most spools fall within a few thousandths of a millimetre of 12.001, a few fall further away, and very few indeed approach the limits at 11.990 and 12.010.

The shape of that spread is close to the normal, or Gaussian, distribution: the familiar symmetric bell. Its tails fall away rapidly, and for a normal variable the share of values within one, two and three standard deviations of the mean is fixed.

```figure
type: bars
title: Share of a normal variable within k standard deviations of its mean
unit: %
max: 100
caption: These shares hold for any normal distribution. For SP-12, three standard deviations is 3 × 0.0022 = 0.0066 mm either side of 12.001 mm.
- Within 1σ | 68.27
- Within 2σ | 95.45
- * Within 3σ | 99.73
```

## Why the normal curve appears

The normal curve is not a law of nature for machined parts, but it appears so often for a reason that probability theory makes precise. When a quantity is the sum of many small, independent contributions, none of which dominates, its distribution approaches the normal whatever the distributions of the contributions. That is the central limit theorem, and Lemons' and every other text on random processes treat it as the bridge from the random behaviour of many small causes to the smooth bell of their total.

A turned diameter is exactly such a sum: tool deflection, thermal growth, material variation, setting and gauge scatter all add up to the reading. The theorem has limits. It says nothing about a process dominated by one large cause, such as a tool that wears steadily, which produces a drift rather than a bell; and it describes the middle of the distribution far better than the far tails, where real processes are often heavier or lighter than the normal predicts. Chapter 8 deals with drift; the tails are a reason to treat predicted parts per million with caution.

## How independent sources add

Independent sources of variation do not add their standard deviations. They add their variances. If the diameter is the sum of contributions from the machine, the gauge and the temperature, and those contributions are independent, the variance of the total is the sum of their variances, and the standard deviation of the total is the square root of that sum. Lemons calls it the variance sum theorem; engineers know it as root-sum-square combination.

```figure
type: formula
title: Combining independent sources of variation
formula: σ_total² = σ_machine² + σ_gauge² + σ_thermal²
formula: σ_total = √(σ_machine² + σ_gauge² + σ_thermal²)
caption: This is an illustration: SP-12's variance budget, with the sources estimated from a gauge study and a warm-up trial. The largest source dominates the total; halving the smallest would hardly change it.
- Machine and tool | 0.0019 mm, 75.5% of the variance
- Gauge repeatability | 0.0006 mm, 7.5% of the variance
- Thermal, between warm-up states | 0.0009 mm, 16.9% of the variance
step: σ_total = √(0.0019² + 0.0006² + 0.0009²) = 0.00219 mm, about 0.0022 mm
```

The rule has a practical edge. Because variances add, the largest source dominates. SP-12's machine and tool account for three-quarters of the variance; the gauge, at 0.0006 mm, contributes only 7.5%. A better gauge would barely change the total. A steadier machine would. Effort spent on the largest term pays; effort spent on small terms mostly does not.

The rule needs independence. If two sources move together, for instance if the gauge and the part both expand with the same room temperature, their contributions are correlated, and the variance of the total includes a covariance term that can be positive or negative. Chapter 8 returns to correlation over time, which is the form that most often breaks control chart assumptions.

## Subgroup averages are less variable

SP-12's chart plots the average of five consecutive spools, not each spool. The average of n independent readings with standard deviation σ has a standard deviation of σ ÷ √n, a direct consequence of the variance sum rule: the variance of the sum of n readings is nσ², and dividing the sum by n divides the variance by n². For SP-12, the standard deviation of a subgroup average is 0.0022 ÷ √5 = 0.00098 mm, less than half that of a single spool.

```figure
type: line
title: Standard deviation of a subgroup average against subgroup size, SP-12
x: Subgroup size n
y: Standard deviation of the average, µm
ymin: 0
ymax: 2.4
caption: This is an illustration. σ ÷ √n with σ = 2.2 µm (0.0022 mm). Going from one to five readings more than halves the spread; going from five to ten reduces it by less than a third more.
- 1 | 2.20
- 2 | 1.56
- 3 | 1.27
- 5 | 0.98
- 8 | 0.78
- 10 | 0.70
```

Two consequences follow, and both shape the charts in later chapters. A chart of averages sees a shift in the process mean more clearly than a chart of single readings, because the noise around each plotted point is smaller; Chapter 4 calculates how much more clearly. And averages are closer to normal than single readings, by the central limit theorem again, so charts of averages are less sensitive to a process that is a little non-normal.

## Predicting parts out of tolerance

With a mean and a standard deviation, and an assumption of normality, the share of parts beyond each limit follows from the normal curve. The distance from the mean to each limit, measured in standard deviations, is the z value; the share beyond is the normal tail area beyond z.

The [normal distribution out-of-tolerance tool](/tools/normal-out-of-spec/) does this calculation. From the process mean, standard deviation, lower and upper specification limits and a production quantity, it gives the z value to each limit, the parts per million below and above, the total out of tolerance as parts per million and as a percentage, the expected count in the quantity entered and the yield. It assumes a stable, normal process and reminds the user to confirm both with a control chart and a normality check before relying on tail estimates, and it flags a process that is off centre.

```figure
type: stats
title: SP-12's land diameter from the out-of-tolerance tool
caption: This is an illustration. Mean 12.0010 mm, standard deviation 0.0022 mm, limits 11.990 and 12.010 mm, 20,000 spools. The process sits 0.001 mm high, so almost all the predicted rejects are oversize.
- 4.09 | z to the upper limit | (12.010 − 12.001) ÷ 0.0022
- 5.00 | z to the lower limit | (12.001 − 11.990) ÷ 0.0022
- * 21.8 ppm | Predicted out of tolerance | 21.5 ppm above, 0.3 ppm below
- 0.44 | Expected spools out of 20,000 | yield 99.9978%
```

Centring the process at 12.000 mm would put both limits 4.55 standard deviations away and cut the prediction to about 5.5 ppm, a quarter of the present figure. A small offset in the mean costs more than it looks, because the normal tail shrinks so fast: the upper tail at 4.09σ is about 75 times the lower tail at 5.00σ.

Numbers this small deserve humility. A prediction of 21.8 ppm rests on the normal curve holding out past four standard deviations, where a few months of data cannot test it, and on the process staying stable, which is what the control chart is for. The prediction is best read as "a few tens per million if the process stays as it is", not as a guarantee.

## Estimating the standard deviation

The standard deviation is never known exactly; it is estimated from data, and the estimate has its own uncertainty. Two estimates are in common use. The sample standard deviation, s, is calculated directly from a set of readings. The range method divides the average range of small subgroups by a constant, d₂, that depends on the subgroup size: 2.326 for subgroups of five. SP-12's baseline gives 0.0051 ÷ 2.326 = 0.00219 mm. The range method uses only the variation within each subgroup, so a mean that wandered between subgroups does not inflate it, which is exactly what a control chart needs.

How good is the estimate? For a normal process the relative standard error of a standard deviation estimated from n readings is roughly 1 ÷ √(2(n − 1)). From 25 readings it is about 14%; from 50, about 10%; from 125, SP-12's 25 subgroups of five, about 6.4%; from 500, about 3%. A σ of 0.0022 mm from the baseline is therefore really "between about 0.0019 and 0.0025 mm", and a prediction of parts per million, which depends on σ through a steep tail, inherits a much larger relative uncertainty. That is another reason to hold such predictions loosely and to keep updating the baseline as data accumulate.

## Tolerance against spread

The tolerance and the spread can be compared directly. SP-12's tolerance band is 0.020 mm wide; six standard deviations of the process, the width that holds 99.73% of a normal distribution, is 6 × 0.0022 = 0.0132 mm. The process spread fits into the tolerance about 1.5 times. That ratio is the capability index Cp, and with the offset of the mean taken into account it becomes Cpk; Chapter 9 calculates both and the confidence that can be placed in them. For now the comparison makes the point that a control chart and a tolerance answer different questions. The chart's limits come from the process's own variation, about ±0.003 mm around the mean for subgroup averages; the tolerance comes from the drawing. A process can be in control and still make bad parts if its spread is too wide for its tolerance, and out of control while every part is still good.

## Within and overall variation

The standard deviation of 0.0022 mm describes variation within short periods: five consecutive spools differ by about that much. Over a day, the process mean may also wander a little, between tool changes, as the machine warms, between bar batches. Variation measured over a long period therefore includes both, and is usually somewhat larger. Capability indices calculated from the within-subgroup figure describe what the process could do if its mean stayed put; performance indices calculated from the overall figure describe what it actually did. Chapter 9 keeps the two apart. For control charts the within-subgroup figure is the right one, because the chart's job is to detect the very between-subgroup movement that the overall figure includes.

## The error: the standard deviation of the averages

This is an illustration. When SP-12 was first offered to a customer, the supplier's capability summary quoted a standard deviation of 0.0011 mm and predicted essentially zero parts out of tolerance: with the mean at 12.001, the upper limit sat 8.2 standard deviations away, a tail of about 2 × 10⁻¹⁰ ppm.

The customer's quality engineer asked how the 0.0011 mm had been obtained. It was the standard deviation of the 25 subgroup averages, not of individual spools. Averages of five vary less than single parts by a factor of √5, so the figure understated the spread of individual spools by a factor of about two. The engineer checked it a second way: the average range of 0.0051 mm divided by the constant d₂ = 2.326 for subgroups of five gives σ = 0.0022 mm, twice the quoted figure. With the correct σ, the tool predicted 21.8 ppm, not zero.

The two figures differ by more than the factor √5 would explain only if the subgroup averages also moved between subgroups, so the comparison doubles as a check of stability. Here they agreed with the factor almost exactly, which also showed that the process mean had been steady over the baseline period. The capability summary was reissued with the within-subgroup σ, and the supplier's template was changed to label every standard deviation with what it was calculated from.

## Exercise: a better gauge

The cell considers replacing its gauge with one whose repeatability standard deviation is 0.0003 mm instead of 0.0006 mm, all other sources unchanged. Find the new total standard deviation, the z value to the upper limit with the mean at 12.001 mm, and the predicted parts per million. Is the gauge worth buying for this reason alone?

**Worked answer.** This is an illustration. The new total is √(0.0019² + 0.0003² + 0.0009²) = √(0.00000361 + 0.00000009 + 0.00000081) = √0.00000451 = **0.00212 mm**, down from 0.00219 mm, a reduction of about 3%. The upper z becomes 0.009 ÷ 0.00212 = **4.24**, and the tool predicts about **11.4 ppm** in total, against 21.8 ppm. Halving the gauge's contribution roughly halves the predicted rejects, because the tail is so sensitive; but centring the process at 12.000 mm, which costs only an offset adjustment, would do more, bringing the total to about 5.5 ppm with the present gauge. The gauge may be worth buying for other reasons, such as clearer decisions near the limits, but not for the reject rate alone.
