// KEVOS® MAKEOS: engineering tools within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "cutting-speed",
    "name": "Cutting Speed and Spindle RPM",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What RPM corresponds to the chosen cutting speed?",
    "description": "Convert a specified surface speed to spindle RPM, and check the surface speed at an actual machine setting.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "spindle speed",
      "surface speed",
      "SFM planning"
    ],
    "fields": [
      {
        "key": "diameter",
        "label": "Effective cutting diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "speed",
        "label": "Specified cutting speed",
        "type": "number",
        "default": 120,
        "unit": "m/min",
        "min": 0.001,
        "max": 1000000,
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
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "milling-feed-time",
    "name": "Milling Feed, Removal Rate and Time",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What feed, removal rate and cutting time follow from this setup?",
    "description": "Calculate table feed, steady material removal and ideal cutting time from RPM, effective teeth and feed per tooth.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "milling feed",
      "chip load",
      "metal removal rate"
    ],
    "fields": [
      {
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "teeth",
        "label": "Effective teeth",
        "type": "number",
        "default": 4,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "chip",
        "label": "Feed per tooth",
        "type": "number",
        "default": 0.05,
        "unit": "mm/tooth",
        "min": 1e-06,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "width",
        "label": "Radial engagement",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Axial depth",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "length",
        "label": "Feed travel",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "turning-time",
    "name": "Turning Feed and Cutting Time",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long will a straight turning pass take?",
    "description": "Calculate axial feed, ideal straight-pass time and surface speed for constant-RPM turning.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "lathe time",
      "turning cycle",
      "axial feed"
    ],
    "fields": [
      {
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "feed",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.2,
        "unit": "mm/rev",
        "min": 1e-06,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "length",
        "label": "Feed travel",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "passes",
        "label": "Number of equal passes",
        "type": "number",
        "default": 3,
        "unit": "passes",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "diameter",
        "label": "Cutting diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "drilling-time",
    "name": "Drilling Travel and Time",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What feed travel and time does a through-hole need?",
    "description": "Estimate continuous-feed time for through-drilling, including the geometric drill point and chosen extra travel.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "drill point",
      "through hole",
      "drilling time"
    ],
    "fields": [
      {
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "feed",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.1,
        "unit": "mm/rev",
        "min": 1e-06,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "diameter",
        "label": "Drill diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thickness",
        "label": "Through thickness",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Included point angle",
        "type": "number",
        "default": 118,
        "unit": "°",
        "min": 1,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "extra",
        "label": "Additional feed travel",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "holes",
        "label": "Hole count",
        "type": "number",
        "default": 6,
        "unit": "holes",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "tapping-feed",
    "name": "Tapping Feed and Thread Lead",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What synchronous feed matches this thread lead?",
    "description": "Relate thread pitch, number of starts and spindle speed to axial tapping or threading feed.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "rigid tapping",
      "thread lead",
      "multi-start"
    ],
    "fields": [
      {
        "key": "pitch",
        "label": "Thread pitch",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 1e-06,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "starts",
        "label": "Thread starts",
        "type": "number",
        "default": 1,
        "unit": "starts",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Axial feed distance",
        "type": "number",
        "default": 15,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bolt-circle",
    "name": "Bolt Circle Coordinates",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "Where are the centres of equally spaced holes?",
    "description": "Generate a coordinate table for an equally spaced bolt circle with a defined origin, start angle and direction.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "PCD",
      "hole coordinates",
      "bolt pattern"
    ],
    "fields": [
      {
        "key": "diameter",
        "label": "Pitch circle diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "holes",
        "label": "Hole count",
        "type": "number",
        "default": 4,
        "unit": "holes",
        "min": 2,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "angle",
        "label": "Start angle from +X",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "x",
        "label": "Centre X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y",
        "label": "Centre Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "direction",
        "label": "Numbering direction",
        "type": "select",
        "default": "ccw",
        "options": [
          [
            "ccw",
            "Anticlockwise"
          ],
          [
            "cw",
            "Clockwise"
          ]
        ]
      }
    ]
  },
  {
    "id": "taper-geometry",
    "name": "Taper Angle and Ratio",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What half-angle and taper ratio match these dimensions?",
    "description": "Calculate a straight conical taper from its two diameters and axial length.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "cone angle",
      "taper per length",
      "compound slide"
    ],
    "fields": [
      {
        "key": "large",
        "label": "Large diameter",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "small",
        "label": "Small diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "length",
        "label": "Axial taper length",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "sine-bar",
    "name": "Sine Bar Height",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What height difference sets this angle?",
    "description": "Calculate the height difference between equal-diameter sine-bar rollers for an entered angle.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "sine bar",
      "gauge blocks",
      "angle setting"
    ],
    "fields": [
      {
        "key": "length",
        "label": "Roller centre distance",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Setting angle",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": false
      }
    ]
  },
  {
    "id": "fit-clearance",
    "name": "Hole and Shaft Clearance Limits",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What clearance or interference can occur at the size limits?",
    "description": "Calculate the worst-case diametral clearance range from explicitly supplied hole and shaft limits.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "limits fits",
      "interference",
      "dimensional tolerance"
    ],
    "fields": [
      {
        "key": "holeMin",
        "label": "Minimum hole diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "holeMax",
        "label": "Maximum hole diameter",
        "type": "number",
        "default": 20.021,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shaftMin",
        "label": "Minimum shaft diameter",
        "type": "number",
        "default": 19.98,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shaftMax",
        "label": "Maximum shaft diameter",
        "type": "number",
        "default": 19.993,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "thermal-growth",
    "name": "Linear Thermal Growth",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much does an unrestrained dimension change with temperature?",
    "description": "Estimate signed linear growth using a supplied constant expansion coefficient and temperature change.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "thermal expansion",
      "temperature correction",
      "dimensional growth"
    ],
    "fields": [
      {
        "key": "length",
        "label": "Initial length",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
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
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "initial",
        "label": "Initial temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -273.14,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "final",
        "label": "Final temperature",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -273.14,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "beam-deflection",
    "name": "Beam Stress and Deflection",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What stress and deflection does this ideal beam model predict?",
    "description": "Screen a prismatic beam under one defined load case using supplied section properties and elastic modulus.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "beam bending",
      "stiffness",
      "deflection"
    ],
    "fields": [
      {
        "key": "case",
        "label": "Load case",
        "type": "select",
        "default": "simple-point",
        "options": [
          [
            "simple-point",
            "Simply supported · central point load"
          ],
          [
            "cantilever-point",
            "Cantilever · tip point load"
          ],
          [
            "simple-udl",
            "Simply supported · uniform load"
          ]
        ]
      },
      {
        "key": "load",
        "label": "Total applied load",
        "type": "number",
        "default": 1000,
        "unit": "N",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "length",
        "label": "Span",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "modulus",
        "label": "Young’s modulus",
        "type": "number",
        "default": 200000,
        "unit": "MPa",
        "min": 0.001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "inertia",
        "label": "Second moment of area",
        "type": "number",
        "default": 1000000,
        "unit": "mm⁴",
        "min": 1e-06,
        "max": 1000000000000000.0,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fibre",
        "label": "Extreme fibre distance",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shaft-torsion",
    "name": "Circular Shaft Torsion",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What torsional stress and twist does this circular shaft develop?",
    "description": "Calculate elastic torsion of a uniform solid or hollow circular shaft with a supplied shear modulus.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "torsion",
      "shaft twist",
      "polar inertia"
    ],
    "fields": [
      {
        "key": "outer",
        "label": "Outside diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "inner",
        "label": "Inside diameter",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "length",
        "label": "Loaded length",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "torque",
        "label": "Torque",
        "type": "number",
        "default": 200,
        "unit": "N·m",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "modulus",
        "label": "Shear modulus",
        "type": "number",
        "default": 80000,
        "unit": "MPa",
        "min": 0.001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "torque-power",
    "name": "Torque, Power and Speed",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What shaft torque corresponds to this power and speed?",
    "description": "Convert mechanical shaft power and rotational speed into steady torque.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "motor torque",
      "shaft power",
      "rotational speed"
    ],
    "fields": [
      {
        "key": "power",
        "label": "Mechanical shaft power",
        "type": "number",
        "default": 5,
        "unit": "kW",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Shaft speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-pair",
    "name": "Spur Gear Pair Geometry",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What nominal geometry and speed ratio follow from module and tooth counts?",
    "description": "Calculate reference geometry and ideal output speed for an unshifted external spur gear pair.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "spur gear",
      "module",
      "gear ratio"
    ],
    "fields": [
      {
        "key": "module",
        "label": "Module",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "driver",
        "label": "Driver teeth",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 3,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "driven",
        "label": "Driven teeth",
        "type": "number",
        "default": 60,
        "unit": "teeth",
        "min": 3,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "rpm",
        "label": "Input speed",
        "type": "number",
        "default": 1200,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "belt-drive",
    "name": "Open Belt Drive Geometry",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What speed, wrap and pitch length follow from this pulley layout?",
    "description": "Calculate ideal speed ratio and exact geometric belt pitch length for two circular pulleys in an open drive.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "pulley ratio",
      "belt length",
      "belt speed"
    ],
    "fields": [
      {
        "key": "driver",
        "label": "Driver pitch diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "driven",
        "label": "Driven pitch diameter",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "centre",
        "label": "Centre distance",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Driver speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hydraulic-cylinder",
    "name": "Hydraulic Cylinder Force and Speed",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What ideal force and stroke time follow from pressure and flow?",
    "description": "Calculate double-acting cylinder forces with return pressure, plus ideal extension and retraction times.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "cylinder force",
      "hydraulic ram",
      "stroke time"
    ],
    "fields": [
      {
        "key": "bore",
        "label": "Bore diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rod",
        "label": "Rod diameter",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pressure",
        "label": "Supply pressure",
        "type": "number",
        "default": 100,
        "unit": "bar gauge",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "back",
        "label": "Return pressure",
        "type": "number",
        "default": 5,
        "unit": "bar gauge",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "flow",
        "label": "Inlet flow",
        "type": "number",
        "default": 10,
        "unit": "L/min",
        "min": 1e-06,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stroke",
        "label": "Stroke",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hydraulic-power",
    "name": "Hydraulic Power and Pump Input",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What fluid power and shaft input does this duty require?",
    "description": "Calculate hydraulic power from differential pressure and delivered flow, with an entered overall pump efficiency.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "pump power",
      "hydraulic kW",
      "pump loss"
    ],
    "fields": [
      {
        "key": "pressure",
        "label": "Pressure rise",
        "type": "number",
        "default": 150,
        "unit": "bar",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "flow",
        "label": "Delivered flow",
        "type": "number",
        "default": 20,
        "unit": "L/min",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "efficiency",
        "label": "Overall pump efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 0.001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pipe-flow",
    "name": "Liquid Pipe Velocity and Reynolds Number",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What velocity and flow regime follow from diameter, flow and viscosity?",
    "description": "Calculate mean velocity and Reynolds number for a full circular pipe carrying a single-phase Newtonian liquid.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "pipe velocity",
      "Reynolds",
      "liquid flow"
    ],
    "fields": [
      {
        "key": "diameter",
        "label": "Internal diameter",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "flow",
        "label": "Liquid flow",
        "type": "number",
        "default": 20,
        "unit": "L/min",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "viscosity",
        "label": "Kinematic viscosity",
        "type": "number",
        "default": 1,
        "unit": "mm²/s",
        "min": 1e-06,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pneumatic-consumption",
    "name": "Pneumatic Cylinder Air Demand",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What reference-volume air demand does this cylinder cycle create?",
    "description": "Estimate ideal reference-volume consumption for a double-acting cylinder using absolute pressure and temperature.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "compressed air",
      "air consumption",
      "cylinder demand"
    ],
    "fields": [
      {
        "key": "bore",
        "label": "Bore diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
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
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stroke",
        "label": "Stroke",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pressure",
        "label": "Supply gauge pressure",
        "type": "number",
        "default": 6,
        "unit": "bar gauge",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ambient",
        "label": "Local ambient pressure",
        "type": "number",
        "default": 1,
        "unit": "bar absolute",
        "min": 0.001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "reference",
        "label": "Reference pressure",
        "type": "number",
        "default": 1,
        "unit": "bar absolute",
        "min": 0.001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "temperature",
        "label": "Cylinder air temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -273.14,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "refTemp",
        "label": "Reference temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -273.14,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cycles",
        "label": "Complete cycles per minute",
        "type": "number",
        "default": 10,
        "unit": "cycles/min",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "stock-mass",
    "name": "Stock Volume and Mass",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What is the theoretical mass of this stock geometry?",
    "description": "Estimate mass for rectangular stock, solid round bar or round tube using an explicitly supplied density.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "material weight",
      "bar mass",
      "tube mass",
      "plate mass"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Shape",
        "type": "select",
        "default": "plate",
        "options": [
          [
            "plate",
            "Rectangular stock"
          ],
          [
            "round",
            "Solid round bar"
          ],
          [
            "tube",
            "Round tube"
          ]
        ]
      },
      {
        "key": "length",
        "label": "Length",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "width",
        "label": "Width / outside diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thickness",
        "label": "Thickness / wall thickness",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "density",
        "label": "Density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bend-allowance",
    "name": "Sheet Bend Allowance and Deduction",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What developed length follows from this bend and K-factor?",
    "description": "Calculate one bend’s neutral-axis allowance and outside-dimension deduction using a supplied K-factor.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "bend deduction",
      "flat pattern",
      "K factor"
    ],
    "fields": [
      {
        "key": "thickness",
        "label": "Sheet thickness",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "radius",
        "label": "Inside bend radius",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Bend angle from flat",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.001,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "k",
        "label": "K-factor",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Outside flange A",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Outside flange B",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "punching-force",
    "name": "Punching Force Estimate",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What ideal force follows from the total cut perimeter?",
    "description": "Estimate nominal flat-punch cutting force from total simultaneous perimeter, thickness and material shear strength.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "press tonnage",
      "blanking",
      "punch force"
    ],
    "fields": [
      {
        "key": "perimeter",
        "label": "Total cut perimeter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thickness",
        "label": "Material thickness",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "strength",
        "label": "Shear strength",
        "type": "number",
        "default": 300,
        "unit": "MPa",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "factor",
        "label": "Additional force multiplier",
        "type": "number",
        "default": 1.2,
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
    "id": "process-capability",
    "name": "Process Capability from Summary Data",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What Cp and Cpk follow from this mean and within-process spread?",
    "description": "Calculate two-sided Cp and Cpk from supplied specifications, process mean and within-process standard deviation.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "Cp Cpk",
      "process capability",
      "quality statistics"
    ],
    "fields": [
      {
        "key": "lower",
        "label": "Lower specification",
        "type": "number",
        "default": 9.9,
        "unit": "unit",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "upper",
        "label": "Upper specification",
        "type": "number",
        "default": 10.1,
        "unit": "unit",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mean",
        "label": "Process mean",
        "type": "number",
        "default": 10.02,
        "unit": "unit",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sigma",
        "label": "Within-process standard deviation",
        "type": "number",
        "default": 0.02,
        "unit": "unit",
        "min": 1e-09,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stable",
        "label": "Stable process and suitable distribution confirmed?",
        "type": "select",
        "default": "no",
        "options": [
          [
            "no",
            "Not yet confirmed"
          ],
          [
            "yes",
            "Confirmed by a separate study"
          ]
        ]
      }
    ]
  },
  {
    "id": "maintenance-availability",
    "name": "Repairable Asset Availability",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "What do operating and repair records show about availability?",
    "description": "Calculate observed availability and simple failure and repair averages for one repairable asset.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "MTBF",
      "MTTR",
      "asset availability",
      "repair history"
    ],
    "fields": [
      {
        "key": "uptime",
        "label": "Operating time",
        "type": "number",
        "default": 900,
        "unit": "h",
        "min": 0,
        "max": 1000000000.0,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "downtime",
        "label": "Corrective repair downtime",
        "type": "number",
        "default": 100,
        "unit": "h",
        "min": 0,
        "max": 1000000000.0,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "failures",
        "label": "Observed failures",
        "type": "number",
        "default": 5,
        "unit": "failures",
        "min": 0,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  }
]);
