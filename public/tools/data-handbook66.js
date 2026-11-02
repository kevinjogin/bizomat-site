// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook66) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "screw-clamp-force-check",
    "name": "Screw Clamp Force Check (Handle Torque, Clamping Force, Screw Stress)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "For a screw clamp, vice or press screw turned by a handle, what clamping force does the handle effort produce, and is the screw stressed within limits?",
    "description": "Check of a hand-operated clamping screw: the torque from the handle effort and its radius, the clamping force that torque produces through the thread and the swivel pad or collar friction (the power screw torque relation solved for the load, as the power screw torque tool), the compressive stress at the screw root, and whether the screw stays put, against the clamping force you need and the allowable stress.",
    "keywords": [
      "MAKEOS",
      "screw clamp",
      "vice",
      "clamping force",
      "power screw",
      "handle torque",
      "swivel pad"
    ],
    "fields": [
      {
        "key": "Fh",
        "label": "Handle effort",
        "type": "number",
        "default": 150,
        "unit": "N",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rh",
        "label": "Handle radius (screw axis to hand)",
        "type": "number",
        "default": 75,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dm",
        "label": "Mean (pitch) diameter of thread",
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
        "key": "lead",
        "label": "Lead",
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
        "default": 0.15,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dc",
        "label": "Mean pad (collar) diameter",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "muc",
        "label": "Pad friction coefficient",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0,
        "max": 1,
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
        "key": "dr",
        "label": "Screw root diameter",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Allowable compressive stress",
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
        "key": "Freq",
        "label": "Clamping force needed",
        "type": "number",
        "default": 2000,
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
    "id": "scissor-lift-screw-check",
    "name": "Scissor Lift Screw Drive Check (Actuator Force Through the Lift, Screw Torque, Lift Time, Power)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a single-stage scissor lift table raised by a horizontal lead screw, what force does the screw push with at the bottom of the lift, what torque and power does it need, and how long does the lift take?",
    "description": "Check of a scissor lift table driven by a horizontal screw between the bottom pivots: the platform height range from the arm length and angles, the horizontal actuator force from the load (largest at the lowest angle), the screw travel, the torque to drive the screw at the largest force (as the power screw torque tool), the lift time at the screw speed and the drive power, against the torque available and the time allowed.",
    "keywords": [
      "MAKEOS",
      "scissor lift",
      "lift table",
      "lead screw",
      "actuator force",
      "virtual work",
      "lift time"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Load including the platform",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Scissor arm length (pivot to pivot)",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thMin",
        "label": "Lowest arm angle from horizontal",
        "type": "number",
        "default": 10,
        "unit": "°",
        "min": 1,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thMax",
        "label": "Highest arm angle from horizontal",
        "type": "number",
        "default": 50,
        "unit": "°",
        "min": 2,
        "max": 85,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_screw",
        "label": "Screw",
        "type": "heading"
      },
      {
        "key": "dm",
        "label": "Mean (pitch) diameter of thread",
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
        "key": "lead",
        "label": "Lead",
        "type": "number",
        "default": 5,
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
        "default": 0.1,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dc",
        "label": "Mean collar diameter (0 = rolling thrust bearing)",
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
        "key": "muc",
        "label": "Collar friction coefficient",
        "type": "number",
        "default": 0.01,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_drive",
        "label": "Drive",
        "type": "heading"
      },
      {
        "key": "nS",
        "label": "Screw speed",
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
        "key": "Tav",
        "label": "Torque available at the screw",
        "type": "number",
        "default": 80,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tMax",
        "label": "Longest lift time",
        "type": "number",
        "default": 20,
        "unit": "s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rope-drum-fleet-angle-check",
    "name": "Rope Drum and Fleet Angle Check (Fleet Angle, Rope Capacity by Layer, D/d Ratio, Drum Torque)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a winch or hoist drum feeding a rope to a lead sheave, is the fleet angle small enough for even spooling, does the drum hold enough rope, and what torque does the top layer need?",
    "description": "Check of a rope drum and its lead: the fleet angle from half the drum width and the distance to the first sheave, the drum-to-rope diameter ratio, the turns per layer and the rope each layer holds, the rope length needed for the lift and falls plus dead turns, the layers used, and the drum torque on the outermost layer used (as the rope winch drum tool), against your fleet angle limit, least D/d ratio and the layers allowed.",
    "keywords": [
      "MAKEOS",
      "fleet angle",
      "rope drum",
      "winch",
      "spooling",
      "rope capacity",
      "D/d ratio"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Rope pull at the drum",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Drum barrel diameter",
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
        "key": "dr",
        "label": "Rope diameter",
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
        "key": "Ld",
        "label": "Drum width between flanges",
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
        "key": "Ls",
        "label": "Distance from drum to the lead sheave",
        "type": "number",
        "default": 10000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_rope_needed",
        "label": "Rope needed",
        "type": "heading"
      },
      {
        "key": "lift",
        "label": "Lift height",
        "type": "number",
        "default": 20,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "falls",
        "label": "Falls of rope (reeving)",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 24,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "dead",
        "label": "Dead turns left on the drum",
        "type": "number",
        "default": 3,
        "unit": "turns",
        "min": 0,
        "max": 50,
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
        "key": "fleetMax",
        "label": "Largest fleet angle",
        "type": "number",
        "default": 1.5,
        "unit": "°",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratioMin",
        "label": "Least drum ÷ rope diameter",
        "type": "number",
        "default": 18,
        "unit": "",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "layersMax",
        "label": "Most layers allowed",
        "type": "number",
        "default": 3,
        "unit": "layers",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "enclosure-cooling-airflow",
    "name": "Enclosure Cooling Airflow (Heat Load, Wall Losses, Fan Airflow Needed)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For an electrical or control enclosure with equipment giving off heat, how much heat escapes through the walls, and what fan airflow keeps the inside within its temperature limit?",
    "description": "Ventilation of a closed cabinet: the heat lost through the enclosure surface at the temperature difference from a wall heat transfer coefficient, the heat the fan must remove, the mass and volume of air per hour to carry it at the allowed temperature rise (as the heating energy tool, applied to the cooling air), and the fan airflow against the fan you have.",
    "keywords": [
      "MAKEOS",
      "enclosure cooling",
      "cabinet fan",
      "airflow",
      "heat dissipation",
      "control panel",
      "ventilation"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Heat given off inside",
        "type": "number",
        "default": 500,
        "unit": "W",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ta",
        "label": "Highest outside air temperature",
        "type": "number",
        "default": 35,
        "unit": "°C",
        "min": -50,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ti",
        "label": "Highest allowed inside temperature",
        "type": "number",
        "default": 45,
        "unit": "°C",
        "min": -40,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "As",
        "label": "Effective enclosure surface area",
        "type": "number",
        "default": 2,
        "unit": "m²",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Wall heat transfer coefficient",
        "type": "number",
        "default": 5.5,
        "unit": "W/(m²·K)",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Air density",
        "type": "number",
        "default": 1.16,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Air specific heat",
        "type": "number",
        "default": 1.005,
        "unit": "kJ/(kg·K)",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fan",
        "label": "Fan airflow (at its working pressure)",
        "type": "number",
        "default": 150,
        "unit": "m³/h",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ramp-traction-check",
    "name": "Ramp Traction Check (Axle Loads on a Slope, Tractive Force Needed, Grip, Tipping)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Can this vehicle, truck or AGV drive up the ramp loaded without its driven wheels slipping, and does the uphill axle keep enough load not to lift?",
    "description": "Traction check of a two-axle vehicle climbing a ramp: the load on each axle from the weight, its position between the axles, the height of the centre of gravity and the slope, the force to climb (as the inclined plane tool), to overcome rolling resistance (as the rolling resistance tool) and to accelerate, and the grip of the driven axle from the tyre friction, against the force needed and with a check that the uphill axle stays loaded.",
    "keywords": [
      "MAKEOS",
      "ramp",
      "traction",
      "axle load",
      "gradeability",
      "wheel slip",
      "AGV"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Vehicle mass with load",
        "type": "number",
        "default": 2500,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "slope",
        "label": "Ramp slope",
        "type": "number",
        "default": 6,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wb",
        "label": "Wheelbase",
        "type": "number",
        "default": 1500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Centre of gravity behind the front (uphill) axle",
        "type": "number",
        "default": 900,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hcg",
        "label": "Centre of gravity height",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "drive",
        "label": "Driven axle",
        "type": "select",
        "default": "rear",
        "options": [
          [
            "rear",
            "Rear (downhill) axle"
          ],
          [
            "front",
            "Front (uphill) axle"
          ],
          [
            "all",
            "Both axles"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Tyre friction coefficient",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0.05,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Coefficient of rolling resistance",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Wheel radius",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "acc",
        "label": "Starting acceleration",
        "type": "number",
        "default": 0.3,
        "unit": "m/s²",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "two-pump-arrangement-check",
    "name": "Two-Pump Arrangement Check (Parallel or Series Operating Point, Flow Gain, Each Pump’s Duty)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "If I run two identical pumps in parallel or in series on this system, what flow and head do I get compared with one pump, and where does each pump run on its curve?",
    "description": "Operating point of two identical centrifugal pumps in parallel (heads equal, flows add) or in series (flows equal, heads add) on a system curve: the single-pump operating point (as the pump operating point tool), the combined pump curve and its intersection with the system curve, the flow gain over one pump, the flow, head, share of best-efficiency flow and efficiency of each pump, and the total power, against the flow needed.",
    "keywords": [
      "MAKEOS",
      "parallel pumps",
      "series pumps",
      "pump curve",
      "system curve",
      "operating point",
      "duty point"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Arrangement",
        "type": "select",
        "default": "parallel",
        "options": [
          [
            "parallel",
            "Parallel (flows add)"
          ],
          [
            "series",
            "Series (heads add)"
          ]
        ]
      },
      {
        "key": "h_each_pump_at_rated_speed",
        "label": "Each pump at rated speed",
        "type": "heading"
      },
      {
        "key": "H0",
        "label": "Shut-off head",
        "type": "number",
        "default": 50,
        "unit": "m",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qb",
        "label": "Best-efficiency flow",
        "type": "number",
        "default": 400,
        "unit": "L/min",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hb",
        "label": "Head at best efficiency",
        "type": "number",
        "default": 40,
        "unit": "m",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etab",
        "label": "Best efficiency",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 5,
        "max": 95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_system",
        "label": "System",
        "type": "heading"
      },
      {
        "key": "Hs",
        "label": "Static head",
        "type": "number",
        "default": 15,
        "unit": "m",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qd",
        "label": "Known system flow",
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
        "key": "Hd",
        "label": "System head at that flow",
        "type": "number",
        "default": 30,
        "unit": "m",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid density",
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
        "key": "Qreq",
        "label": "Flow needed",
        "type": "number",
        "default": 420,
        "unit": "L/min",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cantilever-rack-arm-check",
    "name": "Cantilever Rack Arm Check (Arm Section, Bending Stress, Tip Deflection, Column Bolts)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For a cantilever racking arm carrying a uniform load, are its bending stress and tip deflection within limits, and can the bolts at the column take the pull?",
    "description": "Check of a cantilever rack arm or bracket with a uniformly spread load: the section properties of an I, T, channel or angle arm (as the section shapes tool), the moment at the column and the tip deflection for a cantilever with a uniform load (as the beam cases tool), the bending stress, and the tension in the top bolts of the moment connection from the lever arm to the bottom bearing point, against your allowable stress, deflection limit and bolt capacity.",
    "keywords": [
      "MAKEOS",
      "cantilever rack",
      "racking arm",
      "cantilever beam",
      "tip deflection",
      "moment connection",
      "bracket bolts"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Total load on the arm (spread evenly)",
        "type": "number",
        "default": 8000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Arm length from the column face",
        "type": "number",
        "default": 900,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_arm_section",
        "label": "Arm section",
        "type": "heading"
      },
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
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Overall width",
        "type": "number",
        "default": 75,
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
        "default": 7,
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
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Modulus of elasticity",
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
        "key": "sA",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 160,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dlim",
        "label": "Tip deflection limit (length ÷)",
        "type": "number",
        "default": 150,
        "unit": "",
        "min": 10,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_column_connection",
        "label": "Column connection",
        "type": "heading"
      },
      {
        "key": "z",
        "label": "Lever arm, top bolts to bottom bearing point",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nb",
        "label": "Top bolts in tension",
        "type": "number",
        "default": 2,
        "unit": "bolts",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Fb",
        "label": "Allowable tension per bolt",
        "type": "number",
        "default": 20000,
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
    "id": "centrifugal-clutch-check",
    "name": "Centrifugal Clutch Check (Engagement Speed, Torque at Running Speed, Idle Clearance)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a centrifugal clutch with spring-held shoes, at what speed does it start to engage, how much torque does it carry at running speed, and will it stay free at idle?",
    "description": "Check of a shoe-type centrifugal clutch: the centrifugal force on each shoe at speed (as the centrifugal force tool), the speed at which it equals the spring force holding the shoe in (engagement speed), the net shoe force and the friction torque at the running speed from the number of shoes, friction coefficient and drum radius, against the torque needed with a service factor and the idle speed at which the clutch must stay disengaged.",
    "keywords": [
      "MAKEOS",
      "centrifugal clutch",
      "clutch shoes",
      "engagement speed",
      "friction torque",
      "drum clutch",
      "idle speed"
    ],
    "fields": [
      {
        "key": "nSh",
        "label": "Number of shoes",
        "type": "number",
        "default": 3,
        "unit": "shoes",
        "min": 1,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "m",
        "label": "Mass of each shoe",
        "type": "number",
        "default": 0.25,
        "unit": "kg",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Radius to the shoe centre of gravity",
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
        "key": "Fs",
        "label": "Spring force holding each shoe in (at contact)",
        "type": "number",
        "default": 250,
        "unit": "N",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rd",
        "label": "Drum inside radius",
        "type": "number",
        "default": 75,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Lining friction coefficient",
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
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "n",
        "label": "Running speed",
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
        "key": "nIdle",
        "label": "Idle speed (must not engage)",
        "type": "number",
        "default": 1200,
        "unit": "rpm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Treq",
        "label": "Torque needed at running speed",
        "type": "number",
        "default": 15,
        "unit": "N·m",
        "min": 0,
        "max": 10000000,
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
      }
    ]
  },
  {
    "id": "expansion-gap-plan",
    "name": "Expansion Gap Plan (Movement over the Temperature Range, Gap at Installation, Restrained Stress)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For a rail, beam, pipe or panel run that must move with temperature, what gap should I set when installing, will it stay within the joint’s range, and what stress would build up if the gap closed?",
    "description": "Plan of an expansion gap for a run fixed at one end: the length change over the temperature range from the expansion coefficient, the gap to set at the installation temperature so a least gap remains at the hottest temperature, the gap at the coldest temperature, the number of gaps needed if the range is too wide for one joint, and the thermal stress and force that would build up if the run were fully restrained (as the thermal stress tool).",
    "keywords": [
      "MAKEOS",
      "expansion gap",
      "thermal expansion",
      "expansion joint",
      "rail gap",
      "thermal stress",
      "installation temperature"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Length free to move to the gap",
        "type": "number",
        "default": 30,
        "unit": "m",
        "min": 0.000001,
        "max": 100000,
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
        "key": "Tmin",
        "label": "Lowest service temperature",
        "type": "number",
        "default": -5,
        "unit": "°C",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Highest service temperature",
        "type": "number",
        "default": 45,
        "unit": "°C",
        "min": -200,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ti",
        "label": "Installation temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -200,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gMin",
        "label": "Least gap at the hottest",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gMax",
        "label": "Largest gap the joint allows",
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
        "key": "h_if_fully_restrained",
        "label": "If fully restrained",
        "type": "heading"
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
  }
]);
