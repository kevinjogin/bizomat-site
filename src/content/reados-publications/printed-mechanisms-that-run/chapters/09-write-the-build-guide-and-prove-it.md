---
book: printed-mechanisms-that-run
chapterSlug: write-the-build-guide-and-prove-it
order: 9
title: "Write the build guide and prove it"
description: "Turn the design into a bill of materials, print schedule and step-by-step guide with checks, then prove it with a soak test and a build by someone who has never seen it."
draft: false
---

A printed mechanism is not finished when the designer's prototype works. It is finished when someone else can build it from the files and the guide, and their build works too. That is a different test, and it finds different faults: steps that assume knowledge, parts that can go in backwards, screws whose length is never stated and checks that nobody thought to write down.

This chapter assembles the indexing table's design into a build package, sets out the guide's structure and its checks, and then proves the package two ways: a soak test that runs the mechanism long enough to show wear, and an independent build by people who have never seen the table.

## Know what the build package contains

A complete package lets a builder go from nothing to a working mechanism without contacting the designer. For the table, it holds six things:

1. **The bill of materials**, with quantities, specifications and indicative costs.
2. **The print schedule**: every part, its material, orientation, settings and plate.
3. **The coupons** from Chapter 3, so a builder with a different printer can check the fits before printing the real parts.
4. **The build guide**: subassemblies in order, each step with its parts, hardware, action and check.
5. **The wiring page and the controller program**, from Chapter 8.
6. **The test record**: what was checked, what passed and what the builder should expect to see.

Everything is kept together under one revision number, with the scope from Chapter 1. A guide at revision 1.1 that refers to parts from CAD revision 1.0 is a common, avoidable source of confusion.

## Write the bill of materials

This is an illustration. The table's bill of materials, with indicative Australian prices including GST, comes to about A$148 for one table.

```figure
type: compare
title: Bill of materials for one indexing table
cols: Quantity and specification | Indicative cost
caption: This is an illustration. Prices are invented teaching figures in A$ including GST and will differ by supplier, quantity and date. The total includes about A$13.41 of GST.
- Filament | PLA 0.48 kg; PETG 0.16 kg | 14.40 + 5.60
- Gearmotor | 12 V, 50 rpm rated | 28.00
- Controller and driver | 5 V board; MOSFET driver module | 12.00 + 6.00
- Power supply | plug-pack, 12 V 2 A, RCM-marked | 22.00
- Bearings and shafts | 4 × 608 sealed; 300 mm of 8 mm ground rod; 6 mm dowel pin | 8.00 + 12.00 + 1.50
- Fasteners | M3 × 8, × 12, × 20 screws; washers; M3 inserts; 2 nuts | 14.00
- Electrical sundries | Hall sensor and magnet; 2 pots and knobs; jack, fuse, switch; wire; capacitors; LED | 24.00
- *Total | about A$147.50 including GST | within the A$150 scope budget
```

Two features make a bill of materials useful to a builder rather than just a buyer. Each line gives a specification precise enough to buy the right part, such as "608 sealed" rather than "bearings". And each fastener line ties back to the joints in the guide by length, so the builder can count out the screws for each subassembly before starting.

## Write the print schedule

This is an illustration. The print schedule lists every printed part with its material, orientation, layer height, wall count and plate. The table's parts fit on nine plates totalling about 30 hours: about 161 m of PLA and 52 m of PETG, at about 2.98 g and 3.05 g per metre of 1.75 mm filament respectively.

The schedule also says which parts to print first. The coupons go first, because they confirm the fits. The frame side plates go next, because they are the parts most sensitive to the press-fit offset and they gate every later subassembly. The gears go after the coupons have confirmed the PETG settings. A builder who prints the dial first and then finds the bearing bores are wrong has lost a day.

## Order the build by subassembly

A good build guide follows the order in which the mechanism can be built and checked, one subassembly at a time, so a fault is found where it starts.

```figure
type: timeline
title: Build order for the indexing table
caption: This is an illustration. Each subassembly ends with a check that must pass before the next begins.
- 1 | Frame | base, side plates, bearings pressed; shaft turns at about 0.02 N·m
- 2 | Gearbox | sun, three planets, ring, carrier; smooth through five sun revolutions
- 3 | Geneva driver | crank, steel pin, locking disc, shaft, collars; no axial play
- 4 | Wheel and dial | wheel and dial keyed together; station 1 at the frame mark
- *5 | Alignment | 60.0 mm centre distance set with the tool; screws tightened and marked
- 6 | Electrics | wiring, sensor, controller; power-on, speed, dwell and jam tests
- 7 | Covers | snap-on gearbox cover; final run and retightening check
```

Each step in the guide uses the same layout: a picture or diagram of the parts, a list of the parts and hardware with screw lengths stated, a short instruction, and a check. The check is the important part. "Press the bearing into the side plate" is an instruction. "The bearing sits flat against its shoulder, and the shaft turns freely through both bearings" is a check that a builder can confirm and that catches a crooked bearing at once.

## Design out wrong assembly before writing warnings

A warning in a guide is a sign that the design allows a mistake. Every warning that can be replaced by a feature that makes the mistake impossible should be. The table's earlier chapters added several such features; the guide-writing stage is the time to look for more.

This is an illustration. Reading the draft guide step by step, the designer listed every place where a part could go in wrongly, and either changed the part or kept a check:

- **Left and right side plates** looked identical but were not, because the driver shaft sits off centre. Each plate now has an asymmetric pair of locating bosses that only fit its own side, and an embossed L or R.
- **The dial** can only be keyed to the wheel in its six station positions, and station 1 is marked, as Chapter 6 described.
- **The planets** are numbered and carry enlarged timing marks, following the independent build test below.
- **Screws** come in three lengths at least 4 mm apart, so the wrong one is obvious in the hand, and each step states the length.
- **The motor connector** is polarised, so the motor cannot be plugged in backwards and run the Geneva in reverse.
- **The crank** has a D-flat bore, so it can only fit the shaft one way round, with the pin on the correct side.

After this review, the guide had four warnings left instead of eleven, each for something that genuinely could not be designed out, such as not overheating an insert. A builder reads four warnings; eleven get skimmed.

## Write steps a builder can follow

Clear steps follow a few rules that are easy to state and easy to forget.

1. **One action per step.** "Press the bearing into the plate" is one step; "press the bearing, fit the shaft and add the collar" is three.
2. **Name every part and quantity.** List the parts and hardware at the top of each step, with screw lengths, so the builder can lay them out first.
3. **Show the builder's view.** Draw or photograph each step from the angle the builder will see it, with the part being added highlighted.
4. **Put warnings before the action**, not after it. A warning after a step arrives too late.
5. **End with the check.** Say what the builder should see, feel or measure if the step is right.

Exploded views from the CAD assembly make excellent step diagrams, because they show each part in its correct orientation with its neighbours. Render them with consistent colours: the part being added in the accent colour, parts already fitted in grey.

## Build the checks into the guide

This is an illustration. The guide's checks were taken from the earlier chapters, where each was first used to find a design fault:

```figure
type: checklist
title: Checks written into the build guide
caption: This is an illustration. Each check came from a fault found during design; the guide asks the builder to repeat it.
- x Fits | bearings press with firm vice pressure and seat flat; Chapter 3
- x Shaft alignment | 100 mm lever, spring scale: about 0.02 N·m to turn; Chapter 4
- x Planet timing | marks aligned; no tight spot over five sun revolutions; Chapter 5
- x Centre distance | 60.0 mm with the alignment tool; Chapter 6
- x Dial key | station 1 stops at the frame mark; Chapter 6
- x Screw torque | 0.25 N·m with washers; witness marks drawn; Chapter 7
- *x Running current | between about 0.34 and 0.37 A around a full revolution; Chapter 5
- x Jam stop | motor stops within about 9 s of a stall at full speed; Chapter 8
```

The running-current check deserves a word. A cheap inline current meter, or the current display on a bench supply, turns several hidden faults into a number. A tight planet, a misaligned shaft, a crooked bearing or an overtightened collar all show up as higher current or a current that rises at one point in each revolution. The guide gives the expected range so the builder knows what good looks like.

## Run a soak test

A mechanism that runs for ten minutes has not shown how it wears. A soak test runs it long enough for early wear, loosening and creep to appear.

This is an illustration. The designer ran the first complete table for 20 hours at full speed, about **10 × 60 × 20 = 12,000** indexes, a tenth of its scoped life. Every five hours, the table was stopped and checked.

```figure
type: compare
title: Soak test results, before and after 20 hours
cols: Before | After 20 hours
caption: This is an illustration. Small changes, all within requirements; one screw needed retightening after the first ten hours.
- Station spread at 55 mm radius | ±0.22° | ±0.24°
- Running current | 0.34 to 0.37 A | 0.33 to 0.36 A
- Gear teeth | as printed | light polishing on sun flanks; no wear steps
- Geneva slots | as printed | light polishing; no chipping
- *Screws | marked at 0.25 N·m | one motor-mount screw retightened at 10 h
- Index count from the sensor | 0 | 12,006
```

The station spread grew slightly, from ±0.22° to ±0.24°, or about ±0.23 mm at the station radius, still well within ±0.5°. The running current fell a little as the gears and bearings ran in. The sun gear's flanks showed light polishing but no steps or pitting, which supports the stress check in Chapter 5 for this fraction of the life. The index count from the sensor, 12,006, agreed with the expected 12,000 to within the few minutes of checking at each stop.

Before starting, the designer wrote down the conditions that would stop the test early: running current above 0.5 A at any point, station spread beyond ±0.4°, any visible crack, or any screw whose witness mark had moved twice. Writing the stop conditions first keeps the test honest, because it removes the temptation to explain away a bad reading halfway through. None was triggered.

The soak test does not prove the full 120,000-index life. It shows that nothing is wearing quickly and that the parts are behaving as designed. The test record recommends a further check of the sun gear at 60,000 indexes, using the controller's counter.

## Test the guide with someone else

The final and most revealing test is to hand the package to people who have never seen the table and watch them build it, without helping.

This is an illustration. Two teachers built tables from revision 1.0 of the guide, on different days, using their own tools. Both tables worked at the end. Their builds took about 3 hours 40 minutes and 4 hours 10 minutes, not counting print time. Between them they raised three problems:

1. **Planet timing.** One builder fitted a planet one tooth out. The gearbox check caught it, as a tight spot in each revolution and a current rising to about 0.6 A, but the builder could not see why. The timing marks were present but small, and the guide's photo showed them from an angle where they were hard to see. Revision 1.1 enlarged the marks and added a close-up diagram.
2. **A missing screw length.** One step said "fix the sensor bracket" without stating the screw. Revision 1.1 added "two M3 × 8 with washers".
3. **Insert installation.** Neither builder had installed heat-set inserts before. Revision 1.1 added a half-page on the technique from Chapter 7, with a recommended practice insert in a coupon.

None of the three was a design fault in the mechanism. All three were faults in the guide that the designer could not have found by building the table again personally, because the designer already knew the answers.

## Plan spares and maintenance

A teaching mechanism will be dropped, jammed and handled by many people. The package should say which parts are likely to need replacing and how to do it. For the table, the likely candidates are the sun gear, which carries the highest tooth stress; the Geneva wheel, which takes the pin at every index; and the snap-on cover, whose snap beams flex every time it is removed. The guide recommends printing one spare of each with the original batch, lists the subassembly steps needed to replace them, and includes a short maintenance page: retighten the marked screws each term, check the running current, refresh the dry lubricant on the gear teeth and Geneva slots, and read the index counter to know when the next gear check is due.

## Keep the package under revision control

Every change to the mechanism, the guide or the program gets a new revision number and a one-line note saying what changed and why. A builder holding revision 1.1 of the guide should be able to tell at a glance that it matches revision 1.1 of the CAD files and the program. When a part changes, such as a profile-shifted sun gear after a future wear check, the guide's affected steps, the print schedule and the bill of materials are updated in the same revision.

The READOS chapter on [proving a process is ready for production](/reados/collections/product-development-and-launch/proving-a-process-is-ready-for-production/) takes the same idea further, for products moving from prototype to repeatable manufacture.

## Exercise: plan a classroom batch

A school wants eight tables for a class. Using the bill of materials and print schedule, estimate the total cost and print time, and identify which checks you would keep for every table and which you might sample.

**Worked answer.** At about A$147.50 per table, eight tables cost about **8 × 147.50 = A$1,180** including GST, before any quantity discounts. Print time at about 30 hours per table is about **240 printer-hours**, which is ten days of continuous printing on one printer or about two and a half days on four.

Keep for every table the checks that catch assembly errors, which vary from build to build: bearing seating, shaft turning torque, planet timing, centre distance, dial key, running current and the jam stop. Each takes a minute or two and protects that particular table. The coupons can be sampled instead: print and measure them once per printer and filament roll, not once per table, because they test the printer and material, not the build. The soak test need not be repeated on every table; run it on one table from the batch, ideally the one whose running current is highest, and check the sun gear on all eight at the 60,000-index point.
