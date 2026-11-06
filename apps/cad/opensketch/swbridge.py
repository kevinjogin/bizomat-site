"""The link between the AI app (the sw_ tools in sw_tools.py) and SOLIDWORKS on the user's own PC.

The OpenSketch add-in for SOLIDWORKS (solidworks/ in this repo) connects OUT to this server, so the PC needs no
open port and works behind a company firewall or proxy:

1. POST /mcp/sw/hello with its SOLIDWORKS key (Authorization: Bearer oss_...) -> a session id.
2. GET /mcp/sw/next?session=... waits up to WAIT seconds and answers one command {id, op, args} or 204.
3. It runs the command in SOLIDWORKS and posts {session, id, ok, result | error} to /mcp/sw/result.
   Files it produces (STEP, STL, PNG) go up first with POST /mcp/sw/file?session=&id=&name= (raw bytes).
   Files for SOLIDWORKS (a STEP to import) come down from GET /mcp/sw/blob/<id>.

A tool calls `await call(person, op, args)` and gets the result (and any uploaded files) back. One SOLIDWORKS
per person: a new hello replaces the old session (the old one is told to stop).

The key is per person: HMAC of a data-folder secret over the person's id and a counter, so New key on the
home page voids the old key. It reaches only the bridge (not the account, not the MCP endpoints).
"""

from __future__ import annotations

import asyncio
import hashlib
import hmac
import itertools
import json
import os
import secrets
import threading
import time
from collections import deque

from . import auth, store

WAIT = 25                       # s a poll is held open
ALIVE = 70                      # s since the last poll for SOLIDWORKS to count as connected
DEFAULT_TIMEOUT = 240           # s a tool waits for SOLIDWORKS
MAX_FILE = 128 * 1024 * 1024    # one uploaded file
MAX_FILES_PER_CMD = 256 * 1024 * 1024  # held in the web server's memory until the tool has them
BLOB_LIFETIME = 900             # s a file for SOLIDWORKS stays downloadable
BLOBS_PER_PERSON = 2            # files waiting for SOLIDWORKS per person (the oldest goes first)
PROTOCOL = 1

_lock = threading.Lock()


class BridgeError(Exception):
    """A command that did not reach SOLIDWORKS or did not come back (not a SOLIDWORKS error). `code` is the
    machine-readable reason (docs/BRIDGE-PROTOCOL.md, error codes) when there is one."""

    def __init__(self, message: str = "", code: str | None = None):
        super().__init__(message)
        self.code = code


class Gone(Exception):
    """The session is over: `reason` "restarted" (the server lost it: say hello again), "replaced" (another
    SOLIDWORKS connected with this key) or "closed" (the key was renewed)."""

    def __init__(self, message: str, reason: str = "closed"):
        super().__init__(message)
        self.reason = reason


# ----------------------------------------------------------------------------- keys

def person_id(user: dict | None) -> str:
    return user["id"] if user else "local"


def _keys_file():
    return store.data_dir() / "swbridge.json"


def _counters() -> dict:
    try:
        return json.loads(_keys_file().read_text()).get("keys", {})
    except (OSError, ValueError):
        return {}


def _key(pid: str, n: int) -> str:
    mac = hmac.new(auth.data_secret("solidworks-bridge"), f"{pid}:{n}".encode(), hashlib.sha256).hexdigest()
    return "oss_" + mac[:40]


def key_for(user: dict | None) -> str:
    pid = person_id(user)
    return _key(pid, int(_counters().get(pid, 0)))


def new_key(user: dict | None) -> str:
    """Void the person's key and make a new one (New key on the home page)."""
    pid = person_id(user)
    _retired[hashlib.sha256(key_for(user).encode()).hexdigest()] = time.time()
    with _lock:
        data = {"keys": _counters()}
        data["keys"][pid] = int(data["keys"].get(pid, 0)) + 1
        tmp = _keys_file().with_name(f"swbridge.{secrets.token_hex(4)}.tmp")
        tmp.write_text(json.dumps(data))
        os.replace(tmp, _keys_file())
    drop(pid, "A new SOLIDWORKS key was made; connect again with it.")
    return key_for(user)


_retired: dict[str, float] = {}  # sha256 of keys voided by new_key (this server run): a clearer refusal


def retired(token: str) -> bool:
    return hashlib.sha256((token or "").encode()).hexdigest() in _retired


def resolve(token: str) -> tuple[bool, dict | None]:
    """(valid, person) for a SOLIDWORKS key."""
    if not token or not token.startswith("oss_"):
        return False, None
    from . import accounts
    counters = _counters()
    users = accounts.list_users()
    if not users and not auth.reachable_by_others() and auth._eq(token, _key("local", int(counters.get("local", 0)))):
        return True, None  # a server for this PC only; one others can reach waits for its owner (setup mode)
    for u in users:
        if not u.get("suspended") and auth._eq(token, _key(u["id"], int(counters.get(u["id"], 0)))):
            return True, u
    return False, None


# ----------------------------------------------------------------------------- sessions

class Session:
    def __init__(self, pid: str, info: dict):
        self.id = "s" + secrets.token_hex(12)
        self.pid = pid
        self.info = info
        self.started = time.time()
        self.last_seen = time.time()
        self.queue: deque = deque()
        self.wake = asyncio.Event()
        self.pending: dict[str, asyncio.Future] = {}
        self.ops: dict[str, str] = {}
        self.files: dict[str, dict[str, bytes]] = {}
        self.busy: dict | None = None           # the command SOLIDWORKS is working on
        self.closed: str | None = None
        self.late: deque = deque(maxlen=5)      # results that came back after their tool gave up

    def alive(self) -> bool:
        return self.closed is None and time.time() - self.last_seen < ALIVE


_sessions: dict[str, Session] = {}
_ended: dict[str, tuple[str, float]] = {}   # person -> why their session was closed, and when (a renewed key)
_blobs: dict[str, dict] = {}
_ids = itertools.count(1)


def drop(pid: str, why: str) -> None:
    s = _sessions.pop(pid, None)
    if s is not None:
        _ended[pid] = (why, time.time())
        _close(s, why)


def _close(s: Session, why: str) -> None:
    s.closed = why
    for fut in s.pending.values():
        if not fut.done():
            fut.get_loop().call_soon_threadsafe(_fail, fut, why)
    s.pending.clear()
    try:
        s.wake.set()
    except RuntimeError:
        pass


def _fail(fut: asyncio.Future, why: str) -> None:
    if not fut.done():
        fut.set_exception(BridgeError(why))


def hello(user: dict | None, info: dict) -> dict:
    pid = person_id(user)
    _ended.pop(pid, None)
    old = _sessions.get(pid)
    if old is not None:
        _close(old, "SOLIDWORKS connected again (another window or PC took over).")
    s = Session(pid, {k: info.get(k) for k in ("client", "version", "sw_version", "machine", "user", "protocol", "path")
                      if info.get(k) is not None})
    _sessions[pid] = s
    return {"session": s.id, "protocol": PROTOCOL, "wait": WAIT,
            "server": os.environ.get("OPENSKETCH_VERSION", "dev")}


def _session(user: dict | None, sid: str) -> Session:
    s = _sessions.get(person_id(user))
    if s is None:
        ended = _ended.get(person_id(user))
        if ended and time.time() - ended[1] < 300:  # a poll that raced the close: say why, not "restarted"
            raise Gone(ended[0], "closed")
        raise Gone("The CAD Automation server restarted; connecting again.", "restarted")
    if s.id != sid:
        raise Gone("Another SOLIDWORKS connected with this key, so this one stopped.", "replaced")
    if s.closed:
        raise Gone(s.closed, "closed")
    return s


async def next_command(user: dict | None, sid: str, wait: float = WAIT) -> dict | None:
    s = _session(user, sid)
    s.last_seen = time.time()
    s.busy = None
    deadline = time.monotonic() + max(0.0, min(float(wait), WAIT + 5))
    while not s.queue:
        left = deadline - time.monotonic()
        if left <= 0:
            s.last_seen = time.time()
            return None
        s.wake.clear()
        try:
            await asyncio.wait_for(s.wake.wait(), timeout=left)
        except asyncio.TimeoutError:
            pass
        if s.closed:
            raise Gone(s.closed, "replaced" if _sessions.get(s.pid) not in (None, s) else "closed")
    cmd = s.queue.popleft()
    s.last_seen = time.time()
    s.busy = {"id": cmd["id"], "op": cmd["op"], "since": time.time()}
    return cmd


def put_file(user: dict | None, sid: str, cmd_id: str, name: str, data: bytes) -> dict:
    s = _session(user, sid)
    if cmd_id not in s.pending:
        raise BridgeError("No command waits for this file (it may have timed out).")
    if not name or "/" in name or "\\" in name or len(name) > 120:
        raise BridgeError("Bad file name.")
    if len(data) > MAX_FILE:
        raise BridgeError("The file is too big (128 MiB at most).")
    files = s.files.setdefault(cmd_id, {})
    if sum(len(v) for v in files.values()) + len(data) > MAX_FILES_PER_CMD:
        raise BridgeError("Too much data for one command.")
    files[name] = data
    s.last_seen = time.time()
    return {"name": name, "size": len(data), "sha256": hashlib.sha256(data).hexdigest()}


def put_result(user: dict | None, sid: str, body: dict) -> None:
    s = _session(user, sid)
    s.last_seen = time.time()
    cid = body.get("id")
    s.busy = None
    fut = s.pending.pop(cid, None)
    files = s.files.pop(cid, {})
    op = s.ops.pop(cid, None)
    if fut is None or fut.done():
        s.late.append({"id": cid, "op": op, "ok": body.get("ok"), "at": time.time(),
                       "error": body.get("error"), "summary": (body.get("result") or {}).get("summary")
                       if isinstance(body.get("result"), dict) else None})
        return
    fut.set_result((body, files))


def add_blob(user: dict | None, data: bytes, filename: str) -> str:
    """Keep a file for SOLIDWORKS to fetch (the tool drops it when its command ends). In memory, so few per person."""
    now = time.time()
    pid = person_id(user)
    for k in [k for k, v in _blobs.items() if v["expires"] < now]:
        _blobs.pop(k, None)
    mine = [k for k, v in _blobs.items() if v["pid"] == pid]
    for k in mine[:max(0, len(mine) - BLOBS_PER_PERSON + 1)]:
        _blobs.pop(k, None)
    bid = secrets.token_hex(16)
    _blobs[bid] = {"pid": pid, "data": data, "filename": filename, "expires": now + BLOB_LIFETIME}
    return bid


def drop_blob(bid: str) -> None:
    _blobs.pop(bid, None)


def blob(user: dict | None, bid: str) -> tuple[bytes, str]:
    b = _blobs.get(bid)
    if b is None or b["pid"] != person_id(user) or b["expires"] < time.time():
        raise BridgeError("No such file.")
    return b["data"], b["filename"]


def status(user: dict | None, device: str | None = None) -> dict:
    """Is SOLIDWORKS reachable for this person: through a registered computer (the Companion, devicebridge.py)
    when one is online, else through a v1 add-in link. Without registered computers the answer is exactly the v1 one."""
    from . import devicebridge
    try:
        d = devicebridge.status_for(user, device)
    except Exception:  # a damaged device store must not take the v1 link down with it
        d = {"devices": []}
    sel = d.get("selected")
    if sel:
        inst = devicebridge.instance_for(user, device) or {}
        out = {"connected": True, "via": "companion", "device": sel["name"], "device_id": sel["id"],
               "machine": sel["name"], "version": inst.get("addin_version"), "sw_version": inst.get("sw_revision"),
               "solidworks": sel.get("solidworks") or [], "devices": d["devices"]}
        if not sel.get("solidworks"):
            out["note"] = (f"SOLIDWORKS is not running on {sel['name']} (or the add-in is not loaded). Open "
                           "SOLIDWORKS there; CAD Automation connects by itself.")
        if sel.get("paused"):
            out["note"] = f"CAD Automation is paused on {sel['name']} by the person at that computer."
        return out
    if d.get("code") == "DEVICE_AMBIGUOUS":
        return {"connected": True, "via": "companion", "ambiguous": True, "note": d["error"], "devices": d["devices"],
                "machine": f"{sum(1 for x in d['devices'] if x['online'])} computers"}
    out = _v1_status(user)
    if d.get("devices"):
        out["devices"] = d["devices"]
        if d.get("error"):
            out["device_error"] = d["error"]
    return out


def _v1_status(user: dict | None) -> dict:
    s = _sessions.get(person_id(user))
    if s is None or not s.alive():
        out = {"connected": False}
        if s is not None and s.closed:
            out["note"] = s.closed
        elif s is not None:
            out["note"] = f"SOLIDWORKS was last seen {int(time.time() - s.last_seen)} s ago."
        return out
    out = {"connected": True, "since": int(s.started), "last_seen_s": round(time.time() - s.last_seen, 1),
           "queued": len(s.queue), **s.info}
    if s.busy:
        out["working_on"] = {"op": s.busy["op"], "for_s": round(time.time() - s.busy["since"], 1)}
    if s.late:
        out["finished_late"] = list(s.late)
    return out


# Where people get a newer add-in (the GitHub release that solidworks.yml keeps up to date). Overridable for forks.
ADDIN_DOWNLOAD = os.environ.get("OPENSKETCH_ADDIN_URL", "https://github.com/jogkev-creator/CADOS/releases/tag/addin-latest")


def version_tuple(v: str | None) -> tuple[int, ...]:
    """'0.9.0' -> (0, 9, 0); anything unreadable -> (0,)."""
    try:
        return tuple(int(x) for x in str(v).split(".")[:3])
    except (TypeError, ValueError):
        return (0,)


def addin_too_old(user: dict | None, needed: str, what: str, device: str | None = None) -> str | None:
    """A message when the connected add-in is older than `needed` (None when it is new enough or not connected)."""
    from . import devicebridge
    try:
        target = devicebridge.pick(user, device)
    except BridgeError:
        target = None
    if target is not None:
        inst = devicebridge.instance_for(user, device)
        have = (inst or {}).get("addin_version")
        if inst is None or version_tuple(have) >= version_tuple(needed):
            return None
        return (f"{what} needs the CAD Automation add-in {needed} or newer; SOLIDWORKS on {target['name']} runs {have}. "
                "Install the latest CAD Automation for SOLIDWORKS on that computer (it updates the add-in), then reopen "
                "SOLIDWORKS.")
    s = _sessions.get(person_id(user))
    if s is None or not s.alive():
        return None
    have = s.info.get("version")
    if version_tuple(have) >= version_tuple(needed):
        return None
    where = s.info.get("path")
    return (f"{what} needs the CAD Automation add-in {needed} or newer; SOLIDWORKS is running {have or 'an unknown version'}"
            + (f" from {where}" if where else "") + ". To update: close SOLIDWORKS (check Task Manager for SLDWORKS.exe), "
            f"download the add-in package from {ADDIN_DOWNLOAD}, unzip it over the old add-in folder (replace "
            "all files), run the setup program in that folder and click Install for me, then reopen SOLIDWORKS and "
            "connect again.")


NOT_CONNECTED = ("SOLIDWORKS is not connected. On the computer: check that the Companion is running and that "
                 "SOLIDWORKS is open with the add-in loaded (its tab and task pane). Without the Companion, "
                 "open BIZOMAT > Status in SOLIDWORKS and connect. The setup steps are on the CAD Automation dashboard.")


def target_key(user: dict | None, device: str | None = None) -> str:
    """Where commands for this person go now ("dev_..." for a registered computer, "v1" for the add-in link): the
    geometry cache is kept per target, so two computers with the same file path never share a cached body."""
    from . import devicebridge
    try:
        t = devicebridge.pick(user, device)
    except BridgeError:
        return "none"
    return t["id"] if t else "v1"


async def call(user: dict | None, op: str, args: dict | None = None, timeout: float = DEFAULT_TIMEOUT,
               blobs: dict[str, str] | None = None, device: str | None = None,
               tool: str | None = None) -> tuple[dict, dict[str, bytes]]:
    """Run one command in SOLIDWORKS. Returns (result, files). Raises BridgeError if it cannot be delivered or
    does not come back in time; a command SOLIDWORKS ran but failed comes back as {"ok": false, "error": ...}.
    A registered computer that is online (or the one `device` names) takes it; otherwise the v1 add-in link."""
    from . import devicebridge
    target = devicebridge.pick(user, device)
    if target is not None:
        return await devicebridge.call(user, target, op, args or {}, timeout, blobs, tool=tool)
    s = _sessions.get(person_id(user))
    if s is None or not s.alive():
        mine = devicebridge.devices_for(user)
        if mine:
            names = ", ".join(r["name"] for r in mine)
            raise BridgeError(f"None of your computers is online ({names}). Turn the computer on and sign in to Windows: the "
                              "Companion connects by itself. Then open SOLIDWORKS.", code="DEVICE_OFFLINE")
        raise BridgeError(NOT_CONNECTED, code="NOT_CONNECTED")
    cid = f"c{next(_ids)}"
    fut = asyncio.get_running_loop().create_future()
    s.pending[cid] = fut
    s.ops[cid] = op
    cmd = {"id": cid, "op": op, "args": args or {}}
    if blobs:
        cmd["blobs"] = {k: f"/mcp/sw/blob/{v}" for k, v in blobs.items()}
    s.queue.append(cmd)
    s.wake.set()
    try:
        body, files = await asyncio.wait_for(fut, timeout=timeout)
    except asyncio.TimeoutError:
        s.files.pop(cid, None)  # files already sent for it would otherwise stay in memory
        if cmd in s.queue:  # never picked up: take it back
            s.queue.remove(cmd)
            s.pending.pop(cid, None)
            s.ops.pop(cid, None)
            raise BridgeError(f"SOLIDWORKS did not take the command within {int(timeout)} s. It may be busy "
                              "(a dialog box open?) or asleep. Check it and call sw_status.") from None
        s.pending.pop(cid, None)  # a late result goes to s.late
        raise BridgeError(f"SOLIDWORKS is still working after {int(timeout)} s. It will finish on its own; call "
                          "sw_status, then sw_get_document, before doing anything else to this document.") from None
    return body, files


def reset_for_tests() -> None:
    from . import devicebridge
    devicebridge.reset_for_tests()
    for s in list(_sessions.values()):
        _close(s, "reset")
    _sessions.clear()
    _ended.clear()
    _retired.clear()
    _blobs.clear()
