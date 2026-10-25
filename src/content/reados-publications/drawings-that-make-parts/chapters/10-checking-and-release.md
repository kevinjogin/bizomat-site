---
book: drawings-that-make-parts
chapterSlug: checking-and-release
order: 10
title: "Checking, revising and releasing a drawing"
description: "Check a drawing systematically before release, record revisions so every reader knows what changed, and keep superseded prints out of the workshop."
draft: false
---

A drawing becomes a contract when it is released. Before that moment, it is a draft that can be changed freely; after it, every change has a cost, because someone may already be quoting, buying material or cutting metal against it. Checking is how a business makes sure the drawing says what it means before that cost starts. Revision control is how it makes sure everyone is working from the same drawing afterwards.

This chapter draws the earlier chapters together into a checking routine, sets out what the title block and revision records must show, and follows the running case housing through its first release and a revision. Its error case is the most ordinary failure in any workshop: a part made from an old print.

## Who signs, and what each signature means

AS 1100.101 clause 2.5.9 requires spaces in the title block for signatures or initials and dates. It does not prescribe who signs. Most businesses use three roles, and the value of each lies in its independence from the others.

```figure
type: svg
title: From draft to released drawing
alt: From draft to released drawing. 1. Drawn: the drafter completes the drawing and runs a self-check against the checklist. 2. Checked: a second person checks the drawing independently against the checklist and the design intent. 3. Approved: the responsible engineer confirms the design meets its requirements. 4. Released: the drawing is issued at a revision, recorded in the register and sent to the people who need it
caption: This is an illustration of the running case business's process. A small business may combine roles, but the checker should not be the person who drew it.
viewbox: 0 0 640 338
body:
<path class="la draw" pathLength="1" d="M34 58.5V110.5"/>
<path class="la draw" pathLength="1" d="M34 138.5V190.5"/>
<path class="la draw" pathLength="1" d="M34 218.5V270.5"/>
<g class="kf-a kd1">
<rect class="bx" x="58" y="14" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="44.5" r="14"/>
<text class="txb" x="34" y="49.5" text-anchor="middle">1</text>
<text class="txb" x="74" y="36">Drawn</text>
<text class="tx" x="74" y="57">the drafter completes the drawing and runs a self-check against the checklist</text>
</g>
<g class="kf-a kd2">
<rect class="bxa" x="58" y="85" width="562" height="79" rx="6"/>
<circle class="fa" cx="34" cy="124.5" r="14"/>
<text class="txb" x="34" y="129.5" text-anchor="middle">2</text>
<text class="txb" x="74" y="107">Checked</text>
<text class="tx" x="74" y="128">a second person checks the drawing independently against the checklist and</text>
<text class="tx" x="74" y="146">the design intent</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="58" y="174" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="204.5" r="14"/>
<text class="txb" x="34" y="209.5" text-anchor="middle">3</text>
<text class="txb" x="74" y="196">Approved</text>
<text class="tx" x="74" y="217">the responsible engineer confirms the design meets its requirements</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="58" y="245" width="562" height="79" rx="6"/>
<circle class="bxi" cx="34" cy="284.5" r="14"/>
<text class="txb" x="34" y="289.5" text-anchor="middle">4</text>
<text class="txb" x="74" y="267">Released</text>
<text class="tx" x="74" y="288">the drawing is issued at a revision, recorded in the register and sent to the</text>
<text class="tx" x="74" y="306">people who need it</text>
</g>
```

The drafter's self-check finds most slips. The independent checker finds what the drafter cannot see because they know what they meant: a dimension that is obvious to its author and ambiguous to everyone else. The approver confirms that the part, as drawn, does its job. Signing a box without doing the check behind it is worse than leaving the box empty, because it tells readers a check happened. The signature is a statement of fact, and readers rely on it when they decide whether to query a drawing or trust it.

## A checking routine built from this book

The running case business's checklist follows the order of the chapters. Each item is a question a checker can answer by looking at the drawing.

```figure
type: svg
title: Release checklist for a detail drawing
alt: Release checklist for a detail drawing. Done: Drawing type, title, number and the standard it is prepared to are stated, Chapter 1. Done: Sheet size, scale and "OR AS SHOWN" where needed; DO NOT SCALE; units, Chapter 2. Done: Line group and lettering survive the usual reduction; coincident lines resolved, Chapter 3. Done: Projection marked by symbol and words; views and labels follow the rules, Chapter 4. Done: Sections labelled; same part, same hatching; fasteners and shafts unhatched, Chapter 5. Done: Every feature sized and located once; no chain plus toleranced overall, Chapter 6. Done: General tolerance note present; functional features have explicit tolerances, Chapter 7. Done: Surface texture on functional surfaces; general note; cut-off where not default, Chapter 8. Done: Threads by the right convention and fully designated; parts list complete, Chapter 9. Done: Revision recorded, changes located by grid reference, superseded prints withdrawn, Chapter 10
caption: This is an illustration. Each line refers to the chapter that explains it; the business adds lines whenever an error gets through.
viewbox: 0 0 640 876
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Drawing type, title, number and the standard it is prepared to are</text>
<text class="txb" x="64" y="51">stated</text>
<text class="tx" x="64" y="72">Chapter 1</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="98" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="115" r="11"/>
<path class="la draw" pathLength="1" d="M34 115l4 4 8-8"/>
<text class="txb" x="64" y="118">Sheet size, scale and "OR AS SHOWN" where needed; DO NOT SCALE;</text>
<text class="txb" x="64" y="137">units</text>
<text class="tx" x="64" y="158">Chapter 2</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="184" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="201" r="11"/>
<path class="la draw" pathLength="1" d="M34 201l4 4 8-8"/>
<text class="txb" x="64" y="204">Line group and lettering survive the usual reduction; coincident</text>
<text class="txb" x="64" y="223">lines resolved</text>
<text class="tx" x="64" y="244">Chapter 3</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="270" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="287" r="11"/>
<path class="la draw" pathLength="1" d="M34 287l4 4 8-8"/>
<text class="txb" x="64" y="290">Projection marked by symbol and words; views and labels follow the</text>
<text class="txb" x="64" y="309">rules</text>
<text class="tx" x="64" y="330">Chapter 4</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="20" y="356" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="373" r="11"/>
<path class="la draw" pathLength="1" d="M34 373l4 4 8-8"/>
<text class="txb" x="64" y="376">Sections labelled; same part, same hatching; fasteners and shafts</text>
<text class="txb" x="64" y="395">unhatched</text>
<text class="tx" x="64" y="416">Chapter 5</text>
</g>
<g class="kf-a kd6">
<rect class="bx" x="20" y="442" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="459" r="11"/>
<path class="la draw" pathLength="1" d="M34 459l4 4 8-8"/>
<text class="txb" x="64" y="462">Every feature sized and located once; no chain plus toleranced</text>
<text class="txb" x="64" y="481">overall</text>
<text class="tx" x="64" y="502">Chapter 6</text>
</g>
<g class="kf-a kd7">
<rect class="bx" x="20" y="528" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="545" r="11"/>
<path class="la draw" pathLength="1" d="M34 545l4 4 8-8"/>
<text class="txb" x="64" y="548">General tolerance note present; functional features have explicit</text>
<text class="txb" x="64" y="567">tolerances</text>
<text class="tx" x="64" y="588">Chapter 7</text>
</g>
<g class="kf-a kd8">
<rect class="bx" x="20" y="614" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="631" r="11"/>
<path class="la draw" pathLength="1" d="M34 631l4 4 8-8"/>
<text class="txb" x="64" y="634">Surface texture on functional surfaces; general note; cut-off</text>
<text class="txb" x="64" y="653">where not default</text>
<text class="tx" x="64" y="674">Chapter 8</text>
</g>
<g class="kf-a kd9">
<rect class="bx" x="20" y="700" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="717" r="11"/>
<path class="la draw" pathLength="1" d="M34 717l4 4 8-8"/>
<text class="txb" x="64" y="720">Threads by the right convention and fully designated; parts list</text>
<text class="txb" x="64" y="739">complete</text>
<text class="tx" x="64" y="760">Chapter 9</text>
</g>
<g class="kf-a kd10">
<rect class="bx" x="20" y="786" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="803" r="11"/>
<path class="la draw" pathLength="1" d="M34 803l4 4 8-8"/>
<text class="txb" x="64" y="806">Revision recorded, changes located by grid reference, superseded</text>
<text class="txb" x="64" y="825">prints withdrawn</text>
<text class="tx" x="64" y="846">Chapter 10</text>
</g>
```

A checklist is a floor, not a ceiling. It catches the faults the business has seen before. The checker's judgement is still needed for faults nobody has listed yet, which is why the business adds a line each time an error gets past the checklist into a supplier's workshop.

## Checking against the things around the drawing

A drawing can be internally perfect and still wrong, because it does not match the model, the calculations or the parts it mates with. The checker therefore also looks outward:

- **Against the model.** Every dimension on the drawing should agree with the model, and every feature on the model should appear on the drawing. Generated views make this easier but not automatic: a dimension typed over, or a feature suppressed in the drawing view, breaks the link.
- **Against the design calculations.** The bearing seat depth, the bore limits and the runout on the housing all came from calculations or the bearing maker's data. The checker confirms that the values on the drawing are the values in the design record.
- **Against mating parts.** The housing's four M6 tapped holes on a Ø78 pitch circle must line up with the end cap's four Ø7 clearance holes on the same pitch circle. This is an illustration. With M6 screws in 7 mm holes, there is 1 mm of clearance to share between the position errors of the tapped holes and the clearance holes. The designer allocated a position tolerance of Ø0.5 at MMC to each pattern, so that their sum, **0.5 + 0.5 = 1.0 mm**, does not exceed the **7 − 6 = 1 mm** of clearance. The checker confirmed that both drawings carry those tolerances and that both pitch circles are the same basic Ø78.

The interface check is the one most often skipped, because each drawing is checked on its own. Checking mating features side by side, with both drawings open, finds mismatches that neither drawing reveals alone.

## What checkers actually find

Over its first year using the checklist, the running case business kept a simple tally of what its checker found before release. The categories were unremarkable, and that is the point:

1. Missing or duplicated dimensions, usually after a late change.
2. Tolerances left to the general note on features that needed explicit limits.
3. Notes copied from an old template that referred to the wrong material or standard.
4. Section and view labels that did not match their cutting planes or references.
5. Interface mismatches with mating parts, such as hole patterns or register diameters.

None of these needs deep expertise to find. They need a second pair of eyes, a list and the discipline to work through it. The cost of finding each one before release is minutes; the cost after release, as the errors in this book show, ranges from a day's query to a batch of scrap.

## A one-person drawing office

Many small businesses have one designer who draws, checks and approves. Independence is then hard, but not impossible to approximate. The designer can check the drawing after a break of a day, on paper rather than on screen, working through the checklist line by line. A supplier or a colleague from another part of the business can be asked to read the drawing and say what they would make from it; a misunderstanding found that way is cheap. For critical parts, an external checker paid by the hour is often worth the cost. What does not work is checking a drawing immediately after finishing it, on the same screen, in the same frame of mind that produced it.

## What the drawing must record

Clause 2.5.10 recommends spaces to the left of the title block for standard information, including the issue number or letter and revision information. The detail is left to the organisation. A workable revision record includes, for each revision:

- the revision letter or number;
- a short description of what changed, specific enough that a reader can find it;
- the grid reference of each change, using the grid from Chapter 2;
- the date and the initials of the person who approved it.

The drawing number should appear near the corner of the title block, and the business also repeats the number and revision in the top left corner, so a folded print or a photograph of either corner identifies it.

Two dimensioning conventions from AS 1100.101 help after a revision. A dimension changed without changing the geometry, often a late correction, is underlined with a wide continuous line to show it is not to scale (clause 8.2.5.3). And auxiliary dimensions in parentheses are for information only and do not govern acceptance (clause 8.2.5.5), which matters when a revision changes the chain they summarise.

## The running case: release and revision B

This is an illustration. The housing drawing went through the following history:

```figure
type: svg
title: Revision history of the housing drawing
alt: Revision history of the housing drawing. Rev A: First release for prototypes, general tolerances only on the bore; drawn before the bearing data was final. Rev B: Bore limits 62.000 to 62.030 added; runout 0.02 to datum A added, grid C5 and D5; after the prototype failure in Chapter 7. Rev C: Overall length made auxiliary (77); lubrication hole angle note added, grid B3 and F2; after the queries in Chapters 4 and 6
caption: This is an illustration. Each revision records what changed, where, when and who approved it.
viewbox: 0 0 640 259
body:
<path class="ln draw" pathLength="1" d="M184 14V249"/>
<g class="kf-a kd1">
<circle class="bxi" cx="184" cy="22" r="8"/>
<text class="txa" x="166" y="27" text-anchor="end">Rev A</text>
<text class="txb" x="206" y="27">First release for prototypes</text>
<text class="tx" x="206" y="48">general tolerances only on the bore; drawn before the</text>
<text class="tx" x="206" y="66">bearing data was final</text>
</g>
<g class="kf-a kd2">
<circle class="fa pulse" cx="184" cy="103" r="8"/>
<text class="txa" x="166" y="108" text-anchor="end">Rev B</text>
<text class="txb" x="206" y="108">Bore limits 62.000 to 62.030 added; runout 0.02</text>
<text class="txb" x="206" y="127">to datum A added</text>
<text class="tx" x="206" y="148">grid C5 and D5; after the prototype failure in Chapter 7</text>
</g>
<g class="kf-a kd3">
<circle class="bxi" cx="184" cy="185" r="8"/>
<text class="txa" x="166" y="190" text-anchor="end">Rev C</text>
<text class="txb" x="206" y="190">Overall length made auxiliary (77); lubrication</text>
<text class="txb" x="206" y="209">hole angle note added</text>
<text class="tx" x="206" y="230">grid B3 and F2; after the queries in Chapters 4 and 6</text>
</g>
```

Each revision went through the same check, approval and release steps as the first issue. The business's drawing register, a simple list of drawing numbers, titles and current revisions, was updated each time, and every supplier holding a print of the housing was sent the new revision with a note of what had changed.

## The error: the old print in the job bag

When revision B was issued, the business emailed it to the machine shop and updated the purchase order. The shop's office printed it and put it in the job folder. But the job bag already on the shop floor held the prototype print at revision A, and the setter worked from the print in the bag. Eight housings were machined with the bore under the general tolerance, exactly the fault revision B existed to fix.

The business found the problem at receiving inspection. Its inspector checks three things before measuring anything: the drawing number and revision on the delivery docket, the revision on the shop's inspection report and the revision on the purchase order. The docket said revision B; the shop's inspection report, filled in from the job bag print, said revision A. That mismatch prompted a bore check, and the bores were outside the revision B limits.

The shop accepted responsibility and remade the parts. Both businesses changed their practice. The shop now stamps superseded prints "SUPERSEDED" and removes them from job bags when a new revision arrives, and records the revision on its traveller. The business now asks suppliers to confirm the revision in writing when they acknowledge an order, and its inspection report template requires the revision to be written by the person who measured the part, from the print they used.

## Why changes cost more after release

The cost of changing a drawing rises with each step it travels. Before release, a change costs the designer's time. After release to quote, it costs every supplier's estimating time and may change the price. After an order, it may scrap material already bought or cut. After parts are made, it may scrap the parts, and after they are fitted, it may mean recalling products. Every error in this book was found somewhere along that path, and the earlier it was found the cheaper it was.

That is the economic case for checking. A checker's hour is cheap compared with a supplier's day of queries or a batch of remade housings. It is also the case for releasing deliberately rather than sending drafts. A drawing sent "for information" before it is checked often becomes the drawing a supplier quotes from, and sometimes the one they make from. The running case business marks every unreleased print "PRELIMINARY: NOT FOR MANUFACTURE" across the title block, so that a draft cannot be mistaken for a contract.

When a change is needed after release, the same discipline applies in reverse. The change is checked as carefully as the original drawing, its effect on mating parts and on parts already made is assessed, and suppliers are told what changed, not just sent a new file. A revision that arrives without a description forces every supplier to compare two drawings line by line, and some will not.

## Releasing to suppliers

Release is more than sending a file. For each release, the business sends:

1. the drawing at its current revision, as a PDF, with the revision visible in the file name;
2. the model, if one is supplied, with the note on the drawing that states which governs (Chapter 1);
3. a short list of what changed since the previous revision, if any;
4. a request for written confirmation of the revision in the order acknowledgement.

The [drawing packages](/reados/collections/engineering-design-practice/drawing-packages-suppliers-can-quote-and-make-from/) chapter covers the commercial content of a request for quote. The point here is narrower: the supplier should never have to work out which drawing is current. The release tells them.

## Keeping the record

A released drawing is a record of what the business agreed to buy at a point in time. The business keeps every released revision, not just the current one, because a part made two years ago at revision A must be judged against revision A. Electronic files make this easy, provided superseded revisions are kept read-only and clearly marked, and the register shows which revision was current when. The register is also the first place to look when a part is questioned years later: it shows which revision applied to the order, who approved it and what changed between revisions, which is usually enough to tell whether the part, the drawing or the change process was at fault.

## Exercise: does this change need a new revision?

After revision C is released, three changes are proposed: (1) correcting a spelling mistake in the drawing title; (2) changing the general surface texture note from 6.3 to 3.2; and (3) moving a dimension to a clearer position without changing its value. Which need a new revision, and why?

**Worked answer.** **Change 2 needs a new revision.** It changes a requirement: every machined surface not otherwise marked must now be finer, which affects price, process and inspection. It must be checked, approved, recorded and released, and suppliers must be told.

**Change 3** does not change any requirement, but the drawing is different, and someone comparing two prints would see a dimension in a different place. Most businesses issue a new revision for any change to a released drawing, recording it as "dimension relocated, no change to requirements", because the alternative is two different-looking drawings with the same revision letter.

**Change 1** is the same in principle: a released drawing should not change without a revision. The business may batch cosmetic corrections into the next revision rather than issue one for a spelling mistake alone, but it must not edit the released file quietly. The rule that protects everyone is simple: if the drawing changes, the revision changes.
