---
book: transitional-elbows-by-the-numbers
chapterSlug: the-rectangle-to-round-elbow
order: 5
title: "The rectangle-to-round elbow"
description: "Develop F1, a hood outlet that turns 90° from a vertical 400 × 200 rectangle to a horizontal Ø250 circle: flat triangles, corner fans, a half pattern from the seam, and a rectangle read on its side."
draft: false
---

A rectangle-to-round transition with parallel ends is one of the best-known fittings in sheet metal: four flat triangles, one on each side of the rectangle, and four corner fans that form part cones between them. Turn the round end through 90°, so that the fitting becomes an elbow as well as a transition, and the same construction still works. What changes is that the triangles are no longer alike: the fitting has a short, steep throat and a long, sweeping back, and every line must be calculated from coordinates.

This chapter develops the F1 hood outlet elbow. It identifies the flat triangles and the fans, calculates every line, puts the seam on the plane of symmetry, lays out the half pattern, marks the bend lines, and ends with a rectangle that was read the wrong way round.

## F1 in coordinates

Chapter 2 set up F1's axes. This is an illustration. The rectangular end is the hood's outlet face, 400 mm wide and 200 mm high, in the vertical plane x = 0, with its centre at the origin. Its corners are:

- **corner 1**, top, +y side: (0, 200, 100);
- **corner 2**, top, −y side: (0, −200, 100);
- **corner 3**, bottom, −y side: (0, −200, −100);
- **corner 4**, bottom, +y side: (0, 200, −100).

The round end is Ø250, horizontal, centred at (250, 0, 300). Its point at angle θ is (250 + 125 cos θ, 125 sin θ, 300), with θ = 0° farthest from the hood and θ = 180° nearest it. The fitting is symmetric about the plane y = 0.

## Flat triangles and corner fans

Each side of the rectangle is joined to one point on the circle by a flat triangle. The choice of point decides the fitting's shape, and for an elbow it takes some judgement.

- The **top edge**, from corner 1 to corner 2, is horizontal and parallel to y. The circle's tangent is parallel to y at θ = 180° and θ = 0°; the nearer of the two, at θ = 180°, gives a flat triangle that faces up and back towards the hood. That is the fitting's throat.
- The **bottom edge**, from corner 4 to corner 3, is also parallel to y, and is joined to θ = 0°, the farthest point. That flat triangle sweeps up the back of the fitting from the bottom of the hood face to the far side of the duct.
- The **side edges**, vertical at y = ±200, have no circle point whose tangent is parallel to them, because the circle is horizontal. They are joined to the circle points at θ = 90° and 270°, the points on the same side. Those triangles are flat, but not tangent to the fans beside them, so a slight crease runs along their edges.

Between each pair of flat triangles, the corner's fan of lines covers one quarter of the circle. With the circle divided into twelve, each fan has four lines, three steps of 30° apart.

```figure
type: compare
title: F1's lines for the half on the +y side
rowhead: Line
cols: From | To | True length
caption: This is an illustration. Millimetres on the mean line, calculated from the coordinates. The −y half is the mirror image.
- Seam | middle of top edge, (0, 0, 100) | θ = 180° | 235.8
- Corner 1 fan | corner 1 | θ = 180°, 150°, 120°, 90° | 309.2, 281.1, 289.1, 328.8
- Side triangle | corner 4 | θ = 90° | 477.6
- Corner 4 fan | corner 4 | θ = 90°, 60°, 30°, 0° | 477.6, 515.8, 554.3, 583.6
- * Centre line | middle of bottom edge, (0, 0, −100) | θ = 0° | 548.3
```

## Why the fans are exact

Each corner fan is a set of straight lines from one point, the corner, to points on a circular arc. A surface made of every straight line from a fixed point to a circle is a cone, and when the point is not on the circle's axis it is an **oblique cone**, with the corner as its apex and the circle as its base. Cones are developable, so each fan, unlike F2's surface, has an exact flat pattern. Laying the fan out as triangles from its apex, with arc steps along the circle, approaches that exact pattern as the divisions increase, and with twelve divisions the difference is a fraction of a millimetre.

That makes F1 mostly exact. The four flat triangles are exact; the four fans are exact cones. The only approximation is where a side triangle meets a fan: because the side triangle is not tangent to the cone beside it, the sheet takes a slight crease along their shared line rather than a smooth curve. On the top and bottom, where the flat triangles do meet the circle at points whose tangents are parallel to the rectangle's edges, the triangles are tangent to the fans and the surface is smooth across them.

A fabricator who wanted smooth sides too could move the side triangles' apexes off the 90° and 270° points, or split each side triangle into two, but the crease on F1 is slight and on the inside of a dust hood it does no harm. The shop leaves it.

## Where the seam goes

The fitting is symmetric about y = 0, and two of its lines lie in that plane: the line from the middle of the top edge to θ = 180°, and the line from the middle of the bottom edge to θ = 0°. A seam on either keeps the pattern symmetric, so only half needs calculating and the other half is its mirror.

The shorter of the two is the throat line, (0, 0, 100) to (125, 0, 300), with differences 125, 0 and 200 and a true length of **235.8 mm**. The longer is the back line, (0, 0, −100) to (375, 0, 300), with differences 375, 0 and 400 and a true length of **548.3 mm**. The seam goes on the throat line: it is less than half as long, it is on the side facing the hood where it is least seen, and it splits the top flat triangle into two right-angled halves that are easy to lay out. The back line becomes the pattern's centre line.

## Laying out the half pattern

The half pattern is built from the seam, round the +y side, to the centre line. Each step adds one triangle.

1. **Strike the seam line**, 235.8 mm, from the middle of the top edge to the circle point at θ = 180°.
2. **Add the half top triangle.** Corner 1 is 200 mm from the middle of the top edge along the rectangle's edge, and 309.2 mm from θ = 180°.
3. **Add corner 1's fan.** From corner 1, swing the lines of 281.1, 289.1 and 328.8 mm to the circle points at 150°, 120° and 90°, each 65.4 mm along the circle's arc from the last.
4. **Add the side triangle.** Corner 4 is 200 mm from corner 1 down the rectangle's side, and 477.6 mm from θ = 90°.
5. **Add corner 4's fan.** From corner 4, swing the lines of 515.8, 554.3 and 583.6 mm to the circle points at 60°, 30° and 0°, each 65.4 mm along the arc.
6. **Add the half bottom triangle.** The middle of the bottom edge is 200 mm from corner 4 along the edge, and 548.3 mm from θ = 0°. That last line is the centre line.
7. **Mirror the half** about the centre line, and draw the circle's edge as a smooth curve through its points.

The check at the end is the centre line itself: the middle of the bottom edge must land 548.3 mm from the circle point at θ = 0°. Every triangle contributes to where those two points fall, so a correct centre line confirms the whole half.

```figure
type: compare
title: F1's half pattern as coordinates on the sheet
rowhead: Point
cols: Across | Up | Notes
caption: This is an illustration. Millimetres from the middle of the bottom edge, with the 548.3 mm centre line running up the sheet. Twelve divisions, arc steps of 65.4 mm round the circle.
- Middle of bottom edge | 0 | 0 | foot of the centre line
- Corner 4 | −200.0 | 0 | bottom edge is straight on the pattern
- Corner 1 | −302.4 | 171.8 | side edge, 200 mm from corner 4
- Middle of top edge | −479.3 | 265.0 | seam, rectangle end
- Circle at θ = 0° | 0 | 548.3 | head of the centre line
- Circle at θ = 90° | −180.6 | 477.2 | apex of the side triangle
- * Circle at θ = 180° | −369.4 | 473.7 | seam, round end
```

The whole pattern, both halves, is about 959 mm wide and 548 mm high, a broad fan-shaped piece with the rectangle's edges along its lower boundary and the circle's girth of 785.4 mm along its upper curve. Its area is about 0.35 m², which at 0.8 mm is about 2.2 kg of galvanised steel.

## Corners of the rectangle on the pattern

The rectangle's edges appear on the pattern as straight lines, but they do not form a straight line together. On the half pattern, the bottom edge's half runs straight across from the centre line to corner 4; the side edge turns up from corner 4 to corner 1; the top edge's half turns again to the seam. The angles at corners 4 and 1 on the pattern are the sums of the angles of all the triangles meeting at those corners, and they are not 90°. Folded up, the edges meet at right angles because the triangles around each corner are no longer flat with each other.

Those corner angles are a useful check on a pattern marked by hand: if the rectangle's edges on the formed fitting do not meet square, the fault is almost always in the fan at that corner. Measuring the pattern's corner angles with a protractor before forming, and comparing them with the calculated sums, finds the fault while it is still cheap to fix.

## Bend lines and forming

F1 has two kinds of surface, and they are formed differently.

- The **flat triangles** stay flat. Their edges, the lines from corners to the circle points at 0°, 90°, 180° and 270°, are bend lines where the sheet changes direction sharply.
- The **corner fans** are formed into curved surfaces, part of an oblique cone with its apex at the corner. Each fan line is a light bend, and the sheet is rolled or bumped along those lines until the circle's edge takes its shape.

The shop marks every bend line on the pattern with a centre punch at each end, distinguishing the four sharp bends from the light fan bends. The side triangles need particular care. Because the circle has no tangent parallel to the vertical side edges, the side triangles meet the fans at a slight angle, and the bend there is sharper than a fan line but softer than the bends at the top and bottom.

```figure
type: checklist
title: Marking F1 before forming
caption: Each item keeps a flat triangle flat or a fan smooth.
- Sharp bend lines marked to θ = 0°, 90°, 180° and 270° | the flat triangles' edges
- Fan lines marked lightly from each corner | three per fan with twelve divisions
- Seam line on the throat, 235.8 mm | on the plane of symmetry
- Centre line on the back, 548.3 mm | checked before cutting
- Rectangle's corners checked square after forming | at the hood face
- x Rectangle read as 200 wide by 400 high | every line wrong
```

## The error: a rectangle read on its side

This is an illustration. The job sheet for a second hood, on the edge sander, said only "outlet 400 × 200 to Ø250, turning up". The worker who developed it read 400 as the height and 200 as the width, and set the rectangle's corners at (0, ±100, ±200) instead of (0, ±200, ±100). Every calculation was then done correctly, to the wrong shape.

The lines were very different. The seam on the throat, from the top middle to θ = 180°, came out at 160.1 mm instead of 235.8 mm. The line from the bottom corner to θ = 270° was 559.6 mm instead of 477.6 mm, and the back line 625.0 mm instead of 548.3 mm. The pattern was a narrower, taller fan, and the formed fitting fitted a tall, narrow slot, not the sander hood's wide, shallow outlet.

It was found when the formed fitting was offered up to the hood, before seaming. The fix was a new pattern, and a change to the job sheet: the rectangle's size is now always written as width × height with the edge that is horizontal named, and the coordinates of its four corners are written alongside. Coordinates do not remove the need to read the drawing correctly, but they make the reading visible: (0, ±200, ±100) can only mean one thing.

```figure
type: bars
title: F1's key lines, as drawn and with the rectangle on its side
unit: mm
max: 700
caption: This is an illustration. Reading 400 × 200 as height × width changed every line, though each was calculated correctly.
- * Seam, correct | 235.8
- Seam, rectangle on its side | 160.1
- * Back line, correct | 548.3
- Back line, rectangle on its side | 625.0
```

## Exercise: the side triangle's angles

F1's +y side triangle has corners at corner 4, corner 1 and the circle point at θ = 90°. Its sides are the rectangle's side edge, 200 mm, the line from corner 1 to θ = 90°, 328.8 mm, and the line from corner 4 to θ = 90°, 477.6 mm. Find its angles at corner 4 and corner 1. Why is the angle at corner 1 obtuse?

**Worked answer.**

- At corner 4, between the 200 mm edge and the 477.6 mm line: the inverse cosine of (200² + 477.6² − 328.8²) ÷ (2 × 200 × 477.6) = **33.1°**.
- At corner 1, between the 200 mm edge and the 328.8 mm line: the inverse cosine of (200² + 328.8² − 477.6²) ÷ (2 × 200 × 328.8) = **127.5°**.
- The angle at θ = 90° is the remainder, 180° − 33.1° − 127.5° = **19.4°**.

The angle at corner 1 is obtuse because the circle point at θ = 90° is above and beyond corner 1, not between the two corners: the side triangle leans back over the top of the hood face. On a rectangle-to-round with parallel ends, every flat triangle's apex lies between its base corners in plan. On an elbow, the throat triangles lean, and the pattern shows it. A worker who expects every flat triangle to look like an isosceles triangle on the pattern will think this one is wrong; the angles prove it is right.
