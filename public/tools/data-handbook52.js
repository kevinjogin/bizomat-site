// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook52) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "pusher-move-check",
    "name": "Pusher or Transfer Move Check (Motion Profile, Force, Stop Impact)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What acceleration, speed and force does my pusher need to move this part over the stroke in the time I want, and how hard will it hit if it stops against a hard stop at full speed?",
    "description": "Check of a pusher, transfer or shuttle moving a part over a stroke in a set time with a symmetric accelerate–decelerate (triangular) profile: acceleration, peak speed and the distance covered at peak speed (as the uniformly accelerated motion tool), the force to accelerate the part against sliding friction and the braking force, peak power, and the average impact force if the part is instead stopped at full speed by a hard stop in the stop time (as the impulse and momentum tool), against the actuator force and the stop’s allowable load.",
    "keywords": [
      "MAKEOS",
      "pusher",
      "transfer",
      "motion profile",
      "actuator force",
      "impact force",
      "automation"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Moving mass (part and slide)",
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
        "key": "s",
        "label": "Stroke",
        "type": "number",
        "default": 0.3,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Move time",
        "type": "number",
        "default": 0.6,
        "unit": "s",
        "min": 0.01,
        "max": 1000,
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
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ts",
        "label": "Stop time if it hits a hard stop",
        "type": "number",
        "default": 0.01,
        "unit": "s",
        "min": 0.0001,
        "max": 10,
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
        "key": "Fact",
        "label": "Actuator force available",
        "type": "number",
        "default": 1000,
        "unit": "N",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fstop",
        "label": "Allowable load on the stop",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "lid-counterbalance-spring",
    "name": "Lid Counterbalance with Torsion Springs (Balance, Handle Force, Spring Stress)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "Will these torsion springs counterbalance my hinged lid so it is easy to lift and stays open, and are the springs within stress when wound up?",
    "description": "Check of a hinged lid, hatch or guard balanced by torsion springs at the hinge: the lid’s weight torque as it opens, each spring’s rate from its wire, coil and turns (as the helical torsion spring tool), the spring torque from the wind-up at the closed position, the out-of-balance torque over the whole opening and the largest force at the handle, whether the lid stays open and shut, and the spring stress at full wind-up against your allowable.",
    "keywords": [
      "MAKEOS",
      "counterbalance",
      "torsion spring",
      "lid",
      "hatch",
      "hinge spring",
      "handle force"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Lid mass",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Hinge to lid centre of gravity",
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
        "key": "open",
        "label": "Opening angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 5,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nS",
        "label": "Number of springs",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": 1,
        "integer": true,
        "sens": false
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
        "default": 5,
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
        "default": 32,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nb",
        "label": "Body turns",
        "type": "number",
        "default": 8,
        "unit": "turns",
        "min": 0.5,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 207,
        "unit": "GPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "th0",
        "label": "Wind-up at the closed position",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 1300,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_handle",
        "label": "Handle",
        "type": "heading"
      },
      {
        "key": "handle",
        "label": "Hinge to handle",
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
        "key": "Fmax",
        "label": "Largest handle force",
        "type": "number",
        "default": 50,
        "unit": "N",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "triaxial-stress-check",
    "name": "Triaxial Stress Check (Principal Stresses, von Mises, Tresca, Strains)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "For this three-dimensional stress state, what are the principal stresses, how close is it to yield by von Mises and by Tresca, and what strains will a gauge or a fit see?",
    "description": "Check of a general three-dimensional stress state: principal stresses from the stress invariants, maximum shear and von Mises stress (as the three-dimensional principal stress tool), the safety factor against yield by von Mises and by Tresca, shear and bulk moduli from E and Poisson’s ratio (as the elastic constants tool), the principal strains by Hooke’s law and the volume change, against your required factor.",
    "keywords": [
      "MAKEOS",
      "principal stress",
      "von Mises",
      "Tresca",
      "triaxial stress",
      "strain",
      "yield criterion"
    ],
    "fields": [
      {
        "key": "sx",
        "label": "σx",
        "type": "number",
        "default": 80,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sy",
        "label": "σy",
        "type": "number",
        "default": -30,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sz",
        "label": "σz",
        "type": "number",
        "default": 20,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "txy",
        "label": "τxy",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tyz",
        "label": "τyz",
        "type": "number",
        "default": 10,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tzx",
        "label": "τzx",
        "type": "number",
        "default": -15,
        "unit": "MPa",
        "min": -100000,
        "max": 100000,
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
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.000001,
        "max": 2000,
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
        "min": 0,
        "max": 0.4999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 350,
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
  },
  {
    "id": "machine-noise-acceptance",
    "name": "Machine Noise Acceptance Test (Background Correction, Distance, Limit)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "From my sound level readings with the machine running and stopped, what is the machine’s own noise, is the background low enough for a valid test, and does it meet the limit at the specified distance?",
    "description": "Acceptance check of a machine against a noise limit: the machine’s own level from the total reading and the background with it stopped (as the machinery noise tool, machine mode), the validity of the test from the difference between the readings, the level corrected to the distance in the specification and to the operator’s position by the inverse-square law (as the machinery noise tool, distance mode), and the comparison with the limit.",
    "keywords": [
      "MAKEOS",
      "noise test",
      "background correction",
      "sound level",
      "machine acceptance",
      "decibel",
      "noise limit"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Reading with the machine running",
        "type": "number",
        "default": 88,
        "unit": "dB",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Background reading, machine stopped",
        "type": "number",
        "default": 80,
        "unit": "dB",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r1",
        "label": "Measurement distance",
        "type": "number",
        "default": 1,
        "unit": "m",
        "min": 0.1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rS",
        "label": "Distance in the specification",
        "type": "number",
        "default": 1,
        "unit": "m",
        "min": 0.1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rOp",
        "label": "Operator distance",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0.1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "limit",
        "label": "Specified limit",
        "type": "number",
        "default": 90,
        "unit": "dB",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minDiff",
        "label": "Least difference between readings for a valid test",
        "type": "number",
        "default": 3,
        "unit": "dB",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "melt-charge-blend",
    "name": "Melt Charge Blend (Two Materials to a Target Content, Batch Masses, Cost)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much of each of my two charge materials do I melt to hit the target alloy content, what do I weigh out for the batch, and what does the charge cost per kilogram?",
    "description": "Blend of two charge materials (two scrap grades, a base metal and a master alloy) to reach a target content of an element by alligation (as the mixture blending tool), the masses of each for the batch with a melt loss allowance for the element, and the charge cost per kilogram as a weighted average (as the mixture value tool), checked against your cost limit.",
    "keywords": [
      "MAKEOS",
      "charge calculation",
      "alloy blending",
      "alligation",
      "melt charge",
      "scrap blend",
      "master alloy"
    ],
    "fields": [
      {
        "key": "cA",
        "label": "Content of material A",
        "type": "number",
        "default": 7,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cB",
        "label": "Content of material B",
        "type": "number",
        "default": 12,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cT",
        "label": "Target content in the melt",
        "type": "number",
        "default": 9,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "loss",
        "label": "Melt loss of the element",
        "type": "number",
        "default": 0,
        "unit": "% of content",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "batch",
        "label": "Charge mass",
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
        "key": "pA",
        "label": "Price of A",
        "type": "number",
        "default": 2,
        "unit": "$/kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pB",
        "label": "Price of B",
        "type": "number",
        "default": 3,
        "unit": "$/kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "maxCost",
        "label": "Highest charge cost",
        "type": "number",
        "default": 2.6,
        "unit": "$/kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "angle-ring-cut-plan",
    "name": "Angle Ring Cut Plan (Cut Length, Bars, Joints, Waste, Mass)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How long do I cut angle or flat bar to roll into rings for this shell, how many stock bars and joints do I need, and how much is wasted?",
    "description": "Cutting plan for rolled stiffening or flange rings of angle or bar fitted inside or outside a shell: cut length from the shell diameter corrected to the section’s neutral axis (as the length of angle bent to a ring tool), joints per ring when one ring needs more than one stock length, stock bars for the quantity with saw kerf, waste, mass of each ring and the material cost, with the waste checked against your limit.",
    "keywords": [
      "MAKEOS",
      "angle ring",
      "rolled ring",
      "cut length",
      "stiffening ring",
      "stock bars",
      "fabrication"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Correction from",
        "type": "select",
        "default": "axis",
        "options": [
          [
            "axis",
            "Neutral-axis distance"
          ],
          [
            "constant",
            "Length constant"
          ]
        ]
      },
      {
        "key": "place",
        "label": "Section is",
        "type": "select",
        "default": "inside",
        "options": [
          [
            "inside",
            "Inside the shell (diameter is the inside of the shell)"
          ],
          [
            "outside",
            "Outside the shell (diameter is the outside of the shell)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Shell diameter at the back of the section",
        "type": "number",
        "default": 6096,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x",
        "label": "Back of section to neutral axis",
        "type": "number",
        "default": 22.5,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Length constant",
        "type": "number",
        "default": 109.7,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_stock_and_cost",
        "label": "Stock and cost",
        "type": "heading"
      },
      {
        "key": "qty",
        "label": "Rings needed",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "stock",
        "label": "Stock bar length",
        "type": "number",
        "default": 6,
        "unit": "m",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kerf",
        "label": "Saw kerf and end trim per cut",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "area",
        "label": "Section area",
        "type": "number",
        "default": 900,
        "unit": "mm²",
        "min": 0.000001,
        "max": 1000000,
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
        "key": "price",
        "label": "Material price",
        "type": "number",
        "default": 2,
        "unit": "$/kg",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "maxWaste",
        "label": "Largest waste",
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
    "id": "two-span-stringer-check",
    "name": "Two-Span Stringer Check (Continuous Beam, Deflection, Support Reactions)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "Is a beam running continuously over three supports strong and stiff enough for this load, and can the middle support take its share?",
    "description": "Check of a stringer, rail or pipe-rack beam continuous over two spans with a uniform load plus its own weight: support reactions, the negative moment over the middle support, the span moments, the bending stress and the span deflections (as the continuous beam over two spans tool), against your allowable stress, deflection limit as a fraction of span, and the capacity of each support.",
    "keywords": [
      "MAKEOS",
      "continuous beam",
      "two-span beam",
      "stringer",
      "pipe rack",
      "support reaction",
      "deflection limit"
    ],
    "fields": [
      {
        "key": "L1",
        "label": "Span 1",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "Span 2",
        "type": "number",
        "default": 3000,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Applied uniform load",
        "type": "number",
        "default": 2000,
        "unit": "N/m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "self",
        "label": "Beam mass per metre",
        "type": "number",
        "default": 15,
        "unit": "kg/m",
        "min": 0,
        "max": 100000,
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
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "I",
        "label": "Second moment of area",
        "type": "number",
        "default": 8000000,
        "unit": "mm⁴",
        "min": 0.000001,
        "max": 100000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Distance to extreme fibre",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
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
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dRatio",
        "label": "Deflection limit (span ÷ …)",
        "type": "number",
        "default": 300,
        "unit": "",
        "min": 50,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rmax",
        "label": "Capacity of each support",
        "type": "number",
        "default": 15,
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
    "id": "inch-spur-gear-check",
    "name": "Inch Spur Gear Pair Check (Diametral Pitch Proportions, Pinion Bending)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "For this diametral-pitch spur gear pair, what are the pitch and outside diameters and centre distance, and is the pinion strong enough for the horsepower?",
    "description": "Check of a spur gear pair made to inch diametral-pitch proportions: pitch and outside diameters and centre distance for the tooth system (as the spur gear dimensions by diametral pitch tool), the ratio and gear speed, pinion torque and tangential force from the horsepower, and the Lewis bending stress with the velocity factor for the way the teeth are made (as the Lewis bending stress tool, worked in metric with module = 25.4 ÷ P), against your allowable.",
    "keywords": [
      "MAKEOS",
      "diametral pitch",
      "inch gears",
      "spur gear",
      "Lewis bending",
      "horsepower",
      "centre distance"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Diametral pitch",
        "type": "number",
        "default": 10,
        "unit": "1/in",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n1",
        "label": "Pinion teeth",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 5,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "n2",
        "label": "Gear teeth",
        "type": "number",
        "default": 45,
        "unit": "",
        "min": 5,
        "max": 5000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "system",
        "label": "Tooth system",
        "type": "select",
        "default": "20fd",
        "options": [
          [
            "20fd",
            "20° full depth"
          ],
          [
            "14fd",
            "14½° full depth"
          ],
          [
            "20stub",
            "20° stub"
          ]
        ]
      },
      {
        "key": "h_load",
        "label": "Load",
        "type": "heading"
      },
      {
        "key": "hp",
        "label": "Power",
        "type": "number",
        "default": 5,
        "unit": "hp",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Pinion speed",
        "type": "number",
        "default": 1200,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "face",
        "label": "Face width",
        "type": "number",
        "default": 1.25,
        "unit": "in",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Lewis form factor of the pinion",
        "type": "number",
        "default": 0.32,
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
  },
  {
    "id": "equipment-finance-plan",
    "name": "Equipment Finance Plan (Loan Payment, Depreciation, Tax, Yearly Cash Flow)",
    "category": "Money",
    "collection": "MAKEOS",
    "question": "If I borrow to buy this machine, does the saving it brings cover the loan payments each year once depreciation and tax are counted?",
    "description": "Yearly cash-flow plan for a machine bought with a loan: the level loan payment from the purchase price, rate and term (capital recovery factor as the interest and equivalence factors tool), the interest and principal in each payment, the depreciation in each year by straight line, sum of the years’ digits or double declining balance (as the depreciation schedule tool), tax on the saving less depreciation and interest, and the after-tax cash flow each year and in total, checked for any year with a shortfall.",
    "keywords": [
      "MAKEOS",
      "equipment finance",
      "loan payment",
      "depreciation",
      "after-tax cash flow",
      "machine purchase",
      "capital recovery"
    ],
    "fields": [
      {
        "key": "cost",
        "label": "Machine cost",
        "type": "number",
        "default": 100000,
        "unit": "AUD",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "salvage",
        "label": "Salvage value at end of life",
        "type": "number",
        "default": 10000,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "life",
        "label": "Depreciation life",
        "type": "number",
        "default": 5,
        "unit": "years",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "method",
        "label": "Depreciation method",
        "type": "select",
        "default": "sl",
        "options": [
          [
            "sl",
            "Straight line"
          ],
          [
            "syd",
            "Sum of the years’ digits"
          ],
          [
            "ddb",
            "Double declining balance (200% ÷ life)"
          ]
        ]
      },
      {
        "key": "h_loan",
        "label": "Loan",
        "type": "heading"
      },
      {
        "key": "rate",
        "label": "Loan interest rate",
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
        "key": "n",
        "label": "Loan term",
        "type": "number",
        "default": 5,
        "unit": "years",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_operation",
        "label": "Operation",
        "type": "heading"
      },
      {
        "key": "save",
        "label": "Yearly operating saving or extra profit",
        "type": "number",
        "default": 30000,
        "unit": "AUD",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tax",
        "label": "Tax rate",
        "type": "number",
        "default": 30,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
