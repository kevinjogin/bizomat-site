// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook25) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "forming-tool-depth",
    "name": "Forming Tool Step Depths and Angles",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What depth and angle must I grind on a flat or circular forming tool to produce these steps on the work?",
    "description": "Forming tool dimensions by the handbook methods: step depth and angle on a flat tool with front clearance, step depth on a tool with both rake and clearance from the work radii, and the radius of each step on a circular forming tool whose cutting face sits below centre.",
    "keywords": [
      "MAKEOS",
      "forming tool",
      "form tool",
      "circular form tool",
      "step depth",
      "rake correction",
      "screw machine tooling"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Tool",
        "type": "select",
        "default": "flat",
        "options": [
          [
            "flat",
            "Flat tool with clearance"
          ],
          [
            "rake",
            "Tool with rake and clearance"
          ],
          [
            "circular",
            "Circular tool (face below centre)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Radial step depth on the work (flat, circular)",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Front clearance angle (flat)",
        "type": "number",
        "default": 15,
        "unit": "°",
        "min": 0.000001,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Angle on the work (flat)",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 0.000001,
        "max": 89,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Larger work radius (rake)",
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
        "key": "r",
        "label": "Smaller work radius (rake)",
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
        "key": "F",
        "label": "Rake angle (rake)",
        "type": "number",
        "default": 10,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Clearance angle (rake)",
        "type": "number",
        "default": 15,
        "unit": "°",
        "min": 0.000001,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rt",
        "label": "Largest radius of the circular tool",
        "type": "number",
        "default": 38.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "off",
        "label": "Cutting face below centre (circular)",
        "type": "number",
        "default": 6.35,
        "unit": "mm",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "spade-drill-power",
    "name": "Spade Drilling Power and Thrust",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What power and thrust does this spade drilling operation need?",
    "description": "Power at the cutter and at the motor, and the thrust force, for spade drilling by the handbook formulas from drill diameter, feed, speed and the unit power of the work material, with an allowance for tool wear.",
    "keywords": [
      "MAKEOS",
      "spade drill",
      "spade drilling",
      "drilling thrust",
      "unit power",
      "large hole drilling",
      "machine power"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Drill diameter",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed per revolution",
        "type": "number",
        "default": 0.3,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Spindle speed",
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
        "key": "ukw",
        "label": "Unit power of the material",
        "type": "number",
        "default": 0.0359,
        "unit": "kW per cm³/min",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "em",
        "label": "Machine mechanical efficiency",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dull",
        "label": "Allowance for tool wear",
        "type": "number",
        "default": 25,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "avail",
        "label": "Motor power available",
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
    "id": "true-stress-strain",
    "name": "True Stress, True Strain and Flow Curve",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What are the nominal and true stress and strain at this point in a tensile test, and what does the flow curve predict?",
    "description": "Nominal (engineering) and true stress and strain from a tensile test load, original and current area and gauge length, the flow stress from the strain-hardening law σ = K εⁿ, elongation and reduction of area — the metalworking quantities used for forming calculations.",
    "keywords": [
      "MAKEOS",
      "true stress",
      "true strain",
      "flow curve",
      "strain hardening exponent",
      "engineering stress",
      "tensile test"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Load",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A0",
        "label": "Original cross-section area",
        "type": "number",
        "default": 78.54,
        "unit": "mm²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Current (or fracture) area, 0 = constant volume",
        "type": "number",
        "default": 0,
        "unit": "mm²",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "l0",
        "label": "Original gauge length",
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
        "key": "l",
        "label": "Current (or fracture) gauge length",
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
        "key": "K",
        "label": "Strength coefficient K",
        "type": "number",
        "default": 530,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nexp",
        "label": "Strain-hardening exponent n",
        "type": "number",
        "default": 0.26,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "viscosity-units",
    "name": "Oil Viscosity Unit Conversion (cSt, cP, SUS, Reyn)",
    "category": "Units",
    "collection": "MAKEOS",
    "question": "What is this oil viscosity in centistokes, centipoise, Saybolt seconds and reyns?",
    "description": "Conversion between kinematic viscosity (centistokes, mm²/s), absolute or dynamic viscosity (centipoise, pascal-seconds, reyn) and Saybolt Universal Seconds at 40 °C and 100 °C, using the oil’s density, by the handbook relations.",
    "keywords": [
      "MAKEOS",
      "viscosity conversion",
      "centistokes",
      "centipoise",
      "Saybolt",
      "SUS",
      "reyn",
      "kinematic viscosity"
    ],
    "fields": [
      {
        "key": "unit",
        "label": "Given value is",
        "type": "select",
        "default": "cst",
        "options": [
          [
            "cst",
            "Kinematic, cSt (mm²/s)"
          ],
          [
            "cp",
            "Dynamic, cP (mPa·s)"
          ],
          [
            "sus40",
            "SUS at 100 °F (40 °C)"
          ],
          [
            "sus100",
            "SUS at 210 °F (100 °C)"
          ],
          [
            "reyn",
            "Dynamic, reyn (lbf·s/in²)"
          ]
        ]
      },
      {
        "key": "val",
        "label": "Value",
        "type": "number",
        "default": 68,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sg",
        "label": "Oil specific gravity (density in g/cm³)",
        "type": "number",
        "default": 0.88,
        "unit": "",
        "min": 0.5,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "buttress-thread",
    "name": "ANSI Buttress Thread Basic Dimensions (7°/45°)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What are the basic dimensions of this 7°/45° buttress thread?",
    "description": "Basic form and diameters of the American National Standard 7°/45° buttress inch screw thread (ANSI B1.9) for any pitch: sharp-V height, thread engagement, root radius and truncations, crest width, major, pitch and minor diameters of the internal and external threads with an allowance.",
    "keywords": [
      "MAKEOS",
      "buttress thread",
      "7/45 buttress",
      "ANSI B1.9",
      "thread form",
      "pitch diameter",
      "push-pull thread"
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
      }
    ]
  },
  {
    "id": "three-wire-taper-buttress",
    "name": "Three-Wire Measurement of Taper and Buttress Threads",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What should the measurement over three wires be for this taper or buttress thread, and what pitch diameter does a reading give?",
    "description": "Measurement over wires for taper screw threads (corrected for the taper, including the simplified form for American pipe threads) and for buttress threads of any flank angles, the pitch diameter equivalent to a measured value, and the wire size for pitch-line contact on buttress threads.",
    "keywords": [
      "MAKEOS",
      "three-wire method",
      "taper thread measurement",
      "pipe thread gauge",
      "buttress thread measurement",
      "measurement over wires",
      "best wire size"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Thread",
        "type": "select",
        "default": "taper",
        "options": [
          [
            "taper",
            "Taper thread"
          ],
          [
            "buttress",
            "Buttress thread"
          ]
        ]
      },
      {
        "key": "E",
        "label": "Pitch diameter at the measuring point",
        "type": "number",
        "default": 86.0679,
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
        "default": 3.175,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Wire diameter",
        "type": "number",
        "default": 1.8331,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang",
        "label": "Included thread angle (taper)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 20,
        "max": 120,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tpf",
        "label": "Taper on diameter per foot (taper)",
        "type": "number",
        "default": 19.05,
        "unit": "mm/ft",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Included angle of the buttress thread",
        "type": "number",
        "default": 52,
        "unit": "°",
        "min": 20,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Front (load) face angle from the perpendicular",
        "type": "number",
        "default": 7,
        "unit": "°",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mm",
        "label": "Measured value over wires (0 = none)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "multi-start-threading",
    "name": "Multi-Start Thread Turning Set-up",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What lead, start spacing and Z shift do I program to turn this multi-start thread?",
    "description": "CNC set-up for multi-start threads: lead (programmed feed) from pitch and starts, the angular spacing of the starts, the Z-axis shift between starts and number of shifts, the helix angle at the pitch diameter for tool side clearance, and the spindle speed limit from the axis feed limit.",
    "keywords": [
      "MAKEOS",
      "multi-start thread",
      "multiple start thread",
      "G76",
      "G32",
      "thread lead",
      "helix angle"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 1.5875,
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
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "d2",
        "label": "Pitch diameter",
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
        "key": "fmax",
        "label": "Maximum Z-axis feed rate",
        "type": "number",
        "default": 5000,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Planned spindle speed",
        "type": "number",
        "default": 800,
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
    "id": "shear-spinning",
    "name": "Shear Spinning Blank Thickness and Force",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How thick must the blank be for this shear-spun cone, and what force and power does the roller need?",
    "description": "Shear (cone) spinning by the sine law: starting blank thickness for a required wall thickness and cone half-angle, the ideal tangential roller force from the material’s average flow stress, thickness reduction and feed, and the power at the roller.",
    "keywords": [
      "MAKEOS",
      "shear spinning",
      "flow forming",
      "cone spinning",
      "sine law",
      "spinning force",
      "metal spinning"
    ],
    "fields": [
      {
        "key": "Tw",
        "label": "Wall thickness of the spun part",
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
        "key": "Dr",
        "label": "Diameter at the roller",
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
      }
    ]
  },
  {
    "id": "machine-positioning-accuracy",
    "name": "CNC Axis Positioning Accuracy and Repeatability",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What positioning accuracy and repeatability does this axis have from repeated runs to target points?",
    "description": "Machine tool positioning accuracy by the AMT method described in the handbook: for each target point the mean positional deviation and standard deviation of repeated unidirectional runs, the ±3σ repeatability spread, and the axis accuracy as the spread from the lowest (mean − 3σ) to the highest (mean + 3σ) across all targets.",
    "keywords": [
      "MAKEOS",
      "positioning accuracy",
      "repeatability",
      "machine tool accuracy",
      "ISO 230-2",
      "standard deviation",
      "laser calibration"
    ],
    "fields": [
      {
        "key": "nt",
        "label": "Target points used",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 4,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_target_1_deviations_of_five_runs",
        "label": "Target 1: deviations of five runs",
        "type": "heading"
      },
      {
        "key": "t1r1",
        "label": "Target 1, run 1",
        "type": "number",
        "default": -5.08,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t1r2",
        "label": "Target 1, run 2",
        "type": "number",
        "default": 5.08,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t1r3",
        "label": "Target 1, run 3",
        "type": "number",
        "default": 12.7,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t1r4",
        "label": "Target 1, run 4",
        "type": "number",
        "default": 17.78,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t1r5",
        "label": "Target 1, run 5",
        "type": "number",
        "default": 20.32,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_target_2_deviations_of_five_runs",
        "label": "Target 2: deviations of five runs",
        "type": "heading"
      },
      {
        "key": "t2r1",
        "label": "Target 2, run 1",
        "type": "number",
        "default": 2,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2r2",
        "label": "Target 2, run 2",
        "type": "number",
        "default": 6,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2r3",
        "label": "Target 2, run 3",
        "type": "number",
        "default": 4,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2r4",
        "label": "Target 2, run 4",
        "type": "number",
        "default": 8,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2r5",
        "label": "Target 2, run 5",
        "type": "number",
        "default": 5,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_target_3_deviations_of_five_runs",
        "label": "Target 3: deviations of five runs",
        "type": "heading"
      },
      {
        "key": "t3r1",
        "label": "Target 3, run 1",
        "type": "number",
        "default": -3,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t3r2",
        "label": "Target 3, run 2",
        "type": "number",
        "default": 1,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t3r3",
        "label": "Target 3, run 3",
        "type": "number",
        "default": 0,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t3r4",
        "label": "Target 3, run 4",
        "type": "number",
        "default": 2,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t3r5",
        "label": "Target 3, run 5",
        "type": "number",
        "default": -1,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_target_4_deviations_of_five_runs",
        "label": "Target 4: deviations of five runs",
        "type": "heading"
      },
      {
        "key": "t4r1",
        "label": "Target 4, run 1",
        "type": "number",
        "default": 7,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t4r2",
        "label": "Target 4, run 2",
        "type": "number",
        "default": 10,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t4r3",
        "label": "Target 4, run 3",
        "type": "number",
        "default": 9,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t4r4",
        "label": "Target 4, run 4",
        "type": "number",
        "default": 12,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t4r5",
        "label": "Target 4, run 5",
        "type": "number",
        "default": 8,
        "unit": "µm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required accuracy (total spread)",
        "type": "number",
        "default": 75,
        "unit": "µm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "acme-tap-drill",
    "name": "Acme Thread Tap Drill Size",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "What drilled hole size suits tapping this Acme thread?",
    "description": "Minimum and maximum internal minor diameters, and the drill size range, for tapping general purpose (G) and centralizing (2C–4C and 5C–6C) Acme screw threads by the handbook formulas derived from ANSI/ASME B1.5, with an allowance for drill oversize.",
    "keywords": [
      "MAKEOS",
      "Acme tap drill",
      "Acme thread",
      "tap drill size",
      "centralizing Acme",
      "ANSI B1.5",
      "drill oversize"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Basic major diameter",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.1,
        "max": 6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tpi",
        "label": "Threads per inch",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cls",
        "label": "Class",
        "type": "select",
        "default": "G",
        "options": [
          [
            "G",
            "General purpose (2G, 3G, 4G)"
          ],
          [
            "C24",
            "Centralizing 2C, 3C, 4C"
          ],
          [
            "C56",
            "Centralizing 5C, 6C"
          ]
        ]
      },
      {
        "key": "over",
        "label": "Probable drill oversize",
        "type": "number",
        "default": 0.0046,
        "unit": "in",
        "min": 0,
        "max": 0.05,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "milling-cutter-teeth",
    "name": "Number of Teeth for a Milling Cutter",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How many teeth should this face mill or peripheral cutter have for the cut and the power available?",
    "description": "Recommended number of milling cutter teeth by the handbook formulas: for face mills from cutter diameter and width of cut, for peripheral cutters from diameter, depth of cut and helix angle (both for two teeth in the cut, scalable to another number), and for high-speed milling from the power available, feed per tooth, speed, depth and width of cut.",
    "keywords": [
      "MAKEOS",
      "milling cutter teeth",
      "number of teeth",
      "face mill",
      "cutter pitch",
      "teeth in cut",
      "chip space"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Rule",
        "type": "select",
        "default": "face",
        "options": [
          [
            "face",
            "Face mill (teeth in cut)"
          ],
          [
            "periph",
            "Peripheral cutter (teeth in cut)"
          ],
          [
            "power",
            "Power available (high-speed milling)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Cutter diameter",
        "type": "number",
        "default": 152.4,
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
        "default": 101.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Depth of cut",
        "type": "number",
        "default": 6.35,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "helix",
        "label": "Helix angle (peripheral)",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 60,
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
        "key": "H",
        "label": "Power available at the cutter",
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
        "key": "F",
        "label": "Feed per tooth",
        "type": "number",
        "default": 0.2032,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Cutter speed",
        "type": "number",
        "default": 272,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mat",
        "label": "Work material (power rule)",
        "type": "select",
        "default": "steel",
        "options": [
          [
            "steel",
            "Steel (K = 14,278)"
          ],
          [
            "ci",
            "Cast iron (K = 32,950)"
          ],
          [
            "al",
            "Aluminium (K = 54,930)"
          ],
          [
            "entered",
            "Enter K"
          ]
        ]
      },
      {
        "key": "K",
        "label": "Material constant K (entered)",
        "type": "number",
        "default": 14278,
        "unit": "mm³/min per kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "angular-cutter-setting",
    "name": "Dividing-Head Setting for Fluting Angular Cutters and Taper Reamers",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "At what angle do I set the dividing head to flute the teeth of this angular cutter or taper reamer?",
    "description": "Dividing-head setting angle for cutting teeth in the conical face of an angular milling cutter or a taper reamer with a single-angle fluting cutter, from the number of teeth, the angle of the blank and the angle of the fluting cutter, including the case of a flat (0°) blank.",
    "keywords": [
      "MAKEOS",
      "angular cutter",
      "fluting",
      "dividing head",
      "taper reamer",
      "setting angle",
      "cutter grinding"
    ],
    "fields": [
      {
        "key": "Nt",
        "label": "Number of teeth",
        "type": "number",
        "default": 9,
        "unit": "",
        "min": 5,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "B",
        "label": "Angle of the blank",
        "type": "number",
        "default": 35,
        "unit": "°",
        "min": 0,
        "max": 85,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Angle of the fluting cutter",
        "type": "number",
        "default": 55,
        "unit": "°",
        "min": 20,
        "max": 85,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
