---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: triangulation-and-true-lengths
order: 7
title: "Triangulation and true lengths: the eccentric reducer"
description: "Develop an eccentric reducer by triangulation: divide both ends, find every side and diagonal's true length from plan and height, build the pattern triangle by triangle, and step arcs, not chords."
draft: false
---

Triangulation is the method that develops anything developable. It needs no axis, no apex and no parallel generators. The surface is divided into narrow triangles whose corners lie on its two edges, the true length of every side is found from its plan length and its height, and the triangles are laid out one after another until the pattern closes. It is slower than parallel or radial lines, but it never fails on an awkward shape, and a pattern maker who can triangulate can develop almost any fitting a drawing shows.

This chapter triangulates the running case's eccentric reducer, from Ø200 to Ø150 over 250 mm with one side flat. Its surface is part of an oblique cone, whose apex is off the axis, so radial lines would need extra steps and triangulation is the natural method. It ends with a pattern that was triangulated correctly and still came out 7 mm short, because its edges were stepped as chords.

## The eccentric reducer

This is an illustration. On the horizontal run towards the sander drop, the duct reduces from Ø200 to Ø150. The designer wants the reducer flat along its top, so that no ledge is left where dust could settle as the air slows into the larger size, which means the two circles touch at one point in plan. On the mean line of 0.8 mm sheet the large end has a radius of 100.4 mm and the small end 75.4 mm, so the small end's centre is offset by 100.4 − 75.4 = 25.0 mm towards the flat side. The ends are parallel and 250 mm apart.

In plan, the reducer is two circles, one inside the other, touching at the flat side. In elevation, the flat side is a straight vertical line 250 mm long and the opposite side slopes in by 50 mm over the same height.

## Dividing and joining

1. Divide each circle in plan into 12 equal parts, numbering both from 0 on the flat side to 6 on the far side. Call the large end's points B0 to B6 and the small end's A0 to A6. By symmetry, only one half needs to be worked.
2. Join each A point to the B point with the same number. These are the **side lines**, approximations to the surface's generators.
3. Join each A point to the next B point, A0 to B1, A1 to B2 and so on. These are the **diagonals**, which split each four-sided panel between neighbouring side lines into two triangles.
4. For every side line and diagonal, measure its length in plan and take its height from the elevation, here 250 mm for every line since all run from one end to the other.

```figure
type: svg
title: The eccentric reducer in plan, triangulated
alt: Plan view of two circles, a large one of radius 100.4 mm and a smaller one of radius 75.4 mm inside it, touching at the right-hand side. On the upper half, solid lines join each point on the small circle to the matching point on the large circle, and dashed lines join each small-circle point to the next large-circle point, dividing the space between the circles into narrow triangles.
caption: This is an illustration at full size in plan. Side lines are solid; diagonals are dashed. The flat side is on the right, where the two circles touch and line 0 has no plan length at all.
viewbox: 0 0 400 270
body:
<circle class="bx" cx="200" cy="150" r="100.4"/>
<circle class="bxi" cx="225" cy="150" r="75.4"/>
<path class="li" d="M290.3 112.3L286.9 99.8M262.7 84.7L250.2 63.1M225 74.6L200 49.6M187.3 84.7L149.8 63.1M159.7 112.3L113.1 99.8M149.6 150L99.6 150"/>
<path class="la dsh" d="M300.4 150L286.9 99.8M290.3 112.3L250.2 63.1M262.7 84.7L200 49.6M225 74.6L149.8 63.1M187.3 84.7L113.1 99.8M159.7 112.3L99.6 150"/>
<text class="txs" x="306" y="154">0</text>
<text class="txs" x="196" y="42">B3</text>
<text class="txs" x="220" y="90">A3</text>
<text class="txs" x="80" y="154">6</text>
<text class="txs" x="40" y="260">Large end Ø200.8 mean, small end Ø150.8 mean</text>
```

## True lengths from plan and height

Every line in the reducer rises 250 mm, so its true length is √(p² + 250²), where p is its plan length. The bench method sets this out as a **true length diagram**: a vertical line 250 mm high, with each plan length laid off horizontally from its foot, and the hypotenuse to the top of the vertical measured as the true length. Calculation is quicker and exact.

The plan lengths follow from coordinates. With the large end's centre at the origin and the flat side along the positive x direction, point Bi is at (100.4 cos 30i°, 100.4 sin 30i°) and Ai at (25 + 75.4 cos 30i°, 75.4 sin 30i°). The plan length of any line is the distance between its end points' coordinates.

```figure
type: compare
title: True lengths of the eccentric reducer's lines
rowhead: Line
cols: Plan length, mm | True length, mm
caption: Height 250 mm for every line. Side line 0 is the flat side, vertical in elevation; side line 6 is the far side, which slopes in by 50 mm. The second half mirrors the first.
- Side A0–B0 | 0.0 | 250.0
- Diagonal A0–B1 | 52.0 | 255.3
- Side A1–B1 | 12.9 | 250.3
- Diagonal A1–B2 | 63.5 | 257.9
- Side A2–B2 | 25.0 | 251.2
- Diagonal A2–B3 | 71.9 | 260.1
- Side A3–B3 | 35.4 | 252.5
- * Diagonal A3–B4 | 76.1 | 261.3
- Side A4–B4 | 43.3 | 253.7
- Diagonal A4–B5 | 75.8 | 261.2
- Side A5–B5 | 48.3 | 254.6
- Diagonal A5–B6 | 70.9 | 259.9
- Side A6–B6 | 50.0 | 255.0
```

A useful check: the side lines' true lengths rise steadily from 250.0 mm on the flat side to 255.0 mm on the far side, and the far side's length equals √(50² + 250²) = 255.0 mm, the sloping outline of the elevation, which is a true length because it lies in the plane of the drawing. If the table did not reproduce that outline length, a plan length would be wrong.

## Building the pattern

The pattern is built triangle by triangle, starting from the seam. The running case puts the seam on the flat side, line 0, because it is the shortest line, it is straight in elevation and it sits on top of the duct, away from settled dust.

1. Draw line A0–B0, 250.0 mm long. This is one edge of the pattern.
2. From B0, swing an arc whose radius is the large end's spacing. From A0, swing an arc of 255.3 mm, the diagonal A0–B1. Where they cross is B1.
3. From A0, swing an arc of the small end's spacing. From B1, swing an arc of 250.3 mm, side line A1–B1. Where they cross is A1.
4. Repeat for each pair of triangles, around to A6–B6, then mirror the half pattern about line 6 or continue round to line 12.
5. Draw smooth curves through the B points and through the A points. These are the pattern's large and small edges.

The last side line drawn, A12–B12, should be 250.0 mm long and should land exactly where the first line, mirrored, would. When it does, the pattern has closed, which is triangulation's built-in check: every length used is independent, so an error anywhere shows up at the closure.

## Spacing: arcs, not chords

Step 2 needs the spacing between neighbouring points on each end. The distance in plan between B0 and B1 is a chord: 2 × 100.4 × sin 15° = 51.97 mm. The arc between them is 1/12 of the large girth, 630.8 ÷ 12 = 52.57 mm. On the small end, the chord is 39.03 mm and the arc 39.48 mm.

Triangulating with chords develops a polyhedron, a surface of flat triangles inscribed inside the true curved surface. The geometry is exact for that polyhedron, but the polyhedron's edge is a polygon whose perimeter is shorter than the circle. Formed, the pattern's ends would have the girth of the polygon, not of the circle.

```figure
type: bars
title: Pattern edge lengths of the eccentric reducer
unit: mm
max: 650
caption: Triangulating with chords gives an edge 1.1% short at both ends. Using the arc length between points gives the correct girths.
- Large end, chords | 623.7
- * Large end, arcs | 630.8
- Small end, chords | 468.4
- * Small end, arcs | 473.8
```

The remedy is to use the arc length for each step along the ends while keeping the true lengths of the side lines and diagonals. The triangles are then very slightly distorted, but the pattern's edges have the right length, which is what matters when the reducer must slip over a pipe. The difference in the side lines is negligible: the pattern built with arcs closes on a final side line of 250.0 mm, the same as with chords. Dividing into 24 parts instead of 12 reduces the chord shortfall to about a quarter, but using arcs removes it.

## A spreadsheet for triangulation

The table above takes a few minutes by hand and less in a spreadsheet, and the spreadsheet is worth keeping because the same layout develops any surface between two curves.

1. **Points.** One row per division, with columns for the x and y coordinates of the A point and the B point, and a column for each end's height. For the eccentric reducer, the heights are 0 and 250 mm.
2. **Side lines.** Plan length from Ai to Bi, then true length from the plan length and the height difference.
3. **Diagonals.** Plan length from Ai to Bi+1, then true length the same way.
4. **Steps along the ends.** For circular ends, the arc length, girth ÷ 12. For ends of any other shape, the length of each step along the curve, measured from the drawing or calculated from the curve.
5. **Checks.** The first and last side lines against the drawing's outline, where they are true lengths, and the sum of each end's steps against its girth.

Changing the ends' coordinates turns the same sheet into a pattern for a reducer of any size and offset, and with a little more work, for the transition of Chapter 8. A shop that triangulates often keeps one such sheet per kind of fitting and prints the table for the bench.

## How fine to divide

Twelve divisions are customary for duct of this size, and they are enough here for two reasons. First, the side lines of an oblique cone are true generators, straight lines on the surface, so the panels between them are very nearly flat, and splitting each into two triangles loses almost nothing. Second, the arc steps along the ends fix the girths whatever the number of divisions.

For surfaces whose side lines are not true generators, such as a transition between two shapes where the "obvious" joining lines twist, the panels can be noticeably warped, and more divisions are needed for the triangles to follow the surface. A good test is to triangulate each panel both ways, with the diagonal from Ai to Bi+1 and from Ai+1 to Bi. If the two diagonals' true lengths imply a panel that is flat, the division is fine enough; if they differ by more than about 1 mm from what a flat panel would give, divide more finely.

## Why not radial lines

The eccentric reducer is part of an **oblique cone**: extend its side lines and they meet at one apex, but that apex is not on the line joining the two circle centres. Radial line development can be adapted to an oblique cone by finding each generator's true length from the apex, and some pattern makers prefer it. Triangulation reaches the same pattern without locating the apex. For this reducer the apex lies on the line of the flat side, 1,004 mm beyond the large end, and a pattern drawn from it needs a trammel over a metre long, while the triangulated pattern fits on a normal bench.

The two methods give the same pattern, and that is useful. A pattern developed by triangulation can be checked by measuring its edge curves' lengths, which must equal the girths, and its seam line, which must equal the flat side's 250 mm. Nothing else is needed.

## The error: an exact triangulation 7 mm short

This is an illustration. The shop's first eccentric reducer was triangulated with care. Every true length in the table was calculated and checked, the triangles were built exactly, and the pattern closed perfectly. But the spacing along each end was stepped with dividers set to the chord distance between plan points, measured from the plan drawing.

The formed reducer's large end measured about 7 mm short in girth: 623.7 mm on the mean line against the 630.8 mm required, a mean diameter of 198.5 mm instead of 200.8. Its small end was 5.4 mm short. The large end would not slip over the Ø200 duct's crimped spigot, and the small end gripped the Ø150 duct so tightly that it split at the seam when driven home.

The fault was found with a girth tape on the first-off reducer and traced in minutes: the shortfall was 1.1% at both ends, the signature of chords used in place of arcs. The table of true lengths was right; only the step along each edge was wrong. The shop's job sheet for triangulated patterns now gives both numbers, the chord and the arc, with the arc marked "use this".

Nothing could save the reducer itself. Galvanised sheet cannot be stretched 7 mm around a girth without thinning and cracking the coating, and a strip let into the seam would have left two seams and a ridge where dust collects. The shop scrapped the piece, corrected the pattern and recut. Because the first-off check found the fault, only one reducer was lost; had the batch of four been cut from the uncorrected pattern before any was formed, all four would have gone. That is the case for forming and measuring one piece before cutting the rest, on every new pattern, however carefully it was set out.

## Exercise: check the far side

Without the table, find the true length of side line A6–B6 and of diagonal A5–B6, and check that the triangle A5–B5–B6 can be drawn.

**Worked answer.** On the far side, B6 is at (−100.4, 0) and A6 at (25 − 75.4, 0) = (−50.4, 0). The plan length of A6–B6 is 50.0 mm, so its true length is √(50² + 250²) = **255.0 mm**, equal to the elevation's sloping outline.

A5 is at (25 + 75.4 cos 150°, 75.4 sin 150°) = (−40.3, 37.7). The plan distance from A5 to B6 is √((−100.4 + 40.3)² + 37.7²) = √(3,612 + 1,421) = 70.9 mm, so its true length is √(70.9² + 250²) = **259.9 mm**.

The triangle A5–B5–B6 has sides of 254.6 mm (side line A5–B5), 259.9 mm (diagonal A5–B6) and 52.57 mm (the arc step along the large end). Each side is shorter than the sum of the other two, so the triangle can be drawn, and its narrow shape, two long sides and a short base, is typical of a triangulated pattern.
