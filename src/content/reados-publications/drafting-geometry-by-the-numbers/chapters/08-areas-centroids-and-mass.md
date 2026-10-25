---
book: drafting-geometry-by-the-numbers
chapterSlug: areas-centroids-and-mass
order: 8
title: "Areas, centroids and mass from a 2D profile"
description: "Calculate a profile's area by the shoelace formula and by composite shapes, find its centroid, turn it into mass, and check the CAD's region properties before anyone relies on them."
draft: false
---

A closed 2D profile carries more information than its outline. Its area, multiplied by the thickness and density, gives the part's mass, which feeds quotes, shipping weights, lifting plans and the loads on whatever supports it. Its centroid gives the centre of mass of a flat part, which decides how it hangs, how it balances and what moment its weight applies about a pivot. CAD software reports all of this in a second from a region or a closed polyline, and it is right as long as the region is right.

This chapter shows how to calculate area and centroid by hand, by two independent routes, so that the CAD result can be checked and its errors found. The running case calculates the motor plate's mass and centre of mass, and catches a region that had been measured without its holes.

## Area by the shoelace formula

For any closed polygon whose corners (x₁, y₁) … (xₙ, yₙ) are listed in order round the boundary, the area is:

A = ½ × |Σ (xᵢ × yᵢ₊₁ − xᵢ₊₁ × yᵢ)|

with the last corner wrapping round to the first. The name comes from the criss-cross pattern of the products when the coordinates are written in two columns. Listed anticlockwise, the sum is positive; clockwise, negative. Its magnitude is the area either way. The WORKOS [polygon area calculator](/tools/polygon-area/) applies the formula to a pasted list of corners.

For the plate's outline without its R40 corner, the five corners A (0, 0), B (220, 0), C (220, 95), D (175, 140) and the original top left corner (0, 140) give products of 0, 20,900, 30,800 − 16,625 = 14,175, 24,500 and 0, which sum to 59,575, so the area is **29,787.5 mm²**. That is the 220 × 140 = 30,800 mm² rectangle less the 1,012.5 mm² chamfer triangle, as it should be.

Arcs need extra terms. A circular arc that bulges outwards adds the area of its circular segment to the polygon through its endpoints. The R40 corner, replacing the original square corner, removes a region of 40² − π × 40² ÷ 4 = **343.36 mm²**. With it, the outline's area is 29,444.14 mm², the figure the software reported in Chapter 1.

```figure
type: formula
title: The shoelace formula and its centroid
formula: A = ½ Σ (xᵢ yᵢ₊₁ − xᵢ₊₁ yᵢ)
formula: x̄ = Σ (xᵢ + xᵢ₊₁)(xᵢ yᵢ₊₁ − xᵢ₊₁ yᵢ) ÷ 6A        ȳ = Σ (yᵢ + yᵢ₊₁)(xᵢ yᵢ₊₁ − xᵢ₊₁ yᵢ) ÷ 6A
caption: Corners in order round the boundary, the last wrapping to the first. Curves can be approximated by many short chords, which is how a spreadsheet or script checks a CAD result.
- xᵢ, yᵢ | Coordinates of corner i, mm
- A | Signed area, positive when the corners run anticlockwise, mm²
- x̄, ȳ | Centroid of the polygon, mm
step: Plate corners without the R40: products 0, 20,900, 14,175, 24,500, 0
step: A = ½ × 59,575 = 29,787.5 mm², equal to 30,800 − 1,012.5
```

## Composite areas and holes

The shoelace formula handles any outline, but the composite method is often clearer for a drafted part: start with a simple shape whose area and centroid are known, then subtract or add the pieces that differ. Each piece needs only its area and its own centroid, and standard results cover most of them:

- **rectangle**: centroid at its centre;
- **triangle**: centroid at the average of its three corners;
- **circle**: centroid at its centre;
- **quarter circle** of radius r: centroid 4r ÷ 3π from each straight edge, which is 16.977 mm for r = 40;
- **slots, sectors and segments**: standard formulas, or a quick numerical calculation.

Holes are simply negative pieces. The plate's net area is the outline less the bore, the four motor holes, the pivot hole and the arc slot.

## The running case: area and mass

This is an illustration. The drafter built the plate's area from its parts, including the two R10 fillets from Chapter 4:

- rectangle 220 × 140: 30,800.00 mm²;
- less the chamfer triangle: 1,012.50 mm²;
- less the region removed by the R40 corner: 343.36 mm²;
- less the two R10 fillet corners: 2 × 2.151 = 4.30 mm²;
- less the Ø60 bore: π × 30² = 2,827.43 mm²;
- less the four Ø9 holes: 4 × π × 4.5² = 254.47 mm²;
- less the Ø11 pivot hole: 95.03 mm²;
- less the arc slot: 11 × 47.124 + π × 5.5² = 613.40 mm², the swept band plus the two semicircular ends.

The net area is **25,649.51 mm²**. The plate is 10 mm thick, so its volume is 256,495 mm³, or 2.56495 × 10⁻⁴ m³. At a density of 7,850 kg/m³, typical for carbon steel, its mass is **2.013 kg**. The blank it is cut from, 220 × 140 × 10 mm, weighs 2.418 kg, so 0.405 kg, or about 17%, becomes offcut and slug.

```figure
type: stack
title: Where the 30,800 mm² rectangle goes
unit: mm²
caption: This is an illustration. The net plate is the first segment; every other segment is removed by the outline or cut out as a hole.
- Net plate | 25649.51
- Ø60 bore | 2827.43
- Chamfer | 1012.5
- Arc slot | 613.4
- R40 corner | 343.36
- Four motor holes | 254.47
- Pivot hole | 95.03
- R10 fillets | 4.3
```

## Centroids of composite shapes

The centroid of a composite shape is the area-weighted average of its pieces' centroids, with holes and removed pieces counted as negative areas:

x̄ = Σ (Aᵢ × x̄ᵢ) ÷ Σ Aᵢ        ȳ = Σ (Aᵢ × ȳᵢ) ÷ Σ Aᵢ

The method needs a table. Each row is a piece with its signed area and its centroid; the products Aᵢx̄ᵢ and Aᵢȳᵢ are summed and divided by the net area. The R40 corner region is the 40 × 40 square at the top left, centroid (20, 120), less the quarter circle about (40, 100), whose centroid is 16.977 mm in from each straight edge, at (23.023, 116.977). Taken together, the removed region's centroid is at (8.935, 131.065), tucked into the corner. The arc slot's centroid, calculated numerically, is at (195.077, 58.812), just inside its centreline.

```figure
type: compare
title: Centroid of the motor plate by composite areas
cols: Area, mm² | x̄, mm | ȳ, mm | A × x̄, mm³ | A × ȳ, mm³
caption: This is an illustration. Removed pieces and holes carry negative areas. The two fillets are placed at the midpoint of the chamfer; their effect is below 0.01 mm.
- Rectangle 220 × 140 | 30,800.00 | 110.000 | 70.000 | 3,388,000 | 2,156,000
- Chamfer triangle | −1,012.50 | 205.000 | 125.000 | −207,562 | −126,562
- R40 corner region | −343.36 | 8.935 | 131.065 | −3,068 | −45,002
- Two R10 fillets | −4.30 | 197.5 | 117.5 | −849 | −505
- Bore and four motor holes | −3,081.90 | 110.000 | 70.000 | −339,009 | −215,733
- Pivot hole | −95.03 | 20.000 | 20.000 | −1,901 | −1,901
- Arc slot | −613.40 | 195.077 | 58.812 | −119,660 | −36,075
- *Net plate | 25,649.51 | 105.887 | 67.456 | 2,715,950 | 1,730,221
```

The plate's centroid is at **(105.89, 67.46)**, 4.11 mm left of and 2.54 mm below the bore centre. The chamfer and slot remove material from the right, which pulls the centroid left; the R40 corner removes a little from the top left, which pulls it slightly right and down.

## What the centroid is for

For a flat plate of uniform thickness, the centroid of the profile is the centre of mass of the part. Three uses follow.

**Handling and lifting.** A plate lifted on one hook through a hole hangs with its centre of mass directly below the hook. For larger plates, the drafter may be asked where to put a lifting hole so that the plate hangs level; the answer is directly above the centroid.

**Loads about a pivot.** The motor plate turns about P. With the motor fitted, the combined weight applies a moment about P that the lock bolt must resist. The plate's own weight, 2.013 × 9.81 = 19.75 N, acts 105.89 − 20 = 85.89 mm horizontally from P, a moment of 1.70 N·m. If the motor, in this illustration, weighs 9 kg with its centre of mass on the bore axis, it adds 9 × 9.81 × 0.090 = 7.95 N·m, for a total of 9.64 N·m with the plate vertical. At the lock bolt, 180 mm from P, that is a tangential force of 9.64 ÷ 0.180 = **53.6 N** that the bolt's clamping friction must hold, plus the belt tension, which is much larger. The engineer, not the drafter, decides whether the bolt holds, but the drafter supplies the geometry the calculation needs.

**Balancing and nesting.** Rotating parts need their centroid on the axis of rotation; nesting software uses area to estimate material yield. Both rely on the profile being complete and closed.

**The tilted mounting.** Chapter 6 mounted the plate on a face sloping 30° back from vertical. The pivot bolt is then square to that sloping face, and the weight, which still acts vertically, splits into two components: W × cos 30° in the plane of the plate, which turns it about the pivot, and W × sin 30° square to the plate, which presses it onto its face. The lever arm in the plate's plane is still the 85.89 mm horizontal offset, because that direction lies along the tilt axis, so the turning moment falls to 0.866 of its vertical-plate value: 9.64 × 0.866 = 8.35 N·m for the plate and motor together. The drafter's contribution is again the geometry: the centroid's position in the plate's coordinates, which the engineer can project into whatever orientation the plate takes.

## The error: the region without holes

This is an illustration. For the first quote, the estimator asked the drafter for the plate's mass. The drafter converted the outline into a region and read its area from the software: 29,439.84 mm², a mass of 2.311 kg. The estimator multiplied by the order quantity of 400 plates and booked 924 kg of steel and freight.

The figure was 14.8% high, because the region had been made from the outline alone. In most CAD programs, a region or closed polyline made from an outer boundary does not know about the circles drawn inside it; the holes must be made into regions too and subtracted, or the whole profile must be selected so that the software builds the region with its islands. The correct mass, 2.013 kg, gives 805 kg for the order. The 119 kg difference was found when the drafter's hand check, done the next day for the drawing's title block, disagreed with the quoted figure.

The hand check that caught it takes two minutes: the rectangle's area less the obvious pieces. A blank of 30,800 mm² with a Ø60 bore alone cannot have an area above 27,973 mm², so any reported area near 29,440 mm² must have missed the holes. The office now asks for the region's centroid as well as its area, because a centroid at (107.90, 67.39), the outline's, rather than (105.89, 67.46) is another sign that the holes are missing.

## Two routes that should agree

The point of a hand calculation is not to replace the software but to give it something to agree with. For the plate, there are three routes, and each has a characteristic way of being slightly wrong.

**The CAD region.** Exact for lines and arcs, provided the region includes every hole. Its typical error is gross, not small: a missing hole, a duplicated one, or an outline that did not close and so produced no region at all.

**The composite table.** Exact if every piece's area and centroid formula is right. Its typical error is a sign: a removed piece added instead of subtracted, or a hole entered as a positive area.

**The shoelace formula on a list of points.** Exact for straight edges, but arcs must be approximated by chords, and every chord cuts off a thin circular segment. For an arc of radius r split into n chords each subtending θ, the lost area is n × (r² ÷ 2) × (θ − sin θ), with θ in radians. The R40 corner split into 9 chords of 10° each loses 6.37 mm²; into 90 chords of 1°, only 0.06 mm². A Ø60 bore approximated by 36 chords is 14.33 mm² too small, which makes the plate's net area too large by the same amount.

When the three routes agree to within the known approximation, the result can be trusted. When they disagree by more, one of them has a gross error, and the size of the disagreement usually says which: a few square millimetres points to chord approximation, hundreds or thousands to a missing piece.

```figure
type: bars
title: Area lost by approximating the R40 corner with chords
unit: mm²
max: 60
caption: Lost area = n × (r² ÷ 2) × (θ − sin θ) for n chords across a 90° arc of radius 40 mm. The same effect makes a chorded hole too small.
- 3 chords of 30° | 56.637
- *9 chords of 10° | 6.37
- 18 chords of 5° | 1.594
- 90 chords of 1° | 0.064
```

## Thickness, density and the mass that goes on the drawing

Area is exact; mass is not, because it multiplies the area by two numbers that are only nominal. Plate is supplied within a thickness tolerance set by its product standard, and density varies a little between grades. The same profile cut from 10.5 mm plate would weigh 2.114 kg, 5% more, and the same profile in aluminium at a typical 2,700 kg/m³ would weigh 0.693 kg.

For that reason the mass on a drawing or in a bill of materials should be labelled as calculated, from the nominal thickness and a stated density, and rounded to a sensible precision: 2.01 kg for the plate, not 2.0134 kg. Where mass matters for a lift, a load or a balance, the engineer should add a margin or weigh the first part, and the drafter's job is to make sure the calculated figure comes from a complete, closed profile.

## Exercise: the larger chamfer

Chapter 3's customer proposed a 60 × 60 mm chamfer instead of 45 × 45 mm, keeping the R10 fillets. What is the new mass, and where does the centroid move?

**Worked answer.** The larger chamfer triangle has an area of 60 × 60 ÷ 2 = 1,800 mm², 787.5 mm² more than the original, with its centroid at the average of its corners (220, 80), (220, 140) and (160, 140), which is (200, 120). The fillet corners still remove 4.30 mm² between them, now near the new chamfer's ends.

The net area falls from 25,649.51 mm² to 25,649.51 − 787.5 = **24,862.0 mm²**, so the mass becomes 24,862.0 × 10 × 7,850 × 10⁻⁹ = **1.952 kg**, 61 g lighter.

For the centroid, remove the extra 787.5 mm² from the original totals. The extra triangle is the difference between the new and old chamfer triangles, so its moments are 1,800 × 200 − 1,012.5 × 205 = 152,437.5 mm³ about the y axis and 1,800 × 120 − 1,012.5 × 125 = 89,437.5 mm³ about the x axis. Subtracting from the net moments gives x̄ = (2,715,950 − 152,438) ÷ 24,862.0 = **103.11 mm** and ȳ = (1,730,221 − 89,438) ÷ 24,862.0 = **66.00 mm**. A full numerical check of the new profile, with the fillets moved to the new corners, gives (103.11, 66.00). The centroid moves 2.8 mm left and 1.5 mm down, away from the larger cut corner.
