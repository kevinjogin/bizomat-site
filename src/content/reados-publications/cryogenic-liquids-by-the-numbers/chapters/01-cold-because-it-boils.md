---
book: cryogenic-liquids-by-the-numbers
chapterSlug: cold-because-it-boils
order: 1
title: "Cold because it boils: what makes a liquid cryogenic"
description: "Why liquid nitrogen sits at −196 °C, the boiling points, densities and latent heats of the common cryogens, the cold in the vapour, the expansion ratio and SF-180's stock of cold."
draft: false
---

Liquid nitrogen is not cold because something keeps cooling it. It is cold because it is boiling. At atmospheric pressure nitrogen boils at 77.36 K, which is −195.79 °C, and an open container of the liquid stays at that temperature for exactly the same reason that a pot of water on a stove stays at 100 °C: every joule of heat that leaks in goes into turning liquid into vapour, not into warming the liquid. The temperature is fixed by the pressure above the surface, and the heat leak sets only how fast the liquid disappears.

That single idea explains most of what a user of cryogenic liquids sees. It is why a dewar hisses quietly all day, why a part dropped into the liquid makes it boil violently until the part is cold, why a closed vessel becomes dangerous and why the liquid's real value is measured in kilojoules of heat it can absorb rather than in litres. This chapter sets out the numbers that follow from it: the boiling points, densities and latent heats of the common cryogens, the extra cooling in the cold vapour, the volume of gas a litre of liquid makes, and the stock of cold that SF-180's cylinder holds when it is delivered.

## What counts as cryogenic

There is no sharp line between a refrigerated liquid and a cryogenic one, but the usual working definition covers liquids that boil well below −90 °C at atmospheric pressure. Australian Standard AS 1894, which covers the storage and handling of non-flammable cryogenic and refrigerated liquids, used that boundary for cryogenic liquids in its 1997 edition. In practice the liquids a workshop meets are nitrogen, argon, oxygen and carbon dioxide (which is stored as a refrigerated liquid, not a cryogen), with liquid helium and hydrogen appearing in laboratories and specialised plants.

Temperatures this low are easier to reason about in kelvins. The kelvin scale starts at absolute zero, so 0 °C is 273.15 K and 20 °C is 293.15 K. Liquid nitrogen at 77.36 K is about a quarter of the absolute temperature of the workshop. Every relation in this book that involves temperature, from the gas law to radiation, needs kelvins.

```figure
type: compare
title: Normal boiling points and liquid properties of the common cryogens at 101.325 kPa
cols: Boiling point | Liquid density | Latent heat | Latent heat per litre
caption: All values from the NIST Chemistry WebBook fluid tables at 101.325 kPa. Per-litre values multiply the latent heat by the liquid density at the boiling point.
- *Nitrogen | 77.36 K (−195.8 °C) | 806.1 kg/m³ | 199.2 kJ/kg | 160.6 kJ/L
- Argon | 87.30 K (−185.8 °C) | 1,395.4 kg/m³ | 161.1 kJ/kg | 224.9 kJ/L
- Oxygen | 90.19 K (−183.0 °C) | 1,141.2 kg/m³ | 213.1 kJ/kg | 243.1 kJ/L
- Hydrogen | 20.37 K (−252.8 °C) | 70.8 kg/m³ | 448.7 kJ/kg | 31.8 kJ/L
- Helium | 4.22 K (−268.9 °C) | 124.7 kg/m³ | 20.6 kJ/kg | 2.6 kJ/L
```

## Why these liquids are so cold

A liquid boils when its molecules have enough thermal energy to escape the attraction of their neighbours. Water molecules attract each other strongly, through hydrogen bonds, so water needs a high temperature to boil. Nitrogen, argon and oxygen are small, symmetrical molecules held together in the liquid only by the weak van der Waals attraction between their electron clouds. Little energy is needed to pull them apart, so they boil at low temperatures and their latent heats are small: nitrogen needs 199 kJ to boil a kilogram, against about 2,257 kJ for water at 100 °C.

Hydrogen and helium are the extreme cases. Their molecules are so light and their attractions so weak that they stay liquid only within a few tens of kelvins, and a few kelvins, of absolute zero. Helium is stranger still. At such low temperatures the quantum nature of its atoms dominates its behaviour, and below 2.18 K ordinary liquid helium becomes a superfluid that flows without friction through the finest leaks. The theory of such quantum liquids, built on the idea of quasi-particles (collective excitations that behave like particles), is one of the subjects of Abrikosov, Gor'kov and Dzyaloshinskii's classic text, which this book uses as its map of low-temperature physics. A workshop needs none of that theory for nitrogen, but the same ideas return in Chapter 4, where they explain why solids hold so little heat when they are very cold.

## The latent heat is the useful part

When a cryogenic liquid cools something, the cooling comes from the liquid boiling. Each kilogram of liquid nitrogen that boils at atmospheric pressure absorbs 199.2 kJ. That is the number that sets how much nitrogen a cooling job needs, and Chapter 4 uses it to work out the nitrogen for one of SF-180's shafts.

Per litre, the picture changes. Nitrogen's liquid is light, 806 kg/m³, so a litre absorbs only 160.6 kJ as it boils. Argon's latent heat per kilogram is lower, but its liquid is so dense that a litre absorbs 224.9 kJ. Helium is the poor relation: a litre of liquid helium absorbs just 2.6 kJ, sixty times less than a litre of nitrogen. That is why helium systems are designed around shielding every possible watt of heat leak, often with a nitrogen-cooled shield outside the helium vessel, and why Cryogenic Design by the Numbers spends a chapter on radiation shields.

```figure
type: bars
title: Heat absorbed by boiling one litre of each liquid at atmospheric pressure
unit: kJ/L
max: 260
caption: From the NIST latent heats and liquid densities at 101.325 kPa. Nitrogen is the workhorse because it is cheap and inert, not because it absorbs the most heat per litre.
- Oxygen | 243.1
- Argon | 224.9
- * Nitrogen | 160.6
- Hydrogen | 31.8
- Helium | 2.6
```

## The cold in the vapour

The vapour that leaves a boiling cryogen is as cold as the liquid. Nitrogen vapour leaves the surface at 77.36 K, and warming it to 20 °C takes another 226.9 kJ for every kilogram, more than the latent heat itself. Together, boiling a kilogram of liquid nitrogen and warming the gas to room temperature absorbs 426.1 kJ, more than twice the latent heat alone.

```figure
type: stack
title: Heat absorbed by one kilogram of liquid nitrogen, boiled at 101.325 kPa and warmed to 20 °C
unit: kJ/kg
caption: From NIST enthalpies of saturated liquid nitrogen and of nitrogen gas at 101.325 kPa and 293.15 K. How much of the vapour's cold is used depends on how the gas leaves the job.
- Latent heat of boiling | 199.2
- Warming the vapour from 77.4 K to 20 °C | 226.9
```

Whether that second part is useful depends on the job. In an open bath the vapour rises off the surface and leaves almost at once, still very cold, and its cooling is lost to the room. In a freezer tunnel or a cold box where the gas is made to flow past the work before it leaves, much of it is recovered. SF-180's bath is the first kind, and every calculation in this book for the bath uses the latent heat alone. A designer who used 426 kJ/kg for an open bath would underestimate the nitrogen it uses by more than half.

The cold vapour has a second consequence that matters for safety. Nitrogen gas at 77 K is about 3.8 times as dense as room air at 20 °C, according to the ideal gas law at equal pressure, so the vapour pours over the rim of a bath and runs along the floor, into pits and trenches, before it warms and mixes. Chapter 9 returns to it.

## A litre makes almost seven hundred litres of gas

When the liquid boils and the gas warms, the volume grows enormously. Using the NIST density of the liquid at its boiling point, 806.08 kg/m³, and of nitrogen gas at 101.325 kPa and 20 °C, 1.165 kg/m³, one litre of liquid nitrogen becomes 692 litres of gas at 20 °C. At 15 °C, the reference temperature that gas suppliers use, the figure is 680, which is the value Industrial Gases by the Numbers uses in its chapter on [storage in cylinders and bulk liquid](/reados/publications/industrial-gases-by-the-numbers/storage-cylinders-and-bulk-liquid/).

```figure
type: formula
title: Gas made by one volume of boiling liquid nitrogen
formula: V_gas ÷ V_liquid = ρ_liquid ÷ ρ_gas
formula: 806.08 ÷ 1.165 = 692 at 20 °C and 101.325 kPa
caption: Densities from the NIST Chemistry WebBook. The same ratio governs the pressure in a closed space (Chapter 8) and the oxygen left in a room after a release (Chapter 9).
- ρ_liquid | density of saturated liquid at 101.325 kPa, 806.08 kg/m³
- ρ_gas | density of nitrogen gas at 101.325 kPa and 293.15 K, 1.165 kg/m³
- Result | 692 litres of gas per litre of liquid at 20 °C; 680 at 15 °C
```

That ratio is the root of both serious hazards in this book. Liquid trapped in a closed pipe has nowhere to put the gas it makes as it warms, and the pressure rises until something gives. Liquid spilled or vented in a closed room puts its gas into the room's air and displaces the oxygen. Neither hazard is visible, and both follow directly from the number 692.

## Air that liquefies on cold surfaces

Nitrogen boils at a lower temperature than oxygen: 77.36 K against 90.19 K. Any surface cooled by liquid nitrogen is therefore colder than the temperature at which oxygen condenses at atmospheric pressure, and an uninsulated pipe, fitting or bath rim carrying liquid nitrogen can condense air out of the room. Because oxygen condenses more readily than nitrogen, the liquid that drips from such a surface is richer in oxygen than air is.

Oxygen-enriched liquid dripping onto oil, grease, timber, asphalt or clothing creates a serious fire risk, and it can make some materials burn violently on impact. The practical rules that follow, which Chapter 10 collects, are to insulate cold pipework where people work, to keep oil and organic materials away from it, and to stand cryogenic plant on concrete or other non-combustible surfaces.

## SF-180's stock of cold

This is an illustration. SF-180's liquid cylinder is delivered holding 140 kg of nitrogen. At atmospheric pressure that would be 140 ÷ 0.806 = 173.7 L of liquid, but the cylinder keeps its liquid at 100 kPa gauge, where Chapter 2 shows the liquid is warmer and lighter, so the same 140 kg fills about 180 L. Suppliers sell and fill cryogenic cylinders by mass for exactly this reason: the volume of a given mass of liquid changes with its pressure and temperature, but the mass does not.

As stored cold, the cylinder holds 140 × 199.2 ÷ 1,000 = **27.9 MJ** of latent heat. Chapter 4 finds that cooling one of SF-180's shafts to the bath temperature takes 1.065 MJ, about 3.8% of the cylinder. That suggests a full cylinder could cool more than twenty shafts. Chapters 3, 4, 7 and 10 show why the real number is smaller: the cylinder loses nitrogen while it stands, the bath and hose must be cooled before the first shaft, the bath boils away between jobs, and every transfer loses some liquid as flash.

```figure
type: stats
title: SF-180's cylinder as delivered
caption: This is an illustration. Mass from the fictional delivery docket; densities and latent heat from NIST at the stated conditions.
- 140 kg | Nitrogen delivered | sold and filled by mass
- 173.7 L | Liquid volume at 101.325 kPa | 140 ÷ 0.806
- 180 L | Liquid volume at 100 kPa gauge | lighter, warmer liquid; Chapter 2
- * 27.9 MJ | Latent heat available | 140 × 199.2 kJ/kg
- 120.2 m³ | Gas at 20 °C if it all boiled | 140 ÷ 1.165
```

The last figure is worth reading slowly. The cylinder, a little bigger than a household wheelie bin, contains enough gas to fill a room 7.5 m by 5 m by 3.2 m. Released into SF-180's 168 m³ maintenance bay, it would be nearly three-quarters of the volume of the room.

## Knowing how much is left

Because the liquid is always boiling, the contents of a cryogenic vessel fall even when nobody uses it, and the only reliable measure of what is left is mass. Many liquid cylinders carry a float or differential-pressure contents gauge, which reads the height or the weight of the liquid column; these are useful for a glance, but they read in percentages or litres calibrated at one condition and drift as the liquid's density changes with pressure. Small open dewars have no gauge at all.

The robust method is a platform scale. Weigh the vessel when it arrives, note the tare weight stamped on it, and weigh it again before and after each job. The difference is the nitrogen used, in kilograms, which is the unit of every heat balance in this book and of the supplier's invoice. SF-180 stands its cylinder on a scale for this reason, and Chapters 3 and 10 use the readings.

## The error: kilograms read as litres

This is an illustration. Before SF-180 was set up, the workshop estimated its nitrogen use from the heat calculation in Chapter 4. The calculation gave 5.35 kg of liquid nitrogen to cool one shaft. The estimate written into the purchase request said "5.35 L per shaft", and the monthly order, delivery frequency and cylinder size were all worked out from that.

The figure was wrong by the density. A kilogram of liquid nitrogen occupies 1 ÷ 0.806 = 1.241 L at atmospheric pressure, so 5.35 kg is 6.63 L. The estimate in litres was 19.4% low before any of the losses in later chapters were added, and the first month's cylinders ran out a week early.

The supervisor caught the cause by redoing the calculation with units written against every number, which showed that the kilograms had silently become litres. The lesson is general to cryogenic liquids: they are much lighter than water, so the habit of treating a litre as a kilogram gives a large error. Work in kilograms throughout, because heat balances and supply contracts are both in mass, and convert to litres only at the end, at the density that applies at the liquid's pressure.

## How to read the numbers in later chapters

The physical constants for nitrogen used in this book are summarised below. Each later chapter takes its values from this list or from NIST's tables at the pressure in question, and states which.

```figure
type: checklist
title: Nitrogen numbers used throughout the book
caption: NIST values at 101.325 kPa unless stated. The open item is a property that changes with pressure and is taken from Chapter 2 when needed.
- x Boiling point | 77.36 K, −195.79 °C
- x Liquid density | 806.08 kg/m³; 1.241 L/kg
- x Latent heat | 199.2 kJ/kg; 160.6 kJ/L
- x Vapour warmed to 20 °C | a further 226.9 kJ/kg
- x Gas density at 20 °C | 1.165 kg/m³; 692 L of gas per litre of liquid
- ? Properties at tank pressure | warmer, lighter liquid with a smaller latent heat
```

## Exercise: argon instead of nitrogen

The workshop's welding bay has liquid argon on site. Using the table in this chapter, find the mass and latent heat of 10 L of liquid argon, and compare the volume of liquid argon and liquid nitrogen needed to absorb the 1,065 kJ that one shaft gives up in nitrogen (Chapter 4). Then say why the comparison is not quite fair, and whether argon would be a sensible choice.

**Worked answer.** This is an illustration. Ten litres of liquid argon has a mass of 10 × 1.3954 = **13.95 kg** and absorbs 13.95 × 161.1 = **2,249 kJ** as it boils, against 1,606 kJ for 10 L of nitrogen. For 1,065 kJ, nitrogen needs 1,065 ÷ 160.6 = **6.63 L**, and argon 1,065 ÷ 224.9 = **4.74 L**.

The comparison is not fair because argon boils at 87.30 K, ten kelvins warmer, so the shaft would only cool to 87.3 K. NIST's fit for steel gives 1,041 kJ for that smaller temperature drop, needing 4.63 L of argon, and the shaft would contract 0.148 mm on its 80 mm diameter instead of 0.152 mm. Argon would work, but it costs several times as much as nitrogen per kilogram, it is 1.4 times as dense as air when warm and so lingers in low places even longer, and the welding bay's supply is sized for shielding gas. Nitrogen remains the sensible choice.
