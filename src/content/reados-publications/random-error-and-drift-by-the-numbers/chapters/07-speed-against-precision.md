---
book: random-error-and-drift-by-the-numbers
chapterSlug: speed-against-precision
order: 7
title: "Speed against precision on the line"
description: "Find how CW-5's measurement noise grows with line speed, how many packs it wrongly accepts and rejects at each speed, and what guard bands and an uncorrected offset do to those numbers."
draft: false
---

A checkweigher makes a decision for every pack: pass or reject. Measurement noise blurs that decision only for packs whose true weight is close to the threshold, but on a line making thousands of packs an hour, "close to the threshold" still adds up to real packs. Running the line faster shortens the time each pack spends on the scale, increases the noise and blurs more decisions. The trade between speed and precision is therefore a calculation, not a feeling, and it is one the production manager and the quality manager should both see.

This chapter calculates CW-5's measurement noise at four line speeds, combines it with the fill distribution to find the rates of false acceptance and false rejection, shows how a guard band trades one against the other, and compares all of that with the effect of an uncorrected offset. The failure case is a line speeded up with the threshold unchanged and an offset nobody had corrected.

## Noise at each line speed

CW-5's weigh conveyor holds each pack for about 60% of the pack pitch, the time between packs. The first 100 ms of that is lost to the arrival transient; the rest is the averaging window. As the line speeds up, the pitch, the dwell and the window all shrink, and the weighing noise, calculated with Chapter 3's model of broadband and correlated noise, grows. The tracked zero adds its own 0.029 g from Chapter 4, independent of the weighing.

```figure
type: compare
title: CW-5's measurement noise at four line speeds
cols: Pack pitch | Averaging window | Weighing noise | Net noise with zero
caption: This is an illustration using this book's noise model. The net noise per pack is the weighing noise combined with the 0.029 g of the tracked zero. At 180 packs a minute the window is only 100 ms and the noise is about a third higher than at 120.
- 100 packs a minute | 0.60 s | 260 ms | 0.082 g | 0.087 g
- *120 packs a minute | 0.50 s | 200 ms | 0.092 g | 0.096 g
- 150 packs a minute | 0.40 s | 140 ms | 0.108 g | 0.111 g
- 180 packs a minute | 0.33 s | 100 ms | 0.124 g | 0.127 g
```

The noise grows more slowly than the window shrinks, because the correlated part of the noise, which dominates, averages poorly at any of these window lengths. Even so, going from 120 to 180 packs a minute raises the net noise by about a third.

### The hard limit

The arithmetic also shows where the weigh conveyor simply runs out of time. With the dwell at 60% of the pitch and 100 ms lost to the transient, the averaging window shrinks to nothing when 0.6 × pitch equals 0.1 s, a pitch of about **0.167 s**, or **360 packs a minute**. Long before that, the window becomes so short that the noise is unacceptable; in practice, the useful upper speed of a given weigh conveyor is set by the smallest window that still meets the guard band the business is prepared to accept. A faster line needs a longer weigh conveyor, a shorter transient, from stiffer mounting or gentler transfer, or a different weighing technology, and the calculation shows which.

## Who gets misjudged

CW-5's packs are filled to a target that gives an average of **503 g** with a standard deviation of **2 g** from pack to pack. The reject threshold in this example is set at **497 g**: a teaching value, not a legal requirement; real thresholds for packaged goods are set to meet trade measurement rules, which this book does not quote. With a normal distribution of fill, the fraction of packs truly below 497 g is the probability of falling more than three standard deviations below the mean, about **0.135%**, or 1,350 packs in every million.

A perfect scale would reject exactly those. A real scale, with net noise σ, misjudges packs near 497 g in both directions:

- a **false acceptance** is a pack truly under 497 g that reads 497 g or more and is passed;
- a **false rejection** is a pack truly at or above 497 g that reads under 497 g and is rejected.

Both errors have costs, of different kinds. A false acceptance sends a light pack to a customer, which matters for compliance and reputation; a false rejection wastes a good pack, or the labour of checking and repacking it. For underweight checking, false acceptances usually weigh more heavily, which is why the guard bands below lean towards rejecting.

The rates are found by combining the fill distribution with the measurement noise: for each possible true weight, the probability that its reading falls on the wrong side of the threshold, weighted by how many packs have that weight.

```figure
type: stats
title: CW-5's misjudged packs at 120 packs a minute, threshold 497 g
caption: This is an illustration with a fill mean of 503 g, a fill standard deviation of 2 g and a net measurement noise of 0.096 g, calculated by numerical integration. About 6% of the truly light packs are passed, and a similar number of good packs rejected.
- 1,350 per million | Packs truly below 497 g | 0.135% of output
- *79 per million | False acceptances | about 0.6 an hour at 7,200 packs an hour
- 93 per million | False rejections | about 0.7 an hour
```

Both rates rise with line speed, roughly in proportion to the measurement noise, because the band of true weights that can be misjudged widens with the noise:

```figure
type: bars
title: False acceptances per million packs, by line speed
unit: per million
max: 110
caption: This is an illustration. The rate of passing light packs grows from about 71 to about 101 per million as the line speeds up from 100 to 180 packs a minute, and the number per hour grows faster still, because more packs are made.
- 100 packs a minute | 71
- *120 packs a minute | 79
- 150 packs a minute | 90
- 180 packs a minute | 101
```

Per hour, the effect compounds: at 180 packs a minute the line makes 10,800 packs an hour, and passes about **1.1** light packs an hour, against about **0.6** at 120 packs a minute.

### Only packs near the threshold are at risk

Measurement noise of about 0.1 g cannot turn a 503 g pack into a reject. Practically, only packs whose true weight lies within about three standard deviations of the noise, about ±0.29 g, of the 497 g threshold can be misjudged at all. With a fill standard deviation of 2 g, the density of packs at 497 g is the normal curve's height three standard deviations below its mean, divided by 2 g, about 0.0022 per gram, so the band from 496.71 to 497.29 g holds roughly **1,300 packs in every million**. The false acceptances and false rejections are drawn from that band and nowhere else. That is why the rates scale almost in proportion to the noise: doubling the noise doubles the width of the band at risk, and the number of packs in it.

The figures above were calculated by integration. They were checked by a simple simulation of 20 million packs, each given a random true weight from the fill distribution and a random measurement error, and counted as falsely accepted or rejected; it gave about 77 false acceptances and 96 false rejections per million at 120 packs a minute, agreeing with the integration within the simulation's own counting uncertainty. Two independent methods agreeing is worth more than either alone.

## Guard bands

If false acceptances are the bigger concern, as they usually are for underweight packs, the threshold can be raised above the limit by a **guard band**, a multiple of the measurement noise. A higher threshold rejects more borderline packs, so fewer light packs slip through, at the cost of rejecting more good ones.

```figure
type: compare
title: Guard bands at 120 packs a minute, net noise 0.096 g
cols: Threshold | False acceptances per million | False rejections per million | False rejections an hour
caption: This is an illustration. Each extra multiple of the noise in the guard band cuts false acceptances sharply and raises false rejections steadily. A guard band of two to three times the noise makes false acceptance rare.
- No guard band | 497.00 g | 79 | 93 | 0.7
- One σ | 497.10 g | 17 | 263 | 1.9
- *Two σ | 497.19 g | 1.8 | 515 | 3.7
- Three σ | 497.29 g | 0.1 | 820 | 5.9
```

Because the guard band is a multiple of the measurement noise, a quieter scale needs a smaller guard band for the same protection, and rejects fewer good packs. That is the business case for the mounts in Chapter 3: they buy a narrower guard band, and every good pack not rejected is product not reworked.

## The offset matters more than the noise

All of the above assumes the scale has no systematic error. Chapter 1 found CW-5 reading **0.12 g high** before correction. An offset shifts every decision: a scale reading 0.12 g high behaves exactly like a perfect scale with its threshold lowered to **496.88 g**. Recalculating at 120 packs a minute, the false acceptance rate rises from about 79 to about **243 per million**, three times as many, and about **18%** of the truly light packs are passed, against about 6% with no offset. An offset of a little more than one standard deviation of noise has a larger effect than speeding the line from 120 to 180 packs a minute.

The lesson of Chapter 4's totals appears again: random errors blur, systematic errors bias. For a pass-or-reject decision, bias is usually the greater danger, and it is the one a static check weight finds and a calibration corrects.

### Who decides the trade

The choice of speed, threshold and guard band is not a technical decision alone. Running faster makes more product an hour and passes more light packs; a wider guard band protects the customer and rejects more good product; a quieter scale costs money once and saves product every hour. Each option has a cost and a benefit that a production manager, a quality manager and, for trade-regulated goods, a compliance adviser weigh differently. The engineer's job is to put the numbers in front of them in a form they can compare: packs an hour, false acceptances an hour, false rejections an hour, at each option. The decision then rests with the people accountable for it, and the record shows why it was made.

## The filler matters as much as the scale

The rate at which packs are misjudged depends on how many packs are near the threshold, and that is set by the filler, not the checkweigher. A filler with a fill standard deviation of 1.5 g instead of 2 g, aimed at the same 503 g, puts the threshold four standard deviations below the mean instead of three, and the number of packs anywhere near 497 g falls by more than an order of magnitude. Alternatively, the more consistent filler allows the target to come down while keeping the same proportion of light packs, which saves product on every pack. Measurement and filling are two halves of one system: the checkweigher's job is easiest, and its errors matter least, when the filler rarely puts packs near the threshold.

## Proving the reject system

A checkweigher's decision is only as good as the mechanism that acts on it. CW-5 rejects packs with an air blast into a locked bin, and a measurement that correctly flags a light pack achieves nothing if the blast fires late at the higher line speed and misses it. CW-5's start-up routine runs three test packs of known weight through the line at production speed: one just over the threshold, one just under and one well under. The two light packs must end up in the reject bin and the good one on the outfeed. The routine is repeated after any change in speed, product or settings, and its results are logged with the check-weight readings. The reject system is verified at the speed it runs, because a mechanism that works at 120 packs a minute is not proven at 180.

## A failure case: faster, with an offset

This is an illustration. To meet a seasonal order, a line like CW-5's was speeded up from 120 to 180 packs a minute. The checkweigher's window shortened automatically with the conveyor speed, but nobody looked at the threshold, and the morning check that would have caught the scale's 0.12 g offset had been skipped on the busy days.

A customer's incoming inspection found several light packs in one delivery, more than the supplier's records suggested should exist. The detection came from the customer; the investigation, working from the controller's logs, found two causes acting together. The faster line had raised the measurement noise by about a third, and the uncorrected offset had lowered the effective threshold. Each alone would have roughly doubled the false acceptances; together they had multiplied them several times over.

The correction was to reinstate the morning check as a condition for starting the line, to correct the offset, and to raise the threshold by a guard band of two times the measured net noise at whatever speed the line ran, with the controller recalculating the guard band from the speed setting. The shop now treats any change in line speed as a change to the measurement, reviewed before it is made.

## How this applies to a small Australian business

Calculate how the measurement noise of an in-line instrument grows with line speed, using the actual averaging window at each speed. Combine it with the product's own distribution to find the rates of false acceptance and false rejection, by simulation or numerical integration. Use a guard band, sized as a multiple of the measurement noise, to control false acceptance, and reduce the noise to narrow the guard band. Correct offsets before anything else, because a small bias can outweigh a large increase in noise. Treat changes in speed as changes to the measurement.

## Exercise: a quieter scale

After the isolation mounts, CW-5's net noise at 120 packs a minute falls to about **0.062 g**, combining the 0.055 g weighing noise of Chapter 3 with the 0.029 g zero. What threshold gives a guard band of two times the net noise? Roughly how should false acceptances and false rejections compare with the 0.096 g scale at its two-σ guard band?

**Worked answer.** The net noise is **√(0.055² + 0.029²) ≈ 0.062 g**, so two times the noise is about **0.12 g**, and the threshold becomes about **497.12 g**, lower than the 497.19 g needed before. Numerical integration gives about **1.2** false acceptances and about **310** false rejections per million, against about 1.8 and 515 for the noisier scale at its two-σ guard band. The quieter scale protects the customer at least as well and rejects about 40% fewer good packs.
