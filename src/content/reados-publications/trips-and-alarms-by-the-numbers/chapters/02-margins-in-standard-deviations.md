---
book: trips-and-alarms-by-the-numbers
chapterSlug: margins-in-standard-deviations
order: 2
title: "Margins in standard deviations"
description: "Measuring a signal's noise from a log, splitting it into fast and slow parts with the autocorrelation, expressing a threshold as a margin in standard deviations, and reading tail probabilities."
draft: false
---

A margin of 0.7 bar between a pressure and its trip sounds comfortable or tight depending on the pressure. On a signal that never moves by more than 0.01 bar it is enormous; on one that swings by half a bar it is nothing. The number that decides how often noise reaches a threshold is not the margin in engineering units but the margin measured in the signal's own standard deviation. Once a threshold is expressed that way, the normal distribution says how much of the time the signal spends beyond it, and the next chapter turns that into a rate of trips.

This chapter measures PT-3's noise from the full-rate log, splits it into its fast and slow parts, and sets out the tail probabilities that matter for thresholds. Its error is a standard deviation taken from the wrong data, which predicted that the trips the plant was suffering could not happen.

## The standard deviation from a log

The ten-minute log from Chapter 1 holds 60,000 readings of PT-3, one every 10 ms. Their mean was 4.10 bar and their standard deviation 0.150 bar. The standard deviation is calculated in the usual way: the square root of the average squared distance of each reading from the mean. Any spreadsheet does it in one function, and on a log of this length the difference between dividing by n and by n − 1 is negligible.

That single number describes the spread of individual readings, which is what a threshold acting on individual readings sees. It does not describe how the readings follow each other in time, and two signals with the same standard deviation can behave very differently in front of a threshold. A signal that changes completely between one reading and the next crosses a level far more often than one that wanders slowly, even though both spend the same fraction of their time beyond it. The time behaviour is the subject of the next section and of Chapter 3.

### Is the noise normal?

The calculations in this book assume the noise is Gaussian, that is, normally distributed. That assumption is reasonable when the noise is the sum of many small independent effects, as turbulence and pump pulsation are, but it should be checked, because thresholds live in the tails of the distribution and the tails are where real signals most often depart from the normal curve. A quick check is to count the readings beyond 1, 2, 3 and 3.5 standard deviations below the mean and compare them with what the normal distribution predicts.

```figure
type: compare
title: Readings below the mean in PT-3's ten-minute log
rowhead: Below the mean by more than
cols: Readings found | Expected if normal | Ratio
caption: This is an illustration. The 60,000 readings of the ten-minute log. The counts run 10 to 25% above the normal prediction in the tail, which is within what a ten-minute log of slowly swelling noise can produce; a much larger excess, or a cluster of very deep dips, would call for a closer look at what caused them.
- 1 standard deviation | 9,557 | 9,519 | 1.00
- 2 standard deviations | 1,540 | 1,365 | 1.13
- 2.5 standard deviations | 429 | 373 | 1.15
- 3 standard deviations | 101 | 81 | 1.25
- * 3.5 standard deviations | 17 | 14 | 1.21
```

The counts are close to normal, slightly heavy in the tail. Part of that excess is chance: the log holds only about 300 of the slow swells described below, and a few deeper ones can tip the tail counts by this much. A real signal with genuinely heavy tails, such as one with occasional valve slams or air pockets, shows a much larger excess that grows the further out one looks, and its deepest dips can usually be traced to an event. Such signals need the event treated as a separate cause rather than as noise. A normal probability plot of the readings, on which normal data fall on a straight line, shows the same thing graphically.

## Fast noise and slow noise

The log's autocorrelation shows how quickly the noise forgets itself. The autocorrelation at a lag of, say, 0.1 s is the correlation between each reading and the one 0.1 s later. It is 1 at zero lag and falls towards 0 as the lag grows; the lag at which it has fallen most of the way is the noise's correlation time.

```figure
type: compare
title: Autocorrelation of PT-3's noise
rowhead: Lag
cols: Autocorrelation in the log | Two-part model
caption: This is an illustration. The correlation falls quickly to about 0.36 within 0.1 s, then decays slowly over a few seconds. That shape is the signature of two components: fast noise holding about 64% of the variance and a slow swell holding about 36%.
- 0.03 s | 0.73 | 0.59
- 0.1 s | 0.38 | 0.37
- 0.2 s | 0.32 | 0.33
- 0.5 s | 0.28 | 0.28
- 1 s | 0.23 | 0.22
- 2 s | 0.15 | 0.13
- 4 s | 0.04 | 0.05
```

The autocorrelation drops steeply over the first tenth of a second and then levels at a shoulder near 0.36, from which it decays slowly. A component that decorrelates in a few hundredths of a second accounts for the steep drop, and a component that decorrelates over about 2 s accounts for the shoulder. The height of the shoulder gives the slow component's share of the variance. Because variances of independent components add, the two parts of PT-3's noise are:

- **fast noise**, from turbulence and pump pulsation: variance 0.64 × 0.0225 = 0.0144 bar², a standard deviation of **0.12 bar**, with a correlation time of about 0.03 s, partly smoothed by the transmitter's own damping;
- **slow noise**, from the die's cooling valves opening and closing through the casting cycle: variance 0.36 × 0.0225 = 0.0081 bar², a standard deviation of **0.09 bar**, with a correlation time of about 2 s.

Check: √(0.0144 + 0.0081) = √0.0225 = 0.150 bar. The model in the right-hand column of the figure uses exactly these two parts. It is a little low at the shortest lag because the transmitter's damping smooths the fastest variation, a detail that does not matter for anything later.

The split matters because every remedy treats the two parts differently. A filter with a time constant of half a second removes most of the fast noise and very little of the slow. An on-delay of a few tenths of a second ignores dips that last a few hundredths of a second, which the fast noise produces, but not dips that last a second, which the slow noise produces. Without the split, the effect of any remedy would be guesswork.

## The margin in standard deviations

The margin of a threshold, measured in standard deviations, is

k = (mean − threshold) ÷ σ

for a low threshold, and (threshold − mean) ÷ σ for a high one. For PSLL-3 at 3.2 bar, with σ = 0.150 bar, the margin is 6.67 standard deviations when the strainer is clean and the mean is 4.20 bar, and only 4.67 standard deviations when the mean has fallen to 3.90 bar. For PAL-3 at 3.6 bar, the margins are 4.0 and 2.0 standard deviations at the same two means.

```figure
type: formula
title: Margin and tail probability
formula: k = (μ − threshold) ÷ σ     P(reading beyond the threshold) = Φ(−k)
caption: Φ is the standard normal cumulative distribution. The probability applies to a single reading taken at a random moment; it is the fraction of time the signal spends beyond the threshold.
- μ | mean of the signal, bar
- σ | standard deviation of the noise, bar
- k | margin in standard deviations
- Φ(−k) | probability that a reading lies beyond the threshold
step: PSLL-3, mean 3.90 bar: k = (3.90 − 3.2) ÷ 0.150 = 4.67
step: Φ(−4.67) = 1.53 × 10⁻⁶, about 1.5 readings in a million
```

The probability Φ(−k) falls extremely fast as k grows. Each additional standard deviation of margin divides it by a large and increasing factor, which is why small changes in the mean have such large effects on trips.

```figure
type: compare
title: How the tail probability falls with the margin
rowhead: Margin k
cols: Φ(−k), fraction of readings beyond | Readings beyond, per shift at 100 a second
caption: A shift of 8 hours holds 2,880,000 readings at 100 a second. Between 4 and 5 standard deviations, the number of readings beyond the threshold falls a hundredfold; above 6 it is effectively zero.
- 2 | 0.0228 | 65,500
- 3 | 0.00135 | 3,890
- 4 | 3.17 × 10⁻⁵ | 91
- * 4.67 | 1.53 × 10⁻⁶ | 4.4
- 5 | 2.87 × 10⁻⁷ | 0.83
- 6 | 9.87 × 10⁻¹⁰ | 0.003
- 6.67 | 1.31 × 10⁻¹¹ | 0.00004
```

### How precisely the standard deviation is known

Because the tail probability depends so steeply on k, it depends steeply on σ, and σ from a ten-minute log is itself an estimate. The fast noise is well pinned down, since the log holds many thousands of independent stretches of it, but the slow noise is not: with a correlation time of about 2 s, ten minutes holds only about 150 effectively independent stretches of it, and the standard deviation of the whole signal is uncertain by a few per cent. A 3% change in σ moves the margin at a mean of 3.90 bar from 4.67 to between 4.53 and 4.81 standard deviations, and the predicted rate of excursions changes by a factor of about 0.5 to 1.9. Predictions this far into the tail are therefore good to within a factor of two or so, not to a few per cent. That is quite good enough to tell whether a setting will trip three times a shift or once a year, which is the decision that matters, but it is a reason to take logs on more than one day and to treat the second significant figure of any predicted trip rate with suspicion.

### The tail probability with a BIZOMAT tool

The [normal distribution out-of-tolerance tool](/tools/normal-out-of-spec/) calculates, for a normally distributed quantity with a given mean and standard deviation, the fraction below a lower limit and above an upper limit, with the Z values, the parts per million and the expected count for a stated quantity. It is written for parts against a tolerance, but the arithmetic is the same for readings against a threshold. Entered with a mean of 3.90 bar, a standard deviation of 0.150 bar, a lower limit of 3.2 bar, an upper limit of 10 bar (the top of the transmitter's range, so that nothing lies above it) and a quantity of 2,880,000 readings, it gives a Z to the lower limit of 4.667, **1.5 ppm below the lower limit**, and an expected count of 4.4 readings below 3.2 bar in a shift.

The tool's checks are worth heeding here. It assumes a stable, normal process, and it warns that tail estimates should be confirmed. At PT-3 the normality check above supports the assumption roughly, and the mean is stable over a shift even though it drifts over days.

## From readings to trips

Is 4.4 readings below 3.2 bar per shift the same as 4.4 trips per shift? Not quite, and the difference is the subject of Chapter 3. A trip happens when the signal **enters** the region below the threshold, and once it is there it may stay for several readings. If every excursion lasted exactly one reading, the number of trips would equal the number of readings below. If excursions lasted ten readings on average, there would be about a tenth as many trips. The fraction of readings beyond a threshold is the right starting point, but turning it into a rate of trips needs to know how quickly the signal moves, which is exactly what the autocorrelation describes. At 3.90 bar, the trip log showed 17 trips in six shifts, 2.8 a shift, somewhat below the 4.4 readings, which suggests that excursions last a little more than one reading on average.

## The error: a standard deviation from the historian

Before the full-rate log was taken, a colleague had estimated the noise from the plant historian. A week of PT-3's one-second values gave a standard deviation of **0.088 bar**. With that figure, the margin at a mean of 3.90 bar would have been 0.7 ÷ 0.088 = 7.95 standard deviations, and Φ(−7.95) is about 10⁻¹⁵. The calculation said the cell should practically never trip, while it was tripping three times a shift.

The contradiction was the clue. A one-second average of 100 readings removes most of the fast noise, because the fast part decorrelates in a few hundredths of a second and therefore averages down almost as if the readings were independent. It removes little of the slow noise, which hardly changes within a second. The historian's 0.088 bar was close to the slow part alone. The trip, which acts on individual readings, sees both. The rule is simple: measure the noise at the rate at which the threshold acts. A threshold applied to a one-second average could correctly use the one-second standard deviation; PSLL-3 acts on 10 ms readings and needs the standard deviation of 10 ms readings.

```figure
type: bars
title: PT-3's standard deviation by where it was measured
unit: bar
caption: This is an illustration. The same signal, three different spreads. Only the full-rate figure describes what PSLL-3 sees; the transmitter's accuracy is a different quantity altogether.
- * Full-rate PLC log, 10 ms readings | 0.150 | what the trip acts on
- Historian, one-second averages | 0.088 | mostly the slow part
- Transmitter accuracy statement | 0.05 | a bound on measurement error, not process noise
```

The third bar shows a related mistake. The transmitter's data sheet quotes an accuracy of ±0.05 bar, and it is tempting to treat that as the noise. It is not: it bounds the error between the transmitter's output and the true pressure, while most of PT-3's variation is real variation in the water's pressure. A perfect transmitter would show the same swings. Accuracy statements belong in an uncertainty budget for the measurement, as in [Random Error and Drift by the Numbers](/reados/publications/random-error-and-drift-by-the-numbers/correlated-noise/), not in a noise model of the process.

## How this applies to a small Australian business

For any threshold that gives trouble, take a full-rate log in normal running, calculate the mean and standard deviation, and express the threshold's margin in standard deviations. A margin below about 4 on a fast-changing signal will almost certainly cause frequent nuisance trips; a margin above about 6 will very rarely trip on noise. Check the tails against the normal distribution and look for events behind any very deep dips. Do not take the noise from a historian, a trend chart or a data sheet.

## Exercise: the alarm margin

PAL-3 is set at 3.6 bar. (a) What is its margin in standard deviations when the mean is 4.20 bar, and when it is 3.90 bar? (b) What fraction of readings lies below 3.6 bar in each case, and how many readings per shift is that? (c) What does the answer to (b) say about the alarm as currently configured?

**Worked answer.** (a) At 4.20 bar, k = (4.20 − 3.6) ÷ 0.150 = **4.0**; at 3.90 bar, k = 0.3 ÷ 0.150 = **2.0**. (b) Φ(−4.0) = 3.17 × 10⁻⁵, or **91 readings a shift**; Φ(−2.0) = 0.0228, or **65,500 readings a shift**, 2.3% of the time. (c) At a mean of 3.90 bar, PT-3 spends 2.3% of its time below the alarm setting. An alarm acting on raw readings would set and clear thousands of times a shift. The plant's operators had in fact shelved PAL-3 weeks earlier because it never stopped sounding, which means that the one alarm meant to warn of a falling pressure was not being seen at all. Chapter 5 deals with it.
