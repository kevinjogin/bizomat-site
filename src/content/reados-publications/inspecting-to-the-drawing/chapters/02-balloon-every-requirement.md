---
book: inspecting-to-the-drawing
chapterSlug: balloon-every-requirement
order: 2
title: "Balloon every requirement"
description: "Number every dimension, tolerance, note, finish and repeated feature on a drawing so each has one line in the inspection record and nothing escapes inspection."
draft: false
---

A drawing contains more requirements than it appears to. Dimensions are obvious; the general tolerance note, the surface texture note, the material field, the edge-break note and the second instance of a repeated hole are not. An inspection that measures the obvious and skips the rest can pass a part that fails in service.

Ballooning is the discipline that prevents this. Every requirement on the drawing, and in the documents it calls up, receives a unique number, written in a circle beside it on a copy of the drawing. Each number then becomes one line in the inspection record. The ballooned drawing and the requirement list together answer the question every customer eventually asks: did you check everything?

## What a balloon is

A balloon is an identifier. It does not change the requirement or add to it; it labels it so that the requirement can be referred to without ambiguity. "Balloon 9 measured 10.013" is clear. "The bore was fine" is not.

Balloons are added to a copy of the released drawing, never to the master. The ballooned copy is an inspection document owned by the inspection function, and it records which revision it was made from. When the drawing changes, the ballooned copy is redone or formally updated, because a balloon number that points to a feature which no longer exists is worse than none.

Many customers who require first article reports specify how balloons are used. A published supplier guide to the aerospace first article standard, for example, describes a ballooned document as an aid that numbers every design characteristic, including those in notes, and requires each characteristic to appear on the report under the same number. Whether or not a customer demands it, the same practice works for any batch.

## What gets a balloon

The test is simple: if the part could fail to meet it, it gets a balloon. That includes:

- **Every dimension with its own tolerance**, including those with explicit limits.
- **Every dimension governed by the general tolerance note.** These are requirements even though no tolerance is written beside them.
- **Every geometric tolerance**, including flatness, perpendicularity and position. Each feature control frame gets its own balloon.
- **Every surface texture symbol**, and any general surface texture note.
- **Every note**, and every separate requirement within a note. A note that says "break edges 0.2 to 0.5 and deburr all holes" contains two requirements.
- **Material, finish and treatment requirements** in the title block or notes.
- **Threads**, with the thread size and class, and the thread depth if stated.
- **Marking, identification and packaging requirements** stated on the drawing.

Basic dimensions are a special case. A basic dimension has no tolerance of its own; it locates the true position from which a geometric tolerance is measured. Some customers balloon basic dimensions separately and expect the measured value recorded; others treat them as part of the position balloon. Follow the customer's instruction, and if there is none, record the measured coordinates on the position line so the result can be traced.

## Repeated features

A note such as "2× Ø6.6" describes two holes. Both must be inspected, and the record must show which result belongs to which hole. The usual practice is to give the requirement one balloon number and each instance a suffix: 7.1 and 7.2. The suffixes need a defined order, written on the ballooned drawing, such as "instance 1 nearest datum C".

Without a defined order, two inspectors will number the same holes differently, and a failed result cannot be traced back to the physical hole. When a customer later asks which hole was out of position, "one of them" is not an answer.

## The running case: ballooning SB-2041

This is an illustration. The shop's inspector takes a copy of SB-2041 revision C and balloons it. The figure shows the front view of the bracket with the balloons that fall in that view; the plan view, side view and notes carry the rest.

```figure
type: svg
title: Front view of the bracket with selected balloons
alt: Front view of the L-shaped sensor bracket. The base is 80 mm long and 8 mm thick; the upright at the left end is 8 mm thick and 45 mm high. Hidden lines show the sensor bore through the upright, the two mounting holes through the base and the two M4 tapped holes in the top of the upright. Balloons mark the length 80 (1), base thickness 8 (3), overall height 45 (4), upright thickness 8 (5), flatness 0.05 on the underside (6), bore diameter limits Ø10.000 to Ø10.015 (9), bore height 30 ±0.02 from datum A (10), perpendicularity Ø0.02 to datum C (12), thread M4-6H and depth (14 and 15) and inside radius R3 (18).
caption: This is an illustration. Balloons are added to an inspection copy of the drawing, never to the master, and the copy records the revision it was made from.
viewbox: 0 0 640 300
- Plan view and side view | carry balloons 2, 7, 8, 11, 13, 16 and 17
- Title block and notes | carry balloons 19 to 24
body:
<g class="kf-a kd1">
<path class="li" d="M150 240H390V216H183A9 9 0 0 1 174 207V105H150Z"/>
<path class="ln dsh" d="M150 135H174M150 165H174"/>
<path class="cl" d="M142 150H182"/>
<path class="ln dsh" d="M230 216V240M250 216V240M335 216V240M355 216V240"/>
<path class="cl" d="M240 208V248M345 208V248"/>
<path class="ln dsh" d="M157 105V129M167 105V129"/>
</g>
<g class="kf-a kd2">
<path class="lf" d="M150 244V268M390 244V268M150 262H390"/>
<text class="tx" x="270" y="257" text-anchor="middle">80</text>
<circle class="bxa" cx="270" cy="284" r="11"/><text class="txs" x="270" y="288" text-anchor="middle">1</text>
<path class="lf" d="M394 216H416M394 240H416M410 216V240"/>
<text class="tx" x="420" y="233">8</text>
<circle class="bxa" cx="446" cy="229" r="11"/><text class="txs" x="446" y="233" text-anchor="middle">3</text>
<path class="lf" d="M146 105H104M146 240H104M110 105V240"/>
<text class="tx" x="104" y="182" text-anchor="end">45</text>
<circle class="bxa" cx="88" cy="150" r="11"/><text class="txs" x="88" y="154" text-anchor="middle">4</text>
<path class="lf" d="M150 101V82M174 101V82M150 88H174"/>
<text class="tx" x="162" y="78" text-anchor="middle">8</text>
<circle class="bxa" cx="194" cy="80" r="11"/><text class="txs" x="194" y="84" text-anchor="middle">5</text>
</g>
<g class="kf-a kd3">
<path class="lf" d="M142 150H124M130 150V240"/>
<text class="tx" x="124" y="212" text-anchor="end">30 ±0.02</text>
<circle class="bxa" cx="52" cy="207" r="11"/><text class="txs" x="52" y="211" text-anchor="middle">10</text>
<path class="lf" d="M196 147L172 150"/>
<text class="tx" x="200" y="152">Ø10.000 / Ø10.015</text>
<circle class="bxa" cx="344" cy="147" r="11"/><text class="txs" x="344" y="151" text-anchor="middle">9</text>
<text class="tx" x="200" y="174">⊥ Ø0.02 C</text>
<circle class="bxa" cx="290" cy="169" r="11"/><text class="txs" x="290" y="173" text-anchor="middle">12</text>
<path class="lf" d="M196 112L168 110"/>
<text class="tx" x="200" y="116">2× M4-6H, 8 deep</text>
<circle class="bxa" cx="340" cy="111" r="11"/><text class="txs" x="340" y="115" text-anchor="middle">14</text>
<circle class="bxa" cx="366" cy="111" r="11"/><text class="txs" x="366" y="115" text-anchor="middle">15</text>
<path class="lf" d="M196 202L181 211"/>
<text class="tx" x="200" y="205">R3</text>
<circle class="bxa" cx="232" cy="200" r="11"/><text class="txs" x="232" y="204" text-anchor="middle">18</text>
<path class="lf" d="M380 240L420 270"/>
<text class="tx" x="426" y="275">Flatness 0.05, datum A</text>
<circle class="bxa" cx="606" cy="270" r="11"/><text class="txs" x="606" y="274" text-anchor="middle">6</text>
</g>
```

The complete list follows. It is the backbone of every later chapter: Chapter 3 adds limits to each line, Chapters 4 to 7 add a method, and Chapter 8 adds the results.

| Balloon | Requirement | Source on the drawing |
|---|---|---|
| 1 | Overall length 80 | Front view, general tolerance |
| 2 | Base width 50 | Plan view, general tolerance |
| 3 | Base thickness 8 | Front view, general tolerance |
| 4 | Overall height 45 | Front view, general tolerance |
| 5 | Upright thickness 8 | Front view, general tolerance |
| 6 | Flatness 0.05 on datum A | Front view |
| 7.1, 7.2 | Mounting holes Ø6.6 +0.2/0 | Plan view, 2× |
| 8.1, 8.2 | Position Ø0.2 at MMC to A, B, C | Plan view, 2× |
| 9 | Bore Ø10.000 to Ø10.015 | Front and side views |
| 10 | Bore height 30 ±0.02 from A | Front view |
| 11 | Bore 25 ±0.05 from B | Side view |
| 12 | Bore perpendicularity Ø0.02 to C | Front view |
| 13 | Bore texture Ra 0.8 | Side view |
| 14.1, 14.2 | Thread M4-6H | Front view, 2× |
| 15.1, 15.2 | Full thread depth 8 minimum | Front view, 2× |
| 16 | M4 hole spacing 20 | Plan view, general tolerance |
| 17 | First M4 hole 15 from B | Plan view, general tolerance |
| 18 | Inside radius R3 | Front view, general tolerance |
| 19 | Material 6061-T6 plate | Title block |
| 20 | Clear anodise to customer specification | Title block |
| 21 | Dimensions apply after anodising | Note 1 |
| 22 | Break sharp edges 0.2 to 0.5 | Note 2 |
| 23 | Marking SB-2041-C and batch | Note 3 |
| 24 | Ra 3.2 unless stated | Note 4 |

Instances are numbered from datum C: hole 7.1 and 8.1 are the mounting hole nearer the upright, at 30 mm from C; 7.2 and 8.2 the hole at 65 mm. Threads 14.1 and 15.1 are the M4 hole nearer datum B.

```figure
type: stats
title: The size of the bracket's inspection
caption: This is an illustration. The count of results, not the count of balloons, decides how long a full inspection takes.
- 24 | balloon numbers | one per requirement
- 4 | repeated requirements | holes, positions, threads and depths, each 2×
- *28 | results per part | 24 balloons plus 4 extra instances
- 6 | from title block and notes | balloons 19 to 24, easily missed
```

## A procedure that does not miss things

Inspectors who balloon by eye, scanning the drawing for things that look like requirements, reliably miss some. A fixed order works better because it forces attention onto every part of the sheet.

```figure
type: steps
title: Ballooning a drawing in a fixed order
caption: Working view by view and then through the title block and notes means a missed requirement is a missed step, which a checker can see.
- Record the revision | on the ballooned copy, before the first balloon
- Work view by view | left to right, top to bottom, each dimension and frame in turn
- Number repeated features | one balloon, suffixed instances in a written order
- Work through the title block | general tolerance, material, finish, texture, projection
- Work through every note | one balloon per separate requirement within a note
- Add requirements from called-up documents | coating thickness, marking method, thread class
- *Reconcile the count | every balloon appears once in the requirement list, and no line lacks a balloon
```

The last step is the one most often skipped. The inspector counts the balloons on the drawing, counts the lines in the list and checks that the numbers agree. On the bracket, 24 balloons must produce 24 numbered lines, four of which split into two instances.

## The error: the note nobody ballooned

This is an illustration. On the shop's first attempt, a trainee inspector ballooned SB-2041 working only from the views. The list had 18 lines, ending at the inside radius. The title block and notes were treated as background.

The omission surfaced in Chapter 7's territory. The first article bracket was measured before it went to the anodiser, every dimension passed, and the part was sent for finishing. Nobody had recorded that dimensions apply after anodising, so nobody re-measured the bore when the part came back. When the senior inspector reconciled the list against the drawing, the count was six short: balloons 19 to 24 were missing.

The fix was to add the missing lines and re-measure the anodised bracket. The bore had shrunk enough to fail, as Chapter 7 explains. Had the trainee's list gone to the customer as the first article report, the shop would have certified a nonconforming part. The procedure was changed so that ballooning always ends with the reconciliation step, signed by a second person on any job that needs a first article report.

## Requirements that live in other documents

Some requirements never appear on the sheet as numbers. The bracket's finish field says "clear anodise to customer specification", and the specification is a separate document. When the inspector reads it, it adds requirements of its own. This is an illustration: the customer's finish specification states a coating thickness range of 10 to 15 µm, requires the finisher's certificate with each lot, and forbids rack marks on the base underside because that face is datum A.

Each of those is a requirement on this part, and each needs a line. The inspector has two choices: give each one a sub-balloon under balloon 20 (20.1 thickness, 20.2 certificate, 20.3 no rack marks on datum A) or list them as separate lines with a note that they come from the specification. Either works, provided the record shows that the specification was read and every requirement in it was accounted for. "Anodise: OK" is not enough; it does not say what was checked.

Thread callouts carry hidden requirements too. "M4-6H" states a thread size, a pitch by default, and a tolerance class. A thread that is the right size but the wrong class can pass a casual check with a screw and fail with a gauge. The balloon records the full callout, not just "M4", so the method chosen later is a 6H gauge rather than whatever screw is to hand.

## Who balloons and who checks

On a job with a first article report, the person who balloons the drawing should not be the only person who checks the list. A second reader, working from the drawing rather than from the list, catches omissions the first reader is blind to, because the first reader tends to see what they already numbered.

In a small shop this can be a ten-minute task for whoever is available: hand them the drawing and the list, ask them to tick every requirement on the drawing that has a line, and ask them to circle anything without one. The circles are the findings. On the bracket, a second reader would have caught the missing title block and notes on the trainee's first attempt in minutes.

## Where ballooning software helps and where it does not

Several software packages can read a CAD drawing or a PDF and place balloons automatically, then export a requirement table. They save a great deal of typing on a drawing with hundreds of characteristics. They also have predictable blind spots. Automatic ballooning finds dimensions and feature control frames reliably; it is less reliable with notes written as free text, with requirements in the title block, and with requirements that live in called-up documents rather than on the sheet.

Treat the software's output as a first draft. Run the same reconciliation step by hand: read every note and every title block field and confirm each has a line. The time saved on the dimensions is better spent on the requirements the software cannot see.

## Keeping the ballooned drawing alive

A ballooned drawing is tied to a revision. When revision D of the bracket arrives, the inspector compares it with revision C, balloon by balloon. Requirements that have not changed keep their numbers. Changed requirements keep their numbers with the new value. Deleted requirements are struck out, not renumbered, so earlier records still make sense. New requirements receive new numbers at the end of the list.

This sounds fussy, but renumbering breaks traceability. If balloon 12 meant perpendicularity in revision C and something else in revision D, every report that mentions balloon 12 needs its revision to be read correctly. Keeping numbers stable across revisions means a trend in balloon 9 across five batches is a trend in one requirement.

## Exercise: balloon a shaft collar

A shaft collar drawing shows: outside diameter Ø40 (general tolerance), bore Ø20.000 to Ø20.021, width 12 ±0.05, one M6 radial tapped hole 6 from one face (general tolerance), a chamfer 0.5 × 45° both ends of the bore, and the notes "Material: free-machining steel" and "Zinc plate, 8 µm minimum" and "Break all edges". The general tolerance note is ±0.1 mm. Build the balloon list.

**Answer.** A complete list has nine balloons and ten results: 1 outside diameter Ø40; 2 bore Ø20.000 to Ø20.021; 3 width 12 ±0.05; 4 thread M6 (one hole, so no instances); 5 tapped hole position 6 from the face; 6.1 and 6.2 bore chamfer 0.5 × 45°, one at each end, numbered from a stated face; 7 material; 8 zinc plate, 8 µm minimum; 9 break all edges. If the drawing gives a thread class, it belongs on balloon 4. If the chamfer is dimensioned as one requirement with "both ends", the two instances are recorded separately. A list without balloons 7 to 9 has missed the title block and notes, which is the most common error. A list that gives the two chamfers one result has lost the ability to say which end was wrong.
