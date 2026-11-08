"""Keeps the data folder in an object store when the server runs where local disk does not last.

Cloudflare Containers start from a fresh disk after every sleep, restart, host move or deploy ("All disk is
ephemeral", Cloudflare's Containers FAQ). With OPENSKETCH_PERSIST_URL set (the Worker bizomat-mcp sets
http://persist.bizomat.internal, cloudflare/mcp), the supervisor (supervisor.py):

- restores the data folder from the store before the server starts, and does not start the server when the store
  cannot be read or holds no accounts: an empty data folder would offer /setup to anyone, who would then own the
  server (fails closed; OPENSKETCH_PERSIST_EMPTY_OK=1 allows a deliberate first start with no data);
- copies every changed state file back to the store every OPENSKETCH_PERSIST_SECONDS (2 s), and once more after the
  server has stopped (Cloudflare sends SIGTERM and waits up to 15 minutes before it kills a container).

State files are the regular files at the top of the data folder (users.json, sessions.json, mcp_oauth.json,
google_oauth.json, swbridge.json, the keys, bridge-signing-key.pem, bridge.sqlite, ...), never lock, temporary or
journal files, and never the folders of files in transit (uploads, artifacts, bridge-files). A SQLite file is copied
with SQLite's online backup, so a copy is never torn (bridge.sqlite runs in WAL mode: its -wal file counts as a
change). A state file that disappears for two checks in a row is removed from the store too. Names are letters,
digits, dot, dash and underscore, as the store takes them (NAME); a file the store refuses is tried again on the next
check and never holds back the others.

The store answers four calls (cloudflare/mcp/src/persist.ts, an outbound handler of the Worker on its R2 bucket):
  GET    /list      -> {"objects": [{"key": "data/users.json", "size": 123, "sha256": "..."}, ...]}
  GET    /o/<key>   -> the bytes (404 when absent)
  PUT    /o/<key>   -> stores them; Content-Length and X-Content-SHA256 must match the body (R2 checks it)
  DELETE /o/<key>
Keys are "data/<file name>". The container reaches the store only through the Worker, on the same machine.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import sqlite3
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

PREFIX = "data/"
MARKER = "accounts.enabled"   # written by accounts.py with the first account; never removed afterwards
NAME = re.compile(r"[A-Za-z0-9][A-Za-z0-9._-]{0,127}")  # the names the store takes (cloudflare/mcp/src/persist.ts KEY)
SKIP_SUFFIXES = (".lock", ".tmp", ".part", ".restore", "-journal", "-wal", "-shm")
SQLITE_SUFFIXES = (".sqlite", ".sqlite3", ".db")
MAX_FILE = 64 * 2**20         # one state file; Cloudflare refuses outbound bodies over 100 MiB
TIMEOUT = 60.0


class StoreError(RuntimeError):
    """The store did not answer, refused, or gave back something else than it was given."""


def url() -> str:
    return os.environ.get("OPENSKETCH_PERSIST_URL", "").strip().rstrip("/")


def enabled() -> bool:
    return bool(url())


def interval() -> float:
    try:
        return max(0.5, float(os.environ.get("OPENSKETCH_PERSIST_SECONDS", "2")))
    except ValueError:
        return 2.0


def _call(method: str, path: str, body: bytes | None = None, headers: dict | None = None) -> tuple[int, bytes]:
    req = urllib.request.Request(url() + path, data=body, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except (urllib.error.URLError, OSError, TimeoutError) as e:
        raise StoreError(f"the data store did not answer ({e})") from None


def _obj(name: str) -> str:
    return "/o/" + urllib.parse.quote(PREFIX + name, safe="/")


def _sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _valid_name(name: str) -> bool:
    return NAME.fullmatch(name) is not None and ".." not in name


def state_files(folder: Path) -> list[Path]:
    """The regular files at the top of the data folder that hold lasting state."""
    if not folder.is_dir():
        return []
    out = []
    for p in sorted(folder.iterdir()):
        if not _valid_name(p.name) or p.name.endswith(SKIP_SUFFIXES) or p.is_symlink() or not p.is_file():
            continue
        out.append(p)
    return out


def _signature(p: Path) -> tuple:
    st = p.stat()
    sig = (st.st_mtime_ns, st.st_size)
    if p.name.endswith(SQLITE_SUFFIXES):
        wal = p.with_name(p.name + "-wal")
        try:
            w = wal.stat()
            sig += (w.st_mtime_ns, w.st_size)
        except FileNotFoundError:
            pass
    return sig


def snapshot(p: Path) -> bytes:
    """The file's bytes; a SQLite database through the online backup, so the copy is consistent."""
    if not p.name.endswith(SQLITE_SUFFIXES):
        return p.read_bytes()
    with tempfile.TemporaryDirectory() as tmp:
        copy = Path(tmp) / "copy.sqlite"
        src = sqlite3.connect(f"file:{p}?mode=ro", uri=True, timeout=10)
        dst = sqlite3.connect(str(copy))
        try:
            src.backup(dst)
        finally:
            dst.close()
            src.close()
        return copy.read_bytes()


def listing() -> dict[str, dict]:
    """The store's state files: name -> {"key", "size", "sha256"}."""
    code, body = _call("GET", "/list")
    if code != 200:
        raise StoreError(f"the data store refused to list its files (HTTP {code})")
    try:
        objects = json.loads(body)["objects"]
    except (ValueError, KeyError, TypeError):
        raise StoreError("the data store gave an unreadable list") from None
    out = {}
    for o in objects:
        key = str(o.get("key", ""))
        if key.startswith(PREFIX) and _valid_name(key[len(PREFIX):]):
            out[key[len(PREFIX):]] = o
    return out


def restore(folder: Path, *, allow_empty: bool = False, log=print) -> dict[str, str]:
    """Fills the data folder from the store, before the server starts. Returns name -> sha256 of what it wrote.
    Raises StoreError when the store cannot be read, a file fails its checksum, or the store holds no accounts
    (unless allow_empty)."""
    names = listing()
    if MARKER not in names and not allow_empty:
        raise StoreError("the data store holds no accounts (data/accounts.enabled is missing), so the server is not "
                         "started: an empty server would let anyone claim it at /setup. Move the data first, or set "
                         "OPENSKETCH_PERSIST_EMPTY_OK=1 for a deliberate first start with no data.")
    folder.mkdir(parents=True, exist_ok=True)
    got: dict[str, str] = {}
    for name, o in sorted(names.items()):
        code, data = _call("GET", _obj(name))
        if code != 200:
            raise StoreError(f"{name}: the data store did not give it back (HTTP {code})")
        h = _sha(data)
        if o.get("sha256") and h != o["sha256"]:
            raise StoreError(f"{name}: the copy from the data store does not match its checksum")
        tmp = folder / f".{name}.restore"
        fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)  # keys and sign-ins: the server's alone
        with os.fdopen(fd, "wb") as f:
            f.write(data)
        os.replace(tmp, folder / name)
        got[name] = h
    log(f"restored {len(got)} state files from the data store")
    return got


class Syncer:
    """Copies changed state files to the store every `every` seconds until stopped; flush() copies the rest."""

    def __init__(self, folder: Path, *, sent: dict[str, str] | None = None, every: float | None = None, log=print):
        self.folder, self.every, self.log = folder, interval() if every is None else every, log
        self.sent: dict[str, str] = dict(sent or {})   # name -> sha256 the store holds
        self._seen: dict[str, tuple] = {}              # name -> signature when last copied
        self._gone: dict[str, int] = {}                # name -> checks in a row it was missing
        self._lock = threading.Lock()
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None
        self.failures = 0
        self.copies = 0

    def sync_once(self) -> int:
        """Copies what changed since the last call; returns how many files went to the store. Raises StoreError when
        the store does not answer (at once) or refused a file (after trying the others)."""
        with self._lock:
            sent = 0
            present = set()
            refused = []
            for p in state_files(self.folder):
                name = p.name
                present.add(name)
                try:
                    sig = _signature(p)
                except FileNotFoundError:
                    continue
                if self._seen.get(name) == sig and name in self.sent:
                    continue
                if sig[1] > MAX_FILE:
                    self._too_big(name, sig, sig[1])
                    continue
                data = snapshot(p)
                if len(data) > MAX_FILE:  # a SQLite copy takes in its -wal pages
                    self._too_big(name, sig, len(data))
                    continue
                h = _sha(data)
                if self.sent.get(name) != h:
                    code, answer = _call("PUT", _obj(name), data, {"X-Content-SHA256": h, "Content-Type": "application/octet-stream"})
                    if code not in (200, 201, 204):
                        refused.append(f"{name} (HTTP {code}: {answer[:200].decode('utf-8', 'replace').strip()})")
                        continue  # tried again next time; the others still go
                    self.sent[name] = h
                    sent += 1
                self._seen[name] = sig
            for name in list(self.sent):
                if name in present:
                    self._gone.pop(name, None)
                    continue
                self._gone[name] = self._gone.get(name, 0) + 1
                if self._gone[name] < 2:  # a file being replaced can be missing for an instant
                    continue
                code, _ = _call("DELETE", _obj(name))
                if code in (200, 204, 404):
                    self.sent.pop(name, None)
                    self._seen.pop(name, None)
                    self._gone.pop(name, None)
            self.copies += sent
            if refused:
                raise StoreError("the data store refused " + "; ".join(refused))
            return sent

    def _too_big(self, name: str, sig: tuple, size: int) -> None:
        if self._seen.get(name) != sig:
            self.log(f"{name} is {size // 2**20} MB, over the {MAX_FILE // 2**20} MB a state file may be; not copied")
        self._seen[name] = sig

    def start(self) -> None:
        self._thread = threading.Thread(target=self._run, name="persist", daemon=True)
        self._thread.start()

    def _run(self) -> None:
        while not self._stop.wait(self.every):
            try:
                self.sync_once()
                if self.failures:
                    self.log(f"the data store answers again after {self.failures} failed copies")
                self.failures = 0
            except Exception as e:  # never stop copying because one attempt failed
                self.failures += 1
                if self.failures in (1, 10) or self.failures % 100 == 0:
                    self.log(f"could not copy the data to the store ({self.failures} in a row): {e}")

    def flush(self, attempts: int = 5) -> bool:
        """Stops the loop and copies whatever is left (after the server has stopped). True when the store has it all."""
        self._stop.set()
        if self._thread is not None:
            self._thread.join(timeout=TIMEOUT + 5)
        for i in range(attempts):
            try:
                self.sync_once()
                # twice: a file that vanished needs a second check before it is removed from the store
                self.sync_once()
                return True
            except Exception as e:
                self.log(f"could not copy the data to the store before stopping (attempt {i + 1}): {e}")
                time.sleep(min(2.0 ** i, 10.0))
        return False
