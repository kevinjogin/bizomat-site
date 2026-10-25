---
book: testing-welded-joints-by-the-numbers
chapterSlug: qualification-records-and-the-cost-of-testing
order: 10
title: "Qualification, records and the cost of testing"
description: "Put the tests together into procedure and welder qualification, keep the records that make results trustworthy, and work out what testing costs per hopper against what it protects."
draft: false
---

The previous chapters looked at weld tests one at a time. In practice they come together in a few structured activities: qualifying a welding procedure, qualifying the welders who will use it, and inspecting and testing production. Each produces records, and the records are what turn a set of test results into evidence that a customer, an auditor or the fabricator's own engineer can rely on years later. Each also costs money, which is worth knowing, because testing competes with everything else for a fabricator's time and budget.

This chapter assembles the hopper fabricator's procedure and welder qualification, sets out the records it keeps, and works out the cost of its testing per hopper and against the cost of the failures it protects against.

## Qualifying a welding procedure

A welding procedure specification, or WPS, sets out how a weld is to be made: the process, the parent material and thickness, the joint preparation, the consumables, the position, the current, voltage and travel speed ranges, the heat input, preheat and interpass temperatures, and the run sequence. Before it is used for work that requires qualification, it is proved by a test.

The usual path is:

1. **A preliminary WPS** is written, setting out the intended procedure.
2. **A test plate** is welded to it, under supervision, with all the actual parameters recorded.
3. **The plate is tested**: visually, by non-destructive testing, and destructively, with transverse tensile, bend, macro, hardness and, where required, impact tests, as the standard specifies for the material and thickness.
4. **A procedure qualification record**, or PQR, documents the plate, the recorded parameters and every test result.
5. **The qualified WPS** is issued, with ranges of the variables that the standard allows the qualification to cover.

ISO 15614-1 sets out the welding procedure test for arc welding of steels. In Australia, the AS/NZS 1554 series for structural steel welding sets out how procedures are qualified for its purposes, including the use of prequalified procedures under the conditions it states. Each standard defines which variables, if changed beyond stated limits, require a new qualification.

```figure
type: steps
title: From preliminary procedure to qualified procedure
caption: The tests of Chapters 2 to 9 come together in the procedure qualification record, which supports the qualified welding procedure specification.
- Preliminary WPS | the intended procedure, written before the test
- Test plate | welded under supervision; actual parameters recorded
- Non-destructive tests | visual, and radiography or ultrasonics as required
- *Destructive tests | tensile, bend, macro, hardness and impact as required
- Procedure qualification record | plate details, parameters, every result
- Qualified WPS | ranges of variables the qualification covers
```

## The hopper procedure's qualification

This is an illustration. The hopper procedure's qualification record, drawn from the earlier chapters, contains:

| Test | Result | Chapter |
|---|---|---|
| Visual | acceptable | 8 |
| Ultrasonic testing of the plate | no rejectable indications | 9 |
| Transverse tensile, two specimens | 470 and 462 MPa, both broke in the parent | 2 |
| Bends, two root and two face | acceptable; one small pore in a face bend | 5 |
| Macro | full penetration and fusion; one small pore in the cap | 8 |
| Hardness traverses, cap and root | heat-affected zone peak about 287 HV10 near the cap | 6 |
| Impact, weld metal and fusion line at −20 °C | means 54.3 J and 85.0 J | 7 |

The record also contains the plate material and certificate, the consumable batch, the recorded currents, voltages, travel speeds and heat inputs for each run, and the preheat and interpass temperatures. Without those, the results would show that the plate was good but not how it was made, and the WPS's ranges would have nothing to stand on.

## Qualifying the welders

A qualified procedure in the hands of an unqualified welder proves little. Welders are qualified by welding test pieces within the range of joints, positions, thicknesses and processes they will weld in production, which are then examined visually and by bend tests or radiography, as the standard sets. In Australia, AS/NZS 2980, used with ISO 9606-1, covers the qualification of welders for fusion welding of steels. A welder's qualification has a defined range and must be maintained by continuing work and periodic confirmation, as the standard requires. A lapsed qualification is a common audit finding, as the batch of frames held at a customer's gate in [Arc Welding by the Numbers](/reados/publications/arc-welding-by-the-numbers/cost-per-metre-and-the-job-record/) illustrates.

The hopper fabricator qualified its four production welders on 12 mm plate in the positions the hoppers need, using the qualified procedure.

## Variables and ranges

A qualification test proves one plate, but a WPS must cover a range of production work. Standards manage this through variables: the factors that affect the weld's properties, such as the parent material group, the thickness, the process, the consumable classification, the welding position, the heat input and the preheat. For each, the standard states how far production may depart from the test before a new qualification is needed. A test on 12 mm plate qualifies a stated range of thicknesses around it, not all thicknesses; a test with one consumable classification does not qualify another; and a test with impact requirements usually limits heat input to near the value tested, because toughness depends on it (Chapter 7).

The ranges are not arbitrary. Each reflects how much a change in that variable can change the weld's hardness, toughness or soundness, which is exactly what the chapters on those tests explored. A thicker plate cools faster and hardens more; a higher heat input coarsens the grain and lowers toughness; a different consumable has different weld metal. Keeping production within the qualified ranges is what makes the qualification test relevant to the production welds.

## Coordination and quality systems

Someone must own all of this: deciding which procedures need qualification, checking that jobs fall within qualified ranges, keeping welder qualifications current, and making sure inspection and testing happen and are recorded. Standards for welding quality management, such as the ISO 3834 series, adopted in Australia, set out quality requirements for fusion welding at several levels, and ISO 14731 sets out the tasks and responsibilities of welding coordination. Many customers require fabricators of structural and pressure equipment to work within such a system. The hopper fabricator's welding coordinator, a qualified welding engineer working part-time for the business, holds those responsibilities, signs off each WPS and reviews each test report.

## Repairs are welds too

A repair of a defective weld is itself a weld, and it needs a procedure. Excavating a defect, rewelding the cavity and re-inspecting it changes the heat input and restraint compared with the original weld, so repair procedures are qualified or justified in their own right, and repaired welds are re-inspected by the method that found the defect, usually with a wider area tested around the repair. [Weld Repairs That Hold](/reados/publications/weld-repairs-that-hold/) covers repair welding in depth. The hopper fabricator's repair records, in the checklist above, link each repair to its procedure and its re-inspection, so that a repaired weld carries the same evidence as an original one.

## Keeping the records

The fabricator's welding records, which its customer can audit, include:

```figure
type: checklist
title: The hopper fabricator's welding quality records
caption: This is an illustration. Each record links a weld to the evidence that it was made and tested properly.
- x Qualified WPS and its PQR | with every test report and the recorded parameters
- x Welder qualification records | ranges, test results and continuity or renewal dates
- x Material certificates | plate traced to each hopper by heat number
- x Consumable certificates and storage records | batch numbers; holding-oven logs
- x Weld map for each hopper | each weld, its WPS and its welder
- x Inspection and NDT reports | visual indications, NDT results, escalations
- x Repair records | defect, repair procedure, re-inspection result
- *? Production test plates | monthly results and trend chart (Chapter 4)
```

Good records answer the questions an investigator would ask after a failure: which procedure, which welder, which batch of plate and consumable, what inspection, and what was found and done. Hart's caution that test data must be taken with a grain of salt applies most strongly to data without records behind it.

## When something changes

Production rarely stays still. A consumable supplier changes a product, a new plate mill supplies the steel, a welder leaves and a new one starts, a machine is replaced. Each change raises the question of whether the existing qualification still covers the work. The answer comes from the standard's variables: a change within the qualified ranges needs no new test, a change outside them does. Between those two lies judgement, and a fabricator that is unsure can make a supplementary test, such as a hardness traverse or an impact set on a short test plate, to confirm that the change has not moved the weld's properties, rather than waiting for a problem in production.

The hopper fabricator keeps a simple change log: each change to materials, consumables, equipment or people that could affect welding is recorded with the welding coordinator's decision on whether it needs testing. The log itself is part of the records the customer audits, and it is how the 20 mm plate in the failure below should have been caught.

## What the records are for

All of these records cost time to keep, and the temptation is to treat them as paperwork for auditors. Their real purpose is practical. When a production test plate result drifts, the records show what changed that month. When a weld cracks, they show which procedure, welder, plate and consumable were involved, and which other welds share them and need checking. And when a customer asks whether the hoppers they bought five years ago were welded properly, the records are the only answer that does not depend on someone's memory.

## The cost of testing

This is an illustration. All costs exclude GST.

**One-off qualification.** The procedure qualification cost about A$5,090: A$600 for the plate and its preparation, about A$540 for six hours of welding and supervision at A$90 an hour, A$350 for ultrasonic testing of the plate, and about A$3,600 for the laboratory's destructive tests. Qualifying four welders cost about A$800 each, A$3,200 in all, for a one-off total of about **A$8,290**.

**Ongoing testing.** At 50 hoppers a year, the ongoing testing costs about:

- monthly production test plates, 12 at about A$900 each: **A$10,800**;
- ultrasonic testing of 10% of butt welds, 50 × 24 m × 10% = 120 m at A$45 a metre: **A$5,400**;
- visual inspection, about two hours of the inspector's time per hopper at A$95 an hour: **A$9,500**.

That is about **A$25,700** a year, about **A$514** per hopper. Spreading the one-off qualification over three years of production adds about 8,290 ÷ 150 ≈ A$55 per hopper.

```figure
type: bars
title: Annual testing and inspection cost at 50 hoppers a year
unit: A$ per year, excluding GST
max: 12000
caption: This is an illustration. Production test plates and visual inspection cost more than the ultrasonic sampling; the one-off qualification adds about A$55 per hopper over three years.
- Production test plates | 10800
- *Visual inspection | 9500
- Ultrasonic testing, 10% | 5400
```

## What the testing protects against

Testing costs about A$570 per hopper including the qualification. Against that stands the cost of what it prevents. This is an illustration. A hopper seam that cracked in service would mean removing the hopper from use, a repair on site under a qualified repair procedure, inspection of the other hoppers of the same batch, and the customer's lost production while its stockpile system was down, plausibly A$60,000 or more, before any damage to the fabricator's reputation. If the testing programme prevented even one such failure in every hundred hoppers, it would save about A$600 per hopper, roughly what it costs, and the defects found in the earlier chapters suggest it prevents more than that.

The comparison also shows where the money is best spent. Visual inspection, the cheapest test per metre, finds most of the imperfections; ultrasonic sampling finds the internal ones visual cannot; production test plates confirm month by month that nothing has changed. Removing any one leaves a gap the others do not fill.

## A failure: the procedure used outside its range

This is an illustration. A year into the hopper contract, the customer ordered a heavier hopper with a 20 mm plate bottom section. A supervisor, seeing that the joint design was similar, issued the existing 12 mm WPS for the new seams. During the customer's audit, the auditor noted that the 20 mm thickness lay outside the range the 12 mm qualification covered, and that the thicker plate would cool faster, raising the heat-affected zone's hardness and lowering toughness (Chapters 6 and 7).

The seams already welded were held. The fabricator qualified a new procedure on 20 mm plate, with a higher preheat, whose hardness and impact results were acceptable; the held seams were assessed with the customer by hardness testing on site and ultrasonic testing, and accepted. The fabricator's procedure for issuing WPSs was changed so that the welding coordinator checks each job against the WPS's qualified ranges before it is issued, rather than leaving the choice to supervisors.

## Exercise: more hoppers

The fabricator's production rises to 80 hoppers a year, with the same monthly test plates, ultrasonic sampling and inspection time per hopper. Calculate the annual testing cost and the cost per hopper, and the one-off qualification cost per hopper spread over three years.

The monthly test plates still cost **A$10,800**. Ultrasonic testing becomes 80 × 24 × 0.10 = 192 m at A$45, **A$8,640**, and visual inspection 80 × 2 × A$95 = **A$15,200**. The total is about **A$34,640** a year, about **A$433** per hopper. The one-off qualification spread over 240 hoppers is about 8,290 ÷ 240 ≈ **A$35** per hopper.

The cost per hopper falls as production rises, because the test plates and the qualification are fixed costs spread over more hoppers, while the inspection and ultrasonic costs scale with the welding. Testing is a modest, predictable cost of making welded products properly, and a small one beside the cost of a single failure in service.
