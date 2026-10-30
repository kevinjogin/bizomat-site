---
book: defect-maps-by-the-numbers
chapterSlug: nearest-neighbour-distances
order: 5
title: "Nearest-neighbour distances"
description: "Testing whether defects on one part are clustered or regular from each defect's distance to its nearest neighbour: the Clark–Evans ratio, the G function, edges and the choice of region."
draft: false
---

Quadrat counts look at cells; they cannot see how defects are arranged within a cell, and their answer depends on the cell size. A different family of methods uses the exact positions of defects and asks a direct question about each one: how far away is the nearest other defect? In a clustered pattern, defects have close neighbours; in a regular one, they keep their distance. Comparing the distances with what complete spatial randomness gives is a sensitive test on a single part, where Plant E's composite map could not look.

This chapter introduces nearest-neighbour distances, the Clark–Evans ratio and its test, the cumulative distribution of nearest-neighbour distances known as the G function, and the two practical traps: edge effects and the choice of region. It works through the crater door and the dust door of Chapter 3. Its error is an improvement that existed only because two technicians defined the region differently.

## Nearest-neighbour distance

For each defect on a part, measure the distance to the nearest other defect. The **mean nearest-neighbour distance** summarises the pattern. Under complete spatial randomness on an unbounded surface with density λ, its expected value is 0.5 ÷ √λ: the denser the defects, the closer their nearest neighbours. Clark and Evans, working on the spacing of plants in 1954, proposed comparing the observed mean with that expectation.

```figure
type: formula
title: The Clark–Evans nearest-neighbour test
formula: r_E = 0.5 ÷ √λ     R = r̄_O ÷ r_E     SE = 0.26136 ÷ √(n λ)     z = (r̄_O − r_E) ÷ SE
caption: R below 1 means defects are closer together than random, which is clustering; above 1 means farther apart, which is regularity. The z value is compared with the normal distribution. The formulas assume an unbounded surface; on a real part, edges bias the result, as later in this chapter.
- n | number of defects on the part
- λ | density, n ÷ area of the region
- r̄_O | observed mean nearest-neighbour distance
- r_E | expected mean under complete spatial randomness
step: Crater door: λ = 42 ÷ 0.96 m² = 43.75 per m²; r_E = 0.5 ÷ √43.75 = 0.0756 m = 75.6 mm
step: r̄_O = 25.7 mm, so R = 0.340; SE = 6.10 mm and z = (25.7 − 75.6) ÷ 6.10 = −8.18
```

### The two doors

On the crater door, the 42 craters had a mean nearest-neighbour distance of 25.7 mm against 75.6 mm expected for random placement: a Clark–Evans ratio of **0.34** and a z value of −8.2. A pattern as clustered as that would essentially never arise by chance.

On the dust door, the 25 specks had a mean nearest-neighbour distance of 110 mm. With λ = 25 ÷ 0.96 = 26.0 per m², the expected value is 98.0 mm, giving R = **1.12** and z = 1.17. A z of 1.17 is well within chance, so the dust specks are consistent with random placement. The slightly high R, suggesting faint regularity, turns out to be mostly an artefact of the door's edges, as the next section shows.

```figure
type: compare
title: Clark–Evans results for the two doors
rowhead: Door
cols: Defects | Observed mean distance | Expected if random | R | z | Reading
caption: This is an illustration. Positions measured to the millimetre on the two doors of Chapter 3, with the whole door face, 0.96 m², as the region.
- * Crater door | 42 | 25.7 mm | 75.6 mm | 0.34 | −8.2 | strongly clustered
- Dust door | 25 | 110 mm | 98.0 mm | 1.12 | 1.17 | consistent with random
```

## Measuring exact positions

Distance methods need positions more precise than the 50 mm cells of the routine map. The precision needed depends on the distances that matter: to see clustering at 20 to 60 mm, positions to within a few millimetres are ample. Plant E measured the two doors in Chapter 3 by laying them flat, photographing each face square-on with a steel rule in the frame, and reading the coordinates of each defect from the image in free software, after correcting the scale from the rule. Each door took about ten minutes. For a routine study of many parts that would be too slow, but for the handful of parts that raise a question, it is quick, and the photograph is kept as the record.

Where the part is curved or large, a transparent overlay with a fine grid, or marking each defect with a small sticker and measuring from two reference edges with a tape, serves just as well. What matters is that every defect is measured in the same coordinate system, from the same reference corner, with the part in a known orientation.

### Small numbers of defects

With only a handful of defects on a part, distance tests have little power. Five defects give five nearest-neighbour distances, and almost any arrangement of five points is consistent with randomness at conventional significance levels. The Clark–Evans z value also relies on a normal approximation that is poor for small n. For parts with fewer than about 15 to 20 defects, the honest course is either to pool information across many parts, as the composite map and the counts per door do, or to use a Monte Carlo test and accept that it may not be able to decide.

## The G function: the whole distribution

A mean hides detail. The **G function** is the cumulative distribution of nearest-neighbour distances: G(r) is the fraction of defects whose nearest neighbour lies within distance r. Under complete spatial randomness on an unbounded surface, G(r) = 1 − exp(−λ π r²), the chance that a circle of radius r around a defect contains at least one other. Plotting the observed G against this curve shows at which distances the pattern departs from randomness.

```figure
type: line
title: G function of the crater door against complete spatial randomness
x: Distance r, mm
y: Fraction of craters with a neighbour within r
ymin: 0
ymax: 1
legend: Crater door | Random, same density
caption: This is an illustration. More than half the craters have a neighbour within 20 mm, against 5% for random placement, and every crater has one within 80 mm. The curve is zero below about 11 mm: no two crater centres were closer than that, because each crater is about 10 mm across and two cannot overlap without merging into one.
- 10 | 0.000 | 0.014
- 20 | 0.571 | 0.053
- 30 | 0.714 | 0.116
- 40 | 0.810 | 0.197
- 60 | 0.929 | 0.390
- 80 | 1.000 | 0.585
- 100 | 1.000 | 0.747
```

The G function reveals something the mean did not. Below about 11 mm, no crater has a neighbour at all. That is a **hard core**: craters are about 10 mm across, and two contamination droplets landing closer than that make one larger crater rather than two. The pattern is strongly clustered at the scale of 20 to 60 mm and inhibited below 11 mm, a combination common in real defects whose physical size is not negligible. A single summary number would have hidden it.

## Edges

The Clark–Evans formulas assume the pattern continues indefinitely in every direction. A real door ends at its edges, and a defect near an edge has its nearest neighbour searched for only on one side: any neighbour that would have been just beyond the edge does not exist. Defects near edges therefore have longer nearest-neighbour distances than the formula expects, which biases R upwards, towards apparent regularity. The bias is larger when there are few defects and the region's perimeter is long compared with its area, as on a narrow part.

There are formula corrections for edge effects, but on real parts the simplest and most reliable approach is the Monte Carlo test of Chapter 3. Simulate many random patterns with the same number of defects on the same region, compute their mean nearest-neighbour distances with exactly the same edge behaviour, and compare.

For the dust door, 999 random patterns of 25 points on an 800 by 1,200 mm rectangle gave mean nearest-neighbour distances averaging **107.4 mm**, not the 98.0 mm of the formula: the edges add about 10%. The middle 95% of simulated values ran from 83.1 to 130.7 mm. The observed 110 mm sits near the middle, with a one-sided probability of 0.43 of a value this large or larger. Allowing properly for the edges, the dust door is about as random as a door can be. The faint regularity suggested by R = 1.12 was the edge effect.

For the crater door, the 999 simulated means ranged around 81 mm, and none came close to the observed 25.7 mm. The Monte Carlo probability is 1 in 1,000, the smallest possible with 999 simulations, confirming the clustering.

### Holes and cut-outs

Edges are not only at the outside of a part. A door with a cut-out for a meter, a casting face with bolt holes, or a panel with louvres has internal edges where no defect can occur, and the same bias arises around them. Simulating random patterns on the actual outline, with the holes removed, handles them automatically: the simulated points fall only where real defects could, and the simulated distances carry the same edge effects as the real ones.

## The region is part of the test

Every nearest-neighbour statistic depends on the density, and the density depends on the area chosen as the region. Choosing a smaller region raises the density, shortens the expected distance and pushes R towards 1; choosing a larger region does the opposite. The region must therefore be the area on which defects could have occurred, defined in advance, such as the whole inspected face of the part, and not an area drawn around where the defects happen to be.

## The error: an improvement that was a change of region

After the silicone contamination was traced to an air line serving the touch-up gun, a coalescing filter was fitted to the line, and a week later a door with 40 craters was found. A second technician analysed it and reported a Clark–Evans ratio of 0.55, compared with 0.34 on the first crater door, and the summary said that the filter had "reduced the clustering of craters by more than half, though not eliminated it".

The engineer checked the calculation. The second technician had taken the region as the bounding rectangle around the craters, about 0.37 m², rather than the door's face of 0.96 m². With the same rule applied to the first door, its bounding rectangle of 532 by 693 mm, 0.369 m², gave R = **0.55** as well. Recalculated with the whole door face, the second door gave R = 0.33. There had been no change in clustering at all; the difference came entirely from the region.

```figure
type: compare
title: The first crater door with two choices of region
rowhead: Region
cols: Area | Density | Expected mean distance | R
caption: This is an illustration. The same 42 craters and the same observed mean distance of 25.7 mm. Drawing the region around the defects inflates the density and makes the pattern look less clustered. Only a region fixed in advance gives comparable results.
- * Whole door face | 0.960 m² | 43.75 per m² | 75.6 mm | 0.34
- Bounding rectangle of the craters | 0.369 m² | 113.8 per m² | 46.8 mm | 0.55
```

The engineer then looked at why craters were still appearing. The new filter had been fitted on the main air line, but the touch-up gun drew from a separate drop with its own old regulator, which was the source of the oil. That drop was fitted with its own filter, and crater doors stopped appearing. The episode is a reminder that a statistic is only comparable between parts when it is computed in the same way, and that an improvement in a number should always be checked against a change in the method.

## Distances across many parts

A single part's nearest-neighbour test describes that part. To monitor whether clustering is present on a line, the same statistic can be computed for every part with enough defects and tracked over time, always with the same region and the same method. Plant E now photographs and analyses any door with ten or more craters, a rare event since the touch-up line was filtered, and logs its Clark–Evans ratio with the date and the gun used. A ratio well below 1 on such a door points straight to a contamination source acting locally, such as a gun or an air line, rather than to a general cause such as room air, and tells maintenance where to look before the next shift starts.

## Other distance measures

Nearest-neighbour distances are measured from defect to defect. A complementary measure, the **empty-space distance**, is measured from random points on the part to the nearest defect, and its cumulative distribution is called the F function. In clustered patterns, defects have close neighbours but random points are often far from any defect, because defects crowd into a few places and leave large empty areas; so G rises quickly and F rises slowly. In regular patterns the reverse holds. Comparing G and F is a sensitive check, and the J function, their ratio in a form that equals 1 for complete spatial randomness, packages it into one curve. These refinements are standard in spatial statistics software; the principle is the same as everything in this chapter.

## How this applies to a small Australian business

When a single part has many defects and you want to know whether they cluster, measure their positions and compute the nearest-neighbour distances. Define the region as the inspected area of the part, decided in advance. Compare the mean distance with random patterns simulated on the same shape, which takes care of edges, and plot the distribution of distances to see at what scale any clustering lies, and whether the defects keep a minimum spacing that reflects their own size.

## Exercise: pinholes on a cast panel

A cast aluminium panel with an inspected face of 0.5 m² shows 30 pinholes after powder coating, with a mean nearest-neighbour distance of 52 mm. (a) What is the expected mean distance under complete spatial randomness, ignoring edges? (b) What are R and z? (c) What would you check before concluding that the pinholes are clustered?

**Worked answer.** (a) λ = 30 ÷ 0.5 = 60 per m², so r_E = 0.5 ÷ √60 = 0.0645 m = **64.5 mm**. (b) R = 52 ÷ 64.5 = **0.81**. SE = 0.26136 ÷ √(30 × 60) = 0.00616 m = 6.16 mm, so z = (52 − 64.5) ÷ 6.16 = **−2.04**. (c) The z value suggests mild clustering at about the 5% level, and since edges bias R upwards, the clustering may be slightly stronger than it looks. But a value this close to the threshold needs a Monte Carlo test on the actual panel outline, including any holes, and a check that the density is uniform over the panel. Pinholes in castings are often more common over thick sections, which would make them look clustered because the density varies, not because one pinhole causes others. Chapter 8 deals with that distinction.
