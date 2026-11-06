// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook16) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "unified-thread-limits",
    "name": "Unified Thread Limits of Size (Classes 1A–3B)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the limits of size for this UNC, UNF or UN thread in the chosen class?",
    "description": "Allowance, major, pitch and UNR minor diameter limits of an external Unified inch thread, and minor and pitch diameter limits of the mating internal thread, for classes 1A/1B, 2A/2B and 3A/3B, by the ASME B1.1 formulas.",
    "keywords": [
      "MAKEOS",
      "unified thread limits",
      "thread class",
      "2A 2B",
      "pitch diameter tolerance",
      "ASME B1.1",
      "thread inspection"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Basic major diameter",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 13,
        "unit": "TPI",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cls",
        "label": "Thread class",
        "type": "select",
        "default": "2",
        "options": [
          [
            "1",
            "1A / 1B"
          ],
          [
            "2",
            "2A / 2B"
          ],
          [
            "3",
            "3A / 3B"
          ]
        ]
      },
      {
        "key": "LE",
        "label": "Length of engagement (0 = standard)",
        "type": "number",
        "default": 0,
        "unit": "in",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "metric-thread-limits",
    "name": "ISO Metric Thread Limits of Size (6g, 6H and Others)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the limits of size for this metric thread in the chosen tolerance class?",
    "description": "Major, pitch and minor diameter limits of external and internal ISO metric threads for common tolerance classes (4h, 6h, 6g, 6f, 6e, 8g and 4H, 5H, 6H, 7H, 6G) from the ISO 965-1 tolerance formulas.",
    "keywords": [
      "MAKEOS",
      "metric thread limits",
      "6g 6H",
      "ISO 965",
      "thread tolerance",
      "pitch diameter",
      "thread inspection"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nominal diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 1,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.2,
        "max": 8,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ext",
        "label": "External class",
        "type": "select",
        "default": "6g",
        "options": [
          [
            "4h",
            "4h"
          ],
          [
            "6h",
            "6h"
          ],
          [
            "6g",
            "6g"
          ],
          [
            "6f",
            "6f"
          ],
          [
            "6e",
            "6e"
          ],
          [
            "8g",
            "8g"
          ]
        ]
      },
      {
        "key": "int",
        "label": "Internal class",
        "type": "select",
        "default": "6H",
        "options": [
          [
            "4H",
            "4H"
          ],
          [
            "5H",
            "5H"
          ],
          [
            "6H",
            "6H"
          ],
          [
            "7H",
            "7H"
          ],
          [
            "6G",
            "6G"
          ]
        ]
      }
    ]
  },
  {
    "id": "whitworth-thread",
    "name": "Whitworth Thread Basic Dimensions",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the basic pitch and minor diameters of this BSW, BSF or BSP (parallel) Whitworth thread?",
    "description": "Basic depth, pitch and minor diameters and crest/root radius of a 55° Whitworth form thread (BSW, BSF, BSP parallel) from its major diameter and threads per inch.",
    "keywords": [
      "MAKEOS",
      "Whitworth",
      "BSW",
      "BSF",
      "BSP",
      "55 degree thread",
      "British thread"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Major diameter",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 12,
        "unit": "TPI",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "three-wire-lead-angle",
    "name": "Three-Wire Measurement with Lead Angle (Buckingham)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What should the measurement over wires read for this coarse-lead or multi-start thread or worm?",
    "description": "Measurement over three wires including the effect of lead angle by Buckingham’s simplified formula, with the wire size the formula requires, for worms, Acme and multi-start threads.",
    "keywords": [
      "MAKEOS",
      "three-wire",
      "lead angle",
      "Buckingham",
      "worm measurement",
      "multi-start thread",
      "Acme"
    ],
    "fields": [
      {
        "key": "angle",
        "label": "Included thread angle",
        "type": "number",
        "default": 29,
        "unit": "°",
        "min": 10,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "plane",
        "label": "Angle measured in",
        "type": "select",
        "default": "axial",
        "options": [
          [
            "axial",
            "Axial plane (cutter matches the axial thread form)"
          ],
          [
            "normal",
            "Normal plane (cutter angle normal to the thread)"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Axial pitch",
        "type": "number",
        "default": 6.35,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "starts",
        "label": "Number of starts",
        "type": "number",
        "default": 2,
        "unit": "starts",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "E",
        "label": "Pitch diameter",
        "type": "number",
        "default": 40,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "involute-spline",
    "name": "Involute Spline Basic Dimensions (ANSI B92.1)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What are the basic diameters and space width of this involute spline?",
    "description": "Pitch, base, major, minor and form diameters, circular pitch and minimum effective space width of 30° and 37.5° involute splines by the ANSI B92.1 basic formulas, for side-fit and major-diameter-fit variants.",
    "keywords": [
      "MAKEOS",
      "involute spline",
      "ANSI B92.1",
      "spline dimensions",
      "major diameter fit",
      "side fit",
      "diametral pitch"
    ],
    "fields": [
      {
        "key": "Pd",
        "label": "Diametral pitch P (e.g. 16 for 16/32)",
        "type": "number",
        "default": 16,
        "unit": "1/in",
        "min": 0.000001,
        "max": 128,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 6,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "type",
        "label": "Spline type",
        "type": "select",
        "default": "30flat",
        "options": [
          [
            "30flat",
            "30° flat root, side fit"
          ],
          [
            "30major",
            "30° flat root, major diameter fit"
          ],
          [
            "30fillet",
            "30° fillet root, side fit"
          ],
          [
            "37fillet",
            "37.5° fillet root, side fit"
          ]
        ]
      }
    ]
  },
  {
    "id": "gear-cutter-number",
    "name": "Involute Gear Cutter Number",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "Which involute gear milling cutter number should cut this spur, helical or bevel gear?",
    "description": "The standard involute gear milling cutter number (1 to 8, and the half-number series) for a spur gear, or for a helical or bevel gear from its formative (equivalent) number of teeth.",
    "keywords": [
      "MAKEOS",
      "gear cutter",
      "involute cutter number",
      "formative teeth",
      "helical gear milling",
      "bevel gear cutter",
      "dividing head"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Gear type",
        "type": "select",
        "default": "helical",
        "options": [
          [
            "spur",
            "Spur gear"
          ],
          [
            "helical",
            "Helical gear"
          ],
          [
            "bevel",
            "Bevel gear"
          ]
        ]
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 30,
        "unit": "teeth",
        "min": 12,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "helix",
        "label": "Helix angle (helical)",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pitchAngle",
        "label": "Pitch cone angle (bevel)",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 1,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "crossed-helical-gears",
    "name": "Crossed Helical Gears (Shafts at Right Angles)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What diameters and centre distance does this crossed helical gear pair at 90° have?",
    "description": "Pitch and outside diameters, centre distance, leads and ratio of a pair of helical gears on shafts at right angles, from normal diametral pitch, tooth counts and the gear helix angle.",
    "keywords": [
      "MAKEOS",
      "crossed helical gears",
      "spiral gears",
      "shafts at right angles",
      "helix angle",
      "centre distance",
      "skew gears"
    ],
    "fields": [
      {
        "key": "Pn",
        "label": "Normal diametral pitch",
        "type": "number",
        "default": 8,
        "unit": "1/in",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Pinion teeth",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 5,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Nt",
        "label": "Gear teeth",
        "type": "number",
        "default": 40,
        "unit": "teeth",
        "min": 5,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "psi",
        "label": "Gear helix angle (pinion = 90° − this)",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 5,
        "max": 85,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "keyseat-depth",
    "name": "Keyseat Depth and Measurement over Key",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What depths should be measured when cutting this keyseat in a round shaft?",
    "description": "Chordal height at the keyseat edge, keyseat depth at the shaft centre-line, the measurement from the bottom of the keyseat to the opposite side of the shaft, and from the top of the key to the opposite side.",
    "keywords": [
      "MAKEOS",
      "keyseat depth",
      "keyway",
      "chordal height",
      "shaft key",
      "milling keyseat",
      "measurement"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Shaft diameter",
        "type": "number",
        "default": 40,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Key width",
        "type": "number",
        "default": 12,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Keyseat depth at the side (from the edge)",
        "type": "number",
        "default": 5,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Key height",
        "type": "number",
        "default": 8,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "arc-radius-rolls",
    "name": "Arc Radius from Measurement over Rolls",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What radius does this concave or convex gauge or part have, from a measurement over two rolls?",
    "description": "Radius of a large concave or convex arc from the distance over two equal rolls and the height of the arc above the surface plate, by the handbook construction.",
    "keywords": [
      "MAKEOS",
      "radius gauge",
      "measurement over rolls",
      "concave",
      "convex",
      "large radius",
      "surface plate"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Arc",
        "type": "select",
        "default": "concave",
        "options": [
          [
            "concave",
            "Concave (arc bridges the rolls; H = height of the arc’s top)"
          ],
          [
            "convex",
            "Convex (arc rests on the rolls; H = height of the arc’s lowest point)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Roll diameter",
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
        "key": "L",
        "label": "Measurement over the rolls",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hh",
        "label": "Height of the arc above the plate",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bolt-circle-pins",
    "name": "Bolt Circle Measurement over Pins",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What is the distance across opposite holes of this bolt circle, measured over plugs?",
    "description": "Distance over plugs in opposite (or most widely spaced) holes of a bolt circle and the bolt circle diameter, from a measurement over adjacent or alternate plugs.",
    "keywords": [
      "MAKEOS",
      "bolt circle",
      "measurement over pins",
      "plugs",
      "hole spacing",
      "PCD",
      "die inspection"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of holes",
        "type": "number",
        "default": 6,
        "unit": "holes",
        "min": 3,
        "max": 360,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d",
        "label": "Plug (hole) diameter",
        "type": "number",
        "default": 0.75,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mode",
        "label": "Measured over",
        "type": "select",
        "default": "alt",
        "options": [
          [
            "alt",
            "Alternate plugs (y)"
          ],
          [
            "adj",
            "Adjacent plugs (c)"
          ]
        ]
      },
      {
        "key": "m",
        "label": "Measurement over the plugs",
        "type": "number",
        "default": 4.5,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "taper-discs",
    "name": "Taper and Angle Gauges with Discs",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What angle or taper do these two discs set, or where must they be placed for a required taper?",
    "description": "Angle and taper per foot set by two discs at a centre distance, the centre distance for a required angle or taper (on the centre-line or from one side), and the disc size for a given angle, using the handbook’s disc gauge rules.",
    "keywords": [
      "MAKEOS",
      "taper gauge",
      "discs",
      "angle setting",
      "taper per foot",
      "sine",
      "toolroom"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "angle",
        "options": [
          [
            "angle",
            "Angle and taper from D, d and C"
          ],
          [
            "cTaper",
            "Centre distance for a taper per foot (centre-line)"
          ],
          [
            "cAngle",
            "Centre distance for an angle"
          ],
          [
            "cSide",
            "Centre distance for a taper measured from one side"
          ],
          [
            "disk",
            "Large disc to touch a small disc at an angle"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Large disc diameter",
        "type": "number",
        "default": 1.5,
        "unit": "in",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Small disc diameter",
        "type": "number",
        "default": 1,
        "unit": "in",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance",
        "type": "number",
        "default": 5,
        "unit": "in",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Included angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 0.001,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Taper per foot (on diameter)",
        "type": "number",
        "default": 0.75,
        "unit": "in/ft",
        "min": 0.0001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "drill-size-lookup",
    "name": "Drill Sizes: Number, Letter, Fraction and Metric",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What is the decimal size of this number or letter drill, or which drills are closest to a size?",
    "description": "Decimal inch and millimetre size of number (1–80) and letter (A–Z) drills, and the nearest number, letter, fractional (1/64) and metric (0.1 mm) drills to any diameter.",
    "keywords": [
      "MAKEOS",
      "drill sizes",
      "number drills",
      "letter drills",
      "wire gauge drills",
      "decimal equivalent",
      "drill chart"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Look up",
        "type": "select",
        "default": "size",
        "options": [
          [
            "size",
            "Nearest drills to a diameter"
          ],
          [
            "code",
            "Size of a number or letter drill"
          ]
        ]
      },
      {
        "key": "dia",
        "label": "Diameter",
        "type": "number",
        "default": 6.8,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "unit",
        "label": "Unit of diameter",
        "type": "select",
        "default": "mm",
        "options": [
          [
            "mm",
            "mm"
          ],
          [
            "in",
            "in"
          ]
        ]
      },
      {
        "key": "code",
        "label": "Drill designation",
        "type": "select",
        "default": "#7",
        "options": [
          [
            "#1",
            "No. 1"
          ],
          [
            "#2",
            "No. 2"
          ],
          [
            "#3",
            "No. 3"
          ],
          [
            "#4",
            "No. 4"
          ],
          [
            "#5",
            "No. 5"
          ],
          [
            "#6",
            "No. 6"
          ],
          [
            "#7",
            "No. 7"
          ],
          [
            "#8",
            "No. 8"
          ],
          [
            "#9",
            "No. 9"
          ],
          [
            "#10",
            "No. 10"
          ],
          [
            "#11",
            "No. 11"
          ],
          [
            "#12",
            "No. 12"
          ],
          [
            "#13",
            "No. 13"
          ],
          [
            "#14",
            "No. 14"
          ],
          [
            "#15",
            "No. 15"
          ],
          [
            "#16",
            "No. 16"
          ],
          [
            "#17",
            "No. 17"
          ],
          [
            "#18",
            "No. 18"
          ],
          [
            "#19",
            "No. 19"
          ],
          [
            "#20",
            "No. 20"
          ],
          [
            "#21",
            "No. 21"
          ],
          [
            "#22",
            "No. 22"
          ],
          [
            "#23",
            "No. 23"
          ],
          [
            "#24",
            "No. 24"
          ],
          [
            "#25",
            "No. 25"
          ],
          [
            "#26",
            "No. 26"
          ],
          [
            "#27",
            "No. 27"
          ],
          [
            "#28",
            "No. 28"
          ],
          [
            "#29",
            "No. 29"
          ],
          [
            "#30",
            "No. 30"
          ],
          [
            "#31",
            "No. 31"
          ],
          [
            "#32",
            "No. 32"
          ],
          [
            "#33",
            "No. 33"
          ],
          [
            "#34",
            "No. 34"
          ],
          [
            "#35",
            "No. 35"
          ],
          [
            "#36",
            "No. 36"
          ],
          [
            "#37",
            "No. 37"
          ],
          [
            "#38",
            "No. 38"
          ],
          [
            "#39",
            "No. 39"
          ],
          [
            "#40",
            "No. 40"
          ],
          [
            "#41",
            "No. 41"
          ],
          [
            "#42",
            "No. 42"
          ],
          [
            "#43",
            "No. 43"
          ],
          [
            "#44",
            "No. 44"
          ],
          [
            "#45",
            "No. 45"
          ],
          [
            "#46",
            "No. 46"
          ],
          [
            "#47",
            "No. 47"
          ],
          [
            "#48",
            "No. 48"
          ],
          [
            "#49",
            "No. 49"
          ],
          [
            "#50",
            "No. 50"
          ],
          [
            "#51",
            "No. 51"
          ],
          [
            "#52",
            "No. 52"
          ],
          [
            "#53",
            "No. 53"
          ],
          [
            "#54",
            "No. 54"
          ],
          [
            "#55",
            "No. 55"
          ],
          [
            "#56",
            "No. 56"
          ],
          [
            "#57",
            "No. 57"
          ],
          [
            "#58",
            "No. 58"
          ],
          [
            "#59",
            "No. 59"
          ],
          [
            "#60",
            "No. 60"
          ],
          [
            "#61",
            "No. 61"
          ],
          [
            "#62",
            "No. 62"
          ],
          [
            "#63",
            "No. 63"
          ],
          [
            "#64",
            "No. 64"
          ],
          [
            "#65",
            "No. 65"
          ],
          [
            "#66",
            "No. 66"
          ],
          [
            "#67",
            "No. 67"
          ],
          [
            "#68",
            "No. 68"
          ],
          [
            "#69",
            "No. 69"
          ],
          [
            "#70",
            "No. 70"
          ],
          [
            "#71",
            "No. 71"
          ],
          [
            "#72",
            "No. 72"
          ],
          [
            "#73",
            "No. 73"
          ],
          [
            "#74",
            "No. 74"
          ],
          [
            "#75",
            "No. 75"
          ],
          [
            "#76",
            "No. 76"
          ],
          [
            "#77",
            "No. 77"
          ],
          [
            "#78",
            "No. 78"
          ],
          [
            "#79",
            "No. 79"
          ],
          [
            "#80",
            "No. 80"
          ],
          [
            "A",
            "Letter A"
          ],
          [
            "B",
            "Letter B"
          ],
          [
            "C",
            "Letter C"
          ],
          [
            "D",
            "Letter D"
          ],
          [
            "E",
            "Letter E"
          ],
          [
            "F",
            "Letter F"
          ],
          [
            "G",
            "Letter G"
          ],
          [
            "H",
            "Letter H"
          ],
          [
            "I",
            "Letter I"
          ],
          [
            "J",
            "Letter J"
          ],
          [
            "K",
            "Letter K"
          ],
          [
            "L",
            "Letter L"
          ],
          [
            "M",
            "Letter M"
          ],
          [
            "N",
            "Letter N"
          ],
          [
            "O",
            "Letter O"
          ],
          [
            "P",
            "Letter P"
          ],
          [
            "Q",
            "Letter Q"
          ],
          [
            "R",
            "Letter R"
          ],
          [
            "S",
            "Letter S"
          ],
          [
            "T",
            "Letter T"
          ],
          [
            "U",
            "Letter U"
          ],
          [
            "V",
            "Letter V"
          ],
          [
            "W",
            "Letter W"
          ],
          [
            "X",
            "Letter X"
          ],
          [
            "Y",
            "Letter Y"
          ],
          [
            "Z",
            "Letter Z"
          ]
        ]
      }
    ]
  },
  {
    "id": "full-power-cutting-speed",
    "name": "Cutting Speed or Feed for Full Machine Power",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How fast can this cut run before it uses all the available spindle power?",
    "description": "Highest cutting speed (turning) or table feed (milling) that uses the available spindle power for a given depth, feed or width of cut and specific cutting force.",
    "keywords": [
      "MAKEOS",
      "machine power",
      "maximum cutting speed",
      "maximum feed",
      "roughing",
      "kc",
      "power limited"
    ],
    "fields": [
      {
        "key": "op",
        "label": "Operation",
        "type": "select",
        "default": "turn",
        "options": [
          [
            "turn",
            "Turning"
          ],
          [
            "mill",
            "Milling"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Available spindle power",
        "type": "number",
        "default": 11,
        "unit": "kW",
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
        "key": "ap",
        "label": "Depth of cut (axial in milling)",
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
        "key": "f",
        "label": "Feed (turning)",
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
        "key": "D",
        "label": "Workpiece diameter (turning)",
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
        "key": "ae",
        "label": "Width of cut (milling)",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "belt-length-crossed-three",
    "name": "Crossed Belt and Three-Pulley Belt Length",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How long is the belt for this crossed drive or for a belt around three pulleys?",
    "description": "Belt length for a crossed (reversing) two-pulley drive, with the open-belt length for comparison, or for a belt wrapped around the outside of three pulleys at given positions, with wrap angles.",
    "keywords": [
      "MAKEOS",
      "belt length",
      "crossed belt",
      "three pulleys",
      "serpentine",
      "wrap angle",
      "flat belt"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Drive",
        "type": "select",
        "default": "three",
        "options": [
          [
            "crossed",
            "Crossed belt, two pulleys"
          ],
          [
            "three",
            "Open belt around three pulleys"
          ]
        ]
      },
      {
        "key": "D1",
        "label": "Pulley 1 diameter",
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
        "label": "Pulley 2 diameter",
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
        "key": "D3",
        "label": "Pulley 3 diameter (three-pulley)",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance (crossed)",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_pulley_positions_three_pulley_",
        "label": "Pulley positions (three-pulley)",
        "type": "heading"
      },
      {
        "key": "x2",
        "label": "Pulley 2 X",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Pulley 2 Y",
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
        "key": "x3",
        "label": "Pulley 3 X",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Pulley 3 Y",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
