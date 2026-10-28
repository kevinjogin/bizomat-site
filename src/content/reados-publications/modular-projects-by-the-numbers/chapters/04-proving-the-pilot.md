---
book: modular-projects-by-the-numbers
chapterSlug: proving-the-pilot
order: 4
title: "Proving the pilot: acceptance tests and run length"
description: "Plan FAT, SAT and SIT for a packing cell, test 10 cases a minute and a pallet every 6 minutes, and size the run by the rule of three: 24 hours to show 1 stoppage in 8."
draft: true
---

A pilot is built to be tested, and the test decides whether eleven more cells are built to the same design. That makes the acceptance test the most consequential few days in a modular programme. A test that is too short, or measures the wrong things, can pass a design that will stop every two hours on a working line, and that design will then be copied eleven times.

This chapter sets out the acceptance tests for the running case's pilot cell: what is tested at the factory, on site and with the line, what the pass criteria are, and how to read the cell's performance with overall equipment effectiveness. Most of it is about one question that test plans often answer by habit: how long must the cell run to show that it is reliable enough? The answer comes from a simple rule of statistics, and the chapter ends with a test that was signed off after four hours.

## Three tests, three places

Acceptance testing for automated equipment is normally done in three stages. The international standard IEC 62381 covers the planning of these tests for automation systems in the process industry, under the names used here:

- **Factory acceptance test (FAT):** the cell runs in the integrator's workshop, before it ships, against a written test plan, witnessed by the buyer.
- **Site acceptance test (SAT):** after installation, the cell is tested again in place, to show that it survived transport and installation and works with the site's services.
- **Site integration test (SIT):** the cell is tested together with the line and the site's systems, through every signal in the interface specification, under real production.

```figure
type: timeline
title: Acceptance testing for the pilot cell
caption: This is an illustration. Each stage tests what the previous stage could not see; a failure at any stage sends the cell back, not forward.
- Workshop | Factory acceptance test | rate, quality, recovery and a 24-hour reliability run on real packs and cases
- Workshop | Safety verification | guarding, interlocks and safety functions checked by competent people
- Site | Site acceptance test | the same functions after transport, on the site's power, air and floor
- * Site | Site integration test | with the line, through every interface signal, in production
- Site | Handover | records, training and the start of the benefit
```

The factory test carries the most weight in a modular programme, because the workshop is where faults are cheapest to fix and where the design is being proved for every later cell, not only this one. The site tests then confirm that each installation has been done to the standard, and they have to fit inside the short shutdown that [Short exposure windows](/reados/publications/modular-projects-by-the-numbers/short-exposure-windows/) plans, which is another reason to find faults in the workshop rather than on site.

## Writing the test plan

A test plan states what will be tested, how, what result counts as a pass, and who will witness and sign it. It is written before the test, agreed by both parties, and not changed during the test except by agreement in writing. Its most important line is often the definition of a failure. For the case, a **stoppage** is any stop of the cell that needs a person to intervene before it will run again, however short. Counting only long stops, or only stops with a cause the integrator accepts, is how an unreliable cell passes a reliability test.

This is an illustration. The pilot's factory test plan has these main items.

```figure
type: compare
title: Factory acceptance test plan for the pilot cell, main items
cols: Test | Pass criterion
caption: This is an illustration. Every criterion is measurable on the day; a criterion that needs judgement to read is rewritten before the test.
- Rate | run at 10 cases a minute from a feed at 120 packs a minute | no accumulation build-up over the run
- Catch-up | run at 11 cases a minute after a simulated line stop | accumulation cleared without stopping the feed
- Checkweigher | 20 seeded underweight cases fed at random | all 20 rejected; no good case rejected
- Case and pallet quality | cases square and sealed; pallets to pattern | 60 cases a pallet, every pallet stable
- Recovery | guard opened, emergency stop, air and power loss | restarts without a lost, doubled or crushed case
- * Reliability | continuous run on real packs and cases | stoppage rate shown no worse than 1 per 8 hours
```

## Rate, catch-up and the pallet clock

At the line's rate of 120 packs a minute, the cell must handle 10 cases a minute and complete a pallet of 60 cases every 6 minutes. Over a 24-hour run at full rate, that is 1,440 minutes × 10 = **14,400 cases** and 1,440 ÷ 6 = **240 pallets**. Those two counts give the test team a simple running check: if the case count falls behind the clock, the cell is losing time somewhere, even if nothing has stopped.

The catch-up test matters because the cell sits behind a short buffer. In the case, the accumulation conveyor between the line and the cell holds 24 cases' worth of packs, 2.4 minutes at the line's rate. When the cell pauses, for a pallet change that overruns or an operator clearing a reject, packs build up. If the cell can run at only 10 cases a minute, it can never clear that backlog while the line keeps feeding it. At 11 cases a minute, it clears 1 case a minute, so a backlog of 10 cases from a one-minute pause takes 10 minutes to clear. A cell that cannot run faster than the line will eventually stop it.

## Reading performance with OEE

**Overall equipment effectiveness (OEE)** combines three losses into one figure: **availability**, the share of planned time the cell was running; **performance**, its output while running compared with its ideal rate; and **quality**, the share of output that was good. OEE is their product.

This is an illustration. In the pilot's 24-hour factory run, there was one stoppage of 18 minutes. The cell ran for 1,422 of the 1,440 planned minutes, availability 98.75%. In that time its ideal output was 1,422 × 10 = 14,220 cases, and it packed 14,180, performance 99.72%. Of those, 21 were rejected, leaving 14,159 good cases, quality 99.85%. OEE is 0.9875 × 0.9972 × 0.9985 = **98.3%**.

```figure
type: formula
title: OEE of the pilot's 24-hour factory run
formula: OEE = availability × performance × quality
caption: This is an illustration. A factory run measures the cell's own capability; on a working line, stops upstream will lower the cell's OEE without being its fault.
- Availability | running time ÷ planned time
- Performance | actual output ÷ ideal output in the running time
- Quality | good cases ÷ all cases packed
step: Availability = 1,422 ÷ 1,440 = 98.75%
step: Performance = 14,180 ÷ 14,220 = 99.72%
step: Quality = 14,159 ÷ 14,180 = 99.85%
step: OEE = 0.9875 × 0.9972 × 0.9985 = 98.3%
```

A factory OEE this high is normal and not a forecast. In the workshop the feed never stops unexpectedly, the packs are good and the crew is watching. On site, the line's own stops and changeovers will reduce the cell's running time, and the right comparison will be the line's output with the cell against its output with people. The [OEE and Downtime Analysis tool](/tools/oee-downtime-pro/) does the same arithmetic for any production period, and is useful for setting the site comparison up before the cell arrives.

## How long to run: the rule of three

The reliability item asks for evidence that the cell stops no more often than once in 8 hours. That target was chosen from the outcome: with one person per line across two shifts, a cell that needs attention more often than about twice a shift would need the people the programme is removing.

A short run with no stoppages proves less than it seems. If stoppages occur at random at a steady rate, the number in a run follows a Poisson distribution, and the chance of a run of T hours with no stoppage is e^(−rate × T). The **rule of three** turns this round: with zero events in T hours, the 95% upper confidence bound on the rate is about 3 ÷ T. James Hanley and Abby Lippman-Hand set the rule out in 1983 for medical studies that observed no adverse events, and it applies equally to machines.

For a target of 1 stoppage per 8 hours, a run with zero stoppages must last at least 3 × 8 = **24 hours**. Seen the other way, a cell that truly stops once every 8 hours would get through 24 hours without a stoppage only e^(−3) ≈ **5%** of the time. A 24-hour clean run is therefore good evidence that the rate is no worse than the target.

```figure
type: range
title: What a stoppage-free run shows, 95% upper bound on stoppages per hour
min: 0
max: 0.8
unit: per hour
ticks: 0 | 0.2 | 0.4 | 0.6 | 0.8
caption: This is an illustration of the rule of three. With no stoppages in T hours, the rate could still be as high as about 3 ÷ T. Only the 24-hour run reaches the target of 0.125 an hour.
- Run of 4 hours | 0 | 0.75 | no worse than 1 per 1.33 hours
- Run of 12 hours | 0 | 0.25 | no worse than 1 per 4 hours
- * Run of 24 hours | 0 | 0.125 | no worse than 1 per 8 hours
- Target | 0 | 0.125 | 1 stoppage per 8 hours
```

## When the run has a stoppage

This is an illustration. The pilot's 24-hour factory run had **one stoppage**, the 18-minute stop in the OEE figures, when a case jammed at the packer's discharge. With one event, the 95% upper bound uses a different constant: 4.744 instead of 3. The bound on the rate is 4.744 ÷ 24 = **0.198 stoppages an hour**, or no better than about **1 per 5.1 hours** can be claimed. The run has not shown the target, even though one stoppage in 24 hours sounds better than one in 8.

The test team had three choices: fail the test and change the design, accept a weaker reliability claim, or extend the run. The jam's cause was found and was a setting, not a design fault, so the team chose to extend. With one event, the run must total at least 4.744 × 8 ≈ **38 hours** to show the target. The cell ran another 14 hours without a stoppage, giving a bound of 4.744 ÷ 38 ≈ **0.125 an hour**, 1 per 8.0 hours, and the reliability item passed. Had a second stoppage occurred, the constant would rise to 6.296 and the run would need to total about 50.4 hours.

```figure
type: decision
title: After a reliability run with stoppages
question: Does the 95% upper bound meet the target of 1 stoppage per 8 hours?
caption: This is an illustration using Poisson bounds of 3, 4.744 and 6.296 for zero, one and two stoppages. Extending the run is honest only if the stoppage's cause is understood and fixed.
- Yes | Pass the reliability item | record the run length, stoppages and bound
- * No, cause understood | Extend the run | one stoppage: total at least 38 hours; two: about 50.4 hours
- No, cause unknown | Stop and investigate | a longer run of an unexplained fault proves nothing
- No, design fault | Change the standard and re-test | the fix goes into every later cell
```

For the eleven production cells, the factory test can be shorter, because each is built to a proved design and its job is to show that it was built correctly. In the case, each production cell runs **12 hours** without a stoppage, which shows a rate no worse than 1 per 4 hours at about 95% confidence, and then follows the same site tests as the pilot. Any production cell that stops during its run is investigated before it ships.

## Testing the variant

The pilot is a format-A cell, but the standard includes the format-B change-part kit and recipe described in Chapter 2, and three lines will depend on them. The kit must therefore be proved on the pilot too, not first on a customer line. This is an illustration. The test plan adds a timed changeover from format A to format B and back, with a pass criterion of 20 minutes each way by one person following the written procedure, and a run of 12 hours on format B packs and cases.

The format-B run is deliberately shorter than the main reliability run, and the plan says why. Most of the cell, its frame, drives, controls and software, is the same in both formats and was proved in the main run. The format-B run tests what differs: the pick head, the gripper fingers, the guide settings and the pallet pattern. A clean 12-hour run shows a format-B stoppage rate no worse than about 1 per 4 hours, which is enough to find a badly designed change part but not to prove the full target. The first format-B cell's site integration test then carries the rest of the evidence, and its stoppages are recorded against the same definition.

## Witnessing, records and open items

A factory test is only as useful as its record. The buyer's witness should hold the agreed test plan, record each result against its criterion as it happens, and log every stoppage with its time, cause and duration. Items that do not pass become an **open-items list**, graded by what they block: items that must be fixed before the cell ships, items that can be fixed before the site test, and items that can be fixed before handover. The grading is agreed at the test, not later. In a modular programme, each open item is also marked as a fault in this cell or a fault in the standard; the second kind goes back into the design and the emulation model, as Chapter 3 described, and is closed only when every later cell inherits the fix.

## Safety is verified separately

Performance tests do not show that a cell is safe. Packaging machinery and industrial robots are hazardous plant, and the duties of those who design, manufacture, install, commission and use them are set by the work health and safety laws. Safe Work Australia's *Model Code of Practice: Managing the risks of plant in the workplace* is the national model guidance on those duties, and the AS/NZS 4024 series covers machinery safety, including risk assessment and safeguarding.

In practice, the pilot is where the design's safety functions are verified, by people competent to do it: that each guard and interlock works as designed, that each safety function stops the hazard it is meant to stop within the time the risk assessment requires, and that the instructions and records match the cell as built. Each installed cell is then checked again on site, because transport and installation can disturb what the workshop verified. This book does not set out those checks; it notes only that they are a separate gate with their own sign-off, not an item inside the performance test.

## The error: a four-hour pass

This is an illustration. The integrator's first factory test of the pilot ran for **4 hours**. There were no stoppages, and the integrator's test engineer signed the reliability item as passed.

By the rule of three, 4 clean hours show only that the rate is below about 3 ÷ 4 = **0.75 stoppages an hour**, no better than 1 per 1.33 hours: six times the target rate. A cell that stopped every 4 hours on average would pass a 4-hour clean run e^(−1) ≈ **37%** of the time, and even a cell that stopped every 2 hours would pass it about 14% of the time.

The business's engineer found the problem when checking the signed record against the agreed test plan, which stated the target and asked for the run length to be calculated from it. The signed run was 20 hours short. The reliability item was reopened, the 24-hour run was held, and its one stoppage led to the extension described above. The test plan was changed so that the required run length is written into the plan as a number of hours, worked out from the target before the test begins, and the record must state the run length, the stoppages and the resulting bound, not only "pass".

```figure
type: checklist
title: Before signing a reliability test
caption: This is an illustration. The open question is this chapter's error: a 4-hour clean run cannot show a 1-in-8-hours rate.
- Stoppage defined in the plan | any stop needing a person to intervene
- Run length worked out from the target before the test | 3 × 8 = 24 hours with no stoppages
- Real packs and cases from the business's suppliers | not hand-picked samples
- Every stoppage logged with time, cause and duration | the 18-minute jam at the packer
- x Signing on a run shorter than the plan | 4 hours shows only 1 per 1.33 hours
- ? What the bound is, stated as a number | 4.744 ÷ 38 ≈ 0.125 an hour after the extension
```

## Exercise: a tighter target

For a later version of the cell, the business wants evidence at about 95% confidence that the stoppage rate is no worse than **1 per 10 hours**. How long must a clean factory run be? If one stoppage occurs at hour 20 and its cause is understood and fixed, how long must the run continue?

**Worked answer.** With zero stoppages, the run must last at least 3 × 10 = **30 hours**. With one stoppage, the total run must be at least 4.744 × 10 = **47.44 hours**, about 47.5 hours, so after the stoppage at hour 20 the cell must run about another **27.5 hours** with no further stoppage. A second stoppage would raise the total required to about 6.296 × 10 ≈ 63 hours. The target is worth setting from the outcome rather than by habit, because each step tighter costs workshop time, real packs and cases, and witnesses.
