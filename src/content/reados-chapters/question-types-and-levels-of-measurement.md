---
title: "Question types and levels of measurement: choosing answers that support the analysis you need"
description: "How nominal, ordinal, interval and ratio data differ, which statistics each supports, and how rating, ranking, multiple-response, constant-sum and open questions shape what results can show."
publishDate: 2026-10-16
category: "Ideas"
tags:
  - validation
  - customers
  - quality
author: "BIZOMAT"
featured: false
draft: false
---

The way a question is answered determines what can be done with the answers. A question asking customers to choose their industry from a list produces categories that can be counted but not averaged. A question asking them to rate satisfaction from "very dissatisfied" to "very satisfied" produces ordered categories whose average is debatable. A question asking how many orders they placed last year produces numbers that can be added, averaged and compared directly. A question asking them to rank five service features produces an order of preference but says nothing about how much more one feature matters than another. Choosing the wrong type of answer can make the analysis a business needs impossible, no matter how carefully the rest of the survey is designed.

The same issue arises far beyond surveys. Quality inspection records may be pass or fail, a defect category, a severity rating or a measured dimension. Maintenance logs may record a failure mode, a priority level, a temperature or a time. Each type of data supports different summaries, charts and tests. Understanding **levels of measurement**, the classification of data by what its numbers or categories mean, helps researchers and analysts choose questions and recording formats deliberately and avoid conclusions the data cannot support.

This article explains the four levels of measurement, the statistics appropriate to each, common question formats and their strengths and weaknesses, multi-item scales, the consequences of grouping numerical data into bands and how to choose formats that match the decisions ahead. It is part of a series on research and evidence for business decisions.

## The four levels of measurement

### Nominal

**Nominal** data consists of named categories with no natural order: industry, region, product type, defect category, payment method. Categories can be counted and compared as frequencies and percentages, and the most common category, the **mode**, can be reported. Averages are meaningless: there is no average industry. Numbers are sometimes used as codes for nominal categories, such as 1 for retail and 2 for manufacturing, but the numbers are only labels.

### Ordinal

**Ordinal** data has categories with a natural order but no guarantee that the steps between them are equal: satisfaction ratings, priority levels such as low, medium and high, rankings and grades. Ordinal data supports counts, percentages, the mode, the **median** and percentiles. The difference between "satisfied" and "very satisfied" may not equal the difference between "neutral" and "satisfied", so treating the categories as equally spaced numbers involves an assumption.

### Interval

**Interval** data has equal steps between values but no true zero: temperature in degrees Celsius and calendar dates are common examples. Differences are meaningful, so means and standard deviations can be calculated, but ratios are not: 20 °C is not twice as hot as 10 °C.

### Ratio

**Ratio** data has equal steps and a true zero: lengths, masses, times, counts, costs and revenues. All arithmetic is meaningful, including ratios: 20 orders is twice as many as 10, and a 4-hour job takes twice as long as a 2-hour job. Ratio data supports the widest range of analysis.

```figure
type: layers
title: The four levels of measurement
caption: The level decides which averages, charts and tests make sense.
- Nominal | named categories · the mode
- Ordinal | ordered, steps not equal · the median
- Interval | equal steps, no true zero · the mean
- *Ratio | equal steps and a true zero · ratios too
```

## Why the level matters

The level of measurement determines:

- **which averages make sense**: mode for nominal, median for ordinal, mean for interval and ratio;
- **which charts suit the data**: bar charts for categories, histograms for continuous measurements, ordered bar charts for ordinal scales;
- **which statistical tests apply**: tests for proportions and counts for categorical data, tests based on means for interval and ratio data; and
- **what comparisons are valid**: ratios only for ratio data.

The [analysing counts and categories in business data](/reados/collections/operational-data-records-and-controls/analysing-counts-and-categories-in-business-data/) article explains how to analyse nominal and ordinal data properly.

## Attribute and variable data in quality

Quality professionals use related terms. **Attribute data** records categories or counts, such as pass or fail, number of defects or defect type. **Variable data** records measurements on a continuous scale, such as diameter, weight or hardness. Variable data contains more information per observation, so smaller samples can detect changes, which is why measuring a dimension is generally more informative than recording whether it passed a gauge.

## Common question formats

### Single choice

Respondents choose one option from a list. Suitable for nominal or ordinal information when categories are mutually exclusive. Lists must be complete, with an "other" option where needed.

### Multiple response

Respondents select all options that apply, such as all the products they use. Results are usually reported as the percentage of respondents selecting each option, and these percentages do not add to 100%. Respondents tend to select fewer options in long lists, and options near the top are chosen more often.

### Rating scales

Respondents rate something on an ordered scale, such as satisfaction from 1 to 5 or agreement from "strongly disagree" to "strongly agree". Labelled points improve consistency. **Bipolar** scales run from negative to positive with a neutral midpoint; **unipolar** scales run from none to a lot, such as "not at all important" to "extremely important". Rating scales are easy to answer but suffer when everything is rated highly, making it hard to separate priorities.

### Ranking

Respondents order items from most to least preferred or important. Rankings force differentiation, but they become tiring beyond about five to seven items, and they show order without showing the distance between items.

### Constant sum

Respondents divide a fixed total, such as 100 points, among options to show relative importance. Constant-sum questions reveal both order and strength of preference, but they demand more effort and some respondents make arithmetic errors that need checking.

### Best-worst choices

Respondents see several small sets of options and choose the most and least important in each. Analysed across many sets, the choices produce a well-differentiated ranking of importance. The method is more complex to design and analyse but avoids the "everything is important" problem.

### Numeric open answers

Respondents enter a number, such as the count of employees or orders. Numeric answers produce ratio data, the most flexible type, but they depend on respondents knowing the number and may include typing errors and outliers.

### Open text

Respondents answer in their own words. Open answers capture reasons, suggestions and unexpected issues, but they must be coded into themes before they can be counted, which takes time.

### Grids and matrices

Several items rated on the same scale appear in a grid. Grids are compact but encourage **straight-lining**, giving every item the same answer, especially in long grids.

## Single items and multi-item scales

A single rating question measures a concept roughly. For important concepts, such as satisfaction or ease of use, combining several related items into a **scale**, for example by averaging or summing them, gives a more reliable measure because random noise in individual items partly cancels out. The items should measure the same underlying idea, which can be checked statistically by how consistently they move together. Single items remain useful for quick checks and tracking.

## Treating rating scales as numbers

Analysts often assign numbers to rating categories and calculate means. This is common and often useful, particularly for multi-item scales and for tracking changes, but it assumes equal spacing between categories. Reporting the full distribution, such as the percentage in each category or the share rating 4 or 5, alongside any mean avoids hiding important patterns, such as a polarised group with many 1s and 5s whose mean looks neutral. Single-number summaries such as net promoter scores, discussed in the [customer feedback and net promoter score](/reados/collections/marketing-brands-and-customer-experience/customer-feedback-and-net-promoter-score/) article, also discard detail and are best read alongside the distribution.

## Grouping numbers into bands

Numerical data is often collected or reported in bands, such as age groups or revenue ranges. Bands can make questions easier to answer, particularly for sensitive items like income, but they lose information. Exact values allow later grouping in any way; banded values cannot be ungrouped. Collect exact values where respondents can provide them comfortably, and choose bands carefully when they are necessary, ensuring they are mutually exclusive, cover the full range and align with categories used elsewhere, such as official statistics.

## Dates, times and durations

Dates and times are interval data in calendar form, but the durations between them are ratio data that can be added and averaged. Recording the start and finish times of jobs, rather than just a duration typed by hand, allows durations to be calculated accurately and checked, and allows analysis by time of day or day of week. Dates should be recorded in an unambiguous format, because 03/04 means March in some countries and April in others, and spreadsheets may convert text dates inconsistently.

## Missing values and "not applicable"

A blank answer can mean several things: the respondent did not know, chose not to answer, skipped the question by mistake, or the question did not apply. These are different and should be recorded differently where possible, for example with distinct codes for "don't know", "prefer not to say" and "not applicable". Treating them all as zero, or silently dropping them, distorts averages and percentages. Reports should state how many responses were missing for each question and how they were handled.

## Designing category lists

Category lists for nominal data, such as defect types, complaint reasons or industries, deserve care. A good list is complete enough that the "other" category stays small, specific enough that categories lead to action, short enough to choose from quickly and stable enough to compare over time. Where possible, align lists with established classifications, such as official industry classifications, so data can be compared with external sources. Reviewing the "other" category periodically shows when new categories are needed.

## Recording data in operations

The same choices apply to operational records. Recording the actual measurement rather than pass or fail, the actual downtime minutes rather than a "short" or "long" category, and a defined defect code rather than free text all make later analysis more powerful. Free-text comments remain valuable for context, but defined fields make counting and trending possible. The [the seven basic quality tools](/reados/collections/manufacturing-quality/the-seven-basic-quality-tools/) article shows how such data feeds Pareto charts, histograms and other tools.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A distributor asked 200 customers to rate the importance of six service features on a five-point scale. Every feature scored an average between 4.3 and 4.6: everything was "important", and the survey could not guide priorities.

For the next round, the distributor replaced the rating grid with a constant-sum question asking customers to divide 100 points among the six features according to their importance. Delivery reliability received an average of 31 points, accurate invoicing 22, stock availability 20, technical advice 12, online ordering 9 and packaging 6. The differences were now clear, and they matched what account managers heard in conversations. The company prioritised delivery reliability and invoicing accuracy.

```figure
type: bars
title: Dividing 100 points among six service features
unit: points
max: 35
caption: Rated one at a time, every feature averaged 4.3 to 4.6 out of 5; a constant-sum question showed clear priorities.
- *Delivery reliability | 31
- Accurate invoicing | 22
- Stock availability | 20
- Technical advice | 12
- Online ordering | 9
- Packaging | 6
```

The distributor also changed its complaint records. Instead of free-text notes alone, complaints were now coded by type from a defined list, with severity recorded on a three-level scale and the time to resolve recorded in hours. Within a quarter, the business could produce a Pareto chart of complaint types and track resolution times.

## How this applies to a small Australian business

- **Identify the level of measurement** of every question and record before collecting data.
- **Use medians and distributions** for ordinal data, not just means.
- **Collect exact numbers** where possible, and band them later if needed.
- **Use ranking, constant-sum or best-worst questions** when priorities matter.
- **Record measurements rather than pass or fail** where practical.
- **Distinguish missing, unknown and not applicable** in records and analysis.
- **Code free text into defined categories** for operational records.

## Common mistakes

- **Averaging nominal codes.**
- **Reporting only the mean** of rating scales.
- **Adding multiple-response percentages** and expecting 100%.
- **Collecting bands** when exact values were available.
- **Long grids** that invite straight-lining.
- **Treating blanks as zeros** or dropping them without saying so.
- **Recording ambiguous date formats** that spreadsheets misread.
- **Asking everything as an importance rating** and getting no differentiation.

## Frequently asked questions

**Can the mean of a satisfaction scale be reported?** It is common and can be useful for tracking, but report the distribution as well and remember the equal-spacing assumption.

**What is the difference between a Likert item and a Likert scale?** An item is a single agreement statement; a scale combines several related items into one score.

**Why is variable data better than attribute data in quality?** Each measurement carries more information than a pass or fail result, so changes can be detected with smaller samples.

**How many points should a rating scale have?** Five or seven labelled points suit most purposes. More points add little reliability and can confuse respondents.

**Should "other" categories allow a written answer?** Yes. A short text field beside "other" shows what the list is missing and is the main input for revising categories.

## Questions to ask

- Which level of measurement does each of our key questions and records produce?
- Do our reports use summaries that suit those levels?
- Where would ranking or constant-sum questions give clearer priorities?
- Are we recording measurements or only categories in our operations?
- How large is the "other" category in our coded lists, and is it time to revise them?
- Which free-text fields should become coded categories?

## Bringing it together

Levels of measurement, nominal, ordinal, interval and ratio, determine which summaries, charts and tests make sense. Question formats, from single and multiple choice to ratings, rankings, constant-sum, best-worst, numeric and open text, each produce different kinds of data with different strengths. Choosing formats deliberately, reporting distributions as well as averages, collecting exact values where possible and recording operational data in analysable forms make every survey and record more useful.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations.*
