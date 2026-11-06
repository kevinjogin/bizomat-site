"""CAD work runs in worker processes so the web server keeps answering (OpenCascade holds the GIL for the whole of
each call, so one heavy rebuild in the server's process would stop it answering anyone)."""
import json
import os
import subprocess
import sys
import threading
import time
from pathlib import Path

import pytest

from opensketch import cadworker, geometry, importer

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


def regen(doc):
    """A part rebuild, the CAD work the sw_ tools send to workers."""
    return geometry.regen_result(doc)


def bad_screw():
    return importer.build_standard({"type": "standard", "kind": "socket_head_cap_screw", "size": "M999-0.7", "length": 10})


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
    here = regen(block())
    there = _run(workers.run(regen, block()))
    assert [s["state"] for s in there["status"]] == [s["state"] for s in here["status"]]
    assert json.dumps(there["body"], sort_keys=True) == json.dumps(here["body"], sort_keys=True)
    assert there["bbox"] == here["bbox"]
    assert _run(workers.run(_sleep, 0)) == pid  # the same worker (and its caches) serves the next call


def test_errors_come_back_with_their_type(workers):
    with pytest.raises(cadworker.CadJobError) as e:
        _run(workers.run(bad_screw))
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
    cadworker.start_job(job_stub, 3, on_event=on_event, uses=("log",))
    assert done.wait(60)
    assert [p[0] for k, p in events if k == "progress"] == ["step 0", "step 1", "step 2"]
    assert events[-1][0] == "done" and events[-1][1]["pid"] != os.getpid()


def job_stub(n, log=print):
    for i in range(n):
        log(f"step {i}")
    return {"pid": os.getpid()}


def test_people_get_their_own_workers(monkeypatch):
    monkeypatch.setattr(cadworker, "_lanes", {})
    # whatever earlier tests left: no place kept for an owner, and memory is not short
    monkeypatch.setattr(cadworker, "_reserved", None)
    monkeypatch.setattr(cadworker, "memory_low", lambda: False)
    a, b = cadworker.lane_for("alice"), cadworker.lane_for("bob")
    assert a is not b and cadworker.lane_for("alice") is a
    assert cadworker.lane_for("alice", "agent") is not a  # each kind of work has its own worker
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
            heavy_job = asyncio.ensure_future(a.run(regen, heavy()))
            await asyncio.sleep(1.0)
            t = time.monotonic()
            res = await b.run(regen, block())
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




# ----------------------------------------------------------------------------- one call at a time per worker

def test_a_queued_calls_limit_counts_only_its_own_run(workers):
    """A short call queued behind a long one waits its turn: its time limit starts when it starts, and the long call
    is never killed because of it."""
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
    """A caller that gives up (the client went away) does not free the worker: the work still runs there, so the next
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
    """A person whose worker stopped when idle starts a new one through the cap, like a newcomer, so the number of
    live workers never goes over the cap."""
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
    """An OOM kill or crash of the server must not leave its workers and jobs running (they hold ~250 MB each)."""
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
    """Each cached build keeps bodies and a mesh (~20-30 MB for a 200-face plate); every changed value adds one.
    The cache keeps what fits in OPENSKETCH_BUILT_CACHE_MB, not 24 of anything."""
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


def test_idle_workers_give_way_before_a_job_starts(monkeypatch):
    """A job loads OpenCascade (~430 MB) and grows with what it builds, beside the server and person workers holding
    their caches; on a small machine the kernel would kill it. Before a job starts, workers with no call stop until
    there is room, the longest unused first."""
    monkeypatch.setattr(cadworker, "_lanes", {})
    monkeypatch.setattr(cadworker, "_reserved", None)
    stopped = []
    free = [2000.0]  # plenty while the lanes are handed out (lane_for shares one when memory is low)
    monkeypatch.setattr(cadworker, "available_mb", lambda: free[0])
    monkeypatch.setattr(cadworker.time, "sleep", lambda s: None)

    def stop(pool, kill):
        stopped.append(pool)
        free[0] += 300
    monkeypatch.setattr(cadworker, "_stop_pool", stop)
    old, new, busy = cadworker.lane_for("old"), cadworker.lane_for("new"), cadworker.lane_for("busy")
    for i, ln in enumerate((old, new, busy)):
        ln._pool = f"pool-{ln.name}"
        ln._last = time.monotonic() - 100 + i
    busy._busy = 1
    free[0] = 300.0
    assert cadworker.make_room(700) >= 700
    assert stopped == ["pool-edit:old", "pool-edit:new"]  # the longest unused first, until there is enough room
    assert busy._pool and old._pool is None and new._pool is None
    old._pool, new._pool = "pool-old", "pool-new"
    free[0] = 100.0
    cadworker.make_room(10_000)  # never enough: every idle worker goes, a busy one never does
    assert old._pool is None and new._pool is None and busy._pool == "pool-edit:busy"
    stopped.clear()
    free[0] = 900.0
    old._pool = "again"
    cadworker.make_room(700)  # room already: nothing stops
    assert stopped == []
