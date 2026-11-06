// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook51) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "c-frame-throat-check",
    "name": "C-Frame Throat Check (Curved-Beam Stress, Straight-Beam Comparison, Depth Needed)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "Is the throat of this C-frame press or clamp strong enough, how much does the inside corner curvature raise the stress, and what throat depth would meet my allowable?",
    "description": "Check of the throat section of an open-gap C-frame (press frame, punch frame, clamp or hook-shaped bracket) under the working force: direct tension plus bending from the force acting at the gap depth, with the curved-beam stresses at the inner and outer fibres from the neutral-axis shift (as the curved beam tool), the straight-beam combined stress for comparison (as the combined axial and bending stress tool), the curvature factor, and the throat depth needed to bring the inner fibre to your allowable.",
    "keywords": [
      "MAKEOS",
      "C-frame",
      "press frame",
      "throat stress",
      "curved beam",
      "gap frame",
      "combined stress"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Working force across the gap",
        "type": "number",
        "default": 200,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Gap depth (load line to inner face of throat)",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Throat depth (inner to outer face)",
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
        "key": "b",
        "label": "Throat width (total plate thickness)",
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
        "key": "ri",
        "label": "Inner radius of the throat corner",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable stress",
        "type": "number",
        "default": 120,
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
    "id": "bolt-pattern-hole-plan",
    "name": "Bolt Pattern Hole Plan (Layout, Clearance Holes, Position Tolerance)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "For this bolt circle, where do the holes go, are the ligaments, edge distances and wrench clearance enough with the holes at their largest size, and what position tolerance can I allow on the holes?",
    "description": "Plan for a circular bolt pattern with clearance holes: hole coordinates, chord between adjacent holes, ligament, edge distances and wrench clearance with the holes at their largest (least-material) size (as the bolt circle layout tool), and the position tolerance at maximum material for floating or fixed fasteners with the bonus available at the largest hole (as the fastener position tolerance tool), checked against the least tolerance your shop can hold.",
    "keywords": [
      "MAKEOS",
      "bolt pattern",
      "bolt circle",
      "position tolerance",
      "clearance hole",
      "floating fastener",
      "flange layout"
    ],
    "fields": [
      {
        "key": "BCD",
        "label": "Bolt circle diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of holes",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 2,
        "max": 360,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "start",
        "label": "Angle of the first hole",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Fastener at MMC (largest fastener)",
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
        "key": "Hm",
        "label": "Clearance hole at MMC (smallest hole)",
        "type": "number",
        "default": 11,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hl",
        "label": "Clearance hole at LMC (largest hole)",
        "type": "number",
        "default": 11.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mode",
        "label": "Fastener case",
        "type": "select",
        "default": "floating",
        "options": [
          [
            "floating",
            "Floating (clearance holes in both parts)"
          ],
          [
            "fixed",
            "Fixed (one part threaded or pressed)"
          ]
        ]
      },
      {
        "key": "share",
        "label": "Share of total tolerance to the clearance-hole part (fixed)",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_flange_and_limits",
        "label": "Flange and limits",
        "type": "heading"
      },
      {
        "key": "OD",
        "label": "Flange outside diameter",
        "type": "number",
        "default": 140,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ID",
        "label": "Flange bore (0 = solid)",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wrench",
        "label": "Socket or wrench clearance diameter",
        "type": "number",
        "default": 24,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minLig",
        "label": "Least ligament between holes",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minEdge",
        "label": "Least edge distance (hole edge to flange edge)",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minTol",
        "label": "Least position tolerance the shop can hold",
        "type": "number",
        "default": 0.2,
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
    "id": "interference-fit-limits-check",
    "name": "Interference Fit Limits Check (IT Grades, Least and Most Interference, Torque, Stress)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "With the hole and shaft tolerances I have chosen, will the fit still hold the torque at its least interference, and will the hub be overstressed at its most?",
    "description": "Check of an interference fit over its full tolerance range: the hole and shaft tolerances from the IT grades for the size (as the ISO tolerance grade tool), with a basic hole and your shaft lower deviation; the least and most interference; contact pressure and holding torque at the least interference against the torque times your slip factor; hub stress and safety factor at the most interference; press-in force and heating temperature for assembly at the most (as the press and shrink fit tool).",
    "keywords": [
      "MAKEOS",
      "interference fit",
      "press fit",
      "shrink fit",
      "IT grade",
      "holding torque",
      "fit limits"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nominal interface diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gh",
        "label": "Hole tolerance grade (basic hole, lower deviation 0)",
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
      },
      {
        "key": "gs",
        "label": "Shaft tolerance grade",
        "type": "select",
        "default": "6",
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
      },
      {
        "key": "ei",
        "label": "Shaft lower deviation (your fit)",
        "type": "number",
        "default": 45,
        "unit": "µm",
        "min": -1000,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_hub_shaft_and_materials",
        "label": "Hub, shaft and materials",
        "type": "heading"
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
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Hub expansion coefficient",
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
        "key": "clear",
        "label": "Assembly clearance when heated",
        "type": "number",
        "default": 0.03,
        "unit": "mm",
        "min": 0,
        "max": 10,
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
        "key": "Treq",
        "label": "Torque to transmit",
        "type": "number",
        "default": 500,
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
      }
    ]
  },
  {
    "id": "pontoon-float-check",
    "name": "Pontoon Float Check (Draft, Freeboard, Reserve Buoyancy)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How deep will this raft of cylindrical drums float with its load, how much freeboard is left, and how much reserve buoyancy is there?",
    "description": "Check of a float or raft supported on horizontal cylindrical drums or pipes: the total buoyancy of the fully submerged drums against the weight (as the buoyancy tool), the water volume to be displaced, the immersed segment area per drum and the draft found by solving the circular segment area (as the circular segment tool), freeboard, and reserve buoyancy, checked against your least freeboard and reserve.",
    "keywords": [
      "MAKEOS",
      "pontoon",
      "float",
      "buoyancy",
      "draft",
      "freeboard",
      "drum raft"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of drums",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "D",
        "label": "Drum diameter",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Drum length",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mDrum",
        "label": "Mass of each drum",
        "type": "number",
        "default": 25,
        "unit": "kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mDeck",
        "label": "Deck and frame mass",
        "type": "number",
        "default": 300,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pay",
        "label": "Payload",
        "type": "number",
        "default": 600,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Water density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 500,
        "max": 1500,
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
        "key": "minFb",
        "label": "Least freeboard",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minRes",
        "label": "Least reserve buoyancy",
        "type": "number",
        "default": 100,
        "unit": "%",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "spade-drilling-plan",
    "name": "Spade Drilling Plan (Speed, Power, Thrust, Time)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "At my cutting speed and feed, what power and thrust does this spade drill need, will the machine take it, and how long is each hole?",
    "description": "Plan for drilling a large hole with a spade drill: spindle speed from the cutting speed held to the machine maximum, metal removal rate, cutting and motor power with a tool wear allowance and thrust (as the spade drilling power tool), drilling time for the depth plus approach, checked against the motor power and the machine’s thrust limit.",
    "keywords": [
      "MAKEOS",
      "spade drill",
      "large hole drilling",
      "drilling thrust",
      "drilling power",
      "drill feed",
      "cycle time"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Drill diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 30,
        "unit": "m/min",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.3,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Hole depth",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "appr",
        "label": "Approach and breakthrough",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ukw",
        "label": "Unit power of the material",
        "type": "number",
        "default": 0.0359,
        "unit": "kW per cm³/min",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "em",
        "label": "Machine mechanical efficiency",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dull",
        "label": "Allowance for tool wear",
        "type": "number",
        "default": 25,
        "unit": "%",
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
        "key": "nmax",
        "label": "Largest spindle speed",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "avail",
        "label": "Motor power available",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thrustMax",
        "label": "Largest feed thrust",
        "type": "number",
        "default": 20000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "thrust-pad-bearing-check",
    "name": "Thrust Pad Bearing Check (Unit Load, PV, Friction Loss, Oil Flow)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "Is this thrust bearing’s unit load and PV within limits, how much power does friction waste, and how much oil must flow through it to carry the heat away?",
    "description": "Check of a flat or tilting-pad thrust bearing: pad area from the ring and pad coverage, unit load, mean sliding velocity and PV (as the thrust bearing pad tool) against your allowable values, friction power loss from the friction coefficient, and the oil flow needed to remove that heat for the allowed oil temperature rise (as the coolant flow for a heat load tool) against the oil supply.",
    "keywords": [
      "MAKEOS",
      "thrust bearing",
      "PV value",
      "unit load",
      "friction loss",
      "oil flow",
      "tilting pad"
    ],
    "fields": [
      {
        "key": "Do",
        "label": "Outside diameter",
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
        "key": "Di",
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
        "key": "fill",
        "label": "Pad coverage of the ring",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Thrust load",
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
      },
      {
        "key": "mu",
        "label": "Friction coefficient",
        "type": "number",
        "default": 0.005,
        "unit": "",
        "min": 0.0001,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_oil",
        "label": "Oil",
        "type": "heading"
      },
      {
        "key": "dT",
        "label": "Allowed oil temperature rise",
        "type": "number",
        "default": 15,
        "unit": "K",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Oil specific heat",
        "type": "number",
        "default": 1.88,
        "unit": "kJ/(kg·K)",
        "min": 0.000001,
        "max": 10,
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
        "max": 2000,
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
        "key": "Pallow",
        "label": "Allowable unit load",
        "type": "number",
        "default": 2,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PVallow",
        "label": "Allowable PV",
        "type": "number",
        "default": 20,
        "unit": "MPa·m/s",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "supply",
        "label": "Oil supply available",
        "type": "number",
        "default": 5,
        "unit": "L/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "tube-post-eccentric-check",
    "name": "Tube Post with Eccentric Load (Section, Secant Formula, Load Factor)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "Is this round tube post or column safe under a load applied off its centreline, and how much more load would bring it to yield?",
    "description": "Check of a round tube post or strut carrying an axial load at an eccentricity (a bracket, a sign arm or an offset beam seat): area, second moment, radius of gyration and slenderness of the tube, Euler buckling load, and the secant-formula peak stress and load factor to first yield (as the eccentrically loaded column tool), checked against your load factor and slenderness limit.",
    "keywords": [
      "MAKEOS",
      "eccentric load",
      "tube column",
      "secant formula",
      "post",
      "strut",
      "buckling"
    ],
    "fields": [
      {
        "key": "OD",
        "label": "Tube outside diameter",
        "type": "number",
        "default": 114.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Wall thickness",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length",
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
        "key": "K",
        "label": "Effective length factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Axial load",
        "type": "number",
        "default": 20000,
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
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 100000,
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
      },
      {
        "key": "slMax",
        "label": "Largest slenderness KL/r",
        "type": "number",
        "default": 200,
        "unit": "",
        "min": 10,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hot-surface-insulation-check",
    "name": "Hot Surface Insulation Check (Bare Loss, Insulated Loss, Touch Temperature, Payback)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much heat does this hot surface lose bare and with insulation, is the insulated surface safe to touch, and how quickly does the insulation pay for itself?",
    "description": "Check of insulation for a hot flat surface (tank wall, oven casing, duct): bare-surface loss by radiation (as the radiant heat loss tool) plus convection, insulated loss through the insulation and the outer surface film (as the layered wall heat flow tool), the outer surface temperature against your touch limit, the yearly energy saving and the payback of the insulation cost.",
    "keywords": [
      "MAKEOS",
      "insulation",
      "heat loss",
      "surface temperature",
      "radiant heat",
      "energy saving",
      "payback"
    ],
    "fields": [
      {
        "key": "area",
        "label": "Surface area",
        "type": "number",
        "default": 10,
        "unit": "m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ts",
        "label": "Hot surface temperature",
        "type": "number",
        "default": 200,
        "unit": "°C",
        "min": -100,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ta",
        "label": "Surroundings temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -60,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Emissivity of the bare surface",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hc",
        "label": "Convection coefficient of the bare surface",
        "type": "number",
        "default": 8,
        "unit": "W/(m²·K)",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_insulation",
        "label": "Insulation",
        "type": "heading"
      },
      {
        "key": "t",
        "label": "Insulation thickness",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Insulation conductivity",
        "type": "number",
        "default": 0.04,
        "unit": "W/(m·K)",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hout",
        "label": "Outer surface film coefficient (convection + radiation)",
        "type": "number",
        "default": 10,
        "unit": "W/(m²·K)",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_costs_and_limits",
        "label": "Costs and limits",
        "type": "heading"
      },
      {
        "key": "hours",
        "label": "Hours hot per year",
        "type": "number",
        "default": 6000,
        "unit": "h",
        "min": 0.000001,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Heat energy price",
        "type": "number",
        "default": 0.08,
        "unit": "$/kWh",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cost",
        "label": "Insulation cost per square metre",
        "type": "number",
        "default": 60,
        "unit": "$/m²",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "touch",
        "label": "Largest outer surface temperature",
        "type": "number",
        "default": 55,
        "unit": "°C",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "payMax",
        "label": "Longest payback accepted",
        "type": "number",
        "default": 3,
        "unit": "years",
        "min": 0.1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "plug-gauge-plan",
    "name": "Limit Gauge Plan (IT Tolerance, Go and No-Go Sizes, Makeability)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "For this size and tolerance grade, what are the work limits, what go and no-go gauge sizes do I order, and is the gauge tolerance large enough to make?",
    "description": "Plan for go and no-go limit gauges for a hole or shaft: the IT tolerance for the size and grade (as the ISO tolerance grade tool) placed by your fundamental deviation (lower deviation of a hole, upper deviation of a shaft), the go and no-go gauge size ranges with gauge tolerance and go-gauge wear allowance as shares of the work tolerance (as the go and no-go gauge tool), and a check that the gauge tolerance is not smaller than your gauge maker can hold.",
    "keywords": [
      "MAKEOS",
      "limit gauge",
      "plug gauge",
      "ring gauge",
      "go no-go",
      "IT grade",
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
        "key": "size",
        "label": "Nominal size",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
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
      },
      {
        "key": "dev",
        "label": "Fundamental deviation (hole lower, shaft upper)",
        "type": "number",
        "default": 0,
        "unit": "µm",
        "min": -5000,
        "max": 5000,
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
      },
      {
        "key": "minG",
        "label": "Smallest gauge tolerance your gauge maker holds",
        "type": "number",
        "default": 1,
        "unit": "µm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
