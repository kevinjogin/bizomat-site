"""Documents kept on the server: each person's Files, shared live with their AI (through the MCP endpoint).

Each document is a few files in the data folder (OPENSKETCH_DATA, default ~/opensketch-data):

    docs/<id>.json            {"id", "name", "version", "created", "updated", "by", "summary", "owner", "doc", "requests",
                              "autosave", "run_started"}
    docs/<id>.meta.json       the same without "doc" and "requests", plus kind, counts, sizes and thumbnail: what the
                              Files list and the browser's poll read, so they never parse a whole model
    docs/<id>.thumb.webp|png  a picture of the model (from the browser, or rendered on the server)
    docs/<id>/v<N>.json       earlier versions, for undo and version history (at most KEEP, HISTORY_MAX bytes)
    docs/<id>/versions.json   what each kept version is (version, by, summary, updated, bytes, blobs), so the history
                              list never parses the versions themselves
    docs/<id>/blobs/<sha256>  imported geometry (an import feature's BREP data, often megabytes) kept once: the record
                              and every kept version hold "osk-blob:sha256:<hex>" in its place (BLOB_MIN or longer)
    docs/.owners/<owner>.json the ids of each person's documents, so listing someone's Files reads only theirs

`version` goes up by one on every save that changes something (the same content again makes no new version). `by`
is "claude" or "you", `summary` says what changed. `owner` is the account id that owns the document (None: made
before accounts, or on a server without accounts; the server owner sees those). The browser polls the version to
follow the AI's changes; a save names the version it was based on, and is refused (Conflict) if someone else saved
in between.

Version history: every save keeps the version before it, except browser autosaves (`autosave=True`): within one run of
editing (AUTOSAVE_RUN seconds from its first autosave, same author, nothing else in between) they replace each other,
so history holds one version per ten minutes of editing plus every AI change, restore and rename.

Space: a document is at most DOC_MAX bytes; each account other than the server owner keeps at most QUOTA bytes
(documents, their versions and pictures, Trash included) in MAX_DOCS documents; nothing is written when the data
disk would drop below RESERVE bytes free, so sign-in and sessions can still be written (StorageError, with a plain
message and the HTTP status to answer with).

A record that cannot be read (a crash mid-write, a hand edit) is served from its newest readable kept version, marked
`recovered`, and the next save writes over it (the damaged file is kept beside it as <id>.damaged).

Deleting moves a document to the Trash (`deleted` = time); it is removed for good after TRASH_DAYS or when
emptied from the Trash.
"""

from __future__ import annotations

import contextlib
import hashlib
import json
import logging
import os
import re
import shutil
import threading
import time
import uuid
import weakref
from pathlib import Path

try:
    import fcntl
except ImportError:  # Windows: thread locks only (no CAD worker processes share the data folder there)
    fcntl = None

log = logging.getLogger("opensketch.store")


def _env_mb(name: str, default: float) -> int:
    try:
        return int(float(os.environ.get(name) or default) * 2**20)
    except ValueError:
        return int(default * 2**20)


KEEP = 50                    # versions kept per document at most
TRASH_DAYS = 30
THUMB_MAX = 600_000          # bytes
HISTORY_MAX = 64 * 2**20     # bytes of kept versions per document (imported geometry is stored once, not counted here)
AUTOSAVE_RUN = 600           # seconds of browser autosaves that share one kept version
BLOB_MIN = 64 * 1024         # import data this long or longer is stored once per document (blobs/)
BLOB_PREFIX = "osk-blob:sha256:"
DOC_MAX = _env_mb("OPENSKETCH_DOC_MAX_MB", 64)          # one document (its JSON)
QUOTA = _env_mb("OPENSKETCH_QUOTA_MB", 200)             # per account other than the server owner
MAX_DOCS = int(os.environ.get("OPENSKETCH_MAX_DOCS") or 1000)  # documents per account other than the server owner
RESERVE = _env_mb("OPENSKETCH_DISK_RESERVE_MB", 150)    # free disk kept for sign-in, sessions and settings
META_KEYS = ("id", "name", "version", "created", "updated", "by", "summary", "owner", "deleted")
_locks: "weakref.WeakValueDictionary[str, _DocLock]" = weakref.WeakValueDictionary()
_locks_guard = threading.Lock()


class Conflict(Exception):
    def __init__(self, current: dict):
        super().__init__("The document changed since it was opened")
        self.current = current


class NotFound(Exception):
    pass


class Damaged(NotFound):
    """The record cannot be read and no earlier version of it is kept."""


class StorageError(ValueError):
    """A write refused for space. `status`: the HTTP status the routes answer with."""
    status = 507


class TooBig(StorageError):
    status = 413


class DiskFull(StorageError):
    status = 507


class QuotaFull(StorageError):
    status = 507


def data_dir() -> Path:
    d = Path(os.environ.get("OPENSKETCH_DATA") or Path.home() / "opensketch-data")
    (d / "docs").mkdir(parents=True, exist_ok=True)
    return d


# ----------------------------------------------------------------------------- locks

class _DocLock:
    """One document's lock, across threads and across processes: CAD worker processes (cadworker.py) save
    documents too (Claude's edits), so besides a thread lock it holds an flock on docs/<id>.lock. Re-entrant.
    The lock file is made only for a document that exists (a request for a made-up id leaves nothing behind)."""

    def __init__(self, doc_id: str):
        self.doc_id = doc_id
        self._rlock = threading.RLock()
        self._depth = 0
        self._fh = None

    def acquire(self) -> bool:
        self._rlock.acquire()
        if self._depth == 0 and fcntl is not None and valid_id(self.doc_id):
            try:
                docs = data_dir() / "docs"
                if (docs / f"{self.doc_id}.json").exists():
                    fh = open(docs / f"{self.doc_id}.lock", "a+")
                    try:
                        fcntl.flock(fh, fcntl.LOCK_EX)
                    except BaseException:
                        fh.close()
                        raise
                    self._fh = fh
            except BaseException:
                self._rlock.release()
                raise
        self._depth += 1
        return True

    def release(self) -> None:
        self._depth -= 1
        if self._depth == 0 and self._fh is not None:
            fh, self._fh = self._fh, None
            try:
                fcntl.flock(fh, fcntl.LOCK_UN)
            finally:
                fh.close()
        self._rlock.release()

    def __enter__(self):
        self.acquire()
        return self

    def __exit__(self, *exc):
        self.release()
        return False


def lock(doc_id: str) -> _DocLock:
    """Kept only while someone holds it (`with lock(id):` keeps it alive), so made-up ids do not pile up."""
    with _locks_guard:
        found = _locks.get(doc_id)
        if found is None:
            found = _locks[doc_id] = _DocLock(doc_id)
        return found


_path_locks: dict[str, threading.Lock] = {}


@contextlib.contextmanager
def file_lock(path: Path):
    """An exclusive lock on a small shared file (an index), across threads and processes (flock). Not re-entrant."""
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


# ----------------------------------------------------------------------------- paths and writes

def valid_id(doc_id) -> bool:
    return isinstance(doc_id, str) and re.fullmatch(r"[A-Za-z0-9_-]{1,64}", doc_id) is not None


def _path(doc_id: str) -> Path:
    if not valid_id(doc_id):
        raise NotFound(doc_id)
    return data_dir() / "docs" / f"{doc_id}.json"


def _meta_path(doc_id: str) -> Path:
    return _path(doc_id).with_suffix(".meta.json")


def _hist_dir(doc_id: str) -> Path:
    return _path(doc_id).with_suffix("")


def _blob_dir(doc_id: str) -> Path:
    return _hist_dir(doc_id) / "blobs"


def _write_bytes(path: Path, data: bytes, sync: bool = False) -> None:
    """Never a half-written file: a temp file of its own, then a rename. A failed write (disk full) leaves nothing."""
    tmp = path.with_name(f"{path.name}.{uuid.uuid4().hex[:8]}.tmp")
    try:
        with open(tmp, "wb") as f:
            f.write(data)
            if sync:
                f.flush()
                os.fsync(f.fileno())
        os.replace(tmp, path)
    except BaseException:
        tmp.unlink(missing_ok=True)
        raise


def _write(path: Path, rec) -> None:
    _write_bytes(path, json.dumps(rec, separators=(",", ":")).encode())


def kind_of(doc: dict) -> str:
    return "assembly" if isinstance(doc, dict) and doc.get("type") == "assembly" else "part"


# ----------------------------------------------------------------------------- what a document must look like

def check_structure(doc) -> None:
    """Check the containers the app, the AI and the Files list read (ValueError with a plain reason), not feature
    validity or rebuild success: missing sketch references, unsupported feature types and other repairable modelling
    errors stay storable. A null feature or a scalar part is not a document those readers can use."""
    def object_list(value, label, fields=()):
        if not isinstance(value, list):
            raise ValueError(f"{label} must be a list.")
        seen = set()
        for item in value:
            if not isinstance(item, dict):
                raise ValueError(f"Every {label} entry must be an object.")
            for field in fields:
                if not isinstance(item.get(field), str) or not item[field]:
                    raise ValueError(f"Every {label} entry needs a non-empty string {field}.")
            if "id" in fields:
                if item["id"] in seen:
                    raise ValueError(f"{label} IDs must be unique.")
                seen.add(item["id"])
        return value

    def metadata(item, label):
        for field in ("name", "units", "appearance"):
            if field in item and not isinstance(item[field], str):
                raise ValueError(f"{label} {field} must be a string.")
        for field in ("material", "pcb"):
            if field in item and not isinstance(item[field], dict):
                raise ValueError(f"{label} {field} must be an object.")

    def part(item, label):
        if not isinstance(item, dict) or item.get("type", "part") != "part":
            raise ValueError(f"{label} must be a part document.")
        metadata(item, label)
        for feature in object_list(item.get("features"), f"{label} features", ("id", "type")):
            if feature["type"] == "import" and "data" in feature and not isinstance(feature["data"], str):
                raise ValueError("Imported feature data must be a base64 string.")
            if feature["type"] == "sketch":
                if "entities" in feature:
                    object_list(feature["entities"], "sketch entities", ("id", "type"))
                if "constraints" in feature:
                    object_list(feature["constraints"], "sketch constraints", ("type",))

    if not isinstance(doc, dict) or doc.get("type", "part") not in ("part", "assembly"):
        raise ValueError("The file must contain an OpenSketch part or assembly document.")
    if doc.get("type") != "assembly":
        part(doc, "Part")
        return
    metadata(doc, "Assembly")
    if not isinstance(doc.get("parts"), dict):
        raise ValueError("Assembly parts must be an object.")
    for key, value in doc["parts"].items():
        part(value, f"Part {key!r}")
    object_list(doc.get("components"), "assembly components", ("id", "part"))
    for mate in object_list(doc.get("mates", []), "assembly mates", ("id", "type")):
        for field in ("refs", "planes", "angle_refs", "input_refs"):
            if field in mate:
                object_list(mate[field], f"mate {field}")
    if "sequence" in doc and (not isinstance(doc["sequence"], list)
                              or not all(isinstance(item, str) for item in doc["sequence"])):
        raise ValueError("Assembly sequence must be a list of component IDs.")


def _record_ok(rec, doc_id: str | None = None) -> bool:
    return (isinstance(rec, dict) and isinstance(rec.get("doc"), dict) and isinstance(rec.get("version"), int)
            and isinstance(rec.get("id"), str) and (doc_id is None or rec["id"] == doc_id))


# ----------------------------------------------------------------------------- imported geometry stored once

class _BlobMissing(Exception):
    pass


_sha_memo: dict[int, tuple[str, str]] = {}  # id(data) -> (data, sha): the same string saved again is not hashed again


def _sha_of(data: str) -> str:
    hit = _sha_memo.get(id(data))
    if hit is not None and hit[0] is data:
        return hit[1]
    return _remember_sha(data, hashlib.sha256(data.encode()).hexdigest())


def _remember_sha(data: str, sha: str) -> str:
    if len(_sha_memo) > 256:
        _sha_memo.clear()
    _sha_memo[id(data)] = (data, sha)
    return sha


def _feature_lists(doc):
    if not isinstance(doc, dict):
        return
    if isinstance(doc.get("features"), list):
        yield doc["features"]
    if isinstance(doc.get("parts"), dict):
        for p in doc["parts"].values():
            if isinstance(p, dict) and isinstance(p.get("features"), list):
                yield p["features"]


class _Encoded:
    """A record as stored: `raw` (JSON with long import data replaced by references), the data it refers to
    (`blobs` {sha: data}) and its `size` with the data written in (what the Files list shows)."""

    def __init__(self, rec: dict):
        blobs: dict[str, str] = {}
        extra = 0

        def feats(lst):
            nonlocal extra
            out, changed = [], False
            for f in lst:
                d = f.get("data") if isinstance(f, dict) and f.get("type") == "import" else None
                if isinstance(d, str) and len(d) >= BLOB_MIN and not d.startswith(BLOB_PREFIX):
                    sha = _sha_of(d)
                    blobs[sha] = d
                    ref = BLOB_PREFIX + sha
                    extra += len(d) - len(ref)
                    f, changed = dict(f, data=ref), True
                out.append(f)
            return out, changed

        packed = rec
        doc = rec.get("doc")
        if isinstance(doc, dict):
            new, touched = dict(doc), False
            if isinstance(doc.get("features"), list):
                fs, ch = feats(doc["features"])
                if ch:
                    new["features"], touched = fs, True
            if isinstance(doc.get("parts"), dict):
                parts, pt = dict(doc["parts"]), False
                for k, p in doc["parts"].items():
                    if isinstance(p, dict) and isinstance(p.get("features"), list):
                        fs, ch = feats(p["features"])
                        if ch:
                            parts[k], pt = dict(p, features=fs), True
                if pt:
                    new["parts"], touched = parts, True
            if touched:
                packed = dict(rec, doc=new)
        self.raw = json.dumps(packed, separators=(",", ":")).encode()
        self.blobs = blobs
        self.size = len(self.raw) + extra


def _put_blobs(doc_id: str, blobs: dict) -> int:
    """Store import data once (by its hash). Returns the bytes newly written."""
    if not blobs:
        return 0
    d = _blob_dir(doc_id)
    d.mkdir(parents=True, exist_ok=True)
    written = 0
    for sha, data in blobs.items():
        p = d / sha
        if p.exists():
            continue
        raw = data.encode()
        _write_bytes(p, raw, sync=True)
        written += len(raw)
    return written


def _unpack(rec: dict, doc_id: str) -> dict:
    """Put the stored import data back in place of its references (in place)."""
    for feats in _feature_lists(rec.get("doc")):
        for f in feats:
            d = f.get("data") if isinstance(f, dict) else None
            if isinstance(d, str) and d.startswith(BLOB_PREFIX):
                sha = d[len(BLOB_PREFIX):]
                if not re.fullmatch(r"[0-9a-f]{64}", sha):
                    raise _BlobMissing(sha)
                try:
                    f["data"] = (_blob_dir(doc_id) / sha).read_text()
                except FileNotFoundError:
                    raise _BlobMissing(sha) from None
                _remember_sha(f["data"], sha)  # saved again unchanged: not hashed again
    return rec


def _refs(raw: bytes) -> set[str]:
    return {m.decode() for m in re.findall(rb"osk-blob:sha256:([0-9a-f]{64})", raw)}


def _blob_bytes(doc_id: str) -> int:
    total = 0
    try:
        for p in _blob_dir(doc_id).iterdir():
            if not p.name.endswith(".tmp"):
                total += p.stat().st_size
    except OSError:
        pass
    return total


def _gc_blobs(doc_id: str, keep: set[str]) -> None:
    """Remove import data no record or kept version refers to any more (under the document's lock)."""
    try:
        files = list(_blob_dir(doc_id).iterdir())
    except OSError:
        return
    for p in files:
        if re.fullmatch(r"[0-9a-f]{64}", p.name) and p.name not in keep:
            p.unlink(missing_ok=True)


# ----------------------------------------------------------------------------- meta, and who owns what

def _counts(doc) -> dict:
    """Never fails, whatever the document holds: the Files list must always load."""
    doc = doc if isinstance(doc, dict) else {}
    n = lambda v: len(v) if isinstance(v, (list, dict)) else 0
    if kind_of(doc) == "assembly":
        return {"components": n(doc.get("components")), "parts": n(doc.get("parts")), "mates": n(doc.get("mates"))}
    feats = [f for f in doc.get("features") or [] if isinstance(f, dict)] if isinstance(doc.get("features"), list) else []
    return {"features": sum(1 for f in feats if f.get("type") != "sketch"),
            "sketches": sum(1 for f in feats if f.get("type") == "sketch"),
            "imported": any(f.get("type") == "import" for f in feats)}


def _meta_of(rec: dict, size: int | None = None, thumb: dict | None = None, disk: int | None = None) -> dict:
    m = {k: rec.get(k) for k in META_KEYS}
    m["created"] = m["created"] or rec.get("updated")
    if not isinstance(m["name"], str) or not m["name"].strip():
        m["name"] = "Untitled"
    doc = rec.get("doc") if isinstance(rec.get("doc"), dict) else {}
    m["kind"] = kind_of(doc)
    m["counts"] = _counts(doc)
    reqs = rec.get("requests")
    m["requests"] = len(reqs) if isinstance(reqs, list) else 0
    m["size"] = size
    m["disk"] = disk
    m["thumb"] = thumb
    if rec.get("recovered"):
        m["recovered"] = rec["recovered"]
    return m


_meta_cache: dict[str, tuple[tuple, dict]] = {}
_SETTLED = 2.0  # seconds: a file changed more recently than this is read again (file times are coarse)


def _read_json_cached(path: Path, cache: dict, key: str):
    """A small JSON file, parsed once until it changes. Only files untouched for _SETTLED seconds are cached: a file
    rewritten within the same clock tick and size would look unchanged otherwise. None when missing or damaged."""
    try:
        st = path.stat()
    except FileNotFoundError:
        return None
    stamp = (st.st_ino, st.st_mtime_ns, st.st_size)
    hit = cache.get(key)
    if hit is not None and hit[0] == stamp:
        return hit[1]
    try:
        data = json.loads(path.read_text())
    except (OSError, ValueError):
        return None
    if time.time() - st.st_mtime > _SETTLED:
        if len(cache) > 50000:
            cache.clear()
        cache[key] = (stamp, data)
    return data


def _owner_key(owner) -> str:
    if owner is None:
        return "_none"
    s = str(owner)
    return s if valid_id(s) and s != "_none" else "_" + hashlib.sha256(s.encode()).hexdigest()[:24]


def _owners_dir() -> Path:
    d = data_dir() / "docs" / ".owners"
    d.mkdir(exist_ok=True)
    return d


_index_cache: dict[str, tuple[tuple, dict]] = {}
_index_ready: set[str] = set()  # data folders whose indexes are built


def _index_ids(key: str) -> set[str] | None:
    """The ids in one person's index (None: the index file is damaged)."""
    _ensure_index()
    p = _owners_dir() / f"{key}.json"
    data = _read_json_cached(p, _index_cache, str(p))
    if data is None:
        return set() if not p.exists() else None
    ids = data.get("ids") if isinstance(data, dict) else None
    return set(ids) if isinstance(ids, list) else None


def _index_change(key: str, add=(), remove=()) -> None:
    _ensure_index()
    d = _owners_dir()
    rebuilt = _scan_owners().get(key, set()) if _index_ids(key) is None else None  # damaged: from the documents
    with file_lock(d / f"{key}.lock"):
        ids = _index_ids(key)
        if ids is None:
            ids = rebuilt if rebuilt is not None else _scan_owners().get(key, set())
        ids |= set(add)
        ids -= set(remove)
        _write(d / f"{key}.json", {"ids": sorted(ids)})


def _scan_owners() -> dict[str, set]:
    """Every document's id by owner key, read from the files without taking any lock (index locks are taken while
    document locks are held, never the other way round)."""
    groups: dict[str, set] = {}
    try:
        with os.scandir(data_dir() / "docs") as it:
            names = [e.name for e in it]
    except OSError:
        return groups
    for name in names:
        doc_id = name[:-5] if name.endswith(".json") and not name.endswith(".meta.json") else None
        if not doc_id or not valid_id(doc_id):
            continue
        m = _read_meta(doc_id)
        if m is None:
            try:
                m = json.loads(_path(doc_id).read_bytes())
            except (OSError, ValueError):
                continue  # unreadable and never described: it lists as nothing anyway
        if isinstance(m, dict):
            groups.setdefault(_owner_key(m.get("owner")), set()).add(doc_id)
    return groups


def _ensure_index() -> None:
    """Build the per-person indexes once from all documents (servers from before them)."""
    d = _owners_dir()
    if str(d) in _index_ready:
        return
    if not (d / ".ready").exists():
        with file_lock(d / ".build.lock"):
            if not (d / ".ready").exists():
                groups = _scan_owners()
                for key, ids in groups.items():
                    with file_lock(d / f"{key}.lock"):
                        try:
                            old = json.loads((d / f"{key}.json").read_text()).get("ids") or []
                        except (OSError, ValueError, AttributeError):
                            old = []
                        _write(d / f"{key}.json", {"ids": sorted(ids | set(old))})
                (d / ".ready").write_text("1")
    _index_ready.add(str(d))


def _read_meta(doc_id: str) -> dict | None:
    p = _meta_path(doc_id)
    m = _read_json_cached(p, _meta_cache, str(p))
    return dict(m) if isinstance(m, dict) and m.get("id") == doc_id else None


def _commit(rec: dict, enc: _Encoded | None = None, thumb="keep") -> None:
    """Write a record (its import data first, then the record, then its meta). The meta is worked out before the
    record is written, so a record never lands that its meta cannot describe."""
    doc_id = rec["id"]
    p = _path(doc_id)
    if rec.get("recovered"):  # writing over a damaged record: keep the damaged file beside it, once
        try:
            os.replace(p, p.with_suffix(".damaged"))
        except OSError:
            pass
    rec = {k: v for k, v in rec.items() if k != "recovered"}
    enc = enc or _Encoded(rec)
    old = _read_meta(doc_id) or {}
    if thumb == "keep":
        thumb = old.get("thumb")
    m = _meta_of(rec, enc.size, thumb)
    _put_blobs(doc_id, enc.blobs)
    _write_bytes(p, enc.raw, sync=True)
    m["disk"] = _disk_of(doc_id, len(enc.raw), thumb)
    _write(_meta_path(doc_id), m)


def _disk_of(doc_id: str, record_bytes: int, thumb: dict | None) -> int:
    hist = sum(int(e.get("bytes") or 0) for e in _hist_entries(doc_id)[0])
    return record_bytes + hist + _blob_bytes(doc_id) + int((thumb or {}).get("bytes") or 0)


# compatibility for callers and tests that wrote a record directly
def _save_files(rec: dict, thumb: dict | None = "keep") -> None:
    _commit(rec, thumb=thumb)


def empty_doc(name: str, kind: str = "part") -> dict:
    if kind == "assembly":
        return {"version": 1, "type": "assembly", "name": name, "units": "mm", "parts": {}, "components": [],
                "mates": [], "sequence": [], "seq": 1}
    return {"version": 1, "type": "part", "name": name, "units": "mm", "features": [], "rollback": None, "seq": 10}


# ----------------------------------------------------------------------------- space

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


def limits(owner) -> tuple[int, int] | None:
    """(bytes, documents) an account may keep, or None: no limit (the server owner, servers without accounts)."""
    if owner is None:
        return None
    try:
        from . import accounts
        u = accounts.get(owner)
    except Exception:
        return None
    if u is not None and u.get("role") == "owner":
        return None
    return QUOTA, MAX_DOCS


def usage(owner) -> dict:
    """What a person keeps: {"bytes", "files"} (Trash included)."""
    total, files = 0, 0
    for doc_id in _index_ids(_owner_key(owner)) or ():
        m = _read_meta(doc_id)
        if m is None or m.get("owner") != owner:
            continue
        files += 1
        total += int(m.get("disk") or m.get("size") or 0)
    return {"bytes": total, "files": files}


def _mb(n: int) -> str:
    return f"{n / 2**20:.0f}" if n >= 10 * 2**20 else f"{n / 2**20:.1f}"


def _full(used: int, limit: int) -> QuotaFull:
    return QuotaFull(f"Your Files are full ({_mb(used)} of {_mb(limit)} MB). Delete files you no longer need and "
                     "empty the Trash, then try again.")


def _check_size(enc: _Encoded) -> None:
    if enc.size > DOC_MAX:
        raise TooBig(f"This file is too big to keep: {_mb(enc.size)} MB (the limit is {_mb(DOC_MAX)} MB).")


# ----------------------------------------------------------------------------- documents

def create(name: str, doc: dict | None = None, kind: str = "part", by: str = "you", owner: str | None = None,
           summary: str = "Created") -> dict:
    doc = doc or empty_doc(name, kind)
    if not isinstance(doc, dict):
        raise ValueError("A document must be an object.")
    doc["name"] = (name or (doc.get("name") if isinstance(doc.get("name"), str) else "") or "Untitled").strip()[:120] or "Untitled"
    doc_id = uuid.uuid4().hex[:12]
    now = time.time()
    rec = {"id": doc_id, "name": doc["name"], "version": 1, "created": now, "updated": now, "by": by,
           "summary": summary, "owner": owner, "doc": doc, "requests": [], "autosave": False, "run_started": now}
    enc = _Encoded(rec)
    _check_size(enc)
    grow = len(enc.raw) + sum(len(d) for d in enc.blobs.values())
    check_disk(grow)
    limit = limits(owner)
    if limit is not None:
        used = usage(owner)
        if used["files"] >= limit[1]:
            raise QuotaFull(f"You have {used['files']} files, the most one account can keep. Delete files you no "
                            "longer need and empty the Trash, then try again.")
        if used["bytes"] + grow > limit[0]:
            raise _full(used["bytes"], limit[0])
    _index_change(_owner_key(owner), add=[doc_id])  # first: a crash after this leaves an id that lists as nothing
    _commit(rec, enc, thumb=None)
    return rec


def _load(doc_id: str) -> dict:
    """The record, with its import data in place. Damaged -> rebuilt from the newest readable kept version."""
    p = _path(doc_id)
    for _attempt in range(3):
        try:
            text = p.read_bytes()
        except FileNotFoundError as exc:
            raise NotFound(doc_id) from exc
        try:
            rec = json.loads(text)
        except ValueError:
            break
        if not _record_ok(rec):
            break
        try:
            return _unpack(rec, doc_id)
        except _BlobMissing:
            continue  # a save replaced the record (and its data) while we read it: read it again
    return _recover(doc_id)


def _recover(doc_id: str) -> dict:
    for e in _hist_entries(doc_id)[0]:
        try:
            old = json.loads((_hist_dir(doc_id) / f"v{e['version']}.json").read_bytes())
            if not _record_ok(old):
                continue
            old = _unpack(old, doc_id)
        except (OSError, ValueError, _BlobMissing):
            continue
        m = _read_meta(doc_id) or {}
        rec = dict(old)
        for k in ("owner", "deleted", "created"):
            if k in m:
                rec[k] = m[k]
        rec["version"] = max(int(m.get("version") or 0), e["version"] + 1)
        rec["recovered"] = {"from_version": e["version"], "at": time.time()}
        log.warning("Document %s could not be read; serving its version %s until the next save", doc_id, e["version"])
        return rec
    log.warning("Document %s could not be read and no earlier version is kept", doc_id)
    raise Damaged(f"The file {doc_id} is damaged and no earlier version of it is kept.")


def get(doc_id: str) -> dict:
    return _load(doc_id)


def meta(doc_id: str) -> dict:
    """The small description of a document (no model). Built from the record once for older documents."""
    m = _read_meta(doc_id)
    if m is not None:
        return m
    if not _path(doc_id).exists():  # never takes a lock (or makes a lock file) for a document that does not exist
        raise NotFound(doc_id)
    with lock(doc_id):
        rec = get(doc_id)
        enc = _Encoded(rec)
        thumb = _existing_thumb(doc_id)
        m = _meta_of(rec, enc.size, thumb, _disk_of(doc_id, _path(doc_id).stat().st_size, thumb))
        _write(_meta_path(doc_id), m)
        return m


def head(doc_id: str) -> dict:
    """The small part of a record the browser polls."""
    m = meta(doc_id)
    return {k: m.get(k) for k in ("id", "name", "version", "updated", "by", "summary", "requests")}


def brief(rec: dict) -> dict:
    """A record without its model, for answers that only need to say what was stored."""
    return {k: v for k, v in rec.items() if k not in ("doc", "requests")}


def _same(rec: dict, doc: dict, requests) -> bool:
    return rec["doc"] == doc and (requests is None or requests == (rec.get("requests") or []))


def save(doc_id: str, doc: dict, by: str, summary: str = "", base_version: int | None = None,
         requests: list | None = None, autosave: bool = False) -> dict:
    """Store a new version. base_version: refuse if the stored version is not this one. The same content as the
    stored version makes no new version (a retried save, a rename to the same name). autosave: a browser save with
    no summary of its own; autosaves by the same author within AUTOSAVE_RUN seconds keep one version between them."""
    if not isinstance(doc, dict):
        raise ValueError("A document must be an object.")
    with lock(doc_id):
        rec = get(doc_id)
        if _same(rec, doc, requests):
            return rec
        if base_version is not None and int(base_version) != rec["version"]:
            raise Conflict(rec)
        now = time.time()
        merge = bool(autosave and rec.get("autosave") and rec.get("by") == by and not rec.get("recovered")
                     and 0 <= now - float(rec.get("run_started") or 0) < AUTOSAVE_RUN)
        name = doc.get("name") if isinstance(doc.get("name"), str) and doc["name"].strip() else rec["name"]
        new = {k: v for k, v in rec.items() if k != "recovered"}
        new.update(version=rec["version"] + 1, updated=now, by=by, summary=summary or "Changed", doc=doc,
                   name=name.strip()[:120], autosave=bool(autosave), run_started=rec.get("run_started") if merge else now)
        if requests is not None:
            new["requests"] = requests
        enc = _Encoded(new)
        _check_size(enc)
        snap = None if merge else _Encoded({k: v for k, v in rec.items() if k != "recovered"})
        cur_raw = _path(doc_id).stat().st_size if _path(doc_id).exists() else 0
        new_blobs = sum(len(d) for sha, d in enc.blobs.items() if not (_blob_dir(doc_id) / sha).exists())
        grow = len(enc.raw) - cur_raw + (len(snap.raw) if snap else 0) + new_blobs
        check_disk(grow)
        free_up = 0
        limit = limits(rec.get("owner"))
        if limit is not None:
            used = usage(rec.get("owner"))["bytes"]
            over = used + grow - limit[0]
            if over > 0:
                room = sum(int(e.get("bytes") or 0) for e in _hist_entries(doc_id)[0])
                if over > room:
                    raise _full(used, limit[0])
                free_up = over  # older versions of this file make the room
        entries, _ = _hist_entries(doc_id)
        if snap is not None:
            hist = _hist_dir(doc_id)
            hist.mkdir(exist_ok=True)
            _put_blobs(doc_id, snap.blobs)
            _write_bytes(hist / f"v{rec['version']}.json", snap.raw)
            entries = [{"version": rec["version"], "by": rec.get("by"), "summary": rec.get("summary"),
                        "updated": rec.get("updated"), "bytes": len(snap.raw), "blobs": sorted(snap.blobs)}] + \
                      [e for e in entries if e["version"] != rec["version"]]
        entries = _trim_history(doc_id, entries, free_up)
        _commit(dict(new, recovered=rec["recovered"]) if rec.get("recovered") else new, enc)
        _gc_blobs(doc_id, set(enc.blobs) | {b for e in entries for b in e.get("blobs") or ()})
        return new


# ----------------------------------------------------------------------------- version history

def _hist_entries(doc_id: str) -> tuple[list[dict], bool]:
    """Kept versions, newest first: [{version, by, summary, updated, bytes, blobs}], and whether the index file
    needs writing (versions kept before it existed are read once)."""
    hist = _hist_dir(doc_id)
    files = {}
    try:
        for p in hist.iterdir():
            m = re.fullmatch(r"v(\d+)\.json", p.name)
            if m:
                files[int(m.group(1))] = p
    except OSError:
        return [], False
    try:
        listed = {e["version"]: e for e in json.loads((hist / "versions.json").read_text()) if isinstance(e, dict)}
    except (OSError, ValueError, KeyError, TypeError):
        listed = {}
    out, stale = [], False
    for v, p in files.items():
        e = listed.get(v)
        if e is None:
            try:
                raw = p.read_bytes()
                r = json.loads(raw)
            except (OSError, ValueError):
                continue
            if not isinstance(r, dict):
                continue
            e = {"version": v, "by": r.get("by"), "summary": r.get("summary"), "updated": r.get("updated"),
                 "bytes": len(raw), "blobs": sorted(_refs(raw))}
            stale = True
        out.append(e)
    if len(out) != len(listed):
        stale = True
    return sorted(out, key=lambda e: -e["version"]), stale


def _trim_history(doc_id: str, entries: list[dict], free_up: int = 0) -> list[dict]:
    """Keep the newest versions: at most KEEP, at most HISTORY_MAX bytes (the newest always), then drop the oldest
    until `free_up` bytes are freed (a full quota). Writes the index. Returns what is kept."""
    keep, total = [], 0
    for i, e in enumerate(entries):
        n = int(e.get("bytes") or 0)
        if i == 0 or (len(keep) < KEEP and total + n <= HISTORY_MAX):
            keep.append(e)
            total += n
    freed = sum(int(e.get("bytes") or 0) for e in entries) - total  # what the limits above dropped already
    while free_up > freed and keep:
        freed += int(keep.pop().get("bytes") or 0)
    hist = _hist_dir(doc_id)
    gone = {e["version"] for e in entries} - {e["version"] for e in keep}
    for v in gone:
        (hist / f"v{v}.json").unlink(missing_ok=True)
    if hist.exists():
        _write(hist / "versions.json", keep)
    return keep


def _read_version(doc_id: str, version: int) -> dict:
    p = _hist_dir(doc_id) / f"v{int(version)}.json"
    try:
        old = json.loads(p.read_bytes())
    except FileNotFoundError:
        raise NotFound(f"Version {version} of {doc_id} is not kept") from None
    except ValueError:
        raise NotFound(f"Version {version} of {doc_id} is damaged") from None
    if not _record_ok(old):
        raise NotFound(f"Version {version} of {doc_id} is damaged")
    try:
        return _unpack(old, doc_id)
    except _BlobMissing:
        raise NotFound(f"Version {version} of {doc_id} is missing its imported data") from None


def undo(doc_id: str, by: str) -> dict:
    """Go back to the newest kept version that differs from the current one (stored as a new version, so it can be
    redone)."""
    with lock(doc_id):
        rec = get(doc_id)
        for e in _hist_entries(doc_id)[0]:
            if e["version"] >= rec["version"]:
                continue
            try:
                old = _read_version(doc_id, e["version"])
            except NotFound:
                continue
            if _same(rec, old["doc"], old.get("requests") or []):
                continue
            return save(doc_id, old["doc"], by, f"Undid: {rec.get('summary') or 'last change'}",
                        requests=old.get("requests") or [])
        raise NotFound(f"No earlier version of {doc_id}")


def versions(doc_id: str) -> list[dict]:
    """Earlier versions still kept, newest first: {version, by, summary, updated}."""
    entries, stale = _hist_entries(doc_id)
    if stale and _path(doc_id).exists():
        with lock(doc_id):
            entries, stale = _hist_entries(doc_id)
            if stale and _hist_dir(doc_id).exists():
                _write(_hist_dir(doc_id) / "versions.json", entries)
    return [{k: e.get(k) for k in ("version", "by", "summary", "updated")} for e in entries]


def get_version(doc_id: str, version: int) -> dict:
    """The record as it was at `version` (the current one, or one kept in history)."""
    m = meta(doc_id)
    if int(version) == int(m.get("version") or 0):
        rec = get(doc_id)
        if rec["version"] == int(version):
            return rec
    return _read_version(doc_id, version)


def restore(doc_id: str, version: int, by: str) -> dict:
    """Bring back an earlier version (as a new version, so nothing is lost)."""
    with lock(doc_id):
        old = _read_version(doc_id, version)
        return save(doc_id, old["doc"], by, f"Restored version {version}", requests=old.get("requests") or [])


def rename(doc_id: str, name: str, by: str = "you") -> dict:
    name = (name or "").strip()[:120]
    if not name:
        raise ValueError("Give the document a name.")
    with lock(doc_id):
        rec = get(doc_id)
        doc = dict(rec["doc"], name=name)
        return save(doc_id, doc, by, f"Renamed to {name}")


def duplicate(doc_id: str, owner: str | None, by: str = "you", name: str | None = None) -> dict:
    """A new document with the same model (history is not copied; the thumbnail is)."""
    src = get(doc_id)
    rec = create(name or f"{src['name']} copy", json.loads(json.dumps(src["doc"])), by=by, owner=owner,
                 summary=f"Copied from {src['name']}")
    old = _existing_thumb(doc_id)
    if old:
        ext = old["ext"]
        shutil.copyfile(_thumb_file(doc_id, ext), _thumb_file(rec["id"], ext))
        set_thumb_entry(rec["id"], dict(old, version=rec["version"], bytes=_thumb_file(rec["id"], ext).stat().st_size))
    return rec


def discard_if_untouched(doc_id: str) -> bool:
    """Remove a file New made and nobody used: still empty (no features, or no parts and components), still named
    "Part N" / "Assembly N", not in the Trash. True when it was removed."""
    with lock(doc_id):
        rec = get(doc_id)
        doc = rec["doc"]
        empty = (not doc.get("parts") and not doc.get("components")) if kind_of(doc) == "assembly" else not doc.get("features")
        if not empty or rec.get("deleted") or not re.fullmatch(r"(Part|Assembly) \d+", rec.get("name") or ""):
            return False
        purge(doc_id)
        return True


def hand_over(owner: str, trash: bool = False) -> int:
    """The documents of a removed account go to the server owner (owner None), into the Trash with trash=True
    (removed for good after TRASH_DAYS unless restored). Returns how many."""
    key = _owner_key(owner)
    ids = _index_ids(key) or set()
    moved = []
    for doc_id in sorted(ids):
        try:
            with lock(doc_id):
                rec = get(doc_id)
                if rec.get("owner") != owner:
                    continue
                _index_change(_owner_key(None), add=[doc_id])
                rec["owner"] = None
                if trash and not rec.get("deleted"):
                    rec["deleted"] = time.time()
                _commit(rec)
                moved.append(doc_id)
        except NotFound:
            continue
    _index_change(key, remove=ids)
    return len(moved)


def hand_over_orphans(known: set[str]) -> int:
    """Documents whose owner account no longer exists (removed before hand_over existed) go to the server owner's
    Trash. `known`: the ids of every account. Returns how many."""
    n = 0
    for p in _owners_dir().glob("*.json"):
        key = p.stem
        if key.startswith("_") or key in known or not valid_id(key):  # "_none", and owners that are not account ids
            continue
        n += hand_over(key, trash=True)
    return n


# ----------------------------------------------------------------------------- trash

def trash(doc_id: str) -> dict:
    """Move to the Trash (kept TRASH_DAYS days)."""
    with lock(doc_id):
        rec = get(doc_id)
        rec["deleted"] = time.time()
        _commit(rec)
        return meta(doc_id)


def untrash(doc_id: str) -> dict:
    with lock(doc_id):
        rec = get(doc_id)
        rec["deleted"] = None
        _commit(rec)
        return meta(doc_id)


def discard_untouched(doc_id: str) -> bool:
    """Remove a document exactly as New made it (version 1, by the person, empty, no bought-part requests, not in
    the Trash): the browser calls this when the person leaves a new file without touching it, so Files does not
    fill with empty "Part N" files. Anything else stays (edited, renamed, written by an AI). True when removed."""
    with lock(doc_id):
        try:
            rec = get(doc_id)
        except NotFound:
            return False
        empty = not any(_counts(rec.get("doc") or {}).values())
        if (rec.get("version") != 1 or rec.get("by") != "you" or rec.get("summary") != "Created" or rec.get("deleted")
                or rec.get("requests") or not empty):
            return False
        purge(doc_id)
        return True


def purge(doc_id: str) -> None:
    """Remove a document, its history, its picture and its published reviews for good."""
    with lock(doc_id):
        p = _path(doc_id)
        owner = (_read_meta(doc_id) or {}).get("owner")
        for f in (p, _meta_path(doc_id), _thumb_file(doc_id, "webp"), _thumb_file(doc_id, "png"), p.with_suffix(".damaged")):
            f.unlink(missing_ok=True)
        shutil.rmtree(_hist_dir(doc_id), ignore_errors=True)
        (data_dir() / "docs" / f"{doc_id}.lock").unlink(missing_ok=True)  # the document is gone for good
    try:
        _index_change(_owner_key(owner), remove=[doc_id])
    except OSError:
        log.warning("Could not take %s out of its owner's list", doc_id)
    try:  # a review link must not outlive the file (review.py; it stays importable without CAD in a worker)
        from . import review
        review.delete_for_doc(doc_id)
    except Exception:
        log.exception("Could not remove the published reviews of %s", doc_id)


# ----------------------------------------------------------------------------- thumbnails

def _thumb_file(doc_id: str, ext: str) -> Path:
    return _path(doc_id).with_suffix(f".thumb.{ext}")


def _existing_thumb(doc_id: str) -> dict | None:
    for ext in ("webp", "png"):
        f = _thumb_file(doc_id, ext)
        if f.exists():
            st = f.stat()
            return {"ext": ext, "version": 0, "source": "unknown", "updated": st.st_mtime, "bytes": st.st_size}
    return None


def set_thumb_entry(doc_id: str, entry: dict | None) -> None:
    with lock(doc_id):
        m = meta(doc_id)
        old = int((m.get("thumb") or {}).get("bytes") or 0)
        m["thumb"] = entry
        if m.get("disk") is not None:
            m["disk"] = int(m["disk"]) - old + int((entry or {}).get("bytes") or 0)
        _write(_meta_path(doc_id), m)


def set_thumb(doc_id: str, data: bytes, ext: str, version: int, source: str) -> dict:
    """Store a picture of the document at `version` ("browser" or "server")."""
    if ext not in ("webp", "png"):
        raise ValueError("Pictures must be WebP or PNG")
    if not data or len(data) > THUMB_MAX:
        raise ValueError("The picture is empty or too big")
    magic = data[:4] == b"\x89PNG" if ext == "png" else (data[:4] == b"RIFF" and data[8:12] == b"WEBP")
    if not magic:
        raise ValueError("That is not a WebP or PNG picture")
    with lock(doc_id):
        m = meta(doc_id)
        cur = m.get("thumb") or {}
        if cur and int(cur.get("version") or 0) > int(version) and source == "server":
            return cur  # a newer picture is already there
        grow = len(data) - int(cur.get("bytes") or 0)
        if grow > 0:
            check_disk(grow)
            limit = limits(m.get("owner"))
            if limit is not None:
                used = usage(m.get("owner"))["bytes"]
                if used + grow > limit[0]:
                    raise _full(used, limit[0])
        other = "png" if ext == "webp" else "webp"
        _write_bytes(_thumb_file(doc_id, ext), data)
        _thumb_file(doc_id, other).unlink(missing_ok=True)
        entry = {"ext": ext, "version": int(version), "source": source, "updated": time.time(), "bytes": len(data)}
        m["thumb"] = entry
        if m.get("disk") is not None:
            m["disk"] = int(m["disk"]) + grow
        _write(_meta_path(doc_id), m)
        return entry


def thumb(doc_id: str) -> tuple[Path, dict] | None:
    m = meta(doc_id)
    t = m.get("thumb")
    if t:
        f = _thumb_file(doc_id, t["ext"])
        if f.exists():
            return f, t
    return None


# ----------------------------------------------------------------------------- who sees what

def owner_of(user: dict | None) -> str | None:
    """The owner id new documents get: the account, or None without accounts (or the old server password)."""
    return user["id"] if user and not user.get("legacy") else None


def can_see(m: dict, user: dict | None) -> bool:
    """Each person sees their own documents. The server owner also sees documents with no owner (made before
    accounts, or by the old server-wide connector address). Without accounts everyone sees everything."""
    if user is None or user.get("legacy"):
        return True
    own = m.get("owner")
    return own == user["id"] or (own is None and user.get("role") == "owner")


class _Visible:
    """visible_to(user): a filter for listing() that also says whose index to read (owner_keys; None: everyone's)."""

    def __init__(self, user: dict | None):
        self.user = user
        if user is None or user.get("legacy"):
            self.owner_keys = None
        elif user.get("role") == "owner":
            self.owner_keys = [_owner_key(user["id"]), _owner_key(None)]
        else:
            self.owner_keys = [_owner_key(user["id"])]

    def __call__(self, m: dict) -> bool:
        return can_see(m, self.user)


def visible_to(user: dict | None):
    return _Visible(user)


# ----------------------------------------------------------------------------- listing

_unlistable: set[str] = set()  # documents already logged as unreadable (logged once, not on every listing)


def _meta_or_skip(doc_id: str) -> dict | None:
    """One document's meta for a listing; a document that cannot be read is logged and left out, never an error."""
    try:
        return meta(doc_id)
    except NotFound:
        return None
    except Exception:
        if doc_id not in _unlistable:
            _unlistable.add(doc_id)
            log.exception("Left document %s out of a listing: its files cannot be read", doc_id)
        return None


def _all_meta() -> list[dict]:
    out = []
    try:
        with os.scandir(data_dir() / "docs") as it:
            names = [e.name for e in it]
    except OSError:
        return out
    for name in names:
        if not name.endswith(".json") or name.endswith(".meta.json"):
            continue
        doc_id = name[:-5]
        if not valid_id(doc_id):
            continue
        m = _meta_or_skip(doc_id)
        if m is not None:
            out.append(m)
    return out


def _metas(keys) -> list[dict]:
    if keys is None:
        return _all_meta()
    out = []
    for key in keys:
        ids = _index_ids(key)
        if ids is None:  # the index file is damaged: rebuild it from the documents
            log.warning("Rebuilding the document list of %s", key)
            _index_change(key)
            ids = _index_ids(key) or set()
        for doc_id in ids:
            m = _meta_or_skip(doc_id)
            if m is not None:
                out.append(m)
    return out


def listing(visible=None, deleted: bool = False) -> list[dict]:
    """Documents newest first. visible(meta) -> bool filters by owner (visible_to(user) also limits the reading to
    that person's documents); deleted=True lists the Trash. Documents in the Trash longer than TRASH_DAYS are
    removed here."""
    out = []
    limit = time.time() - TRASH_DAYS * 86400
    for m in _metas(getattr(visible, "owner_keys", None)):
        if visible is not None and not visible(m):
            continue
        if m.get("deleted") and m["deleted"] < limit:
            with lock(m["id"]):  # still in the Trash and old (not restored a moment ago)?
                try:
                    fresh = meta(m["id"])
                except NotFound:
                    continue
                if fresh.get("deleted") and fresh["deleted"] < limit:
                    purge(m["id"])
                    continue
            m = fresh
        if bool(m.get("deleted")) != deleted:
            continue
        out.append(m)
    key = lambda r: -float((r.get("deleted") or r.get("updated") or 0) if deleted else (r.get("updated") or 0))
    return sorted(out, key=key)
