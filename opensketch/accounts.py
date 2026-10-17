"""User accounts: people sign in with an email and a password.

Stored in the data folder (OPENSKETCH_DATA):
- `users.json`    {"users": [{id, email, name, role, salt, hash, created}], "invites": [{hash, created, expires, by}]}
- `sessions.json` {sha256(cookie token): {user, created, expires}}

Passwords are hashed with scrypt (salted, never stored). Session cookies are random tokens; only their
SHA-256 is stored, so the file cannot be used to sign in. Signing out removes the session on the server.
The first account is the owner. The owner invites other people with single-use links that last 7 days.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import secrets
import threading
import time
import uuid

SESSION_DAYS = 90
INVITE_DAYS = 7
MIN_PASSWORD = 8
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_lock = threading.RLock()


class AccountError(Exception):
    """A plain-language reason the request was refused (shown on the form)."""


def _dir():
    from . import store
    return store.data_dir()


def _read(name: str, empty):
    p = _dir() / name
    try:
        return json.loads(p.read_text())
    except (FileNotFoundError, ValueError):
        return empty


def _write(name: str, data) -> None:
    p = _dir() / name
    tmp = p.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=1))
    os.chmod(tmp, 0o600)
    tmp.replace(p)


def _users() -> dict:
    d = _read("users.json", {})
    d.setdefault("users", [])
    d.setdefault("invites", [])
    return d


def _hash(password: str, salt: bytes) -> str:
    return hashlib.scrypt(password.encode(), salt=salt, n=2 ** 14, r=8, p=1, dklen=32).hex()


def _sha(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def public(u: dict) -> dict:
    return {"id": u["id"], "email": u["email"], "name": u["name"], "role": u["role"], "created": u.get("created")}


def any_users() -> bool:
    return bool(_users()["users"])


def list_users() -> list[dict]:
    return [public(u) for u in _users()["users"]]


def get(user_id: str) -> dict | None:
    return next((public(u) for u in _users()["users"] if u["id"] == user_id), None)


def _check_new(email: str, name: str, password: str, data: dict) -> tuple[str, str]:
    email = (email or "").strip().lower()
    name = (name or "").strip()[:60]
    if not EMAIL_RE.match(email) or len(email) > 200:
        raise AccountError("Enter a valid email address.")
    if len(password or "") < MIN_PASSWORD:
        raise AccountError(f"Use a password of at least {MIN_PASSWORD} characters.")
    if any(u["email"] == email for u in data["users"]):
        raise AccountError("There is already an account with this email.")
    return email, name or email.split("@")[0]


def _new_user(email: str, name: str, password: str, role: str) -> dict:
    salt = secrets.token_bytes(16)
    return {"id": uuid.uuid4().hex[:12], "email": email, "name": name, "role": role,
            "salt": salt.hex(), "hash": _hash(password, salt), "created": int(time.time())}


def create_owner(email: str, name: str, password: str) -> dict:
    """The first account. Refused once any account exists."""
    with _lock:
        data = _users()
        if data["users"]:
            raise AccountError("OpenSketch is already set up. Sign in instead.")
        email, name = _check_new(email, name, password, data)
        u = _new_user(email, name, password, "owner")
        data["users"].append(u)
        _write("users.json", data)
        return public(u)


def verify(email: str, password: str) -> dict | None:
    email = (email or "").strip().lower()
    for u in _users()["users"]:
        if u["email"] == email:
            ok = hmac.compare_digest(_hash(password or "", bytes.fromhex(u["salt"])), u["hash"])
            return public(u) if ok else None
    _hash(password or "", b"0" * 16)  # same time whether or not the email exists
    return None


def set_password(user_id: str, new: str, current: str | None = None) -> None:
    """Change a password. With `current`, it must match (the account page); without, the caller checked
    the right to reset it (the server password). Every session of the user is signed out."""
    if len(new or "") < MIN_PASSWORD:
        raise AccountError(f"Use a password of at least {MIN_PASSWORD} characters.")
    with _lock:
        data = _users()
        u = next((x for x in data["users"] if x["id"] == user_id), None)
        if u is None:
            raise AccountError("No such account.")
        if current is not None and not hmac.compare_digest(_hash(current, bytes.fromhex(u["salt"])), u["hash"]):
            raise AccountError("The current password is wrong.")
        salt = secrets.token_bytes(16)
        u["salt"], u["hash"] = salt.hex(), _hash(new, salt)
        _write("users.json", data)
    end_sessions(user_id)


def find_by_email(email: str) -> dict | None:
    email = (email or "").strip().lower()
    return next((public(u) for u in _users()["users"] if u["email"] == email), None)


def rename(user_id: str, name: str) -> dict:
    name = (name or "").strip()[:60]
    if not name:
        raise AccountError("Enter a name.")
    with _lock:
        data = _users()
        u = next((x for x in data["users"] if x["id"] == user_id), None)
        if u is None:
            raise AccountError("No such account.")
        u["name"] = name
        _write("users.json", data)
        return public(u)


def remove(user_id: str, by: str) -> None:
    with _lock:
        data = _users()
        u = next((x for x in data["users"] if x["id"] == user_id), None)
        if u is None:
            raise AccountError("No such account.")
        if u["role"] == "owner":
            raise AccountError("The owner account cannot be removed.")
        data["users"] = [x for x in data["users"] if x["id"] != user_id]
        _write("users.json", data)
    end_sessions(user_id)


# ---------------------------------------------------------------- invites

def create_invite(by: str) -> str:
    token = secrets.token_urlsafe(24)
    now = int(time.time())
    with _lock:
        data = _users()
        data["invites"] = [i for i in data["invites"] if i["expires"] > now]
        data["invites"].append({"hash": _sha(token), "created": now, "expires": now + INVITE_DAYS * 86400, "by": by})
        _write("users.json", data)
    return token


def invite_valid(token: str) -> bool:
    now = int(time.time())
    h = _sha(token or "")
    return any(hmac.compare_digest(i["hash"], h) and i["expires"] > now for i in _users()["invites"])


def accept_invite(token: str, email: str, name: str, password: str) -> dict:
    with _lock:
        data = _users()
        now = int(time.time())
        h = _sha(token or "")
        inv = next((i for i in data["invites"] if hmac.compare_digest(i["hash"], h) and i["expires"] > now), None)
        if inv is None:
            raise AccountError("This invite link has expired or was already used. Ask for a new one.")
        email, name = _check_new(email, name, password, data)
        u = _new_user(email, name, password, "member")
        data["users"].append(u)
        data["invites"] = [i for i in data["invites"] if i is not inv]
        _write("users.json", data)
        return public(u)


def pending_invites() -> int:
    now = int(time.time())
    return sum(1 for i in _users()["invites"] if i["expires"] > now)


# ---------------------------------------------------------------- sessions

def start_session(user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    now = int(time.time())
    with _lock:
        s = {k: v for k, v in _read("sessions.json", {}).items() if v["expires"] > now}
        s[_sha(token)] = {"user": user_id, "created": now, "expires": now + SESSION_DAYS * 86400}
        _write("sessions.json", s)
    return token


def session_user(token: str) -> dict | None:
    if not token:
        return None
    rec = _read("sessions.json", {}).get(_sha(token))
    if not rec or rec["expires"] <= time.time():
        return None
    return get(rec["user"])


def end_session(token: str) -> None:
    with _lock:
        s = _read("sessions.json", {})
        if s.pop(_sha(token or ""), None) is not None:
            _write("sessions.json", s)


def end_sessions(user_id: str) -> None:
    with _lock:
        s = _read("sessions.json", {})
        kept = {k: v for k, v in s.items() if v["user"] != user_id}
        if len(kept) != len(s):
            _write("sessions.json", kept)
