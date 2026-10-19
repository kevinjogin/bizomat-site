"""CAD work runs outside the web server's process, so the site keeps answering while a model rebuilds.

Why: OpenCascade (OCP) holds Python's GIL for the whole length of each call (measured 2026-10-19: a 0.3 s boolean
in one thread left every other thread without a single turn). With everything in one process, one heavy rebuild
(a cold Lavilock assembly after the machine woke up) froze the Files page, New part, saves and even the page itself.

Lanes, one worker process each, started on first use (`spawn`, so no locks are inherited from the server):
- MODEL: work someone is waiting for (rebuilds, drags, equations, Design panel lookups, mass, interference,
  imports, exports, Toolbox parts, Motion Review checks). It keeps `geometry.built`'s cache between calls.
- BACKGROUND: Files pictures drawn on the server, at a lower CPU priority; stopped when idle for 5 minutes.
Long jobs with progress (feature recognition, SOLIDWORKS macros) get a process of their own (`start_job`).

A call that runs past its time limit kills its lane's process; a lane whose process died (out of memory, a crash in
OpenCascade) starts a fresh one on the next call. Either way only that call fails, with a plain message, and the
web server carries on. Exceptions inside a worker come back as `CadJobError` with the original type's name.

`OPENSKETCH_CAD_WORKERS=0` runs everything in the server's own threads, as before (the test suite does this, so
monkeypatched functions still apply; tests/test_cadworker.py checks the worker path).
"""

from __future__ import annotations

import asyncio
import functools
import importlib
import multiprocessing as mp
import os
import threading
import time
import traceback
from concurrent.futures import ProcessPoolExecutor
from concurrent.futures.process import BrokenProcessPool

_CTX = mp.get_context("spawn")


def enabled() -> bool:
    return os.environ.get("OPENSKETCH_CAD_WORKERS", "1") != "0"


class CadJobError(Exception):
    """An exception raised inside a worker. `kind` is its type's name (e.g. "FeatureError")."""

    def __init__(self, kind: str, message: str, detail: str = ""):
        super().__init__(message)
        self.kind, self.message, self.detail = kind, message, detail


class CadUnavailable(Exception):
    """The worker ran out of time or stopped (crash, out of memory). The message says so in plain words."""


def _resolve(path: str):
    mod, _, name = path.partition(":")
    obj = importlib.import_module(mod)
    for part in name.split("."):
        obj = getattr(obj, part)
    return obj


def _init(nice: int) -> None:
    import signal
    signal.signal(signal.SIGINT, signal.SIG_IGN)  # the server stops its workers itself
    if nice:
        try:
            os.nice(nice)
        except OSError:
            pass


def _call(path: str, args: tuple, kwargs: dict):
    """Runs in the worker: never raises, so every exception type comes back (some cannot be pickled)."""
    try:
        return ("ok", _resolve(path)(*args, **kwargs))
    except BaseException as exc:  # noqa: BLE001 - reported to the caller
        return ("err", type(exc).__name__, str(exc), traceback.format_exc(limit=8))


def _ping() -> int:
    from . import geometry  # noqa: F401 - loads OpenCascade so the first real call does not wait for it
    return os.getpid()


class Lane:
    def __init__(self, name: str, *, limit: float, nice: int = 0, idle: float | None = None):
        self.name, self.limit, self.nice, self.idle = name, limit, nice, idle
        self._pool: ProcessPoolExecutor | None = None
        self._lock = threading.Lock()
        self._last = 0.0
        self._busy = 0

    def _get(self) -> ProcessPoolExecutor:
        with self._lock:
            if self._pool is None:
                self._pool = ProcessPoolExecutor(max_workers=1, mp_context=_CTX, initializer=_init, initargs=(self.nice,))
            return self._pool

    def reset(self, kill: bool = False) -> None:
        with self._lock:
            pool, self._pool = self._pool, None
        if pool is None:
            return
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

    def pids(self) -> list[int]:
        pool = self._pool
        return [p.pid for p in (getattr(pool, "_processes", None) or {}).values()] if pool else []

    def warm(self) -> None:
        """Start the worker and load OpenCascade in it now, so the first rebuild does not wait for the import."""
        if enabled():
            self._get().submit(_ping)

    async def run(self, fn, *args, limit: float | None = None, **kwargs):
        path = f"{fn.__module__}:{fn.__qualname__}"
        if not enabled():
            from starlette.concurrency import run_in_threadpool
            try:
                return await run_in_threadpool(fn, *args, **kwargs)
            except Exception as exc:
                raise CadJobError(type(exc).__name__, str(exc), traceback.format_exc(limit=8)) from exc
        limit = self.limit if limit is None else limit
        loop = asyncio.get_running_loop()
        self._busy += 1
        try:
            try:
                fut = loop.run_in_executor(self._get(), functools.partial(_call, path, args, kwargs))
                res = await asyncio.wait_for(fut, limit)
            except asyncio.TimeoutError:
                self.reset(kill=True)
                print(f"OpenSketch CAD worker ({self.name}): {path} ran past {limit:g} s; worker restarted", flush=True)
                raise CadUnavailable(f"This took longer than {limit / 60:.0f} minutes, so it was stopped. "
                                     "Try a smaller change, or suppress heavy features first.") from None
            except BrokenProcessPool:
                self.reset()
                print(f"OpenSketch CAD worker ({self.name}): the worker stopped during {path}; starting a new one", flush=True)
                raise CadUnavailable("The CAD worker stopped while working on this (it may have run out of memory). "
                                     "It has restarted: try again.") from None
        finally:
            self._busy -= 1
            self._last = time.monotonic()
            if self.idle:
                threading.Timer(self.idle + 1, self._idle_check).start()
        if res[0] == "err":
            raise CadJobError(res[1], res[2], res[3])
        return res[1]

    def _idle_check(self) -> None:
        if self._busy == 0 and self._pool is not None and time.monotonic() - self._last >= self.idle:
            self.reset()


MODEL = Lane("model", limit=float(os.environ.get("OPENSKETCH_CAD_LIMIT", 600)), nice=2)
BACKGROUND = Lane("background", limit=180, nice=10, idle=300)


def shutdown() -> None:
    for lane in (MODEL, BACKGROUND):
        lane.reset(kill=True)
    for job in list(_jobs):
        job.kill()


# ---------------------------------------------------------------------------------------------- long jobs
# A job runs fn(*args, **kwargs, progress=..., stop=...) in a process of its own. `progress(*a)` calls come back to
# on_event("progress", a) in the server; `stop()` is true once cancel() was called. The end arrives as
# on_event("done", result) or on_event("error", (kind, message)).

_jobs: set["Job"] = set()


def _job_main(path, args, kwargs, conn, stop_ev, nice, uses):
    _init(nice)

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
        try:
            conn.send(("error", (type(exc).__name__, str(exc))))
        except Exception:
            pass
    finally:
        conn.close()


class Job:
    def __init__(self, fn, args, kwargs, on_event, uses=("progress", "stop"), nice: int = 5, limit: float = 3600):
        self._recv, send = _CTX.Pipe(duplex=False)
        self._stop = _CTX.Event()
        self.on_event, self.limit = on_event, limit
        self.proc = _CTX.Process(target=_job_main, daemon=True,
                                 args=(f"{fn.__module__}:{fn.__qualname__}", args, dict(kwargs), send, self._stop, nice, tuple(uses)))
        self.proc.start()
        send.close()
        _jobs.add(self)
        threading.Thread(target=self._pump, daemon=True).start()

    def cancel(self, grace: float = 30.0) -> None:
        """Ask the job to stop at its next check; kill it if it has not stopped after `grace` seconds."""
        self._stop.set()
        threading.Timer(grace, self.kill).start()

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
                self.on_event("error", ("WorkerStopped", "The job stopped unexpectedly"
                                        + (" (it may have run out of memory)." if code in (-9, 137) else f" (exit code {code}).")))
        finally:
            self.proc.join(timeout=5)
            _jobs.discard(self)


class _ThreadJob:
    def __init__(self, stop_flag: threading.Event):
        self._stop = stop_flag

    def cancel(self, grace: float = 30.0) -> None:
        self._stop.set()

    def kill(self) -> None:
        self._stop.set()


def start_job(fn, *args, on_event, uses=("progress", "stop"), limit: float = 3600, **kwargs):
    """Start fn in its own process (see above) and return a handle with cancel(). Without workers (tests): a
    thread in this process."""
    if enabled():
        return Job(fn, args, kwargs, on_event, uses=uses, limit=limit)
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
    threading.Thread(target=work, daemon=True).start()
    return _ThreadJob(stop_flag)
