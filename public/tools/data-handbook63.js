// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook63) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "gear-tooth-top-land-check",
    "name": "Gear Tooth Top Land and Undercut Check (Involute Function, Pointed Radius, Profile Shift)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For a spur gear with few teeth or a profile shift, is the tooth undercut, how thick is the top land, and how far is the tip from becoming pointed?",
    "description": "Check of a spur gear tooth form: the pitch and base radii, the tooth thickness at the pitch circle with profile shift, the tip radius, the involute function at the pressure angle and at the tip (as the trigonometric functions tool), the tooth thickness at the tip (top land), the radius at which the tooth would come to a point found from the involute value (as the same tool, angle from an involute value), and the least profile shift that avoids undercut, against your least top land.",
    "keywords": [
      "MAKEOS",
      "top land",
      "pointed teeth",
      "undercut",
      "profile shift",
      "involute function",
      "tooth thickness"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Number of teeth",
        "type": "number",
        "default": 12,
        "unit": "teeth",
        "min": 4,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "phi",
        "label": "Pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 35,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Profile shift coefficient",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": -1,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ha",
        "label": "Addendum coefficient",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.5,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "saMin",
        "label": "Least top land (× module)",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "relief-valve-spring-check",
    "name": "Relief Valve Spring Check (Cracking Pressure, Full-Lift Pressure, Overpressure, Spring Stress)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "For a direct-acting relief or check valve held shut by a coil spring, what pressure does it crack at, how much higher is it at full lift, and is the spring stressed within limits?",
    "description": "Check of the spring of a direct-acting poppet or ball relief valve: the spring rate, installed load and shear stress at the closed length (as the compression spring tool), the cracking pressure from the installed load over the seat area, the pressure at full lift from the extra spring load, the overpressure (accumulation) between them, the stress at full lift and the clearance to solid, against the set pressure and tolerance wanted, the allowed overpressure and the allowable stress.",
    "keywords": [
      "MAKEOS",
      "relief valve",
      "cracking pressure",
      "valve spring",
      "overpressure",
      "poppet valve",
      "check valve"
    ],
    "fields": [
      {
        "key": "ds",
        "label": "Seat diameter (sealing)",
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
        "key": "lift",
        "label": "Full lift of the poppet",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "preq",
        "label": "Set pressure wanted",
        "type": "number",
        "default": 0.9,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolP",
        "label": "Set pressure tolerance (±)",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "overMax",
        "label": "Largest overpressure at full lift",
        "type": "number",
        "default": 12,
        "unit": "%",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_spring",
        "label": "Spring",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Wire diameter",
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
        "key": "D",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 16,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Na",
        "label": "Active coils",
        "type": "number",
        "default": 8,
        "unit": "coils",
        "min": 0.5,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "End type",
        "type": "select",
        "default": "cg",
        "options": [
          [
            "cg",
            "Closed and ground (squared and ground)"
          ],
          [
            "c",
            "Closed, not ground"
          ],
          [
            "pg",
            "Plain and ground"
          ],
          [
            "p",
            "Plain (open)"
          ]
        ]
      },
      {
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 79.3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L0",
        "label": "Unloaded length",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lw",
        "label": "Installed length (valve shut)",
        "type": "number",
        "default": 35,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 700,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pipe-support-span-check",
    "name": "Pipe Support Span Check (Pipe and Contents Weight, Bending Stress, Sag, Longest Span)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "How far apart can the supports for this pipe be, given its weight full of liquid, the bending stress and the sag I can accept?",
    "description": "Check of the span between pipe supports: the section area, second moment of area and section modulus of the pipe, the weight per metre of pipe, contents and insulation, then the bending moment, stress and sag for simply supported, fixed or one-end-fixed spans under the uniform load (closed forms, the fixed cases as the beam cases tool), and the longest span that keeps both stress and sag within your limits.",
    "keywords": [
      "MAKEOS",
      "pipe support",
      "pipe span",
      "pipe sag",
      "pipe hanger",
      "uniform load",
      "section modulus"
    ],
    "fields": [
      {
        "key": "OD",
        "label": "Pipe outside diameter",
        "type": "number",
        "default": 60.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Wall thickness",
        "type": "number",
        "default": 3.91,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoP",
        "label": "Pipe density",
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
        "key": "rhoF",
        "label": "Contents density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mIns",
        "label": "Insulation and cladding",
        "type": "number",
        "default": 0,
        "unit": "kg/m",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Modulus of elasticity",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_span",
        "label": "Span",
        "type": "heading"
      },
      {
        "key": "ends",
        "label": "Span treated as",
        "type": "select",
        "default": "ss",
        "options": [
          [
            "ss",
            "Simply supported (single span)"
          ],
          [
            "ff",
            "Fixed both ends (long continuous run)"
          ],
          [
            "prop",
            "Fixed one end, supported the other (end span)"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Support spacing",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Allowable bending stress",
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
        "key": "dA",
        "label": "Largest sag",
        "type": "number",
        "default": 2.5,
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
    "id": "cart-push-force-check",
    "name": "Cart Push Force Check (Rolling Resistance, Slope, Starting Force, Wheel Load)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How hard will it be to start and keep a loaded trolley moving on this floor and slope, and are the wheels rated for the load?",
    "description": "Check of a manually pushed cart, trolley or dolly: the rolling resistance from the load, wheel radius and coefficient of rolling resistance (as the rolling resistance tool), the force to push the load up the slope (as the inclined plane tool, with rolling instead of sliding), the force to accelerate it from rest, the starting and keep-moving push forces, and the load on each wheel with the number sharing the load on an uneven floor, against your push force limits and the wheel rating.",
    "keywords": [
      "MAKEOS",
      "push force",
      "trolley",
      "cart",
      "rolling resistance",
      "castor rating",
      "manual handling"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Loaded mass",
        "type": "number",
        "default": 300,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of wheels",
        "type": "number",
        "default": 4,
        "unit": "wheels",
        "min": 2,
        "max": 32,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "nShare",
        "label": "Wheels sharing the load on an uneven floor",
        "type": "number",
        "default": 3,
        "unit": "wheels",
        "min": 1,
        "max": 32,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Dw",
        "label": "Wheel diameter",
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
        "key": "f",
        "label": "Coefficient of rolling resistance",
        "type": "number",
        "default": 0.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "slope",
        "label": "Slope",
        "type": "number",
        "default": 2,
        "unit": "°",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "acc",
        "label": "Starting acceleration",
        "type": "number",
        "default": 0.3,
        "unit": "m/s²",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limits",
        "label": "Limits",
        "type": "heading"
      },
      {
        "key": "Fstart",
        "label": "Largest starting push",
        "type": "number",
        "default": 220,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fkeep",
        "label": "Largest keep-moving push",
        "type": "number",
        "default": 150,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wheelRating",
        "label": "Rating of each wheel",
        "type": "number",
        "default": 1000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "taper-turning-setup",
    "name": "Taper Turning Set-Up (Taper per Foot, Half Angle, Tailstock Offset, Compound Setting)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "For a taper of given end diameters and length, what taper per foot and angle is it, how far must I offset the tailstock, and should I use the compound slide instead?",
    "description": "Set-up of a lathe to turn a taper: the taper per unit length and per foot on diameter, the half angle and included angle from the tangent (as the trigonometric functions tool), the tailstock offset for turning between centres over the whole length of the work, and the compound slide setting, against the largest tailstock offset the lathe and centres allow.",
    "keywords": [
      "MAKEOS",
      "taper turning",
      "tailstock offset",
      "compound slide",
      "taper per foot",
      "included angle",
      "lathe set-up"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Large diameter of the taper",
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
        "key": "d",
        "label": "Small diameter of the taper",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l",
        "label": "Length of the taper",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lw",
        "label": "Length of the work between centres",
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
        "key": "offMax",
        "label": "Largest tailstock offset",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "wall-jib-crane-check",
    "name": "Wall Jib Crane Check (Tie Tension, Beam Bending and Axial Stress, Deflection, Wall Bolts)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a wall-mounted jib with a tie rod, how much tension is in the tie, are the beam stress and deflection within limits, and can the top wall bolts take the pull?",
    "description": "Check of a wall jib crane with a pinned I-section jib supported at its outer end by a tie: the section area, second moment and section modulus of the jib (as the section shapes tool), the tie tension and beam compression with the load at the end, the bending moment and deflection with the load at mid-reach (as the beam cases tool for a central point load), the combined bending and axial stress, the tie rod stress, and the wall pull shared by the top bolts, against your allowable stresses, deflection limit and bolt capacity.",
    "keywords": [
      "MAKEOS",
      "jib crane",
      "tie rod",
      "wall bracket",
      "I-beam",
      "combined stress",
      "hoist beam"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Load including hoist and trolley",
        "type": "number",
        "default": 10000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Reach (wall pin to tie point)",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang",
        "label": "Tie angle from the jib",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 5,
        "max": 85,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_jib_section_i_",
        "label": "Jib section (I)",
        "type": "heading"
      },
      {
        "key": "H",
        "label": "Overall depth",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Flange width",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tf",
        "label": "Flange thickness",
        "type": "number",
        "default": 8.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tw",
        "label": "Web thickness",
        "type": "number",
        "default": 5.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Modulus of elasticity",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Allowable combined stress",
        "type": "number",
        "default": 160,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dlim",
        "label": "Deflection limit (reach ÷)",
        "type": "number",
        "default": 250,
        "unit": "",
        "min": 10,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_tie_and_wall",
        "label": "Tie and wall",
        "type": "heading"
      },
      {
        "key": "dt",
        "label": "Tie rod diameter (at the thread root)",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tA",
        "label": "Allowable tie stress",
        "type": "number",
        "default": 140,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nb",
        "label": "Top bracket bolts in tension",
        "type": "number",
        "default": 4,
        "unit": "bolts",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Fb",
        "label": "Allowable tension per bolt",
        "type": "number",
        "default": 20000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "step-cone-pulley-design",
    "name": "Step Cone Pulley Design (Geometric Speed Steps, Step Diameters, Crossed Belt Length)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a pair of step (cone) pulleys giving a range of output speeds, what speeds should the steps give and what diameter is each step, so one belt fits every step?",
    "description": "Design of matched step (cone) pulleys driven by a crossed belt: output speeds in geometric progression between the lowest and highest speed with the step ratio fitted to the number of steps (as the progression tool), the driver and driven diameter of each step with a constant diameter sum so the same crossed belt fits every step, and the belt length and wrap (as the crossed belt length tool), against the smallest pulley diameter you allow.",
    "keywords": [
      "MAKEOS",
      "step pulley",
      "cone pulley",
      "speed steps",
      "geometric progression",
      "crossed belt",
      "lathe drive"
    ],
    "fields": [
      {
        "key": "nIn",
        "label": "Driver (input) speed",
        "type": "number",
        "default": 400,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nMin",
        "label": "Lowest output speed",
        "type": "number",
        "default": 100,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nMax",
        "label": "Highest output speed",
        "type": "number",
        "default": 800,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Number of steps",
        "type": "number",
        "default": 4,
        "unit": "steps",
        "min": 2,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "S",
        "label": "Sum of driver and driven diameters",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance",
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
        "key": "dMin",
        "label": "Smallest pulley diameter allowed",
        "type": "number",
        "default": 50,
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
    "id": "hydraulic-hand-jack-check",
    "name": "Hydraulic Hand Jack Check (Handle Leverage, Pump Pressure, Lifting Force, Strokes to Lift)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "For a hand-pumped hydraulic jack or press, what pressure does the handle effort make, can it lift the load, and how many pump strokes does the lift take?",
    "description": "Check of a hand-operated hydraulic jack or press: the force on the pump plunger from the handle effort and lever arms (as the lever force tool), the pressure from the plunger area, the lifting force of the ram with an efficiency, the effort needed for the rated load, and the number of pump strokes to raise the ram by the lift height from the ratio of displaced volumes, against the load, the system pressure rating and a limit on strokes.",
    "keywords": [
      "MAKEOS",
      "hydraulic jack",
      "hand pump",
      "Pascal",
      "ram force",
      "lever",
      "hydraulic press"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Handle effort",
        "type": "number",
        "default": 300,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Handle length (pivot to hand)",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Pivot to plunger",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pump plunger diameter",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dr",
        "label": "Ram diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Overall efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 10,
        "max": 100,
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
        "key": "Wreq",
        "label": "Load to lift",
        "type": "number",
        "default": 30000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pRated",
        "label": "Pressure rating of the jack",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Lift height",
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
        "key": "sp",
        "label": "Plunger stroke",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "maxStrokes",
        "label": "Most strokes accepted",
        "type": "number",
        "default": 100,
        "unit": "strokes",
        "min": 1,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "capstan-rope-turns-check",
    "name": "Capstan and Bollard Rope Turns Check (Holding Force, Turns Needed, Rope Load)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How many turns of rope around a bollard, capstan or drum let a person hold this load, and is the rope strong enough?",
    "description": "Check of rope turns on a bollard, capstan, winch drum or post: the ratio of tight to slack tension from the friction coefficient and wrap angle (as the belt friction tool, capstan equation), the holding force needed with the turns used, the turns needed for the holding force a person can apply, and the rope working load from its breaking strength and safety factor, against the load.",
    "keywords": [
      "MAKEOS",
      "capstan",
      "bollard",
      "rope friction",
      "turns",
      "holding force",
      "Euler–Eytelwein"
    ],
    "fields": [
      {
        "key": "T1",
        "label": "Load (tight side tension)",
        "type": "number",
        "default": 20000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2max",
        "label": "Holding force a person can apply",
        "type": "number",
        "default": 300,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Friction coefficient of rope on the post",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0.01,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "turns",
        "label": "Turns used",
        "type": "number",
        "default": 3,
        "unit": "turns",
        "min": 0.25,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_rope",
        "label": "Rope",
        "type": "heading"
      },
      {
        "key": "MBL",
        "label": "Rope minimum breaking load",
        "type": "number",
        "default": 120,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Safety factor on the rope",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
