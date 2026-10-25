---
book: checking-drawings-by-the-numbers
chapterSlug: what-a-checker-is-for
order: 1
title: "What a checker is for"
description: "What the drawn, checked, approved and issued signatures each promise, why checking must be independent, what a missed fault costs at each stage, and how to plan a check."
draft: false
---

A title block usually has four boxes for names and dates: drawn, checked, approved and issued. They look like administration. They are a record of who took responsibility for what, and when a part fails, a supplier disputes an order or a regulator asks questions, they are the first thing anyone reads. A name in the checked box says that a second person examined the drawing for faults before it was trusted to strangers.

This chapter sets out what that examination is for and how to plan it. It explains what each signature means, why the checker must be independent of the drafter, what a fault costs at each stage after the drawing leaves the office, and how to divide a check into passes that find the expensive faults first. It introduces the running case, the TA-200 belt tensioner set, and finds the first fault before a single dimension has been read.

## Four signatures, four promises

Drawing offices differ in their wording, but the four signatures usually mean this.

- **Drawn** names the person who prepared the drawing. They promise that it represents the design as they understood it, follows the office's standards and is complete as far as they know.
- **Checked** names the person who examined it independently. They promise that they looked for errors of content, presentation and consistency, against the design inputs and the office's standards, and that the faults they found have been corrected or recorded.
- **Approved** names the engineer responsible for the design, often the project engineer. They promise that the part, as drawn, does what it must: it fits, carries its loads, meets its specification.
- **Issued** names the person who released it for use, often a senior engineer or engineering manager, and fixes the date from which suppliers and the workshop may act on it.

The checker's promise is narrower than the approver's and in some ways harder. The approver judges the design; the checker judges whether the drawing says what the design needs, completely and unambiguously, so that it can be made and inspected without the drafter in the room. A checker who also questions the design, and often should, is doing the approver a favour, but the core of the job is the drawing.

```figure
type: layers
title: What each signature on the title block answers for
caption: Wording varies between offices. What matters is that each signature has a defined meaning written in the office's procedure.
- Issued | Released for use from this date; suppliers and the workshop may act on it
- Approved | The design, as drawn, meets its requirements
- *Checked | The drawing says what the design needs, completely and unambiguously
- Drawn | The drawing represents the design and follows the office standard
```

## Why the checker must be independent

The drafter is the worst-placed person to find the drafter's errors. They read what they meant rather than what they drew, they know where the missing dimension is because they know the part, and they do not see the ambiguity because there is none in their head. An independent checker reads the drawing as a supplier will: with only the sheet in front of them.

Independence does not require a large office. In a one- or two-person office, the same person may draw and check, provided the check is separated from the drawing by time and by method: a day's gap, a printed copy rather than the screen, and a written checklist followed in order. It is weaker than a second person and much better than nothing. The office should say on the drawing which it was, and its procedure should require a second person for parts whose failure would be costly or dangerous.

## What a missed fault costs

A fault on a drawing costs least where it starts. Corrected by the checker, it costs a few minutes of the drafter's time. Found after issue but before manufacture, it costs a revision, a reissue and a notice to the supplier. Found after parts are made, it costs the parts, the rework or the replacement, the delay and the investigation. Found in the field, it adds the cost of whatever the faulty part did there.

This is an illustration. The office in the running case costs its engineering time at A$95 an hour, excluding GST. For a fault in the arm drawing, it estimates:

- **found at checking**: a quarter of an hour to correct, **A$23.75**;
- **found after issue, before manufacture**: two hours to revise, reissue, notify the foundry and machine shop, and update the records, **A$190**;
- **found after a batch of 40 arms is machined**: 40 scrapped arms at A$62 each, A$2,480, plus six hours of investigation and reissue, A$570, a total of **A$3,050**;
- **found in the field**: the same, plus twelve hours of site work and a replacement visit costed at A$1,800, about **A$5,990**.

The ratios matter more than the amounts. In this case a fault found after manufacture costs about 128 times the same fault found by the checker. That ratio is the economic case for checking, and it also says where checking effort should go: to the faults that would reach manufacture unseen and be expensive when they did.

```figure
type: bars
title: Cost of one fault in the arm drawing, by where it is found
unit: A$
caption: This is an illustration, excluding GST. The step from issue to manufacture is the largest, because made parts are scrapped or reworked.
- Found at checking | 23.75
- Found after issue | 190
- *Found after 40 arms are machined | 3050
- Found in the field | 5990
```

## The running case: the TA-200 set

This is an illustration. The tensioner set reaches the checker as five sheets:

- **TA-200**, the assembly drawing, one sheet, with a parts list of seven items;
- **TA-201**, the arm, two sheets: sheet 1 with the casting's views and sheet 2 with the machining details;
- **TA-202**, the pivot pin, one sheet;
- **TA-203**, the bush, one sheet.

The four bought-out items, two washers, a retaining ring and the pulley with its bolt, are identified on the parts list by supplier and part number and have no drawings of their own.

The design inputs that the checker needs alongside the drawings are the design brief, which gives the belt load, the tensioner's travel and the required axial float of the arm on its pin, 0.1 to 0.5 mm; the office's drafting standard; and the supplier data for the bought-out items. A checker who checks only the drawings, without the inputs, can confirm that the set is consistent with itself but not that it is consistent with what was asked for. The checker therefore starts by gathering the inputs and noting their revisions on the check record, in the same way as the drawings' own revisions: a check against last month's design brief is a check against the wrong requirement. For TA-200, the brief is revision 2, the drafting standard is the office's current edition, and the supplier data sheets for the washers and retaining ring are the versions downloaded when the parts list was written.

## Plan the check in passes

A check that starts at the top left corner and reads every mark in order tends to spend its energy on the first sheet and skim the last. A check in passes, each looking for one kind of fault across the whole set, finds more for the same time. This book follows the order below, and each chapter covers one pass.

```figure
type: steps
title: Passes through a drawing set, in the order this book follows
caption: Each pass looks for one kind of fault across every sheet. The early passes are quick and catch faults that make later checking meaningless.
- Sheet and title block | Right revision, numbers, sheet references, units, projection, scale, material
- Views | Enough views to define every feature; sections where interiors matter
- Dimensions | Every feature sized and located once; no duplicates, no conflicts
- Limits and fits | Recalculate every fit from the limits on both drawings
- Stacks | Recalculate every assembly gap the design depends on
- Notes | Material, surface texture, treatments, coatings and their effect on size
- *The set | Assembly, parts list, balloons, used-on references and revisions agree
```

## Estimate the time

Checking takes time, and a check squeezed into the last half hour before issue is a signature, not a check. A simple estimate lets the time be planned.

This is an illustration. The office budgets two minutes per machined or functional feature, for its size, location, tolerance and finish, plus a quarter of an hour per sheet for the title block, notes and general presentation, and twenty minutes for the set as a whole. The arm has 14 functional features across its two sheets, so its check is budgeted at 14 × 2 + 2 × 15 = 58 minutes; the pin and bush have 6 and 5 features on one sheet each; the assembly sheet adds its own quarter hour. The whole set comes to (14 + 6 + 5) × 2 + 5 × 15 + 20 = **145 minutes**, about two and a half hours. Chapter 10 shows how the office later tested that budget against what its checks actually found. The budget is a planning figure, not a target to beat. A checker who finishes the arm in twenty minutes has either found a remarkably clean drawing or skipped passes, and the check record should show which.

## The error: checking the wrong revision

This is an illustration. The checker printed the TA-201 arm drawing from the shared folder and spent forty minutes on it, finding two faults. When the drafter came to correct them, both had already been fixed: the checker had printed revision A, a working version the drafter had superseded the day before, and the drafter's current file was revision B.

The fault was found only because the drafter noticed, but it is the kind of fault that wastes a check silently, or worse, lets a check of one revision be signed against another. The office changed two things. Checkers now check from a copy issued to them for checking, marked with its revision and date, rather than from whatever is in the folder. And the first line of every check is to confirm that the revision on every sheet matches the revision recorded for checking. For TA-201, that line would have found the mismatch in ten seconds.

## What checking is not

Three activities are often confused with checking, and confusing them weakens all three.

**Checking is not proofreading.** A proofread finds spelling errors, misaligned text and missing title block fields. Those matter, and the first pass catches them, but a drawing can be perfectly presented and still lack the dimension that locates the spring anchor hole. The expensive faults are in content, not presentation.

**Checking is not inspection.** An inspector compares a made part with the drawing; a checker compares the drawing with the design and with what a maker needs. A drawing that cannot be inspected, because a feature has no tolerance or no datum, is a checking fault, and Chapter 4 shows how to find it before a part exists.

**Checking is not redesign.** A checker who finds a weak design should say so, to the approver, with reasons. A checker who quietly changes the design while marking up the drawing has taken over a decision that belongs to someone else and has left no record of why the part changed.

## When the checker and the designer disagree

Most findings are agreed in a minute: a missing tolerance, a duplicated dimension, a wrong part number. Some are not. The checker thinks the bush will seize; the designer thinks the clearance is ample. The office needs a rule for that case before it arises.

A workable rule is that the checker records the finding with its reasoning, the drafter or designer records their response, and anything still disputed goes to the approver, who decides and signs the decision. The drawing is not issued with an open dispute. For the running case, the office's procedure puts disputed findings on a single page attached to the check record, so that the approver sees them together and nothing is lost in an email thread.

## Mark-ups that the drafter can act on

A check produces a marked-up copy, and the marks must be unambiguous. A common convention uses three colours: one to confirm items checked and correct, one for required corrections and one for comments or questions. Whatever the convention, it should be written in the office's procedure, and the marked-up copy should be kept with the drawing's record, so that anyone can see later what was checked and what was changed.

Each correction should say what is wrong and, where obvious, what it should become: "Ø16 bore: tolerance missing; design brief requires press fit for TA-203, see Chapter 6 calculation" rather than "?". A question mark sends the drafter to guess what the checker meant, which is the problem checking exists to solve.

## Exercise: is the check worth it?

The office's manager asks whether the arm's 58-minute check is worth its cost. Using the illustration's figures, the check costs 58 ÷ 60 × A$95 = A$91.83. Suppose that, without a check, a drawing like the arm has a one in five chance of carrying at least one fault that reaches manufacture, and that such a fault costs A$3,050. What is the expected cost of skipping the check, and what does the comparison say?

**Worked answer.** The expected cost of a fault reaching manufacture without a check is 0.2 × A$3,050 = **A$610** per drawing. The check costs **A$91.83**. Even if the check caught only half of such faults, it would save 0.5 × A$610 = A$305 on average, more than three times its cost.

The comparison also shows where the argument weakens. For a simple bought-in bracket made in twos, a fault after manufacture might cost A$150, and the expected saving would be smaller than the check. That is not a reason to skip checking; it is a reason to scale the check to the risk, with the full passes for the arm and a short check of the sheet, the views and the key dimensions for the bracket. Chapter 10 returns to deciding where checking effort pays.
