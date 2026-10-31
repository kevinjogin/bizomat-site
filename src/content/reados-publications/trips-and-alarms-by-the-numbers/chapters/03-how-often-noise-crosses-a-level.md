---
book: trips-and-alarms-by-the-numbers
chapterSlug: how-often-noise-crosses-a-level
order: 3
title: "How often noise crosses a level"
description: "Rice's formula for the rate at which Gaussian noise crosses a level, measuring the mean-crossing rate from a log, predicting nuisance trips per shift, and how long each excursion lasts."
draft: false
---

Chapter 2 found the fraction of time PT-3 spends below its trip setting. What the plant experiences, though, is not a fraction of time but a number of trips: each time the signal enters the region below 3.2 bar, the cell stops. Turning one into the other needs one more property of the noise, how quickly it moves. In 1944 S. O. Rice, working on noise in telephone circuits, showed that for Gaussian noise the rate at which a signal crosses any level depends on just two numbers: its rate of crossing its own mean, and the margin in standard deviations. The result is one of the most useful formulas in instrumentation, and it needs nothing more than a log and a calculator.

This chapter sets out Rice's formula, measures PT-3's mean-crossing rate from the log, predicts the nuisance trips at different mean pressures and compares the prediction with the trip log. Its error is a shortcut that counts readings instead of crossings, which would have made a proposed instrument upgrade look ten times worse than it was.

## Rice's formula

For a stationary Gaussian signal, the expected number of times per second that it crosses a level in one direction is

ν = ν₀ exp(−k² ÷ 2)

where ν₀ is the expected number of times per second it crosses its own mean in that direction, and k is the margin of the level in standard deviations. Crossings of a low level from above, which are what start a low-pressure trip, happen at the same rate as crossings of the mirror-image high level from below, so the same formula serves high and low thresholds.

```figure
type: formula
title: Rice's level-crossing formula
formula: ν = ν₀ × exp(−k² ÷ 2)     k = (μ − threshold) ÷ σ     trips per shift = ν × 28,800 s
caption: The formula assumes Gaussian noise whose statistics do not change over the period, and a signal smooth enough to have a finite crossing rate. ν₀ is best counted directly from a full-rate log.
- ν | expected crossings of the threshold per second, in one direction
- ν₀ | expected crossings of the mean per second, in the same direction
- k | margin in standard deviations
step: PT-3 at a mean of 3.90 bar: k = 4.67, so k² ÷ 2 = 10.89
step: ν = 5.22 × exp(−10.89) = 5.22 × 1.87 × 10⁻⁵ = 9.7 × 10⁻⁵ per second
step: Trips per shift = 9.7 × 10⁻⁵ × 28,800 = 2.8
```

The formula has a clear meaning. The factor ν₀ sets how often the signal makes an attempt: each time it swings through its mean, it has a chance of carrying on far enough to reach the threshold. The exponential factor is the chance that an attempt goes that far, and it depends only on the margin in standard deviations. Doubling ν₀ doubles the trip rate. Adding one standard deviation of margin, at margins around 4 to 5, divides it by about a hundred.

### Where ν₀ comes from

For a smooth Gaussian signal, the mean-crossing rate is set by the ratio of the standard deviation of the signal's rate of change to the standard deviation of the signal itself: ν₀ = (1 ÷ 2π) × σ of the slope ÷ σ of the signal. A signal that changes quickly relative to its size crosses its mean often. For noise with a known spectrum, ν₀ can be calculated from the spectrum, and the chapter on peaks in [Random Vibration by the Numbers](/reados/publications/random-vibration-by-the-numbers/peaks-cycles-and-the-rayleigh-distribution/) does so for vibration. For a plant signal, it is simpler and more reliable to count.

## Counting the mean-crossing rate

In the ten-minute log, the engineer counted every pair of consecutive readings in which the first lay below the mean and the second at or above it. There were 3,132 such upward crossings in 600 s, a rate of **ν₀ = 5.22 per second**. Two practical points matter.

- **Count crossings as the trip sees them.** The PLC samples every 10 ms, so the count should be made on 10 ms readings. A signal sampled more slowly shows fewer crossings because brief swings fall between samples.
- **Count about the right mean.** If the mean drifts during the log, crossings of a fixed value undercount. Over ten minutes PT-3's mean was steady; over a day it would not be, and the count should be made over periods short enough for the mean to be constant.

### Checking the formula on the log itself

Before trusting the formula far out in the tail, where the log holds few or no crossings, it is worth checking it closer in, where the log holds plenty. The engineer counted how often the logged signal crossed downwards through levels 1, 1.5, 2, 2.5, 3 and 3.5 standard deviations below its mean, and compared each count with Rice's prediction for 600 s.

```figure
type: compare
title: Downward crossings in the ten-minute log against Rice's formula
rowhead: Level below the mean
cols: Crossings counted | Rice's prediction
caption: This is an illustration. ν₀ = 5.22 per second over 600 s. The formula is close from 2 standard deviations outwards; nearer the mean it overpredicts slightly, because sampling every 10 ms misses some brief double crossings of levels the signal hovers around.
- 1.0 standard deviation | 1,745 | 1,900
- 1.5 standard deviations | 952 | 1,017
- 2.0 standard deviations | 423 | 424
- 2.5 standard deviations | 138 | 138
- 3.0 standard deviations | 39 | 35
- 3.5 standard deviations | 9 | 7
```

The agreement from 2 standard deviations outwards is good, and the small excess at 3 and 3.5 matches the slightly heavy tail found in Chapter 2. With the formula checked where data are plentiful, its use at 4.67 standard deviations, where a ten-minute log holds no crossings at all, is an extrapolation along a curve that has been confirmed, not a leap of faith.

The rate is dominated by the fast noise. The slow swell, with a correlation time of about 2 s, crosses its mean only a few times a minute; the fast turbulence crosses it several times a second. This is why the fast noise sets how often PT-3 attempts to reach the trip, even though the slow swell contributes over a third of the variance.

## The prediction against the trip log

At a mean of 3.90 bar, Rice's formula predicts 2.8 trips a shift. The trip log for the six shifts before the investigation, over which the mean averaged about 3.90 bar, records 17 trips, or 2.83 a shift. The agreement is closer than the method deserves: as Chapter 2 noted, an uncertainty of a few per cent in σ makes the prediction uncertain by a factor of about two. But it confirms that the trips are what the noise model says they are, excursions of an ordinary noisy signal, and not some separate fault such as an intermittent wire.

The formula then answers the question the plant actually cares about: how does the trip rate change as the strainer loads?

```figure
type: compare
title: Predicted nuisance trips on PSLL-3 by mean pressure
rowhead: Mean pressure
cols: Margin k | Trips per shift | One trip in about
caption: This is an illustration. Rice's formula with ν₀ = 5.22 per second and σ = 0.150 bar, for the raw 10 ms readings. Over a fall of only 0.3 bar in the mean, the trip rate rises from once in decades to several times a shift.
- 4.20 bar, clean strainer | 6.67 | 0.000034 | 30,000 shifts
- 4.10 bar | 6.00 | 0.0023 | 440 shifts
- 4.05 bar | 5.67 | 0.016 | 63 shifts
- 4.00 bar | 5.33 | 0.10 | 10 shifts
- 3.95 bar | 5.00 | 0.56 | 1.8 shifts
- * 3.90 bar | 4.67 | 2.8 | a third of a shift
- 3.85 bar | 4.33 | 12.6 | 38 minutes
- 3.80 bar | 4.00 | 50 | 10 minutes
```

The table explains the plant's experience. With a clean strainer the trip will practically never act on noise. Through the first 0.15 bar of loading it stays quiet, then trips begin and multiply. Each 0.05 bar of further fall multiplies the rate by four to five. The engineer had been told that the trips "started suddenly" about a week and a half after each strainer clean. This is why: nothing sudden happened to the plant, only a steady fall in the mean through the region where the exponential factor changes fastest.

```figure
type: line
title: Predicted trips per shift as the mean falls (log scale)
x: Mean pressure, bar
y: log₁₀ of trips per shift
ymin: -5
ymax: 2
mark: 3.90 | trip log: 2.8 a shift
caption: This is an illustration. The same predictions on a logarithmic scale: −5 is one trip in 100,000 shifts, 0 is one a shift and 2 is a hundred a shift. The curve steepens as the margin shrinks, which is why each 0.05 bar of fall multiplies the rate by a larger factor.
- 3.80 | 1.70
- 3.85 | 1.10
- 3.90 | 0.45
- 3.95 | -0.25
- 4.00 | -1.00
- 4.05 | -1.80
- 4.10 | -2.64
- 4.20 | -4.47
```

## How long an excursion lasts

Combining the fraction of time below the threshold, from Chapter 2, with the rate of entering it gives the average duration of an excursion:

mean duration = Φ(−k) ÷ ν

At 3.90 bar, that is 1.53 × 10⁻⁶ ÷ 9.7 × 10⁻⁵ = **0.016 s**, about one and a half readings. Excursions this far into the tail are very brief, and they become briefer as the margin grows: at 4.00 bar the mean duration is 0.014 s; at 3.80 bar it is 0.018 s. A signal that reaches far into its tail does so on the peak of a swing, and peaks are narrow. This single fact is the basis of Chapter 6, because an on-delay only a few readings long ignores almost every excursion this brief, while a genuine fall in pressure, which stays down, passes straight through.

The brevity also explains the gap between 4.4 readings below 3.2 bar per shift, from Chapter 2, and 2.8 trips: each excursion holds 1.6 readings on average, and 4.4 ÷ 1.6 = 2.8. The two calculations agree once the duration is taken into account.

### The same exponential in physics

The source behind this book's subject, a collection of papers on stochastic processes in physics, chemistry and biology, returns again and again to a closely related result from H. A. Kramers: a particle jostled by thermal noise escapes from a potential well at a rate proportional to exp(−barrier height ÷ noise intensity). A signal that must climb k standard deviations to reach a threshold faces the same kind of exponential barrier, with k² ÷ 2 playing the role of barrier height over noise intensity. Rate processes as different as chemical reactions, the switching of a bistable circuit and the nuisance trips of a pressure switch share this structure, and in each case small changes in the barrier, or the margin, change the rate enormously.

## The error: counting readings instead of crossings

During the investigation, the instrument supplier offered to replace PT-3's input card with a faster one, sampling every 1 ms instead of every 10 ms, arguing that faster sampling would catch a pump stop sooner. A maintenance planner estimated the effect on nuisance trips by the method of Chapter 2: ten times as many readings per shift, each with the same probability of 1.53 × 10⁻⁶ of lying below 3.2 bar, so ten times as many readings below, 44 a shift instead of 4.4, and by implication ten times as many trips. On that basis the upgrade was rejected as making things worse.

The reasoning confuses readings with excursions. A trip happens when the signal enters the region below the threshold, and the number of entries is a property of the signal, not of how often it is sampled. Sampling ten times faster puts ten times as many readings inside each excursion, but it does not create more excursions. Rice's formula, applied to the faster readings, uses a mean-crossing rate that rises only slightly, to about 6 per second, because 10 ms sampling misses a few of the briefest swings that 1 ms sampling catches. The trip rate would therefore rise by perhaps 15%, not tenfold.

The upgrade was rejected in the end for a different and better reason: the response budget of Chapter 1 showed that the 10 ms scan contributes only 0.02 s of a 3 s allowance, so faster sampling would buy almost nothing. But the episode is a useful warning. Multiplying a per-reading probability by the number of readings gives the number of readings beyond the threshold, which equals the number of crossings only when each excursion lasts one reading. For low thresholds with fast noise, excursions are short and the two are similar; for alarms set close to the mean, or on slow signals, each excursion holds many readings and the shortcut overestimates the number of crossings many times over.

```figure
type: decision
title: Which calculation answers the question
question: What does the threshold do when the signal passes it?
caption: Both quantities are useful, but they answer different questions; using one for the other is the commonest mistake in predicting trips.
- Counts or latches each entry | Rice's formula | Trips, alarm activations and cycle counts depend on the rate of crossings.
- * Accumulates time beyond | Tail probability | Time spent beyond a limit, or a dose, depends on the fraction of time.
- Acts on an average | Recalculate σ and ν₀ | Use the noise of the averaged signal, as in Chapter 4.
```

## Limits of the formula

Rice's formula is exact for stationary Gaussian signals. In practice its main weaknesses are the tails and the mean. If the noise has heavier tails than the normal distribution, the formula underpredicts crossings of distant levels, sometimes by a large factor; the check in Chapter 2 is the defence. If the mean wanders during the period, the formula must be applied to each period separately and the results added, as Chapter 7 does. And at small margins, below about 2 standard deviations, crossings come in bursts within a single swell of the slow noise, which matters for alarms that reset themselves, the subject of Chapter 5.

## How this applies to a small Australian business

Count the mean crossings in a full-rate log of any troublesome signal and apply Rice's formula at its threshold. If the predicted trips agree with the trip log, the trips are noise and the remedies of the next chapters apply; if the log shows many more, look for a fault such as a loose connection, an air pocket or a sticking valve. The formula also tells you how much margin you need: for a signal crossing its mean five times a second, a margin of about 5.6 standard deviations gives one noise trip a month over 40 shifts.

The same arithmetic works for any signal with a threshold on it: a high-temperature trip on an oven, a high-level alarm on a tank, a vibration alarm on a fan. Each needs only a full-rate log in normal running, from which three numbers follow: the mean, the standard deviation and the mean-crossing rate. Keep those three numbers in the trip register beside each setting, with the date and conditions of the log. When a trip starts to misbehave, a new log and the same three numbers show at once whether the noise has grown, the signal has sped up, or the mean has moved, and each of those points to a different cause.

## Exercise: one trip a month

Plant C runs about 40 shifts a month. (a) What margin k makes the expected number of noise trips on PSLL-3 equal to one a month, with ν₀ = 5.22 per second? (b) What mean pressure does that correspond to, with σ = 0.150 bar? (c) What is the expected mean duration of an excursion at that margin?

**Worked answer.** (a) One trip in 40 × 28,800 = 1,152,000 s means ν = 8.68 × 10⁻⁷ per second. Then exp(−k² ÷ 2) = 8.68 × 10⁻⁷ ÷ 5.22 = 1.66 × 10⁻⁷, so k² ÷ 2 = 15.61 and **k = 5.59**. (b) The mean must be at least 3.2 + 5.59 × 0.150 = **4.04 bar**. (c) Φ(−5.59) = 1.15 × 10⁻⁸, and 1.15 × 10⁻⁸ ÷ 8.68 × 10⁻⁷ = **0.013 s**, slightly over one reading. The strainer would need cleaning whenever the mean falls to about 4.04 bar if nothing else changed; Chapters 4 to 6 change the decision rule so that it can fall much further first.
