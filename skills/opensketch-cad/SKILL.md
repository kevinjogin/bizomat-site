---
name: opensketch-cad
description: Build, check and change parts and assemblies in OpenSketch (YZ's SOLIDWORKS-style CAD) through its MCP tools. Use whenever an OpenSketch tool is available or YZ asks to model, edit, measure or check a part or assembly in OpenSketch.
---

# OpenSketch CAD

OpenSketch works like SOLIDWORKS: sketches with relations and dimensions, a feature tree, mates. YZ
watches every change appear in his browser. You have its MCP tools. Argument shapes, plane tables, error
fixes and traps are in reference.md (the same text comes back from get_modelling_guide).

## The loop: predict, build a stage, measure

1. **Read first.** get_modelling_guide once. For an existing document: get_document (YZ may have edited
   it by hand), then inspect_design.
2. **Plan the stages.** A stage is 1 to 4 features that make one recognisable shape (the base plate; the
   bosses; the holes; the fillets). Fillets and chamfers come last, small radii first.
3. **Predict.** Before each stage, write down the volume and bounding box you expect. A plate minus its
   holes is simple arithmetic: 100 x 40 x 10 - 4 x pi x 3^2 x 10 = 38,869 mm^3.
4. **Build the stage with batch.** One call, steps in order. If any step fails, nothing is saved and the
   reply names the step and why: fix that step and send the whole stage again. Use dry_run when unsure.
5. **Measure.** Compare the batch result (volume, bbox per step) with your prediction. Then check what
   volume cannot show with measure_items: hole diameters, hole spacing, wall thickness, the gap between
   two components. Look with preview_document only when shape matters (yaw/pitch for the side you care
   about, section to see inside).
6. **Fix now, not later.** A wrong number is a wrong plane, direction or depth. Fix it before the next
   stage; errors compound.

## Picking faces and edges

Never guess a midpoint. Call body_topology with near=[x, y, z] around the spot and pass the item's `ref`
unchanged in fillet / chamfer `edges` or shell / draft `faces`. face_angle_deg 90 is a sharp corner, 0
is already smooth (do not fillet it). Refs are re-matched after edits, so re-read the topology after a
change that moves faces.

## Design intent

Give each part a few global variables for the numbers a designer would change (set_parameter, with the
sensible range in comment) and drive dimensions with them (set_equation, or "eq" in the feature). Fully
define sketches that carry equations: inspect_design shows each sketch's dof; aim for 0. After setting
variables, push each one to both ends of its range once (set_parameter, check now_failing, set it back).

## Changing things

- Delete with delete_items dry_run first: it lists what goes with it (deleted_with_it, absorbed) and
  what would break (would_fail). Tell YZ before deleting something he made.
- Every change is a version: undo_last_change, list_versions, restore_version.
- Off-the-shelf first: standard_part for ISO screws, nuts, washers and bearings; request_part_file for
  bought parts with a real part number. Model only what is specific to the product.

## Finishing

Give YZ the `open` link from the last result. Say which parts are bought and which are custom, the
numbers you checked (and how), and anything you could not check.
