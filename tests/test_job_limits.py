"""Heavy jobs are rationed so a few people at once cannot run the 2 GB, one-core server out of memory (owner's
decision 2026-10-19): one AI chat per person, OPENSKETCH_AI_JOBS (2) on the server with a short queue, then a plain
"busy" answer the chat shows; one SOLIDWORKS macro export and one feature recognition at a time on the server."""
import json
import threading
import time

import httpx
import pytest
from fastapi.testclient import TestClient

from opensketch import cadjobs, cadworker, recognize, server


def _slow_chat(doc, prompt, conv_id, history, demo, selection, ai_config, progress=None, stop=None, lost=False):
    """Stands in for the AI: says it started, then works until told to stop (or 20 s)."""
    progress(json.dumps({"ev": "start", "conversation": "c-" + prompt, "resumed": not lost}) + "\n")
    end = time.monotonic() + (0.2 if prompt.startswith("quick") else 20)
    while time.monotonic() < end and not (stop and stop()):
        time.sleep(0.05)
    progress(json.dumps({"ev": "done", "conversation": "c-" + prompt, "reply": "ok"}) + "\n")
    return {"conversation": None, "history": None}


@pytest.fixture
def chats(monkeypatch, tmp_path):
    """A real server (the test client would hold each stream back until it ends) with a chat stand-in."""
    import socket
    import uvicorn
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.setenv("OPENSKETCH_AI_DEMO", "1")
    monkeypatch.setattr(cadjobs, "ai_stream", _slow_chat)
    monkeypatch.setattr(server, "_who", lambda request: request.headers.get("x-who", ""))
    slots = cadworker.Slots("ai", 1, per_person=1, queue=1, wait=3.0, busy="AI busy.", mine="Still answering you.")
    monkeypatch.setattr(cadworker, "AI_JOBS", slots)
    with socket.socket() as sk:
        sk.bind(("127.0.0.1", 0))
        port = sk.getsockname()[1]
    srv = uvicorn.Server(uvicorn.Config(server.app, host="127.0.0.1", port=port, log_level="error"))
    th = threading.Thread(target=srv.run, daemon=True)
    th.start()
    base = f"http://127.0.0.1:{port}"
    for _ in range(100):
        try:
            httpx.get(base + "/api/version", timeout=1)
            break
        except httpx.HTTPError:
            time.sleep(0.05)
    yield base, slots
    srv.should_exit = True
    th.join(5)


def _post(base, who, prompt, **body):
    return httpx.post(base + "/api/ai/stream", json={"doc": {"features": []}, "prompt": prompt, **body},
                      headers={"x-who": who}, timeout=30)


def _open(base, who, prompt, out):
    """A chat in a thread: its lines go into out as they come."""
    def run():
        with httpx.stream("POST", base + "/api/ai/stream", json={"doc": {"features": []}, "prompt": prompt},
                          headers={"x-who": who}, timeout=30) as r:
            out.append(r.status_code)
            for line in r.iter_lines():
                if line.strip():
                    out.append(json.loads(line))
                    if out[-1].get("ev") == "start" and prompt.startswith("stop"):
                        return  # the person leaves the page (Stop): the stream is closed
    t = threading.Thread(target=run, daemon=True)
    t.start()
    return t


def _until(cond, timeout=10):
    end = time.monotonic() + timeout
    while time.monotonic() < end and not cond():
        time.sleep(0.05)
    return cond()


def _started(out):
    return any(isinstance(e, dict) and e.get("ev") == "start" for e in out)


def test_one_chat_per_person_and_a_plain_answer_for_the_second(chats):
    base, slots = chats
    first = []
    _open(base, "ann", "stop-first", first).join(10)
    assert _started(first)
    # Ann pressed Stop: her old chat is ending, so her next message waits for it instead of being refused
    second = []
    _open(base, "ann", "quick-second", second).join(15)
    assert second[0] == 200 and second[-1]["ev"] == "done", second
    # while one of her chats is still running and wanted, another one is refused at once with a plain reason
    third = []
    _open(base, "ann", "long-third", third)
    assert _until(lambda: _started(third))
    r = _post(base, "ann", "again")
    assert r.status_code == 429 and r.json()["error"] == "Still answering you."


def test_the_server_runs_a_few_chats_then_queues_then_says_busy(chats):
    base, slots = chats
    a = []
    _open(base, "ann", "long-a", a)
    assert _until(lambda: _started(a))
    b = []
    tb = _open(base, "bob", "quick-b", b)  # the one queue place: waits (3 s) for Ann's chat, then says busy
    assert _until(lambda: len(slots._waiting) == 1)
    r = _post(base, "cy", "x")
    assert r.status_code == 503 and r.json()["error"] == "AI busy."  # the queue is full
    tb.join(10)
    assert b[0] == 200 and b[-1] == {"ev": "error", "message": "AI busy."}, b
    assert len(slots.running()) == 1


def test_a_chat_without_any_ai_starts_no_job(chats, monkeypatch):
    base, slots = chats
    monkeypatch.delenv("OPENSKETCH_AI_DEMO")
    from opensketch import aikeys
    monkeypatch.setattr(aikeys, "effective", lambda user: None)
    started = []
    monkeypatch.setattr(cadworker, "start_job", lambda *a, **k: started.append(1))
    r = _post(base, "ann", "x")
    assert [json.loads(x) for x in r.text.splitlines()] == [{"ev": "error", "message": server.ai.NO_KEY}]
    assert not started
    long = _post(base, "ann", "x" * (server.AI_PROMPT_MAX + 1))
    assert long.status_code == 413 and "too long" in long.json()["error"]


def test_a_forgotten_conversation_is_said_so(chats):
    base, _ = chats
    r = _post(base, "ann", "quick", conversation="gone-after-restart")
    first = json.loads(r.text.splitlines()[0])
    assert first["ev"] == "start" and first["resumed"] is False


def test_one_macro_export_at_a_time_on_the_server(monkeypatch, tmp_path):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.setattr(server, "_who", lambda request: request.headers.get("x-who", ""))
    monkeypatch.setattr(cadworker, "MACRO_JOBS", cadworker.Slots("macro", 1, queue=0, busy="Another export.", mine="Yours."))
    release = threading.Event()
    monkeypatch.setattr(server.sldexport, "export", lambda *a, **k: release.wait(20) or {})
    c = TestClient(server.app)
    doc = {"version": 1, "name": "B", "units": "mm", "features": []}
    jid = c.post("/api/export/sldmacro/start", json={"doc": doc}, headers={"x-who": "ann"}).json()["job"]
    r = c.post("/api/export/sldmacro/start", json={"doc": doc}, headers={"x-who": "bob"})
    assert r.status_code == 503 and r.json()["error"] == "Another export."
    assert c.post("/api/export/sldmacro/start", json={"doc": doc}, headers={"x-who": "ann"}).status_code == 429
    assert c.delete(f"/api/export/sldmacro/{jid}", headers={"x-who": "bob"}).status_code == 404  # not his
    assert c.delete(f"/api/export/sldmacro/{jid}", headers={"x-who": "ann"}).json()["state"] == "cancelled"
    release.set()
    assert _until(lambda: not cadworker.MACRO_JOBS.running())
    assert c.post("/api/export/sldmacro/start", json={"doc": doc}, headers={"x-who": "bob"}).status_code == 200
    release.set()


def test_recognition_takes_a_place_shared_by_every_process(monkeypatch, tmp_path):
    """Parts are recognised one at a time on the whole server, whoever asked: the button, Claude or the AI chat,
    each from its own process (a lock file per place)."""
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    order = []
    inside = threading.Event()
    leave = threading.Event()

    def first():
        with cadworker.proc_slot("recognize", 1) as got:
            order.append(("a", got))
            inside.set()
            leave.wait(10)

    t = threading.Thread(target=first)
    t.start()
    assert inside.wait(5)
    waited = []
    stop = threading.Event()
    threading.Timer(0.6, stop.set).start()
    with cadworker.proc_slot("recognize", 1, stop=stop.is_set, poll=0.05, on_wait=lambda: waited.append(1)) as got:
        assert got is False and waited == [1]  # it waited, then was stopped while waiting
    leave.set()
    t.join(5)
    with cadworker.proc_slot("recognize", 1) as got:
        assert got is True and order == [("a", True)]
    # a recognition stopped while it waits for its place ends at once, without starting a worker
    holder = threading.Thread(target=first)
    inside.clear()
    leave.clear()
    holder.start()
    assert inside.wait(5)
    part = {"features": [{"id": "i1", "type": "import", "data": "x"}]}
    r = recognize.recognize_part_safe(part, stop=lambda: True)
    leave.set()
    holder.join(5)
    assert r["ok"] is False and r["report"]["message"] == "Stopped."


def test_a_failed_macro_export_leaves_no_work_folder(monkeypatch, tmp_path):
    from pathlib import Path
    from opensketch import geometry, sldexport
    from tests.test_review_regressions import broken_part
    made = []
    real = sldexport.tempfile.mkdtemp
    monkeypatch.setattr(sldexport.tempfile, "mkdtemp", lambda **k: made.append(real(dir=tmp_path, **k)) or made[-1])
    monkeypatch.delenv("OSK_KEEP_WORK", raising=False)
    with pytest.raises(geometry.FeatureError):
        sldexport.export(broken_part(), str(tmp_path / "bad.zip"), force_step=True)
    assert made and not Path(made[0]).exists()


def test_a_page_that_lost_its_recognition_job_follows_it_again(monkeypatch, tmp_path):
    """Recognize again while this person's job for the same model still runs: the same job, to follow; another
    model: a plain refusal (never the other model's result)."""
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    release = threading.Event()

    def slow(doc, part_id=None, kinds=None, progress=None, stop=None, on_wait=None):
        release.wait(20)
        return {"doc": doc, "parts": {}, "changed": []}
    monkeypatch.setattr(recognize, "recognize_doc", slow)
    c = TestClient(server.app)
    a = {"features": [{"id": "i1", "type": "import", "data": "a"}]}
    b = {"features": [{"id": "i1", "type": "import", "data": "b"}]}
    first = c.post("/api/recognize/start", json={"doc": a}).json()
    again = c.post("/api/recognize/start", json={"doc": a}).json()
    assert again == {"job": first["job"], "resumed": True}
    other = c.post("/api/recognize/start", json={"doc": b})
    assert other.status_code == 429 and "another model" in other.json()["error"]
    release.set()
    assert _until(lambda: c.get(f"/api/recognize/{first['job']}").json()["state"] == "done")
