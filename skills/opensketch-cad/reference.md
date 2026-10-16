# OpenSketch reference

## Planes and axes (SOLIDWORKS convention, Y up)

| Plane | Sketch x is | Sketch y is | Extrudes along |
|---|---|---|---|
| Front Plane | +X | +Y | +Z |
| Top Plane | +X | -Z | +Y |
| Right Plane | -Z | +Y | +X |

So a Top Plane rectangle from (0, 0) to (100, 60) covers X 0..100 and Z 0..-60. `reverse: true`
extrudes the other way. A sketch plane can be a named plane `{"ref": "Front Plane"}`, a reference plane
feature `{"ref": "<plane feature id>"}`, a face that follows edits `{"type": "face", "origin", "normal",
"xdir"}`, or a fixed plane `{"type": "fixed", ...}` that stays put (use fixed for exact heights).

## Tool argument shapes

| Tool | Key arguments |
|---|---|
| batch | steps: [{"tool": "propose_features", "args": {...}}, {"tool": "add_fillet", "args": {...}}], summary, stop_on_warnings, dry_run |
| propose_features | mode "append" or "replace", summary, features: [feature, ...] (part documents) |
| create_part | part_id, name, features, material ("6061 Alloy", "ABS"), appearance "#rrggbb" (assemblies) |
| add_<feature> | that feature's fields; part_id in an assembly |
| insert_component | component_id, part, position [x,y,z], rotation [rx,ry,rz] deg, fixed |
| add_mate | type, refs: [{"component": "c1", "plane": {"point", "normal"}} or "axis": {"point", "dir"} or "ref": "Top Plane"], value, align |
| delete_items | features + part_id, or components / mates / parts; delete_absorbed; dry_run |
| set_parameter | name, expression ("2", "wall * 2", "1in"), unit, comment, remove |
| set_equation | feature (id or name), field ("depth", "dir2.depth", or a sketch dimension "D1"), expression |
| body_topology | part_id, kind faces/edges/both, near [x,y,z], limit |
| inspect_design | part_id, sketches |
| measure_items | a, b: {"face": ref} / {"edge": ref} / {"point": [x,y,z]}, plus "component" in assemblies |
| preview_document | view, or yaw + pitch (deg); target [x,y,z] + view_width (mm) for close-ups; section {"point", "normal"} |

Feature fields: extrude {sketch, op boss/cut, end blind/through_all/midplane/up_to_next, depth, reverse,
draft, dir2 {end, depth}}; revolve {sketch, axis (a line id in that sketch), angle}; fillet {radius,
edges}; chamfer {distance, edges}; shell {thickness, faces}; mirror {plane, features}; linear_pattern
{features, direction X/Y/Z, count, spacing}; circular_pattern {features, axis X/Y/Z, count}; draft
{neutral_plane, faces, angle}; plane {base, offset}. Sketch: entities point {x, y} / line {p1, p2} /
circle {center, r} / arc {center, start, end, counter-clockwise}; constraints as in the guide.

## Errors and what to do

| Message | Usual cause | Fix |
|---|---|---|
| Sketch contains an open contour | lines do not share point ids | reuse the same point id at each corner |
| Sketch is empty / Select a sketch to extrude | wrong sketch id | check the id in get_document |
| Nothing to cut: create a boss first | a cut before any body | build the base first |
| Cut removed no material (warning) | wrong plane side, direction or depth | flip `reverse`, or use through_all with dir2 |
| Merged boss added no material (warning) | boss buried in the body | check its plane and direction |
| The operation removed the whole body | cut larger than the part | check sketch size and plane |
| N edge reference(s) missing | a guessed or stale edge ref | body_topology near the spot, use its `ref` |
| Failed to create fillet (radius too large?) | radius bigger than a neighbouring face | smaller radius, or fillet before the feature that thins it |
| Failed to shell the body | thickness too large, or fillets smaller than the wall | thinner wall, or shell before small fillets |
| Plane reference 'x' not found | ref names a feature that does not exist | use a plane feature id or a named plane |
| Face attachment moved the sketch plane (warning) | a face plane followed an edit | use a fixed plane for an exact height |
| Feature 'x' cannot be patterned | only extrudes and revolves can be patterned | pattern the extrude, not its sketch |
| Equation: count must be a whole number | the equation gives a fraction | round() or change the variable |
| Equation: ... has a problem | a variable is unknown or circular | fix the variable in set_parameter |
| Sketch: the sketch cannot take these dimensions | a dimension driven by an equation over-defines or breaks the sketch | inspect_design sketches: check status and conflicts |
| This mate cannot be satisfied with the other mates | over defined or conflicting mates | delete or loosen one; check align |
| batch failed at step N | that step's error (in `failed.error`) | fix that step, resend the whole batch |

## Red flags (stop and check)

| If you think | Do this instead |
|---|---|
| "The midpoint of that edge is about here" | body_topology near the spot; pass `ref` |
| "I'll build the whole part in one call" | stages of 1 to 4 features with batch, predict each |
| "The volume is a bit off, probably fine" | a difference is a wrong plane, direction or depth; find it now |
| "It looks right in the picture" | measure_items the hole sizes, spacing and walls |
| "I'll add fillets as I go" | fillets last, small radii first |
| "The count is length / pitch" | a count must be whole: round() it |
| "I'll just delete it" | delete_items dry_run first |
| "I'll model this screw / bearing / hinge" | standard_part or request_part_file |
| "The sketch rebuilds, so it is fine" | inspect_design: sketches carrying equations should have dof 0 |

## Size of replies

get_document and inspect_design on a big assembly are long: pass part_id for one part. body_topology:
use near and a small limit. batch returns compact step reports and the full report for the last step.
