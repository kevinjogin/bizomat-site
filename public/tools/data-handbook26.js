// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook26) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "spur-gear-set-design",
    "name": "Spur Gear Set Design Check",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "Will this spur gear set carry the power for bending and pitting, and what face width does it really need?",
    "description": "One-pass design check of an external spur gear pair: geometry, pitch-line speed, torque and tangential load, contact ratio, undercut check, tooth bending stress (AGMA form with geometry factor J) and contact stress (Hertz with elastic and zone factors) against your allowables, with the face width each criterion requires.",
    "keywords": [
      "MAKEOS",
      "gear design",
      "spur gear set",
      "gear sizing",
      "bending and pitting",
      "face width",
      "gear safety factor"
    ],
    "fields": [
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power",
        "type": "number",
        "default": 7.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Pinion speed",
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
        "key": "Ko",
        "label": "Overload factor",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "KH",
        "label": "Load distribution factor",
        "type": "number",
        "default": 1.3,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kv",
        "label": "Dynamic factor (0 = Barth for cut gears)",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_geometry",
        "label": "Geometry",
        "type": "heading"
      },
      {
        "key": "z1",
        "label": "Pinion teeth",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 8,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Gear teeth",
        "type": "number",
        "default": 60,
        "unit": "",
        "min": 8,
        "max": 2000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Face width",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 14.5,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "J",
        "label": "Bending geometry factor J",
        "type": "number",
        "default": 0.32,
        "unit": "",
        "min": 0.1,
        "max": 0.7,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_materials",
        "label": "Materials",
        "type": "heading"
      },
      {
        "key": "E",
        "label": "Elastic modulus (both gears)",
        "type": "number",
        "default": 206,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
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
        "key": "sFP",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 300,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sHP",
        "label": "Allowable contact stress",
        "type": "number",
        "default": 1100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "reqF",
        "label": "Required bending safety factor",
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
        "key": "reqH",
        "label": "Required contact safety factor",
        "type": "number",
        "default": 1.2,
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
    "id": "compression-spring-designer",
    "name": "Compression Spring Designer (Two Working Points)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "What wire size, coils and free length make a compression spring that gives these two loads at these two lengths?",
    "description": "Synthesis of a round-wire helical compression spring from two working points: the rate and free length they require, the wire diameter that keeps the Wahl-corrected stress at the highest load within your allowable for the chosen mean diameter, active and total coils for the end type, solid length, clash allowance, stress at solid and buckling ratio, as a ready specification.",
    "keywords": [
      "MAKEOS",
      "spring design",
      "compression spring designer",
      "spring synthesis",
      "wire diameter",
      "active coils",
      "free length"
    ],
    "fields": [
      {
        "key": "h_working_points",
        "label": "Working points",
        "type": "heading"
      },
      {
        "key": "F1",
        "label": "Load at the first point",
        "type": "number",
        "default": 100,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L1",
        "label": "Length at the first point",
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
        "key": "F2",
        "label": "Load at the second (maximum) point",
        "type": "number",
        "default": 250,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "Length at the second point",
        "type": "number",
        "default": 45,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_design_choices",
        "label": "Design choices",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tau",
        "label": "Allowable shear stress at the maximum load",
        "type": "number",
        "default": 550,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 79.3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "Ends",
        "type": "select",
        "default": "cg",
        "options": [
          [
            "cg",
            "Closed and ground"
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
            "Plain"
          ]
        ]
      },
      {
        "key": "clash",
        "label": "Clash allowance (share of the deflection)",
        "type": "number",
        "default": 15,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shrink-fit-design",
    "name": "Shrink or Press Fit Design from Required Torque",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What interference does a hub need to transmit this torque and thrust, will the hub survive it, and how hot must it be to assemble?",
    "description": "Design of a cylindrical interference fit working backwards from the duty: the interface pressure needed for the torque and axial load with a safety factor, the diametral interference that produces it (Lamé thick-cylinder theory, solid or hollow shaft), hub bore stresses with a von Mises check, the press-in force, and the hub heating temperature for a shrink fit with assembly clearance.",
    "keywords": [
      "MAKEOS",
      "shrink fit design",
      "interference fit",
      "press fit",
      "hub torque",
      "Lamé",
      "shrink fit temperature"
    ],
    "fields": [
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "T",
        "label": "Torque to transmit",
        "type": "number",
        "default": 500,
        "unit": "N·m",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fa",
        "label": "Axial load to transmit",
        "type": "number",
        "default": 0,
        "unit": "kN",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Safety factor on slip",
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
        "key": "h_geometry_and_materials",
        "label": "Geometry and materials",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Interface diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "di",
        "label": "Shaft bore (0 = solid)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Hub outside diameter",
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
        "key": "L",
        "label": "Engaged length",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Friction coefficient at the interface",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Eh",
        "label": "Hub modulus",
        "type": "number",
        "default": 206,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nuh",
        "label": "Hub Poisson’s ratio",
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
        "key": "Es",
        "label": "Shaft modulus",
        "type": "number",
        "default": 206,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nus",
        "label": "Shaft Poisson’s ratio",
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
        "key": "Sy",
        "label": "Hub yield strength",
        "type": "number",
        "default": 350,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_assembly",
        "label": "Assembly",
        "type": "heading"
      },
      {
        "key": "alpha",
        "label": "Hub expansion coefficient",
        "type": "number",
        "default": 11.7,
        "unit": "µm/m·K",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "clear",
        "label": "Assembly clearance wanted (diametral)",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ta",
        "label": "Shaft (ambient) temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -50,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bolted-joint-design-check",
    "name": "Bolted Joint Design Check (Preload, Separation, Proof and Fatigue)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Does this bolt size and tightening torque keep the joint closed and the bolt safe under the working load?",
    "description": "Complete check of a preloaded tension joint: stress area, bolt and member (frustum) stiffness, joint constant, preload and tightening torque from the target share of proof load, preload scatter from the nut factor tolerance, and factors against separation, exceeding proof load and fatigue (Goodman) under a load cycling from zero to the working value.",
    "keywords": [
      "MAKEOS",
      "bolted joint design",
      "bolt preload",
      "tightening torque",
      "joint separation",
      "bolt fatigue",
      "nut factor scatter"
    ],
    "fields": [
      {
        "key": "h_bolt",
        "label": "Bolt",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Nominal diameter",
        "type": "number",
        "default": 12,
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
        "default": 1.75,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sp",
        "label": "Proof strength",
        "type": "number",
        "default": 600,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sut",
        "label": "Tensile strength",
        "type": "number",
        "default": 830,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Se",
        "label": "Endurance limit of the threaded bolt",
        "type": "number",
        "default": 129,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Eb",
        "label": "Bolt modulus",
        "type": "number",
        "default": 207,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_joint",
        "label": "Joint",
        "type": "heading"
      },
      {
        "key": "grip",
        "label": "Grip length",
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
        "key": "Lt",
        "label": "Threaded length within the grip",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Em",
        "label": "Member modulus",
        "type": "number",
        "default": 207,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_tightening_and_load",
        "label": "Tightening and load",
        "type": "heading"
      },
      {
        "key": "pct",
        "label": "Target preload (share of proof load)",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 10,
        "max": 95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Nut factor",
        "type": "number",
        "default": 0.2,
        "unit": "",
        "min": 0.05,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sc",
        "label": "Nut factor scatter (±)",
        "type": "number",
        "default": 25,
        "unit": "%",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pext",
        "label": "Working tension load per bolt",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required factor (separation and fatigue)",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "turning-cost-per-part",
    "name": "Turning Cycle Time and Cost per Part with Tool Life",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What does each turned part cost at this speed, and how much would the minimum-cost speed save?",
    "description": "Cycle time and cost per part for a turning operation, combining spindle speed, cutting time, Taylor tool life, tool edges and tool changes per part, handling, set-up spread over the batch and the machine rate, then comparing the cost and time at the minimum-cost and maximum-production cutting speeds.",
    "keywords": [
      "MAKEOS",
      "cost per part",
      "machining cost",
      "tool life",
      "Taylor",
      "minimum cost speed",
      "cycle time"
    ],
    "fields": [
      {
        "key": "h_cut",
        "label": "Cut",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Work diameter",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length of cut per pass",
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
        "key": "appr",
        "label": "Approach and overrun",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "passes",
        "label": "Number of passes",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
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
        "key": "h_tool",
        "label": "Tool",
        "type": "heading"
      },
      {
        "key": "nT",
        "label": "Taylor exponent n",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0.05,
        "max": 0.95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ct",
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
        "key": "edge",
        "label": "Cost per cutting edge",
        "type": "number",
        "default": 6,
        "unit": "$",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tct",
        "label": "Tool change time per edge",
        "type": "number",
        "default": 1,
        "unit": "min",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_costs",
        "label": "Costs",
        "type": "heading"
      },
      {
        "key": "rate",
        "label": "Machine and labour rate",
        "type": "number",
        "default": 90,
        "unit": "$/h",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "load",
        "label": "Load and unload time per part",
        "type": "number",
        "default": 0.5,
        "unit": "min",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "setup",
        "label": "Set-up time per batch",
        "type": "number",
        "default": 45,
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
    "id": "press-die-tonnage",
    "name": "Press Tonnage for a Compound or Progressive Die",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What total press force does this die need for blanking, piercing, bending and drawing together, and is the press big enough?",
    "description": "Total press load for a compound or progressive die stage by summing the handbook forces for blanking and notching (perimeter × thickness × shear strength), piercing a number of holes, bending (L T² × UTS ÷ die opening) and a first draw (π d T × UTS), plus stripping force and a safety margin, with the cutting energy per stroke and the press capacity check.",
    "keywords": [
      "MAKEOS",
      "press tonnage",
      "progressive die",
      "blanking force",
      "piercing force",
      "stripping force",
      "press selection"
    ],
    "fields": [
      {
        "key": "t",
        "label": "Material thickness",
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
        "key": "tau",
        "label": "Shear strength",
        "type": "number",
        "default": 350,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
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
        "key": "h_operations_0_none_",
        "label": "Operations (0 = none)",
        "type": "heading"
      },
      {
        "key": "blank",
        "label": "Blanking and notching perimeter",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "holes",
        "label": "Number of holes pierced",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 0,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "hd",
        "label": "Hole diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bendL",
        "label": "Length of bends",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Bend die opening",
        "type": "number",
        "default": 16,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "drawd",
        "label": "Mean diameter of a first draw",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_allowances",
        "label": "Allowances",
        "type": "heading"
      },
      {
        "key": "strip",
        "label": "Stripping force (share of cutting force)",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Press safety margin",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pen",
        "label": "Penetration at fracture (share of thickness)",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Press capacity",
        "type": "number",
        "default": 600,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hydraulic-cylinder-sizing",
    "name": "Hydraulic Cylinder Sizing (Bore, Rod Buckling, Flow, Power, Pipes)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What bore and rod does this cylinder need, how much flow and power does it take, and what pipe size suits it?",
    "description": "Sizing a double-acting hydraulic cylinder from the duty: minimum bore for the push force at system pressure, rod diameter for Euler buckling with a mounting factor and safety factor, the largest rod that still gives the pull force, extend and retract flows for the speeds, pump input power and pipe bores for the chosen fluid velocities.",
    "keywords": [
      "MAKEOS",
      "hydraulic cylinder sizing",
      "rod buckling",
      "cylinder bore",
      "hydraulic flow",
      "pump power",
      "pipe size"
    ],
    "fields": [
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "Fpush",
        "label": "Push (extend) force",
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
        "key": "Fpull",
        "label": "Pull (retract) force",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "System pressure at the cylinder",
        "type": "number",
        "default": 160,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vext",
        "label": "Extend speed",
        "type": "number",
        "default": 100,
        "unit": "mm/s",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vret",
        "label": "Retract speed",
        "type": "number",
        "default": 150,
        "unit": "mm/s",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stroke",
        "label": "Stroke",
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
        "key": "h_cylinder",
        "label": "Cylinder",
        "type": "heading"
      },
      {
        "key": "bore",
        "label": "Chosen bore (0 = minimum)",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lb",
        "label": "Buckling length (fully extended)",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kf",
        "label": "Effective length factor for the mounting",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.5,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nb",
        "label": "Safety factor on buckling",
        "type": "number",
        "default": 3.5,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Rod modulus",
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
        "key": "h_power_unit",
        "label": "Power unit",
        "type": "heading"
      },
      {
        "key": "eta",
        "label": "Pump overall efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vp",
        "label": "Pressure line velocity",
        "type": "number",
        "default": 5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 15,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vr",
        "label": "Return line velocity",
        "type": "number",
        "default": 3,
        "unit": "m/s",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shaft-design-check",
    "name": "Shaft Design: Strength, Twist and Critical Speed",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What shaft diameter satisfies strength, torsional stiffness and critical speed together for this drive?",
    "description": "Shaft sizing that checks three criteria at once: diameter for combined bending and torsion with shock factors (maximum-shear theory, with the handbook’s 75% working stress allowance for a keyway), diameter for a twist limit per metre, and diameter that keeps the first critical speed of the shaft with a central mass a margin above running speed — reporting which governs.",
    "keywords": [
      "MAKEOS",
      "shaft design",
      "shaft diameter",
      "critical speed",
      "torsional stiffness",
      "keyway",
      "line shaft"
    ],
    "fields": [
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power",
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
        "key": "n",
        "label": "Speed",
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
        "key": "M",
        "label": "Maximum bending moment",
        "type": "number",
        "default": 150,
        "unit": "N·m",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Km",
        "label": "Shock factor, bending",
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
        "key": "Kt",
        "label": "Shock factor, torsion",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_material_and_limits",
        "label": "Material and limits",
        "type": "heading"
      },
      {
        "key": "tau",
        "label": "Allowable shear stress",
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
        "key": "key",
        "label": "Keyway at the critical section",
        "type": "select",
        "default": "yes",
        "options": [
          [
            "yes",
            "Yes (use 75% of the allowable)"
          ],
          [
            "no",
            "No"
          ]
        ]
      },
      {
        "key": "twist",
        "label": "Twist limit",
        "type": "number",
        "default": 0.25,
        "unit": "°/m",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 79.3,
        "unit": "GPa",
        "min": 0.000001,
        "max": 300,
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
        "max": 1000,
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
        "key": "h_critical_speed",
        "label": "Critical speed",
        "type": "heading"
      },
      {
        "key": "L",
        "label": "Bearing span",
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
        "key": "mass",
        "label": "Central mass (pulley, rotor)",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Required critical ÷ running speed",
        "type": "number",
        "default": 1.25,
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
    "id": "milling-cut-planner",
    "name": "Milling Cut Planner (Speed, Thinned Feed, Power and Torque)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What spindle speed and feed should I program for this milling cut, and will the machine have the power?",
    "description": "Milling set-up from cutter and cut data: spindle speed from cutting speed (capped at the spindle limit), feed per tooth raised to keep the target maximum chip thickness at light radial engagement, table feed and removal rate, average chip thickness and specific cutting force (Kienzle), cutting power and torque against the machine’s power, and the feed that would use full power.",
    "keywords": [
      "MAKEOS",
      "milling feeds and speeds",
      "chip thinning",
      "milling power",
      "spindle torque",
      "feed rate",
      "material removal rate"
    ],
    "fields": [
      {
        "key": "h_cutter_and_cut",
        "label": "Cutter and cut",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Cutter diameter",
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
        "key": "z",
        "label": "Number of teeth",
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
        "key": "Vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 180,
        "unit": "m/min",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hex",
        "label": "Target maximum chip thickness",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ae",
        "label": "Radial engagement",
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
        "key": "ap",
        "label": "Axial depth of cut",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kappa",
        "label": "Lead (entering) angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 10,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_material",
        "label": "Material",
        "type": "heading"
      },
      {
        "key": "kc1",
        "label": "Specific cutting force kc1.1",
        "type": "number",
        "default": 1700,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mc",
        "label": "Kienzle exponent mc",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0,
        "max": 0.6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_machine",
        "label": "Machine",
        "type": "heading"
      },
      {
        "key": "nmax",
        "label": "Maximum spindle speed",
        "type": "number",
        "default": 12000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pmax",
        "label": "Spindle power",
        "type": "number",
        "default": 11,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Spindle efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
