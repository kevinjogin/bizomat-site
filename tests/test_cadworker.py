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


class _Server:
    """python -m opensketch on a free port with CAD workers on (open mode: no password, no accounts). Fails at once,
    with the server's own output, if it exits or does not answer within 90 s."""

    def __init__(self, tmp_path):
        with socket.socket() as sk:
            sk.bind(("127.0.0.1", 0))
            self.port = sk.getsockname()[1]
        env = dict(os.environ, OPENSKETCH_DATA=str(tmp_path / "data"), OPENSKETCH_CAD_WORKERS="1")
        env.pop("OPENSKETCH_PASSWORD", None)
        self.out = open(tmp_path / "server.log", "w+")
        self.proc = subprocess.Popen([sys.executable, "-m", "opensketch", "--host", "127.0.0.1", "--port", str(self.port),
                                      "--no-browser"], env=env, cwd=ROOT, stdout=self.out, stderr=subprocess.STDOUT)
        self.base = f"http://127.0.0.1:{self.port}"
        end = time.monotonic() + 90
        while True:
            try:
                if _get(self.base + "/healthz", 2)[0] == 200:
                    break
            except OSError:
                pass
            if self.proc.poll() is not None or time.monotonic() > end:
                log = self.log()
                self.__exit__()
                pytest.fail(f"the server did not start (exit code {self.proc.returncode}):\n{log[-3000:]}")
            time.sleep(0.5)

    def log(self) -> str:
        self.out.flush()
        self.out.seek(0)
        return self.out.read()

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        if self.proc.poll() is None:
            self.proc.terminate()
            try:
                self.proc.wait(15)
            except subprocess.TimeoutExpired:
                self.proc.kill()
                self.proc.wait(5)
        self.out.close()

    def json(self, path, body=None, timeout=300):
        return json.loads(_get(self.base + path, timeout, json.dumps(body).encode() if body is not None else None)[1])

    def mcp(self, name, args, i=[0]):
        i[0] += 1
        req = urllib.request.Request(self.base + "/mcp", method="POST", headers={
            "Content-Type": "application/json", "Accept": "application/json, text/event-stream"},
            data=json.dumps({"jsonrpc": "2.0", "id": i[0], "method": "tools/call" if name else "initialize",
                             "params": {"name": name, "arguments": args} if name else args}).encode())
        with urllib.request.urlopen(req, timeout=300) as r:
            res = json.loads(r.read())["result"]
        return json.loads(res["content"][0]["text"]) if name else res


def _watch(base, paths, while_alive):
    """Ask the server for these paths over and over while the thread runs; the slowest answer in seconds."""
    worst = 0.0
    while while_alive.is_alive():
        for path, data, method in paths:
            status, _, took = _get(base + path, 10, data, method)
            assert status == 200
            worst = max(worst, took)
        time.sleep(0.2)
    return worst


@pytest.mark.slow
def test_the_server_answers_while_a_heavy_rebuild_runs(tmp_path):
    with _Server(tmp_path) as srv:
        base = srv.base
        # a first small rebuild waits for the worker to load OpenCascade
        assert _get(base + "/api/regen", 120, json.dumps({"doc": block()}).encode())[0] == 200
        out = {}

        def rebuild():
            out["r"] = _get(base + "/api/regen", 300, json.dumps({"doc": heavy()}).encode())
        t = threading.Thread(target=rebuild)
        t.start()
        time.sleep(1.0)
        worst = _watch(base, [("/healthz", None, None), ("/api/docs", None, None),
                              ("/api/docs", json.dumps({"name": "", "kind": "part"}).encode(), "POST")], t)
        t.join()
        status, body, took = out["r"]
        # the rebuild really was heavy: at least twice the answer limit below (a fast CI runner builds it in ~5 s)
        assert status == 200 and took > 3.0, took
        assert json.loads(body)["status"][-1]["state"] == "ok"
        # without worker processes one ~2 s OpenCascade call of the rebuild holds every request (2-3 s); 1.5 s leaves
        # room for a busy test machine and still tells the two apart
        assert worst < 1.5, f"the server took {worst:.2f} s to answer during the rebuild"


@pytest.mark.slow
def test_claudes_edits_run_in_a_worker_and_the_server_keeps_answering(tmp_path):
    with _Server(tmp_path) as srv:
        srv.mcp(None, {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}})
        d = srv.mcp("create_document", {"name": "Grid"})
        out = {}

        def edit():
            out["r"] = srv.mcp("propose_features", {"doc_id": d["doc_id"], "mode": "replace", "summary": "Grid plate",
                                                    "features": heavy()["features"]})
        t = threading.Thread(target=edit)
        t.start()
        time.sleep(1.0)
        worst = _watch(srv.base, [("/healthz", None, None), (f"/api/docs/{d['doc_id']}/head", None, None),
                                  ("/api/regen", json.dumps({"doc": {"features": []}}).encode(), "POST")], t)
        t.join()
        assert out["r"]["version"] == 2 and out["r"]["clean"], out["r"]
        assert srv.json(f"/api/docs/{d['doc_id']}/head")["by"] == "claude"
        assert worst < 1.5, f"the server took {worst:.2f} s to answer while Claude edited"


@pytest.mark.slow
def test_the_ai_chat_runs_in_its_own_process_and_keeps_the_conversation(tmp_path):
    def chat(srv, conversation=None):
        body = {"doc": {"features": []}, "prompt": "an L bracket", "demo": "part"}
        if conversation:
            body["conversation"] = conversation
        req = urllib.request.Request(srv.base + "/api/ai/stream", data=json.dumps(body).encode(),
                                     headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=300) as r:
            return [json.loads(line) for line in r.read().decode().splitlines() if line.strip()]
    with _Server(tmp_path) as srv:
        first = chat(srv)
        assert first[0]["ev"] == "start" and first[-1]["ev"] == "done", first[-1]
        assert any(e["ev"] == "build_step" for e in first)
        conv = first[0]["conversation"]
        second = chat(srv, conv)
        assert second[0]["conversation"] == conv and second[-1]["ev"] == "done"  # the server kept the history


def test_people_get_their_own_workers(monkeypatch):
    monkeypatch.setattr(cadworker, "_lanes", {})
    # whatever earlier tests left: no place kept for an owner, and memory is not short
    monkeypatch.setattr(cadworker, "_reserved", None)
    monkeypatch.setattr(cadworker, "memory_low", lambda: False)
    a, b = cadworker.lane_for("alice"), cadworker.lane_for("bob")
    assert a is not b and cadworker.lane_for("alice") is a
    assert cadworker.lane_for("alice", "agent") is not a  # their AI's edits never queue their own clicks
    assert cadworker.lane_for(None) is cadworker.lane_for(None)


@pytest.mark.slow
def test_one_persons_heavy_rebuild_does_not_hold_up_anothers(monkeypatch):
    import asyncio
    monkeypatch.setenv("OPENSKETCH_CAD_WORKERS", "1")
    a, b = cadworker.Lane("alice", limit=300), cadworker.Lane("bob", limit=300)
    try:
        _run(a.run(_sleep, 0))
        _run(b.run(_sleep, 0))  # both workers loaded

        async def both():
            heavy_job = asyncio.ensure_future(a.run(cadjobs.regen, heavy()))
            await asyncio.sleep(1.0)
            t = time.monotonic()
            res = await b.run(cadjobs.regen, block())
            took = time.monotonic() - t
            assert not heavy_job.done(), "the heavy rebuild should still be running"
            await heavy_job
            return res, took
        res, took = _run(both())
        # the proof is that the heavy rebuild was still running when bob's finished (asserted in both()); the time
        # only has to be far below the heavy rebuild's ~25 s, with room for sharing one core
        assert res["status"][-1]["state"] == "ok" and took < 8.0, took
    finally:
        a.reset(kill=True)
        b.reset(kill=True)


def test_routes_use_the_signed_in_persons_worker(tmp_path, monkeypatch):
    from fastapi.testclient import TestClient
    from opensketch import server
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    seen = []
    real = cadworker.lane_for
    monkeypatch.setattr(cadworker, "lane_for", lambda person, kind="edit": seen.append((person, kind)) or real(person, kind))
    c = TestClient(server.app)
    c.post("/setup", data={"name": "YZ", "email": "yz@example.com", "new_password": "correct horse", "next": "/"})
    me = c.get("/api/account").json()
    assert c.post("/api/regen", json={"doc": block()}).status_code == 200
    assert seen and seen[-1] == (me["user"]["id"] if "user" in me else me["id"], "edit"), (seen, me)


# ----------------------------------------------------------------------------- one call at a time per worker

def test_a_queued_calls_limit_counts_only_its_own_run(workers):
    """A short call queued behind a long one waits its turn: its time limit starts when it starts, and the long call
    is never killed because of it (before: the queued call timed out after 2 s and killed the running one)."""
    import asyncio
    _run(workers.run(_sleep, 0))

    async def both():
        long = asyncio.ensure_future(workers.run(_sleep, 4, limit=30))
        await asyncio.sleep(0.5)
        t = time.monotonic()
        short = await workers.run(_sleep, 0.1, limit=2, wait=30)
        return await long, short, time.monotonic() - t
    long_pid, short_pid, took = _run(both())
    assert long_pid == short_pid and took > 3  # it waited for the long call, then ran in the same worker


def test_a_call_that_cannot_start_in_time_is_refused_without_harm(workers):
    import asyncio
    first = _run(workers.run(_sleep, 0))

    async def both():
        long = asyncio.ensure_future(workers.run(_sleep, 3, limit=30))
        await asyncio.sleep(0.5)
        with pytest.raises(cadworker.CadUnavailable) as e:
            await workers.run(_sleep, 0, wait=0.5)
        assert "busy" in str(e.value)
        return await long
    assert _run(both()) == first  # the running call finished in the same worker


def test_the_next_call_waits_for_work_whose_caller_went_away(workers):
    """A caller that gives up (the browser left) does not free the worker: the work still runs there, so the next
    call waits for it and still gets its full time limit."""
    import asyncio
    _run(workers.run(_sleep, 0))

    async def scenario():
        gone = asyncio.ensure_future(workers.run(_sleep, 3, limit=30))
        await asyncio.sleep(0.5)
        gone.cancel()
        t = time.monotonic()
        await workers.run(_sleep, 0, limit=1, wait=30)
        return time.monotonic() - t
    assert _run(scenario()) > 2


def test_a_worker_that_grew_too_big_is_replaced_after_its_call(workers):
    first = _run(workers.run(_sleep, 0))
    workers.max_mb = 1  # every worker is bigger than this
    assert _run(workers.run(_sleep, 0)) == first  # the call itself is answered
    workers.max_mb = 10_000
    assert _run(workers.run(_sleep, 0)) != first


def test_an_idle_worker_stops_and_its_place_counts_again(monkeypatch):
    """A person whose worker stopped when idle starts a new one through the cap, like a newcomer (before: they got
    their old lane back and started a process without counting, 5 live with a cap of 4)."""
    monkeypatch.setattr(cadworker, "_lanes", {})
    monkeypatch.setattr(cadworker, "MAX_LANES", 2)
    monkeypatch.setattr(cadworker, "_reserved", None)
    monkeypatch.setattr(cadworker.Lane, "_get", lambda self: self.__dict__.setdefault("_pool", None) or setattr(self, "_pool", object()) or self._pool)
    stopped = []
    monkeypatch.setattr(cadworker, "_stop_pool", lambda pool, kill: stopped.append(pool))
    a = cadworker.lane_for("a")
    a._get()
    b = cadworker.lane_for("b")
    b._get()
    a._claimed = b._claimed = -1e9
    c = cadworker.lane_for("c")  # full: c borrows a live worker for this call, and is not given one to keep
    assert c in (a, b) and "edit:c" not in cadworker._lanes
    a.idle, a._last = 1, time.monotonic() - 5
    assert a._idle_check() and not a.live
    cadworker._forget(a)
    c2 = cadworker.lane_for("c")  # a's place is free now: c gets its own worker
    assert c2 not in (a, b)
    c2._get()
    again = cadworker.lane_for("a")  # a comes back: no place, so it borrows; the cap holds
    assert again in (b, c2)
    assert sum(1 for x in {id(x): x for x in cadworker._lanes.values()}.values() if x.live) == 2


def test_the_owner_always_finds_a_place(monkeypatch):
    monkeypatch.setattr(cadworker, "_lanes", {})
    monkeypatch.setattr(cadworker, "MAX_LANES", 2)
    monkeypatch.setattr(cadworker, "_reserved", "owner")
    a = cadworker.lane_for("a")
    b = cadworker.lane_for("b")  # the last place is kept for the owner
    assert b is a
    owner = cadworker.lane_for("owner")
    assert owner is not a


PARENT = """
import os, sys, time
sys.path.insert(0, {root!r})
os.environ["OPENSKETCH_CAD_WORKERS"] = "1"
import asyncio
from opensketch import cadworker

if __name__ == "__main__":
    lane = cadworker.Lane("orphan-test", limit=60)
    cadworker.start_job(time.sleep, 600, on_event=lambda kind, payload: None, uses=())
    print(asyncio.run(lane.run(os.getpid)), flush=True)
    time.sleep(600)
"""


def test_workers_and_jobs_end_when_the_server_dies(tmp_path):
    """An OOM kill or crash of the server must not leave its workers and AI jobs running (they hold ~250 MB each,
    and a chat would keep spending the owner's key)."""
    import signal
    script = tmp_path / "parent.py"
    script.write_text(PARENT.format(root=str(ROOT)))
    proc = subprocess.Popen([sys.executable, str(script)], stdout=subprocess.PIPE, text=True)
    worker = int(proc.stdout.readline())
    kids = [int(p) for p in Path(f"/proc/{proc.pid}/task/{proc.pid}/children").read_text().split()]
    assert worker in kids and len(kids) >= 2
    os.kill(proc.pid, signal.SIGKILL)
    proc.wait()
    end = time.monotonic() + 15
    alive = lambda: [k for k in kids if "Z" not in _state(k)]  # noqa: E731
    while time.monotonic() < end and alive():
        time.sleep(0.2)
    left = alive()
    for k in left:  # never leave them behind, even when the test fails
        os.kill(k, signal.SIGKILL)
    assert not left


def _state(pid):
    try:
        return Path(f"/proc/{pid}/stat").read_text().split(")")[1].split()[0]
    except OSError:
        return "Z"


def test_the_build_cache_is_bounded_by_size(monkeypatch):
    """Each cached build keeps bodies and a mesh (~20-30 MB for a 200-face plate); a Design panel drag adds one per
    step. The cache keeps what fits in OPENSKETCH_BUILT_CACHE_MB, not 24 of anything."""
    from opensketch import geometry
    monkeypatch.setattr(geometry, "_built", type(geometry._built)())
    monkeypatch.setattr(geometry, "_built_bytes", {})
    monkeypatch.setattr(geometry, "BUILT_CACHE_MB", 25)
    monkeypatch.setattr(geometry, "_mesh_bytes", lambda mesh: 10 * 2**20)
    d = block()
    for depth in (5, 6, 7, 8):
        d["features"][1]["depth"] = depth
        geometry.built(d)
    assert len(geometry._built) == 2  # the two newest
    assert geometry.built(d) is geometry.built(d)  # still a cache


RECOGNIZER = """
import os, sys, time
sys.path.insert(0, {root!r})
os.environ["OPENSKETCH_RECOGNIZE_STALL"] = "('fillet'"  # the worker hangs on its first fillet, like a stuck step
os.environ["OPENSKETCH_DATA"] = {data!r}
from opensketch import recognize
from tests.test_recognize import plate, solid, step_doc

if __name__ == "__main__":
    print("go", flush=True)
    recognize.recognize_part_safe(step_doc(solid(plate)), hang=600)
"""


def test_a_recognition_worker_ends_when_whoever_started_it_dies(tmp_path):
    """The AI chat's job or Claude's CAD worker is killed (Stop, a time limit): the recognition worker it started
    must not live on with its 250-450 MB (before, it did, for good)."""
    import signal
    script = tmp_path / "recognizer.py"
    script.write_text(RECOGNIZER.format(root=str(ROOT), data=str(tmp_path / "data")))
    proc = subprocess.Popen([sys.executable, str(script)], stdout=subprocess.PIPE, text=True)
    assert proc.stdout.readline().strip() == "go"
    kids = []
    end = time.monotonic() + 60
    while time.monotonic() < end and not kids:
        time.sleep(0.5)
        kids = [int(p) for p in Path(f"/proc/{proc.pid}/task/{proc.pid}/children").read_text().split()]
    assert kids
    time.sleep(3)  # well into its work
    os.kill(proc.pid, signal.SIGKILL)
    proc.wait()
    alive = lambda: [k for k in kids if "Z" not in _state(k)]  # noqa: E731
    end = time.monotonic() + 15
    while time.monotonic() < end and alive():
        time.sleep(0.2)
    left = alive()
    for k in left:
        os.kill(k, signal.SIGKILL)
    assert not left
