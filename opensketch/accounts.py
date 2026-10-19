"""User accounts: people sign in with an email and a password.

Stored in the data folder (OPENSKETCH_DATA):
- `users.json`    {"users": [{id, email, name, role, salt, hash, created, email_verified, google?, mcp_n?}],
                   "invites": [{id, hash, created, expires, by, note}], "settings": {...}}
- `sessions.json` {sha256(cookie token): {user, created, expires}}

Every request reads these, so they are parsed once per change and shared (accounts.derived keeps lookups built
from them); writers change a private copy under the lock.

Passwords are hashed with scrypt (salted, never stored). Session cookies are random tokens; only their
SHA-256 is stored, so the file cannot be used to sign in. Signing out removes the session on the server.
The first account is the owner. The owner invites other people with single-use links that last 7 days.

Early access (showcases): anyone who types the owner's access code skips sign-up and gets an account of their own
named "Internal tester N" (role "tester": no password, no real email, until they keep their work with an email and
password or Google: keep_tester). Testers use the server's AI key with no limit while the code is on
(aikeys.effective). The code is the owner's setting (`settings.access` in users.json), else the server's
OPENSKETCH_ACCESS_CODE; the owner can change it, turn it off, or remove every tester at once.
"""

from __future__ import annotations

import hashlib
import hmac
import copy
import json
import tempfile
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
ACCESS_RE = re.compile(r"^[A-Za-z0-9_-]{4,40}$")
TESTER_DOMAIN = "testers.opensketch.app"  # placeholder emails, never mailed
_lock = threading.RLock()


class AccountError(Exception):
    """A plain-language reason the request was refused (shown on the form)."""


def _dir():
    from . import store
    return store.data_dir()


# file -> (inode, mtime_ns, size, parsed, derived): every request reads these, so the parsed data is shared and
# read-only (no copy per request); `derived` holds lookups built from it (by id, by address key...).
_cache: dict[str, tuple] = {}


def _norm(name: str, data):
    if name == "users.json" and isinstance(data, dict):
        data.setdefault("users", [])
        data.setdefault("invites", [])
    return data


def _entry(name: str, empty) -> tuple | None:
    """The cache entry for a file, read again only when it changed. A missing file is None; a damaged one raises
    for users.json (it must never read as "no accounts": that would open the server)."""
    p = _dir() / name
    try:
        st = p.stat()
    except FileNotFoundError:
        if name == "users.json" and (_dir() / "accounts.enabled").exists():
            raise AccountError("The accounts file is missing. Restore users.json from a backup.") from None
        return None
    hit = _cache.get(str(p))
    if hit and hit[:3] == (st.st_ino, st.st_mtime_ns, st.st_size):
        return hit
    try:
        data = _norm(name, json.loads(p.read_text()))
    except ValueError:
        if name == "users.json":
            raise AccountError("The accounts file is damaged. Restore users.json from a backup.") from None
        data = _norm(name, copy.deepcopy(empty))  # sessions: everyone signs in again
    hit = (st.st_ino, st.st_mtime_ns, st.st_size, data, {})
    _cache[str(p)] = hit
    return hit


def _read(name: str, empty):
    """The parsed file, shared: never change it (writers start from _copy)."""
    hit = _entry(name, empty)
    return hit[3] if hit else _norm(name, copy.deepcopy(empty))


def _copy(name: str, empty):
    """A private copy of the file for a writer (under _lock) to change and _write."""
    return copy.deepcopy(_read(name, empty))


def derived(key: str, build, name: str = "users.json"):
    """build(parsed file), kept until the file changes (indexes: account by id, address keys...)."""
    hit = _entry(name, {})
    if hit is None:
        return build(_norm(name, {}))
    if key not in hit[4]:
        hit[4][key] = build(hit[3])
    return hit[4][key]


def _write(name: str, data) -> None:
    p = _dir() / name
    fd, tmp = tempfile.mkstemp(prefix=name + ".", suffix=".tmp", dir=p.parent)  # never shared between writers
    try:
        with os.fdopen(fd, "w") as f:
            f.write(json.dumps(data, indent=1))
        os.chmod(tmp, 0o600)
        os.replace(tmp, p)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise
    st = p.stat()  # this process reads what it just wrote, even within one mtime tick
    _cache[str(p)] = (st.st_ino, st.st_mtime_ns, st.st_size, _norm(name, copy.deepcopy(data)), {})
    if name == "users.json" and data.get("users"):
        (_dir() / "accounts.enabled").touch()  # from now on a missing users.json fails closed


def _users() -> dict:
    """users.json for reading (shared, never change it)."""
    return _read("users.json", {})


def _edit() -> dict:
    """users.json for a writer to change (hold _lock, then _write)."""
    return _copy("users.json", {})


def _by_id() -> dict:
    return derived("by_id", lambda d: {u["id"]: u for u in d["users"]})


def _hash(password: str, salt: bytes) -> str:
    return hashlib.scrypt(password.encode(), salt=salt, n=2 ** 14, r=8, p=1, dklen=32).hex()


def _sha(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def public(u: dict) -> dict:
    return {"id": u["id"], "email": u["email"], "name": u["name"], "role": u["role"], "created": u.get("created"),
            "google": bool(u.get("google")), "has_password": bool(u.get("hash")), "tester": u["role"] == "tester"}


def any_users() -> bool:
    return bool(_users()["users"])


def list_users() -> list[dict]:
    return [public(u) for u in _users()["users"]]


def get(user_id: str) -> dict | None:
    u = _by_id().get(user_id)
    return public(u) if u else None


def owner() -> dict | None:
    u = derived("owner", lambda d: next((x for x in d["users"] if x["role"] == "owner"), None))
    return public(u) if u else None


def _drop_apps(user_id: str) -> None:
    """End every AI app's sign-in (mcpauth grants) for this person."""
    from . import mcpauth
    mcpauth.drop_user(user_id)


def _check_new(email: str, name: str, password: str | None, data: dict, me: str = "") -> tuple[str, str]:
    email = (email or "").strip().lower()
    name = (name or "").strip()[:60]
    if not EMAIL_RE.match(email) or len(email) > 200 or email.endswith("@" + TESTER_DOMAIN):
        raise AccountError("Enter a valid email address.")
    if password is not None and len(password or "") < MIN_PASSWORD:
        raise AccountError(f"Use a password of at least {MIN_PASSWORD} characters.")
    if any(u["email"] == email and u["id"] != me for u in data["users"]):
        raise AccountError("There is already an account with this email.")
    return email, name or email.split("@")[0]


def _new_user(email: str, name: str, password: str | None, role: str, google: str | None = None, verified: bool = False) -> dict:
    """A password of None (Google sign-up) stores no usable password until the person sets one. verified: the
    email is proven (Google said so, or the owner set the server up); typed emails are not."""
    salt = secrets.token_bytes(16)
    u = {"id": uuid.uuid4().hex[:12], "email": email, "name": name, "role": role,
         "salt": salt.hex(), "hash": _hash(password, salt) if password else "", "created": int(time.time()),
         "email_verified": bool(verified or google)}
    if google:
        u["google"] = google
    return u


def create_owner(email: str, name: str, password: str) -> dict:
    """The first account. Refused once any account exists."""
    with _lock:
        data = _edit()
        if data["users"]:
            raise AccountError("OpenSketch is already set up. Sign in instead.")
        email, name = _check_new(email, name, password, data)
        u = _new_user(email, name, password, "owner", verified=True)
        data["users"].append(u)
        _write("users.json", data)
        return public(u)


def verify(email: str, password: str) -> dict | None:
    email = (email or "").strip().lower()
    for u in _users()["users"]:
        if u["email"] == email:
            ok = bool(u["hash"]) and hmac.compare_digest(_hash(password or "", bytes.fromhex(u["salt"])), u["hash"])
            return public(u) if ok else None
    _hash(password or "", b"0" * 16)  # same time whether or not the email exists
    return None


def set_password(user_id: str, new: str, current: str | None = None) -> None:
    """Change a password. With `current`, it must match (the account page); without, the caller checked
    the right to reset it (the server password). Signs the person out everywhere: every session, every AI app
    that signed in, and their private AI address (a new one is made)."""
    if len(new or "") < MIN_PASSWORD:
        raise AccountError(f"Use a password of at least {MIN_PASSWORD} characters.")
    with _lock:
        data = _edit()
        u = next((x for x in data["users"] if x["id"] == user_id), None)
        if u is None:
            raise AccountError("No such account.")
        if current is not None and u["hash"] and not hmac.compare_digest(_hash(current, bytes.fromhex(u["salt"])), u["hash"]):
            raise AccountError("The current password is wrong.")
        salt = secrets.token_bytes(16)
        u["salt"], u["hash"] = salt.hex(), _hash(new, salt)
        u["mcp_n"] = int(u.get("mcp_n", 0)) + 1
        _write("users.json", data)
    end_sessions(user_id)
    _drop_apps(user_id)


def find_by_email(email: str) -> dict | None:
    email = (email or "").strip().lower()
    return next((public(u) for u in _users()["users"] if u["email"] == email), None)


def rename(user_id: str, name: str) -> dict:
    name = (name or "").strip()[:60]
    if not name:
        raise AccountError("Enter a name.")
    with _lock:
        data = _edit()
        u = next((x for x in data["users"] if x["id"] == user_id), None)
        if u is None:
            raise AccountError("No such account.")
        u["name"] = name
        _write("users.json", data)
        return public(u)


def remove(user_id: str, by: str) -> None:
    with _lock:
        data = _edit()
        u = next((x for x in data["users"] if x["id"] == user_id), None)
        if u is None:
            raise AccountError("No such account.")
        if u["role"] == "owner":
            raise AccountError("The owner account cannot be removed.")
        data["users"] = [x for x in data["users"] if x["id"] != user_id]
        _write("users.json", data)
    end_sessions(user_id)


# ---------------------------------------------------------------- private AI address (auth.mcp_token_for)

def mcp_counter(user_id: str) -> int:
    """How many times this person's private AI address was replaced (0 = never)."""
    u = _by_id().get(user_id)
    return int(u.get("mcp_n", 0)) if u else 0


def new_mcp_address(user_id: str) -> int:
    """Replace the person's private AI address: the old one stops working at once."""
    with _lock:
        data = _edit()
        u = next((x for x in data["users"] if x["id"] == user_id), None)
        if u is None:
            raise AccountError("No such account.")
        u["mcp_n"] = int(u.get("mcp_n", 0)) + 1
        _write("users.json", data)
        return u["mcp_n"]


# ---------------------------------------------------------------- invites

def _invite_id(i: dict) -> str:
    return i.get("id") or i["hash"][:12]


def create_invite(by: str, note: str = "") -> str:
    token = secrets.token_urlsafe(24)
    now = int(time.time())
    with _lock:
        data = _edit()
        data["invites"] = [i for i in data["invites"] if i["expires"] > now]
        data["invites"].append({"id": secrets.token_hex(6), "hash": _sha(token), "created": now,
                                "expires": now + INVITE_DAYS * 86400, "by": by, "note": (note or "").strip()[:60]})
        _write("users.json", data)
    return token


def invite_valid(token: str) -> bool:
    now = int(time.time())
    h = _sha(token or "")
    return any(hmac.compare_digest(i["hash"], h) and i["expires"] > now for i in _users()["invites"])


def accept_invite(token: str, email: str, name: str, password: str | None, google: str | None = None) -> dict:
    with _lock:
        data = _edit()
        now = int(time.time())
        h = _sha(token or "")
        inv = next((i for i in data["invites"] if hmac.compare_digest(i["hash"], h) and i["expires"] > now), None)
        if inv is None:
            raise AccountError("This invite link has expired or was already used. Ask for a new one.")
        email, name = _check_new(email, name, password, data)
        u = _new_user(email, name, password, "member", google)
        data["users"].append(u)
        data["invites"] = [i for i in data["invites"] if i is not inv]
        _write("users.json", data)
        return public(u)


def pending_invites() -> int:
    return len(list_invites())


def list_invites() -> list[dict]:
    """Invite links not used yet (owner): {id, created, expires, note}. Never the link itself."""
    now = int(time.time())
    return [{"id": _invite_id(i), "created": i["created"], "expires": i["expires"], "note": i.get("note", "")}
            for i in _users()["invites"] if i["expires"] > now]


def revoke_invite(invite_id: str) -> bool:
    """Owner: the link stops working at once."""
    with _lock:
        data = _edit()
        kept = [i for i in data["invites"] if _invite_id(i) != invite_id]
        if len(kept) == len(data["invites"]):
            return False
        data["invites"] = kept
        _write("users.json", data)
        return True


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
        h = _sha(token or "")
        if h in s:
            _write("sessions.json", {k: v for k, v in s.items() if k != h})


def end_sessions(user_id: str) -> None:
    with _lock:
        s = _read("sessions.json", {})
        kept = {k: v for k, v in s.items() if v["user"] != user_id}
        if len(kept) != len(s):
            _write("sessions.json", kept)


# ---------------------------------------------------------------- sign-up and Google

def settings() -> dict:
    return {"open_signup": bool(_users().get("settings", {}).get("open_signup"))}


def set_open_signup(on: bool) -> dict:
    with _lock:
        data = _edit()
        data.setdefault("settings", {})["open_signup"] = bool(on)
        _write("users.json", data)
    return settings()


# ---------------------------------------------------------------- early access

def max_testers() -> int:
    """At most this many Internal tester accounts at once (OPENSKETCH_MAX_TESTERS, default 100)."""
    try:
        return max(1, int(os.environ.get("OPENSKETCH_MAX_TESTERS", "100")))
    except ValueError:
        return 100


def access_settings() -> dict:
    """The early-access code (owner only): {code, on, source: "app" | "server" | "none"}."""
    s = _users().get("settings", {}).get("access")
    if s is None:
        env = os.environ.get("OPENSKETCH_ACCESS_CODE", "").strip()
        return {"code": env, "on": bool(env), "source": "server" if env else "none"}
    return {"code": s.get("code", ""), "on": bool(s.get("on") and s.get("code")), "source": "app"}


def access_code() -> str | None:
    s = access_settings()
    return s["code"] if s["on"] else None


def set_access(code: str | None = None, on: bool | None = None) -> dict:
    """Owner: change the code and/or turn it on or off (stored here, over OPENSKETCH_ACCESS_CODE)."""
    with _lock:
        cur = access_settings()
        code = cur["code"] if code is None else code.strip()
        if code and not ACCESS_RE.match(code):
            raise AccountError("Use 4 to 40 letters, numbers, - or _ for the code.")
        on = cur["on"] if on is None else bool(on)
        if on and not code:
            raise AccountError("Enter a code first.")
        data = _edit()
        data.setdefault("settings", {})["access"] = {"code": code, "on": on}
        _write("users.json", data)
    return access_settings()


def check_access(given: str) -> bool:
    """Is this the early-access code? Case and spaces around it do not matter."""
    code = access_code()
    return bool(code) and hmac.compare_digest((given or "").strip().lower().encode(), code.lower().encode())


def create_tester() -> dict:
    """A new "Internal tester N" account for someone who typed the access code (at most max_testers at once)."""
    with _lock:
        data = _edit()
        if not data["users"]:
            raise AccountError("Create the owner account first.")
        if sum(1 for u in data["users"] if u["role"] == "tester") >= max_testers():
            raise AccountError("Early access is full right now. Ask the person who gave you the code.")
        settings = data.setdefault("settings", {})
        n = int(settings.get("testers_made", 0)) + 1
        settings["testers_made"] = n
        email = f"tester{n}-{secrets.token_hex(3)}@{TESTER_DOMAIN}"
        u = _new_user(email, f"Internal tester {n}", None, "tester")
        data["users"].append(u)
        _write("users.json", data)
        return public(u)


def tester_ids() -> list[str]:
    return [u["id"] for u in _users()["users"] if u["role"] == "tester"]


def keep_tester(user_id: str, email: str, name: str, password: str | None, google: str | None = None) -> dict:
    """An Internal tester adds their own sign-in (email and password, or a Google account) so they can come back
    to their files from any browser. They stay a tester: early access still decides their AI."""
    with _lock:
        data = _edit()
        u = next((x for x in data["users"] if x["id"] == user_id), None)
        if u is None or u["role"] != "tester":
            raise AccountError("Only early-access accounts can do this.")
        if u.get("hash") or u.get("google"):  # changing it needs the current password (Account settings)
            raise AccountError("Your work is kept already. Change your sign-in in Account settings.")
        if google and any(x.get("google") == google and x["id"] != user_id for x in data["users"]):
            raise AccountError("That Google account already has an OpenSketch account. Your files stay with this one.")
        email, name = _check_new(email, name or u["name"], None if google else (password or ""), data, me=user_id)
        u["email"], u["name"] = email, name
        if google:
            u["google"], u["email_verified"] = google, True
        else:
            salt = secrets.token_bytes(16)
            u["salt"], u["hash"], u["email_verified"] = salt.hex(), _hash(password, salt), False
        _write("users.json", data)
        return public(u)


def remove_testers() -> list[str]:
    """Owner: remove every tester account (signed out at once; their files stay on the server)."""
    with _lock:
        data = _edit()
        gone = [u["id"] for u in data["users"] if u["role"] == "tester"]
        data["users"] = [u for u in data["users"] if u["role"] != "tester"]
        _write("users.json", data)
    for uid in gone:
        end_sessions(uid)
    return gone


def sign_up(email: str, name: str, password: str | None, google: str | None = None) -> dict:
    """A new member without an invite: only when the owner turned on open sign-up."""
    with _lock:
        data = _edit()
        if not data["users"]:
            raise AccountError("Create the owner account first.")
        if not data.get("settings", {}).get("open_signup"):
            raise AccountError("This server is invite-only. Ask the owner for an invite link.")
        email, name = _check_new(email, name, password, data)
        u = _new_user(email, name, password, "member", google)
        data["users"].append(u)
        _write("users.json", data)
        return public(u)


def google_user(sub: str, email: str, verified: bool, managed: bool = True) -> dict | None:
    """The account for a Google sign-in: already linked to this Google id, or (verified email) the account with
    that email, which gets linked. None when there is no such account. managed: the address is run by Google
    (Gmail, or a Workspace account in its own domain); other addresses can sit on a Google account someone else
    controls, so they never take over an account that has a password.

    An account made by typing this email (sign-up, invite, Keep my work) never proved it owns the address: whoever
    made it may not be the person Google just vouched for. So that person takes the account over: its password is
    cleared and every session, AI app and private AI address of it ends (they can set a new password)."""
    took = None
    with _lock:
        data = _edit()
        u = next((x for x in data["users"] if x.get("google") == sub), None)
        if u is None and verified:
            u = next((x for x in data["users"] if x["email"] == (email or "").strip().lower()), None)
            if u is not None and not managed and u.get("hash"):
                raise AccountError("There is already an account with this email. Sign in with its password.")
            if u is not None:
                if u.get("hash") and not u.get("email_verified") and u["role"] != "owner":
                    u["salt"], u["hash"] = secrets.token_bytes(16).hex(), ""
                    u["mcp_n"] = int(u.get("mcp_n", 0)) + 1
                    took = u["id"]
                u["google"], u["email_verified"] = sub, True
                _write("users.json", data)
    if took:
        end_sessions(took)
        _drop_apps(took)
    return public(u) if u else None
