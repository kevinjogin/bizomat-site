---
book: layouts-that-plot-to-scale
chapterSlug: line-weights-and-reduced-prints
order: 7
title: "Line weights, plot styles and reduced prints"
description: "Assign plotted line widths that hold a clear hierarchy, understand why widths do not follow viewport scale, and calculate what survives when an A3 sheet is printed fit to A4."
draft: false
---

Line width is the one property on a drawing that does not change with view scale. A visible outline printed 0.5 mm wide is 0.5 mm wide in the 1:10 front view, the 1:2 detail and the 2:1 detail alike, because widths are specified as plotted millimetres. That makes line weights simpler than text or linetypes in one way and more fragile in another: they are set once, but they are only as good as the size the sheet is eventually printed at, and sheets are often printed smaller than intended.

This chapter covers how CAD programs assign plotted widths, how to build a hierarchy of widths that reads clearly, and what happens to widths and text when a sheet is reduced, whether deliberately to a smaller paper size or accidentally by a "fit to page" setting. The running case finds the hidden lines that vanished from the workshop's copies.

## Where a line's width comes from

A plotted line's width is decided by one of two routes, depending on how the drawing is set up.

**Object or layer line weights.** Each layer, or each object, carries a line weight in millimetres, and the plot uses it directly. This is the most transparent route: a layer called "visible" with a weight of 0.5 mm plots at 0.5 mm.

**Plot styles.** A plot style table maps properties to output. A colour-dependent table maps each object colour to a width, colour and screening, so that, for example, everything red plots black at 0.5 mm. A named plot style table assigns named styles to layers or objects. Either can override the line weight set on the layer, or pass it through. READOS's chapter [Controlling CAD output with plot style tables](/reados/collections/cad-drafting-and-drawing-standards/controlling-cad-output-with-plot-style-tables/) covers the choice in detail.

The trap is that the two routes combine. A layer with a 0.5 mm weight on a sheet whose plot style table maps its colour to 0.25 mm plots at 0.25 mm. On screen, with line weight display on, it shows 0.5 mm. Only a print, or a plot preview, tells the truth.

## A hierarchy that reads

The purpose of different widths is to separate the object from its annotation at a glance: outlines thick, everything else thin. A drawing whose lines are all the same width reads slowly, because the eye must work out which lines are the part.

This is an illustration. The running case office's A3 standard assigns:

- **0.5 mm** to visible outlines;
- **0.35 mm** to hidden lines, which must stay visible but recede;
- **0.25 mm** to dimensions, extension lines, leaders, centrelines and hatching;
- **0.5 mm** to the border and title block frame, and 0.25 mm to its internal lines.

The ratio of 2 to 1 between outline and thin lines is the important part; the absolute widths follow from the sheet size and how it will be printed. READOS's *Drawings That Make Parts* sets out the line groups that AS ISO 128.24 recommends, and a real office should take its widths from the standard its contracts call up.

```figure
type: compare
title: The office's plotted widths at full size and reduced
cols: A3 at 100% | A3 printed on A4, 70.7% | A3 fit to A4 printable area, 67.3%
caption: This is an illustration. Widths and text reduce with the whole page. A 0.25 mm thin line falls to about 0.17 mm when an A3 sheet is fitted to an A4 printer's printable area.
- *Visible outline | 0.50 mm | 0.35 mm | 0.34 mm
- Hidden line | 0.35 mm | 0.25 mm | 0.24 mm
- Thin lines | 0.25 mm | 0.18 mm | 0.17 mm
- Notes and dimensions | 3.5 mm | 2.47 mm | 2.36 mm
```

## Why widths do not follow the viewport

Text, dimensions, linetypes and hatching all need their size adjusted for each viewport's scale, as Chapters 4 to 6 showed. Line widths do not, because a width is a plotted property, applied to the line as it is drawn on paper, not a length in the model. A model-space outline seen through a 1:10 viewport and through a 2:1 viewport plots at 0.5 mm in both.

That is usually what a drawing needs. It does mean that the same edge looks heavier in a small-scale view, where the view is small and its lines are crowded, than in a detail. A 1:20 general arrangement with every edge at 0.5 mm can look dark and cluttered; some offices use a lighter outline width on general arrangements for that reason, by assigning their layers a different plot style in that layout.

There is one exception worth knowing. When a layout is plotted at a scale other than 1:1, for example a deliberate half-size plot of an A1 layout onto A3 from within the CAD program, most programs offer an option to scale line weights with the plot. With it off, lines keep their full specified widths on the smaller sheet, so a half-size plot looks twice as heavy relative to its views; with it on, widths shrink with the plot, exactly as if a full-size print had been reduced on a photocopier. Neither is wrong, but the choice should be deliberate, and the office records it in each plotting setup, so that a half-size check print always looks the same.

## Reducing a sheet

Sheets are printed smaller than their design size for good reasons: a workshop printer only takes A4, a checker wants a quick copy, a PDF is viewed on a laptop. The reduction scales everything on the page by the same factor: lines, text, views and the scale they represent.

Printing an A3 sheet on A4 at exactly the A-series ratio scales by 210 ÷ 297 = **0.707**. Printing it with a "fit to page" setting scales by whatever factor makes the sheet fit the printer's printable area, which is smaller than the paper. This is an illustration. If the workshop printer's printable area on A4 is 287 × 200 mm, leaving 5 mm margins, the A3 sheet's 420 × 297 mm must shrink to fit both directions: 287 ÷ 420 = 0.683 across and 200 ÷ 297 = 0.673 down. The smaller governs, so the factor is **0.673**.

At that factor, the office's 0.25 mm thin lines print at 0.168 mm and its 3.5 mm notes at 2.36 mm. The views shrink too: the 1:10 front view is now at 1:14.85 on the paper, so the 1,600 mm bottom rail measures 107.7 mm instead of 160 mm. Anyone who measured the reduced print and applied the note "SCALE 1:10" would be 33% out.

## The error: the hidden lines that vanished

This is an illustration. The take-up frame drawing's hidden-line layer had been copied from an older template, where it carried a weight of 0.13 mm. On the office's A3 prints it showed as a fine but clear dashed line, and nobody noticed that it was half the office's standard thin width, let alone its 0.35 mm hidden width.

The workshop printed its copies fit to A4, at 0.673. The hidden lines printed at 0.13 × 0.673 = **0.088 mm**, and the workshop's printer, at its draft setting, dropped many of the dashes altogether. On the copies on the shop floor, the frame's hidden take-up screw bores had disappeared. A fitter drilled a lug from the visible features only and missed one bore.

The detection came from the workshop: the fitter's question was why the A3 checking print showed a bore that the A4 copy did not. The fix was to set the hidden layer to the office's 0.35 mm, which prints at 0.24 mm even on a fitted A4, and to add a minimum to the office standard: no plotted width on an A3 sheet below 0.25 mm, so that the thinnest line on any likely reduction stays above about 0.17 mm. The office also asked the workshop to print at exactly 70.7% rather than "fit", which Chapter 8 makes easier.

```figure
type: bars
title: Printed width of a 0.13 mm line and the office's minimum
unit: mm
max: 0.4
caption: This is an illustration. Each width after fitting an A3 sheet to an A4 printable area at 0.673. The fine hidden line from the old template fell below what the workshop printer reliably drew.
- Old hidden layer, 0.13 mm | 0.088
- Office minimum, 0.25 mm | 0.168
- *Office hidden line, 0.35 mm | 0.236
- Office outline, 0.5 mm | 0.337
```

## Designing for the smallest likely print

The lesson of the vanished hidden lines generalises into a small calculation. Decide the smallest size the sheet will realistically be printed at, find its reduction factor, and set every width and text height so that it survives that reduction.

This is an illustration. The office decided that its A3 sheets must remain usable when fitted to an A4 printable area, a factor of 0.673, and that no printed line should fall below 0.17 mm and no text below 2.3 mm. Dividing by the factor gives the design minimums: 0.17 ÷ 0.673 = about 0.25 mm for lines and 2.3 ÷ 0.673 = 3.4 mm for text. The office's 0.25 mm thin lines and 3.5 mm notes meet both, with almost nothing to spare, which is why the standard forbids anything thinner or smaller on A3.

The same reasoning sets limits for larger sheets. An A1 sheet that might be printed on A3, at a factor of 0.499, needs thin lines of at least 0.17 ÷ 0.499 = 0.34 mm and text of at least 2.3 ÷ 0.499 = 4.6 mm. That is why larger sheets conventionally use heavier line groups and taller lettering, as the line groups in the drawing standards provide.

```figure
type: formula
title: Minimum design sizes for a sheet that will be reduced
formula: design width ≥ minimum printed width ÷ k        design text ≥ minimum printed text ÷ k
caption: This is an illustration with the office's printed minimums of 0.17 mm for lines and 2.3 mm for text. k is the reduction factor of the smallest likely print.
- k | Reduction factor: 0.707 for A3 on A4, 0.673 for A3 fitted to an A4 printable area, 0.499 for A1 on A3
step: A3 fitted to A4: lines ≥ 0.17 ÷ 0.673 ≈ 0.25 mm; text ≥ 2.3 ÷ 0.673 = 3.4 mm
step: A1 printed on A3: lines ≥ 0.17 ÷ 0.499 = 0.34 mm; text ≥ 2.3 ÷ 0.499 = 4.6 mm
```

## Line weights in PDFs

A vector PDF stores each line with its plotted width, so a PDF made from a correct plot carries the right widths. What the reader sees depends on the viewer. Many PDF viewers have a setting to display line weights; with it off, every line shows as a single pixel wide, and the hierarchy disappears on screen even though it is in the file. With it on, thin lines may still render at one pixel when the page is zoomed out to fit a laptop screen.

Neither affects the file, and both affect how a reviewer judges the drawing. When a reviewer reports that a PDF "has no line weights", check the viewer's setting before the plot settings. When a PDF will be printed, the printed result follows the stored widths and whatever scaling the print dialog applies, which is the subject of Chapter 8.

## Screening and colour

Plot styles can also print lines in grey or at a percentage screen, which is useful for reference geometry, such as the conveyor's existing structure drawn faintly behind new work, or for a background from another discipline. Screened lines reduce in intensity as well as width when printed small, and at 50% screen a 0.25 mm line on a fitted A4 can be very faint indeed. Use screening for information that may be lost without harm, and never for anything the reader must act on.

Colour prints raise the opposite risk: a drawing designed to be read in colour, with red for one thing and blue for another, loses that distinction on a monochrome copy. The office plots all its manufacturing drawings monochrome, so that the PDF and the workshop's copy look the same, and conveys meaning by line type and width, not colour. Colour is still useful on screen, where it helps a drafter see which layer an object is on; it simply should not carry anything the printed sheet needs. A quick way to confirm that is to plot one sheet monochrome and check that every distinction the drawing relies on, visible against hidden, section against outline, new against existing, can still be seen.

## Lines on screen and on paper

Most programs can display line weights on screen, but the display is an approximation scaled to the monitor's pixels, and it does not reduce when you imagine a fitted A4. The only reliable views of plotted widths are a plot preview at the intended paper size and the printed sheet itself. A quick test sheet helps: a layout with a short line at each of the office's widths, labelled, printed once on each of the office's printers and kept on the noticeboard. It shows what each printer actually draws at each width, and what survives a reduction.

## Exercise: the A1 general arrangement on A3

A customer's general arrangement for the whole conveyor line is an A1 sheet, 841 × 594 mm, with outlines at 0.7 mm, thin lines at 0.35 mm and 5 mm text, and the conveyor at 1:20. The office prints it on A3 at exactly the A-series ratio. What widths, text height and effective view scale result? Would the office's minimum be met?

**Worked answer.** A1 to A3 is two steps down the A series, so the factor is 420 ÷ 841 = **0.499**, about one half. The 0.7 mm outlines print at 0.35 mm, the 0.35 mm thin lines at 0.175 mm and the 5 mm text at 2.5 mm.

The 1:20 view becomes 1:20 ÷ 0.499 = about **1:40** on the A3 print. A 6,000 mm conveyor drawn 300 mm long on the A1 measures about 150 mm on the A3.

The thin lines, at 0.175 mm, are just above the office's practical floor of about 0.17 mm, and the text at 2.5 mm is legible but small. The print is fine for reading the layout and not for measuring. If the A3 copy will be used in the workshop, it should be marked as a reduced print with its true scale, for example "PRINTED AT A3: SCALE 1:40", or carry a scale bar, which Chapter 9 recommends for every sheet likely to be reduced.
