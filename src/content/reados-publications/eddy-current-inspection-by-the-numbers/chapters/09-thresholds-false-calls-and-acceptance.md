---
book: eddy-current-inspection-by-the-numbers
chapterSlug: thresholds-false-calls-and-acceptance
order: 9
title: "Thresholds, false calls and acceptance decisions"
description: "Probability of detection and false calls, guard bands from measurement uncertainty, capability with confidence bounds, lot acceptance, and testing a suspect reading before discarding it."
draft: false
---

Every eddy-current result ends in a decision: accept or reject a shaft, release or hold a bar, pass or fail a batch of housings. Each decision can be wrong in two ways. It can reject a good part, a false call, which costs money and, repeated, destroys trust in the test. Or it can accept a bad one, a miss, which is the error the test exists to prevent. No threshold removes both. This chapter brings together the statistics that put numbers on the two errors for the pump maker's tests: the probability of detecting a crack of a given size, guard bands that allow for measurement uncertainty, capability indices with their confidence bounds, lot acceptance, and the test for a reading that looks wrong.

## Probability of detection

Chapter 6 set the journal scanner's threshold at 1.3 divisions, half the signal from the 0.5 mm reference notch, and found that a notch of that size is detected practically every time. Real cracks are less obliging than notches. They are tighter, more irregular and vary from one to the next, so cracks of the same depth give signals that scatter around the notch's value. A more honest picture adds that crack-to-crack scatter to the instrument's noise.

The pump maker's model takes the signal for a crack of depth a from the notch amplitudes, interpolating between the 0.2, 0.5 and 1.0 mm notches, and adds a crack-to-crack standard deviation of 0.4 divisions, an assumed figure for illustration, to the 0.25 division noise: a combined standard deviation of √(0.25² + 0.4²) = 0.472 divisions. The probability of detection is the chance that a crack's signal exceeds the threshold.

```figure
type: line
title: Modelled probability of detecting a grinding crack on the journals, threshold 1.3 divisions
x: Crack depth, mm
y: Probability of detection, %
caption: This is an illustration. Mean signal interpolated from the reference notches; combined standard deviation 0.472 divisions from noise and crack-to-crack scatter. The depth detected with 90% probability is about 0.37 mm.
series: Probability of detection
- 0.2 | 26.2
- 0.3 | 69.0
- 0.37 | 90.1
- 0.4 | 94.8
- 0.5 | 99.7
- 0.7 | 100.0
```

The curve's most useful single figure is the crack size detected with 90% probability. A signal of 1.3 + 1.2816 × 0.472 = 1.905 divisions is exceeded 90% of the time, and by interpolation it comes from a crack about 0.37 mm deep. The drawing's 0.5 mm requirement is detected 99.7% of the time.

The model is only as good as its assumptions. Formal probability-of-detection studies, used where failures are costly, such as in aircraft maintenance, test the whole system on many parts containing real cracks of measured size, run by the inspectors who will do the work, and report the size detected with 90% probability at 95% confidence. A model built from notches, as here, is a planning estimate; the pump maker's notch-based figure is its working assumption, recorded as such in the procedure.

## Guard bands for measured values

For a measured value, such as conductivity, the two errors arise near the limits. A bar whose true conductivity is 41.9 %IACS, just below the band, may read 42.1 because of measurement uncertainty and be accepted; one at 42.1 may read 41.9 and be rejected. Chapter 4's budget gave an expanded uncertainty of 0.30 %IACS at a coverage factor of 2.

Moving the acceptance limits inward by the expanded uncertainty, a guard band, makes acceptance safe: a reading inside the guarded zone means the true value is inside the specification with high confidence. Readings between the guarded and the specification limits are indeterminate.

```figure
type: compare
title: Decision zones for incoming 6061-T6 bar, specification 42.0 to 45.0 %IACS, expanded uncertainty 0.30 %IACS
cols: Reading at 20 °C | Decision
rowhead: Zone
- Below the specification | Under 42.0 | Reject; confirm by hardness before a supplier complaint
- Indeterminate, low | 42.0 to 42.3 | Four more readings; if the mean of seven is still here, hardness test decides
- * Guarded acceptance | 42.3 to 44.7 | Accept
- Indeterminate, high | 44.7 to 45.0 | Four more readings; if the mean of seven is still here, hardness test decides
- Above the specification | Over 45.0 | Reject; confirm by hardness
caption: This is an illustration. Guarded limits are the specification limits moved inward by the expanded uncertainty.
```

Guard bands cost something: parts in the indeterminate zones need more work. They are worth it when a false acceptance is expensive and the band is small compared with the tolerance, as here, where the two indeterminate zones together take 0.6 of the 3.0 %IACS band. Which rule applies to a given decision, guarded acceptance, guarded rejection or simple acceptance at the limits, must be agreed between customer and supplier and written into the specification, because the same reading can lead to different decisions under different rules.

## Capability: the batch, not the reading

Chapter 5 found that, with 95% confidence, 95% of a batch of housings had coatings between 16.09 and 22.71 µm, inside the 15 to 25 µm specification. A customer may ask a different question: is the anodising process capable, with a Cpk of at least 1.0?

The [capability confidence check tool](/tools/capability-confidence-check/) answers it with the same 30 readings, mean 19.4 µm and standard deviation 1.3 µm.

```figure
type: steps
title: Coating capability in the capability confidence check tool
caption: This is an illustration. 30 readings, mean 19.4 µm, standard deviation 1.3 µm, specification 15 to 25 µm, one-sided 95% confidence, Cpk required 1.0.
- Cp / Cpk from the sample | 1.282 / 1.128
- Lower 95% bound on Cp | 1.002
- * Lower 95% bound on Cpk | 0.865, against 1.0 required: NOT YET PROVEN, MORE DATA NEEDED
- Parts to prove a Cpk of 1.0 if the sample Cpk holds | About 124
```

The sample's Cpk of 1.128 exceeds 1.0, but 30 readings are not enough to prove it: the lower confidence bound is 0.865. With about 124 readings showing the same mean and spread, the bound would reach 1.0. The pump maker now accumulates readings over four batches before reporting capability, and reports the bound alongside the index. The two statistics answer different questions: the tolerance interval says where most parts lie; the capability bound says whether the process can be relied on to keep them there.

The Cpk is also lower than the Cp because the mean, 19.4 µm, sits below the specification's centre of 20 µm. Moving the process to centre would raise Cpk towards Cp without any reduction in spread, which is cheaper than reducing the spread.

### What the customer's sampling will see

The customer checks a sample of 13 housings from each batch and rejects the batch if any is outside the specification. The [lot acceptance from process capability tool](/tools/lot-acceptance-from-capability/) links the process to that plan. For a normal process with mean 19.4 µm and standard deviation 1.3 µm, it gives z values of 3.385 to the lower limit and 4.308 to the upper, a fraction outside the specification of 365 parts per million, and a probability that a batch passes the customer's plan of 99.53%, against the 95% the pump maker wants. It also warns that the process is off centre.

## The mistake: an outlier averaged in

In one batch, an inspector recorded ten readings and calculated their mean and standard deviation for the batch record: 20.38 µm and 2.36 µm. A Cpk of min(20.38 − 15, 25 − 20.38) ÷ (3 × 2.36) = 0.65 went to the quality engineer, who stopped the anodising line.

The ten readings were 19.1, 20.3, 18.7, 19.8, 21.0, 19.5, 18.9, 20.1, 26.8 and 19.6 µm. One stood out. The [Grubbs outlier check tool](/tools/grubbs-outlier-check/) tested the most extreme value: mean 20.38, standard deviation 2.358, suspect value 26.8, G = 2.722 against a critical value of 2.29 at 5% significance for ten values: OUTLIER DETECTED, investigate value 9 for a cause.

```figure
type: steps
title: Investigating the suspect reading
caption: This is an illustration. The reading was replaced only after its cause was found.
- Statistic | G = (26.8 − 20.38) ÷ 2.358 = 2.722, above the critical 2.29
- Location | Reading 9 had been taken on the mounting flange, 2 mm from its edge
- * Cause | Edge effect: the gauge reads high within its least edge distance (Chapter 5)
- Action | Reading repeated at the measurement plan's location on that housing: 19.9 µm
- Batch with the cause removed | Nine valid readings: mean 19.67 µm, standard deviation 0.73 µm; line restarted
- Prevention | Measurement locations marked on a template that sits over the housing
```

Two things went wrong, and one went right. The inspector averaged in a reading without looking at it; the quality engineer acted on a capability index without looking at the data behind it. What went right was the order of the investigation. The reading was not deleted because it was inconvenient. It was tested, a physical cause was found, and only then was it replaced by a valid reading at the right location. An outlier with no cause found stays in the data, and the process is investigated instead. The Grubbs test, like the others here, assumes the remaining values are roughly normal, and it tests one suspect value at a time.

## When the data are not normal

Most of the tools in this chapter assume that the readings follow a normal distribution: the tolerance interval, the capability bounds, the lot acceptance link and the Grubbs test. Many inspection data do not. Coating thickness gathered from different locations on a part is a mixture of the thick edges and the thin recesses, which can give two humps or a long tail. Conductivity readings from bars of several heats can cluster by heat. Crack signals are skewed, with many small values and a few large ones.

The first defence is to look. A normal probability plot of the readings takes a minute and shows at a glance whether they lie close to a straight line. The second is to keep different populations apart: readings from different measurement locations, heats or machines are analysed separately rather than pooled, which often turns a strange distribution into two ordinary ones. Where the data remain clearly non-normal, methods that do not assume normality exist, such as tolerance intervals based on the extreme values of a larger sample, at the cost of needing more readings for the same confidence. The pump maker's rule is simple: no capability index or tolerance interval goes on a report without its probability plot beside it.

## What each error costs

A false call costs the time to confirm it. On the journal scanner, a rescan and a magnetic particle check take about ten minutes of an inspector's time, A$15.26 at the inspection station's rate of A$91.57 an hour from Chapter 10. At the 1.3 division threshold, the chance of a false call on a journal is about 0.028%, so on a shaft with two journals about 0.056%, or 0.11 false calls in a day of 200 shafts: about A$1.71 a day. Had the threshold been set at three standard deviations, almost every shaft would have alarmed, about 200 false calls a day, costing about A$3,050 a day in confirmation, and the scanner would have been switched off within a week. The hidden cost of false calls is trust: inspectors who see alarm after alarm on good parts learn to override alarms, and then the real crack goes through too. A low false call rate is a safety feature.

A miss costs whatever the escaped defect does in service, and it is harder to put a number on. The probability-of-detection curve gives the handle: at the 1.3 division threshold, about 31% of 0.3 mm cracks and 74% of 0.2 mm cracks pass undetected. Whether that is acceptable depends on whether such cracks grow to failure within the pump's life, which is a question for the shaft's designer, informed by fatigue data, not for the inspector. The procedure records the agreed answer: cracks below 0.5 mm are not required to be found, and the grinding process controls on the p-chart of Chapter 6 keep them rare.

## Two tests are better than one

Many of the pump maker's decisions use two tests in sequence: a fast screen, then a confirming test on anything the screen flags. Conductivity screens the bar and hardness confirms it; the scanner screens the journal and magnetic particle inspection confirms it; the comparator screens the shaft and a section confirms it. The sequence cuts false calls sharply, because a good part must fool both tests to be rejected, and the confirming test is applied only to the few parts the screen flags. It does nothing for misses, though: a defect the screen does not flag never reaches the confirming test. That is why the screen's threshold is set for detection, and the confirmation for accuracy.

## Writing the decision rules down

Each of the pump maker's tests now has its decision rule written into its procedure, so that two inspectors given the same readings reach the same decision.

For journal cracks, an alarm above 1.3 divisions on the production program, confirmed by a repeat scan and magnetic particle inspection, rejects the shaft; the procedure states that cracks of 0.5 mm and deeper are detected reliably and smaller ones are not. For bar conductivity, the guarded acceptance zone of 42.3 to 44.7 %IACS accepts, the indeterminate zones call for more readings and then hardness, and readings outside the specification are confirmed by hardness before any supplier complaint. For coating thickness, each batch must have its tolerance interval inside the specification, and capability is reported across four batches with its lower confidence bound. For shaft sorting, each supplier's verified reference and midpoint threshold apply. For tubes, the designed sampling plan applies, with its switching rules.

## Exercise: a reading in the grey zone

An incoming bar reads 42.2 %IACS at 20 °C, the mean of three readings. Under the decision zones above, what happens next? The four extra readings bring the mean of seven to 42.25 %IACS. If the meter's repeatability standard deviation is 0.05 %IACS, how much has averaging seven readings reduced the repeatability part of the uncertainty, and does it move the bar out of the indeterminate zone?

### Answer

A mean of 42.2 lies in the low indeterminate zone, 42.0 to 42.3, so the procedure calls for four more readings.

The repeatability contribution to the mean of seven readings is 0.05 ÷ √7 = 0.019 %IACS, against 0.05 ÷ √3 = 0.029 for three. Averaging has reduced it by a third. But the expanded uncertainty is dominated by the standard, temperature and calibration terms, which averaging does not touch, so it stays close to 0.30 %IACS, and the guarded limit stays at 42.3. A mean of 42.25 is still indeterminate, so the procedure sends the bar for a hardness test, which decides whether it is T6.
