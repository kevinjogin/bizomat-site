---
book: plate-work-by-the-numbers
chapterSlug: conical-shells-in-plate
order: 4
title: "Conical shells in plate"
description: "Develop the bin's 8 mm hopper cone on its true mean line, split it into segments that fit the plate, nest three on one sheet, and find a cone made on its inside line 29 mm short."
draft: false
---

A cone in sheet is a sector of a circle, and a cone in plate is too. What changes is where the sector's radii are measured. The plate's thickness lies square to the cone's sloping surface, not horizontally, so the mean surface is not simply half a thickness outside the inside surface on a plan drawing. And a plate cone is usually too large to cut in one piece, so the sector is split into segments whose size and nesting decide how many plates the cone costs.

This chapter develops the running case's hopper: a cone in 8 mm plate, its walls at 60° to the horizontal, from the shell's 2,400 mm inside diameter down to a Ø400 outlet. It finds the true mean line, shows that the cone's pattern is exactly a half annulus and why that matters, works out which segmentation fits the plate, and ends with a cone developed on its inside surface.

## The cone's geometry

The hopper's walls slope at 60° to the horizontal, so its half angle, the angle between a generator and the vertical axis, is α = 30°. Its inside surface runs from a radius of 1,200 mm at the top, matching the shell's inside, to 200 mm at the outlet. The cone narrows by 1,000 mm of radius at 1 mm of radius per tan 30° = 0.577 mm of height, so its vertical height is 1,000 ÷ 0.577 = **1,732.1 mm**, and its inside slant length, along a generator, is 1,000 ÷ sin 30° = **2,000 mm**.

## The mean line in a sloping wall

A plate's thickness is measured square to its surface. For a vertical shell, square to the surface is horizontal, and the mean surface lies t ÷ 2 outside the inside surface on a plan. For a cone, square to the surface is tilted by α from the horizontal, and a normal offset of t ÷ 2 moves the surface horizontally by (t ÷ 2) ÷ cos α.

For the running case's 8 mm cone at α = 30°:

horizontal offset = 4 ÷ cos 30° = 4 ÷ 0.866 = **4.62 mm**

So the cone's mean surface has radii of 1,204.62 mm at the top and 204.62 mm at the outlet, measured at the same heights as the inside's 1,200 and 200 mm. The sheet metal method in [Sheet Metal Patterns by the Numbers](/reados/publications/sheet-metal-patterns-by-the-numbers/cones-and-reducers-by-radial-lines/) can ignore this for thin sheet. A habit of adding half the thickness, 4 mm, would put the mean line 0.62 mm too far in at every height.

```figure
type: formula
title: Pattern of a cone in plate, on its mean surface
formula: offset = (t ÷ 2) ÷ cos α        R = r + offset
formula: L = R ÷ sin α        pattern angle = 360° × sin α
caption: The running case's 8 mm hopper cone, half angle α = 30°, inside radii 1,200 mm at the top and 200 mm at the outlet.
- t | Plate thickness, 8 mm
- α | Half angle between generator and axis, 30°
- r | Inside radius at a given height
- R | Mean-surface radius at the same height
- L | Slant distance from the apex to that height on the mean surface
step: Offset = 4 ÷ 0.866 = 4.62 mm, so R = 1,204.62 mm at the top and 204.62 mm at the outlet
step: L₁ = 1,204.62 ÷ 0.5 = 2,409.24 mm; L₂ = 204.62 ÷ 0.5 = 409.24 mm
step: Pattern angle = 360° × sin 30° = 180°: the pattern is exactly a half annulus
step: Check: L₁ − L₂ = 2,000 mm, the slant length of the wall
```

## A half annulus

The pattern angle of any right cone is 360° × sin α, so a cone with a 30° half angle unrolls to exactly half a circle. The running case's hopper is a half annulus with an outer radius of 2,409.24 mm and an inner radius of 409.24 mm. That is a neat result, and it gives an easy check on any drawing: the two straight edges of the pattern lie on one straight line through the apex.

It also shows at once whether the cone fits the plate in one piece. A half annulus of outer radius 2,409.24 mm needs a rectangle 4,818.5 mm long and 2,409.2 mm wide. The plate is 2,400 mm wide. The one-piece pattern misses by **9.2 mm**.

There is no point arguing over 9 mm of plate width. The cone is made in segments, and the question becomes how many.

The cone's geometry also gives the hopper's capacity, which the designer needs and the fabricator can check. The inside of a cone frustum holds π × h ÷ 3 × (R₁² + R₁R₂ + R₂²), here π × 1.7321 ÷ 3 × (1.2² + 1.2 × 0.2 + 0.2²) = **3.12 m³**. The shell above it holds π × 1.2² × 4.8 = 21.71 m³, so the bin holds about 24.8 m³ to the top of the shell. Those are geometric volumes; how much stockfeed the bin actually holds depends on the material's angle of repose at the top and how it flows, which are the designer's concern.

## Choosing the segments

Splitting the half annulus into n equal segments gives n pieces, each with a pattern angle of 180° ÷ n and each covering 360° ÷ n of the cone. Each segment is an annular sector with two straight radial edges, which become the cone's seams, an outer arc and an inner arc.

Equal annular sectors nest well on a plate when alternate segments are turned through 180°, so that the narrow end of one sits beside the wide end of the next. The running case's numbers were worked out by placing segments alternately and finding the closest spacing at which they do not overlap, with all of them inside the same 2,400 mm band of plate.

```figure
type: compare
title: Segment options for the 8 mm hopper cone
rowhead: Segments
cols: Each segment's rectangle, mm | Row of segments, mm | 2,400 × 6,000 sheets | Seams
caption: This is an illustration. Rows are segments laid alternately in one band, before cutting allowance. Three segments are the fewest that fit on one sheet.
- 1, half annulus | 4,818.5 × 2,409.2 | does not fit the width | not possible | 1
- 2 | 3,407.2 × 2,119.9 | 6,105.8 × 2,119.9 | 2, one per sheet | 2
- * 3 | 2,409.2 × 2,054.8 | 5,600.4 × 2,054.8 | 1 | 3
- 4 | 1,844.0 × 2,031.2 | 5,307.6 × 2,031.2 | 1 | 4
```

Two segments fit one to a sheet but not two to a sheet: their alternating row is 6,105.8 mm, 105.8 mm longer than the plate. Three segments, each covering 120° of the cone, fit alternately on one sheet with 399.6 mm to spare along its length and 345.2 mm across it. Four also fit, with more seams to weld.

The shop chooses **three segments**. The cone's mean-surface area is π × (1,204.62 + 204.62) × 2,000 = 8.855 m², so one 14.4 m² sheet carries it at a yield of **61.5%**, against 30.7% for two segments on two sheets. One sheet of 8 mm plate weighs 904 kg, so the choice saves nearly a tonne of plate at the cost of one more 2,000 mm seam. The offcuts, a strip about 345 mm wide along one side and the triangles between segments, carry the outlet flange and other small 8 mm parts.

```figure
type: svg
title: Three cone segments nested on one sheet
alt: A long rectangle representing a 2,400 by 6,000 mm plate. Three fan-shaped segments, each an annular sector of 60 degrees, sit side by side in a band along the plate. The middle segment is turned upside down, so its wide outer arc is at the bottom and its narrow inner arc at the top, and its straight edges sit close beside the edges of the two outer segments.
caption: This is an illustration at 0.09 scale. Alternate segments are turned through 180°; the row is 5,600.4 mm long and 2,054.8 mm deep, leaving offcuts for the outlet flange and small parts.
viewbox: 0 0 620 270
body:
<rect class="bxi" x="40" y="24.4" width="540" height="216"/>
<path class="bxa" d="M40 69L60.2 58.7L81.4 50.6L103.3 44.7L125.8 41.2L148.4 40L151.3 40L171.1 41.2L193.5 44.7L215.4 50.6L236.6 58.7L256.8 69L163.8 223.4L160.3 222L156.5 220.9L152.7 220.3L148.9 220L145 220.2L141.2 220.7L137.5 221.7L133.9 223L130.4 224.7L130 224.9Z"/>
<path class="bxa" d="M400.4 195.9L380.2 206.2L359 214.3L337.1 220.2L314.7 223.7L292 224.9L289.2 224.9L269.4 223.7L246.9 220.2L225 214.3L203.8 206.2L183.6 195.9L276.6 41.6L280.2 43L283.9 44L287.7 44.7L291.5 44.9L295.4 44.8L299.2 44.2L302.9 43.3L306.6 41.9L310 40.2L310.4 40Z"/>
<path class="bxa" d="M327.2 69L347.4 58.7L368.6 50.6L390.5 44.7L413 41.2L435.6 40L438.5 40L458.3 41.2L480.7 44.7L502.6 50.6L523.8 58.7L544 69L451 223.4L447.5 222L443.8 220.9L440 220.3L436.1 220L432.3 220.2L428.4 220.7L424.7 221.7L421.1 223L417.6 224.7L417.2 224.9Z"/>
<text class="txs" x="44" y="258">Plate 6,000 × 2,400 mm, 8 mm</text>
<text class="txs" x="400" y="258">Row 5,600.4 mm</text>
<text class="txa" x="130" y="130">1</text>
<text class="txa" x="286" y="130">2</text>
<text class="txa" x="418" y="130">3</text>
```

## Marking a segment

Each segment is marked from its apex, which lies off the segment, 409.24 mm beyond its inner arc. On a plate, the apex is marked on a scrap plate or a timber block clamped beside the plate, or the segment is marked by offsets without the apex:

1. Mark the segment's centreline and, on it, the outer and inner arcs' midpoints, 2,000 mm apart.
2. Mark the outer arc's ends, symmetrically about the centreline, from the outer chord of 2 × 2,409.24 × sin 30° = **2,409.2 mm**, and its rise above the chord, 2,409.24 × (1 − cos 30°) = **322.8 mm**, at the middle.
3. Mark the inner arc's ends from its chord, 2 × 409.24 × sin 30° = **409.2 mm**, and its rise, **54.8 mm**.
4. Join the arc ends with straight lines; each must be **2,000 mm**, the wall's slant length, which is the check.
5. Plot intermediate points on each arc by offsets from its chord, or swing the arc with a steel tape from the apex if it has been marked.

Every segment also gets its forming lines: radial lines from the apex at even spacing across the segment, which the press brake or roll operator uses to keep each bend along a generator. A cone bent along lines that do not pass through the apex twists and will not close.

## Forming the segments

A plate cone cannot be rolled like a cylinder, because the small end must travel a shorter distance than the large end on each pass. Fabricators form cones in plate in three main ways: on plate rolls with a cone-rolling attachment that slows the small end; by **bump forming** on a press brake, with many small bends along the radial lines; or by pressing on dies for repeated production. The running case's shop bump forms on its press brake, with bends along radial lines every few degrees across each segment, checked against an inside template of the cone's curvature at the top, middle and bottom of the segment.

Like the shell, a cone springs back, more at its large end, where the radius of curvature is large, than at its small end. Its radius of curvature in the bending direction is r ÷ cos α, about 1,386 mm at the top and 231 mm at the outlet on the inside surface. The springback at the top is similar to the shell's, and the template, not a calculation, decides when each zone is right.

## The junction with the shell

The cone's top edge meets the shell's bottom edge at a circumferential seam, and the two plates meet at an angle of 30° to each other. The cone's top edge is cut horizontally, on the mean-surface girth of 2π × 1,204.62 = 7,568.9 mm at that height, and bevelled to suit the weld detail on the drawing.

A cone-to-shell junction in a bin carries a concentrated ring force where the wall changes direction, and designers often detail it with a heavier plate, a ring beam or a curved knuckle. Those details are structural decisions for the bin's designer. The pattern maker's part is to develop whatever the drawing shows on its correct line, and to raise a question if the drawing leaves the junction's geometry unclear.

## Checking the formed cone

The three segments are tacked together on a level floor, outlet down, and checked before the seams are welded. Four measurements confirm the cone without reference to the pattern.

1. **Girths.** A tape around the outside of the top edge reads the outside girth. The outside surface is offset 8 ÷ cos 30° = 9.24 mm horizontally from the inside, so its radius at the top is 1,209.24 mm and its girth 2π × 1,209.24 = **7,597.9 mm**. At the outlet, the outside girth is 2π × 209.24 = **1,314.7 mm**.
2. **Slant length.** Along each seam, from the outlet to the top edge, the slant is **2,000 mm**, the same on the inside, mean and outside surfaces, because they are parallel.
3. **Height.** From the floor to the top edge, at four points around the cone, the height is **1,732.1 mm** to the inside surface's top edge. Unequal readings mean the top is not level, usually because one segment was formed more tightly than the others.
4. **Roundness.** Two diameters across the top at right angles, measured inside, should both be 2,400 mm. A difference shows that the cone has been formed oval, and the segments are adjusted at their tacks before welding.

The cone is then offered up to the shell before either is welded out, if the shop's crane and floor allow, so that the circumferential seam can be fitted with both parts still adjustable. Fitting a welded cone to a welded shell leaves nothing to adjust but the seam itself.

## The error: a cone on its inside line

This is an illustration. The first cone's segments were marked by a plater used to sheet metal, who took the radii from the drawing's inside dimensions: 1,200 ÷ sin 30° = 2,400 mm and 200 ÷ sin 30° = 400 mm. The segments were cut, bump formed and offered up to the shell.

The cone's top girth on its mean line was π × 2,400 = 7,539.8 mm where it should have been π × 2,409.24 = 7,568.9 mm, **29.0 mm short**. Spread over the cone's three seams, the gaps were nearly 10 mm wider each than the procedure's root gap, and the cone's top stood about 4.6 mm inside the shell all round.

A second plater, asked to fix it, proposed adding half the plate's thickness, 4 mm, to each radius. That would have given 2,408 mm and still left the cone 3.9 mm short in girth, because the mean line in a sloping wall is offset by t ÷ (2 cos α), not t ÷ 2. The checker found both errors at the plate list stage for the replacement segments by recomputing L₁ from the formula above, and the segments were recut at 2,409.24 and 409.24 mm. The rule now on the shop's cone checklist reads: "Offset the mean line square to the plate, then convert to plan."

```figure
type: bars
title: Top girth of the hopper cone by the line it was developed on
unit: mm
max: 7600
caption: The correct mean-surface girth is 7,568.9 mm. Developing on the inside line loses 29.0 mm; adding half the thickness horizontally still loses 3.9 mm.
- Inside line, L₁ = 2,400 mm | 7539.8
- Half thickness added horizontally, L₁ = 2,408 mm | 7565
- * True mean surface, L₁ = 2,409.24 mm | 7568.9
```

## Exercise: a steeper-walled hopper

A second bin uses a hopper with walls at 45° to the horizontal, in 10 mm plate, from an inside radius of 1,000 mm at the top to 150 mm at the outlet. Find its height, the horizontal offset to its mean surface, its pattern radii and its pattern angle.

**Worked answer.** The half angle is α = 45°.

- Height: (1,000 − 150) ÷ tan 45° = **850 mm**.
- Offset: (10 ÷ 2) ÷ cos 45° = **7.07 mm**, so the mean radii are 1,007.07 and 157.07 mm.
- Pattern radii: L₁ = 1,007.07 ÷ sin 45° = **1,424.2 mm**; L₂ = 157.07 ÷ sin 45° = **222.1 mm**.
- Pattern angle: 360° × sin 45° = **254.6°**, more than a half annulus, because a flatter cone has a wider pattern.

The offset here is 7.07 mm against the 5 mm a sheet worker would add, a difference of 2.07 mm on each radius, which on the cone's top girth is worth 2π × 2.07 = 13.0 mm.
