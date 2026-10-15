"""Where the job is and what it is called.

A job is a folder:

    <job>/job.py            NAME, TITLE, PARTS (and optionally INTRO)
    <job>/recipes/<key>.py  one per part: part() returns a core.Part
    <job>/src/              the source solids (STEP files), or the design code
    <job>/out/              what the generator writes: <NAME>.bas, expected.json
    <job>/_cache, _work     working files (safe to delete)

The job folder is the current directory, or SLDMACRO_JOB if that is set.
"""
import importlib.util
import os
import re
import sys

ENGINE = os.path.dirname(os.path.abspath(__file__))


def job_dir():
    return os.path.abspath(os.environ.get("SLDMACRO_JOB") or os.getcwd())


class Job:
    def __init__(self, folder=None):
        self.dir = os.path.abspath(folder or job_dir())
        path = os.path.join(self.dir, "job.py")
        if not os.path.exists(path):
            raise SystemExit(f"no job.py in {self.dir}: run from the job folder (or set SLDMACRO_JOB). "
                             f"A new job: python {os.path.join(ENGINE, 'sldmacro.py')} new <folder>")
        spec = importlib.util.spec_from_file_location("_sldmacro_job_settings", path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        self.name = str(getattr(mod, "NAME", os.path.basename(self.dir)))
        if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]{0,48}", self.name):
            raise SystemExit(f"job.py: NAME = {self.name!r}: letters, digits, _ and - only (it names the macro file and its log)")
        self.title = str(getattr(mod, "TITLE", self.name))
        self.intro = getattr(mod, "INTRO", None)
        self.parts = list(getattr(mod, "PARTS", []))
        if len(set(self.parts)) != len(self.parts):
            raise SystemExit("job.py: PARTS names a part twice")
        self.out = os.path.join(self.dir, "out")
        self.macro = os.path.join(self.out, self.name + ".bas")
        self.truth = os.path.join(self.out, "expected.json")
        self.log_name = self.name + "_log.txt"
        self.cache = os.path.join(self.dir, "_cache")
        self.work = os.path.join(self.dir, "_work")

    def use(self):
        """Makes the job's recipes importable (import recipes.<key>) and its folder the place relative paths start from."""
        if self.dir not in sys.path:
            sys.path.insert(0, self.dir)
        return self


_job = None


def job():
    global _job
    if _job is None or _job.dir != job_dir():
        _job = Job().use()
    return _job
