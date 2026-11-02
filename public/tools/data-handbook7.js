// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook7) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "turning-power",
    "name": "Turning Cutting Force and Power",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What cutting force, power and torque does this turning cut need, and can the machine deliver it?",
    "description": "Cutting force, cutting power, spindle motor power, torque and metal removal rate for a turning cut from specific cutting force, compared with the available machine power.",
    "keywords": [
      "MAKEOS",
      "turning power",
      "cutting force",
      "specific cutting force",
      "kc",
      "metal removal rate",
      "spindle power"
    ],
    "fields": [
      {
        "key": "vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 200,
        "unit": "m/min",
        "min": 0.000001,
        "max": 5000,
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
        "max": 10,
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
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Workpiece diameter",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc",
        "label": "Specific cutting force kc",
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
        "key": "eta",
        "label": "Machine efficiency",
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
        "key": "Pavail",
        "label": "Available spindle power",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "milling-power",
    "name": "Milling Power and Spindle Torque",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What power and torque does this milling cut need, and can the spindle deliver it?",
    "description": "Metal removal rate, cutting power, motor power and spindle torque for a milling cut from the specific cutting force, compared with the available spindle power.",
    "keywords": [
      "MAKEOS",
      "milling power",
      "spindle torque",
      "removal rate",
      "kc",
      "face milling",
      "end milling"
    ],
    "fields": [
      {
        "key": "ae",
        "label": "Radial width of cut",
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
        "key": "ap",
        "label": "Axial depth of cut",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vf",
        "label": "Table feed",
        "type": "number",
        "default": 800,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Cutter diameter",
        "type": "number",
        "default": 63,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc",
        "label": "Specific cutting force kc",
        "type": "number",
        "default": 1800,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Machine efficiency",
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
        "key": "Pavail",
        "label": "Available spindle power",
        "type": "number",
        "default": 11,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "drilling-power",
    "name": "Drilling Power, Torque and Thrust",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What power, torque and thrust does this drill need?",
    "description": "Spindle speed, feed rate, cutting power, motor power, torque and approximate thrust for a solid twist drill from the specific cutting force.",
    "keywords": [
      "MAKEOS",
      "drilling power",
      "drill torque",
      "thrust force",
      "feed force",
      "twist drill",
      "kc"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Drill diameter",
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
        "key": "vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 80,
        "unit": "m/min",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed",
        "type": "number",
        "default": 0.25,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc",
        "label": "Specific cutting force kc",
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
        "key": "point",
        "label": "Point angle",
        "type": "number",
        "default": 118,
        "unit": "°",
        "min": 60,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Machine efficiency",
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
        "key": "Pavail",
        "label": "Available spindle power",
        "type": "number",
        "default": 7.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "scallop-height",
    "name": "Ball-Nose Scallop Height and Stepover",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What scallop height does this stepover leave, or what stepover gives the target height?",
    "description": "Theoretical scallop (cusp) height left by a ball-nose or radiused cutter on a flat surface for a given stepover, or the stepover for a target scallop height.",
    "keywords": [
      "MAKEOS",
      "scallop height",
      "stepover",
      "ball nose",
      "cusp",
      "3D finishing",
      "surface finish"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "height",
        "options": [
          [
            "height",
            "Scallop height from stepover"
          ],
          [
            "step",
            "Stepover for a target scallop height"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Ball (tool) diameter",
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
        "key": "step",
        "label": "Stepover",
        "type": "number",
        "default": 0.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Target scallop height",
        "type": "number",
        "default": 0.005,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "taylor-tool-life",
    "name": "Taylor Tool Life and Economic Cutting Speed",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long will the tool last at this speed, and what speed gives the lowest cost per part?",
    "description": "Tool life from the Taylor equation (from constants or two test points), and the minimum-cost and maximum-production cutting speeds and tool lives from machine rate, tool cost and tool change time.",
    "keywords": [
      "MAKEOS",
      "Taylor equation",
      "tool life",
      "economic cutting speed",
      "machining economics",
      "minimum cost speed",
      "tool change"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Taylor constants",
        "type": "select",
        "default": "two",
        "options": [
          [
            "nc",
            "Enter n and C"
          ],
          [
            "two",
            "Fit from two tool-life tests"
          ]
        ]
      },
      {
        "key": "n",
        "label": "Taylor exponent n",
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
        "key": "C",
        "label": "Taylor constant C (speed for 1 min life)",
        "type": "number",
        "default": 400,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_two_tool_life_tests",
        "label": "Two tool-life tests",
        "type": "heading"
      },
      {
        "key": "V1",
        "label": "Test 1 cutting speed",
        "type": "number",
        "default": 200,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Test 1 tool life",
        "type": "number",
        "default": 40,
        "unit": "min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V2",
        "label": "Test 2 cutting speed",
        "type": "number",
        "default": 280,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Test 2 tool life",
        "type": "number",
        "default": 10,
        "unit": "min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_planned_speed_and_costs",
        "label": "Planned speed and costs",
        "type": "heading"
      },
      {
        "key": "V",
        "label": "Planned cutting speed",
        "type": "number",
        "default": 260,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Machine and operator rate",
        "type": "number",
        "default": 120,
        "unit": "AUD/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "edge",
        "label": "Tool cost per cutting edge",
        "type": "number",
        "default": 8,
        "unit": "AUD",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tc",
        "label": "Tool change time",
        "type": "number",
        "default": 2,
        "unit": "min",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "grinding-wheel",
    "name": "Grinding Wheel Speed and Removal Rate",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "Is this wheel running within its marked maximum speed, and what removal rate does the grind give?",
    "description": "Wheel peripheral speed against the maximum operating speed marked on the wheel, maximum safe spindle speed, speed ratio, and specific and total material removal rate.",
    "keywords": [
      "MAKEOS",
      "grinding",
      "wheel speed",
      "maximum operating speed",
      "Q prime",
      "removal rate",
      "wheel safety"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Wheel diameter",
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
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 2000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmax",
        "label": "Maximum operating speed marked on wheel",
        "type": "number",
        "default": 35,
        "unit": "m/s",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vw",
        "label": "Work (table or surface) speed",
        "type": "number",
        "default": 15,
        "unit": "m/min",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ae",
        "label": "Depth of cut per pass",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Width of cut",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "broach-pitch",
    "name": "Broach Tooth Pitch",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What tooth pitch should this broach have for its chip space and machine capacity?",
    "description": "Minimum broach tooth pitch from chip space, allowable pitch from machine capacity, the pitch to use, and the number of teeth cutting at once.",
    "keywords": [
      "MAKEOS",
      "broaching",
      "broach pitch",
      "tooth pitch",
      "chip space",
      "keyway broach",
      "surface broach"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Length of cut",
        "type": "number",
        "default": 220,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Depth of cut per tooth",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Chip space factor F",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Width of cut",
        "type": "number",
        "default": 75,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Broaching pressure",
        "type": "number",
        "default": 1586,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Usable machine capacity (70% of maximum)",
        "type": "number",
        "default": 8,
        "unit": "t",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "boring-bar-deflection",
    "name": "Boring Bar Deflection",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How far will this boring bar deflect under the cutting force, and is the overhang reasonable?",
    "description": "Tip deflection of a solid boring bar or long tool as a cantilever under the cutting force, with the overhang-to-diameter ratio, against an allowable deflection.",
    "keywords": [
      "MAKEOS",
      "boring bar",
      "deflection",
      "overhang",
      "L/D ratio",
      "chatter",
      "carbide bar"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Bar diameter",
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
        "key": "L",
        "label": "Overhang",
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
        "key": "E",
        "label": "Bar elastic modulus",
        "type": "number",
        "default": 210,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Cutting force on the tip",
        "type": "number",
        "default": 200,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable deflection",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "electroplating-thickness",
    "name": "Electroplating Thickness and Time (Faraday)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long must this part be plated to reach the thickness, and what current does it need?",
    "description": "Deposition rate, plating time for a target thickness, current and deposited mass by Faraday’s law for common electroplated metals, with cathode current efficiency.",
    "keywords": [
      "MAKEOS",
      "electroplating",
      "Faraday",
      "plating thickness",
      "current density",
      "nickel plating",
      "plating time"
    ],
    "fields": [
      {
        "key": "metal",
        "label": "Deposit",
        "type": "select",
        "default": "ni",
        "options": [
          [
            "ni",
            "Nickel (Ni²⁺)"
          ],
          [
            "cu",
            "Copper, acid (Cu²⁺)"
          ],
          [
            "cucn",
            "Copper, cyanide (Cu⁺)"
          ],
          [
            "zn",
            "Zinc (Zn²⁺)"
          ],
          [
            "cr",
            "Chromium, hexavalent (Cr⁶⁺)"
          ],
          [
            "sn",
            "Tin, acid (Sn²⁺)"
          ],
          [
            "ag",
            "Silver (Ag⁺)"
          ],
          [
            "au",
            "Gold, cyanide (Au⁺)"
          ]
        ]
      },
      {
        "key": "J",
        "label": "Current density",
        "type": "number",
        "default": 4,
        "unit": "A/dm²",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Cathode current efficiency",
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
        "key": "area",
        "label": "Plated area",
        "type": "number",
        "default": 20,
        "unit": "dm²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thick",
        "label": "Target thickness",
        "type": "number",
        "default": 20,
        "unit": "µm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shear-force",
    "name": "Guillotine Shearing Force",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What force does it take to shear this sheet or plate, and can the shear do it?",
    "description": "Shearing force for straight parallel blades or inclined (raked) blades, including the machine allowance, compared with the shear’s rated capacity.",
    "keywords": [
      "MAKEOS",
      "shearing force",
      "guillotine",
      "rake angle",
      "sheet metal",
      "plate shear",
      "cutting force"
    ],
    "fields": [
      {
        "key": "blades",
        "label": "Blades",
        "type": "select",
        "default": "inclined",
        "options": [
          [
            "parallel",
            "Straight parallel blades"
          ],
          [
            "inclined",
            "Straight inclined (raked) blades"
          ]
        ]
      },
      {
        "key": "t",
        "label": "Material thickness",
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
        "key": "b",
        "label": "Cut length (parallel blades)",
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
        "key": "uts",
        "label": "Tensile strength",
        "type": "number",
        "default": 450,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Shear strength ÷ tensile strength",
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
        "key": "rake",
        "label": "Blade rake angle",
        "type": "number",
        "default": 2,
        "unit": "°",
        "min": 0.1,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pen",
        "label": "Relative blade penetration at fracture",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Inclined blade factor n",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.5,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Shear rated capacity",
        "type": "number",
        "default": 500,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "press-brake-force",
    "name": "Press Brake Bending Force",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What tonnage does this V-die bend need, and is the press brake big enough?",
    "description": "Bending force for air bending in a V-die from length, thickness, tensile strength and die opening, with force per metre and comparison with the press brake capacity.",
    "keywords": [
      "MAKEOS",
      "press brake",
      "bending force",
      "tonnage",
      "V-die",
      "air bending",
      "sheet metal"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Bend length",
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
        "key": "t",
        "label": "Material thickness",
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
        "key": "uts",
        "label": "Tensile strength",
        "type": "number",
        "default": 450,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "V-die opening",
        "type": "number",
        "default": 24,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Die factor",
        "type": "number",
        "default": 1.33,
        "unit": "",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Press brake capacity",
        "type": "number",
        "default": 1000,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shell-blank",
    "name": "Drawn Shell Blank Diameter and Draws",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What blank diameter is needed for this drawn cup, and how many draws will it take?",
    "description": "Blank diameter for a cylindrical drawn shell with or without a flange, the first drawing ratio against a limit, the estimated number of draws and the first-draw force.",
    "keywords": [
      "MAKEOS",
      "deep drawing",
      "blank diameter",
      "drawing ratio",
      "drawn cup",
      "shell",
      "press work"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Shell diameter (mean)",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Shell height",
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
        "key": "r",
        "label": "Bottom corner radius",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "flange",
        "label": "Flange outside diameter (0 = no flange)",
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
        "key": "t",
        "label": "Material thickness",
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
        "key": "uts",
        "label": "Tensile strength",
        "type": "number",
        "default": 350,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m1",
        "label": "Limiting first drawing ratio d ÷ D",
        "type": "number",
        "default": 0.55,
        "unit": "",
        "min": 0.3,
        "max": 0.95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m2",
        "label": "Limiting redrawing ratio",
        "type": "number",
        "default": 0.78,
        "unit": "",
        "min": 0.5,
        "max": 0.98,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "fillet-weld-strength",
    "name": "Fillet Weld Strength",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "Can these fillet welds carry the load, and what leg size is needed?",
    "description": "Throat thickness, load capacity of fillet welds on the throat with an allowable shear stress, utilisation under a load and the minimum leg size required.",
    "keywords": [
      "MAKEOS",
      "fillet weld",
      "weld strength",
      "throat",
      "leg size",
      "weld capacity",
      "AS/NZS 1554"
    ],
    "fields": [
      {
        "key": "leg",
        "label": "Leg size",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Effective length of each weld",
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
        "key": "nw",
        "label": "Number of welds sharing the load",
        "type": "number",
        "default": 2,
        "unit": "welds",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "tau",
        "label": "Allowable shear stress on the throat",
        "type": "number",
        "default": 145,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Applied load",
        "type": "number",
        "default": 120,
        "unit": "kN",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "carbon-equivalent",
    "name": "Carbon Equivalent and Weldability",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What carbon equivalent does this steel have, and does it suggest preheat?",
    "description": "Carbon equivalent (IIW) and Pcm (Ito–Bessyo) from a steel’s chemical composition, with commonly cited weldability guidance.",
    "keywords": [
      "MAKEOS",
      "carbon equivalent",
      "CE IIW",
      "Pcm",
      "weldability",
      "preheat",
      "hydrogen cracking"
    ],
    "fields": [
      {
        "key": "C",
        "label": "Carbon",
        "type": "number",
        "default": 0.18,
        "unit": "%",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mn",
        "label": "Manganese",
        "type": "number",
        "default": 1.3,
        "unit": "%",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Si",
        "label": "Silicon",
        "type": "number",
        "default": 0.3,
        "unit": "%",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cr",
        "label": "Chromium",
        "type": "number",
        "default": 0.1,
        "unit": "%",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mo",
        "label": "Molybdenum",
        "type": "number",
        "default": 0.02,
        "unit": "%",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "Vanadium",
        "type": "number",
        "default": 0.01,
        "unit": "%",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ni",
        "label": "Nickel",
        "type": "number",
        "default": 0.1,
        "unit": "%",
        "min": 0,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cu",
        "label": "Copper",
        "type": "number",
        "default": 0.15,
        "unit": "%",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Boron",
        "type": "number",
        "default": 0,
        "unit": "%",
        "min": 0,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "casting-solidification",
    "name": "Casting Solidification Time and Riser Check",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "Will this cylindrical riser solidify after the casting, and what pattern size allows for shrinkage?",
    "description": "Casting and riser moduli and solidification times by Chvorinov’s rule, the riser-to-casting modulus ratio, and pattern size from a shrinkage allowance.",
    "keywords": [
      "MAKEOS",
      "Chvorinov",
      "solidification time",
      "riser",
      "casting modulus",
      "shrinkage allowance",
      "foundry"
    ],
    "fields": [
      {
        "key": "Vc",
        "label": "Casting (section) volume",
        "type": "number",
        "default": 2000,
        "unit": "cm³",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ac",
        "label": "Casting cooling surface area",
        "type": "number",
        "default": 900,
        "unit": "cm²",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dr",
        "label": "Riser diameter",
        "type": "number",
        "default": 130,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hr",
        "label": "Riser height",
        "type": "number",
        "default": 160,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Mould constant B",
        "type": "number",
        "default": 2,
        "unit": "min/cm²",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Required riser/casting modulus ratio",
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
        "key": "part",
        "label": "Part dimension for pattern",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shrink",
        "label": "Shrinkage allowance",
        "type": "number",
        "default": 1,
        "unit": "%",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "brinell-hardness",
    "name": "Brinell Hardness from Indentation",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What Brinell hardness does this indentation give, and is the test valid?",
    "description": "Brinell hardness number from test force, ball diameter and mean indentation diameter, with validity checks and an approximate tensile strength for steels.",
    "keywords": [
      "MAKEOS",
      "Brinell",
      "hardness",
      "HBW",
      "indentation",
      "tensile strength from hardness",
      "ISO 6506"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Test force",
        "type": "number",
        "default": 3000,
        "unit": "kgf",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Ball diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Mean indentation diameter",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "wall-heat-loss",
    "name": "Heat Flow Through a Layered Wall",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much heat flows through this insulated wall, and what are the layer temperatures?",
    "description": "Overall heat transfer coefficient, heat flow and interface temperatures for conduction through up to three plane layers with optional surface film coefficients.",
    "keywords": [
      "MAKEOS",
      "heat conduction",
      "insulation",
      "U value",
      "heat loss",
      "thermal resistance",
      "oven wall"
    ],
    "fields": [
      {
        "key": "Thot",
        "label": "Hot side temperature",
        "type": "number",
        "default": 200,
        "unit": "°C",
        "min": -273,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tcold",
        "label": "Cold side temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -273,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "area",
        "label": "Wall area",
        "type": "number",
        "default": 10,
        "unit": "m²",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hin",
        "label": "Hot side film coefficient (0 = ignore)",
        "type": "number",
        "default": 0,
        "unit": "W/(m²·K)",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hout",
        "label": "Cold side film coefficient (0 = ignore)",
        "type": "number",
        "default": 10,
        "unit": "W/(m²·K)",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_layer_1",
        "label": "Layer 1",
        "type": "heading"
      },
      {
        "key": "t1",
        "label": "Thickness (0 = not used)",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k1",
        "label": "Thermal conductivity",
        "type": "number",
        "default": 50,
        "unit": "W/(m·K)",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_layer_2",
        "label": "Layer 2",
        "type": "heading"
      },
      {
        "key": "t2",
        "label": "Thickness (0 = not used)",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k2",
        "label": "Thermal conductivity",
        "type": "number",
        "default": 0.04,
        "unit": "W/(m·K)",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_layer_3",
        "label": "Layer 3",
        "type": "heading"
      },
      {
        "key": "t3",
        "label": "Thickness (0 = not used)",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k3",
        "label": "Thermal conductivity",
        "type": "number",
        "default": 50,
        "unit": "W/(m·K)",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "heating-energy",
    "name": "Heating Energy and Time",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much energy and time does it take to heat this material or liquid?",
    "description": "Energy to raise a mass through a temperature range from its specific heat, and the heating time with a given heater power and efficiency.",
    "keywords": [
      "MAKEOS",
      "heating time",
      "specific heat",
      "energy",
      "heater sizing",
      "tank heating",
      "oven"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Mass to heat",
        "type": "number",
        "default": 500,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Specific heat capacity",
        "type": "number",
        "default": 4.18,
        "unit": "kJ/(kg·K)",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Start temperature",
        "type": "number",
        "default": 15,
        "unit": "°C",
        "min": -273,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Final temperature",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -273,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Heater power",
        "type": "number",
        "default": 9,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Heating efficiency (heat reaching the load)",
        "type": "number",
        "default": 85,
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
        "default": 0.3,
        "unit": "AUD/kWh",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
