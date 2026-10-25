---
book: railway-track-geometry-by-the-numbers
chapterSlug: turnouts-and-crossovers
order: 7
title: "Turnouts and crossovers"
description: "See how a turnout's switch, closure curve and crossing let a train change tracks, relate crossing rate to lead radius and speed, and place the running case's junction, catchpoint and loop turnout."
draft: false
---

A turnout lets a train leave one track for another. It is the most complex piece of track geometry: two tracks diverging from one, with movable switch rails that steer the wheels one way or the other, a curved closure section between them, and a crossing where one track's rail cuts across the other's, with a gap the wheels must bridge. Every turnout limits speed on its diverging route, wears faster than plain track, and needs careful maintenance. The choice of turnout for each junction, and exactly where it is placed, decides how fast trains can enter and leave, how much the layout costs, and how reliable it is.

This chapter describes the parts of a turnout and what each does, relates the crossing rate to the radius of the turnout's curve and its speed, explains crossovers and catchpoints, and places the running case's junction turnout, the catchpoint that protects the main line, and the turnout inside the balloon loop.

## The parts of a turnout

```figure
type: layers
title: The parts of a turnout, from the switch to the crossing
caption: General description for teaching. Turnout designs, lengths and speeds are standardised by each infrastructure manager.
- Switches | movable tapered switch rails that lie against one stock rail or the other to steer the wheels
- Closure | the curved and straight rails between the switches and the crossing, forming the diverging route's curve
- *Crossing | where one route's rail crosses the other's; wheels bridge a gap guided by check rails
- Check rails | opposite the crossing, they hold the wheelset so its flange cannot strike the crossing's point
- Long timbers or bearers | longer sleepers carrying both routes, with the switch machine and its connections
```

The switch is where the routes divide. Its tapered switch rails are moved by a switch machine or lever so that one lies against its stock rail and the other stands clear, steering the wheel flanges onto the chosen route. Beyond the switch, the closure rails form the curve of the diverging route. At the crossing, the inner rail of each route crosses the other route's rail; the wheels pass over a small gap, and check rails on the opposite rails hold the wheelset sideways so that the flanges take the right side of the crossing's point. Every one of these is a place where the geometry is complex and the wheel loads are high, which is why turnouts need more maintenance than plain track.

## Crossing rate and lead radius

A turnout is described by its crossing rate, written 1 in N: the angle at which the two routes' rails cross, expressed as the ratio of the spread to the length along the crossing. A larger N means a shallower crossing angle, a gentler diverging curve, a longer turnout and a higher speed on the diverging route. The radius of the diverging route's curve, the lead radius, grows roughly with the square of N.

```figure
type: formula
title: Approximate lead radius and diverging speed of a turnout
formula: lead radius ≈ 2 × N² × gauge; speed ≈ √(allowed deficiency × lead radius ÷ 11.8)
caption: This is an illustration. The radius approximation applies to a simple turnout with a circular closure curve and standard gauge, 1.435 m; real turnout designs, with curved switches and particular geometry, have their own radii and approved speeds. Turnouts usually have no cant, so the whole equilibrium cant is deficiency; an allowed deficiency of 75 mm is assumed for teaching.
- Crossing rate | 1 in 12
- Gauge | 1.435 m
step: lead radius ≈ 2 × 12² × 1.435 ≈ 413 m
step: speed ≈ √(75 × 413 ÷ 11.8) ≈ 51 km/h
step: a 1 in 8.25 turnout, lead radius about 195 m, allows about 35 km/h on the same assumption
```

Because the diverging route usually has no cant, a train on it has a cant deficiency equal to the whole equilibrium cant for its speed, and the turnout's speed is limited by the deficiency allowed. That makes turnout speed depend on the square root of the lead radius, and so roughly in proportion to N.

```figure
type: bars
title: Approximate diverging speed by crossing rate
unit: km/h, assuming 75 mm allowed deficiency and no cant
max: 85
caption: This is an illustration from the formula above. Real turnout speeds are set by the infrastructure manager for each approved turnout design.
- 1 in 8.25 | 35
- 1 in 10.5 | 45
- *1 in 12 | 51
- 1 in 15 | 64
- 1 in 18.5 | 79
```

The cost of that extra speed is length. A 1 in 18.5 turnout is far longer than a 1 in 8.25, with longer switches, more long timbers and a longer, heavier crossing, and it needs more straight track to fit into. Junctions on fast main lines use long turnouts so that trains can diverge without slowing much; yards and sidings use short, sharp turnouts because trains in them move slowly and space is tight.

## Speeds at a loading facility's junction

ARTC's NSW standard for unit train loading facilities, TDS 15, required that, where a balloon loop sits some distance from the main line, both the junction turnout and the lead track out to the loop allow trains to run at 50 km/h, so that trains leaving and joining the main line do not hold up other traffic. It required the turnout within the loop, the bifurcation where the loop divides, to have a crossing rate and switch length suited to a design speed of either 30 or 50 km/h, depending on the junction turnout's crossing rate. On a double main line, where a facing crossover is needed before the junction, it required the crossover's turnouts to match the junction turnout's design. Every turnout were to be of a standard type.

## Crossovers

A crossover joins two parallel tracks with two turnouts, one on each track, laid back to back, so that a train can move from one track to the other. On a double main line, a train entering a siding on the far side must cross the near track first, through a crossover, and the crossover's speed limits the movement. Crossovers need track centres suited to the turnouts' geometry; at standard track centres, the distance between the two turnouts' crossings is set by the crossing rate.

## Catchpoints

A catchpoint is a single switch, or a switch and a short length of rail, placed in a siding or loop to derail any vehicle that runs away towards the main line before it can foul it. When a train is signalled into or out of the siding, the catchpoint is set to let it pass; at all other times, it is set to derail. A derailment in the siding is far better than a runaway wagon on the main line in front of a passenger train.

TDS 15 called for a catchpoint on the stretch of a balloon loop from the junction to the bifurcation, to protect trains on the main line, and noted that a second catchpoint might be required at the loop's departure end to protect arriving trains, as the infrastructure manager decided. Catchpoints were to be of a standard type.

## Turnouts on curves and grades

Turnouts are simplest on straight, level track, and many standards require them there. Where a junction must be on a curve, special curved turnouts are designed, with their own geometry and speeds, and the cant and transitions of Chapter 5 must be arranged so that the cant does not change through the turnout. On grades, the turnout must sit on a constant grade, with vertical curves clear of its ends, as Chapter 6 noted. The running case's junction is placed on straight, level track beyond the main line curve's transition for exactly these reasons.

## Turnout maintenance

Turnouts wear quickly. Wheels strike the crossing's point and its gap at every passage, the switch rails' tips wear and chip, the check rails wear on their faces, and the long timbers and ballast under them settle unevenly under the concentrated loads. Turnouts are inspected more often than plain track, measured with gauges specific to their geometry, and ground, welded and replaced on their own cycles. A turnout chosen with more length than strictly needed often lasts longer and rides better, because its crossing angle is shallower and its loads gentler.

## Facing and trailing

A train meets a turnout either facing, approaching from the switch end where it can be sent down either route, or trailing, approaching from the crossing end where two routes merge. Facing movements are the more demanding, because the switch must be held firmly in position and locked, or the train could split the switch and derail. Main line facing turnouts are therefore locked and detected by the signalling, so that a signal cannot clear unless the switch is fully home and locked. The running case's junction is facing for trains entering the loop and trailing for trains leaving it, and both directions are signalled.

## The geometry inside the turnout

A turnout's geometry is measured with its own set of gauges and checks: the gauge at points along both routes, the position of the switch tips and their fit against the stock rails, the flangeway widths at the check rails and crossing, the check gauge that ensures the check rail holds the wheelset clear of the crossing's point, and the cross level and top through the whole length. ARTC's TCS 01 required turnouts to comply with its main line tolerances except for gauge, which was to follow the basic design within ±2 mm, a tighter tolerance than plain track because the turnout's working depends on its exact dimensions.

## Turnouts and long vehicles

Short, sharp turnouts throw long vehicles out at their ends and in at their middles more than gentle ones, as Railway Clearances by the Numbers explains, and turnouts in reverse, where a train passes from one turnout into another curving the opposite way, as in a crossover, put long vehicles through a reverse curve with no straight between. Layouts with crossovers and turnouts close together are checked for the longest vehicles that will use them, both for clearances and for the coupler angles between adjacent vehicles, which can lock or derail if the curvature reverses too sharply.

## Choosing turnout sizes in a layout

A layout with several turnouts is easier to build and maintain if it uses as few turnout types as possible, because spare parts, maintenance skills and gauges are shared. The cooperative's engineers chose standard designs already used on the network for both turnouts, which the infrastructure manager could maintain with its existing spares, rather than a special design that would have saved a little length but cost more over the turnouts' lives.

## Turnouts in the layout's timetable

A turnout's speed affects how long a train takes to clear the main line, which matters on a busy line. A 720 m grain train entering the loop at 50 km/h, about 13.9 m/s, takes about 720 ÷ 13.9 ≈ 52 seconds to pass completely through the junction once its locomotive reaches it; at 30 km/h it would take about 86 seconds. This is an illustration. During that time, the main line is occupied and no other train can pass, so the junction turnout's speed is chosen with the main line's traffic in mind as well as the loop's. That is why TDS 15 asked for 50 km/h at a remote loop's junction, and why the infrastructure manager, which controls the main line's capacity, decides the junction's design.

## Switch machines and points heating

Remotely controlled turnouts are moved by switch machines that throw the switch rails, lock them and detect their position for the signalling. Their reliability is part of the junction's reliability: a switch machine that fails to detect the switch home leaves the signal at stop and the train waiting. Stones, ice or debris between the switch rail and stock rail stop the switch closing, so turnouts are kept clean, and in cold climates some are heated. The geometry of the switch, its fit and its freedom to move, is checked whenever the turnout is maintained.

## The running case: the junction and the loop turnout

This is an illustration. The cooperative's loop leaves a single main line, so no crossover is needed. The infrastructure manager specified a standard junction turnout giving 50 km/h on the diverging route, consistent with TDS 15 for a loop connected by a lead track, which in the case is a 1 in 12 design, and a standard 1 in 8.25 turnout for the bifurcation inside the loop, giving the 30 km/h design speed. The catchpoint was placed on the lead between the junction and the bifurcation, at a point where a derailed wagon would come to rest clear of the main line, with a second catchpoint at the departure end at the infrastructure manager's request. The junction's signalling, controlled by the infrastructure manager, interlocks the junction turnout and the catchpoint so that the catchpoint can only be set to let a train pass when the route is properly set.

## A failure: the turnout on the transition

This is an illustration. At another siding, a junction turnout was installed partly on the transition at the end of a main line curve, because the straight was short. The turnout's cross level varied through its length, twisting its geometry; the switch rails did not seat properly against the stock rails, and the crossing wore rapidly on one side. After two derailments of empty wagons at low speed, the turnout was relocated onto straight track, which meant moving the siding's connection 60 m and rebuilding its approach, at far greater cost than placing it correctly at first.

## Exercise: choosing a turnout

A siding needs a diverging speed of at least 40 km/h. Using the approximations in this chapter, what lead radius does a 1 in 10 turnout give, and what speed with 75 mm allowed deficiency? Would it meet the requirement? What speed would it give with only 50 mm allowed?

The lead radius is about 2 × 10² × 1.435 ≈ **287 m**. With 75 mm allowed, the speed is about √(75 × 287 ÷ 11.8) ≈ **43 km/h**, meeting the 40 km/h requirement.

With only 50 mm allowed, the speed is about √(50 × 287 ÷ 11.8) ≈ **35 km/h**, which would not. This is an illustration: real turnout speeds come from the approved turnout designs and the governing standard's limits, but the arithmetic shows why the allowed deficiency matters as much as the crossing rate.
