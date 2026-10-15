"""Scripted AI session: a hand press built as an assembly, streamed like a live Claude response.

Used when the AI is offline ("Watch a demo" in the AI pane, or OPENSKETCH_AI_DEMO=1) and by the
tests. It goes through exactly the same streaming code path as the real model, so what you see is
what a real session looks like: thinking, a sentence per step, parts growing feature by feature,
components flying in and settling onto their mates.
"""

from __future__ import annotations

import json
import time
from types import SimpleNamespace as NS

# ----------------------------------------------------------------------------- geometry helpers


def _rect(sid, w, h, holes=()):
    pts = [("a", -w / 2, -h / 2), ("b", w / 2, -h / 2), ("c", w / 2, h / 2), ("d", -w / 2, h / 2)]
    ents = [{"id": f"{sid}p{i}", "type": "point", "x": x, "y": y} for i, x, y in pts]
    ents += [{"id": f"{sid}l{k}", "type": "line", "p1": f"{sid}p{pts[k][0]}", "p2": f"{sid}p{pts[(k + 1) % 4][0]}"} for k in range(4)]
    cons = [{"id": f"{sid}k1", "type": "horizontal", "refs": [f"{sid}l0"]}, {"id": f"{sid}k2", "type": "horizontal", "refs": [f"{sid}l2"]},
            {"id": f"{sid}k3", "type": "vertical", "refs": [f"{sid}l1"]}, {"id": f"{sid}k4", "type": "vertical", "refs": [f"{sid}l3"]},
            {"id": f"{sid}d1", "type": "distance", "refs": [f"{sid}l0"], "value": w, "name": "D1"},
            {"id": f"{sid}d2", "type": "distance", "refs": [f"{sid}l1"], "value": h, "name": "D2"}]
    for i, (x, y, r) in enumerate(holes):
        ents.append({"id": f"{sid}hc{i}", "type": "point", "x": x, "y": y})
        ents.append({"id": f"{sid}h{i}", "type": "circle", "center": f"{sid}hc{i}", "r": r})
        cons.append({"id": f"{sid}hd{i}", "type": "diameter", "refs": [f"{sid}h{i}"], "value": 2 * r, "name": f"D{3 + i}"})
    return ents, cons


def _circle(sid, r, x=0, y=0):
    return ([{"id": f"{sid}c", "type": "point", "x": x, "y": y}, {"id": f"{sid}o", "type": "circle", "center": f"{sid}c", "r": r}],
            [{"id": f"{sid}d", "type": "diameter", "refs": [f"{sid}o"], "value": 2 * r, "name": "D1"},
             {"id": f"{sid}k", "type": "coincident", "refs": [f"{sid}c", "origin"]}])


def _sketch(sid, name, ents_cons, plane="Top Plane"):
    ents, cons = ents_cons
    return {"id": sid, "type": "sketch", "name": name, "plane": {"ref": plane}, "entities": ents, "constraints": cons}


HOLES = [(110, 60), (-110, 60), (-110, -60), (110, -60)]   # sketch coordinates on the Top Plane
HOLE_R = 10.25                                               # 20.5 mm clearance for 20 mm columns


def _world(x, y):
    """Top Plane sketch point -> part coordinates (sketch y is -Z)."""
    return [x, 0, -y]


def base_part():
    return [
        _sketch("s1", "Sketch1", _rect("s1", 320, 220, [(x, y, HOLE_R) for x, y in HOLES])),
        {"id": "f1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "op": "boss", "end": "blind", "depth": 25},
        {"id": "f2", "type": "plane", "name": "Plane1", "base": {"ref": "Top Plane"}, "offset": 25, "hidden": True},
        {"id": "s3", "type": "sketch", "name": "Sketch2", "plane": {"ref": "f2"}, **dict(zip(("entities", "constraints"), _rect("s3", 160, 120)))},
        {"id": "f3", "type": "extrude", "name": "Boss-Extrude2", "sketch": "s3", "op": "boss", "end": "blind", "depth": 12},
    ]


def column_part():
    return [_sketch("s1", "Sketch1", _circle("s1", 10)),
            {"id": "f1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "op": "boss", "end": "blind", "depth": 400}]


def crown_part():
    return [_sketch("s1", "Sketch1", _rect("s1", 320, 220, [(x, y, HOLE_R) for x, y in HOLES] + [(0, 0, 31)])),
            {"id": "f1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "op": "boss", "end": "blind", "depth": 30}]


def platen_part():
    return [_sketch("s1", "Sketch1", _rect("s1", 300, 200, [(x, y, HOLE_R) for x, y in HOLES])),
            {"id": "f1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "op": "boss", "end": "blind", "depth": 20}]


def cylinder_part():
    return [_sketch("s1", "Sketch1", _circle("s1", 45)),
            {"id": "f1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "op": "boss", "end": "blind", "depth": 150},
            _sketch("s2", "Sketch2", _circle("s2", 15)),
            {"id": "f2", "type": "extrude", "name": "Boss-Extrude2", "sketch": "s2", "op": "boss", "end": "blind", "depth": 140, "reverse": True},
            {"id": "f3", "type": "plane", "name": "Plane1", "base": {"ref": "Top Plane"}, "offset": 150},
            {"id": "s4", "type": "sketch", "name": "Sketch3", "plane": {"ref": "f3"}, **dict(zip(("entities", "constraints"), _circle("s4", 30)))},
            {"id": "f4", "type": "extrude", "name": "Boss-Extrude3", "sketch": "s4", "op": "boss", "end": "blind", "depth": 20}]


def _plane(c, y, n):
    return {"component": c, "plane": {"point": [0, y, 0], "normal": [0, n, 0]}}


def _axis(c, x=0, y=0):
    return {"component": c, "axis": {"point": _world(x, y), "dir": [0, 1, 0]}}


# ----------------------------------------------------------------------------- the script

def script():
    """List of (thinking, text, [tool calls]) rounds."""
    cols = ["c2", "c3", "c4", "c5"]
    rounds = [
        ("A hand press: base plate, four guide columns, a crown on top, a platen that slides on the "
         "columns, and a cylinder on the crown driving the platen. Columns are one part used four times. "
         "Mate the columns into the base holes, the crown on the column tops, the cylinder on the crown, "
         "and the platen on the columns and the rod tip so it can still slide.",
         "I'll build this as an assembly of five parts. First the base plate: 320 x 220 x 25 mm with four column holes and a bolster.",
         [("create_part", {"part_id": "base", "name": "Base Plate", "material": "AISI 1020", "appearance": "#5d6b7a", "features": base_part()})]),
        (None, "Guide column: a 20 mm rod, 400 mm long.",
         [("create_part", {"part_id": "column", "name": "Guide Column", "material": "AISI 304", "appearance": "#c4cad2", "features": column_part()})]),
        (None, "Crown: the top plate with the column holes and a 62 mm bore for the cylinder.",
         [("create_part", {"part_id": "crown", "name": "Crown", "material": "AISI 1020", "appearance": "#5d6b7a", "features": crown_part()})]),
        (None, "Platen: the moving plate that slides on the columns.",
         [("create_part", {"part_id": "platen", "name": "Platen", "material": "6061 Alloy", "appearance": "#b0b8c2", "features": platen_part()})]),
        (None, "Cylinder: 90 mm body with a 30 mm rod pointing down.",
         [("create_part", {"part_id": "cylinder", "name": "Cylinder", "material": "6061 Alloy", "appearance": "#3c6fd1", "features": cylinder_part()})]),
        (None, "Now the assembly. The base goes in first and is fixed, then the four columns.",
         [("insert_component", {"component_id": "c1", "part": "base", "fixed": True})] +
         [("insert_component", {"component_id": c, "part": "column", "position": [x * 1.6, 120, -y * 1.6], "rotation": [0, 0, 8]})
          for c, (x, y) in zip(cols, HOLES)]),
        (None, "Each column goes through its base hole, flush with the underside.",
         [m for c, (x, y) in zip(cols, HOLES) for m in (
             ("add_mate", {"type": "concentric", "refs": [_axis("c1", x, y), {"component": c, "ref": "Y axis"}]}),
             ("add_mate", {"type": "coincident", "align": "aligned", "refs": [_plane("c1", 0, -1), _plane(c, 0, -1)]}))]),
        (None, "Crown on top of the columns.",
         [("insert_component", {"component_id": "c6", "part": "crown", "position": [0, 520, 0]}),
          ("add_mate", {"type": "concentric", "refs": [_axis("c6", *HOLES[0]), {"component": "c2", "ref": "Y axis"}]}),
          ("add_mate", {"type": "concentric", "refs": [_axis("c6", *HOLES[2]), {"component": "c4", "ref": "Y axis"}]}),
          ("add_mate", {"type": "coincident", "align": "aligned", "refs": [_plane("c6", 30, 1), _plane("c2", 400, 1)]})]),
        (None, "Cylinder sits on the crown, rod through the bore.",
         [("insert_component", {"component_id": "c7", "part": "cylinder", "position": [0, 640, 0], "rotation": [0, 30, 0]}),
          ("add_mate", {"type": "concentric", "refs": [_axis("c6"), {"component": "c7", "ref": "Y axis"}]}),
          ("add_mate", {"type": "coincident", "align": "anti", "refs": [_plane("c6", 30, 1), _plane("c7", 0, -1)]})]),
        (None, "Platen slides on two columns, and rests on the rod tip.",
         [("insert_component", {"component_id": "c8", "part": "platen", "position": [260, 200, 0]}),
          ("add_mate", {"type": "concentric", "refs": [_axis("c8", *HOLES[0]), {"component": "c2", "ref": "Y axis"}]}),
          ("add_mate", {"type": "concentric", "refs": [_axis("c8", *HOLES[2]), {"component": "c4", "ref": "Y axis"}]}),
          ("add_mate", {"type": "coincident", "align": "anti", "refs": [_plane("c8", 20, 1), _plane("c7", -140, -1)]})]),
        (None, "Checking for clashes.", [("check_interference", {})]),
        (None, "Built a hand press assembly: base, four guide columns, crown, platen and cylinder, 8 components "
               "and 16 mates. The platen is located by the rod tip; suppress that mate to slide it on the columns.", []),
    ]
    return rounds


def bracket_features():
    def rect(sid, x0, y0, x1, y1):
        pts = [("a", x0, y0), ("b", x1, y0), ("c", x1, y1), ("d", x0, y1)]
        ents = [{"id": f"{sid}p{i}", "type": "point", "x": x, "y": y} for i, x, y in pts]
        ents += [{"id": f"{sid}l{k}", "type": "line", "p1": f"{sid}p{pts[k][0]}", "p2": f"{sid}p{pts[(k + 1) % 4][0]}"} for k in range(4)]
        cons = [{"id": f"{sid}h0", "type": "horizontal", "refs": [f"{sid}l0"]}, {"id": f"{sid}h1", "type": "horizontal", "refs": [f"{sid}l2"]},
                {"id": f"{sid}v0", "type": "vertical", "refs": [f"{sid}l1"]}, {"id": f"{sid}v1", "type": "vertical", "refs": [f"{sid}l3"]},
                {"id": f"{sid}d0", "type": "distance", "refs": [f"{sid}l0"], "value": x1 - x0, "name": "D1"},
                {"id": f"{sid}d1", "type": "distance", "refs": [f"{sid}l1"], "value": y1 - y0, "name": "D2"}]
        return ents, cons
    holes = ([{"id": "s3c1", "type": "point", "x": 15, "y": 12}, {"id": "s3o1", "type": "circle", "center": "s3c1", "r": 4},
              {"id": "s3c2", "type": "point", "x": 15, "y": -12}, {"id": "s3o2", "type": "circle", "center": "s3c2", "r": 4}],
             [{"id": "s3k1", "type": "equal", "refs": ["s3o1", "s3o2"]}, {"id": "s3k2", "type": "diameter", "refs": ["s3o1"], "value": 8, "name": "D1"}])
    return [
        _sketch("s1", "Sketch1", rect("s1", -40, -25, 40, 25)),
        {"id": "f1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "op": "boss", "end": "blind", "depth": 8},
        _sketch("s2", "Sketch2", rect("s2", -40, 8, -32, 58), plane="Front Plane"),
        {"id": "f2", "type": "extrude", "name": "Boss-Extrude2", "sketch": "s2", "op": "boss", "end": "midplane", "depth": 50},
        _sketch("s3", "Sketch3", holes),
        {"id": "f3", "type": "extrude", "name": "Cut-Extrude1", "sketch": "s3", "op": "cut", "end": "through_all", "dir2": {"end": "through_all"}},
        _sketch("s4", "Sketch4", _circle("s4", 6, 0, 38), plane="Right Plane"),
        {"id": "f4", "type": "extrude", "name": "Cut-Extrude2", "sketch": "s4", "op": "cut", "end": "through_all", "dir2": {"end": "through_all"}},
        {"id": "f5", "type": "fillet", "name": "Fillet1", "radius": 4, "edges": [{"mid": [-32, 8, 0]}]},
    ]


def part_script():
    return [
        ("An L bracket: base plate, an upright wall, two mounting holes in the base, one in the wall, and an inside fillet for strength.",
         "One part, so I'll build it as features: an 80 x 50 x 8 mm base with an 8 mm upright, holes and a 4 mm inside fillet.",
         [("propose_features", {"mode": "replace", "summary": "L bracket 80 x 50 mm with holes and an inside fillet", "features": bracket_features()})]),
        (None, "Built an L bracket: 8 mm base and upright, two 8 mm base holes, a 12 mm wall hole and a 4 mm inside fillet.", []),
    ]


# ----------------------------------------------------------------------------- fake streaming client

class _Stream:
    def __init__(self, resp, events, speed):
        self.resp, self.events, self.speed = resp, events, speed

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False

    def __iter__(self):
        for e, delay in self.events:
            if delay and self.speed:
                time.sleep(delay / self.speed)
            yield e

    def get_final_message(self):
        return self.resp


class DemoMessages:
    def __init__(self, speed: float = 1.0, scenario: str = "press"):
        self.rounds = part_script() if scenario == "part" else script()
        self.speed = speed
        self.n = 0

    def stream(self, **kw):
        r = self.rounds[min(self.n, len(self.rounds) - 1)]
        self.n += 1
        thinking, text, calls = r
        content, events = [], []
        i = 0
        if thinking:
            b = NS(type="thinking", thinking=thinking, signature="demo")
            content.append(b)
            events.append((NS(type="content_block_start", index=i, content_block=NS(type="thinking", thinking="")), 0.2))
            for w in _chunks(thinking, 18):
                events.append((NS(type="content_block_delta", index=i, delta=NS(type="thinking_delta", thinking=w)), 0.03))
            events.append((NS(type="content_block_stop", index=i), 0))
            i += 1
        if text:
            content.append(NS(type="text", text=text))
            events.append((NS(type="content_block_start", index=i, content_block=NS(type="text", text="")), 0.1))
            for w in _chunks(text, 6):
                events.append((NS(type="content_block_delta", index=i, delta=NS(type="text_delta", text=w)), 0.025))
            events.append((NS(type="content_block_stop", index=i), 0))
            i += 1
        for k, (name, inp) in enumerate(calls):
            b = NS(type="tool_use", id=f"demo_{self.n}_{k}", name=name, input=inp)
            content.append(b)
            events.append((NS(type="content_block_start", index=i, content_block=NS(type="tool_use", id=b.id, name=name, input={})), 0.15))
            for w in _chunks(json.dumps(inp), 40):
                events.append((NS(type="content_block_delta", index=i, delta=NS(type="input_json_delta", partial_json=w)), 0.03))
            events.append((NS(type="content_block_stop", index=i), 0))
            i += 1
        resp = NS(content=content, stop_reason="tool_use" if calls else "end_turn")
        return _Stream(resp, events, self.speed)


def _chunks(s: str, n: int):
    return [s[k:k + n] for k in range(0, len(s), n)]


def client(speed: float = 1.0, scenario: str = "press"):
    return NS(beta=NS(messages=DemoMessages(speed, scenario)))
