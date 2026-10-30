---
book: microstructures-by-the-numbers
chapterSlug: particle-sizes-from-sections
order: 6
title: "Particle sizes from sections"
description: "Why sections of particles look smaller and over-represent large ones, how to get particle size and number per volume from sections of spheres, and why nodule counts depend on a size cutoff."
draft: false
---

Graphite nodules in ductile iron, carbides in tool steel, pores in a casting and inclusions in steel are all particles, and their size and number matter. A section through them shows circles and irregular shapes of many sizes, and it is tempting to measure those and report them as the particle sizes. They are not. Chapter 1 showed that a section through a sphere is almost always smaller than the sphere, and that large particles are cut more often than small ones. Recovering the true sizes from the section sizes is a classic problem, first set out by the statistician Wicksell in 1925 for biological specimens, and known since as Wicksell's corpuscle problem.

This chapter works through the sections of spheres of one size, the relation between the number of particles seen per area and the number per volume, the unfolding of a range of sizes, and the effect of the smallest size counted. Its error is a disagreement over nodule count between a foundry and a laboratory that were counting different things.

## Sections of spheres of one size

Imagine spheres of one diameter D scattered at random through a solid, and a plane cutting through them. A sphere is cut if its centre lies within D ÷ 2 of the plane, on either side. If it is cut at a distance h from its centre, the section is a circle of diameter d = √(D² − 4h²). Because the centre's position is uniform within the slab of thickness D around the plane, every value of h from 0 to D ÷ 2 is equally likely, and that fixes the distribution of section sizes.

Three results follow, and they are worth remembering.

- The fraction of sections smaller than a diameter x is 1 − √(1 − (x ÷ D)²).
- The mean section diameter is π ÷ 4 times the sphere diameter, about 0.785 D.
- The mean of the squared section diameter is two thirds of D², so the mean section area is π D² ÷ 6, two thirds of the sphere's largest cross-section.

```figure
type: line
title: Fraction of sections of one sphere size smaller than a given diameter
x: Section diameter ÷ sphere diameter
y: Fraction of sections smaller
ymin: 0
ymax: 1
caption: Most sections are close to the full size: only 20% are smaller than 0.6 D and 40% smaller than 0.8 D. But there is a long tail of small sections, the caps cut near the top or bottom of a sphere, and they are indistinguishable in the section from sections of genuinely small spheres.
- 0 | 0
- 0.2 | 0.0202
- 0.4 | 0.0835
- 0.6 | 0.2000
- 0.8 | 0.4000
- 0.9 | 0.5641
- 1.0 | 1.0
```

## Number per area and number per volume

The number of particles a section cuts per unit area, N_A, depends on both how many particles there are per unit volume, N_V, and how big they are, because a bigger particle offers a thicker slab in which its centre can lie and still be cut. For spheres of one size the relation is simply N_A = N_V × D. For spheres of several sizes it is N_A = N_V × D̄, where D̄ is their mean diameter. For convex particles of any shape the same relation holds with D̄ replaced by the mean caliper diameter, the average width of the particle measured in all directions, so the shape enters only through that average width.

This relation is why the "nodule count" quoted for a ductile iron, a number per square millimetre of section, is not a count of nodules in the metal. Two irons with the same number of nodules per cubic millimetre but different nodule sizes have different nodule counts, and the one with the larger nodules shows more of them in section.

## The casing's graphite

On the main wall specimen, after the re-polishing described in Chapter 2, the laboratory's image analysis counted **200 nodules per mm²** in the section, with a mean section diameter of **23.6 µm** and a graphite area fraction of 9.4%. The nodules are close to spherical, and in a uniform 20 mm wall their sizes are fairly narrow in range, so the laboratory first treated them as spheres of a single size.

```figure
type: formula
title: Nodule size and number from the section, spheres of one size
formula: D = d̄ ÷ (π ÷ 4)     N_V = N_A ÷ D     V_V = N_V × π D³ ÷ 6
caption: This is an illustration. The single-size model gives a nodule diameter, a number per cubic millimetre and a graphite volume fraction. The volume fraction agrees with the measured area fraction of 9.4%, which is a check that the model and the measurements are consistent, not a proof that every nodule is the same size.
- d̄ | mean section diameter measured in the section
- D | estimated true nodule diameter
- N_A | nodules per mm² of section
- N_V | nodules per mm³ of iron
- V_V | graphite volume fraction implied by the model
step: D = 23.6 ÷ 0.7854 = 30.0 µm
step: N_V = 200 ÷ 0.0300 mm = 6,667 nodules per mm³
step: V_V = 6,667 × π × 0.0300³ ÷ 6 = 0.0942, against a measured area fraction of 0.094
```

The agreement between the modelled volume fraction and the measured area fraction is a useful check. For spheres, the area fraction equals N_A times the mean section area, which is N_V D × π D² ÷ 6, which is exactly the volume fraction. If the two had disagreed badly, the single-size model, or the measurement, would be wrong.

### What the true size tells the foundry

The difference between 23.6 µm and 30.0 µm may seem academic, but it matters when the laboratory's numbers are compared with a foundry's process knowledge. Nodule size in a given section is governed by the number of nuclei the inoculation provides and the time the iron spends solidifying. A foundry tracking the effect of a change in inoculant needs the true nodule size and number per volume, which respond directly to the change, rather than section values in which size and number are tangled together.

## A range of sizes: unfolding

Real nodules are not all one size. In a slowly cooled section there may be a population of large nodules that formed early and a population of small ones that formed later. The section then shows a mixture of full-size sections of small nodules and caps of large ones, and the problem is to recover the number of nodules in each size class from the number of sections in each section-size class.

The standard approach, associated with Saltykov, divides sizes into classes and works downwards from the largest. Sections in the largest section class can only come from particles in the largest particle class, so the count in the top section class fixes the number of the largest particles. Their contribution to every smaller section class can then be calculated from the sphere-section distribution and subtracted. What remains in the next class down fixes the number of the next particle class, and so on.

A three-class example shows the method. Suppose an iron contains 5,000 nodules per mm³ of 30 µm, 3,000 of 20 µm and 2,000 of 10 µm. Each class produces sections at a rate N_V × D and spreads them over the section classes in proportion to the sphere-section distribution.

```figure
type: compare
title: Sections per mm² produced by three nodule sizes
rowhead: Nodule size and number per mm³
cols: Sections 0–10 µm | Sections 10–20 µm | Sections 20–30 µm | Total
caption: This is an illustration. The 30 µm nodules, which are half of all nodules by number, produce almost two thirds of all sections, and they put sections into every class. The 10 µm nodules produce only 20 of the 230 sections per mm². Reading the section-size histogram as a particle-size histogram would greatly overstate the share of large nodules and misplace them among the small classes.
- 10 µm, 2,000 | 20.00 | 0 | 0 | 20.0
- 20 µm, 3,000 | 8.04 | 51.96 | 0 | 60.0
- * 30 µm, 5,000 | 8.58 | 29.62 | 111.80 | 150.0
- All nodules | 36.62 | 81.58 | 111.80 | 230.0
```

Unfolding reverses the table. The top class holds 111.80 sections per mm², and 74.54% of the sections of a 30 µm sphere fall in the 20–30 µm class, so the 30 µm nodules produce 111.80 ÷ 0.7454 = 150.0 sections per mm² in all, and N_V = 150.0 ÷ 0.030 = 5,000 per mm³. They put 19.75% of their sections, 29.62, into the middle class, leaving 51.96 for the 20 µm nodules, of whose sections 86.60% fall in that class: 51.96 ÷ 0.8660 = 60.0, and N_V = 3,000. The remainder in the bottom class, 20.00 sections, belongs to the 10 µm nodules: N_V = 2,000. The unfolding recovers the population exactly, because the example has no counting error.

### Why unfolding needs many sections

With real counts, unfolding amplifies error. Each class's estimate is what remains after subtracting the contributions of all larger classes, so counting errors in the large classes are carried into the small ones, and the small classes, which hold few sections of their own, can come out with large errors or even negative numbers. The finer the classes, the worse this becomes. Practical unfolding uses a few broad classes, several hundred to a thousand or more measured sections, and a check that the recovered populations are sensible. It also assumes the particles are spheres; for other shapes, different section distributions apply, and if shapes vary, the problem has no unique answer from sections alone.

## Spacing between particles

A second useful quantity follows from the same measurements without any size unfolding: the **mean free distance** between particles, the average length of straight path through the matrix from one particle to the next. It is λ = (1 − V_V) ÷ N_L, where N_L is the number of particles crossed per unit length of a test line. For spheres, the mean length of a random chord is two thirds of the diameter, so N_L = 3 V_V ÷ (2 D).

For the casing wall, N_L = 3 × 0.0942 ÷ (2 × 0.030 mm) = 4.71 per mm, and λ = (1 − 0.0942) ÷ 4.71 = 0.192 mm, or about 190 µm. In a ductile iron that distance governs how far carbon must diffuse during a ferritising heat treatment, which is why irons with high nodule counts ferritise faster and more completely, and why the thin wall, with its closer nodules, carries more ferrite than the thick boss. The same quantity, measured with line counts, applies to any dispersion of particles in a matrix, such as carbides in a tool steel, and needs no assumption about particle shape when N_L is counted directly rather than calculated.

## The cutoff: what counts as a nodule

Every count of particles in a section has a smallest size below which features are not counted, whether set deliberately or by the resolution of the image. That cutoff has two effects. It removes the smallest caps of large particles, which for spheres is a small effect: only 1.4% of the sections of a 30 µm sphere are smaller than 5 µm. And it removes every section of genuinely small particles below the cutoff, and, more importantly, decides which small features are counted at all. Small dark features in a section of cast iron include tiny graphite particles, inclusions, pits and dirt, and a lower cutoff admits more of them.

ISO 945-1 classifies graphite in cast irons by form and size, and the related methods for nodularity and nodule count by image analysis specify the minimum size of particle to be counted. A nodule count is only comparable with another made with the same cutoff.

## The error: two nodule counts for the same iron

When the leaking batch was investigated, the foundry sent its own nodule count for the main wall of the same casings: **165 nodules per mm²**, against the laboratory's 200. A difference of 20% suggested to the foundry that the laboratory's specimen was unrepresentative, and to the laboratory that the foundry's was.

The two laboratories exchanged images and settings. The foundry counted only particles of 10 µm and larger, following its own procedure, which was designed to count nodules and ignore small graphite particles and debris. Plant P's image analysis had been set up with a cutoff of 3 µm, chosen to be as sensitive as possible. When Plant P's technician re-ran the analysis on the same 30 fields with a 10 µm cutoff, the count fell to 168 per mm², within counting error of the foundry's figure. Most of the extra 32 particles per mm² in the original count were small graphite particles and inclusions between 3 and 10 µm, with a few caps of large nodules.

```figure
type: bars
title: Nodule count on the same fields with three size cutoffs
unit: per mm²
caption: This is an illustration. Plant P's wall fields re-analysed with different minimum sizes. The count is not a property of the iron alone but of the iron and the counting rule, so a requirement for a nodule count must state the rule.
- Cutoff 3 µm | 200
- Cutoff 5 µm | 191
- * Cutoff 10 µm | 168
- Foundry's own count, 10 µm | 165
```

Neither count was wrong; they measured different things. The plant revised its drawing to state the nodule count requirement with the cutoff and method the foundry used, and Plant P's laboratory now runs its routine nodule counts with the same settings. The single-size estimate of nodule diameter, based on the mean section diameter, was recalculated with the same cutoff so that all reported values refer to one population.

## How this applies to a small Australian business

Section sizes are not particle sizes, and nodule counts are not counts per volume. When a requirement or a report gives a particle size, ask whether it is a section measurement or an estimate of true size, and if the latter, what shape was assumed. When it gives a count per area, ask what minimum size was counted. Two sets of numbers that seem to disagree often turn out to be the same structure measured under different rules, and agreeing the rules in the contract saves the argument.

## Exercise: nodules in the flange

On the flange specimen, the laboratory counts 140 nodules per mm² with a mean section diameter of 28.3 µm. Treating the nodules as spheres of one size, estimate (a) the true nodule diameter, (b) the number of nodules per mm³ and (c) the graphite volume fraction. (d) Compare with the main wall's 30.0 µm and 6,667 per mm³.

**Worked answer.** (a) D = 28.3 ÷ 0.7854 = **36.0 µm**. (b) N_V = 140 ÷ 0.0360 = **3,889 per mm³**. (c) V_V = 3,889 × π × 0.0360³ ÷ 6 = **0.095**, or 9.5%. (d) The flange has nodules about 20% larger and only about 58% as many per cubic millimetre as the wall, while its graphite fraction is almost the same. That is the expected effect of the thicker, more slowly cooled section: the same amount of carbon precipitates as graphite on fewer nuclei, so each nodule grows larger.
