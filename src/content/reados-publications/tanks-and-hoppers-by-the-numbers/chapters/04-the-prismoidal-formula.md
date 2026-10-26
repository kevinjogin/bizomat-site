---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: the-prismoidal-formula
order: 4
title: "The prismoidal formula"
description: "Use one formula for prisms, frustums, wedges, spheres and transitions, know why it is exact for them, apply it to a square-to-round transition and a dissimilar hopper, and check it."
draft: false
---

The frustum formula of Chapter 3 works only when the two ends of a tapering shape are similar: a circle over a circle, a square over a square. Many hoppers and transitions are not like that. A rectangular hopper tapering to a square outlet, a square hopper feeding a round valve, a chute that narrows in one direction only: none is a frustum of anything. One formula covers all of them, and the familiar shapes too, using three cross-sections instead of two.

This chapter sets out the **prismoidal formula**, explains when it is exact, and applies it to the running case's square-to-round transition and to a rectangular hopper whose ends are not similar. The error case finds that hopper's capacity overstated by 17% because its volume was estimated from the average of its ends.

## The formula

For a solid between two parallel planes a height h apart, with cross-sectional area A₁ at one end, A₂ at the other and Aₘ at mid-height:

```figure
type: formula
title: The prismoidal formula
formula: V = h ÷ 6 × (A₁ + 4 × Aₘ + A₂)
caption: Aₘ is the area of the section at mid-height, measured or calculated from the shape, not the average of the end areas.
- A₁, A₂ | Areas of the two end sections
- Aₘ | Area of the section halfway between them
- h | Perpendicular height between the ends
step: HP-400: 0.9 ÷ 6 × (1.0 + 4 × 0.625² + 0.0625) = 0.3938 m³, as the frustum formula gave
step: TK-1 cone: 0.4 ÷ 6 × (π × 0.6² + 4 × π × 0.325² + π × 0.05²) = 0.1644 m³, again as before
```

The formula is Simpson's rule applied to the cross-sectional area along the height. It is **exact** whenever the area of the section varies with height as a polynomial of degree three or less. That covers every shape whose straight-line dimensions change linearly with height, which is every shape with straight sides between its ends: prisms, pyramids, cones, frustums, wedges and the ruled transitions that sheet metal shops make. It also covers the sphere, whose section's area is a quadratic in height: with both end areas zero and a mid-height section of π × r², a 1,200 mm sphere gives 1.2 ÷ 6 × 4 × π × 0.36 = 0.905 m³, the same as 4πr³ ÷ 3.

## Why the mid-section is not the average

The formula's power is in Aₘ, the real area at mid-height. It is found from the mid-height **dimensions**, which for straight-sided shapes are the averages of the end dimensions. It is not the average of the end **areas**.

For HP-400, the mid-height section is 625 × 625 mm, the average of the 1,000 and 250 mm sides, so Aₘ = 0.391 m². The average of the end areas would be 0.531 m². Using that average in the formula collapses it back to the average-of-ends method that Chapter 3 showed overstates any taper. The rule to remember is: average the dimensions, then calculate the area.

## The running case: a square-to-round transition

This is an illustration. Below HP-400's 250 × 250 mm outlet, the processor's rotary valve has a round inlet of 200 mm diameter. The fabricator makes a transition, TR-405, 300 mm high, from the square to the round. Its surface is made of four flat triangles, one on each side of the square, and four conical corner pieces, each joining a square corner to a quarter of the circle: the standard square-to-round that Chapter 9 develops.

The section of such a transition at any height is a square with rounded corners. At a fraction t of the way up, with the square of side s at the bottom and the circle of radius r at the top, the section's half-width is (1 − t) × s ÷ 2 + t × r and its corner radius is t × r. Its area is the square of twice the half-width, less the four corner pieces cut away by the rounding, (4 − π) × (t × r)².

- At the bottom, t = 0: the square, A₁ = 0.25² = **0.0625 m²**.
- At the top, t = 1: the circle, A₂ = π × 0.1² = **0.03142 m²**.
- At mid-height, t = 0.5: half-width 0.0625 + 0.05 = 0.1125 m and corner radius 0.05 m, so Aₘ = 0.225² − (4 − π) × 0.05² = **0.04848 m²**.

The volume is 0.3 ÷ 6 × (0.0625 + 4 × 0.04848 + 0.03142) = **0.014392 m³**, about 14.4 L. A numerical integration of the section area through the height, in ten thousand slices, gives the same figure to six decimal places, as it should, because the section's area is a quadratic in t.

```figure
type: compare
title: TR-405's volume by method
cols: Volume | Error
caption: This is an illustration for the 250 mm square to 200 mm round transition, 300 mm high. The prismoidal formula with the true mid-section is exact; the others are not.
- *Prismoidal, true mid-section | 14.39 L | Exact
- Average of the end areas × height | 14.09 L | 2.1% low
- Frustum formula, misapplied to dissimilar ends | 13.82 L | 4.0% low
```

For a transition this small the errors hardly matter for capacity. They matter for a large transition, and they matter as habits: the same misapplied formulas give larger errors on larger, more dissimilar shapes.

## Rectangle-to-round transitions

The same method handles a transition from a rectangle to a round. The section at a fraction t of the height is a rectangle with rounded corners, whose half-widths in the two directions are (1 − t) × a ÷ 2 + t × r and (1 − t) × b ÷ 2 + t × r, and whose corner radius is t × r. Its area is four times the product of the half-widths, less (4 − π) × (t × r)².

This is an illustration. A transition from a 400 × 200 mm rectangle to a 200 mm round over 300 mm has end areas of 0.0800 m² and 0.03142 m². At mid-height the half-widths are 0.15 and 0.10 m and the corner radius 0.05 m, so Aₘ = 4 × 0.15 × 0.10 − (4 − π) × 0.05² = 0.05785 m². The volume is 0.3 ÷ 6 × (0.0800 + 4 × 0.05785 + 0.03142) = **0.01714 m³**, about 17.1 L, which a numerical integration confirms exactly. The average of the ends would give 16.7 L, again a little low.

## Offset shapes

Many hoppers and transitions are offset: the outlet is not under the centre of the top, because the equipment below it is not. An offset does not change the volume, provided the end sections and the height stay the same, because each horizontal section keeps its area as it slides sideways. This is Cavalieri's principle, and it means the prismoidal formula applies to an offset hopper exactly as to a centred one, using the same mid-height dimensions. The offset changes the slopes of the walls and the shapes of the patterns, which Chapter 9 handles, but not the capacity.

## The hopper stack

HP-400 and TR-405 together form the processor's feed stack: the hopper's level-full volume of about 0.694 m³ and the transition's 0.0144 m³ make about **0.708 m³** from the valve inlet to the top of the upstand. The transition adds 2% to the stack, and its contents are the last to leave when the hopper empties. That is worth knowing when the processor asks how much powder is left "in the hopper" after the level probe at the top of the transition reports empty: about 14 L, sitting in the transition above the valve.

## Rectangular hoppers with dissimilar ends

This is an illustration. The processor's second hopper, HP-410, is rectangular: 1,200 × 800 mm at the top, tapering over 800 mm to a 300 × 300 mm outlet. Its long sides and short sides slope differently, so it is not a frustum of any pyramid. Its mid-height section is (1,200 + 300) ÷ 2 by (800 + 300) ÷ 2, 750 × 550 mm, an area of **0.4125 m²**. The prismoidal formula gives:

- V = 0.8 ÷ 6 × (0.96 + 4 × 0.4125 + 0.09) = **0.3600 m³**.

The frustum formula, misapplied, gives 0.3584 m³, only 0.4% low, because the two ends are not very far from similar. The prismoidal formula is still the one to use, because it is exact and the misapplied frustum formula is not, and on a hopper with more dissimilar ends the difference grows.

## The error: HP-410 overstated by 17%

This is an illustration. The estimator who priced HP-410 used the average of the end areas: (0.96 + 0.09) ÷ 2 × 0.8 = **0.420 m³**, about 16.7% more than the true 0.360 m³. The quotation offered a hopper of "0.42 m³", and the processor's engineer, who had calculated 0.36 m³ with the prismoidal formula, queried it before the order was placed.

```figure
type: bars
title: HP-410's volume by method
unit: m³
max: 0.5
caption: This is an illustration. The average-of-ends estimate is the one most often seen on quick quotations, and it is always high for a taper.
- Frustum formula, misapplied | 0.358
- *Prismoidal formula, exact | 0.360
- Average of the end areas | 0.420
```

The fix was to calculate every hopper with the prismoidal formula, from the mid-height dimensions, and to show the three areas on the calculation sheet so that a checker could see them. The check that would have caught the error is the one from Chapter 3: an estimate that is nearer the large-end prism than the small-end prism, for a steeply tapering shape, is suspect.

## When a simpler formula is exact

The prismoidal formula is exact for all these shapes, but simpler formulas are exact for some of them, and knowing which saves work and catches errors.

```figure
type: decision
title: Which volume formula is exact for this shape?
question: The solid has two parallel ends and straight sides between them. Which formula gives its exact volume?
- Ends equal and aligned | Prism: area × height | Average of ends is also exact
- Ends similar shapes, one a scaled copy of the other | Frustum formula | Prismoidal also exact
- *Ends dissimilar, straight sides | Prismoidal formula | Frustum formula is not exact
- Section changes in one direction only, such as a trough | Average of ends × height | Area varies linearly; prismoidal gives the same
- Curved sides, such as a bulging bin | Slices, or the manufacturer's figure | Prismoidal only approximate
```

The trough case is worth noting. A chute or trough whose length stays the same while its width tapers has a section area that varies linearly with height, and for linear variation the average of the ends is exact. The exercise shows it.

## Measuring the mid-section

For a shape that is already built, the mid-section can be measured. For a shape on a drawing, it is calculated from the mid-height dimensions. Either way, it should be the section at exactly half the height between the two end planes, measured perpendicular to the axis. A section taken at the mid-point of a sloping wall, rather than at half the vertical height, is at the wrong level and gives the wrong area.

For an irregular solid, a bulging bin or a shape with a curved profile, the prismoidal formula becomes an approximation. Dividing the height into an even number of slices and applying the formula to each pair of slices, which is Simpson's rule in full, makes the approximation as close as the slices allow. A spreadsheet does this easily from a table of measured sections.

## Prismoidal formula and the CAD model

A CAD model will report a solid's volume directly, and for a modelled hopper or transition that figure is the best available, provided the model is of the internal surface. A hopper modelled as a sheet metal part with its thickness to the outside reports the volume of the steel, not the contents, and one modelled to the outside surface overstates the contents by the volume of the wall. The prismoidal formula is a quick independent check on the model: if the two disagree by more than the rounding, one of them is measuring the wrong surface.

This is an illustration. If HP-400 were modelled to its outside surface, with 3 mm walls, its ends would be roughly 1,006 and 256 mm square and its mid-section about 631 mm square, ignoring the small effect of the wall slope on the horizontal thickness. The prismoidal formula then gives about 0.4005 m³, some 6.8 L or 1.7% more than the internal 0.3938 m³. A model that reports 0.40 m³ for HP-400 is therefore probably measuring the outside, and the capacity block should be calculated from the inside. The difference grows as a hopper gets smaller and its plate thicker, so the habit matters most on the small, heavy hoppers where nobody expects it.

## Exercise: a trough chute

A trough-shaped chute keeps a constant length of 1,200 mm and narrows from 600 mm wide at the top to 150 mm at the bottom slot over a height of 500 mm. Calculate its volume with the prismoidal formula and with the average of the end areas. Why do they agree here when they did not for HP-410?

**Worked answer.** The end areas are 1.2 × 0.6 = 0.72 m² and 1.2 × 0.15 = 0.18 m². At mid-height the width is 375 mm, so Aₘ = 1.2 × 0.375 = 0.45 m². The prismoidal formula gives 0.5 ÷ 6 × (0.72 + 4 × 0.45 + 0.18) = **0.225 m³**. The average of the ends gives (0.72 + 0.18) ÷ 2 × 0.5 = **0.225 m³**, the same.

They agree because only one dimension changes. The section's area is the fixed length times a width that varies linearly with height, so the area itself varies linearly, and for a linear variation the mid-section area equals the average of the end areas. HP-410 narrows in both directions, so its area varies as the product of two linear dimensions, a quadratic, and the mid-section is smaller than the average of the ends. The prismoidal formula handles both cases; the average of the ends handles only the first.
