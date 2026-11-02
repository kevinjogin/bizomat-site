---
book: marking-out-by-the-numbers
chapterSlug: large-arcs-ellipses-and-curves-by-points
order: 8
title: "Large arcs, ellipses and curves by points"
description: "Find a radius from chord and rise, mark arcs whose centre is off the sheet by ordinates, find an arc's centre, and draw true ellipses with string, trammel and offsets."
draft: false
---

Dividers draw arcs up to a few hundred millimetres in radius and a trammel up to a few metres, but both need the centre to be on something solid. On sheet metal it often is not. The arc that forms the end of a curved hood, the edge of a segment-shaped cover or a gentle sweep on a fascia may have its centre half a metre beyond the edge of the part. And many curves are not arcs at all: an ellipse, the hole a round pipe makes where it passes through a sloping roof, has no single centre to swing from.

This chapter deals with both. It finds the radius of an arc from its chord and rise, tests how sensitive that radius is to the measurements, marks the C-12 hood's end cheeks by ordinates without ever finding the centre, and finds the centre of an existing arc when it is needed. It then turns to ellipses, the string and trammel methods and offsets, and marks the C-12 apron's hole for the collar. It ends with that hole marked as a circle, a mistake made often enough to be worth showing in numbers.

## Radius from chord and rise

An arc is often specified, or measured on existing work, by its chord c, the straight distance between its ends, and its rise h, the greatest distance from the chord to the arc, at the middle. The radius follows from the right triangle formed by the radius, half the chord and the radius less the rise.

```figure
type: formula
title: Radius of an arc from its chord and rise
formula: R = ((c ÷ 2)² + h²) ÷ (2h)
caption: This is an illustration for the C-12 hood: chord 700 mm and rise 120 mm. The same rule appears in Osborne's 1910 handbook in words: square half the chord, add the square of the rise, and divide by twice the rise.
- R | radius, mm
- c | chord, mm
- h | rise at the middle of the chord, mm
step: R = (350² + 120²) ÷ 240 = (122,500 + 14,400) ÷ 240 = 570.42 mm
step: Centre lies R − h = 450.42 mm below the chord
step: Angle subtended = 2 × arcsin(350 ÷ 570.42) = 75.70°; arc length = 570.42 × 75.70° in radians = 753.63 mm
```

The arc length matters as much as the radius: it is the length of the hood's rolled top panel, which is marked flat and rolled to fit the end cheeks. The KEVOS® [Circular Segment and Arc](/tools/circular-segment/) tool solves the same relationships and is a quick independent check of a hand calculation.

### How sensitive the radius is

When the chord and rise are measured on existing work, small errors in them change the radius, and the rise is the sensitive one. Differentiating the formula gives the change in R for a change in h as 1/2 − c² ÷ (8h²). For the hood, that is −3.75: every millimetre of error in the rise moves the radius almost 4 mm the other way. An error in the chord moves the radius by c ÷ (4h) = 1.46 mm per millimetre.

```figure
type: compare
title: Radius of the hood arc for small errors in chord and rise
rowhead: Measurements
cols: Radius, mm | Change from 570.42 mm
caption: The rise is about two and a half times as sensitive as the chord for this arc. For flatter arcs, with a smaller rise relative to the chord, the sensitivity to the rise grows rapidly.
- Chord 700, rise 120 | 570.42 | none
- Chord 700, rise 119 | 574.21 | +3.79
- Chord 700, rise 121 | 566.70 | −3.72
- Chord 698, rise 120 | 567.50 | −2.92
- Chord 702, rise 120 | 573.34 | +2.92
```

Two practical rules follow. When measuring an existing arc to copy it, measure the rise with a rule stood on its edge, square to a straightedge laid across the chord, and take it at the true middle, found by bisecting the chord. And measure the longest chord the arc allows, because a longer chord gives a larger rise, which reduces the sensitivity.

## Marking an arc by ordinates

When the centre is off the part, the arc can be marked by measuring offsets, called ordinates, from the chord at regular stations and bending a thin, even batten through the points. The ordinate at a distance x from the middle of the chord is:

y = √(R² − x²) − (R − h)

```figure
type: compare
title: Ordinates for the hood cheek, chord 700 mm and rise 120 mm
rowhead: Distance from the middle of the chord
cols: Ordinate above the chord, mm
caption: R = 570.42 mm. The cheek is symmetrical, so each value is used on both sides of the middle. Stations 50 mm apart are close enough for a batten to follow the arc smoothly.
- 0 mm (middle) | 120.00
- 50 mm | 117.80
- 100 mm | 111.17
- 150 mm | 99.92
- 200 mm | 83.79
- 250 mm | 62.30
- 300 mm | 34.74
- 350 mm (end) | 0.00
```

Joined by straight lines, points 50 mm apart on this arc would leave flats that depart from the true curve by up to 0.55 mm at their middles, which is the rise of a 50 mm chord on a 570 mm radius. A batten bent through the points follows a smooth curve and removes nearly all of that. The batten should be a thin steel rule or a strip of sheet, held to the points by small weights or by fingers spaced along it, and the line scribed along it in one pass. A batten that is stiffer at one end than the other bends unevenly, so a uniform strip is better than a tapered one.

This is an illustration. The two C-12 hood cheeks are marked side by side on one strip of sheet, each in the same way:

1. Scribe the chord line, 700 mm long, as a datum along a checked straightedge, and mark its middle by measuring 350 mm from each end; the two marks should coincide.
2. Erect a perpendicular at the middle, as in Chapter 4, and mark the rise of 120 mm on it.
3. Mark stations at 50 mm intervals each way from the middle along the chord, measured from the middle, not stepped from one station to the next.
4. At each station, erect a short perpendicular with a checked square and mark the ordinate from the table with a steel rule stood on its edge.
5. Bend the batten through all fifteen points, check by eye along its length that no point stands proud, and scribe the arc.
6. Check the finished arc at two stations not used to mark it, at 125 and 275 mm from the middle, where the ordinates are 106.14 and 49.33 mm.

The check in step 6 uses points the batten was not set to, so it tests the curve between stations rather than repeating the stations themselves.

Each ordinate is a single baseline measurement from the chord, which is itself a datum line. The error at each point is one measurement's worth, about ±0.2 mm with a steel rule on its edge, and the batten averages small differences between neighbouring points.

## Finding the centre of an arc

Sometimes the centre is needed: to check an arc that already exists, to mark a concentric line at a fixed distance, or to set a trammel. The construction is from Euclid's Elements, Book III, Proposition 1, and it appears in every tin-shop handbook including Osborne's: draw two chords on the arc, bisect each, and extend the bisectors until they meet. The crossing is the centre.

Its accuracy depends on how squarely the bisectors cross, by the rule of Chapter 4. Two short chords close together give bisectors that are nearly parallel and cross at a shallow angle, so the centre is poorly fixed along the line between them. Two chords that each cover roughly half of the arc, one on each side of the middle, give bisectors that cross at an angle close to half the arc's angle, which for the hood's 75.7° arc is about 38°. A third chord across the whole arc gives a third bisector that should pass through the same crossing, which is the check.

When the centre lies off the sheet, the bisectors can be extended onto a scrap board or strip clamped level with the sheet, and a trammel point set into it. That is often less accurate than marking by ordinates, because the long extensions magnify any error in the bisectors' direction.

## Arcs through three points without the centre

Osborne also gives a method of drawing an arc through three given points without finding its centre, by intersecting two families of lines drawn from the end points. It is an elegant construction from the days when a large compass was rarely to hand. On sheet metal today, the same three points are better used to calculate the chord, rise and radius, after which the arc is marked by ordinates. The calculation is quick with the formula above, and it gives numbers that can be checked.

## Ellipses: the string method

Every point on an ellipse lies the same total distance from two fixed points, the foci, and that total equals the major axis. That definition gives the most accurate bench method, which Osborne describes with three nails and a string.

1. Draw the major axis, length 2a, and the minor axis, length 2b, at right angles through the centre.
2. Find the foci on the major axis: from an end of the minor axis, swing an arc of radius a to cut the major axis at two points. These are the foci, each c = √(a² − b²) from the centre.
3. Drive pins at the two foci and a third at the end of the minor axis, tie a loop of fine, non-stretch line tightly round all three, then remove the third pin.
4. Hold a scriber upright in the loop, keep the line taut and trace round the foci.

The loop is 2a + 2c long. The method is exact if the line does not stretch, the scriber is kept upright and the line does not ride up or down the scriber. Stretch is the main error: a loop that stretches by 0.5 mm in use increases the semi-major axis by 0.25 mm. Fine braided fishing line or thin wire is better than cotton string.

Two other exact methods suit sheet metal. A **trammel** for ellipses carries the scriber point and two guide points along a strip, spaced a and b from the scriber; with the guide points kept on the two axes, the scriber traces the ellipse. And **ordinates**, y = b√(1 − x²/a²), give points that can be joined with a batten, as for the arc. The four-centre approximation, made of four circular arcs, is not an ellipse; [Constructing a four-centre oval](/reados/publications/oval-sheet-metal-work-by-the-numbers/constructing-a-four-centre-oval/) covers it and its errors.

## The C-12 apron's hole

This is an illustration. The apron lies on the roof at 10°, and the collar passes through it vertically. A vertical cylinder cut by a plane inclined at 10° leaves an ellipse whose minor axis, across the slope, equals the cylinder's diameter, and whose major axis, along the slope, is the diameter divided by cos 10°.

The collar's outside diameter is 300 + 2 × 1.2 = 302.4 mm, and the shop allows 1.0 mm of clearance all round for the sealant, so the hole is based on 304.4 mm:

- minor axis 2b = **304.40 mm**, across the slope;
- major axis 2a = 304.4 ÷ cos 10° = **309.10 mm**, along the slope;
- foci c = √(154.55² − 152.20²) = **26.84 mm** from the centre;
- string loop 2a + 2c = **362.77 mm**.

```figure
type: compare
title: Ordinates for a quarter of the apron hole
rowhead: Distance along the major axis from the centre
cols: Half-width across the slope, mm
caption: Semi-axes a = 154.55 mm and b = 152.20 mm. The ordinates are used to check the string-drawn hole at a few stations, with a steel rule from the major axis.
- 0 mm | 152.20
- 40 mm | 147.01
- 80 mm | 130.22
- 120 mm | 95.91
- 140 mm | 64.47
- 154.55 mm (end) | 0.00
```

The fabricator marks the hole with the string method, which is quick on a hole this size, and checks it with the ordinates at 40, 80 and 120 mm on all four quarters. Any station more than 0.3 mm from its ordinate means the line stretched or the scriber tilted, and the hole is redrawn.

## The error: the hole marked as a circle

This is an illustration. On an earlier cowl, the apron's hole was marked as a circle of the collar's diameter plus clearance, Ø304.4 mm, on the reasoning that the collar is round. The difference between the axes, 309.10 − 304.40 = 4.70 mm, looked too small to matter.

It mattered. Laid on the 10° roof, the circular hole was 4.70 mm too short along the slope, 2.35 mm at each end. The collar could not pass through it vertically; it jammed against the uphill and downhill edges of the hole and could only be forced through tilted. The hole was opened with a file along the slope, which left uneven clearance and a ragged edge for the sealant to bridge.

The check that would have caught it is the one in the method above: a ruler across the hole along the slope should read 309.1 mm. The shop now marks every hole in a sloping plate as an ellipse, with both axes written on the job sheet, even when the angle is small. At 10° the stretch along the slope is 1.5%; at 30° it is 15.5%, and the circle would not even start.

## How this applies to a small Australian business

Curves are where hand marking most often falls back on eye and guesswork, because the centre is off the part or the shape is not a circle. A spreadsheet that gives radius, arc length and ordinates from a chord and a rise, and the axes, foci and ordinates of an ellipse from a diameter and a slope, takes an hour to build and makes every such job a matter of measuring points from a line. It also gives the customer and the shop a record of exactly what was marked.

## Exercise: a flatter hood

A customer asks for a lower hood: chord 700 mm, rise 80 mm. Find the radius, the arc length of the rolled top panel, the ordinate at 200 mm from the middle, and how much a 1 mm error in measuring the rise on a sample would change the radius.

**Worked answer.** R = (350² + 80²) ÷ 160 = (122,500 + 6,400) ÷ 160 = **805.63 mm**. The angle subtended is 2 × arcsin(350 ÷ 805.63) = 51.50°, or 0.8988 radians, so the arc length is 805.63 × 0.8988 = **724.13 mm**.

The ordinate at 200 mm is √(805.63² − 200²) − (805.63 − 80) = 780.40 − 725.63 = **54.78 mm**.

The sensitivity is 1/2 − c² ÷ (8h²) = 0.5 − 490,000 ÷ 51,200 = −9.07, so a 1 mm error in the rise changes the radius by about **9 mm** the other way, more than twice the effect on the 120 mm rise. Flatter arcs need more careful measurement of the rise, or should be specified by radius rather than by chord and rise.
