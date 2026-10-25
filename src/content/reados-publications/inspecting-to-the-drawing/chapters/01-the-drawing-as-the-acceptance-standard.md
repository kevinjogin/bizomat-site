---
book: inspecting-to-the-drawing
chapterSlug: the-drawing-as-the-acceptance-standard
order: 1
title: "The drawing as the acceptance standard"
description: "Confirm which drawing, revision and documents govern a batch, read the title block and notes as acceptance requirements, and stop inspecting to the wrong print."
draft: false
---

Inspection asks one question of every part: does it conform? The question has no answer until something defines what conforming means. For a made part, that definition is the drawing, together with the documents the drawing and the order call up. An inspector who measures carefully against the wrong definition produces a confident wrong answer, which is worse than no answer at all.

So inspection begins before any instrument is picked up. The inspector establishes which drawing governs, at which revision, what else it calls up, and what the customer's order adds or overrides. Only then does measuring mean anything. This chapter sets up that first step for the running case and shows how often it is skipped.

## What "conforms" means

A part conforms when every requirement that applies to it is met. Requirements come from several places, and an inspection that looks only at the dimensions on the face of the drawing has covered part of the list.

- **The drawing itself**: dimensions, tolerances, geometric tolerances, surface texture symbols, notes, the general tolerance note and the projection method.
- **Documents the drawing calls up**: a material specification, a finish or coating specification, a heat treatment specification, a thread standard, a part marking standard.
- **The purchase order**: quantity, revision, delivery condition, packaging, certification required, first article requirements and any customer quality clauses.
- **The customer's supplier quality requirements**, where the order refers to them: how first articles are reported, which records are kept and for how long, and who may approve a deviation.

When these sources disagree, the order of precedence matters. Many customers state it in their terms; a common pattern puts the purchase order first, then the technical data package that includes the drawing, then supplementary specifications. Where no order of precedence is stated and a conflict appears, the inspector does not choose. The conflict goes back to the customer as a query, and the parts wait.

```figure
type: layers
title: Where the bracket's requirements come from
caption: An inspection that covers only the dimensions on the sheet has covered one layer of four.
- Purchase order | quantity 40, drawing SB-2041 revision C, material certificate and first article report required
- Drawing SB-2041 rev C | dimensions, limits, geometric tolerances, texture, notes, general tolerance ±0.1 mm
- *Documents called up by the drawing | anodise to the customer's finish specification, thread form M4-6H
- Customer quality requirements | record retention, first article format, who approves a concession
```

## Which drawing, which revision

A drawing number identifies a part design; the revision identifies one state of it. Two prints with the same number and different revision letters describe different parts, sometimes very different ones. The revision that governs is the one the order calls up. It is not the newest one in the drawing office, not the one on the machine, and not the one the inspector remembers.

The check is simple and must be written down:

1. Read the drawing number and revision on the purchase order.
2. Read the drawing number and revision in the title block of the print in the inspection folder.
3. Check the revision block on that print to see what the latest change was, and when.
4. If the customer provides a controlled document system or portal, confirm the revision there as well.
5. Record the revision on the inspection record before measuring anything.

If the order calls up revision B and the drawing office has since received revision C, that is not a reason to inspect to C. It is a reason to ask the customer which revision they want delivered, and to get the answer in writing, usually as an amended order.

### Prints in the workshop

Most wrong-revision inspections start with an uncontrolled copy. A print taped to a machine, a phone photograph of a drawing, a copy in last year's job folder: each was correct once. Shops prevent the problem in different ways. Some stamp each issued print "controlled copy" with an issue number and recall superseded copies; some issue no prints at all and display the current revision from a document system at the machine. Either works if it is followed. What does not work is relying on people to notice that the revision letter has changed.

## Reading the title block as an inspector

The title block tells a designer who drew the part. It tells an inspector what rules apply to every dimension on the sheet. Read it field by field, and turn each field into either a requirement or a check.

```figure
type: compare
title: Title block fields and what each means for inspection
cols: What it says on SB-2041 | What the inspector does with it
caption: Several fields in the title block are requirements in their own right and receive balloon numbers in Chapter 2.
- Drawing number and revision | SB-2041, revision C | Confirm against the order; record on every report
- Units | Dimensions in millimetres | Set instruments and software to millimetres
- Projection | Third angle | Confirm before interpreting views; see Chapter 4 of Drawings That Make Parts
- *General tolerance | Linear ±0.1, angular ±0°30′ unless stated | Applies to every untoleranced dimension; becomes limits in Chapter 3
- Material | Aluminium alloy 6061-T6 plate | Verify by certificate and traceability, Chapter 7
- Finish | Clear anodise to customer finish specification | Verify by certificate and coating check, Chapter 7
- Scale | 1:1 | Never measure the print; scale is information only
- Sheet | 1 of 1 | Confirm there are no further sheets or a parts list
```

Two fields deserve emphasis. The general tolerance note is the most important line on most detail drawings, because it governs every dimension that carries no tolerance of its own. On the bracket that is most of the dimensions. An inspector who skips it either accepts everything within a vague "close enough" or rejects parts against an imagined tolerance that the drawing never set.

The material and finish fields are requirements, not descriptions. A bracket machined from the wrong alloy can measure perfectly and still be scrap. The inspector cannot verify an alloy with a caliper, so these fields send the inspector to documents instead: the material certificate, the finisher's certificate and the traceability records that link them to this batch.

## Reading the notes

Notes are the most frequently missed requirements on a drawing because they look like commentary. They are not. A note on a released drawing is as binding as a dimension. The bracket drawing carries four:

1. All dimensions apply after anodising.
2. Break all sharp edges 0.2 to 0.5 mm.
3. Mark part number and revision, SB-2041-C, and batch number on the underside, using characters 2 mm high.
4. Surface texture Ra 3.2 µm unless otherwise stated.

Each note is a requirement and each needs a method of verification. Note 1 changes when and how dimensions are checked, and the shop will meet it in Chapter 7 in an expensive way. Note 2 needs a check of edges, often by eye and fingertip against a sample, but it has numeric limits and those limits can be gauged when it matters. Note 3 is checked by reading the marking. Note 4 is a general surface texture requirement that applies to every surface without its own symbol.

## Drawing, model and the order

Many shops now receive a 3D model with the drawing, and machine from the model. That raises a question the inspector must settle before the first measurement: which one governs? The answer is whatever the order or the drawing says. Many drawings state that the model is supplied for reference and the drawing governs; some customers work the other way, with a model carrying the tolerances and a reduced drawing. If neither document says, ask.

The distinction matters most for features the drawing does not dimension. If the bracket's inside corner is modelled with a 3 mm radius but the drawing shows the corner without a dimension, the general tolerance cannot apply to a dimension that is not there. The drawing may say "fillets R3 unless stated", or the model may govern, or the corner may be uncontrolled. The inspector's job is to find out which, not to decide.

The [drawing as a contract](/reados/publications/drawings-that-make-parts/the-drawing-as-a-contract/) chapter of *Drawings That Make Parts* covers the same question from the designer's side.

## The running case: setting up the inspection folder

This is an illustration. The shop's inspector opens the job for the 40 brackets and builds an inspection folder before the first part is cut. It holds the purchase order, a controlled print of SB-2041 revision C, the customer's finish specification, the customer's first article report format and a blank inspection record.

The inspector reads the order and notes three requirements that are not on the drawing: a certificate of conformance with each delivery, a material certificate traceable to the plate used, and a first article inspection report to be approved by the customer before the remaining 39 brackets are delivered. The inspector reads the title block, records the revision and the general tolerance note on the inspection record, and lists the four notes as requirements to be ballooned.

Then the inspector checks the revision block. Revision C, dated three weeks before the order, changed the sensor bore from Ø10.00 ±0.02 to explicit limits of Ø10.000 to Ø10.015 and added the perpendicularity tolerance on the bore. That change matters: the tightened bore will need different instruments from the ones used on the earlier revision.

```figure
type: checklist
title: Inspection folder check before the first part
caption: Each item is recorded on the inspection record, not just confirmed in the inspector's head.
- Order and drawing revision agree | SB-2041 revision C on both
- Controlled print in folder | stamped controlled copy, issue 1
- Revision block read | revision C tightened the bore and added perpendicularity
- Called-up documents present | customer finish specification on file
- Order requirements listed | certificate of conformance, material certificate, first article report
- ? Model status | customer supplied a STEP model; drawing does not say which governs
```

The open item is the model. The order does not mention it and the drawing does not say whether it is for reference. The inspector sends a one-line query to the customer: "SB-2041 rev C supplied with STEP model; please confirm the drawing governs and the model is for reference." The customer's answer, received the next day, confirms the drawing governs. The query and answer go into the folder.

## The error: inspecting to the old print

This is an illustration. Six months earlier, the same shop made 20 brackets to revision B. A set-up sheet from that job, with a revision B print stapled to it, was still in the machine's drawer. The machinist used it to set the bore boring bar to the middle of the old tolerance, Ø10.000, and the first part came off at Ø10.003.

The in-process check, done at the machine with the old print, read Ø10.003 against Ø10.00 ±0.02 and passed it. Revision C requires Ø10.000 to Ø10.015, so Ø10.003 happens to conform; the error was invisible on this part. It came to light only when the inspector, building the first article record, compared the set-up sheet's revision with the folder's revision C print and found the mismatch.

Nothing was scrapped, but the shop had been inspecting to the wrong standard and had passed a part for the wrong reason. Had the machinist set the bar at Ø9.990, which revision B allowed, the part would have been accepted at the machine and rejected later at greater cost. The correction was procedural: superseded prints were removed from every drawer, set-up sheets were reissued with the revision printed in their header, and the in-process check sheet was changed to carry the revision letter alongside each result.

## Inspection is a record, not an opinion

An inspection result is only as useful as the record that carries it. A tick on a print tells the next reader that someone was satisfied; it does not say against which revision, with which instrument, by whom or when. Months later, when a customer returns a bracket that will not take its sensor, that tick cannot answer a single question.

A useful inspection record names the drawing number and revision, the part or batch it covers, each requirement checked, the method or instrument used with its identification number, the result as a number wherever the requirement is numeric, the decision, the inspector and the date. That sounds like paperwork, and on a one-off part it can be kept short. On a batch going to a customer who asked for a first article report, it is the product as much as the brackets are.

The record also separates two roles that a small shop tends to merge. The person who makes the part has an interest in it passing. The person who inspects it should have none, or at least should be checking against a written standard rather than a memory of what was intended. In a two-person shop the same person may do both jobs; the written requirement list, built in the next chapter, is what keeps the second job honest.

## When to stop and ask

An inspector who meets an ambiguity has three choices: guess, decide, or ask. Only the third is correct. Guessing produces inconsistent results, and deciding gives the inspector design authority they do not have. Common reasons to stop and ask:

- The order and the drawing call up different revisions.
- A note refers to a specification the shop does not hold.
- A feature is shown but not dimensioned, and no note or model covers it.
- Two dimensions conflict, or a chain of toleranced dimensions over-defines a feature.
- The projection symbol is missing and the views could be read either way.

Write the query so it can be answered in one line, quote the drawing number, revision and zone or view, and keep the answer with the job. A query costs a day; a batch made to a guess can cost the order.

## Exercise: build the requirement sources

A customer orders 25 shaft collars to drawing SC-118 revision D. The order also says "Material certificate required. Parts to be zinc plated to customer specification CS-40. Supplier quality manual SQM-2 applies." The drawing in the shop's file is revision D, but its title block finish field reads "Black oxide".

List the sources of requirements, identify the conflict and state what the inspector should do before any part is made.

**Answer.** The sources are the purchase order (quantity, revision D, material certificate, zinc plate to CS-40), drawing SC-118 revision D (dimensions, tolerances, notes, black oxide finish), the documents called up (CS-40, and any material specification on the drawing), and SQM-2 for reporting and approvals. The conflict is the finish: the order says zinc plate and the drawing says black oxide. The inspector should not decide which is right, even if the order normally takes precedence, because the difference may reflect a design change not yet released. The correct action is to raise a written query quoting SC-118 revision D, the finish field and the order line, ask which finish is required, and hold manufacture of the finish until the answer is in writing. The machining can proceed if both finishes need the same machined dimensions, but only if the query confirms there is no dimensional allowance difference between the two finishes.
