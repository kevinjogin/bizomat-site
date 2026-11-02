// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook67) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "cylinder-cushion-check",
    "name": "Cylinder Cushion Check (Kinetic Energy, Deceleration, Cushion Pressure, Largest Speed)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "When a hydraulic cylinder decelerates a moving load in its end cushion, how high does the trapped cushion pressure rise, and what is the fastest speed the cushion can stop it from?",
    "description": "Check of the end cushion of a hydraulic cylinder stopping a moving load at the rod end: the kinetic energy and the deceleration over the cushion length (as the uniform acceleration tool), the force needed to stop the mass plus the drive force still pushing on the full bore and any external load, the pressure in the trapped annulus that this needs, and the highest approach speed the cushion can take at its rated pressure, against the cushion pressure rating.",
    "keywords": [
      "MAKEOS",
      "cylinder cushion",
      "deceleration",
      "cushion pressure",
      "hydraulic cylinder",
      "end of stroke",
      "kinetic energy"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Moving mass",
        "type": "number",
        "default": 200,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Speed entering the cushion",
        "type": "number",
        "default": 0.5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sc",
        "label": "Cushion length",
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
        "key": "Fext",
        "label": "External force pushing the same way",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": -10000000,
        "max": 10000000,
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
        "label": "Bore",
        "type": "number",
        "default": 63,
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
        "default": 36,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pDrive",
        "label": "Pressure still on the full bore during cushioning",
        "type": "number",
        "default": 100,
        "unit": "bar",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pRate",
        "label": "Cushion pressure rating",
        "type": "number",
        "default": 250,
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
    "id": "pipe-bend-thrust-check",
    "name": "Pipe Bend Thrust Check (Pressure and Momentum Force, Resultant, Thrust Block Bearing)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What force does the water push on this pipe bend from its pressure and flow, and is the thrust block big enough for the ground to carry it?",
    "description": "Thrust on an unrestrained pipe bend: the flow velocity in the pipe (as the pipe friction tool), the pressure force and the momentum force of the flow, the resultant thrust bisecting the bend angle, and the bearing pressure of the thrust block on the ground with the block area needed, against the ground’s allowable bearing pressure.",
    "keywords": [
      "MAKEOS",
      "thrust block",
      "pipe bend",
      "water main",
      "momentum force",
      "anchor block",
      "bearing pressure"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Flow",
        "type": "number",
        "default": 3000,
        "unit": "L/min",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pipe inside diameter",
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
        "key": "p",
        "label": "Pressure (test pressure for the worst case)",
        "type": "number",
        "default": 10,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang",
        "label": "Bend angle (change of direction)",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 1,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_thrust_block",
        "label": "Thrust block",
        "type": "heading"
      },
      {
        "key": "Ab",
        "label": "Block bearing area against the ground",
        "type": "number",
        "default": 1,
        "unit": "m²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qa",
        "label": "Allowable ground bearing pressure",
        "type": "number",
        "default": 75,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "jet-impact-force-check",
    "name": "Jet Impact Force Check (Nozzle Flow and Velocity, Reaction, Force on a Plate)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "For a water jet from a nozzle at this pressure, how much flow and speed does it have, what reaction does the operator or mounting feel, and what force does it put on a plate it hits?",
    "description": "Forces from a liquid jet: the flow and jet velocity through the nozzle from its size, discharge coefficient and pressure (as the orifice flow tool), the reaction force on the nozzle, and the force on a flat plate struck by the jet at an angle and possibly moving away from it, against the largest reaction force a hand-held nozzle or mounting should take.",
    "keywords": [
      "MAKEOS",
      "water jet",
      "jet force",
      "nozzle reaction",
      "impact force",
      "momentum",
      "washdown"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Nozzle orifice diameter",
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
        "key": "Cd",
        "label": "Discharge coefficient",
        "type": "number",
        "default": 0.95,
        "unit": "",
        "min": 0.1,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pressure at the nozzle",
        "type": "number",
        "default": 5,
        "unit": "bar",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_target",
        "label": "Target",
        "type": "heading"
      },
      {
        "key": "beta",
        "label": "Angle between the jet and the plate",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 1,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "u",
        "label": "Plate speed away from the jet",
        "type": "number",
        "default": 0,
        "unit": "m/s",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rmax",
        "label": "Largest reaction force accepted",
        "type": "number",
        "default": 250,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "spring-clamp-hydraulic-release",
    "name": "Spring Clamp Hydraulic Release Check (Clamp Force, Release Pressure, Spring Stress)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "For a clamp or brake held on by springs and released by a hydraulic piston, is the spring clamping force enough, what pressure releases it, and are the springs stressed within limits when released?",
    "description": "Check of a spring-applied, hydraulically released clamp, brake or tool holder: the rate, load and stress of each coil spring at the clamped length (as the compression spring tool), the total clamping force of the springs in parallel, the extra compression and load at the release stroke, the hydraulic pressure on the annular release piston needed with an allowance for seal friction, the spring stress at release and the clearance to solid, against the clamping force needed, the pressure available and the allowable stress.",
    "keywords": [
      "MAKEOS",
      "spring-applied",
      "hydraulic release",
      "fail-safe clamp",
      "release pressure",
      "spring stack",
      "tool clamp"
    ],
    "fields": [
      {
        "key": "Fc",
        "label": "Clamping force needed",
        "type": "number",
        "default": 3000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nS",
        "label": "Number of springs",
        "type": "number",
        "default": 10,
        "unit": "springs",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "stroke",
        "label": "Release stroke",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_each_spring",
        "label": "Each spring",
        "type": "heading"
      },
      {
        "key": "d",
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
        "key": "D",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 22,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Na",
        "label": "Active coils",
        "type": "number",
        "default": 6,
        "unit": "coils",
        "min": 0.5,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "End type",
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
        "label": "Unloaded length",
        "type": "number",
        "default": 48,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lw",
        "label": "Length when clamped",
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
        "key": "h_release_piston",
        "label": "Release piston",
        "type": "heading"
      },
      {
        "key": "Do",
        "label": "Piston outside diameter",
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
        "key": "Di",
        "label": "Piston inside diameter (0 = full piston)",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fric",
        "label": "Seal friction allowance",
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
        "key": "pAv",
        "label": "Pressure available to release",
        "type": "number",
        "default": 50,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "extraction-duct-check",
    "name": "Extraction Duct Check (Total Airflow, Duct Velocity, Friction Loss, Fan Pressure)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For a dust or fume extraction system with several hoods on one duct, is the duct velocity high enough to carry the dust, what is the pressure loss, and can the fan supply it?",
    "description": "Check of a local exhaust ventilation duct: the total airflow from the hoods, the duct velocity against the least transport velocity for the dust, the Reynolds number, friction factor and pressure loss in the duct and fittings at the full flow (as the pipe friction tool with air properties), and the fan pressure needed with the hood entry loss, against the fan pressure available.",
    "keywords": [
      "MAKEOS",
      "dust extraction",
      "LEV",
      "duct velocity",
      "transport velocity",
      "fan pressure",
      "pressure drop"
    ],
    "fields": [
      {
        "key": "nH",
        "label": "Number of hoods",
        "type": "number",
        "default": 4,
        "unit": "hoods",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "qH",
        "label": "Airflow per hood",
        "type": "number",
        "default": 800,
        "unit": "m³/h",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Main duct diameter",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Duct length to the fan",
        "type": "number",
        "default": 25,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Duct roughness",
        "type": "number",
        "default": 0.15,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Fittings loss coefficient (total)",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 0,
        "max": 1000,
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
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Air kinematic viscosity",
        "type": "number",
        "default": 15,
        "unit": "cSt",
        "min": 0.000001,
        "max": 1000,
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
        "key": "vMin",
        "label": "Least transport velocity for the dust",
        "type": "number",
        "default": 15,
        "unit": "m/s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pHood",
        "label": "Hood entry loss",
        "type": "number",
        "default": 250,
        "unit": "Pa",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pFan",
        "label": "Fan pressure available at this flow",
        "type": "number",
        "default": 2000,
        "unit": "Pa",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gravity-chute-check",
    "name": "Gravity Chute Check (Sliding Acceleration, Exit Speed, Impact Energy, Least Angle)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Will parts slide down this gravity chute, how fast will they be going at the bottom, and is that slow enough not to damage them?",
    "description": "Check of a sliding gravity chute or slide: the forces along the slope from the part weight and friction (as the inclined plane tool), the acceleration and whether the part slides at all, the least chute angle to slide, the exit speed and time over the chute length from the entry speed (as the uniform acceleration tool), and the impact energy at the bottom, against the largest exit speed you accept.",
    "keywords": [
      "MAKEOS",
      "gravity chute",
      "slide",
      "friction angle",
      "exit speed",
      "parts handling",
      "inclined plane"
    ],
    "fields": [
      {
        "key": "angle",
        "label": "Chute angle",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 89.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Sliding friction coefficient",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Chute length",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "u",
        "label": "Entry speed",
        "type": "number",
        "default": 0,
        "unit": "m/s",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Part mass",
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
        "key": "vMax",
        "label": "Largest exit speed",
        "type": "number",
        "default": 4,
        "unit": "m/s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "torque-wrench-adapter-check",
    "name": "Torque Wrench Adapter Check (Extension Correction, Actual Torque, Bolt Preload)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "When a crowfoot or extension adapter lengthens my torque wrench, what should I set the wrench to, and what torque and bolt preload does a given setting really give?",
    "description": "Correction of a torque wrench used with an extension adapter: the effective lever length from the wrench length and the adapter length at its angle, the actual torque at the bolt for the wrench setting, the setting that gives the target torque, and the bolt preload and share of proof load from the actual torque with the nut factor (as the bolt torque and preload tool), against the target preload and the largest share of proof load allowed.",
    "keywords": [
      "MAKEOS",
      "torque wrench",
      "crowfoot",
      "extension adapter",
      "torque correction",
      "bolt preload",
      "tightening"
    ],
    "fields": [
      {
        "key": "Lw",
        "label": "Wrench length (hand grip centre to square drive)",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Adapter length (square drive to bolt centre)",
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
        "key": "phi",
        "label": "Adapter angle to the wrench (0 = straight in line)",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tset",
        "label": "Wrench setting",
        "type": "number",
        "default": 81,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
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
        "max": 500,
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
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Nut factor K",
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
        "key": "Sp",
        "label": "Proof strength of the bolt",
        "type": "number",
        "default": 600,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pct",
        "label": "Target preload (% of proof)",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Preload tolerance (±)",
        "type": "number",
        "default": 5,
        "unit": "% of proof",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pctMax",
        "label": "Largest preload (% of proof)",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "friction-wheel-drive-check",
    "name": "Friction Wheel Drive Check (Tangential Force, Normal Force Needed, Contact Stress, Speed Ratio)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a friction wheel (traction) drive between two rollers, how hard must they be pressed together to carry the power without slipping, and is the contact stress within limits?",
    "description": "Check of a friction (traction) drive of two cylinders pressed together: the input torque and the tangential force at the driver, the normal force needed to carry it without slip from the friction coefficient and a slip factor, the contact half-width and peak contact pressure of the two cylinders (as the Hertz contact stress tool for line contact), the output speed and the load on the shaft bearings, against the allowable contact pressure.",
    "keywords": [
      "MAKEOS",
      "friction drive",
      "traction drive",
      "friction wheel",
      "Hertz contact",
      "roller drive",
      "normal force"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Power",
        "type": "number",
        "default": 0.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Driver speed",
        "type": "number",
        "default": 300,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R1",
        "label": "Driver roller radius",
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
        "key": "R2",
        "label": "Driven roller radius",
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
        "key": "mu",
        "label": "Friction coefficient at the contact",
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
        "key": "SF",
        "label": "Slip safety factor",
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
        "key": "h_contact",
        "label": "Contact",
        "type": "heading"
      },
      {
        "key": "L",
        "label": "Contact width",
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
        "key": "E1",
        "label": "Modulus of the driver",
        "type": "number",
        "default": 210,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu1",
        "label": "Poisson’s ratio of the driver",
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
        "key": "E2",
        "label": "Modulus of the driven roller",
        "type": "number",
        "default": 210,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu2",
        "label": "Poisson’s ratio of the driven roller",
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
        "key": "allow",
        "label": "Allowable contact pressure",
        "type": "number",
        "default": 600,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "taper-bush-grip-check",
    "name": "Taper Bush Grip Check (Screw Preload, Wedge Normal Force, Torque Capacity)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "For a split taper bush pulled into a hub by its screws, what grip does it put on the shaft, and will it carry the drive torque without slipping?",
    "description": "Check of a taper-lock (split taper) bush or keyless taper clamp: the preload of each tightening screw from its torque and nut factor and its share of proof load (as the bolt torque and preload tool), the total axial force, the normal force on the taper from the wedge action with friction on the taper face, and the friction torque on the shaft at the bore, against the drive torque from power and speed with a service factor.",
    "keywords": [
      "MAKEOS",
      "taper bush",
      "taper lock",
      "keyless bushing",
      "shaft grip",
      "wedge",
      "friction torque"
    ],
    "fields": [
      {
        "key": "nScr",
        "label": "Number of tightening screws",
        "type": "number",
        "default": 2,
        "unit": "screws",
        "min": 1,
        "max": 24,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d",
        "label": "Screw nominal diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Screw pitch",
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
        "key": "T",
        "label": "Screw tightening torque",
        "type": "number",
        "default": 20,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Nut factor K",
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
        "key": "Sp",
        "label": "Screw proof strength",
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
        "key": "h_taper_and_shaft",
        "label": "Taper and shaft",
        "type": "heading"
      },
      {
        "key": "alpha",
        "label": "Taper half angle",
        "type": "number",
        "default": 8,
        "unit": "°",
        "min": 1,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "muT",
        "label": "Friction on the taper face",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ds",
        "label": "Shaft diameter",
        "type": "number",
        "default": 35,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "muS",
        "label": "Friction between bush and shaft",
        "type": "number",
        "default": 0.15,
        "unit": "",
        "min": 0.02,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "Pw",
        "label": "Power",
        "type": "number",
        "default": 5.5,
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
        "key": "SF",
        "label": "Service factor",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
