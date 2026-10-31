---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: time-steps-accuracy-and-heuns-method
order: 5
title: "Time steps, accuracy and Heun's method"
description: "Why a nonlinear drift makes the time step matter, Heun's predictor–corrector step, checking the deterministic part against an exact drain time, and choosing the step by a convergence test."
draft: false
---

Chapter 3's test case had a constant drift, and for that Euler–Maruyama is exact at any step. BT-1's real drift is not constant: the outflow through the orifice grows with the square root of the level, so the rate at which the level changes depends on the level itself, and it changes during every step. A method that evaluates the drift only at the start of each step lags behind the truth, and the size of the lag depends on the step. Every simulation of a nonlinear system must therefore answer a question that the constant-drift case avoided: is the time step small enough?

This chapter introduces Heun's method, a predictor–corrector step that is much more accurate than Euler's for the same work, checks the deterministic part of the model against an exact drain time, and chooses the production time step by a convergence test. Its error is a time step chosen from the system's time constant alone, which biased the answer to the plant's first question.

## Why the drift matters

Over one step, the Euler–Maruyama method assumes the drift stays at its value at the start of the step. For BT-1 the drift is (Q_in − Cd a √(2gh)) ÷ A. During a washdown, while the level rises, the outflow is increasing through the step, but Euler uses the outflow at the start, which is too small. The level therefore rises a little too fast in every step, and the error accumulates through the washdown. While the level falls, the same lag works the other way. For a deterministic equation, the error of Euler's method in a fixed time is proportional to the step: halve the step and the error halves. That makes Euler a first-order method.

## Heun's method

Heun's method, also called the improved Euler or trapezoidal predictor–corrector method, takes a trial Euler step to predict the end of the step, evaluates the drift there as well, and uses the average of the two drifts for the real step. For an equation dX = f(X) dt + g dW with additive noise, using the same random increment in both stages:

1. Predict: X* = X(n) + f(X(n)) × h + g √h Z(n)
2. Correct: X(n+1) = X(n) + ½ [f(X(n)) + f(X*)] × h + g √h Z(n)

It costs two evaluations of the drift per step instead of one, and in return its deterministic error falls with the square of the step: halve the step and the error falls to a quarter. It is a second-order method for the deterministic part. In the chapter on integration schemes in the source volume behind this book, Mannella compares the main candidates and finds that Heun's method reproduces the long-run distribution of a noisy system much more faithfully than Euler's, for little extra work, which is the property that matters for estimating how often a system visits its extremes.

```figure
type: formula
title: Heun's method for additive noise
formula: X* = X + f(X) h + g √h Z     X(n+1) = X + ½ [f(X) + f(X*)] h + g √h Z
caption: The same random number Z is used in the predictor and the corrector. For additive noise the method is second-order accurate in its deterministic part, and for multiplicative noise it converges to the Stratonovich interpretation mentioned in Chapter 3.
- X | state at the start of the step
- X* | predicted state at the end of the step
- f | drift, evaluated twice
- g √h Z | random increment, drawn once per step
```

## Checking the deterministic part against an exact result

Before trusting either method with noise, the engineer checked the deterministic part, where an exact answer exists. A vertical cylindrical tank draining through an orifice with no inflow has a closed-form drain time: the level falls with its square root decreasing linearly in time. The [tank drain time check](/tools/tank-drain-time-check/) calculates, for a vertical cylindrical tank with a bottom orifice, the volume drained between two levels, the outflow at the starting level, the time to fall from the starting to the final level as the head falls, and the outlet diameter that would drain it in a stated time. For BT-1, with a diameter of 2,000 mm, a starting level of 2,500 mm, a final level of 100 mm, a 32 mm outlet, a discharge coefficient of 0.62 and water at 1,000 kg/m³, it gives a volume of 7,540 L, an initial outflow of 209.5 L/min and a drain time of **59.98 minutes**.

The engineer then simulated the same drain, with the inflow set to zero and no noise, using both methods at six step lengths.

```figure
type: compare
title: Simulated drain time of BT-1 from 2.50 m to 0.10 m
rowhead: Time step
cols: Euler | Heun | Exact, tank drain time check
caption: This is an illustration. Euler's error roughly halves with each halving of the step, a first-order method; Heun's is already within a second at a 60 s step. Both converge on the tool's 59.98 minutes.
- 300 s | 56.12 min | 60.48 min | 59.98 min
- 120 s | 58.40 min | 60.04 min | 59.98 min
- 60 s | 59.18 min | 60.00 min | 59.98 min
- * 10 s | 59.85 min | 59.98 min | 59.98 min
- 1 s | 59.97 min | 59.98 min | 59.98 min
```

At a 60 s step, Euler's drain time is 0.8 minutes short, an error of 1.3%; Heun's is right to within a second. To match Heun's accuracy at 60 s, Euler would need a step of about 1 s, sixty times as many steps. The test confirms that the outflow equation, the plan area and the integration code are all right, independently of any noise, and it is the first item on the verification list of Chapter 10.

### Near the bottom of the tank

The square root makes the drift steep near an empty tank: its slope with respect to the level grows without limit as the level approaches zero. An explicit method can then overshoot below zero in one step, after which the square root of a negative level fails. The production model clamps the level at zero and uses the clamped value in the corrector, which is adequate because BT-1 never runs nearly empty in production. A model that spent much time near such a point would need a smaller step there, or a method designed for steep drifts.

## Choosing the step with noise

With noise and washdowns added, there is no exact answer to compare with, so the step is chosen by a **convergence test**: run the same simulated days, with the same random numbers, at a sequence of steps, each half or so of the last, and watch the outputs settle. Using the same random numbers matters: it removes most of the sampling difference between the runs, so that what remains is the effect of the step. The engineer ran 10,000 days with each method at five steps.

```figure
type: compare
title: Convergence of BT-1's outputs with the time step, 10,000 days
rowhead: Method and step
cols: Mean daily maximum level | Days above the 1.85 m limit
caption: This is an illustration. The same 10,000 days of random inputs at each step. The mean daily maximum is precise enough to show the step's effect clearly; the exceedance fraction has a sampling error of about ±0.23 percentage points, so its smaller differences are noise.
- Euler, 120 s | 1.514 m | 6.45%
- Euler, 60 s | 1.504 m | 5.83%
- Euler, 10 s | 1.499 m | 5.55%
- Heun, 120 s | 1.504 m | 5.89%
- Heun, 60 s | 1.499 m | 5.53%
- * Heun, 10 s | 1.498 m | 5.50%
- Heun, 5 s | 1.497 m | 5.69%
```

The mean daily maximum tells the story. Euler at 120 s overstates it by 16 mm; at 60 s by 6 mm; at 10 s by 1 mm. Heun at 60 s is already within 1 mm of the converged value, and from 10 s down the changes are a fraction of a millimetre. The exceedance fraction moves more noisily, because it is a count of rare events: Euler at 120 s overstates it by nearly a percentage point, which is a real bias, while the scatter of about two-tenths of a point between the other rows is sampling error, as Chapter 6 shows how to calculate.

The engineer chose **Heun's method with a 10 s step** for production runs. A 60 s step would have been nearly as accurate for the mean, but the washdowns last only 8 minutes, the process flow's correlation time is 2 minutes, and Chapter 7 shows that crossing detection needs a short step; 10 s keeps every one of those well resolved and still runs 100,000 days in a few minutes.

### Accuracy of paths and accuracy of statistics

Numerical analysts distinguish two kinds of accuracy for stochastic methods. **Strong** accuracy measures how closely each simulated path follows the true path driven by the same noise. **Weak** accuracy measures how closely the statistics of many paths, their means, variances and probabilities, match the true statistics. For BT-1 every output is a statistic: a mean daily maximum, a fraction of days, an overflow frequency. Weak accuracy is therefore what matters, and it is what the convergence test measures. For additive noise, Euler–Maruyama is first-order in the weak sense, and Heun's method is second-order, which is why its rows settle so much sooner. Higham's paper in the references shows how to measure both kinds of error numerically and is a good next step for anyone writing their own integrator.

### Extrapolating to a zero step

Knowing a method's order allows a useful shortcut. For a first-order method, the error is roughly proportional to the step, so two results at steps h and h ÷ 2 can be combined to estimate the result at zero step: twice the finer result minus the coarser one. Applied to Euler's mean daily maximum at 10 s and 5 s, 1.4986 m and 1.4978 m, it gives 2 × 1.4978 − 1.4986 = **1.4970 m**. Heun's result at 5 s was 1.4974 m, within half a millimetre, which is a reassuring cross-check from two different methods. The extrapolation is only as reliable as the assumption that the step is small enough for the error to follow its leading-order behaviour; when the three coarsest rows of a table do not fall in a regular pattern, it should not be trusted.

### Why the step matters more for extremes than for means

The bias of a coarse step is largest exactly where the plant's questions lie. During a washdown, the level rises by about 0.4 m in 8 minutes, the fastest change the tank sees, and Euler's lag is largest then; the daily maximum, which usually occurs at the end of a washdown, carries the full accumulated error. The average level over the day, by contrast, is dominated by quiet periods where the drift changes slowly, and is almost unaffected. A step that looks converged by the mean level can still bias the extremes. Always test convergence on the output you will report.

## The error: a step chosen from the time constant

The engineer's first production run used Euler's method with a 120 s step. The reasoning was the usual rule of thumb: the tank's time constant is 43 minutes, so a step of 2 minutes, about one-twentieth of it, should be plenty. The run reported an exceedance on 6.45% of days. A reviewer asked whether the step had been tested, and the convergence table above was the answer: the result fell to about 5.5% as the step shrank, a bias of nearly one percentage point, about 17% of the answer.

The rule of thumb failed because the time constant is not the fastest time scale in the problem. The washdowns, 8 minutes long, and the process flow's 2-minute correlation time are both much shorter, and the extremes are made during them. The right reference is the shortest time scale that affects the output being reported, and the only reliable way to choose a step is a convergence test on that output. With Heun's method, the same accuracy is available at a step several times longer than Euler's, which more than pays for its second drift evaluation.

```figure
type: checklist
title: Choosing a time step
caption: The step is a model parameter like any other, and its value should be justified by a test, not by habit.
- List the time scales | System time constant, input correlation times, event durations.
- Start below the shortest | A fraction of the shortest time scale that affects the output.
- Test the deterministic part exactly | Against a closed-form case such as a drain time.
- Run a convergence test with the same random numbers | Halve the step until the reported output stops changing.
- Prefer Heun to Euler for nonlinear drift | Second-order accuracy for twice the drift evaluations.
- x Choose the step from the slowest time constant | The extremes are made on the fastest scales.
```

## How this applies to a small Australian business

When a simulation's equation is nonlinear, use Heun's method rather than Euler's; it is a few more lines of code and allows much longer steps for the same accuracy. Check the deterministic part of the model against any closed-form result available, such as a drain time, a step response or a steady state. Then run the same random days at two or three steps and report results only from a step at which the output you care about has stopped changing. Record the method, the step and the convergence table in the report, so that a reviewer can see the evidence rather than take the step on trust. If a later change shortens a time scale, such as briefer washdowns or a faster-responding outlet, repeat the test: a step that was converged for one model is not automatically converged for the next.

## Exercise: a larger outlet

The plant is considering a 36 mm orifice. (a) Using the tank drain time formula, how long would BT-1 take to drain from 2.50 m to 0.10 m? (b) If Euler's error at a 60 s step is proportional to the step divided by the drain time, roughly what would it be? (c) Would the 10 s Heun step still be adequate?

**Worked answer.** (a) The drain time scales inversely with the orifice area, so it falls by (32 ÷ 36)² = 0.790, to 59.98 × 0.790 = **47.4 minutes**, which the tank drain time check confirms. (b) At 32 mm Euler's error at 60 s was 1.3% of the drain time; with a shorter drain time the same step is a larger fraction of it, so the error grows roughly in proportion: 1.3% × 59.98 ÷ 47.4 = **about 1.7%**. (c) **Yes.** Heun's error at 60 s was well under 0.1% for the 32 mm orifice; a drain 21% faster leaves it far below anything that matters, and at 10 s it is negligible. The step would still need to be checked by a convergence test on the reported outputs, since the larger outlet also changes how the tank responds to washdowns.
