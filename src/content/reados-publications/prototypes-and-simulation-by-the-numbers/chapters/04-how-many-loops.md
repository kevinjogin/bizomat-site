---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: how-many-loops
order: 4
title: "How many loops: diminishing returns and the speed of iteration"
description: "Loop values of A$48,600 falling to A$2,446 on BPU-5's thermal subsystem, the stopping point for A$7,500, A$19,000 and A$57,500 loops, and a zero-find loop run at the wrong temperature."
draft: false
---

Iteration is the engine of development: build something, test it, learn from the result, change the design, and go round again. Each round finds problems, and the first rounds find the most, because the obvious problems are found first. Later rounds find fewer, while each still costs about the same. At some point another round is not worth its cost, and the team should stop and move on. Where that point lies depends on what a round costs, how long it takes, and whether its time counts against the release date.

This chapter puts numbers on that judgement for the BPU-5's thermal and inverter subsystem, between the first EVT results and the DVT build. It models what each loop is expected to find, values it with the costs by stage from Chapter 1, and finds the stopping point for three kinds of loop. It then shows how to estimate what remains from the counts actually found, and ends with a loop that found nothing because it could not have found anything, and very nearly stopped the iteration early.

## A loop is build, test, learn, change

A **loop** here is one complete round of iteration on a subsystem: change the design, build or modify the hardware, test it, and analyse what the test shows. Thomke (1998) describes development as a series of such problem-solving cycles and argues that their cost and duration, which depend on the fidelity of what is built and tested, shape how much a team can learn and how fast. Chapter 2 chose the fidelity of the BPU-5's prototypes; this chapter asks how many times to go round with them.

```figure
type: cycle
title: One iteration loop on the thermal and inverter subsystem
caption: This is an illustration. A standard loop takes 2 weeks and costs A$7,500, excluding GST, of which about A$2,400 is a day in the climatic chamber with the test technician.
- Change | revise the duct, fan, firmware limit or layout from the last loop's findings
- Build | modify the correlated rig or an EVT unit; make or buy the changed parts
- * Test | 1 hour at 3 kW in the climatic chamber, plus inverter start and charge tests
- Learn | log each issue found, its cause and its fix; decide whether to go round again
```

## The subsystem after EVT

This is an illustration. Chapter 2 told how the first enclosed EVT unit's hottest cell reached 52 °C against R2's limit of 45 °C, and how the thermal rig was rebuilt with the lid and real vent grilles so that it agreed with the EVT unit within 1.5 K. The mechanical design engineer began a fan-duct redesign, and the lead electrical engineer and the test technician planned a series of loops on the whole thermal and inverter subsystem: the battery bay, the fan and duct, the inverter's heat path, and the charger and inverter firmware that manages temperatures.

The business has one **climatic chamber**, which holds the rig or one unit at a set temperature and humidity. A thermal re-test, a day in the chamber with the test technician, costs about **A$2,400**, excluding GST. A standard loop, including changed parts, rig modifications, the chamber day and engineering time, costs about **A$7,500** and takes **2 weeks**.

Based on the EVT findings and the LT-4 record, the team estimated that the subsystem still held about **12 latent issues**, and that each loop would find about **0.45** of the issues remaining, a per-loop capture rate in the sense of [Finding problems while they are cheap](/reados/publications/prototypes-and-simulation-by-the-numbers/finding-problems-while-they-are-cheap/). An issue found in a loop is fixed at the EVT-stage cost of A$6,000; one not found would most likely surface at DVT, at A$15,000. Each issue found in a loop is therefore worth 15,000 − 6,000 = **A$9,000**.

## Diminishing returns

With a constant capture rate, each loop finds 0.45 of what remains, and what remains shrinks by a factor of 0.55 each time. The first loop is expected to find 12 × 0.45 = **5.40** issues, leaving 6.60. The second finds 6.60 × 0.45 = **2.97**, leaving 3.63, and so on. Each expected find is 0.55 times the one before.

```figure
type: bars
title: Expected value of each loop on the thermal and inverter subsystem
unit: A$
max: 50000
caption: This is an illustration, excluding GST. Each loop finds 0.45 of the 12 issues remaining, at A$9,000 an issue. Against a standard loop's A$7,500, loops 1 to 4 pay; against A$19,000 for a rapid loop on the critical path, loops 1 and 2.
- * Loop 1 | 48600 | 5.40 issues
- Loop 2 | 26730 | 2.97 issues
- Loop 3 | 14702 | 1.63 issues
- Loop 4 | 8086 | 0.90 issues
- Loop 5 | 4447 | 0.49 issues
- Loop 6 | 2446 | 0.27 issues
```

The value of loop k is 12 × 0.45 × 0.55^(k − 1) × A$9,000: **A$48,600** for the first loop, then A$26,730, A$14,702, A$8,086, A$4,447 and A$2,446. The first two loops together are expected to find 8.37 of the 12 issues; six loops find all but 0.33.

The shape is general even where the numbers are not. Early loops find the problems that any test would reveal; later loops are left with the problems that are rare, subtle, or that only appear in particular conditions. A constant capture rate is a simplification, and Chapter 1's warning applies: capture rates are averages over issue types, and some types can only be found by some tests.

## When to stop

The stopping rule follows directly: **run the next loop while its expected value is greater than its cost.** Because each loop is worth less than the one before, once a loop fails the test, every later loop fails it too.

What a loop costs depends on whether its time is on the critical path, and here the cost of delay from Chapter 1, A$25,000 a week, changes the answer completely.

- **Standard loop, off the critical path: A$7,500.** If the loops run while the team waits for something that would not arrive sooner, their 2 weeks cost no release time. Loop 4 is worth A$8,086, more than A$7,500; loop 5 is worth A$4,447, less. **Run loops 1 to 4.** Their expected value is A$98,118 for A$30,000.
- **Standard loop, on the critical path: A$57,500.** If each loop's 2 weeks push the DVT build and the release, each costs 7,500 + 2 × 25,000 = A$57,500. Even the first loop's A$48,600 is less. **Run none**, and accept that the issues will be found at DVT.
- **Rapid loop on the critical path: A$19,000.** The team could instead run 3-day loops with 3D-printed duct and bracket parts in place of machined ones, at **A$4,000** a loop plus 0.6 of a week on the critical path: 4,000 + 0.6 × 25,000 = A$19,000. Loop 2 is worth A$26,730, more than A$19,000; loop 3 is worth A$14,702, less. **Run loops 1 and 2.**

```figure
type: compare
title: Three kinds of loop and where each should stop
cols: Cost per loop | Time per loop | Effective cost | Loops worth running
caption: This is an illustration, excluding GST. Delay is charged at A$25,000 a week only on the critical path. A loop worth A$48,600 is not worth running if it costs A$57,500 in effect.
- * Standard loop, off the critical path | A$7,500 | 2 weeks | A$7,500 | 1 to 4
- Standard loop, on the critical path | A$7,500 | 2 weeks | A$57,500 | none
- Rapid loop, printed parts, on the critical path | A$4,000 | 3 days | A$19,000 | 1 and 2
```

The comparison makes two points. First, delay dominates: the standard loop's A$7,500 is a small part of its A$57,500 effective cost on the critical path. Second, speed is worth paying for when the loop's time counts: the rapid loop runs two worthwhile loops where the standard loop on the critical path runs none. Thomke's argument that cheaper, faster experiments allow more learning, and Reinertsen's (2009) emphasis on fast feedback in development, both show up here as arithmetic.

For the BPU-5, the loops could run off the critical path. The DVT build was planned for week 36, and the parts with the longest lead times had already been ordered to designs the loops would not change. The team therefore planned standard loops, expected to stop after loop 4, and protected their 2-week rhythm from other demands on the chamber. How queues for a shared test resource stretch loops, and so turn off-critical-path work into critical-path work, is the subject of [Queues in the test lab](/reados/publications/prototypes-and-simulation-by-the-numbers/queues-in-the-test-lab/).

The stopping rule is a rule decided before the results. Deciding in advance what will end a series of loops, and writing it down, guards against both stopping too early when a result is disappointing and continuing too long out of habit. [Stopping rules and kill criteria written before the evidence](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/kill-criteria-before-the-evidence/) in *Stage Gates and Stopping Rules by the Numbers* treats the same discipline at a project's funding gates.

## What the loop model assumes

The model is simple enough to work on a single sheet, and its assumptions should be written beside its answer.

- **A constant capture rate.** In practice the issues left after several loops tend to be the harder ones to find, so the rate often falls from loop to loop. A falling rate makes later loops worth less and moves the stopping point earlier, not later.
- **Fixes introduce no new issues.** A changed duct or a new firmware limit can create a problem of its own. A loop that both finds and creates issues needs more loops than the model suggests, and its records should show which issues were caused by earlier fixes.
- **Every issue is worth the same A$9,000.** An issue that would otherwise reach the field rather than DVT is worth far more, and one trivial issue far less. Where the team can see that some remaining issues are severe, the value of the next loop should be raised to match.
- **Each loop can detect every class of issue.** This is the assumption that failed in the BPU-5, as the error below shows.

How much to change in each loop is a related choice. Changing several things at once makes each loop more productive, but if the result gets worse it is hard to tell which change caused it. The BPU-5 team grouped changes by the question they answered: duct and fan changes together, firmware changes together, and never a duct change in the same loop as a firmware change that also affects temperature.

## Estimating what remains from the counts

The estimate of 12 latent issues was a judgement made before any loop ran. The counts from the loops themselves improve it. Loops 1, 2 and 3 found **6, 3 and 2** issues, a total of 11. If the capture rate really is 0.45, three loops find a share 1 − 0.55³ = 0.834 of the issues that were there, so the total is about 11 ÷ 0.834 = **13.2**, slightly more than the 12 first estimated. About **2.2** issues remain after loop 3, and loop 4 should find about 2.2 × 0.45 = **0.99** of them.

```figure
type: stats
title: What the first three loops say about what remains
caption: This is an illustration. The estimate assumes the capture rate of 0.45 holds and that every loop can detect every kind of issue. The second assumption failed in loop 4.
- 6, 3, 2 | issues found in loops 1 to 3 | 11 in total
- 13.2 | estimated issues at the start | 11 ÷ (1 − 0.55³)
- * 2.2 | estimated issues remaining | after loop 3
- 0.99 | expected find in loop 4 | 2.2 × 0.45
```

The method is crude and its result is uncertain: it rests on the assumed capture rate, and with counts this small the estimate could easily be out by a few issues either way. It is still far better than ignoring the counts, because it turns the loops' results into an estimate of what has not yet been found, which is the number that matters for deciding whether to stop. The same idea, comparing models, mock-ups and a pilot by what each found, appears for a production cell in [Iterating the plan: models, mock-ups and the cost of change](/reados/publications/modular-projects-by-the-numbers/iterating-the-plan/) in *Modular Projects by the Numbers*.

## The error: a loop that could not see the problem

This is an illustration. Loop 4 found **no issues**. At the loop review, the mechanical design engineer proposed stopping the iteration: the expected find had been about one issue, none had appeared, and the counts seemed to say the subsystem was clean. The fan-duct redesign was showing good results, and the team was keen to release drawings for the DVT build.

The lead electrical engineer, checking the loop records before signing off, noticed that loop 4 had been run at **23 °C room temperature**, on a bench, because the climatic chamber was booked for other tests that week. It had checked the inverter's starting and the charger's behaviour, but at room temperature it could not reveal any issue that appears only when the unit is hot. For that class of issue, loop 4's capture rate was zero. Its result was no evidence at all that the heat-related issues were gone.

Even a loop that could have seen the issues would have given weak evidence. With 2.2 issues remaining and a capture rate of 0.45, the expected find is 0.99, and the chance of finding none is about e^(−0.99) = **0.372**, using the Poisson approximation. More than a third of the time, a loop that is working perfectly well finds nothing when issues remain. A single zero is not a reason to stop; the stopping rule is about expected value, not the last count.

The team ran loop 5 in the climatic chamber at **35 °C**, the ambient in R2. It found **2 issues**. The fan's airflow fell at high temperature more than its datasheet suggested, so the fan needed derating in the thermal model and a higher speed setting. And the charger firmware did not reduce charging current when the hottest cell exceeded 45 °C, the cell maker's charging limit in the case, so a hot unit put on charge at the end of a summer day would charge outside the cell limit. Both were fixed at the EVT-stage cost, and both would have been found at DVT, or worse, in the field.

In effect, loop 5 was the fourth loop for heat-related issues, and by the stopping rule a fourth standard loop off the critical path, worth A$8,086, was worth its A$7,500. The loops had found 6 + 3 + 2 + 0 + 2 = 13 issues, close to the estimate of 13.2. With the fan-duct redesign and both fixes in place, the DVT units' hottest cell reached **43.0 °C** after 1 hour at 3 kW in a 35 °C ambient, inside R2's 45 °C limit.

The business changed its loop procedure: every loop record states the test conditions, and a loop that is meant to count towards the thermal subsystem runs in the chamber at 35 °C. A loop run in other conditions is recorded as a loop on the issues it could detect, not on the whole subsystem.

```figure
type: checklist
title: Before stopping a series of loops
caption: This is an illustration. The crossed item is the loop 4 error. A zero count means something only if the loop could have found the issues in question.
- Compare the next loop's expected value with its full cost | including delay when on the critical path
- Re-estimate what remains from the counts so far | 11 ÷ 0.834 = 13.2 after loops 1 to 3
- Check that each loop's conditions could reveal each class of issue | thermal issues need 35 °C in the chamber
- x Stop because the last loop found nothing | P(0 found) was 0.372 even for a loop that could see
- ? Which classes of issue has no loop yet been able to detect | the 23 °C loop was blind to heat
```

## Exercise: rapid loops off the critical path

Suppose the rapid 3-day loop with printed parts could run off the critical path, so that it costs only its **A$4,000**. With the same 12 issues, capture rate 0.45 and value of A$9,000 an issue, how many loops are worth running?

**Worked answer.** The loop values are unchanged: A$48,600, A$26,730, A$14,702, A$8,086, A$4,447 and A$2,446. Each loop is worth running while its value exceeds A$4,000. Loop 5, worth **A$4,447**, passes; loop 6, worth **A$2,446**, does not. Run **loops 1 to 5**, one more than the standard loop justifies, because each loop is cheaper. The five loops are expected to find 12 × (1 − 0.55⁵) = 11.4 issues and are worth A$102,565 together, for A$20,000 of loops. Making loops cheaper moves the stopping point later; making them faster matters most when their time is on the critical path, as the three loop types above show.
