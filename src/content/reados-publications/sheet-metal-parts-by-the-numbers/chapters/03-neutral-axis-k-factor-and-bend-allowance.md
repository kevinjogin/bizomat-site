---
book: sheet-metal-parts-by-the-numbers
chapterSlug: neutral-axis-k-factor-and-bend-allowance
order: 3
title: "Neutral axis, K-factor and bend allowance"
description: "Where the neutral axis sits in a bend, what the K-factor means, how to calculate bend allowance for any angle, how sensitive the flat is to K, and how to calibrate K from trial strips."
draft: false
---

Every flat pattern rests on one assumption: where, inside the thickness of the sheet, the length is conserved during bending. That surface, the neutral axis, is not a material property and not exactly at mid-thickness. It moves towards the inside of the bend as the bend gets tighter, and its position depends on the material, the tooling and the bending method. CAD programs and folders express it as a single number, the K-factor, and everything downstream of it, the flat length, the hole positions and the outside dimensions, inherits whatever error that number carries.

This chapter defines the K-factor and the bend allowance, shows how sensitive the bracket's flat pattern is to K, and sets out how to measure K from trial strips, which is the only reliable way to know it. The running case calibrates the folder's K for the bracket's material and tooling and finds that a CAD default would have made every leg too tall.

## The K-factor

In a bend of inside radius R in sheet of thickness t, the neutral axis lies at some distance δ from the inside surface. The **K-factor** is that distance as a fraction of the thickness:

K = δ ÷ t

A K of 0.5 puts the neutral axis at mid-thickness, which is roughly right for gentle bends of large radius. Tighter bends compress the inside more, and the neutral axis moves inwards, so K falls. Physically, K lies between 0 and 0.5. Values that folders measure for air bending common steels and aluminium at radii near the thickness typically sit in the upper half of that range, and the bracket's folder measured **0.40** for its V12 die in this batch of 2.0 mm mild steel.

The K-factor is a property of the combination of material, thickness, radius, tooling and method. It is not a material constant, and a K-factor from one folder or one die does not transfer to another without checking.

## Bend allowance

The **bend allowance** is the length of the neutral axis through the bend, which is the length of flat blank that the bend consumes. For a bend of angle θ, measured as the change in direction from flat, in radians:

BA = θ × (R + K × t)

For the bracket's 90° bends, θ = π ÷ 2 = 1.5708, R = 2 mm, t = 2 mm and K = 0.40, so BA = 1.5708 × (2 + 0.8) = **4.398 mm**. A 45° bend in the same material takes half of that, 2.199 mm; a 135° bend takes one and a half times, 6.597 mm. The BIZOMAT [bend allowance calculator](/tools/bend-allowance/) gives the allowance, setback and deduction for any bend from a supplied K-factor.

The angle in the formula is the angle the sheet turns through, not the angle between the flanges. A right-angle bracket's bend is 90° by either measure, but a flange bent up to make a 60° included angle with its neighbour has turned through 120°. Mixing the two is a common source of flat pattern errors on non-right-angled parts.

```figure
type: formula
title: Bend allowance for one bend
formula: BA = θ × (R + K × t)
caption: θ in radians, the change in direction from flat. The running case's values; BA is the neutral axis length through one 90° bend.
- θ | Bend angle as change of direction: 90° is π ÷ 2 = 1.5708 rad
- R | Inside bend radius, 2.0 mm
- K | Neutral axis position as a fraction of thickness, 0.40 measured
- t | Sheet thickness, 2.0 mm
step: BA = 1.5708 × (2.0 + 0.40 × 2.0) = 1.5708 × 2.8 = 4.398 mm
step: 45° bend: 0.7854 × 2.8 = 2.199 mm; 135° bend: 2.3562 × 2.8 = 6.597 mm
```

## How much K matters

The bracket has four bends, so its flat width depends on K four times over. Using the bend deduction method of Chapter 4, the flat blank for the bracket's 310 mm of outside dimensions comes out at:

- K = 0.33: **294.71 mm**;
- K = 0.40: **295.59 mm**;
- K = 0.45: **296.22 mm**;
- K = 0.50: **296.85 mm**.

Between a K of 0.33 and 0.50, the flat changes by 2.1 mm, about 0.5 mm per bend. On a part with a ±0.5 mm tolerance on its outside dimensions, the wrong K uses the whole tolerance at a single bend. On a part with many bends, it can push dimensions far outside.

```figure
type: bars
title: Flat blank width of the bracket against the K-factor used
unit: mm
max: 300
caption: Four 90° bends, R = 2, t = 2, outside dimensions summing to 310 mm. Each 0.1 in K changes the flat by about 1.26 mm on this part.
- K = 0.33 | 294.71
- *K = 0.40, measured | 295.59
- K = 0.45 | 296.22
- K = 0.50 | 296.85
```

## The error: the CAD default

This is an illustration. The drafter modelled the bracket in a CAD program whose sheet metal template, inherited from another office, had a default K-factor of 0.50, and exported the flat pattern to the laser cutter without changing it. The flat came out at 296.85 mm instead of 295.59 mm, 1.26 mm wider.

The folder sets each bend with the press brake's back gauge, measuring from the blank's edges. Folding the returns first from each edge, then the legs, the extra flat length ended up in the legs: each leg came out about 0.63 mm taller than the drawn 60 mm. Within the bracket's general tolerance, it would have passed. But the drive's mounting feet sit on the base and its top clamp bolts to the returns, and the clamp's slots had been sized with only ±0.5 mm of float. The first trial fit was tight.

The folder found the cause in a minute by measuring the blank before folding: 296.85 mm, against the 295.6 mm the drawing's flat pattern view stated. The drafter set the K-factor in the model to the folder's measured 0.40, regenerated the flat and reissued the file. The office now records the K-factor on every sheet metal drawing, in a note beside the flat pattern view, so that a mismatch between the model and the folder is visible. It also removed the 0.50 default from its template and replaced it with a blank that the model will not accept, so that every new sheet metal part forces the drafter to enter a K-factor deliberately.

## Measuring K from trial strips

The reliable way to know K is to measure it. A trial strip takes ten minutes and a few offcuts.

This is an illustration. The folder cut five strips of the bracket's 2.0 mm sheet, each exactly 100.0 mm long and 40 mm wide, and bent each to 90° in its centre with the V12 die. With a 90° bend, the outside setback, the distance from the virtual sharp to each tangent line on the outside, is (R + t) × tan 45° = 4.0 mm. Each strip's flat length equals its two flat portions plus the bend allowance, and each flat portion is its outside leg length less the setback. So:

BA = L₀ − (A + B − 2 × 4.0)

where A and B are the measured outside leg lengths and L₀ is 100.0 mm. Then K = (BA ÷ θ − R) ÷ t.

```figure
type: compare
title: Trial strips for the bracket's K-factor
cols: A + B measured | Bend allowance | K-factor
caption: This is an illustration. 100.0 mm strips of 2.0 mm mild steel bent to 90° in the V12 die. The mean K is 0.399, used as 0.40.
- Strip 1 | 103.60 mm | 4.40 mm | 0.401
- Strip 2 | 103.55 mm | 4.45 mm | 0.417
- Strip 3 | 103.68 mm | 4.32 mm | 0.375
- Strip 4 | 103.62 mm | 4.38 mm | 0.394
- Strip 5 | 103.58 mm | 4.42 mm | 0.407
```

The mean is 0.399, and the folder uses 0.40. The spread between strips, 0.375 to 0.417, comes partly from the material and partly from measurement. A 0.1 mm error in measuring A + B changes the calculated bend allowance by 0.1 mm and K by 0.1 ÷ 1.5708 ÷ 2 = **0.032**. That is why one strip is not enough, why the legs should be measured carefully at the virtual sharp, and why the bend should be checked at 90° before measuring: a strip bent to 88° gives a different allowance.

## Why K moves

Folders sometimes see their measured K drift between batches of nominally the same sheet, and it helps to know why. The neutral axis moves inwards as the ratio R ÷ t falls, so anything that changes the formed radius or the actual thickness moves K: a batch at the thin end of the thickness tolerance forms a slightly larger R ÷ t in the same die; a harder batch springs back more and is overbent, which changes the formed radius; a worn die shoulder changes how the sheet wraps. None of these is large for mild steel, but together they explain a spread of a few hundredths in K, which the trial strips above show.

For most parts, a K measured once per material, thickness and die, and checked when a new batch or a new die arrives, is enough. For parts with many bends and tight tolerances, the folder may check K on a strip from each batch, which costs a few minutes and avoids a batch of parts with every flange slightly off.

## When no trial is possible

Sometimes the designer must release a flat pattern before the folder is chosen, for a quote or a prototype. The sensible approach then is to separate what the designer controls from what the folder controls. The drawing gives the finished part's dimensions and tolerances, which are the designer's requirement. The flat pattern is supplied as a reference, with its K-factor stated, and the drawing notes that the folder is to adjust the flat for its own tooling to achieve the finished dimensions. The folder then uses its own bend table, and the inspector checks the finished part, not the flat.

That approach puts responsibility where the knowledge is. It works only if the drawing's finished dimensions are complete and toleranced, which Chapter 10 checks, and if nobody treats the reference flat as a manufacturing dimension.

## Bend allowance in CAD

CAD sheet metal tools offer several ways to set the bend's length: a K-factor, a bend allowance value, a bend deduction value, or a bend table that lists allowances or deductions by thickness, radius and angle. All are equivalent for a single bend; they differ in convenience and in how they extend to other angles. A K-factor extends to any angle by the formula. A bend deduction measured at 90° does not extend correctly to other angles unless the table includes them.

The office's practice is to use the folder's measured K-factor for the folder's tooling, recorded in the model's sheet metal settings and on the drawing, and to ask the folder for a bend table if the part has several different angles or radii. If the part might go to a different folder, the drawing should state the finished dimensions and tolerances, and the flat pattern should be marked as for reference, to be confirmed by the folder for its tooling.

## Bend allowance for bends that are not 90°

The formula BA = θ × (R + K × t) is linear in θ, so for a given K the allowance for any angle is a simple proportion of the 90° allowance. In practice the K measured at 90° is a good guide for bends between roughly 30° and 150°, and less reliable for very shallow bends, where the bend region is barely formed, and for hems, where the sheet is folded back on itself and squeezed. A part with a 30° bend and a hem, as well as right angles, should have its unusual bends checked with their own trial strips or the folder's bend table. Chapter 7 deals with hems.

## What K does not capture

The K-factor model treats the bend as a perfect arc of radius R, joined to perfectly flat flanges. Real bends are slightly different: the radius is not quite circular, the flanges curve a little near the bend, and the thickness thins slightly on the outside. For parts with tolerances of a few tenths of a millimetre, the measured K absorbs those effects at the radius and angle where it was measured. For very tight tolerances, or large radii far from the measured condition, the folder may need trial parts rather than trial strips.

## Exercise: K for a different die

The folder offers to fold the bracket with its V16 die instead, which forms a 2.7 mm inside radius. A new set of strips, 100.0 mm long and bent to 90°, gives a mean A + B of 104.90 mm. What is the bend allowance and K-factor for that die, and what flat width does the bracket need with it?

**Worked answer.** The outside setback for R = 2.7 mm and t = 2.0 mm at 90° is (2.7 + 2.0) × tan 45° = **4.7 mm**. The bend allowance is BA = 100.0 − (104.90 − 2 × 4.7) = 100.0 − 95.50 = **4.50 mm**.

The K-factor is K = (4.50 ÷ 1.5708 − 2.7) ÷ 2.0 = (2.865 − 2.7) ÷ 2.0 = **0.082**. That is much lower than expected and should prompt a re-measurement: either the strips were not at 90°, the radius is not 2.7 mm, or the legs were measured from a different reference. A value so far from 0.40 at a larger radius is physically unlikely, since K usually rises, not falls, as the radius grows.

Suppose the folder re-measures and finds a mean A + B of 104.40 mm. Then BA = 100.0 − (104.40 − 9.4) = **5.00 mm** and K = (5.00 ÷ 1.5708 − 2.7) ÷ 2.0 = **0.242**, still low, but plausible for this folder's die and batch only if confirmed. The bend deduction for each 90° bend is 2 × 4.7 − 5.00 = 4.40 mm, and the flat width becomes 310 − 4 × 4.40 = **292.40 mm**. The exercise's lesson is the first answer: a calibration that gives an implausible K should be repeated before it is used.
