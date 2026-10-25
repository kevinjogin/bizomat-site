---
book: railway-clearances-by-the-numbers
chapterSlug: centre-and-end-throw
order: 3
title: "Curves: centre throw and end throw"
description: "Derive how far a vehicle's middle swings inside a curve and its ends swing outside, calculate centre and end throw for the running case, and see how throw changes near the ends of curves."
draft: false
---

A rail vehicle is straight; the track it runs on, on a curve, is not. The vehicle rides on two bogies, each of which follows the track, so the body forms a straight chord across the curve between them. The middle of the body therefore lies inside the curve, closer to its centre than the track centreline, and the ends of the body, beyond the bogies, swing outside it. These two effects, centre throw and end throw, are pure geometry, and they can be calculated exactly from the vehicle's dimensions and the curve's radius. On sharp curves they add tens of millimetres to the space a vehicle needs, on the inside and the outside of the curve.

This chapter derives centre and end throw, calculates them for the running case's design vehicle on the 400 m curve under the new overbridge, shows how they grow on sharper curves, and explains how they change near the ends of curves, where most clearance errors involving throw occur.

## The geometry of a chord

The key result is the versine, or mid-ordinate, of a chord: the distance from the middle of a straight chord to the arc of the circle it spans. For a chord of length c on a circle of radius R, the versine is very nearly c² ÷ 8R, as long as the chord is short compared with the radius, which is always true for rail vehicles. The exact value is R minus the square root of R² − (c ÷ 2)², but for a 12.5 m chord on a 400 m curve the two agree to within a hundredth of a millimetre.

Railway surveyors use the same result to check curves: the versine on a chord of fixed length is proportional to the curvature, so measuring versines along a curve shows whether its radius is even. Railway Track Geometry by the Numbers uses versines for setting out and checking curves.

## Centre throw

The vehicle's bogie centres lie on the track centreline, and the body is a straight line between them. Its middle is therefore at the middle of a chord whose length is the bogie centres, and it lies inside the track centreline by the versine of that chord.

```figure
type: formula
title: Centre throw of the running case's design vehicle on the 400 m curve
formula: centre throw = (bogie centres)² ÷ (8 × radius)
caption: This is an illustration for the design vehicle of Chapter 2, with bogie centres of 12,500 mm, on a 400 m radius curve, 400,000 mm. ARTC BDS 13 (2005) gives the same relation for centre throw.
- Bogie centres | 12,500 mm
- Radius | 400,000 mm
step: centre throw = 12,500² ÷ (8 × 400,000)
step: centre throw = 156,250,000 ÷ 3,200,000 ≈ 48.8 mm
step: the middle of the body sits about 49 mm inside the track centreline
```

On the inside of the curve, a structure must clear the body's middle, which is about 49 mm closer to it than on straight track. The effect is on the inside of the curve: a pier on the inside of the 400 m curve under the overbridge must allow for it.

## End throw

Beyond the bogies, the body's ends extend along the straight line of the chord, and the track curves away beneath them. The end of the body lies outside the track centreline. Treating the whole body length as a chord, the track centreline lies inside the body's line at the body's middle by L² ÷ 8R, where L is the length over body; since the body's middle is already inside the centreline by the centre throw, the ends lie outside the centreline by the difference.

```figure
type: formula
title: End throw of the design vehicle on the 400 m curve
formula: end throw = (length over body² − bogie centres²) ÷ (8 × radius)
caption: This is an illustration for the design vehicle, 17,000 mm over body with bogie centres of 12,500 mm, on the 400 m curve. A small further allowance for the corner of a wide body is sometimes added; the governing standard states whether it applies.
- Length over body | 17,000 mm
- Bogie centres | 12,500 mm
step: end throw = (17,000² − 12,500²) ÷ 3,200,000
step: end throw = (289,000,000 − 156,250,000) ÷ 3,200,000 ≈ 41.5 mm
step: the ends of the body swing about 41 mm outside the track centreline
```

On the outside of the curve, the ends of the body come about 41 mm closer to a structure than they would on straight track. For this vehicle, centre throw and end throw are of similar size; for a vehicle with long overhangs beyond its bogies, end throw can exceed centre throw, and for one with bogies near its ends, centre throw dominates.

## Sharper curves, larger throws

Both throws are inversely proportional to radius: halve the radius and the throws double.

```figure
type: bars
title: Centre throw of the design vehicle by curve radius
unit: mm inside the track centreline
max: 80
caption: This is an illustration for bogie centres of 12,500 mm, from the formula above. End throw for the same vehicle is about 85% of these values.
- 250 m | 78.1
- 300 m | 65.1
- *400 m | 48.8
- 600 m | 32.6
- 1,000 m | 19.5
- 2,000 m | 9.8
```

On a 2,000 m curve, the throw is under 10 mm and barely matters; on a 250 m curve, nearly 80 mm, a large share of a 200 mm safety margin. That is why clearances on sharp curves, in yards, sidings and old lines laid out with tight curves, need particular care, and why structure gauges specify an increase in lateral clearance on curves.

## Simplified rules in the standards

Because throw depends on the vehicle, a structure gauge that is to cover every vehicle on a corridor must use the critical one, or a rule that covers them all. ARTC's Structure Gauge 1994, BDS 12, gave simplified expressions for the combined throw allowance, which it called the M value, for each of its rolling stock outlines, as a constant divided by the radius, and directed that the allowance be made on curves. Rules of that kind are convenient for design, but they are only as good as the assumption about the critical vehicle behind them; a new vehicle with longer bogie centres than any assumed could exceed them, which is why vehicles are checked against corridor requirements when they are registered.

## Near the ends of curves

On a long, uniform curve, the throws are steady. Near the ends of a curve, where the track changes from straight to curved, they are not. A vehicle half on the straight and half on the curve has its body at an angle to the track that the simple formulas do not describe, and its end can swing out on the straight approaching the curve, before the track itself has started to curve. A transition curve, in which the curvature increases gradually, spreads the change out, but the throws still vary along it.

ARTC's Structure Gauge 1994 recognised this: it required an allowance for throw where structures stood on transitions, or on straights within 22 m of a tangent point, the point where the curve begins, and the lateral clearance was less than 3.0 m. In practice, a structure near the end of a curve is checked as if it were on the curve, or the vehicle's position is modelled along the track, rather than assuming the straight-track clearance applies.

## Inside and outside

Centre throw acts on the inside of the curve, end throw on the outside. A structure on the inside of a curve is approached by the body's middle; one on the outside by its ends. On a double track, the vehicle on the outer track throws its middle towards the inner track, and the vehicle on the inner track throws its ends towards the outer track, so the throws of both vehicles add between the tracks. Chapter 7 deals with that when it calculates track centres on curves.

## Throw and cant together

On a canted curve, the vehicle is also tilted, and the throw is measured along the tilted plane of the track, not horizontally. ARTC's kinematic envelope procedure applies the throw along the plane of the toleranced cant, after the vehicle has been rotated by the cant. The difference is small for the throw itself, but the tilt has its own large effect on clearance, especially high on the vehicle, which Chapter 4 calculates.

## Turnouts and reverse curves

Turnouts are short, sharp curves, often of a few hundred metres radius or less, without cant and frequently without transitions. A long vehicle passing through a turnout swings its middle and ends by large amounts, and because the curve is short, the vehicle may be partly on the curve and partly on the straight at once, which makes the swing irregular. Structures beside turnouts, such as signal posts, point machines' covers and walkways, are checked with care, and BDS 12 required greater clearances to structures beside sidings within 22 m of curves or turnouts. Reverse curves, where a curve to one side is followed directly by a curve to the other, are similar: the vehicle's body swings one way and then the other, and at the point of reversal its ends can be thrown out on both sides.

## Vertical curves

A vehicle on a vertical curve, at the crest of a hill or the bottom of a dip, has the same chord effect in the vertical plane: on a crest, the middle of the body sits above the track's curve and the ends dip towards it; in a sag, the middle dips and the ends rise. Vertical curves on main lines have very large radii, so the effect is small. ARTC's Transit Space Standards, BDS 11, put the largest effect of vertical curvature at about 20 mm and left it out in deriving its transit space. They can matter for very long vehicles under low structures at the bottom of a sag, or for loading chutes at the crest of a hump.

## The width of the body

The simple formulas treat the vehicle as a line. A real body has width, and on a curve its inside corner at the middle and outside corners at the ends are slightly further from the centreline than the formulas suggest, because the body is rotated relative to the track's tangent. The effect grows with the body's width and length and the sharpness of the curve, but for main line curves it is a few millimetres at most. Some standards include a term for it in their end throw expression; the governing standard says whether it applies.

## How large a share of the margin

Throws are worth putting in proportion. On the running case's 400 m curve, a vehicle with a centre throw of about 64 mm, like the passenger car the consultancy meets below, uses about a third of a 200 mm safety margin. If it were left out of the calculation, the structure would be built a third of the way into the margin before any other error, which is why throw is never left out on curves of any significance.

## The running case: the pier on the inside

This is an illustration. The overbridge's piers stand on either side of the track. One is on the inside of the 400 m curve, the other on the outside. The consultancy's engineers calculated centre throw of about 49 mm for the inside pier and end throw of about 41 mm for the outside pier, using the design vehicle. They then checked with the infrastructure manager whether any vehicle on the corridor had longer bogie centres or overhangs than the design vehicle, and were told that a passenger car of 20 m length with bogie centres of 14.3 m used the line occasionally. Its centre throw on the 400 m curve, 14,300² ÷ 3,200,000, is about 64 mm, larger than the freight vehicle's, so the passenger car became the critical vehicle for the inside pier.

## Measuring throw on the ground

Throw can also be checked directly. A vehicle standing on the curve can be measured from the track centreline at its middle and at its ends, using offsets from survey marks or a gauge; the difference from its straight-track half-width is the throw. Such checks are used to confirm calculations for unusual vehicles and loads, and to investigate strikes. For loads, the load's own length and position on its wagon determine its throw, which can be quite different from the wagon's.

## A failure: the straight-track clearance

This is an illustration. A signal mast was installed beside the outer rail of a 300 m curve near a yard, at the clearance specified for straight track, because the design drawing showed the track as straight at the mast, which stood about 15 m beyond the end of the curve. Long wagons leaving the curve swung their ends out over the straight and struck the mast's ladder cage.

The end throw of a long vehicle near the end of a curve reaches beyond the tangent point. The mast was moved, and the designer's office added a rule to check any structure within 22 m of a curve's end as if it were on the curve, following the practice in the standard it worked to.

## Exercise: centre and end throw for two wagons

Using the wagons from Chapter 2's exercise on a 300 m curve: wagon A is 15.0 m over body with bogie centres of 10.5 m; wagon B is 18.0 m over body with bogie centres of 13.0 m. Calculate each wagon's centre throw and end throw. Which is the critical vehicle for a structure on the inside of the curve, and which for the outside?

For a 300 m radius, 8R = 2,400,000 mm. Wagon A: centre throw = 10,500² ÷ 2,400,000 ≈ **45.9 mm**; end throw = (15,000² − 10,500²) ÷ 2,400,000 ≈ **47.8 mm**. Wagon B: centre throw = 13,000² ÷ 2,400,000 ≈ **70.4 mm**; end throw = (18,000² − 13,000²) ÷ 2,400,000 ≈ **64.6 mm**.

**Wagon B** is critical on both sides, with about 70 mm inside and 65 mm outside. Wagon A's end throw slightly exceeds its centre throw because of its relatively long overhangs. This is an illustration; real checks use every vehicle approved for the corridor, and the governing standard's rules for throw near transitions.
