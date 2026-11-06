"""The device bridge (protocol 2; built as the KEVOS Bridge): registered Windows computers ("devices") that run
SOLIDWORKS commands for their owner, through the BIZOMAT Companion on each computer and the add-in inside SOLIDWORKS.
The wire names (the KEVOS-Device proof scheme, the kevos-* JWS types, the KEVOS-* headers) are the protocol's own and
stay as they are: docs/BRIDGE-PROTOCOL.md.

    AI app --MCP--> sw_ tools --swbridge.call--> this module --HTTPS long poll (outbound from the PC)--> Companion
                                                                                     --named pipe--> add-in -> SOLIDWORKS

The v1 link (swbridge.py: the add-in polls with an oss_ key) stays as the fallback; swbridge.call routes a command
here when the person has a registered computer online, and to the v1 add-in otherwise.

Security model (docs/BRIDGE-PROTOCOL.md has the full contract):
- A device is an EC P-256 key pair made on the computer (the private key never leaves it). Pairing: the companion
  sends its public key, the person signs in on this site and approves the short code it shows, and the device is
  bound to that account.
- Every device request carries `Authorization: KEVOS-Device <JWS>` signed by the device key over the method, path
  and query, a timestamp, a one-time id (jti) and the SHA-256 of the body. No passwords, tokens or keys travel in
  a body, and a captured request cannot be replayed (jti seen, timestamp window) or changed (body hash).
- Every command is a JWS signed by this server's command key (the companion pinned it at pairing), names the one
  device it is for, carries a unique command id and an expiry, and is executed at most once.
- Parameters are checked by the tool (as before), then here (known op, size, no credentials), then by the
  companion and the add-in. Destructive operations are confirmed by the person at the SOLIDWORKS computer.

State: devices, pairings and every command (audit and late results) in SQLite in the data folder; live sessions
and waiting tool calls in memory. After a restart, unfinished commands are marked `unknown`.
"""

from __future__ import annotations

import asyncio
import base64
import hashlib
import json
import os
import re
import secrets
import sqlite3
import threading
import time
from collections import deque
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse, Response

from . import store

PROTOCOL = "2.0"
WAIT = 25                      # s a poll is held open
ONLINE = 70                    # s since the last poll for a device to count as online
ACK_TIMEOUT = 10               # s a delivered command may go without an ack before it is delivered again
MAX_ATTEMPTS = 5
SKEW = 120                     # s of clock difference accepted in a device proof
JTI_KEEP = 2 * SKEW + 60
MAX_COMMAND_BYTES = 1024 * 1024
CHUNK_BYTES = 32 * 1024 * 1024  # under Cloudflare's 100 MB request limit
MAX_FILE = 128 * 1024 * 1024
MAX_FILES_PER_CMD = 256 * 1024 * 1024
MAX_START_WINDOW = 900         # s: the latest a command may start after it was made
PAIR_TTL = 600
PAIR_INTERVAL = 3
PAIR_LIMIT = 20                # pairing starts per address per hour
NAME_MAX = 60

_CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
_CODE_CHARS = "BCDFGHJKLMNPQRSTVWXZ23456789"   # user codes: no vowels (no words), no 0/O/1/I

# What each add-in op does, for audit, approvals and the companion's checks (docs/BRIDGE-PROTOCOL.md, op registry).
OPS: dict[str, tuple[str, str]] = {
    "ping": ("none", "low"), "status": ("read", "low"), "read": ("read", "low"), "read_drawing": ("read", "low"),
    "geometry": ("file_out", "low"), "screenshot": ("read", "low"), "export": ("file_out", "medium"),
    "open_document": ("open", "low"), "create_document": ("create", "low"), "save": ("save", "medium"),
    "import": ("create", "low"), "add_features": ("modify", "low"), "batch": ("modify", "low"),
    "insert_component": ("modify", "low"), "add_mate": ("modify", "low"), "set_parameter": ("modify", "low"),
    "set_equation": ("modify", "low"), "delete": ("delete", "high"), "undo": ("modify", "high"),
    "create_drawing": ("create", "medium"), "edit_drawing": ("modify", "medium"),
}

TERMINAL = {"succeeded", "failed", "cancelled", "expired", "rejected", "denied", "unknown"}


def risk_of(op: str, params: dict) -> str:
    """The op's risk, raised for the arguments that make it destructive (the add-in asks the person for these)."""
    risk = OPS.get(op, ("modify", "high"))[1]
    if op == "delete" and params.get("dry_run"):
        return "low"
    if (op == "save" and params.get("path")) or (op == "create_drawing" and params.get("overwrite")) or \
            (op == "set_parameter" and params.get("remove")) or \
            (op == "edit_drawing" and any(isinstance(a, dict) and a.get("do") == "delete" for a in params.get("actions") or [])):
        return "high"
    return risk


class BridgeAuthError(Exception):
    def __init__(self, status: int, code: str, message: str):
        super().__init__(message)
        self.status, self.code, self.message = status, code, message


# ----------------------------------------------------------------------------- encodings, ids, time

def b64u(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def b64u_dec(s: str) -> bytes:
    if not isinstance(s, str) or not re.fullmatch(r"[A-Za-z0-9_-]*", s):
        raise ValueError("not base64url")
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def ulid(prefix: str) -> str:
    n = (int(time.time() * 1000) << 80) | int.from_bytes(secrets.token_bytes(10), "big")
    out = []
    for _ in range(26):
        out.append(_CROCKFORD[n & 31])
        n >>= 5
    return prefix + "_" + "".join(reversed(out))


def iso(t: float | None = None) -> str:
    t = time.time() if t is None else t
    return datetime.fromtimestamp(t, timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + f"{int(t * 1000) % 1000:03d}Z"


def parse_iso(s: str) -> float:
    return datetime.strptime(s, "%Y-%m-%dT%H:%M:%S.%fZ").replace(tzinfo=timezone.utc).timestamp()


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _canon(obj) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()


# ----------------------------------------------------------------------------- ES256 (JWS) and JWK

def _ec():
    from cryptography.hazmat.primitives.asymmetric import ec
    return ec


def jwk_public_key(jwk: dict):
    """A P-256 public key from a JWK; refuses anything else (and points not on the curve)."""
    ec = _ec()
    if not isinstance(jwk, dict) or jwk.get("kty") != "EC" or jwk.get("crv") != "P-256":
        raise ValueError("The key must be an EC P-256 JWK.")
    x, y = b64u_dec(jwk.get("x", "")), b64u_dec(jwk.get("y", ""))
    if len(x) != 32 or len(y) != 32:
        raise ValueError("The key's x and y must be 32 bytes each.")
    return ec.EllipticCurvePublicNumbers(int.from_bytes(x, "big"), int.from_bytes(y, "big"), ec.SECP256R1()).public_key()


def jwk_of(public_key) -> dict:
    n = public_key.public_numbers()
    return {"kty": "EC", "crv": "P-256", "x": b64u(n.x.to_bytes(32, "big")), "y": b64u(n.y.to_bytes(32, "big"))}


def thumbprint(jwk: dict) -> str:
    """RFC 7638 JWK thumbprint."""
    return b64u(hashlib.sha256(_canon({"crv": jwk["crv"], "kty": jwk["kty"], "x": jwk["x"], "y": jwk["y"]})).digest())


def jws_sign(private_key, header: dict, payload: bytes) -> str:
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature
    ec = _ec()
    signing_input = (b64u(_canon(header)) + "." + b64u(payload)).encode()
    r, s = decode_dss_signature(private_key.sign(signing_input, ec.ECDSA(hashes.SHA256())))
    return signing_input.decode() + "." + b64u(r.to_bytes(32, "big") + s.to_bytes(32, "big"))


def jws_parts(compact: str) -> tuple[dict, bytes, bytes, bytes]:
    """(header, payload, signing input, signature) of a compact JWS; no verification."""
    if not isinstance(compact, str) or len(compact) > 4 * MAX_COMMAND_BYTES or compact.count(".") != 2:
        raise ValueError("not a compact JWS")
    h, p, s = compact.split(".")
    header = json.loads(b64u_dec(h))
    if not isinstance(header, dict):
        raise ValueError("bad JWS header")
    return header, b64u_dec(p), (h + "." + p).encode(), b64u_dec(s)


def jws_verify(compact: str, public_key) -> tuple[dict, bytes]:
    from cryptography.exceptions import InvalidSignature
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.asymmetric.utils import encode_dss_signature
    ec = _ec()
    header, payload, signing_input, sig = jws_parts(compact)
    if header.get("alg") != "ES256" or len(sig) != 64:
        raise ValueError("only ES256 is accepted")
    der = encode_dss_signature(int.from_bytes(sig[:32], "big"), int.from_bytes(sig[32:], "big"))
    try:
        public_key.verify(der, signing_input, ec.ECDSA(hashes.SHA256()))
    except InvalidSignature:
        raise ValueError("signature does not verify") from None
    return header, payload


_keys: dict[str, object] = {}


def signing_key():
    """This server's command signing key (P-256), made on first use and kept in the data folder (0600)."""
    from cryptography.hazmat.primitives import serialization
    p = store.data_dir() / "bridge-signing-key.pem"
    k = _keys.get(str(p))
    if k is not None and p.exists():
        return k
    if not p.exists():
        key = _ec().generate_private_key(_ec().SECP256R1())
        pem = key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())
        tmp = p.with_name(p.name + f".{secrets.token_hex(4)}.tmp")
        tmp.write_bytes(pem)
        tmp.chmod(0o600)
        try:
            os.link(tmp, p)  # first writer wins
        except FileExistsError:
            pass
        finally:
            tmp.unlink()
    key = serialization.load_pem_private_key(p.read_bytes(), password=None)
    _keys[str(p)] = key
    return key


def gateway_jwk() -> dict:
    jwk = jwk_of(signing_key().public_key())
    return dict(jwk, kid=thumbprint(jwk), alg="ES256", use="sig")


def sign_message(payload: dict, typ: str) -> str:
    jwk = gateway_jwk()
    return jws_sign(signing_key(), {"alg": "ES256", "typ": typ, "kid": jwk["kid"]}, _canon(payload))


# ----------------------------------------------------------------------------- storage (SQLite)

_db_lock = threading.Lock()
_db_ready: set[str] = set()

SCHEMA = """
CREATE TABLE IF NOT EXISTS devices (id TEXT PRIMARY KEY, owner TEXT NOT NULL, name TEXT NOT NULL, jwk TEXT NOT NULL,
  jkt TEXT NOT NULL UNIQUE, created REAL NOT NULL, last_seen REAL, revoked REAL, is_default INTEGER DEFAULT 0, info TEXT);
CREATE TABLE IF NOT EXISTS pairings (id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, jwk TEXT NOT NULL, jkt TEXT NOT NULL,
  name TEXT, info TEXT, created REAL NOT NULL, expires REAL NOT NULL, status TEXT NOT NULL, device_id TEXT, owner TEXT, ip TEXT);
CREATE TABLE IF NOT EXISTS commands (id TEXT PRIMARY KEY, device_id TEXT NOT NULL, owner TEXT NOT NULL, tool TEXT, op TEXT,
  effect TEXT, risk TEXT, params_sha256 TEXT, status TEXT NOT NULL, created REAL NOT NULL, expires REAL NOT NULL,
  updated REAL NOT NULL, attempts INTEGER DEFAULT 0, history TEXT, result TEXT, error TEXT, correlation TEXT, client TEXT);
CREATE INDEX IF NOT EXISTS commands_owner ON commands(owner, created);
"""


def _db() -> sqlite3.Connection:
    path = store.data_dir() / "bridge.sqlite"
    con = sqlite3.connect(str(path), timeout=10, isolation_level=None, check_same_thread=False)
    con.row_factory = sqlite3.Row
    key = str(path)
    if key not in _db_ready:
        with _db_lock:
            if key not in _db_ready:
                con.execute("PRAGMA journal_mode=WAL")
                con.executescript(SCHEMA)
                # a restart forgets waiting tool calls: what was unfinished is marked, never re-run
                now = time.time()
                for r in con.execute("SELECT id, history FROM commands WHERE status NOT IN (%s)" % ",".join("?" * len(TERMINAL)),
                                     tuple(TERMINAL)).fetchall():
                    hist = json.loads(r["history"] or "[]") + [{"status": "unknown", "at": iso(now), "hop": "gateway",
                                                               "note": "the server restarted while it was open"}]
                    con.execute("UPDATE commands SET status='unknown', updated=?, history=? WHERE id=?",
                                (now, json.dumps(hist), r["id"]))
                try:
                    path.chmod(0o600)
                except OSError:
                    pass
                _db_ready.add(key)
    return con


def _q(sql: str, args: tuple = (), one: bool = False):
    con = _db()
    try:
        cur = con.execute(sql, args)
        rows = cur.fetchall()
        return (dict(rows[0]) if rows else None) if one else [dict(r) for r in rows]
    finally:
        con.close()


def _exec(sql: str, args: tuple = ()) -> int:
    con = _db()
    try:
        return con.execute(sql, args).rowcount
    finally:
        con.close()


# ----------------------------------------------------------------------------- live state

class DeviceSession:
    def __init__(self, device: dict, hello: dict):
        self.id = ulid("ses")
        self.device_id = device["id"]
        self.owner = device["owner"]
        self.started = time.time()
        self.last_seen = time.time()
        self.hello = hello
        self.instances: list[dict] = list(hello.get("instances") or [])
        self.paused = bool(hello.get("paused"))
        self.queue: deque = deque()
        self.closed: tuple[str, str] | None = None     # (reason, message)
        self.loop: asyncio.AbstractEventLoop | None = None
        self.wake: asyncio.Event | None = None

    def alive(self) -> bool:
        return self.closed is None and time.time() - self.last_seen < ONLINE

    def poke(self) -> None:
        if self.loop is not None and self.wake is not None:
            try:
                self.loop.call_soon_threadsafe(self.wake.set)
            except RuntimeError:
                pass


class Pending:
    def __init__(self, payload: dict, jws: str, fut: asyncio.Future):
        self.payload = payload
        self.jws = jws
        self.fut = fut
        self.status = "queued"
        self.attempts = 0
        self.delivered_at = 0.0
        self.history: list[dict] = []
        self.progress: dict | None = None
        self.waiting_for: str | None = None
        self.blobs: set[str] = {f["blob_id"] for f in payload.get("files_in") or []}
        self.waiting = True    # a tool call still waits for it

    @property
    def id(self) -> str:
        return self.payload["command_id"]


_sessions: dict[str, DeviceSession] = {}
_pending: dict[str, Pending] = {}
_jti: dict[str, float] = {}
_pair_hits: dict[str, list[float]] = {}
_files_dir_lock = threading.Lock()


def reset_for_tests() -> None:
    _sessions.clear()
    _pending.clear()
    _jti.clear()
    _pair_hits.clear()
    _keys.clear()
    _db_ready.clear()


def _resolve(fut: asyncio.Future, value=None, exc: BaseException | None = None) -> None:
    def go():
        if not fut.done():
            if exc is not None:
                fut.set_exception(exc)
            else:
                fut.set_result(value)
    try:
        fut.get_loop().call_soon_threadsafe(go)
    except RuntimeError:
        pass


def _note(p: Pending, status: str, hop: str = "gateway", note: str | None = None) -> None:
    p.status = status
    p.history.append({k: v for k, v in {"status": status, "at": iso(), "hop": hop, "note": note}.items() if v is not None})
    _exec("UPDATE commands SET status=?, updated=?, attempts=?, history=? WHERE id=?",
          (status, time.time(), p.attempts, json.dumps(p.history[-50:]), p.id))


# ----------------------------------------------------------------------------- devices

def person_id(user: dict | None) -> str:
    return user["id"] if user else "local"


def _device_out(r: dict) -> dict:
    s = _sessions.get(r["id"])
    online = bool(s and s.alive())
    info = json.loads(r.get("info") or "{}")
    out = {"id": r["id"], "name": r["name"], "online": online, "default": bool(r.get("is_default")),
           "created": iso(r["created"]), "last_seen_s": round(time.time() - (s.last_seen if s else (r.get("last_seen") or r["created"])), 1),
           "companion_version": info.get("companion_version"), "os": info.get("os"),
           "installations": info.get("installations") or []}
    if s:
        out["paused"] = s.paused
        out["solidworks"] = [_instance_out(i) for i in s.instances] if online else []
        if not online and s.closed:
            out["note"] = s.closed[1]
    return out


def _instance_out(i: dict) -> dict:
    rev = str(i.get("sw_revision") or "")
    m = re.match(r"^(\d+)\.", rev)
    year = int(m.group(1)) + 1992 if m and int(m.group(1)) > 20 else None
    docs = i.get("docs") or []
    active = next((d for d in docs if d.get("active")), None)
    return {"instance_id": i.get("instance_id"), "solidworks": f"SOLIDWORKS {year}" if year else "SOLIDWORKS",
            "sw_revision": rev, "addin_version": i.get("addin_version"), "documents_open": len(docs),
            "active_document": (active or {}).get("path") or (active or {}).get("title"),
            "busy": bool(i.get("busy")), "ready": bool(i.get("ui_responsive")) and not i.get("modal_dialog") and not i.get("busy"),
            "modal_dialog": bool(i.get("modal_dialog"))}


def devices_for(user: dict | None, include_revoked: bool = False) -> list[dict]:
    rows = _q("SELECT * FROM devices WHERE owner=?" + ("" if include_revoked else " AND revoked IS NULL") + " ORDER BY created",
              (person_id(user),))
    return rows


def list_devices(user: dict | None) -> list[dict]:
    return [_device_out(r) for r in devices_for(user)]


def _online(r: dict) -> bool:
    s = _sessions.get(r["id"])
    return bool(s and s.alive())


def _has_solidworks(r: dict) -> bool:
    s = _sessions.get(r["id"])
    return bool(s and s.alive() and s.instances)


def pick(user: dict | None, device: str | None):
    """The registered computer a command goes to, or None (no computer online: the v1 add-in link, if any).
    Raises swbridge.BridgeError when `device` names an unknown or offline computer, or several are online and
    none is chosen."""
    from .swbridge import BridgeError
    rows = devices_for(user)
    if device:
        want = str(device).strip().casefold()
        if want in ("legacy", "addin", "v1"):
            return None
        hit = [r for r in rows if r["id"].casefold() == want or r["name"].casefold() == want]
        if not hit:
            names = ", ".join(r["name"] for r in rows) or "none yet"
            raise BridgeError(f"No computer named {device!r}. Your computers: {names}.", code="DEVICE_UNKNOWN")
        r = hit[0]
        if not _online(r):
            s = _sessions.get(r["id"])
            why = s.closed[1] if s and s.closed else "Turn it on and sign in to Windows; the BIZOMAT Companion connects by itself."
            raise BridgeError(f"The computer {r['name']} is offline. {why}", code="DEVICE_OFFLINE")
        return r
    online = [r for r in rows if _online(r)]
    if not online:
        return None
    if len(online) == 1:
        return online[0]
    with_sw = [r for r in online if _has_solidworks(r)]
    if len(with_sw) == 1:
        return with_sw[0]
    default = [r for r in (with_sw or online) if r.get("is_default")]
    if len(default) == 1:
        return default[0]
    names = ", ".join(r["name"] for r in (with_sw or online))
    raise BridgeError(f"Several computers are connected ({names}). Pass device=\"<name>\" to choose one, or set a "
                      "default computer on the CAD Automation dashboard.", code="DEVICE_AMBIGUOUS")


def status_for(user: dict | None, device: str | None = None) -> dict:
    """What swbridge.status adds for registered computers: the list, and the one a command would go to."""
    from .swbridge import BridgeError
    rows = devices_for(user)
    if not rows:
        return {"devices": []}
    out: dict = {"devices": [_device_out(r) for r in rows]}
    try:
        r = pick(user, device)
    except BridgeError as exc:
        out["error"], out["code"] = str(exc), exc.code
        return out
    if r is not None:
        out["selected"] = _device_out(r)
    return out


def instance_for(user: dict | None, device: str | None) -> dict | None:
    """The SOLIDWORKS instance a command would most likely use (for version checks), or None."""
    from .swbridge import BridgeError
    try:
        r = pick(user, device)
    except BridgeError:
        return None
    s = _sessions.get(r["id"]) if r else None
    if not s or not s.instances:
        return None
    for i in s.instances:
        if any(d.get("active") for d in i.get("docs") or []):
            return i
    return s.instances[0]


def set_device(user: dict | None, device_id: str, name: str | None = None, default: bool | None = None) -> dict:
    r = _q("SELECT * FROM devices WHERE id=? AND owner=? AND revoked IS NULL", (device_id, person_id(user)), one=True)
    if not r:
        raise KeyError(device_id)
    if name is not None:
        name = _clean_name(name)
        if not name:
            raise ValueError("Give the computer a name.")
        _exec("UPDATE devices SET name=? WHERE id=?", (name, device_id))
    if default is not None:
        if default:
            _exec("UPDATE devices SET is_default=0 WHERE owner=?", (person_id(user),))
        _exec("UPDATE devices SET is_default=? WHERE id=?", (1 if default else 0, device_id))
    return _device_out(_q("SELECT * FROM devices WHERE id=?", (device_id,), one=True))


def revoke_device(user: dict | None, device_id: str, why: str = "This computer was removed from your CAD Automation account.") -> bool:
    n = _exec("UPDATE devices SET revoked=? WHERE id=? AND owner=? AND revoked IS NULL", (time.time(), device_id, person_id(user)))
    if not n:
        return False
    _end_session(device_id, "revoked", why)
    return True


def _end_session(device_id: str, reason: str, message: str) -> None:
    from .swbridge import BridgeError
    s = _sessions.get(device_id)
    if s is not None:
        s.closed = (reason, message)
        s.poke()
    for p in [p for p in _pending.values() if p.payload["device_id"] == device_id]:
        if p.status not in TERMINAL:
            _note(p, "unknown" if p.status == "running" else "failed", note=message)
            _resolve(p.fut, exc=BridgeError(message, code="DEVICE_REVOKED" if reason == "revoked" else "SESSION_REPLACED"))


def _clean_name(name) -> str:
    return re.sub(r"[\x00-\x1f<>\"'`]", "", str(name or "")).strip()[:NAME_MAX]


# ----------------------------------------------------------------------------- pairing

def start_pairing(body: dict, ip: str) -> dict:
    jwk = body.get("public_jwk")
    jwk_public_key(jwk)  # validates
    jwk = {"kty": "EC", "crv": "P-256", "x": jwk["x"], "y": jwk["y"]}
    jkt = thumbprint(jwk)
    if _q("SELECT id FROM devices WHERE jkt=?", (jkt,), one=True):
        raise ValueError("This key is already registered. Make a new device key to pair again.")
    name = _clean_name(body.get("name")) or "Windows computer"
    info = {k: str(body.get(k))[:120] for k in ("machine", "os", "companion_version") if body.get(k)}
    now = time.time()
    _exec("DELETE FROM pairings WHERE expires < ?", (now - 3600,))
    pid = ulid("par")
    for _ in range(20):
        code = "".join(secrets.choice(_CODE_CHARS) for _ in range(8))
        code = code[:4] + "-" + code[4:]
        try:
            _exec("INSERT INTO pairings (id, code, jwk, jkt, name, info, created, expires, status, ip) VALUES (?,?,?,?,?,?,?,?,?,?)",
                  (pid, code, json.dumps(jwk), jkt, name, json.dumps(info), now, now + PAIR_TTL, "pending", ip))
            break
        except sqlite3.IntegrityError:
            continue
    else:
        raise RuntimeError("could not make a pairing code")
    return {"pair_id": pid, "user_code": code, "expires_in": PAIR_TTL, "interval": PAIR_INTERVAL}


def pairing_by_code(code: str) -> dict | None:
    code = re.sub(r"[^A-Z0-9]", "", str(code or "").upper())
    if len(code) != 8:
        return None
    r = _q("SELECT * FROM pairings WHERE code=?", (code[:4] + "-" + code[4:],), one=True)
    if not r or r["expires"] < time.time():
        return None
    return r


def approve_pairing(user: dict | None, code: str, name: str | None = None) -> dict:
    """The signed-in person approves the code their computer shows: the device is made and bound to them."""
    r = pairing_by_code(code)
    if not r or r["status"] != "pending":
        raise ValueError("That code is not valid or has expired. Start pairing again in the BIZOMAT Companion.")
    did = ulid("dev")
    name = _clean_name(name) or r["name"] or "Windows computer"
    owner = person_id(user)
    # a name already in use gets a number, so device=<name> stays unambiguous
    taken = {x["name"].casefold() for x in devices_for(user)}
    base, k = name, 2
    while name.casefold() in taken:
        name = f"{base} ({k})"
        k += 1
    now = time.time()
    first = not devices_for(user)
    _exec("INSERT INTO devices (id, owner, name, jwk, jkt, created, last_seen, is_default, info) VALUES (?,?,?,?,?,?,?,?,?)",
          (did, owner, name, r["jwk"], r["jkt"], now, None, 1 if first else 0, r["info"]))
    _exec("UPDATE pairings SET status='approved', device_id=?, owner=? WHERE id=?", (did, owner, r["id"]))
    return {"device_id": did, "name": name}


def deny_pairing(code: str) -> None:
    r = pairing_by_code(code)
    if r and r["status"] == "pending":
        _exec("UPDATE pairings SET status='denied' WHERE id=?", (r["id"],))


def poll_pairing(pair: dict) -> dict:
    if pair["status"] == "pending":
        if pair["expires"] < time.time():
            return {"status": "expired"}
        return {"status": "pending", "interval": PAIR_INTERVAL}
    if pair["status"] == "approved":
        d = _q("SELECT * FROM devices WHERE id=?", (pair["device_id"],), one=True)
        if not d or d["revoked"]:
            return {"status": "denied"}
        from . import accounts
        owner = accounts.get(d["owner"]) if d["owner"] != "local" else None
        return {"status": "approved", "device_id": d["id"], "device_name": d["name"],
                "account": (owner or {}).get("name") or (owner or {}).get("email") or "this server",
                "gateway_jwk": gateway_jwk()}
    return {"status": pair["status"]}


# ----------------------------------------------------------------------------- device proofs

def _client_ip(request: Request) -> str:
    from . import auth
    return auth._client(request.scope)


def _open_and_remote(request: Request) -> bool:
    """A server without a password or accounts (open mode, for one person on their own PC) takes pairing only from
    the PC it runs on: nobody on the network can add a computer to it, and whoever runs it publicly must sign in.
    Behind a proxy on the same PC (a tunnel, the platform proxy) the client is the one the proxy names (proxy.py), not
    the proxy itself, so a visitor through the proxy is remote."""
    from . import auth, proxy
    if auth.mode() != "open":
        return False
    a = proxy.ip(proxy.client_ip(request.scope))
    return a is None or not a.is_loopback


def authenticate(request: Request, body: bytes, pairing: bool = False) -> dict:
    """The device (or, for pairing polls, the pairing) a request is signed by. Raises BridgeAuthError."""
    authz = request.headers.get("authorization", "")
    if not authz.startswith("KEVOS-Device "):
        raise BridgeAuthError(401, "UNAUTHENTICATED", "This request is not signed by a registered computer.")
    compact = authz[len("KEVOS-Device "):].strip()
    try:
        header, payload, _, _ = jws_parts(compact)
    except ValueError:
        raise BridgeAuthError(401, "DPOP_INVALID", "The device proof is malformed.") from None
    if header.get("typ") != "kevos-proof" or header.get("alg") != "ES256":
        raise BridgeAuthError(401, "DPOP_INVALID", "The device proof has the wrong type.")
    kid = str(header.get("kid") or "")
    if pairing:
        rec = _q("SELECT * FROM pairings WHERE id=?", (kid,), one=True)
        if not rec:
            raise BridgeAuthError(401, "DEVICE_UNKNOWN", "No such pairing.")
    else:
        rec = _q("SELECT * FROM devices WHERE id=?", (kid,), one=True)
        if not rec:
            raise BridgeAuthError(401, "DEVICE_UNKNOWN", "This computer is not registered. Pair it again in the BIZOMAT Companion.")
        if rec["revoked"]:
            raise BridgeAuthError(401, "DEVICE_REVOKED", "This computer was removed from your CAD Automation account. Pair it again.")
    try:
        _, payload = jws_verify(compact, jwk_public_key(json.loads(rec["jwk"])))
        claims = json.loads(payload)
    except (ValueError, KeyError):
        raise BridgeAuthError(401, "SIGNATURE_INVALID", "The device proof's signature is not valid.") from None
    from urllib.parse import unquote
    now = time.time()
    path = request.url.path + ("?" + request.url.query if request.url.query else "")
    # compared decoded: HTTP stacks may re-encode a query (a space as %20 or +) without changing what it means
    if not isinstance(claims, dict) or claims.get("htm") != request.method or \
            unquote(str(claims.get("htu") or "").replace("+", " ")) != unquote(path.replace("+", " ")):
        raise BridgeAuthError(401, "DPOP_INVALID", "The device proof is for another request.")
    iat = claims.get("iat")
    if not isinstance(iat, (int, float)) or abs(now - iat) > SKEW:
        raise BridgeAuthError(401, "TOKEN_EXPIRED", f"The device clock is off by more than {SKEW} s. Server time: {iso(now)}.")
    if claims.get("bh") != sha256_hex(body):
        raise BridgeAuthError(401, "DPOP_INVALID", "The request body does not match its proof.")
    jti = claims.get("jti")
    if not isinstance(jti, str) or not 16 <= len(jti) <= 64:
        raise BridgeAuthError(401, "DPOP_INVALID", "The device proof has no one-time id.")
    with _db_lock:
        if len(_jti) > 50000 or (len(_jti) % 512 == 0):
            for k in [k for k, exp in _jti.items() if exp < now]:
                _jti.pop(k, None)
        key = kid + ":" + jti
        if key in _jti:
            raise BridgeAuthError(401, "REPLAY_DETECTED", "This device request was already used.")
        _jti[key] = now + JTI_KEEP
    return rec


# ----------------------------------------------------------------------------- commands

_SECRET_KEYS = {"password", "passwd", "secret", "apikey", "accesstoken", "refreshtoken", "authorization", "cookie",
                "privatekey", "clientsecret", "bearertoken"}
_SECRET_VALUES = re.compile(r"(oss_[0-9a-f]{40}|Bearer\s+[A-Za-z0-9._~+/=-]{20,}|eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\."
                            r"|-----BEGIN [A-Z ]*PRIVATE KEY-----|KEVOS-Device\s)")


def forbidden(obj, user: dict | None = None, where: str = "params") -> str | None:
    """A credential in command parameters (keys named like one, or values shaped like one): never sent on."""
    extra: list[str] = []
    try:
        from . import auth
        tok = auth.mcp_token_for(user)
        if tok and len(tok) >= 16:
            extra.append(tok)
    except Exception:
        pass

    def walk(o, path):
        if isinstance(o, dict):
            for k, v in o.items():
                if re.sub(r"[^a-z]", "", str(k).lower()) in _SECRET_KEYS:
                    return f"{path}.{k}"
                hit = walk(v, f"{path}.{k}")
                if hit:
                    return hit
        elif isinstance(o, list):
            for i, v in enumerate(o):
                hit = walk(v, f"{path}[{i}]")
                if hit:
                    return hit
        elif isinstance(o, str):
            if _SECRET_VALUES.search(o) or any(t in o for t in extra):
                return path
        return None
    return walk(obj, where)


def _blob_ref(blob_id: str) -> dict:
    from . import swbridge
    b = swbridge._blobs.get(blob_id)
    if b is None:
        raise ValueError("The file for SOLIDWORKS is gone.")
    return {"blob_id": blob_id, "size": len(b["data"]), "sha256": "sha256:" + sha256_hex(b["data"]),
            "filename": b["filename"]}


def _issued_by(user: dict | None) -> dict:
    from . import mcp_server
    ident = {"user_id": "usr_" + (user["id"] if user and re.fullmatch(r"[0-9a-f]{12}", str(user.get("id"))) else "000000000000"),
             "grant_id": "private_address", "client": {"name": "AI app"}, "auth": "oauth"}
    g = mcp_server.current_grant()
    if g:
        ident["grant_id"] = "grt_" + re.sub(r"[^A-Za-z0-9_-]", "", str(g.get("id") or "x"))[:60].ljust(8, "x")
        ident["client"] = {"name": str(g.get("name") or "AI app")[:80]}
    else:
        ident["auth"] = "private_address"
    return ident


async def call(user: dict | None, device: dict, op: str, args: dict, timeout: float, blobs: dict | None = None,
               tool: str | None = None) -> tuple[dict, dict[str, bytes]]:
    """Run one op on a registered computer. Returns (body, files) in swbridge.call's shape: body = {ok, result,
    error, code}. Raises swbridge.BridgeError when it cannot be delivered or does not come back in time."""
    from .swbridge import BridgeError
    s = _sessions.get(device["id"])
    if s is None or not s.alive():
        raise BridgeError(f"The computer {device['name']} is offline.", code="DEVICE_OFFLINE")
    if op not in OPS:
        raise BridgeError(f"Unknown SOLIDWORKS operation {op!r}.", code="UNKNOWN_OP")
    params = {k: v for k, v in (args or {}).items() if v is not None}
    raw = _canon(params)
    if len(raw) > MAX_COMMAND_BYTES:
        raise BridgeError("The command is too big (1 MiB at most); send big files with request_upload.", code="PAYLOAD_TOO_LARGE")
    bad = forbidden(params, user)
    if bad:
        raise BridgeError(f"The command carries what looks like a password, key or token ({bad}); it was not sent. "
                          "SOLIDWORKS commands never need credentials.", code="INPUT_FORBIDDEN_FIELD")
    if s.paused:
        raise BridgeError(f"CAD Automation is paused on {device['name']} (by the person at that computer). Ask them to "
                          "resume it from the BIZOMAT icon in the Windows taskbar.", code="PAUSED")
    try:
        files_in = [dict(_blob_ref(bid), name=name) for name, bid in (blobs or {}).items()]
    except ValueError as exc:
        raise BridgeError(str(exc), code="INTERNAL") from None
    now = time.time()
    effect, _ = OPS[op]
    risk = risk_of(op, params)
    window = max(5.0, min(float(timeout), MAX_START_WINDOW))
    from . import mcp_server
    payload = {"v": PROTOCOL, "type": "command", "command_id": ulid("cmd"), "device_id": device["id"],
               "instance": {"mode": "doc", "doc": str(params["doc"])[:520]} if isinstance(params.get("doc"), str) and params.get("doc") else {"mode": "auto"},
               "issued_by": _issued_by(user), "tool": tool or "sw_" + op, "op": op, "op_version": 1,
               "params": params, "params_sha256": "sha256:" + sha256_hex(raw), "effect": effect, "risk": risk,
               "approval": None, "files_in": files_in, "created_at": iso(now), "expires_at": iso(now + window),
               "run_timeout_ms": int(max(1.0, min(float(timeout), 900.0)) * 1000),
               "correlation_id": mcp_server.current_correlation() or ulid("cor"), "nonce": b64u(secrets.token_bytes(16))}
    jws = sign_message(payload, "kevos-command")
    loop = asyncio.get_running_loop()
    fut = loop.create_future()
    p = Pending(payload, jws, fut)
    _pending[p.id] = p
    _exec("INSERT INTO commands (id, device_id, owner, tool, op, effect, risk, params_sha256, status, created, expires, updated,"
          " attempts, history, correlation, client) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          (p.id, device["id"], person_id(user), payload["tool"], op, effect, risk, payload["params_sha256"], "created",
           now, now + window, now, 0, "[]", payload["correlation_id"], payload["issued_by"]["client"]["name"]))
    _note(p, "queued")
    _deliver(s, p)
    try:
        body, files = await asyncio.wait_for(asyncio.shield(fut), timeout=timeout)
    except asyncio.TimeoutError:
        if p.status in ("queued", "delivered"):
            _withdraw(p, "expired")
            _note(p, "expired", note=f"not taken within {int(timeout)} s")
            raise BridgeError(f"SOLIDWORKS on {device['name']} did not take the command within {int(timeout)} s. It may be "
                              "busy (a dialog box open?), or the computer went to sleep. Check it and call sw_status.",
                              code="NOT_DELIVERED") from None
        raise BridgeError(f"SOLIDWORKS on {device['name']} is still working after {int(timeout)} s. It will finish on its "
                          f"own; call sw_command_status(command_id=\"{p.id}\"), then sw_get_document, before doing anything "
                          "else to this document.", code="STILL_RUNNING") from None
    except asyncio.CancelledError:  # the AI app cancelled the call (or the server is stopping)
        if p.status not in TERMINAL:
            _withdraw(p, "client_cancelled")
            _note(p, "cancelled" if p.status in ("queued", "delivered") else p.status, note="cancelled by the AI app")
        raise
    finally:
        p.waiting = False
        _drop_files(p.id)
        if p.status in TERMINAL:
            _pending.pop(p.id, None)
    body = dict(body)
    body.setdefault("command_id", p.id)
    return body, files


def _deliver(s: DeviceSession, p: Pending) -> None:
    p.attempts += 1
    p.delivered_at = 0.0
    s.queue.append({"v": PROTOCOL, "type": "command.deliver", "msg_id": ulid("msg"), "sent_at": iso(),
                    "attempt": p.attempts, "command_id": p.id, "jws": p.jws})
    s.poke()


def _withdraw(p: Pending, reason: str) -> None:
    """Take a command back: out of the queue if it was not fetched, else a signed cancel to the computer."""
    s = _sessions.get(p.payload["device_id"])
    if s is None:
        return
    before = len(s.queue)
    s.queue = deque(m for m in s.queue if m.get("command_id") != p.id)
    if len(s.queue) == before or p.status not in ("queued",):
        cancel = {"v": PROTOCOL, "type": "command.cancel", "command_id": p.id, "device_id": p.payload["device_id"],
                  "reason": reason, "origin": "gateway", "nonce": b64u(secrets.token_bytes(16)), "created_at": iso()}
        s.queue.append({"v": PROTOCOL, "type": "command.cancel", "msg_id": ulid("msg"), "sent_at": iso(),
                        "command_id": p.id, "jws": sign_message(cancel, "kevos-cancel")})
        s.poke()


def cancel(user: dict | None, command_id: str) -> dict:
    r = _q("SELECT * FROM commands WHERE id=? AND owner=?", (command_id, person_id(user)), one=True)
    if not r:
        raise KeyError(command_id)
    p = _pending.get(command_id)
    if p is None or p.status in TERMINAL:
        return {"command_id": command_id, "status": r["status"], "note": "It had already finished."}
    from .swbridge import BridgeError
    _withdraw(p, "user_request")
    if p.status in ("queued", "delivered"):
        _note(p, "cancelled", note="cancelled before it started")
        _resolve(p.fut, exc=BridgeError("The command was cancelled before it started.", code="CANCELLED"))
        return {"command_id": command_id, "status": "cancelled"}
    return {"command_id": command_id, "status": p.status, "cancel_requested": True,
            "note": "A running batch stops between steps and is rolled back; a single SOLIDWORKS call finishes."}


def command_record(user: dict | None, command_id: str) -> dict:
    r = _q("SELECT * FROM commands WHERE id=? AND owner=?", (command_id, person_id(user)), one=True)
    if not r:
        raise KeyError(command_id)
    d = _q("SELECT name FROM devices WHERE id=?", (r["device_id"],), one=True)
    p = _pending.get(command_id)
    out = {"command_id": r["id"], "device": (d or {}).get("name"), "tool": r["tool"], "op": r["op"], "effect": r["effect"],
           "risk": r["risk"], "status": r["status"], "created_at": iso(r["created"]), "expires_at": iso(r["expires"]),
           "updated_at": iso(r["updated"]), "attempts": r["attempts"], "history": json.loads(r["history"] or "[]")}
    if p and p.progress:
        out["progress"] = p.progress
    if p and p.waiting_for:
        out["waiting_for"] = p.waiting_for
    if r["result"]:
        out["result"] = json.loads(r["result"])
    if r["error"]:
        out["error"] = json.loads(r["error"])
    return out


def recent_commands(user: dict | None, limit: int = 50) -> list[dict]:
    """This person's latest commands to their paired computers, newest first, for the History page. Only what the
    record holds: the tool, the computer, the AI app, the state and, when it failed, the error's code and message."""
    from . import catalog
    rows = _q("SELECT c.id, c.tool, c.op, c.status, c.created, c.updated, c.client, c.error, d.name AS device "
              "FROM commands c LEFT JOIN devices d ON d.id = c.device_id WHERE c.owner = ? ORDER BY c.created DESC LIMIT ?",
              (person_id(user), max(1, min(int(limit), 200))))
    out = []
    for r in rows:
        item = {"id": r["id"], "tool": r["tool"], "title": catalog.title(r["tool"]), "op": r["op"], "status": r["status"],
                "created_at": iso(r["created"]), "updated_at": iso(r["updated"]), "device": r["device"], "app": r["client"]}
        if r["error"]:
            try:
                e = json.loads(r["error"])
                item["error"] = {"code": e.get("code"), "message": str(e.get("message") or "")[:400]}
            except (ValueError, AttributeError):
                pass
        out.append(item)
    return out


# ----------------------------------------------------------------------------- the device side

def _session_for(rec: dict, sid: str) -> DeviceSession:
    s = _sessions.get(rec["id"])
    if s is None:
        raise BridgeAuthError(409, "SESSION_RESTARTED", "The CAD Automation server restarted; say hello again.")
    if s.id != sid:
        raise BridgeAuthError(409, "SESSION_REPLACED", "This computer connected again from another session; this one stopped.")
    if s.closed:
        raise BridgeAuthError(409, "DEVICE_REVOKED" if s.closed[0] == "revoked" else "SESSION_REPLACED", s.closed[1])
    s.last_seen = time.time()
    return s


def hello(rec: dict, body: dict) -> dict:
    proto = body.get("protocol") or {}
    try:
        lo = tuple(int(x) for x in str(proto.get("min", "2.0")).split("."))
        hi = tuple(int(x) for x in str(proto.get("max", "2.0")).split("."))
    except ValueError:
        lo, hi = (9,), (0,)
    if not lo <= (2, 0) <= hi:
        raise BridgeAuthError(426, "PROTOCOL_UNSUPPORTED", "This BIZOMAT Companion speaks another protocol version: update it.")
    old = _sessions.get(rec["id"])
    if old is not None:
        old.closed = ("replaced", "This computer connected again (the BIZOMAT Companion restarted).")
        old.poke()
    s = DeviceSession(rec, body)
    try:
        s.loop = asyncio.get_running_loop()
        s.wake = asyncio.Event()
    except RuntimeError:
        pass
    # commands still open for this device go to the new session (they were delivered or waiting)
    reconcile = []
    inflight = {e.get("command_id"): e for e in body.get("inflight") or [] if isinstance(e, dict)}
    for p in [p for p in _pending.values() if p.payload["device_id"] == rec["id"] and p.status not in TERMINAL]:
        e = inflight.pop(p.id, None)
        if e is None and p.status in ("queued", "delivered"):
            s.queue.append({"v": PROTOCOL, "type": "command.deliver", "msg_id": ulid("msg"), "sent_at": iso(),
                            "attempt": p.attempts + 1, "command_id": p.id, "jws": p.jws})
            p.attempts += 1
        elif e is not None:
            reconcile.append({"command_id": p.id, "action": "send_result" if e.get("result_in_outbox") else "keep_running"})
        else:  # it was running and the companion no longer knows it: its result is lost, never run again
            from .swbridge import BridgeError
            _note(p, "unknown", note="the BIZOMAT Companion restarted while it ran")
            _resolve(p.fut, exc=BridgeError("The BIZOMAT Companion restarted while SOLIDWORKS worked on this. Read the "
                                            "document (sw_get_document) to see what was done.", code="RESULT_LOST"))
    for cid in inflight:
        reconcile.append({"command_id": cid, "action": "forget"})
    _sessions[rec["id"]] = s
    info = {k: body.get(k) for k in ("companion_version", "os", "installations") if body.get(k) is not None}
    _exec("UPDATE devices SET last_seen=?, info=? WHERE id=?", (time.time(), json.dumps(info), rec["id"]))
    return {"v": PROTOCOL, "type": "device.welcome", "msg_id": ulid("msg"), "sent_at": iso(), "session_id": s.id,
            "protocol": PROTOCOL, "server_time": iso(), "device_name": rec["name"],
            "poll": {"wait_s": WAIT, "abort_after_s": WAIT + 15}, "heartbeat": {"online_window_s": ONLINE, "status_every_s": 60},
            "keys": {"jwks_uri": "/v2/keys", "command_kids": [gateway_jwk()["kid"]]},
            "limits": {"max_command_bytes": MAX_COMMAND_BYTES, "chunk_bytes": CHUNK_BYTES, "max_file_bytes": MAX_FILE},
            "reconcile": reconcile}


async def next_messages(rec: dict, sid: str, wait: float) -> list[dict]:
    s = _session_for(rec, sid)
    if s.loop is None:
        s.loop, s.wake = asyncio.get_running_loop(), asyncio.Event()
    deadline = time.monotonic() + max(0.0, min(float(wait), 55.0))
    while True:
        _sweep(s)
        if s.queue:
            break
        left = deadline - time.monotonic()
        if left <= 0:
            s.last_seen = time.time()
            return []
        s.wake.clear()
        try:
            await asyncio.wait_for(s.wake.wait(), timeout=min(left, ACK_TIMEOUT))
        except asyncio.TimeoutError:
            pass
        if s.closed:
            raise BridgeAuthError(409, "DEVICE_REVOKED" if s.closed[0] == "revoked" else "SESSION_REPLACED", s.closed[1])
    out = []
    while s.queue and len(out) < 20:
        m = s.queue.popleft()
        p = _pending.get(m.get("command_id", ""))
        if m["type"] == "command.deliver":
            if p is None or p.status in TERMINAL:
                continue
            p.delivered_at = time.time()
            if p.status == "queued":
                _note(p, "delivered")
        out.append(dict(m))
    s.last_seen = time.time()
    return out


def _sweep(s: DeviceSession) -> None:
    """Deliveries that got no ack go out again; queued commands past their start time expire."""
    from .swbridge import BridgeError
    now = time.time()
    for p in [p for p in _pending.values() if p.payload["device_id"] == s.device_id]:
        if p.status in ("queued", "delivered") and now > parse_iso(p.payload["expires_at"]):
            s.queue = deque(m for m in s.queue if m.get("command_id") != p.id)
            _note(p, "expired", note="not started before it expired")
            _resolve(p.fut, exc=BridgeError("The command expired before SOLIDWORKS could start it.", code="EXPIRED"))
        elif p.status == "delivered" and p.delivered_at and now - p.delivered_at > ACK_TIMEOUT:
            if p.attempts >= MAX_ATTEMPTS:
                _note(p, "failed", note="no acknowledgement after several deliveries")
                _resolve(p.fut, exc=BridgeError("The computer did not acknowledge the command.", code="NOT_DELIVERED"))
            elif not any(m.get("command_id") == p.id for m in s.queue):
                _deliver(s, p)


def _pending_for(rec: dict, command_id: str) -> Pending | None:
    p = _pending.get(command_id or "")
    if p is None or p.payload["device_id"] != rec["id"]:
        return None
    return p


def ack(rec: dict, body: dict) -> dict:
    from .swbridge import BridgeError
    p = _pending_for(rec, body.get("command_id"))
    if p is None or p.status in TERMINAL:
        return {"ok": True, "known": False}
    kind = body.get("ack")
    if kind == "accepted":
        if p.status in ("queued", "delivered"):
            _note(p, "accepted", hop=str(body.get("hop") or "companion"))
    elif kind == "rejected":
        err = body.get("error") if isinstance(body.get("error"), dict) else {}
        msg = str(err.get("message") or "The computer refused the command.")[:2000]
        code = str(err.get("code") or "REJECTED")
        _note(p, "rejected", hop=str(body.get("hop") or "companion"), note=f"{code}: {msg}"[:300])
        _exec("UPDATE commands SET error=? WHERE id=?", (json.dumps(err)[:20000], p.id))
        if code in ("SIGNATURE_INVALID", "REPLAY_DETECTED", "WRONG_DEVICE", "EXPIRED", "INPUT_INVALID", "UNKNOWN_OP",
                    "CAPABILITY_MISSING", "PAUSED", "INSTANCE_NOT_RUNNING", "POLICY_DENIED", "SW_BUSY_DIALOG", "USER_EDITING"):
            _resolve(p.fut, value=({"ok": False, "result": err.get("detail") or {}, "error": msg, "code": code}, {}))
        else:
            _resolve(p.fut, exc=BridgeError(msg, code=code))
    elif kind == "duplicate":
        st = body.get("status")
        if st in ("accepted", "running") and p.status in ("queued", "delivered"):
            _note(p, st)
    return {"ok": True, "known": True, "status": p.status}


def progress(rec: dict, body: dict) -> dict:
    p = _pending_for(rec, body.get("command_id"))
    if p is None or p.status in TERMINAL:
        return {"ok": True, "known": False}
    st = body.get("status")
    if st == "running" and p.status != "running":
        _note(p, "running", hop="addin")
    elif st == "accepted" and p.status in ("queued", "delivered"):
        _note(p, "accepted", hop="addin")
    if isinstance(body.get("progress"), dict):
        p.progress = {k: body["progress"].get(k) for k in ("step", "of", "note")}
    p.waiting_for = body.get("waiting_for") if isinstance(body.get("waiting_for"), str) else None
    return {"ok": True, "known": True, "cancel_requested": False}


def device_status(rec: dict, body: dict) -> dict:
    s = _session_for(rec, str(body.get("session_id") or ""))
    if isinstance(body.get("instances"), list):
        s.instances = [i for i in body["instances"] if isinstance(i, dict)][:8]
    s.paused = bool(body.get("paused"))
    return {"ok": True}


def _files_dir(command_id: str) -> Path:
    d = store.data_dir() / "bridge-files" / re.sub(r"[^A-Za-z0-9_]", "", command_id)
    with _files_dir_lock:
        d.mkdir(parents=True, exist_ok=True)
    return d


def _drop_files(command_id: str) -> None:
    import shutil
    d = store.data_dir() / "bridge-files" / re.sub(r"[^A-Za-z0-9_]", "", command_id)
    shutil.rmtree(d, ignore_errors=True)


_FILE_NAME = re.compile(r"^[^/\\\x00-\x1f]{1,120}$")


def put_chunk(rec: dict, command_id: str, name: str, part: int, parts: int, data: bytes) -> dict:
    p = _pending_for(rec, command_id)
    if p is None or p.status in TERMINAL:
        raise BridgeAuthError(404, "NOT_DELIVERED", "No command waits for this file (it may have timed out).")
    if not _FILE_NAME.match(name or "") or name in (".", ".."):
        raise BridgeAuthError(400, "INPUT_INVALID", "Bad file name.")
    if not (0 <= part < parts <= MAX_FILE // (1024 * 1024) + 1) or len(data) > CHUNK_BYTES:
        raise BridgeAuthError(400, "INPUT_INVALID", "Bad chunk.")
    d = _files_dir(command_id)
    total = sum(f.stat().st_size for f in d.iterdir()) + len(data)
    if total > MAX_FILES_PER_CMD:
        raise BridgeAuthError(413, "PAYLOAD_TOO_LARGE", "Too much data for one command.")
    stem = hashlib.sha256(name.encode()).hexdigest()[:24]
    (d / f"{stem}.{part:05d}.part").write_bytes(data)
    (d / f"{stem}.name").write_text(name)
    have = sorted(d.glob(f"{stem}.*.part"))
    return {"received": part, "parts_received": len(have), "complete": len(have) == parts}


def _assemble(command_id: str, files_out: list) -> dict[str, bytes]:
    d = store.data_dir() / "bridge-files" / re.sub(r"[^A-Za-z0-9_]", "", command_id)
    out: dict[str, bytes] = {}
    for f in files_out or []:
        if not isinstance(f, dict) or not _FILE_NAME.match(str(f.get("name") or "")):
            raise ValueError("bad file entry")
        stem = hashlib.sha256(f["name"].encode()).hexdigest()[:24]
        parts = sorted(d.glob(f"{stem}.*.part")) if d.exists() else []
        data = b"".join(p.read_bytes() for p in parts)
        if len(data) != int(f.get("size", -1)) or "sha256:" + sha256_hex(data) != f.get("sha256"):
            raise ValueError(f"{f['name']} arrived incomplete or damaged")
        if len(data) > MAX_FILE:
            raise ValueError(f"{f['name']} is too big")
        out[f["name"]] = data
    return out


def result(rec: dict, body: dict) -> dict:
    cid = str(body.get("command_id") or "")
    p = _pending_for(rec, cid)
    status = body.get("status")
    if status not in ("succeeded", "failed", "cancelled", "rejected"):
        raise BridgeAuthError(400, "INPUT_INVALID", "status must be succeeded, failed, cancelled or rejected.")
    err = body.get("error") if isinstance(body.get("error"), dict) else None
    res = body.get("result") if isinstance(body.get("result"), dict) else None
    row = _q("SELECT * FROM commands WHERE id=? AND device_id=?", (cid, rec["id"]), one=True)
    if row is None:
        raise BridgeAuthError(404, "NOT_DELIVERED", "No such command for this computer.")
    if row["status"] in ("succeeded", "failed", "cancelled") and (row["result"] is not None or row["error"] is not None):
        return {"v": PROTOCOL, "type": "result.receipt", "msg_id": ulid("msg"), "sent_at": iso(), "command_id": cid,
                "stored": True, "duplicate": True, "status": row["status"]}
    if body.get("params_sha256") != row["params_sha256"]:
        raise BridgeAuthError(400, "INPUT_INVALID", "The result is for other parameters than the command had.")
    try:
        files = _assemble(cid, body.get("files_out") or []) if p is not None else {}
    except ValueError as exc:
        files, err, status, res = {}, {"code": "RESULT_LOST", "category": "transport", "message": f"A file from SOLIDWORKS: {exc}.",
                                       "retryable": True, "hop": "gateway"}, "failed", res
    _exec("UPDATE commands SET result=?, error=?, updated=? WHERE id=?",
          (json.dumps(res)[:2_000_000] if res is not None else None, json.dumps(err)[:20000] if err else None, time.time(), cid))
    final = "succeeded" if status == "succeeded" else status
    if p is not None and not p.waiting:  # the tool already gave up: keep it for sw_command_status, free the rest
        _pending.pop(cid, None)
        p = None
        files = {}
    if p is not None:
        _note(p, final, hop="addin")
        ok = status == "succeeded"
        v1 = {"ok": ok, "result": res or {}, "error": None if ok else str((err or {}).get("message") or "SOLIDWORKS could not do it."),
              "code": None if ok else (err or {}).get("code"), "command_id": cid}
        if (err or {}).get("partial"):
            v1["partial"] = True
        _resolve(p.fut, value=(v1, files))
    else:  # the tool gave up (or the server restarted): kept for sw_command_status
        hist = json.loads(row["history"] or "[]") + [{"status": final, "at": iso(), "hop": "addin", "note": "finished late"}]
        _exec("UPDATE commands SET status=?, history=? WHERE id=?", (final, json.dumps(hist[-50:]), cid))
        _drop_files(cid)
    return {"v": PROTOCOL, "type": "result.receipt", "msg_id": ulid("msg"), "sent_at": iso(), "command_id": cid,
            "stored": True, "duplicate": False, "status": final}


def blob_for(rec: dict, blob_id: str) -> tuple[bytes, str]:
    from . import swbridge
    p = next((p for p in _pending.values() if p.payload["device_id"] == rec["id"] and blob_id in p.blobs
              and p.status not in TERMINAL), None)
    b = swbridge._blobs.get(blob_id)
    if p is None or b is None or b["pid"] != rec["owner"] or b["expires"] < time.time():
        raise KeyError(blob_id)
    return b["data"], b["filename"]


# ----------------------------------------------------------------------------- HTTP routes

router = APIRouter()


def _err(exc: BridgeAuthError) -> JSONResponse:
    category = "auth" if exc.status == 401 else "transport" if exc.status in (409, 426) else "input"
    return JSONResponse({"v": PROTOCOL, "type": "error", "error": {"code": exc.code, "category": category, "message": exc.message,
                                                                    "retryable": exc.status in (409,), "hop": "gateway"}},
                        status_code=exc.status, headers={"Cache-Control": "no-store", "KEVOS-Server-Time": iso()})


def _ok(body: dict, status: int = 200) -> JSONResponse:
    return JSONResponse(body, status_code=status, headers={"Cache-Control": "no-store", "KEVOS-Server-Time": iso()})


async def _json(request: Request) -> tuple[bytes, dict]:
    raw = await request.body()
    try:
        body = json.loads(raw or b"{}")
    except ValueError:
        raise BridgeAuthError(400, "INPUT_INVALID", "The body must be JSON.") from None
    if not isinstance(body, dict):
        raise BridgeAuthError(400, "INPUT_INVALID", "The body must be a JSON object.")
    return raw, body


@router.get("/v2/keys")
def keys():
    return _ok({"keys": [gateway_jwk()]})


@router.post("/v2/devices/pair/start")
async def pair_start(request: Request):
    from . import auth, mcpauth
    try:
        raw, body = await _json(request)
        if _open_and_remote(request):
            raise BridgeAuthError(403, "FORBIDDEN", "This CAD Automation server has no sign-in yet: set a server password "
                                                    "before computers pair with it over the network.")
        if not mcpauth._rate_ok("pair:" + _client_ip(request), PAIR_LIMIT, 3600, _pair_hits):
            raise BridgeAuthError(429, "RATE_LIMITED", "Too many pairing attempts from this network. Try again in an hour.")
        out = start_pairing(body, _client_ip(request))
    except BridgeAuthError as exc:
        return _err(exc)
    except ValueError as exc:
        return _err(BridgeAuthError(400, "INPUT_INVALID", str(exc)))
    base = auth.public_url(dict(request.headers))
    out["verification_uri"] = base + "/devices/pair"
    out["verification_uri_complete"] = base + "/devices/pair?code=" + out["user_code"]
    return _ok(out)


@router.post("/v2/devices/pair/poll")
async def pair_poll(request: Request):
    try:
        raw, _ = await _json(request)
        pair = authenticate(request, raw, pairing=True)
    except BridgeAuthError as exc:
        return _err(exc)
    out = poll_pairing(pair)
    return _ok(out, 200 if out["status"] in ("pending", "approved") else 410)


@router.post("/v2/devices/pair/password")
async def pair_password(request: Request):
    """Pairing from the Companion's window with the person's own email and password, instead of confirming the
    code in a browser. Signed with the pairing key, so the password approves only this computer's pairing. The
    Companion sends the password once and keeps neither it nor a token."""
    from . import accounts, auth
    try:
        raw, body = await _json(request)
        pair = authenticate(request, raw, pairing=True)
        if auth.mode() != "accounts":
            raise BridgeAuthError(403, "FORBIDDEN", "This CAD Automation server has no accounts yet. Its owner creates the first one on the website.")
        email = str(body.get("email") or "").strip().lower()[:200]
        password = str(body.get("password") or "")[:500]
        keys = ("ip:" + _client_ip(request), "email:" + email)
        if auth._limited(*keys):
            raise BridgeAuthError(429, "RATE_LIMITED", "Too many sign-in attempts. Wait a few minutes and try again.")
        user = await asyncio.to_thread(accounts.verify, email, password)
        if user is None:
            auth._failed(*keys)
            await asyncio.sleep(1)  # slow down guessing, as the sign-in page does
            raise BridgeAuthError(401, "INVALID_CREDENTIALS", "The email or password is wrong.")
        if pair["status"] != "pending" or pair["expires"] < time.time():
            raise BridgeAuthError(410, "PAIRING_CLOSED", "This pairing expired or was already decided. Click Pair again.")
        try:
            approve_pairing(user, pair["code"], body.get("name"))
        except ValueError as exc:
            raise BridgeAuthError(410, "PAIRING_CLOSED", str(exc))
    except BridgeAuthError as exc:
        return _err(exc)
    return _ok(poll_pairing(_q("SELECT * FROM pairings WHERE id=?", (pair["id"],), one=True)))


@router.post("/v2/device/hello")
async def device_hello(request: Request):
    try:
        raw, body = await _json(request)
        rec = authenticate(request, raw)
        return _ok(hello(rec, body))
    except BridgeAuthError as exc:
        return _err(exc)


@router.get("/v2/device/next")
async def device_next(request: Request, session: str = "", wait: float = WAIT):
    try:
        rec = authenticate(request, b"")
        msgs = await next_messages(rec, session, wait)
    except BridgeAuthError as exc:
        if exc.status == 409:
            return JSONResponse({"v": PROTOCOL, "type": "session.end", "msg_id": ulid("msg"), "sent_at": iso(),
                                 "reason": {"SESSION_RESTARTED": "restarted", "DEVICE_REVOKED": "revoked"}.get(exc.code, "replaced"),
                                 "error": {"code": exc.code, "category": "transport", "message": exc.message, "retryable": True,
                                           "hop": "gateway"}}, status_code=409, headers={"Cache-Control": "no-store"})
        return _err(exc)
    if not msgs:
        return Response(status_code=204, headers={"Cache-Control": "no-store", "KEVOS-Server-Time": iso()})
    return _ok({"v": PROTOCOL, "type": "gateway.messages", "msg_id": ulid("msg"), "sent_at": iso(), "session_id": session,
                "server_time": iso(), "messages": msgs})


def _device_post(fn):
    async def route(request: Request):
        try:
            raw, body = await _json(request)
            rec = authenticate(request, raw)
            return _ok(fn(rec, body))
        except BridgeAuthError as exc:
            return _err(exc)
    return route


router.add_api_route("/v2/device/ack", _device_post(ack), methods=["POST"])
router.add_api_route("/v2/device/progress", _device_post(progress), methods=["POST"])
router.add_api_route("/v2/device/status", _device_post(device_status), methods=["POST"])
router.add_api_route("/v2/device/result", _device_post(result), methods=["POST"])


@router.post("/v2/device/unpair")
async def device_unpair(request: Request):
    try:
        raw, _ = await _json(request)
        rec = authenticate(request, raw)
    except BridgeAuthError as exc:
        return _err(exc)
    _exec("UPDATE devices SET revoked=? WHERE id=?", (time.time(), rec["id"]))
    _end_session(rec["id"], "revoked", "This computer was unpaired.")
    return _ok({"ok": True})


@router.post("/v2/device/file")
async def device_file(request: Request, command: str = "", name: str = "", part: int = 0, parts: int = 1):
    # before reading up to 32 MiB: the proof must name a registered computer that has this command open
    try:
        kid = str(jws_parts(request.headers.get("authorization", "")[len("KEVOS-Device "):].strip())[0].get("kid") or "")
    except ValueError:
        kid = ""
    p = _pending.get(command)
    if not kid or p is None or p.payload["device_id"] != kid:
        return _err(BridgeAuthError(401, "UNAUTHENTICATED", "No command of this computer waits for this file."))
    raw = bytearray()
    async for chunk in request.stream():
        raw += chunk
        if len(raw) > CHUNK_BYTES:
            return _err(BridgeAuthError(413, "PAYLOAD_TOO_LARGE", f"A chunk is {CHUNK_BYTES // 2**20} MiB at most."))
    data = bytes(raw)
    try:
        rec = authenticate(request, data)
        return _ok(await asyncio.to_thread(put_chunk, rec, command, name, part, parts, data))
    except BridgeAuthError as exc:
        return _err(exc)


@router.get("/v2/device/blob/{blob_id}")
async def device_blob(request: Request, blob_id: str):
    try:
        rec = authenticate(request, b"")
        data, filename = blob_for(rec, blob_id)
    except BridgeAuthError as exc:
        return _err(exc)
    except KeyError:
        return _err(BridgeAuthError(404, "INPUT_INVALID", "No such file for this computer."))
    return Response(data, media_type="application/octet-stream",
                    headers={"Cache-Control": "no-store", "Content-Disposition": f'attachment; filename="{filename}"',
                             "KEVOS-Sha256": sha256_hex(data)})


@router.get("/v2/bridge/update.json")
async def bridge_update(request: Request):
    """The current release of CAD Automation for SOLIDWORKS for registered computers, signed with this server's command key (which each
    companion pinned at pairing). The operator writes bridge-release.json in the data folder:
    {"version", "msi_url" (https), "sha256", "size", "signer_thumbprints": [...], "notes"}. The companion still checks
    the MSI's hash, its Authenticode signature and signer, and asks the person before installing."""
    try:
        authenticate(request, b"")
    except BridgeAuthError as exc:
        return _err(exc)
    try:
        keep = release_manifest()
    except ValueError:
        return _err(BridgeAuthError(500, "INTERNAL", "The published release record is not valid."))
    if keep is None:
        return _err(BridgeAuthError(404, "INPUT_INVALID", "No CAD Automation for SOLIDWORKS release is published on this server."))
    return _ok({"manifest_jws": sign_message(dict(keep, type="kevos.update"), "kevos-update")})


def release_manifest() -> dict | None:
    """The release the operator published (bridge-release.json in the data folder), checked; None when there is none.
    Raises ValueError when the file is there but not valid."""
    p = store.data_dir() / "bridge-release.json"
    if not p.exists():
        return None
    try:
        rel = json.loads(p.read_text())
        assert isinstance(rel, dict) and str(rel.get("msi_url", "")).startswith("https://") and rel.get("sha256", "").startswith("sha256:")
    except (ValueError, AssertionError) as exc:
        raise ValueError("The published release record is not valid.") from exc
    return {k: rel[k] for k in ("version", "msi_url", "sha256", "size", "signer_thumbprints", "notes", "published_at") if k in rel}


# signed-in people: their computers

def _user(request: Request):
    return getattr(request.state, "user", None)


@router.get("/api/devices")
def api_devices(request: Request):
    return {"devices": list_devices(_user(request))}


@router.get("/api/commands")
def api_commands(request: Request, limit: int = 50):
    """The signed-in person's recent commands (the app's History and Home pages)."""
    return {"commands": recent_commands(_user(request), limit)}


@router.post("/api/devices/{device_id}")
async def api_device_update(request: Request, device_id: str):
    try:
        body = await request.json()
    except ValueError:
        body = {}
    try:
        return set_device(_user(request), device_id, body.get("name"), body.get("default"))
    except KeyError:
        raise HTTPException(404, "No such computer.") from None
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from None


@router.delete("/api/devices/{device_id}")
def api_device_delete(request: Request, device_id: str):
    if not revoke_device(_user(request), device_id):
        raise HTTPException(404, "No such computer.")
    return {"ok": True}


def _pair_page(code: str = "", pairing: dict | None = None, error: str = "", done: dict | None = None) -> bytes:
    from . import auth
    if done:
        return auth.notice_page("Computer added", f"{auth._esc(done['name'])} is now on your account.",
                                "You can close this window. The BIZOMAT Companion on that computer connects by itself.")
    info = json.loads((pairing or {}).get("info") or "{}")
    sub = ("Check that this code is the one your computer shows, then add it." if pairing else
           "Type the code the BIZOMAT Companion shows on your computer.")
    fields = [auth._field("code", "Code", value=code, focus=not pairing, auto="off", note="Like ABCD-EFGH")]
    if pairing:
        fields.append(auth._field("name", "Name for this computer", value=pairing.get("name") or "", focus=True,
                                  note=auth._esc(" ".join(x for x in (info.get("machine"), info.get("os")) if x))))
    links = ('<button name="decision" value="deny" formnovalidate class="ghost">Not my computer</button>'
             '<div class="note center">Not added unless you choose Add this computer.</div>' if pairing else "")
    return auth._page("Add a computer", sub, "/devices/pair", fields, "Add this computer" if pairing else "Continue",
                      error=error, links=links)


@router.get("/devices/pair")
def pair_page(code: str = ""):
    p = pairing_by_code(code) if code else None
    return HTMLResponse(_pair_page(code if p else "", p, "" if p or not code else "That code is not valid or has expired."),
                        headers={"Cache-Control": "no-store", "X-Frame-Options": "DENY"})


@router.post("/devices/pair")
async def pair_page_post(request: Request):
    from urllib.parse import parse_qs
    if _open_and_remote(request):
        raise HTTPException(403, "Set a server password before adding computers over the network.")
    raw = await request.body()
    form = {k: v[0] for k, v in parse_qs(raw.decode(errors="ignore")).items()} if len(raw) < 20000 else {}
    code = form.get("code", "")
    p = pairing_by_code(code)
    hdr = {"Cache-Control": "no-store", "X-Frame-Options": "DENY"}
    if form.get("decision") == "deny":
        deny_pairing(code)
        from . import auth
        return HTMLResponse(auth.notice_page("Not added", "That computer was not added.", "Its code no longer works."), headers=hdr)
    if not p or p["status"] != "pending":
        return HTMLResponse(_pair_page(error="That code is not valid or has expired. Start pairing again in the BIZOMAT Companion."),
                            status_code=400, headers=hdr)
    if "name" not in form:  # first step: the code was typed; show what it is for
        return HTMLResponse(_pair_page(p["code"], p), headers=hdr)
    try:
        done = approve_pairing(_user(request), p["code"], form.get("name"))
    except ValueError as exc:
        return HTMLResponse(_pair_page(error=str(exc)), status_code=400, headers=hdr)
    return HTMLResponse(_pair_page(done=done), headers=hdr)
