---
book: roof-lights-by-the-numbers
chapterSlug: sashes-safety-and-the-water-test
order: 8
title: "Opening sashes, safety and the water test"
description: "Size the actuator for RL-24's opening sash against its weight and wind, compare its ventilating area with the room's needs, control falls through the roof light, and prove it watertight."
draft: false
---

The last chapter deals with three things that are easy to leave until the end and expensive to get wrong there. An opening sash turns a roof light into a ventilator, and brings an actuator, wind forces and a new joint that must seal. A roof light is a hole in a roof that people work on, and falls through roof lights and skylights kill and injure roof workers in Australia every year. And until a roof light has been wetted systematically and watched from inside, nobody knows it is watertight.

This chapter sizes the actuator for RL-24's opening sash against its weight and wind, compares the ventilating area it gives with the room's needs, sets out the controls that keep people from falling through it, and describes the water test and the handover record. The failure case is an actuator sized only for the sash's weight, which a gust of wind defeated.

## The opening sash

RL-24 has one opening sash: one of the 600 × 662 mm rectangular panes on the long face that faces away from the afternoon sun, made as a separate framed sash hung from a hinge at the ridge and opened outwards at its lower edge by an electric chain actuator. Opening the roof light lets warm air escape from the highest point of the room on summer evenings, which a window cannot do as well.

The sash weighs its glass, **5.96 kg** from Chapter 3, plus about **2.5 kg** of sash frame, gaskets and hinge leaves: about **8.46 kg**. Closed, it lies at 25°. Its weight acts at its centre, half its 662 mm length down the slope from the hinge, which is a horizontal distance of **331 × cos 25° ≈ 300 mm** from the hinge line.

```figure
type: formula
title: Force the actuator must exert at RL-24's sash edge
formula: edge force = (weight × horizontal lever + wind force × slope lever) ÷ sash length
caption: This is an illustration. The wind case uses a teaching suction of 0.3 kPa on the open sash, the kind of gust the sash must hold against before a wind sensor closes it. The actuator maker's rated push and pull forces must exceed the result with a margin.
- Weight | 8.46 kg × 9.81 ≈ 83 N
- Moment of weight about the hinge | 83 N × 300 mm ≈ 24,900 N·mm
- Edge force for weight alone | 24,900 ÷ 662 ≈ 37.6 N
- Wind suction on the sash | 0.3 kPa × 0.6 m × 0.662 m ≈ 119 N, acting at mid-length
- Extra edge force for wind | 119 × 331 ÷ 662 ≈ 59.6 N
step: The actuator must hold about 37.6 + 59.6 ≈ 97 N at the edge; one rated well above 100 N in both push and pull is chosen
```

The weight calculation is the one most people do; the wind calculation is the one that matters. An open sash in a gust is a sail. Suction on its upper surface tries to pull it further open, and the actuator's chain must hold it. A downward gust tries to slam it shut. The actuator must be rated for both directions, and its fixings to the sash and frame, small screws in thin aluminium, must carry the same forces.

### Rain and wind sensors

An opening sash that is open when a storm arrives lets in rain and catches wind. RL-24's actuator is wired to a combined rain and wind sensor on the roof that closes the sash at the first drops of rain or when the wind passes a set speed, whatever the wall switch says. The sensor is the cheapest part of the system and the part most often left out. With it, the 0.3 kPa wind case is the most the sash sees open; without it, the sash may be open in a gale.

### Pinch points

A powered sash closes with force. Its closing edge, at the eaves, is a pinch point for fingers, though at ceiling height in a raked room it is usually out of reach. The actuator's closing force is set at the lowest value that reliably compresses the gaskets, and its control is placed where the person operating it can see the sash.

### Sealing the sash

A fixed pane is sealed once, by its gaskets and cappings. A sash is sealed every time it closes, by a gasket on its frame pressing against a matching upstand on the roof light. The upstand must stand higher than any water that runs past it, so on RL-24 the sash sits in a subframe whose upstands rise 20 mm above the glass line on all four sides, with the sash's own frame lapping down over them like a lid. Water running down the glass from above the sash meets the subframe's head upstand and is turned aside along it to the commons, which carry it down the slope beside the sash. At the sash's lower edge, the subframe's upstand is drained through baffled weeps into the frame channel, as in Chapter 6, so that any water driven past the gasket in a storm is carried away rather than left to find its way inside.

The gasket must be compressed to seal but not crushed. The actuator's closing force is set to compress the gasket evenly along all four sides; a sash that closes hard at the hinge and softly at the far edge, because its frame has twisted, leaks at the far corners. The sash frame is therefore made stiff and square, checked on the jig with its diagonals, and the hinge is fixed so that the sash closes flat onto its gasket without forcing.

### Power and wiring

RL-24's actuator and sensor run at extra-low voltage from a power supply installed in the ceiling space, which keeps the wiring on the roof safe to handle. The power supply's mains connection is electrical work for a licensed electrician. The cable from the roof light to the ceiling passes through the kerb in a sealed gland above the frame's condensation channel, never through the channel or the flashings, and is looped so that water running along it drips off before it reaches the gland.

## Ventilating area

The NCC 2022 Housing Provisions, clause 10.6.2, require openings for natural ventilation with a ventilating area of not less than **5%** of the floor area of the room, subject to the conditions in that clause; other building classes and editions have their own rules. For RL-24's 42 m² room, that is **2.10 m²**.

With its lower edge opened **300 mm** away from the frame, the sash stands at about **26.9°** to its closed position. Air passes through the gap along its lower edge, about **0.6 × 0.3 = 0.18 m²**, and through the two triangular gaps at its sides, each about **½ × 662 × 300 mm ≈ 0.099 m²**. The geometric opening is about **0.38 m²**.

```figure
type: bars
title: RL-24's sash opening against the room's ventilating area
unit: m²
max: 2.5
caption: This is an illustration. The geometric opening overstates the effective area, because air turning through the side gaps meets resistance. The roof light adds high-level ventilation; the room's windows and glazed door provide most of the required area.
- Sash bottom gap, 600 × 300 mm | 0.18
- Sash side triangles, two | 0.20
- *Sash total, geometric | 0.38
- NCC 2022 Housing Provisions 5% of 42 m² | 2.10
```

The roof light provides less than a fifth of the required area. Its value is position, not area: it is the highest opening in the room, so on a still evening, with a window open low on the other side, warm air rises and leaves through the sash while cooler air enters below. That **stack effect**, and how to calculate it, is worked through for louvres in *Louvres and Ventilators by the Numbers*; here, the point is that a small opening at the top of a room does a great deal more than its area suggests.

## People and the hole in the roof

A roof light is the commonest place for a roof worker to fall through a roof. SafeWork NSW has warned that skylights and plastic roof sheeting should be treated as non-trafficable unless certified otherwise. Safe Work Australia's information sheet on safe work on roofs lists controls for fragile roofs, including roof safety mesh, guard rails and covers, and notes that roof work becomes high-risk construction work where a person could fall more than 2 m (3 m in South Australia), requiring a safe work method statement. Roof safety mesh is covered by AS/NZS 4389.

RL-24's design and installation used these controls in order:

```figure
type: checklist
title: Fall controls for RL-24, from construction to the life of the building
caption: This is an illustration of one job's controls. The work health and safety law and codes of practice in each state or territory govern the actual controls, planned by the people in control of the work.
- x During framing, the opening is covered or guarded | a fixed cover screwed over the opening, marked, or guard rails around it
- x Roof safety mesh across the opening | fixed under the kerb by the roofer to the mesh maker's instructions, and left in place
- x Roof light glazed from a platform or the roof, never from the glass | the glass is not a working surface
- x Glass and drawing marked non-trafficable | label on the frame; handover notes say so
- ? Future roof work plans for the roof light | the handover record tells later trades where it is and what protects it
```

The owner agreed to keep the mesh permanently: seen from below, it is a faint grid across the light well. Without it, a later roof plumber, solar installer or antenna rigger who stepped back onto the glass would be relying on the laminate alone, which is not designed to carry a person and must not be treated as if it were.

## The water test

The roof light is tested for water before the light well is lined, so that any leak can be seen and traced. Chapter 2 hose tested the kerb before the roof light went on. Now the whole assembly is tested.

```figure
type: steps
title: RL-24's water test, from the bottom up
caption: This is an illustration of the shop's procedure. Testing from the lowest zone upwards means a leak appears while its own zone is being wetted, not after water from above has run down to it. An observer inside with a torch watches every joint.
- Eaves and kerb skirt | 5 minutes along each side, nozzle aimed at the skirt lap
- Corners and hip feet | 5 minutes at each corner, where the frame channel's boxed corners are
- Hips and commons | 5 minutes along each bar, working up
- *Opening sash closed | 5 minutes around its perimeter, then open and close it and repeat
- Ridge and ridge-end nodes | 5 minutes, the highest zone, last
- Weeps | confirm each weep drains, by pouring water into the frame channel inside
```

A leak found in testing is traced, fixed and the zone retested before the light well is lined. The test result, with the date, the zones and any repairs, goes into the handover record.

### Why the bottom-up order matters

Water runs downhill, inside a roof light as well as outside it. If the ridge were tested first and leaked, the water could run down inside the bars' channels, appear at the eaves and be blamed on an eaves joint that is perfectly sound. Testing each zone in turn from the bottom means that, when water first appears inside, the zone being wetted is the likely source, and the zones below have already been proved dry. The observer inside marks each drip on a sketch of the roof light with the time, and the person on the roof notes which zone was being wetted at that moment.

The test is also a test of the condensation path. Water poured into the frame channel from inside should run to the weeps and out within a minute or so. A weep that does not drain is cleared before the light well is lined, because once it is lined the only sign of a blocked weep is the drip described in Chapter 6.

## Cleaning and maintenance access

A roof light that cannot be cleaned stops admitting light within a few years. Dust, pollen and leaves settle on the glass, especially along the cappings and at the eaves, and at 25° rain washes only some of it away. Cleaning RL-24's outer glass is roof work: it is done from the roof, with the fall controls described above, or from a platform, never by kneeling on the glass. The handover record says so, because the owner may not know, and the person cleaning windows is not always a roof worker.

The inside face is cleaned from below with an extension pole, which the raked ceiling and the shallow light well allow. The frame channels and weeps are inspected at the same time. Gaskets and sealants are inspected annually and replaced when they harden, crack or shrink away from the glass; their life is years, not decades, and they are cheaper to replace on a schedule than after a leak has stained the ceiling.

## The handover record

RL-24's handover record is a single page for the owner and the next tradesperson: the glass type, maker and thickness, with its coated face; the U-value and solar heat gain coefficient used in the design; the actuator and sensor model; the kerb heights and flashing material; the water test result; the fact that the glass is non-trafficable and that roof safety mesh is installed below it; and a simple maintenance list: clean the glass, check and clear the weeps, inspect the gaskets and sealant at the cappings and corners, test the rain sensor, once a year.

## A failure case: an actuator sized for weight

This is an illustration. On an earlier roof light, the installer chose an actuator by the sash's weight alone, a small chain unit rated at 50 N, comfortably above the 40 N or so the weight required. There was no wind sensor; the sash was controlled by a wall switch.

On a gusty afternoon with the sash open, a gust pulled the sash past the actuator's holding force. The chain was dragged out beyond its stroke, bent and jammed, and the sash would not close. Rain arrived an hour later. The detection was immediate and unpleasant: water on the floor.

The correction was a new actuator rated above twice the combined weight and wind force, a rain and wind sensor wired to close it, and a check of the sash hinge and frame fixings, one of which had been pulled partly out. The shop's sash schedule now records the weight force, the wind force at the sensor's set speed and the actuator's rated push and pull, side by side.

## How this applies to a small Australian business

Size an opening sash's actuator for wind as well as weight, in both directions, and fit a rain and wind sensor. Compare the sash's opening with the room's ventilation requirement, and value it for its height rather than its area. Plan the fall controls for the roof light from framing to the life of the building: covers, guard rails, roof safety mesh, labels and a handover record that tells later trades. Water test the assembly from the bottom up before the well is lined, and record the result.

## Exercise: a larger sash

A different roof light has a top-hung sash 900 mm wide and 800 mm long on the slope, pitched at 25°, weighing 14 kg. Using this chapter's method and teaching wind suction of 0.3 kPa, what edge force must its actuator hold? What geometric ventilating area does it give when its lower edge is opened 300 mm?

**Worked answer.** The weight is **14 × 9.81 ≈ 137 N**, acting at a horizontal distance of **400 × cos 25° ≈ 362.5 mm** from the hinge, a moment of about **49,800 N·mm** and an edge force of **49,800 ÷ 800 ≈ 62.2 N**. The wind force is **0.3 × 0.9 × 0.8 ≈ 0.216 kN = 216 N** at mid-length, adding **216 × 400 ÷ 800 = 108 N**. The actuator must hold about **170 N**, so one rated well above that in push and pull is chosen. The geometric opening is the bottom gap **0.9 × 0.3 = 0.27 m²** plus two side triangles of **½ × 0.8 × 0.3 = 0.12 m²** each, about **0.51 m²** in all.
