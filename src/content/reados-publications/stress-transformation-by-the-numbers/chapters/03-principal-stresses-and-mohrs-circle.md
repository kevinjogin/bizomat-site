---
book: stress-transformation-by-the-numbers
chapterSlug: principal-stresses-and-mohrs-circle
order: 3
title: "Principal stresses and Mohr's circle"
description: "How to find the largest and smallest normal stresses at a point, their planes and the largest shear, by formula, Mohr's circle and the principal stress tool, with the angle right."
draft: false
---

Chapter 2 showed that the normal stress at the RH-40 spindle's critical point rises from 115 MPa on the cross-section to about 161 MPa on a plane near 31°, and that the shear on that plane is zero. Searching for that peak by tabulating angles works, but it is slow and only as good as the step size. There is a direct route. The largest and smallest normal stresses at a point, and the planes they act on, follow from a short formula, and a circle drawn on graph paper shows the whole family of stresses at once.

This chapter derives both, runs the RH-40 element through the KEVOS® principal stress tool, and shows the one place where the formula most often gives a wrong answer that looks right.

## The principal stresses

The normal stress on a plane is largest or smallest where its rate of change with angle is zero, and Chapter 2 showed that this happens exactly where the shear is zero. Setting the shear equation to zero gives the angle of those planes, and putting that angle back into the normal stress equation gives the stresses.

```figure
type: formula
title: Principal stresses and maximum in-plane shear for plane stress
formula: centre c = (σx + σy) ÷ 2,  radius R = √[((σx − σy) ÷ 2)² + τxy²]
formula: σ1 = c + R,  σ2 = c − R,  τmax in plane = R
formula: θp = ½ × atan2(2τxy, σx − σy)
caption: θp is the angle from the x axis to the plane on which σ1 acts, anticlockwise positive. atan2 is the two-argument arctangent, which places the angle in the right quadrant; the next sections show why the ordinary arctangent is not enough.
- σ1, σ2 | the principal stresses: the largest and smallest normal stresses on any plane through the point
- R | the largest shear on any plane square to the surface, acting on planes at 45° to the principal planes
- c | the mean normal stress, which also acts on the planes of largest shear
```

The two principal planes are perpendicular, and the shear on both is zero. The planes of largest shear lie halfway between them, at 45°, and carry a normal stress equal to c, not zero. That last point is a common surprise: the planes of largest shear are not, in general, free of normal stress.

For the RH-40 critical point in pullback, σx = 115.48 MPa, σy = 31.50 MPa and τxy = 76.91 MPa. The centre is c = 73.49 MPa and the radius R = √(41.99² + 76.91²) = 87.63 MPa, so σ1 = 161.12 MPa and σ2 = −14.14 MPa. The angle is ½ × atan2(153.82, 83.98) = 30.68°. The table in Chapter 2 placed the peak between 30° and 31°, at about 161 MPa; the formula pins it down. This is an illustration.

## Mohr's circle

Every pair (σθ, τθ) from the transformation equations lies on one circle, with its centre at (c, 0) on the normal stress axis and radius R. That circle, published by Otto Mohr in 1882, is the whole stress state at a point drawn as one figure. It is still the fastest way to see a stress state, to spot a sign error, and to explain one to someone else.

### Drawing it

Use horizontal axis σ and vertical axis τ, at the same scale.

1. Plot point X at (σx, τxy), representing the x face.
2. Plot point Y at (σy, −τxy), representing the y face.
3. The line XY crosses the σ axis at the centre c. Draw the circle through X and Y.
4. Read σ1 and σ2 where the circle cuts the σ axis, and the largest shear R at the top and bottom.

With the shear plotted upwards and the element turned anticlockwise by θ, the point representing the turned face moves clockwise round the circle by 2θ. The angles on the circle are double the angles on the element, just as the 2θ in the equations suggests.

```figure
type: svg
title: Mohr's circle for the RH-40 critical point
alt: A horizontal sigma axis and a vertical tau axis crossing at zero. A circle centred on the sigma axis at 73.49 megapascals with radius 87.63 megapascals. Point X at the upper right is at sigma 115.48 and tau 76.91; point Y at the lower left is at sigma 31.5 and tau minus 76.91. A diameter joins them through the centre. The circle cuts the sigma axis at sigma 2, minus 14.14, on the left and sigma 1, 161.12, on the right. An arc from X down to sigma 1 is labelled 2 theta p, 61.4 degrees.
caption: This is an illustration. Turning the element anticlockwise by 30.68° moves the x face's point clockwise by 61.37° on the circle, from X to σ1. The top and bottom of the circle, at σ = 73.49 MPa and τ = ±87.63 MPa, are the planes of largest in-plane shear.
viewbox: 0 0 640 400
body:
<path class="ln" d="M90 200H580M160 20V380"/>
<circle class="bx" cx="307" cy="200" r="175"/>
<path class="la" d="M391 46L223 354"/>
<circle class="fa" cx="391" cy="46" r="6"/>
<circle class="fa" cx="223" cy="354" r="6"/>
<circle class="fa" cx="482" cy="200" r="6"/>
<circle class="fa" cx="132" cy="200" r="6"/>
<circle class="fa" cx="307" cy="200" r="4"/>
<path class="ln dsh" d="M307 200V25"/>
<text class="txb" x="400" y="40">X (115.48, 76.91)</text>
<text class="txb" x="232" y="376">Y (31.50, −76.91)</text>
<text class="txb" x="490" y="190">σ1 = 161.12</text>
<text class="txb" x="20" y="190">σ2 = −14.14</text>
<text class="tx txs" x="314" y="220">c = 73.49</text>
<text class="tx txs" x="314" y="40">R = 87.63</text>
<text class="tx txs" x="430" y="120">2θp = 61.4°</text>
<text class="tx txs" x="585" y="205">σ</text>
<text class="tx txs" x="166" y="30">τ</text>
```

Several facts can be read straight off a sketch, without numbers:

- Pure tension, σx = 100 MPa alone, gives a circle from 0 to 100 through the origin. The largest shear is 50 MPa, on planes at 45°.
- Pure shear, τxy alone, gives a circle centred on the origin. The principal stresses are +τ and −τ, at 45° to the shear planes. That is why a brittle shaft breaks in torsion along a 45° helix: the 45° plane carries a tension equal to the shear.
- Equal biaxial tension, σx = σy with no shear, shrinks the circle to a point. Every plane carries the same normal stress and no shear.

### Principal stresses from the invariants

Chapter 2 found two quantities that stay the same however the element turns: the sum σx + σy and the combination σx σy − τxy². The principal stresses are simply the two numbers whose sum and product match them. They are the roots of the quadratic

σ² − (σx + σy) σ + (σx σy − τxy²) = 0.

For the RH-40 point that is σ² − 146.98 σ − 2,277.5 = 0, with roots 161.12 MPa and −14.14 MPa, the same as the formula. The quadratic form is worth knowing for two reasons. It shows that the principal stresses depend only on the invariants, and so cannot depend on the axes chosen. And it is the two-dimensional version of the cubic equation that Chapter 6 uses for three-dimensional stress, where no circle construction is as convenient.

### Reading a given plane off the circle

The circle also answers Chapter 2's question, the stresses on a plane at a chosen angle, without the transformation equations. To find the stresses on the plane at 45° for the RH-40 point, start at X and move clockwise round the circle by 2 × 45° = 90°. X sits 61.37° above the σ axis as seen from the centre, so the new point sits 28.63° below it: σ = 73.49 + 87.63 × cos 28.63° = 150.41 MPa and τ = −87.63 × sin 28.63° = −41.99 MPa. Chapter 2's table gave 150.40 MPa and −41.99 MPa; the 0.01 MPa difference is rounding in the angle. With a compass and a protractor on squared paper, the same reading takes a minute and is good to a few per cent, which is often enough to check a computer.

## The principal stress tool

The [principal stress tool](/tools/principal-stress/) takes σx, σy and τxy, the yield strength and a required safety factor, and returns the principal stresses, the principal angle, the maximum shear, the von Mises equivalent stress and the safety factor by von Mises, with a second check by Tresca. Its angle uses the two-argument arctangent, so it always points to σ1.

```figure
type: steps
title: The RH-40 critical point in the principal stress tool
caption: This is an illustration. σx = 115.48 MPa, σy = 31.50 MPa, τxy = 76.91 MPa, Sy = 650 MPa, required factor 2.0.
- Principal stresses | σ1 = 161.12 MPa, σ2 = −14.14 MPa
- Principal angle | 30.68° from the x axis to σ1
- Maximum shear | 87.63 MPa
- * von Mises stress | 168.63 MPa; safety factor 3.85: ADEQUATE
- Tresca check | equivalent 175.25 MPa; factor 3.71, also above 2.0
```

### Maximum shear in plane and out of it

The tool's maximum shear is half the Tresca equivalent stress, which it takes as the largest of |σ1 − σ2|, |σ1| and |σ2|. The second and third terms matter because a plane stress state has a third principal stress, zero, perpendicular to the surface. When σ1 and σ2 have opposite signs, as at the RH-40 point, the largest shear is (σ1 − σ2) ÷ 2 = 87.63 MPa, the radius of the in-plane circle. When both have the same sign, the largest shear acts on a plane tilted out of the surface and equals half the larger principal stress, which is bigger than the in-plane radius. Chapter 6 draws the three circles that show this; for now, it is enough that the tool handles it.

## The yield check in one line

For a ductile metal, the principal stresses feed the yield criteria. The von Mises equivalent stress in plane stress is √(σ1² − σ1σ2 + σ2²) = √(161.12² + 161.12 × 14.14 + 14.14²) = 168.63 MPa, and the safety factor against the spindle steel's 650 MPa yield strength is 3.85. The Tresca factor is 650 ÷ 175.25 = 3.71. Both criteria, and why they differ, are covered in [Yield and Plastic Flow by the Numbers](/reados/publications/yield-and-plastic-flow-by-the-numbers/yield-under-combined-stress/). Here the point is that both depend only on the principal stresses, so they are the same whichever axes the stresses were first written in.

A factor of 3.85 against yield does not mean the spindle is oversized. Its real limit is fatigue at the gear seat's shoulder, where the stress concentration and the rotating bending reduce the allowable stress several times over, and stiffness for the gear mesh. The static check is the first gate, not the last.

## A family of circles for a turning spindle

A single Mohr's circle describes one point at one moment. On the RH-40 spindle the bending stress at a point changes as it turns, so the circle changes too. The pressure, pullback and torque stresses are steady; only σx moves, between 20.81 MPa and 115.48 MPa in pullback. Because σy and τxy stay fixed, every circle in the family passes through points with the same shear, and only its centre and radius change.

```figure
type: compare
title: Mohr's circle at five positions round the spindle, pullback
cols: σx, MPa | Centre c, MPa | Radius R, MPa | σ1, MPa | σ2, MPa
rowhead: Position of the point
- * Bending tension side | 115.48 | 73.49 | 87.63 | 161.12 | −14.14
- 30° past the neutral axis, tension | 91.81 | 61.66 | 82.61 | 144.27 | −20.95
- Neutral axis | 68.15 | 49.83 | 79.06 | 128.89 | −29.24
- 30° past the neutral axis, compression | 44.49 | 37.99 | 77.18 | 115.18 | −39.19
- Bending compression side | 20.82 | 26.16 | 77.10 | 103.26 | −50.94
caption: This is an illustration. σy = 31.50 MPa and τxy = 76.91 MPa throughout. σx at each position is 68.15 MPa plus 47.33 MPa times the sine of the angle from the neutral axis.
```

Over one revolution, σ1 at a point on the gear seat swings between 103.26 MPa and 161.12 MPa, while σ2 swings between −50.94 MPa and −14.14 MPa. The largest shear changes much less, from 77.10 MPa to 87.63 MPa, because the steady torque dominates it. A fatigue check needs both the steady and the alternating parts of these stresses, and the equivalent-stress methods for shafts in [Metal Fatigue by the Numbers](/reados/publications/metal-fatigue-by-the-numbers/shafts/) are built for exactly this combination of steady torque and rotating bending.

The family also shows why a single snapshot can mislead. A finite element model of the spindle with the gear load in one position gives one circle for each point. Unless the analyst knows the spindle turns, the model reports a stress state that each point only passes through.

## The mistake: the wrong principal direction

The RH-40 designer also needed the principal direction for the drilling case on the bending compression side, to orient a strain gauge for the prototype test. The element there is σx = −49.05 MPa, σy = 31.50 MPa and τxy = 76.91 MPa. A calculator gave

θp = ½ × arctan(2 × 76.91 ÷ (−49.05 − 31.50)) = ½ × arctan(−1.910) = −31.18°.

The designer drew the gauge's axis at −31.18° on the test drawing, labelled "direction of largest tension".

The ordinary arctangent returns angles between −90° and +90° only, so ½ arctan returns an angle between −45° and +45°. It finds a principal plane, but it does not say which. When σx is less than σy, it finds the plane of σ2. The two-argument form, ½ × atan2(153.82, −80.55), gives 58.82°, and that is where σ1 = 78.04 MPa acts. At −31.18° the normal stress is σ2 = −95.59 MPa: the largest compression, not the largest tension.

The error was caught by the check every principal angle should get: put it back into the transformation equation. At θ = −31.18°, σθ came out at −95.59 MPa, negative, which could not be the largest tension. The gauge was redrawn at 58.82°. The same result follows from Mohr's circle: with σx to the left of the centre, point X lies on the left half of the circle, and the arc to σ1 is more than 90°.

```figure
type: decision
title: Which principal plane did the formula find?
question: Using θ = ½ arctan(2τxy ÷ (σx − σy)) with an ordinary arctangent?
- σx > σy | the angle points to σ1
- σx < σy | the angle points to σ2; add 90° to get σ1
- σx = σy | the formula divides by zero; the principal planes are at 45° and 135°, and the sign of τxy decides which carries σ1
- * Any case, any method | substitute the angle back into σθ and confirm the larger value
caption: The two-argument arctangent avoids the question. It is available as ATAN2 in spreadsheets, though some spreadsheets take its arguments in the order (x, y) rather than (y, x).
```

### Sign conventions for Mohr's circle

Textbooks differ on whether shear is plotted upwards or downwards, and on which face's point goes where. Each convention is consistent on its own, and each gives the same principal stresses. They differ in the direction of rotation on the circle. Mixing two conventions, for example taking the plotting rule from one book and the rotation rule from another, gives the right principal stresses at the wrong angle, the same symptom as the arctangent error. Pick one convention, write it on the sketch, and check the angle by substitution.

Software has conventions too. Some programs report principal stresses sorted by value, some by magnitude, and some report the angle of the first principal direction from a local axis that the user may not have set deliberately. Before relying on a program's principal angle, run one known case through it: pure shear of 100 MPa should give +100 MPa and −100 MPa at 45° and 135°, and the program should agree about which is which.

## What to report

A principal stress result is useful to others only if it carries its context. For each critical point on the RH-40 spindle, the design record lists:

```figure
type: checklist
title: A principal stress record for one point
caption: The RH-40 record for the gear seat in pullback. This is an illustration.
- x Location and load case: gear seat, outer surface, bending tension side, pullback
- x Input components with their axes: σx along the spindle, σy around it
- x σ1, σ2 and the angle of σ1 from x, with the sign convention stated
- x Maximum shear, including the out-of-plane case
- x Equivalent stress, the criterion used and the factor against the stated yield strength
- ? Stress concentration factor at the shoulder, for the fatigue check that follows
```

## Exercise: the drilling case in full

For the drilling case on the bending compression side, σx = −49.05 MPa, σy = 31.50 MPa and τxy = 76.91 MPa, find the centre and radius of Mohr's circle, the principal stresses and the angle of σ1, the von Mises equivalent stress and the safety factor against 650 MPa. Is this point more or less critical than the pullback point?

**Worked answer.** The centre is c = (−49.05 + 31.50) ÷ 2 = −8.77 MPa. The half-difference is −40.28 MPa, so R = √(40.28² + 76.91²) = 86.82 MPa. The principal stresses are σ1 = −8.77 + 86.82 = 78.04 MPa and σ2 = −8.77 − 86.82 = −95.59 MPa. The angle is ½ × atan2(153.82, −80.55) = 58.82°.

The von Mises stress is √(78.04² + 78.04 × 95.59 + 95.59²) = 150.63 MPa, and the safety factor 650 ÷ 150.63 = 4.32. The point is less critical than the pullback point, where the factor was 3.85, but its largest shear, 86.82 MPa, is almost as large, because its normal stresses have opposite signs. This is an illustration.
