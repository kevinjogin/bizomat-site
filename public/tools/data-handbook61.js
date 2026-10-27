// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook61) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "inch-milling-setup-check",
    "name": "Inch Milling Setup Check (Speed, Feed, Removal Rate, Spindle Power)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "For a milling cut set up in surface feet and inches per tooth, what spindle speed and table feed do I program, and does the machine have the speed and power for it?",
    "description": "Check of an inch-unit milling setup: spindle speed from surface speed and cutter diameter and table feed from teeth and feed per tooth (as the inch speeds and feeds tool), capped at the machine’s top speed with the surface speed and feed that result, then the metal removal rate from width and depth of cut and the spindle power from a unit power for the material, against the machine’s motor power and efficiency.",
    "keywords": [
      "MAKEOS",
      "speeds and feeds",
      "surface feet per minute",
      "inches per tooth",
      "removal rate",
      "unit horsepower",
      "milling power"
    ],
    "fields": [
      {
        "key": "sfm",
        "label": "Surface speed",
        "type": "number",
        "default": 400,
        "unit": "ft/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Cutter diameter",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "teeth",
        "label": "Number of teeth",
        "type": "number",
        "default": 4,
        "unit": "teeth",
        "min": 1,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "ipt",
        "label": "Feed per tooth",
        "type": "number",
        "default": 0.002,
        "unit": "in",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cut_and_machine",
        "label": "Cut and machine",
        "type": "heading"
      },
      {
        "key": "woc",
        "label": "Width of cut (radial)",
        "type": "number",
        "default": 0.25,
        "unit": "in",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "doc",
        "label": "Depth of cut (axial)",
        "type": "number",
        "default": 0.5,
        "unit": "in",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ku",
        "label": "Unit power of the material",
        "type": "number",
        "default": 1,
        "unit": "hp per in³/min",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nMax",
        "label": "Spindle speed limit",
        "type": "number",
        "default": 8000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hp",
        "label": "Spindle motor power",
        "type": "number",
        "default": 5,
        "unit": "hp",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Machine efficiency",
        "type": "number",
        "default": 80,
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
    "id": "index-table-drive-check",
    "name": "Rotary Index Table Drive Check (Table Inertia, Motor Torque and Speed, Inertia Ratio, Holding)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For a rotary index table driven by a servo or geared motor, can the motor index it in the time I want, is the inertia match acceptable, and will the drive hold the table against the process force?",
    "description": "Check of a rotary indexing table drive against the motor: table and fixture inertia, index angle, peak speed and acceleration for a cycloidal or trapezoidal move, table and motor peak torques through the reducer, motor speed, the holding torque needed against the process force and the load-to-motor inertia ratio (as the rotary index table sizing tool), against the motor’s peak torque, top speed, your inertia ratio limit and the brake torque multiplied through the reducer.",
    "keywords": [
      "MAKEOS",
      "index table",
      "rotary table",
      "servo sizing",
      "inertia ratio",
      "indexing time",
      "holding torque"
    ],
    "fields": [
      {
        "key": "M",
        "label": "Table plate mass",
        "type": "number",
        "default": 80,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Table plate radius",
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
        "key": "st",
        "label": "Stations",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 2,
        "max": 72,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mf",
        "label": "Mass of each fixture and part",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rf",
        "label": "Radius of fixture centres",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ti",
        "label": "Index time",
        "type": "number",
        "default": 0.6,
        "unit": "s",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tc",
        "label": "Total cycle time",
        "type": "number",
        "default": 3,
        "unit": "s",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "law",
        "label": "Motion profile",
        "type": "select",
        "default": "cyc",
        "options": [
          [
            "cyc",
            "Cycloidal"
          ],
          [
            "trap",
            "Trapezoidal (⅓ accel, ⅓ cruise, ⅓ decel)"
          ]
        ]
      },
      {
        "key": "Tf",
        "label": "Bearing and seal friction torque",
        "type": "number",
        "default": 5,
        "unit": "N·m",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Reducer ratio",
        "type": "number",
        "default": 50,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Reducer efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jm",
        "label": "Motor rotor inertia",
        "type": "number",
        "default": 0.0005,
        "unit": "kg·m²",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fm",
        "label": "Process force at the fixture radius",
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
        "key": "SF",
        "label": "Holding safety factor",
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
        "key": "h_motor",
        "label": "Motor",
        "type": "heading"
      },
      {
        "key": "TmPk",
        "label": "Motor peak torque",
        "type": "number",
        "default": 6,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nMaxM",
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
        "key": "ratioMax",
        "label": "Largest inertia ratio accepted",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tb",
        "label": "Motor brake torque",
        "type": "number",
        "default": 25,
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
    "id": "hand-lever-design-check",
    "name": "Hand Lever Design Check (Effort, Fulcrum Reaction, Arm Bending, Fulcrum Pin)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For a hand or foot lever carrying one or more loads, what effort does it take, and are the lever arm and the fulcrum pin strong enough?",
    "description": "Check of a lever of any class: the effort at the effort arm or the arm needed for a given effort, the mechanical advantage and the fulcrum reaction (as the lever force tool), the largest bending moment along the lever and the bending stress in a rectangular arm, and the double shear stress and bearing pressure of the fulcrum pin from the reaction, against your allowable stresses.",
    "keywords": [
      "MAKEOS",
      "lever",
      "hand lever",
      "fulcrum pin",
      "mechanical advantage",
      "bending stress",
      "foot pedal"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Solve for",
        "type": "select",
        "default": "force",
        "options": [
          [
            "force",
            "Effort at a given arm"
          ],
          [
            "arm",
            "Arm for a given effort"
          ]
        ]
      },
      {
        "key": "type",
        "label": "Lever type",
        "type": "select",
        "default": "first",
        "options": [
          [
            "first",
            "Fulcrum between effort and loads"
          ],
          [
            "second",
            "Loads between fulcrum and effort"
          ],
          [
            "third",
            "Effort between fulcrum and loads"
          ]
        ]
      },
      {
        "key": "x",
        "label": "Effort arm (fulcrum to effort)",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Available effort (arm mode)",
        "type": "number",
        "default": 100,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_loads_distance_from_the_fulcrum_0_unused_",
        "label": "Loads (distance from the fulcrum; 0 = unused)",
        "type": "heading"
      },
      {
        "key": "W1",
        "label": "Load 1",
        "type": "number",
        "default": 800,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Distance 1",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W2",
        "label": "Load 2",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Distance 2",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W3",
        "label": "Load 3",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a3",
        "label": "Distance 3",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_arm_and_pin",
        "label": "Arm and pin",
        "type": "heading"
      },
      {
        "key": "b",
        "label": "Arm thickness",
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
        "key": "h",
        "label": "Arm depth (in the plane of the loads)",
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
        "key": "sA",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Fulcrum pin diameter",
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
        "key": "tauA",
        "label": "Allowable pin shear stress",
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
        "key": "pA",
        "label": "Allowable bearing pressure",
        "type": "number",
        "default": 50,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "plate-shear-capacity-check",
    "name": "Plate Shear Capacity Check (Shearing Force, Largest Thickness, Knife Length)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "Can my guillotine or plate shear cut this plate, and what is the thickest plate of this material it can cut?",
    "description": "Check of a plate shear (guillotine) for a cut: the shear strength from the tensile strength, the shearing force for parallel blades or raked (inclined) blades with the penetration at fracture, and the machine force with an allowance for parallel blades (as the shearing force tool), then the largest thickness of the same material the shear can cut at its rated capacity, and the cut length against the knife length.",
    "keywords": [
      "MAKEOS",
      "plate shear",
      "guillotine",
      "shearing force",
      "blade rake",
      "shear capacity",
      "cutting thickness"
    ],
    "fields": [
      {
        "key": "blades",
        "label": "Blades",
        "type": "select",
        "default": "inclined",
        "options": [
          [
            "parallel",
            "Straight parallel blades"
          ],
          [
            "inclined",
            "Straight inclined (raked) blades"
          ]
        ]
      },
      {
        "key": "t",
        "label": "Material thickness",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Cut length",
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
        "key": "uts",
        "label": "Tensile strength",
        "type": "number",
        "default": 450,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Shear strength ÷ tensile strength",
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
        "key": "rake",
        "label": "Blade rake angle",
        "type": "number",
        "default": 2,
        "unit": "°",
        "min": 0.1,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pen",
        "label": "Relative blade penetration at fracture",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0.05,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Inclined blade factor n",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.5,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Shear rated capacity",
        "type": "number",
        "default": 500,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lk",
        "label": "Knife (blade) length",
        "type": "number",
        "default": 2500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vee-groove-pin-inspection",
    "name": "Vee Groove Pin Inspection (Pin Height at Nominal and Limits, Groove Width from the Reading)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "For a vee groove checked with a pin, what height should the pin stand above the surface, and what groove width does my measured height give?",
    "description": "Inspection of a vee groove (or dovetail-like vee slot) by a gauge pin: the distance from the top surface to the pin centre, the depth to the vee apex and the pin height above the surface at the nominal width (as the vee groove pin tool), the readings at the width limits, and the groove width worked back from a measured pin height, with the check that the pin touches the flanks below the top edges.",
    "keywords": [
      "MAKEOS",
      "vee groove",
      "gauge pin",
      "groove width",
      "inspection",
      "measurement over pin",
      "V-slot"
    ],
    "fields": [
      {
        "key": "angle",
        "label": "Included groove angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 1,
        "max": 179,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "width",
        "label": "Nominal groove width at the top surface",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Width tolerance (±)",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pin",
        "label": "Pin diameter",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hm",
        "label": "Measured pin height above the surface",
        "type": "number",
        "default": 2.25,
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
    "id": "special-section-beam-check",
    "name": "Special Section Beam Check (Section Properties, Beam Case, Stress, Deflection Limit)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For a beam made from a hexagon, ellipse, half-round, triangle or holed round bar, what are its section properties, and are the bending stress and deflection within limits for my supports and loads?",
    "description": "Check of a beam with an uncommon solid section: area, second moment of area and extreme fibre distance of an ellipse, hollow ellipse, half circle, hexagon, isosceles triangle, or round bar with a hexagonal or square hole (as the more section shapes tool), then the reactions, largest bending moment, bending stress and deflection for a fixed, guided, propped or simply supported case (as the more beam cases tool), against your allowable stress and span-to-deflection limit, with the mass per metre.",
    "keywords": [
      "MAKEOS",
      "beam deflection",
      "hexagon bar",
      "section modulus",
      "second moment of area",
      "fixed beam",
      "deflection limit"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Section",
        "type": "select",
        "default": "hex",
        "options": [
          [
            "ellipse",
            "Ellipse (A, B = full axes; B vertical)"
          ],
          [
            "hellipse",
            "Hollow ellipse (A, B outer; C, D inner axes)"
          ],
          [
            "half",
            "Half circle, flat side down (A = diameter)"
          ],
          [
            "hex",
            "Hexagon, flats top and bottom (A = across flats)"
          ],
          [
            "tri",
            "Isosceles triangle, base down (A = base, B = height)"
          ],
          [
            "cirhex",
            "Round with hexagonal hole (A = dia, C = hole across flats)"
          ],
          [
            "cirsq",
            "Round with square hole (A = dia, C = hole side)"
          ]
        ]
      },
      {
        "key": "A",
        "label": "Dimension A",
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
        "key": "B",
        "label": "Dimension B",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Dimension C",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Dimension D",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_beam",
        "label": "Beam",
        "type": "heading"
      },
      {
        "key": "case",
        "label": "Beam case",
        "type": "select",
        "default": "ss-two",
        "options": [
          [
            "ff-offset",
            "Fixed both ends · point load at distance a"
          ],
          [
            "guided-point",
            "Fixed one end, guided other · load at guided end"
          ],
          [
            "guided-udl",
            "Fixed one end, guided other · uniform load"
          ],
          [
            "prop-point",
            "Fixed one end, supported other · point load at a from fixed end"
          ],
          [
            "ss-two",
            "Simply supported · two equal loads at a from each support"
          ]
        ]
      },
      {
        "key": "load",
        "label": "Load (each point load, or total uniform load)",
        "type": "number",
        "default": 4000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Span",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Distance a",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Modulus of elasticity",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
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
        "key": "dlim",
        "label": "Deflection limit (span ÷)",
        "type": "number",
        "default": 250,
        "unit": "",
        "min": 10,
        "max": 100000,
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
      }
    ]
  },
  {
    "id": "force-group-support-check",
    "name": "Force Group Support Check (Resultant, Line of Action, Support Reactions, Uplift)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "For several forces acting on a frame, base or beam resting on two supports, what is their resultant, where does it act, and what does each support carry?",
    "description": "Check of a rigid member or base on a pinned support A and a roller support B: the resultant of up to four forces in any direction, its moment about the origin and where its line of action crosses the support line (as the force system tool), then the reactions at A (both directions) and B (perpendicular to the support line), any uplift at either support, and the reactions against the support capacities.",
    "keywords": [
      "MAKEOS",
      "resultant force",
      "support reactions",
      "free body",
      "statics",
      "uplift",
      "line of action"
    ],
    "fields": [
      {
        "key": "h_force_1",
        "label": "Force 1",
        "type": "heading"
      },
      {
        "key": "F1",
        "label": "Magnitude",
        "type": "number",
        "default": 1000,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "Direction from +X",
        "type": "number",
        "default": -90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x1",
        "label": "X of a point on its line",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Y of that point",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_force_2",
        "label": "Force 2",
        "type": "heading"
      },
      {
        "key": "F2",
        "label": "Magnitude",
        "type": "number",
        "default": 1500,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "Direction from +X",
        "type": "number",
        "default": -90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "X of a point on its line",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Y of that point",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_force_3",
        "label": "Force 3",
        "type": "heading"
      },
      {
        "key": "F3",
        "label": "Magnitude",
        "type": "number",
        "default": 500,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a3",
        "label": "Direction from +X",
        "type": "number",
        "default": -90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x3",
        "label": "X of a point on its line",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Y of that point",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_force_4",
        "label": "Force 4",
        "type": "heading"
      },
      {
        "key": "F4",
        "label": "Magnitude",
        "type": "number",
        "default": 0,
        "unit": "N",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a4",
        "label": "Direction from +X",
        "type": "number",
        "default": -90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x4",
        "label": "X of a point on its line",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y4",
        "label": "Y of that point",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_supports_on_the_x_axis_",
        "label": "Supports (on the X axis)",
        "type": "heading"
      },
      {
        "key": "xA",
        "label": "Pinned support A at X",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "xB",
        "label": "Roller support B at X",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": -10000000,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "capA",
        "label": "Capacity of support A",
        "type": "number",
        "default": 2500,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "capB",
        "label": "Capacity of support B",
        "type": "number",
        "default": 2000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "grain-size-acceptance",
    "name": "Grain Size Acceptance (Field Readings, Average ASTM Grain Size, Spread, Specification)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "From several microscope field readings, what is the average ASTM grain size number, how much do the fields vary, and does the material meet the grain size specification?",
    "description": "Acceptance of a material for grain size from up to five fields: the average of the readings (grains per square inch at 100×, grains per mm² at 1× or mean lineal intercept), the ASTM grain size number G from the average and from each field, the equivalent counts and intercept length (as the grain size tool), the spread between the coarsest and finest field, against the specified G range and your largest acceptable spread.",
    "keywords": [
      "MAKEOS",
      "grain size",
      "ASTM E112",
      "grain size number",
      "metallography",
      "material acceptance",
      "mean intercept"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Measurement",
        "type": "select",
        "default": "n100",
        "options": [
          [
            "n100",
            "Grains per square inch at 100×"
          ],
          [
            "na",
            "Grains per mm² at 1×"
          ],
          [
            "lbar",
            "Mean lineal intercept length (µm)"
          ]
        ]
      },
      {
        "key": "v1",
        "label": "Field 1 reading (0 = unused)",
        "type": "number",
        "default": 64,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v2",
        "label": "Field 2 reading (0 = unused)",
        "type": "number",
        "default": 60,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v3",
        "label": "Field 3 reading (0 = unused)",
        "type": "number",
        "default": 70,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v4",
        "label": "Field 4 reading (0 = unused)",
        "type": "number",
        "default": 58,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v5",
        "label": "Field 5 reading (0 = unused)",
        "type": "number",
        "default": 66,
        "unit": "",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_specification",
        "label": "Specification",
        "type": "heading"
      },
      {
        "key": "Gmin",
        "label": "Coarsest grain size allowed (lowest G)",
        "type": "number",
        "default": 5,
        "unit": "G",
        "min": -5,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Gmax",
        "label": "Finest grain size allowed (highest G)",
        "type": "number",
        "default": 8,
        "unit": "G",
        "min": -5,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "spread",
        "label": "Largest spread between fields",
        "type": "number",
        "default": 3,
        "unit": "G",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "polar-hole-position-check",
    "name": "Polar Hole Position Check (Nominal X–Y from Radius and Angle, Position Error, Bonus Tolerance)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "For holes dimensioned by radius and angle and measured in X and Y, how far is each hole from its true position, and does it pass with the bonus tolerance from its size?",
    "description": "Inspection of up to four holes dimensioned in polar coordinates: the nominal X and Y of each hole from its radius and angle (as the polar coordinates tool), the distance from nominal to the measured centre (as the distance between two points tool), the position error as a diameter, and the position tolerance allowed at the measured hole size including bonus tolerance from maximum material condition, with the hole size checked against its limits.",
    "keywords": [
      "MAKEOS",
      "true position",
      "polar coordinates",
      "hole position",
      "bonus tolerance",
      "MMC",
      "CMM inspection"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of holes",
        "type": "number",
        "default": 4,
        "unit": "holes",
        "min": 1,
        "max": 4,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_hole_1",
        "label": "Hole 1",
        "type": "heading"
      },
      {
        "key": "r1",
        "label": "Nominal radius",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang1",
        "label": "Nominal angle from +X",
        "type": "number",
        "default": 0,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mx1",
        "label": "Measured X",
        "type": "number",
        "default": 50.02,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "my1",
        "label": "Measured Y",
        "type": "number",
        "default": 0.01,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "md1",
        "label": "Measured hole diameter",
        "type": "number",
        "default": 10.05,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_hole_2",
        "label": "Hole 2",
        "type": "heading"
      },
      {
        "key": "r2",
        "label": "Nominal radius",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang2",
        "label": "Nominal angle from +X",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mx2",
        "label": "Measured X",
        "type": "number",
        "default": -0.015,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "my2",
        "label": "Measured Y",
        "type": "number",
        "default": 50.02,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "md2",
        "label": "Measured hole diameter",
        "type": "number",
        "default": 10.04,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_hole_3",
        "label": "Hole 3",
        "type": "heading"
      },
      {
        "key": "r3",
        "label": "Nominal radius",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang3",
        "label": "Nominal angle from +X",
        "type": "number",
        "default": 180,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mx3",
        "label": "Measured X",
        "type": "number",
        "default": -49.99,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "my3",
        "label": "Measured Y",
        "type": "number",
        "default": -0.02,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "md3",
        "label": "Measured hole diameter",
        "type": "number",
        "default": 10.06,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_hole_4",
        "label": "Hole 4",
        "type": "heading"
      },
      {
        "key": "r4",
        "label": "Nominal radius",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang4",
        "label": "Nominal angle from +X",
        "type": "number",
        "default": 270,
        "unit": "°",
        "min": -360,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mx4",
        "label": "Measured X",
        "type": "number",
        "default": 0.01,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "my4",
        "label": "Measured Y",
        "type": "number",
        "default": -50.03,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "md4",
        "label": "Measured hole diameter",
        "type": "number",
        "default": 10.02,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
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
        "key": "tp",
        "label": "Position tolerance at MMC (diameter)",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dMMC",
        "label": "Smallest hole size (MMC)",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dLMC",
        "label": "Largest hole size (LMC)",
        "type": "number",
        "default": 10.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
