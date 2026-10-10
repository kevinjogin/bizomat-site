---
title: "Materialised views and reporting freshness"
description: "Design stored reporting results with clear refresh rules, source watermarks and reconciliation checks, including the limits of incremental maintenance."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - validation
author: "KEVOS"
featured: false
draft: false
---

A report can repeatedly perform the same expensive joins and calculations even when much of its underlying information has not changed. Storing the calculated result can make that report faster and more predictable. It also introduces a new question: which state of the source does the stored result represent?

A **materialised view** persists the result of a query or related derivation so it can be read without recomputing the entire answer each time. This differs from an ordinary view, which defines a query without necessarily storing its result. The exact facilities for creating and refreshing materialised views depend on the database product.

The design challenge combines performance and meaning. A fast result is useful only when readers understand its scope and freshness, updates are propagated correctly and the stored answer can be reconciled with its source. Those responsibilities apply equally to database-managed views and application-managed summary tables.

## Decide which repeated work is worth storing

Begin with a workload that performs substantial repeated computation. Typical candidates include grouped totals, joins across relatively stable reference data and summaries used by several screens or reports.

Measure how frequently the result is read, how expensive it is to compute and how often its dependencies change. A result read rarely but refreshed constantly can cost more to maintain than it saves. A small direct query may already be adequate with appropriate indexing.

The stored result also occupies space and may need its own indexes, backups and operational monitoring. Those costs become significant when a team creates a separate summary for every variation of a report.

Look for a useful common level of detail. A daily summary by site and product might serve several reports that aggregate further. A grand total alone cannot answer questions about individual sites without returning to the source.

However, a more detailed materialisation is not automatically better. It can approach the size and maintenance cost of the underlying data. Choose a level that supports identifiable repeated questions while retaining the information those questions require.

## Declare the result's grain and population

The **grain** describes what one row represents. It might be one product at one site on one business date, or one customer account at a particular snapshot time. State that definition before selecting columns or building refresh logic.

Define the included population separately. A daily production summary might include completed jobs only, or all recorded machine events, or only records accepted by a validation process. Similar column names do not make those populations equivalent.

This is an illustrative example. A summary row contains completed units for one site and one date. Jobs awaiting quality acceptance are excluded. If a manager reads the total as all units physically produced, the report can mislead even when its calculation is technically correct.

Record exclusion rules and their consequences. If incomplete data is omitted, the result should not silently appear to cover a complete population. A coverage indicator or an associated reconciliation count may be needed.

Avoid mixing grains in one measure. Combining a daily total with individual transactions can cause double counting during later aggregation. Treat the declared grain as a contract for every row written by the refresh process.

## Distinguish refresh time from source freshness

A successful refresh timestamp tells you when processing finished. It does not necessarily tell you how current the source was or which changes were included.

A **source watermark** identifies the boundary of source changes incorporated into the result. Depending on the system, it may be a transaction-log position, an ingestion sequence or another meaningful version marker. A wall-clock timestamp is useful only if its semantics support the intended completeness claim.

This is an illustrative example. A report refresh finishes at 10:15, but its source feed is complete only through 09:50. Displaying “updated at 10:15” without further context suggests a fresher view than the pipeline actually provides.

Multiple sources complicate the picture. Orders may be current through one boundary and shipments through another. A single latest timestamp cannot establish that both sides of a comparison represent a consistent business state.

Define the freshness promise in terms readers can use. It may be “includes accepted transactions through the previous completed business day” or a clearly labelled operational estimate. Keep processing time, source coverage and business period distinct in the metadata.

## Choose between rebuilding and applying changes

A **full refresh** recomputes the stored result from its source. It is conceptually straightforward and often easier to reconcile, but it can consume substantial resources and may interfere with readers unless the implementation provides a suitable replacement mechanism.

An **incremental refresh** applies the effects of source changes to an existing result. It can reduce repeated work, but it requires enough information to calculate those effects and to establish which changes have already been applied.

The choice depends on change volume, query complexity, latency requirements and operational capability. If most of the relevant data changes between refreshes, incremental logic may offer little advantage. If changes are small and the derivation is suitable, it can be valuable.

Product support varies. PostgreSQL documents stored materialised results and an explicit refresh command. Its concurrent refresh option has eligibility requirements, including a qualifying unique index; it should not be described as a universal incremental-maintenance facility. [PostgreSQL materialised views](https://www.postgresql.org/docs/current/rules-materializedviews.html) and [refresh command](https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html).

Separate the desired behaviour from the product feature name. An application-managed summary may implement incremental changes, while a database feature called a materialised view may use full recomputation for the chosen refresh operation.

## Understand which measures can be maintained simply

Some aggregates retain enough information to process additions and removals directly. A sum can add the contribution of an inserted record and subtract the contribution of a deleted record, provided the previous contribution is known and each change is applied correctly.

An average needs more than its displayed value. Maintain the sum and the relevant count, then calculate the average from those components. The count must match the definition of included observations, especially where missing values are possible.

This is an illustrative example. A group has a total duration of 120 minutes across six completed jobs. Adding a job lasting thirty minutes produces 150 minutes across seven jobs, giving approximately 21.43 minutes per job. Adding thirty directly to the old average would have no useful meaning.

Minimum and maximum values behave differently. A new value can be compared with the current extreme. Removing the record that supplied the extreme may require additional retained information or another search of the source to find the replacement.

Distinct counts and medians also need richer state than a single displayed number for many updates. Do not assume that every aggregate supports the same change arithmetic. Choose exact supporting structures, recomputation or a clearly labelled approximation according to the reporting requirement.

## Treat corrections as changes to old and new groups

An update can alter both a measure and its grouping attributes. Correcting a site's identifier moves a record's contribution from one site summary to another. Updating only the destination group leaves the old group overstated.

This is an illustrative example. A recorded quantity of twelve units is corrected from Site A to Site B, with the quantity also changed to ten. The correct maintenance removes twelve from Site A and adds ten to Site B. Adding a net change of minus two to Site B does not repair the original allocation.

Incremental processing therefore often needs the old and new versions, or a reliable way to reconstruct them. A change event containing only a new timestamp may not provide enough information to reverse the previous effect.

Reference-data changes can affect many rows too. If a product moves to a new reporting category and the report uses current classification, historical contributions may need regrouping. If the report preserves classification at the time of the event, a different rule applies.

Document those semantics explicitly. A refresh can produce internally consistent numbers while implementing the wrong historical interpretation. The business definition determines whether a reference-data edit should change past reports.

## Make processing repeatable without double application

A refresh job can fail after applying some changes but before recording that it completed. When restarted, it may encounter those same changes again. Without a recovery design, retrying can duplicate contributions.

**Idempotent processing** produces the intended state even when the same logical operation is retried. Possible approaches include replacing a complete bounded group, recording processed change identifiers or committing the result and its progress marker together where the architecture permits.

The correct mechanism depends on transaction boundaries. If the summary and progress marker live in different systems, a local database transaction may not cover both. That gap must be addressed explicitly rather than hidden behind a “retry on error” setting.

Out-of-order changes need attention as well. An older correction arriving after a newer one should not overwrite the newer state merely because it was processed later. Preserve an ordering or version rule meaningful to the source entity.

Maintain a replay or rebuild path. Even careful incremental logic can contain defects, and business rules change. The ability to reconstruct a result from an authoritative source provides an important route for recovery and independent verification.

## Publish a coherent generation to readers

A report reading a summary during refresh should have a defined view of the work. Depending on the mechanism, it might see the previous complete generation, wait for the new generation or observe committed incremental changes under a documented consistency rule.

Avoid exposing partially rebuilt totals as if they were complete. Deleting a summary and gradually inserting replacement rows can make intermediate reports appear to show a sudden operational collapse followed by recovery.

One design builds a replacement generation separately, validates it and then changes which generation readers use. The details of a safe switch depend on the database and access path, including what happens to readers already using the previous generation.

Related summaries may need a shared generation identifier. If one report compares two tables refreshed at different times, each table can be individually valid while their combination is misleading. A coherent reporting release should establish which versions belong together.

Do not assume that a friendly display timestamp solves mixed-generation reads. Consistency needs to be built into the retrieval path or made explicit in the report's meaning.

## Reconcile more than one grand total

A grand total is a useful check, but equal totals can hide incorrect allocation. Moving an amount from one site to another preserves the overall sum while corrupting the site comparison.

Reconcile at several meaningful levels: overall population, selected groups, boundary periods and records with known corrections. Compare row counts and relevant measures, using the same inclusion rules and source boundary on both sides.

Include empty and newly created groups. A stale row can survive after its last contributing record is deleted. A group with zero contribution may need to disappear or remain with an explicit zero, depending on the declared reporting model.

Track rejected or quarantined source records separately. A summary built from accepted data should reconcile to the accepted population, while the difference from the full source remains visible. Otherwise, data-quality failures can look like ordinary changes in business activity.

Use tolerances only where the measurement or calculation warrants them. A rounding tolerance for decimal presentation should not excuse missing transactions. Record the reason for each tolerance and compare unrounded values where appropriate.

## Budget the cost of maintaining several results

Every stored derivation adds another dependency to updates and operations. A source change may affect several summaries, indexes and downstream exports. Optimising one report can increase work elsewhere.

Inventory materialisations by owner, purpose, grain, refresh method, dependencies and measured use. Retire candidates only through an appropriate review, but identify those whose maintenance cost no longer supports a real reporting need.

Where summaries share useful intermediate results, coordinated computation may reduce repeated work. It can also create a dependency chain in which a failed intermediate refresh blocks several reports. Balance reuse against recovery complexity.

Schedule work using measured resource demand. Running all refreshes on the hour may create a predictable contention peak. Spreading independent jobs can help, provided the resulting freshness differences remain compatible with reporting requirements.

Monitor refresh duration relative to the intended interval. If a job routinely takes longer than the time between scheduled starts, overlapping runs or permanent lag may follow. The system needs an explicit policy for skipped, queued or consolidated refresh requests.

## Test a complete reporting lifecycle

A useful test set includes insertions, deletions, measure corrections, movement between groups, changed reference data and late-arriving records. Add duplicate delivery, interrupted refresh and replay from an earlier progress marker.

For each scenario, compare the maintained result with a clean recomputation from the same source state. This provides an independent correctness reference rather than merely testing that the incremental code executes without an error.

Test readers during refresh and failure. Verify which generation they observe, how age is displayed and how an unavailable or incomplete result is represented. A blank result should not be indistinguishable from a valid report containing no activity.

Record the tested recovery procedure alongside the reporting definition. A future operator should be able to identify the last valid generation, locate its source boundary and rebuild the result without guessing which jobs previously ran.

Also test a change to the calculation itself. Replaying events through a new rule while retaining totals calculated under the old rule can create a hybrid result that belongs to neither definition. Give the rule an identifiable version, decide whether historical values require restatement and build a coherent replacement when necessary. Keep comparisons between reporting periods explicit about which definition each period uses.

Materialisation is most valuable when it turns expensive repeated computation into a dependable reporting service. Clear grain, explicit freshness, correct change handling and independent reconciliation make the stored result trustworthy enough to justify the additional moving parts.

*Source basis: the materialised-view maintenance chapter in Multidimensional Databases: Problems and Solutions (2003), supplied in the collection. Examples and operational procedures are original synthesis. Product-specific statements were checked against the linked PostgreSQL documentation.*
