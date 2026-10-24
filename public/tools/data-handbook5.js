// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook5) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "force-resultant",
    "name": "Resultant of Concurrent Forces",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What single force is equivalent to these forces acting at one point?",
    "description": "Resolve up to four coplanar forces acting through one point into X and Y components, the resultant and the equilibrant.",
    "keywords": [
      "MAKEOS",
      "resultant",
      "force components",
      "vector",
      "equilibrant",
      "statics"
    ],
    "fields": [
      {
        "key": "h_force_1",
        "label": "Force 1",
        "type": "heading"
      },
      {
        "key": "F1",
        "label": "Magnitude",
        "type": "number",
        "default": 1000,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Direction from +X (anticlockwise)",
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
        "key": "h_force_2",
        "label": "Force 2",
        "type": "heading"
      },
      {
        "key": "F2",
        "label": "Magnitude",
        "type": "number",
        "default": 800,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Direction from +X (anticlockwise)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_force_3",
        "label": "Force 3",
        "type": "heading"
      },
      {
        "key": "F3",
        "label": "Magnitude",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a3",
        "label": "Direction from +X (anticlockwise)",
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
        "key": "h_force_4",
        "label": "Force 4",
        "type": "heading"
      },
      {
        "key": "F4",
        "label": "Magnitude",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a4",
        "label": "Direction from +X (anticlockwise)",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "inclined-plane",
    "name": "Inclined Plane and Friction",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What force pushes, holds or lowers a load on this slope?",
    "description": "Force parallel to an incline needed to raise, hold and lower a load with sliding friction, with efficiency and a self-locking check.",
    "keywords": [
      "MAKEOS",
      "incline",
      "ramp",
      "friction",
      "slope",
      "self-locking",
      "wedge"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Load mass",
        "type": "number",
        "default": 200,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Incline angle",
        "type": "number",
        "default": 15,
        "unit": "°",
        "min": 0,
        "max": 89.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Coefficient of sliding friction",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "flywheel-energy",
    "name": "Flywheel Energy and Speed Fluctuation",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How much energy does this flywheel give up between two speeds, and is its rim speed acceptable?",
    "description": "Mass moment of inertia of a disc or ring flywheel, energy released between maximum and minimum speed, coefficient of fluctuation and rim speed.",
    "keywords": [
      "MAKEOS",
      "flywheel",
      "kinetic energy",
      "speed fluctuation",
      "press",
      "punch",
      "rim speed"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Flywheel mass",
        "type": "number",
        "default": 150,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "outer",
        "label": "Outer diameter",
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
        "key": "inner",
        "label": "Inner diameter of rim (0 = solid disc)",
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
        "key": "nmax",
        "label": "Maximum speed",
        "type": "number",
        "default": 600,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmin",
        "label": "Minimum speed during the cycle",
        "type": "number",
        "default": 540,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmax",
        "label": "Allowed rim speed",
        "type": "number",
        "default": 30,
        "unit": "m/s",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "centrifugal-force",
    "name": "Centrifugal Force on a Rotating Mass",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What outward force does this rotating mass exert?",
    "description": "Centrifugal force, acceleration in g and tangential speed of a mass rotating at a radius, for clamps, counterweights and attachments.",
    "keywords": [
      "MAKEOS",
      "centrifugal force",
      "rotating mass",
      "counterweight",
      "g force",
      "chuck jaws"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Rotating mass",
        "type": "number",
        "default": 2,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "radius",
        "label": "Radius to centre of mass",
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
        "key": "rpm",
        "label": "Speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "balance-grade",
    "name": "Permissible Residual Unbalance (Balance Grade)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How much residual unbalance is allowed for this rotor and balance grade?",
    "description": "Permissible residual unbalance and specific unbalance for a rigid rotor from its mass, maximum service speed and balance quality grade G, compared with a measured value.",
    "keywords": [
      "MAKEOS",
      "balancing",
      "unbalance",
      "balance grade",
      "G6.3",
      "ISO 21940",
      "ISO 1940",
      "vibration"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Rotor mass",
        "type": "number",
        "default": 25,
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
        "default": 3000,
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
      },
      {
        "key": "planes",
        "label": "Correction planes",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "One plane (narrow rotor)"
          ],
          [
            "2",
            "Two planes, equal share (CG midway)"
          ]
        ]
      },
      {
        "key": "measured",
        "label": "Measured residual unbalance per plane (0 = not measured)",
        "type": "number",
        "default": 0,
        "unit": "g·mm",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "impact-load",
    "name": "Impact Energy and Stopping Force",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What energy and force result when this mass is stopped over a short distance?",
    "description": "Impact energy of a falling or moving mass and the average and linear-spring peak forces when it is stopped over a given distance.",
    "keywords": [
      "MAKEOS",
      "impact",
      "shock load",
      "drop",
      "buffer",
      "end stop",
      "energy absorption"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Situation",
        "type": "select",
        "default": "drop",
        "options": [
          [
            "drop",
            "Falling mass (from a height)"
          ],
          [
            "moving",
            "Moving mass (horizontal, at a speed)"
          ]
        ]
      },
      {
        "key": "mass",
        "label": "Mass",
        "type": "number",
        "default": 50,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "height",
        "label": "Drop height before contact",
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
        "key": "speed",
        "label": "Speed at contact",
        "type": "number",
        "default": 1.5,
        "unit": "m/s",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stop",
        "label": "Stopping distance",
        "type": "number",
        "default": 10,
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
    "id": "move-profile",
    "name": "Point-to-Point Move Time",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How long does this axis or conveyor move take with the given speed and acceleration?",
    "description": "Move time for a trapezoidal (or triangular) velocity profile with equal acceleration and deceleration, with the force needed to accelerate the moving mass.",
    "keywords": [
      "MAKEOS",
      "motion profile",
      "trapezoidal",
      "axis move",
      "acceleration",
      "cycle time",
      "linear actuator"
    ],
    "fields": [
      {
        "key": "distance",
        "label": "Move distance",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmax",
        "label": "Maximum speed",
        "type": "number",
        "default": 1000,
        "unit": "mm/s",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "accel",
        "label": "Acceleration (= deceleration)",
        "type": "number",
        "default": 5000,
        "unit": "mm/s²",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Moving mass",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "sling-tension",
    "name": "Sling Leg Tension",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What tension does each sling leg carry at this angle, and is it within the rating?",
    "description": "Tension in each leg of a multi-leg sling from the load mass, the number of legs assumed to share the load and the leg angle from vertical.",
    "keywords": [
      "MAKEOS",
      "sling",
      "lifting",
      "rigging",
      "leg angle",
      "WLL",
      "bridle"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Load mass",
        "type": "number",
        "default": 2000,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "legs",
        "label": "Legs assumed to share the load",
        "type": "number",
        "default": 2,
        "unit": "legs",
        "min": 1,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "angle",
        "label": "Leg angle from vertical",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wll",
        "label": "Working load limit per leg",
        "type": "number",
        "default": 1500,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "combined-cg",
    "name": "Combined Centre of Gravity",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Where is the centre of gravity of these combined masses?",
    "description": "Total mass and centre of gravity (X, Y, Z) of up to five masses at known positions, for lifting, transport and machine layout.",
    "keywords": [
      "MAKEOS",
      "centre of gravity",
      "center of gravity",
      "CG",
      "mass properties",
      "lifting point",
      "composite"
    ],
    "fields": [
      {
        "key": "h_mass_1",
        "label": "Mass 1",
        "type": "heading"
      },
      {
        "key": "m1",
        "label": "Mass",
        "type": "number",
        "default": 120,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x1",
        "label": "X position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Y position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Z position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_mass_2",
        "label": "Mass 2",
        "type": "heading"
      },
      {
        "key": "m2",
        "label": "Mass",
        "type": "number",
        "default": 45,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "X position of its CG",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Y position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z2",
        "label": "Z position of its CG",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_mass_3",
        "label": "Mass 3",
        "type": "heading"
      },
      {
        "key": "m3",
        "label": "Mass",
        "type": "number",
        "default": 30,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x3",
        "label": "X position of its CG",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Y position of its CG",
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
        "key": "z3",
        "label": "Z position of its CG",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_mass_4",
        "label": "Mass 4",
        "type": "heading"
      },
      {
        "key": "m4",
        "label": "Mass",
        "type": "number",
        "default": 0,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x4",
        "label": "X position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y4",
        "label": "Y position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z4",
        "label": "Z position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_mass_5",
        "label": "Mass 5",
        "type": "heading"
      },
      {
        "key": "m5",
        "label": "Mass",
        "type": "number",
        "default": 0,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x5",
        "label": "X position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y5",
        "label": "Y position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z5",
        "label": "Z position of its CG",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "mass-moment-inertia",
    "name": "Mass Moment of Inertia",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What is the mass moment of inertia of this body about the chosen axis?",
    "description": "Mass moment of inertia and radius of gyration of common solids, with the parallel-axis transfer to an offset axis, for drive sizing and acceleration.",
    "keywords": [
      "MAKEOS",
      "moment of inertia",
      "rotational inertia",
      "radius of gyration",
      "parallel axis",
      "motor sizing"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Body and axis",
        "type": "select",
        "default": "disc",
        "options": [
          [
            "disc",
            "Solid cylinder or disc, about its own axis"
          ],
          [
            "ring",
            "Hollow cylinder, about its own axis"
          ],
          [
            "cyltrans",
            "Solid cylinder, about a central axis across it"
          ],
          [
            "block",
            "Rectangular block, about a central axis normal to face a × b"
          ],
          [
            "sphere",
            "Solid sphere, about a diameter"
          ],
          [
            "rod",
            "Slender rod, about one end"
          ]
        ]
      },
      {
        "key": "mass",
        "label": "Mass",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dimA",
        "label": "Dimension A (outer diameter, or side a, or rod length)",
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
        "key": "dimB",
        "label": "Dimension B (inner diameter, length, or side b)",
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
        "key": "offset",
        "label": "Offset of rotation axis from centre (parallel axis)",
        "type": "number",
        "default": 0,
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
    "id": "belt-friction",
    "name": "Belt, Rope and Band Friction (Capstan)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What is the most tension the tight side can hold for this wrap and friction?",
    "description": "Maximum tight-side tension of a belt, rope or band wrapped around a drum (capstan or Euler–Eytelwein relation), for flat and V-groove contact.",
    "keywords": [
      "MAKEOS",
      "capstan",
      "Euler belt",
      "band brake",
      "rope",
      "wrap angle",
      "tension ratio"
    ],
    "fields": [
      {
        "key": "slack",
        "label": "Slack-side (holding) tension",
        "type": "number",
        "default": 200,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
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
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wrap",
        "label": "Wrap angle",
        "type": "number",
        "default": 180,
        "unit": "°",
        "min": 0.000001,
        "max": 36000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "groove",
        "label": "Groove included angle (0 = flat)",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "column-buckling",
    "name": "Column Buckling (Euler and Johnson)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What load will buckle this column or strut, and is the safety factor enough?",
    "description": "Critical buckling load of a straight, centrally loaded column using Euler’s formula for slender members and the J.B. Johnson parabola for intermediate ones, with the safety factor against an applied load.",
    "keywords": [
      "MAKEOS",
      "buckling",
      "column",
      "strut",
      "Euler",
      "Johnson",
      "slenderness ratio",
      "compression member"
    ],
    "fields": [
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
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Cross-section area",
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
        "label": "Least second moment of area",
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
        "key": "L",
        "label": "Unsupported length",
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
        "label": "Effective length factor K",
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
        "key": "P",
        "label": "Applied axial load",
        "type": "number",
        "default": 50000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required safety factor",
        "type": "number",
        "default": 2.5,
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
    "id": "principal-stress",
    "name": "Principal Stresses and von Mises",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What are the principal stresses, maximum shear and von Mises stress for this stress state?",
    "description": "Principal stresses, their direction, maximum shear stress, von Mises and Tresca equivalent stresses for a plane stress state, with safety factors against yield.",
    "keywords": [
      "MAKEOS",
      "principal stress",
      "von Mises",
      "Tresca",
      "Mohr circle",
      "combined stress",
      "equivalent stress"
    ],
    "fields": [
      {
        "key": "sx",
        "label": "Normal stress σx",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sy",
        "label": "Normal stress σy",
        "type": "number",
        "default": -40,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "txy",
        "label": "Shear stress τxy",
        "type": "number",
        "default": 50,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 350,
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
        "default": 1.5,
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
    "id": "pressure-cylinder",
    "name": "Pressure Cylinder Wall Stress",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What stresses does internal pressure cause in this tube or cylinder wall?",
    "description": "Hoop, radial and longitudinal stresses in a cylinder under internal pressure by Lamé’s thick-wall equations, with the thin-wall estimate and a von Mises safety factor.",
    "keywords": [
      "MAKEOS",
      "hoop stress",
      "Lamé",
      "thick wall",
      "Barlow",
      "pressure vessel",
      "hydraulic cylinder",
      "tube"
    ],
    "fields": [
      {
        "key": "di",
        "label": "Inside diameter",
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
        "key": "t",
        "label": "Wall thickness",
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
        "key": "p",
        "label": "Internal pressure (gauge)",
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
        "key": "ends",
        "label": "Ends",
        "type": "select",
        "default": "closed",
        "options": [
          [
            "closed",
            "Closed (end load carried by the wall)"
          ],
          [
            "open",
            "Open or end load carried elsewhere"
          ]
        ]
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 355,
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
    "id": "goodman-fatigue",
    "name": "Fatigue Safety Factor (Goodman)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "Is this fluctuating stress safe for infinite life by the Goodman, Soderberg and Gerber criteria?",
    "description": "Fatigue safety factors for combined alternating and mean stress by modified Goodman, Soderberg and Gerber, plus first-cycle yield, against a required factor.",
    "keywords": [
      "MAKEOS",
      "fatigue",
      "Goodman",
      "Soderberg",
      "Gerber",
      "endurance limit",
      "alternating stress",
      "mean stress"
    ],
    "fields": [
      {
        "key": "sa",
        "label": "Alternating stress amplitude σa",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sm",
        "label": "Mean stress σm",
        "type": "number",
        "default": 80,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Se",
        "label": "Corrected endurance limit Se",
        "type": "number",
        "default": 220,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Su",
        "label": "Ultimate tensile strength",
        "type": "number",
        "default": 600,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 400,
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
        "default": 1.5,
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
    "id": "beam-cases",
    "name": "Beam Cases: Off-Centre, Fixed and Propped",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What reactions, moment, stress and deflection does this beam case give?",
    "description": "Reactions, maximum bending moment, bending stress and deflection for an off-centre point load, cantilever with uniform load, fixed–fixed beams and a propped cantilever.",
    "keywords": [
      "MAKEOS",
      "beam",
      "deflection",
      "fixed beam",
      "propped cantilever",
      "bending moment",
      "reactions"
    ],
    "fields": [
      {
        "key": "case",
        "label": "Beam case",
        "type": "select",
        "default": "ss-offset",
        "options": [
          [
            "ss-offset",
            "Simply supported · point load at distance a"
          ],
          [
            "cant-udl",
            "Cantilever · uniform load"
          ],
          [
            "ff-point",
            "Fixed both ends · central point load"
          ],
          [
            "ff-udl",
            "Fixed both ends · uniform load"
          ],
          [
            "prop-udl",
            "Fixed one end, supported the other · uniform load"
          ]
        ]
      },
      {
        "key": "load",
        "label": "Load (point load, or total uniform load)",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Span",
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
        "key": "a",
        "label": "Load position from left support (off-centre case)",
        "type": "number",
        "default": 600,
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
        "label": "Allowable bending stress",
        "type": "number",
        "default": 150,
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
    "id": "shaft-diameter",
    "name": "Shaft Diameter for Bending and Torsion",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What shaft diameter carries this bending moment and torque at the allowable shear stress?",
    "description": "Minimum solid shaft diameter for combined bending and torsion by the maximum-shear-stress theory with shock and fatigue factors, and the stress in a chosen diameter.",
    "keywords": [
      "MAKEOS",
      "shaft design",
      "combined bending torsion",
      "ASME shaft",
      "shaft size",
      "keyway"
    ],
    "fields": [
      {
        "key": "M",
        "label": "Maximum bending moment",
        "type": "number",
        "default": 300,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 500,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Km",
        "label": "Shock and fatigue factor, bending (Km)",
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
        "key": "Kt",
        "label": "Shock and fatigue factor, torsion (Kt)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tau",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "keyway",
        "label": "Keyway at the section",
        "type": "select",
        "default": "yes",
        "options": [
          [
            "yes",
            "Yes (allowable × 0.75)"
          ],
          [
            "no",
            "No"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Actual diameter to check (0 = none)",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "critical-speed",
    "name": "Shaft Critical (Whirling) Speed",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "At what speed will this shaft whirl, and is the running speed clear of it?",
    "description": "First critical speed of a uniform solid shaft with simple, fixed–free or fixed–fixed supports, optionally with a single disc (Dunkerley), checked against the operating speed.",
    "keywords": [
      "MAKEOS",
      "critical speed",
      "whirling",
      "resonance",
      "shaft vibration",
      "Dunkerley",
      "rotor"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Shaft diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length between supports",
        "type": "number",
        "default": 1500,
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
        "key": "support",
        "label": "Supports",
        "type": "select",
        "default": "ss",
        "options": [
          [
            "ss",
            "Simply supported both ends"
          ],
          [
            "cf",
            "Fixed one end, free other (overhung)"
          ],
          [
            "ff",
            "Fixed both ends"
          ]
        ]
      },
      {
        "key": "disc",
        "label": "Disc mass (0 = none)",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Operating speed",
        "type": "number",
        "default": 750,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Required separation margin",
        "type": "number",
        "default": 25,
        "unit": "%",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "circular-plate",
    "name": "Circular Flat Plate under Pressure",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What stress and deflection does uniform pressure cause in this round plate?",
    "description": "Maximum bending stress and centre deflection of a uniformly loaded circular flat plate with clamped or simply supported edges (small-deflection theory).",
    "keywords": [
      "MAKEOS",
      "flat plate",
      "circular plate",
      "blind flange",
      "end cover",
      "diaphragm",
      "Roark"
    ],
    "fields": [
      {
        "key": "edge",
        "label": "Edge support",
        "type": "select",
        "default": "clamped",
        "options": [
          [
            "clamped",
            "Clamped (built-in) edge"
          ],
          [
            "simple",
            "Simply supported edge"
          ]
        ]
      },
      {
        "key": "a",
        "label": "Radius to the edge support",
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
        "label": "Plate thickness",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Uniform pressure",
        "type": "number",
        "default": 1,
        "unit": "MPa",
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
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 160,
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
    "id": "press-fit",
    "name": "Press and Shrink Fit Pressure and Holding Torque",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What contact pressure, hub stress and holding torque does this interference give?",
    "description": "Interface pressure of a hub on a solid or hollow shaft from the diametral interference (Lamé), hub bore stresses, torque and axial holding capacity, and the hub temperature rise for a shrink fit.",
    "keywords": [
      "MAKEOS",
      "press fit",
      "shrink fit",
      "interference fit",
      "hub stress",
      "holding torque",
      "Lamé"
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
        "key": "delta",
        "label": "Diametral interference",
        "type": "number",
        "default": 0.04,
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
        "default": 200,
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
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 0.5,
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
        "key": "Sy",
        "label": "Hub yield strength",
        "type": "number",
        "default": 350,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
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
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_shrink_fitting",
        "label": "Shrink fitting",
        "type": "heading"
      },
      {
        "key": "alpha",
        "label": "Hub expansion coefficient",
        "type": "number",
        "default": 11.5,
        "unit": "µm/(m·K)",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "clear",
        "label": "Assembly clearance wanted when hot",
        "type": "number",
        "default": 0.03,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "thermal-stress",
    "name": "Restrained Thermal Stress",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What stress and force build up if this member is prevented from expanding?",
    "description": "Stress and force in a bar or pipe whose thermal expansion is fully or partly restrained, compared with the yield strength.",
    "keywords": [
      "MAKEOS",
      "thermal stress",
      "restrained expansion",
      "thermal force",
      "pipe anchor",
      "rail"
    ],
    "fields": [
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
        "key": "alpha",
        "label": "Expansion coefficient",
        "type": "number",
        "default": 12,
        "unit": "µm/(m·K)",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Temperature change",
        "type": "number",
        "default": 60,
        "unit": "K",
        "min": -1000,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "restraint",
        "label": "Degree of restraint",
        "type": "number",
        "default": 100,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Cross-section area",
        "type": "number",
        "default": 2000,
        "unit": "mm²",
        "min": 0.000001,
        "max": 1000000000,
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
      }
    ]
  },
  {
    "id": "hertz-contact",
    "name": "Hertz Contact Stress",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What contact pressure develops between these curved bodies under load?",
    "description": "Contact width, maximum contact pressure and maximum subsurface shear stress for sphere (point) or parallel cylinder (line) contact by Hertz theory.",
    "keywords": [
      "MAKEOS",
      "Hertz",
      "contact stress",
      "rollers",
      "cam follower",
      "ball on flat",
      "track wheel"
    ],
    "fields": [
      {
        "key": "geom",
        "label": "Contact type",
        "type": "select",
        "default": "cyl",
        "options": [
          [
            "sphere",
            "Sphere on sphere or flat (point contact)"
          ],
          [
            "cyl",
            "Parallel cylinders or cylinder on flat (line contact)"
          ]
        ]
      },
      {
        "key": "R1",
        "label": "Radius of body 1",
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
        "key": "R2",
        "label": "Radius of body 2 (0 = flat, negative = concave)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Normal load",
        "type": "number",
        "default": 10000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Contact length (line contact only)",
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
        "key": "h_materials",
        "label": "Materials",
        "type": "heading"
      },
      {
        "key": "E1",
        "label": "Elastic modulus, body 1",
        "type": "number",
        "default": 210,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu1",
        "label": "Poisson’s ratio, body 1",
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
        "key": "E2",
        "label": "Elastic modulus, body 2",
        "type": "number",
        "default": 210,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu2",
        "label": "Poisson’s ratio, body 2",
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
        "key": "allow",
        "label": "Allowable contact pressure",
        "type": "number",
        "default": 1500,
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
    "id": "compression-spring",
    "name": "Helical Compression Spring Design Check",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "What rate, load and stress will this compression spring have at its working length?",
    "description": "Rate, working load, Wahl-corrected shear stress, solid length, stress at solid, natural frequency and buckling ratio of a round-wire helical compression spring.",
    "keywords": [
      "MAKEOS",
      "compression spring",
      "spring rate",
      "Wahl factor",
      "solid height",
      "spring index",
      "buckling"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Wire diameter",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
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
        "max": 10000,
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
        "label": "Unloaded (free) length",
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
        "key": "Lw",
        "label": "Working (compressed) length",
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
        "key": "allow",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 700,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Wire density",
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
    "id": "extension-spring",
    "name": "Helical Extension Spring Check",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "What load and body stress will this extension spring have at its working extension?",
    "description": "Rate, load at extension including initial tension, and Wahl-corrected body stress of a round-wire helical extension spring.",
    "keywords": [
      "MAKEOS",
      "extension spring",
      "tension spring",
      "initial tension",
      "spring rate",
      "Wahl factor"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Wire diameter",
        "type": "number",
        "default": 1.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 12,
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
        "default": 20,
        "unit": "coils",
        "min": 0.5,
        "max": 10000,
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
        "key": "Fi",
        "label": "Initial tension",
        "type": "number",
        "default": 10,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Extension from free length",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable body shear stress",
        "type": "number",
        "default": 650,
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
    "id": "torsion-spring",
    "name": "Helical Torsion Spring Check",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "How far will this torsion spring wind, how highly stressed is it and will it still fit its arbor?",
    "description": "Angular deflection, rate, bending stress (with the inner-fibre correction factor) and reduced coil diameter of a round-wire helical torsion spring under a moment.",
    "keywords": [
      "MAKEOS",
      "torsion spring",
      "angular deflection",
      "spring rate per turn",
      "arbor",
      "bending stress"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Wire diameter",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Mean coil diameter",
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
        "key": "Nb",
        "label": "Body turns",
        "type": "number",
        "default": 6,
        "unit": "turns",
        "min": 0.5,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
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
        "key": "F",
        "label": "Load at arm",
        "type": "number",
        "default": 20,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "arm",
        "label": "Moment arm (load to coil axis)",
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
        "key": "arbor",
        "label": "Arbor diameter (0 = none)",
        "type": "number",
        "default": 15,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 1200,
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
    "id": "spring-combination",
    "name": "Springs in Series or Parallel",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "What is the combined rate of these springs, and how is the load shared?",
    "description": "Equivalent rate of up to four springs in series or parallel, with the deflection and load of each spring under a given total load.",
    "keywords": [
      "MAKEOS",
      "spring rate",
      "series springs",
      "parallel springs",
      "equivalent stiffness",
      "nested springs"
    ],
    "fields": [
      {
        "key": "arr",
        "label": "Arrangement",
        "type": "select",
        "default": "parallel",
        "options": [
          [
            "parallel",
            "Parallel (share the load, same deflection)"
          ],
          [
            "series",
            "Series (same load, deflections add)"
          ]
        ]
      },
      {
        "key": "k1",
        "label": "Rate of spring 1",
        "type": "number",
        "default": 20,
        "unit": "N/mm",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k2",
        "label": "Rate of spring 2",
        "type": "number",
        "default": 30,
        "unit": "N/mm",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k3",
        "label": "Rate of spring 3 (0 = not used)",
        "type": "number",
        "default": 0,
        "unit": "N/mm",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k4",
        "label": "Rate of spring 4 (0 = not used)",
        "type": "number",
        "default": 0,
        "unit": "N/mm",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Total load",
        "type": "number",
        "default": 500,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "disc-spring",
    "name": "Disc (Belleville) Spring Load and Stress",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "What force and stress does this disc spring, or stack, give at a deflection?",
    "description": "Load, flat load and top inner-edge stress of a disc (Belleville) spring by the Almen–László method, and the force and travel of series and parallel stacks.",
    "keywords": [
      "MAKEOS",
      "disc spring",
      "Belleville",
      "Almen László",
      "spring washer",
      "disc stack",
      "DIN EN 16983"
    ],
    "fields": [
      {
        "key": "De",
        "label": "Outside diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Di",
        "label": "Inside diameter",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Thickness",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h0",
        "label": "Cone height h₀ (free height − thickness)",
        "type": "number",
        "default": 1.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 206,
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
        "key": "s",
        "label": "Deflection of one disc",
        "type": "number",
        "default": 1.05,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ns",
        "label": "Discs in series (alternating)",
        "type": "number",
        "default": 1,
        "unit": "discs",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "np",
        "label": "Discs in parallel (nested)",
        "type": "number",
        "default": 1,
        "unit": "discs",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  }
]);
