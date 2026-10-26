---
book: rectangular-duct-fittings-by-the-numbers
chapterSlug: diagonal-offsets
order: 6
title: "Diagonal offsets: true offset, true angle and true faces"
description: "Develop an offset that moves 600 × 400 duct 300 mm sideways and 250 mm down at once: true offset, true angle, parallelogram faces, unequal tangent corners, and offsets added instead of combined."
draft: false
---

A diagonal offset moves a duct sideways and up or down at the same time. On the drawing it appears twice: as a sideways offset on the plan and as a drop on the section, each a single-plane offset in its own view. Neither view shows the fitting as it is. The sloping section actually runs in a plane that is neither horizontal nor vertical, at an angle that appears in no view, and its faces are parallelograms whose true shapes must be calculated.

This chapter develops the running case's diagonal offset, which moves the 600 × 400 mm duct 300 mm sideways and 250 mm down over a 1,000 mm run to clear a beam and a sprinkler main. It finds the true offset and true angle, shows that the sloping section's four long edges are all the same length, works out the true shapes of its faces and the unequal corners of its tangents, and ends with an offset whose two displacements were added instead of combined.

## Why a diagonal offset

This is an illustration. Beyond the radius elbow, the duct must pass under a beam and beside a sprinkler main that cross its path within a metre of each other. Two single-plane offsets in series, one sideways and one down, would each need their own run: 300 mm sideways over 800 mm and 250 mm down over 700 mm, say, a total of 1,500 mm. The space between the obstructions allows only **1,000 mm**. A single fitting that moves the duct both ways at once fits.

## True offset and true angle

The drawing gives two offsets: 300 mm sideways on the plan and 250 mm down on the section. The duct's centreline actually moves along the diagonal between them, and the length of that movement, the **true offset**, is √(300² + 250²) = **390.5 mm**.

The sloping section runs from one bend point to the other, 1,000 mm along the duct and 390.5 mm across it in the diagonal direction. Its **true angle** to the duct's direction is atan(390.5 ÷ 1,000) = **21.33°**, and its centreline length is √(1,000² + 300² + 250²) = **1,073.5 mm**. Each mitre joint is cut at half the true angle, **10.67°**, in the plane that contains both centrelines, the plane of the offset.

The plane of the offset is tilted. Seen along the duct, it runs at atan(250 ÷ 300) = 39.81° below the horizontal. A round duct could simply be made as a single-plane offset rotated through that angle. A rectangular duct cannot rotate, because its faces must stay vertical and horizontal at both ends, so its faces cross the plane of the offset at angles, and that is what makes its patterns harder.

```figure
type: formula
title: True offset, true angle and length of a diagonal offset
formula: true offset = √(x² + y²)        true angle = atan(true offset ÷ run)
formula: sloping length = √(run² + x² + y²)        cut = true angle ÷ 2
caption: The running case: 300 mm sideways (x) and 250 mm down (y) over a 1,000 mm run, 600 × 400 mm duct.
- x, y | Offsets in the two views, 300 and 250 mm
- run | Distance along the duct between bend points, 1,000 mm
step: True offset = √(300² + 250²) = 390.5 mm, in a plane 39.81° below horizontal
step: True angle = atan(390.5 ÷ 1,000) = 21.33°; each joint cut 10.67° from square in that plane
step: Sloping centreline = √(1,000² + 300² + 250²) = 1,073.5 mm
```

## The sloping section is simple after all

As with the single-plane offset in Chapter 5, both mitre planes bisect the same pair of directions, so they are **parallel**. The sloping section is a prism cut by two parallel planes, and all four of its long edges are equal to its centreline length: **1,073.5 mm**. Every corner of the inlet's rectangle moves to the corresponding corner of the outlet's rectangle by the same displacement, 300 mm across, 250 mm down and 1,000 mm along.

What is not simple is each face's shape. A face of the sloping section is bounded by two long edges, parallel and 1,073.5 mm long, and two short edges where it meets the mitre planes. The mitre planes are tilted to every face, so each short edge is longer than the duct's dimension, and it meets the long edges at an angle other than 90°. Each face is a parallelogram.

The angles come from the geometry of the mitre plane, calculated from the corner coordinates:

- the top and bottom faces, 600 mm across, have end edges of **606.2 mm**, meeting the long edges at **81.77°**;
- the two side faces, 400 mm across, have end edges of **402.9 mm**, meeting the long edges at **83.13°**.

Each face's pattern is a parallelogram with sides of 1,073.5 mm and its end edge, at its angle. A parallelogram is easy to mark: draw the two long sides 1,073.5 mm long and parallel, set the end edge at its angle from one long side, and check the diagonals.

```figure
type: compare
title: Faces of the diagonal offset's sloping section
rowhead: Face
cols: Long edges, mm | End edges, mm | Angle between them | Quantity
caption: All four long edges are equal; the end edges are longer than the duct's dimensions because the mitre planes cross every face at a slant.
- Top and bottom | 1,073.5 | 606.2 | 81.77° | 2
- * Sides | 1,073.5 | 402.9 | 83.13° | 2
```

## The tangents' four corners

The straight tangents at each end are where the diagonal offset is least like a single-plane one. A mitre plane cut across a straight duct at a slant in a tilted direction meets its four corners at four different distances from the square end.

This is an illustration. The shop gives each end a 150 mm tangent measured on the centreline. Measured from the square end, the four corners of the inlet tangent are, going round the duct:

- the bottom corner on the side the duct moves towards, nearest both offsets: **82.5 mm**;
- the bottom corner on the other side: **169.3 mm**;
- the top corner on the other side, furthest from both offsets: **217.5 mm**;
- the top corner on the side the duct moves towards: **130.7 mm**.

They average 150 mm, as they must. The outlet tangent's corners are the same four lengths in the reverse order, so the longest corner of the inlet tangent is diagonally opposite the longest of the outlet. Each tangent face is therefore a trapezoid with one long and one short side, and each of the four faces is different.

```figure
type: bars
title: Corner lengths of the inlet tangent, from its square end
unit: mm
max: 230
caption: This is an illustration. A 150 mm centreline tangent cut by the tilted mitre plane. A single-plane offset would have two corner lengths; the diagonal offset has four.
- Bottom, towards the offset | 82.5
- Top, towards the offset | 130.7
- Bottom, away from the offset | 169.3
- * Top, away from the offset | 217.5
```

## Building the patterns

The fitting is made of eight face pieces: two tangent faces and one sloping face on each of the four sides, or, more practically, four long side pieces, each a tangent trapezoid, a sloping parallelogram and another tangent trapezoid, folded at the two mitre lines. Each long piece is developed by laying its three parts end to end:

1. Draw the inlet tangent's face as a trapezoid: its square end the duct's dimension, its two sides the tangent corner lengths for that face.
2. From its slanted end, draw the parallelogram: long edges 1,073.5 mm, end edges and angle from the table.
3. From the parallelogram's far end, draw the outlet tangent's trapezoid, its corner lengths in reverse.
4. Mark the two mitre lines as fold lines.

The fold angles are not the same on every piece, because each face meets the mitre at its own angle. A shop with CAD will usually model the fitting and unfold each piece; a shop without it works from coordinates, which is how every number in this chapter was obtained, and checks each pattern by the rule that its two long edges across the sloping section are both 1,073.5 mm and its end edges match the table.

## The error: offsets added instead of combined

This is an illustration. A fabricator, short of time, treated the diagonal offset as a single-plane offset of 300 + 250 = 550 mm over the 1,000 mm run, reasoning that the duct "moves 550 altogether". The true angle came out at atan(0.55) = 28.81°, and every joint was cut at 14.4°.

The sloping section then moved the duct 550 mm along the diagonal direction instead of 390.5 mm. Resolved into the two views, that is 550 × cos 39.81° = **422.5 mm** sideways and 550 × sin 39.81° = **352.1 mm** down: 122.5 mm too far sideways and 102.1 mm too far down. The outlet would have hit the sprinkler main.

The fault was caught at the shop's floor setting-out, where the outlet's centre was marked by its two offsets and the fitting's outlet missed it by about 160 mm diagonally. Offsets in perpendicular directions combine by Pythagoras, never by addition; the shop's job sheet for every diagonal offset now carries the true offset and the true angle, worked out by the drafter and checked by a second person.

```figure
type: checklist
title: Diagonal offset checks before cutting
caption: Each line can be checked against the drawing's two views.
- True offset from the two offsets by Pythagoras | 390.5 mm
- True angle from the true offset and run | 21.33°, cut 10.67°
- All four long edges of the sloping section equal | 1,073.5 mm
- Four different tangent corner lengths averaging the tangent | 82.5, 169.3, 217.5, 130.7 mm
- Outlet centre on the floor setting-out | 300 across, 250 down, 1,000 along
- x Offsets added instead of combined | outlet 122.5 mm and 102.1 mm out
```

## Folds on every face

In a single-plane offset, the cheeks never fold: they stay flat in the plane of the offset, and the wrappers take all the turning. In a diagonal offset there are no cheeks. Every face folds at both mitre lines, and the turning is shared between them.

Calculated from the face directions on either side of each mitre, the side faces, 400 mm across, fold through **16.35°**, and the top and bottom faces, 600 mm across, through **13.61°**. Neither is the true angle of 21.33°, and neither is either of the offsets' own angles in their views: 16.70° for the 300 mm sideways offset over 1,000 mm, and 14.04° for the 250 mm drop. The fold on each face is the angle between that face's plane on the straight duct and its plane on the sloping section, and it has to be calculated for that face.

Because each long piece folds by a different angle, the shop sets the folder for each piece separately and checks each fold with a bevel set to its angle. Folding all four pieces at the true angle would put every face wrong, and the pieces would not close at the corners.

## Marking and checking a parallelogram face

A parallelogram is marked from one long edge. Draw it 1,073.5 mm long, set out the end edge from one end at its angle, 81.77° for the top and bottom faces, and draw the second long edge parallel to the first through the end edge's far point. The fourth side closes the shape.

The check is the diagonals. A parallelogram's diagonals are unequal, and their lengths follow from its sides and angle: for the top and bottom faces, with sides of 1,073.5 and 606.2 mm at 81.77°, they are **1,306.2 mm** and **1,154.8 mm**; for the side faces, with 402.9 mm end edges at 83.13°, **1,190.9 mm** and **1,100.6 mm**. A face whose diagonals match these numbers has the right angle and the right sides; one whose diagonals are equal has been drawn as a rectangle by mistake, which is the commonest error in marking these faces.

## Why the cross-section stays rectangular

It is fair to ask how four parallelogram faces, each tilted differently, make a duct that is still a true 600 × 400 mm rectangle where it meets the straight duct at each end. The answer is that the sloping section is the mirror image of the straight duct in the mitre plane. Reflecting a rectangular prism in a plane produces another rectangular prism with the same cross-section, square to its own axis, and the two prisms meet exactly along the plane, every corner on corner.

So the sloping section's cross-section, cut square to its own sloping axis, is exactly 600 × 400 mm. Its faces are tilted relative to the building, a little away from vertical and horizontal, and that tilt is why their end edges are longer than 600 and 400 mm. Nothing has to be forced to fit: if every face is marked from the numbers above, the fitting closes.

## When to avoid a diagonal offset

A diagonal offset is harder to make and check than two single-plane offsets, and its faces are all different. Where space allows, many shops prefer two simple offsets in series, or a single-plane offset combined with a separate drop elsewhere in the run. The diagonal offset earns its place where, as in the running case, the space between obstructions is too short for two. That is a decision for the drafter laying out the run, made with the fabrication cost in mind as well as the space, and it is worth raising with the designer when a drawing shows a diagonal offset that a little more room would avoid.

## Exercise: a smaller diagonal offset

On the branch, the 300 × 200 mm duct must move 200 mm sideways and 150 mm up over an 800 mm run. Find the true offset, the true angle, the cut angle, the sloping centreline's length, and the angle of the plane of the offset.

**Worked answer.**

- True offset: √(200² + 150²) = **250 mm**.
- True angle: atan(250 ÷ 800) = **17.35°**; each joint cut **8.68°** from square.
- Sloping centreline: √(800² + 200² + 150²) = **838.2 mm**, and all four long edges of the sloping section are this length.
- Plane of the offset: atan(150 ÷ 200) = **36.87°** above the horizontal.

The 200 and 150 mm offsets make a 3-4-5 triangle, so the true offset is a round 250 mm, a convenient check. Added instead, they would have given 350 mm, 100 mm too much along the diagonal.
