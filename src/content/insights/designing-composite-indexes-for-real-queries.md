---
title: "Designing composite indexes for real queries"
description: "A practical method for choosing composite database indexes by considering filters, ordering, returned columns and the cost imposed on the wider workload."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - design
  - validation
author: "KEVOS®"
featured: false
draft: false
---

Adding an index can make a slow query much faster, but the result depends on what the query asks the database to do. An index on each filtered column is not automatically equivalent to an index designed around the combined search. Nor is the widest possible index automatically the best investment.

A **composite index** contains more than one column. Its usefulness depends on their arrangement, the predicates in the query, the ordering required by the result and the other work the database must perform. Designing one is therefore a workload decision rather than a naming exercise.

This article develops a practical method for assessing composite B-tree indexes. The examples illustrate how to reason about candidates; they are not instructions to alter a production database without testing. Product behaviour, data distribution and existing indexes all affect the final choice.

## Start with a specific user action

An index proposal should begin with an identifiable operation: loading outstanding jobs for one workshop, finding recent movements for one stock item, or displaying the next page of a customer's orders. “The jobs table is slow” is too broad to guide a useful design.

Capture the query, typical parameter values, unusually large cases, requested sort order and the number of rows the application actually consumes. A screen displaying twenty rows has a different objective from an export consuming every matching row.

Record frequency and operational importance. Saving time on a rarely used report may be worthwhile, but a new index can impose maintenance work on every insert or relevant update. The benefit and cost occur in different parts of the workload.

Also establish where the delay happens. A slow page can spend time in network transfer, application processing or lock waits rather than finding rows. The [database performance diagnosis guide](/insights/why-business-systems-slow-down/) helps establish that broader context before index design begins.

## Think of a B-tree as an ordered search structure

For a composite B-tree index on workshop, status and due date, entries are ordered first by workshop, then by status within workshop, then by due date within that combination. This ordering makes some groups of entries easy to locate together.

If a query fixes workshop and status to exact values, the remaining entries for that combination can be considered in due-date order. If it fixes only status, matching entries may be spread across workshop groups. The same columns in a different order support different access patterns.

Avoid turning this principle into an absolute claim that an index is unusable whenever its first column is absent. Optimisers and index implementations can use additional strategies. PostgreSQL's [multicolumn index documentation](https://www.postgresql.org/docs/current/indexes-multicolumn.html), for example, describes B-tree skip scans in suitable circumstances. Such behaviour does not remove the need to examine how much work the chosen plan performs.

The useful question is how tightly the query can locate the relevant entries, how much irrelevant material remains to be examined, and whether the ordering assists the next operation. An index being used is evidence of a chosen path, not proof that the path is efficient.

## Separate equality conditions from ranges

An equality condition fixes a column to one value, such as `workshop_id = 7`. A range condition selects a span, such as due dates before a cutoff. These conditions interact differently with the ordered columns of a B-tree.

A common starting candidate puts columns constrained by equality before a column used for a range. Within the fixed equality group, the range can identify a contiguous part of the ordering. This is a design hypothesis to test, not a universal recipe independent of the rest of the query.

Once the scan covers a range of values in one column, a later column may filter entries without reducing the scanned interval as effectively as an earlier equality column. It can still be useful, but its role should be understood rather than counted as another automatic improvement.

Multiple ranges create a trade-off. An index ordered by due date and then estimated duration cannot generally organise every possible combination of those ranges into one tight interval. Test which range most usefully limits the work for the important parameter values.

The order of equality columns also affects other queries that use only part of the combination. Two arrangements that perform similarly for one fully specified query can have very different value across the application.

## Work through an outstanding-jobs screen

This is an illustrative example. A workshop screen requests open jobs for one workshop, ordered by due date and job identifier. The job identifier provides a stable tie-breaker when several jobs share the same due date.

```sql
SELECT job_id, due_date, customer_id
FROM job
WHERE workshop_id = 7
  AND status = 'open'
ORDER BY due_date, job_id
FETCH FIRST 20 ROWS ONLY;
```

A candidate B-tree key is `(workshop_id, status, due_date, job_id)`. It brings the fixed workshop-status combination together and aligns the following key order with the requested display order. The `customer_id` value may still require access to the underlying table unless it is available through a supported covering arrangement.

Now change the requirement: the screen must show all statuses for that workshop, ordered by due date. The same index groups entries by status before due date, so it does not provide one simple due-date ordering across statuses. A separate sort or another access strategy may be needed.

This small change demonstrates why the exact query matters. An index optimised for one screen variant should not be assumed to optimise every query mentioning the same columns.

## Distinguish filtering from ordering

An index can reduce the number of entries examined, provide the requested order, or do both. Sometimes those objectives favour different column arrangements.

Suppose a query filters a wide range of due dates but orders by customer name. A candidate that narrows the date range may still require sorting the matches. A candidate aligned with customer order may avoid sorting while examining many entries that fail the date filter.

The better choice depends on how much data qualifies and how much output the caller needs. For a complete export, efficient filtering followed by a sort may be attractive. For a small first page, producing acceptable rows in the requested order may have different advantages.

Do not assume sorting is always a defect. Sorting a small result can be cheaper than scanning a much larger index range to avoid it. Inspect the amount of work involved rather than treating the presence of a sort operator as automatic evidence of poor design.

Conversely, a large sort can delay the first result and consume working memory. Measure first-row latency and full-result completion separately when the user's experience depends on one more than the other.

## Consider covering without copying everything

A **covering index** contains the values needed by a query so that the database may be able to answer with fewer accesses to the underlying table. The exact mechanism varies; some products distinguish key columns from included payload columns.

For the workshop screen, customer identifier might be useful payload if it avoids many additional row lookups. Adding a long job description and several rarely displayed notes would make the index much larger and may offer little benefit.

Wider indexes occupy more storage and memory and add maintenance work. They can also reduce how many entries fit on a page. The gain from avoiding a table lookup must be weighed against these costs across both reads and writes.

Do not promise that containing every selected column guarantees no table access. Visibility checks, storage organisation and product-specific implementation can still matter. Verify the actual plan and measured access behaviour for the database in use.

Start with the columns needed by the important query. Add payload only when the expected benefit is demonstrated. An index should have a clear purpose that survives review, not accumulate columns because they might be convenient someday.

## Account for the cost of changing data

Inserting a row may require inserting entries into several indexes. Updating an indexed value may require corresponding maintenance. Deleting data also affects index structures. These costs can become significant for high-volume operational tables.

A status column is a useful example. It may be important for finding open work, but it changes as work progresses. That does not make it unsuitable for indexing. It means the workload evaluation must include the update path as well as the read path.

Measure transaction response and throughput under representative concurrent activity. An index that improves one report while extending a critical write transaction can create a poor overall outcome. Longer transactions can also hold resources for longer, affecting other work indirectly.

Consider storage growth and maintenance windows. An additional index must be backed up, restored, checked and managed through schema changes. These are operational consequences, even when the original proposal is described as a small performance fix.

## Use representative parameter values

Average values can conceal the cases that matter most. One workshop may hold a few dozen open jobs while another holds many thousands. A query plan that performs well for the smaller population may behave differently for the larger one.

Test common values, unusually large values, empty results and broad date ranges. Include combinations whose columns are related, such as workshop and job type. Independence assumptions about their distributions may not match the business.

State the data size and distribution used for testing. A demonstration on a tiny development database can establish syntax and correctness but usually provides weak evidence about production performance.

Parameter handling may also affect plan selection. Reusing a plan can save planning work, while different parameter values can favour different strategies. Investigate the database's actual behaviour before concluding that the index itself is inconsistent.

The purpose of testing is to find a robust improvement across relevant cases, not the most impressive isolated timing.

## Review existing indexes before adding another

List the table's existing indexes, their ordered columns, uniqueness role and known consumers. A proposed composite index may duplicate an existing structure or overlap with it enough that a separate addition is unnecessary.

Overlap is not proof that an index can be removed. A narrower index may be cheaper to scan for some queries, and an apparently redundant index may enforce a constraint. Distinguish performance structures from structures required to preserve data rules.

Compare leading column sequences and sort directions, but do not stop there. Included columns, filtering conditions, collation and uniqueness can make two superficially similar definitions behave differently.

Usage observations help, provided the observation period covers the actual workload. An index unused during an ordinary week might support a month-end process or an infrequent recovery operation. Establish ownership before deciding that its absence is harmless.

Document the reason for retaining or replacing each relevant index. This prevents a cycle in which different teams repeatedly add competing indexes to solve the same local problem.

## Evaluate a small set of candidates

Develop a few candidates with explicit hypotheses. One might minimise the filtered range; another might favour ordered first-page retrieval; a third might add limited covering payload. Explain the expected benefit of each before measuring it.

Use the same dataset, query variants and concurrency conditions for comparison. Capture execution plans, elapsed times, relevant reads, returned row counts and write-side effects. Repeat enough to distinguish a pattern from a single warm-cache result.

Check correctness alongside performance. Changing query expressions to fit an index can alter case handling, date boundaries or missing-value treatment. A faster query that selects a different population is not a successful optimisation.

Prefer the smallest set of indexes that meets the workload's requirements with acceptable operational cost. The best candidate for one query may be unnecessary if an existing index already delivers the required service level.

## Plan introduction and reversal

Creating an index consumes resources and may affect concurrent access. Available online or concurrent creation options, lock behaviour and failure handling depend on the database product and version. Verify those details in the relevant vendor documentation before scheduling a change.

Use the established database change process. Record the proposed definition, reason, expected measures, validation steps and reversal method. Estimate the additional space needed during creation as well as the final index size.

After introduction, inspect the important workload again. A new index adds another choice for the optimiser and may alter plans for queries beyond the one that motivated it. The review should look for regressions as well as the intended improvement.

Keep the before-and-after evidence. If data distribution later changes, that record helps explain why the index was originally useful and whether its purpose still exists.

## Avoid memorable but unreliable rules

Rules such as “put the most selective column first” can be helpful prompts but are incomplete decisions. Equality combinations, required ordering, range conditions, partial use by other queries and write cost all influence the choice.

Likewise, a fixed maximum number of indexes per table ignores workload differences. A mostly static reference table and a heavily updated transaction table can justify very different designs. The useful limit is the cost the workload can carry, supported by measurement.

Do not carry old disk timing assumptions into modern capacity estimates. The supplied index-design text remains useful for its reasoning about access work, but its hardware examples belong to its publication period. Measure the current environment rather than reusing historical milliseconds per operation.

The enduring principle is to explain where the index saves work and where it adds work. That explanation is stronger than a universal column-order slogan.

## Turn the proposal into a reviewable decision

A concise index review should identify the user action, query variants, candidate definition, representative data, observed improvement and effects on writes. It should also identify the conditions under which the result might change.

For a small business relying on a software supplier, these questions provide a useful basis for discussion without prescribing unsupported database changes. Ask the supplier to show why the candidate suits the workload and how regressions will be detected.

Composite indexes are most effective when treated as deliberate arrangements of data for particular access patterns. Understand the filters, ordering and output, test the relevant cases, and assess the whole workload. The resulting design is easier to maintain because its purpose is explicit.

---

*Source: Tapio Lahdenmäki and Michael Leach, Relational Database Index Design and the Optimizers (2005), particularly chapters 3, 4 and 14; current PostgreSQL documentation linked above. The workshop scenario is an original illustration. Historical hardware timing examples have not been reused as current performance estimates.*
