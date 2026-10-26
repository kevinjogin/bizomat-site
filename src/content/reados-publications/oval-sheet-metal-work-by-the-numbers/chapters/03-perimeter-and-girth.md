---
book: oval-sheet-metal-work-by-the-numbers
chapterSlug: perimeter-and-girth
order: 3
title: "Perimeter and girth of an oval"
description: "Add up an oval's four arcs for its girth, see why every offset oval's girth differs by 2π times the offset, compare the ellipse, measure the made vessel, and find a rim rod cut 24 mm short."
draft: false
---

Every piece of an oval vessel is measured along its girth: the wall's blank, the rim rod, the bottom's flange, the gasket under a lid. For a four-centre oval the girth is exact and easy, because the outline is four arcs and each arc's length is its radius times its angle. For an ellipse, there is no simple exact formula, and the usual approximations are good but not exact. The difference between the two is small for one oval and large across a production run of rims cut to the wrong number.

This chapter adds up the running case's girths at the top and bottom of the trough, shows a property of offset ovals that makes thickness and flare simple to handle, compares the ellipse's approximate girth, sets out how to measure a finished vessel's girth, and ends with a rim rod cut to an ellipse's perimeter.

## Adding up the arcs

From Chapter 2, the running case's top oval has two end arcs of 300 mm radius, each spanning 123.86°, and two side arcs of 1,575 mm radius, each spanning 56.14°. In radians, those angles are 2.1617 and 0.9799. The girth is the sum of the four arcs:

- each end arc: 300 × 2.1617 = **648.5 mm**;
- each side arc: 1,575 × 0.9799 = **1,543.4 mm**;
- total: 2 × 648.5 + 2 × 1,543.4 = **4,383.7 mm**.

The bottom oval, struck from the same centres with radii 75 mm smaller, has the same arc angles: end arcs of 225 × 2.1617 = **486.4 mm** and side arcs of 1,500 × 0.9799 = **1,469.9 mm**, a girth of **3,912.5 mm**.

```figure
type: formula
title: Girth of a four-centre oval
formula: P = 2 × (r × θ_end + R × θ_side)
caption: The running case's top oval on the mean line. Angles in radians; each end arc spans θ_end and each side arc θ_side, and the two angles add to π.
- r, R | End and side radii, 300 and 1,575 mm
- θ_side | Each side arc's angle, 2 × atan(600 ÷ 1,125) = 0.9799 rad (56.14°)
- θ_end | Each end arc's angle, π − θ_side = 2.1617 rad (123.86°)
step: End arcs: 2 × 300 × 2.1617 = 1,297.0 mm
step: Side arcs: 2 × 1,575 × 0.9799 = 3,086.7 mm
step: Girth = 4,383.7 mm
```

## The offset rule

The top and bottom girths differ by 4,383.7 − 3,912.5 = **471.2 mm**. That is exactly 2π × 75 mm, the flare times 2π, and it is not a coincidence.

When every radius of a four-centre oval changes by the same amount d, each arc's length changes by d times its angle, and the four angles add up to a full turn, 2π. So the girth changes by exactly **2π × d**, just as a circle's does, whatever the oval's proportions. The rule gives several girths at once:

- the outline 0.8 mm outside the mean line, the outside of 1.6 mm sheet, has a girth of 4,383.7 + 2π × 0.8 = **4,388.8 mm**;
- the inside outline, 4,383.7 − 5.0 = **4,378.7 mm**;
- any horizontal section of the trough, z millimetres above the bottom, is offset 75 × z ÷ 450 from the bottom oval, so its girth is 3,912.5 + 2π × 75 × z ÷ 450.

The last line is a linear function of height, which Chapter 4 uses for the trough's capacity. None of this holds for an ellipse, whose offsets are not ellipses.

```figure
type: bars
title: Girths of the running case's outlines
unit: mm
max: 4500
caption: Each pair differs by 2π times the offset between them. The top and bottom differ by 2π × 75 = 471.2 mm; inside and outside of 1.6 mm sheet by 2π × 1.6 = 10.1 mm.
- Bottom, mean line | 3912.5
- Top, inside | 4378.7
- * Top, mean line | 4383.7
- Top, outside | 4388.8
```

## The ellipse's girth

An ellipse with semi-axes a and b has no exact girth formula in elementary terms. Ramanujan's first approximation, π[3(a + b) − √((3a + b)(a + 3b))], is accurate to a small fraction of a millimetre for proportions like the running case's. For a = 900 and b = 450 mm it gives **4,359.8 mm**.

The four-centre oval of the same length and width is **23.9 mm** longer in girth, about 0.5%. That difference is the shape difference that Chapter 2 measured as up to 12.8 mm square to the outline, spread around the girth. For sizing a lid or a gasket, 23.9 mm is a large error; for estimating the sheet in a wall, it is negligible.

A simpler formula, π × (a + b), is sometimes used for an ellipse's girth. For this proportion it gives π × 1,350 = 4,241.2 mm, about 118.6 mm short of Ramanujan's value and 142.5 mm short of the oval's. It should not be used for anything that must fit.

## Girths of the pieces

The trough's walls are made in four pieces, two ends and two sides, with their seams on the lines where the arcs meet, as Chapter 7 explains. Each piece's girth at the top and bottom is its arc:

- each **end** piece runs 648.5 mm along its top edge and 486.4 mm along its bottom;
- each **side** piece runs 1,543.4 mm along its top and 1,469.9 mm along its bottom.

Seam allowances are added to these net lengths at each end of each piece. For a lapped and riveted vertical seam, an illustration, the shop adds a 20 mm lap to one end of each piece, so each end piece's blank is 668.5 mm along its top and each side piece's 1,563.4 mm.

```figure
type: compare
title: Net girths of the trough's wall pieces, mean line
rowhead: Piece
cols: Top edge, mm | Bottom edge, mm | Quantity
caption: The four pieces' top edges add to 4,383.7 mm and their bottom edges to 3,912.5 mm. Seam laps are added to each blank.
- End | 648.5 | 486.4 | 2
- * Side | 1,543.4 | 1,469.9 | 2
- Whole oval | 4,383.7 | 3,912.5 | 
```

## Dividing the girth for patterns

Patterns for curved work are built from lines spaced along the girth, and on an oval the spacing is set arc by arc, not around the whole outline. Each arc is divided into equal parts of its own angle, so that every division line runs to its own arc's centre. Chapter 6 uses these lines to develop the walls.

This is an illustration. The shop divides each end arc into six equal parts of 123.86 ÷ 6 = **20.64°**, which step **108.1 mm** along the top edge and **81.1 mm** along the bottom. It divides each side arc into four parts of 14.04°, stepping **385.8 mm** along the top and **367.5 mm** along the bottom. The side arc's divisions are fewer and longer because its curvature is gentle; a flatter curve needs fewer points to follow it.

Divisions never cross a tangent point. A division line that started on an end arc and ended on a side arc would run to neither centre, and the pattern built from it would be wrong in exactly the region where the oval's curvature changes.

## Rolling a band through two radii

A plain oval band, with vertical walls rather than flared ones, can be rolled from a single blank whose length is the girth plus the seam allowance. It is rolled in two settings: the four end portions to 300 mm radius and the side portions to 1,575 mm, with each portion's limits marked on the flat blank.

With the seam placed in the middle of one side, the tangent points fall along the blank at half a side arc, 771.7 mm, then 771.7 + 648.5 = 1,420.2 mm, then 1,420.2 + 1,543.4 = 2,963.6 mm, and finally 2,963.6 + 648.5 = 3,612.1 mm, with the last half side running from there to the far seam at 4,383.7 mm. The roller rolls the blank at the side radius, then resets and rolls each end portion between its marks at the end radius. A band rolled at a single radius throughout would be a circle, or an oval with the wrong ends, whatever its girth.

The running case's walls are not rolled as one band, because they flare and are made in four pieces, but the same marks appear on every oval job: where each radius starts and stops along the girth.

## Girths of mating parts

The offset rule makes every mating part's girth a one-line calculation. This is an illustration, for a lid that fits over the trough's rolled rim.

The rim's outermost line lies outside the wall's mean line by the rod's offset of 5.8 mm, plus the rod's 5 mm radius, plus the 1.6 mm of sheet wrapped over it: 12.4 mm in all. A lid skirt in 1.6 mm sheet with 3 mm of clearance inside it has its own mean line 12.4 + 3 + 0.8 = 16.2 mm outside the wall's mean line. Its girth is therefore 4,383.7 + 2π × 16.2 = **4,485.5 mm**, and it is struck from the trough's own four centres with every radius 16.2 mm larger: end radius 316.2 mm, side radius 1,591.2 mm.

No measuring of the finished trough is needed to make the lid, only its drawing. That is the practical value of a four-centre oval: every part that fits it shares its centres.

## Girth and sheet area

The walls' area follows from the girths too. Each wall piece is a strip whose length varies linearly from its top girth to its bottom girth, so the walls' total area is the average girth times the height measured along the wall, the slant height of Chapter 5, 456.21 mm. The average girth is (4,383.7 + 3,912.5) ÷ 2 = 4,148.1 mm, and the walls' area is 4,148.1 × 456.21 = about **1.892 m²**, which Chapter 9 turns into sheet and mass.

## Measuring a made vessel's girth

A tape around the outside of the finished trough at its top measures the outside girth, which should be about **4,388.8 mm** below the rolled rim. As on round work, the comparison must be like with like: the outside tape against the outside girth, not the mean line's 4,383.7 mm.

A tape around an oval also follows its shape faithfully only if it is pulled snug at the ends, where the curve is tightest. A tape that bridges the end arcs reads short. The shop takes three readings and uses the largest, and checks the length and width across the axes at the same time, because an oval can have the right girth and the wrong shape if the end arcs have been rolled too tightly and the sides too flat.

## Girth and the rim's joints

A rolled rim's rod has one joint, where its two ends meet, and its position matters as much as the rod's length. The shop places it in the middle of a side, where the rim's curve is gentlest and a short weld or a sleeve over the joint is easiest to make and least visible. Placed on an end arc, the rod's joint would sit where the rod is bent most tightly, and the rod's ends would tend to spring apart before the rim is rolled over them.

The rod is bent to shape before the rim is rolled, on the same two radii as the wall: the end portions to the rim's end radius, 300 + 5.8 = 305.8 mm on the rod's centreline, and the side portions to 1,575 + 5.8 = 1,580.8 mm. The marks for where each radius starts are set out along the straight rod from its joint, exactly as for a band, using the rod's own arc lengths.

## The error: a rim rod cut to an ellipse

This is an illustration. The trough's rim is rolled outward over a 10 mm steel rod, which stiffens the rim and gives it a round edge. The rod's centreline lies outside the wall's mean line by the rod's radius plus half the sheet: 5 + 0.8 = 5.8 mm. By the offset rule, the rod's length is the mean-line girth plus 2π × 5.8, so 4,383.7 + 36.4 = **4,420.2 mm**.

The first rods were cut by a hand who looked up the ellipse girth for 1,800 × 900 mm, 4,359.8 mm, and added the same 36.4 mm offset: 4,396.2 mm. Each rod was **23.9 mm** short. Bent to the trough's rim and its ends brought together, it left a gap at its joint that could not be closed without straining the rim inward and pulling the oval out of shape.

The fault was found on the first trough, when the rod would not meet. The rods for the batch had already been cut and were used on the smaller troughs of a later job. The rule since then is the one this chapter started with: a four-centre oval's girth is the sum of its arcs, calculated from its own radii, never looked up from an ellipse.

```figure
type: checklist
title: Girth checks before cutting
caption: Each check uses the oval's own arcs, not an ellipse.
- Girth calculated as the sum of four arcs | 4,383.7 mm at the top
- Offset girths by 2π × offset | inside, outside, bottom, rod
- Pieces' arcs add up to the whole girth | 2 × 648.5 + 2 × 1,543.4
- Seam laps added once per seam | 20 mm per piece
- Tape readings compared with the outside girth | 4,388.8 mm
- x Girth taken from an ellipse formula | rim rods 23.9 mm short
```

## Exercise: the smaller trough

The smaller trough from Chapter 2's exercise is 1,200 × 600 mm with a 200 mm end radius, flaring 50 mm all round over a 300 mm depth. Find its top and bottom girths on the mean line, and the length of a 10 mm rim rod in 1.6 mm sheet.

**Worked answer.** Its arc angles are the same as the running case's, 0.9799 rad for each side arc and 2.1617 rad for each end arc, and its side radius is 1,050 mm.

- Top girth: 2 × (200 × 2.1617 + 1,050 × 0.9799) = **2,922.5 mm**, two thirds of the running case's.
- Bottom girth: by the offset rule, 2,922.5 − 2π × 50 = **2,608.3 mm**.
- Rim rod: 2,922.5 + 2π × 5.8 = **2,958.9 mm**.

The rod's offset, 36.4 mm of girth, is the same on the small trough as on the large one, because it depends only on the rod and the sheet, not on the oval's size.
