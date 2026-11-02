// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook68) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "machine-economic-life",
    "name": "Machine Economic Life Check (Year-by-Year EUAC, Minimum-Cost Life, Keep or Replace)",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "How many years should a new machine be kept before replacing it to give the lowest equivalent annual cost, and is it cheaper to keep the existing machine for one more year?",
    "description": "Economic life of a new machine (the challenger): its equivalent uniform annual cost for every life from one year to the longest you examine, from the price, a resale value that falls each year, a running cost that rises by a yearly gradient (capital recovery, sinking fund and gradient factors, as the interest factors tool), the life with the lowest cost and that cost, then the cost of keeping the existing machine (the defender) for one more year from its fall in resale value, the interest on its present value and its running cost, against the challenger’s lowest annual cost.",
    "keywords": [
      "MAKEOS",
      "economic life",
      "replacement analysis",
      "EUAC",
      "defender challenger",
      "machine replacement",
      "equivalent annual cost"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Price of the new machine (installed)",
        "type": "number",
        "default": 120000,
        "unit": "AUD",
        "min": 1,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s1",
        "label": "Resale value after one year",
        "type": "number",
        "default": 70,
        "unit": "% of price",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dS",
        "label": "Yearly fall in resale value after that",
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
        "key": "A1",
        "label": "First-year running cost",
        "type": "number",
        "default": 15000,
        "unit": "AUD/year",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Yearly increase in running cost",
        "type": "number",
        "default": 3000,
        "unit": "AUD/year",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Interest (discount) rate",
        "type": "number",
        "default": 8,
        "unit": "%/year",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nmax",
        "label": "Longest life examined",
        "type": "number",
        "default": 15,
        "unit": "years",
        "min": 1,
        "max": 40,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_existing_machine_defender_",
        "label": "Existing machine (defender)",
        "type": "heading"
      },
      {
        "key": "MV0",
        "label": "Market value of the existing machine now",
        "type": "number",
        "default": 30000,
        "unit": "AUD",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "MV1",
        "label": "Market value of the existing machine in one year",
        "type": "number",
        "default": 24000,
        "unit": "AUD",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ad",
        "label": "Running cost of the existing machine next year",
        "type": "number",
        "default": 32000,
        "unit": "AUD/year",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "groove-weld-cost-check",
    "name": "Butt Weld Quantity and Cost Check (Groove Area, Weld Metal, Arc Time, Cost against Quote)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "For a butt weld with a V, double-V, bevel or square preparation, how much weld metal, filler and arc time does it take, what does it cost, and does my quoted price cover it?",
    "description": "Quantity and cost of a full-penetration butt (groove) weld: the groove area from the plate thickness, preparation, groove angle, root gap and root face, the weld cap area on one or both faces, the weld metal mass per metre and in total, filler wire from the deposition efficiency, arc time from the deposition rate, paid time from the operating factor plus other time per metre, and labour, filler and shielding gas cost (as the weld cost tool, with groove geometry in place of the fillet), against the price quoted for the welding.",
    "keywords": [
      "MAKEOS",
      "butt weld",
      "groove weld",
      "V preparation",
      "weld metal",
      "welding cost",
      "deposition rate"
    ],
    "fields": [
      {
        "key": "prep",
        "label": "Joint preparation",
        "type": "select",
        "default": "sv",
        "options": [
          [
            "sv",
            "Single-V"
          ],
          [
            "dv",
            "Double-V (symmetric)"
          ],
          [
            "sb",
            "Single-bevel"
          ],
          [
            "sq",
            "Square butt (no preparation)"
          ]
        ]
      },
      {
        "key": "t",
        "label": "Plate thickness",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang",
        "label": "Groove angle (included angle for V, bevel angle for single-bevel)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 1,
        "max": 120,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g",
        "label": "Root gap",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Root face",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Cap reinforcement height",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e",
        "label": "Cap overlap past each groove edge",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "caps",
        "label": "Weld caps",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Cap on one face"
          ],
          [
            "2",
            "Cap on both faces"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Weld length",
        "type": "number",
        "default": 6,
        "unit": "m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_process_and_rates",
        "label": "Process and rates",
        "type": "heading"
      },
      {
        "key": "rho",
        "label": "Weld metal density",
        "type": "number",
        "default": 7.85,
        "unit": "g/cm³",
        "min": 0.000001,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dep",
        "label": "Deposition rate",
        "type": "number",
        "default": 3,
        "unit": "kg/h",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "of",
        "label": "Operating factor (arc time ÷ paid time)",
        "type": "number",
        "default": 30,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Deposition efficiency",
        "type": "number",
        "default": 92,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Labour rate",
        "type": "number",
        "default": 95,
        "unit": "AUD/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wire",
        "label": "Filler price",
        "type": "number",
        "default": 6,
        "unit": "AUD/kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gasFlow",
        "label": "Shielding gas flow",
        "type": "number",
        "default": 15,
        "unit": "L/min",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gasPrice",
        "label": "Shielding gas price",
        "type": "number",
        "default": 12,
        "unit": "AUD/m³",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "oth",
        "label": "Other time per metre (fit-up, back-gouging, grinding)",
        "type": "number",
        "default": 10,
        "unit": "min/m",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "quote",
        "label": "Price quoted for the welding",
        "type": "number",
        "default": 800,
        "unit": "AUD",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "insert-consumption-reorder-plan",
    "name": "Cutting Insert Consumption and Reorder Plan (Tool Life, Parts per Edge, Monthly Use, Reorder Point)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "At this cutting speed, how many parts does each insert edge make, how many inserts will I use each month and what do they cost per part, and is my stock above the reorder point?",
    "description": "Consumption plan for indexable inserts on a turning operation: spindle speed and cutting time per part (as the turning cost tool), Taylor tool life at the cutting speed (as the Taylor tool life tool), the share of life used before indexing, whole parts per edge, inserts per month and per day, insert cost per part and per month, then the safety stock for a service level and the reorder point over the supplier lead time (as the safety stock and reorder point tools), against the inserts on hand.",
    "keywords": [
      "MAKEOS",
      "insert consumption",
      "tool life",
      "reorder point",
      "tooling cost",
      "Taylor",
      "tool crib"
    ],
    "fields": [
      {
        "key": "V",
        "label": "Cutting speed",
        "type": "number",
        "default": 200,
        "unit": "m/min",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Taylor exponent n",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Taylor constant C (speed for 1 min life)",
        "type": "number",
        "default": 400,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "use",
        "label": "Share of tool life used before indexing",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cut_per_part",
        "label": "Cut per part",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Workpiece diameter",
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
        "key": "Lc",
        "label": "Length of cut per pass",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed",
        "type": "number",
        "default": 0.25,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "passes",
        "label": "Passes per part",
        "type": "number",
        "default": 2,
        "unit": "passes",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "edges",
        "label": "Cutting edges per insert",
        "type": "number",
        "default": 4,
        "unit": "edges",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "price",
        "label": "Insert price",
        "type": "number",
        "default": 18,
        "unit": "AUD",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_demand_and_supply",
        "label": "Demand and supply",
        "type": "heading"
      },
      {
        "key": "parts",
        "label": "Parts per month",
        "type": "number",
        "default": 6000,
        "unit": "parts",
        "min": 1,
        "max": 100000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "days",
        "label": "Working days per month",
        "type": "number",
        "default": 21,
        "unit": "days",
        "min": 1,
        "max": 31,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "lead",
        "label": "Supplier lead time",
        "type": "number",
        "default": 10,
        "unit": "working days",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cv",
        "label": "Day-to-day variation in insert use (coefficient of variation)",
        "type": "number",
        "default": 30,
        "unit": "%",
        "min": 0,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "svc",
        "label": "Service level (chance of not running out in a lead time)",
        "type": "select",
        "default": "95",
        "options": [
          [
            "90",
            "90%"
          ],
          [
            "95",
            "95%"
          ],
          [
            "97.5",
            "97.5%"
          ],
          [
            "99",
            "99%"
          ],
          [
            "99.5",
            "99.5%"
          ]
        ]
      },
      {
        "key": "onHand",
        "label": "Inserts on hand",
        "type": "number",
        "default": 60,
        "unit": "inserts",
        "min": 0,
        "max": 100000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "bearing-fleet-spares-plan",
    "name": "Bearing Fleet Spares Plan (Rating Life, Weibull Failures, Spares for a Service Level)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "For a group of identical bearings in service, how many are expected to fail over the planning period, and how many spares must I hold to be this sure of not running out?",
    "description": "Spares plan for identical rolling bearings: the basic rating life L₁₀ from the dynamic rating, equivalent load and speed (as the bearing life tool), the Weibull characteristic life that puts 10 % of failures at L₁₀ for the slope you enter, the probability that one bearing fails within the planning period (as the Weibull reliability tool), the expected number of failures in the group, and the smallest number of spares whose binomial probability of covering all failures reaches your service level, against the spares held.",
    "keywords": [
      "MAKEOS",
      "bearing spares",
      "L10 life",
      "Weibull",
      "spare parts",
      "binomial",
      "maintenance stores"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Bearing type",
        "type": "select",
        "default": "ball",
        "options": [
          [
            "ball",
            "Ball bearing (exponent 3)"
          ],
          [
            "roller",
            "Roller bearing (exponent 10/3)"
          ]
        ]
      },
      {
        "key": "C",
        "label": "Basic dynamic load rating",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Equivalent dynamic load",
        "type": "number",
        "default": 3,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eS",
        "label": "Weibull slope of bearing life",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 0.3,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_fleet_and_plan",
        "label": "Fleet and plan",
        "type": "heading"
      },
      {
        "key": "Nb",
        "label": "Identical bearings in service",
        "type": "number",
        "default": 40,
        "unit": "bearings",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "hpy",
        "label": "Running hours per year",
        "type": "number",
        "default": 4000,
        "unit": "h/year",
        "min": 0.000001,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "yrs",
        "label": "Planning period",
        "type": "number",
        "default": 1,
        "unit": "years",
        "min": 0.01,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tgt",
        "label": "Chance of not running out",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 50,
        "max": 99.99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "held",
        "label": "Spares held",
        "type": "number",
        "default": 3,
        "unit": "bearings",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "hydraulic-press-cycle-check",
    "name": "Hydraulic Press Cycle Check (Regenerative Approach, Pressing Force, Return, Cycle Time, Motor Power)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "For a hydraulic press with this cylinder and pump, how fast are the approach, pressing and return strokes, does it reach the pressing force, how long is a cycle, and is the motor big enough?",
    "description": "Cycle check of a single-cylinder hydraulic press: cylinder areas, approach speed and the pressure needed to overcome the approach resistance with a standard or regenerative approach circuit, pressing speed and the force at the relief pressure (as the hydraulic cylinder tool), return speed, the stroke times and total cycle time with dwell, and the motor power at the pressure needed for the pressing force and at the relief pressure (as the hydraulic power tool), against the force needed, the cycle time target and the installed motor.",
    "keywords": [
      "MAKEOS",
      "hydraulic press",
      "regenerative circuit",
      "press cycle time",
      "pressing force",
      "cylinder speed",
      "motor power"
    ],
    "fields": [
      {
        "key": "bore",
        "label": "Cylinder bore",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rod",
        "label": "Rod diameter",
        "type": "number",
        "default": 70,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Q",
        "label": "Pump flow",
        "type": "number",
        "default": 40,
        "unit": "L/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Relief valve setting",
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
        "key": "circuit",
        "label": "Approach circuit",
        "type": "select",
        "default": "regen",
        "options": [
          [
            "regen",
            "Regenerative (rod-end oil joins the pump flow)"
          ],
          [
            "std",
            "Standard (rod end to tank)"
          ]
        ]
      },
      {
        "key": "h_stroke_and_load",
        "label": "Stroke and load",
        "type": "heading"
      },
      {
        "key": "Freq",
        "label": "Pressing force needed",
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
        "key": "Fapp",
        "label": "Resistance during the approach (negative if the ram weight helps)",
        "type": "number",
        "default": 2,
        "unit": "kN",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Approach stroke",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sP",
        "label": "Pressing stroke",
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
        "key": "dwell",
        "label": "Dwell at pressure",
        "type": "number",
        "default": 1,
        "unit": "s",
        "min": 0,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_targets",
        "label": "Targets",
        "type": "heading"
      },
      {
        "key": "eta",
        "label": "Overall pump efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pmot",
        "label": "Installed motor power",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tMax",
        "label": "Cycle time target",
        "type": "number",
        "default": 6,
        "unit": "s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vacuum-table-workholding-check",
    "name": "Vacuum Table Workholding Check (Holding Force, Milling Force, Sliding Safety Factor)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "Will a vacuum table hold this plate without sliding while I mill it, and what feed rate keeps the safety factor I need?",
    "description": "Workholding check for milling a flat part on a vacuum table: the holding force from the vacuum and the sealed area with an allowance for leakage (as the vacuum cup tool), the friction resistance with the part weight, the mean cutting force from the cutting power and cutting speed (as the milling power tool) with a factor for force peaks, the sliding safety factor, and the largest feed rate that keeps your required safety factor.",
    "keywords": [
      "MAKEOS",
      "vacuum table",
      "vacuum chuck",
      "workholding",
      "milling force",
      "safety factor",
      "sheet and plate machining"
    ],
    "fields": [
      {
        "key": "Lp",
        "label": "Sealed length under vacuum",
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
        "key": "Wp",
        "label": "Sealed width under vacuum",
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
        "key": "vac",
        "label": "Vacuum below atmosphere",
        "type": "number",
        "default": 80,
        "unit": "kPa",
        "min": 0.000001,
        "max": 101,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "effA",
        "label": "Effective share of the sealed area",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Friction coefficient, part on table",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.01,
        "max": 2,
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
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_milling_cut_as_the_milling_power_tool_",
        "label": "Milling cut (as the milling power tool)",
        "type": "heading"
      },
      {
        "key": "ae",
        "label": "Width of cut",
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
        "key": "ap",
        "label": "Depth of cut",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vf",
        "label": "Table feed",
        "type": "number",
        "default": 2000,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Cutter diameter",
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
        "key": "rpm",
        "label": "Spindle speed",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc",
        "label": "Specific cutting force",
        "type": "number",
        "default": 800,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dyn",
        "label": "Peak-to-mean force factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Required safety factor against sliding",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gauge-repeatability-bias-check",
    "name": "Gauge Repeatability and Bias Check (Type 1 Study: Cg, Cgk, Bias t-Test)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From repeated readings of a reference master, is this gauge repeatable and accurate enough for the tolerance, and is its bias statistically significant?",
    "description": "Type 1 gauge study from repeated readings of one reference master by one operator: the tolerance, bias (mean minus reference), the potential capability Cg from a share of the tolerance against a spread of standard deviations, the capability with bias Cgk, the percentage of tolerance taken by repeatability and by repeatability with bias, a two-sided t-test of the bias (confidence interval of the mean, as the two-sample t-test tool’s t distribution), and the gauge resolution as a share of the tolerance, against your minimum capability and largest resolution share.",
    "keywords": [
      "MAKEOS",
      "type 1 gauge study",
      "Cg",
      "Cgk",
      "gauge capability",
      "measurement bias",
      "repeatability"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of repeated readings",
        "type": "number",
        "default": 25,
        "unit": "readings",
        "min": 3,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "xbar",
        "label": "Mean of the readings",
        "type": "number",
        "default": 10.0002,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Standard deviation of the readings",
        "type": "number",
        "default": 0.0008,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "xref",
        "label": "Reference value of the master",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "LSL",
        "label": "Lower specification limit",
        "type": "number",
        "default": 9.98,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "USL",
        "label": "Upper specification limit",
        "type": "number",
        "default": 10.02,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "res",
        "label": "Gauge resolution (smallest step)",
        "type": "number",
        "default": 0.0001,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_acceptance_settings",
        "label": "Acceptance settings",
        "type": "heading"
      },
      {
        "key": "K",
        "label": "Share of tolerance used for Cg",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lm",
        "label": "Spread in standard deviations",
        "type": "number",
        "default": 6,
        "unit": "σ",
        "min": 1,
        "max": 12,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cmin",
        "label": "Minimum Cg and Cgk",
        "type": "number",
        "default": 1.33,
        "unit": "",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "resMax",
        "label": "Largest resolution as a share of tolerance",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Significance level for the bias test",
        "type": "select",
        "default": "0.05",
        "options": [
          [
            "0.1",
            "0.10"
          ],
          [
            "0.05",
            "0.05"
          ],
          [
            "0.01",
            "0.01"
          ]
        ]
      }
    ]
  }
]);
