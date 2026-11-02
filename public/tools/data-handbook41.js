// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook41) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "casting-pour-plan",
    "name": "Casting Pour Plan (Riser, Feed Volume, Gating and Ladle)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "Will this riser feed the casting, how much metal must I pour including riser and gating, what choke area gives my pour time, and is the ladle big enough?",
    "description": "Plan of a gravity sand casting: casting and riser moduli, solidification times by Chvorinov’s rule and the modulus ratio (as the casting solidification tool), riser volume against the feed volume the casting shrinkage needs at your riser efficiency, metal poured including riser and gating, casting yield, choke area and sprue diameter for the pour time (as the gating choke area tool), pattern dimension with shrinkage, and the ladle capacity check.",
    "keywords": [
      "MAKEOS",
      "casting pour plan",
      "riser design",
      "Chvorinov rule",
      "choke area",
      "casting yield",
      "ladle capacity"
    ],
    "fields": [
      {
        "key": "h_casting",
        "label": "Casting",
        "type": "heading"
      },
      {
        "key": "Vc",
        "label": "Casting volume",
        "type": "number",
        "default": 2000,
        "unit": "cm³",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ac",
        "label": "Casting cooling surface area",
        "type": "number",
        "default": 900,
        "unit": "cm²",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Metal density",
        "type": "number",
        "default": 7,
        "unit": "g/cm³",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Mould constant",
        "type": "number",
        "default": 2,
        "unit": "min/cm²",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shrinkV",
        "label": "Volumetric shrinkage to feed",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0,
        "max": 15,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_riser",
        "label": "Riser",
        "type": "heading"
      },
      {
        "key": "Dr",
        "label": "Riser diameter",
        "type": "number",
        "default": 130,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hr",
        "label": "Riser height",
        "type": "number",
        "default": 160,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratioReq",
        "label": "Least riser ÷ casting modulus",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "effR",
        "label": "Riser feeding efficiency",
        "type": "number",
        "default": 15,
        "unit": "%",
        "min": 5,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_gating_and_pouring",
        "label": "Gating and pouring",
        "type": "heading"
      },
      {
        "key": "gatePct",
        "label": "Sprue, runner and gates as share of casting mass",
        "type": "number",
        "default": 15,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Pour time",
        "type": "number",
        "default": 12,
        "unit": "s",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Effective sprue height",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cd",
        "label": "Flow efficiency",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "runner",
        "label": "Runner ÷ choke area",
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
        "key": "gate",
        "label": "Total gate ÷ choke area",
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
        "key": "ladle",
        "label": "Ladle capacity",
        "type": "number",
        "default": 80,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_pattern",
        "label": "Pattern",
        "type": "heading"
      },
      {
        "key": "part",
        "label": "Part dimension",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shrink",
        "label": "Pattern shrinkage allowance",
        "type": "number",
        "default": 1,
        "unit": "%",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "coating-job-estimate",
    "name": "Coating Job Estimate (Coats, Material, Thinner, Labour, Film)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How much coating, thinner and labour does this paint or powder job take for all its coats, what does it cost per square metre, and is the wet film within the sag limit?",
    "description": "Estimate of a coating job: theoretical and practical coverage and quantity per coat from the dry film thickness, volume solids or powder density and transfer efficiency (as the coating coverage tool), the quantity for all coats, thinner added, the wet film thickness to apply per coat against your sag limit, labour hours from the application rate, and cost in total and per square metre.",
    "keywords": [
      "MAKEOS",
      "coating estimate",
      "paint quantity",
      "wet film thickness",
      "volume solids",
      "transfer efficiency",
      "painting cost"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Coating",
        "type": "select",
        "default": "liquid",
        "options": [
          [
            "liquid",
            "Liquid paint"
          ],
          [
            "powder",
            "Powder coating"
          ]
        ]
      },
      {
        "key": "area",
        "label": "Area to coat",
        "type": "number",
        "default": 50,
        "unit": "m²",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dft",
        "label": "Dry film thickness per coat",
        "type": "number",
        "default": 75,
        "unit": "µm",
        "min": 1,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "coats",
        "label": "Number of coats",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "vs",
        "label": "Volume solids (liquid)",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "density",
        "label": "Powder density (powder)",
        "type": "number",
        "default": 1.5,
        "unit": "g/cm³",
        "min": 0.5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "te",
        "label": "Transfer efficiency",
        "type": "number",
        "default": 65,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Coating price per litre or kilogram",
        "type": "number",
        "default": 25,
        "unit": "$",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thin",
        "label": "Thinner added (liquid)",
        "type": "number",
        "default": 10,
        "unit": "% of paint",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pThin",
        "label": "Thinner price",
        "type": "number",
        "default": 8,
        "unit": "$/L",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rateA",
        "label": "Application rate per coat",
        "type": "number",
        "default": 20,
        "unit": "m²/h",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "labour",
        "label": "Labour rate",
        "type": "number",
        "default": 60,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wftMax",
        "label": "Largest wet film per coat (sag limit)",
        "type": "number",
        "default": 200,
        "unit": "µm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "valve-closure-surge",
    "name": "Valve Closure Surge (Water Hammer against Pipe Rating)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How big a pressure surge does closing this valve cause, does working pressure plus surge stay within the pipe rating, and how slowly must the valve close to keep it there?",
    "description": "Water-hammer check of a pipeline: pressure wave speed from the liquid bulk modulus and the pipe diameter, wall and modulus, the critical closure time 2L ÷ a, the Joukowsky surge for fast closure and the reduced surge for the closing time used (as the water hammer tool), working pressure plus surge against the pipe or component rating, and the slowest-needed closing time that keeps the total within the rating.",
    "keywords": [
      "MAKEOS",
      "water hammer",
      "valve closure time",
      "surge pressure",
      "Joukowsky",
      "pipeline transient",
      "pressure rating"
    ],
    "fields": [
      {
        "key": "dv",
        "label": "Change in flow velocity",
        "type": "number",
        "default": 2,
        "unit": "m/s",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Pipe length to the reflection point",
        "type": "number",
        "default": 200,
        "unit": "m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tc",
        "label": "Valve closing time",
        "type": "number",
        "default": 1,
        "unit": "s",
        "min": 0.001,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Pipe inside diameter",
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
        "key": "t",
        "label": "Pipe wall thickness",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Pipe elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Liquid bulk modulus",
        "type": "number",
        "default": 2.2,
        "unit": "GPa",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid density",
        "type": "number",
        "default": 998,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Working pressure",
        "type": "number",
        "default": 6,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rating",
        "label": "Pipe or component pressure rating",
        "type": "number",
        "default": 16,
        "unit": "bar",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "control-valve-sizing",
    "name": "Control Valve Sizing (Kv, Opening, Authority, Full-Open Flow)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What Kv does this control valve need, how far open will the chosen valve run, does it have enough authority over the system, and what flow does it pass wide open?",
    "description": "Sizing of a liquid control valve: required Kv (and Cv) for the design flow and valve pressure drop (as the valve flow coefficient tool), the opening ratio of the chosen valve’s rated Kvs, the valve authority as its share of the total circuit pressure drop, and the flow the circuit passes with the valve wide open when the rest of the system’s loss rises with flow squared, against your limits.",
    "keywords": [
      "MAKEOS",
      "control valve sizing",
      "Kv",
      "Cv",
      "valve authority",
      "valve opening",
      "flow coefficient"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Design flow",
        "type": "number",
        "default": 10,
        "unit": "m³/h",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dpv",
        "label": "Valve pressure drop at design flow",
        "type": "number",
        "default": 0.5,
        "unit": "bar",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dps",
        "label": "Rest of the circuit pressure drop at design flow",
        "type": "number",
        "default": 0.5,
        "unit": "bar",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sg",
        "label": "Specific gravity",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.3,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kvs",
        "label": "Chosen valve rated Kvs",
        "type": "number",
        "default": 16,
        "unit": "m³/h",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "openMax",
        "label": "Largest opening ratio Kv ÷ Kvs at design",
        "type": "number",
        "default": 0.9,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "openMin",
        "label": "Smallest opening ratio at design",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.05,
        "max": 0.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "authMin",
        "label": "Least valve authority",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0.1,
        "max": 0.9,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vacuum-gripper-sizing",
    "name": "Vacuum Gripper Sizing (Cups, Diameter, Holding and Evacuation Time)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "Will these suction cups hold the part through the move, what cup size or count would, and how quickly does the system pull down to working vacuum?",
    "description": "Sizing of a vacuum gripper: holding force per cup and in total, the force needed with acceleration, orientation and safety factor (as the vacuum cup tool), the cup diameter needed at the cup count and the cup count needed at the cup diameter, and the time to evacuate the cups and lines to the working vacuum at the pump or ejector flow, against your cycle allowance.",
    "keywords": [
      "MAKEOS",
      "vacuum gripper",
      "suction cup sizing",
      "vacuum cup force",
      "evacuation time",
      "pick and place",
      "vacuum ejector"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Cup diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of cups",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "vac",
        "label": "Working vacuum",
        "type": "number",
        "default": 60,
        "unit": "kPa",
        "min": 5,
        "max": 95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Part mass",
        "type": "number",
        "default": 5,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "accel",
        "label": "Acceleration of the move",
        "type": "number",
        "default": 5,
        "unit": "m/s²",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "orient",
        "label": "Cup orientation",
        "type": "select",
        "default": "horizontal",
        "options": [
          [
            "horizontal",
            "Cups horizontal (lifting)"
          ],
          [
            "vertical",
            "Cups vertical (shear on the cups)"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Friction coefficient (cup to part)",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0.1,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sf",
        "label": "Safety factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vsys",
        "label": "Volume of cups and lines",
        "type": "number",
        "default": 0.5,
        "unit": "L",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qp",
        "label": "Vacuum generator suction flow",
        "type": "number",
        "default": 100,
        "unit": "L/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tMax",
        "label": "Evacuation time allowed",
        "type": "number",
        "default": 1,
        "unit": "s",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "wind-load-on-post",
    "name": "Wind Load on a Sign or Panel Post (Force, Base Moment, Stress, Deflection)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What wind force does this sign or panel take, what bending stress does it put in the supporting tube post, and how far does the top deflect?",
    "description": "Check of a panel, sign or guard on a single cantilever round-tube post: dynamic pressure, surface pressure, wind force and the base overturning moment (as the wind pressure tool), the post’s second moment and section modulus, bending stress at the base, deflection at the panel centre treating the wind as a point load there, and checks against your allowable stress and deflection limit.",
    "keywords": [
      "MAKEOS",
      "wind load",
      "sign post",
      "cantilever post",
      "base moment",
      "tube bending stress",
      "deflection"
    ],
    "fields": [
      {
        "key": "V",
        "label": "Wind speed",
        "type": "number",
        "default": 20,
        "unit": "m/s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Air density",
        "type": "number",
        "default": 1.2,
        "unit": "kg/m³",
        "min": 0.5,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cd",
        "label": "Force coefficient",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 0.1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Panel area",
        "type": "number",
        "default": 2,
        "unit": "m²",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Height of the panel centre above the base",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "OD",
        "label": "Post outside diameter",
        "type": "number",
        "default": 114.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Post wall thickness",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Post elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
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
        "key": "dRatio",
        "label": "Largest deflection as a fraction of height (1 ÷ …)",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": 10,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "noise-exposure-check",
    "name": "Noise Exposure Check (Combined Sources, Distance, Dose)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What sound level does the operator get from these machines at their working position, and is their daily noise dose within the limit?",
    "description": "Workplace noise exposure from up to four sources: levels combined by logarithmic addition (as the sound level tool, sum mode), reduced from the reference distance to the operator distance by the inverse-square law (as the distance mode), background noise added, the permitted time at that level from your criterion level, criterion time and exchange rate, the daily dose for the hours exposed and the equivalent eight-hour level.",
    "keywords": [
      "MAKEOS",
      "noise exposure",
      "noise dose",
      "sound level addition",
      "inverse square law",
      "exchange rate",
      "hearing protection"
    ],
    "fields": [
      {
        "key": "L1",
        "label": "Source 1 level at the reference distance",
        "type": "number",
        "default": 90,
        "unit": "dB",
        "min": 0,
        "max": 160,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "Source 2 level (0 = none)",
        "type": "number",
        "default": 85,
        "unit": "dB",
        "min": 0,
        "max": 160,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L3",
        "label": "Source 3 level (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "dB",
        "min": 0,
        "max": 160,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L4",
        "label": "Source 4 level (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "dB",
        "min": 0,
        "max": 160,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r1",
        "label": "Reference distance of the source levels",
        "type": "number",
        "default": 1,
        "unit": "m",
        "min": 0.1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r2",
        "label": "Operator distance from the sources",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0.1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "LB",
        "label": "Background level at the operator",
        "type": "number",
        "default": 70,
        "unit": "dB",
        "min": 0,
        "max": 160,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Hours exposed per day",
        "type": "number",
        "default": 8,
        "unit": "h",
        "min": 0.1,
        "max": 24,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lc",
        "label": "Criterion level",
        "type": "number",
        "default": 85,
        "unit": "dB",
        "min": 70,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Criterion time",
        "type": "number",
        "default": 8,
        "unit": "h",
        "min": 1,
        "max": 24,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ER",
        "label": "Exchange rate",
        "type": "number",
        "default": 3,
        "unit": "dB",
        "min": 2,
        "max": 6,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "process-capability-check",
    "name": "Process Capability Check (σ from R̄, Cp, Cpk, Rejects, Limits)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From my control chart averages, how capable is this process against the tolerance, what share will fall out of tolerance, and what are the control limits?",
    "description": "Capability check of a stable process from an X̄–R control chart: process standard deviation from the average range and the d₂ constant, X̄ and R control limits (as the X-bar R limits tool), capability indices Cp and Cpk against the specification limits, the predicted parts per million outside each limit from the normal distribution (as the normal out-of-spec tool), and the check against your least Cpk.",
    "keywords": [
      "MAKEOS",
      "process capability",
      "Cpk",
      "Cp",
      "control limits",
      "X-bar R chart",
      "parts per million"
    ],
    "fields": [
      {
        "key": "xbar",
        "label": "Grand average X̄",
        "type": "number",
        "default": 25.01,
        "unit": "",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rbar",
        "label": "Average range R̄",
        "type": "number",
        "default": 0.03,
        "unit": "",
        "min": 1e-9,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Subgroup size",
        "type": "select",
        "default": "5",
        "options": [
          [
            "2",
            "2"
          ],
          [
            "3",
            "3"
          ],
          [
            "4",
            "4"
          ],
          [
            "5",
            "5"
          ],
          [
            "6",
            "6"
          ],
          [
            "7",
            "7"
          ],
          [
            "8",
            "8"
          ],
          [
            "9",
            "9"
          ],
          [
            "10",
            "10"
          ]
        ]
      },
      {
        "key": "lsl",
        "label": "Lower specification limit",
        "type": "number",
        "default": 24.95,
        "unit": "",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "usl",
        "label": "Upper specification limit",
        "type": "number",
        "default": 25.07,
        "unit": "",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cpkMin",
        "label": "Least Cpk accepted",
        "type": "number",
        "default": 1.33,
        "unit": "",
        "min": 0.5,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "corrosion-remaining-life",
    "name": "Corrosion Remaining Life and Inspection Interval",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "At its measured corrosion rate, how long before this pipe or vessel wall reaches its minimum thickness, and when should it next be inspected?",
    "description": "Remaining-life assessment of a corroding wall: corrosion rate from a coupon’s mass loss (as the corrosion rate tool) or from two thickness readings, the minimum required thickness as the larger of the pressure thickness by Barlow’s formula with your allowable stress and joint factor and your structural minimum, the remaining life to that thickness, and the next inspection date as a share of the remaining life capped at your maximum interval.",
    "keywords": [
      "MAKEOS",
      "corrosion remaining life",
      "corrosion rate",
      "minimum thickness",
      "inspection interval",
      "pipe wall",
      "fitness for service"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Rate from",
        "type": "select",
        "default": "coupon",
        "options": [
          [
            "coupon",
            "Coupon mass loss"
          ],
          [
            "thick",
            "Two thickness readings"
          ]
        ]
      },
      {
        "key": "h_coupon",
        "label": "Coupon",
        "type": "heading"
      },
      {
        "key": "W",
        "label": "Mass loss",
        "type": "number",
        "default": 120,
        "unit": "mg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ac",
        "label": "Coupon area",
        "type": "number",
        "default": 20,
        "unit": "cm²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hrs",
        "label": "Exposure time",
        "type": "number",
        "default": 720,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoM",
        "label": "Metal density",
        "type": "number",
        "default": 7.86,
        "unit": "g/cm³",
        "min": 0.000001,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_thickness_readings",
        "label": "Thickness readings",
        "type": "heading"
      },
      {
        "key": "t1",
        "label": "Earlier thickness",
        "type": "number",
        "default": 6.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "years",
        "label": "Years between readings",
        "type": "number",
        "default": 5,
        "unit": "years",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_wall_and_design",
        "label": "Wall and design",
        "type": "heading"
      },
      {
        "key": "tNow",
        "label": "Present thickness",
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
        "key": "D",
        "label": "Outside diameter",
        "type": "number",
        "default": 114.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Design pressure",
        "type": "number",
        "default": 20,
        "unit": "bar",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S",
        "label": "Allowable stress",
        "type": "number",
        "default": 138,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ej",
        "label": "Joint efficiency",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tStruct",
        "label": "Structural minimum thickness",
        "type": "number",
        "default": 2.5,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lifeReq",
        "label": "Life required",
        "type": "number",
        "default": 20,
        "unit": "years",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "share",
        "label": "Inspect at this share of remaining life",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "maxInt",
        "label": "Longest inspection interval",
        "type": "number",
        "default": 5,
        "unit": "years",
        "min": 0.1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
