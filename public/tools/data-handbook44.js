// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook44) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "gyroscopic-bearing-load",
    "name": "Gyroscopic Bearing Load on a Turning Rotor",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "When the machine carrying this spinning rotor turns or swings, what gyroscopic couple acts, and what total load does each bearing then carry?",
    "description": "Bearing loads on a rotor whose axis is turned while it spins (a vehicle turning, a swinging boom or a rotating platform): rotor inertia for a disc, a ring or an entered value, angular momentum, the precession rate from a turn radius and speed or from an entered turning speed, the gyroscopic couple and the equal and opposite bearing reactions over the bearing span (as the gyroscope precession tool), the static weight share on each bearing, and the largest bearing load against your allowable.",
    "keywords": [
      "MAKEOS",
      "gyroscopic couple",
      "bearing load",
      "precession",
      "turning vehicle",
      "flywheel bearing",
      "gyroscopic effect"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Rotor",
        "type": "select",
        "default": "disc",
        "options": [
          [
            "disc",
            "Solid disc"
          ],
          [
            "ring",
            "Thin ring"
          ],
          [
            "entered",
            "Enter the inertia"
          ]
        ]
      },
      {
        "key": "M",
        "label": "Rotor mass",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Rotor radius",
        "type": "number",
        "default": 0.2,
        "unit": "m",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "J",
        "label": "Rotor inertia (entered)",
        "type": "number",
        "default": 0.4,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ns",
        "label": "Spin speed",
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
        "key": "pmode",
        "label": "Precession from",
        "type": "select",
        "default": "turn",
        "options": [
          [
            "turn",
            "Vehicle turning (speed and radius)"
          ],
          [
            "rpm",
            "Turning speed of the axis"
          ]
        ]
      },
      {
        "key": "vt",
        "label": "Vehicle speed",
        "type": "number",
        "default": 10,
        "unit": "m/s",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rt",
        "label": "Turn radius",
        "type": "number",
        "default": 20,
        "unit": "m",
        "min": 0.1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "np",
        "label": "Turning speed of the axis",
        "type": "number",
        "default": 10,
        "unit": "rpm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Bearing span",
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
        "key": "allow",
        "label": "Allowable load per bearing",
        "type": "number",
        "default": 1000,
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
    "id": "centrifugal-attachment-check",
    "name": "Centrifugal Load on a Bolted Attachment (Overspeed and Bolt Stress)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What pull does centrifugal force put on the bolts holding this mass to a rotor, does it stay within the bolt allowable at overspeed, and at what speed would it reach the limit?",
    "description": "Check of a mass bolted to a rotating arm, hub or drum: centrifugal force at the running speed (as the centrifugal force tool), the force at your overspeed factor, the tension per bolt for bolts loaded radially, the bolt stress on the thread stress area, the safety factor against the allowable, and the speed at which the bolts would reach the allowable.",
    "keywords": [
      "MAKEOS",
      "centrifugal force",
      "overspeed",
      "bolt tension",
      "rotating attachment",
      "counterweight",
      "rotor arm"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Attached mass",
        "type": "number",
        "default": 2,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Radius to its centre of gravity",
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
        "key": "rpm",
        "label": "Running speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "os",
        "label": "Overspeed factor",
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
        "key": "nb",
        "label": "Bolts carrying the pull",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d",
        "label": "Bolt diameter",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Thread pitch",
        "type": "number",
        "default": 1.25,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bolt tensile stress",
        "type": "number",
        "default": 200,
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
    "id": "ratchet-pawl-design",
    "name": "Ratchet and Pawl Design (Pitch, Tooth Force, Bearing and Pin)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What pitch and diameter does this ratchet wheel need for the torque, what force does the pawl take, and are the tooth face and pawl pin strong enough?",
    "description": "Design of a ratchet and pawl holding a torque: circular pitch at the outside diameter by the handbook crane-ratchet rule and the outside diameter (as the ratchet wheel pitch tool), the tooth force at the outside diameter, the bearing stress where the pawl tip meets the tooth face, and the shear stress in the pawl pivot pin, against your allowables.",
    "keywords": [
      "MAKEOS",
      "ratchet wheel",
      "pawl",
      "ratchet pitch",
      "pawl pin",
      "holding torque",
      "backstop"
    ],
    "fields": [
      {
        "key": "M",
        "label": "Torque held",
        "type": "number",
        "default": 200,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Face width of the teeth",
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
        "key": "S",
        "label": "Safe stress for the ratchet rule",
        "type": "number",
        "default": 20,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 16,
        "unit": "",
        "min": 6,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h",
        "label": "Pawl engagement depth on the tooth face",
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
        "key": "bA",
        "label": "Allowable bearing stress on the tooth face",
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
        "key": "dp",
        "label": "Pawl pin diameter",
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
        "key": "planes",
        "label": "Pin shear planes",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Single shear (pawl on a cantilever pin)"
          ],
          [
            "2",
            "Double shear (pawl between two plates)"
          ]
        ]
      },
      {
        "key": "tA",
        "label": "Allowable pin shear stress",
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
    "id": "torsion-member-comparison",
    "name": "Torsion Member Comparison (Solid Bar, Tube or Rectangle)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For this torque, how do a solid round bar, a round tube and a rectangular bar compare in shear stress, twist and weight, and does the one I chose pass?",
    "description": "Side-by-side check of three shaft or link sections under the same torque: a solid round bar and a round tube by the exact polar moment (as the shaft torsion tool), and a solid rectangle by the handbook rectangular-section formulas (as the rectangular bar torsion tool), giving shear stress, twist over the length, twist per metre and mass per metre, with the chosen section checked against your allowable stress and twist limit.",
    "keywords": [
      "MAKEOS",
      "torsion comparison",
      "tube vs solid shaft",
      "rectangular bar torsion",
      "twist per metre",
      "torsional stiffness",
      "weight saving"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 200,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length",
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
        "key": "allow",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "twMax",
        "label": "Largest twist per metre",
        "type": "number",
        "default": 2,
        "unit": "°/m",
        "min": 0.01,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sel",
        "label": "Section chosen",
        "type": "select",
        "default": "tube",
        "options": [
          [
            "tube",
            "Round tube"
          ],
          [
            "solid",
            "Solid round bar"
          ],
          [
            "rect",
            "Rectangular bar"
          ]
        ]
      },
      {
        "key": "h_sections",
        "label": "Sections",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Solid bar diameter",
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
        "key": "Do",
        "label": "Tube outside diameter",
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
        "key": "t",
        "label": "Tube wall thickness",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Rectangle long side",
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
        "key": "c",
        "label": "Rectangle short side",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "inertia-matching-ratio",
    "name": "Gear Ratio for Inertia Matching (Optimum Ratio and Motor Torque)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What gear ratio lets this motor accelerate the load with the least torque, what ratio can I actually use within the motor speed, and does the motor have the torque at my chosen ratio?",
    "description": "Gear ratio selection for accelerating a load inertia: reflected inertia, inertia ratio, motor speed, acceleration torque, load torque at the motor and peak motor torque at your chosen ratio (as the reflected inertia tool), the ratio that minimises acceleration torque (load inertia reflected equal to the motor inertia), the best ratio allowed by the motor’s top speed, the motor torque at that ratio, and checks of the chosen ratio against the motor speed and peak torque.",
    "keywords": [
      "MAKEOS",
      "inertia matching",
      "optimum gear ratio",
      "reflected inertia",
      "servo sizing",
      "acceleration torque",
      "gearbox selection"
    ],
    "fields": [
      {
        "key": "JL",
        "label": "Load inertia",
        "type": "number",
        "default": 2,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jm",
        "label": "Motor inertia",
        "type": "number",
        "default": 0.0012,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Chosen ratio",
        "type": "number",
        "default": 10,
        "unit": ":1",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Gearbox efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nL",
        "label": "Load speed to reach",
        "type": "number",
        "default": 150,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Acceleration time",
        "type": "number",
        "default": 0.5,
        "unit": "s",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TL",
        "label": "Load torque",
        "type": "number",
        "default": 20,
        "unit": "N·m",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmMax",
        "label": "Motor top speed",
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
        "default": 12,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bolt-preload-verification",
    "name": "Bolt Preload Verification from Measured Stretch (and Nut Factor)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "From the bolt stretch I measured, what preload did this bolt actually get, how close is it to the target, and what nut factor does the tightening torque imply?",
    "description": "Verification of bolt tightening from a measured elongation: bolt stiffness from shank and thread lengths and the member stiffness (as the bolt stretch tool), preload from the measured stretch, deviation from the target preload as a share of proof load, the nut factor implied by the applied torque (as the torque–preload relation of the bolt torque–preload tool), the torque that would give the target with that nut factor, and the turn angle that corresponds to the preload.",
    "keywords": [
      "MAKEOS",
      "bolt stretch",
      "preload verification",
      "ultrasonic bolt measurement",
      "nut factor",
      "K factor",
      "torque calibration"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Bolt diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Thread pitch",
        "type": "number",
        "default": 2.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "grip",
        "label": "Grip length",
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
        "key": "Lt",
        "label": "Threaded length in the grip",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0,
        "max": 2000,
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
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Em",
        "label": "Clamped part modulus",
        "type": "number",
        "default": 207,
        "unit": "GPa",
        "min": 0.000001,
        "max": 400,
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
        "key": "pct",
        "label": "Target preload as share of proof load",
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
        "key": "tol",
        "label": "Accepted deviation from target",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dl",
        "label": "Measured bolt stretch",
        "type": "number",
        "default": 0.15,
        "unit": "mm",
        "min": 0.0001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tq",
        "label": "Applied tightening torque",
        "type": "number",
        "default": 480,
        "unit": "N·m",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "spindle-speed-range-design",
    "name": "Machine Spindle Speed Range Design (Geometric Series and Speed Loss)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What spindle speed range covers my diameters and cutting speeds, what step ratio do my number of speeds give, and how much cutting speed is lost between steps?",
    "description": "Design of a stepped spindle speed range for a machine tool: lowest and highest speeds needed from the work diameter range and cutting speed range, the geometric step ratio for the number of speeds (as the speed series tool), the nearest preferred-number series, the largest cutting speed loss between neighbouring speeds, the number of speeds needed for your largest acceptable loss, and the list of speeds.",
    "keywords": [
      "MAKEOS",
      "spindle speeds",
      "geometric series",
      "step ratio",
      "speed loss",
      "gearbox design",
      "preferred numbers"
    ],
    "fields": [
      {
        "key": "dmin",
        "label": "Smallest work (or tool) diameter",
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
        "key": "dmax",
        "label": "Largest work (or tool) diameter",
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
        "key": "vmin",
        "label": "Lowest cutting speed",
        "type": "number",
        "default": 60,
        "unit": "m/min",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vmax",
        "label": "Highest cutting speed",
        "type": "number",
        "default": 300,
        "unit": "m/min",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Number of speeds",
        "type": "number",
        "default": 18,
        "unit": "",
        "min": 2,
        "max": 60,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "lossMax",
        "label": "Largest acceptable speed loss between steps",
        "type": "number",
        "default": 21,
        "unit": "%",
        "min": 1,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vacuum-tube-design",
    "name": "Tube or Shell under External Pressure (Collapse Thickness and Factor)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "How thick must this long tube or vacuum shell be to resist collapse under the outside pressure, and what safety factor does the chosen wall give after corrosion?",
    "description": "Design of a long round tube or cylindrical shell under external pressure or vacuum: elastic collapse pressure and the yield-limited pressure for the wall left after corrosion allowance, the governing mode and safety factor (as the tube collapse tool), the least wall that gives your required factor (found by search) plus allowance, the diameter-to-thickness ratio and the mass per metre.",
    "keywords": [
      "MAKEOS",
      "external pressure",
      "tube collapse",
      "vacuum vessel",
      "buckling pressure",
      "D/t ratio",
      "heat exchanger tube"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Outside diameter",
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
        "label": "Wall thickness",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ca",
        "label": "Corrosion allowance",
        "type": "number",
        "default": 0.5,
        "unit": "mm",
        "min": 0,
        "max": 50,
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
        "key": "nu",
        "label": "Poisson’s ratio",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.1,
        "max": 0.5,
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
        "key": "p",
        "label": "External pressure (net)",
        "type": "number",
        "default": 0.5,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Safety factor required",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 10,
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
      }
    ]
  },
  {
    "id": "journal-bearing-oil-check",
    "name": "Journal Bearing Oil Check (Viscosity at Temperature, Film and Friction)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "At its running temperature, how thick is this oil, does the journal bearing keep a safe film with it, and how much heat does the oil friction make?",
    "description": "Check of a plain journal bearing with a chosen oil grade: kinematic viscosity at the running temperature from the oil’s two catalogue viscosities by the ASTM D341 relation (as the oil viscosity–temperature tool), dynamic viscosity from the density, then the unit load, Sommerfeld number, Petroff friction torque and power loss (as the Petroff tool), with checks of viscosity against your minimum and of the Sommerfeld number against your limit.",
    "keywords": [
      "MAKEOS",
      "oil viscosity",
      "journal bearing",
      "Sommerfeld number",
      "oil grade selection",
      "Petroff friction",
      "bearing temperature"
    ],
    "fields": [
      {
        "key": "h_oil",
        "label": "Oil",
        "type": "heading"
      },
      {
        "key": "T1",
        "label": "First catalogue temperature",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": -50,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v1",
        "label": "Viscosity at that temperature",
        "type": "number",
        "default": 46,
        "unit": "cSt",
        "min": 0.5,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Second catalogue temperature",
        "type": "number",
        "default": 100,
        "unit": "°C",
        "min": -50,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v2",
        "label": "Viscosity at that temperature",
        "type": "number",
        "default": 6.8,
        "unit": "cSt",
        "min": 0.5,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Top",
        "label": "Running oil temperature",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -50,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Oil density at running temperature",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 600,
        "max": 1200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vMin",
        "label": "Least viscosity accepted",
        "type": "number",
        "default": 13,
        "unit": "cSt",
        "min": 0.5,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bearing",
        "label": "Bearing",
        "type": "heading"
      },
      {
        "key": "W",
        "label": "Radial load",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Journal diameter",
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
        "key": "L",
        "label": "Bearing length",
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
        "key": "c",
        "label": "Radial clearance",
        "type": "number",
        "default": 0.04,
        "unit": "mm",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Smin",
        "label": "Smallest Sommerfeld number",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
