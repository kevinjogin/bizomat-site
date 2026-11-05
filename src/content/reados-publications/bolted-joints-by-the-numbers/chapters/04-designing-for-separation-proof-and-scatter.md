---
book: bolted-joints-by-the-numbers
chapterSlug: designing-for-separation-proof-and-scatter
order: 4
title: "Designing a tension joint for separation, proof load and scatter"
description: "How to choose a target preload that survives its own scatter: separation at the lowest preload, proof load at the highest, fatigue, and why 75% of proof can be too much."
draft: false
---

Chapter 1 showed how a joint behaves at one preload. Chapters 2 and 3 showed that no tightening method delivers one preload: torque gives a band about ± 25% wide, torque-angle a band about ± 5% wide. A joint design has to work across the whole band. The lowest preload the method can give must still keep the joint from separating under the highest external load. The highest preload, plus the bolt's share of the external load, must stay below the bolt's proof strength. And the bolt must survive the cyclic load in fatigue.

This chapter puts those three checks together with the BIZOMAT bolted joint design check, which builds the preload scatter in, and uses it to choose the CT-1 test head's target preload and tightening method. Its mistake is a rule of thumb, 75% of proof, applied with a tightening method too loose to support it.

## Three limits on preload

The three checks pull the target preload in different directions.

```figure
type: formula
title: The three checks of a preloaded tension joint
formula: Separation: n sep = Fi min ÷ ((1 − C) P)
formula: Proof: n proof = (Sp At − Fi max) ÷ (C P)
formula: Fatigue (Goodman): n f = Se (Sut − σi) ÷ (σa (Sut + Se)),  σa = C P ÷ (2 At),  σi = Fi max ÷ At
caption: Fi min and Fi max are the lowest and highest preloads the tightening method can give. For torque tightening with a nut factor scatter of ± s, they are Fi ÷ (1 + s) and Fi ÷ (1 − s), because the torque is fixed and the nut factor varies. P is the external load cycling from zero to its working value.
- n sep | factor against separation
- n proof | factor against exceeding proof load
- n f | fatigue factor
```

Separation wants more preload. Proof load wants less, or at least a narrower band, because the highest preload must leave room for the bolt's share of the external load. Fatigue, in this form of the Goodman check, also prefers less preload, because the mean stress rises with it, though Chapter 5 shows why that preference should not be taken too far.

The way the scatter enters is worth noticing. The torque is set for the nominal preload with the mean nut factor. A bolt whose nut factor is 25% above the mean gets Fi ÷ 1.25, 20% less preload; one whose nut factor is 25% below gets Fi ÷ 0.75, 33% more. The band is lopsided, and its top end is the one that threatens proof.

## The design check tool

The [bolted joint design check](/tools/bolted-joint-design-check/) takes the bolt's diameter, pitch, proof, tensile and endurance strengths and modulus, the grip and threaded length and the members' modulus, the target preload as a share of proof, the nut factor and its scatter, the working tension load per bolt and a required factor for separation and fatigue. It returns the stress area, the joint constant, the nominal preload and its range from the scatter, the tightening torque, and the factors against separation at the lowest preload, against proof load at the highest, and against fatigue under a load cycling from zero to the working value. It checks a concentric tension joint, and flags a scatter above 25% as a reason to consider angle or tension control.

The shop requires a factor of 1.5 against separation and in fatigue, and at least 1 against proof. This is an illustration. The fully corrected endurance strength for a rolled-thread class 10.9 bolt is 162 MPa in Shigley's tables, and its tensile strength 1,040 MPa.

## The mistake: 75% of proof, by torque

The shop's general engineering standard, inherited from a previous employer, said: preload bolts to 75% of their proof load. It is a common rule, and textbooks give it for reusable connections. The first design for the test head followed it, with torque tightening at a nut factor of 0.20 and the shop's usual allowance of ± 25% scatter.

```figure
type: steps
title: The test head joint in the design check, 75% of proof by torque
caption: This is an illustration. M20 × 2.5 class 10.9 (proof 830, tensile 1,040, endurance 162 MPa), grip 64 mm with 16 mm threaded, steel 207 GPa, 75% of proof, K = 0.20 ± 25%, working load 38.35 kN per screw, required factor 1.5.
- Joint constant | 0.2006
- Nominal preload / torque | 152.38 kN / 609.5 N·m
- Preload range | 121.91 to 203.18 kN
- Factor against separation | 3.98
- * Factor against proof load | 0.00: the highest preload is the proof load
- Fatigue factor | 1.80: JOINT DESIGN NOT ADEQUATE
```

The top of the scatter band, 152.38 ÷ 0.75 = 203.18 kN, is exactly the screw's proof load. A screw that happened to have the lowest expected nut factor would reach proof during tightening, before the chamber was pressurised at all, and the first pressure cycle would take it beyond. Some of the screws in a set of eight would be close to that. The rule of 75% assumes a tightening method that controls preload better than torque with a ± 25% scatter does.

### Where the 75% rule comes from

Shigley's suggests preloads of about 75% of proof load for connections that will be taken apart and reused, and about 90% for permanent ones. The figures make sense for joints whose preload is known: high preload keeps joints shut and protects bolts in fatigue, and a bolt at 75% of proof still has room for its share of the external load. What the rule cannot do is make torque tightening accurate. A target is only as good as the method that delivers it, and the scatter decides how close to proof the target may sit. The shop's standard now reads: choose the target preload from the design check with the tightening method's scatter, and do not exceed 75% of proof for reusable screws.

### What if the nut factor is wrong?

The scatter allowance covers bolt-to-bolt variation around a known mean. It does not cover a mean that is wrong. If the screws were actually running at a mean nut factor of 0.17, because a lighter oil had been used, the torque set for 0.20 and 70% of proof would give a nominal preload of 142.2 × 0.20 ÷ 0.17 = 167.3 kN, 82% of proof, and the top of the band would be 167.3 ÷ 0.75 = 223 kN, well past proof. Entering 82% in the design check shows the proof factor going negative. The check is only as good as its nut factor, which is why Chapter 2's sample measurement, with the production lubricant, comes before the design check, not after.

## Two ways out

There are two ways to make the joint pass: lower the target, or narrow the band.

```figure
type: compare
title: The test head joint under four tightening choices
cols: Preload range, kN | Separation | Proof | Fatigue | Verdict
rowhead: Target and method
- 75% of proof, torque ± 25% | 121.9 to 203.2 | 3.98 | 0.00 | 1.80 | Not adequate
- 70% of proof, torque ± 25% | 113.8 to 189.6 | 3.71 | 1.76 | 2.28 | Adequate
- 75% of proof, torque-angle ± 5% | 145.1 to 160.4 | 4.73 | 5.56 | 3.30 | Adequate
- * 70% of proof, torque-angle ± 5% | 135.5 to 149.7 | 4.42 | 6.95 | 3.67 | Adequate, chosen
caption: This is an illustration. Working load 38.35 kN per screw (25 MPa). The torque-angle method of Chapter 3 is represented in the tool by a scatter of ± 5%. Every option except the first passes; the narrower band gives large margins on all three checks.
```

Lowering the target to 70% with plain torque passes, with a proof factor of 1.76 and a fatigue factor of 2.28. Keeping 75% with torque-angle passes with much larger margins. The shop chose 70% with torque-angle tightening. The narrower band is worth having on a joint that cycles millions of times and is taken apart for every chamber service, and the lower target leaves the screws further from proof each time they are reused.

### At the proof test

The chamber's proof test at 31.5 MPa puts 48.32 kN on each screw. It is a static load, applied a few times in the rig's life, but the separation and proof checks apply to it. With 70% of proof and torque-angle tightening, the tool gives a separation factor of 3.51 and a proof factor of 5.52 at 48.32 kN. With 70% by plain torque they would have been 2.95 and 1.40. Either passes; the chosen method passes comfortably.

## Why separation needs a margin

A factor of 1.5 against separation is not generous. The model assumes the load is concentric and the members are flat and stiff. In practice, a head under pressure bows slightly between screws, the load on the screws is not perfectly even, embedding loses a few per cent of preload, and the O-ring adds its own small opening force. A joint that separates even briefly under each cycle lets the seal creep and the screws see the full external load. The shop's factor of 1.5, applied at the lowest preload, covers those effects for a steel joint of this kind. For a gasketed joint, Chapter 9 uses the gasket maker's figures instead. The margin also lets the shop accept a screw whose verified preload sits at the low end of Chapter 3's ± 10% acceptance band without taking the head apart, because even 10% below the lowest torque-angle preload the separation factor at the proof test stays above 3.

## Choosing the required factors

The shop's factors of 1.5 against separation and in fatigue, and 1 against proof, are its own. This is an illustration. They are applied after the preload scatter has been taken into account, so they cover the uncertainties the tool does not model: the load, the material strengths, the joint constant, and the effects listed below. A factor applied to the nominal preload would have to be much larger to give the same protection, because it would also have to cover the scatter.

For joints whose failure would be dangerous, such as those on pressure equipment, lifting equipment and structures, the required factors and the method of calculation come from the applicable code, not from a shop standard. The CT-1's test chamber is a piece of pressure equipment in its own right, and the rig's designer checked its design against the relevant pressure equipment requirements, with the test head joint as one part of that work.

## Uneven loads around a bolt circle

The design check divides the external load equally among the bolts. Around the test head that is reasonable: the pressure acts evenly on a circular head and the eight screws are equally spaced. It is less reasonable for a rectangular cover, where screws near the middle of a long side carry more than screws in the corners, or for a joint with an external bending moment as well as a tension, where the screws on the tension side carry more. In those cases the most heavily loaded bolt is checked with its own share of the load, found from the joint's geometry or, for brackets, by the methods of Chapter 8.

## A smaller screw?

With the test head passing so comfortably, a designer asked whether M16 screws would do, saving weight and making the tapped holes easier to cut. The design check, with M16 × 2 class 10.9, a 62 mm grip with 14 mm threaded and torque tightening at 70%, gives a separation factor of 2.32, a proof factor of 1.24 and a fatigue factor of 1.60.

```figure
type: bars
title: Design check factors, M16 against M20, 70% of proof by torque
x: Check
y: Factor
caption: This is an illustration. Both pass the shop's required factors at 25 MPa. The M20 has much more margin, which the rig's proof test, reuse of the screws and uncertain friction in its tapped holes all use up.
- M16, separation | 2.32
- * M20, separation | 3.71
- M16, proof | 1.24
- * M20, proof | 1.76
- M16, fatigue | 1.60
- * M20, fatigue | 2.28
```

The M16 passes at 25 MPa, but at the 31.5 MPa proof test its separation and proof margins shrink further, and its factors leave little for the uncertainty of a tapped hole that has been retapped after damage. The shop kept the M20s.

## Every load case, not just the working one

A joint is checked for every load it will see, not only the one it was designed for. The test head sees four. At assembly there is no pressure, and the only question is whether the highest preload stays below proof, which the narrow torque-angle band answers easily. In endurance testing the pressure cycles from zero to 25 MPa millions of times, and all three checks apply. At the proof test the pressure reaches 31.5 MPa a few times, statically, and separation and proof apply. And if the test pump's relief valve, set at 28 MPa, ever lets the chamber rise to its setting during a cycle, each screw sees 42.95 kN; at the lowest torque-angle preload the separation factor is still 3.94, and the proof factor 6.21.

Writing the load cases down before the calculation is half the value of the exercise. The other half is noticing which case governs each check: here, the proof test governs separation and proof, and endurance cycling governs fatigue.

## What the design check does not cover

The design check assumes the external load is shared equally by the bolts and applied concentrically. It does not include prying, where a flexible flange levers against its edge and adds to the bolt load; bending of the bolt from a tilting head; the loss of preload from embedding and relaxation; or temperature, which Chapter 10 handles. For the test head, the 50 mm steel head is thick enough that prying is small, the screws are verified by stretch after tightening, and the rig runs near room temperature. Each of those statements is a judgement the design review records, not a result the tool gives.

```figure
type: checklist
title: Signing off the test head joint
caption: The CT-1 design review's record. This is an illustration.
- x Separation factor at least 1.5 at the lowest preload, at 25 MPa and at the 31.5 MPa proof test
- x Proof factor above 1 at the highest preload
- x Fatigue factor at least 1.5 for 0 to 25 MPa cycling
- x Tightening method's scatter stated and used in the check
- x Prying, bending and embedding judged small for a 50 mm steel head, with stretch verification after assembly
- x Screw reuse limit and inspection set
```

## Exercise: a softer tightening rule

A visiting contractor proposes tightening the test head screws to 65% of proof by plain torque, arguing that lower preload is always safer. Use the design check's relations to find the preload range, torque and the three factors at 25 MPa. Is the contractor right?

### Worked answer

At 65% of the 203.18 kN proof load, the nominal preload is 132.07 kN and the torque 0.20 × 132,070 × 0.020 = 528.3 N·m. With ± 25% scatter the preload ranges from 132.07 ÷ 1.25 = 105.65 kN to 132.07 ÷ 0.75 = 176.09 kN.

Separation: 105.65 ÷ ((1 − 0.2006) × 38.35) = 3.45. Proof: (203.18 − 176.09) ÷ (0.2006 × 38.35) = 3.52. Fatigue: the alternating stress is 0.2006 × 38,350 ÷ (2 × 244.79) = 15.72 MPa, the highest preload stress 176,090 ÷ 244.79 = 719.3 MPa, and n = 162 × (1,040 − 719.3) ÷ (15.72 × 1,202) = 2.75.

The design check gives the same: 3.45, 3.52 and 2.75, all passing. On these numbers the contractor's rule works, but the separation factor is lower than with the chosen method, and lower preload makes the joint more sensitive to everything the check leaves out: embedding, prying, uneven loading and loosening under vibration. Lower preload is not always safer. The chosen method, 70% with torque-angle, beats 65% by torque on every one of the three factors at once.
