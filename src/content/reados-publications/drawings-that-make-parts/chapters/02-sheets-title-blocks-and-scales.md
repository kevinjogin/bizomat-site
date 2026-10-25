---
book: drawings-that-make-parts
chapterSlug: sheets-title-blocks-and-scales
order: 2
title: "Sheets, title blocks and scales"
description: "Choose a sheet size and scale that keep a part legible, set up grid references and a title block that answer the reader's first questions, and stop people scaling prints."
draft: false
---

Before a single line of the part is drawn, three decisions shape how readable the drawing will be: the size of the sheet, the scale of the views and the information carried around the edges of the sheet. They look administrative. In practice, they decide whether the drawing survives being printed on an office printer, folded into a job bag, photographed on a phone and read by someone who has never seen the part.

This chapter takes the AS 1100.101 provisions for sheets, layouts, title blocks and scales and applies them to the running case housing. It ends with the most common misuse of a drawing in a workshop: scaling a print.

## Sheet sizes

AS 1100.101 clause 2.4 makes the ISO A series the preferred sheet sizes. The cut sizes in its Table 2.1 are the familiar ones:

```figure
type: compare
title: Preferred sheet sizes, AS 1100.101 Table 2.1
cols: Cut size, mm | Area relative to A4
caption: From AS 1100.101-1992. Each size is half the next larger one, so a drawing reduces from one size to the next without changing its proportions.
- A0 | 841 × 1189 | 16 ×
- A1 | 594 × 841 | 8 ×
- A2 | 420 × 594 | 4 ×
- *A3 | 297 × 420 | 2 ×
- A4 | 210 × 297 | 1 ×
```

Because each sheet's sides are in the ratio of about 1 to 1.414, halving the area keeps the shape. Reducing an A3 drawing to A4 scales every length by **210 ÷ 297 = 0.707**. Chapter 3 shows that this factor matters for line thicknesses and lettering, because whatever you draw on A3 will often be read at 71% of its size.

The standard also recognises three variations:

- **Wider-border sheets**, designated with an R prefix, for preprinted stock: RA3 is 305 × 430 mm, for example, with a print trimming line marking the A3 size.
- **Elongated sheets** for long parts, such as A3 × 3 at 420 × 891 mm and A4 × 5 at 297 × 1051 mm.
- **Roll drawings**, in standard widths of 860 mm and 610 mm, with lengths to suit.

The ISO B series is listed as non-preferred. Cut sizes are subject to tolerances of ±2 mm for dimensions up to 600 mm and ±3 mm above that, which mostly matters to people buying preprinted stock.

## The frame, the grid and the edges

Inside the sheet edge, AS 1100.101 asks for a drawing frame with minimum borders, and recommends a grid reference system for all sheet sizes, so that a feature or a revision can be located by a reference such as "C4".

The grid rules in clause 2.5.4 are simple:

- the number of divisions along each side should be divisible by two;
- each grid rectangle should measure between 25 mm and 75 mm along every side;
- capital letters label one edge and numerals the adjacent edge, placed in the border at least 5 mm from the trimmed edge;
- if there are more divisions than letters, the letters are doubled: AA, BB, CC.

For an A3 sheet, dividing the 420 mm length into eight and the 297 mm height into six gives rectangles of about **52.5 × 49.5 mm**, comfortably inside the 25 to 75 mm range. (Strictly, the grid sits on the frame rather than the sheet edge, so the rectangles are slightly smaller; the result is still inside the range.)

Three more edge items are easy to forget. The sheet size designation should appear, preferably in the bottom right corner of the frame. For microfilming, the original size should be determinable, preferably by showing the frame dimensions, or by a graduated line no shorter than 150 mm. And camera alignment marks, outline arrowheads at the middle of each side, help reproduction. Microfilm is rare now, but the graduated line is still useful: it lets anyone check whether a print has been reduced.

## What every sheet should state

Clause 2.5.6 lists information that should be displayed prominently on each sheet:

1. **The projection system**, by symbol or by the words "3RD ANGLE PROJECTION" or "1ST ANGLE PROJECTION". Third angle is preferred.
2. **A prohibition on scaling**: "DO NOT SCALE".
3. **The dimensional units**, for example "DIMENSIONS IN MILLIMETRES".
4. **The standard the drawing follows.**

Each item answers a question that a reader would otherwise have to guess. Chapter 4 shows what happens when the projection is guessed wrong.

## The title block

Clause 2.5.9 requires spaces in the title block for the name of the organisation, the title of the drawing, the drawing number, and signatures or initials with dates. The scale, the projection method and other relevant information may also appear there. The title block normally sits in the bottom right corner, with the top right allowed where layout demands, and the drawing number should be near the corner of the sheet so that it can be seen when prints are filed or folded. The drawing number may be repeated in other corners for the same reason.

Clause 2.5.10 recommends spaces to the left of the title block for standard information: units, tolerances, a key to machining and other symbols, treatment and finish, tool and gauge references, issue or revision information, material specification and reference drawing numbers. For assembly and multidetail drawings, clause 2.5.11 asks for a parts list adjacent to the title block, giving item numbers, part names, quantities, material, the drawing number of each detail and any stores reference.

```figure
type: checklist
title: Title block and edge information for the running case housing
caption: This is an illustration of the business's A3 template. Each item traces to a clause of AS 1100.101.
- x Organisation, title, drawing number, signatures and dates | clause 2.5.9
- x Scale 1:1, with "OR AS SHOWN" for the enlarged detail | clause 5.3.3
- x Third-angle projection symbol and words | clause 2.5.6
- x DO NOT SCALE; DIMENSIONS IN MILLIMETRES; prepared to AS 1100.101 and AS 1100.201 | clause 2.5.6
- x Material, general tolerances and surface texture notes to the left of the title block | clause 2.5.10
- x Sheet size A3 in the bottom right; drawing number repeated top left | clauses 2.5.5 and 2.5.9
```

All text, tables and dimensions should be readable from the bottom edge or the right-hand edge of the sheet, under clause 2.5.14. That rule seems old-fashioned in a digital office, but it keeps a printed drawing readable without turning it round and round on a bench.

## Scales

AS 1100.101 Section 5 defines scale as the ratio of a length on the drawing to the same length on the object, and recommends a limited set of scales in its Table 5.1:

```figure
type: compare
title: Recommended engineering drawing scales, AS 1100.101 Table 5.1
cols: Scales
caption: From AS 1100.101-1992. The range may be extended by multiplying a recommended scale by an integral power of 10, and intermediate scales may be used only in exceptional cases.
- Enlargement | 50:1, 20:1, 10:1, 5:1, 2:1
- *Full size | 1:1
- Reduction | 1:2, 1:5, 1:10, 1:20, 1:50, 1:100, 1:200, 1:500, 1:1 000 and smaller
```

The scale is shown as a ratio after the word "SCALE", by a graduated block scale, or as "NOT TO SCALE" where the drawing is not to scale. Where one scale predominates, it goes in or near the title block with "OR AS SHOWN", and the other scales are written beside the views that use them. Where several scales are used with none predominant, each is shown beside its view and "SCALES AS SHOWN" appears near the title block. Clause 5.5 adds a useful recommendation: for a small object drawn at a large scale, add a full-size view, even if only in outline, so that the reader can see how big the part really is.

AS 1100.201 adds a mechanical drawing preference: keep the number of different scales on one sheet to a minimum, and show each clearly.

## Choosing the sheet and scale for the housing

This is an illustration. The housing needs two main views: an end view looking at the flange, which is 140 mm across, and a sectional side view showing the bore, spigot and tapped holes, which is 140 mm high and 77 mm long. It also needs an enlarged detail of the relief groove at the bore shoulder, a feature about 2 mm wide.

The designer tried A4 first. In landscape, A4 is 297 mm wide. The two views side by side need 140 + 77 = 217 mm of width, plus space between them and around them for dimensions. Dimension lines must sit at least 3h from the outline and 2h apart (Chapter 6). With 3.5 mm characters, that is at least 10.5 mm for the first row and 7 mm for each further row. Allowing two rows on each side of each view and a gap between views, the width needed is well over 290 mm, leaving no room for the title block or notes. A4 was too tight.

A3 landscape, at 420 × 297 mm, gives room for both views at 1:1, the dimension rows, a 2:1 detail of the groove and the notes area beside the title block. Full size has an extra advantage: anyone holding the print can see the true size of the part, which helps them spot a gross error.

```figure
type: decision
title: Choosing a sheet and scale for the housing
question: Can the views, dimensions, notes and title block fit at 1:1 without crowding?
caption: This is an illustration. The detail view of the groove is drawn at 2:1, so the scale note reads "SCALE 1:1 OR AS SHOWN".
- On A4 at 1:1 | views need about 217 mm of width before dimensions | too tight
- On A4 at 1:2 | fits, but features such as the groove become too small | rejected
- *On A3 at 1:1 | fits with room for two dimension rows, notes and a 2:1 detail | chosen
```

## One template per sheet size

Most of the decisions in this chapter are made once, in the drawing office's templates, and then inherited by every drawing. A good template for each sheet size fixes the frame and grid, the title block and its fields, the standard notes beside it, the projection symbol, the line group and the lettering heights. Chapter 3 shows that the line group and lettering heights should differ by sheet size, because a line that is legible on A1 may vanish when an A3 is reduced to A4.

The running case business keeps three templates, A3, A2 and A1, each with its own line group and character heights, and a written rule for choosing between them: use the smallest sheet on which the views, dimensions and notes fit at a recommended scale without crowding. Most of its parts fit A3 at 1:1 or 1:2. Large weldments go on A1. Nobody chooses a sheet size by habit.

Templates also carry the standard notes, which is where many errors start. A note copied from an old template may refer to a superseded standard, a general tolerance grade the business no longer uses, or a material it no longer buys. The business reviews its templates once a year against its current practice and records the review on the template itself.

## Folding, filing and phones

AS 1100.101 allows fold lines to be marked where prints are folded, and asks for the drawing number to be placed where it can be seen when a print is filed or folded. In a workshop, drawings live folded in job bags, pinned to boards beside machines and, increasingly, photographed on phones. Each of those habits hides part of the sheet.

The practical response is to repeat the drawing number and revision in a second corner, keep critical notes near the title block rather than scattered across the sheet, and avoid putting essential information in the strip that will become a fold. A photo of the bottom right corner should identify the drawing, its revision and its scale without the rest of the sheet.

## The error: scaling a reduced print

The machine shop received the drawing as a PDF and printed it on its office printer, which reduced it to fit A4. A setter needed the size of a small chamfer on the flange edge that the designer had forgotten to dimension. He measured it on the print with a rule: about 2.1 mm. He machined a 2 mm chamfer.

The drawing had been printed at 0.707 of its true size. The chamfer drawn at 3 mm measured **3 × 0.707 = 2.1 mm** on the reduced print. The setter's measurement was accurate; his assumption that the print was full size was not.

Two failures combined. The designer had left a feature undimensioned, and the setter had scaled a print in spite of the "DO NOT SCALE" note. The business detected the error at receiving inspection, when the inspector checked the chamfer against the model and found it undersized. The corrections were to dimension the chamfer, to add a 150 mm graduated line to the template so that any reduction is obvious, and to ask the machine shop to raise a query rather than scale when a dimension is missing. The chamfer was cosmetic, so the parts were accepted on concession; on a functional feature, they would have been scrap.

## Exercise: a long shaft

The business also needs a drawing of a pump shaft 900 mm long, with diameters between 25 mm and 35 mm and several small grooves for retaining rings. Choose a sheet and scale from the preferred options, and explain your choice.

**Worked answer.** At 1:1, the shaft needs about 900 mm of length plus margins and dimension space. A3 is 420 mm long, and even the elongated A3 × 3 sheet is 891 mm, which is shorter than the shaft before any borders are allowed. Full size is not practical.

At **1:2**, the shaft is drawn **900 ÷ 2 = 450 mm** long. That does not fit on A3, but it fits on **A2**, which is 594 mm long, leaving about 144 mm for borders and dimension space. The diameters become 12.5 to 17.5 mm on the sheet, still readable.

At **1:5**, the shaft is **900 ÷ 5 = 180 mm** long and fits on A3, but the diameters shrink to 5 to 7 mm, and the grooves become fractions of a millimetre.

A sensible choice is A2 at 1:2 for the main view, with enlarged details of the ring grooves at 2:1 or 5:1, and "SCALE 1:2 OR AS SHOWN" in the title block. Another option is to show the shaft at 1:2 with a conventional break to save length. Either way, every feature is dimensioned, so nobody needs to scale the print.
