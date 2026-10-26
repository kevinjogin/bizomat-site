---
book: oval-sheet-metal-work-by-the-numbers
chapterSlug: area-and-capacity
order: 4
title: "Area and capacity of oval vessels"
description: "The exact area of a four-centre oval, the offset rule for areas, capacity to any level by integration, 1.24 L per mm at the fill line, and a capacity claimed from the top area."
draft: false
---

Capacity is usually the reason an oval vessel exists, and the number a customer checks first. A flared oval trough's capacity cannot be read off a table or found by multiplying three dimensions together: its cross-section changes shape as well as size from bottom to top. But because every horizontal section of a flared four-centre oval is another four-centre oval from the same centres, its area at any height follows a simple formula, and the capacity to any level follows from that exactly.

This chapter finds the running case's top and bottom areas exactly, extends Chapter 3's offset rule from girths to areas, works out the trough's capacity brim-full and to its fill line, gives the litres per millimetre near the top, compares quicker estimates, and ends with a capacity claimed on a label from the top area alone.

## The area of a four-centre oval

A four-centre oval's area can be found by adding its pieces. The two side arcs, with their centres, sweep two sectors of radius R and angle θ_side; the two end arcs sweep two sectors of radius r and angle θ_end; and the overlap between the side sectors and the end sectors, two pairs of triangles around the oval's centre, is counted twice and must be taken away once. Collecting the terms:

A = R² × θ_side + r² × θ_end − 2 × (a − r) × (R − b)

For the running case's top oval, with R = 1,575 mm, θ_side = 0.9799 rad, r = 300 mm, θ_end = 2.1617 rad, a − r = 600 mm and R − b = 1,125 mm:

A = 2,430,779 + 194,552 − 1,350,000 = **1,275,352 mm²**, or **1.2754 m²**.

The bottom oval, radii 1,500 and 225 mm with a − r still 600 and R − b now 1,125 mm, gives **0.9642 m²**.

```figure
type: formula
title: Area of a four-centre oval
formula: A = R² × θ_side + r² × θ_end − 2 × (a − r) × (R − b)
caption: The running case's top oval, mean line. The last term removes the overlap between the sectors, which would otherwise be counted twice.
- R, r | Side and end radii, 1,575 and 300 mm
- θ_side, θ_end | Arc angles, 0.9799 and 2.1617 rad
- a − r, R − b | Distances of the end and side centres from the oval's centre, 600 and 1,125 mm
step: R² × θ_side = 2,430,779 mm²
step: r² × θ_end = 194,552 mm²
step: A = 2,430,779 + 194,552 − 1,350,000 = 1,275,352 mm² = 1.2754 m²
```

## The offset rule for areas

Chapter 3 found that offsetting a four-centre oval by d changes its girth by 2πd. Its area changes by a similar rule: A(d) = A₀ + P₀ × d + π × d², where A₀ and P₀ are the original area and girth. The middle term is the strip around the girth; the last is the four corner pieces that make up a full circle of radius d between them.

The rule holds for any amount of offset, inward or outward, as long as the end radius stays positive; offset inward past the end radius, the end arcs vanish and the outline is no longer a four-centre oval. The rule checks the bottom area without recalculating it: offsetting the top inward by 75 mm gives 1,275,352 − 4,383.7 × 75 + π × 75² = 1,275,352 − 328,778 + 17,671 = **964,243 mm²**, the same as the direct calculation.

More usefully, it gives the area at any height in the trough. A section z millimetres above the bottom is the bottom oval offset outward by 75 × z ÷ 450, a sixth of z, so its area is

A(z) = 964,243 + 3,912.5 × (z ÷ 6) + π × (z ÷ 6)²

which is a quadratic in z. The trough's capacity to a height h is the integral of A(z) from 0 to h, and because A(z) is a quadratic, that integral is exact.

## Capacity

Integrating term by term, the capacity to a height h above the bottom is:

V(h) = 964,243 × h + 3,912.5 × h² ÷ 12 + π × h³ ÷ 108

in cubic millimetres. For the running case:

- **brim-full**, h = 450 mm: V = **502.6 litres**;
- **to the fill line**, 50 mm below the rim, h = 400 mm: V = **439.7 litres**.

The same result follows from the prismoidal formula, V = h ÷ 6 × (A_bottom + 4A_middle + A_top), which is exact for any solid whose sectional area is a quadratic in height, as this one is. Either method is a few lines in a spreadsheet.

```figure
type: compare
title: Capacity of the running case trough
rowhead: Level
cols: Height above bottom, mm | Area at that level, m² | Capacity below it, L
caption: Exact, from the area's quadratic. The fill line is 50 mm below the rim.
- Bottom | 0 | 0.9642 | 0.0
- * Fill line | 400 | 1.2390 | 439.7
- Rim | 450 | 1.2754 | 502.6
```

## A level table

The capacity formula gives the volume to any level, and a table of levels is worth printing for the customer, because a farmer checking water supplies reads the depth, not the litres. For the running case, the capacity below each level, measured up from the bottom, is:

- 50 mm: 49.0 litres; 100 mm: 99.7; 150 mm: 152.1; 200 mm: 206.1;
- 250 mm: 261.9 litres; 300 mm: 319.4; 350 mm: 378.7;
- 400 mm, the fill line: 439.7 litres; 450 mm, the rim: 502.6 litres.

Each 50 mm band holds more than the one below it, from 49.0 litres at the bottom to 62.9 litres at the top, because the trough widens upward. A depth gauge marked in litres, stamped or etched inside one end, turns the table into something that can be read at a glance across a paddock.

## Designing to a capacity

If a customer asks for a given capacity, the trough's depth can be solved for it. This is an illustration. Keeping the top at 1,800 × 900 mm and the walls' flare at one sixth of the depth, a trough holding **500 litres** to a fill line 50 mm below the rim needs a depth of about **513.9 mm**. Its bottom is then offset 85.6 mm inside the top, with a bottom end radius of 214.4 mm, and every pattern in Chapters 5 and 6 changes with it.

Deepening a flared trough adds less capacity than the same depth on a straight-sided one, because the bottom shrinks as the depth grows. The solution is found by trying depths in the capacity formula, which a spreadsheet's goal-seek does in a moment.

## Litres per millimetre

Near the fill line, each millimetre of depth holds the area at that level times one millimetre: **1.239 litres per millimetre**. That number is useful in three ways.

- A fill line marked 5 mm low gives 6.2 litres less capacity to the line, about 1.4%.
- A float valve set to shut off within ±10 mm of the fill line controls the water to within about ±12 litres.
- The trough's weight when full changes by about 1.24 kg per millimetre of water depth, which matters for its supports and for anyone moving it partly full.

## Quicker estimates and their errors

Several shortcuts are tempting, and their errors vary widely.

- The **average end area**, (A_top + A_bottom) ÷ 2 × 450, gives **503.9 litres**, 1.3 litres or 0.3% high, because it ignores the curvature of the area's growth. Good enough for an estimate.
- Treating the trough as **an ellipse** with the same top and bottom axes changes the areas by about 0.2%, again close.
- Treating it as a **cylinder** with the top's area, 1.2754 × 450, gives **573.9 litres**, **14.2% high**, because it ignores the flare.
- Treating it as a **box** of 1.8 × 0.9 × 0.45 m gives 729 litres, wildly high.

The exact calculation takes no longer than the shortcuts once it is in a spreadsheet, and it is the only one that can be stated on a label. The shortcuts still have a use, as checks: an exact figure that falls far outside the average end area estimate, or above the cylinder estimate, has an error in it somewhere, and the comparison finds it before the figure is published.

```figure
type: bars
title: Brim capacity of the running case by method
unit: L
max: 750
caption: Only the first is exact. Average end areas are close; ignoring the flare overstates capacity by 14%; a box overstates it by 45%.
- * Exact, quadratic area | 502.6
- Average end areas | 503.9
- Top area times depth | 573.9
- Box, 1.8 × 0.9 × 0.45 m | 729
```

## Measuring the capacity

The calculation is checked on the first trough by filling it. Two methods suit a shop.

**By meter.** Fill the trough, set level on a flat floor, from a hose through a water meter, stopping at the fill line. The meter's reading is the capacity to the line, to the meter's accuracy. The trough must be level first: a trough 1,800 mm long that is 5 mm low at one end holds noticeably less to a line that is level only at the other.

**By weight.** Stand the trough on a platform scale, fill it to the line and read the water's mass; a litre of water at shop temperature is very close to a kilogram, so 439.7 kg of water confirms 439.7 litres. This is the more accurate method, but it needs a scale rated for about half a tonne.

Either way, the result should agree with the calculation within the accuracy of the fill line's marking and the trough's dimensions, a few litres. A first article that holds noticeably less points to walls that are not fully flared, a bottom set too high, or a fill line marked low, and each of those is a measurement the shop can then make.

## Freeboard

The 50 mm between the fill line and the rim is freeboard: room for the water to slop when cattle drink or wind blows, for the float valve's overshoot, and for leaves and debris on the surface. Its 62.9 litres of capacity are deliberately unused. A customer who asks for "the most water" may be tempted to fill to the brim, and the fabricator's level table and fill-line mark make the intended level clear.

Freeboard also limits how far water climbs the rim's seam. The rolled rim and the top of the vertical seams are the joints most likely to weep, and keeping the waterline 50 mm below them keeps them dry in normal use.

## Water is heavy

Full to its fill line, the trough holds about 440 kg of water, ten times its own mass of about 36 kg of steel. That load is carried by the bottom plate and the bottom seam, spread over the bottom's 0.964 m², a pressure at the bottom of about 9,810 × 0.4 = **3.9 kPa**, and by the walls, whose pressure rises from zero at the waterline to the same 3.9 kPa at the bottom.

Those pressures are low for steel sheet, but the trough's supports, the ground or a stand under it, must carry the whole 480 kg or so evenly; a trough resting on two points would bend its bottom. And livestock lean on troughs. The trough's structural adequacy for its full load and its use is a design question for whoever specifies it, not something this book's geometry settles.

## The error: capacity claimed from the top area

This is an illustration. The fabricator's first price list described the trough as "575 litre", a figure the office had worked out as the top's area times the depth. A buyer who tested one by filling it from a metered hose found it held about 503 litres to the brim and 440 litres to the fill line, and complained.

The claim was 14.2% high, and on a product sold by its capacity, that is a misleading description, the kind of claim Australian consumer law treats seriously; the ACCC publishes guidance on false and misleading representations about products. The fabricator corrected the price list to "440 litres to the fill line, 500 litres brim-full", apologised, and adopted a rule that any capacity stated in writing is calculated by the exact method, checked by a measured fill on the first article, and states the level it refers to.

```figure
type: checklist
title: Capacity checks before a figure is published
caption: Each check closes a way in which a capacity can be right in arithmetic and wrong in fact.
- Area from the oval's own radii, not an ellipse or box | 1.2754 m² at the top
- Capacity by integration or the prismoidal formula | 502.6 L brim, 439.7 L to the line
- Level stated with every capacity | fill line 50 mm below the rim
- First article filled and the volume measured | metered or weighed
- Load of the full vessel known for its supports | about 440 kg of water
- x Capacity from top area times depth | 575 L claimed, 14.2% high
```

## Exercise: the smaller trough's capacity

The smaller trough, 1,200 × 600 mm with a 200 mm end radius, is 300 mm deep and flares 50 mm all round, so its bottom is 1,100 × 500 mm with a 150 mm end radius and a 1,000 mm side radius. Its fill line is 50 mm below the rim. Find its bottom area, its brim capacity and its capacity to the fill line.

**Worked answer.** The arc angles are the same as the running case's.

- Bottom area: 1,000² × 0.9799 + 150² × 2.1617 − 2 × 400 × 750 = 979,900 + 48,638 − 600,000 = 428,538 mm² with the rounded angles, or **428,552 mm²** with unrounded ones, about 0.4286 m².
- Its bottom girth is 2 × (150 × 2.1617 + 1,000 × 0.9799) = 2,608.3 mm, and every section h millimetres up is offset h ÷ 6.
- Brim capacity, h = 300 mm: **148.9 litres**, which is (2 ÷ 3)³ of the running case's 502.6 litres, because the smaller trough is the running case scaled by two thirds in every direction.
- To the fill line, h = 250 mm: **121.2 litres**.

The fill line's capacity does not scale by (2 ÷ 3)³, because the 50 mm below the rim is the same on both troughs, not scaled. A smaller trough loses a larger share of its capacity to the same freeboard: 18.6% here against 12.5% for the running case.
