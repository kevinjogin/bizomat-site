"""Reference parts: rebuild each recipe in tests/reference_parts and compare with hand-worked numbers.

Expected values come from closed-form formulas (see each file's "derivation" and recipes.py), not from a
previous OpenSketch run, so a change that quietly moves geometry fails here. The JSON files are also
ready-made `batch` steps for trying the MCP path by hand.
"""
import json
from pathlib import Path

import pytest

from opensketch import inspection
from tests.reference_parts.recipes import recipes

FILES = sorted((Path(__file__).parent / "reference_parts").glob("*.json"))


def test_json_files_match_recipes():
    """The checked-in JSON is what recipes.py produces (run it after changing a recipe)."""
    assert {f.stem for f in FILES} == {r["name"] for r in recipes()}
    for r in recipes():
        saved = json.loads((Path(__file__).parent / "reference_parts" / f"{r['name']}.json").read_text())
        assert saved["features"] == r["features"], r["name"]
        assert abs(saved["expect"]["volume_mm3"] - r["expect"]["volume_mm3"]) < 1e-5, r["name"]


@pytest.mark.parametrize("path", FILES, ids=[f.stem for f in FILES])
def test_reference_part(path):
    ref = json.loads(path.read_text())
    out = inspection.inspect_part({"name": ref["name"], "features": ref["features"]}, sketches=False)
    assert out["rebuilt"] and not out["errors"], out["errors"]
    assert out["clean"], out["warnings"]
    body, exp = out["body"], ref["expect"]
    v = exp["volume_mm3"]
    assert abs(body["volume_mm3"] - v) <= max(1e-3, 1e-6 * v), (body["volume_mm3"], v)
    for got, want in zip(body["center_of_mass"], exp["center_of_mass"]):
        assert abs(got - want) <= 2e-3, (body["center_of_mass"], exp["center_of_mass"])
    for key in ("min", "max"):
        for got, want in zip(body["bbox"][key], exp["bbox"][key]):
            assert abs(got - want) <= 2e-3, (key, body["bbox"], exp["bbox"])
