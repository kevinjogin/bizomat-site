---
book: cryogenic-design-by-the-numbers
chapterSlug: heat-capacity-and-cooldown
order: 2
title: "Heat capacity, cooldown and warm-up"
description: "The enthalpy CT-40's cold mass gives up, a cooldown time integrated against the cryocooler's real capacity curve, why rated capacity misleads, a warm-up heater, and a cryostat opened while still cold."
draft: false
---

Before a cryostat can test anything, its cold mass has to be cooled, and afterwards it has to be warmed before it can be opened. Both take hours, and both are easy to estimate badly. The heat to be removed is not mass times a room-temperature specific heat times the temperature drop; Chapter 1 showed why. And the rate at which it comes out is not the cryocooler's rated capacity, which is quoted at the operating temperature and is a small fraction of what the cooler removes at the start.

This chapter calculates the heat CT-40's cold mass gives up, integrates the cooldown against the cryocooler's capacity curve and the heat leaks to find the time to 40 K, sizes a warm-up heater with the KEVOS® heating energy tool, and ends with a cryostat that was let up to air too soon.

## The heat in the cold mass

This is an illustration. CT-40's cold mass is 16.64 kg of copper (the 12.64 kg plate and the 4.0 kg coil, treated as copper) and 2.0 kg of 6061 aluminium in the coil former. Integrating NIST's specific heat fits from 40 K to 293.15 K:

```figure
type: steps
title: Heat to remove from CT-40's cold mass between 293 K and 40 K
caption: This is an illustration. NIST fits for OFHC copper and 6061-T6 aluminium, integrated numerically. The mean specific heat is the total divided by the mass and the 253.15 K temperature drop.
- Copper, per kilogram | 77.06 kJ/kg
- Aluminium, per kilogram | 170.2 kJ/kg
- Copper, 16.64 kg | 1,282 kJ
- Aluminium, 2.0 kg | 340 kJ
- * Total | 1,623 kJ, a mean specific heat of 0.344 kJ/(kg·K)
- With room-temperature specific heats | 2,116 kJ, 30% too high
```

Two features of that total recur throughout cryogenic design. The aluminium is a ninth of the mass but a fifth of the heat, because its light atoms give it more than twice copper's specific heat per kilogram. And almost all of the heat comes out at the warm end: copper gives up 72.3 of its 77.1 kJ/kg between room temperature and 77 K, and only 4.8 kJ/kg between 77 K and 40 K.

## The cooler's capacity is a curve

A cryocooler's rating is a single number at a single temperature: CT-40's gives 30 W at 40 K. But a cryocooler removes heat at any temperature above its lowest, and it removes far more when its cold end is warm. CT-40's fictional curve is typical in shape: 2.0 W for every kelvin above 25 K, rising to a ceiling of 120 W from about 85 K upwards, where the compressor's capacity limits it.

At the same time, heat leaks in. The leaks through the supports, the radiation through the insulation and the current leads at zero current, which Chapters 5, 7 and 8 calculate, are small when the cold mass is warm and grow as it cools, to about 7.3 W at 40 K. The net cooling at each temperature is the cooler's capacity less those leaks.

```figure
type: compare
title: CT-40's cooling capacity and heat leaks during cooldown
cols: Cooler capacity | Heat leaks | Net cooling
caption: This is an illustration. Fictional cooler curve 2.0 × (T − 25 K) W, capped at 120 W. Leaks from Chapters 5, 7 and 8 with no current in the leads.
- 293 K | 120 W | 0.0 W | 120 W
- 200 K | 120 W | 2.8 W | 117 W
- 100 K | 120 W | 5.3 W | 115 W
- 77 K | 104 W | 5.9 W | 98 W
- 60 K | 70 W | 6.4 W | 64 W
- * 40 K | 30 W | 7.3 W | 23 W
```

## Integrating the cooldown

The time to cool through each small temperature step is the heat in that step divided by the net cooling at that temperature. Adding the steps gives the cooldown time.

```figure
type: formula
title: Cooldown time of a cold mass on a cryocooler
formula: t = ∫ [m × c(T)] ÷ [Q_cooler(T) − Q_leak(T)] dT, from T_final to T_start
caption: Each material's mass and specific heat is summed in the numerator. The integral is done numerically in small steps, with NIST's specific heat at each step's temperature.
- m × c(T) | heat capacity of the whole cold mass at temperature T, J/K
- Q_cooler(T) | cooler capacity at T, from the maker's curve
- Q_leak(T) | total heat leak into the cold mass at T
```

Stepping the integral through CT-40's cooldown in ten-second steps gives:

```figure
type: line
title: CT-40 cold plate temperature during cooldown, estimated
x: Hours from switch-on
y: Cold plate temperature, K
ymin: 30
ymax: 300
caption: This is an illustration. NIST specific heats, the fictional cooler curve and the heat leaks above, with the cold mass treated as one lump at one temperature. The curve is nearly straight while the cooler is at its 120 W ceiling and bends as both the capacity and the specific heat fall.
- 0 | 293
- 0.83 | 250
- 1.76 | 200
- 2.63 | 150
- 3.37 | 100
- 3.63 | 77
- 3.83 | 60
- 4.08 | 40
```

CT-40 reaches 77 K in about 3.6 hours and 40 K in about **4.1 hours**, inside the six-hour target. Notice how the last 37 K, from 77 K to 40 K, take only half an hour even though the cooler's capacity falls from 104 to 30 W: there is so little heat left in the copper at those temperatures that a modest capacity removes it quickly.

## Two ways to get the time wrong

The integral sits between two easy estimates, and both are wrong.

```figure
type: bars
title: CT-40 cooldown time to 40 K by method
unit: hours
max: 16
caption: This is an illustration. The rated-capacity method divides 1,623 kJ by 30 W; the ceiling method divides it by 120 W; the integral uses the real curve and leaks. Only the integral is a design estimate.
- Total heat ÷ rated 30 W at 40 K | 15.0
- * Integrated against the capacity curve | 4.1
- Total heat ÷ ceiling of 120 W | 3.8
```

Dividing the total heat by the rated capacity at the operating temperature gives 15 hours, nearly four times too long, because it ignores the cooler's large capacity while the mass is warm. Dividing by the ceiling capacity gives 3.8 hours, slightly too short, because it ignores the falling capacity and the leaks near the end. The ceiling method happens to be close here because so little heat remains below 85 K, but for a cold mass with more aluminium or plastic, or a cooler with a steeper curve, it errs further. The integral is a few lines of code or a spreadsheet, and it is the only one of the three worth putting in a test plan.

## A model with limits

The estimate treats the cold mass as one lump at one temperature. That is reasonable for CT-40, whose copper plate and coil are joined by good conduction, but not for every cryostat. A cold mass with poor internal conduction, such as a coil wound on a thick stainless steel former or a sample bonded with epoxy, cools from the strap outwards, and its far parts lag the plate's sensor by several kelvins or more. Chapter 6 shows how the strap and joints between the cooler and the plate add their own temperature differences. And the cooler's curve is the maker's, measured on a test stand; CT-40's laboratory checks it on commissioning by cooling the plate with a known heater power applied and reading the temperature at which the cooler balances it.

## The cold mass's response at 40 K

Once CT-40 is cold, the same heat capacity sets how quickly the plate responds to a change. If a coil test adds a few watts of heat, the plate warms until the cooler's extra capacity balances it, and the time constant of that response is the cold mass's heat capacity divided by the rate at which the net cooling grows with temperature.

This is an illustration. At 40 K, NIST's fits give the cold mass a heat capacity of 16.64 × 57.8 + 2.0 × 82.0 = 1,126 J/K, about 13% of its value at room temperature. The cooler's capacity rises by 2.0 W for each kelvin, and the leaks fall slightly, by about 0.06 W/K, so the net cooling rises by about 2.06 W/K. The time constant is 1,126 ÷ 2.06 = 547 s, about **nine minutes**. A 5 W step of extra heat would raise the plate's settled temperature by 5 ÷ 2.06 = 2.4 K, and the plate would reach about 63% of that rise in nine minutes and 95% in about half an hour.

That has two practical consequences. Coil tests at a steady current should wait at least half an hour after each change before readings are taken, so that the plate has settled. And the small heat capacity at 40 K makes the plate sensitive: a short pulse of heat that would barely register at room temperature moves the plate's temperature noticeably, which is useful for measuring heat loads by the plate's response, and a nuisance for tests that need a steady temperature. Laboratories often add a temperature controller with a small trim heater on the plate, running the cooler at full capacity and the heater at a few watts, so that the controller can hold the plate steady in both directions.

## Shortening the cooldown

The integral shows where the time goes, and so where to save it. About 80% of CT-40's cooldown is spent above 100 K with the cooler at its 120 W ceiling, removing heat that came from the cold mass's room-temperature heat capacity. The ways to shorten it follow:

- **Lighter cold mass.** Every kilogram of copper removed saves about 77 kJ, and every kilogram of aluminium about 170 kJ, as the exercise shows in reverse.
- **Fewer high-capacity materials.** Aluminium, plastics and glass-fibre laminates hold much more heat per kilogram than copper or stainless steel, and plastics conduct so poorly that they lag behind the rest of the mass.
- **More capacity at the warm end.** Some cryostats add a liquid nitrogen precooling loop, or a second cooler stage, to carry the warm-end load; CT-40 is dry by design and accepts its four hours.
- **No unnecessary heat leaks during cooldown.** Leaving the coil's test current off and the instrument heaters off during cooldown keeps the net cooling at its largest near the end.
- **A good vacuum before starting.** Gas left in the vacuum space conducts heat from the vessel wall to the cold mass and condenses on it, adding load at exactly the wrong time. CT-40's procedure waits until the vacuum gauge reads below the laboratory's set level before the cooler is started, and the cold surfaces then act as a pump for most of the remaining gas, freezing it onto themselves in the same way that a cold trap does, though every molecule frozen there adds a little to the load.

None of these changes the physics of the curve: the heat at the warm end always dominates, and the last few tens of kelvins always come quickly.

## Warming up

At the end of a test the cold mass has to come back to room temperature before the vacuum is released, for the reason the error later in this chapter makes plain. Switching off the cooler and waiting would take many hours, because the heat leaks are small; CT-40 has a 100 W heater on its plate instead.

The [heating energy and time tool](/tools/heating-energy/) gives the sensible heat m × c × ΔT for a constant specific heat, and the heating time for a heater of given power and efficiency. With the mean specific heat from this chapter, it gives the warm-up energy and time directly.

```figure
type: stats
title: CT-40 warm-up from the heating energy tool
caption: This is an illustration. Inputs: 18.64 kg, 0.3439 kJ/(kg·K), −233.15 °C to 20 °C, 0.1 kW, 100% efficiency since the heater is inside the vacuum and all its heat reaches the cold mass.
- 1.623 MJ | Heat to add | equal to the heat removed in the cooldown
- 0.451 kWh | Energy drawn | at 100% efficiency
- * 4.51 h | Warm-up time on the heater alone | about 270 minutes
- 4.25 h | With the heat leaks helping | to 288 K, from the time-stepped model
```

The heat leaks that the cooldown fought now help: with the cooler off they add a few watts to the heater's 100. The time-stepped model gives about 4.25 hours to 288 K. The heater's power is limited by the hottest point it may reach, not by the cold mass: a heater bonded to a copper plate can run its own element far hotter than the plate while the vacuum gives it no convective cooling, so heaters in vacuum are rated by their makers for vacuum service and controlled by a thermostat or controller on the plate.

## The error: let up to air while still cold

This is an illustration. After an early test, a technician switched off CT-40's cooler, turned on the heater and, two hours later, opened the vacuum valve to let the cryostat up to air so that the coil could be changed before the end of the day. The plate sensor read about −90 °C at the time. The air that rushed in condensed and froze onto every cold surface: the multilayer insulation, the coil, the instrument wiring and the inside of the plate. When it melted, the insulation blankets were wet, and water had wicked into the coil's windings.

The calculation the technician skipped shows why the plate was still so cold. Two hours of 100 W is 720 kJ, less than half the 1,623 kJ the cold mass needed, and integrating NIST's specific heats upwards from 40 K with 720 kJ added gives about 180 K, matching the sensor. The recovery took a week: drying the insulation in a warm oven, baking the coil, and a long pump-down to remove the water that remained.

The laboratory's procedure now has a hard rule: the vacuum is released only when every sensor on the cold mass reads above the room's dew point, with the vessel let up through a dry nitrogen bleed rather than room air. Condensation Control by the Numbers explains how to find the dew point of the room, and Vacuum by the Numbers explains why water, once inside, is the slowest gas to [pump away](/reados/publications/vacuum-by-the-numbers/vapour-outgassing-and-gas-loads/).

## Exercise: a stainless clamp ring

A new coil design adds a 3.0 kg 304 stainless steel clamp ring to the cold mass. NIST's fit gives 304 stainless steel an enthalpy change of 88.2 kJ/kg between 40 K and 293.15 K. Find the extra heat, estimate the new cooldown time to 40 K by scaling, and compare with the time-stepped model's result of 4.74 hours. Then find the warm-up time on the 100 W heater alone.

**Worked answer.** This is an illustration. The ring adds 3.0 × 88.2 = **264.6 kJ**, bringing the total to 1,623 + 265 = **1,888 kJ**, 16.3% more. Scaling the 4.08-hour cooldown by the same proportion gives **4.74 hours**, the same as the time-stepped model, because the ring's heat, like the copper's, comes out mostly while the cooler is at its ceiling. The cooldown is still inside the six-hour target. On the heater alone, warm-up takes 1,888 ÷ 0.1 ÷ 3,600 = **5.24 hours**; with a mean specific heat of 1,888 ÷ (21.64 × 253.15) = 0.3447 kJ/(kg·K) and 21.64 kg, the heating energy tool gives the same 1.888 MJ. A heavier cold mass costs time at both ends of every test, which is why cryostat designers keep cold masses as light as their stiffness allows.
