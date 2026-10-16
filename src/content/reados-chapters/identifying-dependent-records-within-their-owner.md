---
title: "Identifying dependent records within their owner"
description: "How to model records whose identity depends on a parent, preserve local numbering rules, and handle references, transfers and deletion without confusing ownership."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - design
  - quality
author: "KEVOS®"
featured: false
draft: false
---

An order line numbered three is easy to identify while the order is open on screen. In an exported spreadsheet containing hundreds of orders, the number three identifies nothing by itself. The record needs the order's identity as well as its local line number. Losing that context can attach an inspection, delivery or amendment to the wrong business item.

Database modelling has a useful concept for this situation: a **weak entity**, meaning an entity whose identification depends on an owning entity. The word weak describes how identification works. It says nothing about the record's importance, the quality of the software or the strength of its access controls.

Understanding this distinction helps a team choose keys, design imports and decide what a transfer or deletion really means. It also prevents a common mistake: adding a generated identifier and assuming that the underlying ownership and uniqueness rules have disappeared.

## Start with the complete business reference

Ask how a person distinguishes one record from another when all surrounding screen context is removed. For an order line, the answer might be order number plus line number. For a drawing revision, it might be drawing identity plus revision code. For an inspection observation, it could be inspection identity plus observation number.

The locally distinguishing component is sometimes called a **partial key**. It distinguishes records within one owner, but it need not distinguish records belonging to different owners. Both order A and order B can legitimately contain line three. Within either order, two accepted lines numbered three would be ambiguous under this rule.

Write the identity rule as a sentence before selecting a storage mechanism. “A line number is unique within an order” identifies the scope of uniqueness. “Every line belongs to exactly one order” identifies a mandatory relationship. They are separate assertions, and a sound design needs to preserve both.

Do not infer identification from a familiar label. A description such as “mounting bracket” may appear twice in one order because delivery dates differ. A display position may change when users rearrange lines. Neither is automatically a suitable identifying component just because it is visible next to the record.

## Distinguish identification from other relationships

A dependent record can have several relationships without having several identifying owners. An order line belongs to an order, refers to a product and may be assigned to a planner. The order can define its identity while the product and planner describe other facts about it.

This matters when a relationship changes. Assigning a different planner should not normally create a different order line. Correcting the product may or may not be permitted after acceptance, but that question concerns the business lifecycle. It does not follow from the existence of a foreign key alone.

A foreign key says that a referenced record must exist under the constraint's rules. It does not, by itself, say that the relationship contributes to identity. A globally identified machine can reference a department while remaining the same machine after a departmental transfer. Treating every foreign key as identifying would make ordinary organisational changes look like identity changes.

Conversely, a dependent observation may have a globally unique technical identifier and still be meaningless without its inspection. The technical address makes referencing convenient; it does not decide whether the observation is allowed to exist independently. Record both the technical key and the business relationship in the data dictionary.

## Work through a small order-line model

This is an illustrative example. A workshop records orders 410 and 411. Order 410 contains lines 1 and 2. Order 411 contains line 1. Each line has a description and a positive ordered quantity. The assumed rule is that line numbers remain stable after the order is accepted.

| Order identity | Line number | Description | Ordered quantity |
|---|---|---|---|
| 410 | 1 | Bracket | 4 |
| 410 | 2 | Cover | 6 |
| 411 | 1 | Bracket | 3 |

There are three lines and two distinct line numbers. Counting distinct line numbers would therefore give the wrong number of business records. A request referring only to line 1 would be ambiguous; a request referring to order 411, line 1 would be complete.

The following small schema expresses the assumed identity and existence rules. It is deliberately limited to the illustration and does not represent a complete ordering system.

```sql
CREATE TABLE work_order (
    order_id INTEGER NOT NULL PRIMARY KEY
);

CREATE TABLE order_line (
    order_id INTEGER NOT NULL,
    line_no INTEGER NOT NULL CHECK (line_no > 0),
    description TEXT NOT NULL,
    ordered_quantity INTEGER NOT NULL CHECK (ordered_quantity > 0),
    PRIMARY KEY (order_id, line_no),
    FOREIGN KEY (order_id) REFERENCES work_order(order_id)
);
```

The combined primary key rejects a second line 1 within order 410 while permitting line 1 within order 411. The foreign key rejects a line referring to an order that does not exist. The explicit null restrictions make the required values clear rather than relying on a particular database's treatment of a composite primary key.

In SQLite, foreign-key enforcement must be enabled and checked for the connection before relying on this example. Its [foreign-key documentation](https://www.sqlite.org/foreignkeys.html) also explains composite references and deletion actions. Other engines have their own implementation details. A diagram alone does not prove that the running database enforces the relationship.

## Carry the complete key into dependent references

Suppose a dispatch record refers to one order line. If the chosen key is `(order_id, line_no)`, the reference must identify that pair. Referencing only the order would establish that a dispatch belongs somewhere within the order, while failing to identify which line it concerns.

Similarly, referencing only the line number cannot work when that number repeats across orders. An application might appear correct because a screen already filters to the current order. An import, background task or reporting query can expose the missing context later. Implicit screen state is not a substitute for an explicit database reference.

Composite references also help preserve scope. If an inspection result is recorded for order 410, line 2, its relationship should not silently resolve to line 2 under a different order. Joins, exports and messages need the same complete identification rule, even if the user sees a shorter friendly label.

Avoid copying descriptive attributes into references just to make them look more meaningful. A dispatch can display the order number and line description by looking them up. If it must preserve the wording accepted at dispatch time, that is a separate historical fact with a separate purpose. Identify it as such rather than treating a copied description as part of the key.

An external reference also needs a defined namespace. Order 410 in one company's system may be unrelated to order 410 in another. When records cross organisational or system boundaries, the complete reference may need the source identity as well as the owner and local number. Preserve that context during import rather than assuming numbers are globally unique.

Test an export followed by a re-import into a clean environment. If the relationship can be reconstructed only because the original screen remains open or a local lookup table happens to contain one candidate, the exchange is incomplete. The file should contain enough stable identification, or an explicitly defined mapping, to reconnect every dependent record to its intended owner without guessing.

## Add surrogate keys without removing business rules

A **surrogate key** is an identifier introduced primarily for the system, rather than taken directly from the business reference. Giving every line a `line_id` can simplify references from many other tables and reduce the need to carry a wide composite key through several levels.

That choice does not make duplicate local line numbers acceptable. A design with a surrogate primary key still needs a uniqueness rule for `(order_id, line_no)` if the business uses that pair unambiguously. Otherwise two technically distinct records can both claim to be order 410, line 2.

The system also needs a mandatory reference to the owner when independent existence is forbidden. A surrogate key without the ownership constraint permits a line with no order. The storage engine may consider it a perfectly valid row while users consider it an impossible business record.

Compare the options in terms of actual consequences: reference width, external integrations, changes to human-facing numbers, tooling support and the rules that must remain enforceable. Neither composite nor surrogate keys are automatically superior. The useful distinction is between convenient technical identification and the business uniqueness that users depend on.

## Decide whether moving a record preserves its identity

Moving a draft line from one order to another is not merely a form convenience. Under an identifying composite key, changing the owner changes part of the record's identity. References to the original line need an explicit treatment, especially if downstream work has already started.

One policy might prohibit transfers after acceptance. Another might cancel the original line and create a new line under the destination order, preserving a link that explains the replacement. A third might permit a transfer while keeping a stable surrogate identifier. These policies express different business meanings and should not be chosen accidentally by a database update.

Ask what should happen to reservations, approvals, promised dates and inspection evidence. A reservation created for one customer's order may not automatically be valid for another. Keeping the same technical identifier does not establish that all dependent decisions remain authorised after a transfer.

Number reuse needs similar care. If a cancelled line 2 is removed and a new item takes its number, an old printed reference can now point to a different item. A policy of preserving accepted line numbers, including gaps, can be easier to explain than continuous renumbering. Use a separate display sequence where users need rearrangement without identity changes.

## Separate ownership from deletion policy

An identifying owner tells the model where a dependent record gets its identity. It does not automatically authorise deleting every dependent record whenever the owner is deleted. Existence rules and retention decisions address different questions.

Deleting an unaccepted draft order and its draft lines may be reasonable within a defined workflow. Deleting an accepted order with dispatch and inspection history may destroy information needed to explain completed work. A system can instead prevent deletion or move the order into a closed state while retaining its relationships.

Database deletion actions should implement an agreed policy. Restricting deletion can surface an attempt that needs business review. Cascading can be suitable for genuinely inseparable temporary records. Leaving an optional reference empty can be appropriate for some associations, but not when the dependent record is required to have an owner.

The discussion of [keeping history in business data](/reados/collections/reporting-history-and-analytical-data/keeping-history-in-business-data/) helps distinguish current operational state from evidence of earlier decisions. A cancelled item can remain identifiable even though it no longer participates in active planning. Keeping that distinction explicit makes recovery and reporting more reliable.

## Handle several levels of dependency

Dependencies can continue beyond one level. An order owns lines; a line may own scheduled releases; a release may own inspection observations. A purely identifying composite key can grow at each step as local identifiers are added to the owner's complete key.

This growth is not automatically a modelling defect. It can describe the business reference accurately. However, wide keys increase the amount of context that integrations and constraints must carry. They also make a change near the top of the hierarchy affect more references if those identifiers are mutable.

A surrogate identifier at a lower level can make technical references simpler while preserving a unique business reference as a separate constraint. The important question is whether each child still has the correct owner and whether its local identifier is unique in the intended scope.

Be cautious about assuming that every displayed hierarchy is identifying. A component can appear in multiple assemblies without being a different component each time. The assembly occurrence and the reusable component are different entities. Confusing them either duplicates the component's master data or incorrectly forces one occurrence to serve several unrelated contexts.

## Test identity through realistic exceptions

Useful tests should try to break the meaning, not merely insert a valid example. Attempt duplicate local numbers within one owner, the same number under two different owners, a missing owner and an incomplete downstream reference. State which attempts should succeed and which should fail before running them.

Test changes as well as inserts. Renumber a draft, try to renumber an accepted record, transfer it to another owner and attempt to delete the owner while downstream evidence remains. Some of these rules belong in database constraints; others require application workflow controls. The test should demonstrate the complete behaviour.

Imports deserve particular attention because external systems often supply only part of a reference. A file with line number 1 and no order identity should be rejected or held for resolution rather than matched to whichever row happens to be found first. Log the missing context without inventing a relationship.

Finally, inspect reports for accidental grouping by the partial key. In the example, the two lines numbered 1 refer to different orders and quantities. A total grouped only by line number would combine them. That may be a deliberate analysis, but it cannot stand in for a list of uniquely identified order lines.

## Make the identification rule usable outside the database

For a small Australian manufacturer, the practical deliverable is a reference convention that survives handovers between estimating, production and dispatch. A person should be able to identify the intended record from a document or message without relying on the sender's open screen.

Document the owner, local identifier, allowed changes and deletion policy together. Show one valid repeated local number across owners and one invalid duplicate within an owner. These compact examples often communicate more effectively than a diagram alone.

A dependent record is well modelled when its references are complete, its owner is unambiguous and its lifecycle matches the business process. Keys make those promises enforceable. They should preserve the meaning of the work rather than merely give every row a different number.

---

*Source basis: original KEVOS® analysis of the weak-entity and identifying-owner sections in the supplied Database Design Using Entity-Relationship Diagrams, with implementation terminology checked against the linked SQLite documentation. The workshop records and quantities are illustrative.*
