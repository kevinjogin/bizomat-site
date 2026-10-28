---
book: modular-projects-by-the-numbers
chapterSlug: rollout-rhythm
order: 8
title: "Rollout rhythm: cadence, line of balance and batch size"
description: "A cell every two weeks from a ten-week pipeline: five cells in progress, A$38,077 for each week the rollout slips, and why ordering all 11 cells early risked A$165,000 a change."
draft: false
---

Once the pilot has proved the design, the question becomes how fast, and in what batches, to roll out the other eleven cells. Too slow, and benefit is lost at A$3,461.54 for every cell-week of waiting. Too fast, and money and hardware are committed before the design has finished teaching its lessons, the integrator's crew is pushed beyond its learning, and sites are asked to receive cells faster than they can prepare for them. The rollout's rhythm is a decision with numbers on both sides.

This chapter sets out the running case's rollout schedule and the reasons for its order, draws it as a line of balance, and uses that picture to count the cells in progress at any time. It then treats the batch-size question, how many cells to commit before the evidence is in, and the cash the rollout needs. The error case is a proposal to order the hardware for all eleven rollout cells before the pilot had passed acceptance.

## The rollout schedule

This is an illustration. The pilot, cell 1, starts earning in **week 35**, after the build and acceptance tests of Chapters 3 and 4. Cells 2, 3 and 4 follow at three-week intervals, in weeks **46, 49 and 52**. From cell 5 the cadence tightens to one cell every two weeks, from **week 54** to **week 68**. Each cell's benefit, A$180,000 a year, excluding GST, starts in the week it is installed.

Each rollout cell passes through the same steps. It is **released** ten weeks before its benefit starts: the hardware is called off from the supplier and the build slot is booked. Its machines arrive in the integrator's workshop four weeks later, assembly takes about four weeks, the factory acceptance test runs in the following week, and the cell ships and is installed over the installation weekend described in Chapter 7.

The order of sites is deliberate. Site A, the largest, takes the pilot and the next five cells, so that the installation crew stays on one site while it learns, and site A's engineers see six installations before any other site sees one. Site B follows with four cells, and site C with its two at the end, which gave its in-feed fix from Chapter 2 time to be built as planned site works.

The case format sets a second constraint. Nine lines pack format A and three pack format B, the 24-pack case of 5 cases a layer, which the standard cell handles with a change-part kit. The three format-B lines are one at each site, so the format-B cells are cell 4 at site A, cell 8 at site B and cell 12 at site C. Cell 4, the first, falls in the three-week part of the cadence, so the first fitting of the kit, which added 180 hours to its timesheet, did not squeeze the cells either side of it. Spreading the other two through the rollout means each site learns the format-B kit on its own line, with the lessons of the earlier one already in the build book.

```figure
type: compare
title: The modular rollout by cell
cols: Site | Case format | Released for build | Benefit starts
caption: This is an illustration. Each rollout cell is released ten weeks before its benefit starts. The pilot was built and proved before week 35, as Chapters 3 and 4 describe. The three format-B cells, one at each site, are spread through the rollout.
- Cell 1, pilot | A | A | before week 35 | week 35
- Cell 2 | A | A | week 36 | week 46
- Cell 3 | A | A | week 39 | week 49
- * Cell 4 | A | B, first | week 42 | week 52
- Cell 5 | A | A | week 44 | week 54
- Cell 6 | A | A | week 46 | week 56
- Cell 7 | B | A | week 48 | week 58
- Cell 8 | B | B | week 50 | week 60
- Cell 9 | B | A | week 52 | week 62
- Cell 10 | B | A | week 54 | week 64
- Cell 11 | C | A | week 56 | week 66
- Cell 12 | C | B | week 58 | week 68
```

The three-week interval for cells 2 to 4 is also deliberate. The first rollout cells are still teaching: each installation and each factory test produces lessons that should reach the next build, and the integrator's crew is on the steep part of its learning curve, where Chapter 5 showed the hours falling fastest. A slightly slower start gives each lesson time to land. Once the design and the crew have settled, the cadence tightens to two weeks, which is about as fast as the case's single installation crew and the sites' preparation can sustain.

## Drawing the rollout as a line of balance

A **line of balance** plots the cumulative count of units that have passed each stage of a repeated process against time. Each stage becomes a line; the horizontal gap between two lines is the time a unit spends between those stages, and the vertical gap is the number of units between them at any moment. If the lines run parallel, the process is balanced: every stage works at the same rate.

```figure
type: line
title: Line of balance for the eleven rollout cells
x: Week
y: Cumulative rollout cells
legend: Released for build | In benefit
ymin: 0
ymax: 12
caption: This is an illustration. The horizontal gap between the lines is the ten-week pipeline; the vertical gap is the number of cells released but not yet earning, five from week 48 to week 58.
- 36 | 1 | 0
- 40 | 2 | 0
- 44 | 4 | 0
- 46 | 5 | 1
- 48 | 6 | 1
- 50 | 7 | 2
- 52 | 8 | 3
- 54 | 9 | 4
- 56 | 10 | 5
- 58 | 11 | 6
- 60 | 11 | 7
- 62 | 11 | 8
- 64 | 11 | 9
- 66 | 11 | 10
- 68 | 11 | 11
```

The vertical gap has a simple rule behind it. **Little's law** says that the average number of items in a process equals the rate at which they flow through it multiplied by the time each spends in it. At one cell every two weeks, 0.5 cells a week, and ten weeks from release to benefit, the pipeline holds 0.5 × 10 = **5 cells**, which is exactly what the chart shows from week 48 to week 58. During the three-week cadence, the pipeline held fewer, about 10 ÷ 3 ≈ 3.3 cells on average.

That number is the rollout's real batch size. Whenever a lesson arrives, from a factory test or an installation, five cells are already released and partly committed. Suppose the installation of cell 5 in week 54 shows that a bracket should change. Cells 6 to 10 are in the pipeline at that moment: cells 6 and 7 are being assembled or tested and would need rework in the workshop, while cells 8, 9 and 10 are waiting for their machines, and the change can still be made to their parts at little cost. Only cell 11, released in week 56, is built to the new design from the start.

Two ways to make the batch smaller follow directly from Little's law: a slower cadence, which costs benefit, or a shorter pipeline, which is usually cheaper. Shortening the time from release to benefit, for example by holding common parts in stock or by having the supplier hold machines ready to ship, reduces the number of cells exposed to any late lesson without slowing the rollout. [How finely to break down the work](/reados/collections/project-estimates-schedules-and-costs/sizing-work-packages-to-find-problems-in-time/) makes the same point about plans in general: the size of the pieces sets how late a problem can surface and how much work it touches.

## The sites have a rhythm too

The workshop is not the only process that must keep pace. Each site runs its own preparation for each cell: the survey ten weeks before, site works finished and proved four weeks before, and isolation and permits settled in the final week, as Chapter 7 sets out. That is a second line of balance, running about ten weeks ahead of the installations. At a two-week cadence, site A's engineers are preparing the next cell's site works while installing the last one, and site B must start its first survey in about week 48, while site A is still receiving cells.

A rollout that runs faster than the sites can prepare does not install faster; it delivers cells that wait on the dock for site works, and the pipeline grows without any gain in benefit. In the case, the two-week cadence was checked with each site's engineering lead before it was adopted, and the installation crew's calendar was drawn alongside it, because one crew installing a cell every two weeks across three sites is close to its limit. The slowest of the three rhythms, workshop, sites or installation crew, sets the pace of the whole rollout.

## What a week of the rollout is worth

Every rollout cell earns A$180,000 ÷ 52 = **A$3,461.54** a week once installed. If the whole rollout, cells 2 to 12, slipped by one week, the business would lose 11 × A$3,461.54 = **A$38,077**. That figure is the yardstick for any proposal that trades speed against something else. [What is a day worth?](/reados/collections/valuing-time-delay-and-uncertainty/what-is-a-day-of-delay-worth/) explains how to build such a figure from lost contribution and ongoing costs, and why only the days that move the finish carry the full value.

```figure
type: stats
title: The rollout's numbers for trading time against risk
caption: This is an illustration, in A$ excluding GST. The weekly figure for the whole rollout is the comparison point for every batch decision in this chapter.
- A$3,461.54 | benefit per cell per week | A$180,000 ÷ 52
- * A$38,077 | one week's slip of cells 2 to 12 | 11 × A$3,461.54
- 5 cells | in the pipeline at a two-week cadence | 0.5 a week × 10 weeks
- A$15,000 | to rework one built cell for a design change | the case's workshop fix cost
```

The same figure shows what waiting buys. Rework of one built cell for a design change costs up to A$15,000 in the case. A change that has to be made to all eleven rollout cells after they are built therefore costs up to 11 × A$15,000 = **A$165,000**, which equals 165,000 ÷ 38,077 ≈ **4.3 weeks** of the whole rollout's benefit. Waiting for evidence before committing the fleet is worth about four weeks of delay for every fleet-wide change the waiting can be expected to catch. Ten weeks of waiting to catch one minor change would be poor value; one week of waiting to catch a likely change to the robot's gripper would be good value.

## Cash for the rollout

Repetition also sets the rhythm of spending. This is an illustration, with each cell's cost counted in the week its benefit starts and the design-once cost of A$520,000 counted at the start. On that basis, the programme has spent **A$3,276,720** by week 52 and earned **A$90,000**; by week 68 it has spent its full **A$8,446,131** and earned **A$505,385**. From week 54 to week 68, it spends one cell's cost, about A$646,000 on average, every two weeks, about **A$323,000 a week**.

```figure
type: compare
title: Cumulative cost and benefit of the modular programme
cols: Cells earning | Cumulative cost | Cumulative benefit
caption: This is an illustration, in A$ excluding GST, with each cell's cost counted when its benefit starts. Real progress payments come earlier, so the true cash curve sits a few weeks to the left of this one.
- Week 35 | 1 | A$1,240,600 | A$0
- Week 52 | 4 | A$3,276,720 | A$90,000
- * Week 68 | 12 | A$8,446,131 | A$505,385
- Week 104 | 12 | A$8,446,131 | A$2,000,769
```

The low point of the cash position comes at week 68, at A$8,446,131 − A$505,385 = **A$7,940,746** spent and not yet recovered. From then on, twelve cells earn A$41,538 a week together, and the cumulative benefit passes the programme's cost in about **week 260**, five years from the start, without discounting. The bespoke programme, with its higher cost and the same benefit rate once complete, passes its A$10.32m in about week 306. Real payments are earlier than this sketch: deposits are paid at release, progress payments during assembly and the balance after the site acceptance test. The business should ask the integrator for its payment schedule and draw this table again with real dates before committing.

## The error: ordering all eleven before the pilot proved itself

This is an illustration. While the pilot was still being built, the business's purchasing manager proposed ordering the hardware for all eleven rollout cells at once and having the integrator assemble ahead as the machines arrived, so that finished cells would be waiting when the pilot passed. Two reasons were given: the supplier offered its best price for a single order of twelve, and having the hardware on hand would remove the four-week wait for machines, bringing every rollout cell forward by about four weeks. That would be worth 11 × 4 × A$3,461.54 = **A$152,308** of earlier benefit.

The proposal reached the programme's gate review, where the engineer set it beside the cost of being wrong. Chapter 3's pilot went on to find nine issues. If only one of them had needed a change to hardware already built or delivered for every rollout cell, the rework would have cost up to 11 × A$15,000 = **A$165,000**, more than the whole benefit claimed for ordering early. If several had, the cost would have multiplied. The order would also have committed 11 × A$470,000 = **A$5,170,000** of hardware before the pilot had shown the design could meet the rate.

```figure
type: decision
title: How many rollout cells to commit before the pilot passes
question: What is committed if the pilot reveals a change to the hardware?
caption: This is an illustration, in A$ excluding GST. The weekly value of the rollout, A$38,077, sets the price of waiting; the A$15,000 rework per built cell sets the price of committing early.
- Order and build all eleven | up to A$165,000 per fleet-wide change | gains about A$152,308 of earlier benefit; A$5.17m committed early
- * Price agreement for twelve, released cell by cell | up to A$45,000 per change for the first tranche of three | keeps the price; gives up some speed
- Wait for the pilot and order one at a time at full price | almost no rework exposure | slowest; loses the volume price
```

The correction kept what was good in the proposal and removed the risk. The business negotiated a **price agreement** for twelve cells' hardware, with the price held for the full quantity, and released cells in the rhythm shown above: cells 2 to 4 as a first tranche after the pilot had passed its site acceptance test, and later cells one at a time ten weeks before their benefit starts. The exposure to a change found on the pilot fell to the first tranche, at most 3 × A$15,000 = **A$45,000**, about 1.2 weeks of the rollout's benefit. The price was kept; the four-week head start was given up in exchange for not betting A$5.17m on an unproved design. The broader lesson is that a volume discount is a reason to agree a price, not a reason to take delivery.

## Exercise: a second assembly crew

The integrator offers to add a second assembly crew so that cells 5 to 12 can be delivered every week from week 54, instead of every two weeks, with the last cell earning from week 61 instead of week 68. There is no extra fee beyond the assembly hours. The first crew would build cells 5, 7, 9 and 11 as its units 5 to 8; the second crew, new to the cell, would build cells 6, 8, 10 and 12 starting from the unit-2 position on the planning curve, as Chapter 6 assumes for a new crew with a good build book. Assembly costs A$120 an hour. Is the offer worth taking?

**Worked answer.** The faster cadence moves cells 5 to 12 earlier by 0, 1, 2, 3, 4, 5, 6 and 7 weeks, 28 cell-weeks in all, worth 28 × A$3,461.54 = **A$96,923**. On the planning curve (1,600 hours, 85%), one crew building units 5 to 12 needs about **7,838 hours**. With two crews, the first builds units 5 to 8, 4,144.7 hours, and the second builds units 2 to 5, 4,849.7 hours, a total of about **8,994 hours**. The extra 1,156 hours cost 1,156 × A$120 = **A$138,719**, so the offer loses about **A$41,796**. Splitting the work halves each crew's experience and restarts one of them high on the curve. The offer would pay only if the second crew were already experienced with this cell, or if the faster rollout brought some other benefit, such as an earlier end to manual handling, that the business valued above the difference.
