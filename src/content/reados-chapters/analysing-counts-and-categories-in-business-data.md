---
title: "Analysing counts and categories in business data: cross-tabulations, proportions and when a difference is real"
description: "Defect types, complaint reasons, survey answers and segments are categorical data. How to tabulate them, compare proportions fairly, test whether differences are real and avoid traps."
publishDate: 2026-10-09
category: "Operations"
tags:
  - quality
  - customers
  - experimentation
author: "KEVOS®"
featured: false
draft: false
---

A great deal of business data is not measured on a scale but counted in categories. Each defect is classified by type; each complaint has a reason; each customer belongs to a segment, region or industry; each survey response is "very satisfied", "satisfied" or worse; each job is won or lost; each delivery is on time or late. Managers make important decisions from these counts: which supplier to drop, which product to redesign, which region needs attention, whether a new process has reduced complaints.

Counts and percentages look simple, which is exactly why they mislead so often. A supplier's defect rate may look worse only because it supplies more difficult parts. A rise in complaints may come from a change in how complaints are recorded. A difference between two percentages may be no more than chance in a small sample. Survey averages may hide that customers are split between delight and anger.

This article explains how to organise and analyse categorical data: designing good categories, building frequency tables and cross-tabulations, choosing the right percentages, estimating how precise a proportion is, testing whether a difference between groups is likely to be real, recognising when a third factor explains a difference, and handling survey ratings. It is general information for managers, quality staff and analysts; for high-stakes conclusions, involve someone with statistical training.

## Kinds of categorical data

- **Nominal categories** have no natural order: defect type, complaint reason, region, industry.
- **Ordinal categories** have an order but not equal spacing: satisfaction ratings, severity levels, priority.
- **Binary outcomes** have two categories: pass or fail, won or lost, on time or late.

The kind of data determines which summaries make sense. Averaging nominal codes is meaningless; averaging ordinal ratings is common but needs care.

## Design categories well

Analysis is only as good as the categories recorded. Good category schemes are:

- **Mutually exclusive**: each item fits one category, or rules say how to choose.
- **Exhaustive**: every item fits somewhere, with an "other" category for genuine exceptions.
- **Clearly defined**: each category has a written definition with examples, so different people classify the same item the same way.
- **At the right level of detail**: detailed enough to guide action, not so detailed that each category has few items.
- **Stable**: changed rarely and deliberately, with history mapped when they change.

If the "other" category holds more than a small share of items, read through them and create better categories. If two people classify the same items differently, refine the definitions and train staff. The [data readiness is a business habit](/reados/collections/ai-in-business-practice/data-readiness-is-a-business-habit/) article explains why agreeing definitions and conventions early matters.

## Frequency tables and Pareto ordering

The starting point is a **frequency table**: each category, its count and its percentage of the total. Sorting categories from most to least frequent, often shown as a Pareto chart, highlights where most problems lie. The [seven basic quality tools](/reados/collections/manufacturing-quality/the-seven-basic-quality-tools/) article explains Pareto charts and check sheets in more detail.

Always show the **count alongside the percentage**. "40% of complaints" means something very different when the total is 10 complaints rather than 1,000.

## Cross-tabulations

A **cross-tabulation**, also called a contingency table, counts items by two categories at once, such as complaint reason by product line or defect type by shift. It reveals relationships that single tables hide.

| Defect type | Day shift | Night shift | Total |
|---|---|---|---|
| Dimensional | 42 | 38 | 80 |
| Surface finish | 15 | 45 | 60 |
| Assembly | 23 | 17 | 40 |
| Total | 80 | 100 | 180 |

### Choosing the right percentages

The same table can be read with different percentages, and each answers a different question:

- **Column percentages**: of night-shift defects, what share are surface finish? 45 of 100, or 45%, compared with 15 of 80, about 19%, on day shift.
- **Row percentages**: of surface finish defects, what share occur at night? 45 of 60, or 75%.
- **Rates against output**: if night shift produces far more parts than day shift, raw defect counts mislead; divide by the number of parts produced on each shift.

```figure
type: bars
title: Surface finish defects as a share of each shift's defects
unit: %
max: 50
caption: Column percentages: 15 of 80 on day shift, 45 of 100 at night. Read by row, 75% of surface finish defects occur at night.
- Day shift | 19
- *Night shift | 45
```

Decide which question matters before calculating, and label percentages clearly so readers know what the base is.

## Absolute and relative differences

Differences between proportions can be described in two ways, and confusing them misleads readers. If one supplier's defect rate is 3% and another's is 5%, the **absolute difference** is two **percentage points**, while the **relative difference** is that the second rate is about 67% higher than the first. Both are correct, but they create very different impressions. Saying that defects "increased by 2%" is ambiguous: it could mean from 3% to 5% or from 3% to 3.06%.

Good practice is to report the two rates themselves, state differences in percentage points, and add relative changes only where they help, clearly labelled. For rare events, such as safety incidents or field failures, relative changes based on a handful of events can look dramatic while the absolute numbers remain small, so always show the counts.

## How precise a proportion is

A proportion calculated from a sample, such as 5% of 800 parts inspected being defective, is an estimate. With a different sample, it would differ somewhat. A common approximation for the **margin of error** of a proportion at about 95% confidence is:

1.96 × square root of (p × (1 − p) ÷ n)

where p is the proportion and n the number of items. For 5% defective in 800 parts, the margin is about 1.96 × √(0.05 × 0.95 ÷ 800), roughly 1.5 percentage points, so the true rate plausibly lies between about 3.5% and 6.5%. For 5% of 80 parts, the margin is about 4.8 percentage points, making the estimate far less precise. This approximation is unreliable when counts of the outcome are very small; statistical software provides better methods in those cases.

The practical lesson is that small samples produce wide uncertainty. The [learning from small samples](/reados/collections/marketing-brands-and-customer-experience/learning-from-small-samples/) article discusses how to reason carefully when data is limited.

## Telling whether a difference between groups is real

Suppose one supplier's defect rate is 3% and another's is 5%. Is the difference real or could it be chance? A widely used approach for counts is the **chi-square test of independence**, developed by Karl Pearson around 1900. It compares the observed counts in a table with the counts that would be expected if there were no relationship between the categories, and calculates how surprising the differences are.

The test produces a **p-value**: the probability of seeing differences at least this large if there were no real relationship. By convention, values below 0.05 are often treated as evidence of a real difference, although the threshold is a convention, not a law, and business judgement about consequences matters.

Some cautions:

- **Small expected counts** make the chi-square test unreliable; alternatives such as Fisher's exact test suit small tables.
- **Statistical significance is not importance.** With very large samples, tiny and commercially irrelevant differences can be significant.
- **Overlapping margins of error do not prove there is no difference**, and comparing margins by eye is a weak substitute for a proper test.
- **Testing many comparisons** increases the chance of false alarms; a difference found after slicing data twenty ways deserves confirmation with new data.

### Comparing several groups

The same test extends to tables with more than two groups or categories, such as complaint reasons across four branches. A significant overall result says only that the pattern is unlikely to be chance somewhere in the table. To see where, compare each cell's observed count with its expected count; statistical software reports standardised differences, often called residuals, that highlight the cells driving the result. Cells with large differences are the places to investigate.

## When a third factor explains the difference

Comparisons between groups can be distorted by a third factor that differs between them, sometimes called a **confounding** factor. In extreme cases, a pattern seen in combined data reverses within every subgroup, a phenomenon known as **Simpson's paradox**. A well-known example involved graduate admissions at the University of California, Berkeley, in 1973: overall figures suggested women were admitted at a lower rate than men, but within most departments the difference disappeared or reversed, because women had applied more often to departments with low admission rates for everyone.

In business, typical confounders include product mix, customer mix, region, season and job size. Before concluding that a supplier, shift, salesperson or branch performs worse, check whether they handle different kinds of work.

## Tracking proportions over time

Many categorical measures are tracked monthly: the share of deliveries on time, the proportion of jobs won or the defect rate. Month-to-month movements are often just noise, especially when monthly counts are small. Control charts for proportions, known as p charts, show limits within which a stable process would normally vary, so managers react to genuine changes rather than to every movement. When a rate changes suddenly, also check whether something changed in how items are counted or classified, such as a new inspection method, a new complaint form or a change in definitions, before concluding that performance itself changed.

## Presenting categorical data

Clear presentation prevents misreading:

- **Use sorted bar charts** rather than pie charts for comparing more than a few categories.
- **Show counts and bases** in labels or notes.
- **Use consistent colours** for the same category across charts.
- **Be careful with stacked bars**, which make it hard to compare middle segments; side-by-side bars or small separate charts are often clearer.
- **Start rate axes at zero** where differences could otherwise look exaggerated.
- **Group rare categories** into "other" for display, while keeping the detail available.

## Survey ratings

Satisfaction and agreement ratings are ordinal. Common practices and cautions:

- **Report the distribution**, not just the average: a mean of 3.5 out of 5 may reflect most people at 3 or 4, or a split between 1s and 5s, which call for different responses.
- **Report the share in top categories**, such as the percentage "satisfied" or "very satisfied", alongside the base.
- **Watch response rates and who responds**; dissatisfied or delighted customers may be more likely to answer.
- **Keep wording and scales consistent** over time, or comparisons break.

## Common mistakes

- **Percentages without counts or bases.**
- **Comparing raw counts** between groups of different sizes.
- **Ignoring uncertainty** in small samples.
- **Concluding a difference is real** without testing or confirmation.
- **Overlooking confounding factors** such as product mix.
- **Changing category definitions** without adjusting history.
- **Averaging survey ratings** and ignoring their distribution.
- **Letting "other" grow** until it hides the main causes.

## A worked example

This is an illustrative example. A manufacturer buys machined housings from two suppliers. Over a quarter, inspection finds 30 defective parts out of 1,000 from Supplier A, a 3.0% defect rate, and 40 out of 800 from Supplier B, a 5.0% rate. The purchasing manager proposes moving more work to Supplier A.

**Testing the difference.** Combined, 70 of 1,800 parts were defective, about 3.9%. If the suppliers were equally good, Supplier A would be expected to have about 38.9 defective parts and Supplier B about 31.1. A chi-square test on the two-by-two table of supplier and pass or fail gives a value of about 4.8, corresponding to a p-value of about 0.03. On conventional grounds, the difference is unlikely to be pure chance.

**Checking for a confounder.** The quality engineer then splits the data by part type. Supplier B makes most of the complex housings, which are harder to machine:

| Part type | Supplier A | Supplier B |
|---|---|---|
| Complex housings | 14 defective of 200 (7.0%) | 34 defective of 500 (6.8%) |
| Simple housings | 16 defective of 800 (2.0%) | 6 defective of 300 (2.0%) |
| All housings | 30 of 1,000 (3.0%) | 40 of 800 (5.0%) |

```figure
type: compare
title: Defect rates by supplier and part type
cols: Supplier A | Supplier B
caption: Supplier B makes most of the complex housings; within each part type the suppliers perform almost identically.
- Complex housings | 7.0% (14 of 200) | 6.8% (34 of 500)
- Simple housings | 2.0% (16 of 800) | 2.0% (6 of 300)
- *All housings | 3.0% (30 of 1,000) | 5.0% (40 of 800)
```

Within each part type, the suppliers perform almost identically. The overall difference arises because Supplier B makes more of the difficult parts.

**Decision.** Instead of moving work, the business focuses on the complex housings, where both suppliers have defect rates around 7%. A review of the drawing finds a tolerance that is tighter than the function requires, and relaxing it, after engineering review, reduces defects for both suppliers. In this illustration, the complex housing defect rate falls from about 7% to about 3% over the following quarter, a far larger improvement than switching suppliers could have delivered, and the business keeps two qualified sources.

## Applying this in an Australian business

- **Define categories clearly**, with written definitions and examples.
- **Show counts and bases** with every percentage.
- **Use rates against output** when groups differ in size.
- **Estimate uncertainty** for proportions from samples.
- **Test differences** before acting, and confirm surprising findings.
- **Look for confounding factors** such as product, customer or job mix.
- **Report survey distributions**, not only averages.
- **Involve statistical expertise** for high-stakes decisions.

## Questions worth considering

- Which of our decisions rely on comparing percentages between groups?
- How large are the samples behind our key defect and complaint rates?
- Could product or customer mix explain differences we have attributed to people or suppliers?
- How much of our data falls into "other" categories?
- Do we report survey results as averages only?

## Bringing it together

Counts and categories underpin many business decisions, from supplier selection to complaint handling and customer surveys. Design clear categories, tabulate counts with their bases, use cross-tabulations and the right percentages, recognise the uncertainty in proportions from samples, test whether differences are likely to be real, and check for confounding factors before drawing conclusions. Handled carefully, categorical data reveals where to act; handled carelessly, it can point confidently in the wrong direction.

---

*Source: KEVOS® editorial notes, drawing on general statistical and quality management practice. The worked example is illustrative, and its calculations are rounded. This article is general information.*
