---
book: metal-casting-by-the-numbers
chapterSlug: inspecting-and-proving-castings
order: 10
title: "Inspecting and proving castings"
description: "Showing castings meet their specification: Brinell hardness and its validity rules, X-ray and pressure tests, first-article layout, sampling, and a hardness reading taken too near an edge."
draft: false
---

A casting's specification is a promise about things that cannot all be seen. Its hardness, its soundness inside, its pressure tightness and its dimensions all have to be shown, by measurement, to the foundry's own satisfaction and the customer's. Some checks are made on every casting, some on a sample from each melt or each heat-treatment load, and some only on the first castings from a new pattern. Each check has its own rules for being valid, and a check that breaks its rules can reject a good casting or pass a bad one.

This chapter covers the inspection plan for GB-12: the Brinell hardness test with a WORKOS tool and its validity rules, radiography, pressure testing and first-article layout, and how the results are sampled and recorded. Its error is a hardness reading taken too close to the edge of a flange, which nearly scrapped a good load.

## GB-12's inspection plan

This is an illustration. GB-12's specification, agreed between the foundry and the machinery builder, sets out what is checked, how often and against what.

```figure
type: compare
title: GB-12 inspection plan
cols: Method | Frequency | Acceptance
rowhead: Characteristic
- Composition | spectrometer on each melt | foundry's working bands inside the customer's limits (Chapter 3)
- Melt gas | reduced-pressure test on each melt | density index 2% or less (Chapter 8)
- * Hardness after T6 | Brinell, 10 mm ball, 500 kgf, on 3 castings per heat-treatment load | 75 to 95 HBW
- Internal soundness | X-ray of the boss and flange on 2 castings per shift | no porosity worse than the agreed reference images in the boss
- Pressure tightness | air test of every machined cover | no leak at the agreed pressure and time
- Dimensions | full layout on the first 3 castings from any new or altered pattern; key dimensions on 1 per shift | drawing tolerances
- Visual | every casting | no cracks, cold laps, misruns or sand on functional faces
caption: This is an illustration. The plan is the case's own agreement, not a quotation from any standard. Real plans are set by the customer's specification and the consequences of a defect in service.
```

## The Brinell test

A Brinell hardness test presses a hard ball into the surface under a fixed force, removes the force, and measures the diameter of the round indentation it leaves. Hardness is the force divided by the curved surface area of the indentation. For aluminium alloys, a 10 mm ball under 500 kgf is a common combination, giving indentations a few millimetres across that average over the coarse cast structure better than a small Vickers indentation would.

```figure
type: formula
title: Brinell hardness from the indentation
formula: HBW = 2F ÷ [πD × (D − √(D² − d²))]
formula: Indentation depth: h = (D − √(D² − d²)) ÷ 2
caption: F in kilograms-force, D and d in millimetres, by convention. The result is reported with the ball diameter and force, for example 85 HBW 10/500. The indentation diameter d is the mean of two diameters measured at right angles.
- F | test force, kgf
- D | ball diameter, mm
- d | mean indentation diameter, mm
```

### The validity rules

A Brinell reading is only meaningful if the test was made under the right conditions. The indentation must be neither too small nor too large compared with the ball, or the hardness depends on the size of the indentation. The specimen must be thick enough that the indentation does not feel the back surface. And the indentation must be far enough from an edge and from other indentations that the material around it is free to deform as if it were in an infinite block. Testing standards set these rules; laboratories and customers apply them, sometimes with their own values.

The WORKOS [Brinell hardness test check](/tools/brinell-test-check/) tool applies the rules you set. From the force, ball diameter, two perpendicular indentation diameters, the specimen thickness, the distance to the edge and the distance to the nearest other indentation, it gives the mean diameter, the hardness, the ratio of indentation to ball diameter, the force-to-diameter ratio, the depth and the difference between the two diameters. It checks the indentation ratio against your lower and upper limits, the thickness against your multiple of the depth, and the edge distance and spacing against your multiples of the indentation diameter, and then compares the hardness with the specification. It also reports an approximate tensile strength, which it states is for steels only.

This is an illustration. GB-12's hardness is checked on a flat area machined on the flange, 12 mm thick, at least 20 mm from its edge. The foundry uses the tool's rules of an indentation ratio between 0.24 and 0.6, a thickness at least 8 times the depth, an edge distance at least 2.5 times the indentation diameter and a spacing at least 3 times it.

```figure
type: steps
title: A GB-12 Brinell test in the test check tool
caption: This is an illustration. 500 kgf, 10 mm ball, diameters 2.70 and 2.72 mm, flange 12 mm thick, 20 mm to the edge, 15 mm to the next indentation; specification 75 to 95 HBW.
- Mean diameter | 2.71 mm
- * Hardness | 85.1 HBW 10/500, within 75 to 95
- Indentation ratio d ÷ D | 0.271, within 0.24 to 0.6
- Depth and thickness needed | 0.187 mm deep; 8 × 0.187 = 1.50 mm needed, 12 mm available
- Edge distance needed | 2.5 × 2.71 = 6.78 mm, 20 mm available
- Spacing needed | 3 × 2.71 = 8.13 mm, 15 mm available
```

The reading is valid and within specification. The tool's tensile strength line, 293 MPa, must be ignored for aluminium: the factor it uses is a rule of thumb for steels, and for an aluminium casting alloy the relation between hardness and tensile strength is different and depends on the casting's soundness. GB-12's tensile properties, where the customer needs them, come from tensile tests on bars cut from castings.

## The error: a reading at the edge of the flange

This is an illustration. When the night shift's inspector checked the first load after the new quench tank was installed (Chapter 9), the flat machined area was occupied by a fixture, so the inspector tested on a corner of the flange, 5 mm from its edge. The reading was 65.9 HBW, well below the 75 minimum. A second casting tested the same way gave a similar reading. The inspector tagged the load for rejection.

The quality engineer, reviewing the reject in the morning, ran the readings through the test check tool with the edge distance entered.

```figure
type: compare
title: Two Brinell readings on the same load
cols: Mean diameter, mm | Hardness, HBW | Edge distance needed, mm | Edge distance used, mm | Tool verdict
rowhead: Test position
- Flange corner, by the night inspector | 3.07 | 65.9 | 7.67 | 5 | test not valid
- * Machined flat, 20 mm from the edge, retest | 2.71 | 85.1 | 6.78 | 20 | within specification
caption: This is an illustration. Near an edge, the material beside the ball has less support and flows outwards, so the indentation is larger and the reading lower than the metal's true hardness.
```

The edge reading was invalid: the indentation, 3.07 mm across, needed 7.67 mm to the edge and had only 5. Near a free edge the metal is less constrained, the ball sinks further, and the reading is low. Retested properly on the machined flat, three castings from the load gave 85, 80 and 90 HBW, all within specification. The load was released.

The foundry changed two things: the test position is marked on the drawing of the casting and on the inspection sheet, and the test check tool's validity result is recorded with every reading, so that an invalid test cannot be mistaken for a failed casting.

### How good is the reading?

A Brinell number looks precise, but it rests on measuring a diameter of about 2.7 mm by eye through a measuring microscope, and the edge of an indentation in a cast surface is never perfectly sharp. This is an illustration. At GB-12's hardness, a difference of 0.02 mm in the mean diameter, from 2.71 to 2.73 mm, changes the reading from 85.1 to 83.8 HBW: each hundredth of a millimetre is worth about 0.6 HBW. Two inspectors reading the same indentation can easily differ by that much.

The foundry controls this in three ways. Its tester is verified each day on a certified reference block of known hardness, and the result recorded; a reading outside the block's tolerance stops testing until the machine is checked. Its inspectors take part in a periodic comparison, reading the same set of indentations, so that systematic differences between them are found. And acceptance near a specification limit is treated with that uncertainty in mind: a reading of 75.5 HBW is a pass, but a load whose readings cluster just above 75 deserves a look at its heat treatment before anyone relies on it.

### Tensile properties

Hardness is a convenient proxy for strength in a heat-treated aluminium casting, but it is not the same thing, because tensile strength and elongation are far more sensitive than hardness to porosity and oxide films. A casting can have the right hardness and still break at a low load through an oxide film. Where a customer needs tensile properties, they are measured on tensile test bars: either separately cast bars, poured from the same melt into a standard test bar mould and heat treated with the castings, which measure the quality of the metal and the treatment; or bars machined from a sacrificed casting, which measure the casting itself, including its defects. The second are lower and more variable, and more honest about what is in the part. GB-12's customer asked for cut-up tests on one casting per thousand, from the boss and the flange, and separately cast bars from each heat-treatment load.

## Seeing inside: radiography

Hardness says nothing about holes. Porosity, cavities, inclusions and cracks inside a casting are found by radiography: X-rays passed through the casting onto film or a digital detector, where denser or thicker metal shows lighter and voids show darker. Aluminium is easy to X-ray because it absorbs X-rays weakly. The images are graded by comparing them with reference radiographs, sets of standard images of each kind of defect at increasing severity, such as those published by ASTM International for aluminium and magnesium castings. The customer and foundry agree which grade is acceptable in which region: GB-12's boss, where the bearing bore is machined, has a stricter limit than its walls.

Radiography is slow and costly per casting, so it is used on a sample and on the first castings of a new pattern or a changed process, and on every casting where a defect would be dangerous. It is also the main tool for proving a gating or riser change (Chapters 5 and 7).

## Pressure tightness

A gearbox cover must hold oil. Every machined GB-12 is air-tested: its openings are sealed with fixtures, it is pressurised with air, and either the pressure decay is measured over a set time or the casting is submerged and watched for bubbles. A cover that leaks has a path through its wall, usually through connected porosity, an oxide film or a crack. Leakers can sometimes be saved by vacuum impregnation, filling the pores with a sealing resin, if the customer's specification allows it; GB-12's does, once, with a record.

### Other surface checks

Some defects break the surface but are too fine to see: shrinkage cracks, hot tears and cold laps that open only a few micrometres. Dye penetrant inspection finds them. A brightly coloured or fluorescent liquid is applied to the clean surface, drawn into any open crack by capillary action, wiped off the surface, and then drawn back out by a developer, so that each crack shows as a line of colour. GB-12's foundry uses it on the first castings of a new pattern, on castings that have been weld repaired, and wherever a radiograph or a pressure test suggests a crack. It finds only defects open to the surface, so it complements radiography rather than replacing it.

Weld repair of castings deserves its own note. Small surface defects in aluminium castings can often be repaired by welding, before heat treatment, with a qualified procedure and welder. But a weld repair is a change to the casting, and many specifications limit where it is allowed, how large it can be and how it must be recorded and inspected. GB-12's agreement allows small repairs on the outside walls, never on the boss, each with a penetrant check and a record.

## First article and ongoing checks

The first castings from a new or altered pattern are laid out in full, every dimension on the drawing measured and recorded, as Chapter 4 described. After that, the inspection plan's key dimensions are checked on a sample each shift, because patterns wear, cores shift and moulding varies. Control charts of a few key dimensions and of hardness by load let the foundry see drift before it becomes a reject.

```figure
type: checklist
title: Before a load of GB-12 is released
caption: The open item is the one added after the error: a test result is only accepted with its validity.
- Melt records attached: composition, gas test, grain refiner and modifier | Chapters 3 and 8
- Heat-treatment records attached: furnace chart, transfer time, bath temperatures | Chapter 9
- ? Brinell readings on 3 castings, each with the validity check passed | position marked on the drawing
- X-ray of the shift's sampled castings graded and filed | boss and flange
- Every machined cover pressure tested | leakers segregated and recorded
- Key dimensions on the shift's sample recorded | against the first-article layout
```

## Bringing it together

The ten chapters of this book followed one casting from the furnace to the inspection bench, and each stage turned out to have a few numbers that decide it. The melt's energy and cycle set how much metal a shift can pour. The blend sets its composition, allowing for what the furnace burns off and what the returns bring back. The pattern's allowances set its size, with a first-article layout to correct what a single shrinkage figure cannot predict. The gating sets how fast and how gently the metal arrives. The modulus sets the order of freezing, and the riser must win that race and still have metal to give. The melt's gas, oxide and grain refinement decide much of what the feeding cannot. The heat treatment's furnace and quench must each be large enough for the load. And every claim about the finished casting rests on a measurement that followed its own rules. A foundry that keeps those numbers, and the records behind them, finds its defects in the calculation rather than in the customer's machine shop.

## Exercise: a borderline load

This is an illustration. Three castings from a load give Brinell indentations, with 500 kgf and a 10 mm ball on the machined flat, of 2.85 × 2.87 mm, 2.62 × 2.64 mm and 2.78 × 2.80 mm.

1. What are the three hardness values?
2. Are they all valid, given 12 mm thickness, 20 mm to the edge and 15 mm spacing?
3. Is the load within the 75 to 95 HBW specification, and what would you look at?

**Worked answer.**

1. Mean diameters 2.86, 2.63 and 2.79 mm give **76.2**, **90.4** and **80.2 HBW**.
2. **Yes.** The largest indentation, 2.86 mm, needs 7.15 mm to the edge and 8.58 mm spacing, and is 0.209 mm deep, needing 1.67 mm of thickness; all are met. The ratios d ÷ D, 0.263 to 0.286, are within 0.24 to 0.6.
3. **Yes**, all three are within 75 to 95, but one is only just above the minimum and the spread, 14 HBW, is wide for one load. The heat-treatment records for that load are worth reviewing: the bath temperature at the quench, the casting positions in the basket, and the ageing oven's chart. A spread like that is often the first sign of a quench or ageing problem (Chapter 9).
