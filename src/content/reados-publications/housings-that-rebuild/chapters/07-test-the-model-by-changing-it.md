---
book: housings-that-rebuild
chapterSlug: test-the-model-by-changing-it
order: 7
title: "Test the model by changing it"
description: "Find fragile references before a colleague does: flex-test a housing with planned changes, resolve ambiguous edges and choose references that survive topology changes."
draft: false
---

A model that rebuilds today has passed only one test: today's values. The real test comes when a value changes and every feature must find its references again. Some features will find them. Others will find the wrong ones, or none at all. The cheapest time to discover which is before anyone else depends on the model.

This chapter introduces the flex test, a short, planned set of changes that exercises the model the way future requests will. It then deals with the two main causes of failure that such tests reveal: references to generated geometry that changes its topology, and ambiguous geometry where the system has to guess which edge or side you meant.

## Plan a flex test

A flex test is a list of changes that the model should survive, applied one at a time, with the result of each recorded. The changes come from the brief and from experience of what usually changes on similar products.

This is an illustration. The housing's flex test has six changes, each reversed after it is checked:

1. Overall length from 160 mm to 170 mm.
2. Crown rise from 6 mm to 8 mm.
3. Wall from 2.0 mm to 2.4 mm.
4. Draft from 1.0° to 1.5°.
5. Parting height from 14 mm to 16 mm.
6. Plan-corner setback from 10 mm to 7 mm.

For each change, record three things: whether the model rebuilds without errors, whether it rebuilds without warnings, and whether the brief checks from Chapter 1 still pass. A model can rebuild cleanly and still fail the brief, which is the silent failure that matters most.

```figure
type: compare
title: First flex test of the housing
cols: Rebuild | Brief checks | Cause found
caption: This is an illustration. Three changes failed and one passed the rebuild but broke the brief. Each failure pointed at a specific reference.
- Length 160 → 170 mm | Clean | Pass | None
- Crown rise 6 → 8 mm | Error on grip groove | Not reached | Sweep path used a split-line edge
- Wall 2.0 → 2.4 mm | Clean | Pass, nose patch marginal | Known from Chapter 6
- Draft 1.0° → 1.5° | Error on window pocket | Not reached | Pocket sketch referenced a drafted face
- *Parting 14 → 16 mm | Clean | Fail: reveal moved to the cover | Reveal cut before the split
- Setback 10 → 7 mm | Error on top fillet | Not reached | Fillet selected edges by position
```

The first flex test found four problems in an hour. Any one of them, discovered by a colleague under time pressure, could have cost a day.

## Understand why references break

Features refer to other geometry: a sketch sits on a face, a fillet runs along edges, a cut is dimensioned from a vertex. Planes, sketches and named parameters are stable references. They exist because someone created them, and they keep their identity regardless of what other features do.

Faces, edges and vertices created by features are different. They exist because of how other features intersect. When an upstream change alters the topology, by splitting a face into two, merging two edges into one, or removing a face entirely, the system must decide which new face or edge corresponds to the old one. Most systems keep internal names for this purpose and do a good job, but no system can guess correctly in every case. When it guesses wrong, a downstream feature attaches to the wrong geometry or reports a missing reference.

```figure
type: layers
title: References from most to least stable
caption: Reference the most stable item that can carry the intent. Each step down adds a dependency on how upstream features happen to intersect.
- Named parameters | values that never move by themselves
- Reference planes and axes | created deliberately, offset from the skeleton
- Skeleton sketches | layout curves the designer controls
- Faces of master surfaces | stable while the patch layout is unchanged
- *Edges and vertices of generated features | can split, merge or vanish when values change
```

The practical rule is the one from Chapter 1: reference the highest layer that can carry the intent. A fillet must use edges, but the edges should belong to features that are themselves well referenced, and the selection method should be as robust as the system allows. Selecting edges by a feature, a face loop or a tangent chain usually survives better than picking individual edges by clicking on them.

## Fix the window pocket reference

This is an illustration. The window pocket's sketch from Chapter 5 sat on a plane, but one of its dimensions located the pocket from a vertex on the drafted side wall. When the draft changed from 1.0° to 1.5°, that vertex disappeared. The side wall was regenerated as a new face with new edges, and the system could not find a match.

The fix was to re-dimension the pocket from the long centre plane and the nose reference plane, the same references the window itself uses. After the fix, the draft change rebuilt cleanly, and the pocket stayed concentric with the window to within the display precision of 0.001 mm.

## Resolve ambiguous edges from split lines

Some failures come from geometry that is not wrong but ambiguous. The classic housing example is a sweep or cut that follows an edge created by a split line.

A split line divides a face into two faces along a projected curve, without changing the shape. It is a useful tool for marking regions, such as an area for a label or a boundary for a draft change. But the edge it creates is made of segments wherever the split curve crosses other edges, and a feature that follows that edge as a path may alternate between the two faces on either side.

This is an illustration. The housing has a grip groove along each side: a 2 mm radius channel, 60 mm long, running 10 mm below the top perimeter fillet. The first version built the groove as a swept cut along the edge of a split line on the side wall. It worked at the original values. When the crown rose to 8 mm, the side wall's faces regenerated, the split-line edge broke into three segments, and the sweep alternated sides between them, producing a ragged groove and then an error.

Two fixes were tried:

```figure
type: compare
title: Two paths for the grip groove sweep
cols: Path | Result after the crown change
caption: This is an illustration. Following a projected curve from a sketch gave one clean edge; overcutting at the ends removed the last dependency on the side wall's boundary.
- Split-line edge on the side wall | 3 segments after regeneration | Sweep alternated sides, then failed
- Projected curve from a side sketch | 1 continuous curve | Clean groove, but ends trimmed short by the fillet
- *Projected curve, extended 3 mm past each end | 1 curve, ends beyond the face | Clean groove at every flex value
```

The projected curve, created by projecting a sketch on the side reference plane onto the side wall surface, gave a single continuous path. Its shape came from a sketch the designer controlled, not from how the split line happened to intersect other edges. Extending the curve 3 mm past each end of the groove, so the cut tool ran off the wall, removed the last dependency. The groove's visible length is now set by a pair of planes, not by where the path happens to stop.

The two habits in this fix apply widely. **Build paths and boundaries from sketches and projected curves rather than from generated edges**, and **overcut where you can afford to**, so that a tool always passes cleanly through the region it shapes rather than stopping exactly at an edge.

## Fix fillets that select by position

This is an illustration. The top perimeter fillet from Chapter 3 had been created by clicking individual edges around the top of the housing. When the corner setback changed from 10 mm to 7 mm, the G2 corner faces changed shape and the edges around them were renumbered internally. The fillet lost two of its edges and reported an error.

The fix was to reselect the fillet's edges as a tangent chain starting from one edge on the long side. Because the chain is defined as "all edges tangent to this one", it picks up every edge around the perimeter regardless of how many there are or how they are numbered. The setback change then rebuilt cleanly. Where a system allows fillets to be defined by a face rather than by edges, such as "fillet every edge of this face", that is often more robust again.

## Move features to the right side of the split

The reveal along the parting line, introduced in Chapter 3, had been cut as a chamfer on the master body before the split. When the parting height rose from 14 mm to 16 mm, the chamfer stayed at its original height, 14 mm, because it was dimensioned from the underside. The split moved to 16 mm, and the reveal ended up on the cover instead of the base. The rebuild was clean, which made this the most dangerous result in the test.

The fix was to move the reveal after the split, as a feature of the base alone, dimensioned from the parting plane. The lesson is that features belonging to one part should be added to that part, after the split, unless there is a clear reason to add them to the master.

## Read rebuild messages carefully

Rebuild errors and warnings carry information, even when their wording is terse. A few distinctions help.

- An **error** stops a feature from building. Downstream features that depend on it may also fail. Fix the first error in the tree before the others, because later errors are often consequences of it.
- A **warning** means the feature built but something is questionable, such as a dangling dimension or a reference that was resolved by a guess. Warnings deserve attention, because they are often the early sign of a future error.
- A **dangling reference** is a dimension or relation whose target has disappeared. It often survives as a warning and silently stops controlling the geometry. A sketch with a dangling dimension may look correct and yet be unconstrained.

Rolling back the tree to just before a failing feature and looking at the geometry it is trying to reference often explains the failure in seconds. Most systems let you drag a rollback marker or roll back to a selected feature.

## Treat mirrors and patterns as references too

Symmetric housings invite mirroring: build one half, mirror it, and the model is complete. Mirroring is efficient, but it creates its own dependencies. A mirrored feature depends on the mirror plane and on every face and edge of the features it copies. If one of those changes topology, the mirror can fail or, worse, produce a mirrored copy that no longer matches the original exactly.

Two habits reduce the risk. Mirror about a skeleton plane, here the long centre plane, never about a generated face, even one that happens to lie on the centre line. And prefer mirroring whole bodies or groups of features at a clear point in the tree to mirroring individual features scattered through it. The housing mirrors its grip groove and its bosses about the centre plane, each as a single mirror feature immediately after the features it copies, so the dependency is short and visible.

Patterns behave in a similar way. A pattern of ribs spaced along the inside of the base depends on the seed rib and on whatever defines its direction and spacing. Define the direction by a reference axis or sketch line and the spacing by a parameter, and the pattern will survive changes to the walls around it.

## Automate the flex test where the system allows

Running six changes by hand, checking the brief each time and undoing the change is tedious enough that it gets skipped. Most systems offer a way to automate it. A design table, configuration set or parameter table can hold each flex case as a row: the base values in one row, the longer housing in the next, the taller crown in the next, and so on. Switching between rows applies each change in turn.

This is an illustration. The housing's flex table has seven rows: the baseline and the six changes. Each row also records the expected solid volume from a hand estimate and the expected window position, so the check is a comparison of two numbers rather than a judgement. Cycling through all seven rows and reading the results takes about five minutes.

Automation does not replace looking. Some failures, such as a groove that alternates sides or a fillet that changes shape, are visible only on screen. Rotate the model at each row, and run the zebra check on any row that changes a surface.

## Repeat the flex test after the fixes

The point of the flex test is not to pass once but to stay passed. After the fixes, the six changes were applied again.

```figure
type: checklist
title: Second flex test after the fixes
caption: This is an illustration. Every change now rebuilds cleanly and passes the brief. The nose patch remains a recorded margin for the 2.4 mm wall.
- x Length 160 → 170 mm | clean, brief passes
- x Crown rise 6 → 8 mm | clean, groove follows projected curve
- *x Wall 2.0 → 2.4 mm | clean; nose patch margin recorded as an open check
- x Draft 1.0° → 1.5° | clean, pocket re-referenced to planes
- x Parting 14 → 16 mm | clean, reveal now on the base
- x Setback 10 → 7 mm | clean, fillet uses a tangent chain
```

Keep the flex test with the model, as a short table in the notes or as a set of configurations that apply each change. Run it again after any substantial edit and before every release. The edited READOS chapter on [editing CAD geometry without losing design intent](/reados/collections/cad-modelling-and-design-intent/editing-cad-geometry-without-losing-design-intent/) covers the wider habits that keep edits safe.

## Exercise: design a flex test for a new feature

The electronics team adds four screw bosses inside the base, positioned 8 mm in from each wall at the rear and 8 mm in from each tapered nose wall at the front. Which flex-test changes would you add or watch for these bosses, and how should their sketch be referenced?

**Worked answer.** The bosses should be positioned from **reference planes offset from the skeleton**, such as offsets from the long centre plane and from the rear and nose reference planes, not from the inner faces of the shelled walls. The inner faces are generated by the shell and move when the wall or draft changes.

Add or watch these changes:

- **Wall 2.0 → 2.4 mm:** an 8 mm offset from the outer wall leaves 6.0 mm to the inner face at a 2.0 mm wall and 5.6 mm at 2.4 mm. That is fine if the board's mounting holes are fixed relative to the outside of the product. If the bosses are placed from the inner face instead, they move inwards with the wall, which may be wrong for the board they hold.
- **Draft 1.0° → 1.5°:** the inner walls lean further in. Check the clearance between each boss and the wall at the boss's full height, not just at its base.
- **Length 160 → 170 mm:** the rear bosses should stay 8 mm from the rear wall and the front bosses 8 mm from the nose, so the spacing between them should grow by 10 mm. If it does not, a boss is referenced to the wrong plane.

Add the bosses to the base after the split, as Chapter 8 describes, and record the boss checks in the flex-test table.
