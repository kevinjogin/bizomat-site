---
title: "Modelling three-way relationships in databases"
description: "Recognise facts that depend on three entities, avoid false combinations from pairwise links and choose keys and constraints that preserve the intended relationship."
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

Some business facts connect three things at once. A particular supplier may be approved to provide a particular material to a particular site. Recording which suppliers provide materials, which suppliers serve sites and which materials are used at sites does not necessarily preserve those specific approvals.

A **ternary relationship** expresses an association among three participating entity types. Its significance lies in the combined fact, not in the number of boxes on a diagram. Replacing that fact with separate pairwise links can allow combinations that were never approved or observed.

Recognising this pattern helps database designers preserve meaning before choosing tables and keys. It also provides a practical way to review models that look reasonable in a diagram but produce surprising answers when their relationships are joined.

## State one complete fact in a sentence

Begin with a sentence that includes all participants and the relationship's meaning. For example, “Supplier S is approved to supply Material M to Site T” identifies a specific approval, rather than three independent capabilities.

Ask what information is lost if one participant is removed. Without the site, the statement may become a general supplier-material approval. Without the material, it may become an approved supplier for a site. Neither necessarily means the same thing as the original fact.

This is an illustrative example. A supplier is qualified for one material at a central workshop but lacks approval for that material at a remote site with different handling requirements. The site is part of the approval's meaning, even if the supplier and material already exist as shared master records.

Use concrete counterexamples during requirements discussions. People often agree too quickly with broad phrases such as “suppliers provide materials”. Asking whether every approved supplier-material pair is valid at every served site exposes the missing qualification.

Keep different relationships distinct. A supplier's commercial service area and a specific material approval may both be useful facts, but one should not be inferred from the other without an explicit business rule.

## See how pairwise links can invent combinations

Consider a set of three-way approvals and derive its three pairwise lists: supplier-material, supplier-site and material-site. Each list preserves a true fragment of the original data. Joining those fragments can still produce a false complete fact.

This is an illustrative example. The actual approved triples are:

| Supplier | Material | Site |
| --- | --- | --- |
| S1 | M1 | T1 |
| S1 | M2 | T2 |
| S2 | M1 | T2 |

The pairwise lists establish that S1 supplies M1, S1 serves T2 and M1 is used at T2. Combining those three true statements suggests the triple S1-M1-T2, which is absent from the approved set.

```figure
type: svg
title: How pairwise links invent a combination
alt: Three approved triples are listed: S1 with M1 at T1, S1 with M2 at T2, and S2 with M1 at T2. Split into pairs, the true statements S1 supplies M1, S1 serves T2 and M1 is used at T2 combine into the triple S1, M1, T2, which was never approved.
caption: Three true pairwise statements combine into a triple that is absent from the approved set.
viewbox: 0 0 640 230
body:
<text class="txb" x="110" y="24" text-anchor="middle">Approved triples</text>
<rect class="bx" x="30" y="40" width="160" height="34" rx="5"/>
<rect class="bx" x="30" y="82" width="160" height="34" rx="5"/>
<rect class="bx" x="30" y="124" width="160" height="34" rx="5"/>
<text class="tx" x="110" y="62" text-anchor="middle">S1 · M1 · T1</text>
<text class="tx" x="110" y="104" text-anchor="middle">S1 · M2 · T2</text>
<text class="tx" x="110" y="146" text-anchor="middle">S2 · M1 · T2</text>
<path class="ln flow" d="M200 99H260"/>
<text class="txb" x="345" y="24" text-anchor="middle">Pairs kept</text>
<rect class="bxi" x="270" y="40" width="150" height="34" rx="5"/>
<rect class="bxi" x="270" y="82" width="150" height="34" rx="5"/>
<rect class="bxi" x="270" y="124" width="150" height="34" rx="5"/>
<text class="tx" x="345" y="62" text-anchor="middle">S1 supplies M1</text>
<text class="tx" x="345" y="104" text-anchor="middle">S1 serves T2</text>
<text class="tx" x="345" y="146" text-anchor="middle">M1 used at T2</text>
<path class="ln flow" d="M430 99H480"/>
<rect class="bxa pulse" x="490" y="76" width="130" height="46" rx="6"/>
<text class="txb" x="555" y="104" text-anchor="middle">S1 · M1 · T2 ?</text>
<text class="tx txs" x="555" y="146" text-anchor="middle">never approved</text>
```

The extra result is a **spurious tuple**: a row introduced by reconstruction that does not belong to the original relation. It is not caused by a spelling mistake or a duplicate identifier. It arises because the decomposition discarded information about which three participants belonged together.

A query can therefore be logically correct for the pairwise tables while answering the wrong business question. Fixing its syntax or adding a distinct operator does not restore the lost relationship.

## Store the combined relationship explicitly

A relational representation can use an association table containing references to all three participants. Each row then records one approved triple under the declared grain.

The supplier, material and site remain separate entities with their own attributes. The association stores the fact that connects them. This avoids repeating complete supplier or material descriptions in every approval record.

Additional attributes belong on the association when their values depend on the combined relationship. An approval reference, maximum permitted quantity or review date may describe that particular supplier-material-site approval.

Ask the dependency question for each attribute. If a supplier's registered name is the same across all its approvals, it belongs with the supplier. If a handling instruction varies by material and site but not supplier, that may indicate another relationship with its own grain.

The aim is to place each fact where its determinants are represented. The presence of three foreign keys does not automatically make every nearby attribute a property of the triple.

## Choose keys from the actual uniqueness rule

The combination of all three participant keys may uniquely identify an association, but that should be established from the business rule. In some relationships, two participants determine the third. In others, the same triple can recur as several distinct events.

This is an illustrative example. If each material at each site has exactly one designated primary supplier, the material-site pair determines the primary supplier for the relevant period. Enforcing uniqueness only on the full triple would still allow two primary suppliers for the same material-site pair.

Conversely, a delivery event involving the same supplier, material and site can occur repeatedly. The triple alone cannot identify each delivery. A delivery identifier or another suitable event key is needed, while the participant references describe the event.

A surrogate identifier can make references convenient, but it does not enforce the natural uniqueness rule. Retain appropriate unique constraints for the business combinations that must not repeat.

Separate identity from validation. A generated number answers which row is being referenced. It does not answer whether two rows describe a prohibited duplicate approval or whether their participant combination is permitted.

## Interpret cardinality while holding the other roles fixed

Cardinality in a three-way relationship is easy to misread. A statement about one participant generally needs the other two roles held fixed to be precise.

Instead of saying “one supplier”, say “for each particular material-site pair, at most one supplier may hold the primary approval”. This describes a functional dependency that can guide a concrete uniqueness rule.

Likewise, “a supplier can supply many materials” does not describe the complete ternary cardinality. It leaves the site unspecified and may be true under several different models.

Test each direction. For a fixed supplier and material, how many sites are permitted? For a fixed supplier and site, how many materials? For a fixed material and site, how many suppliers? Add the relevant time or version context where it changes the answer.

Use the notation supported by the modelling method, but accompany it with readable statements. Diagram symbols are useful shorthand only when reviewers agree on the precise meaning they encode.

## Distinguish participation from uniqueness

**Participation** concerns whether an entity must appear in a relationship. Uniqueness concerns how many associations can share a combination of roles. These are different requirements.

A site may be allowed to exist before any supply approval has been recorded. That is optional participation. A rule that every active site must have at least one approved material source is a separate coverage requirement.

Foreign keys verify that referenced participants exist. They do not, by themselves, prove that every parent entity participates in at least one association. An empty association set can satisfy all its foreign keys while failing a business coverage rule.

This is an illustrative example. A newly activated site has a valid site record but no approved supplier-material combinations. Checking only the foreign keys in the approval table finds no error because there are no approval rows to check.

Decide where and when mandatory coverage is enforced. It may be appropriate at a workflow transition, such as activating a site, rather than at the moment an incomplete draft record is first created. Preserve that distinction in both the model and application behaviour.

## Add time without obscuring the original fact

Approvals, assignments and rates often change over time. The model must distinguish a current relationship from the history of relationship versions.

This is an illustrative example. S1 is approved to supply M1 to T1 from January through June, then S2 becomes the approved supplier from July. A historical delivery in March should be evaluated against the approval applicable in March, not automatically against today's supplier.

Possible representations include effective intervals or separately identified approval versions. Define whether interval endpoints are inclusive or exclusive and how open-ended approvals are represented.

If the rule allows only one primary supplier at a time for a material-site pair, ordinary uniqueness on the pair cannot preserve multiple historical versions. The design needs a rule preventing prohibited overlap across the relevant intervals.

Keep approval history distinct from delivery history. An approval states permission or eligibility; a delivery records an event. The fact that a delivery occurred does not prove that it was approved, and the existence of an approval does not prove that a delivery occurred.

## Reify the relationship when it becomes a managed object

**Reification** means treating a relationship as an entity in its own right. In practical business modelling, an approval can become an object with an identifier, evidence, status, review history and related decisions.

That can produce an approval entity linked to supplier, material and site through three ordinary relationships. This preserves the original three-way fact because all three references meet in the same approval object.

It differs fundamentally from keeping only independent supplier-material, supplier-site and material-site tables. The approval object records which participants belong together, whereas those independent pairs can lose that information.

Reification is useful when other records need to refer to the association. An inspection or delivery may cite the specific approval version under which it was accepted. That reference is clearer than reconstructing the intended approval from current master data.

Do not create an entity merely to make a diagram visually uniform. Give it a defined identity and lifecycle where the domain supports those concepts, and preserve the relationship's uniqueness and participation rules after the transformation.

## Recognise when a decomposition is justified

Some apparent three-way facts can be represented through simpler relationships without losing meaning. The justification comes from the domain's dependencies, rather than from a preference for binary diagrams.

This is an illustrative example. Every machine belongs to exactly one site during a defined period, and a maintenance assignment links a technician to that machine during the same period. If the assignment's site is wholly determined by the machine and time, storing it again may be redundant.

The qualification matters. If technicians can service a machine at an off-site facility, or machines move while an assignment remains open, the earlier dependency may no longer describe the task.

A **lossless decomposition** allows the original facts to be reconstructed without missing or invented combinations under the applicable constraints. Demonstrating that property requires the actual dependencies, not just a successful join on today's small sample.

Test counterexamples that the business would permit in future. A model can appear lossless while all suppliers happen to serve one site, then fail when the organisation opens a second site or introduces site-specific approvals.

## Build validation around the relationship's meaning

Prepare a small accepted dataset and a separate set of prohibited combinations. Include multiple participants in every role so the tests can expose accidental assumptions of one-to-one relationships.

For the earlier approval example, confirm that querying the association returns the three actual triples and does not infer S1-M1-T2. Then test the relevant uniqueness rule by attempting a prohibited duplicate or competing primary approval.

```figure
type: checklist
title: Validating a three-way relationship
caption: Test the meaning of the relationship, not only that the tables load.
- x Querying returns only the actual triples
- x No triple is inferred from pairs
- x A prohibited duplicate is rejected
- *x Time-bounded approvals are read for the right date
```

Test changes to master records and lifecycle states. Deactivating a supplier may affect whether new approvals can be created without implying that historical approvals should disappear. Deleting a participant can have different consequences from marking it inactive.

Include incomplete workflow states deliberately. A draft approval may temporarily lack required evidence, while an active approval must satisfy stricter conditions. The model should distinguish those states rather than weakening every rule to accommodate data entry.

Review queries as well as constraints. A correctly modelled association can still be bypassed by a report that reconstructs eligibility from broader pairwise capabilities. Use descriptive names so readers can distinguish approved combinations from general relationships.

## Explain the model through the decisions it protects

Review the wording of negative questions as well as positive ones. “Which suppliers have no approval for this material at this site?” requires checking the complete combination. A supplier may have many approvals elsewhere and still be absent from this exact relationship.

This is an illustrative example. A report excludes every supplier that has any approval for M1 anywhere. It then claims to list suppliers not approved for M1 at T2. That report can incorrectly omit a supplier approved only at T1. The condition must preserve both the material and site roles while testing the absence of an approval.

The same discipline applies to coverage questions, such as whether every required material at a site has an approved source. Define the required population independently, then compare it with actual approved combinations. Looking only at existing approvals cannot reveal required materials that have no approval rows at all.

These queries make useful acceptance examples because they connect the model to practical decisions. They also reveal whether the team has accidentally treated a broad capability relationship as a substitute for the narrower approval fact.

A productive design review shows both a valid fact and a tempting invalid inference. This makes the purpose of the association table understandable to people who do not read formal database notation.

Document the complete relationship sentence, its grain, participant roles, identifying combinations and time basis. Record which attributes depend on the association and which belong to separate entities or relationships.

Keep approved capability, actual activity and historical evidence distinct. They may connect the same three participants while expressing different facts, and combining them under a vague relationship name makes later reporting unreliable.

The value of a ternary model is precision. By preserving the complete association, the database can answer whether a particular combination is valid or recorded without inventing that combination from several individually true but incomplete statements.

*Source basis: ternary relationships, intersection attributes and relational mapping in Database Design Using Entity-Relationship Diagrams (2003), supplied in the collection. The supplier-material-site example and counterexample are original illustrations; key selection is qualified by actual dependencies rather than treated as an automatic concatenation rule.*
