---
book: layouts-that-plot-to-scale
chapterSlug: plotting-and-pdf-output-that-holds-scale
order: 8
title: "Plotting and PDF output that holds scale"
description: "Set up plots and PDFs that print at true size: paper size, plot area, 1:1 scale, offsets, vector or raster output, printer scaling, and a check bar that proves the result."
draft: false
---

Everything so far happens inside the drawing file. The last link in the chain of scales, sheet to print, happens outside it, in a page setup, a PDF driver and a print dialog that the drafter often never sees, because the person printing is a workshop hand, a site engineer or a supplier's estimator on the other side of the country. Each of those can quietly scale the sheet. A drawing that is perfect in the file can still reach the bench at 96.6% of its size.

This chapter covers the settings that make a plot or PDF exactly the size of the sheet, the difference between vector and raster output, the printer settings that undo it, and the check bar that lets anyone prove a print is true. The running case issues the take-up frame set as PDFs and traces a print that came out small.

## The page setup

Each layout has a page setup that tells the plot how to turn the sheet into output. For a layout drawn at paper size, the essential settings are:

- **Paper size** equal to the layout's sheet: ISO A3, 420 × 297 mm, landscape.
- **Plot area** set to the layout, so that the whole sheet is the plotted region, rather than the display, the extents of whatever is drawn, or a window picked by eye.
- **Scale 1:1**, one paper millimetre to one millimetre, never "fit to paper".
- **Offset** set so that the layout's origin lands on the paper's origin, or centred, consistently for every sheet.
- **Plot style table** and line weight settings as Chapter 7 describes.

Save the page setup with a name and apply it to every layout, ideally from the template, so that a new sheet inherits it. A layout plotted with "fit to paper" or "extents" may look right and be a few per cent out, because the extents of a sheet are its outermost object, not its edges.

```figure
type: checklist
title: Page setup for an A3 layout that prints true
caption: This is an illustration of the office's saved setup. Any departure must be deliberate and noted on the print.
- Paper size ISO A3, 420 × 297 mm, landscape | Matches the layout's sheet exactly
- Plot area: layout | The whole sheet, not extents, display or a window
- Scale 1:1 | One paper millimetre per millimetre
- Plot style table and line weights as the office standard | Monochrome for manufacturing drawings
- Vector PDF output | Raster only for drawings that contain images
- x Fit to paper | Scales the sheet to whatever the device can print
- ? Printer margins | Confirm the device can print the whole sheet, or plot to a larger paper
```

## PDF page size

A PDF is the most common way a drawing is issued, and its page size is the first thing to check. PDF measures pages in points of 1/72 inch, 0.3528 mm. An A3 landscape page is 1,190.55 × 841.89 points; A4 portrait is 595.28 × 841.89. Most PDF viewers show the page size in millimetres in the document properties. If an A3 drawing's PDF reports anything other than 420 × 297 mm, the plot was not at 1:1 on an A3 sheet, and the error is in the page setup, not the printer.

PDF drivers built into CAD programs usually take the paper size from the page setup. Generic PDF printers built into operating systems sometimes substitute the nearest size they know, or add margins, so the office uses the CAD program's own PDF output for issued drawings.

## Vector and raster

A vector PDF stores lines, arcs and text as geometry. It prints at any size without loss, line widths are exact, text remains searchable, and a reader can zoom in on a detail indefinitely. A raster PDF stores the sheet as an image of pixels, at a resolution chosen when it was made.

This is an illustration. At 300 dots per inch, a pixel is 25.4 ÷ 300 = 0.085 mm, so a 0.25 mm thin line is about three pixels wide, and the A3 sheet is an image of 4,961 × 3,508 pixels. At 150 dots per inch, the same line is about 1.5 pixels wide, so it renders as one or two pixels, and fine dashes start to merge. Raster output is sometimes forced by images or shaded content on the sheet; when it is, use at least 300 dots per inch for a drawing that will be printed and measured.

For the running case, all three sheets are line drawings, so the office issues them as vector PDFs. Vector output also keeps the files compact and sharp: the same sheet as a raster image at 300 dots per inch would hold 4,961 × 3,508, or over 17 million, pixels, and still lose detail when a reader zooms in on a phone beside a machine.

## The printer can undo all of it

A correct PDF can still print at the wrong size, because the print dialog in most PDF viewers offers page-scaling choices: actual size, fit, shrink oversized pages, or a custom scale. "Fit" and "shrink" scale the page so that it fits the printer's printable area, which on most printers is smaller than the paper by a few millimetres each side.

This is an illustration. The workshop's A3 printer has a printable area of about 410 × 287 mm. Printing the A3 PDF with "fit" scales it by the smaller of 410 ÷ 420 = 0.976 and 287 ÷ 297 = 0.966, so by **0.966**. Every length on the print is 3.4% short: the 1:10 front view becomes effectively 1:10.35, the 160 mm bottom rail measures 154.6 mm, and the sheet's notes and line widths shrink by the same factor. Nothing on the print shows that it happened.

Printing at "actual size" keeps the 1:1 scale but may clip the outer few millimetres of the sheet if the printer cannot reach them. The office's template keeps everything inside a 10 mm border for that reason: on most printers, an actual-size print loses only blank margin.

## Calculating what a fit will do

Because "fit" scales by the smaller of two ratios, its effect can be predicted for any sheet and printer. The calculation is worth doing once for each printer the drawings will meet, so that a reduced print can be recognised by its factor alone.

```figure
type: formula
title: Scale factor of a print fitted to a printable area
formula: k = min(printable width ÷ sheet width, printable height ÷ sheet height)
formula: effective view scale = stated scale ÷ k
caption: This is an illustration. Printable areas vary by printer and driver; measure yours by printing a sheet with marks at its edges.
- k | Factor applied to every length, width and text height on the print
- Sheet | 420 × 297 mm for A3 landscape
step: A3 printer, printable 410 × 287 mm: k = min(0.976, 0.966) = 0.966
step: A4 printer, printable 287 × 200 mm: k = min(0.683, 0.673) = 0.673
step: Front view at 1:10 fitted to A4: effective scale 1:14.85; the 160 mm rail measures 107.7 mm
```

A factor close to 0.97 is the signature of an A3 sheet fitted to an A3 printer, and close to 0.67 of an A3 fitted to A4. A factor of exactly 0.707 means a deliberate A-series reduction. Knowing the signatures, a checker who measures a check bar at 96.6 mm knows at once what happened, and who to ask to change a setting.

## Measuring a PDF on screen

PDF viewers with measuring tools measure in the page's own units, paper millimetres, unless told otherwise. Many can be calibrated with a scale ratio, so that a measurement in the 1:10 front view reads model millimetres directly. That is useful for checking and dangerous for everything else: the calibration applies to the whole page, so a measurement taken in Detail A at 1:2 with a 1:10 calibration reads five times too long.

The office's rule is to measure PDFs uncalibrated, in paper millimetres, and multiply by the scale denominator of the view being measured, exactly as with a ruler on a print. The scale register from Chapter 3 gives the expected paper lengths, so the check needs no calibration at all: the bottom rail should measure 160 mm on the PDF, the wear strip 100 mm, the lug 80 mm.

A PDF measured on screen proves the file. Only a measured print proves the print. Both checks are needed when a drawing will be used for anything physical, because each catches failures the other cannot.

## The check bar

Since a print can be scaled without trace, the sheet must carry its own proof of size. The simplest is a **check bar**: a line or graduated bar of known length, drawn in paper space on the template, such as a 100 mm bar beside the title block, labelled with its length. Anyone holding a print can measure it. If it measures 100 mm, the print is at full size and every view is at the scale its note states. If it measures 96.6 mm, the print has been reduced by 0.966, and so has everything else.

The check bar works because it is in paper space and so is unaffected by any viewport. It is a measurement of the last link in the chain only. Viewport scales are proved by the scale register of Chapter 3; the check bar proves that the sheet itself reached the paper at 1:1.

```figure
type: bars
title: The 100 mm check bar on three prints of the same PDF
unit: mm
max: 100
caption: This is an illustration. The bar's measured length is the print's scale factor times 100; every view on the sheet is scaled by the same factor.
- *Actual size on A3 | 100
- Fit to the A3 printer's printable area | 96.6
- Fit to an A4 printer's printable area | 67.3
```

## The error: the frame printed at 96.6%

This is an illustration. The workshop cut and drilled the take-up frame's side plates from printed copies of the frame sheet, and the setter, checking the first plate against the print with a rule, found its overall length measured 1,600 mm on the plate but 154.6 mm on the 1:10 view, not 160 mm. The setter, sensibly, did not trust the print and raised a query.

The office's PDF was correct: 420 × 297 mm, vector, plotted 1:1. The workshop's print dialog had been left on "fit", which on its A3 printer scales by 0.966. The check bar on the print confirmed it at 96.6 mm.

Nothing had been made wrong, because the setter worked from the dimensions, as the "do not scale" note requires, and only measured the print as a sanity check. But the office took two actions. It asked the workshop to set its PDF viewer's default to actual size and to check the bar on every new print, and it added the scale note "SCALE 1:10 ON A3 AT 100%" to its title block so that the condition for the stated scale is visible.

## Plotting from the CAD program directly

Plotting directly to a printer from the CAD program avoids the PDF viewer's scaling but meets the same printable-area problem in the driver. A plot at 1:1 to a device that cannot reach the sheet's edges either clips them or, if the page setup's offset is relative to the printable area rather than the paper edge, shifts the whole sheet by the margin. A shifted sheet still measures correctly, but its border may be cut off on one side.

The office's routine for a new printer is to plot the template's empty layout once, measure the check bar and the frame, and confirm that all four sides of the border appear. It keeps a page setup for each printer it uses, named after the device, so that the settings are not rebuilt by memory.

Batch plotting a whole set, which most programs offer, applies each layout's own page setup, so a set plotted in one operation is only as consistent as its layouts. Before a batch plot of a revised set, the drafter lists the page setup on every layout and confirms each is the saved office setup, not a one-off created to plot a quick check print. A single layout left on "fit to paper" in a set of twenty is easy to miss and produces one sheet in twenty that is not at its stated scale.

## The running case: issuing the set

This is an illustration. For the first issue of the take-up frame set, the drafter plotted all three layouts to vector PDF with the saved A3 page setup and opened each to check:

- page size 420 × 297 mm in the document properties;
- line widths visible with the viewer's line weight display on, and outlines visibly heavier than thin lines;
- every viewport's register length correct when measured with the viewer's measuring tool, which works in the PDF's own units;
- the 100 mm check bar measuring 100 mm.

Each PDF was named with its drawing number and revision. The issue note to the workshop said: "Print at actual size on A3. Check bar must measure 100 mm."

## Exercise: a print from the site

A site engineer sends back a marked-up print of the frame sheet with a query. On the scanned print, the check bar measures 70.6 mm. What was the print's scale factor, at what effective scale is the front view, and how long would the bottom rail measure? Is the engineer's comment that the rail "scales at 1,130 mm" a design problem?

**Worked answer.** The bar's measured length divided by its true length gives the factor: 70.6 ÷ 100 = **0.706**. That is the A3-to-A4 ratio, 0.707, within measuring error, so the engineer printed the A3 sheet on A4 at the A-series reduction.

The front view's effective scale is 1:10 ÷ 0.706 = **1:14.2**. The 160 mm bottom rail measures 160 × 0.706 = 113 mm on the print. Measured with a 1:10 scale rule, that reads 1,130 mm, which explains the engineer's comment.

It is not a design problem. The rail is dimensioned 1,600 mm, and the drawing says not to scale it. The reply should point the engineer to the dimension and the check bar, and suggest that measurements taken from a reduced print be divided by the factor the check bar gives: 1,130 ÷ 0.706 = 1,600 mm. Chapter 9 adds a scale bar to sheets that are routinely reduced, so that readers can measure them directly.
