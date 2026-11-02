// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook18) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "bend-radius-limits",
    "name": "Minimum and Maximum Bend Radius",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What is the smallest bend radius this sheet takes without cracking, and the largest that still forms permanently?",
    "description": "Minimum inside bend radius from the material’s reduction of area in a tensile test, and the maximum radius that still produces permanent (plastic) deformation, by the handbook formulas.",
    "keywords": [
      "MAKEOS",
      "minimum bend radius",
      "bend radius",
      "sheet metal",
      "cracking",
      "orange peel",
      "springback"
    ],
    "fields": [
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
        "key": "r",
        "label": "Reduction of area in a tensile test",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 1,
        "max": 99,
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
        "key": "YS",
        "label": "Yield strength",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Planned inside bend radius",
        "type": "number",
        "default": 4,
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
    "id": "anodizing-time",
    "name": "Anodizing Time and Coating Thickness",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long must this part anodize to reach the coating thickness, and how much current is needed?",
    "description": "Anodic coating thickness from current density and time by the common “720 rule” for sulfuric acid anodizing of aluminium, the time for a target thickness, the build-up and penetration split, and the rectifier current.",
    "keywords": [
      "MAKEOS",
      "anodizing",
      "anodising",
      "720 rule",
      "coating thickness",
      "aluminium finishing",
      "current density"
    ],
    "fields": [
      {
        "key": "J",
        "label": "Current density",
        "type": "number",
        "default": 1.5,
        "unit": "A/dm²",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thick",
        "label": "Target coating thickness",
        "type": "number",
        "default": 20,
        "unit": "µm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "area",
        "label": "Area on the rack",
        "type": "number",
        "default": 50,
        "unit": "dm²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Process efficiency factor",
        "type": "number",
        "default": 100,
        "unit": "%",
        "min": 10,
        "max": 150,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gating-choke-area",
    "name": "Casting Gating System Choke Area",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What choke (sprue) area fills this mould in the planned pouring time?",
    "description": "Velocity of metal at the base of the sprue from the effective head, the choke area needed to pour a casting in a set time, the equivalent round sprue diameter and gate areas for a chosen gating ratio.",
    "keywords": [
      "MAKEOS",
      "gating system",
      "sprue",
      "choke area",
      "pouring time",
      "gating ratio",
      "foundry"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Poured mass (casting plus runners)",
        "type": "number",
        "default": 40,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid metal density",
        "type": "number",
        "default": 7000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Effective metallostatic head",
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
        "key": "t",
        "label": "Pouring time",
        "type": "number",
        "default": 12,
        "unit": "s",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cd",
        "label": "Flow efficiency (discharge coefficient)",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.1,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "runner",
        "label": "Gating ratio: runner area ÷ choke",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gate",
        "label": "Gating ratio: total gate area ÷ choke",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cnc-chord-error",
    "name": "CNC Arc Linearisation Chord Error",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What chord error do these line segments leave on an arc, or what segment length meets a tolerance?",
    "description": "Chordal deviation of straight line segments approximating an arc or contour, the longest segment for a given tolerance, and the number of segments for the arc.",
    "keywords": [
      "MAKEOS",
      "chord error",
      "chordal deviation",
      "CAM tolerance",
      "linearisation",
      "G01 segments",
      "contour accuracy"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "seg",
        "options": [
          [
            "seg",
            "Segment length for a tolerance"
          ],
          [
            "err",
            "Error for a segment length"
          ]
        ]
      },
      {
        "key": "R",
        "label": "Arc radius",
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
        "key": "tol",
        "label": "Chord tolerance",
        "type": "number",
        "default": 0.005,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Segment length",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Arc angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.001,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "chip-thickness-kc",
    "name": "Chip Thickness and Specific Cutting Force",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What mean chip thickness does this cut produce, and what specific cutting force results?",
    "description": "Mean chip thickness for milling (from feed per tooth, radial engagement and lead angle) or turning, and the specific cutting force kc from the material’s kc1.1 and exponent mc, for use in power calculations.",
    "keywords": [
      "MAKEOS",
      "chip thickness",
      "hm",
      "specific cutting force",
      "kc1",
      "mc",
      "cutting power"
    ],
    "fields": [
      {
        "key": "op",
        "label": "Operation",
        "type": "select",
        "default": "mill",
        "options": [
          [
            "mill",
            "Milling"
          ],
          [
            "turn",
            "Turning"
          ]
        ]
      },
      {
        "key": "fz",
        "label": "Feed per tooth (milling) or per rev (turning)",
        "type": "number",
        "default": 0.15,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ae",
        "label": "Radial engagement (milling)",
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
        "key": "D",
        "label": "Cutter diameter (milling)",
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
        "key": "kappa",
        "label": "Lead (entering) angle κr",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 10,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc1",
        "label": "kc1.1 (specific force at 1 mm chip)",
        "type": "number",
        "default": 1700,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mc",
        "label": "Exponent mc",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rake",
        "label": "Effective rake angle",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -30,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "grinding-geometry",
    "name": "Grinding Equivalent Diameter and G-Ratio",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What is the equivalent wheel diameter for this cylindrical grind, and what G-ratio was achieved?",
    "description": "Equivalent wheel diameter for external, internal or surface grinding, the geometric contact length for a depth of cut, and the grinding ratio (G-ratio) from metal removed and wheel worn.",
    "keywords": [
      "MAKEOS",
      "equivalent diameter",
      "G-ratio",
      "grinding ratio",
      "contact length",
      "wheel wear",
      "cylindrical grinding"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Grinding",
        "type": "select",
        "default": "ext",
        "options": [
          [
            "ext",
            "External cylindrical"
          ],
          [
            "int",
            "Internal cylindrical"
          ],
          [
            "surf",
            "Surface (flat)"
          ]
        ]
      },
      {
        "key": "ds",
        "label": "Wheel diameter",
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
        "key": "dw",
        "label": "Work diameter",
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
        "key": "ae",
        "label": "Depth of cut",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vw",
        "label": "Work material removed (0 = skip G-ratio)",
        "type": "number",
        "default": 50000,
        "unit": "mm³",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vs",
        "label": "Wheel volume worn",
        "type": "number",
        "default": 2000,
        "unit": "mm³",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "thread-milling-path",
    "name": "Thread Milling Tool Path and Feed",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What tool-centre path and programmed feed does this helical thread milling operation need?",
    "description": "Tool-centre path diameter, programmed centre-line feed for the required feed at the cutting edge, helical path length per revolution and cycle time for internal or external thread milling.",
    "keywords": [
      "MAKEOS",
      "thread milling",
      "helical interpolation",
      "tool path",
      "feed compensation",
      "G02 G03",
      "thread mill"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Thread",
        "type": "select",
        "default": "int",
        "options": [
          [
            "int",
            "Internal"
          ],
          [
            "ext",
            "External"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Thread major diameter (internal) or major diameter (external)",
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
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 2.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dc",
        "label": "Cutter diameter",
        "type": "number",
        "default": 14,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Spindle speed",
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
        "key": "fz",
        "label": "Feed per tooth at the cutting edge",
        "type": "number",
        "default": 0.08,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Cutter flutes",
        "type": "number",
        "default": 3,
        "unit": "flutes",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "L",
        "label": "Thread length",
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
        "key": "passes",
        "label": "Radial passes",
        "type": "number",
        "default": 1,
        "unit": "passes",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "angular-indexing",
    "name": "Angular Indexing on a Dividing Head",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What crank movement turns the work through this angle on a dividing head?",
    "description": "Crank turns and holes for indexing an angle on a 40:1 (or other) dividing head, using the hole circle that gives the closest movement, with the resulting angular error.",
    "keywords": [
      "MAKEOS",
      "angular indexing",
      "dividing head",
      "degrees",
      "index plate",
      "angle milling"
    ],
    "fields": [
      {
        "key": "deg",
        "label": "Degrees",
        "type": "number",
        "default": 17,
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "min",
        "label": "Minutes",
        "type": "number",
        "default": 25,
        "unit": "′",
        "min": 0,
        "max": 59.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Worm ratio",
        "type": "number",
        "default": 40,
        "unit": ":1",
        "min": 1,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "plates",
        "label": "Index plates",
        "type": "select",
        "default": "bs",
        "options": [
          [
            "bs",
            "Brown & Sharpe plates 1–3"
          ],
          [
            "cin",
            "Cincinnati standard plate"
          ]
        ]
      }
    ]
  },
  {
    "id": "bolted-joint-fatigue",
    "name": "Bolted Joint Fatigue Check",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Will the bolt in this preloaded joint survive the fluctuating external load?",
    "description": "Alternating and mean bolt stress for a preloaded tension joint under a load cycling between zero and a maximum, and the Goodman fatigue safety factor using the bolt’s endurance strength.",
    "keywords": [
      "MAKEOS",
      "bolt fatigue",
      "preload",
      "joint constant",
      "alternating stress",
      "Goodman",
      "cyclic load"
    ],
    "fields": [
      {
        "key": "At",
        "label": "Tensile stress area",
        "type": "number",
        "default": 84.3,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fi",
        "label": "Preload",
        "type": "number",
        "default": 35,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Maximum external load (cycling from zero)",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Joint constant C = kb ÷ (kb + km)",
        "type": "number",
        "default": 0.2,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Se",
        "label": "Bolt endurance strength (fully corrected)",
        "type": "number",
        "default": 129,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sut",
        "label": "Bolt tensile strength",
        "type": "number",
        "default": 830,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required fatigue safety factor",
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
    "id": "machine-hour-rate",
    "name": "Machine Hour Rate",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "What does this machine cost per productive hour to own and run?",
    "description": "Hourly cost of a machine from capital recovery, floor space, power, maintenance, tooling and consumables over its productive hours, with operator cost to give a full machine-and-operator rate for quoting.",
    "keywords": [
      "MAKEOS",
      "machine hour rate",
      "hourly rate",
      "overhead",
      "costing",
      "capital recovery",
      "quoting"
    ],
    "fields": [
      {
        "key": "price",
        "label": "Installed machine cost",
        "type": "number",
        "default": 350000,
        "unit": "AUD",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "salvage",
        "label": "Resale value at end of life",
        "type": "number",
        "default": 50000,
        "unit": "AUD",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "life",
        "label": "Economic life",
        "type": "number",
        "default": 10,
        "unit": "years",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "rate",
        "label": "Interest (discount) rate",
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
        "key": "hours",
        "label": "Productive hours per year",
        "type": "number",
        "default": 3000,
        "unit": "h",
        "min": 0.000001,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "space",
        "label": "Floor space cost per year",
        "type": "number",
        "default": 8000,
        "unit": "AUD/yr",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kW",
        "label": "Average power drawn when running",
        "type": "number",
        "default": 12,
        "unit": "kW",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "elec",
        "label": "Electricity price",
        "type": "number",
        "default": 0.25,
        "unit": "AUD/kWh",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "maint",
        "label": "Maintenance per year",
        "type": "number",
        "default": 12000,
        "unit": "AUD/yr",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tooling",
        "label": "Tooling and consumables per hour",
        "type": "number",
        "default": 15,
        "unit": "AUD/h",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "labour",
        "label": "Operator cost per hour (fully loaded)",
        "type": "number",
        "default": 65,
        "unit": "AUD/h",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "benefit-cost-ratio",
    "name": "Benefit–Cost Ratio",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "Do the discounted benefits of this project exceed its discounted costs, and by how much?",
    "description": "Present value of annual benefits and costs, initial investment and salvage at a discount rate, the benefit–cost ratio and the net benefit.",
    "keywords": [
      "MAKEOS",
      "benefit cost ratio",
      "B/C ratio",
      "present value",
      "project evaluation",
      "engineering economics"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Initial investment",
        "type": "number",
        "default": 100000,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Annual benefits",
        "type": "number",
        "default": 30000,
        "unit": "AUD/yr",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Annual operating costs",
        "type": "number",
        "default": 5000,
        "unit": "AUD/yr",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S",
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
        "key": "n",
        "label": "Life",
        "type": "number",
        "default": 6,
        "unit": "years",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
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
      }
    ]
  },
  {
    "id": "speed-series",
    "name": "Geometric Speed and Size Series",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "What geometric series of speeds (or sizes) runs between these limits in this many steps?",
    "description": "Step ratio and every value of a geometric progression between a minimum and maximum, as used for machine spindle speeds, feeds and preferred-number size ranges, with the nearest Renard (R10/R20/R40) ratio.",
    "keywords": [
      "MAKEOS",
      "geometric progression",
      "speed series",
      "preferred numbers",
      "Renard series",
      "gearbox steps",
      "arithmetic progression"
    ],
    "fields": [
      {
        "key": "min",
        "label": "Smallest value",
        "type": "number",
        "default": 50,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "max",
        "label": "Largest value",
        "type": "number",
        "default": 2000,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "steps",
        "label": "Number of values",
        "type": "number",
        "default": 12,
        "unit": "values",
        "min": 2,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "factors-gcd",
    "name": "Prime Factors, Greatest Common Divisor and Least Common Multiple",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "What are the prime factors of these numbers, and their greatest common divisor and least common multiple?",
    "description": "Prime factorisation, greatest common divisor and least common multiple of two or three whole numbers, for gear tooth counts, hunting-tooth ratios, change gears and repeat cycles.",
    "keywords": [
      "MAKEOS",
      "prime factors",
      "GCD",
      "LCM",
      "hunting tooth",
      "gear ratio",
      "common factor"
    ],
    "fields": [
      {
        "key": "a",
        "label": "First number",
        "type": "number",
        "default": 72,
        "unit": "",
        "min": 1,
        "max": 1000000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b",
        "label": "Second number",
        "type": "number",
        "default": 30,
        "unit": "",
        "min": 1,
        "max": 1000000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "c",
        "label": "Third number (0 = not used)",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": 0,
        "max": 1000000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "rack-pinion",
    "name": "Rack and Pinion Speed, Force and Travel",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What linear speed, force and travel does this rack and pinion give?",
    "description": "Pitch diameter, travel per revolution, linear speed and thrust force of a rack and pinion from module (or diametral pitch), pinion teeth, speed and torque, with the motor speed for a required linear speed.",
    "keywords": [
      "MAKEOS",
      "rack and pinion",
      "linear drive",
      "travel per revolution",
      "thrust force",
      "gantry",
      "module"
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
        "key": "z",
        "label": "Pinion teeth",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 6,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "rpm",
        "label": "Pinion speed",
        "type": "number",
        "default": 300,
        "unit": "rpm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Pinion torque",
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
        "key": "eff",
        "label": "Mesh efficiency",
        "type": "number",
        "default": 97,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vreq",
        "label": "Required linear speed (0 = none)",
        "type": "number",
        "default": 30,
        "unit": "m/min",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
