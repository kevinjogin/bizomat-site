"""The feature registry: one list of feature commands for the user, the in-app AI and MCP.

Each feature type is described once (a FeatureType with typed Params). From that description:
- the browser builds the PropertyManager (generated layout unless the type has a hand-written one in
  features.js), the ribbon button and the defaults (GET /api/features),
- the in-app AI gets an `add_<type>` tool, the feature's line in the system prompt and input checks,
- the MCP server gets an `add_<type>` tool with the same parameters,
- geometry.py rebuilds it with the type's `build` function (hand-written types keep their code there).

Adding a feature = one file in this package with its FeatureType and build function, imported at the
bottom of this module. Nothing else has to change for it to work three ways.
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
SELECTIONS = ("plane", "faces", "edges", "sketch", "sketch_line", "features")  # picked in the graphics area


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
    label: str | None = None         # PropertyManager label / tooltip
    icon: str | None = None          # PropertyManager row icon
    section: str | None = None       # PropertyManager rollout title
    when: dict | None = None         # shown (and meaningful) only when other params have these values
    widget: str | None = None        # "radio" for enums shown as radio buttons, "toggle" for icon bools

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
    title: str                      # PropertyManager title and ribbon label base
    base: str                       # tree name base: Draft -> Draft1, Draft2
    icon: str
    summary: str                    # one sentence for the AI and the ribbon tooltip
    params: list[Param]
    build: Callable | None = None   # build(feat, st, diagnostics) -> None or a warning string
    ui: str = "generated"           # "custom": features.js has a hand-written PropertyManager
    command: str | None = None      # CommandManager command id (defaults to the type)
    label: str | None = None        # ribbon label (defaults to the title)
    message: str = ""               # PropertyManager prompt while required selections are missing
    notes: str = ""                 # extra modelling notes for the AI
    tool: bool = True               # add_<type> tool for the AI and MCP
    keys: dict = field(default_factory=dict)  # extra fixed keys a new feature gets (e.g. op for cut)

    def param(self, name: str) -> Param | None:
        return next((p for p in self.params if p.name == name), None)


REGISTRY: dict[str, FeatureType] = {}

# Types geometry.py handles that are not commands (no PropertyManager, not added by these tools).
OTHER_TYPES = ("sketch", "import", "standard")


def register(ft: FeatureType) -> FeatureType:
    if ft.type in REGISTRY or ft.type in OTHER_TYPES:
        raise ValueError(f"Feature type {ft.type!r} is already registered")
    REGISTRY[ft.type] = ft
    return ft


def get(type_: str) -> FeatureType | None:
    return REGISTRY.get(type_)


def default_of(type_: str, name: str):
    """The registry default of one field of a feature type, or None."""
    ft = REGISTRY.get(type_)
    if ft is None:
        return None
    return next((p.default for p in ft.params if p.name == name), None)


def known_types() -> list[str]:
    return [*OTHER_TYPES[:1], *REGISTRY]


# ----------------------------------------------------------------------------- JSON schema (AI and MCP)

_V3 = {"type": "array", "items": {"type": "number"}, "minItems": 3, "maxItems": 3}
PLANE_DOC = ('{"ref": "Front Plane"|"Top Plane"|"Right Plane"|<plane or sketch feature id>} or a planar face '
             '{"type": "face"|"fixed", "origin": [x,y,z], "normal": [x,y,z], "xdir": [x,y,z]}')


def param_schema(p: Param) -> dict:
    k = p.kind
    if k in ("length", "angle", "number"):
        s: dict = {"type": "number"}
    elif k == "int":
        s = {"type": "integer"}
    elif k == "bool":
        s = {"type": "boolean"}
    elif k in ("string", "sketch", "sketch_line"):
        s = {"type": "string"}
    elif k == "enum":
        s = {"type": "string", "enum": [o[0] for o in p.options]}
    elif k == "axis":
        s = {"type": "string", "enum": ["X", "Y", "Z"]}
    elif k == "plane":
        s = {"type": "object"}
    elif k == "faces":
        s = {"type": "array", "items": {"type": "object", "properties": {"center": _V3, "normal": _V3}, "required": ["center"]}}
    elif k == "edges":
        s = {"type": "array", "items": {"type": "object", "properties": {"mid": _V3}, "required": ["mid"]}}
    elif k == "features":
        s = {"type": "array", "items": {"type": "string"}}
    elif k == "direction":
        s = {"anyOf": [{"type": "string", "enum": ["X", "Y", "Z"]}, {"type": "object"}]}
    else:
        s = {"type": "object"}
    if p.min is not None and k in ("length", "angle", "number", "int"):
        s["minimum"] = p.min
    if p.max is not None and k in ("length", "angle", "number", "int"):
        s["maximum"] = p.max
    s["description"] = describe_param(p)
    return s


def describe_param(p: Param) -> str:
    unit = {"length": " (mm)", "angle": " (degrees)"}.get(p.kind, "")
    d = (p.doc or p.label or p.name) + unit
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


def tool_name(ft: FeatureType) -> str:
    return f"add_{ft.type}"


def tool_description(ft: FeatureType) -> str:
    return (f"Add one {ft.title} feature to a part: {ft.summary} It is rebuilt and drawn at once; the result has the "
            f"rebuild status and the body's bounding box. In an assembly give part_id. For a whole part or many features "
            f"at once, propose_features / create_part are faster." + (f" {ft.notes}" if ft.notes else ""))


def tool_schema(ft: FeatureType) -> dict:
    props = {"part_id": {"type": "string", "description": "Assembly documents: the part to add the feature to."},
             "name": {"type": "string", "description": f"Optional tree name (default {ft.base}N)."}}
    for p in ft.params:
        props[p.name] = param_schema(p)
    return {"type": "object", "properties": props, "required": [p.name for p in ft.params if p.required]}


def ai_tools() -> list[dict]:
    return [{"name": tool_name(ft), "description": tool_description(ft), "input_schema": tool_schema(ft)}
            for ft in REGISTRY.values() if ft.tool]


def type_for_tool(name: str) -> FeatureType | None:
    if not name.startswith("add_"):
        return None
    ft = REGISTRY.get(name[4:])
    return ft if ft and ft.tool else None


# ----------------------------------------------------------------------------- AI help text

def _value_hint(p: Param) -> str:
    k = p.kind
    if k == "enum":
        return "|".join(json.dumps(o[0]) for o in p.options)
    return {"length": "mm", "angle": "deg", "number": "number", "int": "int", "bool": "bool", "string": "text",
            "plane": "<plane>", "faces": "[faces]", "edges": "[edges]", "sketch": "<sketch id>",
            "sketch_line": "<line id in that sketch>", "features": "[feature ids]", "axis": '"X"|"Y"|"Z"',
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
        if not (isinstance(v, str) and v.upper() in ("X", "Y", "Z")) and not (isinstance(v, dict) and _is_v3(v.get("dir"))):
            return 'must be "X", "Y", "Z" or {"origin": [x,y,z], "dir": [x,y,z]}'
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


def new_feature(ft: FeatureType, inp: dict) -> dict:
    """A feature dict from tool input: defaults filled in, unknown keys dropped."""
    f = {"type": ft.type, **ft.keys}
    for p in ft.params:
        if inp.get(p.name) is not None:
            f[p.name] = inp[p.name]
        elif p.default is not None:
            f[p.name] = json.loads(json.dumps(p.default))
    return f


# ----------------------------------------------------------------------------- browser

def public() -> dict:
    """What the browser needs (GET /api/features): every registered type with its parameters."""
    out = {}
    for ft in REGISTRY.values():
        out[ft.type] = {
            "type": ft.type, "title": ft.title, "base": ft.base, "icon": ft.icon, "summary": ft.summary,
            "ui": ft.ui, "command": ft.command or ft.type, "label": ft.label or ft.title, "message": ft.message,
            "keys": ft.keys, "tool": tool_name(ft) if ft.tool else None,
            "params": [{"name": p.name, "kind": p.kind, "doc": p.doc, "default": p.default, "required": p.required,
                        "min": p.min, "max": p.max, "options": [list(o) for o in p.options] if p.options else None,
                        "label": p.label, "icon": p.icon, "section": p.section, "when": p.when, "widget": p.widget}
                       for p in ft.params],
        }
    return out


# Registered types: the hand-written ones first (their geometry is in geometry.py), then one module per
# generated feature.
from . import builtin  # noqa: E402,F401
from . import draft  # noqa: E402,F401
