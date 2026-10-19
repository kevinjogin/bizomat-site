"""Computed heights must be fixed datums; face attachments follow edits visibly."""
import copy
import json
import math

import pytest

from opensketch import ai, geometry
from .test_geometry import circle_ent, ok, rect_sketch


def plane(z, mode="fixed", normal=(0, 0, 1)):
    return {"type": mode, "origin": [0, 0, z], "normal": list(normal), "xdir": [1, 0, 0]}


def status(st, fid):
    return next(s for s in st.status if s["id"] == fid)


def warning_codes(st, fid):
    return {w["code"] for w in status(st, fid).get("warnings", [])}


def floor():
    return [rect_sketch("floor_sk", {"ref": "Front Plane"}, 0, 0, 60, 60),
            {"id": "floor", "type": "extrude", "sketch": "floor_sk", "depth": 2.2}]


def nut_pocket(mode):
    return {"features": floor() + [
        rect_sketch("pocket_sk", plane(0, mode), 10, 10, 16, 16),
        {"id": "pocket", "type": "extrude", "op": "cut", "sketch": "pocket_sk", "depth": 1.5},
    ]}


def locating_pin(mode):
    return {"features": floor() + [
        rect_sketch("support_sk", plane(2.2), 40, 40, 44, 44),
        {"id": "support", "type": "extrude", "sketch": "support_sk", "depth": 6},
        {"id": "pin_sk", "type": "sketch", "plane": plane(8.2, mode),
         "entities": circle_ent("pin", 42, 42, 1)},
        {"id": "pin", "type": "extrude", "sketch": "pin_sk", "depth": 3},
    ]}


def test_nut_pocket_face_attachment_moves_2_2_mm_and_fixed_plane_removes_material():
    attached, _ = geometry.regen(nut_pocket("face"))
    fixed, _ = geometry.regen(nut_pocket("fixed"))
    ok(attached)
    ok(fixed)
    attachment = status(attached, "pocket_sk")["diagnostics"]
    assert attachment["requested_plane"]["origin"] == [0, 0, 0]
    assert attachment["resolved_plane"]["origin"] == [0, 0, 2.2]
    assert attachment["plane_resolution"] == {"mode": "face", "shift_mm": 2.2, "matched_face": True}
    assert warning_codes(attached, "pocket_sk") == {"face_plane_moved"}
    assert warning_codes(attached, "pocket") == {"no_material_removed"}
    assert status(attached, "pocket")["diagnostics"]["tool_bbox"][0][2] == pytest.approx(2.2)
    assert status(fixed, "pocket")["diagnostics"]["tool_bbox"][0][2] == pytest.approx(0)
    assert status(fixed, "pocket")["diagnostics"]["volume_change_mm3"] == pytest.approx(-54)
    assert fixed.part.volume == pytest.approx(attached.part.volume - 54)
    assert not any(s.get("warnings") for s in fixed.status)


def test_pin_on_the_support_top_stays_there_with_a_face_or_fixed_plane():
    # The face attachment at 8.2 is the support's top. It used to be re-found as the floor at 2.2 (the floor
    # covers the stored origin, the support top does not), which buried the pin in the support.
    attached, _ = geometry.regen(locating_pin("face"))
    fixed, _ = geometry.regen(locating_pin("fixed"))
    ok(attached)
    ok(fixed)
    assert not any(s.get("warnings") for s in attached.status)
    assert attached.planes["pin_sk"].origin.Z == pytest.approx(8.2)
    assert attached.part.volume == pytest.approx(fixed.part.volume)
    diag = status(fixed, "pin")["diagnostics"]
    assert diag["tool_bbox"][0][2] == pytest.approx(8.2)
    assert diag["tool_bbox"][1][2] == pytest.approx(11.2)
    assert diag["result_bbox"][1][2] == pytest.approx(11.2)
    assert diag["volume_change_mm3"] == pytest.approx(math.pi * 3)
    assert not any(s.get("warnings") for s in fixed.status)


def test_face_still_follows_upstream_depth_change_while_fixed_plane_stays_put():
    features = [rect_sketch("base_sk", {"ref": "Front Plane"}, -10, -10, 10, 10),
                {"id": "base", "type": "extrude", "sketch": "base_sk", "depth": 10},
                rect_sketch("attached", plane(5, "face"), -2, -2, 2, 2),
                rect_sketch("fixed", plane(5), -2, -2, 2, 2)]
    st, _ = geometry.regen({"features": features})
    assert st.planes["attached"].origin.Z == pytest.approx(10)
    assert st.planes["fixed"].origin.Z == pytest.approx(5)
    assert warning_codes(st, "attached") == {"face_plane_moved"}
    assert status(st, "fixed")["state"] == "ok"


def test_missing_face_attachment_is_warned_and_legacy_coordinate_plane_stays_fixed():
    missing = rect_sketch("missing", plane(4, "face"), 0, 0, 5, 5)
    legacy = rect_sketch("legacy", plane(4), 0, 0, 5, 5)
    legacy["plane"].pop("type")
    st, _ = geometry.regen({"features": [missing, legacy]})
    assert warning_codes(st, "missing") == {"face_plane_unmatched"}
    assert status(st, "missing")["diagnostics"]["plane_resolution"]["matched_face"] is False
    assert st.planes["legacy"].origin.Z == pytest.approx(4)
    assert status(st, "legacy")["state"] == "ok"


@pytest.mark.parametrize("settings, expected", [
    ({"depth": 3}, [0, 3]),
    ({"depth": 3, "reverse": True}, [-3, 0]),
    ({"depth": 6, "end": "midplane"}, [-3, 3]),
    ({"depth": 3, "dir2": {"depth": 2}}, [-2, 3]),
])
def test_extrude_depth_diagnostic_uses_resolved_plane_even_when_rotated(settings, expected):
    sketch_plane = {"type": "fixed", "origin": [10, 20, 30], "normal": [1, 1, 1], "xdir": [1, -1, 0]}
    st, _ = geometry.regen({"features": [rect_sketch("sk", sketch_plane, 0, 0, 5, 5),
                                        {"id": "ext", "type": "extrude", "sketch": "sk", **settings}]})
    ok(st)
    diag = status(st, "ext")["diagnostics"]["extrusion"]
    assert diag["normal_range_mm"] == pytest.approx(expected, abs=1e-6)
    assert diag["requested_depth_mm"] == settings["depth"]


def test_offset_reference_plane_reports_base_and_result():
    st, _ = geometry.regen({"features": floor() + [
        {"id": "datum", "type": "plane", "base": plane(0, "face"), "offset": 3},
        rect_sketch("datum_sk", {"ref": "datum"}, 0, 0, 1, 1)]})
    diag = status(st, "datum")["diagnostics"]
    assert diag["resolved_base_plane"]["origin"] == [0, 0, 2.2]
    assert diag["resolved_plane"]["origin"] == [0, 0, 5.2]
    assert st.planes["datum_sk"].origin.Z == pytest.approx(5.2)


def test_live_builder_full_rebuild_and_ai_report_share_warnings_and_measured_geometry():
    doc = nut_pocket("face")
    st, _ = geometry.regen(doc)
    live = ai.LiveBuilder()
    events = [live.add(copy.deepcopy(f)) for f in doc["features"]]
    for event, item in zip(events, st.status):
        assert event["state"] == item["state"]
        assert event.get("warnings") == item.get("warnings")
        assert event["diagnostics"] == item["diagnostics"]
    report, clean = ai._part_report(st)
    assert report["rebuilt"] is True and clean is False and report["clean"] is False
    assert report["errors"] == []
    assert {w["code"] for w in report["warnings"]} == {"face_plane_moved", "no_material_removed"}
    assert report["planes"]["pocket_sk"]["origin"] == [0, 0, 2.2]
    result, clean, _ = ai.Session({"features": []}).propose_features({"features": doc["features"]})
    assert not clean and json.loads(result)["warnings"] == report["warnings"]


def test_reports_separate_errors_from_warnings_and_successful_features():
    doc = {"features": floor() + [{"id": "broken", "type": "extrude", "sketch": "missing"}]}
    st, _ = geometry.regen(doc)
    report, clean = ai._part_report(st)
    assert not clean and report["rebuilt"] is False
    assert [e["id"] for e in report["errors"]] == ["broken"]
    assert report["warnings"] == []
    assert report["status"][1]["diagnostics"]["result_bbox"][1][2] == pytest.approx(2.2)


def test_preview_reports_no_op_and_preserves_existing_body():
    doc = {"features": floor() + [rect_sketch("above", plane(20), 0, 0, 5, 5)]}
    result = geometry.regen_result(doc, {"type": "extrude", "op": "cut", "sketch": "above", "depth": 3})
    assert result["status"][-1]["preview"] is True
    assert result["status"][-1]["state"] == "warning"
    assert result["status"][-1]["warnings"][0]["code"] == "no_material_removed"
    assert result["bbox"][1][2] == pytest.approx(2.2)
    assert result["tool"]["faces"]


def test_assembly_operations_preserve_part_warnings_until_the_part_is_removed():
    session = ai.Session({"features": []})
    session.create_part({"part_id": "pin", "features": nut_pocket("face")["features"]})
    for cid in ("c1", "c2"):
        raw, clean, _ = session.insert_component({"part": "pin", "component_id": cid})
        report = json.loads(raw)
        assert not clean and report["clean"] is False and report["rebuilt"] is True
        assert {w["code"] for w in report["warnings"]} == {"face_plane_moved", "no_material_removed"}
        assert all(w["part"] == "pin" for w in report["warnings"])
    raw, clean, _ = session.add_mate({"type": "lock", "refs": [
        {"component": "c1", "ref": "Origin"}, {"component": "c2", "ref": "Origin"}]})
    report = json.loads(raw)
    assert report["this_mate"]["state"] == "ok" and report["rebuilt"] is True
    assert clean is False and report["clean"] is False
    raw, clean, _ = session.delete_items({"components": ["c2"]})
    assert not clean and json.loads(raw)["warnings"]
    raw, clean, _ = session.delete_items({"parts": ["pin"]})
    assert clean and json.loads(raw)["warnings"] == []


def test_assembly_new_successful_mate_does_not_hide_an_existing_mate_error():
    session = ai.Session({"features": []})
    session.create_part({"part_id": "floor", "features": floor()})
    session.insert_component({"part": "floor", "component_id": "c1"})
    session.insert_component({"part": "floor", "component_id": "c2"})
    bad_raw, clean, _ = session.add_mate({"type": "coincident", "refs": []})
    bad = json.loads(bad_raw)["this_mate"]["id"]
    assert clean is False
    raw, clean, _ = session.add_mate({"type": "lock", "refs": [
        {"component": "c1", "ref": "Origin"}, {"component": "c2", "ref": "Origin"}]})
    report = json.loads(raw)
    assert report["this_mate"]["state"] == "ok"
    assert report["rebuilt"] is False and report["clean"] is False and not clean
    assert any(e.get("mate") == bad for e in report["errors"])
    raw, clean, _ = session.delete_items({"mates": [bad]})
    assert clean and json.loads(raw)["errors"] == []


def test_sketch_on_a_raised_face_away_from_the_origin_stays_on_it():
    """The browser stores a face plane's origin as the part origin projected onto it; the face below a boss
    covers that point, the boss top does not. The sketch must stay on the boss, and follow it with `at`."""
    from tests.test_assembly import rect_sketch

    def doc(height, at=None):
        plane = {"type": "face", "origin": [0, 20, 0], "normal": [0, 1, 0], "xdir": [1, 0, 0], **({"at": at} if at else {})}
        return {"features": [
            rect_sketch("s1", "Top Plane", 80, 80), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10},
            rect_sketch("s2", "Top Plane", 20, 20, 30, 0), {"id": "e2", "type": "extrude", "sketch": "s2", "depth": height},
            {"id": "s3", "type": "sketch", "plane": plane, "constraints": [], "entities": [
                {"id": "p", "type": "point", "x": 30, "y": 0}, {"id": "c", "type": "circle", "center": "p", "r": 4}]},
            {"id": "e3", "type": "extrude", "sketch": "s3", "op": "cut", "depth": 5, "reverse": True}]}

    for at in (None, [30, 20, 0]):
        st, _ = geometry.regen(doc(20, at))
        assert st.planes["s3"].origin.Y == pytest.approx(20)
        assert next(s for s in st.status if s["id"] == "s3")["state"] == "ok"
        assert st.part.volume == pytest.approx(68000 - math.pi * 16 * 5)
    st, _ = geometry.regen(doc(26, [30, 20, 0]))  # the boss grew: the sketch follows its top
    assert st.planes["s3"].origin.Y == pytest.approx(26)
