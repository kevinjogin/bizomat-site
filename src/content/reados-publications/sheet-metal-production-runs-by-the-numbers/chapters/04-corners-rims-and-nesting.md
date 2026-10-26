---
book: sheet-metal-production-runs-by-the-numbers
chapterSlug: corners-rims-and-nesting
order: 4
title: "Corners, rims and nesting"
description: "Close the tray's corners with lap tabs at 92.2°, stiffen the rim with a hem, find why flared trays jam at a 6.1 mm pitch, set denesting lugs for a 25 mm pitch, and lugs pressed the wrong way."
draft: false
---

A flared tray's blank, folded, is still not a product. Its corners are open, its rim is a raw edge, and its walls are flexible. And because the trays will be stacked inside one another, their walls can wedge together so tightly that a stack of twenty becomes a single lump of steel. This chapter deals with the features that turn a folded blank into a tray that holds together, carries its load and comes apart from the stack: the corners, the rim and the denesting lugs.

It closes the running case's corners with lap tabs folded to the corner's true angle, stiffens the rim with a hem, works out why a flared tray nested on its walls alone jams, sets lugs that hold the trays 25 mm apart, and ends with a batch whose lugs were pressed inward.

## The corner's true angle

Two neighbouring walls of the tray meet along the corner edge at an angle that is not 90°. Each wall leans outward 11.31°, the long walls in one direction and the short walls in the other, and the angle between their planes, calculated from their directions, is **92.2°** on the inside of the corner.

That angle matters for the lap tab. The tab is a 15 mm strip along the short wall's sloping edge which folds round the corner and lies flat against the long wall's outside, where it is riveted. To lie flat, the tab must be folded through 180° − 92.2° = **87.8°** from the short wall's plane, not the 90° that a square box would need. A tab folded to 90° stands off the long wall by about 0.6 mm at its outer edge, enough to stop the rivets pulling it down evenly.

## Riveting the corners

This is an illustration. Each corner takes two 4 mm blind rivets through the lap tab and the long wall, one 50 mm and one 160 mm up the 213.04 mm corner edge from the base. Eight rivets per tray, 4,000 for the run, set with a pneumatic riveter in a bench jig that holds the folded tray square.

The rivets carry the load that tries to spread the corners apart: when a full tray is lifted by its handles in the short walls, the short walls are pulled upward and the long walls, loaded by the parts inside, push outward on the corners. The rivet maker publishes a rated shear load for each rivet in a given material and thickness, and the shop chooses the rivet and the number per corner so that the corners are well within it, then confirms the whole tray by load test on the first article. The numbers belong to the rivet maker's data and the test, not to a rule of thumb.

```figure
type: stats
title: The tray's corners
caption: This is an illustration. The angle and fold come from the tray's geometry; the rivets from the shop's choice, confirmed by test.
- 92.2° | Inside angle at each corner | between a long wall and a short wall
- 87.8° | Lap tab fold | to lie flat on the long wall
- * 8 | Blind rivets per tray | two per corner, 4,000 for the run
- 213.04 mm | Corner edge length | rivets at 50 and 160 mm up it
```

## The rim

A raw sheet edge at the top of a wall is sharp, weak and easily bent. The running case's 12 mm hem, folded outward and closed flat, doubles the sheet's thickness around the rim to 2.4 mm over a 12 mm band, gives a rounded top edge for hands, and resists the rim bending when a tray is lifted by its handles or knocked against a shelf.

The hem's doubled band is about eight times as stiff in bending as a single sheet of the same width, because bending stiffness grows with the cube of thickness and (2.4 ÷ 1.2)³ = 8. That stiffness is concentrated where the walls are least supported, along their top edges, which is why a hem does more for a tray's rigidity than its 12 mm of sheet suggests.

The hem also matters for nesting. Turned outward, it forms a ledge around the outside of the rim, and that ledge is what the next tray's denesting lugs rest on.

## The handle slots

A full tray is lifted by two slots, one in each short wall, 120 × 30 mm with 15 mm end radii, their top edges 40 mm below the rim. This is an illustration; the slot's size comes from the shop's trials with gloved hands, and its position from the need to leave a strong band of wall, with the hem above it, for the fingers to pull on.

The slot's edges are cut by the laser and then deburred, because a laser-cut edge in 1.2 mm steel can leave a sharp lip, and fingers take the whole load through it. The band of wall above the slot, 40 mm high and topped by the 2.4 mm hem, carries half the tray's weight as a short beam spanning the slot's width. When a 25 kg tray is lifted, each slot carries about 25 × 9.81 ÷ 2 = **123 N**, a modest load, but concentrated on the slot's top edge where the coating will wear first. The first article's load test, in Chapter 10, includes lifting by the slots, not just loading the base.

## Checking the folded tray

Before the corners are riveted, while the walls can still be pushed into place, the folded tray is checked in its jig.

1. **Top diagonals**: inside the top of the walls, corner to corner, both diagonals should be √(600² + 400²) = **721.1 mm**. Unequal diagonals mean a wall folded to the wrong angle or a corner not closed.
2. **Base diagonals**: inside the base, √(518² + 318²) = **607.8 mm**, which checks the blank was cut and folded square.
3. **Depth at the corners**: 205 mm at all four corners, base to the top of the wall, which checks every fold reached its 78.69°.
4. **Top width and length**: 600 and 400 mm, which with the base checks the flare.

A tray that passes all four is riveted. One that fails is adjusted in the jig, which holds the walls at their angles; a tray that cannot be adjusted into tolerance has a fold or blank fault, and the operator stops and checks the press brake before folding the next.

## Why flared trays jam

Two identical flared trays, one dropped into the other, slide together until something stops them. Without lugs, what stops them is the walls. The inner tray's outside surface meets the outer tray's inside surface when the inner tray has dropped so far that the flare has taken up the wall's thickness.

Measured horizontally, the 1.2 mm wall is 1.2 ÷ cos 11.31° = **1.224 mm** thick. The walls close by 0.2 mm horizontally for every millimetre the inner tray drops, so they meet when the inner tray sits only 1.224 ÷ 0.2 = **6.12 mm** above the outer one. Twenty trays nested that way would stand just 205 + 19 × 6.12 = 321 mm high, well within the 700 mm requirement.

But they would not come apart. The walls meet as a wedge, and a wedge with a half-angle of 11.31° locks if the friction between the surfaces is more than tan 11.31° = 0.2, which powder-coated steel pressed together can easily exceed. A tray pushed down into another, or loaded on top of a stack, would jam, and separating a jammed stack of twenty in a warehouse is slow, frustrating and hard on the coating.

```figure
type: bars
title: Height of a nested stack of twenty trays by stacking pitch
unit: mm
max: 800
caption: This is an illustration. At 6.12 mm the walls touch and the trays jam; at 25 mm the lugs hold them apart with a clearance of 3.78 mm between walls. The requirement is 700 mm.
- Walls touching, 6.12 mm pitch | 321
- Lugs, 20 mm pitch | 585
- * Lugs, 25 mm pitch | 680
- Lugs, 30 mm pitch | 775
```

## Denesting lugs

The cure is to stop the trays before their walls meet. The running case uses four **denesting lugs**, small dimples pressed outward in the long walls near the corners, whose lower faces sit 25 mm below the rim. When a tray is dropped into another, its lugs land on the outer tray's hemmed rim and hold it there, with its rim **25 mm** above the outer rim.

At that pitch, the gap between the walls is 0.2 × 25 − 1.224 = **3.78 mm** horizontally, so the walls never touch and the trays lift apart freely. The lugs must protrude more than that gap to land on the rim: this is an illustration, and the shop presses them 6 mm proud, leaving about 2.2 mm of lug resting on the rim's top.

Twenty trays at a 25 mm pitch stand **680 mm** high, inside the 700 mm requirement with 20 mm to spare. A 30 mm pitch would have been easier to denest but would have stacked to 775 mm, over the limit; a 20 mm pitch would have stacked lower but left only 2.78 mm between walls, little margin for a dented wall or a heavy coat. The pitch is the specification's compromise between three requirements.

## Pressing the lugs

The lugs are pressed into the flat blank, after cutting and before folding, on a small press with a simple punch and die: a rounded punch pushing the sheet into a matching recess, so that the dimple stands proud on the side that will become the tray's outside. Four hits per tray, at the four etched marks, take about half a minute with the blank located against stops.

Pressing them flat is easier and more consistent than pressing them into a folded wall, where the die cannot reach behind the sheet. It does mean the lugs' positions on the flat must allow for the folding: their lower faces are to be 25 mm below the rim measured vertically, which is 25 ÷ cos 11.31° = 25.5 mm down the slant from the rim on the flat flap. The die's orientation, bump towards the outside, is marked on the die and on the work instruction, for the reason the next section shows.

## The error: lugs pressed inward

This is an illustration. On the first production batch of fifty trays, a new press operator set the lug die upside down and pressed every lug **inward**, a dimple into the tray instead of a bump out of it. The trays looked almost the same; the lugs were the same size and in the same place.

Inward lugs cannot rest on the rim below, because they do not reach it. The first time the batch was stacked for coating, the trays slid together until their walls met at the 6.12 mm pitch, and the stack of fifty jammed. Separating them took two people most of an hour and marked several trays.

The shop's in-process check had been a visual one, "lugs present", which an inward lug passes. It is now a functional one: every twentieth tray from the press is dropped into the previous one, and must sit with its rim 25 ± 2 mm above it and lift out freely. The check takes ten seconds and tests the thing the lugs are for. The fifty trays with inward lugs could not be corrected, because a dimple cannot be reversed without tearing the coating-ready surface, and they were set aside for internal use in the shop, where stacking does not matter.

```figure
type: checklist
title: Corner, rim and nesting checks
caption: Each check tests the feature's function, not just its presence.
- Lap tabs folded to 87.8° and lying flat on the long walls | no stand-off at the rivets
- Two rivets per corner, set fully | 8 per tray
- Hem closed flat all round, corners not colliding | 12 mm, 2.4 mm thick
- Lugs pressed outward, 6 mm proud | four per tray
- Drop test every twentieth tray | rim 25 ± 2 mm above the one below, lifts out freely
- x Lugs checked only for presence | the jammed batch with inward lugs
```

## Coating and nesting

Powder coat adds thickness to both faces of every wall, typically tens of micrometres each side, and that reduces the gap between nested walls slightly. At the 25 mm pitch the 3.78 mm gap is so much larger than any coating that it makes no practical difference. At a pitch close to the jamming limit it would: a tray designed to nest at 7 mm, with only 0.18 mm of gap, could jam once coated. The coating is one more reason the lugs hold the trays well clear of each other.

Coating also affects the lugs' landing. The lugs and the rim are both coated, so they rest coating on coating; over many stackings the contact points wear, and the trays' rims may show small marks where the lugs sit. That is cosmetic, and the specification can say whether it matters to the distributor.

## Exercise: a lower stack

The distributor asks whether twenty trays could stack lower, to fit under a mezzanine with 620 mm of clearance. Using the same lugs and the same 1.2 mm walls, what pitch is needed, what gap does it leave between walls, and is it acceptable?

**Worked answer.**

- Required: 205 + 19 × p ≤ 620, so p ≤ 415 ÷ 19 = **21.8 mm**. Take **21 mm**.
- Wall gap at 21 mm: 0.2 × 21 − 1.224 = **2.98 mm**.
- Stack of twenty: 205 + 19 × 21 = **604 mm**, inside the 620 mm limit.

A 2.98 mm gap is still well clear of the jamming point and the coating's thickness, so the change is acceptable in principle. The lugs' lower faces would move up to 21 mm below the rim, and the lugs, still 6 mm proud, would have about 3 mm of landing on the rim. The change is a new lug position on the blank and a new die setting, worth confirming with a drop test on a few trays before changing the run.
