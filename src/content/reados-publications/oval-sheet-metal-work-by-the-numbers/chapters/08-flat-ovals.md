---
book: oval-sheet-metal-work-by-the-numbers
chapterSlug: flat-ovals
order: 8
title: "Flat ovals and flared flat ovals"
description: "The flat-oval version of the trough: half-cone ends, flat rectangular sides, 575 L brim-full, the same offset rules, flat-oval duct sizes, and side panels wrongly shortened for the flare."
draft: false
---

A flat oval is a four-centre oval pushed to its limit: end arcs of half the width, side arcs of infinite radius. Its ends are semicircles and its sides are straight. Everything in the earlier chapters still applies, but the side cones of a flared trough become flat planes and their patterns become rectangles, which makes the flat oval the easiest oval to make and the most common in ductwork, tanks and simple troughs.

This chapter redesigns the running case as a flat oval of the same overall size, works out its girths, areas and capacity by the same offset rules, develops its half-cone ends and flat sides, compares it with the four-centre trough, deals briefly with flat-oval duct, and ends with side panels that were shortened by the flare when the flare does not shorten them.

## The flat-oval trough

This is an illustration. The fabricator offers a cheaper flat-oval version of the trough, 1,800 × 900 mm at the top on the mean line, 450 mm deep, flaring 75 mm all round. At the top, the ends are semicircles of **450 mm** radius and the straight sides are 1,800 − 900 = **900 mm** long. At the bottom, the ends are semicircles of 450 − 75 = **375 mm** radius, and the bottom is 1,650 × 750 mm.

The straight sides are still **900 mm** long at the bottom, not shorter. The flare moves each side outward square to itself, and moving a straight line sideways does not change its length. Only the ends shrink. That one fact decides the side panels' shape, and it is the subject of this chapter's error.

## Girth, area and capacity

The flat oval is a four-centre oval whose side radius is infinite, so its girth and area follow simply:

- top girth: π × 900 + 2 × 900 = **4,627.4 mm**; bottom girth: π × 750 + 2 × 900 = **4,156.2 mm**;
- top area: π × 450² + 900 × 900 = **1.4462 m²**; bottom area: π × 375² + 900 × 750 = **1.1168 m²**.

The offset rule of Chapters 3 and 4 still holds: the girths differ by 2π × 75 = 471.2 mm, exactly as for the four-centre trough. So the capacity follows from the same quadratic area, and integrating it gives:

- brim-full: **575.3 litres**;
- to a fill line 50 mm below the rim: **504.0 litres**.

The flat-oval trough holds about **72.7 litres** more brim-full than the four-centre trough of the same length, width and depth, 14% more, because its sides do not curve inward.

```figure
type: compare
title: Four-centre and flat-oval troughs, 1,800 × 900 × 450 mm
rowhead: Quantity
cols: Four-centre, end R300 | Flat oval
caption: This is an illustration. Same overall size and flare; the flat oval's straight sides add capacity and simplify the side walls.
- Top girth | 4,383.7 mm | 4,627.4 mm
- Top area | 1.2754 m² | 1.4462 m²
- * Brim capacity | 502.6 L | 575.3 L
- To the fill line | 439.7 L | 504.0 L
- End walls | part cones, R300 to R225 | half cones, R450 to R375
- Side walls | part cones, apex 9.45 m away | flat rectangles, 900 × 456.2 mm
```

## The patterns

**The ends** are half cones with the same 9.46° half-angle as before. Their pattern radii are 450 ÷ 0.1644 = **2,737.2 mm** at the rim and 375 ÷ 0.1644 = **2,281.0 mm** at the bottom, spanning 180° × 0.1644 = **29.59°**. The rim arc's chord is 1,398.1 mm and its rise 90.8 mm; a trammel of 2.74 m is long but practical.

**The sides** are flat. Each is a rectangle **900 mm** long, its top and bottom edges both 900 mm, and **456.2 mm** high on the slant, leaning outward at 9.46° when fitted. No rolling, no offsets, no division lines: just a folded or flanged rectangle.

At the joints between ends and sides, the half cone's straight edge, a generator 456.2 mm long, meets the flat side's edge of the same length. A plane tangent to a cone along a generator touches it smoothly, so the joint is smooth, just as in the four-centre trough.

```figure
type: svg
title: Patterns for the flat-oval trough's walls
alt: Two pattern shapes. On the left, a band of a sector, the half-cone end wall, between arcs of radius 2,737.2 and 2,281.0 mm spanning about 29.6 degrees. On the right, a plain rectangle 900 mm long and 456.2 mm high, the flat side wall.
caption: This is an illustration at 0.1 scale. Two of each are needed; the ends are rolled as cones, the sides are flat.
viewbox: 0 0 420 170
body:
<path class="bxa" d="M61.8 70.5A228.1 228.1 0 0 0 178.3 70.5L189.9 114.6A273.7 273.7 0 0 1 50.1 114.6Z"/>
<rect class="bxa" x="250" y="60" width="90" height="45.6"/>
<text class="txs" x="70" y="150">End: half cone</text>
<text class="txs" x="240" y="150">Side: 900 × 456.2</text>
<text class="txs" x="50" y="40">R2,737.2 and R2,281.0</text>
```

## The flat oval's bottom and rim

The flat-oval trough's bottom plate is a flat oval 1,650 × 750 mm, with a 25 mm flange turned up inside the wall as before. Its flange behaves differently on the two kinds of edge.

- Round the **semicircular ends**, the flange's free edge shrinks from 375 + 25 = 400 mm radius to 375 + 25 × 0.1644 = 379.1 mm: **5.2%**, less than the four-centre trough's 8.4% because the ends' radius is larger. Each end's flange is π × 400 = 1,256.6 mm along its free edge, so about 65.6 mm must be removed with V-notches.
- Along the **straight sides**, the flange does not shrink at all. A straight flange turned up against a flat side is simply a fold, and it needs no notches and no working.

The rim rod follows the same pattern. Its length is the top girth plus 2π × 5.8 = 4,627.4 + 36.4 = **4,663.8 mm**, and it is bent only at its four end portions, to a radius of 450 + 5.8 = 455.8 mm, staying straight along the 900 mm sides. Bending a rod with straight portions is quicker and more repeatable than bending it to two different radii, one more reason the flat oval is cheaper to make.

## Stiffening the flat sides

A flat side under water pressure bows outward between its ends. The four-centre trough's side, curved on a 1.5 m radius, carries the pressure partly as tension around its curve, the way a round tank does, and stays nearly in shape. A flat panel has no curve to work with and must resist the pressure in bending, which a 1.6 mm sheet 900 mm long does poorly.

The usual remedies are simple. A pressed rib or swage along the side's length, a few millimetres deep, stiffens it greatly for little material. A folded flange at the rim, which the rolled rim already provides, stiffens the top edge. On larger troughs, an external angle or a tie rod across the top holds the two sides together. How much stiffening a given trough needs depends on its size, depth and use, and belongs to its design; this book notes only that the flat oval needs it where the four-centre oval may not.

## Why choose one or the other

The flat-oval trough is quicker to make: two flat rectangles replace two part-cone pieces whose patterns need chord offsets, and its bottom is a simpler shape. It holds more for the same footprint. Its bottom plate, with straight flanges along its sides, is easier to form too. Its drawbacks are appearance, which some buyers dislike, and stiffness: a flat side 900 mm long is more flexible than a gently curved one, and water pressure bows it outward. The running case's four-centre sides, curved on a 1.5 m radius, resist that bowing by their curvature, while a flat side needs a stiffener or a heavier gauge to stay straight under 400 mm of water.

That is a design trade-off for the trough's specifier. The fabricator's numbers make it concrete: 14% more water, two fewer formed pieces, and a side panel that may need a rib.

## Flat-oval duct

Flat-oval duct, used where a round duct would not fit a shallow ceiling space, is the plain flat oval made as a straight duct. Its girth and area follow the same simple formulas. This is an illustration. An 800 × 400 mm flat-oval duct has a girth of π × 400 + 2 × 400 = **2,056.6 mm** and an area of π × 200² + 400 × 400 = **0.2857 m²**; a 600 × 300 mm one, **1,542.5 mm** and **0.1607 m²**.

Manufactured flat-oval duct is often made by forming spiral round duct into the flat-oval shape, so its girth is the girth of the round duct it started as. Ductwork by the Numbers deals with its airflow, its equivalent round size and its pressure loss; for the sheet metal worker, the flat oval's fittings, elbows, reducers and branches, are developed by combining the round methods for the ends with the rectangular methods for the flats.

## Flat-oval fittings

Flat-oval duct needs fittings, and each is a combination of round and rectangular methods. A reducer from one flat oval to a smaller one, with both ends' flats the same length, is two half cones joined by two flat trapezoids, developed exactly like the trough's walls laid on their side. A reducer that also shortens the flats has trapezoidal sides whose sloping edges are found by true length, and half-cone ends that may be oblique if the reduction is uneven.

An elbow in flat-oval duct bent across the flats, so that the flats become the cheeks, has flat cheeks like a rectangular elbow and half-round wrappers at the ends, each a part of a torus that is made as segments of half cylinders, as round segmented elbows are. An elbow bent the other way, in the plane of the flats, has round-elbow halves at each end joined by rectangular wrappers. In every case the method is the same as this book's: name the solid each part comes from, find its true lengths, and develop it piece by piece, with the seams where neighbouring pieces share a straight line.

## Choosing by capacity

A customer who asks for a capacity in a given footprint may be served by either shape. This is an illustration. At 1,800 × 900 × 450 mm with a 75 mm flare, the flat-oval trough holds 504.0 litres to its fill line and the four-centre trough 439.7. If the customer needs 500 litres to the line and the footprint cannot grow, the flat oval meets it at the running case's depth while the four-centre oval would need deepening to about 514 mm, as Chapter 4 found. The flat oval wins on capacity and cost; the four-centre oval wins on stiffness and appearance. Putting both sets of numbers in front of the customer lets the choice be made on facts.

## The error: side panels shortened by the flare

This is an illustration. The first flat-oval trough's side panels were cut by a hand who reasoned that, since the bottom was 150 mm shorter than the top overall, the side panels should be 150 mm shorter at the bottom than at the top: trapezoids 900 mm along the top and 750 mm along the bottom.

The bottom's 150 mm shortfall in overall length belongs entirely to the ends, whose radii shrink from 450 to 375 mm at each end. The straight sides do not shrink at all. Trapezoidal side panels left a gap of 75 mm at each lower corner between the side panel and the half-cone end, tapering to nothing at the rim, which no seam could close.

The reasoning had a respectable source. On a four-centre trough, every wall piece is shorter at the bottom than at the top, because every part of the outline curves and every radius shrinks with the flare. The hand had generalised from that to the flat oval, where it holds for the ends and fails for the straights. A quick application of the offset rule would have shown it: offsetting a straight line by 75 mm leaves it 900 mm long, while offsetting a semicircle shrinks its arc by π × 75 = 235.6 mm, which is exactly half of the girth's 471.2 mm reduction at each end.

The fault was found when the first side panel was offered up to the formed ends. The panels were recut as 900 × 456.2 mm rectangles. The shop's note on the job sheet now reads: "FLAT-OVAL SIDES: RECTANGLES. THE FLARE SHRINKS THE ENDS, NOT THE STRAIGHTS."

```figure
type: checklist
title: Flat-oval checks before cutting
caption: Each check follows from the flat oval being a four-centre oval with straight sides.
- Straight sides the same length at top and bottom | 900 mm both
- End radii shrink by the flare | 450 to 375 mm
- End patterns from half cones with the walls' half-angle | R2,737.2 and R2,281.0 mm, 29.59°
- Side panels rectangles on the slant height | 900 × 456.2 mm
- Capacity by the quadratic area | 575.3 L brim
- x Side panels tapered by the overall flare | 75 mm gaps at the lower corners
```

## Exercise: a flat-oval duct

A ceiling space allows a flat-oval duct 1,000 mm wide and 350 mm deep. Find its girth and area on the mean line, and compare its area with a round duct of the same girth.

**Worked answer.**

- Girth: π × 350 + 2 × (1,000 − 350) = 1,099.6 + 1,300 = **2,399.6 mm**.
- Area: π × 175² + 650 × 350 = 96,211 + 227,500 = **323,711 mm²**, about 0.324 m².
- A round duct with the same 2,399.6 mm girth has a diameter of 763.8 mm and an area of **0.458 m²**.

The flat-oval duct has about 71% of the round duct's area for the same sheet, the price of fitting under a shallow ceiling. For airflow the comparison is more involved, because a flat shape has more friction per unit of area, which Ductwork by the Numbers covers. For the sheet metal worker the numbers that matter are the girth, which sets the blank, and the end radius of 175 mm, which sets the rolls.
