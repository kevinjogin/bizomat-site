// BIZOMAT MAKEOS: workshop batch within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "signed-tolerance-stack",
    "name": "Signed Three-Term Tolerance Stack",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What are the worst-case limits of this signed assembly dimension?",
    "description": "Calculate exact interval bounds for a three-term linear dimension chain with asymmetric tolerances and signed coefficients.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "assembly clearance",
      "worst-case stack",
      "asymmetric tolerance"
    ],
    "fields": [
      {
        "key": "n1",
        "label": "Term 1: nominal dimension",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -1000000.0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "l1",
        "label": "Term 1: lower deviation magnitude",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "u1",
        "label": "Term 1: upper deviation magnitude",
        "type": "number",
        "default": 0.2,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "c1",
        "label": "Term 1: signed coefficient",
        "type": "number",
        "default": 1,
        "unit": "×",
        "min": -100,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "n2",
        "label": "Term 2: nominal dimension",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": -1000000.0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "l2",
        "label": "Term 2: lower deviation magnitude",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "u2",
        "label": "Term 2: upper deviation magnitude",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "c2",
        "label": "Term 2: signed coefficient",
        "type": "number",
        "default": -1,
        "unit": "×",
        "min": -100,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "n3",
        "label": "Term 3: nominal dimension",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": -1000000.0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "l3",
        "label": "Term 3: lower deviation magnitude",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "u3",
        "label": "Term 3: upper deviation magnitude",
        "type": "number",
        "default": 0.03,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "c3",
        "label": "Term 3: signed coefficient",
        "type": "number",
        "default": -1,
        "unit": "×",
        "min": -100,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "measurement-uncertainty",
    "name": "Independent Dimensional Uncertainty Budget",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "How do these independent measurement contributions combine?",
    "description": "Combine repeatability, calibration, resolution and one bounded dimensional contribution into standard and expanded uncertainty.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "measurement budget",
      "repeatability",
      "coverage factor"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Reported result",
        "type": "select",
        "default": "mean",
        "options": [
          [
            "mean",
            "Mean of the entered observations"
          ],
          [
            "single",
            "One observation"
          ]
        ],
        "sens": false
      },
      {
        "key": "sd",
        "label": "Sample standard deviation",
        "type": "number",
        "default": 0.01,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "count",
        "label": "Independent observations in the sample",
        "type": "number",
        "default": 10,
        "unit": "observations",
        "min": 2,
        "max": 100000,
        "sens": false,
        "integer": true,
        "step": 1
      },
      {
        "key": "cal",
        "label": "Calibration expanded uncertainty",
        "type": "number",
        "default": 0.004,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "calK",
        "label": "Calibration coverage factor",
        "type": "number",
        "default": 2,
        "unit": "×",
        "min": 0.001,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "resolution",
        "label": "Digital resolution increment",
        "type": "number",
        "default": 0.01,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "bound",
        "label": "Other rectangular half-width",
        "type": "number",
        "default": 0.003,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "coverage",
        "label": "Output coverage factor",
        "type": "number",
        "default": 2,
        "unit": "×",
        "min": 0.001,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "section-properties",
    "name": "Section Properties",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What area and bending properties follow from this section?",
    "description": "Calculate area, centroidal second moments, elastic section moduli and radii of gyration for four ideal section shapes.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "second moment of area",
      "section modulus",
      "rectangular tube"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Ideal section shape",
        "type": "select",
        "default": "rectangle",
        "options": [
          [
            "rectangle",
            "Solid rectangle"
          ],
          [
            "rect-tube",
            "Rectangular tube, sharp corners"
          ],
          [
            "circle",
            "Solid circle"
          ],
          [
            "circ-tube",
            "Circular tube"
          ]
        ],
        "sens": false
      },
      {
        "key": "width",
        "label": "Width or outside diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "height",
        "label": "Outside height (rectangles only)",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "wall",
        "label": "Wall thickness (tubes only)",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "countersink-depth",
    "name": "Countersink Depth and Breakthrough",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How deep is this countersink, and will it reach the opposite face?",
    "description": "Resolve axial cone depth from pilot diameter, mouth diameter and included angle, then compare it with material thickness.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "countersink geometry",
      "remaining wall",
      "breakthrough"
    ],
    "fields": [
      {
        "key": "pilot",
        "label": "Pilot-hole diameter",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "mouth",
        "label": "Countersink mouth diameter",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "angle",
        "label": "Included cone angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.01,
        "max": 179.99,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "thickness",
        "label": "Material thickness",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "turning-cusp",
    "name": "Turning Cusp Height",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What ideal peak-to-valley cusp follows from feed and nose radius?",
    "description": "Compare exact circular-nose turning cusp geometry with the small-feed approximation.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "turning finish geometry",
      "nose radius",
      "peak-to-valley cusp"
    ],
    "fields": [
      {
        "key": "feed",
        "label": "Axial feed per revolution",
        "type": "number",
        "default": 0.2,
        "unit": "mm/rev",
        "min": 0,
        "max": 1000,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "radius",
        "label": "Circular nose radius",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0.001,
        "max": 1000,
        "sens": true,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "radial-chip-thinning",
    "name": "Radial Chip-Thinning Feed",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How does reduced radial engagement change feed per tooth?",
    "description": "Calculate a geometric chip-thinning correction for a 90° peripheral cutter and supplied maximum chip thickness.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "radial engagement",
      "chip thinning",
      "feed per tooth"
    ],
    "fields": [
      {
        "key": "diameter",
        "label": "Cutter diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "width",
        "label": "Radial width of cut",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "chip",
        "label": "Specified maximum chip thickness",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 1e-06,
        "max": 100,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 2000,
        "unit": "rpm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "teeth",
        "label": "Effective cutting teeth",
        "type": "number",
        "default": 4,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "sens": false,
        "integer": true,
        "step": 1
      }
    ]
  },
  {
    "id": "ball-nose-diameter",
    "name": "Ball-Nose Effective Diameter",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What cutting diameter is engaged at this shallow axial depth?",
    "description": "Calculate the maximum engaged diameter of an untilted ball nose, its boundary cutting speed and RPM for a specified speed.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "ball nose",
      "effective diameter",
      "shallow milling"
    ],
    "fields": [
      {
        "key": "diameter",
        "label": "Nominal ball diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "depth",
        "label": "Axial engagement from the tip",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 1e-06,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 5000,
        "unit": "rpm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "speed",
        "label": "Specified surface speed",
        "type": "number",
        "default": 100,
        "unit": "m/min",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "circular-interpolation-feed",
    "name": "Circular Interpolation Feed",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What tool-centre feed gives the specified feed around a circular wall?",
    "description": "Convert peripheral feed to tool-centre feed for a constant-height internal or external circular pass.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "circular milling",
      "internal interpolation",
      "tool centre feed"
    ],
    "fields": [
      {
        "key": "side",
        "label": "Machined feature",
        "type": "select",
        "default": "internal",
        "options": [
          [
            "internal",
            "Inside a circular bore"
          ],
          [
            "external",
            "Around a circular boss"
          ]
        ],
        "sens": false
      },
      {
        "key": "work",
        "label": "Finished bore or boss diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "cutter",
        "label": "Cutter diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "feed",
        "label": "Specified peripheral feed",
        "type": "number",
        "default": 1000,
        "unit": "mm/min",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "coolant-blend",
    "name": "Coolant Blend",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "What volumes make the required final coolant concentration?",
    "description": "Balance two compatible volume concentrations to prepare a specified final coolant volume.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "coolant mixing",
      "dilution",
      "concentration balance"
    ],
    "fields": [
      {
        "key": "volume",
        "label": "Required final volume",
        "type": "number",
        "default": 100,
        "unit": "L",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "strong",
        "label": "Stronger-fluid concentration",
        "type": "number",
        "default": 100,
        "unit": "%",
        "min": 0,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "weak",
        "label": "Weaker-fluid concentration",
        "type": "number",
        "default": 0,
        "unit": "%",
        "min": 0,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "target",
        "label": "Target concentration",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "coolant-topup",
    "name": "Coolant Top-up Balance",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "How much make-up fluid reaches the target within sump capacity?",
    "description": "Calculate the addition needed to correct an existing coolant concentration using a specified make-up mixture.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "sump top-up",
      "coolant correction",
      "tank capacity"
    ],
    "fields": [
      {
        "key": "volume",
        "label": "Existing working volume",
        "type": "number",
        "default": 100,
        "unit": "L",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "current",
        "label": "Existing concentration",
        "type": "number",
        "default": 3,
        "unit": "%",
        "min": 0,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "addition",
        "label": "Make-up concentration",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 0,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "target",
        "label": "Target concentration",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "capacity",
        "label": "Maximum working volume",
        "type": "number",
        "default": 150,
        "unit": "L",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "stock-cut-plan",
    "name": "Three-Size Stock Cut Planner",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How can these pieces fit into equal-length stock bars?",
    "description": "Build a feasible longest-first plan for three part lengths, with end trims, kerf, offcuts and bars to purchase.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "cut stock",
      "saw cutting plan",
      "material yield"
    ],
    "fields": [
      {
        "key": "stock",
        "label": "Stock bar length",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": 0.001
      },
      {
        "key": "trim",
        "label": "End trim at each end",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": 0.001
      },
      {
        "key": "kerf",
        "label": "Kerf per finished piece",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": 0.001
      },
      {
        "key": "length1",
        "label": "Part 1: finished length",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": 0.001
      },
      {
        "key": "count1",
        "label": "Part 1: required pieces",
        "type": "number",
        "default": 6,
        "unit": "pieces",
        "min": 0,
        "max": 100,
        "sens": false,
        "integer": true,
        "step": 1
      },
      {
        "key": "length2",
        "label": "Part 2: finished length",
        "type": "number",
        "default": 180,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": 0.001
      },
      {
        "key": "count2",
        "label": "Part 2: required pieces",
        "type": "number",
        "default": 4,
        "unit": "pieces",
        "min": 0,
        "max": 100,
        "sens": false,
        "integer": true,
        "step": 1
      },
      {
        "key": "length3",
        "label": "Part 3: finished length",
        "type": "number",
        "default": 90,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": false,
        "integer": false,
        "step": 0.001
      },
      {
        "key": "count3",
        "label": "Part 3: required pieces",
        "type": "number",
        "default": 4,
        "unit": "pieces",
        "min": 0,
        "max": 100,
        "sens": false,
        "integer": true,
        "step": 1
      },
      {
        "key": "available",
        "label": "Bars already available",
        "type": "number",
        "default": 2,
        "unit": "bars",
        "min": 0,
        "max": 100000,
        "sens": false,
        "integer": true,
        "step": 1
      }
    ]
  },
  {
    "id": "fillet-weld-quantity",
    "name": "Fillet Weld Quantity",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How much deposited metal and consumable does this fillet require?",
    "description": "Estimate equal-leg fillet volume and mass with a supplied profile allowance, density and deposition efficiency.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "weld metal quantity",
      "fillet volume",
      "consumable estimate"
    ],
    "fields": [
      {
        "key": "leg",
        "label": "Equal fillet leg size",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.001,
        "max": 1000,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "length",
        "label": "Total deposited weld length",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0,
        "max": 100000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "density",
        "label": "Deposited metal density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.001,
        "max": 100000,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "profile",
        "label": "Profile volume factor",
        "type": "number",
        "default": 1.1,
        "unit": "×",
        "min": 1,
        "max": 10,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "efficiency",
        "label": "Deposition efficiency",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 0.001,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "welding-heat-input",
    "name": "Welding Arc Energy and Heat Input",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What energy per length follows from these arc parameters?",
    "description": "Separate unadjusted arc energy from efficiency-adjusted heat input for a steady arc and supplied travel speed.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "welding energy",
      "arc energy",
      "travel speed"
    ],
    "fields": [
      {
        "key": "voltage",
        "label": "Arc voltage",
        "type": "number",
        "default": 24,
        "unit": "V",
        "min": 0.001,
        "max": 1000,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "current",
        "label": "Welding current",
        "type": "number",
        "default": 200,
        "unit": "A",
        "min": 0.001,
        "max": 100000,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "travel",
        "label": "Travel speed",
        "type": "number",
        "default": 300,
        "unit": "mm/min",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "efficiency",
        "label": "Process energy efficiency",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 0.001,
        "max": 100,
        "sens": false,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "tube-bend-length",
    "name": "Tube Bend Developed Length",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What centreline length follows from these straights and bends?",
    "description": "Sum straight tangent lengths and centreline arc lengths for repeated equal-radius tube bends.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "tube development",
      "centreline arc",
      "bend allowance"
    ],
    "fields": [
      {
        "key": "radius",
        "label": "Centreline bend radius",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "angle",
        "label": "Direction change per bend",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0,
        "max": 360,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "bends",
        "label": "Number of identical bends",
        "type": "number",
        "default": 2,
        "unit": "bends",
        "min": 0,
        "max": 1000,
        "sens": false,
        "integer": true,
        "step": 1
      },
      {
        "key": "straight",
        "label": "Total straight tangent length",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0,
        "max": 100000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "thermal-fit",
    "name": "Differential Thermal Fit",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How does clearance change at different part temperatures?",
    "description": "Calculate signed diametral clearance after hole and shaft undergo separate uniform temperature changes from one reference.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "operating clearance",
      "differential expansion",
      "thermal interference"
    ],
    "fields": [
      {
        "key": "hole",
        "label": "Hole diameter at reference temperature",
        "type": "number",
        "default": 50.02,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "shaft",
        "label": "Shaft diameter at reference temperature",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.001,
        "max": 1000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "holeAlpha",
        "label": "Hole-material expansion coefficient",
        "type": "number",
        "default": 23,
        "unit": "µm/(m·K)",
        "min": -1000,
        "max": 1000,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "shaftAlpha",
        "label": "Shaft-material expansion coefficient",
        "type": "number",
        "default": 12,
        "unit": "µm/(m·K)",
        "min": -1000,
        "max": 1000,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "reference",
        "label": "Common reference temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -273.14,
        "max": 2000,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "holeTemp",
        "label": "Hole operating temperature",
        "type": "number",
        "default": 80,
        "unit": "°C",
        "min": -273.14,
        "max": 2000,
        "sens": false,
        "integer": false,
        "step": "any"
      },
      {
        "key": "shaftTemp",
        "label": "Shaft operating temperature",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -273.14,
        "max": 2000,
        "sens": false,
        "integer": false,
        "step": "any"
      }
    ]
  },
  {
    "id": "axial-stress",
    "name": "Axial Stress and Extension",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What elastic stress and length change follow from this axial force?",
    "description": "Calculate nominal stress, strain, extension or shortening and strain energy for a uniform member under concentric axial load.",
    "keywords": [
      "MAKEOS",
      "machinery",
      "calculator",
      "axial deformation",
      "tensile stress",
      "elastic strain"
    ],
    "fields": [
      {
        "key": "force",
        "label": "Signed axial force",
        "type": "number",
        "default": 10000,
        "unit": "N",
        "min": -1000000000.0,
        "max": 1000000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "area",
        "label": "Uniform cross-sectional area",
        "type": "number",
        "default": 200,
        "unit": "mm²",
        "min": 1e-06,
        "max": 1000000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "length",
        "label": "Member length",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.001,
        "max": 100000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      },
      {
        "key": "modulus",
        "label": "Young’s modulus",
        "type": "number",
        "default": 200000,
        "unit": "MPa",
        "min": 0.001,
        "max": 1000000000.0,
        "sens": true,
        "integer": false,
        "step": "any"
      }
    ]
  }
]);
