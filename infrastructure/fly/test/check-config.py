"""Checks of the Fly configs the platform depends on (CI, the proxy job; Python 3.11+, no packages):

    python3 infrastructure/fly/test/check-config.py fly.toml fly.website.toml fly.staging.toml

For each file: the app is bizomat; the only public service is on the proxy group (a service on another group would
be exposed on the app's addresses); every group has a Machine size, a restart policy and a check; work and cad each
have exactly one volume of their own at /data (a Machine's volume is never shared); CAD Automation's address is
https://bizomat.ai/cad; UPSTREAM_CAD is either the old cados app or this app's cad group (bizomat.ps1 move cad switches
the running router; the file follows in a pull request, and bizomat.ps1 deploy website refuses while they differ).

fly.website.toml is what production runs (9 Nov 2026): the groups proxy, web and work only, the volume work_data, and
CAD Automation in its own Fly app, so UPSTREAM_CAD must be the cados app. fly.toml, the single-app plan that is not
deployed, keeps the four groups.
fly.staging.toml is the staging app bizomat-staging (docs/deployment/staging.md): the production groups plus the gate,
which is the only public service; every upstream is one of staging's own Machines (Fly's private network is shared
by the organisation, so a production name would reach production); the production Machine sizes; Stripe in test
mode, email to the log and an environment that is not production.
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
    if path.replace("\\", "/").rsplit("/", 1)[-1] == STAGING:
        return check_staging(path, c)
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


STAGING = "fly.staging.toml"
STAGING_APP = "bizomat-staging"
STAGING_GROUPS = {"gate", "proxy", "web", "work"}
STAGING_INTERNAL = ".process.bizomat-staging.internal:"
STAGING_ORIGIN = "https://bizomat-staging.fly.dev"


def vm_sizes(c: dict) -> dict[str, tuple]:
    return {g: (v.get("size"), v.get("memory")) for v in c.get("vm", []) for g in v.get("processes", [])}


def check_staging(path: str, c: dict) -> list[str]:
    bad: list[str] = []
    if c.get("app") != STAGING_APP:
        bad.append(f"app is not {STAGING_APP}")
    groups = set(c.get("processes", {}))
    if groups != STAGING_GROUPS:
        bad.append(f"process groups {sorted(groups)}, expected {sorted(STAGING_GROUPS)}")
    if "services" in c:
        bad.append("[[services]] would be public on every group: only [http_service] on the gate")
    if c.get("http_service", {}).get("processes") != ["gate"]:
        bad.append("[http_service] must be on the gate group only: nothing reaches staging without the password")
    if c.get("processes", {}).get("gate", "").split()[-1:] != ["gate"]:
        bad.append("the gate group must run the entrypoint's gate role")
    env = c.get("env", {})
    for k in ("UPSTREAM_WEB", "UPSTREAM_WORK", "UPSTREAM_CAD", "GATE_UPSTREAM"):
        v = env.get(k, "")
        if STAGING_INTERNAL not in v or not v.startswith("http://"):
            bad.append(f"{k} is {v!r}: it must be one of staging's own Machines (*{STAGING_INTERNAL[:-1]})")
    for k, v in env.items():
        if isinstance(v, str) and ("cados.internal" in v or ".process.bizomat.internal" in v or "bizomat.fly.dev" in v):
            bad.append(f"{k} names a production address ({v!r}): staging must never reach production")
    if env.get("GATE_PUBLIC_ORIGIN") != STAGING_ORIGIN:
        bad.append(f"GATE_PUBLIC_ORIGIN must be {STAGING_ORIGIN}")
    if "GATE_PASSWORD" in env:
        bad.append("GATE_PASSWORD is a secret: a Fly secret staged by the workflow, never in this file")
    if env.get("WORK_ENVIRONMENT", "production") == "production":
        bad.append("WORK_ENVIRONMENT must not be production on staging")
    if env.get("WORK_STRIPE_ENVIRONMENT") != "test":
        bad.append("WORK_STRIPE_ENVIRONMENT must be test on staging (live Stripe belongs to production only)")
    if any(k.startswith("WORK_STRIPE_PRICE") for k in env):
        bad.append("no Stripe price on staging: the production price is live")
    if env.get("WORK_EMAIL_PROVIDER") != "log":
        bad.append("WORK_EMAIL_PROVIDER must be log: staging never sends mail")
    checked = {g for k in c.get("checks", {}).values() for g in k.get("processes", [])}
    sized = vm_sizes(c)
    for g in sorted(groups):
        if g not in checked:
            bad.append(f"no check for the {g} group")
        if g not in sized:
            bad.append(f"no [[vm]] size for the {g} group")
    restarted = {g for r in c.get("restart", []) for g in r.get("processes", []) if r.get("policy") == "always"}
    if "work" not in restarted:
        bad.append("the work group has no [[restart]] policy always")
    mounts = c.get("mounts", [])
    if len(mounts) != 1 or mounts[0].get("source") != "work_data" or mounts[0].get("destination") != "/data" or mounts[0].get("processes") != ["work"]:
        bad.append("staging needs exactly one volume, work_data at /data, on the work group")
    # The same Machines as production, so tests run on a faithful copy.
    prod_path = path.replace("\\", "/").rsplit("/", 1)
    prod_path = (prod_path[0] + "/" if len(prod_path) == 2 else "") + PRODUCTION
    try:
        with open(prod_path, "rb") as fh:
            prod = vm_sizes(tomllib.load(fh))
    except FileNotFoundError:
        prod = {}
    for g in sorted(PRODUCTION_GROUPS):
        if prod and sized.get(g) != prod.get(g):
            bad.append(f"the {g} group is {sized.get(g)}, production runs {prod.get(g)}: staging mirrors production")
    if sized.get("gate") != ("shared-cpu-1x", "256mb"):
        bad.append("the gate is a shared-cpu-1x Machine with 256mb")
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
