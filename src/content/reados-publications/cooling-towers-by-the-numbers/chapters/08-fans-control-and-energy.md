---
book: cooling-towers-by-the-numbers
chapterSlug: fans-control-and-energy
order: 8
title: "Fans, control and energy"
description: "Control a tower's fan for the cold water the plant needs: the fan laws, on–off, two-speed and variable-speed control, annual energy, and catch a drive left in hand at full speed all year."
draft: false
---

A cooling tower is selected for the hottest, most humid hours of the year, and for most of the year it has more capacity than it needs. At part load, or on a cooler day, it could deliver colder water than the plant requires, and its fan, running at full speed, would be moving more air than necessary. Because a fan's power rises with the cube of its speed, running it slower when less air will do saves a great deal of energy: half the speed takes about an eighth of the power. Controlling the fan to deliver the cold water the plant needs, no colder, is one of the cheapest energy savings in a plant.

This chapter sets out the fan laws, compares on–off, two-speed and variable-speed control, estimates CT-250's annual fan energy under each with the tower model of Chapter 4 and a year of weather, and covers the winter case, when colder is not better. The running case finds that CT-250's variable-speed drive was left in manual mode at full speed after commissioning, using about four times the fan energy it needed and, in winter, sending water so cold to the chiller that it tripped.

## The fan laws

For a given fan in a given system, air flow, pressure and power scale with speed.

```figure
type: formula
title: Fan laws for a fixed fan and system
formula: Q₂ ÷ Q₁ = N₂ ÷ N₁;   Δp₂ ÷ Δp₁ = (N₂ ÷ N₁)²;   P₂ ÷ P₁ = (N₂ ÷ N₁)³
caption: This is an illustration for CT-250's fan, with an illustrative absorbed power of 5.5 kW at full speed. Real fan power at low speed is a little higher than the cube law suggests, because of motor and drive losses.
- Q | Air flow
- Δp | Pressure the fan develops
- P | Power absorbed
step: At 80% speed: about 0.51 of full power, 2.8 kW
step: At 70% speed: about 0.34, 1.9 kW
step: At 50% speed: about 0.13, 0.7 kW
```

*Ductwork by the Numbers* works through the fan laws in ventilation systems; the same relationships govern a tower's axial fan.

## How fast does the fan need to run?

The tower model of Chapter 4 answers this directly. Reducing the fan's speed reduces the air flow, which raises the liquid-to-gas ratio and lowers the transfer the tower provides; the speed needed is the one at which the tower just delivers the set-point cold water at the current load and wet-bulb.

This is an illustration, with CT-250 at full load and a cold-water set point of 29 °C. At a 24 °C wet-bulb, the fan must run at full speed. At 22 °C, about 77% of full speed is enough; at 20 °C, about 64%; at 16 °C, about 49%; at 12 °C, about 40%. Below that, the tower would deliver colder water than needed even at very low speed, and the fan can stop.

## Three ways to control the fan

- **On–off control** starts and stops a single-speed fan to hold the cold water near its set point. The fan runs at full power whenever it runs, so the energy is roughly proportional to the fraction of time it must run. Frequent starts wear the motor and gearbox and cause the cold water to swing, which the plant's loads feel as a cycling supply temperature.
- **Two-speed motors** add a half-speed step, which captures part of the cube-law saving.
- **Variable-speed drives** run the fan at exactly the speed needed, continuously, capturing nearly all of the cube-law saving and holding the cold water steady.

## CT-250's annual fan energy

This is an illustration. CT-250's plant runs about 4,000 hours a year at full load, spread across weather that, in this illustration, gives about 800 hours at a 12 °C wet-bulb, 1,200 at 16 °C, 1,200 at 20 °C, 500 at 22 °C and 300 at 24 °C. Applying the speed needed in each band, and an illustrative electricity price of A$0.25 per kWh excluding GST:

```figure
type: bars
title: CT-250's illustrative annual fan energy by control method, kWh
unit: kWh
max: 23000
caption: This is an illustration from the tower model and the weather bins above. Variable speed uses about a quarter of the energy of running at full speed all year, because most hours need much less than full air flow.
- Full speed whenever running | 22000
- On–off cycling, by the fraction of air needed | 12934
- *Variable-speed drive | 5643
```

Running at full speed costs about A$5,500 a year, excluding GST; on–off control about A$3,230; variable speed about A$1,410. The drive saves about **A$4,090 a year** against full speed, about A$4,500 including GST, before any saving in gearbox and motor wear, which on its own often repays a drive within a few years at this tower's size.

## The running case: commissioning left in hand

This is an illustration. CT-250's variable-speed drive was set to manual, or "hand", mode at full speed during commissioning, so that the tower's thermal performance could be checked at its design air flow. Commissioning finished, and the drive was never returned to automatic control from the cold-water temperature.

## The error: full speed all year

Through the first year, the fan ran at full speed whenever the tower ran. That used about **22,000 kWh** instead of about 5,600, about four times the energy the tower needed, in this illustration about A$4,090 a year excluding GST. It also produced much colder water than the plant needed whenever the wet-bulb was low: at a 12 °C wet-bulb, about 20.9 °C water at full load; in winter, at an 8 °C wet-bulb, about 18.5 °C.

```figure
type: compare
title: Cold water at full fan speed and full load, against the speed needed for 29 °C
cols: Cold water at full speed | Fan speed needed for 29 °C | Fan power needed
caption: This is an illustration from the tower model. At low wet-bulbs, full speed overcools the water while using several times the power needed.
- Wet-bulb 24 °C | 29.0 °C | 100% | 5.5 kW
- Wet-bulb 20 °C | 26.2 °C | 64% | 1.4 kW
- Wet-bulb 16 °C | 23.5 °C | 49% | 0.6 kW
- *Wet-bulb 12 °C | 20.9 °C | 40% | 0.4 kW
```

The overcooling caused the problem that exposed the error. The chiller's condenser, receiving very cold water on winter mornings, ran its refrigerant pressure below the chiller's minimum, and the chiller tripped on its low-pressure safety, several mornings running. Investigating the trips, the plant's engineer found the drive in hand at 50 Hz. The fix was to return the drive to automatic control from the cold-water temperature, set the set point to suit the chiller's minimum and the oil coolers' maximum, and add a check of the drive's mode to the commissioning sign-off. The general lesson is that a tower's fan should be controlled to the cold water the plant needs, and that commissioning settings must be returned to automatic before the commissioning is signed off, because a tower left at full speed wastes energy all year and, in winter, can make its water too cold for the equipment it serves.

## The pump is often the bigger load

Once the fan is controlled, the circulating pump is often the larger energy user. This is an illustration. CT-250's pump moves about 12 L/s against an illustrative 200 kPa of system pressure loss and static lift to the tower's spray distribution, a hydraulic power of about 0.012 × 200 ≈ 2.4 kW, or about 3.4 kW of electricity at a combined pump and motor efficiency of about 70%. Running for the plant's 4,000 hours, it uses about 13,700 kWh a year, more than twice the controlled fan's 5,600 kWh. Pump energy is reduced by keeping the system's pressure loss low, as *Heat Exchangers by the Numbers* discusses for the exchangers on the circuit, by not circulating more water than the loads need, as Chapter 3 recommended, and, where the loads allow, by varying the pump's speed with the load. A tower's energy review should always look at the pump as well as the fan.

## Several cells

Larger installations divide the tower into several cells, each with its own fan, sharing a basin or piped in parallel. The cube law favours running all cells together at reduced speed rather than some at full speed and others off. This is an illustration. Two identical cells, each moving half the air at 50% speed, together use about 2 × 0.5³ = 0.25 of the power of one cell running at full speed to move the same total air, a quarter, provided the water is distributed over both cells' fill. Water distribution matters: a cell with its fan off but water still flowing over its fill does little cooling, and a cell with its fan on and its water shut off wastes energy. Control systems for multi-cell towers stage the water and fans together, and they keep idle cells drained or circulating to avoid the stagnation of Chapter 7.

## Cooling with the fan off

A tower with its fan stopped still rejects some heat, because the falling water induces a little air movement and warm, moist air rises by its own buoyancy. The amount depends on the tower's design and the weather and is best taken from the maker's data, but it is a modest fraction of the design duty. On mild days at light load, that may be enough, and a well-controlled tower stops its fan altogether. It also means a tower is never fully off while water flows over it, which is one reason the water treatment and Legionella controls of Chapters 6 and 7 continue whenever the pump runs.

## Measuring fan energy

A variable-speed drive records its own energy use, and its kilowatt-hour register is the simplest way to confirm the savings estimated here. Reading it monthly, alongside the plant's load and the weather, shows whether the fan is responding to conditions as it should. A month in which the drive's energy is close to full speed for every running hour, as CT-250's was through its first year, is a month in which the drive is not controlling. The same reading, set against the cold-water temperature log, also shows whether the set point is being held, and whether it might be raised or lowered with benefit to the plant.

## Choosing the set point

The cold-water set point is a balance. Colder water helps the chiller's efficiency, cools the oil coolers and compressors further, and gives margin; warmer water saves fan energy. For a plant with a chiller on the circuit, colder condenser water usually saves more chiller energy than it costs in fan energy, down to the chiller's minimum, so the best set point is often as low as the chiller and the other loads allow, with the fans at full speed only when the weather makes that set point unreachable. Some plants reset the set point with the wet-bulb, holding a fixed approach, which keeps the fan working efficiently across the year. The calculation that settles it combines the tower model with the chiller's performance data, and it is worth doing once for each plant and repeating whenever a major load or the chiller changes, because the best set point moves with them.

## Fan noise

A tower's fan is also its main noise source, and noise falls steeply with speed, by an amount fan makers commonly express as some tens of times the logarithm of the speed ratio in decibels. Running slower at night, when neighbours are most sensitive, therefore helps twice: less energy and less noise. A tower near a boundary may have a night-time speed limit written into its control as a noise control, provided the tower can still meet its duty at night, which at the lower night-time wet-bulb it usually can. [Machine Noise Control by the Numbers](/reados/publications/machine-noise-control-by-the-numbers/) sets out how fan noise and distance combine at a receiver, and a tower's noise should be checked at the nearest neighbour at the speeds it will actually run.

## Fans, gearboxes and vibration

Variable-speed operation brings its own checks. Fans and their supports have natural frequencies, and a speed that excites one can cause vibration that damages the gearbox, the blades or the structure; drives are programmed to skip such speeds. Very low speeds may not lubricate a gearbox adequately, so makers set a minimum speed. And reversing the fan, which some towers use to clear ice in cold climates, needs the gearbox and drive to suit it. The fan and drive makers' requirements for these belong in the drive's settings and the commissioning record, so that a replacement drive, fitted years later by someone else, is programmed the same way rather than from its factory defaults.

## Exercise: two-speed instead of variable speed

Suppose CT-250 had a two-speed motor, full and half speed, instead of a variable-speed drive. At half speed the fan draws about 0.69 kW. In which of the weather bands above could the fan run at half speed, and roughly what annual energy would result if it ran at full speed in the others?

**Worked answer.** Half speed is enough wherever the speed needed is at or below 50%: the 12 °C band, needing about 40%, and the 16 °C band, needing about 49%. Those total 2,000 hours at about 0.69 kW, about 1,380 kWh. The 20, 22 and 24 °C bands, 2,000 hours, need more than half speed, so the fan runs at full speed, about 5.5 kW, about 11,000 kWh. The total is about **12,400 kWh**.

That is about 56% of running at full speed all year, but more than twice the variable-speed drive's 5,643 kWh, because in the 20 and 22 °C bands the fan needs only 64% and 77% of full speed yet runs at full speed, using about four and two times the power needed. Two-speed control helps; variable speed helps much more, and it also holds the cold water steady instead of hunting between two speeds.
