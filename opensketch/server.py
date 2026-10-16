"""FastAPI server: serves the SOLIDWORKS-style web UI, the build123d regen API for parts and
assemblies, and the streaming AI endpoint."""

from __future__ import annotations

import json
import math
import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from starlette.background import BackgroundTask
from pydantic import BaseModel

import base64
import binascii
import gzip
import zlib
import threading
import time
import uuid

from . import ai, assembly, geometry, importer, sldexport

STATIC = Path(__file__).parent / "static"

app = FastAPI(title="OpenSketch")


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
        return {"doc": importer.import_step(raw, filename)}
    except importer.ImportError_ as exc:
        return JSONResponse({"error": str(exc)}, status_code=422)
    except Exception as exc:  # anything else the reader or the assembly step throws
        return JSONResponse({"error": f"Could not import {filename}: {str(exc).strip() or type(exc).__name__}"}, status_code=422)


@app.post("/api/import")
def api_import(req: ImportRequest):
    """STEP -> part or assembly document (base64 in JSON; kept for old clients and scripts)."""
    try:
        raw = base64.b64decode(req.data, validate=True)
    except (binascii.Error, ValueError):
        return JSONResponse({"error": "The upload is not valid base64. Try uploading the file again."}, status_code=400)
    return _import_reply(raw, req.filename)


@app.post("/api/import/raw")
async def api_import_raw(request: Request, filename: str = "model.step"):
    """STEP -> part or assembly document. The body is the file's bytes, gzipped by the browser when
    the X-OpenSketch-Gzip header is 1 (a 14 MB STEP becomes ~3 MB, small enough for the Codespaces tunnel)."""
    body = await request.body()
    if request.headers.get("x-opensketch-gzip") == "1":
        try:
            body = gzip.decompress(body)
        except (OSError, EOFError, zlib.error):
            return JSONResponse({"error": "The upload arrived damaged. Try again."}, status_code=400)
    return await run_in_threadpool(_import_reply, body, filename)


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
        if req.length is not None and (not math.isfinite(req.length) or req.length <= 0):
            raise HTTPException(400, "Length must be greater than 0")
        args["length"] = req.length if req.length is not None else 10
    doc = importer.standard_part_doc(req.kind, **args)
    try:
        st, _ = geometry.regen(doc)
        bad = next((s for s in st.status if s.get("state") == "error"), None)
        if bad or st.part is None:
            raise ValueError(bad.get("message") if bad else "The selected size did not produce a solid body")
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
        Path(path).unlink(missing_ok=True)
        raise HTTPException(400, str(exc)) from exc
    except Exception:
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
        old = _macro_jobs[k]
        if old["state"] != "running":
            _macro_jobs.pop(k, None)
            Path(old["zip"]).unlink(missing_ok=True)

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


@app.get("/api/ai/status")
def api_ai_status():
    return {"available": ai.available() or ai.demo_enabled(), "demo": ai.demo_enabled()}


@app.get("/")
def index():
    return FileResponse(STATIC / "index.html")


app.mount("/", StaticFiles(directory=STATIC), name="static")
