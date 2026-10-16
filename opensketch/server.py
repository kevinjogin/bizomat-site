"""FastAPI server: serves the SOLIDWORKS-style web UI, the build123d regen API for parts and
assemblies, the streaming AI endpoint, documents stored on the server (shared with Claude through the
MCP endpoint at /mcp/<token>), and the optional password (OPENSKETCH_PASSWORD)."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import base64
import gzip
import threading
import time
import uuid

from contextlib import asynccontextmanager

from starlette.routing import Route

from . import ai, artifacts, assembly, auth, features, geometry, importer, mcp_server, sldexport, store

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
    async with mcp_server.lifespan_context():
        yield


app = FastAPI(title="OpenSketch", lifespan=lifespan)
app.add_middleware(auth.PasswordGate)


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


@app.post("/api/regen")
def api_regen(req: RegenRequest):
    if assembly.is_assembly(req.doc):
        return assembly.regen_assembly(req.doc, req.known, drag=req.drag)
    return geometry.regen_result(req.doc, req.preview)


class ParamsRequest(BaseModel):
    doc: dict
    expression: str | None = None


@app.post("/api/params")
def api_params(req: ParamsRequest):
    """Equations dialog: variables with values and problems, every equation, and the part with the numbers the
    equations give (sketches re-solved). With `expression`: its value, or an error."""
    from . import params
    if req.expression is not None:
        values, _ = params.variables(req.doc)
        try:
            return {"value": params.evaluate_expr(req.expression, values)}
        except params.ExprError as exc:
            return JSONResponse({"error": str(exc)}, status_code=400)
    new, rep = params.evaluate(req.doc)
    return {"parameters": params.table(new), "equations": params.equations(new), "problems": rep["problems"],
            "recomputed": rep["recomputed"], "features": new.get("features", [])}


class DeletePlanRequest(BaseModel):
    doc: dict
    features: list[str]
    delete_absorbed: bool = True


@app.post("/api/delete_plan")
def api_delete_plan(req: DeletePlanRequest):
    """What deleting these part features takes with it and breaks (edits.plan_delete), plus the new part."""
    from . import edits
    plan = edits.plan_delete(req.doc, req.features, req.delete_absorbed)
    if "error" in plan:
        return JSONResponse({"error": plan["error"]}, status_code=400)
    return plan


@app.post("/api/mass")
def api_mass(req: RegenRequest):
    if assembly.is_assembly(req.doc):
        return assembly.mass_properties(req.doc)
    return geometry.mass_properties(req.doc)


@app.post("/api/interference")
def api_interference(req: RegenRequest):
    if not assembly.is_assembly(req.doc):
        raise HTTPException(400, "Interference Detection works on assemblies")
    return assembly.interference(req.doc)


class ImportRequest(BaseModel):
    filename: str
    data: str  # base64 file content


def _import_reply(raw: bytes, filename: str):
    """Every failure comes back as JSON {error} with a readable message, never a bare 500."""
    try:
        return {"doc": importer.import_file(raw, filename)}
    except importer.ImportError_ as exc:
        return JSONResponse({"error": str(exc)}, status_code=422)
    except Exception as exc:  # anything else the reader or the assembly step throws
        return JSONResponse({"error": f"Could not import {filename}: {str(exc).strip() or type(exc).__name__}"}, status_code=422)


@app.post("/api/import")
def api_import(req: ImportRequest):
    """STEP -> part or assembly document (base64 in JSON; kept for old clients and scripts)."""
    return _import_reply(base64.b64decode(req.data), req.filename)


@app.post("/api/import/raw")
async def api_import_raw(request: Request, filename: str = "model.step"):
    """STEP -> part or assembly document. The body is the file's bytes, gzipped by the browser when
    the X-OpenSketch-Gzip header is 1 (a 14 MB STEP becomes ~3 MB, small enough for the Codespaces tunnel)."""
    body = await request.body()
    if request.headers.get("x-opensketch-gzip") == "1":
        try:
            body = gzip.decompress(body)
        except OSError:
            return JSONResponse({"error": "The upload arrived damaged. Try again."}, status_code=400)
    return await run_in_threadpool(_import_reply, body, filename)


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
def api_toolbox_part(req: ToolboxRequest):
    if req.kind not in importer.STANDARD:
        raise HTTPException(400, "Unknown kind")
    args = {"size": req.size}
    if "length" in importer.STANDARD[req.kind][2]:
        args["length"] = req.length or 10
    doc = importer.standard_part_doc(req.kind, **args)
    try:
        geometry.regen(doc)
    except Exception as exc:  # bad size
        raise HTTPException(400, str(exc)) from exc
    return {"doc": doc}


@app.post("/api/export/{fmt}")
def api_export(fmt: str, req: RegenRequest):
    if fmt not in ("step", "stl"):
        raise HTTPException(400, "Format must be step or stl")
    fd, path = tempfile.mkstemp(suffix=f".{fmt}")
    os.close(fd)
    try:
        if assembly.is_assembly(req.doc):
            assembly.export(req.doc, fmt, path)
        else:
            geometry.export(req.doc, fmt, path)
    except (geometry.FeatureError, assembly.AssemblyError) as exc:
        raise HTTPException(400, str(exc)) from exc
    name = (req.doc.get("name") or ("Assem1" if assembly.is_assembly(req.doc) else "Part1")) + (".step" if fmt == "step" else ".stl")
    return FileResponse(path, filename=name, media_type="application/octet-stream")


class MacroRequest(BaseModel):
    doc: dict
    verify: bool = True
    name: str | None = None


_macro_jobs: dict = {}


@app.get("/api/export/sldmacro/toolchain")
def api_macro_toolchain():
    tc = sldexport.toolchain()
    return {"features": tc["ok"], "have": tc["have"], "missing": tc["missing"]}


@app.post("/api/export/sldmacro/start")
def api_macro_start(req: MacroRequest):
    """Start writing a SOLIDWORKS macro (a background job: checking the macro takes a minute or more)."""
    jid = uuid.uuid4().hex[:12]
    fd, path = tempfile.mkstemp(suffix=".zip")
    os.close(fd)
    job = {"state": "running", "log": [], "report": None, "zip": path, "started": time.time(),
           "name": (req.name or req.doc.get("name") or "OpenSketch")}
    _macro_jobs[jid] = job
    for k in [k for k, v in _macro_jobs.items() if time.time() - v["started"] > 6 * 3600]:
        _macro_jobs.pop(k, None)

    def work():
        try:
            job["report"] = sldexport.export(req.doc, path, name=req.name, verify=req.verify, log=job["log"].append)
            job["state"] = "done"
        except Exception as exc:
            job["state"] = "error"
            job["error"] = f"{type(exc).__name__}: {exc}"
    threading.Thread(target=work, daemon=True).start()
    return {"job": jid}


@app.get("/api/export/sldmacro/{jid}")
def api_macro_status(jid: str):
    job = _macro_jobs.get(jid)
    if job is None:
        raise HTTPException(404, "No such export")
    return {k: job.get(k) for k in ("state", "log", "report", "error")} | {"seconds": round(time.time() - job["started"])}


@app.get("/api/export/sldmacro/{jid}/zip")
def api_macro_zip(jid: str):
    job = _macro_jobs.get(jid)
    if job is None or job["state"] != "done":
        raise HTTPException(404, "Not ready")
    name = "".join(c if c.isalnum() or c in "-_" else "_" for c in job["name"]) or "OpenSketch"
    return FileResponse(job["zip"], filename=f"{name}_SOLIDWORKS_macro.zip", media_type="application/zip")


@app.post("/api/ai")
def api_ai(req: AIRequest):
    try:
        return ai.run(req.doc, req.prompt, req.conversation)
    except ai.AIUnavailable as exc:
        return JSONResponse({"error": str(exc)}, status_code=503)


@app.post("/api/ai/stream")
def api_ai_stream(req: AIRequest):
    """Newline-delimited JSON events while the AI designs (see ai.run_stream)."""
    def gen():
        try:
            for ev in ai.run_stream(req.doc, req.prompt, req.conversation, demo=req.demo):
                yield json.dumps(ev, separators=(",", ":")) + "\n"
        except Exception as exc:  # never leave the client hanging
            yield json.dumps({"ev": "error", "message": f"Server error: {exc}"}) + "\n"
    return StreamingResponse(gen(), media_type="application/x-ndjson", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.get("/api/version")
def api_version():
    """The running version; the page polls it to offer a reload after the codespace updates itself."""
    try:
        note = UPDATE_NOTE.read_text().strip()
    except OSError:
        note = ""
    return {"version": VERSION, "note": note}


@app.get("/api/ai/status")
def api_ai_status():
    return {"available": ai.available() or ai.demo_enabled(), "demo": ai.demo_enabled()}


# ----------------------------------------------------------------------------- server documents

class DocCreate(BaseModel):
    name: str = "Untitled"
    doc: dict | None = None
    kind: str = "part"


class DocSave(BaseModel):
    doc: dict
    base_version: int | None = None
    summary: str = ""
    requests: list | None = None


def _found(fn, *a, **k):
    try:
        return fn(*a, **k)
    except store.NotFound:
        raise HTTPException(404, "No such document") from None


@app.get("/api/docs")
def api_docs():
    return store.listing()


@app.post("/api/docs")
def api_doc_create(req: DocCreate):
    return store.create(req.name, req.doc, req.kind if req.kind in ("part", "assembly") else "part", by="you")


@app.get("/api/docs/{doc_id}")
def api_doc(doc_id: str):
    return _found(store.get, doc_id)


@app.get("/api/docs/{doc_id}/head")
def api_doc_head(doc_id: str):
    """Polled by the browser to follow changes (small)."""
    return _found(store.head, doc_id)


@app.put("/api/docs/{doc_id}")
def api_doc_save(doc_id: str, req: DocSave):
    try:
        return store.save(doc_id, req.doc, "you", req.summary or "Edited in OpenSketch", req.base_version, req.requests)
    except store.NotFound:
        raise HTTPException(404, "No such document") from None
    except store.Conflict as c:
        return JSONResponse({"error": "conflict", "current": c.current}, status_code=409)


@app.get("/api/connect")
def api_connect(request: Request):
    """What the Connect Claude dialog shows."""
    base = auth.public_url(dict(request.headers))
    return {"mcp_url": f"{base}/mcp/{auth.mcp_token()}", "password_set": bool(auth.password()),
            "codespace": bool(os.environ.get("CODESPACE_NAME")), "app_url": base}


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


# MCP (Streamable HTTP): the token in the path is the key; routed before the static files.
app.router.routes.append(Route("/mcp/{token}", endpoint=mcp_server.http_app(), methods=["GET", "POST", "DELETE"]))
app.router.routes.append(Route("/mcp/{token}/", endpoint=mcp_server.http_app(), methods=["GET", "POST", "DELETE"]))


@app.get("/")
def index():
    return FileResponse(STATIC / "index.html")


app.mount("/", StaticFiles(directory=STATIC), name="static")
