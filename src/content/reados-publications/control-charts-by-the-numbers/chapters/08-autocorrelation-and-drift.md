---
book: control-charts-by-the-numbers
chapterSlug: autocorrelation-drift-and-tool-wear
order: 8
title: "Autocorrelation, drift and tool wear"
description: "When readings are not independent: autocorrelation and the false alarms it causes, sampling far enough apart, residual charts, tool-wear drift as a random walk with drift, and compensation."
draft: false
---

Every chart in the previous chapters assumed that successive readings are independent: knowing one tells you nothing about the next beyond what the process mean already says. Many processes break that assumption. Temperatures, concentrations, pressures and anything else that changes slowly have memory: a reading above the mean is likely to be followed by another above it. Tools wear, and a dimension that grows a little every hour is not a set of independent draws from one distribution but a drifting one. Charts applied to such data without thought either raise alarms constantly or miss the very drift that matters.

This chapter explains autocorrelation and shows, with numbers, what it does to the moving-range estimate and to false alarms. It then sets out the remedies: sampling far enough apart, charting averages or residuals, and treating wear as the predictable drift it is. It uses the cell's coolant temperature, whose chart went badly wrong, and SP-12's tool wear, which the CUSUM of Chapter 5 is well placed to watch.

## Memory in a process

Autocorrelation measures how much a reading resembles the reading a fixed time before it. The lag-1 autocorrelation, φ, is the correlation between each reading and the previous one: zero for independent readings, close to one for a slowly changing quantity sampled often. A simple model that captures most short-memory processes is the first-order autoregressive process: each reading is φ times the previous deviation from the mean, plus a fresh random kick. It is the same mean-reverting process that Lemons develops from Langevin's equation, the Ornstein–Uhlenbeck process, sampled at equal intervals, and the same structure Chapter 6 found inside the EWMA.

In such a process the correlation between readings k steps apart is φᵏ. Memory fades geometrically, and how fast depends on φ and on the sampling interval: the same physical process sampled every minute may have φ = 0.9, and sampled every half hour, φ³⁰ = 0.04, effectively independent.

## What autocorrelation does to a chart

The individuals chart estimates σ from the moving range, the jump between successive readings. If successive readings are positively correlated, they jump less than independent readings would, and the moving range underestimates the process's real spread. For the autoregressive process, the moving-range estimate is σ√(1 − φ). The limits, drawn at three times that estimate, sit at only 3√(1 − φ) true standard deviations, and the false alarm rate soars.

```figure
type: compare
title: Individuals chart with moving-range limits on autocorrelated data
cols: σ̂ from the moving range, × true σ | Limits at, true σ | False alarm chance per point | In-control ARL
rowhead: Lag-1 autocorrelation φ
caption: Calculated for a normal first-order autoregressive process; a simulation of 200,000 readings with φ = 0.7 gave the same 10% of points outside the limits. Even modest autocorrelation multiplies false alarms.
- 0, independent | 1.000 | 3.00 | 0.27% | 370
- 0.3 | 0.837 | 2.51 | 1.2% | 83
- 0.5 | 0.707 | 2.12 | 3.4% | 30
- * 0.7 | 0.548 | 1.64 | 10% | 10
- 0.9 | 0.316 | 0.95 | 34% | 2.9
```

At φ = 0.5, a stable process would signal about once every thirty points by chance; at 0.9, a third of all points signal. The process has not changed. The chart's assumptions have. Negative autocorrelation, where a high reading tends to be followed by a low one, does the opposite: it inflates the moving ranges, widens the limits and hides real changes. It is rarer, but it appears in processes that are adjusted after every reading, which is one more reason not to tamper.

## Measuring autocorrelation

The lag-1 autocorrelation is easy to estimate from a baseline in time order: take each reading's deviation from the mean, multiply it by the next reading's deviation, add up the products, and divide by the sum of the squared deviations. A scatter plot of each reading against the one before it shows the same thing at a glance: a round cloud for independent data, a diagonal band for correlated data. Repeating the calculation for readings two, three and more steps apart shows how quickly the memory fades.

The estimate has its own uncertainty. For n independent readings, a sample autocorrelation within about ±2 ÷ √n of zero is consistent with no correlation at all. With 125 readings that band is ±0.18; with 25 readings, ±0.40, so short baselines can neither confirm nor rule out moderate correlation. A practical rule is to check the lag-1 autocorrelation on every new chart's baseline of 100 or more readings, and to take any value above about 0.3 seriously.

## The coolant chart

This is an illustration. SP-12's lathe is fed from a central coolant system, and coolant temperature affects the spool's diameter through thermal growth of the part and the machine. A data logger records the coolant temperature every minute. Over a stable day it averaged 22.0 °C with a standard deviation of 0.4 °C, wandering slowly as the chiller cycled, with a lag-1 autocorrelation of 0.9.

A process engineer set up an individuals chart on the per-minute readings, with limits from the moving range. The moving ranges were small, because successive minutes differ little, and σ̂ came out at 0.4 × √0.1 = 0.126 °C, giving limits of 22.0 ± 0.38 °C. About a third of all readings fell outside them, some twenty an hour. The operators were told to adjust the chiller set point on each signal, and they did. The adjustments, each chasing the last reading, made the coolant temperature oscillate more than before: Chapter 6's tampering, driven by a chart that could not tell a slow wander from a change.

## The error and its correction

The quality engineer looked at the readings as a time series rather than a list. A plot of each reading against the one before it was a tight diagonal line, and the lag-1 correlation was 0.9: the readings were nearly copies of each other. The table above gave the expected false alarm rate, a third of all points, which matched what the operators had seen. Nothing was wrong with the coolant; the chart was wrong for the data.

Three corrections were possible, and the plant used the first two.

```figure
type: decision
title: Charting a process with memory
question: How strongly are successive readings correlated, and how often are they needed?
caption: This is an illustration. For the coolant, a reading every 30 minutes is nearly independent and frequent enough; the residual chart is kept for the investigation of short disturbances.
- Correlation fades within the sampling interval you need | sample further apart, so readings are nearly independent | coolant read every 30 min, φ³⁰ = 0.04
- * Correlation persists but averages are what matter | chart averages of non-overlapping windows, with limits from their own spread | half-hourly averages of the per-minute readings
- The short-term dynamics themselves matter | fit the autoregressive model and chart its residuals | residual σ = 0.4 × √(1 − 0.81) = 0.17 °C
- The wander is too slow to matter at all | do not chart it; set alarm limits from what the process can tolerate | engineering limits on the chiller
```

The coolant chart now plots half-hourly averages with limits from the standard deviation of those averages over a baseline week. It signals rarely, and when it does, it has found a real change, such as a chiller fault. The per-minute log is kept, and an alarm at fixed engineering limits, 20.5 and 23.5 °C, warns of gross faults. The chiller is no longer adjusted by hand, and the coolant temperature has been steadier since.

## SP-12's own readings

The same question had to be asked of the spools. Are five consecutive spools, the subgroups of Chapter 2, independent enough for R̄ to estimate the right σ? If consecutive spools were strongly correlated, ranges within subgroups would be small, R̄ would underestimate σ, and the X̄ limits would be too narrow. The baseline answered it. This is an illustration. Over 125 consecutive spools, the lag-1 autocorrelation of the diameter was 0.08, too small to matter, and σ from R̄, 0.0022 mm, agreed with the standard deviation of all 125 spools to within 2%. The subgroups are sound. The check is worth making on any new chart, because the answer depends on the process: on a different machine, with a slower thermal wander or a longer cycle, it might not be.

## Warm-up is a trend, not noise

After a cold start, SP-12's lathe grows as its spindle, slideways and coolant warm, and the diameter moves for the first forty minutes or so before it settles. That movement is not random variation and not a special cause; it is a predictable transient that happens every morning and after every long stop. Charting it as if it were noise produces signals every morning, each correctly saying that the process differs from its steady state, and each telling the operator nothing new.

The cell's procedure handles it directly. The lathe runs a warm-up program for thirty minutes before production, and the first subgroup of each day is taken only after a further five spools. Spools made during warm-up are measured individually against the tolerance, with the gauge, not charted. The chart describes the warm process, which is what its limits came from. The general point is that a known, repeatable pattern belongs in the procedure or the model, not in the noise that the chart judges.

## Drift in the gauge

A drift on the chart may come from the measurement rather than the process. SP-12's in-process gauge measures against a master ring, and as the gauge and the master warm through the day, the gauge's zero can move by a micrometre or two. On the chart that looks exactly like a slow process drift: the averages climb, the CUSUM eventually signals, and the setter applies an offset that moves the real diameters away from target.

The defence is a master check at fixed intervals. Every two hours the operator measures the master ring; if the reading has moved by more than 0.0005 mm from its certified value, the gauge is re-zeroed before any offset is considered, and the chart is annotated. The R chart of Chapter 2 cannot catch gauge drift, because a drifting zero shifts all five readings of a subgroup equally and leaves their range unchanged. Only a check against a known reference can separate a drifting gauge from a drifting process.

## Tool wear: a random walk with drift

A cutting insert wears steadily, and on an outside turning operation wear moves the cutting edge away from the axis, so the diameter grows. This is an illustration. On SP-12, the land diameter grows by about 0.0004 mm an hour of cutting as the insert wears, on top of the random spool-to-spool variation. Between offset corrections, the diameter is a random process with drift: the sum of a steady trend and noise. Lemons studies the continuous version, Brownian motion with drift, and the same picture applies: the drift dominates over long times, the noise over short ones.

Uncorrected, the drift would carry the mean from 12.001 mm by one process standard deviation, 0.0022 mm, in about 5.5 hours, and towards the upper limit within a long shift. Two approaches keep it in check.

The first is planned compensation. The setter applies an offset of −0.0016 mm every four hours of cutting, the expected wear in that time. The mean then follows a sawtooth between about 12.0002 and 12.0018 mm. The sawtooth adds variation: a uniform spread 0.0016 mm wide has a standard deviation of 0.0016 ÷ √12 = 0.00046 mm, which combines with the spool-to-spool 0.0022 mm by the variance sum rule of Chapter 1 to give 0.00225 mm overall. The predicted reject rate rises from 21.8 to about 31 ppm, a modest cost. Compensating every two hours, with half the offset, would halve the sawtooth's contribution.

```figure
type: compare
title: SP-12's land diameter under three tool-wear strategies
cols: Mean ranges over | Added standard deviation, mm | Overall σ, mm
rowhead: Strategy
caption: This is an illustration. Wear of 0.0004 mm an hour; spool-to-spool σ of 0.0022 mm. Planned compensation turns an unbounded drift into a small, bounded addition to the spread.
- No compensation, 8 hours | 12.001 to 12.0042 | grows without limit | not stationary
- * Offset −0.0016 mm every 4 hours | 12.0002 to 12.0018 | 0.00046 | 0.00225
- Offset −0.0008 mm every 2 hours | 12.0006 to 12.0014 | 0.00023 | 0.00221
```

The second approach is to let the chart decide when to compensate. A one-sided upper CUSUM of the subgroup averages, as in Chapter 5, is well suited to a drift that only goes one way. In a simulation of 20,000 drifting runs starting on target, SP-12's CUSUM signalled after 8.6 subgroups on average, about 4.3 hours, when the drift had reached about 0.0017 mm; the X̄ chart took 10.8 subgroups, about 5.4 hours, by which time the drift was about 0.0022 mm. The CUSUM's signal then triggers the offset, and its slope estimates how much.

The two approaches combine well: planned compensation for the expected wear, and the CUSUM to catch wear that runs faster than expected, for instance with a harder bar batch or a damaged insert. What should not happen is for the drift to be left in the data used to set the chart's limits. A baseline that includes several hours of uncorrected wear has an inflated overall σ and averages that trend, and its limits are wrong for the controlled process.

## Exercise: a moderately correlated process

A furnace temperature is logged every 5 minutes, with a lag-1 autocorrelation of 0.5. What false alarm rate and in-control ARL would an individuals chart with moving-range limits have? How far apart would readings need to be for the correlation between them to fall to about 0.05?

**Worked answer.** This is an illustration. With φ = 0.5, the moving-range estimate is √(1 − 0.5) = 0.707 of the true σ, so the limits sit at 3 × 0.707 = **2.12 true standard deviations**, and the chance of a point outside them is 2Φ(−2.12) = **3.4%**, an in-control ARL of about **30 points**, two and a half hours of readings. The correlation k readings apart is 0.5ᵏ, which falls to 0.05 when k = ln 0.05 ÷ ln 0.5 = **4.3**, so readings about 22 minutes apart, every fifth reading, are nearly independent. Charting the average of each 25-minute window, with limits from those averages' own spread, would use all the data and avoid the false alarms.
