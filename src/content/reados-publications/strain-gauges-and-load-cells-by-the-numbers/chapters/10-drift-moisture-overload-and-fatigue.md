---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: drift-moisture-overload-and-fatigue
order: 10
title: "Drift, moisture, overload and fatigue"
description: "How to keep a weighing system honest between calibrations: daily checks on an EWMA chart, insulation and bridge tests, overload and welding damage, and a fatigue check of the cell."
draft: false
---

A weighing system that was calibrated correctly last year can be wrong today without anyone noticing, because it fails gently. A load cell does not usually stop working; it drifts. Moisture creeps in and shifts the zero by a kilogram, then two. A check bolt starts to touch. A gland cracks. A welder earths through the hopper. Each fault produces a reading that looks perfectly normal, just slightly wrong, and a batching program will keep filling to a wrong reading for as long as nobody checks it.

This final chapter sets out how the mill keeps BH-2 honest between calibrations. It describes the daily check with test weights and how an EWMA chart catches slow drift days before a simple pass band does, the electrical tests that find a failing cell, the damage done by overload, welding and lightning, and a fatigue check of the spring element under 57,600 batches a year. It ends with an exercise on the chart's sensitivity.

## The daily check

Each morning, before the first batch, the shift operator checks BH-2 with the 500 kg of test weights: confirm the empty hopper is clean, record the empty reading, hang the weights, record the reading, remove the weights, and confirm the return to the empty reading. The reading with the weights is taken without re-zeroing, so it reflects both the zero and the span: drift in either shows up.

For years the check had a simple rule: pass if the reading is within 500 ± 2 kg. The rule caught gross faults but nothing gradual, and it said nothing about whether the scale was changing. The mill now charts the readings. From the Type 1 study in Chapter 9 the repeatability is 0.25 kg, so the usual chart for individual readings has limits at 500 ± 3 × 0.25 kg, 499.25 to 500.75 kg. That chart signals a sudden change well, but a slow drift has to travel the whole three standard deviations before any single reading crosses a limit.

## An EWMA chart for drift

An exponentially weighted moving average (EWMA) chart is built for slow drift. Each point is a weighted average of the latest reading and the previous point, so recent readings count most and old ones fade gradually. Because the average smooths out the scatter, its control limits can sit much closer to the target, and a sustained small shift pushes the average over a limit long before individual readings do.

The [EWMA control chart check tool](/tools/ewma-chart-check/) works through up to twenty readings in time order from a target, a historical standard deviation, a weighting factor λ and a limit width in standard deviations. It returns the EWMA after each reading, the standard deviation of the EWMA, the control limits, the final EWMA and the first reading at which the EWMA leaves the limits. The Library's [Control Charts by the Numbers](/reados/publications/control-charts-by-the-numbers/) explains how the weighting factor trades sensitivity to small shifts against false alarms.

```figure
type: formula
title: The EWMA statistic and its limits
formula: z_t = λ × x_t + (1 − λ) × z_(t−1), with z_0 = target
formula: σ_z = σ × √(λ ÷ (2 − λ))
formula: limits = target ± L × σ_z
caption: x_t is the reading on day t, z_t the EWMA, λ the weighting factor between 0 and 1, σ the historical standard deviation of single readings and L the limit width. With σ = 0.25 kg, λ = 0.2 and L = 3, σ_z = 0.083 kg and the limits are 499.75 and 500.25 kg, a third of the width of the individuals chart's limits.
- λ | weight on the latest reading
- σ_z | standard deviation of the EWMA
- L | limit width, standard deviations
```

## When it goes wrong: twenty mornings

Last winter the daily readings looked unremarkable for weeks. Every one passed the old ±2 kg rule, and none crossed the individuals chart's upper limit until day 17. The EWMA told a different story.

```figure
type: compare
title: Twenty daily checks of BH-2 with 500 kg of test weights
cols: Reading | EWMA, λ = 0.2 | EWMA status | Individuals chart
rowhead: Day
- 1–10 | 499.7 to 500.3 | 499.95 to 500.04 | In control | In control
- 11 | 500.3 | 500.07 | In control | In control
- 12 | 500.2 | 500.09 | In control | In control
- 13 | 500.5 | 500.18 | In control | In control
- 14 | 500.4 | 500.22 | In control | In control
- * 15 | 500.6 | 500.30 | Above the 500.25 limit | In control
- 17 | 500.8 | 500.43 | Above | Above the 500.75 limit
- 19 | 501.0 | 500.59 | Above | Above
- 20 | 500.9 | 500.65 | Above | Above
caption: This is an illustration. EWMA from the EWMA control chart check tool with target 500 kg, σ = 0.25 kg, λ = 0.2 and L = 3. The EWMA signalled on day 15 and the individuals chart on day 17; the old ±2 kg pass band never signalled at all.
```

On day 15 the EWMA crossed its upper limit, and the instrument technician started looking. The empty reading had crept up by about the same amount as the weighed reading, which pointed at the zero rather than the span, and so at something electrical rather than mechanical. With the cells disconnected one at a time at the junction box, the drift followed cell 2. Its insulation resistance between the conductors and the body was about 300 MΩ, against several thousand megohms for the other two cells and at the last annual test.

Chapter 2 showed that a leakage path across one 350 Ω gauge shifts the reading by R ÷ (GF × R_leak) in strain: at 300 MΩ, 0.58 µε, which on these cells is 1.2 kg. That matched the drift. A crack in cell 2's cable gland had been letting condensation in each cold night. The cell was replaced, the junction box re-trimmed with a corner test, and the span checked with the substitution test. Caught on day 15, the fault cost a cell; caught at failure, it would also have cost weeks of batches made to a drifting scale.

## What to do when the chart signals

A chart is only useful if a signal leads to action, and the action should be decided before the signal arrives, not argued about at six in the morning with the mixer waiting. The mill's response plan for BH-2 is short.

1. **Repeat the check.** Remove and rehang the weights, and confirm the reading. A single odd reading may be a weight caught on a hanger or a person leaning on the handrail.
2. **Separate zero from span.** Compare the empty reading with the previous days'. If the empty reading has moved by about as much as the weighed reading, suspect the zero: moisture, a cell, the junction box or something resting on the hopper. If the empty reading is steady and only the weighed reading has moved, suspect the span: a connection carrying load, a mount binding, or the electronics.
3. **Look before measuring.** Walk around the hopper: sleeves, check bolts, cables, build-up of meal on the lugs or mounts, anything new nearby.
4. **Decide whether batching may continue.** If the drift is small against the batch tolerance, as it was here, production may continue while the fault is found, with the decision and the size of the error recorded. If it is large, batching stops.
5. **Fix the cause, then recalibrate if anything was disturbed.** Never adjust the span to bring the check weight back to 500 kg without finding why it moved (Chapter 8).

The EWMA is reset to the target after the fault is fixed and the scale is confirmed correct, because it carries the memory of the fault in its average otherwise. The individual readings are kept, so that the episode can be seen later in the long-term record.

Finally, the daily check records are reviewed at each annual calibration. A scale that has run a whole year with its EWMA well inside its limits supports keeping the calibration interval; a year with several signals suggests a recurring cause, such as a gland design or a draught, that is worth removing for good.

## Electrical checks on a load cell

Two simple measurements, made at installation and repeated whenever a cell is suspect, find most electrical faults. Both are made with the cell disconnected from the junction box, so that the indicator and the other cells do not confuse the readings.

**Bridge resistances.** With an accurate multimeter, measure the resistance between the two excitation leads (the input resistance), between the two signal leads (the output resistance), and from each signal lead to each excitation lead. Compare them with the values recorded at installation and with the datasheet. An open or shorted gauge or a broken lead shows as a large change; the four signal-to-excitation readings should be nearly equal in pairs, and a difference between them points to one damaged arm.

**Zero output.** With the cell unloaded and excited, measure its output in mV/V and compare it with the zero balance on its certificate. A cell that has been overloaded has usually taken a permanent set in its spring element, which appears as a zero that has moved far outside its certified band, often by several per cent of rated output. Such a cell may still be linear and repeatable, but it has been stressed beyond its design and should be replaced.

**Insulation resistance.** Join all the cell's conductors together and measure their resistance to the cell's body with an insulation tester at the low test voltage the cell maker specifies. Load cells use thin insulation, and the high voltages used for motor windings can destroy them, so the maker's limit must be followed. A healthy, dry cell reads thousands of megohms. A value that has fallen since the last test, even if still high, is a warning: moisture is getting in.

```figure
type: checklist
title: BH-2's cell records, kept for each cell
caption: This is an illustration of the mill's record; the cell maker's manual sets the test methods and limits.
- x Certificate values: rated output, zero balance, input and output resistances
- x As-installed values of the same, with the date
- x Insulation resistance at installation and at each annual test, with the test voltage
- x Corner test and calibration results after any change
- x Repairs, gland replacements and any welding or lightning events near the hopper
- ? Trend of insulation resistance reviewed at each annual calibration
```

## Overload, welding and lightning

Load cells are robust within their ratings and fragile outside them. A 2,000 kg cell with a 150% safe overload takes 3,000 kg without harm, but a bulk bag dropped from a forklift onto a platform scale, or a hopper allowed to fall onto its cells during maintenance, can exceed its ultimate overload in an instant, because an impact load depends on how quickly the falling mass is stopped, and a stiff cell stops it very quickly. Overload stops, which take the load once the cell has deflected a little more than its rated amount, are the usual protection on platforms; on hoppers the protection is procedure: jack the vessel off its cells before working on its supports.

Welding current and lightning damage cells in a different way, by passing current through the gauges or their insulation. A welder earthing through a hopper can pass hundreds of amperes through a cell, burning the gauge grids or the fine leads. Chapter 7 described the precautions: disconnect and bypass, or clamp the return so the current cannot pass through the cells, and fit earth straps across every mount. A cell that has carried such current may still read, but its insulation is often damaged and it drifts.

## Fatigue of the spring element

Every batch loads BH-2's cells from the empty hopper's weight to the full batch and back. At about 12 batches an hour, 16 hours a day and 300 days a year, that is 57,600 cycles a year, 576,000 in ten years. Chapter 5 found that the web of each cell carries 161.5 MPa of shear stress at its rated 2,000 kg, so the stress per kilogram on a cell is 0.0808 MPa.

```figure
type: steps
title: Stress cycle in a BH-2 cell's web, empty to full batch
caption: This is an illustration. Loads per cell from Chapter 7 with the batch centred. The shear stresses are converted to equivalent normal stresses by the von Mises factor √3, an approximation for applying normal-stress fatigue criteria to pure shear.
- Empty hopper, 383.3 kg per cell | τ = 31.0 MPa
- Full batch, 1,216.7 kg per cell | τ = 98.2 MPa
- Alternating shear, (98.2 − 31.0) ÷ 2 | 33.6 MPa
- Mean shear, (98.2 + 31.0) ÷ 2 | 64.6 MPa
- * Equivalent alternating and mean normal stress, × √3 | 58.3 and 111.9 MPa
```

The [Goodman fatigue safety factor tool](/tools/goodman-fatigue/) gives the fatigue safety factors for combined alternating and mean stress by the modified Goodman, Soderberg and Gerber criteria, and the first-cycle yield factor, from the alternating and mean stress, a corrected endurance limit, the ultimate and yield strengths and a required factor. With an assumed corrected endurance limit of 380 MPa, an ultimate strength of 1,100 MPa and a yield strength of 950 MPa for the cell's heat-treated alloy steel, it gives a Goodman factor of 3.92 and a first-cycle yield factor of 5.58, so the Goodman factor governs, comfortably above the required 2.

```figure
type: compare
title: Fatigue safety factors for a BH-2 cell's web
cols: Safety factor | Against required 2.0
rowhead: Criterion
- * Modified Goodman | 3.92 | Pass, governs
- Soderberg | 3.69 | Pass
- Gerber | 4.90 | Pass
- First-cycle yield | 5.58 | Pass
caption: This is an illustration. Goodman fatigue safety factor tool with σa = 58.3 MPa, σm = 111.9 MPa, Se = 380 MPa, Su = 1,100 MPa and Sy = 950 MPa. The endurance limit already includes assumed surface, size and reliability factors; the cell maker's own fatigue rating, where given, takes precedence.
```

Load cell makers design for this. Many datasheets state a fatigue rating, for example a number of cycles at a stated share of rated load, and cells for repetitive batching are chosen so that the normal cycle is well inside it. The hopper itself is another matter: its lugs and their welds see the same 576,000 cycles, with the stress range from the Chapter 6 rosette. Welded details have no true endurance limit, and their fatigue strength depends on the weld's detail and quality, so the mill's engineer checked them against the welded-joint fatigue method in the Library's [Metal Fatigue by the Numbers](/reados/publications/metal-fatigue-by-the-numbers/). Fatigue cracks in hopper lugs are found by inspection, not by the scale, which goes on reading perfectly until the lug fails.

## Exercise: a slower EWMA

The mill considers a weighting factor of 0.1 instead of 0.2 for the daily chart, with the same target of 500 kg, σ = 0.25 kg and L = 3.

1. What are the EWMA's standard deviation and control limits?
2. Using the same twenty readings, on which day does the EWMA first signal?
3. What is the trade-off?

**Answer.**

1. σ_z = 0.25 × √(0.1 ÷ 1.9) = 0.057 kg, so the limits are 499.83 and 500.17 kg.
2. The [EWMA control chart check tool](/tools/ewma-chart-check/) with λ = 0.1 shows the EWMA at 500.127 on day 14 and 500.175 on day 15, just above the 500.172 limit, so it also first signals on day 15, with the EWMA at 500.43 by day 20 against 500.65 with λ = 0.2.
3. A smaller λ averages over more days, so its limits are tighter and it is more sensitive to very small, sustained shifts, but it reacts more slowly to a sudden change and remembers an old disturbance for longer. For this drift both settings signal on the same day. The mill kept λ = 0.2, because a sudden fault, such as a check bolt touching, should also show within a day or two, and kept the individuals chart beside it for exactly those sudden changes.
