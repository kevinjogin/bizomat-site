---
book: transitional-elbows-by-the-numbers
chapterSlug: round-to-flat-oval-elbows
order: 8
title: "Round to flat-oval elbows"
description: "Develop F5, an elbow from Ø250 round to a 350 × 150 flat oval: matching the oval's straights and semicircles to the circle, a half pattern from the seam, and an oval taken as an ellipse."
draft: false
---

A flat oval is a round duct that has been squashed to fit a shallow space: two semicircular ends joined by two straight sides. It passes where a round duct of the same area cannot, between roof purlins, under a beam or through a narrow wall cavity, and it keeps most of the round duct's stiffness and low resistance. The fitting from round to flat oval is a close relative of the rectangle-to-round: the oval's straight sides take the place of the rectangle's edges, and its semicircles take the place of the corners.

This chapter develops F5, the DX-3 elbow from round to flat oval. It sets out the flat oval and its area, matches the oval's points to the circle's, calculates the lines, lays out the half pattern from the seam, and ends with an oval that was taken to be an ellipse.

## F5 and its flat oval

This is an illustration. The DX-3 main runs up from the workshop and must turn horizontal to pass between two roof purlins with 180 mm of clear depth. A Ø250 round duct will not fit; a flat oval 150 mm deep will. F5 turns the duct from vertical to horizontal and changes it from round to flat oval at the same time.

The flat oval is 350 mm wide and 150 mm deep on the mean line. Its ends are semicircles of 75 mm radius, half the depth, and its straight sides are 350 − 150 = 200 mm long. Its perimeter is twice the straights plus one full circle of the ends' diameter:

perimeter = 2 × 200 + π × 150 = **871.2 mm**,

and its area is a 200 × 150 rectangle plus a 150 mm circle, 30,000 + 17,671 = **47,671 mm²**. The Ø250 round duct's area is 49,087 mm², so the flat oval's is within 3%, and the air speed through it is almost unchanged. The Library’s [Oval Sheet Metal Work by the Numbers](/reados/publications/oval-sheet-metal-work-by-the-numbers/flat-ovals/) covers flat ovals as vessels and ducts in more detail.

## F5 in coordinates

The axes follow F1's arrangement, because F5 is also an elbow from a vertical end to a horizontal one. The flat-oval end lies in the vertical plane x = 0, centred at the origin, with its 350 mm width along y and its 150 mm depth along z. Its straight sides run along y at z = ±75 mm, from y = −100 to +100, and its semicircular ends are centred at y = ±100. The round end is Ø250, horizontal, centred at (250, 0, 300), exactly like F1's.

A point on the +y semicircle, at angle ψ measured from the top, is at (0, 100 + 75 sin ψ, 75 cos ψ): ψ = 0° is the top of the semicircle, where it meets the top straight, ψ = 90° is its outermost point at y = 175, and ψ = 180° is the bottom, where it meets the bottom straight.

## Matching the oval to the circle

The construction follows the rectangle-to-round.

- The **top straight**, nearest the round end's throat, is joined to the circle point at θ = 180°, (125, 0, 300), by a flat triangle. The straight is parallel to y, and so is the circle's tangent at θ = 180°, so the triangle is tangent to the surfaces either side of it.
- The **bottom straight** is joined to θ = 0°, (375, 0, 300), the farthest point, by a flat triangle that sweeps up the back of the elbow.
- Each **semicircle** is joined to the half of the circle on its side. The +y semicircle, from its top at ψ = 0° to its bottom at ψ = 180°, is matched with the circle from θ = 180° round through θ = 90° to θ = 0°.

The semicircle and the half circle are both divided into six, so each step on the semicircle is 30° and 39.3 mm of arc, and each step on the circle is 30° and 65.4 mm of arc. Between them, the surface is triangulated in a zigzag: from each oval point, a line to the circle point it is matched with, then a diagonal to the next circle point, then a line from the next oval point back to it.

The difference from F1 is in that band. F1's corners are points, and the fans from them are exact cones. F5's semicircles are curves, so the band between each semicircle and its half circle is a surface between two curves in planes at right angles. It is not a cone, and it is not exactly developable. Like F2, it is triangulated, and its accuracy depends on its divisions.

## Why match by equal angles

The semicircle has six divisions and the half circle has six, so each oval point is matched with a circle point the same fraction of the way round. There are other ways to match two curves, and the choice changes the surface.

- **Equal angles**, as here, matches the semicircle's top with the circle's throat, its outermost point with the circle's side, and its bottom with the circle's back. The band's lines sweep smoothly from the top flat triangle to the bottom one.
- **Equal arc lengths along the whole perimeter** would match the oval's 871.2 mm with the circle's 785.4 mm in proportion, point for point, ignoring where the straights and semicircles begin. On a fitting with flat triangles, that puts some of the circle's points against the straights, and the triangles are no longer flat.
- **Nearest points** joins each oval point to the circle point closest to it in space. On an elbow, the nearest points crowd towards the throat, and the band's lines bunch there and spread at the back.

Equal angles is the right choice when the two curves are geometrically alike, as a semicircle and a half circle are. The test is the one in the next section: the lines should grow steadily round the fitting, and none should cross another on the surface.

## The lines

The fitting is symmetric about the plane y = 0, with two lines in that plane: the **seam** from the middle of the top straight, (0, 0, 75), to θ = 180°, and the **centre line** from the middle of the bottom straight, (0, 0, −75), to θ = 0°. The seam is the shorter, √(125² + 225²) = **257.4 mm**; the centre line is √(375² + 375²) = **530.3 mm**.

```figure
type: compare
title: F5's lines for the half on the +y side, from the seam to the centre line
rowhead: Line
cols: From | To | True length
caption: This is an illustration. Millimetres on the mean line. Oval points are given by ψ round the +y semicircle from its top; circle points by θ. The −y half is the mirror image.
- Seam | middle of top straight | θ = 180° | 257.4
- Top flat triangle | end of top straight, ψ = 0° | θ = 180° | 276.1
- Band | ψ = 30° | θ = 180°, then 150° | 299.6, 284.5
- Band | ψ = 60° | θ = 150°, then 120° | 315.4, 327.5
- Band | ψ = 90° | θ = 120°, then 90° | 360.0, 393.7
- Band | ψ = 120° | θ = 90°, then 60° | 421.9, 463.4
- Band | ψ = 150° | θ = 60°, then 30° | 481.4, 516.9
- Band | ψ = 180°, end of bottom straight | θ = 30°, then 0° | 520.0, 539.7
- * Centre line | middle of bottom straight | θ = 0° | 530.3
```

The lines grow steadily from the throat to the back, as on F1, and the band's diagonals alternate with its side lines, each a little longer than the last. A line in the table that broke that steady growth would mean an oval point matched to the wrong circle point.

## The half pattern

Laid out from the seam, triangle by triangle, the half pattern's key points are as follows, measured from the foot of the centre line with the centre line running up the sheet.

```figure
type: compare
title: F5's half pattern as coordinates on the sheet
rowhead: Point
cols: Across | Up | Notes
caption: This is an illustration. Millimetres from the middle of the bottom straight. Twelve divisions round the circle, six round each semicircle, arc steps on both.
- Middle of bottom straight | 0 | 0 | foot of the centre line
- End of bottom straight, ψ = 180° | −100.0 | 0 | the straight lies along the pattern's base
- Oval at ψ = 90° | −198.8 | 56.5 | outermost point of the semicircle
- End of top straight, ψ = 0° | −289.3 | 126.3 | the semicircle's edge is 235.6 mm long
- * Middle of top straight | −388.6 | 138.0 | seam, oval end
- Circle at θ = 0° | 0 | 530.3 | head of the centre line
- Circle at θ = 90° | −175.0 | 449.5 | side of the round end
- Circle at θ = 180° | −358.5 | 393.7 | seam, round end
```

Both halves together make a pattern about 777 mm wide and 530 mm high at its centre, with the flat oval's 871.2 mm along its lower edge and the circle's 785.4 mm along its upper edge. Its area is about 0.29 m², about 1.8 kg at 0.8 mm.

## Bend lines

F5 has three kinds of surface, and the pattern is marked accordingly.

- The **two flat triangles**, at the top and bottom straights, stay flat. Their edges, the lines from the straights' ends to θ = 180° and θ = 0°, are sharp bend lines.
- The **two bands**, between each semicircle and its half circle, are formed as smooth curves. Their lines are marked lightly; the sheet is rolled across them, not bent sharply on them.
- The **oval end's straights** stay straight, and the semicircles are formed to 75 mm radius, which in 0.8 mm sheet is done by hand over a pipe or a bar of about that size.

A forming template for the oval end, a flat plate with a 350 × 150 flat-oval hole, is the most useful aid. The oval end is formed into it, and the semicircles' radius and the straights' straightness are both checked at once.

## The error: an oval taken as an ellipse

This is an illustration. The job sheet for F5 described its end as "350 × 150 oval". The worker who developed the first F5 took that to mean an ellipse with axes of 350 and 150 mm, divided the ellipse into twelve, and triangulated the fitting carefully from those points.

The ellipse and the flat oval are quite different shapes. The ellipse's perimeter, by Ramanujan's approximation, is **817.1 mm**, against the flat oval's 871.2 mm, **54.1 mm** less. Its area is π × 175 × 75 = 41,233 mm², 13.5% less than the flat oval's 47,671 mm². The formed fitting's oval end would not fit the flat-oval duct that the purlin crossing had been made from: it was too small round, and its sides curved where the duct's sides were straight.

It was found when the formed fitting was offered up to the flat-oval duct. A new pattern was made from the flat oval's straights and semicircles. The shop now writes "flat oval", with the end radius, on every such drawing, and the job sheet gives the oval's points as coordinates.

```figure
type: bars
title: Perimeters of the shapes called 350 × 150 oval
unit: mm
max: 900
caption: This is an illustration. The same two dimensions describe very different shapes. The flat oval is what the duct needs.
- * Flat oval, R75 ends | 871.2
- Ellipse, 350 × 150 | 817.1
```

## Checking the formed elbow

F5 is checked against both its ducts before seaming. The round end is checked like any round end: its girth on the mean line, 785.4 mm, and its plane, which must be level when the oval end is vertical. The oval end is checked in the forming template, and its straights with a straightedge: a straight that bows outward by more than a millimetre or two shows a flat triangle that has been bent across instead of kept flat.

The elbow's turn is checked with a square: the oval end's plane must be square to the round end's plane. And the offsets are checked with a tape: the round end's centre must be 250 mm out from the oval end's plane and 300 mm above its centre. An elbow that is square but whose round end is out by 10 mm in position has a band formed unevenly, usually with more curvature on one side than the other, and is corrected by easing the band on the short side before the seam is closed.

## Flat ovals of other proportions

The method serves any flat oval. A deeper oval, closer to round, has shorter straights and larger semicircles, and its flat triangles shrink towards nothing; at the limit, with no straights, the fitting becomes a round-to-round elbow like F2. A shallower oval has longer straights and smaller semicircles, and its flat triangles grow, taking more of the fitting's area; at the limit, with very small end radii, it becomes a rectangle-to-round like F1. F5 sits between them, and its pattern shows both kinds of surface.

The choice of end radius is usually made by the duct's maker, not the fitting's: flat-oval duct is often made by squashing spiral round duct, which gives semicircular ends of half the depth. A fitting must match whatever the duct's actual end radius is, and it is worth measuring a length of the duct before developing the fitting.

## Exercise: a deeper flat oval

Suppose the purlins allowed 220 mm of depth, and F5 were made to a flat oval of the same area as the Ø250 round duct, 200 mm deep. Find the length of its straights, its perimeter and the half-length of the top flat triangle's base.

**Worked answer.**

- The ends are semicircles of 100 mm radius, together a 200 mm circle of area π × 100² = 31,416 mm².
- The straights must supply the remaining 49,087 − 31,416 = 17,671 mm², as a rectangle 200 mm deep, so each straight is 17,671 ÷ 200 = **88.4 mm** long.
- The oval is therefore 88.4 + 200 = 288.4 mm wide and 200 mm deep, and its perimeter is 2 × 88.4 + π × 200 = **805.0 mm**.
- The top flat triangle's base is the top straight, so its half-length is **44.2 mm**.

The deeper oval needs much shorter straights for the same area, and its flat triangles are less than half as wide as F5's. Its bands, between larger semicircles and the circle, do most of the work.
