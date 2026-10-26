---
book: oval-sheet-metal-work-by-the-numbers
chapterSlug: constructing-a-four-centre-oval
order: 2
title: "Constructing a four-centre oval"
description: "Find a four-centre oval's side radius, centres and tangent points from its length, width and end radius, choose the end radius, mark it out with a trammel, and catch a radius worked from full sizes."
draft: false
---

Traditional pattern books construct ovals by geometry: divide a line into thirds, swing arcs, draw lines through their intersections, and let the centres fall where they fall. The constructions work, but each gives one particular oval for a given length and width, and the drafter has little control over its shape. A shop that needs a specific oval, to fit a fence, match an existing lid or meet a capacity, does better to calculate it: choose the end radius, work out the side radius, and place the four centres by numbers.

This chapter derives the side radius from the length, width and end radius, works out the running case's centres, tangent points and arc angles, shows how the choice of end radius changes the oval, sets out a marking procedure, and ends with a side radius calculated from the full length and width instead of their halves.

## The setting-out

Put the oval's centre at the origin, its long axis along x and its short axis along y. Let the half-length be **a**, the half-width **b**, the end radius **r** and the side radius **R**.

- Each **end arc** is centred on the long axis, at x = ±(a − r), so that it reaches the oval's end at x = ±a.
- Each **side arc** is centred on the short axis, beyond the far side of the oval, at y = ∓(R − b), so that it reaches the oval's side at y = ±b.

The end arc and the side arc on the same quarter must touch with a common tangent. Two circles touch internally, one inside the other, when the distance between their centres equals the difference of their radii, R − r. The distance between the centres at (a − r, 0) and (0, −(R − b)) is √((a − r)² + (R − b)²). Setting that equal to R − r and solving for R:

R = [(a − r)² + b² − r²] ÷ [2(b − r)]

The same equation shows the limits. The end radius must be less than the half-width b, or the denominator is zero or negative: at r = b the side radius is infinite and the sides are straight, the flat oval. As r falls towards zero, R falls towards (a² + b²) ÷ 2b, and the ends become points.

```figure
type: formula
title: Side radius of a four-centre oval
formula: R = [(a − r)² + b² − r²] ÷ [2(b − r)]
caption: The running case's top oval: 1,800 × 900 mm on the mean line, end radius 300 mm.
- a, b | Half-length and half-width, 900 and 450 mm
- r | End radius, chosen, 300 mm
- R | Side radius, calculated
step: R = [(900 − 300)² + 450² − 300²] ÷ [2 × (450 − 300)] = 472,500 ÷ 300 = 1,575 mm
step: End centres at x = ±600 mm on the long axis
step: Side centres at y = ∓(1,575 − 450) = ∓1,125 mm on the short axis, outside the oval
```

## Tangent points and arc angles

The end arc meets the side arc at the point where the line through their two centres crosses the outline. For the running case, the line from the side centre at (0, −1,125) to the end centre at (600, 0) has a length of √(600² + 1,125²) = 1,275 mm, which is R − r = 1,575 − 300, as it must be. Extended 300 mm beyond the end centre, it reaches the tangent point at **(741.2, 264.7)** mm. The other three tangent points mirror it.

That line also sets the arcs' angles. It makes an angle of atan(600 ÷ 1,125) = **28.07°** with the short axis, so each side arc spans twice that, **56.14°**, and each end arc spans the rest of its half-turn, 180° − 56.14° = **123.86°**. Two end arcs and two side arcs together make 2 × 123.86 + 2 × 56.14 = 360°, a complete turn, which is a check on the arithmetic.

```figure
type: compare
title: The running case's four-centre oval
rowhead: Item
cols: Value | Check
caption: Mean-line dimensions. Every value can be checked against another.
- End radius | 300 mm | chosen
- Side radius | 1,575 mm | from the formula
- End centres | x = ±600 mm | a − r
- Side centres | y = ∓1,125 mm | R − b, outside the oval
- * Tangent points | (±741.2, ±264.7) mm | distance between centres 1,275 = R − r
- End arc angle | 123.86° each | 180° less the side arc
- Side arc angle | 56.14° each | 2 × atan(600 ÷ 1,125)
```

## Choosing the end radius

With the length and width fixed, the end radius is the one free choice, and it changes the oval's character. Keeping the running case's 1,800 × 900 mm:

- r = **200 mm** gives R = 1,305 mm: sharper ends, fuller sides;
- r = **300 mm** gives R = 1,575 mm, the running case;
- r = **350 mm** gives R = 1,912.5 mm;
- r = **400 mm** gives R = 2,925 mm: blunt ends, nearly straight sides;
- r = **449 mm** gives R = 102,150 mm, a side arc indistinguishable from straight, and at 450 mm the flat oval itself.

The side radius grows slowly at first and then very fast as r approaches b, which is why ovals with end radii above about 0.8 of the half-width look almost like flat ovals.

Practical considerations narrow the choice. The end radius should be large enough to roll comfortably in the sheet's thickness and to clean inside; the side radius should be one the shop's rolls can form, which for very large radii means the sides are left almost flat and pulled to shape at assembly. An end radius of about two thirds of the half-width, as in the running case, gives an outline very close to an ellipse of the same length and width.

```figure
type: bars
title: Side radius by chosen end radius, 1,800 × 900 mm oval
unit: mm
max: 3000
caption: The side radius rises slowly, then steeply as the end radius approaches the 450 mm half-width, where the sides become straight.
- End R200 | 1305
- End R250 | 1406.3
- * End R300 | 1575
- End R350 | 1912.5
- End R400 | 2925
```

## Marking out the oval

On a plate or the shop floor, the oval is marked from its axes:

1. Strike the long axis and the short axis at right angles, and check the right angle by a 3-4-5 triangle or by equal diagonals.
2. Mark the end centres on the long axis, 600 mm either side of the centre.
3. Mark the side centres on the short axis, 1,125 mm either side of the centre. They fall outside the oval, often outside the plate, and are marked on the floor or on scrap plate clamped beside it.
4. Draw the line from each side centre through the nearer end centres, and extend it to find the four tangent points.
5. Swing the end arcs, 300 mm radius, between their tangent points, and the side arcs, 1,575 mm radius, between theirs.
6. Check: length 1,800 mm, width 900 mm, and each tangent point 741.2 mm along and 264.7 mm across from the centre.

On a CNC table, the cutting file is generated from the same numbers, four arcs with their centres and end points, and the tangent points are the checks marked on the first part.

## Geometric constructions and the formula

Trade texts such as Neubecker's 1903 instruction paper construct ovals with compasses alone: a few divisions of the axes and some intersecting arcs locate the centres without any arithmetic. Every such construction produces a valid four-centre oval, because it places the centres so that the arcs share tangents, but each fixes the end radius by its own rule, and different constructions give different ovals for the same length and width.

The formula reverses the relationship. Instead of accepting whatever end radius a construction yields, the drafter chooses it and calculates the rest. Any oval drawn by a geometric construction can also be checked with the formula: measure its end radius and half-dimensions, calculate R, and compare it with the side radius actually drawn. If they differ, the construction was misdrawn somewhere, which is otherwise hard to see.

The calculated approach also suits the tools most shops now use. A spreadsheet holds the formula, a CAD sketch takes the centres and radii as dimensions, and a cutting program takes the arcs directly. The compass constructions remain useful on the floor, where a trammel and a chalk line are quicker than a calculator, but the numbers they produce should agree with the formula's to within the marking's accuracy.

## Templates for the two radii

Once the oval is set out, two templates serve every later step: one for the end radius and one for the side radius. Each is a board or a strip of thin sheet whose edge is an arc of that radius, used to check rolled pieces and the assembled vessel.

A template is checked by its chord and sagitta. This is an illustration. The shop's side template has a 1,000 mm chord on the 1,575 mm radius, so its arc rises 1,575 − √(1,575² − 500²) = **81.5 mm** above the chord at its middle. Its end template has a 400 mm chord on the 300 mm radius, rising 300 − √(300² − 200²) = **76.4 mm**. Both numbers are written on the templates, so that a template that has been bent or cut wrongly is found before it is trusted.

For the flared trough of later chapters, the radii change with height, so the shop makes templates for the top and the bottom of the walls, and checks the walls at both levels.

## Designing to a perimeter

Sometimes the length and width are fixed and the girth is too, because the oval must fit a rim, a gasket or a lid that already exists. Then the end radius is not free; it must be chosen so that the perimeter comes out right.

The perimeter rises steadily with the end radius at fixed length and width. For a 1,800 × 900 mm oval, an end radius of 100 mm gives a perimeter of 4,222.2 mm, 200 mm gives 4,289.0, 300 mm gives 4,383.7, and 400 mm gives 4,526.6. To fit an existing gasket 4,400 mm long, the end radius would be about **313.8 mm**, found by trying values in the perimeter formula of Chapter 3 until it matches. A spreadsheet's goal-seek does the same in a moment.

The method matters when a replacement part must match an old one whose drawing is lost. Measuring the old part's length, width and girth is enough to recover its end radius, and from that its centres, side radius and every pattern.

## The ellipse alongside

It is useful to know how close the oval is to the ellipse with the same axes. At the tangent point's x of 741.2 mm, the ellipse x²/900² + y²/450² = 1 has y = 450 × √(1 − (741.2 ÷ 900)²) = **255.3 mm**; the oval is at 264.7 mm, 9.4 mm outside the ellipse. Measured square to the curves, the greatest gap between them is about 12.8 mm, near x = 810 mm on the end arc; across the middle of the sides and at the very ends the two outlines nearly coincide. For a vessel whose capacity or fit matters to a few millimetres, that is why "1,800 × 900 oval" must say which; for an outline that only has to look oval, either will do.

## The error: a radius from the full dimensions

This is an illustration. A drafter, working quickly, substituted the full length and width into the formula instead of the half-length and half-width: R = [(1,800 − 300)² + 900² − 300²] ÷ [2 × (900 − 300)] = **2,475 mm**, and placed the side centres 2,475 − 450 = 2,025 mm from the oval's centre so that the side arcs passed through the oval's width.

The side arcs and end arcs then did not meet. The distance between the end centre and the misplaced side centre was √(600² + 2,025²) = 2,112.0 mm, but for the arcs to touch it needed to be R − r = 2,175 mm. The side arcs passed **63 mm** inside where they should have met the end arcs, leaving a step at each of the four tangent points that no amount of rolling could hide.

The fault was found on the drawing, before any cutting, by the tangent point check in step 6: the line through the centres did not reach the outline where both arcs met it. The shop's oval spreadsheet now takes the full length and width as inputs and halves them itself, and prints the distance between centres beside R − r, so that the check is made every time. A mistake of this kind can survive a careless check, because the oval still measures 1,800 × 900 mm across its axes; only the tangent points reveal it.

```figure
type: checklist
title: Checks on a four-centre oval before cutting
caption: Each check is independent of the formula that produced the oval.
- Half-length and half-width used in the formula | a = 900, b = 450
- End radius less than the half-width | 300 < 450
- Distance between centres equals R − r | 1,275 mm
- Arc angles add to 360° | 2 × 123.86 + 2 × 56.14
- Tangent points on both arcs | (±741.2, ±264.7) mm
- x Full dimensions put into the formula | arcs 63 mm apart at the tangent points
```

## Exercise: a smaller oval

A trough for a smaller paddock is 1,200 × 600 mm on the mean line, with an end radius of 200 mm. Find its side radius, its centres, and its arc angles. How does it relate to the running case's oval?

**Worked answer.** a = 600, b = 300, r = 200 mm.

- R = [(600 − 200)² + 300² − 200²] ÷ [2 × (300 − 200)] = (160,000 + 90,000 − 40,000) ÷ 200 = **1,050 mm**.
- End centres at x = ±400 mm; side centres at y = ∓(1,050 − 300) = ∓**750 mm**.
- The side arcs' half-angle is atan(400 ÷ 750) = 28.07°, so each side arc spans **56.14°** and each end arc **123.86°**.

Every dimension is two thirds of the running case's, and the angles are identical, because the smaller oval has the same proportions: length twice width and end radius a third of the width. Ovals of the same proportions are scaled copies, and one set of calculations serves the whole family.
