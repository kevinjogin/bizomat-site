---
book: fixtures-that-repeat
chapterSlug: make-correct-loading-and-changeover-repeatable
order: 8
title: "Make correct loading and changeover repeatable"
description: "Turn fixture knowledge into controlled operating and changeover instructions, with clear checks for part identity, seating, program selection and abnormal conditions."
draft: false
---

A fixture is not ready for routine use while its reliable operation depends on the designer standing beside it. The contact map, loading sequence, permitted adjustments and abnormal-condition response must be visible in the production method.

Good instructions describe what the operator must recognise and decide. They do not compensate for an arrangement that is difficult to seat, hard to inspect or easy to load incorrectly.

## Separate physical prevention from detection

A physical key can prevent a reversed part from reaching the intended seating position. A sensor or gauge may detect incorrect seating. A label reminds the operator what to do. These controls have different strengths and failure modes.

For the teaching bracket, imagine a mirrored variant that can enter the same rectangular nest. An asymmetric feature may provide an opportunity to prevent the wrong orientation. Any key must clear the accepted part variation and must not become an unintended locating contact.

A key does not establish material grade, program revision or hidden internal features. Identify which error each control addresses and which errors remain possible.

Do not call a fixture “mistake-proof” as an unrestricted claim. State the particular incorrect condition it prevents or detects and how that function was tested.

```figure
type: layers
title: Prevent, detect or remind
caption: State which incorrect condition each control prevents or detects, and how that was tested.
- *Physical key | prevents a reversed part from seating
- Sensor or gauge | detects incorrect seating
- Label | reminds the operator
```

## Use one controlled operating record

The record should identify the part family and revisions, fixture revision, machine, program, tool assemblies, work-reference method and approved clamping configuration.

Use annotated views or photographs where they improve recognition. Mark the actual locating contacts and the intended part orientation. A general photograph of the fixture may look informative while failing to show the surface that must be clean.

Keep variable settings in one controlled location. Repeating a clamp adjustment or offset value in a drawing, a handwritten card and a spreadsheet creates opportunities for disagreement.

The procedure should direct operators to the machine's approved safety and energy-control requirements. It must not encourage reaching into hazardous areas or bypassing guarding to make a seating check convenient.

## Build a set-up sheet the job can run from

The operating record works best as a single set-up sheet that travels with the job and holds every value the set-up depends on. For the bracket fixture, it would include:

```figure
type: checklist
title: Set-up sheet for the bracket fixture
caption: One controlled sheet holds every value the set-up depends on, so nothing is remembered or copied by hand.
- x Fixture identifier and revision, with its location keys or dowels
- x Work offset expected value and permitted variation
- x Program revision and tool list with measured stick-outs
- x Clamp configuration, arm settings and supply pressure range
- x Locating contacts to clean, shown on an annotated view
- *x First-off checks, with the features, methods and limits
```

The expected work offset deserves particular attention. If the fixture is located by keys, the offset should come out within a small, known range each time. Writing that range on the sheet turns the offset check into a test: a value outside it means something is different, a worn key, debris under the base or the wrong fixture, and the set-up stops until the reason is found. Without the range, any offset the probe returns is simply accepted.

## Write checks around observable conditions

| Stage | Required observation | Response if the condition is absent |
|---|---|---|
| Identify | Part, fixture and program belong to the approved combination | Hold and resolve the mismatch |
| Prepare | Reference contacts are clean and serviceable | Use the approved cleaning or maintenance response |
| Locate | Part reaches the intended references without forcing | Remove safely and investigate |
| Clamp | Approved configuration and seating condition are achieved | Do not start the cycle |
| Verify | Required first-off or changeover checks pass | Preserve results and escalate |
| Release | Part and fixture can be opened and unloaded as intended | Follow the approved abnormal-condition procedure |

```figure
type: steps
title: Checks written around observable conditions
caption: Each stage has a required observation and a defined response when it is absent.
- Identify | part, fixture and program match
- Prepare | contacts clean and serviceable
- Locate | reaches references without forcing
- *Clamp | approved configuration achieved
- Verify | first-off checks pass
- Release | opens and unloads as intended
```

The table is a design structure for instructions, not a machine operating procedure. The actual checks and safe access method must be qualified for the installation.

“Check the fixture” is too vague. “Confirm the identified seating witness is present at the approved check point” can be useful when the witness itself has been validated. The test should be connected to a condition that matters.

## Check the first part and keep the last

A first-off check confirms that the set-up produces conforming parts before the batch runs. It should measure the features the fixture controls, using the method and limits on the set-up sheet, and the result should be recorded with the batch. A first-off check that passes is also the reference against which later drift can be judged.

A last-off check, measuring the final part of the batch in the same way, closes the loop. It shows whether the process held steady through the run, and it gives the next batch a reference point: if the last part of the previous batch was good, a problem at the start of the next batch points to the changeover rather than to wear accumulated during the run. Keeping the last-off part, labelled, until the next batch has passed its first-off check gives a physical reference that can be remeasured if questions arise.

## Control the allowed adjustments

Some adjustments belong to the operator's normal method. Others change the engineering configuration. Distinguish them clearly.

A permitted clamp-height adjustment may accommodate accepted blank thickness while preserving a specified arm geometry. Moving a locator to make a rejected blank fit changes the reference and should not be treated as the same kind of adjustment.

Specify the range, tool and verification required for permitted adjustments. Preserve settings that affect force, stroke or collision clearance. If an adjustment cannot be checked practically, reconsider whether it should be available during routine operation.

Do not let improvised shims become an undocumented part of the fixture. If a shim is required, identify its location, thickness, material, retention and effect on the reference. Include it in the controlled configuration.

## Watch for informal changes

Over months of use, informal changes accumulate: a piece of shim stock under a support, a clamp swapped for a spare of a different type, a pad replaced with whatever material was at hand, an extra step added because "it works better". Each may be well intentioned and may even solve a real problem. Together they leave a fixture that no longer matches its qualification.

Periodic audits of the fixture against its drawing and set-up sheet catch these changes. When one is found, the response should be to understand why it was made. If it solves a real problem, bring it into the controlled configuration through the change process; if not, remove it. Either way, the fixture and its records come back into agreement.

## Treat changeover as a separate process

Reloading a part in an unchanged fixture is not the same as reinstalling the fixture on the machine. Changeover includes cleaning the machine interface, securing the fixture, establishing references, selecting the program and tools, and verifying the first acceptable product.

Define the start and finish of changeover timing. For example, start when the prior approved job ends and finish when the new job has produced and accepted its first conforming part. Another definition may be useful, but comparisons must use the same boundary.

Separate work that can safely occur off-machine from work that requires the machine. Pre-staging approved hardware and documents can reduce delay without changing the cutting process. It does not remove the need for final verification.

## Hand over the job between shifts

When a job runs across shifts, the incoming operator inherits a set-up they did not make. A short, structured handover prevents the commonest problems: a tool changed but not recorded, a clamp adjusted for a batch of thick blanks, an abnormal condition noticed but not resolved. The handover can be a few lines on the job record: parts made, current tool life, any adjustments within the permitted range, any held parts and why, and any open question for the next shift or supervisor.

The incoming operator should check the set-up against the sheet rather than assuming it is unchanged, and should measure the first part of their shift if the process plan requires it. A handover note that says "all normal" is useful only if "normal" has a definition the next person can check.

## Store the fixture so it returns unchanged

Between batches, a fixture can be damaged, lose parts or be cannibalised for another job. When it returns, the set-up then fails in ways that look like process problems.

Give the fixture a defined storage place, with the locating contacts protected from knocks and corrosion, and keep its loose items, clamps, pads, keys, the seating pusher and identified spares, in a labelled kit that is checked when the fixture is put away and when it is taken out. Attach or store the set-up sheet with it. A fixture that comes back complete, clean and with its sheet saves the first hour of every changeover and removes a common source of first-off failures.

## Test the instructions with a competent new user

Observe someone who was not involved in the design perform the authorised procedure under appropriate supervision. Ask them to explain the reference contacts, permitted adjustments and stopping conditions.

Do not coach through every unclear step and then record the procedure as successful. Note where the person needed additional information and improve the design or instructions.

Use controlled, safe challenge cases to verify detection functions. Examples include checking that a documented wrong part identifier is rejected by the selection process or examining an intentionally incorrect orientation in a non-operating review. Any physical challenge involving equipment must be planned so it cannot initiate hazardous motion or damage.

The goal is to test the control, not to see whether an operator can improvise around it.

## Explain why, not just what

Operators follow instructions more reliably when they understand them. A short explanation of why the three bottom supports must be clean, why the part must touch both side contacts before clamping, and why the clamp order matters, turns a list of steps into a method someone can apply sensibly when something unexpected happens.

The explanation can be brief: an annotated photograph showing the six contacts, with one line on what each controls, and a sentence on what happens to the part if a contact is missed. Operators who know that a chip under the end stop moves every feature along the part's length are more likely to look for it, and more likely to report it when they find one.

## Design the work for repetition

At 2,400 parts a year, the operator loads, seats and clamps the bracket thousands of times. Small awkwardnesses multiply: a reach over a clamp, a part that must be held in place with one hand while the other tightens a screw, a heavy fixture lifted onto the table at every changeover. Over a shift, fatigue makes shortcuts likely, and the shortcuts are usually the steps that protect the location.

Review the operating method for reach, posture, force and repetition, using the site's ergonomic and manual-handling guidance. Practical improvements include placing clamps so they can be operated without reaching across the part, using a seating pusher so the part does not need to be held, providing lifting aids or a mounting sub-plate for heavy fixtures, and placing the next blank and the finished-part tray within easy reach. An instruction that is comfortable to follow is followed more consistently.

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
