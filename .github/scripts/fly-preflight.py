#!/usr/bin/env python3
"""Stop a Fly.io deploy that would change the live Machines.

`flyctl deploy` applies the [processes] and [[vm]] sections of the configuration file: a process group that has no
Machine yet gets a new one, a group that is no longer in the file loses its Machines, and a different [[vm]] size or
memory resizes the Machines. This check compares the configuration file with the app as it runs now and stops the
deploy when anything of that kind would change, so a deploy only ever ships new code onto the same Machines.

    python3 .github/scripts/fly-preflight.py --app cados --config fly.toml
    python3 .github/scripts/fly-preflight.py --app bizomat --config fly.website.toml
    python3 .github/scripts/fly-preflight.py --app bizomat --config fly.website.toml --process-groups work

--process-groups: the deploy is `flyctl deploy --process-groups <groups>`, which updates only those groups' Machines and
leaves every other Machine exactly as it is (not updated, not destroyed: flyctl takes them out of the deploy). Only
those groups are compared; the others are listed as left alone.

It also checks the public service ([http_service] / [[services]]): after the deploy at least one Machine must serve it
(started, or started on demand by its autostart), or the app's addresses (bizomat.ai) would answer nothing; that stops
the deploy even with ALLOW_MACHINE_CHANGE=YES. And when the deploy would REMOVE Machines that carry
the public service now, it says that flyctl destroys them before it updates any other Machine (flyctl v0.5.6,
deployMachinesApp), so the app is offline until the rest have restarted; deploying the groups that take over first,
with --process-groups, avoids that gap (docs/BIZOMAT-DEPLOYMENT.md, section 6e).

It reads the live Machines with `flyctl machines list --app <app> --json` (FLY_API_TOKEN must be set), or from
--machines-json <file> (tests: .github/scripts/test-fly-preflight.py). It never changes anything. Set
ALLOW_MACHINE_CHANGE=YES to let a deliberate change through (the differences are still printed). The configuration must
name the same app, always.

Exit 0: no change to the Machines (or ALLOW_MACHINE_CHANGE=YES). Exit 1: a change, no Machine left to serve, or the check
could not run.
"""
import argparse
import json
import os
import subprocess
import sys

try:
    import tomllib  # Python 3.11+
except ModuleNotFoundError:  # pragma: no cover
    sys.exit("fly-preflight: Python 3.11 or newer is needed (tomllib)")

# Fly's size presets: (cpu_kind, cpus, memory_mb) when [[vm]] names only a size.
PRESETS = {
    "shared-cpu-1x": ("shared", 1, 256), "shared-cpu-2x": ("shared", 2, 512),
    "shared-cpu-4x": ("shared", 4, 1024), "shared-cpu-8x": ("shared", 8, 2048),
    "performance-1x": ("performance", 1, 2048), "performance-2x": ("performance", 2, 4096),
    "performance-4x": ("performance", 4, 8192), "performance-8x": ("performance", 8, 16384),
    "performance-16x": ("performance", 16, 32768),
}
DEFAULT_SIZE = "shared-cpu-1x"


def memory_mb(value):
    if isinstance(value, int):
        return value
    v = str(value).strip().lower().replace(" ", "")
    for unit, factor in (("gb", 1024), ("g", 1024), ("mb", 1), ("m", 1)):
        if v.endswith(unit):
            return int(float(v[: -len(unit)]) * factor)
    return int(v)


def wanted(config):
    """{group: {"cpu_kind", "cpus", "memory_mb"}} from the configuration file."""
    groups = list((config.get("processes") or {"app": ""}).keys())
    want = {}
    for g in groups:
        kind, cpus, mem = PRESETS[DEFAULT_SIZE]
        for vm in config.get("vm", []):
            if vm.get("processes") and g not in vm["processes"]:
                continue
            size = vm.get("size")
            if size:
                if size not in PRESETS:
                    raise SystemExit(f"fly-preflight: unknown [[vm]] size {size!r}")
                kind, cpus, mem = PRESETS[size]
            kind = vm.get("cpu_kind", kind)
            cpus = vm.get("cpus", cpus)
            if "memory" in vm:
                mem = memory_mb(vm["memory"])
            if "memory_mb" in vm:
                mem = int(vm["memory_mb"])
        want[g] = {"cpu_kind": kind, "cpus": int(cpus), "memory_mb": int(mem)}
    return want


def live(app, machines_json):
    if machines_json:
        with open(machines_json, encoding="utf-8") as fh:
            data = json.load(fh)
    else:
        r = subprocess.run(["flyctl", "machines", "list", "--app", app, "--json"], capture_output=True, text=True)
        if r.returncode != 0:
            raise SystemExit(f"fly-preflight: flyctl machines list failed: {r.stderr.strip()[-400:]}")
        data = json.loads(r.stdout or "[]")
    machines = []
    for m in data:
        if m.get("state") in ("destroyed", "destroying"):
            continue
        cfg = m.get("config") or {}
        guest = cfg.get("guest") or {}
        machines.append({
            "id": m.get("id", "?"),
            "group": ((cfg.get("metadata") or {}).get("fly_process_group")) or "app",
            "region": m.get("region", "?"),
            "state": m.get("state", "?"),
            "cpu_kind": guest.get("cpu_kind", "?"),
            "cpus": guest.get("cpus", "?"),
            "memory_mb": guest.get("memory_mb", "?"),
            "public": bool(cfg.get("services")),
            # Fly's proxy starts a stopped or suspended Machine for a request when its service says autostart
            "autostart": any(bool(svc.get("autostart")) for svc in (cfg.get("services") or [])),
        })
    return machines


def public_groups(config):
    """{group: autostart} for the groups that carry the public service in the configuration ([http_service] and
    [[services]]); autostart is the service's auto_start_machines."""
    groups = list((config.get("processes") or {"app": ""}).keys())
    out = {}
    services = ([config["http_service"]] if config.get("http_service") else []) + list(config.get("services") or [])
    for svc in services:
        for g in svc.get("processes") or groups:
            out[g] = out.get(g, False) or bool(svc.get("auto_start_machines", False))
    return out


def group_list(values):
    out = []
    for v in values or []:
        out += [g.strip() for g in v.split(",") if g.strip()]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--app", required=True)
    ap.add_argument("--config", required=True)
    ap.add_argument("--machines-json")
    ap.add_argument("--process-groups", action="append", default=[],
                    help="the deploy runs with flyctl's --process-groups: only these groups (comma separated or repeated)")
    a = ap.parse_args()

    with open(a.config, "rb") as fh:
        config = tomllib.load(fh)
    if config.get("app") != a.app:
        raise SystemExit(f"fly-preflight: {a.config} is for app {config.get('app')!r}, not {a.app!r}. Nothing deployed.")

    want = wanted(config)
    only = group_list(a.process_groups)
    unknown = [g for g in only if g not in want]
    if unknown:
        raise SystemExit(f"fly-preflight: --process-groups {', '.join(unknown)}: not a group of {a.config}. Nothing deployed.")
    deployed = set(only) if only else set(want)
    have = live(a.app, a.machines_json)
    region = config.get("primary_region")
    serving = public_groups(config)
    changes = []
    blockers = []  # never let through, not even with ALLOW_MACHINE_CHANGE=YES
    notes = []

    by_group = {}
    for m in have:
        by_group.setdefault(m["group"], []).append(m)
    for g, spec in want.items():
        if g not in deployed:
            continue
        ms = by_group.get(g, [])
        if not ms:
            changes.append(f"group `{g}` has no Machine today: the deploy would CREATE one "
                           f"({spec['cpu_kind']} x{spec['cpus']}, {spec['memory_mb']} MB)")
            continue
        for m in ms:
            if (m["cpu_kind"], m["cpus"], m["memory_mb"]) != (spec["cpu_kind"], spec["cpus"], spec["memory_mb"]):
                changes.append(f"Machine {m['id']} (group `{g}`) runs {m['cpu_kind']} x{m['cpus']}, {m['memory_mb']} MB; "
                               f"{a.config} would make it {spec['cpu_kind']} x{spec['cpus']}, {spec['memory_mb']} MB")
            if region and m["region"] != region:
                changes.append(f"Machine {m['id']} (group `{g}`) is in {m['region']}, {a.config} names {region}")
    removed = set()
    for g, ms in by_group.items():
        if g in want:
            if g not in deployed:
                notes.append(f"group `{g}` ({len(ms)} Machine(s)) is not part of this deploy (--process-groups): left as it is")
            continue
        if only:
            notes.append(f"group `{g}` ({len(ms)} Machine(s)) is not in {a.config} and not part of this deploy "
                         "(--process-groups): left as it is")
            continue
        removed.add(g)
        line = f"group `{g}` ({len(ms)} Machine(s)) is not in {a.config}: the deploy would REMOVE it"
        if any(m["public"] and m["state"] == "started" for m in ms):
            line += (" -- it carries the public service now, and flyctl destroys it before it updates any other "
                     "Machine, so the app is offline until those have restarted. Deploy the groups that take over first, "
                     "with --process-groups, and stop this one (docs/BIZOMAT-DEPLOYMENT.md, section 6e)")
        changes.append(line)

    # Who serves the public service once the deploy is done: updated Machines as the configuration says, Machines left
    # out as they are, removed ones gone, new ones started. A deploy leaves a stopped Machine stopped; a stopped or
    # suspended one still serves if its service starts it on demand (autostart).
    def serves(started, public, autostart):
        return public and (started or autostart)
    after = []
    for m in have:
        if m["group"] in removed:
            continue
        if m["group"] in deployed:
            after.append(serves(m["state"] == "started", m["group"] in serving, serving.get(m["group"], False)))
        else:
            after.append(serves(m["state"] == "started", m["public"], m["autostart"]))
    for g in deployed:
        if g in want and not by_group.get(g):
            after.append(serves(True, g in serving, serving.get(g, False)))
    if serving and not any(after):
        blockers.append("after this deploy no Machine would serve the public service (none started, none started on "
                       "demand), so the app's addresses would answer nothing: start the Machines that should serve "
                       "first (fly machine start <id>)")

    lines = [f"### Fly preflight: app `{a.app}`, {a.config}" + (f", --process-groups {','.join(only)}" if only else ""), "",
             "| Machine | group | region | state | CPU | memory | public service |",
             "| --- | --- | --- | --- | --- | --- | --- |"]
    for m in sorted(have, key=lambda x: (x["group"], x["id"])):
        lines.append(f"| {m['id']} | {m['group']} | {m['region']} | {m['state']} | {m['cpu_kind']} x{m['cpus']} | "
                     f"{m['memory_mb']} MB | {'yes' if m['public'] else 'no'} |")
    lines.append("")
    lines.append(f"Live: {len(have)} Machine(s) in {len(by_group)} group(s). Configuration: {len(want)} group(s): "
                 + ", ".join(f"`{g}` {s['cpu_kind']} x{s['cpus']} {s['memory_mb']} MB" for g, s in want.items())
                 + f"; public service on {', '.join(f'`{g}`' for g in sorted(serving)) or 'no group'}.")
    lines.append("")
    if notes:
        lines += [f"- {n}" for n in notes]
        lines.append("")
    allow = os.environ.get("ALLOW_MACHINE_CHANGE", "") == "YES"
    if changes:
        lines.append("**The deploy would change the Machines:**")
        lines += [f"- {c}" for c in changes]
        lines.append("")
        lines.append("Allowed by ALLOW_MACHINE_CHANGE=YES." if allow else
                     "Stopped: nothing was deployed. Change the configuration to match the live Machines, or run again "
                     "with allow_machine_change = YES if the change is intended.")
    else:
        lines.append("No change to the Machines: same groups, count, size, memory and region.")
    if blockers:
        lines.append("")
        lines.append("**Stopped, whatever ALLOW_MACHINE_CHANGE says:**")
        lines += [f"- {b}" for b in blockers]
    text = "\n".join(lines)
    print(text)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as fh:
            fh.write(text + "\n")
    return 1 if blockers or (changes and not allow) else 0


if __name__ == "__main__":
    sys.exit(main())
