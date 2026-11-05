"""KEVOS end to end, without SOLIDWORKS or Cloudflare: the real C# companion engine and add-in pipe link
(solidworks/tests/BridgeProbe) against this real server, driven by MCP tool calls. Checks what the Python stand-in
cannot: the C# signing (device proofs, the server's command signatures), the local pipe, chunked uploads, blob
downloads, cancellation, pause, a companion restart with its saved identity, and removal. Needs the .NET 8 SDK."""

from __future__ import annotations

import base64
import json
import os
import queue
import shutil
import subprocess
import threading
import time
from pathlib import Path

import anyio
import httpx
import pytest

from opensketch import devicebridge as db, swbridge
from tests.test_devicebridge import EXT, RECT, _box_step, _mcp, base, data  # noqa: F401  (fixtures)

ROOT = Path(__file__).resolve().parents[1]
PROBE = ROOT / "solidworks" / "tests" / "BridgeProbe"
pytestmark = [pytest.mark.slow, pytest.mark.skipif(shutil.which("dotnet") is None, reason="needs the .NET 8 SDK")]


@pytest.fixture(scope="module")
def probe_dll():
    env = dict(os.environ, DOTNET_CLI_TELEMETRY_OPTOUT="1", DOTNET_NOLOGO="1")
    r = subprocess.run(["dotnet", "build", "-c", "Release", "-nologo", "-v", "quiet"], cwd=PROBE, env=env,
                       capture_output=True, text=True, timeout=600)
    assert r.returncode == 0, r.stdout + r.stderr
    return PROBE / "bin" / "Release" / "net8.0" / "BridgeProbe.dll"


class Probe:
    def __init__(self, dll, base, data_dir, step):
        self.p = subprocess.Popen(["dotnet", str(dll), base, str(data_dir), str(step)], stdout=subprocess.PIPE,
                                  stdin=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
        self.lines: queue.Queue = queue.Queue()
        self.all: list[str] = []
        threading.Thread(target=self._read, daemon=True).start()

    def _read(self):
        for line in self.p.stdout:
            line = line.rstrip("\n")
            self.all.append(line)
            self.lines.put(line)

    def wait_for(self, prefix, timeout=60):
        end = time.time() + timeout
        while time.time() < end:
            try:
                line = self.lines.get(timeout=0.5)
            except queue.Empty:
                continue
            if line.startswith(prefix):
                return line
        raise AssertionError(f"no {prefix!r} from the probe; it said:\n" + "\n".join(self.all[-60:]))

    def say(self, text):
        self.p.stdin.write(text + "\n")
        self.p.stdin.flush()

    def kill(self):
        if self.p.poll() is None:
            self.p.kill()
            self.p.wait(10)


def _until(f, timeout=20):
    end = time.time() + timeout
    while time.time() < end:
        if f():
            return True
        time.sleep(0.1)
    return f()


def test_csharp_companion_and_addin_link_end_to_end(base, probe_dll, tmp_path):  # noqa: F811
    step = tmp_path / "box.step"
    step.write_bytes(_box_step())
    pdir = tmp_path / "companion"
    probe = Probe(probe_dll, base, pdir, step)
    try:
        code = probe.wait_for("PAIR ").split()[1]
        out = db.approve_pairing(None, code, "PROBE-PC")
        assert probe.wait_for("PAIRED ").split()[1] == out["device_id"]
        probe.wait_for("READY ")
        # the device's own registration file holds no secret
        cfg = json.loads((pdir / "device.json").read_text())
        assert cfg["device_id"] == out["device_id"] and "d" not in cfg["gateway_jwk"]

        res, st = _mcp(base, "sw_status", {})
        assert st["via"] == "companion" and st["device"] == "PROBE-PC" and st["solidworks"], st
        assert st["docs"][0]["title"] == "Box"
        res, out = _mcp(base, "sw_body_topology", {"doc": "C:\\OS\\Box.SLDPRT", "kind": "faces"})
        assert not res.get("isError") and len(out["faces"]) == 6, out          # STEP up in chunks, read by the kernel
        res, out = _mcp(base, "sw_export", {"doc": "C:\\OS\\Box.SLDPRT", "format": "step"})
        assert httpx.get(out["download_url"]).content == step.read_bytes()
        res, out = _mcp(base, "sw_import", {"filename": "p.step", "data": base64.b64encode(b"ISO-10303-21;HELLO").decode()})
        assert out["bytes"] == 18 and out["head"] == "ISO-10303-21"           # a blob down, checked against its hash
        res, out = _mcp(base, "sw_add_features", {"doc": "C:\\OS\\Box.SLDPRT", "features": [RECT, EXT]})
        assert not res.get("isError") and all(f["had_expect"] for f in out["features"] if f["id"] == "e1"), out
        res, out = _mcp(base, "sw_delete_items", {"doc": "C:\\OS\\Box.SLDPRT", "features": ["Boss-Extrude1"], "dry_run": True})
        assert out["dry_run"] is True
        res, out = _mcp(base, "sw_delete_items", {"doc": "C:\\OS\\Box.SLDPRT", "features": ["Boss-Extrude1"]})
        assert res.get("isError") and out["error_code"] == "APPROVAL_DENIED" and "declined" in out["error"], out
        res, out = _mcp(base, "sw_preview", {"doc": "C:\\OS\\Box.SLDPRT", "width": 200, "height": 160})
        assert not res.get("isError")

        # cancel a running batch: it stops at its next step
        got = {}

        def run():
            got["r"] = anyio.run(lambda: swbridge.call(None, "batch", {"steps": []}, 60))
        th = threading.Thread(target=run)
        th.start()
        assert _until(lambda: any(p.payload["op"] == "batch" and p.status == "running" for p in db._pending.values()))
        cid = next(p.id for p in db._pending.values() if p.payload["op"] == "batch")
        db.cancel(None, cid)
        th.join(30)
        assert got["r"][0]["ok"] is False and got["r"][0]["code"] == "CANCELLED", got
        assert db.command_record(None, cid)["status"] == "cancelled"

        # paused by the person at the computer: refused with that reason
        probe.say("pause")
        assert _until(lambda: _mcp(base, "sw_status", {})[1].get("note", "").startswith("KEVOS is paused"))
        res, out = _mcp(base, "sw_get_document", {})
        assert res.get("isError") and out["error_code"] == "PAUSED"
        probe.say("resume")
        assert _until(lambda: not _mcp(base, "sw_get_document", {})[0].get("isError"))

        # the companion restarts (crash, update, Windows restart): same identity, no pairing, connects by itself
        probe.kill()
        probe = Probe(probe_dll, base, pdir, step)
        probe.wait_for("READY ")
        assert not any(line.startswith("PAIR ") for line in probe.all)
        assert _until(lambda: not _mcp(base, "sw_get_document", {})[0].get("isError"))

        # removed from the account: cut off at once, and it says so
        dev = db.devices_for(None)[0]["id"]
        assert httpx.delete(base + f"/api/devices/{dev}").status_code == 200
        assert _until(lambda: (probe.say("status"), any("Removed from the KEVOS account" in line for line in probe.all))[1])
        res, out = _mcp(base, "sw_get_document", {})
        assert res.get("isError")
        probe.say("quit")
        probe.wait_for("STOPPED", 20)
    finally:
        probe.kill()
