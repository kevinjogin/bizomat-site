---
book: gears-by-the-numbers
chapterSlug: measuring-and-specifying-a-gear
order: 10
title: "Measuring and specifying a gear"
description: "Check tooth thickness with span measurement, identify an unknown gear from its tooth count and diameter, and write the data a gear drawing needs."
draft: false
---

A gear drawing that shows only an outline and a bore is not a gear drawing. The teeth, which do all the work, are defined by a handful of numbers that a toolmaker, inspector or replacement supplier must be able to read without guessing. And once a gear is made, someone has to confirm that its teeth are the thickness the design intended, because that thickness sets the backlash.

This final chapter brings the conveyor pair together into a specification and a measurement plan.

## Measuring tooth thickness with span

Tooth thickness at the pitch circle cannot be measured directly with ordinary instruments. The standard workshop method is the **span measurement**: the distance across a number of teeth, measured with disc-type micrometer anvils that touch the flanks on their involute portions. Because both anvils touch involute surfaces, the measurement equals a whole number of base pitches plus the base tooth thickness, which is why it does not depend on the gear's outside diameter or runout.

For a spur gear without profile shift, the theoretical span over k teeth is:

**W_k = m × cos α × [π × (k − 0.5) + z × inv α]**

The number of teeth to span is chosen so the anvils touch near the middle of the tooth flanks. A common estimate for 20° gears is:

**k ≈ z × α / 180° + 0.5, rounded to the nearest whole number**

For the 20-tooth pinion, k ≈ 20 × 20 / 180 + 0.5 ≈ 2.72, so **k = 3**:

**W₃ = 3 × 0.939693 × [π × 2.5 + 20 × 0.014904] ≈ 2.81908 × 8.15207 ≈ 22.981 mm**

For the 60-tooth gear, k ≈ 7.17, so **k = 7**:

**W₇ = 2.81908 × [π × 6.5 + 60 × 0.014904] ≈ 2.81908 × 21.31462 ≈ 60.088 mm**

These are theoretical values for teeth with no backlash allowance. Chapter 6 thinned each tooth by 0.05 mm at the pitch circle. A reduction Δs in tooth thickness reduces the span by Δs × cos α, here about 0.047 mm, so the target spans become about **22.934 mm** for the pinion and **60.041 mm** for the gear, each with a tolerance band derived from the backlash range.

```figure
type: compare
title: Span measurement targets for the conveyor pair
cols: Pinion, 20 teeth | Gear, 60 teeth
caption: Module 3 mm, 20° pressure angle, no profile shift. Targets include a 0.05 mm tooth thickness reduction.
- Teeth spanned, k | 3 | 7
- Theoretical span | 22.981 mm | 60.088 mm
- *Target span, thinned teeth | 22.934 mm | 60.041 mm
```

Measurement over pins or balls is the alternative, placing precise pins in opposite tooth spaces and measuring across them. It suits internal gears and fine-pitch gears where span anvils will not fit. Supplier references, such as KHK's technical notes cited for this book, give the method and the calculation of the nominal value.

## Identifying an unknown gear

Replacing a worn gear from an unknown source starts with measurement. Count the teeth and measure the outside diameter carefully, then test both systems:

**module ≈ d_a / (z + 2)** for an unshifted standard gear, and **diametral pitch ≈ (z + 2) / d_a in inches**.

Suppose a gear has 25 teeth and an outside diameter of 85.7 mm. As a metric gear, its module would be 85.7 / 27 ≈ 3.174 mm, which is not a standard module. As an inch gear with 8 diametral pitch, its outside diameter would be 27 / 8 = 3.375 inches, or about 85.72 mm, a near-perfect match. A module 3 gear with 25 teeth would measure 81 mm. The gear is almost certainly 8 diametral pitch.

Profile shift, worn tips and non-standard proportions can all disturb this test, so confirm with a span or pin measurement and, where possible, a check against the mating gear before ordering a replacement.

## What the drawing must state

A gear's data block, usually a table beside the drawing, should include at least:

- module, or normal module and helix angle with hand for helical gears;
- number of teeth;
- pressure angle and reference to the basic rack or tooth system;
- profile shift coefficient, even when it is zero;
- pitch, tip and root diameters;
- tooth thickness, specified as a span over k teeth or a measurement over pins, with tolerance;
- accuracy grade to a stated standard, such as ISO 1328;
- the mating gear's part number and tooth number, and the centre distance with tolerance;
- material, heat treatment, surface hardness and case depth where relevant;
- face width and any profile or lead modifications.

```figure
type: checklist
title: Gear data block for the conveyor pinion
caption: Enough for a gear cutter, an inspector and a future replacement supplier to work without guessing.
- x Module 3 mm, 20 teeth, 20° pressure angle, spur
- x Profile shift coefficient 0
- x Pitch 60 mm, tip 66 mm, root 52.5 mm
- x Span over 3 teeth, target 22.934 mm, with tolerance
- x Accuracy grade to the stated standard
- x Mates with the 60-tooth gear at 120 mm centres
- *x Material, heat treatment and hardness specified
```

## Bringing the book together

The conveyor pair has now been followed from requirement to drawing: a 3:1 ratio from 20 and 60 teeth, module 3 mm and 20° involute teeth, pitch diameters of 60 and 180 mm, a 120 mm centre distance and a contact ratio of about 1.67. Backlash comes from controlled tooth thinning and a positive centre distance tolerance, checked against thermal closure. Screening gave a pinion root bending stress of about 40 MPa and a contact stress of about 441 MPa, to be confirmed by a recognised rating. Span measurements of about 22.934 mm and 60.041 mm tie the drawing to the workshop.

Each number on the drawing traces back to a decision made earlier in the book. That traceability is what lets the next person maintain, measure or replace the gear with confidence.

## Final exercise: specify the gear

Write the data block for the 60-tooth gear, following the pinion example, and calculate its span target with the same 0.05 mm thinning.

A complete answer lists module 3 mm, 60 teeth, 20° pressure angle, spur, profile shift 0, pitch 180 mm, tip 186 mm, root 172.5 mm, span over 7 teeth with a target of about **60.041 mm** and a tolerance, an accuracy grade, mating with the 20-tooth pinion at 120 mm centres, and material and heat treatment. It should also state the face width of 30 mm and whether any tip relief or lead modification applies.
