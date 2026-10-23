---
book: fixtures-that-repeat
chapterSlug: qualify-the-fixture-and-the-business-case
order: 10
title: "Qualify the fixture and the business case"
description: "Complete a fixture review, distinguish unresolved technical gates from economic estimates and calculate a transparent batch-level capacity and payback comparison."
draft: false
---

A fixture should be released as a defined configuration performing a defined operation under a defined method. A good part and a favourable payback estimate are useful observations, but neither closes missing evidence about loads, deformation or repeatability.

This chapter assembles the teaching case into a review that can say yes, no or proceed to a bounded next step. The purpose is a decision that reflects the evidence, including an honest hold when the design is not yet qualified.

## Review the technical findings together

The locating concept uses prepared primary, side and end references. Its detailed contacts and loading sequence still require confirmation against the actual drawing and incoming variation.

The simplified load model shows why total clamp force is insufficient as a check. With 500 N per clamp, 300 N uplift and a 32 N·m couple, one support reaction falls to 30 N. A higher assumed clamp force improves that model but increases the loads that other components must carry.

The stiffness model exposes another issue. A 10 mm bridge predicts 0.0375 mm deflection. A 16 mm bridge predicts about 0.009155 mm in isolation, but adding the assumed series-contact displacement raises the total to approximately 0.024155 mm. The proposed 0.010 mm allocation is therefore not established by thickening the bridge alone.

The reload study also reveals a 0.008 mm operator-group shift that needs investigation. Its small within-group spread does not close that issue. These are useful findings because they identify what must change before a stronger approval is justified.

## Make the disposition explicit

| Review item | Teaching-case evidence | Disposition |
|---|---|---|
| Location concept | Defined 3-2-1 roles and contact sequence | Suitable concept for detailed review |
| Load retention | Two-dimensional screening calculations | Actual three-dimensional load and rating checks still required |
| Deflection | Series model exceeds the provisional allocation | Revise support or interface design and verify |
| Tool access | Holder collision identified in one illustrative position | Correct the arrangement and review the full envelope |
| Reload behaviour | Small exploratory study with an operator shift | Investigate and repeat the affected study |
| Production capability | No representative long-run dataset supplied | No capability claim |
| Maintenance | Example thresholds and spare policy | Adapt and qualify for the actual components |

The worked decision is **hold unrestricted production release**. Continue detailed design and controlled qualification under the responsible engineering and machine procedures. This is a completed decision from the evidence, not a claim that the illustrative fixture is production-ready.

A later approval requires documented closure of the actual gates, not simply changing the word “hold” on the form. Name the configuration, operating envelope, accepted studies, instructions, maintenance requirements and authorised approver.

## Turn each finding into a change and a re-test

A hold decision is useful only if it says what would lift it. For the teaching case, each open finding can be paired with a proposed change and the evidence that would show the change worked:

```figure
type: compare
title: From findings to changes for the bracket fixture
cols: Proposed change | Evidence to close it
caption: Each finding gets a change and a re-test, so the next review can close it on evidence rather than opinion.
- Deflection over the allocation | Shorter support span and a stiffer contact interface | Displacement test at the controlled feature under load
- Holder collision near a clamp | Low-profile clamp moved clear of the pocket | Full-envelope simulation with the real holder, then cautious prove-out
- Operator offset of 0.008 mm | Seating pusher and a revised loading instruction | Repeat the balanced two-operator reload study
- *Thin support reaction under load | Clamps moved towards the light support, checked for reversed moments | Updated load-case table and screening calculations
```

Each change may affect another finding. Moving a clamp for tool access changes the reactions; adding a seating pusher changes the loading sequence; shortening a support span may change access. The change list should therefore be reviewed as a set, and the re-tests run on the revised fixture as a whole, not one item at a time on different configurations.

## Decide which evidence must be repeated

Not every study needs repeating after every change. A useful rule is to repeat any study whose result could have been affected. Moving a clamp affects load retention and access, so those checks repeat; it does not affect the measurement method, so the measurement checks need not. Changing a locating contact affects location, so the reload study repeats, and the locator baseline must be measured again.

Write the decision down for each change, with the reasoning. A reviewer who sees that the reload study was not repeated after a clamp change should be able to read why, rather than wonder whether it was forgotten.

## State the operating envelope

A release covers the fixture under particular conditions, and the release statement should name them. For the bracket fixture, they include the accepted range of blank thickness and condition, the approved cutting data and toolpaths, the clamp settings and the supply pressure range for any powered clamps, the machine or machines it is qualified on, and any warm-up or temperature condition the trial showed to matter.

Conditions outside the envelope are not necessarily unsafe or unworkable, but they have not been shown to work. A request to run the fixture with a heavier cut, a thicker blank or on a different machine is then a change to be assessed, rather than an informal extension that nobody decided.

## Compare complete batch time

This is an illustration using the assumed 134-second new cycle from Chapter 6. Suppose the current method takes 180 seconds per part and 45 minutes to set up. The candidate method is estimated to take 25 minutes to set up. Each batch contains 300 parts.

Current batch time is:

**45 × 60 + 300 × 180 = 56,700 seconds = 15.75 hours.**

Candidate batch time is:

**25 × 60 + 300 × 134 = 41,700 seconds ≈ 11.5833 hours.**

The estimated difference is **15,000 seconds**, or **4.1667 hours per batch**. It includes both the 20-minute set-up saving and the 46-second per-part saving.

```figure
type: bars
title: Time for a 300-part batch
unit: hours
max: 17
caption: About 4.17 hours saved a batch: a 20-minute shorter set-up and 46 seconds less per part.
- Current method: 45 min set-up, 180 s a part | 15.75
- *New fixture: 25 min set-up, 134 s a part | 11.58
```

The estimate assumes the stated activities occur sequentially and excludes unlisted downtime, scrap, maintenance and waiting. Validate those assumptions with observations of the qualified process. Do not compare a measured current method with an ideal new method while hiding the difference in evidence quality.

## Value capacity separately from cash

At an invented internal planning value of A$90 per released hour, 4.1667 hours represents **A$375 per batch**. Across twelve batches per year, the estimate is **50 hours**, valued at **A$4,500**.

This is a capacity valuation, not necessarily a cash saving. If staff remain paid and the machine has no useful additional work, the released hours may not reduce expenditure or generate revenue. They may still improve delivery flexibility, but that benefit should be described accurately.

Assume initial fixture and qualification expenditure of A$3,600 and additional annual maintenance of A$300. Under the full capacity-value assumption, the first-year balance is:

**A$4,500 − A$300 − A$3,600 = A$600.**

Spreading maintenance equally over the twelve batches gives A$25 per batch, leaving an assumed net value of A$350 per batch. Recovering A$3,600 would require approximately **10.29 batches**, so eleven complete batches under these assumptions.

No discounting, tax effect, financing cost or residual value is included. The simple calculation is for comparison, not a financial valuation of a real business.

## Test the assumption that changes the decision

Suppose the verified per-part saving is only 20 seconds instead of 46 seconds, while the set-up saving remains 20 minutes. The batch saving becomes:

**300 × 20 + 20 × 60 = 7,200 seconds = 2 hours.**

At A$90 per hour, that is A$180 per batch. After A$25 of allocated maintenance, the net value is A$155. Recovering A$3,600 would take approximately **23.23 batches**, more than the assumed annual volume.

```figure
type: bars
title: Batches needed to recover the A$3,600 fixture
unit: batches
max: 25
caption: The per-part saving decides the case: at 20 seconds, payback needs more than the twelve batches a year.
- *Per-part saving of 46 s | 10.29
- Per-part saving of only 20 s | 23.23
- Batches a year | 12
```

Across twelve batches, the first-year balance would be **A$2,160 − A$300 − A$3,600 = negative A$1,740**. The design may still be justified by another supported benefit, but the original time-saving argument no longer supports the same conclusion.

Technical acceptance remains separate. A financially attractive fixture with an unresolved retention problem cannot be approved on the basis of payback.

## Use measured times in the final case

The business comparison above uses the assumed 134-second cycle from Chapter 6. By the time of release, the trial will have measured the real cycle. The final case should be recalculated with the measured times, including the occasional tasks such as cleaning and checks, and with the measured set-up time from at least one complete changeover.

The sensitivity case shows why this matters: the difference between a 46-second and a 20-second per-part saving is the difference between a fixture that pays back within the year and one that does not. Presenting the assumed figure at release, when a measured one is available, would hide the most important number in the case.

## Build the handover around evidence

The final package should connect the fixture identifier and revision to the approved part range, drawings, load and stiffness review, manufacturer instructions, machine interface, program and tools, qualification results, operating method and maintenance response.

Include the raw data needed to interpret the studies, not only selected summary statistics. Preserve deviations and their disposition. A later engineer should be able to understand why the configuration was accepted and which changes require revalidation.

For procurement, define what the supplier must deliver to support acceptance. A finished fixture without the required force data, spare specifications or measurement records may be physically complete but contractually and operationally incomplete.

Use the [Product Development and Launch collection](/reados/collections/product-development-and-launch/) for the wider transition into production. This book concentrates on the fixture's contribution to that transition.

## Make each approval specific

A fixture release usually needs several people to agree, and each approval should cover what that person can judge. The fixture designer approves the location strategy, load-path review and deflection evidence. Manufacturing engineering approves the program, tools, access review and cycle evidence. Quality approves the measurement methods, the reload study and the first-off and last-off checks. Production approves that the operating method and instructions are workable on the shop floor, and maintenance approves that the register, spares and repair instructions are in place. The person accountable for the business case approves the economic basis using the measured times.

Separate approvals make gaps visible. If nobody is able to sign for the maintenance arrangements, the release record shows an empty line rather than hiding the gap beneath a single signature. They also make each person's commitment clear: a quality approval of the reload study is not an endorsement of the payback calculation, and neither should be read as one.

## What a release statement might say once the gaps close

This is an illustration of the form, not a conclusion about the teaching fixture. If the changes above were made and their re-tests passed, a release statement might read:

*Fixture BF-01, revision C, is released for the inspection bracket, drawing revision B, operation 10, on the identified milling machine, using program revision D and the listed tools. Accepted blanks are 16.0 ± 0.2 mm thick with prepared reference faces. Evidence reviewed: load-case review revision 3, displacement test showing the controlled feature within 0.010 mm under the defined load, full-envelope access review and prove-out record, and a balanced twenty-load reload study by two operators. Required controls: set-up sheet revision C, first-off and last-off checks, and the maintenance register entries for locating pin, supports, stops and clamps. Excluded: other parts, other machines and cutting data outside the approved set. Any change to locators, clamps, program, tools or blank condition requires review before use.*

Every phrase in it points to a record. If any record does not yet exist, the corresponding phrase cannot be written, and the release cannot yet be given.

## Review the fixture after the first batches

Release is not the end of the evidence. A review after the first few production batches compares what actually happened with what the release assumed: measured cycle and set-up times, first-off and last-off results, any parts held or scrapped, wear readings against the register, and operator comments.

Small corrections at this stage, an interval adjusted, an instruction clarified, a spare stocked, are normal and should be made through the change process. A large discrepancy, such as a feature drifting through every batch or a cycle time far above the measured trial value, reopens the release for the affected claim. Either way, the review closes the loop between the qualification and the production it was meant to predict.

## Final exercise: write the approval boundary

Draft a release statement for a real fixture using this structure: approved configuration; permitted operation and conditions; evidence reviewed; required operating and maintenance controls; excluded conditions; and changes that trigger review.

If an important entry remains unsupported, authorise only the next justified step and name the evidence needed to move further. For the teaching case, that means resolving the stiffness, access and operator-shift findings before claiming routine production readiness.

A repeatable fixture is maintained by the agreement between geometry, loads, measurement and method. The hardware makes that agreement possible; qualification and control keep it true.
