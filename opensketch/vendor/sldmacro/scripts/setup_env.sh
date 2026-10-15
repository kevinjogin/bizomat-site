#!/usr/bin/env bash
# Sets up what the sldmacro engine needs in a fresh Linux sandbox, proves each piece works, and writes env.sh.
#
#   bash setup_env.sh            set up (safe to run again: it reuses what is there)
#   source ~/.sldmacro/env.sh    then `sldmacro ...` works from any job folder
#
# Needs: Python 3.12 (or 3.11 / 3.13), a C compiler (for the sketch solver), LibreOffice with its Python bridge
# (uno), Java 17+ (for the VBA grammar check), and package downloads from PyPI, Maven Central and
# raw.githubusercontent.com. Prints one line per piece: OK or what is missing. Exit code 0 only if all are OK.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE="$(cd "$HERE/../engine" && pwd)"
VENVS="${SLDMACRO_VENVS:-$HOME/.venvs}"
CAD="$VENVS/sldmacro-cad"
SLVS="$VENVS/sldmacro-slvs"
bad=0
say() { printf '%s\n' "$*"; }
ok()  { say "OK    $*"; }
no()  { say "MISSING  $*"; bad=1; }

pick_python() {
  for p in python3.12 python3.13 python3.11; do
    if command -v "$p" >/dev/null 2>&1; then echo "$p"; return; fi
  done
  echo python3
}
PYBASE="$(pick_python)"

make_venv() {   # make_venv <dir> <packages...>
  local dir="$1"; shift
  if [ ! -x "$dir/bin/python" ]; then
    if command -v uv >/dev/null 2>&1; then
      uv venv -q --python "$PYBASE" "$dir" || "$PYBASE" -m venv "$dir"
    else
      "$PYBASE" -m venv "$dir"
    fi
  fi
  if command -v uv >/dev/null 2>&1; then
    uv pip install -q --python "$dir/bin/python" "$@" || "$dir/bin/python" -m pip install -q "$@"
  else
    "$dir/bin/python" -m pip install -q "$@"
  fi
}

# 1. the CAD environment: build123d (OpenCascade), shapely for the slice comparison, matplotlib for pictures
t0=$SECONDS
if ! "$CAD/bin/python" -c "import build123d, shapely, matplotlib" >/dev/null 2>&1; then
  make_venv "$CAD" "build123d>=0.13,<0.14" "shapely>=2.0" numpy matplotlib >/dev/null 2>&1
fi
if out=$("$CAD/bin/python" - 2>/dev/null <<'PY'
import build123d as b
s = b.Box(10, 20, 5) - b.Pos(0, 0, 0) * b.Cylinder(2, 5)
assert abs(s.volume - (1000 - 3.141592653589793 * 4 * 5)) < 1e-6
print(b.__version__, round(s.volume, 3))
PY
); then ok "CAD environment: build123d $out mm3 for the test solid ($((SECONDS - t0)) s)   $CAD"; else no "CAD environment (build123d in $CAD)"; fi

# 2. the sketch solver, in an environment of its own
t0=$SECONDS
if ! "$SLVS/bin/python" -c "import python_solvespace" >/dev/null 2>&1; then
  make_venv "$SLVS" python-solvespace >/dev/null 2>&1
fi
if out=$("$SLVS/bin/python" -c "import python_solvespace as p; print(p.__version__)" 2>/dev/null); then ok "sketch solver: python_solvespace $out ($((SECONDS - t0)) s)   $SLVS"; else no "sketch solver (python-solvespace in $SLVS; it is built from source and needs gcc)"; fi

# 3. LibreOffice and a Python that can drive it
SYS_PY=""
for p in /usr/bin/python3 python3 /usr/bin/python3.12; do
  if command -v "$p" >/dev/null 2>&1 && "$p" -c "import uno" >/dev/null 2>&1; then SYS_PY="$(command -v "$p")"; break; fi
done
if [ -z "$SYS_PY" ] && command -v apt-get >/dev/null 2>&1; then
  (apt-get install -y -q python3-uno libreoffice-calc >/dev/null 2>&1 || sudo -n apt-get install -y -q python3-uno libreoffice-calc >/dev/null 2>&1) || true
  for p in /usr/bin/python3 python3; do
    if command -v "$p" >/dev/null 2>&1 && "$p" -c "import uno" >/dev/null 2>&1; then SYS_PY="$(command -v "$p")"; break; fi
  done
fi
if [ -n "$SYS_PY" ] && command -v soffice >/dev/null 2>&1; then ok "LibreOffice: $(soffice --version 2>/dev/null | head -1 | cut -c1-40); uno in $SYS_PY"; else no "LibreOffice with its Python bridge (soffice on PATH and 'import uno' in a system Python: apt package python3-uno)"; fi

# 4. Java and the VBA grammar (downloaded once, then kept)
t0=$SECONDS
if command -v java >/dev/null 2>&1 && command -v javac >/dev/null 2>&1; then
  if "${SYS_PY:-python3}" "$ENGINE/check_grammar.py" --setup-only >/tmp/sldmacro_grammar_setup.log 2>&1; then ok "VBA grammar check: parser built ($((SECONDS - t0)) s)"; else no "VBA grammar check: $(tail -2 /tmp/sldmacro_grammar_setup.log | tr '\n' ' ')"; fi
else
  no "Java (java and javac on PATH) for the VBA grammar check"
fi

# 5. env.sh (in the home folder: the skill's own folder may be read-only)
mkdir -p "$HOME/.sldmacro"
cat > "$HOME/.sldmacro/env.sh" <<ENV
# written by setup_env.sh
export SLDMACRO_ENGINE="$ENGINE"
export SLDMACRO_CAD_PY="$CAD/bin/python"
export SLDMACRO_SLVS_PY="$SLVS/bin/python"
export SLDMACRO_SYS_PY="${SYS_PY:-/usr/bin/python3}"
sldmacro() { "\$SLDMACRO_SYS_PY" "\$SLDMACRO_ENGINE/sldmacro.py" "\$@"; }
ENV
ok "wrote $HOME/.sldmacro/env.sh  (source it, then: sldmacro help)"

if [ "$bad" = 0 ]; then say "SETUP: ALL OK"; else say "SETUP: SOMETHING IS MISSING (see above). Say so in the report; do not hand over a macro whose checks could not run."; fi
exit $bad
