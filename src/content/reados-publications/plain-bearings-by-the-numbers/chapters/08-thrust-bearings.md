---
book: plain-bearings-by-the-numbers
chapterSlug: thrust-bearings
order: 8
title: "Thrust bearings"
description: "Check a thrust face's area, unit load, sliding speed and PV, estimate its friction heat and oil flow with the BIZOMAT thrust tools, and see why tapered lands and tilting pads carry load."
draft: false
---

A fan's impeller does not only spin; it pulls. Air drawn into its eye and flung out radially leaves an unbalanced pressure on the impeller's back plate, and the shaft is pushed axially towards the inlet. Something must hold the shaft in place against that force, and in FB-75 it is a thrust face in the non-drive-end bearing: a white metal ring against which a collar on the shaft runs, separated, if all is well, by an oil film just like the journal's.

This chapter explains why a thrust face needs a wedge too, and how tapered lands and Michell's tilting pads provide one. It checks FB-75's thrust face with the BIZOMAT thrust bearing pad tool and thrust pad bearing check, adds its heat to the non-drive-end housing's balance, and looks at what happens when the thrust rises. It ends with a replacement thrust ring that arrived with a perfectly flat face.

## A thrust face needs a wedge

Two flat, parallel faces sliding over each other with oil between them generate no hydrodynamic pressure. The gap is uniform, so oil carried in at one edge leaves at the other at the same rate, and nothing pushes back against the load, as Chapter 1 explained for the journal. A plain flat thrust washer therefore runs in boundary or mixed lubrication, held apart only by the roughness of its surfaces and the oil trapped between them. It works at modest loads and speeds, rated by the PV methods of Chapter 2, and that is how most small thrust washers are used.

To carry a thrust on a full film, the face must be divided into pads, and each pad must present a converging gap to the oil arriving at it. There are two classic ways to do that.

```figure
type: compare
title: Three kinds of thrust face
cols: How the wedge forms | Carries | Typical use
rowhead: Kind
- Flat land or plain washer | No wedge; boundary or mixed film | Modest loads at modest PV | Small machines, low speeds, occasional thrust
- * Tapered land | Each pad has a machined taper, usually a few tens of micrometres, ending in a short flat land | Full film at its design speed and direction | Fans, pumps, motors with steady thrust in one direction
- Tilting pad (Michell or Kingsbury) | Each pad pivots and sets its own tilt | Full film over a wide range of speed and load; centre-pivoted pads in both directions | Turbines, large pumps, ship propeller shafts, heavy or variable thrust
caption: A tapered land is cheap and works well at the speed and direction it was designed for; a tilting pad adjusts itself and carries more.
```

Michell in Australia, who patented the pivoted pad thrust bearing in 1905, and Kingsbury in the United States, who developed the same idea independently, made it possible to carry the thrust of large ships' propellers on oil films instead of the multi-collar bearings that had preceded them, which ran hot and wore. Their insight was that a pad free to pivot will settle at the tilt that the film's own pressure dictates, so it always forms a wedge of the right shape, without the precise machining a fixed taper needs.

FB-75's thrust face is a tapered-land ring with six pads, each with a machined taper over most of its arc and a short flat land at the trailing end. Radial grooves between the pads bring oil to the leading edge of each.

## Pad area, unit load and sliding speed

A thrust face's working area is the annulus between its outside and inside diameters, less the grooves between the pads. Its unit load is the thrust divided by that area, and its sliding speed is usually taken at the mean diameter of the annulus.

```figure
type: formula
title: Thrust face area, unit load and mean sliding speed
formula: A = π ÷ 4 × (D_o² − D_i²) × coverage
formula: P = W ÷ A, V = π × (D_o + D_i) ÷ 2 × n ÷ 60,000
caption: Coverage is the fraction of the annulus occupied by pads rather than grooves. With diameters in mm and n in rpm, A is in mm², P in MPa and V in m/s.
- D_o, D_i | outside and inside diameters of the face, mm
- coverage | pad area ÷ annulus area
- W | thrust load, N
- n | speed, rpm
```

This is an illustration. FB-75's thrust face is 150 mm outside and 90 mm inside, with pads covering 80% of the annulus, and carries 2.5 kN at 1,480 rpm. The [thrust bearing pad tool](/tools/thrust-bearing-pads/) gives the pad area, unit load, mean sliding velocity and PV and compares them with allowable values. Entering those dimensions and the bearing maker's allowable unit load of 1.0 MPa for this tapered-land design, a fictional value for this illustration, and no PV limit, it gives the following.

```figure
type: steps
title: FB-75's thrust face in the thrust bearing pad tool
caption: This is an illustration. The allowable unit load is the bearing maker's fictional value for this tapered-land ring at its design speed.
- Pad area | π ÷ 4 × (150² − 90²) × 0.80 = 9,048 mm²
- Unit load | 2,500 ÷ 9,048 = 0.276 MPa, against 1.0 MPa
- * Mean sliding velocity | π × 0.120 × 1,480 ÷ 60 = 9.30 m/s
- PV | 0.276 × 9.30 = 2.57 MPa·m/s; not checked, no limit entered
- Verdict | WITHIN LIMITS
```

The sliding speed varies across the face, from 6.97 m/s at the inside diameter to 11.6 m/s at the outside, and the film is thinner and hotter towards the outside. The mean-diameter speed is the standard basis for comparison with makers' limits.

For a full-film thrust face, the unit load and PV are screening values, as they are for a journal: the real limits are the film's thickness at the trailing edge of each pad, the temperature of the white metal there, and the face's flatness. A pad's film is thinnest where its taper ends, and that edge runs hottest, so a thrust face that has been overloaded usually shows it first as smearing or cracking at the trailing edges of its pads near the outside diameter. Makers of tapered-land and tilting-pad bearings calculate those quantities for their designs and publish allowable loads that already include them.

## Friction, heat and oil flow

A thrust face's friction loss is its friction coefficient times the load times the sliding speed. For a full-film thrust face, the coefficient depends on the film like a journal's, and makers give it for their designs; for a quick estimate, a value for the type of bearing is entered. The [thrust pad bearing check](/tools/thrust-pad-bearing-check/) extends the pad calculation with the friction loss and the oil flow needed to carry it at an allowed temperature rise, compared with the oil available.

This is an illustration. With the same dimensions and load, a friction coefficient of 0.005, an allowed oil temperature rise of 10 K, oil of 870 kg/m³ and 1.9 kJ/(kg·K), the plant's allowable unit load of 1.0 MPa and PV of 20 MPa·m/s, and an oil supply available to the thrust face of 0.50 L/min, which is what remains of the non-drive-end ring's 1.2 L/min after its journal's side flow of about 0.70 L/min, the tool gives:

```figure
type: stats
title: FB-75's thrust face in the thrust pad bearing check
caption: This is an illustration. The friction coefficient of 0.005 is an assumed value for a tapered-land face at its design point; the bearing maker's figure should be used for a real design.
- 0.276 MPa | Unit load | against 1.0 MPa
- 2.57 MPa·m/s | PV | against 20
- * 116 W | Friction power loss | 0.005 × 2,500 N × 9.30 m/s
- 0.42 L/min | Oil flow to carry it at 10 K | against 0.50 L/min available
```

The verdict is BEARING ADEQUATE, but the oil margin is narrow: the thrust face needs 0.42 of the 0.50 L/min left by the journal. And its 116 W goes into the same housing as the non-drive-end journal's friction, which Chapter 6's heat balance must include.

## The non-drive-end housing's heat balance

This is an illustration. The non-drive-end housing is larger than the drive end's, to hold the thrust face, and sheds 8.0 W per kelvin. Its journal carries 4.5 kN. With 30 °C air, and the thrust face's 116 W added to the journal's friction, the heat balance of Chapter 6 settles at 68.7 °C, with the journal making 193 W, an eccentricity ratio of 0.483 and a thinnest film of 31.0 µm. Without the thrust face the same housing would settle at 60.9 °C. The thrust face raises the housing's temperature by almost 8 K, which is why its friction coefficient is worth asking the maker for rather than assuming.

## When the thrust rises

A fan's thrust is not constant. It rises and falls with the pressure difference across the impeller, which changes with flow, damper position and the condition of the inlet. The fan maker gives the thrust at the design point and usually a maximum; the thrust face must be checked at the maximum.

```figure
type: compare
title: FB-75's thrust face and non-drive-end housing at two thrusts
cols: Unit load | Friction loss | Oil needed at 10 K | Housing temperature, 30 °C air
rowhead: Thrust
- * 2.5 kN, design point | 0.276 MPa | 116 W | 0.42 L/min | 68.7 °C
- 4.0 kN, damper nearly closed | 0.442 MPa | 186 W | 0.68 L/min | 73.9 °C
caption: This is an illustration. Thrust pad bearing check with a friction coefficient of 0.005; housing heat balance at 8.0 W/K with the journal's short-bearing friction.
```

At 4.0 kN the unit load is still well within the face's allowable 1.0 MPa, but the oil needed, 0.68 L/min, exceeds the 0.50 L/min the ring leaves for the thrust face, and the tool reports the bearing as not adequate on oil supply. The housing would also run 5 K hotter. A fan that spends long periods with its damper nearly closed needs either a better oil supply to its thrust face, a lower friction design, or an operating rule that avoids that region.

## Locating the shaft and letting it grow

The thrust face does a second job besides carrying the impeller's pull: it locates the shaft axially, so that the impeller stays centred in its casing and the coupling stays within its limits. Only one bearing on a shaft should do this. FB-75's non-drive-end bearing is the locating bearing; its drive-end bearing is a free journal bearing whose shell lets the journal slide axially.

The reason is thermal growth. In running, the shaft between the bearings is warmer than it was when the machine was assembled, and it grows. This is an illustration. If FB-75's steel shaft has 1.2 m between bearing centres and runs on average 40 K above its assembly temperature, it grows by 1.2 × 11.5 × 10⁻⁶ × 40 = 0.55 mm. If both bearings tried to locate the shaft, that growth would be resisted by the thrust faces, loading them with a force limited only by the shaft's stiffness and their own collapse. With one locating bearing and one free bearing, the shaft simply slides through the free bearing's shell by half a millimetre, which a plain journal bearing allows without complaint.

The locating bearing also needs a small axial clearance, the end float, between the collar and its thrust faces, so that the film can form and the collar does not bind as parts warm. It is typically a few tenths of a millimetre, set by shims or by machining at assembly and recorded in the rebuild sheet, because too little float overheats the thrust face and too much lets the impeller wander in its casing when the thrust reverses at start-up or shutdown. FB-75's maker specifies the end float; the plant measures it with a dial indicator on the shaft end while barring the shaft from one face to the other, and checks it at every rebuild alongside the journal clearances of Chapter 5.

## The error: a flat thrust ring

This is an illustration. During a rebuild, the non-drive-end thrust ring was replaced with one from a general machinery supplier, described as "white metal faced, 150 × 90 mm, to suit". The fitter checked its dimensions and thickness, both correct, and installed it. The ring's face was flat and polished, with radial grooves between six pads but no tapers.

The fan ran normally for a week at its usual damper setting. During a production change that closed the damper partly, the non-drive-end bearing's temperature climbed through its 80 °C alarm and the fan tripped on its 90 °C limit. On inspection, the thrust face was smeared: its white metal had softened and flowed at the outside diameter of the pads.

The reliability engineer explained it with Chapter 2's numbers. A flat face forms no wedge, so it runs in mixed lubrication, and its limit is PV, not film thickness. At the design thrust its PV was 2.57 MPa·m/s, and at the higher thrust 4.11 MPa·m/s. The white metal face's maker gives a limit for boundary-lubricated running of 1.0 MPa·m/s, a fictional value for this illustration; the flat ring had been running above it even at the design point, surviving only because the oil from the grooves and the polished surface kept the friction modest. With a mixed-film friction coefficient of perhaps 0.05, ten times the tapered land's, the friction at 4.0 kN would have been about 1.9 kW, far more than the housing could shed.

```figure
type: compare
title: The thrust face with tapers and without, at 4.0 kN
cols: Lubrication | Friction coefficient | Friction loss
rowhead: Face
- * Tapered land, as designed | Full film | about 0.005 | 186 W
- Flat land, as supplied | Mixed film | perhaps 0.05 | about 1,860 W
caption: This is an illustration. Friction coefficients are assumed values of a plausible order. The flat face's PV of 4.11 MPa·m/s is four times its boundary limit.
```

The ring was replaced with a tapered-land ring to the bearing maker's drawing. The plant's rebuild procedure now treats thrust rings like journal shells: they are bought to the bearing maker's drawing or specification, which states the taper, its depth and its direction of rotation, and the face is inspected for its tapers before installation. A tapered-land ring installed for the wrong direction of rotation is as useless as a flat one, because its tapers then diverge.

## Bringing it together

A thrust face needs a converging film like a journal, and gets it from machined tapered lands or from Michell's pivoted pads; a flat face runs in mixed lubrication and is rated by PV. The thrust tools give FB-75's face a unit load of 0.276 MPa at a mean sliding speed of 9.30 m/s, a friction loss of about 116 W and an oil need of 0.42 L/min, which uses most of what its housing's ring leaves after the journal. The thrust face's heat raises the non-drive-end housing to 68.7 °C. At the higher thrust of a nearly closed damper, the oil supply, not the load, becomes the limit. The next chapter looks at the moments when no bearing in FB-75 has a full film: starting and stopping.

## Exercise: a larger thrust ring

To give more oil margin at the 4.0 kN thrust, the plant considers a tapered-land ring of 170 mm outside and 90 mm inside diameter, with 80% coverage, in a housing modified to suit. Using the thrust pad bearing check with the same friction coefficient and oil properties, find the pad area, unit load, mean sliding speed, PV, friction loss and oil needed at 10 K.

**Worked answer.** This is an illustration. The pad area is π ÷ 4 × (170² − 90²) × 0.80 = **13,069 mm²**, so the unit load is 4,000 ÷ 13,069 = **0.306 MPa**. The mean sliding speed is π × 0.130 × 1,480 ÷ 60 = **10.07 m/s**, and PV is **3.08 MPa·m/s**. The friction loss is 0.005 × 4,000 × 10.07 = **201 W**, and the oil needed at 10 K is **0.73 L/min**. The larger ring lowers the unit load but raises the sliding speed and so the friction and oil need. It does not solve the supply problem; a second oil ring, or a small pumped feed to the thrust face, would.
