// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook94) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "milled-bevel-gear-dimensions",
    "name": "Milled Bevel Gear Dimensions (Cone Angles, Blank, Cutting Angle, Vertex Distances)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For a pair of bevel gears to be cut with formed milling cutters, what are the pitch cone, addendum, dedendum, face and cutting angles, the outside diameters and vertex distances to turn the blanks to, the small-end tooth sizes, the widest face allowed and the tooth numbers for selecting the cutters?",
    "description": "Dimensions of a pair of milled bevel gears with shafts at any angle by the handbook’s rules for milled bevel gears, where pinion and gear have equal tooth thickness, addendum and dedendum: pitch cone angles tan γP = sin Σ ÷ (NG ÷ NP + cos Σ) and γG = Σ − γP, pitch diameters N ÷ P, addendum 1 ÷ P, dedendum 1.157 ÷ P, whole depth 2.157 ÷ P, tooth thickness 1.5708 ÷ P, pitch cone radius C = D ÷ 2 sin γ, the widest face (C ÷ 3 or 8 ÷ P, whichever is smaller), small-end addendum and thickness in the ratio (C − F) ÷ C, addendum and dedendum angles tan α = S ÷ C and tan δ = (S + A) ÷ C, face angle γ + α, compound rest angle 90° − γ − α, cutting angle γ − δ (or γ − α for uniform clearance), angular addendum S cos γ, outside diameter D + 2K, vertex distances J = (O ÷ 2) cot (γ + α) and j = J (C − F) ÷ C, and the number of teeth N ÷ cos γ for which to select each formed cutter.",
    "keywords": [
      "MAKEOS",
      "milled bevel gear dimensions",
      "bevel gear blank dimensions",
      "bevel gear cutting angle",
      "bevel gear face angle",
      "pitch cone angle",
      "vertex distance bevel gear",
      "formed cutter bevel gear",
      "bevel gear compound rest angle"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module m (25.4 ÷ P)",
        "type": "number",
        "default": 6.35,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "NP",
        "label": "Teeth in pinion NP",
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
        "key": "NG",
        "label": "Teeth in gear NG",
        "type": "number",
        "default": 50,
        "unit": "teeth",
        "min": 5,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "sigma",
        "label": "Shaft angle Σ",
        "type": "number",
        "default": 70,
        "unit": "°",
        "min": 1,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Face width F",
        "type": "number",
        "default": 38.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "root",
        "label": "Cutting (root) angle",
        "type": "select",
        "default": "table",
        "options": [
          [
            "table",
            "Pitch cone angle − dedendum angle (handbook table)"
          ],
          [
            "uniform",
            "Pitch cone angle − addendum angle (uniform clearance)"
          ]
        ]
      }
    ]
  },
  {
    "id": "bevel-gear-milling-offset",
    "name": "Bevel Gear Milling Offset and Caliper Settings (Cutter Setover, Cutting Angle, Chordal Thickness at Both Ends)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "When milling a bevel gear with a formed cutter in two cuts, how far must I offset the blank from the central position, what cutting angle do I set on the dividing head, and what chordal thickness and chordal addendum do I set the gear tooth caliper to at the large and small ends of the tooth?",
    "description": "Set-up for milling a bevel gear with a rotary formed cutter by the handbook method: pitch diameter and pitch cone radius C = D ÷ 2 sin γ, the ratio C ÷ F for reading the offset factor, the number of teeth N ÷ cos γ for selecting the cutter, the depth 1.157 ÷ P at which to measure the cutter thickness, the offset T ÷ 2 − factor ÷ P from the cutter’s measured thickness and the factor you read from the handbook table, the dividing head cutting angle (pitch cone angle less addendum angle), and the circular and chordal thickness and chordal addendum at the large end (T = 1.5708 ÷ P, Tc = T − T³ ÷ 6D², Sc = S + T² cos γ ÷ 4D) and at the small end in the ratio (C − F) ÷ C.",
    "keywords": [
      "MAKEOS",
      "bevel gear milling offset",
      "offset of cutter for milling bevel gears",
      "bevel gear setover",
      "bevel gear chordal thickness",
      "bevel gear chordal addendum small end",
      "milling bevel gears dividing head"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module m (25.4 ÷ P)",
        "type": "number",
        "default": 4.233333,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Teeth in gear being cut N",
        "type": "number",
        "default": 24,
        "unit": "teeth",
        "min": 5,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "gamma",
        "label": "Pitch cone angle γ",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0.000001,
        "max": 89.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Face width F",
        "type": "number",
        "default": 31.75,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cutter_and_offset_factor",
        "label": "Cutter and offset factor",
        "type": "heading"
      },
      {
        "key": "Tc",
        "label": "Cutter thickness at pitch line, measured at depth 1.157 ÷ P",
        "type": "number",
        "default": 4.4323,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "factor",
        "label": "Offset factor from the handbook table (for the cutter number and C ÷ F)",
        "type": "number",
        "default": 0.28,
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
    "id": "sae-straight-sided-spline",
    "name": "S.A.E. Straight-Sided Spline Fitting (Width, Depth, Minor Diameter, Torque Capacity)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For an S.A.E. straight-sided spline fitting of 4, 6, 10 or 16 splines, what spline width, depth and minor diameter go with the nominal diameter and the fit I want, how much torque does it carry at the side pressure I allow, and is that enough for my torque?",
    "description": "Dimensions and torque capacity of an S.A.E. standard spline fitting (4, 6, 10 or 16 splines) by the handbook’s formulas for S.A.E. splines: spline width W (0.241D, 0.250D, 0.156D or 0.098D), and the depth h and minor diameter d for the permanent fit (A), sliding without load (B) or sliding under load (C), then the mean radius R = (D + d) ÷ 4 and the torque capacity T = p N R h per unit of bearing length (the handbook’s T = 1000 N R h at 1000 lbf/in² on the spline sides) for your side pressure and length, against the torque the fitting must carry.",
    "keywords": [
      "MAKEOS",
      "SAE spline",
      "straight-sided spline",
      "spline fitting dimensions",
      "spline torque capacity",
      "6-spline fitting",
      "10-spline fitting",
      "permanent fit spline",
      "sliding spline"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Nominal (major) diameter D",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of splines",
        "type": "select",
        "default": "6",
        "options": [
          [
            "4",
            "4 splines"
          ],
          [
            "6",
            "6 splines"
          ],
          [
            "10",
            "10 splines"
          ],
          [
            "16",
            "16 splines"
          ]
        ]
      },
      {
        "key": "fit",
        "label": "Fit",
        "type": "select",
        "default": "A",
        "options": [
          [
            "A",
            "A: permanent fit"
          ],
          [
            "B",
            "B: to slide without load"
          ],
          [
            "C",
            "C: to slide under load"
          ]
        ]
      },
      {
        "key": "h_load",
        "label": "Load",
        "type": "heading"
      },
      {
        "key": "L",
        "label": "Bearing (engaged) length",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Side pressure allowed on the splines",
        "type": "number",
        "default": 6.895,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Treq",
        "label": "Torque to carry",
        "type": "number",
        "default": 12,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "roller-chain-sprocket-tooth-form",
    "name": "Roller Chain Sprocket Tooth Form and Hob (ANSI B29.1M Seating Curve, Pressure Angles, Hob Diameter and Lead)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "To lay out or check the tooth form of a roller chain sprocket, what are the seating curve diameter, the arc centres and angles, the topping curve and the outside diameters, what pressure angles does the chain run at, and what diameter, helix angle, lead and width does the hob need?",
    "description": "ANSI B29.1M roller chain sprocket tooth form by the formulas the handbook gives: seating curve diameter Ds = 1.005 Dr + 0.003 in and R = Ds ÷ 2, angles A = 35° + 60° ÷ N and B = 18° − 56° ÷ N, ac = 0.8 Dr, M = 0.8 Dr cos A, T = 0.8 Dr sin A, E = 1.3025 Dr + 0.0015 in, chord xy = (2.605 Dr + 0.003) sin (9° − 28° ÷ N), yz, ab = 1.4 Dr, W and V, F, H = √(F² − (1.4 Dr − 0.5 P)²), S = 0.5 P cos (180° ÷ N) + H sin (180° ÷ N), the approximate outside diameter P [0.6 + cot (180° ÷ N)] and the outside diameter when the tooth is pointed, the pressure angles for new chain, minimum and average, and the standard hob: normal pitch 1.011 P, H = 0.27 P, fillet radius 0.03 P, outside diameter 1.7 (bore + Dr + 0.7 P), pitch diameter OD − Ds, helix angle sin M = Pn ÷ π Dh, lead Pn ÷ cos M and the least width.",
    "keywords": [
      "MAKEOS",
      "roller chain sprocket tooth form",
      "sprocket seating curve",
      "ANSI B29.1 sprocket",
      "sprocket topping curve",
      "sprocket pressure angle",
      "roller chain sprocket hob",
      "sprocket outside diameter pointed tooth"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Chain pitch P",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dr",
        "label": "Roller diameter Dr",
        "type": "number",
        "default": 7.9248,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Teeth in sprocket N",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 5,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_hob_for_the_sprocket",
        "label": "Hob for the sprocket",
        "type": "heading"
      },
      {
        "key": "bore",
        "label": "Hob bore",
        "type": "number",
        "default": 31.75,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
