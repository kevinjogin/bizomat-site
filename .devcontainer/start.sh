#!/usr/bin/env bash
# Runs each time the codespace opens: start OpenSketch on port 8000 unless it is already running.
# run.sh keeps it running and pulls each push to main within about a minute (no restart needed).
if curl -s -o /dev/null http://127.0.0.1:8000/; then
  echo "OpenSketch is already running. Open the Ports tab and click the globe next to port 8000."
  exit 0
fi
# the SOLIDWORKS macro toolchain installs once, in the background (the app works without it)
if [ ! -f "$HOME/.sldmacro/env.sh" ] && ! pgrep -f macro-toolchain.sh >/dev/null 2>&1; then
  setsid nohup bash .devcontainer/macro-toolchain.sh > "$HOME/.opensketch-macro-toolchain.log" 2>&1 < /dev/null &
fi
echo "Starting OpenSketch. It opens in a new browser tab in a few seconds."
echo "If it does not, open the Ports tab and click the globe next to port 8000."
exec bash .devcontainer/run.sh
