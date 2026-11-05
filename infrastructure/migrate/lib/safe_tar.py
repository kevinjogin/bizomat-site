"""Check and unpack a BIZOMAT data archive safely (python3 safe_tar.py check|extract ARCHIVE [DEST]).

The archive layout, made by cad/export.sh and work/pack.sh:
    MANIFEST.sha256   sha256sum lines for every file, as "data/<path>"
    EXPORT-INFO       where and when it was made, counts (optional)
    data/...          the files
Only regular files and directories are accepted, only under data/ (plus the two files above), never an absolute
path, a ".." part, a link or a device: a damaged or hostile archive is refused before anything is written.
Prints counts only, never file contents.
"""

from __future__ import annotations

import json
import os
import sys
import tarfile

TOP_FILES = {"MANIFEST.sha256", "EXPORT-INFO"}


def problems(tf: tarfile.TarFile) -> tuple[list[str], dict]:
    bad: list[str] = []
    files = dirs = size = 0
    seen_manifest = False
    for m in tf.getmembers():
        name = m.name
        while name.startswith("./"):
            name = name[2:]
        parts = [p for p in name.split("/") if p not in ("", ".")]
        if not parts:
            continue
        if name.startswith("/") or ".." in parts:
            bad.append(f"unsafe path: {m.name!r}")
            continue
        if not (m.isfile() or m.isdir()):
            bad.append(f"not a file or directory: {m.name!r}")
            continue
        if len(parts) == 1 and parts[0] in TOP_FILES:
            if not m.isfile():
                bad.append(f"{parts[0]} must be a file")
            seen_manifest = seen_manifest or parts[0] == "MANIFEST.sha256"
            continue
        if parts[0] != "data":
            bad.append(f"outside data/: {m.name!r}")
            continue
        if m.isfile():
            files += 1
            size += m.size
        else:
            dirs += 1
    if not seen_manifest:
        bad.append("MANIFEST.sha256 is missing")
    return bad, {"files": files, "directories": dirs, "bytes": size}


def main(argv: list[str]) -> int:
    if len(argv) < 3 or argv[1] not in ("check", "extract") or (argv[1] == "extract" and len(argv) != 4):
        print(__doc__.strip().splitlines()[0], file=sys.stderr)
        return 64
    mode, archive = argv[1], argv[2]
    try:
        tf = tarfile.open(archive, "r:*")
    except (OSError, tarfile.TarError) as exc:
        print(f"safe_tar: cannot read the archive: {exc.__class__.__name__}", file=sys.stderr)
        return 1
    with tf:
        bad, counts = problems(tf)
        if bad:
            for line in bad[:20]:
                print(f"safe_tar: {line}", file=sys.stderr)
            print(f"safe_tar: refused ({len(bad)} problem(s))", file=sys.stderr)
            return 1
        if mode == "extract":
            dest = argv[3]
            os.makedirs(dest, mode=0o700, exist_ok=True)
            # the "data" filter (Python 3.12) refuses links, devices and paths outside dest, and drops set-id bits
            tf.extractall(dest, filter="data")
    print(json.dumps(counts))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
