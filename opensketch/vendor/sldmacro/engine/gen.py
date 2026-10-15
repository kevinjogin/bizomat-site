"""Writes the SOLIDWORKS macro that models the parts of a job as native features, from the part recipes.

    python gen.py emit [part ...]        the macro (out/<NAME>.bas) and what the checks need (out/expected.json)
    python gen.py readings [part ...]    every way SOLIDWORKS could read each boss / cut call, worked out in OpenCascade
                                         (cached in _cache; emit runs it when a recipe has changed)
    python gen.py rebuild <trace>        rebuilds what the macro drew in the stand-in and compares it with the recipes

Run from the job folder with the CAD environment. The macro text comes from engine.bas (the procedures) plus one
generated section per part: the feature list, the sketches, how each sketch is defined, and the points by which
faces and edges are found.
"""
import hashlib
import json
import math
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

import core
import stages
from core import Ch, Dr, Ex, Fi, Mk, seg_len
from jobcfg import job

MAX_PARTS, MAX_STEPS = 24, 80            # what the stand-in for SOLIDWORKS (mock/PXState.bas) has room for
REL_START, REL_MAX = 2e-6, 2e-5          # as in the engine: how closely SOLIDWORKS' volumes are assumed to agree with these
SUB_MAX = 250                            # statements per generated procedure

SG = dict(MERGE="sgMERGEPOINTS", HOR="sgHORIZONTAL2D", VER="sgVERTICAL2D", TAN="sgTANGENT", EQ="sgSAMELENGTH", CONC="sgCONCENTRIC",
          COIN="sgCOINCIDENT", MID="sgATMIDDLE", HPT="sgHORIZONTALPOINTS2D", VPT="sgVERTPOINTS2D", COL="sgCOLINEAR", FIX="sgFIXED",
          PAR="sgPARALLEL", PERP="sgPERPENDICULAR")
DIM = dict(DIST=0, HDIST=1, VDIST=2, RAD=3, DIA=4, ANG=5)
KIND = dict(ex="", dr="draft", ch="chamfer", fi="fillet", mk="mark")


def num(v):
    s = f"{v:.6f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def rnd(v):
    return round(float(v), 6) + 0.0


def quote(s):
    return '"' + s.replace('"', "'") + '"'


def sig_of(segs):
    """How the stand-in recognises a sketch: how many segments, and the sum of the squares of their numbers (mm)."""
    total = 0.0
    for g in segs:
        vals = g[1:7] if g[0] == "A" else g[1:]
        total += sum(v * v for v in vals)
    return len(segs), total


def sub(name, lines, comment=""):
    """A generated procedure, cut into pieces of SUB_MAX statements (VBA and LibreOffice both limit a procedure's size)."""
    out, k = [], 0
    chunks = [lines[i:i + SUB_MAX] for i in range(0, max(len(lines), 1), SUB_MAX)]
    for k, ch in enumerate(chunks):
        nm = name if k == 0 else f"{name}_{k}"
        out.append(f"Private Sub {nm}()" + (f"    ' {comment}" if comment and k == 0 else ""))
        out += ["    " + l for l in ch]
        if k + 1 < len(chunks):
            out.append(f"    {name}_{k + 1}")
        out += ["End Sub", ""]
    return out


# ---------------------------------------------------------------------------------------------- readings

def recipe_hash(part, rows):
    data = [part.frame.cx, part.frame.cy, part.frame.z0, part.frame.flip, part.frame.rot]
    for r in rows:
        st = r["step"]
        if r["kind"] in ("ex", "mk"):
            data.append([st.name, st.op, st.z0, st.z1, getattr(st, "draft", 0.0), getattr(st, "taper", 0.0), getattr(st, "outward", False),
                         [[rnd(v) if not isinstance(v, (str, bool)) else v for v in g] for sh in st.shapes for g in sh.segs]])
    return hashlib.sha1(json.dumps(data).encode()).hexdigest()


def before_path(key, name):
    return os.path.join(job().work, f"{key}__{name.replace(' ', '_').replace('/', '_')}.brep")


def readings_of(part, rows, log=print):
    """{step name: [reading, ...]} for the bosses, cuts and marks of a part; from the cache if the recipe is unchanged."""
    os.makedirs(job().cache, exist_ok=True)
    path = os.path.join(job().cache, part.key + ".json")
    h = recipe_hash(part, rows)
    if os.path.exists(path):
        d = json.load(open(path))
        if d.get("hash") == h:
            return d["steps"]
    out = {}
    for r in rows:
        if r["kind"] not in ("ex", "mk"):
            continue
        st = r["step"]
        cands = stages.reading_cands(part, r)
        got = []
        angled = r["kind"] == "mk" or bool(getattr(st, "taper", 0.0))
        for k, c in enumerate(cands):
            if not angled:
                try:
                    q = stages.one_reading(part, st, r["before"], c)
                except Exception:
                    q = dict(z0=c[0] - part.frame.z0, z1=c[1] - part.frame.z0, widen=False, failed=True)
            else:
                # a wrong wall angle can crash OpenCascade: each reading of a feature with a wall angle in a process of its own
                from build123d import export_brep
                os.makedirs(job().work, exist_ok=True)
                bp = before_path(part.key, st.name)
                if k == 0 and r["before"] is not None:
                    export_brep(r["before"], bp)
                pr = subprocess.run([sys.executable, os.path.abspath(__file__), "_reading", part.key, st.name, repr(c[0]), repr(c[1]), str(c[2]), str(r["wider"])],
                                    capture_output=True, text=True, timeout=900, cwd=job().dir, env=dict(os.environ, SLDMACRO_JOB=job().dir))
                line = [l for l in pr.stdout.splitlines() if l.startswith("READING ")]
                q = json.loads(line[-1][8:]) if line else dict(z0=c[0] - part.frame.z0, z1=c[1] - part.frame.z0, widen=(c[2] != r["wider"]), failed=True)
            got.append(q)
            log("   %-18s %7.2f -> %7.2f %s: %s" % (st.name, q["z0"], q["z1"], ("other lean" if q["widen"] else "as designed") if angled else "",
                "could not be built" if q.get("failed") else "dV %+11.3f  dMz %+13.2f  bodies %d" % (q["dv"], q["dm"], q["bodies"])))
        assert not got[0].get("failed") and abs(got[0]["dv"] - r["dv"]) < 1e-5, (st.name, got[0], r["dv"])
        out[st.name] = got
    json.dump(dict(hash=h, steps=out), open(path, "w"), indent=1)
    return out


def one_reading_cli(key, name, zs, ze, w, w_right):
    import parts
    from build123d import import_brep
    part = parts.load(key)
    st = part.step(name)
    before = import_brep(before_path(key, name)) if os.path.exists(before_path(key, name)) else None
    q = stages.one_reading(part, st, before, (zs, ze, w), w_right)
    print("READING " + json.dumps(q))


# ---------------------------------------------------------------------------------------------- one part

def gen_part(no, part, log=print):
    import parts
    fr = part.frame
    rows = stages.build(part, log=log)
    plans = parts.plans(part, rows)
    rds = readings_of(part, rows, log)
    P = f"P{no}"
    build, subs, draw_cases, def_cases, table, steps_truth, report, not_planned, estimates = [], [], [], [], [], [], [], [], []
    sigs = []
    v_now, m_now = 0.0, 0.0
    for i, r in enumerate(rows, 1):
        st, kind = r["step"], r["kind"]
        dv, dm = r["dv"], r["dm"]
        what = quote(st.name)
        if kind in ("ex", "mk"):
            segs = [tuple(rnd(v) if not isinstance(v, (str, bool)) else v for v in fr.seg(g)) for sh in st.shapes for g in sh.segs]
            n, total = sig_of(segs)
            sigs.append((n, round(total, 3)))     # two features may have the same sketch (a recess and its countersink): the stand-in takes them in order
            lines = []
            for k, g in enumerate(segs, 1):
                if g[0] == "L":
                    assert math.hypot(g[3] - g[1], g[4] - g[2]) > 1e-4, f"{part.key}: {st.name}: a line of no length"
                    lines.append(f"Ln {k}, " + ", ".join(num(v) for v in g[1:]))
                elif g[0] == "A":
                    lines.append(f"Ar {k}, " + ", ".join(num(v) for v in g[1:7]) + f", {1 if g[7] else -1}")
                else:
                    lines.append(f"Ci {k}, " + ", ".join(num(v) for v in g[1:]))
            subs += sub(f"{P}_S{i}", lines, f"{st.name}: {st.note}" if st.note else st.name)
            draw_cases.append((no * 1000 + i, f"{P}_S{i}"))

            sk = plans[st.name]
            eds_truth, nrel, ndim, nmerge = [], 0, 0, 0
            if kind == "ex":
                assert len(segs) == sum(1 for s in sk.segs if s["t"] in ("L", "A", "C"))
                lines, eds = [], {}
                probe_ref = {tuple(round(v, 6) for v in ref["probe"]): ref for ref in sk.pool["lines"] + sk.pool["circles"]}

                def code(ref):
                    if ref[0] == "S":
                        return f"S{ref[1]}"
                    if ref[0] == "P":
                        return {"a": "A", "b": "B", "c": "C"}[ref[2]] + str(ref[1])
                    if ref[0] == "O":
                        return "O"
                    key = tuple(round(v, 6) for v in ref[1])
                    if key not in eds:
                        eds[key] = len(eds) + 1
                    return f"E{eds[key]}"
                rel_lines, dim_lines = [], []
                for rk, refs in sk.rels:
                    rel_lines.append(f"Rel {quote(SG[rk])}, " + ", ".join(quote(code(x)) for x in refs))
                    nrel += rk != "MERGE"
                    nmerge += rk == "MERGE"
                for dk, refs, at, val in sk.dims:
                    cs = [code(x) for x in refs] + [""]
                    tx, ty = fr.xy(*at)
                    dim_lines.append(f"Dm {DIM[dk]}, {quote(cs[0])}, {quote(cs[1])}, {num(tx)}, {num(ty)}, {num(val)}")
                    ndim += 1
                for k, s in enumerate(sk.segs, 1):
                    if s["t"] == "CL":
                        g = fr.seg(s["g"])
                        lines.append(f"Cn {k}, " + ", ".join(num(v) for v in g[1:]))
                    elif s["t"] == "PT":
                        lines.append(f"Pt {k}, " + ", ".join(num(v) for v in fr.xy(s["g"][1], s["g"][2])))
                for key, k in eds.items():
                    x, y, z = fr.pt(*key)
                    lines.append(f"Ed {k}, {num(x)}, {num(y)}, {num(z)}")
                    ref = probe_ref[key]
                    if "u" in ref:
                        (ax, ay), (bx, by) = fr.xy(*ref["p0"]), fr.xy(*ref["p1"])
                        geo = ["L", rnd(ax), rnd(ay), rnd(bx), rnd(by)]
                    else:
                        geo = ["C", *[rnd(v) for v in fr.xy(*ref["c"])], rnd(ref["r"])]
                    eds_truth.append(dict(p=[rnd(x), rnd(y), rnd(z)], geo=geo))
                assert len(eds) <= 60
                if st.fixed:                    # a traced outline: every segment fixed where it is drawn
                    lines, rel_lines, dim_lines, eds_truth = [], [f"FixAll {n}"], [], []
                    nrel, ndim = 1, 0
                subs += sub(f"{P}_D{i}", lines + rel_lines + dim_lines, f"{st.name}: how its sketch is defined")
                def_cases.append((no * 1000 + i, f"{P}_D{i}"))
                if sk.free():
                    not_planned.append(f"{st.name} ({sk.free()} left to Fully Define Sketch)")

            # tolerances the engine uses: a fixed part here, plus gRel x the size of the part there
            q0 = rds[st.name]
            per = sum(seg_len(g) for g in segs)
            depth = abs(st.z1 - st.z0)
            draft = getattr(st, "draft", 0.0) or getattr(st, "taper", 0.0)
            outward = bool(getattr(st, "outward", False)) and kind == "ex"
            for q in q0:
                if q.get("failed"):                 # a reading OpenCascade could not build: its twin drafted the other way, to first order
                    twin = [o for o in q0 if not o.get("failed") and abs(o["z0"] - q["z0"]) < 1e-9 and abs(o["z1"] - q["z1"]) < 1e-9]
                    assert twin, f"{part.key}: {st.name}: a reading could not be built and has no twin"
                    twin = twin[0]
                    extra = per * depth ** 2 * math.tan(math.radians(draft)) * (1 if twin["dv"] else 0)
                    q.update(dv=twin["dv"] - extra if st.op == "cut" else twin["dv"] + extra, bodies=twin["bodies"], estimated=True)
                    q["dm"] = twin["dm"] * q["dv"] / twin["dv"] if twin["dv"] else 0.0
            # a traced symbol with sloping walls is the one thing whose volume SOLIDWORKS and OpenCascade may not agree on closely
            rel_tol = 0.02 if kind == "mk" and any(sh.kind == "free" for sh in st.shapes) else 0.0005
            tol_v = max(0.1, rel_tol * abs(dv))
            tol_m = max(0.5, rel_tol * abs(dm))
            v0, m0 = v_now, m_now

            def away(q, rel):
                if q["bodies"] != 1:
                    return 999.0
                return max(abs(q["dv"] - dv) / (tol_v + rel * (v0 + abs(dv))), abs(q["dm"] - dm) / (tol_m + rel * (abs(m0) + abs(dm))))
            wrong = q0[1:]
            if wrong:
                worst = min(away(q, REL_START) for q in wrong)
                assert worst > 3.0, f"{part.key}: {st.name}: a wrong reading would pass as right ({worst:.1f} x the tolerance)"
                by_v = min((abs(q["dv"] - dv) / (tol_v + REL_START * (v0 + abs(dv))) if q["bodies"] == 1 else 999.0) for q in wrong)
                report.append(f"   {st.name:<18} {len(wrong)} wrong readings, the nearest {min(worst, 999):.0f} x the tolerance away" +
                              ("" if by_v > 3.0 else "   (only the centre of mass tells it apart)"))
            z0, z1 = fr.z(st.z0), fr.z(st.z1)
            call = "Mark" if kind == "mk" else "Extrude"
            build.append(f"{call} {i}, {what}, {st.op == 'cut'}, {num(z0)}, {num(z1)}, {num(draft)}, {outward}, {n}, "
                         f"{dv:.3f}, {tol_v:.3f}, {dm:.2f}, {tol_m:.2f}")
            steps_truth.append(dict(no=i, kind=kind, name=st.name, cut=st.op == "cut", draft=draft, narrows=not outward, fixed=bool(getattr(st, "fixed", False)),
                                    n=n, sum=total, dv=dv, dm=dm,
                                    nrel=nrel, ndim=ndim, nmerge=nmerge,
                                    rel_kinds=sorted({rk for rk, _ in sk.rels}) if kind == "ex" and not st.fixed else [],
                                    ncl=sum(1 for s in sk.segs if s["t"] == "CL") if kind == "ex" and not st.fixed else 0,
                                    free=(sk.free() if kind == "ex" and not st.fixed else 0),
                                    eds=eds_truth, readings=[dict(z0=q["z0"], z1=q["z1"], widen=q["widen"], dv=q["dv"], dm=q["dm"], bodies=q["bodies"]) for q in q0],
                                    z0=z0, z1=z1, segs=[list(g) for g in segs]))
            tkind = ("cut" if st.op == "cut" else "boss") if kind == "ex" else "mark"
            how = f"Z {num(z0)} to {num(z1)}" + (f", {num(draft)} deg walls" if draft else "")
        else:
            probes = [tuple(rnd(v) for v in fr.pt(*p)) for p in r["probes"]]
            assert probes and len(probes) <= 400, f"{part.key}: {st.name}: {len(probes)} points"
            subs += sub(f"{P}_Q{i}", [f"Pr {num(x)}, {num(y)}, {num(z)}" for x, y, z in probes], f"{st.name}: a point on each face or edge")
            build.append("PrClear")
            build.append(f"{P}_Q{i}")
            row = dict(no=i, kind=kind, name=st.name, probes=[list(p) for p in probes], dv=dv, dm=dm)
            if kind == "dr":
                front = r["neutral"] is None
                nx, ny, nz = (0.0, 0.0, 0.0) if front else fr.pt(*r["neutral"])
                gap = abs(r["flip_dv"] - dv)             # the engine accepts 0.05 + 10% + gRel x the part
                assert gap > 3 * (0.05 + 0.1 * abs(dv) + REL_START * r["v"]) and gap > 1.5 * (0.05 + 0.1 * abs(dv) + REL_MAX * r["v"]), \
                    f"{part.key}: {st.name}: the draft leaning the other way would pass ({r['flip_dv']:.3f} / {dv:.3f})"
                build.append(f"DraftFaces {i}, {what}, {num(st.angle)}, {front}, {num(nx)}, {num(ny)}, {num(nz)}, {dv:.3f}, 0.05, {dm:.2f}, 0.5")
                row.update(angle=st.angle, front=front, neutral=[rnd(nx), rnd(ny), rnd(nz)], flip_dv=r["flip_dv"], flip_dm=r["flip_dm"])
                tkind, how = "draft", f"{len(probes)} point(s)"
            elif kind == "ch":
                build.append(f"ChamferE {i}, {what}, {num(st.size)}, {dv:.3f}")
                row.update(size=st.size)
                tkind, how = "chamfer", f"{r['n_edges']} edge(s)"
            else:
                build.append(f"FilletE {i}, {what}, {num(st.r)}, {dv:.3f}, {r['exact']}")
                row.update(r=st.r, exact=r["exact"])
                tkind, how = "fillet", f"{r['n_edges']} edge(s)"
                if not r["exact"]:
                    estimates.append(st.name)
            steps_truth.append(row)
        v_now, m_now = r["v"], r["m"]
        table.append((f"'   {i:>3}  {tkind:<8}{st.name:<22}{st.note}", how))

    design = parts.in_job(part.src).volume if part.src else rows[-1]["v"]
    head = [f"Private Sub Build{no}()    ' {part.title}", f"    If Not StartPart({no}, {quote(part.title)}) Then Exit Sub"]
    tail = [f"    EndPart {len(rows)}, {design:.1f}", "End Sub", ""]
    # the feature list, in pieces if it is long (the pieces run one after the other)
    chunks = [build[k:k + SUB_MAX] for k in range(0, len(build), SUB_MAX)]
    code = head + ["    " + l for l in chunks[0]]
    extra = []
    for k, ch in enumerate(chunks[1:], 1):
        code.append(f"    Build{no}_{k}")
        extra += [f"Private Sub Build{no}_{k}()"] + ["    " + l for l in ch] + ["End Sub", ""]
    code += tail + extra
    w = max(len(t[0]) for t in table)
    tab = [f"' {no}. {part.title}    (key {quote(part.key)}, {len(rows)} features)"]
    if part.where:
        tab += ["'    " + l for l in wrap(part.where, 92)]
    tab += [t[0].ljust(w + 2) + t[1] for t in table]
    truth = dict(no=no, key=part.key, title=part.title, steps=steps_truth, final=rows[-1]["v"], design=design)
    notes = list(part.notes)
    if not_planned:
        notes.append("Sketches the macro finishes with Fully Define Sketch: " + "; ".join(not_planned) + ".")
    if estimates:
        notes.append("Radii whose volume could only be estimated (checked loosely): " + ", ".join(estimates) + ".")
    return dict(code=code, subs=subs, draw=draw_cases, define=def_cases, table=tab, truth=truth, report=report, notes=notes, rows=rows)


def wrap(text, width):
    out, cur = [], ""
    for wd in text.split():
        if len(cur) + len(wd) + 1 > width and cur:
            out.append(cur)
            cur = wd
        else:
            cur = (cur + " " + wd).strip()
    return out + ([cur] if cur else [])


# ---------------------------------------------------------------------------------------------- the macro

def dispatch(name, cases):
    out = [f"Private Sub {name}(partNo As Long, stepNo As Long)", "    Select Case partNo * 1000 + stepNo"]
    for k, target in cases:
        out += [f"        Case {k}", f"            {target}"]
    return out + ["    End Select", "End Sub", ""]


def emit(keys, out_path=None, log_name=None, title=None, intro=None, log=print):
    import parts
    j = job()
    keys = keys or parts.all_keys()
    if not keys:
        raise SystemExit("job.py lists no parts (PARTS = [...])")
    assert len(keys) <= MAX_PARTS, f"{len(keys)} parts: the stand-in test has room for {MAX_PARTS} per macro; split the job"
    out_path = out_path or j.macro
    log_name = log_name or j.log_name
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    gens = []
    for no, key in enumerate(keys, 1):
        part = parts.load(key)
        log(f"{part.title} ...")
        g = gen_part(no, part, log)
        assert len(g["rows"]) <= MAX_STEPS, f"{part.key}: {len(g['rows'])} features: the stand-in test has room for {MAX_STEPS} per part"
        gens.append((part, g))
        log(f"{part.title}: how far the wrong readings of each boss / cut are from passing:")
        log("\n".join(g["report"]))
    def want(p):
        return f"WantPart({quote(p.key)})"
    generated = ["Private Sub BuildAll()"] + [f"    If {want(p)} Then Build{g['truth']['no']}" for p, g in gens] + ["End Sub", ""]
    for p, g in gens:
        generated += g["code"]
    generated += dispatch("DrawStep", [c for _, g in gens for c in g["draw"]])
    generated += dispatch("DefineStep", [c for _, g in gens for c in g["define"]])
    for p, g in gens:
        generated += ["' ---- " + p.title, ""] + g["subs"]
    table = []
    for p, g in gens:
        table += g["table"] + ["'"]
    notes, said = [], set()
    for p, g in gens:
        for nt in g["notes"]:
            if nt in said:
                continue
            said.add(nt)
            notes += ["'   " + l for l in wrap(f"{p.title}: {nt}", 94)]
    names = " and the ".join(p.title.lower() for p, _ in gens)
    title = title or ("' " + j.title + ": " + (f"the {names}" if len(gens) <= 2 else f"{len(gens)} parts") + " as native SOLIDWORKS features")
    if j.intro and not intro:
        intro = "\n".join("' " + l for l in wrap(str(j.intro), 94))
    intro = intro or "\n".join("' " + l for l in wrap(
        "Builds each part from scratch in SOLIDWORKS: extrudes and cuts first, then drafts, chamfers, radii, and signs or symbols last. "
        "Every sketch is defined by relations and dimensions. Nothing is imported.", 94))
    text = open(os.path.join(HERE, "engine.bas")).read().replace("\r\n", "\n")
    for key, val in (("'@@TITLE@@", title), ("'@@INTRO@@", intro), ("@@LOGNAME@@", log_name), ("'@@PARTS@@", "\n".join(table).rstrip("'\n")),
                     ("'@@NOTES@@", "\n".join(notes) or "'   (none)"), ("@@LOGHEAD@@", j.title.replace('"', "'")), ("'@@GENERATED@@", "\n".join(generated).rstrip("\n"))):
        assert key in text, key
        text = text.replace(key, val)
    assert "@@" not in text
    long = [l for l in text.split("\n") if len(l) >= 1000]
    bad_chars = sorted({c for c in text if ord(c) > 127})
    assert not long, f"a line of {len(long[0])} characters (VBA takes 1023): {long[0][:80]}..."
    assert not bad_chars, f"characters VBA's editor may not keep: {bad_chars[:8]} (write titles, notes and names in plain ASCII)"
    open(out_path, "w", newline="").write(text.replace("\n", "\r\n"))
    json.dump(dict(job=j.name, title=j.title, log_name=log_name, parts=[g["truth"] for _, g in gens]), open(j.truth, "w"), indent=1)
    log(f"wrote {out_path}: {len(text.splitlines())} lines, {sum(len(g['rows']) for _, g in gens)} features in {len(gens)} part(s)")
    return gens


# ---------------------------------------------------------------------------------------------- rebuild

def to_frame(solid, fr):
    """A solid in the recipe's frame, put into the SOLIDWORKS part's frame (origin, turn, and Y reversed for an outside part)."""
    return fr.solid(solid)


def rebuild(trace_path, only=()):
    """Rebuilds the bosses, cuts and marks the macro made in the stand-in, from the outlines and depths it drew, and
    compares them part by part with the recipe's (in the part's frame). only: part keys, or all the trace has.
    Exit code 1 if they differ."""
    import re
    import parts
    from compare import compare, loops_of
    trace = open(trace_path).read()
    d = json.load(open(job().truth))
    bad = 0
    for blk in re.split(r"^PART\|", trace, flags=re.M)[1:]:
        no = int(blk.split("\n", 1)[0])
        p = d["parts"][no - 1]
        if only and p["key"] not in only:
            continue
        part = parts.load(p["key"])
        feats = [l.split("|") for l in blk.splitlines() if l.startswith("FEAT|") and l.split("|")[1] in ("Extrusion", "Cut")]
        feats.sort(key=lambda f: int(f[3]))
        mine = None
        for f in feats:
            kind, z0, z1, deg, narrows = f[1], float(f[5]), float(f[6]), float(f[7]), f[8] == "True"
            segs = []
            for t in f[11].strip(";").split(";"):
                w = t.split()
                v = [float(x) for x in w[1:]]
                segs.append(("L", *v) if w[0] == "L" else ("C", *v) if w[0] == "C" else ("A", *v[:6], v[6] > 0))
            shapes = [core.free(l) for l in loops_of(segs)]
            wider = 1 if (z1 < z0) == narrows else -1
            tool = core.prism(shapes, z0, z1, deg, z0 if deg else None, wider)
            mine = tool if mine is None else (mine - tool if kind == "Cut" else mine + tool)
        ref = core.body_extrudes(part)
        for st in part.steps:
            if isinstance(st, Mk):
                tool = core.prism(st.shapes, st.z0, st.z1, st.draft, st.z0, 1 if st.z1 < st.z0 else -1)       # narrower with depth, as stages.build
                ref = ref - tool if st.op == "cut" else ref + tool
        ref = to_frame(ref, part.frame)
        oa, ob, worst = compare(mine, ref)
        ok = abs(mine.volume - ref.volume) < 1e-3 and oa < 1e-3 and ob < 1e-3
        bad += not ok
        print(f"{part.title}: bosses, cuts and marks as the macro drew them {mine.volume:.3f} mm3, as designed {ref.volume:.3f} mm3; "
              f"only in the macro's {oa:.3f}, only in the design {ob:.3f} mm3 {'(same)' if ok else 'DIFFERENT'}")
        for w in worst[:4]:
            print("      %.3f mm2 at Z %.2f, largest patch x %s..%s y %s..%s" % (w[0], w[1], w[2][0], w[2][2], w[2][1], w[2][3]))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "emit"
    if cmd == "emit":
        emit(sys.argv[2:])
    elif cmd == "readings":
        import parts
        for k in (sys.argv[2:] or parts.all_keys()):
            pt = parts.load(k)
            readings_of(pt, stages.build(pt))
    elif cmd == "rebuild":
        rebuild(sys.argv[2], tuple(sys.argv[3:]))
    elif cmd == "_reading":
        one_reading_cli(sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), int(sys.argv[6]), int(sys.argv[7]))
