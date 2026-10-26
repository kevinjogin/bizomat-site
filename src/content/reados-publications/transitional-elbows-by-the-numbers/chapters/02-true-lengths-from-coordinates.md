---
book: transitional-elbows-by-the-numbers
chapterSlug: true-lengths-from-coordinates
order: 2
title: "True lengths from coordinates"
description: "Set up axes on a fitting, give every point a coordinate, find any line's true length from three differences, check it three ways, and catch lines taken from the elevation alone."
draft: false
---

Every pattern in this book is built from true lengths: the real distance, along a straight line, between two points on the fitting. On a fitting with parallel ends, a true length comes from a right-angled triangle with the line's plan length as one side and the fitting's height as the other. On a fitting whose ends face different ways, each line has its own rise, its own run across and its own run along, and the familiar diagram must be built differently for each line, or replaced by arithmetic.

This chapter replaces it with arithmetic. It puts the F1 hood outlet elbow on three axes, gives every point on its ends a coordinate, calculates the true length of each line from three differences, shows how that matches the traditional true-length diagram, sets out three checks, and ends with a pattern whose lines were read from the elevation.

## Axes for F1

F1 joins the panel saw hood to the vertical duct above it. This is an illustration. Its rectangular end is the hood's outlet face, 400 mm wide and 200 mm high, standing vertically. Its round end is Ø250, lying horizontally 300 mm above the centre of the rectangle and 250 mm out from the face, so the air turns from horizontal to vertical as it passes through.

The axes are chosen to make the numbers simple:

- the **origin** is the centre of the rectangular face;
- **x** runs square out from the face, towards the duct;
- **y** runs across the face, along the 400 mm side;
- **z** runs vertically upward.

The rectangle's four corners are then at x = 0, y = ±200, z = ±100. The round end's centre is at (250, 0, 300), and each of its points is 125 mm from that centre in a horizontal plane. A point at angle θ round the circle, measured from the +x direction, is at (250 + 125 cos θ, 125 sin θ, 300).

That one formula gives every point on the round end. For θ = 90°, the point nearest the +y side, it gives (250, 125, 300); for θ = 180°, the point nearest the hood, (125, 0, 300); for θ = 0°, the point farthest from the hood, (375, 0, 300).

```figure
type: compare
title: Corner and circle points on F1
rowhead: Point
cols: x | y | z | Where it is
caption: This is an illustration. Coordinates in millimetres from the centre of the rectangular face, on the mean line.
- Corner 1 | 0 | 200 | 100 | top corner, +y side
- Corner 3 | 0 | −200 | −100 | bottom corner, −y side
- Circle, θ = 90° | 250 | 125 | 300 | round end, +y side
- Circle, θ = 180° | 125 | 0 | 300 | round end, nearest the hood
- * Circle, θ = 270° | 250 | −125 | 300 | round end, −y side
- Circle, θ = 0° | 375 | 0 | 300 | round end, farthest from the hood
```

## The true length from three differences

The true length of a straight line between two points is the square root of the sum of the squares of the differences in their three coordinates. It is Pythagoras's theorem used twice: once to combine the run across and the run along into the plan length, and again to combine the plan length and the rise.

```figure
type: formula
title: True length of a line between two points
formula: TL = √(Δx² + Δy² + Δz²)
caption: Worked for the line from F1's corner 3 to the circle point at θ = 270°. The same arithmetic serves every line on every fitting in this book.
- Δx | Difference in x, 250 − 0 = 250 mm
- Δy | Difference in y, −125 − (−200) = 75 mm
- Δz | Difference in z, 300 − (−100) = 400 mm
step: Δx² + Δy² + Δz² = 62,500 + 5,625 + 160,000 = 228,125
step: TL = √228,125 = 477.6 mm
```

The signs of the differences do not matter, because each is squared. What matters is that the three differences are taken between the same two points, in the same axes, and that the coordinates of both points are on the same line of the sheet, the mean line in this book.

## How the arithmetic matches the drawing

A traditional true-length diagram does the same calculation with a straightedge. The **plan length** of the line is the distance between its ends in the plan view, √(Δx² + Δy²); the **rise** is Δz, read from the elevation. A right-angled triangle drawn with those two sides has the true length as its hypotenuse.

The same true length can come from any pair of views at right angles. The **elevation length**, seen looking along y, is √(Δx² + Δz²); the **depth**, the run along y that the elevation hides, is Δy. A triangle with those two sides has the same hypotenuse. Both diagrams are correct. What goes wrong is using a length from one view as if it were the true length, which is exactly the mistake at the end of this chapter.

For the corner 3 line, the plan length is √(250² + 75²) = 261.0 mm and the rise 400 mm, giving √(261.0² + 400²) = 477.6 mm. The elevation length is √(250² + 400²) = 471.7 mm and the depth 75 mm, giving √(471.7² + 75²) = 477.6 mm. Three routes, one answer.

## F1's corner lines

F1's surface is made of four flat triangles, one on each side of the rectangle, and four fans of lines from the rectangle's corners to the circle, one fan per quarter of the circle. Chapter 5 develops the whole fitting. Here are the lines from two of the corners, with the round end divided into twelve, so that each quarter has three divisions and four points.

```figure
type: compare
title: True lengths of F1's lines from two corners
rowhead: Line
cols: Δx, Δy, Δz | Plan length | Elevation length | True length
caption: This is an illustration. Corner 1 is the top corner on the +y side; corner 3 the bottom corner on the −y side. Corners 2 and 4 are the mirror images.
- Corner 1 to θ = 90° | 250, −75, 200 | 261.0 | 320.2 | 328.8
- Corner 1 to θ = 120° | 187.5, −91.7, 200 | 208.7 | 274.1 | 289.1
- Corner 1 to θ = 150° | 141.7, −137.5, 200 | 197.5 | 245.1 | 281.1
- Corner 1 to θ = 180° | 125, −200, 200 | 235.8 | 235.8 | 309.2
- Corner 3 to θ = 270° | 250, 75, 400 | 261.0 | 471.7 | 477.6
- Corner 3 to θ = 300° | 312.5, 91.7, 400 | 325.7 | 507.6 | 515.8
- Corner 3 to θ = 330° | 358.3, 137.5, 400 | 383.7 | 537.0 | 554.3
- * Corner 3 to θ = 360° | 375, 200, 400 | 425.0 | 548.3 | 583.6
```

Two features of the table are worth noticing. The shortest line from corner 1 is not the one to the nearest circle point at θ = 180°, but the one to θ = 150°, at 281.1 mm, because that point is closer in y. And the corner 3 lines, which reach from the bottom of the hood face to the top of the duct, are much longer than the corner 1 lines: the fitting is lopsided, as an elbow must be, and its pattern will be too.

## Lines a view shows true

Some lines on F1 are shown at their true length in an ordinary view, and they make useful checks on a drawing. A line is shown true in a view when it is parallel to that view's plane, which in coordinates means that the difference along the viewing direction is zero.

- The **edges of the rectangle** lie in the plane x = 0. Seen square to the hood face, looking along x, they show at their true lengths of 400 and 200 mm.
- The **chords of the round end** lie in the horizontal plane z = 300. The plan shows them true: with twelve divisions, each chord is 2 × 125 × sin 15° = 64.7 mm.
- The line from **corner 1 to θ = 180°**, (125, −200, 200), has no zero difference, so no ordinary view shows it true. Its plan length and elevation length happen to be equal, 235.8 mm, because Δy and Δz are equal; neither is its true length of 309.2 mm.

A traditional drawing would add an **auxiliary view**, looking square to a chosen line, to show that line true. Each auxiliary view serves a handful of lines at most. The coordinate method needs no auxiliary views, because it never relies on a line being parallel to anything; but the true edges and chords are still worth checking on the drawing, because a drawing that shows the hood face as 398 mm wide has an error that will reach every line.

## Three checks on every true length

A wrong true length makes a wrong pattern, and the error is invisible until the fitting is formed. Three checks catch most errors before then.

1. **A true length is never shorter than any of its views.** The true length must be at least as long as the plan length, the elevation length, and each of the three differences. If a calculated line of 470 mm has a rise of 400 mm and a plan length of 261 mm, something is wrong: √(400² + 261²) is 477.6 mm, not 470.
2. **Mirror lines are equal.** On a fitting symmetric about a plane, each line has a mirror image of the same length. F1 is symmetric about the plane y = 0, so the line from corner 1 to θ = 120° must equal the line from corner 2 to θ = 240°. A table that does not show those pairs equal has a sign error somewhere.
3. **Triangles must close.** The three sides of every triangle must satisfy the triangle rule: each side shorter than the sum of the other two. A triangle that fails cannot be laid out, and one that barely passes, with one side nearly equal to the sum of the others, is a sliver that the pattern will reproduce poorly.

The first check is the most useful in practice, because it catches the commonest error: a coordinate entered from the wrong point. The second catches sign errors in the setting out. The third catches lines assigned to the wrong triangle.

## Rounding and precision

The coordinates in this book are given to 0.1 mm and the true lengths calculated from unrounded values, then rounded to 0.1 mm. That precision is more than a pattern needs, but it lets the arithmetic be followed and checked. How much does coordinate rounding matter? A coordinate rounded by up to 0.05 mm changes a difference by up to 0.1 mm, and a true length by less than that, because the change is shared among three squared terms. Rounding to the nearest millimetre in the coordinates would move a true length by up to about 1 mm, still smaller than the accuracy of marking a pattern on sheet. Rounding the circle's points before calculating, though, accumulates round the circle. The shop's practice is to calculate every point from the circle's formula, never from the previous point.

## A spreadsheet for true lengths

The calculation suits a spreadsheet. One table lists the points of each end, by number, with their x, y and z. A second table lists the lines, each by its two point numbers, looks up the coordinates, and calculates the three differences and the true length. A column for the plan length and one for the elevation length, though not needed for the pattern, make the first check automatic: a formula flags any true length shorter than either. A third table lists the triangles by their three lines and flags any that fail the triangle rule. The DX-3 job keeps one such workbook per fitting, and the workbook goes with the pattern so that anyone can check it.

## The error: lines taken from the elevation

This is an illustration. The first F1 pattern was laid out by a sheet metal worker who drew an elevation of the fitting, looking along y, and measured each line's length directly from it with dividers. The elevation showed the rectangular face as a vertical line and the round end as a horizontal line, with every line from a corner to a circle point drawn between them.

The elevation lengths are not true lengths: each is too short by the amount its depth, the hidden Δy, would add. For the line from corner 3 to θ = 270°, the elevation gave 471.7 mm against 477.6 mm, 5.9 mm short. For the line from corner 3 to θ = 360°, it gave 548.3 mm against 583.6 mm, **35.3 mm short**. The worst errors were on the longest lines, at the back of the fitting, where Δy is largest.

The pattern closed on the sheet, because a set of wrong lengths still makes a closed outline. But formed, the fitting would not fit: its back was too short to reach the round end, and the duct collar sat tilted by several degrees. It was found at the trial fit against the hood. The fix was to recalculate every line from coordinates, and the shop's job sheet now says that no line may be measured from a single view.

```figure
type: bars
title: F1's corner 3 lines, elevation length against true length
unit: mm
max: 600
caption: This is an illustration. The elevation hides each line's run across, so the shortfall grows with Δy, from 5.9 mm to 35.3 mm.
- θ = 270°, elevation | 471.7
- * θ = 270°, true | 477.6
- θ = 360°, elevation | 548.3
- * θ = 360°, true | 583.6
```

The lesson generalises. A line's length in any one view is a true length only if the line is parallel to that view's plane. On a fitting with parallel ends, the lines are usually far from parallel to any view, but their rise is constant, so one diagram serves. On a fitting whose ends are not parallel, there is no view in which more than a few lines are true, and the coordinates are the only reliable source.

## Exercise: a corner 4 line

Using F1's coordinates, find the true length of the line from corner 4, at (0, 200, −100), to the circle point at θ = 30°. Find also its plan length and elevation length, and confirm that the true length passes the first check.

**Worked answer.**

- The circle point at θ = 30° is at (250 + 125 cos 30°, 125 sin 30°, 300) = (358.3, 62.5, 300).
- The differences are Δx = 358.3, Δy = 62.5 − 200 = −137.5 and Δz = 300 − (−100) = 400.
- The true length is √(358.3² + 137.5² + 400²) = **554.3 mm**.
- The plan length is √(358.3² + 137.5²) = 383.7 mm, and the elevation length √(358.3² + 400²) = 537.0 mm.

The true length is longer than both, so it passes the first check. It also equals the line from corner 3 to θ = 330°, its mirror image across y = 0, which is the second check.
