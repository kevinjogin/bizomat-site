---
title: "Testing data models with facts and counterexamples"
description: "Validate a conceptual data model using precise sentences, small example populations and counterexamples that expose hidden uniqueness and participation assumptions."
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

A data-model diagram can look convincing while its participants interpret the relationships differently. One person reads a line as an assignment, another as a qualification and another as a history of work performed. The drawing may be neat, but the underlying facts are still ambiguous.

Fact-based modelling makes those statements explicit. It describes the kinds of facts the system records, the roles played within each fact and the rules that valid populations must satisfy. Small examples then provide a practical way to challenge the rules before tables or interfaces make them expensive to change.

The useful test is whether a proposed model admits every legitimate case and rejects the cases the business prohibits. That requires both positive examples and deliberate counterexamples. A collection of ordinary records can demonstrate that a model works for those records without proving that its rules are correct.

## Begin with a sentence whose meaning can be challenged

Consider a workshop assigning technicians to inspection tasks. This is an illustrative example. The statement “Technician performs Inspection” seems clear until someone asks whether it describes responsibility, actual participation or final approval.

Those are different fact types. A technician may be assigned to an inspection without performing it. Several technicians may participate, while only one authorised person approves the result. Combining these meanings into one relationship makes its constraints impossible to interpret reliably.

Use verbs that identify the intended fact. “Technician is assigned to Inspection” and “Technician approves Inspection” give reviewers something concrete to question. Define the circumstances under which each statement becomes true and whether it remains true as the work progresses.

Identify the objects independently of the sentence. A technician should have a stable reference scheme, and an inspection should be distinguishable from its template or the asset inspected. Otherwise example sentences may appear to describe the same object when they actually refer to different things.

Keep the initial representation close to business meaning. Deciding immediately that approval belongs in an `approved_by` column can hide unresolved questions about multiple approvers, delegation and approval history. The conceptual statement should be settled before selecting its physical storage arrangement.

## Separate a fact type from the facts currently known

A fact type is a pattern of possible statements, such as Technician approves Inspection. A fact instance fills its roles with particular objects, such as technician T8 approving inspection I24. The distinction prevents current data from being mistaken for the full set of permitted possibilities.

Suppose the available sample contains three inspections, each approved by one technician. That sample is consistent with several different rules: at most one approver per inspection, exactly one approver per inspection, or several approvers permitted but not yet observed.

The sample alone cannot choose between them. Reviewers need to state which populations would also be legitimate. An inspection awaiting approval may be valid, which disproves an unconditional exactly-one rule. A dual-approval process may require two approvers for a particular class of inspection.

Distinguish the universe of relevant objects from the objects that currently participate in a fact. A technician can exist in the system without approving any inspection. A draft inspection can exist before an assignment is made. Participation rules determine when such absence is permitted.

This distinction is especially useful when reverse-engineering an existing database. The absence of a pattern in today's records does not prove that the business forbids it. Observed regularities are hypotheses to validate, not automatic declarations of permanent constraints.

## Use quantifiers to expose hidden assumptions

Words such as each, some, at least one and at most one carry the logical content of a relationship rule. “Each inspection has at most one approver” differs from “Each inspection has at least one approver,” and neither alone means exactly one.

The first statement imposes an upper bound. The second imposes a lower bound. Combining them requires exactly one approver within the stated scope. A model should record those obligations separately enough that reviewers can discuss each.

Scope qualifiers matter just as much. “Each completed inspection has exactly one final approver” says something different from applying the rule to every draft and cancelled inspection. If the qualification is omitted, the resulting schema may reject legitimate intermediate states.

Read the relationship in both directions. One inspection may have one final approver while one technician may approve many inspections. An inverse reading helps prevent an accidental one-to-one rule caused by focusing only on the first direction.

Do not let fluent wording conceal uncertainty. If reviewers disagree about whether a second approver is possible, record that issue explicitly. A precise unresolved question is more useful than an agreeable sentence whose ambiguity survives into implementation.

## Build examples that exercise uniqueness

A small population can make a uniqueness rule visible. Suppose the approval facts are T8–I24, T8–I25 and T9–I26. Repeating T8 shows that one technician may approve several inspections. Keeping inspection identifiers distinct is consistent with one approver per inspection.

Now propose adding T9–I24. This is the counterexample that challenges the proposed upper bound. If the business accepts it, the rule that each inspection has at most one approver is too strict. If the business rejects it, ask why and preserve that explanation.

```figure
type: svg
title: A counterexample tests a uniqueness rule
alt: Technician T8 approves inspections I24 and I25, and T9 approves I26. A proposed new fact, T9 approves I24, is drawn dashed. If the business accepts it, the rule that each inspection has at most one approver is too strict.
caption: If the business accepts T9–I24, "at most one approver per inspection" is the wrong rule.
viewbox: 0 0 560 230
body:
<rect class="bx" x="40" y="40" width="100" height="40" rx="6"/>
<rect class="bx" x="40" y="140" width="100" height="40" rx="6"/>
<text class="txb" x="90" y="65" text-anchor="middle">T8</text>
<text class="txb" x="90" y="165" text-anchor="middle">T9</text>
<rect class="bx" x="400" y="20" width="110" height="40" rx="6"/>
<rect class="bx" x="400" y="90" width="110" height="40" rx="6"/>
<rect class="bx" x="400" y="160" width="110" height="40" rx="6"/>
<text class="tx" x="455" y="45" text-anchor="middle">I24</text>
<text class="tx" x="455" y="115" text-anchor="middle">I25</text>
<text class="tx" x="455" y="185" text-anchor="middle">I26</text>
<path class="ln" d="M140 56L400 40M140 64L400 110M140 160L400 180"/>
<path class="la dsh flow" d="M140 154L400 46"/>
<text class="txa" x="250" y="96" text-anchor="middle">T9–I24?</text>
```

The reason may reveal a missing distinction. Perhaps several preliminary reviews are allowed but only one final approval. In that case, the model needs separate fact types or an approval event with a defined role, rather than a broad prohibition on multiple people being associated with the inspection.

Test combinations, not just individual identifiers. Some relationships are unique only across a pair or a larger group of roles. A technician may approve the same inspection at several stages, while the combination of inspection and stage permits only one final approver.

Keep the example population deliberately small. Its purpose is to make the rule inspectable. A thousand realistic-looking records can obscure the single repeated value that determines whether the proposed constraint is appropriate.

## Test mandatory participation with missing facts

An upper bound is tested by adding a potentially conflicting fact. A mandatory-participation rule is often tested by removing a fact or introducing an object that does not participate. Both kinds of counterexample are necessary.

Create a draft inspection without an assigned technician. Is that a legitimate planning state? Create a completed inspection without an approval. Is completion allowed before approval, or does the organisation use a different state name for that situation?

The answer may depend on the process boundary. A transaction can temporarily create an inspection before adding its assignment, even though the committed active state must contain both. A conceptual rule should distinguish permitted transaction-internal construction from the states other users are allowed to observe.

Mandatory rules can also be disjunctive. A service request might need either an internal owner or an external provider. That does not necessarily mean it must have both, or that having both is forbidden. At least one and exactly one are different obligations.

State the intended combination directly, then test all relevant cases: neither, internal only, external only and both. Four small examples can settle an ambiguity that otherwise hides behind a vague requirement that every request must have someone responsible.

## Compare populations when one relationship depends on another

Some rules relate two fact types. Suppose a technician may approve an inspection only if that technician is assigned to that inspection. The set of technician–inspection approval pairs must then be a subset of the assignment pairs.

Checking the technician alone is insufficient. A technician assigned to inspection I25 should not thereby become eligible to approve I24. The rule concerns the ordered pair and preserves the connection between the same technician and the same inspection.

This distinction exposes a common modelling error. Two separate checks that a technician has some assignment and that an inspection has some assigned technician do not prove that the required pair exists. A counterexample using two technicians and two inspections makes the gap visible.

Other rules require equal populations or mutual exclusion. Equality means that every participating pair in one fact type also appears in the other, in both directions. Exclusion means that no prohibited combination appears in both. Neither is equivalent to merely having the same number of rows.

Use business examples to validate the relationship between populations before choosing an enforcement mechanism. A composite reference may express some subset rules directly; other rules need different structures or controlled operations. The conceptual obligation should remain clear even when its physical implementation is more involved.

```figure
type: steps
title: Testing a model with facts
caption: Keep the examples with the model, so later changes are tested against them too.
- A sentence that can be challenged
- Fact type separate from known facts
- Quantifiers that expose assumptions
- Examples that exercise uniqueness
- Missing facts that test mandatory roles
- *Time added where a timeless rule is wrong
```

## Distinguish independent facts from one combined fact

A sentence involving several roles may express a relationship that cannot safely be decomposed into independent pairs. For example, “Technician is authorised for InspectionType at Site” associates all three participants in one authorisation fact.

Knowing that a technician is authorised for a type somewhere, and authorised at a site for something, does not establish that the technician has that particular type authorisation at that site. Separate pairwise facts can permit combinations that the original three-role fact never allowed.

Conversely, some apparent multi-role statements can be decomposed because the business rules genuinely establish independent relationships. The decision should follow those rules, not a preference for either fewer tables or more visually simple relationships.

Construct a counterexample containing overlapping pairs but a missing full combination. Ask whether the missing combination should be inferred. If not, retain the association needed to preserve that distinction in the model.

When a relationship itself needs attributes, consider whether it should become an identifiable association or event. An authorisation may have an effective interval, an issuer and evidence. Giving that fact an explicit identity can clarify its lifecycle without confusing it with the technician or site it connects.

## Add time when a timeless sentence gives the wrong rule

“Technician is assigned to Inspection” may describe the current assignment or every assignment ever made. If the distinction is left implicit, a uniqueness rule that is correct for the current state can become incorrect for retained history.

An inspection may have one responsible technician at a time but several over its lifetime. The rule therefore depends on time or assignment episodes. Adding all historical facts to a timeless relationship can make the database appear to violate a business rule that it actually satisfied at every moment.

Specify whether a fact records an event, a current state or a period during which a relationship holds. A timestamp saying when a row was entered does not necessarily identify when the business relationship became effective.

Counterexamples should include change. Reassign an inspection, correct an earlier assignment and record a late report of work already performed. Determine which facts should remain and which queries should see each version.

Do not add temporal detail indiscriminately. Use it where the questions and rules require it. The goal is to preserve the meaning of change, not to attach dates to every table without deciding what those dates represent.

## Translate the validated rules without losing them

Once the facts and constraints are agreed, map them into tables, keys, relationships and controlled operations. Keep a traceable connection between each business statement and the mechanism intended to preserve it.

A uniqueness bar in a conceptual diagram may become a unique key across several columns. A mandatory role may become a non-null reference in one mapping, while another mapping requires a different mechanism. The same conceptual rule can have more than one physical implementation.

Some rules will not be enforced by ordinary row constraints alone. Identify them explicitly rather than allowing them to disappear during schema generation. Document the transaction, database logic or application boundary responsible for each such rule and the writers that can reach it.

Use the original counterexamples as implementation tests. A schema that rejects a previously approved example is too restrictive or incorrectly mapped. One that accepts a prohibited example fails to preserve the agreed rule, even if the generated diagram looks similar to the original model.

Review error behaviour too. When a user attempts an invalid combination, the system should explain the violated business rule where practical. The modelling work has already produced precise language that can help make these failures understandable.

## Maintain the examples as part of the model

Example populations are useful beyond initial design. They provide a compact record of what the team meant by a relationship and why a constraint exists. Retain both accepted cases and rejected counterexamples, together with the relevant scope conditions.

When requirements change, revisit those examples. A new subcontracting arrangement may make an old exclusivity rule inappropriate. A new approval process may require several stages. Updating the examples helps reveal which constraints and queries must change with the business decision.

Avoid silently rewriting old examples to fit a new schema. Record the changed rule and its effective scope so that the reason for the change remains visible. Historical records may still need to be interpreted under earlier arrangements.

Keep the collection focused on distinctions that matter. The most useful examples expose a boundary: one versus many, optional versus mandatory, independent versus combined, current versus historical. Repetitive ordinary cases add less value than one carefully chosen counterexample.

Use invented identifiers and values when examples leave the operational team. Their purpose is to test logical structure, so real customer names or confidential inspection details usually add no value. Synthetic examples can preserve the difficult relationship while making the model easier to discuss and share.

The result is a model that can be discussed in plain sentences, challenged with small populations and checked in its implemented form. That connection between meaning, examples and enforcement makes a data model more trustworthy than a diagram reviewed only for appearance.

## Source basis

The source collection's *Database Modeling with Microsoft Visio for Enterprise Architects* explains object-role fact types, example populations, verbalisation and set-comparison constraints. This article uses those modelling principles independently of the book's historical software interface.

The inspection examples and validation sequence are original. Object-role modelling in this context concerns conceptual facts and constraints; it should not be confused with an object-relational mapper used by application code.
