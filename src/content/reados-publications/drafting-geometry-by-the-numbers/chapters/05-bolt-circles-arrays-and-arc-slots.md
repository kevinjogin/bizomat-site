---
book: drafting-geometry-by-the-numbers
chapterSlug: bolt-circles-arrays-and-arc-slots
order: 5
title: "Bolt circles, polar arrays and arc slots"
description: "Lay out holes on a pitch circle, set polar arrays without the fill-angle error, draw straight and arc slots exactly, and calculate the adjustment an arc slot really gives."
draft: false
---

Patterns of holes on a circle are among the most common features on a mechanical part: flange bolts, motor mounts, cover screws, indexing holes. They are also among the easiest to get subtly wrong, because they are usually drawn with a polar array whose settings are easy to misread, and because the numbers that check them, the chord between holes and the diagonal across the pattern, are rarely calculated.

Slots are the other half of this chapter. A straight slot is two semicircles joined by two lines. An arc slot is two concentric arcs joined by two semicircles, and its purpose is usually adjustment: it lets a part turn about a centre through a set angle. The drafter needs to know not only how to draw it but what it does, because the slot's length decides how much adjustment the machine gets. The running case completes the motor holes, draws the arc slot and works out how far it moves the motor.

## Holes on a pitch circle

A hole on a pitch circle of diameter D, centred at (x₀, y₀), at angle θ has coordinates:

x = x₀ + (D ÷ 2) × cos θ        y = y₀ + (D ÷ 2) × sin θ

For n equally spaced holes, the angle between neighbours is 360° ÷ n. The straight-line distance between neighbouring holes, the chord, is D × sin(180° ÷ n). For an even number of holes, opposite holes are exactly D apart.

The running case's motor holes sit on a 100 mm pitch circle about O (110, 70) at 45°, 135°, 225° and 315°. Their coordinates are (145.355, 105.355), (74.645, 105.355), (74.645, 34.645) and (145.355, 34.645). The chord between neighbours is 100 × sin 45° = **70.711 mm**, which is also the side of the square the four holes form, and the diagonal is **100.000 mm**.

Those two numbers are the quickest check on any four-hole pattern. For other patterns, the KEVOS® [bolt circle calculator](/tools/bolt-circle/) lists every hole coordinate from the pitch circle, hole count and start angle. If the measured neighbour spacing is 70.711 mm and both diagonals are 100.000 mm, the holes are on the pitch circle and equally spaced. If one diagonal is 100.000 mm and the other is not, one pair of holes is rotated. If both are equal but not 100 mm, the pitch circle is the wrong size.

```figure
type: compare
title: Checking numbers for common bolt patterns on a 100 mm pitch circle
cols: Angle between holes | Neighbour chord | Opposite or widest span
caption: Chord = D × sin(180° ÷ n). For odd n there is no opposite hole; the widest span is the chord across (n − 1) ÷ 2 spaces.
- 3 holes | 120° | 86.603 mm | 86.603 mm
- *4 holes | 90° | 70.711 mm | 100.000 mm
- 5 holes | 72° | 58.779 mm | 95.106 mm
- 6 holes | 60° | 50.000 mm | 100.000 mm
- 8 holes | 45° | 38.268 mm | 100.000 mm
```

## Polar arrays and the fill-angle trap

A polar array copies an object a set number of times about a centre. Most programs describe the array with three related settings, of which you supply two:

- the **number of items**, counting the original;
- the **fill angle**, the angle from the first item to the last;
- the **angle between items**.

For a full circle, the fill angle is 360° and the angle between items is 360° ÷ n, because the last item is one space short of the first. For a partial arc the arithmetic changes: n items across a fill angle F have n − 1 spaces, so the angle between them is F ÷ (n − 1). Confusing the two is the commonest array mistake. Four items across 90° are 30° apart, not 22.5°.

Two more settings matter. **Rotate items** decides whether each copy turns as it moves round, which matters for anything that is not a circle, such as a slot or a hexagon. **Direction** decides whether positive angles run anticlockwise, the CAD convention, or clockwise. Check both before accepting the array, because a slot arrayed without rotation keeps its original orientation at every position.

```figure
type: formula
title: Spacing for a polar array
formula: full circle: spacing = 360° ÷ n        partial arc: spacing = F ÷ (n − 1)
caption: n counts the original item. A full circle has n spaces because the last item is one space from the first; a partial arc has n − 1.
- n | Number of items, including the original
- F | Fill angle from the first item to the last, degrees
step: Motor holes, full circle: 360° ÷ 4 = 90°, starting at 45°
step: Index marks along the slot, 5° to 20°: F = 15°
step: Seven marks: 15° ÷ (7 − 1) = 2.5° apart, 7.854 mm apart along the 180 mm radius
```

## Straight slots

A straight slot of width w and centre-to-centre length L is two semicircles of radius w ÷ 2 joined by two straight lines w apart. Its overall length is L + w. Draw it from its centreline: place the two end centres exactly, draw the two end circles, then join them with tangent lines, or offset the centreline by w ÷ 2 each side and cap the ends with semicircles. A polyline with arc segments, or a dedicated slot command, produces a single closed boundary, which is what a cutting file needs.

Dimension and draw the slot from the centres, because the centres are where the bolt sits at each end of its travel. The overall length is a reference value. A drafter who draws the slot from its overall length and width has to derive the centres anyway, and invites the error of making the centre-to-centre length equal the overall length.

## Arc slots

An arc slot is centred on a pivot. Its centreline is an arc of radius R from angle θ₁ to θ₂, and its boundary is:

- an outer arc of radius R + w ÷ 2;
- an inner arc of radius R − w ÷ 2;
- two semicircular ends of radius w ÷ 2, centred on the ends of the centreline.

The centreline length is R × (θ₂ − θ₁) in radians. The outer and inner arcs are longer and shorter in proportion to their radii.

For the plate, R = 180 mm, w = 11 mm, θ₁ = 5° and θ₂ = 20°. The swept angle is 15°, or 0.2618 rad. The centreline is 180 × 0.2618 = **47.124 mm** long. The outer arc, at R185.5, is 48.564 mm; the inner arc, at R174.5, is 45.684 mm. The end centres are S1 (199.315, 35.688) and S2 (189.145, 81.564), and the straight chord between them is 2 × 180 × sin 7.5° = 46.989 mm, a little shorter than the arc.

```figure
type: svg
title: The arc slot and the motor's movement
alt: A pivot point P at the lower left. A curved slot near the right, centred on P at radius 180 mm, runs from 5 degrees to 20 degrees. The motor centre O sits at 102.956 mm from P at 29.055 degrees, and a dashed arc through O shows its path as the plate turns 7.5 degrees either way, from 57.825 mm to 81.320 mm above the plate's bottom edge in frame terms.
caption: This is an illustration, drawn at half the scale of the coordinates. Turning the plate 7.5° each way about P moves the motor centre along an arc of radius 102.956 mm.
viewbox: 0 0 520 330
body:
<circle class="bxa" cx="100" cy="270" r="11"/>
<text class="txb" x="72" y="300">P (20, 20)</text>
<path class="bxi" d="M469.59 237.67A371 371 0 0 0 448.63 143.11A11 11 0 0 0 427.95 150.63A349 349 0 0 1 447.67 239.58A11 11 0 0 0 469.59 237.67Z"/>
<path class="cl" d="M458.63 238.62A360 360 0 0 0 438.29 146.87"/>
<path class="lf dsh" d="M100 270L458.63 238.62M100 270L438.29 146.87"/>
<text class="txs" x="470" y="250">S1, 5°</text>
<text class="txs" x="446" y="138">S2, 20°</text>
<circle class="bx" cx="280" cy="170" r="10"/>
<path class="la draw" pathLength="1" d="M291.51 194.35A205.91 205.91 0 0 0 265.41 147.36"/>
<circle class="fa pulse" cx="291.51" cy="194.35" r="4"/>
<circle class="fa pulse" cx="265.41" cy="147.36" r="4"/>
<path class="lf" d="M100 270L280 170"/>
<text class="txb" x="226" y="160">O, drawn position</text>
<text class="txs" x="300" y="210">−7.5°: (115.756, 57.825)</text>
<text class="txs" x="150" y="130">+7.5°: (102.704, 81.320)</text>
<text class="txs" x="150" y="252">102.956 mm</text>
```

## What the slot does: the adjustment range

The slot exists to let the plate turn about the pivot and lift or lower the motor. With the lock bolt at the middle of the slot in the drawn position, the plate can turn 7.5° either way before the bolt reaches an end. The motor centre O is 102.956 mm from the pivot at 29.055°, so as the plate turns it moves along an arc of that radius.

At −7.5°, O is at 102.956∠21.555° from P, which is (115.756, 57.825) in the frame's coordinates. At +7.5°, it is at 102.956∠36.555°, or (102.704, 81.320). The motor centre therefore moves along an arc of 102.956 × 0.2618 = 26.954 mm, a straight-line distance of 26.877 mm, of which **23.495 mm** is vertical and 13.052 mm is sideways.

For the belt, what matters is the change in the distance from O to the conveyor pulley's centre Q, which stays fixed on the frame at (110, −330). At the two ends of the slot, that centre distance is:

- −7.5°: √(5.756² + 387.825²) = **387.87 mm**;
- drawn position: 400.00 mm;
- +7.5°: √(7.296² + 411.320²) = **411.38 mm**.

Using the belt length formula from Chapter 4, the drive can take belts from **1,224.9 mm to 1,271.4 mm** pitch length. A stock belt of 1,250 mm pitch length needs a centre distance of 400.59 mm, which is reached by turning the plate a little past the drawn position. The plate can lower the motor by 12.7 mm of centre distance from there to slacken the belt for fitting, and raise it by 10.8 mm to take up stretch.

That is a design result, not just a drafting one, and the drafter is often the first person to calculate it. If the belt supplier recommends more installation allowance than the slot provides, the slot must be longer, and Chapter 3 showed that its upper end is already close to the chamfer.

```figure
type: line
title: Belt pitch length the drive accepts across the slot
x: Plate rotation from the drawn position, degrees
y: Belt pitch length, mm
ymin: 1200
ymax: 1280
mark: 0 | Drawn position
caption: This is an illustration. Belt lengths from the open-belt formula with pulley radii 40 and 100 mm and the fixed conveyor pulley at (110, −330).
- −7.5 | 1224.9
- −5 | 1233.0
- 0 | 1248.8
- 5 | 1264.0
- 7.5 | 1271.4
```

## The error: index marks that stopped short

This is an illustration. To help fitters set the belt tension repeatably, the customer asked for seven short index marks to be laser-etched beside the slot, from 5° to 20° about the pivot, so that the fitter could note which mark the lock bolt sat at. The drafter drew one mark at 5° and arrayed it about P with seven items and an angle between items of 15° ÷ 7 = 2.143°.

The last mark landed at 5° + 6 × 2.143° = 17.857°, about 6.7 mm short of the slot's upper end. The checker saw it at once on the plot, because the first mark lined up with the end of the slot and the last did not. Seven marks need six spaces, so the correct angle between them is 15° ÷ 6 = 2.5°, which places the last mark at exactly 20°. The drafter redid the array by entering seven items and a fill angle of 15°, letting the software divide, and added a check to the office list: in every partial array, the last item must land on the end feature it is meant to match.

## Patterns that rotate as a whole

Bolt patterns are often specified with an angular offset: four holes on a 100 mm pitch circle "at 45° to the horizontal". The array starts from a first hole placed at the offset angle, and everything follows. If the pattern must also be rotated later, for example because the motor's terminal box must face a different way, rotate the whole pattern about the pitch circle's centre rather than editing the holes one at a time. A rotation about O keeps every hole on the pitch circle and the spacing unchanged, which no amount of individual editing can guarantee. Afterwards, list one hole and confirm its distance from O is still exactly half the pitch circle diameter, and that its angle from O equals the old angle plus the rotation. Those two numbers prove the rotation was made about the right centre; a rotation about a point picked slightly off O moves every hole by the same small amount and leaves the spacing perfect, so the spacing check alone will not reveal it.

The same applies to the slot. If the adjustment range must move, rotate the slot about P. If it must become longer, change the end angles and redraw it from the centreline, rather than stretching one end, which can leave the end cap no longer centred on the centreline arc.

## Checking a pattern on the finished part

The checking numbers are as useful to the inspector as to the drafter, and it helps to give them in a form that can be measured without a coordinate measuring machine. Hole centres cannot be touched with callipers, but hole edges can. For two holes of diameter d whose centres are a chord c apart, the distance between their nearest edges is c − d and between their farthest edges is c + d, so the centre distance is the average of the two readings.

For the motor holes, the nearest-edge distance between neighbours should be 70.711 − 9 = 61.711 mm and the farthest-edge distance 70.711 + 9 = 79.711 mm. A reading of 61.6 mm and 79.8 mm averages to 70.70 mm, confirming the chord to within the callipers' resolution. Across the diagonal, the same method gives 91.0 mm and 109.0 mm for a perfect pattern.

Odd-numbered patterns have no opposite hole, so the pitch circle diameter cannot be measured across directly. Measure the widest chord instead, across (n − 1) ÷ 2 spaces, and divide by its sine factor. For a five-hole pattern, the widest chord spans two spaces, 144°, and equals D × sin 72°. A measured widest chord of 95.106 mm therefore means D = 95.106 ÷ 0.95106 = 100.0 mm. Putting this calculation on the drawing as a reference note, or in the inspection plan, saves the inspector deriving it and removes one more place for an error.

## Exercise: a different motor

The customer switches to a motor whose flange has four Ø9 holes on a 115 mm pitch circle. The drafter first places them at 0°, 90°, 180° and 270° about O. Check the webs against the plate's 15 mm minimum, and propose a better orientation if needed.

**Worked answer.** At 0°, 90°, 180° and 270°, the holes are at (167.5, 70), (110, 127.5), (52.5, 70) and (110, 12.5). The top hole's web to the top edge is 140 − 127.5 − 4.5 = **8.0 mm**, and the bottom hole's web to the bottom edge is 12.5 − 4.5 = 8.0 mm. Both are below 15 mm. That orientation does not work.

Rotating the pattern 45° about O puts the holes at 57.5 × cos 45° = 40.659 mm from O in each direction: (150.659, 110.659), (69.341, 110.659), (69.341, 29.341) and (150.659, 29.341). The webs are:

- top holes to the top edge: 140 − 110.659 − 4.5 = **24.84 mm**;
- bottom holes to the bottom edge: 29.341 − 4.5 = **24.84 mm**;
- top right hole to the chamfer: |150.659 + 110.659 − 315| ÷ √2 − 4.5 = 37.96 − 4.5 = **33.46 mm**;
- each hole to the Ø60 bore: 57.5 − 4.5 − 30 = **23.0 mm**.

All are above 15 mm, so the 45° orientation works, provided the motor's terminal box can face the way that orientation allows. The checking numbers for the new pattern are a neighbour chord of 115 × sin 45° = 81.317 mm and diagonals of 115.000 mm.
