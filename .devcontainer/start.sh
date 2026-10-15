#!/usr/bin/env bash
# Runs each time the codespace opens: start OpenSketch on port 8000 unless it is already running.
if curl -s -o /dev/null http://127.0.0.1:8000/; then
  echo "OpenSketch is already running. Open the Ports tab and click the globe next to port 8000."
  exit 0
fi
echo "Starting OpenSketch. It opens in a new browser tab in a few seconds."
echo "If it does not, open the Ports tab and click the globe next to port 8000."
exec python -m opensketch --host 0.0.0.0 --port 8000 --no-browser
