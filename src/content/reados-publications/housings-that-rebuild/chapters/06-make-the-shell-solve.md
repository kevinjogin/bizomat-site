---
book: housings-that-rebuild
chapterSlug: make-the-shell-solve
order: 6
title: "Make the shell solve"
description: "Predict shell failures from radius and topology, isolate them with offset tests and diagnostic cuts, and fix them without weakening the design."
draft: false
---

The shell is where housing models most often stop. Everything before it rebuilds, the outside looks finished, and then a single feature that should hollow the part returns an error that names no face and offers no reason. Designers then try random changes: smaller fillets, larger fillets, a different wall, deleting features until it works. Sometimes that succeeds, but it teaches nothing and leaves a model that may fail again at the next change.

A shell is not mysterious. It offsets every face of the body inwards by the wall thickness and removes the faces you select as open. If any face cannot be offset by that distance, or if the offset faces cannot be trimmed against each other into a closed inner skin, the shell fails. This chapter shows how to predict those failures, find them quickly when they happen, and fix them in ways that keep the design intent.

## Understand the radius rule

The most common shell failure has a simple geometric cause. When a convex curved face is offset inwards, its radius shrinks by the offset distance. A convex fillet of radius R offset inwards by wall thickness t becomes a surface of radius R − t. If R is larger than t, the inside surface is a smaller, valid fillet. If R equals t, the inside surface collapses to a sharp edge. If R is smaller than t, the offset would need a negative radius, which is impossible, and the offset surface folds over itself.

```figure
type: formula
title: Inside radius after an inward shell
formula: r(inside) = R(outside) − t
caption: This is an illustration for a convex face. A concave face grows instead: its inside radius is R + t, which is never a problem.
- R(outside) | radius of the convex outer face, mm
- t | shell wall thickness, mm
- r(inside) | radius of the offset inner face, mm; must be greater than zero
step: Top perimeter fillet: 3.0 − 2.0 = 1.0 mm, solves
step: Plan corner, G2 minimum: 5.35 − 2.0 = 3.35 mm, solves
step: Window surround fillet: 1.5 − 2.0 = −0.5 mm, fails
```

The rule applies to every convex face, not just fillets. A freeform surface whose curvature analysis reports a minimum radius of 1.8 mm somewhere will fail a 2.0 mm inward shell at that point, even if it looks gentle overall. That is why the minimum-radius readout from Chapter 3 and the surface table from Chapter 4 matter: they predict shell failures before the shell is attempted.

Concave faces behave the other way. A concave fillet offset inwards grows by the wall thickness, so an internal corner of R1 on the outside becomes R3 on the inside of a 2.0 mm shell. That is harmless for the shell, although it matters for the parts that must fit inside.

## Survey the housing before shelling

This is an illustration. Before adding the shell feature, the designer lists every convex face on the housing and its minimum radius, using the curvature analysis.

```figure
type: bars
title: Minimum outer radius of convex faces against the 2.0 mm wall
unit: mm
max: 12
caption: This is an illustration. Any face whose minimum radius is at or below the 2.0 mm wall will fail an inward shell. The window surround is the only one.
- Plan corners, G2 | 5.35
- Top perimeter fillet | 3.0
- Nose boundary patch | 2.6
- *Window surround fillet | 1.5
```

The crown, at 111 mm, is left off the chart because it is so far above the wall. The survey predicts one failure, at the window surround, and one narrow margin, at the nose patch, whose minimum radius of 2.6 mm leaves only 0.6 mm inside. Both deserve attention before the shell is added. The prediction takes ten minutes; discovering the same facts by trial and error can take a day.

## Find failures with an offset test

The radius rule explains most failures, but not all. Topology problems, such as the degenerate vertex in Chapter 4, and faces whose offsets intersect each other in awkward ways can also stop a shell. The cheapest way to find them is an **offset-surface test**.

Create an offset surface of the faces in question, inwards by the wall thickness. If the offset succeeds, the shell will usually succeed for those faces. If it fails, the system often highlights the face that caused the failure, which a shell feature rarely does. Offset one face at a time when you are hunting a specific problem; offset all faces together when you want a quick overall test.

This is an illustration. Offsetting all the housing's outer faces by 2.0 mm failed, as the survey predicted. Offsetting faces individually showed that the window surround fillet failed and every other face succeeded, including the nose patch. The offset surfaces were then deleted, having done their job.

## Isolate the failure when the cause is hidden

When neither the survey nor the offset test reveals the cause, two more methods narrow it down.

The first is the **diagnostic cut**. Temporarily cut away large regions of the model that you believe are good, then try the shell on what remains. If the shell solves on the remainder, the problem is in what you cut away; if it fails, the problem is in what remains. Repeat with smaller regions until the problem area is small enough to inspect directly. Keep diagnostic cuts in a clearly named folder and delete them when finished.

The second is **feature bisection**. Suppress half of the features between the knit solid and the shell, and try the shell. If it solves, the culprit is in the suppressed half; if not, it is in the active half. Each test halves the search. A model with 24 features between the solid and the shell needs at most **five tests**, because 2⁵ = 32 is the first power of two that covers 24.

```figure
type: steps
title: A fault-finding order for a failed shell
caption: This is an illustration. Start with the cheapest test that could explain the failure and move down only if it does not.
- Survey radii | compare every convex face's minimum radius with the wall
- Offset test | offset faces inwards by the wall, one at a time if needed
- *Feature bisection | suppress half the features between solid and shell; repeat
- Diagnostic cut | cut away known-good regions and shell the rest
- Inspect | look at the isolated faces for collapsed edges, slivers or tiny faces
```

A useful habit while working on features before the shell is to **keep the shell suppressed**. Most edits are faster without it, and a failing shell cannot block other work. Unsuppress it after each significant change to test, then suppress it again.

## Fix the window surround

This is an illustration. The R1.5 outer fillet around the window opening cannot be shelled at a 2.0 mm wall. Four fixes were considered.

```figure
type: compare
title: Four ways to fix the window surround
cols: Effect on the shell | Effect on the design
caption: This is an illustration. Reordering kept the designer's R1.5 edge on the outside, which was the design intent; it is the fix the team chose.
- Reduce the wall to 1.4 mm | Solves: 1.5 − 1.4 = 0.1 mm inside | Rejected: weakens the whole part for one edge
- Increase the fillet to R2.5 | Solves: 0.5 mm inside | Changes the look; the designer wanted a crisp edge
- Thicken locally with multi-thickness | Does not help: a thicker wall makes the inside radius worse | None
- *Cut the window and fillet after the shell | Solves: the fillet is applied to the shelled wall | Keeps R1.5 outside; inside edge gets its own small radius
```

The chosen fix changes the feature order, not the geometry. The window cut and its outer fillet move to after the shell. The shell now hollows a body with no window, which succeeds. The window is then cut through the 2.0 mm wall, and the R1.5 fillet is applied only to the outer edge of the opening. The inner edge gets a separate R0.5 fillet to avoid a sharp internal corner. The outside looks exactly as the designer intended.

This illustrates a general principle. **The shell needs every convex outer radius to exceed the wall only for the faces that exist when the shell runs.** Features added afterwards are applied to the shelled body and follow their own rules. Moving small, sharp details after the shell is often the cleanest fix.

There is a cost. Features after the shell must be added to both the outer and inner faces, or just one, by deliberate choice, and the model's order becomes slightly less intuitive. Record the reason in a note on the feature so the next designer does not move it back.

## Use multi-thickness with care

Most shell features allow different thicknesses on selected faces, often called multi-thickness. It is useful where one region genuinely needs a different wall, such as a thicker floor for stiffness or a thinner area for a living hinge.

This is an illustration. The housing's sensor nose takes knocks in use, and the design calls for a 2.5 mm wall on the nose front face only. A multi-thickness shell sets 2.0 mm everywhere and 2.5 mm on that face. The nose patch alongside, with its 2.6 mm minimum radius, now sits next to a 2.5 mm wall, and the designer checks that the transition between the two thicknesses does not create an offset that folds. It does not, because the nose patch keeps the 2.0 mm wall.

Multi-thickness can also make a stubborn shell solve, because it changes which offsets meet and where. Treat that as a diagnostic clue rather than a fix. If a shell solves only with an unexplained local thickness change, find out why before accepting it. Remember too that sudden changes in wall thickness affect moulding: thick regions cool slowly and can show sink marks, and abrupt transitions concentrate stress. Discuss any local thickness change with the moulder and make transitions gradual.

## Consider thickening the skin instead

An alternative to shelling a solid is to thicken the knitted outer skin inwards before it becomes a solid. Thickening offsets the surfaces in much the same way as a shell, and it fails for the same geometric reasons. It is not a cure for radius problems.

It can help with topology problems, because the thicken operation sometimes handles awkward trimmed surfaces differently from a shell. It also gives a clear separation between outer skin and wall, which some teams prefer when the outer skin will be restyled often. The cost is a model that is harder to edit with ordinary solid features later. Choose one method for a given part and stay with it.

## Watch variable fillets and tiny faces

Two other features cause shell failures more often than their size suggests.

Variable-radius fillets change radius along their length. If the smallest radius anywhere along the fillet is below the wall thickness, the shell fails there, even if the radius is generous elsewhere. Check the minimum, not the nominal value.

Tiny faces, such as slivers left by a trim that only just missed an edge or short faces created where two fillets meet, can make offsets fail or produce invalid inner geometry. The geometry check reports short edges and small faces. Remove them at the source, usually by overbuilding a surface or changing the fillet order, rather than by adding more features on top.

## Shell once, before the split

The housing becomes two parts, but it is shelled as one body. The open face selected in the shell feature is the underside, so the shell hollows the whole master body from below, leaving a continuous 2.0 mm wall around the sides and under the crown. The split into cover and base comes afterwards, in Chapter 8.

Shelling once has two advantages. The wall is identical on both parts by construction, so there is no risk that the cover is shelled at 2.0 mm and the base at a value someone forgot to update. And the inner surfaces of both parts meet exactly at the parting plane, which the lip and groove need. Shelling the two parts separately after the split would require two shell features with matching settings and would create two chances for them to drift apart.

The open face matters too. Leaving the underside open means the base, after splitting, has no floor. In this case that is deliberate: the base receives a separate floor feature after the split, thicker than the walls and carrying the battery bay. If the base needed the same 2.0 mm floor as the walls, the shell could instead leave the parting plane open, with the split arranged to suit. Decide this before adding the shell, because changing the open face later moves every inner surface.

## Check thickness after the shell

A shell that solves is not automatically a good wall. Where the inner surfaces meet, at corners, under the crown and around the nose, the actual material thickness can differ from the nominal value. A thickness analysis, available in most systems, colours the part by local wall thickness and reports the thinnest and thickest regions.

This is an illustration. The housing's thickness analysis reported 2.0 mm across nearly all the walls, as expected. Two regions stood out. At the junction between the 2.5 mm nose front face and the neighbouring 2.0 mm walls, the analysis showed a short band up to 2.7 mm, where the two offsets overlapped. At the top perimeter, where the R3 outer fillet meets its R1 inner counterpart, the measured thickness normal to the surface stayed at 2.0 mm.

The 2.7 mm band is about 35% thicker than the nominal wall. In a moulding, such a local thick spot can cool more slowly than its surroundings and show a sink mark on the outer surface. The designer recorded it as an open question for the moulder, with a proposed fix of a gradual taper from 2.5 mm to 2.0 mm over 6 mm instead of a step.

Record the thickness analysis result with the model, including the thinnest and thickest values and their locations. When the wall parameter changes, rerun it and compare.

## Exercise: predict the effect of a thicker wall

The moulder recommends increasing the nominal wall from 2.0 mm to 2.4 mm for better filling in a tougher resin. Using the survey of convex faces, which faces will now fail or become marginal in an inward shell, and what would you do about each?

**Worked answer.** Recalculate each inside radius as R − 2.4:

- **Plan corners, G2:** 5.35 − 2.4 = **2.95 mm**. Solves.
- **Top perimeter fillet:** 3.0 − 2.4 = **0.6 mm**. Solves, but the margin is thin. Consider R3.5 if the design allows, giving 1.1 mm inside.
- **Nose boundary patch:** 2.6 − 2.4 = **0.2 mm**. Technically solves, but the inside surface would be extremely tight, and small numerical noise could make it fail. Rebuild the patch for a minimum radius of at least 3.4 mm, which gives 1.0 mm inside, and recheck its zebra stripes.
- **Window surround:** already moved after the shell, so unaffected.

Run the offset test at 2.4 mm before changing the shell feature, so that any failure appears on one face at a time. The 2.4 mm wall also changes the lip width to 1.2 mm through its equation, as Chapter 1 showed, and Chapter 8's lip and groove must be checked again.
