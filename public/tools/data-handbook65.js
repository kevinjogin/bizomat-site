// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook65) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "sluice-gate-lift-check",
    "name": "Sluice Gate Lift Check (Water Force, Seal Friction, Screw Torque, Handwheel Effort)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "For a screw-operated sluice or penstock gate holding back water, what force does the water put on it, what force lifts it against seal friction, and can one person turn the handwheel?",
    "description": "Check of a vertical sliding gate opened by a screw spindle: the water force on the gate and where it acts (as the hydrostatic force tool), the lifting force from the gate weight and the friction of the seals and guides under that force, the torque to raise the load on the spindle thread and thrust collar and whether the screw holds without a brake (as the power screw torque tool), and the rim effort on the handwheel through any reduction gearing, against your effort limit.",
    "keywords": [
      "MAKEOS",
      "sluice gate",
      "penstock",
      "hydrostatic force",
      "power screw",
      "handwheel effort",
      "gate lifting"
    ],
    "fields": [
      {
        "key": "h",
        "label": "Water depth on the gate",
        "type": "number",
        "default": 2,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Gate width",
        "type": "number",
        "default": 1.2,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Water density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mGate",
        "label": "Gate and spindle mass",
        "type": "number",
        "default": 150,
        "unit": "kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "muS",
        "label": "Seal and guide friction coefficient",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_spindle",
        "label": "Spindle",
        "type": "heading"
      },
      {
        "key": "dm",
        "label": "Mean (pitch) diameter of thread",
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
        "key": "lead",
        "label": "Lead",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "flank",
        "label": "Thread form",
        "type": "select",
        "default": "15",
        "options": [
          [
            "0",
            "Square"
          ],
          [
            "14.5",
            "Acme (29°)"
          ],
          [
            "15",
            "Trapezoidal (30°)"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Thread friction coefficient",
        "type": "number",
        "default": 0.12,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dc",
        "label": "Mean collar diameter",
        "type": "number",
        "default": 45,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "muc",
        "label": "Collar friction coefficient",
        "type": "number",
        "default": 0.12,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_handwheel",
        "label": "Handwheel",
        "type": "heading"
      },
      {
        "key": "Rw",
        "label": "Handwheel radius",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gr",
        "label": "Reduction (handwheel turns per spindle turn)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "effG",
        "label": "Gearing efficiency",
        "type": "number",
        "default": 100,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fmax",
        "label": "Largest handwheel effort",
        "type": "number",
        "default": 250,
        "unit": "N",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ball-detent-check",
    "name": "Ball Detent Check (Spring Preload, Release Force, Spring Stress at Full Rise)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "For a spring-loaded ball detent or plunger, what force does it take to push it out of its notch, and is the spring stressed within limits when the ball rides up?",
    "description": "Check of a spring-loaded ball or plunger detent: the spring rate, preload at the fitted length and stress (as the compression spring tool), the force along the sliding direction to push the ball out of a vee notch from the preload, flank angle and friction (as the wedge force tool with the friction on one face), the spring load and stress when the ball has risen out of the notch, and the clearance to solid, against the release force range you want and the allowable stress.",
    "keywords": [
      "MAKEOS",
      "ball detent",
      "spring plunger",
      "indexing detent",
      "release force",
      "notch angle",
      "spring preload"
    ],
    "fields": [
      {
        "key": "alpha",
        "label": "Notch flank angle from the sliding direction",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 1,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "muB",
        "label": "Friction at the ball contact",
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
        "key": "rise",
        "label": "Ball rise out of the notch",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fmin",
        "label": "Least release force wanted",
        "type": "number",
        "default": 15,
        "unit": "N",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fmax",
        "label": "Largest release force wanted",
        "type": "number",
        "default": 30,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000,
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
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 6,
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
        "default": 15,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lw",
        "label": "Fitted length (ball in the notch)",
        "type": "number",
        "default": 12,
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
    "id": "expansion-vessel-sizing",
    "name": "Expansion Vessel Sizing (Liquid Expansion, Pre-Charge and Final Pressure, Vessel Volume)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For a closed heating or cooling water system, how much does the water expand when it heats up, and how big must the diaphragm expansion vessel be to take it within the pressure limits?",
    "description": "Sizing of a gas-cushioned (diaphragm or bladder) expansion vessel for a closed liquid system: the expansion volume from the system volume, a mean volumetric expansion coefficient and the temperature rise, the acceptance factor from the pre-charge and final pressures by Boyle’s law at constant temperature (as the gas law tool), the vessel volume needed, and the gas volume left at the final pressure, against the vessel you have.",
    "keywords": [
      "MAKEOS",
      "expansion vessel",
      "expansion tank",
      "diaphragm vessel",
      "Boyle’s law",
      "closed system",
      "heating water"
    ],
    "fields": [
      {
        "key": "Vs",
        "label": "System liquid volume",
        "type": "number",
        "default": 500,
        "unit": "L",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Fill (cold) temperature",
        "type": "number",
        "default": 10,
        "unit": "°C",
        "min": -50,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Highest working temperature",
        "type": "number",
        "default": 80,
        "unit": "°C",
        "min": -50,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Mean volumetric expansion coefficient",
        "type": "number",
        "default": 0.00041,
        "unit": "1/K",
        "min": 0,
        "max": 0.01,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_pressures",
        "label": "Pressures",
        "type": "heading"
      },
      {
        "key": "p0",
        "label": "Pre-charge (and fill) pressure",
        "type": "number",
        "default": 1,
        "unit": "bar g",
        "min": -0.9,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pf",
        "label": "Highest working pressure",
        "type": "number",
        "default": 2.5,
        "unit": "bar g",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "patm",
        "label": "Atmospheric pressure",
        "type": "number",
        "default": 1.013,
        "unit": "bar",
        "min": 0.5,
        "max": 1.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vv",
        "label": "Vessel volume fitted",
        "type": "number",
        "default": 50,
        "unit": "L",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "torque-arm-reaction-check",
    "name": "Torque Arm Reaction Check (Output Torque, Arm Reaction, Anchor Pin Joint)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a shaft-mounted gearbox held by a torque arm, what reaction does the arm put on its anchor, and is the anchor pin joint strong enough?",
    "description": "Check of the torque arm of a shaft-mounted gear reducer: the output torque from power and speed with a service factor, the reaction at the arm anchor from the torque and the arm length, then the pin bending, shear and bearing, the eye net tension and tear-out of the arm’s pin joint (as the clevis pin joint tool), against the allowable stresses.",
    "keywords": [
      "MAKEOS",
      "torque arm",
      "shaft-mounted gearbox",
      "reaction force",
      "clevis pin",
      "anchor bracket",
      "reducer"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Motor power",
        "type": "number",
        "default": 4,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Output (shaft) speed",
        "type": "number",
        "default": 50,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor (starting and shock)",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Arm length (shaft centre to anchor pin)",
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
        "key": "h_anchor_pin_joint",
        "label": "Anchor pin joint",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Pin diameter",
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
        "key": "a",
        "label": "Arm eye thickness",
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
        "key": "bf",
        "label": "Thickness of each bracket plate",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g",
        "label": "Gap between eye and each plate",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Eye edge distance",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sbA",
        "label": "Allowable pin bending stress",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tpA",
        "label": "Allowable pin shear stress",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bA",
        "label": "Allowable bearing stress",
        "type": "number",
        "default": 200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stA",
        "label": "Allowable eye tensile stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tA",
        "label": "Allowable eye tear-out shear stress",
        "type": "number",
        "default": 90,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "traction-hoist-check",
    "name": "Traction Hoist Check (Counterweight, Rope Tension Ratio, Sheave Traction, Motor Power)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a counterweighted lift or hoist driven by rope traction on a grooved sheave, will the ropes grip without slipping loaded and empty, and what motor power does it need?",
    "description": "Check of a counterweighted traction drive: the counterweight from the car mass and a share of the rated load, the rope tensions on each side with the car full and empty, increased for acceleration, their ratio, the traction the sheave can give from the groove friction and wrap (as the belt friction tool, with the groove angle), and the motor power from the largest out-of-balance load, speed and efficiency, against the motor fitted.",
    "keywords": [
      "MAKEOS",
      "traction sheave",
      "counterweight",
      "lift",
      "rope slip",
      "goods hoist",
      "traction ratio"
    ],
    "fields": [
      {
        "key": "mc",
        "label": "Car (platform) mass",
        "type": "number",
        "default": 600,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mL",
        "label": "Rated load",
        "type": "number",
        "default": 500,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bal",
        "label": "Counterweight balance (share of rated load)",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "acc",
        "label": "Acceleration or braking",
        "type": "number",
        "default": 0.5,
        "unit": "m/s²",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_sheave",
        "label": "Sheave",
        "type": "heading"
      },
      {
        "key": "mu",
        "label": "Rope-to-groove friction coefficient",
        "type": "number",
        "default": 0.1,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wrap",
        "label": "Wrap angle",
        "type": "number",
        "default": 180,
        "unit": "°",
        "min": 0.000001,
        "max": 540,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "groove",
        "label": "Groove included angle (0 = round seat)",
        "type": "number",
        "default": 40,
        "unit": "°",
        "min": 0,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_drive",
        "label": "Drive",
        "type": "heading"
      },
      {
        "key": "vr",
        "label": "Rated speed",
        "type": "number",
        "default": 1,
        "unit": "m/s",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Drive efficiency",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pfit",
        "label": "Motor power fitted",
        "type": "number",
        "default": 5.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shear-pin-overload-design",
    "name": "Shear Pin Overload Design (Pin Size for a Break Torque, Break Factor, Hub Bearing)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "For a shear pin that protects a drive by breaking at an overload, what diameter should it be, at what torque will the chosen pin break, and is the hub strong enough around it?",
    "description": "Design of a shear pin (breaking pin) through a hub and flange or sprocket: the break torque from the running torque and the overload factor, the pin diameter that shears at that torque from the pin ultimate shear strength, the number of pins and shear planes and the pin circle radius, the break torque and factor with the diameter you choose, and the shear and bearing stresses as a check (as the bolt shear and bearing tool at the break force), against your break factor range and allowable bearing stress.",
    "keywords": [
      "MAKEOS",
      "shear pin",
      "breaking pin",
      "overload protection",
      "torque limiter",
      "drive protection",
      "pin shear"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Running torque",
        "type": "number",
        "default": 500,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ovl",
        "label": "Overload factor to break at",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "np",
        "label": "Number of pins",
        "type": "number",
        "default": 1,
        "unit": "pins",
        "min": 1,
        "max": 24,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "planes",
        "label": "Shear planes per pin",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Single shear"
          ],
          [
            "2",
            "Double shear"
          ]
        ]
      },
      {
        "key": "Rp",
        "label": "Pin circle radius",
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
        "key": "tauU",
        "label": "Pin ultimate shear strength",
        "type": "number",
        "default": 400,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dCh",
        "label": "Pin diameter chosen",
        "type": "number",
        "default": 7.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
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
        "key": "fMin",
        "label": "Least break factor accepted",
        "type": "number",
        "default": 1.8,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fMax",
        "label": "Largest break factor accepted",
        "type": "number",
        "default": 2.5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Thinnest part in bearing",
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
        "key": "bA",
        "label": "Allowable bearing stress of the hub",
        "type": "number",
        "default": 300,
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
    "id": "portable-gantry-check",
    "name": "Portable Gantry Crane Check (Beam Stress and Deflection, A-Frame Leg Buckling, Wheel Load)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a portable A-frame gantry with an I-beam and splayed legs, are the beam stress and deflection within limits, will the legs buckle, and what does each castor carry?",
    "description": "Check of a portable gantry crane: the section properties of the I-beam (as the section shapes tool), the bending moment, stress and deflection with the load at mid-span (as the beam cases tool for a central point load), the end reaction with the load at one end, the axial force in each splayed leg and its buckling capacity and safety factor (as the column buckling tool for a tubular leg), and the load on each castor, against your allowables.",
    "keywords": [
      "MAKEOS",
      "gantry crane",
      "A-frame",
      "I-beam",
      "leg buckling",
      "portable hoist",
      "castor load"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Load including hoist and trolley",
        "type": "number",
        "default": 20000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Beam span between leg centres",
        "type": "number",
        "default": 4000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_beam_i_",
        "label": "Beam (I)",
        "type": "heading"
      },
      {
        "key": "H",
        "label": "Overall depth",
        "type": "number",
        "default": 300,
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
        "default": 150,
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
        "default": 10.7,
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
        "default": 7.1,
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
        "label": "Allowable bending stress",
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
        "label": "Deflection limit (span ÷)",
        "type": "number",
        "default": 500,
        "unit": "",
        "min": 10,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_legs_two_per_end_",
        "label": "Legs (two per end)",
        "type": "heading"
      },
      {
        "key": "Hl",
        "label": "Leg vertical height",
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
        "key": "beta",
        "label": "Leg splay from vertical",
        "type": "number",
        "default": 15,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "legOD",
        "label": "Leg tube outside diameter",
        "type": "number",
        "default": 88.9,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "legT",
        "label": "Leg wall thickness",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Leg yield strength",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Leg effective length factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.5,
        "max": 2.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required buckling safety factor",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "castor",
        "label": "Castor rating",
        "type": "number",
        "default": 15000,
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
    "id": "press-tie-rod-check",
    "name": "Press Tie Rod Check (Cylinder Force, Rod Thread Stress, Stretch, Nut Engagement)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For a four-post hydraulic press, what load does the cylinder put into the tie rods, is the thread stress within limits, how much do the rods stretch, and are the nuts long enough?",
    "description": "Check of the tie rods of a hydraulic press frame: the press force from the cylinder bore and pressure, matching the bore a cylinder sizing gives for that force (as the hydraulic cylinder sizing tool), the load per rod, the thread tensile stress area and stress (as the metric thread tool), the elastic stretch of each rod over its length, and the nut length needed so the threads do not strip (as the thread engagement tool), against your allowable stress, stretch limit and nut height.",
    "keywords": [
      "MAKEOS",
      "hydraulic press",
      "tie rod",
      "thread stress",
      "rod stretch",
      "nut engagement",
      "press frame"
    ],
    "fields": [
      {
        "key": "bore",
        "label": "Cylinder bore",
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
        "key": "p",
        "label": "System pressure",
        "type": "number",
        "default": 200,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nRod",
        "label": "Number of tie rods",
        "type": "number",
        "default": 4,
        "unit": "rods",
        "min": 2,
        "max": 16,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_rods",
        "label": "Rods",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Rod thread nominal diameter",
        "type": "number",
        "default": 42,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Thread pitch",
        "type": "number",
        "default": 4.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lr",
        "label": "Rod length between nuts",
        "type": "number",
        "default": 1500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
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
        "label": "Allowable thread stress",
        "type": "number",
        "default": 200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dMax",
        "label": "Largest rod stretch",
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
        "key": "h_nuts",
        "label": "Nuts",
        "type": "heading"
      },
      {
        "key": "mNut",
        "label": "Nut height (thread engaged)",
        "type": "number",
        "default": 42,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sub",
        "label": "Rod tensile strength",
        "type": "number",
        "default": 800,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sun",
        "label": "Nut tensile strength",
        "type": "number",
        "default": 800,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "centrifuge-bowl-check",
    "name": "Centrifuge Bowl Check (Self Hoop Stress, Liquid Ring Pressure, Total Hoop Stress, Speed Limit)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For a spinning centrifuge bowl or basket holding a ring of liquid, how high is the hoop stress from its own spin and from the liquid pressure, and how fast may it run?",
    "description": "Check of a thin cylindrical centrifuge bowl: the acceleration at the wall as a multiple of gravity (as the centrifugal force tool), the hoop stress from the spinning shell itself (density × rim speed squared), the pressure the spinning liquid ring puts on the wall, the hoop stress from that pressure (as the thick cylinder tool’s thin-wall value), the total hoop stress, and the highest speed for your allowable stress, since every stress grows with the square of the speed.",
    "keywords": [
      "MAKEOS",
      "centrifuge",
      "spinning bowl",
      "hoop stress",
      "liquid ring",
      "g-force",
      "basket"
    ],
    "fields": [
      {
        "key": "r",
        "label": "Bowl inside radius",
        "type": "number",
        "default": 250,
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
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Speed",
        "type": "number",
        "default": 2000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoS",
        "label": "Bowl material density",
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
        "key": "rhoL",
        "label": "Liquid density",
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
        "key": "r0",
        "label": "Radius of the liquid surface",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable hoop stress",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
