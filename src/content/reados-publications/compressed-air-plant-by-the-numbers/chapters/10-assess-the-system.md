---
book: compressed-air-plant-by-the-numbers
chapterSlug: assess-the-system
order: 10
title: "Assess the system, then choose equipment"
description: "Measure CA-1's specific power and demand, rank the savings found in earlier chapters, see why demand comes before supply, and meet the safety duties of a compressor room."
draft: false
---

Each chapter of this book found something in CA-1's compressor room worth changing: a compressor compared on the wrong basis, a hot room, recoverable heat with nowhere to go, a stuck drain, a whole-plant desiccant dryer, an inflated set point, leaks, an open blowpipe, a receiver valved out and a branch too small. An assessment brings these together, measures the system as it actually runs, ranks the opportunities, and decides the order in which to act.

This chapter assembles CA-1's assessment. It shows how to measure what the compressor delivers and uses, ranks the savings, explains why reducing demand must come before choosing new compressors, and sets out the safety duties that apply to a compressor room. It closes with the expensive result of doing those things in the wrong order.

## Measure the system as it runs

An assessment starts with measurement over a representative period, at least one full production week and preferably several:

```figure
type: steps
title: Measuring CA-1 before deciding anything
caption: This is an illustration of a basic assessment. Larger systems justify permanent flow, power and pressure metering.
- Log compressor power | with a clamp-on power meter or the package's own meter, for a full week
- Log loaded and unloaded time | from the controller, to estimate free air delivered by the load-time method
- * Calculate average specific power | energy used divided by free air delivered
- Log pressure at the compressor, after treatment and at the far end of the main | to find the system's pressure losses
- Measure leakage with the plant idle | by load time or by pressure decay in the receiver and main
- Walk the plant during production | listing every continuous use, open blow-off, drain and regulator
```

This is an illustration. CA-1's week of logging found an average input of about 31.8 kW while the compressor was loaded 70 per cent of its running time. By the load-time method it delivered about 0.7 × 6.0 = 4.2 m³/min on average, giving an average specific power of about **7.57 kW per m³/min**, against 6.83 at full load. The difference is the cost of part-load running on load and unload control, as Chapter 8 calculated. Leakage, measured over a weekend with the plant idle, was about 1.05 m³/min, a quarter of the average demand.

## The opportunities

```figure
type: bars
title: CA-1's assessment, estimated savings a year
unit: A$
max: 12000
caption: This is an illustration from Chapters 4 to 9, excluding GST. Each is estimated against today's system; applied together and in sequence, they interact, as the text explains.
- Heat recovery to boiler make-up, gas displaced | 10463
- * Repair two thirds of the leaks | 7949
- Regulate the open blowpipe to 300 kPa gauge | 6144
- Lower the set point 100 kPa, compression | 3670
- Variable speed compressor, at today's demand | 3563
- One timer drain replaced by a zero-loss drain | 2100
- Lower the set point 100 kPa, effect on leaks | 1401
- Replace the loaded filter element | 1284
```

The total of the bars is about A$36,600 a year, about three quarters of CA-1's A$47,700 electricity bill if the heat recovery is counted alongside it. The measures interact, and the real total is smaller: repairing leaks reduces what lowering the pressure can save on leaks, every demand-side saving shrinks the heat available for recovery, and the value of variable speed control depends on how much demand is left.

## Why demand comes before supply

The most important interaction is between demand and the compressor. Repairing leaks and regulating the open blowpipe together remove about 0.70 m³/min of leakage and about 0.54 m³/min of average blow-off use, taking the plant's average demand from 4.2 to about **2.96 m³/min**: from 70 to about 49 per cent of CA-1's capacity.

That is good news for the electricity bill, which falls from about A$47,700 to about A$38,100 a year on the existing load and unload control. It also changes the compressor's operating point. At 49 per cent load, CA-1's average specific power rises to about 8.59 kW per m³/min, because it now spends half its time unloaded. A variable speed compressor, which looked worth only about A$3,600 a year at today's demand, would now save about A$7,050 a year against the improved system. And the compressor's cycling, as Chapter 8 showed, is now near its worst, at almost exactly half load.

Every saving on the demand side also reduces the heat available for recovery, and lowers the dryer's load, the drains' load and the receiver's cycling. Measures on the supply side should therefore be chosen for the demand that will remain after the demand-side work, not the demand that exists today.

```figure
type: compare
title: CA-1 before and after the demand-side measures
rowhead: Measure
cols: Today | After leaks and blowpipe
caption: This is an illustration on load and unload control with 25 per cent unloaded power, 6,000 hours and A$0.25 per kWh, excluding GST.
- Average demand | 4.2 m³/min | about 2.96 m³/min
- Average load | 70 per cent | about 49 per cent
- Average power | about 31.8 kW | about 25.4 kW
- Average specific power | about 7.57 kW per m³/min | about 8.59 kW per m³/min
- * Annual electricity | about A$47,700 | about A$38,100
- Saving from variable speed control | about A$3,600 a year | about A$7,050 a year
```

## A failure case: the new compressor came first

This is an illustration. A neighbouring site with a system much like CA-1's decided to replace its ageing compressor. It sized the new machine from its current peak demand, about 6 m³/min, and bought a 45 kW variable speed compressor with a comfortable margin. Six months later, a leak programme and a review of blow-offs reduced its average demand by about a third.

The new compressor now spent much of its time at or near its minimum speed, where its specific power was worst, and below its minimum flow it ran on load and unload control anyway, cycling between minimum speed and off. A smaller variable speed machine, or the old fixed-speed compressor kept as a base-load machine with a small variable speed trim compressor, would have matched the reduced demand better.

The error was in sizing supply before fixing demand. The correction, for the next purchase, was a written order of work: measure, reduce demand, lower pressure, re-measure, and only then specify compressors, sized for the measured demand profile with allowance for known growth.

## Several compressors and growth

Many plants grow from one compressor to two or three, often by adding whatever was available when demand rose. The assessment is the moment to look at the whole supply side together. A common efficient arrangement runs one or more fixed-speed compressors fully loaded for the base demand, where their specific power is best, and one variable speed compressor to follow the swings, all under a sequencer holding one narrow pressure band. A standby compressor, sized to carry the plant if the largest machine fails, protects production without running.

Growth should be planned from measured demand, not nameplates. If the measured peak after the demand-side work leaves comfortable headroom, a new line may not need a new compressor at all, only a check of the main and its branch, as Chapter 9 showed. If it does need one, the new machine can be chosen to fill the gap in the existing fleet's efficient range, rather than duplicating what is already there.

## What the assessment does not cover

An assessment of this kind is a screening, built on a week or two of logging and on the calculations in this book. It does not replace the compressor maker's performance data, a formal measurement to ISO 1217, a structural or pressure equipment inspection, or a detailed design of a heat recovery scheme or a new main. Its value is in showing where the money is, in what order to act, and which questions need specialist answers. On CA-1's site, it turned a vague sense that "air is expensive" into a ranked list of measures, most of them cheap, and a clear brief for the one large purchase that followed.

## The order of work

From CA-1's assessment, the order is:

1. **Fix what is broken and wasting air:** leaks, stuck or timer drains, loaded filters, open bypasses, the receiver's valves.
2. **Reduce inappropriate demand:** regulate, control or replace open blow-offs and other continuous uses.
3. **Lower the pressure:** step the set point down as far as the users allow, solving local pressure problems locally.
4. **Re-measure:** a fresh week of logging on the improved system.
5. **Improve supply:** control mode, compressor size, staging, sequencing, sized for the measured demand.
6. **Recover heat:** sized for the compressor's real load and a matched heat demand.

The first three steps are cheap, reversible and usually pay back within months. The fifth is a capital decision that lasts fifteen years or more and is far better made on the right numbers.

## Cost and payback

Savings are half of each decision; costs are the other half. The assessment asks for a cost for each measure, from the site's maintenance rates for repairs and from quotations for equipment. Leak repairs, drain replacements, filter elements and regulators are cheap and usually pay back in weeks or months. Engineered nozzles and solenoid control of blow-offs pay back almost as quickly. A variable speed compressor, a heat recovery scheme or a new main is a capital project whose payback depends on running hours, electricity and gas prices, and how the demand will change, and is best evaluated after the cheap measures have reduced the demand it will serve.

A simple payback, cost divided by annual saving, is enough to rank the cheap measures. For capital projects, a discounted cash flow over the equipment's life, with a realistic allowance for maintenance and for future energy prices, gives a fairer comparison, and lets the assessment be compared with other uses of the site's capital.

## Check the air quality too

An assessment that looks only at energy can miss the air's quality, which is what users notice first. A check at a few representative points, of pressure dew point, of oil carry-over and of particles, against the quality each user needs, shows whether the treatment equipment from Chapters 5 and 6 is doing its job. Where users need different qualities, the assessment records which needs which, so that the treatment can be matched to the user rather than set by the most demanding one, as the desiccant dryer failure in Chapter 6 showed.

## People who run the system

Most compressed air savings are lost through small actions by people who do not know the reasons behind a setting: a regulator turned up, a drain timer lengthened, a blowpipe fitted to clear a jam and left in place, a receiver valve left shut, a set point raised to stop a complaint. A short briefing for operators and maintainers, explaining what air costs, why the settings are what they are, and who to call before changing one, protects the savings better than any lock. CA-1's site added a laminated card beside the compressor controller listing the set point, the pressure band, the reason for each, and the name of the person responsible for the system.

## Reporting the results

Management sees compressed air as a line on the electricity bill, if at all. A one-page monthly report, with the average demand, specific power, leakage estimate, electricity cost and any recovered heat, and a short note on what changed, turns the assessment into something that is reviewed and acted on. The report's first edition, showing the baseline week, is the reference against which every later month is judged. A rising trend in leakage or specific power is then visible to the people who can fund the fix, not just to the person who measured it.

## Safety in the compressor room

A compressor room holds several hazards, and an assessment is a good time to check that each is controlled:

```figure
type: checklist
title: Safety checks for CA-1's compressor room and system
caption: A summary for orientation, not legal advice. The model WHS Regulations, the relevant Australian Standards and the equipment makers' instructions govern the details.
- Receivers registered, inspected and fitted with tested safety valves | under the pressure equipment regime described in Chapter 8
- Stored energy isolated and vented before work | lockable isolation, and a gauge to confirm zero pressure
- Hot surfaces guarded and temperature trips untouched | discharge lines and coolers can cause burns; trips protect against fire
- Noise assessed | compressors and blow-offs can exceed exposure limits; Safe Work Australia's code of practice on managing noise applies
- x Do not use compressed air to clean clothing or skin | air can enter the body through the skin and cause serious injury
- Blow-off nozzles chosen to limit dead-end pressure | protects eyes and skin from debris and air injection
- ? Are pipe materials rated for compressed air | water-grade plastic pipe can shatter, as Chapter 9 noted
```

The assessment report should list safety observations separately from savings, so that they are never weighed against money. A receiver whose inspection is overdue is not an energy opportunity; it is a compliance issue to be closed first.

## Leakage after the repairs

The leak programme's saving should be checked by measurement, not assumed. Repeating the idle-plant test after the repairs, under the same conditions as the first, gives a new leakage figure to set against the original 1.05 m³/min. On CA-1's site the second test found about 0.38 m³/min, slightly less than the two thirds removal planned, because some leaks found during the survey were in places that could not be repaired without a shutdown and were scheduled for the next one. That honest figure, rather than the estimate, is what went into the monthly report, and the remaining leaks went onto the shutdown list with their estimated cost beside them, so the work had a value attached when it was planned. The difference between planned and measured, about 0.03 m³/min, is small, but reporting it builds trust in every later figure the programme publishes, and trust is what keeps a leak programme funded once its first easy savings have been taken.

## Keep the measurements running

The week of logging that started the assessment is worth repeating, or making permanent. Specific power, average demand, leakage, the compressor's load cycles and the pressure at the far end of the main, reported monthly on one page, show whether the improvements are holding. CA-1's site adds the recovered heat and the dryer's dew point to that page. When a number moves, someone investigates before the next report; that habit, more than any single piece of equipment, keeps a compressed air system efficient. It costs an hour a month, and it is the cheapest insurance against the slow return of every loss this book has described.

## Exercise: variable speed after the demand work

After the demand-side measures, CA-1's average demand is about 2.96 m³/min. Using a variable speed specific power of 7.0 kW per m³/min, estimate the annual electricity of a variable speed compressor, and compare it with the existing load and unload compressor at the same demand.

**Answer.** A variable speed compressor would use about 2.96 × 7.0 ≈ **20.7 kW** on average, about 124,300 kWh a year, costing about **A$31,100**. The existing compressor at 49 per cent load uses about 25.4 kW, costing about A$38,100. The difference, about **A$7,050 a year**, is nearly twice the variable speed saving calculated at today's demand. The demand-side work made the supply-side investment more valuable, which is the reason to do it first.
