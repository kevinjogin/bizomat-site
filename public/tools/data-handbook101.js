// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook101) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "spline-pin-measurement",
    "name": "Inch Involute Spline Measurement Between or Over Pins",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For an inch involute spline (ANSI B92.1) with a known actual space width or tooth thickness, what is the measurement between two pins for the internal spline, or over two pins for the external spline, with the standard pin size?",
    "description": "Two-pin measurement of inch involute splines by the handbook’s formulas: pitch diameter D = N ÷ P and base diameter Db = D cos φD; for internal splines inv φi = s ÷ D + inv φD − di ÷ Db and Mi = Db sec φi − di (even teeth) or Db cos(90° ÷ N) sec φi − di (odd teeth) with di = 1.7280 ÷ P (30° and 37.5°) or 1.9200 ÷ P (45°); for external splines inv φe = t ÷ D + inv φD + de ÷ Db − π ÷ N and Me = Db sec φe + de (even) or Db cos(90° ÷ N) sec φe + de (odd) with de = 1.9200 ÷ P, the pressure angle at the pin centre found from its involute.",
    "keywords": [
      "MAKEOS",
      "spline measurement between pins",
      "spline measurement over pins",
      "involute spline pin diameter",
      "ANSI B92.1 spline inspection",
      "actual space width pins",
      "spline over wires"
    ],
    "fields": [
      {
        "key": "kind",
        "label": "Spline measured",
        "type": "select",
        "default": "int",
        "options": [
          [
            "int",
            "Internal spline, between pins"
          ],
          [
            "ext",
            "External spline, over pins"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Diametral pitch P",
        "type": "number",
        "default": 3,
        "unit": "1/in",
        "min": 0.000001,
        "max": 128,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "N",
        "label": "Number of teeth N",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 6,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "pa",
        "label": "Pressure angle",
        "type": "select",
        "default": "30",
        "options": [
          [
            "30",
            "30°"
          ],
          [
            "37.5",
            "37.5°"
          ],
          [
            "45",
            "45°"
          ]
        ]
      },
      {
        "key": "w",
        "label": "Actual space width s (internal) or tooth thickness t (external)",
        "type": "number",
        "default": 0.52677,
        "unit": "in",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pin diameter (0 = the standard pin)",
        "type": "number",
        "default": 0,
        "unit": "in",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "iso-fit-limits-from-deviations",
    "name": "ISO Limits of Size and Fit from the Fundamental Deviations",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From the fundamental deviation and IT grade I read from the ISO limits tables (with the delta value where it applies), what are the limits of size of my hole and shaft, and what clearance or interference does the fit give?",
    "description": "Limits of size by the BS ISO limits and fits procedure the handbook gives: for a shaft, ei = es − IT when the upper deviation es is tabulated or es = ei + IT when the lower deviation ei is; for a hole, EI = ES − IT or ES = EI + IT, with the delta value added to ES for holes K, M and N up to IT8 and P to ZC up to IT7; H and h have a zero deviation and Js and js are split equally about the basic size; and the largest and smallest clearance of the fit.",
    "keywords": [
      "MAKEOS",
      "ISO limits and fits",
      "fundamental deviation IT grade",
      "hole and shaft limits",
      "BS 4500 limits",
      "ISO 286 delta value",
      "clearance or interference fit"
    ],
    "fields": [
      {
        "key": "size",
        "label": "Basic size",
        "type": "number",
        "default": 45,
        "unit": "mm",
        "min": 0.000001,
        "max": 3150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hk",
        "label": "Hole deviation from the table",
        "type": "select",
        "default": "H",
        "options": [
          [
            "EI",
            "Lower deviation EI given (A to H)"
          ],
          [
            "ES",
            "Upper deviation ES given (J to ZC)"
          ],
          [
            "H",
            "H (EI = 0)"
          ],
          [
            "Js",
            "Js (± IT ÷ 2)"
          ]
        ]
      },
      {
        "key": "hdev",
        "label": "Hole deviation from the table",
        "type": "number",
        "default": 0,
        "unit": "µm",
        "min": -10000,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hIT",
        "label": "Hole IT value from the table",
        "type": "number",
        "default": 25,
        "unit": "µm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hdelta",
        "label": "Delta value Δ for the hole (0 if none)",
        "type": "number",
        "default": 0,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sk",
        "label": "Shaft deviation from the table",
        "type": "select",
        "default": "ei",
        "options": [
          [
            "es",
            "Upper deviation es given (a to h)"
          ],
          [
            "ei",
            "Lower deviation ei given (j to zc)"
          ],
          [
            "h",
            "h (es = 0)"
          ],
          [
            "js",
            "js (± IT ÷ 2)"
          ]
        ]
      },
      {
        "key": "sdev",
        "label": "Shaft deviation from the table",
        "type": "number",
        "default": 26,
        "unit": "µm",
        "min": -10000,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sIT",
        "label": "Shaft IT value from the table",
        "type": "number",
        "default": 16,
        "unit": "µm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cylinder-portion-volume",
    "name": "Volume and Surface of a Cylinder Cut by a Plane (Ungula and Truncated Cylinder)",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What is the volume and the curved surface area of a cylinder cut by a sloping plane, either through a chord of the base (an ungula or hoof) or across the whole cylinder between two heights?",
    "description": "Portions of a cylinder by the handbook’s formulas: for a cylinder cut by a plane through a chord of the base, V = (2/3 a³ ± b × base area) h ÷ (r ± b) and curved surface S = (a d ± b × arc length) h ÷ (r ± b), with a the half chord, b the distance from the axis to the chord, d the diameter, plus when the base is larger than half the circle and minus when smaller; and for a cylinder cut off at an angle across its full section, V = π r² (h1 + h2) ÷ 2 and S = π r (h1 + h2).",
    "keywords": [
      "MAKEOS",
      "cylindrical ungula volume",
      "cylinder hoof volume",
      "portion of cylinder volume",
      "cylinder cut at an angle",
      "truncated cylinder volume",
      "oblique cut cylinder surface"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Cut",
        "type": "select",
        "default": "hoof",
        "options": [
          [
            "hoof",
            "Plane through a chord of the base (ungula)"
          ],
          [
            "trunc",
            "Plane across the whole cylinder (heights h1 and h2)"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Cylinder diameter d",
        "type": "number",
        "default": 127,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Height of the cut at the top edge h (ungula)",
        "type": "number",
        "default": 50.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Distance from the axis to the chord b (ungula)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "side",
        "label": "Base of the ungula (ungula)",
        "type": "select",
        "default": "small",
        "options": [
          [
            "small",
            "Half the circle or less"
          ],
          [
            "large",
            "More than half the circle"
          ]
        ]
      },
      {
        "key": "h1",
        "label": "Longest side h1 (cut across)",
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
        "key": "h2",
        "label": "Shortest side h2 (cut across)",
        "type": "number",
        "default": 100,
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
    "id": "after-tax-npv-comparison",
    "name": "After-Tax Net Present Value of Two Alternatives with Depreciation Recovery",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "For two mutually exclusive investments with the same life, what is the after-tax net present value of each, including the tax saved by straight-line depreciation and any gradient in the yearly expense, and which should I choose?",
    "description": "Net present value of two alternatives by the handbook’s present worth formulas: NPV = −P + (AR − AE − (A/G, i, n) G)(1 − TR)(P/A, i, n) + L ÷ (1 + i)ⁿ, plus the after-tax depreciation recovery ATDR = TR (P − L) ÷ n × (P/A, i, n) for straight-line depreciation, with (P/A) = ((1 + i)ⁿ − 1) ÷ (i (1 + i)ⁿ) and (A/G) = 1 ÷ i − n ÷ ((1 + i)ⁿ − 1), and the alternative with the larger NPV chosen.",
    "keywords": [
      "MAKEOS",
      "after tax NPV",
      "depreciation tax shield NPV",
      "ATDR after tax depreciation recovery",
      "compare two investments NPV",
      "present worth analysis",
      "gradient expense NPV"
    ],
    "fields": [
      {
        "key": "i",
        "label": "After-tax minimum attractive rate of return i",
        "type": "number",
        "default": 15,
        "unit": "%",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Life of both alternatives n",
        "type": "number",
        "default": 10,
        "unit": "years",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "TR",
        "label": "Income tax rate TR",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PA",
        "label": "A: initial cost P",
        "type": "number",
        "default": 75000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "LA",
        "label": "A: salvage value L",
        "type": "number",
        "default": 0,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ARA",
        "label": "A: annual revenue AR",
        "type": "number",
        "default": 25000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "AEA",
        "label": "A: annual expense AE",
        "type": "number",
        "default": 5000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "GA",
        "label": "A: yearly rise in expense G",
        "type": "number",
        "default": 0,
        "unit": "$",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PB",
        "label": "B: initial cost P",
        "type": "number",
        "default": 35000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "LB",
        "label": "B: salvage value L",
        "type": "number",
        "default": 0,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ARB",
        "label": "B: annual revenue AR",
        "type": "number",
        "default": 20000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "AEB",
        "label": "B: annual expense AE",
        "type": "number",
        "default": 8000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "GB",
        "label": "B: yearly rise in expense G",
        "type": "number",
        "default": 0,
        "unit": "$",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
