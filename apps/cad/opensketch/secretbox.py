"""Encryption for the few secrets the server stores (the Google sign-in client secret, oauth.py): Fernet with a key
from OPENSKETCH_KEY_SECRET, else a random key kept in the data folder."""

from __future__ import annotations

import base64
import hashlib
import os
import secrets


def fernet():
    from cryptography.fernet import Fernet
    from . import store
    env = os.environ.get("OPENSKETCH_KEY_SECRET", "")
    if env:
        raw = hashlib.sha256(env.encode()).digest()
    else:
        p = store.data_dir() / "ai_keys.secret"  # the name servers already have
        if not p.exists():
            p.write_text(secrets.token_hex(32))
            p.chmod(0o600)
        raw = hashlib.sha256(p.read_text().strip().encode()).digest()
    return Fernet(base64.urlsafe_b64encode(raw))
