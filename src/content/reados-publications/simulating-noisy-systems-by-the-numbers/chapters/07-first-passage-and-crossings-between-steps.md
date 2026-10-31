---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: first-passage-and-crossings-between-steps
order: 7
title: "First passage and crossings between steps"
description: "Simulating the time for a noisy quantity to first reach a limit, the exact answer for drift with white noise, why coarse steps miss crossings, and the bridge correction that recovers them."
draft: false
---

Many of the most important questions about a noisy system are first-passage questions: how long until the level first reaches the overflow, the temperature first reaches the trip, the wear first reaches the limit. A simulation answers them by stepping forward and stopping at the first step beyond the limit. That sounds straightforward, but it hides a trap. A noisy path can cross a limit and come back between two steps, and a simulation that only looks at the ends of each step never sees the crossing. The first-passage time comes out too long, and the probability of reaching the limit within a given time comes out too small, which is exactly the wrong direction for a safety question.

This chapter calculates BT-1's time to overflow after an outlet blockage, compares the simulation with the exact answer, measures how much a coarse step misses, and applies the correction that recovers the missed crossings. Its error is an alarm response time judged from uncorrected simulations, which made the risk look smaller than it was.

## The question: a blocked outlet

Chapter 3 noted that a blocked orifice plate is a credible fault at BT-1. With the outlet blocked, the level rises at the mean inflow rate with the inflow's fluctuations on top. BT-1 has a high-level alarm, LAH-1, at 1.60 m. When it sounds, an operator is expected to go to the tank, find the cause and either clear the blockage or stop the washdowns before the level reaches the overflow at 2.50 m. The environmental officer asked: if the outlet blocks during production, how long does the operator have after the alarm, and what is the chance the tank overflows within 20 minutes of it?

From the alarm level to the overflow is 0.90 m. With the outlet blocked and no washdown running, the level rises on average at 0.002 ÷ 3.14 = 0.000637 m/s, so on average it takes 0.90 ÷ 0.000637 = 1,414 s, about 23.6 minutes. The question is about the spread around that average, and particularly the early end of it.

## The exact answer

For a quantity that drifts at a constant rate μ with white noise of intensity σ, the time to first reach a distance d has a known distribution, the **inverse Gaussian**. Its mean is d ÷ μ and its standard deviation is √(d σ² ÷ μ³). Its cumulative distribution has a closed form in terms of the standard normal distribution, so the probability of reaching the limit within any time can be calculated directly.

For the blocked-outlet case, using the white-noise model of Chapter 3, μ = 0.000637 m/s and σ = 0.00394 m per √s. With d = 0.90 m:

- mean time to overflow: **23.6 minutes**;
- standard deviation: √(0.90 × 0.00394² ÷ 0.000637³) = 233 s, **3.9 minutes**;
- probability of overflow within 20 minutes of the alarm: **18.0%**.

```figure
type: formula
title: First passage of a drifting noisy quantity
formula: mean = d ÷ μ     standard deviation = √(d σ² ÷ μ³)     P(T ≤ t) = Φ((μt − d) ÷ σ√t) + e^(2μd ÷ σ²) Φ(−(μt + d) ÷ σ√t)
caption: The inverse Gaussian distribution, exact for constant drift and white noise. It is the reference against which the simulation's first-passage times are tested.
- d | distance from the start to the limit, m
- μ | drift, m/s
- σ | white-noise intensity, m per √s
- Φ | standard normal cumulative distribution
step: BT-1, alarm to overflow: d = 0.90 m, μ = 0.000637 m/s, σ = 0.00394 m per √s
step: Mean 23.6 min, standard deviation 3.9 min, P(T ≤ 20 min) = 0.180
```

An exact answer exists here only because the model has been simplified: constant drift, white noise, no washdowns. The real question, with washdowns arriving during the rise and the process flow's memory, needs a simulation, and the simplified case is how the simulation is tested before it is trusted.

## Simulating the first passage

The engineer simulated 40,000 blocked-outlet rises with the Euler–Maruyama step, which is exact at the step points for this constant-drift case, and recorded the first step at which the level passed 2.50 m. To avoid a trivial bias from recording the crossing at the end of a step, the crossing time was interpolated linearly within the step. The results still came out wrong, and more wrong the coarser the step.

```figure
type: compare
title: Alarm-to-overflow time with the outlet blocked, 40,000 simulated rises
rowhead: Time step
cols: Mean time, uncorrected | P(within 20 min), uncorrected | Mean time, corrected | P(within 20 min), corrected
caption: This is an illustration. Exact values 23.56 minutes and 0.180. Uncorrected simulations miss crossings between steps, so they overstate the time and understate the early-overflow probability; the bridge correction recovers both. Sampling error on each probability is about ±0.004.
- 1 s | 23.63 min | 0.172 | 23.53 min | 0.180
- 10 s | 23.71 min | 0.168 | 23.57 min | 0.178
- 60 s | 23.85 min | 0.164 | 23.62 min | 0.181
- * 120 s | 23.89 min | 0.154 | 23.66 min | 0.181
```

The mean time is only slightly biased, by a few tenths of a minute. The probability of an early overflow is biased much more: at a 120 s step the uncorrected simulation gives 15.4% against an exact 18.0%, a seventh too low. Even at a 1 s step it is 4% low, and the bias falls only slowly as the step shrinks, roughly with its square root, so refining the step is an expensive cure.

## Why crossings go missing

A path driven by white noise is extremely rough: over any short interval it wanders by an amount proportional to the square root of the interval, so the shorter the interval, the larger its wander relative to its drift. Between two steps that both lie below the limit, a path that came close to the limit at the first step may well have touched it and come back. The simulation, which knows only the two end points, cannot see that. The paths that cross early are disproportionately those that touch the limit briefly at first, so the missed crossings are concentrated exactly in the early tail of the first-passage distribution.

## The bridge correction

The correction uses a known result for Brownian motion. Given that a path with constant noise intensity σ is at x₀ at the start of a step of length h and at x₁ at its end, both below a limit b, the probability that it crossed b in between is

P(crossed) = exp(−2 (b − x₀)(b − x₁) ÷ (σ² h))

The probability is close to one when both end points are near the limit and falls rapidly as either moves away. At each step that ends below the limit, the simulation calculates this probability, draws a uniform random number, and if the number is smaller, records a crossing within that step. With the correction, the table above shows the probability of an early overflow back at 18% at every step, and the mean time within a few hundredths of a minute of exact. Mannella's papers, in the source volume and in the references, treat the same correction for general drifts, where it holds approximately over each short step.

```figure
type: steps
title: First passage with the bridge correction, one step
caption: The correction costs one exponential and one uniform draw per step, and it is only needed for steps near the limit.
- Take the step | From x₀ to x₁ with the usual Euler–Maruyama or Heun update.
- If x₁ is beyond the limit | Record a crossing, interpolating the time within the step.
- Otherwise compute the bridge probability | exp(−2 (b − x₀)(b − x₁) ÷ (σ² h)).
- Draw a uniform number | If it is below the probability, record a crossing within the step.
- Otherwise carry on | Most steps far from the limit have a negligible probability and can skip the draw.
```

### When the correction is not needed

The correction is for paths driven directly by white noise, which are rough at every scale. BT-1's production model is different: the process flow is an Ornstein–Uhlenbeck process with a two-minute memory, and the level is its integral, so the level's path is smooth over intervals much shorter than two minutes. A smooth path cannot cross a limit and return within a 10 s step unless it was already almost exactly at the limit. The engineer checked by detecting exceedances of 1.85 m in 10,000 production days at three steps: 30 s gave exceedances on 5.69% of days, 10 s on 5.50% and 2 s on 5.43%, with 678, 662 and 660 separate exceedances. The change from 10 s to 2 s is within sampling error. The bridge correction matters when the quantity crossing the limit is driven by white noise or by noise much faster than the step; when the input has memory longer than the step, a sensible step is enough.

## The full model

With the simplified case verified, the engineer ran the real question through the production model: 20,000 production days, each with an outlet blockage at a random time between the first and the fifteenth hour, the correlated process flow and Poisson washdowns, which keep arriving after the blockage because nobody yet knows about it. For each day the simulation recorded when the level reached the alarm and when it reached the overflow.

```figure
type: compare
title: Alarm-to-overflow time after an outlet blockage
rowhead: Model
cols: Mean time | Chance of overflow within 20 minutes
caption: This is an illustration. The simplified model is exact; the full model is simulated over 20,000 days with blockages at random times. Washdowns arriving during the rise shorten it, and they shorten the early tail most.
- Constant drift and white noise, exact | 23.6 min | 18%
- * Full model with washdowns and correlated flow | 22.5 min | 26%
```

The mean time falls by only about a minute, but the chance of an early overflow rises by almost half, because a washdown running during the rise adds 3.0 L/s, more than doubling the rate of rise for its 8 minutes. As with the uncorrected simulation, the early tail is where the important differences are, and a summary that reported only the mean would have hidden them.

### Stopping at the limit, or carrying on

A first-passage simulation usually stops at the limit, because the question is when it is first reached. A simulation of whole days that counts overflows must not stop there: in reality the overflow weir caps the level at about 2.50 m and the surplus spills, and the day carries on. The production model therefore carries each day on past an overflow and counts the overflow day once, on entry. Above 2.50 m it keeps only the orifice outflow, without the spill over the weir, so the simulated level rises higher and takes longer to recover than the real one would. That simplification does not change the count of overflow days, which is the output reported, but it would distort anything measured after an overflow, such as the time above the discharge limit on that day. Stopping the simulated day at the first overflow would understate later exceedances on the same day. The general rule is that the limits in a model should behave as the physical limits do, or the outputs should be chosen so that the difference cannot affect them, and the report should say which.

## The error: a response time judged too generously

Before the alarm question reached the engineer, a contractor had simulated the blocked-outlet case with a 2-minute step, without the correction, and reported that the tank overflowed within 20 minutes of the alarm in **15%** of simulated blockages. The plant's procedure, written from that report, gave the operator a response target of 20 minutes, with the reasoning that 85% of blockages would leave at least that long.

The engineer's exact calculation gave 18%, and the corrected simulation agreed. The difference, three percentage points, was not sampling error: with 40,000 runs, the standard error was about 0.2 points. It was the missed crossings of a coarse, uncorrected step, and it had made the risk look a fifth smaller than it was. And because a real blockage would often coincide with a washdown, adding 3.0 L/s for some minutes, the engineer's full simulation, with washdowns and correlated process flow, found an early overflow within 20 minutes of the alarm in about **26%** of blockages, with blockages placed at random times through 20,000 simulated production days.

The procedure was changed: the alarm now also stops any washdown that has not yet started, and the operator's response target was cut to 10 minutes. The general lesson is that first-passage simulations must either use a step fine enough that missed crossings are demonstrably negligible, by a convergence test on the probability being reported, or apply the bridge correction, and that the probability of an early passage is far more sensitive to the step than the mean time is.

## How this applies to a small Australian business

When you simulate how long it takes for something noisy to reach a limit, test the code on a constant-drift, white-noise case, where the inverse Gaussian gives the exact answer. Watch the early tail, not just the mean: the chance of reaching the limit quickly is what sets alarm response times, and it is what coarse steps get most wrong. If the quantity crossing the limit is driven by white noise or very fast noise, add the bridge correction; if its input has a memory much longer than the step, a convergence test is usually enough.

## Exercise: an earlier alarm

The plant considers moving LAH-1 from 1.60 m down to 1.40 m. Using the white-noise model with the outlet blocked and no washdowns, (a) what are the mean and standard deviation of the time from the alarm to overflow? (b) Is the chance of overflow within 20 minutes of the alarm larger or smaller than 18%, and roughly how large? (c) Why might the earlier alarm cause a problem in normal running?

**Worked answer.** (a) d = 2.50 − 1.40 = 1.10 m, so the mean is 1.10 ÷ 0.000637 = 1,727 s, **28.8 minutes**, and the standard deviation is √(1.10 × 0.00394² ÷ 0.000637³) = 258 s, **4.3 minutes**. (b) **Much smaller.** Twenty minutes is now (28.8 − 20) ÷ 4.3 = 2.0 standard deviations below the mean; the inverse Gaussian is skewed towards long times, which thins its early tail, so the probability is well under the normal tail of 2.3%: the formula gives **0.8%**. (c) In normal running, the 100,000-day simulation shows the daily maximum level exceeding 1.4 m on about two days in three, mostly during washdowns, so an alarm at 1.40 m would sound almost every day without any blockage. A nuisance alarm teaches operators to ignore it; a better design keeps the alarm at 1.60 m and adds a separate check, such as a rising level with no washdown running, that detects a blockage directly.
