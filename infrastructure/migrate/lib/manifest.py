"""Check files against a MANIFEST.sha256 (the sha256sum format), portably (Linux, macOS, the Fly Machine).

    python3 manifest.py check ROOT [--manifest FILE] [--rename FROM=TO]

ROOT holds the files named in the manifest (default manifest: ROOT/MANIFEST.sha256). --rename maps a path prefix
of the manifest to the place the files are now (data/=cad/ after an import moved data/ to /data/cad).
Every listed file must exist with the same SHA-256; every file under the listed top folder must be listed.
Prints counts and, for problems, file names (never contents). Exit 0 only when everything matches.
"""

from __future__ import annotations

import hashlib
import os
import sys


def sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def read_manifest(path: str) -> list[tuple[str, str]]:
    out = []
    with open(path, encoding="utf-8", errors="surrogateescape") as fh:
        for n, line in enumerate(fh, 1):
            line = line.rstrip("\n")
            if not line:
                continue
            if line.startswith("\\") or len(line) < 67 or line[64] != " " or line[65] not in " *":
                raise ValueError(f"line {n} of the manifest is not a plain sha256sum line")
            out.append((line[:64].lower(), line[66:]))
    return out


def main(argv: list[str]) -> int:
    if len(argv) < 3 or argv[1] != "check":
        print(__doc__.strip(), file=sys.stderr)
        return 64
    root = argv[2]
    manifest = os.path.join(root, "MANIFEST.sha256")
    rename = None
    args = argv[3:]
    while args:
        flag = args.pop(0)
        if flag == "--manifest" and args:
            manifest = args.pop(0)
        elif flag == "--rename" and args and "=" in args[0]:
            rename = tuple(args.pop(0).split("=", 1))
        else:
            print(f"manifest: unknown argument {flag}", file=sys.stderr)
            return 64
    try:
        entries = read_manifest(manifest)
    except (OSError, ValueError) as exc:
        print(f"manifest: cannot read {manifest}: {exc}", file=sys.stderr)
        return 1
    missing, changed, listed = [], [], set()
    tops = set()
    for digest, name in entries:
        if rename and name.startswith(rename[0]):
            name = rename[1] + name[len(rename[0]):]
        rel = os.path.normpath(name)
        if rel.startswith("..") or os.path.isabs(rel):
            print(f"manifest: unsafe path in the manifest: {name!r}", file=sys.stderr)
            return 1
        tops.add(rel.split(os.sep)[0])
        listed.add(rel)
        path = os.path.join(root, rel)
        if not os.path.isfile(path) or os.path.islink(path):
            missing.append(rel)
        elif sha256(path) != digest:
            changed.append(rel)
    extra = []
    for top in sorted(tops):
        base = os.path.join(root, top)
        if not os.path.isdir(base):
            continue
        for dirpath, dirnames, filenames in os.walk(base):
            rel_dir = os.path.relpath(dirpath, root)
            # the role's own secret files (/data/<role>/.secrets) are never part of an export
            dirnames[:] = [d for d in dirnames if d != ".secrets"]
            for f in filenames:
                rel = os.path.normpath(os.path.join(rel_dir, f))
                if rel not in listed:
                    extra.append(rel)
    print(f"manifest: {len(entries)} listed, {len(entries) - len(missing) - len(changed)} match, "
          f"{len(missing)} missing, {len(changed)} changed, {len(extra)} not listed")
    for label, names in (("missing", missing), ("changed", changed), ("not listed", extra)):
        for name in names[:20]:
            print(f"manifest: {label}: {name}", file=sys.stderr)
    return 0 if not (missing or changed or extra) else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
