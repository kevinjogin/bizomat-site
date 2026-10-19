"""The add-in's real link client (C#, tests/LinkProbe) against a real OpenSketch server, driven by MCP tool calls.

Checks what the Python tests cannot: the C# side of the protocol (hello, long poll, gzip uploads, blob downloads,
results, the 409 reasons). Needs the .NET SDK. Run from the repo root:

    python solidworks/tests/e2e_link.py
"""

import json
import os
import socket
import subprocess
import sys
import tempfile
import threading
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))


def main() -> int:
    tmp = tempfile.mkdtemp()
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    base = f"http://127.0.0.1:{port}"
    os.environ.update(OPENSKETCH_DATA=tmp + "/data", OPENSKETCH_PUBLIC_URL=base)
    os.environ.pop("OPENSKETCH_PASSWORD", None)
    import httpx
    import uvicorn
    from build123d import Box, Location, export_step
    from opensketch import auth, server, swbridge

    srv = uvicorn.Server(uvicorn.Config(server.app, host="127.0.0.1", port=port, log_level="error"))
    threading.Thread(target=srv.run, daemon=True).start()
    for _ in range(100):
        try:
            httpx.get(base + "/api/version", timeout=1)
            break
        except httpx.HTTPError:
            time.sleep(0.05)
    step = Path(tmp) / "box.step"
    export_step(Box(40, 20, 10).locate(Location((20, 10, 5))), str(step))
    probe = ROOT / "solidworks" / "tests" / "LinkProbe"
    proc = subprocess.Popen(["dotnet", "run", "-c", "Release", "--project", str(probe), "--", base, swbridge.key_for(None), str(step)],
                            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    out_lines: list[str] = []
    threading.Thread(target=lambda: [out_lines.append(line) for line in proc.stdout], daemon=True).start()
    for _ in range(600):
        if swbridge.status(None).get("connected"):
            break
        time.sleep(0.1)
    else:
        print("".join(out_lines))
        raise SystemExit("the probe never connected")

    def mcp(name, args):
        r = httpx.post(f"{base}/mcp/{auth.mcp_token()}", json={"jsonrpc": "2.0", "id": 1, "method": "tools/call",
                                                              "params": {"name": name, "arguments": args}},
                       headers={"Accept": "application/json, text/event-stream"}, timeout=120)
        res = r.json()["result"]
        return res, json.loads(res["content"][0]["text"])

    checks = []

    def check(name, ok, detail=""):
        checks.append((name, ok))
        print(("ok   " if ok else "FAIL ") + name + ("" if ok else f"  {detail}"))

    res, out = mcp("sw_status", {})
    check("status through the C# client", out.get("connected") and out.get("machine") == "PROBE" and out["docs"][0]["title"] == "Box", out)
    res, out = mcp("sw_body_topology", {"kind": "faces"})
    check("STEP uploaded gzipped and read", out.get("faces_total") == 6, out)
    sent = sum("sent p1.step" in line for line in out_lines)
    res, out = mcp("sw_body_topology", {"kind": "faces"})
    check("second read uses the cache (no upload)", out.get("faces_total") == 6 and sum("sent p1.step" in line for line in out_lines) == sent == 1, sent)
    rect = {"id": "s1", "type": "sketch", "plane": {"ref": "Front Plane"},
            "entities": [{"id": "c", "type": "point", "x": 20, "y": 10}, {"id": "h", "type": "circle", "center": "c", "r": 3}],
            "constraints": [{"id": "D1", "type": "diameter", "refs": ["h"], "value": 6}]}
    res, out = mcp("sw_add_features", {"features": [rect, {"id": "e1", "type": "extrude", "sketch": "s1", "op": "cut",
                                                           "end": "through_all"}]})
    rows = {r["id"]: r for r in out.get("features", [])}
    exp = (rows.get("e1") or {}).get("expect") or {}
    check("prediction reaches the add-in", rows.get("e1", {}).get("had_expect") and abs(exp.get("dv", 0) + 3.14159265 * 9 * 10) < 0.5, out)
    import base64
    res, out = mcp("sw_import", {"filename": "box.step", "data": base64.b64encode(step.read_bytes()).decode()})
    check("blob downloaded by the C# client", out.get("bytes") == step.stat().st_size, out)
    res, out = mcp("sw_save", {})
    check("a refusal comes back as an error", res.get("isError") and "probe has no save" in out.get("error", ""), out)
    swbridge.new_key(None)
    proc.wait(30)
    check("a new key ends the link", "ended:" in "".join(out_lines) and ("new SOLIDWORKS key" in "".join(out_lines) or "new key was made" in "".join(out_lines)), "".join(out_lines[-5:]))
    srv.should_exit = True
    failed = [n for n, ok in checks if not ok]
    print(f"{len(checks) - len(failed)} of {len(checks)} passed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
