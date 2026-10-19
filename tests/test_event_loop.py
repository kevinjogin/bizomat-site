"""Nothing heavy or blocking runs on the web server's event loop or in its own process: every request waits for
it otherwise (2026-10-19 audit)."""
import json
import socket
import subprocess
import sys
import threading
import time

import httpx
import pytest

from opensketch import server, store


@pytest.fixture
def base(tmp_path, monkeypatch):
    import uvicorn
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    with socket.socket() as sk:
        sk.bind(("127.0.0.1", 0))
        port = sk.getsockname()[1]
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


HOLD = """
import fcntl, sys, time
with open(sys.argv[1], "a+") as fh:
    fcntl.flock(fh, fcntl.LOCK_EX)
    print("held", flush=True)
    time.sleep(float(sys.argv[2]))
"""



def test_a_picture_upload_waits_for_the_document_without_stopping_the_server(base, tmp_path):
    """Claude's edits hold the document's lock (in another process) while they rebuild. A picture the browser sends
    meanwhile waits for it in a thread; before, it waited on the event loop and the whole server stopped."""
    rec = store.create("Plate", None)
    script = tmp_path / "hold.py"
    script.write_text(HOLD)
    lockfile = store.data_dir() / "docs" / f"{rec['id']}.lock"
    holder = subprocess.Popen([sys.executable, str(script), str(lockfile), "4"], stdout=subprocess.PIPE, text=True)
    try:
        assert holder.stdout.readline().strip() == "held"
        out = {}

        def put():
            out["r"] = httpx.put(f"{base}/api/docs/{rec['id']}/thumb?version=1", content=b"\x89PNG\r\n\x1a\n" + b"0" * 64,
                                 headers={"Content-Type": "image/png"}, timeout=30)
        t = threading.Thread(target=put)
        t.start()
        time.sleep(0.5)
        worst = 0.0
        while t.is_alive():
            t0 = time.monotonic()
            assert httpx.get(base + "/healthz", timeout=10).status_code == 200
            assert httpx.get(base + "/api/docs", timeout=10).status_code == 200
            worst = max(worst, time.monotonic() - t0)
            time.sleep(0.2)
        assert out["r"].status_code == 200, out["r"].text
        assert worst < 1.0, f"the server took {worst:.2f} s to answer while a picture waited for the document"
    finally:
        holder.kill()
        holder.wait()


def test_only_truly_light_rebuilds_run_in_the_web_server():
    sketch = {"id": "s1", "type": "sketch", "plane": {"ref": "Top Plane"},
              "entities": [{"id": f"p{i}", "type": "point", "x": i, "y": 0} for i in range(8)]}
    assert server._light({"features": []})
    assert server._light({"features": [sketch]})
    assert not server._light({"features": [sketch]}, {"type": "extrude", "sketch": "s1", "depth": 5})  # previews: worker
    big = dict(sketch, entities=[{"id": f"p{i}", "type": "point", "x": i, "y": 0} for i in range(200)])
    assert not server._light({"features": [big]})
    spline = dict(sketch, entities=[{"id": "sp", "type": "spline", "points": [[i, i] for i in range(100)]}])
    assert not server._light({"features": [spline]})  # spline points count too
    assert not server._light({"features": [sketch, {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5}]})
    assert server._light({"type": "assembly", "parts": {}, "components": []})


def test_regen_answers_json_encoded_off_the_event_loop():
    from fastapi.testclient import TestClient
    from opensketch import demo
    c = TestClient(server.app)
    doc = {"version": 1, "name": "B", "units": "mm", "features": demo.bracket_features(), "rollback": None}
    r = c.post("/api/regen", json={"doc": doc})
    assert r.status_code == 200 and r.headers["content-type"] == "application/json"
    body = r.json()
    assert body["body"]["faces"] and all(s["state"] == "ok" for s in body["status"])
