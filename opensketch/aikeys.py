"""Bring your own key: each person's AI provider, model and API key, kept on their account.

Stored in the data folder as `ai_keys.json` {user id: {provider, model, base_url, key (encrypted), hint, updated}}.
Keys are encrypted with Fernet (AES-128-CBC + HMAC) under a secret kept in `ai_keys.secret` (or
OPENSKETCH_KEY_SECRET); the browser only ever sees the provider, model and the last four characters.
Without an account (a private server with no sign-in) the settings belong to "local".

Which key a request uses: the person's own key; else the server's ANTHROPIC_API_KEY (the owner's, shared with
everyone signed in) unless OPENSKETCH_SHARE_SERVER_KEY=0; else the AI is off for them.
"""

from __future__ import annotations

import json
import os
import secrets
import threading
import time

from . import providers

_lock = threading.RLock()


class KeyError_(Exception):
    """A plain-language reason the settings were refused."""


def _dir():
    from . import store
    return store.data_dir()


def _fernet():
    from cryptography.fernet import Fernet
    import base64
    import hashlib
    env = os.environ.get("OPENSKETCH_KEY_SECRET", "")
    if env:
        raw = hashlib.sha256(env.encode()).digest()
    else:
        p = _dir() / "ai_keys.secret"
        if not p.exists():
            p.write_text(secrets.token_hex(32))
            p.chmod(0o600)
        raw = hashlib.sha256(p.read_text().strip().encode()).digest()
    return Fernet(base64.urlsafe_b64encode(raw))


def _read() -> dict:
    try:
        return json.loads((_dir() / "ai_keys.json").read_text())
    except (FileNotFoundError, ValueError):
        return {}


def _write(d: dict) -> None:
    p = _dir() / "ai_keys.json"
    tmp = p.with_suffix(".tmp")
    tmp.write_text(json.dumps(d, indent=1))
    os.chmod(tmp, 0o600)
    tmp.replace(p)


def owner_id(user: dict | None) -> str:
    return user["id"] if user and not user.get("legacy") else "local"


def public(user_id: str) -> dict | None:
    """What the browser may see: never the key."""
    rec = _read().get(user_id)
    if not rec:
        return None
    return {k: rec.get(k) for k in ("provider", "model", "base_url", "hint", "updated")}


def save(user_id: str, provider: str, model: str, key: str | None, base_url: str | None = None) -> dict:
    """Set the provider and model; a new key replaces the stored one (None keeps it)."""
    spec = providers.PROVIDERS.get(provider)
    if spec is None:
        raise KeyError_("Choose a provider.")
    model = (model or "").strip()
    if not model:
        raise KeyError_("Enter a model name.")
    base = (base_url or "").strip().rstrip("/") or spec.get("base_url") or ""
    if provider == "custom":
        try:
            base = providers.check_base_url(base)
        except providers.ProviderError as e:
            raise KeyError_(str(e)) from None
    with _lock:
        d = _read()
        rec = d.get(user_id) or {}
        if key:
            key = key.strip()
            if len(key) < 8 or any(c.isspace() for c in key):
                raise KeyError_("That does not look like an API key.")
            rec["key"] = _fernet().encrypt(key.encode()).decode()
            rec["hint"] = "..." + key[-4:]
        elif rec.get("provider") != provider:
            raise KeyError_("Paste the API key for this provider.")
        if not rec.get("key"):
            raise KeyError_("Paste your API key.")
        rec.update(provider=provider, model=model, base_url=base if provider != "anthropic" else "", updated=int(time.time()))
        d[user_id] = rec
        _write(d)
    return public(user_id)


def remove(user_id: str) -> None:
    with _lock:
        d = _read()
        if d.pop(user_id, None) is not None:
            _write(d)


def config_for(user_id: str) -> dict | None:
    """The full settings, key decrypted, for a request on the server. None when the person has none."""
    rec = _read().get(user_id)
    if not rec or not rec.get("key"):
        return None
    try:
        key = _fernet().decrypt(rec["key"].encode()).decode()
    except Exception:
        return None  # the secret changed: the person has to enter the key again
    return {"provider": rec["provider"], "model": rec["model"], "base_url": rec.get("base_url") or "", "key": key, "source": "yours"}


def server_config() -> dict | None:
    """The server's own key (ANTHROPIC_API_KEY), shared with signed-in people unless turned off."""
    if os.environ.get("OPENSKETCH_SHARE_SERVER_KEY", "1") == "0":
        return None
    key = os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN")
    if not key:
        return None
    return {"provider": "anthropic", "model": os.environ.get("OPENSKETCH_AI_MODEL", providers.DEFAULT_ANTHROPIC_MODEL),
            "base_url": "", "key": None, "source": "server"}


def effective(user: dict | None) -> dict | None:
    return config_for(owner_id(user)) or server_config()
