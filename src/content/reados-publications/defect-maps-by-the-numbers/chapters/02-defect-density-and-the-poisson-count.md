---
book: defect-maps-by-the-numbers
chapterSlug: defect-density-and-the-poisson-count
order: 2
title: "Defect density and the Poisson count"
description: "Turning defect counts into a density per area, the Poisson model for counts on parts, comparing the counts it predicts with those found, and why defects per part misleads across part sizes."
draft: false
---

The simplest useful number about defects on a surface is how many there are per unit of area: the **defect density**. It allows parts of different sizes to be compared, it scales directly to a new part, and, combined with one assumption about how defects fall, it predicts how many parts will be free of defects. That assumption, that defects fall independently and at random, is the Poisson model, and comparing what it predicts with what is actually found is the first and most informative test in this book.

This chapter calculates Plant E's defect density, sets out the Poisson model, compares its predictions with the counts on the 400 mapped doors and measures the first-pass yield. Its error is a comparison of two door lines by defects per door, which made the worse line look better.

## Defect density

Defect density is the number of defects divided by the area inspected. For the 400 doors, each with an outer face of 0.96 m², the area inspected was 384 m² and the defects numbered 220, so the density is 220 ÷ 384 = **0.573 defects per m²**. The mean number per door is 0.573 × 0.96 = **0.55**, the same as 220 ÷ 400.

A density is an estimate and has its own uncertainty. If the defects arose independently, the count of 220 would have a standard deviation of about √220 = 14.8, and an approximate 95% interval for the density would run from (220 − 1.96 × 14.8) ÷ 384 to (220 + 1.96 × 14.8) ÷ 384, that is from **0.497 to 0.649 per m²**. Chapter 4 shows that the defects were not independent, so the true uncertainty is wider; the interval here is the least it could be.

### A density depends on the inspection

A defect density counts defects that were found, not defects that exist. It depends on what the inspection defines as a defect, the lighting and viewing distance, the time allowed per part and the inspector. Plant E's inspectors view each door under a daylight lamp at about 1 m, as the customer's appearance standard requires, and record any speck, crater or blemish visible at that distance. A defect too small to see at 1 m does not count, even though a closer look would find it. Two lines inspected under different conditions cannot be compared by density, and a change in inspection, a brighter lamp or a new inspector, can change the density without any change in the process. Plant E fixed its inspection conditions before mapping began and kept them fixed throughout the study, and Chapter 10 returns to inspection as a measurement with its own chance of missing a defect.

### Density by zone and by type

A single density for the whole door hides the concentration found in Chapter 1. The top 200 mm band held 82 defects on 400 × 0.16 = 64 m², a density of 1.28 per m², while the rest of the door held 138 on 320 m², 0.431 per m². Density by defect type is equally useful: Plant E's 220 defects included 134 dust and dirt inclusions, a density of 0.349 per m² for that type alone. Densities by zone and type are the building blocks of everything later, and they can be added: the total density is the sum of the densities of all types.

## The Poisson model

Suppose defects fall on a surface independently of each other and with the same chance per unit area everywhere. Then the number that falls on any area A follows the **Poisson distribution** with mean m = λ A, where λ is the density. The probability of exactly k defects is e^(−m) m^k ÷ k!, and in particular the probability of none is e^(−m).

```figure
type: formula
title: The Poisson model for defects on a part
formula: m = λ A     P(k defects) = e^(−m) m^k ÷ k!     P(no defects) = e^(−m)     variance = mean = m
caption: The model needs two assumptions: defects arrive independently of each other, and the chance per unit area is the same everywhere on the part. It is the reference against which clustering and unevenness are measured.
- λ | defect density, defects per m²
- A | area of the part inspected, m²
- m | mean defects per part
step: Plant E's doors: m = 0.573 × 0.96 = 0.55 defects per door
step: Predicted share with no defects: e^(−0.55) = 0.577, so 42.3% would need rework
```

The Poisson model has an important property: its variance equals its mean. Counts that scatter more than that are **overdispersed**, which happens when defects come in groups or when some parts are more exposed than others. Counts that scatter less are **underdispersed**, which happens when defects repel each other or are spread more evenly than chance. The ratio of variance to mean, the **index of dispersion**, is therefore a simple first check of the model.

### Where the model comes from

The Poisson model is not an arbitrary choice. Divide a door's face into a very large number of tiny patches, each with a very small and equal chance of receiving a defect, independently of every other patch. The number of patches that receive one then follows a binomial distribution with a huge number of trials and a tiny chance in each, and as the patches shrink that binomial becomes the Poisson distribution with the same mean. This is sometimes called the law of rare events, and it explains why the Poisson model fits so many counts in manufacturing: dust specks on panels, flaws in lengths of wire, breakdowns of a machine over a shift, all arise from many small, independent opportunities.

It also explains when the model fails. If the chance is not the same for every patch, because some regions or some parts are more exposed, or if the patches are not independent, because one defect makes others nearby more likely, the derivation breaks down and so does the model. Departures from the Poisson model are therefore not just a nuisance for the statistics; they are evidence about the physics of the process. A clustered pattern says that something links defects together; an uneven one says that exposure differs from place to place. The rest of this book is largely about reading those departures.

## What the doors actually showed

The model predicts that 42.3% of doors should have at least one defect. In fact 104 of the 400 doors, 26%, had any. The model is badly wrong, and the way it is wrong is informative. The full distribution of counts per door shows where.

```figure
type: compare
title: Defects per door: found against the Poisson prediction
rowhead: Defects on the door
cols: Doors found | Predicted by Poisson, mean 0.55
caption: This is an illustration. The 400 mapped doors. Far more doors are clean than the Poisson model predicts, and far more have several defects. The defects are concentrated on fewer doors than random scatter would give, which is the signature of clustering between doors.
- 0 | 296 | 230.8
- 1 | 50 | 126.9
- 2 | 24 | 34.9
- 3 | 14 | 6.4
- 4 | 8 | 0.9
- * 5 or more | 12 | 0.1
```

The Poisson model predicts almost no doors with five or more defects; there were twelve. It predicts 127 doors with exactly one defect; there were 50. The counts per door have a variance of 1.45 against a mean of 0.55, an index of dispersion of 2.64. The defects are strongly overdispersed.

Two kinds of cause produce that pattern. Either something makes defects arrive together, so that a door that gets one tends to get several, or some doors are more exposed than others, for instance doors on particular hooks, at particular conveyor positions or coated at particular times. The composite map has already suggested the second: doors under heavily coated hooks receive flakes, doors under clean hooks do not. Chapter 4 tests the overdispersion formally, and Chapter 7 shows how to predict yield when it is present.

### A quick test of the index of dispersion

How far from 1 must the index of dispersion be before it means something? For counts on n parts that really are Poisson, the quantity (n − 1) × variance ÷ mean follows approximately a chi-square distribution with n − 1 degrees of freedom, whose mean is n − 1 and whose standard deviation is √(2(n − 1)). For the 400 doors, (n − 1) × 2.64 = 1,053 against an expected 399 with a standard deviation of 28.2: the excess is about 23 standard deviations. No amount of chance explains that. With a few dozen parts the test is much less sensitive, and an index of 1.3 or 1.5 may be within chance; with hundreds, even a modest excess is real.

## First-pass yield

The Poisson model was meant to predict the share of clean doors, which is the **first-pass yield**. The [yield and first-pass yield tool](/tools/yield-check/) calculates, from the units started, the good units at the end and the units good first time without rework, the final yield, the first-pass yield, the units lost and the units reworked. It also checks that the counts are consistent and warns when the rework burden is high.

Of the 400 doors, 296 were good first time. Of the 104 reworked, 96 passed after rework and 8 were scrapped, mostly because a second coat over a sanded patch failed again or the door was damaged in handling. Entered into the tool, that gives a **first-pass yield of 74%**, a final yield of 98%, 8 doors lost and 96 reworked, with a warning that 24% of starts needed rework.

```figure
type: stats
title: Yield on the 400 mapped doors
caption: This is an illustration. From the yield and first-pass yield tool. The final yield looks healthy because rework recovers most doors; the first-pass yield shows the cost the line carries to achieve it.
- 74% | first-pass yield, 296 of 400
- 98% | final yield, 392 of 400
- 96 | doors reworked
- 8 | doors scrapped
```

The final yield of 98% is the number that management had been watching, and it had hardly moved after the line was relocated. The first-pass yield had fallen from about 90% to 74%. A final yield measures how good the plant is at recovering from defects, and a first-pass yield measures how good it is at not making them; only the second responds to the causes this book is concerned with.

## The error: defects per door across door sizes

During the same two weeks, Plant E also coated smaller doors for a different enclosure range, 600 by 800 mm with an outer face of 0.48 m², on a separate set of hooks. A weekly report listed defects per door for the two ranges: 0.55 for the large doors and 0.30 for the small ones. The production manager concluded that the small-door hooks were in much better condition and proposed moving their cleaning schedule to the large-door hooks.

The engineer converted both to densities. The small doors had 0.30 ÷ 0.48 = **0.625 defects per m²**, slightly more than the large doors' 0.573. Per square metre of coated surface, the small-door line was no cleaner at all; its doors simply had half the area on which defects could fall. Defects per part is a fair comparison only between parts of the same area. Across sizes, density is the comparison to make, and the expected count per part follows from it.

```figure
type: compare
title: The two door ranges compared two ways
rowhead: Door range
cols: Face area | Defects per door | Defects per m²
caption: This is an illustration. Per door, the small range looks almost twice as good. Per square metre it is slightly worse. The density is the property of the process; the count per door also depends on the part.
- Large, 800 × 1,200 mm | 0.96 m² | 0.55 | 0.573
- * Small, 600 × 800 mm | 0.48 m² | 0.30 | 0.625
```

The cleaning schedule was left alone, and the weekly report was changed to show defects per square metre for every door range. The same mistake is common wherever parts of different sizes share a quality report: castings of different weights compared by defects per casting, printed boards of different sizes compared by defects per board, rolls of different lengths compared by faults per roll. In each case the fair unit is per area, per length or per volume, and per part only when the parts are the same.

### When density is not the right unit either

Density assumes that defects arise in proportion to area. Some do not. Defects that start at edges, such as runs from hole edges, scale with edge length; defects that start at features, such as porosity at bosses, scale with the number of features. For such defects the fair comparison is per metre of edge or per feature. Plant E's craters and dust behave like area defects; the thin-film defects, which occurred mainly along folded edges, were better compared per metre of fold.

## How this applies to a small Australian business

Report defects as densities, per square metre or per metre, whenever parts differ in size, and convert to expected counts per part only for a particular part. Check the spread of counts per part against the Poisson model: if far more parts are clean and far more have several defects than the model predicts, defects are arriving in groups or some parts are more exposed than others, and that is a lead to follow. Watch first-pass yield, not only final yield, since final yield hides the cost of rework.

## Exercise: a new panel size

Plant E is quoting a new enclosure with a door face of 600 by 900 mm. (a) At the current density of 0.573 defects per m², what is the mean number of defects per door? (b) What first-pass yield would the Poisson model predict? (c) Would you expect the real first-pass yield to be higher or lower than that, and why?

**Worked answer.** (a) The area is 0.6 × 0.9 = 0.54 m², so m = 0.573 × 0.54 = **0.309 defects per door**. (b) The Poisson model predicts a first-pass yield of e^(−0.309) = **0.734, or 73%**. (c) **Higher**. On the large doors the Poisson model predicted 58% clean against 74% found, because defects cluster on some doors and leave others clean. The same clustering would make the real first-pass yield on the new door better than 73%. Chapter 7 shows how to make that prediction properly with a model that allows for clustering.
