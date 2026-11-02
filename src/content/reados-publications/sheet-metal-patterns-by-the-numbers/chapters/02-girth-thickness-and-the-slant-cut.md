---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: girth-thickness-and-the-slant-cut
order: 2
title: "Girth, thickness and the pipe cut on a slant"
description: "Find a pipe's girth on the mean line, see why stepping it off with dividers falls short, and develop a pipe cut on a slant as a sine curve with 12 calculated ordinates."
draft: false
---

The girth is the length of the pattern around the pipe, and it is the number most likely to spoil a fitting. Too short and the pipe will not slip over its neighbour; too long and the joint is loose. Getting it right means deciding which diameter to use, calculating rather than stepping it off, and adding the seam allowance once and only once.

This chapter finds the girth of the running case's Ø250 duct, then develops the simplest parallel line pattern of all: a pipe cut on a slant, here the duct's end where it passes through a roof pitched at 20°. It ends with a seam allowance counted once instead of three times, and the duct that would not go together.

## Which diameter

A sheet rolled into a cylinder bends through its thickness. The outer surface is stretched, the inner surface is compressed, and somewhere between them a surface keeps its original length. For rolling of thin sheet to a large radius, that **neutral surface** sits very close to the middle of the thickness, and this book takes it there: patterns are developed on the **mean diameter**, the inside diameter plus one thickness.

For the running case's Ø250 duct in 0.8 mm sheet, the three candidate girths are:

- on the inside diameter, π × 250 = 785.4 mm;
- on the mean diameter, π × 250.8 = **787.9 mm**;
- on the outside diameter, π × 251.6 = 790.4 mm.

The difference between inside and mean is π × 0.8 = 2.5 mm. That looks small, but it is the same size as the clearance in a slip joint, and a duct made on the inside girth would be 0.8 mm small in diameter and a tight fit on the next spigot. For plate the difference grows with thickness: a 6 mm plate shell loses π × 6 = 18.8 mm of girth if laid out on the inside, which is why [Plate Work by the Numbers](/reados/publications/plate-work-by-the-numbers/when-thickness-changes-the-pattern/) treats the thickness as part of every pattern.

When the neutral surface moves inward, which happens in tight bends where the radius is only a few thicknesses, folded corners need a K-factor rather than the mean line. The Library’s [Sheet Metal Parts by the Numbers](/reados/publications/sheet-metal-parts-by-the-numbers/neutral-axis-k-factor-and-bend-allowance/) covers that case. For rolled pipe and duct, where the radius is hundreds of thicknesses, the mean line is accurate to well within the tolerance of the work.

```figure
type: formula
title: Girth and blank width of a rolled pipe
formula: G = π × (d + t)
formula: blank width = G + seam allowance
caption: The running case's Ø250 duct in 0.8 mm sheet with a 6 mm grooved seam, whose allowance of three seam widths is explained in Chapter 9.
- G | Girth on the mean line, mm
- d | Inside diameter, mm
- t | Sheet thickness, mm
step: G = π × (250 + 0.8) = π × 250.8 = 787.9 mm
step: Seam allowance = 3 × 6 = 18 mm
step: Blank width = 787.9 + 18 = 805.9 mm
```

## Calculate the girth, then divide it

Traditional pattern drawing found the girth by dividing a semicircle into six parts with compasses and stepping one part along the girth line 12 times with dividers. That method measures **chords**, the straight distances between points, not the arcs between them, and a chord is always shorter than its arc.

For the running case, a 30° chord on the mean diameter is 2 × 125.4 × sin 15° = 64.91 mm, while the arc is 787.9 ÷ 12 = 65.66 mm. Twelve chords add up to 778.9 mm, **9.0 mm short** of the true girth, a 1.1% error that makes the duct about 2.9 mm small in diameter. Dividing into 24 parts instead reduces the shortfall to 2.2 mm, which is still not good enough for a slip joint.

The fix is simple. Calculate the girth, mark it along the girth line, and divide that length into 12 equal spaces of 65.66 mm. The 12 lines on the pattern then correspond exactly to the 12 points on the pipe, and no error accumulates. Spacing can be set with a rule, or with dividers adjusted until 12 steps exactly fill the calculated length.

```figure
type: bars
title: Girth of the Ø250 duct by method
unit: mm
max: 800
caption: Stepping off chords understates the girth however finely the circle is divided. The calculated mean-line girth is the one to use.
- Inside diameter, π × 250 | 785.4
- * Mean diameter, π × 250.8 | 787.9
- Outside diameter, π × 251.6 | 790.4
- 12 chords on the mean diameter | 778.9
- 24 chords on the mean diameter | 785.7
```

## A pipe cut on a slant

The running case's duct rises vertically through a roof pitched at 20°. Its top end is cut on a plane parallel to the roof, so that a flashing collar can be fitted square to the roof sheet. The cut is the first real pattern in this book.

In elevation, draw the pipe with its axis vertical and the cut line at 20° to the horizontal. The shortest generator, on the downhill side, is the seam line, numbered 0. Divide the pipe's plan into 12 equal parts and project each point up to the cut line. The height of each generator above a base line square to the axis is its length on the pattern.

Calculation gives the same lengths directly. Measure the angle φ around the pipe from the shortest generator. A generator at angle φ sits a horizontal distance R × (1 − cos φ) further up the slope than line 0, where R is the mean radius, and the cut plane rises tan 20° for every millimetre of that distance. So each generator is longer than line 0 by:

h(φ) = R × (1 − cos φ) × tan α

With R = 125.4 mm and α = 20°, tan α = 0.364, and the longest generator, on the uphill side at φ = 180°, is longer than the shortest by the full diameter times tan α: 250.8 × 0.364 = **91.3 mm**.

```figure
type: compare
title: Cut ordinates for the Ø250 duct at the 20° roof
rowhead: Line
cols: Angle from seam | Added length, mm | Distance along girth, mm
caption: Lines 7 to 12 repeat lines 5 to 0. Ordinates are measured up from the shortest generator, on the mean diameter.
- 0 and 12 | 0° and 360° | 0.0 | 0.0 and 787.9
- 1 and 11 | 30° and 330° | 6.1 | 65.7 and 722.3
- 2 and 10 | 60° and 300° | 22.8 | 131.3 and 656.6
- 3 and 9 | 90° and 270° | 45.6 | 197.0 and 590.9
- 4 and 8 | 120° and 240° | 68.5 | 262.6 and 525.3
- 5 and 7 | 150° and 210° | 85.2 | 328.3 and 459.6
- * 6 | 180° | 91.3 | 394.0
```

## The cut line is a sine curve

Along the pattern, the distance from the seam is s = R × φ, so φ = s ÷ R. Substituting into the ordinate formula gives h = R tan α × (1 − cos(s ÷ R)): one full cosine wave across the girth, with an amplitude of half the rise. Every pipe cut by a plane develops to a sine curve. Its height depends on the angle of the cut and its length is always the girth.

That fact is practical. A spreadsheet can produce ordinates at any spacing, a CNC cutter can generate the curve from two numbers, and a pattern maker who knows the shape can see at a glance whether a hand-drawn curve is right. A correct curve is flat at its lowest and highest points, steepest at the quarter points, lines 3 and 9, and symmetrical about line 6. A curve with a kink or a pointed crest has a misplotted point.

```figure
type: svg
title: Pattern for the Ø250 duct cut at 20°
alt: A rectangle-like pattern 787.9 mm wide drawn at 0.7 scale, with a base line along the bottom and a smooth sine-shaped cut line across the top that rises from the seam at each end to a crest of 91.3 mm in the middle at line 6. Vertical lines mark the 12 equal divisions of 65.66 mm.
caption: This is an illustration at 0.7 scale. The seam is at both ends, on the shortest generator. The grooved seam allowance of 9 mm each side is shown hatched outside the net pattern.
viewbox: 0 0 640 290
body:
<rect class="fs" x="33.7" y="150" width="6.3" height="110"/>
<rect class="fs" x="591.5" y="150" width="6.3" height="110"/>
<path class="lf" d="M86 260V145.7M131.9 260V134M177.9 260V118.1M223.8 260V102.1M269.8 260V90.4M315.8 260V86.1M361.7 260V90.4M407.7 260V102.1M453.7 260V118.1M499.6 260V134M545.6 260V145.7"/>
<path class="li" d="M40 260H591.5M40 260V150M591.5 260V150"/>
<path class="la" d="M40 150L63 148.9L86 145.7L108.9 140.6L131.9 134L154.9 126.3L177.9 118.1L200.9 109.8L223.8 102.1L246.8 95.5L269.8 90.4L292.8 87.2L315.8 86.1L338.7 87.2L361.7 90.4L384.7 95.5L407.7 102.1L430.7 109.8L453.7 118.1L476.6 126.3L499.6 134L522.6 140.6L545.6 145.7L568.6 148.9L591.5 150"/>
<path class="cl" d="M315.8 40V260"/>
<text class="txs" x="34" y="278">0</text>
<text class="txs" x="310" y="278">6</text>
<text class="txs" x="582" y="278">12</text>
<text class="txa" x="324" y="70">+91.3 at line 6</text>
<text class="txs" x="190" y="208">Girth 787.9 = 12 × 65.66</text>
<text class="txs" x="40" y="30">Seam allowance hatched each side</text>
```

## Setting out the full piece

This is an illustration. The roof piece is a straight length of duct whose shortest generator is 500 mm from its bottom edge to the cut, and whose bottom end is crimped for a 40 mm slip joint into the duct below. Its pattern is set out like this:

1. Draw a base line 805.9 mm long: the 787.9 mm girth plus 9 mm of seam allowance at each end.
2. Mark the girth's two ends 9 mm in from each end of the base line, and divide the 787.9 mm between them into 12 spaces of 65.66 mm.
3. Square up a line at each division.
4. On line 0, and on line 12, mark 500 mm up from the base. On each other line, mark 500 mm plus that line's ordinate from the table.
5. Join the marks with a smooth curve, using a flexible batten or a spline, and check the curve's shape as described above.
6. Continue the seam allowance up each end, square to the base, to meet the curve's ends.

The longest generator, line 6, is 500 + 91.3 = 591.3 mm. Measuring it on the cut piece is a quick check: if the pipe stands on a level surface and line 6 is 591.3 mm long while line 0 is 500 mm, the cut is at the right angle.

## Where the seam goes, and why it matters here

On a straight pipe the seam can go anywhere. On a pipe cut on a slant it should go on the shortest generator or the longest, because those are the lines about which the pattern is symmetrical. A seam on line 0 makes the pattern a single symmetrical piece with the crest in the middle, as above, and gives the shortest seam to groove. A seam on line 6 puts the crest at both ends and the trough in the middle; the pattern has the same shape, shifted by half a girth.

A seam anywhere else is possible but costs effort and invites error, because the pattern is no longer symmetrical and the ordinates must be read from a different starting angle. If the roof piece's seam had to sit at line 3, to keep it on the side away from the weather, every ordinate would be taken from the table starting at line 3: the pattern would begin at 45.6 mm, rise to 91.3 mm a quarter of the girth along, fall to 0 at three quarters, and return to 45.6 mm. The shape is the same sine wave; only its starting point moves.

## Rolling a cut blank

The cut is made while the blank is flat, before rolling, and two practical points follow from that.

First, slip rolls leave a short flat at each end of the blank, because the sheet's edge cannot be gripped and bent at the same time. On 0.8 mm sheet in hand rolls the flat is a few millimetres long and is removed by pre-bending each edge over a round stake or by passing the blank in from both ends. If the flats remain, the seam sits at a slight peak and the girth near the seam is short of round.

Second, a blank with a curved top edge rolls unevenly if it is fed with the curve leading, because the rolls grip a narrow width first. Feeding the straight base edge square to the rolls, with the cut edge trailing, keeps the generators parallel to the roll axis so that the pipe forms a true cylinder. The grooved seam's edges are folded on a folder before rolling, and the hooks must face opposite ways, one up and one down, so that they engage when the pipe closes.

## The hole in the roof

The roof sheet needs a hole for the duct to pass through, and its shape follows from the same geometry. A plane cutting a cylinder at an angle makes an ellipse. Its minor axis, square to the slope, equals the pipe's diameter. Its major axis, up the slope, is the diameter divided by cos α.

For the duct's outside diameter of 251.6 mm, the hole's major axis is 251.6 ÷ cos 20° = **267.7 mm** and its minor axis 251.6 mm, before any clearance for the flashing. A round hole of 251.6 mm would leave the duct jammed against the uphill and downhill edges, 8 mm short of fitting each way.

## The error: a seam allowed for once

This is an illustration. A second roof piece was needed for a spare, and a new hand set it out from the job sheet. The sheet said "6 mm grooved seam", and the hand added 6 mm to the girth: 787.9 + 6 = 793.9 mm. The piece was rolled and seamed, and would not slip over the spigot of the duct below.

A grooved seam consumes three seam widths of sheet, as Chapter 9 explains: one on each edge for the hooks and one where the hooks lock together. The blank was therefore 12 mm short. After seaming, the girth was 793.9 − 18 = 775.9 mm, a mean diameter of 247.0 mm and an inside diameter of 246.2 mm, 3.8 mm smaller than the Ø250 it was meant to be.

The fault was found at the trial fit and confirmed in a minute with a tape around the formed pipe. Its outside girth measured about 778 mm where a correct duct measures π × 251.6 = 790.4 mm, and the 12 mm shortfall pointed straight at the seam allowance. The shop changed two things. Its job sheets now give the blank width, 805.9 mm, as well as the seam type, so that nobody calculates the allowance at the bench. And every first-off rolled piece is checked with a girth tape before the rest of a batch is cut. A diameter tape reading directly in diameter makes the check faster still.

```figure
type: checklist
title: Girth checks before cutting a batch
caption: The girth checks that would have caught the short spare roof piece before it was rolled.
- Diameter on the drawing confirmed as inside, outside or mean | the running case uses inside diameters
- Girth calculated on the mean diameter, not stepped off with dividers | 787.9 mm for Ø250 in 0.8 mm sheet
- Seam allowance added once, at its full value | 18 mm for a 6 mm grooved seam
- Blank width written on the job sheet | 805.9 mm
- First-off piece checked with a girth or diameter tape | outside girth 790.4 mm
- x Allowance calculated at the bench from the seam width | the cause of the short spare
```

## Exercise: a smaller pipe through a steeper roof

A Ø150 duct, 0.8 mm sheet, inside diameter 150 mm, passes vertically through a roof pitched at 30°. Find its mean-line girth, the spacing of 12 lines on the pattern, the cut ordinates at each line, and the blank width with a 6 mm grooved seam.

**Worked answer.** The mean diameter is 150.8 mm, so the girth is π × 150.8 = **473.8 mm** and the spacing 473.8 ÷ 12 = **39.48 mm**. The mean radius is 75.4 mm and tan 30° = 0.5774, so the ordinates above the shortest generator, R × (1 − cos φ) × tan α, are:

- lines 0 and 12: 0.0 mm;
- lines 1 and 11: 75.4 × 0.134 × 0.5774 = **5.8 mm**;
- lines 2 and 10: 75.4 × 0.5 × 0.5774 = **21.8 mm**;
- lines 3 and 9: 75.4 × 1.0 × 0.5774 = **43.5 mm**;
- lines 4 and 8: 75.4 × 1.5 × 0.5774 = **65.3 mm**;
- lines 5 and 7: 75.4 × 1.866 × 0.5774 = **81.2 mm**;
- line 6: 150.8 × 0.5774 = **87.1 mm**.

The blank is 473.8 + 3 × 6 = **491.8 mm** wide. A quick check: the line 3 ordinate is always half the line 6 ordinate, because cos 90° = 0, and 43.5 is half of 87.1 to the nearest 0.1 mm.
