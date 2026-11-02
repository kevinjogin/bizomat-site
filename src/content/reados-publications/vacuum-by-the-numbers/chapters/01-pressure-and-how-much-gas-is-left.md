---
book: vacuum-by-the-numbers
chapterSlug: pressure-and-how-much-gas-is-left
order: 1
title: "Pressure, vacuum and how much gas is left"
description: "Absolute and gauge pressure, pascals, millibar and torr, the ideal gas law at the molecular scale, how much gas VC-200 holds at 200 Pa, the force on its door, and a vacuum specified in gauge units."
draft: false
---

"Vacuum" is used loosely in workshops to mean anything below atmospheric pressure, and it is measured in a confusing mixture of units: kilopascals below atmosphere, millibar, torr, inches of mercury, percentages. Before anything else can be calculated, a vacuum has to be stated in a way that means the same thing everywhere, and that means absolute pressure. Once it is, the ideal gas law says exactly how much gas is left in a chamber, and the answer is the first surprise of vacuum work: even a good industrial vacuum is full of molecules.

This chapter separates absolute from gauge pressure, sets out the units and how to convert them, uses the ideal gas law at the molecular scale to count the gas in VC-200 at its working pressure, works out the force the atmosphere puts on the chamber's door, and ends with a process specified in gauge units that could not be met or measured.

## Absolute and gauge pressure

Pressure is force per unit area, and its SI unit is the **pascal**, one newton per square metre. Two zero points are in common use.

- **Absolute pressure** is measured from a perfect vacuum. It can never be negative, and it is the pressure the gas itself has.
- **Gauge pressure** is measured from the local atmosphere. A tyre at 220 kPa gauge has an absolute pressure of about 320 kPa; a chamber at −90 kPa gauge has an absolute pressure of about 10 kPa.

For compressed air, gauge pressure is natural, because what matters is how much the air can push against the atmosphere. For vacuum, it is misleading. The atmosphere's own pressure varies from day to day with the weather, by a few kilopascals, and falls with altitude, so a gauge reading of −95 kPa means different absolute pressures on different days and at different sites. Every quantity that matters in vacuum work, the amount of gas left, how fast it flows, how long it takes to pump, depends on absolute pressure. This book uses absolute pressure throughout and states it in pascals.

## Units

Vacuum equipment is sold with ratings in several units, and conversions are a daily task.

- **Pascal**, Pa: the SI unit. Standard atmospheric pressure is 101,325 Pa.
- **Millibar**, mbar: 100 Pa. Widely used on European pumps and gauges. 1,013.25 mbar is one standard atmosphere.
- **Torr**: 1/760 of a standard atmosphere, 133.322 Pa, close to the old millimetre of mercury. Common on American equipment.
- **Kilopascal gauge**, kPa(g): pressure relative to the local atmosphere, negative for vacuum.
- **Percent vacuum** and **inches of mercury vacuum**: gauge-based units still seen on lifting equipment and old gauges.

VC-200's working pressure of 200 Pa is 2 mbar, or about 1.50 torr. The KEVOS® [pressure converter](/tools/pressure-converter/) does these conversions.

```figure
type: compare
title: VC-200's working pressure in the units equipment uses
rowhead: Unit
cols: Value | Basis | Note
caption: Absolute pressure is the same everywhere; a gauge reading depends on the day's atmosphere. The gauge figure assumes a standard atmosphere of 101,325 Pa.
- * Pascal | 200 Pa | absolute | the unit used in this book
- Millibar | 2.0 mbar | absolute | 1 mbar = 100 Pa
- Torr | 1.50 Torr | absolute | 1 Torr = 133.322 Pa
- Kilopascal gauge | −101.1 kPa(g) | relative to atmosphere | changes with the weather
- Fraction of atmosphere | 0.197% | absolute | 99.8% of the gas removed
```

## How much gas is there

The ideal gas law describes dilute gases well, and every gas in a vacuum chamber is dilute. At the molecular scale it reads:

p = n × k × T

where p is the absolute pressure, n is the number of molecules per cubic metre, T is the absolute temperature in kelvin, and k is the **Boltzmann constant**, exactly 1.380649 × 10⁻²³ joules per kelvin. Rearranged, n = p ÷ (k × T): the number density of molecules is simply proportional to pressure at a given temperature.

This is an illustration for VC-200, at 20 °C, 293.15 K:

- at atmospheric pressure, n = 101,325 ÷ (1.380649 × 10⁻²³ × 293.15) = **2.50 × 10²⁵** molecules per cubic metre;
- at 200 Pa, n = **4.94 × 10²²** per cubic metre;
- in the 0.2 m³ chamber at 200 Pa, there are 0.2 × 4.94 × 10²² = **9.9 × 10²¹** molecules, nearly ten thousand million million million.

As a mass, the chamber full of nitrogen at atmospheric pressure holds p × V × M ÷ (R × T) = 101,325 × 0.2 × 0.0280134 ÷ (8.314 × 293.15) = **0.233 kg**, where M is nitrogen's molar mass and R the gas constant. At 200 Pa, 0.197% of that remains: **0.46 g**. The pump has removed more than 99.8% of the gas, and the chamber is still crowded with molecules. That combination, very little mass and an enormous number of molecules, is why kinetic theory, rather than intuition about fluids, is the right tool from here on.

```figure
type: formula
title: Molecules per cubic metre from pressure and temperature
formula: n = p ÷ (k × T)
caption: The ideal gas law at the molecular scale. With p in pascals and T in kelvin, n is in molecules per cubic metre.
- p | Absolute pressure, 200 Pa
- k | Boltzmann constant, 1.380649 × 10⁻²³ J/K, exact
- T | Absolute temperature, 293.15 K
step: n = 200 ÷ (1.380649 × 10⁻²³ × 293.15) = 4.94 × 10²² per m³
step: In 0.2 m³: 9.9 × 10²¹ molecules, a mass of about 0.46 g
```

## Partial pressures and the water already there

Air is a mixture, and in a mixture of ideal gases each gas behaves as if the others were not there. Each has its own **partial pressure**, the pressure it would exert alone in the same volume, and the total pressure is the sum of the partial pressures. The number of molecules of each gas is in proportion to its partial pressure.

The partial pressure that matters most in vacuum work is water vapour's. Air at 20 °C and 50% relative humidity has a water vapour partial pressure of half the saturation pressure of water at 20 °C, which NIST gives as 2.339 kPa, so about **1.17 kPa**. That is 1.15% of the molecules in the chamber when the door closes. The pump removes them along with the rest at first. But water is also adsorbed on every surface inside the chamber, in a film a few molecules thick on steel and much more in porous materials and in the resin itself, and as the pressure falls that water comes off the surfaces and must be pumped too. By the time VC-200 is near 200 Pa, much of what the pump is removing is water that was on the walls when the door closed, not in the air. Chapter 7 calculates how much.

## The pump's job in pV units

It helps to count gas not in kilograms or molecules but in the product of pressure and volume, p × V, which is proportional to the number of molecules at a given temperature. Pressure times volume has the units of energy, pascal cubic metres, or joules; vacuum engineers often use millibar litres instead, and one pascal cubic metre is ten millibar litres.

This is an illustration. VC-200 at atmospheric pressure holds 101,325 × 0.2 = **20,265 Pa·m³** of gas. At 200 Pa, it holds 40 Pa·m³. The pump has to remove the difference, 20,225 Pa·m³, and then keep removing whatever the walls, the resin and the leaks give off. A flow of gas measured in pV per second, Pa·m³/s, is called **throughput**, and it is the quantity that is conserved as gas moves through a vacuum system: what enters the hose from the chamber leaves it into the pump. Chapters 4 to 8 all work in throughput, because a volume flow in litres a second means different amounts of gas at different pressures, while a throughput does not.

## Temperature matters too

At a fixed pressure, the number of molecules falls as the temperature rises: n = p ÷ (kT). The effect on a chamber's contents is modest over a workshop's range, about 2.4% between 18 and 25 °C, but temperature changes cause two effects that are not modest. A chamber that warms after it is sealed shows a pressure rise that can be mistaken for a leak (Chapter 8). And vapour pressures, which set how fast water and solvents come off surfaces and out of the resin, roughly double for every ten or so degrees of warming (Chapter 7). That is why VC-200's process sheet states a temperature range as well as a pressure.

## Pressure is molecules hitting the wall

The pressure a gas exerts is the combined push of its molecules bouncing off the walls. Chapter 2 calculates how many hit each square metre of wall each second, and finds a figure with 24 zeros at VC-200's working pressure. Each impact transfers a little momentum, and the total, averaged over the wall, is the pressure. A pump does not suck gas out: it removes the molecules that happen to wander into its inlet. Everything about pumping speed and conductance follows from that picture, which is why a "suction" model of vacuum gives wrong answers at low pressure.

## The force on the door

The atmosphere pushes on the outside of a vacuum chamber with a pressure of about 101 kPa, and the gas inside pushes back with only its own small pressure. The net force on any panel is the pressure difference times its area.

This is an illustration. VC-200's door is 400 × 400 mm, 0.16 m²:

- at 200 Pa inside, the difference is 101,325 − 200 = 101,125 Pa;
- the force on the door is 101,125 × 0.16 = **16.2 kN**, about the weight of a 1.6 tonne car.

That force is almost the same whether the chamber is at 200 Pa or at 1 Pa: the last 99.8% of the pressure difference is reached long before the gas is gone, so a rough vacuum loads a chamber almost as much as a perfect one. The door's seal sees that load, the door's hinges and clamps must not let it bend, and a glass viewport in the door sees it on a small area. Chapter 10 returns to it, and the KEVOS® [vacuum cup calculator](/tools/vacuum-cup/) applies the same pressure-times-area relationship to vacuum lifting.

```figure
type: bars
title: Force on VC-200's 400 × 400 mm door by chamber pressure
unit: kN
max: 17
caption: This is an illustration with a standard atmosphere outside. Most of the force is reached by 10 kPa; pumping further changes it very little.
- 50 kPa inside | 8.2
- 10 kPa inside | 14.6
- * 200 Pa inside, working pressure | 16.2
- 1 Pa inside | 16.2
```

## Naming the ranges

Vacuum is often divided into ranges, rough or low vacuum, medium or fine vacuum, high vacuum and beyond, and different sources draw the boundaries in different places. The names are less useful than the physics behind them, which Chapter 3 sets out: the important boundary is where the distance a molecule travels between collisions becomes comparable with the size of the equipment, because that is where gas stops flowing like a fluid. VC-200 works in what most sources would call rough vacuum, where the gas still flows like a fluid through its hose and the chamber.

## The process specification

A good vacuum specification states, for each step of the process:

- the **absolute pressure** to be reached and held, with a tolerance;
- the **time** allowed to reach it and the time it must be held;
- the **gas** involved, since gauges and pumps behave differently with water vapour or solvents than with air;
- the **temperature**, since vapour pressures depend strongly on it (Chapter 7);
- how the pressure is **measured** and where.

VC-200's process sheet reads: "Degas at 200 Pa absolute, ±50 Pa, measured by capacitance diaphragm gauge at the chamber, for 10 minutes; reach 200 Pa within 6 minutes of starting the pump; resin and chamber at 18 to 25 °C."

## The error: a vacuum specified in gauge units

This is an illustration. The resin supplier's data sheet recommended degassing "at full vacuum", and the sensor maker's first process sheet translated that as "−100 kPa on the chamber gauge". The chamber had been supplied with a dial gauge reading from 0 to −100 kPa, with divisions every 2 kPa.

The first batches of potted sensors showed fine voids in about one in five units when sectioned. The operators reported that the gauge had reached −98 kPa, the last division they could reliably read before the needle met the stop, on every batch. On those days the local atmosphere had been around 100.2 kPa, so the chamber was at about 100.2 − 98 = **2.2 kPa absolute**, 2,200 Pa, eleven times the pressure the resin supplier's engineers had in mind. The gauge could not have shown the difference between 2,200 Pa and 200 Pa: both are less than one division from its stop.

The fix had three parts. The process was restated in absolute units, 200 Pa. A capacitance diaphragm gauge reading absolute pressure was fitted to the chamber (Chapter 9). And the pump-down was timed against the new gauge, which showed that the pump reached 200 Pa comfortably, once the operators knew to wait for it. The void rate fell to the level the supplier's data predicted.

```figure
type: checklist
title: Checks on a vacuum specification
caption: Each item makes the number mean the same on every day and at every site. The last line is this chapter's error.
- Pressure stated as absolute, in one named unit | 200 Pa absolute, ±50 Pa
- Time to reach and time to hold | within 6 minutes; hold 10 minutes
- Gas and temperature stated | air and resin vapours; 18 to 25 °C
- Gauge able to read the specified pressure | capacitance diaphragm, absolute
- Force on doors and windows known | 16.2 kN on the 400 × 400 mm door
- x Pressure stated as a gauge reading near −100 kPa | 2,200 Pa reached, indistinguishable from 200 Pa
```

## Exercise: a vacuum dryer at altitude

A vacuum dryer at a plant 600 m above sea level, where the atmosphere is about 94.5 kPa that day, has a dial gauge reading −92 kPa. Find the absolute pressure in the dryer, the number density of molecules at 20 °C, and the mass of gas in its 0.5 m³ chamber, taking the gas as nitrogen. What would the same gauge reading mean at sea level on a 101.3 kPa day?

**Worked answer.**

- Absolute pressure: 94.5 − 92 = **2.5 kPa**, 2,500 Pa.
- Number density: 2,500 ÷ (1.380649 × 10⁻²³ × 293.15) = **6.18 × 10²³** per cubic metre.
- Mass: 2,500 × 0.5 × 0.0280134 ÷ (8.314 × 293.15) = **0.0144 kg**, about 14 g.

At sea level on a 101.3 kPa day, −92 kPa would mean 9.3 kPa absolute, 3.7 times as much gas. The same gauge reading describes very different vacuums, which is why the dryer's specification should be in absolute pressure.
