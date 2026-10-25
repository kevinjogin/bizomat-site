---
book: layouts-that-plot-to-scale
chapterSlug: text-heights-at-every-scale
order: 4
title: "Text heights at every scale"
description: "Calculate model-space text heights for any view scale, compare paper-space, scaled and annotative text, and avoid notes that print as dots or disappear from a detail."
draft: false
---

Text on a drawing has one job: to be read at the size the sheet is printed. A note that prints 3.5 mm high on an A3 sheet is legible on a workshop bench; the same note at 0.35 mm is a dot, and at 35 mm it covers half a view. Getting the height right is pure arithmetic, but it has to be done for the space the text is in, and the space and the arithmetic are easy to mismatch.

This chapter sets out the relationship between paper height and model height, the three ways CAD programs handle text across scales and when each suits, and the two classic failures: text that prints tiny and text that does not print at all. The running case annotates the take-up frame's views and details.

## Paper height and model height

Text heights are specified as they will print: the office's standard is 3.5 mm for dimensions and notes, 5 mm for view titles and 7 mm for the drawing number, as printed on the A3 sheet. Those are paper heights.

Text placed in paper space is drawn at its paper height directly, because one paper-space unit is one millimetre of paper. Text placed in model space must be drawn at a height that, multiplied by the viewport's factor, gives the paper height:

model height = paper height ÷ viewport factor

For a 1:n view, the factor is 1 ÷ n, so the model height is the paper height times n. For an n:1 view, it is the paper height divided by n. A 3.5 mm note in the 1:10 front view is drawn 35 mm high in model space; the same note in the 2:1 Detail B is drawn 1.75 mm high.

```figure
type: compare
title: Model-space text heights for the office's standard
cols: 3.5 mm notes and dimensions | 5 mm view titles | 7 mm drawing number
caption: This is an illustration. Model height = paper height ÷ viewport factor. View titles and the drawing number normally go in paper space, so their model heights are shown for completeness.
- General arrangement, 1:20 | 70 | 100 | 140
- *Frame views, 1:10 | 35 | 50 | 70
- Detail A, 1:2 | 7 | 10 | 14
- Part drawing, 1:1 | 3.5 | 5 | 7
- Detail B, 2:1 | 1.75 | 2.5 | 3.5
```

## Three ways to handle text across scales

CAD programs offer three approaches, and an office should choose one deliberately for each kind of text.

**Paper-space text.** The text is placed on the layout at its paper height. It is always the right size, whatever the viewport scales, and is the natural home for view titles, scale notes, general notes and everything in the title block. Its weakness is that it does not move with the model. A paper-space leader note pointing at a weld stays where it is if the view is panned or the weld moves.

**Model-space text at a calculated height.** The text is placed in model space at the height from the table above, usually on a layer named for its scale, such as a 1:10 notes layer, frozen in viewports at other scales. It moves with the geometry and is simple to understand. Its weakness is that its height is fixed to one scale. If the frame view later changes from 1:10 to 1:20, every note in it must be rescaled, and a note that appears in two viewports at different scales must exist twice.

**Annotative text.** The text is given a paper height, and the program calculates its model height from an annotation scale assigned to it. An annotative object can carry several scales, one representation for each, and a viewport shows the representation that matches its own annotation scale. A note that must appear in both the 1:10 front view and the 2:1 Detail B carries both scales and appears at 3.5 mm in each. Its weakness is that it adds a layer of behaviour to understand: a representation exists only for the scales the object carries, and a viewport whose annotation scale the object does not carry does not show it at all.

```figure
type: decision
title: Choosing where a piece of text lives
question: Should this text move with the model geometry, and does it appear at more than one scale?
- Sheet information | Paper space at its paper height | Titles, scale notes, general notes, title block
- *Points at geometry, one scale | Model space at paper height × n, or annotative with one scale | A weld note in the front view only
- Points at geometry, several scales | Annotative with each viewport's scale | The same note in the 1:10 view and a 2:1 detail
- x Points at geometry, placed in paper space | Fails silently when the view moves | The cause of Chapter 2's misplaced notes
```

## The running case: annotating the frame

This is an illustration. The drafter divided the frame sheet's text as follows:

- **Paper space:** the five general notes in the notes strip, the view titles ("FRONT VIEW", "DETAIL A, SCALE 1:2"), the scale note "SCALE 1:10 OR AS SHOWN" in the title block and every title block field. All at their paper heights of 3.5, 5 and 7 mm.
- **Annotative, in model space:** every leader note that points at a feature, such as "4 × M16 TAPPED THROUGH" at the take-up lugs and the material callouts on the rails, each carrying the annotation scale of every viewport that shows the feature.

The drafter set each viewport's annotation scale equal to its view scale, which most programs do automatically when the view scale is chosen from the list. The take-up lug note carries two scales, 1:10 for the front view and 2:1 for Detail B; in model space it has two representations, 35 mm and 1.75 mm high, and each viewport shows the one that matches. On paper, both print 3.5 mm high.

The drafter positioned each representation separately, because a note placed neatly beside the lug in the 1:10 view sits far from it in the 2:1 detail, where the lug is twenty times larger. Most programs let each scale representation be moved independently.

## The error: the note that printed as a dot

This is an illustration. The bearing pad's part drawing, at 1:1, had been started from a copy of an older drawing, and one of its notes was copied into the frame's model space beside the pad's mounting slot: "SLOT FOR M12, BOTH SIDES". It was ordinary, non-annotative text, 3.5 mm high, which is right at 1:1. In the frame's 1:10 front view it printed at 3.5 × 0.1 = **0.35 mm**.

At 0.35 mm, the note was a smudge on the print, and nobody read it. The workshop asked what the small mark beside the slot meant; the checker had missed it because on screen, zoomed in, it was perfectly readable. In Detail A at 1:2, the same note printed at 1.75 mm, half the intended height and too small for the office standard.

The fix was to delete the copied note and recreate it as annotative text with the 1:10 and 1:2 annotation scales, so that it prints at 3.5 mm in both views. The detection rule went into the office checklist: before release, zoom the whole sheet to its printed size on screen, or print it, and look for text that is visibly smaller or larger than its neighbours. Wrong-scale text stands out once you look at the sheet at the size it will be read.

```figure
type: bars
title: The copied 3.5 mm note on paper in each viewport
unit: mm
max: 4
caption: This is an illustration. Non-annotative text drawn 3.5 mm high in model space prints at 3.5 mm × the viewport factor.
- Part drawing, 1:1 | 3.5
- Detail A, 1:2 | 1.75
- *Front view, 1:10 | 0.35
```

## The opposite failure: text that is not there

Annotative text fails differently. An annotative note that does not carry a viewport's annotation scale is simply not displayed in that viewport, and does not print there. Nothing on the sheet hints that it is missing.

This is an illustration. When Detail A was added late in the job, the drafter created its viewport at 1:2 but forgot to add the 1:2 scale to the existing wear-strip note, which carried only 1:10. The note appeared in the front view and not in Detail A. The checker found it by comparing the detail with the front view, feature by feature, and noticing that one view mentioned the wear strip's material and the other did not.

Most programs have a setting that shows all annotative objects regardless of scale, and a command that adds the current scale to selected objects. A useful habit when creating a new viewport is to select every annotative object that falls inside it and confirm which scales each carries.

## Text styles and legibility

Height is not the only property that decides legibility. The text style sets the font, the width factor and, sometimes, a fixed height. Three settings matter for scale.

**Fixed height.** A style with a fixed height forces every text object using it to that height in its own space. A style fixed at 3.5 mm used for model-space text at 1:10 prints at 0.35 mm, the same failure as above. Annotative styles and paper-space styles can use a fixed paper height safely; non-annotative model-space styles should leave the height at zero, meaning "specified per object", so the drafter must think about it each time.

**Line spacing.** Multi-line notes are spaced as a multiple of the text height, so a note's block grows with its height. At 1:10, a five-line note at 35 mm model height with a spacing of 1.5 takes 35 × 1.5 × 4 + 35 = 245 mm of model space, which is 24.5 mm on paper.

**Font.** A simple, open drafting font stays legible when printed small or reduced. Decorative or condensed fonts that look fine on screen can close up at 2.5 mm. The office standard names one font for all drawing text.

## Symbols and blocks that carry text

Text is not only notes. Weld symbols, section and detail markers, datum and surface texture symbols, revision triangles and balloons are usually blocks containing lines and text, drawn at a size that suits printing at 1:1. They obey the same rule: in model space they must be inserted at a scale of n for a 1:n view, so that their text and their arrows print at the intended size.

This is an illustration. The office's weld symbol block is drawn for paper, with 3.5 mm text and a reference line 20 mm long. In the frame's 1:10 front view, a model-space weld symbol must be inserted at a scale of 10, giving a 200 mm reference line in model space and 20 mm on paper. In Detail B at 2:1, the same block goes in at 0.5. If the symbol must appear in both views, an annotative block does the work, as with annotative text. Inserted at a scale of 1 in the 1:10 view, the weld symbol would print with a 2 mm reference line and 0.35 mm text, as unreadable as the copied note.

Detail markers and section markers usually belong in paper space, at their paper size, placed over the main view where the detail is taken. They then never need scaling, but like any paper-space annotation they must be moved if the view moves.

## When a view changes scale

Views sometimes change scale late in a job, when a sheet is reorganised or a detail is added. Each approach to text responds differently, and it is worth knowing the cost before choosing.

Paper-space text needs nothing, unless the view's new size crowds it. Model-space text at a calculated height must be scaled by the ratio of the old and new denominators, about a point near each note so that it stays beside its feature: moving the frame view from 1:10 to 1:20 means scaling every note in it by 2. Annotative text needs the new scale added to each object, and each new representation positioned, but its existing representations are untouched.

For a sheet with a few notes, any approach works. For a sheet with a hundred, annotative text, or keeping as much as possible in paper space, saves an afternoon.

## Text after reduction

The paper height assumes the sheet is printed at its intended size. Sheets are often printed smaller: an A3 drawing printed on A4 is reduced to 210 ÷ 297 = 0.707 of its size. The office's 3.5 mm notes then measure 2.47 mm, and any 2.5 mm text measures 1.77 mm, at the edge of legibility on a workshop print. Chapter 7 deals with reduced prints and line widths; for text, the conclusion is simple. Choose paper heights for the smallest size the sheet will realistically be printed at, which is why the office does not use anything below 3.5 mm on its A3 sheets.

## Exercise: one note, three views

The take-up screw lug's weld note, "6 FILLET BOTH SIDES", is needed in the 1:10 front view, in the 1:20 general arrangement, where the frame appears as a reference, and in the 2:1 Detail B. Give the model-space height for each view if the note is drawn as separate non-annotative text, and the annotation scales if it is annotative. Should it appear on the general arrangement at all?

**Worked answer.** For 3.5 mm on paper:

- 1:10 front view: 3.5 × 10 = **35 mm** in model space;
- 1:20 general arrangement: 3.5 × 20 = **70 mm**;
- 2:1 Detail B: 3.5 ÷ 2 = **1.75 mm**.

As separate non-annotative text, that is three copies on three layers, each frozen in the other viewports, and three things to update if the weld changes. As one annotative note, it carries the scales 1:10, 1:20 and 2:1, with each representation positioned beside the lug in its view.

It should not appear on the general arrangement. The general arrangement shows how the conveyor fits together; weld sizes belong on the frame sheet, where they are made. At 1:20 the lug is 2 × 1.5 mm on paper, too small to carry a legible weld symbol, and a note there would be a second place for the weld size to be stated and, one day, to disagree with the first. The drafter gives the note the 1:10 and 2:1 scales only, and if the frame is inserted into the general arrangement as a reference, its 1:20 viewport shows no weld note because the note does not carry that scale.
