// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook27) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "ballscrew-axis-sizing",
    "name": "Ball-Screw Linear Axis Sizing",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Can this ball screw and motor move the load at the speed and acceleration required, and how long will the screw last?",
    "description": "Sizing of a ball-screw driven axis over a move cycle: screw speed, axial forces while accelerating, running and decelerating, motor torque in each phase from the handbook driving-torque relation plus rotor and screw inertia, RMS torque over the cycle, critical speed and buckling load for the end fixity, cubic-mean load and rating life in hours.",
    "keywords": [
      "MAKEOS",
      "ball screw sizing",
      "linear axis",
      "servo motor torque",
      "critical speed",
      "screw buckling",
      "ball screw life"
    ],
    "fields": [
      {
        "key": "h_load_and_motion",
        "label": "Load and motion",
        "type": "heading"
      },
      {
        "key": "m",
        "label": "Moving mass",
        "type": "number",
        "default": 200,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Guide friction coefficient",
        "type": "number",
        "default": 0.01,
        "unit": "",
        "min": 0,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fx",
        "label": "External axial force while moving",
        "type": "number",
        "default": 500,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Maximum speed",
        "type": "number",
        "default": 500,
        "unit": "mm/s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ta",
        "label": "Acceleration (and deceleration) time",
        "type": "number",
        "default": 0.2,
        "unit": "s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tc",
        "label": "Constant-speed time",
        "type": "number",
        "default": 1,
        "unit": "s",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tdw",
        "label": "Dwell time per cycle",
        "type": "number",
        "default": 0.5,
        "unit": "s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_screw_and_drive",
        "label": "Screw and drive",
        "type": "heading"
      },
      {
        "key": "lead",
        "label": "Lead",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dr",
        "label": "Root diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ls",
        "label": "Length between supports",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "End fixity",
        "type": "select",
        "default": "fs",
        "options": [
          [
            "ff",
            "Fixed – fixed"
          ],
          [
            "fs",
            "Fixed – supported"
          ],
          [
            "ss",
            "Supported – supported"
          ],
          [
            "ffree",
            "Fixed – free"
          ]
        ]
      },
      {
        "key": "eff",
        "label": "Screw efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 10,
        "max": 99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jm",
        "label": "Motor and coupling inertia",
        "type": "number",
        "default": 0.0002,
        "unit": "kg·m²",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ca",
        "label": "Dynamic load rating",
        "type": "number",
        "default": 15,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fw",
        "label": "Load factor",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required life",
        "type": "number",
        "default": 20000,
        "unit": "h",
        "min": 0.000001,
        "max": 10000000,
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
        "key": "speedPct",
        "label": "Allowed share of critical speed",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "loadPct",
        "label": "Allowed share of buckling load",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Screw modulus",
        "type": "number",
        "default": 206,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Screw density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "v-belt-drive-design",
    "name": "V-Belt or Flat Belt Drive Design",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How many belts does this drive need, how long are they, and what load do they put on the shafts?",
    "description": "Design of an open belt drive: driven pulley size and speed, belt speed, exact pitch length, wrap angle, tension ratio from the friction coefficient and groove angle (Euler), design power with service factor, centrifugal tension, tight and slack side tensions, the number of belts for an allowable tension per belt, and the resultant shaft load.",
    "keywords": [
      "MAKEOS",
      "V-belt design",
      "belt drive selection",
      "number of belts",
      "belt tension",
      "shaft load",
      "wrap angle"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Power",
        "type": "number",
        "default": 7.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Driver speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d1",
        "label": "Driver pitch diameter",
        "type": "number",
        "default": 125,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Speed ratio (driver ÷ driven speed)",
        "type": "number",
        "default": 2.5,
        "unit": "",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance",
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
        "key": "SF",
        "label": "Service factor",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "groove",
        "label": "Belt",
        "type": "select",
        "default": "v",
        "options": [
          [
            "v",
            "V-belt (38° groove)"
          ],
          [
            "flat",
            "Flat belt"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Friction coefficient",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Belt mass per metre",
        "type": "number",
        "default": 0.1,
        "unit": "kg/m",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Allowable tight-side tension per belt",
        "type": "number",
        "default": 400,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "roller-chain-drive-design",
    "name": "Roller Chain Drive Design",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Will this roller chain and sprocket pair carry the power, how long is the chain, and how smooth will it run?",
    "description": "Design check of a roller chain drive: sprocket pitch diameters, chain speed, design power with service factor against the per-strand rating and multi-strand factor, working pull and its safety factor on breaking load, chain length rounded to an even number of links, the exact centre distance for it, wrap on the small sprocket and chordal speed variation.",
    "keywords": [
      "MAKEOS",
      "roller chain drive",
      "chain selection",
      "sprocket",
      "chain length",
      "chordal action",
      "chain pull"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Power",
        "type": "number",
        "default": 5.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Small sprocket speed",
        "type": "number",
        "default": 300,
        "unit": "rpm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Small sprocket teeth",
        "type": "number",
        "default": 19,
        "unit": "",
        "min": 7,
        "max": 150,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Large sprocket teeth",
        "type": "number",
        "default": 57,
        "unit": "",
        "min": 7,
        "max": 300,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "p",
        "label": "Chain pitch",
        "type": "number",
        "default": 15.875,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cp",
        "label": "Target centre distance (pitches)",
        "type": "number",
        "default": 40,
        "unit": "",
        "min": 10,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor",
        "type": "number",
        "default": 1.3,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pr",
        "label": "Power rating of one strand at this speed",
        "type": "number",
        "default": 8,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "msf",
        "label": "Multi-strand factor (1 for single)",
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
        "key": "Fb",
        "label": "Chain breaking load",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kgm",
        "label": "Chain mass per metre",
        "type": "number",
        "default": 1,
        "unit": "kg/m",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bearing-selection-check",
    "name": "Rolling Bearing Selection Check",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Does this bearing give the life I need at the reliability I want, and is it safe statically and at speed?",
    "description": "Selection check of a ball or roller bearing: dynamic equivalent load from radial and axial loads, required dynamic rating for the life at the chosen reliability (Weibull reliability factor) and life modification factor, the life of the chosen bearing, static equivalent load and safety factor, and speed against the limiting speed.",
    "keywords": [
      "MAKEOS",
      "bearing selection",
      "bearing life",
      "required load rating",
      "static safety factor",
      "reliability factor",
      "L10 life"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Bearing type",
        "type": "select",
        "default": "ball",
        "options": [
          [
            "ball",
            "Ball"
          ],
          [
            "roller",
            "Roller"
          ]
        ]
      },
      {
        "key": "Fr",
        "label": "Radial load",
        "type": "number",
        "default": 4,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fa",
        "label": "Axial load",
        "type": "number",
        "default": 1.5,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "X",
        "label": "Radial factor X",
        "type": "number",
        "default": 0.56,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Axial factor Y",
        "type": "number",
        "default": 1.6,
        "unit": "",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed",
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
        "key": "Lreq",
        "label": "Required life",
        "type": "number",
        "default": 20000,
        "unit": "h",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rel",
        "label": "Reliability",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 90,
        "max": 99.95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "basis",
        "label": "Reliability factor basis",
        "type": "select",
        "default": "iso",
        "options": [
          [
            "iso",
            "ISO 281:2007"
          ],
          [
            "abma",
            "ANSI/ABMA 1990 (as in the handbook)"
          ]
        ]
      },
      {
        "key": "aiso",
        "label": "Life modification factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.05,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_chosen_bearing",
        "label": "Chosen bearing",
        "type": "heading"
      },
      {
        "key": "C",
        "label": "Dynamic load rating",
        "type": "number",
        "default": 70,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C0",
        "label": "Static load rating",
        "type": "number",
        "default": 45,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "X0",
        "label": "Static radial factor",
        "type": "number",
        "default": 0.6,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y0",
        "label": "Static axial factor",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s0",
        "label": "Required static safety factor",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nlim",
        "label": "Limiting speed",
        "type": "number",
        "default": 8000,
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
    "id": "fillet-weld-joint-design",
    "name": "Fillet Weld Joint Design and Cost",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What fillet weld size does this joint need, and what will the weld metal, time and cost be?",
    "description": "Design of a fillet-welded joint loaded in shear on the throat: the throat and leg size required for the load, weld length and allowable throat stress, the leg used after a minimum size for the plate, utilisation, then weld metal mass, arc time, welder time and cost from deposition rate, operating factor, filler efficiency and rates.",
    "keywords": [
      "MAKEOS",
      "fillet weld design",
      "weld size",
      "throat stress",
      "weld cost",
      "weld metal",
      "arc time"
    ],
    "fields": [
      {
        "key": "h_strength",
        "label": "Strength",
        "type": "heading"
      },
      {
        "key": "F",
        "label": "Load on the weld group",
        "type": "number",
        "default": 60,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Total effective weld length",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tau",
        "label": "Allowable throat shear stress",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "amin",
        "label": "Minimum leg for the plate thickness",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Thinner plate thickness",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cost",
        "label": "Cost",
        "type": "heading"
      },
      {
        "key": "excess",
        "label": "Convexity and overfill allowance",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Weld metal density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dep",
        "label": "Deposition rate",
        "type": "number",
        "default": 3,
        "unit": "kg/h",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "of",
        "label": "Operating factor (arc-on share)",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Filler deposition efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Welder labour and overhead rate",
        "type": "number",
        "default": 80,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wire",
        "label": "Filler price",
        "type": "number",
        "default": 4,
        "unit": "$/kg",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cam-follower-design",
    "name": "Cam and Spring-Loaded Follower Design",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Will this cam’s follower stay in contact at speed, what spring preload does it need, and is the pressure angle acceptable?",
    "description": "Design check of a radial cam with a translating roller follower held by a spring: follower displacement, velocity and acceleration through the rise for simple harmonic, cycloidal or constant-acceleration motion, the maximum pressure angle, the contact force through the cycle from inertia, spring and external load, and the spring preload needed to keep contact with a margin.",
    "keywords": [
      "MAKEOS",
      "cam design",
      "follower jump",
      "cam spring",
      "pressure angle",
      "cycloidal cam",
      "contact force"
    ],
    "fields": [
      {
        "key": "law",
        "label": "Rise motion",
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
            "par",
            "Constant acceleration (parabolic)"
          ]
        ]
      },
      {
        "key": "h",
        "label": "Rise",
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
        "key": "beta",
        "label": "Cam angle for the rise",
        "type": "number",
        "default": 120,
        "unit": "°",
        "min": 10,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Cam speed",
        "type": "number",
        "default": 600,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rb",
        "label": "Base circle radius",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rr",
        "label": "Roller radius",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mf",
        "label": "Follower and linkage mass",
        "type": "number",
        "default": 1,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fext",
        "label": "External load opposing the rise",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Spring rate",
        "type": "number",
        "default": 1,
        "unit": "N/mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F0",
        "label": "Spring preload at the bottom of the rise",
        "type": "number",
        "default": 150,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Contact margin on preload",
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
        "key": "limit",
        "label": "Pressure angle limit",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 5,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "clutch-engagement-design",
    "name": "Friction Clutch Engagement Design",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What clamp force does this clutch need to start the load in time, and how much heat does each engagement make?",
    "description": "Sizing a multi-plate or single-plate friction clutch for an inertia start: torque to accelerate the load in the target time plus load torque with a service factor, clamp force for the friction faces (uniform wear), peak lining pressure against the allowable, actual slip time at the design torque, energy dissipated per engagement, temperature rise of the plates and average heat at the engagement rate.",
    "keywords": [
      "MAKEOS",
      "clutch design",
      "clutch engagement",
      "slip energy",
      "clutch heat",
      "clamp force",
      "inertia start"
    ],
    "fields": [
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "J",
        "label": "Load inertia at the clutch",
        "type": "number",
        "default": 2,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Driving speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TL",
        "label": "Load torque during engagement",
        "type": "number",
        "default": 20,
        "unit": "N·m",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Target engagement time",
        "type": "number",
        "default": 1,
        "unit": "s",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor",
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
        "key": "h_clutch",
        "label": "Clutch",
        "type": "heading"
      },
      {
        "key": "Do",
        "label": "Friction face outside diameter",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Di",
        "label": "Friction face inside diameter",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "faces",
        "label": "Number of friction faces",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 40,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mu",
        "label": "Friction coefficient",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.02,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pall",
        "label": "Allowable lining pressure",
        "type": "number",
        "default": 1,
        "unit": "MPa",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_heat",
        "label": "Heat",
        "type": "heading"
      },
      {
        "key": "mass",
        "label": "Mass of plates absorbing heat",
        "type": "number",
        "default": 5,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Specific heat of plates",
        "type": "number",
        "default": 460,
        "unit": "J/kg·K",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eph",
        "label": "Engagements per hour",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "screw-jack-design",
    "name": "Screw Jack and Power Screw Design",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What torque and lever force raise this load, will the screw self-lock, and are the threads, nut and screw strong enough?",
    "description": "Complete check of a screw jack or power screw with Acme or trapezoidal thread: raising and lowering torque with collar friction, efficiency and self-locking, the force at the lever, nut bearing pressure from the engaged threads, combined direct and torsional stress at the screw root, and Euler buckling of the screw column.",
    "keywords": [
      "MAKEOS",
      "screw jack",
      "power screw design",
      "Acme screw",
      "self-locking",
      "nut bearing pressure",
      "screw buckling"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Load",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Major diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Pitch",
        "type": "number",
        "default": 7,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "starts",
        "label": "Number of starts",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "flank",
        "label": "Flank half-angle (15° for Acme/trapezoidal)",
        "type": "number",
        "default": 15,
        "unit": "°",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Thread friction coefficient",
        "type": "number",
        "default": 0.12,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dc",
        "label": "Mean collar diameter (0 = none)",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 2000,
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
      },
      {
        "key": "R",
        "label": "Lever arm length",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ln",
        "label": "Nut length",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pall",
        "label": "Allowable thread bearing pressure",
        "type": "number",
        "default": 10,
        "unit": "MPa",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Screw yield strength",
        "type": "number",
        "default": 300,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lb",
        "label": "Unsupported screw length",
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
        "key": "Kb",
        "label": "Effective length factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.5,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Screw modulus",
        "type": "number",
        "default": 206,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pump-system-design",
    "name": "Pumping System Design (Head, Power and NPSH)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What head and power does this pumping duty need, and will the pump have enough suction head?",
    "description": "Design of a simple pumping system: pipe velocity, Reynolds number and Darcy friction factor (Colebrook–White), friction and fitting losses, total head from static lift, pressure difference and losses, hydraulic, shaft and motor power, and net positive suction head available from the suction conditions compared with the pump’s requirement.",
    "keywords": [
      "MAKEOS",
      "pump system design",
      "total head",
      "pump power",
      "NPSH",
      "pipe friction",
      "motor sizing"
    ],
    "fields": [
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "Q",
        "label": "Flow",
        "type": "number",
        "default": 300,
        "unit": "L/min",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dz",
        "label": "Static lift (outlet level − suction level)",
        "type": "number",
        "default": 15,
        "unit": "m",
        "min": -1000,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Outlet pressure − suction pressure",
        "type": "number",
        "default": 0,
        "unit": "bar",
        "min": -100,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_discharge_and_suction_pipe",
        "label": "Discharge and suction pipe",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Pipe bore",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Total pipe length",
        "type": "number",
        "default": 80,
        "unit": "m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Total fitting loss coefficient",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Pipe roughness",
        "type": "number",
        "default": 0.045,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_fluid",
        "label": "Fluid",
        "type": "heading"
      },
      {
        "key": "rho",
        "label": "Density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Kinematic viscosity",
        "type": "number",
        "default": 1,
        "unit": "mm²/s",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_suction",
        "label": "Suction",
        "type": "heading"
      },
      {
        "key": "ps",
        "label": "Absolute pressure on the suction surface",
        "type": "number",
        "default": 1.013,
        "unit": "bar",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pv",
        "label": "Vapour pressure at the pumping temperature",
        "type": "number",
        "default": 0.023,
        "unit": "bar",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "zs",
        "label": "Suction surface above the pump (negative if below)",
        "type": "number",
        "default": -2,
        "unit": "m",
        "min": -50,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ls",
        "label": "Suction pipe length",
        "type": "number",
        "default": 5,
        "unit": "m",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ks",
        "label": "Suction fitting loss coefficient",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "npshr",
        "label": "NPSH required by the pump",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_machine",
        "label": "Machine",
        "type": "heading"
      },
      {
        "key": "eta",
        "label": "Pump efficiency",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "marg",
        "label": "Motor margin",
        "type": "number",
        "default": 15,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
