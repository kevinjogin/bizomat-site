---
book: rectangular-duct-fittings-by-the-numbers
chapterSlug: single-plane-offsets
order: 5
title: "Offsets in one plane"
description: "Develop a 300 mm offset over a 900 mm run, mitred and radiused: offset and cut angles, the Z-shaped cheek, equal side wrappers, a 750 mm S-curve and a second joint cut the wrong way."
draft: false
---

An offset moves a duct sideways or up and down while keeping its direction. It is two bends in opposite directions: the duct turns away, runs at a slope, and turns back. In rectangular duct, the two bends can be mitred joints, giving a straight sloping section between them, or radius curves, giving a smooth S. Either way, the fitting's inlet and outlet must end up parallel and the right distance apart, and that depends on getting each bend's angle right and turning the second the opposite way to the first.

This chapter develops the running case's single-plane offset, which moves the 600 × 400 mm duct 300 mm sideways over a 900 mm run with the 600 mm dimension in the plane of the offset. It makes the fitting both ways, mitred and radiused, finds that the radiused version's centreline radius comes out at exactly 750 mm, and ends with a mitred offset whose second joint was cut the same way as its first.

## The offset's geometry

This is an illustration. Along the hall's roof, the duct must step 300 mm sideways to pass a column bracket, and the drawing allows a run of 900 mm between the two bend points. The offset is in plan, so the duct's 600 mm width is in the plane of the offset: the **cheeks** are the top and bottom faces, 600 mm across, and the **wrappers** are the two 400 mm side faces.

The sloping section's centreline rises 300 mm across over 900 mm along, so it runs at an **offset angle** of atan(300 ÷ 900) = **18.43°** to the duct's direction, and its length between the bend points is √(300² + 900²) = **948.7 mm**.

Each bend turns the duct through the offset angle, 18.43°, the first one way and the second the other. The angle follows from the two numbers the drawing gives, and it changes quickly with the run. The same 300 mm offset over a 600 mm run would need 26.57° bends; over 1,200 mm, 14.04°; over 300 mm, 45°. A longer run means gentler bends and a lower pressure loss, but more duct and more room. The run is the designer's choice within the space available, and the fabricator works out every other number from it, rather than taking an angle from a drawing that may have been sketched rather than calculated. If the drawing gives both an angle and a run and they disagree, the run and offset, which are measured on site, usually govern, and the shop asks before cutting. Each bend is a mitre joint whose plane bisects the turn, so each is cut at **9.22°** from square, as Chapter 3's rule requires.

## The mitred offset

The mitred offset is made as one fitting: a short straight tangent at each end, the sloping section between them, and two mitre joints. This is an illustration. The shop gives the fitting 150 mm tangents, so that it occupies 150 + 900 + 150 = 1,200 mm of run, one coil width.

A useful fact makes the pieces simpler than they look. The two mitre planes bisect the same pair of directions, the duct's and the slope's, so they are **parallel**. The sloping section is therefore a prism cut by two parallel planes, and all four of its long edges are the same length as its centreline, **948.7 mm**. Its side faces are rectangles, 948.7 × 400 mm, and its top and bottom faces are parallelograms.

The tangents are not symmetrical. At each mitre, the 600 mm cheek's two edges differ in length by 600 × tan 9.22° = **97.4 mm**, half each side of the centreline. So each 150 mm tangent is 150 + 48.7 = 198.7 mm long on one side and 150 − 48.7 = 101.3 mm on the other, and the long side of the first tangent is on the opposite side from the long side of the second.

```figure
type: formula
title: Mitred single-plane offset
formula: offset angle = atan(offset ÷ run)        cut = offset angle ÷ 2
formula: sloping edges = √(offset² + run²)        tangent edges = t ± (w ÷ 2) × tan(cut)
caption: The running case's offset: 300 mm over a 900 mm run, 600 mm in the plane of the offset, 150 mm tangents.
- w | Duct dimension in the plane of the offset, 600 mm
- t | Tangent length on the centreline, 150 mm
step: Offset angle = atan(300 ÷ 900) = 18.43°; each joint cut 9.22° from square
step: Every long edge of the sloping section = √(300² + 900²) = 948.7 mm
step: Tangent edges = 150 ± 300 × tan 9.22° = 198.7 and 101.3 mm
step: Each side, end to end: 198.7 + 948.7 + 101.3 = 1,248.7 mm, the same on both sides
```

The last line is a good check. Both side wrappers come out at the same total length, 1,248.7 mm, because what one side gains at the first joint it loses at the second. A mitred offset whose two side wrappers are different lengths has a cut on the wrong side or the wrong angle.

## The cheek and the wrappers

Each **cheek** is a single Z-shaped piece: a tangent, the parallelogram of the sloping section, and another tangent, with the mitre lines between them each 600 ÷ cos 9.22° = **607.8 mm** long. It is cut from one blank, its outline marked from the edge lengths above, and the mitre lines are not cut but scribed lightly, because the cheek is flat and needs no fold at a mitre: its only change of direction is in its edges.

The **side wrappers** are each one strip, 400 mm wide and 1,248.7 mm long, folded at two lines by 18.43°, the first fold one way and the second the other. On one wrapper the folds fall 198.7 mm and 1,147.4 mm from its start; on the other, 101.3 mm and 1,050.0 mm. A fold of 18.43° in 0.8 mm sheet is a light set on the folder.

```figure
type: compare
title: Pieces of the mitred offset
rowhead: Piece
cols: Quantity | Net shape and size, mm | Folds
caption: This is an illustration. Seam allowances are added as Chapter 9 sets out. Both side wrappers are 1,248.7 mm long; their folds fall at different places.
- Cheek | 2 | Z-shape: tangents 198.7 / 101.3, sloping 948.7, 600 across | none
- Side wrapper A | 1 | 1,248.7 × 400 | 18.43° at 198.7 and 1,147.4
- * Side wrapper B | 1 | 1,248.7 × 400 | 18.43° at 101.3 and 1,050.0
```

## The radiused offset

A smoother offset replaces the two mitres with two radius curves meeting at the middle, with no straight between them: an S-curve. Its geometry has a neat solution. For two arcs of the same centreline radius R, each turning through angle θ, the run is 2R sin θ and the offset 2R(1 − cos θ). Dividing one by the other gives tan(θ ÷ 2) = offset ÷ run.

For the running case, tan(θ ÷ 2) = 300 ÷ 900, so θ ÷ 2 = 18.43° and each arc turns through **θ = 36.87°**. The centreline radius is then R = 900 ÷ (2 sin 36.87°) = 900 ÷ 1.2 = **750 mm** exactly.

With 600 mm in the plane of the offset, each arc's throat radius is 750 − 300 = 450 mm and its heel radius 750 + 300 = 1,050 mm. The cheeks are S-shapes made of two annular sectors of 36.87°, one turning each way. Each side wrapper runs along the throat of one arc and the heel of the other: 450 × 0.6435 + 1,050 × 0.6435 = 289.6 + 675.7 = **965.3 mm**, the same on both sides and equal to the centreline length, 2 × 750 × 0.6435 = 965.3 mm.

The radiused offset's wrappers, at 965.3 mm, are slightly longer than the mitred offset's sloping section of 948.7 mm, because a curve between the same two points is longer than the straight line; with the same 150 mm tangents added, its wrappers would be 1,265.3 mm against the mitred offset's 1,248.7 mm. It also has no sharp turns, which suits the airflow, and it needs curved wrappers formed as in Chapter 4.

```figure
type: compare
title: Mitred and radiused versions of the 300 mm offset
rowhead: Quantity
cols: Mitred | Radiused S-curve
caption: This is an illustration. Both move the 600 × 400 mm duct 300 mm sideways over a 900 mm run between bend points.
- Turn at each bend | 18.43°, sharp | 36.87° each arc, smooth
- Cut or radius | joints cut 9.22° from square | centreline R 750, throat 450, heel 1,050
- Side wrapper length, without tangents | 948.7 sloping + tangent parts | 965.3
- * Cheek shape | Z with parallelogram middle | S of two annular sectors
- Wrapper forming | two light folds | curved both ways
```

## The error: a second joint cut the same way

This is an illustration. The first mitred offset was cut from a cheek pattern drawn quickly by a hand who drew the first mitre correctly at 9.22° and then copied it for the second mitre by sliding the same line along the cheek, so that both mitre lines leaned the same way. The cheek looked like a long parallelogram with a tangent at each end.

The fitting turned 18.43° at the first joint and another 18.43° in the same direction at the second, so the outlet left at **36.87°** to the inlet instead of parallel to it. The side wrappers gave it away before assembly: their totals came out unequal, because each side gained at both joints or lost at both, instead of gaining at one and losing at the other.

The shop found it at the floor setting-out, where the outlet's line missed its mark by a wide angle, and recut the cheeks. Its pattern check for every offset now includes the equal-wrapper rule: the two side wrappers of any offset, mitred or radiused, must be the same length, and the mitre lines on an offset's cheek lean in opposite directions.

```figure
type: checklist
title: Offset checks before cutting
caption: Each check is independent of the arithmetic that produced the pattern.
- Offset angle from offset and run | 18.43° for 300 over 900
- Each joint cut at half the offset angle | 9.22°
- Mitre lines on the cheek lean in opposite directions | they are parallel to each other
- Both side wrappers the same total length | 1,248.7 mm each
- Inlet and outlet parallel on the floor setting-out | offset 300 mm between centrelines
- x Second mitre copied from the first without reversing | outlet at 36.87°
```

## Marking the cheek from coordinates

The Z-shaped cheek is easiest to mark, and to check, from coordinates. Take the origin at the inlet's corner on the outside of the first bend, with x along the duct and y across it. The cheek's eight corners are then:

- the outer edge: (0, 0), (198.7, 0), (1,098.7, 300) and (1,200, 300);
- the inner edge: (0, 600), (101.3, 600), (1,001.3, 900) and (1,200, 900).

Every number in the list can be checked against something else. The sloping segments run 900 mm along and 300 mm across, so each is √(900² + 300²) = 948.7 mm. The inlet edge and outlet edge are each 600 mm, square across the duct. The mitre lines, from (198.7, 0) to (101.3, 600) and from (1,098.7, 300) to (1,001.3, 900), are each √(97.4² + 600²) = 607.8 mm and lean opposite ways. And the outlet sits 300 mm across from the inlet, the offset.

On a CNC table the same list is the cutting file's outline, and on the bench it is eight points marked from a straight datum line with a square and a tape. Both cheeks come from the same list, one turned over.

## Seams at the folds

The side wrappers fold at the mitre lines, and the cheeks' Pittsburgh flanges must follow the folds. Where a wrapper changes direction by 18.43°, the cheek's flange along that edge changes direction by the same angle in its own plane. A flange turned on a straight edge that has a corner in it must be notched at the corner, or the flange buckles on the inside of the corner and tears on the outside.

The shop notches each cheek's flange with a small V at every corner of the Z: at the two bends on each edge. On the inside of a bend, the V removes the material that would overlap as the flange closes up; on the outside, a straight slit lets the flange open out. The notches are part of the pattern, marked from the same coordinates, because a notch cut by eye at the bench is either too small to close or too large to seal.

## Choosing between them

The mitred offset is quicker to make: flat pieces, light folds, straight cuts, all within the shop's ordinary equipment. The radiused offset is kinder to the airflow and quieter, at the cost of curved wrappers and S-shaped cheeks that take more care to mark and form. Ductwork by the Numbers deals with the pressure loss of each; the specification usually says which is wanted.

There is a third option worth knowing: two 45° mitred elbows with a straight between them, which turn the duct through larger angles and give a shorter offset for the same displacement. For a 300 mm offset, the straight between them is 300 ÷ sin 45° = 424.3 mm along its centreline, and the run is only 300 mm plus the elbows' own lengths. It suits a tight space where a 900 mm run is not available, at the price of a higher pressure loss.

## Exercise: a shallower offset

Further along the run, the main duct must drop 250 mm over a 1,000 mm run, an offset in elevation, so its **400 mm** dimension is in the plane of the offset. Find the offset angle, the cut angle, the sloping section's edge length, the mitre line's length on the cheek, and the difference between the tangent edges at each joint. Then find the radiused version's arc angle and centreline radius, and its side wrapper length.

**Worked answer.** With the 600 × 400 duct, 400 mm in the plane of the offset:

- Offset angle: atan(250 ÷ 1,000) = **14.04°**; each joint cut at **7.02°**.
- Sloping edges: √(250² + 1,000²) = **1,030.8 mm**.
- Mitre line on the 400 mm cheek: 400 ÷ cos 7.02° = **403.0 mm**.
- Tangent edge difference at each joint: 400 × tan 7.02° = **49.2 mm**.
- Radiused: tan(θ ÷ 2) = 0.25, so θ = **28.07°**, and R = 1,000 ÷ (2 sin 28.07°) = **1,062.5 mm**; each side wrapper is 2R × θ in radians = **1,041.2 mm**.

A shallower offset needs a larger radius and smaller cuts, and its mitred and radiused versions differ less, because there is less turning to do. Because this offset is in elevation, its cheeks are the two 400 mm side faces and its wrappers the 600 mm top and bottom faces; the top wrapper folds down at the first joint and up at the second, and both wrappers are the same length, as the equal-wrapper rule requires.
