---
book: layouts-that-plot-to-scale
chapterSlug: planning-the-sheet-before-the-views
order: 2
title: "Planning the sheet before the views"
description: "Choose a sheet size and view scales by calculation: view envelopes, dimension allowances, the title block and notes, details at enlarged scales, and a fit test that avoids rework."
draft: false
---

A full-size model can be shown at any scale, which makes it tempting to skip the old drawing-board question of what will fit where. The views go on the sheet, the drafter nudges the viewports about until they look balanced, and the dimensions go on last. Then the dimensions collide, a note will not fit beside the title block, a detail lands on top of the revision table, and the views move again, taking their dimensions with them or, worse, leaving them behind.

Ten minutes of arithmetic before the first viewport avoids that. This chapter shows how to estimate the space each view needs, including its dimensions, how to test a sheet size and scale against the space available, and how to choose enlarged details for features too small at the main scale. The running case plans the take-up frame's A3 sheet and the conveyor's general arrangement.

## The space a view really needs

A view's envelope is its overall size at the view scale: the object's extent in the two directions the view shows, divided by the scale's denominator. The frame's front view at 1:10 is 1,600 ÷ 10 = 160 mm wide and 600 ÷ 10 = 60 mm high.

The envelope is not the space the view needs. Dimensions sit outside the outline, in rows. Notes, leaders and the view title need room too. A realistic allowance adds a band round each view for every row of dimensions on that side.

This is an illustration. The running case office's standard puts the first row of dimensions 10 mm from the outline and each further row 8 mm beyond the last, measured on paper. Two rows on a side therefore need 18 mm. For the planning estimate the drafter allows two rows on every side of each view, which is generous for some sides and tight for the overall dimensions; the estimate can be refined once the views are placed.

Because the allowance is in paper millimetres, it does not shrink with the view scale. A view at 1:10 needs the same 18 mm band as a view at 1:2. That is why small-scale views look crowded with dimensions: the object shrinks but its annotation does not.

```figure
type: formula
title: Fit test for a front view with a plan above and an end view beside it
formula: width needed = (L + D) ÷ n + 4 × a        height needed = (H + D) ÷ n + 4 × a
caption: This is an illustration for a third-angle layout. Four allowance bands across each direction: outside each view and on both sides of the gap between them.
- L, H, D | Object length, height and depth, mm: 1,600, 600 and 450
- n | Scale denominator, 10 for 1:10
- a | Dimension allowance per side on paper, 18 mm for two rows
step: At 1:10: width (1,600 + 450) ÷ 10 + 72 = 277 mm; height (600 + 450) ÷ 10 + 72 = 177 mm
step: At 1:5: width 410 + 72 = 482 mm; height 210 + 72 = 282 mm
```

## The space the sheet really offers

The sheet's usable area is its drawing frame less everything that already occupies it. For the office's A3 template:

- the frame inside the 10 mm border is 400 × 277 mm;
- the title block takes 180 × 50 mm in the bottom right corner;
- the strip to the left of the title block, 220 × 50 mm, is reserved for general notes;
- that leaves a clear area of **400 × 227 mm** above the title block and notes strip.

Some templates also reserve space for a revision table, a parts list or a key plan. Subtract each before testing a scale. The test then compares the views' needs with the clear area, leaving room for any details that will go beside them.

## The running case: testing scales for the frame

This is an illustration. The frame is 1,600 mm long, 600 mm high and 450 mm deep, shown in three views: front, plan above it and end view to its right, in third-angle projection.

At **1:10** on A3, the views need 277 × 177 mm against a clear area of 400 × 227 mm. They fit with 123 mm of width to spare, enough for a column of enlarged details, and 50 mm of height for view titles and leader notes.

At **1:5** on A3, they need 482 × 282 mm. Both exceed the clear area; 1:5 does not fit A3. On **A2**, whose frame inside the same 10 mm border is 574 × 400 mm with about 574 × 350 mm clear above a title block, 1:5 fits, but with only 92 mm of spare width for details.

The drafter chose A3 at 1:10. The views are small but legible, the whole frame reads at a glance, and the details carry the small features at larger scales. The A2 option would show the frame more generously but double the paper area for no new information, and the office prefers A3 because its workshop printers handle it.

```figure
type: compare
title: Sheet and scale options for the take-up frame
cols: Views need | Clear area | Spare width for details | Verdict
caption: This is an illustration. Two dimension rows allowed on every side of each view; clear area above the title block and notes strip.
- *A3 at 1:10 | 277 × 177 mm | 400 × 227 mm | 123 mm | Fits, room for two details
- A3 at 1:5 | 482 × 282 mm | 400 × 227 mm | None | Does not fit
- A2 at 1:5 | 482 × 282 mm | 574 × 350 mm | 92 mm | Fits, details tight
- A2 at 1:10 | 277 × 177 mm | 574 × 350 mm | 297 mm | Fits, mostly empty sheet
```

## Where the views go

The fit test treats the views as boxes, but their positions are not free. In third-angle projection, the plan sits directly above the front view and the end view seen from the right sits directly to its right, and the views must stay aligned: the plan's ends line up vertically with the front view's ends, and the end view's top and bottom line up horizontally with the front view's. That alignment is what lets a reader carry a feature from one view to another with a straight edge, and it is part of what the projection symbol promises.

For planning, alignment means the views form an L-shaped group whose overall size is what the fit test calculated, and the group moves as a unit. The gaps between the views are set by their dimension allowances, not by appearance. In the running case, the gap between the front view and the plan is 36 mm, two allowance bands, and the same between the front view and the end view. The group is then centred in the space left after the details column is reserved, with any spare width split evenly either side.

Chapter 3 shows how viewports are aligned exactly once they exist. At the planning stage it is enough to place the allowance rectangles on a common centreline, so that the alignment is designed in rather than fixed afterwards.

## Choosing details

Some features are too small to dimension at the main scale. A useful test is the size on paper of the smallest thing that must be dimensioned or annotated. If the gap between two dimension lines, or the feature itself, would be smaller than the text that labels it, the feature needs an enlarged detail.

This is an illustration. At 1:10, the bearing pad slide, 200 × 120 mm overall, is 20 × 12 mm on paper. Its features include a 10 mm thick wear strip, 1 mm on paper, and slots and holes of similar size. That is too small, so it gets **Detail A at 1:2**, where the slide is 100 × 60 mm. The take-up screw lug, 40 × 30 mm with a 13 mm slot and a 6 mm fillet weld, is 4 × 3 mm at 1:10 and gets **Detail B at 2:1**, 80 × 60 mm.

The details go in the 123 mm column to the right of the main views. Detail A needs 100 mm plus allowances, which is tight; the drafter allows one row of dimensions on its left side and puts the rest above and below. Each detail is identified on the main view by a circle and a letter, and titled with its letter and scale, such as "DETAIL A, SCALE 1:2".

## Scales a reader can use

The fit test can produce any scale: the frame's views would just fit the clear area at about 1:6.8. That is not a scale anyone should use. Drawings use a short list of preferred scales, set out in AS 1100.101 and covered in the Library’s *Drawings That Make Parts*, so that a reader can tell the scale at a glance, a scale rule exists for it, and views on different sheets compare directly.

The practical consequence for planning is that the fit test is run only at preferred scales. Try the largest preferred scale that might work, and step down to the next one if it does not. For the frame, 1:5 failed and 1:10 passed, so 1:10 it is, even though it leaves space unused. Unused space is not a fault on a drawing; it is room for the notes, revisions and queries that every drawing collects during its life.

## Notes, revisions and the space they grow into

A sheet's annotation grows after the first issue. General notes are added when the workshop asks a question; revision rows are added with every change; a parts list grows when the design does. A plan that fills the sheet on day one leaves nowhere for them to go.

This is an illustration. The office's notes strip is 220 × 50 mm. Notes at 3.5 mm with a line pitch of 5.25 mm, one and a half times the text height, fit (50 − 2 × 3) ÷ 5.25 = 8.4, so **eight lines** with a 3 mm margin top and bottom. The frame drawing starts with five general notes: material, welding standard, finish, deburring and the "do not scale" note, which leaves three lines spare. The revision table above the title block has rows 7 mm high, and the drafter reserves room for five revisions, **35 mm**, in the clear area's top right corner, clear of the details column. Both reservations are drawn as non-plotting rectangles with the views' allowance rectangles, so the plan accounts for them from the start.

When a sheet does run out of room, the remedy is a continuation sheet or a notes sheet, not smaller text. Shrinking notes to fit is how 2.5 mm text ends up on an A3 that is printed at A4, which Chapter 7 shows is close to illegible.

## Planning on paper, or on screen

The calculation can be done on a scrap of paper or in a spreadsheet. It can also be done on the layout itself, by drawing rectangles in paper space at the planned envelope plus allowance for each view and detail, on a non-plotting layer, before any viewport exists. The rectangles show at once whether the plan works, and they become the outlines within which the viewports are created.

The office keeps a simple spreadsheet that takes the object's three main dimensions, the scale and the allowance, and returns the space needed. It takes a minute to fill in and has replaced a good deal of nudging.

```figure
type: decision
title: When a planned layout does not fit
question: The views and their dimensions need more space than the clear area. What next?
- Smaller scale | Next preferred scale down, such as 1:10 to 1:20 | Fits more, but check the smallest feature stays legible
- *Larger sheet | Next A size up | Keeps the scale; costs paper and printer capacity
- Fewer views | Drop a view that adds nothing, or move it to another sheet | Often the best answer for long, simple objects
- Break the view | A conventional break shortens a long uniform object | Saves length; the overall dimension must still be given
```

## The error: views that looked right before the dimensions

This is an illustration. On the first attempt, the drafter placed the three viewports where they looked balanced with no dimensions on them: the plan 10 mm above the front view, and the end view 12 mm to its right. The sheet looked tidy.

When the dimensions went on, the front view's overall height and the rail positions needed two rows on its right side, and the end view's depth dimension needed a row on its left. Three rows in a 12 mm gap could not fit: by the office standard they needed 10 + 8 + 10 = 28 mm, one band from each view's outline. The dimensions overlapped the end view's outline, and the plan's depth dimensions collided with the front view's top rail callouts.

Moving the viewports apart fixed it, but two leader notes and a weld symbol had been placed in paper space and did not move with their views, so they ended up pointing at the wrong features. The checker found one; the drafter found the other while redoing the plan. The office now plans every sheet with allowance rectangles first, and keeps notes that point at geometry in model space, so that they move with it.

## Exercise: the general arrangement

The conveyor's general arrangement shows the whole 6,000 mm conveyor, 900 mm high including its legs and 800 mm wide, in front view and plan, on the same A3 template. Test 1:20. Can an end view go beside the front view as well?

**Worked answer.** At 1:20, the front view is 6,000 ÷ 20 = 300 mm wide and 900 ÷ 20 = 45 mm high, and the plan is 300 × 40 mm. With the plan above the front view and two dimension rows on each side:

- width needed: 300 + 2 × 18 = **336 mm**, against 400 mm clear;
- height needed: 45 + 40 + 4 × 18 = **157 mm**, against 227 mm clear.

Both views fit. An end view, 800 ÷ 20 = 40 mm wide, beside the front view adds its width and two more allowance bands: 300 + 40 + 4 × 18 = **412 mm**, which exceeds the 400 mm width. Even with only one 10 mm row on each side of the gap, it needs 300 + 40 + 18 + 10 + 10 + 18 = 396 mm, which fits by 4 mm and leaves no room for the view title or any leader.

The sensible answer is to omit the end view from the general arrangement, since the frame sheet already shows the tail end in detail, and add a note referring to it. Going down to 1:50 would make the conveyor 120 × 18 mm, far too small for a general arrangement whose purpose is to show the layout clearly.
