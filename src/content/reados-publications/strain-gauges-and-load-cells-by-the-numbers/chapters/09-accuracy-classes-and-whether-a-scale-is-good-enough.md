---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: accuracy-classes-and-whether-a-scale-is-good-enough
order: 9
title: "Accuracy classes and whether a scale is good enough"
description: "How to read a load cell's OIML accuracy class and error limits, when trade rules apply, and how a gauge study and error budget show whether a scale can weigh to a tolerance."
draft: false
---

A load cell datasheet is full of numbers: an accuracy class, a number of intervals, errors in per cent of rated output, temperature effects per ten kelvin, creep over thirty minutes. A process engineer needs to answer a simpler question: can this scale weigh this ingredient to this tolerance, batch after batch? The datasheet is part of the answer, the installation and calibration are another, and the process that fills the hopper is often the biggest part of all.

This chapter explains the international classification of load cells set out in OIML R 60, works out what a C3 classification means for one of BH-2's cells, and notes when Australian trade measurement rules apply. It then uses a gauge study to judge BH-2 against the mill's tolerance for a major ingredient, shows why the same scale fails for a 50 kg mineral addition, and builds an error budget for a whole batch in which the scale turns out to be a minor contributor.

## OIML R 60 and the accuracy classes

OIML R 60 is the International Organization of Legal Metrology's recommendation for load cells. Its 2021 edition, Part 1, sets the metrological and technical requirements; Part 2 sets the tests. It is written for load cells used in legal metrology, that is, in instruments used for trade and other regulated purposes, but its classification has become the common language for describing load cell performance generally.

Load cells are ranked in four accuracy classes, A, B, C and D, by the number of verification intervals, n_LC, into which the cell's measuring range can be divided while it still meets the error limits for its class.

```figure
type: compare
title: OIML R 60-1:2021 accuracy classes and load cell verification intervals
cols: Lower limit of n_LC | Upper limit of n_LC
rowhead: Class
- A | 50,000 | Unlimited
- B | 5,000 | 100,000
- * C | 500 | 10,000
- D | 100 | 1,000
caption: From Table 1 of OIML R 60-1:2021. The classification symbol combines the class letter with n_LC in thousands, so C3 is class C with 3,000 intervals; it may add the manner of loading, special temperature limits such as −5/30 and a humidity symbol.
```

A cell's full classification has up to six parts: the accuracy class; the maximum number of intervals; the manner of loading where it could be confused, such as compression or tension; special limits of working temperature if they differ from the standard range; a humidity symbol; and further characteristics declared by the maker. The standard temperature range is −10 °C to +40 °C. A cell may instead be classified over a narrower special range, which for classes C and D must span at least 30 K. For humidity there are three symbols: CH for cyclic humidity, the standard test, which need not be marked; NH for cells not subjected to a humidity test; and SH for steady-state humidity. A cell marked NH is not tested for humidity at all, which matters for a mill washed down with water.

## What C3 means for BH-2's cells

The maximum permissible errors in R 60 are stated in terms of the load cell verification interval v, the step into which the range is divided for testing, and an apportioning factor p_LC, which is the share of a weighing instrument's error allowance given to the load cell. The maker may declare p_LC between 0.3 and 0.8; if none is stated, 0.7 applies. For class C the limits are p_LC × 0.5 v for loads up to 500 v, p_LC × 1.0 v from 500 v to 2,000 v, and p_LC × 1.5 v from 2,000 v to 10,000 v. They include non-linearity, hysteresis and the effect of temperature on sensitivity, and apply to increasing and decreasing loads.

For a 2,000 kg cell with 3,000 intervals, v is 2,000 ÷ 3,000 = 0.667 kg. The other limits follow the same pattern.

```figure
type: steps
title: R 60 limits applied to one 2,000 kg, C3 cell with p_LC = 0.7
caption: This is an illustration of how the rules in OIML R 60-1:2021 apply, with v = 0.667 kg. The maker's declared v_min, here assumed to be 0.2 kg, comes from the datasheet. A cell that meets these limits in type testing is far more accurate than BH-2's 1 kg display division needs.
- Load cell verification interval v, 2,000 ÷ 3,000 | 0.667 kg
- At a full batch, 1,216.7 kg = 1,825 v: MPE = 0.7 × 1.0 v | ±0.47 kg
- At rated load, 3,000 v: MPE = 0.7 × 1.5 v | ±0.70 kg
- Creep over 30 min near rated load, 0.7 × MPE | 0.49 kg
- Creep between 20 and 30 min, 0.15 × MPE | 0.105 kg
- Return of the minimum load output after the creep test, 0.5 v | 0.33 kg
- * Temperature effect on the minimum load output per 5 K, p_LC × v_min | 0.14 kg
```

R 60 also limits repeatability: for class C, the spread of three identical load applications must not exceed the MPE at that load. And it limits the effect of barometric pressure and, for cells marked CH or unmarked, the effect of cycles of humidity. The numbers are small because the test conditions are good: a type test loads the cell squarely in a laboratory, at controlled temperatures, through ideal fixtures. BH-2's cells sit under a hopper with sleeves, a vibrator and a pellet mill nearby, which is why the installation chapters matter more than the class.

## Reading a datasheet in per cent of rated output

Many datasheets, especially for cells not certified under R 60, state performance as percentages of rated output (RO) instead of verification intervals. The numbers look tiny and are easy to misread, so it pays to turn each into kilograms for the cell as it will be used. A per cent of rated output is a per cent of the cell's full-scale signal, so for a 2,000 kg cell, 0.01% RO is 0.2 kg whatever load the cell carries at the time.

```figure
type: compare
title: A typical datasheet translated into kilograms for one BH-2 cell
cols: Datasheet value | In kilograms | What it means for BH-2
rowhead: Item
- Combined error (non-linearity and hysteresis) | ±0.02% RO | ±0.4 kg | Per cell; partly cancels across three cells
- Creep over 30 minutes | ±0.02% RO | ±0.4 kg | Negligible: a batch is weighed in minutes
- Temperature effect on zero | ±0.0015% RO per K | ±0.03 kg per K, ±0.6 kg over 20 K | Why the zero is checked daily
- Temperature effect on span | ±0.001% per K | ±0.24 kg at a full batch over 20 K | Small in an indoor mill
- Zero balance | ±1% RO | ±20 kg of offset | Irrelevant: removed when the hopper is zeroed
- Safe overload | 150% of rated | 3,000 kg | Margin for dynamic loads, Chapter 7
- Ultimate overload | 300% of rated | 6,000 kg | Beyond this the cell may break
caption: This is an illustration with values typical of a C3-class shear beam; use the real datasheet. Temperature effect on span is a share of the reading, here 1,216.7 kg per cell at a full batch. Zero balance is the cell's output with no load and matters only if it is large enough to use up the indicator's zero range.
```

Translated, the datasheet tells a consistent story. The cell's own errors are a few tenths of a kilogram, and most of them are either removed by zeroing before each batch or average out across three cells. The largest single item is the effect of temperature on zero, which is why the mill checks BH-2's zero at the start of each shift and keeps cells out of draughts (Chapter 3). None of these figures includes the installation, which is where Chapters 7 and 8 found errors of several kilograms.

One more reading habit is useful: check what each figure is a percentage of. Some datasheets state temperature effect on span per 10 K rather than per kelvin, some state errors as a share of the applied load rather than of rated output, and a figure in per cent of applied load is far smaller in kilograms at low loads than one in per cent of rated output.

## When trade measurement rules apply

BH-2 weighs ingredients for the mill's own formulations. Nothing is bought or sold on its reading, so it is process weighing, and its accuracy is the mill's own business, governed by its quality system and its customers' specifications. The mill's weighbridge is different: feed sold by the tonne on its reading is trade, and in Australia an instrument used for trade must be of a pattern approved by the National Measurement Institute, verified before use and kept within its limits, with servicing and verification done by licensed people. The trade rules call up their own instrument recommendations, which in turn rely on load cells classified under R 60 through the apportioning factor. If any scale in a plant is used to buy or sell by mass, or to work out a charge, check the current trade measurement requirements before relying on it.

## Is BH-2 good enough for a major ingredient?

The mill's formulation tolerance for a major ingredient in a 2,500 kg batch is ±10 kg. Whether the scale can meet it is a question about the scale's repeatability and bias, which a gauge study answers directly. The mill's check is a Type 1 study: the 500 kg of test weights hung and removed 25 times by one person, reading each time in the 0.1 kg service mode, with the weights as the reference.

The [gauge repeatability and bias check tool](/tools/gauge-repeatability-bias-check/) analyses a Type 1 study from the number of readings, their mean and standard deviation, the reference value, the specification limits and the gauge resolution. It works out the bias, the capability indices Cg (repeatability against a share of the tolerance) and Cgk (repeatability with bias), the share of the tolerance they use, a t-test of whether the bias is real, and whether the resolution is fine enough.

```figure
type: compare
title: Type 1 studies of BH-2 with 500 kg of test weights, tolerance ±10 kg
cols: Bias | Cg | Cgk | Bias test | Verdict
rowhead: Study
- Before the span correction: mean 500.6 kg, s 0.25 kg | +0.6 kg | 2.67 | 1.87 | t = 12, bias real | Capable, but correct the bias
- * After the span correction: mean 500.1 kg, s 0.25 kg | +0.1 kg | 2.67 | 2.53 | p = 0.057, not significant | Capable
caption: This is an illustration. Gauge repeatability and bias check tool with 25 readings, 20% of the 20 kg tolerance used for Cg over 6 standard deviations, minimum Cg and Cgk of 1.33, and resolution 0.1 kg (0.5% of the tolerance). The first study was made before the calibration correction in Chapter 8.
```

Both studies show a capable scale for a ±10 kg tolerance. The first also shows the value of the bias test: the indices passed, but the tool's t-test showed a bias of 0.6 kg that was certainly real, which the Chapter 8 calibration then traced and corrected.

## When it goes wrong: weighing a mineral on the batch scale

Some of the mill's formulations call for 50 kg of a mineral premix with a tolerance of ±2 kg, because too little leaves the animals short and too much is costly and, for some minerals, harmful. For years the batching program weighed it in BH-2 along with everything else. When the mill's nutritionist asked for evidence that the premix was within tolerance, the same Type 1 method was applied with two 25 kg weights.

```figure
type: compare
title: Type 1 study of BH-2 with 50 kg of test weights, tolerance ±2 kg
cols: Value | Required | Result
rowhead: Check
- Cg | 0.53 | 1.33 | Fail
- Cgk | 0.40 | 1.33 | Fail
- Repeatability's share of the tolerance | 37.5% | | Too large
- Resolution, 1 kg display | 25% of the tolerance | 5% | Fail
caption: This is an illustration. Gauge repeatability and bias check tool: mean 50.1 kg, s 0.25 kg, reference 50 kg, limits 48 and 52 kg, display resolution 1 kg in normal operation.
```

The scale's repeatability, 0.25 kg, does not change with the load, but the tolerance does: ±2 kg instead of ±10 kg. And in normal operation the display steps in 1 kg, a quarter of the tolerance. BH-2 was never capable of weighing the premix to ±2 kg, however well calibrated it was. The mill moved minor ingredients to a separate 100 kg micro-ingredient scale above the mixer, which the exercise at the end of this chapter checks. The micro scale is a small stainless hopper on a single-point cell, filled by hand from bags through a sieve and discharged by a slide gate straight into the mixer, so the premix never passes through BH-2 at all. Each addition is recorded against the batch number, and the batching program will not release the mixer until the micro scale reports its ingredients complete.

The general lesson is that a scale's capability is relative to the tolerance of the smallest thing it is asked to weigh, not to its capacity. A batch scale that is excellent for its major ingredients can be useless for its minor ones, and the only way to know is to test it at the small loads with the tight tolerances.

## An error budget for a batch

Even a capable scale is only one source of error in the mass of an ingredient that reaches the mixer. The mill built an error budget for a major ingredient in BH-2, combining independent contributions as standard uncertainties, root-sum-square. The BIZOMAT measurement uncertainty tools are set up for dimensional measurements in micrometres, so this budget was worked by hand with the same method.

```figure
type: compare
title: Error budget for one major ingredient weighed in BH-2
cols: Standard uncertainty | Share of variance | Source of the estimate
rowhead: Contribution
- Calibration reference at full scale | 0.30 kg | 2.1% | Substitution, Chapter 8
- Repeatability | 0.25 kg | 1.4% | Type 1 study
- Display resolution, 1 kg ÷ √12 | 0.29 kg | 1.9% | Indicator setting
- Zero and span drift between daily checks | 0.30 kg | 2.1% | Daily check limits, Chapter 10
- * Material in flight when the feeder stops | 2.0 kg | 92.5% | Spread of batch over- and under-shoots
- Combined (root-sum-square) | 2.08 kg | 100% |
- Expanded, k = 2 | ±4.2 kg | | Against a ±10 kg tolerance
caption: This is an illustration. Standard uncertainties are the mill's estimates. The scale's own contributions combine to 0.57 kg, ±1.1 kg expanded; the feeder's variation dominates.
```

The budget is reassuring and redirecting at once. The ingredient lands within ±4.2 kg at 95% confidence, well inside ±10 kg. And more than nine-tenths of the variance comes from the feeder, the variation in how much meal is still falling when the feeder stops. Money spent on a better scale would barely change the result; money spent on a two-speed feeder that slows down before the target, or on a better in-flight correction, would.

The mill acted on that. The screw feeders for the three largest ingredients were given variable-speed drives and two-speed control: full speed until about 50 kg short of the target, then a slow dribble until the target, so that much less material is in the air when the feeder stops and its amount varies much less. Trials over a fortnight showed the spread of the in-flight error fall from about 2.0 kg to about 0.6 kg, one standard deviation. Put back into the budget, the combined standard uncertainty falls from 2.08 kg to 0.83 kg, and the expanded uncertainty from ±4.2 kg to ±1.7 kg. At that point the scale's own contributions are again comparable with the feeder's, and further gains would need both a finer display and a better feeder. Dribble feeding costs a few seconds per ingredient, which the mill judged worth it for the most expensive ingredients and not for the cheapest.

## Exercise: the micro-ingredient scale

The new micro-ingredient scale uses a 100 kg single-point load cell classified C3, reading in 0.01 kg steps. A Type 1 study with 50 kg of test weights gave a mean of 50.01 kg and a standard deviation of 0.02 kg over 25 readings. The premix tolerance is ±2 kg.

1. What is the cell's load cell verification interval, and its R 60 maximum permissible error at 50 kg with p_LC = 0.7?
2. Is the scale capable for the premix?
3. The bias test says the 0.01 kg bias is real. Does it matter?

**Answer.**

1. v = 100 ÷ 3,000 = 0.0333 kg. 50 kg is 1,500 v, between 500 v and 2,000 v, so the MPE is 0.7 × 1.0 × 0.0333 = ±0.023 kg.
2. The [gauge repeatability and bias check tool](/tools/gauge-repeatability-bias-check/) gives Cg = 6.67 and Cgk = 6.50 against 1.33, with repeatability using 3% of the tolerance and resolution 0.25% of it: comfortably capable.
3. Statistically yes, practically no. With 25 readings and a standard deviation of 0.02 kg, even a 0.01 kg offset is detectable (t = 2.5, p = 0.02), but it is half a percent of the tolerance. Record it, correct it at the next calibration, and do not confuse statistical significance with practical importance.
