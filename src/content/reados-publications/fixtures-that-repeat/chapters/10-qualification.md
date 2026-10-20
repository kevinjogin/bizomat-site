---
book: fixtures-that-repeat
chapterSlug: qualify-the-fixture-and-the-business-case
order: 10
title: "Qualify the fixture and the business case"
description: "Complete a fixture review, distinguish unresolved technical gates from economic estimates and calculate a transparent batch-level capacity and payback comparison."
draft: true
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

## Compare complete batch time

This is an illustration using the assumed 134-second new cycle from Chapter 6. Suppose the current method takes 180 seconds per part and 45 minutes to set up. The candidate method is estimated to take 25 minutes to set up. Each batch contains 300 parts.

Current batch time is:

**45 × 60 + 300 × 180 = 56,700 seconds = 15.75 hours.**

Candidate batch time is:

**25 × 60 + 300 × 134 = 41,700 seconds ≈ 11.5833 hours.**

The estimated difference is **15,000 seconds**, or **4.1667 hours per batch**. It includes both the 20-minute set-up saving and the 46-second per-part saving.

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

Across twelve batches, the first-year balance would be **A$2,160 − A$300 − A$3,600 = negative A$1,740**. The design may still be justified by another supported benefit, but the original time-saving argument no longer supports the same conclusion.

Technical acceptance remains separate. A financially attractive fixture with an unresolved retention problem cannot be approved on the basis of payback.

## Build the handover around evidence

The final package should connect the fixture identifier and revision to the approved part range, drawings, load and stiffness review, manufacturer instructions, machine interface, program and tools, qualification results, operating method and maintenance response.

Include the raw data needed to interpret the studies, not only selected summary statistics. Preserve deviations and their disposition. A later engineer should be able to understand why the configuration was accepted and which changes require revalidation.

For procurement, define what the supplier must deliver to support acceptance. A finished fixture without the required force data, spare specifications or measurement records may be physically complete but contractually and operationally incomplete.

Use the [Product Development and Launch collection](/reados/collections/product-development-and-launch/) for the wider transition into production. This book concentrates on the fixture's contribution to that transition.

## Final exercise: write the approval boundary

Draft a release statement for a real fixture using this structure: approved configuration; permitted operation and conditions; evidence reviewed; required operating and maintenance controls; excluded conditions; and changes that trigger review.

If an important entry remains unsupported, authorise only the next justified step and name the evidence needed to move further. For the teaching case, that means resolving the stiffness, access and operator-shift findings before claiming routine production readiness.

A repeatable fixture is maintained by the agreement between geometry, loads, measurement and method. The hardware makes that agreement possible; qualification and control keep it true.
