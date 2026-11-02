// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook59) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "buttress-thread-inspection",
    "name": "Buttress Thread Wire Inspection (7°/45° Form, Wire Size, Readings, Pitch Diameter)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For this 7°/45° buttress thread, what are its diameters, what wire size and reading over wires should I use, and does my measured thread pass?",
    "description": "Three-wire inspection of an external 7°/45° buttress thread: the basic form and the internal and external major, pitch and minor diameters with any allowance (as the buttress thread tool), the wire size that touches at the pitch line and the reading over wires at the largest and smallest allowed pitch diameter (as the taper and buttress three-wire tool), and the pitch diameter from your measured reading against your tolerance.",
    "keywords": [
      "MAKEOS",
      "buttress thread",
      "7/45 buttress",
      "three-wire",
      "pitch diameter",
      "thread inspection",
      "wire size"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Basic major diameter",
        "type": "number",
        "default": 50.8,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Pitch",
        "type": "number",
        "default": 4.233,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Allowance on the external thread",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Pitch diameter tolerance (below the largest)",
        "type": "number",
        "default": 0.12,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_wires",
        "label": "Wires",
        "type": "heading"
      },
      {
        "key": "W",
        "label": "Wire diameter (0 = pitch-line size)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mmeas",
        "label": "Measured reading over wires",
        "type": "number",
        "default": 52.65,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "unified-tapped-hole-check",
    "name": "Unified Tapped Hole Check (Tap Drill, Thread Percentage, Length of Engagement)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For a Unified inch screw in a tapped hole, what drill do I need, and is the thread long enough for the hole material to be as strong as the screw?",
    "description": "Plan and check of a tapped hole for a Unified inch thread: the basic pitch and minor diameters and tensile stress area (as the Unified thread tool), the tap drill for your percentage of thread and tap type (as the tap drill tool), and the length of engagement needed so the internal thread does not strip before the screw breaks, with the strength ratio of the screw and the tapped material (as the thread engagement tool), against the engagement you have.",
    "keywords": [
      "MAKEOS",
      "tapped hole",
      "tap drill",
      "UNC",
      "length of engagement",
      "thread stripping",
      "percentage of thread"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Nominal (major) diameter",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Threads per inch",
        "type": "number",
        "default": 13,
        "unit": "TPI",
        "min": 0.000001,
        "max": 100,
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
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tap",
        "label": "Tap type",
        "type": "select",
        "default": "cut",
        "options": [
          [
            "cut",
            "Cutting tap"
          ],
          [
            "form",
            "Forming tap"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Length of engagement available",
        "type": "number",
        "default": 1.125,
        "unit": "in",
        "min": 0.000001,
        "max": 50,
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
        "key": "Sub",
        "label": "Tensile strength of the screw",
        "type": "number",
        "default": 830,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
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
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "weldment-cost-estimate",
    "name": "Weldment Cost Estimate (Weld Metal, Arc Time, Labour, Filler and Gas by Run)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "For a fabrication with several fillet welds of different sizes and lengths, how much weld metal, arc time and cost does it take, and does it fit my quoted price?",
    "description": "Cost estimate of all the fillet welds on a weldment: for each weld run the weld metal per metre from the leg size and excess, then arc time from the deposition rate, paid time from the operating factor, and labour, filler and shielding gas costs (as the weld cost tool, run by run), summed with any fit-up and handling time, against the price you have quoted for the welding.",
    "keywords": [
      "MAKEOS",
      "weld cost",
      "fillet weld",
      "arc time",
      "deposition rate",
      "operating factor",
      "fabrication quote"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of weld runs",
        "type": "number",
        "default": 3,
        "unit": "runs",
        "min": 1,
        "max": 4,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_weld_run_1",
        "label": "Weld run 1",
        "type": "heading"
      },
      {
        "key": "leg1",
        "label": "Fillet leg",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "len1",
        "label": "Total length",
        "type": "number",
        "default": 2.4,
        "unit": "m",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_weld_run_2",
        "label": "Weld run 2",
        "type": "heading"
      },
      {
        "key": "leg2",
        "label": "Fillet leg",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "len2",
        "label": "Total length",
        "type": "number",
        "default": 1.2,
        "unit": "m",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_weld_run_3",
        "label": "Weld run 3",
        "type": "heading"
      },
      {
        "key": "leg3",
        "label": "Fillet leg",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "len3",
        "label": "Total length",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_weld_run_4",
        "label": "Weld run 4",
        "type": "heading"
      },
      {
        "key": "leg4",
        "label": "Fillet leg",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "len4",
        "label": "Total length",
        "type": "number",
        "default": 0.5,
        "unit": "m",
        "min": 0,
        "max": 10000,
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
        "key": "excess",
        "label": "Excess weld metal (convexity, spatter)",
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
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "of",
        "label": "Operating factor (arc-on share of paid time)",
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
        "label": "Filler deposition efficiency",
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
        "label": "Labour and overhead rate",
        "type": "number",
        "default": 95,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wire",
        "label": "Filler price",
        "type": "number",
        "default": 6,
        "unit": "$/kg",
        "min": 0,
        "max": 1000,
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
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gasPrice",
        "label": "Gas price",
        "type": "number",
        "default": 12,
        "unit": "$/m³",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fit",
        "label": "Fit-up and handling time",
        "type": "number",
        "default": 1.5,
        "unit": "h",
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
        "default": 300,
        "unit": "$",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "brazed-sleeve-joint-plan",
    "name": "Brazed Sleeve Joint Plan (Overlap, Joint and Tube Capacity, Clearance, Filler)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "For a tube brazed or soldered into a sleeve, how much overlap do I need, does the joint carry my load, is the clearance right and how much filler does it take?",
    "description": "Plan of a brazed or soldered sleeve (socket) joint on a tube: the overlap that makes the joint as strong as the tube wall with a safety factor (as the lap joint length tool, with the joint width taken as the tube circumference), the joint and tube capacities against your load, the diametral clearance against the filler’s range, and the volume and mass of filler to fill the gap.",
    "keywords": [
      "MAKEOS",
      "brazed joint",
      "soldered joint",
      "sleeve joint",
      "overlap length",
      "joint clearance",
      "filler metal"
    ],
    "fields": [
      {
        "key": "OD",
        "label": "Tube outside diameter",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Tube wall thickness",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sm",
        "label": "Tube material tensile strength",
        "type": "number",
        "default": 210,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tau",
        "label": "Shear strength of the filler joint",
        "type": "number",
        "default": 70,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "factor",
        "label": "Safety factor on the overlap",
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
        "key": "L",
        "label": "Overlap (socket depth)",
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
        "key": "load",
        "label": "Axial load on the joint (0 = none)",
        "type": "number",
        "default": 8000,
        "unit": "N",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_clearance_and_filler",
        "label": "Clearance and filler",
        "type": "heading"
      },
      {
        "key": "gap",
        "label": "Diametral clearance",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gapMin",
        "label": "Smallest clearance for the filler",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gapMax",
        "label": "Largest clearance for the filler",
        "type": "number",
        "default": 0.25,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoF",
        "label": "Filler density",
        "type": "number",
        "default": 9,
        "unit": "g/cm³",
        "min": 0.000001,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-train-output-check",
    "name": "Gear Train Output Check (Ratio, Output Speed and Torque, Output Shaft Stress)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Does this compound gear train give the output speed and torque the job needs, and is the output shaft big enough for the torque?",
    "description": "Check of a simple or compound spur gear train against its duty: the overall ratio from up to four meshes, the output speed, direction and torque with the mesh efficiency (as the gear train tool), compared with the output speed and torque you need, and the torsional shear stress in the output shaft and the diameter needed for your allowable stress.",
    "keywords": [
      "MAKEOS",
      "gear train",
      "compound gears",
      "gear ratio",
      "output torque",
      "output speed",
      "shaft torsion"
    ],
    "fields": [
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
        "key": "Tin",
        "label": "Input torque",
        "type": "number",
        "default": 20,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Efficiency per mesh",
        "type": "number",
        "default": 98,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_mesh_1",
        "label": "Mesh 1",
        "type": "heading"
      },
      {
        "key": "a1",
        "label": "Driver teeth (0 = unused)",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b1",
        "label": "Driven teeth (0 = unused)",
        "type": "number",
        "default": 60,
        "unit": "teeth",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_mesh_2",
        "label": "Mesh 2",
        "type": "heading"
      },
      {
        "key": "a2",
        "label": "Driver teeth (0 = unused)",
        "type": "number",
        "default": 18,
        "unit": "teeth",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b2",
        "label": "Driven teeth (0 = unused)",
        "type": "number",
        "default": 54,
        "unit": "teeth",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_mesh_3",
        "label": "Mesh 3",
        "type": "heading"
      },
      {
        "key": "a3",
        "label": "Driver teeth (0 = unused)",
        "type": "number",
        "default": 0,
        "unit": "teeth",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b3",
        "label": "Driven teeth (0 = unused)",
        "type": "number",
        "default": 0,
        "unit": "teeth",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_mesh_4",
        "label": "Mesh 4",
        "type": "heading"
      },
      {
        "key": "a4",
        "label": "Driver teeth (0 = unused)",
        "type": "number",
        "default": 0,
        "unit": "teeth",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b4",
        "label": "Driven teeth (0 = unused)",
        "type": "number",
        "default": 0,
        "unit": "teeth",
        "min": 0,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_duty_and_output_shaft",
        "label": "Duty and output shaft",
        "type": "heading"
      },
      {
        "key": "nreq",
        "label": "Output speed required",
        "type": "number",
        "default": 160,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Speed tolerance",
        "type": "number",
        "default": 3,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Treq",
        "label": "Output torque required",
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
        "key": "d",
        "label": "Output shaft diameter",
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
        "key": "tauA",
        "label": "Allowable shaft shear stress",
        "type": "number",
        "default": 40,
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
    "id": "linear-move-drive-check",
    "name": "Linear Move Drive Check (Move Profile, Screw Torque, RMS Torque, Cycle Time)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a carriage moved back and forth by a motor and screw, how long does each move take, what speed and torque does the motor need, and does it meet my cycle time?",
    "description": "Check of a horizontal screw-driven (or belt-driven) linear axis: the trapezoidal or triangular move profile, move time, peak speed and acceleration force (as the move profile tool), the friction force, the motor speed and the accelerating, running and decelerating torques through the screw lead and efficiency, the RMS torque over an out-and-back cycle with dwells, against the motor’s speed, peak and continuous torque and your cycle time.",
    "keywords": [
      "MAKEOS",
      "linear axis",
      "move profile",
      "servo sizing",
      "ball screw torque",
      "RMS torque",
      "cycle time"
    ],
    "fields": [
      {
        "key": "distance",
        "label": "Move distance",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmax",
        "label": "Speed limit",
        "type": "number",
        "default": 1000,
        "unit": "mm/s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "accel",
        "label": "Acceleration",
        "type": "number",
        "default": 5000,
        "unit": "mm/s²",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Moving mass",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Friction coefficient of the guides",
        "type": "number",
        "default": 0.1,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dwell",
        "label": "Dwell at each end",
        "type": "number",
        "default": 0.5,
        "unit": "s",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cycleReq",
        "label": "Out-and-back cycle time required",
        "type": "number",
        "default": 2.5,
        "unit": "s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_drive_and_motor",
        "label": "Drive and motor",
        "type": "heading"
      },
      {
        "key": "lead",
        "label": "Travel per motor revolution (screw lead or pulley circumference)",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "effD",
        "label": "Drive efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nMax",
        "label": "Motor maximum speed",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tpk",
        "label": "Motor peak torque",
        "type": "number",
        "default": 1.5,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tcont",
        "label": "Motor continuous torque",
        "type": "number",
        "default": 0.5,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "plate-lift-plan",
    "name": "Plate Lift Plan (Shape Area, Mass, Centre of Gravity, Two-Point Lift Loads)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a flat plate of any straight-sided shape lifted from two points, what does it weigh, where is its centre of gravity, and how much load does each lift point take?",
    "description": "Lift plan for a cut plate or flat panel: the area, perimeter and centroid of the outline from its corner coordinates (as the polygon area tool), the mass from thickness and density, and the load on each of two lift points from where the centre of gravity falls along the line joining them, with the sideways offset that makes the plate hang tilted, against the working load limit of each lift point.",
    "keywords": [
      "MAKEOS",
      "lift plan",
      "centre of gravity",
      "plate weight",
      "lifting points",
      "polygon area",
      "load share"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of corners",
        "type": "number",
        "default": 5,
        "unit": "corners",
        "min": 3,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_corner_1",
        "label": "Corner 1",
        "type": "heading"
      },
      {
        "key": "x1",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_2",
        "label": "Corner 2",
        "type": "heading"
      },
      {
        "key": "x2",
        "label": "X",
        "type": "number",
        "default": 2400,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_3",
        "label": "Corner 3",
        "type": "heading"
      },
      {
        "key": "x3",
        "label": "X",
        "type": "number",
        "default": 2400,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Y",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_4",
        "label": "Corner 4",
        "type": "heading"
      },
      {
        "key": "x4",
        "label": "X",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y4",
        "label": "Y",
        "type": "number",
        "default": 1800,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_5",
        "label": "Corner 5",
        "type": "heading"
      },
      {
        "key": "x5",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y5",
        "label": "Y",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_6",
        "label": "Corner 6",
        "type": "heading"
      },
      {
        "key": "x6",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y6",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_7",
        "label": "Corner 7",
        "type": "heading"
      },
      {
        "key": "x7",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y7",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_corner_8",
        "label": "Corner 8",
        "type": "heading"
      },
      {
        "key": "x8",
        "label": "X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y8",
        "label": "Y",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_plate_and_lift_points",
        "label": "Plate and lift points",
        "type": "heading"
      },
      {
        "key": "t",
        "label": "Plate thickness",
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
        "key": "rho",
        "label": "Density",
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
        "key": "xA",
        "label": "Lift point A X",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "yA",
        "label": "Lift point A Y",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "xB",
        "label": "Lift point B X",
        "type": "number",
        "default": 1900,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "yB",
        "label": "Lift point B Y",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wll",
        "label": "Working load limit of each lift point",
        "type": "number",
        "default": 4,
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
    "id": "tapered-pad-footing-check",
    "name": "Tapered Pad Footing Check (Prismoidal Volume, Self-Weight, Bearing Pressure, Concrete Order)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For a column pad footing with a tapered top, how much concrete does it take, what does it weigh, and is the bearing pressure under it within the ground’s allowable pressure?",
    "description": "Check of a square or rectangular pad footing with a straight base block and a tapered (frustum) top: the volume of the taper by the prismoidal formula (as the prismoidal volume tool) plus the base block, the self-weight, the bearing pressure under the base from the column load and self-weight against your allowable ground pressure, the base area needed, and the concrete to order with a waste allowance.",
    "keywords": [
      "MAKEOS",
      "pad footing",
      "prismoidal formula",
      "bearing pressure",
      "concrete volume",
      "machine base",
      "foundation"
    ],
    "fields": [
      {
        "key": "a1",
        "label": "Base length",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b1",
        "label": "Base width",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hb",
        "label": "Depth of the straight base block",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Top length (at the column)",
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
        "key": "b2",
        "label": "Top width (at the column)",
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
        "key": "h",
        "label": "Height of the tapered part",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_loads_and_ground",
        "label": "Loads and ground",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Column load on the footing",
        "type": "number",
        "default": 300,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoC",
        "label": "Concrete density",
        "type": "number",
        "default": 2400,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qa",
        "label": "Allowable bearing pressure of the ground",
        "type": "number",
        "default": 250,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "waste",
        "label": "Waste allowance on the order",
        "type": "number",
        "default": 5,
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
    "id": "bolt-circle-pin-check",
    "name": "Bolt Circle Pin Check (Pitch Circle from Plugs, Readings at the Limits, Decision)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "For a ring of equally spaced holes measured over plugs, what pitch circle diameter does my reading give, what readings should I expect at the limits, and does it pass?",
    "description": "Inspection of a bolt circle (pitch circle) of equally spaced holes with close-fitting plugs: the pitch circle diameter from a micrometer or caliper reading over two alternate or adjacent plugs and the size across opposite plugs (as the bolt circle over plugs tool), the readings that correspond to the nominal pitch circle and its tolerance limits, and the accept or reject decision.",
    "keywords": [
      "MAKEOS",
      "bolt circle",
      "pitch circle diameter",
      "measurement over plugs",
      "hole pattern",
      "flange inspection",
      "PCD"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of holes",
        "type": "number",
        "default": 6,
        "unit": "holes",
        "min": 3,
        "max": 360,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d",
        "label": "Plug (hole) diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mode",
        "label": "Measured over",
        "type": "select",
        "default": "alt",
        "options": [
          [
            "alt",
            "Alternate plugs (y)"
          ],
          [
            "adj",
            "Adjacent plugs (c)"
          ]
        ]
      },
      {
        "key": "m",
        "label": "Measurement over the plugs",
        "type": "number",
        "default": 96.62,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pcd",
        "label": "Nominal pitch circle diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "PCD tolerance (±)",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
