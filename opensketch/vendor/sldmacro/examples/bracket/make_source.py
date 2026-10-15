"""Makes src/bracket.step: the example part, built with plain build123d (not with the macro engine), then turned and
moved so that the file is NOT in the frame the recipe wants. The recipe has to put it back (source.oriented).

    <cad python> make_source.py
"""
from build123d import (Axis, Box, Cylinder, Location, Plane, Pos, Rot, RectangleRounded, SlotOverall, chamfer, export_step, extrude, fillet)
import math

# base plate: 60 x 40, R4 corners, 4 thick, bottom on Z = 0, centred on the origin
plate = extrude(RectangleRounded(60, 40, 4), 4)
# round boss: 16 dia at the plate, 8 high, on (15, 0), with 2 deg draft (narrower toward the top)
boss = extrude(Pos(15, 0, 4) * __import__("build123d").Circle(8), 8, taper=2)
part = plate + boss
# bore through the boss and the plate: 8 dia
part -= Pos(15, 0, 0) * extrude(__import__("build123d").Circle(4), 12)
# two fixing holes: 4.5 dia at (-20, +-12), with 90 deg countersinks 8.5 dia from the top face
for y in (-12, 12):
    part -= Pos(-20, y, 0) * extrude(__import__("build123d").Circle(2.25), 4)
    part -= extrude(Pos(-20, y, 4) * __import__("build123d").Circle(4.25), -2.0, taper=45)
# adjustment slot: 6 wide, 16 long, full round ends, along Y at x = -4
part -= Pos(-4, 0, 0) * extrude(Rot(0, 0, 90) * SlotOverall(16, 6), 4)
# 0.5 x 45 deg chamfer round the top outline of the plate
top_outer = part.faces().filter_by(Axis.Z).sort_by(Axis.Z)
plate_top = [f for f in part.faces() if abs(f.center().Z - 4) < 1e-6 and f.normal_at(f.center()).Z > 0.9][0]
part = chamfer(plate_top.outer_wire().edges(), 0.5)
# R1 where the boss meets the plate
root = [e for e in part.edges() if e.geom_type.name == "CIRCLE" and abs(e.radius - 8) < 1e-6 and abs((e @ 0).Z - 4) < 1e-6]
part = fillet(root, 1.0)
assert len(part.solids()) == 1 and part.is_valid
print("in the recipe's frame: volume %.3f mm3" % part.volume)
# out of that frame: the plate's bottom face ends up on the plane Y = 30, the long side along the file's Z
moved = Location((12.5, 30.0, -7.25)) * (Rot(0, 0, 0) * (Rot(-90, 0, 0) * (Rot(0, 0, 90) * part)))
export_step(moved, "src/bracket.step")
b = moved.bounding_box()
print("in the file: box x %.2f..%.2f  y %.2f..%.2f  z %.2f..%.2f" % (b.min.X, b.max.X, b.min.Y, b.max.Y, b.min.Z, b.max.Z))
