---
book: plastic-parts-by-the-numbers
chapterSlug: ribs-bosses-and-sink
order: 4
title: "Ribs, bosses and the sink they can cause"
description: "Size ribs for stiffness without sink, bound the cover's deflection by hand, design screw bosses from supplier guidance and keep every feature steel safe."
draft: false
---

Ribs and bosses are how a thin-walled part does heavy work. A rib adds stiffness where a thicker wall would add weight, cooling time and sink. A boss gives a screw something to bite into. Both are also the most common cause of cosmetic defects, because every rib and boss meets the wall in a junction that is locally thicker than the wall itself. The art is to size them so they do their job while the junction stays thin enough to cool without pulling a mark into the face on the other side.

This chapter checks the cover's stiffness against the brief's 50 N press, sizes its rib grid, designs its two screw bosses and shows why the order in which features are sized affects what a mould change will cost.

## Why a rib junction sinks

Where a rib meets the wall, the plastic at the junction is thicker than either the wall or the rib alone. If the rib were as thick as the wall, the junction would be roughly half as thick again as the nominal wall, and it would cool last. As it cooled, it would pull the opposite face inwards into a shallow groove running along the line of the rib, a defect known as read-through or sink.

The remedy is to make the rib thinner than the wall. The Covestro design guide tabulates rib thickness as a percentage of the wall for its materials. For unreinforced polycarbonate it gives about 50% for minimal sink, reduced to 40% if the opposite face is high gloss, and about 66% where slight sink is acceptable. It also recommends that ribs have at least half a degree of draft per side, that rib height be limited to approximately three times the rib's base thickness and that adjacent short ribs be spaced at least two wall thicknesses apart.

## Check the plain top against the brief

The brief requires the centre of the cover to deflect no more than 1.0 mm under a 50 N hand press. The top is a 2.5 mm plate, about 155 by 95 mm inside the skirt, held around its edges by the skirt. An exact plate solution needs coefficients from a reference, but a pair of simple beam models brackets the answer and is enough to show whether ribs are needed.

Treat a 40 mm wide strip across the short direction as a beam spanning 95 mm, with the 50 N press at its centre. Its second moment of area is **40 × 2.5³ / 12 ≈ 52.1 mm⁴**, and with the reference polycarbonate's modulus of 2,400 MPa:

- If the skirt held the strip's ends only by simple support, the centre deflection would be **F L³ / (48 E I) = 50 × 95³ / (48 × 2,400 × 52.1) ≈ 7.1 mm**.
- If the skirt clamped the ends fully, the deflection would be a quarter of that, about **1.8 mm**, from **F L³ / (192 E I)**.

The real skirt lies somewhere between simple support and full clamping, and the real plate spreads load in both directions, which a single strip ignores. Even so, the more favourable bound of 1.8 mm already fails the 1.0 mm requirement. The plain top is too flexible, as the brief suspected.

## Compare a thicker wall with a rib

Chapter 2 showed that stiffness rises with the cube of thickness. To bring the clamped-strip estimate from 1.8 mm to below 1.0 mm by thickness alone, the plate would need to be about **2.5 × (1.8 / 1.0)^(1/3) ≈ 3.0 mm** thick, which adds about 17% to the part's mass and, from Chapter 2, about 44% to its cooling time.

A rib does the same job far more cheaply. Adding a rib 1.5 mm thick and 4.5 mm tall under the 40 mm strip, centred on it, turns the strip into a T-section. The combined section's centroid sits about 1.47 mm from the outer face, and its second moment of area rises to about 141 mm⁴, about 2.7 times the plain strip's, for an increase in the strip's cross-section of under 7%.

```figure
type: compare
title: Stiffening a 40 mm strip of the cover's top
cols: Second moment of area | Simple-support bound | Clamped bound | Extra material
caption: Beam-strip bounds for a single rib across the short span. The real answer lies between the bounds, which is why a plate model or a test is still needed.
- Plain 2.5 mm plate | 52.1 mm⁴ | 7.1 mm | 1.8 mm | None
- Plain 3.0 mm plate | 90 mm⁴ | 4.1 mm | 1.0 mm | 20% more plate
- Rib 1.25 × 3.75 mm | 101 mm⁴ | 3.7 mm | 0.92 mm | About 5% of the strip
- *Rib 1.5 × 4.5 mm | 141 mm⁴ | 2.6 mm | 0.66 mm | About 7% of the strip
```

The rib proportions follow the supplier's guidance. A 1.25 mm rib is 50% of the 2.5 mm wall, the minimal-sink value, and its height is limited to **3 × 1.25 = 3.75 mm**. A 1.5 mm rib is 60% of the wall, between the minimal-sink and slight-sink values, with its height limited to **3 × 1.5 = 4.5 mm**.

## Use a grid and a better model when bounds straddle the limit

The cover has a grid, not a single rib: three ribs across the short direction, at 40 mm spacing, and one along the centre of the long direction. Under a central press, the crossing ribs share the load. A rough estimate treats the two ribs through the centre as springs in parallel, each with a stiffness proportional to E I / L³. The short rib, spanning 95 mm, is about **(155 / 95)³ ≈ 4.3** times stiffer than the long one, spanning 155 mm, so it carries about 81% of the load. With the 1.5 × 4.5 mm ribs, the two bounds become about **2.1 mm** for simple support and about **0.54 mm** for clamped ends.

When the bounds straddle the criterion, hand calculation has done its job: it shows that the answer depends on how the skirt restrains the top and how the plate shares load, and that a better model is needed. This is an illustration. A plate finite element model of the whole cover, with the skirt and the full grid, gives a centre deflection of 0.78 mm with 1.5 × 4.5 mm ribs and 1.06 mm with 1.25 × 3.75 mm ribs. Both results sit between their hand bounds, which is a useful check on the model.

The 1.5 mm ribs pass and the 1.25 mm ribs narrowly fail. The design therefore uses 1.5 × 4.5 mm ribs, accepting that 60% of the wall is above the minimal-sink guideline. Two things make that acceptable: the outer face is textured, which hides slight sink, and the brief's first-off checks include an inspection for read-through along every rib line under defined lighting. The 50 N press test on the first parts will confirm the stiffness directly.

The brief's temperature range adds one more caution. The stiffness check uses the room-temperature modulus. At 60 °C, the modulus of polycarbonate is lower; the supplier's data for the actual grade should be used to repeat the check at the hot end of the range, and the press test can be repeated on a warmed part if the margin is small.

## Size the screw bosses

The cover's other end is held by two screws through the box's flange into two bosses moulded on the cover's underside. Screws made for plastics either form a thread by displacing material or cut one by removing it, and the boss must suit the screw type.

The Covestro guide gives two rules of thumb. The boss's outside diameter should be 2.0 to 2.4 times the outside diameter of the screw or insert. For thread-cutting screws in polycarbonate, the boss hole should normally be about 0.88 times the screw's outside diameter. It also recommends that the boss wall keep the same ratio to the nominal wall as a rib, to limit sink on the opposite face.

The first proposal used a 3.5 mm thread-cutting screw. The hole would be **0.88 × 3.5 ≈ 3.08 mm**, and with a boss of 7.6 mm outside diameter, within the 2.0 to 2.4 range, the boss wall would be **(7.6 − 3.08) / 2 ≈ 2.26 mm**, about 90% of the nominal wall. That is far above the rib guideline, and the boss stands directly under the cosmetic top, so it would pull a visible sink ring into the face.

The guide notes that specifying smaller screws often prevents overly thick bosses, and that small screws achieve surprisingly high retention. The cover's screws only hold it closed, so the design changes to a 2.9 mm thread-cutting screw:

- hole: **0.88 × 2.9 ≈ 2.55 mm**
- boss outside diameter: **2.0 × 2.9 = 5.8 mm**, the bottom of the range
- boss wall: **(5.8 − 2.55) / 2 ≈ 1.62 mm**, about 65% of the 2.5 mm wall

```figure
type: compare
title: Two screw choices for the cover's bosses
cols: 3.5 mm screw | 2.9 mm screw | Guideline
caption: Guideline ratios from a material supplier's design guide. The smaller screw keeps the boss wall near the rib guideline and away from sink.
- Hole diameter | 3.08 mm | 2.55 mm | 0.88 × screw diameter, thread-cutting, polycarbonate
- Boss outside diameter | 7.6 mm | 5.8 mm | 2.0 to 2.4 × screw diameter
- Boss wall | 2.26 mm | 1.62 mm | Same ratio as ribs
- *Boss wall ÷ nominal wall | 90% | 65% | About 50% to 66%
```

The boss is 10 mm tall from the top plate to the screw seat, so its hole, which the guide recommends should extend to the level of the base wall, is about 10 mm deep. That is a depth-to-diameter ratio of about **10 / 2.55 ≈ 3.9**. The guide suggests that blind holes should not normally exceed 3:1, with up to 5:1 feasible when filling progresses symmetrically around the core pin. The boss is round and fills symmetrically, so 3.9:1 is acceptable but should be confirmed with the toolmaker, who may prefer a slightly larger pin or a shorter boss.

A blend radius at the boss's base reduces stress concentration but adds thickness; the Covestro guide suggests about 0.015 inch, roughly 0.4 mm, as a good compromise for most applications. The bosses are kept away from the skirt and joined to it, if support is needed, by thin ribs rather than merged into it, because a boss merged into a wall creates exactly the kind of thick section Chapter 2 warned against.

## Keep changes steel safe

A mould is far easier to change in one direction than the other. Removing steel, by machining a slot deeper or a pocket wider, is quick and relatively cheap. Adding steel means welding hardened material and recutting it, which is slow, expensive and can compromise the steel. A design that can be corrected by removing steel is called steel safe.

Ribs are formed by slots in the core. Making a rib thicker or taller removes steel; making it thinner or shorter adds steel. The cover's ribs are therefore sized at the thin end of what the analysis supports, 1.5 mm, so that if the press test shows too much deflection, the slots can be opened up. If sink appeared instead, thinning the ribs would require welding, which is why the texture and the first-off sink inspection matter.

The same logic applies to the boss hole. The core pin that forms it can be replaced with a smaller one, removing plastic from around it, or a larger one, which removes nothing from the steel but changes the screw engagement. Toolmakers often leave critical holes undersize at first and open them up after trial assemblies with the actual screws.

## Record the feature checks with the design

Before the model goes to the toolmaker, each rib and boss is compared with the supplier's guidance and the result recorded. The list below is the cover's record. Any feature that departs from a guideline carries a reason and a check at first-off, so the departure is a decision rather than an accident.

```figure
type: checklist
title: Rib and boss checks for the cover before tool release
caption: Guideline values from a material supplier's design guide. Departures are allowed when they are reasoned and verified.
- Rib thickness 1.5 mm, 60% of wall | Above the 50% minimal-sink value; textured face and first-off sink inspection
- Rib height 4.5 mm | At the guide's three-times limit
- Rib spacing 40 mm | Far above the two-wall minimum
- Rib draft 0.5° per side | At the minimum for polycarbonate
- Boss diameter 5.8 mm for a 2.9 mm screw | Bottom of the 2.0 to 2.4 range
- Boss wall 65% of nominal | Within the rib guideline
- ? Boss hole depth 3.9 × diameter | Between the usual 3:1 and the 5:1 limit; toolmaker to confirm
- x Bosses merged into the skirt | Avoided; bosses stand clear and connect by thin ribs if needed
```

## A failure case: the ribs that matched the wall

This is an illustration. In an earlier design, a designer stiffened a similar polycarbonate cover with ribs 2.5 mm thick, the same as the wall, reasoning that a thicker rib was a stiffer rib. The model passed every stiffness check easily.

At the first trial, every rib showed through on the outer face as a faint groove, visible under raking light and plainly visible on the high-gloss version of the part. The junctions, about half as thick again as the wall, had cooled last and pulled the face inwards. Thinning the ribs meant welding the core slots, and the fix took weeks.

The failure was detectable on paper: the rib thickness was 100% of the wall against a guideline of about 50 to 66% for the material, and the CAD thickness check, run with a sphere-based method that measures the thickness at junctions, would have shown the rib roots as the thickest regions in the part. Comparing every feature's thickness with the supplier's guideline before release costs minutes.

## Exercise: a boss for a threaded insert

A later variant needs a brass threaded insert for an M4 screw, so the cover can be removed hundreds of times. The insert's outside diameter is 5.6 mm. Using the guide's boss proportion, what range of boss outside diameter should the designer start from, and what would the boss wall be at the bottom of that range, assuming the insert sits in a 5.6 mm hole?

**Worked answer.** The boss outside diameter should be **2.0 to 2.4 × 5.6 ≈ 11.2 to 13.4 mm**. At 11.2 mm, the boss wall around a 5.6 mm hole is **(11.2 − 5.6) / 2 = 2.8 mm**, about 112% of the 2.5 mm nominal wall and well above the rib guideline. A sink recess around the boss's base, coring from the cosmetic side if the appearance allows, or locating the boss against a hidden face would be needed. The insert supplier's recommended hole size and boss proportions for the chosen insert type and polycarbonate should override these general figures.
