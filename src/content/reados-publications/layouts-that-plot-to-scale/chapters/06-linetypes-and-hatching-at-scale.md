---
book: layouts-that-plot-to-scale
chapterSlug: linetypes-and-hatching-at-scale
order: 6
title: "Linetypes and hatching at scale"
description: "Calculate the printed dash length of hidden and centre lines and the spacing of hatching in every viewport, choose global and paper-space linetype settings, and fix lines that print solid."
draft: false
---

Hidden lines and centrelines carry meaning through their pattern. A hidden line is a hidden line because it is dashed; a centreline is recognised by its long and short dashes. Print them with the wrong dash length and the meaning goes: dashes too long and a short hidden edge prints solid, indistinguishable from a visible one; dashes too short and a centreline prints as a grey blur. Hatching works the same way. Sectioned material is recognised by evenly spaced lines, and at the wrong scale they are either a few lonely strokes or a solid black patch.

Both are scale problems with a simple arithmetic, complicated only by the settings a CAD program uses to apply it. This chapter sets out that arithmetic, explains the common settings using AutoCAD's names as one example, and shows how to choose them so that every viewport on a sheet prints the same pattern. The running case fixes a sheet on which every hidden line printed solid.

## How a linetype is defined

A linetype is a repeating pattern of dashes, gaps and dots, each with a length in drawing units. This is an illustration. The running case office's linetype file, written for printing at paper size, defines:

- **hidden**: a 6 mm dash and a 1.5 mm gap, repeating every 7.5 mm;
- **centre**: an 18 mm long dash, 1.5 mm gap, 1.5 mm short dash and 1.5 mm gap, repeating every 22.5 mm.

Those lengths are intended as paper millimetres: a hidden line on the printed sheet should show 6 mm dashes. Linetype files supplied with CAD programs come in versions intended for inch and millimetre drawings, with different base lengths, so check which file your template loads and what its dash lengths are before calculating anything. Your own standard's dash lengths may differ from the office's; the arithmetic below does not.

## The settings that scale a dash

The printed length of a dash is its defined length multiplied by several factors. In AutoCAD they are:

- **LTSCALE**, a global factor for the whole drawing;
- **the object's own linetype scale**, CELTSCALE for new objects, normally 1;
- **PSLTSCALE**, a per-layout switch. Set to 1, the default, model-space objects seen through a viewport have their dashes measured in paper units, so that viewports at different scales show the same dash length. Set to 0, dashes are measured in the units of the space that created the object, so a model-space line's dashes are scaled by the viewport factor like everything else in the model.

There is also MSLTSCALE, which applies the annotation scale to linetypes on the model tab itself; it affects how lines look while drafting in model space, not how they print through layout viewports.

So, for a model-space line seen through a viewport with factor f:

- with PSLTSCALE = 1: paper dash = defined dash × LTSCALE × object scale;
- with PSLTSCALE = 0: paper dash = defined dash × LTSCALE × object scale × f.

After changing any of these, most programs need the drawing regenerated before the viewports show the new pattern. A print taken before regenerating may show the old one.

```figure
type: formula
title: Printed dash length of a model-space line seen through a viewport
formula: PSLTSCALE = 1: dash on paper = d × LTSCALE × s
formula: PSLTSCALE = 0: dash on paper = d × LTSCALE × s × f
caption: AutoCAD's names, as one example. Other programs have equivalent settings under other names; the arithmetic is the same.
- d | Dash length in the linetype definition, 6 mm for the office's hidden line
- s | The object's own linetype scale, normally 1
- f | The viewport's scale factor, 0.1 at 1:10
step: Office setting, PSLTSCALE 1 and LTSCALE 1: 6 × 1 × 1 = 6 mm in every viewport
step: Old setting, PSLTSCALE 0 and LTSCALE 10, in the 1:10 view: 6 × 10 × 1 × 0.1 = 6 mm
step: Old setting in the 2:1 Detail B: 6 × 10 × 1 × 2 = 120 mm
```

## Two consistent ways to set them

There are two self-consistent arrangements.

**Paper-space scaling.** PSLTSCALE = 1 and LTSCALE = 1, with a linetype file defined at paper size. Every viewport, at any scale, prints 6 mm hidden dashes. This is the arrangement the office chose, because it needs no change when a viewport is added or rescaled.

**Model-space scaling.** PSLTSCALE = 0 and LTSCALE equal to the main view's scale denominator, 10 for a sheet whose views are at 1:10. The main views print correctly, but any viewport at another scale does not: Detail A at 1:2 prints 30 mm dashes and Detail B at 2:1 prints 120 mm dashes. This arrangement suits drawings with a single view scale, and was common before layouts with mixed scales became normal. On a mixed-scale sheet it fails.

What does not work is a mixture of the two.

```figure
type: compare
title: Printed hidden-line dash length in each viewport
cols: 1:10 views | Detail A, 1:2 | Detail B, 2:1
caption: This is an illustration with a 6 mm defined dash. Only the first row gives the same pattern everywhere.
- *PSLTSCALE 1, LTSCALE 1 | 6 mm | 6 mm | 6 mm
- PSLTSCALE 0, LTSCALE 10 | 6 mm | 30 mm | 120 mm
- PSLTSCALE 1, LTSCALE 10 | 60 mm | 60 mm | 60 mm
- PSLTSCALE 0, LTSCALE 1 | 0.6 mm | 3 mm | 12 mm
```

## The error: hidden lines that printed solid

This is an illustration. The take-up frame sheet was started from a template that had been converted from an older single-scale template. Its LTSCALE had been set to 10, for 1:10 sheets in model space, and the conversion had left PSLTSCALE at its default of 1. Both settings were reasonable on their own. Together they scaled the dashes twice.

Every hidden line on the sheet printed with 60 mm dashes. The frame's hidden features are short on paper: the hidden inner wall of a rail in the end view is 45 mm long, and the hidden take-up screw bore in the front view about 25 mm. A 60 mm dash is longer than either line, so each printed as a single unbroken stroke. The front view looked as if the screw bore were a visible edge on the outside of the lug.

The fitter who assembled the first frame read it that way, and asked why the bore was not on the outside. The drafter, looking on screen in model space, saw dashed lines and could not reproduce the problem until printing the sheet. The fix was to set LTSCALE to 1 on the sheet, leaving PSLTSCALE at 1, and regenerate. The office corrected its template and added a line to the release check: print, or zoom the layout to its printed size, and confirm that every hidden line shows at least two dashes.

## Short lines and the dash pattern

Even with correct settings, a line shorter than one dash prints solid. A hidden line must be long enough on paper to show its pattern, or it is read as visible.

This is an illustration. At 1:10, a hidden Ø13 hole through a lug is 1.3 mm long on paper, shorter than the 6 mm dash, and prints as a tiny solid stroke. The 45 mm hidden rail wall shows six complete patterns. Short hidden features at small scales are another reason for details: in Detail B at 2:1, the same hole is 26 mm long on paper and prints as three dashes and part of a fourth.

Most programs also let a linetype be generated continuously across the vertices of a polyline, rather than restarting at each vertex. Without that, a polyline made of many short segments, such as a hidden profile with small fillets, can print solid even though its total length is long. The office sets continuous generation on its templates' polylines.

## Centrelines and centre marks

Centrelines need more care than hidden lines, because their pattern has two kinds of dash and their ends matter. A centreline should cross a circle's centre on a long dash, or at the crossing of two short dashes, and should extend a little beyond the feature it marks. With a 22.5 mm repeat on paper, where the pattern falls along a line depends on where the line starts, so a centreline drawn the length of the feature may happen to cross the centre in a gap.

The practical answer, for centrelines through holes, is to use the program's centre mark or centreline objects, which place a cross at the centre and extend the lines by a set amount on paper, and to scale them with the same method as dimensions. For the frame's take-up screw bore at 1:10, a centre mark sized for paper, with arms extending 3 mm beyond the hole, extends 30 mm beyond it in model space. On a Ø13 hole that is 1.3 mm across on paper, the mark is larger than the hole, which is correct: the mark locates the feature for dimensioning even when the feature itself is too small to see.

Long centrelines, such as the frame's axis of symmetry in plan, are drawn as lines with the centre linetype, and their pattern takes care of itself over their length. Their ends should extend a few millimetres on paper beyond the outline, which at 1:10 means a few tens of millimetres in the model.

## Paper-space linework

The border, title block and any lines drawn directly on the layout are paper-space objects. Their dashes are always in paper units, whatever PSLTSCALE says, scaled only by LTSCALE and their own linetype scale. That is one more reason to keep LTSCALE at 1 on a sheet that uses paper-space scaling: a value of 10 would make any dashed line in the title block, such as a fold mark, ten times too long as well.

## Linetypes in exported files

Two exports treat linetypes differently, and both matter for the running case.

A **PDF** exported as vector output prints each dash exactly as the layout shows it, so a sheet that prints correctly exports correctly. A PDF exported as a raster image keeps the dashes too, but at the image's resolution, which Chapter 8 covers.

A **DXF** or other exchange file carries the linetype definitions and the scale settings, but the receiving program may interpret them differently, and a cutting contractor's software ignores linetypes entirely. Cutting files should contain only continuous linework, on a layer set to a continuous linetype, so that a hidden line left in by mistake is not cut as a dashed path. The take-up frame's side plates go to the laser cutter as continuous outlines with no hidden or centre lines at all.

## Hatching at scale

Hatch patterns follow the same arithmetic as linetypes. A pattern is a set of lines with a defined spacing and angle, and it is drawn in the space it belongs to. A model-space hatch in a viewport with factor f prints its lines at the defined spacing times its hatch scale times f.

This is an illustration. The office's section hatch is a set of 45° lines 3 mm apart on paper. In the frame's 1:10 views, a model-space hatch must have a scale of 10, giving 30 mm spacing in the model and 3 mm on paper. In Detail A at 1:2, it needs a scale of 2. An annotative hatch, which most current programs support, takes its scale from the viewport's annotation scale and removes the calculation.

The bearing pad's cut face in Detail A is about 200 × 120 mm of model. At the correct hatch scale of 2, the lines are 6 mm apart in the model and about 38 lines cross the section. If the hatch had been left at the 1:10 scale of 10, its lines would be 30 mm apart in the model and print 15 mm apart in the detail: eight sparse strokes that read more like construction lines than a section. At a scale of 1, the lines would print 1.5 mm apart, about 76 of them, dark enough to look nearly solid and needlessly heavy in the file.

```figure
type: bars
title: Hatch lines across the bearing pad section in Detail A
unit: lines
max: 80
caption: This is an illustration. 45° lines across a 200 × 120 mm cut face, printed through the 1:2 viewport. The office's 3 mm paper spacing needs a hatch scale of 2.
- Hatch scale 10, set for 1:10 | 8
- *Hatch scale 2, matching 1:2 | 38
- Hatch scale 1 | 76
```

## Hatching that belongs to the sheet

Not all hatching is a section. Some drawings use hatching or solid fills for zones, such as a shaded keep-out area on a general arrangement or a highlighted change area. Like text, these can live in paper space, drawn at paper size over the viewport, or in model space with the scaling above. The same test applies as for text: should it move with the geometry? A keep-out zone round the take-up frame's moving pulley should, so it goes in model space as an annotative hatch with the general arrangement's 1:20 scale.

## Exercise: a detail added at 5:1

The workshop asks for one more detail, of the weld preparation on the take-up lug, at 5:1. The sheet uses PSLTSCALE 1 and LTSCALE 1 with the office's 6 mm hidden dash, and annotative hatching with 3 mm spacing. What dash length and hatch spacing will print in the new detail, and what would they have been on the old template with PSLTSCALE 0 and LTSCALE 10 and a hatch scale of 10?

**Worked answer.** With PSLTSCALE 1 and LTSCALE 1, the hidden dash prints 6 × 1 × 1 = **6 mm**, as in every other viewport, because the dash is measured in paper units. The annotative hatch, given the 5:1 scale, prints at **3 mm** spacing. Nothing needs adjusting except adding the 5:1 annotation scale to the hatch and any annotative text.

On the old template, the new viewport's factor is 5. The hidden dash would print at 6 × 10 × 1 × 5 = **300 mm**, so every hidden line in the detail would print solid. A model-space hatch at a scale of 10 would print at 3 × 10 × 5 = **150 mm** spacing, which across a detail perhaps 100 mm wide means at most one line, or none. The new detail would show neither its hidden features nor its section, which is the strongest argument for the paper-space arrangement on any sheet with more than one scale.
