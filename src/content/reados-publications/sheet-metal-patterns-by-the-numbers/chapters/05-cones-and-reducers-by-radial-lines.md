---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: cones-and-reducers-by-radial-lines
order: 5
title: "Cones and reducers by radial lines"
description: "Develop a concentric reducer as part of a cone's sector: slant height, apex distance, sector angle and chords, what to do when the apex is out of reach, and an apex found from diameters."
draft: false
---

A concentric reducer joins a large round duct to a smaller one on the same axis. Its surface is part of a right cone, the frustum between two planes square to the axis, and every generator runs to the cone's apex. Unrolled, a whole cone is a sector of a circle centred on the apex, and a frustum is the band of that sector between two arcs. Two radii and one angle describe the whole pattern.

This chapter develops the running case's Ø250 to Ø200 reducer by radial lines, shows how to mark it out when the apex is a metre or more away, and when it is so far away that a different method is better. It ends with an apex height found from the difference of the diameters instead of the radii, a mistake that halves the cone's length and produces a reducer whose small end is 48 mm too small.

## From the elevation to the pattern

Draw the reducer's elevation: the large end, the small end, the axial length between them, and the two sloping outline generators. Extend the outlines until they meet on the axis. That point is the **apex**, and the length from it to the large end, measured along the outline, is the **slant height** of the whole cone. In the elevation the outline generators are true lengths, because they lie in the plane of the paper.

The pattern is drawn with a trammel from the apex. Swing an arc at the slant height to the large end, and another at the slant height to the small end. Step the large end's girth along the outer arc, draw radial lines from the apex to its two ends, and the band between the arcs and the lines is the reducer's net pattern.

## The numbers for the running case

The reducer's ends are Ø250 and Ø200 inside, so on the mean line of 0.8 mm sheet they are Ø250.8 and Ø200.8, with radii R₁ = 125.4 mm and R₂ = 100.4 mm. The axial length is 200 mm.

The cone narrows by 125.4 − 100.4 = 25.0 mm of radius over 200 mm of length. By similar triangles, the apex is 200 × 125.4 ÷ 25.0 = **1,003.2 mm** from the large end along the axis. The slant height to the large end is √(1,003.2² + 125.4²) = **1,011.0 mm**, and to the small end, in proportion, 1,011.0 × 100.4 ÷ 125.4 = **809.5 mm**. The difference, 201.6 mm, is the slant length of the reducer itself, √(200² + 25²).

A cone's pattern angle follows from the fact that the outer arc must equal the large end's girth: the angle is 360° × R₁ ÷ L₁ = 360 × 125.4 ÷ 1,011.0 = **44.65°**.

```figure
type: formula
title: Pattern of a concentric reducer
formula: H = h × R₁ ÷ (R₁ − R₂)        L₁ = √(H² + R₁²)        L₂ = L₁ × R₂ ÷ R₁
formula: pattern angle θ = 360° × R₁ ÷ L₁
caption: The running case's Ø250 to Ø200 reducer, 200 mm long, on mean radii in 0.8 mm sheet. The ratio R₁ ÷ L₁ is the sine of the cone's half angle, here 7.13°.
- h | Axial length of the reducer, 200 mm
- R₁, R₂ | Mean radii of the large and small ends, 125.4 and 100.4 mm
- H | Axial distance from the large end to the apex
- L₁, L₂ | Slant heights from the apex to the large and small ends
step: H = 200 × 125.4 ÷ 25.0 = 1,003.2 mm
step: L₁ = √(1,003.2² + 125.4²) = 1,011.0 mm; L₂ = 1,011.0 × 100.4 ÷ 125.4 = 809.5 mm
step: θ = 360 × 125.4 ÷ 1,011.0 = 44.65°
step: Check: outer arc = 1,011.0 × 44.65° in radians = 787.9 mm, the large girth; inner arc = 630.8 mm, the small girth
```

## Marking it out

A 1,011 mm trammel is a long tool but a manageable one, and the shop marks the reducer this way:

1. Draw a straight line at least 1,011 mm long and mark the apex at one end. This is the seam line, line 0.
2. Swing arcs of 1,011.0 mm and 809.5 mm from the apex.
3. Set off the pattern angle. With no large protractor, use the chord instead: the straight distance between the ends of the outer arc is 2 × 1,011.0 × sin(44.65° ÷ 2) = **768.1 mm**. Measure 768.1 mm from the end of line 0 on the outer arc to the other end of the outer arc, and draw line 12 from there to the apex.
4. Check the inner arc's chord between lines 0 and 12: it should be 2 × 809.5 × sin 22.33° = **615.0 mm**.
5. Divide the outer arc into 12 equal arcs of 787.9 ÷ 12 = 65.66 mm, by stepping and adjusting, and draw the radial lines. They are not needed to cut a plain reducer, but they are needed for any branch, hole or oblique cut on it, as Chapter 6 shows.
6. Add the seam allowances parallel to lines 0 and 12, and any slip joint allowances beyond the two arcs.

The chords are the key to marking without a large protractor and a check that does not depend on the pattern maker's arithmetic: if the chord between the outer ends and the chord between the inner ends are both right, the angle is right.

```figure
type: svg
title: The reducer's pattern
alt: A band shaped like part of an annulus, between two arcs centred on an apex at the top of the drawing. The outer arc has radius 1,011.0 mm and the inner 809.5 mm, and the band spans an angle of 44.65 degrees between two straight radial seam lines. Chord lengths of 768.1 and 615.0 mm are marked across the ends of each arc.
caption: This is an illustration at 0.25 scale. The apex is 1,011 mm from the outer arc; the band between the arcs is the net pattern, before seam and joint allowances.
viewbox: 0 0 640 290
body:
<path class="lf" d="M320 20L224 253.8M320 20L416 253.8"/>
<path class="bxa" d="M243.1 207.2A202.4 202.4 0 0 0 396.9 207.2L416 253.8A252.8 252.8 0 0 1 224 253.8Z"/>
<path class="dsh li" d="M224 253.8H416M243.1 207.2H396.9"/>
<circle class="fa" cx="320" cy="20" r="4"/>
<text class="txs" x="330" y="24">Apex</text>
<text class="txs" x="430" y="262">L₁ = 1,011.0</text>
<text class="txs" x="404" y="200">L₂ = 809.5</text>
<text class="txa" x="268" y="284">Chord 768.1</text>
<text class="txs" x="282" y="200">Chord 615.0</text>
<text class="txs" x="300" y="140">44.65°</text>
<text class="txs" x="120" y="250">Line 0, seam</text>
<text class="txs" x="456" y="232">Line 12</text>
```

## When the apex is out of reach

Some reducers taper so little that the apex is many metres away. This is an illustration. A reducer from Ø250 to Ø240 over the same 200 mm length has mean radii of 125.4 and 120.4 mm. Its apex is 200 × 125.4 ÷ 5.0 = 5,016 mm away, its slant height 5,017.6 mm, and its pattern angle only 9.0°. No shop keeps a five-metre trammel.

Two approaches work. The first is to mark the arcs by **offsets from their chords**. The outer arc's chord is 787.1 mm and the arc rises 15.5 mm above it at the middle. At an eighth of the way along the chord the offset is 6.8 mm, at a quarter 11.6 mm, at three eighths 14.5 mm, and at the middle 15.5 mm, symmetrical either side. Plot those offsets from a straight chord line, bend a flexible batten through them, and draw the arc. The same is done for the inner arc.

The second approach is to **triangulate** the reducer as Chapter 7 does, treating it as any other surface between two circles. Triangulation never needs the apex, and for a reducer whose taper is almost zero it is the more accurate method, because small errors in the slope do not throw a distant apex far off.

A rough rule for choosing: if the apex is within the length of the shop's longest trammel or a straight board with a nail, use radial lines; if not, use chord offsets for a plain band, or triangulation if the reducer also has a branch, an oblique cut or an offset.

## Seams and joints on a cone

A cone's seam runs along a generator, a radial line on the pattern, so the seam allowance is added parallel to line 0 and line 12, not square to the arcs. For the running case's 6 mm grooved seam, 9 mm is added outside each seam line, as on a pipe. The band's corners where the seam allowance meets the arcs are not square, and the corners must be notched so that the seam does not foul the slip joints at each end.

The reducer's two ends join the ducts on either side. Its large end slips over the Ø250 duct's crimped end, so it is a plain sleeve, and its small end is crimped to enter the Ø200 duct downstream, in the direction of airflow. The crimp and the sleeve each need a length of straight cylinder, because a cone's end cannot slip into a pipe; the shop adds a 40 mm cylindrical collar at each end, developed separately as a straight pipe, or forms the reducer longer and allows the slip joint to sit partly on the taper. The running case uses separate collars, riveted on. Collars add two seams and four rivet lines but keep each slip joint a true cylinder.

## Right pyramids by the same method

Radial line development is not limited to round cones. A **right pyramid**, with a square or rectangular base and its apex on the axis above the base's centre, has straight edges that all run to the apex, and a square hood or hopper made from one is developed the same way. The difference is that a pyramid's faces are flat triangles, so the pattern is a set of triangles about the apex instead of a smooth sector.

This is an illustration. A square extraction hood tapers from a 400 × 400 mm mouth to a 100 × 100 mm neck over a vertical height of 300 mm, both centred. Its four corner edges are the generators. In plan, each edge runs from a corner of the mouth, 200 × √2 = 282.8 mm from the centre, to a corner of the neck, 70.7 mm from the centre, a plan length of 212.1 mm. Its true length is √(212.1² + 300²) = **367.4 mm**. The true height of each face, measured up the middle of the face, is √(150² + 300²) = **335.4 mm**, since the face rises 300 mm while moving in 150 mm.

Extended, the edges meet 400 mm above the mouth, so each full edge from the apex is √(400² + 282.8²) = 489.9 mm and each neck corner 122.5 mm from the apex. The pattern is drawn by swinging arcs of 489.9 and 122.5 mm from one apex, stepping the four mouth sides of 400 mm as chords around the outer arc, and joining each step to the apex. The four trapezoids between the arcs are the hood's faces. Folded along the three inner radial lines and seamed along the fourth, they make the hood.

A pyramid's corners are folded, not rolled, so the bend allowance of each fold comes into the pattern as it does for any folded part. The Library’s [Sheet Metal Parts by the Numbers](/reados/publications/sheet-metal-parts-by-the-numbers/flat-patterns-and-bend-deductions/) covers that calculation. For thin sheet folded to a small inside radius, the correction is a fraction of a millimetre per fold.

## Area, mass and checking

The surface area of a frustum is π × (R₁ + R₂) × slant length, here π × 225.8 × 201.6 = 0.143 m², and in 0.8 mm steel it weighs about 0.9 kg before seams and collars. The BIZOMAT [Pappus revolution calculator](/tools/pappus-revolution/) gives the same area from the outline generator and its centroid, a useful independent check.

Once rolled and seamed, the reducer is checked at both ends with a girth tape: the large end's outside girth should be π × 251.6 = 790.4 mm and the small end's π × 201.6 = 633.3 mm. If both are right, the pattern was right. If the large end is right and the small end wrong, the inner radius or the angle was misplotted.

```figure
type: compare
title: The reducer's pattern dimensions and their checks
rowhead: Quantity
cols: Value | Check
caption: Every number on the pattern has an independent check that does not repeat the same arithmetic.
- Slant height to large end | 1,011.0 mm | √(H² + R₁²) with H = 1,003.2 mm
- Slant height to small end | 809.5 mm | L₁ minus the reducer's slant length of 201.6 mm
- Pattern angle | 44.65° | Outer arc equals 787.9 mm large girth
- Outer chord | 768.1 mm | 2 × L₁ × sin 22.33°
- Inner chord | 615.0 mm | 2 × L₂ × sin 22.33°
- * Formed ends, outside girth | 790.4 and 633.3 mm | Girth tape after rolling
```

## The error: an apex found from diameters

This is an illustration. Setting out a reducer of a different size from memory, a worker who usually worked from the drawing's diameters calculated the apex height using the difference in diameters instead of radii. For the running case's reducer, that gives H = 200 × 125.4 ÷ 50 = 501.6 mm instead of 1,003.2 mm: half the true value.

Everything downstream followed from it. The slant height came out as 517.0 mm, the pattern angle as 87.3°, and the outer arc, because the angle was calculated from the girth, still measured 787.9 mm. So the large end was right. But the inner arc was swung at 517.0 − 201.6 = 315.5 mm, and its length at 87.3° was only 480.8 mm, the girth of a Ø153 cone end instead of Ø200.8. The fault showed the moment the band was rolled: the large end closed perfectly on Ø250, and the small end came out about Ø153, far too small to slip into the Ø200 duct.

The arithmetic error is easy to make because the radii and diameters both appear on the drawing and differ by a factor that looks plausible. The check that catches it is independent of the formula: before cutting, measure the inner arc on the pattern, or calculate it as L₂ × θ in radians, and compare it with the small end's girth. For the correct pattern, 809.5 × 0.7793 = 630.8 mm, which is π × 200.8. A pattern whose inner arc does not equal the small girth is wrong, whatever else it gets right.

## Exercise: the Ø200 to Ø150 concentric reducer

The shop is asked for a concentric reducer from Ø200 to Ø150, 150 mm long, in 0.8 mm sheet. Find the apex distance, the two slant heights, the pattern angle and the two chords, and check the inner arc against the small girth.

**Worked answer.** The mean radii are R₁ = 100.4 mm and R₂ = 75.4 mm, a difference of 25.0 mm.

- H = 150 × 100.4 ÷ 25.0 = **602.4 mm**.
- L₁ = √(602.4² + 100.4²) = **610.7 mm**; L₂ = 610.7 × 75.4 ÷ 100.4 = **458.6 mm**. Their difference, 152.1 mm, equals √(150² + 25²).
- θ = 360 × 100.4 ÷ 610.7 = **59.18°**.
- Outer chord = 2 × 610.7 × sin 29.59° = **603.2 mm**; inner chord = 2 × 458.6 × sin 29.59° = **453.0 mm**.

Check: the inner arc is 458.6 × 59.18° × π ÷ 180 = 473.7 mm, and the small end's mean girth is π × 150.8 = 473.8 mm. They agree to within the rounding of L₂, so the pattern is right.
