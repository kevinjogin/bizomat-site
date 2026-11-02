---
book: shaft-alignment-by-the-numbers
chapterSlug: what-misalignment-is
order: 1
title: "What misalignment is and what it costs"
description: "How to describe shaft misalignment as offset and angularity in two planes, convert between the units in use, and understand what misalignment does to couplings, bearings and seals."
draft: false
---

Two shafts are aligned when their centrelines form one straight line at the coupling while the machines run. Everything else in this book serves that sentence. It contains three ideas worth separating at the start: the centrelines, not the shaft surfaces, are what must line up; they must line up at the coupling, where the shafts meet; and they must do so while running, at working temperature, not only on the day of installation.

This chapter sets out how misalignment is described, in what units, and with what consequences. It introduces the HW-3 hot water pump set in the state it was found after the motor was first set on its baseplate, and uses the KEVOS® shaft angular offset tool to put its angularity in every unit a fitter is likely to meet.

## Two kinds of misalignment, in two planes

Any misalignment of two shafts can be described by two quantities in each of two planes.

- **Offset**, also called parallel misalignment, is the distance between the two centrelines at a stated point along them, usually the coupling's centre or the plane where the readings are taken.
- **Angularity**, also called angular misalignment, is the angle between the two centrelines, usually expressed as a slope: millimetres of change per 100 mm of length.

Real misalignment is nearly always a mix of both. It is described separately in the vertical plane, which the fitter corrects with shims under the feet, and the horizontal plane, which is corrected by moving the feet sideways. Four numbers therefore describe the alignment state of a coupled pair: vertical offset, vertical angularity, horizontal offset and horizontal angularity.

```figure
type: svg
title: Offset and angularity between two shaft centrelines
alt: Two horizontal shafts meet at a coupling in the middle. In the left panel, the right shaft is parallel to the left one but lower, with the gap between their centrelines labelled offset. In the right panel, the right shaft is tilted down from the coupling, with the angle between the centrelines labelled angularity, and a short triangle shows a rise of a given amount over 100 millimetres.
caption: Offset is a distance and depends on where along the shafts it is measured unless the angularity is zero. Angularity is the same wherever it is measured. A real pair has both, in both planes.
viewbox: 0 0 640 260
body:
<rect class="bx" x="20" y="90" width="120" height="30"/>
<rect class="bx" x="150" y="110" width="120" height="30"/>
<path class="ln dsh" d="M20 105H280M150 125H290"/>
<path class="la" d="M285 105V125"/>
<text class="txb" x="200" y="80">offset</text>
<rect class="bx" x="350" y="90" width="120" height="30"/>
<path class="bx" d="M480 92L598 112L594 142L476 122Z"/>
<path class="ln dsh" d="M350 105H620M478 107L620 131"/>
<path class="la" d="M560 105V124"/>
<text class="txb" x="520" y="80">angularity</text>
<text class="tx txs" x="570" y="160">rise per 100 mm</text>
<text class="tx txs" x="40" y="190">stationary</text>
<text class="tx txs" x="170" y="190">movable</text>
<text class="tx txs" x="370" y="190">stationary</text>
<text class="tx txs" x="500" y="190">movable</text>
```

### Which machine moves

One machine is chosen as stationary and the other as movable, and all corrections are made by moving the movable machine's feet. The choice is practical: the machine with pipes attached, the heavier machine or the one whose position is fixed by its process usually stays put. For the HW-3, the pump is stationary because its suction and discharge pipes are fixed to it, and the motor moves.

### Where offset is measured

Offset changes along the shafts whenever there is angularity, so an offset number means nothing without its location. This book, and the KEVOS® alignment tools, report offset at the plane where the rim readings are taken, on the movable machine's coupling hub. Many tolerance tables, and most laser systems, report it at the coupling's centre instead. Converting between the two takes one line, as the exercise at the end of this chapter shows.

## The HW-3 as found

After the motor was set on its baseplate, bolted down and checked with dial indicators, with the readings corrected for bracket sag as Chapter 5 explains, the HW-3 showed this state. This is an illustration.

```figure
type: compare
title: HW-3 alignment as found, cold, at the reading plane
cols: Offset at the reading plane | Angularity | Meaning
rowhead: Plane
- * Vertical | 0.25 mm | −0.04 mm per 100 mm | motor shaft low at the coupling, and rising slightly towards its back feet
- Horizontal | 0.15 mm | +0.06 mm per 100 mm | motor shaft displaced sideways, and further away towards its back feet
caption: This is an illustration. Readings sag-corrected. Signs follow the convention of the KEVOS® rim and face alignment tool in Chapter 6. The site's running tolerance is 0.05 mm offset and 0.05 mm per 100 mm angularity.
```

The offsets are five and three times the site's tolerance. The angularities are close to it. That pattern, large offset and modest angle, is typical of a motor placed by eye and bolted down: its shaft is roughly parallel to the pump's but not in line with it.

## Units of angularity

Angularity is a small angle, and it is quoted in several units. The [shaft angular offset tool](/tools/shaft-angular-offset/) converts an offset change across a known axial span into degrees, milliradians and millimetres per 100 mm. The HW-3's vertical face reading changed by 0.06 mm across the 150 mm circle on which the face indicator ran.

```figure
type: steps
title: The HW-3 vertical angularity in the shaft angular offset tool
caption: This is an illustration. Relative offset change 0.06 mm across an axial span of 150 mm.
- Angular misalignment | 0.0229°
- Angular misalignment | 0.400 mrad
- * Slope | 0.040 mm per 100 mm
```

The same angle is 0.40 mm per metre, or 0.40 thousandths of an inch per inch, a unit still common in imperial tolerance tables and on older laser systems. The horizontal angularity, 0.09 mm across 150 mm, converts to 0.0344°, 0.600 mrad and 0.060 mm per 100 mm.

```figure
type: compare
title: One angle in the units a fitter meets
cols: HW-3 vertical | HW-3 horizontal | Conversion
rowhead: Unit
- * mm per 100 mm | 0.040 | 0.060 | the slope in this book
- mm per metre | 0.40 | 0.60 | × 10
- mrad | 0.400 | 0.600 | equal to mm per metre for small angles
- Thousandths of an inch per inch | 0.40 | 0.60 | equal to mm per metre
- Degrees | 0.0229 | 0.0344 | mrad × 0.0573
caption: This is an illustration. For the small angles of alignment work, mm per metre, milliradians and thousandths of an inch per inch are all the same number.
```

## What misalignment does

A flexible coupling is designed to accept some misalignment, but accepting it is not free. To run misaligned, a coupling's flexible element must bend, slide or compress once every revolution, and it pushes back on the two shafts while it does. Those reaction forces and moments go into the bearings, the seals and the shafts, every revolution, for the life of the machine.

```figure
type: steps
title: Where the cost of misalignment goes
caption: The size of each effect depends on the coupling type, its stiffness and the speed. The direction is the same for all: more misalignment, more cyclic load.
- Coupling | the flexible element works every revolution: wear, heat, fatigue of discs or grids, cracking of elastomer
- Bearings | extra radial and axial load from the coupling's reactions shortens their life
- Seals | mechanical seal faces and lip seals run eccentrically and wear or leak
- Shafts | an extra rotating bending stress adds to fatigue loading, most at keyways and shoulders
- Energy | some power turns into heat in the coupling and bearings
- Vibration | commonly at once and twice running speed, often with a strong axial component
```

Misalignment is not the only cause of those symptoms, and vibration analysts take care to separate it from unbalance, looseness, bent shafts and resonance. But it is one of the most common causes of early bearing and seal failures in pumps and fans, and it is one of the cheapest to correct. Balancing and its effects are covered in [Whirling Shafts by the Numbers](/reados/publications/whirling-shafts-by-the-numbers/unbalance-and-balance-grades/); this book deals with alignment.

### A rough size for the forces

The forces are easy to underestimate because the misalignments are so small. Suppose the HW-3's flexible coupling had a radial stiffness of 1,500 N/mm, a figure of the order that coupling makers list for elastomeric couplings of this size. This is an illustration. Forcing it through the as-found vertical offset of 0.25 mm would take a radial force of about 1,500 × 0.25 = 375 N, reversing in direction relative to each shaft once every revolution, 1,480 times a minute. That is a sizeable share of the radial load on the pump's bearings, added for no purpose. At the site's tolerance of 0.05 mm, the same coupling would add only 75 N. Real coupling reactions depend on the type, the speed and the torque being carried, and makers publish them, but the proportion is the useful part: the reaction is roughly proportional to the misalignment, so halving the misalignment roughly halves the unwanted load.

## Where misalignment comes from

Misalignment is not only an installation error to be fixed once. It has many sources, and some act long after the fitter has left.

- **Installation:** machines set by eye, baseplates not level, feet not seated, holding-down bolts tightened in a way that twists the base.
- **Foundations:** settlement of the block or slab, shrinkage of grout, cracking and loss of bond between grout and baseplate (Chapter 2).
- **Soft foot and pipe strain:** a frame distorted when its feet are bolted down, or a pump casing pulled by its pipes (Chapters 3 and 4).
- **Temperature:** machines and their supports growing by different amounts as they reach working temperature (Chapter 8).
- **Operating forces:** hydraulic thrust in a pump, belt pull in a jackshaft drive or the reaction of a gear mesh can move a machine on its supports while it runs.
- **Wear and maintenance:** worn bearings, a machine removed for repair and refitted without realignment, a coupling replaced with a different one.

Good practice therefore checks alignment at installation, after any maintenance that disturbs the machines, and when vibration or bearing condition suggests a change. Chapter 10 returns to how often.

## Ways to measure

There are four main ways to measure alignment, and they trade speed against accuracy.

```figure
type: compare
title: Alignment measuring methods
cols: What it measures | Typical use | Limitation
rowhead: Method
- Straightedge and feelers | rough offset across hub rims and gaps between faces | first rough alignment | depends on hub rims being true and concentric; resolution about 0.05 to 0.1 mm at best
- * Rim and face dial indicators | offset and angularity at one hub | short couplings, large hubs (Chapter 6) | face readings need axial float control; brackets sag
- Reverse indicator | two rim readings, one on each shaft | longer couplings and spacers (Chapter 7) | brackets sag, usually more than in rim and face
- Laser systems | positions of both shafts electronically | most modern work | need setting up and checking like any instrument; results still need interpreting
caption: Every method measures the same geometry. This book works with dial indicators because their numbers make that geometry visible.
```

### Parallel is not enough

Two shafts can be perfectly parallel and still badly misaligned, as the HW-3's vertical offset of 0.25 mm shows. Equally, two shaft ends can meet at the coupling with no offset there and still be at an angle. Alignment requires both: the motor's centreline, carried forward through the coupling, must arrive on the pump's centreline and continue along it. Geometers call carrying a direction from one place to another along a path parallel transport, and checking that a direction comes back unchanged round a closed loop is one of their tests for a defect in a space. The fitter's version of that test, readings round a coupling that must add up, appears in Chapter 5.

## The alignment job as a sequence

An alignment is a sequence of jobs, and most of the time it costs is spent before the first useful reading. Doing the steps out of order is the commonest reason for an alignment that will not settle: readings that change every time a bolt is touched, moves that overshoot, a result that is good on the day and wrong a week later.

```figure
type: steps
title: The HW-3 alignment sequence
caption: The order of the book's chapters follows this sequence. This is an illustration.
- Isolate and prepare | lock out, remove the guard, clean the feet, baseplate and hubs
- Foundation and base | sound grout, no cracks, holding-down bolts and base checked (Chapter 2)
- Level and soft foot | machines level enough to sit squarely; every foot measured and corrected (Chapter 3)
- Rough alignment | straightedge and feelers to within a few tenths of a millimetre
- Pipe strain | pipes connected and checked for their effect on the coupling (Chapter 4)
- Measure | indicators or laser, sag measured, readings validated (Chapters 5 to 7)
- Allow for growth | cold targets from thermal growth (Chapter 8)
- Move | vertical first, then horizontal, re-measure after each (Chapter 9)
- Accept and record | final readings, coupling check, guard refitted, records kept (Chapter 10)
```

Two parts of that order matter more than the rest. Soft foot comes before alignment, because a soft foot lets the machine rock or twist as its bolts are tightened, and every reading taken before it is corrected will change. Vertical moves come before horizontal ones, because adding or removing shims shifts the machine sideways a little, while a sideways move does not change the height. Fitters who know both rules spend much less time chasing readings.

The HW-3's first alignment attempt broke the first rule. Its as-found readings above were taken after the soft foot had been corrected; the set taken before that, shown in Chapter 3, changed by 0.07 mm when one bolt was loosened.

## Tolerances

How close is close enough depends on speed, coupling type, shaft size and the machine. Alignment standards such as ANSI/ASA S2.75 Part 1 give tolerance tables, and coupling and machine makers state their own limits. The two kinds of limit answer different questions. A coupling maker's allowable misalignment says what the coupling will survive; an alignment tolerance says what the machine's bearings and seals will tolerate for a long life, and it is usually much tighter.

The HW-3 site uses 0.05 mm offset and 0.05 mm per 100 mm angularity at the coupling when running, at 1,480 rpm. Those are the site's working figures, adopted from its maintenance standard, and are labelled here as illustrations; a real installation should take its tolerances from its own standard or the makers.

A tolerance is also only as meaningful as the conditions it applies to. The HW-3's tolerance applies when the set is running at temperature. On the day of installation, cold, the fitter aims not at zero but at a cold target that will become zero when the machines warm, which Chapter 8 calculates. Comparing cold readings with a running tolerance, without the thermal offsets, is a common way to sign off a machine that will run out of alignment for its whole life.

## The mistake: the wrong diameter for the face reading

The installer's first note recorded the HW-3's vertical angularity as 0.092 mm per 100 mm, nearly twice the tolerance. The face reading of 0.06 mm had been divided by the motor's shaft diameter, 65 mm, which was printed on the motor's data plate.

A face reading measures how much the coupling face tilts across the circle that the indicator's tip traces as the shafts turn, and the angle is the reading divided by that circle's diameter. The HW-3's face indicator ran on a 150 mm circle near the hub's rim. The correct angularity is 0.06 ÷ 150 × 100 = 0.040 mm per 100 mm. The wrong divisor exaggerated the angle 2.3 times.

The error was found when the supervisor asked where on the hub the face indicator had run, and measured it. The site's alignment sheet now has a box for the face reading circle's diameter beside every face reading, and Chapter 6 uses it.

```figure
type: checklist
title: Describing an alignment state
caption: The HW-3 site's alignment sheet headings. This is an illustration.
- x Which machine is stationary and which is movable
- x Offset and angularity, vertical and horizontal, with signs and the sign convention
- x Where the offset is reported: reading plane or coupling centre
- x Face reading circle diameter beside every face reading
- x Readings corrected for bracket sag, with the sag value recorded
- x Tolerances, their source, and whether they apply cold or running
```

## Safety

Alignment means working on and around machines that can start. Before any alignment work, the HW-3 is isolated electrically at its starter and locked out, the pump's isolating valves are closed and tagged, and the coupling guard is removed only after isolation. Turning the shafts by hand for readings is done with the motor isolated and with care around the coupling's pinch points. Safe Work Australia's Code of Practice for plant sets out the duty to isolate plant from energy sources before work of this kind.

## Exercise: the offset at the coupling centre

The HW-3's coupling centre lies 50 mm from the reading plane, towards the pump. Using the as-found state, vertical offset 0.25 mm and angularity −0.04 mm per 100 mm, and horizontal offset 0.15 mm and angularity +0.06 mm per 100 mm, at the reading plane, find the offsets at the coupling centre. Which plane is further out of tolerance there?

**Worked answer.** Offset changes along the shafts by the angularity times the distance. Measuring distance positive from the reading plane towards the motor's feet, the coupling centre is at −50 mm.

Vertical: 0.25 + (−0.0004) × (−50) = 0.25 + 0.02 = 0.27 mm. Horizontal: 0.15 + 0.0006 × (−50) = 0.15 − 0.03 = 0.12 mm.

At the coupling centre, the vertical offset is 5.4 times the 0.05 mm tolerance and the horizontal 2.4 times, so the vertical plane is further out. The angularities do not change with position. A tolerance table that quotes offset at the coupling centre must be compared with these values, not with the reading-plane offsets. This is an illustration.
