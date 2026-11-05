// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook103) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "planetary-arrangement-ratio",
    "name": "Planetary and Epicyclic Gearing Ratios for the 24 Handbook Arrangements",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For whichever of the handbook’s 24 planetary, epicyclic and differential gear arrangements matches mine, how many turns does the follower make for one turn of the driver, and what speed does the follower run at?",
    "description": "Speed ratios of planetary or epicyclic gearing by the formula the handbook prints with each of its 24 arrangements (Figs. 1 to 24): A the driving gear, B the driven gear or follower, C the fixed gear, x and y the planet gears, z the secondary driving gear and S the turns of the secondary driver per turn of the initial driver (negative when they turn in opposite directions), giving F, the turns of the follower per turn of the driver, or D, the turns of the driver per turn of the follower, with F = 1 ÷ D, and the follower speed for your driver speed.",
    "keywords": [
      "MAKEOS",
      "planetary gear ratio",
      "epicyclic gearing formula",
      "differential gear ratio",
      "compound planet ratio",
      "sun planet ring speed",
      "planetary arrangement speed"
    ],
    "fields": [
      {
        "key": "fig",
        "label": "Arrangement (handbook figure)",
        "type": "select",
        "default": "10",
        "options": [
          [
            "1",
            "Fig. 1 (F = 1 + C/B)"
          ],
          [
            "2",
            "Fig. 2 (F = 1 − C/B)"
          ],
          [
            "3",
            "Fig. 3 (F = C/B)"
          ],
          [
            "4",
            "Fig. 4 (F = cos E + C/B)"
          ],
          [
            "5",
            "Fig. 5 (F = 1 + xC/yB)"
          ],
          [
            "6",
            "Fig. 6 (F = 1 + yC/xB)"
          ],
          [
            "7",
            "Fig. 7 (D = 1 + xC/yA)"
          ],
          [
            "8",
            "Fig. 8 (D = 1 + yC/xA)"
          ],
          [
            "9",
            "Fig. 9 (F = 1 + C/B)"
          ],
          [
            "10",
            "Fig. 10 (D = 1 + C/A)"
          ],
          [
            "11",
            "Fig. 11 (D = 1 + C/A)"
          ],
          [
            "12",
            "Fig. 12 (F = 1 + C/B)"
          ],
          [
            "13",
            "Fig. 13 (F = 1 − Cx/yB)"
          ],
          [
            "14",
            "Fig. 14, with idler (D = (1 + C/A) ÷ (1 − Cx/yB))"
          ],
          [
            "15",
            "Fig. 15 (D = (1 + C/A) ÷ (1 − Cy/xB))"
          ],
          [
            "16",
            "Fig. 16 (D = 1 − Cx/yA)"
          ],
          [
            "17",
            "Fig. 17 (F = 1 − Cx/yB)"
          ],
          [
            "18",
            "Fig. 18 (D = 1 − Cx/yA)"
          ],
          [
            "19",
            "Fig. 19 (F = 1 + z(1 − S)/B)"
          ],
          [
            "20",
            "Fig. 20 (D = (A + z) ÷ (A + Sz))"
          ],
          [
            "21",
            "Fig. 21 (D = (A + z) ÷ (A + Sz))"
          ],
          [
            "22",
            "Fig. 22 (F = 1 + z(1 − S)/B)"
          ],
          [
            "23",
            "Fig. 23 (D = 1 + C/A)"
          ],
          [
            "24",
            "Fig. 24, bevel (D = (1 + C/A) ÷ (1 − Cy/xB))"
          ]
        ]
      },
      {
        "key": "A",
        "label": "Driving gear A (teeth or pitch diameter)",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Driven gear or follower B",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Fixed gear C",
        "type": "number",
        "default": 80,
        "unit": "",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Planet gear x",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y",
        "label": "Planet gear y",
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
        "key": "z",
        "label": "Secondary driving gear z",
        "type": "number",
        "default": 60,
        "unit": "",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S",
        "label": "Turns of the secondary driver per turn of the initial driver S",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Angle E of the inclined planet (Fig. 4)",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed of the driver",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "microdroplet-adhesion-check",
    "name": "Micro-Droplet Adhesion on a Rotating Micro Tool (MQL)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "For minimum-quantity lubrication of a micro mill or drill, will a lubricant micro-droplet stick to the rotating tool or be thrown off, and up to what spindle speed will it stay on?",
    "description": "The handbook’s condition for a micro-droplet to adhere to a rotating micro tool, Equation (18b): 2m Vc² ÷ Dt ≤ P (1 + cos θ) σL, with the droplet mass m from its diameter and the lubricant density, the tool surface speed Vc = π Dt n, the projected drop size P, the contact angle θ and the surface tension σL of the lubricant, giving the margin between adhesion and centrifugal force and the highest spindle speed at which the droplet still adheres.",
    "keywords": [
      "MAKEOS",
      "micro droplet adhesion",
      "MQL micro tool",
      "micromachining lubrication",
      "centrifugal force droplet",
      "contact angle surface tension",
      "mist lubrication micro mill"
    ],
    "fields": [
      {
        "key": "Dd",
        "label": "Droplet diameter",
        "type": "number",
        "default": 10,
        "unit": "µm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Lubricant density",
        "type": "number",
        "default": 900,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Projected drop size P",
        "type": "number",
        "default": 10,
        "unit": "µm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "theta",
        "label": "Contact angle θ",
        "type": "number",
        "default": 18,
        "unit": "°",
        "min": 0,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sig",
        "label": "Surface tension of the lubricant σL",
        "type": "number",
        "default": 0.03,
        "unit": "N/m",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dt",
        "label": "Tool diameter Dt",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Spindle speed",
        "type": "number",
        "default": 50000,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "force-ratio-tool-life",
    "name": "Tool Life from the Force Ratio FH ÷ FC (Colding)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "From the ratio of the feed-plane force to the cutting force that I measure or estimate, what tool life does the Colding relation give, and at what force ratio should I change the tool for a target life?",
    "description": "The handbook’s relation between tool life and the force ratio from machining econometrics: T = (FH ÷ (a FC))^(LF/L), with the rake angle constant a (about 0.25 to 0.5 in turning) and the ratio LF ÷ L of the force ratio and tool life equation constants (10 to 20), both entered by you, giving the tool life for a measured or estimated force ratio and, the other way round, the force ratio that corresponds to a target tool life, FH ÷ FC = a T^(L/LF).",
    "keywords": [
      "MAKEOS",
      "force ratio tool life",
      "FH FC tool life",
      "Colding force relationship",
      "tool wear force monitoring",
      "machining econometrics",
      "tool life from cutting forces"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Force ratio from",
        "type": "select",
        "default": "forces",
        "options": [
          [
            "forces",
            "Measured forces FH and FC"
          ],
          [
            "ratio",
            "A force ratio you enter"
          ]
        ]
      },
      {
        "key": "FH",
        "label": "Feed-plane force FH",
        "type": "number",
        "default": 1500,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "FC",
        "label": "Cutting force FC",
        "type": "number",
        "default": 3000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Force ratio FH ÷ FC",
        "type": "number",
        "default": 0.6,
        "unit": "",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Rake angle constant a",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Constant ratio LF ÷ L",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tt",
        "label": "Target tool life (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "min",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
