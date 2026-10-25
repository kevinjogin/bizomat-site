---
book: thermit-welding-by-the-numbers
chapterSlug: sizing-the-charge
order: 4
title: "Sizing the charge"
description: "Turn the 1910 rule of eighteen ounces per cubic inch into SI, size the crusher-frame charge from the mould volume or a wax pattern, and see what an undersized charge does."
draft: false
---

A thermit weld must make enough steel to fill the joint, the collar around it and the channels that carry metal in and let slag and air out, with enough left over to feed the shrinkage as the weld freezes. Too little and the weld is short of metal, with cavities or an unfilled collar. Too much wastes material and adds heat and slag to handle. In 1910, Hart gave a simple rule for sizing the charge, built from three facts. Converted to SI and checked against Chapter 1's chemistry, it is still a clear way to see what a charge must do.

This chapter derives the rule, sizes the crusher-frame charge, checks the result with Hart's second rule based on a wax pattern, and looks at what happens when a charge is too small.

## Hart's rule of eighteen

Hart's rule was to use 18 ounces of thermit for every cubic inch of empty space in the mould that the steel had to fill, around and between the parts. He explained the figure in three steps:

1. a cubic inch of steel weighs about 4½ ounces;
2. the thermit produces steel equal to half its own weight, so it takes twice as much thermit by weight, 9 ounces, to make that cubic inch of steel;
3. the runner and riser take as much metal as the inside of the mould, so the figure is doubled again, to 18 ounces per cubic inch.

Each step can be checked against modern data, which is a good habit with any rule of thumb inherited from an old book. A cubic inch is 16.387 cm³, and at 7.85 g/cm³ steel weighs about 128.6 g, which is 4.54 ounces, so the first step is right. The second uses the round figure of half for the iron yield, slightly below the theoretical 52 to 55% from Chapter 1, which leaves a margin for losses. The third is a practical allowance for the metal that ends up in the runner and riser rather than the weld.

## The rule in SI

In SI units, the same three steps give:

1. a cubic centimetre of steel weighs about 7.85 g;
2. at a yield of half, it takes 15.7 g of thermit to make it;
3. doubling for runner and riser gives about **31.4 g of thermit per cubic centimetre** of surplus mould space, or **31.4 kg per litre**.

Hart's 18 ounces per cubic inch converts to 18 × 28.35 ÷ 16.387 ≈ 31.1 g/cm³, the same figure within rounding. The rule is worth remembering in this form because it makes the scale obvious: every litre of space to be filled with weld metal takes about 31 kg of thermit, roughly four times the 7.85 kg of steel that litre actually holds.

```figure
type: formula
title: Hart's 1910 charge rule converted to SI
formula: thermit mass = V × ρ_steel ÷ yield × runner-and-riser factor
caption: Hart's three steps: the density of steel, a yield of half, and doubling for the runner and riser. Modern portions are sized by the supplier for each mould, but the rule shows what a charge has to supply.
- V | surplus mould space to be filled with steel, cm³
- ρ_steel | 7.85 g/cm³
- yield | 0.5 (Hart's working figure)
- runner-and-riser factor | 2
step: thermit per cm³ = 7.85 ÷ 0.5 × 2 = 31.4 g
step: thermit per litre of surplus space = 31.4 kg
```

## The crusher-frame mould volume

This is an illustration. The contractor's proposal for the 200 × 150 mm tension member includes:

- a **gap** of 25 mm between the prepared faces of the cracked member, cut out to remove the crack and give the iron room to fuse the faces;
- a **collar** of weld metal 25 mm thick around the whole member, extending 50 mm beyond the gap on each side, so 125 mm long in total, to reinforce the joint and move the edges of the fusion zone away from the gap.

The surplus space is the volume of the gap plus the volume of the collar:

- gap: 200 × 150 × 25 = 750,000 mm³ = **0.75 L**;
- collar: the outer section is (200 + 2 × 25) × (150 + 2 × 25) = 250 × 200 = 50,000 mm², the member occupies 30,000 mm², so the collar section is 20,000 mm², and over 125 mm its volume is 2,500,000 mm³ = **2.50 L**;
- total surplus space: **3.25 L**.

By the SI rule, the charge is 3.25 × 31.4 ≈ **102 kg** of thermit.

```figure
type: compare
title: Mould volume and charge for the crusher-frame weld
cols: Volume | Thermit by the SI rule
caption: This is an illustration. The collar holds more than three times the metal in the gap itself, so it dominates the charge.
- Gap, 200 × 150 × 25 mm | 0.75 L | 23.6 kg
- Collar, 25 mm thick, 125 mm long | 2.50 L | 78.5 kg
- *Total surplus space | 3.25 L | 102 kg
- Steel needed to fill the mould alone | 3.25 L | 25.5 kg of steel
```

Two points stand out. The collar holds more than three times as much metal as the gap, so it dominates the charge. And the steel needed just to fill the mould is only 3.25 × 7.85 ≈ 25.5 kg, a quarter of the charge mass. The rest of the charge becomes slag, the metal in the runner and riser, and the margin.

## Hart's wax rule

Hart gave a second rule for welds where the collar was first modelled in wax around the joint and the mould built around the wax, which is then melted out: use a thermit weight 32 times that of the wax. The weight of wax used was found by weighing the wax lump before and after building the pattern.

The thirty-two follows from the same reasoning. Wax has a density of roughly 0.9 to 0.96 g/cm³, so a cavity that holds a given mass of wax holds about 7.85 ÷ 0.92 ≈ 8.5 times that mass of steel. Doubling for the yield of half and doubling again for the runner and riser gives about 8.5 × 2 × 2 ≈ 34, close to Hart's 32.

This is an illustration. For the crusher frame, a wax pattern of the gap and collar, 3.25 L at about 0.92 g/cm³, would weigh about 2.99 kg, and 32 times that is about **96 kg**, within about 6% of the 102 kg from the volume rule. The two rules agree as closely as the assumed wax density allows, which is a useful cross-check: a large difference between them would point to an error in measuring either the mould or the wax.

## What the margins are for

The rule's two allowances, a yield of half and a doubling for the runner and riser, are generous, and for good reason.

If the theoretical magnetite yield of 55.2% were used instead of half, with the same doubling, the charge would be 3.25 × 7.85 × 2 ÷ 0.552 ≈ **92 kg**, ten kilograms less. That ten kilograms is the margin for iron lost as spatter, iron left in the crucible, impurities in the ingredients and additions that dilute the yield.

The doubling for the runner and riser covers the metal that fills the channel from the crucible into the mould, the metal that rises up the riser, and the metal that feeds the weld as it shrinks. Chapter 5 explains how the riser works, and Chapter 7 how much the weld shrinks. A charge sized only to fill the joint, with nothing for the riser, would leave the last metal to freeze in the weld itself, where its shrinkage would form a cavity.

A charge that is much too large has its own costs. Every extra kilogram adds roughly 3.7 MJ of heat to the job, more slag to catch and dispose of, more fume, and more metal in the riser and overflow to cut off afterwards. It can also overheat the mould and the parts, enlarging the heat-affected zone around the weld. More is not safer; the right charge is the one designed for the mould, with the margins the design intends and no more.

## Charges from the early repairs

The early books record the charges used on real repairs, which give a sense of scale. Hart described a ship's stern frame repaired with 416 pounds of thermit, about 189 kg, together with 35 pounds (about 16 kg) of mild steel punchings and 8 pounds (about 3.6 kg) of metallic manganese. He also reported a railway test in which a section of a cast steel locomotive frame, 4 by 5½ inches, was welded with 75 pounds of thermit, about 34 kg, plus 12 pounds (about 5.4 kg) of punchings and 1½ pounds (about 0.7 kg) of manganese, in a mould cut from firebrick. Viall noted that welds needing 4,000 pounds of thermit or more, about 1,800 kg, had been made successfully.

The locomotive frame section was 4 × 5½ = 22 square inches, about 14,200 mm², and took about 34 kg of thermit, roughly 2.4 kg per 1,000 mm² of section. The crusher frame's 30,000 mm² section takes 102 kg by the rule, about 3.4 kg per 1,000 mm². The crusher charge is proportionally larger mainly because its collar is generous, which is a design choice for a heavily loaded tension member rather than a requirement of the method. Comparisons of this kind are crude, because collar size and gap vary from job to job, but they show that the rule produces charges of the same order as the early repairs.

## Additions and the charge

The punchings and manganese in those charges were not thermit. The punchings melted into the weld metal, adding steel, and the manganese alloyed it, as Chapter 8 explains. Because the punchings became weld metal themselves, they slightly reduced the thermit needed for a given mould, but they also absorbed heat (Chapter 2), so they could not be added freely. Hart's punchings were roughly 8 to 16% of the thermit's weight. Modern portions include their additions in the supplier's design, so the user never has to balance the two.

## Measuring the mould

The rule is only as good as the volume it is applied to. A rectangular gap and collar can be calculated from dimensions, but real joints are rarely so tidy. A crack cut out by flame or air-arc gouging leaves irregular faces; a cast part has radii, tapers and bosses; and the gap must be measured after preparation, not as drawn. Hart's wax method was in part a solution to this: the wax pattern fills whatever shape the joint really has, and weighing the wax measures its volume without any geometry. For the crusher frame, the contractor would measure the prepared gap at several points and use the largest, and the engineer would ask for the measured, not the nominal, dimensions in the weld record.

## Modern portions

Modern thermit is not weighed out by the user. The supplier designs the mould and the portion together for a particular joint, such as a given rail section and gap, and supplies the portion sealed, with its alloying additions included. The quarry engineer's job is not to size the charge but to check that the contractor's proposal makes sense: that the portion is the one designed for the joint, and that the mould, gap and collar match the supplier's design.

For a one-off heavy repair like the crusher frame, the contractor designs the mould and orders a portion to suit. Hart's rule gives the engineer an independent check on the order of magnitude: if the contractor had proposed 30 kg or 300 kg for a 3.25 litre mould, something would need explaining.

## A failure: the forgotten collar

This is an illustration. In the contractor's own records, which the engineer reviewed when assessing the proposal, was a case from another site. A heavy repair to a cast steel housing had been poured with a charge calculated from the gap volume alone, about a quarter of what the mould needed once the collar was included. The mould did not fill: the collar was incomplete on one side, the riser was empty, and the weld had a large shrinkage cavity in the gap where the last metal had frozen without any feed.

From this chapter's rule, a gap-only charge for the crusher frame would have been 0.75 × 31.4 ≈ 23.5 kg instead of 102 kg. The failed weld was cut out and repeated with a charge calculated from the full mould volume, confirmed by the wax rule. The contractor added an independent check of the charge calculation, by a second person and by the alternative rule, to its procedure for one-off welds.

## Exercise: a rail weld by the 1910 rule

A 50 kg/m rail has a cross-section of about 50 ÷ 7,850 m² ≈ 6,370 mm². Suppose a weld has a 25 mm gap and a collar volume of 0.30 L. Using the SI version of Hart's rule, calculate the surplus mould space and the charge, and the mass of steel needed just to fill the mould.

The gap volume is 6,370 × 25 = 159,000 mm³ ≈ **0.159 L**, so the surplus space is about 0.159 + 0.30 = **0.459 L**. The charge by the rule is 0.459 × 31.4 ≈ **14.4 kg**, and the steel needed to fill the mould is 0.459 × 7.85 ≈ **3.6 kg**.

This is a check on the method, not a rail welding specification. Modern rail portions are designed by their suppliers for each rail section, gap and mould, with alloying additions to match the rail steel (Chapter 8), and only those approved portions are used.
