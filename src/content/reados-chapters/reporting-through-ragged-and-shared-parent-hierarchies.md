---
title: "Reporting through ragged and shared-parent hierarchies"
description: "Design reliable roll-ups when reporting hierarchies have uneven depth, shared membership or changing parents, with explicit attribution and reconciliation rules."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - validation
  - design
author: "BIZOMAT"
featured: false
draft: false
---

Reporting hierarchies turn detailed activity into broader views. A work centre belongs to a site, a site belongs to a region and a regional report combines the results. That arrangement works neatly when each member has one parent at every expected level and the memberships remain stable.

Real organisations are less tidy. One branch may omit a level, a project may serve two divisions and a site may change regional responsibility halfway through a reporting period. The hierarchy still looks like a convenient navigation structure, but it no longer guarantees that adding the displayed child totals produces a meaningful parent total.

Reliable roll-ups require explicit rules for membership, attribution and time. The storage representation should support those rules, while reports make clear which hierarchy and interpretation they use.

## Establish what the hierarchy is classifying

Consider a manufacturing group reporting maintenance expenditure. This is an illustrative example. Individual work orders identify the site where work occurred. Management also wants totals by operating division, service region and project sponsor.

These are different classification systems. A site can belong to one operating division while receiving support from a service region with a different boundary. A project sponsor may be unrelated to either. Combining the three into one presumed chain can invent relationships that the business never intended.

Name the hierarchy and its purpose before drawing parent-child links. State what the leaf represents, what each level means and which facts may be summarised through it. A hierarchy used to assign managerial responsibility is not automatically suitable for geographical reporting.

Distinguish classification from composition. A machine's components form a different kind of structure from the business units responsible for its maintenance. Quantities and paths that make sense in a bill of materials should not be transferred automatically to a reporting hierarchy.

Also define the population being classified. If only active sites appear in the hierarchy, historical work at closed sites still needs a reporting destination. Omitting those sites from the current navigation structure must not silently remove their expenditure from historical totals.

## A strict roll-up needs complete, non-overlapping membership

For straightforward addition through one level, each relevant child should map to one parent within the chosen hierarchy and scope. The mapping should cover the facts being reported, and the measure must itself be suitable for addition.

If a site has no regional assignment, an inner join through the hierarchy can drop its work orders. The remaining regional totals may look plausible while failing to reconcile with the source expenditure. An explicit unassigned group is often more informative than silent exclusion.

If a site maps to two regions, the same work can appear in both. That may be intended for a participation view, but adding the regional totals can then exceed the organisation's expenditure. The overlap must be part of the measure's interpretation.

Test these properties using identifiers and relationships rather than labels. Two distinct regions can have the same display name, while one region may have changed its name over time. Grouping by a convenient label can merge or split populations unintentionally.

Finally, check the measure separately. Even a perfectly strict hierarchy does not make balances additive across time or percentages additive across groups. Hierarchy correctness and aggregation correctness are related checks, but one does not establish the other.

```figure
type: checklist
title: When a hierarchy can roll up strictly
caption: Uneven depth is fine; overlapping or missing membership needs an explicit rule.
- x Every item belongs somewhere
- x No item belongs twice without an attribution rule
- x The report states which historical hierarchy it uses
- *x Totals reconcile from the detailed facts outward
```

## Uneven depth does not necessarily mean missing information

A **ragged hierarchy** has branches with different depths or missing intermediate levels. One division might contain areas and sites, while another manages sites directly. The absence of an area level can be a legitimate organisational arrangement.

That differs from an unknown area assignment. In the first case the level does not apply; in the second the classification is incomplete. Representing both as an unexplained null makes it difficult to decide whether to bypass the level, show an exception or wait for better data.

Some reporting structures flatten every branch into fixed level columns. This can make common reports easier, but the rules for shorter branches need careful definition. Repeating a parent label into a missing level may improve display consistency while misleading users about the actual organisation.

A parent-child representation can preserve the real structure more directly. It then needs a way to identify meaningful reporting levels or selected ancestors when branches have unequal depth. Counting a fixed number of links upwards may not reach equivalent business concepts on every branch.

Test navigation and aggregation independently. A tree that expands neatly in the interface may still apply inconsistent level meanings in a report. Users should know whether they are comparing regions, second-level ancestors or a deliberately chosen set of reporting groups.

## Shared membership requires an attribution decision

Suppose a maintenance project supports two divisions and incurs 10,000 units of cost. The organisation can show the full project cost under each division to indicate exposure or participation. The two displayed division values then total 20,000, while the underlying project cost remains 10,000.

Alternatively, the organisation may allocate 60 per cent to one division and 40 per cent to the other. The attributed values become 6,000 and 4,000, which reconcile to the project total. These are different measures answering different questions.

```figure
type: compare
title: A 10,000-unit project shared by two divisions
cols: Division 1 | Division 2
caption: Exposure shows the full cost under each division and must not be added; allocation reconciles to the project total.
- Full exposure | 10,000 | 10,000
- *Allocated 60 / 40 | 6,000 | 4,000
```

Neither interpretation should be hidden in a join. Decide whether a report measures participation, ownership, responsibility or allocated contribution. Name the measure accordingly so that users do not assume all displayed groups form mutually exclusive pieces of one total.

If allocation is used, specify the basis for the weights. They might reflect agreed funding, measured effort or another business rule. Equal splitting is still a policy choice, not a neutral mathematical correction for duplicate rows.

Weights can also vary by measure or period. A project might allocate cost by funding agreement and workload by recorded hours. Reusing one bridge weight indiscriminately across all measures can produce numerically tidy but conceptually incorrect totals.

## A bridge records relationships but does not decide their meaning

A bridge table can represent many-to-many membership between detailed entities and reporting groups. Each relevant membership becomes an explicit row, with any required weight, role or effective period.

This makes the multiplicity visible, but it does not prevent double counting automatically. Joining one fact to two bridge rows still produces two joined rows. The aggregate must use the intended attribution rule or deduplicate at the correct identity level where that matches the question.

Avoid using a blanket distinct sum to conceal the problem. Two different work orders can legitimately have the same amount. Removing duplicate numeric values would lose real expenditure while potentially leaving other duplication unresolved.

Choose keys that preserve the intended membership identity. If the same entity can belong to a group in several roles, the role may be part of that identity. If membership changes over time, the relevant period or version must also be represented without creating accidental overlap.

Validate the bridge as business data. Check missing memberships, repeated links and the required total of allocation weights for each scope. A technically valid table can still contain relationships that make every downstream report wrong.

## Store paths only with a clear update strategy

Hierarchy storage can use direct parent links, precomputed ancestor-descendant relationships or encoded paths, among other arrangements. Each moves work between updates and queries. The right choice depends on the reporting workload and how often the structure changes.

Direct links preserve the immediate relationship compactly, while queries may need recursive traversal to find all descendants. Precomputed ancestry can make repeated roll-ups easier but introduces derived relationships that must be maintained when a branch moves.

An encoded path can simplify some ancestry tests. Moving a subtree may then require updating the paths of many descendants. Shared parents also complicate a representation that assumes one path for every member.

Specify whether a node can appear through more than one path and what that means for counting. In a directed acyclic graph, the same leaf may be reachable through several routes. Traversing all routes and adding facts once per path can multiply contributions even when direct memberships look reasonable.

Treat precomputed paths and closure relationships as maintained data products. Define their source, refresh behaviour and validation. A report should not silently combine current facts with an obsolete ancestry representation after an organisational change.

## Decide which historical hierarchy a report uses

A site moving from one region to another creates at least two legitimate reporting questions. One asks which region was responsible when the expenditure occurred. Another asks how past expenditure would look under today's regional structure.

The first uses historical membership. The second restates history under a current classification. Neither should be presented as the other. A trend can change substantially after reclassification even when the underlying work-order facts remain unchanged.

Record effective periods or versions where historical attribution matters. The query must select the appropriate membership for the fact's relevant time. Joining every historical membership to every fact at the site can duplicate amounts across old and new parents.

Clarify which fact time controls the relationship. Work performed, invoice received and cost posted can occur in different periods. The reporting policy should specify which one determines attribution, especially around transfer dates.

Corrections need separate treatment from organisational changes. Fixing an erroneous parent assignment may appropriately revise earlier reports, while a genuine transfer should preserve the earlier arrangement for an as-was view. Retain the reason and scope of the change so that restatement is deliberate and explainable.

## Alternative hierarchies need separate identities

The same sites may be grouped by operational region, legal entity and service territory. These structures can coexist without being forced into one hierarchy. Give each structure an identity and define the measures and audiences for which it is intended.

A report parameter should select the hierarchy explicitly. If a join includes membership rows from several structures without filtering the hierarchy identity, facts can multiply or appear under incompatible parents. Similar group names can make this error difficult to notice visually.

Version alternative structures independently where their changes occur on different schedules. A service territory may be revised monthly while the legal structure remains stable. A single global hierarchy version can create unnecessary coupling or obscure which structure actually changed.

Document whether comparisons between hierarchies are meaningful. Totals may reconcile to the same underlying population while subtotals describe different responsibilities. A movement between groups in one hierarchy does not imply a movement in the other.

Where users switch views, preserve the report's filters and population definitions carefully. Selecting a group from one hierarchy and then applying its identifier in another can produce empty or misleading results. The interface should make the active structure and scope apparent.

## Reconcile from the detailed facts outward

Begin validation with a known set of detailed records and a control total. Then examine the result after each relationship used in the roll-up. This makes it easier to identify where records are lost, duplicated or intentionally allocated.

Use a small test population with a short branch, an unassigned member, a shared member and a member that changes parent. Give the facts deliberately different amounts so that accidental duplication is easier to trace. Include two equal amounts as well to expose incorrect distinct-value fixes.

For an allocated report, verify the expected conservation rule. If all cost is meant to be assigned, the relevant weights should sum to one and attributed totals should reconcile. If some cost remains deliberately unallocated, show that residual explicitly.

Define how rounding differences are handled. Splitting a small amount among several groups can produce displayed values whose rounded sum differs from the rounded total. The allocation process may retain greater internal precision and apply a documented residual rule where exact distribution is required. Do not conceal a structural double-counting problem under a general rounding explanation: inspect the unrounded contributions first, then account separately for presentation and allocation precision.

For a participation report, do not demand an additive reconciliation that contradicts the measure's purpose. Instead, compare the union of underlying fact identities with the population total and explain why group totals overlap.

Test temporal boundaries and branch moves. Check facts immediately before, at and after an effective change. Rebuild or refresh any derived ancestry data and compare the result with a direct interpretation of the authoritative relationships.

## Make report behaviour understandable to its readers

Users need to know which hierarchy, version and attribution rule a report applies. This information can be concise, but it should be available where the figures are interpreted. An unexplained total is difficult to challenge even when it is technically correct.

Label unassigned and inapplicable classifications differently. A legitimate shorter branch should not look like a data-quality failure, while missing membership should not be disguised as a normal organisational level.

Explain non-additive displays directly. If each division shows the full cost of shared projects, state that division figures overlap. If costs are allocated, identify the allocation basis and any residual rather than implying that the numbers are observed direct costs.

Give hierarchy changes an owner and a review process. Moving one node can alter many reports and access assumptions. The change should include the effective date, reason, affected structures and expected treatment of historical figures.

A trustworthy reporting hierarchy preserves both structure and meaning. Its value comes from helping readers move between levels without losing track of the population, time basis or attribution rule that makes the figures interpretable.

## Source basis and further reading

The hierarchy chapter in the source collection's *Multidimensional Databases: Problems and Solutions* distinguishes classification mappings, completeness and alternative hierarchy structures. Its regular-hierarchy treatment provides the starting point for the broader original maintenance-reporting examples here.

The Kimball Group describes [multivalued dimensions and bridge tables](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/multivalued-dimension-bridge-table/) and [ragged hierarchies](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/ragged-variable-depth-hierarchy/). These sources discuss representation choices; the attribution policy still needs to come from the business meaning of the report.
