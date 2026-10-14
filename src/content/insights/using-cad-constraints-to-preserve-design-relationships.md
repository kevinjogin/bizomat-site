---
title: "Using CAD constraints to preserve design relationships"
description: "Use geometric and dimensional constraints to make CAD changes predictable, with clear parameter names, purposeful relationships and checks across a useful range."
publishDate: 2026-10-04
category: "Technology"
tags:
  - design
  - automation
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A drawing can be accurate in its current state and still be difficult to change safely. A hole might be centred by careful measurement, yet move away from the centre when the surrounding plate becomes wider. The original geometry records one arrangement without necessarily recording the relationships that should survive a revision.

In *AutoCAD 2011 For Dummies*, David Byrnes introduces parametric drawing as a way to preserve those relationships. The lasting lesson is to decide what should remain true when a design changes, then express that intention through a small, understandable set of rules. Automation is useful when its behaviour is explicit enough to inspect and challenge.

## Separate relationships from measurements

**Parametric drawing** uses values and relationships to control geometry. A **constraint** is a rule that restricts an object's shape, size, position or relationship to other objects. Constraints allow an edit to propagate through connected geometry instead of relying on someone to remember every related change.

A **geometric constraint** defines a relationship such as parallel, perpendicular, concentric or coincident. Parallel lines retain their common direction; concentric circles retain a shared centre. These relationships do not, by themselves, specify the length of a line or the diameter of a circle.

A **dimensional constraint** controls a measurable quantity such as length, angle, distance or radius. Its value may be a number or an expression based on another parameter. Combining geometric and dimensional rules can describe both the shape of an arrangement and the values that determine its size.

The distinction matters because a plausible numerical result can hide an incomplete relationship. Two lines that currently happen to have equal lengths are not necessarily required to remain equal. If equality is the intention, encode that relationship instead of entering the same number independently and hoping future edits preserve it.

## Distinguish a driving value from a reported value

An ordinary associative dimension reports a measurement from geometry and can update when that geometry changes. A driving dimensional constraint works in the other direction: changing its value changes the geometry, within the other rules that apply.

This difference is easy to miss when both appear as numbers beside a line. Before editing a value, establish whether it controls the design or simply describes it. A displayed measurement is not automatically an input, and a design input is not automatically a suitable annotation for a printed sheet.

A **reference parameter** reports a measurement without driving the associated geometry. It can help you observe a result that follows from other inputs. Autodesk explains this distinction, together with the display and plotting behaviour of constraint forms, in its [dimensional constraint documentation](https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-F7ED2587-8F25-4770-BD13-C7C95456E707.htm).

Keep the roles visible in your own working notes. A short parameter table can identify independent inputs, calculated values and measurements used only for checking. This prevents a later editor from trying to change a result that is already determined by other decisions.

## Write the intended behaviour before adding rules

Start with a sentence about the design rather than a list of commands. For example, a rectangular outline must remain rectangular, its width may change, and a central opening must remain centred. That statement identifies several relationships that are otherwise easy to overlook while drawing.

Then separate fixed decisions from adjustable ones. The opening diameter might be fixed for the current component family, while the outline width is an allowed input. Its vertical position might follow half the height. Each choice should have a reason connected to the design's purpose.

Consider the reference used for movement. If a component must remain positioned from one mounting corner, that corner is meaningful. If it is intended to expand equally around a centre, a central reference is more appropriate. Both can produce the same initial shape while behaving differently during a revision.

Finally, identify what the drawing does not decide. A rule keeping two holes symmetrical does not establish adequate edge distance, strength or manufacturing suitability. Constraints preserve stated relationships; they do not supply the engineering judgement that selected those relationships.

## Establish shape before controlling size

Byrnes demonstrates how geometric relationships and dimensional values work together. A useful practical sequence is to establish the intended shape first, then introduce the dimensions that control its size. This makes it easier to understand why an object moves when a new value is applied.

For a rectangle made from separate lines, the relationships may include connected corners, opposite sides that remain parallel and adjacent sides that remain perpendicular. The exact rules required depend on the object types and relationships already present. A connected polyline and four unrelated lines do not begin with the same structure.

Add rules incrementally and inspect the result after each meaningful step. If a line jumps to an unexpected position, stop while the cause is still clear. Applying a large collection of rules at once can make the final arrangement harder to explain, even when the software accepts it.

Once the shape behaves correctly, add its independent size inputs. Avoid specifying every measurable distance. Some distances are consequences of the shape and existing values. Recording them as reference measurements may be useful; making them additional drivers can introduce redundant or conflicting requirements.

## Leave only the movement that serves the task

An **underconstrained** arrangement still has freedom to move or change in ways not restricted by its current rules. That can be useful during exploration. It can also explain why geometry drifts when you thought you were changing only one feature.

A **fully constrained** arrangement has all the relevant geometric freedom controlled, including its location when that location forms part of the definition. Reaching that state is useful for a stable reusable detail, but it should follow from a clear purpose rather than become a target pursued without understanding.

An arrangement can have a well-defined shape and size while remaining free to move as a whole. Decide whether that freedom is intentional. Locking everything indiscriminately can prevent useful changes; leaving an important reference free can make changes unpredictable from the user's perspective.

Conflicting or excessive rules need diagnosis. If the software refuses a new constraint, inspect the relationships already applied and the assumptions behind the proposed one. Deleting whichever rule is easiest to select may remove the relationship that matters most. Understand the conflict before deciding which requirement should govern.

## Give parameters names that explain their purpose

Automatic names are convenient while experimenting, but they become difficult to interpret as a drawing grows. Rename important parameters so that their purpose is recognisable. Width, height and opening diameter communicate more than a sequence of unrelated default identifiers.

Use names consistently and distinguish similar quantities. Overall width and clear opening width are different design concepts, even if they happen to have the same value in an early sketch. A name should identify the quantity, not merely describe where its number appears on screen.

Keep expressions short enough to inspect. If an opening must remain centred, expressing its position as half the overall width makes the relationship visible. If several expressions depend on each other, document their order and avoid circular definitions in which each value requires the other to be known first.

Record units and the intended range beside the parameter list. A formula can be mathematically valid while producing an unusable arrangement outside the design's scope. A note that states the reviewed range helps another person distinguish a tested variant from an unexamined possibility.

## Test a centred opening through several changes

This is an illustration. A founder is exploring a rectangular identification plate with a circular opening. The plate is drawn in millimetres, its lower-left corner is the fixed reference, and its initial width and height are 200 mm and 120 mm. The opening diameter is 20 mm.

The outline must remain rectangular. The opening centre is defined at half the plate width horizontally and half its height vertically. Initially, its coordinates relative to the reference corner are therefore 100 mm and 60 mm. The opening radius is 10 mm.

The founder changes the width to 240 mm while keeping the height at 120 mm. The centre should move to 120 mm horizontally and remain at 60 mm vertically. Its diameter should stay at 20 mm. This checks a specific intended behaviour rather than merely confirming that something changed.

Next, the founder changes the height to 160 mm. The opening centre should now be at 120 mm and 80 mm. The distance from the circular opening's edge to either vertical side is 120 minus 10, or 110 mm. The corresponding distance to the top and bottom is 80 minus 10, or 70 mm.

| State | Plate width | Plate height | Opening centre | Opening diameter |
| --- | --- | --- | --- | --- |
| Initial | 200 mm | 120 mm | 100 mm, 60 mm | 20 mm |
| Wider | 240 mm | 120 mm | 120 mm, 60 mm | 20 mm |
| Wider and taller | 240 mm | 160 mm | 120 mm, 80 mm | 20 mm |

These calculations check the drawing relationships, not the suitability of the plate. Material, attachment method, tolerances and actual use remain separate decisions. The example demonstrates how a few explicit inputs can produce predictable geometry without claiming that the resulting product has been validated.

## Test limits as well as normal values

A successful edit near the starting size is only one piece of evidence. Test the smallest and largest values you intend to use, together with at least one intermediate value. Watch for overlapping geometry, reversed arrangements, disappearing features or relationships that stop matching the intended interpretation.

In the plate example, making the width smaller than the opening diameter would create a geometrically possible set of values with an unsuitable physical result. Unless that limit is separately controlled, the drawing's rules may not prevent the problem. Documenting an operating range is therefore part of using the model responsibly.

Change one independent input at a time before trying combined changes. This makes the source of an unexpected response easier to identify. After that, test combinations that are likely to occur together, because interactions can expose issues that isolated edits do not reveal.

Return to the initial values and inspect the result. Reversibility is a useful practical check: the arrangement should return to the expected state without accumulated manual repairs. Save the tested version with its assumptions so later edits can be compared with a known working example.

## Use automatic constraint tools with a clear purpose

The source describes tools that infer or apply geometric constraints automatically. These can reduce repetitive work, but the inferred relationship is still something to inspect. Geometry drawn close to an intended relationship may receive a rule you did not mean to preserve.

Learn the behaviour of a small manually constrained arrangement before applying automation to a complex drawing. That gives you a reference for interpreting constraint symbols, unexpected movements and edit restrictions. It also makes it easier to recognise an automatic result that encodes the wrong intention.

When inheriting a drawing, reveal and inspect the constraints on the objects you intend to edit. A rule can remain active even when its marker is hidden. Treat unexpected resistance to movement as information about the drawing's structure, rather than an immediate reason to remove every constraint.

If you deliberately relax or remove a relationship, record the changed intention and inspect the resulting geometry. A drawing that still looks correct after a rule is removed may behave differently on the next edit. Visual similarity at one moment is not proof that the original behaviour has been preserved.

## Keep model controls separate from issued information

The source distinguishes working constraint displays from constraint forms suitable for plotting. Do not assume that the values visible while designing will appear on the issued sheet, or that every visible expression will communicate clearly to a recipient.

Review the final sheet as a separate communication product. It needs dimensions, notes and a clear status appropriate to its purpose. Internal parameter names may help the drafter while confusing someone who needs a conventional measurement and an unambiguous reference.

If a driving value is also presented as an annotation, check its displayed units, precision and meaning. The reader should not have to reconstruct a parameter formula to understand the intended size. The distinction between model measurements and sheet communication is explored in [Keeping CAD dimensions connected to the design](/insights/keeping-cad-dimensions-connected-to-the-design/).

Confirm the behaviour in the software and version used by the recipient. This article draws on an older edition and focuses on durable relationships; it does not establish feature availability or identical editing behaviour across every CAD product. A trial exchange of a small constrained example can reveal practical limitations early.

## Start with a repeatable detail

For a small Australian business, a useful first application is a detail that changes regularly in a limited number of ways. It might be a layout with a variable width, a centred feature and a fixed opening size. The benefit comes from making those repeated changes easier to inspect and less dependent on memory.

Keep the first parameter set small. Ask another person to change an allowed value using only the names and notes supplied. If they need the original author's verbal explanation to avoid breaking the arrangement, the reusable definition needs clearer documentation or simpler rules.

Allocate time to maintain the definition when its underlying requirements change. A parameter system is a compact record of design decisions, so it needs an owner and a review process. Reusing an outdated relationship efficiently does not make that relationship appropriate for the next product.

## Questions to ask

- Which relationships must remain true when the design changes?
- Which values are independent inputs, calculated results or reference measurements?
- Is the remaining freedom to move or resize intentional?
- Have the expected range and important combinations been tested?
- Can another person understand the parameter names and assumptions?
- Does the issued sheet communicate the result clearly?

## Bringing it together

Constraints are most useful when they express a clear design intention in a small set of understandable rules. Establish relationships, name the controlling values and test how the geometry behaves through realistic changes.

Keep the boundary of that evidence clear. A predictable drawing supports design work, but its rules still need appropriate engineering decisions, suitable documentation and review when the intended use changes.

---
*Source: David Byrnes, AutoCAD 2011 For Dummies (2010), primarily chapter 19; Autodesk documentation linked above. Figures are original illustrations. Constraint behaviour does not establish engineering suitability or design approval; check features in the software version used.*
