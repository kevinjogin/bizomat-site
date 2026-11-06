---
book: surfaces-that-make-parts
chapterSlug: draft-splits-and-releasing-the-model
order: 10
title: "Draft, splits and releasing the model"
description: "Split a moulded part into half-shells, check draft against the pull direction, account for what draft does to flow area, and export and release a surface-built model a toolmaker can trust."
draft: false
---

A surface model is finished when someone else can make the part from it. For a moulded duct, that someone is a toolmaker who will cut steel to the model's shape, and a moulder who will fill the steel with polypropylene and eject the result thousands of times. They need a model that can be pulled from the mould, a clear statement of what each surface must achieve, and a file that arrives in their software intact.

This chapter takes the thickened duct from Chapter 9 through those last steps. It splits the part into the two half-shells decided in Chapter 1, checks every face against the direction the mould opens, finds the faces that cannot be pulled, and works out what correcting them costs in flow area. It ends with the export, the release checks and the record that goes with the model.

## Why the duct is two half-shells

A mould has to open. The steel that forms the inside of a part, the core, has to come out of the part, and the steel that forms the outside, the cavity, has to come away from it. For a straight tube, a core can slide out of one end. For the duct, it cannot: the round inlet is taller than the rectangular outlet, and the outlet is wider than the inlet, so a core shaped like the passage would be trapped whichever way it moved.

Splitting the duct on its vertical plane of symmetry solves this. Each half is an open trough. Its outside is formed by a cavity that pulls away along the y axis, outwards from the split; its inside is formed by a core that pulls the other way along the same axis. The pressure-switch pad, on the left side wall, faces straight along the pull direction, which is why it was moved there from the top of the duct.

## Split the body

Most modellers can split a solid with a plane or a surface into separate bodies, and then save each body as its own part file linked to the original. The duct is split with the plane y = 0. The two bodies are named "Duct half, left" and "Duct half, right"; the left one carries the pad and port.

Two details deserve attention at the split:

- **The joint.** The tongue swept in Chapter 3 belongs on one half and the matching groove on the other. Model them after the split, on the correct bodies, and check the fit: a tongue 2 mm wide in a groove with an agreed clearance on each side, as the moulder and the assembly process require.
- **The seam.** The revolve's seam was placed in the split plane in Chapter 3, and the loft's sections were split at points symmetrical about it. The split therefore follows existing edges and creates no new slivers. A split that cuts through the middle of faces works too, but leaves more edges to inspect.

## Draft and the pull direction

Draft is a slight taper on faces that run along the direction a mould opens, so that the part releases without scraping. A face exactly parallel to the pull direction has zero draft: as the mould opens, the part's surface drags along the steel the whole way. Moulders ask for a minimum draft on all such faces; the value depends on the material, the surface finish and the depth of the feature, and comes from the moulder and the resin supplier. In the case, the moulder asked for at least 1° on the duct's faces. This is an illustration.

A draft analysis colours each face by its angle to the pull direction: faces with enough draft one way, faces with enough draft the other way, and faces in between that need attention. Run it on each half separately, with the pull direction set along y.

```figure
type: compare
title: Draft analysis of the left half-shell, pull along y
cols: Angle to pull direction | Action
caption: This is an illustration. Faces running across the split, like the outlet's top and bottom, have no draft at all until it is added.
- Side walls and pad seat | Close to 90° | None; they face the pull directly
- Round section and bell-mouth | Grows from 0° at the split; under 1° only within about 1 mm of it | Accept; the moulder agreed
- Transition corner regions | Increases quickly from the split | None after checking
- *Outlet and transition top and bottom flats | 0° across their full width | Add 1° draft from the split plane
- Flange top and bottom edges | 0° | Add 1° draft from the split plane
```

On the round section, the surface is parallel to the pull direction only at the split line itself. Moving round the circle from the split, the draft angle equals the angle travelled. On a 60 mm radius, an angle of 1° (0.01745 radians) corresponds to an arc of 60 × 0.01745 = **1.05 mm**. So only a band about 1 mm wide on each side of the split has less than 1° of draft. The moulder accepted that band, which is normal for a round part split on its diameter.

The flats are a different matter. The top and bottom of the outlet rectangle, and the faces of the transition that lead to them, are flat across the split. Their normals point straight up or down, at right angles to the pull. The whole face, 150 mm wide between the corner radii, has zero draft.

## Add draft, then count the cost

The designer applied a 1° draft to the top and bottom faces of each half, with the split plane as the neutral plane: the faces keep their position at the split and tilt away from it. The outside and inside faces were drafted together, so the wall stays 2.5 mm thick. At the split, the outlet is still 60 mm high inside; at the ends of the flats, 75 mm from the split, each flat has moved inwards by 75 × tan 1° = **1.309 mm**. The corner radii beyond the flats are rebuilt to stay tangent, and they follow the flats inwards by about the same amount.

The software reported no errors, and the draft analysis turned green. This is where the release process catches what a modelling process misses. The airflow calculation in Chapter 1 used the undrafted outlet area. The draft has taken some of it away.

The lost area is easy to estimate. On each half, each of the two flats loses a triangle 75 mm long and 1.309 mm deep at its far end, and the strip beyond the flats, out to the side wall, loses a band 15 mm wide and 1.309 mm deep, top and bottom. Over both halves:

**Loss = 75 × tan 1° × (2 × 75 + 4 × 15) = 1.309 × 210 = 274.9 mm²**

That is **2.6%** of the 10,606.9 mm² outlet. The new outlet area is about 10,332 mm², and the mean outlet velocity at 0.12 m³/s rises from 11.31 to about **11.61 m/s**.

```figure
type: bars
title: Outlet flow area before and after 1° draft
unit: mm²
max: 11500
caption: This is an illustration. Draft on the half-shell flats takes 2.6% of the outlet area; the airflow engineer must accept it or the outlet must grow.
- Inlet, for comparison | 11309.7
- Outlet as designed | 10606.9
- *Outlet with 1° draft | 10332.0
```

Two responses are reasonable. The airflow engineer can accept the slightly greater contraction, which is still smooth. Or the designer can raise the outlet height at the split by about 274.9 ÷ 180 = 1.5 mm, restoring the mean area, and then repeat the section-area routine from Chapter 4 and the flange and gasket checks that depend on the outlet. On the case, the engineer accepted the loss and the drawing note was updated to the drafted area. The failure would have been to apply the draft and say nothing: the model would have been mouldable but would no longer match the calculation it claimed to satisfy.

## Review the tool layout with the toolmaker

Before steel is cut, the toolmaker will propose how the mould works, and several of their questions are answered by the surface model:

- **The port hole.** The 12 mm hole in the pad runs along the pull direction, so it can be formed by a pin on the core that meets the cavity, a shut-off, with no sliding side action. Had the port stayed on the top of the duct, it would have run across the pull and needed a side action, or a drilling operation after moulding.
- **Ejection.** Ejector pins push the part off the core and leave small witness marks. On the duct, the core forms the flow surface, so the marks fall inside the passage. That is acceptable for airflow, but the pins must avoid the pad's seal face and the gasket face of the flange, and the model should show where those faces are.
- **The gate.** Where the plastic enters affects filling, weld lines and appearance. The toolmaker will usually suggest a position; the designer checks that any weld line, where two flow fronts meet, does not fall across the flange's seal face or the joint tongue.
- **Shrinkage.** The toolmaker scales the cavity to allow for the material shrinking as it cools. The designer's model stays at the part's final size; shrinkage allowance belongs in the tool design, using the resin supplier's data.

Record the agreed answers with the model. They are design decisions as much as the geometry is, and the next revision of the part should not undo them by accident.

## Export a neutral file

Toolmakers rarely use the same CAD system as their customers. The model goes to them in a neutral format, most often STEP, which ISO publishes as the ISO 10303 series. Application protocols such as AP214 and AP242 define what the file can carry; AP242 can include product manufacturing information as well as geometry. Agree with the toolmaker which protocol and edition their software reads, and whether they want the half-shells as separate files or as one assembly.

Then test the export:

1. Export each half-shell as STEP, with millimetres as the unit.
2. Import the files back into your own CAD system, or into a free viewer, as a new part.
3. Check that each imports as one solid, not a surface body; run the geometry check for open edges.
4. Compare volume and mass with the native model: they should agree to the displayed precision.
5. Measure the inlet diameter, outlet height at the split and the pad position against the native model.

A file that comes back as a surface body, or with a volume that differs, has lost something in translation. Typical causes are a hidden gap closed only by a loose knit tolerance (Chapter 7), a sliver face or an invalid face that the native system tolerated. Fix the source; do not send the file and hope.

## Meshes for prototypes and printing

A prototype printed in plastic, or a quick visualisation, often needs a mesh format such as STL. A mesh replaces every curved surface with flat triangles, and the exporter's chord tolerance sets how far the triangles may depart from the true surface. For a circular arc of radius R divided into segments of angle θ, the greatest departure, the chord height, is

**h = R × (1 − cos(θ ÷ 2))**

On the duct's 15 mm outlet corners, a chord tolerance of 0.01 mm needs segments of about **4.2°**, or 22 segments per 90° corner. On the 60 mm round section, the same tolerance allows segments of about 2.1°, 173 around the circle. Relaxing the tolerance to 0.05 mm cuts the 15 mm corners to 10 segments per 90°, which is fine for a look-and-feel prototype and coarse for a fit check of the gasket. The BIZOMAT [CNC Arc Linearisation Chord Error](/tools/cnc-chord-error/) tool works the same relationship for machining, where a toolpath approximates arcs with straight moves.

```figure
type: compare
title: Mesh segments needed for a given chord tolerance
cols: Chord tolerance | Segment angle | Segments
caption: Smaller radii need finer segments for the same tolerance. Choose the tolerance for what the prototype is meant to check.
- R15 outlet corner | 0.01 mm | 4.2° | 22 per 90°
- R15 outlet corner | 0.05 mm | 9.4° | 10 per 90°
- R60 round section | 0.01 mm | 2.1° | 173 per 360°
- *R60 round section | 0.05 mm | 4.7° | 77 per 360°
```

A mesh is an output, not a master. Never send a mesh to a toolmaker as the definition of a moulded part, and never rebuild a model from a mesh of itself when the native surfaces still exist.

## Release the model with its record

The final step is the record that goes with the files. A surface-built model contains decisions that are invisible in the geometry: which skin carries the requirement, which joins are only G1, which band near the split has little draft, which helper bodies exist and why. The receiver needs to know them.

```figure
type: checklist
title: Release checklist for the duct
caption: This is an illustration. Open items are resolved or recorded with an owner before the files are issued.
- Skeleton variables and the requirement list saved with the model
- Section areas, closed fluid volume and mass recorded against estimates
- Geometry check clean; three open loops on the flow surface, none on the solids
- Draft analysis clean except the agreed 1 mm band at the split
- Drafted outlet area 10,332 mm² accepted by the airflow engineer
- STEP exported, re-imported and compared; mesh tolerance stated for prototypes
- Drawing issued with critical dimensions, wall, material and finish
- ? Moulder's review of gate, ejector and thick regions at bosses
```

The drawing still matters. A model defines the shape; a drawing, or model-based definition where the contract allows it, defines what will be inspected and to what tolerance: the inlet diameter, the outlet height at the split, the flange flatness, the pad position and its flatness, the wall. The Library’s book [Drawings That Make Parts](/reados/publications/drawings-that-make-parts/) covers that side of the release. The surface model and the drawing must agree; when one changes, the other is revised under the same change control.

## Exercise: a steeper draft

The moulder later asks for 1.5° instead of 1° on the flats, to suit a textured finish. Calculate the new outlet area and mean velocity at 0.12 m³/s, and the height increase at the split that would restore the original area.

**Worked answer.** tan 1.5° = 0.02619, so each flat moves inwards by 75 × 0.02619 = 1.964 mm at its end. The loss is 1.964 × 210 = **412.4 mm²**, or 3.9% of the outlet. The new area is 10,606.9 − 412.4 = **10,194.5 mm²**, and the mean velocity becomes 0.12 ÷ 0.0101945 = **11.77 m/s**.

Restoring the area needs about 412.4 ÷ 180 = **2.3 mm** more height at the split. That is a larger change than before, and it alters the outlet, the flange opening and the gasket. The designer's job is to put both options, accept the contraction or grow the outlet, in front of the people who own the airflow and the gasket, with the numbers, and then make the chosen change in the skeleton so that every surface, check and drawing follows it.
