---
book: railway-track-geometry-by-the-numbers
chapterSlug: the-track-as-a-structure
order: 1
title: "The track as a structure"
description: "Follow a wheel load from rail to formation through sleepers and ballast, see what each track component does, why gauge is measured where it is, and how heavier traffic calls for a stronger track."
draft: false
---

Railway track looks simple: two steel rails on sleepers in a bed of stone. It is in fact a carefully layered structure that spreads the concentrated load of each wheel, tens of kilonewtons on a contact patch smaller than a coin, down to a level the ground can carry without settling, while holding the rails at a precise distance apart and in a precise line and level so that trains can run fast and smoothly. Track geometry, the subject of this book, is the shape of that structure; but geometry only lasts if the structure underneath can hold it. A curve laid out perfectly on a weak formation will soon be out of line and level.

This chapter follows a wheel load down through the track, describes what each component does, explains how the gauge is measured, shows how heavier traffic calls for stronger track, and introduces the running case: a grain balloon loop beside a single main line.

## From wheel to ground

A loaded grain wagon with an axle load of 23 tonnes puts about 23 × 9.81 ÷ 2 ≈ 113 kN on each wheel when standing still. Moving, the load varies with the track's irregularities and the wagon's motion, and designers commonly allow for the dynamic load by multiplying the static load by a factor, perhaps 1.5 for a freight wagon at moderate speed on reasonable track.

```figure
type: formula
title: Pressure under a sleeper from one grain wagon wheel
formula: pressure ≈ (static wheel load × dynamic factor × share carried by one sleeper) ÷ bearing area under one rail seat
caption: This is an illustration with assumed values for teaching: a 23 t axle load, a dynamic factor of 1.5, about half the wheel load carried by the sleeper directly beneath it, and an effective bearing area under one rail seat of 0.25 m wide by 0.8 m long.
- Static wheel load | 23 × 9.81 ÷ 2 ≈ 113 kN
- Dynamic factor | 1.5
- Share carried by one sleeper | about 50%
step: dynamic wheel load ≈ 113 × 1.5 ≈ 169 kN
step: load on one rail seat ≈ 169 × 0.5 ≈ 85 kN
step: pressure under the sleeper ≈ 85 ÷ (0.25 × 0.8) ≈ 423 kPa
```

The rail spreads the wheel load along several sleepers, because it bends like a beam on an elastic foundation; the sleeper spreads it over a larger area of ballast; the ballast spreads it again, through its depth, to a still larger area of formation; and the formation, the prepared ground beneath, carries it to the natural ground. At each layer the pressure falls, until at the formation it is low enough not to cause progressive settlement under millions of repetitions.

## What each component does

```figure
type: layers
title: The layers of ballasted track and what each does
caption: General description for teaching. The materials, sizes and depths for a particular line are set by the infrastructure manager's track standards.
- Rail | carries the wheel, guides it, spreads its load along several sleepers, and conducts signalling current
- Fastenings | hold the rail to the sleeper at gauge, resist rail creep and allow for thermal forces
- Sleepers | hold the two rails at gauge and spread their load to the ballast
- *Ballast | spreads the load, drains water, resists sleeper movement, and lets the track be lifted and lined
- Capping and formation | carry the load to the ground without settling or softening
```

Each layer also contributes to the geometry. The rail's straightness and its profile decide the smoothness of the ride; the fastenings hold the gauge; the sleepers' spacing and stiffness decide how evenly the load is spread; the ballast holds the track in line and level against the forces of passing trains and the expansion of the rails in heat, and its depth and cleanliness decide how long the geometry lasts between maintenance; the formation's strength and drainage decide whether the whole structure stays where it was built.

## Gauge and how it is measured

Track gauge is the distance between the inner faces of the rail heads, measured a short distance below the top of the rail, where the wheels' flanges run. Australia's interstate network uses standard gauge, 1,435 mm, with broad and narrow gauges elsewhere. The gauge is measured below the top because the rail head is rounded: measured at the very top, the distance would be larger and would vary with wear. ARTC's Track Standards Construction for NSW, TCS 01, gave the nominal gauge for new main line track as 1,435 mm, with tolerances by line class, and required gauge to be widened slightly on sharp curves, as Chapter 9 describes.

Gauge matters for geometry because it sets the distance between the rails across which cant is measured, and the play between the wheels and the rails, which allows the wheelsets to steer round curves. Too narrow, and wheels bind on curves; too wide, and wheels can drop between the rails.

## Ballasted and slab track

Most Australian track is ballasted, with sleepers of timber, concrete or steel in a bed of crushed rock. Ballast is forgiving: it can be tamped to restore level and line, cleaned, and added to. But it settles under traffic, so ballasted track needs periodic maintenance to restore its geometry. Slab track, with the rails fastened to a concrete slab, holds its geometry far better and needs little maintenance, but costs more to build and cannot be adjusted easily, so its geometry must be right when it is built. It is used in tunnels, on some bridges and in stations. The geometry principles in this book apply to both.

## Heavier traffic, stronger track

The track needed depends on the traffic it carries. Heavier axle loads and greater annual tonnage call for heavier rail, which spreads load further and wears more slowly; closer-spaced or larger sleepers; deeper ballast; and a stronger formation. Railways classify their lines by traffic and set component standards for each class. TCS 01 referred to a separate NSW standard for the classification of lines and its material standards, which is not quoted here; the principle is that the class of the line, set by its tonnage, axle load and speed, decides both its components and the geometry tolerances it must be built and maintained to.

## The forces the geometry must resist

Track is pushed and pulled in every direction. Vertically, wheel loads press it down and the track's flexibility lets it lift slightly ahead of and behind each wheel. Laterally, curving forces push the rails outwards, especially the outer rail on curves when trains run faster than the cant suits, and the steering forces of wheelsets push them sideways on straights. Longitudinally, braking and traction forces drag the rails, and in hot weather continuously welded rail tries to expand and can buckle the track sideways if the ballast cannot hold it. The geometry is only as stable as the track's resistance to all of these, which is why ballast shoulders, sleeper weight and rail stressing are part of geometry as much as of track structure.

## Heat and continuously welded rail

Most main line track today uses continuously welded rail, with the rails welded into lengths of hundreds of metres or more and no joints to let them expand. Because the rail cannot expand freely, a rise in temperature builds a compressive force in it, and a fall builds tension. The rail is laid or adjusted at a chosen neutral temperature, so that it is stress-free in the middle of its working range.

```figure
type: formula
title: Thermal force in a welded rail heated above its neutral temperature
formula: force = elastic modulus × coefficient of expansion × temperature rise × rail cross-section
caption: This is an illustration with typical values for steel rail: an elastic modulus of about 207,000 MPa, a coefficient of expansion of about 11.5 millionths per °C, a rail cross-section of about 7,700 mm², and a rail 30 °C above its neutral temperature.
- Stress per °C | 207,000 × 0.0000115 ≈ 2.4 MPa per °C
- Temperature rise | 30 °C
step: stress ≈ 2.4 × 30 ≈ 71 MPa in compression
step: force ≈ 71 × 7,700 ≈ 550,000 N, about 550 kN in each rail
step: the two rails together push with about 1,100 kN, which the ballast must hold
```

Two rails each pushing with over half a meganewton try to buckle the track sideways, and they succeed where the ballast shoulder is thin, the track has just been disturbed by maintenance, or a curve's alignment is already out. A track buckle is a sudden, severe geometry fault that can derail a train. That is why the geometry of welded track depends on its ballast and on managing the rail's neutral temperature, and why curves, where the rails' push has a sideways component, need particular care.

## Sleeper spacing and the load spread

The number of sleepers under each rail length affects how the load is spread and how well the geometry is held. Closer spacing means each sleeper carries less of each wheel load and the track resists lateral movement better; wider spacing saves sleepers but loads the ballast more heavily. Heavy-haul lines use closer spacing and heavier sleepers; light sidings can use wider spacing. The spacing is set by the track standard for the line's class, and a sleeper missing or failed under a rail is a local weakness where the geometry will deteriorate first.

## Drainage

Water is the enemy of geometry. A formation that is wet loses strength, and under repeated wheel loads it pumps fine material up into the ballast, which fouls and stops draining, and the track settles unevenly. Drains beside the track, a formation shaped to shed water, and clean ballast keep the track dry. Many geometry problems that look like poor tamping are really poor drainage underneath, and fixing the geometry without fixing the drainage only buys a few months.

## Why geometry deteriorates

Every passing wheel compresses the ballast and formation slightly, and not quite all of the compression recovers. Over millions of wheel passes, the track settles, and it settles unevenly, because the ballast's density, the formation's strength and the loads are never quite uniform. Rail joints, welds, turnouts, bridge ends and soft spots settle faster than plain track, because the wheel loads there are higher or the support changes abruptly. The track's geometry therefore deteriorates from the day it is built, and the rate of deterioration, measured in millimetres of settlement or misalignment per million tonnes of traffic, decides how often it must be maintained. A well-built track on a good formation deteriorates slowly; a poorly built one may need attention within weeks of opening, as the soft spot below shows.

## Maintaining geometry

Ballasted track's geometry is restored by tamping: a machine lifts the track to its design level and line, and vibrating tines squeeze ballast under the sleepers to hold it there. Tamping restores the geometry but disturbs the ballast, which is weaker for a while afterwards and settles faster until traffic has reconsolidated it; that is why speed restrictions often follow tamping, and why track is not tamped in hot weather when the rails' thermal forces are high. Design geometry that the tamping machine can follow, with clearly defined curves, transitions and levels, makes maintenance easier and more accurate for the life of the line.

## The running case: the balloon loop

This is an illustration. A regional grain cooperative is building a balloon loop beside a single standard gauge main line, so that trains of about 40 wagons can run off the main line, around the loop under a loading bin while being filled, and back onto the main line facing the way they came, without uncoupling or running the locomotives round. The trains have axle loads of 23 tonnes and travel slowly in the loop. The main line beside the junction is on an 800 m radius curve and carries passenger trains at up to 115 km/h and freight at up to 80 km/h.

The cooperative's engineers must lay out the loop and its junction, choose grades and curves suited to slow loading, check the effect on the main line, and build and hand over the track to the standards the infrastructure manager sets. The chapters that follow take each step in turn. The loop, carrying slow trains only, can use lighter components and looser tolerances than the main line, but its loading straight must hold its geometry closely, because the loading bin and the wagons must line up every time.

## Geometry terms

A few terms recur throughout the book. Alignment is the track's line in plan, its straights and curves. Cant, or superelevation, is the height of the outer rail above the inner on a curve. Cross level is the difference in height between the two rails at a point, which on straight track should be zero and on curves should equal the design cant. Twist is the change in cross level over a short length, which can lift a wheel if it is too great. Top, or surface, is the smoothness of the rails' level along the track. Gauge is the distance between the rails. Each has a design value and a tolerance, and each is measured, as Chapters 9 and 10 explain.

## A failure: the soft spot

This is an illustration. A short siding at another grain site was laid on a formation that crossed an old creek bed, without extra drainage or a stronger capping layer. Within a season, the track over the creek bed had settled about 60 mm below the rest and twisted, and a loaded wagon rocked visibly as it passed. The track had been tamped twice, but each time the dip returned within weeks.

The geometry could not be held because the formation beneath could not carry the load when wet. The siding was closed while the formation was dug out, drained and rebuilt with a capping layer, after which the geometry held. The cooperative's engineers, aware of that history, commissioned a geotechnical investigation along the whole line of the balloon loop before designing it.

## Exercise: wheel load and sleeper pressure

A wagon with an axle load of 25 tonnes runs on track whose sleepers each carry about 45% of the wheel load directly above them, with an effective bearing area of 0.2 m² under each rail seat. Using a dynamic factor of 1.6, estimate the static wheel load, the dynamic rail seat load and the pressure under the sleeper.

The static wheel load is 25 × 9.81 ÷ 2 ≈ **123 kN**. The dynamic wheel load is about 123 × 1.6 ≈ 196 kN, so the rail seat load is about 196 × 0.45 ≈ **88 kN**.

The pressure under the sleeper is about 88 ÷ 0.2 ≈ **441 kPa**. This is an illustration with assumed factors; heavier axle loads and higher dynamic factors raise the pressure, which is why heavier traffic calls for stronger track throughout, from rail to formation.
