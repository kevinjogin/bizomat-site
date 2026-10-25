---
book: layouts-that-plot-to-scale
chapterSlug: model-at-full-size-sheet-at-paper-size
order: 1
title: "Model at full size, sheet at paper size"
description: "Why the model is drawn at full size and the sheet at paper size, how the chain of scales from object to print works, and what belongs in model space and what in paper space."
draft: false
---

A drawing board forced a decision before the first line was drawn: at what scale would the object go on the paper? Every length was divided by the scale as it was drawn, and the drawing could never be anything but that scale. CAD removed the decision from the drawing of the object and moved it to the presentation. The object is drawn once at its true size, and the sheet shows it at whatever scale suits each view.

That separation is the single most useful idea in CAD drafting, and the source of most scale errors when it is half understood. This chapter sets out the two spaces a CAD drawing uses, the chain of scales that connects the object to the printed sheet, and the rule for what belongs in each space. It introduces the running case, the conveyor take-up frame, and sets up its A3 sheet.

## Two spaces, two kinds of millimetre

A CAD drawing that uses layouts has two coordinate spaces.

**Model space** holds the object. One drawing unit represents one millimetre of the real object, so the take-up frame, 1,600 mm long, is drawn 1,600 units long. Its geometry is true: a distance measured in model space is the real distance, and a dimension placed on it reads the real value without any adjustment. Everything that is the design, outlines, centrelines, holes, welds, goes here.

**Paper space**, which most programs call a layout or sheet, represents the sheet of paper. One unit represents one millimetre of paper, so an A3 sheet is 420 units wide. The border, the title block, the sheet notes and the view titles are drawn here at the size they will print. Paper space also holds **viewports**: rectangular windows through which the model is seen at a chosen scale.

The two kinds of millimetre are different things. A 3.5 mm note on the sheet is 3.5 paper millimetres. The frame's 1,600 mm length is 1,600 model millimetres. A viewport at 1:10 shows those 1,600 model millimetres in 160 paper millimetres. Keeping the two apart is the whole discipline of this book.

## The chain of scales

Between the real object and the printed sheet there are four links, each a ratio:

1. **Object to model**: always 1:1. The model is the object at full size.
2. **Model to viewport**: the view scale, such as 1:10. This is the only link that is not 1:1, and each viewport has its own.
3. **Viewport to sheet**: 1:1. The viewport sits on the sheet in paper units.
4. **Sheet to print**: 1:1 for a print at the intended size. A plot at any other scale changes every view on the sheet by the same factor.

The size of anything on the printed sheet is its model size multiplied by all four ratios. With the first, third and fourth at 1:1, it is simply the model size times the view scale. The frame's length at 1:10 prints as 1,600 × 0.1 = **160 mm**.

When a print comes out at the wrong size, one of these links is wrong, and the arithmetic tells you which. If every view is wrong by the same factor, including the border and the title block, the plot link is wrong. If one view is wrong and the others are right, that viewport's scale is wrong. If the geometry measures wrong in model space itself, the model is not at full size.

```figure
type: steps
title: The chain of scales for the frame's front view
caption: This is an illustration. Only the viewport link changes size; every other link should be exactly 1:1.
- Object to model, 1:1 | The 1,600 mm frame is drawn 1,600 model units long
- *Model to viewport, 1:10 | The viewport shows it 160 paper units long
- Viewport to sheet, 1:1 | The viewport sits on the A3 sheet at that size
- Sheet to print, 1:1 | The A3 sheet prints at 420 × 297 mm
- Printed result | The frame measures 160 mm on paper; a ruler at 1:10 reads 1,600 mm
```

## What belongs in each space

A short rule covers most cases:

- **In model space**: everything that is part of the object or depends on its geometry. Outlines, hidden lines, centrelines, hatching of sectioned material, weld symbols attached to the geometry, and usually the dimensions, because they measure the geometry.
- **In paper space**: everything that is part of the sheet. The border and title block, revision table, general notes, projection symbol, view titles and scale notes, and any sheet-level tables such as a parts list.

Dimensions can live in either space, and Chapter 5 compares the two. Text that describes a feature, such as a note pointing to a weld, can too. The deciding question is whether the item should move with the geometry if the view is moved or rescaled. A view title should stay on the sheet; a leader note pointing at a hole should follow the hole.

## The running case: the frame and its sheet

This is an illustration. The take-up frame's overall size is 1,600 × 450 × 600 mm. It is drawn once, in model space, at full size, as a 2D drawing with its front, plan and end views laid out side by side in model space so that projection lines can be drawn between them.

The sheet is the office's A3 landscape template: 420 × 297 mm, with a 10 mm border on every side, giving a drawing frame of 400 × 277 mm, and a 180 × 50 mm title block in the bottom right corner. The template is a paper-space layout; it contains no model geometry.

The drafter's first estimate of the views at 1:10, from the overall sizes alone:

- front view: 1,600 × 600 mm becomes **160 × 60 mm**;
- plan: 1,600 × 450 mm becomes **160 × 45 mm**;
- end view: 450 × 600 mm becomes **45 × 60 mm**.

Those fit comfortably in the 400 × 277 mm frame, with room for dimensions, two enlarged details and notes. Chapter 2 does the fit test properly. Chapter 3 sets the viewports.

```figure
type: svg
title: The take-up frame's A3 sheet
alt: An A3 landscape sheet with a border and a title block at the bottom right. In third-angle layout, the plan view sits above the front view and the end view sits to the right of the front view, each drawn as a rectangle at 1:10. To the right, two detail viewports: Detail A of the bearing pad slide at 1:2 and Detail B of the take-up screw lug at 2:1.
caption: This is an illustration, drawn at one paper millimetre per unit. Each rectangle is a viewport showing the full-size model at the scale beside it.
viewbox: 0 0 440 317
body:
<rect class="bx" x="10" y="10" width="420" height="297"/>
<rect class="lf" x="20" y="20" width="400" height="277"/>
<rect class="bxi" x="240" y="247" width="180" height="50"/>
<text class="txs" x="250" y="276">Title block 180 × 50</text>
<rect class="bxa" x="50" y="80" width="160" height="45"/>
<text class="txs" x="54" y="72">Plan, 1:10, 160 × 45</text>
<rect class="bxa" x="50" y="150" width="160" height="60"/>
<text class="txs" x="54" y="226">Front view, 1:10, 160 × 60</text>
<rect class="bxa" x="240" y="150" width="45" height="60"/>
<text class="txs" x="232" y="226">End, 1:10</text>
<rect class="bx" x="305" y="80" width="100" height="60"/>
<text class="txs" x="308" y="72">Detail A, 1:2</text>
<rect class="bx" x="315" y="160" width="80" height="60"/>
<text class="txs" x="318" y="236">Detail B, 2:1</text>
<path class="cl" d="M130 130V145M215 180H235"/>
<text class="txs" x="22" y="314">A3 sheet 420 × 297, frame 400 × 277</text>
```

## Why not draw it smaller

The alternative to a full-size model is to scale the geometry to fit the sheet: draw the frame 160 units long and the sheet at 420 units, so that everything is at 1:10 in one space. Drafters trained on the board sometimes do this, and older drawings are often found this way. It looks harmless and causes four problems.

1. **Dimensions read wrong.** A dimension measures the geometry, so it reads 160, not 1,600. The drafter must override every dimension or set a measurement factor of 10, and Chapter 5 shows how fragile that is.
2. **Details need separate geometry.** An enlarged detail cannot be a second view of the same geometry, because the geometry is only at one scale; it has to be copied and scaled, and then kept in step with the original by hand.
3. **The file is no use downstream.** A cutting contractor, a CNC programmer or a colleague inserting the frame into an assembly receives geometry at a tenth of its size.
4. **Scale changes are expensive.** If the frame later needs to go on an A2 sheet at 1:5, every line, dimension and note must be rescaled.

A full-size model avoids all four. The cost is learning to set viewports and annotation scales, which the rest of this book covers.

## The error: the frame that came back a tenth of its size

This is an illustration. The office's first version of the take-up frame, inherited from an older drawing, had been drawn in one space at 1:10, with the border and title block at full size and the geometry scaled down. The dimensions had been overridden to show full-size values. The printed drawing looked correct.

When the office sent the frame's side plates to a laser cutter as a DXF exported from that drawing, the cutter's nesting software reported plates 160 mm long instead of 1,600 mm. The cutter queried the order before cutting, which saved the material, and the drafter listed the geometry: the frame's bottom rail measured 160.000 units.

The fix was to scale the geometry up by a factor of 10 about the origin, so that it was at full size, delete every override so that the dimensions measured the true geometry, and rebuild the sheet as a paper-space layout with viewports at 1:10. The check that confirmed it: the bottom rail now measured 1,600.000 units in model space, its dimension read 1,600 without an override, and the printed view measured 160 mm with a ruler. The office added one line to its standard: geometry is always drawn at full size.

## Measuring the two spaces

Three quick measurements tell you which space you are in and whether it is right.

- **In model space**, measure a known feature of the object. It must read its real size: the frame's bottom rail is 1,600 mm.
- **In paper space**, measure the sheet. The A3 frame must read 400 × 277 and the title block 180 × 50.
- **On the printed sheet**, measure a known length with a ruler and divide by the view scale. At 1:10 the bottom rail must measure 160 mm.

If all three agree with expectation, the chain is intact. The next chapters add the scale-dependent settings, each of which needs its own version of the third check.

```figure
type: compare
title: Frame features in model space and on the sheet
cols: Model size | Scale | Size on the sheet | Legible?
caption: This is an illustration. The same full-size model gives every view; a feature too small at the main scale gets its own detail viewport.
- Overall length | 1,600 mm | 1:10 | 160 mm | Yes
- Bearing pad slide | 200 × 120 mm | 1:10 | 20 × 12 mm | Barely
- Bearing pad slide, Detail A | 200 × 120 mm | 1:2 | 100 × 60 mm | Yes
- Take-up slot, 13 × 40 mm | 13 × 40 mm | 1:10 | 1.3 × 4 mm | No
- *Take-up lug, Detail B | 40 × 30 mm | 2:1 | 80 × 60 mm | Yes
```

## Units, precision and the origin

Full size means nothing unless the drawing knows what its unit is. Every CAD drawing has a units setting that says what one drawing unit represents, and for Australian mechanical work it should say millimetres. The setting does not change the geometry; a line 1,600 units long is 1,600 units long whatever the setting says. What it changes is how other drawings, blocks and exchange files interpret those units, which Chapter 10 covers. A template that says millimetres removes the question for every drawing started from it.

The display precision, the number of decimal places shown for lengths and coordinates, is a separate setting. Two or three decimal places suit most mechanical work. It does not round the stored geometry, only what you see, and a dimension style has its own precision for the values printed on the sheet.

The origin matters more than it seems. The frame's model is drawn with the outside corner of its bottom rail at (0, 0). Every coordinate is then a distance from a corner of the frame, a viewport's view can be centred on a round-number point, and a colleague who inserts the frame into the conveyor's general arrangement can place it by that corner. A model drawn thousands of millimetres from the origin, often the result of copying from another drawing, works but makes every one of those steps harder.

## Several sheets from one model

The take-up frame's set has three sheets, and the office has two ways to organise them. In the first, one drawing file holds the frame's full-size model and several layouts, one per sheet, each with its own viewports onto the same model. In the second, each sheet is its own file, and the model is attached to each as an external reference, so that it is drawn once and shown in many places.

Both keep the essential property: one full-size model, many scaled views. The first is simpler for a small set; the second suits larger projects where several people work on different sheets. What neither allows is a second copy of the geometry drawn at another scale, because the copy will drift from the original the first time someone edits one and not the other.

For the running case, the office keeps the frame and the bearing pad in one file with two layouts, the frame sheet and the pad sheet, and attaches the frame to the conveyor's general arrangement file as a reference. The general arrangement's viewport shows the attached frame at 1:20, and any change to the frame appears on all three sheets.

## Exercise: one model, three scales

The frame's 13 mm wide take-up slot needs dimensioning. At 1:10, how big is it on the sheet? What scale would make it readable, given that the office wants a slot like this at least 20 mm wide on paper, and what does the same viewport show of a 6 mm fillet weld beside it?

**Worked answer.** At 1:10, the 13 × 40 mm slot is 1.3 × 4 mm on paper, too small to dimension.

To be at least 20 mm wide on paper, the slot needs a view scale of at least 20 ÷ 13 = 1.54, so the next preferred enlargement scale, **2:1**, is the smallest that works. At 2:1, the slot is 26 × 80 mm on paper. Detail B, the take-up lug, uses that scale.

In the same 2:1 viewport, a 6 mm fillet weld appears with legs of 12 mm on paper, large enough for its weld symbol and leader to sit clearly beside it.

All three views, front view at 1:10, Detail A at 1:2 and Detail B at 2:1, show the same model geometry. If the slot is later widened to 15 mm, the drafter edits the model once and every viewport shows the change.
