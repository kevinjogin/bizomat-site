---
book: drafting-geometry-by-the-numbers
chapterSlug: tangents-fillets-and-blends
order: 4
title: "Tangents, fillets and blends"
description: "Construct fillets between lines, arcs tangent to circles and tangent lines between two circles exactly, find their tangent points and centres, and detect a blend that only looks smooth."
draft: false
---

Smooth outlines are made of straight lines and arcs that meet without a kink. Where a line meets an arc, or two arcs meet, the join is smooth only if the two share a tangent direction at the meeting point. Get it slightly wrong and the outline has a corner that is invisible on screen and obvious on the part: a ridge on a laser-cut edge, a mark where a cutter dwells, a step that a seal or a belt finds.

This chapter covers the constructions a drafter uses most: fillets between two lines, arcs tangent to two other curves, and tangent lines between two circles. Each has a simple geometric rule, a short calculation for its centre and tangent points, and a check that proves the join is truly tangent. The running case adds R10 fillets to the plate's chamfer corners, checks the R40 corner and lays out the belt on the assembly drawing.

## The two rules of tangency

Every tangent construction rests on two facts.

1. **A tangent line is perpendicular to the radius at the point of contact.** So the centre of any arc tangent to a line lies at exactly the arc's radius from that line, measured square to it.
2. **Two touching circles have their centres and the contact point in one straight line.** If they touch externally, the centres are R₁ + R₂ apart. If one touches the other internally, they are |R₁ − R₂| apart.

From these, every construction follows by locus. The centre of an arc of radius r tangent to a line lies on a line parallel to it, offset by r. The centre of an arc of radius r tangent externally to a circle of radius R lies on a circle of radius R + r about the same centre; internally, on a circle of radius R − r. Find where two such loci cross and you have the centre of an arc tangent to both. CAD programs do this when you ask for a fillet or a tangent-tangent-radius circle; knowing the loci lets you predict and check what they will produce, including when there is more than one answer.

```figure
type: compare
title: Where the centre of a radius r arc lies
cols: Centre lies on | Tangent point
caption: Each locus follows from the two rules of tangency. Two loci together fix the centre of a blend.
- Tangent to a line | A parallel line at distance r, on the arc's side | Foot of the perpendicular from the centre
- Tangent externally to a circle of radius R | A circle of radius R + r, same centre | On the line of centres, R from the circle's centre
- Tangent internally, inside a circle of radius R | A circle of radius R − r, same centre | On the line of centres extended, R from the centre
- *Fillet between two lines | The bisector of the angle between them | r ÷ tan(θ ÷ 2) from the corner along each line
```

## Fillets between two lines

A fillet of radius r in a corner whose interior angle is θ has a neat solution. Its centre lies on the bisector of the corner, at a distance r ÷ sin(θ ÷ 2) from the corner point. Its tangent points lie on the two lines, each r ÷ tan(θ ÷ 2) from the corner. The fillet's arc turns through 180° − θ.

For a square corner, θ = 90°, so the tangent points are r from the corner and the centre is r√2 from it along the 45° line. The plate's R40 corner at the top left is exactly this case: tangent points 40 mm from the original corner at (0, 140), so at E (40, 140) on the top edge and F (0, 100) on the left edge, and the centre at (40, 100). That confirms the geometry set in Chapter 1.

For the chamfer corners, the interior angle is 135°. Half of it is 67.5°, and tan 67.5° = 2.4142 and sin 67.5° = 0.9239. An R10 fillet therefore has tangent points 10 ÷ 2.4142 = **4.142 mm** from the corner and a centre 10 ÷ 0.9239 = **10.824 mm** from it. The fillet turns through only 45°. A shallow corner needs a much shorter tangent distance than a square one, which is why fillets in obtuse corners look small for their radius.

```figure
type: formula
title: Fillet in a corner with interior angle θ
formula: tangent distance = r ÷ tan(θ ÷ 2)        centre distance = r ÷ sin(θ ÷ 2)
formula: area removed from the corner = r² × [1 ÷ tan(θ ÷ 2) − (π − θ) ÷ 2]
caption: θ in degrees inside the trigonometric functions and in radians in the bracket. The R10 fillets at the plate's 135° chamfer corners.
- r | Fillet radius, 10 mm
- θ | Interior angle of the corner, 135°, or 2.3562 rad
step: Tangent distance = 10 ÷ tan 67.5° = 4.142 mm
step: Centre distance = 10 ÷ sin 67.5° = 10.824 mm
step: Area removed = 100 × (0.41421 − 0.39270) = 2.151 mm² per corner
```

## The running case: the chamfer fillets

This is an illustration. The customer asked for the chamfer's sharp corners to be radiused R10, so that the plate is safer to handle during assembly. The drafter worked out both fillets before drawing them, to know what the software should produce.

**Corner C (220, 95).** The right edge runs down from C at 270°, the chamfer up and to the left at 135°. The tangent point on the right edge is 4.142 mm below C, at (220, 90.858). The tangent point on the chamfer is 4.142 mm along it, at (220 − 4.142 × cos 45°, 95 + 4.142 × sin 45°) = (217.071, 97.929). The centre is 10 mm in from the right edge at the height of the first tangent point, (210, 90.858).

**Corner D (175, 140).** By symmetry about the chamfer's perpendicular, the tangent points are (170.858, 140) on the top edge and (177.929, 137.071) on the chamfer, and the centre is (170.858, 130).

Two checks prove each fillet is tangent. The centre must be exactly 10 mm from both lines it touches: the C centre is 220 − 210 = 10 mm from the right edge, and |210 + 90.858 − 315| ÷ √2 = 14.142 ÷ 1.4142 = 10.000 mm from the chamfer line. And each tangent point must be 10 mm from the centre: from (210, 90.858) to (217.071, 97.929) is √(7.071² + 7.071²) = 10.000 mm. The fillet command produced exactly these points, which the drafter confirmed by listing the arc.

The fillets change the plate slightly. Each removes 2.151 mm² of material, and the chamfer's straight length becomes 63.640 − 2 × 4.142 = 55.355 mm. Chapter 8 includes both in the plate's area and mass.

## Arcs tangent to two circles

A blend between two circles, the tangent-tangent-radius case, puts an arc of radius r so that it touches both. Its centre is the intersection of two locus circles, and there are usually several answers: the blend can touch each circle externally or internally, and each pair of loci crosses at two points. A CAD program asks you to pick near the tangent points so that it can choose; it chooses the solution nearest your picks, which may not be the one the design needs.

The calculation is the intersection of two circles, which reduces to a triangle with three known sides. For circles centred C₁ and C₂ with locus radii a and b, a distance d apart, the cosine rule from Chapter 3 gives the angle at C₁ between the line of centres and the blend centre. Lay off that angle either side of the line of centres and you have the two candidate centres.

The checks are the same as for a fillet: the blend centre must be at the locus distance from each circle centre, and each contact point must lie on the line of centres. If a supposed blend fails either check by more than the file's working precision, it is not tangent.

## Tangent lines between two circles

Belts, chains, slotted outlines and guards all need straight lines tangent to two circles. For two circles of radii R and r whose centres are a distance C apart, the external tangents, which do not cross between the circles, make an angle α with the line of centres given by sin α = (R − r) ÷ C. Each tangent segment has length √(C² − (R − r)²). The tangent points lie on radii perpendicular to the tangent line, which means on radii turned by α from the perpendicular to the line of centres.

```figure
type: svg
title: Belt tangents on the assembly layout
alt: A small circle of radius 40 at the top, the motor pulley at O, and a larger circle of radius 100 at the bottom, the conveyor pulley at Q, 400 mm below. Two straight belt lines run down from the small circle to the large one, spreading slightly. On the right-hand belt line the tangent points T1 at 149.547, 76 and T2 at 208.869, minus 315 are marked, with the radii to them drawn square to the belt.
caption: This is an illustration, drawn to scale. The 60 mm difference in radii tilts each belt line by 8.627° from the line of centres.
viewbox: 0 0 380 300
body:
<path class="cl" d="M160 10V290"/>
<circle class="bx" cx="160" cy="42" r="18"/>
<circle class="bx" cx="160" cy="222" r="45"/>
<path class="la draw" pathLength="1" d="M177.8 39.3L204.49 215.25"/>
<path class="ln" d="M142.2 39.3L115.51 215.25"/>
<path class="lf" d="M160 42L177.8 39.3M160 222L204.49 215.25"/>
<circle class="fa pulse" cx="177.8" cy="39.3" r="3"/>
<circle class="fa pulse" cx="204.49" cy="215.25" r="3"/>
<text class="txs" x="60" y="20">O, motor pulley r 40</text>
<text class="txs" x="150" y="288">Q, conveyor pulley r 100</text>
<text class="txa" x="186" y="60">T1 (149.547, 76)</text>
<text class="txa" x="212" y="200">T2 (208.869, −315)</text>
<text class="txs" x="20" y="140">Centres 400 apart</text>
```

## The running case: the belt on the assembly drawing

This is an illustration. The plate's assembly drawing shows the belt drive so that the guard can be designed around it. The motor pulley is 80 mm in pitch diameter, centred on the bore at O (110, 70). The conveyor pulley is 200 mm in pitch diameter, centred 400 mm directly below, at Q (110, −330), in the plate's coordinate system.

With R = 100, r = 40 and C = 400:

- sin α = (100 − 40) ÷ 400 = 0.15, so α = **8.627°**;
- each straight span is √(400² − 60²) = **395.474 mm** long.

For the right-hand span, the radii to the tangent points point at α above the +x direction, because the belt leans outwards as it goes down to the larger pulley. The tangent points are therefore:

- T1 = O + 40 × (cos 8.627°, sin 8.627°) = (110 + 39.547, 70 + 6.000) = **(149.547, 76.000)**;
- T2 = Q + 100 × (cos 8.627°, sin 8.627°) = (110 + 98.869, −330 + 15.000) = **(208.869, −315.000)**.

The check: the distance from T1 to T2 is √(59.322² + 391.000²) = 395.474 mm, matching the span length, and the vector from T1 to T2 is perpendicular to the radius direction, since 59.322 × cos 8.627° + (−391.000) × sin 8.627° = 0.000. The belt wraps 180° − 2 × 8.627° = 162.746° around the motor pulley and 197.254° around the conveyor pulley, and its pitch length is 2 × 395.474 + π × (100 + 40) + 2 × 60 × 0.15057 = **1,248.8 mm**. That last figure lets the designer choose a stock belt and then work out where the plate must sit, which Chapter 5 does.

## The error: the corner that looked smooth

This is an illustration. On an earlier version of the plate, the R40 corner at the top left had been drawn with a start, end and radius arc, typing the endpoints E (40, 140) and F (0, 100) and a radius of 41 mm instead of 40 mm. The endpoints were right, so the outline closed, and on screen the corner looked smooth.

It was not tangent. An arc of radius 41 mm through those two points has its centre on the perpendicular bisector of the 56.569 mm chord, but √(41² − 28.284²) = 29.682 mm from the chord's midpoint instead of 28.284 mm. That puts the centre at (40.988, 99.012), not (40, 100). The radius to E is therefore tilted by atan(0.988 ÷ 40.988) = **1.381°** from vertical, so the arc meets the top edge with a 1.4° kink, and the same at the left edge. Midway round, the R41 arc lies 0.397 mm inside the intended R40 arc.

The cutting contractor's first plates showed small flats at both ends of the corner, where the laser's motion controller slowed for the kink. The drafter found the cause with the centre-distance check: the arc's centre was 99.012 mm above the bottom edge and should have been 100 mm, so the arc was not 40 mm from the top edge it was meant to touch. Redrawing it as a fillet of R40 between the top and left edges, rather than as an arc between typed points, fixed it. The office's rule is to create blends with the fillet or tangent commands, which enforce tangency, and to use endpoint-and-radius arcs only where the design does not require tangency.

```figure
type: checklist
title: Proving a blend is tangent
caption: Run these on any fillet or blend that a cutting machine, a belt or a sealing face will follow.
- Centre at radius r from each line it touches | Perpendicular distance from centre to line equals r
- Centre at R ± r from each circle it touches | Distance between centres equals the sum or difference of radii
- Tangent point on the line of centres | For arc-to-arc blends, the contact point and both centres are collinear
- Radius at the tangent point square to the line | Dot product of radius and line direction is zero
- x Arc drawn by typed endpoints and radius | Closes the outline but does not guarantee tangency
- ? Several solutions | Pick points near the intended tangents and confirm the centre the command chose
```

## Exercise: a blend that cannot fit

The customer then asks for the chamfer to be replaced entirely by an R50 corner, tangent to the right edge and the top edge, like the R40 corner on the left. Where are its tangent points and centre, and what happens to the slot's upper end?

**Worked answer.** The original square corner is at (220, 140), with an interior angle of 90°. The tangent distance is 50 ÷ tan 45° = 50 mm, so the tangent points are (220, 90) on the right edge and (170, 140) on the top edge, and the centre is (170, 90).

The slot's upper end S2 is at (189.145, 81.564), with a half-width of 5.5 mm. A quick calculation measures to the arc: the distance from S2 to the arc's centre is √(19.145² + 8.436²) = 20.921 mm, so S2 is 50 − 20.921 = 29.079 mm inside the circle, and the web would be 29.079 − 5.5 = 23.58 mm.

That answer is wrong, for the reason Chapter 3 warned about. The direction from the centre (170, 90) through S2 is ATAN2(−8.436, 19.145) = −23.8°, below the horizontal. The arc only runs from 0°, at the tangent point (220, 90), to 90°, at (170, 140). S2 lies below the arc's lower tangent point, beside the straight right edge, and the part of the circle it was measured to is not part of the outline at all.

The nearest boundary is the right edge. The web is 220 − 189.145 − 5.5 = **25.36 mm**, comfortably above the 15 mm minimum. The R50 corner is acceptable for the slot. The lesson repeats the one about perpendicular feet: before measuring a web to an arc, check that the direction from the arc's centre through the feature falls between the arc's two tangent points. If it does not, measure to the neighbouring line or to the tangent point itself.
