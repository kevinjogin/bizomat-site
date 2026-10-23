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

## Turning the backlash range into span limits

Chapter 6 worked an illustrative tolerance in which each tooth is thinned by between 0.05 mm and 0.10 mm at the pitch circle. Because a thickness reduction Δs reduces the span by Δs × cos α, the span limits follow directly:

- **Pinion, span over 3 teeth:** upper limit 22.981 − 0.047 ≈ **22.934 mm**, lower limit 22.981 − 0.094 ≈ **22.887 mm**
- **Gear, span over 7 teeth:** upper limit 60.088 − 0.047 ≈ **60.041 mm**, lower limit 60.088 − 0.094 ≈ **59.994 mm**

The upper limit, the thickest permitted tooth, sets the minimum backlash; the lower limit sets the maximum. Written on the drawing as, for example, "span over 3 teeth 22.887 to 22.934 mm", it gives the gear cutter a target and the inspector a pass or fail test that ties straight back to the backlash calculation.

```figure
type: range
title: Pinion span tolerance band
unit: mm
min: 22.86
max: 23
ticks: 22.887 | 22.934 | 22.981
caption: Span over 3 teeth. The band sits below the theoretical 22.981 mm because the teeth are thinned for backlash.
- *Permitted span | 22.887 | 22.934
- Theoretical span, no thinning | 22.978 | 22.984
```

## Checking that the anvils touch where they should

A span measurement is only valid if both anvils touch the flanks on their involute portion, between the base circle and the tip. The span line is tangent to the base circle, so the anvils touch the teeth at a radius of:

**r = √(r_b² + (W / 2)²)**

For the pinion, with r_b ≈ 28.191 mm and W ≈ 22.934 mm, the contact radius is about **30.43 mm**, comfortably between the base radius of 28.191 mm and the tip radius of 33 mm, and close to the 30 mm pitch radius. For the gear, with r_b ≈ 84.572 mm and W ≈ 60.041 mm, it is about **89.74 mm**, again close to the 90 mm pitch radius.

If the calculated contact radius falls too close to the tip, or below the base circle, the chosen number of teeth spanned is wrong for that gear, often because of a large profile shift, and k should be changed. The anvils must also be wide enough to reach across the face without touching the tip edges, and the face must be wide enough for the anvils, which matters on narrow helical gears.

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

## Extra data for a helical gear

A helical gear's data block needs everything a spur gear's does, plus the items that define the helix. For the 15° version of the conveyor pinion from Chapter 7, that means stating the **normal module** of 3 mm and the **normal pressure angle** of 20°, the **helix angle** of 15° at the pitch diameter, the **hand** of the helix, and, usefully, the transverse module of about 3.1058 mm and the pitch diameter of about 62.117 mm as reference values. Some drawings also give the lead, about 728.3 mm for this pinion, because hobbing and grinding machine operators set up from it.

Span measurement still works on helical gears, measured in the normal plane, but the calculation differs from the spur formula, and the face must be wide enough for both anvils to touch the flanks within it. On narrow helical gears that condition can fail, and a measurement over pins or balls is used instead. The supplier references cited for this book give both calculations.

## Accuracy grades in practice

A gear's accuracy grade limits how far its real teeth may depart from perfect geometry. ISO 1328-1 sets tolerance classes for the flanks, with smaller numbers meaning tighter tolerances, and ISO 1328-2 covers radial measurements such as runout. The main quantities are:

- **Single pitch deviation:** the error in spacing between neighbouring teeth.
- **Cumulative pitch deviation:** how spacing errors add up around the gear, which shows as once-per-revolution variation.
- **Profile deviation:** how far each flank departs from the intended involute.
- **Helix deviation:** how far each flank departs from the intended line along the face, straight for spur gears.
- **Runout:** how far the teeth are eccentric to the gear's datum axis.

Choosing a grade is a balance between cost and duty. Faster, quieter and more heavily loaded gears justify tighter grades; the dynamic factors in modern rating methods reward better accuracy with lower dynamic loads, as Chapter 8 noted. A slow conveyor drive can use a moderate grade. The drawing must state the standard and its edition with the grade, because grade numbers have changed between editions.

## What a gear inspection report shows

A gear measured on a gear measuring machine comes with a report that is worth reading rather than filing. It typically contains:

- **profile and helix traces** for several teeth on both flanks, plotted against tolerance bands;
- **pitch charts** showing single and cumulative pitch deviations around the gear;
- **runout** measured with a probe in each tooth space;
- **tooth thickness**, as a span or over-pins value;
- the **accuracy grade achieved** for each quantity, against the grade specified.

The traces carry more than a pass or fail. A profile trace that falls away near the tip may show intended tip relief or a worn tool; a helix trace that slopes steadily across the face shows a helix angle error, which in service will push load towards one end. Comparing the report with the contact pattern found at assembly, as described in Chapter 4, often explains a noisy or hot-running pair before it fails.

## Receiving inspection without a gear measuring machine

Many workshops do not have a gear measuring machine. A practical receiving inspection can still catch most errors that matter:

1. **Count the teeth** and confirm the hand of helix where relevant.
2. **Measure the tip and root diameters** and compare them with the data block.
3. **Measure the span** at three or four positions around the gear, and check that every reading lies within the limits.
4. **Check runout** between centres or on the bore datum, with a ball probe placed in each tooth space in turn, or by rolling the gear against a master gear where one is available.
5. **Inspect the teeth visually** for burrs, nicks, cracks and grinding marks, particularly at the root fillets.
6. **Check hardness** where the drawing specifies it, on a surface that will not be harmed by the test.

Rolling the new gear with its mate on a simple test stand and checking the contact pattern with marking compound adds a final functional check. Recording these results with the gear's serial or batch number gives the same kind of evidence that a full inspection report provides, at a scale that suits the job.

## Keeping the gear's record

The drawing defines the gear; the records show what was actually made and fitted. For a gear that matters, keep together the drawing at its issued revision, the inspection report or receiving inspection results, the measured spans, the backlash measured at assembly with the positions used, and a photograph of the contact pattern. Years later, when the gear is worn or a replacement is needed, that small file answers the questions a replacement supplier will ask, and it lets wear be measured against a known starting point rather than guessed.

## What to send a gear supplier

A gear supplier can only make what it is told. Sending a worn sample and asking for "one the same" invites guesses about module, shift, tooth thickness, material and accuracy. A useful enquiry includes the drawing with its data block, the mating gear's data, the centre distance and its tolerance, and the duty: power, speeds, hours of operation and the character of the driven machine. With that information, the supplier can confirm the design, propose a rating check, and quote for a gear that will fit and last. Without it, the supplier is reverse engineering, and the purchaser carries the risk.

## Bringing the book together

The conveyor pair has now been followed from requirement to drawing: a 3:1 ratio from 20 and 60 teeth, module 3 mm and 20° involute teeth, pitch diameters of 60 and 180 mm, a 120 mm centre distance and a contact ratio of about 1.67. Backlash comes from controlled tooth thinning and a positive centre distance tolerance, checked against thermal closure. Screening gave a pinion root bending stress of about 40 MPa and a contact stress of about 441 MPa, to be confirmed by a recognised rating. Span measurements of about 22.934 mm and 60.041 mm tie the drawing to the workshop.

Each number on the drawing traces back to a decision made earlier in the book. That traceability is what lets the next person maintain, measure or replace the gear with confidence.

## Final exercise: specify the gear

Write the data block for the 60-tooth gear, following the pinion example, and calculate its span target with the same 0.05 mm thinning.

A complete answer lists module 3 mm, 60 teeth, 20° pressure angle, spur, profile shift 0, pitch 180 mm, tip 186 mm, root 172.5 mm, span over 7 teeth with a target of about **60.041 mm** and a tolerance, an accuracy grade, mating with the 20-tooth pinion at 120 mm centres, and material and heat treatment. It should also state the face width of 30 mm and whether any tip relief or lead modification applies.
