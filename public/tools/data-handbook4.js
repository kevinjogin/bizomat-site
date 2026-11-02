// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook4) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "circular-segment",
    "name": "Circular Segment and Arc",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What chord, arc length, angle and area does this circular segment have?",
    "description": "Solve a circular segment from its radius and height, or find the radius of an arc from a measured chord and height.",
    "keywords": [
      "MAKEOS",
      "segment",
      "chord",
      "sagitta",
      "arc length",
      "radius from chord"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Known values",
        "type": "select",
        "default": "rh",
        "options": [
          [
            "rh",
            "Radius and segment height"
          ],
          [
            "ch",
            "Chord and segment height (find the radius)"
          ]
        ]
      },
      {
        "key": "radius",
        "label": "Radius",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "chord",
        "label": "Chord length",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "height",
        "label": "Segment height (sagitta)",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "regular-polygon",
    "name": "Regular Polygon and Hexagon Sizes",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What are the across-flats, across-corners, side and area of this regular polygon?",
    "description": "Convert between side length, across-flats and across-corners sizes of a regular polygon such as a hexagon or square, with area and angles.",
    "keywords": [
      "MAKEOS",
      "hexagon",
      "across flats",
      "across corners",
      "octagon",
      "square",
      "polygon"
    ],
    "fields": [
      {
        "key": "sides",
        "label": "Number of sides",
        "type": "number",
        "default": 6,
        "unit": "sides",
        "min": 3,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "basis",
        "label": "Known dimension",
        "type": "select",
        "default": "flats",
        "options": [
          [
            "flats",
            "Across flats (inscribed circle diameter)"
          ],
          [
            "corners",
            "Across corners (circumscribed circle diameter)"
          ],
          [
            "side",
            "Side length"
          ]
        ]
      },
      {
        "key": "size",
        "label": "Size of the known dimension",
        "type": "number",
        "default": 24,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "triangle-solver",
    "name": "Triangle Solver",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What are the missing sides, angles and area of this triangle?",
    "description": "Solve any triangle from three sides, two sides and the included angle, or two angles and the included side, using the laws of sines and cosines.",
    "keywords": [
      "MAKEOS",
      "triangle",
      "law of cosines",
      "law of sines",
      "trigonometry",
      "oblique triangle"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Known values",
        "type": "select",
        "default": "sss",
        "options": [
          [
            "sss",
            "Three sides (a, b, c)"
          ],
          [
            "sas",
            "Two sides and included angle (a, b, C)"
          ],
          [
            "asa",
            "Two angles and included side (A, B, c)"
          ]
        ]
      },
      {
        "key": "a",
        "label": "Side a",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Side b",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Side c",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Angle A (opposite a)",
        "type": "number",
        "default": 40,
        "unit": "°",
        "min": 0.000001,
        "max": 179.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Angle B (opposite b)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 0.000001,
        "max": 179.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Angle C (opposite c)",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.000001,
        "max": 179.999,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "tank-volume",
    "name": "Cylindrical Tank Contents",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "How much liquid is in this partly filled cylindrical tank?",
    "description": "Volume of liquid in a horizontal or vertical cylindrical tank at a given depth, with percentage full and remaining capacity.",
    "keywords": [
      "MAKEOS",
      "tank",
      "dip chart",
      "partial volume",
      "horizontal cylinder",
      "coolant tank",
      "fuel"
    ],
    "fields": [
      {
        "key": "orient",
        "label": "Tank orientation",
        "type": "select",
        "default": "h",
        "options": [
          [
            "h",
            "Horizontal (axis level)"
          ],
          [
            "v",
            "Vertical (axis upright)"
          ]
        ]
      },
      {
        "key": "diameter",
        "label": "Inside diameter",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "length",
        "label": "Inside length (straight shell)",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Liquid depth",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "frustum-volume",
    "name": "Hopper and Frustum Volume",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What volume and side area does this tapered hopper or frustum have?",
    "description": "Volume and slant surface area of a round (cone frustum) or rectangular (pyramid frustum) hopper, transition or bin.",
    "keywords": [
      "MAKEOS",
      "hopper",
      "frustum",
      "cone",
      "pyramid",
      "bin volume",
      "transition"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Shape",
        "type": "select",
        "default": "round",
        "options": [
          [
            "round",
            "Round (cone frustum)"
          ],
          [
            "rect",
            "Rectangular (pyramid frustum)"
          ]
        ]
      },
      {
        "key": "top1",
        "label": "Top diameter or length",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "top2",
        "label": "Top width (rectangular only)",
        "type": "number",
        "default": 800,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bot1",
        "label": "Bottom diameter or length",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bot2",
        "label": "Bottom width (rectangular only)",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "height",
        "label": "Vertical height",
        "type": "number",
        "default": 900,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ellipse",
    "name": "Ellipse Area and Perimeter",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What area, perimeter and eccentricity does this ellipse have?",
    "description": "Area, perimeter (Ramanujan’s second approximation) and eccentricity of an ellipse from its two axes.",
    "keywords": [
      "MAKEOS",
      "ellipse",
      "oval",
      "perimeter",
      "manway",
      "elliptical"
    ],
    "fields": [
      {
        "key": "major",
        "label": "Major axis (full length)",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minor",
        "label": "Minor axis (full width)",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "compound-angle",
    "name": "Compound Angle",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What true compound angle results from tilts in two perpendicular planes?",
    "description": "Combine two angles measured in perpendicular planes into the true compound angle and its direction, for compound sine plates, fixtures and hoppers.",
    "keywords": [
      "MAKEOS",
      "compound angle",
      "sine plate",
      "tilt",
      "double angle",
      "fixture"
    ],
    "fields": [
      {
        "key": "angleA",
        "label": "Tilt angle in the first plane",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 0,
        "max": 89.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angleB",
        "label": "Tilt angle in the perpendicular plane",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 89.999,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "polar-coordinates",
    "name": "Polar and Rectangular Coordinates",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What are the X–Y coordinates of this radius and angle, or the radius and angle of this X–Y point?",
    "description": "Convert a point between polar (radius and angle) and rectangular (X and Y) coordinates about a chosen origin, for hole positions and CNC programming.",
    "keywords": [
      "MAKEOS",
      "polar",
      "rectangular",
      "coordinates",
      "CNC",
      "hole position",
      "XY"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Convert",
        "type": "select",
        "default": "toxy",
        "options": [
          [
            "toxy",
            "Radius and angle → X and Y"
          ],
          [
            "topolar",
            "X and Y → radius and angle"
          ]
        ]
      },
      {
        "key": "radius",
        "label": "Radius",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Angle from +X axis (anticlockwise)",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": -36000,
        "max": 36000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "X",
        "type": "number",
        "default": 43.3013,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y",
        "label": "Y",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "dovetail-measurement",
    "name": "Dovetail Measurement over Rods",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What should the measurement over (or between) rods read for this dovetail?",
    "description": "Measurement over rods for a male dovetail or between rods for a female dovetail slide, with a check that the rods touch the flanks below the edge.",
    "keywords": [
      "MAKEOS",
      "dovetail",
      "rods",
      "wires",
      "slide",
      "inspection",
      "over pins"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Dovetail type",
        "type": "select",
        "default": "male",
        "options": [
          [
            "male",
            "Male (tongue) – measure over rods"
          ],
          [
            "female",
            "Female (slot) – measure between rods"
          ]
        ]
      },
      {
        "key": "angle",
        "label": "Dovetail angle (flank to base)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 1,
        "max": 89.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "width",
        "label": "Width at the base corners",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rod",
        "label": "Rod diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Dovetail depth",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "v-groove-pin",
    "name": "V-Groove Measurement over a Pin",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "How far should a gauge pin stand above the surface in this V-groove?",
    "description": "Height of a gauge pin above (or below) the top surface of a V-groove, the depth of the sharp V and the pin contact positions.",
    "keywords": [
      "MAKEOS",
      "v-groove",
      "pin",
      "groove depth",
      "vee",
      "inspection"
    ],
    "fields": [
      {
        "key": "angle",
        "label": "Included groove angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 1,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "width",
        "label": "Groove width at the top surface",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pin",
        "label": "Pin diameter",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gauge-block-stack",
    "name": "Gauge Block Stack Builder",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Which gauge blocks make up this length with the fewest blocks?",
    "description": "Select gauge blocks from a standard 88-piece metric or 81-piece inch set to build a length, by eliminating the right-hand digit first.",
    "keywords": [
      "MAKEOS",
      "gauge blocks",
      "slip gauges",
      "gage blocks",
      "wringing",
      "sine bar stack"
    ],
    "fields": [
      {
        "key": "set",
        "label": "Gauge block set",
        "type": "select",
        "default": "m88",
        "options": [
          [
            "m88",
            "88-piece metric (1.0005; 1.001–1.009; 1.01–1.49; 0.5–9.5; 10–100 mm)"
          ],
          [
            "i81",
            "81-piece inch (0.1001–0.1009; 0.101–0.149; 0.050–0.950; 1–4 in)"
          ]
        ]
      },
      {
        "key": "target",
        "label": "Length to build",
        "type": "number",
        "default": 41.3275,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "abbe-error",
    "name": "Abbe Offset Error",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "How much error does an offset between the scale and the measured feature cause?",
    "description": "Measurement error caused by an offset between the measuring axis and the scale axis when the slide tilts (Abbe error), compared with the tolerance being checked.",
    "keywords": [
      "MAKEOS",
      "abbe",
      "measurement error",
      "caliper",
      "offset",
      "tilt",
      "metrology"
    ],
    "fields": [
      {
        "key": "offset",
        "label": "Offset between scale and measured line",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tilt",
        "label": "Angular error of the slide",
        "type": "number",
        "default": 20,
        "unit": "arc-seconds",
        "min": 0,
        "max": 36000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolerance",
        "label": "Tolerance band being checked (total)",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rss-tolerance-stack",
    "name": "Statistical (RSS) Tolerance Stack",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Will this gap stay within its limits, worst case and statistically?",
    "description": "Worst-case and root-sum-square (RSS) results for a linear stack of up to five dimensions, checked against the required gap limits.",
    "keywords": [
      "MAKEOS",
      "tolerance stack",
      "RSS",
      "statistical tolerancing",
      "worst case",
      "gap analysis"
    ],
    "fields": [
      {
        "key": "h_dimension_1",
        "label": "Dimension 1",
        "type": "heading"
      },
      {
        "key": "dir1",
        "label": "Direction",
        "type": "select",
        "default": "add",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom1",
        "label": "Nominal",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol1",
        "label": "Tolerance ±",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_dimension_2",
        "label": "Dimension 2",
        "type": "heading"
      },
      {
        "key": "dir2",
        "label": "Direction",
        "type": "select",
        "default": "sub",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom2",
        "label": "Nominal",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol2",
        "label": "Tolerance ±",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_dimension_3",
        "label": "Dimension 3",
        "type": "heading"
      },
      {
        "key": "dir3",
        "label": "Direction",
        "type": "select",
        "default": "sub",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom3",
        "label": "Nominal",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol3",
        "label": "Tolerance ±",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_dimension_4",
        "label": "Dimension 4",
        "type": "heading"
      },
      {
        "key": "dir4",
        "label": "Direction",
        "type": "select",
        "default": "sub",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom4",
        "label": "Nominal",
        "type": "number",
        "default": 29.5,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol4",
        "label": "Tolerance ±",
        "type": "number",
        "default": 0.08,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_dimension_5",
        "label": "Dimension 5",
        "type": "heading"
      },
      {
        "key": "dir5",
        "label": "Direction",
        "type": "select",
        "default": "off",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom5",
        "label": "Nominal",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol5",
        "label": "Tolerance ±",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_requirement_and_statistics",
        "label": "Requirement and statistics",
        "type": "heading"
      },
      {
        "key": "reqMin",
        "label": "Minimum allowed gap",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "reqMax",
        "label": "Maximum allowed gap",
        "type": "number",
        "default": 0.9,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "inflate",
        "label": "RSS inflation factor",
        "type": "number",
        "default": 1,
        "unit": "×",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "it-tolerance-grade",
    "name": "ISO Tolerance Grade (IT) Value",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "How large is the ISO IT tolerance grade for this nominal size?",
    "description": "Standard tolerance for ISO 286 grades IT5 to IT16 calculated from the standard tolerance unit for the size step that contains the nominal size.",
    "keywords": [
      "MAKEOS",
      "ISO 286",
      "IT grade",
      "standard tolerance",
      "fits",
      "tolerance unit"
    ],
    "fields": [
      {
        "key": "size",
        "label": "Nominal size",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 3150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "grade",
        "label": "Tolerance grade",
        "type": "select",
        "default": "7",
        "options": [
          [
            "5",
            "IT5"
          ],
          [
            "6",
            "IT6"
          ],
          [
            "7",
            "IT7"
          ],
          [
            "8",
            "IT8"
          ],
          [
            "9",
            "IT9"
          ],
          [
            "10",
            "IT10"
          ],
          [
            "11",
            "IT11"
          ],
          [
            "12",
            "IT12"
          ],
          [
            "13",
            "IT13"
          ],
          [
            "14",
            "IT14"
          ],
          [
            "15",
            "IT15"
          ],
          [
            "16",
            "IT16"
          ]
        ]
      }
    ]
  },
  {
    "id": "length-converter",
    "name": "Length Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this length in other units?",
    "description": "Convert a length between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "length",
      "m",
      "mm",
      "µm",
      "cm",
      "km",
      "in",
      "thou (mil)",
      "ft",
      "yd",
      "mile"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Length value",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "in",
        "options": [
          [
            "m",
            "m"
          ],
          [
            "mm",
            "mm"
          ],
          [
            "um",
            "µm"
          ],
          [
            "cm",
            "cm"
          ],
          [
            "km",
            "km"
          ],
          [
            "in",
            "in"
          ],
          [
            "thou",
            "thou (mil)"
          ],
          [
            "ft",
            "ft"
          ],
          [
            "yd",
            "yd"
          ],
          [
            "mi",
            "mile"
          ]
        ]
      }
    ]
  },
  {
    "id": "force-converter",
    "name": "Force Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this force in other units?",
    "description": "Convert a force between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "force",
      "N",
      "kN",
      "MN",
      "kgf",
      "tonne-force",
      "lbf",
      "kip (1000 lbf)",
      "ozf",
      "dyne"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Force value",
        "type": "number",
        "default": 1000,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "lbf",
        "options": [
          [
            "N",
            "N"
          ],
          [
            "kN",
            "kN"
          ],
          [
            "MN",
            "MN"
          ],
          [
            "kgf",
            "kgf"
          ],
          [
            "tf",
            "tonne-force"
          ],
          [
            "lbf",
            "lbf"
          ],
          [
            "kip",
            "kip (1000 lbf)"
          ],
          [
            "ozf",
            "ozf"
          ],
          [
            "dyn",
            "dyne"
          ]
        ]
      }
    ]
  },
  {
    "id": "pressure-converter",
    "name": "Pressure and Stress Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this pressure or stress in other units?",
    "description": "Convert a pressure or stress between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "pressure or stress",
      "Pa",
      "kPa",
      "MPa (N/mm²)",
      "GPa",
      "bar",
      "mbar",
      "psi",
      "ksi",
      "standard atmosphere",
      "kgf/cm²",
      "mmHg",
      "inHg (32 °F)",
      "inH₂O (4 °C)"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Pressure or stress value",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "psi",
        "options": [
          [
            "Pa",
            "Pa"
          ],
          [
            "kPa",
            "kPa"
          ],
          [
            "MPa",
            "MPa (N/mm²)"
          ],
          [
            "GPa",
            "GPa"
          ],
          [
            "bar",
            "bar"
          ],
          [
            "mbar",
            "mbar"
          ],
          [
            "psi",
            "psi"
          ],
          [
            "ksi",
            "ksi"
          ],
          [
            "atm",
            "standard atmosphere"
          ],
          [
            "kgfcm2",
            "kgf/cm²"
          ],
          [
            "mmHg",
            "mmHg"
          ],
          [
            "inHg",
            "inHg (32 °F)"
          ],
          [
            "inH2O",
            "inH₂O (4 °C)"
          ]
        ]
      }
    ]
  },
  {
    "id": "torque-converter",
    "name": "Torque Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this torque in other units?",
    "description": "Convert a torque between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "torque",
      "N·m",
      "N·mm",
      "kN·m",
      "kgf·m",
      "kgf·cm",
      "lbf·ft",
      "lbf·in",
      "ozf·in"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Torque value",
        "type": "number",
        "default": 50,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "lbfft",
        "options": [
          [
            "Nm",
            "N·m"
          ],
          [
            "Nmm",
            "N·mm"
          ],
          [
            "kNm",
            "kN·m"
          ],
          [
            "kgfm",
            "kgf·m"
          ],
          [
            "kgfcm",
            "kgf·cm"
          ],
          [
            "lbfft",
            "lbf·ft"
          ],
          [
            "lbfin",
            "lbf·in"
          ],
          [
            "ozfin",
            "ozf·in"
          ]
        ]
      }
    ]
  },
  {
    "id": "power-converter",
    "name": "Power Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this power in other units?",
    "description": "Convert a power between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "power",
      "W",
      "kW",
      "MW",
      "hp (mechanical)",
      "metric horsepower (PS)",
      "ft·lbf/s",
      "BTU/h (IT)",
      "kcal/h (IT)",
      "ton of refrigeration"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Power value",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "hp",
        "options": [
          [
            "W",
            "W"
          ],
          [
            "kW",
            "kW"
          ],
          [
            "MW",
            "MW"
          ],
          [
            "hp",
            "hp (mechanical)"
          ],
          [
            "PS",
            "metric horsepower (PS)"
          ],
          [
            "ftlbfs",
            "ft·lbf/s"
          ],
          [
            "BTUh",
            "BTU/h (IT)"
          ],
          [
            "kcalh",
            "kcal/h (IT)"
          ],
          [
            "TR",
            "ton of refrigeration"
          ]
        ]
      }
    ]
  },
  {
    "id": "energy-converter",
    "name": "Energy and Work Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this energy in other units?",
    "description": "Convert a energy between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "energy",
      "J",
      "kJ",
      "MJ",
      "Wh",
      "kWh",
      "cal (IT)",
      "kcal (IT)",
      "BTU (IT)",
      "ft·lbf",
      "therm (EC)"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Energy value",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "kWh",
        "options": [
          [
            "J",
            "J"
          ],
          [
            "kJ",
            "kJ"
          ],
          [
            "MJ",
            "MJ"
          ],
          [
            "Wh",
            "Wh"
          ],
          [
            "kWh",
            "kWh"
          ],
          [
            "cal",
            "cal (IT)"
          ],
          [
            "kcal",
            "kcal (IT)"
          ],
          [
            "BTU",
            "BTU (IT)"
          ],
          [
            "ftlbf",
            "ft·lbf"
          ],
          [
            "therm",
            "therm (EC)"
          ]
        ]
      }
    ]
  },
  {
    "id": "flow-converter",
    "name": "Volumetric Flow Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this volumetric flow rate in other units?",
    "description": "Convert a volumetric flow rate between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "volumetric flow rate",
      "m³/s",
      "m³/h",
      "m³/min",
      "L/s",
      "L/min",
      "US gal/min",
      "UK gal/min",
      "ft³/min (cfm)",
      "ft³/s"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Volumetric flow rate value",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "Lmin",
        "options": [
          [
            "m3s",
            "m³/s"
          ],
          [
            "m3h",
            "m³/h"
          ],
          [
            "m3min",
            "m³/min"
          ],
          [
            "Ls",
            "L/s"
          ],
          [
            "Lmin",
            "L/min"
          ],
          [
            "usgpm",
            "US gal/min"
          ],
          [
            "ukgpm",
            "UK gal/min"
          ],
          [
            "cfm",
            "ft³/min (cfm)"
          ],
          [
            "cfs",
            "ft³/s"
          ]
        ]
      }
    ]
  },
  {
    "id": "mass-converter",
    "name": "Mass Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this mass in other units?",
    "description": "Convert a mass between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "mass",
      "kg",
      "g",
      "tonne",
      "lb",
      "oz (avoirdupois)",
      "short ton (2000 lb)",
      "long ton (2240 lb)",
      "slug"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Mass value",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "lb",
        "options": [
          [
            "kg",
            "kg"
          ],
          [
            "g",
            "g"
          ],
          [
            "t",
            "tonne"
          ],
          [
            "lb",
            "lb"
          ],
          [
            "oz",
            "oz (avoirdupois)"
          ],
          [
            "shortton",
            "short ton (2000 lb)"
          ],
          [
            "longton",
            "long ton (2240 lb)"
          ],
          [
            "slug",
            "slug"
          ]
        ]
      }
    ]
  },
  {
    "id": "velocity-converter",
    "name": "Speed and Feed Rate Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this speed in other units?",
    "description": "Convert a speed between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "speed",
      "m/s",
      "m/min",
      "mm/min",
      "km/h",
      "ft/s",
      "ft/min (sfm)",
      "in/min (ipm)",
      "mile/h",
      "knot"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Speed value",
        "type": "number",
        "default": 400,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "ftmin",
        "options": [
          [
            "ms",
            "m/s"
          ],
          [
            "mmin",
            "m/min"
          ],
          [
            "mmmin",
            "mm/min"
          ],
          [
            "kmh",
            "km/h"
          ],
          [
            "fts",
            "ft/s"
          ],
          [
            "ftmin",
            "ft/min (sfm)"
          ],
          [
            "inmin",
            "in/min (ipm)"
          ],
          [
            "mph",
            "mile/h"
          ],
          [
            "kn",
            "knot"
          ]
        ]
      }
    ]
  },
  {
    "id": "angle-converter",
    "name": "Angle Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this angle in other units?",
    "description": "Convert a angle between SI, metric and US customary units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "angle",
      "degree",
      "radian",
      "gradian",
      "arc-minute",
      "arc-second",
      "milliradian",
      "revolution"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Angle value",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "rad",
        "options": [
          [
            "deg",
            "degree"
          ],
          [
            "rad",
            "radian"
          ],
          [
            "grad",
            "gradian"
          ],
          [
            "arcmin",
            "arc-minute"
          ],
          [
            "arcsec",
            "arc-second"
          ],
          [
            "mrad",
            "milliradian"
          ],
          [
            "rev",
            "revolution"
          ]
        ]
      }
    ]
  },
  {
    "id": "temperature-converter",
    "name": "Temperature Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this temperature, or temperature difference, in other scales?",
    "description": "Convert a temperature or a temperature difference between Celsius, Fahrenheit, kelvin and Rankine.",
    "keywords": [
      "MAKEOS",
      "temperature",
      "Celsius",
      "Fahrenheit",
      "kelvin",
      "Rankine",
      "unit conversion"
    ],
    "fields": [
      {
        "key": "kind",
        "label": "Value type",
        "type": "select",
        "default": "abs",
        "options": [
          [
            "abs",
            "A temperature (a reading)"
          ],
          [
            "diff",
            "A temperature difference (a change)"
          ]
        ]
      },
      {
        "key": "value",
        "label": "Value",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "C",
        "options": [
          [
            "C",
            "°C"
          ],
          [
            "F",
            "°F"
          ],
          [
            "K",
            "K"
          ],
          [
            "R",
            "°R"
          ]
        ]
      }
    ]
  },
  {
    "id": "decimal-fraction",
    "name": "Decimal to Fraction",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is the nearest fraction to this decimal, and how far off is it?",
    "description": "Nearest fractional-inch size (to 1/8 … 1/128), the best fraction with a limited denominator (continued fractions) and the millimetre equivalent.",
    "keywords": [
      "MAKEOS",
      "fraction",
      "decimal",
      "continued fraction",
      "drill size",
      "gear ratio approximation"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Decimal value",
        "type": "number",
        "default": 0.4375,
        "unit": "",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "denom",
        "label": "Fractional-inch resolution",
        "type": "select",
        "default": "64",
        "options": [
          [
            "8",
            "1/8"
          ],
          [
            "16",
            "1/16"
          ],
          [
            "32",
            "1/32"
          ],
          [
            "64",
            "1/64"
          ],
          [
            "128",
            "1/128"
          ]
        ]
      },
      {
        "key": "maxDen",
        "label": "Largest denominator for best fraction",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  }
]);
