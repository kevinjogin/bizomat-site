---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: temperature-alloys-and-apparent-strain
order: 3
title: "Temperature, alloys and apparent strain"
description: "Why gauge alloys barely change resistance with temperature, how expansion mismatch causes apparent strain, and how matched gauges, bridges and shielding keep temperature out of readings."
draft: false
---

A strain gauge cannot tell whether its resistance changed because the metal under it was loaded or because the room warmed up. Chapter 2 showed that one kilogram on BH-2 changes each gauge's resistance by about a third of a part per million. A copper wire changes its resistance by nearly 4,000 parts per million for each kelvin. If gauges were made of copper, warming the hopper by one degree would look like twelve tonnes of feed.

This chapter explains why gauges are made of alloys whose resistance hardly changes with temperature, why that is not enough on its own, and how a gauge can be matched to the metal it is glued to so that the two effects of temperature cancel. It then shows how bridges, load cell compensation and simple shielding remove most of what is left, uses BH-2's stand to show the difference between a strain and a stress caused by temperature, and ends with a cell that drifted every time the pellet mill started.

## Why alloy resistance barely changes with temperature

Chapter 2 described two ways a metal scatters its conduction electrons: at the vibrating lattice and at disorder in the crystal. To a good approximation the two add, so that a metal's resistivity is a temperature-dependent part from the lattice vibrations plus a nearly constant part from impurities and disorder. This is known as Matthiessen's rule.

In pure copper almost all the resistivity at room temperature comes from lattice vibrations, whose amplitude grows roughly in proportion to absolute temperature, so copper's resistance rises by about 0.39% per kelvin. In an alloy of roughly equal parts copper and nickel, atoms of the two kinds sit at random on the lattice sites. That random mixture scatters electrons so strongly that the disorder term dominates: the alloy's resistivity is about 0.49 µΩ·m, some 29 times copper's, and the small temperature-dependent part from the lattice is a minor addition to it. By adjusting the composition and heat treatment, makers can bring the alloy's temperature coefficient of resistance close to zero, or set it to a chosen small value, which turns out to be just as useful.

```figure
type: compare
title: Copper and a copper–nickel gauge alloy
cols: Resistivity at 20 °C | Change of resistance per kelvin | What dominates the resistivity
rowhead: Material
- Copper | 0.0168 µΩ·m | about +3,930 ppm | Scattering by lattice vibrations, which grows with temperature
- * Copper–nickel gauge alloy | about 0.49 µΩ·m | a few tens of ppm or less, adjustable | Scattering by the random alloy, nearly independent of temperature
caption: Indicative values from published material data. One kilogram on BH-2 is about 0.33 ppm of a gauge's resistance, so even the alloy's small coefficient must be cancelled, as the rest of the chapter shows.
```

## Apparent strain

Even a gauge whose resistance did not change at all with temperature would still read a strain when warmed, because the gauge and the metal it is glued to expand by different amounts. The gauge foil is forced to follow the surface. If the surface expands more than the foil would on its own, the foil is stretched, and it reads a strain that has nothing to do with load. Gauge makers call the total effect the thermal output; users usually call it apparent strain.

```figure
type: formula
title: Thermal output of a bonded gauge, simplified
formula: ε_apparent = [β ÷ GF + (α_surface − α_gauge)] × ΔT
caption: β is the gauge alloy's temperature coefficient of resistance (per kelvin), GF the gauge factor, α_surface and α_gauge the expansion coefficients of the surface and of the gauge alloy, and ΔT the change of temperature since the gauge was zeroed. The two terms can have opposite signs, which is what makes self-temperature compensation possible.
- β | gauge alloy, change of resistance per kelvin
- α | expansion coefficients, per kelvin
- ΔT | temperature change since zeroing, K
```

Take a copper–nickel gauge with β = 20 ppm/K and an expansion coefficient of 15 ppm/K, glued to steel at 11.5 ppm/K, with a gauge factor of 2.0. Its thermal output is 20 ÷ 2.0 + (11.5 − 15) = 6.5 µε per kelvin. Over a 30 K swing between a winter morning and a summer afternoon in a Toowoomba mill, that is 195 µε, about a fifth of a load cell's full-scale strain.

## Self-temperature compensation

The cure is to set β so that the two terms cancel for the surface material the gauge is intended for. On steel the expansion mismatch of this alloy is 11.5 − 15 = −3.5 µε/K, so if the alloy is heat-treated to have β = +7 ppm/K instead of +20, then β ÷ GF = +3.5 µε/K and the sum is zero. The gauge's own resistance change is made equal and opposite to the effect of the mismatch, for one particular surface material.

Such gauges are called self-temperature-compensated, and they are sold matched to steel, stainless steel, aluminium and other common materials. The match is exact at one temperature and close over a working range; the residual thermal output follows a gentle curve that the maker prints on the packet for each lot, often within a few microstrain over tens of kelvin around room temperature.

The match only holds on the material it was made for. A gauge matched to steel and glued to aluminium, which expands at about 23 ppm/K, sees an extra mismatch of 23 − 11.5 = 11.5 µε/K: 345 µε over 30 K. On stainless steel at about 17 ppm/K, it gives 5.5 µε/K. Checking the packet's material code against the part is part of every installation.

```figure
type: bars
title: Thermal output over a 30 K swing for different gauge and surface combinations
x: Gauge and surface
y: Apparent strain over 30 K, µε
caption: This is an illustration using the simplified formula with GF = 2.0. Unmatched gauge: β = 20 ppm/K, α_gauge = 15 ppm/K. A matched gauge's residual is taken as zero here; in practice it is the maker's published curve, typically a few microstrain over this range.
- Unmatched gauge on steel | 195
- Steel-matched gauge on stainless steel | 165
- Steel-matched gauge on aluminium | 345
- * Steel-matched gauge on steel | 0
```

## Bridges cancel what is left

Self-compensation removes most of the thermal output; the bridge removes most of the rest. Chapter 4 shows that a Wheatstone bridge responds to the difference between gauges in adjacent arms. If two gauges at the same temperature have the same thermal output and sit in adjacent arms, their thermal outputs cancel while their strain signals, if the gauges are placed so that one stretches and the other shortens, add.

In stress analysis this is done with a dummy gauge: an identical gauge on an unloaded piece of the same material, kept at the same temperature as the active gauge and connected in the adjacent arm. In a load cell all four gauges are active and sit close together on the same piece of steel, so they share one temperature and their thermal outputs cancel in pairs. What is left is the small mismatch between individual gauges, which shows up as a zero that moves slightly with temperature, and the fact that steel's modulus falls slightly as it warms, so the same load produces slightly more strain, which shows up as a change of span.

Load cell makers deal with both inside the cell. A small resistor of copper or nickel, whose resistance changes strongly with temperature, is placed in one bridge arm and trimmed so that the zero stays put over the working temperature range. Another temperature-sensitive resistor in series with the excitation reduces the voltage reaching the bridge as the cell warms, just enough to offset the rise in strain per kilogram. These resistors are why a cell must be at one temperature throughout to perform as specified: they compensate for the cell's temperature, not for a gradient across it.

## The case: a stress you can and cannot see

BH-2's stand legs give a clear example of the difference between strain caused by temperature and stress caused by temperature. The [restrained thermal stress tool](/tools/thermal-stress/) works out the stress and force in a bar whose thermal expansion is fully or partly restrained, from the elastic modulus, the expansion coefficient, the temperature change, the degree of restraint and the area, and compares the stress with the yield strength.

Imagine one leg, 1,900 mm² in area, warmed by 25 K by a nearby heater, with a steel-matched gauge on it. If the leg is free to grow, it lengthens by 287.5 µm per metre and carries no extra stress: the gauge, whose compensation cancels the steel's free expansion, reads zero. If the leg were held rigidly between two immovable floors, it could not grow, and with 200 GPa, 11.5 ppm/K, 25 K and full restraint the tool gives a compressive stress of 57.5 MPa and a force of 109 kN on the restraints. The gauge would read −287.5 µε, exactly the strain that, multiplied by the modulus, gives that stress.

```figure
type: compare
title: One BH-2 stand leg warmed by 25 K
cols: Change in length | Thermal stress | Steel-matched gauge reads
rowhead: Leg
- * Free to expand | +287.5 µm per metre | none | 0 µε
- Fully restrained | none | 57.5 MPa compressive, 109 kN on the restraints | −287.5 µε
- Unmatched gauge, free leg | +287.5 µm per metre | none | +162.5 µε of apparent strain
caption: This is an illustration. Stress and force from the restrained thermal stress tool: E = 200 GPa, α = 11.5 ppm/K, ΔT = 25 K, A = 1,900 mm². The unmatched gauge is the one above, 6.5 µε/K. A matched gauge reports the part of the strain that produces stress; an unmatched one adds a false reading even where there is no stress at all.
```

That is the useful meaning of compensation: a properly matched gauge reports the strain that produces stress, whether the stress comes from load or from restrained expansion. It is also a warning. A real leg is neither perfectly free nor perfectly restrained, and a hopper that grows when filled with warm meal pushes on whatever holds it sideways. Chapter 7 shows how such side forces creep into a weighing system.

## Correcting a strain survey for temperature

Load cells hide their compensation inside the steel. A strain survey of a structure, such as the one Chapter 6 makes on BH-2's lugs, has to deal with temperature in the open. Good practice has four parts.

1. **Record temperature with the strain.** A thermocouple or resistance thermometer bonded beside each gauge, or at least one per area, logged at the same time as the strain readings. The Library's [Contact Temperature Sensors by the Numbers](/reados/publications/contact-temperature-sensors-by-the-numbers/) explains how to get a surface temperature that means something.
2. **Use the packet's thermal output curve.** Each lot of self-compensated gauges comes with a measured curve of apparent strain against temperature, usually as a polynomial, for the material the lot is matched to. The correction is the difference between the curve's values at the temperature of each reading and at the temperature when the gauge was zeroed.
3. **Zero at a known state.** Zero the gauges with the structure in a known load condition, record the temperature, and if possible return to that condition at the end to check for drift.
4. **Keep the loading short.** The less time between the zero reading and the loaded reading, the less the temperature can change. Loading and unloading quickly several times, and averaging the changes, beats one long test.

```figure
type: steps
title: Correcting one reading with the packet's thermal output curve
caption: This is an illustration. The polynomial is a made-up example of the form makers print, ε_app(T) = −40 + 3.0 T − 0.06 T² µε with T in °C, for a steel-matched lot on steel. Use the coefficients on the real packet, and only for the material it names.
- Gauge zeroed at 22 °C: curve value | −3.0 µε
- Loaded reading taken at 38 °C | +412.0 µε indicated
- Curve value at 38 °C | −12.6 µε
- Apparent strain since zeroing, −12.6 − (−3.0) | −9.6 µε
- * Strain from load, 412.0 − (−9.6) | 421.6 µε
```

The correction here is about 2% of the reading, small but not negligible. With an unmatched gauge it would have been 6.5 µε/K × 16 K = 104 µε, a quarter of the reading, and the curve would not have been known at all. Self-compensation makes temperature correction possible; it does not make it unnecessary.

## When it goes wrong: the cell that drifted with the pellet mill

Two years ago the mill moved its pellet press and steam conditioner, and the conditioner's hot-air vent ended up a few metres from one of BH-2's load cells. From then on, every time the pellet line started, BH-2's empty reading crept up by 3 to 4 kg over about twenty minutes and then slowly returned. The indicator and the other two cells were fine.

The cause was a temperature gradient. The warm draught struck one side of the cell, so the gauges on that side warmed before those on the other. The cell's internal compensation corrects for the whole cell at one temperature, not for one face being warmer than the other, and its gauges' small individual mismatches no longer cancelled. A difference of about 2 K between the two sides, with a residual mismatch of about 1 µε/K between the gauges, gives about 2 µε, which on these cells is about 4 kg.

The link to the pellet line was found by logging, not by guessing. The instrument technician taped a small thermocouple to each side of the suspect cell and logged both temperatures beside the hopper's empty reading for two days. Each morning start of the pellet line showed the near side warming by about 2 K more than the far side within ten minutes, and the zero rising with the difference, then both falling back together as the cell's temperature evened out. A plot of zero against the temperature difference made the cause obvious to everyone, which also made the fix easy to agree.

```figure
type: decision
title: Fixing the drifting cell
caption: This is an illustration. The mill fitted a sheet-metal shield and later turned the vent.
- Re-zero the hopper after the pellet line starts | Hides the drift for that batch only, and needs a person to remember | Not adopted
- Replace the cell | A new cell drifts the same way in the same draught | Not adopted
- * Shield the cell from the draught and turn the vent away | Removes the gradient; the zero held within 1 kg | Adopted
```

The lesson applies to every weighing system: keep load cells out of draughts, sun, radiant heat and hot-water spray, and give a cell time to settle after a big temperature change before trusting its zero. A cell that has been hosed with hot water during cleaning can take half an hour or more to return to an even temperature.

## Exercise: the stainless steel test rig

The mill's maintenance team glue a steel-matched gauge to a stainless steel bracket (expansion coefficient 17 ppm/K) to measure its strain during a 20 K warm-up, and a second, identical gauge to an unloaded offcut of the same stainless steel, kept beside the bracket.

1. What apparent strain does the gauge on the bracket show over the warm-up if it is used on its own?
2. What does the bridge show if the offcut gauge is connected in the adjacent arm as a dummy?
3. Why would a dummy gauge on a mild steel offcut not work?

**Answer.**

1. The extra mismatch is 17 − 11.5 = 5.5 µε/K, so 20 K gives 110 µε of apparent strain, which would be read as load.
2. The dummy sees the same 110 µε of apparent strain but no load. In the adjacent arm its change cancels the active gauge's apparent strain, so the bridge shows only the strain from load, provided the two gauges really are at the same temperature.
3. On mild steel the dummy would be matched and show about zero, while the active gauge on stainless still showed 110 µε: nothing would cancel. A dummy must be on the same material as the active gauge and at the same temperature, or it compensates for nothing.
