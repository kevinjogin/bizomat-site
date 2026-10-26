---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: earing-trim-and-tolerances
order: 7
title: "Earing, trim and tolerances"
description: "See why a drawn rim comes out wavy, measure the sheet's anisotropy, build a trim allowance from ears, blank position and cut, choose a trimming method, and catch an allowance that left notches."
draft: false
---

A round blank drawn in a round die should, in principle, make a cup with a level rim. In practice, the rim rises and falls around the circumference in a regular pattern of high points, called **ears**, and low points between them. The cause is the sheet itself: rolled sheet has properties that differ with direction, so the flange flows in more readily in some directions than others, and the wall grows taller where it flows more. Add a blank that is not perfectly centred and a rim that thickens unevenly, and a part like SC-100, whose open end must seat squarely on a gasket, needs its rim trimmed off at a set height.

This chapter explains earing and how it is measured, builds SC-100's trim allowance from its parts, compares trimming methods, and sets out the tolerances a drawn and trimmed part can hold. The running case finds that SC-100's trim allowance was first set at 2 mm, the ear height of a mild steel part, and left some trimmed cups with notches below the trim line.

## Why ears form

Rolling sheet aligns its grains and their crystal orientations, so the sheet's plastic behaviour differs between the rolling direction, the transverse direction and the diagonals. The measure used is the **plastic strain ratio**, the r-value: in a tensile test on a strip cut at a given angle to the rolling direction, the ratio of the strain across the strip's width to the strain through its thickness. A high r-value means the strip narrows readily but resists thinning.

Two combinations of the r-values at 0°, 45° and 90° to the rolling direction matter for drawing:

```figure
type: formula
title: Normal and planar anisotropy from three r-values
formula: r̄ = (r₀ + 2 × r₄₅ + r₉₀) ÷ 4;   Δr = (r₀ + r₉₀ − 2 × r₄₅) ÷ 2
caption: This is an illustration with r-values invented for this example; a real sheet's values come from tests on the coil, to the relevant test standard, or from the supplier.
- r₀, r₄₅, r₉₀ | Plastic strain ratios measured at 0°, 45° and 90° to the rolling direction
- r̄ | Normal anisotropy: higher values tend to raise the limiting draw ratio
- Δr | Planar anisotropy: its size sets the ear height, its sign where the ears form
step: With r₀ = 1.0, r₄₅ = 1.2 and r₉₀ = 0.9: r̄ ≈ 1.08
step: Δr ≈ (1.0 + 0.9 − 2.4) ÷ 2 = −0.25
step: Δr below zero puts four ears at 45° to the rolling direction; above zero, at 0° and 90°
```

The **normal anisotropy** r̄ is the reason some sheets draw deeper than others of similar strength: a sheet that resists thinning lets the wall carry more force before it tears, which is why drawing grades of steel are made with high r̄. The **planar anisotropy** Δr is the reason for ears: where the sheet flows in more readily, the wall grows taller. With Δr of −0.25, in this illustration, SC-100's cups form four ears at 45° to the rolling direction.

## Measuring the ears

Earing is measured on trial cups by recording the rim height around the circumference, at the ear peaks and the valleys between them. The **earing** is usually expressed as the difference between the highest and lowest points, as a length or as a percentage of the mean height.

This is an illustration. SC-100's trial cups after the redraw had a mean height of 76 mm, with ears rising to about 77.25 mm at 45°, 135°, 225° and 315° and valleys at about 74.75 mm at 0°, 90°, 180° and 270°: a peak-to-valley earing of about **2.5 mm**, about 3.3% of the mean height.

```figure
type: line
title: Rim height around one of SC-100's trial cups
x: Angle from the rolling direction, degrees
y: Height, mm
legend: Rim height as drawn | Trim line
ymin: 68
ymax: 79
caption: This is an illustration of four-eared rim with 2.5 mm peak to valley, before allowing for blank position. The trim line at 70 mm sits below the lowest valley with margin.
- 0 | 74.75 | 70
- 45 | 77.25 | 70
- 90 | 74.75 | 70
- 135 | 77.25 | 70
- 180 | 74.75 | 70
- 225 | 77.25 | 70
- 270 | 74.75 | 70
- 315 | 77.25 | 70
- 360 | 74.75 | 70
```

Ear height varies from coil to coil, because Δr does. A trim allowance set from one trial coil should be checked against cups from others, and the supplier can be asked for r-values, or a limit on earing, as part of the material's specification.

## Building the trim allowance

The trim allowance is the height drawn above the finished height so that the trim line lies below every low point of the rim, with a margin for the cut itself. It has three parts.

- **Ears**: the peak-to-valley earing, here 2.5 mm, because the valleys sit that far below the peaks.
- **Blank position**: a blank that sits slightly off-centre in the die draws a cup that is taller on one side than the other. Trials measured up to about **1.5 mm** of height variation from this cause, in this illustration.
- **Cut margin**: the trimming method needs some metal above the trim line to cut cleanly, and the trimmed edge must clear the lowest point with room to spare. SC-100 allows **2 mm**.

The total is 2.5 + 1.5 + 2.0 = **6 mm**, the allowance used in Chapter 2's blank. The finished height of 70 mm and the allowance give the drawn height of 76 mm and the blank of 199.3 mm.

## The error: a 2 mm allowance

This is an illustration. SC-100's first blank calculation used a trim allowance of **2 mm**, giving a drawn height of 72 mm and a blank of about 195.2 mm. The 2 mm came from a mild steel part the shop had drawn before, whose ears were smaller and which had not been trimmed to a gasket face.

With SC-100's 2.5 mm earing, a cup drawn to a mean of 72 mm had valleys at about 70.75 mm, only 0.75 mm above the trim line. On a cup whose blank sat 1.5 mm off-centre, the valleys on the low side fell to about **69.25 mm**, below the trim line. The trimmer cut a level edge where there was metal, and left shallow **notches** where the valleys dipped below it. Notched cups could not seal on their gasket and were scrapped.

```figure
type: bars
title: SC-100's trim allowance, built up from its parts, mm
unit: mm
max: 7
caption: This is an illustration. The first allowance covered the ears of another part; SC-100's own ears, its blank position and its cut margin need 6 mm.
- First allowance, from a mild steel part | 2.0
- Ears, peak to valley | 2.5
- Blank position | 1.5
- Cut margin | 2.0
- *Allowance used | 6.0
```

The fix was the 6 mm allowance built above, which raised the blank from 195.2 to 199.3 mm and added about 12 g of trim scrap to each part. The general lesson is that a trim allowance is a sum of measured parts, ears, position and cut, each specific to the material and the tool, and that a value carried over from a different part can be smaller than its own ears.

## The cost of the allowance

Trim is metal bought, drawn and scrapped. This is an illustration. SC-100's 6 mm of trim is about 12 g of stainless steel per part, about **238 kg** a year at 20,000 parts. That is a cost worth reducing, but not by cutting the allowance below its parts. The ways to reduce it act on those parts: a sheet with lower earing, specified by Δr or by an earing limit; better blank location, with locating pins or a nest; or a **shaped blank**, scalloped so that it is slightly smaller where the ears form and larger at the valleys, which levels the rim as drawn. A shaped blank costs nothing extra if it is blanked in a die, and can cut the trim allowance substantially for a high-volume part. For a few hundred parts, the round blank and the full allowance are cheaper than the work of developing a shape.

## Ears through the stages

Ears form in the first draw and carry through the redraws. A redraw does not level them; it lengthens the wall under each ear and each valley in about the same proportion, so the earing in millimetres usually grows a little with each stage, while its percentage of the height stays roughly the same. Trimming between stages is sometimes used on deep parts with several redraws, so that the ears of one stage do not catch in the next stage's tools or fold over the punch. SC-100's two stages are short enough to trim once, after the redraw, and the trim allowance is set from ears measured on the redrawn cup, not on the first cup.

## Marking the rolling direction

Because the ears sit at a fixed angle to the sheet's rolling direction, the blanks' orientation decides where on the cup the ears and valleys fall. For a plain round cover like SC-100, that does not matter, because the whole rim is trimmed. For a part with a feature at a particular angle on its wall or rim, a slot, a tab or a flat, the ears can be placed away from the feature by orienting the blanks consistently, which means cutting them with the rolling direction marked and loading them into the die the same way every time. A blank layout that rotates blanks in the strip, for better material yield, can scatter the ears around the part and should be checked against any such feature.

## Ears in spun parts

Spun parts show anisotropy too, but less regularly. Because a spinning roller works a small area that travels round the part, a spun cup's rim usually comes out less wavy than a drawn one's, but its height varies with the spinner's passes. Spun parts are trimmed on the spinning lathe itself, with a cutting tool, at the end of the last pass, which gives a clean, square edge at little extra cost. Chapter 9 covers spinning; the trim allowance for a spun part comes from its own trials, not from the drawn part's ears.

## Trimming methods

Several methods trim a drawn cup's rim, and the choice depends on the edge quality needed and the quantity.

- **Pinch trimming** in the draw die, at the bottom of the stroke, cuts the rim between the punch and a sharp edge in the die. It is fast and needs no separate operation, but the edge is rougher and slightly pinched.
- **Shear or rotary trimming** in a separate tool, the cup held on a mandrel while a cutter or a rolling blade cuts round it, gives a cleaner, square edge.
- **Lathe trimming** or machining gives the best edge and the closest height, at the cost of time.
- **Laser trimming** suits low quantities and complex trim lines, leaving a heat-affected edge.

SC-100's open end seats on a gasket, so its edge must be square, level and free of burrs. Its trim is a separate rotary shear operation, followed by a light deburr, which holds the height and leaves an edge the gasket can seal on.

## Tolerances a drawn part can hold

A drawn and trimmed part holds some dimensions closely and others less so, and its drawing should reflect that.

- The **inside diameter**, made by the last punch, can be held closely, within the punch's wear allowance and the springback.
- The **trimmed height**, set by the trimming tool, can be held closely, independent of the drawn height's variation.
- The **wall thickness** varies along the wall as the process gives it and is specified as nominal with limits on thinning, as Chapter 1 recommended.
- **Roundness** and **taper** depend on the clearance, the material's springback and the trim, and are usually looser than a turned part's.
- **Flatness of the bottom** depends on the punch's face and the stripping, and is improved by a final restrike if needed.

A designer who specifies every dimension to a machined part's tolerance forces the drawn part through machining operations that the process does not need. One who specifies the functional dimensions closely, the inside diameter that fits over the instrument and the trimmed height and edge that seal on the gasket, and the rest as the process gives them, gets a part the process makes economically.

## Recording the trim

The process sheet should record the earing measured on trial cups from each coil tested, the blank position variation, the cut margin, the allowance they sum to, the drawn height and the trimming method. For SC-100, that is a single line: earing 2.5 mm, position 1.5 mm, cut 2.0 mm, allowance 6.0 mm, drawn to 76 mm, rotary shear trimmed to 70 mm and deburred. A new coil whose earing is larger than 2.5 mm shows at once against that line.

## Exercise: a shaped blank

For a run of 20,000 parts, the toolmaker proposes a scalloped blank that is about 1.25 mm smaller in radius at 45°, where the ears form, and about 1.25 mm larger at 0° and 90°, so that the drawn rim's earing falls to about 0.5 mm peak to valley. Keeping the blank-position and cut allowances, what would the trim allowance and the drawn height become, and roughly how much trim scrap would it save per part?

**Worked answer.** The allowance becomes 0.5 + 1.5 + 2.0 = **4.0 mm**, a drawn height of **74 mm**. By the area method, a round blank for 74 mm would be about √(100² + 4 × 100 × 74 − 1.72 × 4 × 100 − 0.57 × 16) ≈ 197.2 mm, and the shaped blank has about the same area. The trim scrap falls from the area between 70 and 76 mm of wall, about 1,885 mm², to that between 70 and 74 mm, about 1,257 mm², a saving of about 628 mm² of 0.8 mm sheet, about **4 g** a part, or about 79 kg over 20,000 parts.

Whether that is worth having depends on the cost of developing the shape, which takes trials to get right, and on whether the blanks are cut in a die, where the shape costs nothing extra once made. For SC-100's uncertain quantity, the round blank and the 6 mm allowance were kept, with the shaped blank noted as an option if the larger contract were won.
