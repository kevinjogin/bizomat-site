"""Checks of the Fly configs the platform depends on (CI, the proxy job; Python 3.11+, no packages):

    python3 infrastructure/fly/test/check-config.py fly.toml fly.website.toml

For each file: the app is bizomat in syd; every group has a Machine size, a restart policy and a check; work and cad
each have exactly one volume of their own at /data (a Machine's volume is never shared); CAD Automation's address is
https://bizomat.ai/cad.

fly.website.toml is what production runs: one Machine since 10 Nov 2026. The group work (its Machine holds the volume
work_data, daily snapshots kept 30 days) runs `bizomat-entrypoint all`: the router, the website and Project Management
together, so the public service and the three health checks (8080, 8003, 8002) are on work, the router reaches the
other two on 127.0.0.1, kill_timeout covers the entrypoint's stop (12 s for the router, then 12 s), and the Machine is
a shared CPU. CAD Automation is its own Fly app, so UPSTREAM_CAD must be the cados app and no cad group or volume is
here.

fly.toml, the single-app plan that is not deployed, keeps the four groups with the public service on proxy; its
UPSTREAM_CAD is either the old cados app or this app's cad group.
"""

from __future__ import annotations

import sys
import tomllib

CADOS = "http://cados.internal:8080"
CAD_GROUP = "http://cad.process.bizomat.internal:8001"
GROUPS = {"proxy", "web", "work", "cad"}
VOLUMES = {"work": "work_data", "cad": "cad_data"}
# Production (the Fly app bizomat): one Machine, the work group's, running all three services; CAD Automation is the
# separate app cados.
PRODUCTION = "fly.website.toml"
PRODUCTION_GROUPS = {"work"}
ALL_COMMAND = "/usr/local/bin/bizomat-entrypoint all"
LOOPBACK = {"UPSTREAM_WEB": "http://127.0.0.1:8003", "UPSTREAM_WORK": "http://127.0.0.1:8002"}
ALL_CHECK_PORTS = {8080, 8003, 8002}
MIN_KILL_TIMEOUT = 26  # the entrypoint's all: 12 s for the router, then 12 s for web and work, and a margin


def check(path: str) -> list[str]:
    with open(path, "rb") as fh:
        c = tomllib.load(fh)
    bad: list[str] = []
    if c.get("app") != "bizomat":
        bad.append("app is not bizomat")
    if c.get("primary_region") != "syd":
        bad.append(f"primary_region is {c.get('primary_region')!r}: the app and its volume are in syd")
    production = path.replace("\\", "/").rsplit("/", 1)[-1] == PRODUCTION
    expected = PRODUCTION_GROUPS if production else GROUPS
    groups = set(c.get("processes", {}))
    if groups != expected:
        bad.append(f"process groups {sorted(groups)}, expected {sorted(expected)}")
    public = ["work"] if production else ["proxy"]
    if "services" in c:
        bad.append(f"[[services]] would be public on every group: only [http_service] on {public[0]}")
    if c.get("http_service", {}).get("processes") != public:
        bad.append(f"[http_service] must be on the {public[0]} group only (the router's group)")
    if c.get("http_service", {}).get("internal_port") != 8080:
        bad.append("[http_service] internal_port must be the router's, 8080")
    env = c.get("env", {})
    if production:
        if c.get("processes", {}).get("work") != ALL_COMMAND:
            bad.append(f"the work group must run {ALL_COMMAND!r} (the router, the website and Project Management)")
        for name, value in LOOPBACK.items():
            if env.get(name) != value:
                bad.append(f"{name} is {env.get(name)!r}: on one Machine the router reaches it at {value}")
        ports = {k.get("port") for k in c.get("checks", {}).values() if k.get("processes") == ["work"]}
        if not ALL_CHECK_PORTS <= ports:
            bad.append(f"the work group needs a check on each of {sorted(ALL_CHECK_PORTS)} (router, website, Project Management); has {sorted(p for p in ports if p)}")
        if int(c.get("kill_timeout", 5)) < MIN_KILL_TIMEOUT:
            bad.append(f"kill_timeout {c.get('kill_timeout')} is shorter than the entrypoint's stop ({MIN_KILL_TIMEOUT} s)")
        for v in c.get("vm", []):
            if not str(v.get("size", "shared-cpu-1x")).startswith("shared-cpu-"):
                bad.append(f"[[vm]] {v.get('processes')}: {v.get('size')} (production is one shared-CPU Machine)")
        for m in c.get("mounts", []):
            if m.get("source") == "work_data" and (m.get("snapshot_retention") != 30 or m.get("scheduled_snapshots") is not True):
                bad.append("work_data keeps its daily snapshots kept 30 days (snapshot_retention = 30, scheduled_snapshots = true)")
    if production and env.get("UPSTREAM_CAD") != CADOS:
        bad.append(f"UPSTREAM_CAD is {env.get('UPSTREAM_CAD')!r}: production sends /cad to the cados app ({CADOS})")
    elif env.get("UPSTREAM_CAD") not in (CADOS, CAD_GROUP):
        bad.append(f"UPSTREAM_CAD is {env.get('UPSTREAM_CAD')!r}: the cados app ({CADOS}) or the cad group ({CAD_GROUP})")
    if env.get("OPENSKETCH_PUBLIC_URL") != "https://bizomat.ai/cad":
        bad.append("OPENSKETCH_PUBLIC_URL must be https://bizomat.ai/cad (connectors and paired computers use it)")
    if not production and not env.get("UPSTREAM_WORK", "").startswith("http://work.process.bizomat.internal:"):
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
