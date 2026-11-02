// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook97) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "narrow-v-belt-rating",
    "name": "Narrow V-Belt Power Rating (3VX, 5VX, 5V, 8V) and Number of Belts",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a narrow V-belt drive (3VX, 5VX, 5V or 8V), what power does one belt carry at my small sheave diameter and speed, what is the arc of contact, and how many belts does the drive need for the design power?",
    "description": "Power rating of narrow V-belts by the ANSI/RMA IP-22 formula the handbook gives: HP = dp r [K1 − K2 ÷ dp − K3 (dp r)² − K4 log (dp r)] + KSR r per belt, with dp the small sheave pitch diameter in inches, r the faster shaft speed in thousands of rpm, the cross-section constants K1 to K4 and the speed ratio correction KSR; the rating times the length and arc of contact correction factors, the arc of contact 2 cos⁻¹ ((D − d) ÷ 2C), the belt speed, and the number of belts for the design power (power × service factor).",
    "keywords": [
      "MAKEOS",
      "narrow V-belt rating",
      "3V 5V 8V belt horsepower",
      "5VX belt power rating",
      "V-belt number of belts",
      "RMA IP-22 belt rating",
      "V-belt arc of contact"
    ],
    "fields": [
      {
        "key": "sec",
        "label": "Cross section",
        "type": "select",
        "default": "5V",
        "options": [
          [
            "3VX",
            "3VX"
          ],
          [
            "5VX",
            "5VX"
          ],
          [
            "5V",
            "5V"
          ],
          [
            "8V",
            "8V"
          ]
        ]
      },
      {
        "key": "dp",
        "label": "Pitch diameter of the small sheave dp",
        "type": "number",
        "default": 180,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dp",
        "label": "Pitch diameter of the large sheave Dp",
        "type": "number",
        "default": 355,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance C",
        "type": "number",
        "default": 800,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed of the faster shaft",
        "type": "number",
        "default": 1750,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_correction_factors_from_the_handbook_tables",
        "label": "Correction factors from the handbook tables",
        "type": "heading"
      },
      {
        "key": "KSR",
        "label": "Speed ratio correction KSR (Table 4)",
        "type": "number",
        "default": 1.083,
        "unit": "",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kL",
        "label": "Length correction factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kA",
        "label": "Arc of contact correction factor",
        "type": "number",
        "default": 0.97,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power to transmit",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor",
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
        "key": "nb",
        "label": "Belts you will fit",
        "type": "number",
        "default": 2,
        "unit": "belts",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "classical-v-belt-rating",
    "name": "Classical V-Belt Power Rating (A, AX, B, BX, C, CX, D) and Number of Belts",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a classical V-belt drive (A, AX, B, BX, C, CX or D section), what power does one belt carry at my small sheave diameter and speed, and how many belts does the drive need for the design power?",
    "description": "Power rating of classical V-belts by the ANSI/RMA IP-20 formulas the handbook gives: HP = dp r [K1 − K2 ÷ dp − K3 (dp r)² − K4 log (dp r)] + K2 r (1 − 1 ÷ KSR) per belt for each cross section (A, AX, B, BX, C, CX, D), with dp in inches and r the faster shaft speed in thousands of rpm; corrected by the length and arc of contact factors, with the speed ratio, belt speed, arc of contact and the number of belts for the design power.",
    "keywords": [
      "MAKEOS",
      "classical V-belt rating",
      "A B C D V-belt horsepower",
      "cogged AX BX CX belt rating",
      "V-belt power per belt",
      "RMA IP-20 rating formula",
      "number of V-belts"
    ],
    "fields": [
      {
        "key": "sec",
        "label": "Cross section",
        "type": "select",
        "default": "B",
        "options": [
          [
            "A",
            "A"
          ],
          [
            "AX",
            "AX (cogged)"
          ],
          [
            "B",
            "B"
          ],
          [
            "BX",
            "BX (cogged)"
          ],
          [
            "C",
            "C"
          ],
          [
            "CX",
            "CX (cogged)"
          ],
          [
            "D",
            "D"
          ]
        ]
      },
      {
        "key": "dp",
        "label": "Pitch diameter of the small sheave dp",
        "type": "number",
        "default": 140,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dp",
        "label": "Pitch diameter of the large sheave Dp",
        "type": "number",
        "default": 280,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance C",
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
        "key": "n",
        "label": "Speed of the faster shaft",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_correction_factors_from_the_handbook_tables",
        "label": "Correction factors from the handbook tables",
        "type": "heading"
      },
      {
        "key": "KSR",
        "label": "Speed ratio factor KSR (Table 10)",
        "type": "number",
        "default": 1.1106,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kL",
        "label": "Length correction factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kA",
        "label": "Arc of contact correction factor",
        "type": "number",
        "default": 0.97,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power to transmit",
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
        "key": "SF",
        "label": "Service factor",
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
        "key": "nb",
        "label": "Belts you will fit",
        "type": "number",
        "default": 3,
        "unit": "belts",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "double-v-belt-tension",
    "name": "Double V-Belt Drive by Allowable Tight Side Tension (AA, BB, CC, DD)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a double V-belt (hexagonal) drive with AA, BB, CC or DD belts, what tight side tension can one belt carry on each sheave, what effective pull and tight side tension does my design power produce, and how many belts does the drive need?",
    "description": "Double V-belt drive by the ANSI/RMA IP-21 tension method the handbook gives, for a drive of two sheaves: belt speed S = r d ÷ 3.820 (thousands of ft/min), effective pull Te = 33 Pd ÷ S (lbf, Pd in hp), tight side tension TT = Te × R ÷ (R − 1) with the tension ratio factor read for the arc of contact, slack side tension TS = TT − Te, the allowable tight side tension per belt by the formulas Tr = K1 − K2 ÷ d − K3 S² − K4 log S for each cross section on each sheave, and the number of belts Nb = TT ÷ (Tr Kf) with the length-flex correction factor Kf.",
    "keywords": [
      "MAKEOS",
      "double V-belt drive",
      "hexagonal belt tension",
      "allowable tight side tension",
      "AA BB CC DD belt",
      "RMA IP-21 double V belt",
      "belt effective pull"
    ],
    "fields": [
      {
        "key": "sec",
        "label": "Cross section",
        "type": "select",
        "default": "BB",
        "options": [
          [
            "AA",
            "AA"
          ],
          [
            "BB",
            "BB"
          ],
          [
            "CC",
            "CC"
          ],
          [
            "DD",
            "DD"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Effective diameter of the small sheave",
        "type": "number",
        "default": 160,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Effective diameter of the large sheave",
        "type": "number",
        "default": 315,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance C",
        "type": "number",
        "default": 900,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed of the faster shaft",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_factors_from_the_handbook_tables",
        "label": "Factors from the handbook tables",
        "type": "heading"
      },
      {
        "key": "RR",
        "label": "Tension ratio factor R ÷ (R − 1) for the arc (Table 21)",
        "type": "number",
        "default": 1.22,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kf",
        "label": "Length-flex correction factor Kf (Table 20)",
        "type": "number",
        "default": 0.95,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power to transmit",
        "type": "number",
        "default": 11,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor",
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
        "key": "nb",
        "label": "Belts you will fit",
        "type": "number",
        "default": 6,
        "unit": "belts",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "light-duty-v-belt-rating",
    "name": "Light Duty V-Belt Power Rating (3L, 4L, 5L, Fractional Horsepower)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a single light duty V-belt (3L, 4L or 5L) on a fractional horsepower drive, what power can it carry on my sheave at my speed, and is that enough for the load once the combined correction factor is applied?",
    "description": "Power rating of light duty V-belts by the ANSI/RMA IP-23 formulas the handbook gives: HP = r [K1 d^0.91 ÷ r^0.09 − K2 − K3 r² d³] with d = d0 − 2a (the effective outside diameter of the small sheave less the 2a differential) in inches and r the faster shaft speed in thousands of rpm, for 3L, 4L and 5L sections; the rating divided by the combined correction factor for the driven machine and speed ratio, compared with the power the belt must carry.",
    "keywords": [
      "MAKEOS",
      "light duty V-belt rating",
      "fractional horsepower belt",
      "3L 4L 5L belt",
      "FHP V-belt power",
      "RMA IP-23 rating",
      "small motor belt drive"
    ],
    "fields": [
      {
        "key": "sec",
        "label": "Cross section",
        "type": "select",
        "default": "4L",
        "options": [
          [
            "3L",
            "3L"
          ],
          [
            "4L",
            "4L"
          ],
          [
            "5L",
            "5L"
          ]
        ]
      },
      {
        "key": "d0",
        "label": "Effective outside diameter of the small sheave d0",
        "type": "number",
        "default": 76.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "twoA",
        "label": "Diameter differential 2a (Table 23)",
        "type": "number",
        "default": 1.524,
        "unit": "mm",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed of the faster shaft",
        "type": "number",
        "default": 1750,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cf",
        "label": "Combined correction factor (Table 24)",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 0.5,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Power the belt must carry",
        "type": "number",
        "default": 0.37,
        "unit": "kW",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "v-ribbed-belt-rating",
    "name": "V-Ribbed Belt Power Rating per Rib (J, L, M) and Number of Ribs",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a V-ribbed (poly-V) belt drive with J, L or M section, what power does one rib carry at my small sheave diameter and speed, and how many ribs does the belt need for the design power?",
    "description": "Power rating of V-ribbed belts by the ANSI/RMA IP-26 formulas the handbook gives, per rib: HP = dp r [K1 ÷ (dp r)^0.09 − K2 ÷ dp − K3 (dp r)²] + K2 r (1 − 1 ÷ KSR) for J, L and M sections, with dp in inches and r the faster shaft speed in thousands of rpm; corrected by the length and arc of contact factors, with the speed ratio, belt speed, arc of contact and the number of ribs for the design power.",
    "keywords": [
      "MAKEOS",
      "V-ribbed belt rating",
      "poly-V belt power per rib",
      "J L M ribbed belt",
      "RMA IP-26 rating",
      "number of ribs",
      "serpentine belt rating"
    ],
    "fields": [
      {
        "key": "sec",
        "label": "Cross section",
        "type": "select",
        "default": "L",
        "options": [
          [
            "J",
            "J"
          ],
          [
            "L",
            "L"
          ],
          [
            "M",
            "M"
          ]
        ]
      },
      {
        "key": "dp",
        "label": "Pitch diameter of the small sheave dp",
        "type": "number",
        "default": 75,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dp",
        "label": "Pitch diameter of the large sheave Dp",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance C",
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
        "key": "n",
        "label": "Speed of the faster shaft",
        "type": "number",
        "default": 2900,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_correction_factors_from_the_handbook_tables",
        "label": "Correction factors from the handbook tables",
        "type": "heading"
      },
      {
        "key": "KSR",
        "label": "Speed ratio factor KSR (Table 30)",
        "type": "number",
        "default": 1.1202,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kL",
        "label": "Length correction factor (Table 28)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kA",
        "label": "Arc of contact correction factor (Table 29)",
        "type": "number",
        "default": 0.92,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power to transmit",
        "type": "number",
        "default": 5.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor",
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
        "key": "nr",
        "label": "Ribs on the belt you will fit",
        "type": "number",
        "default": 8,
        "unit": "ribs",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "variable-speed-belt-drive",
    "name": "Variable-Speed Belt Drive (Speed Variation, Power Rating, Rim Speed) — RMA IP-25 Sections",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a variable-speed belt drive with one or two variable-pitch sheaves, what speed variation can it give, what power does the belt carry at the smallest working pitch diameter, and is the rim speed of the variable sheave within my limit?",
    "description": "Variable-speed belt drive by the ANSI/RMA IP-25 rules the handbook gives: speed variation PDmax ÷ PDmin for a single variable sheave or (DR × DN) ÷ (dr × dn) for a compound drive with both sheaves variable, the belt power rating HP = dp r [K1 (dp r)^−0.09 − K2 ÷ dp − K3 (dp r)²] + Kr r (1 − 1 ÷ KSR) for the twelve standard cross sections (1422V to 4836V) at the small pitch diameter, corrected by the length and arc of contact factors, the number of belts for the design power, and the rim speed π Do × rpm of the variable sheave.",
    "keywords": [
      "MAKEOS",
      "variable speed belt drive",
      "variable pitch sheave",
      "speed variation belt",
      "RMA IP-25 belt rating",
      "1422V 2926V belt",
      "sheave rim speed"
    ],
    "fields": [
      {
        "key": "sec",
        "label": "Cross section",
        "type": "select",
        "default": "2926V",
        "options": [
          [
            "1422V",
            "1422V"
          ],
          [
            "1922V",
            "1922V"
          ],
          [
            "2322V",
            "2322V"
          ],
          [
            "1926V",
            "1926V"
          ],
          [
            "2926V",
            "2926V"
          ],
          [
            "3226V",
            "3226V"
          ],
          [
            "2530V",
            "2530V"
          ],
          [
            "3230V",
            "3230V"
          ],
          [
            "4430V",
            "4430V"
          ],
          [
            "4036V",
            "4036V"
          ],
          [
            "4436V",
            "4436V"
          ],
          [
            "4836V",
            "4836V"
          ]
        ]
      },
      {
        "key": "dp",
        "label": "Smallest working pitch diameter of the small sheave dp",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed of the faster shaft",
        "type": "number",
        "default": 1750,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_correction_factors_from_the_handbook_tables",
        "label": "Correction factors from the handbook tables",
        "type": "heading"
      },
      {
        "key": "KSR",
        "label": "Speed ratio factor KSR (Table 34)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kL",
        "label": "Length correction factor (Table 35)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kA",
        "label": "Arc of contact correction factor (Table 36)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power to transmit",
        "type": "number",
        "default": 3,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor",
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
        "key": "nb",
        "label": "Belts you will fit",
        "type": "number",
        "default": 1,
        "unit": "belts",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_speed_variation",
        "label": "Speed variation",
        "type": "heading"
      },
      {
        "key": "mode",
        "label": "Drive arrangement",
        "type": "select",
        "default": "single",
        "options": [
          [
            "single",
            "One variable sheave"
          ],
          [
            "dual",
            "Both sheaves variable (compound)"
          ]
        ]
      },
      {
        "key": "PDmax",
        "label": "Largest pitch diameter of the (driver) variable sheave",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PDmin",
        "label": "Smallest pitch diameter of the (driver) variable sheave",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "DNmax",
        "label": "Largest pitch diameter of the driven variable sheave (compound)",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "DNmin",
        "label": "Smallest pitch diameter of the driven variable sheave (compound)",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_rim_speed",
        "label": "Rim speed",
        "type": "heading"
      },
      {
        "key": "Do",
        "label": "Outside diameter of the variable sheave",
        "type": "number",
        "default": 210,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nv",
        "label": "Speed of the variable sheave",
        "type": "number",
        "default": 1750,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmax",
        "label": "Largest rim speed the sheave is made for",
        "type": "number",
        "default": 35,
        "unit": "m/s",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "synchronous-belt-rating",
    "name": "Synchronous (Timing) Belt Rating — MXL Torque and XL to XXH Power, Teeth in Mesh, Width",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For an inch-pitch synchronous (timing) belt of MXL, XL, L, H, XH or XXH section, what torque or power does the widest standard belt carry on my small pulley at my speed, how much do too few teeth in mesh reduce it, and is the belt width I chose wide enough for the design power?",
    "description": "Ratings of synchronous belts by the ANSI/RMA IP-24 formulas the handbook gives: for MXL the torque rating Qr = d [2.63 − 3.21 × 10⁻³ d²] lbf·in for the 0.25 in belt (and the 0.12 and 0.19 in formulas), for XL, L, H, XH and XXH the power rating of the widest standard belt HP = d r [K1 − K2 (d r)²], with d the small pulley pitch diameter in inches from its teeth and pitch and r the faster shaft speed in thousands of rpm; the teeth in mesh factor (1.00 with six or more teeth, 0.20 less for each tooth below that), the belt width factor you read from the handbook table, the belt speed against the 6500 ft/min limit of the ratings, and the check against the design power.",
    "keywords": [
      "MAKEOS",
      "synchronous belt rating",
      "timing belt horsepower",
      "MXL torque rating",
      "XL L H XH XXH belt",
      "teeth in mesh factor",
      "timing belt width"
    ],
    "fields": [
      {
        "key": "sec",
        "label": "Belt section (pitch)",
        "type": "select",
        "default": "H",
        "options": [
          [
            "MXL",
            "MXL (0.080 in)"
          ],
          [
            "XL",
            "XL (0.200 in)"
          ],
          [
            "L",
            "L (0.375 in)"
          ],
          [
            "H",
            "H (0.500 in)"
          ],
          [
            "XH",
            "XH (0.875 in)"
          ],
          [
            "XXH",
            "XXH (1.250 in)"
          ]
        ]
      },
      {
        "key": "z",
        "label": "Teeth on the small pulley",
        "type": "number",
        "default": 24,
        "unit": "teeth",
        "min": 8,
        "max": 300,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "n",
        "label": "Speed of the faster shaft",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mesh",
        "label": "Teeth in mesh on the small pulley",
        "type": "number",
        "default": 8,
        "unit": "teeth",
        "min": 2,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mxlw",
        "label": "MXL belt width",
        "type": "select",
        "default": "0.25",
        "options": [
          [
            "0.25",
            "0.25 in (6.4 mm)"
          ],
          [
            "0.19",
            "0.19 in (4.8 mm)"
          ],
          [
            "0.12",
            "0.12 in (3.0 mm)"
          ]
        ]
      },
      {
        "key": "wf",
        "label": "Belt width factor (Table 48; 1.00 for the widest standard width)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power to transmit",
        "type": "number",
        "default": 5,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
