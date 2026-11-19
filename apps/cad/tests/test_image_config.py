"""The deploy's image check (.github/scripts/image-config.sh, cados-checks.sh core): Fly deploys a pushed image under its
own deployment-<id> tag with a rewritten manifest, so the manifest digest it reports differs from the one pushed. The
check then compares the config digest, which names every layer: the same image passes, another image fails.

docker, flyctl and curl are stand-ins on PATH: docker answers `buildx imagetools inspect --raw` from prepared manifests,
flyctl lists one Machine with a prepared digest, curl answers the server's checks."""
import json
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = "sha256:" + "c" * 64
OTHER_CONFIG = "sha256:" + "d" * 64
PUSHED = "sha256:" + "a" * 64
REWRITTEN = "sha256:" + "b" * 64
INDEX = "sha256:" + "e" * 64
AMD64 = "sha256:" + "f" * 64


def stand_ins(tmp: Path, manifests: dict[str, dict], machine_digest: str) -> dict:
    bin_ = tmp / "bin"
    bin_.mkdir()
    (tmp / "manifests.json").write_text(json.dumps(manifests))
    (bin_ / "docker").write_text(
        "#!/usr/bin/env python3\n"
        "import json, sys\n"
        f"m = json.load(open({str(tmp / 'manifests.json')!r}))\n"
        "args = sys.argv[1:]\n"
        "assert args[:4] == ['buildx', 'imagetools', 'inspect', '--raw'], args\n"
        "d = args[4].split('@', 1)[1]\n"
        "if d not in m: sys.exit(1)\n"
        "print(json.dumps(m[d]))\n"
    )
    (bin_ / "flyctl").write_text(
        "#!/usr/bin/env bash\n"
        f"if [ \"$1 $2\" = 'machine list' ]; then echo '[{{\"image_ref\":{{\"digest\":\"{machine_digest}\"}}}}]'; fi\n"
        "exit 0\n"
    )
    (bin_ / "curl").write_text(
        "#!/usr/bin/env bash\n"
        "case \"$*\" in\n"
        "  *healthz*) echo '{\"ok\":true,\"version\":\"abc1234\"}' ;;\n"
        "  *oauth-protected-resource*) echo '{\"resource\":\"https://cados.fly.dev/mcp\"}' ;;\n"
        "  *) printf 'HTTP/1.1 401 Unauthorized\\r\\nwww-authenticate: Bearer resource_metadata=x\\r\\n\\r\\n' ;;\n"
        "esac\n"
    )
    for f in bin_.iterdir():
        f.chmod(0o755)
    return {**os.environ, "PATH": f"{bin_}:{os.environ['PATH']}", "GITHUB_STEP_SUMMARY": str(tmp / "summary")}


def manifests(config_of_rewritten: str) -> dict[str, dict]:
    return {
        PUSHED: {"schemaVersion": 2, "config": {"digest": CONFIG}, "layers": []},
        REWRITTEN: {"schemaVersion": 2, "config": {"digest": config_of_rewritten}, "layers": []},
        INDEX: {"schemaVersion": 2, "manifests": [
            {"digest": "sha256:" + "0" * 64, "platform": {"os": "linux", "architecture": "arm64"}},
            {"digest": AMD64, "platform": {"os": "linux", "architecture": "amd64"}},
        ]},
        AMD64: {"schemaVersion": 2, "config": {"digest": CONFIG}, "layers": []},
    }


def config_of(ref: str, env: dict) -> subprocess.CompletedProcess:
    return subprocess.run(["bash", str(ROOT / ".github/scripts/image-config.sh"), ref], env=env, capture_output=True, text=True)


def test_the_config_digest_of_a_manifest_and_of_an_index(tmp_path):
    env = stand_ins(tmp_path, manifests(CONFIG), REWRITTEN)
    assert config_of(f"registry.fly.io/cados@{PUSHED}", env).stdout.strip() == CONFIG
    assert config_of(f"registry.fly.io/cados@{INDEX}", env).stdout.strip() == CONFIG, "an index: its linux/amd64 manifest"
    missing = config_of("registry.fly.io/cados@sha256:" + "9" * 64, env)
    assert missing.returncode == 1 and missing.stdout == ""


def core(tmp_path: Path, machine_digest: str, config_of_rewritten: str, want_config: str = CONFIG) -> subprocess.CompletedProcess:
    env = stand_ins(tmp_path, manifests(config_of_rewritten), machine_digest)
    env.update({"WANT": "abc1234", "WANT_DIGEST": PUSHED, "WANT_CONFIG": want_config, "REGISTRY_IMAGE": "registry.fly.io/cados", "APP": "cados"})
    return subprocess.run(["bash", str(ROOT / ".github/scripts/cados-checks.sh"), "core"], env=env, capture_output=True, text=True)


def test_the_pushed_digest_passes(tmp_path):
    r = core(tmp_path, PUSHED, CONFIG)
    assert r.returncode == 0, r.stdout


def test_fly_s_rewritten_manifest_of_the_same_image_passes(tmp_path):
    r = core(tmp_path, REWRITTEN, CONFIG)
    assert r.returncode == 0, r.stdout
    assert f"config {CONFIG}" in r.stdout


def test_another_image_fails(tmp_path):
    r = core(tmp_path, REWRITTEN, OTHER_CONFIG)
    assert r.returncode == 1, r.stdout
    assert "FAILED: the Machine runs image" in r.stdout


def test_without_a_config_to_compare_only_the_digest_counts(tmp_path):
    r = core(tmp_path, REWRITTEN, CONFIG, want_config="")
    assert r.returncode == 1, r.stdout
