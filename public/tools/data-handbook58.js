// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook58) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "eccentric-bracket-bolt-check",
    "name": "Eccentric Bracket Bolt Check (Bolt Group Forces, Shear and Bearing Stress)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "For a bracket bolted with a group of bolts and loaded off-centre, which bolt carries most, and are its shear stress and the plate bearing stress within limits?",
    "description": "Check of a bolted bracket with an eccentric load in the plane of the bolts: the centroid of the bolt group, the moment of the load about it, the direct and torsional force on each bolt and the most heavily loaded bolt (as the eccentric bolt group tool), then the shear stress in that bolt and the bearing stress it puts on the plate (as the bolt shear and bearing tool), against your allowable stresses.",
    "keywords": [
      "MAKEOS",
      "eccentric load",
      "bolt group",
      "bracket",
      "bolt shear",
      "bearing stress",
      "moment connection"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of bolts",
        "type": "number",
        "default": 4,
        "unit": "bolts",
        "min": 2,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_bolt_1",
        "label": "Bolt 1",
        "type": "heading"
      },
      {
        "key": "x1",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_2",
        "label": "Bolt 2",
        "type": "heading"
      },
      {
        "key": "x2",
        "label": "X",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_3",
        "label": "Bolt 3",
        "type": "heading"
      },
      {
        "key": "x3",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Y",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_4",
        "label": "Bolt 4",
        "type": "heading"
      },
      {
        "key": "x4",
        "label": "X",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y4",
        "label": "Y",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_5",
        "label": "Bolt 5",
        "type": "heading"
      },
      {
        "key": "x5",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y5",
        "label": "Y",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_6",
        "label": "Bolt 6",
        "type": "heading"
      },
      {
        "key": "x6",
        "label": "X",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y6",
        "label": "Y",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load",
        "label": "Load",
        "type": "heading"
      },
      {
        "key": "Px",
        "label": "Load X component",
        "type": "number",
        "default": 0,
        "unit": "kN",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Py",
        "label": "Load Y component",
        "type": "number",
        "default": -20,
        "unit": "kN",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lx",
        "label": "Load X position",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ly",
        "label": "Load Y position",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolts_and_plate",
        "label": "Bolts and plate",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Bolt diameter at the shear plane",
        "type": "number",
        "default": 16,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "planes",
        "label": "Shear planes per bolt",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Single shear"
          ],
          [
            "2",
            "Double shear"
          ]
        ]
      },
      {
        "key": "t",
        "label": "Thinnest plate thickness in bearing",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tauAllow",
        "label": "Allowable bolt shear stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bAllow",
        "label": "Allowable bearing stress",
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
    "id": "pulley-shaft-bush-check",
    "name": "Overhung Pulley Shaft Bush Check (Belt Pull, Bush Loads, P, V and PV)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For a belt pulley overhung on a shaft running in two plain bushes, what load does each bush carry, and are their pressure, sliding speed and PV within the bush material’s limits?",
    "description": "Check of the plain (sleeve) bearings carrying an overhung pulley: the belt pull from the power, speed and pulley diameter with a belt tension factor, the reactions at the near and far bushes from the overhang and bush spacing, and the projected-area pressure, sliding velocity and PV value of each bush (as the plain bearing PV tool), against the limits of the bush material.",
    "keywords": [
      "MAKEOS",
      "plain bearing",
      "bush",
      "PV value",
      "belt pull",
      "overhung pulley",
      "sleeve bearing"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Power through the pulley",
        "type": "number",
        "default": 3,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Shaft speed",
        "type": "number",
        "default": 700,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dp",
        "label": "Pulley pitch diameter",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kb",
        "label": "Belt pull factor (shaft load ÷ effective pull)",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Overhang (near bush centre to pulley centre)",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lb",
        "label": "Spacing between bush centres",
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
        "key": "h_bushes",
        "label": "Bushes",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Shaft diameter in the bushes",
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
        "key": "L",
        "label": "Bush length",
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
        "key": "Pmax",
        "label": "Largest pressure for the material",
        "type": "number",
        "default": 25,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vmax",
        "label": "Largest sliding speed for the material",
        "type": "number",
        "default": 2.5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PVmax",
        "label": "Largest PV for the material",
        "type": "number",
        "default": 1.6,
        "unit": "MPa·m/s",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "torque-tube-end-weld-check",
    "name": "Torque Tube and End Weld Check (Shear, Twist, Weld Throat Stress)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "Is this round or rectangular tube strong and stiff enough to carry the torque, and is the fillet weld that joins it to its end plate big enough?",
    "description": "Check of a closed thin-walled tube carrying torque and the fillet weld around its end: shear stress, torsional constant and angle of twist of the tube (as the thin-walled tube torsion tool), the shear flow at the end weld from the area it encloses, the weld throat stress and the leg size needed (as the fillet weld strength tool, with the shear flow around the full perimeter), against the allowable stresses and your twist limit.",
    "keywords": [
      "MAKEOS",
      "torque tube",
      "thin-walled tube",
      "torsion",
      "fillet weld",
      "end plate",
      "twist"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Section",
        "type": "select",
        "default": "rect",
        "options": [
          [
            "rect",
            "Rectangular tube (RHS)"
          ],
          [
            "round",
            "Round tube"
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
        "label": "Allowable tube shear stress",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "twMax",
        "label": "Largest twist",
        "type": "number",
        "default": 1.5,
        "unit": "°/m",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_end_weld",
        "label": "End weld",
        "type": "heading"
      },
      {
        "key": "leg",
        "label": "Fillet weld leg",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tauW",
        "label": "Allowable weld throat shear stress",
        "type": "number",
        "default": 145,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "arc-segmentation-feed-check",
    "name": "CNC Arc Segmentation and Feed Check (Chord Tolerance, Block Rate, Achievable Feed)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "If my CAM output breaks this arc into straight segments within my tolerance, how short are the segments, can the control process them fast enough at my feed, and what feed can it actually hold?",
    "description": "Check of a curved toolpath output as short linear moves: the segment length that keeps the chord error within your tolerance on the arc radius, the angle per segment and number of segments over the arc (as the CNC chord error tool), the block rate the control must process at the programmed feed, the largest feed the control’s block processing rate allows, and the time for the arc.",
    "keywords": [
      "MAKEOS",
      "chord error",
      "CNC segments",
      "block processing",
      "feed rate",
      "CAM tolerance",
      "contouring"
    ],
    "fields": [
      {
        "key": "R",
        "label": "Arc radius",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Chord tolerance",
        "type": "number",
        "default": 0.005,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Arc angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.001,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "feed",
        "label": "Programmed feed",
        "type": "number",
        "default": 3000,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Control block processing rate",
        "type": "number",
        "default": 100,
        "unit": "blocks/s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "involute-spline-design",
    "name": "Involute Spline Design Check (Proportions, Root and Tooth Stresses)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For this inch involute spline, what are its diameters and tooth proportions, and are the shear and compressive stresses within limits for my torque and engagement length?",
    "description": "Check of a side-fit or major-diameter-fit involute spline: pitch, major, minor, root and form diameters and the basic tooth thickness for the diametral pitch, tooth count and type (as the involute spline tool), the depth of engagement from the external major and internal minor diameters, then the shear stress under the roots, the shear at the pitch diameter and the tooth compressive stress with application, load-distribution, fatigue and wear factors (as the spline torque capacity tool), against the allowable shear and compressive stresses.",
    "keywords": [
      "MAKEOS",
      "involute spline",
      "spline torque",
      "spline shear",
      "diametral pitch",
      "shaft spline",
      "ANSI B92.1"
    ],
    "fields": [
      {
        "key": "Pd",
        "label": "Diametral pitch P (e.g. 16 for 16/32)",
        "type": "number",
        "default": 16,
        "unit": "1/in",
        "min": 0.000001,
        "max": 128,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 6,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "type",
        "label": "Spline type",
        "type": "select",
        "default": "30flat",
        "options": [
          [
            "30flat",
            "30° flat root, side fit"
          ],
          [
            "30major",
            "30° flat root, major diameter fit"
          ],
          [
            "30fillet",
            "30° fillet root, side fit"
          ],
          [
            "37fillet",
            "37.5° fillet root, side fit"
          ]
        ]
      },
      {
        "key": "h_load",
        "label": "Load",
        "type": "heading"
      },
      {
        "key": "T",
        "label": "Transmitted torque",
        "type": "number",
        "default": 300,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Le",
        "label": "Effective length",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dh",
        "label": "Bore of a hollow shaft (0 = solid)",
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
        "key": "kind",
        "label": "Spline",
        "type": "select",
        "default": "fixed",
        "options": [
          [
            "fixed",
            "Fixed"
          ],
          [
            "flexible",
            "Flexible"
          ]
        ]
      },
      {
        "key": "acc",
        "label": "Spacing accuracy",
        "type": "select",
        "default": "good",
        "options": [
          [
            "good",
            "Normal accuracy (half the teeth carry load)"
          ],
          [
            "poor",
            "Lower accuracy (a third of the teeth)"
          ]
        ]
      },
      {
        "key": "Ka",
        "label": "Application factor",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Km",
        "label": "Load distribution factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kf",
        "label": "Fatigue life factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kw",
        "label": "Wear life factor (flexible)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ss",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sc",
        "label": "Allowable compressive stress",
        "type": "number",
        "default": 20,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "balance-correction-check",
    "name": "Single-Plane Balance Correction Check (Unbalance, Correction Mass, Residual, Grade)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "From the known out-of-balance masses on this disc-shaped rotor, what correction mass do I add and where, and will the residual after rounding the mass and placing it be within the balance grade?",
    "description": "Single-plane balancing of a narrow rotor: the resultant unbalance and its angle from the known masses, the correction mass at your correction radius and its angle opposite, and the centrifugal force of the unbalance (as the plane balancing tool); the permissible residual unbalance for the rotor’s mass, speed and balance grade (as the balance grade tool); and the residual left when the correction mass is rounded to your weight steps and placed with an angle error.",
    "keywords": [
      "MAKEOS",
      "balancing",
      "unbalance",
      "correction mass",
      "balance grade",
      "residual unbalance",
      "rotor"
    ],
    "fields": [
      {
        "key": "h_known_unbalance_masses_mass_0_unused_",
        "label": "Known unbalance masses (mass 0 = unused)",
        "type": "heading"
      },
      {
        "key": "m1",
        "label": "Mass 1",
        "type": "number",
        "default": 50,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r1",
        "label": "Radius 1",
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
        "key": "a1",
        "label": "Angle 1",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m2",
        "label": "Mass 2",
        "type": "number",
        "default": 30,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r2",
        "label": "Radius 2",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Angle 2",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m3",
        "label": "Mass 3",
        "type": "number",
        "default": 20,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r3",
        "label": "Radius 3",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a3",
        "label": "Angle 3",
        "type": "number",
        "default": 200,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m4",
        "label": "Mass 4",
        "type": "number",
        "default": 0,
        "unit": "g",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r4",
        "label": "Radius 4",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a4",
        "label": "Angle 4",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_correction",
        "label": "Correction",
        "type": "heading"
      },
      {
        "key": "rc",
        "label": "Correction radius",
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
        "key": "step",
        "label": "Weight step available",
        "type": "number",
        "default": 1,
        "unit": "g",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angErr",
        "label": "Angle placement error",
        "type": "number",
        "default": 2,
        "unit": "°",
        "min": 0,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_rotor",
        "label": "Rotor",
        "type": "heading"
      },
      {
        "key": "mass",
        "label": "Rotor mass",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Maximum service speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "grade",
        "label": "Balance quality grade",
        "type": "select",
        "default": "6.3",
        "options": [
          [
            "0.4",
            "G 0.4"
          ],
          [
            "1",
            "G 1"
          ],
          [
            "2.5",
            "G 2.5"
          ],
          [
            "6.3",
            "G 6.3"
          ],
          [
            "16",
            "G 16"
          ],
          [
            "40",
            "G 40"
          ],
          [
            "100",
            "G 100"
          ]
        ]
      }
    ]
  },
  {
    "id": "bend-feasibility-check",
    "name": "Sheet and Plate Bend Feasibility (Radius Limits, Springback, Press Force)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "Can this material be bent to my inside radius without cracking or springing back flat, what angle must I bend to, and is the press brake big enough?",
    "description": "Feasibility check of a press-brake bend: the smallest inside radius the material takes without cracking from its tensile reduction of area, and the largest radius beyond which the bend stays elastic (as the bend radius limits tool), the radius and angle after springback and the angle to bend to (as the bending springback tool), and the air-bending force for the bend length and V-die against the press capacity (as the press brake force tool).",
    "keywords": [
      "MAKEOS",
      "bend radius",
      "minimum bend radius",
      "springback",
      "press brake",
      "bend feasibility",
      "cracking"
    ],
    "fields": [
      {
        "key": "t",
        "label": "Material thickness",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Planned inside bend radius",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.01,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Final bend angle",
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
        "key": "rA",
        "label": "Reduction of area in a tensile test",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 1,
        "max": 99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "YS",
        "label": "Yield strength",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "uts",
        "label": "Tensile strength",
        "type": "number",
        "default": 450,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
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
        "key": "h_press_brake",
        "label": "Press brake",
        "type": "heading"
      },
      {
        "key": "L",
        "label": "Bend length",
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
        "key": "V",
        "label": "V-die opening",
        "type": "number",
        "default": 24,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Die factor",
        "type": "number",
        "default": 1.33,
        "unit": "",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Press brake capacity",
        "type": "number",
        "default": 1000,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "whitworth-wire-inspection",
    "name": "Whitworth Thread Wire Inspection (Pitch Diameter, Wire Readings, Lead-Angle Correction)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For this Whitworth (BSW or BSF) thread, what should the reading over three wires be, how much does the helix angle change it, and does my measured thread pass?",
    "description": "Three-wire inspection of a 55° Whitworth external thread: thread depth and basic pitch and minor diameters (as the Whitworth thread tool), the best-size wire and the reading over wires at the basic pitch diameter (as the three-wire measurement tool for 55°), the reading corrected for the helix (lead) angle (as the three-wire lead angle tool), and the pitch diameter from your measured reading against the pitch diameter tolerance.",
    "keywords": [
      "MAKEOS",
      "Whitworth",
      "BSW",
      "BSF",
      "three-wire",
      "pitch diameter",
      "thread inspection"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Major diameter",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 12,
        "unit": "TPI",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Pitch diameter tolerance (below basic)",
        "type": "number",
        "default": 0.003,
        "unit": "in",
        "min": 0,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Wire diameter (0 = best size)",
        "type": "number",
        "default": 0,
        "unit": "in",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mmeas",
        "label": "Measured reading over wires",
        "type": "number",
        "default": 0.5138,
        "unit": "in",
        "min": 0.000001,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "casting-pattern-plan",
    "name": "Casting Pattern Plan (Machining Allowance, Shrinkage, Casting and Pour Weight)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "For a block-shaped casting, what pattern dimensions do I make with machining and shrinkage allowances, what will the casting weigh, and how much metal must I pour?",
    "description": "Pattern plan for a rectangular block casting: casting dimensions with machining allowance on the machined faces of each dimension and pattern dimensions enlarged for shrinkage (as the pattern shrinkage tool, applied to length, width and height), casting volume less cores and casting mass, the metal to pour for the casting yield (gates and risers), and a check against the ladle or furnace capacity.",
    "keywords": [
      "MAKEOS",
      "pattern",
      "shrinkage allowance",
      "machining allowance",
      "casting weight",
      "pour weight",
      "foundry"
    ],
    "fields": [
      {
        "key": "Lx",
        "label": "Finished length",
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
        "key": "fx",
        "label": "Machined faces across the length",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Ly",
        "label": "Finished width",
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
        "key": "fy",
        "label": "Machined faces across the width",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Lz",
        "label": "Finished height",
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
        "key": "fz",
        "label": "Machined faces across the height",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mach",
        "label": "Machining allowance per machined face",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shrink",
        "label": "Shrinkage allowance",
        "type": "number",
        "default": 10.4,
        "unit": "mm/m",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_weight",
        "label": "Weight",
        "type": "heading"
      },
      {
        "key": "rhoM",
        "label": "Casting metal density",
        "type": "number",
        "default": 7200,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cores",
        "label": "Volume of cored-out spaces",
        "type": "number",
        "default": 0,
        "unit": "L",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "yld",
        "label": "Casting yield (casting ÷ metal poured)",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ladle",
        "label": "Ladle or furnace capacity",
        "type": "number",
        "default": 500,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
