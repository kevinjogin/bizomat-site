---
book: welding-distortion-by-the-numbers
chapterSlug: straightening
order: 9
title: "Straightening distorted work"
description: "Straighten welded members with heat triangles, line heats and spot heats, estimate the correction each heat gives, respect the steel's temperature limits, and know when a press or jack is better."
draft: false
---

When distortion has happened anyway, it must be corrected. Welded beams that bow, plates that kink and flanges that tilt can be straightened, either mechanically, with presses and jacks that bend them back, or with heat, using the same shrinkage that distorted them to pull them true. Heat straightening, done well, is a remarkable skill: a few carefully placed heats can bring a badly bowed beam straight without any force. It is also one of the oldest techniques in metalworking, used by blacksmiths and shipwrights long before welding existed. Done badly, it ruins the steel, adds new distortion or simply wastes hours.

This chapter explains how heat straightening works, estimates the correction a single heat triangle gives a bowed beam, sets out the patterns of heat used for different distortions, stresses the temperature limits that protect the steel, and compares heat with mechanical straightening. Machine Part Repairs by the Numbers covers straightening of shafts in its chapter on [straightening and distortion](/reados/publications/machine-part-repairs-by-the-numbers/straightening-and-distortion/).

## How heat straightening works

Heat straightening uses the mechanism of Chapter 1 deliberately. A small area of the member is heated quickly, so that it tries to expand but is held back by the cooler metal around it; it yields and is upset, becoming shorter and thicker. When it cools, it shrinks, pulling the member towards it. Heating the convex, long side of a bow therefore shortens that side and pulls the member straighter. The heat is applied where shortening is wanted, and each heat produces a small, predictable correction once the straightener has learned how the member responds.

## The heat triangle

The commonest pattern for straightening a bowed beam or girder is the heat triangle, or vee heat, on the web or flange, with its base on the long, convex edge and its apex towards the neutral axis. Heating the triangle from apex to base, the wider base, which upsets the most, shortens the convex edge more than the region near the axis, and the member bends towards the base.

```figure
type: formula
title: Approximate correction from one heat triangle on a beam flange
formula: shortening ≈ f × α × (T − ΔT_yield) × base width
caption: This is an illustration of a simplified model. The factor f, the fraction of the theoretical expansion that becomes permanent shortening, depends on restraint and technique; 0.5 is assumed here. Real corrections are found by trial on the shop's work.
- Peak temperature above the surroundings, T | 600 °C, within the steel's limit
- ΔT_yield, from Chapter 1 | about 112 °C
- Base width of the triangle | 100 mm
- f, illustrative | 0.5
step: shortening ≈ 0.5 × 12 × 10⁻⁶ × (600 − 112) × 100 ≈ 0.29 mm at the edge
step: across a 600 mm deep section, a rotation of about 0.29 ÷ 600 ≈ 0.00049 radian
step: at mid-span of an 8 m beam heated at its centre: correction ≈ 0.00049 × 8,000 ÷ 4 ≈ 1 mm
```

A correction of about a millimetre per heat on an 8 m girder means that a girder bowed by 5 mm needs several heats, spaced along its length, each allowed to cool before the next is judged. Straighteners work in steps: heat, cool, measure, heat again, creeping up on straight rather than trying to do it in one large heat, which risks overshooting and overheating the steel. The model is useful for planning how many heats a job needs and for quoting the time, but the first heat on any new kind of member is the real calibration, and the straightener adjusts the rest from what it achieved.

## Heat patterns for different distortions

Different distortions need different patterns of heat.

```figure
type: compare
title: Heat straightening patterns
cols: Pattern | Used for
caption: General descriptions. Each heat is applied quickly to a small area, allowed to cool, and the result measured before the next.
- *Vee heat or triangle | wedge on the web or flange, base at the long edge | bow and sweep in beams and girders
- Line heat | narrow line across the plate, on the convex side | angular distortion at welds; flange tilt
- Spot heat | small circular spots | buckled thin plate; local bulges
- Edge heat | strip along the edge of a plate | curvature of plates in their own plane
```

Flange tilt from fillet welds (Chapter 4) is corrected with a line heat along the outer face of the flange, over the web, which shortens the outer face and pulls the flange edges back down. Buckled thin panels (Chapter 5) are corrected with spot heats on the bulges, each shrinking the panel locally, a technique panel beaters have used for generations.

## Temperature limits

Heat straightening must not overheat the steel. Heating a structural steel too hot can coarsen its grain, reduce its toughness and, in some steels, alter its strength. Quenched and tempered steels, whose strength comes from heat treatment, can lose that strength if heated above their tempering temperature, and some must not be heat straightened at all. Stainless steels can lose corrosion resistance or discolour. The steel maker's guidance and the applicable standards set the maximum temperature for each steel, and straighteners measure it with temperature-indicating crayons or contact thermometers, never by eye alone; the colour of hot steel is a poor guide in a bright workshop.

Quenching a heated spot with water to speed cooling can harden some steels and crack them, as the hammer mill spindle in Machine Part Repairs by the Numbers showed. The shop's procedure allows air cooling, or a gentle water mist only after the steel has fallen below a temperature set for each steel, and forbids quenching on any hardenable or quenched and tempered steel.

## Where to place the heats

The correction a heat gives at mid-span depends on where along the member it is placed. A heat at mid-span of a simply supported beam rotates the two halves about the centre and gives the most correction there; a heat near an end gives less at mid-span, though it straightens the curve locally. Straighteners therefore look at the shape of the distortion, not only its maximum: a smooth, even bow is corrected with heats spread along the member in proportion to its curvature, while a sharp kink, such as one caused by a heavy stiffener weld, is corrected with heats close to the kink. Heats placed where the member is already straight add new distortion.

## Depth of heating

Heats must go through the thickness evenly. A heat that only warms the surface of a thick flange upsets the surface but not the core, and the flange bends across its thickness rather than shortening along its edge, adding angular distortion. Straighteners use a torch large enough to heat the full thickness quickly, moving it to bring the whole area up to temperature together, and for thick plates may heat from both sides at once. Thin plate heats through easily, but overheats easily too, so small, fast heats are used.

## Heat straightening stainless steel and aluminium

Stainless steels can be heat straightened, but their low conductivity concentrates heat, their high expansion makes each heat more powerful, and their surface discolours, which may need removing for corrosion resistance or appearance. Small heats and careful temperature control are essential. Aluminium alloys conduct heat so well that heats spread quickly, and many aluminium alloys lose strength when heated, so heat straightening of aluminium is limited and must follow the alloy maker's guidance; mechanical straightening is often preferred.

## Straightening and residual stress

Straightening redistributes residual stress rather than removing it. A heat-straightened member carries new tensile stresses where each heat was and compression elsewhere; a mechanically straightened member carries stresses from the local yielding. For most structural members, this is acceptable. For members that will be machined, fatigue loaded, or used where stress corrosion is a risk, the straightened state may need stress relief, or the straightening may need to be done before final machining, so that any movement the stresses cause happens before the precise surfaces are cut.

## Mechanical straightening

Presses, jacks and rollers straighten by bending the member past straight so that it springs back true, as Machine Part Repairs by the Numbers explains for shafts. Mechanical straightening is fast and puts no heat into the steel, but it needs equipment big enough for the member, can mark or dent the surface, and leaves the straightened region with residual stresses of its own. It suits members that fit in a press or can be jacked against a stiff frame, and steels whose properties heat would harm. For large girders, a combination is common: jacks apply a modest force that holds the member partly corrected while heat triangles are applied, so that each heat achieves more.

## Restraint while heat straightening

A small force applied while heat straightening helps the heat do its work. A jack pushing the bowed member gently towards straight while a heat triangle is applied puts the heated area in extra compression, so that it upsets more and the correction per heat increases. The force must be small enough that the member stays elastic outside the heated area, or the jack becomes a mechanical straightener with the heat as an aid, and large enough to matter; experienced straighteners judge it by the member's response. The shop's straightener uses a calibrated jack and records the force with each heat.

## Measuring as you go

Straightening without measurement is guesswork. The member is supported so its own weight does not distort the reading, a string line or laser gives the bow at several points, and each heat is recorded with its position and the bow before and after. The record lets the straightener learn how much each heat achieves on that kind of member and stop before overshooting, and it gives the shop a basis for deciding whether straightening or a change of welding procedure is the better investment.

## Who straightens

Heat straightening is a trade skill, learned by practice under supervision, and the shop restricts it to people trained in its procedure. The straightener needs to read the distortion, plan the heats, control the torch and the temperature, judge the effect of each heat and know when to stop. The shop trained two of its welders, using scrap girders and plates with deliberately welded distortion, measuring each heat's effect until their corrections were consistent with the model. They now do all its straightening, and they also advise the welders on sequence, because they see the consequences of every welding shortcut.

## Safety in straightening

Heat straightening uses oxy-fuel torches with large heating tips, often for long periods, and the hazards of Industrial Gases by the Numbers and Oxy-Fuel by the Numbers apply: gas supply, flashback protection, fire and burns. Heated members stay hot for a long time and look cold; jacks and presses store energy that can release suddenly if a member slips. The shop's procedure marks the straightening area, keeps combustibles away, requires the member to be supported securely before any force is applied, and keeps people out of the line of any jack or press while it is loaded.

## The cost of straightening

Straightening is slow, skilled and expensive. This is an illustration. Before the shop changed its girder procedure, straightening averaged about three hours per girder; at A$130 an hour and 40 girders a year, about A$15,600 a year, plus the risk of overheating a girder or missing a delivery. Chapter 8 showed that the fixture and sequence changes paid for themselves on that saving alone. Straightening is the correction of last resort, and its cost is the strongest argument for controlling distortion during welding.

## The running case: the stiffened beams

This is an illustration. The platform beams of Chapter 3, which came out with about 15 mm of sideways sweep over 9 m, were heat straightened with vee heats on the flanges on the convex side, each with a 100 mm base on a 200 mm wide flange. Using the model above with the flange width as the depth, each heat gave a correction of roughly 3 mm at mid-span, and about five heats spaced along each beam brought the sweep within the erection tolerance. The straightener's records matched the model's prediction within about a third, close enough to plan the work and quote for it.

## A failure: the overheated flange

This is an illustration. An inexperienced straightener, trying to finish a bowed girder quickly, made one large heat on its bottom flange, heating it to a bright orange well above the steel's limit, and cooled it with water. The girder overshot, bowing the other way, and the flange's toughness, tested later on a sample cut from a similar heat, was found to be reduced.

The girder was rejected and replaced. The shop's procedure was rewritten: maximum temperature by crayon for each steel, small heats only, air cooling, measurement after each heat, and straightening done only by trained people. The cost of one rejected girder bought the procedure, and nobody has overheated a flange since.

## Exercise: heats for a sweep

A 6 m beam with a 150 mm wide flange has a sweep of 6 mm. Using the model in this chapter, with the flange width as the section depth and 100 mm triangle bases heated to 600 °C, estimate the correction per heat at mid-span and the number of heats needed.

Each heat shortens the flange edge by about 0.29 mm (as calculated), giving a rotation of about 0.29 ÷ 150 ≈ 0.0019 radian across the flange width. At mid-span of a 6 m beam, that gives a correction of about 0.0019 × 6,000 ÷ 4 ≈ **2.9 mm** per heat at the centre.

About **two heats** would correct the 6 mm sweep in theory; in practice, the straightener would make one heat at mid-span, let it cool, measure, and then decide where to place the second, perhaps splitting it into two smaller heats either side of centre to avoid overshooting, because heats away from mid-span give less correction there.
