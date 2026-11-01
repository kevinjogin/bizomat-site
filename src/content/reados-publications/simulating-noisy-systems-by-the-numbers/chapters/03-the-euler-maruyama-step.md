---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: the-euler-maruyama-step
order: 3
title: "The Euler–Maruyama step"
description: "White noise and the Wiener process, why random increments scale with the square root of the time step, the Euler–Maruyama method, an exact test case, and the noise intensity of a fast input."
draft: false
---

A deterministic differential equation is stepped forward by multiplying its rate of change by a small time step and adding the result. Engineers have done this since the first spreadsheets, and the method, Euler's, needs no explanation. Adding randomness seems to need only one more term: a random number times the time step. That obvious extension is wrong, and the reason it is wrong is the single most important idea in simulating noisy systems. Random increments do not grow in proportion to the time over which they act, but in proportion to its square root.

This chapter introduces white noise and the Wiener process, derives the Euler–Maruyama step, works out the noise intensity of BT-1's process flow, and tests the step against an exact result. Its error is the obvious extension, which made the answer depend on the time step.

## A random walk in the tank

Start with the simplest case. Suppose BT-1's orifice is blocked, so nothing leaves the tank, and the inflow consists of a steady 2.0 L/s plus very rapid fluctuations. The level then rises steadily, at 0.002 ÷ 3.14 = 0.00064 m/s, and the fluctuations make it wander about that rising line. If the fluctuations are fast enough that each second's surplus or deficit is unrelated to the next, the wandering is a random walk: each second adds an independent random amount to the level.

Independent random amounts add in a particular way: their means add and their **variances** add. If each second adds a random amount with variance v, then after n seconds the accumulated wander has variance n × v and standard deviation √n × √v. The spread grows with the square root of time, not in proportion to it, because surpluses and deficits partly cancel. After 100 seconds the wander is 10 times one second's, not 100 times.

## White noise and the Wiener process

In the limit of infinitely fast, independent fluctuations, the accumulated wander is called a **Wiener process**, W(t), the mathematical model of Brownian motion. It has three defining properties: it starts at zero; its increment over any interval of length Δt is Gaussian with mean zero and variance Δt; and increments over non-overlapping intervals are independent. The derivative of a Wiener process does not exist in the ordinary sense, but engineers call it **white noise**: a signal with equal power at all frequencies and no memory from one instant to the next.

A system driven by white noise is written as a stochastic differential equation:

dX = f(X) dt + g dW

where f(X) is the deterministic rate of change, the drift, and g is the noise intensity, which sets how strongly the white noise drives the system. For BT-1 with the outlet blocked, X is the level, f = Q̄ ÷ A is constant and g is the intensity of the inflow fluctuations divided by the area.

## The Euler–Maruyama step

Over a small step h, the drift contributes f(X) × h, as in Euler's method. The noise contributes g times the increment of the Wiener process over the step, which is Gaussian with variance h, that is, √h × Z, where Z is a standard Gaussian number. The step is

X(n+1) = X(n) + f(X(n)) × h + g × √h × Z(n)

with a fresh, independent Z for every step. This is the **Euler–Maruyama method**, the stochastic counterpart of Euler's method. The √h is the whole point: it makes the variance added per step proportional to h, so that the variance added over a fixed time is the same however finely the time is divided.

```figure
type: formula
title: The Euler–Maruyama step
formula: X(n+1) = X(n) + f(X(n)) × h + g × √h × Z(n)
caption: The drift term scales with h and the noise term with √h, so that the variance added over a fixed time does not depend on the step. Z(n) must be a fresh standard Gaussian draw at every step.
- f(X) | drift: deterministic rate of change
- g | noise intensity, units of X per √second
- h | time step, s
- Z(n) | independent standard Gaussian number
step: Variance added per step: g² × h
step: Variance added over a time T: (T ÷ h) × g² × h = g² × T, whatever h is
```

### When the noise depends on the state

In BT-1 the noise is additive: the size of the inflow fluctuations does not depend on the level. In some systems it does. The friction on a slider might fluctuate in proportion to the load, or a gain might vary randomly so that the noise term is g(X) × dW. For such multiplicative noise, a subtle question arises about where within each step g(X) should be evaluated, and the two standard answers, named after Itô and Stratonovich, give different results. Euler–Maruyama, which evaluates g at the start of the step, converges to the Itô answer. Noise in physical systems usually arises from fluctuations that are fast but not infinitely fast, and for those the Stratonovich answer is normally the physically correct one; the Heun method of Chapter 5 converges to it. For additive noise, as in BT-1, the two coincide and the question does not arise, but it is worth knowing it exists before simulating anything with a random gain, a random stiffness or a random friction coefficient.

The method is simple to write, needs one Gaussian number per step and works for any drift. Its accuracy, and the better method of Chapter 5, depend on the drift being nearly constant over each step; for now the drift is constant and the method is exact.

## The noise intensity of a fast input

BT-1's process flow is not white noise: its fluctuations, with a standard deviation of 0.8 L/s, persist for about two minutes. But the tank's time constant is 43 minutes, more than twenty times longer, so over the tank's own time scale the fluctuations look nearly independent. A fluctuating input whose standard deviation is σ and whose correlation time is τc, much shorter than the system's, acts on the system like white noise of intensity

g = σ × √(2 τc)

For the process flow, that is 0.8 × √(2 × 120) = **12.4 L/s per √s**, and in terms of the level, dividing by the plan area of 3.14 m² = 3,140 L per metre, 0.0039 m per √s. The formula comes from asking what white noise would give the same accumulated variance over long times as the real, correlated input; Chapter 4 derives it from the exponential correlation and shows when it fails.

## Testing the step against an exact result

With the outlet blocked and the white-noise approximation, the level after a time T has an exact distribution: mean rise Q̄ × T ÷ A, standard deviation (g ÷ A) × √T. Over 30 minutes, 1,800 s, that is a mean rise of 0.002 × 1,800 ÷ 3.14 = **1.146 m** and a standard deviation of 0.0039 × √1,800 = **0.167 m**. The engineer simulated 10,000 such half-hours with the Euler–Maruyama step at four step lengths.

```figure
type: compare
title: Level rise in 30 minutes with the outlet blocked, 10,000 simulated runs
rowhead: Time step
cols: Mean rise | Standard deviation | Exact
caption: This is an illustration. With constant drift and white noise, Euler–Maruyama is exact at any step; the scatter between rows is sampling error, about ±0.0012 m in the standard deviation for 10,000 runs.
- 60 s | 1.146 m | 0.166 m | 1.146 m, 0.167 m
- 10 s | 1.145 m | 0.170 m | 1.146 m, 0.167 m
- 5 s | 1.145 m | 0.166 m | 1.146 m, 0.167 m
- 1 s | 1.147 m | 0.167 m | 1.146 m, 0.167 m
```

All four step lengths reproduce the exact mean and standard deviation, as they should: with constant drift and additive white noise, Euler–Maruyama introduces no error from the step length. The remaining differences, a few thousandths of a metre, are sampling error from using 10,000 runs, which Chapter 6 shows how to calculate. This kind of test, against a case with a known exact answer, is the first and most valuable check of any simulation code, and Chapter 10 builds a list of them.

The case is not purely academic. A blocked orifice plate is a credible fault at BT-1, since debris from washdowns can lodge in it, and the test tells the plant that from the normal level of 0.82 m, a blocked outlet brings the tank to about 1.97 m in 30 minutes, with a standard deviation of 0.17 m: at that rate the overflow level of 2.50 m would be reached in about 44 minutes on average. Chapter 7 calculates that time properly, as a first-passage time with its own spread.

## When the white-noise approximation is good enough

The real process flow has a correlation time of 120 s, not zero. For the blocked-outlet case, the exact variance of the accumulated inflow over a time T, for exponentially correlated fluctuations, is 2σ²τc × [T − τc(1 − e^(−T/τc))]. Over 1,800 s it gives a standard deviation of the level of **0.162 m**, against 0.167 m from the white-noise approximation, 3% higher. The approximation slightly overstates the spread because it treats the first two minutes, before the correlated fluctuations have had time to average out, as if they had. For times many correlation times long, the two agree; for times of the order of τc, they do not, and the correlated model of Chapter 4 is needed.

```figure
type: compare
title: Spread of BT-1's level: white-noise approximation against correlated input
rowhead: Case
cols: White-noise approximation | Exponentially correlated input | Difference
caption: Exact results for the two inflow models with σ = 0.8 L/s and τc = 120 s. The approximation is good where the time scale of interest is many times the input's correlation time.
- Outlet blocked, after 30 minutes | 0.167 m | 0.162 m | +3%
- * Normal outlet, steady fluctuations about 0.82 m | 0.142 m | 0.138 m | +2%
- Outlet blocked, after 2 minutes | 0.043 m | 0.026 m | +65%
```

The second row uses the linearised tank of Chapter 1, with its 43-minute time constant: the steady fluctuation of the level about 0.82 m has a standard deviation of g ÷ A × √(τ ÷ 2) = 0.142 m with white noise, and 0.138 m with the correlated input. The difference matters little for BT-1's daily maximum, but it matters a great deal for anything that happens within a few minutes, such as the rise during a washdown. The engineer therefore used correlated noise for the production model and kept the white-noise version for exact tests.

## The error: noise times the time step

The engineer's first script used the obvious step, X(n+1) = X(n) + f × h + g × h × Z, with the noise scaled by h like the drift. On the blocked-outlet test with a 1 s step it gave a standard deviation of 0.166 m, matching the exact result, and the error went unnoticed. The production runs used a 10 s step to save time, and the engineer, as a routine check, repeated one batch at 5 s. The standard deviation of the 30-minute rise came out as **0.531 m** at 10 s, **0.375 m** at 5 s and 0.166 m at 1 s.

A result that changes by a factor of three when the step changes by a factor of ten is not converging; it is wrong. With the noise scaled by h, each step adds variance g² h², and over a time T the total is (T ÷ h) × g² h² = g² h T, proportional to the step. At h = 1 s, by coincidence, that equals the correct g² T, which is why the first test passed. The fix was to scale the noise by √h, after which all step lengths agreed. Two lessons follow: always test the noise term at more than one step length, and never test only at a step of exactly 1 in whatever units the model uses, because that is where √h and h coincide.

A related mistake is reusing a random number. If a model has two noisy inputs, each step needs two independent draws; using the same Z for both makes the inputs perfectly correlated, which roughly doubles their combined effect when they add and cancels it when they subtract. The same test catches it: run a case where the combined spread can be calculated, and compare.

## How this applies to a small Australian business

For any simulation with random inputs, write the model as a drift plus a noise term, and step it with the noise scaled by the square root of the time step. Convert fast-fluctuating inputs to a white-noise intensity with σ × √(2 τc), but only when the system responds much more slowly than the input fluctuates. Before trusting the code, run a case with an exact answer, such as a constant drift with white noise, at two or three step lengths; the mean and spread should not change with the step.

## Exercise: a smaller tank

A proposed replacement for BT-1 would have a plan area of 2.0 m² instead of 3.14 m². With the outlet blocked, the same inflow of 2.0 L/s and the same fluctuations, (a) what are the mean rise and the standard deviation of the level after 30 minutes, using the white-noise approximation? (b) Starting from 0.82 m, roughly how long would it take on average to reach 2.50 m? (c) Why does the spread scale with 1 ÷ A, the same as the mean?

**Worked answer.** (a) Mean rise = 0.002 × 1,800 ÷ 2.0 = **1.80 m**. The intensity in level terms is 12.4 L/s per √s ÷ 2,000 L/m = 0.0062 m per √s, so the standard deviation is 0.0062 × √1,800 = **0.263 m**. (b) The distance is 2.50 − 0.82 = 1.68 m at 0.002 ÷ 2.0 = 0.001 m/s, so about **1,680 s, 28 minutes**, on average. (c) Both the steady inflow and its fluctuations are volumes per second; the area converts any volume into a level, so dividing by a smaller area enlarges the mean rise and the random wander in the same proportion.
