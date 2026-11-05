---
book: control-charts-by-the-numbers
chapterSlug: ewma-a-chart-with-a-fading-memory
order: 6
title: "EWMA: a chart with a fading memory"
description: "The exponentially weighted moving average as a smoothed, mean-reverting statistic: choosing λ and L, its limits and run lengths, comparison with the CUSUM, and the wrong standard deviation."
draft: false
---

The CUSUM of Chapter 5 remembers everything since its last reset. The exponentially weighted moving average, or EWMA, remembers everything too, but with a memory that fades: each new point is blended with the running average, so recent points count for more and old ones for less, in a geometric decline. The result is a smooth line that follows the process mean, filters out much of the point-to-point noise, and drifts towards any sustained shift. S. W. Roberts proposed it as a control chart in 1959, and it has since become the most widely used chart for small shifts, partly because it is easy to compute and to read.

This chapter sets out how the EWMA is built and what its weighting factor does, links it to the mean-reverting random processes of physics, calculates its limits and run lengths for SP-12, runs it on Thursday's data with the BIZOMAT EWMA tool, and compares it with the CUSUM. It ends with an EWMA whose limits were drawn from the wrong standard deviation and never signalled at all.

## A blended average

Each new EWMA value is a weighted blend of the newest point and the previous EWMA. The weight on the newest point, λ, is between 0 and 1; the rest, 1 − λ, carries the history.

```figure
type: formula
title: The EWMA statistic and its limits
formula: zᵢ = λ xᵢ + (1 − λ) zᵢ₋₁, starting from z₀ = μ₀
formula: σ_z = σₓ √(λ ÷ (2 − λ)) in steady state; limits μ₀ ± L σ_z
caption: x is the plotted value with standard deviation σₓ: here SP-12's subgroup averages, σₓ̄ = 0.00098 mm. This is an illustration with λ = 0.2 and L = 2.86, a design whose in-control ARL is about 370.
- Weight on the newest point | λ = 0.2
- Spread of the EWMA | 0.00098 × √(0.2 ÷ 1.8) = 0.000327 mm
step: Limits: 12.0010 ± 2.86 × 0.000327 = 11.99907 to 12.00194 mm
step: Weight on the last 5 points: 1 − 0.8⁵ = 67%; on the last 10: 89%
```

Expanding the recursion shows the fading memory: the point k steps back carries weight λ(1 − λ)ᵏ. With λ = 0.2, the newest point has weight 0.2, the one before 0.16, then 0.128, and so on. A small λ gives a long memory and heavy smoothing; λ = 1 gives no memory at all, and the EWMA becomes a Shewhart chart. Values between 0.05 and 0.3 cover most practical designs. The limits are narrow because the EWMA is much less variable than single points: its standard deviation is a third of σₓ̄ for λ = 0.2.

## A process that returns to its mean

The EWMA has a close relative in physics. A small particle in a fluid is pushed by random molecular impacts and pulled back by drag; its velocity wanders randomly but always tends back towards zero, with a memory that fades exponentially. That is the Ornstein–Uhlenbeck process, which Lemons develops from Langevin's 1908 equation for Brownian motion, and its discrete-time form is exactly the EWMA recursion: each step keeps a fraction 1 − λ of the previous value and adds a random kick.

The analogy explains the EWMA's two behaviours. In control, the EWMA wanders around the target with a stationary spread, σₓ √(λ ÷ (2 − λ)), just as the particle's velocity has a stationary spread set by the balance of kicks and drag. After a shift, the target it is pulled towards moves, and the EWMA relaxes towards the new mean with a time constant of about 1 ÷ λ points, five for λ = 0.2. Detection happens when the relaxing EWMA crosses a limit that sits a few of its own small standard deviations from the old target.

## Choosing λ and L

Two parameters set the design. The weight λ sets the memory: small values suit small shifts, which need many points of evidence; larger values suit larger shifts. The limit width L is then chosen to give the in-control ARL wanted. Lucas and Saccucci's 1990 paper gave the run lengths of many combinations, calculated by the Markov-chain method; the values below were calculated the same way.

```figure
type: compare
title: Average run lengths for SP-12's subgroup averages, EWMA designs against the CUSUM
cols: EWMA λ = 0.1, L = 2.703 | EWMA λ = 0.2, L = 2.86 | CUSUM k = 0.5, h = 4.77 | X̄ chart
rowhead: Shift in σₓ̄
caption: This is an illustration. All four designs have an in-control ARL close to 370. The EWMAs and the CUSUM perform almost alike; each beats the X̄ chart for shifts up to about 2σₓ̄.
- None | 371 | 371 | 369 | 370
- 0.5σₓ̄ | 28.3 | 36.2 | 35.2 | 155
- * 1.12σₓ̄ (0.5σ) | 8.4 | 8.1 | 8.3 | 33.4
- 2σₓ̄ | 4.2 | 3.6 | 3.9 | 6.3
- 3σₓ̄ | 2.8 | 2.3 | 2.5 | 2.0
```

The table's main message is that a well-designed EWMA and a well-designed CUSUM are nearly interchangeable for the shift they are tuned to: about 8 subgroups for SP-12's half-sigma shift. The smaller λ is a little better for the smallest shifts and a little worse for larger ones. The choice between EWMA and CUSUM is therefore mostly practical, and a plant that already runs one well gains little by switching to the other. The EWMA plots something that looks like the process, a smoothed diameter in millimetres, which operators find natural; the CUSUM plots accumulated evidence, which needs explaining but also estimates where the shift began.

## Thursday's data on the EWMA

The [EWMA control chart check](/tools/ewma-chart-check/) runs the chart on up to twenty readings in time order. From the target, the historical standard deviation, the weighting factor and the limit width, it calculates the EWMA starting from the target, its steady-state standard deviation, the upper and lower limits, and the first reading at which the EWMA leaves them, with a table of readings and EWMA values. It reminds the user that the target and standard deviation must come from a period when the process was in control.

This is an illustration. Entering Thursday's twenty subgroup averages from Chapter 5 with target 12.001 mm, standard deviation 0.00098 mm, λ = 0.2 and L = 2.86 gives limits of 11.99907 to 12.00193 mm.

```figure
type: line
title: SP-12's EWMA through the Thursday morning
x: Subgroup
y: EWMA minus target, µm
ymin: -1
ymax: 1.4
caption: This is an illustration. λ = 0.2, limits ±0.93 µm about the target of 12.001 mm. The EWMA rises after the bar batch change at subgroup 11 and crosses the upper limit at subgroup 19, reaching 1.20 µm at subgroup 20.
- 1 | -0.46
- 3 | -0.05
- 5 | -0.22
- 7 | -0.31
- 9 | -0.25
- 10 | 0.26
- 11 | 0.47
- 13 | 0.62
- 15 | 0.26
- 17 | 0.85
- 18 | 0.82
- 19 | 1.06
- 20 | 1.20
```

The EWMA signals at subgroup 19, one later than the CUSUM's 18 with h = 4.77 and two later than with h = 4. All three are within the scatter that run lengths always have: the ARL for this shift is about 8 for each design, and this particular morning's noise happened to delay the EWMA a little, most visibly when subgroup 15 came in on target and pulled the EWMA back down. Run on many mornings, the two charts catch the shift equally fast on average.

## Starting values and the first few points

The tool uses the steady-state limits from the first point. Strictly, the EWMA's spread grows from zero at the start, because the first value is mostly the fixed starting value, and reaches its steady-state value after about 1 ÷ λ points. Limits that grow with it, σₓ √(λ ÷ (2 − λ) × (1 − (1 − λ)²ⁱ)), are slightly narrower for the first few points and so make the chart a little more sensitive to a process that starts off target, for example after a set-up. For SP-12, with λ = 0.2, the difference matters only in the first five or six subgroups after a reset; the steady-state limits are a slightly conservative simplification, and the tool says which it uses.

## The error: limits from the wrong standard deviation

This is an illustration. When the EWMA was first set up in SP-12's control software, the setter entered the process standard deviation, 0.0022 mm, as the "historical standard deviation", rather than the standard deviation of the plotted subgroup averages, 0.00098 mm. The limits came out at 12.001 ± 0.0021 mm instead of ±0.00093 mm. On Thursday's data the EWMA never left them: its highest value, 12.0022 mm, was well inside 12.0031 mm.

The quality engineer noticed because the EWMA had never signalled in three weeks, while the CUSUM beside it had signalled twice with confirmed causes. The calculation was quick: limits 2.24 times too wide are equivalent to L = 6.42 instead of 2.86, which makes the in-control ARL astronomically large and the ARL for the half-sigma shift about 1,360 subgroups, more than eight working weeks. The chart was decorative. The cause was a label: the software's field was called "process sigma", and the setter had, reasonably, entered the process sigma.

The field was relabelled "standard deviation of the plotted value", and a check was added to the chart's set-up sheet: plot the baseline's own EWMA and confirm that it crosses the limits about as often as the in-control ARL predicts, which is rarely, but not never in a long baseline. The same check would have caught the opposite mistake, entering σₓ̄ while plotting single readings, which makes the limits too narrow and the chart signal constantly.

## The EWMA as a forecast, and the danger of steering by it

Because the EWMA is a smoothed estimate of the current mean, it is also a forecast of the next point, and it is tempting to use it to steer the process: after every subgroup, adjust the offset by the EWMA's deviation from target. For a process whose mean genuinely wanders, that can work; it is the basis of run-to-run control in some industries. For a process whose mean is stable, as SP-12's is between special causes, it adds variation rather than removing it.

The extreme case shows why. If the setter adjusted the offset after every subgroup by the full deviation of the last average from the target, each adjustment would carry that subgroup's random error into the next, and the variance of the process mean around the target would double: the standard deviation of the averages would rise by a factor of √2, about 41%. W. Edwards Deming demonstrated the effect with a funnel dropped over a target, and called it tampering. Steering by a smoothed EWMA rather than the last point does less harm, because it adjusts by only a fraction λ of each error, but it still adds variance to a stable process. The rule SP-12 follows is the rule of every control chart: adjust only when the chart signals, and then by the estimated size of the shift, not continuously.

## Running the EWMA alongside a Shewhart chart

An EWMA with a small λ is slow to react to a very large, sudden shift, because the shifted point gets only weight λ. That is why the EWMA, like the CUSUM, is usually run with a Shewhart chart beside it, or with Shewhart limits added to the EWMA chart for the individual points. The combination catches large shifts at once and small ones within a few subgroups, with a combined false alarm rate a little higher than either alone. For SP-12's diameter the X̄ chart already plays that role. For the heat treater's hardness, the individuals chart and the EWMA are plotted on the same sheet, with the individual readings as dots and the EWMA as a line, which shows the heat treater both the latest batch and the trend.

## Proving the design on the baseline

Before an EWMA goes live, its design can be tried on the baseline it was built from. Run the baseline's 25 subgroups through the chart: the EWMA should wander inside the limits, rarely approaching them, and should not signal. Then add a known shift to a copy of the baseline, say the half-sigma step that matters, and run that: the chart should signal within roughly the ARL the design predicts. A design that fails the first test has limits too narrow, usually from the wrong standard deviation; one that fails the second has limits too wide or a λ unsuited to the shift. The test takes minutes with the tool and catches the commonest set-up errors before they reach the shop floor. The results of both runs go in the chart's set-up record, beside the design and its reasons.

## Which small-shift chart

SP-12 runs the CUSUM rather than the EWMA for its diameter, for two reasons: the CUSUM's estimate of where a shift began has proved useful in tracing bar batches and offsets, and the setters were trained on it first. For the heat treater's hardness, the plant uses an EWMA with λ = 0.2 on single readings, because the smoothed hardness line is easier to discuss with the heat treater, who is not a statistician. Both choices are defensible; what matters is that each chart is designed for the shift that matters, uses the right standard deviation and is reset or restarted correctly after adjustments.

## Exercise: a heavier smoothing

Repeat the EWMA on Thursday's data with λ = 0.1 and L = 2.703. Calculate σ_z and the limits, and find where the EWMA signals. Using the table above, compare its expected detection of the half-sigma shift with λ = 0.2.

**Worked answer.** This is an illustration. With λ = 0.1, σ_z = 0.00098 × √(0.1 ÷ 1.9) = **0.000225 mm**, and the limits are 12.0010 ± 2.703 × 0.000225 = **11.99939 to 12.00161 mm**. The EWMA starts at 12.0010, moves more slowly than with λ = 0.2, and first exceeds 12.00161 mm at subgroup **19**, ending at 12.00179 mm after subgroup 20. Its expected ARL for the half-sigma shift is 8.4 subgroups against 8.1 for λ = 0.2, essentially the same. The heavier smoothing would pay off for a smaller shift, about a quarter-sigma, where its ARL of 28 beats λ = 0.2's 36, and cost a little for larger shifts. For SP-12's half-sigma target, λ = 0.2 is the slightly better fit.
