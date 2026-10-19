"""CAD work runs outside the web server's process, so the site keeps answering while a model rebuilds.

Why: OpenCascade (OCP) holds Python's GIL for the whole length of each call (measured 2026-10-19: a 0.3 s boolean
in one thread left every other thread without a single turn). With everything in one process, one heavy rebuild
(a cold Lavilock assembly after the machine woke up) froze the Files page, New part, saves and even the page itself.

Lanes, one worker process each, started on first use (`spawn`, so no locks are inherited from the server):
- per person and kind (`lane_for(person, kind)`): "edit" for what the person does in the browser (rebuilds, drags,
  equations, Design panel lookups, mass, interference, imports, exports, Toolbox parts, Motion Review), "agent" for
  their AI's edits through the MCP connector and the SOLIDWORKS tools' geometry. Each keeps `geometry.built`'s
  cache between calls and stops after 15 idle minutes. So one person's heavy work, or their Claude session, never
  queues anyone else's. Past MAX_LANES live workers (or when the machine is short of memory) a newcomer borrows the
  least busy live worker for that one call and asks again next time; one place is kept for the server's owner.
- BACKGROUND: Files pictures drawn on the server, at a lower CPU priority; stopped when idle for 5 minutes.
Long jobs get a process of their own (`start_job`): the in-app AI chat, SOLIDWORKS macros. `Slots` caps how many
run at once, per person and on the whole server (the machine has 2 GB and one core).

A lane runs one call at a time: later calls wait their turn in the server (`wait`, then "busy, try again" without
touching the running call), and a call's time limit counts only its own run. A call that runs past its limit kills
its lane's process; a lane whose process died (out of memory, a crash in OpenCascade) starts a fresh one on the next
call; a worker that grew past WORKER_MAX_MB is replaced after its call. Either way only that call fails, with a
plain message, and the web server carries on. Exceptions inside a worker come back as `CadJobError` with the
original type's name (and are logged with their traceback). Workers and jobs end themselves when the server
process dies (`_die_with_parent`), so a crashed or killed server leaves nothing running.

`OPENSKETCH_CAD_WORKERS=0` runs everything in the server's own threads, as before (the test suite does this, so
monkeypatched functions still apply; tests/test_cadworker.py checks the worker path).
"""

from __future__ import annotations

import asyncio
import contextlib
import functools
import importlib
import multiprocessing as mp
import os
import threading
import time
import traceback
import weakref
from concurrent.futures import ProcessPoolExecutor
from concurrent.futures.process import BrokenProcessPool

_CTX = mp.get_context("spawn")


def enabled() -> bool:
    return os.environ.get("OPENSKETCH_CAD_WORKERS", "1") != "0"


def _log(msg: str) -> None:
    print(f"OpenSketch CAD worker: {msg}", flush=True)


class CadJobError(Exception):
    """An exception raised inside a worker. `kind` is its type's name (e.g. "FeatureError")."""

    def __init__(self, kind: str, message: str, detail: str = ""):
        super().__init__(message)
        self.kind, self.message, self.detail = kind, message, detail


class CadUnavailable(Exception):
    """The worker ran out of time, stopped (crash, out of memory) or is busy. The message says so in plain words."""


def _resolve(path: str):
    mod, _, name = path.partition(":")
    obj = importlib.import_module(mod)
    for part in name.split("."):
        obj = getattr(obj, part)
    return obj


# ---------------------------------------------------------------------------------------------- memory

def rss_mb() -> float:
    """This process's resident memory in MB (0 where /proc is missing)."""
    try:
        with open("/proc/self/statm") as fh:
            return int(fh.read().split()[1]) * os.sysconf("SC_PAGE_SIZE") / 2**20
    except (OSError, ValueError, IndexError):
        return 0.0


def available_mb() -> float | None:
    """MemAvailable from /proc/meminfo in MB (None where it cannot be read)."""
    try:
        with open("/proc/meminfo") as fh:
            for line in fh:
                if line.startswith("MemAvailable:"):
                    return int(line.split()[1]) / 1024
    except (OSError, ValueError):
        pass
    return None


def memory_low() -> bool:
    """Less free memory than OPENSKETCH_MIN_FREE_MB (300): start no new worker or job (another ~250 MB process
    would make the kernel kill one at random, maybe the web server)."""
    floor = float(os.environ.get("OPENSKETCH_MIN_FREE_MB", 300))
    free = available_mb()
    return bool(floor > 0 and free is not None and free < floor)


# ---------------------------------------------------------------------------------------------- in the worker

def _die_with_parent() -> None:
    """End this process when the process that started it dies (an OOM kill or a crash of the server): it would
    otherwise keep its memory, or keep spending the owner's AI key, with nobody listening."""
    parent = mp.parent_process()
    if parent is None:
        return

    def watch():
        from multiprocessing.connection import wait
        try:
            wait([parent.sentinel])
        except Exception:
            pass
        os._exit(1)
    threading.Thread(target=watch, daemon=True, name="opensketch-parent-watch").start()


def oom_score(score: int) -> None:
    """Tell the kernel which process to kill first when memory runs out: a worker or a job (one call fails), not
    the web server (everyone's requests, streams and jobs would go). Best effort: lowering needs root."""
    try:
        with open("/proc/self/oom_score_adj", "w") as fh:
            fh.write(str(int(score)))
    except OSError:
        pass


def _init(nice: int, oom: int = 500) -> None:
    import signal
    signal.signal(signal.SIGINT, signal.SIG_IGN)  # the server stops its workers itself
    _die_with_parent()
    oom_score(oom)
    if nice:
        try:
            os.nice(nice)
        except OSError:
            pass


def _call(path: str, args: tuple, kwargs: dict, raw: bool = False):
    """Runs in the worker: never raises, so every exception type comes back (some cannot be pickled). With `raw`,
    the exception itself comes back when it survives pickling, so callers can catch their own types. The last item
    is the worker's memory in MB after the call (the lane replaces a worker that grew too big)."""
    try:
        return ("ok", _resolve(path)(*args, **kwargs), rss_mb())
    except BaseException as exc:  # noqa: BLE001 - reported to the caller
        detail = traceback.format_exc(limit=8)
        if raw:
            import pickle
            try:
                pickle.loads(pickle.dumps(exc))
                return ("exc", exc, detail, rss_mb())
            except Exception:
                pass
        return ("err", type(exc).__name__, str(exc), detail, rss_mb())


def _unwrap(res):
    if res[0] == "exc":
        raise res[1]
    if res[0] == "err":
        raise CadJobError(res[1], res[2], res[3])
    return res[1]


def _ping() -> int:
    from . import geometry  # noqa: F401 - loads OpenCascade so the first real call does not wait for it
    return os.getpid()


def _stop_pool(pool: ProcessPoolExecutor, kill: bool) -> None:
    if kill:  # Python 3.12 has no ProcessPoolExecutor.kill_workers()
        for proc in list((getattr(pool, "_processes", None) or {}).values()):
            try:
                proc.kill()
            except Exception:
                pass
    try:
        pool.shutdown(wait=False, cancel_futures=True)
    except Exception:
        pass


def _quiet(task: "asyncio.Task") -> None:
    """A call whose caller went away still ends normally: read its outcome so asyncio does not complain."""
    if not task.cancelled():
        task.exception()


WORKER_MAX_MB = float(os.environ.get("OPENSKETCH_WORKER_MAX_MB", 800))  # a worker bigger than this is replaced after its call


class Lane:
    def __init__(self, name: str, *, limit: float, nice: int = 0, idle: float | None = None):
        self.name, self.limit, self.nice, self.idle = name, limit, nice, idle
        self.max_mb = WORKER_MAX_MB
        self._pool: ProcessPoolExecutor | None = None
        self._lock = threading.Lock()   # guards _pool, _busy, _last
        self._last = time.monotonic()
        self._busy = 0                  # calls waiting for their turn or running
        self._turn: asyncio.Lock | None = None  # one call at a time in the worker (per event loop)
        self._turn_loop = None
        self._claimed = -1e9            # lane_for just gave it out: counts as live until its call starts
        if idle:
            _watch_idle(self)

    def _get(self) -> ProcessPoolExecutor:
        with self._lock:
            if self._pool is None:
                self._pool = ProcessPoolExecutor(max_workers=1, mp_context=_CTX, initializer=_init,
                                                 initargs=(self.nice, 500 + 10 * self.nice))
            return self._pool

    def _drop(self, pool: ProcessPoolExecutor, kill: bool = False) -> None:
        """Stop this pool (and forget it if it is still the lane's), never one a later call has started."""
        with self._lock:
            if self._pool is pool:
                self._pool = None
        _stop_pool(pool, kill)

    def reset(self, kill: bool = False) -> None:
        with self._lock:
            pool, self._pool = self._pool, None
        if pool is not None:
            _stop_pool(pool, kill)

    def pids(self) -> list[int]:
        pool = self._pool
        return [p.pid for p in (getattr(pool, "_processes", None) or {}).values()] if pool else []

    def warm(self) -> None:
        """Start the worker and load OpenCascade in it now, so the first rebuild does not wait for the import."""
        if enabled():
            self._get().submit(_ping)
            with self._lock:
                self._last = time.monotonic()  # stops after `idle` minutes unused, like any other start

    def _turn_for(self, loop) -> asyncio.Lock:
        with self._lock:
            if self._turn is None or self._turn_loop is not loop:  # a new event loop (tests): a new lock
                self._turn, self._turn_loop = asyncio.Lock(), loop
            return self._turn

    async def run(self, fn, *args, limit: float | None = None, raw: bool = False, wait: float | None = None, **kwargs):
        """Await fn(*args, **kwargs) in this lane's worker. Calls take turns: the time limit counts only this call's
        own run, and a call that waits longer than `wait` (default: its limit) for its turn fails with
        CadUnavailable without disturbing the call that is running. Exceptions: CadJobError (kind = type name), or
        with `raw` the original exception when it can cross over; CadUnavailable when out of time, busy, or the
        worker died."""
        path = f"{fn.__module__}:{fn.__qualname__}"
        if not enabled():
            from starlette.concurrency import run_in_threadpool
            try:
                return await run_in_threadpool(fn, *args, **kwargs)
            except Exception as exc:
                if raw:
                    raise
                raise CadJobError(type(exc).__name__, str(exc), traceback.format_exc(limit=8)) from exc
        limit = self.limit if limit is None else limit
        wait = limit if wait is None else wait
        loop = asyncio.get_running_loop()
        turn = self._turn_for(loop)
        self._begin()
        handed_over = False
        try:
            try:
                await asyncio.wait_for(turn.acquire(), wait)
            except asyncio.TimeoutError:
                raise CadUnavailable("Your CAD worker is still busy with earlier work, so this was not started. "
                                     "Try again in a moment.") from None
            try:
                pool = self._get()
                cfut = pool.submit(_call, path, args, kwargs, raw)
            except BaseException:
                turn.release()
                raise
            # From here the call belongs to its watcher: if the caller goes away, the worker is still busy with it,
            # so the next call keeps waiting until it ends (or its limit kills it).
            watcher = loop.create_task(self._watch(cfut, pool, path, limit, turn))
            watcher.add_done_callback(_quiet)
            handed_over = True
            res = await asyncio.shield(watcher)
        finally:
            if not handed_over:
                self._end()
        return _unwrap(res)

    async def _watch(self, cfut, pool, path: str, limit: float, turn: asyncio.Lock):
        try:
            try:
                res = await asyncio.wait_for(asyncio.wrap_future(cfut), limit)
            except asyncio.TimeoutError:
                self._timed_out(pool, path, limit)
            except BrokenProcessPool:
                self._broken(pool, path)
            except asyncio.CancelledError:
                if cfut.cancelled():  # the pool was shut down under it (the server is stopping)
                    raise CadUnavailable("The CAD worker was stopped. Try again.") from None
                raise
            if res[0] in ("err", "exc"):
                kind = res[1] if res[0] == "err" else type(res[1]).__name__
                msg = res[2] if res[0] == "err" else str(res[1])
                _log(f"({self.name}) {path} raised {kind}: {msg}\n{res[-2]}".rstrip())
            if res[-1] > self.max_mb:
                _log(f"({self.name}) the worker uses {res[-1]:.0f} MB after {path}; starting a fresh one next time")
                self._drop(pool)
            return res[:-2] if res[0] == "exc" else res[:-1]
        finally:
            turn.release()
            self._end()

    def _begin(self) -> None:
        with self._lock:
            self._busy += 1

    def _end(self) -> None:
        with self._lock:
            self._busy -= 1
            self._last = time.monotonic()

    def _timed_out(self, pool, path: str, limit: float):
        self._drop(pool, kill=True)  # the call that ran too long is the one running: only it is stopped
        _log(f"({self.name}) {path} ran past {limit:g} s; worker restarted")
        raise CadUnavailable(f"This took longer than {max(limit / 60, 1):.0f} minutes, so it was stopped. "
                             "Try a smaller change, or suppress heavy features first.") from None

    def _broken(self, pool, path: str):
        self._drop(pool)
        _log(f"({self.name}) the worker stopped during {path}; starting a new one")
        raise CadUnavailable("The CAD worker stopped while working on this (it may have run out of memory). "
                             "It has restarted: try again.") from None

    @property
    def live(self) -> bool:
        """It has a worker process, a call, or was just handed out for one (so two people arriving at once cannot
        both take the last place)."""
        return self._pool is not None or self._busy > 0 or time.monotonic() - self._claimed < 30

    def _idle_check(self) -> bool:
        """Stop the worker after `idle` seconds without a call (its caches go with it). True if it stopped."""
        with self._lock:
            pool = self._pool
            if pool is None or self._busy or not self.idle or time.monotonic() - self._last < self.idle:
                return False
            self._pool = None
        _stop_pool(pool, kill=False)
        return True


# One thread for every lane's idle check (a timer per call left hundreds of sleeping threads, and pushed the event
# loop's stack out of the supervisor's hang dump).
_idle_lanes: "weakref.WeakSet[Lane]" = weakref.WeakSet()
_reaper: threading.Thread | None = None
_reaper_guard = threading.Lock()
REAP_EVERY = 10.0


def _watch_idle(lane: Lane) -> None:
    global _reaper
    with _reaper_guard:
        _idle_lanes.add(lane)
        if _reaper is None or not _reaper.is_alive():
            _reaper = threading.Thread(target=_reap, daemon=True, name="opensketch-idle-workers")
            _reaper.start()


def _reap() -> None:
    while True:
        time.sleep(REAP_EVERY)
        for lane in list(_idle_lanes):
            try:
                if lane._idle_check():
                    _forget(lane)
            except Exception:
                pass


CAD_LIMIT = float(os.environ.get("OPENSKETCH_CAD_LIMIT", 600))
MAX_LANES = int(os.environ.get("OPENSKETCH_CAD_LANES", 3))  # person workers alive at once (~250-800 MB each)
PERSON_IDLE = 900.0  # a person's worker stops after 15 idle minutes (its caches go with it)
BACKGROUND = Lane("background", limit=180, nice=10, idle=300)

# One worker per person, so one person's heavy rebuild or Claude session never queues another person's work.
# They still share the machine's CPU: on one core, two heavy jobs at once each run at about half speed.
_lanes: dict[str, Lane] = {}
_lanes_guard = threading.Lock()
_reserved: str | None = None  # the server's owner: one worker place is kept free for them


def reserve_for(person: str | None) -> None:
    """Keep one worker place for this person (the server's owner), so newcomers never take the last one."""
    global _reserved
    _reserved = person


def _forget(lane: Lane) -> None:
    with _lanes_guard:
        for k in [k for k, v in _lanes.items() if v is lane]:
            if not lane.live:
                _lanes.pop(k, None)


def lane_for(person: str | None, kind: str = "edit") -> Lane:
    """The worker for this person (an account id; None = the server's single user) and kind of work: "edit" for
    what the person does in the browser, "agent" for their AI's edits (MCP tools), so a long Claude operation
    never holds up their own clicks either. Past MAX_LANES live workers, or when memory is short, the least busy
    live worker serves this call (it is not kept: the next call asks again)."""
    who = person or "local"
    key = f"{kind}:{who}"
    with _lanes_guard:
        own = _lanes.get(key)
        if own is not None and own.live:
            return own
        # Starting a process: the cap counts here, also for someone whose worker stopped when idle and comes back.
        live = [x for x in {id(x): x for x in _lanes.values()}.values() if x.live]
        room = MAX_LANES
        if _reserved is not None and who != _reserved and not any(
                k.split(":", 1)[1] == _reserved and v.live for k, v in _lanes.items()):
            room -= 1  # the owner has no worker running: keep a place for them
        if live and (len(live) >= max(room, 1) or memory_low()):
            return min(live, key=lambda x: x._busy)
        if own is None:
            own = _lanes[key] = Lane(key[:20], limit=CAD_LIMIT, nice=2, idle=PERSON_IDLE)
        own._claimed = time.monotonic()
        return own


JOB_ROOM_MB = float(os.environ.get("OPENSKETCH_JOB_ROOM_MB", 700))  # free memory a new job process should find


def make_room(need_mb: float = JOB_ROOM_MB, keep: tuple = ()) -> float | None:
    """Before a new process starts (a job: the AI chat, a macro export), stop workers nobody is using until `need_mb`
    is free: the pictures worker first, then person workers without a call, longest unused first (their caches go;
    the next call starts them again). A job loads OpenCascade (~430 MB resident) and grows with what it builds, and
    on a 2 GB machine with no swap the kernel then kills the job (oom_score 800) part-way through a tool call.
    Workers in `keep` and busy ones stay. Returns the free memory afterwards (None where /proc is missing)."""
    free = available_mb()
    if free is None or free >= need_mb:
        return free
    idle = [ln for ln in lanes() if ln not in keep and ln._pool is not None and not ln._busy]
    idle.sort(key=lambda ln: (ln is not BACKGROUND, ln._last))
    for ln in idle:
        with ln._lock:
            if ln._busy or ln._pool is None:
                continue
            pool, ln._pool = ln._pool, None
        _stop_pool(pool, kill=True)
        _log(f"({ln.name}) stopped to make room for a job ({free:.0f} MB free)")
        for _ in range(20):  # the kernel takes a moment to hand the memory back
            time.sleep(0.1)
            now = available_mb()
            if now is not None and now > free + 50:
                break
        free = available_mb() or free
        if free >= need_mb:
            break
    return free


def lanes() -> list[Lane]:
    with _lanes_guard:
        return list({id(x): x for x in _lanes.values()}.values()) + [BACKGROUND]


def shutdown() -> None:
    for lane in lanes():
        lane.reset(kill=True)
    for job in list(_jobs):
        job.kill()


# ---------------------------------------------------------------------------------------------- admission
# Long jobs are whole processes (~250-300 MB each, ~4 s of CPU to start). Slots says how many may run at once: at most
# `per_person` for one person and `cap` on the server. A request that finds no free place waits in a short queue
# (`queue` places, `wait` seconds), then gets a plain "busy" answer.

class Busy(Exception):
    """No place for this job now. `status`: 429 (this person's own job is still running) or 503 (the server is full)."""

    def __init__(self, message: str, status: int = 503):
        super().__init__(message)
        self.status = status


class Ticket:
    def __init__(self, slots: "Slots", person: str):
        self.slots, self.person = slots, person
        self.granted = False
        self.stopping = False  # its job was asked to stop (the person pressed Stop or left)
        self.done = False

    def release(self) -> None:
        self.slots.release(self)


class Slots:
    def __init__(self, name: str, cap: int, per_person: int = 1, queue: int = 4, wait: float = 30.0,
                 busy: str = "The server is busy. Try again in a minute.",
                 mine: str = "Your earlier request is still running. Wait for it to finish."):
        self.name, self.cap, self.per_person, self.queue, self.wait = name, max(1, cap), max(1, per_person), queue, wait
        self.busy_msg, self.mine_msg = busy, mine
        self._lock = threading.Lock()
        self._running: list[Ticket] = []
        self._waiting: list[Ticket] = []

    def running(self, person: str | None = None) -> list[Ticket]:
        with self._lock:
            return [t for t in self._running if person is None or t.person == person]

    def _grant(self) -> None:
        """Give free places to waiters in arrival order (a waiter whose person is at their limit lets later ones by)."""
        free_mem = None
        for t in list(self._waiting):
            if len(self._running) >= self.cap:
                return
            if sum(1 for r in self._running if r.person == t.person) >= self.per_person:
                continue
            if free_mem is None:
                free_mem = not (self._running and memory_low())  # the first job always may start
            if not free_mem:
                return
            self._waiting.remove(t)
            self._running.append(t)
            t.granted = True

    def check(self, person: str, queue: bool = True) -> None:
        """Refuse at once when this person's own job is running and still wanted, or (`queue`) the queue is full."""
        with self._lock:
            mine = [t for t in self._running if t.person == person]
            if len(mine) >= self.per_person and not all(t.stopping for t in mine):
                raise Busy(self.mine_msg, 429)
            if queue and len(self._waiting) >= self.queue and len(self._running) >= self.cap:
                raise Busy(self.busy_msg, 503)

    def try_take(self, person: str) -> Ticket:
        """A place now, or Busy (for jobs started by a plain request: no queue)."""
        self.check(person, queue=False)
        t = Ticket(self, person)
        with self._lock:
            self._waiting.append(t)
            self._grant()
            if not t.granted:
                self._waiting.remove(t)
                mine = sum(1 for r in self._running if r.person == person) >= self.per_person
                raise Busy(self.mine_msg if mine else self.busy_msg, 429 if mine else 503)
        return t

    async def take(self, person: str, wait: float | None = None) -> Ticket:
        """Wait (up to `wait` s) for a place; Busy when none came free."""
        self.check(person)
        t = Ticket(self, person)
        with self._lock:
            self._waiting.append(t)
            self._grant()
        end = time.monotonic() + (self.wait if wait is None else wait)
        try:
            while not t.granted:
                if time.monotonic() >= end:
                    raise Busy(self.busy_msg, 503)
                await asyncio.sleep(0.25)
                with self._lock:
                    self._grant()
        except BaseException:
            with self._lock:
                if t in self._waiting:
                    self._waiting.remove(t)
                    self._grant()
                    raise
            if t.granted:
                t.release()
            raise
        return t

    def release(self, t: Ticket) -> None:
        with self._lock:
            t.done = True
            if t in self._running:
                self._running.remove(t)
            if t in self._waiting:
                self._waiting.remove(t)
            self._grant()


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.environ.get(name, default))
    except ValueError:
        return default


AI_JOBS = Slots("ai", _env_int("OPENSKETCH_AI_JOBS", 2), per_person=1, queue=_env_int("OPENSKETCH_AI_QUEUE", 4), wait=30.0,
                busy="The AI is busy with other people's requests. Try again in a minute.",
                mine="The AI is still answering your previous message (in this or another tab). Wait for it to finish, or press Stop there.")
MACRO_JOBS = Slots("macro", _env_int("OPENSKETCH_MACRO_JOBS", 1), per_person=1, queue=0,
                   busy="Another SOLIDWORKS macro export is running on the server. Try again in a few minutes.",
                   mine="Your earlier SOLIDWORKS macro export is still running. Wait for it to finish.")


@contextlib.contextmanager
def proc_slot(name: str, cap: int, stop=None, poll: float = 0.5, on_wait=None):
    """A place among `cap` across every process of this server (the web server, its workers and jobs), held while
    the block runs: a lock file per place under <data>/run, so a process that dies frees its place. Waits for a
    free one (calling on_wait() once); yields False instead when stop() turns true while waiting."""
    import fcntl
    from . import store
    run_dir = store.data_dir() / "run"
    run_dir.mkdir(parents=True, exist_ok=True)
    fh = None
    told = False
    while fh is None:
        for i in range(max(1, cap)):
            f = open(run_dir / f"{name}.{i}.lock", "a+")
            try:
                fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
                fh = f
                break
            except OSError:
                f.close()
        if fh is not None:
            break
        if stop is not None and stop():
            yield False
            return
        if on_wait is not None and not told:
            told = True
            on_wait()
        time.sleep(poll)
    try:
        yield True
    finally:
        try:
            fcntl.flock(fh, fcntl.LOCK_UN)
        finally:
            fh.close()


# ---------------------------------------------------------------------------------------------- long jobs
# A job runs fn(*args, **kwargs, progress=..., stop=...) in a process of its own. `progress(*a)` calls come back to
# on_event("progress", a) in the server; `stop()` is true once cancel() was called. The end arrives as
# on_event("done", result) or on_event("error", (kind, message)). `on_end()` runs once the process has ended (a
# Slots ticket is released there, so a job that was asked to stop keeps its place until it really stopped).

_jobs: set["Job"] = set()


def _job_main(path, args, kwargs, conn, stop_ev, nice, uses):
    _init(nice, oom=800)

    def progress(*a):
        try:
            conn.send(("progress", a))
        except Exception:
            pass

    if "progress" in uses:
        kwargs["progress"] = progress
    if "stop" in uses:
        kwargs["stop"] = stop_ev.is_set
    if "log" in uses:
        kwargs["log"] = lambda line: progress(str(line))
    try:
        conn.send(("done", _resolve(path)(*args, **kwargs)))
    except BaseException as exc:  # noqa: BLE001
        _log(f"job {path} raised {type(exc).__name__}: {exc}\n{traceback.format_exc(limit=8)}".rstrip())
        try:
            conn.send(("error", (type(exc).__name__, str(exc))))
        except Exception:
            pass
    finally:
        conn.close()


class Job:
    def __init__(self, fn, args, kwargs, on_event, uses=("progress", "stop"), nice: int = 5, limit: float = 3600,
                 on_end=None):
        self._recv, send = _CTX.Pipe(duplex=False)
        self._stop = _CTX.Event()
        self.on_event, self.limit, self.on_end = on_event, limit, on_end
        self.path = f"{fn.__module__}:{fn.__qualname__}"
        self.proc = _CTX.Process(target=_job_main, daemon=False,
                                 args=(f"{fn.__module__}:{fn.__qualname__}", args, dict(kwargs), send, self._stop, nice, tuple(uses)))
        self.proc.start()
        send.close()
        _jobs.add(self)
        threading.Thread(target=self._pump, daemon=True).start()

    def cancel(self, grace: float = 30.0) -> None:
        """Ask the job to stop at its next check; kill it if it has not stopped after `grace` seconds."""
        self._stop.set()
        t = threading.Timer(grace, self.kill)
        t.daemon = True
        t.start()

    def kill(self) -> None:
        if self.proc.is_alive():
            self.proc.kill()

    def _pump(self) -> None:
        end = time.monotonic() + self.limit
        ended = False
        try:
            while not ended:
                left = end - time.monotonic()
                if left <= 0:
                    self.kill()
                    self.on_event("error", ("Timeout", f"Stopped after {self.limit / 60:.0f} minutes."))
                    ended = True
                    break
                if not self._recv.poll(min(left, 5.0)):
                    if not self.proc.is_alive() and not self._recv.poll(0):
                        break
                    continue
                try:
                    kind, payload = self._recv.recv()
                except EOFError:
                    break
                self.on_event(kind, payload)
                ended = kind in ("done", "error")
            if not ended:
                code = self.proc.exitcode
                free = available_mb()
                _log(f"job {self.path} ended with exit code {code}"
                     + (f" ({free:.0f} MB free now)" if free is not None else ""))
                self.on_event("error", ("WorkerStopped", "The job stopped unexpectedly"
                                        + (" (it may have run out of memory)." if code in (-9, 137) else f" (exit code {code}).")))
        finally:
            self.proc.join(timeout=5)
            if self.proc.is_alive():  # told to stop but still going: it must not keep its place
                self.kill()
                self.proc.join(timeout=5)
            _jobs.discard(self)
            if self.on_end is not None:
                try:
                    self.on_end()
                except Exception:
                    pass


class _ThreadJob:
    def __init__(self, stop_flag: threading.Event):
        self._stop = stop_flag

    def cancel(self, grace: float = 30.0) -> None:
        self._stop.set()

    def kill(self) -> None:
        self._stop.set()


def start_job(fn, *args, on_event, uses=("progress", "stop"), limit: float = 3600, on_end=None, **kwargs):
    """Start fn in its own process (see above) and return a handle with cancel(). Without workers (tests): a
    thread in this process."""
    if enabled():
        return Job(fn, args, kwargs, on_event, uses=uses, limit=limit, on_end=on_end)
    stop_flag = threading.Event()

    def work():
        kw = dict(kwargs)
        if "progress" in uses:
            kw["progress"] = lambda *a: on_event("progress", a)
        if "stop" in uses:
            kw["stop"] = stop_flag.is_set
        if "log" in uses:
            kw["log"] = lambda line: on_event("progress", (str(line),))
        try:
            on_event("done", fn(*args, **kw))
        except Exception as exc:
            on_event("error", (type(exc).__name__, str(exc)))
        finally:
            if on_end is not None:
                on_end()
    threading.Thread(target=work, daemon=True).start()
    return _ThreadJob(stop_flag)
