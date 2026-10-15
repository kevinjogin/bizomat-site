"""One command for the whole job of turning parts into a SOLIDWORKS macro.

    sldmacro new <folder> [--name Name] [--title "Title"]     a new, empty job
    sldmacro look <file.step> [...]                           look at a solid (see look.py for the options)
    sldmacro quick [part ...]                                 the features against the source solid, one summary each
    sldmacro check [part ...]                                 the same, feature by feature
    sldmacro plan  [part ...]                                 the relations and dimensions planned for every sketch
    sldmacro where [part ...] [--upto N]                      where features and source differ: each piece, its volume and box
    sldmacro emit  [part ...]                                 writes out/<NAME>.bas and out/expected.json
    sldmacro verify [--skip-standin]                          the four checks of the macro; writes out/verify.json
    sldmacro standin "<scenario>" | --switches a,b            one stand-in scenario, everything printed
    sldmacro names                                            scan engine.bas for names that differ only in case

Run from the job folder (the one with job.py), after `source ~/.sldmacro/env.sh` (scripts/setup_env.sh writes it).
Every command exits 0 only if what it checked is all right.
"""
import json
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
CAD_PY = os.environ.get("SLDMACRO_CAD_PY") or os.path.expanduser("~/.venvs/sldmacro-cad/bin/python")
SLVS_PY = os.environ.get("SLDMACRO_SLVS_PY") or os.path.expanduser("~/.venvs/sldmacro-slvs/bin/python")
SYS_PY = os.environ.get("SLDMACRO_SYS_PY") or "/usr/bin/python3"

JOB_PY = '''"""This job: what the macro is called and which parts it builds (in this order)."""
NAME = "{name}"            # the macro is out/{name}.bas; its log is %TEMP%\\\\{name}_log.txt
TITLE = "{title}"          # first line of the macro: plain ASCII
PARTS = []                 # recipe keys, in build order: recipes/<key>.py
'''

RECIPE_PY = '''"""<What this part is, in one line.>"""
from core import Ch, Dr, Ex, Fi, Mk, PART_FRAME, Part, circle, circle_edges, rect, rrect
from source import oriented, step


def source():
    # The solid as the recipe sees it: the main flat face on Z = 0, features along Z, the origin where the first sketch
    # is centred (the centre of the base outline, or the part's axis).
    return oriented(step("src/<file>.step"), z=(0, 0, 1), x=(1, 0, 0), origin=(0.0, 0.0, 0.0))


def part():
    steps = [
        # Ex(name, "add" | "cut", z0, z1, [outlines], "note for the feature table", refs=("earlier feature",))
        Ex("base", "add", 0.0, 5.0, [rrect(-20.0, -10.0, 20.0, 10.0, 2.0)], "40 x 20, R2 corners, 5 thick"),
    ]
    return Part("<key>", "<Title>", PART_FRAME, steps, src=source,
                notes=[],                       # every intended difference from the source, in words
                where="origin at the centre of the base outline; Front plane = <which face>")
'''


def clean(text):
    return "\n".join(l for l in text.splitlines() if "WARN" not in l and "Fontconfig" not in l and "Picked up JAVA_TOOL_OPTIONS" not in l)


def run(py, script, args, capture=False):
    env = dict(os.environ)
    env.setdefault("SLDMACRO_JOB", os.getcwd())
    env["SLDMACRO_CAD_PY"] = CAD_PY
    env["PYTHONPATH"] = HERE + os.pathsep + env.get("PYTHONPATH", "")
    cmd = [py, os.path.join(HERE, script)] + list(args)
    if capture:
        r = subprocess.run(cmd, env=env, capture_output=True, text=True)
        return r.returncode, clean(r.stdout + r.stderr)
    pr = subprocess.Popen(cmd, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    for line in pr.stdout:
        if "WARN" not in line and "Fontconfig" not in line:
            sys.stdout.write(line)
            sys.stdout.flush()
    return pr.wait(), ""


def need(py, what):
    if not os.path.exists(py):
        raise SystemExit(f"{what} is not set up ({py} is missing): run scripts/setup_env.sh first, then `source ~/.sldmacro/env.sh`")


def cmd_new(args):
    if not args:
        raise SystemExit("sldmacro new <folder> [--name Name] [--title \"Title\"]")
    folder = os.path.abspath(args[0])
    name = os.path.basename(folder).replace(" ", "_")
    title = name.replace("_", " ")
    for i, a in enumerate(args[1:], 1):
        if a == "--name":
            name = args[i + 1]
        if a == "--title":
            title = args[i + 1]
    if os.path.exists(os.path.join(folder, "job.py")):
        raise SystemExit(f"{folder} already has a job.py")
    for d in ("recipes", "src", "out"):
        os.makedirs(os.path.join(folder, d), exist_ok=True)
    open(os.path.join(folder, "job.py"), "w").write(JOB_PY.format(name=name, title=title.replace('"', "'")))
    open(os.path.join(folder, "recipes", "__init__.py"), "w").write("")
    open(os.path.join(folder, "recipes", "_example.py.txt"), "w").write(RECIPE_PY)
    print(f"new job in {folder}: put the STEP files in src/, write recipes/<key>.py (a starting point: recipes/_example.py.txt), list the keys in job.py")
    return 0


def cmd_verify(args):
    """The checks of the macro as written. Each is a separate program that reads the macro text itself."""
    sys.path.insert(0, HERE)
    from jobcfg import job
    j = job()
    if not os.path.exists(j.macro):
        raise SystemExit(f"no macro yet ({j.macro}): run `sldmacro emit` first")
    res, t_all = {}, time.time()
    stamp = dict(macro=os.path.basename(j.macro), bytes=os.path.getsize(j.macro), lines=open(j.macro, newline="").read().count("\r\n"),
                 macro_mtime=os.path.getmtime(j.macro))

    def step(key, title, fn):
        t0 = time.time()
        print(f"\n=== {title}", flush=True)
        try:
            ok, summary = fn()
        except SystemExit as e:
            ok, summary = False, f"could not run: {e}"
        except Exception as e:
            ok, summary = False, f"could not run: {type(e).__name__}: {e}"
        res[key] = dict(ok=bool(ok), summary=summary, seconds=round(time.time() - t0, 1))
        print(f"--- {title}: {'PASS' if ok else 'FAIL'}: {summary}", flush=True)

    def sketches():
        need(SLVS_PY, "the sketch solver")
        code, out = run(SLVS_PY, "check_sketches.py", [], capture=True)
        bad = [l for l in out.splitlines() if l.startswith("FAIL")]
        print("\n".join(bad[:40]) if bad else "\n".join(out.splitlines()[-3:]))
        last = [l for l in out.splitlines() if "sketches," in l]
        return code == 0 and "SKETCHES: ALL PASS" in out, (last[-1] if last else out[-300:])

    def standin():
        if "--skip-standin" in args:
            return False, "skipped on request (--skip-standin): NOT checked"
        code, out = run(SYS_PY, os.path.join("mock", "run_parts_mock.py"), [], capture=True)
        show = [l for l in out.splitlines() if l.startswith(("FAIL", "#####")) or "scenario runs" in l or "bosses, cuts and marks" in l
                or "STAND-IN" in l or "rebuild" in l.lower()]
        print("\n".join(show[-80:]) if show else out[-3000:])
        open(os.path.join(j.out, "standin.log"), "w").write(out)
        n = [l for l in out.splitlines() if "scenario runs" in l]
        same = sum(1 for l in out.splitlines() if l.rstrip().endswith("(same)"))
        return code == 0 and "STAND-IN: ALL PASS" in out, (n[-1] if n else "no scenario count") + f"; rebuild: {same} part(s) the same as the recipe"

    def grammar():
        code, out = run(SYS_PY, "check_grammar.py", [j.macro], capture=True)
        line = [l for l in out.splitlines() if l.startswith("GRAMMAR")]
        print(out[-1500:] if code else (line[-1] if line else out[-300:]))
        return code == 0, (line[-1] if line else out[-200:])

    def text():
        raw = open(j.macro, "rb").read()
        s = raw.decode("ascii", errors="replace")
        lines = s.split("\r\n")
        problems = []
        if raw.count(b"\n") != raw.count(b"\r\n"):
            problems.append("bare LF line endings")
        if any(ord(c) > 127 for c in s):
            problems.append("non-ASCII characters")
        if max(len(l) for l in lines) >= 1023:
            problems.append("a line of 1023 characters or more")
        if len(lines) > 65534:
            problems.append(f"{len(lines)} lines (a module takes 65,534)")
        if "@@" in s:
            problems.append("an unfilled @@ placeholder")
        # the size of every procedure: VBA takes 64 K of compiled code per procedure; generated ones are cut at 250 statements
        big, name, n = [], None, 0
        for l in lines:
            w = l.strip().split("(")[0].split()
            if len(w) >= 2 and w[-2] in ("Sub", "Function") and not l.strip().startswith("'") and "End" not in w[:1]:
                name, n = w[-1], 0
            elif l.strip() in ("End Sub", "End Function"):
                if name and n > 420:
                    big.append(f"{name} ({n} lines)")
                name = None
            elif name:
                n += 1
        if big:
            problems.append("long procedures: " + ", ".join(big[:5]))
        code, out = run(SYS_PY, "check_names.py", [j.macro], capture=True)
        if code:
            problems.append("names that differ only in case, or a local name that hides a module-level one: " + out.strip()[-400:])
        return not problems, ("; ".join(problems) if problems else f"{len(lines) - 1} lines, CR LF, ASCII, longest line {max(len(l) for l in lines)}, no name hides another")

    step("sketches", "sketch solver (SolveSpace): every sketch 0 degrees of freedom, comes back when pushed", sketches)
    step("standin", "stand-in for SOLIDWORKS (LibreOffice Basic): every scenario, then the rebuild", standin)
    step("grammar", "VBA grammar (ANTLR): the file parses", grammar)
    step("text", "the file itself: line endings, characters, sizes, names", text)
    ok = all(v["ok"] for v in res.values())
    truth = json.load(open(j.truth))
    stamp.update(ok=ok, checks=res, parts=[dict(key=p["key"], title=p["title"], features=len(p["steps"]),
                                                 sketches=sum(1 for s in p["steps"] if s["kind"] in ("ex", "mk"))) for p in truth["parts"]],
                 seconds=round(time.time() - t_all, 1), when=time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()))
    json.dump(stamp, open(os.path.join(j.out, "verify.json"), "w"), indent=1)
    print(f"\nVERIFY: {'ALL PASS' if ok else 'FAILED: ' + ', '.join(k for k, v in res.items() if not v['ok'])}   ({stamp['seconds']:.0f} s; out/verify.json)")
    return 0 if ok else 1


def main(argv):
    if not argv or argv[0] in ("-h", "--help", "help"):
        print(__doc__)
        return 0
    cmd, args = argv[0], argv[1:]
    if cmd == "new":
        return cmd_new(args)
    if cmd == "look":
        need(CAD_PY, "the CAD environment")
        return run(CAD_PY, "look.py", args)[0]
    if cmd in ("quick", "check", "plan", "where"):
        need(CAD_PY, "the CAD environment")
        return run(CAD_PY, "parts.py", [cmd] + args)[0]
    if cmd == "emit":
        need(CAD_PY, "the CAD environment")
        return run(CAD_PY, "gen.py", ["emit"] + args)[0]
    if cmd == "verify":
        return cmd_verify(args)
    if cmd == "standin":
        if args and args[0] == "--switches":
            return run(SYS_PY, os.path.join("mock", "run_parts_mock.py"), args[1].split() if len(args) > 1 else [""])[0]
        return run(SYS_PY, os.path.join("mock", "run_parts_mock.py"), (["--only", args[0]] if args else []))[0]
    if cmd == "names":
        return run(SYS_PY, "check_names.py", args or [os.path.join(HERE, "engine.bas")])[0]
    print(f"unknown command {cmd!r}\n{__doc__}")
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
