#!/bin/bash
# Check CAD Automation data: an export archive, an unpacked export, or the data folder in place.
#
#   bash verify.sh --archive cados-data.tar     # anywhere with bash and python3 (your computer, after download)
#   bash verify.sh --tree DIR                   # DIR holds MANIFEST.sha256 and data/
#   bash verify.sh --installed /data/cad        # on the new cad Machine, after import.sh
#
# Checks: every file against the manifest (archive, tree), then that the important files are present and readable:
# the JSON stores parse, bridge.sqlite passes SQLite's integrity check (on a copy), the signing key is a PEM key.
# Prints counts only (accounts, sessions, connected apps, computers), never contents.
# Exit 0 when everything that is there is sound; missing important files are listed as warnings
# (--strict makes them errors: use it for a real migration).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB="$HERE/../lib"

mode="${1:-}"
target="${2:-}"
strict=0
[ "${3:-}" = "--strict" ] && strict=1
say() { printf 'verify: %s\n' "$*" >&2; }
die() {
  say "$*"
  exit 1
}
command -v python3 >/dev/null || die "python3 is needed"
[ -n "$target" ] || die "usage: verify.sh --archive FILE | --tree DIR | --installed DIR [--strict]"

tmp="$(mktemp -d "${TMPDIR:-/tmp}/bizomat-verify.XXXXXX")"
trap 'rm -rf "$tmp"' EXIT

case "$mode" in
  --archive)
    [ -f "$target" ] || die "no file $target"
    python3 "$LIB/safe_tar.py" check "$target" >/dev/null || die "the archive was refused"
    # unpacked with tar only after safe_tar.py has refused links and paths outside data/
    tar -xf "$target" -C "$tmp"
    python3 "$LIB/manifest.py" check "$tmp" >&2 || die "the archive does not match its manifest"
    data="$tmp/data"
    ;;
  --tree)
    [ -f "$target/MANIFEST.sha256" ] || die "no $target/MANIFEST.sha256"
    python3 "$LIB/manifest.py" check "$target" >&2 || die "the files do not match the manifest"
    data="$target/data"
    ;;
  --installed)
    [ -d "$target" ] || die "no folder $target"
    data="$target"
    ;;
  *) die "usage: verify.sh --archive FILE | --tree DIR | --installed DIR [--strict]" ;;
esac

python3 - "$data" "$tmp" "$strict" <<'PY'
import json, os, shutil, sqlite3, sys

data, tmp, strict = sys.argv[1], sys.argv[2], sys.argv[3] == "1"
problems, warnings, facts = [], [], []

def path(name):
    return os.path.join(data, name)

def load(name):
    try:
        with open(path(name), encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        return None
    except (ValueError, OSError) as exc:
        problems.append(f"{name} does not parse ({exc.__class__.__name__})")
        return None

# what must come across byte for byte (README.md explains each)
critical = ["secret.keys", "users.json", "accounts.enabled", "sessions.json", "mcp_oauth.json",
            "bridge-signing-key.pem", "bridge.sqlite", "swbridge.json"]
for name in critical:
    if not os.path.isfile(path(name)):
        warnings.append(f"important file missing: {name}")

users = load("users.json")
if isinstance(users, dict):
    facts.append(f"accounts {len(users.get('users', []))}, invites {len(users.get('invites', []))}")
    if users.get("users") and not os.path.isfile(path("accounts.enabled")):
        problems.append("users.json has accounts but accounts.enabled is missing (a lost users.json would then open the server)")
    if users.get("users") and not os.path.isfile(path("secret.keys")):
        problems.append("accounts exist but secret.keys is missing: every member's private connector address would change")
sessions = load("sessions.json")
if isinstance(sessions, dict):
    facts.append(f"browser sessions {len(sessions)}")
oauth = load("mcp_oauth.json")
if isinstance(oauth, dict):
    facts.append("AI apps: clients {}, grants {}".format(len(oauth.get("clients", {})), len(oauth.get("grants", {}))))
for name in ("swbridge.json", "google_oauth.json", "bridge-release.json"):
    load(name)

for name in ("secret.keys", "secret", "ai_keys.secret"):
    p = path(name)
    if os.path.isfile(p):
        with open(p, "rb") as fh:
            raw = fh.read().strip()
        if len(raw) < 32:
            problems.append(f"{name} is shorter than expected")

pem = path("bridge-signing-key.pem")
if os.path.isfile(pem):
    with open(pem, "rb") as fh:
        first = fh.readline().strip()
    if first != b"-----BEGIN PRIVATE KEY-----":
        problems.append("bridge-signing-key.pem is not a PKCS#8 PEM private key")

db = path("bridge.sqlite")
if os.path.isfile(db):
    copy_dir = os.path.join(tmp, "sqlite")
    os.makedirs(copy_dir, exist_ok=True)
    for suffix in ("", "-wal", "-shm", "-journal"):
        if os.path.isfile(db + suffix):
            shutil.copy2(db + suffix, os.path.join(copy_dir, "bridge.sqlite" + suffix))
    try:
        con = sqlite3.connect(os.path.join(copy_dir, "bridge.sqlite"))
        ok = con.execute("PRAGMA integrity_check").fetchone()[0]
        if ok != "ok":
            problems.append("bridge.sqlite fails its integrity check")
        counts = []
        for table in ("devices", "pairings", "commands"):
            try:
                counts.append(f"{table} {con.execute(f'SELECT count(*) FROM {table}').fetchone()[0]}")
            except sqlite3.Error:
                counts.append(f"{table} (none)")
        facts.append("bridge: " + ", ".join(counts))
        con.close()
    except sqlite3.Error as exc:
        problems.append(f"bridge.sqlite cannot be opened ({exc.__class__.__name__})")

for folder in ("uploads", "artifacts", "bridge-files"):
    p = path(folder)
    if os.path.isdir(p):
        n = sum(len(f) for _, _, f in os.walk(p))
        facts.append(f"{folder} {n} files")

for line in facts:
    print(f"verify: {line}", file=sys.stderr)
for line in warnings:
    print(f"verify: WARNING {line}", file=sys.stderr)
for line in problems:
    print(f"verify: PROBLEM {line}", file=sys.stderr)
if problems or (strict and warnings):
    print("verify: FAILED", file=sys.stderr)
    sys.exit(1)
print("verify: OK", file=sys.stderr)
PY

if [ "$mode" = "--installed" ] && [ "$(id -u)" = 0 ] && id bzcad >/dev/null 2>&1; then
  wrong="$(find "$data" -path "$data/.secrets" -prune -o ! -user bzcad -print | wc -l | tr -d ' ')"
  if [ "$wrong" != 0 ]; then
    die "$wrong entries in $data are not owned by bzcad (the entrypoint fixes this at the next start)"
  fi
fi
