---
book: tolerances-that-work
chapterSlug: size-tolerances-and-it-grades
order: 2
title: "Size tolerances, IT grades and general tolerances"
description: "Read and write limits of size, use ISO tolerance grades and fundamental deviations, convert between notations and apply general tolerances without hidden ambiguity."
draft: false
---

The size tolerance is the oldest and most familiar tolerance on a drawing. It looks simple: a nominal value and a permitted range. Behind that simplicity sit several choices that change how a part is made and judged, including the notation, the tolerance grade, the position of the range relative to nominal and whether the size limit also controls form.

This chapter covers the vocabulary of size, the ISO system of tolerance grades and deviations, the main ways of writing a size tolerance, and the general tolerance note that covers everything not individually toleranced. It ends with a caution about the different default rules in ISO and ASME practice.

## The vocabulary of size

ISO 286-1 uses a consistent set of terms. They are worth using precisely because they appear in standards, supplier documents and inspection reports.

- **Nominal size** is the reference size from which the limits are derived, such as 25 mm. It is the number drawn on the dimension line.
- **Upper and lower limits of size** are the largest and smallest permitted sizes.
- **Upper and lower deviations** are those limits minus the nominal size. By convention, capital letters ES and EI denote deviations for internal features (holes), and lower-case es and ei denote deviations for external features (shafts).
- **Tolerance** is the difference between the upper and lower limits. It is always positive and has no sign.

A hole drawn as Ø25 with limits 25.021 and 25.000 has deviations ES = +0.021 mm and EI = 0, and a tolerance of 0.021 mm. A shaft with limits 24.993 and 24.980 has es = −0.007 mm, ei = −0.020 mm and a tolerance of 0.013 mm.

```figure
type: range
title: A Ø25 H7 hole and a Ø25 g6 shaft against the nominal size
min: 24.97
max: 25.03
unit: mm
ticks: 24.97 | 24.985 | 25.000 | 25.015 | 25.03
caption: The hole never falls below nominal (H), the shaft always sits below it (g), so every combination has clearance.
- *Hole 25 H7 | 25.000 | 25.021 | tolerance 0.021 mm, ES +0.021, EI 0
- Shaft 25 g6 | 24.980 | 24.993 | tolerance 0.013 mm, es −0.007, ei −0.020
- Nominal size | 25.000 | 25.000 | the reference size drawn on the dimension line
```

The **mean size** is the midpoint of the limits. It matters in stack-up work because statistical methods add variation about the mean, not about the nominal. A bearing width drawn as 12 mm with deviations 0 and −0.12 mm has a mean of 11.94 mm and can be written as 11.94 ± 0.06 mm for analysis, although the drawing should keep the supplier's notation.

## Four ways to write a size tolerance

The same requirement can be written in several forms. Each has a use.

| Notation | Example | Typical use |
|---|---|---|
| Limit dimensions | 25.021 / 25.000 | Critical features where the inspector should not need to calculate |
| Equal bilateral | 16 ± 0.05 | Lengths and locations where variation either way is equally acceptable |
| Unequal or unilateral deviations | 12 0 / −0.12 | Bought-in parts and features that may only vary in one direction |
| Tolerance class code | Ø25 H7 | Fits and standard sizes, usually with limits added in brackets |

When a tolerance class such as H7 is used, many drawing offices add the limits in brackets beside it, for example Ø25 H7 (25.000 / 25.021). That avoids table look-ups on the shop floor and removes a source of error. The code still communicates the designer's intent, which helps when a size is later changed.

## The ISO system of tolerance grades

A tolerance of 0.02 mm is demanding on a 300 mm bore but generous on a 3 mm pin. The ISO system deals with this by grouping sizes into ranges and defining **standard tolerance grades** whose values grow with size. ISO 286-1 provides grades from IT01 through IT0 and IT1 to IT18. Smaller numbers are finer.

For the medium grades commonly used in mechanical work, the values are built from a **standard tolerance factor** that grows roughly with the cube root of size. For sizes up to 500 mm, ISO 286-1 gives the factor in micrometres as:

**i = 0.45 × ∛D + 0.001 × D**

where D is the geometric mean of the size range in millimetres. Grade IT7 is 16i, IT8 is 25i, IT9 is 40i, and the grades from IT6 upwards follow a series in which each step of five grades multiplies the tolerance by ten. Published values are rounded.

This is an illustration of how the published values arise. For the size range above 18 mm up to 30 mm, the geometric mean is √(18 × 30) = 23.24 mm. Then:

- i = 0.45 × ∛23.24 + 0.001 × 23.24 = 1.307 µm
- IT7 = 16 × 1.307 = 20.9 µm, published as 21 µm
- IT8 = 25 × 1.307 = 32.7 µm, published as 33 µm

For the range above 30 mm up to 50 mm, the same arithmetic gives IT7 = 25.0 µm and IT8 = 39.0 µm, which match the published 25 µm and 39 µm. Nobody needs to calculate grades routinely, because ISO 286-2 tabulates them. The formula is useful because it explains why tolerances scale as they do, and it gives a rational basis for sharing a tolerance budget between features of different sizes, which Chapter 9 uses.

```figure
type: formula
title: How ISO tolerance grades grow with size
formula: i = 0.45 × ∛D + 0.001 × D   (µm, D in mm)
caption: Worked for the size range above 18 mm up to 30 mm. Published values are rounded from this arithmetic.
- D | geometric mean of the size range: √(18 × 30) = 23.24 mm
- i | standard tolerance factor in micrometres
- IT7 | 16 × i
- IT8 | 25 × i
step: i = 0.45 × ∛23.24 + 0.001 × 23.24 = 1.307 µm
step: IT7 = 16 × 1.307 = 20.9 µm → published 21 µm
step: IT8 = 25 × 1.307 = 32.7 µm → published 33 µm
```

## Fundamental deviations: where the tolerance sits

A grade fixes the width of the tolerance. A **fundamental deviation**, identified by a letter, fixes its position relative to nominal.

```figure
type: bars
title: Standard tolerance grades for sizes over 18 mm up to 30 mm
unit: µm
caption: Each step of five grades multiplies the tolerance by ten. IT7 and IT6 are the grades of the common H7/g6 fit. Values from ISO 286-1.
- IT6 | 13
- *IT7 | 21 | the hole in H7/g6
- IT8 | 33
- IT9 | 52
- IT10 | 84
- IT11 | 130
```

- Holes use capital letters and shafts use lower-case letters.
- **H** places a hole's lower deviation at zero, so the hole is never smaller than nominal. **h** places a shaft's upper deviation at zero, so the shaft is never larger than nominal.
- Shaft letters a to g sit progressively further below nominal and produce clearance with an H hole. Letters k to zc sit above nominal and produce transition or interference fits. The letters js and JS place the tolerance symmetrically about nominal.

A tolerance class combines the two: 25 H7 is a 25 mm hole with fundamental deviation H and grade IT7, giving 25.000 to 25.021 mm. A 25 g6 shaft has an upper deviation of −0.007 mm and an IT6 grade of 0.013 mm, giving 24.980 to 24.993 mm. Put together, those are the H7/g6 fit examined in the next chapter.

## A worked example from the guide roller

The Northgate spacer is a steel tube between the two bearing outer rings. Its length is part of the axial float chain. The first drawing showed 16 ± 0.05 mm. Three questions are worth asking before accepting it.

**Is the range needed?** The stack-up in Chapter 7 shows that this tolerance contributes noticeably to axial float. A turned and faced spacer can usually be held to a closer range at little extra cost, so the tolerance is a candidate for tightening if the analysis needs it.

**Is equal bilateral right?** The spacer can be equally acceptable a little short or a little long, provided the float stays within its limits. An equal bilateral tolerance is appropriate.

**Is the measurement defined?** "Length" of a tube can mean the distance between two parallel planes touching the end faces, a local two-point measurement or an average. If the end faces are not square to the bore, those give different answers. A perpendicularity requirement on the end faces, or a specified size modifier, removes the ambiguity. Chapter 5 returns to this.

## General tolerances

Most dimensions on a drawing are not individually toleranced. They are covered by a general tolerance note in the title block. ISO 2768-1 is widely used for this. It defines four classes for linear and angular dimensions: f (fine), m (medium), c (coarse) and v (very coarse). A note such as "General tolerances ISO 2768-m" applies the medium class to every untoleranced linear and angular dimension.

The permitted deviations grow with size. Indicative values for three common size ranges are shown below; confirm them in the standard before relying on them.

| Size range (mm) | Class f | Class m | Class c |
|---|---|---|---|
| Over 6 up to 30 | ±0.1 | ±0.2 | ±0.5 |
| Over 30 up to 120 | ±0.15 | ±0.3 | ±0.8 |
| Over 120 up to 400 | ±0.2 | ±0.5 | ±1.2 |

General tolerances work well when they reflect what the workshop achieves without special effort. A supplier will normally meet ISO 2768-m on machined parts with ordinary care. Applying class f to a whole drawing, by contrast, forces close control onto features that do not need it.

General tolerance notes also have limits. They do not create datums, so an untoleranced hole position under a general note is still ambiguous about where it is measured from. Geometrical general tolerances exist as well, and newer standards such as ISO 22081 provide a different approach to general specifications. Whatever note is used, it must name the standard and class exactly; "unless otherwise stated ±0.1" without a standard leaves angular dimensions and many geometric questions undefined.

## Whether a size limit controls form

This is the most important rule difference between the two main tolerancing systems, and it causes real disputes.

Under **ASME Y14.5**, Rule #1 applies by default to regular features of size such as cylinders and pairs of parallel faces. A feature at its maximum material size must have perfect form. A shaft drawn 20.000 / 19.987 must fit through a perfect cylinder of 20.000 mm, so a bent shaft at 19.995 mm local size can be rejected because it violates that envelope.

Under the **ISO GPS** system, ISO 8015 establishes the independency principle by default. Each requirement applies independently unless the drawing links them. The size tolerance controls local size only; it says nothing about straightness or roundness. The same bent shaft could pass a size check. To get envelope behaviour, an ISO drawing applies the envelope requirement, shown by the symbol Ⓔ after the size, or adds an appropriate geometric tolerance.

Neither system is wrong, but a drawing must make clear which one applies. Many Australian drawings invoke ISO standards while their authors assume ASME behaviour. Name the governing standard in the title block, and where form matters for a fit, state the requirement explicitly rather than relying on a default the supplier may read differently.

```figure
type: compare
title: Does a size tolerance also control form?
cols: ISO GPS (ISO 8015) | ASME Y14.5
rowhead: Question
caption: Name the governing standard in the title block, and state form requirements explicitly where a fit depends on them.
- Default principle | Independency: each requirement stands alone | Rule #1: perfect form at maximum material
- What a size limit controls | Local size only | Size and an envelope of perfect form
- Bent shaft at good local size | Can pass | Rejected if it breaches the envelope
- How to get envelope behaviour | Add Ⓔ after the size, or a geometric tolerance | Applies by default to regular features of size
```

## The failure case: a converted bearing width

This is an illustration. When Northgate drew its first assembly drawing, a drafter tidied the notation so that every length was shown as an equal bilateral tolerance. The bearing width, supplied as 12 with deviations 0 and −0.12 mm, was redrawn as 12 ± 0.06 mm. The tolerance looked the same, 0.12 mm, and nobody questioned it.

The limits had moved. The bearing manufacturer's range is 11.88 to 12.00 mm. The redrawn range is 11.94 to 12.06 mm: the same width of tolerance, shifted 0.06 mm upwards. Two bearings sit in the axial float chain, so the error doubled to 0.12 mm. Wider bearings take up more of the space between the shoulder and the groove. The early float analysis therefore predicted floats 0.12 mm smaller than the real bearings would give, at both ends of the range. A design that looked tight on paper would have been loose in the housing, and a correction made to fix the imagined problem would have made the real one worse.

### How it is detected

Compare limits, not notation. Writing out the upper and lower limits of every bought-in part beside the supplier's catalogue value shows the shift at once. A conversion is correct only if both limits survive it unchanged.

### How it is corrected

The assembly drawing went back to the supplier's notation, 12 with deviations 0 and −0.12 mm. The conversion to a mean and an equal bilateral tolerance, 11.94 ± 0.06 mm, was kept where it belongs: in the stack-up worksheet, labelled as a conversion for analysis.

## Common mistakes

- **Mixing notations on one drawing** without a reason. Choose a house convention and keep to it so inspectors know what to expect.
- **Copying class codes without limits.** A code such as k6 forces the shop floor to consult a table. Add the limits.
- **Over-specifying decimal places.** Writing 16.000 ± 0.050 where 16 ± 0.05 is meant can be read as a demand for precision in measurement reporting. Follow a consistent decimal convention.
- **Assuming the general note covers everything.** It does not create datums or define how a feature is measured.
- **Ignoring the default form rule.** Check whether the drawing invokes ISO or ASME and whether form needs explicit control.

## Questions to ask

- Is the tolerance expressed in the notation that is least likely to be misread at this feature?
- Would a standard tolerance class communicate the intent better than an arbitrary range?
- Does the general tolerance class match what the supplier achieves without special effort?
- Which standard governs the drawing, and does the size tolerance also need to control form?

## Exercise: decode, convert and gauge

Write the limits, deviations, tolerance and mean size for Ø25 H7, Ø25 g6 and a 12 mm bearing width with deviations 0 and −0.12 mm. Rewrite the bearing width as an equal bilateral tolerance about its mean. Then plan go and no-go plug gauges for the Ø25 H7 hole, with a gauge tolerance of 10% and a wear allowance of 5% of the work tolerance.

**Worked answer.**

- **Ø25 H7:** limits 25.000 and 25.021 mm; ES = +0.021 mm and EI = 0; tolerance 0.021 mm; mean 25.0105 mm.
- **Ø25 g6:** limits 24.980 and 24.993 mm; es = −0.007 mm and ei = −0.020 mm; tolerance 0.013 mm; mean 24.9865 mm.
- **Bearing width:** limits 11.88 and 12.00 mm; upper deviation 0 and lower deviation −0.12 mm; tolerance 0.12 mm; mean 11.94 mm. As an equal bilateral tolerance it is 11.94 ± 0.06 mm, not 12 ± 0.06 mm.
- **Gauges:** the [limit gauge plan tool](/tools/plug-gauge-plan/) in BIZOMAT Tools places the gauge tolerances inside the work limits. It works from the formula value of IT7, 20.9 µm, rather than the published 21 µm. It gives a gauge tolerance of 2.09 µm and a wear allowance of 1.05 µm, a go gauge of 25.0010 to 25.0031 mm and a no-go gauge of 25.0188 to 25.0209 mm. The go gauge is a full-form plug at the smallest permitted hole, raised by the wear allowance so that it can wear without accepting small holes. The no-go gauge sits just inside the largest permitted hole. Use the published value and your gauge maker's tolerances for real gauges.

**Try it on your own drawing.** Check the title block of one of your own drawings. Does it name a general tolerance standard and class, and does it say whether ISO or ASME rules apply?

With size tolerances in hand, the next chapter combines a hole and a shaft into a fit and works through clearance, transition and interference fits, including the calculation of a shrink fit.
