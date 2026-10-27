---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: testing-derating-and-the-record
order: 10
title: "Testing, derating and the record"
description: "A heat sink design is finished when a test confirms it. HS-150's test, derating curve and record are set out, with an edge thermocouple that suggested a 175 W rating the sink could not carry."
draft: false
---

Every number in this book so far has been a calculation, and every calculation rests on correlations that real installations depart from by ten or twenty per cent. A heat sink design is finished only when a test on real hardware, set up the way the product will be installed, confirms the budget with a margin. The test also produces the numbers the product's users need: how much power the drive may deliver at each ambient temperature, which is its **derating curve**, and what its own temperature sensor should read in normal service, which turns the drive into a monitor of its own cooling.

This chapter sets out HS-150's thermal test, how to turn its readings into a resistance that can be compared with the calculation, how to build the derating curve, and what belongs in the record. Its failure case is a test thermocouple placed at the edge of the base, where it read cooler than the module sees, and suggested that the drive could be uprated to 175 W when its true limit in 40 °C air was about 156 W.

## Setting up the test

The aim is to measure the temperature rise from the air to the sink's base under the module at a known power, with the sink mounted and oriented as it will be in service. For HS-150 the test uses a production sink, anodised, mounted on a cabinet back panel in a room free of draughts, with its fins vertical and the installation drawing's clearances above and below.

The heat source can be the drive itself, running a load, or a heater block with the module's footprint, mounted with the same grease and torque. A heater block has one great advantage: its power can be measured accurately as voltage times current. A drive's losses must be inferred from the difference between its input and output power, two large numbers whose small difference is uncertain, or from the module maker's loss model. For the sink's resistance, the heater block gives the better measurement; for the junction's temperature in service, the drive's own test, with the maker's loss model, completes the picture.

```figure
type: checklist
title: HS-150's thermal test set-up
caption: This is an illustration of the test procedure. The open item is the comparison with the calculation, closed in the test report.
- x Sink | production extrusion, anodised, on a cabinet back panel, fins vertical
- x Clearances | 100 mm clear above and below; guard fitted as in service
- x Source | heater block, 62 × 108 mm, same grease, stencil and torque as production
- x Power | voltage and current measured at the block, recorded every minute
- x Base temperature | thermocouple in a shallow groove under the block's centre
- x Air temperature | shielded thermocouple 150 mm below the sink's bottom edge, out of its plume
- x Duration | at least 75 minutes, until the base changes by less than 0.5 K in 15 minutes
- *? Comparison | measured resistance against the calculation, with each difference explained
```

Two details matter more than they seem. The air thermocouple must read the air arriving at the sink, not the warm plume leaving it and not the radiation from nearby surfaces, so it is shielded and placed below and to one side. And the test must run long enough. With HS-150's time constant of about 15 minutes (Chapter 9), the base is within about 2 % of its final rise after an hour and within about 0.6 % after 75 minutes. A test stopped at 30 minutes would read only about 87 % of the final rise.

## From readings to a resistance

This is an illustration. With the heater block at 150.0 W in a room at 22.0 °C, the base under the block's centre settles at about 85.7 °C, a rise of about 63.7 K. Dividing by the power gives about 0.425 K/W from the air to the base under the source. The calculation predicts the sink's 0.363 K/W plus the spreading resistance's 0.044 K/W, about 0.407 K/W for the rise to the mean temperature over the source, and about 0.425 K/W to the hottest point under its centre, which is where the thermocouple sits.

A test at 22 °C is not a test at 40 °C, and natural convection's resistance depends slightly on the air's temperature through the air's properties. Running the calculation at 22 °C gives a sink resistance of about 0.359 K/W at 150 W, against 0.363 K/W at 40 °C, a difference of about 1 %. For HS-150 the correction is small, but it should be made explicitly, by calculating the ratio between the test condition and the design condition and applying it to the measurement, so that the report compares like with like.

## The failure case: the thermocouple at the edge

This is an illustration. In the first test, the base thermocouple was fixed to the base's edge, between the outer fins' roots, because drilling a groove under the heater block was inconvenient. It read a rise of about 52.1 K, giving an apparent resistance of about 52.1 ÷ 150 ≈ **0.347 K/W**, better than the calculated 0.363 K/W for the sink alone. The test engineer concluded that the sink performed better than predicted, worked out the junction as 40 + 150 × 0.14 + 52.1 ≈ 113 °C at full load in 40 °C air, a margin of about 12 K, and proposed rating the drive at 175 W.

The edge of the base is the coolest part of it. Chapter 9's two-dimensional model gives, at 150 W, a rise of about 52.1 K at the edge, about 61.3 K averaged over the source and about 63.7 K at the source's centre. The thermocouple had measured the edge accurately; it had not measured what the module sees. Using the mean over the source, the junction at 150 W in 40 °C air is about 122 °C, and the calculated maximum power that keeps it at 125 °C in 40 °C air is about **156 W**. At 175 W the junction would have been about 134 °C.

```figure
type: compare
title: HS-150 at 150 W: where the base thermocouple sits and what it says
cols: Rise above air | Apparent resistance | Junction inferred at 40 °C air
caption: This is an illustration combining the test with the two-dimensional base model of Chapter 9. The module sees the mean over its footprint; its hottest devices see the centre.
- Base edge, between outer fin roots | 52.1 K | 0.347 K/W | about 113 °C
- *Mean over the module footprint | 61.3 K | 0.409 K/W | about 122 °C
- Centre under the module | 63.7 K | 0.425 K/W | about 125 °C
```

The discrepancy was found because the report had to explain why the measured resistance was lower than the calculation, and no one could. A model predicting a resistance higher than a careful test measures is unusual, because real installations usually perform worse than correlations, not better. The repeat test, with the thermocouple in a groove under the source's centre, agreed with the calculation within about 2 %. The proposed uprating was withdrawn. The general lesson is the same rule that governs load thermocouples in a furnace: put the sensor at the point that matters, which here is under the source, and treat a result better than the calculation as a question, not a gift.

## How certain is the measurement?

A test result needs an uncertainty, or it cannot be compared with anything. For HS-150's test, the main contributions are the two thermocouples and the power. If each thermocouple, with its logger channel, is good to about ±0.5 K, the difference between them is uncertain by about √2 × 0.5 ≈ 0.7 K, about 1.1 % of the 63.7 K rise. If the heater's power is known to about ±1 %, the resistance, the ratio of the two, is uncertain by about √(1.1² + 1²) ≈ 1.5 %, about ±0.006 K/W. Agreement between the test and the calculation within about 2 % is therefore as good as the test can show; a difference of 5 % or more is real and needs explaining. Calibrating the thermocouples against each other in a stirred bath before the test, which takes a few minutes, removes much of the thermocouple term.

## Testing the fan-cooled version

The 250 W version's test adds the air path. Beyond the base and inlet air temperatures, it measures the air temperature leaving the channels, averaged across the outlet, and the pressure across the sink and across the filter. The outlet temperature rise gives the air flow actually passing through the channels: at 250 W, a rise of about 10.6 K means about 0.0223 m³/s, and a larger rise means less air, through bypass (Chapter 8) or a weaker fan than its curve. The pressure readings place the operating point on the fan's curve. The test should be repeated with a deliberately restricted filter, a sheet of card over part of its face, to confirm that the design still meets its budget at the loaded-filter resistance it was designed for, and that the filter alarm trips where intended. A fan-cooled design whose test covers only the clean, new condition has not been tested at the condition that will matter.

## The derating curve

A drive's users need to know what it can do at their ambient temperature. The calculation, checked by the test, gives it directly: for each ambient, find the power at which the junction reaches 125 °C. Because natural convection improves as the sink gets hotter, the relationship is not quite linear, and the sweep model of Chapter 6 is the easiest way to solve it.

```figure
type: bars
title: HS-150's maximum continuous power by ambient air temperature, natural convection
unit: W
max: 220
caption: This is an illustration from the natural-convection model with the interface and spreading resistances, for a 125 °C junction limit. The drive is rated 150 W up to 40 °C; the rating published to users rounds the curve down and adds the test's uncertainty.
- 25 °C air | 190
- 30 °C air | 179
- 35 °C air | 167
- *40 °C air | 156
- 45 °C air | 145
- 50 °C air | 134
```

The curve slopes down by about 2.2 W for each kelvin of ambient. The published rating, 150 W up to 40 °C and reducing above it, keeps a few watts of margin below the calculated curve for the test's uncertainty and for production variation. Users installing the drive in hotter places, or at altitude, where the thinner air weakens natural convection, need the curve, not just the headline rating. A label stating the maximum ambient, and the derating instruction in the manual, close the loop that Chapter 1's budget opened.

## The drive as its own monitor

Most drives have a temperature sensor on or near the heat sink, used for protection. The test gives it a second use. In the test, the sensor's reading at known power and ambient can be recorded, and from the calculation, its expected reading at any load and ambient follows. In service, the drive can compare its sensor with that expectation. A reading persistently several kelvin above it, at the same load and ambient, points to a degrading interface (Chapter 2), a blocked or dusty fin field (Chapter 6), a failing fan or loaded filter (Chapter 8), or an installation that is hotter than declared. Catching those drifts as a warning, before they become trips, is one of the cheapest reliability improvements a product can carry.

## The record

The thermal record for HS-150 brings the book together. It contains the budget with its stated worst ambient and junction limit; the interface specification and assembly instruction; the sink's drawing, finish and orientation; the calculations of fin efficiency, natural convection, radiation, spreading and, for the 250 W version, fan and system curves; the test set-up, readings, comparison and corrections; the derating curve; and the expected sensor readings for monitoring. It also lists the conditions that invalidate it: a new device or module, a change of interface material, a different extrusion or finish, a new fan or filter, a new mounting position or orientation, or an installation ambient above the rating. A change to any of these needs the calculation rerun and, if the change is more than small, a new test.

## How this applies to a small Australian business

A thermal test is a few hours with a heater block, a power supply, a logger and four thermocouples, and it is the difference between a design that probably works and one that is known to. The habits that make it trustworthy are short: test as installed, put the base thermocouple under the source, shield the air thermocouple, run for four or five time constants, correct for the test ambient, and explain every difference from the calculation. The derating curve and the expected sensor readings that come out of it are useful to customers and turn the product into a monitor of its own health. Kept with the drawings and the calculations, the record lets the next engineer change the design with confidence instead of starting again.

## Exercise: a hotter test room

The repeat test is run on a summer day with the room at 32 °C. At 150 W, the calculation gives a sink resistance of about 0.361 K/W at 32 °C air, against 0.363 K/W at 40 °C. If the base under the source's centre reads 95.6 °C, find the measured rise and resistance to the source's centre, correct the resistance to 40 °C air, and estimate the junction at 150 W in 40 °C air using the ratio of the mean-over-source rise to the centre rise from the model, 61.3 ÷ 63.7.

**Worked answer.** The measured rise is 95.6 − 32 = **63.6 K**, and the resistance to the source's centre is 63.6 ÷ 150 ≈ **0.424 K/W**. Correcting by the ratio of the calculated sink resistances, 0.363 ÷ 0.361 ≈ 1.006, gives about **0.427 K/W** at 40 °C air. The mean rise over the source is then about 0.427 × 150 × (61.3 ÷ 63.7) ≈ 61.6 K.

The junction at 150 W in 40 °C air is therefore about 40 + 61.6 + 150 × 0.14 ≈ **122.6 °C**, within half a kelvin of the calculated 122.1 °C and inside the 125 °C limit. The test confirms the design. Had it read several kelvin higher, the report would need to find out why before the rating was published.
