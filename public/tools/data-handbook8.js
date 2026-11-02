// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook8) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "orifice-flow",
    "name": "Orifice and Restrictor Flow",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How much liquid flows through this orifice at this pressure drop, or what drop does a flow cause?",
    "description": "Flow through a sharp-edged orifice, jet or restrictor from the discharge coefficient, diameter and pressure difference, or the pressure drop for a given flow.",
    "keywords": [
      "MAKEOS",
      "orifice",
      "restrictor",
      "flow coefficient",
      "discharge coefficient",
      "pressure drop",
      "jet"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "flow",
        "options": [
          [
            "flow",
            "Flow from pressure drop"
          ],
          [
            "dp",
            "Pressure drop from flow"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Orifice diameter",
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
        "key": "Cd",
        "label": "Discharge coefficient",
        "type": "number",
        "default": 0.62,
        "unit": "",
        "min": 0.1,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pressure drop",
        "type": "number",
        "default": 50,
        "unit": "bar",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Q",
        "label": "Flow (pressure-drop mode)",
        "type": "number",
        "default": 10,
        "unit": "L/min",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Fluid density",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "accumulator-size",
    "name": "Hydraulic Accumulator Size",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What gas-charged accumulator size delivers this volume between the working pressures?",
    "description": "Nominal gas volume of a bladder or piston accumulator to deliver a required oil volume between minimum and maximum working pressures, for isothermal or adiabatic gas behaviour.",
    "keywords": [
      "MAKEOS",
      "accumulator",
      "precharge",
      "bladder",
      "hydraulic energy storage",
      "Boyle",
      "polytropic"
    ],
    "fields": [
      {
        "key": "dV",
        "label": "Oil volume to deliver",
        "type": "number",
        "default": 2,
        "unit": "L",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p0",
        "label": "Gas precharge pressure (gauge)",
        "type": "number",
        "default": 90,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p1",
        "label": "Minimum working pressure (gauge)",
        "type": "number",
        "default": 100,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Maximum working pressure (gauge)",
        "type": "number",
        "default": 200,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Polytropic exponent",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1,
        "max": 1.67,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pipe-friction",
    "name": "Pipe Friction Factor and Pressure Drop",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What friction factor and pressure drop does this flow have in this pipe?",
    "description": "Reynolds number, Darcy friction factor (laminar 64/Re or Colebrook–White for turbulent flow), pressure drop and head loss for a straight pipe plus fittings.",
    "keywords": [
      "MAKEOS",
      "friction factor",
      "Colebrook",
      "Moody",
      "pressure drop",
      "head loss",
      "pipe sizing"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Flow",
        "type": "number",
        "default": 100,
        "unit": "L/min",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pipe inside diameter",
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
        "label": "Pipe length",
        "type": "number",
        "default": 20,
        "unit": "m",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Kinematic viscosity",
        "type": "number",
        "default": 15,
        "unit": "cSt",
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
        "default": 870,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
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
        "key": "K",
        "label": "Sum of fitting loss coefficients",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pump-affinity",
    "name": "Pump and Fan Affinity Laws",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What flow, head and power will this centrifugal pump or fan give at a new speed or impeller size?",
    "description": "Flow, head (pressure) and power of a centrifugal pump or fan at a new speed or trimmed impeller diameter by the affinity laws, with the power saving.",
    "keywords": [
      "MAKEOS",
      "affinity laws",
      "pump speed",
      "VSD",
      "impeller trim",
      "fan laws",
      "energy saving"
    ],
    "fields": [
      {
        "key": "Q1",
        "label": "Present flow",
        "type": "number",
        "default": 60,
        "unit": "m³/h",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "H1",
        "label": "Present head",
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
        "key": "P1",
        "label": "Present shaft power",
        "type": "number",
        "default": 7,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Present speed",
        "type": "number",
        "default": 2900,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n2",
        "label": "New speed",
        "type": "number",
        "default": 2400,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D1",
        "label": "Present impeller diameter",
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
        "key": "D2",
        "label": "New impeller diameter",
        "type": "number",
        "default": 200,
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
    "id": "npsh-available",
    "name": "Pump NPSH Available",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Is the net positive suction head available enough to prevent cavitation?",
    "description": "Net positive suction head available from suction surface pressure, vapour pressure, static height and suction losses, compared with the pump’s required NPSH plus a margin.",
    "keywords": [
      "MAKEOS",
      "NPSH",
      "cavitation",
      "suction head",
      "vapour pressure",
      "pump suction",
      "NPSHr"
    ],
    "fields": [
      {
        "key": "ps",
        "label": "Pressure on the liquid surface (absolute)",
        "type": "number",
        "default": 101.3,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pv",
        "label": "Vapour pressure at pumping temperature",
        "type": "number",
        "default": 2.34,
        "unit": "kPa",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid density",
        "type": "number",
        "default": 998,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Liquid level above pump centreline (negative = below)",
        "type": "number",
        "default": -2,
        "unit": "m",
        "min": -100,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hf",
        "label": "Suction line losses",
        "type": "number",
        "default": 0.8,
        "unit": "m",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "npshr",
        "label": "Pump NPSH required at duty",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Required margin",
        "type": "number",
        "default": 1,
        "unit": "m",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hydraulic-motor",
    "name": "Hydraulic Motor Torque, Speed and Power",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What torque, speed and power will this hydraulic motor give for this flow and pressure?",
    "description": "Output torque, speed and power of a hydraulic motor from displacement, pressure difference, flow and volumetric and mechanical efficiencies.",
    "keywords": [
      "MAKEOS",
      "hydraulic motor",
      "displacement",
      "torque",
      "speed",
      "volumetric efficiency",
      "fluid power"
    ],
    "fields": [
      {
        "key": "Vd",
        "label": "Displacement",
        "type": "number",
        "default": 100,
        "unit": "cm³/rev",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pressure difference across motor",
        "type": "number",
        "default": 150,
        "unit": "bar",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Q",
        "label": "Flow to motor",
        "type": "number",
        "default": 60,
        "unit": "L/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ev",
        "label": "Volumetric efficiency",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "em",
        "label": "Mechanical efficiency",
        "type": "number",
        "default": 92,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pipe-size-velocity",
    "name": "Pipe or Hose Size for a Target Velocity",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What inside diameter keeps this flow at the target velocity?",
    "description": "Minimum inside diameter of a pipe, tube or hose for a flow at a chosen mean velocity, and the velocity in a selected actual bore.",
    "keywords": [
      "MAKEOS",
      "pipe sizing",
      "hose sizing",
      "flow velocity",
      "suction line",
      "pressure line",
      "return line"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Flow",
        "type": "number",
        "default": 80,
        "unit": "L/min",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Target velocity",
        "type": "number",
        "default": 4,
        "unit": "m/s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dActual",
        "label": "Actual inside diameter to check (0 = none)",
        "type": "number",
        "default": 25,
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
    "id": "hydrostatic-force",
    "name": "Hydrostatic Pressure and Tank Wall Force",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What pressure and force does this liquid depth put on a tank wall and floor?",
    "description": "Pressure at depth, resultant force on a vertical rectangular wall and its centre of pressure, and the force on the tank floor, for any liquid.",
    "keywords": [
      "MAKEOS",
      "hydrostatic pressure",
      "tank wall",
      "centre of pressure",
      "liquid head",
      "bund",
      "sump"
    ],
    "fields": [
      {
        "key": "h",
        "label": "Liquid depth",
        "type": "number",
        "default": 2,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
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
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Wall width",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "floor",
        "label": "Floor area",
        "type": "number",
        "default": 6,
        "unit": "m²",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ps",
        "label": "Gas pressure above liquid (gauge)",
        "type": "number",
        "default": 0,
        "unit": "kPa",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "compressor-power",
    "name": "Air Compressor Power",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What shaft power does it take to compress this air flow to this pressure?",
    "description": "Theoretical isothermal and adiabatic power to compress a flow of free air in one or more intercooled stages, and the shaft power with an overall efficiency.",
    "keywords": [
      "MAKEOS",
      "compressor power",
      "adiabatic compression",
      "isothermal",
      "multi-stage",
      "free air delivery",
      "specific power"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Air flow (free air delivery)",
        "type": "number",
        "default": 10,
        "unit": "m³/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Discharge pressure (gauge)",
        "type": "number",
        "default": 7,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p1",
        "label": "Inlet pressure (absolute)",
        "type": "number",
        "default": 1.013,
        "unit": "bar",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stages",
        "label": "Compression stages (intercooled)",
        "type": "number",
        "default": 1,
        "unit": "stages",
        "min": 1,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "k",
        "label": "Ratio of specific heats",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1.01,
        "max": 1.67,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Overall efficiency (adiabatic to shaft)",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "air-leak-cost",
    "name": "Compressed Air Leak Cost",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "How much air does this leak waste, and what does it cost each year?",
    "description": "Air lost through a leak hole by choked-flow theory (or a measured leak flow), the compressor power it uses and its yearly energy cost.",
    "keywords": [
      "MAKEOS",
      "air leak",
      "compressed air cost",
      "leak survey",
      "energy saving",
      "choked flow",
      "specific power"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Equivalent hole diameter",
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
        "key": "p",
        "label": "Line pressure (gauge)",
        "type": "number",
        "default": 7,
        "unit": "bar",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cd",
        "label": "Discharge coefficient",
        "type": "number",
        "default": 0.65,
        "unit": "",
        "min": 0.1,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tair",
        "label": "Line air temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -40,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "measured",
        "label": "Measured leak flow (0 = use hole)",
        "type": "number",
        "default": 0,
        "unit": "L/s free air",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "spec",
        "label": "Compressor specific power",
        "type": "number",
        "default": 6.5,
        "unit": "kW per m³/min",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Pressurised hours per year",
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
        "label": "Electricity price",
        "type": "number",
        "default": 0.25,
        "unit": "AUD/kWh",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "air-receiver",
    "name": "Air Receiver Size",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What receiver volume covers this demand above compressor supply for this time and pressure band?",
    "description": "Receiver volume needed to supply an air deficit (demand above compressor output) for a given time while the pressure falls between two limits, and the time a chosen receiver lasts.",
    "keywords": [
      "MAKEOS",
      "air receiver",
      "compressed air storage",
      "pressure band",
      "peak demand",
      "tank size"
    ],
    "fields": [
      {
        "key": "deficit",
        "label": "Air demand above compressor supply",
        "type": "number",
        "default": 2,
        "unit": "m³/min free air",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Duration of the deficit",
        "type": "number",
        "default": 1,
        "unit": "min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p1",
        "label": "Starting pressure (gauge)",
        "type": "number",
        "default": 8,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Minimum allowed pressure (gauge)",
        "type": "number",
        "default": 6.5,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vactual",
        "label": "Receiver volume to check (0 = none)",
        "type": "number",
        "default": 2,
        "unit": "m³",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gas-law",
    "name": "Gas Volume at Pressure and Temperature",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What volume does this gas occupy at the new pressure and temperature?",
    "description": "Ideal gas conversion of a gas volume or flow between two sets of pressure and temperature, including gauge-to-absolute conversion and free-air to compressed volume.",
    "keywords": [
      "MAKEOS",
      "gas law",
      "Boyle",
      "Charles",
      "free air",
      "compressed volume",
      "normal cubic metres"
    ],
    "fields": [
      {
        "key": "V1",
        "label": "Volume or flow at state 1",
        "type": "number",
        "default": 1,
        "unit": "m³ or m³/min",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p1",
        "label": "Pressure at state 1 (gauge)",
        "type": "number",
        "default": 0,
        "unit": "bar",
        "min": -1.013,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Temperature at state 1",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -273,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Pressure at state 2 (gauge)",
        "type": "number",
        "default": 7,
        "unit": "bar",
        "min": -1.013,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Temperature at state 2",
        "type": "number",
        "default": 30,
        "unit": "°C",
        "min": -273,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "patm",
        "label": "Atmospheric pressure",
        "type": "number",
        "default": 1.013,
        "unit": "bar",
        "min": 0.5,
        "max": 1.1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "depreciation-schedule",
    "name": "Depreciation Schedule",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "How does this asset depreciate each year by straight-line, sum-of-years’-digits or declining balance?",
    "description": "Year-by-year depreciation and book value of an asset by straight-line, sum-of-the-years’-digits or double-declining-balance methods.",
    "keywords": [
      "MAKEOS",
      "depreciation",
      "straight line",
      "declining balance",
      "sum of years digits",
      "book value",
      "asset"
    ],
    "fields": [
      {
        "key": "cost",
        "label": "Asset cost",
        "type": "number",
        "default": 100000,
        "unit": "AUD",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "salvage",
        "label": "Salvage value",
        "type": "number",
        "default": 10000,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "life",
        "label": "Useful life",
        "type": "number",
        "default": 5,
        "unit": "years",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "method",
        "label": "Method",
        "type": "select",
        "default": "sl",
        "options": [
          [
            "sl",
            "Straight line"
          ],
          [
            "syd",
            "Sum of the years’ digits"
          ],
          [
            "ddb",
            "Double declining balance (200% ÷ life)"
          ]
        ]
      }
    ]
  },
  {
    "id": "euac-compare",
    "name": "Equivalent Annual Cost Comparison",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "Which of two machines or options has the lower equivalent uniform annual cost?",
    "description": "Equivalent uniform annual cost (EUAC) and capitalised cost of two alternatives with different first costs, running costs, salvage values and lives, at a discount rate.",
    "keywords": [
      "MAKEOS",
      "EUAC",
      "equivalent annual cost",
      "capital recovery",
      "machine replacement",
      "life cycle cost",
      "capitalised cost"
    ],
    "fields": [
      {
        "key": "rate",
        "label": "Discount rate",
        "type": "number",
        "default": 8,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_option_a",
        "label": "Option A",
        "type": "heading"
      },
      {
        "key": "pA",
        "label": "First cost",
        "type": "number",
        "default": 50000,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aA",
        "label": "Annual operating cost",
        "type": "number",
        "default": 12000,
        "unit": "AUD/yr",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Salvage value",
        "type": "number",
        "default": 5000,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nA",
        "label": "Life",
        "type": "number",
        "default": 5,
        "unit": "years",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_option_b",
        "label": "Option B",
        "type": "heading"
      },
      {
        "key": "pB",
        "label": "First cost",
        "type": "number",
        "default": 80000,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aB",
        "label": "Annual operating cost",
        "type": "number",
        "default": 8000,
        "unit": "AUD/yr",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sB",
        "label": "Salvage value",
        "type": "number",
        "default": 10000,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nB",
        "label": "Life",
        "type": "number",
        "default": 10,
        "unit": "years",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "irr-uneven",
    "name": "Internal Rate of Return (Uneven Cash Flows)",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "What rate of return does this investment earn with these yearly cash flows?",
    "description": "Internal rate of return, NPV at a hurdle rate and payback for an investment with up to eight uneven yearly cash flows, solved by bisection.",
    "keywords": [
      "MAKEOS",
      "IRR",
      "internal rate of return",
      "NPV",
      "payback",
      "capital investment",
      "hurdle rate"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Initial investment",
        "type": "number",
        "default": 120000,
        "unit": "AUD",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hurdle",
        "label": "Hurdle (discount) rate",
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
        "key": "cf1",
        "label": "Net cash flow, year 1",
        "type": "number",
        "default": 20000,
        "unit": "AUD",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cf2",
        "label": "Net cash flow, year 2",
        "type": "number",
        "default": 35000,
        "unit": "AUD",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cf3",
        "label": "Net cash flow, year 3",
        "type": "number",
        "default": 40000,
        "unit": "AUD",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cf4",
        "label": "Net cash flow, year 4",
        "type": "number",
        "default": 40000,
        "unit": "AUD",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cf5",
        "label": "Net cash flow, year 5",
        "type": "number",
        "default": 30000,
        "unit": "AUD",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cf6",
        "label": "Net cash flow, year 6",
        "type": "number",
        "default": 0,
        "unit": "AUD",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cf7",
        "label": "Net cash flow, year 7",
        "type": "number",
        "default": 0,
        "unit": "AUD",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cf8",
        "label": "Net cash flow, year 8",
        "type": "number",
        "default": 0,
        "unit": "AUD",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "interest-factors",
    "name": "Interest and Equivalence Factors",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "What are the compound interest factors for this rate and period?",
    "description": "Single-payment, uniform-series and gradient compound interest factors (F/P, P/F, A/P, P/A, A/F, F/A, A/G, P/G) and the effective annual rate for a nominal rate and compounding frequency.",
    "keywords": [
      "MAKEOS",
      "interest factors",
      "present worth",
      "annuity",
      "capital recovery",
      "effective rate",
      "engineering economics"
    ],
    "fields": [
      {
        "key": "rate",
        "label": "Nominal annual rate",
        "type": "number",
        "default": 8,
        "unit": "%",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of periods (years)",
        "type": "number",
        "default": 10,
        "unit": "years",
        "min": 1,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "m",
        "label": "Compounding periods per year",
        "type": "number",
        "default": 1,
        "unit": "per year",
        "min": 1,
        "max": 365,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "amount",
        "label": "Amount to convert",
        "type": "number",
        "default": 10000,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "normal-out-of-spec",
    "name": "Normal Distribution Out-of-Tolerance",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What fraction of parts will fall outside these limits for this mean and standard deviation?",
    "description": "Fraction and parts per million below the lower and above the upper specification limit for a normally distributed characteristic, with Z values and expected yield.",
    "keywords": [
      "MAKEOS",
      "normal distribution",
      "ppm",
      "out of tolerance",
      "Z score",
      "yield",
      "defect rate"
    ],
    "fields": [
      {
        "key": "mean",
        "label": "Process mean",
        "type": "number",
        "default": 10.02,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sd",
        "label": "Standard deviation",
        "type": "number",
        "default": 0.03,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lsl",
        "label": "Lower specification limit",
        "type": "number",
        "default": 9.9,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "usl",
        "label": "Upper specification limit",
        "type": "number",
        "default": 10.1,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qty",
        "label": "Production quantity",
        "type": "number",
        "default": 10000,
        "unit": "parts",
        "min": 0,
        "max": 1000000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "sample-size-mean",
    "name": "Sample Size to Estimate a Mean",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "How many measurements or tests are needed to estimate the mean within this margin?",
    "description": "Minimum number of tests or measurements to estimate a mean within a chosen margin of error at a confidence level, with an optional finite-population correction.",
    "keywords": [
      "MAKEOS",
      "sample size",
      "minimum number of tests",
      "confidence",
      "margin of error",
      "inspection sampling"
    ],
    "fields": [
      {
        "key": "sd",
        "label": "Expected standard deviation",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Required margin of error (±)",
        "type": "number",
        "default": 0.02,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "conf",
        "label": "Confidence level",
        "type": "select",
        "default": "95",
        "options": [
          [
            "90",
            "90%"
          ],
          [
            "95",
            "95%"
          ],
          [
            "99",
            "99%"
          ]
        ]
      },
      {
        "key": "pop",
        "label": "Population size (0 = very large)",
        "type": "number",
        "default": 0,
        "unit": "items",
        "min": 0,
        "max": 1000000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "two-sample-t",
    "name": "Two-Sample Comparison (t-test)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Is the difference between these two averages statistically significant?",
    "description": "Welch’s two-sample t-test comparing the means of two groups (machines, suppliers, before and after) from their means, standard deviations and sample sizes.",
    "keywords": [
      "MAKEOS",
      "t-test",
      "Welch",
      "significance",
      "compare means",
      "before and after",
      "p-value"
    ],
    "fields": [
      {
        "key": "h_group_1",
        "label": "Group 1",
        "type": "heading"
      },
      {
        "key": "m1",
        "label": "Mean",
        "type": "number",
        "default": 52.3,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s1",
        "label": "Standard deviation",
        "type": "number",
        "default": 2.1,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Sample size",
        "type": "number",
        "default": 15,
        "unit": "items",
        "min": 2,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_group_2",
        "label": "Group 2",
        "type": "heading"
      },
      {
        "key": "m2",
        "label": "Mean",
        "type": "number",
        "default": 50.1,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s2",
        "label": "Standard deviation",
        "type": "number",
        "default": 2.4,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n2",
        "label": "Sample size",
        "type": "number",
        "default": 12,
        "unit": "items",
        "min": 2,
        "max": 10000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_test",
        "label": "Test",
        "type": "heading"
      },
      {
        "key": "alpha",
        "label": "Significance level (two-sided)",
        "type": "select",
        "default": "0.05",
        "options": [
          [
            "0.1",
            "0.10"
          ],
          [
            "0.05",
            "0.05"
          ],
          [
            "0.01",
            "0.01"
          ]
        ]
      }
    ]
  }
]);
