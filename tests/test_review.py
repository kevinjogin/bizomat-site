"""Review pages (review.py): joint travel from real solves, checks, version compare, share links, MCP."""
import base64
import copy
import json
import math

import numpy as np
import pytest
from fastapi.testclient import TestClient

from opensketch import assembly, auth, demo, review, server, store
from tests.test_assembly import hinge_doc
from tests.test_mcp import _rpc


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)


def lid_doc(lo=0, hi=110):
    d = hinge_doc()
    m = d["mates"][0]
    m["angle_refs"] = [{"component": "c1", "plane": {"point": [0, 20, 0], "normal": [0, 1, 0]}},
                       {"component": "c2", "plane": {"point": [0, 5, 30], "normal": [0, 1, 0]}}]
    m["angle_min"], m["angle_max"] = lo, hi
    return d


def test_hinge_travel_is_solved_not_guessed():
    asm = lid_doc()
    built = {pid: assembly.build_part(p) for pid, p in asm["parts"].items()}
    res = assembly.regen_assembly(asm)
    asm = assembly.apply_solution(asm, res)
    rest = {c["id"]: assembly.Pose(np.array(c["matrix"]).reshape(4, 4)[:3, :3], np.array(c["position"])) for c in res["components"]}
    tr = review._travel(asm, asm["mates"][0], built, assembly._size(asm, built), rest)
    assert tr["moving"] == ["c2"] and len(tr["frames"]) == review.STEPS and tr["rest"] == 0.0
    assert tr["reached"][0] == pytest.approx(0, abs=1e-3) and tr["reached"][-1] == pytest.approx(110, abs=1e-3)
    M = np.array(tr["frames"][-1]["c2"]).reshape(4, 4)
    assert np.allclose(M[:3, 3], [0, 20, -30], atol=1e-4)  # turns about the hinge axis, does not slide
    ang = math.degrees(math.acos(np.clip(M[:3, 1] @ [0, 1, 0], -1, 1)))
    assert ang == pytest.approx(110, abs=0.05)
    r = review.build({"id": "x", "name": "Lid", "version": 2, "doc": lid_doc()})
    assert r["joints"] == [{"id": "m1", "name": "Hinge1", "type": "hinge", "unit": "°", "min": 0.0, "max": 110.0,
                            "rest": 0.0, "moving": ["c2"], "reached": [pytest.approx(0, abs=1e-3), pytest.approx(110, abs=1e-3)]}]
    j = r["checks"]["joints"][0]
    assert j["clashes"] == [] and j["unreached"] == [] and not r["checks"]["errors"]


def test_press_stops_and_a_clash_in_the_travel():
    d = demo.press_doc()
    r = review.build({"id": "x", "name": "Press", "version": 1, "doc": d})
    j = r["checks"]["joints"][0]
    assert r["joints"][0]["moving"] == ["c8"]  # columns, crown and cylinder stay put (solver noise ignored)
    assert j["reached"] == [pytest.approx(110, abs=1e-3), pytest.approx(300, abs=1e-3)] and j["clashes"] == []
    assert r["checks"]["clashes_rest"] == []
    m = next(x for x in d["mates"] if x["type"] == "limit_distance")
    m["min"] = 40  # a top stop above the rod tip: the platen runs into the rod
    r = review.build({"id": "x", "name": "Press", "version": 1, "doc": d})
    hits = r["checks"]["joints"][0]["clashes"]
    assert hits and {hits[0]["a"], hits[0]["b"]} == {"c7", "c8"} and hits[0]["value"] == 40


def test_compare_marks_changed_parts_and_ghosts_the_old_ones():
    old = demo.press_doc()
    new = copy.deepcopy(old)
    boss = next(f for f in new["parts"]["platen"]["features"] if f["type"] == "extrude" and f.get("op", "boss") == "boss")
    boss["depth"] = 26
    r = review.build({"id": "x", "name": "Press", "version": 6, "doc": new}, compare={"version": 5, "doc": old},
                     history=[{"version": 6, "by": "claude", "summary": "Thicker platen"}, {"version": 5, "summary": "Press"}])
    changed = {pid: p["changed"] for pid, p in r["parts"].items() if p.get("changed")}
    assert list(changed) == ["platen"] and changed["platen"] == f"Changed {boss['name']}."
    assert len(r["old"]) == 1 and r["old"][0]["part"] == "platen" and r["old"][0]["body"]["faces"] and r["changes"] == [{"version": 6, "by": "claude", "summary": "Thicker platen"}]
    # the mate followed the thicker platen's top face: travel is still measured as 110 to 300
    assert r["checks"]["joints"][0]["reached"] == [pytest.approx(110, abs=1e-3), pytest.approx(300, abs=1e-3)]


def test_part_review_shares_shapes_not_the_model():
    from tests.test_geometry import rect_sketch
    part = {"name": "Block", "parameters": [{"name": "w", "expression": "40"}],
            "features": [rect_sketch("s1", {"ref": "Front Plane"}, 0, 0, 40, 20), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10}]}
    r = review.build({"id": "x", "name": "Block", "version": 1, "doc": part}, title="Block <b>review</b>")
    assert r["kind"] == "part" and r["joints"] == [] and len(r["doc"]["components"]) == 1
    assert r["doc"]["parts"]["part1"] == {"name": "Block", "type": "part", "features": []} and "parameters" not in r["doc"]
    body = r["result"]["parts"]["part1"]["body"]
    assert body["faces"] and r["result"]["parts"]["part1"]["key"]  # the app draws and solves from these
    assert r["title"] == "Block <b>review</b>"  # data stays text; the app sets it with textContent
    with pytest.raises(review.ReviewError):
        review.build({"id": "x", "name": "Empty", "version": 1, "doc": {"type": "assembly", "parts": {}, "components": [], "mates": []}})


def test_lever_lock_coupler_and_contacts():
    r = review.build({"id": "x", "name": "Lock", "version": 1, "doc": demo.lock_doc()})
    assert r["joints"][0]["moving"] == ["c2", "c3"]  # driving the lever moves the tongue (coupler)
    k = r["checks"]["contacts"][0]
    assert k["name"] == "Pin on tongue" and k["checked"] >= 15 and k["apart"] == [] and k["largest_gap_mm"] <= review.CONTACT_MM
    assert r["checks"]["joints"][0]["clashes"] == [] and not r["checks"]["errors"]
    # a law that leaves the tongue too far: the contact check finds the gap; too short: the clash check
    for shift, what in ((0.3, "apart"), (-0.3, "clash")):
        d = demo.lock_doc()
        d["mates"][3]["law"] = [[x, y + shift] for x, y in d["mates"][3]["law"]]
        r = review.build({"id": "x", "name": "Lock", "version": 1, "doc": d}, bodies=False)
        if what == "apart":
            assert len(r["checks"]["contacts"][0]["apart"]) == r["checks"]["contacts"][0]["checked"]
            assert r["checks"]["contacts"][0]["largest_gap_mm"] == pytest.approx(0.31, abs=0.01)
        else:
            assert {(x["a"], x["b"]) for x in r["checks"]["joints"][0]["clashes"]} == {("c2", "c3")}


def test_contact_at_rest_and_check_api():
    d = demo.lock_doc()
    d["contacts"] = [{"id": "k1", "name": "Pin on tongue", "a": "c2", "b": "c3"}]  # no joint: at rest, where it is apart
    with TestClient(server.app) as c:
        out = c.post("/api/review/check", json={"doc": d}).json()
    k = out["checks"]["contacts"][0]
    assert k["checked"] == 1 and k["apart"][0]["gap_mm"] == pytest.approx(3.225, abs=0.01)  # the arm corner, 0.5 mm above the tongue and "doc" not in out
    assert out["joints"][0]["id"] == "m1"


def test_share_links_work_without_the_password(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "secret")
    rec = store.create("Lid", doc=lid_doc(), by="you")
    store.save(rec["id"], lid_doc(0, 90), "claude", "Smaller opening")
    with TestClient(server.app) as c:
        assert c.post("/api/reviews", json={"doc_id": rec["id"]}).status_code == 401  # publishing needs the login
        c.post("/login", data={"password": "secret", "next": "/"})
        out = c.post("/api/reviews", json={"doc_id": rec["id"], "compare_version": 1, "notes": "Lid opening 90."}).json()
        assert out["url"].endswith("/review/" + out["token"]) and out["version"] == 2 and out["compare"] == 1
        assert out["checks"]["joints"][0]["reached"] == [pytest.approx(0, abs=1e-3), pytest.approx(90, abs=1e-3)]
        assert c.post("/api/reviews", json={"doc_id": rec["id"], "compare_version": 2}).status_code == 400
        assert [r["token"] for r in c.get(f"/api/reviews?doc_id={rec['id']}").json()] == [out["token"]]
    with TestClient(server.app) as anon:  # no cookie
        page = anon.get(f"/review/{out['token']}")
        assert page.status_code == 200 and "text/html" in page.headers["content-type"]
        assert page.headers["x-robots-tag"].startswith("noindex") and f'window.OPENSKETCH_REVIEW = "{out["token"]}"' in page.text
        assert 'src="js/app.js"' in page.text  # the app itself, its files under /review/
        data = anon.get(f"/review/{out['token']}/data")
        assert data.status_code == 200 and data.headers["content-encoding"] == "gzip"
        snap = data.json()
        assert snap["notes"] == "Lid opening 90." and snap["doc"]["parts"]["lid"]["features"] == [] and snap["result"]["parts"]
        assert anon.get("/review/js/app.js").status_code == 200 and anon.get("/review/vendor/three.module.js").status_code == 200
        assert anon.get("/api/features").status_code == 200  # the command list the app loads
        assert "import hmac" not in anon.get("/review/js/../../auth.py").text and "def " not in anon.get("/review/js/../../auth.py").text  # normalised to /auth.py: a sign-in page, not the source
        for bad in ("/review/index.html", "/review/js/%2e%2e/%2e%2e/auth.py", "/review/x/data"):
            assert anon.get(bad).status_code == 404, bad
        assert anon.get("/api/docs").status_code == 401
        assert anon.get("/review/not-a-real-token-at-all-xx").status_code == 404
        leak = anon.get("/review/../reviews.json")  # normalised to /reviews.json: the login page, not the index
        assert out["token"] not in leak.text and anon.get("/review/%2e%2e%2freviews.json").status_code == 404
        assert anon.get("/api/reviews").status_code == 401
    with TestClient(server.app) as c:
        c.post("/login", data={"password": "secret", "next": "/"})
        assert c.delete(f"/api/reviews/{out['token']}").json() == {"deleted": out["token"]}
        assert c.get(f"/review/{out['token']}").status_code == 404


def test_publish_review_over_mcp():
    rec = store.create("Press", doc=demo.press_doc(), by="you")
    with TestClient(server.app) as c:
        url = f"/mcp/{auth.mcp_token()}"
        _rpc(c, url, "initialize", {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}})
        res = _rpc(c, url, "tools/call", {"name": "publish_review", "arguments": {"doc_id": rec["id"], "title": "Press round 1"}})
        out = json.loads(res["content"][0]["text"])
        assert out["by"] == "claude" and out["title"] == "Press round 1" and "/review/" in out["url"]
        assert out["checks"]["joints"][0]["clashes"] == 0 and out["checks"]["errors"] == 0
        assert c.get("/review/" + out["token"]).status_code == 200
        res = _rpc(c, url, "tools/call", {"name": "publish_review", "arguments": {"doc_id": rec["id"], "compare_version": 9}})
        assert "Cannot publish" in res["content"][0]["text"]


def test_ai_adds_a_coupler_and_a_contact():
    from opensketch import ai
    d = demo.lock_doc()
    coupler = d["mates"].pop(3)
    d.pop("contacts")
    s = ai.Session(d)
    args = {k: coupler[k] for k in ("type", "refs", "input_refs", "input", "output", "law")} | {"name": "Lever throws tongue"}
    out, clean, _ = s.apply("add_mate", {**args, "law": [[90, 8], [90, 9]]})
    assert not clean and "driver values must increase" in out
    out, clean, _ = s.apply("add_mate", {k: v for k, v in args.items() if k != "law"})
    assert not clean and "law" in out
    out, clean, _ = s.apply("add_mate", args)
    rep = json.loads(out)
    assert clean and rep["this_mate"]["state"] == "ok"
    tongue = next(c for c in s.work["components"] if c["id"] == "c3")
    assert tongue["position"][0] == pytest.approx(coupler["law"][0][1], abs=1e-4)  # the law put the tongue at rest
    out, clean, _ = s.apply("add_contact", {"a": "c2", "b": "c3", "joint": "m1", "from": 105, "to": 150, "name": "Pin on tongue"})
    assert clean and s.work["contacts"] == [{"id": "k1", "name": "Pin on tongue", "a": "c2", "b": "c3", "joint": "m1", "from": 105, "to": 150}]
    assert not s.apply("add_contact", {"a": "c2", "b": "c9"})[1]
    s.apply("delete_items", {"mates": ["m1"]})
    assert s.work["contacts"] == [{"id": "k1", "name": "Pin on tongue", "a": "c2", "b": "c3"}]  # its joint went: checked at rest
    s.apply("delete_items", {"components": ["c3"]})
    assert s.work["contacts"] == []
