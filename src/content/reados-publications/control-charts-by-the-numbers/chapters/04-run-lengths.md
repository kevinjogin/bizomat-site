---
book: control-charts-by-the-numbers
chapterSlug: run-lengths-false-alarms-and-detection
order: 4
title: "Run lengths: false alarms and detection"
description: "The run length as a random variable: average run length for false alarms and real shifts, subgroup size against sampling interval, why 2σ limits backfire, and run lengths as first-passage times."
draft: false
---

Every control chart makes two kinds of mistake. It can signal when nothing has changed, a false alarm that sends the operator looking for a cause that is not there; and it can stay silent while the process has shifted, making parts after a change it has not yet seen. Both mistakes are unavoidable, because the chart is judging a random process from samples. Both can be measured with one idea: the run length, the number of points plotted until the chart signals. Its average, the average run length or ARL, is the common currency in which every chart design in this book is compared.

This chapter calculates run lengths for SP-12's X̄ chart, both when the process is in control and after shifts of various sizes. It shows how subgroup size and sampling interval trade against each other for the same measuring effort, what happens when limits are narrowed to "catch problems sooner", and how run lengths connect to the first-passage times of random processes, which is the method used for the CUSUM and EWMA charts in the next two chapters.

## The run length is random

For a Shewhart chart with independent points, each point has the same chance p of falling outside the limits. The number of points until the first one does is a geometric random variable: the chance that the first signal comes at point k is (1 − p) raised to the power k − 1, times p. Its mean is 1 ÷ p.

```figure
type: formula
title: Run length of a Shewhart chart
formula: P(RL = k) = (1 − p)^(k − 1) × p
formula: ARL = 1 ÷ p; standard deviation of RL = √(1 − p) ÷ p
caption: For three-sigma limits and a normal, in-control statistic, p = 0.0027 and the in-control ARL is about 370. The spread of the run length is as large as its mean.
- In control | p = 0.0027, ARL₀ = 370.4 points
- Median run length | about 256 points: half of all false alarms come sooner
step: Chance of at least one false alarm within 370 points: 1 − (1 − 0.0027)^370 = 63%
step: At 32 subgroups a day: 8.3% chance of a false alarm each day, one every 11.6 days on average
```

The spread is the first lesson. A chart whose average time between false alarms is 370 points will often signal much sooner: half of its false alarms come within 256 points, and a quarter within about 106. An operator who sees two false alarms in a week on SP-12's chart has not necessarily found a broken chart; it is unusual, not impossible. What matters is the long-run rate, which can be checked against the record of signals whose cause was never found.

## Detecting a shift

When the process mean shifts by δ standard deviations, the subgroup average shifts by δ√n standard deviations of the average, and the chance of a point beyond the limits rises. The run length is still geometric, now with a larger p, and its average is the out-of-control ARL.

```figure
type: compare
title: Average run length of SP-12's X̄ chart after a shift in the mean
cols: Shift, mm | ARL, subgroups | Average time to signal, hours | Spools made meanwhile
rowhead: Shift in process σ
caption: This is an illustration. Subgroups of 5 every half hour, three-sigma limits, σ = 0.0022 mm, 40 spools per half hour. Large shifts are caught almost at once; small ones take days.
- 0, no shift | 0 | 370.4 | 185 | not applicable
- 0.25σ | 0.00055 | 133.2 | 66.6 | about 5,330
- * 0.5σ | 0.0011 | 33.4 | 16.7 | about 1,340
- 0.75σ | 0.00165 | 10.8 | 5.4 | about 430
- 1σ | 0.0022 | 4.5 | 2.25 | about 180
- 1.5σ | 0.0033 | 1.6 | 0.8 | about 63
- 2σ | 0.0044 | 1.1 | 0.55 | about 43
```

The table is the X̄ chart's profile. A shift of one process standard deviation, 0.0022 mm, is signalled after 4.5 subgroups on average, about two and a quarter hours. A shift of half that size takes 33 subgroups, more than two shifts' work. A quarter-sigma shift is barely distinguishable from no shift at all. The insert-change error of Chapter 2, a shift of 0.0035 mm or about 1.6σ, was caught at the first subgroup after it, which the table predicts for most such shifts.

Averages hide the spread here too. After a one-sigma shift, the chance that the chart has signalled within one subgroup is 22%, within three 53%, within five 72% and within ten 92%. Planning for the average is planning to be late about a third of the time.

## What slow detection costs

The cost of slow detection is the parts made between the shift and the signal, multiplied by the extra share of them that are out of tolerance. For SP-12 that cost is small, because the process is capable. This is an illustration. After a half-sigma shift the mean sits at 12.0021 mm and the predicted reject rate rises from 21.8 to about 165 ppm; over the 1,340 spools made before the average signal, that is about 0.2 expected rejects. After a one-sigma shift, to 12.0032 mm, the rate rises to about 1,000 ppm, but the chart signals within about 180 spools, again about 0.2 expected rejects.

For a process with less margin, the same arithmetic gives very different answers. This is an illustration. Suppose a similar spool were made on an older lathe with σ = 0.003 mm and the mean again at 12.001 mm, a Cpk of 1.0 and about 1,470 ppm out of tolerance when in control. A half-sigma shift would raise that to about 6,200 ppm, and over the 1,340 spools made before the average signal about 8 spools would be out of tolerance. A one-sigma shift would raise it to about 22,800 ppm, and about 4 bad spools would be made in the 180 before the signal. On that process the half-sigma shift costs twice as many rejects as the larger one, because the chart is so slow to see it, and it is the arithmetic that should set the chart's design: the shift that matters is the one that would produce an unacceptable number of rejects before detection, and the chart should be designed to catch that shift quickly. For SP-12, the shift that matters is around one standard deviation; for a process with a Cpk near 1, it might be half that, and the X̄ chart alone would be too slow.

## Subgroup size against sampling interval

The plant could spend the same measuring effort, ten spools an hour, in different ways: one spool every six minutes, five every half hour, or ten every hour. The run length in points changes with the subgroup size; the time to signal also depends on the interval.

```figure
type: compare
title: Three ways to measure ten spools an hour on SP-12
cols: Hours between false alarms | Hours to signal a 0.5σ shift | Hours to signal a 1σ shift
rowhead: Sampling plan
caption: This is an illustration. Average times, three-sigma limits, independent normal readings. Larger, less frequent subgroups catch small shifts sooner and give fewer false alarms per hour; frequent single readings catch nothing faster here.
- One spool every 6 minutes | 37 | 15.5 | 4.4
- * Five spools every 30 minutes | 185 | 16.7 | 2.25
- Ten spools every hour | 370 | 12.8 | 1.8
```

Ten spools an hour as one subgroup gives the fewest false alarms and the fastest detection of both shifts, on average. The price is that a sudden large shift waits up to an hour to be seen at all, and that the spools made in that hour are not checked until the subgroup is measured. Single spools every six minutes react soonest to a very large shift but bury small ones in noise and raise a false alarm every 37 hours. SP-12's choice of five every half hour is a compromise: it catches the one-sigma shift that matters within about two hours, sees a gross change within half an hour, and gives a false alarm about once a fortnight.

These averages also ignore when within an interval the shift happens; on average a shift occurs half-way between subgroups, which adds half an interval to every detection time. That penalty is largest for the hourly plan.

## The error: two-sigma limits

This is an illustration. After a customer complaint about an oversize spool, a supervisor narrowed SP-12's X̄ limits from three to two standard deviations of the average, to "catch problems sooner". On paper it did: a one-sigma shift would be signalled after 1.7 subgroups instead of 4.5, and a half-sigma shift after 5.3 instead of 33.

It also changed the chance of a false alarm per point from 0.27% to 4.55%, and the in-control ARL from 370 to 22. At 32 subgroups a day, the cell saw about 1.5 false alarms every day. Within two weeks the operators had learned that most signals meant nothing, began logging them as "checked, no cause" without checking, and adjusted the offset on several that were in fact noise, adding variation. When a real shift came, from a loose tool clamp, it was signalled at the first subgroup, and logged as "checked, no cause".

```figure
type: compare
title: Three-sigma against two-sigma limits on SP-12's X̄ chart
cols: Chance of a false alarm per point | In-control ARL | False alarms a day | ARL for a 0.5σ shift | ARL for a 1σ shift
rowhead: Limits
caption: This is an illustration. Subgroups of 5, 32 a day. Narrow limits speed detection but make false alarms routine, and routine alarms are ignored.
- * Three-sigma | 0.27% | 370 | 0.09 | 33.4 | 4.5
- Two-sigma | 4.55% | 22 | 1.46 | 5.3 | 1.7
```

The quality engineer restored three-sigma limits and added the CUSUM of Chapter 5 for small shifts, which detects a half-sigma shift in the mean of the subgroups much faster than the X̄ chart without raising the false alarm rate. The lesson is that a chart's limits are a trade between two errors, and narrowing them to reduce one multiplies the other. A chart that cries wolf daily is not a more sensitive chart; it is an ignored one.

## Auditing the false alarm rate

The theory promises one false alarm in 370 points, but only if the process is in control, the data are independent and roughly normal, and the limits came from a good estimate of σ. The chart's own record tests all of those at once. Every signal is logged with its outcome: cause found, or no cause found after a proper check. Signals with no cause are the false alarms, and their count over a period can be compared with what the theory expects.

This is an illustration. Over 64 working days, SP-12's chart plotted 2,048 subgroups; at one in 370.4, the expected number of false alarms is 5.5. The count of signals with no cause behaves like a Poisson count with that mean, so anything up to about 10 is unremarkable: the chance of 10 or fewer is 97%, of 12 or fewer 99.5%. The log showed 6. Had it shown 15, the chart would have been raising far more alarms than chance explains, and the first suspects would be limits from an underestimated σ, autocorrelated readings, which Chapter 8 examines, or a measurement problem that the R chart should have seen. A false alarm rate is a property the plant can measure, not just a number in a textbook.

## What an ARL does not say

An average run length describes one idealised event: a sudden shift of a fixed size that stays put until it is detected. Real changes come in other shapes. A tool that wears moves the mean steadily rather than in a step, so the shift grows while the chart watches; a loose clamp may come and go, shifting some subgroups and not others; a bar batch may raise the spread rather than the mean, which the R chart sees and the X̄ chart may not. ARLs for steps remain the standard way to compare designs, because they are well defined and easy to calculate, but a chart should also be tried, by simulation or on historical data, against the kinds of change the process actually suffers. Chapter 8 does that for SP-12's tool wear.

There is also a difference between a shift present from the first point and one that arrives after the chart has been running. For a Shewhart chart the two are the same, because each point stands alone. For charts with memory, the CUSUM and EWMA of the next chapters, a shift that arrives when the chart's statistic has wandered away from its starting value takes a little longer, or a little less long, to detect. Published tables usually quote the first case; the difference is modest for well-designed charts.

## Run lengths as first-passage times

For a Shewhart chart, each point stands alone and the run length is geometric. For charts that remember past points, such as the CUSUM and EWMA, it is not, because whether the next point signals depends on where the chart's statistic already is. Those run lengths are first-passage times: the time until a random process, starting from a known value, first crosses a boundary. The physics of random processes treats exactly this question for diffusing particles reaching a wall, and Lemons and other texts on stochastic processes derive the expected time to reach a boundary from the process's rules.

The practical method, due to Brook and Evans for the CUSUM and to Lucas and Saccucci for the EWMA, divides the range of the chart's statistic into many small intervals, writes down the probability of moving from each interval to each other in one step, and solves a set of linear equations for the expected number of steps to cross the limit from each starting interval. It is the same mean-first-passage calculation used for machine breakdowns in Markov models, applied to a chart. The run lengths quoted in Chapters 5 and 6 were calculated this way, and agree with the values widely published for the same chart designs.

## Exercise: a smaller subgroup

The second shift proposes subgroups of three spools every half hour, to save gauging time. Using the normal model, the ARL of an X̄ chart with three-sigma limits after a shift of δ process standard deviations is 1 ÷ [Φ(−3 + δ√n) + Φ(−3 − δ√n)]. Find the ARL for shifts of 0.75σ and 1σ with n = 3, and compare them with n = 5. What does the change cost in time?

**Worked answer.** This is an illustration. With n = 3, a 0.75σ shift moves the average by 0.75 × √3 = 1.30 standard deviations of the average, so p = Φ(−1.70) + Φ(−4.30) = 0.0446 + 0.00001, and the ARL is **22.5 subgroups**, about 11 hours, against 10.8 subgroups, 5.4 hours, with n = 5. A 1σ shift moves the average by √3 = 1.73, so p = Φ(−1.27) + Φ(−4.73) ≈ 0.102 and the ARL is **9.8 subgroups**, about 4.9 hours, against 4.5 subgroups, 2.25 hours. Smaller subgroups more than double the time to catch the shift that matters for SP-12, for a saving of two spools a half hour. The proposal was declined; the gauging time was found instead by moving the gauge closer to the machine.
