"""FastAPI server: serves the SOLIDWORKS-style web UI and the build123d regen API."""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from . import ai, geometry

STATIC = Path(__file__).parent / "static"

app = FastAPI(title="OpenSketch")


class RegenRequest(BaseModel):
    doc: dict
    preview: dict | None = None


class AIRequest(BaseModel):
    doc: dict
    prompt: str
    conversation: str | None = None


@app.post("/api/regen")
def api_regen(req: RegenRequest):
    return geometry.regen_result(req.doc, req.preview)


@app.post("/api/mass")
def api_mass(req: RegenRequest):
    return geometry.mass_properties(req.doc)


@app.post("/api/export/{fmt}")
def api_export(fmt: str, req: RegenRequest):
    if fmt not in ("step", "stl"):
        raise HTTPException(400, "Format must be step or stl")
    fd, path = tempfile.mkstemp(suffix=f".{fmt}")
    os.close(fd)
    try:
        geometry.export(req.doc, fmt, path)
    except geometry.FeatureError as exc:
        raise HTTPException(400, str(exc)) from exc
    name = (req.doc.get("name") or "Part1") + (".step" if fmt == "step" else ".stl")
    return FileResponse(path, filename=name, media_type="application/octet-stream")


@app.post("/api/ai")
def api_ai(req: AIRequest):
    try:
        return ai.run(req.doc, req.prompt, req.conversation)
    except ai.AIUnavailable as exc:
        return JSONResponse({"error": str(exc)}, status_code=503)


@app.get("/api/ai/status")
def api_ai_status():
    return {"available": ai.available()}


@app.get("/")
def index():
    return FileResponse(STATIC / "index.html")


app.mount("/", StaticFiles(directory=STATIC), name="static")
