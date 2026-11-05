---
book: marking-out-by-the-numbers
chapterSlug: polygons-on-the-bench
order: 7
title: "Polygons on the bench"
description: "Mark hexagons, octagons and pentagons by construction, see why stepping sides round a polygon fails at the turns, and check a finished polygon by its sides, diagonals and flats."
draft: false
---

Regular polygons turn up in sheet metal more often than their geometry lessons suggest: hexagonal and octagonal bases and covers, octagonal hoods and hopper tops, faceted ducts, polygonal flanges that approximate a circle with straight folds. They are also the shapes where a small error at one corner shows most plainly, because a regular polygon has nowhere to hide it. Seven equal sides and one short one is obvious to anyone who looks.

This chapter marks the C-12 base plate, a regular octagon 600 mm across flats, by three methods and compares their accuracy. It shows why the hexagon is self-correcting, proves that an old construction for the pentagon is exact, and ends with an octagon built by stepping its sides round with a steel square, which looked right until its last side failed to meet its first by more than 4 mm.

## Across flats, across corners and the side

A regular polygon of n sides is described by any one of three sizes: the distance across flats (AF), between opposite sides; the distance across corners (AC), between opposite corners; or the side length. For an even number of sides they are related by:

- side = AF × tan(180° ÷ n)
- AC = AF ÷ cos(180° ÷ n)

```figure
type: compare
title: Sizes of the C-12 octagon and a hexagon variant, 600 mm across flats
rowhead: Polygon
cols: Side | Across corners | Circumscribed radius | Corner angle
caption: Exact values. The octagon's corner triangles, cut from a 600 mm square, have legs of 175.74 mm, and their hypotenuse equals the side, 248.53 mm, which is a useful check.
- * Octagon (n = 8) | 248.53 mm | 649.44 mm | 324.72 mm | 135°
- Hexagon (n = 6) | 346.41 mm | 692.82 mm | 346.41 mm | 120°
```

[Polygons, ellipses and inclined views](/reados/publications/drafting-geometry-by-the-numbers/polygons-ellipses-and-inclined-views/) covers these relationships in detail for drawings, and the BIZOMAT [Regular Polygon and Hexagon Sizes](/tools/regular-polygon/) tool gives them for any polygon as a quick check. On the bench, the question is not the formula but which construction gives the most accurate shape with the least to go wrong.

## The hexagon corrects itself

The hexagon is the easiest regular polygon to mark, for a reason that is worth understanding. Its side equals the radius of its circumscribed circle, so it can be marked by drawing a circle with the dividers and stepping the same setting six times round it.

If the dividers are set slightly wrong, say 0.1 mm long, the circle is 0.1 mm larger in radius and every step is 0.1 mm longer. But the chord of 60° on that larger circle is still equal to its radius, so the six steps still close exactly. The setting error makes the hexagon slightly bigger; it does not make it irregular. Only the random placement of each step remains, and that is a few tenths of a millimetre at most. The method protects the shape automatically, as long as the setting is not touched between drawing the circle and stepping round it.

The hexagon's size then depends on one measurement, the divider setting, which can be checked across flats once the hexagon is marked. If the across-flats distance is wrong, the whole hexagon is re-marked with a corrected setting.

## The octagon three ways

### Method 1: corner arcs on a square

This method needs no numbers beyond the square. Mark a square of side AF, here 600 mm, and check its diagonals: both should be 848.53 mm. From each corner, swing an arc of half a diagonal, 424.26 mm, so that it passes through the centre and cuts the two sides that meet at the next corners. Each arc cuts a side at 424.26 mm from its corner, which leaves 600 − 424.26 = 175.74 mm to the adjacent corner. The eight cuts are the octagon's corners.

The method works because half the diagonal is AF ÷ √2, and the corner legs of a regular octagon cut from a square of side AF are AF × (1 − 1 ÷ √2). In practice, the arcs need not be swung at all: the trammel is set to 424.26 mm by placing one point on a corner and the other on the centre, which transfers the length directly from the work without reading any scale.

### Method 2: measured corner legs

Mark the 600 mm square, then measure 175.74 mm from each corner along both sides and join the marks. This gives the same octagon, with each corner fixed by a measurement from a corner of the square. It is quicker than the arcs when a good steel rule is to hand, and its error at each corner is one baseline measurement.

### Method 3: circle and bisectors

Draw the two centre lines and their 45° bisectors, which together divide the circle into eight. Bisect each 45° angle again to get lines at 22.5° to the centre lines. Draw the circumscribed circle, radius 324.72 mm; the octagon's corners are where the 22.5° lines cut it. This method is useful when the centre lines already exist, as they do on the base plate from Chapter 4, and when the octagon must be rotated relative to the centre lines, but it depends on two bisections for every corner and is the least accurate of the three.

```figure
type: compare
title: Three octagon methods compared
rowhead: Method
cols: What fixes each corner | Errors that can accumulate | Best use
caption: This is an illustration for careful hand work. Methods 1 and 2 fix every corner from the square, which is itself checked by its diagonals, so no error passes from one corner to the next.
- * 1. Corner arcs on a square | one trammel length from the square's corner | none | general use; no arithmetic at the bench
- 2. Measured corner legs | one rule measurement from the corner | none | quick, with a good steel rule
- 3. Circle and bisectors | a radius and two bisections | angle errors from the bisections | octagon rotated on existing centre lines
- 4. Stepping sides with a square | the previous corner and a 45° turn | every turn error, round the polygon | short sides on small work only
```

## Why stepping round fails at the turns

There is a fourth way, described in the 1910 handbook by Osborne and still used: draw one side, then lay a steel square across its end with equal readings on blade and tongue, which sets a line at 45°, and draw the next side along it. Repeat round the octagon. The method needs no circle, no centre and no lines inside the figure, which is its attraction when a polygon must be marked on a surface with no room for construction lines. Osborne notes that the sides must be made exactly equal and the square placed exactly at each corner, and the numbers show why.

```figure
type: bars
title: Closure gap of a stepped octagon, 248.53 mm sides
unit: mm
max: 10
caption: The gap between the end of the eighth side and the start of the first. A side length error that is the same on every side closes perfectly; an error in each 45° turn does not, and it accumulates round the figure.
- Every side 0.2 mm long, turns exact | 0.00
- * Every turn 0.10° too large | 4.52
- Every side 0.2 mm long and every turn 0.15° too large | 6.78
- Every turn 0.20° too large | 9.03
```

The first bar is the hexagon's lesson again: an error that is the same on every side scales the figure up but keeps it closed. The other bars show that the turns are what matter. A turn error of a tenth of a degree, which is about as well as a square laid across a scribed line can be set, sends the eighth side's end 4.5 mm away from the first side's start. The direction errors add, 0.1° at the first corner, 0.2° by the second, and so on, and the long sides convert every degree into millimetres.

## The pentagon: an exact construction

A regular pentagon cannot be set out with a square. The classical construction, Euclid's Elements, Book IV, Proposition 11, is lengthy; the shorter one given in Osborne's handbook and many others is exact, which is worth proving because it looks like an approximation.

Draw a circle of radius R with two diameters at right angles, one vertical. Let O be the centre, A the top of the vertical diameter, and N the right-hand end of the horizontal one. Bisect ON at E. With centre E and radius EA, strike an arc to cut the horizontal diameter at S, on the far side of O. Then AS is the side of the inscribed pentagon.

```figure
type: formula
title: Why the pentagon construction is exact
formula: EA = √(R² + (R/2)²) = 1.11803R
formula: OS = EA − R/2 = 0.61803R
formula: AS = √(R² + OS²) = 1.17557R = 2R sin 36°
caption: The side of a regular pentagon inscribed in a circle of radius R is 2R sin 36° = 1.17557R. The construction reaches exactly that value, and as a bonus OS is the side of the inscribed decagon, 2R sin 18° = 0.61803R.
- R | radius of the circle
- E | midpoint of the radius ON
- S | where the arc from E through A cuts the horizontal diameter
step: For R = 300 mm: EA = 335.41 mm, OS = 185.41 mm, AS = 352.67 mm
```

The construction is exact on paper; on metal, its accuracy depends on the arcs and points like every other construction, and the side found is then stepped five times round the circle. Five steps of the same setting do not close automatically as six do on the hexagon, so the fifth step must be checked against the start, and any gap corrected by trial as in Chapter 5.

## Marking the base plate

This is an illustration. The base plate is marked on the offcut whose centre lines were constructed in Chapter 4.

1. **Square.** Mark the 600 mm square centred on the centre lines, each side 300 mm from a centre line by the method of offsets. Check both pairs of sides at 600.0 mm and both diagonals at 848.53 mm; the shop accepts a diagonal difference of up to 0.5 mm here.
2. **Corner arcs.** Set the trammel from a corner to the centre, which should read 424.26 mm, and swing an arc from each corner to cut the two adjacent sides.
3. **Join the cuts.** Scribe the eight sides along a straightedge.
4. **Check the sides.** All eight should be 248.53 mm, and each corner triangle's hypotenuse, which is a side, should match its neighbours.
5. **Check across flats and corners.** All four AF measurements should be 600.0 mm, and all four AC measurements 649.44 mm.

## Leave the line, split it or take it

A marked outline is a line about 0.15 mm wide, and the cut that follows it can leave the line on the part, split it down the middle, or take it away. On a single edge the difference is a tenth of a millimetre or so. Across flats, with two edges, it doubles, and on a polygon with eight edges cut by hand with snips or a nibbler, inconsistency from edge to edge shows as flats that disagree by 0.2 to 0.3 mm for no reason the marking can explain.

The rule should be written on the job sheet, not left to habit. The C-12 shop marks outlines to the finished size and cuts to leave the line, then dresses each edge back to the line with a file, so that the line is the last thing removed and the finished edge sits where it was marked. For parts cut on a guillotine, the line is set to the blade's cutting edge, which takes the line exactly, so the shop marks guillotined edges the same way and accepts the small difference. What matters is that every edge of one part is cut the same way.

A second habit helps on polygons: cut the edges in opposite pairs. Cutting one flat, then the opposite one, then measuring across them before moving on, finds any drift at the first pair rather than the last.

## Checking any polygon

The checks in step 4 and step 5 are general. A regular polygon is proved by three families of measurements, each with a different tool if possible:

- **Sides:** all equal. Unequal sides show a misplaced corner.
- **Across corners, or corner to centre:** all equal. A corner too near or too far from the centre shows up here even when its two sides look equal.
- **Across flats:** all equal, for an even number of sides. Unequal flats show a rotated or shifted side.

A polygon that passes all three is regular within the check's accuracy. One that passes only the sides check may still be irregular: a rhombus has four equal sides and is not a square.

## The error: a stepped octagon that did not close

This is an illustration. An apprentice, shown Osborne's method by an older tradesperson, marked a trial octagon on scrap by stepping its sides with a steel square, with each side measured carefully at 248.5 mm. Seven sides looked perfect. The eighth side ended 4 to 5 mm short of where the first began, on the wrong side of it, and no amount of re-measuring the sides found the fault.

The fault was not in the sides. Each time the square was laid across the end of the previous side, its blade sat a fraction of a degree off the scribed line, a tenth of a degree or so, which is less than the width of the line over the square's tongue. Eight small turns added up. Re-marked by corner arcs on a checked square, the octagon closed within the width of a line and passed every check. The tradesperson's method was not wrong; it was being asked to do a job, on long sides, that it could never do to a millimetre.

## How this applies to a small Australian business

Polygonal parts are a good test of a small shop's marking because their errors are visible to customers. A short written method for each shape the shop makes, naming the construction and the three checks, is the cheapest quality control available, and it lets anyone in the shop produce the same result. Methods that fix every corner from one checked reference, rather than from the previous corner, should be the default.

## Exercise: a hexagonal variant

The shop is asked for a hexagonal base plate, 600 mm across flats. Find the divider setting for the hexagon method, the across-corners dimension, and explain why a setting 0.3 mm too large produces a regular hexagon, and how large it would be across flats.

**Worked answer.** The side equals the circumscribed radius: 600 × tan 30° = **346.41 mm**, so the dividers are set to 346.41 mm. Across corners is twice that, **692.82 mm**.

With a setting of 346.71 mm, the circle drawn has a radius of 346.71 mm and the chord of each 60° step is also 346.71 mm, so the six steps close exactly and the hexagon is regular. It is simply larger: its across-flats dimension is 2 × 346.71 × cos 30° = **600.52 mm**, 0.52 mm oversize. The across-flats check finds it, and because the error is in one setting, it is corrected in one place.
