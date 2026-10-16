---
title: "Screening and cleaning data before analysis: duplicates, gaps, outliers and a clean audit trail"
description: "How to screen and clean business and research data before analysis: keep raw data safe, check structure, duplicates, missing values, ranges, units, dates and outliers, and document every change."
publishDate: 2026-10-16
category: "Ideas"
tags:
  - validation
  - systems
  - quality
author: "KEVOS"
featured: false
draft: false
---

Analysis is only as good as the data it uses. Before a single average is calculated or a chart drawn, most real data sets need checking and cleaning. Records are duplicated when a system is migrated or a form is submitted twice. Some fields are blank. Branches record hours in different units. Dates arrive in mixed formats, and times cross midnight or time zones. Product categories are spelled three different ways. A few values are wildly out of range because of typing errors, and a few are genuinely unusual. A survey export contains test responses and people who clicked through in thirty seconds.

Analysts often say that preparing data takes more time than analysing it, and the effort is worthwhile. Skipping it produces averages distorted by errors, counts inflated by duplicates and comparisons undermined by inconsistent units or categories. Done carelessly, cleaning can do its own damage: deleting inconvenient values, overwriting original records or making undocumented changes that nobody can later explain or reproduce.

This article explains how to screen and clean data systematically: protecting raw data, organising data in a consistent structure, checking completeness, duplicates, validity, consistency, units, dates and outliers, handling missing values and survey-specific problems, merging data sets, documenting every change and preventing problems at the source. It is part of a series on research and evidence for business decisions.

## Protect the raw data

The first rule of cleaning is never to change the original data. Keep a read-only copy of every raw extract, export or file exactly as received. Clean a working copy, and record every change in a **cleaning log** or, better, in a script or a documented sequence of steps that can be rerun. If the analysis is questioned, or a cleaning decision turns out to be wrong, the raw data and the log allow the work to be checked and repeated.

## Profile before cleaning

A quick **profile** of each column before cleaning gives an overview of what needs attention: the number of records, the count of blanks, the number of distinct values, the minimum and maximum, the most common values and, for numbers, the average and median. Spreadsheet pivot tables, filters and simple summary formulas are enough for most business data sets. A profile often reveals problems immediately, such as a "state" column with 14 distinct values instead of 8 or a "quantity" column whose maximum is 99,999, a placeholder someone typed when the true value was unknown.

## Privacy while cleaning

Cleaning often involves looking closely at individual records, including names, contact details, staff identifiers and free-text comments. Only people who need access should handle identifiable data, working copies should be stored securely, and identifiers that are not needed for analysis should be removed or replaced with codes as early as possible. Extracts sent to consultants or loaded into external tools should contain only the fields required.

## Versioning cleaned data

Cleaned data sets should be saved with a version number and date, alongside the raw source and the cleaning log, so that every analysis can state exactly which data it used. When new data arrives or a cleaning rule changes, a new version is created rather than overwriting the old one.

## Organise the structure

Analysis is easiest when data is **tidy**:

- each row represents one observation, such as one job, one response or one part;
- each column represents one variable, such as date, customer, hours or result;
- each cell holds one value; and
- each table holds one kind of observation.

Common structural problems include merged cells, totals mixed with data rows, several values in one cell, such as "3 hrs + 2 hrs travel", and data spread across many sheets with slightly different layouts. Restructuring these into a single tidy table is the foundation for everything else.

## Check completeness and missing values

Count missing values in each column and look for patterns. Are blanks concentrated in one branch, period or form version? Do they mean "zero", "unknown", "not applicable" or "not recorded"? Treating blanks as zeros can badly distort totals and averages, while dropping incomplete records can bias results if the missing records differ from the rest.

Options include leaving missing values as missing and reporting how many there are, analysing complete records separately, or estimating missing values using a documented method. Estimation, often called **imputation**, should be used cautiously and disclosed, because it adds assumptions to the data.

## Find duplicates

Duplicates arise from double submissions, system migrations, merged data sources and repeated imports. Exact duplicates are easy to find; near-duplicates, such as the same customer recorded with slightly different spellings or the same job entered twice with different reference formats, are harder. Identifying records by a reliable key, such as a job number or customer ID, makes duplicates visible. The [designing identifiers](/reados/collections/operational-data-records-and-controls/designing-identifiers-and-check-digits/) article explains how well-designed identifiers prevent errors.

Before removing apparent duplicates, confirm that they are truly the same observation. Two identical-looking orders on the same day may be genuine repeat orders.

## Check validity and ranges

Each variable has valid values. Hours worked cannot be negative or exceed a day's length in a single shift; percentages lie between 0 and 100; dates must fall within the period of interest; categories must come from the defined list. Simple checks, such as sorting each column, filtering for values outside expected ranges and counting the values in each category, reveal most invalid entries.

## Make categories consistent

Free-text and inconsistently entered categories are a common problem: "Hydraulics", "hydraulic", "Hyd." and "hydraulics " (with a trailing space) all mean the same thing but are counted separately. Cleaning involves trimming spaces, standardising case and spelling, and mapping variants to a defined list. A **lookup table** that maps each variant to its standard category, kept with the cleaning log, makes the mapping transparent and reusable. Hidden differences in text, such as different character encodings or non-breaking spaces, can also prevent matching, as the [text encoding, collation and reliable record matching](/reados/collections/sql-queries-and-data-correctness/text-encoding-collation-and-record-matching/) article explains.

## Check units and scales

Mixed units are among the most damaging errors because they produce plausible-looking numbers. One branch records time in hours and another in minutes; one supplier reports weights in kilograms and another in tonnes; prices appear with and without GST. Checking the distribution of values by source or branch, and looking for clusters that differ by factors such as 60, 1,000 or 1.1, reveals these problems. Converting everything to a single stated unit, and labelling the columns, fixes them.

## Check dates and times

Dates and times cause many subtle errors:

- **Formats**: day-month and month-day formats can be confused, especially for days 1 to 12.
- **Text dates**: dates stored as text may sort and calculate incorrectly.
- **Time zones and daylight saving**: data from systems in different zones or across daylight saving changes can produce apparent errors of an hour or more.
- **Overnight periods**: a shift starting at 10 pm and finishing at 6 am produces a negative duration if dates are ignored.

Recalculating durations from full date-time values, and checking for negative or implausibly long durations, catches most of these problems.

## Check logical consistency

Values should make sense together. A job's completion date should follow its start date; the parts of a total should add to the total; a customer marked inactive should not have orders this month; a survey respondent who says they have never used a service should not rate it. Cross-checks between related fields reveal errors that range checks miss.

## Outliers: error or insight

**Outliers** are values far from the rest. Some are errors, such as an extra zero typed into a quantity. Others are genuine and important, such as an exceptionally long breakdown or a very large order. Each outlier should be investigated: check it against source records where possible, correct it if it is an error, and keep it if it is genuine. Deleting genuine outliers to make results look tidier removes exactly the events a business most needs to understand. Where outliers strongly affect averages, report results with and without them, or use measures such as the median that are less sensitive to extremes.

## Survey-specific screening

Survey data needs additional checks:

- **Test responses** entered while setting up the survey.
- **Duplicate submissions** from the same person.
- **Speeders** who completed the survey implausibly quickly.
- **Straight-liners** who gave the same answer to every item in a grid.
- **Failed attention checks**, where included.
- **Contradictory answers**.

Rules for excluding responses should be decided before looking at how those responses answered the key questions, so that exclusion is not influenced by whether the results are welcome.

## Merging data sets

Combining data from different systems, such as sales and production or survey responses and customer records, requires a reliable **key** shared by both. Before merging, check that keys are formatted consistently, that every record in one table has a match where expected and that one-to-many relationships are handled correctly. After merging, compare record counts and totals with the source tables. A merge that silently drops unmatched records or duplicates records on a many-to-many join can change results substantially.

## Document every decision

A cleaning log records what was found, what was changed, why and how many records were affected: "Converted 214 Branch B duration values from minutes to hours", "Removed 38 duplicate job records with identical job number and date", "Excluded 12 survey responses completed in under 60 seconds". The log lets others understand and reproduce the cleaning, supports honest reporting and makes it easier to clean the next extract the same way.

## Prevent problems at the source

The best cleaning is the cleaning that is never needed. Data quality improves when forms use drop-down lists for categories, validate ranges and formats at entry, require key fields, use consistent units and identifiers and avoid free text where structured fields would do. When cleaning reveals recurring problems, fixing the source system or process saves effort in every future analysis. The [master data and the single source of truth](/reados/collections/operational-data-records-and-controls/master-data-and-the-single-source-of-truth/) article explains how to keep core business data consistent.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A service company extracts 1,250 job records from two branches to analyse job durations and costs. Before analysis, the analyst saves the raw extract and works on a copy.

Screening finds 38 exact duplicates created when one branch's data was migrated, which are removed after checking against invoices. Branch B records durations in minutes and Branch A in hours, which explains a cluster of jobs apparently lasting several hundred hours; Branch B's 214 values are converted. Twelve jobs have negative durations because overnight work was recorded with only start and finish times; recalculating from full date-time stamps fixes them. The job category field contains 23 variants for 9 real categories, which are mapped with a lookup table. Five jobs show costs ten times higher than similar jobs; source invoices confirm that three are typing errors and two are genuine major repairs, which are kept and flagged.

The cleaning log records each step and the number of records affected. Analysed before cleaning, average job duration would have been reported as about 9 hours; after cleaning, it is about 3.4 hours, consistent with what supervisors expected. The company adds unit labels and a category drop-down to its job forms.

## How this applies to a small Australian business

- **Keep raw data untouched** and clean a copy.
- **Organise data in tidy tables.**
- **Check missing values, duplicates, ranges, categories, units, dates and logic.**
- **Investigate outliers** before deciding what to do with them.
- **Set survey exclusion rules in advance.**
- **Verify merges** with counts and totals.
- **Log every cleaning decision.**
- **Profile each column** before cleaning to see where problems lie.
- **Limit access to identifiable data** and remove unneeded identifiers early.
- **Fix data quality at the source** where problems recur.

## Common mistakes

- **Editing the original data directly.**
- **Treating blanks as zeros.**
- **Deleting genuine outliers.**
- **Missing mixed units** because values look plausible.
- **Silent losses or duplications in merges.**
- **Overwriting cleaned data sets** without versions, so analyses cannot be traced.
- **Undocumented cleaning** that cannot be reproduced.

## Frequently asked questions

**How much cleaning is enough?** Enough that remaining errors are unlikely to change the conclusions. Focus effort on the variables that matter most to the analysis.

**Should missing values be filled in?** Only with a clear, documented method and an understanding of how it might affect results. Often it is better to report missing values and analyse with and without them.

**Can cleaning be automated?** Repeated cleaning steps can be scripted or built into spreadsheet queries, which saves time and ensures consistency, but new data sets still need human screening.

**Is it acceptable to remove survey respondents?** Yes, if rules for exclusion are reasonable, set in advance and reported, and not chosen because of how those respondents answered.

## Questions to ask

- Where is our raw data kept, and is it protected from editing?
- Which fields in our key data sets are often missing or inconsistent?
- Do our analyses mix units, formats or category spellings?
- How do we decide what to do with outliers?
- Can each of our analyses state exactly which version of the data it used?
- Which data quality problems should be fixed in our forms and systems?

## Bringing it together

Screening and cleaning turn messy real-world data into a reliable basis for analysis. Protect raw data, organise tidy tables, and check completeness, duplicates, validity, categories, units, dates, logic and outliers. Treat survey data and merges with particular care, document every decision in a cleaning log and fix recurring problems at the source. The result is analysis that can be trusted, explained and repeated.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
