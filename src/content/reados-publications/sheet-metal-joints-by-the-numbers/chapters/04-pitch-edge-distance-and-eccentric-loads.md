---
book: sheet-metal-joints-by-the-numbers
chapterSlug: pitch-edge-distance-and-eccentric-loads
order: 4
title: "Pitch, edge distance and eccentric loads"
description: "Lay out rivets with sound pitch and edge distance, share an eccentric load as shear and prying tension, combine the two, and catch a layout that raised rivet tension 2.6 times."
draft: false
---

Chapter 2 checked one rivet against its share of a direct load. Real joints have several rivets, laid out in a pattern, and their loads rarely act through the pattern's centre. A bracket that carries a plate some distance out from a wall loads its rivets in shear and also pries them in tension, trying to peel the bracket off the wall. How much tension each rivet sees depends on where it sits, and a pattern that looks tidy on a drawing can put several times more tension into its rivets than a pattern that looks slightly odd.

This chapter covers the layout rules for rivet pitch and edge distance and where they come from, then shares an eccentric load between rivets as shear and tension and combines the two in one check. The running case lays out EN-700's bracket rivets and finds that a proposed redesign, with the two rivets side by side instead of one above the other, would have raised the tension in each by a factor of 2.6.

## Edge distance and pitch

Two spacing rules appear in most guidance for riveted sheet:

- **Edge distance**, from a hole's centre to the edge of the sheet, of at least about **2 d**, so that tear-out does not govern, as Chapter 2 showed;
- **Pitch**, the spacing between neighbouring rivets, of at least about **3 d**, so that the sheet between holes keeps enough section and the rivets can be set without their tools colliding.

For EN-700's 4.8 mm rivets, those rules give an edge distance of at least **9.6 mm** and a pitch of at least **14.4 mm**; the bracket uses 10 mm and 40 mm.

There is also a **maximum** pitch for some joints. In a seam that must seal, the sheets bow apart between fasteners if they are too far apart, and water or dust gets in. In a joint that carries compression, thin sheet between widely spaced rivets can buckle. The maximum depends on the sheet's thickness, the sealant and the load, and design references and sealant makers give guidance. EN-700's clinched seams use 50 mm pitch with a sealant bead, a combination proven in its water test.

```figure
type: compare
title: Spacing rules for EN-700's 4.8 mm bracket rivets
cols: Rule | Minimum | Used in the bracket
caption: This is an illustration. The rules are common guidance, not a standard; a design standard or the rivet maker's data governs real joints.
- Edge distance in the load direction | About 2 d | 9.6 mm | 10 mm
- Edge distance sideways | About 2 d | 9.6 mm | 15 mm, the flange's half-width
- *Pitch between rivets | About 3 d | 14.4 mm | 40 mm
- Distance from a fold | Bend radius plus clearance | Per the folded part's design | Checked on the bracket drawing
```

## Where the rules come from

The 2 d and 3 d rules are not arbitrary; they fall out of Chapter 2's formulas. Using that chapter's simplifications, with the sheet's shear strength 0.6 times its tensile strength and its bearing strength 1.5 times, and ignoring the small difference between hole and rivet diameter:

- **Tear-out** at an edge distance e is 2 × (e − d ÷ 2) × t × 0.6 σ. At e = 2 d this is 2 × 1.5 d × 0.6 × t × σ = **1.8 d t σ**, which exceeds bearing, 1.5 d t σ. At e = 1.5 d it is only **1.2 d t σ**, below bearing. So an edge distance of about 2 d is where tear-out stops governing and bearing takes over.
- **Net section** for one rivet's strip of width p across the load is (p − d) × t × σ. That equals bearing when p − d = 1.5 d, at p = **2.5 d**. A pitch of 3 d keeps the net section comfortably stronger than bearing.

The rules therefore say, in short form, "space the rivets so that bearing, not tear-out or net section, governs the sheet". A design standard's own rules may differ in detail, because it uses its own strength ratios and safety factors, but the reasoning is the same.

## Matching hole patterns

A rivet in a hole only 0.1 mm larger than itself leaves almost no room for the two parts' holes to be misaligned. If the bracket's holes and the back wall's holes are drilled separately to the drawing, any error in either pattern pushes the rivet against one side of each hole, and some rivets bear before others. The usual practice is to make one part's holes first and drill the other through them at assembly, or to make both with the same tooling so that the patterns match. EN-700's bracket holes are punched with the bracket; the back wall's holes are drilled through the bracket once it is clamped in position, which guarantees alignment and costs a few seconds per hole.

## Eccentric loads

EN-700's equipment plate sits about 80 mm out from the back wall, so its load on each bracket acts 80 mm from the rivets. That offset makes a moment, 368 N × 80 mm = **29,440 N·mm** per bracket, which the bracket joint must resist as well as the downward shear.

The bracket resists the moment by pressing its lower edge against the wall and pulling on its upper rivets, like a door hinge. The lower edge acts as a pivot, and each rivet's tension is proportional to its distance from that pivot. For rivets at distances y₁, y₂ … from the pivot, rivet i carries a tension of **M × yᵢ ÷ Σy²**.

```figure
type: formula
title: Prying tension in rivets resisting a moment about a pivot edge
formula: Tᵢ = M × yᵢ ÷ Σ(y²)
caption: This is an illustration for one EN-700 bracket, with rivets 10 mm and 50 mm above the pivot at the flange's lower edge. The method assumes a stiff bracket pivoting about its lower edge.
- M | Moment at the joint, load × offset
- yᵢ | Distance of rivet i from the pivot edge
- Σ(y²) | Sum of the squares of all the rivets' distances
step: M = 368 × 80 = 29,440 N·mm; Σ(y²) = 10² + 50² = 2,600 mm²
step: Upper rivet: 29,440 × 50 ÷ 2,600 = 566 N
step: Lower rivet: 29,440 × 10 ÷ 2,600 = 113 N
```

The upper rivet carries most of the tension, about **566 N**, three times its shear of 184 N. The tension, not the shear, is the larger load on the bracket's rivets.

## Combining shear and tension

A rivet carrying both shear and tension is checked with an interaction formula, which recognises that each load uses up part of the rivet's capacity. A common form is (T ÷ Tᵣ)² + (V ÷ Vᵣ)² ≤ 1, with T and V the applied tension and shear and Tᵣ and Vᵣ the rivet's rated tensile and shear strengths. The rivet maker or the design standard specifies the form to use for a particular rivet, and the one here is an illustration.

This is an illustration. The upper rivet's check, with the illustrative ratings of 3,000 N tension and 2,400 N shear, is (566 ÷ 3,000)² + (184 ÷ 2,400)² = 0.036 + 0.006 = **0.041**, well within 1. The back wall's pull-through around the rivet's head, about 6,876 N from Chapter 3, is also far above 566 N.

## The error: two rivets in a row

This is an illustration. During a cost review, someone proposed shortening each bracket's vertical flange and placing its two rivets side by side, both 10 mm above the pivot edge, to save a little steel and give a neater look. The proposal was checked before it was adopted.

With both rivets at y = 10 mm, Σy² = 10² + 10² = 200 mm², and each rivet's tension becomes 29,440 × 10 ÷ 200 = **1,472 N**, about **2.6 times** the upper rivet's 566 N in the original layout. The interaction check rises from 0.041 to about **0.247**: still within 1 on paper, but a sixfold reduction in margin, in a joint that had already failed once in vibration, and the back wall's thin sheet would be pulled hard by two closely spaced heads near its pivot. The proposal was rejected, and the review noted the reason on the bracket drawing so that it would not be proposed again.

```figure
type: bars
title: Tension in the most heavily loaded bracket rivet, by layout
unit: N
max: 1600
caption: This is an illustration for a 29,440 N·mm moment. Spreading rivets away from the pivot edge cuts their tension sharply; bunching them near it raises it.
- Three rivets at 10, 30 and 50 mm | 421
- *Two rivets at 10 and 50 mm | 566
- Two rivets side by side at 10 mm | 1472
```

## Why distance from the pivot matters

The prying formula has the rivets' distances squared in its denominator, so moving a rivet away from the pivot both increases its lever arm and spreads the moment over a larger Σy². A rivet near the pivot does little: in the original layout, the lower rivet at 10 mm carries only 113 N of tension, a fifth of the upper rivet's. Its main job is shear, which it shares equally. The upper rivet does almost all the work against the moment, and its position, as far from the pivot as the flange allows while keeping its edge distance, is what makes the joint efficient.

## When the load reverses

A road journey does not only push the plate down; it also throws it upwards. When the load on the bracket reverses, so does the moment, and the bracket pivots about its **upper** edge instead, pulling on its lower rivet. In EN-700's 60 mm flange, the lower rivet sits 50 mm below the upper edge and the upper rivet 10 mm below it, so the reversed case is the mirror of the first: the lower rivet carries the larger tension. A layout checked only for the downward load can be weak for the upward one. EN-700's symmetrical layout, with each rivet 10 mm from one edge and 50 mm from the other, gives the same worst-case tension both ways, which is one more reason the two-in-a-row proposal, with no rivet far from either edge, was a poor one.

## Rows and staggering

Joints with many rivets, such as a long seam or a wide strap, use rows. Rivets in a **chain** pattern sit in line across the rows; in a **staggered** pattern, each row's rivets sit opposite the gaps in the next. Staggering keeps more sheet between holes along any straight line across the joint, so the net section is less reduced, and it lets rivets sit closer together for the same minimum pitch. The cost is a slightly more complex layout and drilling programme. For EN-700's small brackets, a single column of rivets is enough; for its seams, a single row of clinches at 50 mm pitch.

## The sheet around the rivet

Prying tension also loads the thin sheet the rivet is set in. EN-700's 1.2 mm back wall is flexible, and the upper rivet pulling at 566 N dishes the wall slightly around the rivet's head. That local flexibility relieves the rivet a little and lets the bracket rotate a little, which is why the method above assumes a stiff bracket and a stiff wall and is conservative for the bracket and less so for the wall's long-term fatigue. For brackets carrying heavier loads, a backing strip inside the wall, or a doubler under the rivets, spreads the load into more sheet. EN-700's brackets, at these loads, did not need one; a bracket carrying twice the plate would be worth a second look.

## Fasteners in a group: the centroid

When a group of fasteners carries a load in its own plane but offset from the group's centre, the group rotates about its **centroid**, and each fastener's shear includes a share of the twisting moment in proportion to its distance from the centroid. The method is the same as the prying method above, applied in the plane of the joint. It matters for gussets, brackets fixed to a side wall with the load acting across the pattern, and long hinge leaves loaded at one end. The fasteners furthest from the centroid always carry the most, which is why groups are spread out rather than bunched.

## Drawing the layout

A rivet layout on a drawing should dimension every hole from the same datum, give the edge distances in both directions and the pitch, and state the hole size and the rivet's part number. For a load-bearing joint, a note referring to the calculation, "bracket rivets checked for 368 N shear and 29,440 N·mm moment, see calculation sheet", tells the next designer that the layout was chosen for a reason and where to find it. EN-700's bracket drawing now carries that note, and the cost review's proposal would have met it at once.

## Exercise: a third rivet

Suppose EN-700's bracket flange is lengthened to take a third rivet, placing rivets at 10, 30 and 50 mm above the pivot edge. With the same moment of 29,440 N·mm and the shear of 368 N shared equally, what are the three rivets' tensions and the most heavily loaded rivet's interaction value? Is the third rivet worth adding?

**Worked answer.** Σy² = 10² + 30² + 50² = 3,500 mm². The tensions are 29,440 × 10 ÷ 3,500 = **84 N**, 29,440 × 30 ÷ 3,500 = **252 N** and 29,440 × 50 ÷ 3,500 = **421 N**. Each rivet's shear is 368 ÷ 3 = about 123 N.

The upper rivet's interaction value is (421 ÷ 3,000)² + (123 ÷ 2,400)² = about **0.022**, against 0.041 with two rivets. The third rivet cuts the worst tension by about a quarter and roughly halves the interaction value. On a joint that has already failed once in vibration, that margin is cheap at one rivet per bracket; on a joint with a clean test record, it might not be needed. The decision is the designer's, but the numbers make it an informed one.
