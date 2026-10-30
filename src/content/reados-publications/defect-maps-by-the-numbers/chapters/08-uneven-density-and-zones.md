---
book: defect-maps-by-the-numbers
chapterSlug: uneven-density-and-zones
order: 8
title: "Uneven density and zones"
description: "Describing defect density that varies across a part, estimating it by cells or smoothing, predicting the effect of removing one source, and why uneven density can masquerade as clustering."
draft: false
---

Complete spatial randomness assumes the chance of a defect is the same everywhere on the part. Plant E's doors break that assumption plainly: the band under the hooks collects defects at three times the rate of the rest. A pattern whose density varies from place to place is called **inhomogeneous**, and describing it well is often the most practical result of a defect study, because the place where density is high is the place where a cause can be removed.

This chapter describes inhomogeneous density, estimates it from the composite map, uses it to predict what removing the hook flakes would do to yield, and discusses zones in specifications. Its error is the most subtle in this book: uneven density mistaken for clustering.

## The intensity function

For an inhomogeneous pattern, the single density λ of earlier chapters is replaced by an **intensity function** λ(x, y), the expected number of defects per unit area at each point of the part. The expected number in any region is the integral of the intensity over it, and if defects are otherwise independent, the count in a region is still Poisson with that expected value. This is the inhomogeneous Poisson process, the natural model for defects whose rate depends on position but which do not otherwise influence each other.

### Estimating the intensity from cells

The simplest estimate divides the part into cells and takes each cell's count divided by its total inspected area over all parts. For the composite map of 400 doors, each 200 mm row is 0.16 m² per door and 64 m² over the study.

```figure
type: bars
title: Defect intensity in each 200 mm row of the door
unit: defects per m²
caption: This is an illustration. Row counts from Chapter 1 divided by 64 m² of inspected area per row. The top row runs at 1.28 per m²; the other five rows lie between 0.38 and 0.48, around their combined average of 0.431.
- * Row 1 | 1.281
- Row 2 | 0.375
- Row 3 | 0.484
- Row 4 | 0.453
- Row 5 | 0.391
- Row 6 | 0.453
```

Cells are crude but honest: the estimate jumps at cell boundaries, and its precision depends on the counts. A smoother estimate comes from **kernel smoothing**, which places a small bump of fixed width, the bandwidth, over each defect and adds them up. The result is a continuous map of intensity, often drawn as a heat map. The bandwidth controls the trade-off: too narrow, and the map shows every defect as its own spike; too wide, and real features blur away. A bandwidth of about the scale of the features one is looking for, here 100 to 200 mm, is a reasonable start, and comparing two or three bandwidths shows which features are robust.

On Plant E's composite map, a kernel estimate with a 100 mm bandwidth showed two peaks centred about 80 mm below each hook hole, at about three and a half times the lower-door intensity, joined by a weaker ridge along the top edge, and a nearly flat surface over the rest of the door. That is the signature of flakes falling from the hooks and spreading a little as they fall, with occasional bumps along the top rail.

### How precise is an intensity map?

Each cell's estimate is a count divided by an area, and the count carries Poisson scatter at least, more if defects cluster between parts. A rough guide to the relative standard error of a cell's intensity is 1 ÷ √count. The top row, with 82 defects, is known to within about 11%; a single 200 mm cell with 4 defects is known only to within about 50%. Differences between small cells of a few counts each are therefore rarely meaningful, and a heat map drawn from sparse data will show bright and dark patches that are nothing but noise. Plant E's engineer judged the map by rows first, where counts were large, and looked at individual cells only where they agreed with a physical reason, such as the hooks.

### Intensity against a measurable cause

Sometimes intensity can be related to something measured at each point of the part, a **covariate**: distance from a hook, the local film thickness, the section thickness of a casting under a coated face, or the time a region spends near an oven door. The relation can be explored by grouping the part into bands of the covariate and computing the intensity in each band, and modelled formally by Poisson regression, in which the logarithm of the intensity is a linear function of the covariates. Plant E's engineer grouped the top-row defects by their distance from the nearest hook hole and found that intensity fell steadily with distance and reached the lower-door level at about 150 mm, the same distance the cross-K function of Chapter 6 had suggested. That measurement fixed the width of the zone that clean hooks would affect, and showed that the effect was from the hooks themselves, not from the conveyor rail above them, which would have produced a band of even width along the whole top edge.

Covariates are often the most persuasive evidence an engineer can present. A plot showing defect intensity rising steadily with some measurable property of the process, with a physical reason for the relation, convinces people who are unmoved by a significant test statistic.

## Predicting the effect of removing a source

An intensity map invites a prediction: what if the hook flakes were removed? If the top row fell to the same intensity as the rest of the door, 0.431 per m², the expected number of defects per door would fall from 0.550 to 0.431 × 0.96 = **0.414**. The excess in the top row is 82 − 0.431 × 64 = 54.4 defects over 400 doors, or 0.136 per door.

How much would first-pass yield rise? Two approaches give quite different answers.

- **The clustered yield model with unchanged α.** The negative binomial model of Chapter 7 with m = 0.414 and α = 0.336 predicts a yield of 76.4%, a gain of about four points over the model's 72.2%.
- **Door-by-door from the map.** The map records which doors had which defects. Of the 104 rejected doors, 38 had defects only in the top band, 28 had defects both in the top band and lower down, and 38 had defects only below the top band. If the hook flakes were removed, the 38 doors with top-band defects only would become clean, provided their top-band defects were all flakes, which the inspection notes confirmed for nearly all of them. First-pass yield would rise to (296 + 38) ÷ 400 = **83.5%**, a gain of 9.5 points.

```figure
type: compare
title: Two predictions of first-pass yield after cleaning the hooks
rowhead: Method
cols: Basis | Predicted first-pass yield | Gain over the present 74%
caption: This is an illustration. The door-by-door prediction uses which doors carried which defects. The model prediction assumes the clustering between doors is unchanged, which is unlikely when the main cause of that clustering is the thing being removed.
- Negative binomial model, α unchanged | mean falls from 0.550 to 0.414 per door | 76.4% | about 2 points
- * Door by door from the map | 38 doors with top-band defects only become clean | 83.5% | 9.5 points
```

The direct prediction is the better one here, and by a wide margin, because the hook flakes were a large part of the between-door clustering: they fell on doors under dirty hooks, which were often clean elsewhere. Removing them removes defects from doors that would otherwise be clean far more often than a model with unchanged clustering assumes. When a map records which part each defect was on, the direct calculation is usually both simpler and more reliable than any model. The model is for parts and situations the map does not cover. The direct prediction of 83.5% matches the expectation in Chapter 1's exercise of a rework rate near 16%.

## Zones in specifications

Uneven density interacts with uneven requirements. Many appearance standards divide a part into zones: a significant surface that customers see, where defects are judged strictly, and other surfaces, judged less strictly or not at all. Where defects fall relative to the zones then matters as much as how many there are.

Plant E's doors are visible over their whole outer face, but the top 15 mm sits behind the enclosure's gasket rebate when the door is closed. The customer's appearance standard, read carefully, excludes surfaces hidden in the assembled product. A small part of the top band, the strip within 15 mm of the edge, was therefore not a significant surface at all, and a handful of the rejected doors had their only defects there. Defining that strip as a non-significant zone, agreed in writing with the customer, removed a few rejections at no cost. It did nothing for the main problem and was not a substitute for clean hooks, since almost all the flakes landed lower than 15 mm, but it is a reminder that the zone boundaries in a specification belong in the analysis.

## The error: uneven density read as clustering

Before the hook effect was understood, a consultant asked to review the defect data computed the K function of Chapter 6 for the composite pattern of all 220 defects, placing each defect at the centre of its 50 mm cell. The L(r) − r curve rose above the envelope from about 100 mm to 400 mm, and the consultant's report concluded that "defects occur in clusters about 300 mm across", recommending a search for a mechanism, such as electrostatic attraction, that would draw defects together.

The engineer recognised the problem. The envelopes came from complete spatial randomness, which assumes the same intensity everywhere. The composite pattern had a band of high intensity at the top, and any pattern with a high-intensity region has more pairs of points close together than CSR predicts, simply because more points are crowded into that region. A K function compared with CSR cannot tell whether points attract each other or merely share a crowded zone. Statisticians have long known that clustering and inhomogeneity can produce identical patterns.

The engineer repeated the analysis with the **inhomogeneous K function**, which weights each pair by the estimated intensity at its two points, using the row intensities above. Against envelopes from inhomogeneous Poisson patterns with the same intensity map, the curve lay within the envelope at every distance. Once the uneven density was allowed for, the defects showed no tendency to gather together. The 300 mm "clusters" were the hook band.

```figure
type: decision
title: Clustering or uneven density?
question: Does a pattern show more close pairs than complete spatial randomness?
caption: Both explanations produce the same departure from randomness in one pattern. Telling them apart needs either a physical reason to expect one, or repeated patterns on many parts, where uneven density repeats in the same place and true clustering appears in different places each time.
- No | consistent with randomness at the scales tested | look elsewhere for causes
- *Yes, and the excess is in the same place on every part | uneven density tied to the part or process | map the intensity and find what is different about that place
- Yes, and the excess moves from part to part | true clustering within parts | look for a mechanism that produces defects in groups
```

The distinction mattered a great deal in practice. Clustering would have sent the investigation looking for a mechanism that attracts defects to each other; uneven density pointed straight at the hooks. With one pattern, the two cannot be told apart by statistics alone. With many parts, as Plant E had, they usually can: uneven density repeats in the same place on every door, while true clustering, like the craters, appears in different places each time.

## After the fix: checking the map again

An intensity map is also the natural check on a fix. If the hooks are the cause, then after they are cleaned the top row's intensity should fall to the level of the rest of the door, and the rest of the door should be unchanged. Both halves of that prediction matter. A fall in the top row with no change elsewhere confirms the cause; a fall everywhere suggests that something else changed at the same time, such as the weather or the powder batch, and that the hooks may deserve less credit than they seem to. Chapter 11 makes that comparison for Plant E, with a statistical test of the change in total defects per door and a fresh map to show where the change happened.

## How this applies to a small Australian business

Estimate how defect density varies across your part, from cell counts or a smoothed map, and look for the high-density places: they are where the causes are. Before predicting the effect of removing a cause, look door by door, part by part, at which defects would disappear, rather than relying only on a model. Check the zones in your customer's specification against your map. And when an analysis reports clustering, ask whether it could equally be uneven density, which is cheaper to find and usually to fix.

## Exercise: defects in a kick zone

A customer asks Plant E to treat the bottom 300 mm of the door as a separate zone. (a) Using the lower-door intensity of 0.431 per m², what is the expected number of defects per door in that 800 by 300 mm zone? (b) Under the Poisson model within the zone, what share of doors would have at least one defect there? (c) Why might the real share be lower?

**Worked answer.** (a) The zone is 0.8 × 0.3 = 0.24 m², so the expected number is 0.431 × 0.24 = **0.103 defects per door**. (b) Under the Poisson model, the share with at least one is 1 − e^(−0.103) = **0.098, or about 9.8%**. (c) Because defects cluster between doors, as Chapter 7 showed: some doors, coated at dusty times, receive more than their share and others fewer, so the defects in the zone fall on fewer doors than the Poisson model assumes. The real share with a defect in the zone would be somewhat lower than 9.8%, and the door-by-door map would give it directly.
