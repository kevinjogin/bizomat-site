---
book: railway-track-geometry-by-the-numbers
chapterSlug: sidings-loops-and-loading-facilities
order: 8
title: "Sidings, loops and loading facilities"
description: "Compare balloon and runaround loops, lay out a loop that holds the whole train, place the loading bin on straight track clear of the main line, and calculate the speed the train must load at."
draft: false
---

A siding is track off the main line where trains or wagons stand, load, unload or wait. Its geometry is usually gentler in its demands than a main line's, because trains in it move slowly, but it has its own requirements: it must hold the trains that use it, keep them clear of the main line, let them load and unload efficiently, and protect the main line from anything that runs away. For bulk loading, where whole trains of grain, coal or minerals are filled at a time, the layout of the siding decides how quickly a train can be turned around, and so how many trains a facility can handle in a season and what each tonne costs to load, which for a grain cooperative competing with road transport can decide whether rail is used at all. A good layout also has to be safe for the people who work in it and for the main line traffic that passes it.

This chapter compares balloon loops and runaround loops, lays out the running case's balloon loop to hold its whole train, places the loading bin on straight track clear of the main line, sets the heights of the loading structure, calculates the speed at which the train must move under the bin, and covers gauge widening on sharp siding curves, using the requirements of ARTC's 2005 NSW standard for unit train loading facilities, TDS 15, and its track construction standard, TCS 01.

## Balloon loops and runaround loops

A balloon loop is a loop of track leaving and rejoining the main line at one junction, so that a train can run off the main line, round the loop under the loading bin, and back onto the main line facing the way it came, without uncoupling or moving its locomotives. A runaround loop is a siding with a parallel track that lets the locomotives uncouple, run round the train and couple onto the other end, so that the train can return the way it came.

```figure
type: compare
title: Balloon and runaround loops for unit train loading
cols: How the train turns | Space needed | Time and complexity
caption: General comparison for teaching. ARTC TDS 15 (2005) described both layouts, with balloon loops the usual arrangement and runaround loops by approval.
- *Balloon loop | runs round the loop and leaves facing the way it came | a large circle of land | fast turnaround; no shunting; one junction
- Runaround loop | locomotives uncouple and run round the train | a long straight site | slower; shunting; locomotives must run clear of the main line
```

Balloon loops turn trains fastest, because the train never stops to uncouple, and are the usual arrangement for high-volume bulk loading. Runaround loops fit long, narrow sites and suit lower volumes. TDS 15 allowed a terminal to be designed as a runaround loop if the infrastructure manager approved, required locomotive run-round facilities to be clear of the main lines unless otherwise approved, and pointed out that much of what it required of balloon loops applies to runaround loops too.

## Holding the whole train

A balloon loop must hold the longest train that will use it, with room to spare, so that the whole train is clear of the main line and the junction while it loads. TDS 15 required balloon loops to accommodate the largest trains to be operated, and asked designers to consider future works needed if the junction must later move, for example to suit longer trains.

```figure
type: formula
title: Length of the running case's train and loop
formula: loop length ≈ 2π × radius + inserted straights; train length = wagons × wagon length + locomotives × locomotive length
caption: This is an illustration: 40 wagons of 16.3 m and 3 locomotives of 22 m, and a loop of 250 m radius with a 120 m loading straight inserted, ignoring the junction leads.
- Train | 40 × 16.3 + 3 × 22 = 718 m
- Loop curve | 2π × 250 ≈ 1,571 m
- Inserted loading straight | 120 m
step: loop length ≈ 1,571 + 120 ≈ 1,691 m
step: the loop holds the 718 m train more than twice over
step: a future 80-wagon train of about 1,370 m would still fit, clear of the junction and bifurcation
```

TDS 15 also set a minimum curvature for balloon loops of 200 m radius, and preferred train movements round the loop to be anticlockwise, with clockwise operation acceptable where grades and other physical factors favoured it. The direction matters for the loading bin's position relative to the loop and for which side of the train the operators see.

## The loading bin

The loading bin is placed on the loop where the train passes beneath it. TDS 15 required the bin facility to be on straight track so that each wagon being loaded or unloaded is always on the straight, with an absolute minimum straight length of 26 m. A wagon on a curve is offset from the chute by its throw and tilted by any cant, so straight track keeps every wagon centred under the chute. Where the bin is beside an existing main line, TDS 15 required that no part of the structure or its foundations be closer than 6,200 mm to the centreline of the nearest main line, which keeps the bin clear of the main line's service space and its traffic.

For a loop shared by two users, TDS 15 preferred loading through a single bin fed by conveyor from separate stockpiles, rather than two bins on one loop, which simplifies both the track and the operation.

## Loading structure heights

The structure that carries the bin and chute must clear the trains passing beneath, including their locomotives. TDS 15 required the loading structure not to infringe the standard structure gauge, and gave heights: in electrified areas, where locomotives pass under the structure, a minimum height for the supporting structure of 5,650 mm for DC traction or 5,900 mm for AC, and loading chutes in their retracted position at least 5,300 mm above rail. Where the chute lowers into the wagon, it must be at least 5,300 mm above design rail level when raised, reach down to at least 3,500 mm above rail when lowered, be no wider than 1,600 mm, and be able to be raised rapidly in an emergency. Where locomotives do not pass under the chute, the supporting structure and the raised chute could be as low as 5,000 mm above rail.

```figure
type: checklist
title: The cooperative's checks for the loading bin and its track
caption: This is an illustration of the running case's checklist, built from the requirements of ARTC TDS 15 (2005) quoted in this chapter; the infrastructure manager's current requirements govern.
- x Straight track | every wagon on straight track while it loads; straight longer than 26 m
- x Offset from main line | no part of the bin or its foundations within 6,200 mm of the main line centreline
- x Structure gauge | loading structure clear of the structure gauge; heights for a non-electrified area
- x Chute | raised height, lowered reach, width and emergency raising as required
- x Grade | constant rising grade through the bin, as Chapter 6 describes
- x Mass control | batch weighing before each wagon is filled, or a weighbridge
- *? Walkways and lighting | walkways on the inside of curves; lighting for night loading
```

## Loading speed

A train loaded on the move must travel at a speed that matches the loading rate, so that each wagon receives its full load as it passes under the chute.

As an illustration, the cooperative's 40 wagons each carry about 70 t of grain, about 2,800 t in all, and its bin loads at about 2,400 t an hour. Loading the whole train takes about 2,800 ÷ 2,400 × 60 = 70 minutes, during which the 718 m train must pass completely under the chute, at about 718 ÷ 70 ≈ 10.3 m a minute, or about 0.6 km/h. The locomotives must hold that walking-pace speed steadily while the train's weight grows by 2,800 t, which is why the grade through the bin is kept constant and gentle, as Chapter 6 explained.

## Mass control

Overloaded wagons damage track and bridges and can exceed axle load limits; underloaded wagons waste capacity. TDS 15 required an approved method of controlling the amount loaded into each wagon, preferably a batch weighing system that weighs each wagon's load before it is discharged, or else a track weighbridge to weigh the loaded train. The running case's bin uses batch weighing, which also lets the operators trim each wagon to its limit.

## Signalling and protection

The junction between a balloon loop and the main line is controlled by the infrastructure manager's signalling. TDS 15 required signalling control over the junction, with catchpoint protection of the main line unless the infrastructure manager specified otherwise, one main line turnout serving as both the way in and the way out, a facing crossover on a double main line, and loading lights distinguishable from the railway's signals. Chapter 7 covered the turnouts and catchpoints.

## No cant in sidings, wider gauge on sharp curves

ARTC's TCS 01 stated that superelevation is not applied to sidings, as Chapter 3 noted, and required every siding, whatever its class, to meet its Class 3 main line standards before it could carry traffic. On sharp siding curves, it required the gauge to be widened slightly so that wheelsets with long wheelbases can negotiate the curve without binding: to 1,440 mm for curves of 200 m to 160 m radius, 1,442 mm for 160 m to 140 m, 1,450 mm for 140 m to 120 m and 1,455 mm for 120 m to 100 m, with no widening needed at 160 m or more where pre-bored timber, concrete or steel sleepers were used. The running case's 250 m loop needs no widening.

## Walkways and formation

TDS 15 required wagon examination areas and walkways where specified, with walkways placed on the inner side of curves and properly lit, and allowance for future electrification in formation widths where specified. Staff walk beside trains in a loading facility far more than on a main line, checking wagons, doors and loads, and the walkways, lighting and clearances that serve them are part of the layout.

## Unloading facilities

The same principles apply where trains are unloaded, at ports, mills and power stations. Bottom-dump wagons discharge into a pit or bin below the track as they pass over it, which means the track crosses an opening and must be carried on a structure strong enough for the heaviest wagons. TDS 15 required track over unloading bins to be designed for the Metric Cooper M270 loading specified in the Australian railway bridge design rules, and the bins themselves to be designed for that loading. The track over the bin must also hold its line and level precisely, because the wagons' doors open at a fixed point and must discharge cleanly into the pit.

## The track under the bin

Spilled product is unavoidable at a loading bin, and product that falls into ballast fouls it, stops it draining and lets the track settle. TDS 15 asked for the track beneath the loading bin to be easy to clear of spilled product, ideally on a concrete slab with the rail supported on pedestals, so that spillage can be cleaned off rather than dug out of ballast. Slab track under the bin also holds its geometry, which keeps the loading even, as the dip under the bin in Chapter 6 showed.

## Joint use and future growth

Loading facilities often outgrow their first design. Trains get longer, volumes grow, a second user wants to share the loop, or the main line junction must be moved. TDS 15 asked designers to consider future civil and signalling works needed to relocate the loop's junction, and preferred a single bin for joint users. The cooperative's engineers left space for the loop's straight to be lengthened and for a second stockpile conveyor to feed the same bin, and confirmed that the loop could hold an 80-wagon train of about 1,370 m with its rear clear of the bifurcation turnout.

## Wagons on curves at loading

Even with the bin on straight track, the wagons approaching and leaving it are on the loop's curve, and their couplers and buffers work at angles. At walking pace this is harmless, but the transition between the straight and the curve must be smooth, with no kinks, because the train is under steadily increasing drawbar pull as it loads, and a kink at that point concentrates the lateral force from the couplers on the rails. A short transition curve between the loading straight and the loop's curve, though not needed for comfort at walking pace, eases the forces and makes the geometry easier to maintain.

## Formation for heavy, slow trains

Slow, heavy trains load the formation of a loading loop severely, because they stand and crawl rather than pass quickly, and because every train is fully loaded on part of the loop. TDS 15 referred the formation to the infrastructure manager's formation standard and drawings for sidings. The cooperative's geotechnical investigation, prompted by the soft spot described in Chapter 1, set the depth of capping under the loading straight and the loop's curves.

## A failure: the bin on the curve

This is an illustration. At an older facility, a loading bin had been built where the loop's straight ended and its curve began, to save land. Wagons at the curve end of the bin were offset from the chute by their throw, and grain spilled over the inner side of each wagon as it passed. Spilled grain fouled the ballast under the bin, which then settled, making the loading worse.

The bin could not easily be moved, so the facility's track was realigned to extend the straight through the whole bin, which meant easing the loop's curve and moving a length of track. The extension cost more than building the straight correctly in the first place.

## Exercise: a larger loop

A future train has 60 wagons of 17 m and 2 locomotives of 22 m, and carries 4,200 t. The loading bin loads at 3,000 t an hour. A loop of 300 m radius has a 100 m loading straight. How long is the train, does the loop hold it, how long does loading take, and at what speed must the train move?

The train is 60 × 17 + 2 × 22 = **1,064 m**. The loop is about 2π × 300 + 100 ≈ **1,985 m**, so it holds the train with room to spare.

Loading takes 4,200 ÷ 3,000 × 60 = **84 minutes**, so the train must pass the chute at about 1,064 ÷ 84 ≈ **12.7 m a minute**, about 0.76 km/h. This is an illustration; the loop's radius must also satisfy the governing standard's minimum, and the junction must be clear of the train's rear when it is fully in the loop.
