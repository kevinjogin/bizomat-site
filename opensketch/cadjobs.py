"""The CAD work behind the browser's requests, as plain functions that run in a worker process (cadworker.py).
Each takes and returns plain data (dicts, lists, bytes) so it can cross the process boundary."""

from __future__ import annotations

import json

from . import assembly, geometry, importer


def _json_default(o):
    if isinstance(o, (set, frozenset, tuple)):
        return list(o)
    if hasattr(o, "tolist"):  # numpy numbers and arrays
        return o.tolist()
    raise TypeError(f"{type(o).__name__} is not JSON serialisable")


def to_json(obj) -> bytes:
    return json.dumps(obj, separators=(",", ":"), allow_nan=False, default=_json_default).encode("utf-8")


def json_of(name: str, *args, **kwargs) -> bytes:
    """One of this module's functions with its answer already as JSON bytes. Meshes are big: encoding them here,
    in the worker, keeps the web server's event loop free (json.dumps of a 10 MB mesh holds the GIL for ~0.5 s,
    and unpickling the same mesh as Python lists costs as much again), and bytes cross over as one copy."""
    return to_json(globals()[name](*args, **kwargs))


def regen(doc: dict, preview: dict | None = None, known: dict | None = None, drag: dict | None = None) -> dict:
    if assembly.is_assembly(doc):
        return assembly.regen_assembly(doc, known, drag=drag)
    return geometry.regen_result(doc, preview)


def params(doc: dict, expression: str | None = None) -> dict:
    """Equations dialog. With `expression`: its value, or {"__error__": message}."""
    from . import params as P
    if expression is not None:
        values, _ = P.variables(doc)
        try:
            return {"value": P.evaluate_expr(expression, values)}
        except P.ExprError as exc:
            return {"__error__": str(exc)}
    new, rep = P.evaluate(doc)
    return {"parameters": P.table(new), "equations": P.equations(new), "problems": rep["problems"],
            "recomputed": rep["recomputed"], "features": new.get("features", [])}


def name_refs(doc: dict, feature: dict) -> dict:
    from . import naming
    return naming.annotate(doc, feature)


def face_owner(doc: dict, center, normal=None) -> dict:
    from . import naming
    return naming.face_owner(doc, center, normal)


def delete_plan(doc: dict, ids: list[str], delete_absorbed: bool = True) -> dict:
    from . import edits
    return edits.plan_delete(doc, ids, delete_absorbed)


def mass(doc: dict) -> dict:
    return assembly.mass_properties(doc) if assembly.is_assembly(doc) else geometry.mass_properties(doc)


def interference(doc: dict) -> dict:
    return assembly.interference(doc)


def export(doc: dict, fmt: str, path: str) -> None:
    if assembly.is_assembly(doc):
        assembly.export(doc, fmt, path)
    else:
        geometry.export(doc, fmt, path)


def import_file(raw: bytes, filename: str) -> dict:
    return importer.import_file(raw, filename)


def toolbox_part(kind: str, args: dict) -> dict:
    """A Toolbox part document; ValueError with a plain reason when the size does not make a solid."""
    doc = importer.standard_part_doc(kind, **args)
    st, _ = geometry.regen(doc)
    bad = next((s for s in st.status if s.get("state") == "error"), None)
    if bad or st.part is None:
        raise ValueError(bad.get("message") if bad else "The selected size did not produce a solid body")
    return doc


def thumb_png(doc: dict) -> bytes:
    from . import preview
    return preview.render_preview(doc, "isometric", 480, 360, transparent=True)


def review_checks(doc: dict) -> dict:
    from . import review
    return review.checks(doc)


def review_publish(doc_id, compare_version, title, notes, by, base) -> dict:
    from . import review
    return review.publish(doc_id, compare_version, title, notes, by, base)


def ai_stream(doc: dict, prompt: str, conv_id: str | None, history: list | None, demo, selection, ai_config,
              progress=None, stop=None, lost: bool = False) -> dict:
    """The in-app AI chat (ai.run_stream) in a process of its own (cadworker.start_job): each event goes out
    through progress(line), already a line of JSON; the conversation's history comes in and goes back, because
    the server keeps it. `lost`: the browser named a conversation the server no longer has (it restarted), so the
    start event says resumed: false and the chat tells the person. `stop` also ends a feature recognition the AI
    started (it can run for minutes without an event)."""
    import pickle
    from . import ai
    if conv_id and history is not None:
        ai._conversations[conv_id] = history
    used = None
    gen = ai.run_stream(doc, prompt, conv_id, demo=demo, selection=selection, ai_config=ai_config, stop=stop)
    try:
        for ev in gen:
            used = ev.get("conversation") or used
            if lost and ev.get("ev") == "start":
                ev = dict(ev, resumed=False)
            if progress:
                progress(to_json(ev).decode("utf-8") + "\n")
            if stop and stop():
                break
    finally:
        gen.close()
    hist = ai._conversations.get(used) if used else None
    try:
        pickle.dumps(hist)
    except Exception:  # never lose the reply over history that cannot travel back
        hist = None
    return {"conversation": used, "history": hist}
