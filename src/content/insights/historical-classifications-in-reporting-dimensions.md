---
title: "Preserving historical classifications in reporting dimensions"
description: "How to report by the classifications that applied when an event happened, distinguish corrections from changes, and assign late records to the right dimension version."
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

A sales report can change even when no sales transactions change. If a customer moves from one region to another and the reporting system overwrites the customer's region, earlier sales may appear under the new region. The grand total remains correct, yet the historical breakdown tells a different story.

This is a problem of classification through time. Reports combine measured events with descriptive information such as product group, customer segment, territory or responsible department. That description can change independently of the events it helps explain. A reliable report must say which version of the description it uses.

Dimension versioning provides a structured way to make that choice. Its purpose is not to preserve every field forever. It is to keep the particular changes needed to answer a defined reporting question, while making corrections, delayed information and current classifications distinguishable.

## Separate the measured event from its description

In dimensional modelling, a **fact** records a measurement or event at a defined level of detail. A sale line might record a quantity and an amount for a particular product, customer and event time. A **dimension** supplies descriptions used to filter or group those facts.

The customer dimension might include a business identifier, segment and sales region. The product dimension might include a category and responsible product group. These are useful reporting descriptions, but they are not necessarily permanent properties of the underlying business entity.

Start by defining the fact's grain: exactly what one fact row represents. A shipment line and a monthly customer balance have different time meanings. The appropriate classification time must follow the reporting question for that grain rather than whichever timestamp happens to be easiest to access.

For example, grouping a shipment by the customer's region when the order was accepted answers a different question from grouping it by region at dispatch. Neither choice can be inferred from the existence of a column named `date`. Write down the intended event and the business reason for choosing it.

## Choose the historical question before the storage pattern

Three questions commonly get confused: what belonged to each region when the activity occurred; what the same historical activity looks like under today's regions; and what a previously issued report actually showed. These can produce different results while using the same underlying transactions.

Reporting by the classification at event time requires access to the relevant historical description. Reporting under today's classification requires a deliberate mapping to the current description. Reproducing a previously issued report may also require its data cut-off, correction policy and calculation version.

Versioned dimensions mainly address the first of these needs. They do not automatically provide a complete record of every report ever issued. A historical classification can itself be corrected later, and a newly received transaction can change a report for an earlier period.

Make the selected interpretation visible in the report definition. Labels such as “region at shipment” and “current customer region” communicate more than an unexplained “region” filter. If both views are useful, provide both with clear names rather than making one quietly substitute for the other.

## Understand the main change treatments

An overwrite treatment replaces the old description. It is often called **Type 1** in dimensional modelling. It is appropriate when the agreed requirement is to use the corrected or current description for all associated facts. It does not preserve the overwritten value by itself.

A version-row treatment, commonly called **Type 2**, creates another dimension row for the same business entity and gives that version its own technical key. Facts can then refer to the version relevant to their event. The [Kimball Group's Type 2 description](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/type-2/) confirms this distinction between a durable business identity and separate dimension-version identities.

A limited previous-value treatment stores selected earlier and current values alongside each other. It may answer a narrow comparison, but it cannot represent an unrestricted sequence of changes. Once several changes matter, a fixed previous-value column is not equivalent to a full version history.

These treatments can coexist across attributes when the rules are explicit. A corrected spelling may be overwritten across the appropriate versions, while region changes create new versions. The design should explain which attributes trigger a version and which are maintained under a correction policy.

## Work through a regional reassignment

This is an illustrative example. Customer C17 belongs to North before the start of day 10 and South from the start of day 10 onward. A reporting dimension uses one version for each period. The example assumes that region at the sale event is the classification required.

| Version key | Customer identity | Region | Effective interval |
|---|---|---|---|
| 701 | C17 | North | Before day 10 |
| 702 | C17 | South | Day 10 onward |

Suppose a sale of 120 units occurs on day 8 and another sale of 80 units occurs on day 12. The first fact refers to version 701; the second refers to version 702. Historical regional reporting assigns 120 units to North and 80 to South, for a total of 200.

If the only customer row were overwritten to South, both sales would appear in South. The total would still be 200, so a grand-total reconciliation alone would not reveal the error. The necessary check is the distribution of facts across classification versions.

A report intentionally grouped by current region would put all 200 units in South. That is a valid alternative question, provided it is labelled accordingly. It should not overwrite the version references needed by historical reporting just because the current view is also useful.

## Keep business identity separate from version identity

Customer C17 remains the same customer across both versions. The version keys 701 and 702 identify different descriptions of that customer. Treating those keys as customer counts can therefore overstate the number of distinct customers.

Reports counting business entities should use the durable identity appropriate to that question. Reports joining event facts to their historical description should use the version reference or a correctly defined temporal lookup. The two identifiers serve different purposes and should be named accordingly.

Avoid reusing version keys. An earlier fact must not start pointing to a later description because an identifier was recycled. Similarly, updating a historical row's region as if it were an ordinary current-state record can silently move every fact that refers to that version.

The dimension key is not a replacement for the source identity. Keep enough provenance to map incoming records to the correct customer, distinguish source systems and investigate merges. Two source systems using the number 17 do not necessarily refer to the same organisation.

## Define interval boundaries without ambiguity

A practical validity convention uses an inclusive start and an exclusive end: a version applies from its start instant up to, but not including, its end instant. The next version can begin at exactly the previous version's end without creating an overlap.

For the example, a sale at the start of day 10 belongs to South. A sale immediately before that boundary belongs to North. Tests should include both cases. If one query treats the end as inclusive and another treats it as exclusive, the boundary event may be counted twice or assigned inconsistently.

Choose a timestamp precision and time-zone policy that match the source information. A source that supplies only a calendar date cannot justify an invented time of day. If the business change is effective by local business date, retain that meaning instead of silently treating it as midnight in an unrelated time zone.

Also define what happens when no interval matches or two intervals match. Neither condition should be resolved by taking whichever row the database returns first. They indicate missing history or conflicting history and need an explicit exception path before the facts are accepted into ordinary reporting.

## Assign late facts using their event meaning

A transaction received today may describe an event from last week. Looking up only the current dimension version would classify it using today's description, even when the report requires the description at event time.

In the example, suppose a further sale of 30 units from day 9 arrives on day 14. It belongs to the North version. The revised historical totals become 150 units for North and 80 for South, giving 230 overall. Arrival time explains when the report learned of the transaction; it does not change when the sale happened.

Keep event time and load time as separate concepts in the loading process. They are both useful for investigation. A report that changed after a late arrival should be explainable without pretending that the business event itself occurred later.

The reverse problem occurs when a fact arrives before its descriptive record. The [Kimball discussion of late-arriving dimensions](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/late-arriving-dimension/) describes placeholder dimension members and later updates. A local implementation still needs a clear unresolved-state policy and a way to identify which facts require reassessment when fuller history becomes available.

## Distinguish a correction from a real change

A customer moving region is different from correcting a region that was entered wrongly. The first introduces a new business state from a specified time. The second changes the system's account of a state that was already true. They can require different treatment even if both arrive as an update to the same source column.

Do not infer the distinction solely from how quickly the value changed. A correction may arrive months later, while a genuine reassignment can occur on consecutive days. If the source does not identify the reason, preserve the uncertainty and seek a business rule rather than inventing a universal time threshold.

Suppose evidence shows C17 actually moved at the start of day 8 rather than day 10. Under an agreed restatement policy, the 120-unit sale and the late 30-unit sale may now belong to South. Correcting the interval can require revisiting facts already assigned to a version.

Document the affected periods and reports when making such a correction. Preserve enough evidence to explain why a previously issued regional total differs. A technically valid temporal join does not decide whether management reports should be restated or whether earlier published figures should remain frozen.

An effective date supplied after the fact should carry its source and resolution status. A customer-service note, an approved reassignment and an inferred date from a nightly snapshot provide different evidence. Store the business decision about which date to use rather than letting the loader quietly select the most convenient timestamp.

This is also why historical reporting should expose unresolved populations. A small separately labelled unknown group is more honest than confidently assigning uncertain events to the current classification. Track those exceptions so that better information can resolve them without losing the explanation of the earlier report.

## Make dimension loading repeatable

A repeated source delivery should not create a new dimension version merely because the loader ran again. Compare the attributes that the versioning policy says matter, using a stable interpretation of missing values, text and source identifiers.

Closing one version and opening its successor should be treated as one coherent change. A failure between those steps can leave a gap or two open versions. The database design and loading transaction should protect the chosen invariants, with explicit handling for concurrent deliveries of the same business entity.

Retain an identifier for the source change or loading operation when available. It helps distinguish a replay from another real change. When no reliable source sequence exists, the loader needs a documented rule for ordering changes and identifying cases it cannot resolve automatically.

Avoid manufacturing artificial history from every extraction. If a nightly snapshot repeats an unchanged classification, storing another effective version adds noise rather than information. Observation history may still be useful, but it belongs to a different question from when the classification changed.

## Reconcile versions and facts together

Validation should check both the shape of the dimension and the effect of joining it to facts. For each business entity, look for overlapping intervals, unintended gaps and multiple current versions under a policy that permits only one.

For every loaded fact, verify that the dimension reference exists and that it corresponds to the intended classification time. A valid foreign key proves the referenced version exists; it does not prove the loader chose the right version. That semantic check needs event dates and the documented assignment rule.

Compare totals before and after joins and compare the number of facts. A range join that matches two dimension rows can duplicate amounts. A join that matches no version can discard facts if implemented as an inner join. Both problems can be hidden by a plausible-looking chart.

Build a small acceptance set with boundary events, late facts, corrections and a customer with several versions. The article on [reporting databases and data warehouses](/insights/reporting-databases-and-data-warehouses/) provides the broader context; this acceptance set establishes the specific historical meaning your reports promise.

## Apply the policy at a manageable scale

A small business does not need to version every descriptive field to improve reporting. Start with one classification whose changes currently cause disputes, such as product group or sales responsibility. Define its business identity, effective time, correction policy and the reports affected.

Have the report owner and the source-system owner work through the same example. Ask whether a transfer changes earlier results, how a backdated correction should appear and what to do with an event whose classification is unknown. Record these decisions before choosing a loading tool.

A useful historical dimension makes a report's grouping explainable. It preserves the versions needed for the chosen question, gives late information a defined path and makes corrections visible. The result is not merely a longer customer or product table. It is a clearer account of why each business event belongs in a particular part of the report.

---

*Source basis: original KEVOS® analysis of Changing Dimensions in the supplied Designing Effective Database Systems, with terminology and late-arrival handling checked against the linked Kimball Group material. Customer identities, periods and quantities are illustrative.*
