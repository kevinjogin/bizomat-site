---
title: "SQL NULL and the meaning of missing data"
description: "Understand how missing values affect SQL filters, totals and business decisions, with practical ways to distinguish unknown, absent and inapplicable data."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - quality
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A database report can exclude the very records that need attention without producing an error. A filter for inspections that have not passed may omit inspections with no result. An average delivery time may describe only completed deliveries while the longest delays remain unfinished. Both answers can be technically valid and operationally misleading.

The difficulty begins when a missing value is treated as an ordinary value. In SQL, **NULL** marks missing information. It is not automatically zero, an empty string, a negative answer or proof that something does not exist. Its meaning depends on the column and the process that supplies it.

For analysts and people commissioning business systems, understanding that distinction is more useful than memorising unusual SQL behaviour. The aim is to make uncertainty visible, write queries that answer the intended question, and prevent a convenient default from becoming a false statement about the business.

## Establish what the absence means

Consider a maintenance record with no completion date. The job might still be open. It might have been completed without its paperwork being entered. It might have been cancelled, or imported from a system that did not retain dates. One empty field cannot distinguish these explanations.

The first design question is therefore semantic: what is the permitted meaning of a missing completion date? A useful answer might be that it is absent whenever completion has not been recorded. A separate work status distinguishes open, cancelled and completed work. A completed status without a completion date then becomes an explicit exception to investigate.

This avoids demanding that a timestamp explain the entire workflow. It also avoids inventing a date solely to satisfy a mandatory field. A fictitious date makes the database look complete while weakening every analysis that relies on the sequence of events.

Several different conditions commonly need separation:

| Condition | Example | Information worth retaining |
| --- | --- | --- |
| Unknown | A delivered item's arrival time was not captured | Missing value and reason |
| Not yet known | A job is still in progress | Current process status |
| Not applicable | An electric assembly has no fuel capacity | Applicability or equipment type |
| Withheld | A respondent declined an optional answer | Response status without an invented answer |
| Measured zero | No rejects were found in an inspected batch | The actual value zero |

Not every optional column requires an elaborate status model. Add distinctions when they change a decision, a follow-up action or an interpretation. The [data dictionary guide](/reados/collections/operational-data-records-and-controls/writing-a-data-dictionary/) provides a useful place to record those meanings consistently.

## Understand the third result of a comparison

Ordinary business rules are often expressed as true or false. SQL comparisons involving a missing operand can also produce **unknown**. If a delivery duration is missing, the statement that it exceeds three days cannot be established as either true or false from that record.

A SQL `WHERE` clause keeps rows for which its condition is true. Rows for which the condition is false or unknown are not selected. That matters when someone assumes that reversing a comparison will automatically retrieve every row excluded by the original comparison.

For example, `result = 'pass'` selects recorded passes. The condition `result <> 'pass'` selects recorded non-pass values. Neither selects a row whose result is NULL. The two groups do not exhaust the table unless the result column is guaranteed to be populated.

Use a missing-value test when missing information is part of the question. PostgreSQL documents `IS NULL`, `IS NOT NULL` and comparison predicates that deliberately handle nulls in its [comparison reference](https://www.postgresql.org/docs/current/functions-comparison.html). Check equivalent support in the database used by the application.

This is an illustrative example. An inspection queue has three rows: one recorded pass, one recorded failure and one missing result. A queue for everything requiring review can be expressed as:

```sql
SELECT inspection_id, result
FROM inspection
WHERE result <> 'pass'
   OR result IS NULL;
```

The query includes both the failure and the missing result. Whether those two cases should share the same operational queue is a separate business decision. They should not silently become the same outcome in the underlying data.

## Treat negative questions with particular care

Negative questions are easy to phrase and easy to misinterpret. “Show orders that are not dispatched” could mean orders whose status is explicitly something other than dispatched, all orders without dispatch evidence, or orders that were expected to dispatch but did not. These are different populations.

Before writing the query, state the positive evidence required for inclusion and the treatment of missing evidence. If the question concerns a dispatch event, checking for the absence of a related event may be clearer than comparing a nullable status string.

The same discipline applies to exclusion lists. A query using `NOT IN` can behave unexpectedly when the subquery returns a NULL. A row that has no matching known value may still fail to qualify because comparison with the missing value remains unknown. This is not evidence that the row is actually on the exclusion list.

Where the business question is about whether a matching record exists, a correlated `NOT EXISTS` often states the intended rule more directly. The correlation must still use correctly defined identifiers, and the treatment of missing identifiers must be decided separately. Replacing syntax cannot repair an ambiguous data model.

Include a null-bearing exclusion list in query testing even if production data currently contains none. Otherwise the query can appear reliable until a new import introduces one missing identifier and the output changes dramatically.

## Count the population as well as the observations

Aggregates can hide missingness because they compress many records into a single reassuring number. `COUNT(*)` counts rows. `COUNT(column)` counts rows with a non-null value in that column. These are deliberately different measures.

This is an illustrative example. Five jobs have recorded completion durations of 2, 4, NULL, 0 and NULL days. The row count is five, the count of recorded durations is three, and their sum is six days. The average of the recorded durations is two days: six divided by three.

Replacing both missing durations with zero changes the average to 1.2 days. That calculation is arithmetically correct for the substituted dataset, but the substitution asserts that the two unknown durations were zero. Unless that assertion is justified, the apparently better result is an artefact of data handling.

A more informative report presents the average alongside coverage: three of five jobs have a recorded duration. It may also show the two missing records as an action list. Readers can then see both the performance measure and how much of the intended population it represents.

Even full coverage of completed jobs may not answer the wider question. An average that excludes work still in progress can understate current delays. Include an ageing view of unfinished work when the operational decision concerns the whole queue, while keeping completed duration and current age as separate measures.

## Distinguish an empty group from a zero total

An aggregate over no qualifying observations deserves explicit interpretation. No recorded reject quantity might mean no inspection occurred, no records matched a date filter, or an inspection took place and found zero rejects. Those situations should not automatically produce the same dashboard message.

Many SQL aggregates return NULL when there are no input values, while a count returns zero. A display expression can replace a missing total with zero, but that presentation choice should follow the measure definition. It should not happen merely because a charting tool prefers numbers.

For inspection reporting, retain counts of batches inspected and units inspected alongside reject quantities. A reject count of zero with an inspected population of zero provides no evidence about production quality. The denominator is part of the result.

Similarly, a sales total of zero for a branch can be valid if the branch operated and recorded no sales. If the branch's data feed failed, presenting zero without a freshness warning misrepresents a collection failure as business performance. Missingness can originate upstream of the SQL table itself.

## Use defaults as statements of meaning

The SQL expression `COALESCE(value, fallback)` is useful when a well-defined fallback exists. Its danger is that it is easy to insert before deciding what the fallback claims.

For an optional middle name, displaying an empty string might be a sensible formatting choice. For an unknown component weight, substituting zero changes a physical quantity. If that weight feeds packaging, freight or handling calculations, the consequences extend beyond a tidy report.

Keep the original value accessible even when a report needs a display substitute. A dashboard can show “not recorded” while exporting a genuine missing value plus a status column. This preserves the distinction for later analysis and avoids forcing every downstream user to reverse-engineer a display convention.

Sentinel values such as minus one, a far-future date or a generic text label can create similar problems. They may fall inside legitimate sort orders, arithmetic or date ranges. If a legacy system requires them, translate them at a documented boundary and preserve the mapping rather than treating them as ordinary observations.

Do not replace NULL with a fabricated value merely to improve a completeness percentage. Completeness measures are useful only when the populated values carry the intended information.

## Keep outer joins understandable

An outer join introduces another source of missing values: there may be no related row. A left join from jobs to completion records can produce a missing completion date because no completion record exists, or because a completion record exists with its date missing.

Those cases can require different action. The first might need workflow follow-up; the second might need correction of incomplete paperwork. Select the related table's non-nullable primary key as well as its optional date to distinguish them reliably.

Filtering the optional side of an outer join in the `WHERE` clause can also remove unmatched rows. If the purpose is to retain all jobs and attach qualifying completion information where available, the placement of conditions matters. Write down the intended population before changing the join.

A practical review method is to include four test cases: a parent with no child, a parent with a populated child, a parent with a child containing NULL, and a parent with multiple children. Check the output row count and the meaning of every displayed blank. This reveals several errors that a realistic-looking sample of complete records will miss.

## Enforce requirements at the right stage

A field may be optional while work is being prepared and mandatory when a record reaches a later state. Requiring every field at initial creation can encourage staff to enter placeholders. Allowing every field to remain optional forever can leave completed work impossible to interpret.

Specify the lifecycle rule directly. A draft inspection may have no outcome. A released inspection must have an outcome and the required supporting information. The application should explain the requirement at the transition, while database controls protect invariants that must apply across all write paths.

Be precise about what each control guarantees. A non-null constraint establishes presence, not correctness. A recorded value can still use the wrong unit, refer to the wrong job or represent an unapproved result. Combine presence requirements with domain checks and referential integrity where appropriate.

Likewise, a check on a numerical range may not by itself prohibit NULL. Review the database's actual constraint semantics and pair rules deliberately. Validation should be assessed as a whole rather than by counting the number of checks attached to a form.

## Trace missing values through imports and exports

Missing information often changes meaning during data transfer. A spreadsheet blank, a CSV empty field, the literal text `NULL` and a JSON null value are not universally interchangeable. An importer may convert one to an empty string, another to a database NULL and another to a validation failure.

Define the mapping for each important field and test it in both directions. Include actual zero values and whitespace-only text in the sample. Otherwise a cleaning step may remove legitimate zeros or preserve meaningless spaces as apparently complete answers.

Date fields deserve special attention because spreadsheet serial values and display formatting can obscure what was actually supplied. Test how missing dates travel through the full process, including exports sent back to users. A visually blank cell is not sufficient evidence that the underlying representation survived.

Keep rejected rows and reasons available to the responsible team. A pipeline that silently discards incomplete records can make the remaining data appear better while reducing coverage. Reconciliation should account for accepted, rejected and intentionally excluded records.

## Build a small acceptance dataset

The most effective test data is designed around decisions. For an inspection report, include pass, fail, missing result, cancelled inspection, no inspection record and multiple attempts. State the expected inclusion, displayed label and contribution to each measure before running the query.

Check whether an unknown value should trigger a follow-up, remain outside a calculation or prevent a release. These outcomes can differ by field and stage. There is no universal policy that all nulls should be rejected or all missing data should be ignored.

For numerical summaries, independently calculate the numerator, denominator and coverage. Do this with a few rows small enough to inspect manually. Then test larger representative data for performance without losing the original correctness cases.

Repeat the checks when a report definition changes, when a new data source is connected, or when a previously required field becomes optional. A query can remain syntactically valid while its assumptions cease to hold.

## Make uncertainty useful to the business

For a small Australian manufacturer or service business, the practical outcome is a manageable set of clear conventions. Name the states that matter, define missingness in the data dictionary, and show coverage beside measures used to make decisions.

Assign ownership of exceptions. A missing arrival timestamp may belong with receiving; an unknown supplier code may belong with purchasing; an incomplete inspection result may require quality review. An undifferentiated list of blanks rarely leads to effective correction.

Prioritise fields according to their consequences. Correcting a missing optional description has different value from resolving an unknown quantity in a stock movement. This keeps data-quality work connected to operational risk instead of pursuing superficial perfection.

NULL becomes much less troublesome when it represents an intentional, understood state. The reliable report does not conceal what is unknown. It explains which observations support its answer, which records remain unresolved, and what action would improve the evidence.

---

*Source: the supplied Database Management Systems, second edition, particularly section 5.6 on null values and the adjacent treatment of aggregates; PostgreSQL documentation linked above. All business examples and figures are original illustrations. SQL behaviour should be checked against the product and version in use.*
