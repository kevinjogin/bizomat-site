"""The production deploy of cados goes through one door: .github/workflows/deploy.yml (owner, 16 Nov 2026).

These tests read the workflow, the Dockerfile and the laptop tool as text (CI has no YAML parser) and hold the rules the
deploy depends on: every file the image is built from triggers a deploy, the deploy runs only after the tests and the
image's smoke test, it deploys the pushed image instead of building again, it checks what it deployed and can roll
back, it only ever targets cados, and nothing else in this repository deploys production.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEPLOY = (ROOT / ".github/workflows/deploy.yml").read_text(encoding="utf-8")
DOCKERFILE = (ROOT / "Dockerfile").read_text(encoding="utf-8")


def push_paths() -> list[str]:
    block = re.search(r"^on:\n  push:\n    branches: \[main\]\n    paths:\n((?:      - .+\n)+)", DEPLOY, re.M)
    assert block, "deploy.yml must run on pushes to main with a paths list"
    return [line.split("- ", 1)[1].strip().strip('"') for line in block.group(1).splitlines()]


def job(name: str) -> str:
    m = re.search(rf"^  {name}:\n(.*?)(?=^  [a-z-]+:\n|\Z)", DEPLOY, re.M | re.S)
    assert m, f"job {name} missing"
    return m.group(1)


def test_every_file_the_image_is_built_from_triggers_a_deploy():
    paths = push_paths()
    sources = []
    for line in DOCKERFILE.splitlines():
        m = re.match(r"\s*COPY\s+(?!--from)(.+)", line)
        if m:
            sources += m.group(1).split()[:-1]  # the last word is the destination
    assert sources, "no COPY lines found"
    for src in sources:
        src = src.rstrip("/")
        assert src in paths or f"{src}/**" in paths, f"{src} is copied into the image but does not trigger a deploy"
    for always in ("Dockerfile", ".dockerignore", "fly.toml", "requirements.txt"):
        assert always in paths
    # Workflows, docs, tests, the installer and backups do not restart production.
    assert not any(p.startswith((".github", "docs", "tests", "installer", "backups")) for p in paths)


def test_the_deploy_waits_for_the_tests_and_the_smoke_tested_image():
    deploy = job("deploy")
    assert "needs: [test, image]" in deploy
    assert "needs.test.result == 'success' && needs.image.result == 'success'" in deploy
    assert "github.ref == 'refs/heads/main'" in deploy
    assert "uses: ./.github/workflows/tests.yml" in job("test")
    image = job("image")
    assert image.index("image-smoke.sh") < image.index("docker push"), "the image is pushed only after its smoke test"
    assert "OPENSKETCH_VERSION=\"$version\"" in image and 'version="${GITHUB_SHA::7}"' in image


def test_production_runs_the_pushed_image_and_nothing_builds_during_a_deploy():
    deploys = [line for line in DEPLOY.splitlines() if re.search(r"\bflyctl deploy\b", line) and not line.lstrip().startswith("#")]
    assert deploys, "no flyctl deploy found"
    for line in deploys:
        assert "--image" in line, f"a deploy that is not of a built image: {line.strip()}"
        assert not re.search(r"--(remote-only|local-only|build-only|build-arg)", line), line.strip()
    assert "--app \"$APP\"" in DEPLOY and re.search(r"^  APP: cados\b", DEPLOY, re.M)
    assert "fly-preflight.py --app \"$APP\" --config fly.toml" in job("deploy")


def test_what_was_deployed_is_checked_and_a_failed_core_check_rolls_back():
    deploy = job("deploy")
    assert "cados-checks.sh core" in deploy and "cados-checks.sh public" in deploy
    assert "WANT_DIGEST: ${{ steps.what.outputs.digest }}" in deploy
    # Fly runs a pushed image under its own deployment-<id> tag with a rewritten manifest: the config digest decides.
    assert "WANT_CONFIG: ${{ steps.what.outputs.config }}" in deploy
    assert "image-config.sh" in job("image")
    rollback = deploy[deploy.index("- name: Roll back"):]
    assert "failure()" in rollback.split("\n", 3)[2], "the rollback runs only when something before it failed"
    assert deploy.index("Roll back") < deploy.index("Checks through bizomat.ai"), "a failure through bizomat.ai never rolls back"
    checks = (ROOT / ".github/scripts/cados-checks.sh").read_text(encoding="utf-8")
    for needle in ("/healthz", "image_ref.digest", "/mcp", "oauth-protected-resource", "download/solidworks"):
        assert needle in checks


def test_one_deploy_at_a_time_and_build_only_runs_never_queue_with_them():
    assert re.search(r"^concurrency:\n  group: .*'deploy-cados'.*\n  cancel-in-progress: false", DEPLOY, re.M)
    assert "inputs.action == 'build-only'" in DEPLOY.split("concurrency:", 1)[1].split("\n", 2)[1]


def test_nothing_else_deploys_production():
    for wf in (ROOT / ".github/workflows").glob("*.yml"):
        if wf.name == "deploy.yml":
            continue
        text = wf.read_text(encoding="utf-8")
        assert not re.search(r"^[^#\n]*\b(fly|flyctl) deploy\b", text, re.M), f"{wf.name} deploys"
    laptop = (ROOT / "tools/laptop/bizomat.ps1").read_text(encoding="utf-8")
    deploy_cad = laptop[laptop.index("function Deploy-Cad"):laptop.index("function Deploy-Tasks")]
    assert "'workflow', 'run', 'deploy.yml'" in deploy_cad, "deploy cad starts the GitHub workflow"
    assert "@('deploy'" not in deploy_cad and "'cados', '--remote-only'" not in deploy_cad, "deploy cad never deploys from the laptop"
