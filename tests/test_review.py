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


def test_pack_mesh_round_trip():
    b = assembly.build_part(hinge_doc()["parts"]["base"])
    pk = review.pack_mesh(b["mesh"])
    q = np.frombuffer(base64.b64decode(pk["p"]), "<i2").astype(float) * pk["s"]
    src = np.concatenate([np.asarray(f["positions"], float) for f in b["mesh"]["faces"]])
    assert np.abs(q - src).max() <= pk["s"] / 2 + 1e-9  # within half a quantum (here ~2 microns)
    assert pk["tris"] == sum(len(f["indices"]) for f in b["mesh"]["faces"]) // 3


def test_hinge_travel_is_solved_not_guessed():
    r = review.build({"id": "x", "name": "Lid", "version": 2, "doc": lid_doc()})
    s = r["sliders"][0]
    assert s["moving"] == ["c2"] and len(s["frames"]) == review.STEPS and s["rest"] == 0.0
    assert s["reached"][0] == pytest.approx(0, abs=1e-3) and s["reached"][-1] == pytest.approx(110, abs=1e-3)
    M = np.array(s["frames"][-1]["c2"]).reshape(4, 4)
    assert np.allclose(M[:3, 3], [0, 20, -30], atol=1e-4)  # turns about the hinge axis, does not slide
    ang = math.degrees(math.acos(np.clip(M[:3, 1] @ [0, 1, 0], -1, 1)))
    assert ang == pytest.approx(110, abs=0.05)
    j = r["checks"]["joints"][0]
    assert j["clashes"] == [] and j["unreached"] == [] and not r["checks"]["errors"]


def test_press_stops_and_a_clash_in_the_travel():
    d = demo.press_doc()
    r = review.build({"id": "x", "name": "Press", "version": 1, "doc": d})
    j = r["checks"]["joints"][0]
    assert r["sliders"][0]["moving"] == ["c8"]  # columns, crown and cylinder stay put (solver noise ignored)
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
    assert len(r["old"]) == 1 and r["changes"] == [{"version": 6, "by": "claude", "summary": "Thicker platen"}]
    # the mate followed the thicker platen's top face: travel is still measured as 110 to 300
    assert r["checks"]["joints"][0]["reached"] == [pytest.approx(110, abs=1e-3), pytest.approx(300, abs=1e-3)]


def test_part_review_and_page():
    from tests.test_geometry import rect_sketch
    part = {"name": "Block", "features": [rect_sketch("s1", {"ref": "Front Plane"}, 0, 0, 40, 20),
                                          {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10}]}
    r = review.build({"id": "x", "name": "Block", "version": 1, "doc": part}, title="Block <b>review</b>")
    assert r["kind"] == "part" and r["sliders"] == [] and len(r["components"]) == 1
    html = review.page(r)
    assert "<title>Block &lt;b&gt;review&lt;/b&gt;</title>" in html and "{{DATA}}" not in html
    blob = html.split('<script id="review-data" type="application/json">')[1].split("</script>")[0]
    assert json.loads(blob)["title"] == "Block <b>review</b>"  # data stays JSON; the page sets it as text
    with pytest.raises(review.ReviewError):
        review.build({"id": "x", "name": "Empty", "version": 1, "doc": {"type": "assembly", "parts": {}, "components": [], "mates": []}})


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
        assert page.headers["x-robots-tag"].startswith("noindex") and "Lid opening 90." in page.text
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
