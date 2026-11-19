"""The Fly connection check (.github/scripts/fly-deploy-source.sh, run last by fly-status.yml).

Fly's GitHub deployment for cados was disconnected by the owner on 16 Nov 2026 (Fly's API: hasDeploymentSource false,
deploymentSource null), and GitHub Actions' deploy.yml is the only way to production. The check reads that state on
every status run: it passes when nothing is connected, fails clearly when Fly reports a deployment source, and fails
without claiming anything when the answer cannot be read. It only reads, never prints the token or the raw answer, and
the status workflow it runs in deploys and changes nothing.

curl is a stand-in on PATH that records its arguments and standard input and answers with a prepared body.
"""
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / ".github/scripts/fly-deploy-source.sh"
STATUS = (ROOT / ".github/workflows/fly-status.yml").read_text(encoding="utf-8")

pytestmark = pytest.mark.skipif(not (shutil.which("bash") and shutil.which("jq")), reason="needs bash and jq")

# Shaped like a deploy token, made up at run time (secret scanners read this repository).
TOKEN = "FlyV1 " + "_".join(["fm2", "notARealDeployToken", "0123456789abcdef"])
REPO_SECRET = "_".join(["ghs", "notARealSecret123"])

FAKE_CURL = """#!/usr/bin/env bash
printf '%s\\n' "$@" > "$STUB/argv"
cat > "$STUB/stdin"
out=""; prev=""
for a in "$@"; do [ "$prev" = "-o" ] && out="$a"; prev="$a"; done
[ -f "$STUB/exit" ] && { echo "curl: (6) Could not resolve host: api.fly.io" >&2; exit "$(cat "$STUB/exit")"; }
cat "$STUB/body" > "$out"
printf '%s' "$(cat "$STUB/code")"
"""


def app(has, source, name="cados"):
    return {"data": {"app": {"name": name, "hasDeploymentSource": has, "deploymentSource": source}}}


GITHUB_SOURCE = {"connected": True, "provider": "github", "repositoryUrl": "https://github.com/kevinjogin/bizomat-cad", "ref": "main"}


def check(tmp_path, body, code="200", token=TOKEN, env=None, unreachable=False):
    base = Path(tempfile.mkdtemp(dir=tmp_path))  # each call its own stand-in, so one test can run several
    stub = base / "stub"
    stub.mkdir()
    (stub / "curl").write_text(FAKE_CURL)
    (stub / "curl").chmod(0o755)
    (stub / "body").write_text(body if isinstance(body, str) else json.dumps(body))
    (stub / "code").write_text(code)
    if unreachable:
        (stub / "exit").write_text("6")
    summary = base / "summary.md"
    run_env = {
        "PATH": f"{stub}:/usr/bin:/bin",
        "STUB": str(stub),
        "GITHUB_STEP_SUMMARY": str(summary),
        **({"FLY_API_TOKEN": token} if token is not None else {}),
        **(env or {}),
    }
    r = subprocess.run(["bash", str(SCRIPT)], env=run_env, capture_output=True, text=True, timeout=30)
    read = lambda name: (stub / name).read_text() if (stub / name).exists() else ""
    return {
        "code": r.returncode,
        "out": r.stdout + r.stderr,
        "argv": read("argv"),
        "stdin": read("stdin"),
        "summary": summary.read_text() if summary.exists() else "",
    }


def assert_quiet(r):
    """The token never reaches the output, the summary or curl's command line; it reaches curl on standard input."""
    secret = TOKEN.split(" ", 1)[1]
    for where in ("out", "summary", "argv"):
        assert secret not in r[where], f"the token is in {where}"
    if r["stdin"]:
        assert r["stdin"] == f'header = "Authorization: {TOKEN}"\n'


def test_disconnected_passes_and_says_so(tmp_path):
    r = check(tmp_path, app(False, None))
    assert r["code"] == 0, r["out"]
    assert "No deployment source" in r["out"] and "deploy.yml" in r["out"]
    assert "::error" not in r["out"]
    assert "**none**" in r["summary"] and "`hasDeploymentSource: false`" in r["summary"]
    assert_quiet(r)


def test_connected_fails_clearly_and_changes_nothing(tmp_path):
    r = check(tmp_path, app(True, GITHUB_SOURCE))
    assert r["code"] == 1, r["out"]
    error = next(line for line in r["out"].splitlines() if line.startswith("::error"))
    assert "title=Fly deploys cados by itself" in error
    for needle in ("provider github", "repository github.com/kevinjogin/bizomat-cad", "ref main", "connected true",
                   "Fly dashboard > cados > Settings", "Nothing was changed"):
        assert needle in error, needle
    assert "**connected**" in r["summary"]
    assert_quiet(r)


@pytest.mark.parametrize("has,source", [
    (True, None),                                   # Fly says it has one but does not describe it
    (False, {**GITHUB_SOURCE, "connected": False}),  # a source is still configured
    (True, {**GITHUB_SOURCE, "connected": False}),
])
def test_any_sign_of_a_deployment_source_is_reported(tmp_path, has, source):
    r = check(tmp_path, app(has, source))
    assert r["code"] == 1, r["out"]
    assert "::error title=Fly deploys cados by itself" in r["out"]
    assert_quiet(r)


def test_credentials_and_odd_characters_in_the_answer_are_not_printed(tmp_path):
    source = {
        "connected": True,
        "provider": "github\n::warning::injected",
        "repositoryUrl": f"https://x-access-token:{REPO_SECRET}@github.com/someone/else.git?token=abc#frag",
        "ref": "main`$(id)`",
    }
    r = check(tmp_path, app(True, source))
    assert r["code"] == 1
    assert "repository github.com/someone/else.git" in r["out"]
    for leaked in (REPO_SECRET, "x-access-token", "token=abc", "$(id)", "\n::warning::"):
        assert leaked not in r["out"] and leaked not in r["summary"], leaked
    assert_quiet(r)


@pytest.mark.parametrize("body,code,reason", [
    ("unauthorized", "401", "HTTP 401"),
    ("<html>gateway</html>", "502", "HTTP 502"),
    ("not json", "200", "did not answer with JSON"),
    ({"data": {"app": None}}, "200", "knows no app cados"),
    ({"data": {"app": {"name": "cados"}}}, "200", "no hasDeploymentSource"),
    ({"data": {"app": {"name": "cados", "hasDeploymentSource": False, "deploymentSource": "yes"}}}, "200", "is a string"),
])
def test_an_unreadable_answer_claims_nothing(tmp_path, body, code, reason):
    r = check(tmp_path, body, code=code)
    assert r["code"] == 2, r["out"]
    assert reason in r["out"]
    assert "::error title=Fly deployment source unknown" in r["out"]
    assert "No deployment source" not in r["out"] and "**unknown**" in r["summary"]
    assert_quiet(r)


def test_an_api_error_is_shown_without_any_token_it_echoes(tmp_path):
    secret = TOKEN.split(" ", 1)[1]
    body = {"errors": [{"message": f"Unauthorized: {TOKEN} is not valid\nfor app cados"}], "data": None}
    r = check(tmp_path, body)
    assert r["code"] == 2
    assert "Fly's API answered with an error: Unauthorized: (token removed) is not valid for app cados" in r["out"]
    assert secret not in r["out"] and secret not in r["summary"]


def test_no_answer_and_no_token(tmp_path):
    r = check(tmp_path, "", unreachable=True)
    assert r["code"] == 2 and "could not be reached" in r["out"]
    assert_quiet(r)
    missing = check(tmp_path, app(False, None), token=None)
    assert missing["code"] == 2 and "FLY_API_TOKEN is not set" in missing["out"]
    assert missing["argv"] == "", "Fly's API was not asked without a token"


def test_the_token_form_decides_the_authorization_scheme(tmp_path):
    bare = TOKEN.split(" ", 1)[1]
    r = check(tmp_path, app(False, None), token=bare)
    assert r["code"] == 0 and r["stdin"] == f'header = "Authorization: FlyV1 {bare}"\n'
    odd = check(tmp_path, app(False, None), token='abc"def')
    assert odd["code"] == 2 and "unexpected form" in odd["out"] and "abc" not in odd["out"]


def test_one_read_only_query_for_the_few_fields_it_needs(tmp_path):
    r = check(tmp_path, app(False, None))
    argv = r["argv"].splitlines()
    assert argv[argv.index("--data") + 1].startswith('{"query":"query(')
    query = json.loads(argv[argv.index("--data") + 1])
    assert query["variables"] == {"name": "cados"}
    fields = re.search(r"deploymentSource \{ ([^}]*) \}", query["query"]).group(1).split()
    assert fields == ["connected", "provider", "repositoryUrl", "ref"], "never backend, ids or other fields"
    assert "hasDeploymentSource" in query["query"]
    assert "https://api.fly.io/graphql" in argv and "-K" in argv
    script = SCRIPT.read_text(encoding="utf-8")
    code = "\n".join(line for line in script.splitlines() if not line.lstrip().startswith("#"))
    assert not re.search(r"\bmutation\b", code), "the check never changes anything"
    assert "-H \"Authorization" not in code and "-H 'Authorization" not in code, "the token is never an argument"


def test_another_app_name_is_refused_before_anything_is_asked(tmp_path):
    r = check(tmp_path, app(False, None), env={"APP": 'cados", "x": "y'})
    assert r["code"] == 2 and "not a Fly app name" in r["out"] and r["argv"] == ""


def test_the_status_workflow_runs_the_check_last_and_changes_nothing():
    assert re.search(r"^on:\n  workflow_dispatch:\n\n", STATUS, re.M), "by hand only"
    assert re.search(r"^  APP: cados\b", STATUS, re.M)
    steps = re.findall(r"^      - (?:name|uses): (.+)$", STATUS, re.M)
    assert steps[-1].startswith("Is a repository connected to cados in Fly?"), "the check is the last step"
    last = STATUS[STATUS.index("- name: Is a repository connected"):]
    assert "FLY_API_TOKEN: ${{ secrets.FLY_CADOS_TOKEN }}" in last
    assert "run: bash .github/scripts/fly-deploy-source.sh" in last
    assert "persist-credentials: false" in STATUS
    assert "permissions:\n  contents: read" in STATUS
    # Nothing in it deploys, restarts, scales, stops or changes secrets, volumes or the app.
    commands = [line for line in STATUS.splitlines() if not line.lstrip().startswith("#")]
    for line in commands:
        assert not re.search(
            r"\b(fly|flyctl)\s+(deploy|scale|destroy|apps\s+(destroy|create|move)|secrets\s+(set|unset|import|deploy)|"
            r"(machine|machines)\s+(stop|start|restart|destroy|update|clone|run|kill)|volumes?\s+(create|destroy|extend|fork))\b",
            line,
        ), line.strip()
    loop = re.search(r'for cmd in (.+); do', STATUS).group(1)
    assert set(re.findall(r'"([^"]+)"', loop)) == {"status", "machines list", "volumes list", "secrets list", "releases",
                                                   "certs list", "ips list"}, "only listing commands"
