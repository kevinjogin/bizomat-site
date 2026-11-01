---
book: bulk-solids-flow-by-the-numbers
chapterSlug: internal-and-wall-friction
order: 4
title: "Internal and wall friction: what a shear test tells you"
description: "Yield loci, effective angle of internal friction, unconfined yield strength and the flow function from a shear test, wall friction and the tilt test, and why the wall coupon must match the wall."
draft: false
---

Friction runs through everything a bulk solid does. Friction between particles lets it hold a slope, carry shear and form an arch. Friction between particles and a wall lets the wall carry part of the weight and decides whether material slides down a hopper or sticks to it. Both are measured by shearing a sample under a known normal stress, and the results, a handful of numbers on a test report, are the inputs to every design check in the rest of this book.

This chapter explains what a shear test measures and how to read its report, using test results for Plant C's two materials. It shows a simple tilt test for wall friction that a plant can run itself, and it describes the mistake that nearly sent B2's replacement hopper to the workshop with the wrong steel finish.

## Friction inside a bulk solid

A dry, coarse granular material such as S1's pellets behaves, to a good approximation, like a pile of blocks with friction between them. If a shear stress τ is applied on a plane carrying a normal stress σ, the material shears along that plane when

τ = σ tan φ_i

where φ_i is the angle of internal friction. There is no strength at zero normal stress: an unloaded heap of pellets has none, which is why it slumps to a slope.

A cohesive powder such as B2's filler also has strength at zero normal stress, because its particles stick together. Its failure line on a plot of τ against σ, called the **yield locus**, does not pass through the origin. More importantly, the yield locus depends on how hard the sample was squeezed before it was sheared. A powder consolidated under a high stress packs more densely, makes more and stronger contacts and becomes stronger. Every consolidation stress has its own yield locus.

## How a shear test works

Two kinds of tester are in common use, both covered by ASTM standard test methods: the translational Jenike shear cell (ASTM D6128) and rotational ring shear testers such as the Schulze tester (ASTM D6773). Both do the same two things in sequence.

1. **Pre-shear.** The sample is consolidated under a chosen normal stress and sheared until the shear stress stops changing. The sample is now in steady flow at that stress, the state the material is in when it flows in a hopper.
2. **Shear to failure.** The normal stress is reduced to a lower value and the sample is sheared again until it fails. The peak shear stress is one point on the yield locus.

Repeating step 2 at several lower normal stresses, each after a fresh pre-shear, maps out one yield locus. Repeating the whole procedure at several pre-shear stresses gives a family of yield loci.

From each yield locus, two Mohr circles drawn tangent to it give the two numbers that matter most.

- The **major consolidation stress**, σ₁, is the largest principal stress the sample was under during pre-shear: how hard it was squeezed.
- The **unconfined yield strength**, σ_c, is the largest principal stress the sample can take on a free surface, with nothing pressing on it from the side: how strong it is after that squeezing.

```figure
type: steps
title: From shear cell readings to the flow function
caption: Each pre-shear stress gives one yield locus and one point on the flow function. Four to five points, covering the stresses in the hopper outlet region, are typical for a design test.
- Choose a pre-shear normal stress | for example 2 kPa, near the stresses at an outlet
- Pre-shear to steady flow | the sample is consolidated and flowing
- Shear to failure at lower normal stresses | three or four points on one yield locus
- Draw Mohr circles tangent to the yield locus | read σ₁ and σ_c
- Repeat at higher pre-shear stresses | each gives another (σ₁, σ_c) pair
- * Plot σ_c against σ₁ | the flow function, FF
```

The line through the (σ₁, σ_c) points is the **flow function**. It says how strong the material becomes for each level of consolidation. The steady-flow points also give the **effective angle of internal friction**, δ, which describes friction during steady flow and is used in the mass-flow calculations of Chapter 6, and the bulk density at each consolidation stress, used in Chapter 2.

## Plant C's test reports

The plant sent samples of both materials to a powder testing laboratory. This is an illustration.

For S1's pellets the report was short. The yield loci passed through the origin within the scatter of the test: no measurable cohesion. The angle of internal friction was 32° and the effective angle of internal friction also about 32°. The wall friction angle on a coupon of the silo's 304 stainless steel with its mill (2B) finish was 14°.

For B2's filler the report ran to several pages. The key results were:

- **Flow function.** At major consolidation stresses of 1, 2, 4 and 8 kPa, the unconfined yield strength was 0.80, 1.10, 1.65 and 2.60 kPa.
- **Effective angle of internal friction.** About 48°, high, as is usual for fine cohesive powders.
- **Wall friction angle** on 2B stainless steel: 26° at the lowest wall normal stress tested, falling to about 24° at the highest.
- **Bulk density** rising from about 760 kg/m³ at 1 kPa to about 900 kg/m³ at 8 kPa.

## Reading flowability from the flow function

The ratio of the consolidation stress to the strength it produces, ff_c = σ₁ ÷ σ_c, is a convenient single measure of flowability at a given stress. Jenike proposed, and Schulze's textbook sets out, a classification still widely used:

```figure
type: compare
title: Flowability of B2's filler from its flow function
rowhead: Major consolidation stress σ₁
cols: Unconfined yield strength σ_c | ff_c = σ₁ ÷ σ_c | Class
caption: This is an illustration. Classes follow the commonly used scheme: ff_c below 1 not flowing, 1 to 2 very cohesive, 2 to 4 cohesive, 4 to 10 easy-flowing, above 10 free-flowing. The filler is worst at the low stresses found near an outlet.
- 1 kPa | 0.80 kPa | * 1.25 | very cohesive
- 2 kPa | 1.10 kPa | 1.82 | very cohesive
- 4 kPa | 1.65 kPa | 2.42 | cohesive
- 8 kPa | 2.60 kPa | 3.08 | cohesive
```

Two things stand out. First, the filler is very cohesive at the low stresses near an outlet, which is where arches form. Second, ff_c improves with stress, which is common: the strength rises with consolidation, but less than in proportion. That is why a flowability figure without the stress it was measured at means little, and why a design test must cover the low stresses near the outlet, not only the higher stresses in the body of the bin.

Fitting a straight line to the four points gives σ_c ≈ 0.580 + 0.255 σ₁ (kPa), with residuals under 0.05 kPa. Chapter 7 uses this fit to find B2's critical outlet size.

### Time consolidation

A powder left at rest under stress usually keeps gaining strength for hours or days, by creep at its contacts, moisture migration or slow chemical change. Testers measure this by holding a sample under its consolidation stress for a set time before shearing it. The plant's report included a 24-hour time test: the filler's strength at σ₁ = 2 kPa rose from 1.10 to 1.45 kPa, about 30%. That explains a familiar observation at Plant C: B2 was worst on Monday mornings.

## Wall friction

The wall friction test uses the same equipment with the lower half of the cell replaced by a coupon of the wall material. A layer of the bulk solid is pressed onto the coupon under a normal stress σ_w and sheared across it. The ratio of shear stress to normal stress at steady sliding gives the wall friction angle:

φ_w = arctan(τ_w ÷ σ_w)

Repeating at several normal stresses gives the **wall yield locus**. For cohesive powders the wall friction angle usually falls as the normal stress rises, as it does for B2's filler, so the critical value is the one at the low stresses near the outlet.

Wall friction depends on the wall surface as much as on the material. For stainless steel, the finish matters: a cold-rolled mill finish (2B), a bright-annealed finish (BA) and a ground or brushed finish (No. 4) give different values, and a brushed finish gives a lower value when the brush lines run in the direction of flow than across it. Weld seams, corrosion, wear, scratches, coatings that have worn through, and condensation all change the result. The test coupon must therefore be the actual wall material, with the actual finish, oriented as it will be fitted.

## A tilt test the plant can run

A shear tester belongs in a laboratory, but wall friction can be checked roughly with a tilt test. A short ring of pipe, about 100 mm in diameter, is placed on a coupon of the wall sheet, filled with the material and loaded with a weight so that the normal stress is similar to that at the hopper outlet. The coupon is tilted slowly until the ring and its contents slide. The tilt angle at which sliding starts is the wall friction angle at that normal stress.

For a 100 mm ring the area is 0.00785 m², so a total load of 0.8 kg gives a normal stress of about 1.0 kPa, close to the stresses near B2's outlet. A 5 kg load gives 6.2 kPa.

The [inclined plane tool](/tools/inclined-plane/) is a convenient way to read the result. It calculates the force along a slope needed to raise, hold or lower a load with sliding friction, and reports whether the load is self-locking, that is, held by friction without any force. Entered with the ring's mass, the coupon's tilt angle and a friction coefficient, it shows directly whether that friction coefficient would hold the load at that angle. At 14° with μ = tan 14° = 0.249, the force needed to hold a 5 kg ring is essentially zero: the load is on the point of sliding, which is what the tilt test's sliding angle means. For the filler on 2B steel, with μ = tan 26° = 0.488, the tool shows the ring held by friction at 20° and sliding at 60°, with 30.5 N needed to hold it there.

```figure
type: compare
title: Tilt test results interpreted with the inclined plane tool
rowhead: Case
cols: Tilt angle | Friction coefficient | Tool result for a 5 kg ring
caption: The inclined plane tool assumes steady sliding friction, which suits a tilt test read at the moment of sliding. The tilt test gives the wall friction angle at one low normal stress; it does not replace the laboratory's wall yield locus.
- Pellets on 2B steel, at the sliding angle | 14° | 0.249 | hold force about 0: on the point of sliding
- Filler on 2B steel, gentle slope | 20° | 0.488 | self-locking: friction holds it
- * Filler on 2B steel, B2's cone wall | 60° | 0.488 | slides: 30.5 N needed to hold it
```

That last line holds a lesson. A ring of filler on a sheet tilted to B2's cone angle slides off easily, yet B2 does not discharge in mass flow. A single block sliding on a slope is not the same as a mass of powder flowing down a converging hopper. In a hopper the stresses at the wall depend on the whole stress field in the converging material, and Jenike's analysis shows that the material slides on the wall only if the hopper half-angle is small enough for the combination of φ_w and δ. A tilt test tells you the wall friction angle; it does not tell you whether a hopper will be in mass flow. Chapter 6 makes that link.

## The error: a coupon with the wrong finish

This is an illustration. For the replacement hopper for B2, the engineer sent the laboratory a sample of filler and asked for wall friction on "304 stainless". The laboratory used its stock coupon, a bright-annealed (BA) sheet, and reported a wall friction angle of 19° at low stress. On that figure, the report gave a mass-flow cone half-angle limit of about 20° from vertical, much more attractive than the 12° the engineer later used, and a fabricator quoted on it.

Reviewing the quotation, the engineer noticed that the fabricator planned to use 2B sheet, the cheaper and more common finish, with the circumferential weld seams ground flush, leaving grinding marks running around the cone, across the direction of flow. A tilt test on an offcut of the fabricator's 2B sheet, loaded to about 1 kPa, slid at 26°; a second test on an offcut with a ground seam slid at 28°. The laboratory repeated its wall test on the 2B offcut and confirmed 26°, revising the cone half-angle limit to 12°.

```figure
type: compare
title: Wall friction of B2's filler by wall surface
rowhead: Wall surface
cols: Wall friction angle at about 1 kPa | Mass-flow cone half-angle in the report
caption: This is an illustration. The 7° difference in wall friction between the coupon tested and the sheet to be used would have put the new hopper in funnel flow, repeating the original problem at greater cost.
- BA coupon, laboratory stock | 19° | about 20° from vertical
- * 2B sheet, as quoted by the fabricator | 26° | 12° from vertical
- 2B with seams ground across the flow | 28° | flatter still; avoid
```

Had the hopper been built at 20° from vertical in 2B steel, it would have run in funnel flow, and the plant would have paid for a new bin that behaved like the old one. The corrected specification calls for the wall finish to be stated on the drawing, for wall friction to be tested on an offcut of the actual sheet, and for seams to be ground with the finish lines running down the slope.

## How this applies to a small Australian business

A shear test for one material costs far less than a new hopper, and much less than a hopper that does not work. Ask for a flow function covering the low stresses near your outlet, an effective angle of internal friction, wall friction on the actual wall material and finish you will use, and a time consolidation test if the material will sit for more than a few hours. Keep an offcut of every new bin's wall material. A ring, a weight and a protractor will then tell you, years later, whether corrosion, wear or a new coating has changed the wall friction.

## Exercise: setting up a tilt test

You want to check wall friction on a 150 mm diameter ring at a normal stress of 1.5 kPa, the stress expected near a new outlet. (a) What total mass of ring, material and weight is needed? (b) The ring slides at 23°. What friction coefficient and wall friction angle does that give, and would a ring of this material stay put on a sheet tilted to 20°?

**Worked answer.** (a) The ring's area is π × 0.15² ÷ 4 = 0.01767 m². A normal stress of 1,500 Pa needs a force of 1,500 × 0.01767 = 26.5 N, so a mass of 26.5 ÷ 9.81 = **2.70 kg**. Strictly, on a tilted plate the normal force is m g cos θ, so the stress at the moment of sliding is about 8% lower than on the flat; for a rough check this can be ignored or the mass increased to 2.94 kg. (b) The wall friction angle is **23°** and the friction coefficient tan 23° = **0.424**. At 20°, tan 20° = 0.364 is less than 0.424, so the ring is **self-locking**: it stays put, as the inclined plane tool would report.
