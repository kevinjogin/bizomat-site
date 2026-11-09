"""Checks of the Fly configs the platform depends on (CI, the proxy job; Python 3.11+, no packages):

    python3 infrastructure/fly/test/check-config.py fly.toml fly.website.toml

For each file: the app is bizomat; the only public service is on the proxy group (a service on another group would
be exposed on the app's addresses); every group has a Machine size, a restart policy and a check; work and cad each
have exactly one volume of their own at /data (a Machine's volume is never shared); CAD Automation's address is
https://bizomat.ai/cad; UPSTREAM_CAD is either the old cados app or this app's cad group (bizomat.ps1 move cad switches
the running router; the file follows in a pull request, and bizomat.ps1 deploy website refuses while they differ).

fly.website.toml is what production runs (9 Nov 2026): the groups proxy, web and work only, the volume work_data, and
CAD Automation in its own Fly app, so UPSTREAM_CAD must be the cados app. fly.toml, the single-app plan that is not
deployed, keeps the four groups.
"""

from __future__ import annotations

import sys
import tomllib

CADOS = "http://cados.internal:8080"
CAD_GROUP = "http://cad.process.bizomat.internal:8001"
GROUPS = {"proxy", "web", "work", "cad"}
VOLUMES = {"work": "work_data", "cad": "cad_data"}
# Production (the Fly app bizomat as it runs): CAD Automation is the separate app cados.
PRODUCTION = "fly.website.toml"
PRODUCTION_GROUPS = {"proxy", "web", "work"}


def check(path: str) -> list[str]:
    with open(path, "rb") as fh:
        c = tomllib.load(fh)
    bad: list[str] = []
    if c.get("app") != "bizomat":
        bad.append("app is not bizomat")
    production = path.replace("\\", "/").rsplit("/", 1)[-1] == PRODUCTION
    expected = PRODUCTION_GROUPS if production else GROUPS
    groups = set(c.get("processes", {}))
    if groups != expected:
        bad.append(f"process groups {sorted(groups)}, expected {sorted(expected)}")
    if "services" in c:
        bad.append("[[services]] would be public on every group: only [http_service] on proxy")
    if c.get("http_service", {}).get("processes") != ["proxy"]:
        bad.append("[http_service] must be on the proxy group only")
    env = c.get("env", {})
    if production and env.get("UPSTREAM_CAD") != CADOS:
        bad.append(f"UPSTREAM_CAD is {env.get('UPSTREAM_CAD')!r}: production sends /cad to the cados app ({CADOS})")
    elif env.get("UPSTREAM_CAD") not in (CADOS, CAD_GROUP):
        bad.append(f"UPSTREAM_CAD is {env.get('UPSTREAM_CAD')!r}: the cados app ({CADOS}) or the cad group ({CAD_GROUP})")
    if env.get("OPENSKETCH_PUBLIC_URL") != "https://bizomat.ai/cad":
        bad.append("OPENSKETCH_PUBLIC_URL must be https://bizomat.ai/cad (connectors and paired computers use it)")
    if not env.get("UPSTREAM_WORK", "").startswith("http://work.process.bizomat.internal:"):
        bad.append("UPSTREAM_WORK must be the work group")
    checked = {g for k in c.get("checks", {}).values() for g in k.get("processes", [])}
    sized = {g for v in c.get("vm", []) for g in v.get("processes", [])}
    restarted = {g for r in c.get("restart", []) for g in r.get("processes", []) if r.get("policy") == "always"}
    for g in sorted(groups):
        if g not in checked:
            bad.append(f"no check for the {g} group")
        if g not in sized:
            bad.append(f"no [[vm]] size for the {g} group")
    for g in sorted({"work", "cad"} & expected):
        if g not in restarted:
            bad.append(f"the {g} group has no [[restart]] policy always")
    mounts = c.get("mounts", [])
    for g, source in VOLUMES.items():
        if g not in expected:
            if any(g in m.get("processes", []) or m.get("source") == source for m in mounts):
                bad.append(f"the volume {source} of the {g} group is not part of this configuration")
            continue
        mine = [m for m in mounts if g in m.get("processes", [])]
        if len(mine) != 1 or mine[0].get("source") != source or mine[0].get("destination") != "/data" or mine[0].get("processes") != [g]:
            bad.append(f"the {g} group needs exactly one volume {source} at /data, of its own")
    if len({m.get("source") for m in mounts}) != len(mounts):
        bad.append("two groups share a volume name")
    cad_vm = [v for v in c.get("vm", []) if v.get("processes") == ["cad"]]
    if "cad" in expected and (not cad_vm or cad_vm[0].get("size") != "performance-1x" or cad_vm[0].get("memory") != "2gb"):
        bad.append("cad keeps the cados Machine's size: performance-1x, 2gb")
    if "cad" not in expected and cad_vm:
        bad.append("a [[vm]] for the cad group, which this configuration does not run")
    return bad


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__.strip(), file=sys.stderr)
        return 64
    failed = False
    for path in argv[1:]:
        problems = check(path)
        for p in problems:
            print(f"{path}: {p}", file=sys.stderr)
        if problems:
            failed = True
        else:
            print(f"{path} ok")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
