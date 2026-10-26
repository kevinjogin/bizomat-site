---
book: sheet-metal-production-runs-by-the-numbers
chapterSlug: routing-and-operation-times
order: 7
title: "Routing and operation times"
description: "Build the tray's routing, time each operation from its parts, find the press brake as the bottleneck at 35 hours, plan the days, and catch a laser time without the sheet handling."
draft: false
---

A routing is the list of operations a product passes through, in order, with the work centre, the setup and the time for each. For a production run it is the plan everyone works from: the programmer, the operators, the scheduler and the estimator. Its times decide how long the run takes and what it costs, and on a run of five hundred, a minute saved or missed on one operation is more than eight hours across the run.

This chapter builds the running case tray's routing. It times each operation from its parts rather than by guess, finds the operation that limits the run, turns the times into days, shows how a change to one operation moves the whole plan, and ends with a laser time that left out the sheets being loaded and unloaded.

## The operations

The tray passes through seven operations, six in the shop and one at the coater:

1. **Laser cut and etch** the blanks from the sheet, three per sheet.
2. **Deburr** the edges and slots and file off the micro-joint nibs.
3. **Press the denesting lugs**, four per blank, on a small press.
4. **Fold** on the press brake: hems, lap tabs, long walls, short walls.
5. **Rivet** the corners in the bench jig and check the tray.
6. **Coat**, at the subcontract powder coater.
7. **Label, stack and pack** on pallets.

Each operation has a work centre, a setup and a run time per tray. The run times below are standard times: what a trained operator achieves once the run has settled down. Chapter 8 deals with the slower first trays.

## Timing from the parts

Each time is built from what the operation actually does, so that it can be checked and changed when the product changes. This is an illustration, and the rates and speeds are the shop's own figures.

- **Laser.** The cut length per blank is about 4.59 m, including the outline, notches, tabs and slots. At a cutting speed of 8 m/min in 1.2 mm mild steel, that takes 0.57 minutes. Five pierces at about 2 seconds each add 0.17 minutes. Loading a sheet and unloading its blanks and skeleton takes about 1.5 minutes per sheet, so 0.5 minutes per blank at three per sheet. Total about **1.24 minutes** per tray.
- **Deburr.** Edges, slot and nibs with a hand tool: about **1.0 minute**.
- **Lugs.** Four hits on a located blank: about **0.6 minutes**.
- **Fold.** Sixteen press brake hits, two for each of the four hems, one for each of the four lap tabs and one for each of the four walls, at about 12 seconds each including repositioning, is 3.2 minutes, plus 1.0 minute of handling the growing tray: about **4.2 minutes**.
- **Rivet and check.** Eight rivets, the tray loaded into and out of the jig, and the diagonal and depth checks of Chapter 4: about **2.0 minutes**.
- **Pack.** Label, nest and stack: about **0.6 minutes**.

The shop's operations add up to about **9.64 minutes** of standard time per tray.

```figure
type: compare
title: Routing for the tote tray, standard times
rowhead: Operation
cols: Work centre | Setup per batch | Run time per tray | Run hours for 500
caption: This is an illustration. Standard times after learning; the coater's time is its own. The press brake carries the most hours and sets the pace.
- 10 Laser cut and etch | Fibre laser | 20 min | 1.24 min | 10.3
- 20 Deburr | Bench | none | 1.0 min | 8.3
- 30 Press lugs | Small press | included in folding | 0.6 min | 5.0
- * 40 Fold | Press brake | 45 min | 4.2 min | 35.0
- 50 Rivet and check | Rivet jig | 15 min | 2.0 min | 16.7
- 60 Coat | Subcontractor | batch charge | by area | 
- 70 Label and pack | Packing bench | none | 0.6 min | 5.0
```

## Setups

Each work centre also needs a setup before the first tray: the time to prepare the machine for this product, done once per batch however many trays follow. This is an illustration.

- **Laser, 20 minutes**: load the nest program, check the nozzle and focus for 1.2 mm steel, cut the first sheet and check one blank's key dimensions and the etched lines before releasing the rest.
- **Press brake, 45 minutes**: fit the hemming tools and the segmented punch set to 318 mm, fit the die for 1.2 mm sheet, load the back-gauge programs for the four kinds of fold, and fold the first two trays, checking their depth, diagonals and fold angles.
- **Rivet jig, 15 minutes**: set the jig's stops to the tray's corners and set the riveter's nosepiece for 4 mm rivets.

That is 80 minutes of setup, all of which happens before any tray is finished. On a batch of 500 it adds only about 10 seconds per tray; on a batch of 50 it adds more than a minute and a half. The lug press shares the press brake's setup in this shop's plan, because the same operator sets both. Chapter 8 works out how setups and batch size trade against each other.

## Work instructions

Every operation on the routing has a work instruction at the work centre: a single page with the operation's steps, a photograph or sketch of the part before and after, the tools and settings, and the checks the operator makes. The instruction is where the routing's knowledge reaches the person doing the work.

The most useful lines on a work instruction are the ones that prevent this book's errors: the lug die's orientation in operation 30, the lap tab's 87.8° fold and the short walls folded last in operation 40, the diagonals and depth in operation 50. Each is written as something to check, with its number, not as general advice, because "fold carefully" helps nobody and "short walls last, punch set to 318 mm" stops a fouled fold.

## Measuring actual times

Standard times are estimates until the run proves them. The shop records actual times on the first batch: the laser's log gives its time per sheet; the press brake operator notes the time for every tenth tray; the riveting bench counts trays per hour. This is an illustration. If folding settles at 4.5 minutes instead of 4.2, the run's press brake time rises from 35 to 37.5 hours and the plan moves by about four hours, which the shop would rather know on day two than on day six.

The measured times also go back into the shop's estimating data, so that the next tray-like product is estimated from what actually happened, not from what was assumed. A routing whose times are never measured stays an estimate forever.

## The bottleneck

Add up the run hours and the press brake stands out: **35 hours** of folding for 500 trays, against 16.7 for riveting, 10.3 for the laser and less for the rest. The press brake is the **bottleneck**: the run cannot finish faster than the press brake can fold it, however fast the other operations go.

That has three practical consequences.

1. **The schedule is the press brake's schedule.** This is an illustration. With one operator working a 7.5-hour shift and achieving about 85% of the time at standard pace, after breaks, small stoppages and checks, the press brake folds about 6.4 hours of standard work a day. Thirty-five hours takes about **5.5 working days**.
2. **Time saved elsewhere does not shorten the run.** Speeding up the laser by a third saves 3.4 hours of laser time and no days, because the laser already finishes long before the press brake.
3. **Time saved at the press brake shortens everything.** Every minute cut from folding a tray saves 8.3 hours of the run's critical path.

The other operations are arranged to keep the press brake busy: the laser runs ahead and builds a buffer of cut and lugged blanks, and the riveting bench follows, so that the press brake never waits for blanks and never runs out of space for folded trays.

```figure
type: bars
title: Run hours by operation for 500 trays
unit: h
max: 40
caption: This is an illustration at standard times. The press brake carries more than twice the hours of any other operation, so it sets the run's length.
- Laser | 10.3
- Deburr | 8.3
- Lugs | 5
- * Fold | 35
- Rivet and check | 16.7
- Pack | 5
```

## Rates and buffers

The routing's times also say how fast each work centre produces trays, which decides the buffers between them. This is an illustration. At 1.24 minutes per blank, the laser produces about 48 blanks an hour; at 4.2 minutes per tray, the press brake folds about 14 an hour; at 2.0 minutes, the riveting bench finishes 30 an hour. The laser therefore runs far ahead of the press brake, and in its first day of cutting builds a pile of several hundred blanks waiting to be folded.

That pile is work in progress, and it needs space, handling and protection: cut blanks are stacked flat on a stillage with interleaving where etched lines or lugs could mark the next blank. The shop plans the laser's cutting in two sessions rather than one, so that the pile never holds more than about a day and a half of the press brake's work, enough to keep it busy through a laser breakdown without filling the floor with blanks. Downstream, the riveting bench, at twice the press brake's rate, works in bursts and spends the rest of its time deburring and pressing lugs, which keeps one operator usefully occupied between the two.

## Improving the bottleneck

Because the press brake sets the pace, the shop looks there first for improvement. The hems take eight of the sixteen hits: each is folded to an acute angle and then closed flat. This is an illustration. A hemming die that closes a hem in one hit would cut the hems to four hits, saving four hits of 12 seconds, 0.8 minutes per tray, so folding would take **3.4 minutes** instead of 4.2.

Over 500 trays, that saves 400 minutes, about 6.7 hours, and more than a day of the press brake's schedule. Whether it is worth doing depends on the die's cost against the time saved on this run and the repeat runs the distributor expects. Chapter 9 puts the numbers together.

Other options at the bottleneck include a second operator handling and stacking so that the press brake operator only folds, or moving the lug pressing onto the press brake as one more hit if the tooling allows. Each is evaluated the same way: minutes saved per tray at the bottleneck, multiplied by the run.

## The error: a laser time without the sheets

This is an illustration. The first routing timed the laser from the cutting program's own estimate, which counts only cutting and pierce time: about 0.74 minutes per blank. The laser was booked for 500 × 0.74 = 370 minutes, a little over six hours.

The program's estimate leaves out loading each sheet onto the laser and unloading its blanks and skeleton, about 1.5 minutes per sheet, 0.5 minutes per blank, 250 minutes over the run. The real laser time was about **620 minutes**, two thirds more than booked. Because the laser is not the bottleneck, the run's finish date did not move, but the laser's other jobs that week did, and two other customers' parts were a day late.

The shop now times every machine operation as cutting plus pierces plus handling per sheet, and checks the routing's laser time against the machine's log on the first ten sheets of every run. The cutting program's estimate is a part of the time, not the time.

```figure
type: checklist
title: Routing checks before scheduling the run
caption: Each check makes sure a time is built from the operation's parts and includes everything the operation does.
- Every operation listed with its work centre | seven, one subcontracted
- Machine times include handling per sheet or part | laser 1.24 min, not 0.74
- Times built from counts: hits, rivets, metres of cut | 16 hits, 8 rivets, 4.59 m
- Bottleneck identified from run hours | press brake, 35 hours
- Days worked out from the bottleneck's available hours | about 5.5 days
- x Laser booked from the program's cutting estimate | 250 minutes short
```

## From hours to a plan

The routing's hours become a plan by working out each work centre's days. The press brake's 5.5 days set the run. The laser, at 10.3 hours, runs in its first two days and builds the buffer. Deburring, lugs and riveting follow the press brake by a few trays each, and the packing bench works as trays come back from the coater.

This is an illustration. The shop's plan for the run is: the laser in the first two days of week two; press brake and riveting from day two of week two to the middle of week three; trays to the coater in two batches of 250, the first in week three as soon as it is folded, the second at the end of week three; packing in week four as the coated trays return. Chapter 6's lead-time chain had allowed two weeks for the shop's work, and the routing confirms it fits, with about a day and a half to spare.

## Exercise: a second press brake operator

The shop considers a second person at the press brake to handle blanks and stack folded trays, so that the operator only folds. Suppose that cuts the folding time from 4.2 to 3.4 minutes per tray without the hemming die. How many press brake days does the run then need, and does the bottleneck move?

**Worked answer.**

- Folding: 500 × 3.4 = 1,700 minutes, about **28.3 hours** of standard work.
- At about 6.4 hours a day, that is about **4.4 working days**, more than a day sooner than 5.5.
- Riveting, at 16.7 hours, is still well below the folding's 28.3 hours, so the press brake **remains the bottleneck**.

The second person adds about 28 hours of labour to save about 6.7 hours at the press brake, so the change shortens the run but costs more labour than it saves. It is worth doing if the delivery date needs the day; otherwise the hemming die, which saves the same press brake time with no extra labour, is the better improvement.
