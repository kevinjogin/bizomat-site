---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: calibrating-with-weights-and-substitution
order: 8
title: "Calibrating with weights and substitution"
description: "How to calibrate a weighing vessel with test weights, substitution and a corner test, judge the result with a straight-line fit, and why datasheet values alone are not enough."
draft: false
---

A weighing system is calibrated when its reading has been compared with known masses and adjusted so that the two agree. Everything in the earlier chapters affects that comparison: the cells' sensitivities, the junction box, the cable, the mounting and every pipe and sleeve attached to the hopper. That is the strength of calibrating with real masses on the real installation: it tests the whole chain at once, including faults nobody has thought of. It is also why a calibration that skips the real masses can be confidently wrong.

This chapter compares the ways a process vessel can be calibrated, describes test weights and the corner test, and sets out the substitution method that lets 500 kg of weights calibrate a 2,500 kg batch hopper. It then puts BH-2's first calibration through a straight-line check, shows why calibrating from the cells' datasheet values would have overfilled every batch by about 7.5 kg, and ends with the check after the correction.

## Ways to calibrate a vessel

Small scales are calibrated by placing test weights up to their full capacity. Process vessels are harder: placing 2,500 kg of cast iron in a hopper is awkward, and placing 50 t in a silo is impossible. Several methods exist, and the right one depends on the capacity, the accuracy needed and what the vessel can physically take.

```figure
type: compare
title: Methods of calibrating a process weighing vessel
cols: How it works | Strengths | Weaknesses
rowhead: Method
- Test weights to full capacity | Certified masses hung or placed in or on the vessel | Direct and traceable | Impractical above a few tonnes
- * Test weights with substitution | Weights, then material to replace them, then weights again, repeated | Traceable to full capacity with a fraction of the weights | Errors add up step by step; needs material and time
- Reference force | Hydraulic jacks pull the vessel down through reference load cells | Suits large silos | Reference cells must be calibrated; jacking points needed
- Material transfer | Material weighed on a trusted scale is loaded into the vessel | Uses normal plant | Only as good as the other scale and the transfer
- Electronic (mV/V) | Indicator set from the cells' certified outputs and capacity | Quick, no weights | Assumes a perfect installation; does not test the system
caption: General comparison. Where a scale is used for trade, the method, the test weights and the person doing the work are governed by trade measurement requirements; check them before starting.
```

## Test weights

Test weights are masses made and certified for the purpose, usually cast iron or stainless steel, with a calibration certificate from a laboratory that states each one's mass and its uncertainty. The certificate makes the calibration traceable: it links the scale's reading, through the laboratory's own standards, to the national standard of mass. Weights are made in accuracy classes, defined internationally in OIML R 111, with tighter tolerances for finer classes. For a process scale reading in 1 kg divisions, coarse-class 25 kg weights, whose permitted errors are a few grams, are more than good enough.

The weights need looking after: kept clean and dry, handled without dropping, and recalibrated at the interval the certificate or the mill's quality system sets. A weight caked with dried meal is heavier than its certificate says; one that has lost a chip is lighter.

BH-2 has twenty 25 kg weights, 500 kg in all, hung from four brackets welded to the hopper's top ring during its construction, one over each cell and one at the centre.

In Australia the certificate normally comes from a laboratory accredited by NATA, the National Association of Testing Authorities, for mass calibration, and the accreditation is what gives the certificate its standing with auditors and customers. Hanging the weights from brackets, rather than stacking them inside the hopper, has two advantages: the load goes in at a known point, which the corner test needs, and the weights stay clean and dry. The brackets must be part of the weighed hopper, carry the weights without bending visibly, and be placed so that no hanger can touch the stand or the floor. When the weights are not in use they are stored on a rack beside the hopper, not on it.

## The corner test

Before calibrating the span, the system is checked for equal response at each support. A known load, here 500 kg, is placed as close as practical over each cell in turn, and the readings compared. Unequal readings mean unequal cell sensitivities, which the junction box's trimming resistors correct (Chapter 4), or a mechanical fault at one support, which no trimming should be used to hide.

```figure
type: compare
title: BH-2's corner test with 500 kg at commissioning
cols: Before trimming | After trimming
rowhead: Weights over
- Cell 1 | 500.3 kg | 500.0 kg
- Cell 2 | 498.8 kg | 500.1 kg
- Cell 3 | 500.8 kg | 499.9 kg
- Centre | 500.0 kg | 500.0 kg
caption: This is an illustration. Readings in the indicator's 0.1 kg service mode. Before trimming the readings follow the cells' certified outputs of 2.002, 1.996 and 2.004 mV/V; after trimming they agree within 0.2 kg, within the repeatability of the test.
```

Because the hopper is only 1.8 m across, the weights over each cell are not entirely on that cell: some of their load reaches the other two. A corner test on a vessel shows unequal sensitivities less clearly than one on a platform scale, so a small spread should be taken seriously.

## Building up with substitution

With only 500 kg of weights, BH-2 is calibrated to 2,500 kg by substitution. The idea is that the scale does not need to be accurate to compare two loads that give the same reading: if 500 kg of weights read 498.6 kg, then the meal that also reads 498.6 kg has a mass of 500 kg, whatever the scale's error.

```figure
type: steps
title: Substitution to 2,500 kg with 500 kg of test weights
caption: This is an illustration. At each step the reference mass is known exactly from the weights and the substituted meal; the readings are taken in the 0.1 kg service mode after the hopper has settled. The meal must not be disturbed between steps.
- Empty hopper, zero | reference 0 kg
- Hang the 500 kg of weights; read | reference 500 kg
- Remove the weights; add meal until the reading matches the previous step | meal = 500 kg
- Hang the weights again; read | reference 1,000 kg
- Remove the weights; add meal to match; hang the weights; read | reference 1,500 kg
- Repeat twice more | references 2,000 kg and 2,500 kg
- * Remove weights and discharge, and check the return to zero | zero within 0.2 kg
```

Each substitution step adds a little uncertainty, because matching the meal to a reading is limited by the scale's repeatability and resolution. With five steps those small errors accumulate, roughly in proportion to the square root of the number of steps, which is why substitution uses the largest practical weight step and the finest available resolution.

How much does the accumulation matter for BH-2? Suppose matching the meal to a reading leaves an error with a standard deviation of about 0.15 kg, which is what the indicator's 0.1 kg service resolution and the hopper's repeatability allow. The 2,500 kg reference is built from four substitutions, so its uncertainty from matching is about √4 × 0.15 = 0.3 kg, one standard deviation. The certified weights add almost nothing: even if each 500 kg set were uncertain by 20 parts per million, five applications contribute 0.05 kg. So BH-2's full-scale reference is known to about ±0.6 kg at 95% confidence, adequate for a scale reading in 1 kg divisions but a reminder that substitution is not as good as weights to full capacity.

Two practical rules keep the method honest. The meal added at each step must stay put, so the hopper's vibrator and discharge gate are locked out for the whole test and nobody walks on the hopper's top. And the zero is checked at the end, after discharge: a zero that has moved means something shifted during the test, and the test is repeated.

## The case: BH-2's first calibration

When BH-2 was commissioned, the contractor first set the indicator electronically: they entered the cells' average rated output, 2.0007 mV/V, and the total capacity, 6,000 kg, so that the indicator worked out its span without any weights. The substitution test was done the next day to confirm it. The readings, with the references, were as follows.

The [linear calibration check tool](/tools/linear-calibration-check/) fits a least-squares straight line through up to eight reference values and the instrument's readings, gives the intercept and slope with their standard errors and the residual standard deviation, tests whether the intercept is zero and the slope one, and works out the calibrated value of a new reading with its confidence interval, compared with an accepted half-width.

```figure
type: compare
title: BH-2's first substitution test against the electronic calibration
cols: Reading | Residual from the fitted line
rowhead: Reference
- 0 kg | 0.0 kg | −0.04 kg
- 500 kg | 498.6 kg | +0.07 kg
- 1,000 kg | 997.1 kg | +0.08 kg
- 1,500 kg | 1,495.2 kg | −0.31 kg
- 2,000 kg | 1,994.3 kg | +0.30 kg
- * 2,500 kg | 2,492.4 kg | −0.10 kg
caption: This is an illustration. Fitted by the linear calibration check tool: reading = 0.038 + 0.996983 × reference, residual standard deviation 0.23 kg with 4 degrees of freedom. The intercept is consistent with zero (t = 0.23) but the slope is not consistent with one (t = 27.7 against 2.776): the scale reads 0.30% low.
```

The tool's result separates two questions. Is the scale precise? Yes: the residuals scatter by about 0.2 kg about a straight line, and a reading of 1,994.3 kg corresponds to a calibrated value of 2,000.3 kg with a 95% interval of ±0.72 kg, inside the ±1 kg the mill accepts. Is it accurate? No: the slope is 0.996983, so the scale under-reads by 0.30%, 7.5 kg on a full batch. Precision without accuracy is the signature of a gain error, and the tool flags it.

## When it goes wrong: the datasheet calibration

The electronic calibration assumed a perfect installation: that the cells' certified outputs applied as they sat in their mounts, that the junction box's trimming resistors took nothing from the signal, that the cable delivered the full excitation and that nothing attached to the hopper carried any load. Each of those was very nearly true, and together they were not. The trimming resistors in the junction box, set during the corner test, reduce the excitation to the more sensitive cells slightly; the flexible sleeves, though soft, are not perfectly so; and the cells' certified outputs carry their own tolerance.

Had the contractor stopped at the electronic calibration, every batch would have contained about 7.5 kg more than formulated, because the batching program would have kept filling until the indicator showed the target. Over a year of 57,600 batches that is more than 430 t of ingredients given away, at least partly the most expensive ones.

The correction is a span factor of 1 ÷ 0.996983 = 1.00303, entered in the indicator's calibration. Many indicators allow the span to be set directly from a known load instead, which does the same thing. After the adjustment the substitution test was repeated.

```figure
type: compare
title: The substitution test repeated after the span correction
cols: Reading | Residual from the fitted line
rowhead: Reference
- 0 kg | 0.0 kg | −0.03 kg
- 500 kg | 500.2 kg | +0.17 kg
- 1,000 kg | 999.9 kg | −0.13 kg
- 1,500 kg | 1,500.1 kg | +0.07 kg
- 2,000 kg | 1,999.8 kg | −0.23 kg
- * 2,500 kg | 2,500.2 kg | +0.17 kg
caption: This is an illustration. Fitted by the linear calibration check tool: reading = 0.033 + 1.000000 × reference, residual standard deviation 0.18 kg. Intercept and slope are consistent with 0 and 1, and a reading of 2,000 kg has a 95% calibration interval of ±0.58 kg, within the accepted ±1 kg.
```

Electronic calibration is useful: it gets a new system close enough to run safely, and it is the only option where weights cannot be applied at all. But it is a starting point, and every process vessel whose weighing affects product, cost or safety should be checked with real masses before it is trusted.

## Reading the residuals

A straight-line fit can hide a curved response, so the residuals are worth plotting against the reference. Residuals that rise and fall at random, as both of BH-2's tests show, mean the straight line fits. Residuals that curve, positive at the ends and negative in the middle or the reverse, mean a non-linear response, which in a vessel usually comes from something mechanical: a connection that tightens as the hopper moves down, a check bolt that touches near full load, or a mount that binds. A fan shape, residuals growing with load, suggests a load-dependent friction.

The same test should be run on unloading as well as loading. Readings that are consistently higher on the way down than on the way up show hysteresis, which in a well-made cell is tiny and in a vessel almost always means friction in a mount, a seal or a connection. BH-2's unloading readings agreed with its loading readings within 0.2 kg, which is no more than the scatter of repeated readings at a single load, so no hysteresis could be detected.

## Records and intervals

A calibration that is not recorded did not happen, as far as anyone checking the mill's product later is concerned. The mill's record for each calibration of BH-2 lists the date, the person, the test weights used with their certificate numbers and due dates, the corner test readings before and after trimming, the substitution readings on loading and unloading, the straight-line fit and its interval, any adjustment made with the values before and after, the indicator's settings, and the as-left readings. The raw readings are kept, not just the conclusion, so that a later doubt can be checked against them.

How often to calibrate is a judgement based on how much drift the process can tolerate and how quickly the scale has drifted in the past. The mill calibrates BH-2 fully once a year and after any change to a cell, the junction box, the indicator or the hopper's connections. Between calibrations, the daily check with test weights described in Chapter 10 watches for drift, and the record of those checks is what justifies keeping the annual interval or shortening it. A scale that has never needed adjustment in five years has earned a longer interval; one that needed a correction at each of its last two calibrations needs a shorter one until the cause is found.

Finally, an adjustment should never be made to make a single reading come out right. If the daily check reads 2 kg high, the right response is to find out why, by repeating the check, checking the zero and looking for something touching the hopper, and to adjust the span only after a proper calibration shows the gain has changed. Adjusting to one reading chases noise and hides faults.

## Exercise: a quick check after a cell change

After a cell was replaced, BH-2 was checked with substitution to 1,500 kg only. The readings for references of 0, 500, 1,000 and 1,500 kg were 0.2, 501.4, 1,002.5 and 1,503.9 kg.

1. What straight line fits the readings, and does the scale need correcting?
2. A later batch reads 1,203.0 kg. What is its calibrated value?
3. What should the technician do next?

**Answer.**

1. The [linear calibration check tool](/tools/linear-calibration-check/) gives reading = 0.17 + 1.00244 × reference, with a residual standard deviation of 0.09 kg. The slope test (t = 28.8 against 4.303 with 2 degrees of freedom) shows a significant gain error: the scale reads 0.24% high.
2. The calibrated value is (1,203.0 − 0.17) ÷ 1.00244 = 1,199.9 kg, with a 95% interval of ±0.48 kg.
3. Apply a span correction of 1 ÷ 1.00244 = 0.99757, then repeat the test to the full 2,500 kg, because a check to 1,500 kg says nothing certain about the top of the range, and redo the corner test, because the new cell's sensitivity differs from the old one's and the junction box needs re-trimming.
