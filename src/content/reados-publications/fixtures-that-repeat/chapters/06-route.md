---
book: fixtures-that-repeat
chapterSlug: make-the-toolpath-and-fixture-agree
order: 6
title: "Make the toolpath and fixture agree"
description: "Review complete tool envelopes and reference transfers, calculate an illustrative feed time and account for the handling and inspection work around the cut."
draft: false
---

A fixture is only useful when the complete machining operation can be performed around it. The cutter must reach the work, the holder must clear the clamps, chips must leave the contacts and the finished part must be removable.

Review the route with the fixture designer, programr and operator together. A clamp moved for tool clearance can change the force path; a new approach move can introduce a different load direction. These are connected engineering changes.

## Define the complete tool envelope

Include the cutter, holder, spindle nose where relevant, coolant hardware and every commanded approach, retract and transfer motion. Review the actual tool assembly and its permitted overhang, not only a simplified cutter cylinder.

This is an illustration. A cutter has a 10 mm radius, but its holder has a 25 mm radius. A clamp face lies 22 mm from the tool centreline at a height where the holder passes.

The cutter has 12 mm of radial clearance to that face, yet the holder overlaps it by **3 mm**. A cutter-only simulation would miss the collision. If the face were 29 mm away, the ideal holder clearance would be 4 mm; whether that is sufficient depends on the actual motion, tolerances and required clearance policy.

Check tool changes and non-cutting moves as well as the programd contour. An obstruction can occur while the machine travels between features or returns to a safe position.

## Keep references consistent across operations

The bracket's product drawing, fixture locators and machine work coordinate system must describe compatible relationships. Record how the fixture is established on the machine and how the work offset is verified.

If a later operation locates from newly machined features, identify the transferred relationship. The first set-up's error may be carried into the second operation, cancelled by the new reference or combined with another error. Analyse the actual chain.

Do not edit a work offset to compensate for a moving part. An offset is appropriate for a known coordinate relationship; it is not a cure for inconsistent seating or an unstable contact.

Preserve the fixture revision, program revision, tool list and offset-setting method together. A proven program used with a revised clamp arrangement requires a new access review even if the part geometry is unchanged.

## Use machining formulas with supplied inputs

The [Sandvik Coromant milling reference](https://www.sandvik.coromant.com/en-gb/knowledge/machining-formulas-definitions/milling-formulas-definitions) gives the relationships between cutting speed, spindle speed, effective cutting edges, feed per tooth and table feed.

For a calculation exercise only, assume a 20 mm effective cutting diameter, a cutting speed of 120 m/min, four effective cutting edges and a feed per tooth of 0.05 mm. These are not recommended cutting data for the teaching bracket or any real material.

**Spindle speed n = 1,000vc / (πD) = 1,000 × 120 / (π × 20) ≈ 1,909.86 r/min.**

If the example program uses 1,900 r/min, its corresponding cutting speed is approximately **119.38 m/min**. Table feed is:

**vf = n × z × fz = 1,900 × 4 × 0.05 = 380 mm/min.**

For a 120 mm straight travel at constant programd feed, ideal travel time is:

**120 / 380 = 0.315789 minutes = 18.947 seconds.**

```figure
type: stats
title: Machining inputs for the example pass
caption: Supplied cutting data, not a recommendation: speed and feed follow from the stated inputs.
- About 1,910 r/min | Spindle speed | at 120 m/min with a 20 mm cutter
- 380 mm/min | Table feed | 1,900 r/min × 4 teeth × 0.05 mm
- *About 19 s | Machining travel | for 120 mm
```

Actual time includes acceleration, deceleration and other movements. Engagement, chip thinning, tool geometry, material, power and stability also affect the suitability of cutting conditions. Confirm real data and application limits with the relevant tool and machine information.

## Count the work around the cut

The 19-second idealised travel does not describe a complete production cycle. The following invented timing sheet rounds that travel to 19 seconds and includes other sequential work:

| Activity | Assumed time |
|---|---:|
| Load blank | 35 s |
| Establish and check location | 10 s |
| Apply clamps | 12 s |
| Illustrative machining travel | 19 s |
| Tool-change and transfer allowance | 8 s |
| Release clamps | 10 s |
| Unload part | 10 s |
| Required per-part inspection | 30 s |
| Total sequential cycle | 134 s |

```figure
type: stack
title: Where the 134-second cycle goes
unit: s
caption: Cutting is only 19 seconds; saving 4 seconds there improves the whole cycle by about 3%, not 21%.
- Load blank | 35
- Locate and check | 10
- Apply clamps | 12
- *Machining travel | 19
- Tool change and transfer | 8
- Release and unload | 20
- Per-part inspection | 30
```

These times are assumptions for a business comparison later in the book. They are not measured results. A real timing study should distinguish necessary work, delays and occasional tasks such as cleaning or tool replacement.

If activities overlap, model the resource schedule rather than subtracting the overlap casually. Inspection performed while the next part cuts may reduce total elapsed time only when the same operator can safely perform both tasks and the timing permits it.

## Design for chips, cleaning and release

Chips beneath a locator can shift a part by more than the variation the fixture was designed to control. Provide a practical cleaning method, clearance for removed material and access to inspect critical contacts.

Do not prescribe reaching into a machine or using compressed air without the site's approved procedure and the equipment's requirements. The fixture should support a safe, repeatable cleaning process rather than rely on improvised access.

Consider the finished shape. A removed wall may reduce stiffness, a burr may obstruct release or a toolpath may leave the part trapped behind a clamp. Review unloading with the machined geometry, including foreseeable variation.

Keep clamps and handles within their permitted travel. A clamp that clears in its working position may collide with the part during opening. A drawing showing only one state does not establish usability.

## Validate changes in the route

Moving a clamp outside the tool envelope can increase an unsupported span. Increasing tool overhang to clear a fixture can worsen tool deflection. Changing cut direction to push into a stop can alter engagement and force behaviour.

Record the reason and consequence of each change, then repeat the affected checks. Do not treat programming as an independent final stage that can alter fixture assumptions without review.

The existing [CNC and CAM chapter](/reados/collections/machining-and-metal-parts/cnc-programming-and-cam-basics/) supplies broader programming context. This chapter's focus is agreement between the physical fixture and the complete planned operation.

## Exercise: compare local and total improvement

A revised toolpath reduces the illustrative 19-second machining segment to 15 seconds, with all other times unchanged. What is the new sequential cycle and the percentage improvement in total cycle time?

The cycle becomes **130 seconds**. The four-second saving is **4 / 134 × 100 ≈ 2.99%** of the original total cycle. Describing it as a 21% production improvement would confuse the local machining reduction with the complete process.

The next chapter develops trial evidence to determine whether the fixture locates repeatably and whether the measurement process is capable of revealing its behaviour.
