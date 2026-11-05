---
title: "Replacing overloaded status codes in databases"
description: "How to separate independent business facts hidden inside one status code, choose flags or related records appropriately, and migrate old meanings without inventing missing information."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - design
  - operations
author: "BIZOMAT"
featured: false
draft: false
---

A job begins with a simple status field: new, active or complete. Later, the business needs to distinguish urgent work, customer holds and jobs awaiting material. The field acquires values such as active-urgent, active-held and active-urgent-awaiting-material. Every report now needs to know which combinations mean “active”.

The difficulty is not necessarily the number of labels. One column may be carrying several different facts: the job's lifecycle stage, its priority and the reason work cannot proceed. As these facts change independently, the combined codes become harder to interpret, update and extend.

Separating the meanings can simplify the model, but replacing every code with a collection of yes-or-no flags is not a universal solution. A sound redesign first identifies which facts are independent, which are mutually exclusive and which require their own relationships or history.

## Identify the questions hidden inside a code

Take several actual codes and explain each in ordinary language. “Active and urgent but waiting for material” contains at least three statements. The lifecycle says the job is active. Priority says it is urgent. A blocking condition says material is unavailable. None of these statements should be assumed to define the others.

Ask how each fact changes. A job can remain active when its priority changes. It can remain urgent after material arrives. It might have both a material shortage and a customer approval hold. If the facts can vary independently, one combined label requires a growing vocabulary to represent them.

Also ask who is authorised to change each fact. Planning may set priority, an account manager may record a customer hold, and production may complete the job. One editable status field can let a person alter several facts accidentally when they intend to change only one.

Record these findings before choosing columns. The purpose is to improve the representation of the business, not simply to shorten a list of codes. If the meaning of a code is disputed, changing its storage format will not resolve that dispute.

## Distinguish independent properties from lifecycle states

A lifecycle state normally identifies one position in a defined progression. A job might be draft, released, completed or cancelled. The model may require exactly one such state at a time. Replacing that field with four independent booleans permits combinations such as completed and cancelled unless additional rules prevent them.

An independent property answers a separate question. A job can be urgent whether it is draft or released. If the business genuinely recognises only yes and no, a boolean can express that property clearly. If “not yet assessed” is also meaningful, the design needs to represent it deliberately.

A repeated condition may deserve related records. A job can have several simultaneous holds, each with a reason, owner, opening time and resolution. Adding a boolean column for every possible hold reason would make the table grow whenever the business recognises another kind of hold.

These distinctions produce a more useful question than “should we use flags?” Ask whether the fact is a single choice, an independent property or a collection of occurrences. The storage structure should follow the answer.

## Compare candidate representations

Different representations solve different problems. A short, stable list of mutually exclusive states often works well as one constrained code. Independent yes-or-no facts can use booleans. A changing or repeatable set of classifications often suits a relationship table.

| Business meaning | Possible representation | Important rule |
|---|---|---|
| Exactly one lifecycle state | State code with controlled values | Only permitted transitions are accepted |
| Independent assessed property | Boolean or explicit assessment state | Unknown must not silently become false |
| Several simultaneous hold reasons | Related hold records | Each occurrence has its own identity and resolution |
| One priority from an ordered scale | Priority code or related reference | Ordering has an agreed meaning |

The table is a starting point rather than a mandate. A very simple application may not need separate hold occurrences. However, the design should acknowledge what is lost if it stores only a current yes-or-no indication, such as the ability to distinguish two holds opened and resolved at different times.

Avoid replacing understandable codes with an unexplained numeric bitmask merely to reduce storage. Bitmasks can be appropriate under specific constraints, but they make ordinary reporting and constraints less transparent. The space saved may be irrelevant compared with the cost of misinterpreting the data.

## Work through the growth of combined codes

This is an illustrative example. A workshop distinguishes three lifecycle states: draft, released and complete. It also records whether a job is urgent and whether customer approval is outstanding. If every combination is meaningful, a combined code needs three times two times two, or twelve, possible values.

Adding a separate yes-or-no material hold doubles the combinations to twenty-four. Adding a further independent property doubles them again to forty-eight. The business has not necessarily become much more complicated; the code vocabulary has expanded because it bundles independent dimensions together.

```figure
type: bars
title: How a combined status code grows
max: 50
caption: Three lifecycle states, then each independent yes-or-no property doubles the vocabulary.
- State, urgent, approval outstanding | 12 | 3 × 2 × 2
- Plus a material hold | 24
- *Plus one more property | 48
```

A separated model can retain one lifecycle field and explicit representations for the independent facts. A report for released jobs no longer needs to enumerate released-normal, released-urgent, released-held and every future combination. It can select lifecycle equal to released and then apply additional conditions only when relevant.

Not every theoretical combination will be valid. A completed job might not be allowed to retain an active production hold. That is a rule to state and enforce. It is not a reason to return to a single opaque code whose valid combinations are understood only by a few experienced staff.

```figure
type: compare
title: Separating what one code was doing
cols: Representation | Rule
caption: Unknown must never silently become false.
- Lifecycle | One state field, controlled values | Only permitted transitions
- Assessed property | Boolean or explicit assessment state | Unknown kept distinct
- *Hold reasons | Related hold records | Each with its own resolution
- Priority | An ordered code | Agreed ordering
```

## Preserve the difference between false and unknown

Legacy data may not reveal every new property. If an old code simply says active, it might mean “active, with no holds” or “active, hold details not recorded in this system”. Assigning false to every new hold flag chooses the first interpretation without evidence.

Classify each mapping as known, inferred or unresolved. Known mappings follow a documented meaning. Inferred mappings depend on an explicitly approved assumption. Unresolved records need review or a representation that retains uncertainty until the missing fact can be established.

The user interface should support that policy. A checkbox that can represent only checked or unchecked may be unsuitable during migration if records can legitimately be unassessed. An explicit “not reviewed” state can prevent staff from mistaking incomplete migration data for a confirmed negative.

After the migration, decide whether unknown remains a valid business state. If it does not, establish how and when it must be resolved. Do not simply make the column non-null and backfill a convenient default to satisfy the database schema.

## Build a mapping table before a conversion script

Create a table with each legacy code, its agreed meaning and the new values or relationships it implies. Include codes found in actual data, not only values listed in an old specification. Retired, misspelt and undocumented values often reveal where the system's real behaviour diverged from its design.

Have people responsible for the process review the mapping. Developers can identify where codes are read and written, but operational staff may know that one label changed meaning several years ago. Historical records may therefore require a mapping that also considers an effective period or source system.

Preserve the original code through the conversion process. This gives reviewers a way to explain how a new representation was produced and allows exceptions to be investigated. Once the migration is accepted, retention of the old value should follow an explicit purpose and policy rather than becoming another permanent source of truth by accident.

Test the mapping on a copy of the records. Count the source population, converted population and unresolved population. Every source record should have an explained outcome. A successful script exit is weaker evidence than a reconciliation showing which meanings were preserved.

## Plan compatibility around information loss

During transition, old applications may still expect one combined status code. A compatibility layer can derive that code from the new representation only if the new state has a valid legacy equivalent. New combinations may carry information the old vocabulary cannot express.

For example, an old system may recognise one hold reason while the new model permits several. Compressing two active holds into a single legacy code loses information. If the old application writes that code back, it may unintentionally remove a hold it never knew existed.

Define which side owns each fact during the transition. Restrict new combinations until old writers are retired, make old access read-only where practical, or provide a controlled translation that rejects ambiguous updates. Bidirectional synchronisation without a conflict policy can make the migration less reliable than the original field.

Document the retirement condition for compatibility logic. Identify the remaining consumers, how their usage will be checked and what proves they have moved to the new model. A temporary mapping that nobody is responsible for removing often becomes a second undocumented design.

## Keep state transitions explicit

Separating properties should make legitimate changes more precise. A command to raise priority should change priority while preserving lifecycle and holds. A command to resolve a material hold should identify the relevant hold and record its resolution, rather than selecting a new combined code from a menu.

Lifecycle changes may still require coordinated checks. Completing a job might require an accepted inspection, no unresolved mandatory hold and an authorised user. These conditions should be evaluated under an appropriate transaction and concurrency policy so they remain valid at acceptance.

Do not scatter transition rules across reports and user interfaces. A report can display state, but it should not become the only place where invalid combinations are noticed. Shared application rules and suitable database constraints provide stronger protection for imports and background processes too.

Keep an audit or business history where the workflow requires it. A current `urgent` value cannot explain when the job became urgent or who changed it. The article on [keeping history in business data](/reados/collections/reporting-history-and-analytical-data/keeping-history-in-business-data/) covers the distinction between current attributes and the record of accepted changes.

## Rewrite reports around the new meanings

Search for every report that groups or filters by the old code. Some reports intentionally combine lifecycle and priority; others inherited that combination because it was the only field available. The redesign creates an opportunity to make those reporting choices explicit.

A backlog report may group by lifecycle while showing hold counts separately. A priority queue may include only released work, then order by the priority field. A hold-resolution report may operate on hold occurrences rather than job rows. These are different populations and should have distinct definitions.

Compare old and new reports on the same fixed data. Differences should be traced to an approved change in meaning or a corrected defect. Do not demand byte-identical reports if the old model demonstrably hid valid combinations, but do explain each material difference before release.

Update labels as well as queries. Replacing the database model while leaving a screen labelled simply “status” can preserve the original confusion. Clear labels such as lifecycle, priority and active holds help staff understand what they are changing.

## Avoid performance claims without measurement

Boolean predicates can be simple to read, but a boolean column is not automatically a useful standalone index. If most records share the same value, a query may still need to examine a large portion of the table. Workload, selectivity and combinations of conditions matter.

Choose the model for correct business meaning, then measure representative queries. An index combining lifecycle with a scheduling field may support a particular work queue better than separate indexes on every flag. The database's execution plan and actual data distribution should guide that decision.

Also consider write behaviour. A growing set of stored flags can become inconsistent with the related records from which they are derived. If “has active hold” is merely a convenience summary of hold occurrences, define how it is maintained and reconciled. Otherwise, reports may disagree depending on which representation they read.

Avoid converting an overloaded code into an equally overloaded collection of fields. Names such as flag1 and flag2 merely distribute ambiguity across more columns. Each property should have a definition, permitted values, owner and source of truth.

## Test combinations and migration boundaries

Construct a small fixture covering every meaningful combination and each prohibited state. Include records with unknown legacy codes, missing assessments, multiple active holds and historical code meanings. Check both conversion results and the behaviour of permitted application updates.

Test a priority change while lifecycle remains unchanged. Test resolving one of two holds while the other remains active. Test an old client attempting to write a code that cannot represent the new state. These examples expose information loss more effectively than a test containing one record per obvious legacy label.

Verify that counts reconcile after conversion and that repeated execution does not create duplicate hold occurrences. Capture exceptions in a reviewable list with their original values. A migration should make uncertain records easier to investigate, not hide them among apparently clean defaults.

## Make the redesign useful to the people doing the work

For a small Australian business, start with a status menu that staff regularly debate or misuse. Collect examples of the work they are trying to describe. Often the conversation reveals several independent decisions that have been compressed into one field for convenience.

Agree on those decisions before commissioning the data change. A modest redesign can make reports simpler and updates more precise, but it also changes how people describe their work. Provide examples of common actions and clarify who owns each kind of change.

The objective is an explicit model of business facts. Keep mutually exclusive lifecycle choices together, represent independent properties separately and give repeatable conditions their own records when their history matters. That produces a system that can grow without inventing another combined status every time two ordinary conditions occur together.

---

*Source basis: original BIZOMAT editorial analysis prompted by Replace Type Code With Property Flags in the supplied Refactoring Databases: Evolutionary Database Design (2006). The workshop model and migration examples are hypothetical. Historical performance claims and product-specific migration scripts are not adopted as general recommendations.*
