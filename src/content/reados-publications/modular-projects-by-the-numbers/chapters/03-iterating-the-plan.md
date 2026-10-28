---
book: modular-projects-by-the-numbers
chapterSlug: iterating-the-plan
order: 3
title: "Iterating the plan: models, mock-ups and the cost of change"
description: "Find faults while they cost A$1,500, not A$31,000: an emulation model, a mock-up and a pilot cut the cost of 23 issues from A$713,000 to A$156,000, with one case-size miss."
draft: false
---

Every new design has faults. The question is not whether they will be found but where, because the cost of fixing one rises steeply the further the design has travelled towards a working production line. A fault found in a model costs an engineer's afternoon. The same fault found on an installed line costs rework, lost production and, in a modular programme, possibly a retrofit to every cell already built. Planning well means planning the places where faults will be found, and making those places cheap.

This chapter follows the running case's standard cell through three rounds of iteration: an emulation model, a full-size mock-up and a pilot built in the integrator's workshop. It puts a cost on each fault by the stage at which it is found, totals the case's 23 issues under three strategies, and shows why the time spent iterating is repaid many times over. It ends with a model that was too perfect: it used the nominal size of the cases, and the real ones were not nominal.

## The cost of a fault rises with each stage

This is an illustration. In the case, the cost of fixing one design issue depends on where it is found:

- **In the emulation model, A$1,500.** The fix is a change to the design and the model: an engineer's time to understand the problem, change the drawing or the program, and re-run the model to prove it.
- **On the pilot in the integrator's workshop, A$15,000.** Parts already made must be modified or remade, wiring changed, guarding refitted and the affected tests repeated. The cell is not yet earning, but the workshop and the crew are committed to it.
- **On an installed production line, A$31,000.** The same A$15,000 of rework, done on a working site, plus two lost production days at A$8,000 each.

All amounts exclude GST. The step from model to workshop is a factor of 10; the step from workshop to site roughly doubles it again. The pattern, not the exact values, is what matters, and it holds in almost every kind of engineering: a change costs least while it is still only information.

```figure
type: bars
title: Cost to fix one issue by where it is found
unit: A$
max: 31000
caption: This is an illustration, excluding GST. Each stage further from the drawing board multiplies the cost of the same fix.
- Emulation model | 1500 | change the design and re-run the model
- Pilot in the workshop | 15000 | rework, refit and re-test
- * Installed production line | 31000 | A$15,000 of rework plus 2 lost days at A$8,000
```

In a programme of identical cells, there is a further multiplier. A fault that escapes the pilot is part of the standard, so it is built into every cell made before it is found. If four cells have shipped when it appears, it must be fixed four times on four working sites. Chapter 8, [Rollout rhythm](/reados/publications/modular-projects-by-the-numbers/rollout-rhythm/), deals with that risk when setting how many cells to build before the pilot has proved the design.

## Three cheap ways to be wrong

### The emulation model

An **emulation model** is a digital model of the cell's machines, driven by the cell's real control program. Simulated packs and cases flow in at the line's rate, the robot moves through its real paths, and the model raises the same signals the real cell would send to the line. It lets the design team run the cell for thousands of simulated hours before any steel is cut: changeovers, faults, recovery after a guard door is opened, a line that stops and starts, a pallet position that is not cleared in time. This practice is often called virtual commissioning.

In the case, the model cost **A$40,000**, excluding GST. That budget also paid for the second tool.

### The full-size mock-up

A **mock-up** is a full-size representation of the operator's side of the cell in timber and cardboard, built in a spare corner of the workshop. Operators from the three sites used it to rehearse the tasks that remain: loading case blanks, changing label rolls, clearing a jammed case, taking a pallet out. It answers questions a screen answers badly, such as whether a person of short stature can load the top of the blank magazine without a step, or whether a maintenance fitter can reach the glue unit without removing a guard. It costs little and it involves the people who will use the cell, early enough for their views to change the design.

### The pilot

The **pilot** is the first real cell, built in the integrator's workshop and run on real packs and real cases from the business's suppliers, with a temporary conveyor feeding it at the line's rate. It is where the physical world gets its say: friction, flexible cardboard, glue that is too cold, vibration, dust, cases that are not quite the size on the drawing. Chapter 4 describes how it is tested; this chapter counts what it finds.

## What each stage found

This is an illustration. The model stage, the emulation model together with the mock-up, found **14 issues**. The pilot found **9 more**. No design issues were found later, on an installed line, though that is a result to be confirmed by the rollout, not assumed.

```figure
type: compare
title: The 23 issues by stage and kind
cols: Found | Examples
caption: This is an illustration. 14 issues were found in the model stage and 9 on the pilot; the kinds differ because each stage can see different things.
- Layout and reach | 3 in the model | robot slowed to reach the far corner of the top layer; reject bin fouled a guard door
- Cycle time and buffers | 4 in the model | layer change too slow at 10 cases a minute; accumulation too short for a pallet change
- Control logic and interlocks | 4 in the model | a case lost on restart after a guard opened; stop request sent too late
- Operator and maintenance access | 3 in the mock-up | blank magazine too high to load; glue unit behind a fixed guard
- * Physical behaviour | 6 on the pilot | case blank misfeeds; glue too cold at start-up; checkweigher disturbed by robot vibration
- Integration with real signals | 3 on the pilot | line running signal delayed; counts duplicated after a restart
```

The split is typical. A model finds logic, timing and geometry faults, because those are the things it represents. A mock-up finds human faults. A pilot finds faults in the things the model left out: the physical properties of real materials and the behaviour of real equipment. Each stage is cheap for some kinds of fault and blind to others, which is why all three are worth having.

## The arithmetic of iterating

This is an illustration. With the model stage and the pilot, the 23 issues cost:

**14 × A$1,500 + 9 × A$15,000 = A$21,000 + A$135,000 = A$156,000.**

Without the emulation model, the business would still have built and tested a pilot, but all 23 issues would have been found in the workshop: **23 × A$15,000 = A$345,000**. Without either, all 23 would have been found on the first installed line: **23 × A$31,000 = A$713,000**, excluding GST.

```figure
type: bars
title: Cost of fixing the 23 issues under three strategies
unit: A$
max: 713000
caption: This is an illustration, excluding GST. The A$40,000 model saved A$189,000 of fixing; the pilot saved a further A$368,000 against finding everything on site.
- * Model stage and pilot | 156000 | 14 × A$1,500 + 9 × A$15,000
- Pilot only | 345000 | 23 × A$15,000
- Neither | 713000 | 23 × A$31,000 on the first installed line
```

The model cost A$40,000 and reduced the fixing cost from A$345,000 to A$156,000, a saving of A$189,000, or **A$149,000** after paying for itself. The pilot, against the strategy of finding everything on site, saved A$713,000 − A$345,000 = **A$368,000**. Neither number counts the lost benefit of a cell that stops repeatedly on a working line, or the damage to the sites' confidence in the programme, both of which would make the late strategy worse.

The comparison is also generous to the late strategy in one way: it assumes the same 23 issues. In practice, some faults found in a model would never be found on a line at all until they caused an incident, such as a case lost on a restart after a guard was opened. Iterating early is cheaper, and it finds faults that late discovery may only find through harm.

## How much iterating is enough

Iteration has diminishing returns. The first weeks of modelling find the obvious faults quickly; later weeks find fewer, and eventually a week of modelling costs more than the faults it finds would cost to fix on the pilot. The issue log gives a practical stopping rule. This is an illustration. If a week of continued modelling costs about A$4,000 of engineering time, and each issue it finds saves A$13,500 against finding it on the pilot, modelling is still paying while it finds more than 4,000 ÷ 13,500 ≈ **0.3 issues a week**, roughly one issue every three weeks. When the rate falls below that, and the remaining questions are ones the model cannot answer, such as how real cardboard behaves, it is time to build the pilot.

The same log makes the next programme better. Each entry should record the stage at which the issue was found, its kind, its cause, the fix, its cost, whether the standard design was changed and which cells were affected. Over one programme, that is a small record. Over several, it becomes the business's own evidence of how many issues a new cell design carries, where they are usually found and what they cost, which is a far better basis for the next plan than a general rule of thumb.

## Plan slowly, deliver quickly

Flyvbjerg and Gardner (2023) argue that big projects go best when the planning is slow and thorough and the delivery is fast, because planning is cheap and safe, while delivery is where exposure, cost and risk build up. The running case puts that argument in numbers. Every week spent in the model stage costs engineering time; every day a cell spends being fixed on a working line costs A$8,000 of lost contribution on top of the rework.

The right attitude to the model stage is therefore not to finish it quickly but to use it fully: to try to break the design in the model, to put operators in front of the mock-up, and to run the pilot hard. A model is not a forecast of how the cell will behave. It is an instrument for finding out, cheaply, where the design is wrong. [Plans that detect rather than predict](/reados/collections/project-estimates-schedules-and-costs/plans-that-detect-rather-than-predict/) makes the same point about plans in general: under uncertainty, a plan's job is to show quickly where current beliefs are wrong.

```figure
type: cycle
title: One round of iteration
caption: Each round runs the design against a test it has not yet passed. The loop is cheap in the model, dearer on the pilot and dearest on a working line.
- Run the design | in the model, the mock-up or on the pilot
- Record what fails | each issue logged with its cause and the stage it was found
- * Change the standard | the design and the model, not just the one cell
- Run it again | prove the fix and look for what it disturbed
```

The third step carries the modular discipline. A fix found on the pilot is made to the standard design, its drawings and the model, so that every later cell inherits it. A fix made only to the pilot cell, with a note to update the drawings later, is the start of the variant creep that Chapter 10 deals with.

## A model is only as good as what it varies

A model reproduces what it is given. If the inputs are nominal, the model shows how the design behaves in a nominal world, which is the one world the cell will never work in. Good emulation varies the inputs that vary in reality: the rate at which packs arrive, the time the line stops for, the operator's response time, and the size, stiffness and condition of the materials. A useful habit is to list, for each input, its nominal value, its real spread and where that spread came from. An input with no recorded spread is an assumption the model has not tested.

## The error: cases that were not nominal

This is an illustration. The emulation model fed the case erector with blanks exactly at their drawing size, and the magazine's side guides were designed with 1 mm of clearance each side of the nominal blank. In the model, the erector picked a blank every cycle for thousands of simulated hours.

On the pilot's first full shift, with blanks from the business's regular supplier, the erector **misfed about one case in 400**. At 10 cases a minute, that is a misfeed about every 40 minutes. Each needed an operator to clear the magazine, about 2 minutes, so the misfeeds alone took about 2 ÷ 40 = **5%** of the running time, before counting any other stoppage.

The pilot team measured a sample of blanks and found widths spread across most of the supplier's tolerance of ±3 mm. Oversize blanks bound in the guides and were picked late; undersize blanks shifted and were picked twice. The emulation model could not have shown this, because nobody had told it that blanks vary.

The fix had four parts. The side guides were redesigned with sprung faces that accept the full ±3 mm. The purchasing specification for new blank orders was tightened to ±1.5 mm. Receiving inspection now measures a few blanks from each delivery. And the emulation model was changed to draw each blank's size from the measured spread, so that later changes to the erector would be tested against real variation. In the following 8-hour run, of 4,800 cases, there were no misfeeds.

The issue is counted among the pilot's nine, at A$15,000. Had the pilot been skipped, it would have been found on the first installed line at about A$31,000, and every cell built before then would have needed new guides. The lesson for the model stage was recorded in the programme's issue log: every input the model treats as fixed must be checked against its real spread before the model is trusted.

```figure
type: checklist
title: Before trusting an emulation model
caption: The open question is this chapter's error. A model fed with nominal inputs proves the design only for a world without variation.
- Real control program running in the model | not a simplified copy of the logic
- Line stops, starts and rate changes included | taken from the lines' own records
- Faults and recoveries exercised | guard openings, jams, power loss
- Operators have used the mock-up | every task they will keep
- x Materials modelled at nominal size only | blanks spread across ±3 mm on the pilot
- ? Which inputs have a recorded spread, and where it came from | listed for every input before sign-off
```

## Exercise: a second round of modelling

After the pilot, the integrator proposes a second round of emulation for the next design change, a new pallet pattern, at a cost of **A$12,000**, excluding GST. The team's judgement, from the issue log, is that the round would find three issues that would otherwise be found on the next pilot run in the workshop. Is the round worth doing, and how many issues would it need to find to break even?

**Worked answer.** Each issue moved from the workshop to the model saves A$15,000 − A$1,500 = **A$13,500**. Three issues save 3 × A$13,500 = **A$40,500**, and the round costs A$12,000, a net saving of **A$28,500**. It breaks even at A$12,000 ÷ A$13,500 ≈ **0.9 issues**, so finding a single issue would pay for it. If any of the three would otherwise have escaped to an installed line, each would have cost A$31,000, and the case for the round is stronger still. The argument against it would have to be about time, not money: if the round delayed the rollout, each week of delay to a cell costs A$3,461.54 of benefit, which should be weighed against the saving.
