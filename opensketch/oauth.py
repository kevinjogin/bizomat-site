"""Sign in with Google (OpenID Connect, authorization code flow).

Turned on by a "Web application" OAuth client in Google Cloud (with https://<your address>/auth/google/callback
as an authorized redirect URI): either GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET on the server, or pasted by the owner
in the app (avatar > Sign in with Google), kept in `google_oauth.json` in the data folder with the secret encrypted
like the AI keys. The server's environment wins when both are set. The browser is sent to
Google with a random `state` that is also kept in a short-lived signed cookie; Google sends it back with a
code; the server swaps the code for tokens directly with Google (over TLS, with the client secret) and reads
the person's verified email from Google's userinfo endpoint.

Who gets in (accounts.google_user / accept_invite / sign_up): an account already linked to this Google id;
else the account with the same verified email (then linked); else a new member when the sign-in came from an
invite link, or the owner turned on open sign-up. Anyone else is told to ask for an invite.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import time
from urllib.parse import urlencode

import httpx

AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"
STATE_COOKIE = "opensketch_oauth"
STATE_TTL = 600


CLIENT_SUFFIX = ".apps.googleusercontent.com"


class SetupError(Exception):
    """A plain-language reason the Google settings were refused."""


def _file():
    from . import store
    return store.data_dir() / "google_oauth.json"


def _saved() -> dict:
    try:
        d = json.loads(_file().read_text())
        return d if isinstance(d, dict) else {}
    except (FileNotFoundError, ValueError):
        return {}


def client() -> tuple[str, str, str] | None:
    """(client id, client secret, where it came from: "server" or "app"), or None when Google sign-in is off."""
    cid, sec = os.environ.get("GOOGLE_CLIENT_ID", ""), os.environ.get("GOOGLE_CLIENT_SECRET", "")
    if cid and sec:
        return cid, sec, "server"
    d = _saved()
    if not d.get("client_id") or not d.get("secret"):
        return None
    from . import aikeys
    try:
        sec = aikeys._fernet().decrypt(d["secret"].encode()).decode()
    except Exception:
        return None  # the key secret changed: the owner pastes the client secret again
    return d["client_id"], sec, "app"


def enabled() -> bool:
    return client() is not None


def public(redirect_uri: str) -> dict:
    """What the owner's settings dialog shows (never the secret)."""
    c = client()
    d = _saved()
    return {"enabled": c is not None, "source": c[2] if c else None, "client_id": c[0] if c else "",
            "redirect_uri": redirect_uri, "updated": d.get("updated") if c and c[2] == "app" else None}


def check_client(client_id: str, secret: str, redirect_uri: str) -> str | None:
    """Ask Google whether it knows this client: a made-up code is refused as invalid_grant when the client is
    right, invalid_client when it is not. Returns a plain reason when Google says no, None when it looks right
    (or Google could not be reached: then it is saved unchecked)."""
    try:
        r = httpx.post(TOKEN_URL, timeout=15, data={"code": "opensketch-check", "client_id": client_id, "client_secret": secret,
                                                    "redirect_uri": redirect_uri, "grant_type": "authorization_code"})
        err = (r.json() or {}).get("error", "") if r.headers.get("content-type", "").startswith("application/json") else ""
    except Exception:
        return None
    if err in ("invalid_client", "unauthorized_client"):
        return "Google does not accept this Client ID and Client secret. Copy both again from the client's page."
    return None


def save(client_id: str, secret: str, redirect_uri: str, check: bool = True) -> None:
    client_id, secret = (client_id or "").strip(), (secret or "").strip()
    if not client_id.endswith(CLIENT_SUFFIX) or len(client_id) > 200 or any(c.isspace() for c in client_id):
        raise SetupError(f"The Client ID ends with {CLIENT_SUFFIX}. Copy it from the client's page in Google Cloud.")
    if len(secret) < 10 or len(secret) > 200 or any(c.isspace() for c in secret):
        raise SetupError("Paste the Client secret too (it usually starts with GOCSPX-).")
    if check:
        why = check_client(client_id, secret, redirect_uri)
        if why:
            raise SetupError(why)
    from . import aikeys
    data = {"client_id": client_id, "secret": aikeys._fernet().encrypt(secret.encode()).decode(), "updated": int(time.time())}
    p = _file()
    tmp = p.with_name(f".{p.name}.{secrets.token_hex(4)}")
    tmp.write_text(json.dumps(data))
    os.chmod(tmp, 0o600)
    tmp.replace(p)


def remove() -> None:
    _file().unlink(missing_ok=True)


def _key() -> bytes:
    from . import auth
    return auth.data_secret("oauth-state")


def sign_state(payload: dict) -> str:
    raw = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    mac = hmac.new(_key(), raw.encode(), hashlib.sha256).hexdigest()[:32]
    return f"{raw}.{mac}"


def read_state(cookie: str) -> dict | None:
    try:
        raw, mac = cookie.rsplit(".", 1)
    except ValueError:
        return None
    if not hmac.compare_digest(str(mac).encode(), hmac.new(_key(), raw.encode(), hashlib.sha256).hexdigest()[:32].encode()):
        return None
    try:
        data = json.loads(base64.urlsafe_b64decode(raw + "=" * (-len(raw) % 4)))
    except ValueError:
        return None
    return data if isinstance(data, dict) and data.get("exp", 0) > time.time() else None


def start(redirect_uri: str, nxt: str = "/", invite: str = "") -> tuple[str, str]:
    """(URL to send the browser to, signed state cookie value)."""
    state = secrets.token_urlsafe(24)
    cookie = sign_state({"s": state, "n": nxt, "i": invite, "r": redirect_uri, "exp": int(time.time()) + STATE_TTL})
    url = AUTH_URL + "?" + urlencode({"client_id": client()[0], "redirect_uri": redirect_uri,
                                      "response_type": "code", "scope": "openid email profile", "state": state,
                                      "prompt": "select_account"})
    return url, cookie


async def exchange(code: str, redirect_uri: str) -> dict:
    """Code -> Google's userinfo {sub, email, email_verified, name}. Raises ValueError with a plain reason."""
    cid, sec, _ = client() or ("", "", "")
    async with httpx.AsyncClient(timeout=20) as http:
        r = await http.post(TOKEN_URL, data={"code": code, "client_id": cid, "client_secret": sec,
                                             "redirect_uri": redirect_uri, "grant_type": "authorization_code"})
        if r.status_code != 200:
            raise ValueError("Google did not accept the sign-in. Try again.")
        token = r.json().get("access_token")
        if not token:
            raise ValueError("Google did not send a sign-in token. Try again.")
        u = await http.get(USERINFO_URL, headers={"Authorization": f"Bearer {token}"})
        if u.status_code != 200:
            raise ValueError("Could not read your Google account. Try again.")
        info = u.json()
    if not info.get("sub") or not info.get("email"):
        raise ValueError("Your Google account did not share an email address.")
    return info
