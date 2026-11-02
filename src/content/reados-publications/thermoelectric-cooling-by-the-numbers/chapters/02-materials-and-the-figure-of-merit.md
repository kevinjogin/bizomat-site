---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: materials-and-the-figure-of-merit
order: 2
title: "Materials and the figure of merit"
description: "Why a good thermoelectric needs a large Seebeck coefficient, high electrical and low thermal conductivity, the Wiedemann–Franz limit on metals, ZT, and the limits on ΔT and COP."
draft: false
---

Every conductor shows thermoelectric effects, but almost none is any use for cooling. Copper has a Seebeck coefficient of a couple of microvolts per kelvin; a copper–nickel alloy reaches tens; the bismuth telluride in the trust's modules reaches about two hundred. Yet a large Seebeck coefficient is not enough. A good cooling material must also conduct electricity well, so that its own Joule heating is small, and conduct heat badly, so that the heat it pumps does not leak straight back. Those three properties fight each other, and one number, the figure of merit, measures how well a material balances them.

This chapter explains the figure of merit, why the electrons that conduct electricity in a metal also force it to conduct heat, why heavily doped semiconductors of heavy elements are the best compromise, and what the figure of merit sets as the limits on temperature difference and efficiency. It finishes with a cooler whose advertised efficiency would have needed a material twice as good as any on the market.

## Three properties in one number

Chapter 1's heat balance showed the cold junction gaining Peltier heat in proportion to the Seebeck coefficient, losing Joule heat in proportion to the resistance, and losing conducted heat in proportion to the thermal conductance. For a leg of given shape, resistance goes inversely with electrical conductivity and thermal conductance directly with thermal conductivity. Working through the algebra for the best current, the material properties appear only in one combination.

```figure
type: formula
title: The thermoelectric figure of merit
formula: Z = S² σ ÷ κ        dimensionless form: ZT
formula: For a module, from its constants: Z = S² ÷ (R K)
formula: κ = κ_electronic + κ_lattice
caption: S is the Seebeck coefficient, σ the electrical conductivity and κ the thermal conductivity, which has a part carried by the charge carriers and a part carried by lattice vibrations. T is the absolute temperature at which ZT is quoted, often 300 K.
- Z | figure of merit, 1/K
- ZT | dimensionless figure of merit
- σ | electrical conductivity, S/m
- κ | thermal conductivity, W/(m·K)
```

S² σ is the power factor: it measures how much Peltier heating a material gives for a given Joule heating. Dividing by κ penalises heat leaking back. ZT is the figure engineers quote. The trust's modules, whose constants Chapter 3 derives from the datasheet, have S = 51.31 mV/K, R = 1.985 Ω and K = 0.5255 W/K, so Z = 0.05131² ÷ (1.985 × 0.5255) = 2.52 × 10⁻³ per kelvin and ZT = 0.76 at 300 K. That is typical of commercial bismuth telluride modules near room temperature, whose ZT lies roughly between 0.7 and 1.

## Why metals fail

In a metal, the electrons that carry electric current also carry most of the heat. Each electron carries charge and energy together, and the same collisions that scatter it and limit electrical conduction also limit its heat conduction. The result, found experimentally in the nineteenth century and explained by the theory of electrons in metals, is the Wiedemann–Franz law: the electronic thermal conductivity is proportional to the electrical conductivity multiplied by the absolute temperature, with a constant of proportionality, the Lorenz number, that is nearly the same for all metals.

```figure
type: formula
title: The Wiedemann–Franz law and what it means for ZT
formula: κ_electronic = L σ T        L ≈ 2.44 × 10⁻⁸ W·Ω/K²
formula: If the lattice carries no heat: ZT = S² σ T ÷ (L σ T) = S² ÷ L
caption: The Lorenz number L is the theoretical value for free electrons; real metals lie close to it near room temperature. Copper: 401 ÷ (5.96 × 10⁷ × 293) = 2.30 × 10⁻⁸ W·Ω/K².
- L | Lorenz number
```

The second line is the key result. In a material whose heat is carried entirely by its electrons, the conductivity cancels out of ZT, and the figure of merit depends only on the Seebeck coefficient. To reach ZT = 1 with no lattice conduction at all, a material needs S = √L = 156 µV/K. Metals have Seebeck coefficients of a few microvolts per kelvin to a few tens. Copper's, about 1.8 µV/K, gives ZT of about 1.3 × 10⁻⁴ by the electrons alone. A metal can make an excellent thermocouple, where only the voltage matters and no heat need be pumped, but a hopeless cooler.

```figure
type: compare
title: Figure of merit of three conductors near room temperature
cols: Seebeck coefficient | Electrical conductivity | Thermal conductivity | ZT at 300 K
rowhead: Material
- Copper | about 1.8 µV/K | 5.96 × 10⁷ S/m | 401 W/(m·K) | about 0.0001
- Copper–nickel thermocouple alloy | about 40 µV/K | 2.0 × 10⁶ S/m | 21 W/(m·K) | about 0.05
- * Bismuth telluride alloy, optimally doped | about 200 µV/K | about 1 × 10⁵ S/m | about 1.5 W/(m·K) | about 0.8
caption: This is an illustration with typical property values; real materials vary with composition, doping and temperature. The best thermocouple alloy is still sixteen times worse than bismuth telluride as a cooling material.
```

## Why heavily doped semiconductors win

Semiconductors break the metal's trap in two ways.

The first is the Seebeck coefficient. In a metal, only electrons very close to the top of the occupied energy levels take part in conduction, and they carry little energy above the average; that makes the Seebeck coefficient small. In a semiconductor, carriers are excited into a band some distance from the chemical potential, and each carries a large energy relative to it, which makes the Seebeck coefficient large. The coefficient falls as the doping, and so the number of carriers, rises; the electrical conductivity rises with it. The power factor S²σ has a maximum at a doping level, around 10¹⁹ carriers per cubic centimetre for bismuth telluride, that makes the material behave somewhere between a semiconductor and a poor metal.

The second is the lattice. In a semiconductor, much of the heat is carried not by the carriers but by vibrations of the crystal lattice, which do nothing for the thermoelectric effect. Applying the Wiedemann–Franz relation to bismuth telluride, with a Lorenz number for its carriers of about 2.0 × 10⁻⁸ W·Ω/K², σ = 10⁵ S/m and T = 300 K, gives an electronic thermal conductivity of about 0.6 W/(m·K); the remaining 0.9 W/(m·K) of its 1.5 is carried by the lattice. Lattice conduction is lowest in crystals of heavy atoms with complex structures, whose vibrations travel slowly and scatter readily. Bismuth and tellurium are among the heaviest stable elements, and alloying bismuth telluride with antimony telluride for the p-type legs and bismuth selenide for the n-type scatters lattice vibrations further while barely disturbing the carriers. That combination has made bismuth telluride alloys the standard for coolers near room temperature since the 1960s.

## What ZT limits: temperature difference

With no heat load, a module's cold side falls until the net heat pumped is zero. The best it can do, at the optimum current, depends only on Z and the hot side's temperature.

```figure
type: formula
title: Largest temperature difference with no load
formula: Lowest cold side: T_c,min = [√(1 + 2 Z T_h) − 1] ÷ Z
formula: ΔT_max = T_h − T_c,min
caption: Both temperatures in kelvin. For the trust's modules, Z = 2.52 × 10⁻³ /K: at T_h = 27 °C, ΔT_max = 68 K, which is the datasheet's rating and confirms the fit. At T_h = 45 °C it is 74.8 K.
- ΔT_max | largest difference with no heat pumped, K
```

ΔT_max grows with the hot side's temperature because the Peltier term grows with absolute temperature while the losses do not. It is a rating, not an operating point: at ΔT_max the module pumps no heat at all. A useful operating point sits well below it, typically at a third to a half of ΔT_max for a reasonable COP, which Chapter 4 explores.

## What ZT limits: efficiency

The best possible coefficient of performance of a thermoelectric cooler, at the current that maximises it, also depends on Z and the two temperatures. It is always a fraction of the Carnot COP, the limit for any refrigerator working between the same temperatures, and the fraction rises with ZT.

```figure
type: formula
title: Best COP of a thermoelectric cooler
formula: COP_max = [T_c ÷ (T_h − T_c)] × [√(1 + Z T_m) − T_h ÷ T_c] ÷ [√(1 + Z T_m) + 1]
formula: Carnot COP for cooling: T_c ÷ (T_h − T_c)
caption: T_m is the mean of T_h and T_c, all in kelvin. As ZT_m grows without limit, COP_max approaches the Carnot value.
- COP_max | best coefficient of performance at the optimum current
- T_m | mean absolute temperature of the two faces
```

For the cabinet cooler's design point in Chapter 5, with module faces at 27.0 °C and 59.3 °C, the Carnot COP is 300.15 ÷ 32.3 = 9.29, and the best COP the trust's modules can reach is 0.93, 10% of Carnot. A compressor refrigerator across the same temperatures typically reaches 40 to 60% of Carnot. That difference is the main reason thermoelectric cooling is reserved for small loads.

```figure
type: bars
title: Best possible COP across the cabinet cooler's faces, 27.0 °C cold and 59.3 °C hot, against ZT at the mean temperature
max: 5
caption: This is an illustration from the COP_max formula. The trust's modules have ZT_m of about 0.80 at the mean temperature of 316 K, giving 0.93. Commercial modules lie between about 0.7 and 1; the higher values are research results.
- ZT_m = 0.5 | 0.49
- * ZT_m = 0.80, the trust's modules | 0.93
- ZT_m = 1.0 | 1.18
- ZT_m = 2.0 | 2.12
- ZT_m = 5.0 | 3.62
- ZT_m = 10 | 4.76
```

## From material to module

A module's ZT is always a little lower than the ZT of its legs' material, because the module adds things the material does not have. The copper strips and the solder joints at each end of every leg add electrical resistance, and the contact resistances between them and the semiconductor can be a significant share of the total in short legs. The ceramic plates and the grease or pad beneath them add thermal resistance between the junctions and the outside faces, so the junctions run hotter on the hot side and colder on the cold side than the faces. And heat leaks between the plates through the air gaps around the legs and through any sealant at the edges. The module's datasheet ratings include all of these, which is one reason to work from a fitted module model, as Chapter 3 does, rather than from material properties.

Leg geometry decides how a given material is used. Short, fat legs have low resistance and high conductance: they pump a lot of heat per module at a high current, but they leak a lot back across a large temperature difference. Long, thin legs do the opposite. For a given material, the product of resistance and conductance, and so Z, does not depend on leg shape, but the current, voltage and heat at which the module works best do. That is why makers offer the same material in modules rated from about 2 A to more than 15 A.

### Stacking for larger differences

Where a single module cannot reach the temperature difference a job needs, modules are stacked in stages, each stage's hot face cooled by the next, larger stage. Each stage holds part of the difference with a better COP than one stage could across all of it, but the lower stages must pump the upper stages' power as well as the load, so the total COP falls steeply with the number of stages. Two-stage and three-stage modules are used for infrared detectors and laboratory instruments; they are not needed for the trust's cabinet, whose modules hold about 32 K, only 40% of the 80 K their ΔT_max reaches with the hot face at 59 °C.

## Generating power: the same limits in reverse

A thermoelectric module with one face hot and the other cool generates power by the Seebeck effect, and its efficiency is limited by ZT in the same way. At the trust's pump station, a supplier proposed a thermoelectric generator clamped to a hot-water pipe at 120 °C, with its cold side at 40 °C, to power a remote sensor. With Z = 2.52 × 10⁻³ per kelvin, the best conversion efficiency of such a module is 3.5%.

The [heat engine Carnot limit tool](/tools/heat-engine-carnot-limit/) checks a stated efficiency against the Carnot limit. Entering a hot source at 120 °C, a cold sink at 40 °C and a stated efficiency of 3.52% gives a Carnot efficiency of 20.35% and a second-law efficiency of 17.3%: well inside the limit, a credible figure for a bismuth telluride generator. For every 100 W of heat flowing through the module, about 3.5 W becomes electricity and the rest must be rejected at the cold side. A few watts suffice for a sensor and a radio transmitting occasionally, which is where such generators are used.

## The mistake: an efficiency that needed a better material

When the trust sought quotes for CC-1, one supplier's brochure claimed its cooler had a COP of 1.8 at the cabinet's design conditions, twice that of the others. At a running cost of electricity this would have saved money every summer, and the buyer recommended it.

```figure
type: steps
title: Testing a COP claim against the figure of merit
caption: This is an illustration. A claimed COP that needs a ZT well above commercially available materials is either measured at other conditions or wrong.
- Claim | COP 1.8 at 45 °C outside and 35 °C inside
- Faces of a good design at those conditions | about 27 °C cold, 59 °C hot, Chapter 5
- ZT_m needed for COP_max = 1.8 at those faces | about 1.6, twice the trust's modules' 0.80
- Supplier asked for test conditions | COP measured with both faces at 25 °C and no temperature difference
- * Result | claim not comparable; at the cabinet's conditions the supplier's own data gave COP 0.85
- Procedure changed | quotes compared at stated face or air temperatures, with the heat load and power both given
```

The reliability engineer worked backwards from the claim. At the face temperatures any practical design reaches at those air temperatures, COP_max = 1.8 would need ZT_m of about 1.6, roughly twice that of commercial bismuth telluride. No supplier was likely to have such a material in a catalogue cooler. Asked for the test conditions, the supplier confirmed that the 1.8 was measured with both faces at the same temperature, where the COP is high because no temperature difference is being held. At the cabinet's conditions its own performance chart gave 0.85, the same as everyone else's. The trust now asks every supplier for heat pumped and power at stated inside and outside air temperatures.

## Exercise: the sample box's best COP

SC-1's module works between a cold face at 1 °C and a hot face at 45 °C. Using Z = 2.52 × 10⁻³ per kelvin, calculate the Carnot COP, the best COP the module could reach at its optimum current, and the share of Carnot it represents. Then compare with the 0.41 calculated at 3.0 A in Chapter 1's exercise, and say what the difference means.

### Answer

**Given:** T_c = 274.15 K; T_h = 318.15 K; Z = 2.52 × 10⁻³ /K.

**Assumptions:** constant Z over the range; the ideal module model.

**Method:** Carnot COP T_c ÷ (T_h − T_c); COP_max from the formula with T_m = 296.15 K.

**Carnot COP:** 274.15 ÷ 44 = 6.23.

**COP_max:** Z T_m = 2.52 × 10⁻³ × 296.15 = 0.747; √1.747 = 1.322. T_h ÷ T_c = 318.15 ÷ 274.15 = 1.1605. COP_max = 6.23 × (1.322 − 1.1605) ÷ (1.322 + 1) = 6.23 × 0.1615 ÷ 2.322 = 0.433.

**Share of Carnot:** 0.433 ÷ 6.23 = 7.0%.

**Comparison:** at 3.0 A the module's COP is 0.41, very close to its best of 0.43. Across a 44 K difference, the best a ZT 0.75 material can do is only 7% of Carnot, and the operating current is already near the optimum for efficiency. The only ways to a better COP are to reduce the difference the module must hold, by better heat sinks and a higher cold-side temperature where the job allows, or to use a material with a higher ZT.

**Verification:** COP_max must be below Carnot and above the COP at any particular current, as 0.433 is. A finer evaluation with the exact constants gives 0.433, and the current that achieves it, S(T_h − T_c) ÷ [R(√(1 + ZT_m) − 1)], is 0.05131 × 44 ÷ (1.985 × 0.322) = 3.53 A, close to the 3.0 A used.
