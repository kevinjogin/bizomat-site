// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook29) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "gear-train-ratio-planner",
    "name": "Gear Train Tooth Number Planner",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What tooth numbers give this reduction ratio in one or two stages, and how close can I get?",
    "description": "Search for spur or helical gear tooth numbers that produce a target reduction in one or two stages within limits on tooth count and stage ratio: the best combination by ratio error, preferring hunting-tooth pairs (no common factor) and the smallest total teeth, with the actual ratio, error, output speed and a table of the five best trains.",
    "keywords": [
      "MAKEOS",
      "gear ratio",
      "tooth numbers",
      "gear train design",
      "hunting tooth",
      "reduction ratio",
      "compound gear train"
    ],
    "fields": [
      {
        "key": "R",
        "label": "Target reduction ratio (input ÷ output speed)",
        "type": "number",
        "default": 23.5,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nin",
        "label": "Input speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stages",
        "label": "Stages",
        "type": "select",
        "default": "2",
        "options": [
          [
            "1",
            "One stage"
          ],
          [
            "2",
            "Two stages"
          ]
        ]
      },
      {
        "key": "zmin",
        "label": "Minimum teeth",
        "type": "number",
        "default": 17,
        "unit": "",
        "min": 8,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "zmax",
        "label": "Maximum teeth",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": 10,
        "max": 300,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "rmax",
        "label": "Maximum ratio per stage",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hunt",
        "label": "Prefer hunting-tooth pairs",
        "type": "select",
        "default": "yes",
        "options": [
          [
            "yes",
            "Yes"
          ],
          [
            "no",
            "No"
          ]
        ]
      }
    ]
  },
  {
    "id": "gearbox-heat-balance",
    "name": "Gearbox or Hydraulic Unit Heat Balance and Cooling",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How hot will this gearbox or hydraulic power unit run, and does it need a cooler?",
    "description": "Thermal balance of an enclosed gearbox or hydraulic power unit: heat generated from the power and efficiency, equilibrium oil temperature from the housing or tank surface area and a heat transfer coefficient (natural or fan-cooled), the thermal power limit for the maximum oil temperature, and the cooler duty and oil flow needed when the surface alone is not enough.",
    "keywords": [
      "MAKEOS",
      "thermal rating",
      "gearbox temperature",
      "oil cooler sizing",
      "hydraulic heat load",
      "heat dissipation",
      "oil temperature"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Unit",
        "type": "select",
        "default": "gear",
        "options": [
          [
            "gear",
            "Gearbox"
          ],
          [
            "hpu",
            "Hydraulic power unit"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Input power",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Efficiency (gearbox) or overall system efficiency (hydraulics)",
        "type": "number",
        "default": 92,
        "unit": "%",
        "min": 10,
        "max": 99.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Heat-dissipating surface area",
        "type": "number",
        "default": 2,
        "unit": "m²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Heat transfer coefficient",
        "type": "number",
        "default": 15,
        "unit": "W/m²·K",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tamb",
        "label": "Ambient temperature",
        "type": "number",
        "default": 30,
        "unit": "°C",
        "min": -40,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Maximum oil temperature",
        "type": "number",
        "default": 80,
        "unit": "°C",
        "min": 20,
        "max": 150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Oil temperature drop across the cooler",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Oil specific heat",
        "type": "number",
        "default": 1.9,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Oil density",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "tool-deflection-cut-limit",
    "name": "Cutting Tool Deflection and Depth-of-Cut Limit",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How far will this end mill or boring bar deflect under the cut, and what depth keeps it within tolerance?",
    "description": "Cutting force on an end mill (average tangential force from removal rate and specific cutting force) or a boring bar (chip area × specific cutting force), the resultant with the radial component, the tool’s cantilever deflection with an effective fluted diameter, the overhang ratio, and the largest depth of cut that keeps deflection within the allowance.",
    "keywords": [
      "MAKEOS",
      "tool deflection",
      "end mill deflection",
      "boring bar",
      "overhang ratio",
      "depth of cut limit",
      "wall straightness"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Tool",
        "type": "select",
        "default": "mill",
        "options": [
          [
            "mill",
            "End mill (side milling)"
          ],
          [
            "bore",
            "Boring bar or turning tool"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Tool or bar diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Overhang (stick-out)",
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
        "key": "k",
        "label": "Effective diameter factor (fluted section)",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.4,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Tool modulus",
        "type": "number",
        "default": 600,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc",
        "label": "Specific cutting force",
        "type": "number",
        "default": 2000,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Radial ÷ tangential force",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_end_mill_cut",
        "label": "End mill cut",
        "type": "heading"
      },
      {
        "key": "z",
        "label": "Teeth",
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
        "key": "fz",
        "label": "Feed per tooth",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ae",
        "label": "Radial width of cut",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Axial depth of cut (end mill)",
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
        "key": "h_boring_cut",
        "label": "Boring cut",
        "type": "heading"
      },
      {
        "key": "f",
        "label": "Feed per revolution (boring)",
        "type": "number",
        "default": 0.15,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ab",
        "label": "Depth of cut (boring, radial)",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limit",
        "label": "Limit",
        "type": "heading"
      },
      {
        "key": "allow",
        "label": "Allowable deflection",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "sheet-metal-part-cost",
    "name": "Sheet-Metal Bracket: Flat Blank, Nesting, Bending Force and Cost",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What flat blank, sheet yield, bending force and cost per part does this bent sheet-metal bracket have?",
    "description": "Cost build-up of a one- or two-bend sheet-metal part: developed flat length from outside dimensions with the bend allowance and deduction (K-factor), parts per sheet in the better orientation with spacing, material utilisation and cost per part, press brake force per bend, and labour cost from bend and blanking times with set-up spread over the batch.",
    "keywords": [
      "MAKEOS",
      "sheet metal cost",
      "flat blank",
      "bend deduction",
      "nesting yield",
      "press brake force",
      "bracket cost"
    ],
    "fields": [
      {
        "key": "h_part",
        "label": "Part",
        "type": "heading"
      },
      {
        "key": "a",
        "label": "First flange (outside)",
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
        "key": "b",
        "label": "Web (outside)",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Second flange (outside, 0 = one bend)",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Part width",
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
        "key": "t",
        "label": "Thickness",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Inside bend radius",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "K-factor",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0.2,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang",
        "label": "Bend angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 10,
        "max": 175,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_sheet_and_material",
        "label": "Sheet and material",
        "type": "heading"
      },
      {
        "key": "Ls",
        "label": "Sheet length",
        "type": "number",
        "default": 2500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ws",
        "label": "Sheet width",
        "type": "number",
        "default": 1250,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gap",
        "label": "Spacing and edge margin",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Sheet price",
        "type": "number",
        "default": 1.5,
        "unit": "$/kg",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "UTS",
        "label": "Tensile strength",
        "type": "number",
        "default": 450,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_press_brake_and_labour",
        "label": "Press brake and labour",
        "type": "heading"
      },
      {
        "key": "V",
        "label": "Die opening",
        "type": "number",
        "default": 16,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kf",
        "label": "Air-bending factor",
        "type": "number",
        "default": 1.33,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Shop rate",
        "type": "number",
        "default": 90,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tb",
        "label": "Time per bend",
        "type": "number",
        "default": 15,
        "unit": "s",
        "min": 0,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tc",
        "label": "Blanking time per part",
        "type": "number",
        "default": 20,
        "unit": "s",
        "min": 0,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "setup",
        "label": "Set-up time per batch",
        "type": "number",
        "default": 60,
        "unit": "min",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "batch",
        "label": "Batch quantity",
        "type": "number",
        "default": 200,
        "unit": "",
        "min": 1,
        "max": 100000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "tapped-hole-design",
    "name": "Tapped Hole Design (Drill, Engagement and Depth)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What drill, length of engagement and tapping depth does this tapped hole need so the thread does not strip?",
    "description": "Design of a blind tapped hole for a metric screw: tap drill for the chosen percentage of thread and tap type, the length of engagement at which the bolt breaks before the threads strip (handbook shear-area method, extended by the strength ratio for weaker internal threads), the full-thread depth allowing for the tap chamfer, and the drill depth including the drill point.",
    "keywords": [
      "MAKEOS",
      "tapped hole",
      "thread engagement",
      "tap drill",
      "thread stripping",
      "blind hole depth",
      "aluminium thread"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Nominal diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pct",
        "label": "Percentage of thread",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tap",
        "label": "Tap",
        "type": "select",
        "default": "cut",
        "options": [
          [
            "cut",
            "Cutting tap"
          ],
          [
            "roll",
            "Forming (roll) tap"
          ]
        ]
      },
      {
        "key": "Sub",
        "label": "Screw tensile strength",
        "type": "number",
        "default": 800,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sun",
        "label": "Tensile strength of the tapped material",
        "type": "number",
        "default": 310,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "chamfer",
        "label": "Tap chamfer allowance",
        "type": "number",
        "default": 3,
        "unit": "pitches",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "extra",
        "label": "Extra drill depth beyond the threads",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "point",
        "label": "Drill point angle",
        "type": "number",
        "default": 118,
        "unit": "°",
        "min": 60,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pneumatic-cylinder-sizing",
    "name": "Pneumatic Cylinder Sizing, Air Use and Running Cost",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What bore does this air cylinder need, how much air does it use, and what does that air cost?",
    "description": "Sizing of a double-acting pneumatic cylinder: minimum bore for the load at a recommended load ratio, the next standard bore, extend and retract forces, free air per cycle and average consumption (as the cylinder air consumption tool), peak flow while extending at speed, kinetic energy against the cushion capacity, and the yearly energy cost of the air.",
    "keywords": [
      "MAKEOS",
      "pneumatic cylinder sizing",
      "air cylinder bore",
      "air consumption",
      "load ratio",
      "cushioning",
      "compressed air cost"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Load force",
        "type": "number",
        "default": 600,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Maximum load ratio",
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
        "key": "p",
        "label": "Supply pressure",
        "type": "number",
        "default": 6,
        "unit": "bar g",
        "min": 0.000001,
        "max": 16,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rod",
        "label": "Rod diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stroke",
        "label": "Stroke",
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
        "key": "cpm",
        "label": "Cycles per minute",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Extend speed",
        "type": "number",
        "default": 0.3,
        "unit": "m/s",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Moving mass",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cush",
        "label": "Cushion energy capacity",
        "type": "number",
        "default": 0.5,
        "unit": "J",
        "min": 0,
        "max": 10000,
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
        "max": 20,
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
        "max": 8760,
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
      }
    ]
  },
  {
    "id": "disc-spring-stack-design",
    "name": "Disc Spring Stack Design",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "How many disc springs in series and in parallel give this force over this stroke?",
    "description": "Design of a disc (Belleville) spring stack from a single disc’s dimensions: the number of discs in series so that each deflects no more than a chosen share of its cone height over the stroke, the number in parallel to reach the force (Almen–László characteristic, as the disc spring tool), the stack force, free and solid heights, and the top inner-edge stress against an allowable.",
    "keywords": [
      "MAKEOS",
      "disc spring stack",
      "Belleville washer stack",
      "series and parallel",
      "spring stack design",
      "Almen-Laszlo",
      "preload stack"
    ],
    "fields": [
      {
        "key": "De",
        "label": "Outside diameter",
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
        "key": "Di",
        "label": "Inside diameter",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Thickness",
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
        "key": "h0",
        "label": "Cone height h₀ (unloaded, inside)",
        "type": "number",
        "default": 1.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 206,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Poisson’s ratio",
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
        "key": "F",
        "label": "Force required at the working stroke",
        "type": "number",
        "default": 12000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stroke",
        "label": "Working stroke of the stack",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "use",
        "label": "Largest deflection per disc (share of h₀)",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable stress at the top inner edge",
        "type": "number",
        "default": 2400,
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
    "id": "drilling-cycle-planner",
    "name": "Drilling Cycle Planner (Speed, Feed, Thrust, Power and Time)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What speed and feed do I run this drill at, will the machine and workholding take the thrust, and how long will the holes take?",
    "description": "Drilling plan for a batch of holes: spindle speed, cutting power, torque and approximate thrust (the same method as the drilling power tool), motor power and thrust against the limits, time per hole including the drill point, clearance, peck retracts and positioning, and the total time for all holes.",
    "keywords": [
      "MAKEOS",
      "drilling cycle",
      "peck drilling",
      "drilling thrust",
      "drilling time",
      "drilling power",
      "hole making"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Drill diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 80,
        "unit": "m/min",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.15,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc",
        "label": "Specific cutting force",
        "type": "number",
        "default": 2000,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "point",
        "label": "Point angle",
        "type": "number",
        "default": 118,
        "unit": "°",
        "min": 60,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Machine efficiency",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pavail",
        "label": "Spindle power available",
        "type": "number",
        "default": 7.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tlim",
        "label": "Thrust limit (workholding or part)",
        "type": "number",
        "default": 3000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_holes",
        "label": "Holes",
        "type": "heading"
      },
      {
        "key": "depth",
        "label": "Hole depth",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "holes",
        "label": "Number of holes",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 1,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "clear",
        "label": "Approach and breakthrough clearance",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "peck",
        "label": "Peck depth (0 = no pecking)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "retract",
        "label": "Time per peck retract",
        "type": "number",
        "default": 1.5,
        "unit": "s",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pos",
        "label": "Positioning time between holes",
        "type": "number",
        "default": 2,
        "unit": "s",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hydraulic-motor-drive",
    "name": "Hydraulic Motor Drive Sizing",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What motor displacement, flow and pump power does this hydraulic drive need for the load torque and speed?",
    "description": "Sizing a hydraulic motor drive through an optional gear reduction: motor torque and speed, the displacement needed at the available pressure difference with mechanical efficiency, the flow with volumetric efficiency, hydraulic and pump input power, and, for a chosen motor size, the actual pressure needed (using the same relations as the hydraulic motor tool).",
    "keywords": [
      "MAKEOS",
      "hydraulic motor sizing",
      "motor displacement",
      "hydraulic drive",
      "winch drive",
      "hydraulic flow",
      "pump power"
    ],
    "fields": [
      {
        "key": "TL",
        "label": "Load torque",
        "type": "number",
        "default": 2000,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nL",
        "label": "Load speed",
        "type": "number",
        "default": 40,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Reduction between motor and load (1 = direct)",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etaG",
        "label": "Gear efficiency",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pressure difference available",
        "type": "number",
        "default": 180,
        "unit": "bar",
        "min": 0.000001,
        "max": 700,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "em",
        "label": "Motor mechanical efficiency",
        "type": "number",
        "default": 92,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ev",
        "label": "Motor volumetric efficiency",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ep",
        "label": "Pump overall efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vc",
        "label": "Chosen motor displacement (0 = required)",
        "type": "number",
        "default": 0,
        "unit": "cm³/rev",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
