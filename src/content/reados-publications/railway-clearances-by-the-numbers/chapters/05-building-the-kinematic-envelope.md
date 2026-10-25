---
book: railway-clearances-by-the-numbers
chapterSlug: building-the-kinematic-envelope
order: 5
title: "Building the kinematic envelope"
description: "Stack cant, cant tolerance, track movement, wear and play, throw, body roll and bounce in order to find how far a moving vehicle can reach, and see which allowances dominate on a curve."
draft: false
---

The kinematic envelope is the space a moving vehicle can occupy once everything that moves it has been allowed for: the curve, the cant, the imperfections of the track, the wear of wheels and rails, the play between wheel and rail, the sway of the body on its springs and its bounce. Chapters 3 and 4 dealt with the two geometric effects, throw and cant. This chapter adds the rest and puts them together in order, point by point around the vehicle's outline, to find where each point of the vehicle can reach. The result is the boundary that no structure may approach without leaving a safety margin, and the starting point for the structure gauge of Chapter 6.

The chapter lists the allowances the ARTC NSW standards assumed, follows the order in which its envelope procedure applied them, calculates the envelope at the critical point of the running case's vehicle under the overbridge, and shows which allowances dominate.

## The allowances

ARTC's Transit Space Standards, BDS 11, in its 2005 issue, listed the vehicle and track effects considered in deriving NSW transit space. The vehicle effects were a vehicle roll of 2 degrees, when tested on track of average condition, a vehicle lateral movement of 60 mm including wheel wear, a vehicle bounce of 50 mm, and the curvature effects of centre and end throw. The track effects were 15 mm of rail wear, 25 mm of lateral track movement on straight track or 35 mm on curves, a 10 mm variation in superelevation, and an allowance of 150 mm above graded rail level for resurfacing. Those values are quoted here for teaching; the governing standard for any line sets its own.

```figure
type: compare
title: Allowances in the kinematic envelope and what each represents
cols: What causes it | Value assumed in ARTC BDS 11 (2005)
caption: Values as given in ARTC BDS 11, Issue 1, March 2005, for teaching; check currency with ARTC. Other railways and later issues use their own values.
- Body roll | the body sways on its suspension at speed and on rough track | 2 degrees
- Lateral movement | play between wheels and rails, and wheel wear | 60 mm
- *Track lateral movement | the track is not exactly where it was designed | 25 mm straight; 35 mm curves
- Rail wear | worn rail heads let the vehicle move further | 15 mm
- Cant variation | cant differs from design | 10 mm
- Bounce | the body moves up and down on its springs | 50 mm
- Curve throw | the body's chord on a curve | calculated (Chapter 3)
```

## The order of operations

The allowances are not simply added up, because some are rotations and some are displacements, and the direction of each depends on the ones before it. ARTC's Application of Kinematic Envelope, BDS 13, set out an order: treat the vehicle as two half-outlines either side of its centreline, and move each half outward in turn.

```figure
type: steps
title: Building one half of a kinematic envelope, in the order the ARTC NSW procedure applied
caption: Summarised in new words from ARTC BDS 13 (Issue 1, March 2005), for teaching. The governing standard's procedure applies to real work.
- Tilt for the cant | rotate the half-outline about the low rail by the design cant
- Tilt for the cant tolerance | rotate further, outward, by the cant variation
- Shift for track position | move it sideways by the lateral track tolerance
- Shift for wear and play | move it outward along the tilted track plane by rail and wheel wear and lateral play
- Shift for curve throw | move it outward along the tilted plane by the centre or end throw
- Roll the body | rotate it outward about the vehicle's roll centre by the body roll
- *Lift for bounce | raise it along the vehicle's centreline by the bounce
```

Each step moves every point of the outline, and the next step starts from where the last left it. Tilting before shifting means the shifts along the track plane are themselves slightly tilted; rolling about the vehicle's roll centre, after the shifts, means points high on the body move furthest. The result is a new, larger outline, different on each side of the vehicle and different at each height above the rail, which is why the envelope is calculated point by point rather than by adding one allowance to the whole outline.

## The critical point under the bridge

For the overbridge, the critical point is the top inner corner of the critical vehicle's body, closest to the inside pier: 1,500 mm from the centreline and 4,000 mm above rail on level, straight track. Working through the steps for the 400 m curve with 60 mm of cant gives its envelope position.

```figure
type: bars
title: How far each allowance moves the inner roof corner towards the inside pier
unit: mm of lateral movement, applied in order
max: 170
caption: This is an illustration for the running case: a corner 1,500 mm from centreline and 4,000 mm above rail; 60 mm cant plus 10 mm tolerance; 35 mm track movement; 75 mm of wear and play (60 mm plus 15 mm rail wear); 64 mm centre throw for the critical passenger car; 2 degrees of roll about a roll centre assumed 1,100 mm above rail. Calculated by rotating and shifting the point in the order above.
- Cant, 60 mm | 159
- Cant tolerance, 10 mm | 27
- Track movement | 35
- Wear and play | 75
- Centre throw | 64
- *Body roll, 2 degrees | 97
```

The movements add to about 457 mm, so the corner can reach about 1,957 mm from the track centreline on the inside of the curve, at a height a little below 4,000 mm. On straight, level track the same corner would reach only about 1,727 mm, with the roll, wear, play and straight-track movement alone. The curve and its cant add about 230 mm on the inside at this height.

## Which allowances dominate

On the running case's curve, the cant is the largest single effect at roof height, then the body roll, then the wear and play, the throw, the track movement and the cant tolerance. Low on the body, near the roll centre, the roll adds almost nothing and the cant much less, so the envelope is narrower there. That is why the envelope is not a simple widening of the outline but a new shape, widest at the top on the inside of a canted curve.

The pattern changes with the location. On straight track, roll and lateral play dominate; on a sharp curve with little cant, throw dominates; on a tall vehicle on a heavily canted curve, cant dominates. Knowing which dominates tells the designer where the envelope is most sensitive: on the running case's curve, an error in the cant matters most, so the cant at the bridge must be confirmed.

## Worst case added

The procedure adds every allowance at its worst at once: the track displaced towards the structure, the cant at its tolerance, the wheels worn, the body rolled and bounced, all together. In reality, all of these rarely occur at their worst at the same time and place, and a statistical combination would give a smaller envelope. The standards nevertheless add them, because the consequence of contact is severe, the allowances are themselves approximate, and the safety margin beyond the envelope is the only protection against the unforeseen. A designer should not shrink the envelope by combining allowances statistically unless the governing standard permits it.

## Speed and track quality

Roll and bounce depend on speed and on the quality of the track. BDS 11 tied its 2 degree roll to track of average condition, measured by a track condition index, and BDS 13 noted that roll and bounce may reduce if speed is limited. That gives two levers when a clearance is tight: restricting the speed of trains past the structure, which reduces the dynamic movements, and maintaining the track to a tighter standard, which reduces both the track tolerances and the roll. Both cost money every day, which is why designing a structure with full clearance is usually cheaper than relying on them.

## Both sides of the vehicle

The envelope is built for each side separately. On the inside of the curve, the cant, centre throw and inward roll all act together; on the outside, end throw acts outward while the cant tilts the body away, and the outward roll at speed with cant deficiency matters. The running case's outside pier is checked with the outside half of the envelope, using the end throw of about 41 mm for the freight vehicle, the outward roll, and the cant acting to lean the vehicle away from it at low heights.

## Vertical envelope

Vertically, the envelope adds bounce and the rise of the outer corner from the cant and roll. The outer roof corner rose about 87 mm from the cant alone in Chapter 4; with the cant tolerance, the outward roll and 50 mm of bounce, it rises further. Above all of that, the vertical clearance adds the allowance for future track lift, 150 mm in the NSW standards, and the safety margin, as Chapter 6 explains.

## Many vehicles, many envelopes

Every approved outline has its own envelope, and so does every unusual vehicle or load. BDS 13 noted that a different kinematic envelope applies for each rolling stock gauge, and that where different types of rolling stock use a section of track, separate analyses are needed to find the critical clearances. On the running case's corridor, the freight vehicle, the long passenger car and future double-stacked container wagons each produce a different envelope; the passenger car governs the inside pier at body height because of its throw, while the container wagons govern the deck's height because of their height and the cant's lift at their outer corner. The structure must clear the outer boundary of all of them.

## Points around the outline

An envelope is not found from one point. The calculation is repeated for enough points around the outline to describe its shape: the bottom corners near the rail, the step, the body side at several heights, the cantrail, the roof corners and the roof itself, and any projections. Each point moves differently, because the rotations move high points further than low ones and points on the outside differently from points on the inside. Joining the moved points gives the envelope's outline at that location. The running case's engineers calculated twelve points on each side for each critical vehicle at the bridge, and drew the resulting envelopes over the bridge's cross-section.

## Doing the calculation reliably

The steps are simple geometry, but there are many of them, repeated for many points, vehicles and locations, and a single sign error or a forgotten step can put a structure inside the envelope. Engineers use spreadsheets, purpose-written programs or clearance software that holds the vehicle outlines and the standard's allowances, and draws the envelope against the surveyed structure. Whatever tool is used, it is checked: by repeating a known case, such as a straight-track result the standard publishes, and by hand-checking one point at each new location, as the running case's engineers did for the inner roof corner above.

## What the envelope assumes about maintenance

Every allowance in the envelope is a promise about maintenance. The 35 mm of track movement on curves assumes the track is kept within that distance of its design position; the 15 mm of rail wear assumes rails are replaced before they wear further; the 2 degree roll assumes vehicles' suspensions are maintained and the track kept to the condition assumed. If any of these is exceeded, the envelope is no longer valid at that place. That is the link between clearance design and the track and rolling stock maintenance standards: the envelope is only true while they are met.

## Where the roll centre is

The body roll is a rotation about the vehicle's roll centre, a point usually somewhere between the axle and the body's floor, set by the suspension's design. The height assumed for it changes the result: a roll centre assumed low makes the roll move high points further, and a high roll centre moves them less while pushing low points outward on the other side. BDS 13 turned each half of the outline about the vehicle's pivot point through the largest body roll it assumed. Vehicle makers can supply the roll centre height for their designs; for a corridor-wide envelope, the standard's assumption is used. The running case's figure of 1,100 mm above rail is an assumption for teaching, and changing it to 900 mm would move the roof corner about 7 mm further.

## The envelope is not the clearance

BDS 13 stated plainly that the envelope it calculated contains no margin at all for structures or for trains passing on the next track. The envelope is the limit of the moving vehicle, not the line a structure may touch. Chapter 6 adds the margin and service space.

## A failure: the missing roll

This is an illustration. A design check for a new walkway beside a curved track built up the envelope from the vehicle outline, the throw, the cant and the track tolerances, but left out the body roll, because the checker assumed it was included in the cant. The walkway's handrail, at about 1,300 mm above rail, was found in review to be about 60 mm inside the true envelope on the inside of the curve.

The roll on the suspension is separate from the tilt of the track and must be applied after it. The walkway was redesigned, and the firm's calculation template now lists each allowance in order, with a tick box, so that none can be left out.

## Exercise: the corner on straight track

On straight, level track, with no cant and no throw, a vehicle's top corner is 1,500 mm from the centreline and 4,000 mm above rail. Apply the allowances in order: 10 mm cant variation (rotating about the low rail), 25 mm track movement, 75 mm wear and play, 2 degrees of roll about a roll centre 1,100 mm above rail, and 50 mm bounce. How far from the centreline can the corner reach, and what does the result suggest about straight-track clearances?

The 10 mm cant variation tilts the corner about 4,000 × 10 ÷ 1,500 ≈ **27 mm** inward. The track movement adds **25 mm** and the wear and play **75 mm**, bringing the corner to about 1,627 mm. The roll of 2 degrees about a point 2,900 mm below the corner moves it about 2,900 × tan 2° ≈ **100 mm** further, to about **1,727 mm** from the centreline; the bounce lifts it 50 mm without moving it sideways.

This is an illustration. Adding a 200 mm safety margin gives about 1,927 mm, close to the NSW straight-track minimum of 2,060 mm quoted in Chapter 6, which also allowed for the outlines' shapes and for rounding. Even on straight track, the moving vehicle needs over 200 mm more room than its static outline.
