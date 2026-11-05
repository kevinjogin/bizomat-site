---
book: plate-work-by-the-numbers
chapterSlug: flat-sided-hoppers-and-corner-angles
order: 5
title: "Flat-sided hoppers and corner angles"
description: "Develop a square plate hopper: true side shapes, valleys flatter than the sides, the dihedral angle for folding or mitring, thickness at the corners, and a 60° hopper with 50.8° valleys."
draft: false
---

A flat-sided hopper is four trapezoids leaning in towards an outlet. Each side is a flat plate, so its pattern is simply its true shape. The work is at the corners, where two sides meet along a sloping line called the valley or hip. That line is flatter than either side, the two plates meet there at an angle that is neither 90° nor easy to read off a drawing, and the plates' thickness decides how the corner is joined and what size each plate must be.

This chapter develops the running case's square loading hopper, 1,200 mm square at the top and 300 mm square at the bottom, 600 mm deep, in 6 mm plate. It finds the true shape of each side, the valley angle and the dihedral angle at the corners, shows how thickness changes the plates, and ends with a hopper whose sides met the customer's 60° requirement while its valleys did not.

## True shape of a side

The hopper is centred: its outlet sits directly below the middle of its mouth. Each side runs in by (1,200 − 300) ÷ 2 = 450 mm in plan while dropping 600 mm, so it slopes at atan(600 ÷ 450) = **53.13°** to the horizontal.

In an elevation looking along one side, the side appears edge on as a sloping line, and its length in that view is its true height: √(600² + 450²) = **750 mm**. The side's true shape is therefore a trapezoid with a top edge of 1,200 mm, a bottom edge of 300 mm and a height of 750 mm, measured on the surface the dimensions belong to. Its sloping edges are each √(450² + 750²) = **874.6 mm**, which is also the true length of the valley line, as it must be, since the valley is where two sides' edges meet.

```figure
type: formula
title: True shape of a hopper side and its valley
formula: side slope = atan(depth ÷ run)        true height = √(depth² + run²)
formula: valley slope = atan(depth ÷ √(run₁² + run₂²))
caption: The running case's square loading hopper, inside dimensions, 600 mm deep, each side running in 450 mm.
- depth | Vertical depth of the hopper, 600 mm
- run | Plan distance each side moves in, 450 mm on all four sides
step: Side slope = atan(600 ÷ 450) = 53.13° from horizontal
step: True height of each side = √(600² + 450²) = 750 mm
step: Valley plan length = √(450² + 450²) = 636.4 mm; valley true length = 874.6 mm
step: Valley slope = atan(600 ÷ 636.4) = 43.31° from horizontal
```

## The valley is always flatter

The valley line runs diagonally across the corner in plan, so it travels further horizontally than either side while dropping the same depth. It is therefore flatter than both sides. For the running case's hopper, the sides slope at 53.13° and the valleys at only **43.31°**.

That matters for flow. Bulk material slides down the steepest available path, and in a hopper corner, that path is the valley. Material that would slide freely on the sides can hang up in the corners, build up and eventually bridge across the outlet. A storage hopper's designer specifies its slopes from the material's flow properties, and for a square or rectangular hopper the critical slope is usually the valley's, not the sides'.

The relationship has a clean form. If two adjacent sides slope at angles a₁ and a₂ from the horizontal, the valley between them slopes at v, where tan v = 1 ÷ √(cot² a₁ + cot² a₂). For two sides at 60°, the valley is at 50.77°. To get valleys at 60°, the sides must be at **67.79°**.

```figure
type: compare
title: Side and valley slopes for a square hopper
rowhead: Design
cols: Side slope | Valley slope | Depth for the running case's 450 mm run
caption: The valley is always flatter than the sides. Steep valleys need much steeper sides and a deeper hopper for the same mouth and outlet.
- Running case's loading hopper | 53.13° | 43.31° | 600 mm
- Sides at 60° | 60.00° | 50.77° | 779.4 mm
- * Valleys at 60° | 67.79° | 60.00° | 1,102.3 mm
```

The running case's hopper is a loading hopper that funnels feed straight through into the bin's inlet while it is being filled, not a storage hopper, and its designer has accepted the shallower valleys for that duty. A hopper that stores material, like the bin's own cone, is a different matter.

## The dihedral angle at the corners

Two adjacent sides meet along the valley at an angle measured square to the valley line, the **dihedral angle**. It is not the angle that appears in plan, 90°, nor in any elevation. It is found from the two sides' normals.

For the running case, a side facing the x direction has a normal proportional to (600, 0, 450), and the adjacent side (0, 600, 450). The angle between the normals is acos(450² ÷ (600² + 450²)) = acos(0.36) = 68.9°, so the inside dihedral angle between the plates is 180° − 68.9° = **111.1°**.

That one number serves every method of making the corner:

- A corner **folded** on a press brake, with two sides formed from one plate, is bent through 180° − 111.1° = **68.9°**, measured as the change of direction, and the bend line follows the valley.
- A corner **mitred** for welding, with each plate's edge bevelled so that the two edges meet, cuts each edge at half of 68.9°, **34.4°**, from square to the plate.
- A corner made with one plate **overlapping** the other's edge sets the overlapping plate at 111.1° to the other, and the fitter's template for checking it is cut to that angle.

## Thickness at the corners

The trapezoid of 1,200, 300 and 750 mm is the side's shape on its inside surface, because the drawing gives inside dimensions. The outside surface of each side is bigger, because it lies 6 mm further out, square to the plate.

Square to a plate sloping at 53.13°, a 6 mm offset moves the outside surface horizontally by 6 ÷ sin 53.13° = **7.5 mm**. At the top and bottom edges, if both are cut horizontally, the outside face's edges are therefore 15 mm longer than the inside face's: 1,215 mm at the top and 315 mm at the bottom, with the same 750 mm height on the slope.

How that difference is handled depends on the corner.

1. **Mitred corners**: all four plates are identical. Each is marked on its inside face to the 1,200 / 300 / 750 mm trapezoid and its edges are bevelled at 34.4° outward, so that the outside face is the 1,215 / 315 mm trapezoid.
2. **Overlapped corners**: two opposite plates are full width on their outside face and the other two fit between them, so the two pairs are different sizes. Each pair's dimensions are worked out from where its edge lands on the other plate's inside face.
3. **Folded corners**: the plates are developed with a bend allowance at each fold, using a K-factor as for any pressed bend, and the bend line marks the valley on the inside surface.

The running case's shop mitres the corners and welds them from outside, because its press brake is too short for an 874.6 mm bend at 68.9° in 6 mm plate without special tooling, and because four identical plates are easier to cut, mark and nest.

```figure
type: svg
title: A side plate of the loading hopper
alt: A trapezoid 1,200 mm wide at the top, 300 mm at the bottom and 750 mm high. Its sloping edges are 874.6 mm long. An outer dashed trapezoid shows the outside face, 1,215 mm and 315 mm wide, with the bevel between the two.
caption: This is an illustration at about 0.2 scale. The solid trapezoid is the inside face; the dashed outline is the outside face after a 34.4° mitre bevel. The top corner angles are 59.04° and the bottom corner angles 120.96°.
viewbox: 0 0 320 200
body:
<path class="bxa" d="M40 30H280L190 180H130Z"/>
<path class="li dsh" d="M38.5 30H281.5L191.5 180H128.5Z"/>
<text class="txs" x="130" y="22">1,200 inside, 1,215 outside</text>
<text class="txs" x="118" y="196">300 inside, 315 outside</text>
<text class="txs" x="236" y="118">874.6</text>
<text class="txs" x="146" y="110">750 true height</text>
```

## Marking and checking a side

Each side is marked on its inside face from a centreline. The top edge's ends are 600 mm either side of it, the bottom edge's ends 150 mm either side, 750 mm down the centreline. The check is each sloping edge, 874.6 mm, and the diagonals, which on a symmetrical trapezoid are equal: √(750² + 750²) = 1,060.7 mm, from each top corner to the opposite bottom corner.

The top corner angles are atan(750 ÷ 450) = 59.04°, and the bottom corners 180° − 59.04° = 120.96°. They are not needed to mark the plate, but they are useful for setting a plasma cutter's bevel head or checking a cut plate with a protractor.

When the four sides are tacked together, upside down on a flat floor with the top edge down, the checks are the top's diagonals, which should be √(1,200² + 1,200²) = 1,697.1 mm inside, the outlet's diagonals, 424.3 mm inside, and the depth from the floor to the outlet, 600 mm, at all four corners. A twisted hopper shows unequal diagonals at the outlet even when the top is square.

## Offset outlets

The running case's outlet is centred, so all four sides and all four valleys are alike. Many hoppers have their outlet offset, to discharge against a wall or into a conveyor's loading point, and then nothing is alike.

This is an illustration. Moving the loading hopper's outlet 150 mm towards one side, keeping its 300 mm size and the 600 mm depth, changes that pair of sides' runs from 450 mm each to 300 mm and 600 mm. The near side now slopes at atan(600 ÷ 300) = **63.43°** and the far side at atan(600 ÷ 600) = **45.00°**, while the other pair stays at 53.13°. The four valleys come in two pairs: those beside the near side slope at 47.97°, and those beside the far side at only **38.66°**, from the same formula as before.

Each side's pattern is now a trapezoid that is no longer symmetrical about its centreline, and each is found from plan coordinates and the depth in the same way: the true length of every edge from its plan length and its height, and the true height of the side from its run and the depth. The dihedral angle at each corner is different, so a shop that mitres the corners needs four bevel angles, not one. A drafter who expects symmetry will draw one side and mirror it, which is the commonest way an offset hopper goes wrong.

## The top flange and the outlet

The loading hopper sits on the bin's roof over the inlet and is bolted to it through a flange around its top. The flange is a square frame of flat plate, cut from 6 mm offcuts, welded around the hopper's top edge. Because the sides lean outward at the top, the frame's inner edge follows the outside face's 1,215 mm square, not the inside's 1,200 mm, and the plates meet the frame at 53.13°, which the weld detail on the drawing must allow for.

The outlet is a 300 mm square on the inside face, 315 mm on the outside, and it joins a short vertical spout that passes through the roof. The spout is a simple square tube with its top edge cut square, but its plates meet the hopper's sloping sides at an angle: each side is 36.87° from vertical, so the surface changes direction by 36.87° at the joint, and the included angle on the inside is 143.13°. The spout's inside must match the outlet's 300 mm inside square, and the weld preparation is set for that angle. For an offset outlet, each side meets the spout at its own angle, and the shop marks each joint with its angle.

Both details repeat the chapter's lesson. Any part that meets a sloping plate must be dimensioned to the right face of that plate, and the face changes the dimension by a few millimetres at every edge.

## Mass and capacity

The four sides of the running case's loading hopper are each 0.5625 m² on the inside face, the trapezoid's area (1,200 + 300) ÷ 2 × 750. Together they weigh 4 × 0.5625 × 0.006 × 7,850 = **106 kg**, before the top flange and the outlet's connection. The hopper holds, as a frustum of a square pyramid, 600 ÷ 3 × (1.2² + 0.3² + 1.2 × 0.3) = **0.378 m³**, which the BIZOMAT [prismoidal volume calculator](/tools/prismoidal-volume/) confirms from the end areas and the mid-section. Neither number affects the pattern, but both belong on the plate list: the mass for lifting and the volume as a check that the hopper drawn is the hopper ordered.

## The error: a 60° hopper with 50.8° valleys

This is an illustration. Before the running case's loading hopper, the shop had quoted a small storage hopper for another customer, whose specification said: "All hopper surfaces shall be at least 60° from horizontal." The drafter drew the sides at 60°, a 450 mm run with a depth of 779.4 mm, and the drawing went to the checker.

The checker's list includes the valley angle for every flat-sided hopper. With sides at 60°, the valleys were at **50.77°**, nearly ten degrees below the specification. The valleys are surfaces, and the steepest line on them was the one that mattered. The hopper would have met the words of the drawing's note, "sides 60°", and failed the specification.

The fix needed the customer's designer, because steepening the valleys to 60° needs sides at 67.79° and a depth of 1,102.3 mm, 323 mm deeper, which changed the support structure. The alternative, a round hopper or one with rounded corners, keeps the valley problem away entirely. The designer chose a deeper hopper. The shop added a line to its quotation checklist: "For flat-sided hoppers, state side and valley angles separately."

```figure
type: checklist
title: Flat-sided hopper checks
caption: The checks that found the shallow valleys, and the others that every square or rectangular hopper needs.
- Side slopes calculated on every side | 53.13° on the loading hopper
- Valley slopes calculated and compared with the specification | 43.31° accepted for a loading hopper
- Dihedral angle found for folding or mitring | 111.1°, mitre 34.4°
- Inside and outside face sizes on the plate list | 1,200 / 300 and 1,215 / 315 mm
- Diagonals of top and outlet checked at tack-up | 1,697.1 and 424.3 mm
- x Hopper slope specified as one number for sides and valleys | the 50.8° valleys
```

## Exercise: a rectangular hopper

A hopper is 1,500 × 1,000 mm at the top and 300 × 300 mm at the outlet, centred, 700 mm deep. Find the slopes of its two pairs of sides, the true heights of each side, and the valley's true length and slope.

**Worked answer.** The long sides run in (1,000 − 300) ÷ 2 = 350 mm, and the short sides (1,500 − 300) ÷ 2 = 600 mm.

- Long sides: slope atan(700 ÷ 350) = **63.43°**; true height √(700² + 350²) = **782.6 mm**.
- Short sides: slope atan(700 ÷ 600) = **49.40°**; true height √(700² + 600²) = **922.0 mm**.
- Valley: plan length √(600² + 350²) = 694.6 mm; true length √(694.6² + 700²) = **986.2 mm**; slope atan(700 ÷ 694.6) = **45.22°**.

The valley is flatter than even the shallower pair of sides, 45.22° against 49.40°. In a rectangular hopper, the valley is governed mostly by the flatter sides, and steepening only the long sides does little for the corners.
