"""The SOLIDWORKS link (swbridge.py + sw_tools.py) end to end, with a fake add-in in place of SOLIDWORKS.

A real uvicorn server; the fake add-in long-polls it exactly as the C# add-in does (hello, next, file, result,
blob), and a real MCP JSON-RPC client calls the sw_ tools. What the fake add-in receives is checked (solved
sketch coordinates, mate arguments, blobs), and what Claude gets back (topology and measures from the STEP the
fake sends, cached by stamp; previews; exports; interference)."""

import base64
import json
import socket
import tempfile
import threading
import time
from pathlib import Path

import httpx
import pytest

from opensketch import auth, server, swbridge


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    swbridge.reset_for_tests()
    from opensketch import sw_tools
    sw_tools._cache.clear()
    yield tmp_path
    swbridge.reset_for_tests()


def _free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


@pytest.fixture()
def base(monkeypatch):
    import uvicorn
    port = _free_port()
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", f"http://127.0.0.1:{port}")
    srv = uvicorn.Server(uvicorn.Config(server.app, host="127.0.0.1", port=port, log_level="error"))
    th = threading.Thread(target=srv.run, daemon=True)
    th.start()
    url = f"http://127.0.0.1:{port}"
    for _ in range(100):
        try:
            httpx.get(url + "/api/version", timeout=1)
            break
        except httpx.HTTPError:
            time.sleep(0.05)
    yield url
    srv.should_exit = True
    th.join(5)


def _step(shape) -> bytes:
    from build123d import export_step
    with tempfile.TemporaryDirectory() as tmp:
        p = Path(tmp) / "b.step"
        export_step(shape, str(p))
        return p.read_bytes()


def _box_step(x=40, y=20, z=10):
    from build123d import Box, Location
    return _step(Box(x, y, z).locate(Location((x / 2, y / 2, z / 2))))


class FakeAddin:
    """Answers commands the way the C# add-in does, from canned geometry."""

    def __init__(self, base: str, key: str, version: str = "0.10.0"):
        self.base, self.key, self.version = base, key, version
        self.h = {"Authorization": f"Bearer {key}"}
        self.got: list[dict] = []
        self.stamp = 3
        self.stop = False
        self.gone = None
        r = httpx.post(base + "/mcp/sw/hello", json={"client": "addin", "version": self.version, "sw_version": "30.5.0",
                                                     "machine": "TESTPC", "protocol": 1}, headers=self.h)
        assert r.status_code == 200, r.text
        self.session = r.json()["session"]
        self.th = threading.Thread(target=self.loop, daemon=True)
        self.th.start()

    def loop(self):
        with httpx.Client(timeout=40) as c:
            while not self.stop:
                try:
                    r = c.get(self.base + "/mcp/sw/next", params={"session": self.session, "wait": 2}, headers=self.h)
                except httpx.HTTPError:
                    return  # the test server stopped
                if r.status_code == 409:
                    self.gone = r.json()["error"]
                    return
                if r.status_code == 204:
                    continue
                cmd = r.json()
                self.got.append(cmd)
                try:
                    ok, res, err = True, self.handle(c, cmd), None
                except Exception as exc:  # what the C# add-in does with an exception
                    ok, res, err = False, {}, f"{type(exc).__name__}: {exc}"
                c.post(self.base + "/mcp/sw/result", json={"session": self.session, "id": cmd["id"], "ok": ok,
                                                           "result": res, "error": err}, headers=self.h)

    def upload(self, c, cmd, name, raw):
        r = c.post(self.base + "/mcp/sw/file", params={"session": self.session, "id": cmd["id"], "name": name},
                   content=raw, headers=self.h)
        assert r.status_code == 200, r.text

    def handle(self, c, cmd):
        op, a = cmd["op"], cmd["args"]
        if op == "status":
            return {"sw_version": "30.5.0", "docs": [{"doc": "C:\\OS\\Box.SLDPRT", "title": "Box", "kind": "part", "active": True}]}
        if op == "add_features":
            return {"features": [{"id": f.get("id"), "name": f.get("name") or "Feature", "state": "ok"} for f in a["features"]]}
        if op == "geometry":
            have = a.get("have") or {}
            if a.get("doc") == "Asm":
                parts = {}
                for key, (x, y, z) in {"C:\\OS\\A.SLDPRT": (40, 20, 10), "C:\\OS\\B.SLDPRT": (10, 10, 10)}.items():
                    parts[key] = {"stamp": 1, "title": key.split("\\")[-1][:-7]}
                    if have.get(key) != 1:
                        name = parts[key]["title"] + ".step"
                        self.upload(c, cmd, name, _box_step(x, y, z))
                        parts[key]["file"] = name
                # B-1 sits 5 mm into A-1 (overlap 5 x 10 x 5 = 250 mm3), turned 90 deg about Z
                rz = [0, -1, 0, 1, 0, 0, 0, 0, 1]
                return {"kind": "assembly", "title": "Asm", "parts": parts, "components": [
                    {"name": "A-1", "key": "C:\\OS\\A.SLDPRT", "matrix": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]},
                    {"name": "B-1", "key": "C:\\OS\\B.SLDPRT", "matrix": rz + [45, 5, 5]}]}
            key = "C:\\OS\\Box.SLDPRT"
            part = {"stamp": self.stamp, "title": "Box"}
            if have.get(key) != self.stamp:
                self.upload(c, cmd, "Box.step", _box_step())
                part["file"] = "Box.step"
            return {"kind": "part", "title": "Box", "key": key, "parts": {key: part}}
        if op == "export":
            self.upload(c, cmd, "Box.step", _box_step())
            return {"file": "Box.step", "title": "Box", "format": a["format"]}
        if op == "import":
            r = c.get(self.base + cmd["blobs"]["file"], headers=self.h)
            assert r.status_code == 200
            return {"doc": "C:\\OS\\" + a["filename"].rsplit(".", 1)[0] + ".SLDPRT", "bytes": len(r.content),
                    "head": r.content[:20].decode("latin-1")}
        if op == "read_drawing":
            return {"doc": a.get("doc"), "views": [{"name": "Drawing View1", "outline_mm": [20, 80, 120, 160]}]}
        if op == "edit_drawing":
            return {"results": [dict(x, ok=True) for x in a["actions"]]}
        if op == "create_drawing":
            return {"doc": "C:\\OS\\Box.SLDDRW", "kind": "drawing", "args": a}
        if op in ("add_mate", "batch", "insert_component", "read", "set_parameter"):
            return {"echo": a}
        raise ValueError(f"unknown op {op}")


def _mcp(base, name, args):
    url = f"{base}/mcp/{auth.mcp_token()}"
    r = httpx.post(url, json={"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": name, "arguments": args}},
                   headers={"Accept": "application/json, text/event-stream"}, timeout=120)
    assert r.status_code == 200, r.text
    res = r.json()["result"]
    return res, json.loads(res["content"][0]["text"])


RECT = {"id": "s1", "type": "sketch", "name": "Sketch1", "plane": {"ref": "Front Plane"},
        "entities": [{"id": "p1", "type": "point", "x": 0, "y": 0}, {"id": "p2", "type": "point", "x": 38, "y": 1},
                     {"id": "p3", "type": "point", "x": 41, "y": 19}, {"id": "p4", "type": "point", "x": 0, "y": 22},
                     {"id": "l1", "type": "line", "p1": "p1", "p2": "p2"}, {"id": "l2", "type": "line", "p1": "p2", "p2": "p3"},
                     {"id": "l3", "type": "line", "p1": "p3", "p2": "p4"}, {"id": "l4", "type": "line", "p1": "p4", "p2": "p1"}],
        "constraints": [{"id": "k0", "type": "coincident", "refs": ["p1", "origin"]},
                        {"id": "k1", "type": "horizontal", "refs": ["l1"]}, {"id": "k2", "type": "horizontal", "refs": ["l3"]},
                        {"id": "k3", "type": "vertical", "refs": ["l2"]}, {"id": "k4", "type": "vertical", "refs": ["l4"]},
                        {"id": "D1", "type": "distance", "refs": ["l1"], "value": 40, "name": "D1"},
                        {"id": "D2", "type": "distance", "refs": ["l2"], "value": 20, "name": "D2"}]}


def test_not_connected_and_bad_key(base):
    res, out = _mcp(base, "sw_status", {})
    assert out["connected"] is False and "Connect to Claude" in out["how"]
    res, out = _mcp(base, "sw_get_document", {})
    assert res["isError"] and "not connected" in out["error"]
    assert httpx.post(base + "/mcp/sw/hello", json={}, headers={"Authorization": "Bearer oss_" + "0" * 40}).status_code == 401
    assert httpx.get(base + "/mcp/sw/next", headers={}).status_code == 401
    assert httpx.get(base + "/api/sw").json()["key"].startswith("oss_")


def test_a_renewed_key_says_why_even_when_the_poll_races_it(base):
    old = swbridge.key_for(None)
    h = {"Authorization": f"Bearer {old}"}
    sid = httpx.post(base + "/mcp/sw/hello", json={"client": "test"}, headers=h).json()["session"]
    swbridge.drop("local", "A new SOLIDWORKS key was made; connect again with it.")
    # a poll that passed the key check just before the key changed lands on no session: closed, not "restarted"
    r = httpx.get(base + "/mcp/sw/next", params={"session": sid, "wait": 0}, headers=h)
    assert r.status_code == 409 and r.json()["reason"] == "closed" and "new SOLIDWORKS key" in r.json()["error"]
    swbridge.new_key(None)
    r = httpx.post(base + "/mcp/sw/hello", json={}, headers=h)
    assert r.status_code == 401 and "new SOLIDWORKS key was made" in r.json()["detail"]
    # the new key connects, and a later server restart reads as a restart again
    h2 = {"Authorization": f"Bearer {swbridge.key_for(None)}"}
    sid2 = httpx.post(base + "/mcp/sw/hello", json={}, headers=h2).json()["session"]
    swbridge._sessions.clear()
    r = httpx.get(base + "/mcp/sw/next", params={"session": sid2, "wait": 0}, headers=h2)
    assert r.status_code == 409 and r.json()["reason"] == "restarted"


@pytest.fixture()
def fake(base):
    f = FakeAddin(base, swbridge.key_for(None))
    yield f
    f.stop = True


def test_round_trip_through_a_fake_addin(base, fake):
    res, out = _mcp(base, "sw_status", {})
    assert out["connected"] and out["machine"] == "TESTPC" and out["docs"][0]["title"] == "Box"

    # features: checked and solved here, SOLIDWORKS gets exact coordinates
    res, out = _mcp(base, "sw_add_features", {"features": [RECT, {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10}],
                                              "doc": "C:\\OS\\Box.SLDPRT"})
    assert not res.get("isError"), out
    sent = [c for c in fake.got if c["op"] == "add_features"][-1]["args"]
    pts = {e["id"]: (round(e["x"], 6), round(e["y"], 6)) for e in sent["features"][0]["entities"] if e["type"] == "point"}
    assert pts == {"p1": (0, 0), "p2": (40, 0), "p3": (40, 20), "p4": (0, 20)}
    assert out["sketch_solver"]["s1"]["status"] == "fully"
    ex = sent["features"][1]["expect"]   # OpenSketch's own build of the extrude on SOLIDWORKS' body (the 40x20x10 box)
    assert ex["dv"] == 0 and ex["range"] == [0, 10] and ex["bbox"] == [[0, 0, 0], [40, 20, 10]]

    # input problems never reach SOLIDWORKS
    n = len(fake.got)
    res, out = _mcp(base, "sw_add_features", {"features": [{"id": "x", "type": "frobnicate"}]})
    assert res["isError"] and "unknown feature type" in out["input_problems"][0] and len(fake.got) == n
    over = json.loads(json.dumps(RECT))
    over["constraints"].append({"id": "D3", "type": "distance", "refs": ["l3"], "value": 41})
    res, out = _mcp(base, "sw_add_features", {"features": [over]})
    assert res["isError"] and "over defined" in out["input_problems"][0] and len(fake.got) == n

    # geometry from the STEP SOLIDWORKS sends, re-sent only when the stamp changes
    res, out = _mcp(base, "sw_body_topology", {"kind": "faces"})
    assert out["faces_total"] == 6 and {round(f["area"]) for f in out["faces"]} == {800, 400, 200}
    top = next(f for f in out["faces"] if f["normal"] == [0, 0, 1])
    files_before = sum(1 for c in fake.got if c["op"] == "geometry")
    res, out = _mcp(base, "sw_measure_items", {"a": {"face": top["ref"]}})
    assert abs(out["a"]["area"] - 800) < 1e-6, out
    geo = [c for c in fake.got if c["op"] == "geometry"]
    assert len(geo) == files_before + 1 and geo[-1]["args"]["have"] == {"C:\\OS\\Box.SLDPRT": 3}

    res, out = _mcp(base, "sw_preview", {"view": "isometric", "width": 320, "height": 240})
    assert res["content"][1]["type"] == "image" and base64.b64decode(res["content"][1]["data"])[:8] == b"\x89PNG\r\n\x1a\n"

    res, out = _mcp(base, "sw_export", {"format": "step"})
    assert out["format"] == "step" and httpx.get(out["download_url"]).content.startswith(b"ISO-10303-21")

    res, out = _mcp(base, "sw_import", {"filename": "plate.step", "data": base64.b64encode(_box_step()).decode()})
    assert out["doc"].endswith("plate.SLDPRT") and out["head"].startswith("ISO-10303-21")

    # assembly geometry: components placed by SOLIDWORKS' matrices
    res, out = _mcp(base, "sw_check_interference", {"doc": "Asm"})
    assert out["checked"] == 2 and abs(out["interferences"][0]["volume_mm3"] - 250) < 1e-3, out
    res, out = _mcp(base, "sw_find_mate_candidates", {"doc": "Asm"})
    assert all(r["component"] in ("A-1", "B-1") for c in out["candidates"] for r in c["refs"])

    res, out = _mcp(base, "sw_add_mate", {"type": "distance", "value": 5, "refs": [{"component": "A-1", "ref": "Top Plane"},
                                                                                  {"component": "B-1", "ref": "Top Plane"}]})
    assert out["echo"]["mate"] == {"type": "distance", "value": 5, "refs": [{"component": "A-1", "ref": "Top Plane"},
                                                                           {"component": "B-1", "ref": "Top Plane"}]}
    res, out = _mcp(base, "sw_batch", {"doc": "C:\\OS\\Box.SLDPRT", "steps": [
        {"tool": "sw_add_features", "args": {"features": [RECT]}},
        {"tool": "sw_set_parameter", "args": {"name": "wall", "expression": "2"}}]})
    steps = out["echo"]["steps"]
    assert [s["op"] for s in steps] == ["add_features", "set_parameter"] and steps[0]["args"]["doc"] == "C:\\OS\\Box.SLDPRT"
    res, out = _mcp(base, "sw_batch", {"steps": [{"tool": "sw_delete_items", "args": {}}]})
    assert res["isError"] and out["failed"]["index"] == 0

    # a new key ends the old link
    swbridge.new_key(None)
    for _ in range(50):
        if fake.gone:
            break
        time.sleep(0.1)
    assert fake.gone and "new SOLIDWORKS key" in fake.gone
    res, out = _mcp(base, "sw_status", {})
    assert out["connected"] is False


def test_drawings_are_checked_here_and_made_by_the_addin(base, fake):
    res, out = _mcp(base, "sw_create_drawing", {"doc": "C:\\OS\\Box.SLDPRT", "sheet": "A2", "projection": "first",
                                                "views": ["front", "isometric", "front"], "scale": " 1 : 2.5 ",
                                                "properties": {"Title": "Box", "DrawingNo": "KV-1"}})
    assert not res.get("isError"), out
    sent = [c for c in fake.got if c["op"] == "create_drawing"][-1]["args"]
    from opensketch.sw_tools import DEFAULT_NOTES
    assert sent == {"doc": "C:\\OS\\Box.SLDPRT", "sheet": "A2", "projection": "first", "views": ["front", "isometric"],
                    "scale": [1.0, 2.5], "dimensions": True, "properties": {"Title": "Box", "DrawingNo": "KV-1"},
                    "notes": DEFAULT_NOTES, "centre_marks": True, "overwrite": False}
    res, out = _mcp(base, "sw_create_drawing", {"notes": [], "overwrite": True, "centre_marks": False})
    sent = [c for c in fake.got if c["op"] == "create_drawing"][-1]["args"]
    assert sent == {"sheet": "A3", "projection": "third", "dimensions": True, "centre_marks": False, "overwrite": True}, \
        "defaults: A3, third angle, standard views; no notes when asked for none"
    assert any("ISO 2768" in n for n in DEFAULT_NOTES) and any("MILLIMETRES" in n for n in DEFAULT_NOTES)

    # bad input never reaches SOLIDWORKS
    n = len(fake.got)
    for bad in ({"scale": "half"}, {"scale": "0:1"}, {"views": []}, {"properties": {"$PRP": "x"}},
                {"properties": {"Title": "x" * 201}}, {"properties": {f"F{i}": "x" for i in range(31)}},
                {"notes": ["x" * 91]}, {"notes": [f"{i}." for i in range(13)]}):
        res, out = _mcp(base, "sw_create_drawing", bad)
        assert res["isError"], bad
    # a sheet outside the list is refused by the tool's schema (a plain-text error)
    r = httpx.post(f"{base}/mcp/{auth.mcp_token()}", json={"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {
        "name": "sw_create_drawing", "arguments": {"sheet": "Letter"}}}, headers={"Accept": "application/json, text/event-stream"}, timeout=60)
    assert r.json()["result"]["isError"]
    assert len(fake.got) == n

    # a drawing's own formats come back as downloads named for what they are
    for fmt in ("dxf", "dwg", "pdf", "slddrw"):
        res, out = _mcp(base, "sw_export", {"format": fmt, "doc": "C:\\OS\\Box.SLDDRW"})
        assert not res.get("isError"), out
        assert out["filename"].endswith("." + fmt) and httpx.get(out["download_url"]).status_code == 200


def test_drawing_actions_are_checked_here_then_run_in_solidworks(base, fake):
    res, out = _mcp(base, "sw_get_drawing", {"doc": "C:\\OS\\Box.SLDDRW"})
    assert not res.get("isError") and out["views"][0]["name"] == "Drawing View1"
    acts = [{"do": "section", "view": "Drawing View1", "through": [20, 10, 5], "direction": "vertical", "label": "A", "place": [300, 150]},
            {"do": "detail", "view": "Drawing View1", "fraction": [0.2, 0.8], "radius": 10, "scale": "5:1", "label": "B", "place": [330, 90]},
            {"do": "scale", "view": "Drawing View2", "scale": "sheet"},
            {"do": "display", "view": "Drawing View4", "style": "shaded_edges"},
            {"do": "note", "text": "BREAK ALL EDGES 0.5", "at": [20, 40]},
            {"do": "bom", "view": "Drawing View1", "at": [400, 280], "type": "parts"},
            {"do": "arrange_dimensions"}]
    res, out = _mcp(base, "sw_edit_drawing", {"actions": acts})
    assert not res.get("isError"), out
    sent = [c for c in fake.got if c["op"] == "edit_drawing"][-1]["args"]["actions"]
    assert sent[1]["scale"] == [5.0, 1.0] and sent[2]["scale"] is None and sent[0]["through"] == [20, 10, 5]
    n = len(fake.got)
    for bad, why in (({"do": "frobnicate"}, "do must be one of"), ({"do": "section", "view": "V"}, "needs place"),
                     ({"do": "move", "view": "V", "to": [1]}, "to is [x, y]"), ({"do": "display", "view": "V", "style": "pink"}, "style is one of"),
                     ({"do": "detail", "view": "V", "place": [1, 2], "scale": "big"}, 'scale is "a:b"'),
                     ({"do": "note", "text": "x", "at": [1, 2], "colour": "red"}, "unknown colour"),
                     ({"do": "section", "view": "V", "place": [1, 2], "through": [1, 2]}, "through is a model point"),
                     ({"do": "properties", "set": {"$PRP": "x"}}, "set is up to 30 fields")):
        res, out = _mcp(base, "sw_edit_drawing", {"actions": [bad]})
        assert res["isError"] and why in out["input_problems"][0], (bad, out)
    res, out = _mcp(base, "sw_edit_drawing", {"actions": []})
    assert res["isError"]
    assert len(fake.got) == n, "nothing invalid reached SOLIDWORKS"


def test_an_add_in_too_old_for_drawings_is_told_how_to_update(base):
    old = FakeAddin(base, swbridge.key_for(None), version="0.1.0")
    try:
        n = len(old.got)
        res, out = _mcp(base, "sw_create_drawing", {})
        assert res["isError"] and "needs the OpenSketch add-in 0.9.1" in out["error"] and "releases/tag/addin-latest" in out["error"]
        res, out = _mcp(base, "sw_export", {"format": "dxf"})
        assert res["isError"] and "Exporting DXF needs" in out["error"]
        res, out = _mcp(base, "sw_edit_drawing", {"actions": [{"do": "arrange_dimensions"}]})
        assert res["isError"] and "Editing drawings needs the OpenSketch add-in 0.10.0" in out["error"]
        assert len(old.got) == n, "nothing was sent to the old add-in"
        res, out = _mcp(base, "sw_status", {})
        assert out["version"] == "0.1.0" and "needs the OpenSketch add-in 0.9.1" in out["update_needed"]
    finally:
        old.stop = True
    assert swbridge.version_tuple("0.10.0") > swbridge.version_tuple("0.9.0") and swbridge.version_tuple(None) == (0,)


def test_a_command_nobody_takes_times_out(base, monkeypatch):
    import asyncio
    r = httpx.post(base + "/mcp/sw/hello", json={"client": "addin"}, headers={"Authorization": f"Bearer {swbridge.key_for(None)}"})
    assert r.status_code == 200  # connected, but never polls

    async def go():
        with pytest.raises(swbridge.BridgeError, match="did not take the command"):
            await swbridge.call(None, "status", {}, timeout=0.3)
    asyncio.run(go())
    assert swbridge._sessions["local"].queue == deque_empty()


def deque_empty():
    from collections import deque
    return deque()


def test_files_for_solidworks_do_not_pile_up_in_the_server(monkeypatch):
    """Files waiting for SOLIDWORKS live in the web server's memory: none is kept when SOLIDWORKS is not connected,
    each goes when its command ends, and a person has at most a few waiting."""
    import anyio
    from opensketch import sw_tools
    raw = base64.b64encode(b"ISO-10303-21;" + b"x" * 1000).decode()
    out = anyio.run(lambda: sw_tools.sw_import(filename="a.step", data=raw))
    assert out.is_error and "not connected" in out.content[0].text and not swbridge._blobs
    ids = [swbridge.add_blob(None, b"x" * 10, f"{i}.step") for i in range(5)]
    assert set(swbridge._blobs) == set(ids[-swbridge.BLOBS_PER_PERSON:])
    other = swbridge.add_blob({"id": "u2"}, b"y", "b.step")  # someone else's are their own
    assert other in swbridge._blobs and len(swbridge._blobs) == swbridge.BLOBS_PER_PERSON + 1
    swbridge.drop_blob(other)
    assert other not in swbridge._blobs
