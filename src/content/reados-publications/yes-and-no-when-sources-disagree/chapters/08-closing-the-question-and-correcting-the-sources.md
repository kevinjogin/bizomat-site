---
book: yes-and-no-when-sources-disagree
chapterSlug: closing-the-question-and-correcting-the-sources
order: 8
title: "Closing the question: correct the sources, check the result, keep the record"
description: "How to close a conflict register: give every source a final status, correct or annotate it, tell the authors, check the result in service, and hold a short review so the conflict does not recur."
draft: false
---

A conflict is not closed when the work pack is issued. It is closed when every source that caused it has been dealt with, the result has been checked in service, and the record would let someone else understand the decision without asking. Until then, the same five numbers are still in circulation, and the next planner will meet them again.

This chapter finishes the planner's case. It gives every source in the register a final status, corrects or annotates each one, reports back to the people who wrote them, checks the joints after start-up, and sets out a short review format that turns one investigation into a lasting improvement.

## Give every source a final status

By the end of Chapter 7, the register holds nine entries: the five original sources, the design calculation found in Chapter 5, and three more found along the way. Each needs a final status that says what it is and what has been done about it.

```figure
type: compare
title: The planner's register at closure
cols: Final status | Action taken
caption: This is an illustration. Every entry ends with an action, even when the source was right. Correct sources are annotated so that their meaning travels with them.
- S1 site torque card, 226 N·m | Correct; dry bolts only | Annotated "dry, plain bolts only"
- S2 gasket maker, 135 N·m | Correct; lubricated | Used for J2 and J3; definitions added to the instruction
- S3 drawing note, 23 | Lost unit (kgf·m); superseded by revision C | Full-size revision C filed; old instruction and two copies withdrawn
- S4 contractor spreadsheet, 312 N·m | Misattributed; class 10.9 value | Attribution flagged; contractor informed
- S5 pump manual, 110 N·m maximum | Correct; governs J1 | Limit's meaning confirmed in writing; applied to J1
- S6 design calculation, 47 N·m | Correct; code minimum, not a target | Cross-referenced to the assembly instruction
- Valve maker, 180 N·m | Correct for high-strength studs | Recorded; stud specification queried with the valve maker
- Manual appendix, 210 N·m | Third-party information | Recorded as not a requirement
- *Second torque card, 262 N·m | Transposition of 226 | Withdrawn and reprinted
```

Two features of this table matter. First, most of the sources were right. Of nine entries, five were correct for their own meaning and scope, one was correct but withdrawn by its author, and only three were errors of copying or attribution. That is typical: conflicts between sources are far more often failures of context than failures of fact. Second, every line has an action, including the correct ones. A correct source whose meaning is easily lost, like the torque card, needs an annotation as much as a wrong one needs withdrawing.

## Correct the source, not just the job

The work pack for this shutdown is now right. But the sources that misled it are scattered across the plant: on the workshop wall, in the maintenance system, on shared drives, in a contractor's files. If they stay as they were, the conflict will return.

The planner's corrections follow a consistent rule: **change the source where the plant owns it; annotate it where the plant does not; tell the author either way.**

- **Owned sources** are changed directly. The torque cards are reprinted with their conditions. The faulty work instruction and its copies are marked superseded with a pointer to the new one. The reduced drawing scan is replaced by the full-size revision C.
- **External sources** cannot be changed by the plant, but the plant's copy can carry a note. The contractor's spreadsheet, kept for the record, now opens with a note stating that the 312 N·m value is for class 10.9 bolts and that no standard supports the attribution.
- **Authors are told.** The contractor receives a short note explaining the misattribution. The pump maker is asked why the plant did not receive revision C, and the plant subscribes to the maker's document notification service. The valve maker is asked whether its high-strength studs are required at J2 or merely assumed.

Abelard insisted that readers who found an apparent error in a respected author should first suspect their own understanding, and should discuss difficulties without impugning the author's good faith. That is good practice for engineering feedback too. The note to the contractor does not say "your spreadsheet was wrong". It says what the number is, where it came from, and why it does not apply to these bolts. People correct sources more willingly when the correction respects the work behind them.

### When an author answers back

Telling authors sometimes reopens a question, and the register has to allow for that. Two replies come back in the case.

The contractor's engineering manager replies that "the standard" in the spreadsheet meant the contractor's own internal bolting standard, which assumes class 10.9 bolts unless a job says otherwise. That explains the attribution without changing the conclusion. The contractor's internal standard is a real document, but it is not the plant's, and its default bolt grade does not match the bolts in the spool. The register entry gains a line recording the reply, and the plant's requirement for cited sources now includes "state the bolt grade assumed".

The valve maker replies that its high-strength studs are recommended for its valves but not required at this pressure, and that class 8.8 bolts are acceptable if the joint is tightened to suit them. That closes the open question from Chapter 4 in the plant's favour. Had the answer been the opposite, the result would have been a new register entry and a change to the bolting specification at J2, handled through the plant's change process rather than by adjusting a torque value.

Both replies illustrate the same point. Feedback is not only a courtesy to the author; it is another test of the register's conclusions. An author who knows more about a source than you do can confirm a resolution, explain it, or show that it was wrong. Each outcome is worth having before the next shutdown rather than during it.

## Keep the record where it will be found

A register that sits in one person's email is closed in name only. The planner files the register, its calculations, the photographs of the original sources, the decision record for J1 and the review notes in the maintenance system against the equipment tags for the pump and the spool. Each superseded document carries a link back to the register entry that explains why.

A good closed entry contains enough to stand alone:

- the exact words of the source and where it was found;
- its meaning, origin and conditions as established, with who confirmed them and how;
- any calculation used, with the tool, its inputs and its result;
- the final status and every action taken;
- the people informed and their replies;
- the date of the follow-up search and what it found.

The test is simple. Could an engineer who has never met the planner, opening the pump's record in five years, understand why J1 has a different gasket and a different torque from J2 and J3? If yes, the record will survive staff changes. If no, the next planner will meet the same five numbers and start again.

## Reuse the register at the next shutdown

The closed register is also the starting point for the next job on the same equipment. Before the next spool replacement, the planner's successor opens it and checks four things: that the current revisions of the pump drawing, pump manual and gasket sheet still match those recorded; that the bolts, gaskets and compound in stores match the specification; that the definitions block is still in the instruction; and that no new copies of the withdrawn values have appeared. That check takes an hour, compared with the three weeks the first investigation took.

## The failure case: closing without a follow-up search

Three months after the shutdown, the planner runs the same search she ran in Chapter 3, for "M16" with "262", "312" and "23 N·m", across the maintenance system, shared drives and contractor documents. She finds one copy of the withdrawn second torque card, as a photograph in a contractor's induction slides for new fitters. The card itself was withdrawn on the day; the photograph had been taken months before and was never part of the document register.

Nothing went wrong, because the follow-up found it. But this is how closed conflicts reopen: a copy outside the controlled system survives the correction, and someone new to the site finds it and trusts it. The correction is to ask the contractor to replace the slide, and to add contractor induction material to the list of places searched when a value is withdrawn.

The lesson is that closure needs a check after a delay, not just at the time. A follow-up search at three months is cheap, and it is the only way to find copies that nobody knew existed.

## Check the result in service

The decision for J1 included a review: inspect for weeping at first start-up and after one month. The planner adds J2 and J3 to the same inspections, because the leak history from Chapter 3 showed that these joints had wept after the last two shutdowns.

At start-up, and again at one month, all three joints are dry. That is the outcome the decision aimed for, and it is recorded. But it is recorded carefully. One clean start-up after two weeping ones is consistent with the corrections working, and it is encouraging. It is not proof that any particular correction caused the improvement, because several things changed at once: the tightening values, the lubrication, the gasket at J1 and the verification by stretch measurement. The record says what was observed and what it supports, and no more.

```figure
type: timeline
title: From first conflict to closed register
caption: This is an illustration. The register closes only after the in-service checks and the follow-up search, not when the work pack is issued.
- Week 1 | Register opened with five sources | meanings and copies tested; S3 unit found
- Week 2 | Origins traced; conditions placed on one scale | S4 and S6 resolved; J1 conflict identified
- Week 3 | J1 decision approved; work pack issued | gasket B, 55 N·m lubricated, every bolt measured
- Shutdown | J2 and J3 assembled and surveyed | J3 reworked after stretch survey
- Start-up and one month | All three joints dry | result consistent with the decision
- *Three months | Follow-up search | one stray copy found in induction slides and corrected; register closed
```

## Run a short yes-and-no review

The investigation took the planner most of three weeks alongside her other work. Much of what she learned applies beyond one spool, and the cheapest way to capture it is a short review with the people who used and wrote the sources. The plant's format takes an hour.

```figure
type: steps
title: A one-hour review of a closed conflict register
caption: This is an illustration. The review discusses claims and sources, never people's competence. Its output is changes to how documents are written and checked.
- Present the register | each source with its exact words, origin and final status
- Group the causes | meaning, copying, origin, conditions, measurement, real conflict
- Find the shared weak points | here: numbers separated from conditions; uncontrolled copies; unattributed spreadsheets
- Agree system changes | owners and dates for each
- *Record and close | review notes filed with the register
```

The review for the spool produced four system changes:

1. **Numbers travel with conditions.** Every tightening value in a plant document states its friction condition, its kind (target, minimum or maximum) and its source. The definitions block from Chapter 2 becomes a template.
2. **Units on every note.** Drawings and instructions are checked for unit-less numbers before release, and scanned drawings are kept at full size with their title blocks.
3. **Sources for every calculated value.** Contractors' method statements cite the document, edition and table for each value, or show their inputs (Chapter 4).
4. **Preload is measured where margins are small.** Stretch measurement becomes standard on the first joint each crew assembles and on any joint with a narrow window like J1 (Chapters 6 and 7).

None of these changes is about bolts as such. They are about how claims are written, copied and checked. That is why a register for a flange can improve a plant's documents generally.

## What the method does and does not do

The method in this book is a way of organising doubt. It does not supply engineering data, and it does not make decisions on anyone's behalf. What it does is make sure that when a decision is made, it is made about the real disagreement, not about a misreading, a lost unit or a misattributed number.

It also has a cost. Working a conflict properly takes time, and not every disagreement deserves a full register. A useful test is the consequence of getting it wrong. For a value that decides whether bolts yield on a pressure joint, or whether a cast casing cracks, the full method is justified. For a value whose worst outcome is a minor rework, a quick check of meaning and source may be enough. The register scales: it can be three lines on a job card or a document with its own file.

Nor does the method replace professional judgement or approval. The planner's register made the decision at J1 clear, but the decision itself was taken by the plant's responsible engineer, using manufacturers' data and the plant's procedures for technical deviations. On pressure equipment, cast components and anything else where failure could hurt someone, the register supports the competent person who signs; it does not stand in for them. A register that reaches a conclusion nobody with authority has accepted is a proposal, not a decision, and it should say so.

The most durable output is not the answer to the original question. It is a plant where numbers carry their meanings, copies carry their revisions, spreadsheets carry their sources, and limits are written as bands. In such a plant, Abelard's checklist runs itself most of the time, and the conflicts that remain are the real ones.

```figure
type: checklist
title: Before you close a conflict register
caption: This is an illustration. The planner's register met every item at three months. A register that cannot tick these items is still open, whatever the work pack says.
- x Every entry has a final status and an action
- x Owned sources corrected; external sources annotated; authors told
- x Withdrawn values searched for across all known copy locations
- x In-service result observed and recorded without overclaiming
- x Follow-up search after a delay
- x Review held; system changes have owners and dates
```

## Exercise: close the spreadsheet entry

Write the full closure entry for S4, the contractor's spreadsheet. Include its final status, what was found, what was changed or annotated, who was told, and what the plant will do differently.

**Worked answer.** A good entry is short, factual and complete:

> **S4, contractor spreadsheet, "M16 flange bolts 312 N·m (per standard)".** Final status: misattributed. Origin traced through a cell comment to a fastener retailer's chart, class 10.9 column, 75% of proof load, dry, K = 0.20; the bolt torque and preload tool reproduces 312.1 N·m at a proof stress of 830 MPa. No standard found that supports the attribution. Not applicable to the class 8.8 bolts at J1 to J3, where 312 N·m dry would give 97.5 kN, 103.7% of proof load. Action: plant copy annotated with the true origin; contractor informed in writing with the trace; method statements now required to cite document, edition and table for every tightening value. Follow-up search at three months: no further copies found.

The entry states the evidence, the consequence that made the trace worthwhile, and the system change, so that someone reading it in five years can see why the plant asks contractors for sources. It does not criticise the contractor's engineer, who copied a correct number from the wrong column, which is exactly the kind of error the register exists to catch.
