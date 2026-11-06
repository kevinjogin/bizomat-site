---
title: "Soft deletion, uniqueness and record lifecycle"
description: "Design logical deletion around record identity, active uniqueness, historical relationships, restoration and eventual removal instead of relying on a flag alone."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - operations
author: "BIZOMAT"
featured: false
draft: false
---

Adding a deleted flag to a database table can seem like an easy way to make removal reversible. The row stays in place, the application hides it and someone can restore it if necessary. The difficulty is that other parts of the system may still treat the row as a current participant in relationships, searches and uniqueness rules.

**Soft deletion** marks a record as logically removed while retaining its stored representation. It is a state transition with consequences for the whole data model. A flag by itself does not define those consequences.

The design needs to answer what removal means, which relationships remain valid, whether identifiers can be reused and what restoration promises. Those decisions distinguish a coherent record lifecycle from an accumulation of hidden rows that different applications interpret differently.

## Separate removal from retirement, cancellation and erasure

A record can leave ordinary use for several reasons. An asset may be retired, a booking cancelled, a draft abandoned or an accidentally created duplicate removed. These events differ in their business meaning and in the information that should remain visible.

Consider a catalogue of inspection templates. This is an illustrative example. A template that has been superseded should no longer be offered for new inspections, but completed inspections still need to identify the version used. Marking it deleted without preserving that distinction can make historical work appear to reference an invalid record.

Retirement may therefore be a more accurate state than deletion. The record remains a legitimate historical object while becoming unavailable for new selection. Cancellation similarly records a business outcome rather than asserting that the original request never existed.

Physical erasure is another operation again. A row retained behind a filter has not been erased from the database, backups or other copies. A design should not describe soft deletion in language that implies those stronger effects.

Start with a vocabulary of lifecycle states and transitions. Determine which are reversible, which require a reason and which affect dependent work. The eventual representation may use a flag, a timestamp or a richer state model, but the representation should follow the meaning rather than substitute for it.

## Define which population each query should see

Soft deletion divides records into populations. A selection list may need only active templates. A historical inspection report needs the specific template originally used, including retired versions. An administrative review may need every record with its lifecycle state.

Applying an active-only filter everywhere would be as misleading as applying it nowhere. The right population depends on the question. Query design should name that population explicitly instead of relying on an undocumented default inherited from an application framework.

Default filters can reduce accidental exposure in routine screens, but they need controlled exceptions. An audit view that bypasses the filter should be intentional and appropriately authorised. A raw reporting query that omits it accidentally can produce inconsistent counts and confusing search results.

Centralise common definitions where practical. A view or data-access method can express the current-record population consistently. However, callers still need to know whether the interface includes retired records and how to retrieve historical references correctly.

Check secondary systems as well. Search indexes, caches and analytical copies may continue showing a record after the primary application hides it. Define how the lifecycle change reaches each representation and what users should see while that propagation is incomplete.

## Uniqueness must specify whether inactive records count

Suppose active inspection templates have a unique short code. After template CHECK-7 is retired, may another template use CHECK-7? Both answers can be reasonable, but they create different identity rules.

If the code remains permanently reserved, an ordinary uniqueness rule across all records may express the intended policy. If reuse is allowed only after retirement, the constraint must distinguish active records from retained history.

Do not assume that adding the deleted flag to a unique key solves every case. A unique combination of code and a Boolean deletion flag allows at most one active and one deleted record for a code. It does not permit an arbitrary sequence of retired versions sharing that code.

Some databases support uniqueness over a filtered population. PostgreSQL, for example, documents partial unique indexes that can enforce uniqueness among rows satisfying a predicate. The available mechanism and its interaction with nulls and other constraints must be checked for the chosen engine.

Whichever mechanism is used, enforce the rule where competing writers cannot both claim the same active code. Checking for an existing active record and then inserting without a protected constraint or equivalent concurrency control leaves a race. The business rule applies to the combined outcome, not just each writer's earlier observation.

## Keep reusable labels separate from stable identity

If a short code can be reused, it should not be the only information identifying a historical record. A completed inspection that stores only CHECK-7 may become ambiguous after the code is assigned to a different template.

Use a stable identity for relationships that must survive lifecycle changes. The display code can remain useful to people while the underlying reference points to the exact template or version. Reports can then show the code alongside the retained identity and relevant historical description.

This distinction matters for imports and external integrations. Another system may continue sending an old code after it has been reused. Without a version, effective date or agreed identity mapping, the receiver may attach the message to the wrong record.

Define a reuse policy that accounts for those delays. Immediate reuse might be unsuitable when external systems retain codes for long periods. A reserved interval can reduce confusion, but it does not replace a reliable identity contract where historical references matter.

Also consider human search. If several retained records share a code, administrative results need enough context to distinguish them. The interface should not silently choose the newest row when the user is trying to investigate an older event.

```figure
type: decision
title: After CHECK-7 is retired, may another template use the code?
question: Do retired records count for uniqueness?
caption: Both answers can be reasonable, but they create different identity rules.
- Yes, they count | The code is never reused | it can safely identify history
- *No, only active records | The code can be reused | history needs a stable identifier too
```

## Foreign keys preserve existence, not active eligibility

A foreign key usually verifies that a referenced key exists. If the parent row remains stored after soft deletion, the foreign key can remain satisfied. That does not establish whether a new child record is allowed to reference the inactive parent.

For the template example, an old completed inspection may validly reference a retired template while a new inspection must not select it. Those are two different rules involving the same relationship. A general existence constraint cannot express the full lifecycle policy by itself.

Choose an enforcement mechanism for new references and transitions. The rule may be implemented through a controlled operation, additional schema structure or suitable database logic. It needs to handle concurrency between retirement and creation of a new dependent record.

An application that checks active status before inserting can race with another operation retiring the parent. Decide which outcome should prevail and protect that decision through the chosen transaction design. Do not rely on a selection list remaining accurate between display and submission.

Historical relationships should remain interpretable. If a parent is hidden from ordinary queries, a report joining through an active-only view may make legitimate child records disappear. Test historical reporting against the retained population rather than assuming the same join target serves both current selection and past explanation.

## Decide what happens to dependent records

Soft-deleting a parent does not automatically define the fate of its children. Should they remain active, become inactive, prevent the transition or enter a separate review process? The answer depends on what the relationship means.

For a disposable draft, removing the parent may appropriately remove its draft-only details from ordinary use. For a customer with completed transactions, the same behaviour could hide records that still need to be reported. A uniform cascade policy across every relationship is unlikely to fit both cases.

Avoid confusing database deletion cascades with lifecycle cascades. A physical foreign-key cascade responds to a particular deletion operation. Updating a logical deletion flag is a different change and may not activate the same behaviour.

If dependent states change automatically, define the scope and record why they changed. A child may already be inactive for another reason. Restoring the parent should not necessarily reactivate that child, because doing so could reverse an independent decision.

Large dependency graphs also create operational concerns. Changing thousands of related rows can hold locks and produce substantial downstream work. The transition may need a controlled process with visible progress. Its intermediate states must be acceptable to readers rather than being accidental consequences of a long update.

```figure
type: layers
title: Not every removal is a deletion
caption: Define which population each query should see before choosing a mechanism.
- Retirement | no longer offered; history kept
- Cancellation | an accepted record withdrawn
- Soft deletion | hidden from normal use
- *Erasure | removed, for example on a lawful request
```

## Restoration is a fresh validation event

A retained row is not necessarily safe to restore unchanged. Other records may have claimed its former code, its parent may have been retired or its required reference values may no longer be valid. The conditions that held at deletion time may no longer hold now.

Treat restoration as a defined operation that checks current rules. Explain conflicts to the user and provide legitimate resolutions, such as assigning a new display code or restoring a required dependency through a separate authorised action.

Do not silently overwrite a newer active record to make room for an old one. The newer record has its own identity and relationships. A restoration conflict should make that competition visible rather than treating the inactive row as inherently more authoritative.

Preserve the restoration history. Record the actor, reason and resulting state where the application requires accountability. A single nullable deletion timestamp cannot, by itself, represent several delete-and-restore cycles or explain why each occurred.

Test partial failures. If restoring a parent requires restoring related configuration, the operation should either complete within an appropriate atomic boundary or expose a controlled incomplete state. A button labelled restore should make a promise that the underlying process can actually keep.

## Retained rows still have storage and maintenance costs

Soft deletion leaves data in the system. Tables, indexes, backups and replication streams can continue carrying those records. A workload that removes many rows from active use may therefore keep growing physically even while the visible active population remains small.

Query performance depends on how active and inactive records are accessed. An active-only lookup may benefit from an appropriate index, while historical reports need a different access pattern. Index design should follow both workloads and the distribution of lifecycle states.

Measure the inactive population and its age rather than assuming it is negligible. A small percentage can still represent a large amount of data in a high-volume table. Conversely, a large percentage may be acceptable if the retained records are small and rarely accessed.

Maintenance and eventual removal need ownership. Define when a retained record becomes eligible for physical deletion or archival handling, which dependencies must be checked and what evidence establishes completion. Those decisions should reflect the organisation's actual retention requirements without being hidden in a generic cleanup task.

The process must include derived copies where relevant. Purging a primary row while leaving an unrestricted search document or export can produce an inconsistent lifecycle. Inventory the representations that the application controls and define the intended treatment of each.

## Test visibility and lifecycle transitions together

Build tests around representative record histories. Create an active template, use it, retire it, attempt a new use, reuse its display code if permitted and then attempt restoration. Inspect both the current interface and historical reports after each step.

Test concurrent operations that compete over active uniqueness or eligibility. Two writers may attempt to restore different records with the same code. One may create a dependent record while another retires its parent. The database outcome should follow the documented rule in each case.

Include bypass paths such as imports, batch jobs and administrative tools. A lifecycle rule enforced only in the main application's interface may be absent from another writer. Check the actual shared enforcement boundary rather than assuming every caller behaves identically.

Verify counts as well as individual screens. Current-record totals, historical totals and all-record administrative totals should differ only for understood reasons. A soft-delete filter applied on one side of a report but omitted on another can create unexplained discrepancies.

Finally, test the eventual removal process in a representative environment. Confirm that it does not erase required relationships, that failures are visible and that retrying does not create inconsistent state. Logical deletion and physical cleanup are connected parts of one lifecycle, even if they occur far apart in time.

## Make the lifecycle contract explicit

Document the meaning of each relevant state, the permitted transitions and the population exposed by each interface. Include whether display identifiers can be reused, how references survive reuse and what restoration does when current rules conflict with old data.

Keep this contract close to the schema and data-access interfaces. A note in an old design presentation is unlikely to guide a new reporting query or integration. Review changes to filters and uniqueness rules as changes to the data contract.

Use terminology consistently in user messages. Retired, cancelled, hidden and deleted should not be interchangeable labels if they imply different outcomes. Clear language helps people understand whether a record can still be referenced, restored or included in a historical report.

Soft deletion is useful when retained identity and reversible removal serve a genuine purpose. Its reliability comes from the surrounding lifecycle design: population rules, stable references, concurrent enforcement and deliberate restoration. Without those decisions, a convenient flag can distribute ambiguity throughout the system.

## Source basis and further reading

The source collection's *Refactoring Databases: Evolutionary Database Design* discusses introducing soft deletion and the resulting changes to read and write paths. This article develops an original template-lifecycle example and does not reuse the book's historical trigger code or default-value conventions.

PostgreSQL's [partial-index documentation](https://www.postgresql.org/docs/current/indexes-partial.html) describes predicate-based indexes, including partial uniqueness. Its [constraint documentation](https://www.postgresql.org/docs/current/ddl-constraints.html) explains the guarantees of unique and foreign-key constraints. Verify equivalent capabilities and semantics for the database actually used.
