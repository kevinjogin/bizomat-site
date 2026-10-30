---
book: defect-maps-by-the-numbers
chapterSlug: ripleys-k-and-the-scale-of-clustering
order: 6
title: "Ripley's K and the scale of clustering"
description: "Using Ripley's K function and its L transform to see clustering or regularity at every distance at once, testing against simulation envelopes, and reading the scale of clusters from the curve."
draft: false
---

Nearest-neighbour distances see only the closest neighbour of each defect. A pattern of tight pairs scattered at random, and a pattern of large loose clusters, can have similar nearest-neighbour distances and very different causes. Quadrat counts see only the scale of their cells. What an engineer usually wants to know is at what distances defects are found together more often than chance would give, and over what distance that effect extends. Ripley's K function, introduced by the statistician Brian Ripley in 1977, answers both questions by counting neighbours at every distance at once.

This chapter defines the K function and its more readable form, the L function, estimates them for Plant E's crater and dust doors, and tests them against envelopes from simulated random patterns. It shows how to read the size of clusters from the curve. Its error is a single point outside the envelope that was taken as proof.

## Counting neighbours at every distance

For a pattern with density λ, Ripley's K function is defined so that λ K(r) is the expected number of other defects within distance r of a typical defect. Under complete spatial randomness, the other defects are spread evenly at density λ, so the expected number within a circle of radius r is λ π r², and **K(r) = π r²**. Clustering makes defects have more neighbours at short distances than that, so K(r) exceeds π r²; regularity makes it fall short.

K is estimated by counting, for every pair of defects, whether they lie within r of each other. With n defects on a region of area A, the simplest estimate is K̂(r) = A × (number of ordered pairs closer than r) ÷ (n (n − 1)). Because K grows like π r², it is hard to read directly, so it is usually transformed to the **L function**, L(r) = √(K(r) ÷ π), which equals r for complete spatial randomness. Plotting L(r) − r makes randomness a flat line at zero, clustering a hump above it and regularity a dip below.

```figure
type: formula
title: Ripley's K and the L transform
formula: K̂(r) = A × (ordered pairs closer than r) ÷ [n (n − 1)]     L(r) = √(K(r) ÷ π)     random: K(r) = π r², L(r) − r = 0
caption: The simple estimate ignores edges, which makes it fall below π r² at large distances even for random patterns, because circles around defects near an edge reach outside the part. Edge-corrected estimates exist; testing against simulated patterns on the same region, as below, makes the correction unnecessary for a test.
- r | distance at which neighbours are counted
- n, A | number of defects and area of the region
- K(r) | expected neighbours within r of a typical defect, divided by the density
- L(r) − r | zero for randomness, positive for clustering, negative for regularity
step: Crater door at r = 50 mm: 78 pairs closer than 50 mm (156 ordered pairs); K̂ = 960,000 × 156 ÷ (42 × 41) = 86,969 mm²
step: π r² = 7,854 mm², so K̂ is 11.1 times the random value, and L − r = √(86,969 ÷ π) − 50 = 116.4 mm
```

In plainer terms, a typical crater has on average 3.8 other craters within 50 mm of it. If the 42 craters were spread at random over the door, a typical crater would have 0.34 within 50 mm. The pattern has eleven times the random number of close neighbours at that distance.

## Envelopes from simulation

How far above or below zero must L(r) − r be to signal a departure from randomness? Rather than rely on formulas, which struggle with edges and small numbers, the standard approach is a **Monte Carlo envelope**. Simulate 99 random patterns with the same number of defects on the same region, compute L(r) − r for each at every distance, and at each distance record the highest and lowest of the 99 values. The real pattern's curve is then plotted between these envelopes. Where it lies above the upper envelope, there is evidence of clustering at that distance; below the lower envelope, of regularity.

Because the simulations use the same region and the same estimator as the real data, the edge bias appears equally in both. That is why the envelopes on Plant E's 800 by 1,200 mm door dip below zero at larger distances: random patterns themselves show negative L(r) − r there when edges are ignored, and the real pattern is judged against that, not against zero.

### The crater door

```figure
type: line
title: L(r) − r for the crater door, with envelopes from 99 random patterns
x: Distance r, mm
y: L(r) − r, mm
ymin: -100
ymax: 200
legend: Crater door | Highest of 99 random patterns | Lowest of 99 random patterns
caption: This is an illustration. The crater curve lies far above the upper envelope from 25 mm to 250 mm, peaks near 100 to 125 mm and falls back towards the envelope by 300 mm. At 10 mm it is at its lowest possible value, because no two craters are that close.
- 10 | -10.0 | 16.6 | -10.0
- 25 | 65.3 | 17.1 | -25.0
- 50 | 116.4 | 20.5 | -17.4
- 75 | 158.0 | 15.3 | -21.7
- 100 | 172.4 | 20.6 | -27.0
- 125 | 171.1 | 14.7 | -30.8
- 150 | 156.1 | 12.1 | -30.9
- 200 | 111.8 | 6.4 | -40.1
- 250 | 61.8 | -1.5 | -52.4
- 300 | 14.1 | -8.1 | -72.4
```

The crater curve is far above the envelope over a wide range of distances, which confirms strong clustering. Its shape says more. It rises steeply to about 100 mm and then flattens and falls. That is the typical shape for a pattern made of separate clusters: within a cluster, every extra few millimetres of radius adds many neighbours; once the circle is larger than a cluster, extra radius adds only empty door, and the curve turns down. The distance at which L(r) − r peaks, here 100 to 125 mm, is a useful indication of the scale of the clusters, roughly their diameter. The three groups of craters on the door are indeed each about 100 to 160 mm across.

At very short distances the curve sits at its floor: at 10 mm, no pairs at all. That is the hard core seen in the G function in Chapter 5, the minimum spacing imposed by the craters' own size. A pattern can be clustered at one scale and regular at another, and the K function shows both on one plot.

### The dust door

The same analysis of the 25 dust specks gives a curve that wanders within the envelope at every distance from 10 to 300 mm, touching the upper envelope at 25 mm and staying well inside it elsewhere. The dust door is consistent with complete spatial randomness at every scale tested, as the quadrat and nearest-neighbour tests also found.

```figure
type: compare
title: L(r) − r for the dust door against its envelopes
rowhead: Distance
cols: Dust door | Lowest of 99 random | Highest of 99 random
caption: This is an illustration. The dust curve lies within the envelopes at every distance. At 25 mm it equals the upper envelope because of a single close pair of specks, the kind of event that random patterns produce now and then.
- 25 mm | 20.1 | −25.0 | 20.1
- 50 mm | 21.4 | −50.0 | 40.3
- 100 mm | 5.9 | −44.7 | 27.7
- 150 mm | −10.9 | −49.1 | 30.5
- 200 mm | −11.2 | −50.3 | 18.8
- 300 mm | −21.8 | −76.6 | 4.5
```

## A model of the clusters

A curve like the craters' can be matched to a simple model of how the pattern formed. In a **cluster process**, "parent" events occur at random over the surface, and each produces a group of "offspring" defects scattered around it. For the craters the parents are moments when a burst of oil-laden air reached the gun and the gun was pointing at a particular place on the door; the offspring are the craters each burst caused. A common version, the Thomas process, scatters the offspring around each parent with a normal distribution of a chosen spread. Its K function has a known form, and fitting it to the observed curve gives estimates of the number of parents per unit area and the spread of each cluster.

For the crater door, a fit of this kind points to three or so parent events per door, each scattering about 14 craters with a spread of roughly 40 mm in each direction, which matches what the eye sees. The numbers are useful less for their precision than for what they say about the mechanism. Three bursts per door, each lasting long enough to place a dozen or more craters, suggested intermittent slugs of oil from a drain that was emptied only occasionally, rather than a continuous mist, and the regulator drop that Chapter 5 found had exactly such a drain.

## Two types together: the cross-K function

The same idea extends to two kinds of points. The **cross-K function** counts, for a typical point of one kind, the points of a second kind within distance r. It answers questions such as whether dust specks lie closer to the hanging holes than chance would put them, or whether pinholes in a casting lie closer to its thick sections. Plant E's engineer used it on the composite data to compare dust specks with the positions of the two hooks: the cross-K function rose well above its envelope within about 150 mm of the hooks and was flat beyond, which put a distance on the hook effect for the zoning in Chapter 8.

## Reading an envelope plot correctly

Envelope plots are easy to read and easy to over-read. Three points matter.

- **The envelope is pointwise.** At any single distance chosen in advance, a curve above the highest of 99 random curves has a chance of about 1 in 100 under randomness. But the plot shows many distances at once, and a random pattern has a much larger chance of crossing the envelope at some distance or other. A crossing at one or two isolated distances is weak evidence; a curve well outside the envelope over a wide range of distances, like the craters', is strong.
- **The envelope depends on the reference model.** The envelopes here come from complete spatial randomness. A curve outside them shows that the pattern is not CSR, which may mean clustering or may mean that density varies across the region. Chapter 8 deals with telling these apart.
- **The shape is the information.** Where the curve rises, peaks and falls tells the scale of clustering, which points to the mechanism: clusters 100 mm across suggest a spray or a drip; clusters 10 mm across suggest spatter; a band across the part suggests something that travels across it.

## The error: one point outside the envelope

When the hooks were cleaned and the dust level fell, the engineer analysed another door with 31 dust specks to check that what remained was random. Its L(r) − r curve lay inside the envelope everywhere except at 40 mm, where it rose just above the upper envelope. A draft note concluded that the remaining dust was "clustered at 40 mm, suggesting a secondary source", and recommended checking the booth's extraction ducts for a deposit that might be shedding clumps.

The engineer's manager, who had seen envelope plots before, asked how many distances had been examined. The curve had been computed at 30 distances, from 10 to 300 mm in 10 mm steps. With 30 distances and envelopes from 99 simulations, a random pattern would cross the envelope at one distance or another fairly often, and a single marginal crossing among 30 is exactly what chance supplies. A **global test**, which compares the largest departure over all distances in the real pattern with the largest departures in the simulated ones, gave a probability of 0.31: no evidence of clustering.

The duct inspection was not wasted, since the ducts were due for cleaning and were found reasonably clean, but the note was rewritten to say that the remaining dust showed no evidence of clustering at any scale. Plant E's procedure now asks for the global test whenever a K-function plot is used to support an action, and treats a pointwise crossing at a few isolated distances as a reason to collect more data, not as a finding.

## When to use K, and when not

The K function needs exact positions, which are not available from the routine 50 mm map, and it needs enough defects on each part, or a sound way of combining parts. It is most useful when a part has many defects and the question is what kind of clustering is present and at what scale, as with the crater door. For the routine question of where on the part defects tend to fall, the composite map and quadrat counts are simpler and adequate. For the question of how defects are shared between parts, which drives yield, the counts per part are what matter, and Chapter 7 takes them up.

Software for spatial point patterns computes edge-corrected K and L functions, envelopes and global tests directly from a list of coordinates and an outline. The free statistical environment R, with its spatial statistics packages, is widely used for this in research, and the calculations are simple enough to set up in a spreadsheet or a short script for small patterns, as Plant E's engineer did.

A practical note on effort: computing K by hand for 42 points means checking 861 pairs at each distance, which is tedious but trivial for a spreadsheet with one row per pair or for a short script. The simulation envelopes multiply the work by a hundred, which is still only seconds of computer time. The slow part is measuring the positions, not the analysis.

## How this applies to a small Australian business

When you have a part covered in defects and want to know whether they cluster and at what scale, measure their positions and compute the L function against envelopes from random patterns on the same outline. Read the scale of clustering from where the curve peaks, look for a minimum spacing at short distances, and match both to possible mechanisms. Be wary of single crossings of the envelope; ask for a global test before acting.

## Exercise: neighbours within 50 mm

A panel of 0.5 m² carries 30 weld spatter marks. At r = 50 mm the engineer counts 42 ordered pairs closer than 50 mm. (a) Estimate K(50) using the simple estimate. (b) What would K(50) be for complete spatial randomness? (c) What is L(50) − 50, and what does it suggest?

**Worked answer.** (a) A = 500,000 mm², so K̂(50) = 500,000 × 42 ÷ (30 × 29) = 21,000,000 ÷ 870 = **24,138 mm²**. (b) For randomness, K(50) = π × 50² = **7,854 mm²**. (c) L(50) = √(24,138 ÷ π) = 87.7 mm, so L(50) − 50 = **37.7 mm**. The estimate is about three times the random value, which suggests clustering at the 50 mm scale, such as spatter landing in groups near each weld. Before concluding, the engineer should compare it with envelopes from random patterns of 30 points on the same panel, since a single distance on a small pattern can mislead.
