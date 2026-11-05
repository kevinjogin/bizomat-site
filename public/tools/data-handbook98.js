// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook98) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "general-purpose-acme-limits",
    "name": "General Purpose Acme Thread Limits (Classes 2G, 3G, 4G)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the major, pitch and minor diameter limits of a general purpose Acme screw and nut in class 2G, 3G or 4G, with the allowance for a long engagement or a multi-start thread, and what are the stress and shear areas of the screw?",
    "description": "Limiting diameters of general purpose Acme screw threads by the ASME/ANSI B1.5 formulas the handbook gives: pitch diameter allowances 0.008 √D (2G), 0.006 √D (3G) and 0.004 √D (4G) at the mean of the nominal size range, pitch diameter tolerances 0.006 √D + 0.030 √P (2G), 0.0028 √D + 0.014 √P (3G) and 0.002 √D + 0.010 √P (4G), the major and minor diameter allowances and tolerances, a 10 % allowance increase for each inch of engagement beyond two diameters, the internal allowance for multi-start threads, the crest and root flats, and the stress and shear areas.",
    "keywords": [
      "MAKEOS",
      "Acme thread limits",
      "2G Acme pitch diameter",
      "Acme screw tolerance",
      "ASME B1.5 general purpose Acme",
      "Acme nut major diameter",
      "Acme stress area",
      "multi-start Acme allowance"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Nominal (basic major) diameter D",
        "type": "number",
        "default": 1,
        "unit": "in",
        "min": 0.25,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 5,
        "unit": "TPI",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cls",
        "label": "Class of thread",
        "type": "select",
        "default": "2G",
        "options": [
          [
            "2G",
            "2G (preferred)"
          ],
          [
            "3G",
            "3G"
          ],
          [
            "4G",
            "4G"
          ]
        ]
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
      },
      {
        "key": "LE",
        "label": "Length of engagement",
        "type": "number",
        "default": 1.5,
        "unit": "in",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "centralizing-acme-limits",
    "name": "Centralizing Acme Thread Limits and Fit (Classes 2C, 3C, 4C)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the limits of a centralizing Acme screw and nut in classes 2C, 3C or 4C, and does my combination of screw and nut classes meet the centralizing requirement at the major diameter?",
    "description": "Limiting diameters of centralizing Acme screw threads by the ASME/ANSI B1.5 formulas the handbook gives: the pitch diameter allowances and tolerances of the general purpose classes, major diameter tolerances 0.0035 √D, 0.0015 √D or 0.0010 √D on the screw and 0.0035 √D or 0.0020 √D on the nut, the nut major allowance 0.001 √D, the nut minor diameter D − 0.9P, and the check that the nut major tolerance plus allowance plus the screw major tolerance does not exceed the screw pitch diameter allowance, with the minimum clearances and flats.",
    "keywords": [
      "MAKEOS",
      "centralizing Acme thread",
      "2C 3C 4C Acme limits",
      "Acme centralizing fit",
      "ASME B1.5 centralizing",
      "Acme major diameter tolerance",
      "centralizing Acme nut"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Nominal (basic major) diameter D",
        "type": "number",
        "default": 1,
        "unit": "in",
        "min": 0.25,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 5,
        "unit": "TPI",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ce",
        "label": "Class of the screw",
        "type": "select",
        "default": "2C",
        "options": [
          [
            "2C",
            "2C"
          ],
          [
            "3C",
            "3C"
          ],
          [
            "4C",
            "4C"
          ]
        ]
      },
      {
        "key": "ci",
        "label": "Class of the nut",
        "type": "select",
        "default": "2C",
        "options": [
          [
            "2C",
            "2C"
          ],
          [
            "3C",
            "3C"
          ],
          [
            "4C",
            "4C"
          ]
        ]
      },
      {
        "key": "LE",
        "label": "Length of engagement",
        "type": "number",
        "default": 1.5,
        "unit": "in",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "stub-acme-limits",
    "name": "Stub Acme Thread Limits (Standard, Modified Form 1 and 2)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the limits of size of a Stub Acme screw and nut, in the standard form or the Modified Form 1 or 2, and what flats does the threading tool need?",
    "description": "Limiting diameters of Stub Acme screw threads by the ASME/ANSI B1.8 formulas the handbook gives: basic height 0.3P (standard), 0.375P (Modified Form 1) or 0.25P (Modified Form 2), the pitch diameter allowance and tolerance of the general purpose Class 2G (or 3G or 4G for less backlash), the major and minor diameter allowances of 0.020 or 0.010 in, the screw major tolerance 0.05P and nut minor tolerance 0.05P, and the crest and root flats of the form.",
    "keywords": [
      "MAKEOS",
      "Stub Acme thread limits",
      "ASME B1.8 Stub Acme",
      "Stub Acme M1 M2",
      "shallow Acme thread",
      "Stub Acme pitch diameter",
      "Stub Acme nut"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Nominal (basic major) diameter D",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.25,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 10,
        "unit": "TPI",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "form",
        "label": "Thread form",
        "type": "select",
        "default": "std",
        "options": [
          [
            "std",
            "Standard Stub Acme (h = 0.3P)"
          ],
          [
            "M1",
            "Modified Form 1 (h = 0.375P)"
          ],
          [
            "M2",
            "Modified Form 2 (h = 0.25P)"
          ]
        ]
      },
      {
        "key": "cls",
        "label": "Allowances and tolerances",
        "type": "select",
        "default": "2G",
        "options": [
          [
            "2G",
            "Class 2G (standard fit)"
          ],
          [
            "3G",
            "Class 3G (less backlash)"
          ],
          [
            "4G",
            "Class 4G (least backlash)"
          ]
        ]
      },
      {
        "key": "LE",
        "label": "Length of engagement",
        "type": "number",
        "default": 1.5,
        "unit": "in",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "whitworth-thread-limits",
    "name": "Whitworth Thread Limits to BS 84 (BSW, BSF)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the major, effective and minor diameter limits of a Whitworth form (BSW or BSF) bolt and nut in the BS 84 close, medium, free or normal classes for my length of engagement?",
    "description": "Limits of size of parallel screw threads of Whitworth form by the BS 84 tolerance formulas the handbook gives: T = 0.002 ∛D + 0.003 √L + 0.005 √p; bolt effective diameter tolerances 2/3 T, T and 3/2 T for close, medium and free classes, bolt major tolerances of the same plus 0.01 √p, bolt minor tolerances 2/3 T + 0.013 √p, T + 0.02 √p and 3/2 T + 0.02 √p; nut effective tolerances 2/3 T, T and 3/2 T for close, medium and normal classes and nut minor tolerance 0.2p plus 0.004, 0.005 or 0.007 in, with the basic Whitworth dimensions and the stainless steel adjustment.",
    "keywords": [
      "MAKEOS",
      "Whitworth thread tolerance",
      "BS 84 limits",
      "BSW BSF limits of size",
      "Whitworth effective diameter",
      "medium class Whitworth",
      "Whitworth nut minor diameter"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Major diameter D",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.0625,
        "max": 6,
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
        "min": 2,
        "max": 72,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length of engagement L",
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
        "key": "bc",
        "label": "Bolt class",
        "type": "select",
        "default": "medium",
        "options": [
          [
            "close",
            "Close"
          ],
          [
            "medium",
            "Medium"
          ],
          [
            "free",
            "Loose fit (BS 84 free class)"
          ]
        ]
      },
      {
        "key": "nc",
        "label": "Nut class",
        "type": "select",
        "default": "normal",
        "options": [
          [
            "close",
            "Close"
          ],
          [
            "medium",
            "Medium"
          ],
          [
            "normal",
            "Normal"
          ]
        ]
      },
      {
        "key": "ss",
        "label": "Bolt material",
        "type": "select",
        "default": "no",
        "options": [
          [
            "no",
            "Carbon or alloy steel"
          ],
          [
            "yes",
            "Stainless steel"
          ]
        ]
      }
    ]
  },
  {
    "id": "unified-miniature-thread-limits",
    "name": "Unified Miniature Screw Thread (UNM) Limits",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the limits of size of a unified miniature (UNM) screw thread from 0.30 to 1.40 mm, with its lead angle and the sectional area at the minor diameter?",
    "description": "Limits of size of unified miniature screw threads (UNM) by the ANSI B1.10 formulas the handbook gives, in millimetres: basic pitch diameter E = D − 0.64952p and minor diameter K = D − 1.04p, external design minor diameter D − 1.20p and internal design major diameter D + 0.072p, with tolerances 0.12p + 0.006 (external major), 0.08p + 0.008 (pitch, both), 0.16p + 0.008 (external minor), 0.32p + 0.012 (internal minor) and 0.168p + 0.008 (internal major), the lead angle at the basic pitch diameter and the sectional area at D − 1.28p.",
    "keywords": [
      "MAKEOS",
      "UNM thread limits",
      "unified miniature screw thread",
      "ANSI B1.10 miniature thread",
      "watch screw thread",
      "miniature thread pitch diameter",
      "0.80 UNM thread"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Nominal (basic major) diameter D",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.2,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Pitch p",
        "type": "number",
        "default": 0.25,
        "unit": "mm",
        "min": 0.05,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bearing-static-equivalent-load",
    "name": "Rolling Bearing Static Equivalent Load and Static Safety Factor",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What static equivalent load does my ball or roller bearing carry under combined radial and axial loads, and is its static load rating enough for the static safety factor I need?",
    "description": "Static equivalent loads of ball and roller bearings by the AFBMA formulas the handbook gives: radial bearings Po = Xo Fr + Yo Fa but not less than Fr, with Xo and Yo for radial contact, angular contact (15° to 40°, interpolated), self-aligning ball and self-aligning or tapered roller bearings in single or double row (and duplex pairs); thrust bearings Poa = Fa + 2.3 Fr tan α, with the range of Fr ÷ Fa for which it holds; and the static safety factor Co ÷ Po against the value you require.",
    "keywords": [
      "MAKEOS",
      "static equivalent load bearing",
      "Po = Xo Fr + Yo Fa",
      "bearing static safety factor",
      "thrust bearing static load",
      "angular contact bearing static load",
      "Xo Yo factors"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Bearing type",
        "type": "select",
        "default": "angular",
        "options": [
          [
            "radial",
            "Radial contact groove ball (α = 0°)"
          ],
          [
            "angular",
            "Angular contact groove ball"
          ],
          [
            "saball",
            "Self-aligning ball"
          ],
          [
            "roller",
            "Self-aligning or tapered roller"
          ],
          [
            "roller0",
            "Radial roller with α = 0° (radial load only)"
          ],
          [
            "thrustball",
            "Thrust ball"
          ],
          [
            "thrustroller",
            "Thrust roller"
          ]
        ]
      },
      {
        "key": "rows",
        "label": "Rows or mounting",
        "type": "select",
        "default": "single",
        "options": [
          [
            "single",
            "Single row, or tandem pair"
          ],
          [
            "double",
            "Double row, or back-to-back / face-to-face pair"
          ]
        ]
      },
      {
        "key": "dir",
        "label": "Thrust bearing direction",
        "type": "select",
        "default": "single",
        "options": [
          [
            "single",
            "Single direction"
          ],
          [
            "double",
            "Double direction"
          ]
        ]
      },
      {
        "key": "alpha",
        "label": "Nominal contact angle α",
        "type": "number",
        "default": 25,
        "unit": "°",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fr",
        "label": "Radial load Fr",
        "type": "number",
        "default": 2000,
        "unit": "N",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fa",
        "label": "Axial load Fa",
        "type": "number",
        "default": 4000,
        "unit": "N",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_rating_check",
        "label": "Rating check",
        "type": "heading"
      },
      {
        "key": "Co",
        "label": "Basic static load rating Co (or Coa)",
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
        "key": "s0",
        "label": "Static safety factor you require",
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
    "id": "rail-and-track-wheel-size",
    "name": "Rail Width and Track Wheel Diameter for a Wheel Load",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a wheel load on a rail, how wide must the rail tread and head be, what is the smallest track wheel that will carry the load, and what load per unit length does the AREA formula allow for a steel wheel on a steel plate?",
    "description": "Rail and track wheel sizing by the formulas the handbook gives: tread width B = C ÷ (1250 D) and head width A = B + 5/8 in for a wheel load C and wheel diameter D (inches and pounds), the smallest safe wheel diameter D = C ÷ (A K) with the material factor K you enter, and the American Railway Engineering Association allowable load per inch of contact length p = (y.s. − 13,000) ÷ 20,000 × 600 d for steel cylinders up to 25 in diameter rolling on steel plates, worked in SI units with the head width you will use.",
    "keywords": [
      "MAKEOS",
      "rail size for wheel load",
      "track wheel diameter",
      "crane rail width",
      "AREA roller load formula",
      "steel wheel on steel plate",
      "wheel load per inch"
    ],
    "fields": [
      {
        "key": "C",
        "label": "Load on one wheel C",
        "type": "number",
        "default": 44.48,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Wheel diameter D",
        "type": "number",
        "default": 508,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Width of the rail head you will use",
        "type": "number",
        "default": 26.04,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Material factor K for the wheel",
        "type": "number",
        "default": 4.137,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ys",
        "label": "Yield strength of the steel (AREA formula)",
        "type": "number",
        "default": 220.6,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
