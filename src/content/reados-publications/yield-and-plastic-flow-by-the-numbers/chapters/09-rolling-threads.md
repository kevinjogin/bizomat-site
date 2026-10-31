---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: rolling-threads
order: 9
title: "Rolling threads: forming instead of cutting"
description: "How thread rolling forms a thread by plastic flow, why the blank is sized near the pitch diameter, how rolls and starts are chosen, and what rolling does for the thread's strength."
draft: false
---

A cut thread is made by removing metal; a rolled thread is made by moving it. In thread rolling, hardened dies press the thread form into a plain blank, and the metal flows out of the roots and up into the crests. Nothing is removed, so the blank must be the right size for the metal it contains to fill the finished thread exactly. The flow also work hardens the thread and leaves its roots in compression, which makes rolled threads stronger, especially in fatigue.

This chapter sets up the rolling of the HC-63 rod's M27 × 2 end thread, explains the volume rule behind the blank size and the geometry behind the rolls, and follows a setter's shortcut that turned a batch of rods into scrap.

## The rod end thread

The HC-63's rod has an M27 × 2 thread at its end, onto which the rod eye is screwed and locked. The thread carries the full rod force: 44.1 kN pulling on the return stroke at 21 MPa, and up to 65.5 kN pushing. It is rolled on a two-die cylindrical rolling machine whose dies can be between 80 and 180 mm in pitch diameter. This is an illustration.

On the pull stroke, the thread's stress on its tensile stress area of 495.7 mm² is 44,087 ÷ 495.7 = 88.9 MPa, a safety factor of 4.05 against the rod steel's 360 MPa yield strength. The thread is far from yielding under a single load; its concern is fatigue under millions of pressure strokes, which is why it is rolled.

## Forming the thread

Two cylindrical dies, each carrying the thread form on its surface, rotate in the same direction and are pressed together with the blank between them. The blank turns with the dies, and with each revolution the die ridges sink deeper into it. Metal under each ridge flows sideways and outwards, rising into the space between the ridges to form the crests.

The strains are large: the material at the root is compressed and sheared, and the crest is built from metal that has moved by a substantial fraction of the thread's height. The steel needs enough ductility to flow that far without cracking. A normalised medium-carbon bar with a reduction of area of over 50%, like the HC-63's (Chapter 2), rolls well. Cold-drawn bar, with less ductility left, can be rolled but needs more force, wears the dies faster and is prone to flaking or seams at the crests.

### The blank diameter

Because rolling moves metal rather than removing it, the volume of the blank per unit length must match the volume of the finished thread. For an ISO metric thread, the metal pushed down from above the pitch diameter roughly balances the metal pushed up into the crests, so the blank diameter is close to the thread's pitch diameter. That is the starting value; the exact size is set by rolling a trial piece and adjusting until the thread is fully formed and within its gauge limits.

```figure
type: formula
title: ISO metric thread sizes used in rolling
formula: pitch diameter d2 = d − 0.6495 P,   minor diameter d3 = d − 1.2269 P
formula: thread height h3 = 0.6134 P,   tensile stress area As = π ÷ 4 × [(d2 + d3) ÷ 2]²
caption: d is the nominal diameter and P the pitch. The blank for rolling is taken at about d2 and finished by trial. The stress area is the area used for the thread's tensile strength.
- d | nominal (major) diameter
- P | pitch
- d2 | pitch diameter, about the blank diameter
- d3 | minor diameter of the external thread
```

For M27 × 2, d2 = 27 − 0.6495 × 2 = 25.701 mm, d3 = 24.546 mm, h3 = 1.2269 mm and As = 495.7 mm². The blank is turned to about 25.70 mm. A blank turned to the full 27 mm would contain about 10% more metal per unit length than the thread can hold: (27 ÷ 25.701)² = 1.104.

### Roll size and starts

The dies are much larger than the blank, and they must roll on it without slipping, with their thread ridges meeting the blank's thread in step. For that, the lead of the die thread must match the blank's thread at their respective diameters: a die whose pitch diameter is N times the blank's must carry N starts, so that one revolution of the die advances the thread by N pitches, the same as N revolutions of the blank.

The [thread rolling set-up](/tools/thread-rolling-setup/) tool calculates the thread's pitch diameter, height and stress area, takes the blank at the pitch diameter, and finds the die's pitch diameter and lead for a chosen number of starts. It reports the range of starts that gives a die inside the machine's diameter range. It assumes cylindrical dies and notes that the blank size is a starting value to be finished by trial.

```figure
type: compare
title: Die sizes for the HC-63's M27 × 2 thread, from the thread rolling set-up tool
cols: Die pitch diameter, mm | Die lead, mm | Inside 80 to 180 mm?
rowhead: Starts on the die
- 4 | 99.1 | 8 | yes
- * 5 | 124.2 | 10 | yes
- 6 | 149.3 | 12 | yes
- 7 | 174.4 | 14 | yes
- 8 | 199.5 | 16 | no: ROLL SIZE OUT OF RANGE
caption: This is an illustration. Blank at the pitch diameter 25.701 mm. The tool reports starts from 4 to 7 as fitting the machine. The builder uses 5-start dies, near the middle of the range.
```

## What rolling does for the thread

### Grain flow and work hardening

In a cut thread, the bar's grain flow, the lines of elongated grains and inclusions along the bar, is cut through at every flank and root. In a rolled thread, the grain flow is bent to follow the thread's profile, unbroken. The metal at the root and flanks has also work hardened, by the large strains of rolling, along the flow curve of Chapter 3; its hardness there is typically well above the core's.

### Residual compression at the root

The thread root, where the stress concentrates in service, is where the die ridge pressed hardest. When the die withdraws, the root is left in residual compression, for the same reason a bend's outer surface is (Chapter 7): the plastically deformed layer is held by the elastic material around it. That compression lowers the effective mean stress at the root in service and greatly improves fatigue strength; it is why bolt fatigue data for rolled threads are well above those for cut threads. The benefit is largest when the thread is rolled after any heat treatment; heating a rolled thread enough to harden or temper it relaxes the residual stress.

```figure
type: compare
title: Cut and rolled threads in the HC-63 rod
cols: Cut thread | Rolled thread
rowhead: Feature
- Metal | removed | moved; no waste
- Grain flow | cut through at flanks and roots | follows the profile, unbroken
- Root and flank hardness | the bar's own | raised by work hardening
- * Residual stress at the root | small, may be tensile from cutting | compressive
- Fatigue strength | lower | higher, if rolled after heat treatment
- Surface | tool marks | smooth, burnished
- Production time | longer | seconds per part
caption: The HC-63's rod is rolled after machining and before chrome plating of the rod's bearing surface; the thread is masked from the plating.
```

### Setting up and checking a rolled thread

The tool's blank diameter is where set-up starts, not where it ends. The setter turns a few blanks at the calculated size, rolls one, and checks it three ways. A thread ring gauge, go and no-go, confirms that the thread will assemble and is not undersize. The pitch diameter, measured over three precision wires laid in the thread grooves, shows where in the tolerance the thread sits. And the crests are inspected under a lens: a fully formed rolled thread has a slightly rounded, closed crest, while an underfilled one has a visible notch along the crest, called a seam, where the two flows of metal from either flank have not quite met. A small seam is normal and harmless; a deep one, or a lapped crest, is not.

If the crest is underfilled, the blank is made slightly larger; if overfilled, slightly smaller. Changes of a few hundredths of a millimetre in blank diameter make a visible difference, because every bit of the extra or missing metal ends up at the crest. Once the blank is right, it is held to a tight tolerance in production, tighter than the thread's own, because the thread's size depends on it.

### Fatigue of the rod end

The HC-63's rod end thread sees one load cycle on every stroke of the cylinder, from pushing to pulling and back, and a mining machine strokes its cylinders many thousands of times a day. The thread root is a notch, and the first engaged thread carries the largest share of the load. Two things protect it. The rod eye is screwed on against a shoulder and tightened to a high preload, so that, like a well-preloaded bolt, the thread sees only a fraction of the load cycle; and the thread is rolled, so its root is in residual compression. The rod eye's locking arrangement is checked at every service for exactly that reason: a loose rod eye removes the preload and exposes the thread to the full cycle.

### Where rolling sits in the rod's route

The order of operations decides whether the thread keeps the benefits of rolling. The HC-63 rod's route is set so that nothing after the rolling heats the thread or removes its surface.

```figure
type: steps
title: The HC-63 rod's process route around the thread
caption: This is an illustration. The thread is rolled after every operation that could heat it or change its size, and protected from those that follow.
- Bar | normalised 0.45% carbon steel, tensile tested per heat (Chapters 2 and 4)
- Turn | rod diameter, shoulder and thread blank at 25.70 mm
- Induction harden | the rod's bearing surface only; the thread end is kept out of the coil
- Grind | the rod's bearing surface to size
- * Roll the thread | 5-start dies, 124.2 mm pitch diameter, first-off checks with gauges and wires
- Chrome plate and polish | the bearing surface; the thread masked
- Inspect | thread gauges, plating thickness and finish
```

Rolling the thread before induction hardening would risk tempering or relaxing it in the heat from the coil, and plating it would put a brittle, tensile-stressed layer on its roots. Both mistakes would undo the benefit for which the thread is rolled, and neither would show on a gauge.

## The error: the blank at the nominal diameter

A setter preparing a batch of 60 rods for a different cylinder, whose M27 × 2 thread was cut, not rolled, had turned the blanks to 27.0 mm, the nominal diameter, as a cut thread requires. Then the job was switched to rolling, to match the HC-63's practice, and the setter rolled the blanks as they were.

The first rods came off the rolling machine with crests that had overflowed into flat, flaky ridges, and the machine's force reading was well above normal. The thread ring gauge's go side would not screw on. The setter assumed worn dies and changed them, and the next rods were the same.

The quality engineer measured the blanks: 27.0 mm, against the 25.70 mm the rolling set-up called for. The extra 10% of metal per unit length had nowhere to go. It had overfilled the die's thread form, lapped over at the crests and enlarged the pitch diameter beyond the thread's tolerance, while the forming load had risen sharply because the dies were trying to compress metal that could not flow anywhere. The overload had also chipped one of the original dies, which explained the setter's diagnosis.

```figure
type: compare
title: Rolling the M27 × 2 thread from two blank sizes
cols: Blank diameter, mm | Metal per unit length, relative | Result
rowhead: Blank
- * At the pitch diameter, from the set-up tool | 25.70 | 1.00 | thread fully formed, within gauge limits
- At the nominal diameter, as for cutting | 27.0 | 1.10 | crests overfilled and lapped, pitch diameter oversize, die overloaded
caption: This is an illustration. Rolling conserves volume, so the blank must contain the thread's metal and no more.
```

All 60 rods were scrapped; their threads could not be recut to size because the overfilled pitch diameter left too little metal at the root for a cut thread. The rolling set-up sheet now gives the blank diameter as a separate operation dimension, and the routing for any rolled thread has the blank turning and the rolling as linked operations, so that one cannot be changed without the other.

### Looking after the dies

Thread rolling dies are hardened tool steel and last for a very large number of parts when they are used within their load, and very few when they are not. Overfilled blanks, as above, are one cause of damage; others are blanks harder than the dies were designed for, dirty or dry lubrication, misaligned dies that load one end of the thread, and starting the roll on a blank whose chamfer is too short, which makes the die's first ridges take the whole forming load. The builder records the rolling force on every batch and the number of parts on each pair of dies. A force reading that drifts upward is the earliest sign of a blank-size or material problem, and it was the reading the setter should have trusted before changing the dies.

The scrapped batch cost the builder the bar, the turning and the rolling of 60 rods and a pair of dies, and it came from a reasonable habit applied to the wrong process. Cut threads start from the nominal diameter because the cutter removes metal down to the thread; rolled threads start smaller because nothing is removed. A setter moving between the two processes needs the difference in front of them at the machine, not only on the drawing.

## Other rolled forms

Thread rolling is one example of a family of cold-forming processes that move metal into a die: knurling, spline rolling, worm and gear rolling, fillet rolling of crankshafts and axles, and burnishing. Fillet rolling is used precisely for its residual compression: rolling the fillet of a shaft's shoulder with a hardened roller leaves the fillet surface in compression and can raise the fatigue strength of the shoulder substantially, without changing its shape. Each of these processes follows the same rules as thread rolling: the blank must contain the right volume, the material must have the ductility to flow, and the benefit to fatigue depends on the residual stress surviving later processing.

## Exercise: the guard screws

The rod guard of Chapter 7 is fixed with M12 × 1.75 screws, also rolled on the same machine (die pitch diameters 80 to 180 mm). Find the blank diameter, the thread height, the stress area, and the die pitch diameter with 10 starts. Which numbers of starts fit the machine?

**Worked answer.** The pitch diameter is 12 − 0.6495 × 1.75 = 10.863 mm, so the blank is turned to about 10.86 mm. The minor diameter is 12 − 1.2269 × 1.75 = 9.853 mm, the thread height 0.6134 × 1.75 = 1.0735 mm and the stress area π ÷ 4 × [(10.863 + 9.853) ÷ 2]² = 84.27 mm².

With 10 starts, the tool's die pitch diameter is 10 × (10.863 − 1.0735 ÷ 2) − 1.0735 = 10 × 10.327 − 1.074 = 102.2 mm, with a lead of 17.5 mm. The smallest number of starts is the next whole number above (80 + 1.0735) ÷ 10.327 = 7.85, which is 8, and the largest is the whole number below (180 + 1.0735) ÷ 10.327 = 17.53, which is 17. Any number of starts from 8 to 17 fits the machine.
