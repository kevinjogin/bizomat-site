// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook37) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "fatigue-design-check",
    "name": "Fatigue Design Check (Corrected Endurance, Notch, Mean Stress, Life)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "Will this notched part survive its fluctuating load indefinitely, and if not, how many cycles will it last?",
    "description": "Fatigue check of a notched part under a fluctuating stress: the endurance limit corrected by your surface, size, load, temperature and reliability factors, the fatigue notch factor from the stress concentration factor and notch radius (as the fatigue notch factor tool), alternating and mean stresses from the nominal maximum and minimum, safety factors by Goodman, Soderberg and Gerber with a first-cycle yield check (as the Goodman fatigue tool), and the finite life from the S-N line for the equivalent fully reversed stress (as the S-N fatigue life tool).",
    "keywords": [
      "MAKEOS",
      "fatigue design",
      "endurance limit",
      "Marin factors",
      "Goodman diagram",
      "fatigue notch factor",
      "fatigue life"
    ],
    "fields": [
      {
        "key": "h_material",
        "label": "Material",
        "type": "heading"
      },
      {
        "key": "Su",
        "label": "Ultimate tensile strength",
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
        "key": "Sy",
        "label": "Yield strength",
        "type": "number",
        "default": 400,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sep",
        "label": "Test-specimen endurance limit (0 = estimate as 0.5 Su, at most 700 MPa)",
        "type": "number",
        "default": 0,
        "unit": "MPa",
        "min": 0,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_endurance_correction_factors",
        "label": "Endurance correction factors",
        "type": "heading"
      },
      {
        "key": "ka",
        "label": "Surface factor",
        "type": "number",
        "default": 0.8,
        "unit": "",
        "min": 0.1,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kb",
        "label": "Size factor",
        "type": "number",
        "default": 0.85,
        "unit": "",
        "min": 0.5,
        "max": 1.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc",
        "label": "Load factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.5,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kd",
        "label": "Temperature factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.3,
        "max": 1.1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ke",
        "label": "Reliability factor",
        "type": "number",
        "default": 0.868,
        "unit": "",
        "min": 0.5,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_notch_and_load",
        "label": "Notch and load",
        "type": "heading"
      },
      {
        "key": "Kt",
        "label": "Stress concentration factor",
        "type": "number",
        "default": 2.2,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Notch radius",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "smax",
        "label": "Nominal maximum stress",
        "type": "number",
        "default": 100,
        "unit": "MPa",
        "min": -3000,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "smin",
        "label": "Nominal minimum stress",
        "type": "number",
        "default": 20,
        "unit": "MPa",
        "min": -3000,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Safety factor required",
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
        "key": "Nreq",
        "label": "Cycles required (if below infinite life)",
        "type": "number",
        "default": 1000000,
        "unit": "cycles",
        "min": 1000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "crane-hook-design",
    "name": "Crane Hook Design (Curved-Beam Stress, Proof Load and Shank)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "Is this lifting hook strong enough at its working load and proof load, allowing for the curvature, and is the threaded shank strong enough?",
    "description": "Check of a hook or curved lifting member with a rectangular critical section: inner and outer fibre stresses by the curved-beam (Winkler–Bach) method at the working load limit (as the curved beam tool), the same stress at the proof load against yield, the straight-beam stress for comparison, and the tensile stress in the threaded shank at the thread stress area.",
    "keywords": [
      "MAKEOS",
      "crane hook design",
      "curved beam",
      "hook stress",
      "proof load",
      "Winkler-Bach",
      "hook shank"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Working load limit",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "proof",
        "label": "Proof load ÷ working load",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ri",
        "label": "Inner radius of the throat",
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
        "key": "h",
        "label": "Section depth (radial)",
        "type": "number",
        "default": 60,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Section width",
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
        "key": "allow",
        "label": "Allowable stress at the working load",
        "type": "number",
        "default": 200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
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
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ds",
        "label": "Shank thread diameter",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ps",
        "label": "Shank thread pitch",
        "type": "number",
        "default": 3.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sA",
        "label": "Allowable shank tensile stress",
        "type": "number",
        "default": 120,
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
    "id": "universal-joint-drive",
    "name": "Universal-Joint Drive (Single or Double Cardan: Speed, Torque, Inertia)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How much does the output speed of this Cardan shaft fluctuate, is a double-joint arrangement phased correctly, and what peak torque do the joints see?",
    "description": "Kinematic and torque check of a single or double Cardan (Hooke’s) joint drive: the output angle traced through a full turn for each joint, speed ratio extremes and fluctuation at the output and at the intermediate shaft (for a single joint, the limits match the universal joint tool), whether a double joint cancels the fluctuation (equal angles and yokes in phase), peak angular accelerations and the inertia torques they cause, and the peak joint torque against your rating.",
    "keywords": [
      "MAKEOS",
      "universal joint",
      "Cardan shaft",
      "double Cardan",
      "joint phasing",
      "speed fluctuation",
      "drive shaft"
    ],
    "fields": [
      {
        "key": "n1",
        "label": "Input speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Input torque",
        "type": "number",
        "default": 100,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mode",
        "label": "Arrangement",
        "type": "select",
        "default": "double",
        "options": [
          [
            "double",
            "Double joint (intermediate shaft)"
          ],
          [
            "single",
            "Single joint"
          ]
        ]
      },
      {
        "key": "b1",
        "label": "Joint 1 angle",
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
        "key": "b2",
        "label": "Joint 2 angle",
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
        "key": "phase",
        "label": "Yokes on the intermediate shaft",
        "type": "select",
        "default": "in",
        "options": [
          [
            "in",
            "In phase (same plane)"
          ],
          [
            "out",
            "90° out of phase"
          ]
        ]
      },
      {
        "key": "Jo",
        "label": "Inertia of the driven side",
        "type": "number",
        "default": 0.5,
        "unit": "kg·m²",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ji",
        "label": "Inertia of the intermediate shaft",
        "type": "number",
        "default": 0.01,
        "unit": "kg·m²",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bMax",
        "label": "Largest joint angle allowed",
        "type": "number",
        "default": 25,
        "unit": "°",
        "min": 1,
        "max": 45,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tr",
        "label": "Joint torque rating",
        "type": "number",
        "default": 400,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "tolerance-stack-design",
    "name": "Tolerance Stack Design (Worst Case, RSS and Predicted Rejects)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Will this assembly gap stay within its limits by worst case, by root-sum-square, and what share of assemblies will fall outside at my process capability?",
    "description": "One-dimensional tolerance stack of up to six dimensions with symmetric tolerances: nominal gap, worst-case limits, root-sum-square (RSS) limits with an inflation factor (as the RSS tolerance stack tool), the statistical spread from each dimension’s process capability index Cp, the predicted share of assemblies outside the required gap assuming normal distributions centred on nominal, and the dimension contributing most.",
    "keywords": [
      "MAKEOS",
      "tolerance stack",
      "RSS tolerance",
      "worst case",
      "tolerance analysis",
      "process capability",
      "assembly gap"
    ],
    "fields": [
      {
        "key": "dir1",
        "label": "Dimension 1",
        "type": "select",
        "default": "add",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom1",
        "label": "Dimension 1 nominal",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol1",
        "label": "Dimension 1 tolerance (±)",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dir2",
        "label": "Dimension 2",
        "type": "select",
        "default": "sub",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom2",
        "label": "Dimension 2 nominal",
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
        "key": "tol2",
        "label": "Dimension 2 tolerance (±)",
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
        "key": "dir3",
        "label": "Dimension 3",
        "type": "select",
        "default": "sub",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom3",
        "label": "Dimension 3 nominal",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol3",
        "label": "Dimension 3 tolerance (±)",
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
        "key": "dir4",
        "label": "Dimension 4",
        "type": "select",
        "default": "sub",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom4",
        "label": "Dimension 4 nominal",
        "type": "number",
        "default": 29.5,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol4",
        "label": "Dimension 4 tolerance (±)",
        "type": "number",
        "default": 0.08,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dir5",
        "label": "Dimension 5",
        "type": "select",
        "default": "off",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom5",
        "label": "Dimension 5 nominal",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol5",
        "label": "Dimension 5 tolerance (±)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dir6",
        "label": "Dimension 6",
        "type": "select",
        "default": "off",
        "options": [
          [
            "add",
            "Adds to the gap"
          ],
          [
            "sub",
            "Subtracts from the gap"
          ],
          [
            "off",
            "Not used"
          ]
        ]
      },
      {
        "key": "nom6",
        "label": "Dimension 6 nominal",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol6",
        "label": "Dimension 6 tolerance (±)",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_requirement",
        "label": "Requirement",
        "type": "heading"
      },
      {
        "key": "reqMin",
        "label": "Smallest gap allowed",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": -10000,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "reqMax",
        "label": "Largest gap allowed",
        "type": "number",
        "default": 0.9,
        "unit": "mm",
        "min": -10000,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "inflate",
        "label": "RSS inflation factor",
        "type": "number",
        "default": 1,
        "unit": "×",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cp",
        "label": "Process capability index of each dimension",
        "type": "number",
        "default": 1.33,
        "unit": "",
        "min": 0.5,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rejMax",
        "label": "Largest reject share accepted",
        "type": "number",
        "default": 0.27,
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
    "id": "leaf-spring-design",
    "name": "Semi-Elliptic Leaf Spring Design (Leaves for Stress and Deflection)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "How many leaves does this semi-elliptic spring need for the load within the allowable stress and deflection, and what rate will it have?",
    "description": "Design of a semi-elliptic (centre-loaded, end-supported) leaf spring of equal-strength graduated leaves: the number of leaves needed to keep the bending stress within the allowable, the number needed to keep the deflection within your limit, the governing count, and the stress, deflection and rate with the leaves you choose (as the leaf spring tool, semi-elliptic case).",
    "keywords": [
      "MAKEOS",
      "leaf spring design",
      "semi-elliptic spring",
      "number of leaves",
      "leaf spring rate",
      "spring deflection",
      "trailer spring"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Load at the centre",
        "type": "number",
        "default": 5000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Span between the ends",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Leaf width",
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
        "key": "t",
        "label": "Leaf thickness",
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
        "key": "E",
        "label": "Elastic modulus",
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
        "key": "allow",
        "label": "Allowable bending stress",
        "type": "number",
        "default": 700,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dMax",
        "label": "Largest deflection allowed",
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
        "key": "n",
        "label": "Leaves chosen",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 1,
        "max": 50,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  },
  {
    "id": "lathe-threading-plan",
    "name": "Lathe Threading Plan (Infeed per Pass, Spindle Speed and Time)",
    "category": "Threads",
    "collection": "MAKEOS",
    "question": "How should I split the thread depth into passes, what spindle speed can I use for this pitch, and how long will the thread take to cut?",
    "description": "Plan of single-point thread turning on a lathe: total radial depth for an external or internal 60° metric thread and constant-chip-area infeed per pass (as the thread infeed tool), spring passes, spindle speed from the cutting speed limited by the machine maximum and by the largest axial feed rate the machine can synchronise, the actual cutting speed, and cutting time for the passes over the thread length with run-in.",
    "keywords": [
      "MAKEOS",
      "lathe threading",
      "thread turning",
      "infeed per pass",
      "threading passes",
      "threading speed",
      "single point threading"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Thread",
        "type": "select",
        "default": "ext",
        "options": [
          [
            "ext",
            "External"
          ],
          [
            "int",
            "Internal"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Major diameter",
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
        "key": "P",
        "label": "Pitch",
        "type": "number",
        "default": 2.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "passes",
        "label": "Cutting passes",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": 2,
        "max": 60,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "spring",
        "label": "Spring (zero-infeed) passes",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "L",
        "label": "Thread length",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "appr",
        "label": "Run-in (acceleration) distance",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 100,
        "unit": "m/min",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmax",
        "label": "Largest spindle speed",
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
        "key": "vfMax",
        "label": "Largest axial feed rate while threading",
        "type": "number",
        "default": 5000,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aMax",
        "label": "Largest infeed per pass",
        "type": "number",
        "default": 0.35,
        "unit": "mm",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aMin",
        "label": "Smallest infeed per pass",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "clevis-pin-joint",
    "name": "Clevis Pin Joint Design (Pin Bending, Shear, Bearing and Eye)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Is this clevis (fork-and-eye) pin joint strong enough: pin bending and shear, bearing in the eye and fork, and tear-out of the eye?",
    "description": "Check of a pinned clevis joint with a central eye between two fork plates: pin bending moment with the load spread over the eye and fork plates and the gaps between them, pin bending stress, double-shear stress (as the bolt and pin shear tool), bearing stress in the eye and in the fork plates, and the eye’s net-section tension and shear tear-out beyond the hole.",
    "keywords": [
      "MAKEOS",
      "clevis pin",
      "pin bending",
      "fork and eye",
      "pin joint design",
      "double shear pin",
      "eye tear-out"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Load",
        "type": "number",
        "default": 20,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pin diameter",
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
        "key": "a",
        "label": "Eye thickness",
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
        "key": "bf",
        "label": "Thickness of each fork plate",
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
        "key": "g",
        "label": "Gap between eye and each fork plate",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Eye edge distance (hole centre to edge)",
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
        "key": "sbA",
        "label": "Allowable pin bending stress",
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
        "key": "tpA",
        "label": "Allowable pin shear stress",
        "type": "number",
        "default": 120,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bA",
        "label": "Allowable bearing stress",
        "type": "number",
        "default": 200,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stA",
        "label": "Allowable eye tensile stress",
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
        "key": "tA",
        "label": "Allowable eye shear stress",
        "type": "number",
        "default": 100,
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
    "id": "o-ring-groove-design",
    "name": "O-Ring Groove Design (Depth, Width, Bore and Extrusion Gap)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What groove depth and width give my target squeeze and fill for this O-ring, what mating diameter does that set, and is the extrusion gap small enough?",
    "description": "Design of a radial O-ring gland (piston or rod): stretch of the ring on the groove diameter and the reduced cross-section, groove depth for your target squeeze, groove width for your target fill, the mating bore or rod diameter that results, and a check of the depth and width you actually choose for squeeze, fill and stretch against your limits (as the O-ring gland tool), with the extrusion gap against your allowable for the pressure.",
    "keywords": [
      "MAKEOS",
      "O-ring groove design",
      "gland depth",
      "O-ring squeeze",
      "gland fill",
      "extrusion gap",
      "piston seal groove"
    ],
    "fields": [
      {
        "key": "gland",
        "label": "Gland",
        "type": "select",
        "default": "piston",
        "options": [
          [
            "piston",
            "Piston (groove on the inner part, seals on a bore)"
          ],
          [
            "rod",
            "Rod (groove in the housing, seals on a rod)"
          ]
        ]
      },
      {
        "key": "id",
        "label": "O-ring inside diameter",
        "type": "number",
        "default": 47.22,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cs",
        "label": "O-ring cross-section",
        "type": "number",
        "default": 2.62,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gd",
        "label": "Groove diameter (bottom for piston, outer for rod)",
        "type": "number",
        "default": 48,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sqT",
        "label": "Target squeeze",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 5,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fillT",
        "label": "Target fill",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 40,
        "max": 95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "depth",
        "label": "Groove depth chosen (0 = use the design value)",
        "type": "number",
        "default": 2.1,
        "unit": "mm",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "width",
        "label": "Groove width chosen (0 = use the design value)",
        "type": "number",
        "default": 3.6,
        "unit": "mm",
        "min": 0,
        "max": 40,
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
        "key": "sqLo",
        "label": "Smallest squeeze",
        "type": "number",
        "default": 15,
        "unit": "%",
        "min": 0,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sqHi",
        "label": "Largest squeeze",
        "type": "number",
        "default": 30,
        "unit": "%",
        "min": 1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fillMax",
        "label": "Largest fill",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 40,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stMax",
        "label": "Largest stretch (piston) or compression (rod)",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gap",
        "label": "Radial extrusion gap",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gapMax",
        "label": "Largest gap for the pressure and hardness",
        "type": "number",
        "default": 0.15,
        "unit": "mm",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "flywheel-rim-design",
    "name": "Flywheel Rim Design (Inertia for Speed Fluctuation, Size and Stress)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What inertia does this flywheel need to hold the speed fluctuation within limits, what disc size gives it, and is the rim speed and stress safe?",
    "description": "Design of a flywheel as a plain annular disc: inertia needed for the energy fluctuation at the mean speed and coefficient of speed fluctuation, the inner diameter that gives that inertia at the outer diameter and width chosen, mass, the energy check by the flywheel energy method, the speed range, rim speed at the top speed, and the largest stress of a rotating disc at the top speed (as the rotating disc tool) against your safety factor.",
    "keywords": [
      "MAKEOS",
      "flywheel design",
      "coefficient of fluctuation",
      "flywheel inertia",
      "rim speed",
      "rotating disc stress",
      "energy fluctuation"
    ],
    "fields": [
      {
        "key": "dE",
        "label": "Energy fluctuation per cycle",
        "type": "number",
        "default": 5,
        "unit": "kJ",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Mean speed",
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
        "key": "Cs",
        "label": "Coefficient of speed fluctuation",
        "type": "number",
        "default": 0.05,
        "unit": "",
        "min": 0.002,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Do",
        "label": "Outer diameter",
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
        "key": "b",
        "label": "Width (axial)",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Density",
        "type": "number",
        "default": 7200,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Poisson’s ratio",
        "type": "number",
        "default": 0.26,
        "unit": "",
        "min": 0.1,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Strength (yield or tensile for cast iron)",
        "type": "number",
        "default": 150,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Safety factor required",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": 1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vMax",
        "label": "Largest rim speed",
        "type": "number",
        "default": 30,
        "unit": "m/s",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
