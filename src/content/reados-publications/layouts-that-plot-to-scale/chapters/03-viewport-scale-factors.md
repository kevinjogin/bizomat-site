---
book: layouts-that-plot-to-scale
chapterSlug: viewport-scale-factors
order: 3
title: "Viewport scale factors"
description: "Set each layout viewport to an exact scale factor, lock it, align views in projection, create enlarged details and catch a viewport zoomed by eye to a scale that is almost right."
draft: false
---

A viewport is a window in the sheet through which part of the full-size model is seen, magnified or reduced by a single number: its scale factor. Everything else in this book depends on that number being exactly right. Text heights, dimension sizes and linetype scales are all calculated from it, and the scale note beside the view promises it to the reader. A viewport at 1:9.73 labelled 1:10 is a small lie that no one can see on screen and that a ruler finds at once.

This chapter shows how to calculate and set the factor for any preferred scale, how to lock it so that it stays set, how to keep views aligned in projection when each is its own viewport, and how to build enlarged details. The running case sets the take-up frame's viewports and finds one that was set by eye.

## The scale factor

A viewport's scale factor is the number of paper millimetres that one model millimetre occupies inside it. For a reduction scale 1:n, the factor is 1 ÷ n; for an enlargement n:1, it is n. So:

- 1:10 has a factor of 0.1, and 1,600 model millimetres appear as 160 paper millimetres;
- 1:2 has a factor of 0.5;
- 2:1 has a factor of 2.

Programs set the factor in one of two ways. Most offer a list of standard scales on the viewport's properties, which sets the factor exactly. Many also allow a zoom relative to paper space units, written in AutoCAD, for example, as a zoom of 0.1XP for 1:10 or 2XP for 2:1, where XP means "times paper space". Both are exact. What is not exact is zooming with the mouse wheel or a window until the view looks the right size; that produces a factor such as 0.10277, which the program may display as a custom scale and which corresponds to no scale anyone would write.

```figure
type: compare
title: Scale factors for the running case's viewports
cols: Factor | Zoom relative to paper | 100 mm of model on paper
caption: This is an illustration. Factor = 1 ÷ n for 1:n, and n for n:1. Each viewport has exactly one factor.
- General arrangement, 1:20 | 0.05 | 0.05XP | 5 mm
- *Frame views, 1:10 | 0.1 | 0.1XP | 10 mm
- Detail A, bearing pad slide, 1:2 | 0.5 | 0.5XP | 50 mm
- Detail B, take-up lug, 2:1 | 2 | 2XP | 200 mm
```

## Set, then lock

Once a viewport's scale is set and the view is positioned within it, lock it. A locked viewport's scale and view cannot change by accident: rolling the mouse wheel inside it zooms the whole sheet instead of the model. Without the lock, the commonest cause of a wrong scale is a drafter double-clicking into a viewport to edit the model, rolling the wheel to see a feature better, and leaving the viewport at the new magnification.

A good habit is to set the scale from the list, pan the view into position, lock the viewport, and then check: select the viewport and read its scale. If the program shows a standard scale name, such as 1:10, the factor is exact. If it shows a custom value, something was zoomed by hand.

Viewport boundaries are objects on the sheet. Put them on their own layer, set not to plot, so that the boundary is visible while working and absent from the print. Some programs' default layer for viewports plots, which puts a rectangle round every view; check the first print.

## Aligning views in projection

The frame's front view, plan and end view are separate viewports, each showing a different region of the model, and they must line up on the sheet as they do in projection. Placing them by eye produces views that are nearly aligned, which is worse than obviously misaligned, because a reader carrying a feature across with a straight edge will trust it.

There are two exact methods.

**Align by a common point.** Pick a point visible in both views, such as the end of a centreline or the corner of a rail, and move one viewport so that the point lines up with the other view's point horizontally or vertically. Most programs have a command that does this directly; otherwise, move the viewport with a perpendicular snap to a construction line through the point in the other view. Moving a viewport moves its view with it, without changing its scale.

**Align by model coordinates.** If the views are drawn in model space in projection, with the plan directly above the front view, then a single wide viewport containing both, or two viewports whose view centres share the same model x coordinate, are aligned automatically. The drafter of the running case drew the frame's three views in model space in projection, which makes this the natural method.

After aligning, lock both viewports, then check by drawing a temporary line in paper space through the same feature in both views. If it passes through both, the views are aligned.

```figure
type: checklist
title: Setting a layout viewport
caption: This is an illustration of the office's routine. Every step has caught a fault on a real sheet somewhere.
- Viewport boundary on a non-plotting layer | Visible while working, absent from the print
- Scale chosen from the standard list | Reads as a named scale such as 1:10, not a custom value
- View positioned by panning, not zooming | Pan never changes the scale; zoom does
- Aligned with its projected neighbours | By a common point or by shared model coordinates
- Viewport locked | Wheel and zoom no longer change it
- x Scale set by zooming to fit | Produces a custom factor that matches no scale note
- ? Scale note beside the view | Must match the viewport's scale exactly
```

## Enlarged details

A detail is simply another viewport onto the same model, at a larger scale, clipped to the region of interest. Because it shows the same geometry, it cannot disagree with the main view, and it updates when the model changes.

The relationship between a detail and its main view is the ratio of their factors. Detail A at 1:2 is 0.5 ÷ 0.1 = **5 times** larger than the 1:10 views; Detail B at 2:1 is 2 ÷ 0.1 = **20 times** larger. That ratio is worth knowing, because it tells you how big the detail's boundary needs to be on the sheet. The bearing pad slide's region, about 200 × 120 mm of model, needs 100 × 60 mm at 1:2. The take-up lug's region, 40 × 30 mm, needs 80 × 60 mm at 2:1.

Details are often bounded by circles or irregular outlines rather than rectangles. Most programs can clip a viewport to any closed shape drawn in paper space, so a detail can be a circular viewport matching the circle that identifies it on the main view. The identifying circle on the main view and the detail's title, such as "DETAIL A, SCALE 1:2", go in paper space; the detail's dimensions go wherever the office's dimensioning method puts them, which Chapter 5 covers.

## Resizing, panning and what they do not change

Three operations on a viewport are easy to confuse. **Resizing** its boundary, by stretching a corner, changes how much of the model is visible but not its scale: the frame stays at 1:10 and more or less of it shows. **Panning** inside it slides the model under the window without changing the scale. **Zooming** inside it changes the scale. Only the last is dangerous, and locking the viewport stops it while still allowing the boundary to be resized.

That gives a reliable way to frame a view. Set the scale first, then pan so that the region of interest is roughly centred, then stretch the boundary until it shows exactly the region wanted with a little margin. For a detail, make the boundary match the region implied by the identifying circle on the main view. Do not try to fit the view to a boundary by zooming; fit the boundary to the view.

## Rotated views

Occasionally a view must be shown rotated, so that an inclined feature appears square to the sheet, or a long object drawn diagonally in a site model reads along the sheet. Most programs can twist the view inside a viewport by an angle without moving the model. The scale is unchanged, but two things need care. A view rotated on the sheet no longer projects directly from its neighbours, so it must be identified clearly, with its direction of viewing and its rotation, in the way the drawing standard your office follows sets out; the Library’s *Drawings That Make Parts* covers view arrangement under AS 1100. A reader who meets an unlabelled rotated view will try to project it from its neighbours and will read it wrongly, so the label matters more than the rotation itself. And dimension and text orientation inside a rotated viewport may follow the model or the sheet, depending on the method; Chapters 4 and 5 assume annotation that reads from the bottom or right of the sheet, which is easiest to keep with annotation placed in paper space or with styles that follow the viewport.

## A scale register for the sheet

A sheet with four or five viewports has four or five scales to check, and a set of sheets has many more. The office keeps a simple register on each layout, on a non-plotting layer, listing each viewport's name, its scale, the scale note that should appear beside it and one known model length with its expected size on paper.

This is an illustration. The frame sheet's register reads: front view 1:10, bottom rail 1,600 mm, 160 mm on paper; plan 1:10, same rail, 160 mm; end view 1:10, overall height 600 mm, 60 mm; Detail A 1:2, wear strip length 200 mm, 100 mm; Detail B 2:1, lug width 40 mm, 80 mm. The checker measures each of those five lengths on the print and ticks them off. It takes two minutes, and it is the only check that proves every viewport is at the scale its note claims.

## Layers per viewport

A layer can be visible in one viewport and frozen in another. That is useful when the same model holds annotation for several scales, or when a detail should not show the centrelines or hatching of its neighbours. For the frame, the drafter freezes the main views' dimension layer in the two details, and each detail's dimension layer in the main views, so that each viewport shows only the dimensions placed for it.

The control is per viewport, and it is invisible until something goes missing. When a feature appears in model space and not on the sheet, a viewport layer freeze is the first thing to check, before suspecting the plot settings.

## The error: a view at 1:9.73

This is an illustration. When the frame sheet was first checked, the checker laid a scale rule on the printed front view and found the bottom rail measured 164.4 mm instead of 160 mm. Every dimension on the view was correct, because the dimensions measured the full-size model, and the scale note said 1:10.

Selecting the viewport showed a custom scale of 1:9.73, a factor of 0.10277. The drafter had set it correctly at 1:10, then double-clicked into the viewport to fix a weld symbol, rolled the wheel to see it better, and left. The viewport had not been locked. At a factor of 0.10277, 1,600 mm appears as 1,600 × 0.10277 = 164.4 mm, which is what the checker measured.

The plan and end view were still at exactly 1:10, so the front view no longer lined up with them: the plan's ends were 2.2 mm inside the front view's ends at each side. That should have been visible on screen and was not, because the drafter was looking at the weld symbol.

The fix was to reset the viewport from the scale list to 1:10, realign it with the plan, and lock all the viewports on the sheet. The office added a check to its release list: measure one known length in every viewport on the print, and divide by the scale; the answer must be the model length to within the ruler's resolution. A 2.75% error is 4.4 mm on a 160 mm view and impossible to miss with a ruler; it is invisible without one.

```figure
type: bars
title: The front view's bottom rail on paper at the viewport's real factor
unit: mm
max: 170
caption: This is an illustration. 1,600 mm of model at each factor. The note said 1:10 in both cases; the ruler said otherwise.
- *Viewport at exactly 1:10, factor 0.1 | 160
- Viewport zoomed to 1:9.73, factor 0.10277 | 164.4
```

## Exercise: setting the general arrangement

The general arrangement sheet shows the 6,000 mm conveyor at 1:20, with the take-up frame attached as a reference, and a single enlarged view of the take-up frame's tail end at 1:5. What factors do the two viewports need, how long does the conveyor appear on paper, how much larger is the tail end view than the main view, and how big a boundary does the tail end view need if it shows a 900 × 700 mm region of the model?

**Worked answer.** The main viewport at 1:20 has a factor of 1 ÷ 20 = **0.05**. The conveyor's 6,000 mm length appears as 6,000 × 0.05 = **300 mm** on paper.

The tail end viewport at 1:5 has a factor of **0.2**. It is 0.2 ÷ 0.05 = **4 times** larger than the main view.

The 900 × 700 mm region needs a boundary of 900 × 0.2 = **180 mm** by 700 × 0.2 = **140 mm** on paper, plus room for its dimensions. That is a large viewport for the A3 sheet, whose clear area above the title block is 400 × 227 mm and which already holds a 300 mm main view with its plan. Chapter 2's fit test would show that 180 × 140 mm plus allowances does not fit beside a 336 mm wide group of views; the general arrangement should refer to the frame sheet instead, where the tail end is already shown at 1:10 with its own details.
