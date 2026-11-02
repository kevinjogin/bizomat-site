// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook87) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "area-converter",
    "name": "Area Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this area in other units?",
    "description": "Convert a area between SI, metric and US customary or British units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "area",
      "m²",
      "km²",
      "hectare",
      "are",
      "cm²",
      "mm²",
      "µm²",
      "in²",
      "ft²",
      "yd²",
      "acre",
      "mile²",
      "square mil",
      "circular mil",
      "circular inch"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Area value",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "ft2",
        "options": [
          [
            "m2",
            "m²"
          ],
          [
            "km2",
            "km²"
          ],
          [
            "ha",
            "hectare"
          ],
          [
            "are",
            "are"
          ],
          [
            "cm2",
            "cm²"
          ],
          [
            "mm2",
            "mm²"
          ],
          [
            "um2",
            "µm²"
          ],
          [
            "in2",
            "in²"
          ],
          [
            "ft2",
            "ft²"
          ],
          [
            "yd2",
            "yd²"
          ],
          [
            "acre",
            "acre"
          ],
          [
            "mi2",
            "mile²"
          ],
          [
            "mil2",
            "square mil"
          ],
          [
            "cmil",
            "circular mil"
          ],
          [
            "cin",
            "circular inch"
          ]
        ]
      }
    ]
  },
  {
    "id": "volume-converter",
    "name": "Volume and Capacity Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this volume in other units?",
    "description": "Convert a volume between SI, metric and US customary or British units and see it in every listed unit at once.",
    "keywords": [
      "MAKEOS",
      "unit conversion",
      "volume",
      "m³",
      "litre (dm³)",
      "mL (cm³)",
      "mm³",
      "hectolitre",
      "in³",
      "ft³",
      "yd³",
      "US gallon",
      "US quart",
      "US pint",
      "US fluid ounce",
      "Imperial gallon",
      "Imperial quart",
      "Imperial pint",
      "Imperial fluid ounce",
      "US bushel (2150.42 in³)",
      "Imperial bushel (8 gal)"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Volume value",
        "type": "number",
        "default": 55,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "usgal",
        "options": [
          [
            "m3",
            "m³"
          ],
          [
            "L",
            "litre (dm³)"
          ],
          [
            "mL",
            "mL (cm³)"
          ],
          [
            "mm3",
            "mm³"
          ],
          [
            "hL",
            "hectolitre"
          ],
          [
            "in3",
            "in³"
          ],
          [
            "ft3",
            "ft³"
          ],
          [
            "yd3",
            "yd³"
          ],
          [
            "usgal",
            "US gallon"
          ],
          [
            "usqt",
            "US quart"
          ],
          [
            "uspt",
            "US pint"
          ],
          [
            "usfloz",
            "US fluid ounce"
          ],
          [
            "ukgal",
            "Imperial gallon"
          ],
          [
            "ukqt",
            "Imperial quart"
          ],
          [
            "ukpt",
            "Imperial pint"
          ],
          [
            "ukfloz",
            "Imperial fluid ounce"
          ],
          [
            "usbu",
            "US bushel (2150.42 in³)"
          ],
          [
            "ukbu",
            "Imperial bushel (8 gal)"
          ]
        ]
      }
    ]
  },
  {
    "id": "inertia-converter",
    "name": "Moment of Inertia, Section Modulus and Momentum Converter",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this mass moment of inertia, second moment of area, section modulus or momentum in other units?",
    "description": "Converts the four quantities of the handbook’s moment of inertia and momentum tables between SI, metric and US customary units: mass moment of inertia (kg·m², lb·ft², lb·in², slug·ft², lbf·in·s² and others), second moment of area (m⁴, cm⁴, mm⁴, in⁴, ft⁴), section modulus (m³, cm³, mm³, in³, ft³) and momentum (kg·m/s, lb·ft/s, lb·in/s), showing the value in every unit of the same kind.",
    "keywords": [
      "MAKEOS",
      "moment of inertia conversion",
      "second moment of area conversion",
      "section modulus conversion",
      "in4 to mm4",
      "lb ft2 to kg m2",
      "momentum conversion",
      "WR2"
    ],
    "fields": [
      {
        "key": "value",
        "label": "Value to convert",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": -1000000000000000,
        "max": 1000000000000000,
        "step": "any",
        "integer": false,
        "sens": false
      },
      {
        "key": "from",
        "label": "Unit of the entered value",
        "type": "select",
        "default": "lbft2",
        "options": [
          [
            "kgm2",
            "kg·m² (mass moment of inertia)"
          ],
          [
            "gcm2",
            "g·cm² (mass moment of inertia)"
          ],
          [
            "kgmm2",
            "kg·mm² (mass moment of inertia)"
          ],
          [
            "lbft2",
            "lb·ft² (mass moment of inertia)"
          ],
          [
            "lbin2",
            "lb·in² (mass moment of inertia)"
          ],
          [
            "ozin2",
            "oz·in² (mass moment of inertia)"
          ],
          [
            "slugft2",
            "slug·ft² = lbf·ft·s² (mass moment of inertia)"
          ],
          [
            "lbfins2",
            "lbf·in·s² (mass moment of inertia)"
          ],
          [
            "m4",
            "m⁴ (second moment of area)"
          ],
          [
            "cm4",
            "cm⁴ (second moment of area)"
          ],
          [
            "mm4",
            "mm⁴ (second moment of area)"
          ],
          [
            "in4",
            "in⁴ (second moment of area)"
          ],
          [
            "ft4",
            "ft⁴ (second moment of area)"
          ],
          [
            "m3",
            "m³ (section modulus)"
          ],
          [
            "cm3",
            "cm³ (section modulus)"
          ],
          [
            "mm3",
            "mm³ (section modulus)"
          ],
          [
            "in3",
            "in³ (section modulus)"
          ],
          [
            "ft3",
            "ft³ (section modulus)"
          ],
          [
            "kgms",
            "kg·m/s (momentum)"
          ],
          [
            "lbfts",
            "lb·ft/s (momentum)"
          ],
          [
            "lbins",
            "lb·in/s (momentum)"
          ]
        ]
      }
    ]
  },
  {
    "id": "silent-chain-sprocket-inspection",
    "name": "Silent Chain Sprocket Inspection (Over-Pin Diameter, Eccentricity and Guide Groove Tolerances)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Does a cut silent (inverted-tooth) chain sprocket of 3/8 in pitch or larger pass inspection: is the measured over-pin diameter within its tolerance, the run-out of the pitch diameter to the bore within its limit, and the guide groove within its size?",
    "description": "Inspection of silent chain sprockets for 3/8 in and larger pitch by the ANSI B29.2M rules in the handbook: the nominal pitch diameter P ÷ sin(180°/N), outside diameter for rounded teeth P(cot 180°/N + 0.08), blank diameter, over-pin diameter over 0.625P gauge pins (even and odd numbers of teeth), the over-pin tolerance (0.004 + 0.001 P √N) in, all negative, the eccentricity of the pitch diameter to the bore 0.001 × PD but not less than 0.006 nor more than 0.032 in total indicator reading, and the maximum guide groove diameter P(cot 180°/N − 1.16) with its +0, −0.030 in tolerance, against your measurements.",
    "keywords": [
      "MAKEOS",
      "silent chain sprocket",
      "over pin diameter tolerance",
      "sprocket inspection",
      "inverted tooth chain",
      "ANSI B29.2",
      "sprocket run-out",
      "guide groove"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Chain pitch",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 9.5,
        "max": 51,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 25,
        "unit": "teeth",
        "min": 17,
        "max": 400,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_measured",
        "label": "Measured",
        "type": "heading"
      },
      {
        "key": "OPDm",
        "label": "Measured over-pin diameter (over 0.625P pins)",
        "type": "number",
        "default": 209.85,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TIRm",
        "label": "Measured run-out of the pitch diameter to the bore (TIR)",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Gm",
        "label": "Measured guide groove diameter",
        "type": "number",
        "default": 171.3,
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
    "id": "fuel-oil-heating-value",
    "name": "Fuel Oil Heating Value from Baumé Gravity (Specific Gravity, Heat per kg and per Litre, Fuel Use)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What is the approximate heating value of a fuel oil from its Baumé gravity or specific gravity, per kilogram and per litre, and how much oil will a burner or heater use to deliver my heat output?",
    "description": "Fuel oil heating value by the handbook’s approximate formula BTU per pound = 18,650 + 40 × (degrees Baumé − 10), with the Baumé scale for liquids lighter than water, specific gravity = 140 ÷ (130 + degrees Baumé), so that either can be entered; the value in MJ/kg, MJ/L and BTU per US gallon, and the oil burned per hour and over a running time to deliver a heat output at the appliance efficiency you enter.",
    "keywords": [
      "MAKEOS",
      "fuel oil heating value",
      "Baume gravity",
      "specific gravity of oil",
      "calorific value",
      "heating oil consumption",
      "BTU per pound",
      "burner fuel use"
    ],
    "fields": [
      {
        "key": "from",
        "label": "Gravity given as",
        "type": "select",
        "default": "be",
        "options": [
          [
            "be",
            "Degrees Baumé (liquid lighter than water)"
          ],
          [
            "sg",
            "Specific gravity (60/60 °F)"
          ]
        ]
      },
      {
        "key": "be",
        "label": "Degrees Baumé",
        "type": "number",
        "default": 26.9,
        "unit": "°Bé",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sg",
        "label": "Specific gravity",
        "type": "number",
        "default": 0.89,
        "unit": "",
        "min": 0.6,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_heat_demand",
        "label": "Heat demand",
        "type": "heading"
      },
      {
        "key": "Q",
        "label": "Heat output needed",
        "type": "number",
        "default": 100,
        "unit": "kW",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Appliance efficiency (from its data)",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Running time",
        "type": "number",
        "default": 8,
        "unit": "h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "surface-roughness-acceptance",
    "name": "Surface Roughness Acceptance (ISO 16 % Rule and Max Rule, Evaluation Length)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Does a measured surface pass its roughness requirement: under the default 16 % rule, are no more than 16 % of the measured values above the upper limit (or below a lower limit), or under the max rule, is no value above the limit — and what evaluation length should each measurement cover?",
    "description": "Acceptance of measured surface roughness values (Ra, Rz and other parameters) against the drawing limits by the comparison rules described in the handbook: with the default 16 % rule no more than 16 % of the measured values may exceed the upper limit and no more than 16 % may fall below a lower limit, and the handbook notes that more than 16 % above the limit may still be accepted when the values are normally distributed and the mean plus one standard deviation lies within the upper limit; with the max rule (the parameter marked max, for example Rz1.5max) no value may exceed the limit anywhere on the surface. The default evaluation length is five sampling lengths, ln = 5 lr.",
    "keywords": [
      "MAKEOS",
      "surface roughness acceptance",
      "16 percent rule",
      "max rule",
      "ISO 4288",
      "Ra limit",
      "Rz max",
      "evaluation length",
      "sampling length"
    ],
    "fields": [
      {
        "key": "rule",
        "label": "Rule on the drawing",
        "type": "select",
        "default": "16",
        "options": [
          [
            "16",
            "16 % rule (default, no max marked)"
          ],
          [
            "max",
            "Max rule (parameter marked max)"
          ]
        ]
      },
      {
        "key": "U",
        "label": "Upper limit of the parameter",
        "type": "number",
        "default": 0.8,
        "unit": "µm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lower",
        "label": "Lower limit",
        "type": "select",
        "default": "none",
        "options": [
          [
            "none",
            "None specified"
          ],
          [
            "yes",
            "Specified"
          ]
        ]
      },
      {
        "key": "Lw",
        "label": "Lower limit of the parameter (when specified)",
        "type": "number",
        "default": 0.2,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_measured_values",
        "label": "Measured values",
        "type": "heading"
      },
      {
        "key": "n",
        "label": "Number of values measured",
        "type": "number",
        "default": 12,
        "unit": "values",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "nAbove",
        "label": "Values above the upper limit",
        "type": "number",
        "default": 1,
        "unit": "values",
        "min": 0,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "nBelow",
        "label": "Values below the lower limit",
        "type": "number",
        "default": 0,
        "unit": "values",
        "min": 0,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "vmax",
        "label": "Largest value measured",
        "type": "number",
        "default": 0.85,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmin",
        "label": "Smallest value measured",
        "type": "number",
        "default": 0.5,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mean",
        "label": "Mean of the measured values",
        "type": "number",
        "default": 0.65,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sd",
        "label": "Standard deviation of the measured values",
        "type": "number",
        "default": 0.08,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_measuring_length",
        "label": "Measuring length",
        "type": "heading"
      },
      {
        "key": "lr",
        "label": "Sampling length (cut-off)",
        "type": "number",
        "default": 0.8,
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
