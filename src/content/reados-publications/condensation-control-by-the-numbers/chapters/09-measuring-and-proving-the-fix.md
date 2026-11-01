---
book: condensation-control-by-the-numbers
chapterSlug: measuring-humidity-and-proving-the-fix
order: 9
title: "Measuring humidity and proving the fix"
description: "Humidity sensors and their errors, dew point uncertainty, checking a logger against salt solutions, measuring a heater's real performance, and the evidence that shows a fix works."
draft: false
---

Every chapter so far has used numbers that came from somewhere: a dew point from a humidity sensor, a roof temperature from a thermocouple, a heater's effect from a run-hour counter. A condensation fix is only as convincing as those measurements, and humidity measurements are less precise than most people assume. A sensor that has drifted by three percentage points at the top of its range can turn a cabinet that is safely dry into one that sits at the salt threshold of Chapter 8, while the log says all is well.

This chapter covers the measurement side of condensation control: how humidity sensors work and drift, how uncertain a dew point calculated from them is, how to check a logger against saturated salt solutions, how CC-7's heater was measured in place, and what evidence PS-7 now requires before a fix is called finished.

## How humidity sensors work

Most humidity sensors in enclosures and loggers are **capacitive polymer sensors**: a thin polymer film between two electrodes, whose dielectric constant changes as it absorbs water from the air. The sensor's capacitance therefore tracks the relative humidity at the sensor's own temperature, and the electronics convert it to a reading. A temperature sensor sits beside it, so the instrument can report temperature, relative humidity and, usually, a calculated dew point.

Three properties of these sensors matter in condensation work:

- **Accuracy.** A typical maker's specification for a good industrial sensor is around ±2% RH over the middle of the range, often widening near the ends. This book uses ±2% RH and ±0.3 K as illustrative figures.
- **Drift.** The polymer ages, especially when it spends long periods near saturation or is exposed to condensation, solvents or salt. Drift is usually largest at high humidity, exactly where condensation decisions are made.
- **Recovery after wetting.** A sensor that has been covered in condensate reads 100% until it dries, and may read high or low for some time afterwards. A sensor near a cold surface can be wetted when the air around it is not saturated.

Chilled-mirror hygrometers, which measure the dew point directly by cooling a mirror until dew forms on it, are much more accurate and serve as references in calibration laboratories. They are not practical as permanent sensors in a pump station, but a calibrated portable reference is a sound investment for anyone who manages many enclosures.

## How uncertain is a dew point?

A dew point calculated from a temperature and a relative humidity inherits the uncertainty of both. Near saturation at room temperature, Chapter 1 showed that each 1% of RH moves the dew point by about 0.18 K. Each 0.1 K of temperature error at constant RH moves the dew point by roughly the same 0.1 K.

```figure
type: compare
title: Dew point uncertainty from a ±2% RH, ±0.3 K sensor
cols: Dew point | From ±2% RH | From ±0.3 K | Combined
rowhead: Conditions
caption: This is an illustration. The two contributions are combined by root-sum-square, treating the specifications as limits of similar character. A dew point margin smaller than about half a kelvin cannot be confirmed with such a sensor.
- 20 °C, 90% RH (a humid night) | 18.3 °C | ±0.35 K | ±0.30 K | ±0.46 K
- 28 °C, 56% RH (CC-7 heated) | 18.4 °C | ±0.56 K | ±0.28 K | ±0.63 K
```

Two consequences follow. A logged dew point margin needs to be comfortably larger than the dew point uncertainty to mean anything; PS-7 uses 1 K as its minimum. And the margin depends on a surface temperature too, measured by a separate sensor with its own uncertainty, which adds to the total. Surface thermocouples have their own pitfalls, especially on thin sheet in moving air, which are set out in [Calibration and the uncertainty budget](/reados/publications/contact-temperature-sensors-by-the-numbers/calibration-and-the-uncertainty-budget/) in *Contact Temperature Sensors by the Numbers*.

## Checking a logger against salt solutions

Saturated salt solutions provide stable, reproducible humidities that need no electronics. A small sealed chamber containing a slurry of a salt and water settles to the salt's equilibrium humidity, which Greenspan measured precisely. At 25 °C, lithium chloride holds **11.30%**, magnesium chloride **32.78%**, magnesium nitrate **52.89%** and sodium chloride **75.29%**. Commercial calibration cells use the same principle. Each point takes hours to stabilise and the temperature must be steady, but the method is simple and cheap enough to use in a workshop.

This is an illustration. At the end of CC-7's first year, the utility checked its humidity transmitter against four salt cells and, for the top of the range, against a portable reference hygrometer in a small humidity chamber at 92.0%.

```figure
type: compare
title: CC-7's humidity transmitter against its references
cols: Reference | Transmitter | Error
rowhead: Point
caption: This is an illustration. Against a class of ±2% of span, the transmitter fails at the two highest points. It reads low, and the error grows with humidity, which is the direction that hides risk.
- Lithium chloride | 11.30% | 10.6% | −0.70
- Magnesium chloride | 32.78% | 31.5% | −1.28
- Magnesium nitrate | 52.89% | 51.0% | −1.89
- *Sodium chloride | 75.29% | 72.9% | −2.39
- *Reference hygrometer | 92.0% | 89.1% | −2.90
```

The [instrument calibration check tool](/tools/instrument-calibration-check/) takes five reference values and readings, works out each error and its share of the span, compares the worst against an accuracy class, and corrects an in-service reading by interpolating between the two calibration points that bracket it. Entered with a range of 0 to 100%, a class of 2% and the five pairs above, it flags the two upper points as outside the class. For an in-service reading of 63%, it interpolates between the magnesium nitrate and sodium chloride points to a true value of about **65.2%**, and a reading of 72.9% corresponds to a true 75.3%.

## The error: a transmitter that read low

The calibration explained a puzzle. Through the second half of the first year, CC-7's monthly reports had shown no hours above 75% RH inside, as targeted in Chapter 8, yet the steel coupon exposed over the same months had corroded about twice as fast as the coupon from the season before. Either the coupon was wrong or the humidity was.

The calibration showed it was the humidity. Near the top of the range the transmitter read about 2.4 to 2.9 percentage points low. When it reported 73%, the cabinet was really at about 75%, on the sodium chloride threshold, and the hygrostat function, which used the same transmitter, was switching the heater on at what it believed was 65% but was really about 67%. The cabinet had spent many hours just above the salt threshold that the monthly report said it never reached.

The utility made three changes:

- The transmitter was replaced, and transmitters are now checked against salt cells every year, with a check at the 75% point at least every six months on coastal sites.
- A second, independent humidity sensor was fitted, and the two readings are compared automatically. A difference of more than 3% raises an alarm.
- Coupons were kept as an independent check, because they measure the outcome rather than a condition, and they would catch a drift in both sensors at once.

## Measuring the heater in place

Chapter 5 sized CC-7's heater with a maker's rule that doubles the wall loss for outdoor enclosures. After commissioning, the utility measured what the heater actually achieved, which turns the rule into a measured property of this cabinet.

This is an illustration. On a cold, clear, still winter night, the heater was forced on continuously with the pump stopped, so that the only heat sources were the 250 W heater and the 30 W standby load. Once the cabinet had settled, about two hours later, its inside air averaged **9.6 K** above the outside air. Its effective heat-loss conductance was therefore 280 ÷ 9.6 ≈ **29.2 W/K**, between the indoor coefficient's 17.6 W/K and the outdoor allowance's 35.2 W/K.

```figure
type: stats
title: CC-7's heater, measured in its first year
caption: This is an illustration. The measured conductance lies inside the range assumed at design, so the 250 W heater holds its 8 K lift using about 203 W of its 250 W, nearly a fifth to spare on the coldest clear nights.
- 29.2 W/K | effective heat-loss conductance, measured
- 9.6 K | lift with the heater forced on
- 203 W | average heater power at an 8 K lift
- 484 kWh | first year's heater energy, 2,380 logged hours, about A$160 including GST
```

At an 8 K lift the heater needs 29.2 × 8 − 30 ≈ **203 W** on average while it runs. The telemetry logged **2,380** heater hours in the first year, so the heater used about 0.203 × 2,380 ≈ **484 kWh**, inside the 277 to 629 kWh range estimated in Chapter 5, at about A$160 including GST at the assumed A$0.33/kWh.

## Where to put the sensors

A good sensor in the wrong place gives a precise answer to the wrong question. CC-7's logging points were chosen to answer the questions the earlier chapters raised.

- **Inside air.** One humidity and temperature sensor at mid-height on the side wall, away from the heater's plume, the drive's exhaust and the door. A sensor directly above the heater reads warm, dry air and makes the cabinet look better than it is.
- **A second inside sensor.** At a different height, so that the two can be compared and a stratified cabinet noticed as well as a drifting sensor.
- **Outside air.** A sensor in a ventilated radiation shield of the kind used for weather stations, mounted in shade at about cabinet height. An unshielded outdoor sensor reads high in sunshine and low on clear nights, for the same radiation reasons that cool the roof.
- **Coldest surfaces.** Fine thermocouples bonded to the inner face of the roof at its centre and to the gland plate, each covered with a small pad of insulating tape so that it reads the metal rather than the air.
- **Equipment status.** Heater and fan contactor states, the drive's run signal and the door switch, so that every humidity event can be matched to what was happening.

A ten-minute logging interval is enough to resolve the nightly cycle and short enough to catch a door left open. Everything is stored with the time in one time zone, which sounds trivial until a daylight-saving change makes the heater appear to run at the wrong hour.

## Reading a week of data

Once the points are logged, a week of data on one chart, with the inside and outside dew points, the roof and gland plate temperatures and the run states, answers most questions at a glance. The patterns the earlier chapters described each have a recognisable signature:

- **An open path to a wetter space** shows as an inside dew point above the outside dew point, often steady through the night. That was the pit in Chapter 3.
- **Free air exchange** shows as inside and outside dew points lying on top of each other, as in Chapter 1's first logs.
- **Sky cooling** shows as the roof temperature dropping several kelvin below the inside air on some nights and not others, the clear ones.
- **A heater that is not running** shows as high inside humidity at night with no heater run time, as in Chapter 5.
- **A fan that runs when it should not** shows as inside air following outside air at night, as in Chapter 4.
- **A drifting sensor** shows as a growing gap between two inside sensors, or as wet-hour counts that disagree with the coupons.

Reading the data this way takes minutes a week once the chart exists, and it catches most faults long before they leave water on a drive.

## What counts as proof

A condensation problem is easy to declare fixed, because water tends to disappear for a while after any change, and the next humid spell is weeks away. PS-7 now requires the same evidence for every fix, collected over at least one humid season.

```figure
type: steps
title: Evidence that a condensation fix works
caption: This is an illustration of the utility's procedure. Each item measures something different, so a fault in one is caught by another.
- Inside and outside dew points logged | inside tracks outside, or sits below it, never above it (Chapter 3)
- Surface temperatures logged at the coldest points | roof and gland plate at least 1 K above the inside dew point (Chapters 2 and 5)
- Wet hours counted monthly | no hours above 75% RH inside on a coastal site (Chapter 8)
- Heater and fan run hours logged | heater runs on humid nights, fan only on hot days (Chapters 4 and 5)
- * Sensors checked against references | salt cells yearly, a second sensor compared continuously
- Coupons exposed each season | corrosion rate inside well below outside, and steady from season to season
```

None of these needs expensive equipment. A few thermocouples, a calibrated humidity transmitter, a second sensor, run-hour logging and a set of coupons cover them all. What they need is the decision to collect them before the fix rather than after the next failure, and to read them against criteria set in advance.

## A specification for the next cabinet

The utility now writes the lessons of PS-7 into the specification for every new outdoor cabinet, as numbers rather than intentions:

- the design humid night (air temperature, dew point and a clear sky) and the design hot day, stated for the site;
- every conduit sealed at both ends, and every gland matched to its cable;
- a canopy over the roof and a drain at the lowest point;
- ventilation sized for the hot day, on a thermostat, interlocked with the heater;
- a fan heater sized for an 8 K lift with the outdoor allowance, on a hygrostat set at 65% on and 55% off, with a safety thermostat;
- logging of the points listed above, with a second inside humidity sensor;
- a measured heater lift at commissioning, and coupons inside and outside in the first humid season.

None of these items is expensive, and together they cost a small fraction of one failed drive. The specification also records why each setting was chosen, so that the next person who wants to save a little energy by raising the hygrostat can read about the salt threshold first.

## Exercise: is the roof margin real?

On a humid summer night, CC-7's log shows inside air at 28.0 °C and 56% RH, and a roof inner surface temperature of 20.9 °C from a thermocouple with an uncertainty of ±0.5 K. The humidity transmitter is the new one, specified at ±2% RH and ±0.3 K. Is the roof's dew point margin of at least 1 K confirmed?

**Worked answer.** The inside dew point at 28.0 °C and 56% RH is **18.4 °C**, with an uncertainty of about ±0.63 K from the transmitter, as in the figure. The measured margin is 20.9 − 18.4 = **2.5 K**. Combining the dew point uncertainty with the thermocouple's ±0.5 K by root-sum-square gives about ±0.8 K on the margin. The margin is therefore at least about 2.5 − 0.8 = **1.7 K**, so the 1 K requirement is met with confidence. Had the measured margin been 1.5 K, the same uncertainty would have left the lower bound at 0.7 K, and the requirement would not have been confirmed even though the logged value appeared to meet it.
