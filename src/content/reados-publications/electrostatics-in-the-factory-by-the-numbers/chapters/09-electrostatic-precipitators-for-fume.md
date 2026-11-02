---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: electrostatic-precipitators-for-fume
order: 9
title: "Electrostatic precipitators for fume"
description: "How a two-stage electrostatic precipitator charges and collects welding fume, how migration velocity and the Deutsch equation set efficiency by particle size, and why cleaning matters."
draft: false
---

Welding fume is made of particles too small to settle and too small for simple filters to catch efficiently: agglomerates of metal oxides mostly well under a micrometre across. An electrostatic precipitator catches them by giving each particle an electric charge and then pulling it sideways out of the airstream onto a metal plate. It does this quietly and with very little resistance to airflow, because the air passes straight between open plates, and it can be washed and reused instead of replaced. The physics is the corona of Chapter 3 and the particle charging of Chapter 6, applied to particles a hundred times smaller.

This chapter explains how the case factory's two-stage precipitator works, how a particle's charge and the electric field set the speed at which it moves to the plates, and how the Deutsch equation turns that speed into a collection efficiency that depends strongly on particle size. It checks the welding bay's ductwork with the KEVOS® extraction duct tool, and ends with a precipitator that ticked, sparked and let fume back into the bay because its collector cells had not been washed.

## The two-stage precipitator

The welding bay's precipitator is a two-stage unit, the type used for fume and oil mist indoors. Air drawn from the four welding stations' hoods passes first through an ioniser stage: fine wires at about +12 kV strung between earthed plates. The wires produce a positive corona, and the fume particles passing through pick up positive ions. The air then passes through a collector stage: a stack of parallel plates a few millimetres apart, alternate plates held at about +6 kV and the others earthed. The charged particles are driven across the gap by the field and stick to the earthed plates. Cleaned air leaves through an after-filter and, in this installation, is returned to the building to save heating energy in winter.

Positive corona is used in the ioniser because it produces much less ozone than negative corona, which matters when the cleaned air is breathed. Large industrial precipitators on boiler and furnace exhausts use negative corona, which delivers more current, because their air goes up a stack.

## Charging fume particles

Particles larger than about a micrometre charge mainly by the field charging of Chapter 6: ions drifting along the field lines are swept onto them until the particle's own field repels more. Smaller particles also charge by diffusion charging: ions moving at random by thermal motion collide with them even without a field, which dominates below a few tenths of a micrometre. The charge a particle carries rises with its size, roughly with diameter squared for field charging.

## Migration velocity

In the collector's field, a charged particle is pulled sideways by the electric force and resisted by air drag. It quickly reaches a steady sideways speed, the migration velocity, at which the two balance. For fine particles, the drag is lower than Stokes' law predicts, because the air no longer behaves as a continuous fluid at that scale, and the Cunningham slip correction allows for it. The Library's [Fine Particles by the Numbers](/reados/publications/fine-particles-by-the-numbers/) explains drag, slip and why sub-micrometre particles are hard to catch.

```figure
type: formula
title: Migration velocity and the Deutsch equation
formula: w = q × E_c × C_c ÷ (3π × μ × d)
formula: η = 1 − e^(−w × A ÷ Q)
caption: w is the migration velocity (m/s), q the particle's charge (C), E_c the collecting field (V/m), C_c the Cunningham slip correction, μ the air's viscosity (about 1.81 × 10⁻⁵ Pa·s), d the particle diameter (m), η the collection efficiency, A the collecting plate area (m²) and Q the airflow (m³/s). Deutsch's 1922 equation assumes that turbulence keeps the uncollected particles evenly mixed, so efficiency rises exponentially rather than linearly with area.
- w | migration velocity
- A ÷ Q | specific collecting area, s/m
- η | fraction collected
```

The factory's precipitator has about 30 m² of collecting plate and handles 1.2 m³/s. For this illustration the particles are charged by field charging in a field of 500 kV/m with a relative permittivity of 10, and collected in a field of 1 MV/m, 6 kV across 6 mm.

```figure
type: compare
title: Migration velocity and collection efficiency by particle size
cols: Cunningham correction | Migration velocity | Efficiency, A = 30 m², Q = 1.2 m³/s
rowhead: Particle diameter
- * 0.3 µm | 1.59 | 9.7 cm/s | 91.2%
- 0.5 µm | 1.34 | 13.7 cm/s | 96.7%
- 1 µm | 1.17 | 23.9 cm/s | 99.7%
- 3 µm | 1.06 | 64.6 cm/s | above 99.99%
caption: This is an illustration. It assumes field charging only. Diffusion charging adds charge to the smallest particles, so the real efficiency at 0.3 µm is somewhat higher than shown, but a minimum efficiency in the range of a few tenths of a micrometre is a real feature of precipitators, and of most other collectors.
```

The efficiency falls steeply for the smallest particles, which are exactly the ones that make up most welding fume by number and much of it by mass. The exponential form of the Deutsch equation means each extra square metre of plate removes a fixed fraction of what is left, so raising efficiency from 95% to 99% at a given size takes about 50% more collecting area, not 4% more.

Particle size matters for health as well as for collection. The sub-micrometre particles that a precipitator catches least well are also the ones that penetrate deepest into the lungs, and welding fume contains metals whose health effects depend on the base metal and consumable: manganese from many steels and fluxes, chromium compounds from stainless steel. A collector's efficiency stated as a single percentage by mass can hide a much poorer performance on the fraction that matters most, which is why the factory's specification for the precipitator asked for efficiency by particle size, and why its checks use a counter with size channels.

## The case: the welding bay's ductwork

Each welding station has a hood drawing 1,080 m³/h, and the four join a 280 mm main duct 22 m long to the precipitator, whose fan provides about 1,600 Pa at the design flow. The [extraction duct check tool](/tools/extraction-duct-check/) works out the total airflow, the duct velocity against the least transport velocity for the dust, the duct's friction and fittings loss and the fan pressure needed.

```figure
type: steps
title: The welding bay's extraction to the precipitator
caption: This is an illustration. Results from the extraction duct check tool with roughness 0.15 mm, a fittings coefficient of 3.5, a hood entry loss of 150 Pa and a least transport velocity of 10 m/s for fume. The precipitator's own loss, low when its cells are clean, is part of the fan's available pressure.
- Total airflow, 4 × 1,080 m³/h | 4,320 m³/h, 1.2 m³/s
- Duct velocity in 280 mm | 19.5 m/s
- Duct and fittings loss | about 1,123 Pa
- * Fan pressure needed, with hood loss | about 1,273 Pa, against 1,600 Pa available
- Duct velocity against transport velocity | 19.5 m/s against 10 m/s
```

The duct is sound, with about 330 Pa to spare, and its velocity is comfortably above the transport velocity, so fume will not settle in the main. That margin matters, because the precipitator's resistance rises if its cells or after-filter load up, and the airflow at the hoods, which decides how much fume is captured at the welder's arc, falls if the fan cannot overcome it.

## Cleaning and the collected layer

Fume collects on the plates as a layer. A thin layer does little harm, but as it thickens, three things happen. The layer's resistance means that charge arriving on it must cross it to reach the plate, and a resistive layer builds up voltage across itself, weakening the effective field and, at the extreme, causing back-ionisation like a thick powder layer (Chapter 6). The narrowed gaps between plates spark more easily, and the power supply, sensing sparks, reduces its voltage. And loosely held deposits are blown off and re-entrained into the cleaned air. All three cut efficiency, and most for the smallest particles.

Two-stage cells are therefore taken out and washed at an interval set by the fume load, usually in an automatic washer or a tank with a detergent, dried and refitted. The ionising wires are inspected at the same time, since a broken wire can short the ioniser, and the after-filter is checked and changed when its pressure drop reaches the maker's limit.

## What the power supply tells you

A precipitator's high-voltage supply is also its main diagnostic instrument. Its voltage and current, read daily, describe the state of the cells better than any visual inspection.

Clean cells hold their set voltage with a steady, low current and no sparking. As a resistive layer builds, the current at a given voltage changes and sparks begin; the supply responds by lowering its voltage after each spark, so the average voltage drifts down. A shorted cell, from a broken ionising wire touching a plate or a large piece of debris, shows as a sudden collapse of voltage with high current. An open circuit, a disconnected cell, shows as full voltage with almost no current. Each pattern points to a different fault, and the factory's maintenance card lists them so that a technician can decide whether the unit needs washing, repair or an electrician.

The supply is also part of the safety system. Doors giving access to the cells are interlocked so that opening them switches off the high voltage and earths the cells, which can hold a charge after the supply stops, like any capacitor. Maintenance staff check that the cells are earthed with the unit's earthing rod before touching them.

## Precipitators against filters

The alternative for welding fume is a cartridge or bag filter, which catches particles by impaction, interception and diffusion in a fibrous medium. The two behave differently.

```figure
type: compare
title: Two-stage precipitator and cartridge filter for welding fume
cols: Two-stage precipitator | Cartridge filter
rowhead: Feature
- Resistance to airflow | Low and nearly constant while cells are clean | Rises as the cake builds; cleaned by pulses of compressed air
- Efficiency over time | Falls as cells load; restored by washing | Often rises as the dust cake builds, until the cartridge is cleaned or replaced
- Smallest particles | Lowest efficiency at a few tenths of a micrometre | Also has a most penetrating size, often similar
- Consumables | Washing; ionising wires | Cartridges replaced periodically
- Oily or sticky fume | Collects it, but deposits need washing and can be a fire risk with sparking | Blinds the medium unless pre-coated
- * Power and controls | High-voltage supply, interlocks, ozone management | Fan and pulse-cleaning system only
caption: General characteristics; the equipment maker's data and the fume's character decide the choice for a particular bay.
```

The factory chose a precipitator for its low running resistance, quiet fan and washable cells, accepting the discipline of regular washing. A precipitator's efficiency depends on maintenance more visibly than a filter's, which is a strength when the maintenance is done and a weakness when it is not.

## Ozone from the ioniser stage

Even a positive corona makes some ozone, and a precipitator returning air to a workplace adds that ozone to the air the welders breathe, on top of the ozone that the welding arc itself produces, which can be substantial for some processes such as gas metal arc welding of aluminium. The maker states the precipitator's ozone output, and the factory checked the bay's ozone concentration with a direct-reading instrument when the unit was commissioned and again after the cells were washed. Ozone production rises if the ionising wires are dirty or damaged, because the corona becomes less uniform, which is another reason the wires are inspected at every wash.

## Proving the efficiency

The factory proves its precipitator in three ways. A handheld optical particle counter at the inlet and outlet gives a quick comparison by size channel, enough to show that the unit is working and to spot a decline; the counts are logged after each wash as a baseline. An occupational hygienist measures the welders' exposure to fume periodically by personal sampling in the breathing zone, which is the measurement that the workplace exposure standards apply to, and the result shows whether the extraction as a whole, hoods, ducts and collector together, is controlling exposure. And the collector voltage and current, logged daily, show the electrical health of the cells between those measurements.

The three answer different questions, and none replaces the others. A precipitator with a perfect outlet count does not protect a welder whose hood is too far from the arc; a good exposure result in a well-maintained month says nothing about a month when the washing was skipped. The Library's [Setting Up a Welding Shop by the Numbers](/reados/publications/setting-up-a-welding-shop-by-the-numbers/) covers hood placement and ventilation for welding.

## When it goes wrong: the ticking precipitator

During a busy period, the precipitator's cell washing, due every two weeks, was skipped for two months. Welders began to notice a haze in the bay late in the shift, and maintenance heard a regular ticking from the precipitator. Its power supply's display showed the collector voltage falling from its normal 6 kV to below 4 kV as it backed off after each spark.

The cells were heavily loaded, with spatter-release spray residue binding the fume into a sticky layer. A particle counter at the precipitator's outlet, compared with its reading after the last cleaning, showed far more sub-micrometre particles getting through. At a collecting field reduced by the lower voltage and the thick layer, the migration velocity of a 0.3 µm particle falls in proportion; at 60% of its clean value, the Deutsch equation gives about 77% efficiency at 0.3 µm and 87% at 0.5 µm, against 91% and 97% clean. With the cleaned air returned to the bay, the escaping fume was being breathed. The skipped washes had been recorded as "deferred" on the maintenance system without anyone deciding who would accept the consequences, and nobody connected the haze with the deferral until the ticking made the precipitator itself the suspect.

```figure
type: decision
title: Restoring the welding fume precipitator
caption: This is an illustration. Returning cleaned air to a workplace needs maintained high efficiency and monitoring; the workplace exposure standards for welding fume and the regulator's guidance decide whether recirculation is acceptable and on what conditions.
- Turn the power supply's voltage up | It is already limited by sparking; more voltage, more sparks | Not adopted
- * Wash the cells and inspect the ionising wires, then reset the washing interval by fume load | Restores voltage, field and efficiency | Adopted
- Divert the cleaned air outside until cleaning is proven reliable | Removes the exposure risk at the cost of heating energy | Adopted for one month
- Fit a pressure-drop alarm on the after-filter and log the collector voltage daily | Early warning of loading | Adopted
```

After washing, the collector voltage held at 6 kV without sparking and the outlet particle count returned to its baseline. The washing interval is now counted in welding hours, logged by the welding machines, rather than calendar weeks, and the collector voltage is part of the bay's daily check at the start of each shift.

## Exercise: sizing for a higher efficiency

The factory wants 95% efficiency at 0.3 µm in clean conditions, using the migration velocity of 9.7 cm/s from the table above, at the same 1.2 m³/s.

1. What collecting area does the Deutsch equation require?
2. What area would 99% need?
3. If the airflow rose to 1.5 m³/s with the existing 30 m², what would the efficiency at 0.3 µm become?

**Answer.**

1. A = −Q × ln(1 − η) ÷ w = −1.2 × ln(0.05) ÷ 0.097 = 37 m².
2. A = −1.2 × ln(0.01) ÷ 0.097 = 57 m², about 54% more than for 95%.
3. η = 1 − e^(−0.097 × 30 ÷ 1.5) = 1 − e^(−1.94) = 85.6%. More airflow through the same plates means less time for each particle to migrate; the extraction duct tool would also show a higher duct loss, so the fan would need checking before the airflow could be raised.
