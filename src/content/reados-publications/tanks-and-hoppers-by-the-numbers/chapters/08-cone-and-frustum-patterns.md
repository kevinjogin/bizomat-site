---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: cone-and-frustum-patterns
order: 8
title: "Cone and frustum patterns"
description: "Develop a cone or frustum into a flat annular sector by calculation: slant height, pattern radii, sector angle and chord, at the right diameter for the joint, and catch a cone 19 mm too big round."
draft: false
---

A cone is a developable surface: it can be unrolled flat without stretching. Its flat pattern is a sector of a circle, and a frustum's pattern is a sector of a ring, an annular sector, bounded by two arcs and two straight radial edges. Draughtsmen once drew these patterns by geometric construction on the shop floor, stepping off the base circumference along an arc with dividers. Today the pattern can be calculated exactly, in a few lines, and cut by laser or plasma from the numbers.

This chapter derives the pattern of TK-1's cone: its slant height, its two pattern radii, its sector angle and the chord that sets out the sector's ends. It covers the diameter at which a pattern should be developed, which depends on how the cone joins the shell; patterns split into two halves; and checks on the result. The running case finds a cone developed for a butt joint when the joint detail called for the cone to fit inside the shell.

## The geometry of the pattern

Imagine extending a frustum's sloping side up to the apex of the full cone. Every point on the frustum's top edge is the same distance from the apex, and so is every point on its bottom edge. Unrolled, those edges become two arcs about a common centre, the apex, with radii equal to those distances. The arcs' lengths equal the circumferences of the two edges.

```figure
type: formula
title: Pattern of a cone frustum
formula: s = √((R − r)² + h²);   L₁ = R × s ÷ (R − r);   L₂ = r × s ÷ (R − r);   θ = 360° × R ÷ L₁
caption: R and r are the radii of the two edges at the diameter the pattern is developed to, h the vertical height and s the slant height. L₁ and L₂ are the pattern's outer and inner radii and θ its sector angle.
- R, r | Radii of the large and small edges
- h | Vertical height of the frustum
- s | Slant height, the width of the pattern between its arcs
step: TK-1 at mean diameters: R = 601.5 mm, r = 51.5 mm, h = 400 mm
step: s = √(550² + 400²) = 680.1 mm; L₁ = 601.5 × 680.1 ÷ 550 = 743.8 mm; L₂ = 63.7 mm
step: θ = 360° × 601.5 ÷ 743.8 = 291.14°
```

The check on any pattern is that its outer arc length equals the cone's top circumference: L₁ × θ in radians = 743.8 × 5.0814 = 3,779 mm, which is π × 1,203 mm, the mean circumference of TK-1's shell. The same check on the inner arc gives the outlet's circumference.

## The running case: TK-1's cone pattern

This is an illustration. TK-1's cone runs from the shell's 1,200 mm inside diameter to a 100 mm outlet over 400 mm, in 3 mm sheet, and butts to the bottom edge of the shell. Developed at the mean diameters, 1,203 and 103 mm, its pattern has:

- an outer radius **L₁ = 743.8 mm**;
- an inner radius **L₂ = 63.7 mm**;
- a sector angle **θ = 291.14°**, leaving a gap of 68.86°;
- a width between the arcs equal to the slant height, **680.1 mm**.

```figure
type: svg
title: TK-1's cone pattern, an annular sector
alt: A flat pattern shaped like a ring with a wedge cut out at the top. The outer radius is 743.8 mm and the inner radius 63.7 mm. The ring spans 291.14 degrees; the missing wedge at the top spans 68.86 degrees. A dimension across the open ends of the outer arc reads chord 841.0 mm.
caption: This is an illustration, drawn to scale at about 1:4.4. The two radial edges, which meet in the cone's seam, are each 680.1 mm long, the slant height.
viewbox: 0 0 400 400
body:
<path class="bxa" d="M296.1 59.8A170 170 0 1 1 103.9 59.8L191.8 188.0A14.6 14.6 0 1 0 208.2 188.0Z"/>
<path class="cl dsh" d="M200 200L296.1 59.8M200 200L103.9 59.8"/>
<path class="lf" d="M103.9 59.8L296.1 59.8"/>
<text class="txs" x="166" y="52">chord 841.0</text>
<path class="la draw" pathLength="1" d="M200 200L320.2 320.2"/>
<text class="txs" x="268" y="258">R 743.8</text>
<path class="la" d="M200 200L189.7 210.3"/>
<text class="txs" x="150" y="226">R 63.7</text>
<text class="txb" x="168" y="300">291.14°</text>
<text class="txs" x="182" y="100">68.86° gap</text>
```

## Setting out with the chord

A sector angle is awkward to set out with a protractor at a 744 mm radius: a tenth of a degree is 1.3 mm of arc. The **chord** between the ends of the outer arc is easier to measure and set out precisely. For a sector angle θ, the chord is 2 × L₁ × sin(θ ÷ 2). For TK-1's pattern, 2 × 743.8 × sin(145.57°) = **841.0 mm**. Because the sector is more than half a circle, the same chord also spans the missing gap, and it is the gap's chord that is usually measured: two points 841.0 mm apart on the 743.8 mm arc mark the ends of the pattern.

On a laser or plasma cutter, the pattern is programmed from the same numbers, and the chord becomes a check: measure across the cut pattern's open ends and compare with the calculation.

## Which diameter to develop to

A pattern must be developed to the diameter at which the cone's sheet meets its neighbour, which depends on the joint.

```figure
type: compare
title: TK-1's cone pattern by joint detail
cols: Cone top, mean diameter | L₁ | θ | Top arc length
caption: This is an illustration in 3 mm sheet. A butt joint matches the shell's mean diameter; a cone fitted inside the shell must have its outside at the shell's inside diameter, so its mean diameter is one thickness less.
- Butt joint to the shell's bottom edge | 1,203 mm | 743.8 mm | 291.14° | 3,779 mm
- *Cone fitted inside the shell | 1,197 mm | 741.5 mm | 290.59° | 3,760 mm
```

The difference looks small, 0.55° of sector angle and 2.3 mm of radius, but at the cone's top edge it is π × 6 = **18.8 mm** of circumference: a cone developed for one joint will not fit the other.

## The error: a cone 19 mm too big round

This is an illustration. The first drawing of TK-1 showed the cone butting the shell's bottom edge, and the pattern above was developed for it. A later revision changed the joint so that the cone's top edge sat just inside the shell's bottom edge, its outside touching the bore, with a fillet weld round the outside: a detail the processor's welding inspector preferred for access. The pattern was not redeveloped.

The cone was rolled, its seam welded and offered up to the shell. Its top edge, rolled to a mean diameter of 1,203 mm, had an outside diameter of 1,206 mm and would not enter the shell's 1,200 mm bore: **18.8 mm too big round**. The fit-up check caught it before welding. Because a cone's diameter changes steadily along its slant, the fix was simple: the cone's top edge was trimmed back by the slant distance that reduces its mean diameter by 6 mm. Along TK-1's slant, the radius changes by 550 mm in 680.1 mm, so a 3 mm reduction in radius needs 3 × 680.1 ÷ 550 = **3.7 mm** of trim, which shortens the cone by about 2.2 mm in height. The cone then fitted, at a cost of an hour of trimming and a cone 2.2 mm shallower than drawn, which the capacity block absorbed.

The general lesson is that a pattern belongs to a joint, not to a part. Any change to a joint detail should trigger a review of every pattern that meets at that joint, and the pattern's drawing should state the diameter it was developed to and why.

## Why calculate rather than step off

The traditional construction divides the cone's base circle into equal parts on a plan view, then steps the same number of equal divider spacings along the pattern's outer arc. Each step is a **chord** of the base circle, slightly shorter than the arc it stands for, so the stepped-off arc is always short.

This is an illustration for TK-1's 1,203 mm mean diameter. With 12 divisions, each chord is 2 × 601.5 × sin 15° = 311.4 mm, and twelve of them make 3,736 mm against the true 3,779 mm: **43 mm short**, a cone that would not close by more than a finger's width. With 24 divisions the shortfall is about 10.8 mm, and with 48 about 2.7 mm. Pattern drafters knew this and added the missing length at the end of the arc, or used finer divisions. Calculating the sector angle avoids the error entirely, which is one of the plainest gains from replacing construction with arithmetic.

```figure
type: bars
title: Shortfall of a stepped-off pattern arc for TK-1's cone
unit: mm
max: 50
caption: This is an illustration. Each divider step is a chord of the base circle; finer divisions shrink the shortfall but never remove it. The calculated sector angle has none.
- 12 divisions | 43.0
- 24 divisions | 10.8
- 48 divisions | 2.7
- *Calculated sector angle | 0
```

## Allowances on the pattern

A calculated pattern is exact for a seam whose edges touch. Real seams need allowances, and each changes the pattern in a particular way.

- **A root gap** in a butt-welded radial seam is allowed for by moving each radial edge parallel to itself by half the gap. Changing the sector angle instead would make the gap wider at the outer arc than at the inner one.
- **A lap or grooved seam** needs extra material along one or both radial edges, as wide as the seam's detail specifies.
- **A flange** at the top or bottom edge, for bolting or for a lap onto the shell, is added beyond the arc, and its own development, a flat ring or a short cone, follows the same rules.

Each allowance should be drawn on the pattern and dimensioned, not left to the cutter. The pattern's drawing should also carry the four check dimensions listed below, so that whoever cuts it can confirm the result without recalculating.

## Full cones and conical lids

A full cone, with no outlet, is the special case where the inner radius L₂ is zero and the pattern is a simple sector. This is an illustration. A conical lid for TK-1, at the shell's 1,203 mm mean diameter and a pitch of 15° from the horizontal, rises 601.5 × tan 15° = **161 mm** at its centre. Its slant height, and so its pattern radius, is 601.5 ÷ cos 15° = **622.7 mm**, and its sector angle is 360° × 601.5 ÷ 622.7 = **347.73°**, leaving a gap of only about 12.3°. Shallow cones like this are almost flat discs with a narrow wedge removed, and closing that wedge is what raises the centre.

## Checking a cut pattern

A cut pattern can be checked before it is rolled, with a tape and a straight edge:

- each **radial edge** should equal the slant height, 680.1 mm for TK-1's cone;
- the **chord** across the open ends of the outer arc should be 841.0 mm;
- the **outer arc**, measured with a flexible tape laid along it, should be 3,779 mm, and the inner arc 324 mm.

A pattern that passes these checks will roll into the intended cone if the rolls are set correctly. One that fails them should be recut, because rolling cannot recover a pattern that is the wrong size.

## Patterns in two halves

TK-1's pattern spans 291°, nearly a full ring, and nests poorly: it occupies a bounding area of about 1,488 × 1,355 mm for 1.39 m² of part. Splitting it into two halves, each 145.57° with its own radial seam, gives two pieces that nest closer together and fit smaller sheets. Each half has the same radii; its outer chord is 2 × 743.8 × sin(72.79°) = 1,420.9 mm. The cost is a second seam, 680 mm of welding and finishing, and two seams to align when the cone is rolled.

## Thick plate and shallow cones

The mean-diameter rule treats the cone's mid-thickness surface as if it lay one half-thickness outside the inside surface, measured horizontally. That is exact for a cylinder, whose wall is vertical. A cone's wall is inclined, so its mid-thickness surface lies half a thickness away **perpendicular to the wall**, which is further than half a thickness measured horizontally, and more so the shallower the cone. In 3 mm sheet the difference is a millimetre or two of circumference and is absorbed by the seam's fit-up. In thick plate, or for a very shallow cone, it is not, and the pattern should be developed on the true mid-thickness surface, with the edge preparation of each joint drawn. A CAD sheet metal model, unfolded at its neutral surface, does this automatically, and its unfolded pattern can be checked against the simple calculation: they should differ by a little, in the direction this paragraph predicts, and not by a lot.

## Rolling the pattern

The pattern is rolled into a cone on plate rolls set with one end closer than the other, so that the small edge curls tighter than the large one. The radial edges must meet without a twist, and a cone rolled with its seam out of line shows it as a step at the seam that grows towards the outlet. The calculated pattern makes rolling easier but cannot correct the rolls' setting; the check is to measure the rolled cone's top and bottom circumferences against the calculation, 3,779 mm and π × 103 = 324 mm for TK-1 at mid-thickness, or the corresponding outside circumferences.

## Oblique and offset cones

A cone whose outlet is offset from its centre, or whose top is cut at an angle, is not a right cone, and its pattern is not an annular sector. Its development is done by triangulation, dividing the surface into narrow triangles whose true lengths are calculated and laid out side by side, which Chapter 9 applies to hoppers. Many CAD systems unfold such shapes directly from a sheet metal model, and a calculated right-cone pattern remains a good check on whether the CAD unfold is of the intended shape.

## Exercise: a conical bin bottom

A conical bin bottom runs from a mean diameter of 800 mm to a mean outlet of 150 mm over a vertical height of 500 mm, with a butt joint at each edge. Calculate its slant height, pattern radii, sector angle and outer chord, and check the outer arc length.

**Worked answer.** With R = 400 mm, r = 75 mm and h = 500 mm:

- s = √(325² + 500²) = **596.3 mm**;
- L₁ = 400 × 596.3 ÷ 325 = **734.0 mm**; L₂ = 75 × 596.3 ÷ 325 = **137.6 mm**;
- θ = 360° × 400 ÷ 734.0 = **196.20°**;
- chord = 2 × 734.0 × sin(98.10°) = **1,453.3 mm**.

The outer arc is 734.0 × 196.20 × π ÷ 180 = **2,513 mm**, which is π × 800 mm, as required. Because this cone is steeper than TK-1's, its sector angle is much smaller, just over half a circle, and it nests far better: steep cones unroll into narrow sectors and shallow cones into nearly full rings.
