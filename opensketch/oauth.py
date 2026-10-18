"""Sign in with Google (OpenID Connect, authorization code flow).

Turned on by GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (a "Web application" OAuth client in Google Cloud,
with https://<your address>/auth/google/callback as an authorized redirect URI). The browser is sent to
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


def enabled() -> bool:
    return bool(os.environ.get("GOOGLE_CLIENT_ID") and os.environ.get("GOOGLE_CLIENT_SECRET"))


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
    url = AUTH_URL + "?" + urlencode({"client_id": os.environ["GOOGLE_CLIENT_ID"], "redirect_uri": redirect_uri,
                                      "response_type": "code", "scope": "openid email profile", "state": state,
                                      "prompt": "select_account"})
    return url, cookie


async def exchange(code: str, redirect_uri: str) -> dict:
    """Code -> Google's userinfo {sub, email, email_verified, name}. Raises ValueError with a plain reason."""
    async with httpx.AsyncClient(timeout=20) as http:
        r = await http.post(TOKEN_URL, data={"code": code, "client_id": os.environ["GOOGLE_CLIENT_ID"],
                                             "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
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
