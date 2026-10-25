---
book: sheet-metal-parts-by-the-numbers
chapterSlug: bend-radius-and-what-limits-it
order: 2
title: "Bend radius and what limits it"
description: "Choose an inside bend radius: outer fibre strain, a minimum radius from the material's ductility, the radius air bending actually forms, the folder's tooling, and why tighter is not better."
draft: false
---

The inside bend radius is the first number to settle on a folded part, because almost everything else depends on it: the flat pattern, the springback, how close a hole may come to the bend, the length of the shortest flange. It is also the number designers most often choose by appearance, drawing a crisp, tight corner because it looks precise. A radius the material cannot take cracks the bend; a radius the tooling cannot form produces a different radius from the one drawn, and every calculation that used the drawn one is wrong.

This chapter sets out what limits the bend radius from both sides. The material sets a minimum, which can be estimated from its tensile ductility. The press brake's tooling sets what radius is actually formed, which in air bending depends mainly on the die opening. The running case confirms the bracket's 2 mm radius and finds that a high-strength variant drawn with a sharp corner would crack.

## Strain on the outside of a bend

When a sheet of thickness t is bent to an inside radius R, the outside surface stretches more than any other part of the section. Taking the neutral axis at mid-thickness, which is close enough for this purpose, the engineering strain at the outside surface is:

ε = t ÷ (2R + t)

That one expression explains why tight bends crack. At R = 4t the outside stretches about 11%; at R = 2t, 20%; at R = t, 33%; at R = t ÷ 2, 50%. Most sheet steels and aluminium alloys can take strains well beyond their uniform tensile elongation in bending, because the strain is concentrated in a thin outer layer supported by less-strained material, but every material has a limit, and a sharp bend can exceed it.

```figure
type: bars
title: Outer surface strain against the ratio of inside radius to thickness
unit: %
max: 55
caption: From ε = t ÷ (2R + t), with the neutral axis at mid-thickness. The bracket's 2 mm radius in 2 mm sheet is R = t.
- R = 4t | 11.1
- R = 2t | 20
- *R = t, the bracket | 33.3
- R = t ÷ 2 | 50
```

## A minimum radius from ductility

A widely quoted relationship, published by Datsko and Yang in 1960, estimates the smallest inside radius a material can be bent to without cracking from its tensile test's reduction of area, r, in per cent:

R_min = t × (50 ÷ r − 1)

The relationship captures the trend well: ductile materials with a large reduction of area can be bent tighter. For a reduction of area of 50% or more, it gives zero or less, meaning that ductility does not limit the radius and the bend could in principle be made sharp; in practice tooling then sets the radius. For less ductile materials, it gives a real minimum.

This is an illustration, with reduction-of-area values chosen to show the range rather than taken from any grade's specification:

- a mild steel with a reduction of area of 60%: R_min = 2 × (50 ÷ 60 − 1) = −0.33 mm, so ductility is no limit;
- a steel with 45%: R_min = 0.22 mm;
- a high-strength steel with 35%: R_min = **0.86 mm**;
- a hard-temper aluminium alloy with 25%: R_min = 2.0 mm, equal to the thickness.

The relationship is an estimate. Edge condition, surface finish, grain direction and the bend's width all affect cracking, and a bend across the rolling direction usually tolerates a tighter radius than one along it. Treat R_min as a lower bound to stay well above, and use the material supplier's published bend radius guidance where it exists. The WORKOS [bend radius limits calculator](/tools/bend-radius-limits/) applies the same relationship.

```figure
type: formula
title: Estimating the minimum bend radius from ductility
formula: R_min = t × (50 ÷ r − 1)
caption: Datsko and Yang's relationship. A result of zero or less means ductility does not limit the radius; tooling does. Values of r here are illustrations.
- t | Sheet thickness, 2.0 mm for the bracket
- r | Reduction of area in a tensile test, per cent
step: r = 60%: R_min = 2 × (0.833 − 1) = −0.33 mm, no ductility limit
step: r = 35%: R_min = 2 × (1.429 − 1) = 0.86 mm
step: r = 25%: R_min = 2 × (2 − 1) = 2.0 mm
```

## The radius air bending actually forms

In air bending, the most common press brake method, the punch pushes the sheet into a V-die without forcing it into the die's bottom. The sheet bends around the punch tip only if the punch radius is larger than the radius the sheet would naturally take across the die opening. Otherwise the sheet forms its own radius, set mainly by the die opening and the material, and the punch's radius does not matter.

That means the designer does not choose the inside radius directly. The folder chooses a die, and the die and the material together produce a radius. Folders know the radius each of their dies forms in each material they use, from charts or from trials, and the honest way to put a radius on a drawing is to ask them.

This is an illustration. The bracket's folder reports the radius its dies form in this batch of 2.0 mm cold-rolled mild steel, from trial bends:

```figure
type: compare
title: Inside radius formed in 2.0 mm mild steel, by die opening
cols: Inside radius formed | Suitable for 2.0 mm? | Note
caption: This is an illustration of one folder's trial results. Other folders and other batches give different values; the drawing's radius should come from the folder who will make the part.
- V10 die | 1.6 mm | Yes, at higher force | Short minimum flange
- *V12 die | 2.0 mm | Yes, the folder's standard | Used for the bracket
- V16 die | 2.7 mm | Yes, at lower force | Longer minimum flange
- V24 die | 4.0 mm | Too wide for good angle control | Used for thicker sheet
```

The designer drew the bracket's bends at R2 inside, matching the V12 die. Had the drawing said R1, the folder would have formed R2 anyway with its standard die, or used a smaller die with more force and a shorter tool life, and either way the drawing would not describe the part.

## The error: a sharp corner in high-strength steel

This is an illustration. A lighter variant of the bracket was proposed for a smaller drive: the same shape in 2.0 mm high-strength steel, chosen for its strength to allow thinner legs later. The designer copied the original drawing, changed the material and, to make the bends look crisp, changed the inside radius note to "R0.5 INSIDE, ALL BENDS".

The folder tried it with a sharp punch in a narrow die, and the first two parts cracked along the outside of all four bends. The outside strain at R0.5 in 2 mm sheet is 2 ÷ (1 + 2) = **67%**, twice the strain at R2. The material's test certificate gave a reduction of area of 35%, for which the Datsko–Yang estimate is R_min = 0.86 mm. The drawn radius was below the estimated minimum before any allowance for edges or grain.

The correction was to return to R2 inside, at 33% outside strain and more than twice the estimated minimum, and to note on the drawing "BEND LINES ACROSS ROLLING DIRECTION", since a high-strength steel is more sensitive to grain than mild steel. The designer's interest in a crisp appearance was met instead by a sharper edge on the cut flanges, which costs nothing.

## Too large a radius

A radius can also be too large. If R is very large compared with t, the material stays elastic and springs back almost completely: the bend never takes a permanent set. The elastic limit is reached when R exceeds roughly t × E ÷ (2 × yield stress). For the bracket's steel, with a modulus of 200,000 MPa and, in this illustration, a yield stress of 280 MPa, that is 2 × 200,000 ÷ 560 = about **714 mm**. Few folded parts approach it, but large-radius curves, such as a rolled cover or a gentle cable tray lip, can, and they need a different process or a great deal of overbending. Chapter 5 shows how springback grows with radius long before the elastic limit.

## Edges start the cracks

A bend cracks first where the material is weakest, and that is usually at the cut edges where the bend line runs out. A punched or sheared edge carries a burr and a band of work-hardened material; a laser-cut edge carries a heat-affected zone. Both are less ductile than the sheet's interior, and both sit exactly where the outside of the bend is stretched hardest.

Two habits reduce the risk. Deburr before folding, so that a burr is not stretched open into a crack. And where burrs cannot be removed, fold with the burr side on the inside of the bend, where the material is compressed rather than stretched. A drawing note such as "BURR SIDE TO INSIDE OF BENDS" costs nothing and is worth adding on parts in less ductile materials or at tight radii. For the high-strength variant of the bracket, the folder confirmed that its laser-cut blanks had negligible burr but asked for the note anyway, because the same drawing might later be punched.

## The radius and what the part sits against

The inside radius has a twin on the outside of the bend: the outside radius is R + t, 4 mm for the bracket. That radius matters whenever the folded part sits in a corner of something else.

This is an illustration. The bracket's base sits on a conveyor frame rail, and one leg sits against the rail's vertical face. The rail is a rolled angle whose inside root radius is 6 mm. The bracket's outside corner at the base-to-leg bend has a radius of only 4 mm, so its corner meets the rail's 6 mm root fillet before its faces meet the rail's faces. The bracket's corner arc rests on the rail's fillet, and its faces stand off the rail's faces by (6 − 4) × (1 − 1 ÷ √2) = **0.59 mm** each. Bolted down, the bracket would either rock on the fillet or be pulled into it, bending the leg slightly and loading the corner rather than the faces. The calculation follows from placing the bracket's 4 mm arc tangent inside the rail's 6 mm arc: their centres are 2 mm apart along the diagonal, which moves the bracket's faces out by 2 mm × (1 − cos 45°).

The designer had two choices: increase the bracket's inside radius so that its outside radius exceeds 6 mm, which needs a die forming R4 or more and changes the flat pattern, or add a small spacer so that the bracket's leg sits clear of the rail's root. The designer chose a 2 mm spacer under the leg, because the folder's standard die and the calculated flat pattern could then stay unchanged.

## Choosing the radius

The choice usually settles quickly once the two limits are known:

1. Find the material's minimum radius from its supplier or from the Datsko–Yang estimate, and stay well above it.
2. Ask the folder what radius their standard die forms in this material and thickness.
3. Use that radius on the drawing, as an inside radius, for every bend if possible.
4. Use one radius for every bend on the part, so that the folder can make them all with one die.

A common published rule of thumb, from one fabricator's design guide, is an inside radius no smaller than the sheet thickness; the bracket's R2 in 2 mm sheet sits exactly at it. It is a reasonable default for mild steel and a poor one for less ductile materials, which may need 1.5t, 2t or more.

## How the radius appears on the drawing

The radius should be stated once, as an inside radius, usually in a general note: "INSIDE BEND RADIUS 2 UNLESS STATED". A radius dimensioned on every bend is a radius stated many times, which invites disagreement after an edit. If one bend needs a different radius, it carries its own dimension and the note's "unless stated" covers it.

The tolerance on the radius is usually loose, because the folder controls it through the die rather than by measurement, and because small radius variation affects the part through the bend allowance, which Chapter 4 handles. A tight radius tolerance on a folded part is rarely meaningful and should prompt a conversation with the folder.

Where the radius does matter to function, the drawing should say so in terms an inspector can check. Had the designer chosen to seat the bracket directly in the rail's corner rather than use a spacer, the drawing would have needed "OUTSIDE RADIUS 6.5 MIN AT BASE-TO-LEG BENDS", checked with a radius gauge, which is clearer than a tolerance on the inside radius that nobody can measure easily. And where it does not matter, the drawing should leave the folder free, because a folder who can use its standard die for every bend will make the part faster and more consistently than one forced into special tooling for a radius that nobody needs.

## Exercise: a thicker variant

The same bracket is wanted in 3.0 mm high-strength steel for a heavier drive. The material's test certificate gives a reduction of area of 40%, and the folder's chart gives an inside radius of 3.0 mm from its V16 die in this material, and 4.5 mm from its V24 die. Which radius would you put on the drawing, and what outside strain does it imply?

**Worked answer.** The Datsko–Yang estimate of the minimum radius is R_min = 3 × (50 ÷ 40 − 1) = **0.75 mm**, so ductility is not the limiting factor at either die's radius.

The V16 die's 3.0 mm radius is R = t, an outside strain of 3 ÷ (6 + 3) = **33%**, four times the estimated minimum radius. The V24 die's 4.5 mm radius gives 3 ÷ (9 + 3) = **25%**, more margin against cracking at the cost of a larger bend region, longer minimum flanges and more springback.

For a high-strength steel, where cracking risk depends on edges and grain as well as on the average ductility, the more conservative choice is the V24 die's **4.5 mm**, provided the 15 mm return flanges are still long enough for that die, which Chapter 7 checks. The drawing should say "INSIDE BEND RADIUS 4.5" and "BEND LINES ACROSS ROLLING DIRECTION", and the flat pattern must be recalculated for the new radius and thickness.
