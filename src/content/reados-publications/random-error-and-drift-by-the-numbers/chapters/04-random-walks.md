---
book: random-error-and-drift-by-the-numbers
chapterSlug: random-walks
order: 4
title: "Random walks: errors that accumulate"
description: "Model CW-5's wandering zero as a random walk, see how random and systematic errors build up in totals, and find the zero-tracking window that balances noise against wander."
draft: false
---

Some errors do not average away; they add up. The zero of a load cell left alone does not scatter around a fixed value, it wanders, a little further from where it started the longer it is left. A totaliser that adds up thousands of measurements accumulates their errors. Each of these is a **random walk**, the same process that carries a Brownian particle away from its starting point, and its defining property is that its spread grows with the square root of elapsed time.

This chapter models CW-5's zero as a random walk, calculates how far it wanders over seconds, minutes and a shift, contrasts how random and systematic errors build up in a production total, and finds the length of zero-tracking window that best balances the zero's own noise against its wander. The failure case is a checkweigher whose zero tracking was switched off.

## The random walk

Einstein's 1905 analysis of Brownian motion showed that a particle displaced by many small, independent random steps ends up, after time t, at a distance whose standard deviation grows as **√t**. The mathematical idealisation of that motion is the **Wiener process**, to which the supplied lecture notes devote their early chapters. Its essential properties are that its increments over separate time intervals are independent, and that the variance of its increment over an interval is proportional to the interval's length.

A zero that drifts by a random walk is described by a single coefficient, K, with units of the measured quantity per square root of time. CW-5's zero, with the platform empty, wanders with **K ≈ 0.05 g per √minute**, about **0.0065 g per √second**. Its standard deviation from its starting value after time t is **K √t**.

```figure
type: stats
title: How far CW-5's zero wanders if left alone
caption: This is an illustration with K = 0.05 g per √minute. The wander grows with the square root of time: a hundred times as long gives ten times the spread. Over a shift it reaches about a gram, ten times the weighing noise.
- 0.0065 g | after 1 s | negligible
- 0.020 g | after 10 s | small beside the weighing noise
- 0.050 g | after 1 minute | half the weighing noise
- 0.158 g | after 10 minutes | larger than the weighing noise
- 0.387 g | after 1 hour | four times the weighing noise
- *1.10 g | after 8 hours | a full shift
```

The square-root law follows from the variance rule of Chapter 2. Split an interval of length t into n equal steps. Each step adds an independent random change with variance proportional to its length, t ÷ n. Independent variances add, so after n steps the total variance is n × (t ÷ n) × K², which is **K² t**, whatever n is. The standard deviation is the square root, **K √t**. Nothing about the details of the steps matters, only that they are independent and that their variance scales with their duration; that is why the same law describes a pollen grain, a load cell's zero and a running total.

Random-walk wander in a load cell and its electronics comes from many small, slow processes: tiny temperature changes in the bridge and its wiring, mechanical settling, slow changes in the amplifier. None alone is large; together they behave like the sum of many small random steps, which is exactly what a random walk is. The slow, temperature-driven span drift in this book's noise model is different: it wanders but is pulled back towards its average as the temperature cycles, and Chapter 8 treats it as an Ornstein–Uhlenbeck process instead.

## Random walk against white noise

A random walk and white noise are related in a way worth knowing. A random walk is the running sum, or integral, of white noise. Conversely, the differences between successive values of a random walk are white noise. That gives two quick tests on any logged signal:

- if a signal's **differences** look like independent scatter of constant size, the signal is a random walk;
- if the signal's **spread** over windows of increasing length grows with the square root of the window length, it is a random walk; if it stays constant, it is white noise.

Chapter 5 turns the second test into a chart, the Allan deviation, which distinguishes white noise, random walk and other noise types at a glance.

### Estimating K from a log

CW-5's coefficient was not taken from a datasheet; it was measured. During a two-hour planned stop, the controller logged the empty-platform reading, averaged over a full second, once a minute. The technician then calculated the differences between successive one-minute readings. For a random walk those differences are independent, with a standard deviation equal to K times the square root of one minute, so their standard deviation, about 0.05 g, gave K directly. As a check, the differences between readings ten minutes apart had a standard deviation of about 0.16 g, close to the 0.05 × √10 ≈ 0.158 g a random walk predicts; a white noise would have given the same spread at both spacings, and a steady trend would have given ten times the spread at ten minutes. Two columns of differences in a spreadsheet distinguished the three.

### A random walk is not a trend

A random walk wanders, and wandering often looks like a trend. Over an hour, CW-5's zero may move 0.4 g in one direction, steadily enough that anyone looking at the plot would draw a straight line through it and extrapolate. The next hour it may move back, or keep going, with equal probability. A random walk has no direction to extrapolate; its expected future position is wherever it is now, and its spread around that grows with √t. Projecting a random walk's recent movement forward, to predict when it will cross a limit, is a reliable way to be wrong. A true trend, such as product slowly building up on the conveyor, is different: it moves at a roughly steady rate in one direction and can be extrapolated. Telling them apart needs either a physical explanation or enough data to see whether the "trend" reverses, which is another reason to log the zero rather than glance at it.

## Totals: random errors add slowly, systematic errors add fully

CW-5 also totals the weight of product packed each hour. At 120 packs a minute, an hour is **7,200** packs and about **3,600 kg** of product. Each pack's weight carries random error of about 0.092 g and, before correction, a systematic offset of +0.12 g.

The random errors are independent from pack to pack, so in the total they accumulate like a random walk: the total's random error is about **0.092 × √7,200 ≈ 7.8 g**, about two parts per million of 3,600 kg. The systematic error is the same on every pack, so it accumulates in full: **0.12 × 7,200 ≈ 864 g**, more than a hundred times the random part.

```figure
type: bars
title: Error in CW-5's hourly total of 7,200 packs
unit: g
max: 900
caption: This is an illustration. Random errors grow with the square root of the number of packs; a constant offset grows in proportion to it. In any large total, systematic error dominates.
- Random error, 0.092 g per pack | 7.8
- *Systematic offset, +0.12 g per pack | 864
```

The same contrast runs through all of measurement. Random errors fade in totals and averages; systematic errors do not. For a totaliser, an inventory reconciliation or a mass balance, calibration is everything and noise is nearly irrelevant.

### Random walks elsewhere in the factory

The same arithmetic turns up wherever small, independent errors are added in sequence:

- an **incremental move** on a machine, positioned by adding one step to the previous position, accumulates the step errors; ten moves each uncertain by 0.01 mm leave the final position uncertain by about 0.01 × √10 ≈ 0.03 mm, not 0.1 mm, if the step errors are independent, and by the full 0.1 mm if they are all the same;
- **chain dimensioning** on a drawing, each feature located from the previous one, stacks tolerances the same way, which is why datum-based dimensioning is preferred for features that must relate to each other;
- an **accelerometer** integrated twice to give position, or a **flowmeter** totalised over a day, turns its noise into a random walk in the result.

In each case the √n growth of independent errors is the optimistic limit; any shared, systematic part grows in proportion to n.

## Zero tracking

Because the zero wanders, CW-5 re-measures it in the gaps between packs and subtracts it. Chapter 3 showed that a zero taken from a single short gap is too noisy, and that averaging the zeros from many gaps reduces that noise by the square-root rule. But averaging over a longer history has a cost: the average describes where the zero was, on average, over the window, and the random walk has moved on since. The longer the window, the more out of date the zero.

For a running average of length T, the zero's own noise falls as the number of gaps grows, while its lag behind the wandering zero grows as the random walk spreads during the window. Using CW-5's numbers, each gap gives a zero with about 0.159 g of noise, there are about two gaps per second, and the wander behind a running average of length T has a standard deviation of about **K √(T ÷ 3)**.

```figure
type: compare
title: Error in CW-5's tracked zero for different averaging windows
cols: Gaps averaged | Zero noise | Wander behind the average | Combined
caption: This is an illustration. Short windows are noisy; long windows lag behind the wandering zero. The best window, about 30 s, balances the two, and the combined error is then about 0.029 g.
- 5 s | 10 | 0.050 g | 0.008 g | 0.051 g
- 10 s | 20 | 0.036 g | 0.012 g | 0.038 g
- *30 s | 60 | 0.021 g | 0.020 g | 0.029 g
- 60 s | 120 | 0.015 g | 0.029 g | 0.032 g
- 120 s | 240 | 0.010 g | 0.041 g | 0.042 g
```

The minimum is broad: anything from about 15 to 60 s is within a few thousandths of a gram of the best. At the best window the two contributions are equal, about 0.020 g each, which is a general property of this kind of balance and a useful check on the arithmetic: if one term is much larger than the other at the chosen window, the window is not optimal. CW-5's controller was set to a **30 s** running zero. Chapter 5 shows that the same balance appears as the bottom of the Allan deviation curve.

### What zero tracking cannot fix

Zero tracking corrects anything that changes the empty-platform reading: wander in the electronics, dust on the conveyor, a small change in belt tension. It cannot correct a change in the scale's **span**, its sensitivity, because an error in span is invisible with nothing on the platform and grows in proportion to the load. Temperature changes the span of a load cell and its electronics, slowly, and CW-5's noise model includes a span drift of about 0.15 g at 500 g. Zero tracking does nothing for it; only a check with a known weight shows it. Chapter 8 deals with span drift and sets the interval between span checks.

## A failure case: zero tracking switched off

This is an illustration. On an earlier line, product dribbling from a filler occasionally landed on the weigh conveyor between packs, and the zero tracking dutifully absorbed it into the zero, causing a few packs to read light. A technician solved the nuisance by switching zero tracking off, leaving the zero set once at the start of each shift.

Through the shift, the reject rate drifted: some days it crept up through the afternoon, other days it crept down, and the pattern was different each day. The detection came from a plot of hourly reject rates over two weeks, which showed the erratic afternoon swings, and from logging the empty-platform reading during breaks, which wandered by up to a gram or more from its morning value. That matched a random walk of 0.05 g per √minute: about 1.1 g of spread after eight hours.

The correction was to restore zero tracking with a 30 s window and to deal with the dribble separately: a tray under the filler outlet, and a rule in the controller that ignores any gap reading more than a set amount above the running zero, so that a lump of product is never mistaken for drift. The shop's lesson was that a random walk always wins in the end; it must be tracked, not ignored.

## How this applies to a small Australian business

Recognise random-walk wander by its growth with the square root of time, or by differences that look like white noise. Estimate its coefficient from logged zero readings over minutes to hours. Track and subtract wandering zeros, and choose the tracking window to balance the zero's noise against its lag, near where the two are equal. In totals, expect random errors to fade and systematic errors to accumulate in full, and put calibration effort where totals matter.

## Exercise: a quieter load cell

A replacement load cell has half the random-walk coefficient, **K = 0.025 g per √minute**, with the same 0.159 g of noise per gap. What is the new best zero-tracking window, and what combined zero error does it give? How far would this zero wander over an eight-hour shift if left alone?

**Worked answer.** K is now about **0.025 ÷ √60 ≈ 0.00323 g per √s**. The best window balances 0.159² ÷ (2T) against K² T ÷ 3, giving **T* = √(3 × 0.159² ÷ (2 × 0.00323²)) ≈ 60 s**, twice the previous best. The combined error there is about **√(0.159² ÷ 120 + 0.00323² × 60 ÷ 3) ≈ 0.020 g**. Left alone, the zero would wander by about **0.025 × √480 ≈ 0.55 g** over eight hours: half as far, but still far more than the weighing noise, so tracking is still essential.
