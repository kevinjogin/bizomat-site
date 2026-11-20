"""The company a request acts for, when CAD Automation runs inside BIZOMAT ERP (erplink.py; docs/ERP-MODULE.md).

Set for the length of one request: by the AI connector's gate from the connection's company (an AI connection is
bound to one company when the person approves it), and by the ERP's API from its signed assertion. While it is set,
computers, commands and exports are those of that company only (devicebridge.py, artifacts.py), new ones are recorded
under it, and its fair-use limits apply. Not set: CAD Automation works as before, by person.
"""

from __future__ import annotations

import contextvars
from contextlib import contextmanager

DEFAULT_LIMITS = {"concurrent": 5, "commandSeconds": 600, "uploadMb": 32, "storageMb": 128}

_current: contextvars.ContextVar = contextvars.ContextVar("opensketch_company", default=None)


def company() -> str | None:
    c = _current.get()
    return c["id"] if c else None


def limits() -> dict:
    c = _current.get()
    return dict(DEFAULT_LIMITS, **(c.get("limits") or {})) if c else dict(DEFAULT_LIMITS)


def set_company(company_id: str | None, limits_: dict | None = None):
    """Set for this context; returns the token for reset()."""
    return _current.set({"id": company_id, "limits": limits_ or {}} if company_id else None)


def reset(token) -> None:
    _current.reset(token)


@contextmanager
def use(company_id: str | None, limits_: dict | None = None):
    token = set_company(company_id, limits_)
    try:
        yield
    finally:
        reset(token)
