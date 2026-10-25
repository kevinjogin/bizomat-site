// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook28) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "keyed-hub-design",
    "name": "Keyed Shaft and Hub Design",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How long must the key be to carry this drive, does the hub fit it, and is the keyed shaft strong enough?",
    "description": "Design of a parallel-keyed shaft-to-hub connection from the power and speed: design torque with service factor, force at the shaft surface, key length for shear and for crushing on the half-depth bearing face, the effect of a second key, the hub length needed, and the shaft torsional stress against 75% of the allowable as the handbook recommends for keyed shafts.",
    "keywords": [
      "MAKEOS",
      "keyed hub",
      "key length",
      "key design",
      "keyway",
      "hub length",
      "shaft key"
    ],
    "fields": [
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
        "key": "SF",
        "label": "Service factor",
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
        "key": "d",
        "label": "Shaft diameter",
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
        "key": "w",
        "label": "Key width",
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
        "key": "h",
        "label": "Key height",
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
        "key": "hubL",
        "label": "Hub length available",
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
        "key": "nk",
        "label": "Keys",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "One key"
          ],
          [
            "2",
            "Two keys at 180°"
          ]
        ]
      },
      {
        "key": "tauK",
        "label": "Allowable key shear stress",
        "type": "number",
        "default": 60,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sigC",
        "label": "Allowable crushing stress (weakest of key, shaft, hub)",
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
        "key": "tauS",
        "label": "Allowable shaft shear stress (unkeyed)",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "band-brake-stop-design",
    "name": "Band Brake Stopping Design",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Can this band brake stop the load in the time required, what lever force does it need, and how hot does it get?",
    "description": "Design of a simple band brake to stop a rotating inertia: braking torque to stop in the target time against a load that resists or overhauls (as in hoist lowering), design torque with a service factor, band tensions from the Euler relation, lever force and lining pressure, actual stopping time and angle, energy per stop, drum temperature rise and average heat.",
    "keywords": [
      "MAKEOS",
      "band brake",
      "brake design",
      "stopping time",
      "hoist brake",
      "brake heat",
      "lever force"
    ],
    "fields": [
      {
        "key": "h_duty",
        "label": "Duty",
        "type": "heading"
      },
      {
        "key": "J",
        "label": "Inertia at the brake drum",
        "type": "number",
        "default": 5,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Speed at the start of braking",
        "type": "number",
        "default": 600,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Required stopping time",
        "type": "number",
        "default": 2,
        "unit": "s",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TL",
        "label": "Load torque",
        "type": "number",
        "default": 50,
        "unit": "N·m",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dir",
        "label": "Load torque",
        "type": "select",
        "default": "drive",
        "options": [
          [
            "resist",
            "Resists motion (helps stop)"
          ],
          [
            "drive",
            "Drives motion (overhauling, e.g. lowering)"
          ]
        ]
      },
      {
        "key": "SF",
        "label": "Service factor",
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
        "key": "h_brake",
        "label": "Brake",
        "type": "heading"
      },
      {
        "key": "D",
        "label": "Drum diameter",
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
        "key": "wrap",
        "label": "Wrap angle",
        "type": "number",
        "default": 270,
        "unit": "°",
        "min": 30,
        "max": 340,
        "step": "any",
        "integer": false,
        "sens": true
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
        "key": "a",
        "label": "Lever length to the applied force",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Lever length to the band slack end",
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
        "key": "w",
        "label": "Band width",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fmax",
        "label": "Lever force available",
        "type": "number",
        "default": 300,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pall",
        "label": "Allowable lining pressure",
        "type": "number",
        "default": 0.5,
        "unit": "MPa",
        "min": 0.000001,
        "max": 20,
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
        "key": "mass",
        "label": "Drum mass absorbing heat",
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
        "key": "cp",
        "label": "Drum specific heat",
        "type": "number",
        "default": 460,
        "unit": "J/kg·K",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sph",
        "label": "Stops per hour",
        "type": "number",
        "default": 30,
        "unit": "",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "conveyor-drive-sizing",
    "name": "Belt Conveyor Drive Sizing",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What belt pull and motor power does this belt conveyor need, and will the drive pulley grip without slipping?",
    "description": "Simplified sizing of a belt conveyor drive: load per metre from the throughput and speed, effective belt tension from idler and belt resistance (an overall friction factor) plus lift, power at the drive pulley and at the motor, minimum slack-side tension for the drive pulley’s wrap and friction (Euler), tight-side tension, pulley torque and speed.",
    "keywords": [
      "MAKEOS",
      "belt conveyor",
      "conveyor power",
      "effective tension",
      "drive pulley",
      "take-up tension",
      "bulk handling"
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
        "label": "Belt speed",
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
        "max": 360,
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
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "marg",
        "label": "Motor margin",
        "type": "number",
        "default": 10,
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
    "id": "fixture-clamp-force",
    "name": "Fixture Clamping Force and Clamp Screw Torque",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How much clamping force holds this workpiece against the cutting forces, and how tight must each clamp screw be?",
    "description": "Clamping force needed to hold a workpiece in a fixture against cutting forces, either by friction alone or with the cutting force taken by a positive stop, with a safety factor; the force per clamp, the screw force for a strap clamp from its lever geometry, the screw tightening torque from the nut factor and the screw stress.",
    "keywords": [
      "MAKEOS",
      "clamping force",
      "fixture design",
      "strap clamp",
      "workholding",
      "clamp torque",
      "jig and fixture"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Cutting force taken by",
        "type": "select",
        "default": "friction",
        "options": [
          [
            "friction",
            "Friction only (no stop)"
          ],
          [
            "stop",
            "A positive stop (clamps hold against lift)"
          ]
        ]
      },
      {
        "key": "Fcut",
        "label": "Cutting force along the locating face",
        "type": "number",
        "default": 2000,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Flift",
        "label": "Force tending to lift the work",
        "type": "number",
        "default": 300,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Safety factor",
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
        "key": "mu1",
        "label": "Friction, clamp to work",
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
        "key": "mu2",
        "label": "Friction, work to locators",
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
        "key": "nc",
        "label": "Number of clamps",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_strap_clamp_and_screw",
        "label": "Strap clamp and screw",
        "type": "heading"
      },
      {
        "key": "A",
        "label": "Screw to workpiece contact distance",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Screw to heel distance",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Screw diameter",
        "type": "number",
        "default": 12,
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
        "default": 1.75,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
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
        "key": "Sp",
        "label": "Screw proof strength",
        "type": "number",
        "default": 600,
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
    "id": "lifting-beam-design",
    "name": "Lifting Beam and Spreader Beam Check",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Is this lifting beam or spreader bar strong and stiff enough for the load, and what are the sling tensions?",
    "description": "Check of a below-the-hook beam: a lifting beam (one top lug, load hung from two points, beam in bending) for bending stress and deflection, or a spreader beam (top slings to the ends, beam in compression) for the compression from the sling angle and Euler buckling, with the sling leg tensions, using a dynamic factor on the load.",
    "keywords": [
      "MAKEOS",
      "lifting beam",
      "spreader beam",
      "spreader bar",
      "below the hook",
      "sling angle",
      "rigging design"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Beam type",
        "type": "select",
        "default": "lifting",
        "options": [
          [
            "lifting",
            "Lifting beam (bending)"
          ],
          [
            "spreader",
            "Spreader beam (compression)"
          ]
        ]
      },
      {
        "key": "mass",
        "label": "Load mass",
        "type": "number",
        "default": 5000,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dyn",
        "label": "Dynamic factor",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S",
        "label": "Spacing of the load lift points",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "theta",
        "label": "Top sling angle from vertical (spreader)",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_section",
        "label": "Section",
        "type": "heading"
      },
      {
        "key": "Z",
        "label": "Elastic section modulus",
        "type": "number",
        "default": 300000,
        "unit": "mm³",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Second moment of area (least, for buckling)",
        "type": "number",
        "default": 20000000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 10000000000000,
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
        "key": "allow",
        "label": "Allowable bending or compressive stress",
        "type": "number",
        "default": 160,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Section area (spreader)",
        "type": "number",
        "default": 4000,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nb",
        "label": "Required buckling factor (spreader)",
        "type": "number",
        "default": 3,
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
    "id": "beam-sizing",
    "name": "Beam Sizing for Strength and Deflection",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What section modulus and second moment of area does this beam need for its loads, span and deflection limit?",
    "description": "Required section properties for a beam carrying a uniform load and a point load together: maximum bending moment by superposition (sampled along a simple span, or at the critical sections of a cantilever or fixed-ended beam), the section modulus for the allowable stress, the second moment of area for a span-over deflection limit, and the utilisation of a chosen section.",
    "keywords": [
      "MAKEOS",
      "beam sizing",
      "section modulus required",
      "deflection limit",
      "span over 360",
      "beam design",
      "second moment of area"
    ],
    "fields": [
      {
        "key": "sup",
        "label": "Supports",
        "type": "select",
        "default": "ss",
        "options": [
          [
            "ss",
            "Simply supported"
          ],
          [
            "cant",
            "Cantilever"
          ],
          [
            "fixed",
            "Fixed both ends (point load at mid-span)"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Span",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Uniform load",
        "type": "number",
        "default": 5,
        "unit": "N/mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Point load",
        "type": "number",
        "default": 10000,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Point load position from the left support (or fixed end)",
        "type": "number",
        "default": 1500,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 165,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
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
        "key": "lim",
        "label": "Deflection limit: span ÷",
        "type": "number",
        "default": 360,
        "unit": "",
        "min": 50,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Zc",
        "label": "Chosen section modulus (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "mm³",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ic",
        "label": "Chosen second moment of area (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "mm⁴",
        "min": 0,
        "max": 10000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "compressed-air-system-sizing",
    "name": "Compressed-Air System Sizing",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "How big a compressor, receiver and main pipe does this plant need, and what do the leaks cost?",
    "description": "Sizing a compressed-air system from the average demand: compressor free-air delivery with leakage and growth allowances, theoretical compression power with an overall efficiency (the same method as the compressor power tool), receiver volume to cover a peak deficit within the pressure band, the main pipe bore that keeps the pressure drop within a limit (Darcy–Weisbach, as the air line tool), and the annual energy cost of leakage.",
    "keywords": [
      "MAKEOS",
      "compressed air system",
      "compressor sizing",
      "air receiver",
      "air main pipe size",
      "air leak cost",
      "free air delivery"
    ],
    "fields": [
      {
        "key": "h_demand",
        "label": "Demand",
        "type": "heading"
      },
      {
        "key": "Q",
        "label": "Average demand of the users",
        "type": "number",
        "default": 5,
        "unit": "m³/min FAD",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "leak",
        "label": "Leakage allowance",
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
        "key": "growth",
        "label": "Future growth allowance",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "deficit",
        "label": "Peak demand above compressor output",
        "type": "number",
        "default": 2,
        "unit": "m³/min",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tpk",
        "label": "Duration of the peak",
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
        "key": "h_pressure",
        "label": "Pressure",
        "type": "heading"
      },
      {
        "key": "p",
        "label": "Working pressure",
        "type": "number",
        "default": 7,
        "unit": "bar g",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p1",
        "label": "Receiver upper pressure",
        "type": "number",
        "default": 8,
        "unit": "bar g",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Receiver lower pressure",
        "type": "number",
        "default": 6.5,
        "unit": "bar g",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_main_pipe",
        "label": "Main pipe",
        "type": "heading"
      },
      {
        "key": "L",
        "label": "Main pipe length (incl. fitting allowance)",
        "type": "number",
        "default": 100,
        "unit": "m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dpMax",
        "label": "Allowable pressure drop",
        "type": "number",
        "default": 0.1,
        "unit": "bar",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Air temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Pipe roughness",
        "type": "number",
        "default": 0.045,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_energy",
        "label": "Energy",
        "type": "heading"
      },
      {
        "key": "eff",
        "label": "Compressor overall efficiency",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 20,
        "max": 100,
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
    "id": "vibration-isolator-selection",
    "name": "Vibration Isolator Selection",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What mount stiffness and static deflection isolate this machine at its running speed, and how well do my chosen mounts work?",
    "description": "Selection of resilient mounts for a machine: the frequency ratio needed for a target isolation efficiency with damping, the natural frequency, static deflection and stiffness per mount that achieve it, and, for a chosen mount stiffness, the actual natural frequency, transmissibility and isolation, with a warning near resonance.",
    "keywords": [
      "MAKEOS",
      "vibration isolation",
      "anti-vibration mounts",
      "transmissibility",
      "natural frequency",
      "static deflection",
      "machine mounts"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Machine mass on the mounts",
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
        "key": "nm",
        "label": "Number of mounts",
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
        "key": "rpm",
        "label": "Lowest running speed (forcing)",
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
        "key": "iso",
        "label": "Target isolation",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 1,
        "max": 99.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "zeta",
        "label": "Damping ratio of the mounts",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Chosen stiffness per mount (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "N/mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "motor-gearbox-selection",
    "name": "Motor and Gearbox Selection",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What gear ratio, motor rating and starting torque does this load need, and is the inertia match reasonable?",
    "description": "Selection of an induction motor and gearbox for a load: ratio from the motor speed (pole count and slip) and load speed, running torque and power through the gearbox efficiency, reflected inertia and the acceleration torque to reach speed in the time required (the same method as the reflected inertia tool), the next standard IEC motor rating with a service factor, and its starting torque against the starting requirement.",
    "keywords": [
      "MAKEOS",
      "motor selection",
      "gearbox ratio",
      "gearmotor",
      "starting torque",
      "reflected inertia",
      "IEC motor rating"
    ],
    "fields": [
      {
        "key": "TL",
        "label": "Load torque",
        "type": "number",
        "default": 200,
        "unit": "N·m",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nL",
        "label": "Load speed",
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
        "key": "JL",
        "label": "Load inertia",
        "type": "number",
        "default": 2,
        "unit": "kg·m²",
        "min": 0,
        "max": 1000000,
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
        "key": "poles",
        "label": "Motor poles (50 Hz synchronous speed)",
        "type": "select",
        "default": "4",
        "options": [
          [
            "2",
            "2-pole (3000 rpm)"
          ],
          [
            "4",
            "4-pole (1500 rpm)"
          ],
          [
            "6",
            "6-pole (1000 rpm)"
          ],
          [
            "8",
            "8-pole (750 rpm)"
          ]
        ]
      },
      {
        "key": "slip",
        "label": "Full-load slip",
        "type": "number",
        "default": 3,
        "unit": "%",
        "min": 0,
        "max": 15,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Gearbox efficiency",
        "type": "number",
        "default": 94,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jm",
        "label": "Motor rotor inertia",
        "type": "number",
        "default": 0.04,
        "unit": "kg·m²",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Service factor",
        "type": "number",
        "default": 1.25,
        "unit": "",
        "min": 1,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "start",
        "label": "Motor starting torque ÷ rated torque",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
