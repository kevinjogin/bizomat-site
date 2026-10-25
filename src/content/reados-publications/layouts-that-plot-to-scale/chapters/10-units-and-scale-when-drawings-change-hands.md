---
book: layouts-that-plot-to-scale
chapterSlug: units-and-scale-when-drawings-change-hands
order: 10
title: "Units and scale when drawings change hands"
description: "Keep scale true when files move between people and programs: drawing units and insertion scaling, unitless and inch files, references, PDF imports calibrated twice, and a size check."
draft: false
---

A drawing that is perfectly scaled in its own file can arrive somewhere else at the wrong size. A supplier's block drawn in inches is inserted into a millimetre drawing; a customer's DXF has no units at all; a PDF of an existing machine is imported and traced; a model is attached to a site plan drawn in metres. Each transfer carries an assumption about what one drawing unit means, and when the assumption is wrong, everything is wrong by the same factor: 25.4, or 1,000, or something odder.

The good news is that these errors are usually large and always uniform, so a single known length exposes them. This chapter covers how CAD programs record units, how they scale inserted and attached content, what to do with files whose units are missing or wrong, how to calibrate an imported PDF and prove the calibration, and a short size check for anything that arrives from outside. The running case brings in a supplier's bearing, a customer's PDF and the frame's own model attached to the general arrangement.

## What a drawing unit means

A CAD file stores numbers, not millimetres. A line from (0, 0) to (1,600, 0) is 1,600 units long; whether that is 1,600 mm, 1,600 inches or 1,600 metres is a matter of convention. Most programs record the convention in a setting, the insertion units, which in AutoCAD is the INSUNITS variable: a code meaning millimetres, inches, metres or unitless, among others.

The setting does not change the geometry. Its job is to tell the program how to scale content that comes in from another drawing. When a block or reference whose file says inches is inserted into a drawing that says millimetres, the program multiplies it by 25.4, so that a 7.5 inch housing arrives 190.5 mm long. When either file says unitless, there is nothing to convert from or to, and the content arrives at 1:1, which is right only if both files happen to use the same unit.

The office's templates all say millimetres. That single setting protects every drawing started from them, provided that what comes in also says what it is.

```figure
type: compare
title: How a 7.5 inch bearing housing arrives in a millimetre drawing
cols: Source file says | Target says | Inserted length | Correct?
caption: This is an illustration. The geometry in the source file is 7.5 units long; the units settings decide how it is scaled on insertion.
- *Inches into millimetres | Inches | Millimetres | 190.5 mm | Yes
- Unitless into millimetres | Unitless | Millimetres | 7.5 mm | No, 25.4 times too small
- Millimetres, wrongly, into millimetres | Millimetres | Millimetres | 7.5 mm | No; the source setting is wrong
- Inches into unitless | Inches | Unitless | 7.5 units | No; the target cannot convert
```

## Files with missing or wrong units

Files from outside the office often arrive unitless, or with a units setting that does not match their contents. A DXF exported by a supplier's older software, a file converted from another program, or a drawing started from a foreign template may all carry the wrong setting. The geometry looks fine; the size may not be.

The test is a **known length**. Before using any incoming file, measure something whose real size you know independently: an overall dimension from the supplier's data sheet, a bolt spacing, a standard part. Compare the measurement with the real size and the ratio tells you the unit.

This is an illustration. A customer sends a DXF of the existing tail frame, unitless. Its bottom rail measures 62.992 units. The customer's drawing says the rail is 1,600 mm. The ratio is 1,600 ÷ 62.992 = 25.40, so the file is in inches. The drafter sets the file's units to inches before attaching it, and the program scales it correctly. A ratio of 1,000 would mean metres; a ratio of 1 means millimetres already; any other ratio means the file has been scaled, and its source should be asked.

## References and their base points

The take-up frame model is attached to the general arrangement as an external reference. Both files are in millimetres, so it attaches at a scale of 1, and the general arrangement's 1:20 viewport shows it at the right size.

Two other attachments are common in conveyor work and need more thought.

**Site plans in metres.** Civil and building drawings are often in metres. A millimetre model attached to a metre drawing must be scaled by 0.001, or the program must do it from the units settings. A conveyor 6,000 units long dropped into a metre plan without scaling is six kilometres long, which is at least obvious.

**Large coordinates.** Site drawings are often placed on a survey grid, with coordinates in the hundreds of thousands of metres. A mechanical model drawn near the origin will be attached at a long way from the site geometry unless it is attached by an agreed base point: a known corner of the conveyor placed at an agreed site coordinate. The base point and its site coordinate should be written on both drawings.

**Manufacturers' blocks.** Bearing housings, motors, gearboxes and fasteners are often downloaded from a manufacturer's library as blocks or 2D drawings. They are a great time saver and a frequent source of unit errors, because a library may serve the same part in inch and millimetre versions, or serve one file whose units setting reflects the software that exported it rather than the part. This is an illustration. The bearing supplier's downloaded housing for the take-up frame came as a unitless file, and inserted 7.5 mm long beside a 1,600 mm frame. In a viewport showing only the bearing pad region, the tiny housing was easy to mistake for a fixing detail until the drafter measured it against the data sheet's 190.5 mm. Setting the source file's units to inches and reinserting it fixed the size, and the office now keeps a vetted copy of each downloaded part, with its units confirmed, in its own library.

```figure
type: stats
title: The factors behind the usual unit errors
caption: When an incoming file is wrong by one of these ratios, the cause is almost always a units setting, not a drafting error.
- 25.4 | Inches to millimetres | Unitless or mislabelled imperial files
- 1,000 | Metres to millimetres | Civil and site drawings
- 0.3528 | PDF points to millimetres | Geometry imported from a PDF in points
- * Any other ratio | Scaled or traced geometry | Ask the source before using it
```

## Importing a PDF

PDFs are the most common way existing drawings arrive, and many CAD programs can import a vector PDF as lines, arcs and text, or attach it as an underlay to trace over. Either way, the import has two scale problems at once.

**The unit.** A PDF measures in points of 0.3528 mm. Some imports convert to millimetres of paper; others bring in the point values as drawing units. The 160 mm bottom rail of a 1:10 view arrives either 160 units long or 453.54 units long, depending on the program and its import settings.

**The view scale.** Even in paper millimetres, the imported geometry is at the scale of the view it came from. A 1:10 view must be scaled up by 10 to become full size, a 1:20 view by 20.

The reliable method handles both at once: **calibrate against a known dimension and confirm against a second**. Scale the imported geometry so that one dimensioned feature measures its stated value, then measure a second, independent dimensioned feature. If it also matches, the calibration is right. If it does not, something on the original was not to scale, or the PDF itself was a scan with distortion.

```figure
type: formula
title: Calibrating imported geometry and proving it
formula: k = stated dimension ÷ measured length        check = (k × second measured length) ÷ second stated dimension
caption: This is an illustration. The check must equal 1 within the accuracy needed. A check of 1.30 means the calibration feature was not to scale.
- k | Scale factor to apply to the imported geometry
- Stated dimension | The value written on the original drawing, mm
- Measured length | The same feature measured in the imported geometry, in its units
step: 1:10 view imported in points: rail 1,600 mm measures 453.54, so k = 3.5278
step: Same view imported in paper millimetres: rail measures 160, so k = 10
step: Second check, paper-millimetre import: end view height 600 mm measures 60, and 10 × 60 ÷ 600 = 1.000
```

## The error: calibrated on a broken view

This is an illustration. The customer's general arrangement of the existing conveyor arrived as a vector PDF, and the drafter imported it to check the new take-up frame against the existing head end. The drafter calibrated on the conveyor's overall length, dimensioned 6,000 mm, which measured 230 mm on the PDF. The scale factor was 6,000 ÷ 230 = 26.09.

The second check failed. The leg spacing, dimensioned 2,000 mm, measured 100 mm on the PDF and so 2,609 mm after calibration. Looking at the PDF again, the drafter saw a pair of break lines in the middle of the conveyor: the view had been shortened with a conventional break, so the 6,000 mm dimension spanned a drawn length of only 230 mm, not the 300 mm that 1:20 would give.

The overall dimension was true but the view was not to scale along its full length, so it could not be used for calibration. The drafter recalibrated on the leg spacing, 2,000 ÷ 100 = 20, which matched the sheet's stated 1:20, and confirmed it against the head pulley's diameter. The rule that went into the office's checklist was simple: never calibrate on a dimension that crosses a break, a dimension marked "not to scale" or an overall dimension of a long view, and always confirm with a second dimension in a different direction.

## Scans and distortion

A scanned drawing adds one more problem: the scale may not be the same in both directions, because paper stretches and scanners are not perfect. A second dimension in the other direction tests for it. If the horizontal and vertical factors differ by more than a few tenths of a per cent, a single uniform scale cannot correct the image, and READOS's chapter [Rebuilding CAD geometry from scans and PDFs](/reados/collections/cad-modelling-and-design-intent/rebuilding-cad-geometry-from-scans-and-pdfs/) explains how to rebuild from the dimensions instead of tracing.

Even an undistorted scan or a vector import is only as accurate as the original drawing. Traced geometry should be labelled as such on its layer, used for checking and layout, and rebuilt from real dimensions before anything is made from it. For the running case, the existing head end traced from the customer's PDF sits on a layer named as reference geometry, in a muted plot style, and the new take-up frame is placed against it only for a clearance check. Every dimension the workshop will use on the new frame comes from the office's own full-size model.

## Sending files so that others get the scale right

The same problems arrive at the other end when the office sends its own files out, and most of them can be prevented at the sending end. The office's habit for any file that leaves it, whether a DXF to a cutter, a model to a customer or a reference to a site contractor, is to make the units impossible to misread.

Every outgoing CAD file has its units set to millimetres, never unitless. Every transmittal note states the units in words: "All files in millimetres, model at full size." Where a file will be attached to someone else's drawing, the note also gives the base point and, for site work, its agreed coordinates. A DXF for cutting contains the part at full size and in millimetres, as *Drafting Geometry by the Numbers* recommends, with nothing on it that could be mistaken for geometry. And every drawing PDF carries its scale notes, scale bars and the 100 mm check bar from Chapter 8, so that the recipient can measure it.

The office also sends one known length in the transmittal, in words: "Bottom rail 1,600 mm." It costs nothing and gives the recipient the first step of the size check without having to find a dimension. A recipient who measures 62.992 knows at once that their software has read the file as inches, and can fix it before anything is made.

```figure
type: checklist
title: Before a file leaves the office
caption: This is an illustration. Each item prevents one of the unit or scale errors in this chapter at its source.
- Units set to millimetres | Never unitless
- Model at full size | No scaled geometry; no measurement factors
- Units stated in the transmittal | In words, with one known length
- Base point stated for references | With site coordinates where the recipient works on a survey grid
- PDF carries scale bars and the check bar | So a printed or imported copy can be measured
- x Geometry traced from a PDF sent as design data | Label it as reference only, or rebuild it first
```

## A size check for anything that arrives

The office runs the same three-step check on every block, reference, DXF and PDF that comes from outside:

1. **Read its units setting**, if it has one, and note whether it is unitless.
2. **Measure a known length** and compute the ratio to its real size. Recognise 1, 25.4, 1,000 and 0.3528; question anything else.
3. **Confirm with a second known length**, in the other direction where possible, before using the content for anything that matters.

The check takes two or three minutes. Unit errors are rarely subtle once measured, but they are surprisingly easy to miss when nobody measures, because a bearing at a twenty-fifth of its size, seen alone in a viewport, still looks like a bearing.

## Exercise: three files from outside

The office receives three files for the take-up frame project. For each, what has happened and what should be done?

1. A DXF of the bearing pad from the supplier, unitless, whose length measures 7.874 units. The data sheet says the pad is 200 mm long.
2. A site plan whose conveyor centreline, known to be 6,000 mm long, measures 6.000 units.
3. A vector PDF of the frame's existing guard, imported in points, whose 450 mm width, shown in a 1:10 view, measures 127.56 units.

**Worked answer.**

1. 200 ÷ 7.874 = **25.40**, so the DXF is in inches. Set its units to inches, or scale it by 25.4, and confirm a second dimension, such as its width, against the data sheet.
2. 6,000 ÷ 6.000 = **1,000**, so the site plan is in metres. Attach the millimetre model to it at 0.001, or set the units so the program scales it, and agree a base point for its position on the site grid.
3. In the 1:10 view, the 450 mm width is 45 mm on paper, which is 45 ÷ 0.3528 = 127.56 points. The ratio 450 ÷ 127.56 = **3.528** is 10 × 0.3528, the view scale times the point size. Scale the imported geometry by 3.528 to make it full size, then confirm with a second dimension in the other direction, and treat the result as traced reference geometry, not as the guard's design.
