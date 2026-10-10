---
title: "Tracing report figures through data lineage"
description: "How to trace a reported number through source records, transformations and loading runs, investigate disagreements and assess the impact of changing a data definition."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - quality
  - communication
author: "KEVOS"
featured: false
draft: false
---

Two reports show different totals for the same week. Both use a column called completed quantity, both refresh overnight and both are considered official by somebody in the business. Comparing the final numbers does not explain the disagreement because the definitions, filters and source paths behind them are hidden.

Data lineage records how information moves from its origins through transformations to its uses. It can connect a dashboard measure to source tables, processing steps, specific loading runs and the business rules applied along the way. The useful outcome is an explanation that can be checked, not merely a diagram full of arrows.

A small organisation can begin with one important report and a concise record of its dependencies. The challenge is to capture enough detail to answer a real question, keep that detail current and distinguish an intended data path from evidence of what actually happened during a particular run.

## Start with a decision and a disputed measure

Choose a report that supports an identifiable decision. A weekly production-completion figure may inform scheduling, while an outstanding-order figure may guide customer follow-up. Knowing the decision helps establish which errors, delays and definition changes would matter.

Write a plain-language definition of the selected measure. State its population, time boundary, unit, exclusions and treatment of corrections. “Completed quantity” might mean units reported by an operator, units accepted by inspection or units transferred into finished stock. Those are different measures even when they sometimes produce the same number.

Identify the report owner and the people responsible for its inputs. Ownership does not mean one person must understand every query. It means there is a clear route for approving the definition and resolving disagreements between business meaning and technical implementation.

Begin narrowly enough to finish. Mapping one decision-critical figure through its real dependencies is more useful than collecting the names of every database without explaining how any number is produced. The first trace also reveals which metadata can be captured automatically and which requires discussion.

## Distinguish definitions, structures and executions

Business metadata explains what information means. Technical metadata identifies tables, columns, files and types. Process metadata describes filters, joins, calculations and schedules. Execution evidence records which process ran, against which inputs, with what result.

These categories need to be linked. Knowing that a report reads `production_summary` is insufficient if nobody can explain how that table is populated. Knowing the formula is insufficient if the relevant source file was missing during the latest run.

The [OpenLineage object model](https://openlineage.io/docs/spec/object-model/) offers one formal example, distinguishing datasets, jobs and individual runs, with events supporting both design information and runtime observations. A business does not need to adopt that tooling to benefit from the distinction between a defined process and a particular execution.

Keep the record understandable to its audience. Operational staff need the business meaning and exception policy. Maintainers need precise identifiers and transformation details. A useful lineage record connects these views instead of forcing everyone to interpret raw SQL or a vague process diagram.

## Trace backward from the published result

Start with the exact report field and identify the data it reads. Follow each dependency until reaching an authoritative source or an explicitly recognised external input. Record where the trace stops and why. An unexplained spreadsheet should be visible as a dependency, not omitted because it sits outside the main database.

At each step, ask what changes. A process may filter rejected records, combine several sources, translate codes, convert units, allocate values or aggregate detail. The transformation matters because it changes the relationship between the output and its inputs.

Record the grain of each intermediate result: what one row represents. A join between job lines and inspection events can multiply records if several inspection events belong to one line. A diagram showing a connection between the tables does not reveal that multiplicity without the row meaning.

Include manual decisions. If a supervisor reviews an exception file and chooses which records enter the summary, that review is part of the lineage. Describe the evidence retained and how the accepted decision is associated with the relevant reporting run.

## Work through a traceable quantity example

This is an illustrative example. A production source contains 120 completion records for a week. Ten are marked as training records and excluded. Five more are rejected because their unit of measure is unresolved. The remaining 105 records are accepted for the report's stated population.

The accepted records contain quantities totalling 840 units. A second report includes training activity and therefore shows a larger total. A third report counts records rather than summing units and shows 105. All three differences can be investigated only if the population and operation are visible.

| Stage | Evidence retained | Question it answers |
|---|---|---|
| Source extract | Source identity, period and 120-record count | What arrived for this run? |
| Training exclusion | Ten excluded record identities and rule | Which records were outside the report's scope? |
| Unit validation | Five rejected identities and reasons | What could not yet be interpreted? |
| Accepted detail | 105 record identities and quantities | Which records contributed? |
| Aggregation | Sum rule and 840-unit result | How was the displayed quantity calculated? |

The counts reconcile: 120 equals ten plus five plus 105. That reconciliation does not prove the accepted quantities are correct, but it establishes that every source record has an explained destination. Additional checks must validate units, duplicate handling and the meaning of the summed quantity.

The rejected five records should not disappear from attention. If they are corrected later, the lineage needs to show whether the week was restated, a correction was carried forward or the original report remained frozen. Otherwise, the total can change without an explanation.

## Capture the transformation that actually matters

An output column may depend directly on one input column, or on several values and conditions. A net amount might depend on gross amount, discount and an exclusion rule. A category may be assigned through a reference mapping that changes over time.

Record the business expression alongside the technical implementation reference. For example, “include accepted production events in the workshop's reporting week, excluding training” provides context that a filename cannot. A versioned query or program reference identifies how that rule was implemented for the run.

Do not assume a column-level arrow proves semantic equivalence. A quantity copied from a source may be converted from packs to individual units. A date may be shifted to a business timezone. A code may be mapped from a supplier's vocabulary to an internal classification. The transformation belongs in the record.

Conversely, avoid documenting every harmless technical detail at the same prominence. A temporary file used by a processing library may be less important than the filter that excludes cancelled jobs. Capture detail in layers so the explanation remains usable while technical evidence is available when needed.

## Identify data sets beyond their display names

Names can collide. A test database and a production database may both contain a table named orders. Two suppliers may deliver a file called weekly.csv. A lineage record needs enough context to distinguish these sources reliably.

Use stable identifiers or qualified names appropriate to the environment. Record the system, environment, dataset and version or partition when relevant. An exported file can also have a content hash to identify the exact received bytes, provided the organisation retains the related evidence responsibly.

A hash establishes identity of content, not correctness or authority. The wrong file can have a perfectly valid hash. Link it to the expected source, period and acceptance checks rather than treating the hash as proof that the data is trustworthy.

Avoid including credentials or confidential connection strings in metadata. A source can be identified without exposing the password used to access it. Lineage is documentation of dependencies, not a repository for secrets.

## Record runs as individual events

A nightly job definition describes recurring work. Monday's successful run and Tuesday's failed run are different executions of that work. Give each run an identifier and record its input scope, implementation version, start, completion status and output identity where practical.

Record dependencies on earlier runs. If a report refresh succeeds using yesterday's staging table because today's source load failed, its own success status does not make the data current. The lineage should reveal which accepted input version the successful report actually used.

Keep scheduled time distinct from execution time where that matters. A delayed run may still be intended to produce the previous business day's observation. Using the start time as the reporting date can assign valid data to the wrong period.

Partial completion needs an explicit state. A job that processes three of four source files should not issue the same completion signal as one that processed all four unless the contract specifically permits a partial output. Downstream users need to know what was accepted, not merely that a process stopped running.

## Use lineage to investigate disagreements systematically

When two figures differ, first compare their definitions and populations. Check the business period, timezone, units, inclusion rules and correction policy. If these differ intentionally, the problem may be misleading labels rather than faulty data.

Next compare the accepted input versions and run status. One report may have refreshed after a late correction while the other still uses an earlier snapshot. This is a freshness difference that should be explainable through execution evidence.

Then compare intermediate counts and totals. Find the earliest stage at which the paths diverge. A difference appearing after a join suggests a different investigation from one already present in the source extract. Working backward from the final number without these checkpoints can turn troubleshooting into guesswork.

Record the resolution. If the discrepancy exposes a valid difference in meaning, update the labels and definitions. If it exposes a defect, link the correction to the affected outputs and decide whether previously issued reports need revision. The investigation should improve the lineage record, not vanish into an email thread.

## Assess change impact before editing a source

Lineage also works forward. Before changing a column's meaning, unit or accepted values, identify the reports and transformations that depend on it. A seemingly local change can affect a dashboard, an export and a manually maintained workbook through different routes.

Distinguish structural compatibility from semantic compatibility. Keeping the same column name and numeric type does not make a change from packs to individual units safe. A technical schema check may pass while every downstream total changes meaning.

Review the affected owners and tests before release. Decide whether a new field, an effective-dated mapping or a versioned output is needed. Do not automatically preserve an old definition forever, but make the transition visible enough that consumers can adapt deliberately.

The related article on [writing a data dictionary](/insights/writing-a-data-dictionary/) explains how to define fields. Lineage adds the connections that show where those definitions are implemented and which decisions depend on them.

## Choose useful granularity without collecting everything

Dataset-level lineage can be enough to identify which source feeds a report. Column-level lineage helps explain particular measures. Row-level provenance can support detailed tracing of individual contributions, but it may require more storage and can expose sensitive relationships.

Choose granularity from the questions the business must answer. If a report needs a weekly reconciliation and occasional investigation, retaining accepted source identities and transformation versions may be sufficient. Do not build an elaborate record of every intermediate value without a clear operational use.

Automatic extraction has limits. A tool can often identify tables referenced by a query but may struggle with dynamic SQL, manual edits or externally supplied logic. Mark uncertain or inferred connections instead of displaying them as observed facts.

Manual documentation has limits too. It becomes stale unless updates are part of normal change work. Combining generated technical dependencies with reviewed business definitions can reduce maintenance effort while keeping the important meanings explicit.

## Protect the metadata itself

Lineage can reveal which systems contain sensitive information, how customer records are linked or which reports support commercial decisions. Access should reflect that sensitivity. A public diagram of every internal data path is not a prerequisite for a useful internal record.

Avoid copying source values when identifiers and definitions are enough. An exception record may need a source key and reason code rather than the full customer record. Retention should support the agreed investigation and reproducibility needs without accumulating unnecessary copies of confidential data.

Treat links to source code and storage locations carefully. They should help authorised maintainers find evidence, while credentials remain managed through the appropriate system. Review exports from a metadata tool before sharing them outside the organisation.

Good lineage improves accountability without requiring unrestricted visibility. Different users can receive a business explanation, a technical trace or detailed source evidence according to their role and the task they need to perform.

## Make maintenance part of the reporting workflow

Add a small lineage review to report changes. Confirm the definition, dependencies, implementation reference and execution checks whenever a material transformation changes. The person approving the business measure should be able to see what changed in ordinary language.

Test the record by asking a colleague to trace one reported value without relying on the original author's memory. Note where they lose the path or encounter an unexplained term. That exercise provides a practical measure of whether the documentation is usable.

For a small business, a versioned document and a modest run log may be an effective start. A dedicated metadata platform becomes useful when the number of systems and dependencies makes manual maintenance unreliable. The underlying questions remain the same regardless of the tool.

## Build confidence through explanations that can be checked

The purpose of lineage is not to declare a number correct because it appears on a diagram. It is to make the number's origin, interpretation and processing history available for examination. That supports correction as much as confidence.

Start with one important measure, trace its dependencies and retain evidence of each accepted run. Reconcile populations, document transformations and keep the owners of business definitions involved. Expand the coverage as the organisation encounters other decisions that need the same clarity.

A report becomes more trustworthy when a reasonable question leads to a checkable explanation. Data lineage provides the route from the displayed figure to that explanation, including the limitations and unresolved exceptions that a final total alone cannot show.

---

*Source basis: original KEVOS editorial explanation drawing on Metadata Categories and Metadata Sources in the supplied Data Strategy (2005). The linked OpenLineage specification verifies the distinction between datasets, jobs and runs. The production example and all quantities are hypothetical.*
