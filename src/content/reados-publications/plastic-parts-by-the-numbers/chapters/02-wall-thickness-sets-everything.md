---
book: plastic-parts-by-the-numbers
chapterSlug: wall-thickness-sets-everything
order: 2
title: "Wall thickness sets nearly everything"
description: "Choose a nominal wall from stiffness, flow and cooling, estimate cooling time from the material's thermal data and remove thick sections before they sink."
draft: false
---

If one number decides how a moulded part behaves, it is the nominal wall thickness. It sets the part's stiffness, its weight, how far the melt can flow before it freezes, how long the part must cool before it can be ejected and how much it shrinks and warps. A wall that is uniform and no thicker than it needs to be is the foundation of a part that moulds well. Most moulding defects can be traced to a place where the wall is not.

This chapter chooses the cover's nominal wall, estimates its cooling time from the material's thermal properties and shows how a single thick region can dominate the cycle and spoil the cosmetic face.

## Why uniform walls matter

Molten plastic enters the mould hot and leaves it cool. As it cools it shrinks, and the mould's packing pressure can only partly make up for that shrinkage. A thin region freezes first; a thick region stays molten in its core long after its surface has set. When the thick core finally freezes, it pulls on the surface already set around it. If the surface is still soft enough, it is pulled inwards, forming a shallow depression called a sink mark. If the surface is too stiff to follow, the core pulls away from itself instead, leaving an internal void.

Uneven walls cause a second problem: uneven shrinkage. Thick regions shrink more than thin ones, and the difference becomes internal stress or warpage when the part leaves the mould. A flat cover with a thick edge and a thin centre will bow.

For these reasons, plastic part design guides recommend a uniform nominal wall throughout, with gradual transitions where thickness must change. The Covestro design guide suggests that low-shrinkage amorphous materials, such as polycarbonate, can usually tolerate nominal wall variations of up to about 25% without significant filling, warpage or appearance problems, and that unfilled semicrystalline materials tolerate only about half that.

## Stiffness rises with the cube of the wall

A flat wall resists bending in proportion to its second moment of area, which for a strip of width b and thickness t is b t³ / 12. Stiffness therefore rises with the cube of thickness. The Covestro guide puts it practically: each 10% increase in wall thickness gives roughly a 33% increase in stiffness, which matches **1.1³ ≈ 1.33**.

That cube is a temptation. A designer worried about a flexible cover can make it much stiffer with a modestly thicker wall. The cost comes from the other effects of thickness, below, and Chapter 4 shows that ribs usually deliver the same stiffness for far less material and cooling time.

## Thin walls limit how far the melt can flow

The melt flows through the wall's thickness like water through a narrow channel, and it freezes against the cool mould steel as it goes. The thinner the wall, the higher the pressure needed to push melt a given distance, and the sooner the flow front freezes. Every material has a practical limit on the ratio of flow length to wall thickness at reasonable pressures, which the supplier can provide for a given grade, often as a chart of flow length against thickness.

The Covestro guide notes that walls thinner than about 1.5 mm may need special high-performance moulding equipment for fast filling and high injection pressures. For the cover, the longest flow path from a centre gate to the far corner of the skirt is a little over 110 mm, as Chapter 7 calculates. At 2.5 mm, that is a flow-length ratio of about 45, comfortably within what an easy-flow polycarbonate is designed to fill. At 1.5 mm it would be about 75, which would need checking against the grade's flow data and probably a mould flow analysis.

## Estimate the cooling time

Cooling usually takes most of the moulding cycle. RJG's breakdown of a measured moulding cycle found that cooling accounted for about 85% of it. Because cooling time rises with the square of the wall thickness, it is the main way that wall thickness affects part cost.

A useful estimate comes from the theory of heat conduction in a flat plate cooled from both faces. Keeping only the first term of the exact series solution gives the time for the centre of the wall to cool to an ejection temperature.

```figure
type: formula
title: Cooling time estimate for a flat wall cooled from both faces
formula: t ≈ s² / (π² α) × ln[(4 / π) × (T_melt − T_mould) / (T_eject − T_mould)]
caption: One-term conduction solution for the wall's centre. Published versions differ in their constants; treat the result as an estimate for comparing options, not a process setting.
- s | Wall thickness, mm
- α | Thermal diffusivity, mm²/s, equal to conductivity ÷ (density × specific heat)
- T_melt, T_mould | Melt and mould temperatures, °C
- T_eject | Temperature at which the part is stiff enough to eject, °C
step: α ≈ 0.20 / (1,200 × 1,200) m²/s ≈ 0.139 mm²/s
step: t ≈ 2.5² / (π² × 0.139) × ln[(4 / π) × (300 − 90) / (124 − 90)]
step: t ≈ 4.56 × ln 7.86 ≈ 9.4 s
```

The inputs need care. The reference polycarbonate's data sheet gives a thermal conductivity of 0.2 W/(m·K) and a density of 1,200 kg/m³. It does not give a specific heat, so this example assumes 1,200 J/(kg·K), a typical handbook value for solid polycarbonate near room temperature. Real thermal properties change with temperature, and a mould flow analysis would use the supplier's temperature-dependent data. The thermal diffusivity is then about **0.20 / (1,200 × 1,200) ≈ 1.39 × 10⁻⁷ m²/s**, or about 0.139 mm²/s.

The melt temperature is 300 °C, the data sheet's standard processing value. The mould temperature is 90 °C, within the recommended 80 to 120 °C. For the ejection temperature, RJG's article suggests using the heat deflection temperature or slightly below it, because the standard heat deflection test resembles the loading an ejector pin applies; the reference grade's value at 1.80 MPa is 124 °C.

With those inputs, the estimate is about 9.4 s. RJG recommends adding a margin, suggesting about 20% as a rule of thumb, to allow for variation in material and machine; that gives about **9.4 × 1.2 ≈ 11.3 s** as a planning figure for the cooling portion of the cycle.

## See how strongly thickness drives cooling

Repeating the estimate for other thicknesses, with everything else unchanged, shows the square law at work.

```figure
type: bars
title: Estimated cooling time against wall thickness
unit: s
max: 40
caption: One-term estimate with the reference inputs and no margin. A 5 mm section needs four times the cooling of a 2.5 mm wall.
- 2.0 mm wall | 6
- *2.5 mm wall, the cover | 9.4
- 3.0 mm wall | 13.5
- 5.0 mm local section | 37.6
```

Reducing the wall from 2.5 to 2.0 mm, 20% thinner, cuts the estimated cooling time from about 9.4 to 6.0 s, about 36% less. Increasing it to 3.0 mm raises the cooling time to about 13.5 s, about 44% more. A local section 5 mm thick, perhaps where a boss merges into the wall, needs about 37.6 s, four times the nominal wall's time, and the whole part must wait for it.

Mould temperature matters too. At 80 °C the estimate for the 2.5 mm wall falls to about 8.4 s; at 110 °C it rises to about 13.0 s. A hotter mould lengthens the cycle, but it may be chosen deliberately for better surface finish, lower moulded-in stress or more consistent shrinkage. That is a decision for the moulder and designer together, not something the cooling formula decides alone.

## Choose the cover's nominal wall

The brief requires a centre deflection under a 50 N press of no more than 1.0 mm, fill without difficulty and no sink on the cosmetic face. A 2.5 mm wall in polycarbonate is a common, easily moulded choice for a cover of this size, gives a comfortable flow-length ratio and a cooling time of about ten seconds. Chapter 4 shows that the plain 2.5 mm top would deflect too much under the press on its own, and that a rib grid fixes it with far less penalty than a thicker wall.

The designer therefore fixes 2.5 mm as the nominal wall, with the intention that every feature either matches it or is thinner, and that nothing is more than about 25% thicker except where a local exception is designed and justified.

## Keep corners at constant thickness

Corners are where uniform walls are most often lost. If the inside and outside of a corner have the same radius, or if the outside is sharp, the wall is thicker at the corner than elsewhere. The Covestro guide's rule is to make the outside radius one wall thickness larger than the inside radius, with both centred on the same point, so that the thickness stays constant around the bend.

```figure
type: svg
title: A corner that keeps the wall thickness constant
alt: Three corner sections side by side. The first has a sharp outside corner and a small inside radius, so the corner is thick. The second has equal inside and outside radii, so the corner is thin at the outside. The third has an outside radius equal to the inside radius plus the wall thickness, drawn from the same centre, so the wall is uniform around the corner.
caption: For the cover's 2.5 mm wall, an inside radius of 1.0 mm calls for an outside radius of 3.5 mm. The thickness then stays 2.5 mm around the corner.
viewbox: 0 0 640 250
body:
<path class="bx" d="M40 40H70V170H170V200H40Z"/>
<path class="lf" d="M70 165Q70 170 75 170"/>
<text class="tx txs" x="40" y="230">Sharp outside: thick corner</text>
<path class="bx" d="M250 40H280V160Q280 170 290 170H380V200H290Q250 200 250 160Z"/>
<text class="tx txs" x="236" y="230">Equal radii: uneven wall</text>
<path class="bxa" d="M460 40H490V160A10 10 0 0 0 500 170H600V200H500A40 40 0 0 1 460 160Z"/>
<circle class="fa pulse" cx="500" cy="160" r="4"/>
<text class="txa" x="470" y="230">Outside R = inside R + t</text>
<text class="tx txs" x="510" y="150">Common centre</text>
```

For the cover, the corners between the top and the skirt use an inside radius of 1.0 mm and an outside radius of 3.5 mm. The inside radius also matters for strength: a sharp inside corner concentrates stress, and the Covestro guide shows the stress concentration factor rising steeply as the ratio of radius to wall thickness falls below about 0.2. With a 1.0 mm inside radius in a 2.5 mm wall, the ratio is **1.0 / 2.5 = 0.4**, clear of that steep region.

## Check the wall against impact and other requirements

Thickness affects more than stiffness and cycle time. Two other effects are worth checking before the wall is fixed.

The first is impact behaviour. A thicker wall usually absorbs more energy before it breaks, but not always. The Covestro guide explains that some materials, polycarbonate among them, lose impact strength sharply above a limit called the critical thickness, changing from a ductile, tearing failure to a brittle one. It gives the critical thickness for a medium-viscosity polycarbonate at room temperature as approximately 3/16 inch, about 4.8 mm, and notes that it falls at lower temperatures. The cover's 2.5 mm wall is well inside the ductile range, but a designer tempted to thicken a polycarbonate wall for toughness should check the grade's data first, because thicker can be more brittle.

The second is any property that the product standard ties to thickness. Flammability ratings, for example, are listed together with the minimum wall thickness at which the rating applies; the Covestro guide makes this point about UL flammability ratings. If the box's product standard requires a rating, the grade's rating must be valid at 2.5 mm or less, because the thinnest flammability-relevant wall governs. The brief's open item on flammability therefore links directly to the choice of wall.

Neither check changes the cover's design, but both are the kind of question a reviewer will ask, and both are answered in a line each once the data has been looked up.

## A failure case: the pad under the boss

This is an illustration. The first model of the cover has its two screw bosses standing on solid pads, 5 mm thick, merged into the top plate, because the designer wanted the bosses to feel solid. The CAD system's wall-thickness check, run during a design review, colours the pads deep red against the green 2.5 mm wall.

The consequences are predictable from this chapter. Each pad has twice the nominal thickness, so its estimated cooling time is about four times longer, around 38 s instead of about 9 s, and the whole cycle would have to wait for it or eject a soft part. Each pad sits directly under the cosmetic top face, so its shrinkage would pull a visible sink mark into that face. A void might form in its core.

The fix is to core the pads out, leaving walls no thicker than the nominal, and to support the bosses with thin ribs or gussets instead, as Chapter 4 describes. The thickness check is the detection tool: it takes seconds, and it should be run on every moulded part before the design is released to the toolmaker, with the results compared against the nominal wall and the 25% guideline.

## Blend the transitions you cannot avoid

Some thickness changes are unavoidable, for example where a thicker region is needed for a threaded insert. Make the change gradual, with a taper or a generous blend rather than a step, and arrange the flow so the melt enters the thicker region first and fills towards the thinner. Melt flowing from thin to thick has to push through the thin section, which may freeze before the thick section is packed, leaving it short of material and prone to sink and voids.

Where the gate can be placed is constrained by the mould, so this is another decision for the design review with the toolmaker. Chapter 7 returns to gate placement.

## Exercise: the cost of a thicker wall in time

Using the one-term estimate and the same inputs, what is the cooling time for a 3.0 mm wall with a 20% margin, and how much longer is it than for the 2.5 mm wall with the same margin? If the moulding machine costs A$85 an hour to run, excluding GST, what does the extra time cost per cover?

**Worked answer.** The estimate for 3.0 mm is about 13.5 s, so with a 20% margin it is about **13.5 × 1.2 ≈ 16.2 s**. The 2.5 mm wall with the same margin is about 11.3 s, so the thicker wall adds about **5.0 s** per cycle. At A$85 an hour, machine time costs **85 / 3,600 ≈ A$0.0236** per second, so the extra 5.0 s costs about **A$0.12** per cover, excluding GST. Over 8,000 covers a year, that is about A$940 a year in machine time, plus the extra material from Chapter 1's exercise. A rib grid that gives the stiffness without the thickness avoids both.
