---
book: production-leak-testing-by-the-numbers
chapterSlug: temperature-the-hidden-leak
order: 4
title: "Temperature, the hidden leak"
description: "Why hundredths of a kelvin swamp a pressure decay test, fill heating and its time constant, warm parts, compensation and its limits, and a line move that caused 18% false rejects."
draft: false
---

A pressure decay test measures pressure, and pressure in a closed volume depends on temperature as directly as on the amount of gas. At the OC-40 screen's 6 bar gauge, a change of one twentieth of a kelvin in the air's temperature moves the pressure by more than twice the reject limit. Temperature is therefore not a correction to a pressure decay test but its main source of error, and most of the effort in making such a test work goes into keeping temperature still while the pressure is watched.

This chapter calculates how temperature changes become pressure changes, models the heating from the fill and how long it takes to fade, shows what a warm part does to the test, examines compensation and why it is harder than it looks, and finishes with a line rearrangement that put warm coolers onto the screen and rejected nearly one in five good parts.

## Pressure follows temperature

For a fixed mass of gas in a fixed volume, the ideal gas law says pressure is proportional to absolute temperature. A small change in temperature therefore changes the pressure by the same fraction of the absolute pressure.

```figure
type: formula
title: Pressure change from a temperature change at constant volume
formula: Δp = p_abs × ΔT ÷ T
caption: p_abs is the absolute test pressure and T the absolute temperature. At the OC-40 screen, p_abs = 7,013 mbar and T = 293.15 K, so every 0.01 K moves the pressure by 0.24 mbar.
- Δp | pressure change, mbar
- ΔT | temperature change of the gas, K
```

The [closed gas vessel temperature check](/tools/gas-vessel-temperature-check/) applies the same law to a sealed vessel. Entering the OC-40's 0.90 L filled to 6 bar gauge at 20.2 °C and cooled to 20.0 °C gives a pressure change of −0.068%, which at 7,013 mbar absolute is −4.8 mbar: nearly ten times the screen's 0.5 mbar reject limit for a change of only 0.2 K. The tool was built to check vessels against their ratings as they warm; its pressure-change output is exactly the temperature error of a decay test.

```figure
type: bars
title: Pressure change at the OC-40 screen from small temperature changes
unit: mbar
max: 5
caption: This is an illustration. Δp = 7,013 mbar × ΔT ÷ 293.15 K. The screen's reject limit is 0.5 mbar, and its transducer resolves 0.1 mbar.
- 0.01 K | 0.24
- 0.02 K | 0.48
- 0.05 K | 1.20
- * 0.20 K | 4.79
```

The OC-40 screen can therefore trust its measurement only if the air in the cooler changes temperature by much less than 0.02 K during the 10-second window. That is a severe requirement, and it is met only by controlling every source of temperature change.

## Heat from the fill

When air rushes into the cooler, the air already inside is compressed and the incoming air does work on it, so the gas in the part ends the fill several kelvin warmer than the walls. The walls are cold relative to the gas, and the gas cools towards them. In a part with a lot of internal surface, like the brazed fins of a cooler, that cooling is fast; in a smooth, thick-walled casting it is slow.

The decline is close to exponential, with a time constant set by the part's internal surface and the gas's volume. The test engineer measured it on a sealed, known-good OC-40 by logging the pressure every 50 ms after the fill valve closed: the pressure fell by about 143 mbar in all, equivalent to an initial excess of 6 K, with a time constant of about 1.0 second.

```figure
type: formula
title: Pressure drift from fill heating during the measurement window
formula: Δp_drift = (p_abs × ΔT₀ ÷ T) × e^(−t_s ÷ τ) × (1 − e^(−t_m ÷ τ))
caption: ΔT₀ is the gas's excess temperature at the end of the fill, τ the cooling time constant, t_s the stabilisation time and t_m the measurement time. For the OC-40: p_abs ΔT₀ ÷ T = 143.5 mbar and τ = 1.0 s.
- t_s | stabilisation time, s
- t_m | measurement time, 10 s
- τ | thermal time constant of the gas in the part, s
```

With 8 seconds of stabilisation, the drift during the 10-second measurement is 143.5 × e⁻⁸ × (1 − e⁻¹⁰) = 0.048 mbar, a tenth of the reject limit. With only 4 seconds it would be 2.6 mbar, enough to reject every cooler. The stabilisation time is not padding in the cycle; it is what makes the measurement possible. Anyone looking to shorten the cycle should look elsewhere first.

```figure
type: compare
title: Fill-heating drift during the 10 s measurement, by stabilisation time
cols: Time constant 1.0 s, the OC-40 | Time constant 1.5 s
rowhead: Stabilisation time
- 4 s | 2.63 mbar | 9.96 mbar
- 6 s | 0.36 mbar | 2.63 mbar
- * 8 s | 0.048 mbar | 0.69 mbar
- 10 s | 0.007 mbar | 0.18 mbar
caption: This is an illustration from the drift formula with a total settling of 143.5 mbar. A part whose gas cools half as fast again, such as a larger cooler with less internal surface per litre, needs about 12 s to reach the same drift.
```

The second column is a warning for new parts. A cooler whose gas cools with a time constant of 1.5 seconds would drift 0.69 mbar in the same 8-second stabilisation, more than the reject limit. Every new part number needs its own settling measurement before its program is written, which is now part of the procedure introduced after Chapter 3's OC-60 mistake.

## Warm parts

The fill heat fades in seconds because it is only the gas that is warm. A part that is itself warmer than its surroundings is a slower and larger problem: its walls cool for many minutes, and the gas inside cools with them.

The OC-40 line washes every cooler after brazing and then dries it in a warm air oven, as Chapter 2 explained, to clear water from fine leak paths. A cooler leaving the oven is several kelvin above the shop's air. Its own cooling time constant, with its large finned surface in moving shop air, is about 200 seconds. A cooler that reaches the screen 4 K warm cools by 4 × (1 − e^(−10 ÷ 200)) = 0.195 K during the 10-second measurement, and its pressure falls by 4.7 mbar, nine times the limit.

```figure
type: compare
title: Pressure drop during the measurement from a warm cooler, time constant 200 s
cols: Cooling during 10 s | Pressure drop | Screen's verdict on a sound cooler
rowhead: Cooler above shop air at the start of the measurement
- 4 K | 0.195 K | 4.67 mbar | reject
- 1 K | 0.049 K | 1.17 mbar | reject
- 0.5 K | 0.024 K | 0.58 mbar | reject
- * 0.086 K | 0.0042 K | 0.10 mbar | pass, with 0.4 mbar left for leaks
caption: This is an illustration. Cooling over 10 s = ΔT₀ × (1 − e^(−10 ÷ 200)); pressure drop = 7,013 × cooling ÷ 293.15. A cooler must be within about 0.09 K of the shop air for its temperature to cost less than 0.1 mbar.
```

To keep the temperature error below 0.1 mbar, a fifth of the limit, the cooler must start the measurement within about 0.09 K of the air around it. From 4 K warm, with a 200-second time constant, that takes 200 × ln(4 ÷ 0.086) = 770 seconds, nearly 13 minutes. The line achieves it with a buffer conveyor between the drying oven and the screen that holds about 16 coolers, a quarter of an hour of production at the line rate.

## The mistake: the line move

During a re-layout to make room for the OC-60, the drying oven was moved to the end of the line beside the screen, and the buffer conveyor was shortened from sixteen positions to four. Within an hour of restarting, the screen's reject rate rose from its usual 0.3% to 18%. Almost every rejected cooler passed when retested twenty minutes later.

```figure
type: steps
title: Tracing 18% false rejects to warm coolers
caption: This is an illustration. Retesting after cooling, not adjusting the limit, identified the cause.
- Symptom | screen rejects up from 0.3% to 18% after the re-layout; most rejects pass on retest
- Rejects' pressure drops | 1 to 4 mbar, spread widely, not clustered as real leaks are
- Cooler temperature at the screen, contact probe | 1.5 to 3 K above the shop air
- Model | 1 K warm gives about 1.2 mbar; 3 K gives about 3.5 mbar during the measurement
- * Buffer restored to 16 positions | coolers reach the screen within 0.1 K; rejects back to 0.3%
- Procedure changed | cooler temperature measured at the screen; test refused if more than 0.2 K from the shop air
```

The production supervisor's first instinct was to raise the reject limit until the false rejects stopped. The test engineer refused, because a limit raised to 4 mbar would have accepted leaks up to 0.36 mbar·L/s, eight times the screen's intended limit, and would have flooded the helium chamber with gross leakers. The pattern of the rejects gave the cause away: their pressure drops were spread across 1 to 4 mbar rather than clustered, and almost all passed on retest after waiting. A contact thermometer on the coolers at the screen read 1.5 to 3 K above the shop air. The buffer conveyor was restored to sixteen positions, the reject rate fell back to 0.3%, and the screen now measures each cooler's surface temperature with an infrared sensor and refuses to test one that is more than 0.2 K from the shop air.

## Compensation and its limits

An obvious alternative to waiting is to measure the temperature and correct for it. If the gas cooled by a known ΔT during the measurement, subtract p_abs × ΔT ÷ T from the measured drop. Some testers do this, and it can help, but the numbers show why it is hard.

The correction needs the change in the gas's temperature during the measurement, not the part's surface temperature at one moment. The gas is inside, separated from any sensor by the wall. And the correction must be accurate to a few thousandths of a kelvin: an error of only 0.02 K in the estimated change leaves an error of 0.48 mbar, almost the whole reject limit. No surface sensor can deliver the gas's temperature change to that accuracy in a production cycle.

What does work is to make the part's temperature drift the same for the part under test and for a reference. Chapter 5's differential test does exactly that: a known-good master part, at the same temperature, is filled and measured alongside the test part, and only the difference in their pressures is recorded. Common temperature changes cancel. The OC-40 screen does not use a master, because the buffer conveyor already brings the coolers to the shop's temperature, but the OC-60, with its slower thermal response, may need one.

## Telling a leak from a temperature change

A leak and a temperature drift both lower the pressure, but they do it with different shapes. Over a 10-second window, a leak's pressure falls in a straight line, because its rate is constant while the pressure barely changes. A temperature drift falls along a curve, steep at first and flattening, because the gas approaches the walls' temperature exponentially.

The screen exploits that difference with a simple check. It records the pressure drop in the first and second halves of the measurement window separately. For a leak, the two halves are equal. For fill heating with a 1.0-second time constant, the second half's drop is less than one percent of the first half's. For a warm part with a 200-second time constant, the halves are nearly equal, so the check cannot tell a warm part from a leak, which is why the screen also measures the part's temperature. When the first half's drop is more than twice the second's, the screen flags the result as thermal rather than rejecting the cooler, and repeats the measurement after a further stabilisation. Few coolers are ever flagged, but the flag has twice caught a supply regulator that had drifted high, which made the fill hotter and its drift larger than the stabilisation allowed for.

## Other sources of temperature change

Three smaller sources also matter.

**The shop.** Doors opening in winter, sunlight through a skylight onto the fixture, or a nearby oven change the air temperature around the part during the test. The OC-40 screen sits in an enclosure away from the doors and the oven.

**The operator's hands.** Holding a small part while loading it warms it. Large coolers are handled by their end tanks and loaded on a fixture, which keeps the core away from hands.

**The fill air.** Air from a long, unheated supply line in winter or a hot compressor room in summer arrives at a different temperature from the part. A fill air heat exchanger, a coil of tube inside the screen's enclosure, brings it to the enclosure's temperature before it reaches the part.

### Winter and summer

The shop's own temperature changes with the season, from about 12 °C on winter mornings to over 30 °C in summer afternoons. The sensitivity of the test hardly changes: at 12 °C each kelvin is worth 7,013 ÷ 285.15 = 24.6 mbar, at 32 °C 7,013 ÷ 305.15 = 23.0 mbar. What changes is the gap between the coolers and the shop. In winter the drying oven sends out coolers that are further above the shop's air, and the buffer conveyor needs more time to bring them down; in summer the gap is smaller. The infrared check at the screen covers both seasons without anyone having to remember to adjust anything.

## Exercise: a slower part

The OC-60, with a 1.60 L test volume, has a measured fill-heating settling of 150 mbar in total at 6 bar gauge and a time constant of 1.5 seconds. Its parts arrive from the buffer within 0.05 K of the shop air, and its own cooling time constant is 300 seconds. Using a 10-second measurement, calculate the fill-heating drift for stabilisation times of 8 and 12 seconds, the drift from the part's own temperature, and the stabilisation time needed to keep the fill drift below 0.05 mbar. The OC-60's reject limit is 0.28 mbar.

### Answer

**Given:** settling 150 mbar; τ = 1.5 s; t_m = 10 s; part 0.05 K warm with a 300 s time constant; p_abs = 7,013 mbar; T = 293.15 K; limit 0.28 mbar.

**Assumptions:** exponential settling; the part's cooling is independent of the fill heating.

**Method:** fill drift = 150 × e^(−t_s ÷ 1.5) × (1 − e^(−10 ÷ 1.5)); part drift = 7,013 × 0.05 × (1 − e^(−10 ÷ 300)) ÷ 293.15.

**Fill drift, 8 s:** 150 × e^(−5.333) × (1 − e^(−6.667)) = 150 × 0.00483 × 0.9987 = 0.72 mbar, more than twice the limit.

**Fill drift, 12 s:** 150 × e^(−8) × 0.9987 = 0.050 mbar.

**Part drift:** 7,013 × 0.05 × (1 − e^(−0.0333)) ÷ 293.15 = 7,013 × 0.05 × 0.0328 ÷ 293.15 = 0.039 mbar.

**Stabilisation for fill drift below 0.05 mbar:** e^(−t_s ÷ 1.5) ≤ 0.05 ÷ (150 × 0.9987), so t_s ≥ 1.5 × ln(2,996) = 12.0 s.

**Interpretation:** the OC-60 needs at least 12 seconds of stabilisation, four more than the OC-40, which lengthens its cycle to 27 seconds. Together, the two drifts take about 0.09 mbar of the 0.28 mbar limit, a third of it; the remaining margin is enough for a screen whose purpose is catching gross leaks.

**Verification:** the 12-second result, 0.050 mbar, equals the target, as it should for the calculated minimum time.
