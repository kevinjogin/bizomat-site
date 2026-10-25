---
book: layouts-that-plot-to-scale
chapterSlug: dimension-styles-that-scale
order: 5
title: "Dimension styles that scale"
description: "Size dimensions for any viewport with an overall scale, layout scaling or annotative styles, decide between model-space and paper-space dimensions, and keep the measurement factor at 1."
draft: false
---

A dimension has two kinds of number in it. One is the value it displays, the measured distance, which must be the real size of the object whatever the view scale. The other is the size of its parts: the height of its text, the length of its arrowheads, the gap between the extension line and the object. Those must be the right size on paper. A dimension style controls both, and the settings that control them are easy to confuse.

This chapter separates them. It shows how to make a dimension's parts print at the right size in any viewport, compares dimensions placed in model space with those placed in paper space, and explains the one setting that changes the displayed value, the measurement or linear scale factor, and why it should almost always be left at 1. The running case dimensions the take-up frame's views and details and untangles a dimension that read half its true value.

## The parts of a dimension, sized for paper

A dimension style sets the size of each part of a dimension. This is an illustration. The running case office's style, for its A3 sheets, uses these paper sizes:

- text height 3.5 mm, with the text 1.5 mm clear of the dimension line;
- arrowheads 3 mm long, closed and filled;
- extension lines starting 2 mm from the object and extending 2 mm beyond the dimension line;
- baseline dimensions spaced 8 mm apart, the second and later rows of Chapter 2's allowance.

Those are sizes on paper. The question for each viewport is how the program turns them into sizes in the space where the dimension is drawn.

## Three ways to scale a dimension's parts

**An overall scale factor.** Every size in the style is multiplied by one number. For dimensions drawn in model space and seen through a 1:10 viewport, the overall scale must be 10: the text is drawn 35 mm high in model space and prints at 3.5 mm. In AutoCAD this is the dimension scale, DIMSCALE, set on the style's Fit tab as "use overall scale of". It is simple and works, but the style is then tied to one view scale, and an office needs a style, or an override, for every scale it uses.

**Scale to the layout.** The program takes the overall scale from the viewport through which the dimension is being created, so dimensions drawn through a 1:10 viewport get a factor of 10 and through a 1:2 viewport a factor of 2. In AutoCAD this is the "scale dimensions to layout" option, equivalent to a DIMSCALE of 0. It removes the need for one style per scale, but the result depends on which viewport was active when each dimension was created, which is invisible afterwards.

**Annotative dimensions.** As with text in Chapter 4, an annotative dimension style specifies the paper sizes, and each dimension carries the annotation scales at which it appears. The program calculates the model sizes for each scale. A dimension that appears in two viewports at different scales carries both and prints at the same size in each.

```figure
type: compare
title: Model-space sizes of the office's dimension parts
cols: Overall scale | Text height | Arrowhead | Baseline spacing
caption: This is an illustration. Each paper size multiplied by the overall scale, which equals the viewport's scale denominator for reductions and its reciprocal for enlargements.
- General arrangement, 1:20 | 20 | 70 mm | 60 mm | 160 mm
- *Frame views, 1:10 | 10 | 35 mm | 30 mm | 80 mm
- Detail A, 1:2 | 2 | 7 mm | 6 mm | 16 mm
- Detail B, 2:1 | 0.5 | 1.75 mm | 1.5 mm | 4 mm
```

## Model-space or paper-space dimensions

Dimensions can be drawn in either space, and both are legitimate.

**In model space**, the dimension sits with the geometry it measures. It moves when the geometry moves, appears in any viewport that shows that region at a matching annotation scale, and is part of the model if the model is used elsewhere. It needs one of the scaling methods above.

**In paper space**, the dimension is drawn on the layout, over the viewport, at paper size, with an overall scale of 1. Most current programs can make such a dimension associative with the model geometry it is snapped to through the viewport, so that it measures the model distance and updates if the geometry changes. Its parts never need scaling, because they are drawn in paper millimetres. Its weaknesses are that it does not move if the viewport's view is panned, and that if association is lost, by an older file format or a viewport change, the dimension may show the paper distance, 160, rather than the model distance, 1,600. For non-associative paper-space dimensions, programs offer a measurement factor applied in paper space only, which must then match each viewport's scale.

This is an illustration. The office chose model-space annotative dimensions for the frame sheet. The frame model is also attached to the general arrangement, and the office wanted the frame's own dimensions to travel with it but stay hidden on the general arrangement, which shows only overall sizes. Annotative dimensions carrying only the frame sheet's scales do exactly that.

```figure
type: balance
title: Dimensions in model space or in paper space
left: Model space
right: Paper space
caption: Both work. Choose one per office and per kind of drawing, and write the choice into the drafting standard.
- Moves with the geometry and with the view | Always the right size; no scaling of parts
- Travels with the model into other drawings | Stays put if the view is panned
- Needs a scaling method: overall, layout or annotative | Depends on association to measure the model, not the paper
- One dimension can serve several viewports if annotative | One dimension per viewport
```

## The measurement factor: the setting that changes the value

The settings above change the size of a dimension's parts. One more setting changes the value it displays. It is called the measurement scale or linear scale factor; in AutoCAD it is DIMLFAC, on the Primary Units tab. The displayed value is the measured distance multiplied by this factor.

With a full-size model, the correct value of the measurement factor is **1**, always, for model-space dimensions. The model is at full size, so the measured distance is the real distance. Autodesk's own help advises against changing it from 1 except in special cases.

The factor exists for geometry that is not at full size: a view drawn scaled, or a detail made by copying and enlarging geometry. In that case, a factor of 1 ÷ (the scaling) restores the true value. The trouble is that the factor belongs to the style or the dimension, not to the geometry, so a dimension that uses it on full-size geometry displays a wrong value, and nothing on the drawing shows that the factor is not 1.

## The error: half the frame

This is an illustration. Detail B, the take-up lug at 2:1, existed on an older version of the frame drawing in a form inherited from the office's board-drafting days: the lug's geometry had been copied and scaled up by 2 in model space, beside the frame, and dimensioned there. Its dimensions measured the enlarged copy and read 80 for the 40 mm lug width and 26 for the 13 mm slot. Someone had fixed that by creating a dimension style called "DETAIL 2:1" with a measurement factor of 0.5, so the dimensions read 40 and 13.

Months later, a drafter dimensioning a new cross rail in the front view picked the wrong style from the list. The new dimension, measuring full-size geometry, read 1,600 × 0.5 = **800**. The checker caught it, because the rail's dimension disagreed with the overall length beside it: an 800 mm rail across a 1,600 mm frame.

The office's fix had three parts. Delete the scaled copy and rebuild Detail B as a 2:1 viewport onto the full-size lug, so that its dimensions measure true geometry with a factor of 1. Delete the "DETAIL 2:1" style. And add a check: list every dimension style in the drawing and confirm that each has a measurement factor of 1; any that does not is a finding, and any dimension using it must be explained. The same check catches dimensions whose text has been overridden, the related fault from Chapter 7 of *Drafting Geometry by the Numbers*.

```figure
type: checklist
title: Dimension style check before release
caption: This is an illustration of the office's routine. Run it on every drawing, including those started from older templates.
- Measurement factor 1 in every style | Any other value is a finding
- No overridden dimension text | Every value measured from the geometry
- Paper sizes match the office standard | 3.5 mm text, 3 mm arrows, 8 mm baseline spacing
- Annotative dimensions carry each viewport's scale | And no scale for viewports that should not show them
- Paper-space dimensions still associated | Each measures the model, not the paper
- x A style named for a scale with a measurement factor | The usual sign of scaled geometry somewhere
```

## Precision is not scale

A dimension style also sets how many decimal places a value shows, and it is tempting to tie precision to scale: whole millimetres for a 1:10 view, decimals for a 2:1 detail. The connection is coincidental. Precision should follow the function of the feature, not the size of the view. The frame's 1,600 mm length is a whole-millimetre dimension because a welded frame is made to the nearest millimetre or so, not because it is drawn at 1:10. The lug's 13 mm slot might need a tolerance because a take-up screw must slide in it, and that would be true at any scale.

What scale does affect is legibility. A dimension with a two-line tolerance occupies more height than a plain value, so a view crowded at 1:10 may need its toleranced features moved into a detail, where there is room for the tolerance to be read. That is a layout decision, made in the planning of Chapter 2, not a dimension style setting. Zero suppression is similar: whether a value reads 13 or 13.0 is a matter of the office's convention and the precision the feature needs, and it should be the same in every viewport, so that a reader comparing a value in the front view with one in a detail is never misled by a trailing zero that one view shows and the other does not.

## Leaders and multileaders

Leader notes, balloons and multileaders have styles of their own, with their own arrowhead sizes, landing lengths and text heights. They scale by the same three methods as dimensions: an overall scale, a scale taken from the viewport, or annotative behaviour. An office that makes its dimensions annotative but leaves its multileader style at a fixed overall scale has solved half the problem: the dimensions print correctly in every viewport and the leaders print at the size for whichever view the style was set up for. The release check should look at both. The office's multileader style uses the same 3.5 mm text and 3 mm arrowheads as its dimensions and is annotative too.

## No dimensions between viewports

A dimension measures distance in one space. A paper-space dimension drawn from a feature in the 1:10 front view to a feature in the 1:2 Detail A measures a paper distance between two views at different scales, which means nothing. Even between two viewports at the same scale, a paper-space dimension measures the gap between the views on the sheet, not a distance on the object, unless the views are aligned and the program associates each end with model geometry. The safe rule is that every dimension lies entirely within one view.

## The running case: dimensioning the frame

With the scaled copy gone, the drafter dimensioned the frame in model space with the office's annotative dimension style. Overall dimensions and rail positions carry the 1:10 scale only. The bearing pad slide's dimensions carry 1:2 and appear only in Detail A. The lug's 40 mm width and 13 mm slot carry 2:1 and appear only in Detail B. The lug's position along the frame, a 1:10 dimension, appears only in the front view.

Each dimension therefore appears once on the sheet, in the view where it reads best, which is what a drawing should do anyway: a dimension shown in two views is a dimension that can disagree with itself after an edit. The checker confirmed it by measuring a dimension's text on the print in each viewport, 3.5 mm every time, and by reading the values against the model.

## Measuring a dimension on the print

The final proof that a dimension style scales correctly is a ruler on the printed sheet. Three measurements cover it: the height of a dimension's text, the length of an arrowhead and the spacing between two baseline rows. On the frame sheet they should be 3.5 mm, 3 mm and 8 mm in every viewport. A view whose dimensions measure 1.75 mm or 7 mm has a scale mismatch, and the factor of the mismatch, a half or a double, says which viewport's scale was used to size them. The check takes less than a minute per sheet and catches what no on-screen inspection reliably does, because on screen every viewport can be zoomed until its dimensions look fine.

## Exercise: the wrong overall scale

Before the office moved to annotative dimensions, a drafter dimensioned the bearing pad slide in Detail A using a style with an overall scale of 10, intended for the 1:10 views. What size would the dimension text and arrowheads print in the 1:2 detail, and what should the overall scale have been? Would the values be correct?

**Worked answer.** With an overall scale of 10, the text is drawn 3.5 × 10 = 35 mm high in model space and the arrowheads 30 mm long. Seen through the 1:2 viewport, with a factor of 0.5, they print at 35 × 0.5 = **17.5 mm** and 30 × 0.5 = **15 mm**. The detail would be swamped by dimensions five times their intended size.

The overall scale should match Detail A's denominator, **2**, giving 7 mm text and 6 mm arrowheads in model space and 3.5 mm and 3 mm on paper.

The values would be correct either way. The overall scale changes only the size of the parts; the measurement factor, still 1, decides the value. That is the distinction this chapter turns on: one setting makes the dimension readable, the other makes it true, and only the first should ever change with the view scale.
