"""KEVOS registered computers (devicebridge.py): pairing, signed device requests, command routing, acknowledgment,
results, files, timeouts, cancellation and the security checks, with a stand-in Companion (tests/bridge_fakes.py)
in place of the C# one. Every SOLIDWORKS tool is run through a registered computer, and the self test stages run
through one against SimSW."""

from __future__ import annotations

import base64
import json
import socket
import tempfile
import threading
import time
from pathlib import Path

import anyio
import httpx
import pytest

from opensketch import auth, devicebridge as db, server, sw_tools, swbridge
from tests.bridge_fakes import FakeCompanion, Refused
from tests.mcp_reply import rpc


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    swbridge.reset_for_tests()
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
            httpx.get(url + "/healthz", timeout=1)
            break
        except httpx.HTTPError:
            time.sleep(0.05)
    yield url
    srv.should_exit = True
    th.join(5)


@pytest.fixture()
def companions():
    made: list[FakeCompanion] = []
    yield made
    for c in made:
        c.close()


def _mcp(base, name, args):
    url = f"{base}/mcp/{auth.mcp_token()}"
    r = httpx.post(url, json={"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": name, "arguments": args}},
                   headers={"Accept": "application/json, text/event-stream"}, timeout=180)
    assert r.status_code == 200, r.text
    res = rpc(r)["result"]
    return res, json.loads(res["content"][0]["text"])


# ----------------------------------------------------------------------------- canned SOLIDWORKS answers

def _step(shape) -> bytes:
    from build123d import export_step
    with tempfile.TemporaryDirectory() as tmp:
        p = Path(tmp) / "b.step"
        export_step(shape, str(p))
        return p.read_bytes()


def _box_step(x=40, y=20, z=10):
    from build123d import Box, Location
    return _step(Box(x, y, z).locate(Location((x / 2, y / 2, z / 2))))


class Canned:
    """Answers the way the C# add-in does, from canned geometry (as tests/test_swbridge.py's FakeAddin)."""

    def __init__(self):
        self.ops: list[str] = []
        self.big: bytes | None = None

    def __call__(self, op, a, files_in, out):
        self.ops.append(op)
        if op == "status":
            return {"sw_version": "30.5.0", "docs": [{"doc": "C:\\OS\\Box.SLDPRT", "title": "Box", "kind": "part", "active": True}]}
        if op == "geometry":
            have = a.get("have") or {}
            if a.get("doc") == "Asm":
                parts = {}
                for key, (x, y, z) in {"C:\\OS\\A.SLDPRT": (40, 20, 10), "C:\\OS\\B.SLDPRT": (10, 10, 10)}.items():
                    parts[key] = {"stamp": 1, "title": key.split("\\")[-1][:-7]}
                    if have.get(key) != 1:
                        out[parts[key]["title"] + ".step"] = _box_step(x, y, z)
                        parts[key]["file"] = parts[key]["title"] + ".step"
                rz = [0, -1, 0, 1, 0, 0, 0, 0, 1]
                return {"kind": "assembly", "title": "Asm", "parts": parts, "components": [
                    {"name": "A-1", "key": "C:\\OS\\A.SLDPRT", "matrix": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]},
                    {"name": "B-1", "key": "C:\\OS\\B.SLDPRT", "matrix": rz + [45, 5, 5]}]}
            key = "C:\\OS\\Box.SLDPRT"
            part = {"stamp": 3, "title": "Box"}
            if have.get(key) != 3:
                out["Box.step"] = _box_step()
                part["file"] = "Box.step"
            return {"kind": "part", "title": "Box", "key": key, "parts": {key: part}}
        if op == "export":
            out["Box.step"] = self.big if self.big is not None else _box_step()
            return {"file": "Box.step", "title": "Box", "format": a["format"]}
        if op == "screenshot":
            from PIL import Image
            import io
            buf = io.BytesIO()
            Image.new("RGB", (64, 48), (90, 100, 200)).save(buf, "PNG")
            out["view.png"] = buf.getvalue()
            return {"file": "view.png", "title": "Box", "view": a.get("view")}
        if op == "import":
            raw = files_in["file"]
            return {"doc": "C:\\OS\\" + a["filename"].rsplit(".", 1)[0] + ".SLDPRT", "bytes": len(raw),
                    "head": raw[:20].decode("latin-1"), "saved": True, "kind": "part"}
        if op == "read_drawing":
            return {"doc": a.get("doc"), "views": [{"name": "Drawing View1", "outline_mm": [20, 80, 120, 160]}]}
        if op == "edit_drawing":
            return {"results": [dict(x, ok=True) for x in a["actions"]]}
        if op == "create_drawing":
            return {"doc": "C:\\OS\\Box.SLDDRW", "kind": "drawing", "args": a}
        if op == "add_features":
            return {"features": [{"id": f.get("id"), "name": f.get("name") or "Feature", "state": "ok"} for f in a["features"]]}
        if op == "delete" and not a.get("dry_run"):
            raise Refused("The user declined to delete Boss-Extrude1 in SOLIDWORKS.", code="APPROVAL_DENIED")
        if op in ("add_mate", "batch", "insert_component", "read", "set_parameter", "set_equation", "delete", "undo",
                  "create_document", "open_document", "save"):
            return {"echo": a, "op": op}
        raise ValueError(f"unknown op {op}")


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
EXT = {"id": "e1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "depth": 10}

# every SOLIDWORKS tool, with arguments, and what its result must show (tool -> (args, check(result) -> bool))
TOOLS = {
    "sw_status": ({}, lambda o: o["connected"] and o["via"] == "companion" and o["device"] == "TESTPC" and o["docs"]),
    "sw_list_devices": ({}, lambda o: o["devices"][0]["name"] == "TESTPC" and o["devices"][0]["online"]
                        and o["devices"][0]["solidworks"][0]["solidworks"] == "SOLIDWORKS 2022"),
    "sw_create_document": ({"name": "Plate"}, lambda o: o["op"] == "create_document" and o["echo"]["name"] == "Plate"),
    "sw_open_document": ({"path": "C:\\OS\\Box.SLDPRT"}, lambda o: o["op"] == "open_document"),
    "sw_save": ({"doc": "C:\\OS\\Box.SLDPRT"}, lambda o: o["op"] == "save"),
    "sw_get_document": ({"doc": "C:\\OS\\Box.SLDPRT", "sketches": True}, lambda o: o["echo"]["sketches"] is True),
    "sw_add_features": ({"doc": "C:\\OS\\Box.SLDPRT", "features": [RECT, EXT]},
                        lambda o: [f["state"] for f in o["features"]] == ["ok", "ok"] and "error" not in o),
    "sw_batch": ({"doc": "C:\\OS\\Box.SLDPRT", "steps": [{"tool": "sw_set_parameter", "args": {"name": "t", "expression": "5"}}]},
                 lambda o: o["op"] == "batch"),
    "sw_delete_items": ({"doc": "C:\\OS\\Box.SLDPRT", "features": ["Boss-Extrude1"], "dry_run": True}, lambda o: o["echo"]["dry_run"]),
    "sw_undo": ({"doc": "C:\\OS\\Box.SLDPRT"}, lambda o: o["op"] == "undo"),
    "sw_set_parameter": ({"name": "wall", "expression": "2.5"}, lambda o: o["echo"]["name"] == "wall"),
    "sw_set_equation": ({"target": "D1@Sketch1", "expression": "wall * 2"}, lambda o: o["op"] == "set_equation"),
    "sw_insert_component": ({"part": "C:\\OS\\A.SLDPRT", "doc": "Asm"}, lambda o: o["op"] == "insert_component"),
    "sw_add_mate": ({"type": "coincident", "doc": "Asm", "refs": [{"component": "A-1", "ref": "Top Plane"}, {"ref": "Top Plane"}]},
                    lambda o: o["echo"]["mate"]["type"] == "coincident"),
    "sw_body_topology": ({"doc": "C:\\OS\\Box.SLDPRT", "kind": "faces"}, lambda o: len(o["faces"]) == 6),
    "sw_measure_items": ({"doc": "C:\\OS\\Box.SLDPRT", "a": {"point": [0, 0, 0]}, "b": {"point": [40, 20, 10]}},
                         lambda o: abs(o["min_distance"] - (40**2 + 20**2 + 10**2) ** 0.5) < 1e-3),
    "sw_inspect_design": ({"doc": "C:\\OS\\Box.SLDPRT"}, lambda o: o["echo"]["numbers"] is True),
    "sw_preview": ({"doc": "C:\\OS\\Box.SLDPRT", "width": 200, "height": 150}, lambda o: o["width"] == 200),
    "sw_check_interference": ({"doc": "Asm"}, lambda o: abs(o["interferences"][0]["volume_mm3"] - 250) < 1),
    "sw_find_mate_candidates": ({"doc": "Asm"}, lambda o: "candidates" in o),
    "sw_create_drawing": ({"doc": "C:\\OS\\Box.SLDPRT"}, lambda o: o["kind"] == "drawing" and o["args"]["sheet"] == "A3"),
    "sw_get_drawing": ({"doc": "C:\\OS\\Box.SLDDRW"}, lambda o: o["views"][0]["name"] == "Drawing View1"),
    "sw_edit_drawing": ({"doc": "C:\\OS\\Box.SLDDRW", "actions": [{"do": "note", "text": "HELLO", "at": [20, 20]}]},
                        lambda o: o["results"][0]["ok"]),
    "sw_export": ({"doc": "C:\\OS\\Box.SLDPRT", "format": "step"}, lambda o: o["download_url"] and o["format"] == "step"),
    "sw_import": ({"filename": "part.step", "data": base64.b64encode(b"ISO-10303-21;\nHEADER;").decode()},
                  lambda o: o["bytes"] == 21 and o["head"].startswith("ISO-10303-21")),
    "sw_standard_part": ({"kind": "hex_nut", "size": "M6-1"}, lambda o: o["doc"].endswith(".SLDPRT") and o["bytes"] > 1000),
}


def test_every_sw_tool_runs_through_a_registered_computer(base, companions):
    sw = Canned()
    pc = FakeCompanion(base, sw)
    companions.append(pc)
    failures = {}
    for tool, (args, check) in TOOLS.items():
        res, out = _mcp(base, tool, args)
        try:
            ok = not res.get("isError") and check(out)
        except Exception as exc:  # noqa: BLE001 - report every tool, then fail
            ok, out = False, {"check": repr(exc), "out": out}
        if not ok:
            failures[tool] = out
    assert not failures, json.dumps(failures, indent=1)[:6000]
    # each command was signed for this computer and verified by it, none twice
    ids = [c["command_id"] for c in pc.got]
    assert len(ids) == len(set(ids)) and all(c["device_id"] == pc.device_id for c in pc.got)
    assert not pc.rejected
    # the screenshot path too
    res, out = _mcp(base, "sw_preview", {"doc": "C:\\OS\\Box.SLDPRT", "screenshot": True})
    assert not res.get("isError") and res["content"][1]["type"] == "image"
    # every command is on record with its history, and the AI app can read it
    last = pc.got[-1]["command_id"]
    res, rec = _mcp(base, "sw_command_status", {"command_id": last})
    assert rec["status"] == "succeeded" and [h["status"] for h in rec["history"]][:2] == ["queued", "delivered"]
    # the destructive path: the add-in asks the person, who says no, and the AI is told so
    res, out = _mcp(base, "sw_delete_items", {"doc": "C:\\OS\\Box.SLDPRT", "features": ["Boss-Extrude1"]})
    assert res.get("isError") and "declined" in out["error"] and out["error_code"] == "APPROVAL_DENIED"
    cmd = pc.got[-1]
    assert cmd["op"] == "delete" and cmd["risk"] == "high" and cmd["effect"] == "delete"


def test_selftest_stages_run_through_a_registered_computer(base, companions):
    from tests.test_sw_selftest import SimRefusal, SimSW
    sim = SimSW()

    def handler(op, a, files_in, out):
        try:
            res, files = getattr(sim, "op_" + op)(a)
        except SimRefusal as exc:
            raise Refused(str(exc), exc.result) from None
        out.update(files)
        return res
    companions.append(FakeCompanion(base, handler))
    for stage in ("plate", "shapes", "assembly"):
        res, out = _mcp(base, "sw_selftest", {"stage": stage})
        bad = [r for r in out["steps"] if r["result"] != "ok"]
        assert not bad and not res.get("isError"), (stage, json.dumps(bad, indent=1)[:3000])


# ----------------------------------------------------------------------------- pairing and signed requests

def test_pairing_through_the_web_page_and_device_proofs(base, companions):
    pc = FakeCompanion(base, Canned(), approve=False)
    companions.append(pc)
    code = pc.pair["user_code"]
    assert pc.pair["verification_uri_complete"].endswith("/devices/pair?code=" + code)
    r = pc.post("/v2/devices/pair/poll", {})
    assert r.status_code == 200 and r.json()["status"] == "pending"
    page = httpx.get(base + "/devices/pair", params={"code": code})
    assert page.status_code == 200 and "Add this computer" in page.text and "TESTPC" in page.text
    r = httpx.post(base + "/devices/pair", data={"code": code, "name": "Workshop PC"})
    assert r.status_code == 200 and "Workshop PC" in r.text
    r = pc.post("/v2/devices/pair/poll", {})
    out = r.json()
    assert out["status"] == "approved" and out["device_name"] == "Workshop PC" and out["gateway_jwk"]["kty"] == "EC"
    assert out["gateway_jwk"] == httpx.get(base + "/v2/keys").json()["keys"][0]  # the key it pins is the server's
    pc.kid = out["device_id"]
    good = {"v": "2.0", "type": "device.hello", "msg_id": db.ulid("msg"), "sent_at": db.iso(), "device_id": pc.kid,
            "companion_version": "1.0.0", "protocol": {"min": "2.0", "max": "2.0"}, "os": "Windows", "installations": [],
            "instances": [], "paused": False, "inflight": []}
    assert pc.post("/v2/device/hello", good).status_code == 200
    raw = json.dumps(good).encode()

    def hello_with(auth_header):
        return httpx.post(base + "/v2/device/hello", content=raw, headers={"Authorization": auth_header,
                                                                           "Content-Type": "application/json"})
    # a replayed request (same one-time id) is refused
    h = pc.proof("POST", "/v2/device/hello", raw, jti="replay-me-1234567890")
    assert hello_with(h).status_code == 200
    r = hello_with(h)
    assert r.status_code == 401 and r.json()["error"]["code"] == "REPLAY_DETECTED"
    # the body is bound to the proof
    r = httpx.post(base + "/v2/device/hello", content=raw + b" ", headers={"Authorization": pc.proof("POST", "/v2/device/hello", raw)})
    assert r.status_code == 401 and "body" in r.json()["error"]["message"]
    # so is the path
    assert hello_with(pc.proof("POST", "/v2/device/ack", raw)).status_code == 401
    # an old proof is refused (clock window)
    r = hello_with(pc.proof("POST", "/v2/device/hello", raw, iat=time.time() - 3600))
    assert r.status_code == 401 and r.json()["error"]["code"] == "TOKEN_EXPIRED"
    # another key cannot sign for this computer
    other = FakeCompanion(base, Canned(), approve=False)
    companions.append(other)
    r = hello_with(other.proof("POST", "/v2/device/hello", raw, kid=pc.kid))
    assert r.status_code == 401 and r.json()["error"]["code"] == "SIGNATURE_INVALID"
    # no proof, a Bearer token, or an unknown computer
    assert hello_with("").status_code == 401
    assert hello_with("Bearer " + auth.mcp_token()).status_code == 401
    assert hello_with(pc.proof("POST", "/v2/device/hello", raw, kid=db.ulid("dev"))).json()["error"]["code"] == "DEVICE_UNKNOWN"
    # the same key cannot be paired twice
    r = httpx.post(base + "/v2/devices/pair/start", json={"public_jwk": pc.jwk, "name": "again"})
    assert r.status_code == 400
    # a code that was denied stops working
    third = FakeCompanion(base, Canned(), approve=False)
    companions.append(third)
    httpx.post(base + "/devices/pair", data={"code": third.pair["user_code"], "decision": "deny"})
    assert third.post("/v2/devices/pair/poll", {}).status_code == 410
    assert httpx.post(base + "/v2/devices/pair/start", json={"public_jwk": {"kty": "RSA"}}).status_code == 400


def test_pairing_needs_a_signed_in_person_once_accounts_exist(base, monkeypatch):
    from opensketch import accounts
    accounts.create_owner("owner@example.com", "Owner", "a-long-password-1")
    r = httpx.get(base + "/devices/pair?code=ABCD-EFGH", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"].startswith("/login")
    assert httpx.post(base + "/devices/pair", data={"code": "ABCD-EFGH", "name": "x"}).status_code == 401
    # the device API itself needs no cookie (its proofs are the credential)
    assert httpx.get(base + "/v2/keys").status_code == 200


def test_a_removed_computer_is_cut_off_at_once(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    assert _mcp(base, "sw_get_document", {})[1]["op"] == "read"
    assert httpx.delete(base + f"/api/devices/{pc.device_id}").status_code == 200
    for _ in range(100):
        if pc.ended:
            break
        time.sleep(0.05)
    assert pc.ended and pc.ended["reason"] == "revoked"
    r = pc.post("/v2/device/hello", {"protocol": {"min": "2.0", "max": "2.0"}})
    assert r.status_code == 401 and r.json()["error"]["code"] == "DEVICE_REVOKED"
    res, out = _mcp(base, "sw_get_document", {})
    assert res.get("isError") and "not connected" in out["error"]


# ----------------------------------------------------------------------------- routing between computers

def test_several_computers_need_a_choice_and_the_default_wins(base, companions):
    a, b = FakeCompanion(base, Canned(), name="DESK"), FakeCompanion(base, Canned(), name="LAPTOP")
    companions += [a, b]
    db.set_device(None, a.device_id, default=False)
    res, st = _mcp(base, "sw_status", {})
    assert st["ambiguous"] and {d["name"] for d in st["devices"]} == {"DESK", "LAPTOP"}
    res, out = _mcp(base, "sw_get_document", {})
    assert res.get("isError") and out["error_code"] == "DEVICE_AMBIGUOUS" and "DESK" in out["error"]
    assert _mcp(base, "sw_get_document", {"device": "laptop"})[1]["op"] == "read"
    assert b.got and not a.got
    r = httpx.post(base + f"/api/devices/{a.device_id}", json={"default": True})
    assert r.status_code == 200 and r.json()["default"]
    _mcp(base, "sw_get_document", {})
    assert a.got
    res, out = _mcp(base, "sw_get_document", {"device": "nope"})
    assert out["error_code"] == "DEVICE_UNKNOWN" and "LAPTOP" in out["error"]
    # only one of them has SOLIDWORKS open: that one is chosen without asking
    a.set_instances([])
    db.set_device(None, a.device_id, default=False)
    before = len(b.got)
    _mcp(base, "sw_get_document", {})
    assert len(b.got) == before + 1


def test_solidworks_closed_and_computer_offline(base, companions, monkeypatch):
    pc = FakeCompanion(base, Canned(), instances=0)
    companions.append(pc)
    res, st = _mcp(base, "sw_status", {})
    assert st["connected"] and "not running" in st["note"]
    res, out = _mcp(base, "sw_get_document", {})
    assert res.get("isError") and out["error_code"] == "INSTANCE_NOT_RUNNING" and "Open SOLIDWORKS" in out["error"]
    pc.close()
    monkeypatch.setattr(db, "ONLINE", 0.5)
    time.sleep(0.6)
    res, out = _mcp(base, "sw_get_document", {})
    assert res.get("isError") and out["error_code"] == "DEVICE_OFFLINE" and "TESTPC" in out["error"]
    res, out = _mcp(base, "sw_get_document", {"device": "TESTPC"})
    assert out["error_code"] == "DEVICE_OFFLINE"


# ----------------------------------------------------------------------------- delivery, timeouts, cancel

def _call(op, args, timeout, device=None):
    return anyio.run(lambda: swbridge.call(None, op, args, timeout, device=device))


def test_a_command_nobody_acknowledges_is_withdrawn(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    pc.ack = False
    with pytest.raises(swbridge.BridgeError) as e:
        _call("status", {}, 1.5)
    assert e.value.code == "NOT_DELIVERED"
    cid = pc.got[0]["command_id"]
    assert db.command_record(None, cid)["status"] == "expired"
    for _ in range(60):  # the computer is told to drop it
        if pc.cancels:
            break
        time.sleep(0.05)
    assert pc.cancels and pc.cancels[0]["command_id"] == cid and pc.cancels[0]["reason"] == "expired"


def test_a_slow_command_finishes_late_and_its_result_is_kept(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    pc.hold = threading.Event()
    with pytest.raises(swbridge.BridgeError) as e:
        _call("read", {"doc": "C:\\OS\\Box.SLDPRT"}, 1.0)
    assert e.value.code == "STILL_RUNNING" and "sw_command_status" in str(e.value)
    cid = pc.got[0]["command_id"]
    assert db.command_record(None, cid)["status"] == "running"
    pc.hold.set()
    for _ in range(100):
        rec = db.command_record(None, cid)
        if rec["status"] == "succeeded":
            break
        time.sleep(0.05)
    assert rec["status"] == "succeeded" and rec["result"]["op"] == "read"
    assert cid not in db._pending  # nothing waits for it any more


def test_cancelling_a_running_command(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    pc.hold = threading.Event()
    out = {}

    def run():
        try:
            out["r"] = _call("batch", {"steps": []}, 20)
        except swbridge.BridgeError as exc:
            out["e"] = exc
    th = threading.Thread(target=run)
    th.start()
    for _ in range(100):
        if pc.got:
            break
        time.sleep(0.05)
    cid = pc.got[0]["command_id"]
    for _ in range(100):
        if db.command_record(None, cid)["status"] == "running":
            break
        time.sleep(0.05)
    assert db.cancel(None, cid)["cancel_requested"]
    for _ in range(100):
        if pc.cancels:
            break
        time.sleep(0.05)
    pc.hold.set()
    th.join(20)
    body, _ = out["r"]
    assert body["ok"] is False and body["code"] == "CANCELLED"
    assert db.command_record(None, cid)["status"] == "cancelled"
    assert db.cancel(None, cid)["note"].startswith("It had already finished")


def test_credentials_never_travel_in_commands(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    for args in ({"doc": "x", "password": "hunter2"}, {"notes": ["Bearer abcdefghijklmnopqrstuvwxyz0123"]},
                 {"doc": swbridge.key_for(None)}, {"x": {"api_key": "1"}}, {"doc": "/mcp/" + auth.mcp_token()}):
        with pytest.raises(swbridge.BridgeError) as e:
            _call("read", args, 5)
        assert e.value.code == "INPUT_FORBIDDEN_FIELD"
    assert not pc.got
    with pytest.raises(swbridge.BridgeError) as e:
        _call("format_disk", {}, 5)
    assert e.value.code == "UNKNOWN_OP"


def test_commands_are_signed_bound_to_one_computer_and_expire(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    _call("status", {}, 10)
    cmd = pc.got[0]
    assert cmd["device_id"] == pc.device_id and len(cmd["nonce"]) == 22
    assert db.parse_iso(cmd["expires_at"]) - db.parse_iso(cmd["created_at"]) <= db.MAX_START_WINDOW
    assert cmd["issued_by"]["user_id"].startswith("usr_") and "token" not in json.dumps(cmd["issued_by"]).lower()
    jws = db.sign_message(cmd, "kevos-command")
    h, p, _ = jws.split(".")
    forged = json.loads(db.b64u_dec(p))
    forged["op"] = "delete"
    with pytest.raises(ValueError):
        db.jws_verify(h + "." + db.b64u(json.dumps(forged).encode()) + "." + jws.split(".")[2], pc.gw)
    # a result for other parameters than the command's is refused
    r = pc.post("/v2/device/result", {"command_id": cmd["command_id"], "status": "succeeded", "params_sha256": "sha256:" + "1" * 64,
                                      "result": {}})
    assert r.status_code in (400, 200)  # 200: already stored (duplicate); never overwritten
    assert db.command_record(None, cmd["command_id"])["status"] == "succeeded"


def test_big_files_come_up_in_chunks(base, companions, monkeypatch):
    monkeypatch.setattr(db, "CHUNK_BYTES", 1024 * 1024)
    sw = Canned()
    sw.big = bytes(range(256)) * (10 * 1024)  # 2.5 MiB -> 3 chunks
    pc = FakeCompanion(base, sw)
    companions.append(pc)
    res, out = _mcp(base, "sw_export", {"doc": "C:\\OS\\Box.SLDPRT", "format": "step"})
    assert not res.get("isError"), out
    got = httpx.get(out["download_url"]).content
    assert got == sw.big


def test_a_restart_marks_unfinished_commands_unknown(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    pc.ack = False
    with pytest.raises(swbridge.BridgeError):
        _call("status", {}, 0.5)
    cid = pc.got[0]["command_id"]
    db._exec("UPDATE commands SET status='running' WHERE id=?", (cid,))
    db._db_ready.clear()  # as a new server process would open it
    db._db().close()
    assert db.command_record(None, cid)["status"] == "unknown"


def test_the_v1_add_in_link_still_works_beside_registered_computers(base):
    from tests.test_swbridge import FakeAddin
    f = FakeAddin(base, swbridge.key_for(None))
    try:
        res, st = _mcp(base, "sw_status", {})
        assert st["connected"] and st.get("via") != "companion" and st["machine"] == "TESTPC"
    finally:
        f.stop = True


def test_update_manifest_is_signed_and_only_for_registered_computers(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    assert pc.get("/v2/bridge/update.json").status_code == 404           # nothing published
    rel = {"version": "0.12.0", "msi_url": "https://example.com/KEVOS-Bridge-0.12.0.msi", "sha256": "sha256:" + "ab" * 32,
           "size": 1234, "signer_thumbprints": ["0123456789ABCDEF"], "notes": "Fixes."}
    (db.store.data_dir() / "bridge-release.json").write_text(json.dumps(rel))
    r = pc.get("/v2/bridge/update.json")
    header, payload = db.jws_verify(r.json()["manifest_jws"], pc.gw)    # the key the companion pinned at pairing
    m = json.loads(payload)
    assert header["typ"] == "kevos-update" and m["version"] == "0.12.0" and m["sha256"] == rel["sha256"]
    assert httpx.get(base + "/v2/bridge/update.json").status_code == 401  # not for anyone else


def test_an_open_server_takes_pairing_only_from_its_own_machine():
    from fastapi.testclient import TestClient
    remote = TestClient(server.app, client=("203.0.113.9", 50000))
    jwk = db.jwk_of(__import__("cryptography.hazmat.primitives.asymmetric.ec", fromlist=["ec"]).generate_private_key(
        __import__("cryptography.hazmat.primitives.asymmetric.ec", fromlist=["ec"]).SECP256R1()).public_key())
    r = remote.post("/v2/devices/pair/start", json={"public_jwk": jwk, "name": "x"})
    assert r.status_code == 403 and "password" in r.json()["error"]["message"]
    assert remote.post("/devices/pair", data={"code": "ABCD-EFGH", "name": "x"}).status_code == 403
    local = TestClient(server.app, client=("127.0.0.1", 50000))
    assert local.post("/v2/devices/pair/start", json={"public_jwk": jwk, "name": "x"}).status_code == 200


@pytest.fixture()
def cad_base(monkeypatch):
    """The server as bizomat.ai/cad runs it: its public address carries the path /cad."""
    import uvicorn
    port = _free_port()
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", f"http://127.0.0.1:{port}/cad")
    srv = uvicorn.Server(uvicorn.Config(server.app, host="127.0.0.1", port=port, log_level="error"))
    th = threading.Thread(target=srv.run, daemon=True)
    th.start()
    url = f"http://127.0.0.1:{port}"
    for _ in range(100):
        try:
            httpx.get(url + "/healthz", timeout=1)
            break
        except httpx.HTTPError:
            time.sleep(0.05)
    yield url + "/cad"
    srv.should_exit = True
    th.join(5)


def test_a_computer_paired_under_a_path_works_as_on_a_host_of_its_own(cad_base, companions):
    """The Companion signs each request's path relative to the address it paired with (https://bizomat.ai/cad), as it
    always has; the server checks that path below the prefix. Pairing, the long poll, a command and the update
    manifest all work under /cad."""
    pc = FakeCompanion(cad_base, Canned())
    companions.append(pc)
    assert pc.pair["verification_uri"] == cad_base + "/devices/pair"
    assert _mcp(cad_base, "sw_get_document", {})[1]["op"] == "read"
    r = pc.post("/v2/device/hello", {"protocol": {"min": "2.0", "max": "2.0"}})
    assert r.status_code == 200, r.text
    assert pc.get("/v2/bridge/update.json").status_code == 404  # reached the route: nothing published
    bad = pc.http.post(cad_base + "/v2/device/hello", content=b"{}",
                       headers={"Authorization": pc.proof("POST", "/cad/v2/device/hello", b"{}")})
    assert bad.status_code == 401  # a proof is for the path below the address, never the prefixed one


@pytest.mark.parametrize("where", ["base", "cad_base"])
def test_a_tool_call_keeps_its_connection_alive_while_solidworks_works(where, request, companions, monkeypatch):
    """An answer is an event stream: its headers go at once and a comment at each keep-alive interval (15 s; 0.2 s here)
    until SOLIDWORKS answers, so a proxy that ends a silent response (Cloudflare: 100 s; the BIZOMAT platform's proxy:
    620 s) keeps a tool that runs for minutes. Under /cad too: the prefix's HTML rewriting never holds a stream back."""
    from sse_starlette.sse import EventSourceResponse
    monkeypatch.setattr(EventSourceResponse, "DEFAULT_PING_INTERVAL", 0.2)
    at = request.getfixturevalue(where)
    pc = FakeCompanion(at, Canned())
    companions.append(pc)
    pc.hold = threading.Event()  # SOLIDWORKS is busy until the test lets it answer
    body = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "sw_get_document", "arguments": {}}}
    with httpx.stream("POST", f"{at}/mcp/{auth.mcp_token()}", json=body, timeout=30,
                      headers={"Accept": "application/json, text/event-stream"}) as r:
        assert r.status_code == 200 and r.headers["content-type"].startswith("text/event-stream")
        lines = r.iter_lines()
        first = next(line for line in lines if line)
        assert first.startswith(":"), first  # a keep-alive comment while the command is still running
        pc.hold.set()
        data = [line[5:].strip() for line in lines if line.startswith("data:")]
    res = json.loads(data[-1])["result"]
    assert not res.get("isError") and json.loads(res["content"][0]["text"])["op"] == "read"
