#!/usr/bin/env python3
"""Tests of .github/scripts/fly-preflight.py (Python 3.11+, no packages; CI runs them in the proxy job):

    python3 .github/scripts/test-fly-preflight.py

Each case gives the preflight a list of live Machines (--machines-json, the shape of `flyctl machines list --json`) and
a configuration, and checks its verdict. The cases follow the move of the Fly app bizomat from three Machines to one
(docs/BIZOMAT-DEPLOYMENT.md, section 6e): before, the deploy of the work group alone, the two old Machines parked,
after, and the way back.
"""

import json
import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PREFLIGHT = os.path.join(HERE, "fly-preflight.py")
ONE_MACHINE = os.path.join(ROOT, "fly.website.toml")

# The three-Machine shape production ran until the move (the parts the preflight reads).
THREE_MACHINES = """
app = "bizomat"
primary_region = "syd"
[processes]
  proxy = "/usr/local/bin/bizomat-entrypoint proxy"
  web = "/usr/local/bin/bizomat-entrypoint web"
  work = "/usr/local/bin/bizomat-entrypoint work"
[http_service]
  processes = ["proxy"]
  internal_port = 8080
  auto_start_machines = true
[[vm]]
  processes = ["proxy"]
  size = "shared-cpu-1x"
  memory = "256mb"
[[vm]]
  processes = ["web"]
  size = "shared-cpu-1x"
  memory = "512mb"
[[vm]]
  processes = ["work"]
  size = "shared-cpu-1x"
  memory = "512mb"
"""

WORK_ID = "80e971da556628"


def machine(mid, group, memory, state="started", public=False, autostart=True, region="syd"):
    services = [{"internal_port": 8080, "autostart": autostart, "ports": [{"port": 443}, {"port": 80}]}] if public else []
    return {"id": mid, "region": region, "state": state, "config": {
        "metadata": {"fly_process_group": group, "fly_platform_version": "v2"},
        "guest": {"cpu_kind": "shared", "cpus": 1, "memory_mb": memory},
        "services": services}}


def today():
    return [machine("p1", "proxy", 256, public=True), machine("w1", "web", 512), machine(WORK_ID, "work", 512)]


def taken_over(proxy_state="started", web_state="started", proxy_autostart=True):
    """After `deploy --process-groups work`: work runs all three with the public service; proxy and web as they were."""
    return [machine("p1", "proxy", 256, state=proxy_state, public=True, autostart=proxy_autostart),
            machine("w1", "web", 512, state=web_state), machine(WORK_ID, "work", 1024, public=True)]


class Preflight(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.three = os.path.join(self.tmp.name, "three.toml")
        with open(self.three, "w", encoding="utf-8") as fh:
            fh.write(THREE_MACHINES)

    def tearDown(self):
        self.tmp.cleanup()

    def run_preflight(self, machines, config, *extra, allow=False):
        path = os.path.join(self.tmp.name, "machines.json")
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(machines, fh)
        env = {k: v for k, v in os.environ.items() if k not in ("ALLOW_MACHINE_CHANGE", "GITHUB_STEP_SUMMARY")}
        if allow:
            env["ALLOW_MACHINE_CHANGE"] = "YES"
        r = subprocess.run([sys.executable, PREFLIGHT, "--app", "bizomat", "--config", config, "--machines-json", path, *extra],
                           capture_output=True, text=True, env=env)
        return r.returncode, r.stdout + r.stderr

    def test_three_machines_unchanged(self):
        code, out = self.run_preflight(today(), self.three)
        self.assertEqual(code, 0, out)
        self.assertIn("No change to the Machines", out)

    def test_full_deploy_of_one_machine_is_stopped_with_the_reason(self):
        code, out = self.run_preflight(today(), ONE_MACHINE)
        self.assertEqual(code, 1, out)
        self.assertIn("group `proxy` (1 Machine(s)) is not in", out)
        self.assertIn("REMOVE", out)
        self.assertIn("flyctl destroys it before it updates any other Machine", out)
        self.assertIn(f"Machine {WORK_ID} (group `work`) runs shared x1, 512 MB", out)
        self.assertIn("1024 MB", out)

    def test_work_group_alone_changes_only_work(self):
        code, out = self.run_preflight(today(), ONE_MACHINE, "--process-groups", "work")
        self.assertEqual(code, 1, out)  # 512 -> 1024 MB is a change: deliberate, so it needs ALLOW_MACHINE_CHANGE=YES
        self.assertIn("1024 MB", out)
        self.assertNotIn("REMOVE", out)
        self.assertIn("group `proxy` (1 Machine(s)) is not in", out)
        self.assertIn("left as it is", out)
        self.assertNotIn("no Machine would serve", out)
        code, out = self.run_preflight(today(), ONE_MACHINE, "--process-groups", "work", allow=True)
        self.assertEqual(code, 0, out)

    def test_parked_machines_are_removed_without_an_outage_warning(self):
        parked = taken_over("stopped", "stopped", proxy_autostart=False)
        code, out = self.run_preflight(parked, ONE_MACHINE)
        self.assertEqual(code, 1, out)
        self.assertIn("REMOVE", out)
        self.assertNotIn("flyctl destroys it before", out)  # nothing they serve is lost: work serves
        self.assertNotIn("no Machine would serve", out)
        code, _ = self.run_preflight(parked, ONE_MACHINE, allow=True)
        self.assertEqual(code, 0)

    def test_one_machine_afterwards(self):
        code, out = self.run_preflight([machine(WORK_ID, "work", 1024, public=True)], ONE_MACHINE)
        self.assertEqual(code, 0, out)
        self.assertIn("No change to the Machines", out)

    def test_way_back_needs_the_router_started_first(self):
        parked = taken_over("stopped", "stopped", proxy_autostart=False)
        # work back to its own role loses the public service; the parked router does not serve until it is started
        code, out = self.run_preflight(parked, self.three, "--process-groups", "work", allow=True)
        self.assertEqual(code, 1, out)
        self.assertIn("no Machine would serve the public service", out)
        code, out = self.run_preflight(taken_over("started", "started"), self.three, "--process-groups", "work", allow=True)
        self.assertEqual(code, 0, out)

    def test_a_suspended_machine_that_starts_on_demand_serves(self):
        code, out = self.run_preflight([machine(WORK_ID, "work", 1024, state="suspended", public=True)], ONE_MACHINE)
        self.assertEqual(code, 0, out)

    def test_unknown_group_and_other_app_refused(self):
        code, out = self.run_preflight(today(), ONE_MACHINE, "--process-groups", "proxy")
        self.assertEqual(code, 1)
        self.assertIn("not a group of", out)
        path = os.path.join(self.tmp.name, "machines.json")
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(today(), fh)
        r = subprocess.run([sys.executable, PREFLIGHT, "--app", "cados", "--config", ONE_MACHINE, "--machines-json", path],
                           capture_output=True, text=True)
        self.assertEqual(r.returncode, 1)
        self.assertIn("is for app 'bizomat'", r.stdout + r.stderr)


if __name__ == "__main__":
    unittest.main(verbosity=2)
