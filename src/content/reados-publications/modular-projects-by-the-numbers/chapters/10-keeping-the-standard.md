---
book: modular-projects-by-the-numbers
chapterSlug: keeping-the-standard
order: 10
title: "Keeping the standard: change control and closing the programme"
description: "Baselines and change requests, A$15,120 per site deviation, a benefit review at 98.3% of A$2.16m, a cost ratio of 1.030, and a local change copied from cell 5 into cell 9."
draft: true
---

Every benefit of the modular programme depends on the cells being the same. The design was paid for once because it is used twelve times; the crew's hours fell because it built the same cell again; the installation took three days because every interface had been proved before; the spares and training are shared because the parts and screens match. A standard that drifts loses those benefits one small change at a time, usually for good local reasons and usually without anyone deciding to give them up.

This chapter covers the discipline that keeps the standard: the baseline and the record of each cell as built, the three kinds of change and how each is decided, the cost of a deviation, and how lessons travel from one cell to the next. It then closes the programme with a review of the benefits and costs actually achieved and adds the results to the business's own records, so that its next programme starts from its own outside view. The error case is a local change to one cell's controls that was copied, unrecorded, into another.

## The baseline and the record of each cell

**Configuration management** is the practice of knowing exactly what each unit is, what it should be, and what changed between the two. It rests on two records.

The **baseline** is the released definition of the standard cell: the drawings and parts list, with 1,250 part lines of which 1,175 (94.0%) are common to every cell; the controller and safety-controller software, each with a version number; the recipe settings for formats A and B; the build book revision; and the factory acceptance test script. Each item carries a revision, and the baseline as a whole carries one too, so that "baseline revision 4" means one exact set of documents and files.

The **configuration record** of each cell is its as-built history: which baseline revision it was built to, the serial numbers of its machines, the software versions loaded with a checksum of each file, its recipe set, any approved deviations, and its test and safety validation records. A **checksum** is a short number calculated from a file's contents; if one character of a program changes, the checksum changes, which makes an unrecorded edit easy to detect.

```figure
type: tree
title: The configuration record of one cell
caption: This is an illustration. Every item names a revision or a checksum, so the cell can be compared with the baseline in minutes rather than by reading programs line by line.
- Cell 9, site B, format A | built to baseline revision 4
  - Mechanical | drawings and parts list at revision 4; machine serial numbers
  - * Software | controller and safety-controller versions, each with its checksum
  - Recipes | format A settings, locked limits for site-adjustable values
  - Deviations | approved site variants, none for cell 9
  - Records | factory and site acceptance tests, safety validation, build book revision
```

## Three kinds of change

Changes will be requested throughout the rollout and for years afterwards. Each one is one of three kinds, and the kind decides how it is handled.

A **fleet change** alters the baseline for every cell. It gets a new baseline revision, an **effectivity**, the first cell built to it, and a separate decision about whether to retrofit the cells already built. A **site variant** is an approved difference for one site's cells, recorded in the baseline as a named variant with its own drawings or settings, so that the difference is designed, tested and documented as carefully as the standard. A **local change**, made on one cell by whoever is on hand, is not a kind of change the programme allows: it is either raised as a request and decided as one of the first two kinds, or reversed.

```figure
type: steps
title: How a change request is decided
caption: This is an illustration. The impact assessment is what turns a good local idea into a decision about the fleet. A change that touches a safety function goes to a competent person before anything else.
- Raise the request | what, why, which cells, with evidence of the problem it solves
- Assess the impact | cost, learning, spares, training, software versions, effect on other sites
- Check safety | any effect on a safety function goes to a competent person for assessment and validation
- * Decide the kind | fleet change, site variant, or decline
- Implement and verify | new baseline or variant revision; test on the first affected cell
- Update the records | baseline, configuration records, build book, training material
```

Safety functions deserve their own rule. A change to a guard, an interlock, a light curtain, a safety-controller program or a stopping time changes the basis on which the cell was validated. It must be assessed and validated again by people competent to do it, under the work health and safety laws, the model Code of Practice for managing the risks of plant and the AS/NZS 4024 series. The software arrangement should make such changes impossible without the right access, not merely discouraged.

## What a deviation costs

Site requests are often reasonable one at a time: a different screen layout to match a site's other machines, a different photo-eye brand the electricians already stock, a guard door hinged the other way to suit a walkway. The cost of each is easy to underestimate, because most of it falls outside the change itself.

This is an illustration, in A$ excluding GST. One site variant, designed and documented properly, costs about 40 hours of engineering and drawing updates at A$160 (A$6,400), 24 hours to branch and test the software (A$3,840), 30 extra assembly hours at A$120 (A$3,600) and 8 hours of extra factory testing (A$1,280): **A$15,120** before the cell runs.

```figure
type: stack
title: One-off cost of one properly managed site variant
unit: A$
caption: This is an illustration, in A$ excluding GST, totalling A$15,120. The ongoing costs, a second version to maintain, its own spares and training, and lost learning, come on top for the life of the cells.
- Engineering and drawings, 40 h at A$160 | 6400
- Software branch and test, 24 h at A$160 | 3840
- Extra assembly, 30 h at A$120 | 3600
- Extra factory testing, 8 h at A$160 | 1280
```

The ongoing costs are larger and harder to see. Every variant is a second version of something to maintain for the life of the cells: a second software branch to update when the fleet changes, a second set of spares, a second page of the training material. It also takes the crew partly off its learning curve, in the same way that the format-B change-part kit added 180 hours to cell 4's timesheet. And each variant replaces common part lines with site-specific ones, so commonality falls.

This is an illustration. During the rollout, the sites raised **17 change requests**. Four were accepted as fleet changes, because they improved every cell; three were accepted as site variants, at about 3 × A$15,120 = **A$45,360**; ten were declined, most because the problem could be solved on the site side of the interface or by a recipe setting within the locked limits. Had all thirteen site requests become variants, they would have cost about 13 × A$15,120 = **A$196,560** before any ongoing cost, and if each had replaced eight common part lines on average, commonality would have fallen from 94.0% to (1,175 − 104) ÷ 1,250 = **85.7%**. That is variant creep: no single step looks expensive, and the standard quietly becomes twelve slightly different machines.

## Lessons fed forward

Repetition is valuable only if lessons travel. Each factory test, installation and early production week produces findings, and each finding goes into a **lessons register** with an owner and a decision: a fleet change, a build book revision, a training point, or no action with the reason recorded. Chapter 8 showed that at a two-week cadence five cells are in the pipeline at any time, so a lesson from one installation can reach the cells already in assembly only as workshop rework, and the first cell built to it from the start is about five cells later. The register records which cell each lesson takes effect on, so that nobody assumes a fix is everywhere when it is only in the newest cells.

For cells already in service, the retrofit decision is a simple comparison: retrofit if the expected cost of leaving the cell as it is, the fault rate multiplied by the cost of each fault over the cell's remaining life, exceeds the cost of the retrofit. A fleet that is truly identical makes this decision once for every cell; a fleet of variants makes it several times, each with less evidence. [Learning from project risk](/reados/collections/project-planning-and-control/learning-from-project-risk/) explains why lessons that are filed rather than used change nothing, and how reviews and audits can make them change practice.

## Spares, documents and training

Commonality pays out mostly after the programme. With 94.0% of part lines common, the business keeps one spares list with a short site-specific appendix, holds critical spares at each site, and can move a spare gripper or a drive from one site to another overnight. One operator course and one maintenance course serve all three sites, and a technician from site A can support a cell at site C because the screens, programs and fault codes are the same.

```figure
type: checklist
title: Keeping the fleet the same after handover
caption: This is an illustration. Most of these items cost little; each protects a benefit that the programme paid for once.
- Load software only from the release repository | never from another cell's backup
- Compare checksums with the configuration record at each preventive maintenance visit |
- Lock recipe values within limits that site engineers can adjust |
- Keep one spares list, one operator course and one maintenance course for the fleet | with a short appendix for approved variants
- Route every change through a request, including at the integrator |
- x Local fixes to the controls by whoever is on shift | the fix may be right for one line and wrong for the next
- ? Who owns the baseline once the programme closes | a named role, not the departed project team
```

## Closing the programme: the benefit review

The programme was justified by its outcome, so it closes by measuring the outcome. This is an illustration. Twelve months after each cell started, the business compared its measured net benefit with the A$180,000 a year in the business case, which is three operator positions at A$80,000 less A$60,000 of running cost.

```figure
type: compare
title: Benefit review twelve months after each cell started
cols: Cells | Forecast per cell | Measured per cell | Measured total
caption: This is an illustration, in A$ excluding GST. The programme achieved A$2,124,000 a year against A$2,160,000 forecast, 98.3%. Site C's shortfall was a one-off; its running costs matched the forecast.
- Site A | 6 | A$180,000 | A$182,000 | A$1,092,000
- Site B | 4 | A$180,000 | A$178,000 | A$712,000
- * Site C | 2 | A$180,000 | A$160,000 | A$320,000
- Programme | 12 | A$2,160,000 in all | | A$2,124,000
```

Site A's running costs came in at A$58,000 a cell and site B's at A$62,000. Site C kept one of the three released positions on each line for the first three months while its operators were retrained, which cost A$20,000 a cell in the first year: A$240,000 − A$20,000 − A$60,000 = A$160,000. Because the cause was temporary, site C's second-year benefit should match the forecast, and the review sets a date to check that it does.

The costs were reviewed the same way. The programme closed at **A$8.70m** against its estimate of A$8,446,131, a cost ratio of **1.030**, A$253,869 over. Known items include the crew change on cell 7 (A$41,538) and the extra installation day at site B (A$8,000 of lost contribution). The last cell started earning in week 69 against a plan of week 68, a schedule ratio of **1.015**.

## Adding the results to the reference class

The programme's most durable output may be its records. Until now the business has borrowed an outside view from another firm's projects; from now on it has its own. For each cell, it records the estimate and outturn, the assembly hours, the installation days, the disruptive events and the benefit measured. [Deciding, tracking and calibrating the forecast](/reados/publications/reference-class-forecasting-by-the-numbers/tracking-and-calibrating/) describes how to keep such records so that they stay honest: original baselines kept, every project recorded whether it went well or badly.

```figure
type: stats
title: The programme's own numbers for the next one
caption: This is an illustration. Each replaces a borrowed or assumed value used in the planning: the cost ratio and schedule ratio replace the borrowed classes, the event rate replaces the assumed 0.08, and the hours replace the planning curve.
- * 1.030 | programme cost ratio | A$8.70m against A$8,446,131
- 1.015 | schedule ratio to the last cell | week 69 against week 68
- 98.3% | benefit achieved in year one | A$2,124,000 against A$2,160,000
- 0.081 | disruptive events per day on site | 3 events in 37 installation days
```

The event rate is a good example of a planning assumption tested. The plan assumed 0.08 disruptive events per working day on site. Twelve installations used 37 working days, eleven of three days and one of four, and suffered 3 disruptive events: 3 ÷ 37 = **0.081** a day. Three events is too few to prove the rate, but the record no longer contradicts it, and the next programme can start from evidence instead of an assumption.

## The error: a change copied from cell 5 into cell 9

This is an illustration. A few weeks after cell 5 started at site A, its palletiser in-feed began stopping on bunched cases. Site A's controls engineer, on a night shift, shortened the in-feed's case-gap timer in the cell controller from 1.5 seconds to 0.8 seconds. The stops ceased. The change was not recorded, because it was seen as a setting, not a change.

When the integrator prepared cell 9 for its factory test, its commissioning engineer took the controller program from a backup of cell 5, described in the integrator's files as "latest running version with site fixes", instead of from the release repository. Cell 9 passed its 12-hour factory test, because the workshop's temporary conveyor fed cases evenly, and it was installed at site B. Site B's in-feed conveyor runs faster than site A's, and with the shorter gap, two cases reached the robot's pick position together in week 63. The gripper faulted and the line lost about half a working day, **A$4,000** of contribution.

The fault investigation compared cell 9's controller program with the baseline and found a different checksum, then traced the difference to cell 5. The cost of the episode was the lost production, about 20 hours of investigation at A$160 (A$3,200), and an audit of all twelve cells' software against the baseline at about 3 hours a cell (A$5,760): **A$12,960** in all, excluding GST. The audit found no other differences.

The correction treated the change as a request after the event. The shorter gap had cured a site-side problem at site A, where the in-feed's own speed control let cases bunch, so the proper fix was on site A's in-feed, and both cells were returned to the baseline timer. The business adopted three rules: programs are loaded only from the release repository; checksums are compared with the configuration record at every preventive maintenance visit; and site engineers can adjust only recipe values within locked limits. Had the edited timer been part of a safety function, the same unrecorded copy would have put an unvalidated safety change into a second cell, which is why the controls now make that impossible without authorised access.

## Exercise: a faster palletiser

Site B's maintenance lead proposes removing a 4-second pause the robot makes after placing each layer of format A, which would cut the robot's time per layer from 52 seconds to 48. The line delivers 10 cases a minute in format A, 10 cases to a layer. The in-feed can hold about 50 cases while the palletiser is stopped. Should the change be made, and if so, as which kind of change? A fleet change would cost about A$3,840 for the software plus 4 hours at A$160 to load and test each of the twelve cells.

**Worked answer.** At 10 cases a minute, a layer arrives every 60 seconds, so in steady running the robot waits either way: 52 seconds or 48 seconds per layer both keep up, and **output does not change**. The difference appears only after a stop. With the pause, the robot can handle 10 cases in 52 seconds, about 11.54 cases a minute, 1.54 more than arrive; without it, 12.50 cases a minute, 2.50 more. Clearing a backlog of 50 cases takes 50 ÷ 1.54 ≈ **32.5 minutes** with the pause and 50 ÷ 2.50 = **20 minutes** without it. That matters only if backlogs cause further stops, which the request should show with data. If it does, the change belongs to every cell, as a fleet change at A$3,840 + 12 × 4 × A$160 = **A$11,520**, after checking why the pause exists, since it may let the layer settle for pallet stability. It should never become a site-B-only variant, which would cost more, about A$15,120, and split the fleet's software for a benefit every site would share.
