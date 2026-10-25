---
book: testing-welded-joints-by-the-numbers
chapterSlug: tensile-tests-and-joint-efficiency
order: 2
title: "Tensile tests and joint efficiency"
description: "Calculate stress and joint efficiency from a transverse tensile test, read where the specimen broke, and see what Whittemore's 1910 efficiencies of 51 to 82% really meant."
draft: false
---

The tensile test is the oldest and most intuitive weld test. A strip cut across the weld is pulled until it breaks, and the load at fracture, divided by the specimen's cross-section, gives a stress that can be compared with the strength of the plate. If the welded strip is as strong as the plate, the weld has done its job, at least in a straight pull. Whittemore built his 1910 study on this test, and every procedure qualification for butt welds in steel still includes it.

This chapter calculates stress and efficiency from tensile results, explains why where a specimen breaks matters as much as the load, and works through the hopper procedure's tensile tests and Whittemore's results.

## The transverse tensile test

A transverse tensile specimen is cut across a butt weld so that the weld sits in the middle of its length, with parent metal on both sides. The weld reinforcement and root bead are usually machined flush with the plate surfaces, so that the specimen has a uniform cross-section and the test measures the strength of the joint rather than the effect of its profile. ISO 4136 describes the transverse tensile test on welds; the general method of tensile testing metals is in ISO 6892-1. The specimen is pulled in a testing machine until it breaks, and the maximum load is recorded.

The ultimate tensile stress is:

**σ = F ÷ A**

where F is the maximum load and A is the original cross-sectional area of the specimen. Whittemore did exactly this: he computed the stresses by dividing the load from the machine's record by the actual original area at the place where the specimen broke, usually at the weld, measured before the test.

```figure
type: formula
title: Ultimate tensile stress of a hopper procedure specimen
formula: σ = F ÷ A
caption: This is an illustration. The specimen is 12 mm thick, with the weld reinforcement machined flush, and 25 mm wide across its reduced section.
- F | maximum load, 141.0 kN
- A | original area, 12 × 25 = 300 mm²
step: σ = 141,000 N ÷ 300 mm²
step: σ = 470 MPa
```

## Joint efficiency

Whittemore expressed each result as an efficiency:

**efficiency = ultimate stress of the welded specimen ÷ ultimate stress of the unwelded plate**

using the average of unwelded specimens cut from the same plate. An efficiency of 100% means the welded specimen was as strong as the plate; 70% means it broke at 70% of the plate's strength.

This is an illustration. The hopper plate's own tensile specimens, cut from the same plate as the qualification weld, averaged 480 MPa. The welded specimen's 470 MPa gives an efficiency of 470 ÷ 480 ≈ **97.9%**.

## Efficiency in design

The word efficiency also appears in design codes, with a related but different meaning. Some pressure vessel and piping codes apply a joint efficiency factor to the allowable stress in welded seams, depending on the type of joint and how much of it is examined by radiography or ultrasonics. There, efficiency is a design allowance that reflects confidence in the weld, not a measured ratio of strengths. The two meanings should not be confused: a test showing 98% efficiency does not entitle a designer to use 98% in a code calculation, and a code's factor does not describe how strong any particular weld is. The READOS chapter on [pressure vessels and thin-walled cylinders](/reados/collections/machine-elements-and-mechanical-design/pressure-vessels-and-thin-walled-cylinders/) discusses joint efficiency in that design sense.

## Where it broke matters

The efficiency calculated from a specimen that breaks in the parent metal is not the strength of the weld. It is the strength of the parent plate at the place it broke, which happened to be beside the weld. The weld was at least that strong, possibly much stronger. Modern weld metals are usually designed to be slightly stronger than the plates they join, called overmatching, so that a transverse specimen of a sound weld breaks in the parent, away from the weld. A break in the parent at a stress close to the plate's strength is therefore the result a sound procedure should produce.

A break in the weld or along the fusion line means something different. It means the weld or its edge was the weakest part of the specimen, and the fracture face should be examined to find out why. It may show lack of fusion, porosity, slag or a crack, any of which would explain a low result; or it may show sound, ductile metal that is simply weaker than the plate, which points to the consumable or the heat input.

```figure
type: decision
title: Reading a transverse tensile result
question: Where did the specimen break, and at what stress?
caption: The location of the fracture and the fracture face are as important as the load. The acceptance criteria are those of the standard or specification being applied.
- *In the parent, at or above the required strength | the weld was at least as strong as the plate tested | record and accept against the criteria
- In the weld, sound fracture face, at or above the requirement | weld metal undermatched but adequate | check the criteria; review consumable choice
- In the weld or fusion line, defects on the face | the weld contained an imperfection | reject; investigate the procedure and technique
- Anywhere, below the requirement | the joint did not reach the required strength | reject; find the cause before retesting
```

## The hopper procedure's tensile tests

This is an illustration. The hopper procedure qualification plate yielded two transverse tensile specimens. The customer's specification, applying the governing standard, requires each to reach at least the specified minimum tensile strength of the parent plate grade, which the fabricator's specification records as 430 MPa for the purposes of this example.

| Specimen | Maximum load | Area | Stress | Fracture location | Efficiency (plate 480 MPa) |
|---|---|---|---|---|---|
| T1 | 141.0 kN | 300 mm² | 470 MPa | parent, 35 mm from weld | 97.9% |
| T2 | 138.6 kN | 300 mm² | 462 MPa | parent, 40 mm from weld | 96.3% |

Both broke in the parent above the required strength, the outcome a sound procedure should give. The efficiencies, just under 100%, tell us that the plate near the weld was very slightly weaker than the plate specimens tested separately, which is within the normal variation of plate strength and of the test itself (Chapter 3).

## Whittemore's efficiencies

Whittemore's results looked very different. The averages for his twelve strips were:

```figure
type: bars
title: Average efficiency of each welded strip in Whittemore's 1910 tests
unit: % of unwelded plate strength
max: 100
caption: Averages reported by Whittemore for the twelve strips of his first series. Strip Y's average was inflated by measurement error on its rough surface, as Chapter 3 explains. Most of his specimens broke at the weld.
- Strip A | 69.3
- Strip B | 68.0
- Strip C | 74.3
- Strip D | 64.5
- Strip E | 69.2
- Strip F | 66.8
- Strip U | 54.0
- Strip Y | 82.4
- Strip G | 69.6
- Strip H | 50.6
- Strip R | 76.7
- Strip X | 73.9
```

Most of his specimens broke at the weld, so his efficiencies really were measures of weld strength, unlike the hopper's parent-metal breaks. The typical oxyacetylene weld in his tests carried roughly two-thirds to three-quarters of the plate's strength, with a wide spread.

Why so low? Whittemore's discussion points to the welding of the time: the small areas actually fused in some welds, the difficulty of controlling the flame and the filler, and the fact that the welds were made with the techniques of 1909. His second series of tests explored filler wire, flame regulation, hammering, preheating and thorough fusion, and he recorded the improvement in methods during the work. The bulletin is a record of a process being learnt.

Whittemore also tested unwelded band iron for comparison in a preliminary series. It had an ultimate strength of about 62,300 pounds per square inch, about 430 MPa, a yield point of about 46,400 pounds per square inch, about 320 MPa, and an elongation of about 20% in 4 inches. When welded, all of those properties were lower. That observation, that welding reduced not only strength but ductility, leads to the bend test in Chapter 5.

## The shape of the curve

Whittemore's testing machine, a 100,000-pound Riehle machine, had an autographic attachment that drew the load against the stretch of each specimen as it was tested. The curve tells more than the maximum load. A ductile steel specimen first stretches elastically, in proportion to load; then yields, stretching further with little increase in load; then hardens as it stretches, carrying more load; and finally necks down locally and breaks. The yield stress, the maximum stress and the elongation at fracture can all be read from the curve.

In a transverse weld specimen, the curve is harder to interpret, because the specimen is not one material. The weld metal, the heat-affected zones and the parent metal all have different strengths, and the stretch concentrates in whichever is weakest. If the parent is weakest, it yields and necks while the weld barely deforms; if the weld is weakest, the weld yields while the parent stays elastic. That is why yield strength and elongation are measured on all-weld-metal specimens, and why the transverse test is used mainly for maximum strength and fracture location.

## Details that change the answer

Several details of how a specimen is made and tested change the result, and good laboratories control all of them.

- **Straightness and alignment.** Whittemore noticed a gradual decrease in efficiency as the welding of one strip progressed and attributed it very probably to the specimens not being straight when tested: a bent specimen is loaded partly in bending, which raises the stress on one side and makes it break early. Welded plates distort, and specimens cut from them must be straightened or the bending allowed for.
- **Machining.** The reduced section must be smooth and free of tool marks, because a notch at the surface concentrates stress. Removing the weld reinforcement flush is part of preparing a fair specimen.
- **Loading rate.** Steels show slightly higher strengths at faster loading rates, so test standards set the rate.
- **Calibration.** The testing machine's load measurement must be calibrated. In Australia, laboratories accredited by NATA, the National Association of Testing Authorities, demonstrate calibration and competence, and customers often require accredited test reports for qualification.

## The plate varies too

Efficiency compares the weld with the plate, so it depends on knowing the plate's strength. The mill certificate gives the plate's tested properties, but from a sample taken at the mill, not from the region of the plate beside the weld. Whittemore compared each welded specimen with unwelded specimens from the same plate, which is the fair comparison. The hopper fabricator did the same by cutting plate specimens from the same plate as the qualification weld, and found 480 MPa against the certificate's figure, which differed slightly. Small differences between the certificate, the plate specimens and the parent metal beside the weld are normal, and are one reason a parent-metal break slightly below the plate average is not a concern.

## What the tensile test does not show

A transverse tensile test is a demanding test of strength in one direction, but it has limits.

- It does not measure the weld metal's own yield strength or elongation, because the strain concentrates in whichever part of the specimen is weakest. An all-weld-metal tensile specimen, cut along the weld so that it consists entirely of weld metal, is used when those properties are needed.
- It tests only the specimen's cross-section. A small imperfection elsewhere in the weld, outside the specimen, is not tested.
- It measures static strength. It says nothing about fatigue under repeated loads or about toughness at low temperature, which need other tests (Chapter 7).
- With reinforcement machined flush, it does not test the effect of the weld's profile, which matters greatly in fatigue.

## A failure: the specimen that broke in the weld

This is an illustration. Before the successful qualification, the fabricator's first attempt at the hopper procedure produced one transverse specimen that broke in the weld at 120.3 kN, a stress of 120,300 ÷ 300 ≈ **401 MPa**, below the 430 MPa required and an efficiency of only 401 ÷ 480 ≈ 83.5%. The fracture face showed a smooth band along one side of the weld, about 3 mm deep, without the grey, fibrous texture of ductile metal.

The smooth band was lack of sidewall fusion: the weld metal had lain against the bevel face without melting into it. The welding record showed that the second and third runs on that side had been made with a steeper electrode angle and a faster travel speed than the procedure specified, because the welder had been trying to keep the plate from overheating. The plate failed, the procedure was not qualified, and the fabricator retrained the welder, corrected the technique and welded a new plate, which produced the results in the table above.

The test did its job, and it did it cheaply: one plate and a few specimens cost far less than a hopper seam that failed in service. It found a weakness in the way the procedure was being carried out before any hopper was built with it.

## Exercise: a narrower specimen

A specimen from a 10 mm plate is machined to 19.9 mm wide across its reduced section and breaks in the parent at a maximum load of 95.4 kN. The parent plate's own specimens averaged 485 MPa. Calculate the ultimate tensile stress and the efficiency, and say what the result shows about the weld.

The area is 10 × 19.9 = 199 mm², so the stress is 95,400 ÷ 199 ≈ **479 MPa**. The efficiency is 479 ÷ 485 ≈ **98.8%**.

Because the specimen broke in the parent, the result shows that the plate beside the weld reached 479 MPa and that the weld was at least as strong. It does not measure the weld's own strength. Note that measuring the width to one decimal place matters: if the width had been taken as a nominal 20 mm, the stress would have been calculated as 477 MPa, a difference that Chapter 3 shows is within the uncertainty of the test but worth avoiding.
