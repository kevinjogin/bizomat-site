---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: why-simulate-a-noisy-system
order: 1
title: "Why simulate a noisy system"
description: "Why average inputs give the wrong answer for equipment with random inputs, the balance tank as a stochastic differential equation, what a simulation must produce, and the plan for building one."
draft: false
---

Engineers are trained to design for steady conditions and then add a margin. For much equipment that works well: a beam carries a known load, a pump delivers a known flow. It works badly when the inputs are random and the question is about their extremes. A tank fed by an irregular inflow overflows not on an average day but on the day several large inflows arrive together. A machine buffer runs dry not at the average breakdown rate but when two long breakdowns follow each other. The average inputs say nothing about how often those things happen, and a calculation built on averages will usually say they never do.

This chapter sets out the running case, shows what the average-input calculation predicts and why it is wrong, writes the tank as a stochastic differential equation, and lays out what a simulation must produce to answer the plant's questions. Its error is the average-input calculation itself, which concluded confidently that the discharge limit could never be exceeded.

## The question

Plant D's balance tank, BT-1, receives all the factory's process and washdown wastewater and releases it through an orifice plate to the sewer. A balance tank exists precisely to smooth an irregular inflow into a steadier outflow, and its size and outlet were chosen when the factory was built. Since then, production has grown and two new filling lines, each needing frequent washdowns, have been added. The plant's trade waste agreement limits the discharge to the sewer to 3.0 L/s at any instant, and the tank overflows into a bunded area, a reportable event, if its level reaches 2.50 m.

The plant's environmental officer asked the engineer three questions:

1. On what fraction of production days does the discharge exceed 3.0 L/s, and for how long?
2. How likely is an overflow, expressed as an expected interval between overflows?
3. Which change would reduce both the most: a bigger tank, a different outlet, or a rule that holds washdowns while the tank is high?

## The tank

BT-1 is a vertical cylinder 2.0 m in internal diameter, so its plan area is π × 1.0² = 3.14 m². Its outlet is a 32 mm sharp-edged orifice plate with a discharge coefficient of about 0.62. The flow through an orifice under a head h is

Q = Cd × a × √(2 g h)

where a is the orifice area. For BT-1, Cd × a = 0.62 × π × 0.016² = 4.99 × 10⁻⁴ m², so at a level of 1.0 m above the orifice the outflow is 4.99 × 10⁻⁴ × √(2 × 9.81 × 1.0) = 0.00221 m³/s, or 2.21 L/s. The outflow rises with the square root of the level: the limit of 3.0 L/s is reached at h = (0.003 ÷ 4.99 × 10⁻⁴)² ÷ (2 × 9.81) = **1.85 m**, and at the overflow level of 2.50 m the outflow is 3.49 L/s.

The level changes at a rate set by the difference between inflow and outflow, divided by the plan area:

A × dh/dt = Q_in(t) − Cd × a × √(2 g h)

That is a first-order, nonlinear differential equation. With a constant inflow, the level settles where outflow equals inflow. With an inflow of 2.0 L/s, it settles at h = (0.002 ÷ 4.99 × 10⁻⁴)² ÷ (2 × 9.81) = 0.82 m. Near that level, small changes behave like a first-order lag with a time constant τ = 2 A h ÷ Q = 2 × 3.14 × 0.82 ÷ 0.002 = **2,580 s, about 43 minutes**. That number matters throughout the book: the tank smooths out changes in inflow that are much faster than 43 minutes and follows changes that are much slower.

```figure
type: stats
title: BT-1 at a glance
caption: This is an illustration. The steady level and time constant are for a constant inflow of 2.0 L/s. The limit and overflow levels follow from the orifice equation.
- 3.14 m² | plan area, 2.0 m diameter
- 0.82 m | steady level at 2.0 L/s
- 43 min | time constant near the steady level
- 1.85 m | level at the 3.0 L/s discharge limit
- 2.50 m | overflow level, outflow 3.49 L/s
```

## The inflow

The plant's flow records and production schedules describe the inflow in two parts.

- **Process wastewater** from the production lines averages 2.0 L/s. It is never steady: rinses start and stop, tanks drain, lines change product. Its fluctuations have a standard deviation of about 0.8 L/s, and a change tends to persist for about two minutes before the flow wanders elsewhere. Chapter 4 makes this precise as exponentially correlated noise.
- **Washdowns** of filling and packing equipment add 3.0 L/s for about 8 minutes each, 1.44 m³ a time. They happen when a line changes product or finishes a run, which is not on a timetable, and the records show about four in a production day of 16 hours, at times that look random. Chapter 8 treats them as a Poisson process.

### Where the description of the inflow came from

A model of random inputs is only as good as the records behind it, so it is worth saying where these came from. BT-1's inlet has a magnetic flowmeter, FT-1, logged every 10 s. The engineer took 40 production days of its log and separated it into two parts using the production lines' own logs, which record when each washdown valve opens and closes. The flow during washdowns, less the flow just before, gave the washdown rate of about 3.0 L/s and the duration of about 8 minutes. The rest of the record, with washdown periods removed, gave the process flow's mean, its standard deviation and, from its autocorrelation, how long its changes persist. The washdown valve logs also gave the number of washdowns each day: 163 over the 40 days, a mean of 4.1, with a day-to-day variance of 3.9, close to the mean, as a Poisson process requires.

That last check matters. If washdowns were scheduled, say one at the end of each two-hour run, their count would vary much less than its mean, and the chance of three falling close together would be much smaller than a Poisson model gives. Before treating any input as random, check from the records that it really behaves that way.

### Simulation over time, not just over cases

Many engineers have built a Monte Carlo spreadsheet: random values are drawn for several uncertain inputs, the result is calculated for each draw, and the results are collected into a distribution, as in the chapter on Monte Carlo in [Prototypes and Simulation by the Numbers](/reados/publications/prototypes-and-simulation-by-the-numbers/monte-carlo-for-the-working-day/). That works when the inputs are fixed numbers that are merely uncertain. BT-1's inputs are not fixed numbers: they are processes that change from second to second, and the tank's level at any moment depends on the whole history of the inflow over the previous hour or so. Each simulated day therefore has to be built up by stepping through time, drawing a fresh random increment for each step. The mathematics of that stepping is what this book is about, and it has pitfalls that a spreadsheet Monte Carlo never meets.

## The error: the average-input calculation

The first answer to the environmental officer's questions came from a spreadsheet. Four washdowns of 1.44 m³ a day add 5.76 m³ over 16 hours, an average of 0.1 L/s. The average inflow is therefore 2.1 L/s, which settles the tank at 0.90 m, half the level at which the discharge limit is reached and a third of the overflow level. The spreadsheet then checked a washdown: starting at 0.82 m, an extra 3.0 L/s for 8 minutes raises the level to a peak of 1.24 m, still far below 1.85 m. Even two washdowns back to back peak at 1.60 m. The spreadsheet concluded that the discharge limit could not be exceeded and overflow was impossible.

The tank's own level transmitter, LT-1, disagreed. Its log for the last 40 production days showed the level above 1.85 m on 2 of them, and the plant had no explanation. Nothing was wrong with the transmitter or the orifice. The spreadsheet was wrong because it replaced each random input with a single typical value and so removed exactly the coincidences that cause exceedances: three washdowns within half an hour, which a Poisson process with four a day produces more often than intuition suggests, or two washdowns arriving while the process flow happens to be running a litre a second above its average.

```figure
type: compare
title: Peak level in BT-1 by scenario
rowhead: Scenario
cols: Peak level | Above the 1.85 m limit?
caption: This is an illustration. Deterministic calculations from 0.82 m with the process flow held at 2.0 L/s. The logged exceedances need either three washdowns close together or washdowns coinciding with high process flow, combinations that a calculation with typical values never considers.
- Average inflow, 2.1 L/s | 0.90 m | No
- One washdown | 1.24 m | No
- Two washdowns back to back | 1.60 m | No
- * Three washdowns back to back | 1.92 m | Yes
- Logged, 40 production days | above 1.85 m on 2 days | Yes
```

The average-input calculation is not useless. It gives the typical level, the time constant and the size of one washdown's effect, all of which are needed to understand the tank. But it cannot answer questions about how often, because those depend on the full distribution of the inputs and on how they combine over time.

## Why not just calculate the distribution?

For some systems the distribution of the output can be calculated exactly. A linear system driven by Gaussian noise has a Gaussian output whose variance follows from the input's spectrum, and the chapters on correlated noise in [Random Error and Drift by the Numbers](/reados/publications/random-error-and-drift-by-the-numbers/correlated-noise/) and on spectra in Random Vibration by the Numbers use such results. BT-1 defeats exact methods three ways: its outflow is nonlinear in the level, its inflow includes discrete random events, and the questions concern limits, the first time the level reaches 1.85 m or 2.50 m, which are hard to calculate even for simple linear systems. Simulation handles all three.

A stochastic simulation generates one realisation of the random inputs, a single possible production day, steps the equation forward through it, and records what happened: the peak level, the time above 1.85 m, whether the tank overflowed. It then repeats this for thousands of independent days and counts. The answers are estimates, with a precision that depends on the number of days simulated, and they are only as good as the model of the inputs.

```figure
type: steps
title: What a stochastic simulation of BT-1 must do
caption: Each step is the subject of a chapter. Leaving any one out is the source of a typical error in simulation studies.
- Generate random numbers | Uniform and Gaussian, tested, reproducible from a seed: Chapter 2.
- Step the equation | The Euler–Maruyama step for white noise: Chapter 3.
- Model correlated inputs | Process flow as exponentially correlated noise: Chapter 4.
- Choose the method and time step | Heun's method and a convergence test: Chapter 5.
- Count enough runs | Confidence intervals for means and probabilities: Chapter 6.
- Catch every crossing | First-passage times without missing crossings between steps: Chapter 7.
- Add events | Poisson washdowns and switching rules: Chapter 8.
- Estimate the rare | Overflows that happen once in years: Chapter 9.
- Check and decide | Verify, validate, compare options: Chapter 10.
```

## What the simulation should report

The environmental officer's questions translate into specific outputs per simulated day: the daily maximum level, the total time above 1.85 m, the number of separate exceedances, and whether the level reached 2.50 m. Across many days these give the fraction of days with an exceedance and its confidence interval, the distribution of exceedance durations, and the overflow frequency. Every reported number should carry its own uncertainty from the finite number of runs, and the report should state the model's assumptions, so that the reader can see what the numbers depend on. A probability without its interval, or a model without its assumptions, invites the reader to trust it more than it deserves, and that is how simulation results acquire an authority they have not earned. Chapter 10 returns to the form of the report.

### The answer, in advance

To show where the book is going: once the model is built and checked, 100,000 simulated production days give an exceedance of the 3.0 L/s limit on **5.3% of days**, consistent with the 2 days in 40 logged, and an overflow on 24 of the 100,000 days, an expected interval of about **17 years** at 240 production days a year. Neither number could have come from the spreadsheet. The rest of the book shows how to get them right, how precise they are, and how to use the model to reduce both.

## How this applies to a small Australian business

Whenever the question is "how often" or "how likely", and the inputs vary at random, an average-input calculation will understate the risk, sometimes completely. Before building a simulation, write down the equation for the equipment, the time constant that sets which variations matter, and a description of each random input from records. Compare any calculation with whatever the plant's own logs show; a logged event the calculation says is impossible is the clearest sign that variation, not averages, is driving the outcome.

## Exercise: a steadier factory

Suppose the process flow averaged 2.5 L/s instead of 2.0 L/s, with the same tank and orifice. (a) What is the steady level? (b) What is the time constant near that level? (c) Starting from that steady level, roughly how much level margin remains below the 1.85 m limit, compared with the present case, and what does that suggest about exceedances?

**Worked answer.** (a) h = (0.0025 ÷ 4.99 × 10⁻⁴)² ÷ (2 × 9.81) = 25.1 ÷ 19.62 = **1.28 m**. (b) τ = 2 × 3.14 × 1.28 ÷ 0.0025 = **3,220 s, about 54 minutes**. (c) The margin to 1.85 m falls from 1.03 m to **0.57 m**, a little over half. A single washdown, which raises the level by roughly 0.4 m, would bring the tank close to the limit, and two in quick succession would exceed it. Exceedances would become a frequent, not occasional, event; only a simulation would say how frequent.
