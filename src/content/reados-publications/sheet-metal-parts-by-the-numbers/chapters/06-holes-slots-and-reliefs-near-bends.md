---
book: sheet-metal-parts-by-the-numbers
chapterSlug: holes-slots-and-reliefs-near-bends
order: 6
title: "Holes, slots and reliefs near bends"
description: "Keep holes and slots clear of the bend's deformation zone, size bend reliefs where a bend stops inside the blank, respect edge distances, and catch a cable hole too close to a bend."
draft: false
---

A hole cut in a flat blank stays round only if the bend leaves it alone. The bend's deformation does not stop sharply at the tangent line; the sheet curves and stretches a little either side of it, and a hole whose edge lies in that region is pulled into an oval and dragged towards the bend. A slot that crosses a bend line tears, and a bend that runs out inside the blank, rather than at an edge, tears the corner where it stops unless something relieves it.

None of these is hard to avoid once the distances are known. This chapter sets out the rules of thumb for features near bends, using one fabricator's published guide as an example, and the geometry of bend reliefs. The running case checks the bracket's holes and slots, adds a shortened return that needs relief, and finds a cable gland hole drawn too close to the base.

## The bend's zone of influence

When a flange is bent, the material within roughly the bend radius plus a few thicknesses of the bend is disturbed: stretched on the outside, compressed on the inside, and slightly curved beyond the tangent lines. A feature inside that zone distorts. Round holes become ovals stretched across the bend, the edge nearest the bend bulges towards it, and slots parallel to the bend narrow or bow.

Fabricators publish rules of thumb for how far features should stay from a bend, and they do not all agree. One fabricator's design guide, quoted here as an example, gives a hole's distance from the bend line as at least 2.5t + r, where r is the inside bend radius. For the bracket, 2.5 × 2 + 2 = **7 mm**. Other guides give different multiples, and some measure from the tangent line rather than the bend line, which makes a difference of a few millimetres at the bracket's size. The safe course is to measure from the nearer reference, the bend's tangent line on the flange in question, and to confirm the distance with the folder.

```figure
type: formula
title: A published rule of thumb for holes near a bend
formula: minimum distance from bend ≈ 2.5 × t + R
caption: One fabricator's design guide, as an example. Rules vary between suppliers; the running case measures from the tangent line, which is the conservative reading, and confirms with its folder.
- t | Sheet thickness, 2.0 mm
- R | Inside bend radius, 2.0 mm
step: 2.5 × 2.0 + 2.0 = 7.0 mm from the bend to the nearest edge of the hole
step: Bracket's base bend tangent line on the leg: 4.0 mm above the base's outside face
step: Hole edges on the leg should therefore be at least 4.0 + 7.0 = 11.0 mm above the base's outside face
```

## The running case: checking the bracket's features

This is an illustration. The checker listed each feature near a bend, measured from the tangent line on its own flange, and compared it with the 7 mm rule.

- **Leg slots.** Each slot is 9 × 20 mm, its long axis vertical, centred 25 mm above the base's outside face, so it spans 15 to 35 mm. Its lower end is 15 − 4 = **11 mm** above the base bend's tangent line and its upper end is 56 − 35 = **21 mm** below the return bend's tangent line. Both pass.
- **Base holes.** The Ø7 holes are 20 mm from each outside face of the base, so 20 − 4 − 3.5 = **12.5 mm** from the tangent line to the hole's edge. They pass.
- **Return flanges.** The returns are 15 mm wide outside and carry no features.

```figure
type: compare
title: Features near bends on the bracket
cols: Nearest bend | Edge to tangent line | Rule of thumb | Verdict
caption: This is an illustration. Distances on each feature's own flange, from the nearest bend's tangent line to the nearest edge of the feature.
- Leg slot, lower end | Base bend | 11.0 mm | 7.0 mm | Clear
- Leg slot, upper end | Return bend | 21.0 mm | 7.0 mm | Clear
- Base hole Ø7 | Base bend | 12.5 mm | 7.0 mm | Clear
- *Cable gland hole Ø25, as first drawn | Base bend | 1.5 mm | 7.0 mm | Too close
- Cable gland hole, moved to 25 mm | Base bend | 8.5 mm | 7.0 mm | Clear
```

## The error: the cable gland hole

This is an illustration. A late change added a Ø25 hole in one leg for a cable gland, so that the drive's supply cable could enter through the bracket. The drafter placed it to clear the drive's body, with its centre 18 mm above the base's outside face. The hole's lower edge was therefore at 18 − 12.5 = 5.5 mm above the base, and 5.5 − 4 = **1.5 mm** above the bend's tangent line: well inside the zone the bend disturbs.

The first-off part showed it at once. The hole's lower edge had been pulled towards the bend and flattened, the hole measured about 25.0 mm across but noticeably less from top to bottom, and the gland's sealing washer would not seat flat because the sheet around the hole's lower edge was curved. The fault had been visible on the drawing to anyone who measured from the bend.

The drafter moved the hole's centre to 25 mm above the base, putting its lower edge at 12.5 mm above the base and **8.5 mm** above the tangent line, which satisfies the rule. The drive's body still cleared the gland. Had there been no room to move it, the alternatives would have been to cut the hole after folding, which costs an operation, or to raise the gland onto a small flat plate welded to the leg.

## Slots and their orientation

A slot's orientation relative to the bend changes how the bend affects it. A slot whose long axis runs parallel to the bend, close to it, is the most vulnerable: its whole length sits at the same distance from the bend, so the whole slot bows. A slot whose long axis runs square to the bend, like the bracket's leg slots, has only one end near the bend, and only that end needs to respect the distance rule. Where a slot's purpose allows either orientation, running it square to the nearest bend is the more forgiving choice, and the bracket's slots are vertical for that reason as well as for adjustment.

## Holes that must be round after folding

Some holes must be accurately round and accurately placed after folding, such as a bore that carries a shaft, or two holes in opposite legs that a pin must pass through. Even outside the bend's zone, a hole on one flange is positioned relative to a feature on another flange only as accurately as the bends between them, which Chapter 9 quantifies. When a hole's position across a bend matters more than that allows, it should be cut, drilled or reamed after folding, and the drawing should say "DRILL AFTER FOLDING" or show the hole on the folded view only, so that the cutter does not cut it in the flat.

## Bend reliefs

A bend that runs the full width of the blank, from one edge to the other, needs no relief: the sheet bends cleanly along its whole length. A bend that stops inside the blank, where a flange is shorter than the edge it is bent from, is a different matter. At the end of the bend, the bent material is still attached to unbent material beside it, and the corner tears unless a **relief** is cut: a small notch or slot that separates the bent flange from the material beside it, running a little past the bend.

The relief must be wide enough for the material to separate cleanly and deep enough to reach beyond the bend's deformation. A common starting point, which the bracket's folder confirmed for its tooling, is a relief at least as wide as the sheet thickness, extending at least R + t beyond the bend line into the unbent material. For the bracket, that is a relief at least 2 mm wide and extending at least 4 mm beyond the bend line. Reliefs can be rectangular, round-ended or teardrop-shaped; round ends spread the stress and tear less.

```figure
type: checklist
title: Checks for features near bends
caption: This is an illustration of the office's sheet metal feature checks. Distances are on the feature's own flange.
- Holes and slots at least 2.5t + R from the tangent line | 7.0 mm for the bracket, confirmed with the folder
- Hole edges at least 2t from a cut edge | 4.0 mm; the bracket's holes and slots are well clear
- Holes no smaller than about the sheet thickness if punched | Ø7 in 2.0 mm sheet
- Bend reliefs where a bend stops inside the blank | At least t wide and R + t past the bend line
- Holes needing accuracy across a bend drilled after folding | None on the bracket
- x Features crossing a bend line | Tear or distort; move them or cut after folding
- ? Features on a flange shorter than the minimum | See Chapter 7
```

## The running case: a shortened return

This is an illustration. To let the cable reach the gland, the designer shortened one return flange by 40 mm at one end, so that the return runs 260 mm instead of the full 300 mm. The return's bend now stops 40 mm in from the blank's end, and the corner where it stops needs relief.

The drafter added a round-ended relief 2.5 mm wide, wider than the 2.0 mm thickness, extending 5 mm into the leg past the return's bend line, more than the 4 mm minimum. On the flat pattern, the relief is a short slot cut from the end of the shortened return into the leg, along the bend line's continuation. The folder's first-off part showed a clean corner with no tearing.

Had the relief been omitted, the material at the end of the bend would have been forced to bend and not bend at the same place. It would have torn, or stretched into an untidy bulge that cracks under vibration. Both are common on first prototypes and both are easy to prevent on the drawing.

## Corners where two flanges meet

A box or tray folded up from a single blank has corners where two flanges, bent along two bend lines at right angles to each other, meet. At the corner, both bends try to deform the same small square of material, and without a relief it bunches or tears. The usual answer is a corner relief: a round or square cut-out at the intersection of the two bend lines, large enough to clear both bends' zones of influence, so that each flange bends on its own and the corner is left as a small open gap.

The bracket has no such corners, because its returns and legs all run along the same direction. An enclosure version of it, with end walls folded up from the base, would have four, and the size of each relief would set how big a gap is left at the corner, which matters if the corners are to be welded or sealed. A relief that is too small leaves a bulge that stops the walls closing square; one that is too large leaves a gap that is hard to weld. The folder's own corner relief, used on its other enclosures, is usually the best starting size.

## Inserts and formed features near bends

Holes are not the only features that a bend can spoil. Self-clinching nuts, studs and standoffs pressed into the sheet, countersinks, extruded holes and embossed ribs all need flat, undistorted material around them, and their suppliers publish minimum distances from bends and edges for each size. The bend's distortion affects them in two ways: a nut pressed in before folding can be pulled out of square by the bend, and one pressed in after folding may not be reachable with the press tooling if it sits close to a flange.

This is an illustration. A later version of the bracket replaces the drive's loose M6 nuts with four self-clinching nuts in the base. The nut supplier's data gives a minimum centre distance from a bend for that size, and the base's holes, 20 mm from each outside face, are well beyond it. The drawing calls up the nut by supplier part number, states "INSTALL AFTER FOLDING", and shows the nut's head side, so that the folder presses it from the correct face.

## Edge distances

Holes close to a cut edge have their own limit, independent of bends. A punched hole too close to an edge bulges the edge out as the punch pushes through; a laser-cut hole too close leaves a thin web that heats, distorts and may crack. The fabricator's guide quoted above gives at least 2t from the edge for punched holes, 4 mm for the bracket. Its holes and slots are 20 mm or more from every edge, so the limit does not bite here, but a designer adding a row of small holes along a flange's edge should check it.

The same guide suggests a minimum punched hole diameter of roughly the material thickness, because a punch much narrower than the sheet is thick tends to break. The bracket's Ø7 holes in 2.0 mm sheet are comfortably above it. Laser cutting can make smaller holes, but their edges are less round and their sides less straight in thick sheet, which matters if a screw must thread into them.

## Exercise: a louvre panel

A ventilation version of the bracket has a row of 8 × 30 mm slots in each leg, long axis horizontal, for cooling. The legs are 60 mm high outside. Where can the row's centreline sit, and what is the widest slot, measured vertically, that fits between the two bends with the 7 mm rule from each tangent line?

**Worked answer.** On each leg, the base bend's tangent line is 4 mm above the base's outside face and the return bend's tangent line is 56 mm above it. Applying 7 mm from each, the slots' edges must lie between 4 + 7 = **11 mm** and 56 − 7 = **49 mm** above the base. That is a band 38 mm tall.

An 8 mm tall slot fits anywhere with its centreline between 11 + 4 = 15 mm and 49 − 4 = 45 mm. Centring the row midway between the tangent lines, at (4 + 56) ÷ 2 = **30 mm**, keeps it as far as possible from both bends.

The widest slot, measured vertically, that the band allows is **38 mm**, centred at 30 mm. A slot that tall would leave only 11 mm of leg below it, 4 mm of which is the bend itself, and 11 mm above it up to the return, so the leg between slots would be carried by narrow strips at the top and bottom. That weakens the leg against the drive's weight and vibration, and the designer's stiffness check would usually keep the slots much smaller than the bend rule allows. The rule sets the band in which slots can go; it does not say how much of the band they should use.
