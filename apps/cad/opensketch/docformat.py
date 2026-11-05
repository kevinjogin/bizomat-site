"""The feature format the AI writes (sketches, features, mate references), as text for sw_get_guide, and the rebuild
report helpers inspection.py uses. The format itself is docs/DOCUMENT.md; the feature list comes from the registry
(features/), so a new feature type shows up here by itself."""

from __future__ import annotations

from . import features

FEATURES_HELP = """Feature types (part coordinates, millimetres, degrees, Y up as in SOLIDWORKS):

Planes: {"ref": "Front Plane"} (XY, normal +Z), {"ref": "Top Plane"} (XZ, normal +Y, sketch y = world -Z),
{"ref": "Right Plane"} (YZ, normal +X, sketch x = world -Z), {"ref": "<plane or sketch feature id>"},
or a planar face {"type": "face", "origin": [x,y,z], "normal": [x,y,z], "xdir": [x,y,z], "at": [x,y,z]}.
"at" is a point on that face (body_topology's "point"): the face holding it is found again after upstream
edits, so give it for any face away from the origin. The origin is a hint, not an exact coordinate. Use {"type": "fixed", "origin": [x,y,z], "normal": [x,y,z], "xdir": [x,y,z]}
for computed heights (enclosure floors, nut pockets, locating pins), or an offset reference plane.

- sketch: {"type":"sketch","plane":<plane>,"entities":[...],"constraints":[...]}
  entities (2D sketch coordinates):
    {"id","type":"point","x","y"}  ("origin" is the fixed sketch origin point id)
    {"id","type":"line","p1":<point id>,"p2":<point id>,"construction":false}
    {"id","type":"circle","center":<point id>,"r"}
    {"id","type":"arc","center","start","end"}  (counter-clockwise from start to end; start and end at equal radius)
  Lines that share a point id are connected. Profiles must be closed loops; inner loops become holes.
  Use "construction": true for centerlines (revolve axes, symmetry).
  constraints (make sketches fully defined, like a good SOLIDWORKS user):
    {"id","type":"horizontal"|"vertical","refs":[line]}
    {"id","type":"coincident","refs":[point, point|line|circle]}
    {"id","type":"parallel"|"perpendicular"|"equal"|"collinear","refs":[a,b]}
    {"id","type":"tangent","refs":[line|arc|circle, arc|circle]}
    {"id","type":"concentric","refs":[circle|arc, circle|arc]}
    {"id","type":"midpoint","refs":[point, line]}
    {"id","type":"symmetric","refs":[point, point, centerline]}
    {"id","type":"fix","refs":[point]}
    dimensions: {"id","type":"distance","refs":[a,b],"value","orient":"aligned"|"horizontal"|"vertical"}
    (a line alone = its length), {"id","type":"diameter"|"radius","refs":[circle|arc],"value"},
    {"id","type":"angle","refs":[line,line],"value"}. Give dimensions a "name" like "D1".
Features. [edges] = [{"mid": [x,y,z]}] (an edge picked by its midpoint), [faces] = [{"center": [x,y,z],
"normal": [x,y,z]}] (a face picked by its centre and outward normal), both in part coordinates; <plane> as above.
""" + features.help_text() + """

Every feature has a unique "id" and a SOLIDWORKS-style "name" (Sketch1, Boss-Extrude1, Cut-Extrude1,
Fillet1, ...). Point coordinates must already satisfy the dimensions and relations: they are used as written.
Prefer few, meaningful features: one sketch per extrude, simple profiles."""

MATES_HELP = """Mate references, in each component's part coordinates:
  {"component": name, "plane": {"point": [x,y,z], "normal": [x,y,z]}}   a planar face (outward normal)
  {"component": name, "axis": {"point": [x,y,z], "dir": [x,y,z]}}      the axis of a cylindrical face
  {"component": name, "point": [x,y,z]}
  {"component": name, "ref": "Front Plane"|"Top Plane"|"Right Plane"|"Origin"|"X axis"|"Y axis"|"Z axis"}
Mate types: coincident, concentric, parallel, perpendicular, distance (value mm), angle (value deg), lock,
limit_distance (min/max mm), limit_angle (min/max deg), hinge (axis refs plus optional planes, angle_refs,
angle_min/angle_max). For two touching faces use coincident with "align": "anti". Locate parts the way a
SOLIDWORKS user would: a concentric plus a coincident for round parts, three coincident or distance mates for
prismatic ones. Leave a rotation or slide free where the real product moves.

Design intent: give each part a few global variables for the numbers a designer would change (length, width,
wall, hole size, count) and drive dimensions with them ("eq" on a feature field or a sketch dimension, or
set_equation). Fully define sketches that carry equations. Fasteners and bearings: use the standard part tool.
No emojis."""

GUIDE = FEATURES_HELP + "\n\n" + MATES_HELP


def status_report(status: list) -> dict:
    errors = [s for s in status if s["state"] == "error"]
    warnings = [{"id": s["id"], **w} for s in status for w in s.get("warnings", [])]
    warnings.extend({"id": s["id"], "code": "rebuild_warning", "message": s.get("message", "Rebuild warning")}
                    for s in status if s["state"] == "warning" and not s.get("warnings"))
    return {"status": status, "errors": errors, "warnings": warnings,
            "rebuilt": not errors, "clean": not errors and not warnings}


def asm_report(asm: dict, res: dict) -> dict:
    """Rebuild and mate state of an assembly (inspection.inspect_design)."""
    names = {c["id"]: c.get("name") for c in asm.get("components", [])}
    full = {k: {**status_report(v["status"]), "bbox": v["bbox"], "planes": v.get("planes", {})}
            for k, v in res["parts"].items()}
    errors = [{"part": pid, **e} for pid, p in full.items() for e in p["errors"]]
    warnings = [{"part": pid, **w} for pid, p in full.items() for w in p["warnings"]]
    for pid, v in res["parts"].items():
        if v.get("rolled_back"):
            what = "has no body in the assembly" if not v.get("bbox") else "is missing its features from there down"
            warnings.append({"part": pid, "message": f"{v.get('name') or pid} is rolled back (bar above "
                             f"{v['rolled_back']['name']}) and {what}."})
    for kind in ("mate", "component"):
        for item in res[kind + "s"]:
            if item["state"] == "error":
                errors.append({kind: item["id"], "message": item.get("message", f"{kind.capitalize()} error")})
            elif item["state"] == "warning":
                warnings.append({kind: item["id"], "message": item.get("message", f"{kind.capitalize()} warning")})
    return {
        "rebuilt": not errors, "clean": not errors and not warnings, "errors": errors, "warnings": warnings,
        "components": [{"id": c["id"], "name": names.get(c["id"]), "part": c["part"], "position": c["position"],
                        "rotation": c["rotation"], "state": c["state"], "free_dof": c.get("dof"),
                        **({"message": c["message"]} if c.get("message") else {})} for c in res["components"]],
        "mates": [{"id": m["id"], "state": m["state"], **({"message": m["message"]} if m.get("message") else {})}
                  for m in res["mates"]],
        "parts": full,
    }
