---
book: sheet-metal-parts-by-the-numbers
chapterSlug: tolerances-on-folded-parts
order: 9
title: "Tolerances on folded parts"
description: "Where variation in a folded part comes from, why tolerances grow with every bend crossed, how angle error moves a flange, and how to set tolerances and datums a folder can hold."
draft: false
---

A folded part cannot be toleranced like a machined one. A machined part's features are cut relative to one setup and one datum, and their positions are as accurate as the machine. A folded part's features are cut accurately in the flat, then moved by every bend between them: by where the bend lands, how much material it takes up and what angle it ends at. A tolerance copied from a machining template onto a sheet metal drawing will often be impossible, and the drawing will either be ignored or rejected.

This chapter sets out where a folded part's variation comes from, how it accumulates across bends, and what that means for tolerances, datums and the features that absorb variation. It quotes one fabricator's general formed-feature tolerance as a starting point and builds the bracket's own tolerance scheme from its folder's capabilities. The running case finds a machining tolerance on the bracket's base width that no folder could hold.

## Where the variation comes from

This is an illustration. The bracket's folder and cutter describe their capability for this part as:

- **cutting the blank**: features on the flat located to about ±0.1 mm by the laser;
- **bend location**: each bend placed to about ±0.15 mm from the edge it is gauged from, including the back gauge's accuracy and the bend allowance's variation, which Chapter 3's trial strips put at about ±0.065 mm per bend;
- **bend angle**: ±0.5° with the press brake's angle correction, as Chapter 5 established;
- **thickness**: 1.9 to 2.1 mm, which shifts inside dimensions and slightly shifts the bend allowance.

Each feature's position on the finished part collects some of these, depending on how many bends lie between it and the datum it is measured from.

```figure
type: layers
title: How variation accumulates in the bracket
caption: This is an illustration from the folder's stated capabilities. Each bend crossed adds its location and angle variation to the cutter's.
- Across two or more bends | Cutting plus each bend's location and angle: widths across the channel, return to return
- *Across one bend | Cutting plus one bend's location and angle: slot height above the base
- Same flat | Cutting only, about ±0.1 mm: hole to hole on the base
```

## Worst case or root-sum-square?

The tables in this chapter give both a worst case and a root-sum-square figure. The worst case assumes every contributor sits at its limit in the direction that hurts; the root-sum-square assumes the contributors vary independently and rarely line up. For folded parts the truth is often between the two and closer to the worst case than for machined parts, because several contributors are not independent: a batch of thick sheet shifts every bend the same way, and a press brake program slightly off shifts every angle the same way. The bracket's tolerances are therefore set against the worst case, and the root-sum-square figures are shown only to indicate how often a part would actually approach it.

## Features on one flat

Features on the same flat portion, such as the four holes in the bracket's base, are positioned relative to each other only by the cutter. Their spacing, 120 mm, can carry a tolerance close to the cutter's capability, about ±0.1 to ±0.2 mm, and the drive's screw pattern fits them with ease. This is the tightest tolerance a folded part can usually hold, and it should be used where it is needed: between features that must line up with a mating part's pattern.

## Across one bend

A feature on a leg, located from the base, crosses one bend. Its position above the base collects the cutter's ±0.1 mm and the bend's location ±0.15 mm, a worst case of **±0.25 mm** and a root-sum-square of about ±0.18 mm.

The angle affects it differently. A slot centred 21 mm along the leg from the bend's tangent line moves sideways by 21 × sin 0.5° = **0.18 mm** if the leg is 0.5° out, but its height above the base changes by only 21 × (1 − cos 0.5°), less than a thousandth of a millimetre. Angle error moves features at right angles to the flange, not along it.

For the bracket's slots, the ±0.25 mm in height is irrelevant: a 20 mm slot carrying an M8 bolt allows (20 − 8) ÷ 2 = ±6 mm of vertical adjustment. The slots were made long precisely so that the bracket's height on the frame can be set at assembly whatever the bends do. That is the general answer to tolerance across bends: where a position across a bend matters, give the mating feature room to absorb it.

```figure
type: compare
title: Tolerance stack for features on the bracket
cols: Contributors | Worst case | Root-sum-square | Absorbed by
caption: This is an illustration from the folder's stated capabilities. Slots absorb what the bends cannot hold.
- Hole to hole on the base | Cutting | ±0.1 mm | ±0.1 mm | Not needed
- Slot height above the base | Cutting, one bend's location | ±0.25 mm | ±0.18 mm | ±6 mm of slot length
- Slot to base hole, sideways | Cutting, one bend's location, 0.5° at 25 mm | ±0.47 mm | ±0.28 mm | ±0.5 mm of slot width
- *Width across the top of the legs | Two bends' locations, two angles at 60 mm | ±1.35 mm | Not used | The clamp's ±0.5 mm float: too small
```

## Across two bends

The width across the top of the legs collects both base bends' locations and both legs' angles. With each bend's location ±0.15 mm and each leg's angle ±0.5° acting at 60 mm, the worst case is 2 × 0.15 + 2 × 60 × sin 0.5° = **±1.35 mm**. Chapter 5 set the angle tolerance to keep the angle part of that to about ±1 mm, matching the clamp's float of ±0.5 mm on each side, but the location part adds another ±0.3 mm.

The table's last row is therefore a finding. The clamp's float is smaller than the worst case the folder's capabilities allow. The designer had two choices: tighten the folding, which costs, or open the clamp's slots to ±1.0 mm each side, which costs nothing. The designer opened the clamp's slots. Again, the cheapest tolerance on a folded part is often a more generous mating feature.

```figure
type: range
title: Width across the top of the legs against the clamp's float
min: 157
max: 163
unit: mm
caption: This is an illustration. The folder's worst case, two bend locations of ±0.15 mm and two angles of ±0.5° at 60 mm, against the clamp's original and widened slots.
ticks: 157 | 158 | 159 | 160 | 161 | 162 | 163
- *Folded width, worst case | 158.65 | 161.35
- Clamp float as first drawn, ±0.5 mm each side | 159 | 161
- Clamp float widened, ±1.0 mm each side | 158 | 162
```

## A starting point for general tolerances

Many sheet metal drawings carry a general tolerance for formed features. One fabricator's design guide gives **±0.25 mm** as "a common industry starting point for general formed-feature tolerances", noting that it is a guideline, not a universal tolerance. It is a reasonable figure for features on one flat or across a single bend in thin sheet, and optimistic for dimensions across several bends or in thicker material.

The bracket's drawing uses a general tolerance scheme built from its folder's capabilities rather than a single figure:

- **±0.2 mm** between features on the same flat;
- **±0.5 mm** for dimensions across one bend;
- **±0.8 mm** for dimensions across two or more bends;
- **90° ±0.5°** for bend angles;
- individual tolerances where function needs something different.

The scheme is printed in the title block's general tolerance field, with the note "SHEET METAL GENERAL TOLERANCES" so that nobody mistakes it for a machining scheme.

## The error: a machining tolerance on a folded width

This is an illustration. The first version of the bracket's drawing was started from the office's machined-parts template, and its base width carried "160 ±0.1", because the template's general tolerance was ±0.1 mm for two-decimal dimensions and the drafter had typed 160.00 for consistency.

The base's outside width crosses two bends, each located to ±0.15 mm, so the folder's worst case is ±0.3 mm before any angle effect, three times the tolerance drawn. The folder's quote came back with a query and a note that it would not accept the tolerance, which was the right answer. The drafter changed the dimension to 160 with the sheet metal scheme's ±0.8 mm for dimensions across two bends, after checking that the base fits between the frame's rails with 2 mm to spare. The office also set its sheet metal template's general tolerance to the scheme above, so that a sheet metal part cannot inherit a machining tolerance by accident.

## Datums for a folded part

A folded part needs datums that the inspector can locate and the function cares about. For the bracket, the natural primary datum is the base's outside face, which sits on the frame rail, and the secondary is the outside face of one leg, which sits against the rail's vertical face. The holes in the base are located from the base's centreline, and the slots from the base's outside face. Every dimension on the folded view is then measured from surfaces that exist on the part and that matter to how it is used.

A common fault is to locate features from an edge of the flat pattern that, after folding, ends up on a return flange's tip, the least accurately positioned edge on the part because every bend lies between it and the base. Datums on a folded part belong on the largest, flattest surfaces that the part sits on, not on its outermost edges.

## Flatness, twist and bow

Folding introduces form errors as well as position errors. A long bend can bow along its length if the press brake's ram and bed deflect under load; a part with flanges of different lengths can twist as the bends release their stresses; a large flat panel can oil-can, popping between two shapes when pressed. None of these is captured by linear tolerances, and the drawing must say what it needs if they matter.

For the bracket, the base's flatness matters, because the drive's four feet sit on it and a rocking drive vibrates. The drawing gives a flatness tolerance of 0.5 mm on the base's outside face over its 160 × 300 mm area, which the folder confirmed it holds with its crowning correction. The legs' straightness along their 300 mm length matters less, because the frame bolts pull them flat, and the drawing leaves it to the general scheme.

## Geometric tolerances on sheet metal

Geometric tolerancing suits folded parts better than many designers expect. A **position** tolerance on the base's four holes, at maximum material condition, relative to the base face and centreline, says exactly what the drive's screws need and gives the folder the bonus tolerance that larger holes allow. A **profile** tolerance on the folded section, relative to the base as datum, can replace a cluster of linear dimensions and their stacked tolerances with a single zone that the part's outline must lie within, which is how many sheet metal shops inspect folded sections anyway. READOS's *Fits That Work* and *Inspecting to the Drawing* explain both in more depth.

The caution is the same as for any tolerance: a geometric tolerance copied from a machined-part drawing will be just as unachievable as the base width's ±0.1 mm was. The zone sizes must come from the folder's capability, as the linear scheme's did.

## Tolerance and cost

Tighter tolerances on folded parts cost money in ways that are easy to see once named: slower folding with more checking, angle measurement on every bend, more first-off trials, a higher reject rate, sometimes a second operation such as drilling after folding. A tolerance that halves the folder's capability may double the part's price, and a tolerance beyond it will be quoted with a query or not at all. The bracket's widened clamp slots and its sheet metal general tolerance scheme cost nothing to draw and remove the need for any of those, which is the usual pattern: generosity in the mating features buys looseness in the folded ones.

## Inspecting a folded part

Folded parts are usually inspected on a surface plate or in a simple fixture that holds them on their datums. The inspection should check the features the drawing tolerances, in the condition the drawing describes: before or after coating, as Chapter 1 noted, and free or restrained. Thin folded parts flex, and a bracket clamped flat to a surface plate may measure differently from the same bracket standing free. If the function is with the part bolted down, the drawing can say "INSPECT RESTRAINED ON DATUM A", which lets the inspector clamp the base flat before measuring the legs. The restraint should match how the part is held in service: the bracket is bolted through its base to the frame, so clamping the base is realistic, whereas clamping the legs as well would hide an angle error that the drive's clamp would then have to absorb.

## Exercise: the slot-to-hole distance

The drive's mounting feet sit on the base holes, and the frame bolts pass through the leg slots. The horizontal distance from the nearest base hole's centre to the plane of the leg's outside face is 20 mm nominal. What variation does it carry, and does the 9 mm slot width, carrying an M8 bolt, absorb it?

**Worked answer.** The hole is cut in the flat to ±0.1 mm. The leg's outside face position relative to the base depends on the base-to-leg bend's location, ±0.15 mm. At the slot's height, 25 mm above the base, an angle error of 0.5° tilts the leg's face by 25 × sin 0.5° = 0.22 mm. The worst case is 0.1 + 0.15 + 0.22 = **±0.47 mm**, and the root-sum-square √(0.1² + 0.15² + 0.22²) = about **±0.28 mm**.

The slot is 9 mm wide for an 8 mm bolt, giving (9 − 8) ÷ 2 = **±0.5 mm** of float across its width, just more than the worst case. The slot absorbs it, with little margin. If the bolt were a tighter fit, or the hole's position mattered more, the slot could be widened to 10 mm, or the bracket could be located on the frame by the base holes and fixed through the slots with clearance to spare.
