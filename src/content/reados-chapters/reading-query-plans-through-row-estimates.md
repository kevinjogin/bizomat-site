---
title: "Reading query plans through row estimates"
description: "Diagnose database query plans by comparing estimated and actual row counts, tracing estimation errors and testing targeted improvements against real workloads."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - validation
  - process-improvement
author: "BIZOMAT"
featured: false
draft: false
---

A slow database query often attracts an immediate proposal: add an index, increase memory or force a different join. Those changes can help, but they may address the visible symptom while leaving the reason for the chosen plan unexplained. The database may simply expect to process a very different number of rows from the number it encounters.

A **query plan** describes the operations selected to produce a result. Many relational databases estimate the size of intermediate results and use those estimates when comparing alternatives. An early error can influence later choices about joins, access paths and working memory.

Reading a plan through its row estimates provides a disciplined starting point. It does not explain every performance problem, but it helps separate a mistaken expectation about the data from a genuinely expensive operation on correctly estimated data. That distinction guides more targeted experiments.

## Begin with the query's meaning

Before examining a plan, establish what the query is supposed to return. Identify its output grain, filters, joins, date boundaries and treatment of missing values. An unexpectedly large intermediate result may come from a faulty join rather than an optimiser mistake.

Confirm the actual parameters used by the slow request. A query searching one customer's recent orders may have a very different population from the same text searching several years of activity for the largest customer. The text alone is incomplete evidence.

Also record the observed problem. Is the first page slow to appear, is a full export taking too long, or are many concurrent requests saturating the system? A plan that is reasonable for one objective may be unsuitable for another.

Use a representative execution context, including the database, schema, role and relevant settings. Comparing plans from different contexts without noting those differences can lead to false conclusions about what changed.

## Distinguish estimated plans from measured execution

An estimated plan shows what the database expects to do. It does not prove how many rows were actually processed or how long each operation took. A measured plan adds execution observations, usually by running the statement with instrumentation.

PostgreSQL's [EXPLAIN documentation](https://www.postgresql.org/docs/current/using-explain.html) explains that `EXPLAIN ANALYZE` executes the statement. It also documents that actual rows and times are averages per execution when an operation has multiple loops. These details are essential when interpreting the output. Do not run a modifying statement merely to inspect it without accounting for its effects.

For an initial investigation, use a read-only query in an appropriate test environment or a controlled diagnostic process. Instrumentation itself can add overhead, and a production query can still consume substantial resources even when it changes no data.

Label the evidence accurately. An estimated plan is useful, but a report based only on estimates should not claim to have measured actual execution. Likewise, a single instrumented run is not a complete workload benchmark.

## Follow rows through the plan

A plan is a tree of operations. Lower operations obtain or filter data; higher operations combine, sort or aggregate their results. To understand the data flow, follow what each operation receives and produces.

For each important operation, compare estimated output rows with observed output rows. Look for the earliest substantial divergence rather than starting with whichever operation displays the largest time at the top.

An upper join may process far more rows than expected because a lower filter was underestimated. Changing the join method might improve that particular execution, but correcting the earlier estimate may allow the optimiser to make several better decisions together.

Record the direction of error. Underestimation and overestimation can cause different choices. Underestimation may make repeated lookups appear cheap; overestimation may make a narrow access path appear unattractive. Neither automatically proves a specific plan should have been chosen.

Some operators naturally reduce many rows to few, such as an aggregate. Do not mistake that reduction for an error. The comparison is between estimated and actual output at the same operation, interpreted in context.

## Account for repeated work

A modest row count can hide substantial repeated execution. An inner operation of a nested-loop join may run once for each row produced by its outer input. Understanding the number of loops is therefore as important as reading the rows per loop.

This is an illustrative example. A plan expects 100 outer rows and approximately one matching inner row for each. The actual outer result is 20,000 rows, with three inner rows returned on average per loop. The inner operation produces about 60,000 rows across those loops rather than the roughly 100 suggested by the original expectations.

```figure
type: bars
title: Inner rows produced by a nested loop
unit: rows
max: 62000
caption: 20,000 outer rows instead of 100, with three inner rows each instead of one.
- Estimated | 100
- *Actual | 60000 | 20,000 loops × 3
```

The arithmetic describes output volume, not elapsed time. Some lookups may be cheap because their pages are already in memory; others may require more work. The example establishes why an apparently small operation can dominate through repetition.

Do not simply add all reported operation times. Depending on the product and field, parent times can include work performed by children. Treating inclusive times as independent durations double counts execution cost.

Use the database's documentation to establish how loops, row counts and timings are reported. A consistent interpretation is more valuable than a colourful plan diagram whose numbers are being read incorrectly.

## Understand what statistics describe

The optimiser generally cannot inspect every possible result in advance. It uses metadata and statistical summaries to estimate how much data will satisfy a condition. These may include table size, common values, distributions and the number of distinct values.

Statistics are summaries rather than a second complete copy of the table. They may be sampled, may not describe every relationship between columns, and may become less representative as data changes.

PostgreSQL's [planner statistics documentation](https://www.postgresql.org/docs/current/planner-stats.html) describes both ordinary statistics and extended statistics for selected combinations of columns. This provides a concrete example of why knowing separate column distributions is not always enough to estimate a combined condition.

The existence of statistics does not establish their adequacy for a particular query. Ask when they were collected, which objects they describe and whether they represent the values causing the problem. A timestamp alone cannot answer all three questions.

## Recognise stale information

A table can change substantially after its statistics were collected. Bulk imports, large deletions, a new business unit or a seasonal shift can alter both size and distribution. The plan may be based on a population that no longer resembles the workload.

Compare the timing of the performance change with these events. If a query became slow immediately after a major load, statistics are a plausible hypothesis. They are not the only one: storage, indexes, cache state and concurrent activity may also have changed.

Refresh statistics through the database's supported maintenance process where appropriate, then compare the resulting estimates and performance. Record the before-and-after evidence rather than assuming that running maintenance must have solved the problem.

If the estimates improve but elapsed time does not, continue investigating. The query may still perform inherently expensive work, or a resource wait may dominate. An estimation correction is an intermediate result, not automatically the final outcome.

## Recognise skewed distributions

An average assumption is weak when values are unevenly distributed. A few customers may account for most orders, or one job status may dominate a table while others are rare. A plan suited to the typical value can perform poorly for the exceptional one.

This is an illustrative example. A table contains 100,000 service requests across 1,000 accounts. The simple average is 100 requests per account, but one account holds 40,000. Estimating that account from the average understates its population by a factor of 400.

```figure
type: bars
title: When the average hides the outlier
unit: requests
max: 42000
caption: 100,000 requests across 1,000 accounts average 100 each; an estimate built on that average is wrong by a factor of 400 for the largest account.
- Average account | 100
- *Largest account | 40000
```

Real optimisers use more sophisticated summaries than this simple average where information is available. The example illustrates the risk that arises when the relevant skew is not represented or not usable in the planning context.

Test both common and exceptional parameter values. A fix validated only against the large account might make smaller requests worse, while a fix validated only against the median account can leave the main operational problem untouched.

Describe the distribution in business terms when possible. “The national service account contributes a large share of requests” is more useful context than an unexplained statement that the table is skewed.

## Recognise relationships between columns

Two filters may be strongly related. Product family and product model, workshop and region, or status and completion date are not necessarily independent. Estimating their combined effect by multiplying separate probabilities can produce a poor answer.

This is an illustrative example. In a hypothetical dataset, every record from Workshop North has region North. If each condition individually selects one quarter of the table, applying both still selects one quarter. An independence assumption would predict one sixteenth, a fourfold underestimate.

The relationship might be exact, as in the example, or merely strong. It may also change over time. Identify the business dependency before choosing a technical remedy, because the correct design could involve better constraints, better statistics or a clearer query.

Additional statistics are not universally effective for every expression or join. Check what the database can use for the specific estimation problem. Collecting more summaries without a hypothesis adds maintenance work and can make the investigation harder to interpret.

## Examine expressions and conversions

A predicate may be harder to estimate or use efficiently when it wraps a column in a function, combines several values or introduces a type conversion. The available statistics and indexes may describe the stored column rather than the transformed expression.

Review whether the expression is necessary for the intended meaning. A date-range predicate can sometimes express a period more directly than applying a date-extraction function to every timestamp. Any rewrite must preserve boundaries and time-zone semantics.

Check parameter types as well as visible SQL text. A mismatch between a parameter type and a column type can affect comparison behaviour and planning. The application layer may supply a type different from the one used during an interactive test.

Do not rewrite solely to achieve a preferred plan shape. First establish equivalent results on boundary and missing-value cases. Performance tuning that silently changes the population has traded a slow correct answer for a fast wrong one.

## Separate estimation problems from other delays

Accurate row estimates do not guarantee fast execution. A query can correctly predict a large result that simply requires substantial work. It may also wait for locks, compete for processor time or spend time sending data to the client.

Compare plan observations with system and application measurements. If the database finishes quickly but the user waits much longer, investigate transfer, rendering and application processing. If sessions wait for locks, a different index may not address the blocking transaction.

Look for intermediate sorting or hashing that exceeds the available working memory, while recognising that the remedy depends on concurrency and workload. Increasing memory for one operation can increase total demand when many operations run at once.

The purpose is to form a causal explanation. “The query is slow because the plan contains a hash join” is not one. “The join processes far more rows than estimated because this filter's selectivity is wrong” is a testable hypothesis.

## Change one relevant factor at a time

Once the likely cause is identified, choose a targeted experiment. Possible experiments include refreshing relevant statistics, adding supported statistics for correlated columns, correcting a type mismatch or testing an index that fits the actual access pattern.

Record expected evidence before making the change. If the hypothesis concerns a row estimate, specify which estimate should move closer to reality. If it concerns repeated lookups, specify which work should decrease.

Re-run the same correctness and workload cases under comparable conditions. Avoid attributing every improvement to the change when cache state or concurrent load differs markedly between runs.

Retain an unsuccessful experiment as useful evidence. If the expected estimate does not change, that narrows the investigation. Repeatedly changing several settings at once may produce a better timing but leaves the team unable to explain or maintain the result.

## Use forced plans cautiously

A hint or forced plan can provide a valuable experiment or a temporary stabilisation measure where the product supports it. It can demonstrate that an alternative execution strategy performs better under a particular set of conditions.

It does not automatically explain why the optimiser chose differently, and it can become unsuitable as data and workload change. Document the reason, scope, observed benefit and review trigger for any such intervention.

Compare the forced alternative across relevant parameters. A strategy that helps a large account may harm the many small requests that dominate normal usage. The operational objective is the workload's service level, not the appearance of one plan.

Where the underlying estimate can be improved reliably, that may provide a more adaptable solution. Where it cannot, an explicit operational workaround can still be justified, provided its limitations are understood.

## Prepare evidence that another person can use

A useful investigation record includes query text, parameter values, database version, relevant settings, data scale, estimated and measured plans, and the timing context. Remove confidential literal values before sharing it outside the authorised team.

Summarise the first meaningful estimate error, its likely cause, the experiment performed and its effect. Include the cases that did not improve. This makes the report more useful to a supplier or administrator than a screenshot labelled “bad plan”.

For business stakeholders, connect the finding to the affected operation: opening a job queue, completing a stock enquiry or producing a report. Avoid presenting internal optimiser cost units as if they were seconds or money.

Reading row estimates is a way to understand the database's expectations. Compare those expectations with observed work, trace the first important divergence and test a specific explanation. That method turns query tuning into an evidence-based investigation rather than a succession of hopeful changes.

---

*Source: Tapio Lahdenmäki and Michael Leach, Relational Database Index Design and the Optimizers (2005), particularly chapter 14; the supplied Database Management Systems, second edition, chapters 13 and 14; PostgreSQL documentation linked above. All numerical examples are illustrative. No performance improvement is claimed for an actual system.*
