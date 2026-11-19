"""Malware scanning of BIZOMAT ERP's verification documents (opensketch/evidencescan.py): off without the BIZOMAT
client secret or ClamAV; HTTP Basic with the client cad; one document at a time and only with memory free; the
document checked against its SHA-256, scanned in a private folder and deleted; clean, infected and error verdicts;
signatures fetched without freshclam's test load; failures back off and never stop the thread. A last test runs the
real ClamAV on the EICAR test file when ClamAV and its signatures are installed."""
import base64
import hashlib
import json
import os
import shutil
import stat
import sys
import textwrap
from pathlib import Path
from urllib.parse import unquote

import httpx
import pytest

from opensketch import evidencescan as es

SECRET = "e" * 24 + "f" * 24
REAL_CLIENT = httpx.Client  # es.httpx is the httpx module itself: patches below replace its Client
EICAR = rb"X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"


def _script(path: Path, body: str) -> str:
    path.write_text(f"#!{sys.executable}\n" + textwrap.dedent(body))
    path.chmod(path.stat().st_mode | stat.S_IXUSR)
    return str(path)


@pytest.fixture
def clam(tmp_path, monkeypatch):
    """Stand-in clamscan and freshclam: freshclam writes the two signature files; clamscan finds the EICAR text,
    fails on BROKEN, and records each file it was given (and whether it still existed afterwards is checked)."""
    db = tmp_path / "sigs"
    seen = tmp_path / "seen.txt"
    fresh = _script(tmp_path / "freshclam", f"""
        import sys, pathlib, re
        conf = next(a.split('=', 1)[1] for a in sys.argv if a.startswith('--config-file='))
        text = pathlib.Path(conf).read_text()
        assert 'TestDatabases no' in text, 'freshclam must not test-load the signatures'
        d = pathlib.Path(re.search(r'DatabaseDirectory (.+)', text).group(1).strip())
        (d / 'main.cvd').write_text('main'); (d / 'daily.cvd').write_text('daily')
        pathlib.Path({str(tmp_path / 'updates.txt')!r}).open('a').write('1\\n')
    """)
    scan = _script(tmp_path / "clamscan", f"""
        import sys, pathlib
        if '--version' in sys.argv:
            print('ClamAV 1.5.4/28188/Thu Nov 19 2026'); sys.exit(0)
        f = pathlib.Path(sys.argv[-1])
        pathlib.Path({str(seen)!r}).open('a').write(str(f) + '\\n')
        data = f.read_bytes()
        if b'EICAR-STANDARD' in data:
            print(f'{{f}}: Eicar-Test-Signature FOUND'); sys.exit(1)
        if b'BROKEN' in data:
            sys.exit(2)
        print(f'{{f}}: OK'); sys.exit(0)
    """)
    monkeypatch.setenv("OPENSKETCH_CLAMSCAN", scan)
    monkeypatch.setenv("OPENSKETCH_FRESHCLAM", fresh)
    monkeypatch.setenv("OPENSKETCH_CLAMAV_DB", str(db))
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    monkeypatch.setenv("BIZOMAT_ID_URL", "https://erp.example.test/company")
    monkeypatch.delenv("OPENSKETCH_EVIDENCE_SCAN", raising=False)
    monkeypatch.setattr(es, "free_mb", lambda: 1800)
    return {"db": db, "seen": seen, "updates": tmp_path / "updates.txt"}


class StandInErp:
    """The ERP's two endpoints (bizomat-site apps/work/src/worker/company/scan.ts): a queue of documents and the
    verdicts received, with its client check."""

    def __init__(self, docs: list[tuple[str, bytes]], sha_override: str | None = None):
        self.docs = list(docs)
        self.results: list[dict] = []
        self.auth: list[str] = []
        self.sha_override = sha_override

    def handler(self, req: httpx.Request) -> httpx.Response:
        self.auth.append(req.headers.get("Authorization", ""))
        cid, sec = (unquote(x) for x in base64.b64decode(req.headers["Authorization"][6:]).decode().split(":"))
        if (cid, sec) != ("cad", SECRET):
            return httpx.Response(401, json={"error": "invalid_client"})
        if req.url.path == "/company/api/id/scan/next":
            if not self.docs:
                return httpx.Response(204)
            doc_id, body = self.docs.pop(0)
            sha = self.sha_override or hashlib.sha256(body).hexdigest()
            return httpx.Response(200, content=body, headers={"X-Scan-Id": doc_id, "X-Scan-Sha256": sha, "Content-Type": "application/octet-stream"})
        if req.url.path == "/company/api/id/scan/result":
            self.results.append(json.loads(req.content))
            return httpx.Response(200, json={"ok": True})
        return httpx.Response(404)


@pytest.fixture
def erp(monkeypatch):
    holder = {}

    def make(docs, **kw):
        holder["erp"] = StandInErp(docs, **kw)
        monkeypatch.setattr(es.httpx, "Client", lambda **k: REAL_CLIENT(transport=httpx.MockTransport(holder["erp"].handler), **k))
        return holder["erp"]
    return make


def test_off_without_secret_or_clamav(clam, monkeypatch):
    assert es.enabled()
    monkeypatch.setenv("OPENSKETCH_EVIDENCE_SCAN", "0")
    assert not es.enabled()
    monkeypatch.delenv("OPENSKETCH_EVIDENCE_SCAN")
    monkeypatch.setenv("OPENSKETCH_CLAMSCAN", "")
    monkeypatch.setattr(es.shutil, "which", lambda name: None)
    assert not es.enabled()
    monkeypatch.setenv("OPENSKETCH_CLAMSCAN", "/bin/true")
    monkeypatch.delenv("BIZOMAT_ID_CLIENT_SECRET")
    assert not es.enabled() and es.start() is None


def test_clean_infected_and_error_verdicts_one_at_a_time(clam, erp):
    pdf = b"%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n"
    stand = erp([("doc_clean_0001", pdf), ("doc_virus_0002", b"%PDF-1.4 " + EICAR), ("doc_broke_0003", b"BROKEN")])
    s = es.Scanner()
    assert s.step() == es.NEXT_SOON  # the first document fetches the signatures, without their test load
    assert es.signatures_ready() and clam["updates"].read_text().count("1") == 1
    assert s.step() == es.NEXT_SOON
    assert s.step() == es.NEXT_SOON
    assert s.step() == es.POLL  # nothing waiting
    got = {r["id"]: r for r in stand.results}
    assert got["doc_clean_0001"]["verdict"] == "clean" and got["doc_clean_0001"]["signature"] == ""
    assert got["doc_virus_0002"] == {**got["doc_virus_0002"], "verdict": "infected", "signature": "Eicar-Test-Signature"}
    assert got["doc_broke_0003"]["verdict"] == "error"
    assert all(r["engine"] == "ClamAV" and r["database"].startswith("ClamAV 1.5.4/28188") for r in stand.results)
    assert all(r["sha256"] == hashlib.sha256(b).hexdigest() for r, b in zip(stand.results, [pdf, b"%PDF-1.4 " + EICAR, b"BROKEN"]))
    assert s.scans == 3 and s.infected == 1
    # every request carried the client cad's credentials
    assert all(a.startswith("Basic ") for a in stand.auth)
    # each document was written to its own private folder and is gone
    files = clam["seen"].read_text().split()
    assert len(files) == 3 and len(set(Path(f).parent for f in files)) == 3
    assert not any(Path(f).exists() or Path(f).parent.exists() for f in files)


def test_a_document_that_does_not_match_its_sha256_is_never_scanned(clam, erp):
    stand = erp([("doc_wrong_0001", b"%PDF-1.4 hello")], sha_override="0" * 64)
    es.Scanner().step()
    assert stand.results[0]["verdict"] == "error" and "SHA-256" in stand.results[0]["signature"]
    assert not clam["seen"].exists()


def test_waits_while_memory_is_short_and_asks_nothing(clam, erp, monkeypatch):
    stand = erp([("doc_clean_0001", b"%PDF-1.4")])
    monkeypatch.setattr(es, "free_mb", lambda: 900)
    assert es.Scanner().step() == es.LOW_MEMORY_WAIT
    monkeypatch.setattr(es, "free_mb", lambda: None)  # unknown: never scan
    assert es.Scanner().step() == es.LOW_MEMORY_WAIT
    assert stand.auth == [] and stand.results == []
    monkeypatch.setenv("OPENSKETCH_SCAN_MIN_FREE_MB", "800")
    monkeypatch.setattr(es, "free_mb", lambda: 900)
    assert es.Scanner().step() == es.NEXT_SOON and stand.results[0]["verdict"] == "clean"


def test_failures_back_off_and_a_wrong_secret_is_refused(clam, erp, monkeypatch):
    erp([("doc_clean_0001", b"%PDF-1.4")])
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", "x" * 48)
    s = es.Scanner()
    waits = [s.step(), s.step(), s.step()]
    assert waits == [es.BACKOFF_FIRST, 2 * es.BACKOFF_FIRST, 4 * es.BACKOFF_FIRST]
    assert "401" in s.last_error["message"]

    def down(req):
        raise httpx.ConnectError("down")
    monkeypatch.setattr(es.httpx, "Client", lambda **k: REAL_CLIENT(transport=httpx.MockTransport(down), **k))
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    s2 = es.Scanner()
    assert s2.step() == es.BACKOFF_FIRST and "could not be reached" in s2.last_error["message"]


def test_the_thread_starts_and_stops_with_the_server(clam, erp, monkeypatch):
    erp([])
    monkeypatch.setattr(es.Scanner, "_run", lambda self: self._stop.wait(30))
    s = es.start()
    try:
        assert s is not None and s.alive() and es.status()["running"]
        assert es.start() is s  # one per process
    finally:
        es.stop()
    assert not s.alive() and es.status() == {"on": True, "running": False}


@pytest.mark.slow
@pytest.mark.skipif(not shutil.which("clamscan") or not (Path("/var/lib/clamav/main.cvd").exists() or Path("/var/lib/clamav/main.cld").exists()),
                    reason="ClamAV and its signatures are not installed here")
def test_real_clamav_finds_eicar_and_passes_a_plain_pdf(monkeypatch):
    monkeypatch.delenv("OPENSKETCH_CLAMSCAN", raising=False)
    monkeypatch.setenv("OPENSKETCH_CLAMAV_DB", "/var/lib/clamav")
    bad = es.scan_bytes("doc_eicar_0001", hashlib.sha256(EICAR).hexdigest(), EICAR)
    assert bad["verdict"] == "infected" and "Eicar" in bad["signature"]
    pdf = b"%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n"
    assert es.scan_bytes("doc_plain_0002", hashlib.sha256(pdf).hexdigest(), pdf)["verdict"] == "clean"


def test_no_signatures_are_fetched_while_the_erp_hands_out_nothing(clam, erp):
    erp([])
    s = es.Scanner()
    assert s.step() == es.POLL and s.step() == es.POLL
    assert not es.signatures_ready() and not clam["updates"].exists()


def test_the_privacy_notice_says_documents_are_scanned_here_and_deleted():
    from fastapi.testclient import TestClient
    from opensketch import server
    page = TestClient(server.app).get("/privacy").text
    assert "Amsterdam, the Netherlands" in page and "malware with ClamAV" in page and "deletes the document straight away" in page
