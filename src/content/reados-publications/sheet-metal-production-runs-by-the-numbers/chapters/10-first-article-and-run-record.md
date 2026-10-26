---
book: sheet-metal-production-runs-by-the-numbers
chapterSlug: first-article-and-run-record
order: 10
title: "First article, inspection and the run record"
description: "Prove the first tray against every requirement, check every twentieth tray, estimate how often a tray falls below 36 L, keep the run record, and catch a capacity test filled to the brim."
draft: false
---

A production run is only as good as its first part and the checks that follow it. The first article proves that the specification, the blank, the tooling and the routing together make a product that meets every requirement. The in-process checks prove that the hundredth and the five-hundredth trays are still the same product. And the run record keeps what was learned, so that the next run starts from facts rather than memory.

This chapter plans those checks for the running case's 500 trays. It sets out the first-article inspection requirement by requirement, the in-process checks and their intervals, uses the measured variation in depth to estimate how many trays might fall below the capacity requirement and how likely the distributor's sampling is to find one, describes the run record, and ends with a capacity test that filled the tray to the brim.

## The first article

The first article is the first tray made with production tooling, settings and operators, not a prototype made by hand. The shop makes three, so that one can be tested to destruction if necessary, one kept as a reference, and one sent to the coater for a trial coat while the run continues, as Chapter 6 planned.

Every requirement in the specification of Chapter 1 has a check on the first article, and every check has an acceptance value. This is an illustration, with the shop's tolerances.

```figure
type: compare
title: First-article inspection for the tote tray
rowhead: Requirement
cols: Check | Expected | Accept if
caption: This is an illustration. Each line traces to a specification item from Chapter 1; tolerances are the shop's illustrative values.
- Fits 600 × 400 shelving | Top inside, length and width | 600 × 400 mm | within ±1.5 mm
- Shape | Top and base diagonals | 721.1 and 607.8 mm | each pair within 2 mm
- Depth | Base to top of wall, four corners | 205 mm | within ±1 mm
- * 36 L to the fill line | Water to the etched line, weighed | 36.5 kg | at least 36.0 kg
- Carries 25 kg by hand | 25 kg inside, lifted by both slots for 1 minute | no permanent set | top diagonals change under 1 mm
- Nests 20 high in 700 mm | Drop test on the first articles | 25 mm pitch | 25 ± 2 mm, lifts out freely
- Mass | Finished tray on a scale | 5.59 kg | within ±2%
- Coating | Film thickness and adhesion | to the coater's specification | as the coating standard requires
```

The capacity check uses water because it is simple and exact. The tray is set level, filled to the etched fill line, and the water weighed: 36.5 kg of water is 36.5 litres at room temperature, close enough for this purpose.

The load test uses the real case: 25 kg of steel offcuts in the tray, lifted by both handle slots, held for a minute and set down. The top's diagonals are measured before and after; a change of less than 1 mm shows no permanent deformation. The coating's thickness and adhesion are checked by the coater against its own specification and the powder coating standard that applies, such as AS/NZS 4506 where it is called up, which the shop does not quote but asks the coater to confirm.

## In-process checks

The first article proves the setup; in-process checks catch drift during the run. Each check is chosen to catch a fault that could develop after the first article, at an interval that limits how many trays the fault could affect.

1. **Every twentieth tray** from the riveting bench: top and base diagonals, depth at the corners, and a drop test into the previous tray. At this interval, a fault in folding or lugs can affect at most twenty trays.
2. **Every fiftieth tray**: weighed, which catches a wrong sheet or a missing feature.
3. **First blank of every sheet batch** from the laser: one blank's key dimensions and the etched lines, which catches a program or material change.
4. **Each coated batch** on its return: a visual check and the coater's thickness record.

The checks are recorded on a sheet that travels with the run, with the tray number, the readings and the checker's initials. A reading near a limit is a signal to look at the process, not just to accept the tray.

```figure
type: checklist
title: In-process checks during the run
caption: This is an illustration. Each interval limits how many trays a fault can affect before it is found.
- Every 20th tray: diagonals, depth and drop test | folding and lugs
- Every 50th tray: weighed | wrong sheet or missing feature
- First blank of each laser session: dimensions and etch | program or material
- Each coated batch: appearance and film thickness record | coating
- Any reading near a limit: stop and look at the process | drift caught early
- x Visual "feature present" checks only | the inward lugs of Chapter 4
```

## How often might a tray fall short?

Chapter 2 gave the tray a capacity margin of 0.53 litres over the 36-litre requirement, and found that the capacity changes by about 0.232 litres for each millimetre of depth near the fill line. The in-process checks measure depth, so they show how much it varies.

This is an illustration. Suppose the depth measurements over the first hundred trays have a standard deviation of about **0.8 mm**. Then the capacity varies with a standard deviation of about 0.232 × 0.8 = **0.186 litres**, and the 0.53-litre margin is about **2.9** standard deviations. If the variation follows a normal distribution, about **0.2%** of trays would fall below 36 litres: about **one tray** in a run of 500.

```figure
type: compare
title: Capacity risk by the depth's variation
rowhead: Depth standard deviation
cols: Capacity standard deviation | Margin in standard deviations | Trays below 36 L in 500
caption: This is an illustration, assuming a normal distribution and the 0.53 L margin from Chapter 2. Halving the variation removes almost all the risk without changing the design.
- 1.0 mm | 0.232 L | 2.3 | about 6
- * 0.8 mm | 0.186 L | 2.9 | about 1
- 0.5 mm | 0.116 L | 4.6 | effectively none
```

The table makes the point that the variation matters as much as the margin. A process twice as variable as the shop's would put about six trays in five hundred below the requirement, and the distributor's sampling would have a much better chance of finding one. Measuring depth on every twentieth tray is how the shop knows which row of the table it is in, and the first hundred trays' readings are worth plotting as they come in, so that a drift towards the shallow side is seen before it reaches the limit.

The distributor checks one tray in fifty, ten trays from the run. The chance that one of its ten checks lands on a short tray is about 1 − (1 − 0.002)¹⁰ = **2%**. That is low, but not zero, and the shop's options are to accept it, to reduce the depth's variation by tightening the folding, or to increase the margin by making the trays a millimetre or two deeper on the next run. The calculation turns a vague worry into a choice with numbers attached.

## When a tray fails a check

A tray that fails an in-process check is set aside, tagged with what failed and the reading, and kept apart from good trays so that it cannot be packed by mistake. Then three questions are answered in order.

1. **What about the trays made since the last good check?** If tray 140 fails its diagonal check and tray 120 passed, trays 121 to 139 are checked too, because the fault could have started anywhere in between. That is why the interval matters: it sets how many trays must be rechecked.
2. **What caused it?** A drifting back-gauge, a worn punch, a different operator, a new sheet batch. The cause is fixed before more trays are made, and the fix is noted in the run record.
3. **What happens to the failed trays?** Rework, if the fault can be corrected without harming the tray, such as a corner that was not fully riveted; scrap, if not, such as a wall folded short; or, for a fault that does not affect the tray's use, a concession requested from the distributor, in writing, before the tray is shipped.

This is an illustration. The scrap and rework allowance of about 1% in Chapter 9's cost assumes that faults are caught within twenty trays. A process that ran for two hundred trays before a fault was found would use up that allowance and more in a single event.

## Agreeing acceptance with the customer

The distributor's acceptance check, one tray in fifty for capacity, is in the specification because the shop asked how the trays would be accepted, as Chapter 1 recommended. Agreeing it in advance avoids an argument at delivery: both sides know what will be measured, how, and what counts as a pass.

Where the customer's check and the shop's differ, the shop's should be at least as strict. The shop tests capacity on the first article and relies on depth checks during the run; the distributor will test capacity directly on ten trays. If the shop's depth checks are working, the distributor's capacity checks will pass, and the calculation above says how confident the shop can be. If the customer's acceptance criteria are unclear, the shop asks before the run starts, not when the first pallet is returned.

## Feeding the next run

The run record's last section is a short list of changes for next time, written while the run is fresh. This is an illustration of what the tote tray's first run produced:

- buy a hemming die before the second run, as Chapter 9's payback suggests;
- make a 1.0 mm prototype and load-test it, as Chapter 1's exercise proposed;
- negotiate a repeat-colour batch charge with the coater, the largest single setup cost;
- keep the press brake tooling for the tray together on one trolley, with its programs saved.

Each item has an owner and a date, and each is checked off or carried forward when the next order arrives, so that a good idea from one run is not forgotten by the time the next one is planned. A run record without that list is an archive; with it, it is the plan for making the next run cheaper and better.

## The run record

When the run is finished, the shop files a short run record with the job. This is an illustration of its contents:

- the specification and its revision, and any deviations agreed with the distributor;
- material: sheets used, supplier, heat numbers from the mill certificate;
- first-article results, with the three trays' readings and test results;
- in-process check sheets, with every reading;
- actual times for each operation from the machine logs and operators' records, against the routing's standards;
- rejects and rework: how many, why, and what was done;
- coating batches and the coater's records;
- dispatch: pallets, stacks and counts, and the freight booking.

The record serves three purposes. It is the evidence that the run met its specification, if the distributor ever asks. It is the source of the actual costs that Chapter 9 compares with the estimate. And it is the starting point for the next run: the settings, the times, the learning curve and the problems are all there, so that the second run starts where the first finished.

## The error: capacity tested to the brim

This is an illustration. The first article's capacity was tested by an inspector who filled the tray to the brim, weighed 41.1 kg of water, and recorded a pass against the "36 L" on the check sheet. The test showed that the tray held more than 36 litres. It did not show that it held 36 litres to the fill line, which is what the specification required.

The production engineer, reviewing the first-article report, noticed the measured figure was close to the brim-full calculation of 41.25 litres and asked for the test to be repeated to the etched line. The repeat measured **36.4 litres**, a pass, but 0.13 litres less than the calculated 36.53, which pointed to a tray about 0.56 mm shallower than drawn, within its tolerance. Had the folding been a few millimetres short, the brim-full test would have passed it and the distributor's test would have failed it.

The shop's first-article sheet now states every test exactly as the specification states the requirement: "fill to etched line, weigh, accept if at least 36.0 kg". A test that measures something near the requirement is not a test of the requirement. The same rule applies to the load test, which lifts the tray by its slots as the specification says rather than resting the load on a bench, and to the nesting test, which drops one tray into another rather than checking that the lugs are present.

## Bringing the run together

The tote trays went from a short conversation to 500 coated, nested, palletised products by way of a handful of numbers. The specification traced every dimension to a requirement. The prismoidal formula set the depth with a margin. True lengths and bend allowances made the blank. The corner angle, the hem and the denesting lugs made it a tray that holds together and comes apart from the stack. Nesting set the steel; both faces set the coating; the routing found the bottleneck; setups, batch size and learning shaped the cost; and the first article and in-process checks made sure the five hundredth tray was the same as the first. Each step's mistake in this book was found by a check that used a different route to the same number, which is the most useful habit a production run can have.

## Exercise: a tighter process

After the first run, the shop improves its folding so that the depth's standard deviation falls from 0.8 mm to 0.5 mm. With the same 0.53-litre margin, what share of trays would fall below 36 litres, and what is the chance that the distributor's ten checks find one?

**Worked answer.**

- Capacity standard deviation: 0.232 × 0.5 = **0.116 litres**.
- Margin in standard deviations: 0.53 ÷ 0.116 = about **4.6**.
- Share below 36 litres: about **0.0002%** for a normal distribution, effectively none in a run of 500.
- Chance that ten checks find a short tray: also effectively **zero**.

Reducing the variation by three eighths has made the margin, unchanged in litres, about one and a half times as large in standard deviations, and the risk of a short tray has almost vanished. Tightening the process is often a cheaper way to meet a requirement than enlarging the margin, which would cost steel and capacity in every tray.
