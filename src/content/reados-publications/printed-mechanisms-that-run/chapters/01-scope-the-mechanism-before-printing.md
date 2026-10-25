---
book: printed-mechanisms-that-run
chapterSlug: scope-the-mechanism-before-printing
order: 1
title: "Scope the mechanism before printing"
description: "Write down what a printed mechanism must do, how long and how hot, and decide which parts to print and which to buy before modelling anything."
draft: false
---

The cheapest change to a printed mechanism is the one made before the first print. Once parts exist, there is a strong pull to make them work: sand this, drill that, add a shim. Each fix makes the next build harder to repeat. A short written scope, an hour's work, prevents most of that by deciding in advance what the mechanism must do, what conditions it must survive, and which jobs printing should and should not be asked to do.

This chapter scopes the six-station indexing table that runs through the book. The method applies to any printed mechanism: a demonstration gearbox, a camera slider, a test rig, a classroom model or a functional prototype.

## Start with the job, not the shape

A scope begins with what the mechanism must achieve, stated in numbers wherever possible. "A rotary table that indexes" is a wish. "Six stations, 60° per step, about ten steps a minute, a pause of a few seconds at each station, positioned within half a degree" is a specification that can be designed to and tested against.

This is an illustration. The indexing table's functional requirements are:

```figure
type: stats
title: Functional requirements for the indexing table
caption: This is an illustration. Each number becomes a test in the build guide in Chapter 9.
- *6 stations | 60° per index | dial of 140 mm diameter
- About 10 per minute | Index rate | adjustable down to about 4
- 4 s | Dwell at each station | at full speed; longer when slowed
- ±0.5° | Station position | about ±0.48 mm at the 55 mm station radius
- 200 h | Running life | as a teaching model
```

The position tolerance converts to a distance at the radius where it matters. Stations sit on a 55 mm radius, so ±0.5° there is **55 × 0.5 × π ÷ 180 ≈ ±0.48 mm**. That is a number a builder can check with a dial indicator or even a ruler and a marked pointer.

The running life matters more than it first seems. At ten indexes a minute for 200 hours, the table makes **10 × 60 × 200 = 120,000** indexes. Chapter 5 shows that the small sun gear in the planetary stage meets its three planets so often that each of its teeth is loaded about 1.8 million times over the same life. Printed gears can manage that at light load, but only if the design respects it.

## Estimate the loads early

Even a teaching model has loads, and the scope should estimate them before any part is drawn. The estimates need not be precise. Their job is to show which parts are lightly loaded and can be designed for shape, and which carry enough force or torque to need a calculation.

This is an illustration. The gearmotor chosen for the table has a data sheet that lists a rated torque of 0.15 N·m at 50 rpm and a stall torque of 0.45 N·m. Through the 5:1 planetary stage, with an assumed efficiency of 90%, the rated torque at the Geneva driver becomes **0.15 × 5 × 0.9 = 0.675 N·m**. If the dial jams and the motor stalls, the driver sees **0.45 × 5 × 0.9 ≈ 2.03 N·m**.

The Geneva drive pin sits 30 mm from the driver axis, as Chapter 6 calculates. The force on the pin is the torque divided by that radius: about **0.675 ÷ 0.030 = 22.5 N** at rated torque and about **2.03 ÷ 0.030 ≈ 67.5 N** at stall. Those are modest forces, but they act on a small pin and a narrow slot, which is why the pin is steel and the slot is checked later.

The stall case matters more than the rated case for most printed parts. A mechanism that jams, because a student's finger, a pencil or a loose screw gets into it, will see stall torque until someone switches it off. The scope therefore records two load cases: rated running and stall. Chapter 5 checks the gears against both, and Chapter 8 adds a current limit so that the stall case is brief.

## Decide who will build it

A mechanism built once by its designer can rely on the designer's knowledge: which way a part goes, how hard to press a bearing, which hole needs reaming. A mechanism built by others, from files and a guide, cannot. The scope should say which it is, because the answer changes how much the design itself must prevent mistakes.

This is an illustration. The table will be built by teachers and senior students, often without the designer present. That decision drives several later choices: parts that can only fit one way, numbers and arrows printed into parts, an alignment tool for the Geneva timing, checks after each subassembly, and a build guide tested by someone who has never seen the table. Chapter 9 brings these together. Writing the decision into the scope means each chapter can design for it from the start rather than adding warnings at the end.

## Write down the conditions

Printed polymers are sensitive to temperature, moisture, sunlight and sustained load in ways that metals are not. The scope should state the conditions the mechanism will meet.

- **Temperature.** Where will it be used and stored? A classroom is one thing; a car boot on a summer day in Australia is another. PLA softens at around 60 °C, its glass transition temperature, and a parked car can get hotter than that. PETG's glass transition is around 80 °C. These are typical values; check the data sheet for the actual filament.
- **Sustained load.** Polymers creep: under a constant load, they slowly deform. A screw clamping two PLA parts loses some of its clamp over weeks. A printed spring loaded continuously relaxes.
- **Handling.** Will students take it apart and reassemble it? Repeated assembly wears threads cut into plastic and fatigues snap fits.
- **Sunlight and cleaning.** Ultraviolet light degrades some plastics over time; cleaning solvents attack others.

This is an illustration. The table will be used indoors, stored in a cupboard, carried between rooms and reassembled by students each term. It will not be left in a car, but the scope notes the risk, because one hot afternoon could warp a PLA frame.

## Decide what printing should do

Material-extrusion printing is very good at some jobs and poor at others. A mechanism that plays to its strengths works better and lasts longer.

```figure
type: compare
title: What desktop printing does well and badly in a mechanism
cols: Good at | Poor at
caption: Use printing for shape and integration; buy hardware for precision, wear and sustained load.
- Shape | Complex frames, ribs, curved guards, part consolidation | Very flat, very straight or very round surfaces
- Accuracy | Repeatable features once calibrated | Precise holes and shafts straight off the printer
- Strength | Stiff enough shapes at low load | Interlayer strength, sustained load, impact in the weak direction
- Wear | Occasional sliding at light load | Continuous sliding, bearing surfaces, threads used often
- *Iteration | Cheap, fast design changes | Matching a bought part's tolerances without measurement
```

The practical rule is **print the shapes, buy the precision**. Shafts, bearings, pins that carry load or wear, springs and threads that will be used repeatedly are usually better bought. Frames, brackets, gears at modest loads, guards and housings are good candidates for printing.

## Make the print-or-buy list

This is an illustration. Applying the rule to the indexing table produces a short list.

```figure
type: compare
title: Print-or-buy decisions for the indexing table
cols: Decision | Reason
caption: This is an illustration. Each bought item replaces a printed feature that would wear, creep or need precision the printer cannot reliably hold.
- Frame, dial, covers | Print, PLA | Shape-driven, lightly loaded, indoors
- Planetary gears and Geneva wheel | Print, PETG | Shape-driven; PETG for toughness and heat margin
- Shafts | Buy, 8 mm steel | Straight, round and stiff; printed shafts would bend and wear
- Bearings | Buy, 608 ball bearings | Low friction, long life, standard size
- *Geneva drive pin | Buy, 6 mm steel dowel | Sliding contact in the slot, the highest wear point
- Threads | Buy, M3 heat-set inserts | Students reassemble the table; printed threads would strip
```

The Geneva drive pin is a good example of a small decision with a large effect. The pin slides in and out of a slot six times per dial revolution, under load, for 120,000 indexes. A printed pin would wear flat; a steel dowel pressed into the printed crank costs very little and removes the problem.

## Choose materials for each part

Within printed parts, material choice follows the conditions and the job. PLA is easy to print accurately, stiff and widely available, but has the lowest heat resistance of the common filaments and can be brittle. PETG is tougher, has more heat margin and is less prone to brittle fracture, but strings more and is slightly harder to print to tight dimensions. Other materials, such as ABS, ASA, nylon or fibre-filled blends, offer more heat resistance, toughness or wear resistance in exchange for harder printing, fumes or cost.

This is an illustration. The table uses PLA for the frame, dial and covers, where stiffness and accuracy matter and loads are light, and PETG for the gears and Geneva wheel, where toughness and a little more heat margin are worth the extra printing effort.

A note on emissions: printing releases fine particles and volatile compounds, with the amount depending on material and temperature. Print in a ventilated room, follow the filament supplier's safety data sheet, and prefer an enclosure with filtration where printers run for long periods near people.

## Standardise the hardware

Every different screw, insert or bearing in a design is another item to buy, store, sort and get wrong at assembly. Standardising hardware early simplifies everything downstream.

This is an illustration. The first layout of the table used seven different screws: M2.5 and M3 in several lengths, plus two self-tapping sizes. A review reduced them to three: **M3 × 8, M3 × 12 and M3 × 20 socket-head screws**, all into M3 heat-set inserts. The builder then needs one hex key, one insert size and three bags of screws, each a clearly different length.

```figure
type: bars
title: Hardware variety before and after standardising
unit: types
max: 7
caption: This is an illustration. Fewer types mean fewer purchasing lines, fewer wrong-screw errors and a simpler build guide.
- Screw types, first layout | 7
- *Screw types, standardised | 3
- Insert types, standardised | 1
- Bearing types, standardised | 1
```

The three lengths were chosen to be easy to tell apart at a glance: 8 mm, 12 mm and 20 mm differ by at least 4 mm, so a builder holding two screws side by side cannot confuse them. Lengths that differ by only 2 mm, such as 10 and 12, are a common source of wrong-screw errors, and a 12 mm screw driven where a 10 mm one belongs can bottom in its insert or punch through a thin wall. Where the design needed an in-between length, the boss or clamp thickness was adjusted to suit one of the three standard screws instead of adding a fourth. Each screw position in the CAD assembly is labelled with its length, and that label carries through to the build guide, so the choice is never left to the builder's judgement.

The same logic applies to bearings and shafts. All four bearings in the table are 608s, a common size that is cheap and easy to find, and all shafts are 8 mm to match their bore.

## Set a budget and a test plan

The scope should finish with two things: what the mechanism may cost and how success will be judged.

This is an illustration. The budget is about A$150 including GST for one table's materials and bought parts, and about 30 hours of print time. Chapter 9 itemises it. The test plan follows the requirements directly: count indexes per minute at full speed, time the dwell, measure station position at all six stations over several revolutions, run the table for an extended soak and check for wear, and have someone other than the designer build it from the guide.

```figure
type: checklist
title: Scope sign-off for the indexing table
caption: This is an illustration. Open items are carried into the chapters that answer them.
- x Functional requirements | six stations, rate, dwell, position, life
- x Conditions | indoors, reassembled termly, not left in cars
- x Print-or-buy list | shafts, bearings, pin and inserts bought
- x Materials | PLA frame, PETG gears and Geneva wheel
- x Hardware | three screw lengths, one insert, one bearing
- *? Gear life at 1.8 million sun-tooth cycles | to be checked in Chapter 5
- ? Station position ±0.5° | depends on Geneva and dial fits, Chapters 3 and 6
```

## Keep the scope where the files are

A scope written once and filed away is soon forgotten. Keep it in the same folder or repository as the CAD files, the print profiles and the build guide, and give it a revision number. When a requirement changes, such as a faster index rate or a new material, update the scope first and then follow the change through the design. Each chapter of this book adds evidence to the same folder: coupon measurements, fit decisions, gear checks, wiring diagrams and test logs. By the end, the folder explains not just what the mechanism is but why each choice was made, which is what the next designer will need.

## Recognise a scope failure

This is an illustration. An earlier teaching model in the same workshop, a printed winch, had no written scope. Its designer printed the drum, gears and frame in PLA and used printed pins as axles. It worked well in the workshop. After a week in a sunny window display, the drum had sagged on its axle and the gear teeth had deformed where they had been held under load by the hanging weight.

The cause was two unstated conditions: sustained load and heat. A scope would have asked both questions, and the answers, steel axles and a display away from the window, cost almost nothing. The lesson is that **the scope's job is to ask the questions that the workshop environment does not**, because a mechanism that works on the bench has passed only the bench test.

The edited READOS chapter on [notes on prototyping](/reados/collections/product-development-and-launch/notes-on-prototyping/) discusses what a prototype is meant to learn, which is a useful frame for deciding how much scope a printed mechanism needs.

## Exercise: scope a faster table

A colleague wants a version that indexes 30 times a minute for a production-line demonstration, running 8 hours a day for 40 days. How many indexes is that, how does it compare with the teaching table's life, and which items in the scope would you revisit first?

**Worked answer.** At 30 indexes a minute for 8 hours a day over 40 days, the table makes **30 × 60 × 8 × 40 = 576,000** indexes, nearly five times the teaching table's 120,000.

Revisit, in order:

1. **Gear life.** If the planetary stage runs three times faster to reach 30 indexes a minute, every gear tooth sees three times the cycles per hour as well as nearly five times the total cycles. The PETG gears need a fresh check in Chapter 5, and bought or moulded gears may be more sensible.
2. **The Geneva pin and slot.** Three times the speed means nine times the inertia torque, because acceleration scales with the square of speed, and more impact at engagement. Chapter 6 covers this.
3. **Heat.** A faster motor working harder runs warmer inside a printed enclosure, and PLA near a warm motor may soften. Consider PETG or ventilation for the motor mount.

The rest of the scope, such as the hardware list and the print-or-buy decisions, probably holds.
