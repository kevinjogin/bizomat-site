#!/usr/bin/env python3
"""Stop a Fly.io deploy that would change the live Machines.

`flyctl deploy` applies the [processes] and [[vm]] sections of the configuration file: a process group that has no
Machine yet gets a new one, a group that is no longer in the file loses its Machines, and a different [[vm]] size or
memory resizes the Machines. This check compares the configuration file with the app as it runs now and stops the
deploy when anything of that kind would change, so a deploy only ever ships new code onto the same Machines.

    python3 .github/scripts/fly-preflight.py --app cados --config fly.toml
    python3 .github/scripts/fly-preflight.py --app bizomat --config fly.website.toml

It reads the live Machines with `flyctl machines list --app <app> --json` (FLY_API_TOKEN must be set), or from
--machines-json <file> (tests). It never changes anything. Set ALLOW_MACHINE_CHANGE=YES to let a deliberate change
through (the differences are still printed). The configuration must name the same app, always.

Exit 0: no change to the Machines (or ALLOW_MACHINE_CHANGE=YES). Exit 1: a change, or the check could not run.
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
        })
    return machines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--app", required=True)
    ap.add_argument("--config", required=True)
    ap.add_argument("--machines-json")
    a = ap.parse_args()

    with open(a.config, "rb") as fh:
        config = tomllib.load(fh)
    if config.get("app") != a.app:
        raise SystemExit(f"fly-preflight: {a.config} is for app {config.get('app')!r}, not {a.app!r}. Nothing deployed.")

    want = wanted(config)
    have = live(a.app, a.machines_json)
    region = config.get("primary_region")
    changes = []

    by_group = {}
    for m in have:
        by_group.setdefault(m["group"], []).append(m)
    for g, spec in want.items():
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
    for g, ms in by_group.items():
        if g not in want:
            changes.append(f"group `{g}` ({len(ms)} Machine(s)) is not in {a.config}: the deploy would REMOVE it")

    lines = [f"### Fly preflight: app `{a.app}`, {a.config}", "",
             "| Machine | group | region | state | CPU | memory |", "| --- | --- | --- | --- | --- | --- |"]
    for m in sorted(have, key=lambda x: (x["group"], x["id"])):
        lines.append(f"| {m['id']} | {m['group']} | {m['region']} | {m['state']} | {m['cpu_kind']} x{m['cpus']} | {m['memory_mb']} MB |")
    lines.append("")
    lines.append(f"Live: {len(have)} Machine(s) in {len(by_group)} group(s). Configuration: {len(want)} group(s): "
                 + ", ".join(f"`{g}` {s['cpu_kind']} x{s['cpus']} {s['memory_mb']} MB" for g, s in want.items()) + ".")
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
    text = "\n".join(lines)
    print(text)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as fh:
            fh.write(text + "\n")
    return 1 if changes and not allow else 0


if __name__ == "__main__":
    sys.exit(main())
