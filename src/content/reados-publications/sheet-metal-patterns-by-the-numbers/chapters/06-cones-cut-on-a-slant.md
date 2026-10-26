---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: cones-cut-on-a-slant
order: 6
title: "Cones cut on a slant: the sander hood"
description: "Develop a conical hood whose mouth is cut on a 20° slant: true lengths of each generator by rotation and by calculation, the elliptical mouth, and lengths measured where they appear foreshortened."
draft: false
---

A cone cut square to its axis has generators all the same length. Cut it on a slant and every generator is a different length, and none of them except the two in the plane of the elevation appears at its true length in the drawing. The pattern is still a sector about the apex, but each radial line must be measured to a different point, and finding those lengths is the whole of the job.

This chapter develops the running case's sander hood: a cone from a Ø450 mouth to a Ø150 neck, with its mouth cut on a 20° slant to sit against the sloping face of the machine's guard. It finds every generator's true length two ways, by rotating it onto the outline and by calculation, and shows the elliptical shape of the mouth. It ends with lengths measured on the elevation where they are foreshortened, a mistake that put a 53 mm step into the hood.

## The hood as a cut cone

This is an illustration. The sander's dust is drawn into a conical hood that hangs over the sanding belt. Before cutting, the hood is a frustum of a right cone with mean diameters of 450 mm at the mouth and 150 mm at the neck, 300 mm apart along the axis. The mouth is then cut by a plane at 20° to the original mouth plane, passing through the centre of the original mouth, so that one side of the hood is longer than the other and the mouth sits flat against the guard.

Start with the whole cone. Its radius grows from 75 mm to 225 mm over 300 mm, 0.5 mm of radius per millimetre of length, so the apex is 150 mm above the neck and 450 mm above the original mouth plane. Every generator rises 1 mm along the axis for each 0.5 mm it moves outward, and its true length is √(1 + 0.5²) = 1.118 times its axial height above the apex. The slant height to the original mouth is 450 × 1.118 = **503.1 mm**, to the neck 150 × 1.118 = **167.7 mm**, and the pattern angle of the whole cone is 360 × 225 ÷ 503.1 = **161.0°**.

## True lengths by rotation

The traditional method uses only the elevation and plan.

1. Draw the elevation of the whole cone, apex at the top, and draw the cut line across it at 20°.
2. Draw a half plan of the mouth, divide it into six equal parts and number them 0 to 6 from the short side of the hood to the long side, then project each point up to the original mouth line in the elevation and draw a line from it to the apex. These are the generators, seen in elevation.
3. Where each generator crosses the cut line, draw a horizontal line across to the cone's outline generator.
4. The distance from the apex to each of those points on the outline is the generator's true length.

The horizontal projection works because rotating a generator about the cone's axis keeps every point on it at the same height. Rotated into the plane of the elevation, every generator lies on the outline, and the outline is a true length. The method is quick, needs no calculation and can be checked by eye: the true lengths should rise smoothly from the short side to the long side, with the two in the plane of the elevation unchanged by the projection.

## True lengths by calculation

The same lengths follow from one formula. Put the apex at the origin with the axis pointing down, and measure the angle φ around the cone from the long side of the hood. A generator at angle φ reaches a radius of 0.5 × z at axial depth z. The cut plane passes through the axis at depth 450 mm and tilts at 20°, so a point at horizontal distance x from the axis on the long side lies on it when z = 450 + x × tan 20°. On the generator at angle φ, x = 0.5 × z × cos φ, so:

z(φ) = 450 ÷ (1 − 0.5 × cos φ × tan 20°)

and the true length from the apex is 1.118 × z(φ). The length of the hood's side along that generator, from the neck to the mouth, is that true length less 167.7 mm.

```figure
type: formula
title: True length of each generator of the cut cone
formula: z(φ) = H ÷ (1 − k × cos φ × tan α)        TL(φ) = z(φ) × √(1 + k²)
caption: The sander hood: apex 450 mm above the original mouth plane, cone taper k = 0.5, cut at α = 20° through the axis at the original mouth.
- H | Axial distance from apex to the point where the cut plane crosses the axis, 450 mm
- k | Radius gained per unit of axial length, 225 ÷ 450 = 0.5
- α | Angle of the cut to the original mouth plane, 20°
- φ | Angle around the cone, measured from the long side
step: Long side, φ = 0°: z = 450 ÷ (1 − 0.5 × 0.364) = 550.1 mm; TL = 615.0 mm
step: Side, φ = 90°: z = 450 mm; TL = 503.1 mm, unchanged by the cut
step: Short side, φ = 180°: z = 450 ÷ (1 + 0.5 × 0.364) = 380.7 mm; TL = 425.7 mm
```

```figure
type: compare
title: Generator lengths of the sander hood
rowhead: Pattern line
cols: Angle from long side | Apex to mouth, mm | Neck to mouth, mm
caption: The seam is on the short side, line 0. Lines 7 to 12 repeat lines 5 to 0. The neck-to-mouth column is what the finished hood measures along each generator.
- 0, short side | 180° | 425.7 | 257.9
- 1 | 150° | 434.6 | 266.9
- 2 | 120° | 461.2 | 293.4
- 3 | 90° | 503.1 | 335.4
- 4 | 60° | 553.5 | 385.8
- 5 | 30° | 597.2 | 429.5
- * 6, long side | 0° | 615.0 | 447.3
```

## Setting out the pattern

The pattern is the sector of the whole cone, 161.0° about the apex, with each radial line cut at its own length.

1. Mark the apex and draw line 0, the seam.
2. Divide the sector into 12 equal angles of 161.0 ÷ 12 = 13.42°. As with the reducer in Chapter 5, the angle can be set by a chord: on an arc of 503.1 mm radius, each division's chord is 2 × 503.1 × sin 6.71° = 117.5 mm.
3. Swing the neck arc at 167.7 mm from the apex.
4. On each radial line, mark its apex-to-mouth length from the table.
5. Join the marks with a smooth curve.
6. Add seam allowances along lines 0 and 12, a neck collar allowance inside the neck arc, and the mouth's edge allowance outside the curve.

The curve is a wave: closest to the apex at the seam ends, furthest at line 6 in the middle. It is not a circular arc, and a pattern maker who finds it can be drawn with a trammel has made a mistake.

```figure
type: svg
title: Pattern of the sander hood
alt: A wide sector of about 161 degrees centred on an apex at the top. A small arc near the apex marks the neck at 167.7 mm. The outer edge is a wave, closest to the apex at both seam lines and furthest at the centre line, 615.0 mm from the apex. Radial lines mark the 12 divisions.
caption: This is an illustration at 0.3 scale. The neck arc is a true arc; the mouth edge is not. The wave's depth, about 189 mm along the generators, comes from the 20° cut.
viewbox: 0 0 640 250
body:
<path class="lf" d="M320 30L194 51.1M320 30L222.5 145.2M320 30L320 214.5M320 30L417.5 145.2M320 30L446 51.1"/>
<path class="bxa" d="M270.4 38.3A50.3 50.3 0 0 0 369.6 38.3L446 51.1L440.1 80.8L431.5 112L417.5 145.2L394.9 178.2L361.6 204.3L320 214.5L278.4 204.3L245 178.2L222.5 145.2L208.5 112L199.9 80.8L194 51.1Z"/>
<circle class="fa" cx="320" cy="30" r="4"/>
<text class="txs" x="330" y="20">Apex</text>
<text class="txs" x="120" y="48">Line 0, seam</text>
<text class="txs" x="456" y="48">Line 12</text>
<text class="txa" x="330" y="238">Line 6: 615.0</text>
<text class="txs" x="300" y="78">Neck 167.7</text>
<text class="txs" x="150" y="150">Line 3: 503.1</text>
```

## The shape of the mouth

The cut plane meets the cone in an ellipse. On the hood's mean surface, its long axis runs from the long side to the short side and measures **495.3 mm**; its short axis, across the hood, measures **457.6 mm**. Neither is 450 mm, the diameter of the uncut mouth: the slant cut makes the mouth both longer and wider. Its centre also sits 42.3 mm towards the long side from the cone's axis, because the cone is wider further from the apex.

That shape matters at the guard. The opening in the guard face that the hood covers must be inside this ellipse, and the flange or seal around the mouth is set out from it. A guard opening drawn as a 450 mm circle would leave a crescent of open gap on the long side of the hood, and dust with it.

The hood's depth also changes around its mouth. Measured along the axis from the neck, the hood is 400.1 mm deep on its long side and 230.7 mm on its short side. Those two numbers, with the 20° slope, are the dimensions a guard maker needs.

## The error: lengths taken from the elevation

This is an illustration. The first hood was set out by a worker who drew the elevation, drew the generators from the apex to the cut line, and measured each generator where it appeared, along its own line in the elevation, instead of projecting across to the outline. The two outline generators, lines 0 and 6, came out right, because they lie in the plane of the drawing. Every other generator came out short, because it slopes towards or away from the viewer and is foreshortened.

The error was worst at the sides. Line 3, at φ = 90°, appears in the elevation as a line straight down the axis, 450.0 mm long from the apex to the cut; its true length is 503.1 mm. The pattern was 53.1 mm short at lines 3 and 9, 43.2 mm short at lines 4 and 8, and 15.1 mm short at lines 5 and 7. When the hood was rolled, its mouth was not flat: it dipped on both sides, and when held against the guard it touched at the front and back and stood off by up to about 50 mm at the sides.

The fault was found at the trial fit and traced by measuring the formed hood along its side generator, neck to mouth, and comparing it with the table: 282.3 mm against the 335.4 mm required. The fix is the rotation step in the method above. No generator's length may be taken from a view in which it is not parallel to the drawing plane. When in doubt, calculate it.

```figure
type: bars
title: How short each generator was when measured in elevation
unit: mm
max: 60
caption: Shortfall of the apparent length in elevation against the true length, apex to mouth. The outline generators are true lengths in elevation and show no error.
- Line 0, short side | 0.0
- Line 1 | 11.0
- Line 2 | 36.0
- * Line 3, side | 53.1
- Line 4 | 43.2
- Line 5 | 15.1
- Line 6, long side | 0.0
```

## Checking the formed hood

Three measurements on the formed hood confirm the pattern without reference to the drawing's elevation.

1. **Generator lengths.** Measure from the neck to the mouth along lines 0, 3 and 6, with a flexible rule laid straight along the surface. They should be 257.9, 335.4 and 447.3 mm. Because a generator is a straight line on the cone, the rule lies flat along it, and an error of a few millimetres shows clearly.
2. **Mouth flatness.** Lay the mouth on a flat bench or against a straightedge. A correct hood touches all round. A hood made with foreshortened lengths rocks on its long and short sides, and one with a misplotted single point shows a local gap at that line.
3. **Mouth size.** Measure the mouth's long and short axes across the outside. On the outside surface of 0.8 mm sheet they are about 496.1 mm and 458.4 mm, the mean-line values plus one thickness.

If the generator lengths are right and the mouth still rocks, the hood has been rolled out of round: the cone has been formed with its seam lines meeting at a slight angle, which a few blows on a cone stake at the seam corrects. If the generator lengths are wrong, the fault is in the pattern and no forming will cure it.

## Nesting the hood

The hood's pattern is wide. Its two seam lines spread 161° apart, and the distance between their outer ends is 2 × 425.7 × sin 80.5° = 839.7 mm, while line 6 reaches 615.0 mm from the apex. With seam and edge allowances, the pattern needs a rectangle of about 860 × 640 mm, which fits across a 1,200 mm wide sheet with room to spare.

Two hoods do not nest well side by side, because the wave of one does not match the apex region of the other. The shop's choice is to cut one hood per 1,200 mm width and fill the rest of the strip with smaller pieces, such as the reducer's collars and the branch blanks. Chapter 10 returns to nesting for the whole job.

A hood this wide can also be made in two halves, each 80.5° of the sector, with seams on lines 0 and 6. Each half fits a 600 mm wide strip, and the extra seam is the price. For a single hood the one-piece pattern is quicker; for a batch of hoods on a narrower coil, two halves can be the better use of material.

## When the cut does not pass through the axis

The running case's cut passes through the axis at the original mouth. A cut placed elsewhere, or a cone cut by two planes, is handled by the same formula with the plane's position changed: H becomes the depth at which the cut plane crosses the axis, and the formula gives each generator's length to it. If the plane does not cross the axis within the cone, for example a cut that removes only part of one side, the formula still applies to the generators it meets, and the others keep their full length.

A cone cut by a plane parallel to one generator gives a parabola, and by a plane steeper than that, a hyperbola. Such cuts occur where a conical hood meets a flat wall at a steep angle. The development is identical: find each generator's true length to the cutting plane, set it out on its radial line, and join the points.

## Exercise: a shallower cut

The guard on a second machine slopes at only 10°. Using the same hood, cut through the axis at the original mouth plane, find the neck-to-mouth lengths of the hood at lines 0, 3 and 6.

**Worked answer.** With tan 10° = 0.1763:

- Line 6, long side: z = 450 ÷ (1 − 0.5 × 0.1763) = 493.5 mm, so the true length is 551.8 mm and the neck-to-mouth length is 551.8 − 167.7 = **384.1 mm**.
- Line 3, side: z = 450 mm, unchanged; neck to mouth **335.4 mm**.
- Line 0, short side: z = 450 ÷ (1 + 0.5 × 0.1763) = 413.6 mm, so the true length is 462.4 mm and the neck-to-mouth length is **294.6 mm**.

The side generators are unchanged by any cut through the axis at the original mouth, because the cut plane passes through them at the original mouth plane. The long and short sides differ by 89.5 mm, compared with 189.4 mm at 20°: the difference roughly halves with the tangent of the angle, which falls from 0.364 to 0.176.
