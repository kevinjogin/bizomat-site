"""Measure one or two picked items (faces, edges, points), like SOLIDWORKS Evaluate > Measure.

A pick is {"face": ref} / {"edge": ref} / {"point": [x, y, z]} / {"name": "<persistent name>"}, where a ref
is what body_topology returns. In an assembly add {"component": "c2"}: the item is taken from that
component's part and placed where the component sits, so two picks on different components give the real
gap between them. In a part document (or with part_id) coordinates are the part's.

One item: its size (area, length, diameter, axis, normal) and, for a planar face, the holes and slots cut
through it. Two items: minimum distance with the closest points, centre (axis to axis) distance, plane
separation and the angle between them.

Idea from SolidCraft (bherbruck/solidcraft): its two-item measure with circle and slot recognition.
"""

from __future__ import annotations

import math

import numpy as np

from . import assembly, geometry


class MeasureError(Exception):
    pass


def _r(v, n=3):
    return round(float(v), n) + 0.0


def _p(v):
    return [_r(x) for x in geometry.vlist(v)]


def _d(v):
    return [_r(x, 4) for x in geometry.vlist(v)]


def _type(s) -> str:
    return str(s.geom_type).split(".")[-1].lower()


# ----------------------------------------------------------------------------- picking

def _solid_for(doc: dict, pick: dict, part_id: str | None):
    """(rebuilt part state, location to place it or None) for one pick. The state carries the namer."""
    loc = None
    if assembly.is_assembly(doc):
        cid = pick.get("component")
        if cid:
            comp = next((c for c in doc.get("components", []) if c["id"] == cid), None)
            if comp is None:
                raise MeasureError(f"Unknown component {cid!r}.")
            part_doc = assembly.part_of(doc, comp)
            loc = assembly.location_of(assembly.Pose.of(comp))
        else:
            pid = pick.get("part_id") or part_id
            if pid not in (doc.get("parts") or {}):
                raise MeasureError("In an assembly give each pick a component (world coordinates) or give part_id.")
            part_doc = doc["parts"][pid]
    else:
        part_doc = doc
    st = geometry.rebuilt(part_doc)  # two picks on one part, or a part just built, cost no second rebuild
    if st.part is None:
        raise MeasureError("The part has no solid body yet.")
    return st, loc


def _place(doc: dict, pick: dict):
    """Where a component sits, without building its part (a point pick only needs that)."""
    comp = next((c for c in doc.get("components", []) if c["id"] == pick.get("component")), None)
    if comp is None:
        raise MeasureError(f"Unknown component {pick.get('component')!r}.")
    return assembly.location_of(assembly.Pose.of(comp))


def resolve(doc: dict, pick: dict, part_id: str | None = None):
    """The picked shape (Face, Edge or Vertex), already placed for an assembly component."""
    from build123d import Vertex
    if not isinstance(pick, dict):
        raise MeasureError("Each pick is an object such as {\"edge\": {\"mid\": [x, y, z]}}.")
    if "point" in pick and not any(k in pick for k in ("face", "edge", "name")):
        p = pick["point"]
        if not (isinstance(p, list) and len(p) == 3):
            raise MeasureError("point must be [x, y, z].")
        v = Vertex(*map(float, p))
        if pick.get("component") and assembly.is_assembly(doc):
            v = v.moved(_place(doc, pick))
        elif pick.get("component"):
            _, loc = _solid_for(doc, pick, part_id)
            v = v.moved(loc) if loc is not None else v
        return v
    st, loc = _solid_for(doc, pick, part_id)
    solid, namer = st.part, st.namer
    if "name" in pick:
        name = pick["name"]
        hit = namer.resolve_edges(solid, name) if "|" in name else namer.resolve_faces(solid, name)
        if not hit:
            raise MeasureError(f"No face or edge named {name!r}. Use body_topology for names.")
        shape = hit[0]
    elif "face" in pick:
        found, _ = geometry.find_faces(solid, [pick["face"]], namer)
        if not found:
            raise MeasureError(f"No face at {pick['face']}. Use body_topology for refs.")
        shape = found[0]
    elif "edge" in pick:
        found, _ = geometry.find_edges(solid, [pick["edge"]], namer)
        if not found:
            raise MeasureError(f"No edge at {pick['edge']}. Use body_topology for refs.")
        shape = found[0]
    else:
        raise MeasureError("A pick needs face, edge, point or name.")
    return shape.moved(loc) if loc is not None else shape


# ----------------------------------------------------------------------------- one item

def _loop(wire) -> dict:
    """Classify an inner loop of a planar face: round hole, slot, or anything else by its size."""
    edges = wire.edges()
    types = [_type(e) for e in edges]
    if len(edges) == 1 and types[0] == "circle":
        e = edges[0]
        return {"kind": "round", "diameter": _r(2 * e.radius), "center": _p(e.arc_center)}
    if sorted(types) == ["circle", "circle", "line", "line"]:
        arcs = [e for e in edges if _type(e) == "circle"]
        lines = [e for e in edges if _type(e) == "line"]
        if abs(arcs[0].radius - arcs[1].radius) < 1e-6 and abs(lines[0].length - lines[1].length) < 1e-6:
            r = arcs[0].radius
            cd = (arcs[0].arc_center - arcs[1].arc_center).length
            return {"kind": "slot", "width": _r(2 * r), "center_distance": _r(cd), "overall_length": _r(cd + 2 * r),
                    "centers": [_p(arcs[0].arc_center), _p(arcs[1].arc_center)]}
    bb = wire.bounding_box()
    return {"kind": "other", "edges": len(edges), "bbox": {"min": _p(bb.min), "max": _p(bb.max)}}


def _axis(shape):
    """(point, unit direction) for a cylinder/cone face, a circle edge (its normal) or a line edge."""
    t = _type(shape)
    try:
        if t in ("cylinder", "cone"):
            ax = shape.axis_of_rotation
            return np.array(geometry.vlist(ax.position)), np.array(geometry.vlist(ax.direction))
        if t == "circle":
            n = shape.normal()
            return np.array(geometry.vlist(shape.arc_center)), np.array(geometry.vlist(n))
        if t == "line":
            a, b = shape.position_at(0), shape.position_at(1)
            d = np.array(geometry.vlist(b - a))
            return np.array(geometry.vlist(a)), d / np.linalg.norm(d)
    except Exception:
        return None
    return None


def _plane(shape):
    if _type(shape) != "plane":
        return None
    c = shape.center()
    return np.array(geometry.vlist(c)), np.array(geometry.vlist(shape.normal_at(c)))


def describe(shape) -> dict:
    kind = type(shape).__name__.lower()
    t = _type(shape) if kind != "vertex" else "point"
    out: dict = {"item": kind, "type": t}
    if kind == "vertex":
        out["point"] = [_r(shape.X), _r(shape.Y), _r(shape.Z)]
        return out
    if kind == "face":
        out["area"] = _r(shape.area, 2)
        out["center"] = _p(shape.center())
        if t == "plane":
            out["normal"] = _d(shape.normal_at(shape.center()))
            loops = [_loop(w) for w in shape.inner_wires()]
            if loops:
                out["openings"] = loops
            bb = shape.bounding_box()
            out["size"] = _p(bb.max - bb.min)
        if t in ("cylinder", "cone", "sphere", "torus"):
            try:
                out["radius"] = _r(shape.radius)
                out["diameter"] = _r(2 * shape.radius)
            except Exception:
                pass
            ax = _axis(shape)
            if ax is not None:
                out["axis"] = {"point": [_r(x) for x in ax[0]], "dir": [_r(x, 4) for x in ax[1]]}
                if t == "cylinder":  # material outside the surface = a hole, inside = a boss or shaft
                    from build123d import Vector
                    p = shape.position_at(0.5, 0.5)
                    n = np.array(geometry.vlist(shape.normal_at(p)))
                    q = np.array(geometry.vlist(p)) - ax[0]
                    radial = q - ax[1] * q.dot(ax[1])
                    out["hole"] = bool(n.dot(radial) < 0)
                    pts = [shape.position_at(u, v) for u in (0.0, 1.0) for v in (0.0, 1.0)]
                    hs = [float(np.dot(np.array(geometry.vlist(Vector(pp))) - ax[0], ax[1])) for pp in pts]
                    out["length"] = _r(max(hs) - min(hs))
        return out
    if kind == "edge":
        out["length"] = _r(shape.length)
        out["start"], out["end"] = _p(shape.position_at(0)), _p(shape.position_at(1))
        if t == "circle":
            out["radius"] = _r(shape.radius)
            out["diameter"] = _r(2 * shape.radius)
            out["center"] = _p(shape.arc_center)
            closed = (shape.position_at(0) - shape.position_at(1)).length < 1e-6
            out["closed"] = closed
            if not closed:
                out["arc_angle_deg"] = _r(math.degrees(shape.length / shape.radius), 2)
        if t == "line":
            out["dir"] = _d((shape.position_at(1) - shape.position_at(0)).normalized())
        return out
    return out


# ----------------------------------------------------------------------------- two items

def _line_distance(p1, d1, p2, d2) -> float:
    c = np.cross(d1, d2)
    if np.linalg.norm(c) < 1e-9:  # parallel: distance from one line to the other
        w = p2 - p1
        return float(np.linalg.norm(w - d1 * w.dot(d1)))
    return float(abs((p2 - p1).dot(c)) / np.linalg.norm(c))


def _angle(a, b, lines=False) -> float:
    cos = float(np.clip(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)), -1, 1))
    ang = math.degrees(math.acos(cos))
    return min(ang, 180 - ang) if lines else ang


def between(a, b) -> dict:
    out: dict = {}
    dist, pa, pb = a.distance_to_with_closest_points(b)
    out["min_distance"] = _r(dist, 4)
    out["from"], out["to"] = _p(pa), _p(pb)
    out["delta"] = [_r(x) for x in np.array(geometry.vlist(pb)) - np.array(geometry.vlist(pa))]
    if dist < 1e-6:
        out["touching"] = True
    axa, axb, pla, plb = _axis(a), _axis(b), _plane(a), _plane(b)
    if axa is not None and axb is not None:
        out["center_distance"] = _r(_line_distance(axa[0], axa[1], axb[0], axb[1]))
        out["axis_angle_deg"] = _r(_angle(axa[1], axb[1], lines=True), 3)
        if out["axis_angle_deg"] < 1e-3:
            out["parallel"] = True
    if pla is not None and plb is not None:
        ang = _angle(pla[1], plb[1])
        out["angle_deg"] = _r(ang, 3)
        if min(ang, 180 - ang) < 1e-3:
            out["parallel"] = True
            out["plane_distance"] = _r(abs((plb[0] - pla[0]).dot(pla[1])))
    for pl, ax in ((pla, axb), (plb, axa)):
        if pl is not None and ax is not None:
            out["axis_to_plane_angle_deg"] = _r(90 - _angle(pl[1], ax[1], lines=True), 3)
            if abs(np.dot(pl[1], ax[1])) < 1e-6:
                out["axis_to_plane_distance"] = _r(abs((ax[0] - pl[0]).dot(pl[1])))
    return out


def measure(doc: dict, a: dict, b: dict | None = None, part_id: str | None = None) -> dict:
    if assembly.is_assembly(doc) and b is not None:
        world = [bool(isinstance(p, dict) and p.get("component")) for p in (a, b)]
        if world[0] != world[1]:
            raise MeasureError("Give both picks a component (assembly coordinates), or neither (one part's coordinates).")
    sa = resolve(doc, a, part_id)
    out = {"a": describe(sa)}
    if b is not None:
        sb = resolve(doc, b, part_id)
        out["b"] = describe(sb)
        out.update(between(sa, sb))
    if assembly.is_assembly(doc) and any(isinstance(p, dict) and p.get("component") for p in (a, b) if p):
        out["coordinates"] = "assembly (world)"
    return out
