"""OpenSketch AI: text-to-CAD on the same documents the user edits by hand.

Claude builds parts as real feature trees and, for products with several pieces, builds an
assembly: it creates each part, inserts components and adds mates, like a SOLIDWORKS user would.

Everything streams. `run_stream` yields small JSON events while Claude works:

- its thinking summary and reply text as they are written,
- each feature as soon as Claude has finished writing it (rebuilt on the spot, with the body mesh),
  so the viewport shows the part growing while the rest is still being written,
- every component insertion and mate, with the solved assembly, so the UI can animate the parts
  moving into place.

The final proposal is shown in purple for Accept / Reject, like a code diff in Cursor.
"""

from __future__ import annotations

import copy
import itertools
import json
import re
import uuid
from typing import Iterator

from . import assembly, geometry

MODEL = "claude-opus-5-5"
MAX_ROUNDS = 40
MAX_TOKENS = 32000

_conversations: dict[str, list] = {}
_live_ids = itertools.count(1)


class AIUnavailable(Exception):
    pass


def available() -> bool:
    try:
        import anthropic  # noqa: F401
    except ImportError:
        return False
    import os
    return bool(os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN"))


FEATURES_HELP = """Feature types (part coordinates, millimetres, degrees, Y up as in SOLIDWORKS):

Planes: {"ref": "Front Plane"} (XY, normal +Z), {"ref": "Top Plane"} (XZ, normal +Y, sketch y = world -Z),
{"ref": "Right Plane"} (YZ, normal +X, sketch x = world -Z), {"ref": "<plane or sketch feature id>"},
or a planar face {"type": "face", "origin": [x,y,z], "normal": [x,y,z], "xdir": [x,y,z]}.

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
- plane: {"type":"plane","base":<plane>,"offset":mm}
- extrude: {"type":"extrude","sketch":<sketch id>,"op":"boss"|"cut","end":"blind"|"through_all"|"midplane"|"up_to_next",
  "depth":mm,"reverse":bool,"draft":deg,"dir2":{"end","depth"} or null}. Boss extrudes along the sketch
  plane normal; use "reverse": true for the other way. A cut sketched on a top face needs "reverse": true
  to go into the material.
- revolve: {"type":"revolve","sketch","axis":<line id in that sketch>,"angle":deg,"op":"boss"|"cut"}
- fillet: {"type":"fillet","radius","edges":[{"mid":[x,y,z]}]} (edge picked by its midpoint, part coordinates)
- chamfer: {"type":"chamfer","distance","edges":[...]}
- shell: {"type":"shell","thickness","faces":[{"center":[x,y,z],"normal":[x,y,z]}]} (faces removed)
- mirror: {"type":"mirror","plane":<plane>,"features":[ids]} (omit features to mirror the body)
- linear_pattern: {"type":"linear_pattern","features":[ids],"direction":"X"|"Y"|"Z","count","spacing"}
- circular_pattern: {"type":"circular_pattern","features":[ids],"axis":"X"|"Y"|"Z","count","angle":360}

Every feature has a unique "id" and a SOLIDWORKS-style "name" (Sketch1, Boss-Extrude1, Cut-Extrude1,
Fillet1, ...). Point coordinates must already satisfy the constraints (the app re-solves them, but start
close). Prefer few, meaningful features: one sketch per extrude, simple profiles."""

SYSTEM = f"""You are the design copilot inside OpenSketch, a parametric CAD app that works like SOLIDWORKS.
The user watches the viewport while you work: every feature you write is rebuilt and drawn as soon as
you finish writing it, and every component you insert flies into place when its mates solve.

Two kinds of document:
1. Part: {{"name", "features": [...]}}. Use propose_features for a single solid piece, or to edit the
   part that is open.
2. Assembly: {{"type": "assembly", "parts": {{part id: part document}}, "components": [...], "mates": [...]}}.
   Build an assembly whenever the request has several separate pieces: a machine, a mechanism, a
   product with a lid, fasteners, anything that moves or is made from different parts or materials.
   Never merge separate pieces into one part. If a part document is open and the user asks for a
   multi-piece product, create parts with create_part; the document becomes an assembly (the existing
   part is kept as a component; delete it with delete_items if it is not wanted).

Assembly workflow (one tool call per step, so the user can follow it):
1. create_part for each distinct part, in assembly order (the base first). Model each part around its
   own origin at a natural datum: base parts sit on the Top Plane, shafts and pins run along the Y axis
   centred on the origin or starting at it. The part's own coordinates are what mate references use.
   Repeated identical parts (four columns, eight bolts) are one part inserted several times.
2. insert_component for each instance. The first component is fixed. Give every other component an
   approximate position and rotation; mates finish the placement.
3. add_mate to locate each component, the way a SOLIDWORKS user would: usually a concentric plus a
   coincident for round parts, three coincident or distance mates for prismatic parts. Mate references
   are in each component's part coordinates:
     {{"component": id, "plane": {{"point": [x,y,z], "normal": [x,y,z]}}}}   a planar face (outward normal)
     {{"component": id, "axis": {{"point": [x,y,z], "dir": [x,y,z]}}}}      the axis of a cylindrical face
     {{"component": id, "point": [x,y,z]}}
     {{"component": id, "ref": "Front Plane"|"Top Plane"|"Right Plane"|"Origin"|"X axis"|"Y axis"|"Z axis"}}
   Mate types: coincident, concentric, parallel, perpendicular, distance (value mm), angle (value deg),
   lock. For two touching faces use coincident with "align": "anti" (normals facing each other).
   Leave a rotation or slide free when the real product moves (a piston slides, a wheel spins).
4. check_interference at the end, fix real clashes (holes too small, parts overlapping).
The create_part result lists the part's planar faces and cylinder axes; use them for mate references.

Before each tool call, write one short sentence telling the user what you are about to do
("Base plate, 400 x 300 x 25 mm with four column holes."). When everything rebuilds cleanly,
finish with one or two short sentences about what you built. No emojis.

{FEATURES_HELP}"""


_FEATS = {"type": "array", "items": {"type": "object"}}
_REF = {"type": "object", "description": "Mate reference: component + plane / axis / point / ref, in part coordinates"}

TOOLS = [
    {"name": "propose_features",
     "description": ("Propose features for the open part. The proposal is rebuilt with build123d and the "
                     "rebuild status (per feature, bounding box, volume) is returned. Part documents only."),
     # stream the features as they are written (not buffered per parameter) so the viewport can build live
     "eager_input_streaming": True,
     "input_schema": {"type": "object", "properties": {
         "mode": {"type": "string", "enum": ["append", "replace"]},
         "summary": {"type": "string", "description": "One line describing the change."},
         "features": _FEATS}, "required": ["mode", "features", "summary"]}},
    {"name": "create_part",
     "description": ("Create a part for the assembly, or replace an existing part with the same part_id. "
                     "The part is rebuilt feature by feature while you write it. Returns rebuild status, "
                     "bounding box and its planar faces and cylinder axes for mating."),
     "eager_input_streaming": True,
     "input_schema": {"type": "object", "properties": {
         "part_id": {"type": "string", "description": "Short id, e.g. 'base', 'column', 'pin'."},
         "name": {"type": "string", "description": "Part name shown in the tree, e.g. 'Base Plate'."},
         "material": {"type": "string", "description": "Optional, e.g. 'AISI 1020', '6061 Alloy', 'ABS'."},
         "appearance": {"type": "string", "description": "Optional hex colour, e.g. '#8a96a3'."},
         "features": _FEATS}, "required": ["part_id", "name", "features"]}},
    {"name": "insert_component",
     "description": ("Insert a part into the assembly as a component (or update an existing component "
                     "with the same component_id). Returns the solved assembly."),
     "input_schema": {"type": "object", "properties": {
         "component_id": {"type": "string", "description": "e.g. 'c1'"},
         "part": {"type": "string", "description": "part_id of a created part"},
         "position": {"type": "array", "items": {"type": "number"}, "description": "[x,y,z] mm, starting guess"},
         "rotation": {"type": "array", "items": {"type": "number"}, "description": "[rx,ry,rz] degrees about fixed X, then Y, then Z"},
         "fixed": {"type": "boolean"}}, "required": ["component_id", "part"]}},
    {"name": "add_mate",
     "description": "Add a mate between two components. The assembly is re-solved and the result returned.",
     "input_schema": {"type": "object", "properties": {
         "type": {"type": "string", "enum": list(assembly.MATE_TYPES)},
         "refs": {"type": "array", "items": _REF, "minItems": 2, "maxItems": 2},
         "value": {"type": "number", "description": "distance in mm or angle in degrees"},
         "align": {"type": "string", "enum": ["anti", "aligned", "auto"]},
         "flip": {"type": "boolean"}}, "required": ["type", "refs"]}},
    {"name": "delete_items",
     "description": "Delete components, mates or parts from the assembly by id.",
     "input_schema": {"type": "object", "properties": {
         "components": {"type": "array", "items": {"type": "string"}},
         "mates": {"type": "array", "items": {"type": "string"}},
         "parts": {"type": "array", "items": {"type": "string"}}}}},
    {"name": "check_interference",
     "description": "Check every pair of components for overlapping volume.",
     "input_schema": {"type": "object", "properties": {}}},
]

MATERIALS = {
    "abs": 1.02e-6, "pc/abs": 1.15e-6, "nylon 6/6": 1.14e-6, "pla": 1.24e-6, "polypropylene": 0.9e-6,
    "1060 alloy": 2.7e-6, "6061 alloy": 2.7e-6, "aisi 1020": 7.9e-6, "aisi 304": 8.0e-6, "brass": 8.5e-6,
    "copper": 8.9e-6, "titanium ti-6al-4v": 4.43e-6,
}
PALETTE = ["#8a96a3", "#c4cad2", "#5d7fa8", "#b87333", "#3c4650", "#c8a050", "#6f9a6a", "#a86f6f"]


# ----------------------------------------------------------------------------- helpers

def _apply(doc: dict, inp: dict) -> dict:
    new = copy.deepcopy(doc)
    feats = inp.get("features") or []
    if inp.get("mode") == "replace":
        new["features"] = feats
    else:
        new["features"] = new.get("features", []) + feats
    new.pop("rollback", None)
    return new


def _rebuild_report(doc: dict) -> tuple[str, bool]:
    st, _ = geometry.regen(doc)
    rep, clean = _part_report(st)
    return json.dumps(rep), clean


def _part_report(st) -> tuple[dict, bool]:
    errors = [s for s in st.status if s["state"] in ("error", "warning")]
    rep = {"status": st.status}
    if st.part is not None:
        bb = st.part.bounding_box()
        rep["bbox_min"] = geometry.vlist(bb.min)
        rep["bbox_max"] = geometry.vlist(bb.max)
        rep["volume"] = round(st.part.volume, 3)
        rep["bodies"] = len(st.part.solids())
    else:
        rep["body"] = "none"
    return rep, not errors


def _geometry_summary(solid, limit: int = 24) -> dict:
    """Distinct face planes and cylinder axes of a part, for choosing mate references."""
    from build123d import GeomType
    planes, axes = {}, {}
    for f in solid.faces():
        try:
            if f.geom_type == GeomType.PLANE:
                n = f.normal_at()
                c = f.center()
                key = (tuple(round(v, 3) for v in geometry.vlist(n)), round(n.dot(c), 2))
                if key not in planes or planes[key]["area"] < f.area:
                    planes[key] = {"point": [round(v, 3) for v in geometry.vlist(c)], "normal": list(key[0]), "area": round(f.area, 1)}
            elif f.geom_type == GeomType.CYLINDER:
                ax = f.axis_of_rotation
                d = geometry.vlist(ax.direction)
                p = geometry.vlist(ax.position)
                key = (tuple(round(v, 3) for v in d), tuple(round(v, 2) for v in p), round(f.radius, 3))
                bb = f.bounding_box()
                axes[key] = {"point": [round(v, 3) for v in p], "dir": [round(v, 4) for v in d], "radius": round(f.radius, 3),
                             "bbox": [[round(v, 2) for v in geometry.vlist(bb.min)], [round(v, 2) for v in geometry.vlist(bb.max)]]}
        except Exception:
            continue
    pl = sorted(planes.values(), key=lambda x: -x["area"])[:limit]
    return {"planar_faces": pl, "cylinders": list(axes.values())[:limit]}


def _working_assembly(doc: dict) -> dict:
    if assembly.is_assembly(doc):
        return copy.deepcopy(doc)
    if doc.get("features"):
        return assembly.part_as_assembly(doc)
    return assembly.new_assembly()


def _asm_report(asm: dict, res: dict) -> dict:
    names = {c["id"]: c.get("name") for c in asm.get("components", [])}
    return {
        "components": [{"id": c["id"], "name": names.get(c["id"]), "part": c["part"], "position": c["position"],
                        "rotation": c["rotation"], "state": c["state"], "free_dof": c.get("dof")} for c in res["components"]],
        "mates": [{"id": m["id"], "state": m["state"], **({"message": m["message"]} if m.get("message") else {})} for m in res["mates"]],
        "parts": {k: {"status": [s for s in v["status"] if s["state"] in ("error", "warning")] or "ok", "bbox": v["bbox"]}
                  for k, v in res["parts"].items()},
    }


def _next_name(existing: list[str], base: str) -> str:
    n = 1
    while f"{base}{n}" in existing:
        n += 1
    return f"{base}{n}"


class FeatureScanner:
    """Finds each complete object in the top-level "features" array of a tool input that is still
    streaming in, so features can be rebuilt while the rest is being written."""

    def __init__(self):
        self.buf = ""
        self.i = 0
        self.depth = 0
        self.in_str = False
        self.esc = False
        self.str_start = 0
        self.last_key = None
        self.arr_depth = None
        self.obj_start = None

    def feed(self, chunk: str) -> list[dict]:
        self.buf += chunk
        out = []
        b = self.buf
        while self.i < len(b):
            ch = b[self.i]
            if self.in_str:
                if self.esc:
                    self.esc = False
                elif ch == "\\":
                    self.esc = True
                elif ch == '"':
                    self.in_str = False
                    if self.depth == 1:
                        self.last_key = b[self.str_start + 1:self.i]
            elif ch == '"':
                self.in_str = True
                self.str_start = self.i
            elif ch in "{[":
                self.depth += 1
                if ch == "[" and self.depth == 2 and self.last_key == "features" and self.arr_depth is None:
                    self.arr_depth = 2
                elif ch == "{" and self.arr_depth is not None and self.depth == self.arr_depth + 1:
                    self.obj_start = self.i
            elif ch in "}]":
                if ch == "}" and self.arr_depth is not None and self.depth == self.arr_depth + 1 and self.obj_start is not None:
                    try:
                        out.append(json.loads(b[self.obj_start:self.i + 1]))
                    except json.JSONDecodeError:
                        pass
                    self.obj_start = None
                if ch == "]" and self.arr_depth is not None and self.depth == self.arr_depth:
                    self.arr_depth = -1  # done; never matches again
                self.depth -= 1
            self.i += 1
        return out

    def field(self, key: str):
        m = re.search(r'"%s"\s*:\s*"((?:[^"\\]|\\.)*)"' % re.escape(key), self.buf)
        return m.group(1) if m else None


class LiveBuilder:
    """Rebuilds features one at a time and reports each step for the viewport."""

    def __init__(self, base_features=()):
        self.st = geometry.RegenState()
        self.count = 0
        for f in base_features:
            if f.get("suppressed"):
                continue
            try:
                geometry.regen_feature(f, self.st)
            except Exception:
                pass

    def add(self, f: dict) -> dict:
        before = self.st.part
        ev = {"feature": {k: f.get(k) for k in ("id", "name", "type")}, "state": "ok"}
        try:
            warn = geometry.regen_feature(f, self.st)
            if isinstance(warn, str):
                ev.update(state="warning", message=warn)
        except Exception as exc:  # incomplete or wrong feature: show it, keep going
            ev.update(state="error", message=str(exc))
        if f.get("type") in ("sketch", "plane") and f.get("id") in self.st.planes:
            ev["frame"] = geometry.plane_dict(self.st.planes[f["id"]])
            if f.get("type") == "sketch":
                ev["sketch"] = f
        if self.st.part is not None and self.st.part is not before:
            ev["body"] = geometry.mesh_shape(self.st.part)
            bb = self.st.part.bounding_box()
            ev["bbox"] = [geometry.vlist(bb.min), geometry.vlist(bb.max)]
        self.count += 1
        return ev


# ----------------------------------------------------------------------------- session

class Session:
    """One request: the working document plus the event stream that describes changes to it."""

    def __init__(self, doc: dict):
        self.doc = doc
        self.work = copy.deepcopy(doc)
        self.sent_keys: dict[str, str] = {}
        self.steps: list = []
        self.summary = ""

    # -- part documents
    def propose_features(self, inp: dict) -> tuple[str, bool, list]:
        if assembly.is_assembly(self.work):
            return "This is an assembly. Use create_part to change a part, insert_component and add_mate to place it.", False, []
        cand = _apply(self.work, inp)
        report, clean = _rebuild_report(cand)
        self.work = cand
        self.summary = inp.get("summary", "")
        self.steps.append({"summary": self.summary, "clean": clean})
        return report, clean, [{"ev": "proposal", "doc": self.work, "summary": self.summary}]

    # -- assemblies
    def _asm(self) -> dict:
        if not assembly.is_assembly(self.work):
            self.work = _working_assembly(self.work)
        return self.work

    def _solve_event(self, action: dict) -> tuple[dict, dict]:
        asm = self.work
        res = assembly.regen_assembly(asm, known=self.sent_keys)
        self.work = assembly.apply_solution(asm, res)
        for pid, p in res["parts"].items():
            self.sent_keys[pid] = p["key"]
        return res, {"ev": "assembly", "doc": self.work, "result": res, "action": action}

    def create_part(self, inp: dict) -> tuple[str, bool, list]:
        asm = self._asm()
        pid = str(inp.get("part_id") or f"part{len(asm['parts']) + 1}")
        feats = inp.get("features") or []
        part = {"version": 1, "type": "part", "name": inp.get("name") or pid, "units": "mm", "features": feats,
                "rollback": None, "seq": 1000}
        old = asm["parts"].get(pid)
        part["appearance"] = inp.get("appearance") or (old or {}).get("appearance") or PALETTE[len(asm["parts"]) % len(PALETTE)]
        mat = inp.get("material")
        if mat:
            part["material"] = {"name": mat, "density": MATERIALS.get(mat.lower(), 7.85e-6)}
        elif old and old.get("material"):
            part["material"] = old["material"]
        st, _ = geometry.regen(part)
        rep, clean = _part_report(st)
        if st.part is not None:
            rep.update(_geometry_summary(st.part))
        asm["parts"][pid] = part
        self.summary = f"Part {part['name']}"
        self.steps.append({"summary": self.summary, "clean": clean})
        events = []
        if any(c.get("part") == pid for c in asm.get("components", [])):
            _, ev = self._solve_event({"kind": "part", "part": pid})
            events.append(ev)
        else:
            events.append({"ev": "proposal", "doc": self.work, "summary": self.summary})
        rep["part_id"] = pid
        return json.dumps(rep), clean, events

    def insert_component(self, inp: dict) -> tuple[str, bool, list]:
        asm = self._asm()
        pid = inp.get("part")
        if pid not in asm["parts"]:
            return f"Unknown part {pid!r}. Create it with create_part first.", False, []
        cid = str(inp.get("component_id") or f"c{len(asm['components']) + 1}")
        comp = next((c for c in asm["components"] if c["id"] == cid), None)
        new = comp is None
        if new:
            n = 1 + sum(1 for c in asm["components"] if c.get("part") == pid)
            comp = {"id": cid, "part": pid, "name": f"{asm['parts'][pid].get('name', pid)}<{n}>"}
            asm["components"].append(comp)
            asm.setdefault("sequence", []).append(cid)
        if comp.get("part") != pid:
            n = 1 + sum(1 for c in asm["components"] if c.get("part") == pid and c is not comp)
            comp["name"] = f"{asm['parts'][pid].get('name', pid)}<{n}>"
        comp["part"] = pid
        if "position" in inp:
            comp["position"] = [float(v) for v in inp["position"]][:3]
        if "rotation" in inp:
            comp["rotation"] = [float(v) for v in inp["rotation"]][:3]
        comp.setdefault("position", [0, 0, 0])
        comp.setdefault("rotation", [0, 0, 0])
        if "fixed" in inp:
            comp["fixed"] = bool(inp["fixed"])
        elif new and len(asm["components"]) == 1:
            comp["fixed"] = True
        res, ev = self._solve_event({"kind": "insert", "component": cid, "new": new})
        self.summary = f"Inserted {comp['name']}"
        self.steps.append({"summary": self.summary, "clean": True})
        return json.dumps(_asm_report(asm, res)), True, [ev]

    def add_mate(self, inp: dict) -> tuple[str, bool, list]:
        asm = self._asm()
        t = inp.get("type")
        mid = f"m{asm.get('seq', 1)}"
        while any(m["id"] == mid for m in asm["mates"]):
            asm["seq"] = asm.get("seq", 1) + 1
            mid = f"m{asm['seq']}"
        asm["seq"] = asm.get("seq", 1) + 1
        mate = {"id": mid, "name": _next_name([m.get("name", "") for m in asm["mates"]], str(t).capitalize()), "type": t,
                "refs": inp.get("refs") or []}
        for k in ("value", "align", "flip"):
            if k in inp:
                mate[k] = inp[k]
        asm["mates"].append(mate)
        res, ev = self._solve_event({"kind": "mate", "mate": mid})
        state = next((m for m in res["mates"] if m["id"] == mid), {})
        clean = state.get("state") == "ok"
        self.summary = f"{mate['name']}"
        self.steps.append({"summary": self.summary, "clean": clean})
        rep = _asm_report(self.work, res)
        rep["this_mate"] = {"id": mid, **state}
        return json.dumps(rep), clean, [ev]

    def delete_items(self, inp: dict) -> tuple[str, bool, list]:
        asm = self._asm()
        comps = set(inp.get("components") or [])
        parts = set(inp.get("parts") or [])
        comps |= {c["id"] for c in asm["components"] if c.get("part") in parts}
        mates = set(inp.get("mates") or [])
        mates |= {m["id"] for m in asm["mates"] if any(r.get("component") in comps for r in m.get("refs", []))}
        asm["components"] = [c for c in asm["components"] if c["id"] not in comps]
        asm["mates"] = [m for m in asm["mates"] if m["id"] not in mates]
        asm["sequence"] = [c for c in asm.get("sequence", []) if c not in comps]
        for p in parts:
            asm["parts"].pop(p, None)
        res, ev = self._solve_event({"kind": "delete", "components": sorted(comps), "mates": sorted(mates)})
        return json.dumps(_asm_report(asm, res)), True, [ev]

    def check_interference(self, inp: dict) -> tuple[str, bool, list]:
        if not assembly.is_assembly(self.work):
            return "Not an assembly.", True, []
        r = assembly.interference(self.work)
        rep = {"checked_components": r["checked"],
               "interferences": [{"components": i["names"], "volume_mm3": round(i["volume"], 2)} for i in r["interferences"]]}
        ev = {"ev": "interference", "items": [{"a": i["a"], "b": i["b"], "volume": i["volume"], "mesh": i["mesh"]} for i in r["interferences"]]}
        return json.dumps(rep), not r["interferences"], [ev]

    def apply(self, name: str, inp: dict):
        fn = {"propose_features": self.propose_features, "create_part": self.create_part,
              "insert_component": self.insert_component, "add_mate": self.add_mate,
              "delete_items": self.delete_items, "check_interference": self.check_interference}.get(name)
        if fn is None:
            return f"Unknown tool {name}", False, []
        return fn(inp or {})


# ----------------------------------------------------------------------------- streaming loop

class _Live:
    """Watches one tool_use block while its input streams in."""

    def __init__(self, name: str, index: int, session: Session):
        self.name, self.index, self.session = name, index, session
        self.key = next(_live_ids)
        self.scan = FeatureScanner()
        self.builder = None
        self.names: list[str] = []
        self.chars = 0

    def feed(self, partial: str) -> list[dict]:
        self.chars += len(partial)
        events = []
        feats = self.scan.feed(partial)
        if self.name in ("propose_features", "create_part"):
            for f in feats:
                if self.builder is None:
                    self.builder = LiveBuilder(self._base(f))
                    events.append({"ev": "build_start", "tool": self.name, "index": self.index, "key": self.key,
                                   "part": self.scan.field("part_id"), "name": self.scan.field("name") if self.name == "create_part" else None,
                                   "appearance": self.scan.field("appearance")})
                step = self.builder.add(f)
                events.append({"ev": "build_step", "index": self.index, "key": self.key, "n": self.builder.count, **step})
                if f.get("name"):
                    self.names.append(f["name"])
        else:
            names = re.findall(r'"(?:component_id|part|type)"\s*:\s*"([^"]+)"', self.scan.buf)
            if names and names != self.names:
                self.names = names
                events.append({"ev": "tool_progress", "index": self.index, "tool": self.name, "names": names, "chars": self.chars})
        return events

    def _base(self, first: dict) -> list:
        """Features already in the part before this proposal (append mode)."""
        if self.name != "propose_features" or assembly.is_assembly(self.session.work):
            return []
        mode = self.scan.field("mode")
        base = self.session.work.get("features", [])
        if mode == "replace":
            return []
        if mode is None and any(f.get("id") == first.get("id") for f in base):
            return []
        return base


def _stream_call(client, kw, on_event) -> object:
    """Call the model, streaming when the client supports it. on_event(raw) gets each stream event."""
    msgs = client.beta.messages
    if hasattr(msgs, "stream"):
        with msgs.stream(**kw) as stream:
            for event in stream:
                on_event(event)
            return stream.get_final_message()
    resp = msgs.create(**{k: v for k, v in kw.items()})
    # replay as stream events so the caller sees the same shape
    for i, b in enumerate(resp.content):
        on_event(_Fake("content_block_start", index=i, content_block=b))
        if b.type == "text":
            on_event(_Fake("content_block_delta", index=i, delta=_Fake("text_delta", text=b.text)))
        elif b.type == "tool_use":
            on_event(_Fake("content_block_delta", index=i, delta=_Fake("input_json_delta", partial_json=json.dumps(b.input))))
        on_event(_Fake("content_block_stop", index=i))
    return resp


class _Fake:
    def __init__(self, type_, **kw):
        self.type = type_
        self.__dict__.update(kw)


def demo_enabled() -> bool:
    import os
    return os.environ.get("OPENSKETCH_AI_DEMO", "") not in ("", "0")


def run_stream(doc: dict, prompt: str, history_id: str | None = None, demo: bool | str = False,
               demo_speed: float = 1.0) -> Iterator[dict]:
    """Yield events while Claude designs. The last event is {"ev": "done", ...} or {"ev": "error", ...}.

    With demo=True (or OPENSKETCH_AI_DEMO=1) a scripted session (opensketch/demo.py) is streamed
    through the same code path, so the live view can be tried without an API key."""
    try:
        import anthropic
    except ImportError:
        anthropic = None
    demo = demo or demo_enabled()
    if demo:
        from . import demo as demo_mod
        client = demo_mod.client(demo_speed, demo if isinstance(demo, str) else "press")
    elif not available() or anthropic is None:
        yield {"ev": "error", "message": "Set ANTHROPIC_API_KEY to use OpenSketch AI."}
        return
    else:
        client = anthropic.Anthropic()
    conv_id = history_id if isinstance(history_id, str) and history_id in _conversations else str(uuid.uuid4())
    messages = _conversations.setdefault(conv_id, [])
    kind = "assembly" if assembly.is_assembly(doc) else "part"
    messages.append({"role": "user", "content": (
        f"Current {kind} document:\n```json\n{json.dumps(doc)}\n```\n\nRequest: {prompt}")})
    session = Session(doc)
    yield {"ev": "start", "conversation": conv_id, "kind": kind, "demo": demo}
    thinking = {"type": "adaptive", "display": "summarized"}
    for _ in range(MAX_ROUNDS):
        kw = dict(model=MODEL, max_tokens=MAX_TOKENS, system=SYSTEM, tools=TOOLS, messages=messages,
                  output_config={"effort": "high"}, betas=["server-side-fallback-2026-07-01"], fallbacks="default")
        if thinking:
            kw["thinking"] = thinking
        queue: list[dict] = []
        lives: dict[int, _Live] = {}

        def on_event(e, queue=queue, lives=lives):
            t = e.type
            if t == "content_block_start":
                cb = e.content_block
                if cb.type == "tool_use":
                    lives[e.index] = _Live(cb.name, e.index, session)
                    queue.append({"ev": "tool_start", "index": e.index, "tool": cb.name})
                elif cb.type == "thinking":
                    queue.append({"ev": "thinking_start"})
            elif t == "content_block_delta":
                d = e.delta
                if d.type == "text_delta":
                    queue.append({"ev": "text", "delta": d.text})
                elif d.type == "thinking_delta" and getattr(d, "thinking", ""):
                    queue.append({"ev": "thinking", "delta": d.thinking})
                elif d.type == "input_json_delta" and e.index in lives:
                    try:
                        queue.extend(lives[e.index].feed(d.partial_json))
                    except Exception as exc:  # live preview is best-effort
                        queue.append({"ev": "note", "message": f"Live preview skipped: {exc}"})

        # Run the stream in this generator, flushing events as they arrive.
        import threading
        done = threading.Event()
        result: dict = {}

        def worker():
            try:
                result["resp"] = _stream_call(client, kw, on_event)
            except Exception as exc:  # surfaced below
                result["exc"] = exc
            finally:
                done.set()

        th = threading.Thread(target=worker, daemon=True)
        th.start()
        while not done.is_set() or queue:
            done.wait(0.05)
            while queue:
                yield queue.pop(0)
        exc = result.get("exc")
        if exc is not None:
            if anthropic and isinstance(exc, anthropic.BadRequestError) and thinking and ("thinking" in str(exc) or "display" in str(exc)):
                thinking = None  # older API without summarized thinking: retry without it
                continue
            if anthropic and isinstance(exc, anthropic.APIConnectionError):
                yield {"ev": "error", "message": f"Network error: {exc}"}
            elif anthropic and isinstance(exc, anthropic.APIStatusError):
                yield {"ev": "error", "message": f"API error {exc.status_code}: {exc.message}"}
            else:
                yield {"ev": "error", "message": f"AI error: {exc}"}
            return
        resp = result["resp"]
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason == "refusal":
            yield {"ev": "done", "conversation": conv_id, "reply": "The request was declined.", "proposal": None, "steps": session.steps}
            return
        uses = [b for b in resp.content if b.type == "tool_use"]
        if not uses:
            text = "".join(b.text for b in resp.content if b.type == "text").strip()
            changed = session.work != session.doc
            yield {"ev": "done", "conversation": conv_id, "reply": text or session.summary,
                   "proposal": session.work if changed else None, "summary": session.summary, "steps": session.steps}
            return
        results = []
        for u in uses:
            idx = next((i for i, b in enumerate(resp.content) if b is u), None)
            try:
                report, clean, events = session.apply(u.name, u.input)
                for ev in events:
                    yield {**ev, "index": idx}
                yield {"ev": "tool_done", "index": idx, "tool": u.name, "clean": clean, "summary": session.summary}
                results.append({"type": "tool_result", "tool_use_id": u.id, "content": report})
            except Exception as exc:  # malformed input
                yield {"ev": "tool_done", "index": idx, "tool": u.name, "clean": False, "summary": f"Could not apply: {exc}"}
                results.append({"type": "tool_result", "tool_use_id": u.id, "is_error": True,
                                "content": f"Could not apply {u.name}: {exc}"})
        messages.append({"role": "user", "content": results})
    yield {"ev": "done", "conversation": conv_id, "reply": session.summary or "Stopped after several attempts.",
           "proposal": session.work if session.work != session.doc else None, "summary": session.summary, "steps": session.steps}


def run(doc: dict, prompt: str, history_id: str | None = None) -> dict:
    """Non-streaming wrapper: run the whole loop and return the final result."""
    if not available():
        raise AIUnavailable("Set ANTHROPIC_API_KEY to use OpenSketch AI.")
    last = None
    for ev in run_stream(doc, prompt, history_id):
        last = ev
        if ev["ev"] == "error":
            raise AIUnavailable(ev["message"])
    out = dict(last or {})
    out.pop("ev", None)
    return out
