---
book: vacuum-by-the-numbers
chapterSlug: molecules-in-motion
order: 2
title: "Molecules in motion: speeds and wall flux"
description: "Molecular speeds for nitrogen, water and helium, how many molecules strike a wall each second, effusion, the most a port can pass, and a speed claim it could not."
draft: false
---

A gas is a crowd of molecules in constant, random motion, and every property a vacuum engineer cares about comes from that motion. Pressure is their impacts on the walls. Pumping is catching the ones that happen to arrive at the pump's inlet. Flow through a hole into a vacuum is simply the molecules that happen to be heading for the hole. Leaks of helium are faster than leaks of air because helium molecules are lighter and quicker. Kinetic theory, the statistical description of that crowd, turns all of these into numbers.

This chapter sets out the distribution of molecular speeds and the mean speeds of the gases met in vacuum work, calculates how many molecules strike each square metre of a wall each second, uses that to find the flow through an opening into a vacuum, shows why a port's area puts a hard limit on the pumping speed it can pass at low pressure, and ends with a supplier's speed claim that the arithmetic showed to be impossible.

## The spread of speeds

The molecules of a gas at a given temperature do not all move at the same speed. Collisions constantly exchange energy between them, and the result, in equilibrium, is a definite distribution of speeds, the Maxwell distribution, which statistical mechanics derives from the probability of each energy at a given temperature. A few molecules are nearly at rest, a few are very fast, and most are grouped around a typical speed that rises with temperature and falls with molecular mass.

Three averages of the distribution are used, and they differ by a few per cent:

- the **most probable speed**, the peak of the distribution: √(2kT ÷ m);
- the **mean speed**, the ordinary average: v̄ = √(8kT ÷ (πm));
- the **root-mean-square speed**, which sets the kinetic energy: √(3kT ÷ m).

Here m is the mass of one molecule, the molar mass divided by Avogadro's number. For nitrogen, m = 0.0280134 ÷ 6.02214076 × 10²³ = 4.652 × 10⁻²⁶ kg. At 20 °C, its three speeds are **417, 471 and 511 m/s**. The mean speed is the one that appears in flux and flow calculations, and this book uses it throughout.

## Speeds of different gases

At the same temperature, all gases have the same average kinetic energy per molecule, so lighter molecules move faster, in proportion to one over the square root of their mass.

- **Helium**, molar mass 4.0 g/mol: mean speed **1,245 m/s**, 2.65 times nitrogen's.
- **Water vapour**, 18.0 g/mol: **587 m/s**.
- **Nitrogen**, 28.0 g/mol: **471 m/s**.
- **Argon**, 39.9 g/mol: **394 m/s**.
- **Carbon dioxide**, 44.0 g/mol: **376 m/s**.

The differences matter. Helium escapes through a fine leak path faster than air does, which is part of what makes it a good tracer gas for leak testing (Chapter 8). Water vapour, lighter than air, arrives at a pump's inlet more often per molecule than nitrogen does. And a gauge or pump rated for nitrogen behaves differently for other gases (Chapter 9).

```figure
type: compare
title: Molecular speeds of common gases at 20 °C
rowhead: Gas
cols: Molar mass, g/mol | Most probable, m/s | Mean, m/s | Root-mean-square, m/s | Through a hole into vacuum, L/s per cm²
caption: Calculated from kinetic theory with the exact Boltzmann constant. The last column is the most gas a hole can pass per square centimetre when molecules cross it without colliding.
- Helium | 4.0 | 1,104 | 1,245 | 1,352 | 31.1
- Water vapour | 18.0 | 520 | 587 | 637 | 14.7
- * Nitrogen | 28.0 | 417 | 471 | 511 | 11.8
- Argon | 39.9 | 349 | 394 | 428 | 9.9
- Carbon dioxide | 44.0 | 333 | 376 | 408 | 9.4
```

## How many molecules hit a wall

Kinetic theory gives the number of molecules striking a surface, per square metre per second, as:

Φ = n × v̄ ÷ 4

where n is the number density and v̄ the mean speed. The factor of four comes from averaging over the directions from which molecules arrive: only those moving towards the wall reach it, and most of those arrive at an angle. Substituting n = p ÷ (kT) and the formula for v̄ gives an equivalent form that needs only pressure, molecular mass and temperature:

Φ = p ÷ √(2π m k T)

This is an illustration for nitrogen at 20 °C:

- at atmospheric pressure, Φ = **2.95 × 10²⁷** impacts per square metre per second;
- at VC-200's 200 Pa, Φ = **5.81 × 10²⁴**;
- at 1 Pa, Φ = 2.91 × 10²²;
- at 10⁻⁴ Pa, high vacuum, Φ = 2.91 × 10¹⁸.

The flux is proportional to pressure. Even at VC-200's working pressure, every square centimetre of the chamber's wall is struck by about 6 × 10²⁰ molecules each second.

```figure
type: formula
title: Molecular flux on a surface
formula: Φ = n × v̄ ÷ 4 = p ÷ √(2π m k T)
caption: This is an illustration for nitrogen at 20 °C in VC-200. Φ is the number of molecules striking each square metre each second.
- p | Absolute pressure, 200 Pa
- m | Mass of a nitrogen molecule, 4.652 × 10⁻²⁶ kg
- T | 293.15 K
step: √(2π × 4.652 × 10⁻²⁶ × 1.380649 × 10⁻²³ × 293.15) = 3.44 × 10⁻²³
step: Φ = 200 ÷ 3.44 × 10⁻²³ = 5.81 × 10²⁴ per m² per second
```

## Pressure from impacts

The flux also explains pressure itself. Each molecule that strikes a wall and rebounds reverses the component of its momentum square to the wall, and the wall feels that change as a tiny push. Adding up the pushes of all the molecules arriving from every direction at every speed gives the kinetic theory result:

p = ⅓ × n × m × v_rms²

where v_rms is the root-mean-square speed. It is worth checking with VC-200's numbers, because it closes the loop between the molecular picture and the gauge on the chamber. At 200 Pa and 20 °C, n = 4.94 × 10²² per cubic metre, m = 4.652 × 10⁻²⁶ kg and v_rms = 511 m/s, so ⅓ × 4.94 × 10²² × 4.652 × 10⁻²⁶ × 511² = **200 Pa**. The same equation, with ½ m v_rms² = (3 ÷ 2) kT, is the ideal gas law, p = nkT. The pressure on the gauge and the motion of the molecules are one and the same thing.

## Temperature and speed

All three speeds go as the square root of the absolute temperature, so warming a gas speeds its molecules up only slowly. Raising VC-200 from 20 to 40 °C, 293.15 to 313.15 K, raises the mean speed of nitrogen by √(313.15 ÷ 293.15), about **3.4%**, from 471 to 486 m/s.

That has two consequences, pulling in opposite directions. At a fixed pressure, there are fewer molecules per cubic metre in warm gas, so the flux on a wall falls slightly, by the same 3.4%. But the molecules reaching a pump's inlet carry the same volume flow at higher speed, so an opening's molecular conductance, which goes as v̄, rises by 3.4%. Neither effect is large across a workshop's temperature range. The large effect of temperature in vacuum work is on vapour pressures and on how fast surfaces give up their adsorbed water, both of which change by tens of per cent for a few degrees (Chapter 7). Warming a chamber helps it pump down because of the water, not because of the speeds.

## Why walls matter at low pressure

A clean surface has room for something like 10¹⁹ adsorbed molecules per square metre in a single layer, a figure that varies with the surface and the molecule. Dividing it by the flux gives a rough time for a surface to be covered by one layer of molecules if every impact stuck:

- at atmospheric pressure, about **3 nanoseconds**;
- at 200 Pa, about **2 microseconds**;
- at 10⁻⁴ Pa, about **3 seconds**.

At VC-200's pressure, every surface in the chamber is covered in molecules almost instantly, and stays that way. The surfaces are not a passive container: they hold a reservoir of adsorbed gas, mostly water, which they release slowly as the pressure falls. Chapter 7 shows that this reservoir, not the air the chamber was filled with, sets the pace of pumping below a few hundred pascals.

## Effusion: flow through a hole into vacuum

Imagine a small hole in a thin wall, with gas on one side and a good vacuum on the other. If the hole is small compared with the distance molecules travel between collisions (Chapter 3), the molecules do not flow through it as a fluid. Each simply crosses the hole if it happens to arrive there, and none come back. The number crossing per second is the flux times the hole's area, Φ × A.

Expressed as a volume of gas at the upstream pressure, that is a **volume flow** of A × v̄ ÷ 4, independent of the pressure. For nitrogen at 20 °C, with v̄ = 471 m/s, each square centimetre of hole passes **11.8 litres a second**. That number is the **molecular conductance** of an opening, and it appears in every vacuum handbook in some form. For helium, it is 31.1 L/s per square centimetre; for water vapour, 14.7.

Effusion is also why lighter gases pass through small openings faster. The volume flow goes as v̄, so as 1 ÷ √m, and a mixture that effuses through a small hole comes out enriched in its lighter component. Kinetic theory calls this Graham's law, and it is the principle behind some gas separation methods as well as behind helium's speed through a leak.

## The most a port can pass

At low pressure, a pump catches only the molecules that wander into its inlet. Whatever its mechanism, it cannot pump faster than the rate at which molecules arrive at the opening, so the effusion figure sets a ceiling on the pumping speed any port can deliver once the gas is in the molecular regime:

- a **16 mm** bore port, 2.01 cm²: at most 2.01 × 11.77 = **23.7 L/s** for nitrogen;
- a **25 mm** bore port, 4.91 cm²: at most **57.8 L/s**;
- a **40 mm** bore port, 12.6 cm²: at most **148 L/s**.

A real pump reaches only a fraction of its inlet's ceiling, because not every molecule that enters is caught. At higher pressures, where the gas flows as a fluid, the ceiling does not apply in this simple form, and Chapter 4 deals with that case. VC-200's pump, at 16 m³/h, 4.44 L/s, is far below its 25 mm hose's ceiling at any pressure.

The ceiling has a practical corollary for anyone choosing equipment for low pressures: a large pump on a small port is mostly wasted. Doubling a port's bore quadruples its area and its effusion ceiling, and that is often a cheaper way to more pumping speed at the chamber than a bigger pump. The same reasoning, applied to the pipe between the port and the pump, gives the conductance calculations of Chapter 4, where the pipe's length as well as its bore limits the flow.

```figure
type: bars
title: The most a port can pass in molecular flow, nitrogen at 20 °C
unit: L/s
max: 160
caption: The effusion limit, 11.77 L/s per cm² times the port's area. No pump on that port can do better once the flow is molecular; real pumps achieve a fraction.
- 16 mm bore | 23.7
- * 25 mm bore, VC-200's hose | 57.8
- 40 mm bore | 147.9
```

## A sense of scale

Two numbers help make the molecular picture concrete for VC-200.

- A nitrogen molecule at the mean speed would cross the 0.6 m chamber in about **1.3 milliseconds** if nothing were in the way. At 200 Pa, something is in the way: Chapter 3 shows it travels only about 32 micrometres between collisions.
- The pump's 4.44 L/s at 200 Pa removes 4.44 × 10⁻³ × 4.94 × 10²² = **2.2 × 10²⁰** molecules a second, a throughput of 200 × 4.44 × 10⁻³ = **0.89 Pa·m³/s**.

## The error: a speed the port could not pass

This is an illustration. For a future silicone process needing 1 Pa, the sensor maker asked suppliers for a small booster pump to add to VC-200. One quoted a pump "rated at 40 L/s at 1 Pa", fitted to the chamber through the chamber's spare 16 mm port.

The process engineer checked it against the port's effusion limit. At 1 Pa, the distance a nitrogen molecule travels between collisions is about 6.5 mm (Chapter 3), comparable with the port's 16 mm bore, so the flow there is close to molecular. Through a 16 mm opening, no pump can do better than about 23.7 L/s of nitrogen, whatever its rating. The quoted 40 L/s could not be delivered through that port.

The supplier confirmed that the rating was measured at the pump's own 40 mm inlet, whose ceiling is 148 L/s, and that its speed through a 16 mm port and its connecting pipe would be much lower. The engineer asked for a quote that included the connection to a larger port, and added a line to the shop's purchasing checklist: every pumping speed quoted at low pressure is checked against the area of the port it will be connected through.

```figure
type: checklist
title: Kinetic theory checks on vacuum figures
caption: Each uses only the gas's mass, temperature and an area. The last line is this chapter's error.
- Mean speed for the actual gas and temperature | nitrogen 471 m/s; water 587; helium 1,245
- Wall flux proportional to pressure | 5.81 × 10²⁴ per m² per second at 200 Pa
- Effusion limit of each port at low pressure | 11.77 L/s per cm² for nitrogen
- Ratings stated for the gas and port they were measured with | nitrogen at the pump's own inlet
- Throughput, not just volume flow | 0.89 Pa·m³/s at 200 Pa
- x Quoted speed above the port's ceiling | 40 L/s claimed through a port limited to 23.7 L/s
```

## Exercise: pumping helium and water

VC-200's chamber is to be tested by spraying helium on its outside (Chapter 8), and its process removes a lot of water vapour. For each gas, find the mean speed at 20 °C, the effusion limit through the 25 mm hose's opening, and the wall flux at a partial pressure of 10 Pa.

**Worked answer.** Helium's molecular mass is 4.0026 ÷ 6.02214076 × 10²³ = 6.647 × 10⁻²⁷ kg; water's is 2.991 × 10⁻²⁶ kg.

- Helium: mean speed **1,245 m/s**; effusion limit 4.91 × 31.13 = **153 L/s**; flux at 10 Pa = 10 ÷ √(2π × 6.647 × 10⁻²⁷ × 1.380649 × 10⁻²³ × 293.15) = **7.69 × 10²³** per m² per second.
- Water vapour: mean speed **587 m/s**; effusion limit 4.91 × 14.67 = **72 L/s**; flux at 10 Pa = **3.62 × 10²³** per m² per second.

At the same partial pressure, helium strikes a surface 2.1 times as often as water vapour and 2.65 times as often as nitrogen, because the flux at a given pressure goes as one over the square root of the molecular mass.
