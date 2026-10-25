// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook9) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "helix-length",
    "name": "Helix (Coil) Developed Length",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "How long is the wire, tube or strip wound into this helix?",
    "description": "Developed length, helix angle and lead of a helix such as a coil, spring, cooling coil or spiral guard, from its mean diameter, pitch and number of turns.",
    "keywords": [
      "MAKEOS",
      "helix length",
      "coil length",
      "spiral",
      "cooling coil",
      "spring wire length",
      "helix angle"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Pitch (axial advance per turn)",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "turns",
        "label": "Number of turns",
        "type": "number",
        "default": 10,
        "unit": "turns",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "Straight end allowance (total)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vessel-head-volume",
    "name": "Tank and Vessel Volume with Heads",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What is the total volume of this vessel including its ends?",
    "description": "Volume of a cylindrical vessel with flat, 2:1 ellipsoidal, hemispherical, torispherical or conical ends, with the head and shell volumes shown separately.",
    "keywords": [
      "MAKEOS",
      "vessel volume",
      "dished head",
      "ellipsoidal head",
      "hemispherical",
      "torispherical",
      "tank capacity"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Inside diameter",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Straight shell length (tangent to tangent)",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "head",
        "label": "Head type",
        "type": "select",
        "default": "ell",
        "options": [
          [
            "ell",
            "2:1 ellipsoidal"
          ],
          [
            "hemi",
            "Hemispherical"
          ],
          [
            "tori",
            "Torispherical (ASME F&D, approximate)"
          ],
          [
            "cone",
            "Conical"
          ],
          [
            "flat",
            "Flat"
          ]
        ]
      },
      {
        "key": "heads",
        "label": "Number of heads",
        "type": "number",
        "default": 2,
        "unit": "heads",
        "min": 0,
        "max": 2,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "coneAngle",
        "label": "Cone half-angle (conical heads)",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 1,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "linear-interpolation",
    "name": "Linear Interpolation",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What value lies between these two table entries?",
    "description": "Straight-line interpolation (or extrapolation) between two known points, in either direction, for reading engineering tables and charts.",
    "keywords": [
      "MAKEOS",
      "interpolation",
      "table lookup",
      "extrapolation",
      "linear",
      "between values"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Find",
        "type": "select",
        "default": "y",
        "options": [
          [
            "y",
            "y for a given x"
          ],
          [
            "x",
            "x for a given y"
          ]
        ]
      },
      {
        "key": "x1",
        "label": "First point x₁",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "First point y₁",
        "type": "number",
        "default": 4.18,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "Second point x₂",
        "type": "number",
        "default": 40,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Second point y₂",
        "type": "number",
        "default": 4.179,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Known x",
        "type": "number",
        "default": 25,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y",
        "label": "Known y",
        "type": "number",
        "default": 4.1795,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "circle-three-points",
    "name": "Circle Through Three Points",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What centre and radius pass through these three measured points?",
    "description": "Centre coordinates, radius and diameter of the circle through three points, for checking arcs, bores and bolt circles from coordinate measurements.",
    "keywords": [
      "MAKEOS",
      "three point circle",
      "arc centre",
      "radius from points",
      "CMM",
      "bore centre",
      "layout"
    ],
    "fields": [
      {
        "key": "x1",
        "label": "Point 1 X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Point 1 Y",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "Point 2 X",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Point 2 Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x3",
        "label": "Point 3 X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Point 3 Y",
        "type": "number",
        "default": -50,
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
    "id": "true-position",
    "name": "True Position with Bonus Tolerance",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Is this hole or pin within its positional tolerance, including any bonus from its size?",
    "description": "Diametral true-position deviation from measured X and Y deviations, with bonus tolerance at maximum or least material condition, and size limit checks.",
    "keywords": [
      "MAKEOS",
      "true position",
      "positional tolerance",
      "GD&T",
      "MMC",
      "bonus tolerance",
      "hole location"
    ],
    "fields": [
      {
        "key": "feature",
        "label": "Feature",
        "type": "select",
        "default": "hole",
        "options": [
          [
            "hole",
            "Hole (internal)"
          ],
          [
            "pin",
            "Pin or boss (external)"
          ]
        ]
      },
      {
        "key": "mod",
        "label": "Material condition modifier",
        "type": "select",
        "default": "mmc",
        "options": [
          [
            "mmc",
            "MMC (Ⓜ)"
          ],
          [
            "lmc",
            "LMC (Ⓛ)"
          ],
          [
            "rfs",
            "Regardless of feature size"
          ]
        ]
      },
      {
        "key": "dx",
        "label": "Measured X deviation from true position",
        "type": "number",
        "default": 0.06,
        "unit": "mm",
        "min": -10000,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dy",
        "label": "Measured Y deviation from true position",
        "type": "number",
        "default": 0.08,
        "unit": "mm",
        "min": -10000,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Position tolerance (diameter)",
        "type": "number",
        "default": 0.2,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "size",
        "label": "Measured feature size",
        "type": "number",
        "default": 10.12,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lower",
        "label": "Lower size limit",
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
        "key": "upper",
        "label": "Upper size limit",
        "type": "number",
        "default": 10.2,
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
    "id": "taper-balls",
    "name": "Internal Taper Angle from Two Balls",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What is the included angle and top diameter of this tapered bore, measured with two balls?",
    "description": "Included angle and diameter at the top face of an internal taper from the depths to the tops of two precision balls of different sizes.",
    "keywords": [
      "MAKEOS",
      "taper measurement",
      "two balls",
      "internal taper",
      "cone angle",
      "inspection",
      "tapered bore"
    ],
    "fields": [
      {
        "key": "d1",
        "label": "Small ball diameter",
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
        "key": "d2",
        "label": "Large ball diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h1",
        "label": "Depth from top face to top of small ball",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": -10000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h2",
        "label": "Depth from top face to top of large ball",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": -10000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "go-nogo-gauge",
    "name": "Go and No-Go Gauge Sizes",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What sizes should the go and no-go plug or ring gauges have for this toleranced feature?",
    "description": "Go and no-go gauge sizes for a hole (plug gauges) or shaft (ring or snap gauges) by Taylor’s principle, with gauge tolerance and wear allowance placed inside the work tolerance.",
    "keywords": [
      "MAKEOS",
      "go no-go",
      "plug gauge",
      "ring gauge",
      "snap gauge",
      "Taylor principle",
      "gauge tolerance"
    ],
    "fields": [
      {
        "key": "feature",
        "label": "Feature",
        "type": "select",
        "default": "hole",
        "options": [
          [
            "hole",
            "Hole (plug gauges)"
          ],
          [
            "shaft",
            "Shaft (ring or snap gauges)"
          ]
        ]
      },
      {
        "key": "lower",
        "label": "Lower limit of size",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "upper",
        "label": "Upper limit of size",
        "type": "number",
        "default": 25.021,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gpct",
        "label": "Gauge tolerance (% of work tolerance)",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wpct",
        "label": "Wear allowance on go gauge (% of work tolerance)",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "toggle-joint",
    "name": "Toggle Joint Force",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What output force does this toggle joint produce for the applied force?",
    "description": "Output (resisting) force and mechanical advantage of an equal-arm toggle joint from the applied force and the link angle, for clamps, presses and crushers.",
    "keywords": [
      "MAKEOS",
      "toggle",
      "toggle clamp",
      "mechanical advantage",
      "press",
      "link mechanism"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Force applied at the joint (perpendicular to the output line)",
        "type": "number",
        "default": 500,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Angle of each link from the output line",
        "type": "number",
        "default": 10,
        "unit": "°",
        "min": 0.1,
        "max": 89.9,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "wedge-force",
    "name": "Wedge Force with Friction",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What force drives this wedge under a load, and will it stay in place?",
    "description": "Force to drive and to withdraw a wedge that raises a guided load, with friction on both wedge faces, and the self-locking check.",
    "keywords": [
      "MAKEOS",
      "wedge",
      "taper key",
      "friction",
      "self-locking",
      "levelling wedge",
      "machine mount"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Load on the wedge",
        "type": "number",
        "default": 10000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Wedge angle",
        "type": "number",
        "default": 6,
        "unit": "°",
        "min": 0.1,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Coefficient of friction (both faces)",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "power-screw-torque",
    "name": "Power Screw Raise and Lower Torque",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What torque raises and lowers this load with a screw jack or lead screw, including collar friction?",
    "description": "Torque to raise and to lower a load with a square, Acme or trapezoidal power screw, including thrust-collar friction, with efficiency and self-locking.",
    "keywords": [
      "MAKEOS",
      "screw jack",
      "power screw",
      "raise torque",
      "collar friction",
      "Acme",
      "lifting screw"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Axial load",
        "type": "number",
        "default": 20000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dm",
        "label": "Mean (pitch) diameter of thread",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lead",
        "label": "Lead",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "flank",
        "label": "Thread form",
        "type": "select",
        "default": "15",
        "options": [
          [
            "0",
            "Square"
          ],
          [
            "14.5",
            "Acme (29°)"
          ],
          [
            "15",
            "Trapezoidal (30°)"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Thread friction coefficient",
        "type": "number",
        "default": 0.12,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dc",
        "label": "Mean collar diameter (0 = thrust bearing ignored)",
        "type": "number",
        "default": 45,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "muc",
        "label": "Collar friction coefficient",
        "type": "number",
        "default": 0.12,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "band-brake",
    "name": "Band Brake Torque and Lever Force",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What band tensions and lever force does this simple band brake need for the braking torque?",
    "description": "Tight and slack band tensions, lever force and maximum lining pressure of a simple band brake from the braking torque, drum size, wrap angle and friction.",
    "keywords": [
      "MAKEOS",
      "band brake",
      "brake torque",
      "lever force",
      "drum brake",
      "winch brake"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Braking torque required",
        "type": "number",
        "default": 400,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Drum diameter",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wrap",
        "label": "Wrap angle",
        "type": "number",
        "default": 270,
        "unit": "°",
        "min": 10,
        "max": 720,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Coefficient of friction",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Lever length (pivot to applied force)",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Pivot to slack-end attachment",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Band width",
        "type": "number",
        "default": 60,
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
    "id": "shoe-brake",
    "name": "Single Shoe (Block) Brake",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What lever force does this block brake need, and is it self-energising or self-locking?",
    "description": "Normal force, lever force and shoe pressure of a short single-shoe brake on a drum, for either direction of rotation, with the self-locking check.",
    "keywords": [
      "MAKEOS",
      "block brake",
      "shoe brake",
      "self-energising",
      "drum brake",
      "lever"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Braking torque required",
        "type": "number",
        "default": 200,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Drum diameter",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Coefficient of friction",
        "type": "number",
        "default": 0.35,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Pivot to applied force",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Pivot to shoe normal force line",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Offset of friction force line from pivot",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dir",
        "label": "Rotation relative to the pivot",
        "type": "select",
        "default": "energ",
        "options": [
          [
            "energ",
            "Friction moment helps apply the shoe (self-energising)"
          ],
          [
            "de",
            "Friction moment opposes the shoe (de-energising)"
          ]
        ]
      },
      {
        "key": "area",
        "label": "Shoe contact area",
        "type": "number",
        "default": 6000,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cone-clutch",
    "name": "Cone Clutch Torque and Engaging Force",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How much torque can this cone clutch carry, and what force engages it?",
    "description": "Torque capacity of a cone clutch by the uniform-wear assumption, the axial force to hold it engaged, and the higher force needed during engagement.",
    "keywords": [
      "MAKEOS",
      "cone clutch",
      "clutch torque",
      "cone angle",
      "engaging force",
      "friction clutch"
    ],
    "fields": [
      {
        "key": "Do",
        "label": "Large diameter of cone face",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Di",
        "label": "Small diameter of cone face",
        "type": "number",
        "default": 160,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Cone half-angle",
        "type": "number",
        "default": 12,
        "unit": "°",
        "min": 1,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Coefficient of friction",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Axial holding force",
        "type": "number",
        "default": 1500,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Treq",
        "label": "Required torque (with service factor)",
        "type": "number",
        "default": 150,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "wire-rope-reeving",
    "name": "Wire Rope Reeving: Line Pull and Safety Factor",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What pull is on the hoist rope with this reeving, and is the rope’s safety factor enough?",
    "description": "Line pull at the drum for a load reeved over several parts of line with sheave friction, the rope safety factor against its minimum breaking load, and the sheave-to-rope diameter ratio.",
    "keywords": [
      "MAKEOS",
      "wire rope",
      "reeving",
      "parts of line",
      "line pull",
      "sheave efficiency",
      "D/d ratio"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Load mass (including hook block)",
        "type": "number",
        "default": 5000,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Parts of line supporting the load",
        "type": "number",
        "default": 4,
        "unit": "parts",
        "min": 1,
        "max": 40,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "eta",
        "label": "Efficiency per sheave",
        "type": "number",
        "default": 98,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mbl",
        "label": "Rope minimum breaking load",
        "type": "number",
        "default": 120,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required rope safety factor",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Sheave pitch diameter",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Rope diameter",
        "type": "number",
        "default": 14,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratioReq",
        "label": "Required minimum D/d",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
