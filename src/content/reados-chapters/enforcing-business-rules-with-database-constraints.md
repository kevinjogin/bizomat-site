---
title: "Enforcing business rules with database constraints"
description: "Translate business rules into database constraints, distinguish state rules from transition rules, and test enforcement across imports and concurrent updates."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - quality
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

A form can reject an invalid quantity while an import accepts it. A screen can warn about a duplicate identifier while two simultaneous requests both create it. A workflow can require approval while a background process updates the underlying record directly. Each path may look reasonable on its own, yet the stored data can still contradict the business rules.

Database constraints provide a way to make important rules apply wherever data is written. Their strength is not that they replace the application, but that they establish conditions the stored state must satisfy. The application can then help people meet those conditions and explain failures clearly.

Designing this protection requires more than marking fields mandatory. Rules differ in scope, timing and complexity. Some concern one value, some connect records, and others restrict transitions or depend on several concurrent transactions. A useful design starts by identifying which kind of rule is being expressed.

## Write the rule before selecting the mechanism

A rule such as “quantities must be valid” is too vague to implement. Valid might mean positive, non-negative, whole-numbered, within a permitted unit conversion or no greater than an available balance. Each interpretation has different consequences.

Write a statement that can be evaluated against data. For example: every stock movement must reference an existing item; every accepted receipt must have a recorded quantity greater than zero; each supplier reference must be unique within its supplier account.

Include scope and exceptions. A reference unique across the entire business differs from one unique within a supplier. A quantity rule for receipts may differ from a rule for adjustments. Omitting these distinctions encourages programmers to make policy decisions through implementation details.

Then identify when the rule must hold. Some conditions apply to every stored row. Others apply only when a record becomes released or when a transaction commits. This timing affects both the user experience and the available enforcement mechanisms.

## Classify rules by the data they involve

A **domain rule** concerns permitted values, such as a status drawn from a controlled set. A row-level rule relates fields in one row, such as an end time occurring after a start time. A uniqueness rule relates rows through an identifier. A reference rule requires a related record to exist.

Other rules span several rows or tables. The sum of allocations must not exceed an order quantity. A resource must not have overlapping bookings. A released assembly must contain every mandatory component. These cannot all be expressed as a simple check on one row.

Classification helps prevent false confidence. A positive quantity check does not establish that enough stock exists. A foreign key establishes a reference, not that the referenced supplier is currently approved for the intended work.

| Rule | Typical scope | Important question |
| --- | --- | --- |
| Quantity is positive | One value or row | Is missing quantity allowed? |
| Reference is unique within supplier | Several rows | What exact columns define the scope? |
| Item exists | Related table | What happens if the item is retired? |
| Allocation total stays within limit | Several records | How is concurrent change coordinated? |
| Released work cannot return directly to draft | Old and new state | Which transitions are authorised? |

```figure
type: layers
title: Rules by the data they involve
caption: The wider the scope, the more the rule becomes a concurrency problem.
- One value or row | quantity is positive
- Several rows | reference unique within supplier
- Related table | the item exists
- Several records | allocation total within limit
- *Old and new state | released work cannot return to draft
```

The table is a starting classification, not a guarantee that every database supports every rule declaratively.

## Prefer declarative controls when they express the rule

A **declarative constraint** tells the database which condition must hold. The database is responsible for enforcing it during relevant changes. Common examples include primary keys, unique constraints, foreign keys, non-null requirements and row checks.

These controls reduce the amount of custom code that must run correctly on every write path. They also make the schema communicate important assumptions to maintainers. A named uniqueness constraint is more discoverable than a duplicate-checking convention scattered through several applications.

For a concrete product example, PostgreSQL documents that a `CHECK` constraint succeeds when its expression is true or null, and that ordinary checks are not intended to enforce conditions involving other rows. It also documents the roles of unique, foreign-key and exclusion constraints. Those distinctions are explained in its [constraint reference](https://www.postgresql.org/docs/current/ddl-constraints.html).

The implication is practical: combine controls deliberately. A range check and a non-null requirement can express different parts of the intended rule. Do not assume one automatically supplies the other, or that a function called by a row check makes an arbitrary cross-row rule safe.

## Work through a receipt rule

This is an illustrative example. A business records supplier receipts. Each receipt line must reference an existing receipt and item, its received quantity must be positive, and its line number must be unique within that receipt.

The intended model includes a Receipt table, an Item table and a ReceiptLine table. The line's identifying combination is receipt identifier and line number. Foreign keys protect the two references, while a non-null positive quantity requirement protects the recorded amount.

These controls establish useful facts, but they do not establish that the received item matches an outstanding purchase order or that the cumulative receipt quantity remains within an authorised tolerance. Those are additional rules with additional data dependencies.

Suppose two receipt lines refer to the same purchase-order line. Each received quantity can be individually positive while their total exceeds the permitted amount. Treating that problem as another check on each isolated receipt row would miss the relationship that matters.

A good rule register therefore separates “each receipt quantity is positive” from “total accepted receipts remain within the order's permitted quantity”. The first may be straightforwardly declarative. The second requires a mechanism appropriate to the database and transaction design.

## Distinguish stored-state rules from transition rules

A **state rule** describes an acceptable database state. A released record must have an approval identifier, for example. A **transition rule** describes permitted movement from one state to another, such as requiring a cancellation reason when accepted work is cancelled.

A row that contains status cancelled and a reason can satisfy the state rule without proving that the cancellation was authorised. Authorisation concerns who performed the transition and under what conditions. The final row alone may not contain enough evidence.

Model the transition explicitly where it matters. An application service or stored procedure can validate the old state, requested action and actor, then record the change and its audit information within an appropriate transaction.

Database constraints can still support that process. They can prevent impossible combinations of status and required fields, while controlled permissions limit which paths can perform sensitive transitions. No single mechanism must carry every responsibility.

This distinction also helps testing. Test whether invalid final states are rejected, and separately test whether forbidden paths between otherwise valid states are blocked.

## Recognise the race in check-then-insert

An application often checks that an identifier is unused before inserting it. This provides helpful feedback when a duplicate already exists. It does not, by itself, prevent two requests from checking simultaneously and both finding the identifier available.

This is an illustrative example. Request A checks supplier reference R-42 and finds no match. Before A inserts, request B performs the same check and also finds no match. Both then attempt to insert the reference.

```figure
type: timeline
title: The race in check-then-insert
caption: Each check is correct when it runs; only a unique constraint or a lock stops the duplicate.
- 1 | Request A checks R-42 | no match
- 2 | Request B checks R-42 | no match
- 3 | A inserts R-42
- *4 | B inserts R-42 | a duplicate, unless the database enforces uniqueness
```

A suitable database uniqueness constraint provides a final arbitration point. One conflicting write must fail under the enforced rule, even though both earlier checks appeared to succeed. The application must handle that failure and explain it without exposing raw database internals to the user.

Keep the preliminary check if it improves usability, but do not confuse it with the authoritative guarantee. The same issue arises with any workflow that reads a condition and later acts on it while another transaction can change the relevant data.

The rule's scope must match the constraint. If uniqueness is within supplier, constrain the supplier-reference combination. Constraining only the reference may wrongly reject legitimate values used by different suppliers.

## Treat cross-row rules as concurrency problems

Rules involving totals or the absence of competing records need special care. A procedure that queries the current total and then inserts another allocation can be correct when run alone and incorrect when two copies run together.

Possible enforcement approaches include supported declarative features, serializable transactions with retry handling, or an explicit locking protocol that coordinates every relevant writer. The right choice depends on the rule, database and workload.

If explicit locking is used, identify the common resource that represents the invariant. Locking only the new child row does not necessarily coordinate another transaction inserting a different child row. A stable parent or allocation-control record may provide the required shared point, provided every writer follows the protocol.

Do not assume that a trigger automatically solves concurrency. A trigger runs in a transaction context and can observe a state that does not include another uncommitted change. Its query, locking and isolation behaviour must be designed as carefully as ordinary application code.

Document the argument for correctness: which transactions could violate the rule, what forces them to coordinate, and what happens when one must wait or retry. That explanation is part of the design, not optional implementation commentary.

## Use triggers with a clear responsibility

A **trigger** is database code invoked in response to specified events. It can centralise behaviour for changes arriving through different applications, but it can also create hidden coupling if it performs broad or surprising work.

Use a trigger only with a clearly stated purpose, documented inputs and expected effects. Account for multi-row statements, updates that change identifying fields, deletions and bulk operations. A solution tested only against one-row inserts is incomplete for many real write paths.

Keep external side effects separate from assumptions about database rollback. An email sent from a trigger or application callback is not automatically unsent if the database transaction later fails. Design communication and external integration with their own delivery guarantees.

Review interactions among triggers. One trigger may update a table that causes another to run, creating unexpected ordering or recursion. The resulting behaviour should remain understandable to someone investigating a failed transaction.

Prefer the simplest mechanism that actually expresses and enforces the rule. Custom procedural enforcement has a larger proof and maintenance burden than a suitable built-in constraint.

## Decide when temporary inconsistency is acceptable

Some legitimate multi-step changes temporarily pass through a state that would be invalid if committed. Reassigning related records or rearranging a structure can require several statements before the final state satisfies all relationships.

Certain database constraints can be deferred until a later point, such as transaction commit, depending on product support and constraint type. This can make legitimate atomic changes possible without weakening the final guarantee.

Deferral is not permission to leave the database inconsistent after the operation. The application must still handle a failure at the point when the constraint is checked. A workflow that reports success before commit can mislead users if the final check rejects the transaction.

Use deferral only where the operation requires it and where its effect is understood. Broadly disabling constraints to make an import easier can remove protections from unrelated work and create data that later operations cannot interpret safely.

## Introduce constraints into existing data carefully

An existing system may already contain violations of the proposed rule. Adding a constraint without first profiling the data can fail or expose disagreements about what the rule should mean.

Identify violating records and classify them. Some are errors to correct; some are legitimate exceptions showing that the proposed rule is too narrow; others require a migration decision because the old system represented facts differently.

Agree the correction process with the data owner. Do not silently delete or rewrite historical records merely to make validation pass. Preserve the meaning of the original event and record any authorised correction appropriately.

Plan the introduction using the database's supported validation and change mechanisms. Consider lock behaviour, execution time and concurrent writes. The [live database change guide](/reados/collections/database-performance-concurrency-and-change/changing-a-live-database-safely/) provides the broader change-management context.

## Test every supported route into the database

A rule enforced only through the main screen can fail through an import, integration, maintenance script or background job. Inventory those routes and establish which database identity and permissions each uses.

Test direct violations through each supported route where practical. Confirm that the database rejects them and that the caller handles rejection without partial or misleading results. Test batch operations as well as individual records.

Then test concurrent attempts using controlled sessions. For uniqueness, have both sessions attempt the same scoped identifier. For a total limit, have both attempt allocations that are individually acceptable against the starting state but jointly exceed the limit.

A passing single-user test does not prove concurrent correctness. Record the expected outcomes: one succeeds and one fails, one waits and rechecks, or a transaction retries and reaches a valid alternative. The outcome should follow from the designed mechanism rather than timing luck.

## Make failures useful to people

Constraints need clear names and application error handling. A rejected write should explain which business condition could not be met and what the user can do next. A generic failure message can encourage repeated attempts without resolving the cause.

Do not expose sensitive record details while explaining a conflict. A duplicate-reference message can identify the relevant field and scope without revealing information the caller is not authorised to see.

Monitor repeated constraint failures. They can indicate user confusion, a broken integration, an outdated rule or a concurrent workflow that needs better coordination. Rejection protects data, but a rising rejection rate is still operational evidence worth investigating.

Treat constraint definitions as maintained business rules. Changes should have an owner, rationale, migration plan and tests. An undocumented exception embedded in code can become as difficult to manage as the inconsistent data the constraint was meant to prevent.

## Build an integrity argument, not a collection of checks

A reliable design explains how its controls work together. The interface helps people enter meaningful data. Declarative constraints protect expressible invariants. Transaction logic handles multi-step operations, permissions restrict sensitive paths and monitoring reveals recurring failures.

For a small business, begin with the rules whose violation would cause the most confusion or operational harm. Identify their scope, enforce them through the appropriate mechanism and test the routes that can challenge them.

The result is more than a database that rejects bad rows. It is a system whose stored facts remain consistent with clearly stated business rules, even when information arrives through different applications and several people work at once.

---

*Source: Lex de Haan and Toon Koppelaars, Applied Mathematics for Database Professionals (2007), particularly the distinction between integrity rules and business logic and the enforcement strategies in chapter 11; PostgreSQL constraint documentation linked above. Receipt and concurrency examples are original illustrations. Product-specific enforcement must be verified in the deployed database.*
