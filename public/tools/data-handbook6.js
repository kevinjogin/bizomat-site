// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook6) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "bolt-torque-preload",
    "name": "Bolt Tightening Torque and Preload",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What preload does this torque give, or what torque gives the target preload?",
    "description": "Relation between tightening torque and bolt preload for metric bolts using the nut factor (T = K F d), with stress in the tensile stress area and the share of proof load.",
    "keywords": [
      "MAKEOS",
      "bolt torque",
      "preload",
      "clamp force",
      "nut factor",
      "tightening torque",
      "proof load"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "torque",
        "options": [
          [
            "torque",
            "Torque for a target preload (% of proof)"
          ],
          [
            "preload",
            "Preload from a tightening torque"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Nominal diameter",
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
        "key": "P",
        "label": "Thread pitch",
        "type": "number",
        "default": 1.75,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Nut factor K",
        "type": "number",
        "default": 0.2,
        "unit": "",
        "min": 0.05,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sp",
        "label": "Proof strength of the bolt",
        "type": "number",
        "default": 600,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pct",
        "label": "Target preload as % of proof load",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Tightening torque",
        "type": "number",
        "default": 80,
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
    "id": "thread-engagement",
    "name": "Thread Length of Engagement",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "How long must the thread engagement be so the bolt breaks before the threads strip?",
    "description": "Minimum length of engagement for a metric or unified thread so that the external thread does not strip before the screw breaks, with the extra length needed when the tapped material is weaker.",
    "keywords": [
      "MAKEOS",
      "length of engagement",
      "thread stripping",
      "tapped hole",
      "aluminium thread",
      "shear area"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Basic major diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
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
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Knmax",
        "label": "Maximum minor diameter of internal thread (0 = basic)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Esmin",
        "label": "Minimum pitch diameter of external thread (0 = basic)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dsmin",
        "label": "Minimum major diameter of external thread (0 = basic)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Enmax",
        "label": "Maximum pitch diameter of internal thread (0 = basic)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sub",
        "label": "Tensile strength of the screw",
        "type": "number",
        "default": 800,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sun",
        "label": "Tensile strength of the tapped material",
        "type": "number",
        "default": 310,
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
    "id": "bolted-joint",
    "name": "Bolted Joint Load Sharing and Separation",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "How much of the external load reaches the bolt, and when will the joint separate?",
    "description": "Bolt and member stiffness, joint constant, bolt load, remaining clamp force and separation load of a preloaded tension joint, with an optional frustum estimate of member stiffness.",
    "keywords": [
      "MAKEOS",
      "bolted joint",
      "joint stiffness",
      "separation",
      "clamp force",
      "load factor",
      "VDI 2230"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nominal diameter",
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
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 1.75,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "grip",
        "label": "Grip length (clamped thickness)",
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
        "key": "Lt",
        "label": "Threaded length within the grip",
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
        "key": "Eb",
        "label": "Bolt elastic modulus",
        "type": "number",
        "default": 207,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kmMode",
        "label": "Member stiffness",
        "type": "select",
        "default": "frustum",
        "options": [
          [
            "frustum",
            "Estimate (30° frustum, one material)"
          ],
          [
            "entered",
            "Enter a value"
          ]
        ]
      },
      {
        "key": "Em",
        "label": "Member elastic modulus",
        "type": "number",
        "default": 207,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "km",
        "label": "Member stiffness (if entered)",
        "type": "number",
        "default": 3000,
        "unit": "kN/mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fi",
        "label": "Bolt preload",
        "type": "number",
        "default": 35,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pext",
        "label": "External tensile load per bolt",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sp",
        "label": "Proof strength of the bolt",
        "type": "number",
        "default": 600,
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
    "id": "bolt-shear-bearing",
    "name": "Bolt and Pin Shear and Bearing",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Are these bolts or pins strong enough in shear and bearing for this load?",
    "description": "Shear stress in bolts, dowels or clevis pins in single or double shear and the bearing stress on the plate, compared with allowable values.",
    "keywords": [
      "MAKEOS",
      "shear",
      "double shear",
      "clevis pin",
      "dowel",
      "bearing stress",
      "lap joint"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Total load",
        "type": "number",
        "default": 20000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of bolts or pins",
        "type": "number",
        "default": 2,
        "unit": "fasteners",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "planes",
        "label": "Shear planes per fastener",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Single shear"
          ],
          [
            "2",
            "Double shear"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Diameter at the shear plane",
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
        "key": "t",
        "label": "Thinnest plate thickness in bearing",
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
        "key": "tauAllow",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bAllow",
        "label": "Allowable bearing stress",
        "type": "number",
        "default": 250,
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
    "id": "riveted-joint",
    "name": "Riveted Lap Joint Efficiency",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "How strong is this riveted joint compared with the solid plate, and how will it fail?",
    "description": "Strength of a riveted lap or butt joint per pitch by plate tearing, rivet shearing and crushing, and the joint efficiency compared with the solid plate.",
    "keywords": [
      "MAKEOS",
      "riveted joint",
      "joint efficiency",
      "rivet pitch",
      "tearing",
      "crushing",
      "lap joint"
    ],
    "fields": [
      {
        "key": "p",
        "label": "Rivet pitch (along the seam)",
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
        "key": "d",
        "label": "Rivet hole diameter",
        "type": "number",
        "default": 16,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Plate thickness",
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
        "key": "rows",
        "label": "Rivets per pitch (rows)",
        "type": "number",
        "default": 1,
        "unit": "rivets",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "shear",
        "label": "Shear planes per rivet",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Single shear (lap joint)"
          ],
          [
            "2",
            "Double shear (butt joint with two straps)"
          ]
        ]
      },
      {
        "key": "st",
        "label": "Allowable tensile stress of plate",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tau",
        "label": "Allowable shear stress of rivet",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sc",
        "label": "Allowable crushing stress",
        "type": "number",
        "default": 250,
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
    "id": "tap-drill",
    "name": "Tap Drill for Percentage of Thread",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What drill size gives the required percentage of thread for a cutting or forming tap?",
    "description": "Theoretical tap drill or hole size for a chosen percentage of thread, for cutting taps and cold-forming (roll) taps, in metric or unified threads.",
    "keywords": [
      "MAKEOS",
      "tap drill",
      "percent thread",
      "forming tap",
      "roll tap",
      "thread depth",
      "drill size"
    ],
    "fields": [
      {
        "key": "system",
        "label": "Thread system",
        "type": "select",
        "default": "metric",
        "options": [
          [
            "metric",
            "Metric (size in mm, pitch in mm)"
          ],
          [
            "unified",
            "Unified (size in inches, threads per inch)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Basic major diameter",
        "type": "number",
        "default": 10,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pitch",
        "label": "Pitch (metric)",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tpi",
        "label": "Threads per inch (unified)",
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
        "key": "pct",
        "label": "Percentage of thread",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tap",
        "label": "Tap type",
        "type": "select",
        "default": "cut",
        "options": [
          [
            "cut",
            "Cutting tap"
          ],
          [
            "form",
            "Forming (roll) tap"
          ]
        ]
      }
    ]
  },
  {
    "id": "metric-thread",
    "name": "ISO Metric Thread Basic Dimensions",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the basic pitch, minor and root diameters and stress area of this metric thread?",
    "description": "Basic dimensions of an ISO metric (M) thread from nominal diameter and pitch: pitch and minor diameters, thread height, tensile stress area, lead angle and proof load.",
    "keywords": [
      "MAKEOS",
      "metric thread",
      "ISO 68",
      "pitch diameter",
      "minor diameter",
      "stress area",
      "M thread"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nominal diameter",
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
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 1.75,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "starts",
        "label": "Number of starts",
        "type": "number",
        "default": 1,
        "unit": "starts",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Sp",
        "label": "Proof strength (0 = not needed)",
        "type": "number",
        "default": 600,
        "unit": "MPa",
        "min": 0,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "unified-thread",
    "name": "Unified Inch Thread Basic Dimensions",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the basic pitch and minor diameters and stress area of this UNC or UNF thread?",
    "description": "Basic dimensions of a Unified (UN/UNR) inch thread from its major diameter and threads per inch, in inches and millimetres.",
    "keywords": [
      "MAKEOS",
      "unified thread",
      "UNC",
      "UNF",
      "TPI",
      "pitch diameter",
      "stress area"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Basic major diameter",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.000001,
        "max": 40,
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
      }
    ]
  },
  {
    "id": "three-wire",
    "name": "Three-Wire Thread Measurement",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What should the measurement over three wires read for this thread, or what pitch diameter does a reading give?",
    "description": "Measurement over wires for 60°, 55° and 29° threads from the pitch diameter and wire size, the best wire size, and the pitch diameter from a measured reading.",
    "keywords": [
      "MAKEOS",
      "three-wire",
      "thread measurement",
      "best wire",
      "pitch diameter",
      "over wires",
      "Acme"
    ],
    "fields": [
      {
        "key": "angle",
        "label": "Thread angle",
        "type": "select",
        "default": "60",
        "options": [
          [
            "60",
            "60° (metric, unified)"
          ],
          [
            "55",
            "55° (Whitworth)"
          ],
          [
            "29",
            "29° (Acme)"
          ],
          [
            "30",
            "30° (metric trapezoidal)"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 1.75,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Pitch diameter (target)",
        "type": "number",
        "default": 10.863,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Wire diameter (0 = best size)",
        "type": "number",
        "default": 0,
        "unit": "mm or in",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mmeas",
        "label": "Measured reading over wires (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "mm or in",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "screw-efficiency",
    "name": "Thread Helix Angle and Screw Efficiency",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What is the helix angle of this thread, how efficient is it, and will it self-lock?",
    "description": "Lead, helix (lead) angle, efficiency raising a load and self-locking check for a power or fastening screw with a given flank angle and friction coefficient.",
    "keywords": [
      "MAKEOS",
      "lead angle",
      "helix angle",
      "power screw",
      "self-locking",
      "Acme efficiency",
      "back-driving"
    ],
    "fields": [
      {
        "key": "d2",
        "label": "Pitch diameter",
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
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "starts",
        "label": "Number of starts",
        "type": "number",
        "default": 1,
        "unit": "starts",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "flank",
        "label": "Thread form",
        "type": "select",
        "default": "14.5",
        "options": [
          [
            "0",
            "Square (0° flank)"
          ],
          [
            "14.5",
            "Acme (29° included)"
          ],
          [
            "15",
            "Trapezoidal (30° included)"
          ],
          [
            "30",
            "V-thread (60° included)"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Coefficient of friction",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "simple-indexing",
    "name": "Simple Indexing on a Dividing Head",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "How many crank turns and holes give this number of divisions on a dividing head?",
    "description": "Crank movement for simple indexing (whole turns plus holes in a circle) for a 40:1 or other worm ratio, using Brown & Sharpe or Cincinnati standard plate hole circles.",
    "keywords": [
      "MAKEOS",
      "indexing",
      "dividing head",
      "index plate",
      "hole circle",
      "divisions",
      "gear cutting"
    ],
    "fields": [
      {
        "key": "divisions",
        "label": "Number of divisions",
        "type": "number",
        "default": 27,
        "unit": "divisions",
        "min": 2,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "ratio",
        "label": "Worm ratio (crank turns per spindle turn)",
        "type": "number",
        "default": 40,
        "unit": ":1",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "plates",
        "label": "Index plates available",
        "type": "select",
        "default": "bs",
        "options": [
          [
            "bs",
            "Brown & Sharpe plates 1–3"
          ],
          [
            "cin",
            "Cincinnati standard plate (both sides)"
          ]
        ]
      }
    ]
  },
  {
    "id": "change-gears",
    "name": "Change Gears for Thread Cutting",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "Which change gears cut this thread lead on this lathe?",
    "description": "Best simple and compound change-gear trains from a standard gear set to cut a required metric or inch lead with a given leadscrew, with the resulting lead error.",
    "keywords": [
      "MAKEOS",
      "change gears",
      "thread cutting",
      "lathe",
      "compound gear train",
      "127 tooth",
      "leadscrew"
    ],
    "fields": [
      {
        "key": "cutUnit",
        "label": "Thread to cut is given as",
        "type": "select",
        "default": "mm",
        "options": [
          [
            "mm",
            "Pitch in mm"
          ],
          [
            "tpi",
            "Threads per inch"
          ]
        ]
      },
      {
        "key": "cut",
        "label": "Thread to cut",
        "type": "number",
        "default": 1.5,
        "unit": "mm or TPI",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "screwUnit",
        "label": "Leadscrew is given as",
        "type": "select",
        "default": "tpi",
        "options": [
          [
            "tpi",
            "Threads per inch"
          ],
          [
            "mm",
            "Pitch in mm"
          ]
        ]
      },
      {
        "key": "screw",
        "label": "Leadscrew",
        "type": "number",
        "default": 8,
        "unit": "mm or TPI",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fixed",
        "label": "Fixed ratio in the headstock (spindle to stud)",
        "type": "number",
        "default": 1,
        "unit": ":1",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "set",
        "label": "Gear set",
        "type": "select",
        "default": "g5",
        "options": [
          [
            "g5",
            "20 to 120 in steps of 5, plus 127"
          ],
          [
            "g4",
            "24 to 96 in steps of 4, plus 127"
          ]
        ]
      }
    ]
  },
  {
    "id": "helical-gear",
    "name": "Helical Gear Pair Geometry",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What diameters, centre distance and contact ratios does this helical gear pair have?",
    "description": "Transverse module, pitch and tip diameters, centre distance, transverse pressure angle, virtual teeth, axial pitch and overlap ratio for a standard (unshifted) parallel-axis helical gear pair.",
    "keywords": [
      "MAKEOS",
      "helical gear",
      "normal module",
      "helix angle",
      "centre distance",
      "overlap ratio",
      "virtual teeth"
    ],
    "fields": [
      {
        "key": "mn",
        "label": "Normal module",
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
        "key": "beta",
        "label": "Helix angle",
        "type": "number",
        "default": 15,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alphan",
        "label": "Normal pressure angle",
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
        "key": "z1",
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
        "key": "z2",
        "label": "Gear teeth",
        "type": "number",
        "default": 45,
        "unit": "teeth",
        "min": 5,
        "max": 5000,
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
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-forces",
    "name": "Gear Tooth Forces",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What tangential, radial and axial forces does this gear mesh put on the shafts?",
    "description": "Tangential, radial (separating) and axial (thrust) tooth forces of a spur or helical gear from power, speed and pitch diameter, for shaft and bearing loads.",
    "keywords": [
      "MAKEOS",
      "gear forces",
      "tangential force",
      "radial force",
      "axial thrust",
      "bearing loads",
      "helical thrust"
    ],
    "fields": [
      {
        "key": "kW",
        "label": "Power transmitted",
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
        "key": "rpm",
        "label": "Speed of this gear",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pitch diameter of this gear",
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
        "key": "alphan",
        "label": "Normal pressure angle",
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
        "key": "beta",
        "label": "Helix angle (0 = spur)",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "lewis-bending",
    "name": "Gear Tooth Bending Stress (Lewis)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What bending stress does the tooth load cause at the tooth root, by the Lewis equation?",
    "description": "Lewis tooth bending stress with the Barth velocity factor for the manufacturing method, compared with an allowable stress, as a first check before a full gear rating.",
    "keywords": [
      "MAKEOS",
      "Lewis equation",
      "tooth bending",
      "form factor",
      "Barth velocity factor",
      "gear strength"
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
        "key": "m",
        "label": "Module",
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
        "key": "b",
        "label": "Face width",
        "type": "number",
        "default": 35,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Lewis form factor Y",
        "type": "number",
        "default": 0.32,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pitch diameter",
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
        "key": "rpm",
        "label": "Speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "make",
        "label": "Tooth manufacture",
        "type": "select",
        "default": "hobbed",
        "options": [
          [
            "cast",
            "Cast teeth"
          ],
          [
            "cut",
            "Cut or milled"
          ],
          [
            "hobbed",
            "Hobbed or shaped"
          ],
          [
            "ground",
            "Shaved or ground"
          ]
        ]
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 150,
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
    "id": "worm-gear",
    "name": "Worm Gear Geometry and Efficiency",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What ratio, lead angle, centre distance and efficiency does this worm drive have, and will it back-drive?",
    "description": "Ratio, lead and lead angle, wheel diameter, centre distance, forward efficiency and back-driving efficiency of a worm and wheel from module, starts, teeth and friction.",
    "keywords": [
      "MAKEOS",
      "worm gear",
      "worm wheel",
      "lead angle",
      "self-locking",
      "efficiency",
      "reduction"
    ],
    "fields": [
      {
        "key": "mx",
        "label": "Axial module of worm",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Worm starts",
        "type": "number",
        "default": 1,
        "unit": "starts",
        "min": 1,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Wheel teeth",
        "type": "number",
        "default": 40,
        "unit": "teeth",
        "min": 10,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d1",
        "label": "Worm pitch diameter",
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
        "key": "alphan",
        "label": "Normal pressure angle",
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
        "key": "mu",
        "label": "Coefficient of friction",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0.005,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bevel-gear",
    "name": "Straight Bevel Gear Geometry",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What pitch angles, cone distance and diameters does this bevel gear pair have?",
    "description": "Pitch cone angles, pitch and outside diameters, outer cone distance and face-width ratio of a straight bevel gear pair at any shaft angle.",
    "keywords": [
      "MAKEOS",
      "bevel gear",
      "pitch angle",
      "cone distance",
      "mitre gear",
      "right-angle drive"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module at the outer end",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Pinion teeth",
        "type": "number",
        "default": 18,
        "unit": "teeth",
        "min": 5,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Gear teeth",
        "type": "number",
        "default": 36,
        "unit": "teeth",
        "min": 5,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "shaft",
        "label": "Shaft angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 10,
        "max": 170,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Face width",
        "type": "number",
        "default": 22,
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
    "id": "chordal-tooth",
    "name": "Gear Chordal Thickness and Addendum",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What chordal thickness and chordal addendum should a gear tooth caliper read?",
    "description": "Chordal tooth thickness and corrected (chordal) addendum for measuring spur gear teeth with a gear tooth vernier caliper.",
    "keywords": [
      "MAKEOS",
      "chordal thickness",
      "chordal addendum",
      "gear tooth caliper",
      "tooth thickness",
      "inspection"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
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
        "key": "z",
        "label": "Number of teeth",
        "type": "number",
        "default": 30,
        "unit": "teeth",
        "min": 5,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "a",
        "label": "Addendum (0 = one module)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Arc tooth thickness at pitch circle (0 = standard π m ÷ 2)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "span-measurement",
    "name": "Gear Span (Base Tangent) Measurement",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What should the span measurement over k teeth read for this spur or helical gear?",
    "description": "Base tangent length (span measurement, Wildhaber) over k teeth for external spur and helical gears, including profile shift, with the number of teeth to span.",
    "keywords": [
      "MAKEOS",
      "span measurement",
      "base tangent length",
      "Wildhaber",
      "tooth thickness",
      "gear inspection",
      "disc micrometer"
    ],
    "fields": [
      {
        "key": "mn",
        "label": "Normal module",
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
        "key": "z",
        "label": "Number of teeth",
        "type": "number",
        "default": 30,
        "unit": "teeth",
        "min": 5,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "alphan",
        "label": "Normal pressure angle",
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
        "key": "beta",
        "label": "Helix angle (0 = spur)",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Profile shift coefficient",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Teeth spanned (0 = recommended)",
        "type": "number",
        "default": 0,
        "unit": "teeth",
        "min": 0,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b",
        "label": "Face width (helical check)",
        "type": "number",
        "default": 30,
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
    "id": "gear-over-pins",
    "name": "Spur Gear Measurement over Pins",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What should the measurement over two pins read for this external spur gear?",
    "description": "Measurement over two pins (or balls) for an external spur gear with even or odd teeth, from the tooth thickness and pin size, by the involute function.",
    "keywords": [
      "MAKEOS",
      "over pins",
      "over balls",
      "gear measurement",
      "involute",
      "tooth thickness",
      "MOP"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Number of teeth",
        "type": "number",
        "default": 25,
        "unit": "teeth",
        "min": 6,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
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
        "key": "x",
        "label": "Profile shift coefficient",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thin",
        "label": "Tooth thinning for backlash (arc, at pitch circle)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pin diameter (0 = 1.728 × module)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-train",
    "name": "Gear Train Ratio, Speed and Torque",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What is the overall ratio, output speed and output torque of this gear train?",
    "description": "Overall ratio, output speed, direction, output torque and efficiency of a simple or compound gear train with up to four meshes.",
    "keywords": [
      "MAKEOS",
      "gear train",
      "compound gears",
      "reduction ratio",
      "output speed",
      "output torque"
    ],
    "fields": [
      {
        "key": "nin",
        "label": "Input speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tin",
        "label": "Input torque",
        "type": "number",
        "default": 20,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Efficiency per mesh",
        "type": "number",
        "default": 98,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_mesh_1",
        "label": "Mesh 1",
        "type": "heading"
      },
      {
        "key": "a1",
        "label": "Driver teeth",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 0,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b1",
        "label": "Driven teeth",
        "type": "number",
        "default": 60,
        "unit": "teeth",
        "min": 0,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_mesh_2",
        "label": "Mesh 2",
        "type": "heading"
      },
      {
        "key": "a2",
        "label": "Driver teeth",
        "type": "number",
        "default": 18,
        "unit": "teeth",
        "min": 0,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b2",
        "label": "Driven teeth",
        "type": "number",
        "default": 54,
        "unit": "teeth",
        "min": 0,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_mesh_3",
        "label": "Mesh 3",
        "type": "heading"
      },
      {
        "key": "a3",
        "label": "Driver teeth",
        "type": "number",
        "default": 0,
        "unit": "teeth",
        "min": 0,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b3",
        "label": "Driven teeth",
        "type": "number",
        "default": 0,
        "unit": "teeth",
        "min": 0,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_mesh_4",
        "label": "Mesh 4",
        "type": "heading"
      },
      {
        "key": "a4",
        "label": "Driver teeth",
        "type": "number",
        "default": 0,
        "unit": "teeth",
        "min": 0,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b4",
        "label": "Driven teeth",
        "type": "number",
        "default": 0,
        "unit": "teeth",
        "min": 0,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "cam-motion",
    "name": "Cam Follower Peak Velocity and Acceleration",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What peak velocity, acceleration and inertia force does this cam rise produce?",
    "description": "Peak follower velocity and acceleration for simple harmonic, cycloidal, constant-acceleration and 3-4-5 polynomial rise motions at a given cam speed, with the follower inertia force.",
    "keywords": [
      "MAKEOS",
      "cam",
      "follower",
      "cycloidal motion",
      "simple harmonic",
      "3-4-5 polynomial",
      "acceleration"
    ],
    "fields": [
      {
        "key": "law",
        "label": "Motion law",
        "type": "select",
        "default": "cyc",
        "options": [
          [
            "shm",
            "Simple harmonic"
          ],
          [
            "cyc",
            "Cycloidal"
          ],
          [
            "parab",
            "Constant acceleration (parabolic)"
          ],
          [
            "poly",
            "3-4-5 polynomial"
          ]
        ]
      },
      {
        "key": "h",
        "label": "Rise (lift)",
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
        "default": 120,
        "unit": "°",
        "min": 1,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Cam speed",
        "type": "number",
        "default": 300,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Follower moving mass",
        "type": "number",
        "default": 1.5,
        "unit": "kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "belt-drive-tensions",
    "name": "Belt Drive Tensions and Shaft Load",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What belt tensions and shaft load are needed to transmit this power without slipping?",
    "description": "Effective pull, tight and slack side tensions at the slip limit, centrifugal tension and resulting shaft load of a flat or V-belt drive.",
    "keywords": [
      "MAKEOS",
      "belt tension",
      "shaft load",
      "V-belt",
      "flat belt",
      "effective pull",
      "centrifugal tension"
    ],
    "fields": [
      {
        "key": "kW",
        "label": "Power transmitted",
        "type": "number",
        "default": 7.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pulley pitch diameter",
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
        "key": "rpm",
        "label": "Pulley speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wrap",
        "label": "Wrap angle on this pulley",
        "type": "number",
        "default": 170,
        "unit": "°",
        "min": 30,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Coefficient of friction",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "groove",
        "label": "Groove included angle (0 = flat belt)",
        "type": "number",
        "default": 38,
        "unit": "°",
        "min": 0,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Belt mass per metre",
        "type": "number",
        "default": 0.2,
        "unit": "kg/m",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "chain-length",
    "name": "Roller Chain Length and Centre Distance",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How many links does this roller chain drive need, and what centre distance results?",
    "description": "Chain length in pitches for two sprockets at a centre distance, rounded to an even number of links, the exact centre distance for that length, and chain speed.",
    "keywords": [
      "MAKEOS",
      "roller chain",
      "chain length",
      "links",
      "sprocket",
      "centre distance",
      "chain drive"
    ],
    "fields": [
      {
        "key": "p",
        "label": "Chain pitch",
        "type": "number",
        "default": 15.875,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Small sprocket teeth",
        "type": "number",
        "default": 17,
        "unit": "teeth",
        "min": 6,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Large sprocket teeth",
        "type": "number",
        "default": 51,
        "unit": "teeth",
        "min": 6,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "C",
        "label": "Approximate centre distance",
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
        "key": "rpm",
        "label": "Small sprocket speed",
        "type": "number",
        "default": 300,
        "unit": "rpm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "reflected-inertia",
    "name": "Reflected Inertia and Motor Acceleration Torque",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What torque must the motor give to accelerate this load through the gearbox, and is the inertia ratio reasonable?",
    "description": "Load inertia reflected through a reduction, inertia ratio, acceleration torque and total motor torque to reach a speed in a given time against a load torque.",
    "keywords": [
      "MAKEOS",
      "reflected inertia",
      "inertia ratio",
      "motor sizing",
      "servo",
      "acceleration torque",
      "gearbox"
    ],
    "fields": [
      {
        "key": "JL",
        "label": "Load inertia (at the load shaft)",
        "type": "number",
        "default": 2,
        "unit": "kg·m²",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jm",
        "label": "Motor rotor inertia",
        "type": "number",
        "default": 0.0012,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Reduction ratio (motor ÷ load speed)",
        "type": "number",
        "default": 10,
        "unit": ":1",
        "min": 0.01,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Gearbox efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nL",
        "label": "Load speed to reach",
        "type": "number",
        "default": 150,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Acceleration time",
        "type": "number",
        "default": 0.5,
        "unit": "s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TL",
        "label": "Load torque at the load shaft",
        "type": "number",
        "default": 20,
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
    "id": "ballscrew-limits",
    "name": "Ball Screw Critical Speed and Buckling",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Is this ball screw below its critical speed and buckling load?",
    "description": "Critical (whirling) speed and Euler buckling load of a ball or lead screw from root diameter, unsupported length and end fixity, against the operating speed and axial load.",
    "keywords": [
      "MAKEOS",
      "ball screw",
      "critical speed",
      "buckling",
      "end fixity",
      "lead screw",
      "linear axis"
    ],
    "fields": [
      {
        "key": "dr",
        "label": "Root diameter",
        "type": "number",
        "default": 21,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Unsupported length",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "End mounting",
        "type": "select",
        "default": "fs",
        "options": [
          [
            "ff",
            "Fixed – fixed"
          ],
          [
            "fs",
            "Fixed – supported"
          ],
          [
            "ss",
            "Supported – supported"
          ],
          [
            "ffree",
            "Fixed – free"
          ]
        ]
      },
      {
        "key": "E",
        "label": "Elastic modulus",
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
        "key": "rho",
        "label": "Density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 50000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Maximum operating speed",
        "type": "number",
        "default": 2000,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fa",
        "label": "Maximum compressive axial load",
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
        "key": "speedPct",
        "label": "Allowed share of critical speed",
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
        "key": "loadPct",
        "label": "Allowed share of buckling load",
        "type": "number",
        "default": 50,
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
    "id": "clutch-torque",
    "name": "Plate Clutch and Disc Brake Torque",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How much torque can this plate clutch or disc brake transmit?",
    "description": "Torque capacity of a plate clutch or disc brake by the uniform-wear and uniform-pressure assumptions, with the peak lining pressure, against a required torque.",
    "keywords": [
      "MAKEOS",
      "clutch",
      "disc brake",
      "friction plate",
      "torque capacity",
      "uniform wear",
      "lining pressure"
    ],
    "fields": [
      {
        "key": "Do",
        "label": "Outer diameter of lining",
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
        "key": "Di",
        "label": "Inner diameter of lining",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "surfaces",
        "label": "Friction surfaces",
        "type": "number",
        "default": 2,
        "unit": "surfaces",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mu",
        "label": "Coefficient of friction",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Clamping (axial) force",
        "type": "number",
        "default": 4000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Treq",
        "label": "Required torque (with service factor)",
        "type": "number",
        "default": 200,
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
    "id": "motor-power",
    "name": "Three-Phase Motor Power, Current and Torque",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What current does this three-phase motor draw, or what power does a measured current mean?",
    "description": "Input power, output power, line current and shaft torque of a three-phase induction motor from voltage, power factor and efficiency.",
    "keywords": [
      "MAKEOS",
      "three-phase motor",
      "motor current",
      "power factor",
      "kW to amps",
      "motor torque",
      "induction motor"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculate",
        "type": "select",
        "default": "current",
        "options": [
          [
            "current",
            "Current from output power"
          ],
          [
            "power",
            "Output power from measured current"
          ]
        ]
      },
      {
        "key": "V",
        "label": "Line voltage",
        "type": "number",
        "default": 415,
        "unit": "V",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kW",
        "label": "Shaft output power",
        "type": "number",
        "default": 11,
        "unit": "kW",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Measured line current",
        "type": "number",
        "default": 20,
        "unit": "A",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pf",
        "label": "Power factor",
        "type": "number",
        "default": 0.85,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Efficiency",
        "type": "number",
        "default": 91,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Shaft speed",
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
    "id": "key-stress",
    "name": "Parallel Key Shear and Crushing",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Is this parallel key long enough for the torque in shear and crushing?",
    "description": "Shear and compressive (crushing) stress in a parallel key transmitting torque, the minimum key length for each, compared with allowable stresses.",
    "keywords": [
      "MAKEOS",
      "key",
      "keyway",
      "parallel key",
      "key length",
      "key shear",
      "crushing stress"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 400,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Shaft diameter",
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
        "key": "w",
        "label": "Key width",
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
        "key": "h",
        "label": "Key height",
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
        "key": "L",
        "label": "Effective key length",
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
        "key": "tauA",
        "label": "Allowable shear stress of key",
        "type": "number",
        "default": 60,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sigA",
        "label": "Allowable compressive stress (weakest of key, shaft, hub)",
        "type": "number",
        "default": 100,
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
    "id": "bearing-life-adjusted",
    "name": "Rolling Bearing Adjusted Rating Life",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "How many hours will this ball or roller bearing last at the required reliability?",
    "description": "Equivalent dynamic load from radial and axial loads, basic L10 life for ball or roller bearings, and life adjusted for reliability and a life modification factor, against a required life.",
    "keywords": [
      "MAKEOS",
      "bearing life",
      "L10",
      "adjusted rating life",
      "ISO 281",
      "equivalent load",
      "reliability factor"
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
            "Ball bearing (exponent 3)"
          ],
          [
            "roller",
            "Roller bearing (exponent 10/3)"
          ]
        ]
      },
      {
        "key": "C",
        "label": "Basic dynamic load rating C",
        "type": "number",
        "default": 52,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fr",
        "label": "Radial load",
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
        "key": "Fa",
        "label": "Axial load",
        "type": "number",
        "default": 1.5,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "X",
        "label": "Radial factor X",
        "type": "number",
        "default": 0.56,
        "unit": "",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Axial factor Y",
        "type": "number",
        "default": 1.6,
        "unit": "",
        "min": 0,
        "max": 10,
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
        "key": "rel",
        "label": "Reliability",
        "type": "select",
        "default": "90",
        "options": [
          [
            "90",
            "90% (a₁ = 1)"
          ],
          [
            "95",
            "95% (a₁ = 0.64)"
          ],
          [
            "96",
            "96% (a₁ = 0.55)"
          ],
          [
            "97",
            "97% (a₁ = 0.47)"
          ],
          [
            "98",
            "98% (a₁ = 0.37)"
          ],
          [
            "99",
            "99% (a₁ = 0.25)"
          ]
        ]
      },
      {
        "key": "aiso",
        "label": "Life modification factor a_ISO",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.01,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required life",
        "type": "number",
        "default": 15000,
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
    "id": "journal-bearing-pv",
    "name": "Plain Bearing Pressure, Velocity and PV",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "Are the pressure, sliding speed and PV of this bushing within the material’s limits?",
    "description": "Projected bearing pressure, sliding velocity and PV value of a plain (sleeve) bearing or bushing, compared with the limits of the bearing material.",
    "keywords": [
      "MAKEOS",
      "plain bearing",
      "bushing",
      "PV value",
      "sleeve bearing",
      "bronze bush",
      "polymer bearing"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Radial load",
        "type": "number",
        "default": 2000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
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
        "key": "L",
        "label": "Bearing length",
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
        "key": "rpm",
        "label": "Speed (or equivalent for oscillation)",
        "type": "number",
        "default": 200,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pmax",
        "label": "Maximum pressure of material",
        "type": "number",
        "default": 25,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vmax",
        "label": "Maximum sliding speed of material",
        "type": "number",
        "default": 2.5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PVmax",
        "label": "Maximum PV of material",
        "type": "number",
        "default": 1.6,
        "unit": "MPa·m/s",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "o-ring-gland",
    "name": "O-Ring Squeeze, Stretch and Gland Fill",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "Will this O-ring have the right squeeze, stretch and gland fill in this groove?",
    "description": "Squeeze, stretch (or circumferential compression), reduced cross-section and gland fill of an O-ring in a piston (male) or rod/bore (female) groove, compared with typical design ranges.",
    "keywords": [
      "MAKEOS",
      "O-ring",
      "gland",
      "squeeze",
      "stretch",
      "groove fill",
      "seal design"
    ],
    "fields": [
      {
        "key": "gland",
        "label": "Groove location",
        "type": "select",
        "default": "piston",
        "options": [
          [
            "piston",
            "Piston or male groove (ring stretched onto groove bottom)"
          ],
          [
            "rod",
            "Rod or female groove (ring fits in a bore groove)"
          ]
        ]
      },
      {
        "key": "duty",
        "label": "Duty",
        "type": "select",
        "default": "static",
        "options": [
          [
            "static",
            "Static"
          ],
          [
            "dynamic",
            "Dynamic (reciprocating)"
          ]
        ]
      },
      {
        "key": "id",
        "label": "O-ring inside diameter",
        "type": "number",
        "default": 47.22,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cs",
        "label": "O-ring cross-section",
        "type": "number",
        "default": 2.62,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gd",
        "label": "Groove diameter (bottom for piston, outer for rod)",
        "type": "number",
        "default": 48,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Gland depth (groove bottom to mating surface)",
        "type": "number",
        "default": 2.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "width",
        "label": "Groove width",
        "type": "number",
        "default": 3.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
