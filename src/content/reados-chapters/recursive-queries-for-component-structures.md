---
title: "Recursive queries for component structures"
description: "How to traverse multi-level component relationships, multiply quantities along each path, preserve shared components and detect cycles before trusting a materials total."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - manufacturing
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A finished assembly contains subassemblies, and each subassembly contains further parts. A database can store the immediate parent-child relationships in a small table, but a materials question often reaches through several levels. Finding every component is different from finding only the rows whose parent is the finished assembly.

Recursive queries repeatedly apply a relationship to the results already found. They can support component expansion, organisational structures, category trees and other linked data. Their apparent simplicity hides important choices about quantities, repeated paths, cycles, revisions and where traversal should stop.

For manufacturing data, a list of reachable part numbers is rarely enough. The same component may occur through several valid branches, and each branch can contribute a different quantity. A trustworthy result needs both the relationship model and the traversal rules to reflect that meaning.

## Store relationships at their actual level

A simple component relationship can record a parent item, a child item and the quantity of the child required for one unit of the parent. A finished assembly and a subassembly are both items, so the relationship connects the item type to itself.

When a child can appear under several parents, a separate relationship table is normally needed. Putting one parent field on the child item would incorrectly limit it to a single parent. The relationship, rather than the component alone, carries information such as quantity, position or applicable revision.

Decide what identifies a relationship row. If a component appears at two positions within one assembly, those positions may be separate valid occurrences. A uniqueness rule on only parent and child would collapse them. If the business instead stores a combined quantity for that pair, the model should say so explicitly.

Foreign keys can ensure the referenced items exist. A check can reject a direct relationship from an item to itself. Neither necessarily prevents a longer cycle such as A containing B, B containing C and C containing A. Whole-path validity requires additional reasoning.

## Define a traversal before writing SQL

A recursive traversal has a starting set, a step and a termination condition. For a component expansion, the starting set may be the immediate children of a selected assembly. The step finds the children of each item reached. Traversal finishes when no further permitted relationships remain.

A **recursive common table expression**, or recursive CTE, expresses this pattern in SQL. The starting query is commonly called the anchor. The recursive term refers to the CTE's preceding results and extends them. Official [PostgreSQL documentation on WITH queries](https://www.postgresql.org/docs/current/queries-with.html) explains this structure and the need to consider cycles and result ordering.

The business definition should also identify the root quantity, the revision context and any stop rules. A purchased subassembly may be a planning endpoint even if engineering stores its internal parts. A manufactured subassembly may need to be expanded. The database cannot infer this distinction from the existence of child rows alone.

Write the intended output grain too. One row per traversal path preserves different ways to reach the same component. One row per component is an aggregation of those paths. Confusing the two can lead to premature deduplication and understated requirements.

## Multiply quantities along each path

This is an illustrative example. Assembly A contains two units of subassembly B and three units of subassembly C. Each B contains four units of part D. Each C contains five units of D. Assume every relationship uses compatible units and there are no scrap allowances, alternate parts or revision choices.

The route A to B to D requires two times four, giving eight units of D. The route A to C to D requires three times five, giving fifteen. Together, one A requires twenty-three units of D. An order for six A assemblies therefore requires 138 units of D before any separately defined allowances.

| Path | Quantity calculation for one A | D requirement |
|---|---|---|
| A → B → D | 2 × 4 | 8 |
| A → C → D | 3 × 5 | 15 |
| Both valid paths | 8 + 15 | 23 |

```figure
type: tree
title: Two paths to component D
caption: One A needs 23 D; an order for six A needs 138.
- Assembly A
  - B, 2 per A
    - D, 4 per B | 8 per A
  - C, 3 per A
    - *D, 5 per C | 15 per A
```

The shared part D is not a duplicate error. It appears through two legitimate paths, each contributing material. Returning D only once as a reachable item answers a different question from calculating the quantity required.

At the same time, B and C are intermediate requirements. Adding their quantities to D and presenting one “total parts” figure mixes different assembly levels. Decide whether the report needs all levels for explanation, leaf requirements for purchasing or selected planning endpoints for a production order.

## Inspect the path rows before aggregating

The following compact example uses positive integer item identifiers. Item 1 is A, item 2 is B, item 3 is C and item 4 is D. Its path string is an explanatory technique for this restricted identifier format, not a general string-identifier solution.

```sql
WITH RECURSIVE expansion(item_id, required_qty, path) AS (
    SELECT child_id,
           quantity,
           '/' || parent_id || '/' || child_id || '/'
    FROM component
    WHERE parent_id = 1

    UNION ALL

    SELECT c.child_id,
           e.required_qty * c.quantity,
           e.path || c.child_id || '/'
    FROM expansion AS e
    JOIN component AS c ON c.parent_id = e.item_id
    WHERE e.path NOT LIKE '%/' || c.child_id || '/%'
)
SELECT item_id, required_qty, path
FROM expansion
ORDER BY path;
```

For the acyclic example, the rows include B with quantity two, C with quantity three, D through B with quantity eight and D through C with quantity fifteen. Inspecting these rows makes the multiplication visible before a final aggregation groups the two D contributions.

The query's path condition prevents revisiting an item already on the current path. It does not prove the source structure is valid. A repeated edge is suppressed from further expansion, so a production process needs a separate diagnostic that reports attempted revisits and rejects or flags the affected result.

Syntax, numeric handling and supported cycle features vary by database. This small query can be exercised in a local SQLite fixture; it is not presented as a complete planning query for every product. Use the installed database's documented features and test the exact implementation.

## Distinguish shared descendants from cycles

A component reached through two branches is not necessarily a cycle. In the example, D belongs under both B and C, but neither path returns to an earlier item. The structure is a directed acyclic graph rather than a strict tree.

A cycle occurs when following directed relationships can return to an item already on the current route. If D were made to contain A, traversal from A could continue indefinitely without a guard. The cycle is meaningful because the component definition depends on itself through several steps.

Using one global “already seen” set would prevent repeated expansion of D across both branches, but it could also erase legitimate quantity contributions. For path-based material expansion, the relevant cycle check is usually against the current path. The final aggregation can then combine valid contributions from separate paths.

This distinction is central to the test fixture. Include both a shared component and an actual cycle. An implementation that handles only one of these may either run without termination or return a plausible but incomplete materials total.

## Do not rely on UNION to solve every cycle

Changing `UNION ALL` to `UNION` removes duplicate result rows according to the selected columns. Whether that stops a cycle depends on what those rows contain. If the row includes a growing path or changing quantity, each revisit can still produce a different row.

Even where duplicate elimination terminates a reachability query, it may be wrong for a quantity calculation. Two identical-looking occurrences can represent independent uses at different positions. Removing one changes the material requirement unless the model explicitly treats them as duplicate source data.

Choose duplicate handling from the output meaning. For “which items are reachable”, a set of identities may be sufficient. For “how much material is required through all valid occurrences”, retaining paths or occurrence identities until aggregation is usually necessary.

A depth limit can provide an operational guard, but it is not a substitute for cycle diagnosis. A valid structure deeper than the limit would be truncated. The result should state that the traversal was incomplete and should not be issued as a complete requirement merely because the query returned successfully.

## Make units and numeric precision explicit

The worked example uses whole units, but real component quantities may involve length, mass, area or volume. Multiplying quantities along a path is valid only when the relationship units compose correctly. A parent measured in batches and a child measured in kilograms need an explicit conversion basis.

Store or otherwise govern the unit associated with each quantity. A bare decimal such as 0.5 cannot explain whether the relationship requires half a metre, half a kilogram or half a standard pack. Changes to purchasing units should not silently change engineering quantities.

Avoid premature rounding. Rounding every intermediate relationship to whole purchasing units can accumulate excessive requirements across branches. Instead, calculate in suitable base units and apply the agreed rounding or pack-size policy at the relevant planning boundary.

Numeric capacity matters in deep structures. Repeated multiplication can exceed a chosen numeric type or magnify rounding error. Define expected quantity ranges and use appropriate precision. A complete implementation should reject out-of-range results explicitly rather than returning a wrapped, truncated or misleading value.

## Select revisions as part of the query context

A component relationship is often valid only for a particular assembly revision, effective period or configuration. Expanding all stored relationships without selecting the applicable context can combine old and new designs into a structure that was never approved.

Choose the revision context at the root and specify how it propagates. A parent may require a fixed child revision, or a configuration rule may select a compatible revision. The model should represent that decision rather than relying on whichever row currently has the highest revision label.

Late changes also affect reproducibility. If a materials report is used to release work, record enough context to reproduce what was expanded: root identity, revision or configuration, relevant effective date and calculation policy. A later report using current relationships may be valid for new work while differing from the earlier release.

The discussion of [keeping history in business data](/reados/collections/reporting-history-and-analytical-data/keeping-history-in-business-data/) explains why current state and historical applicability are different. Recursive traversal does not remove the need to answer which structure was true for the job being analysed.

## Define planning endpoints separately from technical leaves

A technical leaf has no child relationships in the selected structure. A planning endpoint is where a particular calculation should stop. These can differ. A purchased motor may have an engineering breakdown but still be bought as one item; a phantom grouping may be expanded without becoming a separately planned stock item.

Keep the stop rule explicit and test it alongside quantities. A report for purchasing, assembly sequencing and engineering traceability can legitimately use different endpoints. Giving all three the same “explode everything” query can produce unsuitable results even when the recursion itself is correct.

Do not interpret missing child data as proof that an item is a deliberate leaf. An incomplete subassembly definition may look exactly like a purchased endpoint unless the model records the intended planning behaviour or completeness status. Data-quality checks should distinguish the two.

For the example A, a purchasing report might stop at B if B is bought complete, while continuing through C to D. That report would require two B units and fifteen D units per A, under the stated policy. It should not simultaneously include B's internal eight D units as an additional purchase requirement.

## Measure expansion size as well as depth

A shallow structure can still produce many paths when each level branches widely. Four children per item over five levels produces 1,024 path occurrences at the fifth level alone in a full branching example. A depth threshold therefore does not capture every workload risk.

```figure
type: bars
title: Paths in a full branching structure, four children each
max: 1100
caption: Measure expansion size as well as depth; five levels already give 1,024 paths at the bottom.
- Level 1 | 4
- Level 2 | 16
- Level 3 | 64
- Level 4 | 256
- *Level 5 | 1024
```

Measure representative structures and observe the number of intermediate rows. Indexes supporting lookup by parent identity and applicable revision can help the recursive step, but no index removes the cost of producing a genuinely large requested result.

Restrict the starting set to the required assemblies and avoid carrying unnecessary wide text columns through every recursive row. Join descriptive labels after the core traversal where appropriate. This can simplify both execution and validation without changing the business meaning.

For frequently repeated calculations, a maintained expansion or closure structure may be worthwhile. It introduces its own update and revision-consistency obligations. Use measured demand to justify that complexity rather than adopting it before the simpler traversal's actual cost is understood.

## Test the structure with counterexamples

A useful fixture contains a single-level assembly, a multi-level chain, a shared component, a direct self-reference and a longer cycle. Add a missing referenced item to confirm foreign-key protection and an incomplete subassembly to test the completeness rule.

Verify path quantities before totals. For the A example, assert the two D contributions are eight and fifteen, then assert their combined requirement is twenty-three. A total-only test might miss a swapped relationship if the arithmetic happened to cancel elsewhere.

Test revision boundaries, planning stop rules and quantities requiring decimal precision. Rerun the calculation with a root quantity other than one. Six A assemblies should produce 138 D units under the original assumptions, while the purchased-B scenario should produce twelve B units and ninety D units.

Finally, verify that a cycle or depth limit produces a visible incomplete-result condition. Termination is necessary, but a fast, finite answer is not trustworthy if part of the structure was silently discarded.

## Apply recursive reporting with clear ownership

For a small manufacturing business, begin with one assembly whose relationships and quantities can be checked manually. Review the expansion with engineering, planning and purchasing so each team can identify its intended stopping points and revision assumptions.

Assign ownership for correcting structural errors. A cycle diagnostic should identify a path that someone can investigate, rather than merely returning “invalid data”. Retain the input context with any released report so a later design change can be distinguished from a calculation defect.

Recursive SQL is a method for following relationships. Reliable component planning comes from the meaning attached to those relationships: valid occurrences, compatible units, chosen revisions and explicit endpoints. Keeping those meanings visible makes the final quantity defensible instead of merely computable.

---

*Source basis: original KEVOS® editorial explanation drawing on unary and recursive relationship discussions in the supplied Designing Effective Database Systems (2005) and Beginning Relational Data Modeling, second edition (2005). Current SQL documentation is linked for recursive-query behaviour. Component structures and calculations are illustrative, not approved engineering designs.*
