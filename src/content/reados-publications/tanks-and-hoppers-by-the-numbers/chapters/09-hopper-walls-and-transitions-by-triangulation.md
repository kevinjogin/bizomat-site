---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: hopper-walls-and-transitions-by-triangulation
order: 9
title: "Hopper walls and transitions by triangulation"
description: "Find true lengths from plan and height, develop pyramid hopper walls, an offset hopper and a square-to-round transition by triangulation, and catch walls cut with the vertical height for the slant."
draft: false
---

A cone unrolls into a neat sector. A pyramid hopper unrolls into flat trapezoids, one per wall, and a square-to-round transition into a chain of flat triangles and partial cones. All of them are developed the same way: by finding the **true length** of every line on the surface, from its plan length and its vertical rise, and laying the surface out flat as a set of triangles whose sides are those true lengths. That is triangulation, the general method of pattern development, and it works for any surface made of straight lines.

This chapter finds the true lengths and shapes of HP-400's walls, develops an offset hopper whose four walls all differ, and develops TR-405, the square-to-round transition of Chapter 4. The running case finds HP-400's first set of walls cut with the hopper's vertical height where the slant height belonged, 70 mm short along every hip.

## True length

A line on a drawing appears in plan with its horizontal length, and in elevation with its vertical rise. Its **true length**, the length a tape would measure along the sheet, is the hypotenuse of a right triangle with those two sides:

- **true length = √(plan length² + rise²)**.

Every pattern dimension on a sloping surface is a true length. The plan view alone always gives lines that are too short, and the elevation alone gives true lengths only for lines that happen to lie parallel to the plane of the elevation.

```figure
type: formula
title: True lengths for HP-400
formula: true length = √(plan length² + rise²)
caption: This is an illustration. HP-400's walls fall 900 mm while moving inwards 375 mm; its hips move inwards 375 mm in each direction, so 530.3 mm along the diagonal.
- plan length | Horizontal length of the line, from the plan view
- rise | Vertical height between its ends
step: Wall slant height, centre line of a wall: √(375² + 900²) = 975.0 mm
step: Hip, corner to corner: plan length 375 × √2 = 530.3 mm; true length √(530.3² + 900²) = 1,044.6 mm
step: Check: hip from the wall's own trapezoid, √(975.0² + 375²) = 1,044.6 mm
```

## HP-400's walls

This is an illustration. HP-400 is a square pyramid frustum, 1,000 mm square at the top and 250 mm square at the outlet, 900 mm high, with its outlet centred. Each wall is a flat, symmetrical trapezoid:

- top edge **1,000 mm** and bottom edge **250 mm**, the true lengths of the horizontal edges, which appear true in plan;
- a height, measured in the plane of the wall, equal to the wall's slant height, **975.0 mm**;
- sloping sides, the hips, each **1,044.6 mm**, which the trapezoid's own geometry confirms.

Four identical trapezoids, welded along their hips, make the hopper. The check that they will close is that the sloping sides of adjacent walls are equal, which they are by symmetry.

## The error: walls 70 mm short at the hips

This is an illustration. The first set of HP-400's walls was programmed from the elevation drawing, which showed the hopper 900 mm high. The programmer took 900 mm as the height of each trapezoid. Cut that way, each wall's sloping sides were √(900² + 375²) = **975.0 mm**, against the 1,044.6 mm the hips needed: **69.6 mm short**.

The walls did not close. Tacked together at the top, their bottom edges stood apart, and the outlet they formed was larger and higher than drawn. The fitter noticed at once, because the corners would not meet, and measured a wall's sloping side against the drawing's hip length, which the drawing had fortunately given. The walls were scrapped and recut with the 975.0 mm slant height. The loss was four walls of 3 mm stainless and a morning.

```figure
type: compare
title: HP-400's wall dimensions, as cut and as needed
cols: As first cut | Correct | Difference
caption: This is an illustration. Using the vertical height instead of the slant height shortens every line that slopes, and the hips most of all.
- Trapezoid height | 900.0 mm | 975.0 mm | −75.0 mm
- *Sloping side, the hip | 975.0 mm | 1,044.6 mm | −69.6 mm
- Top and bottom edges | 1,000 and 250 mm | 1,000 and 250 mm | none
```

The general lesson is that a pattern's dimensions must come from true lengths, and a pattern drawing should give at least one sloping true length, such as the hip, as a check that the cutter can measure. A pattern drawn with only its horizontal dimensions and its vertical height invites exactly this error.

## Folding instead of welding the hips

A pyramid hopper need not be four separate walls. Two adjacent walls can be cut as one piece, joined along their common hip, and folded, which halves the number of hip welds. HP-400 can be made from two such pieces, each two walls wide, with two welded hips instead of four.

The fold angle is not 90°, as it would be for a vertical box, because the walls lean inwards. The angle between two adjacent walls, measured inside the hopper, is the **dihedral angle**, found from the walls' orientations. This is an illustration. For HP-400 the interior dihedral angle at each hip is about **98.5°**, so each piece is folded about 81.5° from flat. A folder setting up for a 90° fold would produce walls that leaned at the wrong angle and an outlet that did not match the valve. The folded hip also needs its own bend allowance, as *Sheet Metal Parts by the Numbers* sets out for folded parts, so the pattern of a folded pair is not simply two trapezoids laid edge to edge.

## Thickness at the hips

A pattern developed at the inside surface gives walls whose inside edges meet; the sheet's thickness then sits outside, and how the hips are joined decides what happens there. With a butt weld at a prepared edge, each wall's hip edge is bevelled and the patterns are developed at the inside surface. With an outside corner joint, one wall overlaps the other's edge by a thickness, and one pattern of each pair must be wider by about the sheet thickness along its hips. For 3 mm sheet the adjustment is small but not negligible against the fit-up tolerance of a hip seam a metre long, and the joint detail should be decided before the patterns are cut, for the same reason that Chapter 8 found for the cone.

## An offset hopper

This is an illustration. The processor's third hopper, HP-420, has the same 1,000 mm square top, 250 mm square outlet and 900 mm height as HP-400, but its outlet is offset 200 mm towards the back, to sit over a conveyor. Its walls are still flat trapezoids, because each outlet edge is parallel to the top edge above it, but no two are alike in shape.

- The **front wall** moves inwards 575 mm as it falls 900 mm, so its slant height is √(575² + 900²) = **1,068.0 mm** and it slopes at about 57.4° from the horizontal.
- The **back wall** moves inwards only 175 mm, so its slant height is √(175² + 900²) = **916.9 mm**, about 79.0° from the horizontal.
- The two **side walls** each move inwards 375 mm, a slant height of **975.0 mm** at 67.4°, but their bottom edges are offset along their length: the outlet edge sits 575 mm from the front corner and 175 mm from the back.

The hips differ too. The two front hips are √(375² + 575² + 900²) = **1,131.9 mm** long and the two back hips √(375² + 175² + 900²) = **990.6 mm**.

```figure
type: compare
title: HP-420's walls and hips, outlet offset 200 mm to the back
cols: Inward movement | Slant height | Slope from horizontal
caption: This is an illustration. The front wall is the shallowest; for a bulk solid, its slope and the front hips' slope decide whether material flows, which a bulk solids specialist should check.
- Front wall | 575 mm | 1,068.0 mm | 57.4°
- Back wall | 175 mm | 916.9 mm | 79.0°
- Side walls, each | 375 mm | 975.0 mm | 67.4°
- *Front hips | 375 and 575 mm | 1,131.9 mm true length | shallowest line
```

## Triangulating a non-symmetrical wall

The side walls of HP-420 are trapezoids whose shape cannot be drawn from the slant height alone, because the bottom edge is not centred under the top. Triangulation lays them out exactly. Divide the wall into two triangles by a diagonal, find the diagonal's true length, and draw each triangle from its three true sides.

This is an illustration for HP-420's right-hand side wall. Its top edge runs 1,000 mm from the front corner B to the back corner C; its bottom edge 250 mm from b to c. The true lengths are:

- the front hip, B to b, **1,131.9 mm**;
- the back hip, C to c, **990.6 mm**;
- the diagonal B to c, from a plan offset of 375 mm across and 825 mm along, and the 900 mm rise: √(375² + 825² + 900²) = **1,277.2 mm**.

Drawing triangle B–C–c from its sides 1,000, 990.6 and 1,277.2 mm, then triangle B–c–b from 1,277.2, 250 and 1,131.9 mm, gives the wall's true shape. A second diagonal, C to b, of 1,063.6 mm, measured on the drawn pattern, checks it.

## TR-405: square to round

This is an illustration. TR-405 rises 300 mm from a 250 mm square to a 200 mm round, both centred. Its surface is made of:

- **four flat triangles**, one on each side of the square, each with the square's 250 mm edge as its base and its apex at the point where the circle is closest to that edge;
- **four corner cones**, each joining one square corner to a quarter of the circle.

The triangles' heights are true lengths: from the midpoint of a square edge, 125 mm from the centre, to the circle's nearest point, 100 mm from the centre, the plan length is 25 mm and the true length √(25² + 300²) = **301.0 mm**.

Each corner cone is triangulated by dividing its quarter circle into equal parts, here three, of 30° each, and finding the true length from the square corner to each division point.

```figure
type: compare
title: True lengths from a square corner of TR-405 to the circle
cols: Plan length | True length
caption: This is an illustration with the quarter circle divided into three 30° parts. The 0° and 90° lines are shared with the flat side triangles.
- To the 0° point | 127.48 mm | 325.96 mm
- To the 30° point | 84.26 mm | 311.61 mm
- To the 60° point | 84.26 mm | 311.61 mm
- To the 90° point | 127.48 mm | 325.96 mm
```

The pattern is laid out as a fan: from each square corner, the four true lengths radiate to points on the pattern's curved edge, spaced along it by the chord of each 30° division of the 200 mm circle, 2 × 100 × sin 15° = 51.8 mm. Between corners, the flat triangles are drawn from their 250 mm base and their 325.96 mm sloping sides, which are the same lines as the corner fans' 0° and 90° lines.

## Division and accuracy

Triangulating a curve with straight chords has the same weakness as stepping off a cone in Chapter 8: each chord is shorter than its arc. TR-405's twelve 30° chords total 621.2 mm against the circle's 628.3 mm circumference, about **7.2 mm short**. Finer divisions reduce the shortfall; the usual practice is to divide each quarter into enough parts that the shortfall is less than the seam's fit-up tolerance, and to check the pattern's curved edge against the true circumference before cutting. CAD unfolding does the equivalent with very fine divisions.

This is an illustration. Dividing each of TR-405's quarter circles into six 15° parts instead of three, 24 chords in all, cuts the shortfall to about **1.8 mm**; twelve parts per quarter, 48 chords, to about 0.45 mm. For a 200 mm round in 3 mm sheet, six parts per quarter is usually enough. The table of true lengths grows with the divisions, which is no burden in a spreadsheet and a real one by hand, and is why shop drafters traditionally used few divisions and added the missing length at the seam.

## Triangulation and CAD

A sheet metal CAD model will unfold a hopper or a transition directly, and for production that is usually how the patterns are made. Triangulation by hand or spreadsheet remains worth knowing for two reasons. It is the independent check: three or four true lengths calculated from the plan and height, measured on the CAD unfold, confirm that the model is of the intended shape and was unfolded at the intended surface. And it is how a fabricator develops a one-off shape on site, from measurements of an existing hopper or duct, when there is no model and no time to make one. The method is the same in both cases: find the true length of every line, then draw each triangle from its three sides.

## Exercise: the back hip of HP-420

Confirm the true length of HP-420's back hips from their plan offsets, and use it with the back wall's dimensions to check that the back wall's sloping sides match the hips. What would the back hips measure if, by mistake, the outlet were offset 200 mm to the front instead?

**Worked answer.** A back hip runs from a top corner at the back, 500 mm from the centre line in each direction, to an outlet corner at the back, 125 mm from the side centre line and 325 mm from the front-to-back centre line. Its plan offsets are 500 − 125 = **375 mm** across and 500 − 325 = **175 mm** along, and its rise is 900 mm, so its true length is √(375² + 175² + 900²) = **990.6 mm**.

The back wall is a symmetrical trapezoid, 1,000 mm at the top and 250 mm at the bottom, with a slant height of 916.9 mm, so its sloping side is √(916.9² + 375²) = 990.6 mm, which matches the hip. If the outlet were offset to the front, the back hips would take the front hips' geometry, **1,131.9 mm**, and the front hips 990.6 mm. A hopper cut from patterns for one offset and assembled the other way round would look right in plan, but its walls would not close, by about 141 mm along each hip.
