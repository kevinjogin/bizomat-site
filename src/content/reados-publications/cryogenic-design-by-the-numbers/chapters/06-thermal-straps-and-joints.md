---
book: cryogenic-design-by-the-numbers
chapterSlug: thermal-straps-and-joints
order: 6
title: "Thermal straps and joints"
description: "Size the copper strap from cryocooler to load, see why purity matters below 40 K and how Wiedemann–Franz predicts it, add bolted joints, and a joint rebuilt without its indium."
draft: false
---

Supports and wiring should conduct as little as possible; the thermal link between the cryocooler and the cold mass should conduct as much as possible. Every kelvin lost along that link is a kelvin the cooler must run below the temperature the experiment needs, and on a cryocooler curve, a few kelvins colder means noticeably less capacity. CT-40's link is a laminated copper strap with a bolted joint at each end, and between them, the strap and the joints decide whether the plate reaches its 40 K target.

This chapter calculates the temperature drop along the strap from the conductivity integral, shows why copper's purity matters at 30 K far more than at room temperature and how the Wiedemann–Franz law connects that to a simple electrical measurement, adds the bolted joints, and ends with a joint that was rebuilt without its indium foil.

## The strap's temperature drop

Chapter 5's formula works for a strap as well as a support, with one difference: for a support, both end temperatures are known and the heat is the unknown; for a strap, the heat is known, it is the load the cooler must take, and the temperature at the plate end is the unknown. The answer is the temperature at which the conductivity integral, times the shape factor, equals the heat.

This is an illustration. CT-40's strap is made of thin oxygen-free copper foils of RRR 50, 300 mm² in total section and 100 mm long, so its shape factor is 300 × 10⁻⁶ ÷ 0.1 = 3.0 × 10⁻³ m. Chapter 9's budget gives a total load of 10.58 W with 100 A in the leads, and on the cooler's curve the cold stage settles where its capacity equals that load: 25 + 10.58 ÷ 2 = 30.29 K. Integrating NIST's RRR 50 conductivity upwards from 30.29 K until the integral reaches 10.58 ÷ 3.0 × 10⁻³ = 3,527 W/m gives a plate-end temperature 2.49 K warmer.

```figure
type: steps
title: Temperature from cold stage to cold plate in CT-40 at 100 A
caption: This is an illustration. NIST conductivity for OFHC copper of RRR 50, integrated from the cold stage temperature; joint resistance from CT-40's fictional commissioning measurement.
- Load on the cooler | 10.58 W, from Chapter 9's budget
- Cold stage temperature | 25 + 10.58 ÷ 2 = 30.29 K, on the cooler's curve
- Strap, 300 mm² × 100 mm, RRR 50 | +2.49 K
- Two bolted joints at 0.04 K/W each | +0.85 K
- * Cold plate | 33.6 K, inside the 40 K target with 6.4 K to spare
```

The strap's mean conductivity over that small range is about 1,400 W/(m·K), more than three times copper's room-temperature value. Even so, it costs 2.5 K, because the heat is substantial and the strap is long enough to flex.

## Purity: where RRR matters

Chapter 4 showed that copper of RRR 50 and RRR 500 have nearly the same conductivity integral between 293 K and 40 K. Below 40 K the picture changes completely. At 30 K, NIST's fits give 1,444 W/(m·K) for RRR 50, 2,143 for RRR 100 and 3,257 for RRR 300. A strap working between 30 and 35 K lives exactly where purity counts.

```figure
type: bars
title: Temperature drop along CT-40's strap at 10.58 W, by strap material
unit: K
max: 10
caption: This is an illustration. Same 300 mm² × 100 mm strap, cold end at 30.29 K, NIST conductivity fits. Brass is off the scale: it would need a drop of about 92 K.
- Copper, RRR 300 | 1.14
- Copper, RRR 100 | 1.70
- * Copper, RRR 50 | 2.49
- 1100 aluminium | 9.15
```

The choice between RRR 50 and RRR 300 is worth 1.4 K at the plate, which on CT-40's curve is equivalent to about 2.7 W of extra cooling capacity. Higher purity costs little more for a strap, but it is easily lost: cold working reduces RRR, and annealing restores much of it. Straps are often annealed after forming for that reason, and must then not be bent sharply again. Aluminium of commercial purity is much worse than copper in this range, though very pure aluminium is used where weight matters. Brass, as Chapter 1's cold plate showed, is not a thermal conductor at all at these temperatures.

## Wiedemann–Franz: conductivity from a resistance

In a metal the same electrons carry both electric current and heat, and when both are limited by the same scattering, the ratio of thermal conductivity to electrical conductivity is proportional to absolute temperature. This is the Wiedemann–Franz law, and Sommerfeld's theory of the electron gas gives the constant of proportionality, the Lorenz number:

```figure
type: formula
title: The Wiedemann–Franz law with the Sommerfeld Lorenz number
formula: k × ρ = L₀ × T
formula: L₀ = (π² ÷ 3) × (k_B ÷ e)² = 2.443 × 10⁻⁸ W·Ω/K²
caption: k_B and e are the exact SI values of the Boltzmann constant and the elementary charge. The law holds well where impurity scattering dominates, at low temperatures in pure metals and at all temperatures in alloys, and less well where electrons and phonons scatter each other inelastically.
- k | thermal conductivity, W/(m·K)
- ρ | electrical resistivity, Ω·m
- T | absolute temperature, K
```

Below about 15 K, a pure metal's resistivity is almost entirely the residual part, ρ_res = ρ_293 ÷ RRR, and the law then predicts its thermal conductivity from one electrical measurement. For copper, with the International Annealed Copper Standard's room-temperature resistivity of 1.724 × 10⁻⁸ Ω·m, RRR 50 gives ρ_res = 3.45 × 10⁻¹⁰ Ω·m, and at 10 K the law gives k = 2.443 × 10⁻⁸ × 10 ÷ 3.45 × 10⁻¹⁰ = 709 W/(m·K), against NIST's 778. For RRR 300 it gives 4,250 against NIST's 4,320.

At 30 K the law overestimates badly: 2,125 against NIST's 1,444 for RRR 50. The electrons are now also being scattered by phonons, and that scattering degrades heat flow more than current, so the measured Lorenz ratio falls below the Sommerfeld value. Abrikosov, Gor'kov and Dzyaloshinskii's treatment of the electron–phonon interaction and of residual resistance is the theory behind both behaviours. For design, the practical rule is to use measured conductivity data, like NIST's, between about 15 K and 100 K, and to use the Wiedemann–Franz law with a measured RRR below that, or to compare batches of the same material.

## Bolted joints

The strap has to be fastened at each end, and a bolted joint between two pieces of copper has a thermal resistance of its own. Real surfaces touch only at the peaks of their roughness, and heat crossing the joint must squeeze through those small contacts, so the joint's conductance depends on the clamping force, the surface finish, any oxide or plating, and any soft layer between the surfaces. It falls as the temperature falls, because the conductivity of the contact spots falls with it in alloys and the contact area depends on the metals' hardness.

Three practices give good joints at low temperature: flat, clean, preferably gold-plated surfaces, which do not oxidise; a soft layer such as indium foil, which flows into the roughness and multiplies the real contact area; and a high, maintained clamping force, from stainless steel bolts with spring washers so that contraction does not relax them, as Chapter 3 explained.

Published joint conductances vary so widely with these details that a design value is best measured on the actual joint. This is an illustration. CT-40's laboratory measured each of its strap joints during commissioning, with a heater on the plate and thermometers on either side of each joint, and found about 0.04 K/W per joint at 35 K with indium foil and the specified torque. The two joints together cost 0.85 K at 10.58 W. That is a third of the strap's own drop, and it is the part of the thermal path most likely to change over the cryostat's life, because every coil change disturbs at least one joint. A joint that is taken apart should be treated as a new joint: fresh indium foil, clean surfaces, new or checked spring washers, the specified torque applied in a cross pattern, and a measured temperature difference on the next cooldown.

## Foils, braid and flexibility

A solid copper bar 300 mm² in section would carry CT-40's heat as well as the strap does, but it would be stiff, and Chapter 3 showed that the cold stage and the plate move relative to each other as they cool. A stiff link would push the plate sideways, load the cold head's thin-walled tube and, at worst, crack the cold head. The strap is therefore made of many thin copper foils stacked together and joined only at their ends, where they are pressed or welded into solid copper end blocks that bolt to the cold stage and the plate. Each foil bends easily; together they carry heat like a bar. Copper braid does the same job with more flexibility and somewhat less conduction for its section, because its strands follow longer, twisted paths.

The strap's shape is a compromise. A shorter strap conducts better but flexes less; a strap with a loop or an S-bend takes more movement but is longer. CT-40's 100 mm strap has a gentle S-bend that takes the plate's 0.17 mm rise and the cold stage's own contraction without measurable force.

## Spreading heat across the plate

The strap delivers its cooling to one point on the plate, but the heat arrives all over it: from the coil in the centre, the leads at one side, the supports at three points and radiation over the whole surface. The plate must spread the heat to the strap with only a small temperature difference, which is why it is made of high-purity copper and is 20 mm thick. Chapter 1's rough check gave 0.19 K for 10 W carried 150 mm across the plate; a brass plate would have needed 11 K.

The place where the coil sits relative to the strap joint therefore matters. CT-40's strap is attached to the plate directly beneath the coil, so the coil's heat, the largest single source during a test, travels the shortest path. The plate's thermometers, one beside the strap joint and one at the coil, show how well the plate spreads heat, and their difference is logged at every test.

## Measuring RRR in the laboratory

The Wiedemann–Franz section suggests a simple quality check that needs no thermal measurement: compare a sample's electrical resistance at room temperature and at the lowest temperature available. The measurement uses four wires, two to pass a known current and two to measure the voltage across a length of the sample, so that the lead and contact resistances do not enter.

The true RRR uses a resistance at about 4 K, where only impurities scatter. A laboratory with only a cryocooler reaching 30 to 40 K can still compare samples: the ratio of resistances between 293 K and 30 K is lower than the true RRR, because some phonon scattering remains at 30 K, but it is consistent from sample to sample and it ranks them correctly. CT-40's laboratory measures a small offcut from each batch of strap foil and plate this way, on the cold plate itself, and rejects material whose ratio falls well below that of the batch used for the original design.

Annealing is the usual way to raise RRR after machining or forming. It must be done in a vacuum or an inert atmosphere to avoid oxidising the copper, and the part must then be handled gently, since an annealed copper strap is soft.

## The error: a joint rebuilt without its indium

This is an illustration. After a coil change, the strap's plate-end joint was reassembled by a technician who did not know about the indium foil, which had been crushed and was thrown away. The bolts were tightened to the usual torque, but on plain spring washers that had been flattened in the previous assembly. The next cooldown reached only 38.5 K with the leads at 100 A, and when the coil test added 3 W of its own, the plate settled at 42.4 K, above the 40 K at which the coil had to be tested.

```figure
type: compare
title: CT-40 plate temperature with good and bad strap joints
cols: Cold stage | Strap | Joints | Cold plate
caption: This is an illustration. Cold stage on the fictional cooler curve; strap from NIST's RRR 50 integral; good joints 0.04 K/W each; the rebuilt joint measured about 0.5 K/W.
- Good joints, 10.58 W | 30.3 K | +2.5 K | +0.8 K | 33.6 K
- Good joints, 13.58 W with coil heat | 31.8 K | +3.3 K | +1.1 K | 36.2 K
- Bad joint, 10.58 W | 30.3 K | +2.5 K | +5.7 K | 38.5 K
- * Bad joint, 13.58 W with coil heat | 31.8 K | +3.3 K | +7.3 K | 42.4 K
```

The laboratory found the cause by reading the thermometers on either side of each joint: the plate-end joint showed a difference of over 7 K where commissioning had recorded under 1 K. From the difference and the load, the joint's resistance was about 0.5 K/W, a dozen times its design value. Rebuilt with new indium foil and new spring washers, it returned to 0.04 K/W. The laboratory now keeps indium foil and the joint's assembly instructions in the cryostat's spares box, and logs each joint's temperature difference at every cooldown so that a degraded joint shows up at once.

## Exercise: a strap for a bigger load

A future coil will add 4.4 W, bringing CT-40's load to 15 W, and the laboratory wants the strap's temperature drop to stay at 1.5 K. With the cold stage at 25 + 15 ÷ 2 = 32.5 K on the cooler's curve, NIST's RRR 50 integral from 32.5 K to 34.0 K is 2,061 W/m. Find the strap section needed for a length of 100 mm, and the mean conductivity over that range.

**Worked answer.** This is an illustration. The strap must carry 15 W with an integral of 2,061 W/m, so its shape factor must be 15 ÷ 2,061 = 7.28 × 10⁻³ m. With a length of 0.1 m, the section is 7.28 × 10⁻⁴ m², **728 mm²**, about two and a half times the present 300 mm². The mean conductivity is 2,061 ÷ 1.5 = **1,374 W/(m·K)**. A strap of copper with RRR 300 would need much less section, which is why purity, not just size, is the first thing to specify. With the joints at 0.04 K/W each adding 1.2 K, the plate would sit at 32.5 + 1.5 + 1.2 = 35.2 K. That still leaves nearly 5 K of margin below the 40 K target, enough for a test coil that adds a few watts of its own.
