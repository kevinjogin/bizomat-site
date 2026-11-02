---
book: branched-fittings-by-the-numbers
chapterSlug: a-pipe-joining-an-oblique-cone
order: 9
title: "A pipe joining an oblique cone"
description: "Find where G7, a Ø150 pipe, meets G1's oblique cone from its circular sections, cut the pipe's end and the hole in the hood's pattern, and catch a pipe cut square to a back that only looks flat."
draft: false
---

Not every branch is a breeches. Often a small pipe simply joins the side of a larger fitting, as a tee joins a main. When the larger fitting is a cylinder, the joint is a cylinder-to-cylinder intersection, covered in the Library’s Sheet Metal Patterns by the Numbers. When it is an oblique cone, the joint is harder to picture: the cone's surface curves differently in every direction, and its elements lean at different angles all round. But an oblique cone has one property that makes the joint easy to calculate. Every section parallel to its base is a circle, and with that, the meeting line can be found point by point with nothing more than Pythagoras.

This chapter develops G7, a Ø150 pipe joining G1's wall hood. It uses the cone's circular sections to find the line where the pipe meets the hood, develops the pipe's cut end, places the hole in the hood's pattern, and ends with a pipe cut square to a back that looked flat.

## G7 and the hood

This is an illustration. One welding bay also has a portable fume arm, whose wall bracket passes a Ø150 duct through the wall and into the back of G1's hood, so that the arm and the hood share the hood's Ø250 branch. The Ø150 pipe is horizontal, square to the wall, centred 200 mm above the hood's skirt, on the hood's plane of symmetry.

In G1's coordinates, the wall is the plane x = 300, the hood's back element runs up the wall from (300, 0, 0) to (300, 0, 450), and the cone's apex is at (300, 0, 771.4). The pipe's axis runs along x at y = 0, z = 200. A point on the pipe's surface at angle ψ round its axis, measured from the +y side, is at

(x, 75 cos ψ, 200 + 75 sin ψ),

with ψ = 90° at the top of the pipe and ψ = 270° at the bottom. The question is the value of x at which each such line along the pipe meets the hood.

## The cone's circular sections

Chapter 2 showed that every horizontal section of G1's cone is a circle. At a height z above the skirt, its radius is 300 × (1 − z ÷ 771.4), and its centre is on the plane y = 0, at x = 300 × z ÷ 771.4. Its back point is always on the wall, at x = 300.

A line along the pipe at angle ψ stays at one height, z = 200 + 75 sin ψ, and one sideways position, y = 75 cos ψ. It meets the hood where it meets the section circle at that height. In that circle's plane, the meeting point is at the circle's centre plus √(radius² − y²) towards the wall.

```figure
type: formula
title: Where a horizontal line at height z and offset y meets G1's cone
formula: x = 300 × z ÷ 771.4 + √((300 × (1 − z ÷ 771.4))² − y²)
caption: Worked for the pipe's side line, ψ = 0°, at z = 200 mm and y = 75 mm.
- z | Height of the line above the skirt, 200 + 75 sin ψ
- y | Sideways offset of the line, 75 cos ψ
- 771.4 | Height of the cone's apex above the skirt
step: Section centre at z = 200: 300 × 200 ÷ 771.4 = 77.8 mm
step: Section radius: 300 × (1 − 200 ÷ 771.4) = 222.2 mm
step: x = 77.8 + √(222.2² − 75²) = 77.8 + 209.2 = 287.0 mm
```

The pipe's side line meets the hood 13.0 mm in from the wall. The top and bottom lines, at y = 0, meet it at the wall itself, x = 300, because they meet the hood's back element, which lies on the wall.

## The meeting line

Repeating the calculation at twelve points round the pipe gives the whole meeting line. The pipe's cut end is described by how far each line along the pipe runs past a reference plane. Taking the reference square to the pipe at x = 500 mm, in the next room beyond the wall, each line's length from the reference to the hood is 500 − x.

```figure
type: compare
title: G7's meeting line with the hood
rowhead: ψ round the pipe
cols: Height z and offset y | Meets the hood at x | Pipe line from x = 500
caption: This is an illustration. Millimetres. ψ is measured from the +y side; 90° is the top. The +y and −y sides are mirror images, so ψ = 150° matches 30°, and 330° matches 210°.
- 0° (side) | 200.0, 75.0 | 287.0 | 213.0
- 30° | 237.5, 65.0 | 289.6 | 210.4
- 60° | 265.0, 37.5 | 296.4 | 203.6
- 90° (top) | 275.0, 0 | 300.0 | 200.0
- 210° | 162.5, −65.0 | 290.9 | 209.1
- 240° | 135.0, −37.5 | 297.1 | 202.9
- * 270° (bottom) | 125.0, 0 | 300.0 | 200.0
```

The meeting line is not symmetric top to bottom. The pipe's lower half meets the hood less far in than its upper half: at 30° above the side, 289.6 mm; at 30° below, 290.9 mm. The hood is wider lower down, so its section circles there are larger and curve away from the wall more gently.

## The pipe's pattern

The pipe's pattern is a stretch-out of its girth, π × 150 = **471.2 mm**, divided into twelve steps of 39.3 mm, with each line's length from the table plotted at its step. The cut curve rises from 200.0 mm at the top and bottom lines to 213.0 mm at the side lines, with two humps, one for each side of the pipe, and the lower half's hump slightly flatter than the upper half's. The deepest point of the cut is 13.0 mm.

The pipe's seam goes on the top line, where the cut is shallowest and the seam is shortest; on a pipe this small, it is a straight lap riveted and sealed before the cut end is trimmed.

## The hole in the hood's pattern

The hole in the hood must be cut in the hood's flat pattern before it is rolled, or cut through the formed hood with a template. To place it on the pattern, each meeting point is traced to its position on the cone: the element it lies on, and its distance from the apex along that element. Projecting the point from the apex down to the skirt's plane gives the skirt point the element starts from, and Chapter 2's pattern angles then place that element on the pattern.

```figure
type: compare
title: The hole in G1's pattern
rowhead: ψ round the pipe
cols: Skirt point of its element, θ from the wall | Distance from the apex | On the pattern, across the back element and along it
caption: This is an illustration. Millimetres. On the pattern, across is measured square to the back element and along is measured from the apex. The hole straddles the back element, where G1's halves meet.
- 0° (side) | 19.7° | 576.5 | 76.5, 571.4
- 30° | 18.2° | 538.0 | 66.1, 533.9
- 60° | 11.0° | 507.9 | 37.7, 506.5
- 90° (top) | 0° | 496.4 | 0, 496.4
- 210° | −15.9° | 612.5 | 65.8, 609.0
- 240° | −8.7° | 637.5 | 37.6, 636.4
- * 270° (bottom) | 0° | 646.4 | 0, 646.4
```

The hole is 150.0 mm long along the back element, from 496.4 to 646.4 mm from the apex, which is 175.0 to 325.0 mm below the duct end, and 153.0 mm across at its widest. It is not a circle. It is widest at mid-length, 75.0 mm below its top, where it is 3 mm wider than the pipe's diameter, because the hood's surface curves between the pipe's two side lines and the pattern measures round that curve, not straight across it; and its upper and lower halves differ slightly, the lower a few tenths of a millimetre narrower, mirroring the pipe's cut.

Because G1 is made in two halves seamed on the back element, the hole straddles the seam: each half carries half the hole. The shop cuts each half's half-hole on the flat pattern, so that the formed and seamed hood has the whole hole, and checks it with the pipe itself before the seam is closed.

## Joining the pipe to the hood

The pipe is joined to the hood with a collar of tabs. The shop adds, as an illustration, a 15 mm allowance beyond the cut curve on the pipe's pattern, offset square to the curve, and cuts it into tabs about 20 mm wide. The pipe is pushed through the hole from outside until its cut curve lies on the hood's surface all round, and the tabs are turned out against the inside of the hood and riveted through, with sealant between. The tabs are turned outward, against the inside of the hood, because the pipe enters from outside and its cut end must sit flush with the hood's inner surface so that the air passes smoothly into the hood.

The hole is cut to the meeting line itself, with no allowance: the pipe's outside fits the hole's edge, and the tabs do the joining. A hole cut oversize leaves a gap that the tabs bridge but the sealant must fill; a hole cut undersize stops the pipe short of its full depth, and its cut curve then stands proud inside the hood.

## Why the sections, not triangulation

The meeting line could be found by triangulating the hood near the pipe and intersecting each pipe line with the triangles. The sections are better here for two reasons. They are exact: each section is a true circle of the cone, not an approximation of it, so every meeting point is exactly on the hood's surface. And they are quick: one square root per point, with no search. Triangulation is the method for surfaces that have no such simple sections, like G3's or G5's tilted prongs; for a pipe joining one of those, the meeting line is found by stepping along each pipe line and testing it against the triangles, which is slower and approximate.

## Checking G7

Before the joint is riveted, three checks prove it. The pipe's cut curve must lie on the hood's surface all round, with no gap at the sides and no overlap at the top and bottom; a feeler gauge of 1 mm should not enter anywhere. The pipe's axis must be square to the wall, checked with a square against the wall face. And the pipe's centre must be 200 mm above the skirt and on the hood's centre line, measured on the outside of the wall where the bracket mounts. A pipe that is square but 10 mm off height has had its hole cut in the wrong place on the pattern, usually because its position along the back element was measured from the wrong end of the pattern.

## The error: a pipe cut square

This is an illustration. The first G7 was cut square. The fitter reasoned that the hood's back is flat against the wall, so a pipe coming through the wall square to it needed a square end.

The hood's back is flat only along its back element, a single vertical line. Either side of it, the cone curves away from the wall. A square-cut pipe end, pushed in until its top and bottom touched the hood at the wall, stood off the hood at its sides by **13.0 mm**, with a crescent-shaped gap on each side from 30° above to 30° below the side lines. The gap could not be sealed reliably with sealant alone.

It was found when the pipe was offered up. The pipe was recut to the calculated curve, and the joint closed all round. The lesson is the one Chapter 2's sections teach: on an oblique cone, a line that looks straight in one view is only one line, and the surface around it curves.

```figure
type: bars
title: Gap at G7's joint with a square-cut pipe end
unit: mm
max: 15
caption: This is an illustration. The hood's surface curves away from the wall either side of its back element, so a square-cut pipe touches only at its top and bottom.
- Top and bottom, ψ = 90° and 270° | 0
- ψ = 60° | 3.6
- ψ = 30° | 10.4
- * Sides, ψ = 0° | 13.0
```

## Why the hole straddles the seam

G7's hole straddles G1's back seam because the pipe enters on the hood's plane of symmetry, which is where the back seam was put for good reasons in Chapter 2. There are two ways to deal with it. The hole can be cut half in each half-pattern, as FX-4 does, which keeps the seam where it was and needs the two half-holes to line up exactly when the halves are seamed. Or the back seam can be moved to one side for this hood only, onto an element that clears the hole, which keeps the hole whole but makes the two halves unequal and needs a second set of patterns. For a one-off, cutting the half-holes is simpler; for a batch of hoods with pipes, moving the seam may be worth the extra patterns, because a hole cut in one piece is easier to get right.

## Pipes at other places on the hood

The same method serves a pipe joining the hood anywhere, at any height and from any direction, as long as each line along the pipe can be followed to the cone's surface. For a horizontal pipe, each line stays at one height, so the section circle at that height gives the meeting point directly, as above. For a sloping pipe, each line crosses several heights, and the meeting point is found by stepping along the line and testing each point against its section circle, halving the interval as Chapter 7 did, until the point lies on the circle.

A pipe joining the hood's front, where the cone's elements lean most, needs the most care: the surface there slopes as well as curves, and the pipe's cut is deeper and less symmetric. A pipe joining near the duct end, where the sections are small, cuts a hole that is large relative to the section and may weaken the hood; the system's designer decides where a pipe may join, and the method finds the meeting line wherever that is.

## Exercise: the line at 45°

Find where G7's pipe line at ψ = 45° meets the hood, and its length from the reference at x = 500 mm.

**Worked answer.**

- The line is at z = 200 + 75 sin 45° = 253.0 mm and y = 75 cos 45° = 53.0 mm.
- The section at that height has its centre at 300 × 253.0 ÷ 771.4 = 98.4 mm and its radius 300 × (1 − 253.0 ÷ 771.4) = 201.6 mm.
- The meeting point is at x = 98.4 + √(201.6² − 53.0²) = 98.4 + 194.5 = **292.9 mm**.
- The line's length from the reference is 500 − 292.9 = **207.1 mm**.

The value lies between the table's 210.4 mm at 30° and 203.6 mm at 60°, as it should.
