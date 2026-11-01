// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook92) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "crossed-helical-exact-centre-distance",
    "name": "Crossed Helical Gears at an Exact Centre Distance (Any Shaft Angle, Minimum Centre Distance, Cutter Numbers)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For a pair of crossed helical gears on non-parallel shafts at an exact centre distance, what helix angles make the gears fit, what are their pitch and outside diameters and leads, what is the least centre distance for the ratio and which formed cutters do I use?",
    "description": "Helical gears for shafts at any angle and an exact centre distance by the handbook procedure (same hand, helix angles adding to the shaft angle Σ): pinion teeth nearest n = 2 C Pn cos αa cos βa ÷ (R cos βa + cos αa) for approximate helix angles, exact helix angles found by trial from R sec α + sec β = 2 C Pn ÷ n with β = Σ − α, pitch diameters D = N ÷ (Pn cos α) and d = n ÷ (Pn cos β), outside diameters D + 2 ÷ Pn and d + 2 ÷ Pn, leads L = π D cot α and l = π d cot β, the helix angle for the least centre distance (cot α = R^⅓ at 90°), and formed cutter numbers from N′ = N sec³ α + Pn Dc tan² α.",
    "keywords": [
      "MAKEOS",
      "crossed helical gears",
      "spiral gears",
      "helical gears shafts at right angles",
      "exact centre distance helical",
      "minimum centre distance helical gears",
      "helical gear cutter number"
    ],
    "fields": [
      {
        "key": "sigma",
        "label": "Shaft angle Σ",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 1,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Exact centre distance C",
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
        "key": "mn",
        "label": "Normal module mn (25.4 ÷ Pn)",
        "type": "number",
        "default": 3.175,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Teeth in gear N",
        "type": "number",
        "default": 84,
        "unit": "teeth",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "n",
        "label": "Teeth in pinion n",
        "type": "number",
        "default": 28,
        "unit": "teeth",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "alphaA",
        "label": "Approximate helix angle of gear αa",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 0.1,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dc",
        "label": "Pitch diameter of the formed cutter Dc",
        "type": "number",
        "default": 66.294,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "helical-milling-cutter-selection",
    "name": "Helical Gear Milling Cutter Selection (Preferred Formula with Cutter Diameter, Lead, Tooth Depth)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "Which involute formed cutter do I use to mill a helical gear, by the handbook’s preferred formula that allows for the cutter diameter, and what lead, tooth depth and tooth thickness go with it?",
    "description": "Selecting the formed milling cutter for a helical gear by the handbook’s preferred formula N′ = N sec³ α + Pn Dc tan² α (written N′ = N K + Q K′ with K = sec³ α, K′ = tan² α and Q = Pn Dc), which gives correct results for all combinations of helix angle and tooth number, compared with the approximate N′ = N ÷ cos³ α; the cutter number from the involute cutter series (regular and half-number); with the pitch diameter N ÷ (Pn cos α), lead π D cot α, whole depth 2.157 ÷ Pn and tooth thickness 1.571 ÷ Pn at the pitch line.",
    "keywords": [
      "MAKEOS",
      "helical gear cutter selection",
      "formed cutter number helical gear",
      "milling helical gears",
      "equivalent number of teeth",
      "involute cutter number",
      "helical gear lead"
    ],
    "fields": [
      {
        "key": "Nt",
        "label": "Teeth in the helical gear N",
        "type": "number",
        "default": 15,
        "unit": "teeth",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "helix",
        "label": "Helix angle α",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 75,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mn",
        "label": "Normal module mn (25.4 ÷ Pn)",
        "type": "number",
        "default": 1.27,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dc",
        "label": "Pitch diameter of the cutter Dc",
        "type": "number",
        "default": 48.006,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "enlarged-helical-pinion",
    "name": "Enlarged Helical Pinion (20° Normal Pressure Angle) and Tight-Mesh Centre Distance",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "How much should I enlarge a helical pinion with few teeth to avoid undercut, what outside diameter does it take, and at what centre distance will it run in tight mesh with its mating gear?",
    "description": "Enlargement of full-depth helical pinions of 20° normal pressure angle by the handbook formulas: transverse diametral pitch Pt = Pn cos ψ, pitch diameter d = n ÷ Pt, transverse pressure angle tan φt = tan φn ÷ cos ψ, enlargement Kh = 2.1 − (n ÷ cos ψ)(sin φt − cos φt tan 5°) sin φt and outside diameter do = d + (2 + Kh) ÷ Pn; then the centre distance for tight mesh with the mating gear, inv φ = inv φt + (tnP + tnG − π) ÷ (n + N) and C′ = C cos φt ÷ cos φ with C = (n + N) ÷ (2 Pn cos ψ).",
    "keywords": [
      "MAKEOS",
      "enlarged helical pinion",
      "helical pinion undercut",
      "pinion enlargement",
      "tight mesh centre distance",
      "operating pressure angle",
      "involute function centre distance"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Teeth in pinion n",
        "type": "number",
        "default": 12,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mn",
        "label": "Normal module mn (25.4 ÷ Pn)",
        "type": "number",
        "default": 0.79375,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "psi",
        "label": "Helix angle ψ",
        "type": "number",
        "default": 18,
        "unit": "°",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_mating_gear_and_tight_mesh",
        "label": "Mating gear and tight mesh",
        "type": "heading"
      },
      {
        "key": "Nt",
        "label": "Teeth in mating gear N",
        "type": "number",
        "default": 24,
        "unit": "teeth",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "tnP",
        "label": "Pinion tooth thickness at 1 diametral pitch tnP (Table 9c)",
        "type": "number",
        "default": 1.94703,
        "unit": "",
        "min": 0.000001,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tnG",
        "label": "Gear tooth thickness at 1 diametral pitch tnG",
        "type": "number",
        "default": 1.5708,
        "unit": "",
        "min": 0.000001,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "helical-hobbing-change-gears",
    "name": "Helical Gear Hobbing Change Gears (Machine Without Differential, Feed Correction, Lead Error)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "On a gear hobbing machine without a differential, what index gear ratio does a helical gear need, how do I adjust the feed to make up for the error in the index gears I can fit, and what lead do I actually get?",
    "description": "Index and feed change gears for hobbing helical gears on a machine without a differential by the handbook formulas: index gear ratio R = L ÷ (L ∓ F) × K T ÷ N (minus when gear and hob are the same hand, plus when opposite, reversed for climb hobbing), the error of the obtainable index ratio, the feed that compensates for it F = L (N R − K T) ÷ (N R), the feed gear ratio F ÷ M, the feed from the feed gears fitted, and the lead obtained L = F N R ÷ (N R − K T) with its error.",
    "keywords": [
      "MAKEOS",
      "helical gear hobbing change gears",
      "index gear ratio hobbing",
      "hobbing without differential",
      "feed gear correction",
      "helical lead error",
      "hobbing machine constant"
    ],
    "fields": [
      {
        "key": "Nt",
        "label": "Teeth on gear N",
        "type": "number",
        "default": 48,
        "unit": "teeth",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "L",
        "label": "Lead of gear L",
        "type": "number",
        "default": 1119.87076,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Feed per gear revolution F (nominal)",
        "type": "number",
        "default": 0.889,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Machine constant K",
        "type": "number",
        "default": 30,
        "unit": "",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Threads on hob T",
        "type": "number",
        "default": 1,
        "unit": "threads",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "M",
        "label": "Feed gear constant M",
        "type": "number",
        "default": 1.905,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hand",
        "label": "Hands of gear and hob",
        "type": "select",
        "default": "same",
        "options": [
          [
            "same",
            "Same hand"
          ],
          [
            "opposite",
            "Opposite hand"
          ]
        ]
      },
      {
        "key": "mode",
        "label": "Hobbing direction",
        "type": "select",
        "default": "conv",
        "options": [
          [
            "conv",
            "Conventional hobbing"
          ],
          [
            "climb",
            "Climb hobbing"
          ]
        ]
      },
      {
        "key": "h_index_gears_fitted",
        "label": "Index gears fitted",
        "type": "heading"
      },
      {
        "key": "i1",
        "label": "Index driving gear 1",
        "type": "number",
        "default": 34,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "i2",
        "label": "Index driving gear 2",
        "type": "number",
        "default": 53,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "i3",
        "label": "Index driven gear 1",
        "type": "number",
        "default": 43,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "i4",
        "label": "Index driven gear 2",
        "type": "number",
        "default": 67,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_feed_gears_fitted",
        "label": "Feed gears fitted",
        "type": "heading"
      },
      {
        "key": "f1",
        "label": "Feed driving gear 1",
        "type": "number",
        "default": 71,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "f2",
        "label": "Feed driving gear 2",
        "type": "number",
        "default": 75,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "f3",
        "label": "Feed driven gear 1",
        "type": "number",
        "default": 106,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "f4",
        "label": "Feed driven gear 2",
        "type": "number",
        "default": 112,
        "unit": "teeth",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "errMax",
        "label": "Largest lead error you accept per 100 mm of lead",
        "type": "number",
        "default": 0.01,
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
