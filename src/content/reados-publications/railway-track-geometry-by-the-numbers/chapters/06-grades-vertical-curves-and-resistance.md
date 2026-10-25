---
book: railway-track-geometry-by-the-numbers
chapterSlug: grades-vertical-curves-and-resistance
order: 6
title: "Grades, vertical curves and train resistance"
description: "Calculate the resistance grades and curves add to a heavy train, see why loading facilities prefer a gentle rising grade, size vertical curves, and check the drawbar force through the loader."
draft: false
---

Railways climb hills reluctantly. A steel wheel on a steel rail rolls with very little resistance on the level, which is why a single locomotive can haul thousands of tonnes, but even a gentle grade adds a resistance many times the rolling resistance, and a curve adds more. A grade that a road vehicle would hardly notice can halve the load a train can haul or double the power it needs. Grades therefore shape where railways go, how long their trains can be, and how loading facilities are laid out, and where the grade changes, a vertical curve must ease the change so that trains and their couplings are not jolted.

This chapter calculates the resistance of grades and curves for the running case's grain train, explains why loading facilities are laid out on a gentle rising grade, sizes vertical curves from the vertical acceleration they produce, and checks the force the locomotives must exert as the train is loaded.

## Grade resistance

On a grade, part of the train's weight acts down the slope. For the small grades railways use, the resistance is very nearly the weight multiplied by the grade, expressed as a fraction. Railway grades are usually given as 1 in N, meaning a rise of 1 m in N metres along the track, or as a percentage.

```figure
type: formula
title: Resistance of the running case's grain train on the loading grade
formula: grade resistance per tonne = 1,000 × g ÷ N for a grade of 1 in N
caption: This is an illustration for a fully loaded grain train of about 4,000 tonnes of wagons on a rising grade of 1 in 300, the ideal loading grade stated in ARTC TDS 15 (2005), with an assumed rolling resistance of about 15 N per tonne at loading speed. The locomotives' own resistance is not included.
- Grade | 1 in 300
- Loaded wagons | about 4,000 t
- Assumed rolling resistance | about 15 N per tonne
step: grade resistance ≈ 1,000 × 9.81 ÷ 300 ≈ 32.7 N per tonne
step: total ≈ 32.7 + 15 ≈ 47.7 N per tonne
step: for 4,000 t, about 190.8 kN of drawbar pull to keep the loaded train moving up the grade
```

A grade of 1 in 300 more than triples the train's resistance compared with level track, and a grade of 1 in 100, common on country lines, more than seven times it: about 4,000 × (98.1 + 15) ÷ 1,000 ≈ 452 kN. That is why ruling grades, the steepest grades on a route, decide the maximum train weight for each locomotive, and why easing a single steep grade can raise the capacity of a whole line.

## Curve resistance

A train on a curve also resists more than on a straight, because its wheels slip slightly on the rails as they steer round, and its flanges rub. Curve resistance is usually estimated with empirical rules. One used in North American practice treats each degree of curvature, measured on a 100-foot chord, as equivalent to a grade of about 0.04%. For the running case's 250 m loop, a radius of about 7 such degrees, that rule gives an equivalent grade of about 0.28%, a resistance of about 27 N per tonne, almost as much as the loading grade itself.

```figure
type: bars
title: Resistance components for the loaded grain train
unit: N per tonne
max: 100
caption: This is an illustration: assumed rolling resistance at low speed, the 1 in 300 loading grade, the curve resistance of the 250 m loop by the rule of thumb above, and, for comparison, a 1 in 100 grade. Real values come from train performance data and simulation.
- Rolling, low speed | 15
- Curve, 250 m loop | 27
- *Grade, 1 in 300 | 33
- Grade, 1 in 100, for comparison | 98
```

When a grade and a curve coincide, their resistances add, so designers compensate grades on curves: they ease the grade through the curve so that the total resistance is no more than the ruling grade's. A heavy train starting on a curved grade is the most demanding case, because starting resistance is also higher than running resistance.

## Why load on a rising grade

ARTC's NSW standard for unit train loading facilities, TDS 15, said that trains are usually loaded while moving uphill, and that the best arrangement is an unbroken 1 in 300 climb extending one train length before and one train length beyond the loader, while adding that each case would be evaluated individually.

The reasons are practical. A train loaded while moving slowly and steadily under the chute must keep exactly the right speed, so that each wagon is filled to the right level. On a gentle rising grade, the locomotives are always pulling, the couplings between wagons stay stretched, and the train responds smoothly to the driver's control; on a falling grade, the train would tend to run away and need braking, with the couplings bunching and stretching, and on level track the balance changes as the wagons fill. A constant grade means the force needed changes only as the load grows, not as the grade changes under the train.

## The drawbar force through the loader

As the train passes under the loader, the wagons in front of the chute are loaded and those behind are empty, so the train's weight grows steadily, and the locomotives' pull must grow with it. The worst case is near the end of loading, when almost every wagon is full, the whole train is on the rising grade, and part of it may be on the loop's curve.

TDS 15 asked for the preliminary design of a loading facility to be submitted with its horizontal alignment and longitudinal section, ideally with a computer simulation of a train passing through the loader relating the locomotives' drawbar force to the resistances of the loaded and empty vehicles on the grades and curves, to identify excessive drawbar loads and difficulty in keeping a constant loading speed. A simple estimate shows why. With the whole loaded train on the 1 in 300 grade, the resistance is about 191 kN; if half the train were also on the 250 m curve, the curve would add about 27 N per tonne for 2,000 t, about 55 kN, and if the whole train were on the curve, about 110 kN, bringing the total to about 300 kN.

## Starting a train

Starting a heavy train needs more force than keeping it moving, because the wheels' bearings, the wheel-rail contact and the train's inertia all resist at first, and because the locomotives must accelerate the train as well as overcome its resistance. Most locomotives can exert their highest tractive effort at very low speed, but adhesion between their wheels and the rails limits how much they can use, especially on wet or contaminated rail. A train that must stop and restart on the loading grade, after an interruption to loading, is the case that tests the layout hardest. The cooperative's simulation included a stop and restart with the train fully loaded on the 1 in 300 grade, which confirmed that the locomotives could restart it within their adhesion limit on dry rail, with sanding available for wet conditions.

## Vertical curves

Where the grade changes, a vertical curve joins the two grades smoothly. A vehicle passing over a crest is lightened slightly by the vertical acceleration, and in a sag it is pressed down; if the change is sudden, couplings are jolted, wagons with long overhangs can ground at their ends, and passengers feel a bump. The vertical curve's radius is chosen so that the vertical acceleration at the line's speed stays below a limit.

```figure
type: formula
title: Vertical curve for a change of grade on the main line
formula: vertical curve radius = speed² ÷ allowed vertical acceleration; length ≈ radius × change of grade
caption: This is an illustration with an assumed allowed vertical acceleration of 0.3 m/s², for teaching, a speed of 115 km/h and a change of grade of 1%, from 0.5% rising to 0.5% falling. Real limits come from the governing standard.
- Speed | 115 km/h ≈ 31.9 m/s
- Allowed vertical acceleration, assumed | 0.3 m/s²
- Change of grade | 0.01
step: radius ≈ 31.9² ÷ 0.3 ≈ 3,400 m
step: length ≈ 3,400 × 0.01 ≈ 34 m
step: in the slow-speed loop, the same acceleration would allow a radius of only about 160 m at 25 km/h, though vehicle geometry sets a larger minimum
```

On slow tracks such as the loop, the comfort criterion gives very small radii, and the governing limit becomes the vehicles themselves: long wagons and couplers can only accommodate so much change of grade between adjacent vehicles, and very sharp sags or humps can cause couplers to slip past each other or wagon ends to ground. The infrastructure manager's standards set minimum vertical curve lengths for sidings as well as main lines.

## Grades in sidings and loops

Sidings where wagons stand, such as storage roads and loops where trains wait, are kept level or very gently graded, because a wagon left on a grade can run away if its brakes leak off. The running case's loop has a gentle rising grade through the loading bin for the reasons above, and level or near-level track where trains may stand waiting to load or to leave. Catchpoints, covered in Chapter 7, protect the main line from any vehicle that does run away.

## Ruling grades and train length

The ruling grade of a route, its steepest sustained climb, decides how heavy a train each locomotive can haul, and therefore how long trains can be and how many locomotives they need. A locomotive able to exert, say, 300 kN of continuous tractive effort at low speed could keep about 300,000 ÷ 47.7 ≈ 6,300 t moving on a 1 in 300 grade with the rolling resistance assumed above, but only about 300,000 ÷ 113 ≈ 2,650 t on a 1 in 100 grade. This is an illustration with assumed values. For a grain cooperative, the ruling grade on the route to port decides how many locomotives each train needs, which is a large part of the freight cost, and is why the cooperative's engineers were interested in the main line's grades as well as their own.

## Braking on falling grades

Trains descending grades must be held by their brakes, and heavy trains on long descents can overheat their brakes or run away if the brakes are misused. The steepness and length of falling grades decide the braking methods trains must use and, for heavy trains, sometimes their maximum speed on the descent. In loops and sidings, falling grades towards the main line are avoided or protected, because a runaway wagon rolling onto the main line is one of the most dangerous events a siding can produce.

## Grades and drainage

Grades also drain the track. Perfectly level track in a cutting can hold water, softening the formation, so even sidings that must be level for standing wagons are usually given a very small fall in their drains, or a gentle grade along the track where standing is not an issue. The drainage design is part of the longitudinal section, and low points of the track profile, where water collects, are placed where it can be carried away.

## The junction's level

Turnouts need a constant grade through their length, because their switch and crossing must sit in one plane; a vertical curve within a turnout twists its geometry. The running case's junction turnout was therefore placed on a uniform grade, with the vertical curves of the loop's approach beyond its ends. Where the loop's track rises from the junction towards the loading straight, the vertical curve begins clear of the turnout's last long timber.

## Measuring grades

Grades are surveyed as the levels of the rail tops at regular intervals, from which the grades and vertical curves are calculated and compared with the design. On new track, the levels at survey points are checked against the design within tolerances set by the construction standard, as Chapter 9 explains. On existing track, recording vehicles measure the short-wave unevenness of the rails, the top, but not the long-wave grade, which must be surveyed.

## The running case: the loop's longitudinal section

This is an illustration. The cooperative's engineers drew the loop's longitudinal section with the loading straight on a constant 1 in 300 rising grade extending a train length, about 720 m, before and after the bin, so that the whole train was on the same grade throughout loading. That set the loop's elevations around its circuit: the loop climbed through the bin and descended, at a similar gentle grade, round the far side back to the junction. With the loop's curve compensated so that the combined grade and curve resistance never exceeded that of the loading grade by much, the simulation the infrastructure manager asked for showed a maximum drawbar force within the locomotives' ability to hold a steady speed of 1 km/h or so under the chute.

## A failure: the dip under the bin

This is an illustration. At another facility, the track under a loading bin had settled into a shallow sag about 30 mm deep over 40 m, from poor formation compaction. As each loaded wagon entered the sag and climbed out of it, the train's resistance changed, and the driver struggled to hold a steady speed; wagons were filled unevenly, some overfilled and spilling grain onto the track, which fouled the ballast and made the sag worse.

The formation was rebuilt and the track relaid to a constant grade, and loading became steady. The geometry under a loader must be held to a constant grade as tightly as a main line's, because the loading process depends on it. A level survey of the loading straight every few months now catches any new sag early.

## Exercise: resistance on a steeper grade

A 3,500 t train of loaded wagons climbs a 1 in 150 grade at low speed, with an assumed rolling resistance of 15 N per tonne. What is the grade resistance per tonne and the total resistance? If 1,000 t of the train is also on a curve adding about 20 N per tonne, what is the total?

The grade resistance is about 1,000 × 9.81 ÷ 150 ≈ **65.4 N per tonne**, so with rolling resistance the total is about 80.4 N per tonne, and for 3,500 t about **281 kN**.

The curve adds about 1,000 × 20 ÷ 1,000 = **20 kN**, bringing the total to about **301 kN**. This is an illustration with assumed resistances; real train performance comes from locomotive and wagon data and simulation, but the arithmetic shows how quickly grades and curves add to a heavy train's resistance.
