---
name: opensketch-cad
description: Build, check and change parts and assemblies in OpenSketch (YZ's SOLIDWORKS-style CAD) through its MCP tools, or in SOLIDWORKS itself through the same connector's sw_ tools. Use whenever an OpenSketch tool is available or YZ asks to model, edit, measure or check a part or assembly in OpenSketch or SOLIDWORKS.
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
unchanged in fillet / chamfer `edges` or shell / draft `faces`. Each ref carries a persistent name made
from how the face was built (`e1:end` = the far cap of extrude e1, `e1:side:s1L1` = the side made by
sketch line s1L1, `e2:side:s2c@lp#3` = copy 3 of a patterned hole; an edge is `<face A>|<face B>`). The
name is tried first, so the pick stays on the same edge when the part changes size; the point is the
fallback. face_angle_deg 90 is a sharp corner, 0 is already smooth, and `seam` edges are where a hole or
shaft surface meets itself: do not fillet those. A warning name_not_found means the named face is gone
(an upstream feature changed what it makes): re-read the topology and pick again.

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

## Motion driven by contact

Mates do not push: a lever touching a tongue does not move it. Guide the driven part with its own mates
(it should keep one freedom), then add a coupler mate: the driver measure (usually the hinge's
angle_refs, input "angle"), the driven measure (output "distance" for a slide) and a law worked out from
the geometry (arm length, pin radius, pickup angle; a flat stretch is a dwell; add about 0.01 mm running
clearance). add_contact for the two parts over the range where they must touch. publish_review then says
whether law and shapes agree: apart = the law falls short, a clash = it overshoots. A coupler cannot latch
(a tongue that stays out when the lever returns): give that its own joint.

## Finishing

At the end of a design round, publish_review (compare_version = the version the round started from, notes
= what changed, why, and what is open) and give YZ its `url` with the checks summary: it opens OpenSketch read-only (Motion Review), so he can
send it or open it on his phone. Fix any clash it reports in a joint's travel before calling the round done.
Give YZ the `open` link from the last result. Say which parts are bought and which are custom, the
numbers you checked (and how), and anything you could not check.

## In SOLIDWORKS (sw_ tools)

The same connector drives SOLIDWORKS 2022 on YZ's PC through the OpenSketch add-in. Use it when YZ says
SOLIDWORKS; use the plain tools when he says OpenSketch.

- sw_status first. Not connected: tell YZ what it says (open SOLIDWORKS, OpenSketch > Connect to Claude)
  and stop. sw_get_guide once (the feature format is the same as OpenSketch's).
- SOLIDWORKS is the master copy and YZ edits it by hand: sw_get_document before changing anything; refer to
  existing features by their SOLIDWORKS names (Sketch3, Boss-Extrude1), new ones by your own ids.
- The same loop: predict, sw_batch a stage (all or nothing), check each feature's volume_change_mm3 and
  bbox against your prediction (the server also predicts each feature with OpenSketch's kernel and the
  add-in remakes a feature the other way round when SOLIDWORKS read a flag differently; a "warning" with
  "no way matched the prediction" needs a look). Pick faces with sw_body_topology refs.
- Fully define sketches: each sketch reports SOLIDWORKS' own state ("fully defined" is the goal).
- Assemblies: sw_create_document per part, sw_insert_component, sw_add_mate with refs in part coordinates
  and component = the SOLIDWORKS component name (Bracket-1); sw_check_interference at the end.
- New files go to Documents\OpenSketch; later changes are not saved until sw_save. Tell YZ what to save.
- On a new PC, or when YZ asks to test the add-in: sw_selftest stage plate, then shapes, then assembly. Pass
  on each failed or check step with SOLIDWORKS' reason; YZ sends that and the add-in log to be fixed.
