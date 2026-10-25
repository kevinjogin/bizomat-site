// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook35) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "torsion-spring-designer",
    "name": "Torsion Spring Designer (Angle, Stress, Legs and Arbor)",
    "category": "Springs",
    "collection": "MAKEOS",
    "question": "How far will this torsion spring wind under the load, is the bending stress within the allowable, and will it still clear the arbor when wound up?",
    "description": "Design check of a helical torsion spring: the moment from the load and arm, angular deflection including the bending of straight legs (as extra active coils), rate per radian and per turn, bending stress with the inner-fibre curvature factor (as the torsion spring tool), the largest angle before the allowable stress is reached, the coil diameter and body length after windup, and the clearance over the arbor.",
    "keywords": [
      "MAKEOS",
      "torsion spring design",
      "torsion spring legs",
      "arbor clearance",
      "torsion spring stress",
      "spring windup",
      "torque per turn"
    ],
    "fields": [
      {
        "key": "d",
        "label": "Wire diameter",
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
        "key": "D",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Nb",
        "label": "Body coils",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 1,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L1",
        "label": "Length of leg 1 (load leg)",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "Length of leg 2 (fixed leg)",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0,
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
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "F",
        "label": "Load at the arm",
        "type": "number",
        "default": 20,
        "unit": "N",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "arm",
        "label": "Moment arm",
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
        "key": "arbor",
        "label": "Arbor diameter (0 = none)",
        "type": "number",
        "default": 15,
        "unit": "mm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "allow",
        "label": "Allowable bending stress",
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
        "key": "clr",
        "label": "Least arbor clearance (share of arbor diameter)",
        "type": "number",
        "default": 10,
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
    "id": "planetary-gear-set-design",
    "name": "Planetary Gear Set Design (Ratio, Assembly, Forces and Bending)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "Does this planetary gear set assemble with equally spaced planets, what ratio and torque does it give, and are the sun teeth within their bending allowable?",
    "description": "Design check of a simple planetary gear set: planet teeth, ratio, output speed and torque for the chosen fixed member (as the planetary gear tool), the equal-spacing assembly condition and the planet adjacency (tip clearance) check, pitch diameters and centre distance, sun torque and the tangential force per planet with a load-sharing factor, the meshing speed relative to the carrier, the planet pin load and the Lewis bending stress on the sun teeth.",
    "keywords": [
      "MAKEOS",
      "planetary gear design",
      "epicyclic gear",
      "planet load sharing",
      "sun gear bending",
      "assembly condition",
      "planet pin load"
    ],
    "fields": [
      {
        "key": "zs",
        "label": "Sun teeth",
        "type": "number",
        "default": 24,
        "unit": "",
        "min": 9,
        "max": 300,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "zr",
        "label": "Ring teeth",
        "type": "number",
        "default": 72,
        "unit": "",
        "min": 30,
        "max": 1000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "np",
        "label": "Number of planets",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 2,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mode",
        "label": "Arrangement",
        "type": "select",
        "default": "ring",
        "options": [
          [
            "ring",
            "Sun in, ring fixed, carrier out (reduction)"
          ],
          [
            "sun",
            "Ring in, sun fixed, carrier out"
          ],
          [
            "carrier",
            "Sun in, carrier fixed, ring out (reverses)"
          ]
        ]
      },
      {
        "key": "nin",
        "label": "Input speed",
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
        "key": "Tin",
        "label": "Input torque",
        "type": "number",
        "default": 50,
        "unit": "N·m",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Efficiency",
        "type": "number",
        "default": 97,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.5,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Face width",
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
        "key": "Ks",
        "label": "Load-sharing factor",
        "type": "number",
        "default": 1.15,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Lewis form factor (sun)",
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
    "id": "turning-cut-planner",
    "name": "Turning Cut Planner (Speed, Power, Torque, Finish and Time)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What spindle speed, power and torque does this turning cut need, what surface finish will the feed and nose radius give, and how long will it take?",
    "description": "Plan of a turning operation: spindle speed from cutting speed and diameter (held to the machine’s maximum), passes for the radial stock at the depth of cut, cutting force and power from the specific cutting force (as the turning power tool), spindle torque against the machine’s torque at that speed, theoretical peak-to-valley height and roughness from feed and nose radius (as the turning cusp tool), and cutting time (as the turning time tool).",
    "keywords": [
      "MAKEOS",
      "turning planner",
      "turning power",
      "spindle torque",
      "turning surface finish",
      "nose radius",
      "turning time"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Work diameter",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length of cut",
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
        "key": "appr",
        "label": "Approach and overrun",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stock",
        "label": "Radial stock to remove",
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
        "key": "ap",
        "label": "Depth of cut",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 200,
        "unit": "m/min",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Feed",
        "type": "number",
        "default": 0.25,
        "unit": "mm/rev",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Nose radius",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0.05,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kc",
        "label": "Specific cutting force",
        "type": "number",
        "default": 2000,
        "unit": "N/mm²",
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
        "min": 10,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pavail",
        "label": "Spindle power",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nmax",
        "label": "Largest spindle speed",
        "type": "number",
        "default": 4000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Spindle torque available at this speed",
        "type": "number",
        "default": 150,
        "unit": "N·m",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RaMax",
        "label": "Largest roughness Ra wanted",
        "type": "number",
        "default": 3.2,
        "unit": "µm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "flat-belt-drive-design",
    "name": "Flat Belt Drive Design (Wrap, Tensions and Belt Width)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What belt length and wrap does this flat belt drive have, what are the belt tensions, and how wide must the belt be for its allowable stress?",
    "description": "Design of an open flat belt drive: wrap angle on the small pulley, belt length for the centre distance, belt speed, effective pull with a service factor, tight and slack side tensions with the centrifugal tension of the belt (as the belt drive tensions tool), the belt width needed so the tight-side stress stays within your allowable, and the shaft load.",
    "keywords": [
      "MAKEOS",
      "flat belt drive",
      "belt width",
      "belt tension",
      "centrifugal tension",
      "wrap angle",
      "flat belt design"
    ],
    "fields": [
      {
        "key": "kW",
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
        "key": "d",
        "label": "Small pulley diameter",
        "type": "number",
        "default": 160,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Large pulley diameter",
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
        "key": "C",
        "label": "Centre distance",
        "type": "number",
        "default": 1000,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
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
        "key": "t",
        "label": "Belt thickness",
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
        "key": "rho",
        "label": "Belt density",
        "type": "number",
        "default": 1100,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sa",
        "label": "Allowable belt stress",
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
        "key": "b",
        "label": "Belt width chosen",
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
        "key": "vMax",
        "label": "Largest belt speed",
        "type": "number",
        "default": 30,
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
    "id": "disc-brake-design",
    "name": "Caliper Disc Brake Design (Clamp Force, Pad Pressure, Heat)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What clamp force does this caliper disc brake need to stop the inertia in time, is the pad pressure acceptable, and how hot does the disc get per stop?",
    "description": "Design check of a caliper disc brake: the braking torque to stop an inertia in the required time against a load that drives through the stop or helps it, the effective friction radius for uniform wear or uniform pressure, the clamp force for the number of friction faces, pad pressure, friction energy per stop, the disc temperature rise if the disc absorbs the heat, and the stopping angle.",
    "keywords": [
      "MAKEOS",
      "disc brake design",
      "caliper force",
      "pad pressure",
      "brake disc temperature",
      "braking torque",
      "effective friction radius"
    ],
    "fields": [
      {
        "key": "J",
        "label": "Inertia at the brake disc",
        "type": "number",
        "default": 2,
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
        "default": 1000,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ts",
        "label": "Required stop time",
        "type": "number",
        "default": 2,
        "unit": "s",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "TL",
        "label": "Load torque at the disc",
        "type": "number",
        "default": 0,
        "unit": "N·m",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dir",
        "label": "Load during the stop",
        "type": "select",
        "default": "assist",
        "options": [
          [
            "assist",
            "Load helps the stop (friction)"
          ],
          [
            "over",
            "Load drives through the stop (lowering)"
          ]
        ]
      },
      {
        "key": "ro",
        "label": "Pad outer radius",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ri",
        "label": "Pad inner radius",
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
        "key": "basis",
        "label": "Friction radius basis",
        "type": "select",
        "default": "wear",
        "options": [
          [
            "wear",
            "Uniform wear (worn pads)"
          ],
          [
            "pressure",
            "Uniform pressure (new pads)"
          ]
        ]
      },
      {
        "key": "mu",
        "label": "Friction coefficient",
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
        "key": "faces",
        "label": "Friction faces",
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
        "key": "Apad",
        "label": "Pad area per face",
        "type": "number",
        "default": 30,
        "unit": "cm²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pMax",
        "label": "Largest pad pressure",
        "type": "number",
        "default": 2,
        "unit": "MPa",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Fmax",
        "label": "Clamp force available",
        "type": "number",
        "default": 10000,
        "unit": "N",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "md",
        "label": "Disc mass",
        "type": "number",
        "default": 5,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Disc specific heat",
        "type": "number",
        "default": 0.46,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTmax",
        "label": "Largest disc temperature rise per stop",
        "type": "number",
        "default": 150,
        "unit": "K",
        "min": 0.000001,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cover-plate-design",
    "name": "Circular Cover Plate Design (Thickness for Stress and Deflection)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "How thick must this flat circular cover be to carry the pressure within the allowable stress and deflection, and what end force does it put on the bolts?",
    "description": "Design of a flat circular plate or end cover under uniform pressure, with the edge clamped or simply supported: the thickness needed for the allowable bending stress and the thickness needed for the allowable centre deflection, the governing thickness, the stress and deflection at the thickness chosen (as the circular plate tool), and the total pressure force the cover passes to its bolts.",
    "keywords": [
      "MAKEOS",
      "cover plate thickness",
      "flat end cover",
      "circular plate design",
      "plate deflection",
      "blind flange",
      "end cap"
    ],
    "fields": [
      {
        "key": "p",
        "label": "Pressure",
        "type": "number",
        "default": 1,
        "unit": "MPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Unsupported radius",
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
        "key": "edge",
        "label": "Edge support",
        "type": "select",
        "default": "clamped",
        "options": [
          [
            "clamped",
            "Clamped (welded or heavily bolted)"
          ],
          [
            "simple",
            "Simply supported (gasketed, free to rotate)"
          ]
        ]
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
        "key": "allow",
        "label": "Allowable bending stress",
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
        "key": "dMax",
        "label": "Allowable centre deflection",
        "type": "number",
        "default": 0.1,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Thickness chosen",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ca",
        "label": "Corrosion allowance",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hydraulic-power-unit-sizing",
    "name": "Hydraulic Power Unit Sizing (Pump, Motor, Reservoir, Cooling)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What pump displacement and motor power does this hydraulic power unit need, how big should the reservoir be, and does it need a cooler?",
    "description": "Sizing of a hydraulic power unit: pump displacement for the flow at the drive speed and volumetric efficiency, hydraulic power, shaft power with volumetric and mechanical efficiencies (as the hydraulic power tool with the overall efficiency), drive torque, reservoir volume from your multiple of pump flow, heat from the share of power lost and the duty, natural heat dissipation from the reservoir surface, and the cooler capacity still needed.",
    "keywords": [
      "MAKEOS",
      "hydraulic power unit",
      "HPU sizing",
      "pump displacement",
      "reservoir size",
      "hydraulic cooler",
      "hydraulic heat load"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Flow needed",
        "type": "number",
        "default": 40,
        "unit": "L/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Working pressure",
        "type": "number",
        "default": 160,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Drive speed",
        "type": "number",
        "default": 1450,
        "unit": "rpm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etaV",
        "label": "Pump volumetric efficiency",
        "type": "number",
        "default": 92,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etaM",
        "label": "Pump mechanical efficiency",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pmot",
        "label": "Motor rated power",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mult",
        "label": "Reservoir volume ÷ pump flow per minute",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "loss",
        "label": "Share of input power turned to heat",
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
        "key": "duty",
        "label": "Share of time on load",
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
        "key": "k",
        "label": "Reservoir heat transfer coefficient",
        "type": "number",
        "default": 12,
        "unit": "W/m²·K",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Oil temperature above ambient allowed",
        "type": "number",
        "default": 30,
        "unit": "K",
        "min": 0.000001,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "linear-guide-selection",
    "name": "Linear Guide Selection (Carriage Loads, Life and Static Safety)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What load does the most heavily loaded carriage of this linear guide carry, including the offset and acceleration, and how long will the guide last?",
    "description": "Selection check of a profile-rail linear guide with four carriages on two rails: the static load on each carriage from a load offset along and across the rails, the extra load on the leading and trailing carriages from acceleration at the load’s height, the cubic mean load over constant-speed and accelerating travel, nominal life in kilometres on the 50 km basis with a load factor, life in hours from stroke and cycle rate, and the static safety factor.",
    "keywords": [
      "MAKEOS",
      "linear guide selection",
      "profile rail",
      "carriage load",
      "linear bearing life",
      "static safety factor",
      "linear motion"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Moving mass",
        "type": "number",
        "default": 100,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L0",
        "label": "Carriage spacing along the rail",
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
        "key": "W0",
        "label": "Rail spacing",
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
        "key": "x",
        "label": "Load offset along the rail",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -5000,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y",
        "label": "Load offset across the rails",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -5000,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Height of the load centre above the carriages",
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
        "key": "a",
        "label": "Acceleration",
        "type": "number",
        "default": 5,
        "unit": "m/s²",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "acc",
        "label": "Share of travel spent accelerating",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Dynamic load rating per carriage",
        "type": "number",
        "default": 5,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C0",
        "label": "Static load rating per carriage",
        "type": "number",
        "default": 8,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fw",
        "label": "Load factor (shock and vibration)",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 1,
        "max": 3.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stroke",
        "label": "Stroke",
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
        "key": "cpm",
        "label": "Cycles per minute (out and back)",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Life required",
        "type": "number",
        "default": 20000,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fs",
        "label": "Least static safety factor",
        "type": "number",
        "default": 3,
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
    "id": "hydraulic-cylinder-structure",
    "name": "Hydraulic Cylinder Structure (Barrel, End Cap and Rod Buckling)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Is this hydraulic cylinder’s barrel thick enough, will the end cap hold the pressure, and will the rod buckle when it pushes fully extended?",
    "description": "Structural check of a hydraulic cylinder: barrel stresses by the thick-wall (Lamé) equations with closed ends and the von Mises stress at the bore (as the pressure cylinder tool), the least wall for your safety factor, the bore expansion under pressure (which affects the piston seal), the flat end cap thickness as a clamped plate (as the circular plate tool), the push force, and buckling of the fully extended rod by Euler or Johnson (as the column buckling tool).",
    "keywords": [
      "MAKEOS",
      "hydraulic cylinder design",
      "cylinder barrel thickness",
      "rod buckling",
      "end cap thickness",
      "Lamé equations",
      "bore expansion"
    ],
    "fields": [
      {
        "key": "h_barrel",
        "label": "Barrel",
        "type": "heading"
      },
      {
        "key": "bore",
        "label": "Bore",
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
        "key": "t",
        "label": "Barrel wall thickness",
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
        "key": "p",
        "label": "Working pressure",
        "type": "number",
        "default": 160,
        "unit": "bar",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sy",
        "label": "Barrel yield strength",
        "type": "number",
        "default": 355,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SFb",
        "label": "Barrel safety factor required",
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
        "key": "E",
        "label": "Elastic modulus",
        "type": "number",
        "default": 206,
        "unit": "GPa",
        "min": 0.000001,
        "max": 300,
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
        "key": "h_end_cap",
        "label": "End cap",
        "type": "heading"
      },
      {
        "key": "tc",
        "label": "End cap thickness",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sc",
        "label": "End cap allowable stress",
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
        "key": "h_rod",
        "label": "Rod",
        "type": "heading"
      },
      {
        "key": "rod",
        "label": "Rod diameter",
        "type": "number",
        "default": 56,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lb",
        "label": "Mount to rod end, fully extended",
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
        "key": "K",
        "label": "Effective length factor for the mounting",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.5,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SyR",
        "label": "Rod yield strength",
        "type": "number",
        "default": 500,
        "unit": "MPa",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SFr",
        "label": "Rod buckling safety factor required",
        "type": "number",
        "default": 3.5,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
