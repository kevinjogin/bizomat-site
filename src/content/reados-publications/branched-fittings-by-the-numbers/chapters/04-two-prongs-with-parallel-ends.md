---
book: branched-fittings-by-the-numbers
chapterSlug: two-prongs-with-parallel-ends
order: 4
title: "Two prongs with parallel ends"
description: "Develop G2, a Ø355 to 2 × Ø250 breeches with parallel ends: each prong an oblique frustum, the crotch an ellipse in the plane of symmetry, prong patterns by radial lines, and prongs scribed in place."
draft: false
---

The simplest breeches has two equal prongs whose ends face the same way as the main end. Each prong then joins two parallel circles, the main end and its own prong end, and so each prong is part of an oblique cone, which Chapters 2 and 3 have developed. What is new is that the two cones overlap. Near the main end they share the main's circle; further along, they separate. The fitting is made of the part of each cone that the other does not cover, and the line where they meet is the crotch.

This chapter develops G2. It sets up the two cones, finds the crotch and shows that it lies in a plane and is part of an ellipse, develops each prong's pattern by radial lines, and ends with prongs that were developed whole and scribed in place.

## G2 in coordinates

This is an illustration. G2 joins the Ø355 main to two Ø250 branches serving the welding bays. The main end is at the origin, square to z. The two prong ends are parallel to it, 400 mm along z, with their centres 300 mm apart: at (150, 0, 400) and (−150, 0, 400). The branch ducts leave the prong ends parallel to the main and are turned towards the bays by ordinary elbows further on. The fitting is symmetric about the plane x = 0, between the prongs, and about the plane y = 0.

The right prong is the frustum of the cone through the main circle and the right prong end. Chapter 3 found its apex: with k = 125 ÷ 177.5 = 0.7042, the apex is at (150 ÷ 0.2958, 0, 400 ÷ 0.2958) = **(507.1, 0, 1352.4)**. The left prong's cone is its mirror image, with its apex at (−507.1, 0, 1352.4).

## Where the prongs meet

Both cones stand on the same main circle. Think of the right cone as a complete frustum: its elements run from every point of the main circle towards the right apex. The elements from the right half of the main circle, where x is positive, stay on the right side all the way to the prong end. The elements from the left half start on the left side and cross over to the right as they rise. The part of each such element below the crossing lies inside the left prong's region; only the part above the crossing belongs to the right prong.

By symmetry, the crossing is on the plane x = 0. So the right prong is the part of its frustum on the right of that plane, and the left prong the mirror image. The **crotch** is where the frustum meets the plane x = 0: it starts at the main circle's points on that plane, the **feet** at (0, ±177.5, 0), and rises to a **peak** on the element from the main circle's far left point.

That element runs from (−177.5, 0, 0) towards the apex at (507.1, 0, 1352.4). It crosses x = 0 at a fraction 177.5 ÷ (507.1 + 177.5) = 0.2593 of the way up, at a height of 0.2593 × 1352.4, which from the unrounded fraction is **350.6 mm**. The crotch peaks 49.4 mm below the prong ends, which leaves room for the prong ends to stand clear of each other.

## The crotch is part of an ellipse

Every point of the crotch is where an element of the right cone crosses the plane x = 0, and a plane cuts a cone in a conic section. For G2, the conic is an ellipse. Working through the cone's equation on the plane x = 0 gives an ellipse centred 188.8 mm below the main end, with semi-axes of **539.4 mm** along z and **189.5 mm** across. The crotch is the top of that ellipse, from the feet, where it crosses the main end's plane, over the peak.

```figure
type: compare
title: Points on G2's crotch, in the plane x = 0
rowhead: Main-circle point the element starts from
cols: Fraction of the way to the apex | Crotch point, y and z
caption: This is an illustration. Millimetres. Each crotch point is where an element of the right prong's cone crosses x = 0. The points for negative y are the mirror images.
- 90° (foot) | 0 | 177.5, 0
- 105° | 0.083 | 157.2, 112.3
- 120° | 0.149 | 130.8, 201.4
- 135° | 0.198 | 100.6, 268.3
- 150° | 0.233 | 68.1, 314.6
- 165° | 0.253 | 34.3, 341.7
- * 180° (peak) | 0.259 | 0, 350.6
```

Because the crotch is a flat curve, it can be cut as a template from a sheet of hardboard and offered into the formed fitting. A breeches whose prongs touch the template all along has its crotch in the right place. That check is impossible for a crotch that twists, and Chapters 6 to 8 show when a crotch is flat and when it is not.

The crotch's length, from foot to foot over the peak, is **833.3 mm**. It is the length of the crotch seam that joins the prongs.

## A formula for the crotch's peak

The peak's height follows from four numbers, and it is worth having as a formula because it decides whether a proposed breeches will work before anything else is calculated. For two equal prongs with ends parallel to the main end:

```figure
type: formula
title: Height of the crotch's peak, equal prongs with parallel ends
formula: peak = H × R ÷ (c + R − r)
caption: For G2, the peak is 49.4 mm below the prong ends. If the formula gives a peak at or above H, the prong ends collide.
- H | Distance from the main end to the prong ends, 400 mm
- R | Main end's radius, 177.5 mm
- r | Each prong end's radius, 125 mm
- c | Each prong end's centre offset from the main's axis, 150 mm
step: c + R − r = 150 + 177.5 − 125 = 202.5 mm
step: peak = 400 × 177.5 ÷ 202.5 = 350.6 mm
```

The formula shows what controls the crotch. Moving the prong ends apart, a larger c, lowers the peak. Making the prongs smaller relative to the main, a smaller r, lowers it too. Lengthening the fitting, a larger H, raises the peak in proportion but leaves it the same fraction of the length. A designer who wants the prongs to separate early, so that the branch elbows can start close to the fitting, spreads the prong ends rather than lengthening the fitting.

The formula also explains Chapter 1's collided prongs. With the centres 240 mm apart, c is 120 mm, c + R − r is 172.5 mm, and the peak is 400 × 177.5 ÷ 172.5 = 411.6 mm, above the prong ends. A ten-second calculation on the job sheet would have caught the misread spacing before any pattern was drawn, and the shop now makes it for every breeches as soon as the prong ends are written down.

## Where the seams go

Each prong needs one seam to be flattened, as any frustum does, and the crotch is a second joint shared by both prongs. The prong's seam could go on any element. Three positions are worth considering:

- on the **outer element**, the longest at 411.7 mm, which keeps the crotch region free of extra joints but puts a seam where it is most visible;
- on an element at the **side**, which splits the difference;
- on the short element at the **peak**, 55.4 mm, which puts both prongs' seams where the crotch seam already is.

FX-4 uses the peak. The seam is so short that it is barely a seam at all, all the joints are together where they can be sealed in one operation, and each prong's pattern is symmetric about its outer element, so only half needs calculating.

## Why not triangulate?

G2's prongs could be triangulated between the main circle and the prong ends, like any transition. They are developed by radial lines instead for two reasons. First, they are exact cones, so radial lines give an exact pattern with no diagonals to calculate. Second, the crotch is exactly where each element crosses the plane x = 0, so the crotch edge of the pattern is found element by element with one division each. Triangulating would need the crotch found separately and then joined to the triangulation, and it would only approximate a surface that radial lines describe exactly.

## Each prong's elements

Each prong's pattern is a frustum pattern with part cut away. Elements from the right half of the main circle run their full frustum length, from the main circle to the prong end. Elements from the left half run only from the crotch to the prong end. The prong is symmetric about the plane y = 0, so only the elements from θ = 0° to 180° need calculating.

```figure
type: compare
title: G2's right prong, elements from its apex
rowhead: Main-circle point at θ
cols: Pattern angle from the outer element | Start of element from apex | Prong end from apex | Length used
caption: This is an illustration. Millimetres and degrees. The apex is at (507.1, 0, 1352.4). From 0° to 90° each element starts at the main circle; from 90° to 180° it starts at the crotch.
- 0° (outer) | 0 | 1392.0 | 980.3 | 411.7
- 30° | 3.80° | 1400.6 | 986.3 | 414.3
- 60° | 7.45° | 1423.9 | 1002.8 | 421.2
- 90° (foot) | 10.93° | 1455.2 | 1024.8 | 430.4
- 120° | 14.35° | 1264.5 | 1046.4 | 218.2
- 150° | 17.80° | 1157.1 | 1061.9 | 95.2
- * 180° (peak) | 21.30° | 1122.8 | 1067.5 | 55.4
```

The element lengths rise slowly from the outer side to the feet, then fall steeply across the crotch, from 430.4 mm at the foot to 55.4 mm at the peak. That steep fall is the crotch's shape on the pattern: a deep notch cut out of the frustum's band.

## The prong's pattern

The pattern is laid out by radial lines from the apex, each element at its angle and its two ends at their distances from the apex. With the outer element, at θ = 0°, running straight up the sheet from the apex:

- the outer element runs from **980.3 mm** to **1,392.0 mm** from the apex;
- at θ = 90°, the foot of the crotch, the element is at 10.93° to the outer element and runs from 1,024.8 to 1,455.2 mm, so its main-circle end is 275.9 mm across and 1,428.8 mm up;
- at θ = 180°, the crotch's peak, the element is at 21.30° and runs only from 1,067.5 to 1,122.8 mm, so its crotch end is 407.9 mm across and 1,046.1 mm up.

The whole prong pattern, both halves mirrored about the outer element, spans **42.6°** at the apex. Its prong-end edge is the full girth of the Ø250 end, 785.4 mm; its main-end edge is half the main's girth, 557.6 mm; and between them, on each side, its crotch edge curves in from the foot to the peak. The prong's seam is the short element at the peak, **55.4 mm**, from the top of the crotch to the prong end. The pattern fits in a rectangle about 816 mm across and 449 mm high.

Each prong's area is about **0.267 m²**, and the two together about 0.535 m², about 3.4 kg at 0.8 mm.

## Assembly

The two prongs are rolled into part frustums, each with its seam at the crotch's peak, and offered together along the crotch. The crotch seam runs from one foot, over the peak, to the other foot, 833.3 mm in all, and is lapped and riveted with sealant. At the peak, the two prongs' seams and the crotch seam meet in a short tee, which is the fitting's most awkward joint and is sealed with particular care.

The main end is then a full circle, half from each prong, and is checked round against a Ø355 template. Its two joints, at the crotch's feet, are where the crotch seam ends, and they are dressed flush so that the main end slips into its duct without catching. The prong ends are checked against Ø250 templates and for their spacing, 300 mm centre to centre, and parallel to the main end.

## The error: prongs scribed in place

This is an illustration. An experienced worker made the first G2 the way they had made breeches for years: they developed each prong as a whole frustum, from the full main circle to its prong end, rolled both, held them together in position, scribed the line where they met with a pencil, and cut each along its scribed line with snips.

The method works, after a fashion. But a whole frustum's pattern is **0.396 m²**, against the prong's **0.267 m²**, so a third of each prong's sheet, about 0.13 m², was cut off and scrapped. Worse, the scribed line, drawn on a curved surface by eye and cut with snips held at an angle to the sheet, wandered: the crotch seam had gaps of several millimetres in places, and the two prongs' edges did not lie together for riveting. The fitting failed its smoke test at the crotch and had to be resealed twice.

The shop now develops every prong to its crotch from the calculated points, and checks the formed crotch against a template. The calculation takes less time than the scribing did, and the crotch edges are cut flat on the bench, where snips cut true.

```figure
type: bars
title: Sheet in one G2 prong, developed to the crotch and developed whole
unit: m²
max: 0.45
caption: This is an illustration. Developing each prong whole and scribing the crotch in place wastes a third of its sheet.
- * Prong developed to its crotch | 0.267
- Whole frustum, scribed and cut | 0.396
```

## Exercise: a longer breeches

Suppose G2 were made 500 mm long instead of 400 mm, with the same prong ends at x = ±150 mm. Find the right prong's apex and the height of the crotch's peak. How far below the prong ends is it now?

**Worked answer.**

- The ratio of radii is unchanged, so 1 − k = 0.2958, and the apex is at (150 ÷ 0.2958, 0, 500 ÷ 0.2958) = **(507.1, 0, 1690.5)**.
- The element from (−177.5, 0, 0) crosses x = 0 at the same fraction, 177.5 ÷ (507.1 + 177.5) = 0.2593, of the way to the apex.
- The peak is at 0.2593 × 1690.5 = **438.3 mm**, which is **61.7 mm** below the prong ends at 500 mm.

The crotch's peak is always the same fraction of the prong's length, 0.2593 × 1,690.5 ÷ 500 = 0.877 of it here, because lengthening the fitting stretches every height in proportion. Moving the prong ends apart, not lengthening the fitting, is what lowers the crotch relative to the prong ends.
