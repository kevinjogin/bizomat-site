// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook34) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "helical-gear-set-design",
    "name": "Helical Gear Set Design (Geometry, Forces and Bending)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What are the sizes, tooth forces and bearing thrust of this helical gear pair, and is the tooth bending stress within the allowable?",
    "description": "Design check of a parallel-axis helical gear pair from power and speed: transverse module, pitch diameters, centre distance, transverse pressure angle, virtual teeth and overlap ratio (as the helical gear tool), the tangential, axial and separating forces the bearings must carry, pitch-line velocity and the Lewis bending stress in the normal plane with the velocity factor (as the Lewis bending tool), using the form factor for the virtual number of teeth.",
    "keywords": [
      "MAKEOS",
      "helical gear design",
      "helical gear forces",
      "axial thrust",
      "helix angle",
      "Lewis bending helical",
      "gear centre distance"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Power",
        "type": "number",
        "default": 7.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
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
        "key": "mn",
        "label": "Normal module",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.5,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Helix angle",
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
        "key": "alphan",
        "label": "Normal pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 14.5,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Pinion teeth",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 8,
        "max": 300,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Gear teeth",
        "type": "number",
        "default": 45,
        "unit": "",
        "min": 8,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "b",
        "label": "Face width",
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
        "key": "Y",
        "label": "Lewis form factor at the virtual teeth",
        "type": "number",
        "default": 0.33,
        "unit": "",
        "min": 0.1,
        "max": 0.6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "make",
        "label": "Tooth finish",
        "type": "select",
        "default": "hobbed",
        "options": [
          [
            "cast",
            "Cast teeth"
          ],
          [
            "cut",
            "Cut teeth"
          ],
          [
            "hobbed",
            "Hobbed or shaped teeth"
          ],
          [
            "ground",
            "Shaved or ground teeth"
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
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ebMin",
        "label": "Least overlap ratio wanted",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bevel-gear-set-design",
    "name": "Straight Bevel Gear Set Design (Geometry, Forces and Bending)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What are the cone angles, tooth forces and bearing loads of this straight bevel gear pair, and is the bending stress within the allowable?",
    "description": "Design check of a straight bevel gear pair from power and speed: pitch cone angles, pitch diameters and outer cone distance (as the bevel gear tool), face width against your limit as a share of the cone distance, the mean pitch diameter and the tangential, axial and radial forces on pinion and gear at the mean diameter, and the Lewis bending stress for bevel teeth with the face-width correction (L − b) ÷ L and the velocity factor.",
    "keywords": [
      "MAKEOS",
      "bevel gear design",
      "bevel gear forces",
      "pitch cone angle",
      "cone distance",
      "bevel gear bending",
      "right-angle drive"
    ],
    "fields": [
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
        "key": "n1",
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
        "key": "m",
        "label": "Module at the large end",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.5,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Pinion teeth",
        "type": "number",
        "default": 18,
        "unit": "",
        "min": 8,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Gear teeth",
        "type": "number",
        "default": 36,
        "unit": "",
        "min": 8,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "shaft",
        "label": "Shaft angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 30,
        "max": 150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alphan",
        "label": "Pressure angle",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 14.5,
        "max": 25,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Face width",
        "type": "number",
        "default": 22,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shareMax",
        "label": "Largest face width ÷ cone distance",
        "type": "number",
        "default": 0.33,
        "unit": "",
        "min": 0.1,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Lewis form factor (for the formative teeth)",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0.1,
        "max": 0.6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "make",
        "label": "Tooth finish",
        "type": "select",
        "default": "hobbed",
        "options": [
          [
            "cast",
            "Cast teeth"
          ],
          [
            "cut",
            "Cut teeth"
          ],
          [
            "hobbed",
            "Hobbed or shaped teeth"
          ],
          [
            "ground",
            "Shaved or ground teeth"
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
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "journal-bearing-design",
    "name": "Hydrodynamic Journal Bearing Design (Load, Friction, Heat and Oil)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Is this plain journal bearing within its unit load, how much heat does oil friction make, and how much oil must flow to carry it away?",
    "description": "First design of a full-film hydrodynamic journal bearing: unit load on the projected area, length-to-diameter ratio, surface speed, Sommerfeld number, Petroff friction torque, friction coefficient and power loss (as the Petroff tool), and the oil flow to carry the heat at an allowed temperature rise, with checks of unit load, L/D and Sommerfeld number against your limits.",
    "keywords": [
      "MAKEOS",
      "journal bearing design",
      "hydrodynamic bearing",
      "Sommerfeld number",
      "Petroff friction",
      "bearing oil flow",
      "plain bearing"
    ],
    "fields": [
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
        "key": "mu",
        "label": "Oil viscosity at the film temperature",
        "type": "number",
        "default": 25,
        "unit": "mPa·s (cP)",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Allowed oil temperature rise",
        "type": "number",
        "default": 10,
        "unit": "K",
        "min": 0.000001,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Oil specific heat",
        "type": "number",
        "default": 1.9,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Oil density",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pMax",
        "label": "Largest unit load",
        "type": "number",
        "default": 3,
        "unit": "MPa",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ldMin",
        "label": "Smallest L/D",
        "type": "number",
        "default": 0.5,
        "unit": "",
        "min": 0.1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ldMax",
        "label": "Largest L/D",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 0.2,
        "max": 4,
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
  },
  {
    "id": "extension-spring-designer",
    "name": "Extension Spring Designer (Body, Hooks, Initial Tension, Frequency)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "Will this extension spring carry its working load without overstressing the body or the hooks, is the initial tension sensible, and how high is its natural frequency?",
    "description": "Design check of a helical extension spring with standard loop hooks: rate, load at the working extension, body shear stress with the Wahl factor (as the extension spring tool), the initial-tension stress against your range, hook bending stress at the loop and torsional stress at the bend radius (Wahl hook formulas), and the natural frequency of the spring fixed at both ends.",
    "keywords": [
      "MAKEOS",
      "extension spring design",
      "spring hook stress",
      "initial tension",
      "extension spring rate",
      "spring natural frequency",
      "loop hook"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Wire diameter",
        "type": "number",
        "default": 1.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Mean coil diameter",
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
        "key": "Na",
        "label": "Active coils",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 1,
        "max": 500,
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
        "key": "Fi",
        "label": "Initial tension",
        "type": "number",
        "default": 10,
        "unit": "N",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Working extension (beyond initial tension)",
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
        "key": "allow",
        "label": "Allowable body shear stress",
        "type": "number",
        "default": 650,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r1",
        "label": "Hook loop mean radius",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 250,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r2",
        "label": "Hook bend mean radius",
        "type": "number",
        "default": 2.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sbA",
        "label": "Allowable hook bending stress",
        "type": "number",
        "default": 1200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 4000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thA",
        "label": "Allowable hook torsional stress",
        "type": "number",
        "default": 650,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tiMin",
        "label": "Initial-tension stress, low end",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tiMax",
        "label": "Initial-tension stress, high end",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoW",
        "label": "Wire density",
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
    "id": "motor-duty-cycle-check",
    "name": "Servo or Motor Duty Cycle Check (Move Profile, RMS and Peak)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "For this move profile, what torque does the motor need to accelerate, run and stop the load, and is it within the motor’s continuous and peak ratings?",
    "description": "Duty-cycle sizing of a motor for a repeated trapezoidal move: acceleration, running, deceleration and dwell segments from the inertia at the motor, the top speed and the segment times, segment torques including friction or load torque, the RMS torque over the cycle (as the RMS torque tool) against the continuous rating, the peak torque against the peak rating, the inertia ratio and the energy returned on each deceleration.",
    "keywords": [
      "MAKEOS",
      "motor duty cycle",
      "servo sizing",
      "RMS torque",
      "move profile",
      "inertia ratio",
      "regenerative energy"
    ],
    "fields": [
      {
        "key": "J",
        "label": "Load inertia at the motor shaft",
        "type": "number",
        "default": 0.006,
        "unit": "kg·m²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Jm",
        "label": "Motor rotor inertia",
        "type": "number",
        "default": 0.002,
        "unit": "kg·m²",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmax",
        "label": "Top speed",
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
        "key": "ta",
        "label": "Acceleration time",
        "type": "number",
        "default": 0.2,
        "unit": "s",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tr",
        "label": "Running time at top speed",
        "type": "number",
        "default": 0.6,
        "unit": "s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "td",
        "label": "Deceleration time",
        "type": "number",
        "default": 0.2,
        "unit": "s",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tw",
        "label": "Dwell time",
        "type": "number",
        "default": 1.4,
        "unit": "s",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tf",
        "label": "Friction or load torque while moving",
        "type": "number",
        "default": 3,
        "unit": "N·m",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Th",
        "label": "Holding torque during dwell",
        "type": "number",
        "default": 0,
        "unit": "N·m",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Motor continuous (rated) torque",
        "type": "number",
        "default": 6,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tp",
        "label": "Motor peak torque",
        "type": "number",
        "default": 18,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nMot",
        "label": "Motor maximum speed",
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
        "key": "jrMax",
        "label": "Largest load-to-rotor inertia ratio",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 0.5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "timing-belt-drive-design",
    "name": "Timing Belt Drive Design (Length, Mesh and Belt Width)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What belt length and centre distance does this timing belt drive need, are enough teeth in mesh, and how wide must the belt be for the power?",
    "description": "Design of a synchronous (timing) belt drive: pulley pitch diameters from the pitch and tooth counts, exact pitch length for the centre distance, rounding to a whole number of belt teeth and the centre distance that belt gives, teeth in mesh on the small pulley (as the timing belt tool), belt speed, effective pull from the power with a service factor, and the belt width needed from your allowable working tension per millimetre of width.",
    "keywords": [
      "MAKEOS",
      "timing belt drive",
      "synchronous belt",
      "belt width",
      "teeth in mesh",
      "belt pitch length",
      "HTD belt"
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
        "label": "Small pulley speed",
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
        "default": 1.4,
        "unit": "",
        "min": 1,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Belt pitch",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z1",
        "label": "Small pulley teeth",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 10,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "z2",
        "label": "Large pulley teeth",
        "type": "number",
        "default": 40,
        "unit": "",
        "min": 10,
        "max": 500,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "C",
        "label": "Approximate centre distance",
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
        "key": "Ta",
        "label": "Allowable working tension per mm of width",
        "type": "number",
        "default": 25,
        "unit": "N/mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Belt width chosen",
        "type": "number",
        "default": 15,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "meshMin",
        "label": "Least teeth in mesh",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vMax",
        "label": "Largest belt speed",
        "type": "number",
        "default": 40,
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
    "id": "heat-exchanger-sizing",
    "name": "Heat Exchanger Sizing (Duty, Outlet Temperature and Area)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How much heat does this exchanger move, what will the cold stream leave at, and is the installed area enough?",
    "description": "Sizing check of a liquid-to-liquid heat exchanger: duty from the hot stream’s flow, specific heat and temperature drop, the cold stream outlet temperature from the energy balance, the log-mean temperature difference for counterflow or parallel flow (as the heat exchanger LMTD tool), the area needed with your overall coefficient, and checks of the installed area and the closest approach temperature.",
    "keywords": [
      "MAKEOS",
      "heat exchanger sizing",
      "LMTD",
      "oil cooler",
      "heat duty",
      "approach temperature",
      "overall heat transfer coefficient"
    ],
    "fields": [
      {
        "key": "h_hot_stream",
        "label": "Hot stream",
        "type": "heading"
      },
      {
        "key": "Qh",
        "label": "Hot flow",
        "type": "number",
        "default": 30,
        "unit": "L/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoh",
        "label": "Hot density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cph",
        "label": "Hot specific heat",
        "type": "number",
        "default": 4.18,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Thi",
        "label": "Hot inlet",
        "type": "number",
        "default": 70,
        "unit": "°C",
        "min": -50,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tho",
        "label": "Hot outlet",
        "type": "number",
        "default": 50,
        "unit": "°C",
        "min": -50,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cold_stream",
        "label": "Cold stream",
        "type": "heading"
      },
      {
        "key": "Qc",
        "label": "Cold flow",
        "type": "number",
        "default": 60,
        "unit": "L/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoc",
        "label": "Cold density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cpc",
        "label": "Cold specific heat",
        "type": "number",
        "default": 4.18,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tci",
        "label": "Cold inlet",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -50,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_exchanger",
        "label": "Exchanger",
        "type": "heading"
      },
      {
        "key": "flow",
        "label": "Flow arrangement",
        "type": "select",
        "default": "counter",
        "options": [
          [
            "counter",
            "Counterflow"
          ],
          [
            "parallel",
            "Parallel flow"
          ]
        ]
      },
      {
        "key": "U",
        "label": "Overall heat transfer coefficient",
        "type": "number",
        "default": 400,
        "unit": "W/m²·K",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ainst",
        "label": "Installed area",
        "type": "number",
        "default": 4,
        "unit": "m²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "appMin",
        "label": "Closest approach temperature allowed",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "surface-grinding-planner",
    "name": "Surface Grinding Planner (Speeds, Removal Rate, Power and Time)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What wheel speed, removal rate and spindle power does this surface grinding job need, and how long will it take?",
    "description": "Plan of a reciprocating surface grinding operation with the wheel covering the work width: wheel surface speed against the wheel’s maximum operating speed, speed ratio, contact length (as the grinding geometry tool), equivalent chip thickness, specific removal rate and removal rate, grinding power from your specific grinding energy against the spindle power, and passes and time for the stock with spark-out passes.",
    "keywords": [
      "MAKEOS",
      "surface grinding",
      "grinding power",
      "specific grinding energy",
      "wheel speed",
      "material removal rate",
      "grinding time"
    ],
    "fields": [
      {
        "key": "ds",
        "label": "Wheel diameter",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ns",
        "label": "Wheel speed",
        "type": "number",
        "default": 2600,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vsMax",
        "label": "Wheel maximum operating speed (marked)",
        "type": "number",
        "default": 35,
        "unit": "m/s",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vw",
        "label": "Table speed",
        "type": "number",
        "default": 15,
        "unit": "m/min",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ae",
        "label": "Depth per pass",
        "type": "number",
        "default": 0.01,
        "unit": "mm",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bw",
        "label": "Width ground",
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
        "key": "L",
        "label": "Work length",
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
        "key": "over",
        "label": "Overtravel each end",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stock",
        "label": "Stock to remove",
        "type": "number",
        "default": 0.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "spark",
        "label": "Spark-out passes",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "u",
        "label": "Specific grinding energy",
        "type": "number",
        "default": 30,
        "unit": "J/mm³",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pm",
        "label": "Spindle motor power",
        "type": "number",
        "default": 5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Spindle efficiency",
        "type": "number",
        "default": 80,
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
    "id": "compression-strut-sizing",
    "name": "Compression Strut Sizing (Euler or Johnson, Round Bar or Tube)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What is the smallest round bar or tube that carries this compressive load with my safety factor against buckling, and how does my chosen size compare?",
    "description": "Sizing of a pin-ended or end-restrained compression strut in solid round bar or round tube: the slenderness ratio and transition slenderness, buckling by the Euler formula for slender struts or the Johnson parabola for intermediate ones (as the column buckling tool), the least outside diameter that meets the safety factor (found by search), and the safety factor, stress and mass per metre of the size you choose.",
    "keywords": [
      "MAKEOS",
      "strut sizing",
      "column design",
      "Euler buckling",
      "Johnson formula",
      "tube strut",
      "compression member"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Compressive load",
        "type": "number",
        "default": 50,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length between supports",
        "type": "number",
        "default": 2000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Effective length factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.5,
        "max": 2.1,
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
        "max": 500,
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
        "key": "SF",
        "label": "Safety factor required",
        "type": "number",
        "default": 2.5,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sec",
        "label": "Section",
        "type": "select",
        "default": "bar",
        "options": [
          [
            "bar",
            "Solid round bar"
          ],
          [
            "tube",
            "Round tube"
          ]
        ]
      },
      {
        "key": "Dt",
        "label": "Tube outside diameter ÷ wall thickness",
        "type": "number",
        "default": 15,
        "unit": "",
        "min": 4,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dc",
        "label": "Outside diameter chosen",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
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
  }
]);
