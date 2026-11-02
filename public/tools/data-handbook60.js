// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook60) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "sprocket-bore-key-plan",
    "name": "Sprocket Bore and Key Plan (Sprocket Diameters, Shaft Keyseat Readings, Wall Under the Teeth)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a roller chain sprocket bored and keyed to a shaft, what are its diameters and keyseat readings, and is there enough metal left between the keyway and the tooth roots?",
    "description": "Plan of a roller chain sprocket blank and its shaft key: the pitch, bottom, caliper and outside diameters of the sprocket (as the sprocket diameters tool), the chordal height, keyseat measurement S and measurement over the key T for the shaft (as the keyseat depth tool), and the wall left between the top of the key (where the hub keyway reaches) and the bottom diameter of the teeth, against the least wall you will accept.",
    "keywords": [
      "MAKEOS",
      "sprocket",
      "keyseat",
      "keyway",
      "bore size",
      "roller chain",
      "hub wall"
    ],
    "fields": [
      {
        "key": "p",
        "label": "Chain pitch",
        "type": "number",
        "default": 15.875,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "N",
        "label": "Number of teeth",
        "type": "number",
        "default": 17,
        "unit": "teeth",
        "min": 5,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Dr",
        "label": "Roller diameter",
        "type": "number",
        "default": 10.16,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_shaft_and_key",
        "label": "Shaft and key",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Shaft (bore) diameter",
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
        "key": "w",
        "label": "Key width",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Shaft keyseat depth at the side",
        "type": "number",
        "default": 4,
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
        "default": 7,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wMin",
        "label": "Least wall under the teeth",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pinned-hub-drive-check",
    "name": "Pinned Hub Drive Check (Cross Pin Size, Pin Shear, Shaft Bearing and Torsion)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "For a hub or collar driven by a pin through the shaft, is the pin big enough, and do the bearing pressure and the weakened shaft stay within limits?",
    "description": "Check of a hub, collar or lever driven through a cross (taper or straight) pin: the torque from torque or power and speed, the pin diameter needed and the pin shear stress in double shear (as the taper pin torque tool), the bearing pressure of the pin on the shaft bore, the torsional stress in the shaft raised by the cross-hole stress concentration, and the pin-to-shaft size ratio, against your allowable stresses.",
    "keywords": [
      "MAKEOS",
      "taper pin",
      "cross pin",
      "pinned hub",
      "pin shear",
      "shaft cross hole",
      "collar drive"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Load given as",
        "type": "select",
        "default": "torque",
        "options": [
          [
            "torque",
            "Torque"
          ],
          [
            "power",
            "Power and speed"
          ]
        ]
      },
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 60,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
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
        "key": "rpm",
        "label": "Speed",
        "type": "number",
        "default": 500,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Shaft diameter",
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
        "key": "dp",
        "label": "Pin mean diameter",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
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
        "key": "S",
        "label": "Safe shear stress of the pin",
        "type": "number",
        "default": 80,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sbA",
        "label": "Allowable bearing pressure on the shaft",
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
        "key": "Kt",
        "label": "Stress concentration at the cross hole",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tauA",
        "label": "Allowable shaft shear stress",
        "type": "number",
        "default": 60,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratioMax",
        "label": "Largest pin ÷ shaft diameter",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.05,
        "max": 0.6,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "press-flywheel-check",
    "name": "Press Flywheel and Motor Check (Stroke Energy, Rim Mass, Rim Stress, Motor Power)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "For a mechanical press, does the existing flywheel store enough energy for each stroke, is its rim speed safe, and is the motor big enough to recover it between strokes?",
    "description": "Check of a press flywheel and drive motor: the energy per stroke from peak force and working travel or entered directly, the average power, the energy the flywheel must give up during the cut for the allowed speed drop, the rim mass needed and the rim section, and the rim hoop stress from its speed (as the press flywheel sizing tool), against the rim mass fitted, your allowable rim stress and the motor power with drive efficiency.",
    "keywords": [
      "MAKEOS",
      "press flywheel",
      "punch press",
      "stroke energy",
      "rim stress",
      "press motor",
      "slowdown"
    ],
    "fields": [
      {
        "key": "emode",
        "label": "Energy per stroke from",
        "type": "select",
        "default": "force",
        "options": [
          [
            "force",
            "Peak force × working travel"
          ],
          [
            "energy",
            "Entered energy"
          ]
        ]
      },
      {
        "key": "F",
        "label": "Peak force",
        "type": "number",
        "default": 1601.4,
        "unit": "kN",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Working travel (e.g. plate thickness)",
        "type": "number",
        "default": 101.6,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Energy per stroke (entered)",
        "type": "number",
        "default": 10,
        "unit": "kJ",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "spm",
        "label": "Strokes per minute",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tcut",
        "label": "Time of the actual cut",
        "type": "number",
        "default": 0.75,
        "unit": "s",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_flywheel",
        "label": "Flywheel",
        "type": "heading"
      },
      {
        "key": "Dm",
        "label": "Mean rim diameter",
        "type": "number",
        "default": 1.9812,
        "unit": "m",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Flywheel speed",
        "type": "number",
        "default": 200,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "red",
        "label": "Speed reduction during the cut",
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
        "key": "rho",
        "label": "Rim material density",
        "type": "number",
        "default": 7200,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y",
        "label": "Rim depth ÷ width",
        "type": "number",
        "default": 1.22,
        "unit": "",
        "min": 0.2,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mFit",
        "label": "Rim mass fitted",
        "type": "number",
        "default": 3200,
        "unit": "kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Allowable rim stress",
        "type": "number",
        "default": 7,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_motor",
        "label": "Motor",
        "type": "heading"
      },
      {
        "key": "Pmot",
        "label": "Motor power",
        "type": "number",
        "default": 75,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Drive efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "drop-hammer-forging-plan",
    "name": "Drop Hammer Forging Plan (Force Needed, Set per Blow, Number of Blows)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "For upsetting or forging a part under a drop hammer, how far will each blow squeeze it, and how many blows will it take?",
    "description": "Plan of a drop hammer or drop stamp operation: the force needed to deform the part from its area, the flow stress at the forging temperature and a constraint factor, then the set per blow at which the hammer’s energy (falling mass, drop height and efficiency) gives that average force (as the drop hammer blow tool, solved for the set), the impact speed and energy per blow, and the number of blows for the total reduction, against the most blows you will allow per heat.",
    "keywords": [
      "MAKEOS",
      "drop hammer",
      "forging",
      "upsetting",
      "blow energy",
      "flow stress",
      "number of blows"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Falling mass (tup and die)",
        "type": "number",
        "default": 500,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Drop height before contact",
        "type": "number",
        "default": 1.5,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Blow efficiency (share into the work)",
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
        "key": "h_part",
        "label": "Part",
        "type": "heading"
      },
      {
        "key": "A",
        "label": "Area being forged (average over the blow)",
        "type": "number",
        "default": 2000,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sf",
        "label": "Flow stress at forging temperature",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Constraint (shape) factor",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "red",
        "label": "Total height reduction needed",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "maxBlows",
        "label": "Most blows allowed per heat",
        "type": "number",
        "default": 4,
        "unit": "blows",
        "min": 1,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "v-belt-motor-load-check",
    "name": "V-Belt Drive Motor Load Check (Belts, Driven Speed, Shaft Load on the Motor)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a V-belt drive off an electric motor, how many belts does it need, does the driven speed come out right, and is the belt pull within the motor’s allowable shaft load?",
    "description": "Check of a V-belt or flat belt drive against its motor: the driven pulley size and speed, belt length, wrap, belt speed, effective pull, centrifugal tension, number of belts and the resultant shaft load from the tight and slack side tensions (as the V-belt drive design tool), against the grooves on the pulleys, the driven speed you need and the radial load the motor bearings are rated for at the pulley position.",
    "keywords": [
      "MAKEOS",
      "V-belt",
      "belt drive",
      "motor shaft load",
      "overhung load",
      "belt tension",
      "driven speed"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Power",
        "type": "number",
        "default": 7.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Motor speed",
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
        "key": "d1",
        "label": "Motor pulley pitch diameter",
        "type": "number",
        "default": 125,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Speed ratio (motor ÷ driven speed)",
        "type": "number",
        "default": 2.5,
        "unit": "",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Centre distance",
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
        "key": "SF",
        "label": "Service factor",
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
        "key": "groove",
        "label": "Belt",
        "type": "select",
        "default": "v",
        "options": [
          [
            "v",
            "V-belt (38° groove)"
          ],
          [
            "flat",
            "Flat belt"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Friction coefficient",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mass",
        "label": "Belt mass per metre",
        "type": "number",
        "default": 0.1,
        "unit": "kg/m",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Allowable tension per belt",
        "type": "number",
        "default": 400,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_motor_and_duty",
        "label": "Motor and duty",
        "type": "heading"
      },
      {
        "key": "nG",
        "label": "Grooves on the pulleys",
        "type": "number",
        "default": 3,
        "unit": "grooves",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Fr",
        "label": "Motor allowable radial load at the pulley",
        "type": "number",
        "default": 2500,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n2req",
        "label": "Driven speed required",
        "type": "number",
        "default": 580,
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
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "conveyor-drive-train-check",
    "name": "Conveyor Drive Train Check (Belt Pull, Motor Power, Reducer Ratio, Gearbox Torque)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For a belt conveyor driven through a gear reducer, is the motor big enough, does the reducer ratio give the right belt speed, and is the gearbox rated for the pulley torque?",
    "description": "Check of a belt conveyor drive train: the load per metre, effective belt pull from friction and lift, the power at the pulley and at the motor with efficiency and margin, the tight and slack side tensions, the pulley torque and speed (as the conveyor drive sizing tool), then the reducer ratio needed from the motor speed, the belt speed with the reducer you have, and the pulley torque with a service factor against the gearbox rating.",
    "keywords": [
      "MAKEOS",
      "belt conveyor",
      "conveyor drive",
      "gear reducer",
      "drive pulley",
      "motor power",
      "gearbox rating"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Throughput",
        "type": "number",
        "default": 100,
        "unit": "t/h",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Design belt speed",
        "type": "number",
        "default": 1.5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Conveyor length (centres)",
        "type": "number",
        "default": 50,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hl",
        "label": "Lift (positive up)",
        "type": "number",
        "default": 5,
        "unit": "m",
        "min": -500,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qm",
        "label": "Belt and idler moving mass per metre (both runs)",
        "type": "number",
        "default": 30,
        "unit": "kg/m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Overall friction factor",
        "type": "number",
        "default": 0.025,
        "unit": "",
        "min": 0.005,
        "max": 0.2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Drive pulley friction coefficient",
        "type": "number",
        "default": 0.35,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "wrap",
        "label": "Wrap on the drive pulley",
        "type": "number",
        "default": 200,
        "unit": "°",
        "min": 90,
        "max": 480,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Drive pulley diameter",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Drive efficiency",
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
        "key": "marg",
        "label": "Power margin",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_motor_and_reducer",
        "label": "Motor and reducer",
        "type": "heading"
      },
      {
        "key": "nm",
        "label": "Motor speed",
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
        "key": "iR",
        "label": "Reducer ratio fitted",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolV",
        "label": "Belt speed tolerance",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pinst",
        "label": "Motor power fitted",
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
        "key": "TgR",
        "label": "Gearbox rated output torque",
        "type": "number",
        "default": 500,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SFg",
        "label": "Gearbox service factor",
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
    "id": "vessel-shell-plan",
    "name": "Pressure Vessel Shell Plan (Required Thickness, Plate Chosen, MAWP, Test Water)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For a cylindrical pressure vessel with 2:1 ellipsoidal heads, what thickness is needed, what working pressure does the plate I have allow, and how much water does the hydrostatic test take?",
    "description": "Plan of a cylindrical pressure vessel shell and heads: the required thickness of the shell and of 2:1 ellipsoidal heads with joint efficiency and corrosion allowance and the hydrostatic test pressure (as the pressure vessel thickness tool), then the maximum allowable working pressure of the plate you choose for both, the volume and water mass for the hydrostatic test, and the mass of the shell course.",
    "keywords": [
      "MAKEOS",
      "pressure vessel",
      "shell thickness",
      "MAWP",
      "ellipsoidal head",
      "hydrostatic test",
      "corrosion allowance"
    ],
    "fields": [
      {
        "key": "p",
        "label": "Design pressure",
        "type": "number",
        "default": 1,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Inside diameter",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S",
        "label": "Allowable stress at design temperature",
        "type": "number",
        "default": 138,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Joint efficiency",
        "type": "number",
        "default": 0.85,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "CA",
        "label": "Corrosion allowance",
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
        "key": "tf",
        "label": "Hydrotest factor",
        "type": "number",
        "default": 1.3,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_plate_and_size",
        "label": "Plate and size",
        "type": "heading"
      },
      {
        "key": "tUse",
        "label": "Plate thickness chosen (shell and heads)",
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
        "key": "L",
        "label": "Shell length (tangent to tangent)",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Plate density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "turning-cut-power-check",
    "name": "Turning Cut Power Check (Equivalent Chip Thickness, Cutting Forces, Power, Speed Limit)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "Will this turning cut fit within the lathe’s spindle power, what forces does it put on the tool, and how fast could I run before the power runs out?",
    "description": "Check of a turning cut against the lathe: the chip area, equivalent chip thickness, removal rate, cutting force, feed-plane force and its axial and radial parts and the cutting power (as the equivalent chip thickness cutting forces tool), the highest cutting speed the spindle power allows for the same feed and depth (as the full-power cutting speed tool), and the spindle speed for the work diameter, against the power available and the spindle speed limit.",
    "keywords": [
      "MAKEOS",
      "turning power",
      "cutting force",
      "equivalent chip thickness",
      "spindle power",
      "removal rate",
      "lathe capacity"
    ],
    "fields": [
      {
        "key": "f",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.8,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
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
        "key": "CEL",
        "label": "Engaged cutting edge length",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
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
        "key": "Kc",
        "label": "Specific cutting force at this ECT",
        "type": "number",
        "default": 1500,
        "unit": "N/mm²",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Feed-plane force ÷ cutting force",
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
        "key": "cfa",
        "label": "Chip flow angle",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_lathe",
        "label": "Lathe",
        "type": "heading"
      },
      {
        "key": "Pavail",
        "label": "Spindle motor power",
        "type": "number",
        "default": 18.5,
        "unit": "kW",
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
        "key": "Dw",
        "label": "Work diameter",
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
        "key": "nMax",
        "label": "Spindle speed limit",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pressure-tube-torsion-check",
    "name": "Pressurised Tube Under Torsion Check (Hoop, Axial and Shear Stress, Principal Stresses, Yield)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For a thin-walled tube under internal pressure that also carries torque and an axial load, what are the principal stresses, and is the safety factor against yield enough?",
    "description": "Check of a thin-walled tube or shaft under internal pressure, end thrust and torque: the hoop and axial stresses from pressure (closed ends) plus the axial load, the shear stress from torque in the thin wall, then the principal stresses, their direction, the maximum shear and the von Mises equivalent stress with the safety factor against yield (as the principal stress tool), against your required factor.",
    "keywords": [
      "MAKEOS",
      "combined stress",
      "thin-walled tube",
      "hoop stress",
      "torsion",
      "von Mises",
      "principal stress"
    ],
    "fields": [
      {
        "key": "OD",
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
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Internal pressure",
        "type": "number",
        "default": 10,
        "unit": "MPa",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "N",
        "label": "Axial load (tension positive)",
        "type": "number",
        "default": 0,
        "unit": "kN",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 2000,
        "unit": "N·m",
        "min": -100000000,
        "max": 100000000,
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
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 250,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required safety factor",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
