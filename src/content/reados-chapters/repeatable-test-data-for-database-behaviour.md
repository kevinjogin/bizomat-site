---
title: "Building repeatable test data for database behaviour"
description: "How to create small, controlled database fixtures that expose incorrect joins, missing constraints and migration errors without depending on shared or confidential production data."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - experimentation
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

A database test can pass because the data happens to be convenient. Every customer has one order, every name is different and every optional relationship is populated. A broken join or missing constraint remains invisible because the test never creates the situation that would expose it.

Repeatable test data is deliberately constructed evidence. A **fixture** supplies a known starting state for a test: the records, relationships and configuration needed to exercise a particular behaviour. It should make the expected result understandable and let the same behaviour be checked independently of yesterday's test run.

The goal is not to reproduce an entire business in miniature. It is to create enough variation to distinguish correct behaviour from plausible mistakes, then keep that evidence usable as the schema and application evolve.

## Begin with the claim the test must establish

Write the claim before creating rows. “The report returns orders with no accepted shipment” describes a behaviour. “The report executes without error” is a weaker claim that could pass even if it returns every order or none.

Identify the relevant boundary conditions. The unshipped-order report needs an order with no shipment, one with an accepted shipment and perhaps one with a cancelled shipment. If cancelled shipments do not count, the fixture must make that distinction observable.

Include records that should remain unaffected. A test of one customer's update should include another customer with a similar name or matching local reference. Otherwise an update missing its customer filter can accidentally pass because there is only one eligible record in the database.

Keep the expected result explicit. List the identifiers that should appear, the values that should change and the relationships that must remain intact. These expectations provide a stronger explanation of correctness than a broad assertion that the operation returned something.

## Use small datasets with deliberate contrasts

A small fixture is easier to inspect, but small should not mean uniform. Give records different quantities and different relationship patterns so that a swapped association or duplicated row changes the expected result visibly.

For example, quantities 4 and 9 reveal more than two quantities of 5 when the test concerns which line belongs to which order. Equal values can conceal a mistaken join. Similarly, two customers sharing a display name can expose code that matches by name when it should use identity.

Avoid adding irrelevant fields solely to make the data look realistic. Every extra dependency increases setup work and creates another reason a test can fail before reaching the behaviour it was designed to check. Provide valid defaults for unrelated requirements, while making the important differences obvious.

Document why unusual rows exist. A record labelled “second order for same customer” communicates its purpose better than an unexplained long identifier. The database may still use ordinary numeric keys; the test description can explain the role of each row without embedding production names.

## Work through a query fixture

This is an illustrative example. A workshop wants a report of work orders that have no accepted dispatch. A cancelled dispatch does not count as accepted. The fixture contains four orders and three dispatch records.

| Order | Dispatch state | Should appear as awaiting accepted dispatch |
|---|---|---|
| 101 | No dispatch | Yes |
| 102 | One accepted dispatch | No |
| 103 | One cancelled dispatch | Yes |
| 104 | One accepted dispatch | No |

Orders 101 and 103 are the expected result. A query that checks for any dispatch would incorrectly exclude 103. A query using an inner join would lose 101. A fixture containing only order 102 would reveal neither problem clearly.

```figure
type: compare
title: Four orders that catch two different bugs
cols: Dispatch state | Expected
caption: Expect exactly [101, 103]; "any dispatch" wrongly drops 103, and an inner join loses 101.
- *Order 101 | None | Appears
- Order 102 | One accepted | Excluded
- *Order 103 | One cancelled | Appears
- Order 104 | One accepted, then a second | Excluded, not duplicated
```

The following query expresses the assumed rule. It uses an existence test so that the question is whether an accepted dispatch exists, rather than how many joined rows happen to be returned.

```sql
SELECT o.order_id
FROM work_order AS o
WHERE NOT EXISTS (
    SELECT 1
    FROM dispatch AS d
    WHERE d.order_id = o.order_id
      AND d.state = 'accepted'
)
ORDER BY o.order_id;
```

The test should compare the returned identifiers with `[101, 103]`, not merely assert that two rows were returned. The wrong pair could also contain two rows. The explicit ordering makes a sequence comparison meaningful; without an ordering requirement, compare the intended set instead.

Then add a second accepted dispatch for order 104. The expected result should remain unchanged. That extra case establishes that multiple matches do not duplicate the report's orders or change the exclusion rule.

## Separate fixture setup from expected outcomes

Setup data describes the world before the operation. Expected data describes the relevant result afterwards. Keeping those roles distinct helps reviewers see whether the test is actually checking a change rather than recreating the same value on both sides of an assertion.

Do not calculate the expected answer by calling the same helper or query being tested. If both paths contain the same mistake, the test can agree with itself while being wrong. Work out a small expected answer independently from the stated business rule.

The [DbUnit getting-started guide](https://www.dbunit.org/howto.html) illustrates the distinction through dataset setup and comparisons against expected table contents. The underlying principle is useful regardless of test framework: establish a known starting state, perform the operation, and compare meaningful results with an independently specified expectation.

Choose the comparison scope carefully. Comparing an entire database can make tests fragile when unrelated data changes. Comparing only one total can miss damaged relationships. Assert the records and fields that express the operation's promises, including important records that must not change.

## Test rejection as carefully as acceptance

A constraint test needs to demonstrate that invalid data is rejected for the intended reason. If an insert fails because its parent is missing, it does not prove that a separate quantity constraint works. Arrange the unrelated prerequisites so that the target rule is the one being exercised.

Test both sides of a boundary. A positive-quantity rule needs a valid positive value and invalid zero or negative values under the agreed domain. An optional relationship needs a permitted missing reference and a rejected reference to a nonexistent record, if that is the intended behaviour.

After a rejected operation, inspect the remaining state. A failure should not leave partially accepted records if the business operation promises atomicity. For operations that deliberately accept some rows and reject others, verify the accepted and rejected sets separately and confirm the outcome is reported accurately.

Also test that valid exceptions remain possible. Overly restrictive constraints can pass every rejection test while preventing legitimate work. A fixture should include the uncommon but valid case that motivated the rule's scope, such as repeated local line numbers under different orders.

## Control state between test runs

A repeatable test should not depend on the order in which other tests execute. If one test creates a customer that another silently expects, running the second test alone can fail. Worse, the dependency can conceal missing setup and make failures difficult to reproduce.

Choose an isolation strategy suited to the environment. Some tests can start from a fresh database or schema. Others can load a controlled dataset and remove it afterwards. Transaction rollback can be useful when the behaviour under test stays inside that transaction and no independent process must observe a committed result.

Do not assume rollback contains everything. A background worker using another connection, an external message or a database feature with different transactional semantics may outlive the test's transaction. Tests of commit visibility need a different arrangement from tests of a simple calculation within one connection.

Give parallel tests separate namespaces or other reliable isolation. Prefixing a customer name is not enough if both tests update the same global sequence, configuration row or shared queue. Identify all shared state that can influence the outcome, including state outside the database itself.

## Make identifiers and clocks predictable where needed

Generated identifiers are useful in real applications, but tests should not assume that the next identifier is always one. Previous inserts, rolled-back attempts or engine-specific sequence behaviour can make that assumption false without indicating a business defect.

Capture generated keys and use them to connect fixture records, or use explicit fixture identifiers where the schema permits it. Assert relationships rather than the incidental numeric value assigned by the database unless that value is itself part of the contract.

Time-dependent tests need a similarly explicit approach. A test that passes until midnight or changes with the machine's local time zone is not reliable evidence. Specify the event times, effective dates and current-time boundary required by the test, and control the relevant clock through supported application mechanisms where possible.

Keep the distinction between fixed test time and database time visible. If a trigger reads the database server's clock, changing an application clock may not affect it. Test the actual source of time used by the behaviour rather than assuming all parts of the system consult the same value.

## Exercise migrations from meaningful starting versions

A migration test begins with an earlier schema and its data, applies the change, and checks the resulting meaning. Starting directly from the final schema only proves that the final schema can hold the desired records; it does not prove that existing records reach that state correctly.

Use representative old values, including nulls, discontinued codes and relationships that need mapping. If two old codes consolidate into one new code, check that the right records are retained and that any required distinctions are preserved elsewhere.

A useful migration fixture also includes records the migration should leave untouched. Compare their identities and relevant values after the change. Equal row counts do not establish that the same records survived or that child references still point to the intended parents.

Test failure and restart behaviour when the migration is designed to support it. Distinguish a rerunnable data correction from a one-time schema statement. The test should establish the specific recovery promise, not impose a universal requirement that every database operation can be repeated unchanged.

## Keep behavioural tests close to the real database

A lightweight substitute can be useful for fast tests of application logic. It cannot prove behaviour that depends on a different production database's transaction isolation, collation, constraint timing, SQL dialect or query planner.

Use the actual database technology and relevant configuration for tests whose claims depend on those features. A query accepted by one engine may mean something different in another. A constraint declared in the schema may be disabled in the test connection, making an apparently successful negative test meaningless.

Record configuration assumptions alongside the fixture. These can include time zone, text comparison rules, enabled extensions and required permissions. The goal is not to duplicate every operational setting blindly, but to identify the settings that affect the behaviour being asserted.

Separate semantic tests from performance experiments. A tiny fixture can prove which rows should be returned; it cannot establish that the query meets a response-time target on millions of unevenly distributed records. Performance work needs a different dataset and explicit workload assumptions.

## Treat concurrency as a controlled sequence

Some failures require two operations to overlap. A single-connection fixture cannot establish that two users cannot reserve the same final item or overwrite each other's changes. The test needs independent sessions and a defined sequence of events.

Use coordination points to control when each session reads, writes and commits. Arbitrary pauses are a weak substitute because machine load changes timing. A useful test can explain the intended interleaving and the acceptable outcomes under the chosen concurrency policy.

The initial data should make a conflict observable. If stock is abundant, two reservations can both succeed without testing the scarce-stock rule. If the fixture contains exactly the contested quantity, the expected rejection, retry or serialised outcome becomes clear.

Check final persisted state and both callers' results. One caller reporting failure does not prove its changes were absent, and a correct final total does not prove each user received the correct response. Concurrency evidence must connect the database outcome with the business operation experienced by each participant.

## Prefer synthetic data with a clear purpose

Production copies often contain more information than a behaviour test needs. They can introduce confidential material, unpredictable dependencies and accidental reliance on particular real records. Synthetic fixtures make the test's intention easier to review and reduce unnecessary exposure.

If a production defect requires reproducing a specific shape of data, preserve the shape without copying identifying content wherever possible. The important property may be a repeated code, an unusual character, a long relationship chain or a missing reference, rather than the actual customer involved.

Keep representative text varied enough to test real handling: apostrophes, non-ASCII characters, empty values where permitted and strings at relevant length boundaries. A dataset containing only short alphabetic names can give false confidence about imports and search behaviour.

Review fixtures as maintained project assets. When business rules change, decide which expected results should change and why. Do not replace failing expected outputs automatically with the new actual output. A failure may be the evidence that the test was created to preserve.

## Make failures useful to the next person

A test failure should identify the claim that failed, the relevant records and the difference from the expected result. “Expected orders 101 and 103; received 101” points directly to the cancelled-dispatch rule. A generic database comparison failure may require substantial reconstruction before anyone understands it.

```figure
type: checklist
title: Test data that proves something
caption: Synthetic data with a clear purpose beats a copy of production.
- x Start from the claim the test must establish
- x Use deliberate contrasts, such as 4 and 9, not 5 and 5
- x Test rejection as carefully as acceptance
- x Control state, identifiers and clocks
- *x Report the claim, the records and the difference
```

For a small Australian business commissioning software changes, ask for a few readable acceptance fixtures around the most consequential workflows. They can cover order acceptance, stock movement or historical report classification without becoming a large testing programme immediately.

The article on [writing a data dictionary](/reados/collections/operational-data-records-and-controls/writing-a-data-dictionary/) explains how to record field meaning. Fixtures add executable examples of that meaning. Together, definitions and tests make it easier to tell whether a future change preserves the business behaviour that users rely on.

Good test data is intentionally ordinary in some places and deliberately awkward in others. It is small enough to explain, varied enough to reveal mistakes and isolated enough to run again. Its value lies in the incorrect behaviours it can distinguish, not in the number of rows it contains.

---

*Source basis: original BIZOMAT analysis of database regression testing, migration validation and environment setup in the supplied Refactoring Databases: Evolutionary Database Design. The linked DbUnit documentation supports the setup-versus-expected-data distinction. The query fixture and all business records are illustrative.*
