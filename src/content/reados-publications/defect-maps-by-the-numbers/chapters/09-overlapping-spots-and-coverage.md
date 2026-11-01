---
book: defect-maps-by-the-numbers
chapterSlug: overlapping-spots-and-coverage
order: 9
title: "Overlapping spots and coverage"
description: "What happens when random spots have size and overlap: the Boolean model, why counts of merged defects stop rising, and how coverage by random impacts grows in blasting and peening."
draft: false
---

So far defects have been points. Real defects have size, and when many of them fall on a surface, some overlap. Two craters landing a few millimetres apart become one larger crater; ten thousand grit particles striking a steel surface leave dents that overlap until the whole surface is dented. The arithmetic of randomly placed shapes that may overlap is called the **Boolean model**, and it answers two practical questions: how many separate defects will be seen when many overlap, and how long a random process such as blasting or peening takes to cover a surface.

This chapter sets out the Boolean model, applies it to merged defects and to the coverage of Plant E's abrasive blasting, and explains why full coverage takes so much longer than most people expect. Its error is a blasting time set by straight-line thinking, which left a fifth of the surface untouched.

## The Boolean model

Place points at random over a surface, as complete spatial randomness, at a density λ per unit area, and centre a shape on each point: a disc, a crater, a dent. The union of all these shapes is a Boolean model. Its key property is simple. A given spot on the surface is left uncovered only if no shape's centre lies within reach of it, and for random centres that probability is e^(−λ ā), where ā is the mean area of one shape. The fraction of the surface covered is therefore 1 − e^(−λ ā).

```figure
type: formula
title: Coverage in the Boolean model
formula: covered fraction p = 1 − exp(−λ ā)     uncovered fraction = exp(−λ ā)     with impacts at a steady rate: C(t) = 1 − exp(−t ÷ τ)
caption: The product λ ā is the total area of all the shapes divided by the surface area, counting overlaps more than once. Coverage approaches 100% only gradually, because each new shape is increasingly likely to land on area already covered.
- λ | number of shapes per unit area
- ā | mean area of one shape
- τ | time for λ ā to reach 1 at a steady impact rate
- C(t) | fraction covered after time t
step: When λ ā = 1, the total area of the shapes equals the surface area, yet only 1 − e^(−1) = 63.2% is covered
```

That last line is the heart of the model, and the source of most coverage mistakes. Scattering enough random spots to add up to the whole area, counted without overlap, covers only 63% of it. Covering 98% needs nearly four times that amount, because ln 50 = 3.91.

## Merged defects

Plant E's craters are about 10 mm across. When contamination puts many of them on one area, some land closer than 10 mm and merge into a single, larger crater. An inspector counting craters counts the merged shapes, not the droplets that made them, so the count rises more slowly than the number of droplets and eventually falls, as merged shapes join into ever larger patches.

The engineer simulated random droplets of 10 mm diameter on a 200 mm square, counting how many separate shapes they made.

```figure
type: compare
title: Separate craters seen when 10 mm droplets land at random on a 200 mm square
rowhead: Droplets
cols: Separate shapes seen | Seen ÷ droplets | Area covered
caption: Simulation of 400 trials at each number of droplets. Up to about 50 droplets, most remain separate. By 200 they have merged into fewer than half as many shapes, and by 400 the count is falling as patches join up, though the covered area keeps rising.
- 20 | 18.6 | 0.93 | 3.9%
- 50 | 41.5 | 0.83 | 9.4%
- 100 | 67.7 | 0.68 | 17.8%
- * 200 | 88.5 | 0.44 | 32.5%
- 400 | 63.0 | 0.16 | 54.4%
```

Two consequences follow. First, a count of visible defects understates the number of events that caused them whenever defects are large compared with their spacing, and the understatement grows with severity. A badly contaminated door may show fewer craters than a moderately contaminated one, because its craters have merged into patches. Second, a measure of covered area, the fraction of the surface affected, keeps rising with severity where the count does not. For severe contamination, area affected is the better measure; for light contamination, where defects rarely touch, the count and the area tell the same story.

### Where overlap does not matter

For Plant E's dust specks, overlap is irrelevant. At 0.431 specks per m², each perhaps half a millimetre across, the specks cover about three parts in ten million of the surface, and the chance of two touching is negligible. The Boolean model matters only when the shapes are large compared with their typical spacing. A quick check is the product λ ā: if it is below about 0.05, overlaps are rare and defects can be treated as points; if it approaches 0.5 or more, counts become misleading.

## Coverage by random impacts

The same model governs any process that treats a surface with random impacts: abrasive blasting, shot peening, sanding with random orbits, and the strikes of a spray on a surface. Plant E blast-cleans the 3 mm hot-rolled steel plinths of its larger enclosures with steel grit to remove mill scale before powder coating, because powder applied over mill scale disbonds when the scale later cracks away. The blaster moves the nozzle over the plinth by hand, and the question is how long each area needs.

If grit strikes arrive at random at a steady rate, coverage after time t follows C(t) = 1 − e^(−t ÷ τ), where τ depends on the nozzle, the pressure, the abrasive and the stand-off distance. Plant E measured it by blasting test panels for different times and estimating the cleaned fraction under a magnifier against a grid. After 10 seconds per area, 60% of the scale was removed, which gives τ = −10 ÷ ln(0.4) = 10.9 seconds.

```figure
type: line
title: Fraction of mill scale removed against blasting time per area
x: Blasting time per area, s
y: Fraction cleaned
ymin: 0
ymax: 1
caption: This is an illustration. The curve C(t) = 1 − exp(−t ÷ 10.9), fitted to a test at 10 s. Coverage rises quickly at first and then slowly: 84% at 20 s, 94% at 30 s, 98% at 43 s and 99% at 50 s.
- 0 | 0
- 5 | 0.368
- 10 | 0.600
- 15 | 0.747
- 20 | 0.840
- 30 | 0.936
- 40 | 0.974
- 50 | 0.990
- 60 | 0.996
```

The time to reach a target coverage is τ × ln(1 ÷ (1 − target)). For 90% it is 10.9 × ln 10 = 25.1 seconds; for 98%, 10.9 × ln 50 = **42.7 seconds**; for 99%, 50.3 seconds. Each extra "nine" costs as much time as the one before it.

### Coverage targets in standards

Industries that depend on coverage define it carefully. In shot peening, SAE J2277 covers the determination of coverage, and the practice commonly treats 98% as full coverage, since 100% is approached but never reached by a random process; higher "coverage" figures such as 200% conventionally mean twice the time needed for full coverage. In blast cleaning before painting, ISO 8501-1 grades surface cleanliness by comparison with reference photographs rather than by a measured fraction. Plant E's requirement, set with its powder supplier, is that no mill scale is visible to the unaided eye on the blasted surface, which in practice needs coverage near 98%.

## Measuring coverage

Coverage is itself a measurement, and it inherits the arithmetic of point counting. Plant E's check lays a transparent grid of points 25 mm apart over the blasted surface and counts how many points fall on remaining scale under a magnifier. With 100 points on a plinth at a true coverage of 98%, about 2 points would fall on scale, and the standard error of the measured coverage is √(0.98 × 0.02 ÷ 100) = 1.4 percentage points; with 400 points it is 0.70. Distinguishing 98% from 95% reliably needs a few hundred points, which is why the check is done on a grid rather than by eye, and why a surface judged by its overall colour can hide a fifth of its area uncleaned.

Shot peening uses other methods for the same purpose, such as fluorescent tracer coatings that are removed where shot strikes, viewed under ultraviolet light, so that the remaining uncovered area glows. The principle is the same: coverage is estimated from what fraction of the surface remains untouched.

### Uneven impact rates

The Boolean model with a single τ assumes impacts arrive at the same rate everywhere. A real nozzle throws more grit at the centre of its pattern than at the edges, inside corners are shadowed by the walls around them, and an operator's passes overlap more in some places than others. The local τ then varies across the part, and the time needed is set by the least-exposed region, not by the average. A test panel that is blasted evenly can give a τ much shorter than the one that governs the inside corner of a plinth's folded flange. Plant E's coverage check therefore places some of its grid points deliberately in the corners and along the folds, where shadowing is worst, and reports their coverage separately from the flat faces.

### What the uncovered area looks like

At high coverage, the uncovered area is not a few large patches but many small islands, each about the size of the gaps between impact dents, scattered over the whole surface. At 80% coverage, a fifth of the surface is uncovered in islands a fraction of a millimetre to a millimetre or two across. The surface looks uniformly blasted at arm's length, which is why the error below went unnoticed until the coating failed. The islands are exactly what the Boolean model predicts: the uncovered set of a dense random pattern of shapes is a scatter of small, irregular holes.

## The error: straight-line thinking

When the blasting cabinet was first set up, the operator ran the 10 second test, saw that it removed about 60% of the scale, and reasoned that 100% would take 10 ÷ 0.6, about 17 seconds. With a small margin, the work instruction was written as 18 seconds per area.

The Boolean model gives coverage at 18 seconds of 1 − e^(−18 ÷ 10.9) = **80.8%**. A fifth of the mill scale was left in small, scattered islands, too small and too evenly spread to catch the eye of an operator looking at the overall colour of the surface. The powder coating over them looked perfect when it left the oven. Six months later, enclosures installed outdoors came back with the coating lifting in small flakes along the plinths, each flake with a fragment of mill scale on its back.

```figure
type: compare
title: Blasting time per area: work instruction against requirement
rowhead: Basis
cols: Time per area | Coverage reached | Mill scale left
caption: This is an illustration. With τ = 10.9 s. The straight-line estimate assumed every strike landed on fresh scale; the Boolean model allows for strikes landing on area already cleaned.
- * Straight-line estimate from the 10 s test | 18 s | 80.8% | 19.2%
- Boolean model for 98% | 43 s | 98.0% | 2.0%
- Boolean model for 99% | 50 s | 99.0% | 1.0%
```

The plinths already in the field were inspected, and those showing lifting were recoated under warranty. The work instruction was changed to 45 seconds per area, with a check of every plinth under a magnifier on a 25 mm grid of points, counting points that fall on remaining scale, which is the point counting of quantitative metallography applied to a blasted surface. The blaster's throughput fell by more than half, and the plant reviewed whether the plinths could be bought pickled and oiled, free of mill scale, instead.

## Running the model backwards

The Boolean model can also be used in reverse, to estimate how many events occurred when their marks have merged and cannot be counted. Since the uncovered fraction is e^(−λ ā), the density of events is λ = −ln(uncovered fraction) ÷ ā. If a white card hung in the booth for a minute ends up with 30% of its area stained by overspray droplets whose individual stains average 0.2 mm², the droplet density is −ln(0.7) ÷ 0.2 = 1.78 droplets per mm², however many of them merged. Plant E uses exactly this on settling plates, glossy black cards left near the booth for an hour, to compare background dust levels between days and positions: the fraction of the card's area covered by specks, measured by image analysis, gives the deposition density even on dusty days when specks touch and cannot be counted individually. On a typical still morning a card shows about 0.2% of its area covered; on a windy afternoon with the roller door open, several times that.

## Coverage, defects and yield together

The Boolean model also links back to yield. If contamination spots of area ā land at random with density λ, the chance that a particular small area, such as a label panel or a logo position, is untouched is e^(−λ ā) for that area's own exposure, and the chance that a whole part is free of spots is the Poisson e^(−λ A) of Chapter 2. The model adds one thing those earlier chapters did not need: a way to handle defects whose size is not negligible, so that counts, areas and yields can be related consistently even when defects merge.

## How this applies to a small Australian business

For any process that works by random impacts, such as blasting, peening, sanding or spraying, measure coverage at one or two short times and fit C(t) = 1 − e^(−t ÷ τ). Use it to set times for the coverage you need, remembering that 98% takes about four times as long as 63%, and never extrapolate in a straight line from a partial result. When defects are large compared with their spacing, count affected area as well as the number of defects, because merged defects make counts misleading.

The same arithmetic protects against a common sales claim. A blasting or peening contractor quoting a rate per square metre will have a coverage figure in mind; asking what coverage the rate assumes, and how it is checked, often reveals a large difference between quotes that looked similar.

## Exercise: peening a spring seat

A test strip peened for 4 seconds per area shows 70% coverage. (a) Estimate τ. (b) How long is needed for 98% coverage? (c) What time would a specification calling for 200% coverage require, if 200% means twice the time for full coverage taken as 98%?

**Worked answer.** (a) τ = −4 ÷ ln(1 − 0.7) = −4 ÷ ln 0.3 = **3.32 seconds**. (b) t₉₈ = 3.32 × ln 50 = 3.32 × 3.912 = **13.0 seconds**. (c) Twice that, **26.0 seconds**. Note that the straight-line estimate, 4 ÷ 0.7 = 5.7 seconds for "100%", would have reached only 1 − e^(−5.7 ÷ 3.32) = 82% coverage.
