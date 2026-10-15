"""The parts of a job, and the checks of their feature lists against the source solids.

    python parts.py quick [part ...]    features against the source solid, one summary per part (the usual check)
    python parts.py check [part ...]    the same feature by feature, with the slices that differ
    python parts.py plan  [part ...]    the relations and dimensions planned for every sketch
    python parts.py where [part ...] [--upto N]   where features and source differ: each piece, its volume and box

Run from the job folder (or set SLDMACRO_JOB). With no part named: every part in job.py's PARTS.
"""
import importlib
import os
import sys
import time

import core
import stages
from compare import differ as _differ
from jobcfg import job


def all_keys():
    return list(job().parts)


def in_job(fn):
    """Calls fn from the job folder (recipes read their source files relative to it)."""
    here = os.getcwd()
    os.chdir(job().dir)
    try:
        return fn()
    finally:
        os.chdir(here)


in_src = in_job          # the name the generator uses


def load(key):
    j = job()
    if not os.path.exists(os.path.join(j.dir, "recipes", key + ".py")):
        raise SystemExit(f"no recipe recipes/{key}.py in {j.dir}")
    mod = importlib.import_module(f"recipes.{key}")
    part = in_job(mod.part)
    if part.key != key:
        raise SystemExit(f"recipes/{key}.py returns a part whose key is {part.key!r}: the key must be the file's name")
    names = [s.name for s in part.steps]
    twice = sorted({n for n in names if names.count(n) > 1})
    if twice:
        raise SystemExit(f"{key}: two features are called {twice}: every feature needs a name of its own")
    return part


HOW = {"how": ""}


def differ(a, b):
    """(volume only in a, volume only in b, worst slices). HOW["how"] says which comparison was used."""
    oa, ob, worst, how = _differ(a, b)
    HOW["how"] = how
    return oa, ob, worst


def sharp_inside(body):
    """Inside corners still sharp: (number of edges, total length)."""
    edges = [e for e in body.edges() if stages.is_concave(body, e)]
    return len(edges), sum(e.length for e in edges)


def marks_cut(body, rows):
    for r in rows:
        if r["kind"] == "mk":
            st = r["step"]
            tool = core.prism(st.shapes, st.z0, st.z1, st.draft, st.z0, r["wider"])
            body = body - tool if st.op == "cut" else body + tool
    return body


def check(key, detail=True):
    t0 = time.time()
    part = load(key)
    rows = stages.build(part, log=print)
    print(f"{part.title}: {len(rows)} features ({time.time() - t0:.0f} s)")
    if detail:
        for i, r in enumerate(rows, 1):
            st = r["step"]
            extra = ""
            if r["kind"] == "dr":
                extra = f"   {len(r['probes'])} faces, neutral {'Front plane' if r['neutral'] is None else 'face'}; the other way {r['flip_dv']:+.3f}"
            if r["kind"] in ("ch", "fi"):
                extra = f"   {r['n_edges']} edges, {r['length']:.1f} mm" + ("" if r["exact"] else "   ESTIMATE")
            print(f"  {i:>2} {r['kind']} {st.name:<22} dV {r['dv']:+11.3f}  dM {r['dm']:+12.2f}  bodies {core.n_bodies(r['after'])}{extra}")
    final = rows[-1]["after"]
    assert core.n_bodies(final) == 1 and final.is_valid, f"{key}: the features do not give one valid body"
    for i, r in enumerate(rows, 1):
        assert core.n_bodies(r["after"]) == 1, f"{key}: after feature {i} ('{r['step'].name}') the part is {core.n_bodies(r['after'])} bodies: reorder the features"
    out = {}
    if part.src is None:
        print("   no source solid given (src=): nothing to compare with")
        return out
    plain = [r for r in rows if r["kind"] in ("ex", "dr", "ch")][-1]["after"]
    if part.src_bare:
        bare = in_job(part.src_bare)
        mine = marks_cut(plain, rows)
        oa, ob, worst = differ(mine, bare)
        out["bare"] = (oa, ob)
        print(f"   without radii: features {mine.volume:.3f} mm3, source {bare.volume:.3f} mm3; only in the features {oa:.3f}, only in the source {ob:.3f} mm3")
        for w in worst[:6] if detail else []:
            print("      %.3f mm2 at Z %.2f, largest patch x %s..%s y %s..%s" % (w[0], w[1], w[2][0], w[2][2], w[2][1], w[2][3]))
    real = in_job(part.src)
    oa, ob, worst = differ(final, real)
    out["real"] = (oa, ob)
    est = [r["step"].name for r in rows if r["kind"] == "fi" and not r["exact"]]
    out["how"] = HOW["how"]
    print(f"   as built:      features {final.volume:.3f} mm3, source {real.volume:.3f} mm3; only in the features {oa:.3f}, only in the source {ob:.3f} mm3"
          f"   (compared by {HOW['how']})" + (f"   (not in the replay: {', '.join(est)})" if est else ""))
    for w in worst[:6] if detail else []:
        print("      %.3f mm2 at Z %.2f, largest patch x %s..%s y %s..%s" % (w[0], w[1], w[2][0], w[2][2], w[2][1], w[2][3]))
    n, length = sharp_inside(final)
    try:
        ns, ls = sharp_inside(real)
        print(f"   sharp inside corners: {n} edges, {length:.1f} mm in the features; {ns} edges, {ls:.1f} mm in the source"
              + ("" if n <= ns else "   <- the source rounds some of these: see `sldmacro look --edges`"))
    except Exception:
        print(f"   sharp inside corners in the features: {n} edges, {length:.1f} mm")
    free = [(name, sk.free()) for name, sk in plans(part, rows).items() if sk.free()]
    n_sk = sum(1 for r in rows if r["kind"] in ("ex", "mk"))
    print(f"   sketches planned exactly: {n_sk - len(free)} of {n_sk}" + (f"; left to Fully Define Sketch: {free}" if free else ""))
    print(f"   ({time.time() - t0:.0f} s)", flush=True)
    out.update(volume=final.volume, source=real.volume, sharp=n, free=free, features=len(rows), estimates=est)
    return out


def where(key, upto=None):
    """Where the features and the source differ: every piece of material that is only in one of them, with its volume
    and its box. upto: compare after that many features only (to find which feature is off)."""
    part = load(key)
    rows = stages.build(part)
    if upto:
        rows = rows[:upto]
    mine, real = rows[-1]["after"], in_job(part.src)
    print(f"{part.title}: after {len(rows)} feature(s) ('{rows[-1]['step'].name}'): features {mine.volume:.3f} mm3, source {real.volume:.3f} mm3")
    for label, a, b in (("only in the features (too much material)", mine, real), ("only in the source (material missing)", real, mine)):
        try:
            pieces = sorted((s for s in (a - b).solids() if s.volume > 1e-3), key=lambda s: -s.volume)
        except Exception as e:
            print(f"   {label}: the boolean failed ({type(e).__name__}); use `sldmacro check` for the slices")
            continue
        print(f"   {label}: {sum(s.volume for s in pieces):.3f} mm3 in {len(pieces)} piece(s)")
        for s in pieces[:12]:
            bb = s.bounding_box()
            print(f"      {s.volume:10.3f} mm3   x {bb.min.X:.2f}..{bb.max.X:.2f}   y {bb.min.Y:.2f}..{bb.max.Y:.2f}   z {bb.min.Z:.2f}..{bb.max.Z:.2f}")
    print("   (pieces of a few thousandths along curved faces are rounding in the file; a box that matches a feature's outline is that feature)")


def plans(part, rows):
    """The sketch plan of every boss, cut and mark of a part: {feature name: Sketch}."""
    import constrain
    origin = (part.frame.cx, part.frame.cy)
    by_name, out, base = {}, {}, None
    for r in rows:
        st = r["step"]
        if r["kind"] not in ("ex", "mk"):
            continue
        pool = constrain.ref_pool(r["before"], origin)
        sk = constrain.plan(st.shapes, origin, pool, is_base=base is None, prefer=tuple(getattr(st, "refs", ())), shapes_by_name=by_name,
                            base_name=base, fix_free=(r["kind"] == "mk"), fix_all=bool(getattr(st, "fixed", False)))
        sk.pool = pool
        out[st.name] = sk
        by_name[st.name] = st.shapes
        base = base or st.name
    return out


def show_plans(key):
    import constrain
    part = load(key)
    rows = stages.build(part)
    for name, sk in plans(part, rows).items():
        print(f"--- {name}: {len(sk.segs)} entities")
        print(constrain.describe(sk))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "quick"
    keys = sys.argv[2:] or all_keys()
    if cmd in ("check", "quick"):
        for k in keys:
            check(k, detail=(cmd == "check"))
    elif cmd == "plan":
        for k in keys:
            show_plans(k)
    elif cmd == "where":
        args = sys.argv[2:]
        n = None
        if "--upto" in args:
            n = int(args[args.index("--upto") + 1])
            del args[args.index("--upto"):args.index("--upto") + 2]
        for k in (args or all_keys()):
            where(k, n)
    else:
        raise SystemExit(__doc__)
