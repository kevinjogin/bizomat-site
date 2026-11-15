"""CAD Automation's status in BIZOMAT ERP: each account's computers, recent jobs and connected AI assistants, reported
to the ERP so its "Products and Engineering" page can show them by company (owner's request, 15 Nov 2026).

The ERP side is kevinjogin/bizomat-site, apps/work/src/worker/company/id-provider.ts (POST /company/api/id/cad-status)
and system/system.ts (cadFor: who sees which report):

    POST <provider>/api/id/cad-status        (bizomat_id.provider(): https://bizomat.ai/company)
    Authorization: Basic <client id "cad" : BIZOMAT_ID_CLIENT_SECRET>
    {"accounts": [{"email", "emailVerified", "sub", "computers": [...], "jobs": [...], "assistants": [...]}]}

Each account's report replaces its earlier one there. The ERP shows a report to the person whose BIZOMAT account id is
`sub`, or whose email both sides have confirmed, and to the owner and administrators of a registered company that
person belongs to. So only accounts whose email this server has proven are reported (accounts.confirmed_accounts:
the owner's own setup, a confirmed Google or BIZOMAT sign-in, or a link to one); an account whose email was only typed
is left out, because matching on it could show one person's computers to someone else. An account reported before
and no longer reported (removed, or its email changed) is withdrawn once: sent with emailVerified false, no `sub`
and empty lists, so the ERP's earlier report no longer matches anyone.

On only with the BIZOMAT client secret (bizomat_id.client(), the same switch as Sign in with BIZOMAT), and only on a
server with accounts. A background thread (never the event loop) reports every INTERVAL seconds, and soon after a
change: a computer connects or drops off, SOLIDWORKS starts or stops on it, a command finishes (changed(), called by
devicebridge and swbridge, only sets a flag). Changes are gathered for DEBOUNCE seconds, and rounds are at least
MIN_GAP apart, so the ERP's limit of 60 reports a minute per address is never near. Each request times out after
TIMEOUT seconds; failures back off up to BACKOFF_MAX. Nothing here can stop the server: every error is caught,
counted and shown to the owner (status(), on the Admin page).

What goes: the email, the BIZOMAT account id when linked, and per account at most 20 computers (name, online, the
SOLIDWORKS version and state, the add-in version, last seen), the last JOBS commands (id, the tool's plain name,
status, time) and 20 AI assistants (the app's name, when connected and last used). Never a token, key, secret, file
name, file path or document content; every text is cut to the ERP's limits, and a text that looks like a credential
is dropped. The ERP's optional `open` (the open document's name) is not sent. The Companion's version has no field
in the ERP's contract, so it is not sent either.
"""

from __future__ import annotations

import base64
import json
import os
import re
import tempfile
import threading
import time
from urllib.parse import quote

import httpx

INTERVAL = 180.0          # s between full reports
FIRST = 20.0              # s after start before the first one (computers reconnect after a restart)
DEBOUNCE = 10.0           # s a change waits, so a burst of changes is one report
MIN_GAP = 30.0            # s at least between two rounds
CHECK = 15.0              # s between looks at which computers are online (one that stops polling has no event)
TIMEOUT = 10.0            # s for each request
BACKOFF_FIRST = 60.0      # s after the first failure, doubling
BACKOFF_MAX = 1800.0
BATCH = 100               # accounts per request (the ERP takes 500)
MAX_BYTES = 512 * 1024    # per request; a bigger batch is split
JOBS = 10                 # recent commands per account (the ERP takes 20 and shows 5)
STATE = "erp_status.json"  # in the data folder: the emails reported (to withdraw them later) and the last outcome

# The ERP's limits (id-provider.ts, cadReport): text lengths are counted after trimming, in UTF-16 units.
ACCOUNTS_MAX, LIST_MAX = 500, 20
EMAIL_MAX, SUB_MAX, NAME_MAX, SW_MAX, ADDIN_MAX = 254, 64, 100, 60, 20
JOB_ID_MAX, TOOL_MAX, STATUS_MAX, APP_MAX = 64, 60, 30, 60
TIME_MAX = 4_102_444_800_000  # ms

# zod's email check (zod 4, regexes.email), so one odd address never makes the ERP refuse a whole batch.
_EMAIL = re.compile(r"(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}")
_CONTROL = re.compile(r"[\x00-\x1f\x7f]")
# Shapes of the credentials this server makes or carries (devicebridge._SECRET_VALUES and the os?_ tokens).
_SECRETISH = re.compile(r"(os[askr]_[A-Za-z0-9_-]{20,}|Bearer\s+\S{20,}|Basic\s+[A-Za-z0-9+/=]{16,}|eyJ[A-Za-z0-9_-]{10,}\."
                        r"|-----BEGIN [A-Z ]*PRIVATE KEY-----|KEVOS-Device\s)")


def _log(msg: str) -> None:
    print(f"OpenSketch ERP status: {msg}", flush=True)


# ----------------------------------------------------------------------------- settings

def client() -> tuple[str, str] | None:
    """(client id, secret) of the BIZOMAT client, or None: reporting is off (as Sign in with BIZOMAT)."""
    from . import bizomat_id
    return bizomat_id.client()


def enabled() -> bool:
    return client() is not None


def endpoint() -> str:
    from . import bizomat_id
    return bizomat_id.provider() + "/api/id/cad-status"


def basic(cid: str, secret: str) -> str:
    """HTTP Basic as OAuth clients send it (RFC 6749 2.3.1: each part form-encoded first); the ERP decodes both."""
    return "Basic " + base64.b64encode(f"{quote(cid, safe='')}:{quote(secret, safe='')}".encode()).decode()


# ----------------------------------------------------------------------------- the report

def _units(s: str) -> int:
    return len(s.encode("utf-16-le")) // 2


def fit(text, n: int) -> str:
    """Plain text within the ERP's limit: no control characters, trimmed, cut to n UTF-16 units; "" when empty or
    shaped like a credential."""
    s = _CONTROL.sub(" ", str(text or "")).strip()
    if _SECRETISH.search(s):
        return ""
    if _units(s) > n:
        while s and _units(s) > n:
            s = s[:-1]
        s = s.rstrip()
    return s


def _ms(t) -> int | None:
    try:
        v = int(float(t) * 1000)
    except (TypeError, ValueError):
        return None
    return min(max(v, 0), TIME_MAX)


def email_ok(email: str) -> bool:
    e = (email or "").strip()
    return 0 < len(e) <= EMAIL_MAX and _EMAIL.fullmatch(e) is not None


def sw_release(rev) -> str:
    """'30.5.0' -> '2022 SP5' (major + 1992; the minor is the service pack); '' when unreadable."""
    m = re.match(r"^(\d+)\.(\d+)", str(rev or ""))
    if not m or int(m.group(1)) <= 20:
        return ""
    return f"{int(m.group(1)) + 1992} SP{int(m.group(2))}"


def _instance_state(i: dict) -> str:
    name = sw_release(i.get("sw_revision")) or "running"
    if i.get("modal_dialog"):
        return name + ", dialog open"
    if i.get("busy"):
        return name + ", busy"
    if i.get("ui_responsive") is False:
        return name + ", not responding"
    return name + (", ready" if i.get("ui_responsive") else "")


def _installed(info: dict) -> str:
    years = sorted({str(int(x["year"])) for x in info.get("installations") or []
                    if isinstance(x, dict) and isinstance(x.get("year"), (int, float)) and 2000 < x["year"] < 2100})
    return " and ".join(years) + " installed" if years else ""


def _computer(row: dict) -> dict:
    """One paired computer as the ERP takes it."""
    from . import devicebridge
    s = devicebridge._sessions.get(row["id"])
    online = bool(s is not None and s.alive())
    try:
        info = json.loads(row.get("info") or "{}")
        info = info if isinstance(info, dict) else {}
    except ValueError:
        info = {}
    out: dict = {"name": fit(row.get("name"), NAME_MAX) or "Computer", "online": online}
    insts = [i for i in (s.instances if online and s is not None else []) or [] if isinstance(i, dict)]
    if online:
        sw = "; ".join(_instance_state(i) for i in insts[:3]) if insts else "not running" + (
            f", {_installed(info)}" if _installed(info) else "")
        if s.paused:
            sw += ", CAD Automation paused"
        active = next((i for i in insts if any(isinstance(d, dict) and d.get("active") for d in i.get("docs") or [])),
                      insts[0] if insts else None)
        addin = fit((active or {}).get("addin_version"), ADDIN_MAX)
        if addin:
            out["addin"] = addin
    else:
        sw = _installed(info)
    sw = fit(sw, SW_MAX)
    if sw:
        out["solidworks"] = sw
    seen = s.last_seen if s is not None else (row.get("last_seen") or row.get("created"))
    out["lastSeen"] = _ms(seen)
    return out


def _direct_link(uid: str) -> dict | None:
    """The add-in's direct link (swbridge, no Companion), while this server knows of one."""
    from . import swbridge
    s = swbridge._sessions.get(uid)
    if s is None:
        return None
    info = s.info or {}
    machine = fit(info.get("machine"), NAME_MAX - 14)
    out: dict = {"name": f"{machine} (direct link)" if machine else "Direct link", "online": bool(s.alive())}
    sw = fit(sw_release(info.get("sw_version")) or ("running" if s.alive() else ""), SW_MAX)
    if sw and s.alive():
        out["solidworks"] = sw
    addin = fit(info.get("version"), ADDIN_MAX)
    if addin:
        out["addin"] = addin
    out["lastSeen"] = _ms(s.last_seen)
    return out


def computers(uid: str) -> list[dict]:
    from . import devicebridge
    out = [_computer(r) for r in devicebridge.devices_for({"id": uid})]
    v1 = _direct_link(uid)
    if v1 is not None:
        out.append(v1)
    out.sort(key=lambda c: (not c["online"], -(c.get("lastSeen") or 0)))
    return out[:LIST_MAX]


def jobs(uid: str) -> list[dict]:
    """The last commands to the person's paired computers: the tool's plain name, the status and when it last changed.
    Never the parameters, results or files (direct-link commands are not recorded)."""
    from . import devicebridge
    out = []
    for c in devicebridge.recent_commands({"id": uid}, JOBS):
        try:
            at = _ms(devicebridge.parse_iso(c["updated_at"]))
        except (KeyError, TypeError, ValueError):
            continue
        job = {"id": fit(c.get("id"), JOB_ID_MAX), "tool": fit(c.get("title") or c.get("tool"), TOOL_MAX) or "Command",
               "status": fit(c.get("status"), STATUS_MAX) or "unknown", "at": at}
        if job["id"]:
            out.append(job)
    return out[:LIST_MAX]


def assistants(uid: str) -> list[dict]:
    """The AI apps connected to the account: their name and times, never a token."""
    from . import mcpauth
    return [{"app": fit(g.get("name"), APP_MAX) or "AI app", "connectedAt": _ms(g.get("created")),
             "lastUsed": _ms(g.get("last_used")) if g.get("last_used") else None}
            for g in mcpauth.grants_for(uid)][:LIST_MAX]


def account_report(acc: dict) -> dict:
    out = {"email": acc["email"].strip().lower(), "emailVerified": True, "computers": computers(acc["id"]),
           "jobs": jobs(acc["id"]), "assistants": assistants(acc["id"])}
    sub = str(acc.get("bizomat") or "").strip()
    out["sub"] = sub if 0 < len(sub) <= SUB_MAX and not _CONTROL.search(sub) else None
    return out


def withdrawal(email: str) -> dict:
    """What withdraws an earlier report: no proven email, no BIZOMAT id, nothing listed."""
    return {"email": email, "emailVerified": False, "sub": None, "computers": [], "jobs": [], "assistants": []}


def build() -> tuple[list[dict], int]:
    """(this server's reports, how many accounts were left out because their email is not proven)."""
    from . import accounts
    users = accounts.list_users()
    confirmed = [a for a in accounts.confirmed_accounts() if email_ok(a["email"])]
    return [account_report(a) for a in confirmed], max(0, len(users) - len(confirmed))


def batches(entries: list[dict]) -> list[list[dict]]:
    """At most BATCH accounts and MAX_BYTES of JSON per request."""
    out: list[list[dict]] = []
    cur: list[dict] = []
    size = 20
    for e in entries:
        n = len(json.dumps(e, separators=(",", ":")).encode()) + 1
        if cur and (len(cur) >= min(BATCH, ACCOUNTS_MAX) or size + n > MAX_BYTES):
            out.append(cur)
            cur, size = [], 20
        cur.append(e)
        size += n
    if cur:
        out.append(cur)
    return out


# ----------------------------------------------------------------------------- sending

class Refused(Exception):
    """A report that did not get through, with a plain reason for the owner (never a response body's content)."""

    def __init__(self, message: str, retry_after: float = 0.0):
        super().__init__(message)
        self.retry_after = retry_after


def _issue(r: httpx.Response) -> str:
    """The first problem the ERP named in a 400 (its path and message: indexes and zod's words, never a value)."""
    try:
        d = r.json().get("details") or r.json().get("issues") or []
        i = d[0] if isinstance(d, list) and d else {}
        path, msg = fit(i.get("path"), 80), fit(i.get("message"), 120)
        return f": {path} {msg}".rstrip() if path or msg else ""
    except Exception:
        return ""


def post(http: httpx.Client, url: str, auth: str, accounts: list[dict], secret: str = "") -> None:
    body = json.dumps({"accounts": accounts}, separators=(",", ":"), ensure_ascii=False).encode()
    if secret and secret.encode() in body:  # cannot happen (every text went through fit); never sent if it did
        raise Refused("A report held the client secret, so it was not sent.")
    try:
        r = http.post(url, content=body, headers={"Authorization": auth, "Content-Type": "application/json",
                                                  "Accept": "application/json", "User-Agent": "BIZOMAT-CAD-Automation"})
    except httpx.TimeoutException:
        raise Refused(f"BIZOMAT ERP did not answer within {int(TIMEOUT)} s.") from None
    except httpx.HTTPError as e:
        raise Refused(f"Could not reach BIZOMAT ERP ({type(e).__name__}).") from None
    if r.status_code == 200:
        return
    if r.status_code == 401:
        raise Refused("BIZOMAT ERP did not accept the client secret (401). The secret on this server and the SHA-256 "
                      "in BIZOMAT's client list must come from the same secret.")
    if r.status_code == 403:
        raise Refused("BIZOMAT ERP takes CAD status only from the client cad (403).")
    if r.status_code == 404:
        raise Refused("BIZOMAT ERP has no CAD status address here (404).")
    if r.status_code == 400:
        raise Refused("BIZOMAT ERP refused the report (400" + _issue(r) + ").")
    if r.status_code == 429:
        try:
            wait = float(r.headers.get("retry-after") or 60)
        except ValueError:
            wait = 60.0
        raise Refused("BIZOMAT ERP asked to send less often (429).", retry_after=min(max(wait, 1.0), BACKOFF_MAX))
    raise Refused(f"BIZOMAT ERP answered {r.status_code}.")


def _state_file():
    from . import store
    return store.data_dir() / STATE


def _load_state() -> dict:
    try:
        d = json.loads(_state_file().read_text())
        return d if isinstance(d, dict) else {}
    except (OSError, ValueError):
        return {}


def _save_state(d: dict) -> None:
    p = _state_file()
    fd, tmp = tempfile.mkstemp(dir=p.parent, prefix=".erp_status.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as f:
            json.dump(d, f)
        os.chmod(tmp, 0o600)
        os.replace(tmp, p)
    except OSError:
        try:
            os.unlink(tmp)
        except OSError:
            pass


def _fingerprint() -> frozenset:
    """What a person sees change at once: which computers (and direct links) are online, paused, and which SOLIDWORKS
    and add-in run there. Read from memory only, so it is cheap to look at every CHECK seconds."""
    from . import devicebridge, swbridge
    out = set()
    for did, s in devicebridge._sessions.copy().items():
        insts = tuple((str(i.get("sw_revision") or ""), str(i.get("addin_version") or ""), bool(i.get("modal_dialog")))
                      for i in (s.instances or []) if isinstance(i, dict))
        out.add(("computer", did, s.alive(), bool(s.paused), insts))
    for pid, s in swbridge._sessions.copy().items():
        out.add(("direct", pid, s.alive()))
    return frozenset(out)


class Reporter:
    """The background thread. One per server process (start())."""

    def __init__(self):
        st = _load_state()
        self.reported: set[str] = {e for e in st.get("reported") or [] if isinstance(e, str)}
        self.last_ok: float | None = st.get("last_ok")
        self.last_ok_accounts: int = int(st.get("last_ok_accounts") or 0)
        self.last_error: dict | None = st.get("last_error")
        self.left_out: int = int(st.get("left_out") or 0)
        self.failures = 0
        self.rounds = 0
        self._stop = threading.Event()
        self._wake = threading.Event()
        self._dirty: float | None = None
        self._fp: frozenset | None = None
        self._last_try = 0.0
        self._gap = MIN_GAP
        self._hold_until = 0.0
        self._next_full = time.monotonic() + FIRST
        self._thread: threading.Thread | None = None

    # --- control (any thread; never blocks)
    def nudge(self) -> None:
        if self._dirty is None:
            self._dirty = time.monotonic()
        self._wake.set()

    def start(self) -> None:
        self._thread = threading.Thread(target=self._run, name="erp-status", daemon=True)
        self._thread.start()

    def stop(self, wait: float = 2.0) -> None:
        self._stop.set()
        self._wake.set()
        if self._thread is not None:
            self._thread.join(timeout=wait)

    def alive(self) -> bool:
        return self._thread is not None and self._thread.is_alive()

    # --- the loop (its own thread)
    def _due(self) -> float:
        due = self._next_full
        if self._dirty is not None:
            due = min(due, max(self._dirty + DEBOUNCE, self._last_try + self._gap))
        return max(due, self._hold_until)

    def _run(self) -> None:
        while not self._stop.is_set():
            try:
                wait = min(max(self._due() - time.monotonic(), 0.0), CHECK)
                if wait > 0:
                    self._wake.wait(wait)
                    self._wake.clear()
                if self._stop.is_set():
                    break
                fp = _fingerprint()
                if self._fp is not None and fp != self._fp and self._dirty is None:
                    self._dirty = time.monotonic()
                if self._fp is None:
                    self._fp = fp
                if time.monotonic() >= self._due():
                    self.round()
            except Exception as e:  # the loop itself must never end on an error
                self._failed(f"Internal error ({type(e).__name__}).")
                self._stop.wait(5.0)

    def round(self) -> bool:
        """One report of every account (split into requests). True when everything went through."""
        self._dirty = None
        self._fp = _fingerprint()
        self._last_try = time.monotonic()
        self.rounds += 1
        cs = client()
        if cs is None:
            self._next_full = time.monotonic() + INTERVAL
            return False
        from . import accounts
        if not accounts.any_users():  # open or setup mode: nobody to report
            self._next_full = time.monotonic() + INTERVAL
            return False
        try:
            reports, left_out = build()
        except Exception as e:
            self._failed(f"Could not read this server's accounts ({type(e).__name__}).")
            return False
        self.left_out = left_out
        current = {r["email"] for r in reports}
        gone = sorted(e for e in self.reported if e not in current and email_ok(e))
        parts = batches(reports + [withdrawal(e) for e in gone])
        self._gap = max(MIN_GAP, 2.0 * len(parts))
        url, auth = endpoint(), basic(*cs)
        sent: set[str] = set()
        withdrawn: set[str] = set()
        try:
            with httpx.Client(timeout=TIMEOUT, follow_redirects=False) as http:
                for part in parts:
                    if self._stop.is_set():  # the server is stopping: the rest goes with the next start
                        self.reported = (self.reported - withdrawn) | sent
                        self._save()
                        return False
                    post(http, url, auth, part, cs[1])
                    for a in part:
                        (sent if a["emailVerified"] else withdrawn).add(a["email"])
        except Refused as e:
            self.reported = (self.reported - withdrawn) | sent
            self._failed(str(e), e.retry_after)
            return False
        self.reported = (self.reported - withdrawn) | sent
        was = self.failures
        self.failures = 0
        self.last_ok, self.last_ok_accounts = time.time(), len(reports)
        self._hold_until = 0.0
        self._next_full = time.monotonic() + INTERVAL
        if self.rounds == 1 or was:
            _log(f"reported {len(reports)} accounts in {len(parts)} requests"
                 + (f", withdrew {len(withdrawn)}" if withdrawn else "") + (f", after {was} failed" if was else ""))
        self._save()
        return True

    def _failed(self, message: str, retry_after: float = 0.0) -> None:
        self.failures += 1
        delay = min(BACKOFF_MAX, BACKOFF_FIRST * 2 ** min(self.failures - 1, 10))
        delay = max(delay, retry_after)
        self._hold_until = time.monotonic() + delay
        self._next_full = self._hold_until
        self.last_error = {"at": time.time(), "message": message}
        if self.failures in (1, 10) or self.failures % 100 == 0:
            _log(f"{message} ({self.failures} in a row; next try in {int(delay)} s)")
        self._save()

    def _save(self) -> None:
        _save_state({"reported": sorted(self.reported), "last_ok": self.last_ok, "last_ok_accounts": self.last_ok_accounts,
                     "last_error": self.last_error, "left_out": self.left_out})

    def status(self) -> dict:
        return {"on": True, "running": self.alive(), "address": endpoint(), "every_s": int(INTERVAL),
                "last_ok": self.last_ok, "accounts": self.last_ok_accounts, "left_out": self.left_out,
                "last_error": self.last_error, "failures": self.failures}


# ----------------------------------------------------------------------------- the server's one reporter

_reporter: Reporter | None = None
_lock = threading.Lock()


def start() -> Reporter | None:
    """Called by the server at start (server.lifespan): a reporter when the BIZOMAT client secret is set."""
    global _reporter
    with _lock:
        if _reporter is not None and _reporter.alive():
            return _reporter
        if not enabled():
            _reporter = None
            return None
        _reporter = Reporter()
        _reporter.start()
    _log(f"on: every {int(INTERVAL)} s and soon after a change, to {endpoint()}")
    return _reporter


def stop() -> None:
    global _reporter
    with _lock:
        r, _reporter = _reporter, None
    if r is not None:
        r.stop()


def changed() -> None:
    """Something a report shows changed (a computer connected or dropped off, a command finished): report soon.
    Cheap and safe from any thread or the event loop: it only sets a flag."""
    r = _reporter
    if r is not None:
        r.nudge()


def status() -> dict:
    """For the owner's Admin page: on or off, the last report that went through, the last error."""
    r = _reporter
    if r is not None and enabled():
        return r.status()
    st = _load_state() if enabled() else {}
    return {"on": enabled(), "running": False, "address": endpoint() if enabled() else None, "every_s": int(INTERVAL),
            "last_ok": st.get("last_ok"), "accounts": int(st.get("last_ok_accounts") or 0),
            "left_out": int(st.get("left_out") or 0), "last_error": st.get("last_error"), "failures": 0}
