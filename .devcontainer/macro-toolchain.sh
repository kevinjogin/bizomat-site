#!/usr/bin/env bash
# Optional: the toolchain the SOLIDWORKS macro export uses to rebuild parts as native features and to check
# the macro (LibreOffice, Java, a sketch solver, build123d 0.13 in its own environment). About 5 minutes.
# Without it the export still works: every part goes to SOLIDWORKS as a STEP import.
set -uo pipefail
cd "$(dirname "$0")/.."
sudo apt-get update -qq
sudo apt-get install -y -qq --no-install-recommends libreoffice-calc python3-uno default-jdk-headless gcc g++ >/dev/null
bash opensketch/vendor/sldmacro/scripts/setup_env.sh
