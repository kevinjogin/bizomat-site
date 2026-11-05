// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook100) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "cutting-speed-table-adjustment",
    "name": "Cutting Speed Adjusted from the Feed and Speed Tables (Turning, Milling, Drilling)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "Starting from the optimum and average feed and speed pair in the handbook’s speed tables, what cutting speed, spindle speed and feed rate do I get for my feed, depth and width of cut once the table adjustment factors are applied, and is my feed inside the recommended range for side milling?",
    "description": "The handbook’s method for adjusting the tabulated cutting speeds: V = Vopt × Ff × Fd for turning, drilling, reaming and full slot milling, V = VHSS × Ff × Fd for high-speed steel turning, V = Vopt × Ff × Fd × Far for face milling, and for end, side and slit milling with a partial radial depth the feed range fmax and fmin from the feed factors and the feed factor interpolated between Ff2 at fmin and Ff1 at fmax, with the ratios you need to read the tables, the spindle speed and the table feed rate. The table factors are entered by you.",
    "keywords": [
      "MAKEOS",
      "cutting speed adjustment factor",
      "feed factor Ff depth factor Fd",
      "Vopt Vavg speed table",
      "end milling feed factor interpolation",
      "face milling speed adjustment",
      "milling table feed rate"
    ],
    "fields": [
      {
        "key": "op",
        "label": "Operation and adjustment",
        "type": "select",
        "default": "turn",
        "options": [
          [
            "turn",
            "Turning, carbide and other tools (V = Vopt Ff Fd)"
          ],
          [
            "hss",
            "Turning, high-speed steel (V = VHSS Ff Fd)"
          ],
          [
            "face",
            "Face milling (V = Vopt Ff Fd Far)"
          ],
          [
            "slot",
            "Full slot end milling (V = Vopt Ff Fd)"
          ],
          [
            "side",
            "End or side milling, partial width (interpolated Ff, V = Vopt Ff Fd)"
          ],
          [
            "slit1",
            "Slit milling, feed into the work (V = Vopt Ff Far)"
          ],
          [
            "slit2",
            "Slit or side milling, feed parallel (interpolated Ff, V = Vopt Ff)"
          ],
          [
            "drill",
            "Drilling, reaming or threading (V = Vopt Ff Fd)"
          ]
        ]
      },
      {
        "key": "fopt",
        "label": "Optimum feed from the table fopt",
        "type": "number",
        "default": 0.4318,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vopt",
        "label": "Optimum speed from the table Vopt (or VHSS)",
        "type": "number",
        "default": 187.45,
        "unit": "m/min",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vavg",
        "label": "Average speed from the table Vavg",
        "type": "number",
        "default": 248.41,
        "unit": "m/min",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed you will use f",
        "type": "number",
        "default": 0.381,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ff",
        "label": "Feed factor Ff from the table",
        "type": "number",
        "default": 1.07,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fd",
        "label": "Depth of cut (and lead angle) factor Fd",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Far",
        "label": "Radial depth of cut factor Far (face and slit milling)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kmax",
        "label": "Maximum feed factor for ar/D (Table 15c)",
        "type": "number",
        "default": 4.5,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kmin",
        "label": "Minimum feed factor for ar/D (Table 15c)",
        "type": "number",
        "default": 3.1,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ff1",
        "label": "Feed factor at the maximum feed Ff1",
        "type": "number",
        "default": 7.9,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ff2",
        "label": "Feed factor at the minimum feed Ff2",
        "type": "number",
        "default": 7.01,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Work diameter (turning) or tool diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Teeth on the tool (1 for turning and drilling)",
        "type": "number",
        "default": 1,
        "unit": "teeth",
        "min": 1,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "grinding-force-and-power",
    "name": "Grinding Force, Torque and Power from Equivalent Chip Thickness",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "For my equivalent chip thickness, width of cut and specific grinding force, what tangential and normal grinding forces act on the wheel, and what torque and power does the wheel spindle need?",
    "description": "Grinding forces as the handbook works them: chip area = ECT × CEL, tangential force Fc = Kc × ECT × CEL with the specific grinding force Kc you enter (around 30 to 40 times the turning values), normal force FH = (FH ÷ FC) × Fc with the force ratio you enter (generally 2 to 4), and the wheel torque Fc × D ÷ 2 and power Fc × V ÷ 60,000, compared with the spindle power available.",
    "keywords": [
      "MAKEOS",
      "grinding force ECT",
      "specific grinding force Kc",
      "grinding power",
      "grinding normal force ratio",
      "wheel spindle power",
      "grinding chip area"
    ],
    "fields": [
      {
        "key": "ECT",
        "label": "Equivalent chip thickness ECT",
        "type": "number",
        "default": 0.00017,
        "unit": "mm",
        "min": 1e-7,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "CEL",
        "label": "Cutting edge length (width of cut) CEL",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kc",
        "label": "Specific grinding force Kc",
        "type": "number",
        "default": 150000,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Normal to tangential force ratio FH ÷ FC",
        "type": "number",
        "default": 2.5,
        "unit": "",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "Wheel speed V",
        "type": "number",
        "default": 2000,
        "unit": "m/min",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dw",
        "label": "Wheel diameter",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pav",
        "label": "Spindle power available (0 = no check)",
        "type": "number",
        "default": 10,
        "unit": "kW",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "grinding-economic-wheel-life",
    "name": "Grinding Economic Wheel Life and Wheel Speed",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "From the time to replace the wheel, the cost per dressing and the hourly rate, what is the equivalent tooling-cost time and the economic wheel life, and what wheel speed, removal rate and work speed follow from my Taylor constant at the economic life?",
    "description": "The handbook’s economic wheel life for grinding: equivalent tooling-cost time TV = TRPL + 60 × CE ÷ HR minutes with CE the cost per wheel dressing (the wheel cost per dressing plus the cost of dressing) and HR the hourly rate, economic life TE = 3 × TV, the wheel speed on the Taylor line V × T^0.26 = C at that life, the specific metal removal rate SMRR = 1000 × ECT × V and the work speed Vw = SMRR ÷ (1000 × ar).",
    "keywords": [
      "MAKEOS",
      "economic wheel life grinding",
      "equivalent tooling cost time TV",
      "grinding minimum cost",
      "TE = 3 TV",
      "grinding Taylor line",
      "specific metal removal rate grinding"
    ],
    "fields": [
      {
        "key": "TRPL",
        "label": "Time to replace or dress the wheel TRPL",
        "type": "number",
        "default": 1,
        "unit": "min",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cw",
        "label": "Wheel cost per dressing",
        "type": "number",
        "default": 3,
        "unit": "$",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cd",
        "label": "Cost of one dressing",
        "type": "number",
        "default": 2,
        "unit": "$",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "HR",
        "label": "Hourly rate of machine and operator",
        "type": "number",
        "default": 120,
        "unit": "$/h",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Taylor constant C at the chosen ECT (V × T^0.26)",
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
        "label": "Equivalent chip thickness ECT",
        "type": "number",
        "default": 0.00033,
        "unit": "mm",
        "min": 1e-7,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ar",
        "label": "Radial depth of cut ar",
        "type": "number",
        "default": 0.01,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bolt-torque-thread-friction",
    "name": "Bolt Tightening Torque with Separate Thread and Bearing Friction",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What tightening torque gives my bolt preload when the thread friction and the nut or head bearing friction differ, how much of the torque goes into stretching the bolt, and how do the handbook’s simplified forms compare?",
    "description": "Tightening torque by the handbook’s Equations (21) to (24): T = PB [l ÷ 2π + d2 μ1 ÷ (2 cos α) + (d + b) μ2 ÷ 4] with the lead l, pitch diameter d2, thread half angle α, bearing face diameter b and the thread and bearing friction coefficients μ1 and μ2 you enter, the 60° thread forms T = PB [0.159 l + d (0.531 μ1 + 0.625 μ2)] and T = PB (0.159 l + 1.156 μ d), and the preload PB from a share of the tensile strength on the stress area of Equation (9) or entered directly.",
    "keywords": [
      "MAKEOS",
      "bolt torque thread friction",
      "nut bearing friction torque",
      "torque preload equation",
      "T = PB(0.159l + 1.156μd)",
      "bolt tightening torque split",
      "underhead friction"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nominal (major) diameter d",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Thread pitch",
        "type": "number",
        "default": 1.953846,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "starts",
        "label": "Number of thread starts",
        "type": "number",
        "default": 1,
        "unit": "starts",
        "min": 1,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "alpha",
        "label": "Thread half angle α",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pre",
        "label": "Preload from",
        "type": "select",
        "default": "pct",
        "options": [
          [
            "pct",
            "A share of the tensile strength on the stress area"
          ],
          [
            "direct",
            "A preload you enter"
          ]
        ]
      },
      {
        "key": "Sut",
        "label": "Minimum tensile strength of the bolt",
        "type": "number",
        "default": 1034.21,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pct",
        "label": "Preload as a share of the tensile strength",
        "type": "number",
        "default": 55,
        "unit": "%",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "PB",
        "label": "Preload PB (when entered directly)",
        "type": "number",
        "default": 50,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu1",
        "label": "Thread friction coefficient μ1",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu2",
        "label": "Nut or head bearing friction coefficient μ2",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Bearing face diameter b (0 = 1.5 d, no loose washer)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "power-thread-basic-sizes",
    "name": "Square, Modified Square and 60° Stub Thread Basic Sizes",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the basic pitch and minor diameters, thread depth, thread thickness and crest and root flats of a square thread, a 10° modified square thread or a 60° stub thread, with my clearance, and what is the lead angle?",
    "description": "Basic dimensions of the alternative power transmission thread forms the handbook gives: square thread h = t = 0.5p, E = D − 0.5p, K = D − p; 10° modified square thread E = D − 0.5p, K = D − p, h = 0.5p, t = 0.5p, crest flat F = 0.4563p and root flat G = 0.4563p − 0.17C; 60° stub thread t = 0.5p, h = 0.433p, F = 0.25p, G = 0.227p, E = D − 0.433p, K = D − 0.866p with a clearance of at least 0.02p added to the depth; and the lead and lead angle for the number of starts.",
    "keywords": [
      "MAKEOS",
      "square thread dimensions",
      "10 degree modified square thread",
      "60 degree stub thread",
      "square thread pitch diameter",
      "power thread basic sizes",
      "square thread depth"
    ],
    "fields": [
      {
        "key": "form",
        "label": "Thread form",
        "type": "select",
        "default": "ms",
        "options": [
          [
            "sq",
            "Square thread"
          ],
          [
            "ms",
            "10° modified square thread"
          ],
          [
            "st",
            "60° stub thread"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Basic major diameter D",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Pitch p",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
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
        "key": "C",
        "label": "Clearance added to the depth C",
        "type": "number",
        "default": 0.15,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
