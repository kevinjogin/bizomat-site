---
book: industrial-electric-heating-by-the-numbers
chapterSlug: controlling-electric-heat
order: 9
title: "Controlling electric heat"
description: "Hold an oven at temperature with on/off, time-proportioning and PID control, keep an independent over-temperature limit, and stage heaters to limit peak demand."
draft: false
---

Heaters are sized with power to spare: enough to warm the oven from cold and recover quickly after each door opening. Left on continuously, that spare power would drive the oven far above its set temperature. A controller's job is to deliver, on average, exactly the power the oven needs at each moment, no more and no less, so that the temperature stays where the process wants it. How it does that affects temperature accuracy, the life of the elements and switching devices, and even the electricity bill.

This chapter looks at on/off, time-proportioning and PID control, explains why every oven needs an independent over-temperature limit, shows how staging heaters limits peak demand, and works through a failure that the limit controller caught.

## The controller's task

The curing oven has 60 kW of heaters and, once warm and running, needs about 35.8 kW on average (Chapter 6). The controller must therefore run the heaters at about 60% of their power on average, more just after a cold batch enters, less when the load has reached temperature, and at full power during warm-up. Since electric heaters respond almost instantly to their supply being switched, the control problem is mainly one of deciding how much of the time, or how much of the power, to apply.

## On/off control

The simplest controller switches all the heaters on when the temperature falls below the set point and off when it rises above it, with a small band, the hysteresis, between the two to stop it chattering. It is cheap and reliable, but the temperature oscillates. Heat takes time to travel from the elements, through the air and to the sensor, so the oven overshoots after the heaters switch off and undershoots after they switch on. The size of the swing depends on how much spare power there is and how slowly the oven responds. For a coarse process, such as keeping a tank of oil fluid, on/off control is often good enough; for a cure schedule with a minimum temperature, a swing of several degrees below the set point matters.

## Time-proportioning control

A better approach switches the heaters on and off in a fixed, short cycle, varying the fraction of each cycle they are on. If the cycle is 20 seconds and the oven needs 60% power, the heaters are on for 12 seconds and off for 8. Because the cycle is much shorter than the oven's thermal response, the oven sees a steady average power and its temperature hardly ripples.

```figure
type: formula
title: Average power from time-proportioning control
formula: P_average = P_installed × t_on ÷ t_cycle
caption: This is an illustration for the curing oven running steadily. The controller adjusts the on-time continuously as the demand changes.
- P_installed | 60 kW
- P_average needed | about 35.8 kW when running
step: required on-fraction = 35.8 ÷ 60 ≈ 0.60
step: with a 20 s cycle: about 12 s on and 8 s off
```

The shorter the cycle, the smoother the temperature, but the more often the switching device operates. That brings in the choice of switching device.

## Contactors and solid-state relays

A contactor is an electromechanical switch, and each operation wears its contacts a little. This is an illustration. With a 60 s cycle over an eight-hour day and 250 days a year, a contactor switches about 60 × 8 × 250 = **120,000** times a year; with a 20 s cycle, about **360,000** times. Contactor makers rate their products for a number of operations at a given current, and a heater contactor cycling every 20 seconds can reach its rating within a year or two, after which its worn contacts develop resistance and heat (Chapter 2).

Solid-state relays switch electronically, with no contacts to wear, so they suit short cycles and give smooth control. They are usually zero-crossing types, switching on and off as the alternating voltage passes through zero, which avoids electrical noise. Their drawbacks are the heat they generate, about a volt or so across the device at full current, which needs a heat sink, and the way they fail: a solid-state relay that fails often fails short-circuited, leaving the heater permanently on, which is why the independent limit described below matters so much.

```figure
type: compare
title: Switching heater power: contactor and solid-state relay
cols: Contactor | Solid-state relay
caption: General characteristics. Many ovens use a contactor for isolation and safety switching and a solid-state relay for control switching.
- Switching life | limited by contact wear | no contacts to wear
- Suitable cycle time | tens of seconds to minutes | seconds
- Heat generated | small, at the contacts | about a volt across the device at full current
- Typical failure | contacts weld or burn | often fails short-circuited, heater stuck on
```

## PID control

The controller decides the on-fraction by comparing the measured temperature with the set point. A proportional, integral and derivative (PID) controller combines three terms:

- **proportional**: more power the further the temperature is below the set point;
- **integral**: power that builds up over time while any error persists, removing the steady offset a proportional controller alone would leave;
- **derivative**: power reduced when the temperature is rising fast, damping overshoot.

Tuning sets the weight of each term. A well-tuned controller brings the oven to temperature with little overshoot and holds it within a degree or two; a badly tuned one oscillates or responds sluggishly. Most modern controllers can tune themselves automatically by applying a test step and measuring the oven's response, and the coating business retunes its oven controller after any significant change, such as new elements or a different load.

## Sensors

A controller can be no better than its sensor. Ovens and furnaces mostly use thermocouples, which are robust, cover a very wide temperature range and respond quickly, or resistance temperature detectors, which are more accurate and stable at moderate temperatures such as a curing oven's. Either sensor reads its own temperature, so its position decides what is controlled (Chapter 7): in the air stream leaving the heaters it reads hot and responds fast; in the return air it represents the chamber better but responds more slowly. Sensors drift with age and heat, so critical ovens have their sensors checked against a calibrated reference at intervals, and the record of those checks is part of the evidence that a heat treatment or cure was done at the right temperature.

## Zones

A large oven or furnace rarely heats evenly with a single controller. Heat losses are greater near doors and in corners, loads absorb heat unevenly, and airflow varies across the chamber. Dividing the heaters into zones, each with its own sensor and controller, lets each region receive the power it needs. The coating business's oven has two zones, front and rear, because the front zone near the doors loses more heat at each batch change. With one controller, the rear of the oven ran several degrees hotter than the front; with two, both hold within a couple of degrees of the set point.

## Phase-angle and burst firing

Solid-state power controllers can regulate heater power in two ways. Burst firing switches whole cycles of the mains on and off, as time-proportioning does but faster, and switches at the voltage zero to avoid electrical noise. Phase-angle control switches on part-way through each half-cycle, delivering a smoothly variable fraction of every cycle. Phase-angle control suits heaters whose resistance changes greatly with temperature, such as some high-temperature element materials, because it can limit the current smoothly while they are cold. Its drawback is that switching part-way through each cycle distorts the current drawn from the supply, producing harmonics that the electricity network and nearby equipment may not tolerate, so large phase-angle loads may need filtering. For the nickel-chromium elements in the curing oven, burst firing is simpler and cleaner.

## The independent over-temperature limit

Every oven and furnace needs a second, independent temperature limit, separate from the control loop, with its own sensor and its own means of cutting the heater power. Its purpose is to catch failures of the control system itself: a failed sensor that reads low, a controller fault, or a switching device stuck on. If the control loop fails in a way that calls for full heat, the limit is the only thing that stops the oven, its load and possibly the building from overheating.

The limit is set above the highest normal operating temperature but below the temperature at which the product, the coating, the oven structure or anything in the oven would be damaged or become hazardous, and it latches: once tripped, it stays tripped until someone investigates and resets it. Powder coating ovens also need the exhaust and other safety requirements their makers specify, because some coating processes release flammable vapours.

## Staging and peak demand

At start-up, the controller calls for full power, so the oven draws all 60 kW. If the business's electricity tariff includes a demand charge based on its highest power draw, that start-up peak may set the charge for the whole billing period. Staging the heaters, limiting the warm-up to some of the groups, reduces the peak at the cost of a longer warm-up.

This is an illustration. Limiting the warm-up power to 45 kW leaves about 45 − 13.3 = 31.7 kW to heat the oven's 70.6 MJ of structure (Chapter 6), so the warm-up takes about 70,600 ÷ 31.7 ≈ 2,230 s, roughly **37 minutes** instead of about 25, and the peak demand falls by 15 kW. Whether that is worthwhile depends on the tariff and on whether the extra 12 minutes can be absorbed, for example by starting the oven earlier on a timer before the shift begins.

```figure
type: bars
title: Warm-up time of the curing oven at different power limits
unit: minutes to warm the structure
max: 50
caption: This is an illustration using the 70.6 MJ structure and about 13.3 kW of losses from Chapter 6. Limiting power lowers the peak demand at the cost of a longer warm-up.
- *60 kW, all heaters | 25.2
- 45 kW, staged | 37.1
- 40 kW, staged | 44.1
```

## Ramps, soaks and programs

The tempering furnace runs programs rather than a single set point: a ramp to temperature at a controlled rate, a soak for the time the steel needs, and a controlled cool. Programmable controllers store such recipes, and a record of the actual temperature through each program is the heat treatment's evidence (Chapter 7). Ramp rates matter for large or complex parts, which can distort or crack if heated or cooled too quickly, and for the furnace lining and elements, which last longer when not shocked.

## Control and element life

The control method also affects the elements. Chapter 5 noted that temperature cycling cracks the protective oxide on nickel-chromium wire, exposing fresh metal to oxidise. On/off control with long cycles makes the elements swing between full temperature and much cooler every minute or two; time-proportioning with a short cycle, or burst firing, keeps them at a steadier temperature, because they have too little time to cool between pulses. Steadier element temperatures mean slower oxidation and longer life, a benefit that often justifies solid-state switching on its own.

## Recording what happened

A controller that only displays the temperature leaves no evidence. Modern controllers and data loggers record the set point, the measured temperatures and the heater output throughout each cycle. For the curing oven, the record shows each batch's oven temperature; for the tempering furnace, it shows each program's ramp, soak and cool. Those records answer the customer who asks whether a batch was cured or tempered correctly, and they are the first thing an engineer looks at when a batch fails, as in the failures in Chapters 6 and 7.

## A failure the limit caught

This is an illustration. Late one afternoon, the curing oven's over-temperature limit tripped, cutting the heaters and sounding an alarm. The control display showed 200 °C, the set point; the limit's own sensor read 238 °C.

The electrician found that the control thermocouple's sheath had cracked and its junction had moved back into the wall, where it read cooler than the chamber. The controller, seeing a temperature apparently below set point, had increased the heater on-time until the chamber was far hotter than 200 °C. The independent limit, with its own sensor in the chamber, saw the real temperature and tripped. The batch in the oven was over-baked, with some discoloration, and was stripped and recoated; without the limit, the next batches, and the coating's smoke, could have been much worse.

The thermocouple was replaced, the controller's sensor-break and deviation alarms were enabled so that a large difference between the control and limit sensors would raise an alarm before the limit trips, and the limit's function is now tested at each six-monthly service.

## Exercise: a gentler contactor cycle

To extend contactor life, the business considers lengthening the time-proportioning cycle from 20 s to 120 s. Calculate the contactor operations per year for an eight-hour day and 250 days, and the on and off times within each cycle at 60% power. Then say what happens to temperature ripple.

With a 120 s cycle, there are 30 cycles an hour, so about 30 × 8 × 250 = **60,000** operations a year, a sixth of the 360,000 at 20 s. At 60% power, the heaters are on for about **72 s** and off for **48 s** in each cycle.

Contactor wear falls sixfold, but the oven now sees its heaters on for over a minute and off for nearly a minute, long enough for its air temperature to ripple noticeably. A better answer for both is a solid-state relay for the control switching, with the contactor kept for isolation and safety, which is how the oven maker had originally designed it.
