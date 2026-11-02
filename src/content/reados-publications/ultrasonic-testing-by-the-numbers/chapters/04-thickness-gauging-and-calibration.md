---
book: ultrasonic-testing-by-the-numbers
chapterSlug: thickness-gauging-and-calibration
order: 4
title: "Thickness gauging and calibration"
description: "Two-point velocity and zero calibration, the V-path error of dual-element probes, temperature correction for hot walls, a Type 1 gauge study and an uncertainty budget for wall readings."
draft: false
---

A thickness gauge does not measure thickness. It measures a time and applies two numbers to it: a velocity, and a zero offset that removes the delay inside the probe and its plastic delay lines. Calibration is the process of finding both numbers on references of known thickness, and the quality of every reading in a survey depends on it. Done properly, a corrosion survey resolves changes of a few hundredths of a millimetre; done carelessly, it produces readings that are repeatable, plausible and wrong.

This chapter sets out two-point calibration and why it matters for dual-element probes, corrects readings taken on a hot wall, works a gauge repeatability study and an uncertainty budget for the mill's corrosion gauge, and finishes with mid-season readings that nearly persuaded the mill that its corrosion had stopped.

## Velocity and zero

The gauge's raw measurement is the time Δt from its transmitted pulse to the detected back-wall echo. Part of that time is spent in the probe, the delay lines and the couplant, not in the steel. The gauge subtracts a zero offset t₀ and converts the rest with the velocity c.

```figure
type: formula
title: Thickness from the raw time, and two-point calibration
formula: t = c × (Δt − t₀) ÷ 2
formula: Two-point calibration on steps t_A and t_B: c = 2 (t_B − t_A) ÷ (Δt_B − Δt_A)
formula: t₀ = Δt_A − 2 t_A ÷ c
caption: Δt_A and Δt_B are the raw times measured on the thin and thick reference steps. Two references fix two unknowns; a single reference fixes one and assumes the other.
- t | thickness, mm
- c | calibrated velocity
- Δt | raw time from pulse to echo
- t₀ | zero offset
```

With one reference, a technician can set the zero offset if the velocity is known, or the velocity if the zero is known, but not both. The gauge's built-in zero disc sets the zero for a nominal probe delay and nothing else. Two references of the same material as the part, one near the thinnest wall expected and one near the thickest, fix both. The mill's step block is carbon steel with steps of 2.50, 3.00, 5.00, 7.50, 10.00 and 12.50 mm, each certified to ±0.02 mm at a coverage factor of 2.

## The V-path of a dual-element probe

A dual-element probe's two elements sit side by side, each tilted slightly towards the other. Sound leaves the transmitter, travels down at a slight angle, reflects from the back wall and travels up at a slight angle to the receiver: a V, not a straight down-and-back path. The V is always longer than twice the thickness, and the difference matters most for thin walls, where the tilt angles are largest relative to the wall. Gauges contain a correction for the probe models they recognise, but the correction is approximate, and two-point calibration over the range of interest reduces what remains.

The mill's dual-element probe can be modelled as if its sound entered and left the steel 1.0 mm either side of the probe's centre line, with an internal delay of 7.000 µs. This is an illustration of the geometry, not a probe maker's data. The path in steel is then 2√(t² + 1.0²), and the table shows what two calibration methods give.

```figure
type: compare
title: Readings from a dual-element probe with a V-path, two calibration methods
cols: True wall | Velocity 5,920 m/s, zero set on 10.00 mm | Two-point calibration on 3.00 and 10.00 mm
rowhead: Point
- Reducer's worst spot | 2.62 mm | 2.75 mm, +0.13 | 2.64 mm, +0.02
- Juice line's structural minimum | 3.00 mm | 3.11 mm, +0.11 | 3.00 mm, 0.00
- Juice line's worst location | 5.45 mm | 5.49 mm, +0.04 | 5.42 mm, −0.03
- Juice line nominal | 7.11 mm | 7.13 mm, +0.02 | 7.08 mm, −0.03
- Vessel shell nominal | 10.00 mm | 10.00 mm, 0.00 | 10.00 mm, 0.00
caption: This is an illustration. Raw times on the steps: 8.068 µs on 3.00 mm and 10.395 µs on 10.00 mm. Two-point calibration finds an apparent velocity of 6,017 m/s and a zero of 7.071 µs, which absorb most of the V-path error between the steps.
```

Single-point calibration on the thick step leaves the thin walls reading high, by 0.13 mm at the reducer's worst spot and 0.11 mm at the structural minimum. That error is on the unsafe side exactly where it matters most: a wall close to its minimum looks thicker than it is. Two-point calibration on steps bracketing the range of interest leaves errors of a few hundredths of a millimetre. The calibrated velocity, 6,017 m/s, is not steel's real velocity; it is a fitted number that, with the fitted zero, best represents the probe's V-path over that range. That is why the procedure records which steps were used and why the gauge is re-calibrated whenever the probe is changed.

### Outside the calibrated range

The V-path error grows quickly below the thin calibration step. In the model, a true 1.50 mm wall reads 1.62 mm even after two-point calibration on 3.00 and 10.00 mm. The mill's procedure therefore calibrates on the 2.50 mm step when the thinnest wall in a survey is expected below 3 mm, and confirms any reading below the thin step on a reference of similar thickness. Readings far above the thick step are less affected but still need the thick step to lie near them.

## Hot walls

Chapter 1 explained that steel's sound speed falls by about 1% for every 55 K. A gauge calibrated on a block at 25 °C and used on a wall at 105 °C is converting times with a velocity 1.45% too high, so every reading comes out 1.48% thick.

```figure
type: formula
title: Correcting a reading taken on a hot wall
formula: Velocity factor: c_hot ÷ c_cal ≈ 1 − 0.0182 × (T − T_cal) ÷ 100
formula: True thickness ≈ reading × c_hot ÷ c_cal
caption: The coefficient, about 1% per 55 K for carbon steel, is a typical figure; it should be confirmed for the material on a heated reference. Thermal expansion of the wall itself, about 0.1% over 95 K, is much smaller and is usually ignored.
- T | wall temperature at the probe, °C
- T_cal | reference block temperature at calibration, °C
```

At 105 °C, the velocity factor is 1 − 0.0182 × 0.80 = 0.9855, so a reading of 5.53 mm corresponds to 5.45 mm. At 120 °C the factor is 0.9827. The alternative to calculation is to calibrate on a reference block heated to the wall's temperature, which also checks the probe and couplant at that temperature. Either way, the wall's temperature must be measured at each point with a contact thermometer, because a pipe or vessel is rarely at one temperature everywhere.

## The mistake: corrosion that seemed to stop

In June, at the start of the crushing season and two weeks after the slack-season survey, the mill began dosing a corrosion inhibitor into the juice system, and during a two-day stop eight weeks later the reliability engineer asked for spot readings at the juice line's four worst locations to see whether it was working. The line was at about 105 °C. The technician calibrated on the step block in the workshop at 25 °C, used the glycerine couplant of Chapter 2 and took the readings.

All four were slightly thicker than in the slack-season survey: the worst location read 5.53 mm against 5.45 mm. The engineer's first draft of the monthly report said the inhibitor had stopped the corrosion.

```figure
type: steps
title: Correcting the mid-season readings
caption: This is an illustration. At the rate Chapter 6 calculates, about 0.15 mm a year, the ten weeks since the slack-season survey would remove about 0.03 mm, less than one reading’s uncertainty.
- Slack-season reading at the worst location, cold | 5.45 mm
- Mid-season reading at 105 °C, workshop calibration at 25 °C | 5.53 mm: apparently 0.08 mm thicker
- Velocity factor at 105 °C | 1 − 0.0182 × 0.80 = 0.9855
- * Corrected reading | 5.53 × 0.9855 = 5.45 mm, no apparent change, not a gain
- Check on a heated reference | step block warmed to 100 °C on the line read 10.14 mm for 10.00 mm, a factor of 0.986
- Report changed | eight weeks is too short to measure the inhibitor's effect; corrosion coupons and the next survey will
```

The correction turned an apparent gain of 0.08 mm into no measurable change. A spare step block warmed against the line confirmed the factor: its 10.00 mm step read 10.14 mm at about 100 °C, as the formula predicts for 75 K above the calibration temperature. Ten weeks of corrosion at the line's rate, about 0.15 mm a year as Chapter 6 calculates, would remove about 0.03 mm, less than the reading's uncertainty, so a spot check this soon could neither show nor disprove an effect. The report was changed to say so, and the engineer arranged corrosion coupons in the line, which measure the rate directly and quickly, as Chapter 5 describes.

## Checks during a survey

Calibration at the start of a survey is not enough on its own. Couplant builds up on the probe face, the probe's wear face abrades on rough pipe, cables are flexed and the gauge warms in the sun. Each can shift the zero by a few hundredths of a millimetre over a morning. The mill's procedure therefore re-reads the 3.00 mm and 10.00 mm steps at least every two hours, after every change of probe or cable, and at the end of the survey. If either step reads more than 0.02 mm from its certified value, the readings taken since the last good check are repeated after re-calibration. The check readings are recorded on the survey sheet alongside the condition monitoring readings, so that anyone reviewing the survey later can see that the gauge was in calibration throughout. This is cheap insurance: a check takes a minute, and repeating a morning's survey takes three hours.

The probe's wear face also wears thinner with use, which shortens its internal delay. A gauge that auto-zeroes on its built-in disc compensates for part of that change, but only a check on the step block confirms that the zero and velocity together still give correct readings at both ends of the range.

## How good is the gauge? A Type 1 study

Before the survey, the technician performs a short gauge study on the 10.00 mm step: 25 readings, lifting the probe, re-applying couplant and re-seating it each time. The readings average 10.004 mm with a standard deviation of 0.012 mm, and the gauge displays to 0.01 mm.

The [gauge repeatability and bias check](/tools/gauge-repeatability-bias-check/) works a Type 1 study from exactly those figures. It needs a tolerance band against which to judge the spread. Thickness readings have no drawing tolerance, so the mill uses a working band of ±0.5 mm around the reference, the smallest change in wall it intends a survey to resolve between two inspections, about two-thirds of the juice line's expected loss over a five-year interval. Entering 25 readings, a mean of 10.004, a standard deviation of 0.012, a reference of 10.000, limits of 9.5 and 10.5, a resolution of 0.01, 20% of the tolerance and a spread of six standard deviations gives Cg = 2.78 and Cgk = 2.67, against a minimum of 1.33. The bias of 0.004 mm gives t = 1.67 and p = 0.11, not significant, and the resolution is 1% of the band. The gauge and its user are capable of resolving changes of the size the survey is looking for.

```figure
type: stats
title: The corrosion gauge's Type 1 study on the 10.00 mm step
caption: This is an illustration. From the gauge repeatability and bias check with a working band of ±0.5 mm.
- 25 | readings, probe lifted and re-seated each time
- 10.004 mm | mean; bias 0.004 mm, p = 0.11, not significant
- 0.012 mm | standard deviation of the readings
- 2.78 / 2.67 | Cg / Cgk against a minimum of 1.33
- 1% | display resolution as a share of the band
```

A Type 1 study on a smooth step block is the best case. On a real pipe, with a curved, brushed surface and a back wall roughened by corrosion, repeatability is worse. The mill therefore also takes three readings at each condition monitoring location, lifting the probe between them, and uses their spread to judge each location's repeatability in the field, which Chapter 5 uses when it compares readings between surveys.

## An uncertainty budget for one reading

The [measurement uncertainty budget tool](/tools/measurement-uncertainty-budget/) combines independent contributions by root-sum-square and expands the result with a coverage factor. It was built for dimensional gauges, with terms for Abbe error and thermal expansion that do not apply here, and those are set to zero. Entering the block's certificate uncertainty of 20 µm at k = 2, a resolution of 10 µm and a repeatability of 12 µm gives standard uncertainties of 10.0, 2.9 and 12.0 µm, a combined standard uncertainty of 15.9 µm and an expanded uncertainty of 31.8 µm at k = 2, with repeatability the largest contributor.

A hot reading adds one more term that the tool does not hold: the uncertainty of the temperature correction. If the wall's temperature is known to ±10 K, taken as a rectangular limit, the correction on a 9.24 mm hot wall is uncertain by 9,240 × 0.000182 × 10 ÷ √3 = 9.7 µm. Added by root-sum-square, it raises the combined standard uncertainty to 18.6 µm and the expanded uncertainty to 37 µm.

```figure
type: bars
title: Standard uncertainty contributions to one hot reading on V-12
unit: µm
max: 13
caption: This is an illustration. Calibration, resolution and repeatability from the measurement uncertainty budget tool; the temperature-correction term is calculated by hand for ±10 K on a 9.24 mm wall. Combined 18.6 µm; expanded (k = 2) 37 µm.
- Block certificate, 20 µm at k = 2 | 10.0
- Display resolution, 10 µm | 2.9
- * Repeatability on the block | 12.0
- Temperature correction, ±10 K | 9.7
```

An expanded uncertainty of about ±0.04 mm on one reading is small against the vessel's corrosion allowance and against the half-millimetre changes the survey is designed to resolve, but it is not small against one year's corrosion on the juice line. That is the reason Chapter 6 calculates corrosion rates over several years and from several readings, not from the difference between two single readings a year apart.

## Exercise: calibrating for the reducer

The new reducer on the juice line has a nominal wall of 4.5 mm, and the mill wants a baseline survey. Using this chapter's V-path model of the dual-element probe, the technician must choose the calibration steps. Compare a two-point calibration on the 3.00 and 10.00 mm steps with one on the 2.50 and 5.00 mm steps for a true wall of 4.50 mm, and say which to use. The raw times on the 2.50 mm and 5.00 mm steps are 7.9097 µs and 8.7226 µs.

### Answer

**Given:** steps 2.50, 3.00, 5.00 and 10.00 mm; raw times 8.0683 µs (3.00 mm), 10.3952 µs (10.00 mm), 7.9097 µs (2.50 mm), 8.7226 µs (5.00 mm); the model's internal delay of 7.000 µs, half-separation 1.0 mm and true velocity 5,920 m/s.

**Assumptions:** the V-path model describes the probe; the step block and reducer are the same carbon steel at the same temperature.

**Method:** calibrate c and t₀ from each pair of steps; compute the raw time for a true 4.50 mm wall from the model; convert it with each calibration.

**Raw time for 4.50 mm:** path = 2√(4.50² + 1.0²) = 9.220 mm; Δt = 7.000 + 9.220 ÷ 5.920 = 8.5574 µs.

**Calibration on 3.00 and 10.00 mm:** c = 2 × 7.00 ÷ (10.3952 − 8.0683) = 6.017 mm/µs; t₀ = 8.0683 − 6.00 ÷ 6.017 = 7.0711 µs. Reading = 6.017 × (8.5574 − 7.0711) ÷ 2 = 4.47 mm, 0.03 mm thin.

**Calibration on 2.50 and 5.00 mm:** c = 2 × 2.50 ÷ (8.7226 − 7.9097) = 6.150 mm/µs; t₀ = 7.9097 − 5.00 ÷ 6.150 = 7.0967 µs. Reading = 6.150 × (8.5574 − 7.0967) ÷ 2 = 4.49 mm, 0.01 mm thin.

**Decision:** use the 2.50 and 5.00 mm steps. They bracket the reducer's whole working range, from its 4.5 mm nominal wall down to the 3.0 mm structural minimum, and read the 4.50 mm wall within 0.01 mm. The wider 3.00 and 10.00 mm pair reads it 0.03 mm thin, because a calibration fitted across a wide range follows the V-path's curvature less closely in the middle. Both errors are small and on the safe side here, but the narrower pair is better at the thin end too: at a true 2.62 mm it reads 2.62 mm, against 2.64 mm for the wider pair.

**Interpretation:** the best calibration is the one whose steps bracket the walls actually being measured, as closely as the block allows. A survey that covers both the reducer and the 10 mm vessel shell needs two calibrations, recorded separately, not one compromise.

**Verification:** each calibration must reproduce its own steps exactly: 6.150 × (8.7226 − 7.0967) ÷ 2 = 5.00 mm and 6.017 × (10.3952 − 7.0711) ÷ 2 = 10.00 mm.
