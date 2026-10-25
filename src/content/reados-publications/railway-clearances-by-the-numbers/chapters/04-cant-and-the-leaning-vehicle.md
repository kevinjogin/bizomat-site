---
book: railway-clearances-by-the-numbers
chapterSlug: cant-and-the-leaning-vehicle
order: 4
title: "Cant and the leaning vehicle"
description: "Calculate how far cant tilts a vehicle towards the inside of a curve at each height, why the outer roof corner rises, how speed changes the lean on the springs, and what cant does under bridges."
draft: false
---

On a curve, the outer rail is usually raised above the inner one. The difference in height is called cant, or superelevation, and it tilts the track so that a train running at the right speed feels the combined pull of gravity and its turning acceleration straight down through the floor, rather than being thrown outwards. Cant is good for passengers, wheels and rails, but it is bad for clearances, because it tilts the whole vehicle towards the inside of the curve. A point high on the vehicle moves much further sideways than a point low down, so a tall vehicle on a canted curve needs far more room on the inside than its straight-track outline suggests.

This chapter calculates the tilt from the cant and the movement it causes at each height, shows why the vehicle's outer roof corner rises while its inner corner drops, explains how speed changes the lean on the vehicle's springs, and applies the results to the overbridge in the running case, on its 400 m curve with 60 mm of cant.

## The tilt from the cant

Cant is measured as the height of the outer rail above the inner one, in millimetres. The track tilts about the inner, or low, rail, through an angle whose sine is the cant divided by the distance between the rails' centres, about 1,500 mm on standard gauge track. With 60 mm of cant, the angle is a little under 2.3 degrees.

```figure
type: formula
title: Inward movement of the vehicle at each height from 60 mm of cant
formula: inward movement ≈ height above rail × cant ÷ 1,500
caption: This is an illustration for standard gauge track with rail centres taken as 1,500 mm and 60 mm of cant, the running case's curve. The vehicle rotates about the low rail; for a point near the body side, the extra term from rotation about the low rail rather than the centreline is a few millimetres.
- Cant | 60 mm
- Angle | sin⁻¹(60 ÷ 1,500) ≈ 2.29°
step: at 1,000 mm above rail: 1,000 × 60 ÷ 1,500 = 40 mm towards the inside
step: at 4,000 mm: 4,000 × 60 ÷ 1,500 = 160 mm towards the inside
step: a structure on the inside of the curve, at roof height, sees the vehicle about 160 mm closer than on level track
```

```figure
type: bars
title: Inward movement from 60 mm of cant by height above rail
unit: mm towards the inside of the curve
max: 180
caption: This is an illustration from the formula above, for the running case's curve. The movement is proportional to height, so it is largest at the roof and the top of any load.
- 1,000 mm | 40
- 2,000 mm | 80
- 3,000 mm | 120
- *4,000 mm | 160
- 4,300 mm | 172
```

The movement is the largest single clearance effect on many canted curves, larger than curve throw. On the running case's curve, the design vehicle's centre throw was about 49 mm; the cant moves its roof about 160 mm in the same direction. A structure on the inside of a canted curve must allow for both.

## Rotation about the low rail

Strictly, the vehicle rotates about the low rail, not about the track centreline, so every point is moved by the rotation about that rail. For a point at a given height and offset, the new position can be calculated exactly. For the design vehicle's roof corners, 1,500 mm each side of the centreline and 4,000 mm above rail, with 60 mm of cant, the exact rotation about the low rail moves the inner corner about 159 mm inwards and 33 mm down, and the outer corner about 162 mm inwards and 87 mm up. The simple height-times-cant rule gives the inward movement to within a few millimetres; the vertical movements need the exact rotation.

## The outer corner rises

The rise of the outer roof corner matters for vertical clearance. Under a bridge over a canted curve, the highest point of the vehicle is not the middle of its roof but its outer corner, lifted by the tilt. In the running case, the outer corner of a 4,000 mm high vehicle rises about 87 mm. A bridge designed for the vehicle's straight-track height, measured from the low rail, would be nearly 90 mm short at the outer corner before any other allowance.

This is why structure gauges increase vertical clearance on canted track. ARTC's Structure Gauge 1994 required its vertical dimension to be increased for superelevated track by an amount proportional to the cant, and the governing standard for any line sets the rule. The datum matters too: a vertical clearance stated from the high rail and one stated from the low rail differ by the cant itself.

## Cant tolerance

Track is never exactly at its design cant. It varies with maintenance, settlement and wear, and the kinematic envelope allows for that variation. ARTC's Transit Space Standards assumed a variation in superelevation of 10 mm when deriving transit space, and its kinematic envelope procedure rotates the vehicle by the tolerance after rotating it by the design cant. At 4,000 mm height, an extra 10 mm of cant moves the roof about 27 mm further inwards, a small but real addition.

## Speed and lean on the springs

Cant is designed for one speed, the equilibrium speed, at which the vehicle's weight and turning acceleration combine to act straight down through the track. At other speeds, the vehicle leans on its springs. Running faster than equilibrium, it has cant deficiency: the net force pushes it outward, and it rolls outward on its suspension, partly cancelling the inward tilt of the cant. Running slower, or standing still, it has cant excess: the net force pushes it inward, and it rolls further inward, adding to the tilt.

For clearances, that means a structure on the inside of a canted curve is approached most closely by a slow or stopped vehicle, leaning in on both the cant and its springs, while a structure on the outside is approached most closely by a fast vehicle rolling outward. Railway Track Geometry by the Numbers explains equilibrium speed and cant deficiency. ARTC's transit space allowed for a vehicle roll of 2 degrees on its suspension, as Chapter 5 includes in the kinematic envelope.

```figure
type: compare
title: Which way the vehicle leans on a canted curve, by speed
cols: Net effect on the springs | Closest approach
caption: General description for teaching. The kinematic envelope uses a roll allowance that covers the speeds and track quality assumed.
- Stopped or very slow | cant excess; rolls further inward | structures on the inside of the curve
- At equilibrium speed | balanced; little roll | the cant tilt alone
- *Fast, with cant deficiency | rolls outward on its springs | structures on the outside of the curve
```

## Platforms on canted curves

The effect of cant is most awkward at platforms on curves. A platform on the inside of a canted curve is approached by the vehicle's body leaning towards it, so the gap between the step and the coping changes with the cant, and a train stopped at the platform leans in further on its springs. A platform on the outside is approached by a body leaning away from it, so the gap at step height widens, which is a hazard to passengers. Platforms on curves therefore need careful clearance design, and many railways avoid locating them on sharp or heavily canted curves. Chapter 8 deals with platforms.

## Cant and loads

Tall loads on flat wagons and well wagons, and double-stacked containers, have their highest points far above rail, so cant moves them furthest. A load 5,000 mm above rail on a curve with 80 mm of cant moves about 5,000 × 80 ÷ 1,500 ≈ 267 mm towards the inside. Out-of-gauge moves, covered in Chapter 9, must check the load's lean at every canted curve on the route, and sometimes restrict speed through the curve to limit the additional roll.

## Changing the cant changes the clearances

Because cant tilts the whole vehicle, changing the cant at a structure, during resurfacing or to raise line speed, changes every clearance there. Increasing cant moves vehicles further towards structures on the inside and raises them towards structures overhead on the outside. A track maintainer who raises cant through a tunnel or under a low bridge without checking the clearances can create an infringement without touching the structure. Changes to cant at clearance-critical structures are therefore checked by an engineer before they are made, and the new cant is recorded against each structure so that the next clearance check starts from the track as it really is, not as it was designed.

## Cant along a transition

Cant is not applied suddenly at the start of a curve. It is run up gradually along the transition curve, from zero on the straight to its full value where the circular curve begins, and run down again at the other end. Along the transition, therefore, the vehicle's tilt increases steadily, and so does its inward movement at height. A structure standing on a transition sees a lean that depends on exactly where it stands: near the straight, almost none; near the circular curve, almost the full amount. Designers working near transitions take the cant at the structure's exact position from the track design, rather than assuming either zero or the full value, and remember that throw is also changing along the same length, as Chapter 3 described.

## Combining cant and throw

On the inside of a canted curve, centre throw and cant lean act in the same direction: both move the vehicle towards the inside. On the outside, end throw moves the body's ends outward while cant tilts the body inward, so the two partly cancel at low heights, and at roof height the cant usually wins. The combined position of each critical point of the vehicle is found by applying the cant rotation and the throw together, as the kinematic envelope procedure of Chapter 5 does, rather than by adding the largest value of each regardless of direction. For the running case's inside pier, the two effects add: about 64 mm of centre throw and about 160 mm of cant lean at 4,000 mm, some 224 mm in all, before any other allowance.

## Measuring cant

Cant is measured with a track gauge that has a level, or with a track recording vehicle, as the height difference between the rails across the track. On a curve, the cant measured at a structure is recorded with the structure's clearance survey, because the clearance depends on it. A clearance survey that records the structure's position but not the track's cant cannot be checked later when the cant changes. Chapter 10 returns to this.

## Cant on fixed track

On ballasted track, cant can be changed by tamping, and changes over time as the ballast settles. On track fixed to concrete slabs in tunnels, on bridges or in stations, the cant is built in and changes only if the slab moves. That is more stable for clearances, but it also means a cant set too high or too low at construction stays wrong, so the cant on slab track is checked carefully before the slab is cast, and the tolerances assumed for slab track are agreed with the infrastructure manager.

## Why cant is still worth having

None of this is an argument against cant. Without it, trains on curves would have to run much slower, or passengers would be thrown sideways, and the outer rail and wheels would wear far faster under the unbalanced force. Cant is a deliberate trade: it buys speed, comfort and lower wear at the cost of clearance on the inside of curves and height on the outside. The clearance engineer's job is not to minimise cant but to know exactly how much there is at each structure, allow for it, and make sure that nobody changes it without checking what it does to the space around the track.

## The running case: the inside pier at height

This is an illustration. The overbridge's inside pier rises beside the track from ground level to the deck. The consultancy calculated the vehicle's inward movement at several heights up the pier's face: about 40 mm at 1,000 mm, 120 mm at 3,000 mm and 160 mm at 4,000 mm from the 60 mm cant, plus the critical passenger car's centre throw of about 64 mm. The highest points of the vehicle came closest to the pier, so the pier's face was set back to suit the vehicle's position at roof height, with the kinematic and margin allowances of Chapters 5 and 6 added. The deck's soffit was checked against the outer roof corner's rise of about 87 mm.

## A failure: the resurfaced tunnel

This is an illustration. During a resurfacing job through a short tunnel on a curve, the track gang raised the cant by 25 mm to match the design, which had drifted low over the years. Nobody checked the tunnel's clearances, which were already tight. The next tall container train scraped the tunnel's wall on the inside of the curve at cantrail height.

At 4,500 mm above rail, 25 mm of extra cant moves the vehicle about 75 mm inwards. The cant was restored, the tunnel's clearance surveyed and recorded, and the track maintenance procedures were changed to flag clearance-critical structures, where cant and alignment changes need engineering approval first.

## Exercise: a heavily canted curve

A curve carries 100 mm of cant. Using rail centres of 1,500 mm, what is the tilt angle, and how far inward does a point 3,500 mm above rail move by the simple rule? If the vehicle's inner body side at that height is 1,500 mm from the centreline, how far is it from the centreline after the tilt?

The angle is sin⁻¹(100 ÷ 1,500) ≈ **3.82°**. By the simple rule, the point moves about 3,500 × 100 ÷ 1,500 ≈ **233 mm** towards the inside.

The inner body side moves from 1,500 mm to about **1,733 mm** from the centreline on the inside of the curve; the exact rotation about the low rail gives about 1,732 mm. This is an illustration; before any structure is placed, the throw, the cant tolerance, the vehicle's roll on its springs and the other kinematic allowances are added, and then the safety margin.
