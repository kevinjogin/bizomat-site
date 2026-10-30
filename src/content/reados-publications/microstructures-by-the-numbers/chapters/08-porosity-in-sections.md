---
book: microstructures-by-the-numbers
chapterSlug: porosity-in-sections
order: 8
title: "Porosity in sections"
description: "Measuring casting porosity by area fraction and by density, telling shrinkage from gas pores, why sections cannot show whether pores connect, and tracing porosity to feeding."
draft: false
---

Porosity is the defect that most often turns a casting from good to scrap, and it was the reason Plant P's casings leaked. A section shows pores directly, and their area fraction estimates their volume fraction without bias, exactly as for any phase. But porosity raises questions that a phase fraction does not: what kind of pore it is, whether the pores join up, and whether the measurement on a polished face can be trusted when the polishing itself can open or close holes.

This chapter measures porosity two independent ways, by area fraction and by density, reads the shape of pores for their cause, explains why leak-tightness depends on connections a section cannot see, and follows the leaking flange back to the feeding of the casting. Its error is a density result referred to the wrong sound density.

## Porosity by area fraction

On a properly prepared section, porosity is measured like any phase: by point counting or by image analysis of the dark pore areas, on fields placed systematically, as Chapters 2 and 3 describe. Two preparation faults matter more for pores than for anything else. Smearing drags metal over pore openings and makes porosity look smaller, while pull-out of graphite or inclusions makes it look larger, as the wall specimen showed in Chapter 2. A useful check is to polish, measure, polish again lightly and measure again. A true porosity value should not change between polishes; one that keeps falling was being created by the preparation, and one that keeps rising was being hidden by smearing.

On the flange section of the leaking casing, 30 fields on a 4 mm grid gave the **0.8%** porosity reported in Chapter 1, with almost all of it in the fields nearest the junction with the 50 mm boss.

## Porosity by density

An independent estimate comes from density. A specimen is weighed in air and then suspended in water; the difference in mass is the mass of water displaced, which gives the specimen's volume. The specimen's density is its mass divided by that volume, and porosity is the shortfall below the density of the same material with no pores.

```figure
type: formula
title: Porosity from an Archimedes density measurement
formula: ρ = m_air × ρ_water ÷ (m_air − m_water)     porosity = 1 − ρ ÷ ρ_sound
caption: This is an illustration. The boss specimen was cut from the junction region; the reference from the sound main wall of the same casting. The sound density must come from the same material, because graphite content alone changes the density of cast iron by more than the porosity being measured.
- m_air, m_water | mass in air and apparent mass suspended in water
- ρ_water | density of the water at its measured temperature, 0.9982 g/cm³ at 20 °C
- ρ_sound | density of the same iron without pores
step: Boss specimen: ρ = 58.42 × 0.9982 ÷ (58.42 − 50.16) = 7.060 g/cm³
step: Sound reference from the main wall: ρ = 61.80 × 0.9982 ÷ (61.80 − 53.14) = 7.123 g/cm³
step: Porosity = 1 − 7.060 ÷ 7.123 = 0.0089, or 0.9%
```

The density result, 0.9%, agrees with the area fraction of 0.8% within the precision of each, even though one measured a whole specimen of several cubic centimetres and the other a single polished plane through it. The two methods have different weaknesses: density measures the whole specimen, including pores too small to see, but cannot say where they are, while the section shows where they are but samples only one plane. Agreement between them is good evidence that both are right.

### Open and closed pores

Water enters pores that are open to the surface of the specimen, so their volume is counted as part of the water displaced and not as porosity. A specimen with open porosity reads denser than it is. Sealing the surface, for example with a thin wax coating whose mass and volume are allowed for, or measuring the specimen's volume from its dimensions when it has a regular shape, avoids the problem. For the small, closed shrinkage pores in the boss the effect was negligible, but for a specimen cut through a network of interconnected porosity it can halve the apparent porosity.

## Reading the pore shape

The shape of a pore in section is the best clue to its cause.

```figure
type: compare
title: Shrinkage and gas pores in section
rowhead: Feature
cols: Shrinkage porosity | Gas porosity
caption: The two kinds call for different remedies: shrinkage is fixed by feeding, gas by melting practice, mould and core venting. Many real castings show some of each, and the location is as telling as the shape.
- Outline | irregular, jagged, following the dendrites | round or oval, smooth walls
- Typical size | from a few micrometres to millimetres, in clusters or networks | often 0.1 to several millimetres, often single or in rows
- * Location | thermal centres and junctions: the last places to solidify | near upper surfaces, under cores, near the casting skin
- Interior surface | rough, showing dendrite tips | smooth, sometimes oxidised
- Connectivity | often interconnected through the interdendritic spaces | usually isolated
- Cause | liquid shrinkage not replaced because feeding was cut off | gas from the melt, mould or cores trapped as the metal solidified
```

The pores near the boss were irregular, clustered and followed the dendrite pattern, and they were concentrated at the junction of the flange and the boss. That is the signature of shrinkage porosity at a hot spot: a region that solidified after the sections around it had frozen, cutting off the liquid that should have fed it.

### Sizes of pores

The area fraction says how much porosity there is; its size distribution says how much each pore matters. For round gas pores, the Wicksell relations of Chapter 6 apply directly, and the true pore sizes can be estimated from their sections. Shrinkage pores are not spheres, and their sections, irregular and often branched, cannot be unfolded by those relations. For them the useful size measure is the largest section, or the largest projected area found on several sections, which Chapter 9 treats with extreme-value methods. At the boss junction the largest pore section on the 30 fields measured 0.6 mm across, roughly a fifth of the 3 mm wall of material between the sealing face and the bore at that point after machining.

## Why sections cannot show leaks

A pressure test leaks when there is a continuous path through the wall. Whether such a path exists depends on whether the pores **connect**, and that is exactly the property Chapter 1 listed as invisible in a section. Two pores that look separate in the section may meet a fraction of a millimetre above it; a network that looks broken may be continuous in three dimensions.

Connectivity has its own measure in the geometry that underlies stereology: the Euler characteristic, which, roughly, counts the number of separate pieces minus the number of tunnels through them. It is one of a family of integral-geometric measures, the Minkowski functionals, that describe the volume, surface area, mean curvature and connectivity of a structure, and it cannot be obtained from a single plane section. It can be estimated from pairs of closely spaced parallel sections, by counting how pores appear, disappear, join and split between the two planes, or measured directly in a three-dimensional image from serial sectioning or computed tomography.

In practice, the laboratory treats connectivity as a question for other tests. The pressure test itself answers it for the part as a whole, and dye penetrant on a cut and machined face shows where porosity reaches the surface. The section's job is to show what kind of porosity is present, how much and where, so that the cause can be fixed.

```figure
type: checklist
title: Plant P's porosity investigation on the leaking casings
caption: This is an illustration. The open item was the foundry's action, not the laboratory's.
- x Area fraction on systematic fields | 0.8%, concentrated at the boss junction
- x Density against a sound reference from the same casting | 0.9%
- x Pore shape and location | irregular, dendritic, at a junction: shrinkage
- x Largest pore section | 0.6 mm, against 3 mm of wall at the sealing face
- x Dye penetrant on a machined face | indications along the junction band only
- ? Pattern and riser change at the foundry | proposed, see the next section
```

## Tracing shrinkage to feeding

Shrinkage at a junction means that the junction froze last and that nothing fed it. The standard first check is **Chvorinov's rule**: the solidification time of a section is proportional to the square of its modulus, the ratio of its volume to its cooling surface area. A riser intended to feed a section must have a larger modulus than the section, by a margin, so that it stays liquid longer and can supply the shrinkage.

The [casting solidification and riser check](/tools/casting-solidification/) computes the modulus and solidification time of a casting section and of a cylindrical riser by Chvorinov's rule, the ratio of the riser's modulus to the section's, and a pattern size from a shrinkage allowance. It checks the modulus ratio against the value the user requires and reminds the user that it does not check the riser's feed volume or feeding distance. It addresses the feeding of the section, not the porosity measurement itself, so it complements this chapter rather than performing its method.

The foundry modelled the boss as a block of 400 cm³ with 300 cm² of cooling surface, its face against the flange excluded, which gives a modulus of 1.333 cm. The existing riser on the flange near the boss was 60 mm in diameter and 90 mm high, with a modulus of 1.286 cm. The tool's verdict: **riser too small**, with a modulus ratio of 0.96 against the 1.2 the foundry requires. The boss froze after its riser, so the riser could not have fed it.

```figure
type: compare
title: The boss and its riser by Chvorinov's rule
rowhead: Design
cols: Riser | Riser modulus | Modulus ratio | Tool verdict
caption: This is an illustration. Mould constant 2 min per cm², required ratio 1.2. The rule is a first check of whether the riser freezes after the section it feeds; ductile iron's graphite expansion during solidification changes feeding practice, and the foundry's methods engineer, not the rule, decides the final design.
- * Existing | 60 mm × 90 mm | 1.286 cm | 0.96 | riser too small
- Proposed | 90 mm × 135 mm | 1.929 cm | 1.45 | riser modulus sufficient
```

A riser 90 mm in diameter and 135 mm high has a modulus of 1.929 cm and a ratio of 1.45, which the tool reports as sufficient. The foundry also moved the riser closer to the boss and, because the leaking casings had been poured late from their ladles, tightened its limit on the time from magnesium treatment to pouring. The first batch with the changes passed the pressure test, and sections of two casings from it showed porosity at the junction below 0.1%.

Ductile iron is not fed quite like steel or grey iron. As it solidifies, graphite precipitates and expands, which can offset part of the liquid shrinkage if the mould is rigid enough, and foundries use methods that take this into account. Chvorinov's rule remains a sound first check of which section freezes last, which is the question the porosity raised here.

## Porosity and machining

Porosity that is harmless inside a casting can become a leak once machining cuts into it. A shrinkage band a few millimetres below the cast surface is sealed by sound metal until the sealing face is machined, and then the band is exposed or left under a thin skin that the test pressure breaks through. That is why the leaking casings passed the foundry's own visual inspection and failed only after Plant P machined the flange: the porosity had always been there, but the machining allowance on the sealing face put the finished surface within reach of it.

Two consequences follow for anyone specifying castings. First, porosity requirements should refer to the machined part, at the faces and depths that matter, not just to the casting as delivered. A drawing note such as "no porosity within 3 mm of the finished sealing face", checked by sectioning a sample, says what the designer actually needs. Second, the location of the machining allowance matters as well as its size. Reducing the allowance on the sealing face, so that less metal is removed, keeps the finished surface in the sound skin of the casting; increasing it to clean up a rough surface can cut straight into a porous zone.

Where porosity cannot be eliminated economically, vacuum impregnation, which fills interconnected porosity with a sealant, is a recognised remedy for leak paths in castings that do not carry high stresses. It treats the symptom, not the cause, and a customer may not accept it for a pressure-containing part, so it should be agreed rather than assumed. Plant P decided against impregnation for the casings once the riser change had removed the porosity at its source.

## The error: the wrong sound density

Before the reference specimen was cut, the technician had calculated the boss porosity from its density using a handbook value of 7.20 g/cm³ for ductile iron, and reported **1.9%** porosity, more than twice the area fraction. To check, the technician applied the same handbook value to a specimen from the main wall, which looked completely sound, and obtained 1.1% porosity there too.

A sound section cannot be 1.1% porous, so the reference was wrong. The density of cast iron depends strongly on how much of its carbon is present as graphite, which is far less dense than iron, and handbook values cover a range of compositions. A difference of 0.08 g/cm³ between the handbook figure and this particular iron was enough to manufacture a whole percentage point of porosity. Measured against a sound reference cut from the main wall of the same casting, the boss porosity was 0.9%, in agreement with the section.

```figure
type: bars
title: Boss porosity by density, against two sound densities
unit: %
caption: This is an illustration. The same density measurement, 7.060 g/cm³, referred to a handbook density and to a sound specimen from the same casting. Only the second agrees with the 0.8% area fraction measured in the section.
- Against the handbook value, 7.20 g/cm³ | 1.95
- * Against the sound wall of the same casting, 7.123 g/cm³ | 0.89
- Area fraction in the section | 0.8
```

## How this applies to a small Australian business

When castings leak, section them through the leak and measure porosity on systematic fields, then confirm it by density against a sound piece of the same casting. Read the pore shapes and their location: irregular pores at a junction point to feeding, round pores near a top surface point to gas. Do not expect the section to show whether pores connect; the pressure test and dye penetrant answer that. Take the location of the porosity back to the foundry with the riser check, and expect the foundry's methods engineer to make the final call on the feeding design.

## Exercise: porosity in a pump impeller hub

A specimen from an impeller hub weighs 42.60 g in air and 36.58 g suspended in water at 20 °C (0.9982 g/cm³). A sound specimen of the same iron, cut from the impeller's thin vanes, has a density of 7.115 g/cm³. (a) What is the hub specimen's density? (b) What is its porosity? (c) What would the porosity appear to be against a handbook value of 7.20 g/cm³?

**Worked answer.** (a) ρ = 42.60 × 0.9982 ÷ (42.60 − 36.58) = 42.523 ÷ 6.02 = **7.064 g/cm³**. (b) Porosity = 1 − 7.064 ÷ 7.115 = **0.0072, or 0.7%**. (c) Against the handbook value, 1 − 7.064 ÷ 7.20 = **0.019, or 1.9%**, an overestimate by a factor of more than two caused entirely by the choice of reference. The sound reference must be the same iron, preferably from the same casting.
