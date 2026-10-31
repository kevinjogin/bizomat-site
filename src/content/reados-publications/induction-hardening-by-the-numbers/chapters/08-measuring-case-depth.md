---
book: induction-hardening-by-the-numbers
chapterSlug: measuring-case-depth
order: 8
title: "Measuring case depth"
description: "How case depth is measured and judged: sectioning, a Vickers hardness traverse, the validity of each indentation, effective case depth by interpolation, and an indentation too close to the surface."
draft: false
---

A case cannot be seen from outside. Its depth, its hardness profile and its structure are found by cutting a part in two and measuring across the cut. Every induction hardening recipe is proved this way, and every production run is checked this way at intervals. The measurement is simple in principle, a row of small hardness indentations from the surface inwards, but every step from cutting the part to reading the last indentation can distort the answer, and the rules for a valid indentation matter as much as the hardness tester's calibration.

This chapter describes how the IH-40's journal is sectioned and traversed, checks individual indentations with a WORKOS Vickers tool, finds the effective case depth by interpolation with another, explains why the traverse pattern changes with depth, and works through a first indentation placed so close to the surface that it reported a soft case that was not there.

## Defining case depth

Case depth can be defined in more than one way, and a specification must say which.

```figure
type: compare
title: Ways of stating case depth
cols: Measured as | Notes
rowhead: Definition
- * Effective case depth | depth at which hardness falls to a stated value | the usual specification for induction hardening; the IH-40 uses 500 HV1
- Total case depth | depth to where hardness reaches the core value | deeper than the effective depth; harder to pin down because the curve flattens
- Visual case depth | depth of the visibly different etched zone | quick, for checking setups, but not a substitute for hardness
caption: Conventions for the limit hardness differ between standards and customers; ISO 3754, for example, deals with determining the effective depth of hardening after flame or induction hardening. The IH-40's drawing states its own limit, 500 HV1, and the test method.
```

The IH-40's drawing defines the case as the depth at which hardness falls to 500 HV1, required to lie between 2.0 and 3.0 mm, with surface hardness of 600 to 720 HV1 measured on the same traverse.

## Preparing the section

The middle of the journal is chosen because it is the zone least affected by the coil's ends; sections near each end of the case are taken when a recipe is first proved. The section is cut across the journal at its middle, square to the axis, with an abrasive cut-off wheel and plenty of coolant. Cutting heat would temper the case near the cut and lower its hardness, so the cut is slow and wet. The cut face is then mounted, ground and polished flat, so the indentations' diagonals can be read accurately. A light etch shows the hardened zone as a differently coloured band, which gives a quick visual check of its depth and evenness around the journal before any hardness test is made.

For the IH-40 the manufacturer measures two traverses at right angles on each section, because a single traverse cannot reveal a case that is deeper on one side than the other, the lesson of Chapter 4's knocked coil.

## The traverse

A traverse is a row of Vickers indentations from just below the surface into the core, each at a measured depth. The IH-40's traverse uses a 1 kgf load, small enough to give closely spaced readings through a 2 mm case.

### When is an indentation valid?

Each indentation must be far enough from the surface and from its neighbours that the material around it is free to deform normally. Near a free edge or another indentation, the steel is less constrained, the indenter sinks further, and the reading is low. The rules are expressed as multiples of the indentation's diagonal.

The WORKOS [Vickers hardness test check](/tools/vickers-test-check/) tool evaluates one indentation. From the test force and the two diagonals it gives the mean diagonal, the hardness, the depth of the indentation and the least specimen thickness, and it checks the specimen or layer thickness, the distance from the centre to the edge, the spacing to the next indentation and the difference between the two diagonals against the rules you set, and the hardness against your specification. Its guide notes that diagonal measurement dominates the accuracy at low loads and that the rules differ between standards and materials.

This is an illustration. The manufacturer's rules for traverses are an edge distance of at least 2.5 diagonals, a spacing of at least 3 diagonals and a difference between diagonals of no more than 5%.

```figure
type: steps
title: The first indentation of an IH-40 traverse in the Vickers test check tool
caption: This is an illustration. 1 kgf, diagonals 0.0528 and 0.0532 mm, 0.15 mm from the surface, 0.25 mm to the next indentation; specification 600 to 720 HV1.
- Mean diagonal | 0.0530 mm
- * Hardness | 660 HV1, within 600 to 720
- Indentation depth | 7.6 µm
- Edge distance needed | 2.5 × 0.0530 = 0.133 mm; 0.15 mm used
- Spacing needed | 3 × 0.0530 = 0.159 mm; 0.25 mm used
- Difference between diagonals | 0.75%, within 5%
```

### Why the pattern changes with depth

The diagonal grows as the hardness falls: at 650 HV1 it is about 0.053 mm; at the core's 225 HV1 it is about 0.091 mm. At 225 HV1, three diagonals is 0.27 mm, more than the 0.25 mm step the traverse uses. A straight line of indentations 0.25 mm apart is therefore valid in the hard case but too closely spaced in the soft core. The manufacturer uses a staggered pattern, alternating indentations between two parallel lines so that each is at least 3 diagonals from its neighbours while the depths still step by 0.25 mm, and measures each indentation's depth from the surface along the traverse direction.

## The IH-40's traverse

This is an illustration. A sectioned check shaft from the start of a shift gives this traverse:

```figure
type: line
title: Hardness traverse through an IH-40 journal
x: Depth below the surface, mm
y: Hardness, HV1
ymin: 200
ymax: 700
mark: 2.35 | effective case depth, 500 HV1
caption: This is an illustration. Readings at 0.25 mm steps after the first at 0.15 mm, staggered pattern. The case holds about 650 HV1 to about 1 mm, falls through 500 HV1 at 2.35 mm and reaches the core's 215 to 225 HV1 by about 4 to 5 mm.
- 0.15 | 660
- 0.5 | 650
- 1.0 | 640
- 1.5 | 615
- 2.0 | 560
- 2.25 | 520
- 2.5 | 470
- 2.75 | 400
- 3.0 | 320
- 3.5 | 250
- 4.0 | 225
- 5.0 | 215
```

The effective case depth lies between the readings at 2.25 mm (520 HV1) and 2.5 mm (470 HV1). Linear interpolation between them gives the depth at which the hardness is 500 HV1. The WORKOS [Linear interpolation](/tools/linear-interpolation/) tool does this in either direction: given two points and a known y, it returns the x that matches, and it warns if the answer lies outside the two points.

```figure
type: formula
title: Effective case depth by interpolation between two readings
formula: depth = x₁ + (500 − y₁) × (x₂ − x₁) ÷ (y₂ − y₁)
formula: = 2.25 + (500 − 520) × (2.50 − 2.25) ÷ (470 − 520) = 2.35 mm
caption: This is an illustration. Points (2.25 mm, 520 HV1) and (2.50 mm, 470 HV1). The interpolation assumes the hardness falls in a straight line between the two readings, which is reasonable for steps as close as 0.25 mm.
- x₁, y₁ | depth and hardness of the last reading above 500 HV1
- x₂, y₂ | depth and hardness of the first reading below 500 HV1
```

The effective case depth is 2.35 mm, inside the 2.0 to 3.0 mm band, and the surface reading, 660 HV1, is inside 600 to 720. The second traverse at right angles gave 2.40 mm, so the case is even around the journal.

### Reading the shape of the curve

The traverse's shape says as much as its numbers. The IH-40's curve has a nearly flat top, from the surface to about 1 mm, where the case is fully martensitic; a fall through the transition zone between about 1.5 and 3.5 mm, where less and less of the steel transformed; and a flat bottom at the core's hardness. Each shape that departs from this has a usual cause:

- a dip in the first few tenths of a millimetre suggests a decarburised or overheated surface (Chapter 5);
- a top that is not flat, falling steadily from the surface, suggests a heat too short or a quench too slow for the case to harden fully;
- a very steep fall from case to core concentrates residual stress at the transition and raises the risk of cracking there (Chapter 9);
- a step or shoulder partway down suggests two heating stages, or a quench that started late;
- a core reading higher than the incoming bar's hardness suggests the core was heated more than intended.

The core reading also checks the material: the IH-40's core, at 215 to 225 HV1, is consistent with the normalised bar's incoming Brinell hardness of about 212 HBW, allowing for the approximate nature of conversions between scales.

## How good is the answer?

A traverse gives a number to two decimal places, but each reading carries some uncertainty, and the case depth inherits it. This is an illustration. At the 500 HV1 limit the diagonal is about 0.061 mm. Misreading it by half a micrometre, about one division on many measuring eyepieces, changes the hardness by about 8 HV. In the region where the IH-40's hardness is falling, about 200 HV per millimetre between 2.25 and 2.5 mm, an error of 8 HV at the readings either side shifts the interpolated case depth by about 0.04 mm. Add a small error in measuring each indentation's distance from the surface, and the case depth from one traverse is good to perhaps ±0.05 mm.

That matters near the specification limits. A case of 2.35 mm is comfortably inside 2.0 to 3.0 mm; a case of 2.03 mm is a pass by the number but not convincingly. The laboratory reports the second traverse alongside the first, verifies its tester daily on a certified reference block, and takes part in periodic comparisons between its technicians, so that the uncertainty is known rather than guessed.

## How many sections, and how often

Sectioning destroys the part, so it is done on a sample. The manufacturer's plan for the IH-40 sections two shafts to approve each setup, at start-up and after any change of coil, recipe, steel delivery or quench; then one shaft per shift and one per 500 shafts thereafter; and one more whenever the energy monitor, the bath temperature or the surface hardness check shows anything unusual. Each section gets two traverses at right angles and an etched visual check, and the results are plotted on a control chart of case depth by shift (Chapter 10).

### Looking at the structure

The traverse measures hardness; the etched section shows why. A good IH-40 case is fine martensite, grading through a narrow transition zone into the unchanged ferrite and pearlite of the core. Patches of ferrite in the case mean incomplete transformation (Chapter 5). Coarse martensite and large prior austenite grains mean overheating (Chapters 3 and 5). A soft layer at the very surface may mean decarburisation. The laboratory photographs each section's case at a fixed magnification so that changes over time can be compared side by side.

### Non-destructive checks

Eddy current and ultrasonic instruments can estimate case depth without cutting the part, and some lines use them to check every part. They do not measure hardness directly: they respond to the change in electrical or acoustic properties between case and core, and must be calibrated against sectioned parts of the same steel, shape and recipe. They are excellent for spotting a part that differs from its neighbours, and for sorting, but a sectioned traverse remains the reference that their calibration and the specification rest on.

## The error: an indentation too near the surface

This is an illustration. A new laboratory technician, keen to capture the hardness right at the surface, placed the first indentation of a traverse 0.08 mm from the edge of the section. It read 590 HV1, below the 600 minimum. The technician reported the surface hardness as out of specification, and production was stopped while the batch was investigated.

The quality engineer ran the indentation through the Vickers test check tool. With a diagonal of about 0.056 mm, the minimum edge distance was 0.14 mm; at 0.08 mm the indentation was invalid. Near the edge of the section the steel had less support on one side, the indenter had sunk further, and the reading was low. Two more indentations at 0.15 mm, valid by the rule, read 655 and 660 HV1. A separate surface test on the journal itself, with a 10 kgf load on the ground surface, gave 670 HV10.

```figure
type: compare
title: Three surface readings on the same journal
cols: Distance from the edge, mm | Edge distance needed, mm | Reading | Valid?
rowhead: Indentation
- First, by the new technician | 0.08 | about 0.14 | 590 HV1 | no: too near the edge
- * Retest at the standard position | 0.15 | 0.133 | 655 and 660 HV1 | yes
- Surface test on the ground journal | not applicable | not applicable | 670 HV10 | yes
caption: This is an illustration. An invalid reading is not a low reading; it is no reading. Only valid indentations can pass or fail a part.
```

The technician's instinct, to measure as close to the surface as possible, was sound; the surface is where the bearing runs. The fault was that the measurement rules, which exist precisely to stop a test from measuring its own position rather than the steel, had not been part of the technician's training. Production restarted after an hour's delay. The laboratory added the edge distance and spacing to its traverse record sheet beside each reading, so that the validity of every indentation is visible, and wrote the first indentation's position, 0.15 mm, into its procedure.

## Reporting the result

A case depth result is only useful if someone else can understand and trust it. The laboratory's report for each IH-40 section states the shaft's identity and batch, where the section was cut, the load used, the readings with their depths and their validity, the effective case depth from each traverse and how it was found, the surface hardness, the etched appearance, the technician and the tester's verification that day. A customer's auditor, or the manufacturer's own engineer six months later, can then see exactly what was measured. A report that gives only "case 2.35 mm, OK" cannot be checked, and an unchecked number is a weak defence if a shaft ever fails in service.

## Exercise: a shallower traverse

This is an illustration. A check shaft from a batch hardened just after a coil change gives readings of 540 HV1 at 2.0 mm and 480 HV1 at 2.25 mm, with everything shallower than 2.0 mm above 540.

1. What is the effective case depth to 500 HV1?
2. Does it meet the 2.0 to 3.0 mm specification?
3. What would you check before releasing the batch?

**Worked answer.**

1. 2.0 + (500 − 540) × (2.25 − 2.0) ÷ (480 − 540) = 2.0 + 0.167 = **2.17 mm**.
2. **Yes**, but it is near the bottom of the band, about 0.2 mm shallower than the usual 2.35 to 2.40 mm.
3. A **second traverse at right angles**, to see whether the case is even around the journal (a shallow side would suggest the new coil's gap is uneven, Chapter 4); the **coil gap** at four points; and the **energy per part** in the monitor's record against the usual band (Chapter 10). If the second traverse is also near 2.2 mm and even, the batch can be released and the recipe trimmed back to the middle of the band.
