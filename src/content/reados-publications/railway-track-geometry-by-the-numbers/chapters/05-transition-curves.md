---
book: railway-track-geometry-by-the-numbers
chapterSlug: transition-curves
order: 5
title: "Transition curves"
description: "Ease trains into curves with transitions that grow curvature and cant gradually, size them from the rates of change of cant, deficiency and twist, and calculate the shift of the circular curve."
draft: false
---

A train cannot go straight from a straight onto a circular curve without a jolt. On the straight, its curvature is zero; on the curve, it is one over the radius; if the change were sudden, the sideways acceleration would jump instantly from nothing to its full value, and if the curve were canted, one rail would have to step up by the full cant in no distance at all. Between the straight and the curve, therefore, railways insert a transition curve, along which the curvature grows steadily from zero to its full value and the cant is run up from zero to its full value at the same time. A good transition makes the curve almost invisible to passengers; a poor one, or none at all, gives a lurch at each end of every curve, a twist that can unload a wheel, and a length of track at each end of the curve that wears and moves faster than the rest and needs attention long before the curve itself.

This chapter explains the shape of a transition, sizes its length from the rates at which cant and cant deficiency change and from the twist the track can tolerate, calculates the shift that moves the circular curve inward to make room for it, and designs the transition at the end of the running case's main line curve, before the junction turnout.

## The shape of a transition

The usual railway transition is a curve whose curvature increases in proportion to the distance along it, so that at its start, on the straight, the curvature is zero, and at its end, where it meets the circular curve, the curvature is one over the radius. The mathematical name for this curve is a clothoid, and in practice railways often use close approximations, such as a cubic parabola, which differ negligibly for the lengths and radii used. Because the curvature grows evenly along it, the sideways acceleration felt by a train at constant speed also grows evenly, with no jolt.

The cant is run up along the same length, usually in a straight line from zero to the full cant, so that the cant and the curvature reach their full values together where the circular curve begins. The versines on a fixed chord along a transition therefore increase steadily from zero to the circular curve's versine, which is how a transition is recognised and checked on the ground.

## How long a transition must be

Three separate things limit how quickly the curvature and cant can change along the track, and each of them gives its own minimum length for the transition.

```figure
type: formula
title: Minimum transition lengths at the end of the running case's main line curve
formula: length for cant rate = cant × speed ÷ (3.6 × allowed rate in mm/s); length for twist = cant × N for a cant gradient of 1 in N
caption: This is an illustration using an assumed allowed rate of change of cant and of cant deficiency of 35 mm per second, for teaching, and a cant gradient of 1 in 300, the maximum rate of change of superelevation stated in ARTC TCS 01 (2005) for new track. Speed in km/h, cant and deficiency in mm, lengths in mm, converted to metres.
- Applied cant | 110 mm
- Cant deficiency at 115 km/h | about 85 mm
- Assumed allowed rate of change | 35 mm/s
step: for cant rate: 110 × 115 ÷ (3.6 × 35) ≈ 100 m
step: for deficiency rate: 85 × 115 ÷ (3.6 × 35) ≈ 78 m
step: for twist at 1 in 300: 110 × 300 = 33,000 mm, 33 m; the cant rate governs, at about 100 m
```

The first criterion limits how fast the train rolls as the cant comes on: a train travelling at speed V covers the transition in a time equal to its length divided by V, and the cant changes by its full value in that time, so the rate of change in millimetres per second must stay below a comfortable limit. The second limits how fast the felt sideways acceleration builds up, measured by the cant deficiency, which also comes on over the transition. The third, the cant gradient, limits the twist of the track: the change in cross level over a vehicle's wheelbase, which, if too steep, lifts one wheel off its rail.

```figure
type: bars
title: Minimum transition length by criterion, running case's main line curve
unit: metres
max: 110
caption: This is an illustration from the formula above. The longest governs; on fast lines the time-based criteria usually govern, while on slow lines with high cant the gradient can govern.
- *Rate of change of cant | 100
- Rate of change of deficiency | 78
- Cant gradient, 1 in 300 | 33
```

For the running case, the rate of change of cant at the passenger trains' speed governs, giving a minimum transition of about 100 m. The gradient limit of 1 in 300, from the construction standard, is far from governing here; it would govern on a slow line with high cant, where trains take a long time to cross even a short transition.

## Where the cant is run off

Most designs run the cant up linearly along the transition, in step with the curvature, so that the cant matches the curvature everywhere along it. Some designs, for higher speeds, use a curved run-up that starts and ends more gently, reducing the jolt at the transition's ends where the rate of change of cant suddenly begins and ends. Either way, the cant and curvature are kept in step: cant running ahead of the curvature, or behind it, gives trains a period of excess or deficiency along the transition that they would not have on the curve itself.

## Twist and the vehicle

Twist deserves particular attention here. A four-wheeled bogie or a wagon with a rigid underframe cannot follow track whose cross level changes too quickly along it: one wheel lifts or unloads, and a lightly loaded wheel on a lifting rail can climb over it. The cant gradient along a transition is a designed twist, and ARTC's TCS 01 limited the rate of change of superelevation measured over 3 m for new track, subject to a maximum of 1 in 300, with tolerances by line class. Unintended twist, from uneven settlement or poor maintenance, adds to the designed twist and is one of the commonest geometry causes of derailments, especially of empty wagons, as Chapter 9 explains.

## The shift

A transition cannot simply be inserted between an existing straight and an existing circular curve, because the transition starts more gently than the curve and would not meet it. Instead, the circular curve is moved inward, towards its centre, by a small distance called the shift, which makes room for the transitions at each end. For a clothoid of length L joining a curve of radius R, the shift is about L² ÷ 24R.

```figure
type: formula
title: Shift of the running case's main line curve for a 100 m transition
formula: shift ≈ transition length² ÷ (24 × radius)
caption: This is an illustration for a 100 m transition joining the 800 m curve. The transition extends about half its length each side of the original tangent point.
- Transition length | 100 m
- Radius | 800 m
step: shift ≈ 100² ÷ (24 × 800)
step: shift ≈ 10,000 ÷ 19,200 ≈ 0.52 m
step: the circular curve sits about 0.52 m inside where it would have been without transitions
```

In practice, the shift matters when curves are first laid out and when existing curves without transitions are given them: half a metre of shift moves the track sideways, which may affect structures, platforms, bridges and the land boundary. On sharp curves with long transitions, the shift can be large, and designing transitions into old curves is a significant realignment.

## Versines along the transition

On the ground, a transition shows itself in the versines. On a 20 m chord, the versines rise from zero at the straight end to 62.5 mm where the 800 m curve begins, increasing by the same amount for each equal step along the transition; at its middle, the versine is about half the curve's, about 31 mm. A recorded versine plot that rises in a straight line, levels off on the circular curve and falls in a straight line at the other end shows a well-formed curve. Kinks in the rising line show a transition that has since been disturbed, and they are felt by trains as small jolts.

## Transitions and turnouts

Turnouts, the subject of Chapter 7, are generally placed on straight, level track, or on a curve of constant radius and cant designed for the purpose, not on a transition, because a turnout's geometry assumes a constant line and level beneath it. A turnout on a transition would have its cant changing under it, which the switch and crossing cannot accommodate.

## Vertical transitions

The same principle applies vertically: where the grade changes, a vertical curve eases the change, as Chapter 6 explains. And where a horizontal transition and a vertical curve overlap, the combination of changing cant and changing grade can produce more twist than either alone, so designers try to keep them apart or check the combined twist carefully.

## Reverse curves and the space between

Where a curve to one side follows a curve to the other, each needs its own transitions, and the two transitions must not overlap so that the track's cant would have to change from one side to the other in too short a length. Designers either insert a length of straight between the transitions, long enough that a vehicle is not on both at once, or join them directly at the point of zero curvature and zero cant, so that the curvature and cant pass smoothly through zero. The cant gradient and twist criteria apply through the reversal, and the passenger-comfort criteria apply to the combined change of acceleration from one side to the other.

## Compound curves

A compound curve, where a curve of one radius joins another of a different radius curving the same way, also needs a transition between them, to change the curvature and cant from one value to the other gradually. Its length is sized from the change in cant and deficiency between the two curves, using the same criteria, rather than from the full cant. A compound junction without a transition gives a small jolt that trains feel and the track records as a kink in its versines.

## Transitions and maintenance

Transitions are the parts of curves that are hardest to keep in shape. Their curvature and cant both change continuously, so a tamping machine must follow a target that changes at every sleeper, and small errors produce kinks in the versines and irregular twist. Modern tamping machines carry the design geometry and follow it automatically, but only if the design is recorded accurately, with the transition's start and end points marked and its length, curve radius and cant known. Old curves whose transitions have drifted from their design are a common source of rough riding and twist faults.

## Speed and transition length

Because the time-based criteria depend on speed, a transition long enough for today's trains may be too short if speeds rise. Raising a curve's speed by raising its cant and allowing more deficiency, as Chapter 4 described, also lengthens the transitions needed, and lengthening transitions means more shift and more realignment. Line upgrade studies check transitions as well as curve speeds, because a curve whose cant can be raised but whose transitions cannot be lengthened gains nothing.

## The running case: the transition before the junction

This is an illustration. The main line's 800 m curve ended about 200 m before the site of the cooperative's junction turnout. The infrastructure manager's records showed an existing transition of about 100 m at that end, with the cant run off from 110 mm to zero along it. The engineers confirmed, by measuring versines and cross level along it, that the transition was intact, and placed the junction turnout's switch on straight, level track at least 50 m beyond the transition's end, so that trains entering the turnout would be fully off the curve and its cant. That left room for the catchpoint and signal of Chapter 7 without disturbing the curve.

## Old curves without transitions

Some old lines have curves laid without transitions, or with very short ones, from a time of lower speeds. Trains feel a jolt at each end, the track at the ends wears and moves faster, and the speed on the curve is often lower than its radius and cant would allow. Adding transitions means shifting the curve inward, which may be impossible beside structures, so the improvement is planned with the clearances and boundaries in mind. Where it cannot be done, the curve's speed is set to keep the jolt acceptable.

## A failure: the stepped cant

This is an illustration. A short siding curve was given 40 mm of cant by a contractor who ran it up over only about 5 m at the curve's start, because the drawings did not show a run-off. Empty four-wheeled wagons rocked visibly at that point, and one derailed at low speed when its lightly loaded leading wheel lifted on the twist and climbed the rail.

The twist of 40 mm in 5 m, a gradient of 1 in 125, was far steeper than any track standard allows. The siding's cant was removed altogether, as sidings normally have none, and the drawings were corrected.

## Exercise: a transition for a faster curve

A 600 m curve carries 120 mm of cant, and passenger trains run at 100 km/h with about 77 mm of deficiency. Using an assumed allowed rate of change of 35 mm per second for both cant and deficiency, and a cant gradient of 1 in 300, find the minimum transition length by each criterion, the governing length, and the shift.

By rate of change of cant, 120 × 100 ÷ (3.6 × 35) ≈ **95 m**; by rate of change of deficiency, 77 × 100 ÷ (3.6 × 35) ≈ **61 m**; by gradient, 120 × 300 = 36,000 mm, **36 m**. The rate of change of cant governs, at about **95 m**.

The shift is about 95² ÷ (24 × 600) ≈ **0.63 m**. This is an illustration; real transitions use the governing standard's limits, and a round length such as 100 m would usually be adopted.
