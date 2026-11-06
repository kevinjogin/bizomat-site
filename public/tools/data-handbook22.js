// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook22) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "retaining-ring-thrust",
    "name": "Retaining Ring Thrust Capacity and Groove Edge Margin",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What thrust load can this retaining ring and groove carry, and how far from the end must the groove be?",
    "description": "Allowable thrust on a retaining ring application by the handbook formulas: ring shear capacity, the load at the onset of groove yielding for spiral-wound rings, the governing (lower) value, and the minimum distance of the groove from the end of the shaft or bore.",
    "keywords": [
      "MAKEOS",
      "retaining ring",
      "circlip",
      "snap ring",
      "thrust load",
      "groove yield",
      "spiral ring"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Shaft or housing diameter",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Ring thickness",
        "type": "number",
        "default": 1.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dg",
        "label": "Groove depth",
        "type": "number",
        "default": 0.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ss",
        "label": "Shear strength of the ring material",
        "type": "number",
        "default": 1000,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength of the groove material",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sc",
        "label": "Shear strength of the groove material",
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
        "key": "K",
        "label": "Safety factor",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Applied thrust load",
        "type": "number",
        "default": 3,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ring",
        "label": "Ring type",
        "type": "select",
        "default": "spiral",
        "options": [
          [
            "spiral",
            "Spiral-wound (full contact)"
          ],
          [
            "stamped",
            "Stamped (partial contact)"
          ]
        ]
      },
      {
        "key": "contact",
        "label": "Groove contact fraction (stamped)",
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
  },
  {
    "id": "iso-cleanliness-code",
    "name": "ISO 4406 Oil Cleanliness Code from Particle Counts",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "What ISO 4406 cleanliness code do these particle counts give, and does the oil meet its target?",
    "description": "ISO 4406 range numbers for particles of 4, 6 and 14 µm and larger per millilitre of oil, from counts per millilitre or per sample volume, with the three-part code and a check against a target code for each size.",
    "keywords": [
      "MAKEOS",
      "ISO 4406",
      "cleanliness code",
      "oil analysis",
      "particle count",
      "contamination control",
      "hydraulic oil cleanliness"
    ],
    "fields": [
      {
        "key": "vol",
        "label": "Sample volume counted",
        "type": "number",
        "default": 1,
        "unit": "mL",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c4",
        "label": "Particles ≥ 4 µm in the sample",
        "type": "number",
        "default": 15000,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c6",
        "label": "Particles ≥ 6 µm in the sample",
        "type": "number",
        "default": 3000,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c14",
        "label": "Particles ≥ 14 µm in the sample",
        "type": "number",
        "default": 1000,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_target_code",
        "label": "Target code",
        "type": "heading"
      },
      {
        "key": "t4",
        "label": "Target range number, 4 µm",
        "type": "number",
        "default": 18,
        "unit": "",
        "min": 0,
        "max": 30,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "t6",
        "label": "Target range number, 6 µm",
        "type": "number",
        "default": 16,
        "unit": "",
        "min": 0,
        "max": 30,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "t14",
        "label": "Target range number, 14 µm",
        "type": "number",
        "default": 13,
        "unit": "",
        "min": 0,
        "max": 30,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "filter-beta-ratio",
    "name": "Filter Beta Ratio and Capture Efficiency",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "What beta ratio and capture efficiency does this filter achieve, and what will pass downstream?",
    "description": "Filtration (beta) ratio of a filter element from upstream and downstream particle counts at a given size, the capture efficiency, and the downstream count expected from a known beta ratio and upstream contamination.",
    "keywords": [
      "MAKEOS",
      "beta ratio",
      "filter efficiency",
      "filtration ratio",
      "multipass test",
      "particle capture",
      "hydraulic filter"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculation",
        "type": "select",
        "default": "counts",
        "options": [
          [
            "counts",
            "Beta from upstream and downstream counts"
          ],
          [
            "rating",
            "Downstream count from a beta ratio"
          ]
        ]
      },
      {
        "key": "up",
        "label": "Upstream particles at the size",
        "type": "number",
        "default": 5000,
        "unit": "per mL",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "down",
        "label": "Downstream particles at the size",
        "type": "number",
        "default": 25,
        "unit": "per mL",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Beta ratio (rating mode)",
        "type": "number",
        "default": 200,
        "unit": "",
        "min": 1,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "inverse-time-feed",
    "name": "Inverse Time Feed Rate (G93)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What inverse-time F value programs this move at the feed I want?",
    "description": "Inverse time feed command (G93 F-word) for a linear, rotary or combined multi-axis move: the reciprocal of the move time, from the feed rate and the length or angle of the move, with the time per block and the surface speed of a rotary move at a radius.",
    "keywords": [
      "MAKEOS",
      "inverse time feed",
      "G93",
      "rotary axis feed",
      "multi-axis feed",
      "CNC programming",
      "F word"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Move",
        "type": "select",
        "default": "rotary",
        "options": [
          [
            "linear",
            "Linear move"
          ],
          [
            "rotary",
            "Rotary move at a radius"
          ],
          [
            "combined",
            "Combined linear and rotary"
          ]
        ]
      },
      {
        "key": "dist",
        "label": "Linear length of the move",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Rotary angle of the move",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "radius",
        "label": "Cutting radius on the rotary axis",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "feed",
        "label": "Wanted feed at the cutter",
        "type": "number",
        "default": 300,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "screw-machine-stock",
    "name": "Bar Stock for Screw Machine Parts",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How many parts does each bar give, and how much bar stock do I order for this quantity?",
    "description": "Parts per bar and bar stock required for automatic screw machine or bar-fed lathe work, from the part length, cut-off tool width, facing allowance, bar length and the remnant lost to chucking, with the handbook’s feet-per-1000-parts estimate for 10-foot bars.",
    "keywords": [
      "MAKEOS",
      "bar stock",
      "screw machine",
      "bar feeder",
      "parts per bar",
      "cut-off width",
      "material estimate"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Finished part length",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Cut-off tool width",
        "type": "number",
        "default": 1.57,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "face",
        "label": "Facing allowance per part",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bar",
        "label": "Bar length",
        "type": "number",
        "default": 3048,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rem",
        "label": "Remnant (chucking) allowance per bar",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qty",
        "label": "Parts required",
        "type": "number",
        "default": 1000,
        "unit": "",
        "min": 1,
        "max": 100000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "kgm",
        "label": "Bar mass per metre",
        "type": "number",
        "default": 1.2,
        "unit": "kg/m",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shearing-blade-force",
    "name": "Shearing Force for Parallel and Inclined Blades",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What force does it take to shear this sheet or bar, with parallel or inclined (rake) blades?",
    "description": "Shearing force for straight parallel blades from the shear strength and cut area, and for straight inclined (raked) blades from tensile strength, thickness, blade angle and the relative penetration, with the handbook’s 30% machine allowance and a capacity check.",
    "keywords": [
      "MAKEOS",
      "shearing force",
      "guillotine",
      "shear rake angle",
      "sheet shear",
      "bar shear",
      "shear capacity"
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
            "Straight parallel"
          ],
          [
            "inclined",
            "Straight inclined (raked)"
          ]
        ]
      },
      {
        "key": "T",
        "label": "Material thickness",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Length of cut (parallel blades)",
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
        "key": "tau",
        "label": "Shear strength (parallel)",
        "type": "number",
        "default": 300,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "UTS",
        "label": "Tensile strength (inclined)",
        "type": "number",
        "default": 400,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Blade inclination",
        "type": "number",
        "default": 2,
        "unit": "°",
        "min": 0.000001,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Factor n (inclined)",
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
        "key": "k",
        "label": "Ratio of shear to tensile strength k (inclined)",
        "type": "number",
        "default": 0.75,
        "unit": "",
        "min": 0.5,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Relative penetration ε (inclined)",
        "type": "number",
        "default": 0.6,
        "unit": "",
        "min": 0.1,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Machine capacity",
        "type": "number",
        "default": 300,
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
    "id": "agma-pitting-power",
    "name": "Spur Gear Pitting Resistance Power Rating (AGMA)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "How much power can this spur gear pair transmit before pitting governs?",
    "description": "Allowable transmitted power for pitting resistance by the AGMA power rating formula (metric form), with the external or internal spur gear geometry factor I calculated from the pressure angle and ratio, the dynamic, size, load-distribution, surface and application factors, and the allowable contact stress with its life and hardness factors.",
    "keywords": [
      "MAKEOS",
      "AGMA",
      "pitting resistance",
      "power rating",
      "geometry factor I",
      "contact stress",
      "gear capacity"
    ],
    "fields": [
      {
        "key": "np",
        "label": "Pinion speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Net face width",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pinion operating pitch diameter",
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
        "key": "mg",
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
        "key": "kind",
        "label": "Gearing",
        "type": "select",
        "default": "ext",
        "options": [
          [
            "ext",
            "External"
          ],
          [
            "int",
            "Internal"
          ]
        ]
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
        "key": "Imode",
        "label": "Geometry factor I",
        "type": "select",
        "default": "calc",
        "options": [
          [
            "calc",
            "Calculate for standard spur gears"
          ],
          [
            "entered",
            "Enter I"
          ]
        ]
      },
      {
        "key": "I",
        "label": "Geometry factor I (entered)",
        "type": "number",
        "default": 0.1,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cv",
        "label": "Dynamic factor C_v (≤ 1)",
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
        "key": "Cs",
        "label": "Size factor C_s",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cm",
        "label": "Load distribution factor C_m",
        "type": "number",
        "default": 1.3,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cf",
        "label": "Surface condition factor C_f",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ca",
        "label": "Application factor C_a",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sac",
        "label": "Allowable contact stress number",
        "type": "number",
        "default": 1000,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "CL",
        "label": "Life factor C_L",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "CH",
        "label": "Hardness ratio factor C_H",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.5,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cp",
        "label": "Elastic coefficient C_p",
        "type": "number",
        "default": 191,
        "unit": "√MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "CT",
        "label": "Temperature factor C_T",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "CR",
        "label": "Reliability factor C_R",
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
        "key": "P",
        "label": "Power to transmit",
        "type": "number",
        "default": 10,
        "unit": "kW",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "grinding-cycle-time",
    "name": "Surface and Cylindrical Grinding Cycle Time",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long will this surface, traverse or plunge grinding operation take?",
    "description": "Grinding time for reciprocating surface grinding (strokes per pass from crossfeed, passes from stock and downfeed), cylindrical traverse grinding (traverse rate from wheel width, traverse per revolution and work speed) and cylindrical plunge grinding (infeed rate), with spark-out passes or dwell.",
    "keywords": [
      "MAKEOS",
      "grinding time",
      "surface grinding",
      "cylindrical grinding",
      "traverse grinding",
      "plunge grinding",
      "spark out"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Operation",
        "type": "select",
        "default": "surface",
        "options": [
          [
            "surface",
            "Surface grinding (reciprocating)"
          ],
          [
            "traverse",
            "Cylindrical traverse"
          ],
          [
            "plunge",
            "Cylindrical plunge"
          ]
        ]
      },
      {
        "key": "stock",
        "label": "Stock to remove (depth, or on diameter for cylindrical)",
        "type": "number",
        "default": 0.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "feed",
        "label": "Downfeed or infeed per pass (on diameter for cylindrical)",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "spark",
        "label": "Spark-out passes",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_surface_grinding",
        "label": "Surface grinding",
        "type": "heading"
      },
      {
        "key": "L",
        "label": "Work length",
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
        "key": "B",
        "label": "Work width",
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
        "key": "over",
        "label": "Overtravel each end",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vt",
        "label": "Table speed",
        "type": "number",
        "default": 15,
        "unit": "m/min",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cf",
        "label": "Crossfeed per stroke",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cylindrical_grinding",
        "label": "Cylindrical grinding",
        "type": "heading"
      },
      {
        "key": "Lw",
        "label": "Ground length",
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
        "key": "bw",
        "label": "Wheel width",
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
        "key": "frac",
        "label": "Traverse per work revolution (share of wheel width)",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nw",
        "label": "Work speed",
        "type": "number",
        "default": 150,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vf",
        "label": "Plunge infeed rate (on diameter)",
        "type": "number",
        "default": 0.5,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dwell",
        "label": "Dwell or spark-out time (plunge)",
        "type": "number",
        "default": 5,
        "unit": "s",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pattern-shrinkage",
    "name": "Pattern Size for Shrinkage and Casting Weight from Pattern",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How big must the pattern be to give this casting size, and roughly what will the casting weigh?",
    "description": "Pattern dimension for a casting from the finished dimension, machining allowance and the metal’s shrinkage allowance (as a percentage or millimetres per metre), and the approximate casting weight from the pattern weight and the densities of the metal and the pattern material.",
    "keywords": [
      "MAKEOS",
      "pattern shrinkage",
      "shrink allowance",
      "pattern size",
      "casting weight",
      "foundry pattern",
      "machining allowance"
    ],
    "fields": [
      {
        "key": "Lp",
        "label": "Finished part dimension",
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
        "key": "mach",
        "label": "Machining allowance per machined face",
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
        "key": "faces",
        "label": "Machined faces across this dimension",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "shrink",
        "label": "Shrinkage allowance",
        "type": "number",
        "default": 10.4,
        "unit": "mm/m",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_casting_weight_from_pattern",
        "label": "Casting weight from pattern",
        "type": "heading"
      },
      {
        "key": "Wp",
        "label": "Pattern weight",
        "type": "number",
        "default": 4,
        "unit": "kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoP",
        "label": "Pattern material density",
        "type": "number",
        "default": 500,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoM",
        "label": "Casting metal density",
        "type": "number",
        "default": 7200,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cores",
        "label": "Volume of cored-out spaces",
        "type": "number",
        "default": 0,
        "unit": "L",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
