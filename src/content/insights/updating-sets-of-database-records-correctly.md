---
title: "Updating sets of database records correctly"
description: "How to define a multi-record database change, select the right population, avoid ambiguous update joins, and verify the result without relying on row-by-row assumptions."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - quality
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A request to change several database records is often written as a loop: fetch a record, calculate a new value, save it and move to the next. That approach can be appropriate, but it can also obscure the real operation. The business may be asking for one rule to apply to an entire defined population.

SQL can express that population and transformation together. A **set-based update** describes which records qualify and how their values should change, leaving the database to choose how to execute the work. It does not require the application to prescribe a separate save operation for each row.

The main benefit is a clearer statement of intent, not a promise that one statement is always faster or safer. A concise update can still target the wrong records, use an ambiguous source or repeat a business effect. Correctness depends on defining and verifying the complete change.

## Describe the population before the calculation

Begin with a sentence identifying exactly which records should change. “Increase the reorder quantity by two for active items in store A whose current reorder quantity is below ten” is testable. “Update the low items” leaves the status, location and threshold open to interpretation.

Translate each part into a condition and identify the source of each value. Is active a stored status or a condition derived from dates? Does store A identify a stock location or the organisation that owns it? Is the threshold applied to the current value or to an approved snapshot?

Include exclusions explicitly. Retired items, another organisation's records and records already processed may need to remain unchanged. A query that appears correct in a test database containing only active items can affect a much wider population in production.

Nulls also need a business interpretation. A missing reorder quantity does not compare as less than ten in ordinary SQL three-valued logic. Decide whether missing values should be excluded, rejected for review or assigned under a separate rule. Do not silently treat unknown as zero merely because doing so makes the update easier.

## Define the transformation independently of execution order

Once the population is clear, describe the new value for each qualifying record. Some operations assign a common value; others calculate from the record's existing values; others use an authoritative mapping or aggregate from related records.

A set-based expression should not depend on the application visiting records in a particular order. “Mark all eligible orders as reviewed” has a direct per-record transformation. “Give the next available position to each order” needs an explicit ordering and allocation policy before it becomes a well-defined operation.

Do not confuse physical execution with logical meaning. The database may process pages and rows internally in an order you did not specify. A statement applying to a set does not mean the engine changes every storage location at the same physical instant.

Constraint timing and trigger behaviour remain engine-specific. A mathematically sensible final state can still encounter an intermediate uniqueness conflict in a particular implementation. Verify the actual database semantics instead of assuming that a set-based formulation makes every rearrangement automatically valid.

## Work through a bounded stock-setting change

This is an illustrative example. A workshop stores a reorder quantity for each item-location record. The agreed operation increases that quantity by two for active records in store A where the current quantity is below ten. No other records should change.

| Record | Store | State | Current quantity | Expected quantity |
|---|---|---|---|---|
| 1 | A | active | 3 | 5 |
| 2 | A | active | 9 | 11 |
| 3 | A | retired | 4 | 4 |
| 4 | B | active | 6 | 6 |
| 5 | A | active | 10 | 10 |

The expected changed population contains records 1 and 2. The threshold applies before the increase, so record 2 legitimately finishes above ten. If the business intended a maximum resulting value of ten, that would be a different transformation and should be agreed separately.

```sql
UPDATE stock_setting
SET reorder_quantity = reorder_quantity + 2
WHERE store_code = 'A'
  AND state = 'active'
  AND reorder_quantity < 10;
```

The sum across the five illustrated records starts at 32 and finishes at 36. That four-unit increase is a useful cross-check, but it does not prove the correct two records changed. The verification must inspect identifiers and expected values as well as the total.

The constants are fixed values for the illustration. An application accepting store codes or quantities from users should bind those values through its database interface rather than build SQL by concatenating input. The selection rule and the safe transport of parameters are separate responsibilities.

## Use a preview as evidence, not as a lock

A read query using the same selection conditions can help reviewers understand the proposed population. Inspect representative rows, counts and relevant totals before accepting a consequential change. A preview can reveal a missing organisation filter or an unexpectedly broad status definition.

However, a preview is an observation at a point in time. Another transaction can alter the population before the update executes. Copying the same condition into both statements does not guarantee that they see the same records or values under every isolation level.

Choose the required concurrency meaning. The operation might intentionally apply to all records qualifying when the update runs. Alternatively, it might apply only to a reviewed set of identifiers whose versions still match. Those are different contracts and require different checking or locking arrangements.

If the reviewed set is materialised, record enough information to detect relevant changes rather than assuming an identifier freezes the record's state. The business may require rejecting a changed item, recalculating it or asking for another review. A preview should make the decision more informed without implying protection it does not provide.

## Give every update source an unambiguous match

An update can derive values from another table, such as an approved list of item settings. Before using that source, establish how many source records can match each target. A target with two conflicting approved values does not have a well-defined result simply because SQL can express the join.

Validate the source's uniqueness at the relevant key. If the source records are independent contributions, aggregate them under an explicit rule before applying the result. If they are competing versions, select the authorised version using a documented ordering and tie-breaking policy.

The [PostgreSQL UPDATE documentation](https://www.postgresql.org/docs/current/sql-update.html) specifically warns about multiple source matches in an update using `FROM`. This is a useful implementation example of a wider design issue: a relationship used to assign one value must not silently provide several incompatible candidates.

Also decide what no match means. It might leave a target unchanged, assign a default, create an exception or make the whole operation invalid. Different query structures can behave differently here. Test the missing-source case rather than reasoning only from the records that match successfully.

## Keep a bulk change distinct from repeated acceptance

A loop that commits after every row can leave a partially completed business operation if it fails halfway. One set-based statement within an appropriate transaction can provide a clearer acceptance boundary for a change that must succeed or fail together.

That does not mean every multi-record operation should use one large transaction. Independent records may legitimately be processed in batches, especially when the population is large and the work is restartable. The crucial point is that batching changes what can become durably complete before a later failure.

Document the atomic unit. If every setting in an approved policy must take effect together, committing batches independently may violate the promise. If each item is independent, a durable progress record and clear per-item outcome may be more useful than keeping a large transaction open.

Do not put user deliberation inside a database transaction merely to connect preview and acceptance. Long waits can hold resources and interfere with other work. Design a review-and-acceptance protocol that checks the relevant state when the decision is actually submitted.

## Decide whether repetition is safe

The illustrated increase is not idempotent: running it again can increase some records again. After the first run, record 1 has quantity 5 and still qualifies; record 2 has quantity 11 and no longer qualifies. A second run produces a different changed population and raises the total again.

This makes blind retry especially misleading. A network failure after acceptance may leave the caller unsure whether the update completed. Repeating the statement because the caller did not receive confirmation can apply another increase to only part of the original population.

A repeatable business operation needs a way to establish whether its effect has already been accepted. Possible designs include a stable operation identifier recorded with the result, a staging table of approved absolute values, or another transactionally protected acceptance record. The appropriate mechanism depends on the workflow.

Assigning an absolute value can be idempotent for the value itself, but associated effects still require attention. An audit event, notification or downstream message might be emitted again on repetition. Define repetition in terms of the whole business operation rather than just the final numeric column.

## Understand what a row count proves

A reported affected-row count is useful operational evidence, but its exact meaning depends on the database and driver. It may describe matched rows or changed rows under particular conditions. Triggers and other behaviours can also affect what the caller observes.

Check the semantics before using a count as an acceptance condition. Two affected rows in the workshop example are expected, but two wrong rows would produce the same count. A correct count cannot substitute for the selected identifiers and resulting values.

Where supported, returning affected identifiers and relevant values can make verification more direct. Keep the returned information proportionate and avoid unnecessarily exposing confidential fields in logs. For large changes, a durable summary plus controlled detailed evidence may be more manageable than returning every column to a client.

Check unaffected records as well. A missing filter can change additional rows whose values happen to remain numerically equal under some transformations. A bulk-change test must also confirm that records outside the agreed population retain their original values.

## Preserve application state and derived data coherently

An application may already hold copies of records that a direct SQL update changes. If it continues using those copies, the screen or later save can work from stale values. A persistence framework's tracked objects do not necessarily refresh themselves because an independent statement ran.

Establish a synchronisation boundary: expire or reload affected objects through supported mechanisms, or avoid mixing the direct operation with an active context that assumes it owns those values. The rule should be visible in the application design, not left to individual developers to remember.

Derived data needs similar attention. A report cache, search index or summary table might depend on the changed field. Determine how those consumers learn about the accepted operation and how long they may legitimately show the previous value.

The article on [what a database management system does](/insights/what-a-database-management-system-does/) explains the database's wider responsibilities. A set-based statement uses those capabilities, but it does not automatically coordinate every cache, user interface and external system surrounding the database.

## Measure operational cost on the actual workload

Removing an application loop can reduce repeated communication and give the optimiser a clearer operation. It is still a workload change that should be measured. A large update can touch many pages, maintain several indexes, generate substantial log volume and contend with other transactions.

Evaluate the selection query, expected changed population and relevant access paths. A selective predicate does not guarantee cheap execution if the database must inspect a large table to find qualifying rows. Conversely, adding indexes solely for one rare update can impose continuing costs on ordinary writes.

Triggers and dependent constraints can dominate the cost even when the update statement looks simple. Include them in the review. A bulk operation that causes one expensive external-style action per row may retain much of the cost the application loop previously exposed.

When batching is appropriate, use stable progress rules. A moving predicate can cause already processed records to re-enter or unprocessed records to be skipped. Decide how the batch identifies accepted work, how it detects completion and what it does when records change during processing.

## Test the intended change against plausible mistakes

Construct a fixture with qualifying records, excluded states, another location, a value at the threshold and a missing value if the schema allows one. These cases reveal different defects. A fixture containing only two qualifying rows provides little evidence about the population boundary.

Test the transformation separately from the selection. For the example, confirm both that records 1 and 2 qualify and that they become 5 and 11. Then confirm records 3, 4 and 5 retain 4, 6 and 10. The total of 36 is an additional reconciliation, not the primary assertion.

Repeat the operation deliberately in a test to expose its non-idempotent behaviour. If the application claims to suppress duplicate acceptance, submit the same operation identifier twice and verify the promised result. Tests should demonstrate the application's recovery contract rather than assume SQL alone provides it.

For updates using another source table, include zero, one and multiple matches. A correct implementation should follow the documented policy for each population. Conflicting source rows should be diagnosed before they can silently determine an arbitrary accepted value.

## Make a bulk change understandable to its owner

A small business approving a data correction needs a concise description of the population, transformation, acceptance boundary and verification. “A script updates the table” is not enough to review. The owner should be able to recognise the included and excluded business records.

Provide a worked example, expected counts where meaningful and a plan for uncertain outcomes. State whether the operation can be repeated and how its completion will be identified. These details are more useful than the number of lines of SQL or a general claim that set-based processing is efficient.

A well-designed set update expresses one clear business change. Its selected population is explicit, its source values are unambiguous and its result is checked at the level of individual meaning as well as totals. That is what makes the operation dependable, whether the database ultimately processes ten records or ten million.

---

*Source basis: original KEVOS® analysis of Updating Is Set-at-a-Time in the supplied Database in Depth. SQL implementation details were checked against the linked PostgreSQL documentation. The stock settings, quantities and acceptance scenarios are illustrative; engine-specific behaviour must be tested in the target environment.*
