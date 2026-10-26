---
book: random-error-and-drift-by-the-numbers
chapterSlug: allan-deviation
order: 5
title: "Allan deviation: one chart for every time scale"
description: "Calculate the Allan deviation of CW-5's zero from a logged signal, read white noise, random walk and drift from its slopes, and use its minimum to choose averaging and zero-tracking times."
draft: false
---

A single standard deviation describes noise at one time scale. Measure a signal's scatter over one second and it may look quiet; over an hour it may look terrible; and the two numbers say nothing about what happens in between. The **Allan deviation**, introduced by David Allan in 1966 to characterise atomic clocks, describes a signal's stability at every averaging time on one chart, and its shape identifies the kinds of noise present. It has become the standard tool for gyroscopes, accelerometers, oscillators and, increasingly, any sensor whose readings wander. It needs nothing more than a long log of readings and a spreadsheet, which makes it one of the cheapest diagnostic tools in measurement.

This chapter defines the Allan deviation, calculates it for four hours of CW-5's simulated zero signal, reads the white-noise and random-walk regions from its slopes, shows that its minimum gives the best averaging time, and connects it with the zero-tracking window of Chapter 4. The failure case is a zero-tracking window lengthened to "smooth" the zero, which tripled its error.

## Definition

Take a long, evenly sampled record of a signal that should be constant, such as CW-5's empty-platform reading. Choose an averaging time τ. Divide the record into consecutive blocks of length τ and average each block. Take the difference between each block's average and the next one's. The **Allan variance** at τ is half the mean of the squares of those differences; the **Allan deviation**, σ_A(τ), is its square root.

```figure
type: formula
title: Allan deviation from a logged signal
formula: σ_A(τ)² = ½ × mean of (ȳ_(k+1) − ȳ_k)², where ȳ_k is the average of the k-th block of length τ
caption: This is an illustration of the calculation. Using differences of consecutive averages, rather than deviations from one overall mean, makes the result well defined even for a random walk, whose ordinary standard deviation keeps growing with the length of the record.
- Choose τ | for example 0.1 s, 0.3 s, 1 s, 3 s, 10 s and so on
- Average the record in consecutive blocks of τ | ȳ₁, ȳ₂, ȳ₃ …
- Square the differences of neighbours | (ȳ₂ − ȳ₁)², (ȳ₃ − ȳ₂)² …
- Halve their mean and take the square root | σ_A(τ)
- Repeat for each τ | plot σ_A against τ on log–log axes
```

For white noise, the Allan deviation equals the ordinary standard deviation of a τ-average, so it falls as τ^−½. For a random walk, it rises as τ^+½. For a steady linear drift, it rises as τ^+1. Flicker noise, which has equal power in every octave of frequency, gives a flat region. A log–log plot of σ_A against τ is therefore a set of straight segments whose slopes name the noise types.

```figure
type: compare
title: Slopes on a log–log Allan deviation chart
cols: Slope | What it means | Typical source in a weighing system
caption: Slopes as described in the literature on Allan variance. A real chart usually shows two or three of these in sequence, from left to right.
- White noise | −½ | averages down by the square-root rule | electronics and broadband vibration
- Flicker noise | 0 | averaging stops helping | some electronic components; slow mechanical effects
- Random walk | +½ | longer averages wander further | zero wander in the cell and amplifier
- Linear drift | +1 | a steady trend | build-up on the conveyor; warm-up
```

## CW-5's Allan deviation

During a planned stop, CW-5 logged its empty-platform reading at 1,000 samples a second for four hours. The record here is simulated from the book's noise model: 0.5 g of broadband noise, 0.2 g of correlated noise with a 20 ms correlation time, and a random walk of 0.05 g per √minute. The Allan deviation calculated from it, and from the model's formula, is:

```figure
type: bars
title: Allan deviation of CW-5's empty-platform signal
unit: g
max: 0.15
caption: This is an illustration from a four-hour simulated record. The curve falls with slope −½ while white and correlated noise dominate, reaches a minimum of about 0.018 g near 10 s, and rises with slope +½ as the random walk takes over. At 0.1 s it lies below the white-noise line, because the 20 ms correlated noise has not yet averaged like white noise.
- 0.1 s | 0.118
- 0.3 s | 0.076
- 1 s | 0.042
- 3 s | 0.025
- *10 s | 0.018
- 30 s | 0.021
- 100 s | 0.038
- 300 s | 0.072
- 1,000 s | 0.139
```

The model behind the bars has a simple form. Above about a second, the broadband and correlated noise together behave like a white noise of about **0.043 g at 1 s**, falling as 0.043 ÷ √τ, and the random walk adds a rising term K √(τ ÷ 3), with K ≈ 0.0065 g per √s. The two are equal, and the curve is at its minimum, at **τ ≈ 11.5 s**, where the Allan deviation is about **0.018 g**. The simulated values match the model within the scatter expected from a four-hour record, which is small at short τ and large at long τ, because a four-hour record holds only fourteen independent 1,000 s blocks.

## What the chart tells the designer

The Allan deviation answers practical questions directly:

- **How much does averaging help?** On the falling part of the curve, every fourfold increase in averaging time halves the noise. Beyond the minimum, averaging longer makes things worse.
- **What is the best possible averaging time?** The minimum, here about 10 s, is the longest average worth taking of this signal without correcting for wander.
- **How fast does the zero wander?** The rising part gives the random-walk coefficient, and the time at which wander exceeds a tolerance.
- **What kinds of noise are present?** The slopes name them, and their positions show the time scales at which each matters.

A single number, such as "0.04 g noise", would have hidden all of that.

The chart also has limits worth stating. The Allan deviation of the empty platform is not the error of a pack weighing: a pack is weighed over 200 ms, not 10 s, and its weighing includes transients and pack-to-pack effects that an empty platform never shows. The chart describes the instrument's own stability; the dynamic tests of Chapter 3 and the budget of Chapter 8 describe the measurement as used. Nor does the chart reveal systematic error, because it is built entirely from differences: a scale with a constant 0.12 g offset has exactly the same Allan deviation as one with none.

### What CW-5's chart changed

Before the chart, CW-5's settings were inherited from the maker's defaults: a zero updated from each single gap, and no record of why. After it, the zero-tracking window was set from the gap-zero chart's minimum, the averaging window from the vibration frequency and the transient, and the span check interval from the hump in the span record. Each setting had a reason that could be checked, and the commissioning file held the charts that justified them, so the next technician to wonder why the zero tracked over 30 s could see the answer instead of guessing.

### Connecting with zero tracking

Chapter 4 found the best zero-tracking window to be about **30 s**, not the 11.5 s minimum here, and the difference is instructive. Zero tracking does not average the continuous signal; it averages short zeros taken in the gaps between packs, each about 50 ms long and noisy, about 0.159 g each, with two gaps per second. As a white noise, that sequence is about **0.112 g at 1 s**, more than twice the continuous signal's 0.043 g, while the random walk is the same. Its Allan deviation curve is therefore higher on the left, and its minimum moves to longer τ: exactly the 30 s Chapter 4 found by balancing noise against lag. The Allan deviation of whatever sequence is actually averaged gives the right answer; the two methods agree.

## Collecting the data

An Allan deviation needs a long, uninterrupted record of a constant input, and its reliability at each τ depends on how many independent blocks of length τ the record contains. A rule of thumb is to record at least ten times the longest τ of interest. For CW-5, a four-hour record gave reliable values up to a few hundred seconds. The input must stay constant: for the zero, an empty platform with the conveyor running as in production; for the span, a weight left on a stationary platform. Changes in conditions during the record, a door opening, the air-conditioning cycling, appear in the chart as bumps, which is itself useful: they show the time scales at which the environment disturbs the measurement.

### How reliable is each point?

Each point on an Allan chart is itself an estimate from a finite number of differences, and its uncertainty grows as τ grows and the number of blocks shrinks. A rough guide is that the relative uncertainty of an Allan deviation from N non-overlapping blocks is about 1 ÷ √(N − 1). CW-5's four-hour record gives 1,440 blocks at 10 s, for an uncertainty of under 3%, but only 14 blocks at 1,000 s, for an uncertainty of nearly **±28%**. That is why the 1,000 s point in the figure differs from the model by more than the 10 s point does. A common refinement, the **overlapping** Allan deviation, uses every possible starting position for the blocks rather than only consecutive ones, extracting more information from the same record and tightening the long-τ points; most analysis software offers it.

### A spreadsheet recipe

The calculation needs no special software. CW-5's technician exported the logged zero as one column of numbers, one per 0.1 s. A second column held block averages for τ = 1 s, formed by averaging each ten rows; a third held the squared differences of consecutive block averages; a cell halved their mean and took the square root. Copying the sheet with ten, a hundred and a thousand rows per block gave the 10 s, 100 s and 1,000 s points. Plotted on log–log axes, the points showed the −½ and +½ slopes clearly. An afternoon's work turned a log nobody had looked at into the design basis for the zero tracking.

## The span tells a different story

The chart above is for the empty platform. A second record, taken with the 500 g check weight left on the stationary platform for several hours, shows the span as well. Its Allan deviation follows the zero's at short times, then rises earlier and higher, because the span drift, the slow, temperature-driven wander of about 0.15 g with a 30-minute time constant, adds a broad hump centred at averaging times of tens of minutes. A mean-reverting drift, unlike a random walk, does not keep rising: once τ is much longer than its time constant, its contribution falls again, because over very long averages it averages out. Seeing that hump, at the time scale of the factory's heating and cooling, told the designer that span checks every few hours would not be enough, and that the interval should be set by the drift's time constant. Chapter 8 does that calculation.

## Beyond weighing

The Allan deviation is used far beyond clocks and checkweighers. Gyroscope and accelerometer makers characterise their sensors' random walk and bias stability from it, and an IEEE standard for gyroscope test procedures, IEEE Std 952, named here by number only, describes its use. Temperature, pressure and strain measurements that are logged for long periods benefit from it in the same way. Any sensor that will be averaged, zeroed or trusted over time deserves an Allan chart before its settings are chosen, because it is the only common tool that shows noise and drift on the same page.

## A failure case: the smoother zero

This is an illustration. After the zero-tracking failure in Chapter 4 had been fixed with a 30 s window, a new technician noticed that the tracked zero still flickered by a few hundredths of a gram and lengthened the window to **10 minutes** to "smooth it out". The displayed zero became beautifully steady.

Over the following weeks, the dynamic check-weight test, run at the start of each shift, began to show offsets of up to a tenth of a gram that came and went. The detection came from the trend of those tests and, when the technician's change was found, from recalculating the zero error for the new window. A 10-minute running zero had a noise of only about **0.005 g**, but it lagged the wandering zero by about **K √(600 ÷ 3) ≈ 0.091 g**, giving a combined error of about **0.091 g**, more than three times the 0.029 g of the 30 s window. The Allan deviation of the gap zeros, plotted out to an hour, showed the 10-minute window sitting well up the random-walk slope.

The correction was to restore the 30 s window and to add the Allan chart to the scale's commissioning file, with the chosen window marked on it and a note explaining why. A steady display is not the same as an accurate zero.

## How this applies to a small Australian business

When a sensor's readings wander, record a long stretch of a constant input and calculate its Allan deviation over a wide range of averaging times. Read the slopes to identify white noise, random walk and drift, and the minimum to find the best averaging time. Use the Allan deviation of whatever sequence is actually averaged, such as zeros between packs, to choose tracking windows. Keep the chart with the instrument's records, with the chosen settings marked on it.

## Exercise: reading the minimum

A replacement amplifier halves CW-5's white-equivalent noise, to about **0.0215 g at 1 s**, without changing the random walk, K ≈ 0.0065 g per √s. Where is the new minimum of the continuous signal's Allan deviation, and what is its value?

**Worked answer.** The minimum is where the white term **0.0215 ÷ √τ** equals the random-walk term **0.0065 × √(τ ÷ 3)**. Squaring and rearranging gives **τ = 0.0215 × √3 ÷ 0.0065 ≈ 5.7 s**. At that τ each term is about **0.0215 ÷ √5.7 ≈ 0.0090 g**, and the Allan deviation, the root-sum-square of the two, is about **0.0127 g**. Halving the white noise moved the minimum to half the averaging time and lowered it by a factor of √2.
