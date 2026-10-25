---
book: welding-distortion-by-the-numbers
chapterSlug: angular-distortion
order: 4
title: "Angular distortion"
description: "See why a weld wider at its face than its root kinks the plates it joins, measure flange tilt at fillet welded tees, and reduce it with double-sided grooves, balanced sequences and smaller welds."
draft: false
---

A single-V butt weld is wide at its face and narrow at its root. When it cools, the wide face shrinks more than the narrow root, and the two plates rotate about the root, kinking the joint into a shallow V. A fillet weld on one face of a flange pulls the flange's edges up towards it, tilting a flat flange into a shallow umbrella. This angular distortion is the commonest kind in plate fabrication, and the easiest to see: a butt-welded plate that should be flat has a crease along its seam, and a girder's flanges are no longer square to its web.

This chapter explains the cause of angular distortion, calculates the flange tilt it produces at the shop's girders, and describes the ways to reduce it: double-sided preparations, balanced welding of both sides, smaller welds, and presetting the parts at the opposite angle.

## The cause: uneven shrinkage through the thickness

Angular distortion happens whenever a weld shrinks more on one side of the plate than the other. In a single-V butt weld, almost all the weld metal is near the face, so the face shrinks across the joint far more than the root, and the plates bend about the root. In a fillet welded tee, the weld and the heated metal lie on one face of the flange, so that face shrinks more than the opposite face, and the flange bends towards the weld. In both cases, the plate behaves like a strip with one surface shortened, and it curls towards the shortened side.

The amount depends on how unbalanced the shrinkage is, which rises with the weld's size relative to the plate thickness, and on how stiff the plate is, which rises steeply with its thickness. Thin plates with large welds distort most; very thick plates with small welds hardly at all. In between, there is a range where the weld is large enough to shrink strongly but the plate thin enough to bend, and that is where angular distortion is worst.

## Butt welds: single-V and double-V

A single-V butt weld puts nearly all its shrinkage on one side and kinks the plates; a double-V puts roughly equal shrinkage on each side, and if the two sides are welded in a balanced order, the kinks cancel.

```figure
type: compare
title: Angular distortion by butt weld preparation
cols: Where the weld metal is | Angular distortion
caption: General behaviour. The order in which the two sides of a double-V are welded matters as much as the preparation itself.
- Single-V | mostly near one face | largest: plates kink towards the face
- Single-V on a backing bar | mostly near one face | similar; the bar does not prevent it
- *Double-V, sides welded alternately | equal on both faces | smallest: the kinks cancel
- Double-V, one side completed first | equal, but at different times | the first side kinks the joint; the second only partly recovers it
```

The last row explains a common disappointment. A double-V preparation is chosen to reduce distortion, then the welder completes one side entirely before turning the plate, and the joint kinks almost as much as a single-V would. The first side is welded while the joint is thin and flexible, and it bends the joint freely; by the time the second side is welded, the first has stiffened the joint, and the second side's shrinkage cannot pull it fully back. The cure is to weld a few passes on one side, turn, weld a few on the other, and continue alternating, so that neither side gets far ahead.

## Measuring the kink

The kink in a butt-welded plate can be measured as an angle, or as the rise of the plate's edge above a flat surface when the other side is held down. This is an illustration. If each plate of a butt joint rotates by 1° about the root, and the plates extend 500 mm from the seam, the edge of one plate rises about 500 × tan 1° ≈ **8.7 mm** above the line of the other. A kink of a degree, barely visible at the seam, becomes a large step at the far edge of a wide plate.

## Fillet welds and flange tilt

In a plate girder, the two fillet welds joining each flange to the web lie on the flange's inner face, one each side of the web. Each pulls the flange's inner face shorter across its width, and the flange bends about the web, its edges rising towards the web on both sides, so that a flat flange becomes a shallow, inverted V. The tilt of each half of the flange is usually expressed as the rise or fall of its outer edge relative to a line square to the web.

```figure
type: formula
title: Flange tilt at the edge of a girder flange
formula: tilt at edge ≈ (b ÷ 2) × tan θ
caption: This is an illustration for the shop's 300 mm top flange. The angle θ is the rotation of each half of the flange at the web, measured on the shop's girders; it depends on the weld size, flange thickness and sequence.
- b, flange width | 300 mm
- θ, measured rotation of each half | about 1.2°
step: tilt ≈ 150 × tan 1.2°
step: tilt ≈ 3.1 mm at each edge
```

The shop's girders were showing about 3 mm of tilt at the flange edges, enough that bearing plates and bolted connections did not sit flat on the flanges. The tolerance for flange tilt in structural standards is usually expressed relative to the flange width, and the shop's girders were at or beyond it.

## Weld size and flange tilt

The angle grows with the size of the fillet and falls with the flange thickness. For the same flange, a larger fillet puts in more heat and more shrinkage on the inner face, and tilts the flange more. The shop's girders had 8 mm fillets on 20 mm flanges, specified by habit; the loads required only 6 mm, and the minimum size for 20 mm plate was also satisfied by 6 mm. Reducing the fillets to 6 mm cut the weld area by about 44%, and the measured tilt on the next girders fell to about 2 mm.

## Balanced welding of the two fillets

The two fillets at each flange are on opposite sides of the web, and they each tilt the half of the flange on their own side. If one fillet is welded completely before the other, the first can also pull the web slightly out of square and bend the flange unevenly. Welding the two fillets together, with two welders or a twin-head mechanised carriage working on opposite sides at the same time, or alternating lengths on each side, keeps the flange's two halves rotating equally and the web square.

## Presetting

If a joint is going to rotate by a predictable angle, the parts can be set before welding at the opposite angle, so that the weld's shrinkage pulls them to the correct position. A butt joint that kinks by 1° is set up with its plates angled 1° the other way; a flange that tilts by 1.2° is pre-bent 1.2° the other way before it is welded to the web. Chapter 8 describes presetting and pre-bending with the shop's girders. Presetting works best when the distortion is consistent, which means the welding procedure, the weld size and the sequence must be consistent too; a preset calculated for one welder's technique may overcorrect for another's.

## Number of passes

For the same weld size, the number of passes affects angular distortion. A single large pass puts its heat in at once and shrinks as a block; several smaller passes each shrink a little, and each later pass reheats and partly relaxes the earlier ones. In thick butt welds, many small passes tend to increase angular distortion compared with fewer larger ones, because each pass adds its own rotation about a root that has already stiffened, while in fillet welds the effect can go either way. The practical rule is to keep the number of passes, and the total weld metal, as small as the joint allows, and to balance the passes between the two sides where both are accessible.

## Back-gouging and its effect

A double-V or double-bevel joint is usually back-gouged after the first side's root passes, removing the root to sound metal before the second side is welded. The gouge removes some of the first side's metal and leaves a groove on the second side that the welder fills, and its depth affects the balance between the two sides. A deep back-gouge makes the second side's weld larger than the first, which can tip the balance the other way; a shallow one may leave lack of fusion. The welding procedure sets the gouge depth, and the sequence of passes is planned around it so that the two sides finish with similar amounts of weld metal.

## Heat sinks and chill bars

Copper or aluminium bars clamped close to the weld, on thin plate, draw heat away quickly and narrow the band of metal that is heated enough to yield, reducing both angular distortion and buckling. Water-cooled fixtures do the same on a production line. On thicker plate, the effect is smaller, because the plate itself carries the heat away. Chill bars are particularly useful on stainless steel and aluminium sheet, and they also help control the root profile in single-sided welds. The shop added copper chill bars to its panel fixture, one each side of each seam, and the panels' kinks at the seams were visibly smaller.

## Flange tilt and the web

A girder's flange tilts about the web, but the web also pays a price. If the two fillets at a flange are unbalanced, the flange's tilt pulls the web slightly out of square, so that the girder's flanges are no longer parallel. Where flanges carry bearings, bolted connections or crane rails, that lack of squareness matters as much as the flange tilt itself, and it is measured with a square across the flange and web at intervals along the girder.

## Restraint

Clamping the plates or flanges flat while welding, or tacking strongbacks across the joint, reduces angular distortion by holding the parts in position while the weld cools. Some rotation still happens when the restraint is removed, as the residual stress partly relaxes, and the restrained joint carries higher residual stress, as Chapter 6 explains. For angular distortion in particular, restraint is often effective and widely used, because the bending stiffness of a plate is small compared with the clamping force a fixture can apply.

## Angular distortion in corner and tee joints of frames

Frames made of hollow sections and plates show angular distortion too. A bracket plate welded to one face of a column with fillets on one side tilts towards the welds; a base plate welded all round to a column dishes, its edges lifting towards the column. The shop's machine bases, with top plates welded to hollow section frames, had their top plates pulled into a shallow dish by the fillets round their edges, partly by angular distortion of the plate at each weld. Thicker top plates, smaller welds and intermittent welds where the loads allowed all reduced it.

## Thin plates

In thin plate, below a few millimetres, angular distortion merges into buckling (Chapter 5), because the plate is too flexible to stay flat between the welds. Thin stainless steel panels welded to frames show both: a sharp angular kink along each weld and a wavy buckle between them. For thin material, low heat input, small welds, chill bars that draw heat away from the weld, and fixtures that hold the sheet flat while it cools are the main controls.

## The running case: girder flanges

This is an illustration. The shop's girder flange tilt, about 3 mm at the edges, was reduced in three steps: the fillets were cut from 8 mm to 6 mm, as their loads allowed; the fillets at each flange were welded in balanced pairs by a twin-head carriage; and the top flange, which still tilted about 1.5 mm, was pre-bent in a press by a small angle before assembly. The final girders showed less than 1 mm of tilt at the flange edges, within the tolerance, with no straightening.

## A failure: the one-sided double-V

This is an illustration. A thick plate butt joint for a machine bed was prepared with a double-V groove to limit distortion, but the welder, wanting to finish the easier side first, completed it in eight passes before turning the plate. The joint kinked by about 2°, and the second side, welded afterwards, pulled it back only about half a degree. The bed had to be straightened in a press and then machined, at a cost of most of a day.

The welding procedure for the next bed specified the sequence: two passes on the first side, back-gouge, two on the second, then alternating two passes at a time, with the plate turned in a positioner. The joint finished within a quarter of a degree of flat.

## Exercise: a wider flange

A girder's bottom flange is 250 mm wide and shows a measured rotation of each half of about 1.5° at the web. What is the tilt at each edge? If the flange were 400 mm wide with the same rotation, what would the tilt be, and what does this suggest?

At 250 mm wide, the tilt is about 125 × tan 1.5° ≈ 125 × 0.0262 ≈ **3.3 mm**. At 400 mm wide, with the same rotation, it is about 200 × 0.0262 ≈ **5.2 mm**.

The rotation at the web depends on the welds and the flange thickness, but the tilt at the edges grows with the flange's width. Wide, thin flanges are therefore the most sensitive to angular distortion, and for them presetting or a thicker flange may be needed even when the welds are well sized and balanced.
