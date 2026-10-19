"""CAD work runs in worker processes so the web server keeps answering (2026-10-19: one heavy rebuild froze the
Files page, New part and even the page itself, because OpenCascade holds the GIL for the whole of each call)."""
import json
import os
import socket
import subprocess
import sys
import threading
import time
import urllib.request
from pathlib import Path

import pytest

from opensketch import cadjobs, cadworker

ROOT = Path(__file__).resolve().parent.parent


def heavy(n=24):
    """A plate with an n x n grid of holes cut in one go: ~25 s to rebuild here, with single OpenCascade calls of
    ~2 s that hold the GIL (in one process, the server could not answer anything during those)."""
    d = json.loads((ROOT / "tests/reference_parts/linear_pattern_holes.json").read_text())
    d = d.get("doc", d)
    for e in d["features"][0]["entities"]:
        if e["type"] == "point":
            e["x"], e["y"] = (4.0 * n + 10 if e["x"] else 0), (4.0 * n + 10 if e["y"] else 0)
    d["features"][2]["entities"] = [x for i in range(n) for j in range(n) for x in (
        {"id": f"p{i}_{j}", "type": "point", "x": 7 + 4 * i, "y": 7 + 4 * j},
        {"id": f"c{i}_{j}", "type": "circle", "center": f"p{i}_{j}", "r": 1.2})]
    d["features"] = d["features"][:4]
    return d


def block():
    d = json.loads((ROOT / "tests/reference_parts/linear_pattern_holes.json").read_text())
    return d.get("doc", d)


def _sleep(s):
    time.sleep(s)
    return os.getpid()


def _die():
    os._exit(3)


@pytest.fixture
def workers(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_CAD_WORKERS", "1")
    lane = cadworker.Lane("test", limit=60)
    yield lane
    lane.reset(kill=True)


def _run(coro):
    import asyncio
    return asyncio.run(coro)


def test_work_runs_in_another_process_with_the_same_result(workers):
    pid = _run(workers.run(_sleep, 0))
    assert pid != os.getpid()
    here = cadjobs.regen(block())
    there = _run(workers.run(cadjobs.regen, block()))
    assert [s["state"] for s in there["status"]] == [s["state"] for s in here["status"]]
    assert json.dumps(there["body"], sort_keys=True) == json.dumps(here["body"], sort_keys=True)
    assert there["bbox"] == here["bbox"]
    assert _run(workers.run(_sleep, 0)) == pid  # the same worker (and its caches) serves the next call


def test_errors_come_back_with_their_type(workers):
    with pytest.raises(cadworker.CadJobError) as e:
        _run(workers.run(cadjobs.toolbox_part, "socket_head_cap_screw", {"size": "M999-0.7", "length": 10}))
    assert e.value.kind and e.value.message


def test_a_runaway_job_is_stopped_and_the_next_call_gets_a_new_worker(workers):
    first = _run(workers.run(_sleep, 0))
    t = time.monotonic()
    with pytest.raises(cadworker.CadUnavailable):
        _run(workers.run(_sleep, 30, limit=1))
    assert time.monotonic() - t < 10
    assert _run(workers.run(_sleep, 0)) != first


def test_a_crashed_worker_is_replaced(workers):
    with pytest.raises(cadworker.CadUnavailable):
        _run(workers.run(_die))
    assert _run(workers.run(_sleep, 0)) > 0


def test_a_long_job_reports_progress_and_its_result(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_CAD_WORKERS", "1")
    events, done = [], threading.Event()

    def on_event(kind, payload):
        events.append((kind, payload))
        if kind in ("done", "error"):
            done.set()
    cadworker.start_job(sldexport_stub, 3, on_event=on_event, uses=("log",))
    assert done.wait(60)
    assert [p[0] for k, p in events if k == "progress"] == ["step 0", "step 1", "step 2"]
    assert events[-1][0] == "done" and events[-1][1]["pid"] != os.getpid()


def sldexport_stub(n, log=print):
    for i in range(n):
        log(f"step {i}")
    return {"pid": os.getpid()}


def _get(url, timeout=10, data=None, method=None):
    req = urllib.request.Request(url, data=data, method=method, headers={"Content-Type": "application/json"} if data else {})
    t = time.monotonic()
    with urllib.request.urlopen(req, timeout=timeout) as r:
        body = r.read()
    return r.status, body, time.monotonic() - t


def test_the_server_answers_while_a_heavy_rebuild_runs(tmp_path):
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]
    env = dict(os.environ, OPENSKETCH_DATA=str(tmp_path / "data"), OPENSKETCH_CAD_WORKERS="1")
    env.pop("OPENSKETCH_PASSWORD", None)
    proc = subprocess.Popen([sys.executable, "-m", "opensketch", "--host", "127.0.0.1", "--port", str(port), "--no-browser"],
                            env=env, cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    base = f"http://127.0.0.1:{port}"
    try:
        for _ in range(120):
            try:
                if _get(base + "/healthz", 2)[0] == 200:
                    break
            except OSError:
                time.sleep(0.5)
        # a first small rebuild waits for the worker to load OpenCascade
        assert _get(base + "/api/regen", 120, json.dumps({"doc": block()}).encode())[0] == 200
        out = {}

        def rebuild():
            out["r"] = _get(base + "/api/regen", 300, json.dumps({"doc": heavy()}).encode())
        t = threading.Thread(target=rebuild)
        t.start()
        time.sleep(1.0)
        worst = 0.0
        while t.is_alive():
            for path, data, method in (("/healthz", None, None), ("/api/docs", None, None),
                                       ("/api/docs", json.dumps({"name": "", "kind": "part"}).encode(), "POST")):
                status, _, took = _get(base + path, 10, data, method)
                assert status == 200
                worst = max(worst, took)
            time.sleep(0.2)
        t.join()
        status, body, took = out["r"]
        assert status == 200 and took > 5.0, took  # the rebuild really was heavy
        assert json.loads(body)["status"][-1]["state"] == "ok"
        assert worst < 1.0, f"the server took {worst:.2f} s to answer during the rebuild"
    finally:
        proc.terminate()
        proc.wait(15)
