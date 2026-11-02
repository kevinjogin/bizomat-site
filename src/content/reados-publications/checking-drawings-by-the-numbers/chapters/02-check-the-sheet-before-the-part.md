---
book: checking-drawings-by-the-numbers
chapterSlug: check-the-sheet-before-the-part
order: 2
title: "Check the sheet before the part"
description: "The first pass of a check: title block fields, drawing numbers, revisions and sheet references across a multi-sheet drawing, units, projection, scale, general notes and zone references."
draft: false
---

The first pass of a check does not look at the part at all. It looks at the frame around it: the title block, the sheet references, the revision table and the general notes. It is the quickest pass, a few minutes a sheet, and it comes first for a practical reason. If the revision is wrong, the drawing number duplicates another part, or the general tolerance note differs between two sheets of the same drawing, then every later finding is a finding about the wrong thing.

This chapter sets out what the sheet must say and how to check it across a set, with a table that makes inconsistencies visible at a glance. It checks the TA-200 tensioner set's five sheets and finds that the arm drawing's two sheets disagree with each other.

## What the sheet must say

A detail drawing must carry enough information around the views for someone who has never seen the part, the office or the project to make it, inspect it and file it. The fields vary a little between offices, but a checker should expect to find, on every sheet:

- the **organisation** that owns the drawing;
- the **title**, the name people use for the part, which need not be unique;
- the **drawing number**, which must be unique, because it is how the part is found, ordered and controlled;
- the **revision**, and a revision table describing each change;
- the **sheet number and total**, such as "SHEET 1 OF 2";
- the **sheet size**, the **scale** and the **projection** symbol;
- the **units**, normally "DIMENSIONS IN MILLIMETRES";
- the **general tolerance** note that applies where no tolerance is stated;
- the **material** and the **finish or treatment**;
- the **drafting standard** followed, such as AS 1100;
- a reference to the **assembly** on which the part is used;
- the **signatures and dates** for drawn, checked, approved and issued.

The Library’s *Drawings That Make Parts* explains what AS 1100 says about each field. The checker's question is narrower: is each field present, filled in, correct, and the same as on every other sheet where it should be the same?

## Title and number: one is a name, the other an identity

Many parts share a title. An office may have a dozen drawings called "BRACKET" or "ARM". Only the drawing number identifies the part, so the checker confirms it against the office's register: the number must exist, must belong to this part, and must not be in use for anything else.

This is an illustration. The office's register shows TA-201 allocated to "TENSIONER ARM" on the TA-200 project, with revision B as the current working revision. The bush, TA-203, is registered with the title "BUSH, PIVOT". On the drawing, its title reads "BEARING". The difference does not change the part, but a buyer searching the register for a bearing will not find it, and the parts list on TA-200 uses the register's title. The checker marks the title for correction to match the register.

## Sheets of one drawing must agree

A drawing that needs more than one sheet has one drawing number and one revision for all its sheets, and each sheet says which it is and how many there are. Two sheets of the same drawing are not two drawings; a reader holding sheet 2 must be able to rely on it belonging with sheet 1 at the same revision.

The commonest faults on multi-sheet drawings are:

- sheets at **different revisions**, because a change was made on one and the other was not reissued;
- a **sheet total** that is wrong, because a sheet was added or removed;
- **separate drawings numbered as sheets of one set**, so that "SHEET 2 OF 4" appears on a drawing whose number differs from sheet 1's, which tells the reader nothing reliable about where the other sheets are;
- **general notes that differ**, such as a general tolerance on one sheet that is not on the other.

## The running case: a table of the set

This is an illustration. The checker's first act on the TA-200 set is to fill in a short table with one row per sheet and one column per sheet-level field. It takes about five minutes and turns the comparison from memory into something the eye can scan.

```figure
type: compare
title: Sheet-level fields across the TA-200 set
cols: Revision | Sheet | Scale | General tolerance | Material
caption: This is an illustration. Two cells disagree with their neighbours on the same drawing: TA-201 sheet 2's revision and its sheet total.
- TA-200 assembly | B | 1 of 1 | 1:2 | Not applicable | See parts list
- TA-201 arm, sheet 1 | B | 1 of 2 | 1:1 | ±0.5 machined, ±1.5 cast | Ductile iron
- *TA-201 arm, sheet 2 | A | 2 of 3 | 2:1 | ±0.5 machined, ±1.5 cast | Ductile iron
- TA-202 pivot pin | B | 1 of 1 | 2:1 | ±0.2 | Bright steel bar
- TA-203 bush | B | 1 of 1 | 5:1 | ±0.1 | Sintered bronze
```

Two faults show at once. TA-201 sheet 2 is at revision A while sheet 1 is at B, and it says "2 OF 3" although the drawing has two sheets. Asking the drafter found the story: revision B moved the pulley spindle hole, which appears on sheet 1, and sheet 2 was not reissued because nothing on it changed. A third sheet had existed in an early draft and been deleted.

The rule the checker applies is that every sheet of a drawing carries the drawing's current revision, whether or not it changed, so that a reader never has to decide whether a sheet at revision A is current. Sheet 2 is reissued at B, and its total corrected to "2 OF 2". The revision table, which appears on sheet 1, records that sheet 2 was reissued without change.

## Units, projection and scale

Three fields decide how everything else on the sheet is read, and a wrong one corrupts every view.

**Units.** The sheet should state the units in words. A drawing with no unit note will usually be read as millimetres in Australia, but a supplier who also works to inch drawings may hesitate, and a hesitation is a phone call or a guess. Centimetres are not used on mechanical drawings.

**Projection.** The projection symbol, third angle for most Australian work, must be present and must match how the views are actually arranged. A checker confirms the second point by looking at one view and its neighbour: in third angle, the view of the right-hand end sits to the right of the front view. A symbol that disagrees with the arrangement is worse than no symbol.

**Scale.** The title block's scale should match the main views, and other scales should be stated beside the views that use them. The arm's sheet 2 is at 2:1 for its machining details, and its title block says so. The checker confirms one scale by measuring a dimensioned length on the print: the 30 mm boss length should measure 60 mm on sheet 2 at 2:1. It measures 60 mm.

```figure
type: checklist
title: Sheet-level checks for each drawing in the set
caption: This is an illustration of the office's first-pass list. Each line is checked against the register, the other sheets and the views themselves.
- Drawing number unique and registered | TA-201 matches the register
- Title matches the register | TA-203 corrected from BEARING to BUSH, PIVOT
- Same revision on every sheet | TA-201 sheet 2 reissued at B
- Sheet number and total correct | TA-201 sheet 2 corrected to 2 OF 2
- Units, projection and scale stated and consistent with the views | 30 mm boss measures 60 mm at 2:1
- General tolerance, material and finish the same on every sheet of a drawing | Agreed
- Used-on reference names the assembly | TA-200 on every part drawing
- x Signatures added before the check is complete | Checked box left blank until corrections are made
- ? Zone references in the revision table | Checked against the changed feature's position
```

## Zones and the revision table

On larger sheets a grid of letters and numbers around the border divides the drawing into zones, so that a feature or a change can be referred to as, for example, "C6". The revision table often gives the zone of each change, so that a reader can find it. A wrong zone sends the reader to the wrong place, and on a crowded sheet they may not find the change at all.

This is an illustration. The arm's A3 sheet 1 has a frame 400 × 277 mm inside a 10 mm border, divided into eight columns numbered from the left and six rows lettered from the top. Each zone is therefore 400 ÷ 8 = 50 mm wide and 277 ÷ 6 = 46.17 mm high. The revision table says that revision B moved the pulley spindle hole "in zone C5". The checker measures the hole's centre on the print at 262 mm from the sheet's left edge and 183 mm from its bottom edge.

Column: (262 − 10) ÷ 50 = 5.04, so the sixth column. Row: (287 − 183) ÷ 46.17 = 2.25 from the top, so the third row, C. The hole is in **C6**, not C5. The difference is small, but the revision table is a reference that people rely on years later, and it is cheap to correct now.

```figure
type: formula
title: Finding the zone of a feature on the arm's A3 sheet
formula: column = floor((x − border) ÷ zone width) + 1        row = floor((top of frame − y) ÷ zone height) + 1
caption: This is an illustration for a frame 400 × 277 mm inside a 10 mm border, eight columns numbered from the left and six rows lettered from the top.
- x, y | Feature position measured from the sheet's left and bottom edges, mm
- zone width, zone height | 50 mm and 46.17 mm
step: Spindle hole at x = 262, y = 183
step: Column floor(252 ÷ 50) + 1 = 6; row floor(104 ÷ 46.17) + 1 = 3, which is C
step: Zone C6; the revision table said C5
```

## General notes

General notes apply to everything on the sheet that is not stated otherwise, so a wrong general note is a fault in hundreds of places at once. The checker reads each note for three things.

- **Does it apply?** A note copied from a template may refer to a process the part does not use. The pin's drawing carries the template note "REMOVE BURRS AND SHARP EDGES", which applies, and "FILLETS R4 UNLESS STATED", which does not, because the pin has no cast fillets. The checker marks the second for deletion.
- **Is it consistent with the views?** If the general tolerance is ±0.5 mm, every dimension that needs tighter control must carry its own tolerance. Chapter 4 checks this feature by feature.
- **Is it complete?** A material note that says only "STEEL" does not tell a supplier what to buy. The pin's note gives the bar specification and condition; the arm's gives the ductile iron grade to its Australian Standard; both are acceptable.

## The used-on reference

A detail drawing rarely explains why the part is the shape it is. The reason lives in the assembly, and the used-on field, sometimes called "next assembly" or "used on", is the link from the part back to it. A checker uses it twice: to confirm that the assembly exists and lists this part, and to know which other drawings to have open while checking.

This is an illustration. The pin, TA-202, says "USED ON TA-200". The checker opens TA-200's parts list and finds item 2, "PIN, PIVOT, TA-202, QTY 1". The bush says "USED ON TA-200" too, and is item 3. The arm says "USED ON TA-100", the conveyor drive assembly, which is wrong: the arm is used on the tensioner, and the tensioner is used on TA-100. A reader following the arm's reference to TA-100 would find no arm on its parts list. The checker marks it for correction to TA-200.

Parts used on several assemblies need every one listed, or a note referring to the register's where-used record. A change to a shared part affects every assembly it is used on, and a used-on field that lists only one hides the others from the person assessing the change.

## Title blocks filled from properties

Most CAD title blocks are not typed; they are filled from properties of the file or the model: number, title, material, mass, revision, drafter. That makes them consistent with the model and, sometimes, consistently wrong. A property copied from a template, such as a material left at the template's default, appears correctly formatted in every title block made from it.

The checker therefore reads the title block's values as claims, not facts, and confirms the ones that matter against their source. For the arm, the material field reads the ductile iron grade the design brief requires, and the mass field reads 1.82 kg. The checker does not recalculate the mass, but notes that it came from the model's material density, so a wrong material would have made it wrong too. For the bush, the mass reads 0.000 kg, because no material was assigned in the model. The field is cosmetic on this drawing, but the parts list uses it for the assembly mass, so it is marked for correction.

## Signatures and dates

The last fields to check are the first a reader looks at when something goes wrong. Each box should carry a name or initials and a date, in order: the check cannot be dated before the drawing, nor the approval before the check. The checker signs only when every finding has been resolved, not when the mark-up is handed back. A checked box filled in while corrections are still outstanding records something that has not happened.

## Exercise: a second set of sheets

The office receives a drawing set from a subcontractor for a guard that mounts on the tensioner. The sheets read: GD-410 "GUARD" sheet 1 of 3, revision C; GD-411 "GUARD" sheet 2 of 3, revision C; GD-410 "GUARD" sheet 3 of 3, revision B. What faults does the first pass find, and what should the office ask for?

**Worked answer.** Three faults:

1. **GD-411 is labelled sheet 2 of 3** of a drawing whose other sheets are GD-410. Either GD-411 is a separate drawing, in which case it should be "SHEET 1 OF 1" with its own title, or it is sheet 2 of GD-410 and carries the wrong number. A reader cannot tell which.
2. **GD-410 sheet 3 is at revision B** while sheet 1 is at C. The office cannot tell whether sheet 3 is current or was missed when revision C was issued.
3. **Both drawings have the same title**, "GUARD", which is allowed, but together with the numbering fault it suggests the set was assembled from parts of two drawings.

The office should not check the content until the subcontractor confirms which sheets belong to which drawing at which revision, and reissues the set with consistent numbers, revisions and sheet totals. Checking the views on an inconsistent set risks spending an hour on a sheet that is not current.
