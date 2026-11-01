---
book: adhesive-bonding-by-the-numbers
chapterSlug: wetting-and-the-contact-angle
order: 2
title: "Wetting and the contact angle"
description: "Surface tension as energy per area, Young's equation for the contact angle, measuring angles from drop photographs, the water-break and dyne-ink tests, and what an angle says about a surface."
draft: false
---

Before an adhesive can carry any load it has to make contact with the surface, molecule to molecule. The forces that hold a bonded joint together act over distances of a fraction of a nanometre, so a liquid adhesive that sits on a surface without spreading into intimate contact will set into a joint that is held by a small fraction of its area. Whether a liquid spreads or beads is decided by surface tension and its counterparts at the solid surface, and the contact angle of a drop is the simplest window onto them.

This chapter explains surface tension, derives Young's equation for the contact angle, shows how to measure angles in a workshop with a phone camera, and introduces the water-break and dyne-ink tests. Its error is a misreading of the angle that let Plant K's first stiffeners go into production on a surface that was not ready.

## Surface tension as an energy

Molecules inside a liquid are pulled equally in all directions by their neighbours. Molecules at the surface have neighbours on one side only, so they have fewer bonds and more energy. Making new surface therefore costs energy, and the energy needed per unit area of new surface is the **surface tension**, written γ. Its units are joules per square metre, or equivalently newtons per metre, and values are usually given in millinewtons per metre (mN/m), which are numerically the same as the older dynes per centimetre.

Seen as a force, surface tension acts along the surface, pulling it tight, at γ newtons per metre of edge. Seen as an energy, it is the reason liquids form round drops: a sphere has the least surface for its volume. Both views are the same quantity. Water at 20 °C has a surface tension of about 72.8 mN/m, high because water molecules hold each other by hydrogen bonds. Most organic liquids, including solvents and uncured adhesives, lie between about 20 and 50 mN/m.

Solids have a surface energy too, for the same reason, though it is harder to measure because a solid surface cannot be stretched and remeasured the way a liquid one can. Metals and their clean oxides have high surface energies, often hundreds of millijoules per square metre. Most plastics have low ones, around 20 to 50 mJ/m². Contamination matters because an adsorbed film of oil or release agent replaces the solid's own surface with a low-energy one. A molecular layer is enough.

### Pressure inside a curved surface

Surface tension also produces a pressure difference across a curved surface. For a spherical drop of radius R, the pressure inside exceeds the pressure outside by 2γ/R, the Laplace pressure. A water drop of 1 mm radius has an internal excess pressure of 2 × 0.0728 ÷ 0.001 = 145.6 Pa. The same relation drives liquid into a narrow gap that it wets, and pushes it out of one that it does not. It is the reason a wetting adhesive flows into the fine roughness of an abraded surface, displacing air, while a non-wetting one bridges the valleys and traps air beneath it.

## The contact angle and Young's equation

Put a drop of liquid on a flat solid and it settles into a shape that meets the solid at a definite angle, the **contact angle** θ, measured through the liquid. Three interfaces meet at the edge of the drop: solid to vapour, solid to liquid, and liquid to vapour. Each has its own tension, written γSV, γSL and γLV. The edge of the drop stops moving when the pulls along the solid surface balance:

```figure
type: formula
title: Young's equation for the contact angle
caption: The balance of interfacial tensions along the solid surface at the edge of a drop. A high solid surface energy and a low liquid surface tension both lower the angle. Young set out the relation in 1805.
- γSV = γSL + γLV cos θ | the tensions along the solid surface balance at the contact line
- step: cos θ = (γSV − γSL) ÷ γLV | rearranged for the angle
- step: θ = 0 when γSV − γSL ≥ γLV | complete wetting: the liquid spreads as a film
- step: S = γSV − γSL − γLV = γLV (cos θ − 1) | spreading coefficient, zero or positive for spreading
```

The equation says what the eye sees. A liquid with a low surface tension on a solid with a high surface energy has a small contact angle and spreads. A liquid with a high surface tension on a low-energy solid beads up. Water beads on polyethylene and on an oily metal, and spreads on a clean glass slide.

The equation contains γSL, the solid–liquid interfacial tension, which cannot be measured directly. That is why the angle alone does not give the solid's surface energy, and why Chapter 3 uses two different liquids to work it out. For this chapter, the useful idea is simpler: for a given test liquid, a lower contact angle means a more wettable, higher-energy surface, and a change in the angle means the surface has changed.

### Advancing, receding and roughness

A real drop does not have one contact angle. Push liquid into a drop and its edge advances at a larger angle; withdraw liquid and it recedes at a smaller one. The difference, the hysteresis, comes from roughness and from patches of different surface energy that pin the contact line. For workshop purposes a static drop, placed gently and measured within a few seconds, is adequate, provided it is always done the same way.

Roughness also exaggerates whatever the surface already does. On a surface that the liquid wets, roughness lowers the apparent angle further; on one it does not wet, roughness raises it. An abraded surface therefore looks even more wettable than the same material polished, which is one of the reasons abrasion helps bonding: it adds area and helps a wetting adhesive penetrate.

## Measuring contact angles in a workshop

A contact angle goniometer measures angles from a magnified side view of a drop placed by a syringe. A workshop can make useful measurements with much less. Place a small drop of clean water, about 4 µL from a pipette, on the surface, photograph it from the side with a phone held level with the surface, and measure the drop's height h and the radius a of its base on the photograph. For a small drop, which takes the shape of a spherical cap, the contact angle follows from those two lengths alone.

```figure
type: formula
title: The contact angle of a small drop from its height and base radius
caption: Valid for drops small enough that gravity does not flatten them, which for water means base radii well below the capillary length of about 2.7 mm. A drop of a few microlitres qualifies.
- tan(θ ÷ 2) = h ÷ a | spherical cap geometry
- step: θ = 2 × arctan(h ÷ a) | the angle from two measured lengths
- step: capillary length = √(γ ÷ ρg) = √(0.0728 ÷ (998 × 9.81)) = 2.73 mm | for water at 20 °C
```

The drop must be small because gravity flattens a large drop, lowering its height and making the method read a smaller angle than the true one. The capillary length, the scale at which gravity and surface tension are comparable, is 2.73 mm for water. A 4 µL drop has a base radius between about 1.3 and 2.4 mm across the range of angles met here, comfortably small enough.

Plant K's engineer photographed water drops on three conditions of the door skin, five drops on each, and averaged them.

```figure
type: compare
title: Water contact angles on Plant K's 5052 aluminium door skin
rowhead: Surface condition
cols: Drop height h | Base radius a | Contact angle | What it suggests
caption: This is an illustration. Averages of five 4 µL drops each, from phone photographs against a scale. The angle is 2 arctan(h ÷ a). Lower angles mean a more wettable surface.
- As received, mill finish with rolling oil traces | 1.19 mm | 1.29 mm | 85° | oil film, poorly wettable
- Wiped with isopropanol | 1.05 mm | 1.44 mm | 72° | oil reduced but not removed
- * Abraded with a non-woven pad, then wiped with isopropanol | 0.74 mm | 1.80 mm | 45° | fresh, rougher oxide, much more wettable
```

The angles are reproducible to within about 3° on one surface condition when the drops are placed the same way, which is enough to see the differences between the three conditions clearly.

## The water-break test

The quickest check of all needs no camera. Rinse the prepared surface with clean water, hold it vertical and watch the water drain. On a clean, high-energy surface the water forms a continuous sheet that thins evenly without breaking for many seconds. On a contaminated surface the sheet breaks up into islands and beads within a few seconds, the "water break". The test is sensitive to oily contamination, which is exactly the kind that ruins adhesion, and it can be done on production parts.

The water-break test has two limits. It wets the surface, which must then be dried completely before bonding, and it says nothing about a loose but clean oxide or a weak surface layer, which can be perfectly wettable and still fail. It is a screen for contamination, not a proof of a good surface.

## Dyne inks for plastics

For plastics, which have lower surface energies and are often bonded or printed, the usual workshop test uses a set of test liquids of known surface tensions, sold as dyne inks or pens. A line of liquid is drawn on the surface. If it stays as a continuous line for about two seconds, the surface's wetting tension is at least that of the liquid; if it shrinks into beads, it is lower. Working through the set brackets the surface's wetting tension. The method for plastic film is standardised in ISO 8296, which sets out the liquids and the procedure; it is named here for scope only.

On Plant K's polycarbonate window sheet, as delivered with its protective film just peeled, a 40 mN/m ink held as a line and a 46 mN/m ink beaded within a second. The sheet's wetting tension therefore lay between 40 and 46 mN/m, consistent with the surface energy estimated in Chapter 3. A sheet that had been handled without gloves and left on a bench gave a reading below 36, the effect of skin oils.

### Keeping the measurements honest

Contact angles drift with time and conditions, so a workshop method needs a few fixed rules if its numbers are to be compared from day to day. Use water from the same source, preferably distilled or deionised, because dissolved surfactants from a tap or a contaminated bottle lower its surface tension and the angles with it. Keep the drop volume constant, since very small drops evaporate quickly and large ones flatten. Measure within about ten seconds of placing the drop, before evaporation shrinks it. Measure at room temperature on a part that has reached it, because a cold part fogs and a hot one dries the drop. And place drops away from edges, fingerprints and the marks of clamps, unless the aim is to find those.

Plant K's engineer wrote these rules on a laminated card kept with the pipette and the phone stand, and recorded every reading with the date, the door number, the preparation and the operator. Within a month the log showed something no single reading could: angles on doors prepared on Monday mornings ran about 8° higher than the rest of the week. The abrasive pads were being reused from the previous week and had picked up oil. Changing pads at the start of each shift removed the difference.

## The error: below 90° means it wets

The plant's first bonding instruction for the stiffeners specified an isopropanol wipe of the skin and the flanges, nothing more. A technician checked it with water drops and recorded an angle of 72°. The trial sheet note read "below 90°, surface wets, acceptable".

The reasoning came from a rule of thumb that a contact angle below 90° counts as wetting and one above as non-wetting. That rule describes whether a liquid will be drawn into a capillary or pushed out of it. It says nothing useful about adhesion. Two things were wrong with applying it.

First, the measured liquid was water, not the adhesive. Water's surface tension of 72.8 mN/m is much higher than an epoxy's, so the epoxy wets the same surface far better than water does. A water angle of 72° does not mean the epoxy will fail to wet. But it also does not mean the surface is ready: water is used as a probe of the surface's condition, and its angle has to be compared with the angle on a known good surface, not with 90°.

Second, the comparison showed the surface was not ready. The abraded and wiped skin gave 45°; the wiped-only skin gave 72°, much nearer the 85° of the oily as-received sheet than the 45° of the prepared one. The isopropanol wipe had thinned the oil but left a film, smearing it rather than removing it. The third door in Chapter 1, whose stiffener separated leaving bare skin, had been bonded after a wipe alone.

```figure
type: decision
title: Reading a water contact angle on a surface to be bonded
question: How does the measured water angle compare with the angle on a surface prepared by the qualified method?
caption: The water angle is a comparative check of surface condition. The reference is the angle on a surface that gave good bonds in testing, not a fixed number such as 90°.
- Within a few degrees of the reference | surface consistent with the qualified preparation | bond, and keep logging the angle
- * Well above the reference | contamination or incomplete preparation | repeat the preparation and investigate the source
- Well below the reference | unusual surface, possibly a residue that wets well but bonds poorly | check the cleaning agent and rinse
```

The fix was to change the reference, not the threshold. The plant measured the water angle on surfaces prepared by the process that later passed its lap shear and durability tests, and set the acceptance as that angle plus a margin for scatter: on the abraded and wiped skin, no more than 55°. Daily drops on a sample door now check that the process is still producing that surface.

## How this applies to a small Australian business

A phone, a pipette and clean water give a surprisingly good measure of surface condition. Photograph small drops, compute the angle from height and base radius, and compare it with the angle on a surface you know bonds well. Use the water-break test as a quick contamination screen and dyne inks on plastics. Never judge a surface by "below 90°", and never assume a solvent wipe has cleaned a surface until a measurement says so.

## Exercise: checking a powder-coated part

A supplier proposes bonding a bracket to a powder-coated steel panel. Water drops of 4 µL on the coating as delivered measure h = 1.05 mm and a = 1.21 mm. After light abrasion and an isopropanol wipe they measure h = 0.80 mm and a = 1.64 mm. (a) What are the two contact angles? (b) What is the spreading coefficient of water on each surface? (c) What do the results suggest, and what else must be checked?

**Worked answer.** (a) As delivered, θ = 2 arctan(1.05 ÷ 1.21) = **81.9°**. After preparation, θ = 2 arctan(0.80 ÷ 1.64) = **52.0°**. (b) S = γ(cos θ − 1) with γ = 72.8 mN/m gives **−62.5 mN/m** as delivered and **−28.0 mN/m** after preparation. Both are negative, as expected for water on a polymer coating, but the prepared surface is much closer to spreading. (c) Abrasion and wiping made the coating considerably more wettable, probably by removing a surface-rich layer of flow additive and adding roughness. But the bond can be no stronger than the coating's adhesion to the steel underneath, which the drop test cannot see. Lap shear or pull-off tests on coated coupons, after ageing, are needed before approving the joint.
