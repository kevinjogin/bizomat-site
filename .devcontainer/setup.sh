#!/usr/bin/env bash
# Runs once when the codespace is created: system libraries for OpenCascade, then the app.
set -euo pipefail
sudo apt-get update -qq
sudo apt-get install -y -qq --no-install-recommends libgl1 libglu1-mesa libxrender1 libxext6 libx11-6 >/dev/null
# exact versions (the ones CI tests and the server image runs), then the app itself without touching them
pip install --no-cache-dir -q -r requirements-dev.txt
pip install --no-cache-dir -q --no-deps -e .
python -c "import build123d; print('build123d', build123d.__version__, 'ready')"
