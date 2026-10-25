---
book: welding-automation-by-the-numbers
chapterSlug: programming-and-batch-size
order: 6
title: "Programming, changeover and batch size"
description: "Price the programming of each new part by teach pendant and offline, charge each changeover to its batch, find the batch size below which the robot loses money, and plan to keep batches large."
draft: false
---

A robot welds a part well only after someone has taught it how. Every new part needs a program: the path of the torch to every weld, the angles, the parameters, the order of the welds and the moves between them, without hitting the part or the fixture. Every batch needs a changeover: the fixture swapped, the program loaded, the first part checked. Those costs are paid once per part or once per batch, while the robot's saving is earned part by part. Small batches spread the fixed costs over few parts, and below some batch size the robot costs more than welding by hand. Hamilton and Oberg's dedicated rake machine of 1918 never faced the problem, because it made only rakes; a modern cell that makes sixty different brackets faces it every day.

This chapter prices programming by teach pendant and by offline software, charges each changeover to its batch, finds the batch size at which the robot breaks even, and sets out how scheduling and part families keep batches large enough.

## Teaching a program

The traditional way to program a welding robot is with a teach pendant, a hand-held control from which the programmer moves the robot, point by point, to each position along the path, records it, and sets the welding parameters for each segment. It needs the real part in the real fixture, and the cell is occupied, not welding, while it is done. A bracket with a few simple welds may take an hour or two to teach; a complex sub-assembly may take a day or more, with trial welds, adjustments and a first-article inspection before production.

## Programming offline

Offline programming software builds the program on a computer from a three-dimensional model of the part, the fixture and the cell. The programmer defines the welds on the model, the software calculates the path and checks for collisions and reach, and the program is sent to the robot, where it is touched up on the first real part to correct the small differences between the model and reality. The cell is occupied only for the touch-up and trial welds. Offline programming needs accurate models of parts and fixtures, a calibrated cell, software licences and a programmer trained in the software, but it moves most of the programming time out of the cell.

```figure
type: compare
title: Teach pendant and offline programming for a new bracket
cols: Teach pendant | Offline programming
caption: This is an illustration from the running case's trials, with an assumed programmer cost of A$80 an hour and the cell's net saving of A$104 an hour lost while it is occupied (Chapter 5). Figures exclude GST.
- Programmer time | about 6 hours | about 3 hours
- Cell time occupied | about 6 hours | about 1 hour for touch-up and trials
- *Cost per new part | about 6 × 80 + 6 × 104 ≈ A$1,100 | about 3 × 80 + 1 × 104 ≈ A$340
- Needs | the real part and fixture | accurate models and a calibrated cell
- Suits | few new parts; simple shapes | many new parts; complex shapes; a busy cell
```

For the running case, with about fifteen new or revised parts a year, teach pendant programming would cost about 15 × 1,100 ≈ A$16,500 a year, offline about 15 × 340 ≈ A$5,100, against software costing perhaps A$15,000 to buy and A$3,000 a year to maintain. Offline programming pays back in a year or two on that volume, and more quickly if the cell is busy, because every hour of cell time saved is an hour of welding.

## Reach and collision studies

Before a new part is committed to the cell, the programmer checks that the robot can reach every weld at a good torch angle without the arm, torch or cable hitting the part, the fixture or the cell. Offline software does this on the model in minutes, showing where the arm runs out of reach or where the torch would collide, and lets the programmer try a different orientation of the part on the positioner. Without the software, the check is done on the real part with the teach pendant, slowly. Reach studies done before the fixture is built save the cost of a fixture that cannot be welded, and often show a small change to the part, such as moving a gusset a few millimetres, that makes every weld reachable from one set-up.

## Weld order in the program

The program fixes the order in which the welds are made, and the order matters for distortion and for heat. Welding all the welds on one side of a part first pulls it one way; alternating sides balances the shrinkage. Making several welds in quick succession in one area heats it far more than spreading them round the part. The programmer arranges the order with the welding engineer, using the same principles a skilled welder uses by hand, and because the robot repeats the order exactly, the distortion it produces is repeatable and can be allowed for in the fixture. Changing the order later changes the distortion, so the order is part of the approved program, not a free choice at the cell.

## Calibration and touch-up

A program taught or generated for one cell runs in another only if both are calibrated to the same reference, and even in one cell, a crash, a replaced torch or a moved fixture shifts the path. Cells are calibrated with a reference point that the torch is checked against at intervals, often automatically, and the tool centre point, the exact position of the wire's tip, is re-established whenever the torch or its neck is changed. A fixture that is removed and refitted must return to the same place, which is why fixture bases locate on precise pins. Without calibration, programs drift out of position, and every weld moves with them.

## Hand-guided programming

Collaborative robots, and some conventional robots with a hand-guiding device, let the programmer move the torch by hand to each point and record it, rather than driving the arm from the pendant. For simple parts and small batches, hand guiding can make programming a part as quick as welding it by hand once or twice, which lowers the break-even batch dramatically. It is less precise than offline programming for complex paths, and the welding parameters still have to be set and trialled, but for the right work it brings robotic consistency to batches that no conventional cell could weld economically.

## Changeover

Each time the cell switches from one part to another, it stops. The operator removes one fixture and fits the next, or changes the locators on a modular table, loads the program, checks the torch and wire, and welds and inspects a first part before releasing the batch.

```figure
type: formula
title: Cost of a changeover charged to each part in its batch
formula: changeover cost per part = (cell time lost × saving rate + operator time × labour rate + first-part check) ÷ batch size
caption: This is an illustration for the bracket cell, with a changeover of about 30 minutes, the cell's net saving of A$104 an hour, an operator at A$72 an hour, and a first-part check, including a macro section on new programs, costing about A$40. Figures exclude GST.
- Cell time lost | 0.5 h × A$104 = A$52
- Operator time | 0.5 h × A$72 = A$36
- First-part check | about A$40
step: cost per changeover ≈ 52 + 36 + 40 = A$128
step: for a batch of 200: 128 ÷ 200 ≈ A$0.64 per part
step: for a batch of 50: 128 ÷ 50 ≈ A$2.56 per part
```

## The break-even batch

Against the changeover cost per part stands the robot's saving per part. At about A$104 an hour and about 76 brackets an hour, the cell saves about A$1.37 per bracket compared with manual welding. Subtracting the changeover cost per part gives the net saving.

```figure
type: bars
title: Net saving per bracket by batch size
unit: A$ per bracket, after the changeover cost; negative means the robot costs more
max: 1.5
caption: This is an illustration for the running case: a saving of about A$1.37 per bracket before changeover, and about A$128 per changeover. Bars show the net saving; batches below about 94 parts lose money on these figures.
- Batch of 50 | -1.19
- Batch of 100 | 0.09
- *Batch of 200 | 0.73
- Batch of 500 | 1.11
- Batch of 2,000 | 1.30
```

The break-even batch is the changeover cost divided by the saving per part, about 128 ÷ 1.37 ≈ 94 brackets. Below that, the bracket is cheaper to weld by hand; above it, the robot gains, and the gain approaches the full saving as batches grow. For a complex part with a larger saving per part, the break-even batch is smaller; for a simple part with a small saving, it is larger. Every part number has its own break-even batch, and the fabricator calculated it for each.

## Cutting changeover time

Every minute taken out of a changeover lowers the break-even batch. The methods are the same as for quick die change in pressing: fixtures with standard bases that locate on the positioner with pins and lock with a few quick clamps; locator sets for the modular table kept in labelled kits; programs called up by scanning a code on the fixture; the next fixture prepared and checked while the current batch is still welding; and the first-part check made quickly with gauges at marked points. The fabricator brought its average changeover from about 30 minutes to about 12, which cut the cost to about A$65 and the break-even batch to under 50.

## Part families

Parts that share a fixture, or need only a few locators changed, can be welded with almost no changeover between them. Grouping similar brackets into families, designed so that one fixture base and a set of interchangeable locators hold them all, and programs that share most of their path, cuts changeover and programming together. The fabricator's engineers reviewed the sixty bracket designs and found that about forty could be grouped into six families with shared fixtures, a few of them after small design changes agreed with the customers.

## Scheduling for batches

Customers order in their own quantities, which are often small. The fabricator can still weld in economical batches by combining orders for the same part, welding ahead of demand for parts that repeat steadily, and holding a small stock of finished brackets. Each of those has a cost, in stock held and in the risk of a design change making the stock obsolete, which is weighed against the changeover saving. The planner sets a minimum batch for each part from its break-even figure and its demand, and schedules the cell by family so that changeovers within a family are short and changeovers between families are few.

## Program management

A cell running sixty parts has sixty programs, and each one must be the right version. A program edited to correct a weld on one batch and not saved, or saved over the master, or applied to a revised part, produces wrong welds without warning. The fabricator keeps a master copy of each program with its revision, the part revision it matches, the welding procedure and the date of its first-article approval; changes are made only by authorised programmers, recorded, and followed by a new first-article check. Program management is as much a part of the cell's quality system as the welding procedure, a point Chapter 8 returns to.

## Revisions from customers

Customers revise their parts: a hole moves, a flange lengthens, a material thickness changes. Each revision may need a new program, new locators or a new fixture, and the fabricator's contract review checks every revised drawing for its effect on the cell before accepting it. A revision that costs a day of programming and a new fixture on a low-volume part may change the price the fabricator quotes for it.

## Programming skill

Programming is a skill in its own right, combining welding knowledge, robot handling and the patience to perfect paths and angles. A programmer who understands welding produces programs that weld well; one who understands only the robot produces programs that move well and weld poorly. The fabricator trained two of its best welders as programmers, so that the programs carried the welding knowledge of the shop, a choice Chapter 10 discusses. The integrator's training covered the robot; the welding judgement came from the welders.

## The running case: the first year's batches

This is an illustration. In the cell's first year, the planner tracked every batch: part number, quantity, changeover time and welding time. Batches ranged from 40 to 2,400 parts, with a median of about 260. Twenty-two batches were below the break-even size; most were urgent repeat orders for low-volume parts. After the changeover improvements brought the break-even batch below 50, only three batches a year fell below it, and the planner moved those parts back to manual welding on the shop floor, where a welder with a good fixture could make them more cheaply.

## A failure: the overwritten program

This is an illustration. An operator, adjusting a weld on one batch of a bracket because a supplier's material was slightly thicker, saved the adjusted program over the master. The next batch, from the usual material, was welded with the adjusted parameters, which were too hot for it, and burned through at several welds on thin flanges.

The batch was scrapped. The fabricator locked the master programs against editing at the cell, set up a separate, recorded procedure for temporary adjustments, and added a check of the program revision to the first-part sign-off.

## Exercise: break-even batches for two parts

Part A saves about A$2.40 per part in the cell; part B saves about A$0.80. A changeover costs about A$65. What is each part's break-even batch? If part B is ordered in batches of 60, should it be welded in the cell, and what could change the answer?

Part A breaks even at 65 ÷ 2.40 ≈ **27 parts**; part B at 65 ÷ 0.80 ≈ **81 parts**.

At batches of 60, part B is below its break-even: each batch would cost about 65 − 60 × 0.80 = **A$17** more in the cell than by hand. It should be welded manually, unless orders can be combined into batches above 81, it can share a fixture with another part in its family so that its changeover costs less, or a design change raises its saving per part in the cell.
