---
book: stiffening-sheet-metal-by-the-numbers
chapterSlug: deflection-and-stress-of-a-flat-panel
order: 2
title: "Deflection and stress of a flat panel"
description: "Calculate a rectangular panel's deflection and bending stress under pressure for supported and clamped edges, see why the short side governs, and catch a calculation that used the long side."
draft: false
---

A flat rectangular panel loaded by uniform pressure is one of the oldest solved problems in structural mechanics. The answers are tabulated as coefficients that depend only on the panel's aspect ratio and its edge conditions, and with them a designer can estimate deflection and stress in a few lines. The catch is that the formulas carry assumptions about the edges, the size of the deflection and which side is which, and a mistake in any of them produces a confident wrong answer.

This chapter sets out the formulas, applies them to SP-90 with both supported and clamped edges, shows how strongly the short side controls the result, and checks the hand calculation against a calculator. It ends with an error that made SP-90 look five times worse than it is.

## The two formulas

For a rectangular plate of short side a and long side b, under a uniform pressure q, small-deflection theory gives the largest deflection and the largest bending moment per unit width as:

```figure
type: formula
title: Uniformly loaded rectangular plate, small deflection
formula: w = α q a⁴ / D     σ = 6 β q a² / t²
caption: Coefficients α and β come from tables for the plate's aspect ratio b/a and edge conditions (Timoshenko and Woinowsky-Krieger). Here a is always the shorter side. The formulas assume a deflection smaller than about half the thickness.
- w | Largest deflection, mm
- σ | Largest bending stress at the surface, MPa
- q | Uniform pressure, MPa (250 Pa = 0.00025 MPa)
- a | Short side of the panel, mm
- t | Sheet thickness, mm
- D | Flexural rigidity, N·mm (Chapter 1)
- α, β | Deflection and moment coefficients for b/a and the edge condition
```

The stress formula comes from the largest bending moment per unit width, M = β q a², divided by the section modulus of a unit strip of sheet, t² / 6. For a simply supported panel the largest moment is at the centre; for a clamped panel it is at the middle of each long edge, where the edge restraint bends the sheet back the other way.

### The coefficients

The coefficients below are the classical values for a Poisson's ratio of 0.3. They are reproduced widely in plate texts and handbooks; the important feature is how they change with aspect ratio.

```figure
type: compare
title: Plate coefficients for uniform pressure, ν = 0.3
cols: α, simply supported | β, simply supported (centre) | α, clamped | β, clamped (long edge)
caption: Classical small-deflection coefficients from Timoshenko and Woinowsky-Krieger. a is the short side. For aspect ratios between the rows, interpolate; the values change smoothly.
- b/a = 1.0 (square) | 0.00406 | 0.0479 | 0.00126 | 0.0513
- *b/a = 1.5 (SP-90) | 0.00772 | 0.0812 | 0.00220 | 0.0757
- b/a = 2.0 | 0.01013 | 0.1017 | 0.00254 | 0.0829
- b/a = 3.0 | 0.01223 | not needed here | not needed here | not needed here
- b/a very large (a long strip) | 0.01302 | 0.1250 | 0.00260 | 0.0833
```

The last row is a useful check on any table. A very long plate bends like a one-way strip spanning the short side, and for a simply supported strip the beam formula gives a centre deflection of 5 q a⁴ / (384 D), and 5 / 384 = 0.01302. For a clamped strip it gives q a⁴ / (384 D), and 1 / 384 = 0.00260. The table's limiting values are exactly the beam results, which is what one would expect.

## The running case: SP-90 under 250 Pa

This is an illustration. For SP-90, a = 600 mm, b = 900 mm, so b/a = 1.5. The sheet is 1.2 mm thick and D = 31,648 N·mm from Chapter 1. The pressure is 0.00025 MPa.

**Simply supported edges.** w = 0.00772 × 0.00025 × 600⁴ / 31,648. Since 600⁴ = 1.296 × 10¹¹, the deflection is **7.90 mm**. The moment at the centre is 0.0812 × 0.00025 × 600² = 7.31 N·mm per mm, and the stress is 6 × 7.31 / 1.2² = **30.5 MPa**.

**Clamped edges.** w = 0.00220 × 0.00025 × 600⁴ / 31,648 = **2.25 mm**. The moment at the middle of each long edge is 0.0757 × 0.00025 × 600² = 6.81 N·mm per mm, and the stress there is **28.4 MPa**.

```figure
type: stats
title: SP-90 as a flat 1.2 mm panel under 250 Pa
caption: This is an illustration using classical small-deflection coefficients. Both deflections exceed half the thickness, so Chapter 3's large-deflection correction applies to both.
- *7.90 mm | Deflection, simply supported | 6.6 times the thickness
- 2.25 mm | Deflection, clamped | 1.9 times the thickness
- 30.5 MPa | Bending stress, simply supported | at the centre
- 28.4 MPa | Bending stress, clamped | at the middle of the long edges
```

Two conclusions follow at once. First, stress is not SP-90's problem. Zinc-coated structural sheet of the kind in the running case has a yield stress of a few hundred megapascals, and 30 MPa is a small fraction of it; the panel bows a great deal without coming anywhere near yielding. Thin panels are almost always limited by stiffness, stability and vibration, not strength, which is why this book spends so little time on stress.

Second, the edge condition changes the deflection by a factor of 7.90 / 2.25 = 3.5. A screwed panel lies between the two. Its true deflection depends on screw pitch, frame stiffness and how tightly the sheet is pulled against the frame, and no table will give it exactly. That is a reason to design with the simply supported value, which errs on the safe side, and to measure the real panel, as Chapter 9 does.

### Keeping the units straight

Plate formulas are unforgiving of units because they raise a length to the fourth power. The safest habit is to work entirely in newtons and millimetres, so that stress and pressure are both in megapascals (N/mm²), stiffness D is in N·mm, and deflection comes out in millimetres. The common slip is the pressure: 250 Pa is 250 N/m², and since a square metre is a million square millimetres, it is 0.00025 N/mm². Entering 250 or 0.25 instead gives a deflection a million or a thousand times too large, which is at least obviously wrong. Entering 0.0025, a slipped decimal place, gives 79 mm, which a hurried reader might believe.

A quick sanity check catches most of these slips: the total load on the panel, pressure times area, should be a number that makes physical sense. For SP-90 it is 0.00025 × 600 × 900 = 135 N. A panel of this size under a few hundred pascals carries a load of the order of a hundred newtons, not tens of thousands.

### Where stress does matter

Low panel stress does not mean stress can be ignored everywhere. The stresses above are averages over a smooth plate. At the screws, the panel's edge reaction is concentrated into a few small areas, and the sheet around each hole carries local bending and bearing stress well above the plate's general level. When the extraction cycles on and off many times a day, or when the panel drums, those local stresses cycle too, and thin sheet can crack from a fastener hole after enough cycles.

That is a fatigue question, and it is answered with detail design rather than plate formulas: enough fasteners at a sensible pitch, washers or a stiffened edge under the screw heads, holes with clean edges, and no drumming. A panel that has been stiffened so that it no longer bows or drums also stops working its fastener holes, which is one more reason the static and dynamic targets matter together.

## The short side governs

The coefficient table hides a fact worth seeing directly: once a panel is about twice as long as it is wide, making it longer barely changes its deflection. The bars below keep SP-90's 600 mm short side and change only the long side.

```figure
type: bars
title: Deflection of a simply supported 1.2 mm panel, 600 mm wide, under 250 Pa
unit: mm
max: 14
caption: This is an illustration using the coefficients above. The panel's width is fixed at 600 mm and its length varies. Past a ratio of about 2, the long edges are too far away to help.
- 600 × 600 | 4.16
- *600 × 900 (SP-90) | 7.90
- 600 × 1,200 | 10.37
- 600 × 1,800 | 12.52
- 600 wide, very long | 13.33
```

A square panel deflects about half as much as SP-90, because its load is shared between four equally effective edges. A long panel deflects almost as much as a strip spanning its short side, because the short edges are too far from the middle to carry much of the load.

This has a direct design consequence. A stiffener that divides a panel should usually run across its short side, cutting the short span, or should be placed so that the bays it creates are closer to square. A stiffener running along the long side of SP-90 would create two bays 300 mm wide and 900 mm long, each a long strip. Two stiffeners across it create three bays 600 × 300 mm. Chapter 7 compares the two.

## Checking the hand calculation

A single calculation deserves a second method. The KEVOS® [rectangular plate calculator](/tools/rectangular-plate/) uses handbook flat-plate formulas, which are fitted approximations rather than the classical series coefficients used here. For SP-90's simply supported case it gives a deflection of 8.06 mm and a stress of 31.7 MPa. The two methods agree within 2% on deflection and 4% on stress, which is as close as two different approximations to the same ideal plate should be, and much closer than either is to a real screwed panel. When two methods disagree by more than a few per cent on the same inputs, the first thing to check is whether both used the same side as a.

## The error: the long side used as a

This is an illustration. In the builder's first review of SP-90, the calculation was done in a spreadsheet laid out with the panel's height first. The designer entered a = 900 mm, the height, and looked up α = 0.00772 for an aspect ratio of 1.5. The spreadsheet returned a deflection of 0.00772 × 0.00025 × 900⁴ / 31,648 = **40.0 mm**.

That number was taken to a meeting as evidence that the panel was hopeless and that nothing short of 2.5 mm sheet would do. It was the checker who noticed that 40 mm was three times the 13.3 mm limiting value for an infinitely long 600 mm strip of the same sheet. A plate cannot deflect more than a strip of the same width that has lost the help of its short edges. Something was wrong.

The error was the side. Because deflection depends on a⁴, using 900 instead of 600 multiplies the answer by (900 / 600)⁴ = 5.06. With a = 600 mm, the deflection is 7.90 mm, still too much but not absurd. The tables define a as the short side; the aspect ratio is always b/a ≥ 1, and using the long side with a coefficient for b/a = 1.5 corresponds to no real plate.

The office made two changes. The spreadsheet now sorts the two dimensions and labels them "short side a" and "long side b" before any lookup. And every plate calculation is now checked against the strip limit: for simply supported edges, the deflection must be less than 0.01302 q a⁴ / D, the long-strip value, and for clamped edges less than 0.00260 q a⁴ / D. A result above the strip limit is always an error.

## What the formulas do not cover

The classical formulas assume a perfectly flat plate, uniform thickness, ideal edges and small deflection. SP-90 violates the last one badly: a deflection of 7.90 mm is 6.6 times the thickness. Once deflection exceeds about half the thickness, the middle surface of the sheet must stretch for the panel to take up its bowed shape, and that stretching carries part of the load as membrane tension. The panel is then stiffer than small-deflection theory predicts, and the stress distribution changes. The KEVOS® calculator flags exactly this condition, warning when deflection exceeds half the thickness.

The formulas also assume the edges are held in their plane. If the frame is light and the screws slip, the membrane tension cannot develop fully and the panel is softer than the large-deflection result. Chapter 3 discusses both effects and explains the related problems of buckling and oil-canning. Two other departures are common in real panels. Openings for cables, windows or louvres remove material and create free edges inside the panel, and the plate around an opening is both more flexible and more highly stressed than the formulas suggest; Chapter 5 deals with how such edges are stiffened. And no cut and folded panel is perfectly flat. A panel with a slight initial bow responds differently depending on which way the pressure acts: pressure that pushes the bow further simply adds to it, while pressure against the bow can push the panel through flat and snap it to the other side. That snap is oil-canning, and it is why a panel that measures acceptably under suction can still bang when the pressure reverses or someone pushes it.

For design, the small-deflection value remains a useful upper estimate of deflection for a panel with edges that can pull in, and a reminder that a panel in the large-deflection range is already too flexible for most purposes.

## Exercise: a square bay

A designer proposes adding a single horizontal stiffener across SP-90 at mid-height, creating two bays of 600 × 450 mm, then wonders whether a square layout would be better. As a first step, take a 600 × 600 mm bay of the same 1.2 mm sheet under 250 Pa.

1. What are its deflection and centre stress with simply supported edges?
2. What is its deflection with clamped edges?
3. Is either result inside the small-deflection range?

**Worked answer.**

1. b/a = 1.0, so α = 0.00406 and β = 0.0479. w = 0.00406 × 0.00025 × 600⁴ / 31,648 = **4.16 mm**. M = 0.0479 × 0.00025 × 600² = 4.31 N·mm per mm, so σ = 6 × 4.31 / 1.44 = **18.0 MPa**.
2. With clamped edges, α = 0.00126 and w = 0.00126 × 0.00025 × 600⁴ / 31,648 = **1.29 mm**.
3. Neither is. Half the thickness is 0.6 mm, and both deflections exceed it, the simply supported one by a factor of almost seven. Making the bay square nearly halves the deflection, but a 600 mm bay of 1.2 mm sheet is still too flexible for small-deflection theory to describe well. The useful conclusion is that subdividing helps in proportion to the fourth power of the short span: halving a bay's short side while keeping its proportions cuts its deflection sixteen times, which is why Chapter 7's stiffeners are placed to shorten the 600 mm span rather than the 900 mm one.
