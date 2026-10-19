"""Tests run CAD work in the test process's own threads (OPENSKETCH_CAD_WORKERS=0), so monkeypatched functions
apply; tests/test_cadworker.py turns the worker processes on for itself."""
import os

os.environ.setdefault("OPENSKETCH_CAD_WORKERS", "0")
