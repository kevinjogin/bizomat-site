"""Malware scanning of BIZOMAT ERP's verification documents, on this server (owner, 19 Nov 2026).

Companies upload registration documents (PDF, PNG or JPEG, at most 10 MB) for a platform admin to review by hand.
No document may be opened or accepted before ClamAV has scanned it clean. ClamAV needs about 1 GB of memory while it
scans (measured: ClamAV 1.5.4 with the full signature set, 1,000 MB at its peak, about 12 s a file), and BIZOMAT's
own Machines have 512 MB. This server's Machine has 2 GB, so the owner chose to run the scanner here rather than add
a Machine. The ERP side is kevinjogin/bizomat-site, apps/work/src/worker/company/scan.ts:

    POST <provider>/api/id/scan/next     Authorization: Basic <client "cad" : BIZOMAT_ID_CLIENT_SECRET>
        204: nothing is waiting.  200: one document's bytes, with X-Scan-Id and X-Scan-Sha256.
    POST <provider>/api/id/scan/result   the same credentials, JSON
        {"id", "sha256", "verdict": "clean" | "infected" | "error", "signature", "engine", "database"}

This server asks; the ERP never calls in, so there is no new open address and no new secret: the same client and
secret as Sign in with BIZOMAT and the status report (erpstatus.py). The ERP hands out documents only while its flag
evidence_scanning is on, so nothing is fetched before then.

How it runs: one background thread ("evidence-scan", started and stopped by server.lifespan, never on the event loop).
It scans one document at a time, only while the Machine has at least MIN_FREE_MB of memory free (CAD work comes first:
a scan waits rather than take memory a CAD worker needs), at the lowest CPU priority, with a time limit. The document is
written to a private temporary folder, checked against the ERP's SHA-256, scanned and deleted at once; it is never
kept, logged or shown. Signatures are fetched with freshclam into SIG_DIR (the Machine's own disk, not the volume)
when the first document comes, then every UPDATE_EVERY seconds, without freshclam's test load (which needs as much memory as a scan). Anything that goes
wrong is an "error" verdict or a wait, never a reason for the server to stop.

Off unless the BIZOMAT client secret is set (bizomat_id.client()) and clamscan and freshclam are installed (the image
installs them); OPENSKETCH_EVIDENCE_SCAN=0 turns it off.
"""

from __future__ import annotations

import base64
import hashlib
import os
import re
import shutil
import subprocess
import tempfile
import threading
import time
from pathlib import Path
from urllib.parse import quote

import httpx

POLL = 60.0               # s between asks when nothing is waiting
NEXT_SOON = 2.0           # s after a scan, so a queue drains
LOW_MEMORY_WAIT = 30.0    # s before looking again when memory is short
TIMEOUT = 30.0            # s for each request to the ERP
SCAN_TIMEOUT = 240.0      # s for one scan (loading the signatures is most of it)
UPDATE_TIMEOUT = 600.0    # s for one signature update
UPDATE_EVERY = 6 * 3600.0  # s between signature updates (ClamAV asks for no more than one an hour)
UPDATE_RETRY = 3600.0     # s before trying again after a failed update
BACKOFF_FIRST = 60.0
BACKOFF_MAX = 1800.0
MAX_BYTES = 10 * 1024 * 1024  # the ERP's own limit for a document
_ID = re.compile(r"^[A-Za-z0-9_-]{8,64}$")
_HEX64 = re.compile(r"^[0-9a-f]{64}$")


def _log(msg: str) -> None:
    print(f"OpenSketch evidence scan: {msg}", flush=True)


# ----------------------------------------------------------------------------- settings

def client() -> tuple[str, str] | None:
    from . import bizomat_id
    return bizomat_id.client()


def clamscan() -> str | None:
    return os.environ.get("OPENSKETCH_CLAMSCAN") or shutil.which("clamscan")


def freshclam() -> str | None:
    return os.environ.get("OPENSKETCH_FRESHCLAM") or shutil.which("freshclam")


def sig_dir() -> Path:
    return Path(os.environ.get("OPENSKETCH_CLAMAV_DB") or "/var/lib/clamav")


def min_free_mb() -> int:
    try:
        return max(0, int(os.environ.get("OPENSKETCH_SCAN_MIN_FREE_MB", "1300")))
    except ValueError:
        return 1300


def enabled() -> bool:
    if (os.environ.get("OPENSKETCH_EVIDENCE_SCAN") or "").strip() == "0":
        return False
    return client() is not None and bool(clamscan()) and bool(freshclam())


def endpoint(path: str) -> str:
    from . import bizomat_id
    return bizomat_id.provider() + "/api/id/scan/" + path


def basic(cid: str, secret: str) -> str:
    return "Basic " + base64.b64encode(f"{quote(cid, safe='')}:{quote(secret, safe='')}".encode()).decode()


# ----------------------------------------------------------------------------- memory

def free_mb() -> int | None:
    """Memory free for a scan, in MB: MemAvailable, and the container's own limit where there is one. None: unknown
    (not Linux), and then nothing is scanned."""
    avail = None
    try:
        for line in Path("/proc/meminfo").read_text().splitlines():
            if line.startswith("MemAvailable:"):
                avail = int(line.split()[1]) // 1024
                break
    except (OSError, ValueError, IndexError):
        return None
    try:
        limit = Path("/sys/fs/cgroup/memory.max").read_text().strip()
        if limit != "max":
            used = int(Path("/sys/fs/cgroup/memory.current").read_text().strip())
            room = (int(limit) - used) // (1024 * 1024)
            avail = room if avail is None else min(avail, room)
    except (OSError, ValueError):
        pass
    return avail


# ----------------------------------------------------------------------------- ClamAV

def signatures_ready() -> bool:
    d = sig_dir()
    has = lambda name: (d / f"{name}.cvd").exists() or (d / f"{name}.cld").exists()  # noqa: E731
    return has("main") and has("daily")


def update_signatures() -> tuple[bool, str]:
    """Fetches or refreshes the signatures. Returns (ok, a short reason)."""
    exe = freshclam()
    if not exe:
        return False, "freshclam is not installed"
    d = sig_dir()
    d.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="freshclam-") as tmp:
        conf = Path(tmp) / "freshclam.conf"
        conf.write_text(
            f"DatabaseDirectory {d}\n"
            "DatabaseMirror database.clamav.net\n"
            # the root user of this container owns the files
            "DatabaseOwner root\n"
            # freshclam's test load needs as much memory as a scan: each scan loads the signatures anyway
            "TestDatabases no\n"
            "Foreground yes\n"
            "LogTime no\n"
        )
        try:
            r = subprocess.run(["nice", "-n", "19", exe, f"--config-file={conf}", "--stdout", "--no-warnings"],
                               capture_output=True, text=True, timeout=UPDATE_TIMEOUT)
        except subprocess.TimeoutExpired:
            return False, "the signature update took too long"
        except OSError as e:
            return False, f"freshclam could not run ({type(e).__name__})"
    if r.returncode != 0:
        tail = (r.stdout or r.stderr or "").strip().splitlines()[-1:] or [""]
        return False, f"freshclam failed ({r.returncode}): {tail[0][:160]}"
    return signatures_ready(), "updated" if signatures_ready() else "freshclam ran but the signatures are missing"


def database_version() -> str:
    exe = clamscan()
    if not exe:
        return ""
    try:
        r = subprocess.run([exe, "--version", f"--database={sig_dir()}"], capture_output=True, text=True, timeout=60)
        return (r.stdout or "").strip()[:100]
    except (OSError, subprocess.TimeoutExpired):
        return ""


def scan_file(path: Path) -> tuple[str, str]:
    """(verdict, signature): ("clean", ""), ("infected", the signature's name) or ("error", why).

    Files over ClamAV's limits and encrypted documents count as infected (they cannot be checked), so they are never
    opened by a reviewer: the company is asked for another copy."""
    exe = clamscan()
    if not exe:
        return "error", "clamscan is not installed"
    cmd = ["nice", "-n", "19", exe, "--no-summary", "--stdout", f"--database={sig_dir()}",
           "--max-filesize=12M", "--max-scansize=64M", "--alert-exceeds-max=yes", "--alert-encrypted=yes",
           "--alert-broken-media=yes", str(path)]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=SCAN_TIMEOUT)
    except subprocess.TimeoutExpired:
        return "error", "the scan took too long"
    except OSError as e:
        return "error", f"clamscan could not run ({type(e).__name__})"
    out = r.stdout or ""
    if r.returncode == 0:
        return "clean", ""
    if r.returncode == 1:
        m = re.search(r":\s*(.+?)\s+FOUND\s*$", out, re.M)
        return "infected", (m.group(1) if m else "unnamed")[:200]
    return "error", f"clamscan failed ({r.returncode})"


# ----------------------------------------------------------------------------- the ERP

class Refused(Exception):
    pass


def ask_next(http: httpx.Client, auth: str) -> tuple[str, str, bytes] | None:
    """The next document waiting for a scan: (id, sha256, bytes), or None when nothing waits."""
    r = http.post(endpoint("next"), headers={"Authorization": auth, "Accept": "application/octet-stream"})
    if r.status_code == 204:
        return None
    if r.status_code != 200:
        raise Refused(f"the ERP answered {r.status_code} for the next document")
    doc_id, sha = r.headers.get("X-Scan-Id", ""), r.headers.get("X-Scan-Sha256", "").lower()
    if not _ID.match(doc_id) or not _HEX64.match(sha):
        raise Refused("the ERP's answer did not name the document")
    body = r.content
    if not body or len(body) > MAX_BYTES:
        return doc_id, sha, b""
    return doc_id, sha, body


def send_result(http: httpx.Client, auth: str, result: dict) -> None:
    r = http.post(endpoint("result"), headers={"Authorization": auth}, json=result)
    if r.status_code not in (200, 409):  # 409: the ERP already has a verdict for it (a retry after a lost answer)
        raise Refused(f"the ERP answered {r.status_code} to a verdict")


def scan_bytes(doc_id: str, sha: str, body: bytes) -> dict:
    """Scans one document in a private temporary folder and deletes it at once. Returns the verdict for the ERP."""
    result = {"id": doc_id, "sha256": sha, "verdict": "error", "signature": "", "engine": "ClamAV", "database": ""}
    if not body:
        result["signature"] = "the document was empty or over 10 MB"
        return result
    if hashlib.sha256(body).hexdigest() != sha:
        result["signature"] = "the document did not match its SHA-256"
        return result
    with tempfile.TemporaryDirectory(prefix="evidence-") as tmp:
        os.chmod(tmp, 0o700)
        path = Path(tmp) / "document"
        path.write_bytes(body)
        verdict, detail = scan_file(path)
    result["verdict"], result["signature"] = verdict, detail
    result["database"] = database_version()
    return result


# ----------------------------------------------------------------------------- the thread

class Scanner:
    def __init__(self):
        self.scans = 0
        self.infected = 0
        self.last_scan: float | None = None
        self.last_error: dict | None = None
        self.last_update: float | None = None
        self.failures = 0
        self._update_tried = 0.0
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        self._thread = threading.Thread(target=self._run, name="evidence-scan", daemon=True)
        self._thread.start()

    def stop(self, wait: float = 2.0) -> None:
        self._stop.set()
        if self._thread is not None:
            self._thread.join(timeout=wait)

    def alive(self) -> bool:
        return self._thread is not None and self._thread.is_alive()

    def _failed(self, message: str) -> float:
        self.failures += 1
        self.last_error = {"at": time.time(), "message": message}
        if self.failures in (1, 5) or self.failures % 20 == 0:
            _log(message)
        return min(BACKOFF_FIRST * 2 ** (self.failures - 1), BACKOFF_MAX)

    def _signatures(self) -> bool:
        now = time.monotonic()
        stale = self.last_update is None or now - self.last_update > UPDATE_EVERY
        if (stale or not signatures_ready()) and now - self._update_tried > (UPDATE_RETRY if self._update_tried else 0):
            self._update_tried = now
            ok, why = update_signatures()
            if ok:
                self.last_update = now
                self._update_tried = 0.0
            else:
                self.last_error = {"at": time.time(), "message": why}
                _log(why)
        return signatures_ready()

    def step(self) -> float:
        """One look: returns the seconds to wait before the next."""
        cs = client()
        if cs is None:
            return POLL
        free = free_mb()
        if free is None or free < min_free_mb():
            return LOW_MEMORY_WAIT
        # Signatures already here are kept fresh; none are fetched until a document comes (the ERP hands out nothing
        # while its flag is off, so a server that never scans never downloads them).
        if signatures_ready() and self.last_update is not None:
            self._signatures()
        auth = basic(*cs)
        try:
            with httpx.Client(timeout=TIMEOUT, follow_redirects=False) as http:
                doc = ask_next(http, auth)
                if doc is None:
                    self.failures = 0
                    return POLL
                if not self._signatures():
                    # Not scanned: the ERP hands it out again after its claim ends.
                    return POLL
                result = scan_bytes(*doc)
                send_result(http, auth, result)
        except (httpx.HTTPError, Refused) as e:
            return self._failed(str(e) if isinstance(e, Refused) else f"the ERP could not be reached ({type(e).__name__})")
        self.failures = 0
        self.scans += 1
        self.last_scan = time.time()
        if result["verdict"] == "infected":
            self.infected += 1
        return NEXT_SOON

    def _run(self) -> None:
        self._stop.wait(20.0)  # let the server settle after a start
        while not self._stop.is_set():
            try:
                wait = self.step()
            except Exception as e:  # the loop itself must never end on an error
                wait = self._failed(f"internal error ({type(e).__name__})")
            self._stop.wait(wait)

    def status(self) -> dict:
        return {"on": True, "running": self.alive(), "scans": self.scans, "infected": self.infected,
                "last_scan": self.last_scan, "signatures": signatures_ready(), "last_update": self.last_update,
                "last_error": self.last_error, "min_free_mb": min_free_mb()}


_scanner: Scanner | None = None
_lock = threading.Lock()


def start() -> Scanner | None:
    global _scanner
    with _lock:
        if _scanner is not None and _scanner.alive():
            return _scanner
        if not enabled():
            _scanner = None
            return None
        _scanner = Scanner()
        _scanner.start()
    _log(f"on: one document at a time, when {min_free_mb()} MB are free, from {endpoint('next')}")
    return _scanner


def stop() -> None:
    global _scanner
    with _lock:
        s, _scanner = _scanner, None
    if s is not None:
        s.stop()


def status() -> dict:
    s = _scanner
    if s is not None:
        return s.status()
    return {"on": enabled(), "running": False}
