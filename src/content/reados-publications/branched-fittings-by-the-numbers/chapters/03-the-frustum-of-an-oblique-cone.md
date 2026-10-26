---
book: branched-fittings-by-the-numbers
chapterSlug: the-frustum-of-an-oblique-cone
order: 3
title: "The frustum of an oblique cone"
description: "Cut G1's cone at the duct to make the hood: frustum elements from the apex or straight from coordinates, a two-piece pattern that fits the sheet, and elements read from the elevation 30.7 mm short."
draft: false
---

Nobody makes a whole cone. The wall hood stops at its duct, 450 mm above the skirt, and the 321 mm or more of cone above that is never made. The part that is made, between two parallel circles, is a **frustum**, and its pattern is the cone's pattern with the part above the duct cut away. Every element is shortened by the same proportion, and the pattern becomes a curved band instead of a fan. The band is easier to handle than the fan, and its apex need never be drawn.

This chapter develops G1's frustum, the hood as it is actually made. It shortens the elements in proportion, shows that the frustum's elements can also be found without the apex at all, lays out the two-piece pattern that fits the sheet, checks it, and ends with elements read from the elevation.

## Shortening the elements

Every element of G1's cone runs from the apex to the skirt. The duct circle cuts every element at the same fraction of its length from the apex, k = 0.4167, because the duct is the skirt scaled by k towards the apex. So on every element, the duct point is 0.4167 of the way from the apex, and the frustum's part of the element, from the duct down to the skirt, is the remaining 0.5833.

```figure
type: compare
title: G1's frustum elements
rowhead: θ from the wall
cols: Cone element, apex to skirt | Apex to duct, × 0.4167 | Frustum element, duct to skirt
caption: This is an illustration. Millimetres. The frustum's part of each element is 0.5833 of the cone element.
- 0° (back, on the wall) | 771.4 | 321.4 | 450.0
- 30° | 786.9 | 327.9 | 459.0
- 60° | 827.7 | 344.9 | 482.8
- 90° | 880.4 | 366.8 | 513.6
- 120° | 930.1 | 387.5 | 542.6
- 150° | 964.9 | 402.0 | 562.8
- * 180° (front) | 977.3 | 407.2 | 570.1
```

The back element of the frustum is 450 mm, the hood's height, because it is vertical. The front element is 570.1 mm. The others lie between, and each can be checked against its cone element: 0.5833 × 880.4 = 513.6 mm at 90°, as in the table.

## Elements straight from coordinates

The apex is a convenience, not a necessity. Each frustum element runs from a skirt point to the matching duct point, and both are known as coordinates. The skirt point at θ is (300 cos θ, 300 sin θ, 0); the duct point is (175 + 125 cos θ, 125 sin θ, 450). The element is the true length between them.

At θ = 90°, the skirt point is (0, 300, 0) and the duct point (175, 125, 450). The differences are 175, −175 and 450, and the true length is √(175² + 175² + 450²) = **513.6 mm**, the same as from the apex. The two routes agree because both describe the same straight line; the coordinates simply do not need the apex to be found first.

That matters for frustums whose apex is far away. A gently tapering oblique frustum, say from Ø600 to Ø550 over 450 mm, has its apex more than 5 m away, and the cone elements are long numbers whose small differences matter. Calculating the frustum elements directly from the two circles avoids that.

## Elements are not enough

A frustum's pattern needs more than its elements. With radial lines from the apex, the angles between elements are fixed by the apex triangles of Chapter 2, and the elements are simply shortened. Without the apex, each strip between neighbouring elements is a four-sided piece, and it needs a diagonal to fix its shape, which is triangulation. Both methods give the same pattern, because the frustum is a developable surface and both are exact in the limit; but radial lines need no diagonals.

G1's pattern is laid out from the apex triangles: each element at its angle from Chapter 2, with its skirt point at the full cone length and its duct point at the shortened length.

```figure
type: compare
title: G1's half frustum pattern as coordinates
rowhead: θ from the wall
cols: Skirt point, across and up | Duct point, across and up
caption: This is an illustration. Millimetres from the cone's apex, with the front element running straight up the sheet. The apex itself need not be on the sheet; the coordinates are measured from any datum shifted by the same amount.
- 0° (back seam) | −668.8, 384.5 | −278.7, 160.2
- 30° | −590.2, 520.5 | −245.9, 216.9
- 60° | −507.4, 653.9 | −211.4, 272.5
- 90° | −411.6, 778.3 | −171.5, 324.3
- 120° | −294.4, 882.3 | −122.7, 367.6
- 150° | −154.4, 952.4 | −64.3, 396.8
- * 180° (front seam) | 0, 977.3 | 0, 407.2
```

## Two pieces, two seams

Chapter 2 found that the whole cone's pattern is too wide for a 1,200 mm sheet. The frustum is the same width, since its skirt edge is unchanged: from the back seam's skirt point on one side to the other, 1,337.5 mm. G1 is therefore made in two halves, joined by a seam on the back element against the wall and a seam on the front element.

Each half spans 60.11° at the apex. Its skirt edge is half the skirt's girth, 942.5 mm, and its duct edge half the duct's, 392.7 mm. Measured on the sheet, from the table, each half fits within a rectangle about 669 mm across and 817 mm from the duct's back point to the skirt's front point. Two halves nest easily on one 2,400 × 1,200 mm sheet, head to tail.

The halves are mirror images. Cut from the same template, one is turned over before forming; in galvanised sheet, which has no right side, that costs nothing. The front seam faces the welder, so its lap is made with the edge from the left half over the right half and sealed, and its line is kept straight with a batten while riveting.

The frustum's area is about 0.66 m², 0.33 m² per half, about 4.2 kg at 0.8 mm.

## When the apex is far away

G1's apex is 771.4 mm above the skirt, close enough to reach with a trammel on a large bench. Many oblique frustums are not so obliging. A frustum that tapers gently has its apex far away: one from Ø600 to Ø550 over the same 450 mm height would have its apex 5,400 mm above the skirt, and its cone elements would be more than five metres long.

Long elements cause two problems. On the bench, a five-metre trammel is impractical, and small errors in setting the apex grow into large errors at the pattern's edge. In calculation, the pattern angles become small differences between large numbers, and rounding matters. With a pattern angle of a few degrees spread over an edge of nearly two metres, an error of a hundredth of a degree moves the edge's end by nearly a millimetre at a radius of 5.4 m, and errors of that kind add up round the girth.

Two remedies serve. The first is to calculate the frustum's pattern directly by triangulation between its two circles, with the frustum elements from coordinates and diagonals across each strip, as an eccentric reducer is developed; the apex never appears. The second is to calculate the pattern's coordinates from the apex in a spreadsheet, carrying enough decimal places, and to mark only the frustum's points on the sheet. Both are exact enough. What does not work is drawing the apex on a batten five metres away.

## Frustums with a tilted end

If G1's skirt had to sit on a bench that sloped down towards the welder at 10°, its bottom edge would be cut by a sloping plane instead of a level one. The cone is unchanged and its elements still run from the same apex; each is simply cut where it meets the sloping plane, which lowers the cut more at the front than at the back. Calculated for that plane, the back element stays at 450.0 mm, the element at θ = 90° grows to 578.4 mm and the front element to 725.4 mm.

The cut edge is no longer a circle but an ellipse, and the skirt's girth changes with it. The pattern is laid out exactly as before, from the same apex angles, with each element at its new length; only the skirt edge's shape on the pattern changes. That is the advantage of developing from the apex: any cut of the same cone, level or sloping, uses the same fan of angles.

## Checking the frustum

Four checks prove G1's pattern before it is cut, and three prove the formed hood.

On the pattern:

1. **The seams' lengths.** The back seam must be 450.0 mm, the front 570.1 mm.
2. **The edges' lengths.** The half's skirt edge must measure 942.5 mm along its curve, its duct edge 392.7 mm.
3. **The elements.** Each element drawn on the pattern, from duct point to skirt point, must equal its tabled frustum length.
4. **The diagonals.** The distance on the pattern from the back seam's duct point to the 30° element's skirt point must equal the true distance between those two points on the hood, √((300 − 259.8)² + (0 − 150)² + 450²) = 476.0 mm. A diagonal check catches a fan that has been spread too wide or too narrow.

On the formed hood:

1. **The back is straight and vertical** against a straightedge and level, from skirt to duct.
2. **The duct is round and level**, Ø250, 450 mm above the skirt, with its back point directly above the skirt's.
3. **The half-height section** fits the Ø425 template of Chapter 2, at 225 mm above the skirt, with its centre 87.5 mm towards the wall.

## From hood to prong

G1 is a hood, but its frustum is the shape of every prong in the next five chapters. A prong of a breeches runs from the main end to its own prong end, and when the prong end is parallel to the main end, the prong is a frustum of the oblique cone through those two circles. The main end is the base, the prong end is the top, and the apex is found exactly as G1's was, from the ratio of their radii.

For G2, the breeches of Chapter 4, the main end is Ø355 and each prong end Ø250, centred 150 mm to the side and 400 mm along. The ratio is 125 ÷ 177.5 = 0.7042, so 1 − k = 0.2958, and the apex is at 150 ÷ 0.2958 = 507.1 mm across and 400 ÷ 0.2958 = 1,352.4 mm along. The prong's cone elements are between about 1,390 and 1,520 mm long, much longer than G1's, because the prong tapers gently.

What makes a prong different from a hood is that it is not a whole frustum. Part of each prong's frustum is cut away by its neighbour, along the crotch, and Chapter 4 finds where.

## The error: elements read from the elevation

This is an illustration. A worker developing a second G1 for the other bay did not have the cone's apex handy, and measured the frustum elements from a full-size side elevation, the view along y, in which the back and front elements appear as the hood's two sides. They divided the skirt and duct into twelve in plan, projected the points up into the elevation, and measured each element there.

Only the back and front elements lie in the plane of the elevation, and only they are shown at true length: 450.0 and 570.1 mm. Every other element runs partly across the hood, along y, and is foreshortened. At θ = 90°, the elevation showed 482.8 mm against a true length of 513.6 mm, **30.7 mm short**. At 60° and 120°, the shortfalls were 24.4 and 21.6 mm.

The pattern, built from those short elements, was too narrow across the hood's sides. Rolled up, the hood's sides pulled in, the duct end came out oval, and the skirt would not sit round. It was found at the trial fit against the Ø250 duct's spigot. The elements were recalculated from coordinates and the hood remade.

```figure
type: bars
title: G1's frustum elements, elevation against true
unit: mm
max: 600
caption: This is an illustration. The side elevation shows only the back and front elements true. The sides are foreshortened by up to 30.7 mm.
- θ = 60°, elevation | 458.4
- * θ = 60°, true | 482.8
- θ = 90°, elevation | 482.8
- * θ = 90°, true | 513.6
- θ = 120°, elevation | 521.0
- * θ = 120°, true | 542.6
```

The same mistake was made on G1's cone in Chapter 2's right-cone formula, in a different form: both took a length from a view in which the element is not parallel to the paper. On an oblique cone, the elevation shows two elements true and the plan shows none; only the coordinates show them all.

## Exercise: the element at 150°

Find G1's frustum element at θ = 150° directly from the coordinates of its skirt and duct points, and check it against the table's value from the apex.

**Worked answer.**

- The skirt point is (300 cos 150°, 300 sin 150°, 0) = (−259.8, 150.0, 0).
- The duct point is (175 + 125 cos 150°, 125 sin 150°, 450) = (66.7, 62.5, 450).
- The differences are 326.5, −87.5 and 450, and the true length is √(326.5² + 87.5² + 450²) = **562.8 mm**.
- From the apex, 0.5833 × 964.9 = **562.8 mm**. The two agree.

Calculating each frustum element both ways is a cheap check on the apex: if the two disagree, the apex is wrong, and every pattern angle built on it is wrong too. The same double calculation is worth making for one element on every oblique frustum before its pattern is marked. It takes a minute in a spreadsheet, and it is the only check that tests the apex itself rather than the layout built on it. An apex found from a misread offset, for instance, produces a pattern that passes every layout check and still makes the wrong hood.
