---
book: defect-maps-by-the-numbers
chapterSlug: clustered-defects-and-yield
order: 7
title: "Clustered defects and yield"
description: "Why clustering between parts raises first-pass yield at a given defect density, the negative binomial yield model and its clustering parameter, and yield for new parts and processes."
draft: false
---

Chapter 2 found that the Poisson model badly underestimated Plant E's first-pass yield: it predicted 58% of doors clean, and 74% were. The reason was that defects did not fall independently on doors. Some doors received several, and many received none, so the same total number of defects was shared among fewer doors than random scatter would give. That is good news for yield, and it has a large effect on every prediction an engineer makes from a defect density, such as the yield of a new, larger part or the benefit of a cleaner process.

This chapter explains why clustering between parts raises yield, introduces the negative binomial model that the semiconductor industry developed for exactly this problem, fits it to Plant E's doors and uses it to predict yield for other door sizes and densities. Its error is an investment case built on the Poisson model, which promised twice the gain the line could deliver.

## Why clustering helps yield

A part is good if it has no defects, so yield depends on how many parts have none. Suppose 100 defects are to be shared among 100 parts. If each defect lands on a part chosen at random, the Poisson model applies: a part's chance of escaping all 100 is e^(−1), and 37% of parts are clean. If instead the defects arrive in groups of ten, each group landing on one random part, only ten parts receive defects and 90% are clean. The density is the same; the yield is very different. Real processes lie between these extremes, and the degree of clustering between parts decides where.

Clustering between parts arises whenever the chance of a defect varies from part to part. On Plant E's line, doors hung on hooks heavily coated with cured powder receive flakes, and doors on clean hooks do not; doors coated during windy afternoons, when the building's roller door is open and dust blows into the booth, receive more background dust than doors coated on still mornings. Each door has its own rate, and the rates vary.

## The negative binomial model

If each part's own defect rate varies from part to part according to a gamma distribution, a flexible model for a positive quantity, and defects on each part are then Poisson at that part's rate, the counts per part follow the **negative binomial** distribution. It has two parameters: the mean m, as before, and a clustering parameter α. Its variance is m + m² ÷ α, larger than the Poisson variance m by an amount that grows as α shrinks.

```figure
type: formula
title: The negative binomial yield model
formula: variance = m + m² ÷ α     Y = P(no defects) = (1 + m ÷ α)^(−α)     α → ∞ gives the Poisson yield e^(−m)
caption: Small α means strong clustering between parts and high yield for a given mean; large α approaches the Poisson model. The model was developed and widely used for the yield of integrated circuits, where defects cluster on wafers in the same way.
- m | mean defects per part, density × area
- α | clustering parameter, estimated from the counts
- Y | expected first-pass yield
step: Plant E: m = 0.550, variance = 1.451, so α = m² ÷ (variance − m) = 0.3025 ÷ 0.901 = 0.336
step: Y = (1 + 0.550 ÷ 0.336)^(−0.336) = 0.722, against 0.740 found and 0.577 from the Poisson model
```

The clustering parameter is estimated here by the method of moments, from the mean and variance of the counts per door. Maximum likelihood gives a slightly better estimate and is available in statistical software, but the moment estimate is adequate for planning and shows the arithmetic plainly.

### Where the model came from

The semiconductor industry met this problem early and on a large scale. As chips grew larger in the 1960s and 1970s, yield predictions from the Poisson model, which multiplies the defect density by the chip's area, became far too pessimistic: large chips yielded much better than the model said. Murphy, Seeds and others proposed alternative models that allowed the defect density to vary from wafer to wafer and across each wafer, and Stapper and his colleagues at IBM showed that the negative binomial model, with its clustering parameter fitted from real wafers, described the yields well. Their 1983 review set out the reasoning and the evidence. The same model has since been applied to printed circuit boards, flat panel displays, coated and painted products and any other process where defects fall on areas and some areas are more exposed than others.

### Estimating α from the yield alone

Sometimes the counts per part are not available, only the mean number of defects per part and the first-pass yield. The clustering parameter can still be found, by solving (1 + m ÷ α)^(−α) = Y for α by trial, or with a spreadsheet's goal-seek function. For Plant E, m = 0.55 and Y = 0.74 give α = 0.273, somewhat smaller than the 0.336 from the variance, because the observed yield is a little higher than the moment fit predicts. The two estimates bracket the likely value, and predictions made with either are close for modest changes in m.

### How well does it fit?

The negative binomial model with m = 0.55 and α = 0.336 predicts the following distribution of counts per door, compared with what was found and with the Poisson model.

```figure
type: compare
title: Doors by number of defects: found, negative binomial and Poisson
rowhead: Defects on the door
cols: Found | Negative binomial, α = 0.336 | Poisson
caption: This is an illustration. The negative binomial model follows the counts closely, including the long tail of doors with several defects. A chi-square goodness-of-fit comparison over these six classes gives 5.1, well within chance; the Poisson model's is over 160.
- 0 | 296 | 288.8 | 230.8
- 1 | 50 | 60.2 | 126.9
- 2 | 24 | 25.0 | 34.9
- 3 | 14 | 12.1 | 6.4
- 4 | 8 | 6.3 | 0.9
- * 5 or more | 12 | 7.7 | 0.1
```

The fit is good. The model predicts 289 clean doors against 296 found, and a tail of doors with several defects close to what was seen, which the Poisson model misses completely.

## Predicting yield for other parts and densities

The value of the model is in prediction. If the clustering parameter is a property of the process, which it often approximately is when the causes of clustering do not change, then the yield of any part can be predicted from its area and the process density, and the effect of a change in density can be estimated.

```figure
type: compare
title: Predicted first-pass yield under the two models
rowhead: Case
cols: Mean defects per door | Poisson | Negative binomial, α = 0.336
caption: This is an illustration. Predictions assume the clustering parameter stays at 0.336. The Poisson model underestimates yield at every density and exaggerates how much yield improves when density falls.
- Present large door, 0.96 m² | 0.550 | 57.7% | 72.2%
- * Density halved, large door | 0.275 | 76.0% | 81.8%
- Density quartered, large door | 0.138 | 87.2% | 89.1%
- New door, 0.54 m², present density | 0.309 | 73.4% | 80.3%
- Small door, 0.48 m², present density | 0.275 | 76.0% | 81.8%
```

The predictions show two features of clustered defects that matter for decisions.

- **Yield falls more slowly with area.** Doubling the area of a part under the Poisson model squares the yield; under clustering it falls less, because the extra area often lands on parts that already have defects. Larger parts are less heavily penalised than the Poisson model suggests, which matters when quoting a new, larger product.
- **Yield rises more slowly as density falls.** Halving the density under the Poisson model raises yield from 57.7% to 76.0%, a gain of 18 points. Under the clustered model it rises from 72.2% to 81.8%, a gain of under 10 points. The defects removed by a general reduction include many on doors that have other defects too, so fewer doors become clean.

### Where α comes from, and when it changes

The clustering parameter is not a constant of nature. It summarises how much the defect rate varies between parts, and it changes if the causes of that variation change. Cleaning the hooks would remove one source of variation between doors, the difference between clean and dirty hooks, and might raise α; keeping the roller door closed in wind would remove another. Predictions with a fixed α are therefore best used for changes that leave the causes of clustering alone, such as a new door size on the same line. For changes that remove a specific cause, the door-by-door map gives a better estimate, as Chapter 8 shows.

### Finding the sources of between-part variation

Because α measures variation in the defect rate between parts, the obvious next step is to ask what varies. Plant E's engineer split the 400 doors by hook pair and by time of day. Doors on the eight hook pairs with the heaviest powder build-up averaged 1.1 defects each; doors on freshly stripped hooks averaged 0.35. Doors coated between 1 pm and 5 pm on days when the roller door stood open averaged 0.8; doors coated in the mornings averaged 0.4. Each split explained part of the variation, and each pointed at a cause that could be removed.

## Clustering within parts and between parts

Two kinds of clustering appear in this book, and only one of them affects yield directly. **Within-part clustering**, which Chapters 5 and 6 measured on the crater door, is about how defects are arranged on a single part: craters in tight groups rather than spread over the door. **Between-part clustering**, which this chapter measures, is about how defects are shared among parts: some doors with many, many with none.

For first-pass yield, only the second matters. A door with 42 craters in three tight groups is one rejected door, exactly as it would be if the 42 craters were spread evenly over it. What decides yield is how many doors carry at least one defect, and that depends on how the defects are distributed among doors, not on where they sit on each door.

Within-part clustering still matters, in other ways. It points to the mechanism, as the craters' clusters pointed to bursts of contaminated air. It affects rework, since a door with its defects in one small area can be spot-repaired, while one with defects scattered over its face needs a full recoat. And in some products, such as large castings or panels where a defect-free zone is acceptable even if another zone has defects, it affects yield through the zoning of Chapter 8.

## The cost of the bad parts

Clustering raises yield, but it concentrates the defects on the parts that fail, and that has a cost of its own. The average number of defects on a rejected door is the mean per door divided by the share of doors rejected. For Plant E that is 0.55 ÷ 0.26 = 2.1 defects per rejected door. Under the Poisson model it would be 0.55 ÷ 0.423 = 1.3. Rejected doors on a clustered line carry more defects each, take longer to repair and are more likely to fail again after repair, which was why eight of the 104 rejected doors in the study had to be scrapped rather than recovered. A rework cost per door estimated from a line where defects were spread thinly may understate the cost on a clustered one.

## The error: an investment case built on Poisson

To justify upgrading the booth's air supply, a project expected to halve the background dust density, Plant E's maintenance planner prepared a business case. Using the density from Chapter 2 and the Poisson model, the case predicted that first-pass yield would rise from 57.7% to 76.0%, an increase of 18.3 points, worth 1,500 × 0.183 × A$38 = A$10,431 a week in avoided rework, and a payback of under three months on the A$120,000 upgrade.

The engineer pointed out that the Poisson model did not even reproduce the present yield, which was 74%, not 57.7%. With the negative binomial model, which did reproduce it, halving the density was predicted to raise first-pass yield from 72.2% to 81.8%, a gain of 9.6 points, worth about A$5,470 a week. And the upgrade would halve only the background dust, not the hook flakes, which a separate, cheaper change would address. Once that change was made, the remaining gain from the air upgrade would be smaller still.

```figure
type: stats
title: The air upgrade business case, recalculated
caption: This is an illustration. The same density and the same proposed halving, with the clustered model that fits the line's actual yield. Rework at A$38 per door on 1,500 doors a week.
- 18.3 points | yield gain claimed with the Poisson model
- 9.6 points | yield gain predicted with the negative binomial model
- A$10,431 | weekly saving claimed
- A$5,470 | weekly saving predicted, before allowing for the hook fix
```

The upgrade was deferred until after the hook fix, so that its benefit could be estimated from the line as it would then be. The lesson is general: a yield model must first reproduce the present yield before its predictions of a future one deserve trust, and when defects cluster between parts, the Poisson model fails that test.

## How this applies to a small Australian business

When you predict yield from a defect rate, check the model against the yield you have now. If the Poisson model predicts fewer good parts than you actually get, defects are clustering between parts, and the negative binomial model, fitted from the mean and variance of defects per part, will usually do much better. Use it to quote larger parts and to estimate the benefit of general improvements, and remember that it understates nothing about cost: clustering means the bad parts are very bad, which matters for rework time and scrap.

The model also helps when talking to customers. A customer who sets an appearance standard by "defects per square metre" and a supplier who reports "parts rejected per hundred" are describing the same process with different numbers, and the relation between them depends on clustering. Showing both, with the model that links them, avoids a common argument in which each side thinks the other's figures are wrong.

## Exercise: a smaller panel on a clustered line

A line coating 1.0 m² panels has a mean of 0.6 defects per panel and a variance of 1.32. (a) Estimate α. (b) Predict the first-pass yield of a 0.5 m² panel on the same line under the negative binomial and Poisson models. (c) Which prediction would you use for a quote, and why?

**Worked answer.** (a) α = m² ÷ (variance − m) = 0.36 ÷ (1.32 − 0.6) = 0.36 ÷ 0.72 = **0.5**. (b) For the 0.5 m² panel, m = 0.3. Negative binomial: (1 + 0.3 ÷ 0.5)^(−0.5) = 1.6^(−0.5) = **0.791, or 79%**. Poisson: e^(−0.3) = **0.741, or 74%**. (c) The **negative binomial** prediction, provided it reproduces the yield of the present 1.0 m² panel: there it gives (1 + 0.6 ÷ 0.5)^(−0.5) = 0.674, which should be checked against the line's actual first-pass yield. If it matches, the same clustering can reasonably be assumed for the smaller panel on the same line, since nothing about the causes of clustering changes.
