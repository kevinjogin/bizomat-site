---
book: railway-track-geometry-by-the-numbers
chapterSlug: building-to-tolerance
order: 9
title: "Building track to tolerance"
description: "Read the construction tolerances for gauge, alignment, cross level, twist and surface, calculate twist from cross level readings, and see why twist is the tolerance that derails wagons."
draft: false
---

A track design is a set of perfect curves, straights, cants and grades. The track built from it is not perfect, and cannot be: rails are laid by machines and people, ballast is tamped by machines that work to their own accuracy, and the ground moves. Construction tolerances say how far the built track may differ from the design and still be accepted. They are set tight enough that the new track rides well, wears evenly and holds its geometry long enough to justify the investment, and loose enough that it can be built at a sensible cost. Every new track is measured against them before it is handed over, every tolerance exceeded must be corrected and measured again, and the measurements become the first page of the track's geometry record, the baseline for the rest of its life.

This chapter explains the main geometry tolerances for new track, quoting the values given in ARTC's 2005 NSW Track Standards Construction, TCS 01, for teaching; calculates twist from cross level readings, which is the tolerance most directly linked to derailment; and checks the running case's new balloon loop against the standard that applies to sidings.

## The quantities measured

```figure
type: compare
title: Geometry quantities measured on new track
cols: What it is | Why it matters
caption: General description for teaching. The construction standard sets the tolerances for each quantity by class of line.
- Gauge | distance between the rails' inner faces | too narrow binds wheels; too wide lets them drop
- Alignment | the track's line in plan, as versines on a chord | uneven line gives lurches and uneven curving forces
- Cross level and cant | height difference across the track | must match the design cant on curves and be zero on straights
- *Twist | change of cross level along a short length | lifts a wheel off its rail; derails lightly loaded wagons
- Surface or top | unevenness of the rails' level along the track | dips and humps give vertical shocks and bounce
- Position | the track's line and level against survey marks | keeps clearances, platforms and drainage right
```

## Gauge

TCS 01 gave the nominal gauge for new main line track as 1,435 mm, with tolerances by class of line that allowed a few millimetres either way and limited the variation of gauge over 2 m, so that the gauge does not change abruptly. On main line curves between 160 m and 200 m radius, where approved, it required the gauge to be widened by 6 mm to 1,441 mm, and on turnouts it required the gauge to follow the turnout's basic design within ±2 mm. Gauge is measured with a calibrated track gauge at regular intervals along the track and wherever the track looks irregular, including at every weld and joint.

## Alignment

TCS 01 specified the alignment of new main line track on tangents and curves as the mid-ordinate on a 20 m chord, with 5 m overlap, within ±4 mm, as Chapter 2 described. On the 800 m main line curve, whose design versine is 62.5 mm, the measured versines must lie between about 58.5 and 66.5 mm. In addition, the standard set survey tolerances for the track's absolute position against the surveyed design, tighter at platforms and other places where the track's position matters most.

## Cross level and cant

On straight track, the two rails should be level with each other; on curves, the outer rail should stand above the inner by the design cant. TCS 01 allowed the superelevation and cross level of new main line track to vary from the design by ±5 mm. On the main line curve, with 110 mm of design cant, the measured cant must therefore lie between 105 and 115 mm; along the transition, between 5 mm either side of the cant that the design gives at that point.

## Twist

Twist is the change in cross level over a short, fixed length of track, usually measured over a length similar to a vehicle's bogie or wheelbase. A vehicle with a stiff frame cannot follow a sharp twist: three of its wheels stay on the rails and the fourth lifts, or is unloaded so much that its flange can climb the rail. Empty wagons, with stiff suspensions and light wheel loads, are the most vulnerable, which is why derailments from twist often happen to empty trains at low speed.

TCS 01 specified the rate of change of superelevation, the twist, measured over 3 m, as the design value within a tolerance of ±5 mm for the higher classes and up to ±7.5 mm for the lowest, never steeper than 1 in 300, and within the speed-band limits of the network's operating standards for track geometry.

```figure
type: formula
title: Twist from cross level readings at 3 m intervals on the main line transition
formula: twist over 3 m = change in cross level between readings 3 m apart; gradient = 3,000 ÷ twist, as 1 in N
caption: This is an illustration on the running case's 100 m transition, where the design cant rises 110 mm over 100 m, a design twist of about 3.3 mm per 3 m. The tolerance of design ±5 mm and the 1 in 300 maximum are the values given in ARTC TCS 01 (2005) for higher-class main line track.
- Cross level readings 3 m apart | 0, 4, 11, 14, 15 mm
- Design twist | about 3.3 mm per 3 m
- Allowed | 3.3 ± 5 mm, and no steeper than 1 in 300, which is 10 mm over 3 m
step: twists are 4, 7, 3 and 1 mm over each 3 m
step: the 7 mm reading is 3.7 mm above design, within ±5 mm, and a gradient of about 1 in 429, gentler than 1 in 300
step: all four are within tolerance; a twist of 9 mm would exceed design + 5 mm, although still gentler than 1 in 300
```

The twist tolerance is tied to the design twist: on straight track, where the design twist is zero, the tolerance is applied about zero; on transitions, about the designed rate of change of cant. An unintended twist added to a designed one is what makes twist faults on transitions dangerous, and why the absolute limit of 1 in 300 applies whatever the design.

## Surface

Surface, or top, is the smoothness of the rails' level along the length of the track. It is measured as the departure of the rail from a straight chord laid along it, at the chord's middle, on chords of two lengths: a long chord that picks up long, gentle dips and humps, and a short chord that picks up short, sharp ones. TCS 01 specified surface on a 20 m chord and a 6.5 m chord, with tolerances by class of line from 8 mm and 4 mm for the highest classes to 14 mm and 7 mm for the lowest.

```figure
type: bars
title: Surface tolerances for new main line track by class group, on a 20 m chord, as given in ARTC TCS 01
unit: mm, maximum departure at mid-chord
max: 16
caption: Values as given in ARTC TCS 01 (Issue 1, March 2005), for teaching; check currency with ARTC. The line classes are those of the NSW classification the standard referred to; the 6.5 m chord tolerances were about half these values.
- Highest class group | 8
- Second group | 10
- Third group | 12
- *Lowest group, including Class 3 | 14
```

## Sidings

TCS 01 required every siding, whatever its class, to meet its Class 3 main line standards before it could carry traffic. The running case's balloon loop is therefore checked against the Class 3 values: looser than the main line's highest classes, as suits slow trains, but still a definite standard. The loading straight, where the wagons must line up with the chute and the train must move at a steady crawl, the cooperative chose to build to tighter tolerances than the standard required, because the loading process depended on it.

## Construction method and tolerance

Achieving the tolerances starts with the construction method, long before anything is measured. Track is laid to survey pegs set out from the design, ballasted, and lifted and lined in several passes by tamping machines, each pass bringing it closer to the design, with the final pass after the ballast has been consolidated by traffic or by a dynamic stabiliser. Measuring after each pass shows whether the method is converging on the tolerances. A contractor that tamps once and measures at the end usually finds faults that need another pass anyway.

## Why tolerances differ by class

Tolerances are tighter on the busiest and fastest lines because the consequences of geometry faults grow with speed and tonnage. At high speed, a small dip or kink produces a large dynamic force and a rough ride; under heavy tonnage, a small fault grows quickly into a large one. A line built to tight tolerances starts its life further from the maintenance limits and takes longer to deteriorate to them, so the extra cost of building it accurately is repaid in maintenance saved. On slow, lightly used sidings, the same effort would buy little, so looser tolerances apply.

## Construction tolerances and maintenance limits

Construction tolerances are not the same as the limits at which existing track must be maintained. New track is built to tight tolerances; as it deteriorates in service, its geometry is allowed to worsen to maintenance limits, which are wider, before it must be corrected; and beyond those lie the limits at which speed restrictions or closure are imposed. TCS 01 referred to separate standards for the maintenance of track and for base operating limits of track geometry by speed band. A contractor building new track works to the construction tolerances, not the maintenance limits; track that just meets the maintenance limits on the day it opens has no life left before it needs work.

## Rail, sleepers and fastenings

Geometry tolerances assume the track's components are right. TCS 01 required new tracks to be built to the material standards of the NSW classification of lines: the right rail, sleepers, fastenings and ballast for the class. Gauge held by fastenings that are not fully installed, or alignment held by ballast shoulders that are not yet full, may measure correctly on the day and drift within weeks. The handover inspection of Chapter 10 therefore checks components as well as geometry: every fastening fitted and tight, every sleeper sound and square, ballast to profile.

## Welds and joints

Rail welds and any remaining joints are local points where surface faults start. A weld that is slightly high or low, or a joint with a gap or a step, gives a sharp vertical shock at every wheel, which loosens the ballast beneath and grows into a dip. New track's welds are checked for straightness along the rail with a short straight edge, and ground where needed, as part of building it to tolerance; it is far cheaper to correct a weld's profile before traffic than after the dip has formed.

## Recording what was built

Every measurement taken in building the track becomes part of its record: the gauge, cross level, twist, versines, surface and position at each point, the corrections made, and the final measurements. The record shows the track's condition at birth, against which every later measurement can be compared to see how fast it deteriorates, which is the subject of Chapter 10.

## Tolerance stack at the loading straight

The cooperative's tighter tolerance on the loading straight came from a simple stack-up. The chute is 1,600 mm wide at most, a wagon's opening is a little wider, and the chute must discharge into the middle of the opening on every wagon. The wagon's position under the chute depends on the track's alignment, its gauge and play, and the wagon's own centring on its bogies. If the track's alignment under the bin were allowed the full siding tolerance, the wagons' openings could wander sideways enough that grain spilled on one side. Holding the straight's versines and position to a few millimetres, on slab track, kept the wagons centred, and the spillage that had plagued the facility of Chapter 8's failure never started.

## The running case: checking the loop

This is an illustration. Before the cooperative's loop was offered for handover, its contractor measured gauge, cross level and twist at every 3 m along the loop with a manual track gauge, versines on 20 m overlapping chords on all curves and the loading straight, and surface on 20 m and 6.5 m chords, and surveyed the track's position against the design pegs. The measurements found two faults: a twist of 9 mm over 3 m near the bifurcation turnout, against the Class 3 tolerance, where a timber under the turnout had not been packed, and a 13 mm versine error on one chord of the loop's curve. Both were corrected and remeasured before the handover inspection.

## Measuring well

Measurements are only ever as good as the instruments and the people taking them. Track gauges are checked against a reference regularly; measurements are taken at the stated intervals and wherever the track looks irregular, not just at convenient points; readings are recorded immediately with their locations; and doubtful readings are repeated. TCS 01 referred to a separate measurement standard for the methods. A track recording vehicle's run before handover, where possible, gives a continuous record against which the manual measurements can be compared, as Chapter 10 describes.

## A failure: the twist at the culvert

This is an illustration. A new siding passed its gauge and alignment checks, but its twist was measured only at 10 m intervals to save time. Over a culvert, where the track had been packed unevenly on its approach slabs, a twist of about 12 mm in 3 m lay between two measurement points. An empty wagon derailed there on the siding's first week of use, its lifted wheel climbing the rail at walking pace.

Twist is a short-wavelength fault, and it must always be measured over the length the standard specifies, at close intervals. The siding was remeasured at 3 m intervals throughout, the culvert approach repacked, and the contractor's measurement plan corrected so that every later siding was checked the same way.

## Exercise: checking cross level and twist

On a straight length of new track, cross level readings at 3 m intervals are 0, 3, 7, −1 and 2 mm. Using a twist tolerance of ±5 mm about the design and a maximum of 1 in 300, is any reading outside the cross level tolerance of ±5 mm, and is any twist outside its tolerance?

All the cross levels, from −1 to 7 mm, are within ±5 mm except **7 mm**, which exceeds it by 2 mm.

The twists over each 3 m are 3, 4, **8** and 3 mm. On straight track, the design twist is zero, so the tolerance is ±5 mm: the **8 mm** twist, between the 7 mm and −1 mm readings, exceeds it, although at about 1 in 375 it is gentler than 1 in 300. This is an illustration: that length must be corrected before handover, and the 7 mm cross level with it.
