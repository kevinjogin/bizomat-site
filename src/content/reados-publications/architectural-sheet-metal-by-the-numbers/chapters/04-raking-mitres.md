---
book: architectural-sheet-metal-by-the-numbers
chapterSlug: raking-mitres
order: 4
title: "Raking mitres: a horizontal profile meets an inclined one"
description: "Develop the raking mitre where a horizontal fascia turns a corner and climbs a gable: why the raking profile must differ, its new points and girth, the cut ordinates on both pieces and the apex joint."
draft: false
---

The hardest problem in architectural sheet metal is also one of the most common on buildings: a horizontal profile along the eaves turns the corner and climbs the gable as a raking profile. The fascia along the front of a canopy, for example, wraps round each front corner and rises up the canopy's sloping sides to the apex. Old trade manuals spent many pages on it, because the obvious approach fails. If the raking piece is folded to the same profile as the horizontal piece, the two will not meet at the corner: the faces line up at one fold and miss by centimetres at another. The raking piece needs a different profile, derived from the horizontal one, and its own mitre.

This chapter derives that raking profile by calculation for W-40's canopy, whose gables rise at 15°. It shows why the profile must change, calculates the raking profile's points and girth, gives the cut ordinates for both pieces at the corner, and then develops the joint where the two raking pieces meet at the apex. The failure case is a barge folded to the horizontal profile, which missed the eaves fascia by more than 20 mm.

## The canopy and its corners

W-40's entrance canopy projects from the facade with a gable roof pitched at **15°**, its ridge running out from the wall. Along the canopy's front, its eaves, the fascia from Chapter 1 runs horizontally. At each front corner, it turns 90° in plan onto the canopy's sloping side, where it continues as a **raking fascia**, or barge, climbing at 15° to the apex.

At each front corner, then, a horizontal piece and a raking piece meet. The joint between them lies in a vertical plane on the corner's diagonal, just as in a square mitre, because seen from above the corner is square. But one of the two pieces is now inclined.

## Why the profile must change

Think of one fold line on the horizontal fascia, say the bottom of the main face, E, which runs level at 30 mm above the fascia's bottom edge and 90 mm out from the fixing board. At the corner, this fold line must meet the matching fold line on the raking fascia, or the faces will not join. The raking fold line is not level; it climbs at 15°. Two lines meet only if they pass through the same point, and the point where the level line E reaches the corner's diagonal is fixed by where E is. The raking line must pass through that same point.

If the raking piece used the horizontal profile, each of its fold lines would sit at the same perpendicular distance from the raking edge as the horizontal piece's lines sit above the horizontal edge. The geometry shows that lines further out from the board, at larger d, meet the diagonal at a point that is lower on the rake, because the corner's diagonal is further out and the rake has already dropped by the time it gets there. The raking profile must be adjusted so that each point is raised or lowered just enough to meet its partner.

## The raking profile

The adjustment has a compact form. Each point of the horizontal profile, at projection **d** and height **h**, becomes a point on the raking profile with the same projection d and a new height **h′**, measured at right angles to the rake, of:

```figure
type: formula
title: From the horizontal profile to the raking profile
formula: h′ = h × cos α + d × sin α        d unchanged
caption: This is an illustration for W-40's canopy fascia at a gable pitch α of 15°, with cos 15° ≈ 0.9659 and sin 15° ≈ 0.2588. h′ is measured at right angles to the rake, in the plane of the gable.
- Point A, d 0, h 250 | h′ = 250 × 0.9659 + 0 ≈ 241.5
- Point D, d 90, h 160 | h′ = 160 × 0.9659 + 90 × 0.2588 ≈ 177.8
step: point E, d 90, h 30: h′ = 30 × 0.9659 + 90 × 0.2588 ≈ 52.3
step: point F, d 70, h 0: h′ = 0 + 70 × 0.2588 ≈ 18.1
```

The first term squeezes the profile's heights slightly, by cos α; the second lifts each point in proportion to how far it projects from the board. Points on the board itself, at d = 0, are only squeezed; points far out are lifted.

```figure
type: compare
title: W-40's fascia profile, horizontal and raking at 15°
cols: Horizontal d, h | Raking d, h′ | Raking segment length
caption: This is an illustration. Projections are unchanged; heights change. The raking profile's girth is 306.3 mm against the horizontal profile's 316.8 mm, so the two are cut from different blanks and folded to different drawings.
- A | 0, 250 | 0, 241.5 | start
- B | 40, 250 | 40, 251.8 | AB 41.3 mm, now rising 10.3 mm
- C | 40, 210 | 40, 213.2 | BC 38.6 mm
- D | 90, 160 | 90, 177.8 | CD 61.3 mm
- E | 90, 30 | 90, 52.3 | DE 125.5 mm
- *F | 70, 0 | 70, 18.1 | EF 39.6 mm; girth 306.3 mm
```

Two things stand out. The top flange AB, level on the horizontal fascia, rises by about 10 mm across its 40 mm width on the raking fascia, so its fold at B is no longer a right angle. And the 45° bevel CD becomes flatter and shorter, 61.3 mm instead of 70.7 mm. The raking fascia looks almost the same from a distance, which is the point: on the building, its faces line up with the horizontal ones at the corner.

## The raking profile's stretch-out

Summing the raking segment lengths gives the stretch-out stations: A **0**, B **41.3**, C **79.9**, D **141.2**, E **266.7** and F **306.3** mm. The raking fascia is cut from a 306.3 mm blank, plus any trim allowance, and folded to its own drawing, with the fold angles worked out from its own points. It is a different part from the horizontal fascia and gets its own entry in the profile register from Chapter 1, labelled with its 15° pitch so it is never folded for a canopy of a different pitch.

## Fold angles change too

Because the raking profile's points move, so do the angles at its folds. Measured as the included angle between the two flats meeting at each fold, the horizontal fascia has **90°** at B, **135°** at C and D, and about **146.3°** at E. The raking fascia, from its own points, has about **75.6°** at B, **125.3°** at C and D, and about **149.7°** at E. A brake operator folding the raking fascia to the horizontal fascia's angles would produce the wrong shape even with the right girth and fold positions. The raking drawing therefore states each fold angle, and the first raking piece is checked with a protractor at every fold, just as Chapter 1 recommended for the horizontal one.

## How much pitch matters

At low pitches, the raking profile differs only slightly from the horizontal one, and the temptation to ignore it is strongest. At W-40's main roof pitch of 5°, a barge folded to the horizontal profile would miss the eaves fascia by about **1 mm** at A and about **8 mm** at E. Eight millimetres is a visible step across a fascia face at a front corner, where everyone entering the building looks. Even at 5°, the raking profile is worth calculating; at 15°, it is essential; at 30°, as the exercise shows, the two profiles are noticeably different shapes.

## The cut ordinates at the corner

Both pieces are cut along the same vertical diagonal plane, so each needs its own ordinates.

The **horizontal piece** has an ordinary square mitre, as in Chapter 2. Measured from the corner line where the two fixing boards meet, each point extends past that line by its projection: **0, 40, 40, 90, 90 and 70 mm** at the horizontal stations 0, 40.0, 80.0, 150.7, 280.7 and 316.8.

The **raking piece** meets the same plane while running along an incline. A point at projection d reaches the diagonal d further along the wall than the corner line, measured horizontally, which is **d ÷ cos α** measured along the rake. At 15°, the ordinates on the raking blank are **0, 41.4, 41.4, 93.2, 93.2 and 72.5 mm**, at the raking stations 0, 41.3, 79.9, 141.2, 266.7 and 306.3. They are measured along the rake from a line square to the raking piece, set where that piece crosses the building's corner.

The corner line on each blank, and its hand, are marked as before. A front corner needs a horizontal piece and a raking piece, mirrored at the other corner, so the canopy's two front corners need two horizontal and two raking corner pieces, each of a different hand.

## The apex

At the top of each gable, the two raking fascias meet each other. This joint lies in a vertical plane through the apex, in the plane of the gable, bisecting the angle between the two rakes. It is a mitre in the face of the profile rather than around a corner in plan, and the rule changes accordingly: now the height h′ matters and the projection does not.

Each fold line of a raking piece lies parallel to the rake, at its distance h′ above the raking reference line through the profile's lowest point. Such a line meets the vertical plane through the apex **h′ × tan α** further along the rake than the reference line does. At 15°, with tan 15° ≈ 0.268, the apex ordinates are **64.7, 67.5, 57.1, 47.7, 14.0 and 4.9 mm** for A to F, measured along the rake from a line square to the raking piece through the reference line's meeting with the apex plane. The two raking pieces at the apex are mirror images, one of each hand, and the joint is lapped and sealed with the tab on the piece that sits under the water running down from the ridge flashing above.

```figure
type: checklist
title: Developing W-40's canopy fascia pieces
caption: This is an illustration of the drafter's sequence. Each line produces a number recorded in the profile register.
- Horizontal profile points, girth 316.8 mm, stations | from Chapter 1
- Raking profile points from h′ = h cos α + d sin α, girth 306.3 mm | 15° gable
- Horizontal corner piece ordinates = d | square mitre
- Raking corner piece ordinates = d ÷ cos α | 0 to 93.2 mm
- Apex ordinates = h′ × tan α on both raking pieces | 4.9 to 67.5 mm
- *Mock-up of one corner and the apex from offcuts before cutting | proves the raking profile
- x Folding the barge to the horizontal profile | see the failure case
```

Many designs hide the apex joint under a small folded apex cover, a short saddle that follows the raking profile over both pieces, or a decorative block. The cover makes the joint easier to seal and hides small errors, but it does not excuse a poor fit beneath: water still runs down the two pieces' faces and into any gap. On W-40's canopy, the architect chose a clean mitre without a cover, so the apex ordinates had to be right, and the mock-up checked them before any full length was cut or folded.

## Mock up the raking corner

A raking corner is worth a mock-up even for an experienced fabricator. The W-40 fabricator folded a 300 mm length of each profile from offcuts, cut the corner ordinates, and fixed both to two boards screwed together at a right angle, with the raking board's top edge cut to 15°. The faces met along the diagonal, with every fold line meeting its partner within about 1 mm. The same was done for the apex with two raking offcuts. With both joints proved, the full pieces were cut.

## A failure case: the barge folded to the horizontal profile

This is an illustration. On an earlier canopy, the fabricator's drawing showed one fascia profile, and the barges were folded to it, the same as the eaves fascia. The difference only appeared on site, where the raking pieces met the horizontal pieces at the front corners.

At the corner, the faces did not line up. Near the board, the horizontal piece's top flange sat about 9 mm below the raking piece's. Further out, the mismatch reversed and grew: at the bottom of the main face, the raking piece's fold line reached the corner about **23 mm** lower than the horizontal piece's. No amount of adjustment could close it, because the profiles were the wrong shape relative to each other.

The detection came at the first corner on site. The investigation, with the h′ calculation, showed the errors exactly: 8.8 mm at A, then −1.9, −3.3, −18.5, −23.1 and −18.8 mm at B to F. The correction was to calculate the raking profile, fold new barges to it, and re-cut both corners. The fabricator's drawing standard now requires every raking profile to be calculated and drawn separately, labelled with its pitch, whenever a profile changes from horizontal to inclined.

## How this applies to a small Australian business

When a horizontal profile turns onto a gable, never fold the raking piece to the horizontal profile. Calculate the raking profile with h′ = h cos α + d sin α, draw it as a separate part with its own girth and fold angles, and record it with its pitch. Cut the horizontal piece with ordinates equal to d and the raking piece with ordinates d ÷ cos α. At the apex, use h′ × tan α. Mock up one corner and the apex before cutting the batch. The calculation takes a few minutes; a set of barges folded to the wrong profile takes a coil.

## Exercise: a steeper canopy

A second canopy has a **30°** gable. For its fascia, with the same horizontal profile, what are the raking heights h′ of points A (d 0, h 250) and E (d 90, h 30)? What is the raking piece's corner ordinate at E? And what is the apex ordinate at E?

**Worked answer.** With cos 30° ≈ 0.8660 and sin 30° = 0.5, point A becomes **h′ = 250 × 0.8660 + 0 ≈ 216.5 mm**, and point E becomes **h′ = 30 × 0.8660 + 90 × 0.5 ≈ 71.0 mm**. The raking corner ordinate at E is **90 ÷ 0.8660 ≈ 103.9 mm**. With tan 30° ≈ 0.5774, the apex ordinate at E is **71.0 × 0.5774 ≈ 41.0 mm**. At the steeper pitch the raking profile differs more from the horizontal one, so the separate calculation matters even more.
