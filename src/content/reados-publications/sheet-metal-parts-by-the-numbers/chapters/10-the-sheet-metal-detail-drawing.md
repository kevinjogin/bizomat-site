---
book: sheet-metal-parts-by-the-numbers
chapterSlug: the-sheet-metal-detail-drawing
order: 10
title: "The sheet metal detail drawing"
description: "Bring the book's numbers onto one drawing: folded views, a flat pattern view, a bend table with directions, notes for material, radius, K-factor, tolerances, burrs, grain, coating and inserts."
draft: false
---

A sheet metal detail drawing has to do more than a machined part's. It must define the finished, folded part for the inspector; give the cutter a flat pattern or the information to make one; tell the folder the radius, the K-factor and the direction of every bend; and carry the notes about burrs, grain, coating and tooling marks that this book has collected chapter by chapter. Each of those can be left implicit, and each one left implicit becomes a question at the cutter or the press brake, or an assumption that turns out wrong.

This chapter assembles the bracket's drawing from the earlier chapters' decisions: which views it needs, how the flat pattern view is presented, what a bend table contains, and which notes earn their place. It ends with the fault that a flat pattern without bend directions invites, and a checklist that ties the drawing back to the general detail drawing requirements every part shares.

## What the drawing must contain

A sheet metal detail drawing carries everything a detail drawing needs, the title block, material, units, projection, scale, tolerances and signatures, and adds:

- **folded views** that define the finished part, dimensioned to the faces the function uses, with the note saying which face dimensions run to;
- a **flat pattern view**, at a stated scale, with overall size, feature positions and bend lines, marked as for manufacture or for reference;
- a **bend table**, listing each bend's identifier, direction, angle, inside radius and, where it matters, sequence;
- **notes** for the process-specific requirements this book has covered.

READOS's *Drawings That Make Parts* covers the general content; *Checking Drawings by the Numbers* covers how to check it. This chapter covers what sheet metal adds.

## The folded views

For the bracket, two folded views define the part: an end view showing the C-shaped section, with the base width, leg height, return width, thickness and inside radius note; and a front view showing the 300 mm length, the four base holes and the four leg slots with their positions. A third view, a plan looking down on the base, shows the base holes in true shape. Section views are rarely needed for a part as open as the bracket.

Dimensions follow the decisions of earlier chapters: outside dimensions with the general note "ALL DIMENSIONS TO OUTSIDE MOULD LINE UNLESS STATED", the inside width of 156 mm as a reference, the base holes located from the base's centreline, the slots from the base's outside face, and the sheet metal general tolerance scheme from Chapter 9 in the title block.

## The flat pattern view

The flat pattern view shows the blank as it is cut: 295.6 × 300 mm, with the holes and slots at their flat positions, the shortened return's relief, and the bend lines dashed at the centre of each bend allowance. It states its K-factor, die and radius in a note beside it: "FLAT PATTERN FOR V12 DIE, INSIDE RADIUS 2.0, K 0.40. FOR REFERENCE: FOLDER TO CONFIRM FOR OWN TOOLING", following Chapter 3's advice for a part whose folder might change.

If the folder has agreed the flat from its own trials, the note can say instead "FLAT PATTERN AGREED WITH FOLDER, TRIAL REF ...", and the flat's dimensions can then govern the cut blank. Either way, the folded views govern the finished part.

```figure
type: compare
title: Bend table for the bracket
cols: Position on flat from left edge | Direction | Angle | Inside radius | Sequence
caption: This is an illustration. Positions are bend line centres on the flat, viewed from the face marked A on the flat pattern view. UP means towards the viewer.
- Bend 1, left return | 13.2 mm | UP | 90° ±0.5° | 2.0 | 1
- Bend 2, left leg | 69.6 mm | UP | 90° ±0.5° | 2.0 | 3
- Bend 3, right leg | 226.0 mm | UP | 90° ±0.5° | 2.0 | 4
- Bend 4, right return | 282.4 mm | UP | 90° ±0.5° | 2.0 | 2
```

## Laying out the sheet

The bracket's drawing fits an A3 sheet. Its layout follows the order a reader uses it: the folded views first, because they define the part, the flat pattern beside them, and the bend table and notes near the title block, where the folder and inspector look for them.

```figure
type: steps
title: Arranging the bracket's A3 drawing
caption: This is an illustration. Folded views at 1:2, flat pattern at 1:2, bend table and notes beside the title block.
- Front view of the folded bracket | Length 300, base holes and leg slots located from the datums
- End view, projected from the front view | The C-section with base, legs, returns and the radius note
- Plan of the base | Holes in true shape, with their position tolerance
- Flat pattern view | Blank size, flat feature positions, bend lines and face A marked
- Bend table and notes | Beside the title block, above the sheet metal general tolerance scheme
```

At 1:2, the 300 mm length is 150 mm on paper and the flat pattern 148 × 150 mm, so both fit with room for dimensions. A detail of the shortened return's relief at 2:1 shows its 2.5 mm width and 5 mm depth clearly, which at 1:2 would be 1.25 mm and 2.5 mm on paper, too small to dimension.

## The bend table

A bend table lists each bend so that the folder does not have to infer anything from the views. For each bend it gives an identifier, the position of its bend line on the flat, the **direction** relative to a stated face of the flat, the angle with its tolerance, the inside radius and, if the designer has a reason to fix it, the sequence. The bracket's four bends all go the same way, all 90°, all R2, and the sequence is the folder's choice from Chapter 1, recorded for information.

Direction is the item most often missing, and the one that matters most. A flat pattern shows where the bends are; it does not show which way each one goes. For a C-channel, every bend goes up. For a Z-section, or a part with a flange bent down where the others go up, getting one direction wrong makes a different part.

## The error: a return bent the wrong way

This is an illustration. The first drawing of the bracket's shortened-return variant, from Chapter 6, showed the flat pattern with bend lines but no bend table and no face marking, and the folded end view showed the C-section clearly. The folder, working from the flat and glancing at the end view, folded the full-length return up and, through a misreading of which edge was which on the blank, folded the shortened return down. The result was a bracket with one return pointing inwards and one outwards, and a relief notch in the wrong flange.

The fault was found at the folder's own first-off check against the end view, and the folder asked for a bend table. The drafter added one, marked face A on the flat pattern view with a symbol and a note, "VIEWED FROM FACE A: ALL BENDS UP", and added the shortened return's position along the length to the table so that the two returns could not be confused. No further parts were folded wrongly. The marking itself is cheap: a small etched letter A in a corner of the blank, on a face that is hidden after folding, lets the folder confirm the blank's orientation at a glance, and the flat pattern view shows where the letter goes. On parts that are symmetrical except for one feature, like the shortened return, that small mark is the difference between a part that can only be folded one way and one that invites a mistake.

## The notes that earn their place

Every note on the drawing should answer a question the cutter, folder, coater or inspector would otherwise have to ask, and each of the bracket's notes traces back to a chapter of this book:

1. Material, grade, standard and thickness: 2.0 mm cold-rolled mild steel sheet, grade to its product standard (Chapter 1).
2. "ALL DIMENSIONS TO OUTSIDE MOULD LINE UNLESS STATED" (Chapter 1).
3. "INSIDE BEND RADIUS 2.0 UNLESS STATED" (Chapter 2).
4. "FLAT PATTERN FOR V12 DIE, INSIDE RADIUS 2.0, K 0.40, FOR REFERENCE" (Chapters 3 and 7).
5. "BEND ANGLES 90° ±0.5°" (Chapter 5).
6. "DEBURR ALL CUT EDGES. BURR SIDE TO INSIDE OF BENDS" (Chapters 2 and 8).
7. "POWDER COAT AFTER FOLDING. DIMENSIONS BEFORE COATING" (Chapter 1).
8. "SHEET METAL GENERAL TOLERANCES" in the title block, with the scheme from Chapter 9.
9. "BASE FLATNESS 0.5. INSPECT RESTRAINED ON DATUM A" (Chapter 9).

The drawing deliberately does not say "BEND LINES ACROSS ROLLING DIRECTION", because the mild steel bracket does not need it, or "OUTER FACE COSMETIC", because no face is visible in service. Each omitted note leaves the supplier free to use standard practice. The high-strength variant's drawing adds the rolling direction note, the springback correction note from Chapter 5 and the longer returns from Chapter 7.

```figure
type: checklist
title: Release check for a sheet metal detail drawing
caption: This is an illustration of the office's sheet metal checklist, used after the general drawing check. Each line comes from a chapter of this book.
- Face reference note: outside or inside | One convention, stated, applied to every dimension
- Inside radius stated once, matched to the folder's die | R2.0 from the V12 die
- K-factor, die and radius stated beside the flat pattern | Flat marked for reference or as agreed
- Bend table with direction, angle, radius and face reference | Every bend, including any bent down
- Features clear of bends and edges | 2.5t + R from tangent lines; 2t from edges
- Reliefs wherever a bend stops inside the blank | The shortened return's relief
- Shortest flange above the die's minimum | 15 mm returns against 8.4 mm
- Tolerances from the folder's capability, not a machining template | Scheme from Chapter 9
- Coating, burr side, grain and cosmetic faces stated where they matter | As listed above
- x Flat pattern with no bend directions | The cause of the wrong-way return
- ? Mating features generous enough to absorb the bends | Clamp slots widened in Chapter 9
```

## The general detail drawing requirements still apply

A sheet metal drawing is still a detail drawing. It needs a unique drawing number and a title, a revision and revision record, the sheet size and sheet number, the scale of each view, the projection symbol, the units, the material and finish, a reference to the assembly it is used on, and the names and dates of the people who drew, checked and approved it. The sheet metal notes add to that list; they do not replace any of it. The bracket's drawing number, its used-on reference to the conveyor drive assembly and its checked and approved signatures are completed exactly as for any machined part, and the drawing is checked with the passes of *Checking Drawings by the Numbers* before release.

## Variants: one drawing or several?

The bracket now has variants: the original in 2.0 mm mild steel, the shortened-return version, the high-strength 2.0 mm version, the 3.0 mm high-strength version with longer returns, and the 1,200 mm long version of Chapter 8. It is tempting to put them all on one tabulated drawing, with a table of dash numbers giving each variant's length, material and return width.

Tabulation works for variants that differ only in dimensions that do not change the flat pattern's logic, such as length. It works badly for variants that change the material, thickness, radius, die or K-factor, because each of those changes the flat pattern, the bend table and several notes, and a tabulated drawing that tries to cover them all becomes hard to read and easy to misread. The office's rule is that variants differing only in length share a tabulated drawing; variants differing in material or thickness get their own drawing numbers, each with its own flat pattern, bend table and notes. By that rule the bracket family has three drawings: the 2.0 mm mild steel bracket with its length and shortened-return variants tabulated, the 2.0 mm high-strength bracket, and the 3.0 mm high-strength bracket.

## When the folder changes

A sheet metal drawing whose flat pattern was agreed with one folder carries that folder's K-factor, die and radius. If the part moves to another folder, those assumptions move with it unless someone changes them. The new folder should be given the drawing with its flat marked for reference and asked to confirm or recalculate the flat for its own tooling, and the drawing should be revised if the radius, die or flange minimums change. Moving a part between suppliers without that step is how a flat that was right for years becomes wrong overnight.

## Models, DXFs and the drawing

Many folders now receive a 3D model and a flat DXF along with the drawing, and cut directly from the DXF. That makes the flat pattern view on the drawing a check rather than the cutter's source, and it makes consistency between the three essential. The drawing should state which governs: the office's practice is that the folded views govern the finished part, the DXF is the cutter's source for the blank, and the drawing's flat pattern view must agree with the DXF to within the cutter's accuracy. The checker compares three numbers between them, the overall flat size, one feature on each flange and one bend line spacing, as Chapter 4 suggested for a CAD flat.

## Exercise: what is missing?

A colleague's draft drawing for a small cover, folded from 1.6 mm aluminium with two 90° bends and one hem, shows the folded views fully dimensioned to the outside, a flat pattern view with bend lines and the hem's fold line, and the notes "MATERIAL: ALUMINIUM 1.6" and "DEBURR". What would you ask for before release?

**Worked answer.** At least seven things:

1. **The material grade and temper**, because aluminium alloys and tempers differ greatly in their minimum bend radius and springback (Chapters 2 and 5).
2. **The inside bend radius**, matched to the folder's die for that alloy and temper (Chapter 2).
3. **A face reference note**, "ALL DIMENSIONS TO OUTSIDE MOULD LINE UNLESS STATED", since the dimensions appear to be to the outside but nothing says so (Chapter 1).
4. **The K-factor and the hem allowance behind the flat pattern**, and whether the flat is for reference or agreed (Chapters 3 and 7).
5. **A bend table with directions**, including the hem, so that each bend and the hem go the right way relative to a marked face (this chapter).
6. **Bend angle tolerances and a sheet metal general tolerance scheme**, rather than a machining scheme (Chapters 5 and 9).
7. **The hem type**, closed, open or teardrop, since a closed hem in a hard aluminium temper may crack (Chapter 7).

Depending on use, the drawing may also need the burr side, the rolling direction for the hem, any coating and whether its dimensions are before or after it, and a note on cosmetic faces if the cover is visible.
