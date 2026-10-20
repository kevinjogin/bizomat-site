---
book: fixtures-that-repeat
chapterSlug: make-correct-loading-and-changeover-repeatable
order: 8
title: "Make correct loading and changeover repeatable"
description: "Turn fixture knowledge into controlled operating and changeover instructions, with clear checks for part identity, seating, program selection and abnormal conditions."
draft: true
---

A fixture is not ready for routine use while its reliable operation depends on the designer standing beside it. The contact map, loading sequence, permitted adjustments and abnormal-condition response must be visible in the production method.

Good instructions describe what the operator must recognise and decide. They do not compensate for an arrangement that is difficult to seat, hard to inspect or easy to load incorrectly.

## Separate physical prevention from detection

A physical key can prevent a reversed part from reaching the intended seating position. A sensor or gauge may detect incorrect seating. A label reminds the operator what to do. These controls have different strengths and failure modes.

For the teaching bracket, imagine a mirrored variant that can enter the same rectangular nest. An asymmetric feature may provide an opportunity to prevent the wrong orientation. Any key must clear the accepted part variation and must not become an unintended locating contact.

A key does not establish material grade, program revision or hidden internal features. Identify which error each control addresses and which errors remain possible.

Do not call a fixture “mistake-proof” as an unrestricted claim. State the particular incorrect condition it prevents or detects and how that function was tested.

## Use one controlled operating record

The record should identify the part family and revisions, fixture revision, machine, program, tool assemblies, work-reference method and approved clamping configuration.

Use annotated views or photographs where they improve recognition. Mark the actual locating contacts and the intended part orientation. A general photograph of the fixture may look informative while failing to show the surface that must be clean.

Keep variable settings in one controlled location. Repeating a clamp adjustment or offset value in a drawing, a handwritten card and a spreadsheet creates opportunities for disagreement.

The procedure should direct operators to the machine's approved safety and energy-control requirements. It must not encourage reaching into hazardous areas or bypassing guarding to make a seating check convenient.

## Write checks around observable conditions

| Stage | Required observation | Response if the condition is absent |
|---|---|---|
| Identify | Part, fixture and program belong to the approved combination | Hold and resolve the mismatch |
| Prepare | Reference contacts are clean and serviceable | Use the approved cleaning or maintenance response |
| Locate | Part reaches the intended references without forcing | Remove safely and investigate |
| Clamp | Approved configuration and seating condition are achieved | Do not start the cycle |
| Verify | Required first-off or changeover checks pass | Preserve results and escalate |
| Release | Part and fixture can be opened and unloaded as intended | Follow the approved abnormal-condition procedure |

The table is a design structure for instructions, not a machine operating procedure. The actual checks and safe access method must be qualified for the installation.

“Check the fixture” is too vague. “Confirm the identified seating witness is present at the approved check point” can be useful when the witness itself has been validated. The test should be connected to a condition that matters.

## Control the allowed adjustments

Some adjustments belong to the operator's normal method. Others change the engineering configuration. Distinguish them clearly.

A permitted clamp-height adjustment may accommodate accepted blank thickness while preserving a specified arm geometry. Moving a locator to make a rejected blank fit changes the reference and should not be treated as the same kind of adjustment.

Specify the range, tool and verification required for permitted adjustments. Preserve settings that affect force, stroke or collision clearance. If an adjustment cannot be checked practically, reconsider whether it should be available during routine operation.

Do not let improvised shims become an undocumented part of the fixture. If a shim is required, identify its location, thickness, material, retention and effect on the reference. Include it in the controlled configuration.

## Treat changeover as a separate process

Reloading a part in an unchanged fixture is not the same as reinstalling the fixture on the machine. Changeover includes cleaning the machine interface, securing the fixture, establishing references, selecting the program and tools, and verifying the first acceptable product.

Define the start and finish of changeover timing. For example, start when the prior approved job ends and finish when the new job has produced and accepted its first conforming part. Another definition may be useful, but comparisons must use the same boundary.

Separate work that can safely occur off-machine from work that requires the machine. Pre-staging approved hardware and documents can reduce delay without changing the cutting process. It does not remove the need for final verification.

## Test the instructions with a competent new user

Observe someone who was not involved in the design perform the authorised procedure under appropriate supervision. Ask them to explain the reference contacts, permitted adjustments and stopping conditions.

Do not coach through every unclear step and then record the procedure as successful. Note where the person needed additional information and improve the design or instructions.

Use controlled, safe challenge cases to verify detection functions. Examples include checking that a documented wrong part identifier is rejected by the selection process or examining an intentionally incorrect orientation in a non-operating review. Any physical challenge involving equipment must be planned so it cannot initiate hazardous motion or damage.

The goal is to test the control, not to see whether an operator can improvise around it.

## Give abnormal conditions a clear destination

Define what happens when a part will not seat, a clamp behaves differently, a reference check fails or a machined feature shifts. Identify who can assess the condition and what material must be held.

Preserve the state and evidence where safe and practical. If everything is immediately adjusted until the next part passes, the original cause may be lost.

Avoid a vague instruction to “use judgement” where the decision changes the fixture configuration or product acceptance. Name the authority required. Equally, make the response practical enough that operators can follow it without inventing a parallel informal process.

The [controlled-document guidance](/reados/collections/operational-data-records-and-controls/controlled-document-management-systems/) provides the wider record-management context.

## Exercise: improve an instruction

Rewrite “Load the part, tighten both clamps and run the program.”

A suitable rewrite identifies the approved part and program, the specific references to clean and inspect, the intended orientation and seating sequence, the qualified clamping method, the required pre-cycle verification and the response to a failed check. It refers to the machine's approved safety procedure rather than inventing one in a fixture note.

Then identify a design change that could remove an instruction. A verified asymmetric loading feature may remove the need to judge orientation visually. It will not remove the need to verify part identity.

The next chapter addresses what happens after repeated use changes the fixture itself.
