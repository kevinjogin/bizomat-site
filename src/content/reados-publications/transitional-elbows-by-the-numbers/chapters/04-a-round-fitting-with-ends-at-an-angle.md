---
book: transitional-elbows-by-the-numbers
chapterSlug: a-round-fitting-with-ends-at-an-angle
order: 4
title: "A round fitting with ends at an angle"
description: "Triangulate F2, a Ø250 to Ø200 connector with ends at 30°: side lines, diagonals, a half pattern laid out from coordinates, and how the number of divisions changes the pattern's accuracy."
draft: false
---

With both ends of the F2 connector described and divided, the rest is the familiar routine of triangulation: join the points, calculate every line, lay the triangles out flat. What is new is that no two side lines rise by the same height and no diagonal can be read from a single view, so every number in the pattern comes from the coordinates. The reward is a pattern that can be checked line by line, by anyone, before a single cut is made.

This chapter calculates F2's side lines and diagonals, lays out its half pattern from the seam, gives the pattern as coordinates on the sheet, measures how the number of divisions changes the result, and ends with a connector developed from too few divisions.

## The side lines

F2's bottom end is Ø250 at the origin, horizontal; its top end is Ø200 centred at (80, 0, 290) and tilted 30°, as Chapter 3 set out. Both ends are divided into twelve, and each bottom point at angle θ is joined to the top point at the same θ. Because the fitting is symmetric about the plane y = 0, only the lines from θ = 0° to 180° need calculating; the rest are their mirror images.

The side line at θ = 0° joins the bottom point (125, 0, 0) to the top point (166.6, 0, 240): Δx = 41.6, Δy = 0, Δz = 240, and the true length is √(41.6² + 240²) = **243.6 mm**. The side line at θ = 180° joins (−125, 0, 0) to (−6.6, 0, 340): Δx = 118.4, Δz = 340, and the true length is √(118.4² + 340²) = **360.0 mm**. Every other side line lies between them, rising and falling smoothly round the fitting.

## The diagonals

Each strip between neighbouring side lines is split by a diagonal. On the half from θ = 0° to 180°, every diagonal joins the bottom point at the higher angle to the top point at the lower angle: bottom 30° to top 0°, bottom 60° to top 30°, and so on. On the other half, the diagonals are the mirror images, so the two halves of the pattern are mirror images too.

```figure
type: compare
title: F2's lines for the half from θ = 0° to 180°
rowhead: Strip
cols: Side line at its start | Diagonal | Side line at its end
caption: This is an illustration. True lengths in millimetres, on the mean line, from the coordinates in Chapter 3. Each diagonal joins the bottom point at the strip's higher angle to the top point at its lower angle.
- 0° to 30° | 243.6 | 254.8 | 251.4
- 30° to 60° | 251.4 | 269.8 | 272.7
- 60° to 90° | 272.7 | 294.8 | 301.9
- 90° to 120° | 301.9 | 323.2 | 331.0
- 120° to 150° | 331.0 | 347.6 | 352.2
- * 150° to 180° | 352.2 | 361.2 | 360.0
```

Two quick checks confirm the table. Every diagonal is longer than the side line at the start of its strip, because it reaches 30° further round the bottom; and the diagonals grow in the same order as the side lines. A diagonal shorter than both side lines of its strip would mean a point had been taken from the wrong side of the fitting.

## The steps between points

The third side of every triangle is a step along one of the ends. The pattern's bottom edge must total the bottom end's girth, π × 250 = 785.4 mm, and its top edge the top end's girth, π × 200 = 628.3 mm. The steps between points are therefore the arc lengths, not the chords:

- **bottom**: 785.4 ÷ 12 = **65.4 mm** per step, against a chord of 64.7 mm;
- **top**: 628.3 ÷ 12 = **52.4 mm** per step, against a chord of 51.8 mm.

Laying the pattern out with the arc steps makes its edges the right length; using the chords would leave the bottom edge 8.9 mm short and the top 7.1 mm short. READOS's [Sheet Metal Patterns by the Numbers](/reados/publications/sheet-metal-patterns-by-the-numbers/triangulation-and-true-lengths/) sets out why at length, with an eccentric reducer as its example.

## Laying out the half pattern

The pattern is symmetric about the longest side line, the one at θ = 180°, so the layout starts there and works outward to the seam.

1. **Strike the centre line**, 360.0 mm long. Its bottom end is bottom point 6 (θ = 180°) and its top end is top point 6.
2. **Find bottom point 5** at 65.4 mm from bottom point 6 and at the diagonal's 361.2 mm from top point 6. Two arcs, one from each, cross at the point.
3. **Find top point 5** at 52.4 mm from top point 6 and at the side line's 352.2 mm from bottom point 5.
4. **Repeat** for each strip, working outward: a bottom point from its step and its diagonal, then a top point from its step and its side line.
5. **Finish at the seam**, the side line at θ = 0°, which should measure 243.6 mm between the last bottom and top points.
6. **Mirror the half** about the centre line for the other half, and draw smooth curves through the points along each edge.

Each new point depends on the one before, so errors accumulate outward. The seam line's length, checked at the end, is the test of the whole half: if it measures 243.6 mm, every triangle has been laid out correctly.

## The pattern as coordinates

Laying the pattern out by arcs is how it was done for a century, and it still works. A coordinate list does the same job faster and more accurately, and suits a cutting table or a printed template. Taking the bottom end of the centre line as the origin, with the centre line running up the sheet, the half pattern's points are as follows.

```figure
type: compare
title: F2's half pattern as coordinates on the sheet
rowhead: Point at θ
cols: Bottom edge, across | Bottom edge, up | Top edge, across | Top edge, up
caption: This is an illustration. Millimetres from the bottom end of the 360.0 mm centre line, which runs up the sheet. The other half is the mirror image across the centre line.
- 180° (centre line) | 0 | 0 | 0 | 360.0
- 150° | −65.2 | 5.4 | −52.3 | 357.4
- 120° | −128.8 | 20.8 | −104.2 | 350.8
- 90° | −190.4 | 43.0 | −156.0 | 342.9
- 60° | −250.9 | 67.9 | −208.0 | 337.2
- 30° | −312.0 | 91.5 | −260.4 | 337.5
- * 0° (seam) | −374.5 | 110.8 | −312.0 | 346.3
```

The pattern is a curved band, wider at the bottom than at the top, rising towards its seam ends. Across the bottom, from seam to seam, it is 749.0 mm wide; across the top, 624.1 mm. Its area, from the full triangulation, is about 0.21 m², which at 0.8 mm is about 1.3 kg of galvanised steel before any allowance.

## How fine to divide

A triangulated pattern is only as good as its divisions. Each pair of triangles replaces a curved strip of surface with two flat pieces, and where the surface curves between the points the triangles cut across it. The more divisions, the closer the pattern comes to the surface that the coordinates describe.

The connector was triangulated again with six, twelve, twenty-four and forty-eight divisions round each end, and each pattern was compared, point for point, with one made from 3,600 divisions, which is as close to exact as the drawing allows. The largest distance between a pattern's point and the same point on the fine pattern measures the pattern's error.

```figure
type: bars
title: Largest point error in F2's pattern, by number of divisions
unit: mm
max: 6
caption: This is an illustration. Errors measured against a pattern made from 3,600 divisions, with arc steps along both edges in every case.
- 6 divisions | 5.3
- * 12 divisions | 0.7
- 24 divisions | 0.1
- 48 divisions | 0.0
```

Twelve divisions put every point within 0.7 mm, less than the width of a scribed line on a small connector, which is why twelve is the shop's standard for F2. Six divisions put the seam ends more than 5 mm out. Twenty-four are worth using on larger or more distorted fittings, where the curvature between points is greater.

The error does not depend on the number of divisions alone. It depends on how much the surface curves and twists between neighbouring side lines, and that is greatest where the two ends are most out of parallel. A gently tilted connector can be triangulated with fewer divisions than a sharply turning elbow of the same size. The way to know is to do what this section did: develop the pattern twice, with the shop's number of divisions and with twice as many, and compare.

## What the triangles approximate

The twelve-division pattern is accurate to 0.7 mm, but accurate to what? F2's surface, as the coordinates define it, is the one swept by straight lines joining matching points on the two ends. That surface is not exactly developable: no flat pattern can be wrapped onto it without some slight stretching. The triangulated pattern is the best flat approximation, and the 0.8 mm sheet takes up the remaining difference as it is formed, bending a little along the diagonals as well as the side lines.

For F2 that difference is too small to measure in the shop. For fittings that twist more, it is not, and Chapter 9 shows a fitting whose faces must be folded deliberately along their diagonals. The principle is the same in both: the triangles are flat, the surface is not, and the forming takes up the difference.

## From pattern to cut piece

The coordinate list is the pattern on the mean line, with no allowances. Before cutting, the shop adds what the joints need, and Chapter 10 sets out the full list for DX-3. For F2, that is a lap along one seam edge for a riveted and sealed lap seam, a swaged or plain spigot allowance at the bottom end where it slips into the branch, and a bead allowance at the top end for the hose clamp. Each allowance is added square to the pattern's edge, which on a curved edge means offsetting the curve, not adding a strip of constant width in one direction.

The order matters. Allowances are added after the mean-line pattern has been checked, so that the checks compare like with like: the seam line of 243.6 mm, the edge lengths of 785.4 and 628.3 mm, and the pattern's width of 749.0 mm all refer to the mean line. A pattern checked after allowances have been added has to have the allowances subtracted again in every check, and that is where errors creep in.

## Comparing with a CAD loft

Most sheet metal CAD systems can make F2 directly, by lofting between the two end circles and flattening the result. The flattened loft and the triangulated pattern should agree closely, and comparing them is a useful check on both. Three differences are common. The CAD loft may join the ends by a different rule, matching points by arc length rather than by angle, which makes a slightly different surface. It may flatten with a different number of facets. And it may develop on the inside or outside of the sheet rather than the mean line. If the two patterns differ by more than a millimetre or two, the cause is almost always one of those three, and it is worth finding before trusting either.

## The error: a connector from six divisions

This is an illustration. A second F2 connector was needed in a hurry for a replacement drop, and a worker developed it with six divisions instead of twelve, to halve the number of lines. The side lines and diagonals were calculated correctly from coordinates, the steps were the correct arcs of 130.9 and 104.7 mm, and the half pattern's seam line measured exactly 243.6 mm. Every check in the layout passed.

But the pattern's points were up to 5.3 mm from where a fine triangulation put them, and the smooth curves the worker drew through only seven points per edge wandered further between them. Formed, the connector's top end sat visibly out of its 30° plane, and the hose collar went on tight on one side and loose on the other. It was found at the trial fit. The pattern was redrawn with twelve divisions, and the second connector fitted.

The lesson is about which checks prove what. The seam-length check proves that the triangles were laid out as calculated; it cannot prove that the triangles were fine enough to represent the surface. Only a comparison with a finer triangulation, or a trial piece, does that.

## Exercise: the strip at 90°

Using the coordinates, check the diagonal of the strip from θ = 60° to 90°, which joins bottom point at 90° to top point at 60°. Then find the angle at the bottom point in that triangle, between the step back to bottom point 60° and the diagonal.

**Worked answer.**

- The bottom point at θ = 90° is (0, 125, 0), and the top point at θ = 60° is (123.3, 86.6, 265.0).
- The differences are 123.3, −38.4 and 265.0, and the diagonal is √(123.3² + 38.4² + 265.0²) = **294.8 mm**, as in the table.
- The triangle's sides are the bottom chord from 60° to 90°, 64.7 mm, the diagonal, 294.8 mm, and the side line at 60°, 272.7 mm.
- By the cosine rule, the angle at the bottom point between the chord and the diagonal is the inverse cosine of (64.7² + 294.8² − 272.7²) ÷ (2 × 64.7 × 294.8) = **64.0°**.

On the pattern, where the step is the 65.4 mm arc rather than the 64.7 mm chord, the same angle comes out at 64.1°, a tenth of a degree larger. That small difference is one reason the arc steps keep the edges the right length. The pattern angle is what the arcs in step 2 of the layout find without calculation. A spreadsheet can calculate every such angle and give the pattern as coordinates directly.
