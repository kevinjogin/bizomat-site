"""Sign in with BIZOMAT: one BIZOMAT account for CAD Automation and the other BIZOMAT tools (owner's request,
13 Nov 2026).

BIZOMAT is the sign-in provider (OAuth 2.0 authorization code with PKCE S256; kevinjogin/bizomat-site,
apps/work/src/worker/company/id-provider.ts and docs/company/README.md, "BIZOMAT sign-in for CAD Automation"):

  1. /auth/bizomat sends the browser to <provider>/authorize with client_id, redirect_uri, state and code_challenge.
     The person signs in to BIZOMAT there if needed, sees which application asks, and continues or cancels.
  2. BIZOMAT sends the browser back to /auth/bizomat/callback with a one-time code (10 minutes) and the state.
  3. This server swaps the code at <provider>/api/id/token (HTTP Basic: client id and secret, with the code verifier)
     for an access token, and reads <provider>/api/id/userinfo: sub, email, email_verified, name, companies.

Off until the client secret is set: BIZOMAT_ID_CLIENT_SECRET (a Fly secret on cados), the same secret whose SHA-256
the BIZOMAT side lists in its setting BIZOMAT_ID_CLIENTS (Fly secret WORK_BIZOMAT_ID_CLIENTS on bizomat) for the
client "cad" with the return address https://bizomat.ai/cad/auth/bizomat/callback. BIZOMAT_ID_CLIENT_ID (default
"cad") and BIZOMAT_ID_URL (default <BIZOMAT_SITE_URL>/company, that is https://bizomat.ai/company) change the client
and the provider, for a test server.

The state is random and kept in a short-lived signed cookie (oauth.sign_state); the PKCE code verifier is derived
from the state with a key of this server (data_secret), so nothing secret is in the cookie and only this server can
finish its own sign-in. The code is swapped server to server over TLS, never in the browser.

Who gets in (accounts.bizomat_user, accept_invite, sign_up): the account already linked to this BIZOMAT account;
else the account with the same email, when BIZOMAT says the email is confirmed (then linked); else a new member when
the sign-in came from an invite link or the owner turned on open sign-up. An unconfirmed BIZOMAT email never links or
creates an account. Only the BIZOMAT account id is stored with the CAD Automation account; the companies are not kept.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import os
import re
import secrets
import time
from urllib.parse import urlencode

import httpx

STATE_COOKIE = "opensketch_bizomat"
STATE_TTL = 600
DEFAULT_CLIENT_ID = "cad"
_CLIENT_ID = re.compile(r"^[A-Za-z0-9._-]{1,100}$")


def provider() -> str:
    """The BIZOMAT sign-in address (no trailing slash): BIZOMAT_ID_URL, else the platform website's /company."""
    from . import brand
    v = (os.environ.get("BIZOMAT_ID_URL") or "").strip().rstrip("/")
    if v.startswith(("https://", "http://")) and " " not in v:
        return v
    return brand.site_url() + "/company"


def client() -> tuple[str, str] | None:
    """(client id, client secret), or None when BIZOMAT sign-in is off (no secret, or a malformed setting)."""
    secret = (os.environ.get("BIZOMAT_ID_CLIENT_SECRET") or "").strip()
    cid = (os.environ.get("BIZOMAT_ID_CLIENT_ID") or "").strip() or DEFAULT_CLIENT_ID
    if len(secret) < 32 or len(secret) > 500 or any(c.isspace() for c in secret) or not _CLIENT_ID.match(cid):
        return None
    return cid, secret


def enabled() -> bool:
    return client() is not None


def _b64(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def verifier_for(state: str) -> str:
    """The PKCE code verifier of one sign-in: 43 characters derived from its state with this server's key."""
    from . import auth
    return _b64(hmac.new(auth.data_secret("bizomat-pkce"), state.encode(), hashlib.sha256).digest())


def challenge(verifier: str) -> str:
    """S256: base64url(SHA-256(verifier)), as the provider checks it."""
    return _b64(hashlib.sha256(verifier.encode()).digest())


def start(redirect_uri: str, nxt: str = "/", invite: str = "") -> tuple[str, str]:
    """(URL to send the browser to, signed state cookie value)."""
    from . import oauth
    state = secrets.token_urlsafe(24)
    cookie = oauth.sign_state({"s": state, "n": nxt, "i": invite, "r": redirect_uri, "exp": int(time.time()) + STATE_TTL})
    url = provider() + "/authorize?" + urlencode({"client_id": client()[0], "redirect_uri": redirect_uri, "state": state,
                                                  "code_challenge": challenge(verifier_for(state)),
                                                  "code_challenge_method": "S256"})
    return url, cookie


async def exchange(code: str, redirect_uri: str, state: str) -> dict:
    """Code -> the BIZOMAT account {sub, email, email_verified, name}. Raises ValueError with a plain reason."""
    cid, secret = client() or ("", "")
    base = provider()
    async with httpx.AsyncClient(timeout=20) as http:
        r = await http.post(base + "/api/id/token", auth=(cid, secret),
                            data={"grant_type": "authorization_code", "code": code, "redirect_uri": redirect_uri,
                                  "code_verifier": verifier_for(state)})
        if r.status_code != 200:
            raise ValueError("BIZOMAT did not accept the sign-in. Try again.")
        token = (r.json() or {}).get("access_token")
        if not token:
            raise ValueError("BIZOMAT did not send a sign-in token. Try again.")
        u = await http.get(base + "/api/id/userinfo", headers={"Authorization": f"Bearer {token}"})
        if u.status_code != 200:
            raise ValueError("Could not read your BIZOMAT account. Try again.")
        info = u.json() or {}
    if not info.get("sub") or not info.get("email"):
        raise ValueError("Your BIZOMAT account did not share an email address.")
    return {"sub": str(info["sub"]), "email": str(info["email"]), "email_verified": info.get("email_verified") is True,
            "name": str(info.get("name") or "")}
