---
title: "Mapping supertypes and subtypes to database tables"
description: "Choose a table design for shared and specialised entities by examining identity, overlapping membership, subtype rules, relationships and real query patterns."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

Business records often share a common identity while needing different details. A workshop may track all equipment in one asset register, yet a pressure vessel and a measuring instrument require different attributes and different supporting records. A data model must represent both what they share and what makes each kind distinct.

A **supertype** represents the common entity, while a **subtype** represents a more specific class within it. Drawing that relationship is relatively straightforward. Translating it into tables requires decisions about membership, constraints, references and how the records will change over time.

The best design depends on the facts the system must preserve. Counting tables or following an object model mechanically can obscure those facts. Start with identity and business rules, then compare the available table arrangements against the workload.

## Establish whether the distinction is really a subtype

Suppose a maintenance system distinguishes general assets, pressure vessels and measuring instruments. This is an illustrative example. Each asset has an identifier, an owning site and an acquisition date. A vessel has a design-pressure attribute, while an instrument has a measurement range. The details describe persistent characteristics of particular assets.

Now consider a different distinction: available, under repair and retired. These are usually states an asset moves through, rather than different kinds of entity. Creating a table for each state can make every state transition look like an identity migration and complicate the history of the asset.

Roles need separate thought too. A company may act as both a customer and a supplier. Those memberships can overlap and may change independently. Modelling them as mutually exclusive kinds of company would impose a rule the business does not actually have.

Ask whether the proposed subtype has its own meaningful attributes, relationships or rules. A label used only to group otherwise identical records may belong in a classification field or relationship. Introducing a new table for every label can create structural complexity without adding integrity.

Also distinguish an entity from its component. A machine containing a measuring instrument is not necessarily itself an instrument. An ownership or composition relationship may express the situation more accurately than inheritance. The test is whether every instance of the proposed subtype is genuinely an instance of the supertype.

## Decide whether membership overlaps and whether it is complete

Two independent questions shape subtype design. First, may an entity belong to more than one subtype? Second, must every entity belong to at least one of the recognised subtypes? These rules should be explicit before choosing tables.

**Disjoint** subtypes prohibit overlapping membership. **Overlapping** subtypes permit it. A classification of a particular asset may be disjoint in one organisation, while an asset-role model allows several memberships. Neither interpretation follows automatically from drawing several branches below a common box.

**Total** specialisation requires every supertype instance to appear in a subtype. **Partial** specialisation permits a general instance without any of the listed specialisations. An asset register that begins with minimal information may deliberately allow unclassified assets. A narrowly defined system may require classification before a record becomes active.

Completeness can also depend on lifecycle state. A draft asset might temporarily lack specialist details, while an approved asset must have them. That is more precise than declaring that missing subtype rows are either always valid or always invalid.

Document these rules with examples and counterexamples. Can one identifier belong to both specialist tables? Can a general asset exist without either? What must be true when it is released for operational use? The answers determine which invalid states the database must prevent and which intermediate states the application must manage.

## One table keeps identity and common access together

The first arrangement stores common and specialist attributes in one table. A type indicator identifies the intended subtype where membership is disjoint. The asset identifier remains one primary key, and every reference to an asset can point to the same table.

This arrangement makes common queries direct. Listing all assets at a site requires no union across subtype tables. Retrieving the shared and specialist details of one asset may also require only one row. Those benefits can be useful when the specialisations are small and most access concerns the common entity.

The challenge is conditional meaning. A design-pressure column may be required for vessels and inapplicable to instruments. A measurement-range column may have the opposite rule. Allowing both columns to be nullable does not by itself express either requirement.

Define the valid combinations explicitly. Depending on the database, suitable row-level checks can relate the type indicator to required and prohibited values. The treatment of nulls must be deliberate: a condition that evaluates to an unknown result can behave differently from a condition that evaluates to false.

Overlapping membership makes a single discriminator less suitable. Encoding every combination as a new type value can become difficult to maintain. Separate membership relationships or another arrangement may better represent independent roles. The convenience of one table should not force a complex business classification into an artificial exclusive list.

## Specialist relationships need specialist guarantees

Suppose a pressure inspection applies only to a vessel. A foreign key from inspection to the general asset identifier proves that an asset exists. On its own, it does not prove that the asset is a vessel.

```figure
type: svg
title: Proving the asset is a vessel
alt: A pressure inspection record points to the general asset table, which proves only that some asset exists. A second arrow points to a vessel table, which proves the asset is a vessel.
caption: A foreign key to the general asset proves an asset exists, not that it is a vessel.
viewbox: 0 0 600 200
body:
<rect class="bxa" x="20" y="80" width="170" height="44" rx="6"/>
<text class="txb" x="105" y="107" text-anchor="middle">Pressure inspection</text>
<rect class="bx dsh" x="380" y="24" width="190" height="44" rx="6"/>
<text class="tx" x="475" y="51" text-anchor="middle">Asset: some asset exists</text>
<rect class="bx" x="380" y="136" width="190" height="44" rx="6"/>
<text class="txb" x="475" y="163" text-anchor="middle">Vessel: it is a vessel</text>
<path class="ln dsh" d="M190 94L380 46"/>
<path class="la flow" d="M190 112L380 158"/>
```

This distinction matters even when the application normally shows only eligible assets in a selection list. Imports, administrative scripts and other applications may write the same database. The structural guarantee should be assessed independently of a particular screen.

There are several possible designs. A separate vessel table provides a direct reference target. In a single-table design, some schemas use a type-qualified candidate key and a corresponding constrained reference. Other designs enforce eligibility through a controlled write path or database logic. The appropriate mechanism depends on the engine and the complete set of rules.

Do not assume that adding a type column to the inspection record is enough. Unless the columns are constrained together against the referenced asset, the inspection can claim one type while the asset has another. Duplicated classification values create an additional consistency obligation.

Deletion and reclassification need the same scrutiny. If an asset has specialist inspections, can its subtype change? Must the historical relationship remain meaningful? The answer may require retaining the old classification with effective dates instead of replacing the current label and silently changing the interpretation of existing records.

## A common table plus subtype tables separates shared facts

The second arrangement stores shared attributes in an asset table and specialist attributes in separate tables. Each specialist table uses the asset identifier as its primary key and as a foreign key to the common table. This expresses that a specialist record belongs to one existing asset.

Common relationships can reference the asset table. Specialist relationships can reference the appropriate subtype table. Required specialist attributes can often use ordinary non-null constraints because irrelevant asset kinds never appear in that table.

The arrangement also avoids repeating shared attributes across subtype records. An ownership change is recorded in the common asset row, even if the asset has several recognised roles. This is particularly useful where membership overlaps and the shared identity must remain stable.

However, the obvious foreign keys enforce only part of the model. They prevent a subtype row without a corresponding supertype row. They do not automatically require every supertype to have a subtype, or prevent the same identifier from appearing in two subtype tables.

Those additional rules require an explicit design. It might use a membership structure, constrained type information, deferred validation where supported or a carefully controlled transactional operation. The implementation must account for concurrency; checking that another subtype row is absent before inserting can race with another writer unless the decision is protected.

## Consider the transaction that creates a complete entity

Creating a specialised asset in several tables raises a practical question: when does the entity become complete? If the common row commits first and the specialist row is added later, other readers can observe the intermediate state unless access rules deliberately exclude it.

One option is to create the relevant rows within a single local transaction. Another is to represent a draft state and permit incomplete information until approval. These options express different business workflows. The database design should support the chosen workflow rather than leaving incompleteness accidental.

Updates need similar care. Changing an asset's subtype may involve removing one specialist row, creating another and checking dependent relationships. A sequence of independently committed changes can leave either a gap or an unintended overlap. Define the full transition and its failure behaviour.

Consider what remains invariant during the transition. The asset identifier may remain stable, while specialist relationships need closure or migration. Historical inspections should not be reassigned merely because the current representation has changed. Their meaning may depend on the asset's classification at the time of inspection.

Deletion rules should also distinguish retiring an asset from erasing it. Automatically cascading a deletion through specialist records can remove information still needed to explain past work. Select retention and deletion behaviour from the record's purpose, then configure the relationships accordingly.

## A table for each concrete kind makes common identity harder

The third arrangement stores a complete record in each concrete subtype table, including the shared attributes. There may be no separate common table. Each table can have direct specialist constraints, and independent teams may find the local structure straightforward.

The cost appears when the system needs to treat every subtype as one population. A combined asset list requires a union or another integration layer. Shared changes may require coordinated schema updates in several places. Definitions that begin identical can drift as each table evolves.

Identity requires particular attention. If both the vessel table and the instrument table generate identifier 500 independently, the number alone does not identify an asset across the system. A common reference needs a globally unique identifier, a qualified identity or another reliable structure.

```figure
type: compare
title: Three ways to map assets, vessels and instruments
cols: Strength | What needs care
caption: Compare the workload and the states the model must prohibit before choosing.
- One table with a type indicator | Common queries are direct | Conditional columns must be constrained by type
- Common table plus subtype tables | Shared facts stored once | Creating a complete entity spans tables
- *A table per concrete kind | Each kind self-contained | Identity across the system is harder
```

A pair of fields such as entity type and entity identifier can tell an application where to look. In many ordinary relational designs, however, that pair does not automatically behave like a foreign key referencing one of several tables. The design must address missing targets, deletions and concurrent changes explicitly.

This arrangement can make sense when the supposed common entity has little operational importance and the concrete populations are genuinely independent. If most relationships, reports and controls repeatedly reconstruct a common entity, the model may be signalling that a common table has a real role after all.

## Compare workload shapes without assuming the winner

Performance follows the actual queries, data distribution and implementation. It is too simplistic to say that one table is always fast or that a design with joins is inherently slow. A narrow, indexed join can be inexpensive; a wide scan across mostly irrelevant rows can be costly.

List representative operations before benchmarking. Include common asset searches, specialist detail screens, bulk imports, changes to shared attributes and reports combining several kinds. Measure with realistic proportions of each subtype and realistic numbers of related records.

For the common-plus-subtype arrangement, inspect whether the application retrieves specialist details only when needed. Loading every subtype for every asset can waste work even when the schema is reasonable. Conversely, issuing one separate query per displayed asset can introduce avoidable round trips.

For a single table, inspect the width of frequently accessed data and the selectivity of type-specific queries. For concrete tables, inspect the cost and maintenance burden of union queries and shared reporting definitions. Index choices should follow those operations rather than the visual symmetry of the model.

Include write behaviour and integrity checks in the comparison. A query-only benchmark can favour an arrangement that makes updates complicated or allows invalid combinations. The useful result is a design that meets workload targets while preserving the rules the organisation actually depends on.

## Test the states the model is meant to prohibit

A subtype test set should try to create invalid membership combinations deliberately. Attempt a specialist row without a common entity. Omit a required specialist attribute. Create overlapping membership where it is prohibited. Create an active general entity without a subtype where completeness is required.

Test relationships as well as rows. An inspection restricted to vessels should not accept an ordinary asset merely because its identifier exists. Reclassification should respect existing dependent records. Deletion should follow the intended historical and operational rules.

Concurrency tests matter where enforcement spans tables. Two writers may each observe that no conflicting membership exists and then add different subtypes. A test that performs the operations sequentially will miss the race. The chosen transaction or constraint mechanism must protect the combined rule.

Migration tests should verify identity continuity. Moving from one arrangement to another can accidentally create duplicate common entities, lose specialised attributes or detach references. Compare counts by subtype, missing relationships and representative complete entities, including unusual overlaps and unclassified drafts.

Include an unfamiliar future subtype in the review. Identify which common queries would include it automatically, which screens would need explicit support and which validation rules might reject it. A report with a fixed list of recognised type codes can silently omit a newly introduced kind even when the storage design accepts it correctly. Schema flexibility and application readiness are separate concerns. Record the extension points so that adding a subtype becomes a controlled change with visible consequences.

The final review should return to business language. Can the system represent every legitimate kind of asset and reject the combinations the business prohibits? Can it preserve identity through change and explain historical relationships? Those answers are more informative than whether the tables resemble a familiar inheritance diagram.

## Source basis

The source collection's *Beginning Relational Data Modeling*, second edition, compares rolled-up, rolled-down and expanded implementations in its discussion of creating tables from logical categories. *Data Access Patterns* considers related choices when mapping objects to relational storage. *Database Design for Smarties: Using UML for Data Modeling* provides additional background on generalisation and specialisation.

This article uses those modelling ideas to develop an original asset-register example. Product-specific constraint syntax and enforcement capabilities vary, so the design should be checked against the chosen database before implementation.
