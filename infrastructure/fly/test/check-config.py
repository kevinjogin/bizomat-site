"""Checks of the single application's Fly config (CI; Python 3.11+, no packages):

    python3 infrastructure/fly/test/check-config.py fly.toml

The production rules (docs/BIZOMAT-SINGLE-APP.md): the app is cados in syd; one process group, `app` (the existing Machine's), that runs the
entrypoint's `all` role with cad, work and proxy (the website inside the proxy); exactly one [[vm]] of 1 GB; one
volume, the cados app's existing opensketch_data, at /data; the only public service is the proxy's port 8080 with the
Machine always on; a check for each service; restart always; CAD geometry in the server process (the 1 GB budget);
CAD MCP keeps its public address.
"""

from __future__ import annotations

import sys
import tomllib


def check(path: str) -> list[str]:
    with open(path, "rb") as fh:
        c = tomllib.load(fh)
    bad: list[str] = []
    if c.get("app") != "cados":
        bad.append("app is not cados (the single production application)")
    if c.get("primary_region") != "syd":
        bad.append("primary_region is not syd")
    procs = c.get("processes", {})
    # "app": the group the existing cados Machine is in. Any other name makes flyctl create new Machines and an empty
    # volume for them and remove the old Machine.
    if list(procs) != ["app"] or procs.get("app") != "/usr/local/bin/bizomat-entrypoint all":
        bad.append("one process group, app = /usr/local/bin/bizomat-entrypoint all (the existing Machine's group)")
    env = c.get("env", {})
    if env.get("BIZOMAT_ROLES") != "cad work proxy":
        bad.append("BIZOMAT_ROLES must be 'cad work proxy' (CAD MCP, Task Management, the proxy)")
    if env.get("BIZOMAT_EMBED_WEB") != "1":
        bad.append("BIZOMAT_EMBED_WEB must be 1 (the website inside the proxy, no web process)")
    if env.get("OPENSKETCH_CAD_WORKERS") != "0":
        bad.append("OPENSKETCH_CAD_WORKERS must be 0 at 1 GB (each CAD worker process adds about 400 MB)")
    for name, want in {"UPSTREAM_CAD": "http://127.0.0.1:8001", "UPSTREAM_WORK": "http://127.0.0.1:8002", "UPSTREAM_WEB": "http://127.0.0.1:8003"}.items():
        if env.get(name) != want:
            bad.append(f"{name} must be {want} (same Machine)")
    if env.get("OPENSKETCH_PUBLIC_URL") != "https://bizomat.ai/cad":
        bad.append("OPENSKETCH_PUBLIC_URL must be https://bizomat.ai/cad (connectors and paired computers use it)")
    if "cados.fly.dev" not in env.get("OPENSKETCH_REDIRECT_HOSTS", "").split(","):
        bad.append("OPENSKETCH_REDIRECT_HOSTS must keep cados.fly.dev")
    if env.get("WORK_APP_URL") != "https://bizomat.ai/tasks":
        bad.append("WORK_APP_URL must be https://bizomat.ai/tasks")
    for k in env:
        if any(s in k for s in ("SECRET", "TOKEN", "PASSWORD", "PRIVATE")):
            bad.append(f"[env] {k} looks like a secret: secrets belong in fly secrets, never in this file")
    if "services" in c:
        bad.append("[[services]] is not used: the only public service is [http_service] on the proxy's port")
    hs = c.get("http_service", {})
    if hs.get("processes") != ["app"] or hs.get("internal_port") != 8080:
        bad.append("[http_service] must be the proxy's port 8080 on the app group")
    if hs.get("auto_stop_machines") != "off" or hs.get("min_machines_running") != 1:
        bad.append("the one Machine stays on: auto_stop_machines = off, min_machines_running = 1")
    ports = {k.get("port") for k in c.get("checks", {}).values() if k.get("processes") == ["app"]}
    for port, what in ((8080, "proxy"), (8001, "cad"), (8002, "work")):
        if port not in ports:
            bad.append(f"no check for {what} (port {port})")
    vms = c.get("vm", [])
    if len(vms) != 1 or vms[0].get("processes") != ["app"]:
        bad.append("exactly one [[vm]], for the app group")
    elif str(vms[0].get("memory", "")).lower() not in ("1gb", "1024", "1024mb") and vms[0].get("memory_mb") != 1024:
        bad.append(f"the Machine has 1 GB (memory = '1gb'), not {vms[0].get('memory') or vms[0].get('memory_mb')!r}: a change needs the owner's approval")
    mounts = c.get("mounts", [])
    if len(mounts) != 1 or mounts[0].get("source") != "opensketch_data" or mounts[0].get("destination") != "/data" or mounts[0].get("processes") != ["app"]:
        bad.append("one volume: the cados app's existing opensketch_data at /data")
    if not any(r.get("policy") == "always" and r.get("processes") == ["app"] for r in c.get("restart", [])):
        bad.append("[[restart]] policy always for the app group")
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
