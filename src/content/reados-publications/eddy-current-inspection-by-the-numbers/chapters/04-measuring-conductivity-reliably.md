---
book: eddy-current-inspection-by-the-numbers
chapterSlug: measuring-conductivity-reliably
order: 4
title: "Measuring conductivity reliably"
description: "Edge distance, curvature, lift-off and probe condition in conductivity readings, a Type 1 gauge study on a reference standard, and an uncertainty budget for the acceptance band."
draft: false
---

A conductivity meter gives a reading to two decimal places in two seconds, and that precision invites trust. Whether the reading means anything depends on where and how the probe was placed, the temperature, the surface under it and the state of the probe and the standards. The meter cannot tell the operator that the probe was too near an edge or rocking on a curved surface; it simply reports a different number. This chapter works through the influences on a reading, measures the meter's repeatability and bias with a Type 1 gauge study in the WORKOS gauge tool, and builds the uncertainty budget that Chapter 9 uses to set guard bands. Its mistake is three good bars rejected because they were measured too close to their edges.

## What changes a reading

```figure
type: compare
title: Influences on a conductivity reading and the pump maker's controls
cols: Effect on the reading | Control
rowhead: Influence
- Temperature | About −0.28% per kelvin above 20 °C in 6061-T6 | Correct to 20 °C; parts and standards within 2 K (Chapter 3)
- Part thickness | Reads low if thinner than three standard depths | Three-depth check; stacking test (Chapter 2)
- Edge distance | Reads low near an edge | Least edge distance from a test on the bar; centring sleeve on the bar's end face
- Curvature | Convex surfaces read low as the probe rocks and lifts at its rim | Least radius stated for the probe; curved standards where needed
- Lift-off from roughness or coating | Compensated up to the meter's stated limit; beyond it, reads low | Readings on machined or sawn faces within the limit; no readings through anodising
- Probe wear | Worn face changes lift-off and the balance | Check on the standard at the start of each session and every two hours
- Standard's own uncertainty | Sets a floor on the accuracy of every reading | Standards with calibration certificates; uncertainty in the budget
caption: This is an illustration. The controls are the pump maker's procedure for incoming bar.
```

### Edge distance

The pump maker reads conductivity on the sawn end face of each incoming bar, because that is where the probe can sit flat on bare metal. The probe is a shielded pancake probe 12 mm in diameter at 60 kHz. As Chapter 2 explained, its eddy currents spread a little beyond its own footprint, and near an edge they are cut off.

When the procedure was written, the quality engineer measured how close to the edge the probe could go, by stepping it in from the edge of a 65 mm bar's end face, from its centre outwards.

```figure
type: line
title: Conductivity reading against the probe centre's distance from the edge of a 6061-T6 bar end face, 12 mm shielded probe at 60 kHz
x: Distance from the edge to the probe centre, mm
y: Reading, %IACS at 20 °C
caption: This is an illustration. The reading reaches its plateau of about 43.15 %IACS by 8 mm and changes by less than 0.1 %IACS beyond it. The procedure sets the least edge distance at 10 mm, a margin over the 8 mm found.
series: Reading
- 2 | 39.80
- 4 | 41.90
- 6 | 42.90
- 8 | 43.10
- 10 | 43.15
- 15 | 43.15
- 25 | 43.15
```

### The mistake: three bars rejected near the edge

On a busy morning, a temporary inspector checking a delivery of 30 mm bars found that the probe would not sit centrally on the small end faces without slipping, and held it near the rim where his thumb could steady it. Three bars read between 41.6 and 41.9 %IACS, below the band, and were tagged for rejection. The regular inspector, reviewing the tags, noticed that all three were small bars and re-measured them with the probe in the centre of each face, 15 mm from every edge: 43.1, 43.2 and 43.2 %IACS.

The readings had been taken about 4 mm from the edge, where the chart shows a deficit of more than 1 %IACS. Nothing about the meter had warned of it. The bars were released and the procedure was changed in two ways. A plastic centring sleeve, bored to fit the probe and with a face that sits on the bar's end, now places the probe on the axis of any bar from 25 to 80 mm in diameter. And the procedure's smallest bar for an end-face reading is 25 mm, giving 12.5 mm from the probe centre to the edge; smaller bars are read on a flat milled on their side.

### Curvature and lift-off

A flat probe on a convex surface touches only along a line, and its rim stands off the metal. The extra lift-off lowers the reading unless the meter's compensation absorbs it, and on small radii it cannot. The probe maker states a least radius, and readings on curved surfaces are checked against a curved standard of the same radius. The meter's lift-off compensation corrects for small gaps, such as saw marks or a thin film of oil, up to a limit stated by its maker; a reading taken through anodising, which is typically thicker than that limit, is not a valid conductivity reading.

## How repeatable is the meter? A Type 1 study

Before relying on a gauge, a quality engineer wants to know how much its readings scatter and whether they are biased. A Type 1 gauge study measures one reference master, here the 43.10 %IACS standard, many times by one operator, removing and replacing the probe each time. The [gauge repeatability and bias check tool](/tools/gauge-repeatability-bias-check/) compares the scatter and bias with the tolerance.

The tool's capability indices use a share of the tolerance, K = 20%, against a spread of six standard deviations: Cg = (K × T) ÷ (6 s) and Cgk = (K × T ÷ 2 − |bias|) ÷ (3 s), where T is the tolerance. The pump maker requires both to be at least 1.33.

```figure
type: compare
title: Two Type 1 studies on the 43.10 %IACS standard in the gauge repeatability and bias check tool, 25 readings each
cols: Mean | Standard deviation | Bias | Cg / Cgk | Bias t / p-value | Result
rowhead: Study
- Before adjustment | 43.16 | 0.06 | +0.06 | 1.667 / 1.333 | 5.00 / 0.00004 | GAUGE CAPABLE, by the narrowest margin; bias significant
- * After adjustment | 43.13 | 0.05 | +0.03 | 2.000 / 1.800 | 3.00 / 0.0062 | GAUGE CAPABLE; small bias still significant
caption: This is an illustration. Tolerance 42.0 to 45.0 %IACS, T = 3.0; resolution 0.01 %IACS, 0.33% of the tolerance against a 5% limit.
```

The first study passed, but with Cgk = 1.333 against a minimum of 1.33, which is a pass in name only. Its bias of 0.06 %IACS was statistically significant, with a t statistic of 5.00 and a p-value of 0.00004, so the tool warned that the bias was real and should be corrected or allowed for. It was the same bias the linear calibration in Chapter 3 had found. After the meter was adjusted in its calibration routine and the probe face cleaned, a repeat study gave a mean of 43.13 %IACS with a standard deviation of 0.05: Cg = 2.000 and Cgk = 1.800. The remaining bias of 0.03 %IACS is still statistically significant, because 25 readings detect even small biases, but it uses only a hundredth of the tolerance and the budget below allows for it.

A Type 1 study shows the repeatability and bias of the instrument with one operator on one standard. It does not show how readings vary between operators, between probes or across the range of real parts, which a full gauge repeatability and reproducibility study with several parts and operators measures. The pump maker ran one when the procedure was introduced and repeats it when a new probe or inspector is added. The KEVOS collection chapter on measurement system analysis for manufacturers covers those studies.

## The uncertainty budget

To decide whether a bar reading near a limit truly passes, the inspector needs to know how far the reading might be from the true conductivity. An uncertainty budget lists each source, converts it to a standard uncertainty and combines them.

```figure
type: compare
title: Uncertainty budget for a corrected conductivity reading on 6061-T6 bar
cols: Basis | Standard uncertainty, %IACS
rowhead: Source
- Reference standard | Certificate: ± 0.22 %IACS at k = 2 | 0.110
- Repeatability | Type 1 study after adjustment, s = 0.05 | 0.050
- Temperature | Part and standard within ± 1 K, rectangular: 43 × 0.00284 × 1 ÷ √3 | 0.071
- Calibration line | Half-width 0.078 at 95%, taken as k = 2 | 0.039
- Probe position | Centring sleeve, from repeat placements on a bar | 0.030
- * Combined, root sum of squares | | 0.148
- Expanded, k = 2 | | 0.30
caption: This is an illustration. The certificate figure is the pump maker's assumed value for its standards. The largest single source is the standard itself.
```

The combined standard uncertainty is √(0.110² + 0.050² + 0.071² + 0.039² + 0.030²) = 0.148 %IACS, and the expanded uncertainty at a coverage factor of 2 is 0.30 %IACS. The acceptance band is 3.0 %IACS wide, so the ratio of the tolerance to the expanded uncertainty interval, 3.0 ÷ (2 × 0.30), is about 5, comfortably above the common minimum of 4. Chapter 9 uses the 0.30 %IACS to set guard bands inside the acceptance limits.

The budget also shows where improvement would pay. The standard dominates; a better-certified standard would reduce the combined uncertainty more than any improvement to the operator's technique. Temperature comes next, which is why the procedure insists on parts and standards being at the same temperature.

## Technique at the probe

Most of the scatter in conductivity readings comes from the operator's hand, not the meter. The procedure therefore spells out the technique. The probe is placed square to the surface, never tilted, with light and steady pressure; a spring-loaded holder or the centring sleeve gives the same pressure every time. The reading is taken only after the display has settled, typically a second or two, and the probe is lifted clear and replaced between readings rather than slid across the surface, because sliding wears the probe face and smears any oil film. The surface is wiped of coolant, oil and swarf first. A reading that differs from its neighbours by more than three times the repeatability standard deviation, 0.15 %IACS, is repeated rather than averaged in.

## How many readings per bar?

A single reading has the meter's repeatability scatter, a standard deviation of 0.05 %IACS after adjustment. Averaging several reduces the scatter of the mean. The [sample size to estimate a mean tool](/tools/sample-size-mean/) gives the number of readings needed to estimate a mean within a chosen margin. With a standard deviation of 0.05 %IACS, a margin of ± 0.05 %IACS at 95% confidence needs 1.96² × 0.05² ÷ 0.05² = 3.84, rounded up to 4 readings. Halving the margin roughly quadruples the number: ± 0.03 %IACS needs 10.67, or 11.

The procedure asks for three readings spread across the bar's end face and their mean, which brings the repeatability contribution of the mean to 0.05 ÷ √3 = 0.029 %IACS, well below the standard's uncertainty. When the mean lies within 0.30 %IACS of a limit, inside the guard band of Chapter 9, the inspector takes four more readings and uses the mean of all seven. More readings do nothing for the standard's uncertainty or a temperature error, which affect every reading alike, so beyond a handful, extra readings buy little.

## Looking after the standards

The reference standards carry the whole measurement, and the budget shows they are its largest source of uncertainty. Each standard is a polished block of a stable alloy with a certificate from an accredited calibration laboratory, giving its conductivity at 20 °C and the uncertainty of that value, traceable to national measurement standards. The certificate holds only while the block is unchanged: a scratch, a dent or a film of corrosion on the measuring face changes the lift-off and the reading. The pump maker's standards live in a padded case in the inspection room, are handled by their edges, are never used as a bench weight and are sent for recalibration every two years, or at once if dropped. Between calibrations, the five standards check one another: if one disagrees with the line through the others by more than the budget allows, that standard is the suspect.

## Checks during a session

A meter that was capable at its study can drift during a day as the probe warms, wears or picks up dirt. The procedure therefore requires a check reading on the 43.10 standard at the start of each session, every two hours and at the end. If the check differs from the standard's value by more than 0.15 %IACS, half the expanded uncertainty, every bar read since the last good check is re-read after the meter is corrected. A check takes under a minute, and recording each one with its time gives a running record of the meter's stability that shows a slow drift weeks before it would breach the limit. This is the same logic Chapter 6 applies to the crack scanner's reference notch, and Chapter 10 makes it part of the written procedure.

## Standards for the method and the instrument

Two families of published standards sit behind a procedure like this one. ASTM E1004 is a test method for determining electrical conductivity using the electromagnetic, or eddy-current, method; it covers the measurement of non-magnetic metals with a direct-reading meter and the conditions that affect it. The ISO 15548 series covers the characterisation and verification of eddy-current test equipment, Part 1 dealing with the instrument and later parts with probes and systems. The pump maker's procedure names the method standard its customer calls up and states its own controls, such as the edge distance, the session checks and the temperature rule, in its own words. As with every standard named in this book, the requirements are in the documents themselves, which must be obtained and read; nothing here reproduces them.

### Resolution is not accuracy

The meter displays two decimal places, a resolution of 0.01 %IACS, which the Type 1 study found to be 0.33% of the tolerance, far inside the 5% limit. That says only that the display is fine enough not to limit the measurement. The meter's accuracy is set by the budget, an expanded uncertainty of 0.30 %IACS, thirty times its resolution. Reports of conductivity therefore give one decimal place, and decisions near a limit use the guard band, not the second decimal.

## Exercise: a new probe

A replacement probe is fitted, and a Type 1 study on the 43.10 %IACS standard gives 25 readings with a mean of 43.19 and a standard deviation of 0.04 %IACS. With the same tolerance of 42.0 to 45.0, K = 20% and six standard deviations, calculate Cg and Cgk. Does the probe pass the 1.33 minimum? What should be done about its bias?

### Answer

The tolerance is T = 3.0 %IACS and the bias is 43.19 − 43.10 = +0.09 %IACS. Cg = (0.20 × 3.0) ÷ (6 × 0.04) = 0.60 ÷ 0.24 = 2.50. Cgk = (0.20 × 3.0 ÷ 2 − 0.09) ÷ (3 × 0.04) = (0.30 − 0.09) ÷ 0.12 = 1.75. Both exceed 1.33, so the probe passes, and the gauge repeatability and bias check tool gives the same indices.

Its bias, however, is large compared with its scatter: the t statistic is 0.09 ÷ (0.04 ÷ √25) = 11.25, so the bias is certainly real. The probe should be put through the meter's calibration routine on the standards and the study repeated, so that the 0.09 %IACS does not shift every reading. Until then, the budget would need a bias term, which would eat into the margin near the limits.
