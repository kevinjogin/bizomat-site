// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook11) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "bolt-stretch",
    "name": "Bolt Stretch and Turn-of-Nut Angle",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "How much will this bolt stretch at the target preload, and how far must the nut turn from snug?",
    "description": "Bolt elongation, member compression and the nut rotation from snug-tight needed to reach a target preload, from bolt and joint stiffness.",
    "keywords": [
      "MAKEOS",
      "bolt stretch",
      "turn of nut",
      "preload",
      "elongation",
      "ultrasonic bolt",
      "angle tightening"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nominal diameter",
        "type": "number",
        "default": 20,
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
        "default": 2.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "grip",
        "label": "Grip length",
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
        "key": "Lt",
        "label": "Threaded length within the grip",
        "type": "number",
        "default": 20,
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
        "key": "F",
        "label": "Target preload",
        "type": "number",
        "default": 120,
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
    "id": "bolt-group-eccentric",
    "name": "Eccentrically Loaded Bolt Group",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Which bolt in this group carries the most shear when the load is offset?",
    "description": "Shear force on each bolt of a group of up to six under an in-plane load applied away from the group centroid, by the elastic (vector) method, against the bolt shear capacity.",
    "keywords": [
      "MAKEOS",
      "bolt group",
      "eccentric shear",
      "bracket bolts",
      "elastic method",
      "polar moment",
      "bolt pattern"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of bolts",
        "type": "number",
        "default": 4,
        "unit": "bolts",
        "min": 2,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_bolt_1",
        "label": "Bolt 1",
        "type": "heading"
      },
      {
        "key": "x1",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_2",
        "label": "Bolt 2",
        "type": "heading"
      },
      {
        "key": "x2",
        "label": "X",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_3",
        "label": "Bolt 3",
        "type": "heading"
      },
      {
        "key": "x3",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Y",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_4",
        "label": "Bolt 4",
        "type": "heading"
      },
      {
        "key": "x4",
        "label": "X",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y4",
        "label": "Y",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_5",
        "label": "Bolt 5",
        "type": "heading"
      },
      {
        "key": "x5",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y5",
        "label": "Y",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_6",
        "label": "Bolt 6",
        "type": "heading"
      },
      {
        "key": "x6",
        "label": "X",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y6",
        "label": "Y",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load",
        "label": "Load",
        "type": "heading"
      },
      {
        "key": "Px",
        "label": "Load X component",
        "type": "number",
        "default": 0,
        "unit": "kN",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Py",
        "label": "Load Y component",
        "type": "number",
        "default": -20,
        "unit": "kN",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lx",
        "label": "Load X position",
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
        "key": "ly",
        "label": "Load Y position",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Shear capacity per bolt",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "acme-thread",
    "name": "Acme and Trapezoidal Thread Dimensions",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the basic dimensions of this Acme or metric trapezoidal thread?",
    "description": "Basic pitch, minor and major diameters, thread height, crest clearance, lead, lead angle and root area of a general-purpose Acme (inch) or ISO metric trapezoidal (Tr) thread.",
    "keywords": [
      "MAKEOS",
      "Acme thread",
      "trapezoidal thread",
      "Tr thread",
      "lead screw",
      "ISO 2904",
      "pitch diameter"
    ],
    "fields": [
      {
        "key": "system",
        "label": "Thread system",
        "type": "select",
        "default": "tr",
        "options": [
          [
            "tr",
            "ISO metric trapezoidal (mm)"
          ],
          [
            "acme",
            "General purpose Acme (inch)"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Nominal major diameter",
        "type": "number",
        "default": 20,
        "unit": "mm or in",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Pitch (trapezoidal)",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tpi",
        "label": "Threads per inch (Acme)",
        "type": "number",
        "default": 5,
        "unit": "TPI",
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
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "npt-thread",
    "name": "NPT Pipe Thread Gauge Dimensions",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the pitch diameters and effective thread length of this NPT taper pipe thread?",
    "description": "Pitch diameter at the small end, effective thread length, pitch diameter at the end of the effective thread, thread height and taper of an American National Standard taper pipe thread (NPT) from its outside diameter and threads per inch.",
    "keywords": [
      "MAKEOS",
      "NPT",
      "pipe thread",
      "taper thread",
      "ASME B1.20.1",
      "pitch diameter",
      "thread gauge"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Pipe outside diameter",
        "type": "number",
        "default": 0.84,
        "unit": "in",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 14,
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
    "id": "differential-indexing",
    "name": "Differential Indexing on a Dividing Head",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "How can this number of divisions be indexed when simple indexing cannot do it?",
    "description": "An approximate number, crank movement and change gears for differential indexing on a 40:1 dividing head with the standard gear set, for numbers simple indexing cannot produce.",
    "keywords": [
      "MAKEOS",
      "differential indexing",
      "dividing head",
      "prime number",
      "gear cutting",
      "index plate",
      "change gears"
    ],
    "fields": [
      {
        "key": "divisions",
        "label": "Number of divisions",
        "type": "number",
        "default": 67,
        "unit": "divisions",
        "min": 2,
        "max": 2000,
        "step": 1,
        "integer": true,
        "sens": false
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
        "key": "set",
        "label": "Change gears available",
        "type": "select",
        "default": "std",
        "options": [
          [
            "std",
            "Standard dividing head set: 24, 24, 28, 32, 40, 44, 48, 56, 64, 72, 86, 100"
          ],
          [
            "g4",
            "24 to 100 in steps of 4"
          ]
        ]
      }
    ]
  },
  {
    "id": "helical-milling",
    "name": "Helical Milling Lead and Change Gears",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What lead does this helix have, and which change gears cut it on the dividing head?",
    "description": "Lead of a helix from the work diameter and helix angle, the table swivel angle, and the closest compound change-gear train between the table feed screw and the dividing head.",
    "keywords": [
      "MAKEOS",
      "helical milling",
      "lead",
      "helix angle",
      "dividing head",
      "change gears",
      "spiral flutes"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Work diameter (pitch diameter for gears)",
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
        "key": "beta",
        "label": "Helix angle (from the axis)",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0.1,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lm",
        "label": "Lead of the machine",
        "type": "number",
        "default": 254,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "set",
        "label": "Change gears available",
        "type": "select",
        "default": "std",
        "options": [
          [
            "std",
            "Standard set: 24, 24, 28, 32, 40, 44, 48, 56, 64, 72, 86, 100"
          ],
          [
            "g4",
            "24 to 100 in steps of 4"
          ]
        ]
      }
    ]
  },
  {
    "id": "thread-infeed",
    "name": "Thread Turning Infeed per Pass",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "How deep should each pass be when single-point turning this thread?",
    "description": "Radial infeed for each pass of a single-point threading cycle with a decreasing (constant chip area) schedule, with cumulative depth and the X diameter for each pass.",
    "keywords": [
      "MAKEOS",
      "thread turning",
      "infeed",
      "number of passes",
      "CNC threading",
      "G76",
      "thread depth"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Thread",
        "type": "select",
        "default": "ext",
        "options": [
          [
            "ext",
            "External (metric 60°)"
          ],
          [
            "int",
            "Internal (metric 60°)"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Nominal diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
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
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "passes",
        "label": "Number of passes",
        "type": "number",
        "default": 8,
        "unit": "passes",
        "min": 2,
        "max": 40,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "depth",
        "label": "Total radial depth (0 = standard)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "planetary-gear",
    "name": "Planetary Gear Train",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What ratio, output speed and torque does this planetary (epicyclic) gear set give?",
    "description": "Ratio, output speed and torque of a simple planetary gear set with the ring, sun or carrier held, the planet tooth count and the equal-spacing assembly check.",
    "keywords": [
      "MAKEOS",
      "planetary gear",
      "epicyclic",
      "sun gear",
      "ring gear",
      "carrier",
      "gearbox ratio"
    ],
    "fields": [
      {
        "key": "zs",
        "label": "Sun teeth",
        "type": "number",
        "default": 24,
        "unit": "teeth",
        "min": 6,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "zr",
        "label": "Ring teeth",
        "type": "number",
        "default": 72,
        "unit": "teeth",
        "min": 12,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "np",
        "label": "Number of planets",
        "type": "number",
        "default": 3,
        "unit": "planets",
        "min": 1,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mode",
        "label": "Arrangement",
        "type": "select",
        "default": "ring",
        "options": [
          [
            "ring",
            "Ring fixed · sun in · carrier out"
          ],
          [
            "sun",
            "Sun fixed · ring in · carrier out"
          ],
          [
            "carrier",
            "Carrier fixed · sun in · ring out"
          ]
        ]
      },
      {
        "key": "nin",
        "label": "Input speed",
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
        "key": "Tin",
        "label": "Input torque",
        "type": "number",
        "default": 50,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Efficiency",
        "type": "number",
        "default": 97,
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
    "id": "profile-shift",
    "name": "Profile Shift and Working Centre Distance",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What working centre distance and pressure angle result from these profile shifts, and are the teeth undercut?",
    "description": "Working pressure angle, working centre distance and centre distance modification for a spur gear pair with profile shift, the undercut check and the backlash change at an actual centre distance.",
    "keywords": [
      "MAKEOS",
      "profile shift",
      "addendum modification",
      "working pressure angle",
      "centre distance",
      "undercut",
      "backlash"
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
        "key": "z1",
        "label": "Pinion teeth",
        "type": "number",
        "default": 14,
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
        "default": 40,
        "unit": "teeth",
        "min": 5,
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
        "key": "x1",
        "label": "Pinion profile shift coefficient",
        "type": "number",
        "default": 0.2,
        "unit": "",
        "min": -1,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "Gear profile shift coefficient",
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
        "key": "aAct",
        "label": "Actual centre distance (0 = not set)",
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
    "id": "contact-ratio",
    "name": "Spur Gear Contact Ratio",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What transverse contact ratio does this spur gear pair have?",
    "description": "Transverse contact ratio of an external spur gear pair from module, tooth counts, pressure angle and profile shifts, with base pitch and length of contact.",
    "keywords": [
      "MAKEOS",
      "contact ratio",
      "spur gear",
      "length of action",
      "base pitch",
      "smooth running"
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
        "default": 50,
        "unit": "teeth",
        "min": 5,
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
        "key": "x1",
        "label": "Pinion profile shift",
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
        "key": "x2",
        "label": "Gear profile shift",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "dp-spur-gear",
    "name": "Spur Gear Dimensions (Diametral Pitch)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What are the diameters, tooth depth and centre distance of this inch (diametral pitch) spur gear pair?",
    "description": "Pitch, outside and root diameters, addendum, dedendum, whole depth, circular pitch, tooth thickness and centre distance of a diametral-pitch spur gear pair, with metric equivalents.",
    "keywords": [
      "MAKEOS",
      "diametral pitch",
      "spur gear",
      "inch gears",
      "outside diameter",
      "whole depth",
      "DP"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Diametral pitch",
        "type": "number",
        "default": 10,
        "unit": "1/in",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
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
        "key": "n2",
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
        "key": "system",
        "label": "Tooth system",
        "type": "select",
        "default": "20fd",
        "options": [
          [
            "20fd",
            "20° full depth"
          ],
          [
            "14fd",
            "14½° full depth"
          ],
          [
            "20stub",
            "20° stub"
          ]
        ]
      }
    ]
  },
  {
    "id": "sprocket-diameters",
    "name": "Roller Chain Sprocket Diameters",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What are the pitch, outside, bottom and caliper diameters of this sprocket?",
    "description": "Pitch diameter, approximate outside diameter, bottom diameter and caliper diameter (for odd tooth counts) of a roller chain sprocket from chain pitch, tooth count and roller diameter.",
    "keywords": [
      "MAKEOS",
      "sprocket",
      "pitch diameter",
      "roller chain",
      "bottom diameter",
      "caliper diameter",
      "ANSI chain"
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
        "key": "N",
        "label": "Number of teeth",
        "type": "number",
        "default": 17,
        "unit": "teeth",
        "min": 5,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Dr",
        "label": "Roller diameter",
        "type": "number",
        "default": 10.16,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
