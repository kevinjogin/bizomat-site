---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: sparks-brushes-and-corona
order: 3
title: "Sparks, brushes and corona"
description: "How air breaks down, why points and edges make corona at low voltages, and how corona, brush, spark, propagating brush and cone discharges differ in where they occur and their energy."
draft: false
---

A static charge ends in one of two ways: it leaks away quietly, or the air breaks down and it discharges in a few nanoseconds to microseconds. Air is normally an excellent insulator, but in a strong enough field its few free electrons multiply in avalanches and a conducting channel of plasma forms. What that discharge looks like, and how much energy it releases, depends on the shape of the charged object, whether it is a conductor or an insulator, and what it discharges to. Those differences decide whether a discharge is a harmless glow at a needle point or a spark that ignites a solvent.

This chapter explains breakdown in air at atmospheric pressure and the strong fields at points and edges, then describes the main kinds of electrostatic discharge: corona, brush, spark, propagating brush and cone discharges. It works numbers for the case factory's powder line and window film, and ends with a plastic funnel on the powder hopper that crackled every time a box was emptied.

## Breakdown in air

At atmospheric pressure, the electrons in air collide with molecules every fraction of a micrometre. To ionise, an electron must gain about 15 eV between collisions, which needs a strong field: in a uniform field across a gap of a centimetre or more, breakdown occurs at about 3 MV/m, 3 kV per millimetre. A 10 kV charge on a person can therefore jump about 3 mm to a door handle. Shorter gaps need a somewhat higher field, because there is less distance for an avalanche to grow, and below a certain voltage, a few hundred volts in air, no spark can occur across any gap at all: that is the minimum of the Paschen curve, which the Library's [Plasma Surface Engineering by the Numbers](/reados/publications/plasma-surface-engineering-by-the-numbers/) explains at low pressure.

The physics is the same as in a plasma nitriding vessel, compressed into a far smaller space by the higher pressure. The mean free path in air at atmospheric pressure is less than a tenth of a micrometre, so everything that takes millimetres at a few hundred pascals happens within micrometres here, and a discharge channel is a thin, intense filament rather than a diffuse glow.

## Fields at points and edges

The field at the surface of a charged conductor is strongest where the surface is most sharply curved. For a sphere of radius r at voltage V, the surface field is V ÷ r. A rounded object at 10 kV with a radius of 100 mm has a surface field of only 0.1 MV/m, far below breakdown. The same 10 kV on an edge with a radius of 1 mm gives about 10 MV/m at the edge, well above it.

```figure
type: compare
title: Surface fields on charged conductors, E ≈ V ÷ r
cols: Voltage | Radius of curvature | Surface field | Air breaks down
rowhead: Object
- Rounded handle | 10 kV | 100 mm | 0.1 MV/m | No
- Sheet metal edge | 10 kV | 1 mm | about 10 MV/m | Yes, in a thin layer at the edge
- * Powder gun electrode tip | 80 kV | about 0.5 mm | about 160 MV/m | Yes: continuous corona
- Isolated enclosure corner in the booth | 30 kV | 5 mm | about 6 MV/m | Yes
caption: This is an illustration. V ÷ r is exact only for an isolated sphere and a guide for other shapes. Where the surface field exceeds about 3 MV/m, air breaks down close to the surface; whether that becomes a spark depends on how the field falls with distance.
```

Near a sharp point the field falls off quickly with distance, so breakdown happens only in a thin layer close to the point. The ionisation stays there, glowing faintly in the dark and hissing, and does not reach across to another object. That is corona. Near a large, gently curved conductor the field stays strong across the whole gap, so an avalanche that starts can grow all the way across: a spark.

## Corona

In a corona discharge, the ionised layer around the point produces a steady supply of ions of the same polarity as the point. They are repelled from it and drift outwards through the air, colliding constantly with air molecules, at a speed equal to their mobility times the field. Air ions have mobilities of about 2 × 10⁻⁴ m² per volt-second, so in a field of 300 kV/m they drift at about 60 m/s and cross the 250 mm from a powder gun to a part in about 4 milliseconds. They push the air along with them, making a gentle corona wind.

Corona is the useful discharge. Powder guns use it to charge powder (Chapter 6), ionisers to neutralise charged surfaces (Chapter 7), precipitators to charge fume particles (Chapter 9), and ozone generators to make ozone, which every corona makes in small amounts as a by-product. Its energy is spread out in time and space, and corona from a single point is generally not able to ignite flammable atmospheres, except highly sensitive ones such as hydrogen; equipment designed to make corona in hazardous areas is designed and certified for that use.

## Positive and negative corona

Corona looks and behaves differently depending on the point's polarity. Around a negative point, electrons are repelled outwards into weaker field and attach to oxygen molecules, forming negative ions; the discharge appears as tiny, regularly pulsing spots and can carry a larger, steadier current before it turns into a spark. Around a positive point, electrons are drawn in towards the point and the discharge forms a more uniform glow, with streamers reaching out at higher voltages. Negative corona produces more ozone.

These differences decide equipment design. Most corona powder guns run negative, because negative corona delivers more ions at a given voltage without sparking over to the part, and most industrial precipitators also use negative corona for the same reason. The ionising stage of small two-stage precipitators for indoor air, like the factory's welding fume collector, usually runs positive, because it produces much less ozone, which matters when the cleaned air is returned to a building (Chapter 9). Ionisers for neutralising static need both polarities, alternated or side by side, so that they supply ions of whichever sign the charged surface needs (Chapter 7).

## Brush discharges

A charged insulating surface cannot release its charge all at once, because charge cannot flow across it. When a rounded earthed conductor, such as a finger or a tool, approaches a charged insulator, the air between them breaks down in a branching discharge that collects charge from a limited patch of the surface: a brush discharge. It is audible as a crackle and visible in the dark as a short, branched glow.

Brush discharges carry much less energy than a spark from a conductor at the same voltage, because only part of the surface discharges and the channel has resistance, but they are not harmless. They can ignite many flammable gases and vapours. They are generally regarded as unable to ignite most dust clouds, though dusts with very low ignition energies are an exception, which is why the ignition energy of the material matters (Chapter 4).

## Sparks

A spark is a discharge between two conductors, one of them charged and isolated. Because charge flows freely within a conductor, the whole stored charge drains through the spark channel at once, and the full ½CV² is released in a fraction of a microsecond in a small volume. A spark from a charged person, an isolated metal drum or an enclosure that has lost its earth is therefore the most common cause of electrostatic ignition in industry, and also the easiest to prevent: earth the conductor (Chapter 5).

## Propagating brush and cone discharges

Two further discharges occur in particular situations and can be very energetic.

A propagating brush discharge occurs on a thin insulating layer, such as a plastic coating or liner, backed by a conductor and charged to a very high surface density, which can happen during pneumatic conveying of powder through plastic-lined pipes or when powder strikes a coated surface at speed. The conducting backing allows far more charge to sit on the thin layer than an isolated insulator could hold, and when it breaks down, the discharge spreads across the whole charged area at once, releasing energy comparable to a large spark.

A cone discharge, or bulking brush discharge, occurs in large silos and containers being filled with charged insulating powder, as discharges along the surface of the heap. It matters mainly for large vessels of powders with low ignition energies.

```figure
type: compare
title: Kinds of electrostatic discharge
cols: Where it occurs | Energy released | Ignition concern
rowhead: Discharge
- Corona | Sharp points and thin wires at high voltage | Low, spread over time | Only for the most sensitive gases
- Brush | From charged insulating surfaces to rounded earthed conductors | Limited, up to a few millijoules | Many gases and vapours; most dusts generally not
- * Spark | Between conductors, one charged and isolated | The full ½CV² of the conductor | Gases, vapours and many dusts
- Propagating brush | Thin insulating layers on conductors, highly charged | High, comparable to large sparks | Gases, vapours and dusts
- Cone | Heaps of charged insulating powder in large vessels | Rising with vessel size | Sensitive dusts in large silos
caption: General characteristics from the electrostatics literature; the guidance documents for electrostatic hazards give the conditions for each discharge in detail and should be used for a real assessment.
```

## Finding discharges

Discharges are easy to miss in a lit factory. The surest observation is in darkness, after a few minutes for the eyes to adjust, when corona and brush discharges show as faint glows. Crackling is the audible sign of brush discharges; a ticking or snapping from a machine often means repeated sparks from an isolated part. Instruments help: an electrostatic voltmeter shows which conductors are isolated and charged, and a field meter shows which insulating surfaces carry charge. The factory's survey records each observation with its location, the condition of the process at the time and the humidity, so that the same check can be repeated after a change.

## Discharges into electronics

For people, a discharge below about 2 to 3 kV goes unnoticed. For electronic components it is another matter. A discharge from a charged person into a component's pin drives a current pulse of around an ampere for a fraction of a microsecond through structures a few micrometres across, which can melt a junction or rupture a gate oxide. Many modern components are damaged by discharges of a few hundred volts or less, well below anything a person feels.

There is a second route that needs no person at all. A component sliding down a plastic tube or picked from a charged tray can itself become charged, and when one of its pins touches an earthed metal surface, the component discharges through its own internal structure in well under a nanosecond. Each of these mechanisms is represented by a standard test model, and Chapter 8 explains how an ESD-protected area deals with both.

## The case: discharges on the powder line and the window line

Walking the factory in the dark with the lights off, during a shutdown with the powder guns running on an empty conveyor, shows the discharges directly. The gun electrodes glow faintly with corona. An empty steel hanger hissing at its hook shows a corona from a sharp corner, harmless while the hanger is earthed. At the window line, peeling protective film from a polycarbonate window produces audible crackling as the operator's hand passes over it, brush discharges from the film to the hand. None of these is a spark, and none is dangerous on its own; each shows where charge is being generated and released, which is what a survey needs to know.

## When it goes wrong: the crackling funnel

Operators filling the powder line's fluidising hopper emptied 20 kg boxes of powder through a sieve into a plastic funnel resting on the hopper's rim. Several reported hearing crackling and, once, seeing a small blue spark between the metal sieve and the hopper rim. The sieve sat on the plastic funnel and touched nothing earthed.

Powder sliding down the box and through the sieve charged the plastic funnel, which then gave brush discharges, and charged the isolated metal sieve, which gave sparks to the hopper rim. The sieve's capacitance was about 30 pF; at the 15 kV measured on it with an electrostatic voltmeter, its stored energy was ½ × 30 × 10⁻¹² × 15,000² = 3.4 mJ, released in each spark. Above the hopper during filling there is a cloud of fine powder, exactly where the sparks occurred.

```figure
type: decision
title: Making the hopper filling safe
caption: This is an illustration. The comparison of the spark energy with the powder's minimum ignition energy is made in Chapter 4; the change was made before that comparison, on the principle that isolated conductors near powder clouds are not acceptable.
- Keep the funnel and add a warning sign | Leaves the spark source in place | Not adopted
- Earth the sieve with a clip lead | Removes the spark, but clips get left off | Not adopted alone
- * Replace funnel and sieve with a stainless steel funnel and sieve, bonded permanently to the earthed hopper | No isolated conductors, no large charged insulators | Adopted
- Operators wear dissipative footwear on the earthed platform | Keeps the operators from charging | Adopted
```

The new funnel and sieve are welded together and bonded to the hopper by a braided strap, and the hopper's earth is part of the monthly earth continuity check (Chapter 5). No crackling has been reported since, and the old plastic funnel was removed from the site so that it could not drift back into use.

## Exercise: an edge and a gap

A charged, isolated steel panel at 20 kV has a sheared edge with a radius of about 0.5 mm, and a flat face 6 mm from an earthed frame.

1. What is the approximate field at the edge, and does corona form there?
2. Could a spark jump the 6 mm gap from the flat face?
3. Why is the corona at the edge not the main concern?

**Answer.**

1. E ≈ 20,000 ÷ 0.0005 = 40 MV/m, far above 3 MV/m, so corona forms at the edge and slowly bleeds charge into the air.
2. The average field across the gap is 20,000 ÷ 0.006 = 3.3 MV/m, above the roughly 3 MV/m needed in a fairly uniform gap, so a spark is likely, releasing the panel's stored energy at once.
3. Corona at the edge releases energy slowly and in a thin layer; the spark from the face releases the whole ½CV² in a fraction of a microsecond. The panel's edge corona may even reduce its voltage over time, but it cannot be relied on to do so before a spark occurs. The panel should be earthed.
