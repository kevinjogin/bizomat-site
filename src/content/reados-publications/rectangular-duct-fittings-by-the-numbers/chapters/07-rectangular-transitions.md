---
book: rectangular-duct-fittings-by-the-numbers
chapterSlug: rectangular-transitions
order: 7
title: "Rectangular transitions: four flat trapezoids"
description: "Develop the 800 × 500 to 600 × 400 transition, flat on top: why every face is a flat trapezoid, each face's true height, corner edges, a fold that is not 90°, and faces cut to the fitting's length."
draft: false
---

A rectangular transition joins two different rectangles. Unlike the rectangle-to-round transition of round ductwork, which needs triangulation and part-cones, a rectangle-to-rectangle transition with parallel ends is made of four flat faces. Each face joins an edge of the inlet to the matching edge of the outlet, the two edges are parallel, and two parallel lines always lie in one plane. So every face is a flat trapezoid, and the whole fitting is four flat pieces folded at the corners.

The work is in finding each trapezoid's true height, which is not the fitting's length unless the face is parallel to the duct's axis, and in setting the corner folds, which are not always 90°. This chapter develops the running case's transition from the air handler's 800 × 500 mm outlet to the 600 × 400 mm duct, 600 mm long and flat on top, and ends with a transition whose faces were all cut 600 mm high.

## The transition's geometry

This is an illustration. The air handler's outlet is 800 × 500 mm inside, and the duct is 600 × 400 mm. The ceiling space is tight, so the designer has kept the top of the duct level through the transition: the **top is flat**. The transition is **centred sideways**, so each side moves in by (800 − 600) ÷ 2 = 100 mm. With the top flat, the bottom rises by 500 − 400 = 100 mm. The transition is **600 mm long** between its two ends.

Each face moves by a different amount:

- the **top** face does not move: it stays in one horizontal plane;
- each **side** face moves in by 100 mm over the 600 mm length;
- the **bottom** face moves up by 100 mm over the 600 mm length.

## True heights of the faces

A face's true height, the distance between its two parallel edges measured in its own plane, is the fitting's length combined with the face's movement by Pythagoras.

- **Top**: no movement, so its true height is the length, **600 mm**.
- **Sides**: √(600² + 100²) = **608.3 mm**.
- **Bottom**: √(600² + 100²) = **608.3 mm**.

The sides and bottom happen to have the same true height because each moves 100 mm, but they are different shapes: the bottom's parallel edges are 800 and 600 mm, the sides' are 500 and 400 mm.

```figure
type: formula
title: True height of a transition face
formula: true height = √(L² + m²)
caption: The running case's transition: 800 × 500 to 600 × 400 mm, 600 mm long, flat on top, centred sideways.
- L | Length of the transition along the duct, 600 mm
- m | How far that face moves square to the duct, in its own direction
step: Top: m = 0, true height 600 mm
step: Sides: m = 100 mm in, true height √(600² + 100²) = 608.3 mm
step: Bottom: m = 100 mm up, true height 608.3 mm
step: The fitting's length is a face's true height only when that face does not move
```

## The four trapezoids

With the true heights, each face's pattern is a trapezoid with its two parallel edges, the inlet's and outlet's dimensions for that face, a known distance apart.

- **Top**: parallel edges 800 and 600 mm, 600 mm apart, symmetrical. Its sloping edges are √(600² + 100²) = **608.3 mm** each.
- **Bottom**: parallel edges 800 and 600 mm, 608.3 mm apart, symmetrical. Its sloping edges are √(608.3² + 100²) = **616.4 mm** each.
- **Each side**: parallel edges 500 and 400 mm, 608.3 mm apart. Because the top is flat, the side's top edge is square to its parallel edges and 608.3 mm long; its bottom edge slopes and is 616.4 mm long. Each side is a right-angled trapezoid.

The two edge lengths are checks on each other. The transition's four **corner edges**, where the faces meet, are the top corners √(100² + 600²) = 608.3 mm and the bottom corners √(100² + 100² + 600²) = **616.4 mm**. Each corner edge appears on both faces that meet there, so the top's sloping edge must equal the side's top edge, and the bottom's sloping edge must equal the side's bottom edge. They do.

```figure
type: compare
title: The transition's four faces
rowhead: Face
cols: Parallel edges, mm | True height, mm | Other edges, mm | Net area, m²
caption: This is an illustration. Every corner edge appears on two faces with the same length, which is the check that the patterns will close.
- Top | 800 and 600 | 600.0 | 608.3 and 608.3 | 0.420
- Bottom | 800 and 600 | 608.3 | 616.4 and 616.4 | 0.426
- * Sides, each | 500 and 400 | 608.3 | 608.3 square at top, 616.4 at bottom | 0.274
```

## The corner folds

A transition made in one or two pieces is folded at its corners, and the fold angles are not necessarily 90°. The angle at each corner is set by the two faces' directions.

Calculated from the faces' planes, the **top corners stay square**: the top face is horizontal, and the side faces, though they lean inward by atan(100 ÷ 600) = 9.46°, lean in a direction that keeps them square to the top. The angle between top and side is exactly 90°.

The **bottom corners are not square**. The bottom face tilts up by 9.46° and the sides lean in by 9.46°, and the angle between their planes is **88.45°** measured between their normals, so the inside angle of the bottom corner is 91.55°. A folder set to 90° for every corner would leave each bottom corner 1.55° out, and over the 616.4 mm corner edge that is enough to stop the seam closing evenly.

The rule that follows is general. A corner between two faces that both move is not square, and its angle must be calculated or measured from the patterns before folding. A corner between a face that moves and one that does not, in a transition centred on the moving face's direction, stays square.

```figure
type: svg
title: The transition in side view and end view
alt: Two views of the transition. On the left, a side view: the top edge is level, 600 mm long, and the bottom edge rises 100 mm from the 500 mm inlet to the 400 mm outlet. On the right, an end view looking along the duct: the 800 by 500 mm inlet rectangle with the 600 by 400 mm outlet rectangle inside it, sharing the top edge and centred left to right.
caption: This is an illustration at 0.25 scale. The top is flat; the sides move in 100 mm each; the bottom rises 100 mm.
viewbox: 0 0 520 200
body:
<path class="bxa" d="M30 30H180V130L30 155Z"/>
<path class="lf" d="M30 30V155M180 30V130"/>
<text class="txs" x="80" y="22">600 long</text>
<text class="txs" x="2" y="100">500</text>
<text class="txs" x="186" y="85">400</text>
<text class="txs" x="70" y="175">bottom rises 100</text>
<rect class="bx" x="260" y="30" width="200" height="125"/>
<rect class="bxa" x="285" y="30" width="150" height="100"/>
<text class="txs" x="330" y="22">800 inlet</text>
<text class="txs" x="320" y="85">600 × 400</text>
<text class="txs" x="300" y="175">sides in 100 each</text>
```

## Making it

The running case's shop makes the transition in two L-shaped pieces, like the straight duct: one piece is the top and one side, the other the bottom and the other side, with Pittsburgh seams at the two corners where the pieces meet. Each L-piece is developed by laying its two trapezoids side by side along their shared corner edge, which becomes the fold line.

- The **top-and-side** piece: the top's 608.3 mm sloping edge is the fold line, with the side trapezoid hinged on it. The fold is 90°.
- The **bottom-and-side** piece: the bottom's 616.4 mm sloping edge is the fold line, with the other side hinged on it. The fold is 88.45° measured between the faces' normals, an inside angle of 91.55°.

Laid flat, each L-piece is not a simple shape: the two trapezoids meet along a slanted line, and the flat blank has a kink at each end of the fold line. The shop marks each piece from coordinates or by drawing the first trapezoid and hinging the second on the shared edge with the true lengths, then checks every edge against the table.

The inlet end carries a flange to bolt to the air handler, and the outlet end the transverse joint to the duct. Their allowances are added on the parallel edges, which are square to the face, so they are simple strips; the corner notches between them follow from the fold angles.

## Marking the top-and-side piece

The top-and-side L-piece is marked flat from coordinates, with the origin at the inlet's top corner on the fixed side and x along the inlet edge.

1. The **top trapezoid**: inlet edge from (0, 0) to (800, 0); outlet edge from (100, 600) to (700, 600). Its right sloping edge, from (800, 0) to (700, 600), is 608.3 mm long and is the fold line.
2. The **side trapezoid**, hinged on the fold line: its edges run square to the fold line, away from the top, 500 mm long at the inlet end and 400 mm at the outlet end. Square to the fold line, which runs 100 mm back and 600 mm along, is the direction 600 mm along and 100 mm out for every 608.3 mm; so the side's inlet corner is at (1,293.2, 82.2) and its outlet corner at (1,094.6, 665.8).
3. The **check**: the side's bottom edge, from (1,293.2, 82.2) to (1,094.6, 665.8), measures 616.4 mm, the bottom corner edge. If it does not, a coordinate has been misplotted.

The flat piece's inlet edge is not straight. It runs 800 mm along the top's edge, then turns through 9.46°, the side's lean, for another 500 mm along the side's edge. When the piece is folded, that kink closes into the 800 × 500 mm corner of the inlet. A blank cut with a straight inlet edge would leave the inlet's corner ragged, so the kink is part of the pattern and the inlet flange's allowance follows it, notched at the kink.

## The flange at the air handler

The transition's inlet bolts to the air handler's outlet, and the shop forms a 30 mm flange turned outward around the inlet, drilled to match the air handler's holes. This is an illustration; the flange width and hole pattern come from the air handler's maker.

A turned-out flange on each face is a strip along its inlet edge. On the top and bottom faces it is 30 × 800 mm, on each side 30 × 500 mm, and at each corner the flanges of the two faces meet edge to edge after notching a 30 × 30 mm square from the corner of the flat blank. Because the bottom corners are not square, their notches are not quite square either: the two flanges meet at 91.55° instead of 90°, and the notch is cut to that angle, or the corners are lapped and sealed. The top corners, being square, take ordinary square notches.

## The error: every face cut 600 mm high

This is an illustration. The first transition was set out by a hand who cut all four faces as trapezoids 600 mm high, the length on the drawing. The top was right. The sides and bottom were each **8.3 mm short** in height: 600 against 608.3 mm.

When the pieces were folded and offered together, the bottom's edges and the sides' bottom edges did not meet the inlet and outlet rectangles. With the top correct and the sides and bottom short, the outlet came out lower at the bottom than it should, and the fitting would not slip onto the duct without forcing the bottom up. The corner seams along the bottom gaped by several millimetres at the outlet end.

Only the top could be kept. The sides and bottom were recut at 608.3 mm, and the shop used the scrapped pieces to calibrate its flange notching on the 91.55° corners before cutting the new ones, so the remake cost three panels of sheet and a couple of hours but improved the second attempt. The scrap had one other use: laid against the correct pieces, it showed a new hand exactly what 8.3 mm of missing height does to a fitting, which a drawing never quite conveys.

The fault was found at assembly. The cause was the same as in every chapter of this book that deals with sloping faces: a length on the drawing is the projection of a sloping face, not its true size. The shop's check for any transition now starts with the rule above, that the fitting's length is a face's true height only if that face does not move, and with the corner-edge check that each corner edge is the same length on both faces that share it.

```figure
type: checklist
title: Transition checks before cutting
caption: Each line is a number that can be checked against another.
- Each face's movement worked out from the inlet and outlet sizes | top 0, sides 100 in, bottom 100 up
- True height of each face from length and movement | 600.0, 608.3, 608.3 mm
- Every corner edge equal on both faces that share it | 608.3 top corners, 616.4 bottom corners
- Corner fold angles calculated, not assumed | top 90°, bottom 88.45° between faces
- Inlet and outlet edges match the air handler and the duct | 800 × 500 and 600 × 400
- x All faces cut to the fitting's length | sides and bottom 8.3 mm short
```

## Concentric and offset transitions

A transition centred in both directions, with every face moving, has no square corners at all, and every face's true height differs from the length. A transition offset sideways as well as up has four different faces. The method is unchanged in every case: each face's movement, its true height by Pythagoras, its trapezoid, the corner-edge check, and the fold angles from the faces' planes.

The designer also limits how steeply a transition's faces may slope, because a steep expansion or contraction separates the airflow. Ductwork by the Numbers deals with those limits. For the fabricator, a steep face changes nothing in the method but makes the true heights and fold angles differ more from the naive values.

## Exercise: a concentric transition

A transition joins 800 × 500 to 600 × 400 mm over 600 mm with both ends centred, so that the top and bottom each move 50 mm and each side 100 mm. Find the true height of each face and the length of a corner edge. Which corners, if any, are square?

**Worked answer.**

- Top and bottom: m = 50 mm, true height √(600² + 50²) = **602.1 mm**.
- Sides: m = 100 mm, true height √(600² + 100²) = **608.3 mm**.
- Corner edges: each corner moves 100 mm sideways and 50 mm vertically, so its length is √(100² + 50² + 600²) = **610.3 mm**, the same at all four corners.

No corner is square, because every face moves; all four corners have the same fold angle by symmetry, and it must be calculated. The top and bottom are identical trapezoids, as are the two sides, so the transition can be made from two identical L-pieces, which a flat-topped transition cannot. One pattern used twice halves the marking and the checking, which is a real saving when the shop makes a batch of identical transitions for several air handlers on one job.
