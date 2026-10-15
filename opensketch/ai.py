"""OpenSketch AI: text-to-CAD on the same feature tree the user edits by hand.

Claude proposes features (sketches with constraints, extrudes, fillets...) through the
`propose_features` tool. Each proposal is rebuilt with build123d and the rebuild status
goes back to Claude so it can fix errors. The UI shows the final proposal for
Accept / Reject, like a code diff in Cursor.
"""

from __future__ import annotations

import copy
import json
import uuid

from . import geometry

MODEL = "claude-opus-5-5"
MAX_ROUNDS = 6

_conversations: dict[str, list] = {}


class AIUnavailable(Exception):
    pass


def available() -> bool:
    try:
        import anthropic  # noqa: F401
    except ImportError:
        return False
    import os
    return bool(os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN"))


SYSTEM = """You are the design copilot inside OpenSketch, a parametric CAD app that works like SOLIDWORKS.
You build and edit a part by proposing features for its FeatureManager tree. Units are millimetres
and degrees. Y is up (SOLIDWORKS convention).

Document: {"name", "features": [...]}. Features rebuild in order. Every feature has a unique
"id" and a SOLIDWORKS-style "name" (Sketch1, Boss-Extrude1, Cut-Extrude1, Fillet1, ...).

Planes: {"ref": "Front Plane"} (XY, normal +Z), {"ref": "Top Plane"} (XZ, normal +Y, sketch y = world -Z),
{"ref": "Right Plane"} (YZ, normal +X, sketch x = world -Z), {"ref": "<plane or sketch feature id>"},
or a planar face {"type": "face", "origin": [x,y,z], "normal": [x,y,z], "xdir": [x,y,z]}.

Feature types:
- sketch: {"type":"sketch","plane":<plane>,"entities":[...],"constraints":[...]}
  entities (2D sketch coordinates):
    {"id","type":"point","x","y"}  ("origin" is the fixed sketch origin point id)
    {"id","type":"line","p1":<point id>,"p2":<point id>,"construction":false}
    {"id","type":"circle","center":<point id>,"r"}
    {"id","type":"arc","center","start","end"}  (counter-clockwise from start to end; start and end at equal radius)
  Lines that share a point id are connected. Profiles must be closed loops; inner loops become holes.
  Use "construction": true for centerlines (revolve axes, symmetry).
  constraints (make sketches fully defined, like a good SOLIDWORKS user):
    {"id","type":"horizontal"|"vertical","refs":[line]}
    {"id","type":"coincident","refs":[point, point|line|circle]}
    {"id","type":"parallel"|"perpendicular"|"equal"|"collinear","refs":[a,b]}
    {"id","type":"tangent","refs":[line|arc|circle, arc|circle]}
    {"id","type":"concentric","refs":[circle|arc, circle|arc]}
    {"id","type":"midpoint","refs":[point, line]}
    {"id","type":"symmetric","refs":[point, point, centerline]}
    {"id","type":"fix","refs":[point]}
    dimensions: {"id","type":"distance","refs":[a,b],"value","orient":"aligned"|"horizontal"|"vertical"}
    (a line alone = its length), {"id","type":"diameter"|"radius","refs":[circle|arc],"value"},
    {"id","type":"angle","refs":[line,line],"value"}. Give dimensions a "name" like "D1".
- plane: {"type":"plane","base":<plane>,"offset":mm}
- extrude: {"type":"extrude","sketch":<sketch id>,"op":"boss"|"cut","end":"blind"|"through_all"|"midplane"|"up_to_next",
  "depth":mm,"reverse":bool,"draft":deg,"dir2":{"end","depth"} or null}. Boss extrudes along the sketch
  plane normal; use "reverse": true for the other way. A cut sketched on a top face needs "reverse": true
  to go into the material.
- revolve: {"type":"revolve","sketch","axis":<line id in that sketch>,"angle":deg,"op":"boss"|"cut"}
- fillet: {"type":"fillet","radius","edges":[{"mid":[x,y,z]}]} (edge picked by its midpoint, world coordinates)
- chamfer: {"type":"chamfer","distance","edges":[...]}
- shell: {"type":"shell","thickness","faces":[{"center":[x,y,z],"normal":[x,y,z]}]} (faces removed)
- mirror: {"type":"mirror","plane":<plane>,"features":[ids]} (omit features to mirror the body)
- linear_pattern: {"type":"linear_pattern","features":[ids],"direction":"X"|"Y"|"Z","count","spacing"}
- circular_pattern: {"type":"circular_pattern","features":[ids],"axis":"X"|"Y"|"Z","count","angle":360}

Point coordinates must already satisfy the constraints (the app re-solves them, but start close).
Call propose_features with the complete new feature list (mode "replace") or only the new features
(mode "append"). You get the rebuild result back; fix any errors and propose again. When the
rebuild is clean, reply with one or two short sentences about what you built."""

TOOLS = [{
    "name": "propose_features",
    "description": ("Propose features for the part. The proposal is rebuilt with build123d and the "
                    "rebuild status (per feature, bounding box, volume) is returned."),
    "input_schema": {
        "type": "object",
        "properties": {
            "mode": {"type": "string", "enum": ["append", "replace"]},
            "features": {"type": "array", "items": {"type": "object"}},
            "summary": {"type": "string", "description": "One line describing the change."},
        },
        "required": ["mode", "features", "summary"],
    },
}]


def _apply(doc: dict, inp: dict) -> dict:
    new = copy.deepcopy(doc)
    feats = inp.get("features") or []
    if inp.get("mode") == "replace":
        new["features"] = feats
    else:
        new["features"] = new.get("features", []) + feats
    new.pop("rollback", None)
    return new


def _rebuild_report(doc: dict) -> tuple[str, bool]:
    st, _ = geometry.regen(doc)
    errors = [s for s in st.status if s["state"] in ("error", "warning")]
    rep = {"status": st.status}
    if st.part is not None:
        bb = st.part.bounding_box()
        rep["bbox_min"] = geometry.vlist(bb.min)
        rep["bbox_max"] = geometry.vlist(bb.max)
        rep["volume"] = round(st.part.volume, 3)
        rep["bodies"] = len(st.part.solids())
    else:
        rep["body"] = "none"
    return json.dumps(rep), not errors


def run(doc: dict, prompt: str, history_id: str | None = None) -> dict:
    if not available():
        raise AIUnavailable("Set ANTHROPIC_API_KEY to use OpenSketch AI.")
    import anthropic

    client = anthropic.Anthropic()
    conv_id = history_id if isinstance(history_id, str) and history_id in _conversations else str(uuid.uuid4())
    messages = _conversations.setdefault(conv_id, [])
    messages.append({"role": "user", "content": (
        f"Current document:\n```json\n{json.dumps(doc)}\n```\n\nRequest: {prompt}")})
    proposal, summary, steps = None, "", []
    for _ in range(MAX_ROUNDS):
        try:
            resp = client.beta.messages.create(
                model=MODEL,
                max_tokens=16000,
                system=SYSTEM,
                tools=TOOLS,
                messages=messages,
                output_config={"effort": "high"},
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",
            )
        except anthropic.APIConnectionError as exc:
            raise AIUnavailable(f"Network error: {exc}") from exc
        except anthropic.APIStatusError as exc:
            raise AIUnavailable(f"API error {exc.status_code}: {exc.message}") from exc
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason == "refusal":
            return {"conversation": conv_id, "reply": "The request was declined.", "proposal": None, "steps": steps}
        uses = [b for b in resp.content if b.type == "tool_use"]
        if not uses:
            text = "".join(b.text for b in resp.content if b.type == "text").strip()
            return {"conversation": conv_id, "reply": text or summary, "proposal": proposal,
                    "summary": summary, "steps": steps}
        results = []
        for u in uses:
            base = proposal if proposal is not None else doc
            try:
                cand = _apply(base, u.input)
                report, clean = _rebuild_report(cand)
                proposal, summary = cand, u.input.get("summary", "")
                steps.append({"summary": summary, "clean": clean})
                results.append({"type": "tool_result", "tool_use_id": u.id, "content": report})
            except Exception as exc:  # malformed features
                results.append({"type": "tool_result", "tool_use_id": u.id, "is_error": True,
                                "content": f"Could not apply proposal: {exc}"})
        messages.append({"role": "user", "content": results})
    return {"conversation": conv_id, "reply": summary or "Stopped after several attempts.",
            "proposal": proposal, "summary": summary, "steps": steps}
