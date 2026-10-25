// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook17) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "rectangular-plate",
    "name": "Square and Rectangular Flat Plates",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What stress and deflection does this square or rectangular plate have under load?",
    "description": "Maximum stress and deflection of square and rectangular flat plates with supported or fixed edges under uniform pressure or a central load, by the handbook’s plate formulas.",
    "keywords": [
      "MAKEOS",
      "flat plate",
      "rectangular plate",
      "square plate",
      "cover plate",
      "floor plate",
      "plate deflection"
    ],
    "fields": [
      {
        "key": "case",
        "label": "Plate and loading",
        "type": "select",
        "default": "rect-ss",
        "options": [
          [
            "sq-ss",
            "Square · edges supported top and bottom · uniform"
          ],
          [
            "sq-bottom",
            "Square · edges supported below only · uniform"
          ],
          [
            "sq-fixed",
            "Square · edges fixed · uniform"
          ],
          [
            "sq-fixed-c",
            "Square · edges fixed · central load"
          ],
          [
            "sq-ss-c",
            "Square · edges supported · central load"
          ],
          [
            "rect-ss",
            "Rectangular · edges supported · uniform"
          ],
          [
            "rect-fixed",
            "Rectangular · edges fixed · uniform"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Length (long side)",
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
        "key": "l",
        "label": "Width (short side, rectangular)",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Thickness",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Uniform pressure",
        "type": "number",
        "default": 10,
        "unit": "kPa",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Central load (central-load cases)",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r0",
        "label": "Radius of loaded area (central load)",
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
        "key": "allow",
        "label": "Allowable stress",
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
    "id": "spherical-shell",
    "name": "Spherical Shell under Internal Pressure",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What stress does internal pressure cause in this spherical vessel or dished end?",
    "description": "Membrane stress of a thin sphere and the maximum (inner surface) stress of a thick sphere by Lamé’s equations, with the safety factor and the thickness needed for an allowable stress.",
    "keywords": [
      "MAKEOS",
      "sphere",
      "spherical vessel",
      "hemispherical head",
      "pressure stress",
      "Lamé",
      "thick sphere"
    ],
    "fields": [
      {
        "key": "di",
        "label": "Inside diameter",
        "type": "number",
        "default": 600,
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
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Internal pressure (gauge)",
        "type": "number",
        "default": 2,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
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
    "id": "shaft-brittle-hollow",
    "name": "Shaft Diameter for Brittle Materials and Hollow Shafts",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What diameter does this shaft need by the maximum-normal-stress theory, and how does a hollow shaft compare?",
    "description": "Shaft diameter for brittle materials (cast iron, hardened steel) by the maximum-normal-stress theory with shock factors, the hollow-shaft factor B, and the outside diameter of a hollow shaft equal in strength to a solid one.",
    "keywords": [
      "MAKEOS",
      "brittle shaft",
      "maximum normal stress",
      "hollow shaft",
      "cast iron shaft",
      "shaft design",
      "weight saving"
    ],
    "fields": [
      {
        "key": "M",
        "label": "Bending moment",
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
        "label": "Shock factor, bending",
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
        "label": "Shock factor, torsion",
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
        "key": "St",
        "label": "Allowable tensile stress",
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
        "key": "k",
        "label": "Bore ratio (inside ÷ outside, 0 = solid)",
        "type": "number",
        "default": 0.6,
        "unit": "",
        "min": 0,
        "max": 0.95,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "flange-coupling-bolts",
    "name": "Flange Coupling Bolt Capacity",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Can the bolts of this flanged coupling carry the torque in shear?",
    "description": "Shear stress in the bolts of a rigid flanged shaft coupling from torque, number of bolts and bolt circle, the bolt diameter needed, and the friction torque the bolt preload can carry instead.",
    "keywords": [
      "MAKEOS",
      "flange coupling",
      "coupling bolts",
      "bolt circle",
      "torque transmission",
      "shaft coupling"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 2000,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of bolts",
        "type": "number",
        "default": 6,
        "unit": "bolts",
        "min": 2,
        "max": 64,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Dbc",
        "label": "Bolt circle diameter",
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
        "key": "d",
        "label": "Bolt shank diameter",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tau",
        "label": "Allowable bolt shear stress",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fi",
        "label": "Preload per bolt (friction check, 0 = skip)",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Friction coefficient between flange faces",
        "type": "number",
        "default": 0.2,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Df",
        "label": "Mean friction diameter (0 = bolt circle)",
        "type": "number",
        "default": 0,
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
    "id": "taper-pin-torque",
    "name": "Taper Pin for Torque Transmission",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What mean diameter of taper pin through this shaft and hub transmits the torque safely?",
    "description": "Mean taper pin diameter needed to transmit a torque (or power at a speed) through a shaft by double shear, by the handbook formula, with the shear stress in a chosen pin.",
    "keywords": [
      "MAKEOS",
      "taper pin",
      "cross pin",
      "shaft pin",
      "hub pin",
      "torque transmission",
      "double shear"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Load given as",
        "type": "select",
        "default": "torque",
        "options": [
          [
            "torque",
            "Torque"
          ],
          [
            "power",
            "Power and speed"
          ]
        ]
      },
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 60,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Power",
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
        "label": "Speed",
        "type": "number",
        "default": 500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Shaft diameter",
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
        "key": "S",
        "label": "Safe shear stress of the pin",
        "type": "number",
        "default": 80,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pin mean diameter to check (0 = none)",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "universal-joint",
    "name": "Universal (Cardan) Joint Speed Variation",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How much does the output speed of this universal joint vary over each revolution?",
    "description": "Maximum and minimum driven-shaft speed, speed variation and output speed at any rotation angle of a single universal (Cardan) joint working at an angle, with the matching torque variation.",
    "keywords": [
      "MAKEOS",
      "universal joint",
      "Cardan joint",
      "Hooke joint",
      "speed fluctuation",
      "drive shaft angle",
      "double Cardan"
    ],
    "fields": [
      {
        "key": "angle",
        "label": "Joint working angle",
        "type": "number",
        "default": 25,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Driving shaft speed",
        "type": "number",
        "default": 100,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pos",
        "label": "Driving shaft position for the instantaneous speed",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tin",
        "label": "Input torque",
        "type": "number",
        "default": 100,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "fatigue-notch-factor",
    "name": "Fatigue Notch Factor from Stress Concentration",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "How much does this notch, fillet or groove reduce fatigue strength?",
    "description": "Notch sensitivity (Peterson) and the fatigue stress concentration factor Kf from the theoretical factor Kt, the notch radius and the material’s tensile strength or characteristic length.",
    "keywords": [
      "MAKEOS",
      "notch sensitivity",
      "Kf",
      "Kt",
      "stress concentration",
      "Peterson",
      "fatigue"
    ],
    "fields": [
      {
        "key": "Kt",
        "label": "Theoretical stress concentration factor Kt",
        "type": "number",
        "default": 2.2,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Notch root radius",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aMode",
        "label": "Material constant",
        "type": "select",
        "default": "steel",
        "options": [
          [
            "steel",
            "Estimate for steel from tensile strength"
          ],
          [
            "entered",
            "Enter Peterson constant a"
          ]
        ]
      },
      {
        "key": "Su",
        "label": "Tensile strength (steel estimate)",
        "type": "number",
        "default": 700,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Peterson constant a",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "sn-fatigue-life",
    "name": "Fatigue Life from the S-N Curve (Steel)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "How many cycles will this steel part survive at this alternating stress?",
    "description": "Estimated cycles to failure for a fully reversed (or equivalent) alternating stress from a Basquin S-N line between 10³ cycles and the corrected endurance limit at 10⁶ cycles.",
    "keywords": [
      "MAKEOS",
      "fatigue life",
      "S-N curve",
      "Basquin",
      "finite life",
      "cycles to failure",
      "endurance limit"
    ],
    "fields": [
      {
        "key": "sa",
        "label": "Alternating stress (fully reversed equivalent)",
        "type": "number",
        "default": 300,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Su",
        "label": "Tensile strength",
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
        "key": "Se",
        "label": "Corrected endurance limit",
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
        "key": "f",
        "label": "Fatigue strength fraction at 10³ cycles",
        "type": "number",
        "default": 0.9,
        "unit": "",
        "min": 0.5,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nreq",
        "label": "Required life",
        "type": "number",
        "default": 100000,
        "unit": "cycles",
        "min": 1,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vickers-knoop-hardness",
    "name": "Vickers and Knoop Hardness from Indentation",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What Vickers or Knoop hardness does this indentation give?",
    "description": "Vickers (HV) or Knoop (HK) hardness from the test force and the measured indentation diagonal, with the indentation depth for checking specimen or case thickness.",
    "keywords": [
      "MAKEOS",
      "Vickers hardness",
      "Knoop hardness",
      "HV",
      "microhardness",
      "indentation",
      "case depth"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Test",
        "type": "select",
        "default": "hv",
        "options": [
          [
            "hv",
            "Vickers (square pyramid, 136°)"
          ],
          [
            "hk",
            "Knoop (elongated pyramid)"
          ]
        ]
      },
      {
        "key": "F",
        "label": "Test force",
        "type": "number",
        "default": 10,
        "unit": "kgf",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Mean diagonal (Vickers) or long diagonal (Knoop)",
        "type": "number",
        "default": 0.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "elastic-constants",
    "name": "Elastic Constants: E, G, ν and Bulk Modulus",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What are the other elastic constants of an isotropic material from the two I know?",
    "description": "Modulus of elasticity E, shear modulus G, Poisson’s ratio ν, bulk modulus K and Lamé constant λ of an isotropic material from any two of E, G and ν.",
    "keywords": [
      "MAKEOS",
      "elastic modulus",
      "shear modulus",
      "Poisson ratio",
      "bulk modulus",
      "elastic constants",
      "material properties"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Known values",
        "type": "select",
        "default": "Enu",
        "options": [
          [
            "Enu",
            "E and ν"
          ],
          [
            "EG",
            "E and G"
          ],
          [
            "Gnu",
            "G and ν"
          ]
        ]
      },
      {
        "key": "E",
        "label": "Elastic modulus E",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Shear modulus G",
        "type": "number",
        "default": 77,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Poisson’s ratio ν",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 0.4999,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "melting-energy",
    "name": "Energy and Time to Melt Metal",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much energy and time does it take to melt and superheat this charge of metal?",
    "description": "Energy to heat a metal charge to its melting point, melt it and superheat the liquid to the pouring temperature, and the melting time and energy cost at a furnace power and efficiency.",
    "keywords": [
      "MAKEOS",
      "melting energy",
      "latent heat",
      "furnace",
      "foundry",
      "superheat",
      "induction melting"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Charge mass",
        "type": "number",
        "default": 500,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
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
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tm",
        "label": "Melting point",
        "type": "number",
        "default": 660,
        "unit": "°C",
        "min": 0,
        "max": 3500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tp",
        "label": "Pouring temperature",
        "type": "number",
        "default": 720,
        "unit": "°C",
        "min": 0,
        "max": 3500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cs",
        "label": "Specific heat of solid",
        "type": "number",
        "default": 0.9,
        "unit": "kJ/(kg·K)",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Latent heat of fusion",
        "type": "number",
        "default": 397,
        "unit": "kJ/kg",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cl",
        "label": "Specific heat of liquid",
        "type": "number",
        "default": 1.18,
        "unit": "kJ/(kg·K)",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Furnace power",
        "type": "number",
        "default": 250,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Furnace efficiency",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Energy price",
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
    "id": "snap-fit",
    "name": "Cantilever Snap-Fit Design (Plastics)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "Will this snap-fit finger survive assembly, and what forces does it need?",
    "description": "Assembly strain of a straight or tapered cantilever snap-fit finger by the handbook formula, the deflection force and the assembly (insertion) force from the lead-in angle and friction.",
    "keywords": [
      "MAKEOS",
      "snap fit",
      "cantilever snap",
      "plastic design",
      "assembly strain",
      "insertion force",
      "latch"
    ],
    "fields": [
      {
        "key": "Y",
        "label": "Deflection during assembly (undercut depth)",
        "type": "number",
        "default": 1.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Finger thickness at the root",
        "type": "number",
        "default": 1.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Finger length",
        "type": "number",
        "default": 15,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Finger width",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Taper factor K (1 = straight)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.5,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Secant modulus at the strain",
        "type": "number",
        "default": 2300,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eAllow",
        "label": "Permissible dynamic strain",
        "type": "number",
        "default": 2.5,
        "unit": "%",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Friction coefficient",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Lead-in angle",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 1,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-contact-stress",
    "name": "Spur and Helical Gear Contact (Pitting) Stress",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What contact stress does this gear mesh run at, compared with the allowable for the material?",
    "description": "Nominal contact (Hertzian) stress at the pitch point of a spur or helical gear pair by the ISO 6336-style relation with elasticity and zone factors, as a screening check against pitting.",
    "keywords": [
      "MAKEOS",
      "gear contact stress",
      "pitting",
      "Hertz",
      "ISO 6336",
      "surface durability",
      "gear rating"
    ],
    "fields": [
      {
        "key": "Ft",
        "label": "Tangential force",
        "type": "number",
        "default": 3000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d1",
        "label": "Pinion pitch diameter",
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
        "key": "b",
        "label": "Face width",
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
        "key": "u",
        "label": "Gear ratio (gear ÷ pinion teeth)",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus (both gears)",
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
        "key": "K",
        "label": "Load factor (application × dynamic × distribution)",
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
        "key": "allow",
        "label": "Allowable contact stress",
        "type": "number",
        "default": 1000,
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
    "id": "cam-pressure-angle",
    "name": "Cam Pressure Angle",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What is the maximum pressure angle for this cam rise, base circle and roller follower?",
    "description": "Maximum pressure angle and its position for a radial (in-line) roller follower on a disc cam, from the base circle, roller radius, rise, cam angle and motion law, against a limit.",
    "keywords": [
      "MAKEOS",
      "cam pressure angle",
      "base circle",
      "roller follower",
      "cam design",
      "cam size",
      "cycloidal"
    ],
    "fields": [
      {
        "key": "law",
        "label": "Motion law",
        "type": "select",
        "default": "cyc",
        "options": [
          [
            "cyc",
            "Cycloidal"
          ],
          [
            "shm",
            "Simple harmonic"
          ],
          [
            "poly",
            "3-4-5 polynomial"
          ],
          [
            "parab",
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
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Cam angle for the rise",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 1,
        "max": 360,
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
        "max": 100000,
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
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "limit",
        "label": "Maximum pressure angle allowed",
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
    "id": "bearing-duty-cycle",
    "name": "Bearing Life for a Load and Speed Duty Cycle",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What is the equivalent load and rating life of this bearing over a varying duty cycle?",
    "description": "Mean equivalent load and speed over up to four duty-cycle steps (load, speed, share of time), and the resulting L10 life in hours for ball or roller bearings.",
    "keywords": [
      "MAKEOS",
      "bearing life",
      "duty cycle",
      "mean equivalent load",
      "variable load",
      "L10",
      "cubic mean"
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
            "Ball (exponent 3)"
          ],
          [
            "roller",
            "Roller (exponent 10/3)"
          ]
        ]
      },
      {
        "key": "C",
        "label": "Dynamic load rating C",
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
        "key": "h_step_1",
        "label": "Step 1",
        "type": "heading"
      },
      {
        "key": "P1",
        "label": "Equivalent load",
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
        "key": "n1",
        "label": "Speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t1",
        "label": "Share of time",
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
        "key": "h_step_2",
        "label": "Step 2",
        "type": "heading"
      },
      {
        "key": "P2",
        "label": "Equivalent load",
        "type": "number",
        "default": 8,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n2",
        "label": "Speed",
        "type": "number",
        "default": 750,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2",
        "label": "Share of time",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_step_3",
        "label": "Step 3",
        "type": "heading"
      },
      {
        "key": "P3",
        "label": "Equivalent load",
        "type": "number",
        "default": 2,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n3",
        "label": "Speed",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t3",
        "label": "Share of time",
        "type": "number",
        "default": 30,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_step_4",
        "label": "Step 4",
        "type": "heading"
      },
      {
        "key": "P4",
        "label": "Equivalent load",
        "type": "number",
        "default": 0,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n4",
        "label": "Speed",
        "type": "number",
        "default": 0,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t4",
        "label": "Share of time",
        "type": "number",
        "default": 0,
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
    "id": "rms-torque",
    "name": "RMS Torque for a Motor Duty Cycle",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What is the RMS torque of this duty cycle, and can the motor carry it continuously?",
    "description": "Root-mean-square (thermal) torque and peak torque over a repeating duty cycle of up to five segments, compared with a motor’s continuous and peak torque ratings.",
    "keywords": [
      "MAKEOS",
      "RMS torque",
      "duty cycle",
      "servo sizing",
      "motor thermal",
      "peak torque",
      "S3 duty"
    ],
    "fields": [
      {
        "key": "h_segment_1",
        "label": "Segment 1",
        "type": "heading"
      },
      {
        "key": "T1",
        "label": "Torque",
        "type": "number",
        "default": 12,
        "unit": "N·m",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t1",
        "label": "Duration",
        "type": "number",
        "default": 0.2,
        "unit": "s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_segment_2",
        "label": "Segment 2",
        "type": "heading"
      },
      {
        "key": "T2",
        "label": "Torque",
        "type": "number",
        "default": 3,
        "unit": "N·m",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2",
        "label": "Duration",
        "type": "number",
        "default": 0.6,
        "unit": "s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_segment_3",
        "label": "Segment 3",
        "type": "heading"
      },
      {
        "key": "T3",
        "label": "Torque",
        "type": "number",
        "default": -10,
        "unit": "N·m",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t3",
        "label": "Duration",
        "type": "number",
        "default": 0.2,
        "unit": "s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_segment_4",
        "label": "Segment 4",
        "type": "heading"
      },
      {
        "key": "T4",
        "label": "Torque",
        "type": "number",
        "default": 0,
        "unit": "N·m",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t4",
        "label": "Duration",
        "type": "number",
        "default": 1,
        "unit": "s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_segment_5",
        "label": "Segment 5",
        "type": "heading"
      },
      {
        "key": "T5",
        "label": "Torque",
        "type": "number",
        "default": 0,
        "unit": "N·m",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t5",
        "label": "Duration",
        "type": "number",
        "default": 0,
        "unit": "s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_motor",
        "label": "Motor",
        "type": "heading"
      },
      {
        "key": "Tc",
        "label": "Continuous rated torque",
        "type": "number",
        "default": 6,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tp",
        "label": "Peak torque rating",
        "type": "number",
        "default": 18,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ball-screw-life",
    "name": "Ball Screw Rating Life",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How long will this ball screw last at its mean load and speed?",
    "description": "Rating life of a ball screw in revolutions, travel distance and hours from its dynamic load rating, mean axial load, lead and speed, against a required life.",
    "keywords": [
      "MAKEOS",
      "ball screw life",
      "dynamic load rating",
      "travel life",
      "linear axis",
      "mean axial load"
    ],
    "fields": [
      {
        "key": "Ca",
        "label": "Dynamic load rating Ca",
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
        "key": "Fm",
        "label": "Mean axial load (including preload effect)",
        "type": "number",
        "default": 2,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fw",
        "label": "Load factor fw",
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
        "key": "lead",
        "label": "Lead",
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
        "key": "rpm",
        "label": "Mean speed",
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
        "key": "req",
        "label": "Required life",
        "type": "number",
        "default": 4000,
        "unit": "h",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "timing-belt",
    "name": "Timing (Synchronous) Belt Length and Teeth",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How many teeth does the timing belt need, and what centre distance results?",
    "description": "Pitch length and tooth count of a synchronous (timing) belt for two pulleys at a centre distance, the exact centre distance for the chosen belt, and teeth in mesh on the small pulley.",
    "keywords": [
      "MAKEOS",
      "timing belt",
      "synchronous belt",
      "HTD",
      "belt teeth",
      "centre distance",
      "pulley teeth"
    ],
    "fields": [
      {
        "key": "p",
        "label": "Belt pitch",
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
        "key": "z1",
        "label": "Small pulley teeth",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 8,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Large pulley teeth",
        "type": "number",
        "default": 40,
        "unit": "teeth",
        "min": 8,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "C",
        "label": "Approximate centre distance",
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
    "id": "alignment-thermal-growth",
    "name": "Thermal Growth for Hot Shaft Alignment",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "How much will each machine’s shaft rise when hot, and what cold offset should be set?",
    "description": "Vertical thermal growth of the driver and driven shafts from foot-to-centreline height, expansion coefficient and temperature rise, and the cold alignment offset that gives true alignment at operating temperature.",
    "keywords": [
      "MAKEOS",
      "thermal growth",
      "hot alignment",
      "cold offset",
      "shaft alignment",
      "pump alignment",
      "casing temperature"
    ],
    "fields": [
      {
        "key": "h_stationary_machine_e_g_driver_",
        "label": "Stationary machine (e.g. driver)",
        "type": "heading"
      },
      {
        "key": "H1",
        "label": "Foot to shaft centreline height",
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
        "key": "a1",
        "label": "Expansion coefficient",
        "type": "number",
        "default": 11,
        "unit": "µm/(m·K)",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT1",
        "label": "Temperature rise of supports",
        "type": "number",
        "default": 20,
        "unit": "K",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_movable_machine_e_g_pump_",
        "label": "Movable machine (e.g. pump)",
        "type": "heading"
      },
      {
        "key": "H2",
        "label": "Foot to shaft centreline height",
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
        "key": "a2",
        "label": "Expansion coefficient",
        "type": "number",
        "default": 11,
        "unit": "µm/(m·K)",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT2",
        "label": "Temperature rise of supports",
        "type": "number",
        "default": 60,
        "unit": "K",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
