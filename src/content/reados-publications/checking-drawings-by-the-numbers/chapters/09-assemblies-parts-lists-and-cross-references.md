---
book: checking-drawings-by-the-numbers
chapterSlug: assemblies-parts-lists-and-cross-references
order: 9
title: "Assemblies, parts lists and cross-references"
description: "Check an assembly drawing against its parts: balloons and parts list, quantities, bought-out items, assembly notes, revisions across the set, and when a change needs a new part number."
draft: false
---

The detail drawings define the parts; the assembly drawing defines how they come together and what to buy. It is the drawing the buyer, the storeperson and the fitter use, and its faults are of a different kind: a quantity of one where two are needed, a balloon pointing to nothing, a bought-out item described by type instead of part number, an assembly note that contradicts a detail drawing, a revision of a part that the assembly does not know about. None is visible on any single detail drawing.

This chapter checks the assembly drawing as the hub of the set. It sets out a cross-reference table that tests every item against its drawing or data sheet, checks the assembly notes and dimensions, and deals with the question every revision raises: is the changed part still interchangeable with the old one, and if not, does it need a new number? The running case checks the TA-200 assembly after the revisions of the earlier chapters.

## Balloons and the parts list

Every item on the parts list should appear on the assembly drawing with a balloon, and every balloon should correspond to one line of the parts list. The check is a count in both directions, followed by a match.

This is an illustration. The TA-200 parts list, after the earlier chapters' revisions, has seven lines:

1. arm, TA-201, quantity 1;
2. pin, TA-202, quantity 1;
3. bush, TA-203, quantity 1;
4. washer, precision grade, supplier part number, quantity 1;
5. retaining ring, supplier part number, quantity 1;
6. pulley assembly, supplier part number, quantity 1;
7. bolt, M12 × 45, with its standard and grade, quantity 1.

The assembly drawing shows six balloons. The bolt has no balloon; it is drawn, but hidden behind the pulley in the main view, and the drafter had not added a leader. And the washer's quantity is 1, although the assembly has two washers, one each side of the boss.

```figure
type: compare
title: Cross-reference table for the TA-200 assembly
cols: Balloon | Quantity listed | Quantity drawn | Reference resolves? | Finding
caption: This is an illustration. Each row is checked against the drawing, the register or the supplier's data sheet named on the parts list.
- 1 Arm TA-201 | Yes | 1 | 1 | Revision C, register | Agreed
- 2 Pin TA-202 | Yes | 1 | 1 | Revision C, register | Agreed
- 3 Bush TA-203 | Yes | 1 | 1 | See the interchangeability finding | New number needed
- *4 Washer | Yes | 1 | 2 | Data sheet, precision grade | Quantity should be 2
- 5 Retaining ring | Yes | 1 | 1 | Data sheet | Agreed
- 6 Pulley assembly | Yes | 1 | 1 | Data sheet | Agreed
- *7 Bolt M12 × 45 | No | 1 | 1 | Standard and grade given | Balloon missing
```

The fixes are simple: a second washer in the quantity column, and a balloon with a leader to the bolt head, visible in the end view. Each is the kind of fault that would cost an afternoon when the first kit is picked short of a washer.

## Views the fitter needs

An assembly drawing's views are chosen for a different reader from a detail drawing's. The fitter needs to see where each part goes, which way round, and in what order, not each part's dimensions. The checker asks of each view: does it show every item at least once, in a position where its orientation is unambiguous? Does a section show the parts that are hidden in the outside view, such as the bush inside the boss and the washers either side of it?

This is an illustration. The TA-200 assembly has an outside view along the pivot axis and a section through the pivot and spindle axes. The section shows the pin, bush, washers and ring in their order along the axis, which is what the fitter needs. It did not show which way round the retaining ring fits; the ring supplier's data sheet says the ring's sharp edge must face away from the load. The checker asked for a note, "RING SHARP EDGE AWAY FROM ARM", and an enlarged detail of the ring in its groove, which also lets the assembler see that the ring bears on the groove's outer wall, the wall Chapter 7 now dimensions.

## Bought-out items must be orderable

A bought-out item on a parts list must be orderable from the description alone. That means a supplier and a supplier's part number, or a standard and enough designation to identify the item exactly, and for fasteners, the grade and finish. "WASHER, M12" can be satisfied by dozens of washers of different thicknesses and tolerances, and Chapter 7 showed that the washer's thickness is a link in the axial float. The parts list must name the precision washer the stack assumed.

The checker reads each bought-out line as the buyer will: could I order exactly this part, and only this part, from what is written? For the tensioner, the washer and ring lines named supplier part numbers; the pulley line named the supplier and a catalogue number; the bolt line gave the metric thread, length, property class, standard and finish. All passed after the washer line was updated to the precision grade's part number.

## Assembly notes and assembly dimensions

An assembly drawing carries information that belongs to no single part: how to put the parts together, in what order, with what tools, and what the assembled result must measure. The checker tests each assembly note against the detail drawings and the stacks.

This is an illustration. The TA-200 assembly notes, after the earlier revisions, read:

1. Press bush item 3 into arm item 1, flush to 0.2 mm below the front boss face.
2. Bush bore after pressing Ø12.010/12.044, check with plug gauge, as Chapter 6 required.
3. Grease pin item 2 before assembly.
4. Axial float of arm on pin 0.1/0.5, check with feeler gauge.
5. Tighten bolt item 7 to the torque specified by the designer, stated on the drawing with its tolerance.

The checker confirmed note 2 against the bush and arm drawings and note 4 against Chapter 7's stack. Note 1 raised a question: if the bush sits up to 0.2 mm below the boss face, the washer bears on the boss, not the bush, which is what the stack assumed. If the bush stood proud, the washer would bear on the bush instead and the stack would be different. The note is consistent with the stack, and the checker recorded that it had been checked for that reason.

## Revisions across the set

Every revision of a part raises two questions for the assembly. Does the assembly drawing need revising too? And can the revised part replace the old one?

The first is about the assembly drawing's content. If the part's change shows on the assembly, or changes an assembly note, dimension or parts list line, the assembly needs revising. The bush's changed bore changed note 2, so TA-200 must be revised.

The second is interchangeability. A widely used rule is that a part whose form, fit or function changes so that it can no longer replace the previous version, in every assembly where the previous version is used, gets a new part number; a change that keeps it interchangeable can be a new revision of the same number. The rule exists because stores, spares and field service identify parts by number. If two non-interchangeable bushes share a number, the wrong one will one day be fitted.

```figure
type: decision
title: A detail drawing has changed. Revision or new part number?
question: Can the changed part replace the previous version in every assembly where it is used, without any other change?
- Yes, in every case | New revision of the same number | Old and new can be mixed in stores and in service
- *No, in some cases | New part number | Old stock and spares stay identifiable; where-used must be updated
- Only with a matching change to another part | New numbers, or a matched set with its own number | Arm and bush revised together
```

## The running case: are the old and new bushes interchangeable?

This is an illustration. Chapter 6's remedy changed three things: the arm's bore, now 16.000 to 16.011 mm; the bush's outside diameter, now 16.040 to 16.051 mm; and the bush's bore, now 12.056 to 12.070 mm. The checker tested both directions of interchange with the same 90% closure assumption.

**An old bush in a new arm.** The old bush's outside diameter, 16.040 to 16.058 mm, in the new bore gives an interference of 0.029 to 0.058 mm and a closure of 0.026 to 0.052 mm. Its old bore, 12.020 to 12.038 mm, closes to 11.968 to 12.012 mm, and the clearance on the pin is **−0.016 to 0.039 mm**. The pin can seize. An old bush must never be fitted to a new arm.

**A new bush in an old arm.** The new bush's outside diameter in the old bore, 16.000 to 16.018 mm, gives an interference of 0.022 to 0.051 mm. The running clearance is **0.026 to 0.077 mm**, inside the brief, but the minimum interference, 0.022 mm, is below the 0.029 mm that the bush supplier confirmed would hold the bush against the arm's working torque. A new bush in an old arm might turn in its bore.

Neither direction is safely interchangeable. The bush therefore needs a new part number, so that old stock cannot be fitted to new arms, and the arm's revision should be recorded as requiring the new bush. The office allocated TA-213 to the new bush, kept TA-203 for the old one with a note that it suits only arms before revision C, and updated TA-200's parts list.

```figure
type: compare
title: Interchange between old and new bushes and arms
cols: Interference | Installed clearance | Verdict
caption: This is an illustration, using 90% closure. The revised design is safe only as a matched pair: new bush in new arm.
- Old bush in old arm | 0.022 to 0.058 mm | −0.016 to 0.045 mm | The original fault
- *New bush in new arm | 0.029 to 0.051 mm | 0.026 to 0.071 mm | Meets the brief
- Old bush in new arm | 0.029 to 0.058 mm | −0.016 to 0.039 mm | Can seize
- New bush in old arm | 0.022 to 0.051 mm | 0.026 to 0.077 mm | Clearance meets the brief; retention not confirmed
```

## The parts list's other columns

Parts lists often carry more than number, description and quantity: material, mass, stock size, supplier, finish. Each extra column is another statement that can disagree with the detail drawing. The checker either confirms each against its source or asks for the column to refer to the drawing instead.

This is an illustration. The TA-200 parts list has a mass column, filled from each part's model. Chapter 2 found the bush's mass reading 0.000 kg; after the material was assigned it read 0.018 kg, and the assembly's total updated. The checker did a quick plausibility check rather than a full one: a bush 16 mm outside, 12 mm inside and 30 mm long has a volume of π ÷ 4 × (16² − 12²) × 30 = 2,639 mm³, and at a typical density for sintered bronze of about 7,000 kg/m³, this is an illustration, it weighs about 18 g. A mass column that disagreed with that by a factor of ten would have pointed to a units or material error in the model. The material column for the pin still read "STEEL BAR, BRIGHT", the old callout Chapter 8 replaced. The checker asked for the column to read "SEE DRG", so that the material is stated once, on the pin drawing.

## The drawing list

A set of more than a few sheets should have a drawing list: every drawing in the set with its number, title, sheet count and current revision. For the tensioner it is short, five drawings counting the new bush, but it is the document a supplier uses to confirm they have everything, and the document a reviewer uses to check that the set is complete. The checker compares it with the drawings actually in the set and with the parts list's made items. Every made item needs a drawing on the list; every drawing on the list should be either a made item or the assembly itself. The tensioner's list had TA-203 at revision B and no TA-213; the checker asked for both, with TA-203 marked "FOR ARMS BEFORE REV C ONLY".

## Used-on and where-used

Chapter 2 checked that every part names its assembly. The reverse check matters at revision time: every assembly that uses a part must be found when the part changes. A part register with a where-used record makes that quick; without one, the checker searches the parts lists of every assembly in the project for the part number.

The tensioner's pin and arm are used only on TA-200. The bush, TA-203, turned out also to be listed on an older idler assembly from another project, which used the same arm casting with a different pin. The new number, TA-213, protects that assembly too: its parts list still calls up TA-203, which is still correct for its unrevised arm.

## Exercise: a spares kit

The service department wants a spares kit for tensioners already in the field, all built before revision C, containing a bush, a pin, two washers and a retaining ring. Which part numbers should the kit contain, and what should the kit's documentation say?

**Worked answer.** Field tensioners have old arms, with bores of 16.000 to 16.018 mm. The interchange table shows that a new bush, TA-213, in an old arm gives an acceptable running clearance but a minimum interference of 0.022 mm, below the 0.029 mm confirmed for retention. The old bush, TA-203, in an old arm has the original fault, a possible interference with the pin.

Neither bush is a confirmed fix for old arms on its own. The safe options are to supply the old bush TA-203 with an instruction to ream its bore after pressing to 12.020 to 12.038 mm, which restores the clearance as Chapter 6's first remedy showed, or to replace the arm as well, supplying a revision C arm with TA-213. The kit's documentation must state which arm revisions it suits and include the reaming instruction if the first option is chosen.

The kit should contain TA-202, the pin, at its current revision with its black oxide finish from Chapter 8, two precision washers by supplier part number, and the retaining ring by supplier part number. The kit itself should have its own part number and a parts list, so that it is ordered and stocked as a unit.
