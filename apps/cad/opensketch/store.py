"""The server's data folder (OPENSKETCH_DATA, default ~/opensketch-data): accounts, AI app connections, the
SOLIDWORKS link keys, upload links and short-lived exports all keep their files here. Small helpers they share:
where the folder is, whose files a request works with, a cross-process lock, and a disk-space check."""

from __future__ import annotations

import contextlib
import logging
import os
import shutil
import threading
from pathlib import Path

try:
    import fcntl
except ImportError:  # Windows: thread locks only
    fcntl = None

log = logging.getLogger("opensketch.store")


def _env_mb(name: str, default: float) -> int:
    try:
        return int(float(os.environ.get(name) or default) * 2**20)
    except ValueError:
        return int(default * 2**20)


RESERVE = _env_mb("OPENSKETCH_DISK_RESERVE_MB", 150)  # free disk kept for sign-in, sessions and settings


class StorageError(ValueError):
    """A write refused for space. `status`: the HTTP status the routes answer with."""
    status = 507


class DiskFull(StorageError):
    status = 507


def data_dir() -> Path:
    d = Path(os.environ.get("OPENSKETCH_DATA") or Path.home() / "opensketch-data")
    d.mkdir(parents=True, exist_ok=True)
    return d


def owner_of(user: dict | None) -> str | None:
    """Whose files a request works with: the account, or None on a server without accounts."""
    return user["id"] if user and not user.get("legacy") else None


_path_locks: dict[str, threading.Lock] = {}
_locks_guard = threading.Lock()


@contextlib.contextmanager
def file_lock(path: Path):
    """An exclusive lock on a small shared file, across threads and processes (flock). Not re-entrant."""
    with _locks_guard:
        tl = _path_locks.setdefault(str(path), threading.Lock())
    with tl:
        if fcntl is None:
            yield
            return
        with open(path, "a+") as fh:
            fcntl.flock(fh, fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(fh, fcntl.LOCK_UN)


def check_disk(nbytes: int, extra: int = 0) -> None:
    """Refuse a write that would leave less than RESERVE (+ extra) free on the data disk."""
    try:
        free = shutil.disk_usage(data_dir()).free
    except OSError:
        return
    if free - max(0, int(nbytes)) < RESERVE + extra:
        log.warning("Refused a %d byte write: %d MB free on the data disk", nbytes, free // 2**20)
        raise DiskFull("The server's disk is nearly full, so this was not saved. "
                       "Ask the person who runs this server to free some space.")
