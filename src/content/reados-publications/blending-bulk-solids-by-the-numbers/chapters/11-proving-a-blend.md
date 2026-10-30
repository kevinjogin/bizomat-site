---
book: blending-bulk-solids-by-the-numbers
chapterSlug: proving-a-blend
order: 11
title: "Proving a blend: acceptance plans and monitoring"
description: "Design a blend acceptance plan and work out how often it passes good and poor blends, monitor a continuous blend with an EWMA chart for small drifts, and bring Plant C's three blends under control."
draft: false
---

Proving a blend is two jobs. The first is to decide, from a limited number of samples, whether a batch or a period of production is good enough to release. The second is to watch the process over time so that a slow change is noticed before it produces material that would fail. Each needs a plan that says in advance what will be measured and what result will trigger a decision, and each plan has a performance that can be calculated: how often it passes a good blend, how often it passes a poor one, and how quickly it notices a change.

This last chapter designs an acceptance plan for Plant C's premix and calculates how it behaves, shows how an exponentially weighted moving average chart caught a small drift in the compound's filler content that ordinary control limits would have missed, and sums up the controls the plant now has on all three of its blends.

## Three different jobs

Three activities are often lumped together as "testing the blend", and keeping them apart makes each easier to design.

```figure
type: layers
title: Proving a blend: three jobs, three time scales
caption: This is an illustration of how the jobs fit together at Plant C. Validation sets the process up; acceptance releases each batch or period; monitoring watches for change between validations.
- Validation | once, and after any change | shows the process can make a good blend: blend time studies, capability studies, segregation tests
- Acceptance | every batch or lot | decides whether this batch is good enough to release: the plan's operating characteristic matters
- Monitoring | continuously | notices when the process moves: p-charts, EWMA charts, trends by container age
```

Validation is done with many samples, once, to establish what the process can do: Chapters 3, 4, 5 and 8 did this. Acceptance uses fewer samples, every time, and must be designed so that its decisions are reliable for the process validation established. Monitoring uses the results that acceptance and routine testing produce anyway, plotted in time order, to see whether the validated state still holds. A plant that validates once and then only accepts batches has no way of seeing a slow drift until a batch fails; a plant that only monitors has no defined release decision.

## What an acceptance plan must do

An acceptance plan is a rule: take n samples in a stated way, measure them, and accept if the results meet stated criteria. Its performance is described by its **operating characteristic**: the probability of acceptance as a function of the blend's true quality. A good plan accepts good blends nearly always and poor blends rarely. No plan with a finite number of samples does either perfectly, and the region between is where its cost lies.

## The error: averaging away the spread

This is an illustration. Plant C's original release rule for a premix batch was: take three samples, average them, and accept if the average lies between 19.5% and 20.5% stabiliser. It looked strict, with a tolerance of only ±0.5 points.

It was strict about the wrong thing. An average of three tests the batch's mean content, which depends mostly on whether the stabiliser was weighed in correctly. It says little about uniformity, because averaging three samples cancels much of their spread. The engineer worked out how often the rule would accept a badly mixed batch. A batch blended for only 5 minutes, like the one in Chapter 3, has a standard deviation between samples of about 1.21 points. The average of three has a standard deviation of 1.21 ÷ √3 = 0.70, and the chance that it lands within ±0.5 of a correct mean is about **53%**. Half of all batches as poorly mixed as that would have been released.

That was how the contractor's shortened blend time in Chapter 3 went unnoticed by the release test: the batches kept passing.

## A plan that tests uniformity

The new rule tests both the mean and the spread, at the scale of scrutiny:

- take **ten** 0.5 g test portions, by the stream sampling procedure of Chapter 10;
- accept only if **every** result lies between 19.0% and 21.0%, and
- the standard deviation of the ten is **0.40** points or less, which is 1.5 times the random-mixture limit of 0.27 from Chapter 3.

Its operating characteristic can be calculated for a batch with the correct mean and a true standard deviation σ. The chance that all ten results fall within ±1.0 is [2Φ(1.0 ÷ σ) − 1]¹⁰, where Φ is the standard normal distribution function. The chance that the sample standard deviation is at most 0.40 follows from the chi-square distribution with 9 degrees of freedom: P(χ²₉ ≤ 9 × 0.40² ÷ σ²). The two conditions are close to independent for normal data, so the probability of acceptance is roughly their product.

```figure
type: compare
title: Probability of accepting a premix batch, by its true uniformity
rowhead: True standard deviation σ
cols: All ten within 19.0 to 21.0% | s ≤ 0.40 | New plan accepts | Old plan, mean of three, accepts
caption: This is an illustration. Batches with the correct mean of 20.0%. The new plan passes random-limit blends nearly always and poorly mixed blends almost never; the old plan passed half of the 5-minute blends.
- 0.27, random limit | 99.8% | 98.1% | 97.8% | 99.9%
- 0.30 | 99.2% | 93.3% | 92.5% | 99.6%
- 0.40, the plan's limit | 88.3% | 56.3% | 49.7% | 97.0%
- 0.60 | 36.6% | 8.9% | 3.2% | 85.1%
- * 1.21, a 5-minute blend | 0.5% | 0.05% | about 0% | 52.6%
```

The new plan accepts a blend at the random limit 98% of the time and a 5-minute blend essentially never. Around its limit of 0.40 it is a coin toss, as every plan is near its own limit; the plant's 12-minute blend time keeps production well to the left of that region. The cost of the plan is ten assays per batch instead of three, about an hour of laboratory time, against the cost of releasing a batch that leaves part of a customer's production unstabilised.

## Monitoring a continuous blend

A batch plan does not suit the extrusion line, which makes product continuously. There, the laboratory measures the filler content of a pellet sample every two hours, and the question is whether the process has moved. Chapter 8 established its standard deviation as 0.19 points around a target of 30.0%.

An ordinary Shewhart chart of individual results, with limits at ±3 × 0.19 = ±0.57 points, is good at catching large, sudden changes, such as a feeder failure. It is poor at catching a small, sustained shift: a drift of 0.2 points, a third of the limit width, could run for days before a single result fell outside 29.43 to 30.57. Yet a sustained 0.2-point shift uses up a fifth of the distance to the specification limit and erodes the capability Chapter 8 worked to prove.

The **exponentially weighted moving average** chart is designed for small shifts. It plots z_i = λ x_i + (1 − λ) z_(i−1), a running average in which each new result has weight λ and older results fade geometrically, against limits that are narrower than a Shewhart chart's because the average is less noisy. The [EWMA chart check tool](/tools/ewma-chart-check/) calculates the statistic from up to twenty readings in time order, starting from the target, with its standard deviation and control limits from a historical standard deviation, and reports the first reading at which the EWMA leaves the limits. The [control charts book's EWMA chapter](/reados/publications/control-charts-by-the-numbers/ewma-a-chart-with-a-fading-memory/) sets out its design in detail.

### Choosing the weight and the limits

The weight λ sets how long the chart remembers. A small λ, such as 0.05 to 0.1, averages over many results and detects very small shifts, but responds slowly to large ones and to the start of a shift. A larger λ, such as 0.3 or 0.4, behaves more like a Shewhart chart. Values around 0.1 to 0.25, with limits at about three standard deviations of the EWMA, are a common choice for detecting shifts of half to one standard deviation, and the plant uses 0.2. The historical standard deviation in the limits must come from a period when the process was known to be stable, measured the same way, which is why the plant used the 0.19 established after Chapter 8's changes rather than an older, larger figure that would have widened the limits and blunted the chart.

An EWMA chart is run alongside a Shewhart chart, not instead of it. The Shewhart limits catch a feeder failure in one result; the EWMA catches the slow drift that the Shewhart chart would let through.

## A drift the EWMA caught

This is an illustration. Over 40 hours, the laboratory's twenty two-hourly filler results were, in order: 30.12, 29.85, 30.20, 29.97, 30.05, 29.78, 30.18, 29.93, 30.09, 29.96, then 29.78, 29.89, 29.67, 29.85, 29.63, 29.81, 29.72, 29.87, 29.66 and 29.77. None was outside the Shewhart limits; the lowest, 29.63, was 0.20 points above the lower limit.

Entered in the EWMA chart check tool with a target of 30.0, the historical standard deviation of 0.19, λ = 0.2 and limits at three standard deviations of the EWMA, the tool gave an EWMA standard deviation of 0.063, control limits of **29.81 to 30.19**, and a first signal at **reading 17**, below the lower limit, with the EWMA at 29.806.

```figure
type: line
title: Filler content results and their EWMA
x: Reading, every 2 hours
y: Filler, %
ymin: 29.5
ymax: 30.3
legend: Result | EWMA, λ = 0.2
caption: This is an illustration. The last ten results average 29.77%, a shift of about 0.23 points that no single result reveals. The EWMA crosses its lower limit of 29.81 at reading 17, fourteen hours after the shift began.
- 1 | 30.12 | 30.02
- 2 | 29.85 | 29.99
- 3 | 30.20 | 30.03
- 4 | 29.97 | 30.02
- 5 | 30.05 | 30.03
- 6 | 29.78 | 29.98
- 7 | 30.18 | 30.02
- 8 | 29.93 | 30.00
- 9 | 30.09 | 30.02
- 10 | 29.96 | 30.01
- 11 | 29.78 | 29.96
- 12 | 29.89 | 29.95
- 13 | 29.67 | 29.89
- 14 | 29.85 | 29.88
- 15 | 29.63 | 29.83
- 16 | 29.81 | 29.83
- 17 | 29.72 | 29.81
- 18 | 29.87 | 29.82
- 19 | 29.66 | 29.79
- 20 | 29.77 | 29.78
```

The last ten results averaged 29.77%, 0.23 points below target. The filler feeder's trend showed nothing, because the feeder believed it was delivering its set point. The cause was mechanical: a flexible hose to the feeder's refill valve had been refitted after maintenance so that it rested on the feeder's frame, carrying part of the feeder's weight. The feeder's load cells read slightly heavy and slightly less responsive, and the controller delivered about 1% less filler than it reported. Re-routing the hose restored the rate; a check-weigh of the feeder's output into a bin confirmed it. A hose, cable or flexible connection that bridges a loss-in-weight feeder's weighing system is a well-known cause of this kind of error, and the plant added it to the feeder's inspection checklist.

## When a batch fails

A plan is only as good as what happens when it rejects something. Plant C's procedure for a premix batch that fails its acceptance plan is fixed in advance. The batch is held. The ten results are examined for a pattern by sampling position or time, which points to a cause: a single low result suggests a sampling or assay problem; a pattern suggests incomplete mixing or segregation. Retesting is allowed only to investigate a documented laboratory error, never simply to obtain a passing result, because sampling until a test passes makes any plan's operating characteristic meaningless. A batch that fails on uniformity may be re-blended and then retested in full, as a new batch. Every failure, its cause and its disposition are recorded, and the records are reviewed monthly alongside the charts, since a run of failures with no single cause is itself a signal.

## Plant C's blends under control

With the changes from every chapter in place, each of the plant's three blends now has a defined scale of scrutiny, a check at its source, a check where it is used and a way of noticing change.

```figure
type: compare
title: How Plant C proves and monitors its three blends
rowhead: Blend
cols: Scale of scrutiny | At the source | Where it is used | Watching for change
caption: This is an illustration. Each control traces to a chapter: the random limit and p-chart (2), blend testing (3, 4), segregation and discharge order (6, 7), feeders and capability (8), minor ingredients (9), sampling (10) and acceptance and EWMA (11).
- Colour, 2% masterbatch | one 60 g lid | doser calibration; micro-pellets at the throat | lid carbon content; shade rejects | p-chart of daily shade rejects
- Tracer | one lid | tracer compounded into the black masterbatch | UV check of retained lids | audit results trended
- Filler, 30% | a few grams of compound | feeder refill settings; feeder inspection | ash test every 2 hours | EWMA chart; capability lower bound
- * Premix, 20% stabiliser | 0.5 g of premix | 12-minute blend; ten-sample acceptance plan | compound stabiliser by container age | monthly plot; annual sampling bias check
```

## How this applies to a small Australian business

Write down your blend's acceptance rule, then work out how often it would pass a blend that is just good enough and one that is clearly not. If it passes poor blends often, it is testing the wrong thing, usually the average instead of the spread. For continuous processes, plot results in time order and add an EWMA alongside ordinary limits, so that small, sustained shifts are seen in hours rather than weeks. And when a chart signals, look for the physical cause before adjusting anything; in bulk solids, it is usually a feeder, a container or a sample, not the blend's chemistry.

Finally, keep the arithmetic with the plan. A plan's sample size, limits and operating characteristic, written down with the assumptions behind them, let the next engineer see why the plan is what it is, and change it deliberately when the process or the product changes, rather than loosening it one exception at a time. Every number in Plant C's plans can be traced to a calculation in this book, and that traceability is as much a part of proving a blend as any test result.

## Exercise: a looser spread limit

The plant considers relaxing the premix plan's spread limit from s ≤ 0.40 to s ≤ 0.50, keeping the other conditions. For a batch with true σ = 0.40, the chance that all ten results lie within ±1.0 is 88.3%. (a) What is the chance that s ≤ 0.50, given that P(χ²₉ ≤ 14.06) is about 0.88? (b) What is the new probability of acceptance, and what does the change trade?

**Worked answer.** (a) The chi-square value is 9 × 0.50² ÷ 0.40² = 9 × 0.25 ÷ 0.16 = **14.06**, so P(s ≤ 0.50) is about **0.88**. (b) The probability of acceptance becomes about 0.883 × 0.88 = **0.78**, up from 0.50. Batches at σ = 0.40, already 1.5 times the random limit, would pass four times in five instead of half the time. The relaxation reduces the number of good-enough batches retested, at the cost of passing more batches that are less uniform than the plant's own blend time study says it can achieve. Given the 12-minute blend's typical σ of about 0.27, few batches would be affected either way; the original limit is the safer choice.
