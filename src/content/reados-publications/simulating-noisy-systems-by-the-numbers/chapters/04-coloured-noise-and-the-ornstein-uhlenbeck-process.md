---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: coloured-noise-and-the-ornstein-uhlenbeck-process
order: 4
title: "Coloured noise and the Ornstein–Uhlenbeck process"
description: "Modelling inputs whose fluctuations persist, the exponentially correlated Ornstein–Uhlenbeck process, its exact update, why the Euler step distorts it, and checking a correlated input's spread fairly."
draft: false
---

Real inputs have memory. When BT-1's process flow runs high, because a rinse has started or a holding tank is draining, it tends to stay high for a minute or two before wandering back. White noise has no memory at all, and Chapter 3 showed that treating the process flow as white is good enough for slow questions and wrong for fast ones, such as the level's rise during an 8-minute washdown. Noise with memory is called coloured, because its power is concentrated at low frequencies rather than spread evenly across them like white light, and the simplest and most useful model of it is the Ornstein–Uhlenbeck process.

This chapter defines the process, gives its exact update for any time step, compares that with the Euler–Maruyama step, which distorts it, and checks the simulated process flow against its intended properties. Its error is a statistical test applied to correlated samples as if they were independent, which flagged a correct generator as faulty.

## The Ornstein–Uhlenbeck process

The Ornstein–Uhlenbeck process, named after the two physicists who used it in 1930 to describe the velocity of a Brownian particle, is the noise you get by passing white noise through a first-order lag. Its equation is

dη = −(η ÷ τc) dt + σ × √(2 ÷ τc) dW

The first term pulls η back towards zero with time constant τc; the second kicks it at random. The balance between the two gives a stationary process with three properties that make it convenient:

- it is Gaussian, with mean zero and standard deviation σ;
- its autocorrelation decays exponentially, e^(−|s| ÷ τc) at a lag s, so τc is its correlation time;
- its spectrum is flat below a corner frequency of 1 ÷ (2π τc) and falls away above it.

For BT-1's process flow, σ = 0.8 L/s and τc = 120 s: the flow's departures from its 2.0 L/s mean have a standard deviation of 0.8 L/s and a correlation of e⁻¹ = 0.37 after two minutes, and the spectrum's corner is at 1 ÷ (2π × 120) = 0.0013 Hz, a period of about 12.6 minutes.

```figure
type: formula
title: The Ornstein–Uhlenbeck process and its white-noise limit
formula: dη = −(η ÷ τc) dt + σ √(2 ÷ τc) dW     autocorrelation = e^(−|s| ÷ τc)     equivalent white-noise intensity = σ √(2 τc)
caption: Integrating the autocorrelation over all lags gives 2σ²τc, which is why a coloured input acts on a slow system like white noise of intensity σ√(2τc), the result used in Chapter 3.
- η | fluctuation of the input about its mean, L/s
- σ | standard deviation of the fluctuation, L/s
- τc | correlation time, s
- s | lag between two moments, s
step: BT-1: σ√(2τc) = 0.8 × √240 = 12.4 L/s per √s
```

### Where the parameters come from

The engineer estimated σ and τc from FT-1's 10-second log of process flow, with washdown periods removed. The standard deviation is the sample standard deviation of the flow about its mean. The correlation time came from the autocorrelation of the log: it fell to 0.60 at a lag of 60 s, 0.37 at 120 s and 0.14 at 240 s, close to e^(−s ÷ 120) at each lag. An autocorrelation that falls exponentially is the signature of an Ornstein–Uhlenbeck process; one that does not, for example one with a hump at the period of a cyclic process, needs a richer model, often a sum of two processes with different correlation times or a second-order filter.

## The exact update

Because the process is linear, its value one step h ahead, given its value now, is known exactly: it is Gaussian with mean η × e^(−h ÷ τc) and variance σ²(1 − e^(−2h ÷ τc)). The exact update, set out by D. T. Gillespie in the reference, is therefore

η(n+1) = a × η(n) + σ × √(1 − a²) × Z(n),   a = e^(−h ÷ τc)

It is exact for any step length, however large, and costs one Gaussian draw per step, the same as Euler–Maruyama. With h = 10 s and τc = 120 s, a = 0.920 and the random kick has a standard deviation of 0.8 × √(1 − 0.920²) = 0.31 L/s. The process flow in the production model uses this update.

The engineer checked it by generating 400,000 steps and measuring the autocorrelation at four lags.

```figure
type: compare
title: Autocorrelation of the simulated process flow
rowhead: Lag
cols: Simulated | e^(−lag ÷ 120 s)
caption: This is an illustration. 400,000 steps of 10 s with the exact update. The match is within sampling error at every lag; at 480 s both are small and the difference is noise.
- 60 s | 0.606 | 0.607
- 120 s | 0.368 | 0.368
- 240 s | 0.139 | 0.135
- 480 s | 0.028 | 0.018
```

## Why not Euler–Maruyama?

The Euler–Maruyama step for the same equation is η(n+1) = η(n) − (η(n) ÷ τc) × h + σ × √(2h ÷ τc) × Z(n). It looks almost the same, and for steps much shorter than τc it nearly is. But it is an approximation, and its error grows with the step. Its stationary variance works out at σ² ÷ (1 − h ÷ 2τc): too large by a factor that is small for small steps and becomes infinite at h = 2τc, where the method goes unstable.

```figure
type: compare
title: Standard deviation of the simulated process flow by method and step
rowhead: Time step
cols: Exact update | Euler–Maruyama | Euler–Maruyama, theory
caption: This is an illustration. 200,000 steps each; target 0.800 L/s. The exact update is right at every step. Euler–Maruyama overstates the spread by 2% at 10 s, 15% at 60 s and 41% at 120 s, and at 240 s it would grow without limit.
- 10 s | 0.802 L/s | 0.819 L/s | 0.817 L/s
- * 60 s | 0.801 L/s | 0.924 L/s | 0.924 L/s
- 120 s | 0.800 L/s | 1.130 L/s | 1.131 L/s
- 200 s | 0.799 L/s | 1.950 L/s | 1.960 L/s
```

The error is not only in the spread. With a step comparable to τc, the Euler version's correlation from one step to the next is 1 − h ÷ τc instead of e^(−h ÷ τc): 0.50 instead of 0.61 at 60 s, and zero instead of 0.37 at 120 s. The input then has the wrong memory as well as the wrong size. There is no reason to accept either error, since the exact update is no more expensive, so the rule for any linear noise model is to use its exact update.

### What a 15% error does to the answers

The engineer measured the effect on BT-1 directly, by running 20,000 days with the process flow's standard deviation raised from 0.8 to 0.924 L/s, the value an Euler update with a 60 s step would produce, and comparing with the same 20,000 days at the correct value. The discharge limit was exceeded on **7.0%** of days instead of **5.5%**. A model error in an input's spread that would hardly show in a plot of the flow changes the answer to the plant's first question by over a quarter, because exceedances are a tail event and tails are sensitive to spread.

## Starting each day in the right state

A simulated day has to start somewhere, and both the process flow and the tank level need starting values. If the process flow is started at exactly its mean, η = 0, the first few minutes of every simulated day have less variation than real days, because the process has not yet had time to wander. The fix is to draw the starting value from the stationary distribution, a Gaussian with standard deviation σ, which is what the exact update would have produced after a long run. The production model does this.

The tank level is a different matter, because its time constant is 43 minutes and a real day does not start in a steady state: the tank has drained overnight. The engineer started each day at 0.82 m, the steady level for the mean process flow, which is close to where the logs showed the level an hour into production, and checked the sensitivity: over the same 20,000 days, starting at 0.5 m gave exceedances on 5.3% of days, 0.82 m on 5.5% and 1.1 m on 5.8%. The effect is small but not nothing, because a day that starts high can reach the limit in its first hour, before the start has been forgotten. Since the logs support 0.82 m, the engineer kept it and recorded the sensitivity as one of the model's assumptions. A model whose results did depend on the starting state would need a warm-up period, discarded from the results, long enough for the start to be forgotten: several of the slowest time constants.

## Richer coloured noise

Not every input's autocorrelation falls as a single exponential. Two common departures have standard remedies, each built from Ornstein–Uhlenbeck pieces.

- **Two time scales.** An input with fast and slow variation, such as a flow with brief rinse surges and slow shift-long trends, has an autocorrelation that drops quickly and then decays slowly. A sum of two independent Ornstein–Uhlenbeck processes, each with its own σ and τc, reproduces it, and each is updated exactly.
- **A preferred period.** An input driven by a cycle, such as a batch process repeating every 20 minutes, has an autocorrelation that oscillates as it decays. Passing white noise through a lightly damped second-order filter, rather than a first-order lag, gives that shape; its update needs two state variables and is still linear, so it too has an exact form.

In each case the test is the same as above: the simulated input's autocorrelation and spread should match the log's.

## Coloured noise inside a model with a slower step

The production model of BT-1 steps the tank's level with Heun's method, the subject of Chapter 5, at 10 s. The process flow is updated exactly at the same 10 s step and held constant within each step. Holding the input constant over the step introduces a small error of its own, since the true input changes during the step, but with a correlation time twelve times the step the change within one step is small: the correlation from one step to the next is 0.92. If the input's correlation time were shorter than the step, the input would need either a shorter step or the more careful treatment Mannella describes in the source volume, which updates the input and its integral over the step together.

## Testing the spread of a correlated input

To check the production model's process flow, the engineer took one simulated production day of 5,760 ten-second values and found a sample standard deviation of 0.817 L/s, against the target 0.8 L/s. Is that close enough? The [standard deviation chi-square check](/tools/standard-deviation-chi-square-check/) tests a sample standard deviation against a target; its test assumes the sample values are independent and normally distributed.

## The error: 5,760 values that were really 240

The engineer's first entry used the raw count: a sample size of 5,760, a sample standard deviation of 0.817 and a target of 0.8, two-sided at 5%. The tool returned a chi-square statistic of 6,006 against critical values of 5,551 and 5,971, a p-value of 0.023 and the verdict that the spread differs from the target. Taken at face value, the generator was faulty.

It was not. The 5,760 values are not independent: with a correlation time of 120 s and a 10 s step, neighbouring values are 92% correlated, and the day contains far fewer independent pieces of information than values. For an exponentially correlated process observed over a time T much longer than τc, the effective number of independent values for estimating the variance is about T ÷ (2τc), a rough guide that here gives 57,600 ÷ 240 = **240**. Entered with a sample size of 240, the tool gave a statistic of 249 against critical values of 198 and 284, a p-value of 0.62 and a 95% interval for the true standard deviation of **0.75 to 0.90 L/s**: entirely consistent with 0.8. The long run of 200,000 steps in the table above, worth about 8,000 independent values, confirmed the generator to within a fraction of a per cent.

```figure
type: compare
title: The same day's spread tested two ways
rowhead: Sample size entered
cols: Chi-square statistic | Critical values | p-value | Verdict
caption: This is an illustration. Standard deviation chi-square check, sample standard deviation 0.817 L/s, target 0.8 L/s, two-sided at 5%. Treating correlated values as independent overstates the evidence by a factor of 24.
- 5,760, every value | 6,006 | 5,551 and 5,971 | 0.023 | Spread differs
- * 240, effective | 249 | 198 and 284 | 0.62 | Consistent with target
```

The lesson applies to every statistical test of simulation output, and of plant data: correlated samples carry less information than their number suggests, and any test or confidence interval that assumes independence will be overconfident. [Random Error and Drift by the Numbers](/reados/publications/random-error-and-drift-by-the-numbers/correlated-noise/) develops the effective number of samples for measurement data, and Chapter 6 returns to it for simulation output.

## How this applies to a small Australian business

When a random input has memory, measure its correlation time from a log, and if the autocorrelation falls roughly exponentially, model it as an Ornstein–Uhlenbeck process with the exact update. Use the white-noise approximation only for systems many times slower than the input. Check the simulated input against its intended spread and correlation, and when testing, count independent values, not samples. A 15% error in an input's spread can move a tail probability by a quarter.

## Exercise: a faster rinse cycle

A new filling line adds process flow fluctuations with σ = 0.5 L/s and a correlation time of 20 s, independent of the existing ones. (a) What is the exact update coefficient a for a 10 s step, and the standard deviation of each step's random kick? (b) What would Euler–Maruyama's stationary standard deviation be at a 10 s step? (c) What is the equivalent white-noise intensity of the new fluctuations, and how does the combined intensity compare with the old?

**Worked answer.** (a) a = e^(−10 ÷ 20) = **0.607**; the kick's standard deviation is 0.5 × √(1 − 0.607²) = 0.5 × 0.795 = **0.40 L/s**. (b) 0.5 ÷ √(1 − 10 ÷ 40) = 0.5 ÷ 0.866 = **0.577 L/s**, 15% too large. (c) 0.5 × √40 = **3.16 L/s per √s**. Independent intensities combine like standard deviations, so the total is √(12.4² + 3.16²) = **12.8 L/s per √s**, only 3% more than before: despite its sizeable standard deviation, the new input's short memory means it adds little to the tank's slow wander, though it would matter for anything that responds within a minute.
