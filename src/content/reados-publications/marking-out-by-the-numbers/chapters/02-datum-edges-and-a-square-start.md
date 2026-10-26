---
book: marking-out-by-the-numbers
chapterSlug: datum-edges-and-a-square-start
order: 2
title: "Datum edges and a square start"
description: "Choose a datum edge and prove it straight, build a true right angle with a scaled 3-4-5 triangle, and use diagonals to measure how far a rectangle is out of square."
draft: false
---

Every measurement on a layout is taken from something. On a drawing that something is a datum, a line or surface chosen by the designer. On the sheet it is usually an edge, and the fabricator chooses it, often without noticing that a choice is being made. The edge that happens to face the bench becomes the reference for every line on the part. If that edge is bowed, or the corner beside it is not square, every line inherits the fault.

This chapter is about the start of every C-12 layout: choosing the primary datum edge, proving it straight, building a true right angle from it to give a second datum, and using diagonals to prove that a marked rectangle is square. It puts numbers on each check, so that a fabricator knows how big a diagonal difference is acceptable, and it ends with an apron marked from a guillotined corner that was not square.

## Mill edges are not datums until proved

Sheet arrives with four edges, and none of them is guaranteed to be a datum. Edges that have been slit from coil can carry a slight bow along their length, called camber. Sheets cut to length on a shear can have ends that are not quite square to the sides, because the shear's back gauge or the operator's alignment was slightly out. Edges get dinged in handling. The product standard for galvanised sheet, AS 1397, deals with properties and tolerances of the product as supplied, but a fabricator should not rely on any edge being straight or square to the precision a layout needs without checking it.

The working rule is simple: an edge becomes a datum only after it has been checked. Until then it is just the side of the sheet.

### Checking straightness

There are three common ways to check an edge on the bench.

1. **Straightedge.** Lay a known straightedge along the edge and look for light between them, or slide a feeler gauge into the largest gap. This is quick for lengths up to the straightedge's length, usually 1 to 2 m.
2. **String line.** Stretch a fine line tight between two pins or nails set an equal distance, say 20 mm, from the edge at each end, and measure the gap between line and edge along the length. A taut line lying on flat sheet does not sag, so it is straight over any length that matters in a shop.
3. **Sight.** Lower the eye to the level of the sheet and look along the edge. A practised eye finds a bow of a millimetre or so over a few metres, but it cannot say how big it is, so sighting is a first screen rather than a measurement.

A bow is measured as its **camber**: the largest gap between the edge and a straight line joining its ends. For a gentle, even bow the gap is greatest at the middle and falls away towards the ends, roughly as a circular arc.

```figure
type: compare
title: String-line readings along a 2,400 mm edge with 2 mm camber
rowhead: Position along the edge
cols: Offset from the chord, mm | What the reading tells you
caption: This is an illustration for an even bow. Readings are taken from a line set equidistant from the edge at both ends; the offsets shown are corrected for that setting. A reading that jumps between neighbours points to a local ding, not a bow.
- End (0 mm) | 0.00 | Reference: line set here
- Quarter point (600 mm) | 1.50 | Bow rising evenly
- * Middle (1,200 mm) | 2.00 | Maximum: the camber
- Quarter point (1,800 mm) | 1.50 | Symmetrical bow
- End (2,400 mm) | 0.00 | Reference: line set here
```

The readings at the quarter points are three-quarters of the camber, which is what an even circular bow gives. If they were much smaller or larger, the edge would be kinked rather than bowed, which matters when choosing which part of it to use.

### What to do with a bowed edge

A bowed edge can still give a datum, in one of three ways. The fabricator can use only a part of it short enough to be straight within the budget; scribe a straight datum line along the edge from the string line and measure from that line instead; or shear a fresh straight edge. On C-12 sheets, the shop scribes a datum line 20 mm in from the chosen long edge, using a steel straightedge for each 2 m length and a string line across the full sheet, and measures from that line. The 20 mm strip is waste.

## Building the second datum: a right angle

Most layouts need two datums at right angles. The second should be built from the first, not taken from the adjacent edge, because the adjacent edge is the one most likely to be out of square.

A **steel square** is the fastest tool, and for short lines it is good enough. Its error is the error of the square itself, which grows with the length of the line drawn along its blade. A square whose blade is 0.2 mm out over 300 mm puts a 900 mm line 0.6 mm out at its far end, and extending the line beyond the blade magnifies that further. For long lines, a right angle should be constructed.

### The 3-4-5 triangle, scaled

A triangle whose sides are in the ratio 3:4:5 has a right angle opposite the longest side, because 3² + 4² = 5². On sheet, the triangle is scaled up to make the error small: 600, 800 and 1,000 mm, or 1,200, 1,600 and 2,000 mm on a full sheet.

1. Along the datum line, mark the corner point and a point 800 mm away.
2. From the corner, swing an arc of 600 mm with a trammel, or measure it repeatedly with a tape, roughly where the perpendicular will lie.
3. From the 800 mm point, swing an arc of 1,000 mm to cross the first arc.
4. The line from the corner through the crossing is the perpendicular.

How good is it? Suppose the 1,000 mm side is set 1 mm long, at 1,001 mm. The angle at the corner then opens by about 0.12°, and the far end of the 600 mm perpendicular sits about 1.25 mm away from where a true right angle would put it. The ratio is fixed by the triangle's shape: for every millimetre of error in the hypotenuse, the end of the short leg moves by the hypotenuse divided by the long leg, 1,000 ÷ 800 = 1.25 mm. Scaling the triangle up does not change that ratio, but it does halve the angle error each time the size is doubled, because the same 1 mm is a smaller fraction of a longer side.

```figure
type: compare
title: Effect of a 1 mm error in the hypotenuse of a 3-4-5 triangle
rowhead: Triangle sides, mm
cols: Angle error | Shift at the end of the short leg | Shift over 900 mm along the short leg
caption: Angle error = hypotenuse error × c ÷ (a × b) in radians, with the short leg a as the perpendicular. A bigger triangle gives a smaller angle error for the same slip of the tape, and the shift over a fixed length falls with it.
- 600 / 800 / 1,000 | 0.12° | 1.25 mm at 600 mm | 1.88 mm
- * 900 / 1,200 / 1,500 | 0.08° | 1.25 mm at 900 mm | 1.25 mm
- 1,200 / 1,600 / 2,000 | 0.06° | 1.25 mm at 1,200 mm | 0.94 mm
```

The practical rule: build the right angle with the largest 3-4-5 triangle the sheet allows, and set the hypotenuse with the most accurate length tool available. On a 2400 × 1200 sheet with its datum line 20 mm in from the edge, the 900, 1,200 and 1,500 mm triangle is the largest that fits with its short leg across the sheet, and the C-12 shop uses it for every full-sheet layout. Even then, a 1 mm slip in the 1,500 mm side moves the far corner of the 900 mm apron by 1.25 mm, more than twice the marking budget, which is why the hypotenuse is set with a checked rule or trammel and never by eye from a tape.

### Testing the square itself

A steel square can be checked without any other instrument by turning it over. Hold its stock against a straight datum line and scribe a line along the blade. Turn the square over, so the stock faces the other way along the same datum, bring the blade up to the scribed line and scribe a second line beside it. If the square is true, the two lines coincide. If it is out, they diverge, and the gap between them at the end of the blade is twice the square's error over that length, because turning the square over doubles its fault.

On a 300 mm blade, a gap of 0.4 mm at the end means the square is 0.2 mm out over 300 mm. That is acceptable for short lines, such as squaring a cut line across a 100 mm strip, and unacceptable for setting out a 900 mm side. The test takes a minute, needs no reference, and should be repeated whenever a square has been dropped.

## Diagonals: the check that measures squareness

A marked rectangle can be checked by measuring its two diagonals. In a true rectangle they are equal. When the rectangle has been pushed out of square into a parallelogram, one diagonal grows and the other shrinks, and the difference between them measures how far it is out.

```figure
type: formula
title: Diagonal difference of a rectangle out of square
formula: Δ ≈ 2 × a × b × ε ÷ d
caption: Valid when the opposite sides are equal and ε is small. For a square, Δ ≈ 1.414 × the corner offset; for a 2400 × 1200 sheet, Δ ≈ 1.79 × the offset at the end of the 1,200 mm side.
- Δ | difference between the two diagonals, mm
- a, b | side lengths, mm
- ε | angle out of square, radians (corner offset ÷ side length)
- d | true diagonal, √(a² + b²), mm
step: 900 × 900 apron, 1.5 mm offset over 900: ε = 0.00167, Δ = 2 × 900 × 900 × 0.00167 ÷ 1,272.79 = 2.12 mm
step: 2400 × 1200 sheet, 1 mm offset over 1,200: ε = 0.00083, Δ = 1.79 mm
```

The formula can be turned round. On the C-12 apron, the general tolerance gives a marking budget of ±0.5 mm. If the corner may be no more than 0.5 mm out over the 900 mm side, the diagonals may differ by no more than 1.414 × 0.5 = 0.71 mm. In practice the shop accepts a difference of up to 0.7 mm on the apron and re-marks above it.

### Diagonals need equal sides

Equal diagonals prove a rectangle only if the opposite sides are already known to be equal. A shape with unequal opposite sides, such as a trapezium with one end slightly longer, can have equal diagonals and still not be a rectangle. So the check is done in order: measure both pairs of opposite sides first, then the diagonals. If the sides agree and the diagonals agree, the shape is a rectangle; if the sides agree and the diagonals do not, it is a parallelogram and the difference says by how much.

Measure the diagonals with the same tape, hooked or held the same way at the same corner each time, so that any bias in the tape cancels out of the difference. This is one of the few checks in marking out where the same tool is the right choice: the question is not how long the diagonals are, but whether they are equal.

## Marking the C-12 sheet

This is an illustration. The first C-12 sheet carries the apron, 900 × 900 mm, and the louvre panel, 900 × 300 mm, side by side along the long edge.

```figure
type: steps
title: Datum and squaring sequence for the first C-12 sheet
caption: This is an illustration. Every later line on the sheet is measured from datum line A and perpendicular B, not from the sheet's edges.
- Check the long edge | string line across 2,400 mm; camber read at the middle and quarter points
- Scribe datum line A | 20 mm in from the long edge, along a straightedge, joined to the string line
- Build perpendicular B | 900 / 1,200 / 1,500 mm triangle from a point on A near the left end
- Mark the apron outline | 900 mm along A and along B, then the far corner from both
- Check sides, then diagonals | both 900 mm pairs, then diagonals against 1,272.79 mm
- Mark the louvre panel | measured from B and A, not from the apron's far edge
```

The last step matters more than it looks. Measuring the louvre panel from the apron's far edge would chain its position onto any error in the apron. Measuring it from B, at 900 + 30 mm for a cutting gap, keeps each part's error independent of the others. Chapter 3 returns to this choice between chained and baseline measurement.

## The error: an apron squared from the sheared end

This is an illustration. On a rush job, a fabricator skipped the constructed perpendicular and marked the apron straight off the sheet's corner, using the long edge as one side and the sheared end as the other. The end looked square against a 300 mm steel square, and the square sat cleanly in the corner.

The diagonals told a different story. Measured with the same tape, they read 1,273.85 and 1,271.73 mm, a difference of 2.12 mm. From the formula, that is a corner offset of 2.12 ÷ 1.414 = 1.50 mm over 900 mm, or 2 mm over the full 1,200 mm width of the sheet. The sheared end was 2 mm out of square, a small enough error to hide under a 300 mm square, which would show only 0.5 mm over its blade, and it was easy to miss in the light of a busy shop.

The apron was not yet cut, so the correction cost ten minutes: build the 900 / 1,200 / 1,500 triangle from the datum line, re-mark the side and far corner, and check again. The diagonals then read 1,272.9 and 1,272.6 mm, a difference of 0.3 mm, inside the shop's 0.7 mm limit. The fabricator also measured the shear: its back gauge was out, and every sheet cut on it that week had ends 1.5 to 2 mm out over 1,200 mm. That finding was worth more than the apron, because it explained two earlier jobs whose parts had come out slightly skew.

## How this applies to a small Australian business

In a small shop, the sheet's edge is the default datum because it is always there. Making the datum a deliberate choice costs a string line, a steel straightedge and a few minutes per sheet, and it removes a whole class of faults that otherwise appear as parts that "nearly fit". A diagonal check takes less than a minute and should be written into the job sheet for any rectangle whose squareness matters, with the acceptable difference worked out from the formula and recorded beside it.

The check also protects the shop's equipment record. A shear, a square or a straightedge that has drifted shows up first as diagonals that disagree, so a shop that records its diagonal checks has an early warning without buying any instruments.

## Exercise: the full sheet

A fabricator measures the diagonals of a 2400 × 1200 mm sheet before using its edges and finds them 2,684.6 and 2,682.0 mm. The opposite sides measure 2,400.0 and 2,400.2 mm, and 1,200.0 and 1,200.1 mm. How far out of square is the sheet, and can its corner be used as a datum for the apron, whose marking budget is ±0.5 mm over 900 mm?

**Worked answer.** The opposite sides agree within 0.2 mm, so the diagonal check is valid. The difference is 2,684.6 − 2,682.0 = 2.6 mm. For this sheet Δ ≈ 1.79 × the offset at the end of the 1,200 mm side, so the offset is 2.6 ÷ 1.79 = **1.45 mm over 1,200 mm**, an angle of about 0.0012 radians or 0.07°.

Over the apron's 900 mm side, the same angle gives 900 × 0.0012 = **1.09 mm**, more than twice the ±0.5 mm budget. The corner cannot be used. The fabricator should scribe datum line A, build a perpendicular with the largest 3-4-5 triangle that fits, and mark the apron from those lines.
