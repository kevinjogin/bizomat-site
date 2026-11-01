---
book: cryogenic-liquids-by-the-numbers
chapterSlug: the-nitrogen-a-part-needs
order: 4
title: "The nitrogen a part needs"
description: "Why specific heat collapses on cooling, the enthalpy a steel shaft gives up on the way to −196 °C, the nitrogen an open bath boils, the cost of a warm bath, and a large shaft that ran it dry."
draft: false
---

Cooling a part in liquid nitrogen is a heat balance. Everything the part gives up as it cools from room temperature to −196 °C goes into boiling nitrogen, so the nitrogen needed is the heat removed divided by the latent heat. The heat removed is where the care is needed. A steel part's specific heat at −150 °C is only about three-quarters of its value at room temperature, and at −196 °C about a third, so the familiar formula with one specific heat overstates the heat by more than a quarter.

This chapter explains why solids hold so little heat when they are cold, calculates the heat that SF-180's shaft gives up from NIST's specific heat data, turns it into kilograms and litres of nitrogen, adds the cost of cooling the bath itself, and ends with a much larger shaft that ran the bath dry.

## Where a solid keeps its heat

The heat in a solid is stored in the vibrations of its atoms. In a crystal these vibrations are not independent: they travel through the lattice as waves, and quantum mechanics allows each wave only whole packets of energy, called phonons. At room temperature nearly every possible wave in a metal like iron or copper is excited, and each atom holds about the share of energy that classical physics predicts. That is why the heat capacities of many metals near room temperature are close to the same value per mole, roughly 25 J/(mol·K), and why steel, with its iron atoms of 55.8 g/mol, has a specific heat near 450 J/(kg·K).

As the solid cools, the high-frequency waves are the first to freeze out: a phonon of high frequency needs more energy than the lattice's thermal energy can supply, so those waves stop holding heat. The specific heat falls. Far below room temperature, in Debye's model of the lattice, it falls as the cube of the absolute temperature. In a metal, the conduction electrons add a further small part that falls only in proportion to temperature, and which takes over close to absolute zero. Abrikosov, Gor'kov and Dzyaloshinskii's text derives both behaviours, the phonon part and the electron part, from the idea of quasi-particles. The practical result is all a workshop needs: the colder a part gets, the less heat each further kelvin removes.

```figure
type: compare
title: Specific heat of four materials as they cool, from NIST's cryogenic fits
cols: 293 K (20 °C) | 200 K | 150 K | 100 K | 77 K
caption: NIST Cryogenic Technologies Group fits. "Low-alloy steel" uses NIST's fit for nickel steels, valid from 55 K, as a proxy. Values in J/(kg·K).
- *Low-alloy steel | 457 | 398 | 331 | 226 | 151
- 304 stainless steel | 471 | 416 | 362 | 275 | 204
- Copper | 389 | 359 | 324 | 255 | 196
- 6061 aluminium | 943 | 835 | 713 | 492 | 348
```

Copper shows the cube law clearly lower down. NIST's fit gives 7.51 J/(kg·K) at 20 K and 0.857 J/(kg·K) at 10 K, a ratio of 8.8 for a halving of temperature, close to the 2³ = 8 that the cube law predicts. Those temperatures belong to Cryogenic Design by the Numbers; for liquid nitrogen work, the useful point is the collapse from 457 to 151 J/(kg·K) between the workshop and the bath.

## Enthalpy, not m × c × ΔT

When the specific heat changes with temperature, the heat removed between two temperatures is its integral, the change in enthalpy. Dividing that integral by the temperature range gives a mean specific heat, which is what a constant-property formula or tool needs.

```figure
type: formula
title: Heat removed from a part cooled from T₁ to T₂
formula: Q = m × ∫ c(T) dT, from T₂ to T₁
formula: c_mean = [∫ c(T) dT] ÷ (T₁ − T₂)
caption: Integrating NIST's fit for nickel steels from 77.35 K to 293.15 K gives 77.11 kJ/kg, a mean specific heat of 357.3 J/(kg·K) against 457 J/(kg·K) at room temperature.
- m | mass of the part, kg
- c(T) | specific heat at temperature T, J/(kg·K)
- T₁, T₂ | start and end temperatures, K
```

This is an illustration. SF-180's shaft is 80 mm in diameter and 350 mm long, so its volume is π ÷ 4 × 0.08² × 0.35 = 1.759 × 10⁻³ m³ and at 7,850 kg/m³ its mass is **13.81 kg**. Cooling it from 20 °C to −195.8 °C removes:

```figure
type: steps
title: Heat removed from SF-180's shaft in the bath
caption: This is an illustration. NIST's nickel steel fit used as a proxy for the shaft's low-alloy steel; it agrees with handbook room-temperature values for carbon steels to within a few per cent.
- Enthalpy change per kilogram | ∫ c dT from 77.35 K to 293.15 K = 77.11 kJ/kg
- * Heat removed from the shaft | 13.81 × 77.11 = 1,065 kJ
- Mean specific heat | 77,110 ÷ 215.8 = 357.3 J/(kg·K)
- With the room-temperature value | 13.81 × 0.457 × 215.8 = 1,362 kJ, 27.9% too high
```

The [heating energy and time tool](/tools/heating-energy/) calculates the sensible heat m × c × ΔT between two temperatures for a constant specific heat, with the time and energy drawn for a heater of given power and efficiency. It is written for heating, but the heat between two temperatures is the same in both directions, so it gives the heat a cooling bath must remove if it is run from the cold temperature up to the warm one. With 13.81 kg, the mean specific heat of 0.3573 kJ/(kg·K), a start of −195.8 °C and a final temperature of 20 °C, it gives **1.065 MJ (0.296 kWh)**, the same as the integral. Its heating time is meaningful only if a heater is actually used, for example to warm a rejected shaft back to room temperature before it is measured again; for the bath, read only the energy.

## Most of the heat leaves early

The integral also shows where in the cooling the heat comes out. More than half of it leaves while the shaft is still above −73 °C, and less than 6% in the last 23 K.

```figure
type: bars
title: Heat removed from SF-180's shaft in each temperature band
unit: kJ per kg of steel
max: 45
caption: From NIST's nickel steel fit. The total is 77.11 kJ/kg. Because the steel holds little heat when cold, the last part of the cooling needs little nitrogen, though Chapter 5 shows it does not take little time.
- 293 to 200 K | 40.33
- 200 to 150 K | 18.35
- 150 to 100 K | 14.09
- 100 to 77 K | 4.33
```

That shape matters for the bath. The violent boiling when the shaft goes in is the bath taking out the first half of the heat; by the time the boiling settles, the remaining heat is small. It also matters for shrink fitting, because Chapter 6 shows that the shaft's contraction follows a similar pattern.

## From heat to nitrogen

In an open bath, the vapour leaves almost at once, so only the latent heat counts. At atmospheric pressure that is 199.2 kJ/kg.

```figure
type: stats
title: Liquid nitrogen to cool SF-180's shaft
caption: This is an illustration. Latent heat and densities from NIST at 101.325 kPa. The counterflow figure is a limit that an open bath cannot reach.
- 1,065 kJ | Heat removed from the shaft | Chapter 4 integral
- * 5.35 kg | Nitrogen boiled in an open bath | 1,065 ÷ 199.2
- 6.63 L | The same in litres | 5.35 ÷ 0.806
- 2.50 kg | If the vapour were warmed to 20 °C on the part | 1,065 ÷ 426.1
```

The bath's level falls as the nitrogen boils. Its liquid area is 0.4 × 0.3 = 0.12 m², so each litre lowers it by 1 ÷ 0.12 = 8.3 mm. Boiling 6.63 L lowers the level by 55 mm, while the shaft's own 1.76 L of volume raises it by 15 mm while the shaft is in. From the 220 mm working level, the liquid ends at about 180 mm with the shaft in, comfortably covering an 80 mm shaft lying on the bottom. The bath can cool two shafts in a row before it needs topping up, but not three.

## The bath is a part too

The first job of the day starts with a warm bath. Its stainless liner and the inner part of its foam must be cooled before any liquid can stay in it, and that heat is boiled off from the first fill.

This is an illustration. The liner is 0.61 m² of 1.2 mm stainless steel at 7,900 kg/m³, which is 5.78 kg. NIST's fit for 304 stainless steel gives 83.3 kJ/kg from 293 K to 77 K, so the liner gives up 482 kJ and boils **2.42 kg**. The foam is light but not weightless: 0.61 m² of 100 mm foam at 32 kg/m³ is 1.95 kg, and its specific heat at room temperature is about 1.5 kJ/(kg·K). In steady operation its inner face is at the liquid's temperature and its outer face near room temperature, and integrating NIST's foam fits across that profile gives about 209 kJ, or another **1.05 kg** of nitrogen. With the lid, the hose of Chapter 7 and the flash of Chapter 2, the first fill of the day loses about 4 kg of nitrogen before the first shaft goes in.

```figure
type: stack
title: Nitrogen for the first shaft of the day at SF-180
unit: kg
caption: This is an illustration. Flash at 6.6% applies to everything drawn from the cylinder; the hose cooldown is calculated in Chapter 7. Later shafts that day need only the shaft's share and its flash.
- Cooling the shaft | 5.35
- Cooling the liner | 2.42
- Cooling the foam to its working profile | 1.05
- Cooling the transfer hose | 0.28
- Flash on all of the above (6.6%) | 0.64
```

The first shaft of the day therefore costs about 9.7 kg of nitrogen, and each later shaft about 5.7 kg with its flash, plus the bath's standing loss between jobs from Chapter 3. Grouping shaft jobs into one session, rather than spreading them through the week, saves most of the bath's cooldown cost.

## Mass, not shape, sets the nitrogen

The heat balance depends only on the part's mass, its material and its start and end temperatures. A long thin shaft and a squat block of the same steel and mass need the same nitrogen. Shape matters for time, which Chapter 5 deals with, and for how much liquid the part displaces and how deep the bath must be, but not for the quantity boiled.

That makes estimating easy for mixed jobs. Weigh each part, or take its mass from the drawing, sort the parts by material, and multiply each material's mass by its enthalpy change from the table below. Assemblies are added up the same way, part by part.

```figure
type: compare
title: Heat removed and nitrogen boiled per kilogram, 20 °C to the bath at 101.325 kPa
cols: Enthalpy change | Nitrogen boiled | Mean specific heat
caption: Integrated from NIST's cryogenic fits between 293.15 K and 77.35 K; nitrogen at 199.2 kJ/kg. Low-alloy steel uses the nickel steel fit as a proxy.
- *Low-alloy steel | 77.1 kJ/kg | 0.387 kg/kg | 357 J/(kg·K)
- 304 stainless steel | 83.3 kJ/kg | 0.418 kg/kg | 386 J/(kg·K)
- Copper | 72.2 kJ/kg | 0.363 kg/kg | 335 J/(kg·K)
- 6061 aluminium | 162.2 kJ/kg | 0.814 kg/kg | 752 J/(kg·K)
```

The table gives a rule of thumb worth remembering: an open bath boils about 0.4 kg of liquid nitrogen for every kilogram of steel, stainless steel or copper it cools from room temperature, and about 0.8 kg for every kilogram of aluminium. In litres, that is about half a litre per kilogram of steel and one litre per kilogram of aluminium. Add the flash at the cylinder, the bath's own cooldown for the first job of the day and the standing losses, and the rule becomes a quick check on any quotation or order.

Whatever goes into the bath with the part also has to be cooled, and some of it should not go in at all. Lifting slings, hooks and baskets are cooled every time and are best made light, from stainless steel or aluminium, which stay tough when cold. Grease, oil and preservative on the part freeze to a hard skin, add a little to the load, and can contaminate the bath; parts should go in clean and dry. Rubber seals, plastic caps and bonded parts must come off first: most elastomers become glassy and brittle at these temperatures and crack, and the differential contraction of bonded joints can break them. Chapter 10 collects the material rules.

## Checking the calculation against the scale

The scale that Chapter 3 used for the bath's standing loss also checks the heat balance. Weigh the bath, lower a shaft in, wait until the boiling has stopped, take the shaft out and weigh again, then subtract the standing loss for the time taken. For SF-180's shaft, the result should be close to 5.35 kg. A measured figure well above that points to a warm bath, ice, an open lid or a part heavier than its drawing; a figure well below it usually means the shaft came out before it was cold, which Chapter 5 explains how to judge.

## The error: the vapour counted in an open bath

This is an illustration. The workshop quoted a job to fit a much larger output shaft of 120 kg into a gear carrier, using the same bath. The estimator multiplied the steel's enthalpy change, 77.11 kJ/kg, by 120 kg to get 9,253 kJ, then divided by 426.1 kJ/kg, the figure for boiling nitrogen and warming its gas to room temperature, which had been noted on the station's data sheet for Chapter 1's discussion. That gave 21.7 kg, or 26.9 L, and the estimator concluded that one full bath of 26.4 L, with a little topping up, would do.

On the day, the bath boiled down to the shaft's top within ten minutes, and the fitters spent the next half hour pouring liquid in by the dewar-load while the cold vapour poured over the rim. The shaft came out not fully cold, and the fit was abandoned for the day.

The open bath could never use the vapour's cold, because the vapour leaves the surface as soon as it forms. The right divisor was the latent heat alone, 199.2 kJ/kg, which gives **46.5 kg, or 57.6 L**: more than twice what the bath holds. The supervisor found the error by checking the divisor against the station's measured figure of 5.3 kg for the 13.81 kg shaft, which matches the latent heat and not the larger figure. The job was redone with a purpose-made tank, filled from the cylinder through a phase separator, with the liquid level kept above the shaft by a float valve.

## Exercise: an aluminium insert and a stainless sleeve

A pump rebuild needs a 6061 aluminium insert of 3.0 kg and a 304 stainless steel sleeve of 2.0 kg cooled in SF-180's bath, already cold. NIST's fits give enthalpy changes from 293.15 K to 77.35 K of 162.2 kJ/kg for 6061 aluminium and 83.3 kJ/kg for 304 stainless steel. Find the heat removed from each part, the nitrogen boiled in the bath, and the mean specific heat of the aluminium. Then use the heating energy tool to check the aluminium figure.

**Worked answer.** This is an illustration. The aluminium insert gives up 3.0 × 162.2 = **486.7 kJ** and boils 486.7 ÷ 199.2 = **2.44 kg**, about 3.0 L. The stainless sleeve gives up 2.0 × 83.3 = **166.6 kJ** and boils **0.84 kg**, about 1.0 L. Together they need 3.28 kg, about 61% of one shaft's nitrogen. The aluminium's mean specific heat is 162.2 ÷ 215.8 = **0.752 kJ/(kg·K)**, against 0.943 at room temperature. With 3.0 kg, 0.752 kJ/(kg·K), −195.8 °C and 20 °C, the heating energy tool gives 0.487 MJ, matching the integral. Per kilogram, aluminium needs about twice as much nitrogen as steel, because its light atoms give it nearly twice the specific heat per kilogram at every temperature in this range.
