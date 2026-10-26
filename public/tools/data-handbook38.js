// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook38) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "rotor-balancing-check",
    "name": "Rotor Balancing Check (Grade, Plane Unbalance and Corrections)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Is this rotor within its balance grade in each correction plane, and if not, what correction masses go where?",
    "description": "Two-plane balancing check of a rigid rotor: permissible residual unbalance from the balance quality grade, mass and speed, split equally between two correction planes (as the balance grade tool), the unbalance in each plane resolved from up to three known or measured unbalance masses (as the two-plane balance tool), the correction mass and angle in each plane at its correction radius, the rotating force the initial unbalance puts on the bearings, and whether the corrections fit within your largest practical correction mass.",
    "keywords": [
      "MAKEOS",
      "rotor balancing",
      "balance grade",
      "two-plane balancing",
      "residual unbalance",
      "correction mass",
      "dynamic balance"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Rotor mass",
        "type": "number",
        "default": 25,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Service speed",
        "type": "number",
        "default": 3000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 200000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Balance quality grade (G number)",
        "type": "number",
        "default": 6.3,
        "unit": "mm/s",
        "min": 0.1,
        "max": 4000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Distance between correction planes A and B",
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
        "key": "rA",
        "label": "Correction radius in plane A",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rB",
        "label": "Correction radius in plane B",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mMax",
        "label": "Largest practical correction mass",
        "type": "number",
        "default": 50,
        "unit": "g",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_unbalance_masses_from_plane_a_",
        "label": "Unbalance masses (from plane A)",
        "type": "heading"
      },
      {
        "key": "m1",
        "label": "Unbalance 1 mass",
        "type": "number",
        "default": 40,
        "unit": "g",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r1",
        "label": "Unbalance 1 radius",
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
        "key": "a1",
        "label": "Unbalance 1 angle",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Unbalance 1 distance from plane A",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -10000,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m2",
        "label": "Unbalance 2 mass",
        "type": "number",
        "default": 30,
        "unit": "g",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r2",
        "label": "Unbalance 2 radius",
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
        "key": "a2",
        "label": "Unbalance 2 angle",
        "type": "number",
        "default": 120,
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z2",
        "label": "Unbalance 2 distance from plane A",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": -10000,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m3",
        "label": "Unbalance 3 mass",
        "type": "number",
        "default": 0,
        "unit": "g",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r3",
        "label": "Unbalance 3 radius",
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
        "key": "a3",
        "label": "Unbalance 3 angle",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z3",
        "label": "Unbalance 3 distance from plane A",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-tooth-measurement",
    "name": "Gear Tooth Measurement for Backlash (Span and Over Pins)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What span measurement and measurement over pins should this gear show once the teeth are thinned for the backlash I want?",
    "description": "Inspection dimensions for an external involute gear cut thin for backlash: the tooth thickness reduction for this gear’s share of the normal backlash range, the number of teeth spanned and the base tangent length (span) at nominal and at both backlash limits (as the span measurement tool), the face width the anvils need on a helical gear, and for spur gears the measurement over pins at nominal and at both limits (as the gear over pins tool).",
    "keywords": [
      "MAKEOS",
      "span measurement",
      "base tangent length",
      "measurement over pins",
      "gear backlash",
      "tooth thickness",
      "gear inspection"
    ],
    "fields": [
      {
        "key": "mn",
        "label": "Normal module",
        "type": "number",
        "default": 3,
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
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "alphan",
        "label": "Normal pressure angle",
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
        "key": "beta",
        "label": "Helix angle (0 = spur)",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": 0,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Profile shift coefficient",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1,
        "max": 1.5,
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
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "jnMin",
        "label": "Smallest normal backlash wanted (pair)",
        "type": "number",
        "default": 0.08,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "jnMax",
        "label": "Largest normal backlash wanted (pair)",
        "type": "number",
        "default": 0.16,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "share",
        "label": "Share of the backlash taken by this gear",
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
        "key": "dp",
        "label": "Pin diameter (0 = 1.728 × module)",
        "type": "number",
        "default": 0,
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
    "id": "thread-wire-inspection",
    "name": "Thread Pitch Diameter by Three Wires (Accept or Reject)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "Given my reading over three wires, what is the thread’s pitch diameter, and is it within the drawing limits?",
    "description": "Three-wire inspection of a symmetrical external thread: best wire size and the wire constant for the flank angle (as the three-wire tool), the measurement over wires expected at the largest and smallest permitted pitch diameter, the pitch diameter worked back from your reading, and accept or reject against the limits (which you can take from the metric thread limits tool for the class).",
    "keywords": [
      "MAKEOS",
      "three-wire measurement",
      "thread pitch diameter",
      "thread inspection",
      "measurement over wires",
      "best wire size",
      "thread gauging"
    ],
    "fields": [
      {
        "key": "angle",
        "label": "Thread angle",
        "type": "select",
        "default": "60",
        "options": [
          [
            "60",
            "60° (metric, unified)"
          ],
          [
            "55",
            "55° (Whitworth)"
          ],
          [
            "29",
            "29° (Acme)"
          ],
          [
            "30",
            "30° (trapezoidal)"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Pitch",
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
        "key": "d2max",
        "label": "Largest pitch diameter allowed",
        "type": "number",
        "default": 8.994,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d2min",
        "label": "Smallest pitch diameter allowed",
        "type": "number",
        "default": 8.862,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Wire diameter used (0 = best size)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mmeas",
        "label": "Reading over the wires",
        "type": "number",
        "default": 10.25,
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
    "id": "torsion-bar-design",
    "name": "Torsion Bar Spring Design (Diameter for Stress and Twist)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "What diameter must this torsion bar be to carry the torque within the allowable shear stress and twist, and what rate and stroke will it give?",
    "description": "Design of a solid round torsion bar spring: torque from load and arm, the least diameter for the allowable shear stress and the least for the largest twist, the governing diameter, and with the diameter you choose the shear stress, twist, torsional rate, arm-tip travel (as the torsion bar tool) and energy stored.",
    "keywords": [
      "MAKEOS",
      "torsion bar design",
      "torsion spring bar",
      "torsional rate",
      "bar diameter",
      "twist angle",
      "suspension torsion bar"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Load at the arm",
        "type": "number",
        "default": 1000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "arm",
        "label": "Arm length",
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
        "key": "L",
        "label": "Active bar length",
        "type": "number",
        "default": 800,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
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
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable shear stress",
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
        "key": "thMax",
        "label": "Largest twist allowed",
        "type": "number",
        "default": 10,
        "unit": "°",
        "min": 0.1,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Bar diameter chosen",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "tube-bending-plan",
    "name": "Tube Bending Plan (Length, Wall Thinning, Strain and Overbend)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How long a tube do I cut for this bent part, how thin will the outside wall get, is the bend radius tight enough to crack the tube, and how far do I overbend?",
    "description": "Plan for rotary-draw or press bending of a round tube: developed length from straights and bend arcs (as the tube bend length tool), outer and inner wall thickness after bending and the thinning share (as the tube bend thinning tool), outer-fibre strain against the tube’s elongation, the centreline radius ÷ diameter and diameter ÷ wall ratios, and the angle to bend to with your springback allowance.",
    "keywords": [
      "MAKEOS",
      "tube bending",
      "developed length",
      "wall thinning",
      "bend radius",
      "springback",
      "centreline radius"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Tube outside diameter",
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
        "key": "t",
        "label": "Wall thickness",
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
        "key": "R",
        "label": "Centreline bend radius",
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
        "key": "angle",
        "label": "Bend angle",
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
        "key": "bends",
        "label": "Number of bends",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "straight",
        "label": "Total of straight lengths",
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
        "key": "tmin",
        "label": "Least wall thickness allowed",
        "type": "number",
        "default": 1.6,
        "unit": "mm",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RDmin",
        "label": "Smallest bend radius ÷ diameter allowed",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "elong",
        "label": "Elongation of the tube material",
        "type": "number",
        "default": 35,
        "unit": "%",
        "min": 1,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "spring",
        "label": "Springback allowance",
        "type": "number",
        "default": 3,
        "unit": "%",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shaft-deflection-check",
    "name": "Shaft Deflection and Bearing Slope (Up to Three Loads)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "How far does this shaft bend under its gear and pulley loads, how much do the ends tilt in the bearings, and is the bending stress acceptable?",
    "description": "Stiffness check of a simply supported round shaft carrying up to three transverse point loads in one plane: bearing reactions, bending moment and stress at the loads, deflection at each load and the largest deflection along the span by superposition, and the slope at each bearing, against your limits for gear mesh deflection, bearing misalignment and stress (for one load, the reactions, moment and largest deflection match the beam cases tool).",
    "keywords": [
      "MAKEOS",
      "shaft deflection",
      "bearing slope",
      "shaft stiffness",
      "gear mesh deflection",
      "superposition",
      "shaft bending stress"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Shaft diameter",
        "type": "number",
        "default": 70,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Bearing span",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0.000001,
        "max": 20000,
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
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_loads_0_none_positions_from_bearing_a_",
        "label": "Loads (0 = none; positions from bearing A)",
        "type": "heading"
      },
      {
        "key": "P1",
        "label": "Load 1",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Load 1 position",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P2",
        "label": "Load 2",
        "type": "number",
        "default": 3000,
        "unit": "N",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Load 2 position",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P3",
        "label": "Load 3",
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
        "key": "a3",
        "label": "Load 3 position",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_your_limits",
        "label": "Your limits",
        "type": "heading"
      },
      {
        "key": "yMax",
        "label": "Largest deflection at a load (gear mesh)",
        "type": "number",
        "default": 0.13,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "slMax",
        "label": "Largest slope at a bearing",
        "type": "number",
        "default": 0.001,
        "unit": "rad",
        "min": 0.000001,
        "max": 0.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
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
    "id": "electroplating-plan",
    "name": "Electroplating Plan (Time, Current, Loads and Cost per Part)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long must this load plate to reach the thickness, can the rectifier supply the current, how many loads does the batch take, and what does it cost per part?",
    "description": "Plan of a rack or barrel electroplating job: deposition rate and time to thickness by Faraday’s law with cathode efficiency (as the electroplating thickness tool), total current for the load against the rectifier capacity and current density against your window, loads for the batch and total hours with handling time, metal deposited, electrical energy, and cost per part from metal, energy and labour.",
    "keywords": [
      "MAKEOS",
      "electroplating plan",
      "plating time",
      "Faraday law",
      "current density",
      "plating cost",
      "rectifier capacity"
    ],
    "fields": [
      {
        "key": "metal",
        "label": "Deposit",
        "type": "select",
        "default": "ni",
        "options": [
          [
            "ni",
            "Nickel (Ni²⁺)"
          ],
          [
            "cu",
            "Copper, acid (Cu²⁺)"
          ],
          [
            "cucn",
            "Copper, cyanide (Cu⁺)"
          ],
          [
            "zn",
            "Zinc (Zn²⁺)"
          ],
          [
            "cr",
            "Chromium, hexavalent (Cr⁶⁺)"
          ],
          [
            "sn",
            "Tin, acid (Sn²⁺)"
          ],
          [
            "ag",
            "Silver (Ag⁺)"
          ],
          [
            "au",
            "Gold, cyanide (Au⁺)"
          ]
        ]
      },
      {
        "key": "J",
        "label": "Current density",
        "type": "number",
        "default": 4,
        "unit": "A/dm²",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Cathode efficiency",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thick",
        "label": "Thickness wanted",
        "type": "number",
        "default": 20,
        "unit": "µm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Area per part",
        "type": "number",
        "default": 0.5,
        "unit": "dm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "np",
        "label": "Parts per load",
        "type": "number",
        "default": 40,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "batch",
        "label": "Parts in the batch",
        "type": "number",
        "default": 1000,
        "unit": "",
        "min": 1,
        "max": 100000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "rect",
        "label": "Rectifier capacity",
        "type": "number",
        "default": 100,
        "unit": "A",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jmin",
        "label": "Lowest current density for good deposits",
        "type": "number",
        "default": 2,
        "unit": "A/dm²",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jmax",
        "label": "Highest current density for good deposits",
        "type": "number",
        "default": 6,
        "unit": "A/dm²",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "Tank voltage",
        "type": "number",
        "default": 6,
        "unit": "V",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "handle",
        "label": "Handling time per load",
        "type": "number",
        "default": 10,
        "unit": "min",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pE",
        "label": "Electricity price",
        "type": "number",
        "default": 0.25,
        "unit": "$/kWh",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pM",
        "label": "Anode metal price",
        "type": "number",
        "default": 20,
        "unit": "$/kg",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Labour and overhead rate",
        "type": "number",
        "default": 60,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bracket-bolt-tension",
    "name": "Bracket Bolts in Tension and Shear (Moment on a Bolted Flange)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What tension do the top bolts of this bracket see from the overhanging load, what shear does each bolt carry, and do they pass a combined tension–shear check?",
    "description": "Check of a bracket bolted to a column or wall face with the load acting at a distance from the face: the moment taken by bolt tension with the bracket pivoting about its bottom edge, tension in each bolt row in proportion to its distance from the pivot, the tension in the most loaded bolt, the shear shared equally by all the bolts (as the bolt and pin shear tool), stresses on the thread stress area and shank, and the elliptical tension–shear interaction.",
    "keywords": [
      "MAKEOS",
      "bracket bolts",
      "bolt tension moment",
      "bolted bracket",
      "combined tension shear",
      "bolt interaction",
      "eccentric load"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Load (parallel to the face)",
        "type": "number",
        "default": 60,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e",
        "label": "Load distance from the bolted face",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_bolt_rows_height_above_the_pivot_edge_",
        "label": "Bolt rows (height above the pivot edge)",
        "type": "heading"
      },
      {
        "key": "y1",
        "label": "Row 1 height",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Row 1 bolts",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "y2",
        "label": "Row 2 height",
        "type": "number",
        "default": 150,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n2",
        "label": "Row 2 bolts",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "y3",
        "label": "Row 3 height",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n3",
        "label": "Row 3 bolts",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "y4",
        "label": "Row 4 height",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n4",
        "label": "Row 4 bolts",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": 0,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_bolts",
        "label": "Bolts",
        "type": "heading"
      },
      {
        "key": "d",
        "label": "Bolt diameter",
        "type": "number",
        "default": 16,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pitch",
        "label": "Thread pitch",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Allowable tensile stress",
        "type": "number",
        "default": 300,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tA",
        "label": "Allowable shear stress",
        "type": "number",
        "default": 150,
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
    "id": "gear-centre-distance-design",
    "name": "Gear Pair for a Given Centre Distance (Profile Shift, Tips, Contact Ratio)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What profile shifts make this spur gear pair fit my centre distance, what tip diameters does that give, and is the contact ratio and undercut acceptable?",
    "description": "Design of an external spur gear pair to an off-standard centre distance: working pressure angle from the centre distance, the sum of profile shift coefficients from the involute function, its split between pinion and gear, tip diameters with or without tip shortening to keep the standard clearance, the contact ratio with those tips (as the contact ratio tool), the undercut limit for each gear, and the working pressure angle check against the profile shift tool.",
    "keywords": [
      "MAKEOS",
      "profile shift",
      "centre distance",
      "working pressure angle",
      "contact ratio",
      "tip shortening",
      "addendum modification"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
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
        "key": "z1",
        "label": "Pinion teeth",
        "type": "number",
        "default": 14,
        "unit": "",
        "min": 6,
        "max": 300,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Gear teeth",
        "type": "number",
        "default": 40,
        "unit": "",
        "min": 6,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "alpha",
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
        "key": "aw",
        "label": "Centre distance required",
        "type": "number",
        "default": 55,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "share",
        "label": "Share of the total shift on the pinion",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "short",
        "label": "Tip shortening",
        "type": "select",
        "default": "yes",
        "options": [
          [
            "yes",
            "Shorten tips to keep standard clearance"
          ],
          [
            "no",
            "No tip shortening"
          ]
        ]
      },
      {
        "key": "epsMin",
        "label": "Smallest contact ratio wanted",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 2.5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
