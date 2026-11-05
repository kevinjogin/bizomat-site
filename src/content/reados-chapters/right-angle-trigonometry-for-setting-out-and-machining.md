---
title: "Right-angle trigonometry for setting out and machining: squares, slopes, tapers, offsets and sine bars"
description: "How Pythagoras and sine, cosine and tangent solve everyday setting-out, fabrication and machining problems, from squaring a slab and grading a ramp to tapers, pipe offsets and sine bars."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - manufacturing
  - design
  - quality
author: "BIZOMAT"
featured: false
draft: false
---

Right-angled triangles are hidden in almost every workshop and building site task. Squaring the corners of a concrete slab, checking a fabricated frame, setting a ramp gradient, cutting a taper on a lathe, fitting a pipe offset, setting up a sine bar or working out the length of a brace all reduce to the same few relationships between the sides and angles of a right-angled triangle. Tradespeople have long used rules of thumb, such as the 3-4-5 triangle, to apply them without calculation, but understanding the underlying trigonometry makes it possible to solve any variation of the problem, check the result and avoid the mistakes that come from misremembered shortcuts.

Most errors in practical trigonometry are not mathematical. They come from a calculator set to radians instead of degrees, from confusing a slope expressed as a ratio with one expressed as a percentage or an angle, from using the full angle of a taper when the half angle is needed, or from measuring the wrong side of a triangle. Clear sketches, labelled sides and a habit of checking results against rough estimates prevent nearly all of them.

This article explains Pythagoras' theorem, sine, cosine and tangent and their inverses, and applies them to setting out, slopes and ramps, frames and braces, tapers and chamfers, pipe offsets and sine bars, with worked examples and practical checks.

## The right-angled triangle

A right-angled triangle has one 90° angle. The side opposite the right angle is the **hypotenuse**, the longest side. For either of the other two angles, the side across from it is the **opposite** side, and the side next to it, other than the hypotenuse, is the **adjacent** side. Labelling the sides relative to the angle being used is the first step in every problem.

## Pythagoras' theorem

In any right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides:

c² = a² + b²

so the hypotenuse is c = √(a² + b²), and a missing shorter side is a = √(c² − b²).

### Squaring out with 3-4-5

A triangle with sides 3, 4 and 5 units has a right angle, because 3² + 4² = 9 + 16 = 25 = 5². Builders and fabricators use this to set out square corners: measure 3 m along one line, 4 m along the other and adjust until the diagonal between the marks is exactly 5 m. Multiples such as 6-8-10 or 1.5-2-2.5 work equally well, and larger triangles give better accuracy over long distances.

### Checking rectangles by diagonals

A rectangle is square when its two diagonals are equal. For a slab or frame 6 m by 4 m, each diagonal should be √(6² + 4²) = √52 ≈ 7.211 m. Measuring both diagonals and adjusting until they match is one of the quickest checks in construction and fabrication.

```figure
type: svg
title: Squaring a 6 × 4 m slab
alt: A rectangle 6 metres by 4 metres with a 3-4-5 triangle marked at one corner and both diagonals drawn. Each diagonal should measure the square root of 52, about 7.211 metres.
caption: Set out each corner with 3-4-5, then check both diagonals are about 7.211 m.
viewbox: 0 0 600 300
body:
<rect class="bx" x="60" y="40" width="480" height="220" rx="2"/>
<path class="lf dsh" d="M60 260L540 40M60 40L540 260"/>
<path class="la draw" d="M60 260H180M60 260V170M180 260L60 170"/>
<text class="tx txs" x="120" y="282" text-anchor="middle">3 m</text>
<text class="tx txs" x="50" y="220" text-anchor="end">4 m</text>
<text class="tx txs" x="140" y="205">5 m</text>
<text class="txb" x="300" y="140" text-anchor="middle">diagonals ≈ 7.211 m each</text>
<text class="tx txs" x="300" y="30" text-anchor="middle">6 m</text>
<text class="tx txs" x="552" y="154">4 m</text>
```

## Sine, cosine and tangent

For an angle θ in a right-angled triangle:

- **sine**: sin θ = opposite ÷ hypotenuse
- **cosine**: cos θ = adjacent ÷ hypotenuse
- **tangent**: tan θ = opposite ÷ adjacent

The mnemonic SOH-CAH-TOA helps recall them. If any two pieces of information are known, such as one side and one angle, or two sides, the rest of the triangle can be found. For example, a 12 m brace at 30° to the horizontal rises 12 × sin 30° = 6 m and spans 12 × cos 30° ≈ 10.39 m horizontally.

### Inverse functions

To find an angle from two sides, use the inverse functions: θ = sin⁻¹(opposite ÷ hypotenuse), θ = cos⁻¹(adjacent ÷ hypotenuse) or θ = tan⁻¹(opposite ÷ adjacent). On calculators these are often labelled sin⁻¹ or asin; in spreadsheets they are ASIN, ACOS and ATAN.

### Degrees and radians

Calculators and spreadsheets can work in **degrees** or **radians**. A full circle is 360° or 2π radians. Spreadsheet trigonometric functions use radians, so =SIN(30) does not give 0.5; =SIN(RADIANS(30)) does. A calculator left in radian mode gives wrong answers that look plausible. Checking a known value, such as sin 30° = 0.5, before starting work catches this immediately.

## Slopes, gradients and ramps

Slopes are expressed in three ways that are easily confused:

- as a **ratio**, such as 1:14, meaning 1 unit of rise for every 14 units of horizontal run;
- as a **percentage**, the rise divided by the run multiplied by 100, so a 1:10 slope is a 10% grade; or
- as an **angle**, found from tan θ = rise ÷ run, so a 10% grade is tan⁻¹(0.10) ≈ 5.7°.

A 100% grade is 45°, not 90°. Accessible ramps in Australia are commonly limited to a maximum gradient of 1:14 under the accessibility standards referenced by building regulations, which is about 4.1°. A ramp climbing 600 mm at 1:14 needs a horizontal run of 600 × 14 = 8,400 mm, plus landings as required. The [building regulation for project teams](/reados/collections/project-delivery-procurement-and-governance/building-regulation-for-project-teams/) article explains how such requirements are applied.

## Braces, stairs and rafters

Diagonal members in frames, stair stringers and roof rafters are hypotenuses. Their lengths come from Pythagoras, and their end cuts come from the angles. A stair with a total rise and going can be checked for its angle using tan θ = rise ÷ going, and rafters are set out from the roof pitch and span. In each case, a sketch showing which dimension is horizontal, which is vertical and which is the sloping length prevents most errors.

## Tapers and chamfers

On a lathe, a taper is defined by its large diameter D, small diameter d and length L. The **half angle**, which is the angle the compound slide or taper attachment must be set to, is:

tan(half angle) = (D − d) ÷ (2 × L)

For a taper from 50 mm to 30 mm over 80 mm, tan(half angle) = 20 ÷ 160 = 0.125, so the half angle is about 7.1°, and the included angle is about 14.3°. Using the included angle instead of the half angle is a common mistake that doubles the taper. Chamfers are usually specified by a length and an angle, such as 2 mm × 45°, and their dimensions follow from the same relationships.

## Pipe and duct offsets

When a pipe must move sideways to avoid an obstruction, two elbows create an **offset**. The length of the angled section, called the **travel**, depends on the offset and the fitting angle:

travel = offset ÷ sin(angle)

With 45° fittings, the travel is the offset multiplied by about 1.414, the reciprocal of sin 45°. A 300 mm offset with 45° elbows needs a travel of about 424 mm between the fitting centres, from which the cut length of pipe is found by subtracting the fitting allowances. Rolling offsets, which move both sideways and vertically, combine the two offsets using Pythagoras before applying the same rule.

## Sine bars and angle setting

A **sine bar** is a precision bar with two rollers at a known centre distance, often 100 mm or 200 mm. Raising one roller on a stack of gauge blocks of height h sets the bar at an angle θ given by:

h = L × sin θ

To set 10° on a 100 mm sine bar, the gauge block stack is 100 × sin 10° ≈ 17.365 mm. Sine bars and sine plates are used to inspect angles and to hold work at precise angles for grinding or machining. Their accuracy depends on the gauge blocks, the bar and the cleanliness of the surfaces. The [choosing and using measuring instruments](/reados/collections/machining-and-metal-parts/choosing-and-using-measuring-instruments/) article explains gauge blocks and related instruments.

## Mitres and bevels

Frames, trims and fabricated ducts often join at an angle. For two members meeting at a corner, each is cut at half the corner angle: a 90° corner needs two 45° mitres, and a 120° corner needs two 60° cuts measured from the length of the member, or 30° measured from square, depending on how the saw is marked. Confusion between these two conventions is common, so cutting lists should state the angle and the reference. For members of significant depth, the length along the outside edge differs from the length along the inside edge, for a member mitred at both ends, by twice the depth multiplied by the tangent of the cut angle measured from square, which must be allowed for when cutting to a dimension measured on one edge.

## Trigonometry in CAD and CNC

CAD systems and CNC controls perform these calculations automatically, but people still enter angles, read results and set up machines. Knowing the expected answer to a degree or a millimetre makes it easy to spot an entry error, such as an angle measured from the wrong axis or a slope entered as a percentage where an angle was expected. Many CNC controls measure angles anticlockwise from the positive X axis, while drawings may dimension them from a vertical edge, so converting between the two conventions deliberately avoids mirrored or rotated features.

## Heights and distances

Trigonometry also finds distances that cannot be measured directly. Measuring a horizontal distance to the base of a structure and the angle of elevation to its top gives the height as distance × tan(angle), plus the height of the instrument. Surveyors and engineers use the same principle with more precise instruments.

## Accuracy and error

Small errors in angles produce larger errors over long distances. An angular error of 0.5° over a 10 m line gives a sideways error of about 10 × tan 0.5° ≈ 87 mm. When setting out long lines, measured distances and the 3-4-5 method over large triangles are often more accurate than angles measured with simple instruments. In machining, the accuracy of an angle depends on the setting method, which is why sine bars and calibrated equipment are used for precise work.

## A worked example

This is an illustrative example. The project and figures are hypothetical.

A small manufacturer is installing a new concrete slab and access ramp for a storeroom. The slab is 6 m by 4 m. The concreter sets out the formwork using a 3-4-5 triangle at each corner, then checks both diagonals, which must each measure about 7.211 m. One diagonal reads 7.245 m, so the formwork is adjusted until both match.

The storeroom floor is 600 mm above the surrounding pavement, and the business wants an accessible ramp. At 1:14, the ramp needs a horizontal run of 8.4 m, which does not fit on the site in a straight line. The designer splits it into two flights with a landing, checking each flight's gradient and the landing requirements against the applicable standard.

Inside, a fitter must offset a compressed-air line by 300 mm around a column using two 45° elbows. The travel between fitting centres is 300 × 1.414 ≈ 424 mm, and after subtracting the elbow allowances, the pipe is cut to length on the first attempt.

```figure
type: stats
title: Three right triangles on one small project
caption: Setting out, an accessible ramp and a pipe offset all come down to the same geometry.
- 7.211 m | Slab diagonal | √(6² + 4²)
- 8.4 m | Ramp run for 600 mm at 1:14 | split into two flights with a landing
- *424 mm | Travel for a 300 mm offset | 45° elbows: × 1.414
```

## How this applies to a small Australian business

- **Sketch and label every triangle** before calculating.
- **Check calculator and spreadsheet angle modes** with a known value.
- **State slopes clearly** as ratios, percentages or angles, and do not mix them.
- **Use half angles for tapers** and check the included angle on the drawing.
- **Use 3-4-5 triangles and diagonal checks** for setting out.
- **State mitre angles with their reference**, from square or from the length.
- **Use sine bars and gauge blocks** for precise angles.

## Common mistakes

- **Leaving a calculator in radians.**
- **Confusing a 10% grade with a 10° slope.**
- **Setting the included angle** of a taper instead of the half angle.
- **Forgetting fitting allowances** when cutting pipe offsets.
- **Measuring short triangles** for long setting-out lines.
- **Labelling opposite and adjacent sides** relative to the wrong angle.

## Frequently asked questions

**Why does 3-4-5 give a right angle?** Because 3² + 4² = 5², which satisfies Pythagoras' theorem only when the angle between the two shorter sides is 90°.

**Is a 100% grade vertical?** No. A 100% grade rises 1 unit for every 1 unit of run, which is 45°. A vertical slope would have an infinite grade.

**Why do spreadsheets give strange trigonometry results?** Their trigonometric functions use radians. Convert degrees with the RADIANS function, and convert results back with DEGREES.

**How accurate is the diagonal check?** It is very sensitive: for a 6 m by 4 m rectangle, a corner that is out of square by about half a degree lengthens one diagonal and shortens the other by roughly 30 mm each, so tape measurements to a few millimetres reveal small errors.

## Questions to ask

- Do our teams check angle modes before using calculators or spreadsheets?
- How are slopes and gradients expressed on our drawings and specifications?
- Do our setting-out procedures include diagonal checks?
- Are taper and chamfer angles specified unambiguously on our drawings?
- What method do we use to set precise angles in machining?

## Bringing it together

Right-angled triangles solve a remarkable range of practical problems. Pythagoras' theorem squares out slabs and finds diagonals; sine, cosine and tangent and their inverses give braces, slopes, tapers, offsets and sine bar settings. Most errors come from angle modes, mixed slope conventions, half-angle confusion and unlabelled sketches rather than from the mathematics itself. The [designing parts that are economical to machine](/reados/collections/machining-and-metal-parts/designing-parts-that-are-economical-to-machine/) article shows how choosing simple angles and features also makes parts easier to make.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations. This article is general information; check accessibility and building requirements with the relevant authority.*
