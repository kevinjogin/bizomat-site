// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook56) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "three-leg-sling-check",
    "name": "Three-Leg Sling Load Share (3D Leg Geometry, Tensions, Angles)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a three-leg sling to lift points that are not symmetric, how is the load shared between the legs, how long is each leg, and is any leg overloaded or too steep?",
    "description": "Check of a three-leg bridle with the hook directly above the load’s centre of gravity and the lift points at any positions: leg lengths and angles from vertical from the point coordinates (as the cylindrical and spherical coordinates tool), and the tension in each leg by solving the three equilibrium equations of the hook (as the simultaneous equations tool), checked for slack legs, the leg working load limit and the largest angle from vertical.",
    "keywords": [
      "MAKEOS",
      "three-leg sling",
      "bridle",
      "leg tension",
      "sling angle",
      "unequal legs",
      "rigging"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Load (with rigging below the hook)",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_lift_points_from_the_hook_z_negative_below_",
        "label": "Lift points from the hook (z negative below)",
        "type": "heading"
      },
      {
        "key": "x1",
        "label": "Point 1 x",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Point 1 y",
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
        "key": "z1",
        "label": "Point 1 z",
        "type": "number",
        "default": -1500,
        "unit": "mm",
        "min": -100000,
        "max": -1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "Point 2 x",
        "type": "number",
        "default": -600,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Point 2 y",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z2",
        "label": "Point 2 z",
        "type": "number",
        "default": -1500,
        "unit": "mm",
        "min": -100000,
        "max": -1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x3",
        "label": "Point 3 x",
        "type": "number",
        "default": -600,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Point 3 y",
        "type": "number",
        "default": -1000,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z3",
        "label": "Point 3 z",
        "type": "number",
        "default": -1500,
        "unit": "mm",
        "min": -100000,
        "max": -1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limits",
        "label": "Limits",
        "type": "heading"
      },
      {
        "key": "WLL",
        "label": "Working load limit of each leg",
        "type": "number",
        "default": 15,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angMax",
        "label": "Largest leg angle from vertical",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 5,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "instrument-calibration-check",
    "name": "Instrument Calibration Check (Errors, Accuracy Class, Interpolated Correction)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From my calibration readings against a reference, is this gauge within its accuracy class, and what is the corrected value of a reading taken in service?",
    "description": "Calibration check of a pressure gauge, thermometer or other instrument at five points across its range: the error at each point and as a percentage of span against the accuracy class, the worst point, and the corrected (true) value of an in-service reading by linear interpolation between the two calibration points that bracket it (as the linear interpolation tool).",
    "keywords": [
      "MAKEOS",
      "calibration",
      "gauge accuracy",
      "accuracy class",
      "interpolation",
      "correction",
      "instrument"
    ],
    "fields": [
      {
        "key": "lo",
        "label": "Range low end",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hi",
        "label": "Range high end",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cls",
        "label": "Accuracy class (% of span)",
        "type": "number",
        "default": 1,
        "unit": "%",
        "min": 0.001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_reference_values_and_readings",
        "label": "Reference values and readings",
        "type": "heading"
      },
      {
        "key": "r1",
        "label": "Reference 1",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m1",
        "label": "Reading 1",
        "type": "number",
        "default": 0.02,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r2",
        "label": "Reference 2",
        "type": "number",
        "default": 2.5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m2",
        "label": "Reading 2",
        "type": "number",
        "default": 2.53,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r3",
        "label": "Reference 3",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m3",
        "label": "Reading 3",
        "type": "number",
        "default": 5.04,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r4",
        "label": "Reference 4",
        "type": "number",
        "default": 7.5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m4",
        "label": "Reading 4",
        "type": "number",
        "default": 7.52,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r5",
        "label": "Reference 5",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m5",
        "label": "Reading 5",
        "type": "number",
        "default": 9.98,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_in_service",
        "label": "In service",
        "type": "heading"
      },
      {
        "key": "field",
        "label": "Reading taken in service",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "npt-port-check",
    "name": "NPT Tapped Port Check (Thread Length, Depth, Boss Wall)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "Is this tapped NPT pipe port deep enough for a full thread engagement, and is the boss wall around it thick enough?",
    "description": "Check of a tapped port for an NPT tapered pipe thread: pitch diameter at the small end, effective thread length and pitch diameter at that length (as the NPT pipe thread tool), the tapped depth needed for the effective length plus the tap chamfer threads, and the wall left between the thread major diameter and the boss outside diameter, against the depth and wall you have.",
    "keywords": [
      "MAKEOS",
      "NPT",
      "pipe thread",
      "tapped port",
      "thread engagement",
      "boss wall",
      "hydraulic port"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Pipe outside diameter",
        "type": "number",
        "default": 0.84,
        "unit": "in",
        "min": 0.000001,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 14,
        "unit": "TPI",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "chamfer",
        "label": "Tap chamfer threads to allow",
        "type": "number",
        "default": 2,
        "unit": "threads",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Tapped depth available",
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
        "key": "boss",
        "label": "Boss outside diameter",
        "type": "number",
        "default": 32,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wallMin",
        "label": "Least wall around the thread",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "fit-at-temperature-check",
    "name": "Interference Fit at Operating Temperature (Different Materials)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "If the hub and shaft are different materials, how much interference is left at the operating temperature, does the fit still hold the torque hot, and is the hub overstressed at its tightest?",
    "description": "Check of an interference fit between a hub and shaft of different materials (aluminium on steel, bronze on steel): the interference at the operating temperature from the difference in expansion, contact pressure, holding torque and hub stress at assembly and at operating temperature (as the press and shrink fit tool), the torque against the required torque times the slip factor at the weaker condition, and the hub safety factor at the tighter one.",
    "keywords": [
      "MAKEOS",
      "interference fit",
      "thermal expansion",
      "aluminium hub",
      "operating temperature",
      "holding torque",
      "shrink fit"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Interface diameter",
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
        "key": "D",
        "label": "Hub outside diameter",
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
        "key": "di",
        "label": "Shaft bore (0 = solid)",
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
        "key": "delta0",
        "label": "Diametral interference at assembly temperature",
        "type": "number",
        "default": 0.08,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Engagement length",
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
        "key": "mu",
        "label": "Coefficient of friction at interface",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_materials",
        "label": "Materials",
        "type": "heading"
      },
      {
        "key": "Eh",
        "label": "Hub elastic modulus",
        "type": "number",
        "default": 70,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nuh",
        "label": "Hub Poisson’s ratio",
        "type": "number",
        "default": 0.33,
        "unit": "",
        "min": 0,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ah",
        "label": "Hub expansion coefficient",
        "type": "number",
        "default": 23,
        "unit": "µm/(m·K)",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Hub yield strength",
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
        "key": "Es",
        "label": "Shaft elastic modulus",
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
        "key": "nus",
        "label": "Shaft Poisson’s ratio",
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
        "key": "as",
        "label": "Shaft expansion coefficient",
        "type": "number",
        "default": 11.5,
        "unit": "µm/(m·K)",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "Ta",
        "label": "Assembly temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -100,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Top",
        "label": "Operating temperature",
        "type": "number",
        "default": 100,
        "unit": "°C",
        "min": -100,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Treq",
        "label": "Torque to transmit",
        "type": "number",
        "default": 300,
        "unit": "N·m",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Safety factor on slip",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required safety factor on hub",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "spring-fatigue-check",
    "name": "Compression Spring Fatigue Check (Working Stroke, Goodman Factor)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "Will this compression spring survive millions of cycles between its preload and working lengths, by the Goodman criterion and against first-cycle yield?",
    "description": "Fatigue check of a helical compression spring cycling between two lengths: rate, loads and corrected shear stresses at the preload and working lengths and the solid length (as the compression spring tool), the alternating and mean shear stresses, and the Goodman, Soderberg and Gerber factors with first-cycle yield (as the Goodman fatigue tool, using the torsional endurance limit, ultimate and yield of the wire), against your required factor.",
    "keywords": [
      "MAKEOS",
      "spring fatigue",
      "compression spring",
      "Goodman",
      "endurance limit",
      "valve spring",
      "cyclic load"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Wire diameter",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 16,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Na",
        "label": "Active coils",
        "type": "number",
        "default": 8,
        "unit": "coils",
        "min": 0.5,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "End type",
        "type": "select",
        "default": "cg",
        "options": [
          [
            "cg",
            "Closed and ground (squared and ground)"
          ],
          [
            "c",
            "Closed, not ground"
          ],
          [
            "pg",
            "Plain and ground"
          ],
          [
            "p",
            "Plain (open)"
          ]
        ]
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
        "key": "L0",
        "label": "Unloaded length",
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
        "key": "L1",
        "label": "Preload (longest working) length",
        "type": "number",
        "default": 42,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "Working (shortest) length",
        "type": "number",
        "default": 35,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_wire_strength_torsional_",
        "label": "Wire strength (torsional)",
        "type": "heading"
      },
      {
        "key": "Ses",
        "label": "Torsional endurance limit (corrected)",
        "type": "number",
        "default": 310,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sus",
        "label": "Torsional ultimate strength",
        "type": "number",
        "default": 1100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ssy",
        "label": "Torsional yield strength",
        "type": "number",
        "default": 800,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required fatigue safety factor",
        "type": "number",
        "default": 1.3,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cam-return-spring-check",
    "name": "Cam Follower Return Spring Check (Inertia Force, Jump Speed)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Is my follower return spring strong enough to keep the follower on the cam at this speed, and at what speed will the follower start to jump?",
    "description": "Check of the spring that holds a cam follower against the cam: the peak deceleration of the follower for the motion law, rise, cam angle and speed (as the cam follower motion tool), the inertia force at that point, where in the rise it occurs, the spring force there from its preload and rate, the margin against jump, the speed at which the follower would leave the cam, and the largest spring force against the spring’s rating.",
    "keywords": [
      "MAKEOS",
      "cam follower",
      "return spring",
      "follower jump",
      "cam speed",
      "inertia force",
      "valve spring"
    ],
    "fields": [
      {
        "key": "law",
        "label": "Motion law",
        "type": "select",
        "default": "cyc",
        "options": [
          [
            "shm",
            "Simple harmonic"
          ],
          [
            "cyc",
            "Cycloidal"
          ],
          [
            "parab",
            "Constant acceleration (parabolic)"
          ],
          [
            "poly",
            "3-4-5 polynomial"
          ]
        ]
      },
      {
        "key": "h",
        "label": "Rise (lift)",
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
        "key": "beta",
        "label": "Cam angle for the rise",
        "type": "number",
        "default": 120,
        "unit": "°",
        "min": 1,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Cam speed",
        "type": "number",
        "default": 300,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Follower moving mass (with a third of the spring)",
        "type": "number",
        "default": 1.5,
        "unit": "kg",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_spring",
        "label": "Spring",
        "type": "heading"
      },
      {
        "key": "F0",
        "label": "Spring force with the follower at rest (bottom)",
        "type": "number",
        "default": 60,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Spring rate",
        "type": "number",
        "default": 3,
        "unit": "N/mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Required margin over the inertia force",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fmax",
        "label": "Largest force the spring is rated for",
        "type": "number",
        "default": 150,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "angular-cutter-fluting-setup",
    "name": "Angular Cutter or Taper Reamer Fluting Set-up (Head Angle and Indexing)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "To flute an angular cutter or taper reamer blank on a dividing head, at what angle do I set the head and what index setting moves between teeth?",
    "description": "Set-up for milling the flutes of an angular milling cutter or taper reamer: the dividing-head setting angle from the number of teeth, the angle of the blank and the angle of the fluting cutter, with the intermediate angles (as the angular cutter fluting tool), and the simple indexing setting between teeth (as the simple indexing tool).",
    "keywords": [
      "MAKEOS",
      "fluting",
      "angular cutter",
      "taper reamer",
      "dividing head angle",
      "cutter grinding",
      "toolmaking"
    ],
    "fields": [
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 9,
        "unit": "",
        "min": 5,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "B",
        "label": "Angle of the blank",
        "type": "number",
        "default": 35,
        "unit": "°",
        "min": 0,
        "max": 85,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Angle of the fluting cutter",
        "type": "number",
        "default": 55,
        "unit": "°",
        "min": 20,
        "max": 85,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Dividing head worm ratio",
        "type": "number",
        "default": 40,
        "unit": ":1",
        "min": 1,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "plates",
        "label": "Index plates available",
        "type": "select",
        "default": "bs",
        "options": [
          [
            "bs",
            "Brown & Sharpe plates 1–3"
          ],
          [
            "cin",
            "Cincinnati standard plate (both sides)"
          ]
        ]
      }
    ]
  },
  {
    "id": "gearbox-oil-temperature-check",
    "name": "Gearbox Oil Temperature and Grade Check (Heat Balance, Viscosity Hot)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "At what temperature will my gearbox oil settle, does it need a cooler, and is the oil grade still thick enough at that temperature?",
    "description": "Check of a gearbox’s steady oil temperature and its lubricant: heat generated from the power and efficiency, the equilibrium oil temperature from the housing’s dissipation, the thermal power limit, cooler duty and oil flow if needed (as the gearbox heat balance tool), and the oil’s viscosity at the running temperature (the equilibrium temperature, or the limit if a cooler holds it there) from its viscosity at 40 °C and 100 °C (as the oil viscosity–temperature tool), against the least viscosity the gears need.",
    "keywords": [
      "MAKEOS",
      "gearbox temperature",
      "oil temperature",
      "heat balance",
      "gear oil viscosity",
      "thermal rating",
      "cooler"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Input power",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Gearbox efficiency",
        "type": "number",
        "default": 92,
        "unit": "%",
        "min": 10,
        "max": 99.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Heat-dissipating surface area",
        "type": "number",
        "default": 2,
        "unit": "m²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Heat transfer coefficient",
        "type": "number",
        "default": 15,
        "unit": "W/m²·K",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tamb",
        "label": "Ambient temperature",
        "type": "number",
        "default": 30,
        "unit": "°C",
        "min": -40,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Maximum oil temperature",
        "type": "number",
        "default": 80,
        "unit": "°C",
        "min": 20,
        "max": 150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Oil temperature drop across a cooler",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Oil specific heat",
        "type": "number",
        "default": 1.9,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Oil density",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_oil_grade",
        "label": "Oil grade",
        "type": "heading"
      },
      {
        "key": "v40",
        "label": "Viscosity at 40 °C",
        "type": "number",
        "default": 220,
        "unit": "cSt",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v100",
        "label": "Viscosity at 100 °C",
        "type": "number",
        "default": 19,
        "unit": "cSt",
        "min": 0.5,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nuMin",
        "label": "Least viscosity the gears need at running temperature",
        "type": "number",
        "default": 50,
        "unit": "cSt",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "small-tool-substitution-check",
    "name": "Small Tool Substitution Check (Stiffness Change, Deflection, Feed to Hold Tolerance)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "If I swap to a smaller or longer micro tool, how much stiffness do I lose, how far will it deflect under the cutting force, and what feed keeps deflection within my limit?",
    "description": "Check of a substitute small end mill or drill: the stiffness change from the new diameter and flute length, and the bending deflection of the new tool under the radial cutting force at its stick-out (as the small cutter stiffness tool), compared with the deflection your tolerance allows, with the force and feed (proportional to force) that keep the deflection within the limit.",
    "keywords": [
      "MAKEOS",
      "micro tool",
      "tool deflection",
      "end mill stiffness",
      "small drill",
      "feed reduction",
      "tool substitution"
    ],
    "fields": [
      {
        "key": "D1",
        "label": "Original tool diameter",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L1",
        "label": "Original flute length",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D2",
        "label": "New tool diameter",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "New flute length",
        "type": "number",
        "default": 1.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lo",
        "label": "New tool stick-out from the holder",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Effective diameter factor for flutes",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.4,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Tool material modulus",
        "type": "number",
        "default": 600,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Radial cutting force at the planned feed",
        "type": "number",
        "default": 2,
        "unit": "N",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "feed",
        "label": "Planned feed per tooth",
        "type": "number",
        "default": 0.01,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dMax",
        "label": "Largest deflection the tolerance allows",
        "type": "number",
        "default": 5,
        "unit": "µm",
        "min": 0.01,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
