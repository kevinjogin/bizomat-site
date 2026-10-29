// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook77) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "countershaft-bearing-check",
    "name": "Countershaft Bearing Check (Gear Forces, Bearing Loads in Two Planes, L10 Life, Shaft Stress)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a shaft carrying a driven gear and a driving gear between two bearings, what load does each bearing carry, how long will it last, and is the shaft stressed within limits?",
    "description": "Check of a countershaft with two spur gears: the tangential and radial tooth forces on each gear from the torque and pitch diameter (as the gear tooth forces tool), resolved into two planes from the angular position of each mesh, the bearing reactions in both planes and their resultants, the L10 rating life of each bearing (as the bearing L10 life tool) and its static safety factor (as the bearing static ratio tool), and the largest bending moment with the torque giving the combined stress in the shaft, against your life, safety factor and stress limits.",
    "keywords": [
      "MAKEOS",
      "countershaft",
      "bearing loads",
      "gear forces",
      "L10 life",
      "shaft stress",
      "gearbox"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Torque carried by the shaft",
        "type": "number",
        "default": 150,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Shaft speed",
        "type": "number",
        "default": 500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Bearing spacing (A to B)",
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
        "key": "h_driven_gear_power_in_",
        "label": "Driven gear (power in)",
        "type": "heading"
      },
      {
        "key": "d1",
        "label": "Pitch diameter",
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
        "key": "x1",
        "label": "Position from bearing A",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -10000,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "th1",
        "label": "Mesh position angle",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_driving_gear_power_out_",
        "label": "Driving gear (power out)",
        "type": "heading"
      },
      {
        "key": "d2",
        "label": "Pitch diameter",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "Position from bearing A",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": -10000,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "th2",
        "label": "Mesh position angle",
        "type": "number",
        "default": 180,
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bearings_and_shaft",
        "label": "Bearings and shaft",
        "type": "heading"
      },
      {
        "key": "btype",
        "label": "Bearing type",
        "type": "select",
        "default": "ball",
        "options": [
          [
            "ball",
            "Ball (life exponent 3)"
          ],
          [
            "roller",
            "Roller (life exponent 10/3)"
          ]
        ]
      },
      {
        "key": "C",
        "label": "Dynamic load rating C of each bearing",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C0",
        "label": "Static load rating C0 of each bearing",
        "type": "number",
        "default": 16,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lreq",
        "label": "Required L10 life",
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
        "key": "s0req",
        "label": "Required static safety factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ds",
        "label": "Shaft diameter at the gears",
        "type": "number",
        "default": 35,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Allowable combined stress in the shaft",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "carburizing-case-depth-plan",
    "name": "Carburizing Case Depth Plan (Total Case for a Ground Effective Case, Time at Temperature, Furnace Cost)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How deep must a part be carburized so that, after grinding, the effective case it needs remains, how long does that take at temperature, and is the case sensible for the section?",
    "description": "Plan for gas or pack carburizing: the total case depth needed for a finished effective case after grinding stock is removed and the effective case is converted to total case with your ratio, the time at temperature from the parabolic growth of case depth with the square root of time and the case depth factor for the temperature, the total furnace cycle with the heating, diffusion and quench time you enter, the cost per part for a furnace rate and load, and the total case as a share of the half-section against your limit.",
    "keywords": [
      "MAKEOS",
      "carburizing",
      "case depth",
      "case hardening",
      "effective case",
      "heat treatment",
      "grinding allowance"
    ],
    "fields": [
      {
        "key": "h_part",
        "label": "Part",
        "type": "heading"
      },
      {
        "key": "eff",
        "label": "Effective case required after grinding",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stock",
        "label": "Grinding stock on diameter",
        "type": "number",
        "default": 0.3,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Effective case as a share of total case",
        "type": "number",
        "default": 0.7,
        "unit": "",
        "min": 0.1,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sect",
        "label": "Smallest section thickness or diameter",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shareMax",
        "label": "Largest total case as a share of the half-section",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_process",
        "label": "Process",
        "type": "heading"
      },
      {
        "key": "K",
        "label": "Case depth factor at the carburizing temperature",
        "type": "number",
        "default": 0.6,
        "unit": "mm/√h",
        "min": 0.01,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "extra",
        "label": "Heating, diffusion and quench time per cycle",
        "type": "number",
        "default": 3,
        "unit": "h",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Furnace cost rate",
        "type": "number",
        "default": 85,
        "unit": "A$/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "parts",
        "label": "Parts per furnace load",
        "type": "number",
        "default": 120,
        "unit": "",
        "min": 1,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "induction-hardening-plan",
    "name": "Induction Hardening Plan (Reference Depth, Frequency for the Case, Heating Energy and Power)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "For induction hardening a bar to a given case depth, does the generator frequency suit the case, what frequency would, and how much energy and power does heating the surface layer need?",
    "description": "Plan for induction surface hardening of a round bar: the electromagnetic reference (penetration) depth at the generator frequency from the steel's hot resistivity and relative permeability, its ratio to the case depth against your range, the frequency that would put the reference depth at the middle of that range, the bar diameter as a multiple of the reference depth, and the energy to heat the surface layer to the hardening temperature, with the power at the work and from the generator and the surface power density for the heating time you enter.",
    "keywords": [
      "MAKEOS",
      "induction hardening",
      "reference depth",
      "penetration depth",
      "frequency",
      "surface hardening",
      "power density"
    ],
    "fields": [
      {
        "key": "h_part_and_case",
        "label": "Part and case",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Bar diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lh",
        "label": "Heated length",
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
        "key": "case",
        "label": "Case depth required",
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
        "key": "hf",
        "label": "Heated depth as a multiple of the case depth",
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
        "key": "h_electrical",
        "label": "Electrical",
        "type": "heading"
      },
      {
        "key": "f",
        "label": "Generator frequency",
        "type": "number",
        "default": 10,
        "unit": "kHz",
        "min": 0.01,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Steel resistivity at the hardening temperature",
        "type": "number",
        "default": 1.1,
        "unit": "µΩ·m",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mur",
        "label": "Relative permeability while hot",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rMin",
        "label": "Least reference depth as a multiple of the case",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rMax",
        "label": "Largest reference depth as a multiple of the case",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dMin",
        "label": "Least bar diameter as a multiple of the reference depth",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_heating",
        "label": "Heating",
        "type": "heading"
      },
      {
        "key": "T1",
        "label": "Hardening temperature",
        "type": "number",
        "default": 900,
        "unit": "°C",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T0",
        "label": "Starting temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -50,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Mean specific heat over the range",
        "type": "number",
        "default": 0.6,
        "unit": "kJ/(kg·K)",
        "min": 0.1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dens",
        "label": "Steel density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 1000,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "th",
        "label": "Heating time",
        "type": "number",
        "default": 4,
        "unit": "s",
        "min": 0.000001,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Generator to work efficiency",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
