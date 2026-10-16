"""PCB reference data stays useful to the AI without sending every package drawing record."""
import copy
import json

import pytest

from opensketch import ai


def test_non_list_optional_package_metadata_remains_readable():
    doc = {"features": [], "pcb": {"packages": 3}}
    assert ai.model_view(doc) == doc


@pytest.mark.parametrize("as_assembly", [False, True])
def test_model_view_summarizes_only_package_geometry_without_mutating_source(as_assembly):
    part = {"features": [], "pcb": {
        "format": "eagle-xml", "source": "board.brd",
        "coordinates": "EAGLE XY mm; world [x, height, -y]",
        "thickness": {"value": 1.6, "source": "default"},
        "holes": [{"x": 5, "y": 8, "drill": 3.2, "source": "plain"}],
        "components": [{"name": "J1", "library": "connectors", "package": "USB",
                        "position": [12, 1.6, -20], "rotation": 90, "side": "top"}],
        "limitations": ["No populated component bodies or heights are inferred."],
        "packages": [{"library": "connectors", "name": "USB", "geometry": [
            {"tag": "wire", "attributes": {"x1": str(i), "y1": "0", "x2": str(i+1), "y2": "1"}}
            for i in range(500)]}],
    }}
    doc = {"type": "assembly", "parts": {"board": part}, "components": []} if as_assembly else part
    original = copy.deepcopy(doc)
    view = ai.model_view(doc)
    pcb = view["parts"]["board"]["pcb"] if as_assembly else view["pcb"]
    assert pcb["packages"] == [{"library": "connectors", "name": "USB", "geometry_count": 500}]
    assert {k: v for k, v in pcb.items() if k != "packages"} == {
        k: v for k, v in part["pcb"].items() if k != "packages"}
    assert doc == original
    assert len(json.dumps(view)) < len(json.dumps(doc)) / 10
    # The AI view is detached even for metadata retained in full.
    pcb["components"][0]["position"][0] = 99
    assert doc == original
