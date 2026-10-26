---
book: plate-work-by-the-numbers
chapterSlug: marking-out-and-nesting-plate
order: 8
title: "Marking out and nesting plate"
description: "Mark plate from a datum and prove it square by diagonals, allow for kerf, nest the whole bin on 6, 8 and 5 mm sheets, and find a roof 12 mm too wide and a plate squared from a mill edge."
draft: false
---

Every pattern in this book ends as lines on a plate. Marking those lines accurately, from a reference that is truly straight and square, is the step that turns a correct calculation into a correct part. And deciding which parts go on which plate, nesting, is where the job's material cost is won or lost. A plate list that puts each part on its own sheet buys twice the steel it needs; one that fits the small parts into the large parts' offcuts may buy one sheet fewer of each thickness.

This chapter marks out the running case's shell plates, works out the kerf allowances, and nests every plate part of the bin on 2,400 × 6,000 mm sheets of 6, 8 and 5 mm plate. It finds that the roof misses its plate by 12 mm, as the cone missed by 9 mm, and ends with a shell plate marked from a mill edge that was not square.

## Datum, square and diagonals

Plate is marked from a **datum edge**: one edge that has been checked straight, or a line struck along the plate and treated as straight. Every other line is set out from it, square or parallel. A rectangle marked this way is proved square by its **diagonals**: if the two diagonals are equal, the corners are right angles.

For the running case's shell plates, 3,777.3 × 2,400 mm, the diagonal is √(3,777.3² + 2,400²) = **4,475.3 mm**. If one end of the plate is skewed so that it leans by s millimetres over the plate's width, one diagonal lengthens and the other shortens, and their difference is roughly 2 × s × 3,777.3 ÷ 4,475.3, about 1.7 × s.

```figure
type: compare
title: Diagonal difference on a 3,777.3 × 2,400 mm plate
rowhead: Ends skewed by
cols: Diagonal difference | What it does to the rolled course
caption: The plate is a parallelogram, both ends leaning by the skew. A diagonal difference of a few millimetres is easy to measure with a steel tape and reveals a skew that is hard to see with a square.
- 0 mm | 0 | Seam gaps even from top to bottom
- 2 mm | 3.4 mm | Each seam's gap tapers by 2 mm
- 3 mm | 5.1 mm | Each seam's gap tapers by 3 mm
- * 5 mm | 8.4 mm | 2 to 7 mm at one seam; 2 mm to a 3 mm overlap at the other
```

The diagonal check costs a minute per plate and is done after marking and again after cutting, because a plasma cutter's path can drift from a correctly marked line.

## Marking curves on plate

Straight lines are struck with a chalk line or scribed along a straightedge. Curves are harder on a plate several metres long, and the shop uses three methods, chosen by the curve's radius.

1. **From the centre.** An arc whose centre lies on or near the plate is swung with a trammel or a steel tape held at the centre punch. The cone segments' arcs, with radii of 2,409.24 and 409.24 mm, are marked this way from an apex marked on a clamped scrap plate beside the sheet.
2. **By offsets from a chord.** An arc whose centre is out of reach is marked by measuring offsets square to its chord at even intervals, calculated from the radius, and joining the points with a flexible batten. The method is exact at the points and very close between them if the points are not too far apart.
3. **By coordinates.** On a CNC table, every curve is cut from coordinates in the cutting file, and marking is limited to identifying marks and checking points. The checking points are still marked by hand from the drawing, because they are the only independent test of a program that may have been set up with the wrong scale, the wrong kerf or the wrong part.

Whichever method is used, the shop checks one curved dimension on every curved part before it is cut: a chord, a rise or a radius. For the cone segments, the outer chord of 2,409.2 mm and its rise of 322.8 mm are the checks, and both are written on the segment's drawing.

## Kerf

A plasma, oxy-fuel or laser cut removes a strip of metal, the **kerf**, whose width depends on the process, the thickness and the settings. This is an illustration. The shop's plasma cuts a kerf of about 3 mm in 6 mm plate.

A marked line is a boundary between the part and the scrap, so the cut must run on the scrap side of it. On a CNC table, that is set by **kerf compensation**: the torch path is offset by half the kerf, 1.5 mm, to the scrap side of every profile. On a hand-guided cut, the operator follows the line with the torch on the scrap side. Either way, the part keeps its full size, and the nesting must leave the kerf between parts. Two parts placed edge to edge with no gap would each lose half the kerf, 1.5 mm, along their shared edge.

The running case's nests allow at least 10 mm between parts and 10 mm from each sheet's edge, enough for the kerf, for a little heat distortion near the cut, and for squaring the mill edges where needed. READOS's chapter on [offsets, clearances and kerf](/reados/publications/drafting-geometry-by-the-numbers/offsets-clearances-and-kerf/) works through kerf compensation for profiles in detail.

## Nesting the 6 mm plate

The 6 mm parts are the four shell plates, the four sides of the loading hopper and the manway neck.

Chapter 2 chose option A for the shell: each course in two equal plates, 3,777.3 × 2,400 mm, one from each 2,400 × 6,000 mm sheet. Each sheet leaves an offcut 2,222.7 mm long and 2,400 mm wide, less the kerf and margin. Four sheets, four offcuts.

The loading hopper's four sides are trapezoids, 1,215 mm at the top and 315 mm at the bottom on their outside faces, 750 mm high on the slope. Two trapezoids nest head to tail, the wide end of one beside the narrow end of the other, in a parallelogram 1,215 + 315 = 1,530 mm long and 750 mm high. Two such pairs, one above the other, need 1,530 × 1,500 mm plus margins, and fit in one offcut with room to spare.

The manway neck, 500 mm inside diameter in 6 mm plate, is rolled from a plate π × 506 − 2 = 1,587.6 mm long and, in this illustration, 200 mm wide. It fits in a second offcut. The remaining offcuts, two whole and the remains of two more, go to the shop's stock for the next job.

Whether those offcuts are charged to this job is a commercial decision, not a geometric one, but the numbers make it visible. Each whole offcut is 2,222.7 × 2,400 mm, 5.33 m² and about 251 kg of 6 mm plate. A shop that regularly uses pieces that size can carry them as stock at their value; one that would scrap them should price the full sheets. Either way, the plate list shows the offcuts by size, so that the estimator and the storeman agree on what came back to the rack.

## Nesting the 8 mm plate

Chapter 4 found that three cone segments, laid alternately, fit on one 8 mm sheet in a row 5,600.4 mm long and 2,054.8 mm deep. The sheet's leftovers are a strip about 345 mm wide along one side, a piece about 400 mm long at one end, and the small triangles between segments.

The outlet flange, 560 mm outside diameter, does not fit any of them whole. Two choices follow. The flange can be made in two halves, each a half ring 560 mm long and 280 mm deep, which fit end to end in the 345 mm strip, and joined with full-penetration butt welds across the ring, if the designer accepts a spliced flange. Or the flange can be cut whole from another 8 mm sheet or a remnant. The running case's designer accepts the spliced flange, so the 8 mm plate stays at one sheet. The shop records the decision on the plate list, because a fabricator who changes it later would need a second sheet of 8 mm plate for a 6.8 kg part.

## The roof: 12 mm too wide

The roof is a flat disc of 5 mm plate whose diameter matches the shell's outside, 2,412 mm. The plate is 2,400 mm wide. Like the cone's half annulus, the roof misses the plate's width by a small margin, here **12 mm**.

A single disc is therefore impossible, and the roof is made in two pieces with a seam across it. Splitting it through the centre gives two half discs, each 2,412 mm long and 1,206 mm deep, which fit along the 6,000 mm sheet end to end. Splitting it off centre, so that one piece is as wide as the plate allows, leaves a sliver 12 mm deep and 339.4 mm long, which is absurd to make and weld.

A third option is for the designer to change the roof's detail so that it sits inside the shell, on a ring, at the shell's 2,400 mm inside diameter less a clearance. A disc of about 2,396 mm would fit within a 2,400 mm plate, but only with 2 mm to spare on each side for the kerf, the plate's own width tolerance and its edge condition. That is too tight to rely on. The roof is made in two halves with a centre seam, placed clear of the roof inlet.

The 5 mm sheet carries the roof's 4.569 m² on 14.4 m², a yield of **31.7%**, and leaves a strip about 1,170 mm wide along the whole sheet, a useful piece for the shop's stock.

```figure
type: compare
title: The bin's plate list by thickness
rowhead: Thickness
cols: Sheets of 2,400 × 6,000 mm | Parts on them | Gross mass, kg | Net mass used, kg | Yield
caption: This is an illustration. Net masses are the parts' own masses; offcuts are returned to stock. Angle and fittings are listed separately.
- 6 mm | 4 | Shell, 4 plates; loading hopper, 4 sides; manway neck | 2,713 | about 1,830 | 67.5%
- 8 mm | 1 | Hopper cone, 3 segments; outlet flange, 2 halves | 904 | about 563 | 62.2%
- 5 mm | 1 | Roof, 2 half discs | 565 | about 179 | 31.7%
- * Total | 6 | | 4,182 | about 2,572 | 61.5%
```

## Marking the parts

Each part is marked before it leaves the cutting table, because once it is cut, its identity is no longer obvious from its shape. The shop's marks are:

1. the job number, part number and its place on the bin, for example "BIN 1, LOWER COURSE, 225°–45°";
2. the inside face, for every rolled or folded part;
3. the datum line, 0°, on the shell plates and the roof;
4. centre lines and centre punches for every opening and attachment;
5. forming lines for the cone's segments and bend lines for any pressed part;
6. heat numbers transferred from the plate, if the drawing or the client requires material traceability.

Marks are made with a paint marker or a low-stress stamp, away from weld preparations and from any surface the client will see after painting. Hard stamping on a surface that will be in tension near a weld is avoided, because a stamp mark is a small notch.

## Using the plate list to check the drawing

A complete plate list is also a check on the drawing. Adding up the parts' masses gives the bin's mass, which can be compared with the designer's estimate. Adding up the seams gives the welding work: four vertical shell seams of 2,400 mm, two circumferential seams of 7.6 m, three cone seams of 2,000 mm, one roof seam of 2.4 m, the hopper's four corners of 874.6 mm, and the attachments. And listing each part by thickness shows at once whether a part has been given the wrong thickness, as happens when a drawing's note says "6 mm U.N.O." and a part that should be 8 mm is not marked.

## The error: marked from a mill edge

This is an illustration. The second upper course plate was marked by a plater who set out both of its ends parallel to the sheet's mill end, taking that end as square without checking the diagonals. The mill end was about 5 mm out of square to the long edge over the sheet's 2,400 mm width. The plate was marked, cut and bevelled as a parallelogram: the right length along both long edges, with both ends leaning by 5 mm.

When the course was rolled and its two plates fitted, neither vertical seam was right. At one, the gap opened from the procedure's 2 mm at the top to 7 mm at the bottom; at the other, it closed from 2 mm at the top to an overlap of 3 mm at the bottom. The course's girth was correct on average and wrong at every seam.

The diagonal check would have shown a difference of 8.4 mm before cutting. The fit-up crew found it instead. Trimming the overlapping end would have left the other seam's 7 mm gap, too wide for the welding procedure, and building up the plate's edge with weld was not an approved repair. The plate was replaced from a new sheet, at the cost of 678 kg of plate and a day's work. The shop's marking procedure now ends every rectangle with "diagonals equal within 2 mm, recorded on the plate".

```figure
type: checklist
title: Marking and nesting checks
caption: Each check is quick and each prevents a fault that is slow to correct once the plate is cut or rolled.
- Datum edge proved straight, not assumed from the mill edge | line struck or edge checked with a straightedge
- Diagonals equal within 2 mm and recorded | 4,475.3 mm on a shell plate
- Kerf compensation set to the scrap side of every line | half kerf, 1.5 mm here
- At least 10 mm between parts and from sheet edges | kerf, heat and squaring
- Small parts nested in large parts' offcuts first | loading hopper in shell offcuts
- Parts that do not fit the plate's width found before ordering | cone by 9.2 mm, roof by 12 mm
- x Squaring from the mill edge without diagonals | the skewed upper plate
```

## Exercise: a three-millimetre skew

A shell plate, 3,777.3 × 2,400 mm, is marked with one end skewed by 3 mm across its width. What is the difference between its diagonals, and how long is each?

**Worked answer.** A skew of 3 mm makes the plate a parallelogram: one diagonal runs across a length of 3,777.3 + 3 = 3,780.3 mm and the other across 3,777.3 − 3 = 3,774.3 mm, both over a width of 2,400 mm.

- Long diagonal: √(3,780.3² + 2,400²) = **4,477.8 mm**.
- Short diagonal: √(3,774.3² + 2,400²) = **4,472.8 mm**.
- Difference: **5.1 mm**, about 1.7 times the skew, as the rule of thumb above predicts.

A tape reading of 5 mm between diagonals is easy to see. The skew it reveals, 3 mm at the plate's end, is easy to miss with a square on a plate this size.
