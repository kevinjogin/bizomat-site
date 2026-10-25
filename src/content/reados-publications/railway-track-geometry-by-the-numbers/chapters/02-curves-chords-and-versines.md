---
book: railway-track-geometry-by-the-numbers
chapterSlug: curves-chords-and-versines
order: 2
title: "Curves, chords and versines"
description: "Describe a curve by its radius and by the versine on a fixed chord, convert between them, set out a curve with deflection angles, and see how a few millimetres of versine change the radius."
draft: false
---

A railway curve is, in design, a circular arc of a stated radius, joined to the straights on either side by transition curves. On the ground, nobody can measure a radius of 800 m directly: its centre is in a paddock somewhere, nearly a kilometre away. What track people measure instead is the versine, the offset from the middle of a straight chord to the rail, and the versine on a chord of fixed length tells the curve's radius as surely as the radius itself. Versines are how curves are set out, checked, corrected and recorded, by surveyors, track gangs, tamping machines and recording vehicles alike, and understanding them is the first practical skill of track geometry, whether the track is a heavy-haul main line or a short siding behind a grain bin.

This chapter explains how a curve is described by radius and by versine, converts between them for a 20 m chord, shows how a few millimetres of versine change the radius, sets out a curve with deflection angles, and introduces the curves of the running case's balloon loop and the main line beside it.

## Radius and curvature

The radius of a curve is the radius of the circle its arc belongs to. A smaller radius means a sharper curve, and a larger one a gentler curve. Curvature is simply the reciprocal of radius, and it is often the more useful quantity, because the forces on a train, the cant needed and the versine on a chord are all proportional to curvature. A curve of 400 m radius has twice the curvature of one of 800 m, needs twice the cant for the same speed, and has twice the versine on the same chord.

Main lines are built with large radii where the country allows, because sharp curves limit speed, wear rails and wheels, and resist trains. Sidings, yards and loops can use much sharper curves, because trains in them run slowly. The running case's main line is on an 800 m curve near the junction; its balloon loop uses a 250 m radius, above the 200 m minimum that ARTC's 2005 NSW standard for loading facilities, TDS 15, set for balloon loops.

## The versine on a chord

Stretch a string between two points on the inside face of a curved rail, and the rail at the middle of the string bulges away from it by a distance called the versine, or mid-ordinate. For a chord of length c on a curve of radius R, the versine is very nearly c² ÷ 8R. For a 20 m chord, measured in millimetres with the radius in metres, that is 50,000 ÷ R.

```figure
type: formula
title: Versine on a 20 m chord for the running case's two curves
formula: versine = chord² ÷ (8 × radius)
caption: This is an illustration. With the chord in metres and the radius in metres, multiply by 1,000 to give millimetres; for a 20 m chord this simplifies to 50,000 ÷ radius in metres.
- Chord | 20 m
- Main line | 800 m radius
- Balloon loop | 250 m radius
step: main line versine = 20² ÷ (8 × 800) × 1,000 = 62.5 mm
step: loop versine = 20² ÷ (8 × 250) × 1,000 = 200 mm
step: the exact versine for the loop is 200.08 mm; the approximation is good to a tenth of a millimetre
```

```figure
type: bars
title: Versine on a 20 m chord by curve radius
unit: mm at the middle of the chord
max: 210
caption: This is an illustration from the formula above. Versine is proportional to curvature, so halving the radius doubles the versine.
- 250 m | 200
- 300 m | 166.7
- 400 m | 125
- 600 m | 83.3
- *800 m | 62.5
- 2,000 m | 25
```

The relation works equally well in both directions. A track worker who measures a versine of 62 mm on a 20 m chord knows the curve's radius there is about 50,000 ÷ 62 ≈ 806 m. A string and a ruler, or a trolley that measures versines automatically, turn a curve's invisible radius into a number that can be checked anywhere along it.

## Small versine errors, large radius changes

Because the versine on a main line curve is small, a few millimetres of error in it corresponds to a large change in radius. On the 800 m main line curve, the design versine on a 20 m chord is 62.5 mm. If one chord measures 66.5 mm and the next 58.5 mm, a difference of only 4 mm either way, the local radius varies from about 752 m to about 855 m. A train passing feels that variation as changes in lateral acceleration, a lurch, and the wheels and rails feel it as uneven curving forces that wear them faster.

That is why alignment tolerances for new track are expressed as versines. ARTC's NSW Track Standards Construction, TCS 01, in its 2005 issue, specified the alignment of new main line track as the mid-ordinate on a 20 m chord, measured with overlapping chords, with a tolerance of ±4 mm, and Chapter 9 returns to the construction tolerances.

## Overlapping chords

Versines are measured at regular intervals along a curve, with each chord overlapping the last, so that every part of the rail is measured. TCS 01 specified 20 m chords with a 5 m overlap. A regular spacing makes the versines easy to compare: on a perfect circular curve, every versine is the same; on a transition, they increase steadily from zero to the circular curve's value; and on a poorly aligned curve, they jump about. Plotting the versines along the curve shows its quality at a glance.

## Setting out a curve with deflection angles

A new curve is set out from its tangent point, where it leaves the straight, by turning angles from the straight and measuring chords. For a chord of length c on a curve of radius R, the angle between the tangent and the chord, the deflection angle, is c ÷ 2R in radians for the first chord, and each subsequent chord adds c ÷ R to the total deflection from the original tangent.

```figure
type: steps
title: Setting out a circular curve by deflection angles and chords
caption: General surveying practice for teaching. Modern set-out usually uses coordinates computed from the design and set out with a total station or GNSS, but the geometry is the same.
- Locate the tangent point | where the straight ends and the curve begins, from the design
- Set the instrument | on the tangent point, sighted along the straight
- Turn the first deflection | c ÷ 2R from the tangent for the first chord
- *Measure the chord | lay off the chord length to the angle; mark the point
- Continue | add c ÷ 2R for each further chord; mark each point
- Close | check that the last point meets the design curve-to-straight point
```

For the balloon loop's 250 m curve and 20 m chords, each chord's deflection is 20 ÷ 500 = 0.04 radians, about 2.29 degrees. For the main line's 800 m curve, it is 20 ÷ 1,600 = 0.0125 radians, about 0.72 degrees. Today, curves are usually set out by coordinates calculated from the design and placed with a total station or satellite positioning, but the same geometry underlies the coordinates, and versines remain the check.

## Realigning a curve

Curves that have drifted out of line are realigned by measuring the versines along them, calculating the movements needed to make the versines even, or to match the design, and moving the track sideways by those amounts. Methods that calculate the movements from versines alone, without surveying the whole curve, have long been used by track gangs, and tamping machines now carry measuring systems that do it continuously. The constraint is usually that some points cannot move, such as at bridges, platforms, turnouts and structures with tight clearances, and the realignment must fit around them.

## Choosing a radius

The radius of a curve is usually forced on the designer by the country, the land available and the points the line must pass through, but within those limits, larger is almost always better. A larger radius allows higher speed for the same cant, needs less cant for the same speed, wears rails and wheels less, resists trains less, and is easier to maintain. Every halving of radius doubles the versine, the cant needed and the curving forces. For the main line, the infrastructure manager's design standards set minimum radii for each speed; for sidings and loops, the minimum is set by the vehicles' ability to negotiate the curve, the wear that tight curves cause, and the standard for the facility, such as the 200 m minimum TDS 15 set for balloon loops.

## Compound and reverse curves

Not every curve is a single radius. A compound curve joins two arcs of different radii curving the same way, and a reverse curve joins arcs curving opposite ways. Both are sometimes unavoidable, but the change of curvature at the junction is felt by trains as a jolt unless a transition is inserted between the arcs, and reverse curves need a length of straight or a double transition between them so that a long vehicle is not on both arcs at once. Versines show these curves clearly: a step in the versines marks a compound junction, and versines passing through zero and changing sign mark a reversal.

## Measuring versines in practice

Versines can be measured with a string line stretched between marks on the rail and a steel ruler at the middle, which is cheap and still used for checks and small jobs, though wind and the string's sag limit its accuracy. Track trolleys pushed along the rail measure versines continuously with a fixed-length frame, and track recording vehicles measure alignment at line speed over the whole network. Tamping machines measure versines as they work and correct the alignment to a target. Whatever the method, the chord length must be stated, because a versine means nothing without it: the same curve has a versine of 62.5 mm on a 20 m chord and about 15.6 mm on a 10 m chord, since halving the chord quarters the versine.

## Old units, same geometry

Older Australian track was designed in imperial units, with curves described by their radius in chains, a chain being 66 feet or about 20.1 m, and versines measured in inches on a chord of one chain or similar. Many old plans and some old track records still use those units. A 40-chain curve, for example, has a radius of about 805 m. The geometry is identical; only the numbers change, and converting old records carefully before comparing them with new measurements avoids confusing errors.

## Curve length and the train

A curve's length matters as well as its radius. A curve shorter than a train means the train is partly on the curve and partly on the straights, and the forces in its couplers change as it enters and leaves; a curve long enough to hold the whole train, as in a balloon loop, means every wagon is curving together and the locomotive must pull the whole train round. For a curve of radius R turning through an angle θ in radians, the length is R × θ. The running case's loop turns through a full circle, 2π radians, and is about 1,571 m long, so a 720 m train is wholly on the curve, and the resistance of curving acts on every wagon at once, which Chapter 6 calculates.

## Curves and clearances

Curves affect the space trains need: a vehicle's middle swings inside a curve and its ends outside, by amounts that depend on the radius, as Railway Clearances by the Numbers explains. A geometry designer who sharpens a curve, or a maintainer who lets it drift, changes the clearances to every structure beside it. That is another reason curves are held to their design radius and position.

## The running case: the loop's curves

This is an illustration. The cooperative's balloon loop turns its trains through a full circle, plus the angles needed to leave and rejoin the main line. At 250 m radius, a full circle of track is 2π × 250 ≈ 1,571 m long, which comfortably holds a 40-wagon grain train of about 720 m with its locomotives, so the train is entirely within the loop while loading. The engineers set the loop's curve out at 20 m chords with deflections of 2.29 degrees, checked the versines at 200 mm, and planned the loading bin on a straight inserted in the loop, as Chapter 8 explains, because the wagons must be on straight track while they are loaded.

## A failure: the hand-lined curve

This is an illustration. A siding curve at another site was relaid by a contractor who lined it by eye, without measuring versines. It looked smooth, but a versine survey before handover found versines on a 20 m chord ranging from 140 mm to 230 mm on a curve designed for 200 mm, meaning local radii from about 217 m to 357 m. Loaded wagons took the tight spots with a pronounced lurch and the flanges squealed.

The curve was realigned to even versines before the siding was accepted. The site's engineers added a versine survey at 20 m chords to every curve's acceptance check.

## Exercise: reading versines

Along a curve, versines on a 20 m chord read 98, 101, 100, 99 and 112 mm. What radius does the average of the first four indicate, and what local radius does the last reading indicate? If the curve's tolerance is ±4 mm on the versine, which readings are outside it?

The first four average (98 + 101 + 100 + 99) ÷ 4 = **99.5 mm**, a radius of about 50,000 ÷ 99.5 ≈ **503 m**, so the curve was presumably designed for 500 m, a versine of 100 mm. The last reading, 112 mm, indicates a local radius of about 50,000 ÷ 112 ≈ **446 m**.

Against a design versine of 100 mm and a tolerance of ±4 mm, the first four readings, 98 to 101 mm, are within it; the **112 mm** reading is 12 mm high and outside it. This is an illustration: the track at that point needs realigning to bring the versine back to about 100 mm.
