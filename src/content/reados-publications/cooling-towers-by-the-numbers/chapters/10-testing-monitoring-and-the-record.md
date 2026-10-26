---
book: cooling-towers-by-the-numbers
chapterSlug: testing-monitoring-and-the-record
order: 10
title: "Testing, monitoring and the tower's record"
description: "Prove and track a tower's performance: the capability test and its conditions, routine monitoring against the model, inspections and the record, and catch a mild-day test that passed a 93% tower."
draft: false
---

A tower is bought to deliver a stated cold water temperature at a stated load and wet-bulb, and the only proof that it does is a measurement. But a tower's performance depends on the weather, the load and the flow on the day it is measured, so a single reading of the cold water says little until it is compared with what the tower should have achieved under those exact conditions. The **capability test** does that comparison formally; routine monitoring does it informally every month. Both use the same idea as Chapter 4's model: predict, measure and compare.

This chapter explains the capability test and the conditions and instruments it needs, sets out a routine monitoring regime using the tower model, lists the inspections that keep performance and health under control, and gathers the tower's record. The running case finds that CT-250's first acceptance check, made on a mild, lightly loaded day with uncalibrated sensors, appeared to show the tower at about 100% of its rated capability, when a proper test near the design conditions found it at about 93%, below its guarantee.

## Capability

A tower's **capability** is the ratio, in per cent, of the water flow it actually cools to the flow its maker's performance data say it should cool, at the measured wet-bulb, range and cold water, with the fan at its rated power. A tower at 100% performs exactly as its maker claimed; one at 90% would need about 10% more tower to do what was promised.

```figure
type: formula
title: Tower capability from a test
formula: capability ≈ (test water flow ÷ predicted water flow) × 100%, where the predicted flow is the flow the maker's data give for the measured wet-bulb, range and cold water
caption: This is an illustration using CT-250's model as a stand-in for the maker's performance curves. Acceptance test codes, such as CTI ATC-105, set the measurements, the allowable test conditions and the corrections, including for fan power.
- Test water flow | Measured circulating flow during the test, kg/s
- Predicted water flow | Flow the tower should cool at the test's wet-bulb, range and cold water, from the maker's curves
step: Test near design: wet-bulb 23 °C, flow 11.96 kg/s, range 4.79 K, measured cold water 28.44 °C
step: The design curves would deliver 28.44 °C at that range and wet-bulb with about 12.8 kg/s
step: Capability ≈ 11.96 ÷ 12.8 ≈ 93%
```

Capability is expressed as a flow ratio because flow is what a buyer pays for: a tower at 93% capability needs about 7% less water through it, or about 7% more tower, to meet the guaranteed cold water.

## Test conditions and instruments

Because the prediction depends strongly on the measured temperatures, a capability test is only as good as its measurements and its conditions. Acceptance test codes, such as the Cooling Technology Institute's ATC-105, set out what is needed: calibrated instruments for the hot and cold water temperatures, the inlet wet-bulb and the flow; measurement of the wet-bulb at the tower's inlets, not upwind, for the reasons Chapter 9 gave; the fan's power measured, because capability is stated at rated fan power; steady conditions for a stated period; and limits on how far the test's wet-bulb, range, load and flow may differ from the design values for the test to be valid. A test outside those limits is not a test of the guarantee.

## The running case: the first acceptance check

This is an illustration. CT-250 was commissioned in late autumn. To close out the contract, the installer made an acceptance check on a mild day at a 16 °C wet-bulb, with the plant on a single shift rejecting about 100 kW, a range of only about 2 K, using the plant's own permanently installed temperature sensors, which had not been calibrated. The check calculated a capability of about 100%, and the contract was nearly signed off.

## The error: a valid-looking number from an invalid test

The light-load check had two weaknesses. The plant's cold-water sensor was later found to read about 0.2 K low; at a range of only 2 K, that small error moved the calculated capability by about six percentage points, from a true value of about 94% to an apparent 100%. And the test conditions, a range of 2 K and a wet-bulb 8 K below design, were far outside the limits an acceptance code allows, so even with perfect sensors the result would not have tested the guarantee, which applies at design conditions.

```figure
type: bars
title: CT-250's capability by test, %
unit: %
max: 105
caption: This is an illustration from the tower model. At light load, a 0.2 K error in the cold-water reading moves the result by about six percentage points; near design, with calibrated instruments, the tower tested at about 93%.
- Light-load check, sensor reading 0.2 K low | 99.7
- Light-load check, true value | 93.8
- *Proper test near design, calibrated instruments | 93.4
```

The plant's engineer, aware that a mild-day check could not test a summer guarantee, asked for a proper test in summer. In January, with the plant near full load, a wet-bulb of about 23 °C and calibrated instruments, the tower tested at about **93%** capability, below the maker's guarantee. The maker inspected the tower, found part of the fill poorly seated and several spray nozzles blocked by construction debris, rectified them, and a retest met the guarantee. The general lesson is that a capability test must be made near design conditions, with calibrated instruments placed as the code requires, and that a favourable number from an easy test is not evidence of anything.

## When a test falls short

A capability below the guarantee is a contractual matter, and the contract should already say what happens. The usual sequence is that the maker inspects the tower for installation faults, such as unseated fill, blocked nozzles, air leaks or a fan running off its rated pitch, rectifies them and retests; if the tower still falls short, the contract's remedy applies, which may be additional fill or cells, a larger fan, or a price adjustment reflecting the shortfall. The test report should record the measured conditions, the instruments and their calibration, the data and the calculation, so that the maker can check the result and both parties can agree it. For CT-250, the first test's report showed every measurement and its correction, which is why the maker accepted the 93% result and went looking for the cause instead of disputing the test. A test whose method was agreed before the tower was bought is rarely disputed after; a test improvised after delivery often is, and the plant can find itself arguing about the instruments instead of the tower.

## Routine monitoring

Between formal tests, the tower model of Chapter 4 makes routine monitoring easy. Each month, the plant records the inlet wet-bulb, the hot and cold water temperatures, the flow and the fan speed, and compares the measured cold water with the model's prediction for those conditions. A gap that grows over months shows the tower losing capability, and the size of the gap shows how much.

```figure
type: checklist
title: CT-250's monthly performance and condition checks
caption: This is an illustration of a plant's own routine, alongside the water treatment and Legionella requirements of Chapters 6 and 7, which set their own frequencies.
- Performance | Measured cold water against the model at the measured wet-bulb, load and fan speed
- Water distribution | Spray nozzles clear; no dry patches on the fill; basin level steady
- Fill | No visible scale, biofilm, sagging or collapse
- Drift eliminators | Intact, correctly seated, clean
- Fan and drive | Vibration, noise, gearbox oil, drive in automatic
- Casing and inlets | No leaks, debris or new obstructions at the inlets
- x Cold water judged against a fixed number regardless of weather | Hides losses on mild days and alarms on hot ones
```

Judging the tower against a fixed cold-water number is the common mistake: on a mild day the tower will meet 29 °C even with half its fill blocked, and on a humid summer day it may miss 29 °C while performing perfectly. Only the comparison with the model at the day's conditions separates the tower's condition from the weather, and it takes a few minutes with a spreadsheet once the model is set up.

## What a loss of capability means

A loss found by monitoring has a small number of usual causes, each with its signs: blocked spray nozzles, which leave dry patches on the fill; scaled or fouled fill, which shows as deposits and, often, as rising fill weight; damaged or displaced fill; air bypassing the fill through gaps in the casing or the fill pack; a fan running below its rated speed or with blades at the wrong pitch; and recirculation from a changed surrounding, as Chapter 9 warned. The water treatment results of Chapter 6 often point to the cause: a period of high cycles or poor biocide control precedes fill fouling by weeks or months.

## Planning a test

A capability test is best planned when the tower is bought, not when it is finished. The purchase contract should name the test code, the guarantee point it tests, the party who performs the test, often an independent licensed test agent, the tolerance and the remedy if the tower falls short. The plant must be able to provide the conditions: a heat load near the design value and a wet-bulb within the code's limits, which in most Australian climates means a summer test, scheduled when production will be near full load. Test connections should be designed in: thermowells for calibrated probes at the hot and cold water points, a straight run of pipe for a flow measurement, access to measure the inlet wet-bulb around the tower and a way to measure the fan's power. A tower whose test cannot be performed because its connections were never provided has a guarantee that can never be enforced.

## Instruments worth fitting permanently

The same points serve routine monitoring if they are fitted permanently: temperature sensors in thermowells that allow a calibrated reference probe to be inserted beside them for checking; a flowmeter on the circulating water; an inlet wet-bulb sensor sited at the inlets, as Chapter 9 explained; and the fan drive's own energy and speed signals. Logged by the plant's control system, they give the monthly comparison of this chapter automatically, and they turn the tower's record from a set of annual reports into a continuous trend. The cost is small beside the tower's, and much smaller than a summer of hot oil and a chiller running inefficiently.

## Inspections for performance and health together

Many inspections serve both performance and health. A dry patch on the fill from a blocked nozzle loses capacity and also leaves surfaces that wet and dry, encouraging biofilm; scale on the fill loses transfer and shelters bacteria; damaged eliminators increase drift, which is both water loss and a health hazard; and debris in the basin is both a fouling source and a nutrient for microbial growth. Combining the performance checks of this chapter with the inspections that the risk management plan of Chapter 7 requires means each visit looks at the tower once, with both purposes in mind, and records both.

## Using the record when the tower is replaced

Towers last decades, but they are eventually replaced, and the record is the best basis for the replacement's specification. Years of measured loads show the plant's real peak and its diversity, which Chapter 3 said should be shown rather than assumed; years of capability results show how the tower aged and what kind of fill suited the water; and years of water and energy readings show what the cycles and the fan control achieved. A replacement specified from that record is sized for the plant as it actually runs, with the water quality and maintenance it actually gets, instead of being copied from the old tower's nameplate.

## The tower's record

Every chapter of this book adds to one record for CT-250. In this book's illustrations, it reads:

- **Duty**: 250 kW, about 12 L/s from 34 °C to 29 °C at a design wet-bulb of 24 °C, with the load list and the future third press shown separately.
- **Performance**: Merkel number about 0.90 at the design point; characteristic constant about 1.00 at an exponent of 0.6; retested capability meeting the guarantee.
- **Water**: target 4 cycles under conductivity control; makeup about 0.5 m³/h at full load; meters on makeup and bleed read weekly.
- **Treatment and health**: the treatment programme and provider's reports; the risk management plan, shutdown and start-up procedure, monthly reports and test results, as the jurisdiction requires.
- **Fans and energy**: variable-speed control from the cold water; set point and limits; drive energy read monthly.
- **Site**: open roof position, clearances, inlet wet-bulb test results, the air intakes and neighbours considered.

Each line is checkable and points to the chapter that explains it. A record kept this way lets the next engineer, auditor or health officer see in a few minutes how the tower is meant to work and whether it does, and it outlasts the people who wrote it.

## Exercise: a monthly comparison

On a February afternoon, CT-250 runs at about 220 kW with the full design flow, a range of about 4.4 K, at a 22 °C wet-bulb with the fan at full speed, and its cold water reads 28.4 °C. The model predicts about 27.1 °C for those conditions. What does the gap mean, and what should be checked first?

**Worked answer.** The tower is delivering water about **1.3 K** warmer than a tower in its design condition would at the same load, flow, fan speed and wet-bulb. The weather has been accounted for, so the gap is a loss of the tower's own capability, a substantial one, comparable to the courtyard site's penalty in Chapter 9.

The first checks are the quick ones: the inlet wet-bulb measured at the inlets rather than upwind, to rule out recirculation; the spray distribution, looking for blocked nozzles and dry fill; and the water treatment log, looking for a recent period of high cycles or low biocide that would explain fouled fill. A gap found in one month and confirmed the next is a reason to inspect the fill closely before summer, when the tower needs every kelvin it can deliver and the plant can least afford a shutdown to clean it.
