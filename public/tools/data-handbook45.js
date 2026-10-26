// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook45) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "air-main-sizing",
    "name": "Compressed-Air Main Sizing (Bore, Pressure Drop, Velocity, Receiver)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What is the smallest standard pipe bore for this compressed-air main within my pressure-drop and velocity limits, and how big a receiver covers the peak demand?",
    "description": "Sizing of a compressed-air main: velocity, Reynolds number, friction factor and pressure drop for a bore (as the compressed-air pipe drop tool), the smallest standard bore that keeps both the drop and the velocity within your limits (searched through common nominal bores), the check of the bore you chose, and the receiver volume to cover a peak demand above the compressor output over a pressure band (as the air receiver tool).",
    "keywords": [
      "MAKEOS",
      "compressed air main",
      "air pipe sizing",
      "pressure drop",
      "air velocity",
      "air receiver",
      "ring main"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Flow (free air)",
        "type": "number",
        "default": 5,
        "unit": "m³/min",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Line pressure",
        "type": "number",
        "default": 7,
        "unit": "bar",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Air temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -20,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Equivalent length (pipe plus fittings)",
        "type": "number",
        "default": 100,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Pipe roughness",
        "type": "number",
        "default": 0.045,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Bore chosen",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dpPct",
        "label": "Largest pressure drop",
        "type": "number",
        "default": 3,
        "unit": "% of line pressure",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vMax",
        "label": "Largest air velocity",
        "type": "number",
        "default": 8,
        "unit": "m/s",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_receiver",
        "label": "Receiver",
        "type": "heading"
      },
      {
        "key": "deficit",
        "label": "Peak demand above compressor output (free air)",
        "type": "number",
        "default": 2,
        "unit": "m³/min",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tPeak",
        "label": "Duration of the peak",
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
        "key": "p1",
        "label": "Pressure when the peak starts",
        "type": "number",
        "default": 8,
        "unit": "bar",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Least pressure allowed",
        "type": "number",
        "default": 6.5,
        "unit": "bar",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "anodizing-plan",
    "name": "Anodizing Plan (Time, Current, Tank Heat, Loads and Cost per Part)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long does this anodizing load take to reach thickness, can the rectifier supply it, how much heat must the tank cooling remove, and what does each part cost?",
    "description": "Plan of a sulfuric acid anodizing job: growth rate and time to thickness by the 720 rule with your efficiency factor, build-up per surface (as the anodizing time tool), current for the load against the rectifier capacity, the electrical heat the tank cooling must remove at the bath voltage, loads and line hours for the batch, energy, and cost per part from energy and line time.",
    "keywords": [
      "MAKEOS",
      "anodizing plan",
      "720 rule",
      "anodizing time",
      "tank cooling",
      "rectifier",
      "anodizing cost"
    ],
    "fields": [
      {
        "key": "J",
        "label": "Current density",
        "type": "number",
        "default": 1.5,
        "unit": "A/dm²",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thick",
        "label": "Coating thickness wanted",
        "type": "number",
        "default": 20,
        "unit": "µm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Efficiency factor",
        "type": "number",
        "default": 100,
        "unit": "%",
        "min": 30,
        "max": 120,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Area per part",
        "type": "number",
        "default": 1,
        "unit": "dm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "np",
        "label": "Parts per load",
        "type": "number",
        "default": 50,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "batch",
        "label": "Parts in the batch",
        "type": "number",
        "default": 1000,
        "unit": "",
        "min": 1,
        "max": 100000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "rect",
        "label": "Rectifier capacity",
        "type": "number",
        "default": 100,
        "unit": "A",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "Bath voltage at the current",
        "type": "number",
        "default": 18,
        "unit": "V",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "chill",
        "label": "Bath cooling capacity",
        "type": "number",
        "default": 2,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "handle",
        "label": "Handling time per load",
        "type": "number",
        "default": 15,
        "unit": "min",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pE",
        "label": "Electricity price",
        "type": "number",
        "default": 0.25,
        "unit": "$/kWh",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Line labour and overhead rate",
        "type": "number",
        "default": 60,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "repair-or-replace",
    "name": "Repair or Replace (Defender and Challenger Equivalent Annual Cost)",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "Should I keep running this old machine, with its rising running costs, or replace it with a new one, comparing them as equivalent annual costs?",
    "description": "Replacement decision between an existing machine (the defender) and a new one (the challenger): the defender’s equivalent uniform annual cost from its present market value, first-year running cost rising by a yearly gradient (using the gradient factor, as the interest factors tool) and its salvage at the end of its remaining life, the challenger’s equivalent annual cost from price, running cost and salvage (as the EUAC comparison tool), the yearly difference and the decision.",
    "keywords": [
      "MAKEOS",
      "replacement analysis",
      "repair or replace",
      "defender challenger",
      "EUAC",
      "rising maintenance cost",
      "equipment replacement"
    ],
    "fields": [
      {
        "key": "rate",
        "label": "Interest rate",
        "type": "number",
        "default": 8,
        "unit": "%",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_defender_keep_the_old_machine_",
        "label": "Defender (keep the old machine)",
        "type": "heading"
      },
      {
        "key": "mvD",
        "label": "Present market value",
        "type": "number",
        "default": 15000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aD",
        "label": "Running cost next year",
        "type": "number",
        "default": 14000,
        "unit": "$/yr",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gD",
        "label": "Yearly increase in running cost",
        "type": "number",
        "default": 2000,
        "unit": "$/yr",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sD",
        "label": "Salvage at the end",
        "type": "number",
        "default": 3000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nD",
        "label": "Remaining life",
        "type": "number",
        "default": 4,
        "unit": "years",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_challenger_new_machine_",
        "label": "Challenger (new machine)",
        "type": "heading"
      },
      {
        "key": "pC",
        "label": "Price installed",
        "type": "number",
        "default": 80000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aC",
        "label": "Running cost per year",
        "type": "number",
        "default": 6000,
        "unit": "$/yr",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sC",
        "label": "Salvage at the end",
        "type": "number",
        "default": 10000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nC",
        "label": "Life",
        "type": "number",
        "default": 10,
        "unit": "years",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "make-or-buy",
    "name": "Make or Buy (In-House Cost against a Supplier Price, Break-Even)",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "Is it cheaper to make this part in-house or buy it, at what quantity do the two cost the same, and how much does the right choice save at my volume?",
    "description": "Make-or-buy comparison: in-house unit cost from cycle time at your machine-hour rate plus material, with tooling and set-up as fixed cost; bought cost from the supplier price plus any one-off tooling or qualification charge; total cost at the planned quantity, the break-even quantity where the two totals meet (as the process break-even tool), and the cheaper option with its saving.",
    "keywords": [
      "MAKEOS",
      "make or buy",
      "break-even quantity",
      "outsourcing",
      "in-house cost",
      "supplier price",
      "unit cost"
    ],
    "fields": [
      {
        "key": "qty",
        "label": "Planned quantity",
        "type": "number",
        "default": 2000,
        "unit": "units",
        "min": 1,
        "max": 1000000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_make",
        "label": "Make",
        "type": "heading"
      },
      {
        "key": "fixM",
        "label": "Tooling, fixtures and set-up (fixed)",
        "type": "number",
        "default": 6000,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tc",
        "label": "Cycle time per part",
        "type": "number",
        "default": 4,
        "unit": "min",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mhr",
        "label": "Machine-hour rate (machine and operator)",
        "type": "number",
        "default": 105,
        "unit": "$/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mat",
        "label": "Material per part",
        "type": "number",
        "default": 3,
        "unit": "$",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_buy",
        "label": "Buy",
        "type": "heading"
      },
      {
        "key": "price",
        "label": "Supplier price per part",
        "type": "number",
        "default": 12,
        "unit": "$",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fixB",
        "label": "One-off supplier tooling or qualification",
        "type": "number",
        "default": 1500,
        "unit": "$",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "freight",
        "label": "Freight and inspection per part",
        "type": "number",
        "default": 0.5,
        "unit": "$",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "block-and-tackle-check",
    "name": "Block and Tackle Check (Pull with Sheave Friction, Rope and Operator)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What pull does this block and tackle need at the fast line once sheave friction is counted, is the rope strong enough, and can one person pull it by hand?",
    "description": "Check of a rope block and tackle (simple purchase with n supporting parts): ideal pull, overall efficiency of the reeving from the efficiency of each sheave, actual fast-line pull (as the hoist mechanical advantage tool with that overall efficiency), mechanical advantage, rope pulled per metre of lift, the rope safety factor on the fast line, and for hand operation the pull against your limit for one person.",
    "keywords": [
      "MAKEOS",
      "block and tackle",
      "sheave efficiency",
      "rope pull",
      "mechanical advantage",
      "reeving",
      "hand hoist"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Load mass",
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
        "key": "n",
        "label": "Parts of rope supporting the load",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "e",
        "label": "Efficiency of each sheave",
        "type": "number",
        "default": 96,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "MBL",
        "label": "Rope minimum breaking load",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Rope safety factor required",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "op",
        "label": "Fast line pulled by",
        "type": "select",
        "default": "winch",
        "options": [
          [
            "winch",
            "A winch or powered drive"
          ],
          [
            "hand",
            "Hand"
          ]
        ]
      },
      {
        "key": "hand",
        "label": "Largest pull for one person",
        "type": "number",
        "default": 300,
        "unit": "N",
        "min": 50,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "restrained-bar-thermal-check",
    "name": "Restrained Bar Heating (Thermal Stress, Yield and Buckling)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "When this bar or pipe is held between fixed supports and heats up, does the thermal stress stay below yield, and will it buckle before then?",
    "description": "Check of a round bar or member held at both ends while its temperature changes: free thermal strain, restrained thermal stress and the force on the supports (as the thermal stress tool), the yield safety factor, the buckling load of the member by Euler or Johnson for its effective length (as the column buckling tool), the buckling safety factor against the thermal force, and the temperature rise at which yielding and buckling would begin.",
    "keywords": [
      "MAKEOS",
      "thermal stress",
      "restrained bar",
      "thermal buckling",
      "pipe expansion",
      "fixed supports",
      "temperature rise"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Bar diameter",
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
        "key": "L",
        "label": "Length between restraints",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Effective length factor",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0.5,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
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
        "key": "alpha",
        "label": "Expansion coefficient",
        "type": "number",
        "default": 12,
        "unit": "µm/m·K",
        "min": 0.000001,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Temperature rise",
        "type": "number",
        "default": 40,
        "unit": "K",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "restraint",
        "label": "Degree of restraint",
        "type": "number",
        "default": 100,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength",
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
        "key": "req",
        "label": "Safety factor required (yield and buckling)",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "buffer-stop-design",
    "name": "Buffer Stop Design (Impact Energy, Stroke, Force and Deceleration)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What buffer stroke stops this moving carriage within my force and deceleration limits, and what peak force reaches the end stop structure?",
    "description": "Design of an end buffer for a moving carriage, trolley or crane: kinetic energy at impact (as the impact load tool, moving mode), extra energy from a drive force that keeps pushing through the stroke, peak buffer force and deceleration for a spring buffer (force rising linearly) or a hydraulic buffer (near-constant force at its efficiency), the stroke needed to stay within your deceleration limit, and checks of force and deceleration.",
    "keywords": [
      "MAKEOS",
      "buffer stop",
      "end stop",
      "hydraulic buffer",
      "spring buffer",
      "impact energy",
      "deceleration"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Moving mass",
        "type": "number",
        "default": 2000,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Impact speed",
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
        "key": "Fd",
        "label": "Drive force continuing through the stroke",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "type",
        "label": "Buffer type",
        "type": "select",
        "default": "hyd",
        "options": [
          [
            "hyd",
            "Hydraulic (near-constant force)"
          ],
          [
            "spring",
            "Spring or elastomer (force rises with stroke)"
          ]
        ]
      },
      {
        "key": "eta",
        "label": "Hydraulic buffer efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Buffer stroke",
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
        "key": "aMax",
        "label": "Largest deceleration allowed",
        "type": "number",
        "default": 1,
        "unit": "g",
        "min": 0.05,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fmax",
        "label": "Largest force the end stop can take",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gas-vessel-temperature-check",
    "name": "Closed Gas Vessel Temperature Check (Pressure Rise, Contents, Fill Limit)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "If this closed gas vessel or cylinder heats up, how high does its pressure rise, is it within the rating, and what is the highest pressure I can fill it to?",
    "description": "Pressure change of a fixed volume of gas with temperature: the pressure at the hot condition from the gas law at constant volume (as the gas law tool with equal volumes), the mass of gas held, the pressure rise against the vessel rating or relief setting, and the highest fill pressure at the filling temperature that keeps the hot pressure within the rating.",
    "keywords": [
      "MAKEOS",
      "gas law",
      "pressure rise",
      "cylinder temperature",
      "fill pressure",
      "closed vessel",
      "relief setting"
    ],
    "fields": [
      {
        "key": "V",
        "label": "Vessel volume",
        "type": "number",
        "default": 50,
        "unit": "L",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p1",
        "label": "Fill pressure (gauge)",
        "type": "number",
        "default": 200,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Temperature at filling",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -60,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Highest temperature in service",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -60,
        "max": 500,
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
        "max": 1.2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Gas constant",
        "type": "number",
        "default": 287,
        "unit": "J/kg·K",
        "min": 50,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rating",
        "label": "Vessel rating or relief setting (gauge)",
        "type": "number",
        "default": 230,
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
    "id": "blow-off-nozzle-cost",
    "name": "Compressed-Air Blow-Off Consumption (Nozzles, Air, Power and Cost)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "How much compressed air do these blow-off nozzles or open pipes use, what share of the compressor is that, and what does it cost each year?",
    "description": "Consumption of open blow-off nozzles or pipe ends: jet velocity, choked flow and free-air flow through each opening (as the escaping air velocity tool), total flow for the nozzles at their duty, share of compressor capacity, compressor power and yearly energy cost from your specific power, and the saving from changing to engineered nozzles of a known flow.",
    "keywords": [
      "MAKEOS",
      "blow-off",
      "air nozzle",
      "compressed air consumption",
      "open pipe",
      "energy cost",
      "air knife"
    ],
    "fields": [
      {
        "key": "p1",
        "label": "Supply pressure (gauge)",
        "type": "number",
        "default": 6,
        "unit": "bar",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Outside pressure (absolute)",
        "type": "number",
        "default": 1.01325,
        "unit": "bar",
        "min": 0.5,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Air temperature",
        "type": "number",
        "default": 21,
        "unit": "°C",
        "min": -20,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Ratio of specific heats",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1.1,
        "max": 1.67,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Opening diameter",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cd",
        "label": "Discharge coefficient",
        "type": "number",
        "default": 0.65,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of openings",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "duty",
        "label": "Share of time blowing",
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
        "key": "spec",
        "label": "Compressor specific power",
        "type": "number",
        "default": 6.5,
        "unit": "kW per m³/min",
        "min": 0.000001,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qc",
        "label": "Compressor capacity",
        "type": "number",
        "default": 10,
        "unit": "m³/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Running hours per year",
        "type": "number",
        "default": 4000,
        "unit": "h",
        "min": 0.000001,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Electricity price",
        "type": "number",
        "default": 0.25,
        "unit": "$/kWh",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qeng",
        "label": "Flow of an engineered nozzle at this pressure",
        "type": "number",
        "default": 60,
        "unit": "L/min",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
