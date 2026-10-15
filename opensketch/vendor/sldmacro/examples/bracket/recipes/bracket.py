"""Example bracket: a plate with a drafted round boss, a bore, two countersunk fixing holes and an adjustment slot.

How this recipe was written (the order to follow for any part):
  1. `sldmacro look src/bracket.step` said the features run along the file's +Y, not its Z.
  2. `sldmacro look src/bracket.step --z 0,1,0 --x 0,0,1` put the long side along X; the base outline's centre was at
     (-7.25, 12.5) and its lower face at Z 30, so `--origin -7.25,12.5,30` makes the listing read in the part's own
     frame: plate 60 x 40 centred on the origin, lower face on Z = 0. Those three values are in source() below.
  3. The levels (Z 0, 4, 12), the round walls and the outlines at Z 2 and Z 8 gave every number here.
  4. Extrudes and cuts first (`sldmacro check`: only the draft, chamfer and radius were then missing), then the draft,
     the chamfer and the radius, checking after each.
"""
from core import Ch, Dr, Ex, Fi, PART_FRAME, Part, circle, circle_edges, face_loop_edges, obround, rrect
from source import oriented, step

T = 4.0             # plate thickness
H = 12.0            # top of the boss
BOSS = (-15.0, 0.0)
HOLES = [(20.0, -12.0), (20.0, 12.0)]


def source():
    return oriented(step("src/bracket.step"), z=(0, 1, 0), x=(0, 0, 1), origin=(-7.25, 12.5, 30.0))


def part():
    steps = [
        Ex("plate", "add", 0.0, T, [rrect(-30.0, -20.0, 30.0, 20.0, 4.0)], "60 x 40, R4 corners, 4 thick"),
        Ex("boss", "add", T, H, [circle(*BOSS, 8.0)], "16 dia at the plate, 8 high, 15 from the plate's centre"),
        Ex("bore", "cut", H, 0.0, [circle(*BOSS, 4.0)], "8 dia through the boss and the plate", refs=("boss",)),
        Ex("fixing holes", "cut", T, 0.0, [circle(x, y, 2.25) for x, y in HOLES], "2 x 4.5 dia, 24 apart, 10 from the end"),
        Ex("countersinks", "cut", T, T - 2.0, [circle(x, y, 4.25) for x, y in HOLES], "90 deg countersinks, 8.5 dia at the face, 2 deep",
           refs=("fixing holes",), taper=45.0),
        Ex("slot", "cut", T, 0.0, [obround(1.0, -8.0, 7.0, 8.0)], "6 wide, 16 long, full round ends, 4 from the plate's centre"),
        Dr("boss draft", ("boss",), 2.0, T, -1, "2 deg, from the plate's top face, narrower toward the top"),
        Ch("top edge", 0.5, face_loop_edges(T, "outer"), "0.5 x 45 deg round the top of the plate"),
        Fi("boss root", 1.0, circle_edges(T, 8.0, at=[BOSS]), "R1 where the boss meets the plate"),
    ]
    return Part("bracket", "Bracket", PART_FRAME, steps, src=source,
                notes=[],
                where="origin at the centre of the plate's outline; X along the long side; Front plane = the plate's lower face; the boss rises to Z +12")
