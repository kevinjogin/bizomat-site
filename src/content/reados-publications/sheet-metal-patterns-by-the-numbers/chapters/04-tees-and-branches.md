---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: tees-and-branches
order: 4
title: "Tees and branches: where two pipes meet"
description: "Develop a Ø150 branch meeting a Ø250 main square and at 45°, find the hole in the main as it lies on the flat, and see why a round hole cut before rolling comes out 9 mm narrow."
draft: false
---

A branch joins a main along a curve that lies on both pipes. The branch's end must be cut to that curve, and the main must have a hole whose edge is the same curve. Both shapes are parallel line patterns, and both come from one calculation: for each generator of the branch, where does it meet the surface of the main?

This chapter answers that question for the running case's two Ø150 branches on the Ø250 main, one square to it and one at 45°. It then develops the hole in the main as it lies on the main's flat blank, which is the shape that goes wrong most often, and ends with a hole that was cut round on the flat and came out too narrow.

## The square branch

Draw the main horizontal and the branch vertical above it, with their axes meeting. Look along the main's axis, in an end view, and the main is a circle while the branch is two vertical lines: each branch generator drops until it meets the circle. Generators in the plane of both axes, at the front and back of the branch as seen from the side, meet the main at its top line. Generators at the sides of the branch, furthest from that plane, drop furthest, because the main's surface curves away beneath them.

Measure the angle φ around the branch from a generator in the plane of the two axes. That generator sits a distance r × sin φ out from the plane, where r is the branch's mean radius, and the main's surface at that distance is lower than its top line by:

depth(φ) = R − √(R² − r² × sin² φ)

where R is the main's mean radius. For the running case, r = 75.4 mm and R = 125.4 mm. At φ = 90°, the depth is 125.4 − √(125.4² − 75.4²) = 125.4 − 100.2 = **25.2 mm**. This greatest depth is the saddle that the branch must drop into on each side.

```figure
type: formula
title: Cut depth of a branch meeting a main square
formula: depth(φ) = R − √(R² − r² sin² φ)
caption: Depths are measured down from the main's top line, along each branch generator. The running case's Ø150 branch on the Ø250 main, both on mean diameters in 0.8 mm sheet.
- R | Mean radius of the main, 125.4 mm
- r | Mean radius of the branch, 75.4 mm
- φ | Angle around the branch from the plane of the two axes
step: φ = 30°: 125.4 − √(125.4² − 37.7²) = 5.8 mm
step: φ = 60°: 125.4 − √(125.4² − 65.3²) = 18.3 mm
step: φ = 90°: 125.4 − √(125.4² − 75.4²) = 25.2 mm
```

The branch pattern is laid out on a girth line of π × 150.8 = 473.8 mm, divided into 12 spaces of 39.48 mm. Unlike the slant cut, the curve repeats twice around the girth: depths of 0, 5.8, 18.3, 25.2, 18.3, 5.8 and 0 mm on lines 0 to 6, and the same again on lines 6 to 12. The branch's seam goes on line 0, a short generator, so that it is easy to groove and does not cross the saddle.

If the branch's top is 300 mm above the main's top line, its generators are 300 mm long on lines 0, 6 and 12, and 325.2 mm on lines 3 and 9. The pattern is a rectangle with two shallow bumps along its bottom edge.

## Equal branches and small branches

Two special cases help when checking a pattern.

When the branch is the **same diameter** as the main, r = R, the depth at φ = 90° is the full radius: the branch's side generators drop to the main's axis. The intersection is then two plane curves, and in a side elevation it appears as two straight lines meeting at 45°. A pattern maker who sees straight lines in the elevation of an equal tee knows the drawing is right.

When the branch is **much smaller** than the main, the depth is small and the cut is nearly straight. A Ø100 branch on the Ø250 main has a saddle depth of only 10.6 mm, and a Ø50 branch 2.6 mm, which is close to the clearance in a collar. Shops often cut small branches square and let a flanged collar take up the difference. The calculation shows when that is acceptable and when it leaves a visible gap.

## The hole in the main

The hole in the main is bounded by the same curve, seen from the main's side. Each point on the branch's mean surface, at angle φ, sits a distance r cos φ along the main's axis from the branch's centreline, and its position around the main is an arc. On the main's flat blank, that arc length is R × asin(r sin φ ÷ R).

So the hole on the flat is **150.8 mm long** along the main's axis, the branch's diameter, but **161.8 mm wide** around the girth: 2 × 125.4 × asin(75.4 ÷ 125.4). It is not a circle. Its sides bulge outward, because a given distance across the branch takes up a longer arc on the curved main, more so as the branch approaches the main's diameter.

```figure
type: compare
title: Points on the hole in the main, on its flat blank
rowhead: Branch line
cols: Angle φ | Along the main's axis, mm | Around the girth from the hole's centre, mm
caption: Mean surfaces, Ø150 branch on Ø250 main. Lines 7 to 11 mirror lines 5 to 1 on the other side of the hole's centreline.
- 0 | 0° | +75.4 | 0.0
- 1 | 30° | +65.3 | 38.3
- 2 | 60° | +37.7 | 68.7
- * 3 | 90° | 0.0 | 80.9
- 4 | 120° | −37.7 | 68.7
- 5 | 150° | −65.3 | 38.3
- 6 | 180° | −75.4 | 0.0
```

The hole is set out on the main's blank before rolling, centred on the line where the branch is to stand. Mark the centre, draw the main's axis direction and the girth direction through it, plot the points from the table on both sides, and join them with a smooth curve. For a hole that will be cut after rolling, the shop often scribes around the formed branch instead, which is accurate if the branch is held square while scribing.

## The branch at 45°

The second branch meets the main at 45°, leaning in the direction of airflow so that dust is carried smoothly into the main. This kind of branch, often called a lateral, joins with lower pressure loss than a square tee, which is why extraction systems use it.

The geometry is the same question with one more term. Put the main's axis along x and the branch's axis at β = 45° to it, both passing through one point. Take a reference plane square to the branch through that point, and measure the angle φ around the branch from the generator in the plane of both axes on the side away from the main's flow, the heel. Each branch generator meets the main at a distance s up the branch's axis from the reference plane:

s(φ) = [√(R² − r² sin² φ) − r cos φ cos β] ÷ sin β

```figure
type: bars
title: Where each generator of the 45° branch meets the main
unit: mm
max: 260
caption: Distance s from the reference plane up the branch's axis, mean surfaces. The heel generator meets the main closest to the plane; the toe, on the acute side, grazes along the main and meets it 150.8 mm further up.
- Line 0, heel | 101.9
- Line 1 | 103.8
- Line 2 | 113.7
- Line 3, side | 141.7
- Line 4 | 189.1
- Line 5 | 234.4
- * Line 6, toe | 252.7
```

The values run from 101.9 mm at the heel to 252.7 mm at the toe, and lines 7 to 12 mirror lines 5 to 0. If the branch's top end is square and 400 mm up the axis from the reference plane, its generators are 400 − s long: 298.1 mm at the heel, 258.3 mm at the sides and 147.3 mm at the toe. The pattern's cut edge is no longer symmetrical about line 3; it is a long shallow curve on the heel side and a steep one on the toe side.

The hole in the main for the lateral is longer than for the square branch, because the branch crosses the main obliquely. Along the main's axis it is 150.8 ÷ sin 45° = **213.3 mm** long, while its width around the girth is unchanged at 161.8 mm, since the branch's sides still sit 75.4 mm either side of the plane of the axes.

## Offset branches

Sometimes the branch's axis does not pass through the main's axis. A branch set to one side, so that it enters the main off centre, is called offset, and in the extreme, with one side of the branch flush with the side of the main, tangential. Offset entries are used where the incoming flow should swirl or should avoid striking the far wall head on.

The depth formula needs only one change. If the branch's axis is offset by a distance e from the main's axis, measured square to both, each branch generator sits at e + r × sin φ from the main's vertical centre plane, and its depth below the main's top line is:

depth(φ) = R − √(R² − (e + r sin φ)²)

This is an illustration. Moving the running case's Ø150 branch 25 mm off centre gives depths of 2.5 mm at lines 0 and 6, rising to **50.3 mm** at line 3 on the offset side, and only **10.6 mm** at line 9 on the other side, with 0.6 mm at lines 7 and 11. The pattern loses its double symmetry: one deep saddle and one shallow one. The hole in the main is no longer centred on the main's top line, and its points are found the same way as before, with e added to each distance across. The offset is limited: once e + r reaches R, the branch's outer generator is tangent to the main and the pattern has a long flat lead-in, which is the tangential entry.

## Fixing the branch to the main

The patterns above are net shapes. How the branch is fastened decides what is added to them.

A **set-on branch with a flanged collar** has a short outward flange formed around its cut edge, which sits on the outside of the main and is riveted and sealed. The flange is added below the cut curve, 10 mm wide in the running case, and must be notched at intervals so that it can stretch around the saddle. The hole in the main is then the branch's own outline, as in the table above.

A **set-in branch with tabs** has a band of narrow tabs below the cut curve, which pass through the hole and are turned over inside the main. The hole must then be the branch's outline exactly, because the tabs need to enter it, and the error described below matters most for this kind of joint.

A **separate collar or saddle fitting**, made as its own small part and joined to both pipes, moves the difficult intersection into a part that can be made on a jig and repeated. Shops that make many branches of one size often prefer it.

Chapter 9 gives the widths and notching of these allowances. For now, the point is that the cut curve is the same for all three; only what sits beyond it changes.

## Thickness at a branch

All the numbers above use mean surfaces, which is right for 0.8 mm sheet: the difference between using inside, mean and outside radii changes the saddle depth by less than half a millimetre. In plate it does not. A branch set on top of a main touches it with the branch's inside surface at the crown and its outside surface at the sides, and a pattern developed on the mean line leaves a gap that must be filled with weld. Plate work develops each part of the curve on the surface that actually makes contact, a refinement that thin sheet can ignore.

## The error: a round hole cut on the flat

This is an illustration. To save time, the shop cut the hole for the square branch before rolling the main, using a 150.8 mm circle traced from a disc. After rolling, the hole's projected width across the main, seen from above, was only 2 × 125.4 × sin(75.4 ÷ 125.4) = **141.9 mm**. The branch's collar, with its tabs turned to fit through a 150.8 mm hole, would not enter: it fouled 4.5 mm on each side.

The cause is the bulge described above. A 150.8 mm circle on the flat spans only 150.8 mm of arc around the girth, which after rolling subtends a narrower chord. The hole needed 161.8 mm of arc to give a 150.8 mm opening. The hole was enlarged with snips, leaving a ragged edge that took extra sealing; the next main was marked from the table above and fitted first time.

The general rule is that any hole marked on a flat blank before rolling must be laid out in arc lengths on the mean line, not as the shape it should appear when finished. It applies equally to bolt holes near a seam, slots for dampers and inspection openings.

```figure
type: checklist
title: Checks before cutting a branch and its hole
caption: The square branch and the lateral on the running case's main.
- Branch cut depths calculated from both mean radii | 25.2 mm saddle for Ø150 on Ø250
- Branch seam on a short generator away from the saddle | line 0
- Hole on the flat set out in arc lengths around the girth | 161.8 mm wide, not 150.8
- Lateral's hole length along the main allows for its angle | 213.3 mm at 45°
- Branch leans with the direction of airflow | toe downstream
- x Hole traced round on the flat blank | rolled to 141.9 mm across
```

## Exercise: a Ø100 branch

A Ø100 branch in 0.8 mm sheet meets the Ø250 main square, axes intersecting. Find the branch's girth, its cut depths at lines 0 to 3, and the size of the hole in the main on its flat blank.

**Worked answer.** The branch's mean diameter is 100.8 mm, so r = 50.4 mm and its girth is π × 100.8 = **316.7 mm**, divided into 12 spaces of 26.39 mm. The main's mean radius is 125.4 mm. The depths below the main's top line are:

- line 0: **0.0 mm**;
- line 1: 125.4 − √(125.4² − 25.2²) = **2.6 mm**;
- line 2: 125.4 − √(125.4² − 43.6²) = **7.8 mm**;
- line 3: 125.4 − √(125.4² − 50.4²) = **10.6 mm**.

The hole on the main's flat blank is **100.8 mm** long along the main's axis and 2 × 125.4 × asin(50.4 ÷ 125.4) = **103.7 mm** wide around the girth. The bulge is smaller than for the Ø150 branch, because the branch covers a smaller share of the main's circumference, but a 100.8 mm circle cut on the flat would still roll to an opening only 98.1 mm across.
