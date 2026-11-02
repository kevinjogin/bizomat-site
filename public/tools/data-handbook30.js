// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook30) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "chuck-grip-force",
    "name": "Lathe Chuck Grip Force and Speed Limit",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How much grip does the chuck need to hold this cut, how much is lost at speed, and how fast can it safely run?",
    "description": "Workholding check for a jaw chuck: cutting and feed forces from the chip area and specific cutting force, the total jaw grip needed to resist the cutting torque and feed force by friction with a safety factor, the grip lost (or gained) to centrifugal force on the jaws at the spindle speed, the static grip to set, and the highest speed at which the chuck’s rated grip still holds the work.",
    "keywords": [
      "MAKEOS",
      "chuck grip force",
      "lathe workholding",
      "centrifugal force jaws",
      "maximum chuck speed",
      "gripping force",
      "jaw chuck"
    ],
    "fields": [
      {
        "key": "h_cut",
        "label": "Cut",
        "type": "heading"
      },
      {
        "key": "dc",
        "label": "Cutting diameter",
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
        "key": "kc",
        "label": "Specific cutting force",
        "type": "number",
        "default": 2000,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Depth of cut",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed",
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
        "key": "ratio",
        "label": "Feed force ÷ cutting force",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_chuck",
        "label": "Chuck",
        "type": "heading"
      },
      {
        "key": "dg",
        "label": "Gripping diameter",
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
        "key": "grip",
        "label": "Gripping",
        "type": "select",
        "default": "od",
        "options": [
          [
            "od",
            "On the outside (jaws close)"
          ],
          [
            "id",
            "On the inside (jaws open)"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Friction at the jaws",
        "type": "number",
        "default": 0.1,
        "unit": "",
        "min": 0.02,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Safety factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "jaws",
        "label": "Number of jaws",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 2,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mj",
        "label": "Mass of each jaw set (base + top jaw)",
        "type": "number",
        "default": 1.5,
        "unit": "kg",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rc",
        "label": "Radius of the jaw centre of gravity",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 50000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fmax",
        "label": "Maximum static grip of the chuck",
        "type": "number",
        "default": 60,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "coolant-system-sizing",
    "name": "Machine Coolant System Sizing",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How much coolant flow, tank volume and pump power does this machine need?",
    "description": "Sizing of a machine-tool coolant system: the flow to carry the cutting heat away at an allowed temperature rise (as the coolant heat-flow tool), the flow the nozzles need for the jet velocity, the governing flow, tank volume for the chosen turnover time, and pump shaft power for the head and efficiency (as the pump power tool).",
    "keywords": [
      "MAKEOS",
      "coolant system",
      "coolant flow",
      "coolant tank size",
      "coolant pump",
      "cutting fluid",
      "heat removal"
    ],
    "fields": [
      {
        "key": "Pc",
        "label": "Cutting power",
        "type": "number",
        "default": 10,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "share",
        "label": "Share of cutting heat into the coolant",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Allowed coolant temperature rise",
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
        "label": "Coolant specific heat",
        "type": "number",
        "default": 4,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Coolant density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nz",
        "label": "Number of nozzles",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 0,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "dz",
        "label": "Nozzle bore",
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
        "key": "vj",
        "label": "Jet velocity",
        "type": "number",
        "default": 10,
        "unit": "m/s",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "turn",
        "label": "Tank turnover time",
        "type": "number",
        "default": 5,
        "unit": "min",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "head",
        "label": "Pump head",
        "type": "number",
        "default": 20,
        "unit": "m",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Pump efficiency",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rotary-index-table-sizing",
    "name": "Rotary Index Table Drive Sizing",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What torque and motor does this rotary index table need to index in time, and what holding torque during machining?",
    "description": "Sizing of a servo or geared index table: table and fixture inertia, index angle from the number of stations, peak speed and acceleration for a cycloidal or trapezoidal move, table and motor torque through the reducer, motor speed, dwell time in the cycle, and the holding torque the clamp or brake must provide against machining forces.",
    "keywords": [
      "MAKEOS",
      "index table",
      "rotary table sizing",
      "dial table",
      "indexing time",
      "servo indexer",
      "holding torque"
    ],
    "fields": [
      {
        "key": "M",
        "label": "Table plate mass",
        "type": "number",
        "default": 80,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Table plate radius",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "st",
        "label": "Stations",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 2,
        "max": 72,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mf",
        "label": "Mass of each fixture and part",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rf",
        "label": "Radius of fixture centres",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ti",
        "label": "Index time",
        "type": "number",
        "default": 0.6,
        "unit": "s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tc",
        "label": "Total cycle time",
        "type": "number",
        "default": 3,
        "unit": "s",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "law",
        "label": "Motion profile",
        "type": "select",
        "default": "cyc",
        "options": [
          [
            "cyc",
            "Cycloidal"
          ],
          [
            "trap",
            "Trapezoidal (⅓ accel, ⅓ cruise, ⅓ decel)"
          ]
        ]
      },
      {
        "key": "Tf",
        "label": "Bearing and seal friction torque",
        "type": "number",
        "default": 5,
        "unit": "N·m",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Reducer ratio",
        "type": "number",
        "default": 50,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Reducer efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jm",
        "label": "Motor inertia",
        "type": "number",
        "default": 0.0005,
        "unit": "kg·m²",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fm",
        "label": "Machining force at the fixture (tangential)",
        "type": "number",
        "default": 2000,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Safety factor on holding",
        "type": "number",
        "default": 2,
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
    "id": "rack-pinion-axis-sizing",
    "name": "Rack and Pinion Axis Sizing",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What pinion torque, motor torque and gear ratio does this rack-and-pinion axis need, and are the teeth strong enough?",
    "description": "Sizing of a rack-and-pinion linear axis (gantry, transfer or vertical axis): forces from friction, gravity on an incline, external load and acceleration, pinion pitch diameter, torque and speed, reducer ratio for the motor speed, motor torque including rotor inertia, and the Lewis tooth bending stress with the velocity factor (as the Lewis bending tool) against an allowable.",
    "keywords": [
      "MAKEOS",
      "rack and pinion",
      "gantry axis",
      "linear axis sizing",
      "pinion torque",
      "Lewis bending",
      "vertical axis"
    ],
    "fields": [
      {
        "key": "h_load_and_motion",
        "label": "Load and motion",
        "type": "heading"
      },
      {
        "key": "mass",
        "label": "Moving mass",
        "type": "number",
        "default": 300,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Guide friction",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fx",
        "label": "External force",
        "type": "number",
        "default": 200,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "incl",
        "label": "Axis inclination from horizontal",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmax",
        "label": "Maximum speed",
        "type": "number",
        "default": 1.5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ta",
        "label": "Acceleration time",
        "type": "number",
        "default": 0.3,
        "unit": "s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_pinion_and_drive",
        "label": "Pinion and drive",
        "type": "heading"
      },
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Pinion teeth",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 10,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b",
        "label": "Face width",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Lewis form factor",
        "type": "number",
        "default": 0.32,
        "unit": "",
        "min": 0.1,
        "max": 0.7,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "make",
        "label": "Tooth quality",
        "type": "select",
        "default": "ground",
        "options": [
          [
            "cast",
            "Cast"
          ],
          [
            "cut",
            "Cut"
          ],
          [
            "hobbed",
            "Hobbed or shaped"
          ],
          [
            "ground",
            "Ground"
          ]
        ]
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "erp",
        "label": "Rack and pinion efficiency",
        "type": "number",
        "default": 97,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Reducer ratio",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eg",
        "label": "Reducer efficiency",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jm",
        "label": "Motor inertia",
        "type": "number",
        "default": 0.002,
        "unit": "kg·m²",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hoist-drive-sizing",
    "name": "Hoist Drive Sizing (Rope, Drum, Gearbox, Motor and Brake)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What rope pull, drum speed, gear ratio, motor and brake does this hoist need?",
    "description": "Sizing of an electric rope hoist: line pull at the drum for the reeving with sheave efficiency and the rope safety factor and D/d ratio (as the wire rope reeving tool), rope and drum speed, drum torque, gearbox ratio for the motor speed, motor power and the next standard rating, and the brake torque at the motor with a safety factor.",
    "keywords": [
      "MAKEOS",
      "hoist design",
      "winch sizing",
      "drum torque",
      "hoist motor",
      "hoist brake",
      "rope reeving"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Load including hook block",
        "type": "number",
        "default": 5000,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Lifting speed",
        "type": "number",
        "default": 8,
        "unit": "m/min",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Parts of rope supporting the load",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 24,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "es",
        "label": "Sheave efficiency (each)",
        "type": "number",
        "default": 98,
        "unit": "%",
        "min": 80,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Drum pitch diameter",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
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
        "max": 100000,
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
        "min": 2,
        "max": 15,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dd",
        "label": "Required D/d ratio",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 5,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eg",
        "label": "Gearbox efficiency",
        "type": "number",
        "default": 94,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "poles",
        "label": "Motor poles (50 Hz)",
        "type": "select",
        "default": "4",
        "options": [
          [
            "2",
            "2-pole"
          ],
          [
            "4",
            "4-pole"
          ],
          [
            "6",
            "6-pole"
          ],
          [
            "8",
            "8-pole"
          ]
        ]
      },
      {
        "key": "slip",
        "label": "Motor slip",
        "type": "number",
        "default": 4,
        "unit": "%",
        "min": 0,
        "max": 15,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bf",
        "label": "Brake safety factor",
        "type": "number",
        "default": 1.75,
        "unit": "",
        "min": 1,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "furnace-heat-treat-plan",
    "name": "Heat-Treatment Furnace Load Plan (Time, Energy, Cost)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How long will this load take to heat, how much energy will the cycle use, and what does it cost per kilogram?",
    "description": "Energy plan for a furnace heat-treatment cycle: energy to heat the load and its fixtures through the temperature range from mean specific heat (as the heating energy tool), heat-up time from the furnace power and the share reaching the load, standing losses during the soak, total energy, cost per load and cost per kilogram of work.",
    "keywords": [
      "MAKEOS",
      "heat treatment cost",
      "furnace energy",
      "heat-up time",
      "soak time",
      "hardening furnace",
      "energy per kg"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Work mass",
        "type": "number",
        "default": 500,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fix",
        "label": "Fixture and basket mass",
        "type": "number",
        "default": 100,
        "unit": "kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Mean specific heat over the range",
        "type": "number",
        "default": 0.6,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T0",
        "label": "Start temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -50,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Set temperature",
        "type": "number",
        "default": 850,
        "unit": "°C",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Furnace input power",
        "type": "number",
        "default": 60,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Share of input reaching the load while heating",
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
        "key": "loss",
        "label": "Standing heat loss at temperature",
        "type": "number",
        "default": 6,
        "unit": "kW",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "soak",
        "label": "Soak time",
        "type": "number",
        "default": 1,
        "unit": "h",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Energy price",
        "type": "number",
        "default": 0.25,
        "unit": "$/kWh",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "crank-press-capacity",
    "name": "Mechanical (Crank) Press Capacity Above Bottom",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How much force can this crank press deliver at the height where my operation happens, and is it enough?",
    "description": "Force available from a crank press at any height above bottom dead centre: the slider-crank geometry gives the slide position against crank angle, the rated crankshaft torque follows from the rated force at the rating point, and the available force at the working height is that torque divided by the slide’s mechanical advantage there (capped at the frame rating), with the energy of the working stroke.",
    "keywords": [
      "MAKEOS",
      "press capacity",
      "tonnage curve",
      "crank press",
      "rated tonnage point",
      "slider crank",
      "press selection"
    ],
    "fields": [
      {
        "key": "Fr",
        "label": "Rated force",
        "type": "number",
        "default": 1000,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hr",
        "label": "Rating point above bottom",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S",
        "label": "Stroke",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Connecting rod length",
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
        "key": "Fw",
        "label": "Force needed by the operation",
        "type": "number",
        "default": 800,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hw",
        "label": "Height above bottom where the force starts",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dw",
        "label": "Working distance (until bottom)",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ef",
        "label": "Flywheel energy available per stroke",
        "type": "number",
        "default": 10,
        "unit": "kJ",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pipe-expansion-loop",
    "name": "Pipe Thermal Expansion, Anchor Force and Expansion Loop",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How much will this pipe run grow when hot, what force would fully restrained anchors see, and how long must the loop legs be?",
    "description": "Thermal expansion of a straight pipe run between anchors, the force and stress if it were fully restrained (as the thermal stress tool), and the leg length of an L-bend or U-loop needed to absorb the growth within an allowable bending stress range by the guided-cantilever method.",
    "keywords": [
      "MAKEOS",
      "pipe expansion",
      "expansion loop",
      "anchor force",
      "thermal growth",
      "guided cantilever",
      "steam pipe"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Pipe run between anchors",
        "type": "number",
        "default": 50,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Expansion coefficient",
        "type": "number",
        "default": 12,
        "unit": "µm/m·K",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Temperature change",
        "type": "number",
        "default": 150,
        "unit": "K",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "OD",
        "label": "Pipe outside diameter",
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
        "key": "wt",
        "label": "Wall thickness",
        "type": "number",
        "default": 6.02,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
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
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sa",
        "label": "Allowable bending stress range",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "type",
        "label": "Absorbed by",
        "type": "select",
        "default": "U",
        "options": [
          [
            "L",
            "An L-bend (one leg takes the whole growth)"
          ],
          [
            "U",
            "A U-loop at mid-run (growth shared from both sides)"
          ]
        ]
      }
    ]
  },
  {
    "id": "gear-backlash-temperature",
    "name": "Gear Backlash at Operating Temperature",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "How much backlash will this gear pair have when the housing and gears warm up, and could it jam?",
    "description": "Change in circular backlash of a spur gear pair when the housing and the gears expand differently: the change in centre distance of the housing bores, the growth of the gears’ pitch radii, the net change in operating centre distance and the resulting change in backlash (2 Δa tan φ), giving the hot backlash and a jamming check.",
    "keywords": [
      "MAKEOS",
      "gear backlash",
      "thermal backlash",
      "aluminium gearbox",
      "centre distance change",
      "gear jamming",
      "operating backlash"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Pinion teeth",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 6,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Gear teeth",
        "type": "number",
        "default": 60,
        "unit": "",
        "min": 6,
        "max": 2000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "phi",
        "label": "Pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 35,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "j0",
        "label": "Cold circular backlash",
        "type": "number",
        "default": 0.08,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ah",
        "label": "Housing expansion coefficient",
        "type": "number",
        "default": 23,
        "unit": "µm/m·K",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTh",
        "label": "Housing temperature rise",
        "type": "number",
        "default": 50,
        "unit": "K",
        "min": -100,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ag",
        "label": "Gear expansion coefficient",
        "type": "number",
        "default": 11.5,
        "unit": "µm/m·K",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTg",
        "label": "Gear temperature rise",
        "type": "number",
        "default": 70,
        "unit": "K",
        "min": -100,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
