---
book: plain-bearings-by-the-numbers
chapterSlug: how-an-oil-film-carries-load
order: 1
title: "How an oil film carries load"
description: "See how a converging oil film generates pressure, how a journal makes its own wedge, how boundary, mixed and full-film lubrication differ, and why heavier oil is not a cure for friction."
draft: false
---

In 1883 Beauchamp Tower was measuring friction in a railway axle bearing for the Institution of Mechanical Engineers when he drilled an oil hole in the top of the bearing's cap, in the middle of the loaded zone. Oil welled out of the hole instead of running in. When he plugged it, the plug was pushed out. A gauge fitted to the hole showed a pressure far higher than anything the oil supply could produce, high enough to carry the axle's load. The shaft was floating on oil it was pumping for itself.

Osborne Reynolds explained the result three years later in a paper that founded the theory of lubrication. This chapter follows his explanation: how a fluid dragged into a narrowing gap builds pressure, how a turning shaft creates its own narrowing gap by moving off centre, and how the three regimes of lubrication, boundary, mixed and full film, arise. It introduces the running case, FB-75's fan bearings, and ends with a supplier's suggestion that a heavier oil would reduce the bearings' friction.

## The wedge

Take two surfaces separated by oil, one stationary and one sliding, and tilt them so that the gap narrows in the direction of sliding. The moving surface drags oil with it, because oil sticks to both surfaces and the layers in between are sheared, as in Chapter 1 of Viscosity by the Numbers. If the gap were uniform, the oil carried in at the wide end would leave at the other end at the same rate. But the gap narrows, so the shear flow at the narrow end can carry less oil than enters at the wide end. Something must make up the difference, and that something is pressure: oil pressure rises inside the gap until it pushes back against the incoming flow and squeezes extra oil out at the narrow end and at the sides. The pressure, acting over the surface area, carries load.

```figure
type: svg
title: A converging oil film generates pressure
alt: A long lower plate moves to the right beneath a short upper pad tilted so that the oil gap is wider at its left end than its right. Arrows show oil dragged into the wide end. Above the pad, a curve rises from zero at the left edge to a peak near the right end and falls back to zero at the right edge, showing the film pressure. A downward arrow on the pad marks the load the pressure carries.
caption: The sliding surface drags oil into the narrowing gap. To keep the flow continuous, pressure rises inside the film, peaking towards the narrow end. The integral of that pressure over the pad carries the load. Gap thickness is greatly exaggerated.
viewbox: 0 0 640 300
body:
<rect class="bx" x="40" y="230" width="560" height="24" rx="2"/>
<text class="tx txs" x="50" y="276">moving surface, speed U</text>
<path class="la" d="M420 266H560"/>
<path class="ah" d="M572 266l-12-6v12z"/>
<path class="li" d="M180 190L460 216L460 196L180 140Z"/>
<rect class="bxi" x="180" y="120" width="280" height="20"/>
<path class="ln" d="M180 190L180 230M460 216L460 230"/>
<text class="tx txs" x="120" y="214">wide gap</text>
<text class="tx txs" x="470" y="226">narrow gap</text>
<path class="la" d="M90 214H160"/>
<path class="ah" d="M172 214l-12-6v12z"/>
<text class="txa" x="60" y="200">oil dragged in</text>
<path class="la" d="M180 100C260 98 330 80 400 50C430 40 445 70 460 100"/>
<text class="txa" x="300" y="44">film pressure</text>
<path class="li" d="M320 20V80"/>
<path class="fi" d="M320 88l-6-12h12z"/>
<text class="txb" x="330" y="30">load</text>
```

Three things are needed: relative sliding, a viscous fluid between the surfaces, and a gap that converges in the direction of sliding. Take any one away and the pressure vanishes. That is why a stationary shaft cannot carry its load on a film, why a bearing with no oil wipes, and why a gap that diverges generates suction, not pressure.

Reynolds wrote this balance between shear-driven flow, pressure-driven flow and gap shape as a single equation, the Reynolds equation, which every hydrodynamic bearing calculation since has solved in one form or another. The calculations in this book use one of its classic approximate solutions, for bearings that are short compared with their diameter.

## How a journal makes its own wedge

A journal bearing has no tilted pad. Its shaft, the journal, turns in a slightly larger bore, and the clearance between them, a few hundredths of a millimetre, is the same all round when the journal is centred. A centred journal generates no pressure, because a uniform gap has no wedge. Under load, though, the journal is pushed off centre. The gap then narrows on one side and widens on the other, and the narrowing side is a wedge into which the turning journal drags oil. Pressure builds there and pushes the journal back. The journal settles at the position where the film's pressure exactly balances the load.

The offset of the journal's centre from the bore's centre is the eccentricity, and divided by the radial clearance it is the eccentricity ratio, from 0 for a centred journal to 1 for a journal touching the bore. A lightly loaded or fast bearing runs nearly centred; a heavily loaded or slow one runs close to the bore. Chapter 4 calculates where FB-75's journals settle and how thin the film is at its narrowest.

## The family of plain bearings

"Plain bearing" covers a wide family, from a greased bronze bush in a hinge to the tilting-pad bearings of a power station turbine. They differ mainly in how much of their life they spend in a full film and in how the oil reaches them.

```figure
type: compare
title: Common kinds of plain bearing
cols: Usual lubrication | Usual regime | Typical use
rowhead: Kind
- Dry or polymer bush | None, or solid lubricant in the material | Boundary | Pivots, linkages, slow or oscillating motion
- Oil-impregnated sintered bush | Oil held in the pores | Boundary to mixed | Small motors, fans and appliances
- Greased bronze or steel bush | Grease, topped up | Boundary to mixed | Pins, slow heavy pivots
- * Oil-ring or bath-lubricated sleeve | Oil lifted from a sump by a ring | Full film in running | Fans, pumps, motors, FB-75
- Pressure-fed sleeve | Oil pumped in from a system | Full film | Engines, compressors, large motors
- Tilting-pad journal or thrust | Pressure-fed or flooded | Full film | Turbines, high-speed or heavily loaded shafts
- Hydrostatic | Oil supplied under high pressure | Full film even at rest | Machine tool ways, telescopes, very slow heavy shafts
caption: Chapter 2 deals with bushes that work in boundary or mixed lubrication; the rest of the book with bearings that run on a full film.
```

The distinction that matters most for calculation is between bearings that run on a full hydrodynamic film and those that do not. A full-film bearing is designed by calculating the film, as Chapters 3 to 7 do; a bush that runs in boundary or mixed lubrication is chosen by its material's limits on load, speed and their product, as Chapter 2 does. Using one method on the other kind of bearing is a common and costly error.

Hydrostatic bearings deserve a word because they look similar and work differently. Their pressure comes from an external pump, fed into pockets in the bearing surface through restrictors, and it carries the load whether the shaft turns or not. They need a pump, filtration and a supply that must never fail, and they are used where a hydrodynamic film cannot form, at zero or very low speed, or where extreme stiffness and accuracy are needed. Tower's oil hole, which let film pressure escape, is a reminder that a hydrodynamic bearing's oil feed must never be placed where the film is generating its pressure, a point Chapter 7 returns to.

## Three regimes of lubrication

The film does not appear all at once. When a machine starts, its journal sits on the bottom of its bore, touching through the peaks of the surface roughness on both parts, with nothing but adsorbed oil and additive films between them. As it speeds up, the wedge begins to work and the film thickens until it separates the surfaces completely. Each stage has its own friction and its own wear.

```figure
type: compare
title: The three regimes of lubrication in a plain bearing
cols: Film | Friction | Wear | Where FB-75 meets it
rowhead: Regime
- Boundary | Thinner than the surface roughness; load carried by contact | High, set by the surface films and materials | Possible | Starting from rest; turning by hand
- Mixed | About the size of the roughness; load shared by film and contact | Falling steeply with speed | Light | The first seconds of a start and the last of a stop
- * Full film (hydrodynamic) | Many times the roughness; no contact | Low, rising slowly with speed and viscosity | Almost none | Normal running at 1,480 rpm
caption: The film thickness compared with the surface roughness decides the regime. Chapter 9 calculates when FB-75's film forms.
```

Stribeck plotted friction against speed for bearings at the start of the twentieth century and found the curve that now carries his name: high friction at low speed, falling steeply to a minimum as the film forms, then rising slowly as the full film's viscous shear grows with speed. The useful variable for the horizontal axis, often called the Hersey number, groups the viscosity, speed and unit load: viscosity times speed divided by unit load. A higher Hersey number means a thicker film.

```figure
type: steps
title: Reading the Stribeck curve from left to right
caption: A qualitative description; the numbers depend on the bearing, the surfaces and the oil.
- Rest and very low speed | Boundary friction; surfaces in contact through their roughness
- Rising speed or viscosity | The wedge builds pressure; contact falls; friction drops steeply (mixed)
- Minimum friction | The film just separates the surfaces; little margin
- * Normal design point | Film several times thicker than needed; friction rising slowly
- Very high speed or viscosity | Full film throughout, but viscous shear makes friction and heat climb
```

A well-designed bearing runs to the right of the minimum, where a disturbance that thins the film, such as a load spike or a hot spell, moves it towards lower friction rather than into contact. That margin is what Chapters 4 to 6 quantify.

## Viscosity is what the wedge uses

The pressure in the wedge is proportional to the oil's dynamic viscosity: double the viscosity and, at the same speed and geometry, the film carries double the load, or carries the same load with the journal closer to centre. Viscosity, the property the companion book explains from the motion of molecules, is therefore the material property of the film, much as Young's modulus is the material property of a spring. And because it falls steeply with temperature, a bearing's capacity and its temperature are tied together, the theme of Chapter 6.

Speed works the same way as viscosity, because the wedge's pumping is proportional to how fast the journal's surface drags the oil. Load works the other way: the heavier the load, the further the journal must move off centre to generate enough pressure, and the thinner the film becomes. The bearing's dimensions enter through its clearance and its length. A tighter clearance makes a sharper wedge for the same eccentricity, and a longer bearing loses less oil from its ends, so both raise the film's capacity, though each has costs that Chapters 5 and 6 weigh. These four influences, viscosity and speed against load and geometry, are combined in a single number, the Sommerfeld number, in Chapter 4.

## What the film needs from the machine

A film a few hundredths of a millimetre thick is easily upset by things that have nothing to do with the bearing's calculation. Five conditions decide whether the calculated film exists in practice.

```figure
type: checklist
title: What a hydrodynamic film needs from the machine around it
caption: Each of these is a common cause of a bearing that "should have worked" on paper.
- Alignment | A journal tilted in its bore pinches the film at the bearing's ends; misalignment of a few hundredths of a millimetre across the length matters
- Geometry | Round, straight, smooth journals and bores; out-of-roundness and taper eat into a thin film
- Clean oil | Particles larger than the thinnest film pass through the gap only by scoring or embedding
- Enough oil | The wedge must be fed continuously, or it runs dry from the inlet side
- Temperature in range | Hot oil thins the film; Chapter 6 finds where the balance settles
- x Treat the calculated film as a guarantee | It is the film in an ideal bearing; the machine decides how much of it is left
```

Particles show how directly these conditions bite. Any hard particle larger than the thinnest part of the film, 28.6 µm in FB-75's bearings when running and only a few micrometres during starts and stops, must either be pushed into the soft white metal lining, where it embeds harmlessly, or be dragged through the gap, where it scores the journal. White metal's ability to swallow such particles, called embeddability, is one of the reasons it is used, and Chapter 9 discusses it. Clean oil, a clean assembly and a sealed housing remain the first line of defence.

## The running case: FB-75's bearings

This is an illustration. FB-75's journals are 80 mm in diameter in bearings 60 mm long, turning at 1,480 rpm. Each bearing carries 6.0 kN. Three numbers summarise the duty.

```figure
type: stats
title: FB-75's journal bearing duty
caption: This is an illustration. Unit load is the load divided by the projected area, diameter times length. Chapter 4 finds the film thickness at the bearing's running temperature of about 66 °C.
- 1.25 MPa | Unit load | 6,000 N ÷ (80 × 60) mm²
- 6.20 m/s | Journal surface speed | π × 0.080 m × 1,480 ÷ 60
- * 28.6 µm | Thinnest oil film when running | at about 66 °C
- 0.75 | Length ÷ diameter | 60 ÷ 80
```

The film is thick compared with the surfaces it separates. The journal is ground to a roughness average (Ra) of 0.4 µm and the white metal bore is fine-bored to 0.8 µm Ra. Converting each to a root-mean-square roughness, about 1.25 times the average for typical machined surfaces, and combining them as the square root of the sum of squares gives a composite roughness of about 1.12 µm. The film is 28.6 ÷ 1.12 = about 26 times thicker: a full film with a wide margin. That ratio, the film thickness ratio, appears again in Chapter 9, where the BIZOMAT film thickness ratio tool calculates it.

## The error: a heavier oil to cut friction

This is an illustration. During a review of the plant's energy use, a lubricant supplier proposed changing FB-75's bearings from VG 68 to VG 100, arguing that "a heavier film reduces friction and wear". The maintenance planner asked the reliability engineer to check the claim before the change.

The engineer recognised the argument as belonging to the left-hand side of the Stribeck curve, where more viscosity does reduce friction by thickening a film that is not yet complete. FB-75's bearings run far to the right of the minimum, with a film 26 times the roughness. There, friction is viscous shear, and more viscosity means more friction. At the same 66 °C, the VG 100 oil, with 100 mm²/s at 40 °C and 11.2 mm²/s at 100 °C, would have a dynamic viscosity of 26.4 mPa·s against the VG 68's 19.1 mPa·s, and the calculation of Chapter 4 gives a friction loss of 287 W per bearing against 217 W, 32% more.

```figure
type: compare
title: FB-75's drive-end bearing on VG 68 and on VG 100
cols: Running temperature | Friction loss | Thinnest film
rowhead: Oil
- * VG 68, as now | 66.1 °C | 217 W | 28.6 µm
- VG 100, same temperature | 66.1 °C | 287 W | 32.6 µm
- VG 100, after the heat balance settles | 70.9 °C | 246 W | 30.3 µm
caption: This is an illustration. Short-bearing solution of Chapter 4 with the housing heat balance of Chapter 6. The heavier oil raises friction and temperature and thickens a film that was already 26 times the roughness.
```

The extra heat would not stay put. With the housing's fixed ability to shed heat, the bearing would settle 4.8 K hotter, at 70.9 °C, where the heavier oil thins and the loss settles at 246 W, still 13% more than now. In return the film would thicken by 6%, from 28.6 to 30.3 µm, an improvement the bearing did not need. The change was not made. The engineer's note to the planner made the general point: in a bearing running in full film, a heavier oil increases friction; it helps only a bearing whose film is too thin, and the way to know which applies is to calculate the film.

## Bringing it together

A hydrodynamic bearing works because a sliding surface drags viscous oil into a converging gap, raising a pressure that carries the load. A journal creates its own converging gap by running off centre. Friction and wear depend on how the film compares with the surface roughness: boundary, mixed or full film, along the Stribeck curve. FB-75's bearings run in full film, 28.6 µm thick against 1.12 µm of roughness, where friction comes from viscous shear and a heavier oil adds to it. The next chapter turns to the bushes that never reach a full film, and the screening checks used for them.

## Exercise: a coarser bore

A replacement bearing shell for FB-75 arrives with its white metal bored to 1.6 µm Ra instead of 0.8 µm. Estimate the new composite roughness and film thickness ratio at the running film of 28.6 µm, and say whether the coarser finish matters in running. Where might it matter more?

**Worked answer.** This is an illustration. The root-mean-square roughnesses are about 1.25 × 0.4 = 0.5 µm for the journal and 1.25 × 1.6 = 2.0 µm for the bore. The composite is √(0.5² + 2.0²) = **2.06 µm**, and the film thickness ratio is 28.6 ÷ 2.06 = **13.9**, still a full film with a wide margin. In running, the coarser bore makes little difference. It matters more at starting and stopping, where Chapter 9 shows the film is a few micrometres thick: there, the coarser peaks touch at a higher speed and for longer. A fitter would also expect the coarse peaks to be worn down in the first hours of running, which is why a bearing maker's specified finish should be insisted on.
