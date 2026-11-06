// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook89) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "grinding-wheel-life-plan",
    "name": "Grinding Wheel Life and Removal Rate Plan (Taylor Line at an Equivalent Chip Thickness, Shop Calibration)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "For grinding at a chosen equivalent chip thickness, what wheel speed gives the wheel life I want, what specific removal rate and work speed follow, how long does a pass take, and how do I correct the standard Taylor constant with one result from my own shop?",
    "description": "Grinding data by the handbook’s machinability system: each material group has Taylor lines V × T^0.26 = C at four equivalent chip thicknesses (ECT), so the wheel speed for a desired wheel life is V = C ÷ T^0.26, the specific metal removal rate SMRR = 1000 × ECT × V mm³ per mm of wheel width per minute, and the work speed Vw = SMRR ÷ (1000 × radial depth). One shop result (wheel speed VU and wheel life TU at a known ECT) gives the user constant CU = VU × TU^0.26 and the ratio CU ÷ C that corrects the standard constant at the other chip thicknesses. Wheel and work rpm, side feed (fraction of wheel width), feed rate, removal rate and grinding time per pass with spark-out complete the plan, checked against the maximum speed marked on the wheel.",
    "keywords": [
      "MAKEOS",
      "grinding wheel life",
      "equivalent chip thickness",
      "Taylor grinding",
      "specific metal removal rate",
      "SMRR",
      "grinding speeds and feeds",
      "wheel speed for wheel life"
    ],
    "fields": [
      {
        "key": "C",
        "label": "Standard Taylor constant C at the chosen ECT (from the material group table)",
        "type": "number",
        "default": 4690,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ECT",
        "label": "Equivalent chip thickness chosen",
        "type": "number",
        "default": 0.00033,
        "unit": "mm",
        "min": 0.000005,
        "max": 0.01,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Wheel life wanted",
        "type": "number",
        "default": 15,
        "unit": "min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_shop_calibration",
        "label": "Shop calibration",
        "type": "heading"
      },
      {
        "key": "cal",
        "label": "Calibrate with a shop result",
        "type": "select",
        "default": "no",
        "options": [
          [
            "no",
            "No: use the standard constant"
          ],
          [
            "yes",
            "Yes: one shop result"
          ]
        ]
      },
      {
        "key": "VU",
        "label": "Shop wheel speed VU",
        "type": "number",
        "default": 1800,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TU",
        "label": "Shop wheel life TU",
        "type": "number",
        "default": 7,
        "unit": "min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "CshopStd",
        "label": "Standard constant C at the ECT of the shop result",
        "type": "number",
        "default": 5290,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_set_up",
        "label": "Set-up",
        "type": "heading"
      },
      {
        "key": "ar",
        "label": "Radial depth of cut ar",
        "type": "number",
        "default": 0.01,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Wheel diameter",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dw",
        "label": "Work diameter (cylindrical grinding)",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "width",
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
        "label": "Side feed as a fraction of wheel width C",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dist",
        "label": "Grinding distance per pass",
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
        "key": "tsp",
        "label": "Spark-out time per pass",
        "type": "number",
        "default": 0.05,
        "unit": "min",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmax",
        "label": "Maximum operating speed marked on the wheel",
        "type": "number",
        "default": 45,
        "unit": "m/s",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "thread-tool-relief-angles",
    "name": "Single-Point Thread Cutting Tool Relief and Nose Angles (Leading and Trailing Flanks)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For a single-point tool to cut a thread of a given lead, major and minor diameter and thread angle, what side relief angles must I grind below the leading and trailing cutting edges (parallel to the axis and perpendicular to the edges) to keep the effective relief I want, and what is the angle where the two flanks meet?",
    "description": "Relief angles of single-point thread cutting tools by the handbook formulas: the helix angles of the thread at the minor diameter, tan ψ = lead ÷ (π K), and at the major diameter, tan φ = lead ÷ (π D); the side relief angles parallel to the thread axis a = ae + ψ at the leading edge and a′ = ae − φ at the trailing edge for an effective relief ae; the relief angles actually ground perpendicular to the side cutting edges, tan b = tan a cos(½ thread angle) and tan b′ = tan a′ cos(½ thread angle); and the nose angle where the flanks meet, tan n = (tan a − tan a′) ÷ (2 tan(½ thread angle)).",
    "keywords": [
      "MAKEOS",
      "thread tool relief angle",
      "single point threading tool",
      "leading flank relief",
      "trailing flank relief",
      "helix angle",
      "Acme thread tool",
      "tool grinding angles"
    ],
    "fields": [
      {
        "key": "lead",
        "label": "Lead of the thread (pitch × number of starts)",
        "type": "number",
        "default": 10.16,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dmaj",
        "label": "Major diameter D",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kmin",
        "label": "Minor diameter K",
        "type": "number",
        "default": 19.812,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang",
        "label": "Included angle of the thread (and tool)",
        "type": "number",
        "default": 29,
        "unit": "°",
        "min": 10,
        "max": 120,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ae",
        "label": "Effective relief angle ae wanted",
        "type": "number",
        "default": 10,
        "unit": "°",
        "min": 0.000001,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "milling-chip-thickness-ect",
    "name": "Milling Mean Chip Thickness and Equivalent Chip Thickness (Feed per Tooth for Light Radial Cuts)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "In end, side or face milling with a given radial depth, cutter diameter, number of teeth and feed per tooth, what is the angle of engagement, the mean chip thickness and the equivalent chip thickness, and what feed per tooth keeps the chip as thick as I want when the radial cut is light?",
    "description": "Chip geometry in milling by the handbook: the angle of engagement AE from cos AE = 1 − 2(ar/D) for end and side milling, or cos AE = 1 − 2(ar/D)² for face milling with the cutter centred on the work; the mean chip thickness over the arc of engagement, hm = fz (1 − cos AE) ÷ AE (end milling) or fz × 2 sin(½AE) ÷ AE (centred face milling), which reproduces the handbook Table 2a; the equivalent chip thickness ECT = fz × z ÷ π × (ar ÷ D) × aa ÷ CEL; the feed per tooth needed for a target mean chip thickness, and its ratio to the feed at the reference engagement (full slot for end milling, ar/D = 0.74 for face milling); with a check against the minimum chip thickness you set.",
    "keywords": [
      "MAKEOS",
      "mean chip thickness",
      "equivalent chip thickness milling",
      "chip thinning",
      "high speed end milling",
      "radial depth of cut",
      "feed per tooth",
      "angle of engagement"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Operation",
        "type": "select",
        "default": "end",
        "options": [
          [
            "end",
            "End or side milling (cutter at the edge of the cut)"
          ],
          [
            "face",
            "Face milling (cutter centred on the work)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Cutter diameter D",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ar",
        "label": "Radial depth (width) of cut ar",
        "type": "number",
        "default": 3.125,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Number of teeth z",
        "type": "number",
        "default": 6,
        "unit": "teeth",
        "min": 1,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "fz",
        "label": "Feed per tooth fz",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aaCEL",
        "label": "Axial depth ÷ cutting edge length aa/CEL",
        "type": "number",
        "default": 0.95,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_targets",
        "label": "Targets",
        "type": "heading"
      },
      {
        "key": "hTarget",
        "label": "Mean chip thickness wanted",
        "type": "number",
        "default": 0.108,
        "unit": "mm",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hMin",
        "label": "Least mean chip thickness you accept",
        "type": "number",
        "default": 0.03,
        "unit": "mm",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Spindle speed (for the feed rate)",
        "type": "number",
        "default": 8000,
        "unit": "rpm",
        "min": 0,
        "max": 200000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
