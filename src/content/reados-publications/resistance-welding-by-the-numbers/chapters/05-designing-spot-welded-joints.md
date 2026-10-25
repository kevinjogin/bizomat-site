---
book: resistance-welding-by-the-numbers
chapterSlug: designing-spot-welded-joints
order: 5
title: "Designing spot-welded joints: pitch, edge distance and shunting"
description: "Lay out spot welds on a flange: how many spots strength needs, how close they can be before current shunts through the last weld, and where they sit on the flange."
draft: false
---

A spot weld that is perfect on a test coupon can be poor in the product if the joint is badly designed. The spot may sit on the bend radius instead of the flat flange, or so close to the sheet edge that the nugget breaks out, or so close to the previous weld that much of the current bypasses it. Good spot-weld design places each weld where the electrodes can reach it squarely, where the metal around it can contain the nugget, and where the welds already made do not rob it of current.

This chapter lays out the spot welds on the cabinet's side seam: how many are needed for strength, how far apart they must be, and where they sit on the flange.

## How spot welds carry load

A spot weld is strong when it is loaded in shear, with the two sheets sliding past each other in the plane of the joint. The load then spreads around the nugget's circumference. It is weak when loaded in tension across the joint or in peel, with one sheet levered away from the other, because the load concentrates at the edge of the nugget and the sheet around it tears. Good design arranges spot-welded joints so that the main loads act in shear, and adds flanges, stiffeners or extra welds where peel cannot be avoided.

The strength of a spot weld in shear depends on the nugget size, the sheet thickness and strength, and the way it fails. Rather than calculate it from first principles, the cabinet shop measured it. This is an illustration. Tensile-shear tests on twenty single-spot coupons of the 1.2 mm sheet, welded on the production schedule, gave a mean of 6.0 kN per spot and a lowest result of 5.2 kN. All failed by tearing the sheet around the nugget, which is the preferred failure mode because it shows the weld was stronger than the sheet next to it.

Static strength is not the whole story. Under repeated loading, such as vibration from equipment mounted in a cabinet on a truck or near a large motor, spot welds can crack at the notch formed where the two sheets meet at the edge of the nugget, at loads far below their static strength. Products that will see vibration or cyclic loads need fatigue data for spot-welded joints, from tests or a recognised design method, rather than the static tensile-shear results used here.

## How many spots strength needs

This is an illustration. The cabinet's side seam joins a side panel to the back panel along a 700 mm vertical flange. The cabinet's engineer estimated that the seam could carry up to 4.0 kN of shear in service, from equipment mounted on the back panel and handling loads, and the shop's design rule applies a factor of 3 to the lowest test result for spot-welded joints in its products.

```figure
type: formula
title: Spots needed on the side seam for strength
formula: n = F × k ÷ P_min
caption: This is an illustration. Strength alone needs only three spots; stiffness, appearance and sealing need many more, so the pitch is set by those, within the limit set by shunting.
- n | number of spots
- F | service shear on the seam, 4.0 kN
- k | design factor used by the shop, 3
- P_min | lowest tensile-shear test result, 5.2 kN
step: n = 4.0 × 3 ÷ 5.2
step: n = 2.31, so at least 3 spots
```

Three spots would carry the load, but a 700 mm flange held at three points would gape between them, rattle, admit dust and look poor. The engineer specified a maximum pitch of 50 mm for stiffness and appearance. Over 700 mm that needs 700 ÷ 50 + 1 = **15 spots**. So strength sets a minimum number; the pitch is set by other requirements; and the closest acceptable pitch is set by shunting.

## Shunting: current that bypasses the new weld

When a spot is made next to one already welded, the secondary current has two paths from electrode to electrode. It can pass straight through the new weld, as intended, or it can travel sideways through the top sheet to the existing weld, down through it, and back through the bottom sheet. The existing weld is cold and solid, so it conducts well. The sideways path through the sheets is the only real resistance in the shunt path, and it shrinks as the welds get closer.

The current divides between the two paths in inverse proportion to their resistances, like any parallel circuit. A simplified model makes the effect clear. This is an illustration. Take the hot new weld as 100 µΩ, as in Chapter 1. Treat the shunt path as two strips of cold sheet, each as long as the pitch s, with a resistivity of about 0.15 µΩ·m for cold low carbon steel, a thickness of 1.2 mm and an effective width of 10 mm to represent how the current spreads.

```figure
type: formula
title: Simplified shunt model for two neighbouring spots
formula: R_sh = 2 × ρ × s ÷ (w × t);  shunt fraction = R_w ÷ (R_w + R_sh)
caption: This is an illustration. The effective width is a modelling assumption; the real shunt must be found by test, which is why the shop's lobe trial used coupons with a neighbouring weld.
- ρ | resistivity of cold steel, 0.15 µΩ·m
- s | pitch between spots, m (0.030 m)
- w, t | effective strip width 10 mm; sheet thickness 1.2 mm
- R_w | resistance of the hot new weld, 100 µΩ
step: R_sh = 2 × 0.15 × 10⁻⁶ × 0.030 ÷ (0.010 × 0.0012) = 750 µΩ
step: shunt fraction = 100 ÷ (100 + 750) ≈ 0.118, about 12%
```

At 30 mm pitch, about 12% of the secondary current goes through the neighbouring weld by this model. Because heat follows current squared, the new weld receives only about (1 − 0.118)² ≈ 0.78 of the heat it would get with no neighbour. At 15 mm the model gives about 21% shunted and only 0.62 of the heat; at 50 mm, about 7% and 0.86.

```figure
type: bars
title: Share of current shunted through the previous spot, by pitch
unit: % of secondary current
max: 25
caption: This is an illustration from the simplified model for 1.2 mm sheet. Halving the pitch from 30 to 15 mm nearly doubles the current lost through the neighbouring weld.
- 15 mm pitch | 21.1
- 20 mm pitch | 16.7
- *30 mm pitch | 11.8
- 50 mm pitch | 7.4
```

This is why the cabinet shop made its weld-lobe trial (Chapter 2) on coupons that already carried a spot at the production pitch of 30 mm. The window it found, 8.2 to 10.5 kA, already includes the shunt, whatever its exact size. A lobe trial on single-spot coupons would have suggested lower currents that would make undersized welds in the product.

The model also explains two common observations. The first spot on a seam, with no neighbour, gets more heat than the rest and may expel. And welds close to an earlier weld on a different seam, for example at a corner where two flanges meet, can be undersized. Some controls offer a separate schedule for the first weld of a seam for this reason.

## Where the spot sits on the flange

A spot weld needs room around it. Three requirements set its position on a flange.

1. **The electrode face must sit fully on flat metal.** If part of the face rests on the bend radius of the flange, the contact area shrinks and tilts, the current concentrates at one side, and the weld is off-centre, small or expelled.
2. **The nugget must be contained.** A nugget too close to the sheet edge has too little solid metal around it to hold the liquid under the electrode force, so it bulges or expels at the edge. Edge welds also tear out at low load.
3. **The electrode body must clear the upstanding wall.** A truncated cone widens behind its face, so a weld placed close to the flange's wall may need a cranked or offset electrode.

This is an illustration. The cabinet side-seam flange is 16 mm wide, measured from the outside of the wall. The 1.2 mm sheet is bent with a 1.5 mm inside radius, so the bend occupies about t + r = 2.7 mm of the flange width, leaving about 13.3 mm of flat land. The shop's own design rule for 1.2 mm sheet puts the spot centre on the middle of the flat land and requires at least 4 mm of flat metal between the edge of the 6 mm electrode face and both the sheet edge and the start of the bend. With the spot centred on the land, there is (13.3 − 6) ÷ 2 ≈ 3.65 mm on each side, which is less than the rule. The engineer widened the flange to 18 mm, giving 15.3 mm of flat land and (15.3 − 6) ÷ 2 ≈ 4.65 mm each side.

Standards and customer specifications often state minimum flange widths, edge distances and pitches for each sheet thickness. Where they exist, they govern; the shop's rule is only for its own products where no other rule applies. The READOS chapter on [designing sheet metal parts for manufacture](/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-sheet-metal-parts-for-manufacture/) covers bend radii and flange proportions more generally.

```figure
type: checklist
title: Spot-weld layout checks for the cabinet seams
caption: This is an illustration of the shop's design review. Each item is checked on the drawing before the first part is welded.
- x Main loads in shear | peel avoided or stiffened
- x Number of spots | at least the strength requirement, 3 on the side seam
- x Maximum pitch | 50 mm for stiffness and appearance
- x Minimum pitch | 30 mm, the pitch used in the lobe trial
- x Flat land | at least 4 mm beyond the electrode face on each side
- x Electrode access | straight electrodes reach every spot
- *? First spot of each seam | check for expulsion; separate schedule if needed
```

## Order of welding along a seam

The order in which spots are made affects both distortion and shunting. Each weld heats a small zone and pulls the sheets together as it cools, so welding a long seam from one end to the other can walk a gap or a twist along the flange towards the far end, where it ends up concentrated. Welding from the middle outwards, or making a few widely spaced tack spots first and then filling in between, keeps the sheets located against each other and spreads the distortion.

Filling in between tacks changes the shunt, though. A spot made midway between two existing welds has a neighbour on each side, so two shunt paths in parallel take current from it. By the simplified model, a spot at 30 mm from neighbours on both sides would lose roughly twice the current of a spot with one neighbour. For that reason the cabinet shop does not fill in between existing spots on the visible side seams: it tacks the corners in a fixture and then welds each seam continuously from the middle towards each end, so every weld after the first has one neighbour, as in the lobe trial. Where a fill-in sequence cannot be avoided, the lobe trial must be repeated on coupons with neighbours on both sides.

## Sealers, adhesives and corrosion in the flange

A spot-welded flange leaves a narrow gap between the sheets around each nugget. Water and dirt entering that gap cannot easily dry out, so the flange becomes a crevice where corrosion starts, out of sight. Painting after welding does not reach far into the gap. For products exposed to moisture, three approaches are common:

- a weld-through sealer applied to the flange before welding, which fills the gap and is displaced locally by the electrode force at each spot;
- a structural adhesive in the flange combined with spot welds, often called weld bonding, which also stiffens the joint and spreads load between the spots;
- a coated steel, such as galvanised sheet, which brings its own changes to the schedule (Chapter 9).

Each of these changes the electrical contact at the faying surface. A sealer or adhesive must be displaced by the force before current can flow, so squeeze time, force and possibly an initial low-current pulse need to be confirmed by trials. The material supplier's data sheet will state whether it is designed to be welded through. The cabinet shop's outdoor variant uses a weld-through sealer on the base flanges, and its lobe trial for that variant is made on coupons with the sealer applied.

## A failure: spots on the radius

This is an illustration. The first production run of a smaller cabinet variant, built before the design review above existed, had a 10 mm flange. On the door-frame seam, several spots showed lopsided electrode marks, a few had expelled with a burst of sparks, and two tore out at low load in a chisel test.

Measurements showed the cause. With 10 mm of flange and 2.7 mm taken by the bend, the flat land was only 7.3 mm wide. Operators had been told to weld in the middle of the flange, which put the spot centre 5 mm from the edge. The 6 mm electrode face then reached from 2 mm to 8 mm from the edge, running 0.7 mm beyond the flat land and onto the start of the bend. Part of the face was resting on the start of the bend, so the contact area was smaller and tilted, the current density at one side was far higher than intended, and the weld expelled or formed off-centre.

The flange was widened to 16 mm on the variant, positioning stops were added to the welding fixture so that spots were located from the bend rather than from the edge, and the design review checklist was introduced so that flange width is checked against electrode size before a drawing is released.

## Exercise: tighter pitch

A customer asks for the cabinet's drip-tray mounting flange to be spot-welded at 20 mm pitch for a better seal. Using the simplified model, find the shunt fraction at 20 mm and the relative heat delivered to each new weld, compared with no neighbour. Then estimate the set current that would deliver the same current through the new weld as 9.0 kA does with no shunt at all.

At 20 mm, R_sh = 2 × 0.15 × 10⁻⁶ × 0.020 ÷ (0.010 × 0.0012) = **500 µΩ**. The shunt fraction is 100 ÷ (100 + 500) ≈ **0.167**, about 17%, so the weld receives 0.833 of the current and (0.833)² ≈ **0.69** of the heat. To pass 9,000 A through the new weld, the total would need to be 9,000 ÷ 0.833 ≈ **10,800 A**.

That is above the expulsion limit of the original window for the first spot of the seam, which has no neighbour. The practical answer is a new lobe trial on coupons with a neighbour at 20 mm, possibly with a separate schedule for the first spot, or a different sealing method such as a seam weld (Chapter 6) or a sealant in the flange.
