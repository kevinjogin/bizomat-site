// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook50) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "shaft-alignment-plan",
    "name": "Shaft Alignment Plan (Rim and Face Corrections with Thermal Growth)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "From my rim and face readings, how many shims do I add or remove at each foot so the shafts line up when the machines are hot, and is the running alignment within tolerance as it stands?",
    "description": "Alignment plan for a movable machine coupled to a stationary one: offset and slope at the coupling and the corrections at the front and back feet from rim and face dial readings (as the rim and face alignment tool), the vertical thermal growth of each machine from its foot-to-centreline height and support temperature rise and the cold offset to allow (as the thermal growth for hot alignment tool), the cold shim corrections that give true alignment when hot, and the running offset and angularity if nothing is changed, against your tolerances.",
    "keywords": [
      "MAKEOS",
      "shaft alignment",
      "rim and face",
      "thermal growth",
      "cold offset",
      "shims",
      "coupling alignment"
    ],
    "fields": [
      {
        "key": "h_dial_readings_movable_machine_",
        "label": "Dial readings (movable machine)",
        "type": "heading"
      },
      {
        "key": "rim",
        "label": "Rim reading at 6 o’clock (zeroed at 12)",
        "type": "number",
        "default": 0.24,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "face",
        "label": "Face reading at 6 o’clock (zeroed at 12)",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": -100,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dia",
        "label": "Diameter of the face reading circle",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "front",
        "label": "Coupling to front foot of movable machine",
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
        "key": "back",
        "label": "Coupling to back foot of movable machine",
        "type": "number",
        "default": 650,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_thermal_growth",
        "label": "Thermal growth",
        "type": "heading"
      },
      {
        "key": "H1",
        "label": "Stationary machine: foot to shaft centreline",
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
        "key": "a1",
        "label": "Stationary machine: expansion coefficient",
        "type": "number",
        "default": 11,
        "unit": "µm/(m·K)",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT1",
        "label": "Stationary machine: support temperature rise",
        "type": "number",
        "default": 20,
        "unit": "K",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "H2",
        "label": "Movable machine: foot to shaft centreline",
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
        "key": "a2",
        "label": "Movable machine: expansion coefficient",
        "type": "number",
        "default": 11,
        "unit": "µm/(m·K)",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT2",
        "label": "Movable machine: support temperature rise",
        "type": "number",
        "default": 60,
        "unit": "K",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_tolerances",
        "label": "Tolerances",
        "type": "heading"
      },
      {
        "key": "tolOff",
        "label": "Offset tolerance at the coupling",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolAng",
        "label": "Angularity tolerance",
        "type": "number",
        "default": 0.05,
        "unit": "mm/100 mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "helical-gear-milling-setup",
    "name": "Helical Gear Milling Set-up (Lead, Change Gears, Cutter, Indexing)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "How do I set up a universal milling machine to cut this helical gear: lead and change gears, table swivel, cutter number and index setting?",
    "description": "Set-up for milling a helical gear with a form cutter on a universal dividing head: pitch diameter from the normal module, the lead of the helix and the change gears from the table lead screw to the dividing head with the lead error (as the helical milling tool), table swivel, the cutter number from the formative number of teeth (as the gear cutter number tool for helical gears), the simple indexing setting (as the simple indexing tool), blank diameter and depth of cut.",
    "keywords": [
      "MAKEOS",
      "helical gear milling",
      "helix lead",
      "change gears",
      "universal dividing head",
      "formative teeth",
      "table swivel"
    ],
    "fields": [
      {
        "key": "mn",
        "label": "Normal module",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.3,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Number of teeth",
        "type": "number",
        "default": 30,
        "unit": "",
        "min": 6,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "beta",
        "label": "Helix angle",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 1,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lm",
        "label": "Lead of the machine",
        "type": "number",
        "default": 254,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "set",
        "label": "Change gears available",
        "type": "select",
        "default": "std",
        "options": [
          [
            "std",
            "Standard set: 24, 24, 28, 32, 40, 44, 48, 56, 64, 72, 86, 100"
          ],
          [
            "g4",
            "24 to 100 in steps of 4"
          ]
        ]
      },
      {
        "key": "ratio",
        "label": "Dividing head worm ratio",
        "type": "number",
        "default": 40,
        "unit": ":1",
        "min": 1,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "plates",
        "label": "Index plates available",
        "type": "select",
        "default": "bs",
        "options": [
          [
            "bs",
            "Brown & Sharpe plates 1–3"
          ],
          [
            "cin",
            "Cincinnati standard plate (both sides)"
          ]
        ]
      },
      {
        "key": "ded",
        "label": "Dedendum factor (dedendum ÷ module)",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 1.6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Largest lead error",
        "type": "number",
        "default": 0.5,
        "unit": "%",
        "min": 0.001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "machine-rate-quote-check",
    "name": "Machine Rate Quote Check (Hour Rate, Job Cost, Margin)",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "What does an hour on this machine really cost, what does this job cost per part at that rate, and does my quoted price give the margin I need?",
    "description": "Check of a quoted part price against the true cost of the machine: capital recovery from price, resale value, life and interest, with floor space, maintenance, power and tooling per productive hour, plus the operator (as the machine hour rate tool); the job hours from set-up and cycle time, the job cost with material, cost per part, margin at the quoted price and the least price for the margin you want.",
    "keywords": [
      "MAKEOS",
      "machine hour rate",
      "quote check",
      "cost per part",
      "margin",
      "job costing",
      "capital recovery"
    ],
    "fields": [
      {
        "key": "h_machine",
        "label": "Machine",
        "type": "heading"
      },
      {
        "key": "price",
        "label": "Installed machine cost",
        "type": "number",
        "default": 350000,
        "unit": "AUD",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "salvage",
        "label": "Resale value at end of life",
        "type": "number",
        "default": 50000,
        "unit": "AUD",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "life",
        "label": "Economic life",
        "type": "number",
        "default": 10,
        "unit": "years",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "rate",
        "label": "Interest (discount) rate",
        "type": "number",
        "default": 8,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Productive hours per year",
        "type": "number",
        "default": 3000,
        "unit": "h",
        "min": 0.000001,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "space",
        "label": "Floor space cost per year",
        "type": "number",
        "default": 8000,
        "unit": "AUD/yr",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kW",
        "label": "Average power drawn when running",
        "type": "number",
        "default": 12,
        "unit": "kW",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "elec",
        "label": "Electricity price",
        "type": "number",
        "default": 0.25,
        "unit": "AUD/kWh",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "maint",
        "label": "Maintenance per year",
        "type": "number",
        "default": 12000,
        "unit": "AUD/yr",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tooling",
        "label": "Tooling and consumables per hour",
        "type": "number",
        "default": 15,
        "unit": "AUD/h",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "labour",
        "label": "Operator cost per hour (fully loaded)",
        "type": "number",
        "default": 65,
        "unit": "AUD/h",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_job",
        "label": "Job",
        "type": "heading"
      },
      {
        "key": "setup",
        "label": "Set-up time",
        "type": "number",
        "default": 2,
        "unit": "h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cycle",
        "label": "Cycle time per part",
        "type": "number",
        "default": 6,
        "unit": "min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qty",
        "label": "Quantity",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": 1,
        "max": 100000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mat",
        "label": "Material and bought-in cost per part",
        "type": "number",
        "default": 4.5,
        "unit": "AUD",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "quote",
        "label": "Quoted price per part",
        "type": "number",
        "default": 22,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mTarget",
        "label": "Margin wanted",
        "type": "number",
        "default": 15,
        "unit": "%",
        "min": 0,
        "max": 95,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "crane-load-swing-check",
    "name": "Crane Load Swing Check (Pendulum Period, Swing, Rope Tension)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "If the trolley stops suddenly, how far will this hanging load swing, how long is each swing, and how much extra pull does the swing put on the rope?",
    "description": "Check of a load hanging from a crane trolley or hoist that stops abruptly from its travel speed: pendulum period for the rope length corrected for amplitude (as the pendulum period tool), the swing angle and horizontal swing from the kinetic energy of the load, the rope tension at the bottom of the swing including the centripetal force, the largest travel speed for your swing clearance, and checks against the clearance and the rated load.",
    "keywords": [
      "MAKEOS",
      "load swing",
      "crane sway",
      "pendulum",
      "rope tension",
      "trolley speed",
      "lifting safety"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Load mass",
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
        "key": "L",
        "label": "Rope length to the load centre of gravity",
        "type": "number",
        "default": 6,
        "unit": "m",
        "min": 0.1,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Travel speed",
        "type": "number",
        "default": 0.5,
        "unit": "m/s",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "clear",
        "label": "Swing clearance available",
        "type": "number",
        "default": 0.5,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SWL",
        "label": "Rated load of the crane and rigging",
        "type": "number",
        "default": 25,
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
    "id": "nested-spring-check",
    "name": "Nested Compression Spring Check (Load Share, Stresses, Solid Length, Clearance)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "If I nest an inner spring inside an outer one, what load does the pair give at the working length, how is it shared, are both springs within stress, and do they fit together?",
    "description": "Check of two helical compression springs nested one inside the other and compressed together: each spring’s rate, load and corrected shear stress at the working length, solid length and stress at solid (as the compression spring tool), the combined rate and load share in parallel (as the springs in series or parallel tool), the radial clearance between the inner spring’s outside and the outer spring’s inside, and the total load against what you need.",
    "keywords": [
      "MAKEOS",
      "nested springs",
      "concentric springs",
      "spring load share",
      "compression spring",
      "parallel springs",
      "die springs"
    ],
    "fields": [
      {
        "key": "h_outer_spring",
        "label": "Outer spring",
        "type": "heading"
      },
      {
        "key": "do",
        "label": "Wire diameter",
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
        "key": "Do",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 32,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nao",
        "label": "Active coils",
        "type": "number",
        "default": 8,
        "unit": "coils",
        "min": 0.5,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_inner_spring",
        "label": "Inner spring",
        "type": "heading"
      },
      {
        "key": "di",
        "label": "Wire diameter",
        "type": "number",
        "default": 2.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Di",
        "label": "Mean coil diameter",
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
        "key": "Nai",
        "label": "Active coils",
        "type": "number",
        "default": 12,
        "unit": "coils",
        "min": 0.5,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_common",
        "label": "Common",
        "type": "heading"
      },
      {
        "key": "ends",
        "label": "End type (both)",
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
        "label": "Unloaded length (both)",
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
        "key": "Lw",
        "label": "Working length",
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
      },
      {
        "key": "need",
        "label": "Load needed at the working length",
        "type": "number",
        "default": 250,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cMin",
        "label": "Least radial clearance between springs",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "spun-cone-plan",
    "name": "Shear Spun Cone Plan (Blank, Reduction, Roller Force, Power, Time)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What blank do I need to shear spin this cone, is the thickness reduction within what the material will take, and is the lathe powerful enough?",
    "description": "Plan for shear spinning a cone: blank thickness by the sine law and the thickness reduction (as the shear spinning tool) against the largest reduction the material will take in one pass, blank diameter and mass, tangential roller force, surface speed and power at the roller against the machine, and the spinning time over the cone length at the roller feed.",
    "keywords": [
      "MAKEOS",
      "shear spinning",
      "sine law",
      "metal spinning",
      "cone",
      "flow forming",
      "spinning blank"
    ],
    "fields": [
      {
        "key": "Tw",
        "label": "Wall thickness of the spun cone",
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
        "key": "alpha",
        "label": "Half angle of the cone",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 5,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dl",
        "label": "Large diameter of the cone",
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
        "key": "Ds",
        "label": "Small diameter of the cone",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sf",
        "label": "Average flow stress of the material",
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
        "key": "rho",
        "label": "Material density",
        "type": "number",
        "default": 2700,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_process_and_limits",
        "label": "Process and limits",
        "type": "heading"
      },
      {
        "key": "f",
        "label": "Roller feed per revolution",
        "type": "number",
        "default": 0.5,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Spindle speed",
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
        "key": "redMax",
        "label": "Largest reduction in one pass",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 1,
        "max": 95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pm",
        "label": "Machine power at the spindle",
        "type": "number",
        "default": 5,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "moulded-part-cost",
    "name": "Injection Moulded Part Cost (Clamp, Cycle, Machine, Material, Mould)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "Will my moulding machine run this mould, how many parts an hour will it make, and what does each part cost in machine time, plastic and mould against my target price?",
    "description": "Cost check for an injection moulded part: clamp force from the projected area and cavity pressure, shot size against the barrel, cooling time from the wall thickness, cycle time and parts per hour (as the injection moulding estimate tool), then per good part the machine cost at your hourly rate, the plastic including runner and scrap, and the mould amortised over its life quantity, against the target price.",
    "keywords": [
      "MAKEOS",
      "injection moulding cost",
      "part cost",
      "cycle time",
      "clamp force",
      "mould amortisation",
      "plastic part"
    ],
    "fields": [
      {
        "key": "h_mould",
        "label": "Mould",
        "type": "heading"
      },
      {
        "key": "Ap",
        "label": "Projected area per part",
        "type": "number",
        "default": 50,
        "unit": "cm²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cav",
        "label": "Cavities",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 256,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Ar",
        "label": "Runner projected area",
        "type": "number",
        "default": 20,
        "unit": "cm²",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pc",
        "label": "Cavity pressure",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "marg",
        "label": "Clamp margin",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vp",
        "label": "Part volume",
        "type": "number",
        "default": 30,
        "unit": "cm³",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vr",
        "label": "Runner volume",
        "type": "number",
        "default": 10,
        "unit": "cm³",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Melt density",
        "type": "number",
        "default": 0.95,
        "unit": "g/cm³",
        "min": 0.000001,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cooling",
        "label": "Cooling",
        "type": "heading"
      },
      {
        "key": "s",
        "label": "Wall thickness",
        "type": "number",
        "default": 2.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Thermal diffusivity of the plastic",
        "type": "number",
        "default": 0.09,
        "unit": "mm²/s",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tm",
        "label": "Melt temperature",
        "type": "number",
        "default": 230,
        "unit": "°C",
        "min": 0.000001,
        "max": 450,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tw",
        "label": "Mould temperature",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Te",
        "label": "Ejection temperature",
        "type": "number",
        "default": 90,
        "unit": "°C",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tOther",
        "label": "Other cycle time (fill, hold, open, eject, close)",
        "type": "number",
        "default": 8,
        "unit": "s",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_machine_and_costs",
        "label": "Machine and costs",
        "type": "heading"
      },
      {
        "key": "clamp",
        "label": "Machine clamp force",
        "type": "number",
        "default": 1500,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "barrel",
        "label": "Machine shot capacity",
        "type": "number",
        "default": 300,
        "unit": "cm³",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rateM",
        "label": "Machine rate with operator share",
        "type": "number",
        "default": 60,
        "unit": "$/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "resin",
        "label": "Plastic price",
        "type": "number",
        "default": 2.5,
        "unit": "$/kg",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "scrap",
        "label": "Scrap rate",
        "type": "number",
        "default": 3,
        "unit": "%",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mould",
        "label": "Mould cost",
        "type": "number",
        "default": 40000,
        "unit": "$",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "life",
        "label": "Parts over the mould’s charged life",
        "type": "number",
        "default": 200000,
        "unit": "",
        "min": 1,
        "max": 10000000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "target",
        "label": "Target cost per part",
        "type": "number",
        "default": 0.4,
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
    "id": "dynamometer-cooling-plan",
    "name": "Brake Dynamometer Test and Cooling Plan (Power, Water Flow, Water Use)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "How much power is my prony brake or absorption dynamometer taking, how much cooling water does it need for the temperature rise I allow, and do my brake rating and water supply cover it?",
    "description": "Plan for a power test with a prony brake or absorption dynamometer: net scale force, torque and power absorbed from the arm length, scale readings and speed (as the prony brake tool), the share of the power carried away by the cooling water, the water flow for your allowed temperature rise (as the coolant flow for a heat load tool), the water used over the test, and checks against the brake rating and the water supply.",
    "keywords": [
      "MAKEOS",
      "prony brake",
      "dynamometer",
      "power test",
      "cooling water",
      "brake horsepower",
      "absorption brake"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Brake arm length",
        "type": "number",
        "default": 1,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tare",
        "label": "Scale reading with the brake absorbing power",
        "type": "number",
        "default": 250,
        "unit": "N",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "zero",
        "label": "Zero reading (frictionless)",
        "type": "number",
        "default": 50,
        "unit": "N",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Shaft speed",
        "type": "number",
        "default": 600,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cooling",
        "label": "Cooling",
        "type": "heading"
      },
      {
        "key": "share",
        "label": "Share of the power removed by the water",
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
        "key": "dT",
        "label": "Allowed water temperature rise",
        "type": "number",
        "default": 10,
        "unit": "K",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Water specific heat",
        "type": "number",
        "default": 4.18,
        "unit": "kJ/(kg·K)",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoW",
        "label": "Water density",
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
        "key": "mins",
        "label": "Test duration",
        "type": "number",
        "default": 30,
        "unit": "min",
        "min": 0.000001,
        "max": 100000,
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
        "key": "rating",
        "label": "Brake power rating",
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
        "key": "supply",
        "label": "Water supply available",
        "type": "number",
        "default": 20,
        "unit": "L/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "internal-gear-drive-check",
    "name": "Internal Gear Drive Check (Proportions, Tooth Difference, Pinion Bending)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "Will this pinion and internal gear mesh without interference, what are their proportions and centre distance, and is the pinion strong enough for the power?",
    "description": "Check of a spur pinion driving an internal (ring) gear: pitch diameters, centre distance, enlarged and conventional internal and outside diameters and the tooth-number difference against the minimum for the tooth form (as the internal gear proportions tool), the ratio and output speed, pinion torque and tangential force from the power, and the Lewis bending stress with the velocity factor (as the Lewis bending stress tool) against your allowable.",
    "keywords": [
      "MAKEOS",
      "internal gear",
      "ring gear",
      "pinion",
      "Lewis bending",
      "centre distance",
      "tooth difference"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
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
        "key": "Zg",
        "label": "Internal gear teeth",
        "type": "number",
        "default": 72,
        "unit": "",
        "min": 20,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Zp",
        "label": "Pinion teeth",
        "type": "number",
        "default": 18,
        "unit": "",
        "min": 8,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "form",
        "label": "Tooth form",
        "type": "select",
        "default": "20fd",
        "options": [
          [
            "20fd",
            "20° full depth"
          ],
          [
            "20stub",
            "20° stub"
          ],
          [
            "14fd",
            "14½° full depth"
          ]
        ]
      },
      {
        "key": "h_load",
        "label": "Load",
        "type": "heading"
      },
      {
        "key": "P",
        "label": "Power",
        "type": "number",
        "default": 3,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
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
        "key": "b",
        "label": "Face width",
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
        "key": "Y",
        "label": "Lewis form factor of the pinion",
        "type": "number",
        "default": 0.31,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "make",
        "label": "Tooth manufacture",
        "type": "select",
        "default": "hobbed",
        "options": [
          [
            "cast",
            "Cast teeth"
          ],
          [
            "cut",
            "Cut or milled"
          ],
          [
            "hobbed",
            "Hobbed or shaped"
          ],
          [
            "ground",
            "Shaved or ground"
          ]
        ]
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
