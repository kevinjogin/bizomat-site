---
title: "SQL set operations and the meaning of duplicates"
description: "Choose union, intersection and difference by defining record identity and multiplicity, then validate combined datasets without hiding legitimate repeated events."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - quality
  - validation
author: "KEVOS®"
featured: false
draft: false
---

Combining two query results can mean several different things. An analyst may want every event from both sources, one row for each distinct participant, the records appearing in both systems or the records missing from one. These questions require different treatment of repeated values.

SQL set operations provide union, intersection and difference, but their usefulness depends on the columns being compared. Two rows that look identical in a report may represent separate legitimate events. Two rows describing the same business entity may differ in spelling and therefore remain distinct to the database.

Before choosing an operator, define what one row represents and what equality should mean for the question. That decision prevents duplicate removal from becoming an attractive way to conceal an unresolved data problem.

## Distinguish a collection of events from a set of participants

Consider two workshop attendance systems being combined. This is an illustrative example. One records attendance at technical sessions and the other records attendance at induction sessions. A person can attend several sessions and can appear in both systems.

If the question is how many attendance events occurred, each legitimate event matters. If the question is which people attended anything, repeated appearances of one person should collapse to one participant identity. The same source records support both questions, but the result grain differs.

Selecting only a person's name discards the information that distinguishes events. Removing duplicate names may then appear to clean the result while actually deleting valid attendance occurrences. Keeping every name occurrence, on the other hand, does not provide a count of distinct people.

Write the desired result in plain language. “Every recorded attendance event from either source” differs from “Every person with at least one attendance event.” The operator and selected columns should follow that statement.

Preserve the identifiers needed to support the distinction. Event identity, person identity and source identity are not interchangeable. Combining datasets reliably often requires all three during preparation, even if the final report displays only a subset.

## UNION removes duplicate result rows

An ordinary UNION combines compatible query results and removes duplicate rows from the combined output. Equality is evaluated across the columns in the result, using the database's relevant type and comparison rules.

Suppose one input contains participant identifiers A, A and B, while the other contains A and C. UNION produces the distinct identifiers A, B and C. It does not retain a record of how many times A occurred in either input.

This is appropriate for a participant set when those identifiers have a consistent meaning across the sources. It is inappropriate for counting attendance events if the repeated appearances of A represent separate sessions.

The selected columns determine what counts as a duplicate. Adding a source label makes A from the first source different from A from the second. Adding a timestamp may distinguish events that previously collapsed. Removing an identifier can make unrelated records appear equal.

Treat those changes as semantic changes to the result, not cosmetic adjustments. A report author who adds a descriptive column to a UNION query may unintentionally change the number of rows because duplicate comparison now includes that additional value.

## UNION ALL preserves multiplicity

UNION ALL retains the rows from both inputs, including repeated rows. In the A, A, B and A, C example, it returns five occurrences in total, with A appearing three times.

This behaviour suits append-style event combination when every input occurrence is intended to remain. It also avoids requesting duplicate elimination that the query does not need. However, preserving multiplicity does not establish that every occurrence is legitimate.

If the same attendance event was imported into both systems, UNION ALL can count it twice. The correct response is to identify the shared event and apply the agreed event-identity rule, not to assume that every repeated display row is either valid or invalid.

Keep provenance during that assessment. A source-system identifier paired with a source-local event identifier can distinguish independent events whose local numbers happen to match. If a global event identifier exists, use its documented meaning to recognise genuine overlap.

The choice between UNION and UNION ALL is therefore not simply a preference for clean data or fast SQL. It expresses whether multiplicity in the selected representation should be preserved. Data-quality work may still be required before either operator can answer the business question correctly.

Once the semantics are settled, inspect the physical cost. Duplicate elimination may require additional sorting, hashing or other engine-specific work over the compared columns. Wide text projections and large intermediate populations can make that work significant. Reducing the projection is appropriate only if it preserves the identity required by the question. A faster query that collapses distinct attendance events is not an acceptable optimisation, while eliminating unnecessary duplicate removal can improve a correctly defined append operation.

## Intersection asks which represented rows appear in both inputs

INTERSECT returns rows shared by two compatible results, normally with duplicate elimination unless a supported ALL form is requested. For the example inputs, the distinct intersection contains A.

If the inputs project person identifiers, the result identifies participants present in both systems. If they project complete attendance records, it identifies complete rows that match across every selected column. Those are different questions.

A changed address or differently formatted name can prevent a complete-row match even when both records concern the same person. Conversely, two different people with the same name can appear to match if the projection contains only that name.

Use a recognised identity when the question concerns entities. Where identity has not been reconciled across systems, the intersection result is only as reliable as the matching representation. Set operators do not perform entity resolution automatically.

Also distinguish intersection from a join. A join can return several combinations when a key appears multiple times on each side and can expose columns from both sides. A distinct intersection returns common projected rows. Replacing one with the other without examining multiplicity can change the answer substantially.

## Difference is directional

EXCEPT returns represented rows in the first result that are absent from the second, normally removing duplicates unless the engine supports and is asked for an ALL form. Reversing the operands answers the opposite question.

With A, A and B on the left and A and C on the right, the distinct left-minus-right result contains B. The reverse result contains C. Neither result alone describes every discrepancy between the two populations.

For a reconciliation, compute and label both directions when appropriate. Participants present only in the technical-session system differ from participants present only in the induction system. Combining those exceptions without preserving their direction can make follow-up work confusing.

Choose the comparison columns according to the reconciliation purpose. Comparing identifiers finds missing entities. Comparing identifiers and selected attributes can reveal changed values, but a changed record may then appear as one missing old row and one additional new row.

That representation can be useful, provided it is interpreted correctly. It does not mean that two independent people disappeared and appeared. A later step may need to pair the exceptions by stable identity and describe the actual attribute difference.

## Bag differences answer a different reconciliation question

Some databases support ALL variants for intersection and difference, preserving multiplicity according to the operation. These can be useful when the number of occurrences matters rather than only distinct membership.

In the example, A occurs twice on the left and once on the right. A multiplicity-sensitive left difference retains one unmatched A occurrence, as well as B. A distinct difference removes A entirely because it appears at least once on the right.

This distinction matters when reconciling repeated events that lack a unique event identifier. A distinct comparison can declare two result sets equivalent even though one contains an extra occurrence. Comparing grouped counts is another way to make multiplicity differences explicit.

However, a count difference does not identify which particular event is unmatched when several events share the same projected values. The representation may be insufficient for the operational investigation. Preserve event identity whenever it is available.

Verify engine support and exact syntax rather than assuming all SQL systems implement every ALL variant. The conceptual distinction remains useful even where the query must be expressed through grouped counts or another supported construction.

## Compatible types do not guarantee compatible meanings

Set operations generally require the same number of output columns with compatible corresponding types. Compatibility by position does not establish that those columns describe the same concept.

Two numeric fields might contain hours and minutes. Two date fields might represent the session date and the date the record was entered. Two text codes might belong to unrelated classification systems. The query can execute successfully while combining incompatible information.

Create an explicit projection for each source. Align the column order, types, units and definitions before combining results. Avoid relying on SELECT all-columns when source schemas can differ or evolve independently.

Type conversion can also change equality. Rounding a measurement before comparison can collapse distinct values. Converting an identifier to a number can remove meaningful leading zeroes. Standardising text can merge values that the business treats as different.

Document intentional normalisation and retain the original representation where needed for investigation. A combined dataset should make its common meaning clearer, rather than merely forcing its source values into a shape the SQL engine will accept.

## Nulls and text comparison deserve explicit tests

Duplicate elimination and set membership use defined comparison semantics that should not be inferred casually from a WHERE expression. In particular, the treatment of nulls in set operations differs from simply applying ordinary equality predicates that can evaluate to unknown.

Use small tests in the actual engine for the types involved. Include two rows with corresponding null values, rows that differ only in one null position and text values affected by the configured collation. Record the expected result as part of the query's contract.

Do not interpret two missing values being grouped together as evidence that the underlying unknown facts are identical. It is a rule about the representation used by the operation. Business interpretation still needs to acknowledge that the values are missing.

Text comparison may be case-sensitive or insensitive according to the database configuration and expression. Trailing spaces, accents and normalisation can also matter. A reconciliation between systems should not assume that each system applies the same rules.

Where exact source representation matters, compare an appropriately preserved representation rather than a display-normalised label. Where business equivalence matters, define the normalisation deliberately and review its consequences for false matches and missed matches.

## Control composition and ordering explicitly

A query can combine several set operations, but the grouping determines the result. Do not rely on a reader remembering operator precedence when parentheses can state the intended logic clearly.

For example, selecting participants from either of two programmes and then excluding those already certified differs from excluding certified participants from only one programme before combining the results. Both can be expressed with similar-looking SQL.

Name intermediate populations where that improves clarity. A common table expression or view can separate eligible participants, recorded attendance and excluded cases. The final set operation then reads more closely to the business question.

Set combination also does not establish a presentation order. If the output must be sorted, specify the final ordering. Do not assume that rows from the first input will appear before rows from the second, even when UNION ALL preserves their occurrences.

Limits and filters need an explicit scope. Limiting each input before combining them differs from limiting the combined output. Review the placement of these clauses carefully, especially when the query feeds pagination or an export whose completeness matters.

## Validate identity, multiplicity and provenance separately

Build a test dataset containing one row unique to each source, one shared row, repeated occurrences within one source and two legitimate events with identical display values. Add a changed attribute for a shared identity and an identifier collision between source systems.

For each intended result, state the expected identities and occurrence counts. Checking only the number of output rows is insufficient: different mistakes can produce the same count. Compare the actual members and their multiplicities.

Reconcile UNION ALL counts with the sum of its input counts when no additional transformation changes the population. For distinct operations, explain which projected rows collapse and why. A large reduction should have a business explanation rather than being celebrated automatically as cleanup.

Inspect exception rows from both directions of a comparison. Preserve enough provenance to trace them back to the original records. An exception report that loses source identity may identify a problem without giving anyone a practical way to resolve it.

Finally, test the chosen query against a stable population or an explicitly understood snapshot. Comparing two systems while both change can produce timing differences that resemble missing records. The reconciliation should distinguish those timing effects from genuine data discrepancies.

## Choose the operator from the question

Use a distinct union when the required output is a set of represented values from either source. Preserve multiplicity when every occurrence matters. Use intersection for common membership and directional difference for exceptions, always with the appropriate identity and projection.

If the question requires matching imperfect customer records, attributing shared events or selecting a preferred source, perform that work explicitly. Set operations provide precise combination semantics; they do not decide authority or resolve ambiguous identity.

Keep the query's assumptions visible in its definition and supporting documentation. State the row grain, equality basis, multiplicity rule and source scope. Those details make a future change reviewable when a new field or source is added.

The most useful result is not simply one without repeated-looking rows. It is a result in which every retained occurrence and every removed duplicate follows from the business question being answered.

## Source basis and further reading

The set-operator discussion in the source collection's *Designing Effective Database Systems* provides the conceptual foundation. This article uses original attendance examples and separates relational set ideas from the duplicate-preserving behaviour available in SQL.

PostgreSQL documents its supported operations and composition rules in [Combining Queries: UNION, INTERSECT and EXCEPT](https://www.postgresql.org/docs/current/queries-union.html). Syntax and comparison behaviour should be checked in the engine used for the actual reconciliation.
