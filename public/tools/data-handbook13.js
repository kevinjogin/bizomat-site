// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook13) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "bearing-friction",
    "name": "Rolling Bearing Friction Torque and Heat",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "How much friction torque and heat does this rolling bearing produce?",
    "description": "Approximate friction torque, power loss and heat of a rolling bearing from its load, bore and a friction coefficient for the bearing type.",
    "keywords": [
      "MAKEOS",
      "bearing friction",
      "power loss",
      "bearing heat",
      "friction coefficient",
      "rolling bearing"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Bearing load",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Bore diameter",
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
        "key": "mu",
        "label": "Friction coefficient for the bearing type",
        "type": "number",
        "default": 0.0015,
        "unit": "",
        "min": 0.0005,
        "max": 0.05,
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
        "key": "n",
        "label": "Number of bearings",
        "type": "number",
        "default": 2,
        "unit": "bearings",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "oil-viscosity-temperature",
    "name": "Oil Viscosity at Temperature",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What is this oil’s viscosity at the operating temperature?",
    "description": "Kinematic viscosity of a lubricating or hydraulic oil at any temperature from two known points (usually 40 °C and 100 °C) by the ASTM D341 (Walther) relation.",
    "keywords": [
      "MAKEOS",
      "viscosity",
      "oil temperature",
      "ISO VG",
      "Walther",
      "ASTM D341",
      "hydraulic oil"
    ],
    "fields": [
      {
        "key": "T1",
        "label": "First known temperature",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": -60,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v1",
        "label": "Viscosity at first temperature",
        "type": "number",
        "default": 46,
        "unit": "cSt",
        "min": 0.5,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Second known temperature",
        "type": "number",
        "default": 100,
        "unit": "°C",
        "min": -60,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v2",
        "label": "Viscosity at second temperature",
        "type": "number",
        "default": 6.8,
        "unit": "cSt",
        "min": 0.5,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Operating temperature",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -60,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "rim-face-alignment",
    "name": "Rim and Face Shaft Alignment Corrections",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "How many shims should go under each foot of the movable machine to correct this misalignment?",
    "description": "Vertical (or horizontal) offset and angularity from rim and face dial indicator readings, and the correction at the front and back feet of the movable machine.",
    "keywords": [
      "MAKEOS",
      "shaft alignment",
      "rim and face",
      "dial indicator",
      "shims",
      "coupling alignment",
      "soft foot"
    ],
    "fields": [
      {
        "key": "rim",
        "label": "Rim reading at 6 o’clock (zeroed at 12)",
        "type": "number",
        "default": 0.3,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "face",
        "label": "Face reading at 6 o’clock (zeroed at 12)",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dia",
        "label": "Diameter of the face reading circle",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "front",
        "label": "Coupling to front foot of movable machine",
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
        "key": "back",
        "label": "Coupling to back foot of movable machine",
        "type": "number",
        "default": 650,
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
    "id": "motor-slip",
    "name": "Induction Motor Synchronous Speed, Slip and Load",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What is this motor’s synchronous speed and slip, and roughly how loaded is it?",
    "description": "Synchronous speed from supply frequency and poles, slip at a measured speed, and an estimate of load from slip compared with rated slip.",
    "keywords": [
      "MAKEOS",
      "induction motor",
      "slip",
      "synchronous speed",
      "poles",
      "motor load",
      "tachometer"
    ],
    "fields": [
      {
        "key": "f",
        "label": "Supply frequency",
        "type": "number",
        "default": 50,
        "unit": "Hz",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "poles",
        "label": "Number of poles",
        "type": "select",
        "default": "4",
        "options": [
          [
            "2",
            "2"
          ],
          [
            "4",
            "4"
          ],
          [
            "6",
            "6"
          ],
          [
            "8",
            "8"
          ],
          [
            "10",
            "10"
          ],
          [
            "12",
            "12"
          ]
        ]
      },
      {
        "key": "n",
        "label": "Measured speed",
        "type": "number",
        "default": 1475,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nRated",
        "label": "Nameplate (rated) speed",
        "type": "number",
        "default": 1460,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "water-hammer",
    "name": "Water Hammer Pressure Surge",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How big a pressure surge will closing this valve cause?",
    "description": "Pressure wave speed in a pipe, the Joukowsky surge for a fast valve closure, the critical closure time, and the reduced surge for slower closure.",
    "keywords": [
      "MAKEOS",
      "water hammer",
      "surge pressure",
      "Joukowsky",
      "valve closure",
      "pressure transient",
      "wave speed"
    ],
    "fields": [
      {
        "key": "dv",
        "label": "Velocity change",
        "type": "number",
        "default": 2,
        "unit": "m/s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Pipe length to the reservoir or open end",
        "type": "number",
        "default": 200,
        "unit": "m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tc",
        "label": "Valve closing time",
        "type": "number",
        "default": 1,
        "unit": "s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Pipe inside diameter",
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
        "label": "Pipe wall thickness",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Pipe elastic modulus",
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
        "key": "K",
        "label": "Fluid bulk modulus",
        "type": "number",
        "default": 2.2,
        "unit": "GPa",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Fluid density",
        "type": "number",
        "default": 998,
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
    "id": "coolant-flow-heat",
    "name": "Coolant Flow for a Heat Load",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What flow of water or oil removes this heat load for the allowed temperature rise?",
    "description": "Liquid flow needed to carry away a heat load at a given temperature rise, or the temperature rise for a given flow, for water, glycol mixtures or oil.",
    "keywords": [
      "MAKEOS",
      "cooling water",
      "heat load",
      "temperature rise",
      "oil cooler",
      "chiller",
      "flow rate"
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
            "Flow for a temperature rise"
          ],
          [
            "rise",
            "Temperature rise for a flow"
          ]
        ]
      },
      {
        "key": "kW",
        "label": "Heat load",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Allowed temperature rise",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Q",
        "label": "Flow (rise mode)",
        "type": "number",
        "default": 40,
        "unit": "L/min",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Specific heat of fluid",
        "type": "number",
        "default": 4.18,
        "unit": "kJ/(kg·K)",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Fluid density",
        "type": "number",
        "default": 998,
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
    "id": "air-pipe-drop",
    "name": "Compressed Air Pipe Pressure Drop",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What pressure drop does this compressed air flow cause in this pipe?",
    "description": "Pressure drop in a compressed air line from free-air flow, line pressure, pipe size and length, using the Darcy–Weisbach method with air density at line pressure and a Colebrook friction factor.",
    "keywords": [
      "MAKEOS",
      "compressed air",
      "pressure drop",
      "pipe sizing",
      "air main",
      "ring main",
      "Darcy"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Air flow (free air delivery)",
        "type": "number",
        "default": 5,
        "unit": "m³/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pipe inside diameter",
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
        "label": "Equivalent pipe length (including fittings)",
        "type": "number",
        "default": 100,
        "unit": "m",
        "min": 0.000001,
        "max": 1000000,
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
        "key": "T",
        "label": "Air temperature",
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
        "key": "eps",
        "label": "Pipe roughness",
        "type": "number",
        "default": 0.045,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pneumatic-cylinder-force",
    "name": "Pneumatic Cylinder Force and Bore Selection",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What force does this air cylinder give, and is the bore large enough for the load?",
    "description": "Extend and retract forces of a double-acting pneumatic cylinder, the load ratio against a recommended limit, and the smallest bore that meets it.",
    "keywords": [
      "MAKEOS",
      "pneumatic cylinder",
      "cylinder force",
      "bore size",
      "load ratio",
      "air cylinder sizing"
    ],
    "fields": [
      {
        "key": "bore",
        "label": "Bore",
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
        "key": "rod",
        "label": "Rod diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Supply pressure (gauge)",
        "type": "number",
        "default": 6,
        "unit": "bar",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Efficiency (seal friction)",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "load",
        "label": "Load force to move",
        "type": "number",
        "default": 600,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Maximum load ratio",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vacuum-cup",
    "name": "Vacuum Cup Holding Force",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "Will these suction cups hold this part during handling?",
    "description": "Holding force of vacuum suction cups from cup diameter, vacuum level and number of cups, compared with the force needed for horizontal lifting or vertical (shear) handling with acceleration and a safety factor.",
    "keywords": [
      "MAKEOS",
      "vacuum cup",
      "suction cup",
      "vacuum gripper",
      "end effector",
      "pick and place",
      "holding force"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Cup effective diameter",
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
        "key": "n",
        "label": "Number of cups",
        "type": "number",
        "default": 4,
        "unit": "cups",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "vac",
        "label": "Vacuum level (below atmospheric)",
        "type": "number",
        "default": 60,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Part mass",
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
        "key": "accel",
        "label": "Acceleration during handling",
        "type": "number",
        "default": 5,
        "unit": "m/s²",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "orient",
        "label": "Load direction",
        "type": "select",
        "default": "horizontal",
        "options": [
          [
            "horizontal",
            "Horizontal part, lifted vertically (tension)"
          ],
          [
            "vertical",
            "Vertical part (shear on the cups)"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Friction coefficient cup to part (vertical)",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0.05,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sf",
        "label": "Safety factor",
        "type": "number",
        "default": 2,
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
    "id": "valve-flow-coefficient",
    "name": "Valve Flow Coefficient (Kv and Cv)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What Kv does this valve need for the flow and pressure drop, or what flow will a valve pass?",
    "description": "Valve flow coefficient Kv (and Cv) for a liquid from flow, pressure drop and specific gravity, or the flow through a valve of known Kv.",
    "keywords": [
      "MAKEOS",
      "Kv",
      "Cv",
      "valve sizing",
      "control valve",
      "flow coefficient",
      "pressure drop"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "kv",
        "options": [
          [
            "kv",
            "Kv needed for a flow and pressure drop"
          ],
          [
            "flow",
            "Flow through a known Kv"
          ]
        ]
      },
      {
        "key": "Q",
        "label": "Flow",
        "type": "number",
        "default": 10,
        "unit": "m³/h",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pressure drop across the valve",
        "type": "number",
        "default": 0.5,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kv",
        "label": "Valve Kv (flow mode)",
        "type": "number",
        "default": 20,
        "unit": "m³/h",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sg",
        "label": "Specific gravity of the liquid",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "radiant-heat",
    "name": "Radiant Heat Loss",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much heat does this hot surface radiate to its surroundings?",
    "description": "Net radiant heat exchange between a surface and large surroundings from area, emissivity and temperatures (Stefan–Boltzmann law), with the equivalent radiation coefficient.",
    "keywords": [
      "MAKEOS",
      "radiation",
      "Stefan-Boltzmann",
      "emissivity",
      "heat loss",
      "furnace",
      "hot surface"
    ],
    "fields": [
      {
        "key": "area",
        "label": "Surface area",
        "type": "number",
        "default": 2,
        "unit": "m²",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Emissivity",
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
        "key": "Ts",
        "label": "Surface temperature",
        "type": "number",
        "default": 300,
        "unit": "°C",
        "min": -200,
        "max": 3000,
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
        "min": -200,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "insulated-pipe",
    "name": "Heat Loss from an Insulated Pipe",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much heat does this insulated pipe lose, and how hot is the outside surface?",
    "description": "Heat loss per metre and in total from an insulated pipe by radial conduction and surface convection, the outer surface temperature and the yearly energy cost.",
    "keywords": [
      "MAKEOS",
      "pipe insulation",
      "heat loss",
      "insulation thickness",
      "steam pipe",
      "surface temperature",
      "energy cost"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Pipe outside diameter",
        "type": "number",
        "default": 60.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Insulation thickness (0 = bare)",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
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
        "min": 0.005,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ti",
        "label": "Pipe temperature",
        "type": "number",
        "default": 150,
        "unit": "°C",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ta",
        "label": "Ambient temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -60,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Outside surface coefficient",
        "type": "number",
        "default": 10,
        "unit": "W/(m²·K)",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Pipe length",
        "type": "number",
        "default": 50,
        "unit": "m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Operating hours per year",
        "type": "number",
        "default": 6000,
        "unit": "h",
        "min": 0,
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
    "id": "lmtd-exchanger",
    "name": "Heat Exchanger LMTD and Area",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What log mean temperature difference and area does this heat exchanger need for the duty?",
    "description": "Log mean temperature difference for counter-flow or parallel-flow exchange, the area needed for a heat duty at an overall coefficient, and a temperature-cross check.",
    "keywords": [
      "MAKEOS",
      "LMTD",
      "heat exchanger",
      "oil cooler",
      "heat duty",
      "overall coefficient",
      "counter flow"
    ],
    "fields": [
      {
        "key": "Thi",
        "label": "Hot fluid in",
        "type": "number",
        "default": 70,
        "unit": "°C",
        "min": -100,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tho",
        "label": "Hot fluid out",
        "type": "number",
        "default": 50,
        "unit": "°C",
        "min": -100,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tci",
        "label": "Cold fluid in",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -100,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tco",
        "label": "Cold fluid out",
        "type": "number",
        "default": 35,
        "unit": "°C",
        "min": -100,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "flow",
        "label": "Flow arrangement",
        "type": "select",
        "default": "counter",
        "options": [
          [
            "counter",
            "Counter-flow"
          ],
          [
            "parallel",
            "Parallel flow"
          ]
        ]
      },
      {
        "key": "kW",
        "label": "Heat duty",
        "type": "number",
        "default": 20,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "U",
        "label": "Overall heat transfer coefficient",
        "type": "number",
        "default": 400,
        "unit": "W/(m²·K)",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "process-breakeven",
    "name": "Process Selection Break-Even Quantity",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "Above what quantity does the process with higher set-up cost become cheaper?",
    "description": "Break-even quantity between two manufacturing methods with different set-up (or tooling) and unit costs, the cost of each at a planned quantity, and the cheaper choice.",
    "keywords": [
      "MAKEOS",
      "break-even",
      "process selection",
      "set-up cost",
      "tooling",
      "unit cost",
      "make method"
    ],
    "fields": [
      {
        "key": "h_process_a",
        "label": "Process A",
        "type": "heading"
      },
      {
        "key": "sA",
        "label": "Set-up and tooling cost",
        "type": "number",
        "default": 300,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cA",
        "label": "Cost per unit",
        "type": "number",
        "default": 12,
        "unit": "AUD",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_process_b",
        "label": "Process B",
        "type": "heading"
      },
      {
        "key": "sB",
        "label": "Set-up and tooling cost",
        "type": "number",
        "default": 2500,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cB",
        "label": "Cost per unit",
        "type": "number",
        "default": 4,
        "unit": "AUD",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_order",
        "label": "Order",
        "type": "heading"
      },
      {
        "key": "qty",
        "label": "Planned quantity",
        "type": "number",
        "default": 200,
        "unit": "units",
        "min": 1,
        "max": 1000000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "learning-curve",
    "name": "Learning Curve Unit Time and Cost",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "How long will the nth unit take, and what will the batch cost, as the team learns?",
    "description": "Unit time, cumulative time and average time per unit on a Wright learning curve from the first-unit time and learning rate, with labour cost for the batch.",
    "keywords": [
      "MAKEOS",
      "learning curve",
      "experience curve",
      "Wright",
      "unit time",
      "estimating",
      "labour cost"
    ],
    "fields": [
      {
        "key": "T1",
        "label": "Time for the first unit",
        "type": "number",
        "default": 10,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Learning rate",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of units",
        "type": "number",
        "default": 50,
        "unit": "units",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "cost",
        "label": "Labour rate",
        "type": "number",
        "default": 80,
        "unit": "AUD/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "xbar-r-limits",
    "name": "X-bar and R Control Chart Limits",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What are the control limits for this X-bar and R chart?",
    "description": "Centre lines and upper and lower control limits for X-bar and range charts from the grand average, average range and subgroup size, with the estimated process standard deviation.",
    "keywords": [
      "MAKEOS",
      "control chart",
      "X-bar R",
      "SPC",
      "control limits",
      "A2 D3 D4",
      "statistical process control"
    ],
    "fields": [
      {
        "key": "xbar",
        "label": "Grand average (average of subgroup means)",
        "type": "number",
        "default": 25.01,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rbar",
        "label": "Average range",
        "type": "number",
        "default": 0.03,
        "unit": "",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Subgroup size",
        "type": "select",
        "default": "5",
        "options": [
          [
            "2",
            "2"
          ],
          [
            "3",
            "3"
          ],
          [
            "4",
            "4"
          ],
          [
            "5",
            "5"
          ],
          [
            "6",
            "6"
          ],
          [
            "7",
            "7"
          ],
          [
            "8",
            "8"
          ],
          [
            "9",
            "9"
          ],
          [
            "10",
            "10"
          ]
        ]
      }
    ]
  },
  {
    "id": "sampling-oc",
    "name": "Acceptance Sampling Probability (OC Curve)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What is the chance this sampling plan accepts a lot with a given defect rate?",
    "description": "Probability of accepting a lot for a single sampling plan (sample size n, acceptance number c) at a given fraction defective, with average outgoing quality and the operating characteristic at several defect levels.",
    "keywords": [
      "MAKEOS",
      "acceptance sampling",
      "OC curve",
      "sampling plan",
      "AQL",
      "probability of acceptance",
      "incoming inspection"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Sample size",
        "type": "number",
        "default": 50,
        "unit": "items",
        "min": 1,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "c",
        "label": "Acceptance number (max defects allowed)",
        "type": "number",
        "default": 1,
        "unit": "defects",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "p",
        "label": "Lot fraction defective",
        "type": "number",
        "default": 2,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "weibull-reliability",
    "name": "Weibull Reliability and B10 Life",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "What is the probability this component survives to a given time, and what are its B10 life and MTTF?",
    "description": "Reliability, probability of failure, hazard rate, B10 life and mean time to failure from Weibull shape and scale parameters, for a mission or maintenance interval.",
    "keywords": [
      "MAKEOS",
      "Weibull",
      "reliability",
      "B10 life",
      "MTTF",
      "hazard rate",
      "failure probability"
    ],
    "fields": [
      {
        "key": "beta",
        "label": "Shape parameter β",
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
        "key": "eta",
        "label": "Scale parameter η (characteristic life)",
        "type": "number",
        "default": 10000,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Mission time or interval",
        "type": "number",
        "default": 2000,
        "unit": "h",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
