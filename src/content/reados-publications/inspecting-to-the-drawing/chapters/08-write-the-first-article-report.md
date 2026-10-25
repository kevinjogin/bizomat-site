---
book: inspecting-to-the-drawing
chapterSlug: write-the-first-article-report
order: 8
title: "Write the first article inspection report"
description: "Inspect a production-representative first part against every balloon, report it so a customer can check it, and know which later changes need a new or partial first article."
draft: false
---

A first article inspection asks a bigger question than whether one part conforms. It asks whether the production process, with its program, fixtures, tools, instruments and suppliers, is capable of making conforming parts. One part made by that process, inspected against every requirement and reported completely, is the evidence.

That is why the first article is not the first part made. Trial parts made while the program is proved out, on a temporary fixture, or before the finisher is chosen, tell the shop useful things, but they do not show what the production process makes. This chapter produces the bracket's first article inspection report, starting from a failed first attempt, and covers the changes after approval that call for the work to be repeated.

## What a first article report proves

A first article report is evidence for a customer who was not in the room. It must let them check three things without asking:

1. **That the part inspected is the part described**: the right drawing and revision, made by the process that will make the batch.
2. **That the materials and special processes are the right ones**, with certificates that trace to this part.
3. **That every requirement was checked**: each balloon has a result, a method and a decision, and the count of results matches the ballooned drawing.

Aerospace customers commonly require the format in SAE AS9102, now in revision C, which organises the report into three forms covering the part, the product's materials and processes, and the individual characteristics. Automotive customers use the Production Part Approval Process, which includes dimensional results within a wider submission; the chapter on [PPAP for small suppliers](/reados/collections/manufacturing-quality/ppap-for-small-suppliers/) covers it. Many other customers simply ask for "a first article report". The structure below works for all of them; use the customer's own forms when they provide them.

```figure
type: tree
title: Structure of a first article inspection report
caption: Whatever the customer's format, a complete report answers these questions in this order.
- First article report | SB-2041 rev C, report FAI-0412
  - Part accountability | what was inspected
    - Part number, revision, name | SB-2041, C, sensor bracket
    - Full or partial | full; first production of revision C
    - Part identification | FA-2, batch 0412, serial marking
  - Product accountability | materials and special processes
    - Material | 6061-T6 plate, certificate and lot
    - Special process | clear anodise, finisher, certificate, thickness
  - *Characteristic accountability | every balloon
    - Requirement and limits | from the limits table
    - Result | number or pass rule outcome
    - Method | instrument and asset number
    - Decision | conforms or nonconformance reference
```

## A part from the production process

This is an illustration. The bracket's first attempt at a first article, FA-1, was made on the production machining centre with the production fixture and anodised by the production finisher. It failed twice. Chapter 7 found its bore undersize after anodising, and Chapter 4 found mounting hole 8.2 out of position because a fixture stop had been knocked out of place. FA-1 was recorded as a failed first article, scrapped, and kept in the record with its two nonconformances and their corrective actions.

FA-2 was made after both corrections: the pre-anodising bore target of 10.024 mm on the set-up sheet, and the fixture stop reset, pinned and checked with the position gauge. It was made on the same machine, with the same program, fixture, tools and finisher planned for the batch. Any element that is not the final production process, such as a temporary fixture or a different machine, must be identified on the report, and some customers will not accept a first article made that way at all.

```figure
type: timeline
title: From first article to batch release
caption: This is an illustration. FA-1's failures are part of the record, not hidden; the report submitted is for FA-2.
- Week 1 | FA-1 made and inspected | bore undersize after anodising; hole 8.2 out of position
- Week 1 | Corrective actions | bore target allows for coating; fixture stop pinned
- Week 2 | FA-2 made and inspected | all 28 results and the angle query conform
- Week 2 | Report FAI-0412 submitted | with ballooned drawing and certificates
- *Week 3 | Customer approves | remaining 39 brackets released for production
```

## The characteristic results

This is an illustration. The inspector measures FA-2 against every line of the limits table, after anodising, with the instruments on the method sheet. Every result is recorded as a number where the requirement is numeric.

| Balloon | Requirement | Limits | Result | Method |
|---|---|---|---|---|
| 1 | Length | 79.90 to 80.10 | 80.04 | Caliper C-03 |
| 2 | Width | 49.90 to 50.10 | 49.97 | Caliper C-03 |
| 3 | Base thickness | 7.90 to 8.10 | 8.02 | Caliper C-03 |
| 4 | Height | 44.90 to 45.10 | 45.03 | Caliper C-03 |
| 5 | Upright thickness | 7.90 to 8.10 | 7.98 | Caliper C-03 |
| 6 | Flatness, A | 0.05 max | 0.021 | Plate, indicator I-07 |
| 7.1, 7.2 | Holes | 6.60 to 6.80 | 6.66, 6.65 | Pins P-set-2 |
| 8.1 | Position | 0.2 + bonus 0.06 = 0.26 | 0.072 | Height gauge H-01, I-07 |
| 8.2 | Position | 0.2 + bonus 0.05 = 0.25 | 0.089 | Height gauge H-01, I-07 |
| 9 | Bore | acceptance zone 10.0014 to 10.0136 | 10.0110 | Bore gauge B-02 |
| 10 | Bore height | 29.98 to 30.02 | 30.006 | Blocks, H-01, I-07 |
| 11 | Bore from B | 24.95 to 25.05 | 25.012 | Blocks, H-01, I-07 |
| 12 | Perpendicularity | 0.02 max | 0.007 | Pin, I-07 |
| 13 | Bore texture | Ra 0.8 max | Ra 0.52, highest of 3 | Profilometer R-01 |
| 14.1, 14.2 | Thread M4-6H | GO enters, NO-GO does not | pass, pass | Gauges T-04 |
| 15.1, 15.2 | Thread depth | 8.0 min | 9.0, 8.9 | T-04 with depth stop |
| 16 | M4 spacing | 19.90 to 20.10 | 20.03 | Caliper C-03 |
| 17 | First M4 from B | 14.90 to 15.10 | 15.02 | Caliper C-03 |
| 18 | Radius R3 | 2.90 to 3.10 | conforms, no gap | Radius gauges G-02 |
| 19 | Material | 6061-T6 plate | certificate lot matches | Certificate, traveller |
| 20 | Anodise | 10 to 15 µm | 12 µm mean, 11 to 13 | Eddy-current gauge E-01 |
| 21 | After anodising | all dimensions | measured after finish | Record note |
| 22 | Edge break | 0.2 to 0.5 | conforms against sample | Visual, sample S-11 |
| 23 | Marking | SB-2041-C and batch | legible, underside | Visual |
| 24 | Other texture | Ra 3.2 max | Ra 1.9, highest | Profilometer R-01 |
| query | Upright angle | 0.32 deviation over 37 | 0.08 | Square, indicator I-07 |

Three entries show practices worth copying. The position lines give the allowed value with its bonus, so the reader can check that the bonus came from the recorded hole sizes. The bore line shows the acceptance zone, not the drawing limits, because the customer specified guarded acceptance; the full uncertainty statement from Chapter 6 is attached. The radius and edge-break lines say how they were checked, rather than inventing a measured value.

```figure
type: stats
title: FA-2 at a glance
caption: This is an illustration. The counts on the report must match the ballooned drawing exactly.
- 24 | balloons | plus the angle line from the customer query
- 29 | results recorded | 28 from balloons and instances, 1 from the query
- *29 | conform | no nonconformances on FA-2
- 2 | certificates attached | material and anodise
```

## What goes with the report

The results table is not the whole report. A customer checking it needs:

- **The ballooned drawing**, at the same revision, so balloon numbers can be matched to features.
- **The material certificate and the finisher's certificate**, with lot numbers that match the traceability records.
- **The method details** for anything not obvious: the uncertainty statement for the bore, the datum set-up for position, the profilometer settings.
- **Calibration status** of each instrument used, at least as a statement that every instrument listed was within its calibration interval on the inspection date. Some customers ask for the certificates.
- **Any queries and their answers** that changed how a requirement was read: the model status, the implied angle, texture after anodising.
- **The signature** of the inspector and, where the customer requires it, of someone independent of production who reviewed the report.

A report is complete when someone who has never seen the part can repeat the reasoning from the documents alone.

## Who inspects the first article

The supplier guide referenced in this book describes first article inspection as planned, complete, independent and documented. Each word asks something of the shop.

**Planned** means the ballooned drawing, limits table and method sheet exist before the first article is made, so that the part is inspected against a plan and not against whatever occurs to the inspector at the bench. **Complete** means every balloon, which Chapter 2's reconciliation step guarantees. **Independent** means the person signing the report is not the person whose work is being judged. In a small shop that may simply mean the machinist who made the part does not sign its first article report; someone else measures it or, at minimum, reviews every result. **Documented** means the report stands on its own, as described above.

Time is the practical obstacle. A full first article on the bracket, with 29 results, two certificates, profilometer traces and a position set-up, takes a competent inspector most of a working day. That time belongs in the quote. A shop that prices a first article as an hour of inspection will be tempted to cut it short, and the customer pays for that later, usually through a held delivery.

## After approval: the production inspection plan

An approved first article shows the process can make a conforming part. It does not show that every part in the batch will conform. The production inspection plan carries the first article's discoveries into the batch.

This is an illustration. For the remaining 39 brackets, the shop's plan is:

- **Every part:** bore GO and NO-GO plugs after anodising; thread gauges; the functional position gauge for the mounting holes; marking and visual checks.
- **First, last and every tenth part:** full variable measurement of balloons 1 to 13 and 16 to 18, recorded.
- **Each finishing lot:** coating thickness on two parts and the finisher's certificate.

Customers who require formal sampling plans often call up ISO 2859-1 for attribute sampling by lot; follow the plan and inspection level the customer specifies. The plan above is a shop's own choice for a small batch, based on which requirements the first article showed to be sensitive.

## When a new first article is needed

A first article report remains valid while the process that made the part stays the same. Changes to the process put that in doubt. The supplier guide referenced in this book lists the kinds of event that call for a new first article, and the list is typical of many customers' requirements: a change to the design affecting the characteristics, a change of manufacturing source, process, tooling, inspection method, material or location, a change to the NC program, a natural or man-made event that could affect the process, corrective action after a failed first article, and a lapse in production; that guide uses two years.

Where only some characteristics are affected, a partial first article can be enough: it re-inspects the changed characteristics and refers to the approved report as its baseline, provided everything else is still made by the approved process.

```figure
type: decision
title: Does this change need a new first article?
question: Could the change affect any characteristic the approved report covers?
- No | Record the change | note why no characteristic is affected; keep with the approved report
- *Yes, some characteristics | Partial first article | re-inspect those characteristics; cite the approved report as baseline
- Yes, broadly or unclear | Full first article | treat the part as new; follow the customer's requirements
```

## The error: a quiet change of machine

This is an illustration. Halfway through the batch, the production machining centre broke down. To meet the delivery date, the remaining brackets were moved to the shop's second machining centre, with the same fixture and a copy of the program converted for its controller. Nobody thought of it as a change requiring a first article; it was "the same job on the other machine".

The production plan caught it. The tenth-part variable measurement on the first bracket from the second machine showed both mounting holes 0.05 mm further from datum C than any part from the first machine. They still passed the functional gauge, but the shift was systematic, and its cause was the converted program's different work offset handling.

The shop stopped, recorded the change, and performed a partial first article on the next bracket from the second machine: all characteristics produced by the program, which is every machined dimension. It notified the customer, as its customer's requirements obliged it to for a change of machine and program. The partial report showed all characteristics conforming after the offset was corrected, and it was approved before the rest of the batch was released. The procedure now lists a change of machine, controller or program translation as a trigger for review against the decision above.

## Exercise: is the report complete?

A supplier sends a first article report for a machined cover. It lists 18 dimensional results, all conforming, with "OK" in the method column. The ballooned drawing shows 22 balloons; balloons 19 to 22 are a material note, a finish note, a thread and a marking note. No certificates are attached. The report says the part was made "on the prototype fixture; production fixture under construction". List what is missing or questionable.

**Answer.** Four balloons have no results, so the report fails characteristic accountability: material, finish, thread and marking are all unreported. No material or finish certificates are attached, so product accountability is missing. The method column gives no instruments, so results cannot be traced to calibrated equipment or judged against the tolerances. The part was not made by the production process, because the fixture differs; the report must say so prominently, and the customer will probably require a new first article on the production fixture. The customer should return the report and ask for a complete one rather than approving the 18 results that are there.
