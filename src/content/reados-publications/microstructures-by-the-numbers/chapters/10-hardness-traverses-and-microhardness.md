---
book: microstructures-by-the-numbers
chapterSlug: hardness-traverses-and-microhardness
order: 10
title: "Hardness traverses and microhardness"
description: "Measuring a hardened case with a microhardness traverse, keeping indentations valid, finding the effective hardened depth, and how diagonal measurement uncertainty limits the result."
draft: false
---

A surface-hardened part is hard where it needs to be and tough underneath. Its quality is not a single hardness but a profile: how hard the surface is, how deep the hardness reaches and how it falls away into the core. The profile is measured by a **microhardness traverse**, a line of small indentations made across a polished section from the surface inwards, and the depth at which hardness falls to a stated value is reported as the hardened depth. Small indentations bring their own problems: they must not crowd each other or the edge, and their diagonals are so short that measuring them is the largest source of error.

This chapter plans and evaluates a traverse on the induction-hardened journal of Plant P's shaft, applies the validity rules that keep indentations independent, finds the effective hardened depth by interpolation and estimates how uncertain the hardness is. Its error is a case depth that failed because the diagonals were measured at too low a magnification.

## The test

Microhardness tests use a diamond indenter pressed into a polished surface with a small force, commonly from 0.01 to 1 kgf, and the size of the indentation measured under a microscope. The **Vickers** indenter is a square-based pyramid with an angle of 136° between faces; its hardness is HV = 1.8544 F ÷ d², with F in kilograms-force and d the mean of the two diagonals in millimetres. The **Knoop** indenter is an elongated pyramid whose long diagonal is about seven times the short one; its hardness is HK = 14.229 F ÷ L², with L the long diagonal. ISO 6507-1 and ASTM E384 cover the methods.

The [Vickers and Knoop hardness tool](/tools/vickers-knoop-hardness/) calculates HV or HK from the test force and the measured diagonal, and gives the indentation depth and the least specimen or layer thickness needed, so that the hardness measured is that of the layer and not of what lies beneath it. At HV0.5, a force of 0.5 kgf, a diagonal of 0.0393 mm gives **600 HV0.5**, an indentation depth of 5.6 µm and a least layer thickness of 0.059 mm.

### Why Knoop for steep gradients

The Knoop indentation is shallow and long. Laid with its long axis parallel to the surface, it samples a thin band at one depth while still giving a long diagonal to measure. That makes it useful very close to an edge and in thin layers, such as nitrided cases or coatings, where a Vickers indentation of the same force would be deeper and would straddle a range of hardness. A Knoop indentation at 0.1 kgf with a long diagonal of 0.050 mm gives 569 HK0.1 and is only 1.7 µm deep. Vickers and Knoop values are not interchangeable, even in the same units, so a requirement must name the scale and force.

## Planning the traverse

The shaft drawing defines the **effective hardened depth** as the depth below the surface at which hardness falls to 450 HV0.5, and requires at least 1.5 mm. That definition is the plant's illustrative choice; standards for induction-hardened parts define the limiting hardness in their own way, usually tied to the specified minimum surface hardness, and a real drawing should cite one. The laboratory planned the traverse on the transverse disc cut at mid-journal, as Chapter 2 described.

Three rules decide how close the indentations can be. Each indentation work-hardens and deforms the metal around it, so a second indentation too near the first measures disturbed metal; an indentation too near the edge lets the edge bulge outwards. Common rules put the centre of each indentation at least 2.5 diagonals from the edge and at least 3 diagonals from its neighbour; the applicable standard governs the actual values for a given material.

The [Vickers hardness test check](/tools/vickers-test-check/) evaluates one Vickers test from its two diagonals: the mean diagonal, the hardness, the indentation depth and least thickness, and the difference between the two diagonals. It checks thickness, edge distance and spacing as multiples of the diagonal using rules the user enters, checks the diagonal difference against a limit, and checks the hardness against a specification range.

For the first indentation, 0.1 mm below the surface, with diagonals of 0.0391 and 0.0395 mm, the tool gives 600 HV0.5 and passes every check: the edge distance of 0.1 mm just meets 2.5 diagonals, and the 0.2 mm spacing to the next indentation exceeds the 0.12 mm needed. The softer core indentations are larger, about 0.056 mm across at 300 HV0.5, so they need about 0.17 mm of spacing, still inside 0.2 mm.

```figure
type: steps
title: Plant P's traverse procedure for an induction-hardened journal
caption: This is an illustration. Staggering the indentations in two or three lines lets the depth step be smaller than the spacing rule allows in a single straight line.
- Section and prepare | transverse disc at mid-journal, mounted in edge-retaining resin, edge checked in focus at 500×
- Choose the force | HV0.5, giving diagonals of 40 to 56 µm across the profile
- Lay out the indentations | depth steps of 0.2 mm, staggered in two lines so neighbours are at least 3 diagonals apart
- Measure both diagonals | at 50× objective, about 0.2 µm per pixel, focus on the indentation tips
- Check each test | Vickers hardness test check: edge, spacing, diagonal difference
- * Interpolate the effective depth | between the two points either side of 450 HV0.5
```

## The profile and the effective depth

The traverse on the established supplier's shaft ran from 0.1 mm to 3.2 mm below the surface.

```figure
type: line
title: Microhardness traverse across the induction-hardened journal
x: Depth below the surface, mm
y: Hardness, HV0.5
ymin: 250
ymax: 650
caption: This is an illustration. The hardened layer holds about 600 HV0.5 to a depth of about 1 mm, falls steeply between 1.3 and 2.3 mm, and reaches the quenched and tempered core hardness of about 300 HV0.5 below 2.5 mm. The profile crosses 450 HV0.5 at 1.82 mm.
- 0.1 | 612
- 0.3 | 608
- 0.5 | 604
- 0.7 | 598
- 0.9 | 590
- 1.1 | 576
- 1.3 | 552
- 1.5 | 520
- 1.7 | 478
- 1.9 | 432
- 2.1 | 388
- 2.3 | 345
- 2.5 | 318
- 2.8 | 305
- 3.2 | 300
```

The hardness falls through 450 HV0.5 between 1.7 mm (478) and 1.9 mm (432). Linear interpolation gives the depth at which it equals 450: 1.7 + 0.2 × (478 − 450) ÷ (478 − 432) = 1.7 + 0.2 × 28 ÷ 46 = **1.82 mm**, comfortably more than the 1.5 mm required. The surface hardness, taken as the average of the first three points, is 608 HV0.5.

Interpolation assumes the profile is straight between the two points, which on this steep part of the curve is a fair approximation; a finer step near the expected crossing improves it where it matters. The interpolated depth's precision is limited mainly by the scatter of individual hardness readings: a reading 12 HV high or low at 1.9 mm, typical of the uncertainty worked out below, would move the interpolated depth by about 0.04 mm, small against the margin here.

### What the shape of the profile says

A traverse is worth reading as a whole, not just at its crossing point. A surface hardness lower than the hardness a few tenths of a millimetre down points to decarburisation, a surface that lost carbon during an earlier heat treatment and was not machined away, or to retained austenite at an overheated surface. A plateau that ends abruptly suggests the induction coil's power or scan speed changed. A profile that falls slowly over a long distance, with no clear plateau, suggests a heating time long enough to conduct heat deep into the part, which gives a deep but less sharply defined case and may distort the shaft. Small dips in the core part of the profile, where the hardened layer meets the quenched and tempered core, can mark an over-tempered band heated just below the transformation temperature by the induction pass. Each of these features has a cause that the heat treater can act on, and none is visible in a single case depth number.

## How uncertain is one microhardness reading?

A Vickers diagonal of 39 µm is a small thing to measure. The microscope's scale is calibrated with a stage micrometer whose certificate carries its own uncertainty; the reading has a resolution; and repeated readings of the same indentation by the same operator scatter, because locating the tips of a small, slightly blurred indentation is a judgement. Hardness depends on the inverse square of the diagonal, so each per cent of error in the diagonal becomes two per cent in the hardness.

The [measurement uncertainty budget tool](/tools/measurement-uncertainty-budget/) was built for dimensional measurements of parts: it combines the gauge's calibration uncertainty, its resolution, repeatability, an Abbe error from offset and tilt, and the part's temperature uncertainty by root-sum-square, expands the result with a coverage factor, and compares it with the tolerance band as a test uncertainty ratio, with guard-banded acceptance limits. A diagonal is a length measured with an optical gauge, so the same budget applies, with the Abbe and temperature terms set to zero because they are negligible for a 0.04 mm length on a calibrated stage. The tool addresses the length measurement, not the hardness test itself, which the text converts.

The laboratory entered a calibration uncertainty of 0.4 µm (k = 2) from the stage micrometer's certificate, a resolution of 0.1 µm and a repeatability of 0.35 µm from ten repeat readings of one indentation. For the tolerance, it converted the drawing's surface hardness range of 580 to 650 HV0.5 into diagonals: 0.03998 mm at 580 and 0.03777 mm at 650, a band of 0.00221 mm.

```figure
type: stats
title: Uncertainty of one HV0.5 diagonal near 600 HV
caption: This is an illustration. From the measurement uncertainty budget tool with Abbe and temperature terms set to zero. Repeatability, the operator's judgement of where the tips are, is the largest contributor. In hardness terms, the expanded uncertainty of a single reading is about ±25 HV at 600 HV0.5.
- 0.404 µm | combined standard uncertainty of the diagonal
- 0.81 µm | expanded uncertainty, k = 2
- 1.37 | test uncertainty ratio against the 2.21 µm band, below the 4 the tool asks for
- ±25 HV | expanded uncertainty in hardness, from 2 × 0.81 ÷ 39.3 × 600
```

The tool reports the measurement as **not capable** of judging a single reading against the surface hardness band with the ratio of 4 it was asked for, and names repeatability as the term to reduce first. That is an honest and useful result: a single microhardness reading cannot reliably decide whether a surface is 580 or 600 HV0.5. The laboratory's response was to report the surface hardness as the mean of three readings, which cuts the repeatability term by √3 and the combined standard uncertainty to about 0.29 µm, and to judge the surface against the band only when the mean lies clear of the limits by more than the remaining uncertainty.

## The error: diagonals read too long

The first traverse on the new supplier's shaft was made in a hurry, with the diagonals measured through the 20× objective because the 50× was in use on another specimen. The reported profile crossed 450 HV0.5 at **1.44 mm**, below the 1.5 mm required, and the shaft was set aside as failing case depth.

When the engineer looked at the saved images, the indentations at 20× were small and their tips blurred into the etched structure, and the technician had consistently placed the measuring lines just outside the tips. A check on three indentations at 50× showed the 20× readings to be about 2 µm too long on each diagonal. At 39 µm that is 5%, and it makes every hardness about 9.5% too low: (39.3 ÷ 41.3)² = 0.906.

```figure
type: compare
title: The new supplier's traverse near the 450 HV crossing
rowhead: Depth
cols: Reading at 20×, diagonals 2 µm long | Re-measured at 50×
caption: This is an illustration. A constant bias in the diagonal lowers every hardness by the same proportion, which moves the crossing of the 450 HV0.5 line towards the surface. The same indentations, measured properly, gave a case depth that passed.
- 1.1 mm | 496 HV0.5 | 548 HV0.5
- 1.3 mm | 471 HV0.5 | 520 HV0.5
- * 1.5 mm | 440 HV0.5 | 486 HV0.5
- 1.7 mm | 391 HV0.5 | 432 HV0.5
- Effective hardened depth | 1.44 mm, fails | 1.63 mm, passes
```

Re-measured at 50× on the same indentations, the profile crossed 450 HV0.5 at 1.5 + 0.2 × (486 − 450) ÷ (486 − 432) = **1.63 mm**, a pass. The shaft was released. The laboratory added a minimum objective for each test force to its procedure, chosen so that the diagonal spans at least a fifth of the field width, and made a weekly check reading on a certified reference block part of the routine, since a bias of this kind shows up immediately on a block of known hardness.

## Relation to other hardness work

Macro-hardness surveys across welds and heat-affected zones follow the same principles at larger scale, and the companion book on welded joints covers them in [Hardness and the heat-affected zone](/reados/publications/testing-welded-joints-by-the-numbers/hardness-and-the-heat-affected-zone/). The difference with microhardness is one of degree: the smaller the indentation, the more its result depends on the local microstructure, on preparation, and above all on how well its diagonals are measured.

## How this applies to a small Australian business

For a hardened part, ask for the full traverse, not just a case depth: the profile shows whether the case is deep but soft, hard but shallow, or has a soft surface from decarburisation, none of which a single depth reveals. Check that the report names the hardness scale and force, the definition of the limiting hardness, and how close the first indentation is to the surface. If a case depth is near the limit, ask how the diagonals were measured and whether a reference block was checked that day.

## Exercise: interpolating a case depth

A second journal traverse gives 468 HV0.5 at 1.60 mm and 425 HV0.5 at 1.80 mm, with the effective hardened depth defined at 450 HV0.5. (a) What is the effective hardened depth by linear interpolation? (b) If every reading had an expanded uncertainty of ±25 HV, by roughly how much could the interpolated depth move if the 1.80 mm reading were 25 HV higher?

**Worked answer.** (a) Depth = 1.60 + 0.20 × (468 − 450) ÷ (468 − 425) = 1.60 + 0.20 × 18 ÷ 43 = **1.684 mm**. (b) With 450 HV0.5 at 1.80 mm instead of 425, the crossing would fall exactly at **1.80 mm**, a shift of about 0.12 mm. On a steep part of the profile, an error of 25 HV moves the depth only a little; on a shallow part, where hardness changes slowly with depth, the same error would move it much further. That is why case depths are defined where the profile is steep, and why repeated indentations near the crossing pay for themselves when the result is close to a limit.
