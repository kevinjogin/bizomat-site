"""The ruleset for main (.github/rulesets/main.json), applied with
`gh api -X POST repos/kevinjogin/bizomat-cad/rulesets --input .github/rulesets/main.json` (README.md, section 11).

It requires a pull request and the CI checks of tests.yml, and blocks force pushes and deletion of main. These tests
keep it in step with tests.yml: every required check is a job that tests.yml really runs, and tests.yml runs on every
pull request, because a required check that never reports would block the merge for ever.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RULESET = json.loads((ROOT / ".github/rulesets/main.json").read_text(encoding="utf-8"))
TESTS = (ROOT / ".github/workflows/tests.yml").read_text(encoding="utf-8")
GITHUB_ACTIONS_APP = 15368


def rule(kind):
    found = [r for r in RULESET["rules"] if r["type"] == kind]
    assert len(found) == 1, f"one {kind} rule"
    return found[0]


def check_names_in_tests_yml():
    names = set(re.findall(r"^    name: (.+)$", TESTS, re.M))
    matrix = re.search(r"name: pytest \(\$\{\{ matrix\.part \}\}\)", TESTS)
    if matrix:
        names.discard("pytest (${{ matrix.part }})")
        for part in re.findall(r"^\s+- part: (.+)$", TESTS, re.M):
            names.add(f"pytest ({part.strip().strip(chr(34))})")
    return names


def test_main_is_protected_against_force_pushes_and_deletion():
    assert RULESET["target"] == "branch" and RULESET["enforcement"] == "active"
    assert RULESET["conditions"]["ref_name"]["include"] == ["~DEFAULT_BRANCH"]
    assert RULESET["bypass_actors"] == [], "nobody bypasses it, this session included"
    rule("deletion")
    rule("non_fast_forward")


def test_a_pull_request_is_required_and_one_person_can_still_merge():
    params = rule("pull_request")["parameters"]
    assert params["required_approving_review_count"] == 0, "GitHub does not let an account approve its own pull request"


def test_every_required_check_is_a_job_tests_yml_runs():
    checks = rule("required_status_checks")["parameters"]["required_status_checks"]
    required = {c["context"] for c in checks}
    assert required == {"pytest (main)", "pytest (worker processes)", "npm test", "Cloudflare Worker (cloudflare/mcp)"}
    assert required <= check_names_in_tests_yml(), "a required check that tests.yml does not run"
    assert all(c["integration_id"] == GITHUB_ACTIONS_APP for c in checks), "only GitHub Actions may report them"


def test_tests_yml_runs_on_every_pull_request():
    block = re.search(r"^on:\n(.*?)^\S", TESTS, re.M | re.S).group(1)
    pr = re.search(r"^  pull_request:\n((?:    .*\n|  #.*\n)*)", block, re.M)
    assert pr is not None, "tests.yml runs on pull requests"
    assert "paths" not in pr.group(1), "no path filter: a docs-only pull request must report the required checks too"
