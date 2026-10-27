---
book: housings-that-rebuild
chapterSlug: decide-what-the-model-must-keep
order: 1
title: "Decide what the model must keep"
description: "Turn a housing brief into controlling sketches, planes and parameters so later changes move the right faces and nothing else."
draft: false
---

A part model records two things at once. One is the shape on the screen today. The other is the set of relationships that decide how that shape responds when an input changes. Design intent is the second record. A model with weak intent can look perfect and still be useless, because the first change request breaks it or, worse, moves faces nobody meant to move.

Housings expose this quickly. Their shapes are curved, their walls are thin, and several people want to change them for different reasons. The industrial designer adjusts the crown. The electronics engineer moves the display. The moulder asks for more draft. If each change needs a rebuild from scratch, the model has failed at its main job.

## Write the brief as things that must stay true

Start with a short list of statements that should survive every change. Write them in words before opening the CAD system. A statement is useful when it names a relationship, not just a number. "The wall is 2.0 mm" is a number. "Every wall is the same nominal thickness, set by one parameter" is a relationship that the model can enforce.

This is an illustration. For the moisture-meter housing, the brief produces these statements:

1. The overall envelope is 160 mm long, 72 mm wide and 34 mm tall, measured from the underside datum.
2. The housing is symmetric about the long centre plane.
3. Every wall has one nominal thickness, currently 2.0 mm.
4. The top crown rises 6 mm across the width and is a single smooth surface.
5. The display window is 50 mm by 30 mm, centred on the long axis, its front edge 40 mm from the nose.
6. The parting line sits 14 mm above the underside on all sides.
7. All side walls carry the same draft, currently 1.0°, measured from the parting plane.
8. Plan-view corners are R10.

Eight statements are enough. A longer list usually mixes intent with detail. Fillet sizes on internal ribs, boss positions and snap details matter, but they follow from these statements rather than controlling them.

## Separate controlling geometry from features

The most robust housings are built on a small skeleton of controlling geometry that the features reference. The skeleton contains reference planes, layout sketches and named parameters. Features such as extrudes, surfaces, shells and fillets then hang off the skeleton, not off each other's edges.

```figure
type: layers
title: The housing model as a stack of dependencies
caption: This is an illustration. Each layer references only the layers above it, so a change to the skeleton flows down without breaking the order.
- Parameters | wall 2.0, draft 1.0°, crown rise 6, parting height 14
- Reference planes | underside datum, long centre plane, parting plane, window plane
- Layout sketches | plan outline, side profile, crown section, window rectangle
- *Master surfaces and body | crown, side walls, nose patch, knit and thicken
- Detail features | window cut, fillets, shell, lip, bosses
```

The rule that follows is simple to state and harder to keep: **a feature should reference the highest layer that can define it.** The window cut should reference the window sketch, which references the centre plane and the nose, not an edge of the crown surface. A fillet must reference edges, because that is how fillets work, but those edges should come from features that are themselves well referenced.

When a feature references an edge or face created by another feature, it inherits that feature's fragility. If the earlier feature changes its topology, the reference can disappear or jump to the wrong edge. Chapter 7 returns to this problem in detail. For now, the habit is to ask, before each selection, whether a plane or sketch could carry the same information.

## Name the parameters and use them

Most parametric systems offer global variables, equations or a parameter table. Use them for the values in the brief that more than one feature needs. A value used only once can stay as a dimension in its sketch.

This is an illustration. The housing starts with six named parameters:

```figure
type: compare
title: Named parameters for the moisture-meter housing
cols: Value | Used by
caption: This is an illustration. Each parameter drives every feature that needs it, so one edit updates them together.
- Wall | 2.0 mm | Shell, thicken, lip, boss walls
- Draft | 1.0° | Side surfaces, lip, ribs
- Crown rise | 6 mm | Crown section sketch
- Parting height | 14 mm | Parting plane offset
- Plan corner | R10 | Plan outline sketch
- *Lip width | wall ÷ 2 = 1.0 mm | Lip and groove on both parts
```

The lip width is written as an equation, not a number. If the wall changes to 2.4 mm, the lip becomes 1.2 mm without anyone remembering to change it. That single equation is design intent made executable.

Avoid two common traps. The first is a parameter that is set but not used, because someone typed the number into a sketch instead of linking it. The model then looks controlled but is not. The second is a parameter that drives a value nobody understands, such as a construction offset named `D7`. Give every parameter a name that a colleague can read in the tree and understand without opening the sketch.

## Bring in references from outside

Industrial design often arrives as two-dimensional views, a DXF from a styling package, a scanned sketch or a photograph of a foam model. Treat each as a reference, not as geometry to build on directly.

A practical sequence works in most systems:

1. Create the three principal reference planes and decide which is the underside datum.
2. Import each view into its own sketch on the matching plane: plan, side and front.
3. Scale and position each imported sketch with one known dimension, such as the 160 mm overall length, and one known point, such as the nose tip on the centre plane.
4. Fix the imported sketches and set them to display as construction or reference geometry.
5. Build new, clean layout sketches over them, using the imported lines only as a guide.

Where no clean geometry exists, place the image itself on a sketch plane. Most systems allow a picture in a sketch for this purpose. Scale it in the same way, from one known length, and accept that its accuracy is only as good as the photograph. Perspective, lens distortion and a model that was never square to the camera all creep in. A photographed 160 mm housing that measures 158 mm along one edge and 161 mm along the other tells you the image is not a true orthographic view.

The reason for rebuilding rather than tracing directly is curve quality. An imported outline is often made of dozens of short arcs and lines, joined with tiny gaps. Surfaces built on that outline inherit every join. Chapter 2 shows how to replace such chains with a few well-controlled splines.

The edited READOS chapter on [rebuilding CAD geometry from scans and PDFs](/reados/collections/cad-modelling-and-design-intent/rebuilding-cad-geometry-from-scans-and-pdfs/) covers the wider problem of imported references and their accuracy.

## Choose a solid-first or surface-first strategy

There are two broad ways to build a housing. The solid-first approach extrudes a block, adds draft, cuts the crown, fillets the edges and shells the result. The surface-first approach builds the outer skin from separate surfaces, joins them and then converts the closed skin into a solid.

Neither is always right. The difference is in how faithfully each method follows the design intent where curved faces meet.

```figure
type: compare
title: Solid-first and surface-first approaches for the housing
cols: Solid-first | Surface-first
caption: This is an illustration. Most real housings use both: surfaces for the main form, solid features for local detail.
- Where edges come from | Intersections of features | Curves you drew
- Control of a curved edge | Indirect, by trimming | Direct, by its source curve
- Speed for prismatic shapes | Fast | Slower
- Behaviour when the crown changes | Edges move wherever the intersection lands | Edges stay on their curves
- *Typical use | Ribs, bosses, cuts, local detail | Crown, sides, nose, blends
```

A solid-first housing often produces an edge that is merely wherever two features happen to intersect. Suppose the crown is cut from the top of an extruded block. The edge between crown and side wall is then the intersection of a cylindrical cut and a drafted wall. It is accurate to those features but not to any curve the designer drew. If the designer specified a particular side-view edge line, the solid approach can only approximate it by iteration.

The surface approach builds that edge from the designer's curve. The side wall is trimmed to the curve, and the crown is built to meet it. The edge is exactly where it was specified, and it stays there when other values change.

This book uses a hybrid strategy. The main form, meaning crown, sides and nose, is built from surfaces and converted to a solid. Local features, such as the window, bosses, ribs and lip, are added as solid features. The practical guide is **main form in surfaces, local features in solids.**

## Plan the feature order

Write down the intended feature order before modelling. A housing has a natural sequence, and fighting it creates fragile models.

```figure
type: steps
title: Planned feature order for the housing
caption: This is an illustration. Fillets and the shell come late so that their edges exist and their failures can be isolated.
- Skeleton | parameters, planes, layout sketches
- Main form | crown, side and nose surfaces, trimmed and knitted to a solid
- Primary cuts | display window, sensor opening
- *Edge treatment | external fillets, largest first
- Shell | one wall parameter, open at the parting plane
- Split | master body divided into top and base
- Local detail | lip, groove, bosses, ribs, internal fillets
```

Two choices in that order are deliberate. Fillets come before the shell, because a shell needs its outer edges rounded if the inside is to be rounded too. The split comes after the shell, so the wall is identical on both parts. Chapter 6 explains why the fillet-shell order sometimes needs to be reversed, and Chapter 8 explains the split.

## Recognise intent failures early

An intent failure is a change that rebuilds without error but produces the wrong shape. These are more dangerous than rebuild errors, because nothing turns red.

This is an illustration. In the first version of the housing model, the designer placed the display window by dimensioning its rectangle from the edge where the crown meets the nose. The model rebuilt cleanly. Later, the industrial designer shortened the nose taper by 8 mm. The crown-to-nose edge moved, and the window moved with it, so it now sat 32 mm from the nose instead of 40 mm. No error appeared.

The defect was found only because the checker compared the window position with statement 5 of the brief. The fix was to re-reference the window sketch to the centre plane and to a reference plane offset 40 mm from the nose tip. After the fix, the same nose change left the window exactly 40 mm from the nose.

The detection method generalises. After any significant change, measure the brief's statements against the model. A short table of eight checks takes a few minutes and catches movement that the rebuild cannot report.

```figure
type: checklist
title: Brief checks after the nose change
caption: This is an illustration. The window check failed until the sketch was re-referenced to planes instead of a generated edge.
- x Envelope 160 × 72 × 34 mm | measured from the underside datum
- x Symmetric about the long centre plane | mirror check passed
- x Wall 2.0 mm everywhere | thickness analysis, no thin areas
- x Crown rise 6 mm | section measurement
- *x Window 40 mm from the nose | after re-referencing; was 32 mm before the fix
- x Parting line 14 mm above the underside | plane offset
- x Draft 1.0° on side walls | draft analysis
- x Plan corners R10 | sketch dimension
```

## Decide which dimensions drive and which are results

Every dimension in a model is either an input or a consequence. The overall length is an input: someone chose 160 mm. The length of the straight portion of a side wall is a consequence: it is whatever remains after the nose taper and the rear corners have taken their share. Trouble starts when a consequence is dimensioned as though it were an input.

This is an illustration. An early layout sketch for the housing dimensioned the straight side wall as 96 mm, the nose taper as 44 mm and the overall length as 160 mm, with R10 rear corners. On paper that adds up: 96 + 44 + 10 + 10 = 160. In the sketch, however, the system either reports the sketch as over-defined or, if one dimension is set as a reference, quietly accepts whichever three values were applied first. When the nose taper later changed to 36 mm, the straight wall stayed at 96 mm and the overall length shrank to 152 mm, breaking the first statement of the brief.

The correction is to choose the inputs deliberately. For the housing, the inputs are the overall length, the nose taper length and the corner radius. The straight wall is left undimensioned or shown as a driven reference dimension, which displays its value without controlling it. After the correction, a 36 mm nose taper produces a 104 mm straight wall and the overall length stays at 160 mm.

A useful test is to ask, for each dimension, "who would ask to change this?" If the answer is a person with a reason, such as the industrial designer or the electronics engineer, it is an input. If the answer is "nobody, it just falls out", it should be driven.

## Plan for the family before it exists

Housings rarely stay single. A longer variant, a version with a second button or a model without a window often follows within months. Most systems support this with configurations, design tables or derived variants. The skeleton approach makes such a family cheap, provided the variations act on parameters and suppression states rather than on edits to individual features.

Before adding a variant, check that each difference can be expressed as a parameter value or as a feature that is suppressed or unsuppressed. A difference that needs a feature to reference different edges in different variants is a warning sign. It usually means the feature should reference a plane or sketch that both variants share.

## Keep the model readable by someone else

A model that only its author can change is a liability. Rename key features in the tree, such as `Crown surface`, `Side walls`, `Nose patch`, `Shell 2.0`, rather than leaving `Surface-Loft3` and `Shell1`. Group them in folders that follow the planned order. Add a short note to any feature that uses a non-obvious technique, such as an over-extended surface or a temporary split, explaining why.

The edited READOS chapter on [design intent in parametric CAD](/reados/collections/cad-modelling-and-design-intent/design-intent-in-parametric-cad-and-large-assemblies/) discusses intent across large assemblies. The aim here is narrower: one part that a colleague can open, read and change with confidence.

## Exercise: write the intent statements for a change

The product manager asks for a version of the housing 10 mm longer, with the same window position relative to the nose and a wall of 2.4 mm for a tougher resin. Which named parameters and sketches must change, and what values should the lip width and the window position take?

**Worked answer.** The overall length dimension in the plan outline changes from 160 mm to 170 mm. The wall parameter changes from 2.0 mm to 2.4 mm. The lip width is an equation, wall ÷ 2, so it becomes **2.4 ÷ 2 = 1.2 mm** without a manual edit. The window stays **40 mm from the nose**, because its sketch references a plane offset from the nose tip, not the overall length. Nothing else needs to change if the skeleton is built as described.

Then run the eight brief checks. The envelope should read 170 × 72 × 34 mm, the thickness analysis should show 2.4 mm walls, and the window check should still pass. If the window has moved, the window sketch still references a generated edge somewhere, and the fix is to re-reference it to the nose plane.
