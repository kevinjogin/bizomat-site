---
book: exact-words-for-real-parts
chapterSlug: the-hidden-claims-in-the
order: 2
title: "The hidden claims in \"the\": definite descriptions in drawings, set-up sheets and records"
description: "Use Russell's theory of descriptions to test every 'the' in a drawing, procedure or record for existence and uniqueness, and to read negative statements in the scope that was meant."
draft: true
---

The analysis in Chapter 1 pointed at the second set-up. The next step is to read the documents that governed it: the set-up sheet the machinist followed, the inspection plan, the drawing and the certificate. The quality lead reads them twice and finds nothing obviously wrong. Every instruction is clear, every requirement has a number, every signature is in place.

The trouble is in a small word that appears on almost every line. The set-up sheet says to clock the fixture along *the* reference edge. The inspection plan refers to *the* first-off report. The certificate says the parts conform to *the* current revision. Each "the" quietly claims that exactly one thing answers to the description. When that claim fails, an instruction that reads perfectly can send two careful people in different directions. Russell's theory of descriptions explains why, and gives a test that can be applied line by line.

## Russell's analysis of "the"

In "On Denoting", published in the journal *Mind* in 1905, Russell argued that a phrase of the form "the so-and-so" does not simply name an object. A sentence such as "the F is G" makes three claims at once:

1. there is at least one F;
2. there is at most one F;
3. whatever is F is G.

The sentence is true only if all three hold. If nothing is F, the sentence is false, not meaningless. If more than one thing is F, the sentence is also false, because the second claim fails. Russell's famous example concerned a present King of France, at a time when France had no king. Under his analysis, a sentence about the present King of France is not about anyone; it is a false claim that someone uniquely fits the description.

The engineering value of this is direct. Every definite description in a working document carries an existence claim and a uniqueness claim that nobody writes down. The writer knows which object is meant, so the claims seem too obvious to state. The reader may be in a different place, at a different time, looking at a different fixture, and the claims may fail without anyone noticing.

```figure
type: steps
title: What "the reference edge of the fixture is square to X" claims
caption: Russell's three clauses, applied to one line of a set-up sheet. The instruction can fail at any of them, and only the third is about squareness.
- Existence | the fixture has at least one reference edge
- * Uniqueness | the fixture has at most one reference edge
- Predication | that edge is square to the machine's X axis within the stated limit
```

## Where the bracket fault began

This is an illustration. The workshop drills the four clearance holes in a second operation. The bracket sits on a fixture plate with a spigot in its bore and a diamond pin in its dowel hole, so the bracket is located by datums B and C. The fixture plate is bolted to the machine table. Before running, the machinist sets the plate square to the machine's X axis by running a dial indicator along an edge, then probes the spigot to set the X and Y zero.

The set-up sheet says: "Clock the fixture along the reference edge to within 0.01 mm over its length." When the fixture was made, one long edge was ground as the reference. The opposite edge was left as sawn and milled. Nobody marked either one, because the toolmaker who made the plate, and the machinist who first used it, both knew which edge was meant.

For brackets 1 to 30 that machinist set up the fixture. Between brackets 30 and 31 the plate was removed for another job. When it was refitted, a different machinist read the sheet, picked the edge nearest the operator's side, clocked it to within 0.01 mm, and ran the remaining 30 brackets. That edge was the milled one, and it was 0.5° off parallel to the ground edge.

Every step the second machinist took was correct for the instruction as written. The instruction itself was false under Russell's analysis, because the fixture had two edges that a reasonable reader could call "the reference edge". The uniqueness clause failed, and the predication was applied to the wrong object.

```figure
type: formula
title: How far a 0.5° rotation moves a hole on the pitch circle
formula: s = r × θ
caption: This is an illustration. The rotation is about the spigot, because the machinist set the zero on the spigot after clocking the wrong edge. The tangential shift exceeds the 0.3 mm radial allowance from Chapter 1.
- s | tangential shift of a hole centre, mm
- r | pitch circle radius, mm
- θ | rotation, radians
step: θ = 0.5° × π ÷ 180 = 0.008727 rad
step: s = 45 × 0.008727 = 0.393 mm at each hole
step: As a position error, 2 × 0.393 = 0.785 mm diameter, against Ø0.3 mm plus bonus allowed
```

## Testing every description in a document

Once the pattern is visible it can be checked systematically. The quality lead goes through the four documents that governed the job and marks every definite description: every phrase beginning with "the" or "this", every possessive that picks out one thing ("the operator's side"), and every proper name for a document or feature. For each, the test asks two questions: is there at least one, and is there at most one, at the time and place the document will be read?

This is an illustration. The four documents contained 32 definite descriptions: 14 in the set-up sheet, 9 in the inspection plan, 6 in the drawing notes and 3 in the certificate. Twenty-eight passed both tests. Four failed one.

```figure
type: checklist
title: Definite descriptions that failed in the CB-12 documents
caption: This is an illustration. Twenty-eight of 32 descriptions passed. The four that failed are listed with the clause that failed; open items are marked for correction.
- ? Set-up sheet: "the reference edge" | uniqueness fails: two long edges, neither marked
- ? Set-up sheet: "the operator's side" | uniqueness fails: the machine has doors on two sides
- ? Inspection plan: "the first-off report" for set-up 2 | existence fails: no first-off was run after the refit
- ? Certificate: "the current revision" | depends on when it is read: revision B at signing, revision C a week later
- x Drawing: "the datum C hole" | passes: one Ø6 H7 hole on the X axis
```

The first failure caused the fault. The second could have caused a similar one. The third explains why the fault was not caught, and Chapter 3 follows it further. The fourth is subtler. A definite description can pick out exactly one thing today and a different thing next week. "The current revision" was revision B when the certificate was signed. A week later the customer issued revision C, which added a cable-clip hole. Anyone reading the certificate after that would take it to claim conformance to a drawing the brackets were never made to. The correction is to replace descriptions that change their reference over time with names that do not: "drawing CB-12 revision B".

## Two readings of a negative statement

Russell's analysis has a second consequence that matters as much in records as in instructions. When a sentence containing a description is negated, the negation can apply in two places. He called them the primary and secondary occurrence of the description. Today the distinction is usually called scope.

When the customer asked whether the second set-up had been checked, the workshop's quality lead, still at the start of the investigation, replied in writing: "The first-off report for set-up 2 does not show any failure." The sentence is true. It is also seriously misleading, and Russell's analysis shows exactly how.

```figure
type: compare
title: Two readings of "The first-off report for set-up 2 does not show any failure"
cols: What it claims | True in this case?
caption: This is an illustration. The writer meant the narrow reading; the customer heard the wide one. Only the narrow reading is true, because no such report exists.
- Wide scope for the description | there is exactly one first-off report for set-up 2, and it shows no failure | no: there is no such report
- * Narrow scope for the description | it is not the case that exactly one such report exists and shows a failure | yes: trivially, because none exists
```

On the wide reading, the description comes first: there is one report, and it is clean. That reading is false, because the existence clause fails. On the narrow reading, the negation comes first: it is not true that there is a report showing a failure. That reading is true, but only because there is no report at all. A reader cannot tell which reading is meant from the sentence alone, and almost every reader assumes the first.

Statements of this form are common in quality records: "the calibration certificate does not show any adjustment", "the weld map does not show any repairs", "the deviation log does not list this part". Each is true if the certificate, map or log does not exist. The correction is to state existence separately and first: "A first-off report for set-up 2 was not produced. No measurement of hole position on set-up 2 was made before the batch was released." Those two sentences are less comfortable to write, and they cannot be misread.

## Failure: correcting the wrong clause

The workshop's first corrective action showed how easily the analysis can be applied halfway. The owner rewrote the set-up sheet to read: "Clock the fixture along the reference edge to within 0.005 mm over its length." The tolerance was halved. The definite description was untouched.

The rewrite addressed the predication clause, which had never failed. The second machinist had clocked the edge to within 0.01 mm, as instructed. The failure was in the uniqueness clause. A tighter tolerance on the wrong edge produces the same 0.5° error, now held to a finer limit.

Detection was simple once the three clauses were written out beside the new instruction: existence passed, uniqueness still failed, predication had changed. The correction made the description unique in the world, not just on paper:

1. The ground edge was engraved "REF" at both ends, and the milled edge was relieved by 2 mm so that an indicator cannot run along it.
2. The sheet was rewritten: "Clock the fixture along the edge engraved REF to within 0.01 mm over 200 mm."
3. A check was added after clocking: probe the dowel pin and the spigot, and confirm that the line between them lies within 0.02° of the X axis.

The third step is the useful one. It checks the outcome the clocking is supposed to produce, which catches a failure of any of the three clauses. It also turns the instruction into something that leaves evidence: the probed angle can be written on the set-up record.

## Descriptions in drawings and models

Drawings are full of definite descriptions that rely on the reader seeing the same picture as the writer: "the large hole", "the top face", "the edge shown". On a single, stable drawing most of them are unique. They start to fail when a part is revised, when a family of parts shares one drawing, or when a note is copied from one drawing to another. A note that said "the 6 mm hole" on revision B, which had one Ø6 hole, became ambiguous on revision C, which added a Ø6 cable-clip hole. Datum labels exist precisely to replace descriptions with names: "datum C" picks out one feature on every revision, because the label travels with the feature.

The same habit carries into 3D models and model-based definitions. A note attached to a face in a model is unique as long as the attachment survives. When a feature is rebuilt, the attachment may jump to a neighbouring face, and the note silently becomes a description of something else. Checking that annotations still point where they should after a rebuild is the modelling version of Russell's uniqueness test.

## Names that behave like descriptions

Russell went further than descriptions beginning with "the". He argued that most ordinary names work like abbreviated descriptions: to use a name, a speaker relies on some description that picks out its bearer. In engineering the point has a practical edge. A part number looks like a name, but it is only as good as the description behind it. "CB-12" picks out one design because a drawing, at a revision, says what CB-12 is. When the drawing has two revisions in circulation, "CB-12" alone no longer picks out one design; it has become a description with a failed uniqueness clause.

The same applies to job numbers, fixture numbers and programme names. During the investigation the workshop found that its machine controller held two programmes called CB12-OP2: the original, and a copy saved during the refit with a feed change. Both were named identically in different folders. The name looked unique on the set-up sheet. On the controller it was not, and nobody could say with confidence which had run brackets 31 to 60. As it turned out, both contained the same hole coordinates, so the programme was not the cause. But the investigation lost half a day establishing that, and it could easily have been otherwise.

## Descriptions at a handover

The refit happened at a shift change, and the handover was verbal: "The CB-12 fixture's back on; it's set up the same as before." Every part of that sentence relies on a description. "The CB-12 fixture" was unique. "The same as before" was not: it refers to a set-up the incoming machinist never saw and whose critical step, the choice of edge, was never stated. A handover that relies on "the same as before" transfers the writer's knowledge only if the reader already has it. The correction the workshop adopted is a written handover line for every set-up change, naming the edge, the probed angle and the first-off report number, so that the incoming person receives names rather than descriptions.

## Writing descriptions that survive

Most definite descriptions are harmless. The goal is not to remove them from documents but to make sure the ones that matter carry their existence and uniqueness with them. A few habits cover most cases:

| Habit | Before | After |
| --- | --- | --- |
| Name, do not describe, anything that drives a measurement | the reference edge | the edge engraved REF |
| Fix descriptions that change with time | the current revision | revision B |
| State existence before asserting about a record | the report shows no failure | a report was produced; it shows no failure |
| Use datums and labels on drawings | the large hole | datum B |
| Check the outcome, not only the step | clock the edge | clock, then probe pin and spigot and record the angle |

## Exercise: test three sentences from the customer's acceptance procedure

The customer's incoming inspection procedure contains these sentences. For each, write out Russell's three clauses, say which could fail and how, and rewrite the sentence so that it cannot.

1. "Check the brackets against the approved sample."
2. "The supplier's inspection record does not show any nonconformance."
3. "Fit the bracket to the module on the test stand."

**Worked answer.** (1) There is at least one approved sample; there is at most one; the brackets match it. Existence can fail if no sample was ever approved for CB-12, and uniqueness can fail if samples were approved for both revision B and revision C. Rewrite: "Check the brackets against approved sample CB-12-B-01, held in the quality cabinet." (2) There is at least one supplier inspection record for the delivery; at most one; it shows no nonconformance. The negative statement is open to the narrow reading, in which it is true because no record was received. Rewrite: "A supplier inspection record was received for this delivery and filed under the delivery number. It lists no nonconformance." (3) There is at least one module on the test stand; at most one; the bracket fits it. Uniqueness fails if the stand holds two modules, which on a six-camera line is likely. Rewrite: "Fit the bracket to module position 1 on test stand TS-2." In each case the rewrite either names the object or states its existence first, so a reader cannot pick a different object or take a missing record as a clean one.
