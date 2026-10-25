// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook10) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "rect-bar-torsion",
    "name": "Rectangular Bar in Torsion",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What shear stress and twist does torque cause in this rectangular or square bar?",
    "description": "Maximum shear stress, angle of twist and torsional constant of a solid rectangular bar under torque, using Roark’s approximations.",
    "keywords": [
      "MAKEOS",
      "torsion",
      "rectangular bar",
      "square shaft",
      "twist",
      "non-circular",
      "torsional constant"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Torque",
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
        "key": "b",
        "label": "Long side",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Short side",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 79.3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "curved-beam",
    "name": "Curved Beam and Hook Stress",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What are the inner and outer fibre stresses in this curved beam or hook section?",
    "description": "Stresses at the inner and outer fibres of a curved rectangular section (crane hook, C-frame, ring) by the Winkler–Bach theory, with the straight-beam comparison.",
    "keywords": [
      "MAKEOS",
      "curved beam",
      "crane hook",
      "C-frame",
      "Winkler",
      "neutral axis shift",
      "press frame"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Load (line of action through the centre of curvature)",
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
        "key": "ri",
        "label": "Inner radius",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Section depth (radial)",
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
        "key": "b",
        "label": "Section width",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable stress",
        "type": "number",
        "default": 200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "tube-collapse",
    "name": "Tube Collapse under External Pressure",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "At what external pressure will this long tube collapse, and is the margin enough?",
    "description": "Elastic buckling (collapse) pressure and yield-limited pressure of a long thin round tube under external pressure, with the safety factor against an applied pressure.",
    "keywords": [
      "MAKEOS",
      "external pressure",
      "tube collapse",
      "vacuum",
      "buckling",
      "jacketed vessel",
      "heat exchanger tube"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Outside diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Wall thickness",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Poisson’s ratio",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "External pressure (net)",
        "type": "number",
        "default": 0.5,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required safety factor",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "eccentric-column",
    "name": "Eccentrically Loaded Column (Secant Formula)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What is the peak stress in this column with an offset load, and what load factor brings it to yield?",
    "description": "Maximum stress in a column with an eccentric axial load by the secant formula, the Euler load, and the load factor at which the peak stress reaches yield.",
    "keywords": [
      "MAKEOS",
      "eccentric load",
      "secant formula",
      "column",
      "offset load",
      "beam-column",
      "buckling"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Axial load",
        "type": "number",
        "default": 40000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e",
        "label": "Eccentricity of load",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Area",
        "type": "number",
        "default": 1000,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Second moment of area (bending plane)",
        "type": "number",
        "default": 400000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 100000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Distance to extreme fibre",
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
        "key": "L",
        "label": "Length",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Effective length factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required load factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "beam-impact",
    "name": "Impact Load on a Beam",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What stress and deflection does a dropped weight cause in this beam?",
    "description": "Static deflection, impact factor, dynamic deflection and dynamic bending stress when a weight falls onto a simply supported beam at mid-span or onto a cantilever tip.",
    "keywords": [
      "MAKEOS",
      "impact",
      "shock load",
      "dropped weight",
      "dynamic factor",
      "beam stress",
      "energy method"
    ],
    "fields": [
      {
        "key": "support",
        "label": "Support",
        "type": "select",
        "default": "ss",
        "options": [
          [
            "ss",
            "Simply supported, load at mid-span"
          ],
          [
            "cant",
            "Cantilever, load at the tip"
          ]
        ]
      },
      {
        "key": "mass",
        "label": "Falling mass",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Drop height above the beam",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Span (or cantilever length)",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Second moment of area",
        "type": "number",
        "default": 8000000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 100000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Distance to extreme fibre",
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
        "key": "allow",
        "label": "Allowable stress",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "section-shapes",
    "name": "Section Properties: I, T, Channel and Angle",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What are the area, centroid, second moments and section moduli of this I, T, channel or angle section?",
    "description": "Area, mass per metre, centroid, second moments of area, principal axes, section moduli and radii of gyration of built-up or rolled I, T, channel and angle sections made from rectangles.",
    "keywords": [
      "MAKEOS",
      "section properties",
      "I-beam",
      "channel",
      "angle",
      "tee",
      "moment of inertia",
      "section modulus"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Shape",
        "type": "select",
        "default": "I",
        "options": [
          [
            "I",
            "I or H section (symmetrical)"
          ],
          [
            "T",
            "T section"
          ],
          [
            "C",
            "Channel"
          ],
          [
            "L",
            "Angle"
          ]
        ]
      },
      {
        "key": "H",
        "label": "Overall depth (vertical leg)",
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
        "key": "B",
        "label": "Overall width (flange or horizontal leg)",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tf",
        "label": "Flange thickness",
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
        "key": "tw",
        "label": "Web thickness",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 50000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "thin-tube-torsion",
    "name": "Thin-Walled Closed Tube in Torsion",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What shear stress and twist does torque cause in this thin-walled round or rectangular tube?",
    "description": "Shear stress (Bredt’s formula), torsional constant and twist of a closed thin-walled round or rectangular tube under torque.",
    "keywords": [
      "MAKEOS",
      "torsion",
      "thin-walled tube",
      "Bredt",
      "box section",
      "RHS",
      "shear flow"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Section",
        "type": "select",
        "default": "rect",
        "options": [
          [
            "round",
            "Round tube"
          ],
          [
            "rect",
            "Rectangular tube (RHS)"
          ]
        ]
      },
      {
        "key": "b",
        "label": "Outside diameter or width",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Outside height (rectangular only)",
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
        "key": "t",
        "label": "Wall thickness",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 1500,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length",
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
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 79.3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rotating-disc",
    "name": "Rotating Disc Stress and Burst Margin",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What stress does spinning cause in this solid or bored disc, and how fast can it run before yield?",
    "description": "Maximum centrifugal stress in a rotating solid disc or a disc with a central bore, its rim speed, safety factor against yield and the speed at which yield is reached.",
    "keywords": [
      "MAKEOS",
      "rotating disc",
      "centrifugal stress",
      "flywheel",
      "burst speed",
      "rim speed",
      "impeller"
    ],
    "fields": [
      {
        "key": "Do",
        "label": "Outside diameter",
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
        "key": "Di",
        "label": "Bore diameter (0 = solid)",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Speed",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 50000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Poisson’s ratio",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required safety factor",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "axial-bending-stress",
    "name": "Combined Axial and Biaxial Bending Stress",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What are the corner stresses in this rectangular section under axial load and bending about both axes?",
    "description": "Stresses at the four corners of a rectangular section under an axial force and bending moments about both axes, with the peak tension and compression against an allowable stress.",
    "keywords": [
      "MAKEOS",
      "combined stress",
      "axial and bending",
      "biaxial bending",
      "column base",
      "bracket",
      "kern"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Axial force (+ tension, − compression)",
        "type": "number",
        "default": -50,
        "unit": "kN",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mx",
        "label": "Moment about X (bends in depth direction)",
        "type": "number",
        "default": 5,
        "unit": "kN·m",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "My",
        "label": "Moment about Y (bends in width direction)",
        "type": "number",
        "default": 2,
        "unit": "kN·m",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Section width (along X)",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Section depth (along Y)",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable stress",
        "type": "number",
        "default": 165,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "leaf-spring",
    "name": "Flat and Leaf Spring",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "How much does this flat or leaf spring deflect, and how highly is it stressed?",
    "description": "Deflection, rate and bending stress of a single flat cantilever spring, a graduated multi-leaf cantilever, or a semi-elliptic leaf spring loaded at the centre.",
    "keywords": [
      "MAKEOS",
      "leaf spring",
      "flat spring",
      "semi-elliptic",
      "cantilever spring",
      "spring steel strip"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Spring type",
        "type": "select",
        "default": "single",
        "options": [
          [
            "single",
            "Single flat cantilever (rectangular)"
          ],
          [
            "multi",
            "Multi-leaf cantilever (graduated leaves)"
          ],
          [
            "semi",
            "Semi-elliptic, load at centre"
          ]
        ]
      },
      {
        "key": "F",
        "label": "Load (total load for semi-elliptic)",
        "type": "number",
        "default": 15,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length (span for semi-elliptic)",
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
        "key": "b",
        "label": "Width",
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
        "key": "t",
        "label": "Thickness (each leaf)",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of leaves",
        "type": "number",
        "default": 1,
        "unit": "leaves",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 207,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 900,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "torsion-bar",
    "name": "Torsion Bar Spring",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "What rate, twist and shear stress does this torsion bar spring have?",
    "description": "Torsional rate, angle of twist, arm-tip deflection and shear stress of a solid round torsion bar loaded through a lever arm.",
    "keywords": [
      "MAKEOS",
      "torsion bar",
      "torsion spring",
      "anti-roll bar",
      "suspension",
      "torsional rate"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Bar diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Active length",
        "type": "number",
        "default": 800,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 79.3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Force at arm",
        "type": "number",
        "default": 1000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "arm",
        "label": "Arm length",
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
        "key": "allow",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 600,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "grain-size",
    "name": "ASTM Grain Size Number",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What ASTM grain size number does this count or intercept measurement give?",
    "description": "ASTM E112 grain size number G from grains per square inch at 100×, grains per mm² at 1×, or the mean lineal intercept length, with the equivalent values.",
    "keywords": [
      "MAKEOS",
      "grain size",
      "ASTM E112",
      "metallography",
      "intercept",
      "microstructure"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Measurement",
        "type": "select",
        "default": "n100",
        "options": [
          [
            "n100",
            "Grains per square inch at 100×"
          ],
          [
            "na",
            "Grains per mm² at 1×"
          ],
          [
            "lbar",
            "Mean lineal intercept length (µm)"
          ]
        ]
      },
      {
        "key": "value",
        "label": "Measured value",
        "type": "number",
        "default": 64,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "corrosion-rate",
    "name": "Corrosion Rate from Mass Loss",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How fast is this metal corroding, and how long will the corrosion allowance last?",
    "description": "Uniform corrosion rate from a coupon’s mass loss, area, exposure time and density (ASTM G1 method), in mm/year and mils/year, with the remaining life of a corrosion allowance.",
    "keywords": [
      "MAKEOS",
      "corrosion rate",
      "mass loss",
      "coupon",
      "ASTM G1",
      "mpy",
      "corrosion allowance"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Mass loss",
        "type": "number",
        "default": 120,
        "unit": "mg",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Exposed area",
        "type": "number",
        "default": 20,
        "unit": "cm²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Exposure time",
        "type": "number",
        "default": 720,
        "unit": "h",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Metal density",
        "type": "number",
        "default": 7.86,
        "unit": "g/cm³",
        "min": 0.000001,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allowance",
        "label": "Remaining corrosion allowance",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
