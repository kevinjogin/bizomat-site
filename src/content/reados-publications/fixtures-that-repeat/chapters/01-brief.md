---
book: fixtures-that-repeat
chapterSlug: define-the-fixture-as-a-production-method
order: 1
title: "Define the fixture as a production method"
description: "Write a fixture brief around functional references, process loads, operator actions and acceptance evidence before selecting plates and clamps."
draft: false
---

A fixture project often begins with an appealing sketch: a base plate, a few locators and quick clamps. The sketch can hide a missing production method. Who establishes the reference, how the blank arrives, which forces act during the cut and how the result is checked are all part of the design.

Begin with the work the fixture must make repeatable. The best brief describes a bounded operation and the evidence required to approve it. It leaves room to choose a standard vice, a modular arrangement or a custom fixture after the need is understood.

## Establish the teaching case

This is an illustration. A fictional workshop machines an inspection bracket from a nominal 150 mm by 80 mm by 16 mm blank. A prepared bottom face, a long side and an end are available as locating references. A feature pattern is machined from the top.

The exercise is to locate the bracket consistently, resist the defined machining loads, permit tool and inspection access, and make loading and unloading understandable to another competent operator. The bracket, loads and results throughout the book are invented. They are not a production design or a KEVOS® project.

The first process proposal is a stationary fixture on a milling machine. This scope matters. A rotating workholder would introduce additional speed, balance, centrifugal-force and retention questions that the present case does not address.

## Separate the functions inside the fixture

Locators establish position and orientation. Supports carry loads and limit deformation. Clamps maintain the intended contacts and resist the loads assigned to them. Some physical elements perform more than one function, but that should be a deliberate design decision.

For example, a fixed vice jaw can locate the side of a part and carry a lateral cutting reaction. A movable jaw applies clamping force. Calling both simply “workholding” can conceal which surface controls a dimension and which load path keeps the part from moving.

```figure
type: layers
title: Three functions inside a fixture
caption: One element can do more than one job, but that should be a deliberate design decision.
- Locators | establish position and orientation
- Supports | carry loads and limit deformation
- *Clamps | maintain the contacts and resist assigned loads
```

The distinction is consistent with [Carr Lane's locating and clamping guidance](https://www.carrlane.com/engineering-resources/fixture-design-principles/locating-clamping-principles). This book develops its own contact map and calculations rather than treating a catalogue illustration as an approved solution.

## Record the incoming condition

A fixture cannot repeat a reference that the incoming part does not provide. Identify whether the blank is sawn, cast, forged, printed or already machined. Specify which surfaces are controlled and which are allowed to vary.

For the teaching bracket, assume the three chosen reference faces are prepared before this operation. If that assumption changes to raw sawn surfaces, the location method must be reviewed. A clamp cannot turn an irregular edge into a reliable datum merely by applying more force.

Include burrs, loose scale and contamination in the incoming-condition review. Decide how the operator recognises an unacceptable blank and where it is placed. An instruction to “make it fit” invites unrecorded grinding, hammering or improvised shims that defeat the design.

Also identify the part variants. Two similar brackets may fit the same nest but require different programs or offsets. A fixture that physically accepts both needs a reliable method of selecting and verifying the correct process.

## Define the envelope of the operation

List the intended machine, tool assemblies, approach and withdrawal paths, cutting directions, coolant conditions and relevant load cases. Include interrupted engagement, entry, exit and foreseeable process disturbances in the engineering review.

The numerical examples later use an assumed horizontal force of 800 N, an upward force of 300 N and a 32 N·m overturning couple in a simplified section. Those inputs are supplied for teaching. They are not derived from a specified cutter, material or machine, and they cannot be used as a real load rating.

A real brief must identify how its load envelope was obtained and how uncertainty is addressed. Machine spindle power alone does not define every workpiece force. Force direction, engagement and transient behaviour matter.

Do not settle the clamp selection before this information is available. A convenient lever clamp may be inappropriate for the force direction, stroke, reach or operating environment even if its catalogue number looks large enough.

## Make acceptance observable

| Requirement | Useful evidence | Inadequate substitute |
|---|---|---|
| Repeatable location | A defined reload study and feature verification | One part indicated once |
| Secure load path | Reviewed load cases, ratings and application checks | Clamp handle feels tight |
| Limited deformation | Model and suitable measurements under load | Part looks rigid |
| Clear tool access | Complete tool-envelope and program review | Cutter tip clears in one view |
| Repeatable operation | Observed use of controlled instructions | Designer can operate it |
| Maintainable accuracy | Wear limits, checks and replaceable items | No visible damage at delivery |

```figure
type: compare
title: Make acceptance observable
cols: Useful evidence | Inadequate substitute
best: 1
caption: Each requirement needs evidence another person can check, not an impression.
- Repeatable location | A defined reload study | One part indicated once
- Secure load path | Reviewed load cases and ratings | The clamp handle feels tight
- Limited deformation | A model and measurements under load | The part looks rigid
- Clear tool access | A full tool-envelope review | The cutter tip clears in one view
- Repeatable operation | Observed use of instructions | The designer can operate it
- *Maintainable accuracy | Wear limits, checks, replaceable items | No visible damage at delivery
```

Choose numerical criteria from the product and process requirements. This table does not prescribe universal repeatability or safety thresholds. The purpose is to prevent attractive but weak evidence from being accepted as proof.

## Establish the economic baseline honestly

Observe the current method before predicting savings. Separate loading, locating, clamping, cutting, tool changes, unloading and inspection. Record set-up time separately from per-part cycle time.

A change that saves two minutes of loading but adds three minutes of inspection has not shortened the complete cycle. A quick clamp that needs frequent adjustment may move work into the set-up period. The baseline should capture those effects.

Also distinguish machine occupancy from operator attention. An automatic cut may free an operator for another task without freeing the machine. A business case should state which resource is constrained and how released time could actually be used.

The existing [fixture business-case chapter](/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-jigs-and-fixtures-that-pay/) provides broader context. This book will connect the economic result to a qualified technical method rather than treating time saved as sufficient approval.

## Write a brief another person can challenge

For the teaching bracket, a useful brief names the part and operation, the three reference faces, the controlled features, the assumed load cases, the machine interface, the loading sequence, inspection needs and the expected production pattern.

Include exclusions and unresolved inputs. “Load envelope awaiting process-engineering confirmation” is a legitimate development condition. It should prevent final load approval, not disappear when the design drawing is issued.

Assign an owner to each open question and identify the next decision it affects. Tool access can often be reviewed while force data are being developed. Final clamping approval cannot be inferred from that access review.

## Exercise: repair an incomplete request

A manager asks for “a quick fixture for this bracket, accurate to 0.02 mm”. Write five clarifications that would materially change the design.

A strong response asks which feature or relationship the 0.02 mm applies to; whether it is a product tolerance or a fixture-repeatability allocation; what incoming surfaces are available; which machine, tools and loads apply; and how the complete operation will be accepted. Quantity, variants, cleaning and maintenance are additional useful questions.

The result of this chapter is a bounded production problem. The next chapter turns it into a contact arrangement that locates the workpiece without forcing inconsistent surfaces to agree.
