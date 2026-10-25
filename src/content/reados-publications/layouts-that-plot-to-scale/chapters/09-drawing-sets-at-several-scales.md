---
book: layouts-that-plot-to-scale
chapterSlug: drawing-sets-at-several-scales
order: 9
title: "Drawing sets at several scales"
description: "Organise a set whose sheets and views use different scales: scale notes, view titles that update, scale bars that survive reduction, cross-references, and a register of every scale in the set."
draft: false
---

A single sheet with one scale is easy to read: the scale is in the title block and every view obeys it. A set of sheets with general arrangements, assemblies, details and parts at half a dozen scales is not. The reader moves between sheets and views, follows a detail callout from one sheet to another, and needs to know at every moment what scale they are looking at and, if the print has been reduced, what scale it really is.

This chapter covers the conventions that make a mixed-scale set readable and the CAD practices that keep them true when the set changes: scale notes, view titles that take their scale from the viewport, scale bars that survive reduction, cross-references, and a register of every scale in the set. The running case organises the take-up frame set and catches a detail whose title had stopped telling the truth.

## Stating the scale

Each sheet states its scales in two places. The title block carries the main scale, and the views that use another scale carry their own. READOS's *Drawings That Make Parts* sets out the AS 1100.101 conventions: where one scale predominates, it goes in the title block followed by "OR AS SHOWN", and each other scale is written beside its view; where none predominates, the title block says "SCALES AS SHOWN" and every view is labelled.

This is an illustration. The take-up frame set uses:

- **Sheet 1, general arrangement**: 1:20 throughout, so the title block says "SCALE 1:20".
- **Sheet 2, take-up frame**: views at 1:10, Detail A at 1:2 and Detail B at 2:1, so the title block says "SCALE 1:10 OR AS SHOWN" and the details are titled "DETAIL A, SCALE 1:2" and "DETAIL B, SCALE 2:1".
- **Sheet 3, bearing pad**: 1:1, so "SCALE 1:1".

Since Chapter 8, the office's title block adds "ON A3 AT 100%" after the scale, because a scale is only true at the sheet size it was drawn for.

```figure
type: compare
title: Scale register for the take-up frame set
cols: Scale | Title block note | Register length | Expected on paper
caption: This is an illustration, as first issued, before Detail B moved. One row per viewport. The checker measures each register length on the print; the title block note and the view titles must agree with the scale column.
- Sheet 1, general arrangement | 1:20 | SCALE 1:20 | Conveyor 6,000 mm | 300 mm
- Sheet 2, front, plan and end views | 1:10 | SCALE 1:10 OR AS SHOWN | Bottom rail 1,600 mm | 160 mm
- Sheet 2, Detail A | 1:2 | As shown | Wear strip 200 mm | 100 mm
- *Sheet 2, Detail B | 2:1 | As shown | Lug width 40 mm | 80 mm
- Sheet 3, bearing pad | 1:1 | SCALE 1:1 | Pad length 200 mm | 200 mm
```

## View titles that update

A view title typed as plain text, "DETAIL B, SCALE 2:1", is true until someone changes the viewport's scale and forgets the title. Most CAD programs can put a **field** in text instead: a placeholder that reads a property of another object and displays its current value. A view title whose scale is a field linked to the viewport's scale property always shows the scale the viewport actually has.

Fields are worth using for the three items that most often go stale: view scales, sheet numbers in cross-references and the sheet count in the title block ("SHEET 2 OF 3"). Each is a fact that the drawing already knows, and typing it by hand creates a second copy that can disagree. Fields need updating before plotting, which most programs do automatically; check that yours does, because a field that last updated before a change shows the old value.

## The error: Detail B at 5:1, titled 2:1

This is an illustration. When the workshop asked for more room on the frame sheet, the drafter moved Detail B from sheet 2 to the bearing pad sheet, sheet 3, where there was space, and recreated its viewport. To show the lug's weld preparation more clearly, the new viewport was set at 5:1. The view title, copied from sheet 2 as plain text, still read "DETAIL B, SCALE 2:1", and the callout bubble on sheet 2's front view still said "B / 2", pointing to sheet 2.

The scale register caught the first fault. The register length for Detail B, the 40 mm lug width, should have measured 80 mm on paper at 2:1; on the new print it measured 200 mm. Two hundred divided by forty is five, so the viewport was at 5:1 and the title was wrong. A reader following the callout would have found no Detail B on sheet 2, which was the second fault.

The fix was to retitle the detail with a field linked to the viewport scale, which then read "SCALE 5:1", and to replace the callout's sheet number with a field linked to the detail's sheet, which read "B / 3". The drafter also had to add the 5:1 annotation scale to every annotative note and dimension in the detail, as Chapter 4 explained, since the 2:1 representations no longer showed. The office now builds every view title and callout from its template's field-based blocks.

```figure
type: steps
title: Moving a detail to another sheet without breaking the set
caption: This is an illustration of the office's routine after the Detail B fault. Each step updates one thing that refers to the detail.
- Create the new viewport | Set and lock its scale from the standard list
- Add its annotation scale | To every annotative note, dimension and hatch it shows
- Title it with fields | Scale from the viewport, letter from the callout
- Update the callout | Sheet number by field; check it reads the new sheet
- *Measure the register length | Lug width 40 mm must measure 40 × the new factor on the print
- Delete the old viewport | And confirm nothing on the old sheet still refers to it
```

## Scale bars

A scale note is useless on a reduced print, because it states the scale the sheet was drawn at, not the scale it was printed at. A **scale bar**, a graduated bar showing real distances at the view's scale, shrinks with the print and stays true. A reader who measures a feature on an A4 copy against the bar reads its real size without knowing the reduction.

Scale bars must match their view. A bar drawn for 1:10 is wrong beside a 1:2 detail. On a mixed-scale sheet there is one bar per scale, placed beside the views it serves. A bar can be drawn in paper space at the length that represents a round distance at its view's scale, or in model space as an annotative block scaled by its viewport; either way, it should be checked with the scale register.

This is an illustration. The office's bars are 100 mm long on paper, so that their length is easy to check with a ruler on a full-size print:

- for 1:10, the bar represents 0 to 1,000 mm, graduated every 100 mm, each graduation 10 mm apart on paper;
- for 1:2, it represents 0 to 200 mm, graduated every 20 mm;
- for 2:1, it represents 0 to 50 mm, graduated every 5 mm;
- for 1:20 on the general arrangement, 0 to 2,000 mm, graduated every 200 mm.

A good bar is easy to read at a glance and hard to misread. The office's bars alternate filled and open segments, so that each graduation can be counted without squinting, carry their real units at the end ("1000 mm"), and state their view's scale beside them ("SCALE 1:10"), so that a bar cannot be mistaken for one belonging to a neighbouring detail. Each bar is a block from the template, one per preferred scale, which means a bar is never drawn by hand and never drawn to the wrong length. The checker still measures one bar per sheet on the print, because a bar placed in the wrong space or inserted at the wrong scale is just as misleading as a wrong note.

The office now puts a scale bar on every sheet likely to be reduced, which in practice means every general arrangement and every sheet that goes to site.

## Choosing scales across a set

Scales are chosen view by view, but a set reads better when the choices follow a pattern. Three habits help.

**Keep an object at one scale wherever it appears in full.** The take-up frame is at 1:10 on its own sheet; if it also appeared in full on an assembly sheet, 1:10 there too would let a reader compare the two directly. The general arrangement is the exception, because its purpose is the whole conveyor.

**Use as few scales per sheet as the content allows.** Each extra scale is another scale bar, another annotation scale on every note and another chance for a mismatch. The frame sheet's three scales are about the useful limit for an A3 sheet; a fourth would usually mean a detail belongs on another sheet.

**Make the steps between scales meaningful.** A detail should be enough larger than its parent view to show something new. Detail A at 1:2 is five times the 1:10 views; a detail at 1:5, only twice as large, would rarely justify its space.

```figure
type: tree
title: The take-up frame set and its scales
caption: This is an illustration. Each sheet's main scale, with the views that depart from it. One full-size model sits behind every view.
- Full-size model | Frame, bearing pad and conveyor references
  - Sheet 1, general arrangement | 1:20 throughout
  - Sheet 2, take-up frame | 1:10 or as shown
    - Detail A, bearing pad slide | 1:2
  - Sheet 3, bearing pad | 1:1 or as shown
    - * Detail B, take-up lug, moved from sheet 2 | 5:1
```

## Revisions across a set

Because every view comes from one model, a change to the model can change several sheets at once. Widening the take-up slot from 13 mm to 15 mm changes the frame sheet's front view, the lug detail on sheet 3 and possibly the general arrangement, if the slot shows at 1:20. Each of those sheets has changed and needs its revision updated, its revision table filled in and its prints reissued, even though the drafter edited only one line in the model.

The office's register therefore has a second use. Beside each viewport it lists which parts of the model the view shows, so that when a part changes, the drafter can see at once which sheets are affected. For three sheets the list is short. For a set of thirty, it is the difference between reissuing the right sheets and discovering six months later that a site copy still shows the old slot.

## Reduced sets for site

Sites and workshops often receive drawings as reduced sets: A1 sheets on A3, A3 sheets on A4. A reduced set is perfectly usable if it is honest about what it is. The office marks every reduced print "REDUCED PRINT, ORIGINAL A3" in the margin, outside the drawing frame, so that the stated scales are read with the reduction in mind, and it relies on the scale bars for anyone who must take a measurement. A reduced set without scale bars should be treated by everyone as not to scale.

## Cross-references and key plans

A set holds together through its references: detail callouts that name a sheet, section markers that point to the view they cut, a general arrangement that names the frame sheet, a parts list that gives each part's drawing number. Every reference is a promise that the reader will find what it names, at the scale stated.

For a small set, references can be checked by hand at each issue: for each callout, find the detail on the named sheet and confirm its letter and scale. For a larger set, the CAD program's sheet set or project tools can maintain sheet numbers and titles in fields across all files. Either way, the check belongs in the release routine for the set, not just for each sheet.

A **key plan**, a small-scale outline of the whole conveyor with the area of the current sheet highlighted, helps a reader place a detail sheet in context. It is usually drawn at a scale too small to be stated meaningfully and labelled "NOT TO SCALE", or as a viewport at a stated scale with its own scale bar. For the take-up frame set, the frame sheet and the bearing pad sheet each carry a key plan in the top right corner: the conveyor's outline from the general arrangement, shown through a small viewport at 1:200 with the tail end shaded. It tells a reader on site, holding only sheet 3, which end of a 6 m conveyor the bearing pad belongs to, which no amount of dimensioning on that sheet can do.

## The running case: one register for the set

This is an illustration. The office keeps the set's scale register, the table above, as a non-plotting table on the general arrangement's layout, and the checker works through it for every issue: measure each register length on the printed set, confirm the title block note and the view title against the scale column, and follow each callout. For the three-sheet set it takes ten minutes. The register also shows at a glance whether the set's scales are well chosen: five viewports at five preferred scales, with each scale used for a reason.

## Exercise: scale bars for the frame sheet

The frame sheet has views at 1:10, Detail A at 1:2 and, after the move, nothing at 2:1. Design a 100 mm scale bar for each scale on the sheet. A site engineer then measures a reduced print: the 1:10 bar measures 70.7 mm and the bottom rail measures 113.1 mm. What is the rail's real length by the bar, and what would the engineer have got by applying the 1:10 note?

**Worked answer.** For 1:10, a 100 mm bar represents 100 × 10 = **1,000 mm**, graduated every 100 mm. For 1:2, it represents 100 × 2 = **200 mm**, graduated every 20 mm. Detail B is now on sheet 3, so no 2:1 bar is needed on sheet 2; sheet 3 needs bars for its 1:1 views, 0 to 100 mm, and for Detail B at 5:1, 0 to 20 mm.

On the reduced print, the 1:10 bar's 1,000 mm occupies 70.7 mm. The rail's 113.1 mm therefore represents 113.1 ÷ 70.7 × 1,000 = **1,600 mm**, its true length.

Applying the 1:10 note to the measured 113.1 mm gives 1,131 mm, 29% short. The bar gives the right answer without anyone needing to know that the print was reduced to 0.707.
