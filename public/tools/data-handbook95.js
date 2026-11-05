// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook95) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "ball-bearing-load-ratings",
    "name": "Ball Bearing Load Ratings from Geometry (Basic Dynamic and Static Ratings, L10 Life, Static Safety)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "From a ball bearing’s geometry — rows, contact angle, number and diameter of balls — what are its basic dynamic and static load ratings, what L10 life does it give at my equivalent load and speed, and is the static load safe?",
    "description": "Basic load ratings of radial, angular contact and thrust ball bearings by the AFBMA formulas the handbook gives: C = fc (i cos α)^0.7 Z^(2/3) D^1.8 for balls up to 25.4 mm, or 3.647 fc (i cos α)^0.7 Z^(2/3) D^1.4 for larger balls; thrust bearings Ca = fc Z^(2/3) D^1.8 at 90° or fc (cos α)^0.7 Z^(2/3) D^1.8 tan α otherwise; rows or bearings in tandem by the 0.7 power; the static ratings Co = fo i Z D² cos α and Coa = fo Z D² sin α; then the rating life L10 = (C ÷ P)³ in millions of revolutions and hours, and the static safety Co ÷ Po. The factors fc and fo are read from the handbook tables for D cos α ÷ dm, which the tool shows.",
    "keywords": [
      "MAKEOS",
      "ball bearing load rating",
      "basic dynamic load rating formula",
      "static load rating Co",
      "fc factor ball bearing",
      "thrust ball bearing rating",
      "bearing L10 life from geometry",
      "AFBMA ball bearing rating"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Bearing type",
        "type": "select",
        "default": "radial",
        "options": [
          [
            "radial",
            "Radial or angular contact"
          ],
          [
            "thrust",
            "Thrust"
          ]
        ]
      },
      {
        "key": "i",
        "label": "Rows of balls i",
        "type": "number",
        "default": 1,
        "unit": "rows",
        "min": 1,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "alpha",
        "label": "Nominal contact angle α",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Z",
        "label": "Balls per row Z",
        "type": "number",
        "default": 9,
        "unit": "balls",
        "min": 3,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "D",
        "label": "Ball diameter D",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dm",
        "label": "Pitch diameter of the ball set dm",
        "type": "number",
        "default": 63.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
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
        "key": "fc",
        "label": "Dynamic factor fc (metric, for D cos α ÷ dm)",
        "type": "number",
        "default": 59.9,
        "unit": "",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fo",
        "label": "Static factor fo (metric, for D cos α ÷ dm)",
        "type": "number",
        "default": 12.1,
        "unit": "",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nb",
        "label": "Similar bearings in tandem",
        "type": "number",
        "default": 1,
        "unit": "bearings",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_loads_and_requirements",
        "label": "Loads and requirements",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Equivalent dynamic load P",
        "type": "number",
        "default": 2000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed",
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
        "key": "Lreq",
        "label": "Life you require",
        "type": "number",
        "default": 20000,
        "unit": "h",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Po",
        "label": "Static equivalent load Po",
        "type": "number",
        "default": 2000,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s0Min",
        "label": "Least static safety Co ÷ Po you accept",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "roller-bearing-load-ratings",
    "name": "Roller Bearing Load Ratings from Geometry (Basic Dynamic and Static Ratings, L10 Life, Static Safety)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "From a roller bearing’s geometry — rows, contact angle, number, diameter and effective length of the rollers — what are its basic dynamic and static load ratings, what L10 life does it give at my equivalent load and speed, and is the load within the range the rating formulas suit?",
    "description": "Basic load ratings of radial and thrust roller bearings (cylindrical, tapered, spherical and needle) by the AFBMA formulas the handbook gives: radial C = fc (i leff cos α)^(7/9) Z^(3/4) D^(29/27), with bearings in tandem by the 7/9 power; thrust Ca = fc leff^(7/9) Z^(3/4) D^(29/27) at 90° or fc (leff cos α)^(7/9) Z^(3/4) D^(29/27) tan α otherwise, with equal rows by formula (18); static ratings Co = 44 (1 − D cos α ÷ dm) i Z leff D cos α and Coa = 220 (1 − D cos α ÷ dm) Z leff D sin α; then L10 = (C ÷ P)^(10/3) in millions of revolutions and hours, the static safety and the handbook’s warnings for long rollers and heavy loads. The factor fc is read from the handbook table for D cos α ÷ dm, which the tool shows.",
    "keywords": [
      "MAKEOS",
      "roller bearing load rating",
      "basic dynamic load rating roller bearing",
      "static load rating roller bearing",
      "fc factor roller bearing",
      "thrust roller bearing rating",
      "L10 10/3 exponent",
      "AFBMA roller bearing rating"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Bearing type",
        "type": "select",
        "default": "radial",
        "options": [
          [
            "radial",
            "Radial roller"
          ],
          [
            "thrust",
            "Thrust roller"
          ]
        ]
      },
      {
        "key": "i",
        "label": "Rows of rollers i",
        "type": "number",
        "default": 1,
        "unit": "rows",
        "min": 1,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "alpha",
        "label": "Nominal contact angle α",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Z",
        "label": "Rollers per row Z",
        "type": "number",
        "default": 14,
        "unit": "rollers",
        "min": 3,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "D",
        "label": "Roller diameter D (mean for tapered, major for spherical)",
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
        "key": "leff",
        "label": "Effective roller length leff",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dm",
        "label": "Pitch diameter of the roller set dm",
        "type": "number",
        "default": 70,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_factor_from_the_handbook_tables",
        "label": "Factor from the handbook tables",
        "type": "heading"
      },
      {
        "key": "fc",
        "label": "Dynamic factor fc (metric, for D cos α ÷ dm)",
        "type": "number",
        "default": 87.7,
        "unit": "",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nb",
        "label": "Similar bearings in tandem",
        "type": "number",
        "default": 1,
        "unit": "bearings",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_loads_and_requirements",
        "label": "Loads and requirements",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Equivalent dynamic load P",
        "type": "number",
        "default": 6000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed",
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
        "key": "Lreq",
        "label": "Life you require",
        "type": "number",
        "default": 8000,
        "unit": "h",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Po",
        "label": "Static equivalent load Po",
        "type": "number",
        "default": 6000,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s0Min",
        "label": "Least static safety Co ÷ Po you accept",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "disc-spring-fatigue-life",
    "name": "Disc Spring Forces, Stresses and Fatigue Life (Corrected Outside Diameter, Critical Points, Life Equations)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "For a stack of disc (Belleville) springs without contact surfaces working between a minimum and a maximum deflection, what forces do they give, what are the stresses at the critical points, which point governs fatigue, how many cycles will they last, and are the dimension ratios sensible?",
    "description": "Disc springs without contact surfaces (Groups 1 and 2, thickness up to 6 mm) by the handbook method: the cone angle tan θ = 2h ÷ (D − d), the corrected outside diameter Da = D − 2t (sin θ + cos θ ÷ 6) for the contact circle, the constants K1, K2 and K3 from δ = D ÷ d, the force F = 4 E s [(h − s ÷ 2)(h − s) t + t³] ÷ [(1 − μ²) K1 Da²] at the minimum and maximum deflection, the compressive stresses at points 0 and 1 and the tensile stresses at points 2 and 3, the critical point by the larger of σmax − 0.5 σmin, the fatigue life N = 10^(a − b (σmax − 0.5 σmin)) for the group, the stress range allowed for the life you need, and the recommended ratios D ÷ d = 1.7 to 2.5, h ÷ t = 0.4 to 1.3 and D ÷ t = 18 to 40.",
    "keywords": [
      "MAKEOS",
      "disc spring fatigue life",
      "Belleville spring fatigue",
      "disc spring stress points",
      "disc spring corrected outside diameter",
      "disc spring K1 K2 K3",
      "disc spring stack dynamic load",
      "disc spring dimension ratios"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Outside diameter D",
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
        "key": "d",
        "label": "Inside diameter d",
        "type": "number",
        "default": 41,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Thickness t",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.2,
        "max": 6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Cone height h (free height less thickness)",
        "type": "number",
        "default": 2.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Modulus of elasticity E",
        "type": "number",
        "default": 206000,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Poisson’s ratio μ",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_deflections_of_one_disc",
        "label": "Deflections of one disc",
        "type": "heading"
      },
      {
        "key": "smin",
        "label": "Deflection at minimum load smin",
        "type": "number",
        "default": 0.9,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "smax",
        "label": "Deflection at maximum load smax",
        "type": "number",
        "default": 1.32,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ns",
        "label": "Discs in series in the stack",
        "type": "number",
        "default": 6,
        "unit": "discs",
        "min": 1,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_requirements",
        "label": "Requirements",
        "type": "heading"
      },
      {
        "key": "Nreq",
        "label": "Fatigue life you require",
        "type": "number",
        "default": 1000000,
        "unit": "cycles",
        "min": 10000,
        "max": 2000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s0Max",
        "label": "Largest compressive stress at point 0 you accept",
        "type": "number",
        "default": 1600,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sTMax",
        "label": "Largest tensile stress at points 2 and 3 you accept",
        "type": "number",
        "default": 1250,
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
    "id": "thread-wire-involute-helicoid",
    "name": "Thread Measurement over Wires by the Involute Helicoid Formula (Multi-Start Threads and Worms, Pitch Diameter from a Reading)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For a multi-start thread or worm with a large lead angle, what is the exact measurement over three wires by the involute helicoid formula, how far is the simplified Buckingham formula out, and what pitch diameter does my reading over wires give?",
    "description": "Measurement over wires by the Buckingham exact involute helicoid formula the handbook gives for threads and worms where the lead angle matters: lead L = P S, tan B = L ÷ π E, the normal or axial half-angle (tan An = tan A cos B), tan F = tan An ÷ sin B, Rb = (E ÷ 2) cos F, Ta = T ÷ tan B, tan Hb = cos F tan H, inv G = Ta ÷ E + inv F + W ÷ (2 Rb cos Hb) − π ÷ S and M = 2 Rb ÷ cos G + W for any wire that touches the flanks; compared with the simplified formula M = E + W (1 + sin An) with its own wire W = T cos B ÷ cos An, and the pitch diameter worked back from a measured reading.",
    "keywords": [
      "MAKEOS",
      "three-wire measurement worm",
      "involute helicoid formula",
      "Buckingham thread measurement",
      "multi-start thread pitch diameter",
      "measurement over wires lead angle",
      "Acme worm wire measurement"
    ],
    "fields": [
      {
        "key": "E",
        "label": "Pitch diameter E",
        "type": "number",
        "default": 15.875,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Pitch P (axial)",
        "type": "number",
        "default": 3.6576,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S",
        "label": "Number of starts S",
        "type": "number",
        "default": 6,
        "unit": "starts",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "plane",
        "label": "Thread angle given in the",
        "type": "select",
        "default": "normal",
        "options": [
          [
            "normal",
            "Normal plane (cutter half-angle An)"
          ],
          [
            "axial",
            "Axial plane (half-angle A)"
          ]
        ]
      },
      {
        "key": "ang",
        "label": "Half the included thread angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 5,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wire",
        "label": "Wire size",
        "type": "select",
        "default": "given",
        "options": [
          [
            "given",
            "Wire diameter I enter"
          ],
          [
            "best",
            "Wire of the simplified formula (T cos B ÷ cos An)"
          ]
        ]
      },
      {
        "key": "W",
        "label": "Wire diameter W",
        "type": "number",
        "default": 1.781302,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_reading_and_accuracy",
        "label": "Reading and accuracy",
        "type": "heading"
      },
      {
        "key": "Mmeas",
        "label": "Measured reading over wires (0 if none)",
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
        "key": "tol",
        "label": "Accuracy you need on M",
        "type": "number",
        "default": 0.0025,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
