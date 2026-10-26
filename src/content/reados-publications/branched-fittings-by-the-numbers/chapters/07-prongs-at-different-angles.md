---
book: branched-fittings-by-the-numbers
chapterSlug: prongs-at-different-angles
order: 7
title: "Prongs at different angles"
description: "Develop G5, a wye with a straight Ø300 prong and a Ø200 prong at 45°: a cone meeting a triangulated prong, a crotch within 1.1 mm of a plane, and a division that skipped the foot."
draft: false
---

A wye is a breeches in which one prong carries on in the main's direction and the other turns off to the side. It is the branched fitting most often needed where a main runs along a wall and picks up a branch from one side. Its two prongs are as different as they can be: one is nearly a straight continuation of the main, the other turns sharply, and their ends face different ways. The straight prong, with its end parallel to the main end, is a cone; the turning prong is not. The crotch where they meet is no longer guaranteed to be flat, and it must be found point by point.

This chapter develops G5. It sets up the cone and the turning prong, finds the crotch ruling by ruling, measures how far it departs from a plane, develops both prongs, and ends with a division that skipped the crotch's foot.

## G5 in coordinates

This is an illustration. Along the back wall of FX-4's larger bay, the Ø355 main picks up a Ø200 branch from a second hood at 45°, and carries on as Ø300. The main end is at the origin, square to z.

- The **straight prong** is Ø300, its end parallel to the main end, centred at (−40, 0, 450). It is a frustum of the oblique cone through the main circle and its end, with k = 150 ÷ 177.5 = 0.8451 and its apex at (−40 ÷ 0.1549, 0, 450 ÷ 0.1549) = **(−258.2, 0, 2904.5)**.
- The **turning prong** is Ø200, its end tilted 45° outward about an axis parallel to y, centred at (250, 0, 420). Its point at angle θ is (250 + 70.7 cos θ, 100 sin θ, 420 − 70.7 cos θ), and each is joined by a ruling to the main circle's point at the same θ.

The prongs' combined area is 102,102 mm², 3.2% more than the main's. The fitting is symmetric about the plane y = 0 only.

## Why the cone and the ruled prong meet in a curve

Chapter 6's proof that a crotch is flat subtracted one cone's equation from another's. The turning prong has no such equation: it is a ruled surface whose rulings join two circles in planes 45° apart, and its points satisfy an equation of higher degree than a cone's. Subtracting the cone's equation from it does not leave a plane. The crotch is therefore a curve in space, and the only general way to find it is to march along the turning prong's rulings and test each one against the cone, as below.

That sounds laborious and is not. With the cone test written once in a spreadsheet or a short program, the crotch's points come out as fast as the rulings are listed.

## Finding the crotch ruling by ruling

The crotch is where the turning prong's surface meets the straight prong's cone. It is found from the turning prong's side: each of its rulings starts on the main circle and heads up and out towards its prong end. Those that start on the straight prong's side of the crotch begin inside the cone and leave it partway up; the point where a ruling leaves the cone is a crotch point.

Testing whether a point is inside the cone is simple with coordinates. From the apex, project the point down onto the main end's plane: if the projected point falls inside the main circle, the original point is inside the cone. Each ruling is tested at many points along its length, and the crossing is found by halving the interval until it is known to a hundredth of a millimetre.

The **foot**, where the crotch starts on the main circle, is the main-circle point where a ruling's first direction just grazes the cone. For G5, it is at θ = **79.2°**, the point (33.3, 174.3, 0). The turning prong owns the main circle from −79.2° to 79.2°, 158.4° of it, and the straight prong the remaining 201.6°.

```figure
type: compare
title: Points on G5's crotch, from the turning prong's rulings
rowhead: Ruling from the main circle at θ
cols: Crotch point x, y, z | Ruling from crotch to prong end
caption: This is an illustration. Millimetres. Points for negative y are mirror images.
- 79.2° (foot) | 33.3, 174.3, 0 | (whole ruling from here)
- 90° | 52.3, 161.3, 87.9 | 391.3
- 105° | 73.6, 139.2, 188.7 | 298.6
- 120° | 89.8, 114.2, 268.0 | 226.8
- 135° | 101.9, 87.2, 328.3 | 173.1
- 150° | 110.2, 58.9, 370.9 | 135.7
- 165° | 115.2, 29.7, 396.3 | 113.6
- * 180° (peak) | 116.8, 0, 404.7 | 106.3
```

## Why the foot is where it is

On G2 and G4, the feet were where the crotch plane met the main circle, and a formula found them. On G5, there is no exact plane, and the foot is found from the rulings. Close to the foot, a ruling that starts on the main circle heads up and outward. If it starts on the turning prong's side of the foot, it heads away from the cone and is outside it from the start; if it starts on the straight prong's side, it heads into the cone and is inside it for the first part of its length. The foot is the main-circle point where the ruling neither enters nor leaves: it starts along the cone's surface.

Finding it numerically means testing a point a hundredth of a millimetre up each ruling, and halving the interval of θ between a ruling that starts outside and one that starts inside. Fifty halvings fix the foot to far better than the sheet can be marked. The result, 79.2°, is between the 75° and 90° divisions, which is why it needs its own division point.

## Is the crotch flat?

The crotch's points lean towards the turning prong as they rise, from x = 33.3 mm at the foot to 116.8 mm at the peak. Fitting the best plane through them, perpendicular to the plane of symmetry, gives a plane leaning **11.5°** from vertical. But the points do not lie exactly in it: the largest departure of any point from the plane is **1.1 mm**.

That is the difference between G5 and G4. G4's two prongs were both cones on the main circle, and their crotch lay in a plane to a thousandth of a millimetre. G5's turning prong is not a cone, and its crotch is a curve in space, very close to a plane but not on one. For checking the formed fitting, a flat template cut to the best plane is still useful, with a tolerance of a millimetre or so. For developing the patterns, the crotch's true points are used, because each prong's crotch edge must match the other's exactly along the seam.

```figure
type: bars
title: Largest departure of the crotch from a plane
unit: mm
max: 1.5
caption: This is an illustration. G4's prongs are both cones on the main circle; G5's turning prong is not. G3's crotch is flat by symmetry.
- G3, equal tilted prongs | 0
- G4, unequal cone prongs | 0
- * G5, cone and tilted prong | 1.1
```

## The turning prong's pattern

The turning prong is triangulated, as G3's prongs were. Its rulings from θ = 0° to 75° start on the main circle; from 90° to 180° they start on the crotch. Between them lies the foot, at 79.2°, which is not on a 15° division.

The foot must be added as a division point of its own. The strip from 75° to 90° is split at the foot into two narrower strips: one from the main circle's point at 75° to the foot, along the main circle, and one from the foot to the crotch point at 90°, along the crotch. Without that extra point, the pattern's lower edge would cut straight across the corner where the main end meets the crotch.

```figure
type: compare
title: G5's turning prong, lines from the outer side to the peak
rowhead: θ
cols: Ruling used | Diagonal to the next strip
caption: This is an illustration. True lengths in millimetres. Each diagonal joins the lower point at this θ to the prong end's point at the next θ. The foot at 79.2° is added between 75° and 90°.
- 0° (outer) | 377.5 | 382.6
- 15° | 381.7 | 393.4
- 30° | 393.7 | 411.0
- 45° | 412.7 | 434.1
- 60° | 437.2 | 460.9
- 75° | 465.2 | (to the foot)
- 90° | 391.3 | 293.6
- 105° | 298.6 | 222.3
- 120° | 226.8 | 169.9
- 135° | 173.1 | 134.2
- 150° | 135.7 | 114.2
- 165° | 113.6 | 108.9
- * 180° (peak) | 106.3 | (end of half)
```

The turning prong's whole pattern, both halves mirrored about its outer ruling, has the Ø200 end's 628.3 mm along its prong-end edge, 79.2° of the main circle, 245.3 mm, along each half of its main edge, and its crotch along each side. Its area is about 0.239 m².

## The straight prong's pattern

The straight prong is a cone, developed by radial lines from its apex, but its crotch edge comes from the turning prong's crotch points. Each crotch point lies on one of the cone's elements: projecting it from the apex onto the main end's plane shows which. The cone's elements from the main circle's points between −79.2° and 79.2°, on the turning prong's side, start at the crotch; the rest start on the main circle.

```figure
type: compare
title: G5's straight prong, elements from its apex
rowhead: Main-circle point at θ
cols: Pattern angle | Length used
caption: This is an illustration. Millimetres and degrees, from the element at θ = 0°, which runs from the crotch's peak. The apex is at (−258.2, 0, 2904.5).
- 0° (crotch peak) | 0° | 45.8
- 30° | 1.81° | 107.3
- 60° | 3.63° | 286.5
- 90° | 5.44° | 452.6
- 120° | 7.26° | 451.4
- 150° | 9.08° | 450.5
- * 180° (outer) | 10.92° | 450.2
```

The straight prong's whole pattern spans 21.8° at its distant apex, a long, nearly straight band with a deep notch for the crotch. Its area is about 0.34 m². Its seam goes at the crotch's peak, where its element is only 45.8 mm, matching the turning prong's seam there.

## The crotch seam

The crotch is 941.2 mm long from foot to foot over the peak, longer than G2's or G4's because it leans and because the turning prong reaches across. Both prongs' crotch edges are calculated from the same crotch points, so they match exactly. On the bench, the two prongs' crotch edges are laid against each other before forming, as a check: they must be the same length, 470.6 mm on each side of the peak, and their curves must be mirror images where they will meet.

## Checking the formed wye

G5 is checked at its three ends and along its crotch.

- **The main end**: round to its Ø355 template, with the feet marked on the template at θ = ±79.2°, 33.3 mm to the turning prong's side of the main's centre.
- **The straight prong's end**: Ø300, parallel to the main end, its centre 40 mm to the other side of the main's axis and 450 mm along.
- **The turning prong's end**: Ø200, at 45° to the main end, checked with an angle gauge across its face, its centre 250 mm across and 420 mm along.
- **The crotch**: against a template cut to the best plane, leaning 11.5°, with an allowance of about a millimetre for the crotch's departure from flat.

The turning prong's end is the most sensitive. An error of one degree in its tilt moves the branch duct's centre line by about 17 mm at a metre's distance, enough to miss the second hood's spigot. The tilt is therefore checked before the crotch seam is riveted, while the prongs can still be adjusted against each other.

## Wyes at other angles

The same method serves wyes at any angle. A branch at 30° instead of 45° keeps the turning prong closer to the main's direction; its rulings are longer and lean less, and its crotch is longer and shallower. How far its crotch departs from a plane is not predictable by rule of thumb; it is calculated for each case, as G5's 1.1 mm was, and the calculation takes no longer than for G5. A branch at 60° or more turns more sharply; its crotch is shorter and steeper, and the turning prong's inner rulings become very short near the peak, which makes the crotch seam crowded there. The shop's own practice, an illustration, is to make branches beyond about 60° as a lateral or a tee with a separate elbow, which it finds easier to make than a wye at that angle.

## The error: a division that skipped the foot

This is an illustration. The first G5's turning prong was triangulated at 15° divisions, every line calculated correctly from coordinates, but the worker did not add the foot as a division point. The strip from 75° to 90° was laid out as one strip, with its lower edge running straight from the main circle's point at 75° to the crotch point at 90°.

That straight edge, 88.7 mm, cut across the corner at the foot. The true edge runs 13.0 mm along the main circle from 75° to the foot and then 90.9 mm along the crotch to the point at 90°, 103.9 mm in all. The pattern's lower edge was **15.2 mm short** there, and the corner at the foot was missing: the formed prong left a triangular gap about 13 mm wide at the main end beside the crotch's foot.

It was found when the main end was checked against its template. A patch would have been unsightly and hard to seal, so the prong was recut with the foot as its own division point. The shop's rule for every breeches is now: the feet are always division points, whatever the divisions round the rest of the fitting.

## Exercise: the main end's shares

For G5, find the length of the main end's girth owned by each prong, and confirm that they sum to the main's girth. Which prong owns more, and why?

**Worked answer.**

- The turning prong owns 158.4° of the Ø355 main circle: 158.4 ÷ 360 × π × 355 = **490.7 mm**.
- The straight prong owns 201.6°: 201.6 ÷ 360 × π × 355 = **624.5 mm**.
- Together they total 1,115.3 mm, which is π × 355, the main's girth.

The straight prong owns more because it is larger and because it lies across the main's centre, at x = −40; the foot is on the turning prong's side of the centre, at x = 33.3 mm. The straight prong takes the main's centre line with it, which suits a fitting where the main carries on.
