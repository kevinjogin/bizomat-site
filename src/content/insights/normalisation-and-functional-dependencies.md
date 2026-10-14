---
title: "Normalisation and functional dependencies in database design"
description: "Use functional dependencies to separate business facts, prevent update anomalies and review database normalisation without reducing design to a checklist."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - design
  - quality
author: "KEVOS®"
featured: false
draft: false
---

A table can contain valid-looking rows and still make accurate maintenance unnecessarily difficult. Changing a supplier's name may require editing hundreds of records. Deleting an obsolete product may accidentally remove the only record of a supplier. Adding a new process may be impossible until an unrelated transaction exists.

**Normalisation** is a method for examining these structural problems. It uses rules about how facts depend on identifiers and on other facts to guide the separation of tables. The objective is to make the database represent the business consistently as records are inserted, changed and removed.

The most useful starting point is the **functional dependency**: a statement that one set of attributes determines another. Understanding that statement makes normalisation a reasoning tool rather than a ritual of splitting wide tables until they look sufficiently technical.

## Read a dependency as a business rule

A dependency written `supplier_id -> supplier_name` means that rows agreeing on supplier identifier must agree on supplier name within the model being considered. It does not mean supplier name determines supplier identifier, and it does not mean a supplier's name can never change.

The rule concerns the meaning and scope of the data. If the table stores current supplier details, one current name per identifier may be appropriate. If it stores historical names, the determinant may need a version or effective-time component.

A **determinant** is the attribute or attribute combination on the left side of a dependency. A candidate key is a minimal set of attributes that determines every attribute in the relation. Minimal means that no attribute can be removed while retaining that identifying property.

These rules come from the business domain, not merely from the rows currently present. A sample containing unique supplier names cannot prove that names will always be unique. Observed duplicates can disprove a proposed dependency, but observed agreement cannot establish a permanent rule by itself.

Ask domain owners to confirm the intended constraints. Their answers determine whether the schema represents legitimate future cases or only the accidental simplicity of today's data.

## Identify the anomalies before choosing a remedy

An **update anomaly** occurs when one fact is repeated and a change leaves inconsistent copies. An **insertion anomaly** occurs when recording one fact requires another fact that should be independent. A **deletion anomaly** occurs when removing one fact unintentionally removes another.

These problems provide concrete review questions. Can a supplier be registered before a product is ordered? Can the supplier's contact details be corrected in one authoritative place? Can a discontinued product be removed without losing the supplier's existence?

The problem is not repetition of any value whatsoever. Many orders legitimately reference the same supplier identifier. That repeated reference expresses a relationship. Repeating the supplier's current address on every order for no historical purpose creates a different maintenance obligation.

Likewise, repeated transaction amounts may be separate observations, not redundant copies of one fact. Normalisation requires understanding what the values claim to represent. It cannot be performed reliably by searching for repeated text alone.

## Work through a supplier-part table

This is an illustrative example. A purchasing database stores one row for each supplier-part combination, with these attributes: supplier identifier, part identifier, supplier name, part description and the supplier's quoted lead time for that part.

Assume the business rules are:

| Determinant | Dependent fact | Meaning |
| --- | --- | --- |
| Supplier identifier | Supplier name | One current name per supplier |
| Part identifier | Part description | One current description per part |
| Supplier identifier and part identifier | Quoted lead time | One current lead time for that supply relationship |

The combined supplier-part identifier is a candidate key under these assumptions. Supplier name depends on only the supplier portion. Part description depends on only the part portion. Lead time depends on the combination.

Separate the model into Supplier, Part and SupplierPart tables. Supplier stores supplier facts, Part stores part facts, and SupplierPart stores facts about the relationship. Foreign keys connect the relationship to its two participants.

The result permits a supplier or part to exist without an established supply relationship. Updating a current supplier name has one authoritative target. Removing a supply relationship need not delete either participant.

This decomposition follows the dependencies. It is not based on an arbitrary maximum number of columns or a preference for small tables.

## Understand partial dependencies

A partial dependency occurs when a non-key attribute depends on only part of a candidate key. The supplier-part example contains two: supplier name depends on supplier identifier, and part description depends on part identifier.

In the usual relational treatment, second normal form addresses such dependencies after first normal form has been established. The practical question is whether every non-key fact belongs to the whole identifying combination or only to one component.

Adding a generated row identifier does not make the underlying business dependencies disappear. The supplier-part combination may still be a candidate key and should often remain subject to a uniqueness rule. Repeated supplier facts remain repeated even if each physical row receives a new number.

This is a common design trap. A table with a single-column surrogate primary key can look simpler while retaining all the maintenance problems of the original structure. Review every candidate key and the actual business rules rather than looking only at the column labelled primary key.

## Understand dependencies through another fact

A table can avoid partial dependencies and still repeat facts that belong elsewhere. Suppose each asset belongs to one maintenance group, and each maintenance group has one current coordinator. Storing the coordinator on every asset repeats a fact about the group.

Under those rules, asset identifier determines maintenance group, and maintenance group determines coordinator. The coordinator depends on the asset through another determinant. This is the kind of dependency examined when moving towards third normal form.

Separating MaintenanceGroup from Asset allows a group coordinator to change without editing every asset. It also allows a group to exist before assets are assigned to it. The Asset table retains a reference to the group.

Check the rule carefully before splitting. If coordinators are actually assigned separately to each asset, the assumed dependency does not hold. A design that enforces one coordinator per group would then exclude legitimate arrangements.

Formal terminology helps organise the reasoning, but it should never substitute for establishing the business meaning. The same column names can represent different dependencies in different organisations.

## Treat first normal form as a modelling decision

Introductory explanations often describe first normal form as keeping one value in each cell and removing repeating groups. This is a useful starting point, especially when a spreadsheet has columns such as supplier one, supplier two and supplier three.

The deeper question is what the chosen data type and attribute represent. A product description can contain spaces and punctuation without becoming a collection of independent facts. A comma-separated list of supplier identifiers, however, usually hides relationships that the application needs to query and constrain separately.

Moving those supplier relationships into rows supports a variable number of suppliers, uniqueness checks and foreign keys. It also avoids treating punctuation parsing as the mechanism for maintaining business integrity.

Modern databases may support arrays, structured values and documents. Their availability does not remove the need to decide whether the application requires independent relationships and constraints. Select a representation according to the operations and rules it must support, not a simplistic ban on complex types.

## Preserve information when decomposing

Splitting a table is not sufficient by itself. The separated tables must retain enough information to reconstruct the intended relationships without inventing combinations. A **lossless decomposition** preserves the original relation when the components are correctly joined under the stated dependencies.

Consider a relationship among supplier, part and workshop. Separating it into supplier-part and supplier-workshop pairs can create combinations that never existed. If one supplier provides different parts to different workshops, the two independent pair tables may falsely imply that every listed part is supplied to every listed workshop.

The original relationship may genuinely involve all three participants. The correct model depends on whether the pairwise relationships fully determine the three-way relationship. Do not assume they do merely because the resulting diagram looks simpler.

Test decompositions using small counterexamples. Construct two or three rows with deliberately different combinations, split them, and join the components back. If extra combinations appear, the design has lost information about which facts belonged together.

## Preserve enforceable rules where practical

Another consideration is **dependency preservation**: whether the important dependencies can be enforced on the decomposed tables without repeatedly joining them. A structurally elegant decomposition may make a business rule harder to enforce if the required attributes are separated.

Third normal form and Boyce-Codd normal form provide different formal criteria. In brief, Boyce-Codd normal form requires every determinant of a non-trivial functional dependency to be a superkey. Third normal form permits a specific additional case involving attributes that belong to candidate keys.

For practical design reviews, the consequence matters more than reciting the definition. A stronger normal form can remove additional redundancy, while a particular decomposition may complicate preservation of certain dependencies. The design should explain how any resulting cross-table rule will be enforced.

Do not claim that reaching a named normal form proves every business rule is represented. Some rules involve totals, time intervals, state transitions or conditions across many records. Functional dependencies address an important subset of integrity, not the whole problem.

## Keep historical facts distinct from current facts

An order may need to preserve the delivery address that applied when it was accepted. Copying that address onto the order can be intentional historical recording rather than accidental duplication of the customer's current address.

The two facts have different meanings: current customer address and address agreed for this order. They can legitimately differ later. Updating the current address should not necessarily rewrite the order's historical destination.

Name and document these distinctions. A field called `address` in several tables invites assumptions that every occurrence should be kept synchronised. Names such as current contact address and accepted delivery address communicate different responsibilities.

The same reasoning applies to descriptions, quoted terms and selected revisions. Before removing apparent duplication, establish whether the value is a reference to current master data or an observation that must remain attached to a past event.

Normalisation is strengthened by precise semantics. It is not a reason to erase history merely because the historical value originally matched a master record.

## Separate logical design from performance copies

A normalised operational model may require joins to answer reports. That does not establish that the model is wrong. Indexes, views and reporting structures can support access while preserving clear ownership of facts.

**Denormalisation** deliberately introduces redundancy for a defined purpose, often to improve a measured access pattern. Its cost is an obligation to keep derived copies consistent or to state their permitted delay and freshness.

If a total is stored rather than calculated, identify the authoritative detail records and every operation that can change the total. Include corrections, deletions, imports and failed transactions. A fast read path is only one part of the design.

Prefer evidence before adding redundancy. Measure the relevant workload, evaluate simpler access improvements and define how the redundant structure will be rebuilt or reconciled. Without these controls, a performance shortcut becomes a second competing source of truth.

The logical model remains useful even when the physical implementation contains deliberate copies. It explains which facts are original and which are derived.

## Review dependencies with realistic exceptions

Business language often hides qualifiers. “Each part has one supplier” may actually mean one preferred supplier per site and effective period. “Each customer has one address” may mean one default billing address while several delivery addresses are allowed.

Ask for exceptions before enforcing the simplified rule. Consider multiple sites, revisions, temporary arrangements and future changes that are already plausible. The objective is not to model every imaginable scenario, but to avoid excluding ordinary legitimate ones.

Use examples that violate the proposed dependency and ask whether they should be allowed. Two rows with the same determinant and different dependent values make the discussion concrete. If both rows can be legitimate, the determinant or the attribute meaning needs refinement.

Record the accepted rule alongside its scope. A dependency approved for one application may not apply to another dataset using similar labels. This is particularly important during integration and migration.

## Translate the model into controls

Once the structure is agreed, implement the applicable keys, uniqueness rules and foreign keys. A diagram showing a relationship does not prevent orphaned or duplicated records unless the implementation enforces it or another reliable control does.

Decide how deletion should behave. Removing a supplier with active supply relationships may need to be rejected or replaced by an inactive status. Automatically cascading deletion can be inappropriate when the related records carry business history.

Design user interactions around the separated facts. Staff should not have to understand the entire schema to complete a routine task. A well-designed application can present a coherent form while maintaining several correctly related tables underneath.

Test inserts, updates and deletes that previously caused anomalies. Confirm that independent facts can now be recorded independently and that prohibited inconsistencies are rejected through every supported write path.

## Produce a reviewable design explanation

A useful design review includes the important dependencies, candidate keys, table meanings and reasons for any deliberate redundancy. It should explain how the model handles history and which rules require controls beyond ordinary keys and references.

For a small manufacturer, this can be a concise document built around purchasing, assets or production records. The business reviewers do not need a lecture on formal notation. They need to recognise the facts, test exceptions and understand what changes together.

The [data-modelling workshop guide](/insights/running-a-data-modelling-workshop/) provides a practical setting for that discussion. Bring proposed dependencies as hypotheses to confirm, rather than presenting a completed diagram as an unquestionable technical answer.

Normalisation earns its value when ordinary changes become easier to make correctly. Identify what determines each fact, separate facts with different owners and preserve the relationships needed to reconstruct meaning. The resulting database is more reliable because its structure reflects the rules the business actually intends.

---

*Source: the supplied Database Management Systems, second edition, particularly chapter 15 on functional dependencies, decomposition and normal forms. Supplier, part and maintenance examples are original illustrations. Normalisation does not by itself establish completeness of all business rules or suitability of a production implementation.*
