"""The features that existed before the registry. Their PropertyManagers are hand-written in features.js
(ui="custom") and their geometry stays in geometry._regen_feature; the descriptions here give the AI and
MCP their tools, help text and input checks."""

from . import FeatureType, Param, register

END = [("blind", "Blind"), ("through_all", "Through All"), ("up_to_next", "Up To Next"), ("midplane", "Mid Plane")]
OP = [("boss", "Boss"), ("cut", "Cut")]

register(FeatureType(
    "plane", "Plane", "Plane", "plane", "A reference plane offset from a plane or planar face.", ui="custom",
    params=[
        Param("base", "plane", "The plane or planar face it is offset from", required=True),
        Param("offset", "length", "Offset distance", default=10, min=0),
        Param("flip", "bool", "Offset to the other side", default=False),
    ]))

register(FeatureType(
    "extrude", "Boss-Extrude", "Boss-Extrude", "extrude", "Extrudes a sketch's closed loops into a boss, or cuts with them.",
    ui="custom", label="Extruded Boss/Base",
    notes=('Boss extrudes along the sketch plane normal; use "reverse": true for the other way. A cut sketched on a '
           'top face needs "reverse": true to go into the material.'),
    params=[
        Param("sketch", "sketch", "The sketch to extrude", required=True),
        Param("op", "enum", "boss adds material, cut removes it", default="boss", options=OP),
        Param("end", "enum", "End condition", default="blind", options=END),
        Param("depth", "length", "Depth", default=10, min=0, when={"end": ["blind", "midplane"]}),
        Param("reverse", "bool", "Extrude the other way", default=False),
        Param("draft", "angle", "Draft angle of the side faces", default=0, min=0, max=89),
        Param("draft_outward", "bool", "Draft outward instead of inward"),
        Param("dir2", "object", 'Second direction {"end": "blind"|"through_all", "depth": mm} or null'),
        Param("flip_side", "bool", "Cut: keep the inside and remove the rest"),
        Param("merge", "bool", "Boss: merge with the existing body", default=True),
    ]))

register(FeatureType(
    "revolve", "Revolve", "Revolve", "revolve", "Revolves a sketch's closed loops about a line or centerline in the same sketch.",
    ui="custom", label="Revolved Boss/Base",
    params=[
        Param("sketch", "sketch", "The sketch to revolve", required=True),
        Param("axis", "sketch_line", "Line or centerline id in that sketch", required=True),
        Param("angle", "angle", "Angle", default=360, min=0.001, max=360),
        Param("op", "enum", "boss adds material, cut removes it", default="boss", options=OP),
        Param("end", "enum", "blind or midplane (symmetric about the sketch)", default="blind",
              options=[("blind", "Blind"), ("midplane", "Mid-Plane")]),
        Param("reverse", "bool", "Revolve the other way"),
    ]))

register(FeatureType(
    "fillet", "Fillet", "Fillet", "fillet", "Rounds edges with a constant radius.", ui="custom",
    params=[
        Param("radius", "length", "Radius", default=2, min=0.0001),
        Param("edges", "edges", "Edges to round", required=True),
    ]))

register(FeatureType(
    "chamfer", "Chamfer", "Chamfer", "chamfer", "Bevels edges.", ui="custom",
    params=[
        Param("distance", "length", "Distance", default=1, min=0.0001),
        Param("edges", "edges", "Edges to bevel", required=True),
        Param("mode", "enum", "Angle Distance or Distance Distance", default="angle_distance",
              options=[("angle_distance", "Angle Distance"), ("distance_distance", "Distance Distance")]),
        Param("angle", "angle", "Angle", default=45, min=0.1, max=89.9, when={"mode": "angle_distance"}),
        Param("distance2", "length", "Second distance", min=0.0001, when={"mode": "distance_distance"}),
    ]))

register(FeatureType(
    "shell", "Shell", "Shell", "shell", "Hollows the body to a wall thickness, removing the chosen faces.", ui="custom",
    params=[
        Param("thickness", "length", "Wall thickness", default=1, min=0.0001),
        Param("faces", "faces", "Faces to remove (open faces); empty makes a closed hollow body", default=[]),
        Param("outward", "bool", "Add the wall outside the body"),
    ]))

register(FeatureType(
    "mirror", "Mirror", "Mirror", "mirror", "Mirrors extrudes and revolves, or the whole body, about a plane.", ui="custom",
    params=[
        Param("plane", "plane", "Mirror plane", required=True),
        Param("features", "features", "Extrude or revolve feature ids; empty mirrors the whole body", default=[]),
    ]))

register(FeatureType(
    "linear_pattern", "Linear Pattern", "LPattern", "linpattern", "Copies extrudes and revolves along one or two directions.",
    ui="custom", command="linpattern",
    params=[
        Param("features", "features", "Extrude or revolve feature ids", required=True),
        Param("direction", "direction", "Direction 1", default="X"),
        Param("count", "int", "Number of instances including the original", default=3, min=1, max=500),
        Param("spacing", "length", "Spacing", default=20, min=0.0001),
        Param("reverse", "bool", "Reverse direction 1"),
        Param("direction2", "direction", "Optional direction 2"),
        Param("count2", "int", "Instances in direction 2", min=1, max=500),
        Param("spacing2", "length", "Spacing in direction 2", min=0.0001),
    ]))

register(FeatureType(
    "circular_pattern", "Circular Pattern", "CirPattern", "circpattern", "Copies extrudes and revolves around an axis.",
    ui="custom", command="circpattern",
    params=[
        Param("features", "features", "Extrude or revolve feature ids", required=True),
        Param("axis", "axis", "Axis through the part origin", default="Y"),
        Param("count", "int", "Number of instances including the original", default=4, min=1, max=500),
        Param("angle", "angle", "Total angle", default=360, min=0.001, max=360),
        Param("equal_spacing", "bool", "Spread the instances evenly over the angle", default=True),
        Param("step", "angle", "Angle between instances", when={"equal_spacing": False}),
    ]))
