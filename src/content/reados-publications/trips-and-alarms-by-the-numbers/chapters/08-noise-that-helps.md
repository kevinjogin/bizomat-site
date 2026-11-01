---
book: trips-and-alarms-by-the-numbers
chapterSlug: noise-that-helps
order: 8
title: "Noise that helps: dither and stochastic resonance"
description: "How noise lets a threshold or coarse quantiser measure a mean it could not otherwise see, the best noise level for a switch, stochastic resonance, dither, and checking against a reference."
draft: false
---

Every chapter so far has treated noise as the enemy of a threshold. There is another side. A threshold on a perfectly steady signal gives one bit of information: above or below. Add noise, and the threshold starts to switch back and forth, spending a fraction of its time on each side, and that fraction varies smoothly with the signal's mean. The noise has turned a yes-or-no device into a measuring instrument. Physicists call the general effect stochastic resonance: a nonlinear system, typically one with a threshold, responds best to a weak signal at some intermediate, non-zero level of noise. Engineers have used the same idea for decades under the name dither.

This chapter uses an electronic pressure switch on Plant C's older cell to estimate a mean pressure from the time it spends switched, finds the noise level that gives the best estimate, and explains dither in quantised measurements. Its error is a switch setting that quietly biased the estimate, found only when it was checked against a transmitter.

## A switch as a measuring instrument

Plant C's older cell, DC-1, is cooled by an identical pump but has no pressure transmitter. Its cooling-water protection is an electronic pressure switch, PSL-1, with a transistor output to the PLC, set to switch at 3.5 bar. The plant wants the same strainer advisory on DC-1 as on DC-2, but a transmitter and its wiring are some months away in the budget. The engineer asked whether the switch alone could give the mean pressure.

On a perfectly steady pressure it could not: above 3.5 bar the switch reads normal, and the PLC knows only that the pressure is somewhere above 3.5 bar. But DC-1's pressure is not steady. Its pump and its die's cooling valves produce the same kind of noise as DC-2's, and a day's log from a temporary transmitter clamped on during a maintenance stop confirmed a standard deviation of about 0.150 bar with the same fast and slow parts. With that much noise, the pressure dips below 3.5 bar for brief moments even when its mean is 3.9 bar, and the fraction of time the switch reads low depends on how far the mean is above the setting.

If the noise is Gaussian with standard deviation σ, the fraction of time below the setting s is f = Φ((s − μ) ÷ σ). Turned around, the mean is

μ = s − σ × Φ⁻¹(f)

where Φ⁻¹ is the inverse of the standard normal distribution, the NORM.S.INV function in a spreadsheet. The PLC counts, each hour, how many of its 360,000 scans found the switch low, and the hourly fraction gives the hourly mean.

```figure
type: formula
title: The mean pressure from a switch's duty cycle
formula: f = (scans with the switch low) ÷ (scans in the hour)     μ = s − σ × Φ⁻¹(f)
caption: The estimate needs the noise's standard deviation from a separate measurement, and it assumes the noise stays the same from hour to hour. It works only while the switch switches: if f is zero, the mean is known only to be well above s.
- s | switch setting, bar
- σ | standard deviation of the pressure noise, bar
- f | fraction of scans with the switch low
- Φ⁻¹ | inverse standard normal distribution
step: One hour on DC-1: 1,379 low scans of 360,000, so f = 0.00383
step: Φ⁻¹(0.00383) = −2.67, so μ = 3.5 + 0.150 × 2.67 = 3.90 bar
```

The arithmetic can be checked in the forward direction with the [normal distribution out-of-tolerance tool](/tools/normal-out-of-spec/): with a mean of 3.90, a standard deviation of 0.150 and a lower limit of 3.5, it gives 3,830 ppm below the limit, which is 0.383%, the fraction the switch reported. The tool cannot do the inverse directly, but trying two or three means until its fraction below matches the counted fraction is a quick independent check of the PLC's calculation.

### How precise is it?

An hourly fraction is an estimate, and so is the mean calculated from it. The engineer replayed 30 hours of the noise model through a simulated switch and calculated the hourly mean each hour. The hourly estimates had a standard deviation of **0.004 bar** about the true mean of 3.90 bar. That is less than half the hour-to-hour scatter of DC-2's transmitter means found in Chapter 7, so DC-1's switch can carry the same advisory and the same CUSUM, a few months before its transmitter arrives.

## The best amount of noise

The estimate depends on the noise. If DC-1's noise were much smaller, the pressure would never dip to 3.5 bar, the fraction would be zero, and nothing could be inferred. If it were much larger, the fraction would be near a half and would change only slowly with the mean, so each hour's count would say little about it. Somewhere between lies a best noise level, and the arithmetic of a single threshold says where.

For independent readings, the precision of the estimate is set by how steeply f changes with μ compared with the counting scatter in f. Working through the arithmetic for a mean a distance d above the setting gives a best noise standard deviation of about **0.63 d**, that is, the setting should lie about 1.6 standard deviations below the mean. Precision falls away slowly on the high-noise side and very steeply on the low-noise side, because with too little noise the switch simply stops switching.

```figure
type: compare
title: Precision of the hourly mean from a switch set 0.15 bar below the mean
rowhead: Noise standard deviation
cols: Fraction of time low | Standard deviation of the hourly estimate
caption: This is an illustration. Replay of 30 hours of the noise model, scaled to each standard deviation, with the switch set at 3.75 bar and the true mean 3.90 bar. With too little noise the switch never switches and gives no estimate at all; the best precision comes when the noise is about half the distance to the setting.
- 0.015 bar | 0 | no estimate
- 0.038 bar | 0.00003 | 0.0054 bar
- * 0.075 bar | 0.023 | 0.0016 bar
- 0.150 bar | 0.16 | 0.0029 bar
- 0.300 bar | 0.31 | 0.0055 bar
- 0.600 bar | 0.40 | 0.011 bar
```

The replay agrees with the arithmetic: the best precision came at a standard deviation of 0.075 bar, half the 0.15 bar distance, close to the predicted 0.63. With DC-1's actual noise of 0.15 bar, a setting of 3.5 bar, 0.4 bar below the mean, is about 2.7 standard deviations away and gives 0.004 bar; a setting 0.25 bar below the mean would be near the optimum. The engineer left the switch at 3.5 bar, because its first job is protection, and its setting is chosen for that; the estimate is a by-product and is already good enough.

### Stochastic resonance

This is a simple case of what physicists call stochastic resonance. The papers on it in the source volume behind this book study bistable and threshold systems driven by a weak periodic signal plus noise, and find that the output tracks the signal best at a particular noise intensity: too little noise and the system never crosses its threshold, too much and the crossings are random. The effect has been found in electronic circuits, lasers and sensory neurons, and it is the same mechanism as here: the threshold converts noise into crossings, and the crossings carry information about whatever is slowly changing the system's bias. For a threshold detector, the optimum noise is of the order of the distance to the threshold, which is the result above.

## Dither in quantised measurements

The same principle applies to any measurement that rounds its readings. An analog input card with 8-bit resolution on a 0 to 10 bar range reports the pressure in steps of 10 ÷ 256 = 0.039 bar. If the pressure were perfectly steady at 3.905 bar, the card would report 3.906 bar, the nearest step, for ever, and averaging a million readings would still give 3.906. If the pressure carries noise of 0.150 bar, about four steps, each reading is rounded up or down at random, and the average of many readings converges on the true mean to far better than one step. The noise has dithered the quantiser.

The difference matters for slow trends. With DC-2's fouling rate of 0.025 bar a day, a noiseless reading on an 8-bit card would move one step every 0.039 ÷ 0.025 = 1.6 days, in sudden jumps, and an hourly mean would show a staircase. With noise of a few steps, the hourly mean falls smoothly and the CUSUM of Chapter 7 can see the drift within hours. Where a signal is naturally too quiet for its quantiser, designers add dither deliberately: a small, known noise of about one step, added before rounding, and averaged out afterwards. Audio converters, precision weighing and some position encoders do so routinely, and the reference by Vanderkooy and Lipshitz sets out the theory.

A mechanical relative is familiar to anyone who has tuned a proportional hydraulic valve: the drive electronics superimpose a small high-frequency dither on the solenoid current, so that the spool never quite comes to rest and the static friction that would make it stick and jump is replaced by the much smaller sliding friction. The valve's response to a small change in command becomes smooth instead of stepped, for the same reason: the dither keeps the device moving across its own threshold.

```figure
type: decision
title: Will noise help this measurement?
question: Is the quantity you want a slowly changing mean behind a threshold or a coarse quantiser?
caption: Noise helps when it is large enough to move the signal across the threshold or quantiser steps, and when many readings are averaged; it never helps a single reading.
- Noise much smaller than a step or the distance to the threshold | Readings stick | Averaging gains nothing; add dither of about one step, or move the threshold closer.
- * Noise about 0.5 to 1 times that distance | Readings switch freely | Average many readings; precision is near its best.
- Noise much larger | Readings switch at random | Averaging still works, but more readings are needed for the same precision.
```

## The error: the switch's own hysteresis

For the first week, DC-1's estimated mean ran consistently lower than expected. The day after a strainer clean it read 4.15 bar, against the 4.20 bar DC-2 always showed, and the advisory fired two days earlier in the cycle than on DC-2. The engineer suspected the different cell and checked by clamping the temporary transmitter onto DC-1 again for a shift. The transmitter's hourly means were 0.05 bar higher than the switch's estimates, hour after hour.

The cause was in the switch's configuration. Like most electronic pressure switches, PSL-1 has a separate reset point, and its factory setting was 0.2 bar above the switch point: the output went low at 3.5 bar and returned to normal only above 3.7 bar. The formula assumes a single switching level. With 0.2 bar of hysteresis, each brief dip below 3.5 bar held the output low until the noise carried the pressure back above 3.7 bar, which inflated the fraction of time low from 0.38% to about 1.06%. The formula, fed 1.06%, returned a mean of 3.85 bar instead of 3.90.

```figure
type: compare
title: Effect of the switch's reset hysteresis on the estimated mean
rowhead: Reset hysteresis
cols: Fraction of time low | Estimated mean, true 3.90 bar
caption: This is an illustration. Replay of the noise model through a switch set at 3.5 bar. The formula assumes no hysteresis; each 0.1 bar of hysteresis lowers the estimate by about 0.03 bar.
- * None | 0.37% | 3.90 bar
- 0.01 bar | 0.40% | 3.90 bar
- 0.10 bar | 0.66% | 3.87 bar
- 0.20 bar, factory setting | 1.06% | 3.85 bar
- 0.30 bar | 1.78% | 3.82 bar
```

The reset point was set to its minimum, 0.01 bar, which the switch's protection duty did not need to be any wider, since the PLC latches the trip. The estimates then agreed with the transmitter to within their scatter. The broader lesson is that an inferred measurement is only as good as its model, and the model here assumed a single switching level, Gaussian noise of a known size and a noise that does not change. Each assumption needs checking against a direct measurement before the inferred value is trusted, and checking again whenever the equipment is changed.

## How this applies to a small Australian business

Before buying a transmitter to trend a slow change, look at the switches already installed. A switch on a noisy signal, counted by the PLC, can estimate a mean pressure, level or temperature well enough for a maintenance advisory, provided the noise is a fair fraction of the distance to the switch point and its size has been measured once. Set the switch's reset hysteresis to its minimum if the logic allows. Check the estimate against a temporary instrument for a day before relying on it. And if a trend from a coarse input card moves in steps, the signal is too quiet for the card's resolution: a finer card, or a little dither, will cure it.

## Exercise: setting a switch for the best estimate

DC-1's pressure noise has a standard deviation of 0.150 bar and its mean runs between 3.95 and 4.20 bar between strainer cleans. A second, spare channel of the same switch type is available for estimation only, with no protection duty. (a) Using the 0.63 d rule, at what setting would the switch give the best estimate when the mean is 4.20 bar, and when it is 3.95 bar? (b) If the switch is set at 3.95 bar and the mean is 4.20 bar, what fraction of scans would read low? (c) Why might you choose a setting a little lower than the answer to (a) for the whole cycle?

**Worked answer.** (a) The best distance is d = σ ÷ 0.63 = 0.150 ÷ 0.63 = 0.24 bar, so the best setting is **3.96 bar** for a mean of 4.20 bar and **3.71 bar** for a mean of 3.95 bar. (b) With s = 3.95 bar the margin is 0.25 ÷ 0.150 = 1.67 standard deviations, and Φ(−1.67) = **0.048**, about 4.8% of scans. (c) The mean moves through a 0.25 bar range, so no single setting is best throughout. A switch set at 3.96 bar would be ideal just after a clean but would end the cycle with the mean sitting on its setting, where the fraction is near a half and changes slowly with the mean. A switch set at 3.71 bar would be ideal at the end of the cycle but, just after a clean, would sit 3.3 standard deviations below the mean, where it switches rarely and each hour's count is small and noisy. A compromise near **3.8 bar** keeps the distance between 0.15 and 0.4 bar, one to 2.7 standard deviations, for the whole cycle. The precision then stays between about 0.003 and 0.004 bar an hour, according to the replay, which is good enough everywhere; and because the precision curve is flat near its best, the compromise costs very little against the ideal setting at either end.
