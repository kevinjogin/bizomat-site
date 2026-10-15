#!/usr/bin/env bash
# Runs once when the codespace is created: system libraries for OpenCascade, then the app.
set -euo pipefail
sudo apt-get update -qq
sudo apt-get install -y -qq --no-install-recommends libgl1 libglu1-mesa libxrender1 libxext6 libx11-6 >/dev/null
pip install --no-cache-dir -q -e ".[ai,dev]"
python -c "import build123d; print('build123d', build123d.__version__, 'ready')"
