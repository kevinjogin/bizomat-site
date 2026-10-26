---
book: power-presses-by-the-numbers
chapterSlug: what-a-press-must-deliver
order: 1
title: "What a press must deliver"
description: "The five numbers a press is judged on, how presses differ in what limits them, tonnes and kilonewtons, Press 4's two jobs set against its specification, and a press specified by tonnage alone."
draft: false
---

Press shops describe presses by a single number, their tonnage, and buy them that way too. A "40 tonne press" sounds like a complete description. It is not. A press's rated force says how hard it can push at one particular point in its stroke, and says nothing about how much energy it can spend on each stroke, how far it moves, how fast it cycles, how big a die it takes, or how much it bends under load. A job that is well within a press's tonnage can still stall it, run too slowly, refuse to fit, or come out inaccurate.

This chapter sets out the five numbers a press is judged on, explains how different kinds of press are limited by different ones, deals with the units, sets Press 4's two jobs against the candidate press's specification, and ends with a request for quotation that asked for tonnage and nothing else.

## Five numbers

Every press job can be described by five requirements, and every press by five capabilities to match them.

1. **Force, and where it is needed.** The peak force the die needs, and the height above the bottom of the stroke at which it needs it. A blanking die needs its force in the last few millimetres; a forming die may need a large force 20 or 30 mm up.
2. **Energy per stroke.** The work the die does each stroke: roughly force times distance, summed over the stroke. A die can need a modest force over a long distance, and so a lot of energy.
3. **Stroke and speed.** How far the ram must move to open the die enough to feed and remove parts, and how many strokes a minute the job needs to make its quantity.
4. **Die space.** The die's closed height, which must fall within the press's shut height range, and its footprint, which must fit the bolster and the ram.
5. **Accuracy and stiffness.** How much the frame and ram may deflect and tilt under the job's load without spoiling the die's alignment, and how parallel the ram face stays to the bolster.

Two further requirements apply to every job: the press must be able to be fed and guarded safely, and it must stop reliably when told to. Chapters 8 and 9 deal with those.

```figure
type: steps
title: The five numbers a press job must be checked against
caption: A press that meets the first number and fails any of the others cannot run the job well. Tonnage alone is only the first.
- *Force at the working height | peak load, and how far above the bottom of the stroke it occurs
- Energy per stroke | the work done each stroke, at the speed the press runs
- Stroke and speed | opening for feeding and removal; strokes a minute for the quantity
- Die space | closed height within the shut height range; footprint on bolster and ram
- Accuracy and stiffness | deflection and tilt under load; ram parallelism
```

## What limits each kind of press

Presses differ in which of those numbers runs out first, and that is the most useful way to classify them.

- **Energy machines**, the screw or fly press and the drop hammer, store energy in a moving mass and spend it in one blow. The force they deliver is whatever the work resists with, until the energy is used up. They are limited by energy, and Chapter 2 deals with them.
- **Stroke machines**, the crank, eccentric and knuckle-joint presses, move the ram through a fixed path set by their mechanism. They can deliver their full rated force only near the bottom of the stroke, and less higher up. They are limited by force at height and by the flywheel's energy, which Chapters 3 and 4 deal with.
- **Force machines**, the hydraulic presses, push with a force set by their oil pressure and cylinder area, at any point in their stroke. They are limited by force and by speed, which their pumps set, and Chapter 6 deals with them.
- **Servo presses** drive a crank or linkage with a servo motor instead of a flywheel and clutch. They behave like a stroke machine whose motion can be programmed, with limits set by the motor's torque and power, also in Chapter 6.

Hodgson's 1903 book covered the first two kinds in detail, because they were what a press shop of the time used: fly presses worked by hand, stamps and drop hammers, and belt-driven power presses with steel-pin clutches. The physics has not changed, and his examples are a clear way into it.

```figure
type: tree
title: Presses classified by what limits them
caption: General classification. The limit decides which of the five numbers to check first.
- Power presses | machines that deliver force to a die
  - Energy machines | limited by stored energy
    - Screw and fly presses | energy in a spinning flywheel or weighted lever
    - Drop hammers and stamps | energy in a falling mass
  - Stroke machines | limited by force at height and flywheel energy
    - Crank and eccentric presses | fixed stroke from a rotating shaft
    - Knuckle-joint presses | short, powerful stroke for coining and sizing
  - * Force machines | limited by pressure, area and pump flow
    - Hydraulic presses | full force anywhere in the stroke
  - Servo presses | limited by motor torque and power; programmable motion
```

## Tonnes and kilonewtons

Press ratings are given in several units, and confusing them causes real errors.

- The SI unit of force is the **newton**; press forces are usually given in **kilonewtons**, kN.
- A **tonne-force**, the weight of a tonne under standard gravity, is 9.807 kN. A "40 tonne press" in Australia or Europe is usually about 392 kN, and catalogues often round it to 400 kN.
- A **US ton-force**, the weight of 2,000 pounds, is 8.896 kN. A "40 ton press" from a US catalogue is about 356 kN, 9% less than a 40 tonne one.
- A **long ton-force**, 2,240 pounds, the unit of Hodgson's book, is 9.964 kN.

This book uses kilonewtons throughout. Press 4's candidate is rated at 400 kN, about 40.8 tonnes-force. When a specification or a quote gives "tons", the first question is which tons.

## Press 4's jobs

This is an illustration. The enclosure manufacturer needs Press 4 to run two jobs.

**MP-40** is the flat mounting plate from the companion book. Its three-station progressive die is fed from coil, pierces two holes and a slot, pilots the strip and blanks the outline, one plate per stroke. Its needs are:

- force: 192.8 kN of cutting and 28.5 kN of stripper springs, **221.3 kN** at the bottom of the stroke, all of it within 4 mm of the bottom;
- energy: about **321 J** per stroke, worked out in Chapter 4;
- speed: 60,000 plates a year needs only 11 press hours a year at 120 strokes a minute, but the die is designed for that speed, and higher speed frees the press for other work;
- die space: closed height **204 mm**, die footprint about 400 × 300 mm;
- accuracy: a cutting clearance of 0.15 mm per side, which the frame's deflection must not use up.

**AB-75** is an angle bracket, 75 × 50 mm legs, 100 mm wide, formed from a pre-cut 3.0 mm blank in a wiping die. Blanks are loaded by hand into a nest. Its needs are:

- force: rising from first contact **25 mm** above the bottom to about 65 kN, then to **180 kN** in the last millimetre as the bend is set;
- energy: about **1,515 J** per stroke (Chapter 4), almost five times MP-40's;
- speed: hand loading allows about 12 strokes a minute in single-stroke mode; 20,000 brackets a year is about 37 hours at 75% efficiency;
- die space: closed height **265 mm**;
- safety: a hand-loaded die needs guarding that protects the loader (Chapter 9).

## The candidate press

The main candidate is a gap-frame mechanical press, as an illustration:

- rated force **400 kN** at **3 mm** above the bottom of the stroke;
- stroke **60 mm**, from a crank radius of 30 mm, with a 250 mm connecting rod;
- speed **40 to 120** strokes a minute, variable;
- flywheel moment of inertia **4.0 kg·m²**, geared 5 : 1 to the crank;
- shut height **240 to 300 mm**;
- bolster 800 × 500 mm;
- a 7.5 kW main motor.

At a glance, it has nearly twice the force either job needs. The chapters that follow test the other four numbers, and find that the glance is not enough.

```figure
type: compare
title: Press 4's jobs against the candidate press, at a glance
rowhead: Requirement
cols: MP-40 | AB-75 | Candidate press | First impression
caption: This is an illustration. The force column looks comfortable; Chapters 3 to 7 show where each of the other rows needs a closer look.
- Peak force | 221.3 kN at the bottom | 180 kN at the bottom; 65 kN at 5 mm | 400 kN at 3 mm | ample
- Highest working point | 4 mm | 25 mm | rating at 3 mm | check the force curve
- Energy per stroke | 321 J | 1,515 J | depends on speed | check the flywheel
- Speed | up to 120 a minute | about 12 a minute | 40 to 120 a minute | check AB-75 at low speed
- * Closed height | 204 mm | 265 mm | 240 to 300 mm | MP-40 too short
```

## Reading a press specification

A press maker's specification sheet gives most of the numbers above, but not always in the same terms, and some matter more than others.

- **Rated force and rating point.** The force and the height above the bottom of the stroke where it applies. A rating with no rating point is incomplete.
- **Energy per stroke.** Some makers give the energy available in continuous running at a stated speed and slowdown; others give only the flywheel's inertia and speed. Chapter 4 turns those into energy.
- **Stroke, speed and shut height.** Shut height is usually given with the stroke down and the adjustment up; the minimum is that figure less the adjustment.
- **Bolster and ram face sizes, and the throat depth** of a gap frame, which limit the die's footprint and how far off the frame's centreline it can work.
- **Frame deflection**, if given at all, often as an angle or a vertical deflection at rated load.
- **Stopping time** of the clutch and brake, which sets guard distances (Chapter 9), and the controls fitted.

Specifications that leave out a number the job depends on need a question to the maker before the order is placed, not after the press is installed.

## Speed from the quantity

The stroke rate a job needs follows from its quantity, its parts per stroke and the shop's efficiency, the share of scheduled time the press actually spends stroking once set up. This book uses 75% as an illustration, covering coil changes, short stops and checks.

- **MP-40**: one plate per stroke. At 120 strokes a minute, 60,000 plates take 60,000 ÷ (120 × 60 × 0.75) = **11.1 hours** a year. At 60 strokes a minute, 22.2 hours.
- **AB-75**: one bracket per stroke, hand-loaded at about 12 strokes a minute: 20,000 ÷ (12 × 60 × 0.75) = **37.0 hours** a year.

Neither job needs much press time, and neither alone would justify a press. Press 4 is also to take over the work of the shop's older 250 kN press, about 1,200 hours a year of smaller cutting and forming dies, and Chapter 10 costs the options on that whole workload. The two jobs in this book are the ones that set the specification, because they are the most demanding: MP-40 for speed, stiffness and die space, AB-75 for energy and guarding.

## Secondhand presses

A used press can be good value, and the five numbers apply to it exactly as to a new one, with three additions.

- **Its condition.** Worn gibs, a worn clutch and brake, a cracked frame or a tired connecting rod bearing all change the numbers. A competent inspection, including the frame for cracks around the throat and a measurement of the ram's parallelism and play, comes before the price.
- **Its clutch and controls.** Older presses may have full-revolution clutches, which cannot be stopped partway through a stroke (Chapter 9), and controls that do not meet current standards. Upgrading them can cost a large share of the press's price.
- **Its guarding.** A press must be guarded to current Australian law and standards when it is used, whatever it had when it was made. The cost of bringing an old press's guarding and controls up to that standard belongs in the comparison with a new one.

A secondhand press that passes on all five numbers and needs only modest work can be a sound choice for a shop that knows presses well. One bought on its tonnage and price, like the first request for quotation below, usually is not.

## The error: a press specified by tonnage

This is an illustration. The manufacturer's first request for quotation asked suppliers for "a 40 tonne press, new or as new, with installation". It received five quotes. The cheapest, by a wide margin, was for a 400 kN hydraulic press with a 300 mm stroke, a maximum pressing speed of 12 mm/s and a shut height of 450 mm.

That press would have formed AB-75 slowly but well. It could not have run MP-40's progressive die at anything like its design speed: its pump could not cycle the ram through even a short stroke more than a few times a minute, and its shut height was far above the die's. The supplier had quoted exactly what was asked for.

The purchasing officer noticed that the quotes were not comparable, because they ranged from a C-frame mechanical press to a straight-sided hydraulic one, and asked engineering to write a requirement. The second request listed both jobs with all five numbers, the controls and guarding needed, and the hand-loading of AB-75, and asked each supplier to show how its press met each one. The quotes that came back could be compared line by line, and the cheapest compliant one was not the cheapest press in the first round.

```figure
type: checklist
title: What a request for quotation for a press should state
caption: Each line lets a supplier show how its press meets the job, instead of guessing.
- Each job's peak force and the height above bottom where it occurs | 221.3 kN at 4 mm; 65 kN at 5 to 25 mm, 180 kN at the bottom
- Each job's energy per stroke and stroke rate | 321 J at up to 120 a minute; 1,515 J single strokes
- Die closed heights and footprints | 204 and 265 mm; about 400 × 300 mm
- Feeding and loading method | coil feed for MP-40; hand loading for AB-75
- Guarding and controls required | to Australian standards and regulator guidance
- x Tonnage alone | five quotes for five different machines
```

## Exercise: tonnes, tons and the jobs

A secondhand press is advertised as "45 ton, US-built". Convert its rating to kilonewtons, compare it with MP-40's and AB-75's peak forces, and say what else the advertisement would need to state before the press could be considered for either job.

**Worked answer.** 45 US tons-force is 45 × 8.896 = **400.3 kN**, almost exactly the candidate's rating; had it been 45 tonnes-force, it would have been 441.3 kN.

- MP-40's 221.3 kN peak is 55% of 400.3 kN.
- AB-75's 180 kN peak is 45% of it.

The rating alone says the press is strong enough at its rating point. Before considering it, the shop would need the rating point, the stroke and the force curve above the rating point (AB-75 works 25 mm up), the flywheel's energy at the speeds intended, the shut height range (MP-40's die is 204 mm high), the bolster size, the clutch and brake type and their stopping time, and the guarding and controls fitted, which for an older press may not meet current Australian standards.
