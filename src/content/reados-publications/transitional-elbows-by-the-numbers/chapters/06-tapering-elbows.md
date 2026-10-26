---
book: transitional-elbows-by-the-numbers
chapterSlug: tapering-elbows
order: 6
title: "Tapering elbows in any number of pieces"
description: "Develop F3, a 90° elbow tapering from Ø315 to Ø250: two mitred collars cut exactly, a middle piece triangulated between their elliptical joints, and a joint wrongly taken as round."
draft: false
---

A segmented elbow in round duct of one diameter is a set of cylinders cut on mitres, and its patterns are among the first a sheet metal worker learns. Make the elbow taper as it turns, so that it enters at one diameter and leaves at another, and the pieces can no longer all be cylinders: something has to change size between the ends. The cleanest way to make such an elbow keeps as much of it as possible exact, and triangulates only the part that must change.

This chapter develops F3, the three-piece tapering elbow on the DX-3 main. It sets out the elbow's geometry, cuts the two end collars exactly as mitred cylinders, describes the elliptical joints they leave, triangulates the middle piece between them, extends the method to more pieces, and ends with a middle piece whose ends were taken as round.

## F3's geometry

This is an illustration. F3 turns the main through 90° and reduces it from Ø315 to Ø250 on the way, so that the fan end of the main can be smaller where the flow is less. The job sheet gives:

- **centreline radius** of the bend, 450 mm, measured to the duct's centre;
- **inlet**: Ø315, square to the duct, at the start of the bend;
- **outlet**: Ø250, square to the duct, at the end of the bend;
- **pieces**: three, an inlet collar, a middle piece and an outlet collar.

In a three-piece elbow, the two end pieces each turn through a quarter of the bend and the middle piece through half. The joints lie on the radial planes at 22.5° and 67.5° from the inlet, each bisecting the angle between the pieces on either side.

The axes put the bend's centre at the origin and its axis along y. The inlet is the horizontal plane through the origin, with the duct rising from it along z and its centre at x = 450. The outlet is the vertical plane x = 0, with the duct leaving along −x and its centre at z = 450. The heel, the outside of the bend, is the side farthest from the bend's axis; the throat, the inside, is the side nearest.

## The collars are exact

The inlet collar is a plain Ø315 cylinder standing on the inlet plane, cut at its top by the joint plane at 22.5°. A cylinder cut by a plane is developable, and its pattern is the familiar mitre: a stretch-out of the girth, π × 315 = 989.6 mm, with the cut line plotted as a curve of lengths above the base. Each length is the height at which a line up the cylinder meets the joint plane:

length = tan 22.5° × (450 + 157.5 cos θ),

where θ is measured round the cylinder from the heel. At the heel, θ = 0°, the length is 0.4142 × 607.5 = **251.6 mm**; at the throat, θ = 180°, it is 0.4142 × 292.5 = **121.2 mm**; on the sides, θ = 90°, it is the centreline length, **186.4 mm**.

The outlet collar is a Ø250 cylinder, cut by the joint plane at 67.5°. Its lengths follow the same formula with a radius of 125 mm: **238.2 mm** at the heel, **134.6 mm** at the throat and the same **186.4 mm** on the sides, because both collars reach the same centreline distance from their joint.

```figure
type: compare
title: Mitre lengths of F3's two collars
rowhead: θ from the heel
cols: Inlet collar, Ø315 | Outlet collar, Ø250
caption: This is an illustration. Lengths in millimetres from the collar's square end to its mitred end, on the mean line. Stretch-outs of 989.6 and 785.4 mm, divided into twelve steps of 82.5 and 65.4 mm.
- 0° (heel) | 251.6 | 238.2
- 30° | 242.9 | 231.2
- 60° | 219.0 | 212.3
- 90° (side) | 186.4 | 186.4
- 120° | 153.8 | 160.5
- 150° | 129.9 | 141.6
- * 180° (throat) | 121.2 | 134.6
```

## The joints are ellipses

Where each collar is cut, its edge is an ellipse: a cylinder cut on a slant always gives one. The inlet collar's joint has a minor axis of 315 mm, across the duct, and a major axis of 315 ÷ cos 22.5° = **341.0 mm**, from heel to throat along the joint plane. The outlet collar's joint is 250 by 250 ÷ cos 22.5° = **270.6 mm**.

The middle piece must join those two ellipses. They are of different sizes, they lie in planes 45° apart, and no cylinder or cone passes through both. The middle piece is therefore a transition between two elliptical ends that are not parallel, which is exactly what triangulation is for. Its girths are the ellipses' perimeters: **1,030.8 mm** at the inlet joint and **818.1 mm** at the outlet joint, both calculated by summing the true distances between closely spaced points round each ellipse.

## Points on the joints

The points on each joint come from the collar that made it. A line up the inlet collar at angle θ meets the joint at a point whose coordinates follow from the cylinder and the joint plane:

(450 + 157.5 cos θ, 157.5 sin θ, tan 22.5° × (450 + 157.5 cos θ)).

The outlet joint's points are, in the same way, (tan 22.5° × (450 + 125 cos θ), 125 sin θ, 450 + 125 cos θ). Dividing both collars into twelve, with θ = 0° at the heel, gives twelve matching points on each joint. Because the collars' lines are equally spaced round the cylinders, the points are not equally spaced round the ellipses: the steps along the inlet joint range from 83.1 mm near the heel and throat to 88.7 mm on the sides, and along the outlet joint from 65.9 to 70.4 mm.

That unevenness is correct, and it matters. The middle piece's pattern edges must match the collars' cut edges point for point, so its steps must be the true distances along the ellipses between those points, not the girth divided by twelve.

## Triangulating the middle piece

The middle piece's side lines join each inlet-joint point to the outlet-joint point at the same θ. Its diagonals split each strip. The fitting is symmetric about the plane y = 0, so only half needs calculating.

```figure
type: compare
title: F3 middle piece, lines from the throat to the heel
rowhead: θ from the heel
cols: Side line | Diagonal to the next strip | Steps along the joints, inlet and outlet
caption: This is an illustration. True lengths in millimetres. Each diagonal joins the outlet-joint point at this θ to the inlet-joint point 30° nearer the heel. Steps are the true distances along each ellipse to the next point towards the heel.
- * 180° (throat, seam) | 257.8 | 276.2 | 83.1, 65.9
- 150° | 273.4 | 305.9 | 85.9, 68.2
- 120° | 316.0 | 355.9 | 88.7, 70.4
- 90° | 374.2 | 413.1 | 88.7, 70.4
- 60° | 432.5 | 462.1 | 85.9, 68.2
- 30° | 475.2 | 489.4 | 83.1, 65.9
- 0° (heel, centre line) | 490.9 | (end of half) | (end of half)
```

The seam goes on the throat, where the side line is shortest at 257.8 mm, matching the collars' seams, which also go on the throat. The heel line, 490.9 mm, is the pattern's centre line, and the half pattern is laid out from the seam to the heel and mirrored.

## The middle piece's pattern

Laid out from the throat seam, the half pattern's points are as follows, measured from the heel line's inlet end with the heel line running up the sheet.

```figure
type: compare
title: F3 middle piece's half pattern as coordinates on the sheet
rowhead: Point at θ
cols: Inlet edge, across | Inlet edge, up | Outlet edge, across | Outlet edge, up
caption: This is an illustration. Millimetres from the inlet end of the 490.9 mm heel line. The other half is the mirror image across the heel line.
- 0° (heel) | 0 | 0 | 0 | 490.9
- 30° | −82.5 | 10.0 | −65.7 | 485.0
- 60° | −163.7 | 38.1 | −132.1 | 469.4
- 90° | −242.9 | 77.9 | −199.6 | 449.6
- 120° | −320.2 | 121.4 | −268.0 | 433.0
- 150° | −396.8 | 160.3 | −335.9 | 426.8
- * 180° (throat seam) | −474.7 | 189.4 | −401.1 | 436.5
```

The full middle piece is about 949 mm across its inlet edge from seam to seam and 491 mm high at the heel, a curved band whose two edges are longer than the collars' girths because they follow the ellipses. Its area is about 0.33 m². The two collars add 989.6 × 186.4 mm and 785.4 × 186.4 mm, since a mitred cylinder's area is its girth times its centreline length: 0.18 and 0.15 m². The whole elbow takes about 0.66 m² of sheet before allowances, about 4.2 kg at 0.8 mm.

## Assembly order

The collars are cut, rolled and seamed first, because they are exact and their cut edges set the joints. Nothing about them depends on the middle piece. The middle piece is rolled to approximately the right shape, then offered between the collars and adjusted: its edges must lie on the collars' cut edges all round. The shop checks three things at the trial assembly: the heel and throat seams line up on all three pieces, the elbow's outlet is square to its inlet at 90°, and the length along each side of the duct, at θ = 90°, is 186.4 mm on the inlet collar, 374.2 mm on the middle piece and 186.4 mm on the outlet collar, 747.0 mm in all. Only then are the joints riveted and sealed.

## Why not cones?

A tapering elbow could be made entirely of cone frustums: each piece a right cone around its own axis, reducing a little from one joint to the next, cut by the joint planes. It is a tempting idea, because cones are developable and their patterns exact. It does not quite work.

At each joint, two pieces meet. For the joint to close, the two pieces' cut edges must be the same curve. Two cylinders of the same diameter, mirrored about the joint plane, meet in identical ellipses; that is why a segmented elbow of one diameter works. But two cones that both narrow in the direction of flow are not mirror images about the joint plane: one narrows towards the joint and the other narrows away from it. Their cut edges are ellipses of slightly different sizes and shapes, offset from each other. The mismatch is small on a gentle taper and can be worked out by stretching or easing the sheet, which is how many tapering elbows are made in practice. But it is a fudge, and on a sharper taper or a larger duct it shows as a step at every joint.

Making the end pieces cylinders and triangulating the middle avoids the fudge. Every joint is defined once, by the exact cut of the piece that makes it, and the triangulated piece is built to fit it. On F3, that costs one triangulated pattern; on a five-piece elbow, three. It is the method this book uses because every joint is checkable: the middle piece's edge lengths must equal the collars' ellipse perimeters, and a tape round the joint proves it.

## More pieces

A tapering elbow can be made in any number of pieces. The two end collars stay mitred cylinders, cut at half the angle of the middle pieces; for a five-piece 90° elbow, the collars are cut at 11.25° and the three middle pieces each turn 22.5°. Each middle piece is then a transition between two ellipses, and each is triangulated as above.

The ellipses at the intermediate joints must be chosen: they are the sections of a duct of the intermediate diameter, cut by the joint plane. A common rule makes the diameter change in equal steps from joint to joint, so a five-piece Ø315 to Ø250 elbow would have joints for diameters of 315, 293.3, 271.7 and 250 mm, with each ellipse's major axis equal to its diameter divided by the cosine of the joint's half-angle. More pieces make a smoother elbow with lower pressure loss, at the cost of more joints to make and seal; the ductwork side of that choice is in READOS's [Ductwork by the Numbers](/reados/publications/ductwork-by-the-numbers/).

```figure
type: steps
title: Developing a tapering elbow in any number of pieces
caption: The method used for F3, generalised. Only the middle pieces are triangulated.
- Fix the centreline radius and the number of pieces | end collars at half the middle pieces' angle
- Cut the end collars as mitred cylinders | exact stretch-outs
- Set the diameter at each intermediate joint | equal steps from inlet to outlet
- Find each joint's points from the duct section on either side | an ellipse in the joint plane
- Triangulate each middle piece between its two joints | steps along the ellipses, not girth ÷ divisions
- Assemble collars first, then fit the middle pieces | seams in line on the throat
```

## The error: a joint taken as round

This is an illustration. The first F3 middle piece was developed by a worker who calculated its side lines and diagonals correctly, but laid out its edges with steps of the circles' girths divided by twelve: 989.6 ÷ 12 = 82.5 mm on the inlet edge and 785.4 ÷ 12 = 65.4 mm on the outlet edge. They reasoned that the joints were "Ø315 and Ø250".

The joints are ellipses, not circles, and their perimeters are longer. The middle piece's inlet edge came out 1,030.8 − 989.6 = **41.2 mm short** and its outlet edge 818.1 − 785.4 = **32.7 mm short**. Offered up between the collars, it could not reach round them: the gap at the throat seam was about 40 mm at the inlet joint.

It was found at the trial assembly, before any rivets were set. The worker recalculated the steps along the ellipses and cut a new middle piece. The shop's note on the F3 job sheet now reads: "Middle piece edges follow the collars' cut ellipses. Step along the ellipse, not the girth."

```figure
type: bars
title: F3 middle piece's edge lengths, true and taken as round
unit: mm
max: 1100
caption: This is an illustration. A joint cut on a slant is longer than the duct's girth, here by 41.2 and 32.7 mm.
- * Inlet joint, ellipse | 1030.8
- Inlet edge stepped as Ø315 | 989.6
- * Outlet joint, ellipse | 818.1
- Outlet edge stepped as Ø250 | 785.4
```

## Exercise: a four-piece version

A four-piece version of F3 would have end collars cut at 15° and two middle pieces of 30° each. For the Ø315 inlet collar, find the mitre lengths at the heel, at θ = 60° and at the throat, and the major axis of its joint ellipse.

**Worked answer.**

- The lengths follow tan 15° × (450 + 157.5 cos θ), with tan 15° = 0.2679.
- At the heel, 0.2679 × 607.5 = **162.8 mm**; at θ = 60°, 0.2679 × 528.75 = **141.7 mm**; at the throat, 0.2679 × 292.5 = **78.4 mm**.
- The joint's major axis is 315 ÷ cos 15° = **326.1 mm**, shorter than the three-piece elbow's 341.0 mm because the cut is less steep.

The shallower cuts make the joints closer to circles and the middle pieces closer to cone frustums, which is why elbows with more pieces are easier to fit as well as smoother to the air. The cost is two more joints, each needing its own seal and its own check.
