---
book: transitional-elbows-by-the-numbers
chapterSlug: fittings-whose-ends-are-not-parallel
order: 1
title: "Fittings whose ends are not parallel"
description: "What changes when a fitting's ends face different ways, which surfaces unroll and which must be triangulated, the coordinate method, and the six DX-3 fittings this book develops."
draft: false
---

A reducer, a square-to-round and a hopper all have one thing in common: their two ends lie in parallel planes. Every line drawn on the surface from one end to the other rises through the same height, the plan shows both ends in their true shape, and a single true-length diagram with one height serves every line. Most pattern development books, and most of a sheet metal worker's training, are built on fittings like these.

A fitting whose ends face different ways has none of those conveniences. Its lines rise by different amounts, at least one end is foreshortened in every ordinary view, and the plan and elevation no longer give the true length of anything directly. This chapter sets out what changes, which parts of such a fitting can still be unrolled and which must be divided into triangles, the coordinate method the rest of the book uses, and the six fittings of the running case.

## What changes when the ends are not parallel

Three things make these fittings harder.

1. **No common height.** In a fitting with parallel ends, every line from the bottom to the top rises by the fitting's height, so a true-length diagram needs only each line's plan length. When one end is tilted, the rise of each line depends on where along the tilted end it finishes, and both the rise and the plan length change from line to line.
2. **Foreshortened ends.** A round end tilted 30° from the horizontal is a circle, but in plan it looks like an ellipse, and in an elevation it looks like a straight line. Neither view shows the points on it at their true spacing. Chapter 3 deals with this.
3. **No obvious symmetry.** Many of these fittings are symmetric about one plane at most, and some, like a twisted transition, about none. Half patterns are only safe where a real plane of symmetry exists.

These difficulties compound. A worker who draws a good plan and elevation of a parallel-ended fitting can measure each line's plan length and set it against one height; with a tilted end, each line needs its own rise read from the elevation, its own plan length read from the plan, and both must be read at the right points of a foreshortened end. Each reading is a chance for a small error, and the errors do not cancel.

What does not change is the principle. Any surface can be covered with triangles whose corners lie on its two ends. If the true length of every side of every triangle is known, the triangles can be laid out flat side by side, and the pattern is the outline they make. That is all triangulation is.

## Surfaces that unroll and surfaces that do not

Some surfaces can be unrolled flat without stretching: they are called **developable**. Cylinders, cones and the flat faces of a fitting are developable, and so is any surface made of straight lines along which the surface has the same tangent plane from one end of the line to the other. For a developable surface, a pattern made by stretching out or by radial lines is exact.

Many transitional fittings are not developable. A surface joining a round end to a tilted round end of a different size, or joining two twisted rectangles, has no exact flat pattern. Sheet of 0.8 to 1.6 mm will bend a little out of its plane and stretch a very little as it is formed, so the fitting can still be made, but its pattern is necessarily an approximation, and triangulation is how that approximation is built. The finer the triangles, the closer the pattern is to the surface the drawing describes; Chapter 4 measures how close.

A practical rule follows. Before triangulating anything, look for the parts that are developable, the collars, the flat faces and the cone sections, and develop those exactly by the simpler methods. Triangulate only what is left. Several of the fittings in this book are part exact and part triangulated.

## The coordinate method

The traditional way to triangulate is to draw a plan and an elevation, project the points, and construct a true-length diagram for each line. This book does the same thing with numbers. Every point on the fitting's ends gets a coordinate on three axes, x, y and z, measured from one origin, and the true length of the line between two points comes from their three differences. Chapter 2 sets out the arithmetic. The advantages are practical: every line can be checked by anyone with a calculator, the numbers transfer directly to a spreadsheet or a cutting program, and an error shows up as a number that does not agree, not as a pencil line a millimetre out.

```figure
type: steps
title: Triangulating a fitting from coordinates
caption: The order used in every chapter. Steps 1 to 3 describe the fitting; steps 4 to 6 develop it.
- Fix the axes and origin | usually at the centre of one end, with z square to it
- Describe each end | its centre, the tilt of its plane, its shape and size
- Divide each end and number the points | the same number of divisions on both ends, in matching order
- Choose the triangles | each line joins a point on one end to a point on the other
- Calculate every true length | the square root of the sum of the three squared differences
- Lay the triangles out flat | side by side from the seam, stepping the true distances between points
```

## What the drawing must give

A fitting whose ends are not parallel is only defined when the drawing gives, for each end, four things:

- **the centre**, as a position relative to the other end;
- **the plane**, as the angle it is tilted and the axis it is tilted about;
- **the shape**, round, rectangular or flat oval, with its orientation within the plane;
- **the size**, measured on the mean line of the sheet unless stated otherwise.

A sketch that shows "Ø250 to Ø200, 30° bend" leaves out the centres. Two connectors with the same end sizes and the same 30° between their end planes can have quite different shapes, depending on how far apart the centres are and in which direction. The fabricator's job sheet for each DX-3 fitting therefore lists the two ends' centres and planes as coordinates, and the first step in every chapter is to write them down.

## The running case's six fittings

This is an illustration. The DX-3 fittings were chosen because each needs a different treatment, and together they cover the range of non-parallel fittings that a ductwork shop meets.

```figure
type: compare
title: The six DX-3 fittings
rowhead: Fitting
cols: Ends | Angle between end planes | Method | Chapter
caption: This is an illustration. Sizes are on the mean line of 0.8 mm galvanised sheet.
- F1 hood outlet elbow | 400 × 200 rectangle to Ø250 | 90° | triangulated in one piece | 5
- F2 reducing connector | Ø250 to Ø200 | 30° | triangulated in one piece | 3 and 4
- F3 tapering elbow | Ø315 to Ø250 | 90° | two mitred collars and a triangulated middle | 6
- F4 rectangular elbow | 400 × 200 to 300 × 200 | 90° | stretch-out wrappers, triangulated cheeks | 7
- F5 flat-oval elbow | Ø250 to 350 × 150 flat oval | 90° | triangulated in one piece | 8
- * F6 twisted transition and helical elbow | 300 × 200 rotated 30°; Ø200 climbing | 30° twist; 79.3° | folded triangles; twisted mitres | 9
```

The sizes are not arbitrary. The F1 hood's rectangle has an area of 0.080 m² against the round duct's 0.049 m², so the air speeds up through the fitting, which suits a hood. The F5 flat oval's area, 47,671 mm², is within 3% of the Ø250 duct's 49,087 mm², so the flat oval passes between the purlins without a noticeable change in air speed. The ductwork side of those choices is covered in READOS's [Ductwork by the Numbers](/reados/publications/ductwork-by-the-numbers/transitions-expansions-and-contractions/).

## Choosing the triangles

Dividing both ends into the same number of parts gives two rows of numbered points, one on each end. The lines joining point 1 to point 1, point 2 to point 2 and so on are the fitting's **side lines**; between each pair of side lines is a four-sided strip, and each strip is split into two triangles by a **diagonal**. The side lines and diagonals together are the triangulation.

Three rules keep the triangulation close to the real surface.

- **Lines must lie on the surface.** A side line from a point on one end to the matching point on the other should run along the sheet, not cut through the inside of the fitting. On a smooth transition, matching the points in order round both ends does this automatically. On a fitting with corners, the corners need their own fans of lines, as Chapter 5 shows.
- **Diagonals should be the shorter of the two possible.** Each strip has two diagonals. The shorter one usually lies closer to the surface, and the flatter the two triangles it makes, the less the sheet has to bend between them.
- **Diagonals should run consistently.** Within one half of a fitting, every diagonal should run the same way, from the lower-numbered point on one end to the higher-numbered point on the other. Switching direction partway round makes a pattern that closes but twists the fitting when formed. On a symmetric fitting, the diagonals on one side of the plane of symmetry are the mirror images of those on the other.

The number of divisions is a judgement. Twelve round a duct up to about Ø300 is usual in a ductwork shop, sixteen or twenty-four for larger or more distorted fittings. More divisions mean more lines to calculate and mark, but a closer pattern. With coordinates in a spreadsheet, the calculation costs nothing; the marking is what limits it.

```figure
type: stats
title: Fitting F2 in numbers
caption: This is an illustration. Each value is worked out in Chapters 3 and 4.
- 30° | Angle between F2's end planes | Chapter 3
- 243.6 to 360.0 mm | Range of its twelve side lines | Chapter 4
- * 628.3 mm | True girth of the tilted top end | Chapter 3
- 749 mm | Width of its flat pattern | Chapter 4
```

## Seams and where to put them

Every fitting in this book has at least one seam, a line along which the flat pattern is cut and later joined. For a triangulated fitting, the seam is one of the triangulation lines. Two considerations decide which:

- **Length.** A shorter seam is less to join and seal. In F2, the shortest line is 243.6 mm and the longest 360.0 mm, so the seam goes on the short side.
- **Access and appearance.** A seam on the inside of a bend, or on the side that faces a wall, is harder to make and inspect, and a seam facing the workshop floor is seen least. The shop's practice is to put the seam on the shortest line unless that line is inaccessible.

The seam line is the first line laid out on the sheet, and every triangle is added from it, alternately to one side, until the pattern closes on the other copy of the seam line. If the seam is on a plane of symmetry, the pattern is symmetric about the line opposite the seam, and only half needs calculating.

## The error: a connector drawn with parallel ends

This is an illustration. The first F2 connector was laid out by an apprentice who had made many eccentric reducers. The job sheet gave the bottom end, Ø250, at the origin, and the top end, Ø200, centred 80 mm across and 290 mm up, tilted 30°. The apprentice read the centre offset and height, drew an eccentric reducer of 290 mm height with an 80 mm offset, and planned to "bend it a bit" to make the angle.

The pattern's lines were wrong from the start. On the near side, where the true line is 243.6 mm, the reducer's line was √(55² + 290²) = **295.2 mm**; on the far side, where the true line is 360.0 mm, it was √(105² + 290²) = **308.4 mm**. The connector came out straight, with its top end square to the axis. Forced into the 30° position, it buckled along one side and left a gap of more than 50 mm at the other.

It was found at the trial fit, before the drop was installed, because the shop's rule is that every non-parallel fitting is offered up to a template of its two end planes before it is seamed. The apprentice's pattern was scrapped, and the shop added a line to its job sheet: "ENDS NOT PARALLEL: give both end planes; triangulate from coordinates." The deeper lesson is the one this chapter began with. A tilted end changes every line's rise; no adjustment to a parallel-ended pattern can supply that.

```figure
type: bars
title: F2's side lines, true and as drawn with parallel ends
unit: mm
max: 400
caption: This is an illustration. Treating the tilted end as horizontal makes the short side too long and the long side too short, so the fitting comes out straight.
- * True, near side | 243.6
- Parallel-ended, near side | 295.2
- * True, far side | 360.0
- Parallel-ended, far side | 308.4
```

## How the chapters build

Chapter 2 sets out the coordinates and the true-length arithmetic, using F1's lines. Chapter 3 deals with inclined ends, their true shape and how to divide them, using F2's top. Chapter 4 completes F2 and measures how the number of divisions affects accuracy. Chapters 5 to 9 develop F1, F3, F4, F5 and F6 in turn, each adding one new idea: rectangular corners, mitred collars, warped cheeks, flat ovals, twist. Chapter 10 brings them together with allowances, checks and the material list for the job.

## Exercise: the angle between two end planes

The angle between a fitting's end planes is the angle between their normals, the directions square to each plane. F2's bottom end has its normal along z, (0, 0, 1). A second machine drop on DX-3 has a top end tilted 20° about the y axis and then 15° about the x axis, which gives it a normal of (0.3420, −0.2432, 0.9077). What is the angle between its end planes? Is it 35°?

**Worked answer.**

- The cosine of the angle between two unit normals is their dot product: (0 × 0.3420) + (0 × −0.2432) + (1 × 0.9077) = 0.9077.
- The angle is the inverse cosine of 0.9077, which is **24.8°**.
- It is not 35°. Tilts about two different axes do not add; they combine like the sides of a right angle, and the combined tilt is always less than their sum.

A drawing that describes an end by two tilts must be converted to a single angle, and a single axis about which that angle is measured, before the fitting can be set out. The coordinate method makes that conversion routine: the end's normal is all that is needed.
