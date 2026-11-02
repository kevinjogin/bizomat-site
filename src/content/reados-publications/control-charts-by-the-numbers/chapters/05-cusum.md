---
book: control-charts-by-the-numbers
chapterSlug: cusum-a-random-walk-that-remembers
order: 5
title: "CUSUM: a random walk that remembers"
description: "The tabular CUSUM as a random walk with drift: reference value and decision interval, its run lengths, reading where a shift began, running it beside an X̄ chart, and a CUSUM that was never reset."
draft: false
---

A Shewhart chart judges each point on its own. That makes it quick to see a large jump and slow to see a small, sustained shift, because a small shift moves each point only a little, rarely enough to cross a limit. The cumulative sum, or CUSUM, chart takes the opposite approach. It adds up the deviations of successive points from the target, so that a small shift, repeated point after point, accumulates into a large sum. Proposed by E. S. Page in 1954, it is the most efficient simple chart for detecting a sustained shift of a chosen size.

This chapter explains the tabular CUSUM as a random walk with a drift that changes sign when the process shifts, designs one for SP-12's subgroup averages, calculates its run lengths, and runs it with the KEVOS® CUSUM tool on twenty subgroups in which a small shift is hidden. It ends with a CUSUM that was not reset after an adjustment and signalled for the wrong reason.

## Adding up the evidence

The tabular CUSUM keeps two running sums: an upper sum that accumulates evidence of an upward shift, and a lower sum for a downward one. Each new point adds its deviation from the target, less an allowance called the reference value k, and neither sum is allowed to fall below zero.

```figure
type: formula
title: The tabular CUSUM
formula: Upper: S⁺ᵢ = max(0, S⁺ᵢ₋₁ + xᵢ − μ₀ − k)
formula: Lower: S⁻ᵢ = max(0, S⁻ᵢ₋₁ + μ₀ − k − xᵢ)
formula: Signal when S⁺ or S⁻ exceeds the decision interval h
caption: μ₀ is the target, k the reference value, h the decision interval. Choosing k as half the shift to be detected, and h about four or five standard deviations of the plotted value, are common starting points. This is an illustration: SP-12's design.
- Plotted value | subgroup averages, standard deviation σₓ̄ = 0.00098 mm
- Shift to detect | 1σₓ̄ = 0.00098 mm, about half a process standard deviation
step: k = 0.5 × 0.00098 = 0.00049 mm
step: h = 4.77 × 0.00098 = 0.00467 mm, chosen to give an in-control ARL of about 370, like the X̄ chart
```

The reference value is the key. While the process is on target, each point's deviation averages zero, and subtracting k gives each step an average of −k: the sum drifts downward and keeps bumping against zero. After an upward shift of δ, each step averages δ − k: if δ is larger than k, the sum drifts upward and eventually crosses h. Setting k at half the shift to be detected puts the boundary between "drift down" and "drift up" half-way between no shift and the shift that matters.

## A random walk with drift

Seen this way, the CUSUM is a random walk: each step is a random amount, the deviation of a noisy point, and the steps accumulate. Lemons and every introduction to stochastic processes study exactly this object, the random walk with drift, and its continuous limit, Brownian motion with drift. The floor at zero makes it a walk with a reflecting barrier; the decision interval is an absorbing barrier. The run length is the time for the walk, starting at zero, to reach h for the first time.

The physics gives the right intuition. A walk with drift v and step spread s covers a distance of about vt by drift and about s√t by diffusion after t steps. Under control, the drift is negative and the walk rarely strays far from the floor; to reach h it needs an unusual run of positive steps, which takes a long time. After a shift larger than k, the drift is positive and the walk climbs steadily, reaching h after roughly h ÷ (δ − k) steps, with a correction for the diffusion that Siegmund's approximation adds. That is why a CUSUM detects small shifts so much faster than a Shewhart chart: it uses the drift, which grows with the number of points, while the Shewhart chart uses only each point's own deviation, which does not.

## Run lengths of SP-12's CUSUM

The run lengths were calculated by the Markov-chain method of Brook and Evans, described in Chapter 4, and checked against values widely published for the same designs.

```figure
type: compare
title: Average run lengths for SP-12's subgroup averages, CUSUM against the X̄ chart
cols: CUSUM, k = 0.5, h = 4.77 | X̄ chart, three-sigma
rowhead: Shift in σₓ̄ (and in process σ)
caption: This is an illustration. Two-sided charts on averages of five. The two charts have almost the same false alarm rate; the CUSUM is several times faster for shifts of one σₓ̄ or less and slightly slower for very large ones.
- None | 369 | 370
- 0.5σₓ̄ (0.22σ) | about 35 | about 155
- * 1.12σₓ̄ (0.5σ) | 8.3 | 33.4
- 2σₓ̄ (0.89σ) | 3.9 | 6.3
- 3σₓ̄ (1.34σ) | 2.5 | 2.0
```

The comparison is the CUSUM's case. For the half-sigma shift that SP-12's X̄ chart needs 33 subgroups, more than two shifts, to catch on average, the CUSUM needs about 8, four hours. For very large shifts, the Shewhart chart is slightly faster, because a single huge point crosses its limit at once while the CUSUM must climb from wherever it is. The two charts are complementary, and SP-12 runs both: the X̄ chart for large shifts and the R chart for spread, the CUSUM for small sustained shifts.

## Twenty subgroups with a hidden shift

This is an illustration. On a Thursday, a new bar batch arrived part-way through the morning. Its material machined a little differently, and from the eleventh subgroup the mean moved up by 0.0011 mm, half a process standard deviation. Nobody knew that at the time. The subgroup averages for the morning were: 11.9987, 11.9999, 12.0031, 12.0012, 11.9999, 12.0012, 12.0000, 12.0014, 12.0004, 12.0033, 12.0023, 12.0015, 12.0022, 12.0014, 12.0000, 12.0024, 12.0033, 12.0017, 12.0030 and 12.0028 mm.

On the X̄ chart every average lies inside 11.99806 to 12.00394 mm; the highest, 12.0033 mm, is 0.0006 mm short of the limit. A sharp eye might notice that the second ten look higher than the first ten, and they are: they average 12.00206 mm against 12.00091 mm. But the chart gives no signal.

The [CUSUM control chart check](/tools/cusum-chart-check/) runs the tabular CUSUM on up to twenty readings or subgroup means. From the target, the standard deviation of the plotted values, the shift to detect in standard deviations and the decision interval, it calculates the reference value, the upper and lower sums for every reading, the first reading at which either sum exceeds the decision interval and the direction of the shift, and the reading at which the signalling sum last left zero, which estimates when the shift began. It reminds the user to check that h and the shift to detect give acceptable false alarm and detection rates.

```figure
type: line
title: SP-12's upper CUSUM through the Thursday morning
x: Subgroup
y: Upper sum S⁺, µm
ymin: 0
ymax: 8
caption: This is an illustration. Target 12.001 mm, σₓ̄ 0.00098 mm, shift to detect 1σₓ̄, h = 0.00467 mm (4.67 µm). The sum leaves zero at subgroup 10 and crosses h at subgroup 18. The lower sum stays below 2.5 µm throughout.
- 1 | 0
- 3 | 1.61
- 5 | 0
- 9 | 0
- 10 | 1.81
- 12 | 2.63
- 14 | 3.25
- 15 | 1.76
- 16 | 2.67
- 17 | 4.48
- 18 | 4.69
- 20 | 7.51
```

The tool signals an upward shift at subgroup 18 and reports that the upper sum last left zero at subgroup 10. The shift had in fact begun at subgroup 11: the estimate is one subgroup early, because subgroup 10 happened to be high by chance. That second piece of information is as useful as the signal. It tells the operator to look for what changed around subgroups 10 and 11, and the bar batch change, logged at 9:50, was found at once. The estimate of where the shift started is a feature the Shewhart chart does not offer.

The signal came seven subgroups after the shift, close to the average of 8.3 the run-length table predicts. In that time about 280 spools were made with the mean 0.0011 mm high; at the shifted mean the predicted reject rate is about 165 ppm, so the expected number out of tolerance was well under one. The response was an offset of −0.0011 mm and a note to the bar supplier.

## Designing a CUSUM

Three decisions set a CUSUM's behaviour, and each has a clear basis.

```figure
type: steps
title: Designing a CUSUM for a characteristic
caption: This is an illustration of SP-12's choices. Published tables, or the Markov-chain method, give the ARLs for other choices of k and h.
- Choose what to plot | subgroup averages for SP-12; single readings work too, with their own σ
- Choose the shift that matters | 0.5 process σ for SP-12, from the cost of rejects in Chapter 4
- Set k | half that shift in units of the plotted value: 0.5σₓ̄
- * Set h | from the in-control ARL wanted: h = 4.77σₓ̄ gives about 370, like the X̄ chart
- Check the ARL for the shift | 8.3 subgroups at 0.5σ, about four hours
- Decide the reset | after any signal and any deliberate adjustment, both sums return to zero
```

A larger h gives fewer false alarms and slower detection: with h = 4, the in-control ARL falls to 168 and the half-sigma ARL to 7.1; with h = 5, 465 and 8.7. A k tuned to a larger shift, say k = 1σₓ̄ with h about 2.5, matches the X̄ chart's false alarm rate but is tuned for a two-sigma shift in the averages and is slower for the half-sigma one, about 10 subgroups. The design should start from the shift that matters, not from a table's first row. It should also be written down with its reasons, so that a later engineer who wants to change h can see what the chart was designed to catch and what the change would cost in false alarms.

## A CUSUM on single readings

The CUSUM works just as well on single readings, which makes it a natural partner for the individuals charts of Chapter 3, where the Shewhart approach is weakest. The design is the same in units of the readings' own standard deviation. This is an illustration. For SP-12's case hardness, with σ̂ about 0.5 HRC from the clean baseline, a CUSUM with k = 0.25 HRC and h = 2.39 HRC (0.5σ and 4.77σ) has an in-control ARL of about 370 batches, like the individuals chart. A sustained one-sigma shift in the heat treater's mean, 0.5 HRC, would be signalled after about 10 batches on average, against about 44 on the individuals chart. For a process that produces one reading a day, that is the difference between a fortnight and two months.

The same caution applies as for single-reading charts generally: the CUSUM's run lengths assume roughly normal, independent readings, and a skewed or autocorrelated characteristic needs its run lengths checked by simulation before the design is trusted.

## One side or two

A CUSUM can watch one direction only. If only one direction of shift matters, or only one is physically plausible, a one-sided CUSUM with the same k and h raises false alarms half as often, because only one sum can cross. For SP-12's diameter both directions matter, so both sums are kept. For a characteristic such as tool wear, which moves the diameter only one way, an upper sum alone is enough, and its decision interval can be set a little lower for the same false alarm rate, catching the drift sooner. The tool reports both sums, and the user can simply watch the one that matters.

## Reading a CUSUM well

A CUSUM chart looks different from a Shewhart chart, and operators need a little training to read it. The sums do not show the process value; they show accumulated evidence. A sum that climbs steadily means a sustained shift; a sum that jumps once and then decays means a single high point, which the X̄ chart will have seen anyway. The slope of a climbing sum estimates the size of the shift: the upper sum rose from 1.81 to 7.51 µm over subgroups 10 to 20, about 0.57 µm per subgroup, which, adding back k = 0.49 µm, suggests a shift of about 1.06 µm, close to the true 1.1 µm.

That estimate makes the CUSUM useful beyond detection: it tells the setter how far to adjust. It should still be confirmed by a few subgroups after the adjustment, because the slope over ten noisy points is itself uncertain.

## The error: a CUSUM that was not reset

This is an illustration. A week later the CUSUM signalled an upward shift at mid-afternoon. The setter found nothing: no bar change, no insert change, a normal gauge, a warm and steady machine. The subgroup averages over the afternoon looked ordinary, scattered around 12.0012 mm.

The quality engineer looked back through the sums. The upper sum had been climbing since the morning, when a real upward shift had been signalled and corrected with an offset, but the sum had not been reset to zero after the correction. It had started the afternoon at 4.1 µm, just under h, carrying evidence of a shift that no longer existed, and a few slightly high but ordinary subgroups had pushed it over.

The rule that was missing is part of every CUSUM procedure: after a signal and a deliberate adjustment, both sums return to zero, because the process they were tracking has changed. The tool starts both sums from zero for each set of readings it is given, so the error does not arise there, but a CUSUM kept running in a spreadsheet or a control system must be reset explicitly. SP-12's control software was changed to reset the sums automatically whenever an offset is entered, and the operator instructions were updated to say so. The afternoon's signal was logged as a false alarm with its cause: a procedure fault, not a process fault.

## Exercise: a tighter decision interval

The plant considers h = 4σₓ̄ instead of 4.77σₓ̄, keeping k = 0.5σₓ̄. Run the CUSUM on the Thursday data with h = 0.00392 mm. At which subgroup does it signal? Using the run lengths for h = 4 (in-control ARL 168, ARL 7.1 for the half-sigma shift), what would SP-12 gain and lose in a day of 32 subgroups?

**Worked answer.** This is an illustration. With h = 0.00392 mm, the upper sum first exceeds h at subgroup **17**, where it reaches 0.00448 mm; it last left zero at subgroup 10, as before. The signal comes one subgroup sooner than with h = 0.00467 mm. On average, the half-sigma shift would be caught after 7.1 subgroups instead of 8.3, about 36 minutes sooner. The cost is false alarms: an in-control ARL of 168 means about 32 ÷ 168 = **0.19 false alarms a day**, one every five days, against one every 11.5 days with h = 4.77. Since the half-sigma shift costs well under one reject at SP-12's capability, the plant kept h = 4.77; a less capable process might choose differently.
