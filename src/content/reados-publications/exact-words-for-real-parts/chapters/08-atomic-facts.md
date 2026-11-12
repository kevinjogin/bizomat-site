---
book: exact-words-for-real-parts
chapterSlug: atomic-facts-and-certificates
order: 8
title: "One fact per line: atomic records and what a certificate of conformance asserts"
description: "Apply Russell's logical atomism to inspection records: store atomic results, build conformance from them, and state the completeness claim every certificate of conformance makes."
draft: true
---

The workshop's original certificate was one sentence: "We certify that the 60 brackets supplied conform to drawing CB-12." It was signed in good faith, and it was false for half the brackets. The sentence was short, but it made a very large claim, and almost none of that claim was visible in it.

This chapter finishes the case by taking the certificate apart. Russell's lectures on logical atomism, given in London in 1918, distinguish atomic facts, the molecular statements built from them, and general statements about all of something. He argued that the last kind cannot be reduced to a list of the first, however long. A certificate of conformance is a general statement. Seeing what that means changes how the record behind it should be kept, and what the certificate itself should say.

## Russell's logical atomism

Russell described his philosophy as logical atomism from about 1911, and set it out most fully in eight lectures published in *The Monist* in 1918 and 1919. The picture is simple to state. The world consists of facts. The simplest are atomic facts: a single thing having a quality, or a few things standing in a relation. Statements that report atomic facts are atomic propositions. More complex statements are molecular: they are built from atomic ones with "and", "or" and "not", and their truth depends only on the truth of their parts.

Russell then asked whether every true statement could be built up in this way, and answered no. Consider "all the people in this room are seated". You could list every person and say of each that they are seated. That list is a long conjunction of atomic statements. But the list does not entail the general statement unless you add one more fact: that the people listed are all the people in the room. Russell concluded that general facts are a distinct kind, not reducible to atomic ones. He argued similarly, more controversially, that negative facts are needed too.

Philosophers have argued over these conclusions ever since. For a quality record they are simply correct, and they make a useful design rule.

```figure
type: layers
title: Three levels of claim in an inspection record
caption: Each level is built from the one below, but the top level needs one extra ingredient that no number of lower-level results supplies: the statement that the list is complete.
- General | all 60 brackets conform; needs the atomic results and a completeness statement
- Molecular | bracket 44 conforms; true if all ten of its characteristic results are within limits
- Atomic | thickness of bracket 44 is 12.012 mm, micrometer M-07, U = 3.7 µm, accept
```

## Atomic results

An atomic result in an inspection record reports one characteristic of one part, measured once. For the record to be useful it should carry everything needed to judge it on its own: which part, which characteristic, the value, the instrument and its uncertainty, the decision rule applied, the alignment for anything positional, the person and the time.

This is an illustration. One line of the corrected CB-12 record reads:

| Field | Value |
| --- | --- |
| Part | CB-12 serial 44 |
| Characteristic | 5: position of the hole at 135° |
| Result | 0.791 mm position error, hole Ø6.64 mm |
| Limit | Ø0.3 mm at MMC, 0.34 mm allowed with bonus |
| Method | measuring machine routine CB12-DATUM, frame A, B, C |
| Decision | reject |
| By and when | quality lead, 9 November, 10:42 |

Every field is there because an earlier chapter showed what goes wrong without it. The method line records the construction (Chapter 4) and the alignment (Chapter 7). The limit and decision record the rule (Chapter 6). The serial and characteristic make the description unique (Chapter 2). And the existence of the line at all records a direct measurement rather than an inference (Chapter 3).

The original record was not atomic. For the samples it held one line per bracket, "CMM sample OK", with the full report filed elsewhere. That line was a molecular claim, the conjunction of seven results, compressed into two words. It could not be checked without the report, and the report did not say how it had been aligned.

## Molecular claims about one part

"Bracket 44 conforms" is a molecular statement. It is true if and only if each of its ten atomic results is within its limits. If even one is out, it is false. If one has not been measured, its truth depends on something other than the record: an inference by description, with all the risks Chapter 3 described.

The corrected record makes this explicit. Each bracket's conformance is computed from its atomic results, not typed in, and the computation shows which of the ten results were measured on that bracket and which were inferred. For bracket 44 after re-inspection, thickness and the four hole positions were measured directly; the other five characteristics were inferred from the first-off and samples, as before. The bracket's conformance is decided by the hole positions, which fail.

## The general claim and the missing fact

"All 60 brackets conform" needs more than 60 molecular statements. It needs a statement that the 60 brackets listed are all the brackets in the delivery, and that the ten characteristics are all the characteristics the drawing controls. Without the first, a bracket could be missing from the record and the certificate would still look complete. Without the second, a characteristic could be missing from the inspection plan, as the edge break was, and every line would pass.

```figure
type: formula
title: What "all 60 brackets conform" requires
formula: General claim = Σ atomic results + completeness of parts + completeness of characteristics
caption: This is an illustration. The original certificate had 104 direct results for 600 claims and stated neither completeness condition. Each missing ingredient is a separate way for the certificate to be wrong.
- atomic results | 600 needed; 104 measured directly before delivery
- completeness of parts | serials 1 to 60 are every bracket shipped
- completeness of characteristics | the ten listed are every requirement of drawing CB-12 revision B
step: direct share before delivery = 104 ÷ 600 = 17.3%
step: direct results after re-inspection of the second set-up = 104 + 120 = 224
step: the remaining 376 still rest on description, now with every chain written down
```

Russell's point about negative facts lands in the same place. The certificate's implied claim that no bracket is nonconforming is a negative statement about a whole class. No list of positive results establishes it unless the list is known to be complete. A certificate that says "free from defects" makes a negative general claim with no stated scope, and a reader cannot tell what was looked for.

## Failure: a general claim on molecular evidence

The original certificate is the book's last failure case, and it gathers the others. It made a general claim. Its evidence was 104 atomic results, a set of molecular sample lines whose alignment was wrong, and an unstated chain of description from bracket 1 to brackets it no longer described. It named no revision, so its reference shifted when revision C was issued. And it stated neither completeness condition.

Detection is a reading exercise that anyone signing a certificate can do in a few minutes:

1. Underline the general words: "all", "every", "free from", "no". Each is a general or negative claim.
2. For each, ask what list it ranges over, and whether the record states that the list is complete.
3. Ask how many of the atomic results the claim needs were measured directly, and where the rest come from.
4. Check that every definite description, including the drawing and revision, names one thing.

The original certificate fails all four. The correction is not to stop issuing certificates, which customers rely on and contracts require. It is to write certificates that say what they claim.

## Keeping a record atomic in practice

Most small workshops keep inspection records in a spreadsheet or a simple quality system, and the atomic principle translates into a handful of plain rules for either.

1. One row per result: one part, one characteristic, one measurement. A re-measurement is a new row, not an overwrite, so the history of a borderline part survives.
2. No summary text in result fields. "OK", "pass" and "see report" are molecular claims pretending to be atomic. The value goes in, and the decision is computed from the value and the limits.
3. Limits, instrument and method live in their own columns, filled from the inspection plan, so a reader never has to guess which rule produced a decision.
4. Conformance of a part, and of a delivery, is calculated from the rows by formula, and the calculation shows the count of results measured directly against the count required.
5. The list of parts in the delivery and the list of characteristics in the plan are themselves stored, so that the completeness statements on the certificate are generated from the record rather than typed.

This is an illustration. The workshop's revised spreadsheet for the replacement batch holds 300 required results as rows, 164 of them filled with measured values and 136 marked as inferred with a reference to the first-off and set-up record. The certificate's evidence paragraph is produced from those two counts. If a row is deleted or a serial is missing, the count falls short of 300 and the certificate cannot be generated until someone explains the gap.

## The corrected certificate

This is an illustration. The 30 replacement brackets, serials 61 to 90, were made on the corrected set-up and inspected to a revised plan: a full first-off on bracket 61, thickness on every bracket by micrometer, hole position on every bracket with a new virtual-condition gauge, and bore, dowel and flatness on brackets 70, 80 and 90 on the measuring machine, aligned to datums A, B and C.

```figure
type: stats
title: Direct results behind the replacement certificate
caption: This is an illustration. The gauge checks the position of all four holes on every bracket, so direct coverage rises from 17% to 55% for little extra cost.
- 300 | characteristic results claimed | 30 brackets × 10 characteristics
- 10 | first-off, bracket 61 | all characteristics
- 145 | brackets 62 to 90 | thickness and four hole positions on each
- 9 | samples, brackets 70, 80 and 90 | bore, dowel and flatness
- *164 | measured directly | 54.7% of the 300
```

The certificate that went with them reads, in full:

1. Scope: 30 brackets, part CB-12, serials 61 to 90, delivered under the customer's purchase order as replacements for serials 31 to 60. These 30 are all the brackets in this delivery.
2. Requirement: drawing CB-12 revision B, ten characteristics as listed in inspection plan IP-CB12-2. These are all the dimensional and geometric requirements of that drawing; the edge break note was added to the plan at revision 2 and checked visually on every bracket.
3. Evidence: 164 of the 300 characteristic results were measured directly on the bracket concerned. The other 136 (bore, dowel hole, flatness, length and width on brackets not sampled) rest on the first-off and samples, made on one set-up with no set-up changes, recorded in set-up record SR-0411.
4. Decision rule: thickness accepted within guard-banded limits of 11.954 to 12.046 mm; hole position by virtual-condition gauge; other characteristics within drawing limits on the stated instruments.
5. Result: every directly measured result is within its acceptance limits. No result was indeterminate.
6. Records: the atomic inspection record for serials 61 to 90 is attached.

It is longer than the original. Every sentence in it can be checked against the record, and every general claim states the list it ranges over. The customer's quality engineer, who had stopped trusting the workshop's paperwork, read it, checked three lines against the attached record, and accepted the delivery.

## What the eight tools add up to

The book has applied eight of Russell's ideas to one bracket. Taken together they make a short checklist for any engineering statement that someone will rely on:

| Idea | Question to ask | Where it bit in the case |
| --- | --- | --- |
| Analysis | What simple statements would make this true? | "doesn't fit" became hole position on set-up 2 |
| Descriptions | Does every "the" pick out exactly one thing? | "the reference edge" picked out two |
| Acquaintance and description | What was measured, and what is inferred? | 17% measured; the same-set-up link had broken |
| Constructions | How was each derived quantity built? | a short-arc centre moved 37 µm |
| Types | Does any list contain itself? | the kit and its packing list looped |
| Vagueness | How vague is the reading, and what decides the borderline? | callipers could not decide 12.038 mm |
| Structure | Was the matching fixed in advance? | the best fit hid a half-degree rotation |
| Atomism | Is each record one fact, and is completeness stated? | the certificate claimed 600 results on 104 |

None of these questions needs philosophy to answer. Each needs only the habit of asking what a sentence claims before signing it.

## Exercise: rewrite a one-line certificate

A supplier sends a batch of 200 turned pins with this certificate: "All parts inspected and found free from defects." Identify the general and negative claims, say what the certificate would need to state for those claims to be checkable, and list what you would ask the supplier for.

**Worked answer.** "All parts" is a general claim over a list that is not named: which parts, how many, which serials or lot? "Inspected" does not say for which characteristics, or whether each was measured on each part or inferred from samples. "Free from defects" is a negative general claim with no stated scope: free from which defects, judged against which drawing and revision, by which rule? For the claims to be checkable, the certificate should state the scope (200 pins, part number, drawing and revision, lot or serial range, and that these are all the pins in the delivery), the characteristics covered and that they are all the drawing's requirements, how many results were measured directly and how the rest are inferred, the decision rule for readings near limits, and a reference to the atomic record. Ask the supplier for the inspection plan, the atomic results for at least the first-off and samples with instrument and uncertainty, any set-up changes during the lot with the first-off after each, and confirmation of the drawing revision. A supplier with a sound system can provide all of this within a day. One that cannot is telling you how much the original sentence was worth.
