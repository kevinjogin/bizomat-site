---
book: branched-fittings-by-the-numbers
chapterSlug: breeches-with-prongs-at-an-angle
order: 5
title: "Breeches with prongs at an angle"
description: "Develop G3, a Ø355 to 2 × Ø250 breeches with prong ends tilted 30° outward: triangulated prongs, a crotch in the plane of symmetry peaking at 370.8 mm, and a peak taken from the parallel-end formula."
draft: false
---

G2's prongs leave the fitting parallel to the main and need elbows further on to turn them towards the welding bays. A breeches can do the turning itself: if each prong end is tilted outward, the branch ducts leave at an angle, and the elbows are smaller or unnecessary. The cost is that the prongs are no longer cones. A prong joining a level circle to a tilted circle of a different size lies on no cone, so it must be triangulated, as the fittings in Transitional Elbows by the Numbers were.

This chapter develops G3, the FX-4 breeches whose prong ends are tilted 30° outward. It describes the prongs' surfaces, finds the crotch in the plane of symmetry, triangulates each prong, lays out its pattern, and ends with a crotch peak taken from the formula for parallel ends.

## G3 in coordinates

This is an illustration. G3 joins the Ø355 main to two Ø250 branches that leave at 30° to the main's axis, one each way. The main end is at the origin, square to z. The right prong end is centred at (200, 0, 500) and tilted 30° about an axis parallel to y, so that it faces up and outward; the left prong end is its mirror image. The fitting is symmetric about the planes x = 0 and y = 0.

The right prong end's points follow from its centre and two directions in its plane, as in Transitional Elbows by the Numbers: (cos 30°, 0, −sin 30°) across the end and (0, 1, 0) along it. A point at angle θ round the end is at

(200 + 108.3 cos θ, 125 sin θ, 500 − 62.5 cos θ).

At θ = 0°, the end's outer point, that gives (308.3, 0, 437.5), the end's lowest point; at θ = 180°, its inner point, (91.7, 0, 562.5), its highest. The two prong ends' inner points are 183.4 mm apart, so the ends stand well clear of each other.

## The prong's surface

Each prong joins the main circle to its prong end. The main circle's point at angle θ is (177.5 cos θ, 177.5 sin θ, 0), and it is joined by a straight line, a **ruling**, to the prong end's point at the same θ. The prong's surface is made of those rulings. It is smooth and close to a cone, but not a cone: the rulings do not all pass through one point, so it is not exactly developable, and its pattern is triangulated.

Matching the main circle and the prong end by equal angles works here because the two circles are alike and similarly placed: the main's outer point, at θ = 0°, joins the prong end's outer point, and the main's inner point, at θ = 180°, joins the prong end's inner point. The outer ruling, from (177.5, 0, 0) to (308.3, 0, 437.5), is the prong's outer side; its length is √(130.8² + 437.5²) = **456.6 mm**.

## The crotch

As with G2, the right prong's surface extends from the whole main circle, and the part of it that the left prong covers must be cut away. By symmetry, the two prongs meet on the plane x = 0. Each ruling from the left half of the main circle crosses that plane on its way up, and the right prong begins at the crossing.

The ruling from the main's far left point, (−177.5, 0, 0), to the right prong end's inner point, (91.7, 0, 562.5), crosses x = 0 at a fraction 177.5 ÷ (177.5 + 91.7) = 0.659 of its length, at a height of 0.659 × 562.5 = **370.8 mm**. That is the crotch's peak.

```figure
type: compare
title: G3's crotch, in the plane x = 0
rowhead: Ruling from the main circle at θ
cols: Fraction along the ruling | Crotch point, y and z
caption: This is an illustration. Millimetres. Each crotch point is where a ruling of the right prong crosses x = 0. The points for negative y are mirror images.
- 90° (foot) | 0 | 177.5, 0
- 105° | 0.211 | 160.8, 108.8
- 120° | 0.378 | 136.5, 201.0
- 135° | 0.504 | 106.8, 274.3
- 150° | 0.591 | 73.2, 327.7
- 165° | 0.642 | 37.2, 360.0
- * 180° (peak) | 0.659 | 0, 370.8
```

The crotch is flat, because it lies in the plane of symmetry, and it can be cut as a template just as G2's could. It is not an ellipse, because the prong is not a cone, but it is a smooth arch from foot to foot, **871.4 mm** long over the peak.

## Triangulating the prong

Each strip between neighbouring rulings is split by a diagonal from the start of one ruling, on the main circle or the crotch, to the prong end's point on the next. The prong is symmetric about the plane y = 0, so the half from θ = 0° to 180° serves for both halves, with the diagonals mirrored on the other half.

```figure
type: compare
title: G3's right prong, lines from the outer side to the crotch's peak
rowhead: θ
cols: Ruling used | Diagonal to the next strip | Step along the lower edge to the next ruling
caption: This is an illustration. True lengths in millimetres. From 0° to 90° each ruling starts on the main circle, and the lower step is a 15° arc of it; from 90° to 180° each starts on the crotch, and the lower step is along the crotch.
- 0° (outer) | 456.6 | 458.8 | 46.5
- 15° | 459.5 | 462.6 | 46.5
- 30° | 468.1 | 472.1 | 46.5
- 45° | 481.6 | 486.4 | 46.5
- 60° | 499.1 | 504.5 | 46.5
- 75° | 519.4 | 525.3 | 46.5
- 90° (foot) | 541.1 | 547.0 | 110.1
- 105° | 444.0 | 450.0 | 95.3
- 120° | 362.2 | 367.9 | 79.2
- 135° | 297.3 | 302.5 | 63.0
- 150° | 250.4 | 254.8 | 48.4
- 165° | 222.0 | 225.4 | 38.8
- * 180° (peak) | 212.5 | (end of half) | (end of half)
```

The steps along the prong end are 15° arcs of its 125 mm radius, 32.7 mm each. The rulings' lengths rise from the outer side to the foot, as G2's elements did, then fall across the crotch to 212.5 mm at the peak. That short ruling, from the crotch's peak to the prong end's inner point, is the prong's seam.

## Laying out the half pattern

The layout follows the triangulation routine, with one change at the foot.

1. **Strike the outer ruling**, 456.6 mm, from the main circle's outer point to the prong end's outer point.
2. **Add each strip from 0° to 90°** by its diagonal and its next ruling: the next prong-end point is 32.7 mm along the prong end's arc from the last and at the diagonal's length from the last main-circle point; the next main-circle point is 46.5 mm along the main's arc from the last and at the next ruling's length from the new prong-end point.
3. **At the foot**, θ = 90°, the lower edge leaves the main circle and becomes the crotch. From here, each new lower point is a crotch point, found at the crotch step's length, 110.1 mm for the first, from the last lower point.
4. **Add each strip from 90° to 180°** in the same way, with crotch steps of 110.1, 95.3, 79.2, 63.0, 48.4 and 38.8 mm.
5. **Finish at the peak's ruling**, 212.5 mm, which should measure true between the last crotch point and the last prong-end point.
6. **Mirror the half** about the outer ruling, and draw the three edges, main, crotch and prong end, as smooth curves through their points.

The corner at the foot, where the main edge meets the crotch edge, is a real corner on the pattern, and it should not be rounded off when the edges are drawn.

## The pattern

Laid out from the outer ruling, triangle by triangle, the half pattern is about 438 mm across and 595 mm from its lowest to its highest point, and the whole prong, both halves mirrored about the outer ruling, about 876 mm across. Its prong-end edge is the full Ø250 girth, 785.4 mm; its main-end edge is half the main's girth, 557.6 mm; and its crotch edges are 435.7 mm each. The prong's area is about **0.366 m²**, and the two prongs about 0.733 m², about 4.6 kg at 0.8 mm.

G3's prongs are larger than G2's, 0.366 against 0.267 m², because they are longer, 500 mm instead of 400, and they reach further out. The sheet they use includes what would otherwise go into the elbows that G2's branches need.

## Accuracy

Because the prongs are triangulated, their accuracy depends on their divisions, as in Transitional Elbows by the Numbers. Compared point for point with a triangulation of 720 divisions to each half, a pattern with 15° divisions, twelve to each half, is within **1.3 mm** everywhere; one with 30° divisions, six to each half, is out by up to **5.0 mm**. Around the crotch, the rulings shorten quickly, from 541.1 mm at the foot to 444.0 mm one division later, and the shop uses 15° divisions, so that the crotch edge is defined by enough points to draw it smoothly and the pattern stays within the 1.5 mm the shop accepts on fittings of this size.

## The error: a peak from the wrong formula

This is an illustration. A worker who had used Chapter 4's formula for G2 applied it to G3 to find the crotch's peak before developing the prongs: with H = 500, R = 177.5, r = 125 and c = 200, it gives 500 × 177.5 ÷ 252.5 = **351.5 mm**. They cut the crotch template to that peak and fitted the formed prongs to it.

The formula is for prongs with ends parallel to the main. G3's prong ends are tilted, and their inner points, where the peak's ruling ends, are lifted to 562.5 mm, not 500. The true peak is **370.8 mm**, 19.3 mm higher. With the template's peak 19.3 mm low, the formed prongs, which had been developed correctly from the rulings, stood clear of the template at the top of the crotch, and the worker, trusting the template, trimmed the prongs' crotch edges down to it. The crotch seam then gaped at its peak, and a patch had to be riveted in.

The fault was in using a shortcut outside its conditions. The shop's note on the formula now reads "Parallel prong ends only". For tilted ends, the peak is found from the peak's ruling, as above.

```figure
type: bars
title: G3's crotch peak, true and from the parallel-end formula
unit: mm
max: 600
caption: This is an illustration. The tilted prong ends lift the peak's ruling, so the parallel-end formula puts the peak 19.3 mm low.
- * True peak | 370.8
- Parallel-end formula | 351.5
- Prong end's inner point | 562.5
```

## G2 or G3?

FX-4 uses both. G2, with parallel prong ends, serves a bay where the branch ducts run on parallel to the main for some distance before turning; G3, with tilted ends, serves a bay where the branches must spread at once. The choice between them is mostly about the ducts beyond the fitting.

- **G2's prongs are exact cones**, developed by radial lines with no approximation, and its crotch is an exact ellipse found from a formula. It is quicker to develop and easier to check.
- **G3's prongs are triangulated**, with an accuracy that depends on the divisions, and its crotch is found ruling by ruling. It takes longer, but it replaces two branch elbows, each with its own joints and patterns.

On a job with several similar fittings, the time to develop a triangulated breeches is spent once, in a workbook that serves every copy. On a one-off, the cone breeches and two standard elbows may be quicker overall. The shop decides fitting by fitting.

## Assembly

G3 is assembled like G2: each prong rolled with its seam at the crotch's peak, the two prongs brought together along the crotch template, and the crotch seam riveted and sealed from foot to foot. Two extra checks apply because of the tilt. Each prong end must be at 30° to the main end, checked with an angle gauge across its face, and the two prong ends must tilt in the same plane, the plane y = 0, checked by sighting along a straightedge laid across both. A prong rolled slightly askew tilts its end out of that plane, and its branch duct then misses its bay by a distance that grows with the duct's length.

## Choosing the tilt

The tilt of the prong ends is a design choice, and it interacts with the crotch. Tilting the ends outward lifts their inner points and so lifts the crotch's peak; it also spreads the branch ducts, so the elbows beyond the fitting can be smaller. Tilting them too far makes the prong's inner side very short and steep, and the rulings near the crotch nearly parallel to the crotch plane, which makes the crotch long and shallow and hard to seal.

A tilt of 30° on G3 leaves 191.7 mm between the peak and the prong ends' inner points, which is plenty for the crotch seam's rivets and for the branch collars. A tilt of 45° with the same prong-end centres would lift the inner points further and leave the crotch less room. The calculation is quick with coordinates, and worth making for each proposed tilt.

## Exercise: the ruling at 120°

Check G3's crotch point on the ruling from the main circle's point at θ = 120°. Find the fraction along the ruling at which it crosses x = 0, and the crotch point's y and z.

**Worked answer.**

- The main circle's point at 120° is (177.5 cos 120°, 177.5 sin 120°, 0) = (−88.75, 153.7, 0).
- The right prong end's point at 120° is (200 + 108.3 cos 120°, 125 sin 120°, 500 − 62.5 cos 120°) = (145.9, 108.3, 531.3).
- The ruling crosses x = 0 at a fraction 88.75 ÷ (88.75 + 145.9) = **0.378** of its length.
- There, y = 153.7 + 0.378 × (108.3 − 153.7) = **136.5 mm** and z = 0.378 × 531.3 = **201.0 mm**.

The point agrees with the table. Every crotch point is found the same way: the fraction comes from the x coordinates alone, and y and z follow.
