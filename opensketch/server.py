"""FastAPI server: serves the SOLIDWORKS-style web UI, the build123d regen API for parts and
assemblies, the streaming AI endpoint, documents stored on the server (shared with Claude through the
MCP endpoint at /mcp/<token>), and sign-in (accounts, see auth.py)."""

from __future__ import annotations

import json
import math
import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from starlette.background import BackgroundTask
from starlette.middleware.gzip import GZipMiddleware
from pydantic import BaseModel

import base64
import binascii
import gzip
import queue
import hashlib
import zlib
import threading
import time
import uuid

from contextlib import asynccontextmanager

from starlette.routing import Route

from . import ai, artifacts, assembly, auth, cadjobs, cadworker, features, geometry, importer, mcp_server, sldexport, store, uploads

STATIC = Path(__file__).parent / "static"


def _commit() -> str:
    """The git commit this server runs (OPENSKETCH_VERSION when there is no git, e.g. a Docker image)."""
    import subprocess
    try:
        return subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=Path(__file__).parent, capture_output=True,
                              text=True, timeout=5).stdout.strip() or os.environ.get("OPENSKETCH_VERSION", "dev")
    except Exception:
        return os.environ.get("OPENSKETCH_VERSION", "dev")


VERSION = _commit()
UPDATE_NOTE = Path(os.environ.get("OPENSKETCH_UPDATE_NOTE", str(Path.home() / ".opensketch-update-note")))

@asynccontextmanager
async def lifespan(_app):
    _warm_owner()  # CAD runs in worker processes, one per person (cadworker.py): start the owner's now
    try:
        async with mcp_server.lifespan_context():
            yield
    finally:
        cadworker.shutdown()


def _warm_owner() -> None:
    try:
        from . import accounts
        owner = next((u for u in accounts.list_users() if u.get("role") == "owner"), None)
    except Exception:
        owner = None
    cadworker.lane_for(owner["id"] if owner else None).warm()


def _lane(request: Request) -> "cadworker.Lane":
    """The signed-in person's CAD worker (cadworker.lane_for), so one person's work never queues another's."""
    return cadworker.lane_for(store.owner_of(getattr(request.state, "user", None)))


async def _cad(lane, fn, *args, **kwargs):
    """Run CAD work in a worker process. A worker that ran out of time or stopped -> 503 with a plain message;
    an unexpected exception in the work -> 500 with its message (as before, when it ran in this process)."""
    try:
        return await lane.run(fn, *args, **kwargs)
    except cadworker.CadUnavailable as exc:
        raise HTTPException(503, str(exc)) from None


# Responses that carry meshes or documents are gzipped: a part's mesh JSON shrinks about 6x (10 MB -> 1.5 MB),
# which is most of the wait on a hosted server. Streams (/api/ai/stream) are left alone so events are not held back.
GZIP_PATHS = ("/api/regen", "/api/import", "/api/docs", "/api/params", "/api/interference", "/api/toolbox",
              "/api/review/check", "/api/reviews", "/api/features", "/api/recognize")


class SelectiveGZip:
    def __init__(self, app):
        self.app = app
        self.gzip = GZipMiddleware(app, minimum_size=4096, compresslevel=5)

    async def __call__(self, scope, receive, send):
        path = scope.get("path", "") if scope["type"] == "http" else ""
        if path.startswith(GZIP_PATHS) and not path.endswith("/thumb"):  # pictures are compressed already
            return await self.gzip(scope, receive, send)
        return await self.app(scope, receive, send)


app = FastAPI(title="OpenSketch", lifespan=lifespan)
app.add_middleware(auth.PasswordGate)
app.add_middleware(SelectiveGZip)


class RegenRequest(BaseModel):
    doc: dict
    preview: dict | None = None
    known: dict | None = None  # assembly: part id -> mesh key the client already has
    drag: dict | None = None   # assembly: {component, point, target} to drag a component within its mates


class AIRequest(BaseModel):
    doc: dict
    prompt: str
    conversation: str | None = None
    demo: bool | str = False  # True or "press": hand press assembly, "part": L bracket, "web": web search + Toolbox screw
    selection: list[dict] | None = None  # what the user selected (Ask AI on a selection)


def _json_default(o):
    if isinstance(o, (set, frozenset, tuple)):
        return list(o)
    if hasattr(o, "tolist"):  # numpy numbers and arrays
        return o.tolist()
    raise TypeError(f"{type(o).__name__} is not JSON serialisable")


class FastJSON(JSONResponse):
    """JSON straight from json.dumps. FastAPI's own path walks every number of a mesh through
    jsonable_encoder first (0.85 s for a 10 MB part)."""

    def render(self, content) -> bytes:
        return json.dumps(content, separators=(",", ":"), allow_nan=False, default=_json_default).encode("utf-8")


def _light(doc: dict) -> bool:
    """Nothing heavy to build: a new part, a part with only sketches and planes so far, an empty assembly. These
    are answered here at once, so a new file never waits behind a big rebuild in the worker."""
    if assembly.is_assembly(doc):
        return not doc.get("components") and not doc.get("parts")
    feats = doc.get("features") or []
    return all(f.get("type") in ("sketch", "plane") for f in feats) and sum(len(f.get("entities") or []) for f in feats) <= 400


@app.post("/api/regen")
async def api_regen(req: RegenRequest, request: Request):
    if _light(req.doc):
        return FastJSON(await run_in_threadpool(cadjobs.regen, req.doc, req.preview, req.known, req.drag))
    try:
        res = await _cad(_lane(request), cadjobs.regen, req.doc, req.preview, req.known, req.drag)
    except cadworker.CadJobError as exc:
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None
    return FastJSON(res)


class ParamsRequest(BaseModel):
    doc: dict
    expression: str | None = None


@app.post("/api/params")
async def api_params(req: ParamsRequest, request: Request):
    """Equations dialog: variables with values and problems, every equation, and the part with the numbers the
    equations give (sketches re-solved). With `expression`: its value, or an error."""
    try:
        out = await _cad(_lane(request), cadjobs.params, req.doc, req.expression)
    except cadworker.CadJobError as exc:
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None
    if "__error__" in out:
        return JSONResponse({"error": out["__error__"]}, status_code=400)
    return out


class NameRefsRequest(BaseModel):
    doc: dict          # the part as it stands before the feature (its rollback bar just above it)
    feature: dict


@app.post("/api/name_refs")
async def api_name_refs(req: NameRefsRequest, request: Request):
    """Add persistent names to a feature's face and edge picks (naming.annotate), so they survive edits."""
    try:
        return {"feature": await _cad(_lane(request), cadjobs.name_refs, req.doc, req.feature)}
    except cadworker.CadJobError as exc:
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None


class FaceOwnerRequest(BaseModel):
    doc: dict
    center: list[float]
    normal: list[float] | None = None


@app.post("/api/face_owner")
async def api_face_owner(req: FaceOwnerRequest, request: Request):
    """Which feature made a face, and from which sketch curve (persistent names, naming.py). Drives the
    Design panel: click a face, see the numbers that shape it."""
    try:
        return await _cad(_lane(request), cadjobs.face_owner, req.doc, req.center, req.normal)
    except cadworker.CadJobError as exc:
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None


class DeletePlanRequest(BaseModel):
    doc: dict
    features: list[str]
    delete_absorbed: bool = True


@app.post("/api/delete_plan")
async def api_delete_plan(req: DeletePlanRequest, request: Request):
    """What deleting these part features takes with it and breaks (edits.plan_delete), plus the new part."""
    try:
        plan = await _cad(_lane(request), cadjobs.delete_plan, req.doc, req.features, req.delete_absorbed)
    except cadworker.CadJobError as exc:
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None
    if "error" in plan:
        return JSONResponse({"error": plan["error"]}, status_code=400)
    return plan


@app.post("/api/mass")
async def api_mass(req: RegenRequest, request: Request):
    try:
        return await _cad(_lane(request), cadjobs.mass, req.doc)
    except cadworker.CadJobError as exc:
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None


@app.post("/api/interference")
async def api_interference(req: RegenRequest, request: Request):
    if not assembly.is_assembly(req.doc):
        raise HTTPException(400, "Interference Detection works on assemblies")
    try:
        return await _cad(_lane(request), cadjobs.interference, req.doc)
    except cadworker.CadJobError as exc:
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None


class ImportRequest(BaseModel):
    filename: str
    data: str  # base64 file content


async def _import_reply(raw: bytes, filename: str, lane):
    """Every failure comes back as JSON {error} with a readable message, never a bare 500."""
    try:
        return {"doc": await lane.run(cadjobs.import_file, raw, filename)}
    except cadworker.CadUnavailable as exc:
        return JSONResponse({"error": f"Could not import {filename}: {exc}"}, status_code=503)
    except cadworker.CadJobError as exc:
        if exc.kind == "ImportError_":
            return JSONResponse({"error": exc.message}, status_code=422)
        # anything else the reader or the assembly step throws
        return JSONResponse({"error": f"Could not import {filename}: {exc.message.strip() or exc.kind}"}, status_code=422)


@app.post("/api/import")
async def api_import(req: ImportRequest, request: Request):
    """STEP -> part or assembly document (base64 in JSON; kept for old clients and scripts)."""
    try:
        raw = base64.b64decode(req.data, validate=True)
    except (binascii.Error, ValueError):
        return JSONResponse({"error": "The upload is not valid base64. Try uploading the file again."}, status_code=400)
    return await _import_reply(raw, req.filename, _lane(request))


IMPORT_MAX = 128 * 1024 * 1024  # bytes of CAD data per upload (after unzipping the browser's gzip)


@app.post("/api/import/raw")
async def api_import_raw(request: Request, filename: str = "model.step"):
    """STEP -> part or assembly document. The body is the file's bytes, gzipped by the browser when
    the X-OpenSketch-Gzip header is 1 (a 14 MB STEP becomes ~3 MB, small enough for the Codespaces tunnel)."""
    too_big = JSONResponse({"error": f"The file is bigger than {IMPORT_MAX // 2**20} MB. Split it or simplify it first."}, status_code=413)
    body = bytearray()
    async for chunk in request.stream():
        body += chunk
        if len(body) > IMPORT_MAX:
            return too_big
    body = bytes(body)
    if request.headers.get("x-opensketch-gzip") == "1":
        try:  # bounded: a small gzip that unpacks to gigabytes is refused, not unpacked
            d = zlib.decompressobj(16 + zlib.MAX_WBITS)
            out = d.decompress(body, IMPORT_MAX + 1)
            if len(out) > IMPORT_MAX or d.unconsumed_tail:
                return too_big
            body = out + d.flush()
            if not d.eof:
                raise zlib.error("truncated")
        except zlib.error:
            return JSONResponse({"error": "The upload arrived damaged. Try again."}, status_code=400)
    return await _import_reply(body, filename, _lane(request))


@app.get("/api/features")
def api_features():
    """The feature registry: the browser builds ribbon buttons, PropertyManagers and defaults from it."""
    return features.public()


@app.get("/api/toolbox")
def api_toolbox():
    return importer.standard_catalog()


class ToolboxRequest(BaseModel):
    kind: str
    size: str
    length: float | None = None


@app.post("/api/toolbox/part")
async def api_toolbox_part(req: ToolboxRequest, request: Request):
    if req.kind not in importer.STANDARD:
        raise HTTPException(400, "Unknown kind")
    args = {"size": req.size}
    if "length" in importer.STANDARD[req.kind][2]:
        if req.length is not None and (not math.isfinite(req.length) or req.length <= 0):
            raise HTTPException(400, "Length must be greater than 0")
        args["length"] = req.length if req.length is not None else 10
    try:
        doc = await _cad(_lane(request), cadjobs.toolbox_part, req.kind, args)
    except cadworker.CadJobError as exc:  # bad size
        raise HTTPException(400, exc.message) from None
    return {"doc": doc}


@app.post("/api/export/{fmt}")
async def api_export(fmt: str, req: RegenRequest, request: Request):
    if fmt not in ("step", "stl"):
        raise HTTPException(400, "Format must be step or stl")
    fd, path = tempfile.mkstemp(suffix=f".{fmt}")
    os.close(fd)
    try:
        await _cad(_lane(request), cadjobs.export, req.doc, fmt, path)
    except cadworker.CadJobError as exc:
        Path(path).unlink(missing_ok=True)
        if exc.kind in ("FeatureError", "AssemblyError"):
            raise HTTPException(400, exc.message) from None
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None
    except BaseException:
        Path(path).unlink(missing_ok=True)
        raise
    name = (req.doc.get("name") or ("Assem1" if assembly.is_assembly(req.doc) else "Part1")) + (".step" if fmt == "step" else ".stl")
    return FileResponse(path, filename=name, media_type="application/octet-stream",
                        background=BackgroundTask(Path(path).unlink, missing_ok=True))


class MacroRequest(BaseModel):
    doc: dict
    verify: bool = True
    name: str | None = None


_macro_jobs: dict = {}


@app.get("/api/export/sldmacro/toolchain")
def api_macro_toolchain():
    tc = sldexport.toolchain()
    return {"features": tc["ok"], "have": tc["have"], "missing": tc["missing"]}


MACRO_RUNNING_MAX = 2  # macro jobs running at once per person (each can run LibreOffice for minutes)


def _who(request: Request) -> str:
    u = getattr(request.state, "user", None)
    return u["id"] if u else ""


@app.post("/api/export/sldmacro/start")
def api_macro_start(req: MacroRequest, request: Request):
    """Start writing a SOLIDWORKS macro (a background job: checking the macro takes a minute or more)."""
    me = _who(request)
    if sum(1 for j in _macro_jobs.values() if j["state"] == "running" and j.get("owner") == me) >= MACRO_RUNNING_MAX:
        return JSONResponse({"error": "Two exports are already running. Wait for one to finish."}, status_code=429)
    jid = uuid.uuid4().hex[:12]
    fd, path = tempfile.mkstemp(suffix=".zip")
    os.close(fd)
    job = {"state": "running", "log": [], "report": None, "zip": path, "started": time.time(), "owner": me,
           "name": (req.name or req.doc.get("name") or "OpenSketch")}
    _macro_jobs[jid] = job
    for k in [k for k, v in _macro_jobs.items() if time.time() - v["started"] > 6 * 3600]:
        old = _macro_jobs[k]
        if old["state"] != "running":
            _macro_jobs.pop(k, None)
            Path(old["zip"]).unlink(missing_ok=True)

    def event(kind, payload):  # from the job's own process (cadworker.start_job)
        if kind == "progress":
            job["log"].append(payload[0])
        elif kind == "done":
            job["report"], job["state"] = payload, "done"
        else:
            job["state"], job["error"] = "error", f"{payload[0]}: {payload[1]}"
    cadworker.start_job(sldexport.export, req.doc, path, name=req.name, verify=req.verify, uses=("log",),
                        on_event=event, limit=3 * 3600)
    return {"job": jid}


@app.get("/api/export/sldmacro/{jid}")
def api_macro_status(jid: str, request: Request):
    job = _macro_jobs.get(jid)
    if job is None or job.get("owner") != _who(request):
        raise HTTPException(404, "No such export")
    return {k: job.get(k) for k in ("state", "log", "report", "error")} | {"seconds": round(time.time() - job["started"])}


@app.get("/api/export/sldmacro/{jid}/zip")
def api_macro_zip(jid: str, request: Request):
    job = _macro_jobs.get(jid)
    if job is None or job["state"] != "done" or job.get("owner") != _who(request):
        raise HTTPException(404, "Not ready")
    name = "".join(c if c.isalnum() or c in "-_" else "_" for c in job["name"]) or "OpenSketch"
    return FileResponse(job["zip"], filename=f"{name}_SOLIDWORKS_macro.zip", media_type="application/zip")


class RecognizeRequest(BaseModel):
    doc: dict
    part_id: str | None = None
    kinds: list[str] | None = None


_recognize_jobs: dict = {}
RECOGNIZE_RUNNING_MAX = 1  # recognition is CPU-heavy: one job per person at a time


@app.post("/api/recognize/start")
def api_recognize_start(req: RecognizeRequest, request: Request):
    """Start feature recognition (FeatureWorks) on a part's or an assembly's imported bodies. A background job:
    a large part can take a minute or two, an assembly one part after another."""
    from . import recognize
    me = _who(request)
    if sum(1 for j in _recognize_jobs.values() if j["state"] in ("running", "cancelling") and j.get("owner") == me) >= RECOGNIZE_RUNNING_MAX:
        return JSONResponse({"error": "Feature recognition is already running. Wait for it to finish."}, status_code=429)
    if not recognize.imported_parts(req.doc):
        return JSONResponse({"error": "There is no imported body to recognize."}, status_code=400)
    if req.kinds and set(req.kinds) - set(recognize.KINDS):
        return JSONResponse({"error": f"Feature types are {', '.join(recognize.KINDS)}."}, status_code=400)
    jid = uuid.uuid4().hex[:12]
    job = {"state": "running", "started": time.time(), "owner": me, "done": 0, "total": 0, "current": None,
           "parts": {}, "result": None}
    _recognize_jobs[jid] = job
    for k in [k for k, v in _recognize_jobs.items() if v["state"] not in ("running", "cancelling") and time.time() - v["started"] > 3600]:
        _recognize_jobs.pop(k, None)

    def progress(done, total, name, reports):
        job.update(done=done, total=total, current=name, parts=dict(reports))

    def work():  # each part runs in recognize's own spawned worker (recognize_part_safe), so this thread only waits
        try:
            res = recognize.recognize_doc(req.doc, part_id=req.part_id, kinds=req.kinds, progress=progress,
                                          stop=lambda: job.get("cancel", False))
            asm = assembly.is_assembly(res["doc"])
            job["result"] = {"changed": res["changed"], "parts": res["parts"],
                             "updates": {pid: {k: (res["doc"]["parts"][pid] if asm else res["doc"]).get(k)
                                               for k in ("features", "rollback")} for pid in res["changed"]}}
            job["state"] = "cancelled" if job.get("cancel") else "done"
        except recognize.RecognizeError as exc:
            job["state"], job["error"] = "error", str(exc)
        except Exception as exc:
            job["state"], job["error"] = "error", f"{type(exc).__name__}: {exc}"
    threading.Thread(target=work, daemon=True).start()
    return {"job": jid}


@app.delete("/api/recognize/{jid}")
def api_recognize_cancel(jid: str, request: Request):
    """Stop a recognition job: it ends at the next check (a part in progress keeps what it has recognised)."""
    job = _recognize_jobs.get(jid)
    if job is None or job.get("owner") != _who(request):
        raise HTTPException(404, "No such job")
    job["cancel"] = True
    if job["state"] == "running":
        job["state"] = "cancelling"
    return {"state": job["state"]}


@app.get("/api/recognize/{jid}")
def api_recognize_status(jid: str, request: Request):
    job = _recognize_jobs.get(jid)
    if job is None or job.get("owner") != _who(request):
        raise HTTPException(404, "No such job")
    out = {k: job.get(k) for k in ("state", "done", "total", "current", "error")}
    out["seconds"] = round(time.time() - job["started"])
    out["parts"] = {pid: {k: r.get(k) for k in ("name", "message", "exact", "base", "counts", "recognized", "faces")}
                    for pid, r in (job.get("parts") or {}).items()}
    if job["state"] == "done":
        out["result"] = job["result"]
    return out


@app.post("/api/ai")
def api_ai(req: AIRequest, request: Request):
    """Old non-streaming route (scripts): the same person's key as the chat."""
    from . import aikeys
    if aikeys.effective(getattr(request.state, "user", None)) is None and not ai.demo_enabled():
        return JSONResponse({"error": ai.NO_KEY}, status_code=503)
    try:
        return ai.run(req.doc, req.prompt, req.conversation)
    except ai.AIUnavailable as exc:
        return JSONResponse({"error": str(exc)}, status_code=503)


@app.post("/api/ai/stream")
def api_ai_stream(req: AIRequest, request: Request):
    """Newline-delimited JSON events while the AI designs (see ai.run_stream), with the person's own key
    (aikeys) or the server's."""
    from . import aikeys
    cfg = aikeys.effective(getattr(request.state, "user", None))
    headers = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    if not cadworker.enabled():
        def gen():
            try:
                for ev in ai.run_stream(req.doc, req.prompt, req.conversation, demo=req.demo, selection=req.selection, ai_config=cfg):
                    yield json.dumps(ev, separators=(",", ":")) + "\n"
            except Exception as exc:  # never leave the client hanging
                yield json.dumps({"ev": "error", "message": f"Server error: {exc}"}) + "\n"
        return StreamingResponse(gen(), media_type="application/x-ndjson", headers=headers)

    # The chat runs in a process of its own (its builds hold OpenCascade's GIL); its events come back here.
    events: queue.Queue = queue.Queue()
    conv = req.conversation if isinstance(req.conversation, str) and req.conversation in ai._conversations else None

    def on_event(kind, payload):
        events.put((kind, payload))
    job = cadworker.start_job(cadjobs.ai_stream, req.doc, req.prompt, conv, ai._conversations.get(conv) if conv else None,
                              req.demo, req.selection, cfg, on_event=on_event, limit=3600)

    async def agen():
        try:
            while True:
                kind, payload = await run_in_threadpool(events.get)
                if kind == "progress":
                    yield json.dumps(payload[0], separators=(",", ":"), default=_json_default) + "\n"
                elif kind == "done":
                    if payload.get("conversation") and payload.get("history") is not None:
                        ai._conversations[payload["conversation"]] = payload["history"]
                    return
                else:  # never leave the client hanging
                    yield json.dumps({"ev": "error", "message": f"Server error: {payload[1]}"}) + "\n"
                    return
        finally:
            job.cancel(grace=10)  # the person pressed Stop or left: end the job (nothing happens if it finished)
    return StreamingResponse(agen(), media_type="application/x-ndjson", headers=headers)


@app.get("/healthz", include_in_schema=False)
async def healthz():
    """Asked every few seconds by the supervisor (python -m opensketch --supervise), which restarts the server when
    this stops answering. It needs the event loop and one free worker thread, like every other request."""
    await run_in_threadpool(lambda: None)
    return {"ok": True, "version": VERSION}


@app.get("/api/version")
def api_version():
    """The running version; the page polls it to offer a reload after the codespace updates itself."""
    try:
        note = UPDATE_NOTE.read_text().strip()
    except OSError:
        note = ""
    return {"version": VERSION, "note": note}


@app.get("/api/ai/status")
def api_ai_status(request: Request):
    from . import aikeys, providers
    cfg = aikeys.effective(getattr(request.state, "user", None))
    out = {"available": bool(cfg) or ai.demo_enabled(), "demo": ai.demo_enabled(), "source": cfg and cfg["source"]}
    if cfg:
        out.update(provider=cfg["provider"], model=cfg["model"], label=providers.PROVIDERS[cfg["provider"]]["label"])
    return out


class AIKeyRequest(BaseModel):
    provider: str
    model: str | None = None
    key: str | None = None
    base_url: str | None = None


@app.get("/api/ai/keys")
def api_ai_keys(request: Request):
    """This person's AI settings (never the key itself), the providers, and whether the server has a key."""
    from . import aikeys, providers
    u = getattr(request.state, "user", None)
    if u and u.get("role") == "tester":  # early access: the AI is provided; nothing about the key leaves the server
        cfg = aikeys.early_access_config()
        return {"settings": None, "providers": providers.public_list(), "server_key": cfg is not None, "early_access": True}
    return {"settings": aikeys.public(aikeys.owner_id(u)),
            "providers": providers.public_list(), "server_key": aikeys.server_config() is not None}


def _no_tester(request: Request) -> None:
    u = getattr(request.state, "user", None)
    if u and u.get("role") == "tester":
        raise HTTPException(403, "Early access already includes the AI.")


@app.post("/api/ai/keys")
def api_ai_keys_save(req: AIKeyRequest, request: Request):
    from . import aikeys
    _no_tester(request)
    try:
        return {"settings": aikeys.save(aikeys.owner_id(getattr(request.state, "user", None)), req.provider, req.model or "",
                                        req.key, req.base_url)}
    except aikeys.KeyError_ as e:
        return JSONResponse({"error": str(e)}, status_code=400)


@app.delete("/api/ai/keys")
def api_ai_keys_remove(request: Request):
    from . import aikeys
    aikeys.remove(aikeys.owner_id(getattr(request.state, "user", None)))
    return {"settings": None}


@app.post("/api/ai/models")
def api_ai_models(req: AIKeyRequest, request: Request):
    """Check a key and list the models it can use. Without a key, the stored one (same provider) is used."""
    from . import aikeys, providers
    _no_tester(request)
    spec = providers.PROVIDERS.get(req.provider)
    if spec is None:
        return JSONResponse({"error": "Choose a provider."}, status_code=400)
    key = (req.key or "").strip()
    if not key:
        stored = aikeys.config_for(aikeys.owner_id(getattr(request.state, "user", None)))
        if not stored or stored["provider"] != req.provider:
            return JSONResponse({"error": "Paste the API key first."}, status_code=400)
        key = stored["key"]
    base = (req.base_url or "").strip().rstrip("/") or spec["base_url"]
    if not base:
        return JSONResponse({"error": "Enter the provider's address."}, status_code=400)
    try:
        if req.provider == "custom":
            base = providers.check_base_url(base)
        models = providers.list_models({"provider": req.provider, "key": key, "base_url": base})
    except providers.ProviderError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    return {"ok": True, "models": models[:500]}


# ----------------------------------------------------------------------------- server documents (Files)

class DocCreate(BaseModel):
    name: str = "Untitled"
    doc: dict | None = None
    kind: str = "part"


class DocSave(BaseModel):
    doc: dict
    base_version: int | None = None
    summary: str = ""
    requests: list | None = None


class DocPatch(BaseModel):
    name: str | None = None


class DocCopy(BaseModel):
    name: str | None = None


class VersionRequest(BaseModel):
    version: int


def _found(fn, *a, **k):
    try:
        return fn(*a, **k)
    except store.NotFound:
        raise HTTPException(404, "No such document") from None


def _doc_meta(doc_id: str, request: Request, trash_ok: bool = False) -> dict:
    """The document's meta if this person may use it, else 404 (never says whose it is)."""
    try:
        m = store.meta(doc_id)
    except store.NotFound:
        raise HTTPException(404, "No such document") from None
    if not store.can_see(m, _user(request)) or (m.get("deleted") and not trash_ok):
        raise HTTPException(404, "No such document")
    return m


def _card(m: dict) -> dict:
    """What the Files page shows for a document."""
    t = m.get("thumb")
    out = {k: m.get(k) for k in ("id", "name", "kind", "version", "created", "updated", "by", "summary", "deleted",
                                 "counts", "size")}
    out["thumb_stale"] = bool(t) and int(t.get("version") or 0) < int(m["version"])
    # the address changes with the picture, and with the model while the picture is older than it: a changed
    # model (the AI's edit) is asked for again instead of shown from the browser's day-long cache
    out["thumb"] = (f"/api/docs/{m['id']}/thumb?v={t['version']}-{int(t.get('updated') or 0)}"
                    + (f"-{m['version']}" if out["thumb_stale"] else "")) if t else None
    return out


@app.get("/api/docs")
def api_docs(request: Request, trash: bool = False):
    """This person's Files (newest first), or their Trash."""
    return [_card(m) for m in store.listing(store.visible_to(_user(request)), deleted=trash)]


def _free_name(kind: str, user) -> str:
    """"Part 3", "Assembly 2": the next number not used in this person's Files."""
    base = "Assembly" if kind == "assembly" else "Part"
    used = {m["name"] for m in store.listing(store.visible_to(user))}
    n = 1
    while f"{base} {n}" in used:
        n += 1
    return f"{base} {n}"


@app.post("/api/docs")
def api_doc_create(req: DocCreate, request: Request):
    kind = req.kind if req.kind in ("part", "assembly") else "part"
    if req.doc is not None:
        kind = store.kind_of(req.doc)
    name = (req.name or "").strip()
    if not name or (req.doc is None and name == "Untitled"):
        name = _free_name(kind, _user(request))
    return store.create(name, req.doc, kind, by="you", owner=store.owner_of(_user(request)))


@app.get("/api/docs/{doc_id}")
def api_doc(doc_id: str, request: Request):
    m = _doc_meta(doc_id, request)
    return dict(_found(store.get, doc_id), thumb=m.get("thumb"))


@app.get("/api/docs/{doc_id}/head")
def api_doc_head(doc_id: str, request: Request):
    """Polled by the browser to follow changes (small: read from the meta file, not the model)."""
    _doc_meta(doc_id, request)
    return _found(store.head, doc_id)


@app.get("/api/docs/{doc_id}/versions")
def api_doc_versions(doc_id: str, request: Request):
    """Earlier versions still kept (version history, Publish Review's compare list)."""
    _doc_meta(doc_id, request)
    return _found(store.versions, doc_id)


@app.post("/api/docs/{doc_id}/restore_version")
def api_doc_restore_version(doc_id: str, req: VersionRequest, request: Request):
    _doc_meta(doc_id, request)
    try:
        return _card(store.meta(store.restore(doc_id, req.version, "you")["id"]))
    except store.NotFound:
        raise HTTPException(404, f"Version {req.version} is not kept any more.") from None


@app.put("/api/docs/{doc_id}")
def api_doc_save(doc_id: str, req: DocSave, request: Request):
    m = _doc_meta(doc_id, request)
    if isinstance(req.doc, dict):
        req.doc["name"] = m["name"]  # a file is renamed only by PATCH: a save never renames it
    try:
        return store.save(doc_id, req.doc, "you", req.summary or "Edited in OpenSketch", req.base_version, req.requests)
    except store.NotFound:
        raise HTTPException(404, "No such document") from None
    except store.Conflict as c:
        return JSONResponse({"error": "conflict", "current": c.current}, status_code=409)


@app.patch("/api/docs/{doc_id}")
def api_doc_patch(doc_id: str, req: DocPatch, request: Request):
    """Rename."""
    _doc_meta(doc_id, request)
    try:
        if req.name is not None:
            store.rename(doc_id, req.name)
    except ValueError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    return _card(store.meta(doc_id))


def _copy_name(name: str, user) -> str:
    """"Copy of X", then "Copy 2 of X"...: the difference stays at the start, where a long name is not cut off."""
    used = {m["name"] for m in store.listing(store.visible_to(user))}
    n = 1
    while True:
        cand = (("Copy of " if n == 1 else f"Copy {n} of ") + name)[:120].strip()
        if cand not in used:
            return cand
        n += 1


@app.post("/api/docs/{doc_id}/duplicate")
def api_doc_duplicate(doc_id: str, req: DocCopy, request: Request):
    m = _doc_meta(doc_id, request)
    rec = store.duplicate(doc_id, store.owner_of(_user(request)), "you", req.name or _copy_name(m["name"], _user(request)))
    return _card(store.meta(rec["id"]))


@app.post("/api/docs/{doc_id}/discard")
def api_doc_discard(doc_id: str, request: Request):
    """A file New made and the person left untouched: removed for good (no empty "Part N" files pile up).
    Anything that was changed, renamed or written by an AI is kept (409)."""
    _doc_meta(doc_id, request)
    if store.discard_untouched(doc_id):
        return {"discarded": doc_id}
    return JSONResponse({"error": "Kept: it was changed.", "discarded": False}, status_code=409)


@app.delete("/api/docs/{doc_id}")
def api_doc_delete(doc_id: str, request: Request, forever: bool = False):
    """Move to the Trash; forever=1 removes a document that is already in the Trash."""
    m = _doc_meta(doc_id, request, trash_ok=True)
    if forever:
        if not m.get("deleted"):
            return JSONResponse({"error": "Move it to the Trash first."}, status_code=400)
        store.purge(doc_id)
        return {"deleted": doc_id, "forever": True}
    return _card(store.trash(doc_id))


@app.post("/api/docs/{doc_id}/restore")
def api_doc_untrash(doc_id: str, request: Request):
    _doc_meta(doc_id, request, trash_ok=True)
    return _card(store.untrash(doc_id))


THUMB_TYPES = {"image/webp": "webp", "image/png": "png"}


@app.put("/api/docs/{doc_id}/thumb")
async def api_doc_thumb_put(doc_id: str, request: Request, version: int = 0):
    """A picture of the model from the browser (WebP or PNG, <= 600 KB), for the Files page."""
    _doc_meta(doc_id, request)
    ext = THUMB_TYPES.get(request.headers.get("content-type", "").split(";")[0].strip())
    if ext is None:
        return JSONResponse({"error": "Send image/webp or image/png."}, status_code=415)
    too_big = JSONResponse({"error": "The picture is too big."}, status_code=413)
    if int(request.headers.get("content-length") or 0) > store.THUMB_MAX:
        return too_big
    body = bytearray()
    async for chunk in request.stream():
        body += chunk
        if len(body) > store.THUMB_MAX:
            return too_big
    body = bytes(body)
    try:
        entry = store.set_thumb(doc_id, body, ext, version, "browser")
    except ValueError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    return {"thumb": entry}


_thumb_jobs: dict[str, threading.Event] = {}
_thumb_guard = threading.Lock()
# Server-drawn pictures are a background nicety and must never starve the server (2026-10-19: Files visits redrew
# the 19-part Lavilock assembly again and again while YZ worked; on Fly's shared CPU that used up the burst
# balance and the server stopped answering). One at a time; big models (imported STEP assemblies) are left to the
# browser, which draws a picture for free when the file is opened; a model that failed to draw is not tried again
# until it changes.
_thumb_slots = threading.BoundedSemaphore(1)
THUMB_SERVER_MAX = 400 * 1024  # bytes of stored document above which the server does not draw the picture
_thumb_failed: dict[str, int] = {}  # document id -> version the server could not draw


async def _render_thumb(doc_id: str) -> None:
    """Draw a picture on the server (a document the AI made, or one never opened in a browser), in the background
    worker so it never holds up a rebuild or the web server."""
    rec = await run_in_threadpool(store.get, doc_id)
    png = await cadworker.BACKGROUND.run(cadjobs.thumb_png, rec["doc"])
    await run_in_threadpool(store.set_thumb, doc_id, png, "png", rec["version"], "server")


@app.get("/api/docs/{doc_id}/thumb")
async def api_doc_thumb(doc_id: str, request: Request):
    """The model's picture. Missing, or older than the model and not drawn by a browser since: drawn here
    (once at a time per document) and kept. 404 when the model cannot be drawn (empty or failing)."""
    m = _doc_meta(doc_id, request, trash_ok=True)
    t = m.get("thumb")
    version = int(m["version"])
    old = bool(t) and int(t.get("version") or 0) < version
    # redrawn here when there is none, the AI changed the model, the picture was drawn here, or a browser's
    # picture is older than the model and nobody has touched it for 2 minutes (a tab closed right after an edit)
    stale = not t or (old and (m.get("by") == "claude" or t.get("source") == "server" or time.time() - float(m.get("updated") or 0) > 120))
    if stale and (int(m.get("size") or 0) > THUMB_SERVER_MAX or _thumb_failed.get(doc_id) == version):
        stale = False  # the browser that opens it draws it; or it failed at this version already
    if stale:
        with _thumb_guard:
            ev = _thumb_jobs.get(doc_id)
            mine = ev is None
            if mine:
                ev = _thumb_jobs[doc_id] = threading.Event()
        try:
            if mine:
                try:
                    await _render_thumb(doc_id)
                    _thumb_failed.pop(doc_id, None)
                except Exception:  # nothing to draw (empty, failing): keep the old picture if any
                    _thumb_failed[doc_id] = version
            else:
                await run_in_threadpool(ev.wait, 30)
        finally:
            if mine:
                ev.set()
                with _thumb_guard:
                    _thumb_jobs.pop(doc_id, None)
    found = store.thumb(doc_id)
    if not found:
        raise HTTPException(404, "No picture yet")
    path, entry = found
    # a picture older than the model is not cached: the next visit asks again (it may be redrawn by then)
    current = int(entry.get("version") or 0) >= version
    return FileResponse(path, media_type="image/webp" if entry["ext"] == "webp" else "image/png",
                        headers={"Cache-Control": "private, max-age=86400" if current else "no-cache"})


def _user(request: Request) -> dict | None:
    return getattr(request.state, "user", None)


def _owner(request: Request) -> dict:
    u = _user(request)
    if not u or u.get("role") != "owner" or u.get("legacy"):
        raise HTTPException(403, "Only the owner can do this.")
    return u


@app.get("/api/account")
def api_account(request: Request):
    """Who is signed in, for the account menu."""
    from . import accounts
    u = _user(request)
    m = auth.mode()
    from . import oauth
    out = {"mode": m, "user": u, "can_setup": m in ("open", "password"), "reset_with_server_password": bool(auth.password()),
           "google": oauth.enabled(), **accounts.settings()}
    if u and u.get("role") == "owner" and m == "accounts":
        out["users"] = accounts.list_users()
        out["pending_invites"] = accounts.pending_invites()
        out["access"] = dict(accounts.access_settings(), testers=len(accounts.tester_ids()),
                             link=f"{_base(request)}/access")
    return out


class AccountUpdate(BaseModel):
    name: str | None = None
    current_password: str | None = None
    new_password: str | None = None


@app.post("/api/account")
def api_account_update(req: AccountUpdate, request: Request):
    from . import accounts
    u = _user(request)
    if not u or u.get("legacy"):
        return JSONResponse({"error": "Create an account first."}, status_code=400)
    try:
        if req.new_password:
            accounts.set_password(u["id"], req.new_password, req.current_password or "")
        if req.name:
            accounts.rename(u["id"], req.name)
    except accounts.AccountError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    return {"user": accounts.get(u["id"]), "signed_out": bool(req.new_password)}


class AccountSettings(BaseModel):
    open_signup: bool | None = None
    access_code: str | None = None  # early access: the code people type to skip sign-up
    access_on: bool | None = None


@app.post("/api/account/settings")
def api_account_settings(req: AccountSettings, request: Request):
    """Owner: let anyone create an account (email or Google), or keep the server invite-only; the early-access code
    (testers skip sign-up and use the server's AI key)."""
    from . import accounts
    _owner(request)
    out = {}
    if req.open_signup is not None:
        out.update(accounts.set_open_signup(req.open_signup))
    if req.access_code is not None or req.access_on is not None:
        try:
            out["access"] = dict(accounts.set_access(req.access_code, req.access_on), testers=len(accounts.tester_ids()),
                                 link=f"{_base(request)}/access")
        except accounts.AccountError as e:
            return JSONResponse({"error": str(e)}, status_code=400)
    return out or accounts.settings()


@app.delete("/api/account/testers")
def api_remove_testers(request: Request):
    """Owner: remove every Internal tester account (early access). Their connected AI apps stop working too."""
    from . import accounts, mcpauth
    _owner(request)
    gone = accounts.remove_testers()
    for uid in gone:
        mcpauth.drop_user(uid)
    return {"removed": len(gone)}


def _google_redirect(request: Request) -> str:
    return auth._request_base(request.scope) + "/auth/google/callback"


@app.get("/api/account/google")
def api_google_get(request: Request):
    """Owner: Sign in with Google settings (the address to give Google; never the secret)."""
    from . import oauth
    _owner(request)
    return oauth.public(_google_redirect(request))


class GoogleSetup(BaseModel):
    client_id: str
    client_secret: str


@app.post("/api/account/google")
def api_google_set(req: GoogleSetup, request: Request):
    """Owner: turn on Sign in with Google with a Web application OAuth client from Google Cloud."""
    from . import oauth
    _owner(request)
    if (oauth.client() or ("", "", ""))[2] == "server":
        return JSONResponse({"error": "Google sign-in is set on the server (GOOGLE_CLIENT_ID). Change it there."}, status_code=400)
    try:
        oauth.save(req.client_id, req.client_secret, _google_redirect(request))
    except oauth.SetupError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    return oauth.public(_google_redirect(request))


@app.delete("/api/account/google")
def api_google_off(request: Request):
    from . import oauth
    _owner(request)
    oauth.remove()
    return oauth.public(_google_redirect(request))


@app.post("/api/account/invites")
def api_invite(request: Request):
    from . import accounts
    u = _owner(request)
    token = accounts.create_invite(u["id"])
    return {"url": f"{_base(request)}/join/{token}", "days": accounts.INVITE_DAYS}


@app.delete("/api/account/users/{user_id}")
def api_remove_user(user_id: str, request: Request):
    from . import accounts
    _owner(request)
    try:
        accounts.remove(user_id, "")
    except accounts.AccountError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    from . import mcpauth
    mcpauth.drop_user(user_id)  # their connected AI apps stop working too
    return {"removed": user_id}


@app.get("/api/connect")
def api_connect(request: Request):
    """What the Connect AI dialog shows: the sign-in address (/mcp, the app signs in as you) and this person's
    private address (/mcp/<key>, for apps that cannot sign in)."""
    base = auth.public_url(dict(request.headers))
    u = _user(request)
    return {"url": f"{base}/mcp", "signin": auth.mode() != "open",
            "mcp_url": f"{base}/mcp/{auth.mcp_token_for(u)}", "password_set": bool(auth.password()),
            "codespace": bool(os.environ.get("CODESPACE_NAME")), "app_url": base, "accounts": auth.mode() == "accounts",
            "personal": bool(u and not u.get("legacy") and u.get("role") != "owner")}


@app.get("/mcp/artifacts/{artifact_id}/{filename}")
def api_artifact(artifact_id: str, filename: str, expires: str = "", signature: str = ""):
    """Artifact-scoped signed capability: no login cookie or document/MCP credential in the URL."""
    try:
        path, info = artifacts.resolve(artifact_id, filename, expires, signature)
    except artifacts.ArtifactError:
        raise HTTPException(404, "No such artifact") from None
    return FileResponse(path, filename=info["filename"], media_type=info["media_type"],
                        headers={"Cache-Control": "no-store", "Referrer-Policy": "no-referrer",
                                 "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox"})


_UPLOAD_HEADERS = {"Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff"}


def _upload_reply(body: dict, status: int = 200) -> JSONResponse:
    return JSONResponse(body, status_code=status, headers=_UPLOAD_HEADERS)


@app.api_route("/mcp/uploads/{upload_id}", methods=["PUT", "POST"])
async def api_upload(upload_id: str, request: Request, expires: str = "", signature: str = ""):
    """A file for import_document(upload_id=...), sent to the one-time link from the request_upload MCP tool.
    The body is the file's bytes (curl -T file '<link>'); Content-Encoding: gzip (or X-OpenSketch-Gzip: 1) is
    unzipped on the way in, bounded. Same 32 MiB cap as base64 imports. No sign-in: the link is the key."""
    cap = mcp_server.MAX_IMPORT_BYTES
    try:
        uploads.check_link(upload_id, expires, signature)
    except uploads.UploadError as exc:
        return _upload_reply({"error": str(exc)}, exc.status)
    if request.headers.get("content-type", "").lower().startswith("multipart/"):
        return _upload_reply({"error": "Send the file's bytes as the request body (curl -T file '<link>'), not a form."}, 400)
    gz = (request.headers.get("content-encoding", "").strip().lower() == "gzip"
          or request.headers.get("x-opensketch-gzip") == "1")
    too_big = {"error": f"The file is bigger than {cap // 2**20} MiB, the import limit."}
    try:
        declared = int(request.headers.get("content-length", "0") or 0)
    except ValueError:
        declared = 0
    if declared > cap + 2**20:  # a gzip body of incompressible data is a little bigger than the file
        return _upload_reply(too_big, 413)
    try:
        out = uploads.begin(upload_id)
    except uploads.UploadError as exc:
        return _upload_reply({"error": str(exc)}, exc.status)
    digest, size, wire, ok = hashlib.sha256(), 0, 0, False
    unzip = zlib.decompressobj(16 + zlib.MAX_WBITS) if gz else None

    def keep(data: bytes) -> bool:
        nonlocal size
        size += len(data)
        if size > cap:
            return False
        digest.update(data)
        out.write(data)
        return True

    try:
        try:
            async for chunk in request.stream():
                wire += len(chunk)
                if wire > cap + 2**20:
                    return _upload_reply(too_big, 413)
                if unzip is None:
                    if not keep(chunk):
                        return _upload_reply(too_big, 413)
                    continue
                piece = unzip.decompress(chunk, cap - size + 1)  # bounded: a small gzip that unpacks to gigabytes stops here
                if not keep(piece) or unzip.unconsumed_tail:
                    return _upload_reply(too_big, 413)
            if unzip is not None:
                if not keep(unzip.flush()):
                    return _upload_reply(too_big, 413)
                if not unzip.eof or unzip.unused_data:
                    return _upload_reply({"error": "The gzip body arrived damaged (or holds more than one stream). Send it again."}, 400)
        except zlib.error:
            return _upload_reply({"error": "The gzip body arrived damaged. Send it again, or send the file without gzip."}, 400)
        except Exception:  # the client went away mid-upload
            return _upload_reply({"error": "The upload did not finish. Send it again."}, 400)
        if size == 0:
            return _upload_reply({"error": "The upload is empty. Send the file's bytes as the request body."}, 400)
        out.close()
        try:
            body = uploads.finish(upload_id, size, digest.hexdigest())
        except uploads.UploadError as exc:
            return _upload_reply({"error": str(exc)}, exc.status)
        ok = True
        return _upload_reply(body, 201)
    finally:
        out.close()
        if not ok:
            uploads.abort(upload_id)


# ----------------------------------------------------------------------------- SOLIDWORKS add-in link
# See swbridge.py. The add-in on the user's PC calls these with its SOLIDWORKS key (Authorization: Bearer oss_...);
# they are outside sign-in like /mcp/ (no cookies; the key is the credential and reaches nothing else).

def _sw_person(request: Request):
    from . import swbridge
    authz = request.headers.get("authorization", "")
    tok = authz[7:].strip() if authz[:7].lower() == "bearer " else ""
    ok, user = swbridge.resolve(tok)
    if not ok:
        if swbridge.retired(tok):
            raise HTTPException(401, "A new SOLIDWORKS key was made, so this one stopped working. Paste the new key from "
                                     "OpenSketch > Connect AI > SOLIDWORKS.")
        raise HTTPException(401, "This SOLIDWORKS key is not valid. Copy the key again from OpenSketch > Connect AI > SOLIDWORKS.")
    return user


def _sw_error(exc: Exception, status: int) -> JSONResponse:
    body = {"error": str(exc)}
    if getattr(exc, "reason", None):
        body["reason"] = exc.reason
    return JSONResponse(body, status_code=status, headers={"Cache-Control": "no-store"})


@app.post("/mcp/sw/hello")
async def sw_hello(request: Request):
    from . import swbridge
    user = _sw_person(request)
    try:
        info = await request.json()
    except ValueError:
        info = {}
    return JSONResponse(swbridge.hello(user, info if isinstance(info, dict) else {}), headers={"Cache-Control": "no-store"})


@app.get("/mcp/sw/next")
async def sw_next(request: Request, session: str = "", wait: float = 25):
    from . import swbridge
    user = _sw_person(request)
    try:
        cmd = await swbridge.next_command(user, session, wait)
    except swbridge.Gone as exc:
        return _sw_error(exc, 409)
    if cmd is None:
        return Response(status_code=204, headers={"Cache-Control": "no-store"})
    return JSONResponse(cmd, headers={"Cache-Control": "no-store"})


@app.post("/mcp/sw/result")
async def sw_result(request: Request):
    from . import swbridge
    user = _sw_person(request)
    try:
        body = await request.json()
        if not isinstance(body, dict):
            raise ValueError
    except ValueError:
        return _sw_error(ValueError("The result must be a JSON object."), 400)
    try:
        swbridge.put_result(user, str(body.get("session", "")), body)
    except swbridge.Gone as exc:
        return _sw_error(exc, 409)
    return {"ok": True}


@app.post("/mcp/sw/file")
async def sw_file(request: Request, session: str = "", id: str = "", name: str = ""):
    """A file SOLIDWORKS made for a command (STEP, STL, PNG...): the body is its bytes, optionally gzipped
    (X-OpenSketch-Gzip: 1), unzipped bounded."""
    from . import swbridge
    user = _sw_person(request)
    cap = swbridge.MAX_FILE
    raw = bytearray()
    async for chunk in request.stream():
        raw += chunk
        if len(raw) > cap + 2**20:
            return _sw_error(ValueError("The file is too big (128 MiB at most)."), 413)
    data = bytes(raw)
    if request.headers.get("x-opensketch-gzip") == "1" or request.headers.get("content-encoding", "").lower() == "gzip":
        unzip = zlib.decompressobj(16 + zlib.MAX_WBITS)
        try:
            data = unzip.decompress(data, cap + 1)
            if len(data) > cap or unzip.unconsumed_tail:
                return _sw_error(ValueError("The file is too big (128 MiB at most)."), 413)
            if not unzip.eof:
                return _sw_error(ValueError("The gzip body arrived damaged."), 400)
        except zlib.error:
            return _sw_error(ValueError("The gzip body arrived damaged."), 400)
    try:
        return swbridge.put_file(user, session, id, name, data)
    except swbridge.Gone as exc:
        return _sw_error(exc, 409)
    except swbridge.BridgeError as exc:
        return _sw_error(exc, 400)


@app.get("/mcp/sw/blob/{blob_id}")
def sw_blob(blob_id: str, request: Request):
    from . import swbridge
    user = _sw_person(request)
    try:
        data, filename = swbridge.blob(user, blob_id)
    except swbridge.BridgeError:
        raise HTTPException(404, "No such file") from None
    return Response(data, media_type="application/octet-stream",
                    headers={"Cache-Control": "no-store", "Content-Disposition": f'attachment; filename="{filename}"'})


SW_DOWNLOAD = Path(os.environ.get("OPENSKETCH_SW_ZIP", str(Path(__file__).parent / "static" / "downloads" / "OpenSketch-SOLIDWORKS.zip")))


@app.get("/api/sw")
def api_sw(request: Request):
    """The Connect AI dialog's SOLIDWORKS tab: this person's key, the server address the add-in needs, whether
    SOLIDWORKS is connected now, and whether the add-in download is on this server."""
    from . import swbridge
    u = _user(request)
    return {"key": swbridge.key_for(u), "server": auth.public_url(dict(request.headers)),
            "status": swbridge.status(u), "download": SW_DOWNLOAD.is_file()}


@app.post("/api/sw/key")
def api_sw_key(request: Request):
    from . import swbridge
    return {"key": swbridge.new_key(_user(request))}


@app.get("/api/sw/download")
def api_sw_download():
    if not SW_DOWNLOAD.is_file():
        raise HTTPException(404, "The SOLIDWORKS add-in is not on this server.")
    return FileResponse(SW_DOWNLOAD, filename="OpenSketch-SOLIDWORKS.zip", media_type="application/zip",
                        headers={"Cache-Control": "no-cache"})


class ReviewRequest(BaseModel):
    doc_id: str
    compare_version: int | None = None
    title: str | None = None
    notes: str | None = None


def _base(request: Request) -> str:
    return auth.public_url({k.lower(): v for k, v in request.headers.items()})


@app.post("/api/reviews")
async def api_review_publish(req: ReviewRequest, request: Request):
    """Publish a review page of a stored document (File > Publish Review)."""
    from . import review
    _doc_meta(req.doc_id, request)
    try:
        return await _cad(_lane(request), cadjobs.review_publish, req.doc_id, req.compare_version, req.title, req.notes,
                          "you", _base(request))
    except cadworker.CadJobError as exc:
        if exc.kind == "NotFound":
            return JSONResponse({"error": "Save the document to the server first (Save it to your Files first: Ctrl+S)."}, status_code=404)
        if exc.kind in ("ReviewError", "AssemblyError", "FeatureError"):
            return JSONResponse({"error": exc.message}, status_code=400)
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None


@app.get("/api/reviews")
def api_review_list(request: Request, doc_id: str | None = None):
    from . import review
    if doc_id is not None:
        _doc_meta(doc_id, request)
    out = []
    for item in review.listing(doc_id, _base(request)):
        try:
            if store.can_see(store.meta(item["doc_id"]), _user(request)):
                out.append(item)
        except store.NotFound:
            if store.can_see({"owner": None}, _user(request)):
                out.append(item)  # its document is gone: the server owner can still see and delete it
    return out


@app.delete("/api/reviews/{token}")
def api_review_delete(token: str, request: Request):
    from . import review
    item = next((i for i in review.listing() if i["token"] == token), None)
    if item is not None:
        try:
            visible = store.can_see(store.meta(item["doc_id"]), _user(request))
        except store.NotFound:
            visible = store.can_see({"owner": None}, _user(request))
        if not visible:
            raise HTTPException(404, "No such review")
    if not review.delete(token):
        raise HTTPException(404, "No such review")
    return {"deleted": token}


_REVIEW_HEADERS = {"Cache-Control": "private, max-age=300", "Referrer-Policy": "no-referrer",
                   "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow", "X-Frame-Options": "SAMEORIGIN"}
_REVIEW_ASSETS = ("css/", "js/", "vendor/")


class CheckRequest(BaseModel):
    doc: dict


@app.post("/api/review/check")
async def api_review_check(req: CheckRequest, request: Request):
    """Motion Review in the app: errors, clashes through each joint's travel, gaps, contacts."""
    from . import review
    try:
        return await _cad(_lane(request), cadjobs.review_checks, req.doc)
    except cadworker.CadJobError as exc:
        if exc.kind in ("ReviewError", "AssemblyError", "FeatureError"):
            return JSONResponse({"error": exc.message}, status_code=400)
        raise HTTPException(500, f"{exc.kind}: {exc.message}") from None


@app.get("/review/{token}/data")
def review_data(token: str):
    """The snapshot the read-only app loads (gzipped JSON)."""
    from . import review
    p = review.data_path(token)
    if p is None:
        raise HTTPException(404, "No such review. It may have been deleted.")
    return FileResponse(p, media_type="application/json", headers={**_REVIEW_HEADERS, "Content-Encoding": "gzip"})


@app.get("/review/{token}")
def review_page(token: str):
    """A published review: the app, read-only, no login (the token is the key), not indexed, no referrer."""
    from . import review
    if review.data_path(token):
        return HTMLResponse(review.viewer_page(token, STATIC), headers=_REVIEW_HEADERS)
    p = review.html_path(token)  # published before the app viewer
    if p is None:
        raise HTTPException(404, "No such review. It may have been deleted.")
    return FileResponse(p, media_type="text/html; charset=utf-8", headers=_REVIEW_HEADERS)


@app.get("/review/{asset:path}")
def review_asset(asset: str):
    """The app's own files for the review viewer (its relative paths resolve under /review/)."""
    if not asset.startswith(_REVIEW_ASSETS):
        raise HTTPException(404)
    p = (STATIC / asset).resolve()
    if not p.is_file() or STATIC.resolve() not in p.parents:
        raise HTTPException(404)
    return FileResponse(p)


# ----------------------------------------------------------------------------- AI apps sign in (OAuth for MCP)
# See mcpauth.py. Metadata, registration, token and revoke are public (PasswordGate lets them through, no cookies,
# CORS open); /oauth/authorize needs the person signed in (the gate sends them to sign-in and back).

OAUTH_CORS = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              "Access-Control-Allow-Headers": "Authorization, Content-Type, MCP-Protocol-Version", "Cache-Control": "no-store"}


def _hdrs(request: Request) -> dict:
    return {k.lower(): v for k, v in request.headers.items()}


async def _body_form(request: Request) -> dict:
    from urllib.parse import parse_qs
    raw = await request.body()
    if len(raw) > 20000:
        return {}
    return {k: v[0] for k, v in parse_qs(raw.decode(errors="ignore")).items()}


@app.get("/.well-known/oauth-protected-resource")
@app.get("/.well-known/oauth-protected-resource/mcp")
def oauth_resource(request: Request):
    from . import mcpauth
    return JSONResponse(mcpauth.protected_resource(_hdrs(request)), headers=OAUTH_CORS)


@app.get("/.well-known/oauth-authorization-server")
@app.get("/.well-known/oauth-authorization-server/mcp")
def oauth_server(request: Request):
    from . import mcpauth
    return JSONResponse(mcpauth.server_metadata(_hdrs(request)), headers=OAUTH_CORS)


@app.options("/.well-known/{rest:path}")
@app.options("/oauth/{rest:path}")
def oauth_preflight(rest: str):
    return Response(status_code=204, headers=OAUTH_CORS)


@app.post("/oauth/register")
async def oauth_register(request: Request):
    from . import mcpauth
    try:
        meta = await request.json()
    except Exception:
        meta = None
    try:
        out = await run_in_threadpool(mcpauth.register, meta, auth._client(request.scope))
    except mcpauth.OAuthError as e:
        return JSONResponse(e.body(), status_code=e.status, headers=OAUTH_CORS)
    return JSONResponse(out, status_code=201, headers=OAUTH_CORS)


@app.post("/oauth/token")
async def oauth_token(request: Request):
    from . import mcpauth
    form = await _body_form(request)
    try:
        out = await run_in_threadpool(mcpauth.token, form, request.headers.get("authorization", ""))
    except mcpauth.OAuthError as e:
        extra = {"WWW-Authenticate": 'Basic realm="OpenSketch"'} if e.status == 401 else {}
        return JSONResponse(e.body(), status_code=e.status, headers={**OAUTH_CORS, **extra})
    return JSONResponse(out, headers={**OAUTH_CORS, "Pragma": "no-cache"})


@app.post("/oauth/revoke")
async def oauth_revoke(request: Request):
    from . import mcpauth
    form = await _body_form(request)
    try:
        await run_in_threadpool(mcpauth.revoke, form, request.headers.get("authorization", ""))
    except mcpauth.OAuthError as e:
        return JSONResponse(e.body(), status_code=e.status, headers=OAUTH_CORS)
    return JSONResponse({}, headers=OAUTH_CORS)


def _auth_html(body: bytes, status: int = 200) -> Response:
    return Response(body, status_code=status, headers={k.decode(): v.decode() for k, v in auth.HTML})


@app.get("/oauth/authorize")
def oauth_authorize(request: Request):
    """The consent page an AI app sends the person to (after sign-in, which the gate handles)."""
    from fastapi.responses import RedirectResponse
    from . import mcpauth
    h = _hdrs(request)
    try:
        rec, req = mcpauth.check_authorize(dict(request.query_params), h)
    except mcpauth.RedirectError as e:
        return RedirectResponse(e.location, status_code=302)
    except mcpauth.OAuthError as e:
        return _auth_html(auth.oauth_problem_page(e.description), 400)
    u = _user(request)
    uid = u["id"] if u else "local"
    return _auth_html(auth.consent_page(rec["name"], req["redirect_uri"], u, mcpauth.sign_request(req, uid),
                                        rec.get("host", "") if rec.get("cimd") else ""))


@app.post("/oauth/authorize")
async def oauth_decide(request: Request):
    from fastapi.responses import RedirectResponse
    from . import mcpauth
    form = await _body_form(request)
    u = _user(request)
    uid = u["id"] if u else "local"
    req = mcpauth.read_request(form.get("req", ""), uid)
    if req is None or mcpauth.client(req["client_id"]) is None:
        return _auth_html(auth.oauth_problem_page("This page has expired. Start connecting again from your AI app."), 400)
    iss = mcpauth.base_url(_hdrs(request))
    if form.get("action") == "deny":
        return RedirectResponse(mcpauth.with_query(req["redirect_uri"], error="access_denied", state=req["state"] or None,
                                                   iss=iss), status_code=303)
    code = await run_in_threadpool(mcpauth.issue_code, req, uid)
    return RedirectResponse(mcpauth.with_query(req["redirect_uri"], code=code, state=req["state"] or None, iss=iss),
                            status_code=303)


@app.get("/api/account/apps")
def api_apps(request: Request):
    """AI apps this person connected by signing in (Account settings > Connected AI apps)."""
    from . import mcpauth
    u = _user(request)
    return {"apps": mcpauth.grants_for(u["id"] if u else "local")}


@app.delete("/api/account/apps/{grant_id}")
def api_app_disconnect(grant_id: str, request: Request):
    from . import mcpauth
    u = _user(request)
    if not mcpauth.drop_grant(u["id"] if u else "local", grant_id):
        raise HTTPException(404, "No such connection")
    return {"apps": mcpauth.grants_for(u["id"] if u else "local")}


# MCP (Streamable HTTP): /mcp takes a Bearer token from the sign-in above; /mcp/<key> is the older private
# address (the key in the path). Routed before the static files.
app.router.routes.append(Route("/mcp", endpoint=mcp_server.bearer_app(), methods=["GET", "POST", "DELETE", "OPTIONS"]))
app.router.routes.append(Route("/mcp/", endpoint=mcp_server.bearer_app(), methods=["GET", "POST", "DELETE", "OPTIONS"]))
app.router.routes.append(Route("/mcp/{token}", endpoint=mcp_server.http_app(), methods=["GET", "POST", "DELETE"]))
app.router.routes.append(Route("/mcp/{token}/", endpoint=mcp_server.http_app(), methods=["GET", "POST", "DELETE"]))


# ----------------------------------------------------------------------------- installable app (PWA)

NO_CACHE = {"Cache-Control": "no-cache"}


def _shell_assets() -> list[str]:
    """The files the page needs to start, fetched by the service worker when it installs."""
    out = ["/css/app.css", "/css/linear.css", "/css/brand.css", "/vendor/three.module.js", "/favicon.svg",
           "/manifest.webmanifest", "/icons/icon-192.png"]
    out += sorted("/" + p.relative_to(STATIC).as_posix() for p in (STATIC / "js").rglob("*.js"))
    return out


@app.get("/sw.js")
def service_worker():
    src = (Path(__file__).parent / "sw.js").read_text()
    src = src.replace("__VERSION__", VERSION).replace("__ASSETS__", json.dumps(_shell_assets()))
    return Response(src, media_type="application/javascript",
                    headers={**NO_CACHE, "Service-Worker-Allowed": "/"})


@app.get("/manifest.webmanifest")
def manifest():
    return FileResponse(STATIC / "manifest.webmanifest", media_type="application/manifest+json", headers=NO_CACHE)


@app.get("/")
def index():
    # the page knows its own version, so a tab opened from the service worker's copy sees it is out of date
    page = (STATIC / "index.html").read_text().replace("__VERSION__", VERSION, 1)
    return HTMLResponse(page, headers=NO_CACHE)


class AppFiles(StaticFiles):
    """The app's files, revalidated on every load (an ETag check, usually a 304), so a deploy is picked up
    at once instead of after a browser's guessed cache lifetime."""

    async def get_response(self, path, scope):
        res = await super().get_response(path, scope)
        if res.status_code in (200, 304):
            res.headers["Cache-Control"] = "public, max-age=604800" if path.startswith("icons/") else "no-cache"
        return res


app.mount("/", AppFiles(directory=STATIC), name="static")
