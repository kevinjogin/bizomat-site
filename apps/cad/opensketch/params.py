"""Global variables and equations, as in SOLIDWORKS Tools > Equations.

Document format (docs/DOCUMENT.md, "Parameters and equations"):
- part["parameters"] = [{"name": "wall", "expression": "2", "unit": "mm", "comment": "2 to 4"}, ...]
  (global variables; an expression may use other variables).
- feature["eq"] = {"depth": "wall * 5", "dir2.depth": "height - 2"}: an equation drives that field.
- a sketch dimension {"type": "distance", "value": 40, "eq": "width"}: an equation drives that dimension.

Every driven field keeps its current number, so the sketch solver and older documents read the
document as before; `evaluate` recomputes the numbers from the equations (re-solving a sketch whose
dimension changed with the sketch solver) and says what changed and what could not be computed.

Expressions: numbers, + - * / ^ (or **) %, parentheses, variable names, pi, abs min max sqrt round floor
ceil, sin cos tan asin acos atan atan2 in degrees, and unit suffixes mm cm m in deg rad (lengths become mm,
angles degrees). Nothing else is evaluated (no attribute access, no calls but these).

Idea from SolidCraft (bherbruck/solidcraft): named parameters with units, expressions in any numeric field.
"""

from __future__ import annotations

import ast
import copy
import json
import math
import operator
import re
from collections import OrderedDict

NAME = re.compile(r"[A-Za-z_][A-Za-z0-9_]*$")
UNITS = {"mm": 1.0, "cm": 10.0, "m": 1000.0, "in": 25.4, "deg": 1.0, "rad": 180.0 / math.pi}
_UNIT_RE = re.compile(r"(\d+(?:\.\d*)?(?:[eE][-+]?\d+)?|\.\d+)\s*(mm|cm|m|in|deg|rad)\b")
_D = math.radians
FUNCS = {
    "abs": abs, "min": min, "max": max, "sqrt": math.sqrt, "round": round, "floor": math.floor, "ceil": math.ceil,
    "sin": lambda x: math.sin(_D(x)), "cos": lambda x: math.cos(_D(x)), "tan": lambda x: math.tan(_D(x)),
    "asin": lambda x: math.degrees(math.asin(x)), "acos": lambda x: math.degrees(math.acos(x)),
    "atan": lambda x: math.degrees(math.atan(x)), "atan2": lambda y, x: math.degrees(math.atan2(y, x)),
}
CONSTS = {"pi": math.pi}
BINOPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv,
          ast.Pow: operator.pow, ast.Mod: operator.mod}
RESERVED = set(FUNCS) | set(CONSTS) | set(UNITS)
DIMENSIONS = ("distance", "diameter", "radius", "angle")


class ExprError(Exception):
    pass


def _prepare(expr) -> str:
    if isinstance(expr, (int, float)) and not isinstance(expr, bool):
        return repr(float(expr))
    if not isinstance(expr, str) or not expr.strip():
        raise ExprError("Empty expression.")
    s = expr.strip()
    if s.startswith("="):
        s = s[1:].strip()
    if len(s) > 500:
        raise ExprError("Expression is too long.")
    s = s.replace("^", "**")
    return _UNIT_RE.sub(lambda m: f"({m.group(1)}*{UNITS[m.group(2)]!r})", s)


def names_in(expr) -> set[str]:
    try:
        tree = ast.parse(_prepare(expr), mode="eval")
    except (SyntaxError, ExprError):
        return set()
    return {n.id for n in ast.walk(tree) if isinstance(n, ast.Name) and n.id not in FUNCS and n.id not in CONSTS}


def evaluate_expr(expr, values: dict[str, float]) -> float:
    """Evaluate one expression with the given variable values. Every failure is an ExprError with plain
    words, so a bad expression turns its feature red instead of failing the whole rebuild."""
    try:
        tree = ast.parse(_prepare(expr), mode="eval")
    except (SyntaxError, ValueError, RecursionError, MemoryError):
        raise ExprError(f"Cannot read {expr!r}.") from None

    def ev(n):
        if isinstance(n, ast.Expression):
            return ev(n.body)
        if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)) and not isinstance(n.value, bool):
            return float(n.value)
        if isinstance(n, ast.Name):
            if n.id in CONSTS:
                return CONSTS[n.id]
            if n.id in values:
                return float(values[n.id])
            raise ExprError(f"Unknown name {n.id!r}.")
        if isinstance(n, ast.UnaryOp) and isinstance(n.op, (ast.USub, ast.UAdd)):
            v = ev(n.operand)
            return -v if isinstance(n.op, ast.USub) else v
        if isinstance(n, ast.BinOp) and type(n.op) in BINOPS:
            a, b = ev(n.left), ev(n.right)
            if isinstance(n.op, ast.Pow) and abs(b) > 64:
                raise ExprError("Exponent is too large.")
            try:
                v = BINOPS[type(n.op)](a, b)
            except ZeroDivisionError:
                raise ExprError("Division by zero.") from None
            except OverflowError:
                raise ExprError("A number is too large.") from None
            if isinstance(v, complex):  # Python's power of a negative number to a fraction
                raise ExprError("A negative number cannot be raised to a fractional power.")
            return finite(float(v))
        if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id in FUNCS and not n.keywords:
            args = [ev(a) for a in n.args]
            try:
                return finite(float(FUNCS[n.func.id](*args)))
            except OverflowError:
                raise ExprError(f"{n.func.id}(): the number is too large.") from None
            except (TypeError, ValueError) as exc:
                raise ExprError(f"{n.func.id}(): {exc}") from None
        raise ExprError(f"Not allowed in an expression: {ast.unparse(n) if hasattr(ast, 'unparse') else type(n).__name__}.")

    def finite(v):
        if not math.isfinite(v):
            raise ExprError("Result is not a finite number.")
        return v

    try:
        return finite(ev(tree))
    except RecursionError:
        raise ExprError("Expression is nested too deeply.") from None


def variables(part: dict) -> tuple[dict[str, float], dict[str, str]]:
    """Values of the global variables (in dependency order) and a problem per variable that failed."""
    table = {p.get("name"): p for p in part.get("parameters") or [] if isinstance(p, dict)}
    values: dict[str, float] = {}
    problems: dict[str, str] = {}
    state: dict[str, int] = {}

    def solve(name, stack):
        if name in values or name in problems:
            return
        if state.get(name) == 1:
            cycle = " -> ".join(stack[stack.index(name):] + [name])
            for n in stack[stack.index(name):]:
                problems[n] = f"Circular reference: {cycle}."
            return
        state[name] = 1
        p = table[name]
        for dep in sorted(names_in(p.get("expression"))):
            if dep in table:
                solve(dep, stack + [name])
        if name not in problems:
            missing = [d for d in names_in(p.get("expression")) if d not in table]
            bad = [d for d in names_in(p.get("expression")) if d in problems]
            if missing:
                problems[name] = f"Unknown name {missing[0]!r}."
            elif bad:
                problems[name] = f"Uses {bad[0]!r}, which has a problem."
            else:
                try:
                    values[name] = evaluate_expr(p.get("expression"), values)
                except ExprError as exc:
                    problems[name] = str(exc)
        state[name] = 2

    for name in table:
        if not isinstance(name, str) or not NAME.match(name):
            problems[str(name)] = "A variable name is a letter or _ followed by letters, digits or _."
        elif name in RESERVED:
            problems[name] = f"{name!r} is a reserved word."
        else:
            solve(name, [])
    return values, problems


def has_equations(part: dict) -> bool:
    if part.get("parameters"):
        return True
    for f in part.get("features") or []:
        if f.get("eq"):
            return True
        if f.get("type") == "sketch" and any(isinstance(c, dict) and c.get("eq") for c in f.get("constraints") or []):
            return True
    return False


def _get(obj: dict, path: str):
    for k in path.split(".")[:-1]:
        obj = obj.get(k)
        if not isinstance(obj, dict):
            return None, None
    return obj, path.split(".")[-1]


def _param_spec(feat: dict, field: str):
    from . import features
    ft = features.REGISTRY.get(feat.get("type"))
    if ft is None or "." in field:
        return None
    return next((p for p in ft.params if p.name == field), None)


def _check_field(feat: dict, field: str, v: float) -> tuple[float | int, str | None]:
    p = _param_spec(feat, field)
    if p is None:
        return v, None
    if p.kind == "int":
        if abs(v - round(v)) > 1e-9:
            return v, f"{field} must be a whole number; the equation gives {v:g}."
        v = int(round(v))
    if p.min is not None and v < p.min:
        return v, f"{field} must be at least {p.min:g}; the equation gives {v:g}."
    if p.max is not None and v > p.max:
        return v, f"{field} must be at most {p.max:g}; the equation gives {v:g}."
    return v, None


_solve_cache: "OrderedDict[str, dict]" = OrderedDict()


def _resolve_sketches(sketches: list[dict]) -> tuple[dict, str | None]:
    from .inspection import solve_sketches
    key = json.dumps(sketches, sort_keys=True)
    if key in _solve_cache:
        _solve_cache.move_to_end(key)
        return _solve_cache[key], None
    out, note = solve_sketches(sketches, entities=True)
    if note is None:
        _solve_cache[key] = out
        while len(_solve_cache) > 64:
            _solve_cache.popitem(last=False)
    return out, note


def evaluate(part: dict) -> tuple[dict, dict]:
    """A copy of the part with every equation-driven number recomputed, and a report:
    {values, recomputed: [{feature, field, old, new}], problems: {feature id: message}, variable_problems}."""
    report: dict = {"values": {}, "recomputed": [], "problems": {}, "variable_problems": {}}
    if not has_equations(part):
        return part, report
    values, vproblems = variables(part)
    report["values"] = {k: round(v, 9) for k, v in values.items()}
    report["variable_problems"] = vproblems
    new = copy.deepcopy(part)
    resolve: list[dict] = []
    pending: dict[str, list] = {}  # sketch id -> [(dimension, old value, recomputed entry)]

    def compute(expr, where):
        try:
            return evaluate_expr(expr, values), None
        except ExprError as exc:
            bad = [n for n in names_in(expr) if n in vproblems]
            return None, (f"{where}: uses {bad[0]!r}, which has a problem." if bad else f"{where}: {exc}")

    for f in new.get("features") or []:
        fid = f.get("id")
        for field, expr in (f.get("eq") or {}).items():
            v, err = compute(expr, field)
            if err is None:
                v, err = _check_field(f, field, v)
            if err:
                report["problems"].setdefault(fid, err)
                continue
            obj, key = _get(f, field)
            if obj is None:
                report["problems"].setdefault(fid, f"{field}: no such field.")
                continue
            old = obj.get(key)
            if not isinstance(old, (int, float)) or abs(float(old) - v) > 1e-9:
                obj[key] = v
                report["recomputed"].append({"feature": fid, "field": field, "old": old, "new": round(v, 9)})
        if f.get("type") == "sketch":
            changed = False
            for c in f.get("constraints") or []:
                if not (isinstance(c, dict) and c.get("eq")):
                    continue
                label = c.get("name") or c.get("id")
                v, err = compute(c["eq"], label)
                if err is None and c.get("type") not in DIMENSIONS:
                    err = f"{label}: only dimensions (distance, diameter, radius, angle) take equations."
                if err is None and c.get("type") in ("distance", "diameter", "radius") and v <= 0:
                    err = f"{label} must be more than 0; the equation gives {v:g}."
                if err:
                    report["problems"].setdefault(fid, err)
                    continue
                old = c.get("value")
                if not isinstance(old, (int, float)) or abs(float(old) - v) > 1e-9:
                    if c.get("type") == "angle" and c.get("supplement") is None:
                        side = _angle_side(f, c)  # which angle the old value meant, before it changes (solver.js)
                        if side is not None:
                            c["supplement"] = side
                    c["value"] = v
                    changed = True
                    entry = {"feature": fid, "field": label, "old": old, "new": round(v, 9)}
                    report["recomputed"].append(entry)
                    pending.setdefault(fid, []).append((c, old, entry))
            if changed and fid not in report["problems"]:
                resolve.append(f)
    if resolve:
        solved, note = _resolve_sketches([{"id": s["id"], "entities": s.get("entities", []),
                                           "constraints": s.get("constraints", [])} for s in resolve])
        for s in resolve:
            r = solved.get(s["id"])
            if note:
                report["problems"][s["id"]] = note
            elif not r or r.get("error") or not r.get("solved") or r.get("status") == "over":
                why = (r or {}).get("error") or "the sketch cannot take these dimensions (it does not solve)"
                report["problems"][s["id"]] = f"Sketch: {why}."
            else:
                s["entities"] = r["entities"]
                continue
            # Not taken: the sketch keeps the numbers its geometry was built with, so nothing that copies the
            # evaluated features stores a dimension the geometry does not have (and the next rebuild reports it again).
            for c, old, entry in pending.get(s["id"], []):
                if old is None:
                    c.pop("value", None)
                else:
                    c["value"] = old
                report["recomputed"].remove(entry)
    return new, report


def _angle_side(sketch: dict, c: dict) -> bool | None:
    """Whether an angle dimension's value is the supplement of the angle between its lines' directions
    (p1 to p2), as solver.js decides for a dimension that does not say."""
    pts = {"origin": {"x": 0, "y": 0}, **{e.get("id"): e for e in sketch.get("entities") or [] if e.get("type") == "point"}}
    ents = {e.get("id"): e for e in sketch.get("entities") or []}
    try:
        dirs = []
        for rid in (c.get("refs") or [])[:2]:
            ln = ents[rid]
            a, b = pts[ln["p1"]], pts[ln["p2"]]
            dirs.append((float(b["x"]) - float(a["x"]), float(b["y"]) - float(a["y"])))
        (ax, ay), (bx, by) = dirs
        th = abs(math.degrees(math.atan2(ax * by - ay * bx, ax * bx + ay * by)))
        v = float(c.get("value"))
    except (KeyError, TypeError, ValueError):
        return None
    return abs(v - (180 - th)) < abs(v - th)


def table(part: dict) -> list[dict]:
    """Global variables with their values and which fields use them (for inspect_design)."""
    values, problems = variables(part)
    used: dict[str, list[str]] = {}
    for f in part.get("features") or []:
        label = f.get("name") or f.get("id")
        for field, expr in (f.get("eq") or {}).items():
            for n in names_in(expr):
                used.setdefault(n, []).append(f"{field}@{label}")
        for c in f.get("constraints") or [] if f.get("type") == "sketch" else []:
            if isinstance(c, dict) and c.get("eq"):
                for n in names_in(c["eq"]):
                    used.setdefault(n, []).append(f"{c.get('name') or c.get('id')}@{label}")
    for p in part.get("parameters") or []:
        for n in names_in(p.get("expression")):
            used.setdefault(n, []).append(p.get("name"))
    rows = []
    for p in part.get("parameters") or []:
        n = p.get("name")
        row = {"name": n, "expression": p.get("expression"), "unit": p.get("unit", "mm"),
               "value": round(values[n], 9) if n in values else None, "used_by": used.get(n, [])}
        if p.get("comment"):
            row["comment"] = p["comment"]
        if n in problems:
            row["problem"] = problems[n]
        rows.append(row)
    return rows


def equations(part: dict) -> list[dict]:
    """Every equation on a feature field or sketch dimension: {feature, name, field, expression, value}."""
    rows = []
    for f in part.get("features") or []:
        for field, expr in (f.get("eq") or {}).items():
            obj, key = _get(f, field)
            rows.append({"feature": f.get("id"), "name": f.get("name"), "field": field, "expression": expr,
                         "value": obj.get(key) if obj else None})
        for c in f.get("constraints") or [] if f.get("type") == "sketch" else []:
            if isinstance(c, dict) and c.get("eq"):
                rows.append({"feature": f.get("id"), "name": f.get("name"), "field": c.get("name") or c.get("id"),
                             "constraint": c.get("id"), "expression": c["eq"], "value": c.get("value")})
    return rows
