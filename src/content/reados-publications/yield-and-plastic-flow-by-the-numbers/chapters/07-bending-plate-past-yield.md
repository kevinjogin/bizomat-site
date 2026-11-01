---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: bending-plate-past-yield
order: 7
title: "Bending plate past yield"
description: "What happens through the thickness of a bend, the tightest radius a plate takes without cracking, how much it springs back, and why a punch change and a nesting change cracked a batch of brackets."
draft: false
---

A press brake makes a bend by forcing a plate well past its yield strength along a line. The outside of the bend stretches, the inside compresses, and when the punch lifts, the elastic part of the deformation springs back. Getting the bend right means knowing three numbers: the tightest radius the plate will take without cracking, the largest radius at which it will still take a permanent set, and how far it will spring back.

This chapter explains each from the stresses and strains through the thickness, works them for the HC-63's mounting brackets and its thin rod guard, and follows a batch of brackets that cracked after two small changes on the shop floor.

## What happens in a bend

Bend a plate and the fibres on the outside of the bend lengthen while those on the inside shorten. Somewhere between them lies a neutral surface that keeps its length. For a bend with inside radius R in a plate of thickness t, with the neutral surface at mid-thickness, the outer fibre's engineering strain is t ÷ (2R + t).

```figure
type: formula
title: Strain at the outer fibre of a bend
formula: e = t ÷ (2R + t)
formula: for the HC-63 bracket: 10 ÷ (2 × 15 + 10) = 0.25
caption: R is the inside bend radius and t the thickness, with the neutral surface at mid-thickness. For tight bends the neutral surface moves towards the inside, which raises the outer strain slightly; the simple form is close enough to compare designs.
- e | engineering strain at the outer surface
- R | inside bend radius
- t | plate thickness
```

A strain of 25% is large: more than the uniform elongation of most structural steels, and close to their elongation after fracture. A tight bend is one of the most severe deformations a fabricator routinely applies.

Through the thickness, the strain falls in a straight line from the outer surface to zero at the neutral surface and becomes compressive towards the inside. Near the neutral surface the strain is small enough to be elastic; everywhere else the metal has yielded. Because the bend is long and the plate cannot change its width easily, the metal deforms in plane strain, and its yield stress in the bending direction is about 1.15 times its tensile yield strength (Chapter 5).

## The tightest radius

A bend cracks on its outside when the outer fibre's strain exceeds the strain the metal can take locally before fracture. The reduction of area in a tensile test measures that local ductility (Chapter 2). Converting the reduction of area to the equivalent engineering strain of a fibre stretched at constant volume, and setting it equal to the outer fibre strain, gives a handbook formula for the minimum bend radius.

```figure
type: formula
title: Minimum and maximum bend radius
formula: Rmin = t × (50 ÷ r − 1),  and 0 if r is 50% or more
formula: Rmax = t × E ÷ (2 × YS)
caption: r is the tensile reduction of area in per cent. The minimum radius makes the outer fibre strain, t ÷ (2R + t), equal to r ÷ (100 − r). The maximum radius is the one at which the outer fibre just reaches yield: any larger, and the whole bend stays elastic and springs back flat.
- Rmin | smallest inside radius without cracking
- Rmax | largest inside radius that still takes a permanent set
- r | reduction of area, %
- E, YS | modulus and yield strength
```

The [minimum and maximum bend radius](/tools/bend-radius-limits/) tool applies both formulas to a planned radius and reports whether it is too tight, too large to form, or acceptable. It reminds the user that bends along the rolling direction need more radius, and that sheared or burred edges crack at larger radii than the formula predicts.

### Grain direction

A plate's ductility is not the same in every direction. Rolling stretches the inclusions in the steel, mainly manganese sulphides, into long stringers along the rolling direction. When a bend stretches the outer fibres along the rolling direction, the stringers lie along the strain and do little harm. When it stretches them across the rolling direction, the stringers lie across the strain and open up like a line of perforations. That is why a bend whose bend line runs across the rolling direction is the better one, and why drawings of formed parts often say so.

For the HC-63's 10 mm grade 350 bracket plate, the builder measured the reduction of area in both directions. This is an illustration.

```figure
type: compare
title: Bend radius limits for the HC-63's 10 mm bracket plate, in the bend radius limits tool
cols: Reduction of area | Minimum radius, mm | Outer strain at the minimum | 15 mm radius
rowhead: Bend line
- * Across the rolling direction (strain along it) | 55% | 0 (no limit) | not applicable | RADIUS ACCEPTABLE
- Along the rolling direction (strain across it) | 25% | 10 | 0.333 | RADIUS ACCEPTABLE
caption: This is an illustration. t = 10 mm, E = 200 GPa, YS = 380 MPa. The maximum radius for a permanent bend is 10 × 200,000 ÷ 760 = 2,632 mm, so no practical radius is too large for this plate.
```

## Springback

When the punch lifts, the elastic part of the bending stress through the thickness unloads, and the bend opens a little: the radius grows and the angle closes. How much depends on how much of the section is still elastic, which depends on the ratio of the bend radius to the thickness and of the yield strength to the modulus. A tight bend in thick, mild plate is almost all plastic and springs back very little; a gentle bend in thin, high-strength sheet is largely elastic and springs back a lot.

For an elastic, perfectly plastic material bent freely, the ratio of the radius before and after springback has a closed form, widely quoted in sheet metal handbooks.

```figure
type: formula
title: Springback in free bending
formula: x = Ri × YS ÷ (E t),    Ri ÷ Rf = 4x³ − 3x + 1
formula: K = (Ri + t ÷ 2) ÷ (Rf + t ÷ 2),    angle to bend to = final angle ÷ K
caption: Ri is the radius under load and Rf after release. K is the springback factor, the ratio of the final to the loaded bend angle. Valid while x is below 0.5; at 0.5 the bend is almost fully elastic.
- x | the springback parameter
- Rf | radius after springback
- K | springback factor
```

The [sheet metal bending springback](/tools/bending-springback/) tool returns the final radius, the springback factor, the angle to bend to and the springback in degrees, from the tool radius, thickness, yield strength, modulus and required angle. It refuses cases where x reaches 0.5, and notes that bottoming and coining reduce springback and that trial bends are essential.

```figure
type: compare
title: Springback for the HC-63's bracket and rod guard, in the springback tool
cols: Thickness, mm | Yield, MPa | Tool radius, mm | Final radius, mm | Angle to bend to for 90°
rowhead: Part
- * Mounting bracket, grade 350 plate | 10 | 380 | 15 | 15.13 | 90.58°
- Rod guard, 3 mm high-strength sheet, 10 mm punch | 3 | 550 | 10 | 10.28 | 92.21°
- Rod guard, 20 mm punch | 3 | 550 | 20 | 21.16 | 94.87°
- Rod guard, 30 mm punch | 3 | 550 | 30 | 32.70 | 97.70°
caption: This is an illustration. E = 200 GPa, yield from the certificates. The thick bracket springs back about half a degree; the thin, strong guard springs back up to almost eight degrees, rising quickly with the radius.
```

The bracket's springback is tiny, and the operator allows for it with the brake's angle setting after the first part. The guard's is large, and it varies with the yield strength of each sheet: a sheet 10% stronger springs back about 10% more. For the guard, the builder bends a trial piece from every new batch, as the tool's check advises.

## Force on the press brake

In air bending, the punch pushes the plate into a V-die without bottoming it, and the force is set by the plate's tensile strength, its thickness, the bend length and the die opening. The common handbook form is F = k L t² Rm ÷ V, with a die factor k of about 1.33 for a V-die whose opening is about eight times the thickness.

The [sheet and plate bend feasibility](/tools/bend-feasibility-check/) tool combines the three checks: the radius limits, the springback and the air-bending force against the press capacity, and it checks that the die opening is between about 6 and 12 times the thickness. It assumes air bending with the bend line across the rolling direction.

```figure
type: steps
title: The HC-63 mounting bracket in the bend feasibility tool
caption: This is an illustration. 10 mm plate, R = 15 mm, 90°, reduction of area 55%, YS 380 MPa, Rm 500 MPa, E 200 GPa; bend length 120 mm, V-die 80 mm, k = 1.33, 1,100 kN press brake.
- Radius limits | 0 to 2,632 mm: 15 mm is acceptable
- Springback | final radius 15.13 mm; bend to 90.58°
- * Bending force | 1.33 × 120 × 10² × 500 ÷ 80 = 99.8 kN, 9% of the press
- Die opening | 80 ÷ 10 = 8 times the thickness
- Result | BEND FEASIBLE
```

## What the bend leaves in the plate

A bend is not just a change of shape. The metal in it has been strained by up to 25%, and it carries the marks of that for the rest of its life.

**It is thinner on the outside and harder.** The outer fibres have stretched and thinned slightly, and the whole bend zone has work hardened along the flow curve of Chapter 3. Its yield strength at the outside may be well above the certificate's value, and its remaining ductility well below. A bend that is later straightened, re-bent or hammered uses up ductility that the first bend already spent, which is why re-bending a cracked or wrong bend is forbidden on the HC-63's brackets.

**It carries residual stress.** During bending the outer fibres are in tension and the inner in compression. When the punch lifts, the elastic unloading is a reversed bending stress across the whole section, and where the metal had yielded, the reversal overshoots: the outer surface ends up in residual compression and a layer below it in tension, with the opposite pattern on the inside. Those stresses are self-balancing and do no harm in a static bracket, but they add to service stresses in fatigue, and they are what makes a bent part move when it is later machined or welded.

**It may strain age.** As Chapter 3 described, carbon steel strained in a bend and then warmed, by galvanising, by welding nearby or simply by time, can strain age and lose toughness in the bend. Codes and galvanisers' guidance address this for structural steel with limits on bend radius for parts to be galvanised, and with stress relief where needed.

### The neutral surface and the blank length

The flat blank for a bent part is found by adding the straight lengths to the length of the neutral surface through each bend. For gentle bends, the neutral surface stays near mid-thickness. For tight bends, the inside compresses and thickens while the outside stretches and thins, and the neutral surface moves towards the inside of the bend; fabricators allow for that with a factor, often called the K-factor, which places the neutral surface at a fraction of the thickness from the inside, typically between about 0.3 and 0.5. The HC-63 bracket's blank length was set from the first trial bends and recorded on the drawing, which is more reliable than any factor.

### Bottoming and coining

Air bending sets the angle by how far the punch goes into the die, and springback must be allowed for. Bottoming presses the plate against the die's sides to set the angle, and coining goes further, squeezing the bend zone so hard that it yields through its whole thickness and has almost no elastic core to spring back. Both reduce springback a great deal, and both need several times the air-bending force; coining thick plate is rarely practical. For the bracket's 10 mm plate the brake has plenty of capacity for air bending and the springback is small, so air bending is used.

### Edges

The ends of a bend line meet the plate's cut edges, and edges are where bend cracks usually start. A sheared or plasma-cut edge has a work-hardened or heat-affected zone and small notches. The HC-63 brackets are laser cut, the burr side is placed on the inside of the bend, where it is compressed, and the corners at the ends of the bend line are radiused on the blank.

## The error: a punch change and a turned nest

One Monday, 30 of a batch of 200 brackets came off the press brake with fine cracks along the outside of the bend. Nothing about the plate had changed: same supplier, same grade, same certificate.

Two things had changed, each for a sensible reason. The 15 mm radius punch had gone out for regrinding, and the operator had used the 6 mm punch, which was the nearest available. And the programmer, to fit an extra bracket on each plate, had rotated the nest by 90°, so the bend lines now ran along the rolling direction instead of across it.

Neither change alone would have cracked the brackets. Together they did. With the bend line along the rolling direction, the outer fibre's strain runs across it, where the plate's reduction of area is only 25%, and the tool's minimum radius is 10 mm. A 6 mm radius puts an outer strain of 10 ÷ (2 × 6 + 10) = 0.455 on the outside, far beyond the 0.333 that a 25% reduction of area supports.

```figure
type: compare
title: The four combinations of punch and nest, in the bend radius limits tool
cols: Outer fibre strain | Minimum radius, mm | Result
rowhead: Punch and bend line
- * 15 mm, bend line across rolling | 0.250 | 0 | RADIUS ACCEPTABLE
- 15 mm, bend line along rolling | 0.250 | 10 | RADIUS ACCEPTABLE
- 6 mm, bend line across rolling | 0.455 | 0 | RADIUS ACCEPTABLE
- 6 mm, bend line along rolling | 0.455 | 10 | RADIUS TOO TIGHT: the cracked batch
caption: This is an illustration. 10 mm plate; reduction of area 55% along the rolling direction and 25% across it. Each change on its own was within the limits; together they were not.
```

The quality engineer found the cause by asking what had changed, and then by checking the rolling direction marked on the plate offcuts. The 30 cracked brackets were scrapped and the other 170 inspected by magnetic particle testing, which found fine cracks on 12 more. The bracket drawing now carries a note, "Bend line across the rolling direction; minimum inside radius 15 mm", and the nesting software has the rolling direction locked for that part. A punch change for a formed part now needs the drawing's radius to be checked first.

The episode also showed the limit of the handbook formula. A reduction of area of 25% predicts a minimum radius of exactly 10 mm, but bends near that limit crack or not depending on edge condition, bend speed and the plate's local inclusion content. The builder treats the formula's minimum as a line not to approach, and keeps its formed parts at least 50% above it.

## Exercise: the guard punch

The HC-63's rod guard is 3 mm sheet with a yield strength of 550 MPa and a reduction of area of 45% across the rolling direction. The available punches are 10, 20 and 30 mm. Find, for each, the minimum radius check and the angle to bend to for a 90° final angle. Which punch would you choose, and why?

**Worked answer.** The minimum radius is 3 × (50 ÷ 45 − 1) = 0.33 mm, so all three punches pass the cracking check comfortably. The maximum radius is 3 × 200,000 ÷ 1,100 = 545 mm, far above all three.

From the springback tool: with the 10 mm punch, x = 10 × 550 ÷ (200,000 × 3) = 0.00917, Rf = 10.28 mm, K = 0.976 and the angle to bend to is 92.21°. With 20 mm, Rf = 21.16 mm and the angle is 94.87°. With 30 mm, Rf = 32.70 mm and the angle is 97.70°.

The 10 mm punch is the best choice. Its springback is smallest, 2.2°, so variations in the sheet's yield strength change the final angle least: a 10% stronger sheet would add only about 0.2°, against about 0.8° with the 30 mm punch. Its outer strain, 3 ÷ 23 = 0.13, is well within the sheet's ductility. A larger radius would only be chosen for appearance or to reduce a stress concentration at the bend in service.
