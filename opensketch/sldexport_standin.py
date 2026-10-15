"""The assembly stand-in: runs OpenSketch's part of the SOLIDWORKS macro (STEP import, saving, components,
mates) in LibreOffice Basic against mock SOLIDWORKS objects (sldexport_mock/*.bas).

The mocks hold each part's real faces (planes and cylinders, from the part solid in its SOLIDWORKS frame) and
check every mate against that geometry where the components are: a mate that does not hold moves a free
component, as SOLIDWORKS would. Scenarios change how the mock reads what the help does not settle (the order
of the rotation numbers of a transform, which way Flip and Closest act) and take away API calls the macro
has fallbacks for. A run passes if every component ends where OpenSketch has it, every mate is made and holds,
and the mocks saw no call SOLIDWORKS would refuse.

It does NOT show that SOLIDWORKS behaves the way the mocks do. It needs LibreOffice with python3-uno: run it
with that Python (the toolchain's SLDMACRO_SYS_PY), as a separate process.

    python3 sldexport_standin.py <job.json>     (written by sldexport.export)  -> prints JSON
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
MOCKS = ["OXState", "OXApp", "OXMath", "OXXf", "OXPt", "OXSD", "OXBody", "OXFace", "OXFeat", "OXEnt", "OXComp", "OXDoc"]
PORT = int(os.environ.get("OSK_UNO_PORT", "2012"))

SCENARIOS = {
    "as the help reads": "",
    "rotation numbers read the other way": "xf_transposed",
    "no GetCorresponding (faces found on the component's bodies)": "no_corresponding",
    "no GetCorresponding, component bodies in part space": "no_corresponding,comp_bodies_part_space",
    "Closest alignment picks the wrong side": "closest_flips",
    "the first try of each mate is refused": "first_try_errors",
    "Flip of a distance mate acts the other way": "flip_other_way",
    "no FeatureByName (planes picked by name)": "no_feature_by_name",
    "all of the above": "xf_transposed,no_corresponding,closest_flips,first_try_errors,flip_other_way,no_feature_by_name",
}


def bnum(v):
    s = f"{float(v):.12g}"
    return "0" if s in ("-0", "") else s


def truth_module(t):
    body = [f"tNP = {len(t['parts'])}"]
    n = 0
    for i, p in enumerate(t["parts"], 1):
        body += [f'tStep({i}) = "{p["step"]}"', f'tTitle({i}) = "{p["title"]}"']
        for f in p["faces"]:
            n += 1
            body += [f"fPart({n}) = {i}", f'fKind({n}) = "{f["kind"]}"']
            body += [f"fG({n}, {k}) = {bnum(v)}" for k, v in enumerate(f["g"])]
            body += [f"fB({n}, {k}) = {bnum(v)}" for k, v in enumerate(f["box"])]
    body.append(f"fN = {n}")
    subs, calls = [], []
    for c in range(0, len(body), 300):
        nm = f"LoadTruth{c // 300}"
        calls.append(f"    {nm}")
        subs += [f"Sub {nm}()"] + ["    " + l for l in body[c:c + 300]] + ["End Sub", ""]
    return "\n".join(["Option VBASupport 1", "Option Explicit", ""] + subs + ["Sub LoadTruth()"] + calls + ["End Sub"])


def transformed(text):
    src = text.replace("\r\n", "\n")
    src = re.sub(r"As SldWorks\.\w+", "As Object", src)
    src = re.sub(r"\bsw\w+_e\.(\w+)", r"\1", src)
    src = src.replace("Application.SldWorks", "OxSwApp()")
    src = re.sub(r"\bMsgBox ", "OxMsg ", src)
    src = src.replace('Environ$("TEMP") & "\\"', "oxFolder")
    src = src.replace("Dir$(", "OxDir(")
    src = re.sub(r"\bMkDir ", "OxMkDir ", src)
    assert "OxSwApp()" in src and "oxFolder" in src
    return "Option VBASupport 1\n" + src


def judge(trace, log, t):
    bad = []
    if "PROBLEM:" in trace:
        bad.append("; ".join(sorted({l for l in trace.splitlines() if "PROBLEM:" in l}))[:600])
    comps = [l.split("|") for l in trace.splitlines() if l.startswith("COMP|")]
    if len(comps) != len(t["comps"]):
        bad.append(f"{len(comps)} components in the assembly, {len(t['comps'])} wanted")
    for c, want in zip(comps, t["comps"]):
        got = [float(x) for x in c[3].split()]
        if max(abs(a - b) for a, b in zip(got, want["xf"])) > 1e-7:
            bad.append(f"component {c[1]} is not where OpenSketch has it")
        if (c[2] == "fixed") != want["fixed"]:
            bad.append(f"component {c[1]} is {c[2]}, wanted {'fixed' if want['fixed'] else 'free'}")
    mates = [l.split("|") for l in trace.splitlines() if l.startswith("MATE|")]
    if len(mates) != t["mates"]:
        bad.append(f"{len(mates)} mates made, {t['mates']} wanted")
    broken = [m[1] for m in mates if m[2] != "holds"]
    if broken:
        bad.append("mates that do not hold: " + ", ".join(broken))
    if t["mates"] and f"{t['mates']} of {t['mates']} mates made" not in trace:
        bad.append("the message does not say every mate was made")
    if "STOPPED" in trace:
        bad.append("the macro stopped: " + [l for l in trace.splitlines() if "STOPPED" in l][0][:300])
    return bad


def run(t, macro_text):
    import uno
    from com.sun.star.beans import PropertyValue
    root = tempfile.mkdtemp(prefix="osk_asm_standin_")
    proc = subprocess.Popen(["soffice", "--headless", "--invisible", "--norestore", "--nologo", "--nodefault",
                             f"-env:UserInstallation=file://{root}/profile", f"--accept=socket,host=localhost,port={PORT};urp;"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    local = uno.getComponentContext()
    resolver = local.ServiceManager.createInstanceWithContext("com.sun.star.bridge.UnoUrlResolver", local)
    ctx = None
    for _ in range(240):
        try:
            ctx = resolver.resolve(f"uno:socket,host=localhost,port={PORT};urp;StarOffice.ComponentContext")
            break
        except Exception:
            time.sleep(0.5)
    if ctx is None:
        proc.kill()
        return {"ok": False, "summary": "LibreOffice did not start", "runs": []}
    out = []
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
            lib.insertByName(m, open(os.path.join(HERE, "sldexport_mock", m + ".bas")).read())
        lib.insertByName("OXTruth", truth_module(t))
        lib.insertByName("Macro", transformed(macro_text))
        script = doc.getScriptProvider().getScript("vnd.sun.star.script:Standard.OXState.OxRun?language=Basic&location=document")
        for name, opts in SCENARIOS.items():
            folder = os.path.join(root, "out") + "/"
            shutil.rmtree(folder, ignore_errors=True)
            os.makedirs(folder)
            t0 = time.time()
            try:
                trace = script.invoke((opts, folder), (), ())[0] or ""
            except Exception as e:
                out.append({"scenario": name, "ok": False, "problems": [f"Basic error: {e}"]})
                continue
            lp = os.path.join(folder, t["log_name"])
            log = open(lp).read() if os.path.exists(lp) else ""
            bad = judge(trace + "\n" + log, log, t)
            out.append({"scenario": name, "ok": not bad, "problems": bad, "seconds": round(time.time() - t0, 1),
                        **({"trace": (trace + "\n" + log)[-6000:]} if bad else {})})
        doc.close(True)
    finally:
        try:
            desktop.terminate()
        except Exception:
            pass
        time.sleep(1)
        proc.kill()
        shutil.rmtree(root, ignore_errors=True)
    ok = all(r["ok"] for r in out)
    return {"ok": ok, "summary": f"{sum(r['ok'] for r in out)} of {len(out)} scenarios pass", "runs": out}


if __name__ == "__main__":
    job = json.load(open(sys.argv[1]))
    print(json.dumps(run(job["truth"], open(job["macro"]).read())))
