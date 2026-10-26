// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook57) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "acme-lead-screw-check",
    "name": "Trapezoidal Lead Screw Check (Thread Size, Torque, Root Stress, Nut Pressure)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "Is this trapezoidal lead screw and nut right for the load: what torque does it need, will it hold the load without backdriving, and are the root stress and nut bearing pressure acceptable?",
    "description": "Check of a metric trapezoidal lead screw and its nut: pitch and root diameters, lead and root area (as the Acme and trapezoidal thread tool), raising and lowering torque with collar friction, efficiency and self-locking (as the power screw torque tool), the direct stress at the root, and the bearing pressure on the nut flanks from the number of threads engaged, against your allowable stress and nut pressure.",
    "keywords": [
      "MAKEOS",
      "lead screw",
      "trapezoidal thread",
      "Acme",
      "nut pressure",
      "screw torque",
      "self-locking"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nominal major diameter",
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
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "starts",
        "label": "Number of starts",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "F",
        "label": "Axial load",
        "type": "number",
        "default": 10000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
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
        "label": "Mean collar diameter (0 = thrust bearing)",
        "type": "number",
        "default": 30,
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
        "key": "h_nut_and_limits",
        "label": "Nut and limits",
        "type": "heading"
      },
      {
        "key": "Lnut",
        "label": "Nut length",
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
        "key": "pAllow",
        "label": "Allowable nut bearing pressure",
        "type": "number",
        "default": 10,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sAllow",
        "label": "Allowable screw root stress",
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
  },
  {
    "id": "gear-shaft-sizing",
    "name": "Overhung Gear Shaft Sizing (Gear Forces, Bending, Shaft Diameter, Stress)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a spur or helical gear overhung on a shaft, what forces does the gear put on the shaft, what diameter does the shaft need, and is my chosen diameter within stress?",
    "description": "Sizing of a shaft carrying an overhung spur or helical gear: tangential, radial and axial gear forces from the power, speed and pitch diameter (as the gear forces tool), the resultant bending moment at the bearing from the overhang and the axial-force couple, the diameter needed by the ASME-style shock-factor method with a keyway allowance (as the shaft diameter tool), and the combined axial, bending and torsional stress and safety factor of the chosen diameter (as the combined shaft stress tool).",
    "keywords": [
      "MAKEOS",
      "shaft sizing",
      "gear forces",
      "overhung gear",
      "bending moment",
      "shaft diameter",
      "helical gear"
    ],
    "fields": [
      {
        "key": "kW",
        "label": "Power transmitted",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Shaft speed",
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
        "key": "dg",
        "label": "Gear pitch diameter",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alphan",
        "label": "Normal pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 10,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Helix angle (0 = spur)",
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
        "key": "a",
        "label": "Overhang (bearing to gear centre)",
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
        "key": "h_shaft",
        "label": "Shaft",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Shaft diameter at the bearing",
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
        "key": "Km",
        "label": "Shock and fatigue factor, bending",
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
        "label": "Shock and fatigue factor, torsion",
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
        "key": "tauA",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "keyway",
        "label": "Keyway at the section",
        "type": "select",
        "default": "yes",
        "options": [
          [
            "yes",
            "Yes (allowable × 0.75)"
          ],
          [
            "no",
            "No"
          ]
        ]
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 350,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required safety factor on yield",
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
    "id": "face-milling-power-plan",
    "name": "Face Milling Power Plan (Teeth, Chip Thickness, kc, Spindle Power)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How many teeth should my face mill have for this cut, what specific cutting force applies at the actual chip thickness, and does the spindle have the power?",
    "description": "Plan for a face milling cut: the number of teeth for the teeth wanted in the cut (as the milling cutter teeth tool), spindle speed and table feed, the engagement angle and mean chip thickness and the specific cutting force corrected for it (as the chip thickness and kc tool), and metal removal rate, cutting and motor power and torque (as the milling power tool), against the spindle power.",
    "keywords": [
      "MAKEOS",
      "face milling",
      "cutting power",
      "chip thickness",
      "specific cutting force",
      "teeth in cut",
      "spindle power"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Cutter diameter",
        "type": "number",
        "default": 125,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Width of cut",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Depth of cut",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "zc",
        "label": "Teeth wanted in the cut",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "zUse",
        "label": "Teeth on the cutter (0 = suggested)",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": 0,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "vc",
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
        "key": "fz",
        "label": "Feed per tooth",
        "type": "number",
        "default": 0.15,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
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
        "key": "kc1",
        "label": "kc1.1 (specific force at 1 mm chip)",
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
        "label": "Exponent mc",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rake",
        "label": "Effective rake angle",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -30,
        "max": 30,
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
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pavail",
        "label": "Available spindle power",
        "type": "number",
        "default": 15,
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
    "id": "ballscrew-duty-life",
    "name": "Ball Screw Life over a Duty Cycle (Mean Load, Mean Speed, Life)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Over my machine’s duty cycle of different loads and speeds, what mean load and speed does the ball screw see, and how long will it last?",
    "description": "Life of a ball screw working through a duty cycle of up to four load–speed steps: the time-weighted mean speed and the cubic mean load (as the bearing duty cycle tool, ball exponent), the rated life in revolutions and hours at that mean load with the load factor, and the travel in kilometres (as the ball screw life tool), against the life you need.",
    "keywords": [
      "MAKEOS",
      "ball screw life",
      "duty cycle",
      "mean load",
      "cubic mean",
      "L10 life",
      "linear axis"
    ],
    "fields": [
      {
        "key": "Ca",
        "label": "Dynamic load rating Ca",
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
        "key": "fw",
        "label": "Load factor fw",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lead",
        "label": "Lead",
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
        "key": "req",
        "label": "Required life",
        "type": "number",
        "default": 8000,
        "unit": "h",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_step_1",
        "label": "Step 1",
        "type": "heading"
      },
      {
        "key": "P1",
        "label": "Axial load",
        "type": "number",
        "default": 4,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t1",
        "label": "Share of time",
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
        "key": "h_step_2",
        "label": "Step 2",
        "type": "heading"
      },
      {
        "key": "P2",
        "label": "Axial load",
        "type": "number",
        "default": 8,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n2",
        "label": "Speed",
        "type": "number",
        "default": 750,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2",
        "label": "Share of time",
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
        "key": "h_step_3",
        "label": "Step 3",
        "type": "heading"
      },
      {
        "key": "P3",
        "label": "Axial load",
        "type": "number",
        "default": 2,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n3",
        "label": "Speed",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t3",
        "label": "Share of time",
        "type": "number",
        "default": 30,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_step_4",
        "label": "Step 4",
        "type": "heading"
      },
      {
        "key": "P4",
        "label": "Axial load",
        "type": "number",
        "default": 0,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n4",
        "label": "Speed",
        "type": "number",
        "default": 0,
        "unit": "rpm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t4",
        "label": "Share of time",
        "type": "number",
        "default": 0,
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
    "id": "turn-of-nut-fatigue-check",
    "name": "Turn-of-Nut Preload and Bolt Fatigue Check",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What preload does this nut rotation give in my joint, is it within the bolt’s proof load, and will the bolt survive the cyclic external load?",
    "description": "Check of a bolt tightened by the turn-of-nut method in a fluctuating-load joint: bolt stiffness from the shank and threaded lengths in the grip and the preload from the nut rotation past snug with the joint stiffness (as the turn-of-nut preload tool), the joint constant, the preload as a share of proof load, and the fatigue safety factor of the bolt under the cyclic external load by the Goodman line (as the bolted joint fatigue tool).",
    "keywords": [
      "MAKEOS",
      "turn of nut",
      "bolt preload",
      "bolt fatigue",
      "joint constant",
      "proof load",
      "bolted joint"
    ],
    "fields": [
      {
        "key": "theta",
        "label": "Turn angle past snug",
        "type": "number",
        "default": 25,
        "unit": "°",
        "min": 0.000001,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lead",
        "label": "Thread lead",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Nominal (shank) diameter",
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
        "key": "At",
        "label": "Tensile stress area",
        "type": "number",
        "default": 58,
        "unit": "mm²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ls",
        "label": "Unthreaded shank length in the grip",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lt",
        "label": "Threaded length in the grip",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Bolt elastic modulus",
        "type": "number",
        "default": 205,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kj",
        "label": "Joint (clamped parts) stiffness",
        "type": "number",
        "default": 1200,
        "unit": "kN/mm",
        "min": 0.1,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load_and_strength",
        "label": "Load and strength",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Maximum external load (cycling from zero)",
        "type": "number",
        "default": 5,
        "unit": "kN",
        "min": 0,
        "max": 1000000,
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
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pMax",
        "label": "Largest preload as a share of proof load",
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
        "key": "Se",
        "label": "Bolt endurance strength (fully corrected)",
        "type": "number",
        "default": 129,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sut",
        "label": "Bolt tensile strength",
        "type": "number",
        "default": 830,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required fatigue safety factor",
        "type": "number",
        "default": 2,
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
    "id": "unified-thread-wire-limits",
    "name": "Unified Thread Over-Wire Limits (Pitch Diameter Limits, Wire Readings, Accept)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "For this Unified inch external thread and class, what readings over three wires mark the pitch diameter limits, and does my measured reading pass?",
    "description": "Three-wire inspection limits for a Unified (UN) external thread: basic major and pitch diameter limits for the class and length of engagement (as the Unified thread limits tool), the best-size wire and the measurement over wires at the maximum and minimum pitch diameter (as the three-wire measurement tool), and the pitch diameter worked back from your measured reading, accepted or rejected against the limits.",
    "keywords": [
      "MAKEOS",
      "three-wire",
      "Unified thread",
      "pitch diameter",
      "thread inspection",
      "over wires",
      "thread class"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Basic major diameter",
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
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cls",
        "label": "Thread class",
        "type": "select",
        "default": "2",
        "options": [
          [
            "1",
            "1A"
          ],
          [
            "2",
            "2A"
          ],
          [
            "3",
            "3A"
          ]
        ]
      },
      {
        "key": "LE",
        "label": "Length of engagement (0 = standard)",
        "type": "number",
        "default": 0,
        "unit": "in",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Wire diameter (0 = best size)",
        "type": "number",
        "default": 0,
        "unit": "in",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mmeas",
        "label": "Measured reading over wires",
        "type": "number",
        "default": 0.5126,
        "unit": "in",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "change-gear-threading-setup",
    "name": "Change-Gear Threading Set-up (Gear Train, Pitch Error, Thread Depth, Passes)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "To cut this metric thread on a lathe with an inch leadscrew (or the other way round), which change gears do I fit, how accurate is the pitch, and how deep and in how many passes do I cut?",
    "description": "Set-up for single-point screw cutting on a lathe with change gears: the ratio needed from the thread lead, leadscrew and fixed headstock ratio, the best simple and compound gear trains from the gear set with their pitch errors (as the change gears tool), and the thread height, pitch diameter and number of passes for a constant-area infeed from your first-pass depth (as the metric thread tool for thread depth), checked against the pitch error you accept.",
    "keywords": [
      "MAKEOS",
      "change gears",
      "screw cutting",
      "lathe threading",
      "127 gear",
      "thread depth",
      "infeed passes"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Thread nominal diameter",
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
        "key": "P",
        "label": "Thread pitch to cut",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "screwUnit",
        "label": "Leadscrew is given as",
        "type": "select",
        "default": "tpi",
        "options": [
          [
            "tpi",
            "Threads per inch"
          ],
          [
            "mm",
            "Pitch in mm"
          ]
        ]
      },
      {
        "key": "screw",
        "label": "Leadscrew",
        "type": "number",
        "default": 8,
        "unit": "TPI or mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fixed",
        "label": "Fixed ratio in the headstock (spindle to stud)",
        "type": "number",
        "default": 1,
        "unit": ":1",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "set",
        "label": "Gear set",
        "type": "select",
        "default": "g5",
        "options": [
          [
            "g5",
            "20 to 120 in steps of 5, plus 127"
          ],
          [
            "g4",
            "24 to 96 in steps of 4, plus 127"
          ]
        ]
      },
      {
        "key": "tolPct",
        "label": "Largest pitch error",
        "type": "number",
        "default": 0.05,
        "unit": "%",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "First pass depth (radial)",
        "type": "number",
        "default": 0.3,
        "unit": "mm",
        "min": 0.01,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "panel-material-substitution",
    "name": "Panel Material Substitution (Equal Stiffness and Strength Thickness, Mass, Cost)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "If I change this plate or panel to another material, how thick must it be to keep the same stiffness and strength, and what happens to weight and cost?",
    "description": "Substitution of a bending plate, cover or panel with another material: the thickness for equal bending stiffness and for equal bending strength, the governing thickness (as the equivalent stiffness thickness tool), mass per square metre and cost of the original and the new panel, the panel mass and cost over its area, and checks against the thickest stock available and whether the change saves weight.",
    "keywords": [
      "MAKEOS",
      "material substitution",
      "equivalent thickness",
      "stiffness",
      "lightweighting",
      "panel",
      "plastic replacement"
    ],
    "fields": [
      {
        "key": "t1",
        "label": "Original thickness",
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
        "key": "E1",
        "label": "Original modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S1",
        "label": "Original allowable stress",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho1",
        "label": "Original density",
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
        "key": "p1",
        "label": "Original material price",
        "type": "number",
        "default": 2,
        "unit": "$/kg",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_new_material",
        "label": "New material",
        "type": "heading"
      },
      {
        "key": "E2",
        "label": "New modulus",
        "type": "number",
        "default": 70,
        "unit": "GPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S2",
        "label": "New allowable stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho2",
        "label": "New density",
        "type": "number",
        "default": 2700,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "New material price",
        "type": "number",
        "default": 5,
        "unit": "$/kg",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tMax",
        "label": "Thickest stock available",
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
        "key": "area",
        "label": "Panel area",
        "type": "number",
        "default": 1.5,
        "unit": "m²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cone-clutch-engagement",
    "name": "Cone Clutch Engagement Check (Torque, Engaging Force, Slip Time, Heat)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Will this cone clutch carry the torque, what force engages it, how long does it slip to bring the load up to speed, and how hot does it get each engagement?",
    "description": "Check of a cone clutch starting a load: torque capacity from the axial holding force, friction and cone geometry and the force to engage it (as the cone clutch tool), the slip time to accelerate the load inertia against its load torque at the clutch torque (as the torque to accelerate a rotating load tool), the heat generated by slip in each engagement, the temperature rise of the cone, and the engagements per hour the cone can shed, against the required torque and your temperature limit.",
    "keywords": [
      "MAKEOS",
      "cone clutch",
      "clutch engagement",
      "slip time",
      "clutch heat",
      "torque capacity",
      "starting"
    ],
    "fields": [
      {
        "key": "Do",
        "label": "Large diameter of cone face",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Di",
        "label": "Small diameter of cone face",
        "type": "number",
        "default": 160,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Cone half-angle",
        "type": "number",
        "default": 12,
        "unit": "°",
        "min": 1,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Coefficient of friction",
        "type": "number",
        "default": 0.25,
        "unit": "",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Axial holding force",
        "type": "number",
        "default": 1500,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Treq",
        "label": "Required torque (with service factor)",
        "type": "number",
        "default": 150,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load",
        "label": "Load",
        "type": "heading"
      },
      {
        "key": "J",
        "label": "Load inertia at the clutch",
        "type": "number",
        "default": 0.5,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Driving speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tl",
        "label": "Load torque during start",
        "type": "number",
        "default": 40,
        "unit": "N·m",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_heat",
        "label": "Heat",
        "type": "heading"
      },
      {
        "key": "mc",
        "label": "Mass of the cone that absorbs heat",
        "type": "number",
        "default": 4,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cpc",
        "label": "Specific heat of the cone",
        "type": "number",
        "default": 0.46,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTmax",
        "label": "Largest temperature rise per engagement",
        "type": "number",
        "default": 15,
        "unit": "K",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
