---
book: random-error-and-drift-by-the-numbers
chapterSlug: random-error-systematic-error-and-drift
order: 1
title: "Random error, systematic error and drift"
description: "Sort CW-5's measurement errors into random scatter, fixed offsets and slow wander, recognise each in a run of readings, and see why adjusting after every reading makes the scatter worse."
draft: false
---

Put a certified 500 g weight on a checkweigher twenty times and the twenty readings will not agree. Some will be a little high, some a little low; their average may sit a fraction of a gram away from 500; and if the same test is repeated the next morning, the average may have moved. Those three observations are three different kinds of error, and they behave differently, have different causes and need different cures. Treating them as one, as "the scale is out", is the most common reason measurement problems are never solved.

This chapter defines random error, systematic error and drift, shows how each appears in a run of readings from CW-5, introduces the language of the international uncertainty guide that the rest of the book uses, and shows with numbers why adjusting a process after every reading makes things worse. The failure case is exactly that habit.

## Three kinds of error

```figure
type: compare
title: Three kinds of measurement error in CW-5
cols: What it looks like | Typical causes | What reduces it
caption: This is an illustration. Real measurements usually show all three at once; separating them is the first step to improving any of them.
- Random error | readings scatter around their average, differently every time | electrical noise, vibration, air currents on the conveyor | averaging; filtering; removing the source
- Systematic error | the average is offset from the true value, the same way each time | calibration error; a tare not cleared; product build-up on the conveyor | calibration against a reference; correction
- *Drift | the average itself wanders slowly over minutes, hours or days | temperature, creep in the load cell, ageing electronics | re-zeroing; periodic checks; temperature control
```

**Random error** is the part that changes from one reading to the next, unpredictably. It is described by a standard deviation and reduced by averaging, as Chapter 2 shows. **Systematic error** is the part that stays the same for every reading made under the same conditions: an offset or a scale-factor error. Averaging does nothing to it; it is found by comparing with a reference, such as a certified weight, and corrected. **Drift** sits in between: it is systematic over a short time, because consecutive readings share it, but it changes over longer times. It is the reason a scale calibrated at 7 am can be wrong at 3 pm.

The distinction depends on the time scale. Vibration that varies within one 200 ms window is random error for a single weighing; a temperature change over half an hour is drift. Chapters 3 to 5 develop the tools that tell them apart.

## A run of readings

At the start of a shift, CW-5's technician places a certified 500.00 g check weight on the stationary weigh conveyor and takes twenty readings, each using the normal 200 ms averaging window. Using the noise model of this book, those readings scatter with a standard deviation of about **0.092 g**, and their average sits at **500.12 g**: an offset of **+0.12 g**, left over from the last calibration and from a little product dust on the conveyor.

```figure
type: stats
title: Twenty readings of a 500.00 g check weight on CW-5
caption: This is an illustration. The standard deviation of single readings measures random error; the difference between the average and the reference measures systematic error, to within the uncertainty of the average itself.
- 0.092 g | Standard deviation of single readings | random error of one weighing
- *+0.12 g | Average minus reference | systematic error, at this moment
- 0.021 g | Standard deviation of the average of 20 | 0.092 ÷ √20
- ±0.04 g | Rough 95% interval on the offset | about 2 × 0.021
```

The last two lines matter. The offset is known only as well as the average is known, and the average of twenty readings has its own standard deviation, about 0.092 ÷ √20 ≈ **0.021 g**. The offset of +0.12 g is therefore real, many times its uncertainty, and worth correcting; an apparent offset of +0.02 g from the same test would not be distinguishable from zero. Chapter 2 explains the square-root rule behind that calculation and its limits.

## The language of uncertainty

The international *Guide to the Expression of Uncertainty in Measurement*, published by the Joint Committee for Guides in Metrology as JCGM 100:2008 and freely available from the BIPM, provides the vocabulary used in this book.

- A **measurand** is the quantity intended to be measured: here, the mass of a pack.
- The **standard uncertainty** of a component is its standard deviation, or an equivalent estimate.
- A **Type A** evaluation estimates a standard uncertainty from repeated observations, as the 0.092 g above was.
- A **Type B** evaluation estimates it by other means: a calibration certificate, a maker's specification, experience.
- Components are combined, when independent, as the square root of the sum of their squares, giving the **combined standard uncertainty**.
- The **expanded uncertainty** is the combined standard uncertainty multiplied by a coverage factor, commonly 2, giving an interval expected to contain most of the values that could reasonably be attributed to the measurand.

The guide also distinguishes error from uncertainty. An **error** is the difference between a result and the true value, which is never exactly known. An **uncertainty** is a statement of how well the result is known. Correcting a known systematic error, such as the +0.12 g offset, reduces the error; the uncertainty of that correction stays in the budget. Chapter 8 builds CW-5's budget.

### Accuracy, trueness and precision

Everyday language uses "accurate" for everything. Measurement standards are more careful. ISO 5725, named here by number, separates **trueness**, the closeness of the average of many results to the true value, from **precision**, the closeness of results to each other; **accuracy** covers both. In those terms, CW-5's +0.12 g offset is a trueness problem and its 0.092 g scatter a precision problem. A scale can be precise but not true, reading consistently 0.12 g high, or true but not precise, averaging correctly while scattering widely. Naming which one is wrong is half of fixing it.

### Resolution is not uncertainty

CW-5 displays weights to 0.01 g. That is its **resolution**, the smallest change the display can show. It says nothing about how well the scale measures: the readings scatter by about nine times the resolution. A display with more digits does not make a better scale, and a measurement reported to more decimal places than its uncertainty justifies is not more accurate, only more misleading. The resolution does contribute a small uncertainty of its own, about the resolution divided by √12, or 0.003 g for CW-5, because any reading could lie anywhere within half a display step either side of what is shown. Chapter 8 includes it in the budget, where it turns out to be negligible.

## Where systematic errors hide in a checkweigher

Systematic errors are invisible in the readings themselves, so it helps to know where to look. On a checkweigher such as CW-5, the usual suspects are:

- **calibration**: the span set against a reference weight that was itself wrong, or set at a temperature different from the line's;
- **tare and build-up**: product dust or a label stuck on the weigh conveyor, adding a constant few tenths of a gram until the next zero;
- **air movement**: a fan or air knife blowing on the weigh conveyor, pushing up or down by a steady amount;
- **belt and mechanics**: belt tension, a rubbing guide or a misaligned transfer that carries part of the pack's weight off the load cell;
- **dynamic effects**: a pack that is still accelerating or bouncing when the averaging window starts, reading differently in motion than at rest.

The first two are corrected by calibration and zeroing. The last three are found by comparing static and dynamic readings of the same packs, and by inspection; they are design and maintenance problems, not settings.

## Why each kind matters to CW-5

CW-5's job is to reject packs that are too light. Each kind of error affects that job differently:

- **Random error** blurs the decision for packs close to the threshold: a pack slightly over may read under and be rejected, and one slightly under may read over and be passed. Chapter 7 calculates how many.
- **Systematic error** shifts every decision the same way. A +0.12 g offset means every pack reads 0.12 g heavier than it is, so packs up to 0.12 g below the threshold are passed. For a trade measurement, that is the error that matters most.
- **Drift** makes the systematic error change through the shift, so that a scale correct at the morning check is offset by the afternoon. Chapter 8 sets the check interval to limit it.

Packaged goods sold in Australia must meet trade measurement requirements under the National Trade Measurement Regulations 2009, administered by the National Measurement Institute. This book does not quote those requirements; it explains the measurement behaviour that any compliant system must control.

## Recognising each in data

The three kinds leave different fingerprints in a time series of readings of a constant reference:

- **random error** looks like a fuzzy band of constant width around a steady line;
- **systematic error** is invisible in the series alone, because the line is steady, and appears only when compared with a reference;
- **drift** looks like the centre of the fuzzy band slowly wandering or trending.

A simple plot of check-weight readings against time, kept through a shift, shows all three at a glance. The eye is good at spotting a trend and bad at judging whether a wobble is larger than chance, so the plot is drawn with lines at the average plus and minus three standard deviations of a single reading; points outside them, or long runs on one side of the average, deserve attention, and points inside them do not. That is the idea behind the control charts of Chapter 8. CW-5's controller logs the empty-conveyor zero and every check-weight reading with a time stamp, and that log is the raw material for Chapters 4, 5 and 8.

## Tampering: adjusting for noise

A process or a measurement that shows random scatter tempts people to correct it reading by reading. If a check reading comes out 0.1 g high, the operator adjusts the zero down by 0.1 g; if the next comes out 0.05 g low, up by 0.05 g. The intention is to remove error. The effect is to add it.

The reason is that a random error in one reading says nothing about the next. Adjusting by the last reading's error transfers that error, reversed, into every reading after it, while the next random error arrives on top. The adjustment and the new error are independent, so their variances add. W. Edwards Deming demonstrated the effect with a funnel dropping marbles onto a target: moving the funnel to compensate for each miss made the pattern of hits wider, not narrower.

```figure
type: bars
title: Spread of CW-5's check readings with and without adjusting after every reading
unit: g
max: 0.15
caption: This is an illustration from simulating 200,000 readings with a random error of 0.092 g. Adjusting the zero by the last reading's error, every time, raises the spread by a factor of √2, to about 0.130 g.
- Leave it alone | 0.092
- *Adjust by the last error every time | 0.130
```

The right response to random error is to leave the setting alone and reduce the noise at its source, or to average more. The right response to systematic error is a deliberate correction, based on an average good enough to show the error is real. The right response to drift is to check at intervals set by how fast it develops, and correct when a check shows a significant change. Chapter 8 turns those rules into a procedure.

## A failure case: the conscientious operator

This is an illustration. On an earlier packing line, a conscientious operator was asked to "keep the checkweigher accurate". Every fifteen minutes she placed the check weight on the scale, took one reading and adjusted the zero by whatever the reading differed from 500.00 g.

Over the following weeks, the rate of rejected packs rose and fell erratically, and an audit of the line's records showed that the scale's offset at any moment varied more than it had before she started. The detection came from the audit, which plotted the check readings and the adjustments against time and noticed that each adjustment was followed by a reading displaced the opposite way. The simulation behind the figure above reproduced the effect: single-reading adjustments had widened the scale's offset spread by about 40%.

The correction was a written procedure: take ten readings of the check weight, compare their average with 500.00 g, and adjust only if the difference exceeds a limit set at about three times the standard deviation of the average; otherwise record and leave alone. The operator's diligence was redirected into the record, and the erratic rejections stopped.

## How this applies to a small Australian business

Separate errors into random, systematic and drift before trying to fix them. Measure random error by repeating readings of a constant reference, systematic error by comparing an average with a reference, and drift by repeating the comparison over time. Use the vocabulary of the uncertainty guide so that results can be compared and audited. Never adjust a process or an instrument in response to a single noisy reading; adjust only when an average shows a change larger than its own uncertainty.

## Exercise: is the offset real?

At the afternoon check, the technician takes ten readings of the 500.00 g weight, with the same 0.092 g standard deviation per reading, and finds an average of 500.05 g. What is the standard deviation of that average? Is the 0.05 g offset clearly real? If the adjustment rule is "adjust if the offset exceeds three standard deviations of the average", should the zero be adjusted?

**Worked answer.** The standard deviation of the average is **0.092 ÷ √10 ≈ 0.029 g**. The offset of 0.05 g is about **0.05 ÷ 0.029 ≈ 1.7** standard deviations, which could easily arise by chance. Three standard deviations of the average is about **0.087 g**, and 0.05 g is below it, so the zero is **not** adjusted; the reading is recorded, and if the next check shows an offset in the same direction, the pattern, not the single result, will justify action.
