"""Runs a job's macro against a stand-in for SOLIDWORKS.

There is no SOLIDWORKS where the macro is written, so the macro cannot be run for real. This script runs it
in LibreOffice Basic (VBA mode) against mock SOLIDWORKS objects (PX*.bas here). The mocks recognise each sketch, read
each feature call with their own idea of what its flags mean (a scenario switch changes that idea), and change the
part the way the real part would change for that reading (worked out in OpenCascade: gen.py readings). Faces and
edges are single points. A sketch counts as fully defined when it carries the relations and dimensions planned for
it; each relation is checked to fit what is selected and to be true as drawn, and each dimension reads the real
distance between the things selected. So the test shows that the macro

  - is valid Basic and passes the number of arguments the 2022 API help gives,
  - ends with every feature right whichever way SOLIDWORKS reads the flags of a boss, cut or draft,
  - puts the planned relations and dimensions on every sketch, and falls back as intended when they fail,
  - deletes what it got wrong, and says so when it cannot.

It does NOT show that SOLIDWORKS behaves the way the mocks do.

    /usr/bin/python3 run_parts_mock.py [switches ...]      (the system Python: it has the uno module)

Run from the job folder (or set SLDMACRO_JOB). The rebuild at the end needs the CAD environment: SLDMACRO_CAD_PY names
its Python (setup_env.sh sets it).
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, ".."))
try:
    import uno                                             # noqa: E402
    from com.sun.star.beans import PropertyValue           # noqa: E402
except ImportError:
    raise SystemExit("this Python has no uno module: run with the system Python that LibreOffice is installed for "
                     "(/usr/bin/python3; on Ubuntu the package is python3-uno)")
from jobcfg import job                                 # noqa: E402

JOB = job()
MACRO = JOB.macro
TRUTH = JOB.truth
MOCKS = ["PXState", "PXSw", "PXSel", "PXPt", "PXSeg", "PXEnt", "PXFeat", "PXBody", "PXDim", "PXDoc"]
CAD_PY = os.environ.get("SLDMACRO_CAD_PY") or os.path.expanduser("~/.venvs/sldmacro-cad/bin/python")
PORT = int(os.environ.get("SLDMACRO_UNO_PORT", "2002"))


def start_office(profile):
    proc = subprocess.Popen(["soffice", "--headless", "--invisible", "--norestore", "--nologo", "--nodefault",
                             f"-env:UserInstallation=file://{profile}", f"--accept=socket,host=localhost,port={PORT};urp;"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    local = uno.getComponentContext()
    resolver = local.ServiceManager.createInstanceWithContext("com.sun.star.bridge.UnoUrlResolver", local)
    for _ in range(240):
        try:
            ctx = resolver.resolve(f"uno:socket,host=localhost,port={PORT};urp;StarOffice.ComponentContext")
            return proc, ctx
        except Exception:
            time.sleep(0.5)
    proc.kill()
    raise SystemExit("LibreOffice did not start")


def bnum(v):
    if isinstance(v, bool):
        return "True" if v else "False"
    s = f"{float(v):.9f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def btext(s):
    return '"' + str(s).replace('"', "'") + '"'


def truth_module():
    d = json.load(open(TRUTH))
    body, n = [], 0

    def ent(p, s, k, pt, geo=None):
        nonlocal n
        n += 1
        body.extend([f"eP({n}) = {p}", f"eS({n}) = {s}", f'eK({n}) = "{k}"', f"eX({n}) = {bnum(pt[0])}", f"eY({n}) = {bnum(pt[1])}", f"eZ({n}) = {bnum(pt[2])}"])
        if geo:
            body.append(f'eT({n}) = "{geo[0]}"')
            body.extend(f"eG({n}, {i}) = {bnum(v)}" for i, v in enumerate(geo[1:5]))
    assert len(d["parts"]) <= 24 and all(len(p["steps"]) <= 80 for p in d["parts"]), "more parts or features than the stand-in has room for (24 x 80)"
    body.append(f"tParts = {len(d['parts'])}")
    body.append(f"tArcFailR = {bnum(arc_to_fail(d)[0])}")
    for p in d["parts"]:
        P = p["no"]
        body += [f"tTitle({P}) = {btext(p['title'])}", f"tSteps({P}) = {len(p['steps'])}"]
        for s in p["steps"]:
            S, k = s["no"], s["kind"]
            body += [f'tKind({P}, {S}) = "{k}"', f"tName({P}, {S}) = {btext(s['name'])}"]
            if k in ("ex", "mk"):
                body += [f"tSegs({P}, {S}) = {s['n']}", f"tSum({P}, {S}) = {bnum(s['sum'])}", f"tCut({P}, {S}) = {bnum(s['cut'])}",
                         f"tDraft({P}, {S}) = {bnum(s['draft'])}", f"tNarrow({P}, {S}) = {bnum(s.get('narrows', True))}", f"tFixed({P}, {S}) = {bnum(s.get('fixed', False))}",
                         f"tNRel({P}, {S}) = {s['nrel']}", f"tNMerge({P}, {S}) = {s['nmerge']}",
                         f"tNDim({P}, {S}) = {s['ndim']}", f"tN({P}, {S}) = {len(s['readings'])}"]
                for j, q in enumerate(s["readings"]):
                    body += [f"rZ0({P}, {S}, {j}) = {bnum(q['z0'])}", f"rZ1({P}, {S}, {j}) = {bnum(q['z1'])}", f"rWiden({P}, {S}, {j}) = {bnum(q['widen'])}",
                             f"rDv({P}, {S}, {j}) = {bnum(q['dv'])}", f"rDm({P}, {S}, {j}) = {bnum(q['dm'])}", f"rBodies({P}, {S}, {j}) = {q['bodies']}"]
                for e in s["eds"]:
                    ent(P, S, "R", e["p"], e["geo"])
            else:
                body += [f"tDv({P}, {S}) = {bnum(s['dv'])}", f"tDm({P}, {S}) = {bnum(s['dm'])}"]
                if k == "dr":
                    body += [f"tVal({P}, {S}) = {bnum(s['angle'])}", f"tFront({P}, {S}) = {bnum(s['front'])}",
                             f"tFlipDv({P}, {S}) = {bnum(s['flip_dv'])}", f"tFlipDm({P}, {S}) = {bnum(s['flip_dm'])}"]
                    if not s["front"]:
                        ent(P, S, "N", s["neutral"])
                else:
                    body.append(f"tVal({P}, {S}) = {bnum(s['size'] if k == 'ch' else s['r'])}")
                for pr in s["probes"]:
                    ent(P, S, "F" if k == "dr" else "E", pr)
    body.append(f"eN = {n}")
    # LibreOffice Basic refuses very long procedures: one Sub per 400 lines
    subs, calls = [], []
    for c in range(0, len(body), 400):
        name = f"LoadTruth{c // 400}"
        calls.append(f"    {name}")
        subs += [f"Sub {name}()"] + ["    " + l for l in body[c:c + 400]] + ["End Sub", ""]
    return "\n".join(["Option VBASupport 1", "Option Explicit", ""] + subs + ["Sub LoadTruth()"] + calls + ["End Sub"]), d


def arc_to_fail(d):
    """(radius, feature name) for the scenario in which one arc cannot be drawn: a radius that only one feature's
    sketch has, in a feature that is not the first of its part. (0, None) if the job has none."""
    seen = {}
    for p in d["parts"]:
        for s in p["steps"]:
            if s["kind"] == "ex":
                for g in s["segs"]:
                    if g[0] == "A":
                        r = round(((g[3] - g[1]) ** 2 + (g[4] - g[2]) ** 2) ** 0.5, 6)
                        seen.setdefault(r, set()).add((p["no"], s["no"], s["name"]))
    for r, where in sorted(seen.items()):
        if len(where) == 1:
            (pno, sno, name), = where
            if sno > 1 and not any(abs(r - o) < 1e-4 for o in seen if o != r):
                return r, name
    return 0.0, None


def transformed_macro():
    """The macro with the SOLIDWORKS-only syntax swapped for what LibreOffice Basic and the mocks take."""
    src = open(MACRO).read()
    src = re.sub(r"As SldWorks\.\w+", "As Object", src)
    src = re.sub(r"\bsw\w+_e\.(\w+)", r"\1", src)
    src = src.replace("Application.SldWorks", "PxApp()")
    src = re.sub(r"\bMsgBox ", "PxMsg ", src)
    src = src.replace('Environ$("TEMP") & "\\"', "pxFolder")
    hook = "    gPartNo = partNo\n"
    assert src.count(hook) == 1
    src = src.replace(hook, hook + "    pxNextPart = partNo\n")        # tells the stand-in which part the next document is
    assert "pxFolder" in src and "PxApp()" in src and "PxMsg " in src
    return "Option VBASupport 1\n" + src


# ---------------------------------------------------------------------------------------------- what each scenario must give
# An expectation is a function of (part, job truth) that returns the texts the run's trace + log must contain.
# What a job contains decides which expectations apply: a job without drafts cannot show "add the draft by hand".

def n_of(p, *kinds):
    return sum(1 for s in p["steps"] if s["kind"] in kinds)


def steps_of(d, *kinds):
    return [s for p in d["parts"] for s in p["steps"] if s["kind"] in kinds]


def planned(d):
    """The bosses and cuts whose sketches are defined by relations and dimensions (not traced outlines)."""
    return [s for s in steps_of(d, "ex") if not s.get("fixed")]


def made(k_off, problems):
    """'<title>: <made> of <all> features, <problems> problem(s)' with made = all - k_off."""
    return lambda p, d: [f"{p['title']}: {len(p['steps']) - k_off(p)} of {len(p['steps'])} features, {problems(p)} problem(s)."]


ALLMADE = made(lambda p: 0, lambda p: 0)
FULL = lambda p, d: [f"Sketches fully defined: {n_of(p, 'ex', 'mk')} of {n_of(p, 'ex', 'mk')}."]
# marks and traced outlines are not finished by Fully Define Sketch
FULL_BUT_MARKS = lambda p, d: [f"Sketches fully defined: {n_of(p, 'ex') - sum(1 for s in p['steps'] if s.get('fixed'))} of {n_of(p, 'ex', 'mk')}."]
RIGHT = lambda p, d: [f"PART {p['no']}: ALL RIGHT"]


def ONLY_DIMENSIONED(p, d):
    """With every relation refused and Fully Define Sketch doing nothing, the sketches that end fully defined are
    exactly those that never needed a relation: a lone circle placed by dimensions, for one. (A sketch with no
    relation but with joined end points is not judged: what refusing the joins does to it is not modelled.)"""
    exs = [s for s in p["steps"] if s["kind"] == "ex" and not s.get("fixed")]
    if any(s["nrel"] == 0 and s.get("nmerge", 0) > 0 for s in exs):
        return []
    k = sum(1 for s in exs if s["nrel"] == 0 and s["ndim"] > 0)
    return [f"{p['title']}: {len(p['steps'])} of {len(p['steps'])} features, 0 problem(s). Sketches fully defined: {k} of {n_of(p, 'ex', 'mk')}."]
OK = [ALLMADE, RIGHT]
OKF = OK + [FULL]


def has(*texts):
    return lambda p, d: list(texts)


def has_if(cond, *texts):
    """The texts, if the job has what it takes to show them (cond(job truth))."""
    return lambda p, d: list(texts) if cond(d) else []


ANY_PLANNED = lambda d: bool(planned(d))
ANY_REL = lambda d: any(s["nrel"] > 0 for s in planned(d))
ANY_DIM = lambda d: any(s["ndim"] > 0 for s in planned(d))
ANY_TAN = lambda d: any("TAN" in s.get("rel_kinds", []) for s in planned(d))
ANY_CL = lambda d: any(s.get("ncl", 0) > 0 for s in planned(d))
ANY_DRAFT = lambda d: bool(steps_of(d, "dr"))
ANY_FRONT_DRAFT = lambda d: any(s.get("front") for s in steps_of(d, "dr"))
ANY_FILLET = lambda d: bool(steps_of(d, "fi"))
ANY_FILLET_3 = lambda d: any(len(s["probes"]) >= 3 for s in steps_of(d, "fi"))
ANY_FOUND = lambda d: bool(steps_of(d, "dr", "ch", "fi"))


def scenarios(d):
    arc_r, arc_name = arc_to_fail(d)
    sc = {
        # --- SOLIDWORKS as its help reads
        "as the help reads": ("", OKF, ["drawn again more simply", "with another value than meant", "finished by Fully Define Sketch"]),
        # --- the flags of a boss or cut read the other way
        "boss and cut directions the other way": ("dir_swapped", OKF, []),
        "start offset along the plane's normal": ("offset_along_normal", OKF, []),
        "start offset against the feature": ("offset_against_dir", OKF, []),
        "wall angle flag the other way": ("ddir_swapped", OKF, []),
        "all three the other way": ("dir_swapped,ddir_swapped,offset_along_normal", OKF, []),
        "all three, offset against": ("dir_swapped,ddir_swapped,offset_against_dir", OKF, []),
        "an empty cut is still a feature": ("empty_cut_is_a_feature,dir_swapped,offset_along_normal", OKF, []),
        # --- the centre of mass
        "no centre of mass": ("no_com", OKF + [has("the centre of mass is not usable")], []),
        "no centre of mass, directions the other way": ("no_com,dir_swapped,offset_against_dir", OKF + [has("the centre of mass is not usable", "on the wrong side of the Front plane")], []),
        "centre of mass in other units": ("com_mm,dir_swapped", OKF + [has("the centre of mass is not usable")], []),
        "no centre of mass and no extreme points": ("no_com,no_extreme,dir_swapped", [has("the centre of mass is not usable"),
                                                                                       # (what the first part teaches about the flags holds for the rest)
                                                                                       lambda p, d: [f"PART 1: WRONG AND KEPT: {p['steps'][0]['name']}"] if p["no"] == 1 else []], []),
        "mass properties cannot be read": ("com_error", [has("0 of ", "STOPPED EARLY: the first body could not be made or measured.")], ["ALL RIGHT"]),
        # --- sketches: relations and dimensions
        "relations refused": ("rel_raises", OK + [FULL_BUT_MARKS, has_if(ANY_REL, "finished by Fully Define Sketch")], []),
        "relations refused, Fully Define Sketch does nothing": ("rel_raises,fds_nothing", OK + [ONLY_DIMENSIONED], []),
        "tangent relations refused": ("tangent_refused", OK + [FULL, has_if(ANY_TAN, "finished by Fully Define Sketch")], []),
        "ends already merged when drawn": ("merge_already", OKF, ["finished by Fully Define Sketch"]),
        "ends already merged, a second pick deselects": ("merge_already,append_toggles", OKF, ["finished by Fully Define Sketch"]),
        "a relation moves the sketch": ("rel_moves", OK + [FULL, has_if(ANY_REL, "drawn again more simply", "defining it moved it")], []),
        "relations and Fully Define Sketch move it": ("rel_moves,fds_moves", OK + [has_if(ANY_REL, "drawn again more simply")], []),
        "no dimensions": ("dims_nothing", OK + [FULL, has_if(ANY_DIM, "finished by Fully Define Sketch")], []),
        "dimensions read another value": ("dim_values_off", OKF + [has_if(ANY_DIM, "with another value than meant")], []),
        "dimension values unreadable": ("dim_unreadable", OKF, ["with another value than meant"]),
        "last dimension over-defines": ("dims_over", OK + [FULL, has_if(ANY_DIM, "drawn again more simply", "over defined")], []),
        "Fully Define Sketch over-defines": ("fds_over,tangent_refused", OK + [has_if(ANY_TAN, "drawn again more simply")], []),
        "sketch state unreadable": ("status_unreadable", OK + [has_if(ANY_PLANNED, "state not known")], []),
        "relations cannot be counted": ("no_relcount", OKF, []),
        "origin cannot be selected": ("origin_unselectable", OK + [FULL, has_if(ANY_PLANNED, "finished by Fully Define Sketch")], []),
        "sketch points unreadable": ("no_points", OK + [FULL, has_if(ANY_PLANNED, "finished by Fully Define Sketch")], []),
        "arcs stored the other way round": ("arc_ends_swapped", OKF, ["finished by Fully Define Sketch"]),
        "no construction lines": ("no_centerline", OK + [FULL, has_if(ANY_CL, "finished by Fully Define Sketch")], []),
        "no ActiveSketch": ("no_active_sketch", OK + [has("Sketches fully defined: 0 of ", "state not known")], []),
        "symbol fixed one segment at a time": ("fix_one_by_one", OKF, []),
        "symbol needs its points fixed too": ("fix_needs_points", OKF, []),
        # --- drafts
        "FlipDir the other way": ("draft_flip_swapped", OKF, []),
        "no draft": ("no_draft", [made(lambda p: n_of(p, "dr"), lambda p: n_of(p, "dr")), has_if(ANY_DRAFT, "Add a ", "deg draft by hand")], []),
        "no draft from the Front plane": ("no_front_draft", [has_if(ANY_FRONT_DRAFT, "deg draft by hand")], []),
        # --- finding faces and edges
        "faces and edges a little off": ("ents_shifted", OKF, []),
        # a part with drafts loses its first draft and looks less strictly after that; a part without loses its chamfers and radii
        "faces and edges further off": ("ents_far", [made(lambda p: 1 if n_of(p, "dr") else n_of(p, "ch", "fi"), lambda p: 1 if n_of(p, "dr") else n_of(p, "ch", "fi")),
                                                     has_if(ANY_DRAFT, "of its", "faces were not found")], []),
        "no GetClosestPointOn": ("no_closest", [made(lambda p: n_of(p, "dr", "ch", "fi"), lambda p: n_of(p, "dr", "ch", "fi"))], []),
        "some edges missing": ("edges_missing", OK + [has_if(ANY_FILLET_3, "were not found; rounding the rest")], []),
        # --- chamfers and fillets
        "chamfer only with mark 1": ("chamfer_mark1", OKF, []),
        "fillet only with mark 0": ("fillet_mark0", OKF, []),
        "fillet only with mark 1": ("fillet_mark1", OKF, []),
        "no fillet": ("no_fillet", [made(lambda p: n_of(p, "fi"), lambda p: n_of(p, "fi")), has_if(ANY_FILLET, "by hand")], []),
        "fillets far too big": ("fillet_huge", [made(lambda p: n_of(p, "fi"), lambda p: n_of(p, "fi"))], []),
        "no chamfer": ("no_chamfer", [made(lambda p: n_of(p, "ch"), lambda p: n_of(p, "ch"))], []),
        # --- things the macro has to give way on
        "DeleteSelection2 does nothing (EditDelete does)": ("deletesel_fails,dir_swapped", OKF, []),
        "a wrong feature cannot be deleted": ("no_delete,dir_swapped", [has("STOPPED EARLY", "A WRONG FEATURE COULD NOT BE REMOVED")], ["ALL RIGHT"]),
        "no part template": ("no_template", [has("could not open a new part")], []),
    }
    if arc_name:
        sc["an arc cannot be drawn"] = ("arc_fails", [has(f"{arc_name}: its sketch could not be drawn")], [])
    return sc


def verdicts(trace, d):
    """One line per part: ALL RIGHT, or what is missing or wrong."""
    out = []
    parts = {p["no"]: p for p in d["parts"]}
    blocks = re.split(r"^PART\|", trace, flags=re.M)[1:]
    for b in blocks:
        no = int(b.split("\n", 1)[0])
        p = parts[no]
        feats = [l.split("|") for l in b.splitlines() if l.startswith("FEAT|")]
        got = {}
        for f in feats:
            got.setdefault(int(f[3]), []).append(f[4] == "True")
        names = {s["no"]: s["name"] for s in p["steps"]}
        wrong = [names[k] for k, v in got.items() if not all(v)]
        twice = [names[k] for k, v in got.items() if len(v) > 1]
        missing = [names[s["no"]] for s in p["steps"] if s["no"] not in got]
        if not wrong and not twice and not missing:
            out.append(f"PART {no}: ALL RIGHT")
        else:
            out.append(f"PART {no}: " + (f"WRONG AND KEPT: {', '.join(wrong)}. " if wrong else "") + (f"TWICE: {', '.join(twice)}. " if twice else "") +
                       (f"MISSING: {', '.join(missing)}." if missing else ""))
    return "\n".join(out)


def main():
    args = sys.argv[1:]
    only = None
    if args and args[0] == "--only":            # --only "name of a scenario": that one, with its expectations
        only, args = args[1], args[2:]
    wanted = args                               # bare switches: run them and print everything, expect nothing
    if not os.path.exists(MACRO) or not os.path.exists(TRUTH):
        raise SystemExit(f"no macro for this job yet ({MACRO}): run gen.py emit first")
    raw = open(MACRO, "rb").read()
    if raw.count(b"\n") != raw.count(b"\r\n"):
        raise SystemExit("the macro has bare LF line endings: write it with gen.py emit")
    truth, d = truth_module()
    log_name = d.get("log_name") or JOB.log_name
    SCENARIOS = scenarios(d)
    if only and only not in SCENARIOS:
        raise SystemExit(f"no scenario {only!r}; there are: " + "; ".join(SCENARIOS))
    root = tempfile.mkdtemp(prefix="sw_parts_")
    proc, ctx = start_office(os.path.join(root, "profile"))
    bad = n_run = 0
    trace0 = None
    desktop = None
    try:
        desktop = ctx.ServiceManager.createInstanceWithContext("com.sun.star.frame.Desktop", ctx)
        args = (PropertyValue("Hidden", 0, True, 0), PropertyValue("MacroExecutionMode", 0, 4, 0))
        doc = desktop.loadComponentFromURL("private:factory/scalc", "_blank", 0, args)
        libs = doc.BasicLibraries
        if not libs.hasByName("Standard"):
            libs.createLibrary("Standard")
        lib = libs.getByName("Standard")
        for m in MOCKS:
            lib.insertByName(m, open(os.path.join(HERE, m + ".bas")).read())
        lib.insertByName("PXTruth", truth)
        lib.insertByName("Macro", transformed_macro())
        script = doc.getScriptProvider().getScript("vnd.sun.star.script:Standard.PXState.PxRun?language=Basic&location=document")
        built = d["parts"]
        if wanted:
            runs = [(w, (w, [], [])) for w in wanted]
        elif only:
            runs = [(only, SCENARIOS[only])]
        else:
            runs = list(SCENARIOS.items())
        for name, (opts, expect, never) in runs:
            folder = os.path.join(root, "out") + "/"
            shutil.rmtree(folder, ignore_errors=True)
            os.makedirs(folder)
            t0 = time.time()
            n_run += 1
            try:
                trace = script.invoke((opts, folder), (), ())[0] or ""
            except Exception as e:
                print(f"\n##### {name}: BASIC ERROR\n{e}")
                bad += 1
                continue
            log_path = os.path.join(folder, log_name)
            log = open(log_path).read() if os.path.exists(log_path) else "(no log file)"
            text = trace + "\n" + log + "\n" + verdicts(trace, d)
            want = []
            for e in expect:
                for p in built:
                    want += e(p, d)
            missing = [e for e in dict.fromkeys(want) if e not in text] + [f"(has '{n}')" for n in never if n in text]
            if "PROBLEM:" in trace:
                missing.append("(the stand-in was used in a way SOLIDWORKS would not take: " +
                               "; ".join(sorted(set(l for l in trace.splitlines() if "PROBLEM:" in l)))[:600] + ")")
            if "LOOSE SKETCH" in trace and "deletesel_fails" not in opts and "no_delete" not in opts:
                missing.append("(a sketch without a feature was left in the tree)")
            # every part is built, each once
            got = [int(b.split("\n", 1)[0]) for b in re.split(r"^PART\|", trace, flags=re.M)[1:]]
            if "no_template" not in opts and not wanted and sorted(got) != [p["no"] for p in built]:
                missing.append(f"(parts built: {sorted(got)}; wanted {[p['no'] for p in built]})")
            tries = len(re.findall(r" try \d+ \[", log))
            if wanted or missing:
                print(f"\n##### {name} [{opts}]\n{text}")
            print(f"{'FAIL' if missing else 'ok  '}  {name}  ({tries} wrong tries undone, {time.time() - t0:.0f} s)" +
                  (f"  missing: {missing}" if missing else ""), flush=True)
            bad += bool(missing)
            if trace0 is None and not opts:
                trace0 = os.path.join(root, "trace.txt")
                open(trace0, "w").write(trace)
        doc.close(True)
    finally:
        try:
            desktop.terminate()
        except Exception:
            pass
        time.sleep(1)
        proc.kill()
    if not wanted:
        print(f"{n_run} scenario runs, {bad} failed")
    if trace0:
        if not os.path.exists(CAD_PY):
            print(f"(no CAD Python at {CAD_PY}: set SLDMACRO_CAD_PY; the rebuild was NOT run)")
            bad += 1
        else:
            print("\nrebuilding what the macro drew (build123d):", flush=True)
            r = subprocess.run([CAD_PY, os.path.join(HERE, "..", "gen.py"), "rebuild", trace0], capture_output=True, text=True,
                               cwd=JOB.dir, env=dict(os.environ, SLDMACRO_JOB=JOB.dir))
            print("\n".join(l for l in (r.stdout + r.stderr).splitlines() if "WARN" not in l and "Fontconfig" not in l), flush=True)
            if r.returncode != 0:
                print(f"(the rebuild ended with code {r.returncode})")
            bad += r.returncode != 0
    shutil.rmtree(root, ignore_errors=True)
    print("STAND-IN: " + ("ALL PASS" if not bad else f"{bad} FAILED"))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
