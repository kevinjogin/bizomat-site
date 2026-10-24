---
book: electroplating-by-the-numbers
chapterSlug: cost-inspection-and-the-plating-record
order: 10
title: "Cost, inspection and the plating record"
description: "Build the cost of plating a part from line time, labour, metal and energy, inspect thickness and adhesion by agreed methods, and keep a plating record that settles disputes."
draft: false
---

The previous chapters each added a number to the bracket order: an area, a current, a time, an efficiency, a thickness map, a hydrogen risk, a life estimate, a rinse ratio. This chapter turns them into the two things a purchaser finally needs: a cost that can be understood and challenged, and evidence that the coating delivered is the coating specified.

The 1917 treatise was clear about where plating money goes. The most costly part of the trade, it said, was the mechanical work of grinding and polishing, and the most important items of expense were labour and materials, with labour used mostly in preparing and finishing surfaces and in hanging work in the tanks, removing it and rinsing it. The plating barrel had been developed because stringing small parts on wires one at a time made the labour prohibitive. A century later, the proportions are much the same.

## Building the cost of a bracket

The cost of plating a part has a few main elements: the labour of racking and unracking, the line time each rack occupies, the metal deposited, the electrical energy, and the chemicals, passivate, rinsing and waste treatment. This is an illustration, with prices in Australian dollars excluding GST.

- **Racking.** Hanging and removing 40 brackets takes about 6 minutes at A$90 an hour, A$9.00 per rack or about **A$0.225** per bracket.
- **Line time.** The plater prices its zinc line at A$150 an hour, covering operators, equipment, overheads and the share of the line's fixed costs. Each load of three racks occupies the line for its 35.1 minutes of plating plus about 20 minutes of cleaning, pickling, rinsing and passivating, about 55.1 minutes in all. That is about A$45.9 per rack, or **A$1.148** per bracket.
- **Zinc.** Each bracket carries about 2.285 g of zinc. At A$6.00 per kilogram of anode zinc, that is about **A$0.014**.
- **Energy.** Each rack uses about 0.421 kWh at the rectifier. At A$0.30 per kWh, that is about **A$0.003** per bracket.
- **Chemicals, passivate and waste.** An allowance of **A$0.05** per bracket.

The total is about **A$1.44 per bracket**, or about A$5,760 for the 4,000. With GST at 10%, the invoice would show about A$1.58 per bracket; a GST-registered business normally claims the GST as a credit, which is why costs are compared excluding it, under the ATO's rules for the business concerned.

```figure
type: bars
title: Cost of plating one bracket, original design
unit: A$
max: 1.25
caption: This is an illustration, excluding GST. Line time and racking make up about 95% of the cost; the zinc and the electricity together are about 1%.
- *Line time | 1.148
- Racking | 0.225
- Chemicals, passivate and waste | 0.05
- Zinc | 0.014
- Energy | 0.003
```

The pattern is the treatise's pattern. Time and labour are almost everything; the metal and the electricity that the process is built around are almost nothing. A purchaser who negotiates over the price of zinc is negotiating over about one per cent of the cost.

## What changes the cost

Because line time dominates, anything that changes plating time changes the cost almost proportionally. The main levers are the ones earlier chapters identified.

- **Thickness.** Doubling the average thickness to protect a recess, as the original plan did, nearly doubled the plating time.
- **Geometry.** The redesigned channel in Chapter 5 brought the plating time from 35.1 to 25.1 minutes and the cycle from about 55.1 to 45.1 minutes.
- **Efficiency.** A bath running at 69% instead of 80% needs about 16% more time for the same coating, as Chapter 3 showed.
- **Rack density.** More parts per rack, if the thickness distribution allows, spreads line time and racking over more parts.
- **Rework.** Every stripped and replated rack costs its full line time again, plus stripping.

```figure
type: compare
title: Original and redesigned bracket, cost per part
cols: Original channel | Revised channel
caption: This is an illustration, excluding GST. The same 8 µm minimum; the saving comes almost entirely from line time.
- Average thickness | 16.0 µm | 11.43 µm
- Cycle per load | 55.1 min | 45.1 min
- Line time per bracket | A$1.148 | A$0.939
- Zinc per bracket | A$0.014 | A$0.010
- *Total per bracket | A$1.44 | A$1.23
- Order of 4,000 | A$5,760 | about A$4,904
```

The revised channel saves about A$0.21 per bracket, about **A$856** over the order, without any change to the plating line, the price of zinc or the plater's margin. That saving was available only because the thickness map in Chapter 5 showed where the time was going.

## Barrel parts and baked parts

The clips show how the cost structure changes for small parts. This is an illustration. If the plater runs three barrels of 100 clips through each one-hour cycle at the same line rate of A$150 an hour, line time comes to about 150 ÷ 300 = **A$0.50** per clip, far less per part than a bracket because there is no racking and many more parts share each hour. Baking adds its own cost: if an oven load of 200 clips is charged at about A$40 for the oven time and handling, that is about A$0.20 per clip. With an allowance of a few cents for zinc, chemicals and waste, the clip costs roughly A$0.73 to plate and bake. The bake is more than a quarter of the cost, and it is also the step that prevents the failure in Chapter 7, which is why it should never be the first thing cut to meet a price.

## Comparing quotes

Plating quotes are easy to compare badly. One plater quotes per part, another per kilogram, another per rack or barrel load with a minimum lot charge. Some include inspection and certificates; others charge for them. Baking, masking, special packaging, sorting of mixed parts and freight may each be included, extra or forgotten. And a low quote may assume a thinner coating, a different passivate or a barrel route for parts that should be racked.

The way through is to send every plater the same complete specification and drawing, the quantity and delivery pattern, and a request to quote the same scope: coating, minimum thickness on marked surfaces, passivate, embrittlement relief, inspection, records and packaging. The cost model above then gives a check on each quote's plausibility. A quote far below the line time the part must occupy is either using a different process or not including something, and the question is which.

## Inspecting the coating

Inspection has to answer the questions the specification asks. For the bracket, those are thickness, adhesion, appearance and passivate; for the clips, the evidence of embrittlement relief as well.

**Thickness.** Several methods are standardised. Magnetic gauges, covered by ISO 2178, measure non-magnetic coatings such as zinc on steel quickly and without damage, and are the usual shop instrument. X-ray spectrometric instruments, covered by ISO 3497, measure small areas and multilayer coatings without contact. The coulometric method, ISO 2177, dissolves the coating anodically from a small spot and calculates thickness from the charge, using Faraday's law in reverse, and is destructive locally. A polished cross-section measured under a microscope is the reference when access is poor or results disagree. Each method has conditions for accurate use, such as minimum flat area, distance from edges, surface roughness and calibration on a similar base metal, which must be read from the standard.

**Locations and sampling.** Chapter 5 showed that thickness without location means little. The plan names the locations, including the thinnest significant surface or an agreed reference point with a known relationship to it, and the sampling: how many parts from each batch or rack, and what happens if one fails.

**Adhesion, appearance and passivate.** Adhesion is checked by an agreed method on first articles and at intervals, as Chapter 6 described. Appearance and passivate colour are compared with agreed limit samples. For susceptible parts, the plater supplies the oven record and any embrittlement test results, as Chapter 7 described.

## A failure: two gauges, two answers

This is an illustration. Partway through the order, the workshop's incoming inspection began rejecting brackets for thin zinc on the outer faces. Its magnetic gauge read 14 to 15 µm against the agreed reference requirement of at least 17 µm. The plater's records, from its own X-ray instrument, showed 17 to 19 µm on the same batches.

Both instruments had been checked against calibration standards, so the difference had to come from how they were being used. A joint check found two causes. The workshop's gauge had been zeroed on a smooth calibration plate, not on an uncoated bracket, and the bracket's slightly textured, formed steel read differently. And some readings had been taken within a few millimetres of an edge, where the probe's field is affected by the edge itself. A polished cross-section through a bracket from a disputed batch, measured under a microscope, showed 17.5 µm at the reference point, agreeing with the plater.

The resolution was a written measurement procedure agreed by both businesses: the method and instrument, zeroing on an uncoated sample of the same steel and form, a minimum distance from edges, the number of readings at each location and how they are averaged, and a cross-section as the referee method in any dispute. Rejections stopped, and the next disagreement, months later, was settled in an afternoon by following the procedure.

The rejected brackets cost both businesses money: inspection time, held stock, a delayed assembly run and the cost of the cross-sections. None of it was caused by the coating. A measurement procedure agreed before the first delivery would have cost an hour of each party's time.

## The plating record

Every chapter of this book has added an entry to one record: the evidence that a batch of plated parts meets its specification and was made by a controlled process. A plating record need not be elaborate, but it should travel with the job.

```figure
type: checklist
title: Plating record for one batch of brackets
caption: This is an illustration. With these entries, any later question about the batch can be answered from evidence rather than memory.
- x Specification | drawing revision, coating standard and edition, significant surfaces
- x Parts received | quantity, condition, water-break check
- x Plating | rack area, current, ampere-hours, time, bath temperature
- x Bath | latest analysis and panel efficiency
- x Thickness | method, locations, readings, reference relationship
- x Adhesion and appearance | method and result; passivate colour
- x Embrittlement relief | not required for mild steel brackets; stated
- *x Release | who inspected, who released, date
```

The record earns its keep when something goes wrong. The thin coating in Chapter 2, the drifting efficiency in Chapter 3, the blisters in Chapter 6 and the gauge dispute above were each resolved quickly because the relevant numbers had been written down. Where they had not been, as with the two-word note in Chapter 1 and the unbaked clips in Chapter 7, the failure was found only in service.

## Using the record to improve

A record kept over many batches also shows where a process can be tightened or relaxed. This is an illustration. After the redesign, recess readings on the brackets averaged about 9.5 µm with a standard deviation of about 0.5 µm against the 8 µm minimum. The margin between the average and the minimum, divided by three standard deviations, is (9.5 − 8) ÷ (3 × 0.5) = 1.0. By the usual reading of that capability index, the process is only just capable of keeping every recess above the minimum, so there is no case for shortening the plating time; if anything, the spread should be reduced first, for example by tighter control of rack position and current. Had the readings averaged 9.5 µm with a standard deviation of 0.2 µm, the index would be 2.5, and a modest reduction in charge could be trialled, with the record watched closely.

The same data show trends long before they become failures: ampere-hours per rack creeping up, panel efficiency drifting down, adhesion results changing with a new batch of parts. The 1917 treatise relied on the plater's experience to sense such things. A modern record makes them visible to everyone with an interest in the result.

## Bringing the numbers together

The chain from specification to cost runs through every chapter. The specification fixes the coating, the minimum thickness and the surfaces that matter. Faraday's law converts that thickness into charge, the current efficiency corrects it, and the current density window and the part's geometry set how long the charge takes to deliver to the thinnest surface. Preparation decides whether the coating sticks, and the part's hardness decides whether hydrogen must be baked out. The environment decides how long the coating lasts, the bath and rinses decide whether the process stays in control and within its environmental and safety obligations, and line time decides most of the cost. Each link has a number, each number can be measured, and each failure in this book happened at a link where nobody was looking.

## Exercise: the cost of a thicker coating

Chapter 8 considered a 25 µm minimum on the revised bracket for a longer life in a C3 location. With the recess at 70% of the average, the average must be about 35.7 µm, which takes about 78.4 minutes at 2.0 A/dm² and 80% efficiency. Using the same prices and assumptions as above, estimate the cost per bracket and for the order.

The cycle becomes about 78.4 + 20 = 98.4 minutes per load, so line time is about 150 × 98.4 ÷ 60 ÷ 3 ÷ 40 ≈ **A$2.05** per bracket. Zinc rises to about 2.0 × 35.7 × 0.0714 ≈ 5.1 g, about A$0.031, and energy to about A$0.007. With racking at A$0.225 and chemicals at A$0.05, the total is about **A$2.36 per bracket**, or about A$9,450 for the order, against about A$4,904 for the 8 µm revised bracket. Line time is still almost the whole cost. The comparison with hot-dip galvanising or another system should be made on this basis, including the life each achieves in the actual environment. A useful way to present it to the customer is cost per year of protection: on the conservative C3 rate, the 8 µm bracket buys about 3.8 years and the 25 µm bracket about 11.9 years, so the thicker coating costs less per year of life despite costing more per part.
