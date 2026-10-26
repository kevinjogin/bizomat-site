---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: draw-ratios-and-redraws
order: 3
title: "Draw ratios, reductions and redraws"
description: "Measure how hard a draw is with its draw ratio, see what sets the limit, plan a part's first draw and redraws with margin, work out each stage's height, and catch a single draw planned at the limit."
draft: false
---

A blank can be drawn only so far in one stroke. As the punch pulls the flange in, the force needed rises with the flange's size, and the wall, which must carry that force, can carry only so much before it tears at the punch radius. A blank much larger than the punch needs more force than the wall can carry, and the cup tears before it is drawn. The ratio of blank to punch is therefore the first measure of whether a draw is possible, and the number of draws a part needs follows from it.

This chapter defines the draw ratio and its equivalents, explains what sets the limiting ratio, shows how a deep part is planned as a first draw and one or more redraws with margin at each, and works out the height of the cup after each stage. The running case finds that SC-100's first tool was planned as a single draw at a ratio of 1.99, within half a per cent of the limit the toolmaker had assumed, and tore three cups in ten in trial.

## The draw ratio

The **draw ratio** of a stage is the diameter before it divided by the diameter after it. For a first draw, that is the blank's diameter D divided by the punch's diameter d. Three equivalent measures are in use, and a design should state which it means.

```figure
type: formula
title: Three ways to state how hard a draw is
formula: draw ratio β = D ÷ d;   drawing coefficient m = d ÷ D = 1 ÷ β;   reduction = (1 − d ÷ D) × 100%
caption: This is an illustration for SC-100 drawn in one stage, from a 199.3 mm blank on a 100 mm punch.
- D | Diameter before the stage: the blank, or the previous cup, mm
- d | Diameter after the stage, at mid-thickness, mm
step: β = 199.3 ÷ 100 ≈ 1.99
step: m = 100 ÷ 199.3 ≈ 0.50
step: Reduction ≈ (1 − 0.50) × 100 ≈ 49.8%
```

A higher β, a lower m and a larger reduction all mean a harder draw. The three are the same information, but confusing them is easy: a "limit of 0.55" and a "limit of 1.8" describe almost the same draw.

## What sets the limit

The **limiting draw ratio**, LDR, is the largest β that a material can be drawn to in one stage without tearing, under given conditions. It is not a property of the material alone. It depends on:

- the material's resistance to thinning, measured by its **plastic strain ratio**, the r-value, which compares how much a tensile strip narrows to how much it thins; a higher r-value lets the wall carry more force before it thins and tears;
- its **work-hardening** behaviour, which strengthens the wall as it is drawn;
- the sheet's **thickness relative to the blank**, because thin blanks wrinkle more readily and need more holding force, which adds friction;
- the **punch and die radii**, which Chapter 6 covers;
- **lubrication** of the flange and the die radius, which reduces the force needed to pull the flange in;
- the **blank holder force**, which must stop wrinkles without adding so much friction that the wall tears.

Published limiting ratios for common materials exist in handbooks and suppliers' data, but they are for particular conditions, and the toolmaker's own trials with the actual material and lubricant are what decide. This is an illustration. For SC-100's 0.8 mm 304 sheet, the toolmaker assumed an LDR of about **2.0** for a first draw on their tools, and, as this chapter's error shows, that was a value to plan below, not to plan at.

## Planning with margin

A drawing process sees variation in every input: the sheet's properties change from coil to coil, the lubricant's film from part to part, the tool's finish from the first part to the ten-thousandth. A draw planned exactly at the limit fails whenever the variation goes the wrong way. A draw plan therefore uses **planning limits** below the LDR.

This is an illustration. For SC-100, the toolmaker's revised plan used a planning limit of **1.8** for a first draw and **1.25** for a redraw, each about 10% or more below what trials showed the material could do. A real plan uses the toolmaker's experience with the material, but the principle, a stated margin below the trial limit, is general.

## Redraws

A part that needs a larger total ratio than one stage can give is drawn in stages. The **first draw** makes a cup of larger diameter and lower height; each **redraw** draws the cup to a smaller diameter, lengthening its wall. The total draw ratio is the product of the stages' ratios.

Redraws have lower limits than first draws, because the metal has already work-hardened and because the wall being redrawn must bend twice as it enters the new die. Two arrangements are common. In a **direct redraw**, the cup is pushed through the new die in the same direction as before, its wall bending inwards over a sleeve. In a **reverse redraw**, the cup is turned inside out, drawn in the opposite direction, which bends the wall the other way and can reduce the work-hardening's effect. The toolmaker chooses between them for the material and the press.

## The running case: SC-100's two-stage plan

This is an illustration. SC-100 needs a total ratio of 1.99. Within planning limits of 1.8 and 1.25, two stages are enough, and several splits are possible. The toolmaker chose a first draw to **115 mm**, ratio 1.73, followed by a redraw to **100 mm**, ratio 1.15: 1.73 × 1.15 ≈ 1.99.

```figure
type: compare
title: SC-100's draw plan
cols: Diameter | Ratio | Planning limit | Height at the stage
caption: This is an illustration. Heights are from the area method of Chapter 2, with a 6 mm corner radius on the first cup and 4 mm on the second; both stages hold the blank's 31,184 mm².
- Blank | 199.3 mm | – | – | Flat
- First draw | 115 mm | 1.73 | 1.80 | 60.2 mm
- *Redraw | 100 mm | 1.15 | 1.25 | 76.0 mm, then trimmed to 70 mm
```

Each stage's height comes from the area method in reverse. The cup after the first draw has the blank's area, 31,184 mm², at a diameter of 115 mm and a corner radius of 6 mm, so its height h₁ satisfies D² = d² + 4dh − 1.72rd − 0.57r², which gives h₁ ≈ **60.2 mm**. After the redraw, at 100 mm diameter and a 4 mm corner, the same area gives 76.0 mm, as Chapter 2 found.

The split puts most of the work in the first draw, where the material is softest, and leaves the redraw with an easy ratio, which suits a work-hardening material like 304. A different split, 120 mm then 100 mm, ratios 1.66 and 1.20, would have balanced the stages more evenly, with a first cup of about 55.4 mm. The toolmaker's choice was driven partly by the press's stroke and partly by experience that 304 prefers its hardest stage first.

## The error: one draw at the limit

This is an illustration. SC-100's first trial tool was a single-stage draw from the 199.3 mm blank, once the blank had been corrected from Chapter 2's 252 mm, on a 100 mm punch: a ratio of 1.99. The toolmaker had read an LDR of about 2.0 for the material and concluded that one draw would do.

In a trial of ten blanks from one coil, seven cups drew fully and three tore at the punch radius. A second trial with blanks from another coil tore more. The single draw was within about **0.5%** of the assumed limit, so any variation in the sheet's properties, the lubricant's film or the blank's position took it over.

```figure
type: bars
title: Each stage's draw ratio against the illustrative limit of 2.0
unit: ratio
max: 2.1
caption: This is an illustration. The single draw sat almost on the limit; the two-stage plan leaves a margin at each stage.
- Single draw, as first tried | 1.99
- Planning limit, first draw | 1.80
- *First draw of two | 1.73
- *Redraw of two | 1.15
```

The fix was the two-stage plan above, with a second tool for the redraw. The cost was a second die set and a second press stroke per part; the saving was the tearing, which in a production run would have scrapped parts and stopped the press each time. The general lesson is that an LDR is a boundary found under particular conditions, and a production draw should be planned with a stated margin below it, so that the process's normal variation stays on the right side.

## The cup's height grows at each stage

Because area is constant, each redraw makes the cup taller as it makes it narrower. The relationship is direct: at a given area, a smaller diameter means a taller wall. For SC-100, the first cup at 115 mm is about 60 mm tall and the redrawn cup at 100 mm about 76 mm. A deeper part, like the 90 mm cover of Chapter 2's exercise, has a larger blank and taller cups at every stage. The press must have the **stroke** and the **daylight**, the open height between its bed and its ram, to take each cup in and out, and the die's design must allow the cup to be stripped off the punch after each draw. A press that can supply the force may still be too short for a deep part's later stages.

## Thickness and the ratio

The sheet's thickness relative to the blank affects the limit. This is an illustration. SC-100's sheet is 0.8 mm on a 199.3 mm blank, a ratio of t ÷ D of about **0.40%**. Thinner sheet relative to the blank wrinkles more readily in the flange, needs more blank holder force and therefore more friction, and draws to a lower ratio. Thicker sheet resists wrinkling and can sometimes be drawn without a blank holder at all, at modest ratios. Handbook limits are often tabulated against t ÷ D for that reason, and a part whose t ÷ D is outside the table's range should be planned with extra margin and proved by trial.

## Boxes and other shapes

Rectangular and other non-round shells are drawn too, but their draw ratio is not a single number. At the straight sides, the metal is simply bent and pulled into the die, with little circumferential compression. At the corners, it behaves like a quarter of a round cup, compressed as it is drawn in. A box's limit is set mostly by its **corner radii** relative to its depth: a deep box with small corner radii needs very large ratios at the corners, even if its sides are easy. The area method and the round-cup ratios still apply at each corner, treated as a quarter of a cup of the corner's radius.

## Finding the limit in trial

A toolmaker who needs the real limit for a material, rather than a handbook's, can find it with a simple trial. Blanks of increasing diameter are drawn on one punch, with the production lubricant and blank holder setting, in steps of a few millimetres, and several blanks are drawn at each size. The largest size at which every blank draws fully, without tearing, gives the trial's limiting ratio for those conditions. Repeating the trial with sheet from two or three coils shows how much the limit varies from coil to coil, which is the variation the planning margin must cover.

This is an illustration. If SC-100's trials on a 100 mm punch had shown every blank drawing at 190 mm, a few tearing at 195 mm and most tearing at 200 mm, the trial limit would be about 1.9 for that coil, a little below the assumed 2.0, and the single draw at 1.99 would have been shown impractical before a production tool was made. A trial like this costs a few dozen blanks and an afternoon on a press, and it turns a number read from a table into one measured on the material actually bought.

## Recording the plan

A draw plan belongs on the process sheet with one line per stage: the diameter before and after, the corner radius, the ratio, the planning limit it is checked against, the cup's height, and whether an anneal follows, which Chapter 8 discusses. For SC-100, that is three lines: the blank, the first draw and the redraw, plus a line for the trim. A later change to the part, a deeper cover, a smaller radius, a different material, sends the engineer back to that sheet, and the ratios show at once whether the plan still holds.

## Exercise: the 90 mm cover

Chapter 2's exercise found a blank of 218.4 mm for a 90 mm high cover with 6 mm of trim. Using the illustrative planning limits of 1.8 for a first draw and 1.25 for a redraw, how many stages does it need, what diameter should the first draw make, and about how tall is the first cup with a 6 mm corner radius?

**Worked answer.** The total ratio is 218.4 ÷ 100 ≈ **2.18**, beyond a single stage at 1.8. With a first draw at the planning limit, the first cup's diameter would be 218.4 ÷ 1.8 ≈ **121.3 mm**, and the redraw ratio 121.3 ÷ 100 ≈ **1.21**, within 1.25. Two stages are enough. By the area method, the first cup at 121.3 mm with a 6 mm corner holds the blank's area at a height of about **70.6 mm**.

A first draw at exactly the planning limit leaves no margin within the plan itself, so a toolmaker might prefer a first draw to, say, 125 mm, ratio about 1.75, and a redraw of 1.25, at the redraw's planning limit. Either way, the deeper cover needs the same number of tools as SC-100, but taller cups, which the press's stroke and daylight must accommodate.
