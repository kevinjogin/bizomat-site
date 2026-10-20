"""Tests run CAD work in the test process's own threads (OPENSKETCH_CAD_WORKERS=0), so monkeypatched functions
apply; tests/test_cadworker.py turns the worker processes on for itself.

Tests never touch the developer's real data folder or follow their settings: OPENSKETCH_DATA points at a fresh
folder for the whole run (tests that need their own still set it with monkeypatch), and the variables that change
what the server does (a password, an access code, Google sign-in, timeouts...) are cleared, so a server password
set in the developer's shell cannot make API tests fail with 401."""
import atexit
import os
import shutil
import tempfile

os.environ.setdefault("OPENSKETCH_CAD_WORKERS", "0")

_DATA = tempfile.mkdtemp(prefix="opensketch-tests-")
atexit.register(shutil.rmtree, _DATA, ignore_errors=True)
os.environ["OPENSKETCH_DATA"] = _DATA

for _name in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "OPENSKETCH_ACCESS_CODE", "OPENSKETCH_PUBLIC_URL",
              "OPENSKETCH_KEY_SECRET", "OPENSKETCH_CAD_LIMIT", "OPENSKETCH_CAD_LANES", "OPENSKETCH_HANG_SECONDS",
              "OPENSKETCH_BOOT_SECONDS", "OPENSKETCH_SW_ZIP", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"):
    os.environ.pop(_name, None)
