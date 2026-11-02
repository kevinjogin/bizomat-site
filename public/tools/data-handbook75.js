// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook75) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "trepanning-plan",
    "name": "Trepanning Plan (Ring Cut Power, Torque, Time and Core against Solid Drilling)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "Should a large hole be trepanned or drilled solid: what power, torque and time does each need, how much metal does trepanning leave as a usable core, and can the machine do it?",
    "description": "Plan for cutting a large hole by trepanning, which removes only a ring and leaves a solid core, compared with drilling it solid: the spindle speed, the cutting power and torque for the ring from the kerf width, feed, mean cutting speed and specific cutting force, the motor power against the spindle power, the cutting time, the volume removed and the core diameter, mass and value, and the same speed and power for a solid drill of the hole size (as the drilling cycle planner tool).",
    "keywords": [
      "MAKEOS",
      "trepanning",
      "large holes",
      "core drilling",
      "ring cut",
      "drilling power",
      "spindle power"
    ],
    "fields": [
      {
        "key": "h_hole",
        "label": "Hole",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Hole diameter",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Hole depth",
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
        "key": "w",
        "label": "Trepanning kerf width (radial)",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "clear",
        "label": "Approach and breakthrough clearance",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cut",
        "label": "Cut",
        "type": "heading"
      },
      {
        "key": "vc",
        "label": "Cutting speed at the hole diameter",
        "type": "number",
        "default": 80,
        "unit": "m/min",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Trepanning feed per revolution",
        "type": "number",
        "default": 0.12,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fD",
        "label": "Solid drilling feed per revolution",
        "type": "number",
        "default": 0.25,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "point",
        "label": "Solid drill point angle",
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
        "key": "Pav",
        "label": "Spindle power available",
        "type": "number",
        "default": 11,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_core",
        "label": "Core",
        "type": "heading"
      },
      {
        "key": "rho",
        "label": "Work material density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 100,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Value of the recovered core",
        "type": "number",
        "default": 1.5,
        "unit": "A$/kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "grinding-wheel-cost-plan",
    "name": "Grinding Wheel Cost Plan (Wear from G-Ratio, Dressing, Parts per Wheel, Cost per Part)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How much grinding wheel does each part use up through wear and dressing, how many parts will one wheel do, and what do the wheel and the grinding time cost per part?",
    "description": "Plan of grinding wheel use for an external cylindrical grinding job: the stock volume removed from each part, the wheel wear it causes from the grinding ratio (as the grinding geometry tool defines it), the wheel volume taken off by dressing shared over the parts between dressings, the usable wheel volume between the new and the discard diameter, the parts per wheel, the wheel cost and the grinding time cost per part from a specific removal rate, against a target cost per part.",
    "keywords": [
      "MAKEOS",
      "grinding wheel",
      "G-ratio",
      "grinding ratio",
      "dressing",
      "wheel cost",
      "cost per part"
    ],
    "fields": [
      {
        "key": "h_part",
        "label": "Part",
        "type": "heading"
      },
      {
        "key": "dw",
        "label": "Work diameter before grinding",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lw",
        "label": "Ground length",
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
        "key": "s",
        "label": "Grinding stock on diameter",
        "type": "number",
        "default": 0.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_wheel",
        "label": "Wheel",
        "type": "heading"
      },
      {
        "key": "G",
        "label": "Grinding ratio (metal removed ÷ wheel worn)",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 0.01,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D0",
        "label": "New wheel diameter",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dmin",
        "label": "Discard wheel diameter",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Wheel width",
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
        "key": "ad",
        "label": "Radial dressing depth per dressing",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pd",
        "label": "Parts ground between dressings",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "price",
        "label": "Wheel price",
        "type": "number",
        "default": 450,
        "unit": "A$",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_time_and_target",
        "label": "Time and target",
        "type": "heading"
      },
      {
        "key": "Qp",
        "label": "Specific removal rate per mm of wheel width",
        "type": "number",
        "default": 2,
        "unit": "mm³/(mm·s)",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "spark",
        "label": "Spark-out and dwell time per part",
        "type": "number",
        "default": 6,
        "unit": "s",
        "min": 0,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Machine and operator rate",
        "type": "number",
        "default": 120,
        "unit": "A$/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "target",
        "label": "Target grinding cost per part",
        "type": "number",
        "default": 1.5,
        "unit": "A$",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "drill-bushing-position-check",
    "name": "Drill Bushing Position Check (Clearance, Drill Tilt, Hole Position Error, Chip Gap)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "When a drill is guided by a jig bushing, how far can the hole start from its true position because of the clearance in the bushing and the gap below it, and is that within the position tolerance?",
    "description": "Check of hole position from a drill jig: the largest radial clearance between the drill and the bushing bore from their limits and the bushing wear you allow, the tilt the drill can take inside the bushing length, the largest offset of the drill point at the work surface after the gap below the bushing, the resulting position error as a diameter against the position tolerance, and the chip gap as a multiple of the drill diameter against your range.",
    "keywords": [
      "MAKEOS",
      "jig bushing",
      "drill jig",
      "hole position",
      "bushing clearance",
      "position tolerance",
      "chip clearance"
    ],
    "fields": [
      {
        "key": "h_drill_and_bushing",
        "label": "Drill and bushing",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Drill diameter",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "drillLo",
        "label": "Drill lower deviation",
        "type": "number",
        "default": -15,
        "unit": "µm",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bushUp",
        "label": "Bushing bore upper deviation",
        "type": "number",
        "default": 28,
        "unit": "µm",
        "min": -1000,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wear",
        "label": "Bushing wear allowed before replacement",
        "type": "number",
        "default": 5,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lb",
        "label": "Bushing length (guided length)",
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
        "key": "g",
        "label": "Gap from bushing end to the work",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wander",
        "label": "Extra point wander at entry",
        "type": "number",
        "default": 0,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_requirements",
        "label": "Requirements",
        "type": "heading"
      },
      {
        "key": "T",
        "label": "Position tolerance (diameter of the zone)",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gMin",
        "label": "Least chip gap as a multiple of drill diameter",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gMax",
        "label": "Largest chip gap as a multiple of drill diameter",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "woodruff-key-check",
    "name": "Woodruff Key Check (Key Shear, Hub and Shaft Bearing, Weakened Shaft Torsion)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Will a Woodruff key carry the torque without shearing or crushing, and is the shaft, weakened by the deep keyseat, still strong enough in torsion?",
    "description": "Check of a Woodruff (half-moon) key transmitting torque: the force at the shaft surface, the shear stress across the key width over its length (as the parallel key stress tool), the bearing stress on the part of the key standing above the shaft in the hub and on the part sunk in the shaft, the shaft's torsional stress raised by a stress concentration factor for the deep keyseat, all against your allowables, and the least key length for shear and for hub bearing.",
    "keywords": [
      "MAKEOS",
      "Woodruff key",
      "half-moon key",
      "key shear",
      "bearing stress",
      "keyseat",
      "shaft torsion"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Torque transmitted",
        "type": "number",
        "default": 60,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Shaft diameter",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_key",
        "label": "Key",
        "type": "heading"
      },
      {
        "key": "w",
        "label": "Key width",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Key length (chord at the shaft surface)",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Key height",
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
        "key": "t1",
        "label": "Keyseat depth in the shaft",
        "type": "number",
        "default": 7.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_allowables",
        "label": "Allowables",
        "type": "heading"
      },
      {
        "key": "tauA",
        "label": "Allowable shear stress in the key",
        "type": "number",
        "default": 60,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sigA",
        "label": "Allowable bearing stress (weakest of key, hub, shaft)",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kt",
        "label": "Shaft stress concentration factor at the keyseat",
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
        "key": "tauS",
        "label": "Allowable shear stress in the shaft",
        "type": "number",
        "default": 80,
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
    "id": "eyebolt-lift-check",
    "name": "Eyebolt Lift Check (Unequal Leg Tensions, Angled Capacity, Thread Engagement)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "When a load hangs from two eyebolts with legs at different angles, what tension does each eyebolt actually carry, is that within its capacity at the angle, and is each eyebolt screwed in deeply enough?",
    "description": "Check of a two-eyebolt lift with legs at unequal angles to the vertical: the tension in each leg from horizontal and vertical equilibrium (the horizontal pulls are equal and the vertical parts add to the load), the vertical share and the sideways pull on each eyebolt, each tension against the eyebolt's rated vertical load reduced by the share you allow at that leg angle, and the thread engagement as a multiple of the thread diameter against your requirement. Unequal legs show why dividing the load by the number of eyebolts can be unsafe.",
    "keywords": [
      "MAKEOS",
      "eyebolt",
      "lifting",
      "sling angle",
      "leg tension",
      "rigging",
      "thread engagement"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Load mass",
        "type": "number",
        "default": 1000,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Leg 1 angle from vertical",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 0,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Leg 2 angle from vertical",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_eyebolt_capacity",
        "label": "Eyebolt capacity",
        "type": "heading"
      },
      {
        "key": "wll",
        "label": "Rated vertical working load limit per eyebolt",
        "type": "number",
        "default": 1500,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s1",
        "label": "Share of the rated load allowed at the leg 1 angle",
        "type": "number",
        "default": 55,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s2",
        "label": "Share of the rated load allowed at the leg 2 angle",
        "type": "number",
        "default": 55,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_thread",
        "label": "Thread",
        "type": "heading"
      },
      {
        "key": "dt",
        "label": "Eyebolt thread diameter",
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
        "key": "Le",
        "label": "Thread engagement in the load",
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
        "key": "eReq",
        "label": "Least engagement as a multiple of the thread diameter",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
