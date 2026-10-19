"""Bring your own key: each person's AI provider, model and API key, kept on their account.

Stored in the data folder as `ai_keys.json` {user id: {provider, model, base_url, key (encrypted), hint, updated}}.
Keys are encrypted with Fernet (AES-128-CBC + HMAC) under a secret kept in `ai_keys.secret` (or
OPENSKETCH_KEY_SECRET); the browser only ever sees the provider, model and the last four characters.
Without an account (a private server with no sign-in) the settings belong to "local".

Which key a request uses: the person's own key; else the server's ANTHROPIC_API_KEY (the owner's, shared with
everyone signed in) unless OPENSKETCH_SHARE_SERVER_KEY=0; else the AI is off for them. Early-access testers use the
owner's AI only while the access code is on (turning it off stops their AI).

Only a custom provider takes an address of the person's choosing (checked public, and pinned when used); the named
providers always use their own address.
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
    base = spec.get("base_url") or ""  # a named provider's own address, whatever the browser sent
    if provider == "custom":
        try:
            base = providers.check_base_url((base_url or "").strip().rstrip("/"))
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
    if not rec or not rec.get("key") or rec.get("provider") not in providers.PROVIDERS:
        return None
    try:
        key = _fernet().decrypt(rec["key"].encode()).decode()
    except Exception:
        return None  # the secret changed: the person has to enter the key again
    base = (rec.get("base_url") or "") if rec["provider"] == "custom" else providers.PROVIDERS[rec["provider"]]["base_url"]
    return {"provider": rec["provider"], "model": rec["model"], "base_url": base, "key": key, "source": "yours"}


def early_access_config() -> dict | None:
    """The AI early-access testers use: the server's key, else the key the owner saved in OpenSketch. Testers never
    see it (no key, no hint, no provider settings of the owner's reach the browser); source "early_access"."""
    cfg = server_config()
    if cfg is None:
        try:
            from . import accounts
            owner = accounts.owner()
        except Exception:
            owner = None
        cfg = (config_for(owner["id"]) if owner else None) or config_for("local")
    return dict(cfg, source="early_access") if cfg else None


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
    """The person's own key, else the server's. With open sign-up on, strangers could sign up and spend the
    owner's key, so then only the owner and early-access testers use it (OPENSKETCH_SHARE_SERVER_KEY=all shares it
    anyway). Testers: only while the early-access code is on. None = no AI for this person (ai.run_stream then
    refuses; it never falls back to the server's key)."""
    own = config_for(owner_id(user))
    if own:
        return own
    if user and user.get("role") == "tester":
        from . import accounts
        if accounts.access_code() is None:
            return None  # the owner turned early access off: their AI stops (their files stay theirs)
        return early_access_config()  # early access (accounts.create_tester): the owner's AI, no limit
    cfg = server_config()
    if cfg and user and not user.get("legacy") and user.get("role") != "owner" and os.environ.get("OPENSKETCH_SHARE_SERVER_KEY") != "all":
        from . import accounts
        if accounts.settings()["open_signup"]:
            return None
    return cfg
