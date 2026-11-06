"""The feature registry: the one list of feature types the AI may write (docs/DOCUMENT.md).

Each feature type is described once (a FeatureType with typed Params). From that description:
- `help_text` gives each type's line in the feature-format guide (sw_get_guide),
- `validate` checks the AI's input before anything is built or sent to SOLIDWORKS,
- `with_defaults` and `left_out` say what a field that is not given means,
- geometry.py rebuilds it with the type's `build` function (hand-written types keep their code there).

Adding a feature = one file in this package with its FeatureType and build function, imported at the
bottom of this module, then its counterpart in the SOLIDWORKS add-in.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any, Callable

# Parameter kinds. The JSON value each one takes:
#   length (mm), angle (deg), number, int, bool, string -> the obvious scalar
#   enum      -> one of `options` (value strings)
#   plane     -> {"ref": "Front Plane"|"Top Plane"|"Right Plane"|<plane or sketch id>} or a planar face
#                {"type": "face"|"fixed", "origin", "normal", "xdir"}
#   faces     -> [{"center": [x,y,z], "normal": [x,y,z]}]   (faces picked by centre and normal)
#   edges     -> [{"mid": [x,y,z]}]                         (edges picked by their midpoint)
#   sketch    -> a sketch feature id
#   sketch_line -> a line id inside the feature's sketch
#   features  -> [feature ids]
#   axis      -> "X"|"Y"|"Z"
#   direction -> "X"|"Y"|"Z", {"edge": {"mid": [x,y,z]}} or {"vector": [x,y,z]}
#   object    -> free-form object (documented in `doc`)
KINDS = ("length", "angle", "number", "int", "bool", "string", "enum", "plane", "faces", "edges", "sketch",
         "sketch_line", "features", "axis", "direction", "object")


@dataclass
class Param:
    name: str
    kind: str
    doc: str = ""
    default: Any = None
    required: bool = False
    min: float | None = None
    max: float | None = None
    options: list | None = None      # enum: [(value, label)]
    when: dict | None = None         # meaningful only when other params have these values
    # What a document that leaves the field out builds with, when that is not `default`. Older documents were built
    # with these numbers, so they keep their shape; `default` is what new features are written with
    # (features.with_defaults), always explicitly.
    omitted: Any = None

    def __post_init__(self):
        if self.kind not in KINDS:
            raise ValueError(f"Unknown parameter kind {self.kind!r}")
        if self.kind == "enum" and not self.options:
            raise ValueError(f"Enum parameter {self.name!r} needs options")
        if self.options:
            self.options = [tuple(o) if isinstance(o, (list, tuple)) else (o, str(o)) for o in self.options]


@dataclass
class FeatureType:
    type: str
    title: str                      # SOLIDWORKS name of the feature
    base: str                       # tree name base: Draft -> Draft1, Draft2
    summary: str                    # one sentence for the AI
    params: list[Param]
    build: Callable | None = None   # build(feat, st, diagnostics) -> None or a warning string
    notes: str = ""                 # extra modelling notes for the AI
    keys: dict = field(default_factory=dict)  # extra fixed keys the type always has (e.g. op for cut)

    def param(self, name: str) -> Param | None:
        return next((p for p in self.params if p.name == name), None)


REGISTRY: dict[str, FeatureType] = {}

# Types geometry.py handles that are not registered feature commands (sketches, imported bodies, standard parts).
OTHER_TYPES = ("sketch", "import", "standard")


def register(ft: FeatureType) -> FeatureType:
    if ft.type in REGISTRY or ft.type in OTHER_TYPES:
        raise ValueError(f"Feature type {ft.type!r} is already registered")
    REGISTRY[ft.type] = ft
    return ft


def get(type_: str) -> FeatureType | None:
    return REGISTRY.get(type_)


def left_out(type_: str, name: str):
    """What a document that leaves this field out builds with (`omitted`, else `default`), or None."""
    ft = REGISTRY.get(type_)
    p = next((p for p in ft.params if p.name == name), None) if ft else None
    if p is None:
        return None
    return p.omitted if p.omitted is not None else p.default


def with_defaults(feat: dict) -> dict:
    """A copy of a new feature with every left-out field that has a default written in, so the document carries
    no implicit numbers (what `omitted` means then only matters for older documents)."""
    ft = REGISTRY.get(feat.get("type")) if isinstance(feat, dict) else None
    if ft is None or feat.get("type") in OTHER_TYPES:
        return feat
    out = dict(feat)
    if out.get("type") == "chamfer" and out.get("mode") is None and out.get("distance2") is not None:
        out["mode"] = "distance_distance"  # two distances given: that is what was meant
    if out.get("type") == "linear_pattern" and out.get("direction2"):  # as SOLIDWORKS fills direction 2
        if out.get("count2") is None:
            out["count2"] = 2
        if out.get("spacing2") is None:
            out["spacing2"] = out.get("spacing") if out.get("spacing") is not None else ft.param("spacing").default
    for p in ft.params:
        if out.get(p.name) is None and p.default is not None and _active(p, out, ft):
            out[p.name] = json.loads(json.dumps(p.default))
    return out


def known_types() -> list[str]:
    return [*OTHER_TYPES[:1], *REGISTRY]


# ----------------------------------------------------------------------------- AI help text

PLANE_DOC = ('{"ref": "Front Plane"|"Top Plane"|"Right Plane"|<plane or sketch feature id>} or a planar face '
             '{"type": "face"|"fixed", "origin": [x,y,z], "normal": [x,y,z], "xdir": [x,y,z]}')


def describe_param(p: Param) -> str:
    unit = {"length": " (mm)", "angle": " (degrees)"}.get(p.kind, "")
    d = (p.doc or p.name) + unit
    if p.kind == "plane" and "{" not in d:
        d += ". " + PLANE_DOC
    elif p.kind == "faces" and "center" not in d:
        d += '. Faces picked by centre and outward normal in part coordinates: [{"center": [x,y,z], "normal": [x,y,z]}]'
    elif p.kind == "edges" and "mid" not in d:
        d += '. Edges picked by their midpoint in part coordinates: [{"mid": [x,y,z]}]'
    if p.default is not None and not p.required:
        d += f". Default {json.dumps(p.default)}"
    if p.when:
        d += ". Only used when " + ", ".join(f"{k} = {json.dumps(v)}" for k, v in p.when.items())
    return d


def _value_hint(p: Param) -> str:
    k = p.kind
    if k == "enum":
        return "|".join(json.dumps(o[0]) for o in p.options)
    return {"length": "mm", "angle": "deg", "number": "number", "int": "int", "bool": "bool", "string": "text",
            "plane": "<plane>", "faces": "[faces]", "edges": "[edges]", "sketch": "<sketch id>",
            "sketch_line": "<line id in that sketch>", "features": "[feature ids]", "axis": '"X"|"Y"|"Z"|{"origin","dir"}',
            "direction": '"X"|"Y"|"Z"|{"edge"}', "object": "{...}"}[k]


def help_line(ft: FeatureType) -> str:
    keys = ", ".join(f'"{p.name}":{_value_hint(p)}' for p in ft.params)
    fixed = "".join(f', "{k}":{json.dumps(v)}' for k, v in ft.keys.items())
    line = f'- {ft.type}: {{"type":"{ft.type}"{fixed}, {keys}}}. {ft.summary}'
    docs = [f"{p.name}: {p.doc}" for p in ft.params
            if p.doc and p.kind not in ("faces", "edges") and p.doc.lower().replace(" ", "_") != p.name]
    if docs:
        line += " " + "; ".join(docs) + "."
    if ft.notes:
        line += " " + ft.notes
    return line


def help_text() -> str:
    return "\n".join(help_line(ft) for ft in REGISTRY.values())


# ----------------------------------------------------------------------------- validation

def _is_num(v) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def _is_v3(v) -> bool:
    return isinstance(v, (list, tuple)) and len(v) == 3 and all(_is_num(x) for x in v)


def _active(p: Param, feat: dict, ft: FeatureType) -> bool:
    if not p.when:
        return True
    for k, want in p.when.items():
        q = ft.param(k)
        have = feat.get(k, q.default if q else None)
        if (have not in want) if isinstance(want, (list, tuple)) else have != want:
            return False
    return True


def check_value(p: Param, v) -> str | None:
    """Why `v` is not a valid value for `p`, or None."""
    k = p.kind
    if k in ("length", "angle", "number", "int"):
        if not _is_num(v):
            return "must be a number"
        if k == "int" and int(v) != v:
            return "must be a whole number"
        if p.min is not None and v < p.min:
            return f"must be at least {p.min}"
        if p.max is not None and v > p.max:
            return f"must be at most {p.max}"
    elif k == "bool":
        if not isinstance(v, bool):
            return "must be true or false"
    elif k in ("string", "sketch", "sketch_line"):
        if not isinstance(v, str) or not v:
            return "must be a non-empty string"
    elif k == "enum":
        if v not in [o[0] for o in p.options]:
            return "must be one of " + ", ".join(json.dumps(o[0]) for o in p.options)
    elif k == "axis":
        if not (isinstance(v, str) and v.upper() in ("X", "Y", "Z")) and not (
                isinstance(v, dict) and _is_v3(v.get("dir")) and any(v["dir"]) and (v.get("origin") is None or _is_v3(v["origin"]))):
            return 'must be "X", "Y", "Z" or {"origin": [x,y,z], "dir": [x,y,z]} (origin defaults to the part origin)'
    elif k == "plane":
        if not isinstance(v, dict) or not (v.get("ref") or (_is_v3(v.get("origin")) and _is_v3(v.get("normal")))):
            return "must be " + PLANE_DOC
    elif k == "faces":
        if not isinstance(v, list) or not all(isinstance(x, dict) and _is_v3(x.get("center")) for x in v):
            return 'must be a list of {"center": [x,y,z], "normal": [x,y,z]}'
    elif k == "edges":
        if not isinstance(v, list) or not all(isinstance(x, dict) and _is_v3(x.get("mid")) for x in v):
            return 'must be a list of {"mid": [x,y,z]}'
    elif k == "features":
        if not isinstance(v, list) or not all(isinstance(x, str) for x in v):
            return "must be a list of feature ids"
    elif k == "direction":
        if not (isinstance(v, str) and v.upper() in ("X", "Y", "Z")) and not (isinstance(v, dict) and ("edge" in v or "vector" in v)):
            return 'must be "X", "Y", "Z", {"edge": {"mid": [x,y,z]}} or {"vector": [x,y,z]}'
    elif k == "object":
        if v is not None and not isinstance(v, dict):
            return "must be an object"
    return None


def _missing(v) -> bool:
    return v is None or v == "" or v == []


def validate(feat: dict) -> list[str]:
    """Readable problems with a feature's input (empty when fine). Geometry is checked by the rebuild."""
    if not isinstance(feat, dict):
        return ["each feature must be an object"]
    t = feat.get("type")
    label = feat.get("name") or feat.get("id") or t or "feature"
    if t in OTHER_TYPES:
        return []
    ft = REGISTRY.get(t)
    if ft is None:
        return [f"{label}: unknown feature type {t!r}; known types: {', '.join(known_types())}"]
    out = []
    for p in ft.params:
        if not _active(p, feat, ft):
            continue
        v = feat.get(p.name)
        if _missing(v):
            if p.required:
                out.append(f"{label}: {p.name} is required ({describe_param(p)})")
            continue
        why = check_value(p, v)
        if why:
            out.append(f"{label}: {p.name} {why}")
    if t in ("linear_pattern", "circular_pattern"):
        from ..geometry import PATTERN_MAX
        try:
            total = int(feat.get("count") or 1) * (int(feat.get("count2") or 2) if t == "linear_pattern" and feat.get("direction2") else 1)
        except (TypeError, ValueError):
            total = 0
        if total > PATTERN_MAX:
            out.append(f"{label}: makes {total} instances; a pattern can make at most {PATTERN_MAX}")
    return out


# Registered types: the hand-written ones first (their geometry is in geometry.py), then one module per
# generated feature.
from . import builtin  # noqa: E402,F401
from . import draft  # noqa: E402,F401
