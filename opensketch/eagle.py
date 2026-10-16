"""EAGLE XML board outlines and mechanical holes as editable CAD features.

Footprints are retained as source metadata, not invented 3D component envelopes.
EAGLE XY millimetres become the Top Plane (world X, -Z); thickness runs up +Y.
"""
from __future__ import annotations

import math
import os
import re
import xml.etree.ElementTree as ET

from . import geometry
from .importer import ImportError_

MAX_XML_BYTES = 16 * 1024 * 1024
MAX_XML_ELEMENTS = 100_000
MAX_OUTLINE_ENTITIES = 4000
MAX_COMPONENTS = 10_000
MAX_MECHANICAL_INSTANCES = 4000
DEFAULT_THICKNESS = 1.6


class _LimitedTree(ET.TreeBuilder):
    def __init__(self):
        super().__init__()
        self.count = self.depth = 0

    def start(self, tag, attrs):
        self.count += 1
        self.depth += 1
        if self.count > MAX_XML_ELEMENTS or self.depth > 64:
            raise ImportError_("The EAGLE XML board exceeds the element or nesting limit.")
        return super().start(tag, attrs)

    def end(self, tag):
        self.depth -= 1
        return super().end(tag)


def _xml(data):
    if len(data) > MAX_XML_BYTES:
        raise ImportError_("The EAGLE XML board exceeds the 16 MiB import limit.")
    try:
        text = data.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise ImportError_("Only UTF-8 EAGLE XML boards are supported. Save binary boards as EAGLE 6+ XML.") from exc
    if "\x00" in text or not text.lstrip().startswith("<"):
        raise ImportError_("This is not an EAGLE XML board. Save binary boards as EAGLE 6+ XML.")
    # EAGLE's normal declaration is harmless and needs no local file or network access.
    # Remove only that declaration; reject internal subsets and every other DTD/entity.
    text = re.sub(r'<!DOCTYPE\s+eagle\s+SYSTEM\s+([\'"])eagle\.dtd\1\s*>', "", text)
    if re.search(r"<!\s*(?:DOCTYPE|ENTITY)\b", text, re.I):
        raise ImportError_("EAGLE XML custom DTDs and entity declarations are not supported.")
    try:
        root = ET.fromstring(text, parser=ET.XMLParser(target=_LimitedTree()))
    except ET.ParseError as exc:
        raise ImportError_(f"Could not read the EAGLE XML board: {exc}.") from exc
    board = root.find("./drawing/board")
    if root.tag != "eagle" or board is None:
        raise ImportError_("This is not an EAGLE XML board (.brd). Schematics and other board formats are not supported.")
    return root, board


def _number(node, key, default=None):
    try:
        value = float(node.get(key, default))
    except (TypeError, ValueError) as exc:
        raise ImportError_(f"Invalid EAGLE {node.tag} {key} value.") from exc
    if not math.isfinite(value) or abs(value) > 1e6:
        raise ImportError_(f"Invalid EAGLE {node.tag} {key} value.")
    return value


def _rotation(raw="R0"):
    match = re.fullmatch(r"(S?M?|M?S?)R([+-]?(?:\d+(?:\.\d*)?|\.\d+))", raw)
    if not match:
        raise ImportError_(f"Unsupported EAGLE rotation {raw!r}.")
    angle = float(match[2])
    if not math.isfinite(angle) or abs(angle) > 1e6:
        raise ImportError_("Invalid EAGLE rotation angle.")
    angle %= 360
    return angle, "M" in match[1], "S" in match[1]


def _transform(x, y, ox=0.0, oy=0.0, angle=0.0, mirror=False):
    # EAGLE mirrors the local X coordinate before rotating the package.
    x = -x if mirror else x
    c, s = math.cos(math.radians(angle)), math.sin(math.radians(angle))
    return ox + c*x - s*y, oy + s*x + c*y


def _dimension(raw):
    match = re.fullmatch(r"\s*([+\-]?(?:\d+(?:\.\d*)?|\.\d+))(mm|mil|inch)?\s*", raw)
    if not match:
        raise ValueError("invalid stack thickness")
    value = float(match[1]) * {None: 1, "mm": 1, "mil": .0254, "inch": 25.4}[match[2]]
    if not 0 < value <= 100:
        raise ValueError("invalid stack thickness")
    return value


def _thickness(board):
    rules = {p.get("name"): p.get("value", "") for p in board.findall("./designrules/param")}
    setup = rules.get("layerSetup", "")
    result = {"value": DEFAULT_THICKNESS, "source": "default", "layer_setup": setup}
    try:
        if not re.fullmatch(r"[\d\s()+*]+", setup):
            return result
        layers = [int(n) for n in re.findall(r"\d+", setup)]
        if len(layers) < 2 or layers != sorted(set(layers)) or layers[0] < 1 or layers[-1] > 16:
            return result
        copper = [_dimension(n) for n in rules["mtCopper"].split()]
        isolate = [_dimension(n) for n in rules["mtIsolate"].split()]
        # Copper is indexed by EAGLE layer number; dielectric entries describe the
        # successive active gaps (two-layer (1*16) uses mtIsolate[0]).
        active_copper = [copper[n-1] for n in layers]
        active_isolate = isolate[:len(layers)-1]
        if len(active_isolate) != len(layers)-1:
            return result
        value = sum(active_copper) + sum(active_isolate)
        if 0 < value <= 100:
            result.update(value=round(value, 9), source="eagle_layer_stack",
                          copper_mm=active_copper, isolation_mm=active_isolate)
    except (KeyError, ValueError, IndexError):
        pass
    return result


class _Sketch:
    def __init__(self):
        self.entities, self.points = [], {}

    def point(self, x, y):
        key = (round(x, 9), round(y, 9))
        if key not in self.points:
            pid = f"p{len(self.points)+1}"
            self.points[key] = pid
            self.entities.append({"id": pid, "type": "point", "x": key[0], "y": key[1]})
        return self.points[key]

    def wire(self, a, b, curve=0.0):
        if len(self.entities) > MAX_OUTLINE_ENTITIES:
            raise ImportError_("The EAGLE board has too many outline or hole entities.")
        length = math.dist(a, b)
        if length < 1e-9 or abs(curve) >= 360:
            raise ImportError_("The EAGLE outline contains a degenerate wire or arc.")
        p1, p2 = self.point(*a), self.point(*b)
        eid = f"e{len(self.entities)+1}"
        if abs(curve) < 1e-9:
            self.entities.append({"id": eid, "type": "line", "p1": p1, "p2": p2})
            return
        offset = length / (2*math.tan(math.radians(curve)/2))
        cx = (a[0]+b[0])/2 - (b[1]-a[1])/length * offset
        cy = (a[1]+b[1])/2 + (b[0]-a[0])/length * offset
        center = self.point(cx, cy)
        # OpenSketch arcs are always CCW; reversing negative EAGLE arcs preserves
        # the original locus (including large arcs), not the complementary arc.
        self.entities.append({"id": eid, "type": "arc", "center": center,
                              "start": p1 if curve > 0 else p2, "end": p2 if curve > 0 else p1})

    def circle(self, center, radius):
        if len(self.entities) > MAX_OUTLINE_ENTITIES:
            raise ImportError_("The EAGLE board has too many outline or hole entities.")
        if radius <= 0:
            raise ImportError_("The EAGLE board contains a non-positive hole or circle radius.")
        pid = self.point(*center)
        self.entities.append({"id": f"e{len(self.entities)+1}", "type": "circle", "center": pid, "r": radius})

    def feature(self, ident, name):
        return {"id": ident, "type": "sketch", "name": name, "plane": {"ref": "Top Plane"},
                "entities": self.entities, "constraints": []}


def _outline(sketch, node, transform=lambda x, y: (x, y), mirror=False):
    def p(x="x", y="y"):
        return transform(_number(node, x), _number(node, y))
    if node.tag == "wire":
        sketch.wire(p("x1", "y1"), p("x2", "y2"), _number(node, "curve", 0)*(-1 if mirror else 1))
    elif node.tag == "circle":
        sketch.circle(p(), _number(node, "radius"))
    elif node.tag == "rectangle":
        x1, y1, x2, y2 = (_number(node, k) for k in ("x1", "y1", "x2", "y2"))
        angle, mirrored, _ = _rotation(node.get("rot", "R0"))
        cx, cy = (x1+x2)/2, (y1+y2)/2
        pts = [transform(*_transform(x-cx, y-cy, cx, cy, angle, mirrored))
               for x, y in ((x1,y1), (x2,y1), (x2,y2), (x1,y2))]
        for a, b in zip(pts, pts[1:]+pts[:1]):
            sketch.wire(a, b)
    elif node.tag == "polygon":
        verts = list(node.findall("vertex"))
        if len(verts) < 3:
            raise ImportError_("An EAGLE board polygon needs at least three vertices.")
        for a, b in zip(verts, verts[1:]+verts[:1]):
            sketch.wire(transform(_number(a, "x"), _number(a, "y")),
                        transform(_number(b, "x"), _number(b, "y")), _number(a, "curve", 0)*(-1 if mirror else 1))
    else:
        raise ImportError_(f"Unsupported EAGLE layer 20 outline element: {node.tag}.")


def _record(node):
    record = {"tag": node.tag, "attributes": dict(node.attrib)}
    if len(node):
        record["children"] = [_record(c) for c in node]
    if node.text and node.text.strip():
        record["text"] = node.text.strip()
    return record


def import_eagle(data: bytes, filename="board.brd") -> dict:
    root, board = _xml(data)
    thickness = _thickness(board)
    outline, holes_sketch = _Sketch(), _Sketch()
    holes, components, packages, package_nodes, package_mechanical = [], [], [], {}, {}
    outline_count = 0
    mechanical_count = 0

    def count_mechanical():
        nonlocal mechanical_count
        mechanical_count += 1
        if mechanical_count > MAX_MECHANICAL_INSTANCES:
            raise ImportError_("The EAGLE board exceeds the mechanical instance limit.")

    for library in board.findall("./libraries/library"):
        for package in library.findall("./packages/package"):
            key = (library.get("name", ""), package.get("name", ""))
            if key in package_nodes:
                raise ImportError_(f"Ambiguous EAGLE package {key[0]}/{key[1]}.")
            package_nodes[key] = package
            # Index once, so repeated component instances do not repeatedly scan
            # thousands of irrelevant electrical pads and silkscreen records.
            package_mechanical[key] = [n for n in package if n.tag == "hole" or (n.get("layer") == "20" and n.tag != "text")]

    def add_hole(node, source, transform=lambda x, y: (x, y)):
        count_mechanical()
        x, y = transform(_number(node, "x"), _number(node, "y"))
        drill = _number(node, "drill")
        if drill <= 0:
            raise ImportError_("The EAGLE board contains a non-positive hole diameter.")
        for h in holes:
            distance = math.dist((h["x"], h["y"]), (x, y))
            if distance < (h["drill"]+drill)/2 - 1e-8 and not (distance < 1e-8 and abs(h["drill"]-drill) < 1e-8):
                raise ImportError_("Overlapping EAGLE mechanical holes are not supported. Separate the holes before importing.")
        holes.append({"x": round(x, 9), "y": round(y, 9), "drill": drill, "source": source})
        # The same mechanical hole may be repeated in a package and the plain layer.
        if not any(math.dist((h["x"], h["y"]), (x, y)) < 1e-8 and abs(h["drill"]-drill) < 1e-8 for h in holes[:-1]):
            holes_sketch.circle((x, y), drill/2)

    for node in board.findall("./plain/*"):
        if node.get("layer") == "20" and node.tag != "text":
            count_mechanical()
            _outline(outline, node)
            outline_count += 1
        elif node.tag == "hole":
            add_hole(node, "plain")
    used_packages = set()
    for element in board.findall("./elements/element"):
        if len(components) >= MAX_COMPONENTS:
            raise ImportError_("The EAGLE board exceeds the component instance limit.")
        name, library, package = (element.get(k, "") for k in ("name", "library", "package"))
        x, y = _number(element, "x"), _number(element, "y")
        angle, mirror, spin = _rotation(element.get("rot", "R0"))
        components.append({"name": name, "value": element.get("value", ""), "library": library,
                           "package": package, "x": x, "y": y, "rotation": angle, "mirrored": mirror,
                           "spin": spin, "side": "bottom" if mirror else "top",
                           "position": [x, 0 if mirror else thickness["value"], -y]})
        key = (library, package)
        source_package = package_nodes.get(key)
        if source_package is None:
            raise ImportError_(f"Missing EAGLE package {library}/{package} for {name}.")
        if key not in used_packages:
            used_packages.add(key)
            packages.append({"library": library, "name": package,
                             "geometry": [_record(n) for n in source_package if n.tag != "description"]})
        transform = lambda px, py: _transform(px, py, x, y, angle, mirror)
        for node in package_mechanical[key]:
            if node.tag == "hole":
                add_hole(node, name, transform)
            elif node.get("layer") == "20" and node.tag != "text":
                count_mechanical()
                _outline(outline, node, transform, mirror)
                outline_count += 1
    if not outline.entities:
        raise ImportError_("The EAGLE board has no layer 20 (Dimension) outline.")
    if len(outline.entities) + len(holes_sketch.entities) > MAX_OUTLINE_ENTITIES:
        raise ImportError_("The EAGLE board has too many outline or hole entities.")
    features = [outline.feature("pcb_outline", "PCB Outline"),
                {"id": "pcb_board", "type": "extrude", "name": "PCB Thickness", "sketch": "pcb_outline",
                 "op": "boss", "end": "blind", "depth": thickness["value"]}]
    if holes_sketch.entities:
        features += [holes_sketch.feature("pcb_holes", "Mechanical Holes"),
                     {"id": "pcb_drill", "type": "extrude", "name": "Drill Mechanical Holes", "sketch": "pcb_holes",
                      "op": "cut", "end": "through_all"}]
    limitations = ["Component package outlines and pads are 2D reference metadata; no component bodies or heights are inferred.",
                   "Copper, solder mask, electrical pad drills, vias, and milling outside layer 20 are not modelled.",
                   "Layer 20 centreline geometry defines the board edge; outline stroke width is not added."]
    if thickness["source"] == "default":
        limitations.append("No usable EAGLE layer stack was found; PCB thickness defaults to 1.6 mm and can be edited.")
    doc = {"version": 1, "type": "part", "name": os.path.splitext(os.path.basename(filename))[0] or "PCB",
           "units": "mm", "features": features, "rollback": None, "seq": 10, "appearance": "#247a65",
           "pcb": {"format": "eagle-xml", "source": os.path.basename(filename), "eagle_version": root.get("version", ""),
                   "coordinates": "EAGLE XY mm; world [x, height, -y]", "thickness": thickness,
                   "outline": {"layer": 20, "entity_count": outline_count}, "holes": holes,
                   "components": components, "packages": packages, "limitations": limitations}}
    # A closed outline and a valid body are required before callers persist the import.
    state, _ = geometry.regen(doc)
    failed = [f for f in state.status if f.get("state") == "error"]
    if failed or state.part is None:
        reason = failed[0].get("message", "invalid board geometry") if failed else "no solid body"
        raise ImportError_(f"Could not build the EAGLE board: {reason}.")
    return doc
