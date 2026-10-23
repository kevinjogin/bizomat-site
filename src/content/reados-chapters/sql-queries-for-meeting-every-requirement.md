---
title: "SQL queries for meeting every requirement"
description: "Use relational division to find records that satisfy every required condition, with clear treatment of missing evidence, duplicate records and empty sets."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - validation
  - quality
author: "KEVOS®"
featured: false
draft: false
---

Business questions often contain the word “all”: which suppliers support every required process, which kits contain every required component, or which work packs contain every required document. A query that finds at least one matching record is not enough. Even a query that counts several matches can reach the wrong conclusion.

These questions belong to a useful family of database problems called **relational division**. The name sounds mathematical, but the practical idea is straightforward: identify candidates for which no required item is missing. That formulation turns a vague completeness claim into something that can be tested.

The value extends beyond SQL syntax. A dependable completeness check must define the candidates, the requirements, acceptable evidence and the time at which the decision applies. This article shows how to build that definition and translate it into queries that remain meaningful when the data is incomplete or the requirements change.

## Separate candidates, requirements and evidence

Consider a system used to review work packs before release. A candidate is a work pack. A requirement is a document type that must be present. Evidence is a record showing that a particular work pack contains an acceptable document of that type.

These are three different concepts and usually deserve separate structures. Storing a single text field containing a list of document names makes completeness harder to verify. A row for each requirement and a row for each piece of evidence makes the relationships explicit.

The question is not whether the number of evidence rows looks large enough. It is whether every applicable requirement has acceptable matching evidence. Ten copies of one document do not replace a missing document of another type.

Begin with a sentence that defines the intended answer: “Return each work pack for which every document type required by its release profile has at least one accepted document.” The profile, acceptance status and relationship to the candidate are all part of the rule.

This is a focused extension of the query concepts in [SQL for managers and analysts](/reados/collections/sql-queries-and-data-correctness/sql-for-managers-and-analysts/). It is particularly useful when a report will authorise a next step rather than merely display activity.

## Translate every into no missing requirement

Universal statements can be easier to evaluate by looking for a counterexample. To establish that every required document is present, look for a required document that is absent. If no such missing requirement exists, the candidate passes the defined completeness test.

The logic has two levels. For one candidate, inspect each applicable requirement. For each requirement, search for acceptable evidence belonging to that candidate. The candidate qualifies only when the search finds no requirement without evidence.

This structure explains the common SQL pattern of one `NOT EXISTS` inside another. The inner expression identifies missing evidence. The outer expression excludes candidates with any such gap. The apparent double negative is expressing a precise relationship rather than merely making the code complicated.

PostgreSQL's [subquery reference](https://www.postgresql.org/docs/current/functions-subquery.html) documents that `EXISTS` depends on whether its subquery returns a row. The selected value is not the evidence; the existence of a qualifying row is. This makes the pattern suitable for completeness checks where duplicate qualifying evidence should not change the answer.

## Follow a small release example

This is an illustrative example. A release profile requires a drawing, a parts list and an inspection record. Pack A contains accepted versions of all three. Pack B has an accepted drawing and parts list but no accepted inspection record. Pack C has three accepted drawing records and nothing else.

| Work pack | Accepted document types | Complete against this profile |
| --- | --- | --- |
| A | Drawing, parts list, inspection record | Yes |
| B | Drawing, parts list | No |
| C | Drawing, drawing, drawing | No |

```figure
type: svg
title: Counting documents is not covering requirements
alt: A release profile requires three document types: drawing, parts list and inspection record. Work pack A has all three and is complete. Work pack B is missing the inspection record. Work pack C has three documents, but all are drawings, so it is missing the parts list and inspection record despite having the right count.
caption: Pack C has three documents, the same count as A, but covers only one of the three requirements.
viewbox: 0 0 640 220
body:
<text class="txb" x="130" y="24" text-anchor="middle">Required</text>
<text class="txb" x="290" y="24" text-anchor="middle">Pack A</text>
<text class="txb" x="430" y="24" text-anchor="middle">Pack B</text>
<text class="txb" x="570" y="24" text-anchor="middle">Pack C</text>
<text class="tx" x="20" y="66">Drawing</text>
<text class="tx" x="20" y="116">Parts list</text>
<text class="tx" x="20" y="166">Inspection record</text>
<rect class="bxa" x="250" y="46" width="80" height="30" rx="5"/>
<rect class="bxa" x="250" y="96" width="80" height="30" rx="5"/>
<rect class="bxa" x="250" y="146" width="80" height="30" rx="5"/>
<rect class="bxa" x="390" y="46" width="80" height="30" rx="5"/>
<rect class="bxa" x="390" y="96" width="80" height="30" rx="5"/>
<rect class="bx dsh" x="390" y="146" width="80" height="30" rx="5"/>
<rect class="bxa" x="530" y="46" width="80" height="30" rx="5"/>
<rect class="bx dsh" x="530" y="96" width="80" height="30" rx="5"/>
<rect class="bx dsh" x="530" y="146" width="80" height="30" rx="5"/>
<text class="tx txs" x="570" y="66" text-anchor="middle">3 drawings</text>
<text class="txb" x="290" y="206" text-anchor="middle">complete</text>
<text class="tx" x="430" y="206" text-anchor="middle">missing 1</text>
<text class="tx" x="570" y="206" text-anchor="middle">missing 2</text>
```

The third pack is the useful test case. A simple count of three evidence rows would make it appear complete. The actual rule concerns coverage of three distinct requirements, not the volume of stored evidence.

Assume a simplified schema with `work_pack`, `required_document` and `pack_document` tables. Each work pack references a profile, each requirement belongs to a profile, and each evidence row names its work pack and document type. Document acceptance is represented explicitly by a status.

```sql
SELECT p.pack_id
FROM work_pack AS p
WHERE NOT EXISTS (
  SELECT 1
  FROM required_document AS r
  WHERE r.profile_id = p.profile_id
    AND NOT EXISTS (
      SELECT 1
      FROM pack_document AS d
      WHERE d.pack_id = p.pack_id
        AND d.document_type = r.document_type
        AND d.status = 'accepted'
    )
);
```

This query returns Pack A for the stated data. It does not assess whether a drawing is technically correct or whether an inspection was adequate. It evaluates the recorded completeness rule only. Acceptance must have its own trustworthy process.

```figure
type: steps
title: Translating "every" into a query
caption: A candidate qualifies when no required item lacks matching, acceptable evidence.
- List the candidates
- List the requirements that apply
- Match accepted evidence to each requirement
- *Keep candidates with no missing requirement
```

## Make an empty requirement set a conscious decision

If a candidate has no applicable requirements, the query finds no missing requirement and returns it. In logic, every requirement in an empty set is satisfied because there is no counterexample. In a business workflow, this can be either correct or dangerous.

A profile designed to require no documents might legitimately pass. A profile whose requirements failed to load should not silently pass for the same reason. The query cannot infer why the set is empty.

If release requires a configured, non-empty profile, add an explicit requirement-presence condition. Better still, represent whether a profile has been approved for use. Configuration completeness is a separate question from candidate completeness.

Test an empty profile deliberately. State whether it should pass, fail or require manual review. Do not leave the decision to the incidental behaviour of whichever query style a developer happened to choose.

An inner-join-and-count solution often omits candidates with no requirements altogether. A double-`NOT EXISTS` solution includes them. Neither result is automatically a defect; the important issue is whether it matches the agreed interpretation.

## Compare coverage rather than raw counts

Counting can express relational division, but only with careful conditions. Count the distinct applicable requirement identifiers that have acceptable evidence, then compare that count with the distinct applicable requirement count. Both sides must use the same requirement set.

Counting all evidence types is not equivalent. A pack might contain a drawing, a parts list and an unrelated photograph while lacking its inspection record. It has three distinct document types but does not satisfy the required three types.

Duplicates complicate matters further. Multiple revisions or multiple acceptance events can create several qualifying rows for one requirement. A count-based method must prevent those repetitions from inflating coverage.

Use a unique requirement identifier when the same broad document type can occur more than once with different conditions. A profile might require separate inspection records for two stages. Counting only document type would collapse two requirements that the business considers distinct.

The existence formulation is often easier to review because it mirrors the question: identify a required item with no acceptable match. A count formulation can be equally valid, but its denominator and matching population deserve explicit explanation.

## Put acceptance conditions inside the evidence match

Presence and acceptability are different. A document may exist but be rejected, superseded, expired, unapproved or associated with the wrong revision. Completeness should use the evidence state appropriate to the decision.

Add these conditions where the query matches evidence to a requirement. Filtering candidate rows afterwards can obscure which requirement was actually satisfied. A central definition of acceptable evidence also helps keep the pass report and the missing-items report consistent.

Avoid assuming that the latest uploaded document is the accepted one. Upload time records a storage event. Approval, revision applicability and effective time can each have different meanings. The system needs an explicit rule for choosing among them.

The same distinction applies to supplier capabilities. A supplier's self-declared ability to perform a process is not the same as an approval recorded by the purchasing organisation. A query can test either, but the report title must say which evidence it uses.

Do not let a completeness badge imply engineering approval or regulatory compliance. The badge should communicate the narrow database claim it actually establishes, with the appropriate review process controlling broader judgements.

## Make the time of assessment reproducible

Requirements and evidence both change. A work pack that was complete when released might appear incomplete after a new requirement is added. Conversely, a document uploaded later might make an earlier incomplete pack look as though it had always been ready.

Choose whether the report answers a current-state question or reconstructs a past decision. For historical assessment, retain the applicable requirement version and the relevant evidence state. A timestamp alone may not identify those versions reliably.

An effective approach is to associate the release with a specific approved profile revision. Evidence can then be evaluated against that stable revision, while later releases use a newer one. Corrections and withdrawals still need a defined handling process.

If the report uses an assessment timestamp, apply it consistently to both sides of the comparison. Checking current requirements against historical evidence, or historical requirements against current evidence, produces a hybrid answer that may correspond to no actual decision point.

A reproducible completeness result should be explainable later: these were the requirements, these were the accepted matches, and these were the unresolved gaps at the stated assessment boundary.

## Return the missing items as an operational result

A yes-or-no answer helps control a workflow, but a list of missing requirements helps people complete the work. Derive that list from the same matching rule rather than maintaining a separate, slightly different query.

For each candidate, return every applicable requirement for which no acceptable evidence exists. Include a useful requirement label, the responsible role if known and any existing rejected or pending evidence that explains the next action.

Do not present all gaps as “document missing”. A document awaiting review, a rejected document and an absent document require different work. The completeness test can remain binary while the explanation preserves these distinctions.

This also improves testing. For Pack B, the expected gap is specifically the inspection record. For Pack C, the expected gaps are the parts list and inspection record. A test that checks only the overall number of failing packs would miss an incorrect explanation.

An exception report turns relational division into a practical workflow tool. It helps the team close the exact gap rather than repeat a full review of every candidate.

## Protect identifiers and applicability rules

A missing candidate identifier, profile identifier or requirement identifier can change the meaning of the query. Use non-nullable keys and enforce valid relationships where the model requires them. Optional relationships should have explicit business semantics.

The applicability rule deserves equal care. Requirements may vary by product family, customer, process stage or release type. If those dimensions are spread across loosely related conditions, it becomes difficult to establish which requirements were intended to apply.

Prefer a clearly modelled applicable requirement set. This may be an approved profile, a resolved configuration or a versioned relationship table. The completeness query should consume that definition, not reconstruct policy differently in each report.

Where requirements are conditional, include the condition in review examples. A document required only for outsourced work should not appear as a gap for internal work, while a missing outsourcing flag should not silently exempt a candidate.

The database can enforce consistent relationships, but the domain owner must decide the applicability policy. A mathematically correct query over the wrong requirement set is still a wrong business result.

## Test edge cases before testing volume

A compact acceptance dataset should include a complete candidate, one missing a single requirement, one with repeated evidence for only one requirement, one with unrelated evidence and one with no evidence. Add a candidate with no applicable requirements and record the intended outcome.

Then include rejected, pending and superseded evidence. Check that an acceptable record for another candidate cannot satisfy the current one. This catches a missing correlation condition, which can otherwise make every candidate pass once one complete candidate exists.

Test changes as well as static results. Adding a missing accepted document should make only the relevant candidate pass. Adding an unrelated document should change nothing. Adding a new requirement should create a gap only for candidates to which that requirement applies.

If counts are used, test duplicate evidence and duplicate requirement configuration separately. Duplicate configuration may be an error to reject rather than a condition to conceal through `DISTINCT`.

These cases are small enough for a reviewer to reason through manually. Larger performance tests come afterwards, using representative candidate volumes, requirement counts and evidence histories.

## Support performance without changing meaning

The query repeatedly relates candidates, requirements and evidence. Indexes aligned with those relationships can help, particularly on the identifiers used to find evidence for a candidate and requirement. The useful order and coverage depend on the actual workload.

Inspect the execution plan and measured behaviour before rewriting a clear query into a more obscure one. Database optimisers may transform existence checks internally, so the written nesting does not necessarily describe a literal row-by-row execution process.

Preserve correctness tests while tuning. A faster count-based replacement that mishandles empty profiles or duplicate evidence is not an improvement. Compare both the qualifying candidates and their gap explanations against the same acceptance dataset.

For frequently repeated assessments, a stored result may be useful, but its freshness becomes part of the design. Identify which changes invalidate it and how the system prevents stale completeness from authorising a later action.

## Keep the claim as precise as the query

A useful completeness report says what was checked. “All required release documents have accepted records against profile revision B” is more informative than an unexplained green tick. It leaves room for other reviews without overstating the database's judgement.

In manufacturing, maintenance and project delivery, this precision helps teams distinguish preparation from approval. The database can identify missing evidence consistently and quickly. People remain responsible for the quality of the evidence and the authority of the decision.

Relational division provides a durable way to express “every requirement”. Define the requirement set, search for missing matches, handle empty sets deliberately and retain an explanation. The resulting query is easier to test because its logic follows a question the business can understand.

---

*Source: the supplied Database Management Systems, second edition, sections 4.2.5 and 5.4 on division and nested queries; PostgreSQL subquery documentation linked above. The work-pack scenario and SQL are original illustrations. Recorded completeness is not professional certification or approval of technical work.*
