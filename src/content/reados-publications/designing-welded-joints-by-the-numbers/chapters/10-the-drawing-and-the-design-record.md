---
book: designing-welded-joints-by-the-numbers
chapterSlug: the-drawing-and-the-design-record
order: 10
title: "The drawing and the design record"
description: "Tell the welder exactly what to make with weld symbols, a weld schedule and notes on penetration, finish and inspection, and keep the design note that records why each weld is the size it is."
draft: false
---

Every calculation in this book ends on a drawing. The welder does not see the load table, the weld group arithmetic or the fatigue check; the welder sees a symbol, a size and perhaps a note. If the drawing is unclear, the welder decides, reasonably and quickly, and the decision may not be the designer's. Partial penetration where complete penetration was needed, a weld on the wrong side of a joint, a site weld made in the shop or the reverse, a fatigue-critical weld left with a rough toe: most such failures begin on a drawing that did not say what it meant.

This chapter sets out what a drawing must tell the fabricator about each weld, how a weld schedule and a weld map organise that information, what the design note must record, and how the design is checked and changed. It names AS 1101.3, the Australian standard for welding symbols on engineering drawings, by number and scope, and does not reproduce its symbols; drawings use the standard itself.

## What the drawing must say

For each weld, the fabricator needs to know:

- **where it is**: which joint, and which side of the joint;
- **what type**: fillet, butt, plug or other, and for butt welds the preparation;
- **how big**: the leg of a fillet, the effective throat or penetration of a butt weld;
- **how long**: continuous, a stated length, or intermittent with length and pitch;
- **whether it goes all round** a member, and whether it is made in the shop or on site;
- **what finish**: as welded, ground flush, or toe dressed;
- **what quality**: the weld category or acceptance level, and the inspection required;
- **what procedure or filler** where it matters, such as for high-strength or stainless steel.

Welding symbols, drawn to the conventions of the applicable standard, carry much of this compactly on the drawing; notes and a weld schedule carry the rest. The symbol's conventions, such as which side of the reference line refers to the near side of the joint, must be followed exactly, because a symbol drawn on the wrong side of its line calls for a weld on the wrong side of the joint.

## The weld schedule

On a frame with many welds, repeating every detail at every joint clutters the drawing and invites inconsistency. A weld schedule, a table on the drawing or in an accompanying document, lists each weld or group of welds with its type, size, length, finish, category and inspection, keyed to marks on the drawing.

```figure
type: compare
title: Part of the conveyor drive's weld schedule
cols: Weld | Finish | Inspection
caption: This is an illustration of the company's schedule format. The weld category and inspection requirements come from the applicable welding standard and the design specification.
- W1, motor bracket flange to column | 6 mm fillet both sides, continuous | as welded, toes dressed | visual all; magnetic particle 100%
- W2, gearbox plate to frame | 6 mm fillet both sides, continuous | as welded | visual all; magnetic particle sample
- W3, walkway tie splice | complete penetration butt, back-gouged | ground flush | visual; ultrasonic 100%
- W4, base plates to columns | minimum fillet for 20 mm plate, all round | as welded | visual all
- *W5, stiffeners and guard brackets | 4 mm fillet, continuous | as welded | visual all
```

The schedule makes the design reviewable at a glance: anyone can see which welds carry the critical loads, which need full inspection and which are minor. It also gives the estimator and the welding supervisor the information they need in one place.

## Penetration, said plainly

Chapter 2's failure, a butt weld made with partial penetration because the drawing did not say otherwise, is common enough to deserve its own rule. Every butt weld on a drawing states whether complete penetration is required, and if partial penetration is acceptable, its effective throat. The standard's symbols and conventions provide for this; where in doubt, a plain note does no harm. The same applies to back-gouging, backing bars and whether a backing bar may remain in place.

## Shop and site welds

Welds made on site, after the frame is installed, are made in worse conditions than shop welds: often in difficult positions, in the weather, with less control and harder inspection. The drawing marks which welds are site welds, so that the fabricator does not make them in the shop, where they might prevent the frame from being installed, and so that the installer knows what remains to be done. Good design keeps site welding to a minimum, using bolted site connections where possible. Where a site weld cannot be avoided, the drawing also states its position and any preparation to be done in the shop, so that the site welder arrives at a joint ready to weld.

## Fatigue-critical welds

Welds whose fatigue life matters, identified in Chapter 8, are marked on the drawing, with their required finish, such as ground flush or toe dressed, and their inspection. Without the mark, a fatigue-critical weld looks like any other on the drawing and is likely to be welded, finished and inspected like any other. The conveyor company marks such welds with a symbol in its weld schedule and a note explaining it.

## Weld categories and acceptance levels

Welding standards for structures commonly define categories or quality levels for welds, each with its own acceptance criteria for defects and its own inspection requirements, so that critical welds are made and inspected to a stricter level than minor ones. The designer chooses the category for each weld according to its load and the consequences of failure, and states it on the drawing or in the schedule. Choosing the strictest category for every weld drives up the cost of fabrication and inspection without benefit; choosing a relaxed category for a critical weld lets defects through that matter. The weld schedule is where the choice is made visible.

## Drawings for the shop floor

Engineering drawings are often detailed further into shop drawings by the fabricator, showing each part, its cutting dimensions and its welds in the order they will be made. The designer reviews the shop drawings against the design drawing and the weld schedule before fabrication starts, because errors introduced in detailing, a weld size transcribed wrongly, a side swapped, a site weld moved into the shop, are as dangerous as design errors and much easier to catch on paper than in steel. The conveyor company signs off each shop drawing set with a short checklist that compares every weld against the schedule.

## Tolerances on the drawing

Weld sizes, fit-up gaps, flatness of machined faces and the positions of mounting holes all need tolerances, stated on the drawing, so that the fabricator knows what is acceptable and the inspector knows what to check. A fillet weld size with no tolerance invites argument over a weld a millimetre undersize; a mounting face with no flatness tolerance invites a gearbox that rocks. READOS covers the setting of tolerances in Fits That Work; for welded frames, the useful habit is to tolerance what matters to the function and leave the rest to the welding standard's general requirements.

## Communicating with the welder

The best drawing still benefits from a conversation. For the conveyor drive's first frame, the designer walked through the weld schedule with the welding supervisor before fabrication, pointing out the fatigue-critical welds, the complete penetration splice and the reason the base plate welds were larger than their load required. The conversation took twenty minutes and meant that the welders understood which welds mattered most and why, which no symbol can convey on its own.

## The weld map

For fabrications whose welds must be traceable, a weld map assigns each weld an identifier and records, for each, the welder who made it, the procedure used, the inspection results and any repairs. The map supports quality systems and investigations: if a weld cracks in service, the map shows who made it, how and what inspection it passed. Testing Welded Joints by the Numbers explains the role of weld maps and records in its chapter on [qualification, records and the cost of testing](/reados/publications/testing-welded-joints-by-the-numbers/qualification-records-and-the-cost-of-testing/).

## The design note

The drawing says what to make; the design note says why. For each joint, the note records the loads and their combinations, the method used, the governing check, the weld size calculated and the size chosen, and the reason for any difference, such as a minimum size, fatigue or a practical consideration. It records the assumptions, such as the design strengths, the number of load cycles and the eccentricities, so that a later reviewer, or the designer a year later, can see what was assumed and check whether it still holds.

```figure
type: checklist
title: Contents of the conveyor company's weld design note
caption: This is an illustration of the company's practice. Design records for real structures follow the design standard and the client's requirements.
- x Loads and combinations for each joint | with their types: static, impact, fatigue
- x Method and governing check | weld group, bending, combined, fatigue
- x Calculated size and chosen size | with the reason for any difference
- x Assumptions | design strengths, cycles, eccentricities, filler
- x Minimum sizes and fatigue details | where they, not strength, governed
- *? Review and changes | who checked it, and every change since
```

## Checking the design

A second person checks the governing joints, the arithmetic and the drawing against the design note. The check, done by someone who did not do the design, catches the errors that calculations most often contain: a load applied at the wrong point, a weld length counted twice, a unit mismatch, a symbol on the wrong side. For the conveyor frame, the check took about two hours and found one error, a walkway support's weld length entered as the total of both sides instead of each side, which had halved the calculated force. The weld size chosen was still adequate, because the designer had rounded up for fatigue, but the check corrected the note.

## Changes after release

Designs change: a heavier motor, a longer walkway, a substitute section because the specified one is not in stock. Each change can alter the loads on welds or the welds themselves. The company's rule is that any change affecting a welded joint goes back through the design note, with the affected joints rechecked and the change recorded, before the drawing is revised. A substitution made on the shop floor, without that check, is how the earlier platform in Chapter 6 lost its bottom welds.

## As built

After fabrication, the inspection records and any deviations, such as repairs, substitutions or welds made differently from the drawing with the designer's approval, are filed with the design note and the drawing, so that the record describes the frame as built, not only as designed. When the conveyor drive is modified years later, or a weld cracks, that record is the starting point.

## A failure: the weld on the wrong side

This is an illustration. On an earlier frame, a single fillet weld at a gusset was drawn with its symbol on the wrong side of the reference line, calling for the weld on the far side of the joint. The far side was the side away from the load, where a single fillet's root would open under bending. The fabricator welded exactly what the drawing showed. The gusset cracked at its root within a year.

The designer had intended the weld on the near side, under the load, and had simply drawn the symbol the wrong way. A check of the drawing against the design note would have caught it. The company now checks every single-sided weld symbol against the load direction in its review.

## Bringing it together

Each chapter of this book applied a few ideas to one part of welded joint design. The load path decided what each weld must carry. The throat, not the visible size, set a weld's strength. Fillet capacity rose with the leg, and weld metal with its square. Eccentric loads and bending loaded the welds farthest from the centroid or axis most, so welds placed far away worked hardest. Combined loads were added as vectors, and the filler matched to the steel. Fatigue, governed by the stress range and the cube law, decided many weld sizes more than strength did. Weld volume drove cost and distortion. And the drawing and design note turned the arithmetic into a frame that could be made, checked and maintained. Whittemore's lesson of 1910, that a weld is only as strong as its fused area, still runs through all of it.

## Exercise: write the weld information

Write the information the drawing should give for the motor bracket's flange welds, using the design from Chapters 5 and 8. What would happen if the drawing showed only a fillet symbol with "6"?

The drawing should state: fillet welds, 6 mm leg, on both sides of the bracket's flange where it meets the column, continuous over the full 200 mm length on each side, made in the shop; finish as welded with the toes dressed, because the joint is fatigue-loaded by motor vibration; matching filler to the shop's qualified procedure; visual inspection of all welds and magnetic particle inspection of 100% of the welds; and a note identifying the joint as fatigue-critical. The design note records the 485 N/mm calculated force, the 4 mm calculated leg, and the reasons for choosing 6 mm: fatigue, the minimum size and possible belt over-tension.

With only a fillet symbol and "6", the fabricator might weld one side only, stop short of the full length, leave rough toes, use whatever filler was at hand and inspect visually at best. Each of those could shorten the bracket's life, and none would be a fault of the fabricator, who made what the drawing asked for.
