---
book: trips-and-alarms-by-the-numbers
chapterSlug: filtering-before-the-comparator
order: 4
title: "Filtering before the comparator"
description: "How a first-order filter in the PLC reduces noise and its crossing rate, why it removes fast noise but not slow, what it costs in response time, and how to choose and test the time constant."
draft: false
---

The most common remedy for a noisy trip is to smooth the signal before comparing it with the threshold. A filter replaces each reading with a weighted average of recent readings, so brief swings are pulled back towards the mean and the signal has to stay low for a while before the filtered value follows it down. That is exactly what a protection function wants: a real fault persists, noise does not. But a filter is not free. It delays the response to a real fault, and it works very unequally on noise of different speeds. Choosing its time constant is a calculation, not a matter of taste.

This chapter adds a first-order filter to PSLL-3's logic, calculates its effect on the noise and on the response to a pump stop, and chooses a time constant. Its error is a filter that was coded correctly but run in the wrong task, which made it five times slower than intended without anyone noticing until it was tested.

## The first-order filter

The simplest digital filter, and the one built into most PLC libraries, is the first-order or exponential filter. At each scan it moves the filtered value a fixed fraction λ of the way towards the new reading:

filtered value = previous filtered value + λ × (new reading − previous filtered value)

With a scan interval h and a time constant τ, the fraction is λ = 1 − exp(−h ÷ τ), which is very close to h ÷ τ when the time constant is much longer than the scan. For PT-3, scanned every 10 ms, a time constant of 0.5 s gives λ = 0.0198, which most programmers would round to 0.02. Each reading then carries a weight of 2% in the filtered value, the reading before it about 1.96%, and so on, the weights falling away exponentially with age. The filtered value behaves like the output of a resistor–capacitor network: after a step change in the input it covers 63% of the step in one time constant, 86% in two and 95% in three.

The same recursion appears in quality control as the exponentially weighted moving average. The [EWMA control chart tool](/tools/ewma-chart-check/) calculates the EWMA statistic for up to twenty readings in time order, with a weighting factor λ that plays exactly the role of the filter fraction, together with control limits from a historical standard deviation. It is built for charting process readings rather than filtering a continuous signal, but entering a short run of readings into it with a weight of, say, 0.3 is a quick way to see how the recursion smooths a sequence and how the weight trades smoothness against speed. The chapter on EWMA in [Control Charts by the Numbers](/reados/publications/control-charts-by-the-numbers/ewma-a-chart-with-a-fading-memory/) develops the charting use.

### Other filters

A moving average over the last n readings is the main alternative. For the same reduction of fast noise it responds to a step somewhat more crisply, reaching the full step in exactly n readings, but it needs a buffer of n readings and responds to a single large spike with a rectangular bump rather than a decaying one. Higher-order filters roll off fast noise more steeply for the same delay, at the cost of more code and more parameters to get wrong. For protection, where the logic should be simple enough to check by hand, the first-order filter is usually the right choice, and its arithmetic is the easiest to predict.

## What a filter does to each kind of noise

A first-order filter with time constant τ, applied to noise whose own correlation time is τₙ, reduces that noise's variance by the factor τₙ ÷ (τₙ + τ). The result depends entirely on how the two times compare.

```figure
type: formula
title: Variance of noise after a first-order filter
formula: σ²(filtered) = σ²(input) × τₙ ÷ (τₙ + τ)
caption: The factor applies to noise with an exponential autocorrelation, which describes each of PT-3's two components well. Fast noise (τₙ much shorter than τ) is reduced strongly; slow noise (τₙ much longer than τ) passes almost unchanged.
- σ²(input) | variance of the noise component before filtering, bar²
- τₙ | correlation time of the noise component, s
- τ | filter time constant, s
step: Fast part, τ = 0.5 s: 0.0144 × 0.03 ÷ 0.53 = 0.00082 bar², σ = 0.029 bar
step: Slow part, τ = 0.5 s: 0.0081 × 2 ÷ 2.5 = 0.0065 bar², σ = 0.080 bar
step: Total: √(0.00082 + 0.0065) = 0.085 bar, against 0.150 bar unfiltered
```

The filter cuts the fast noise by a factor of four in standard deviation and barely touches the slow swell. After filtering, the slow part dominates: it holds about 89% of the remaining variance. The engineer applied the filter in software to the logged readings to check the calculation, and the filtered log gave a standard deviation of 0.088 bar, a little above the simple calculation because the transmitter's own damping makes the fast noise slightly slower than a pure exponential.

The filter also slows the signal, and that matters as much as the reduction in σ. Counted from the filtered log, the mean-crossing rate fell from 5.22 to **0.44 per second**: the filtered signal makes about one-twelfth as many attempts to reach the threshold. Both effects enter Rice's formula, the smaller σ through the exponent and the smaller ν₀ as a multiplier.

## Choosing the time constant

The engineer filtered the log with five time constants and, for each, measured σ and ν₀, used Rice's formula to find the lowest mean pressure at which noise trips stay below one a shift, and calculated the time for the filtered signal to fall to 3.2 bar after a pump stop.

```figure
type: compare
title: PSLL-3 with different filter time constants
rowhead: Time constant τ
cols: σ, bar | ν₀ per second | Mean for one trip a shift | Pump stop to 3.2 bar, from 4.20 bar
caption: This is an illustration. σ and ν₀ measured on the filtered log; response from a simulated pump stop in which the pressure falls exponentially to 0.6 bar with a time constant of 0.4 s. The fixed stages of Chapter 1 add 0.32 s to each response.
- None | 0.150 | 5.22 | 3.93 bar | 0.13 s
- 0.2 s | 0.102 | 0.89 | 3.66 bar | 0.30 s
- * 0.5 s | 0.088 | 0.44 | 3.59 bar | 0.46 s
- 1.0 s | 0.078 | 0.26 | 3.53 bar | 0.68 s
- 2.0 s | 0.067 | 0.16 | 3.48 bar | 1.05 s
```

The first 0.2 s of time constant buys most of the improvement: the pressure at which trips begin falls by 0.27 bar, for an extra 0.17 s of response. Going from 0.2 to 0.5 s buys another 0.07 bar; from 0.5 to 2 s, another 0.11 bar for an extra 0.6 s of response. The returns diminish because the fast noise, which a short filter removes, is quickly gone, and what is left is the slow swell, which only a filter of several seconds could reduce. No time constant short enough to protect the die could remove it.

```figure
type: line
title: Lowest mean pressure for one noise trip a shift, by filter time constant
x: Filter time constant, s
y: Mean pressure, bar
ymin: 3.4
ymax: 4.0
legend: Mean for one trip a shift
caption: This is an illustration. The curve falls steeply for short time constants, as the fast noise is removed, and flattens beyond about half a second, where the slow swell remains.
- 0 | 3.93
- 0.2 | 3.66
- 0.5 | 3.59
- 1 | 3.53
- 2 | 3.48
```

The engineer chose **τ = 0.5 s**. At the current mean of 3.90 bar, Rice's formula with σ = 0.088 bar and ν₀ = 0.44 per second puts the margin at 7.95 standard deviations and predicts about one noise trip in four billion shifts: effectively none. Trips would not begin again until the mean fell to about 3.6 bar, by which time the strainer is badly loaded and should already have been cleaned. The response to a pump stop rises from 0.13 s to 0.46 s, and with the fixed stages the whole chain takes about 0.78 s, comfortably inside the 3 s allowance.

### The response depends on the starting pressure

A filtered trip responds faster from a lower starting pressure, because the filtered value has less far to fall. From 3.90 bar the filtered signal reaches 3.2 bar 0.38 s after a pump stop, against 0.46 s from 4.20 bar. The worst case for response is therefore a clean strainer, and the worst case for nuisance trips a loaded one. Both must be checked, at opposite ends of the strainer's cycle.

### The slow fault is not delayed

For the trip's second duty, a slow fall in pressure from a blocking strainer, the filter adds almost nothing. A pressure that falls by a few hundredths of a bar a day is followed by a 0.5 s filter with a lag of about half a second, which is negligible. Filtering trades away response only to fast faults, and the response budget shows how much of that can be spent.

There is one subtlety. Near the end of a slow fall, when the mean has reached the threshold, the filtered signal crosses it repeatedly as the remaining slow swell carries it back and forth, and the first of those crossings trips the cell. Without the filter, the raw noise would have tripped the cell earlier, while the mean was still well above 3.2 bar. So the filter makes the slow-fault trip act closer to the true minimum-flow point, which is what the die engineer intended the setting to mean.

## Where the filter goes

The filter belongs in the PLC logic that drives the trip, applied to the signal that is compared with the threshold, and nowhere else. Three alternatives are common and each has a drawback.

- **The transmitter's damping setting.** Most smart transmitters have one. It filters the signal for every user of it: the trip, the trend, the historian and any control loop. A damping long enough to cure the trip can upset a control loop that uses the same signal, and the setting lives in the transmitter, where it is easily changed during maintenance without anyone checking the trip.
- **The HMI or SCADA display.** Filtering the displayed value makes the trend look calm and does nothing for the trip, which still sees raw readings. It can make the problem harder to diagnose.
- **A separate filtered tag used by several functions.** Acceptable if every function using it has been checked against the filter's delay; dangerous if a later change to the filter is made for one function without checking the others.

At Plant C, the filtered value was written to its own tag, PT-3_TRIP, used only by PSLL-3, with the time constant recorded in the trip register beside the setpoint.

## The error: the filter that ran five times slower

The programmer coded the filter with λ = 0.02, correct for a 0.5 s time constant at a 10 ms scan, and placed it in the cell's general logic routine. The engineer, as a matter of routine, tested the new logic by forcing the analogue input from 4.2 bar to 0.6 bar in one step with a loop calibrator and timing how long PSLL-3 took to act. With an instantaneous step, the filtered value should pass 3.2 bar after 0.5 × ln(3.6 ÷ 2.6) = 0.16 s, and the PLC and output stages add 0.27 s, so the expected time from the forced step to the cell hold was about 0.43 s. The measured time was **1.1 s**.

The cause was the task the routine ran in. The PLC's fast task, which scans PT-3 every 10 ms, holds only the trip comparisons; the general logic runs in a slower periodic task every 50 ms. The filter therefore executed once every 50 ms, moving 2% of the way each time, which is a time constant of 0.05 ÷ 0.02 = **2.5 s**, five times the intended value. Against a real pump stop, with the pressure falling over a few tenths of a second rather than instantly, the slow filter would have tripped after about 1.2 s from a clean-strainer start; with the fixed stages that is about 1.5 s, still inside the 3 s allowance but with half the margin intended, and nobody would have known.

The fix was to move the filter into the fast task with the trip comparison. The step test was repeated and gave 0.44 s, within a scan or two of the calculation. Two general rules follow. First, compute λ from the actual interval at which the filter executes, preferably from a measured scan time rather than a configured one, or use a library filter block that takes the time constant directly and reads the elapsed time itself. Second, never accept a filtered trip without a step test that measures its response; the arithmetic is simple, but where the code runs is easy to get wrong.

```figure
type: checklist
title: Implementing a filter on a trip
caption: The filter is a few lines of code, but each item here has caused a slow or ineffective trip somewhere.
- Compute λ from the real execution interval | Or use a block that takes τ and measures elapsed time.
- Run the filter in the same task as the trip | So it executes at the rate assumed.
- Use a dedicated filtered tag | Used only by functions whose response has been checked.
- Initialise the filter to the first reading | Not to zero, or it will trip on start-up.
- Step-test the response | Force the input and time the trip; compare with the calculation.
- Record τ in the trip register | Beside the setpoint, with the response measured.
- x Filter in the transmitter or HMI | It changes other users of the signal, or none.
```

## How this applies to a small Australian business

For a noisy trip with spare response time, a first-order filter in the PLC is the cheapest remedy and usually the most effective. Choose the time constant from a filtered copy of a full-rate log: start at a few times the fast noise's correlation time and stop when the improvement levels off, which happens when only slow noise is left. Keep the resulting response, from fault to action, inside the allowance with margin to spare, and prove it with a step test, not with the code listing.

## Exercise: a second filter for the alarm

PAL-3 is to use its own filtered tag. Using the variance formula and PT-3's two noise components (fast: σ = 0.12 bar, τₙ = 0.03 s; slow: σ = 0.09 bar, τₙ = 2 s), calculate the standard deviation after filters of (a) 5 s and (b) 30 s. (c) At a mean of 3.90 bar, what is PAL-3's margin in standard deviations for each?

**Worked answer.** (a) With τ = 5 s: fast part 0.0144 × 0.03 ÷ 5.03 = 0.000086 bar²; slow part 0.0081 × 2 ÷ 7 = 0.00231 bar²; total √0.00240 = **0.049 bar**. (b) With τ = 30 s: fast part 0.0144 × 0.03 ÷ 30.03 = 0.000014 bar²; slow part 0.0081 × 2 ÷ 32 = 0.000506 bar²; total √0.000520 = **0.023 bar**. (c) The margin is 0.3 bar, so k = 0.3 ÷ 0.049 = **6.1** with the 5 s filter and 0.3 ÷ 0.023 = **13** with the 30 s filter. Either would silence the alarm on noise at 3.90 bar. An alarm needs to warn of a slowly falling pressure, not of a pump stop, which the trip deals with, so it can afford a much longer filter than the trip can. Chapter 5 completes the alarm's settings.
