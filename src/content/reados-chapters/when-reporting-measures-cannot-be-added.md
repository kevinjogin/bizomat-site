---
title: "When reporting measures cannot be added"
description: "Avoid misleading report totals by distinguishing additive measures, snapshots, ratios and distinct counts, and checking the population behind each result."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - quality
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

A reporting tool can calculate a total perfectly and still produce a number with no useful meaning. Adding monthly sales may be sensible, while adding month-end stock balances usually answers a different question from the one a reader expects. The arithmetic is easy; deciding whether the measure permits that arithmetic requires an understanding of the data.

**Additivity** describes whether a measure can be combined by summing it across a particular dimension, such as site, product or time. Some measures are additive across several dimensions, some only across selected dimensions, and some require a different calculation altogether.

This distinction matters when building dashboards, summary tables and analytical models. It also matters when a spreadsheet totals figures exported from another system. The safest starting point is to define what each recorded value represents, which population it covers and what a larger total is intended to mean.

## Establish the grain before discussing totals

The **grain** of a dataset is the meaning of one row. A row may describe one movement, one completed job, one inspection or one item balance at a particular instant. Measures inherit important properties from that grain.

A quantity attached to a transaction describes an event or movement. A quantity attached to a snapshot describes a state. They may use the same unit while requiring different aggregation rules.

This is an illustrative example. A stock movement table records receipts and issues in units. A stock snapshot table records units on hand at the end of each day. Both contain a column called quantity, but summing the first over a week gives net movement, while summing the second gives a total of daily observations.

Neither calculation automatically gives the closing stock balance. That requires an appropriate opening balance and movements, or the relevant closing snapshot. A descriptive column name alone cannot establish which operation is valid.

Write the grain in an ordinary sentence and test it against sample rows. If some rows are daily totals while others are individual events, the dataset has mixed grains and needs an explicit rule before further aggregation.

## Identify fully additive measures carefully

A measure is additive across a dimension when summing its contributions produces the intended combined result without overlap or incompatible units. Recorded labour minutes across distinct tasks can be additive when the tasks represent separate effort and their time conventions are consistent.

Additivity is conditional on the population. If the same task appears in two overlapping categories, adding category totals may count its effort twice. The measure itself has not changed, but the grouping no longer partitions the population into distinct contributions.

Units also constrain addition. Quantities of different products may all be labelled “units” while lacking a useful common interpretation. Ten bearings and ten complete machines make twenty counted objects, but that total may be a poor measure of output or workload.

Amounts in different currencies require a defined conversion basis before combination. The applicable rate and date can change the meaning of the result. A technically successful sum of raw monetary fields does not resolve that issue.

Treat “additive” as a documented property under stated conditions. Record valid dimensions, required unit conversions and the inclusion rules. This makes a reporting model more informative than a generic rule that every numeric column should default to a sum.

## Recognise snapshots as semi-additive measures

A **semi-additive measure** can be summed across some dimensions but not others. A stock balance at one instant can often be summed across locations for the same item, provided ownership and transfer conventions prevent overlap. Summing that balance across consecutive instants usually does not give a closing balance.

This is an illustrative example. An item has end-of-day balances of 100, 120 and 80 units over three days. Their sum is 300 unit-observations. The final balance is 80 units. Their simple average is 100 units, but that average is appropriate only for the intended equal-weight observation model.

```figure
type: stats
title: Three end-of-day balances: 100, 120 and 80
caption: A balance is semi-additive: summing it over time gives unit-observations, not stock.
- 300 | Sum | not a stock quantity
- 100 | Simple average
- *80 | Final balance
```

If observations are unevenly spaced, a simple average may be misleading. A balance that remained unchanged for most of a week should not receive the same weight as a brief exceptional state merely because each was recorded once.

For a time-weighted average, account for the duration represented by each state and define how changes between observations are interpreted. The answer depends on whether the source records every change or only occasional samples.

Also distinguish missing snapshots from genuine zero balances. Replacing a missing observation with zero can create a false decline. Carrying the previous value forward may be reasonable in a defined model, but it should not be an undocumented default.

## Recalculate ratios from their components

Rates and percentages usually require their underlying numerator and denominator when combining groups. Averaging displayed percentages gives every group equal weight, regardless of how much activity it represents.

This is an illustrative example. One production batch has two rejected units out of ten, giving 20%. A second batch has eight rejected units out of ninety, giving approximately 8.89%. The unweighted average of those percentages is approximately 14.44%. The combined rejection rate is ten out of one hundred, or 10%.

```figure
type: bars
title: Rejection rate across two batches
unit: %
max: 22
caption: Recalculate a ratio from its components: 10 rejects out of 100 units is 10%.
- Batch 1 | 20 | 2 of 10
- Batch 2 | 8.89 | 8 of 90
- Average of the two rates | 14.44 | misleading
- *Combined rate | 10 | 10 of 100
```

The combined rate answers the question about all inspected units. The unweighted average answers a different question about equally weighted batch rates. Either can be useful, but they should not share a label that conceals the distinction.

Store or retain the components needed for later calculations. For an average duration, those may be total duration and count of eligible jobs. For a utilisation rate, they may be occupied time and available time under a consistent availability definition.

Define the denominator precisely. Excluding cancelled jobs, uninspected units or unavailable machines can materially change a rate. A comparison across sites is meaningful only when those eligibility rules are aligned or their differences are made explicit.

## Keep zero denominators and missing values visible

A percentage with no eligible observations is not automatically zero. If no units were inspected, the rejection rate is undefined for that population. Displaying zero can falsely imply that inspected output was free of defects.

Distinguish an actual zero numerator with a positive denominator from an absent denominator. Also distinguish an unknown numerator from a known zero. These states lead to different interpretations and should survive aggregation where they matter.

This is an illustrative example. Site A inspected fifty units and rejected none. Site B submitted no inspection data. Both might appear as “0%” after careless defaulting, even though only Site A supports that rate.

A report may use a label such as “no observations” or “data unavailable”, with the underlying counts available for explanation. The exact presentation should make the operational distinction clear without overwhelming the reader.

When combining groups, define how incomplete groups affect the total. A rate for reporting sites only can be valid if labelled accordingly. Presenting it as the whole business rate requires evidence that the reporting population covers the intended business population.

## Do not sum distinct counts across overlapping groups

A **distinct count** counts unique identities within a population. The same identity can appear in several groups, so group-level distinct counts generally cannot be added to obtain a larger distinct count.

This is an illustrative example. Three customers place orders on Monday and four on Tuesday. Two customers appear on both days. Adding the daily distinct counts gives seven customer-day appearances, while the two-day distinct customer count is five.

The correct combined count needs the union of identities, another exact representation that supports that union, or an explicitly approximate method with known behaviour. The daily count alone does not retain enough information to reveal overlap.

Identity rules can be as important as the aggregation method. Two accounts may belong to one organisation, while one account may represent several operating locations. Define whether the report counts accounts, legal entities, sites or people.

Changes to identity matching can restate historical counts. If previously separate records are merged, a report rebuilt with current identity rules may differ from a previously issued report. Record the identity basis when reproducibility matters.

## Preserve enough information for medians and distributions

A median is the middle value under a defined ordering convention. Knowing the median of each group is generally insufficient to recover the median of their combined observations.

This is an illustrative example. One group has durations of one, two and one hundred minutes, with a median of two. Another has durations of three, four and five minutes, with a median of four. Averaging the two medians gives three, while the combined six-observation median is 3.5 minutes under the usual midpoint convention.

```figure
type: compare
title: Medians cannot be averaged
cols: Durations | Median
caption: Keep the underlying distribution if medians must be combined.
- Group 1 | 1, 2, 100 minutes | 2
- Group 2 | 3, 4, 5 minutes | 4
- Average of medians | (2 + 4) ÷ 2 | 3
- *All six together | 1, 2, 3, 4, 5, 100 | 3.5
```

Percentiles have a similar issue. A monthly upper-percentile response time cannot usually be reconstructed by averaging daily upper-percentile values. The daily summaries have discarded information about the underlying distributions.

Retain raw observations or an appropriate mergeable distribution representation where later recombination is required. If the method is approximate, document its error characteristics and test it against the kinds of distributions the application actually produces.

Use consistent definitions. Percentile calculation conventions differ, especially for small samples. A change in software or reporting method can alter a displayed value without any change in underlying performance, so comparisons need a stable calculation basis.

## Check that hierarchies provide a valid roll-up path

A **roll-up** combines detailed groups into broader groups, such as products into categories or sites into regions. It is reliable only when the relationships support the intended aggregation.

If each product belongs to exactly one relevant category and every product is assigned, category totals can form a complete non-overlapping classification for an additive measure. If a product belongs to several categories, ordinary summation across those categories may count its contribution repeatedly.

Some overlapping classifications are intentional. A product can be both “export” and “special order”. Those labels are useful filters, but their totals are not necessarily parts of one additive whole.

Where allocation is required, define the weights and their meaning. Splitting a contribution equally between two categories creates an allocated measure, not a direct count of observed events. That can support analysis when the allocation rule is justified and visible.

Check incomplete hierarchies too. Unassigned records should remain visible through an exception category or another deliberate treatment. Silently dropping them makes a complete-looking total cover only the classified subset.

## Preserve the scope of filtered results

Removing a displayed dimension does not necessarily remove its filter. A report of selected products by site remains a selected-product report when the product column disappears.

This is an illustrative example. A report includes only three machine types and then rolls its results into a site total. Labelling the result “all site production” would be incorrect if other machine types were excluded earlier.

Carry important scope into report titles, metadata or clearly visible filter summaries. This is especially valuable for exports, screenshots and scheduled reports that may be read outside the interactive tool where filters were chosen.

Totals can also change meaning when a user selects only some categories. Decide whether the displayed percentage uses the selected population or the full population as its denominator. Both conventions exist, but they answer different questions.

Test the report after hiding dimensions, applying filters and exporting data. These transformations often expose assumptions that were understandable on the original screen but lost in a simplified presentation.

## Handle changing classification over time

A site may move between regions, a product may change category and a customer may become part of another group. Historical reports need a rule for interpreting those changes.

An “as recorded then” view preserves the classification associated with the event. A “classified as today” view applies the current structure to historical activity. Neither is universally correct; the intended comparison determines the choice.

This is an illustrative example. A workshop moves from Region North to Region Central in July. A year-to-date regional report can attribute the first six months to North and later months to Central, or restate the whole year under the current organisation. Mixing those approaches produces unexplained changes.

Retain the information required by the chosen interpretation. Effective dates, classification versions or historical dimension records may be necessary. A current lookup table alone cannot reconstruct every past organisational arrangement.

When a report restates history, identify the basis so readers can reconcile it with previously issued figures. The objective is a meaningful comparison, not a total that remains numerically unchanged regardless of changes in definition.

## Test aggregation with small counterexamples

Large datasets can conceal modelling mistakes because totals look plausible. Small deliberately constructed cases expose whether a rule preserves meaning.

Create a test population with unequal group sizes, repeated identities, missing observations, one unassigned category and a classification change. Calculate the expected results independently before running the reporting model.

For ratios, verify that combining groups uses the intended numerator and denominator. For snapshots, verify the selected time rule. For distinct counts, include an identity present in more than one group. For hierarchies, include both overlap and incomplete coverage.

Also test reconciliation between levels. A difference between a grand total and the sum of visible categories may be correct for a non-additive measure. The report should explain that behaviour rather than forcing an artificial agreement.

Document approved aggregation rules beside measure definitions. Give each measure a meaningful name, unit, grain, eligible population, valid dimensions and treatment of missing data. This helps future analysts use it correctly without rediscovering the original reasoning.

Where a reporting tool permits unrestricted aggregation, consider exposing approved measures rather than leaving every raw numeric field equally prominent. A stored percentage, an identifier and a duration can all look numeric to software while having very different meanings. Clear naming and documented calculations reduce the chance that a convenient drag-and-drop total will become an unsupported business claim.

Reliable reporting depends on preserving meaning as detail is reduced. Once the grain, population and combination rule are explicit, the database can perform the arithmetic consistently and readers can understand what the resulting number actually says.

*Source basis: the summarisation, hierarchy and multidimensional-measure discussions in Multidimensional Databases: Problems and Solutions (2003), supplied in the collection. All numerical examples are original illustrations rather than reported business results.*
