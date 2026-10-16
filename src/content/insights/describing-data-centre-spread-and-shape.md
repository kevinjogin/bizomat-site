---
title: "Describing data: centre, spread and shape before drawing conclusions"
description: "How to summarise business data with means, medians, percentiles, ranges and standard deviations, read its shape with histograms and box plots, and avoid averages that hide what matters."
publishDate: 2026-10-16
category: "Ideas"
tags:
  - validation
  - operations
  - quality
author: "KEVOS"
featured: false
draft: false
---

Most business data is summarised with a single number, usually an average. Average job duration, average order value, average delivery time, average defect rate. Averages are useful, but on their own they often mislead. An average delivery time of two days can hide the fact that most deliveries take one day and a stubborn minority take a week. An average job duration can be pulled up by a few very long jobs, so that most jobs take noticeably less time than the average suggests. Two processes with the same average can differ completely in reliability.

Describing data properly means looking at three things: its **centre**, the typical value; its **spread**, how much values vary; and its **shape**, how values are distributed, whether symmetrically, with a long tail in one direction or in two separate clusters. A few well-chosen numbers and a simple chart capture all three. Doing this before any further analysis, before comparing groups, testing hypotheses or building forecasts, prevents many errors and often answers the question directly.

This article explains measures of centre, spread and position, how to read the shape of data with histograms, box plots and run charts, why stratifying data by group matters, how to describe variation in operations and quality and how to present descriptive results clearly, with a worked example. It is part of a series on research and evidence for business decisions.

## Measures of centre

### Mean

The **mean** is the sum of values divided by their number, what most people call the average. It uses every value, which makes it sensitive to extreme values: a single very large order can noticeably raise the mean order value. The mean suits data that is roughly symmetrical without extreme outliers, and it is essential when totals matter, because the mean multiplied by the count gives the total.

### Median

The **median** is the middle value when data is sorted, so half the values lie below it and half above. It is not affected by how extreme the largest or smallest values are, which makes it a better description of the typical case for skewed data such as durations, costs, incomes and property prices.

### Mode

The **mode** is the most common value. It is mainly useful for categories, such as the most common defect type, and for discrete values, such as the most common order quantity.

### When mean and median differ

When the mean is well above the median, the data has a long tail of high values; when it is below, a tail of low values. The size of the gap is itself informative. Reporting both is a simple, powerful habit.

## Measures of spread

### Range

The **range** is the difference between the largest and smallest values. It is easy to understand but depends entirely on the two most extreme values.

### Interquartile range

The **quartiles** divide sorted data into four equal parts. The **interquartile range**, the difference between the 25th and 75th percentiles, describes the spread of the middle half of the data and is not affected by extremes.

### Standard deviation

The **standard deviation** measures the typical distance of values from the mean. It is widely used in statistics and quality, and for roughly symmetrical, bell-shaped data, about two-thirds of values fall within one standard deviation of the mean. For skewed data, it is less intuitive.

### Coefficient of variation

The **coefficient of variation** is the standard deviation divided by the mean. It expresses variation relative to size, which helps compare the consistency of quantities measured on different scales, such as the variability of small and large jobs.

## Percentiles: describing service levels

**Percentiles** describe positions in the data: the 90th percentile is the value below which 90% of observations fall. Percentiles are particularly useful for service and delivery commitments. Customers experience the long waits, not the average, so promising a delivery time that the 90th or 95th percentile achieves is more honest than promising the average. The [how confident is that finish date](/insights/how-confident-is-that-finish-date/) article applies similar thinking to project schedules.

## Shape: reading the distribution

### Histograms

A **histogram** groups values into ranges, or bins, and shows how many fall in each. It reveals at a glance whether data is symmetrical, skewed or clustered, where most values lie and whether there are gaps or outliers. Choosing sensible bin widths matters: too few bins hide detail, too many create noise.

### Common shapes

- **Symmetrical, bell-shaped**: values cluster around the centre, with similar tails on both sides, as often seen in machined dimensions from a stable process.
- **Right-skewed**: most values are small to moderate, with a long tail of large values, typical of durations, repair costs, order sizes and waiting times.
- **Left-skewed**: a long tail of small values, less common in business data.
- **Bimodal**: two peaks, often signalling two different processes, products, customer types or shifts mixed together.
- **Truncated**: a sharp cut-off, sometimes revealing that values beyond a limit were sorted out, reworked or recorded differently.

### Box plots

A **box plot** shows the median, quartiles and extremes in a compact form, often with individual outliers marked. Box plots are especially useful for comparing several groups side by side, such as delivery times by depot or cycle times by shift.

## Change over time: run charts

Summary statistics describe data as if all values came from one unchanging process. Plotting values in time order, as a **run chart**, shows trends, shifts, cycles and unusual events that summaries hide. A process whose average looks acceptable may be steadily deteriorating. Statistical process control adds calculated limits to such charts to distinguish routine variation from signals that deserve investigation, as the [statistical process control on the shop floor](/insights/statistical-process-control-on-the-shop-floor/) article explains.

## Stratify before summarising

A summary of all data together can hide important differences between groups. Average repair time across all technicians, sites, products and job types mixes very different situations. **Stratifying**, describing each group separately, often reveals that the overall average describes nobody: one product or site is responsible for most long jobs, or a bimodal distribution is really two clean distributions from two different job types. It also protects against misleading comparisons when groups have different mixes.

## Describing categories

For categorical data, descriptions use counts and percentages, often sorted from most to least common, as in a Pareto chart. Showing counts alongside percentages, and the total number of observations, keeps small groups in perspective.

## Weighted averages

When combining averages from groups of different sizes, a simple average of the group averages misleads. If one depot completes 900 deliveries a month with an average of 1.2 days and another completes 100 with an average of 3.0 days, the simple average of the two is 2.1 days, but the true average across all deliveries is (900 × 1.2 + 100 × 3.0) ÷ 1,000 = 1.38 days. A **weighted average** weights each group's average by its size. The same issue arises when averaging prices, margins, scores and rates across products, customers or periods.

## Averaging rates and ratios

Rates such as speeds, productivity per hour or cost per unit need special care. Averaging the cost per unit of several jobs gives each job equal weight regardless of size; dividing total cost by total units gives the true average cost per unit. The two can differ substantially. As a rule, when the question is about the whole, calculate totals first and then divide, rather than averaging individual ratios.

## Describing small samples

With small samples, summary statistics are unstable: one more observation can move the mean, the standard deviation and the percentiles noticeably. For a dozen values or fewer, show the individual values, for example in a dot plot or a simple list, alongside any summary. Readers can then see the data themselves rather than relying on statistics that imply more certainty than the sample supports.

## Summary tables that work

A good descriptive table shows, for each group, the number of observations, a measure of centre, a measure of spread and, where relevant, a percentile such as the 90th. Consistent column order, clear units, sensible rounding and a note on the period and any exclusions make tables easy to read and compare. Sorting groups by the measure of interest, rather than alphabetically, helps the important differences stand out.

## Descriptive statistics on dashboards

Dashboards often show single numbers, such as averages and totals, which invite the misreadings described above. Adding the median, a percentile, a small histogram or a trend line beside each key number gives viewers much more context in little extra space. A dashboard that shows only averages can make a deteriorating tail of poor service invisible until customers complain.

## Precision in reporting

Descriptive statistics should be reported with sensible precision. An average job duration of 3.4271 hours implies a precision the data does not have; 3.4 hours is enough. State the number of observations, the period covered and any exclusions, so readers know what the numbers describe.

## Describing variation in operations and quality

Variation is the enemy of predictable operations. A process with consistent cycle times is easier to schedule than one with the same average but wide variation; a supplier with reliable delivery times is more valuable than one that is sometimes faster but often late. Describing spread, not just averages, focuses improvement on reducing variation, which often brings larger benefits than shifting the average. The [turning business data into decisions](/insights/turning-business-data-into-decisions/) article shows how such descriptions feed practical decisions.

Describing data is not a preliminary chore before the real analysis; for many everyday business questions, it is the analysis.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A service business records the durations of twelve recent repair jobs: 1.5, 2.0, 2.2, 2.5, 2.8, 3.0, 3.2, 3.5, 4.0, 5.0, 9.0 and 12.0 hours. The scheduling system uses the mean, about 4.2 hours, to book technicians, and most days end with technicians idle or rushing.

Describing the data properly tells a different story. The median is about 3.1 hours: half the jobs take that long or less. The interquartile range runs from about 2.4 to 4.3 hours, so the middle half of jobs fall in a fairly narrow band. Two jobs, at 9 and 12 hours, pull the mean up; without them, the mean of the remaining ten jobs is about 3.0 hours. A histogram shows a right-skewed distribution with a long tail.

Stratifying by job type reveals that both long jobs involved a particular model of equipment requiring parts to be ordered mid-job. The business changes its scheduling: standard jobs are booked at about 3.5 hours, near the 75th percentile, and jobs on the problem model are flagged for a parts check before booking, with longer allowances. Technician utilisation improves and fewer customers are kept waiting.

## How this applies to a small Australian business

- **Report the median alongside the mean**, especially for durations and costs.
- **Describe spread** with interquartile ranges or standard deviations.
- **Use percentiles for service promises**, not averages.
- **Draw a histogram or box plot** before any further analysis or comparison.
- **Plot data over time** to see trends, shifts and seasonal patterns.
- **Stratify by product, site, shift or customer type.**
- **Weight averages by group size**, or divide totals, when combining groups.
- **Show individual values** when samples are small.
- **Report counts, periods and exclusions** with every summary.

## Common mistakes

- **Relying on the mean alone** for skewed data.
- **Promising average performance** to customers.
- **Summarising mixed groups** as if they were one process.
- **Ignoring time order** and missing trends.
- **Reporting excessive decimal places.**
- **Averaging averages** across groups of different sizes.
- **Dashboards that show only single averages.**
- **Hiding small sample sizes** behind percentages.

## Frequently asked questions

**Which is better, the mean or the median?** Neither is always better. The median describes the typical case in skewed data; the mean is needed for totals and suits symmetrical data. Reporting both is often best.

**What does a bimodal histogram usually mean?** That two different processes, products, groups or conditions are mixed in the data. Separating them usually makes each clearer.

**How many data points are needed for a useful histogram?** At least several dozen give a reasonable picture of shape; with fewer, a dot plot showing each value is more honest.

**Why use percentiles for service levels?** Because customers notice the long waits. A percentile tells how often a promise will be met.

**How should averages from different groups be combined?** Weight each group's average by its size, or go back to the totals and divide. A simple average of averages is usually wrong when groups differ in size.

**What is the difference between standard deviation and standard error?** The standard deviation describes how much individual values vary; the standard error describes how precisely the mean has been estimated, which improves as the sample grows.

## Questions to ask

- Which of our key figures are reported only as averages?
- Do we know the spread and shape of our delivery times, job durations and costs?
- What percentile do our customer promises correspond to?
- Which groups should we separate before summarising?
- Are any of our combined figures simple averages of averages?
- Do our dashboards show spread and trend as well as single numbers?
- Do we plot our key measures over time?

## Bringing it together

Describing data well means looking at its centre, spread and shape. Means, medians and modes describe typical values; ranges, interquartile ranges, standard deviations and percentiles describe variation; histograms, box plots and run charts reveal shape and change over time. Stratifying by group, reporting with sensible precision and focusing on variation as well as averages lead to better schedules, more honest promises and more effective improvement.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
