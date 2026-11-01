---
book: polymer-chains-by-the-numbers
chapterSlug: overlap-and-cement-viscosity
order: 5
title: "Overlap, entanglement and the viscosity of a cement"
description: "Find the overlap concentration where coils fill a solution, see why a cement's viscosity rises with about the fourth power of concentration, and set a cement's strength by fitting its own data."
draft: false
---

A solvent cement, a lacquer or a printing ink is not a dilute solution. The workshop's cement holds 16% polystyrene by mass, and at that concentration its coils are crammed together, overlapping and tangled with their neighbours. Its viscosity is more than a thousand times the solvent's, and it rises so steeply with concentration that a change of a few per cent in polymer content can halve or double it. Dilute-solution thinking, in which viscosity rises roughly in proportion to concentration, fails completely.

This chapter introduces the overlap concentration, the point at which coils start to fill the solution, and the scaling laws that govern viscosity above it. It uses them to set the workshop's cement concentration from its own measurements, to predict the effect of making the cement from regrind, and to explain why a technician who diluted the cement by a quarter got a liquid that ran off the joints.

## The overlap concentration

Imagine adding coils one at a time to a solvent. At first each coil sits in its own space, and the solution's properties are the sum of independent coils, the dilute regime of Chapter 4. As more are added, the coils come closer, until the solution is completely filled with coils just touching. That concentration is the overlap concentration, c*. Above it, coils must interpenetrate.

There are two common ways to estimate it, and they differ by a modest factor because the boundary is gradual, not sharp.

- **From the coil size:** c* is the mass of one chain divided by the volume of its coil, M ÷ (N_A × 4π R_g³ ÷ 3). For the workshop's resin swollen to a radius of gyration of 17.45 nm in the cement solvent (Chapter 3), that is about **1.9 g/dL**.
- **From the intrinsic viscosity:** c* ≈ 1 ÷ [η], since [η] is the coil volume per unit mass. With the 0.8187 dL/g of Chapter 4, that gives about **1.2 g/dL**.

Either way, c* is around 1 to 2 g/dL, or about 1.5 to 2% by mass. It falls as the chains get longer, as M^(1 − 3ν), or M^−0.764 in a good solvent, because longer chains have more open coils.

## The workshop's cement in overlap units

To compare the cement with c*, its mass fraction must be converted to a mass per volume. A 16% solution of polystyrene (density 1.05 g/cm³) in a solvent of density 0.87 g/cm³, assuming volumes add, has a density of 1 ÷ (0.16 ÷ 1.05 + 0.84 ÷ 0.87) = 0.8945 g/cm³, so its polymer concentration is 0.16 × 0.8945 = 0.1431 g/cm³, or **14.3 g/dL**. Using c* = 1 ÷ [η], the cement is at 14.3 × 0.8187 = **11.7 times** the overlap concentration.

```figure
type: compare
title: Cement concentrations in overlap units
rowhead: Polystyrene by mass
cols: Solution density | Polymer concentration | c ÷ c* with c* = 1 ÷ [η]
caption: Volumes assumed additive, polystyrene 1.05 g/cm³, solvent blend 0.87 g/cm³, [η] = 0.8187 dL/g. Every practical cement is far into the overlapping, entangled regime.
- 8% | 0.882 g/cm³ | 7.1 g/dL | 5.8
- 12% | 0.888 g/cm³ | 10.7 g/dL | 8.7
- * 16% | 0.895 g/cm³ | 14.3 g/dL | 11.7
- 20% | 0.901 g/cm³ | 18.0 g/dL | 14.8
- 24% | 0.907 g/cm³ | 21.8 g/dL | 17.8
```

## Semidilute solutions and entanglement

Above c*, de Gennes showed that a solution can be described by a single length, the correlation length or mesh size, which is the typical distance between neighbouring chain segments. At c* it equals the coil size; above c*, it shrinks as the concentration rises. On scales smaller than the mesh, each chain still looks like a swollen coil in a good solvent; on larger scales, its self-repulsion is screened by the other chains around it and it behaves like an ideal random walk, as in a melt.

The mesh size can be estimated with the same scaling ideas. In a good solvent it shrinks from the coil size at c* as (c ÷ c*) to the power −ν ÷ (3ν − 1) = −0.77. For the workshop's cement at 11.7 times c*, starting from the swollen radius of gyration of 17.45 nm, that gives 17.45 × 11.7^−0.77, about **2.6 nm**. That is only about one and a half Kuhn lengths of polystyrene, which means the 16% cement is near the upper end of the semidilute range: its chains are swollen only over very short distances, and on any larger scale they behave as they would in a melt. It is a reminder that the regimes are a guide to which law to expect, not sharp categories, and that a real cement sits wherever its own measurements put it.

At somewhat higher concentrations, typically several times c*, the chains are not just overlapping but entangled. Each chain is hemmed in by its neighbours as if in a tube, and can move along its length only by sliding through the tube, a motion called reptation. This is what makes concentrated solutions and melts so viscous, and it is why their viscosity rises steeply with both concentration and chain length.

Scaling theory turns this picture into power laws. In a good solvent, it predicts that the specific viscosity of an unentangled semidilute solution grows as (c ÷ c*) to the power 1 ÷ (3ν − 1) = **1.31**, and that of an entangled one as (c ÷ c*) to the power 3 ÷ (3ν − 1) = **3.93**. Measured exponents for entangled solutions are often somewhat higher, for the same reasons that melts follow M^3.4 rather than the simple reptation prediction of M³, which Chapter 6 discusses. In practice, a cement's own measurements give the exponent to use.

```figure
type: compare
title: Viscosity regimes of a polymer solution in a good solvent
rowhead: Regime
cols: Concentration | Specific viscosity grows as | What the chains do
caption: Exponents from scaling theory with ν = 0.588. The boundaries are gradual crossovers, not sharp lines; measured entangled exponents are often a little higher than 3.9.
- Dilute | below c* | c¹ | separate coils
- Semidilute, unentangled | c* to several c* | (c ÷ c*)^1.31 | overlapping, not yet tangled
- * Semidilute, entangled | above several c* | (c ÷ c*)^3.9 or more | reptating in tubes
- Concentrated and melt | beyond the semidilute range | rises faster still | mesh down to monomer size
```

## Fitting the workshop's cement

This is an illustration. The workshop's laboratory made up the cement at five concentrations from the virgin resin and measured each with a rotational viscometer at 20 °C. Because the exponent, not the theory, is what the workshop needs, the results are fitted on logarithmic axes as in any power law.

The [linear calibration check tool](/tools/linear-calibration-check/) fits a least-squares straight line to up to eight pairs of values and reports its intercept, slope, their standard errors and the residuals, and inverts the line to find the reference value that gives a chosen reading, with its interval. With the logarithm of concentration entered as the reference and the logarithm of viscosity as the reading, the slope is the exponent.

```figure
type: compare
title: The cement's viscosity against concentration, and its power-law fit
rowhead: Polystyrene by mass
cols: Measured viscosity | log₁₀ c | log₁₀ η | Residual in log₁₀ η
caption: Invented measurements for the illustration, virgin resin in the cement blend at 20 °C. Fit: log₁₀ η = −1.776 + 3.985 log₁₀ c, so η = 0.01675 × c^3.985 with c in per cent by mass and η in mPa·s.
- 8% | 66 mPa·s | 0.9031 | 1.8195 | −0.0035
- 12% | 340 mPa·s | 1.0792 | 2.5315 | +0.0068
- * 16% | 1,050 mPa·s | 1.2041 | 3.0212 | −0.0013
- 20% | 2,550 mPa·s | 1.3010 | 3.4065 | −0.0021
- 24% | 5,300 mPa·s | 1.3802 | 3.7243 | +0.0001
```

The tool gives a slope of **3.985**, with a standard error of 0.012, and an intercept of −1.776, so η = 0.01675 × c^3.985 with c in per cent by mass. The exponent is close to the scaling theory's 3.9 for entangled semidilute solutions, and the residuals are small and random, so a single power law describes the whole range. Fitting against mass fraction rather than mass per volume makes almost no difference to the exponent here, because the solution's density changes by less than 3% across the range.

The workshop wants a cement of 1,250 mPa·s, the middle of its 1,000 to 1,500 mPa·s target. Entering log₁₀ 1,250 = 3.0969 as the new reading, the tool inverts the line and gives log₁₀ c = 1.2228, so the cement should contain **16.7% polystyrene by mass**, with a 95% interval of 16.5% to 16.9%. The workshop had been making it at 16%, which gives about 1,050 mPa·s, at the low end of the target; it now makes it at 16.7%.

## Measuring a cement's viscosity properly

An entangled solution's viscosity is not a single number in the way a solvent's is. Two effects make it depend on how it is measured, and both must be controlled if results are to be compared.

The first is shear thinning. At low shear rates, entangled chains have time to relax as they flow, and the solution shows its full, zero-shear viscosity. At higher shear rates, the chains are pulled into alignment faster than they can relax, the entanglements carry less stress, and the apparent viscosity falls. A rotational viscometer reading therefore depends on the spindle and the speed, and a brush stroke, which shears the cement quickly, meets a thinner liquid than a viscometer at low speed. The workshop records the spindle, speed and shear rate with every reading and uses the same ones every time, so that its power-law fit compares like with like.

The second is temperature. Solution viscosity falls as temperature rises, typically by a few per cent per kelvin for concentrated polymer solutions, faster than the solvent's own viscosity because the chains' motion is also temperature-activated. A cement measured at 25 °C on a summer afternoon will read noticeably thinner than the same cement at 20 °C. The laboratory measures at 20 °C in a water-jacketed cup, and the assembly area is told to expect the cement to feel thicker in winter and thinner in summer.

Neither effect changes the exponent much, provided every point is measured the same way. Both change the absolute numbers, and a viscosity specification that does not state the temperature and the measuring conditions cannot be checked.

## Cement from regrind

Making the cement from regrind instead of virgin resin is attractive, since regrind is free. But in the entangled regime, viscosity at a fixed concentration rises steeply with chain length as well as concentration. This book assumes, as a teaching value, that the cement's viscosity at fixed concentration scales as M_w^3.4, the same exponent as the melt in Chapter 6; a workshop should check this with its own regrind.

With that assumption, cement made from regrind of M_w 215,000 g/mol would have (215 ÷ 250)^3.4 = 0.599 of the virgin cement's viscosity at the same concentration: about 630 mPa·s at 16%, below the target. To bring it back to 1,250 mPa·s, the concentration must rise by a factor of (1 ÷ 0.599)^(1 ÷ 3.985) = 1.137, from 16.7% to **19.0%**. Regrind cement is therefore usable, but it needs more polymer, contains less solvent to soften the joint surfaces per gram applied, and must be measured, not made up to the virgin recipe.

## The error: diluting by a quarter

This is an illustration. The assembly area asked for a thinner brushing grade of cement for long joints. A technician, reasoning that viscosity is proportional to polymer content, diluted the standard 16% cement to 12% with fresh solvent, expecting the viscosity to fall by a quarter, from about 1,050 to about 790 mPa·s, a convenient brushing consistency.

The diluted cement ran like water off vertical surfaces. Measured, it was about 335 mPa·s, less than a third of the original. The power law explains it at once: a 25% fall in concentration multiplies the viscosity by (12 ÷ 16)^3.985 = **0.318**, a 68% fall. In the entangled regime, viscosity is extremely sensitive to concentration, and linear intuition, which works in the dilute regime, is badly wrong.

```figure
type: bars
title: Expected and actual viscosity after diluting the cement from 16% to 12%
unit: mPa·s
caption: The linear expectation assumed viscosity proportional to concentration. The cement's measured power law, η ∝ c^3.985, predicts a fall to 32% of the original.
- Standard cement at 16% | 1,050 | before dilution
- Linear expectation at 12% | 790 | 75% of the original
- * Power-law prediction at 12% | 335 | 32% of the original
```

A brushing grade at about 800 mPa·s needs c = (800 ÷ 0.01675)^(1 ÷ 3.985), about 14.9% polymer, a dilution of only 7% from 16%. The workshop added the power law to its cement recipe card, with a small table of concentration against viscosity, and dilutions are now worked out from it.

## Why the sensitivity matters on the bench

The steep power law has consequences beyond recipes. A cement left uncovered loses solvent from its surface; at 16% polymer, losing a tenth of the solvent raises the concentration to about 17.5% and the viscosity by about 42%, enough to change how the cement wets a joint. A skin forms first at the surface, where solvent leaves fastest, which is why cement in an open pot thickens unevenly. Small differences in how the cement is weighed or mixed also matter more than they seem: an error of half a percentage point in polymer content, 16.5% instead of 16%, changes its viscosity by about 13%. Covered pots, small working quantities and a recipe made up by weight, not by volume, keep the cement consistent.

## How this applies to a small Australian business

Anyone who makes or uses polymer solutions, from solvent cements to coatings, adhesives, inks and casting solutions, works in the entangled regime, whether or not they know it. The practical lessons are simple. Measure the viscosity at three or more concentrations and fit a power law on logarithmic axes, rather than assuming proportionality. Expect viscosity to depend steeply on the resin's molar mass as well, so a change of resin grade or the use of regrind needs a new measurement. And keep solvent loss under control, because it moves the concentration, and the viscosity moves with about its fourth power.

## Exercise: solvent loss in an open pot

A pot of the workshop's 16.7% cement, of viscosity about 1,250 mPa·s, is left open at the bench and loses 8% of its solvent by mass. Find the new polymer concentration and, using the fitted power law η = 0.01675 × c^3.985, the new viscosity. Is it still within the 1,000 to 1,500 mPa·s target?

**Worked answer.** In 100 g of cement there are 16.7 g of polymer and 83.3 g of solvent. Losing 8% of the solvent removes 6.66 g, leaving 76.64 g of solvent and 93.34 g in total, so the concentration becomes 16.7 ÷ 93.34 = **17.9%**. The viscosity is 0.01675 × 17.9^3.985 = **about 1,650 mPa·s**, 32% higher and **above** the 1,500 mPa·s limit. A loss of solvent that is hard to notice by eye takes the cement out of its target.
