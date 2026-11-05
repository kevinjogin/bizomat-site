// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook20) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "lever-force",
    "name": "Lever Force with Several Loads",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What effort balances these loads on a lever, or how long must the effort arm be?",
    "description": "Balance of a lever about its fulcrum: the effort needed at a given arm to hold up to three loads at their distances, or the arm length needed for a given effort, with the mechanical advantage and the fulcrum reaction.",
    "keywords": [
      "MAKEOS",
      "lever",
      "fulcrum",
      "mechanical advantage",
      "moment balance",
      "effort",
      "hand lever"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Solve for",
        "type": "select",
        "default": "force",
        "options": [
          [
            "force",
            "Effort at a given arm"
          ],
          [
            "arm",
            "Arm for a given effort"
          ]
        ]
      },
      {
        "key": "type",
        "label": "Lever type",
        "type": "select",
        "default": "first",
        "options": [
          [
            "first",
            "Fulcrum between effort and loads"
          ],
          [
            "second",
            "Loads between fulcrum and effort"
          ],
          [
            "third",
            "Effort between fulcrum and loads"
          ]
        ]
      },
      {
        "key": "x",
        "label": "Effort arm (fulcrum to effort)",
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
        "key": "F",
        "label": "Available effort (arm mode)",
        "type": "number",
        "default": 100,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_loads_distance_from_the_fulcrum_0_unused_",
        "label": "Loads (distance from the fulcrum; 0 = unused)",
        "type": "heading"
      },
      {
        "key": "W1",
        "label": "Load 1",
        "type": "number",
        "default": 800,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Distance 1",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W2",
        "label": "Load 2",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Distance 2",
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
        "key": "W3",
        "label": "Load 3",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a3",
        "label": "Distance 3",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hoist-advantage",
    "name": "Windlass, Gear Hoist and Differential Pulley Effort",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What effort lifts this load with a windlass, geared winch, rope block or differential chain pulley?",
    "description": "Effort and mechanical advantage for the handbook’s simple lifting machines: wheel and axle, a windlass driven through up to two gear pairs, a block and tackle with several parts of rope, a differential chain pulley and a Chinese (differential) windlass, with an overall efficiency.",
    "keywords": [
      "MAKEOS",
      "windlass",
      "wheel and axle",
      "differential pulley",
      "chain block",
      "block and tackle",
      "mechanical advantage",
      "hoist effort"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Machine",
        "type": "select",
        "default": "diff",
        "options": [
          [
            "wheel",
            "Wheel and axle"
          ],
          [
            "geared",
            "Geared windlass (up to two gear pairs)"
          ],
          [
            "block",
            "Block and tackle"
          ],
          [
            "diff",
            "Differential chain pulley"
          ],
          [
            "chinese",
            "Chinese windlass"
          ]
        ]
      },
      {
        "key": "W",
        "label": "Load to lift",
        "type": "number",
        "default": 10000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Crank, hand-wheel or large sheave radius",
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
        "key": "r",
        "label": "Drum or small sheave radius",
        "type": "number",
        "default": 135,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g1",
        "label": "Gear ratio, first pair (driven ÷ driver)",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g2",
        "label": "Gear ratio, second pair (1 = none)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Parts of rope supporting the load (block)",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 40,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "crank",
        "label": "Crank radius (Chinese windlass)",
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
        "key": "eff",
        "label": "Overall efficiency",
        "type": "number",
        "default": 35,
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
    "id": "agma-bending-stress",
    "name": "Gear Tooth Bending Stress (AGMA Form)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What bending stress does this tangential load put on the gear tooth root, and is the safety factor enough?",
    "description": "Tooth-root bending stress by the AGMA fundamental rating formula in metric form, from tangential load, face width, module, the bending geometry factor and the application, dynamic, size, load-distribution and rim-thickness factors, compared with your allowable bending stress.",
    "keywords": [
      "MAKEOS",
      "AGMA",
      "bending stress",
      "gear rating",
      "geometry factor J",
      "tooth root stress",
      "gear strength"
    ],
    "fields": [
      {
        "key": "Ft",
        "label": "Tangential load at the pitch circle",
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
        "key": "mt",
        "label": "Transverse module",
        "type": "number",
        "default": 2.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "J",
        "label": "Bending geometry factor J (Y_J)",
        "type": "number",
        "default": 0.35,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ko",
        "label": "Overload (application) factor",
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
        "key": "Kv",
        "label": "Dynamic factor",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ks",
        "label": "Size factor",
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
        "key": "KH",
        "label": "Load distribution factor",
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
        "key": "KB",
        "label": "Rim thickness factor",
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
        "key": "allow",
        "label": "Allowable bending stress (adjusted for life and reliability)",
        "type": "number",
        "default": 350,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required safety factor",
        "type": "number",
        "default": 1.5,
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
    "id": "spline-torque-capacity",
    "name": "Involute Spline Stresses and Torque Capacity",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Are the shear and compressive stresses in this involute spline within the allowables for the torque?",
    "description": "Stresses in a 30° involute spline by the handbook (Dudley) formulas: shear under the roots of the external teeth for a solid or hollow shaft, shear at the pitch diameter, and compressive stress on the tooth sides for fixed or flexible splines, using application, load-distribution, fatigue-life and wear-life factors.",
    "keywords": [
      "MAKEOS",
      "spline",
      "involute spline",
      "spline torque",
      "spline shear stress",
      "spline compressive stress",
      "ANSI B92.1"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Transmitted torque",
        "type": "number",
        "default": 500,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Pitch diameter",
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
        "key": "Dre",
        "label": "Root diameter of the external spline",
        "type": "number",
        "default": 28,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dh",
        "label": "Bore of a hollow shaft (0 = solid)",
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
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 24,
        "unit": "",
        "min": 6,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Le",
        "label": "Effective length",
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
        "key": "t",
        "label": "Circular tooth thickness at the pitch diameter",
        "type": "number",
        "default": 1.96,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Depth of engagement",
        "type": "number",
        "default": 1.125,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kind",
        "label": "Spline",
        "type": "select",
        "default": "fixed",
        "options": [
          [
            "fixed",
            "Fixed"
          ],
          [
            "flexible",
            "Flexible"
          ]
        ]
      },
      {
        "key": "acc",
        "label": "Spacing accuracy",
        "type": "select",
        "default": "good",
        "options": [
          [
            "good",
            "Normal (half the teeth carry load)"
          ],
          [
            "poor",
            "Poor (factor 6)"
          ]
        ]
      },
      {
        "key": "Ka",
        "label": "Application factor",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Km",
        "label": "Load distribution factor (1 for fixed)",
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
        "key": "Kf",
        "label": "Fatigue-life factor",
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
        "key": "Kw",
        "label": "Wear-life factor (flexible)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ss",
        "label": "Allowable shear stress",
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
        "key": "Sc",
        "label": "Allowable compressive stress",
        "type": "number",
        "default": 20,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "internal-gear",
    "name": "Internal Gear and Pinion Proportions",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What diameters, centre distance and tooth thicknesses do this internal gear and pinion need, and do the tooth numbers interfere?",
    "description": "Proportions of an internal spur gear and its pinion by the handbook rules for 20° full-depth teeth: pitch diameters, enlarged internal diameter and pinion outside diameter to avoid interference, conventional diameters, centre distance, arc tooth thicknesses and the tooth-number difference check.",
    "keywords": [
      "MAKEOS",
      "internal gear",
      "ring gear",
      "annulus",
      "internal spur gear",
      "interference",
      "centre distance"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 4.2333,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Zg",
        "label": "Internal gear teeth",
        "type": "number",
        "default": 72,
        "unit": "",
        "min": 20,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Zp",
        "label": "Pinion teeth",
        "type": "number",
        "default": 18,
        "unit": "",
        "min": 8,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "form",
        "label": "Tooth form",
        "type": "select",
        "default": "20fd",
        "options": [
          [
            "20fd",
            "20° full depth"
          ],
          [
            "20stub",
            "20° stub"
          ],
          [
            "14fd",
            "14½° full depth"
          ]
        ]
      }
    ]
  },
  {
    "id": "film-thickness-ratio",
    "name": "Lubricant Film Thickness Ratio (Lambda)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "Is the lubricant film thick enough to separate these rolling surfaces?",
    "description": "Film thickness ratio lambda of a rolling bearing or gear contact: the working film thickness divided by the composite roughness of the two surfaces, from RMS or average roughness, with the lubrication regime it indicates.",
    "keywords": [
      "MAKEOS",
      "lambda ratio",
      "film thickness",
      "EHL",
      "lubrication regime",
      "surface roughness",
      "bearing lubrication"
    ],
    "fields": [
      {
        "key": "h",
        "label": "Working film thickness",
        "type": "number",
        "default": 0.25,
        "unit": "µm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rtype",
        "label": "Roughness entered as",
        "type": "select",
        "default": "rq",
        "options": [
          [
            "rq",
            "RMS (Rq)"
          ],
          [
            "ra",
            "Average (Ra)"
          ]
        ]
      },
      {
        "key": "R1",
        "label": "Roughness of surface 1",
        "type": "number",
        "default": 0.06,
        "unit": "µm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R2",
        "label": "Roughness of surface 2",
        "type": "number",
        "default": 0.04,
        "unit": "µm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "turn-of-nut-preload",
    "name": "Turn-of-Nut Angle for Bolt Preload",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Through what angle must the nut turn to reach this preload, or what preload does a given turn give?",
    "description": "Nut rotation for a target bolt preload by the handbook’s turn-of-nut relation, using the bolt’s elastic elongation over its shank and threaded lengths, with optional joint compliance, or the preload from a specified turn angle.",
    "keywords": [
      "MAKEOS",
      "turn of nut",
      "nut rotation",
      "angle tightening",
      "bolt preload",
      "bolt elongation",
      "torque-angle"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Solve for",
        "type": "select",
        "default": "angle",
        "options": [
          [
            "angle",
            "Turn angle for a preload"
          ],
          [
            "preload",
            "Preload from a turn angle"
          ]
        ]
      },
      {
        "key": "Ft",
        "label": "Target preload",
        "type": "number",
        "default": 35,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "theta",
        "label": "Turn angle (preload mode)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 0.000001,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lead",
        "label": "Thread lead",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Nominal (shank) diameter",
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
        "key": "At",
        "label": "Tensile stress area",
        "type": "number",
        "default": 58,
        "unit": "mm²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ls",
        "label": "Unthreaded shank length in the grip",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lt",
        "label": "Threaded length in the grip",
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
        "key": "E",
        "label": "Bolt elastic modulus",
        "type": "number",
        "default": 205,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kj",
        "label": "Joint stiffness (0 = rigid joint)",
        "type": "number",
        "default": 0,
        "unit": "kN/mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "deep-draw-force",
    "name": "Deep Drawing and Ironing Punch Force",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What punch force does this drawing or ironing operation need?",
    "description": "Punch force for the first draw of a cylindrical shell, for a subsequent (redraw) operation from blank and punch diameters, and for ironing a drawn wall to a thinner gauge, by the handbook formulas, with the drawing ratio and press capacity check.",
    "keywords": [
      "MAKEOS",
      "deep drawing",
      "drawing force",
      "redraw",
      "ironing force",
      "press tonnage",
      "cup drawing"
    ],
    "fields": [
      {
        "key": "op",
        "label": "Operation",
        "type": "select",
        "default": "first",
        "options": [
          [
            "first",
            "First draw"
          ],
          [
            "redraw",
            "Subsequent draw"
          ],
          [
            "iron",
            "Ironing"
          ]
        ]
      },
      {
        "key": "T",
        "label": "Material thickness",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "UTS",
        "label": "Ultimate tensile strength",
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
        "key": "dm",
        "label": "Mean shell diameter after the first draw",
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
        "key": "dp",
        "label": "Punch diameter (redraw)",
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
        "key": "D",
        "label": "Blank diameter (redraw)",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d0",
        "label": "Outside diameter of the cup (ironing)",
        "type": "number",
        "default": 62,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Punch-to-die clearance after ironing",
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
        "key": "Sc",
        "label": "Compressive strength (ironing)",
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
        "key": "press",
        "label": "Press capacity",
        "type": "number",
        "default": 250,
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
    "id": "thread-roll-diameter",
    "name": "Threading Roll Pitch Diameter",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What pitch diameter should a single- or multiple-start threading roll have for this screw thread?",
    "description": "Pitch diameter of a threading roll for a screw machine from the pitch diameter of the thread to be rolled, the single depth of thread and the number of starts on the roll, by the handbook formula, with the roll lead.",
    "keywords": [
      "MAKEOS",
      "thread rolling",
      "threading roll",
      "roll pitch diameter",
      "multiple-start roll",
      "screw machine",
      "cold rolling threads"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Pitch diameter of the screw thread",
        "type": "number",
        "default": 11.43,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Single depth of thread",
        "type": "number",
        "default": 1.2675,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ns",
        "label": "Starts on the roll",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "P",
        "label": "Thread pitch",
        "type": "number",
        "default": 1.954,
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
    "id": "hobbing-time",
    "name": "Gear Hobbing Cycle Time",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "How long does it take to hob this gear at the chosen hob speed and feed?",
    "description": "Hobbing time for a spur or helical gear from the number of teeth, hob starts, hob diameter and cutting speed, axial feed per work revolution, face width, helix angle, full-depth approach and overrun, for one gear or a stack.",
    "keywords": [
      "MAKEOS",
      "gear hobbing",
      "hobbing time",
      "hob feed",
      "cycle time",
      "gear cutting",
      "hob speed"
    ],
    "fields": [
      {
        "key": "z",
        "label": "Number of teeth in the gear",
        "type": "number",
        "default": 40,
        "unit": "",
        "min": 4,
        "max": 2000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "starts",
        "label": "Hob starts",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Dh",
        "label": "Hob outside diameter",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 60,
        "unit": "m/min",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Axial feed per work revolution",
        "type": "number",
        "default": 1.5,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Face width (of the stack)",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Whole depth of tooth",
        "type": "number",
        "default": 5.625,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
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
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "over",
        "label": "Overrun",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stack",
        "label": "Gears in the stack",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "load",
        "label": "Load and unload time per stack",
        "type": "number",
        "default": 1,
        "unit": "min",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "angle-ring-length",
    "name": "Length of Angle or Bar Bent to a Ring",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What length of angle iron or bar do I cut to roll this ring inside or outside a tank?",
    "description": "Cut length of an angle, flat or other section rolled into a ring, from the diameter at the back of the section and the distance to its neutral axis, or from a handbook-style length constant, for sections placed inside or outside a tank or stack.",
    "keywords": [
      "MAKEOS",
      "angle ring",
      "rolled angle",
      "tank stiffener",
      "ring length",
      "neutral axis",
      "rolling sections"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Correction from",
        "type": "select",
        "default": "axis",
        "options": [
          [
            "axis",
            "Neutral-axis distance"
          ],
          [
            "constant",
            "Length constant"
          ]
        ]
      },
      {
        "key": "place",
        "label": "Section is",
        "type": "select",
        "default": "inside",
        "options": [
          [
            "inside",
            "Inside the shell (diameter is the inside of the shell)"
          ],
          [
            "outside",
            "Outside the shell (diameter is the outside of the shell)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Shell diameter at the back of the section",
        "type": "number",
        "default": 6096,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Back of section to neutral axis",
        "type": "number",
        "default": 22.5,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Length constant",
        "type": "number",
        "default": 109.7,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "perforated-open-area",
    "name": "Perforated Sheet Open Area and Hole Count",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What open area, hole count and weight does a perforated sheet with this hole and pitch have?",
    "description": "Open area percentage of perforated sheet with round holes on a 60° staggered or straight (square) pattern, holes per square metre, the solid fraction and the mass of a sheet of given size, thickness and density.",
    "keywords": [
      "MAKEOS",
      "perforated sheet",
      "open area",
      "perforated metal",
      "hole pattern",
      "screen",
      "staggered holes"
    ],
    "fields": [
      {
        "key": "pattern",
        "label": "Hole pattern",
        "type": "select",
        "default": "stag60",
        "options": [
          [
            "stag60",
            "Round holes, 60° staggered"
          ],
          [
            "straight",
            "Round holes, straight rows"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Hole diameter",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Hole centre distance (pitch)",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Sheet area",
        "type": "number",
        "default": 2,
        "unit": "m²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Sheet thickness",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Material density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "sound-level",
    "name": "Machinery Noise: Machine Level, Combined Sources and Distance",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "How loud is this machine on its own, how loud are several sources together, and how does level fall with distance?",
    "description": "Noise level of a single machine from the total and background readings by the handbook method, the combined level of up to four sources, and the free-field change in level with distance from a source.",
    "keywords": [
      "MAKEOS",
      "noise",
      "sound level",
      "decibel",
      "dBA",
      "background noise",
      "machinery noise"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculation",
        "type": "select",
        "default": "machine",
        "options": [
          [
            "machine",
            "Machine alone from total and background"
          ],
          [
            "sum",
            "Combine several sources"
          ],
          [
            "distance",
            "Change with distance"
          ]
        ]
      },
      {
        "key": "T",
        "label": "Total level, machine running",
        "type": "number",
        "default": 51,
        "unit": "dB",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Background level, machine off",
        "type": "number",
        "default": 49,
        "unit": "dB",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L1",
        "label": "Source 1",
        "type": "number",
        "default": 85,
        "unit": "dB",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "Source 2",
        "type": "number",
        "default": 82,
        "unit": "dB",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L3",
        "label": "Source 3 (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "dB",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L4",
        "label": "Source 4 (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "dB",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lr",
        "label": "Level at the reference distance",
        "type": "number",
        "default": 90,
        "unit": "dB",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r1",
        "label": "Reference distance",
        "type": "number",
        "default": 1,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r2",
        "label": "New distance",
        "type": "number",
        "default": 4,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "equivalent-stiffness-thickness",
    "name": "Equivalent Thickness for Equal Stiffness or Strength",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How thick must a part in the new material be to match the stiffness and strength of the original?",
    "description": "Wall or plate thickness needed in a substitute material (for example plastic replacing metal) for the same bending stiffness and for the same bending strength as the original, the governing thickness, and the resulting mass ratio.",
    "keywords": [
      "MAKEOS",
      "material substitution",
      "equivalent thickness",
      "plastic replacement",
      "bending stiffness",
      "stiffness design",
      "lightweighting"
    ],
    "fields": [
      {
        "key": "t1",
        "label": "Original thickness",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E1",
        "label": "Original modulus",
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
        "key": "S1",
        "label": "Original allowable stress",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho1",
        "label": "Original density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E2",
        "label": "New material modulus",
        "type": "number",
        "default": 3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S2",
        "label": "New material allowable stress",
        "type": "number",
        "default": 60,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho2",
        "label": "New material density",
        "type": "number",
        "default": 1200,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "matrix-3x3",
    "name": "3 × 3 Matrix Determinant, Adjoint and Inverse",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "What are the determinant and inverse of this 3 × 3 matrix?",
    "description": "Determinant, adjoint (adjugate) and inverse of a 3 × 3 matrix by cofactors, as set out in the handbook’s matrix operations, with a check that the matrix times its inverse returns the identity.",
    "keywords": [
      "MAKEOS",
      "matrix",
      "determinant",
      "inverse matrix",
      "adjoint",
      "cofactor",
      "linear algebra"
    ],
    "fields": [
      {
        "key": "a11",
        "label": "a₁₁",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a12",
        "label": "a₁₂",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a13",
        "label": "a₁₃",
        "type": "number",
        "default": -1,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a21",
        "label": "a₂₁",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a22",
        "label": "a₂₂",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a23",
        "label": "a₂₃",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a31",
        "label": "a₃₁",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a32",
        "label": "a₃₂",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a33",
        "label": "a₃₃",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "wood-moisture-density",
    "name": "Wood Moisture Content and Density",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What is the moisture content of this timber, and what is its density at a given moisture content?",
    "description": "Moisture content of wood from its wet and oven-dry mass, and the density of wood at any moisture content from its specific gravity by the handbook formula, with the mass of a piece at that moisture content.",
    "keywords": [
      "MAKEOS",
      "wood moisture",
      "moisture content",
      "timber density",
      "lumber",
      "specific gravity of wood",
      "seasoning"
    ],
    "fields": [
      {
        "key": "wet",
        "label": "Mass as tested",
        "type": "number",
        "default": 12.5,
        "unit": "g",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dry",
        "label": "Oven-dry mass",
        "type": "number",
        "default": 10,
        "unit": "g",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Specific gravity of the wood",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0.05,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "M",
        "label": "Moisture content for density",
        "type": "number",
        "default": 12,
        "unit": "%",
        "min": 0,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "Volume of a piece",
        "type": "number",
        "default": 50,
        "unit": "L",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
