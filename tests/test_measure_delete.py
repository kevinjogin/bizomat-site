"""measure_items and delete_items with dry run (ideas from SolidCraft), through a real MCP client."""
import math

from opensketch import edits, store
from tests.reference_parts.recipes import FRONT, circle_sketch, rect
from tests.test_assembly import asm_doc
from tests.test_mcp_inspect import data, mcp  # noqa: F401  (fixtures)

PLATE_TOP = {"center": [50, 20, 10], "normal": [0, 0, 1]}


def slot(fid, x0, x1, y, r):
    """A straight slot from x0 to x1 (arc centres) at height y, width 2r, on the Front Plane."""
    p = lambda n, x, yy: {"id": f"{fid}{n}", "type": "point", "x": x, "y": yy}  # noqa: E731
    ents = [p("a", x0, y - r), p("b", x1, y - r), p("c", x1, y + r), p("d", x0, y + r), p("c1", x0, y), p("c2", x1, y),
            {"id": f"{fid}l1", "type": "line", "p1": f"{fid}a", "p2": f"{fid}b"},
            {"id": f"{fid}l2", "type": "line", "p1": f"{fid}c", "p2": f"{fid}d"},
            {"id": f"{fid}a1", "type": "arc", "center": f"{fid}c2", "start": f"{fid}b", "end": f"{fid}c"},
            {"id": f"{fid}a2", "type": "arc", "center": f"{fid}c1", "start": f"{fid}d", "end": f"{fid}a"}]
    return {"id": fid, "type": "sketch", "name": fid, "plane": FRONT, "entities": ents, "constraints": []}


def plate():
    through = {"op": "cut", "end": "through_all", "dir2": {"end": "through_all"}}
    return [rect("s1", FRONT, 0, 0, 100, 40), {"id": "e1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "depth": 10},
            circle_sketch("s2", FRONT, 20, 20, 4), {"id": "e2", "type": "extrude", "name": "Hole", "sketch": "s2", **through},
            slot("s3", 60, 80, 15, 5), {"id": "e3", "type": "extrude", "name": "Slot", "sketch": "s3", **through},
            {"id": "lp", "type": "linear_pattern", "name": "LPattern1", "features": ["e2"], "direction": "Y", "count": 2,
             "spacing": 10}]


def new_plate(mcp):
    d = mcp("create_document", {"name": "Plate"})
    r = mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Plate", "features": plate()})
    assert r["clean"], r
    return d["doc_id"]


def test_measure_face_finds_holes_and_slots(mcp):
    doc = new_plate(mcp)
    r = mcp("measure_items", {"doc_id": doc, "a": {"face": PLATE_TOP}})
    a = r["a"]
    assert a["type"] == "plane" and a["normal"] == [0.0, 0.0, 1.0] and a["size"] == [100.0, 40.0, 0.0]
    rounds = sorted(o["center"][1] for o in a["openings"] if o["kind"] == "round")
    slots = [o for o in a["openings"] if o["kind"] == "slot"]
    assert rounds == [20.0, 30.0] and all(o["diameter"] == 8.0 for o in a["openings"] if o["kind"] == "round")
    assert len(slots) == 1 and slots[0]["width"] == 10.0 and slots[0]["center_distance"] == 20.0
    assert slots[0]["overall_length"] == 30.0


def test_measure_two_items(mcp):
    doc = new_plate(mcp)
    hole = {"face": {"center": [16, 20, 5]}}
    hole2 = {"face": {"center": [16, 30, 5]}}
    r = mcp("measure_items", {"doc_id": doc, "a": hole, "b": hole2})
    assert r["a"]["hole"] is True and r["a"]["diameter"] == 8.0 and r["a"]["length"] == 10.0
    assert r["center_distance"] == 10.0 and r["axis_angle_deg"] == 0.0 and r["parallel"]
    assert abs(r["min_distance"] - 2.0) < 1e-3  # 10 between centres minus two 4 mm radii
    r = mcp("measure_items", {"doc_id": doc, "a": hole, "b": {"face": {"center": [100, 20, 5], "normal": [1, 0, 0]}}})
    assert r["axis_to_plane_distance"] == 80.0 and r["min_distance"] == 76.0
    r = mcp("measure_items", {"doc_id": doc, "a": {"face": {"center": [0, 20, 5], "normal": [-1, 0, 0]}},
                              "b": {"face": {"center": [50, 0, 5], "normal": [0, -1, 0]}}})
    assert r["angle_deg"] == 90.0 and r["touching"]
    r = mcp("measure_items", {"doc_id": doc, "a": {"edge": {"mid": [50, 0, 10]}}, "b": {"point": [50, 0, 30]}})
    assert r["a"]["length"] == 100.0 and r["min_distance"] == 20.0
    assert "No face" in mcp("measure_items", {"doc_id": doc, "a": {"face": {"center": [500, 0, 0]}}})["error"]


def test_measure_between_components(mcp):
    rec = store.create("Pin", doc=asm_doc(), by="you")
    doc = store.get(rec["id"])["doc"]
    comps = {c["id"]: c for c in doc["components"]}
    r = mcp("measure_items", {"doc_id": rec["id"], "a": {"component": "c2", "point": [0, 0, 0]},
                              "b": {"component": "c1", "point": [0, 0, 0]}})
    want = math.dist(comps["c1"]["position"], comps["c2"]["position"])
    assert abs(r["min_distance"] - want) < 1e-3 and r["coordinates"] == "assembly (world)"
    err = mcp("measure_items", {"doc_id": rec["id"], "a": {"component": "c2", "point": [0, 0, 0]}, "b": {"point": [0, 0, 0]},
                                "part_id": "pin"})
    assert "both picks" in err["error"]


def test_plan_delete_cascades_and_reports():
    part = {"features": plate() + [
        {"id": "pl", "type": "plane", "name": "Plane1", "base": {"ref": "Front Plane"}, "offset": 10},
        rect("s9", {"ref": "pl"}, 2, 2, 8, 8), {"id": "e9", "type": "extrude", "name": "Lug", "sketch": "s9", "depth": 4},
        {"id": "f1", "type": "fillet", "name": "Fillet1", "radius": 1, "edges": [{"mid": [5, 2, 12]}]}]}
    plan = edits.plan_delete(part, ["e2"])
    assert plan["deleted_with_it"] == ["lp"] and plan["absorbed"] == ["s2"] and not plan["would_fail"]
    plan = edits.plan_delete(part, ["e2"], delete_absorbed=False)
    assert plan["absorbed"] == []
    plan = edits.plan_delete({"features": plate() + [{"id": "lp2", "type": "linear_pattern", "features": ["e2", "e3"],
                                                       "direction": "X", "count": 2, "spacing": 5}]}, ["e3"])
    assert {"id": "lp2", "keeps": ["e2"]} in plan["patterns_trimmed"]
    plan = edits.plan_delete(part, ["pl"])  # the sketch on Plane1 stays and fails, the fillet loses its edge
    fails = {f["id"] for f in plan["would_fail"]}
    assert "s9" in fails and plan["deleted_with_it"] == [] and "pl" not in {f["id"] for f in plan["part"]["features"]}
    assert "error" in edits.plan_delete(part, ["nope"])


def test_delete_dry_run_then_delete_over_mcp(mcp):
    doc = new_plate(mcp)
    v = store.get(doc)["version"]
    r = mcp("delete_items", {"doc_id": doc, "features": ["e2"], "dry_run": True})
    rep = r["report"]
    assert rep["dry_run"] and rep["deleted_with_it"] == ["lp"] and rep["absorbed"] == ["s2"]
    assert r.get("note") == "Nothing changed." and store.get(doc)["version"] == v
    r = mcp("delete_items", {"doc_id": doc, "features": ["e2"]})
    assert r["clean"] and r["version"] == v + 1
    ids = [f["id"] for f in store.get(doc)["doc"]["features"]]
    assert ids == ["s1", "e1", "s3", "e3"]
    slot_area = 20 * 10 + math.pi * 25
    assert abs(r["report"]["volume"] - (100 * 40 * 10 - slot_area * 10)) < 1e-2


def test_delete_dry_run_in_assembly(mcp):
    rec = store.create("Pin", doc=asm_doc(), by="you")
    r = mcp("delete_items", {"doc_id": rec["id"], "components": ["c2"], "dry_run": True})
    rep = r["report"]
    assert rep["dry_run"] and rep["deleted"]["components"] == ["c2"] and set(rep["deleted"]["mates"]) == {"m1", "m2"}
    assert len(store.get(rec["id"])["doc"]["components"]) == 2
    r = mcp("delete_items", {"doc_id": rec["id"], "features": ["e1"], "part_id": "pin", "dry_run": True})
    assert r["report"]["absorbed"] == ["s1"]
    r = mcp("delete_items", {"doc_id": rec["id"], "features": ["e2"], "part_id": "plate"})
    assert r["clean"] and [f["id"] for f in store.get(rec["id"])["doc"]["parts"]["plate"]["features"]] == ["s1", "e1"]
