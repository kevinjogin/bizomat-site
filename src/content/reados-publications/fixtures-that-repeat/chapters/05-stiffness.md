---
book: fixtures-that-repeat
chapterSlug: control-deflection-as-well-as-strength
order: 5
title: "Control deflection as well as strength"
description: "Screen fixture deflection with a simple beam model, compare support and thickness changes, and identify joint and workpiece compliance that the model omits."
draft: false
---

A fixture can remain far below a material's strength limit and still move enough to spoil the part. Strength asks whether a component survives a load under the relevant failure criteria. Stiffness asks how much its position changes while carrying that load.

For precision workholding, the second question can control the design. It also includes the workpiece: a part machined while bent may spring into an unacceptable shape after it is unclamped.

## Start with a screening model

This is an illustration. A replaceable steel bridge in a proposed fixture is represented as a simply supported rectangular beam with a central load of 900 N. Its support span L is 100 mm, width b is 30 mm and thickness t is 10 mm. Assume an elastic modulus E of 200,000 N/mm².

The rectangular second moment of area about the bending axis is:

**I = bt³ / 12 = 30 × 10³ / 12 = 2,500 mm⁴.**

For the ideal central-load beam, maximum deflection is:

**δ = PL³ / (48EI) = 900 × 100³ / (48 × 200,000 × 2,500) = 0.0375 mm.**

The standard equation is documented in David Roylance's [Beam Displacements](https://ocw.mit.edu/courses/3-11-mechanics-of-materials-fall-1999/resources/mit3_11f99_bdisp/) lecture note. It assumes small elastic deflection and ideal supports; it is not a complete model of a bolted fixture or a plate.

## Check stress without confusing the decision

For the same ideal beam, the maximum bending moment is **PL / 4 = 22,500 N·mm**. The distance from the neutral axis to the outer surface is 5 mm, giving a nominal maximum bending stress of:

**σ = Mc / I = 22,500 × 5 / 2,500 = 45 N/mm²**, or 45 MPa.

This stress calculation does not establish a permissible working stress for an unspecified steel, nor does it check holes, notches, contact stresses or fatigue. It simply shows that the stress and deflection calculations answer different questions.

If the fixture's provisional deflection allocation is 0.010 mm at this location, the predicted 0.0375 mm fails that allocation regardless of whether a later strength check passes. A report containing only a favourable stress result would miss the dimensional problem.

## Compare geometry changes

The beam model makes the sensitivity clear: deflection is proportional to load, to span cubed, and inversely proportional to thickness cubed when width and material remain fixed.

Increasing thickness from 10 to 16 mm changes the predicted deflection by the factor (10/16)³:

**δ16 = 0.0375 × (10/16)³ = 0.009155 mm**, approximately.

Keeping the 10 mm thickness but reducing span from 100 to 60 mm gives:

**δ60 = 0.0375 × (60/100)³ = 0.008100 mm.**

```figure
type: bars
title: Deflection of the support beam under 900 N
unit: mm
max: 0.04
caption: Thickness acts as a cube and span as a cube: both are powerful, but the interfaces still count.
- 10 mm plate, 100 mm span | 0.0375
- 16 mm plate, 100 mm span | 0.009155
- *10 mm plate, 60 mm span | 0.0081
- Provisional allocation | 0.01
```

Both changes bring the ideal beam result below the provisional 0.010 mm allocation. Neither establishes the complete fixture deflection. The shorter, deeper proportions also make neglected shear and actual support conditions more important to review.

Increasing width is less powerful in this model: doubling width halves deflection, while doubling thickness reduces it to one-eighth. This is a useful concept comparison, not a reason to increase thickness without checking tool access, mass and mounting.

## Include the interfaces in the compliance path

A stiff bridge can sit on a compliant joint. As a separate teaching assumption, suppose a contact in the same series load path has stiffness 60,000 N/mm and carries the same 900 N.

Its displacement is **900 / 60,000 = 0.015 mm**. Added to the original beam displacement, the total series displacement is **0.0525 mm**. With the 16 mm bridge, it is still approximately **0.024155 mm**, above the 0.010 mm allocation.

```figure
type: stack
title: Compliances in series add
unit: mm
caption: Even with a 16 mm bridge, beam plus contact is about 0.024 mm, above the 0.010 mm allocation.
- Beam, 10 mm plate | 0.0375
- *Compliant contact at 60,000 N/mm | 0.015
```

The assumed contact stiffness is not a catalogue recommendation. The example shows why improving one member can leave the dominant movement elsewhere. Adding deflections is appropriate here only because the assumed elements carry the same load in series along the measured direction.

Real joints can have nonlinear contact behaviour, frictional slip and hysteresis. Several supports may share load in parallel. Use a model that represents the actual arrangement rather than adding every deformation number found in a simulation report.

## Consider the part while it is clamped

The workpiece can be the most flexible member. A thin wall may deflect under a clamp, be machined in that state, then return after release. Inspecting only while clamped can hide the resulting free-state error.

Compare measurements before clamping, under the defined clamping condition and after release where this is relevant. Keep the measurement method and temperature consistent. An observed change may include seating as well as elastic bending, so interpret it with the contact model.

Support near the load path can reduce bending, but an added support must not lift the part off its locating references. The location and support decisions from Chapter 2 remain connected.

Avoid replacing stiffness analysis with maximum clamp force. More force can improve contact retention while worsening the feature you are trying to hold.

## Use simulation with an explicit question

A finite-element model can help evaluate a complex fixture, but its boundary conditions are engineering assumptions. Fixing an entire base face rigidly can suppress movement that a real bolted interface permits. Bonding all contacts can prevent separation that occurs in service.

Begin with a question, such as the displacement of a controlled feature relative to its machining reference under a named load case. Check units, material data, load directions, contact assumptions and mesh sensitivity. Compare an idealised subcase with a hand calculation.

Report displacement in the functional direction, not only the largest colourful contour. A maximum elsewhere may be harmless, while a smaller movement at a locating feature consumes the tolerance allocation.

## Plan a meaningful physical check

Use a suitable controlled test arrangement developed by the responsible engineer. Measure the relevant displacement relative to the intended reference while applying known loads within the safe limits of the equipment. Include unloading to investigate recovery or slip.

The measurement system must resolve the effect of interest. A noisy displacement reading cannot establish a small compliance. Record the load application point, direction and uncertainty, and keep the test away from unqualified machine operation.

The [simulation guidance](/reados/collections/engineering-design-practice/using-simulation-in-design/) provides broader context for model verification. Here the objective is agreement between a physical load path and a functional displacement.

## Exercise: evaluate an intermediate support span

Using the original 10 mm thick bridge, calculate the ideal deflection at an 80 mm span.

The result is **0.0375 × (80/100)³ = 0.0192 mm**, still above the provisional 0.010 mm allocation. Explain why adding a compliant contact to the path would not improve that result. Its displacement adds to the total under the assumed series model.

The next chapter carries the fixture geometry into the toolpath and complete production cycle, where an apparently harmless obstruction can invalidate an otherwise sound concept.
