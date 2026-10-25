---
book: cutting-and-gouging-by-the-numbers
chapterSlug: plasma-cutting
order: 5
title: "Plasma cutting"
description: "See how a constricted arc cuts by melting and blowing metal out, how much of its power does useful work, how speed and kerf vary with thickness, which gases suit which metals, and bevel and dross."
draft: false
---

Plasma cutting is the carbon arc's most successful descendant. It is still an electric arc that melts metal, but the arc is squeezed through a small nozzle, which concentrates it into a narrow column of extremely hot, fast-moving gas that melts a thin slot through the plate and blows the molten metal out of the bottom. The result is a cut many times faster than the carbon arc's and much narrower, cleaner and more accurate, in any metal that conducts electricity. From hand-held air plasma sets in repair shops to high-definition CNC systems in steel service centres, plasma cuts more medium plate than any other method.

This chapter explains how the plasma arc cuts, calculates how much of its power does useful work, relates speed, kerf and edge to thickness and current, compares the gases, and covers the features of a plasma edge that matter downstream: bevel, dross, holes and the heat-affected zone.

## The constricted arc

A plasma torch has an electrode, usually of copper with a hafnium insert, inside a nozzle with a small orifice. Gas flows round the electrode and out through the orifice. The arc is started inside the torch and then transferred to the work, so that it runs from the electrode, through the orifice, to the plate. Forcing the arc through the narrow orifice raises its current density and temperature enormously, to many thousands of degrees, and heats the gas to a plasma, an electrically conducting, ionised gas, which leaves the nozzle at very high velocity. The column is narrow, hot and fast, and it melts a slot through the plate and drives the molten metal out of the bottom of the kerf.

The arc voltage of a plasma cut is high, often 100 to 200 volts, because the constricted arc is long and resists the current strongly, so the power at a given current is several times that of a welding arc. A 200 amp plasma system cutting 12 mm plate may run at around 150 volts, about 30 kilowatts of arc power.

## How much of the power does useful work

```figure
type: formula
title: Energy used per cubic millimetre of kerf, plasma and carbon arc
formula: energy per mm³ = arc power ÷ (cutting speed × kerf width × thickness)
caption: This is an illustration for a 200 A plasma cut at about 150 V in 12 mm mild steel at 2,500 mm/min with a kerf of about 3 mm, compared with the heat needed simply to melt steel, about 10.2 J/mm³, and with the carbon arc of Chapter 2.
- Arc power | 200 × 150 = 30,000 W
- Kerf removed | 2,500 ÷ 60 × 3 × 12 ≈ 1,500 mm³/s
step: energy used ≈ 30,000 ÷ 1,500 ≈ 20 J per mm³ of kerf
step: about half of the arc's power goes into melting the kerf, against about a tenth for the carbon arc
step: the rest heats the plate's edges, the nozzle, the gas and the surroundings
```

About half the arc's power melting the kerf is a high efficiency for a thermal cutting process, and it is why plasma is so fast. The concentration of the arc puts its heat into a narrow column instead of spreading it across a wide pool, and the gas jet removes the molten metal at once, so little is wasted remelting metal that did not leave. The carbon arc, by contrast, spent most of its energy heating everything around the cut.

## Speed and thickness

Plasma's speed falls steeply as the plate gets thicker, because the arc must melt more metal for each millimetre of cut and the jet must drive the melt through a longer kerf.

```figure
type: bars
title: Illustrative cutting speed of a 200 A oxygen plasma system in mild steel
unit: mm per minute, production quality
max: 5200
caption: This is an illustration for teaching. Real speeds come from the system maker's cut charts for the current, gas, consumables and cut quality wanted; maximum severance speeds are higher, and quality cuts slower.
- 6 mm | 5000
- *12 mm | 2500
- 20 mm | 1300
- 25 mm | 900
- 40 mm | 350
```

Somewhere above about 25 to 40 mm for a system of this size, the plasma cut becomes slow and its quality falls, and oxy-fuel, whose speed falls much more gently with thickness, becomes the better choice. Larger plasma systems, at 400 amps and more, push the crossover thicker. The crossover is one of the most important numbers in a plate shop's choice of method, and Chapter 6 finds it by cost as well as speed.

## Gases

```figure
type: compare
title: Plasma gases and their uses
cols: Plasma gas | Shield or secondary gas | Suits
caption: General description for teaching. The system maker's process charts specify the gases, pressures and consumables for each material and thickness.
- Compressed air | air | air | carbon steel, stainless and aluminium on hand-held and economy systems; slight nitriding of the edge
- *Oxygen | oxygen | air or oxygen | carbon steel; fastest, squarest, best weldability of the edge
- Nitrogen | nitrogen | air, nitrogen or water | stainless and aluminium; long consumable life
- Argon-hydrogen mixture | argon-hydrogen | nitrogen | thick stainless and aluminium; smooth edge
- Nitrogen-hydrogen mixture | nitrogen-hydrogen | nitrogen | thin to medium stainless; bright edge
```

Oxygen plasma on carbon steel gives the fastest, squarest cut with little dross, and an edge that welds well, because the oxygen reacts with the iron and adds heat, a little like oxy-fuel cutting, and leaves no nitrogen in the edge. Air plasma, cheap and simple, is the usual choice for hand-held cutting and gouging; on carbon steel it can leave nitrogen in the cut edge, which may cause porosity when the edge is welded without cleaning. Stainless and aluminium are cut with nitrogen or with hydrogen-bearing mixtures, which give cleaner edges free of heavy oxide.

## Bevel and the good side

A plasma cut is not perfectly square. Its faces are slightly bevelled, and, because the gas swirls as it leaves the nozzle, one side of the cut is squarer than the other. CNC programs arrange the direction of cutting so that the parts are on the squarer side and the scrap on the more bevelled side: clockwise round the outside of a part and anticlockwise round holes, or the reverse, depending on the swirl direction of the torch. High-definition plasma systems, with tighter constriction and better gas control, reduce the bevel to a degree or two on the good side, close to laser quality on medium plate. ISO 9013 classifies thermal cut quality by perpendicularity and surface roughness, and contracts that need a particular cut quality name its class.

## Dross

Dross is resolidified metal clinging to the bottom edge of the cut. Low-speed dross forms when the torch moves too slowly, so that too much metal melts and the jet cannot clear it; it is a thick, globular deposit, easy to knock off. High-speed dross forms when the torch moves too fast, so that the arc lags behind and the melt is dragged under the plate; it is a thin, hard bead, difficult to remove. Between them lies a speed window where the cut is nearly dross-free, and finding it, from the cut chart and a few trial cuts, is the operator's first job with a new plate or consumable set. Dross that must be ground off adds a labour cost to every part.

## Holes

Holes are plasma's weak point. The pierce, made by the arc boring down through the plate, throws molten metal up at the torch and leaves a small crater; the lead-in from the pierce to the hole's edge and the lead-out at the end leave small marks; and the bevel of the cut makes a hole tapered, larger at the top than the bottom. Holes smaller than about the plate thickness are difficult to cut accurately. Modern CNC systems use slower speeds, adjusted current and special lead-ins for holes, which improve them greatly, and the best high-definition systems cut bolt-ready holes in medium plate. Where holes must be exact, they are still drilled.

## Consumables

The electrode and nozzle wear with every start and with arc time, and their condition decides the cut's quality. The hafnium insert in the electrode erodes a little at each start and stop, so electrode life is often measured in starts, typically some hundreds to a few thousand depending on the system, the gas and the current; nozzles wear more slowly unless damaged by a pierce too close to the plate or by dross. A worn nozzle widens the kerf, increases the bevel and makes dross worse, long before it fails completely. The service centre records the starts and arc time on each set of consumables and changes them by count, not when the cut has visibly deteriorated, because by then a batch of parts may already be out of tolerance.

## The heat-affected zone

Plasma's fast cut and narrow arc leave a narrow heat-affected zone along the edge, usually narrower than oxy-fuel's. On ordinary structural steel it does not matter. On hardenable steels the cut edge can be hardened, though less deeply than with oxy-fuel, and on quenched and tempered wear-resistant plates the plate maker's guidance on cutting, which may include limits on cutting speed or preheat for thick sections, should be followed. For parts whose edges will be welded, the oxygen plasma edge on carbon steel is generally weldable as cut; air and nitrogen plasma edges may need cleaning first.

## Plasma on the CNC table

On a CNC table, plasma's performance depends on the system around the torch as much as the torch itself: a torch height control that holds the torch at the right distance from the plate by measuring the arc voltage, so that the cut stays consistent as the plate rises and falls; motion control that slows the torch smoothly round corners without leaving dross or gouges; and software that applies the cut chart's settings for each material, thickness and feature. A water table or downdraft table under the plate captures the fume and dross. Chapter 10 deals with the fume.

## Cleaning the groove

Whatever method made the groove, it is cleaned before welding. Arc-air grooves carry a thin layer of oxidised, possibly carbon-enriched metal and loose slag, which a short pass with a grinding disc or a burr removes to bright metal. Plasma-gouged grooves need less cleaning but are still brushed or lightly ground. The groove and a band each side are cleaned of spatter, oil, paint and moisture, as for any weld preparation. The groove's profile is checked too: ridges and steps left by an uneven gouge are ground smooth, because a welder filling a ridged groove can trap slag in the valleys, and the bottom of the groove must be rounded, not a sharp V that the root pass cannot fuse.

## Distortion from gouging

A long, deep gouge removes metal from one side of a part and heats it, and the part can move, much as it does when welded on one side. A plate back-gouged along a long seam may bow towards the gouged side; a thin-walled casting can warp. The second side's weld often reverses some of the movement, but not always all of it. Where distortion matters, the gouging is done in stages, alternating sides or areas, or the part is restrained while it is gouged and welded. Welding Distortion by the Numbers covers the shrinkage and restraint involved.

## Rivets, bolts and lugs

Gouging also removes things: rivet heads before the rivets are punched out, seized bolts and studs, temporary lifting lugs and attachments, and old wear plates. The aim is to remove the unwanted metal without gouging into the parent part beneath. A skilled gouger washes a rivet head off almost flush with a low electrode angle, leaving a thin skin that is then ground or chipped away, rather than gouging into the plate; a temporary lug is cut off a few millimetres proud of the surface and the remainder ground flush. Any gouge or nick into the parent part is a defect in its own right on a load-bearing part, and is repaired and checked as the procedure requires.

## The running case: tuning the table

This is an illustration. The service centre's plasma table had been cutting all its mild steel with one set of air plasma settings to save changing gases. Trials showed that switching to oxygen plasma for mild steel cut about 15% faster on 12 to 20 mm plate, with much less dross and squarer edges, and that the edges welded without the porosity the fabricators had complained of. The cost of oxygen was small against the time saved in grinding dross. The centre adopted oxygen plasma for mild steel and kept air for stainless and aluminium jobs too small to justify changing to nitrogen.

## A failure: the worn nozzle

This is an illustration. An operator, pressed for time, kept cutting a long run of 16 mm base plates on a set of consumables well past their usual life. The cut still looked acceptable on the surface, but the kerf had widened and the bevel had grown, so the plates came out about a millimetre undersize on their good side and their holes were tapered. The customer rejected the batch when the plates would not fit their bolt pattern.

The centre now changes consumables by count of starts and arc time, records the change on the job sheet, and checks the first part of every batch with a gauge.

## Exercise: energy and speed

A 130 A plasma system runs at about 140 V cutting 10 mm plate at 2,800 mm/min with a 2.4 mm kerf. Estimate the energy used per cubic millimetre of kerf and the share of the arc's power that melts it, taking about 10.2 J/mm³ to melt steel. If the same system cut 10 mm plate at 3,500 mm/min with high-speed dross, what would that suggest?

The arc power is 130 × 140 = 18,200 W. The kerf removed is 2,800 ÷ 60 × 2.4 × 10 ≈ **1,120 mm³/s**, so the energy used is about 18,200 ÷ 1,120 ≈ **16 J/mm³**, and the share melting the kerf is about 10.2 ÷ 16 ≈ **63%**.

At 3,500 mm/min the arc would need to melt the kerf 25% faster with the same power, leaving less energy to clear the bottom of the cut, so the arc would lag and drag the melt under the plate as high-speed dross. The speed is above the window; the operator should slow down until the dross clears, accepting a slightly lower speed for a part that needs no grinding.
