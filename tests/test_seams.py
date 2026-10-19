"""Logic written twice (Python and the browser, or a constant copied into a tool schema) agrees. Each of these
drifted once without a failing test (cross-check audit 2026-10-19)."""
import json
import shutil
import subprocess
import typing
from pathlib import Path

import pytest

from opensketch import assembly, edits, importer

ROOT = Path(__file__).resolve().parent.parent


def test_mcp_mate_and_toolbox_literals_match_the_solver_and_catalogue():
    from opensketch import mcp_server, sw_tools
    assert set(typing.get_args(mcp_server.MateType)) == set(assembly.MATE_TYPES)
    assert set(typing.get_args(sw_tools.MATE_TYPES)) == set(assembly.MATE_TYPES) - {"coupler"}  # OpenSketch-only
    assert set(typing.get_args(mcp_server.StdKind)) == set(importer.STANDARD)


@pytest.mark.skipif(shutil.which("node") is None, reason="node is not installed")
def test_sketch_ids_match_the_browser(tmp_path):
    feats = [{"type": "extrude", "sketch": "s1"}, {"type": "sweep", "sketch": "s1", "path": "s2"},
             {"type": "loft", "profiles": ["s3", "s4", "s3"]}, {"type": "revolve", "sketch": "s5", "path": "x"},
             {"type": "fillet", "edges": []}]
    script = tmp_path / "ids.mjs"
    script.write_text("import { featureSketchIds } from '" + (ROOT / "opensketch/static/js/model-utils.js").as_uri() + "';\n"
                      f"console.log(JSON.stringify({json.dumps(feats)}.map(featureSketchIds)));\n")
    run = subprocess.run(["node", str(script)], capture_output=True, text=True, timeout=60)
    assert run.returncode == 0, run.stderr
    js = json.loads(run.stdout)
    for f, j in zip(feats, js):
        assert sorted(set(edits.sketch_ids(f))) == sorted(j), f
