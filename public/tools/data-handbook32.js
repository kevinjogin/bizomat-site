// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook32) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "bearing-fit-clearance",
    "name": "Bearing Fit and Operating Internal Clearance",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How much radial internal clearance will this bearing have once it is pressed on and running warm, and could it go into preload?",
    "description": "Operating radial internal clearance of a rolling bearing: the initial clearance range, the reduction from the inner ring expanding on an interference shaft fit and the outer ring contracting in an interference housing fit (as shares of the effective interference), the reduction from the inner ring running hotter than the outer, and the resulting operating clearance range with a preload check.",
    "keywords": [
      "MAKEOS",
      "bearing internal clearance",
      "bearing fit",
      "C3 clearance",
      "interference fit",
      "bearing preload",
      "operating clearance"
    ],
    "fields": [
      {
        "key": "cmin",
        "label": "Initial radial clearance, minimum",
        "type": "number",
        "default": 25,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cmax",
        "label": "Initial radial clearance, maximum",
        "type": "number",
        "default": 40,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Bore diameter",
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
        "key": "D",
        "label": "Outside diameter",
        "type": "number",
        "default": 90,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ii",
        "label": "Effective shaft interference",
        "type": "number",
        "default": 20,
        "unit": "µm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fi",
        "label": "Share of shaft interference reaching the raceway",
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
        "key": "Io",
        "label": "Effective housing interference",
        "type": "number",
        "default": 0,
        "unit": "µm",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fo",
        "label": "Share of housing interference reaching the raceway",
        "type": "number",
        "default": 0.7,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Inner ring hotter than outer ring by",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": -50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Bearing steel expansion coefficient",
        "type": "number",
        "default": 12,
        "unit": "µm/m·K",
        "min": 0.000001,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cminReq",
        "label": "Smallest operating clearance acceptable",
        "type": "number",
        "default": 0,
        "unit": "µm",
        "min": -50,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "overhung-load-check",
    "name": "Overhung (Radial) Load on a Gearbox or Motor Shaft",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What radial load does this pulley, sprocket or gear put on the gearbox shaft, and is it within the allowable at its position?",
    "description": "Overhung load check: shaft torque from power and speed, overhung load from the drive element’s pitch diameter and its tension factor (chain, gear, V-belt or flat belt), the catalogue allowable corrected for where the load actually sits on the shaft, and the resulting load on the outer bearing from the lever over the bearing span.",
    "keywords": [
      "MAKEOS",
      "overhung load",
      "OHL",
      "radial load",
      "gearbox shaft load",
      "belt pull",
      "sprocket load"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Power at the shaft",
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
        "key": "n",
        "label": "Shaft speed",
        "type": "number",
        "default": 100,
        "unit": "rpm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "elem",
        "label": "Drive element",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Chain sprocket (factor 1.0)"
          ],
          [
            "1.25",
            "Spur or helical gear (factor 1.25)"
          ],
          [
            "1.5",
            "V-belt pulley (factor 1.5)"
          ],
          [
            "2.5",
            "Flat belt pulley (factor 2.5)"
          ]
        ]
      },
      {
        "key": "Dp",
        "label": "Pitch diameter of the element",
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
        "key": "Fa",
        "label": "Catalogue allowable overhung load",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lc",
        "label": "Catalogue load position from the outer bearing",
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
        "key": "La",
        "label": "Actual load position from the outer bearing",
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
        "key": "S",
        "label": "Distance between the shaft bearings",
        "type": "number",
        "default": 120,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "injection-moulding-estimate",
    "name": "Injection Moulding Clamp, Shot, Cooling and Cycle Estimate",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What clamp force and shot size does this mould need, how long will it take to cool, and how many parts per hour will it make?",
    "description": "First estimate for an injection moulding job: clamp force from projected area of the cavities and runner and the cavity pressure with a margin, shot volume and mass against the barrel capacity, cooling time for the wall thickness from the plastic’s thermal diffusivity and the melt, mould and ejection temperatures, cycle time and output per hour.",
    "keywords": [
      "MAKEOS",
      "injection moulding",
      "clamp tonnage",
      "shot size",
      "cooling time",
      "cycle time",
      "moulding machine selection"
    ],
    "fields": [
      {
        "key": "h_mould",
        "label": "Mould",
        "type": "heading"
      },
      {
        "key": "Ap",
        "label": "Projected area per part",
        "type": "number",
        "default": 50,
        "unit": "cm²",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cav",
        "label": "Cavities",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 256,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Ar",
        "label": "Runner projected area",
        "type": "number",
        "default": 20,
        "unit": "cm²",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pc",
        "label": "Cavity pressure",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "marg",
        "label": "Clamp margin",
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
        "key": "Vp",
        "label": "Part volume",
        "type": "number",
        "default": 30,
        "unit": "cm³",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vr",
        "label": "Runner volume",
        "type": "number",
        "default": 10,
        "unit": "cm³",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Melt density",
        "type": "number",
        "default": 0.95,
        "unit": "g/cm³",
        "min": 0.000001,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cooling",
        "label": "Cooling",
        "type": "heading"
      },
      {
        "key": "s",
        "label": "Wall thickness",
        "type": "number",
        "default": 2.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Thermal diffusivity of the plastic",
        "type": "number",
        "default": 0.09,
        "unit": "mm²/s",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tm",
        "label": "Melt temperature",
        "type": "number",
        "default": 230,
        "unit": "°C",
        "min": 0.000001,
        "max": 450,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tw",
        "label": "Mould temperature",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Te",
        "label": "Ejection temperature",
        "type": "number",
        "default": 90,
        "unit": "°C",
        "min": 0.000001,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tOther",
        "label": "Other cycle time (fill, hold, open, eject, close)",
        "type": "number",
        "default": 8,
        "unit": "s",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_machine",
        "label": "Machine",
        "type": "heading"
      },
      {
        "key": "clamp",
        "label": "Machine clamp force",
        "type": "number",
        "default": 1500,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "barrel",
        "label": "Machine shot capacity",
        "type": "number",
        "default": 300,
        "unit": "cm³",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bearing-friction-oil-flow",
    "name": "Bearing and Gear Losses with Circulating Oil Flow",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How much heat do these bearings and gears make, and how much circulating oil carries it away?",
    "description": "Heat from rolling bearings by the friction-coefficient method (torque = μ P d ÷ 2, as the bearing friction tool) plus other losses such as gear mesh or seals, and the circulating oil flow to carry that heat away at an allowed oil temperature rise (as the coolant heat-flow tool with oil properties).",
    "keywords": [
      "MAKEOS",
      "bearing friction",
      "oil flow",
      "circulating lubrication",
      "bearing heat",
      "oil temperature rise",
      "lubrication system"
    ],
    "fields": [
      {
        "key": "nb",
        "label": "Number of bearings",
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
        "key": "P",
        "label": "Equivalent load per bearing",
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
        "label": "Bearing bore",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Bearing friction coefficient",
        "type": "number",
        "default": 0.0015,
        "unit": "",
        "min": 0.0005,
        "max": 0.02,
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
        "key": "other",
        "label": "Other losses (gear mesh, seals, churning)",
        "type": "number",
        "default": 200,
        "unit": "W",
        "min": 0,
        "max": 10000000,
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
      }
    ]
  },
  {
    "id": "press-brake-setup",
    "name": "Press Brake Set-up: Die, Radius, Flange and Tonnage",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "Which V-die should I use for this bend, what inside radius and minimum flange will it give, and is the press brake big enough?",
    "description": "Air-bending set-up for a press brake: the die opening from a chosen multiple of thickness (rounded up to a common die opening), the inside radius that air bending produces (a share of the die opening), the shortest flange that still spans the die, the bending force by the handbook-style formula (as the press brake force tool), force per metre and the press capacity check.",
    "keywords": [
      "MAKEOS",
      "press brake setup",
      "V-die selection",
      "air bending radius",
      "minimum flange length",
      "bending tonnage",
      "die opening"
    ],
    "fields": [
      {
        "key": "t",
        "label": "Thickness",
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
        "key": "uts",
        "label": "Tensile strength",
        "type": "number",
        "default": 450,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Bend length",
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
        "key": "vr",
        "label": "Die opening as a multiple of thickness",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": 4,
        "max": 16,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rf",
        "label": "Inside radius ÷ die opening (air bending)",
        "type": "number",
        "default": 0.16,
        "unit": "",
        "min": 0.05,
        "max": 0.4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "flf",
        "label": "Minimum flange ÷ die opening",
        "type": "number",
        "default": 0.7,
        "unit": "",
        "min": 0.4,
        "max": 1.2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Bending factor",
        "type": "number",
        "default": 1.33,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Press capacity",
        "type": "number",
        "default": 1000,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dieRate",
        "label": "Die rating (force per metre)",
        "type": "number",
        "default": 1000,
        "unit": "kN/m",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gearbox-selection-check",
    "name": "Gearbox Selection Check (Service Factor, Thermal and Torque)",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Is this catalogue gearbox right for my motor and load once the service factor and thermal rating are applied?",
    "description": "Selection check of a catalogue gearbox: output speed and torque from motor power, ratio and efficiency, the mechanical rating needed with the service factor against the catalogue rating, the thermal rating against the actual power (thermal ratings are not multiplied by the service factor), and output torque with service factor against the catalogue torque.",
    "keywords": [
      "MAKEOS",
      "gearbox selection",
      "service factor",
      "thermal rating",
      "gear reducer",
      "output torque",
      "catalogue rating"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Motor power",
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
        "label": "Input speed",
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
        "key": "i",
        "label": "Gear ratio",
        "type": "number",
        "default": 14.5,
        "unit": "",
        "min": 1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
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
        "key": "SF",
        "label": "Service factor for the duty",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 0.8,
        "max": 4,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pmech",
        "label": "Catalogue mechanical rating at this input speed",
        "type": "number",
        "default": 11,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pth",
        "label": "Catalogue thermal rating",
        "type": "number",
        "default": 9,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2r",
        "label": "Catalogue output torque rating",
        "type": "number",
        "default": 1000,
        "unit": "N·m",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "riveted-joint-design",
    "name": "Riveted Joint Design (Balanced Pitch and Rivet Count)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "What rivet pitch balances plate and rivet strength, how efficient is the joint, and how many rivets carry the load?",
    "description": "Design of a riveted lap or butt joint: strength of the rivets per pitch in shear and crushing, the balanced pitch at which plate tearing equals the rivet strength, joint efficiency at that pitch (as the riveted joint tool), the number of pitches along the joint length and the joint capacity against the load, with the minimum pitch of three diameters.",
    "keywords": [
      "MAKEOS",
      "riveted joint design",
      "rivet pitch",
      "joint efficiency",
      "rivet shear",
      "plate tearing",
      "lap joint"
    ],
    "fields": [
      {
        "key": "t",
        "label": "Plate thickness",
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
        "key": "d",
        "label": "Rivet hole diameter",
        "type": "number",
        "default": 17,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rows",
        "label": "Rivet rows",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "shear",
        "label": "Shear planes per rivet",
        "type": "select",
        "default": "1",
        "options": [
          [
            "1",
            "Single shear (lap joint)"
          ],
          [
            "2",
            "Double shear (butt joint with two straps)"
          ]
        ]
      },
      {
        "key": "st",
        "label": "Allowable tensile stress of the plate",
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
        "key": "tau",
        "label": "Allowable rivet shear stress",
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
        "key": "sc",
        "label": "Allowable crushing (bearing) stress",
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
        "key": "Lj",
        "label": "Joint length",
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
        "key": "F",
        "label": "Load on the joint",
        "type": "number",
        "default": 300,
        "unit": "kN",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "storage-tank-shell",
    "name": "Vertical Storage Tank Shell Thickness by Course",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "How thick must each shell course of this vertical liquid storage tank be, and what does the shell weigh?",
    "description": "Shell plate thickness for an open-top or low-pressure vertical cylindrical storage tank under its liquid head, course by course, by the widely used one-foot method (API 650 style) with joint efficiency, corrosion allowance and a minimum thickness, with tank capacity and shell steel mass — for preliminary comparison.",
    "keywords": [
      "MAKEOS",
      "storage tank",
      "tank shell thickness",
      "one-foot method",
      "API 650",
      "tank courses",
      "liquid head"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Tank diameter",
        "type": "number",
        "default": 20,
        "unit": "m",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Hl",
        "label": "Design liquid height",
        "type": "number",
        "default": 12,
        "unit": "m",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "G",
        "label": "Specific gravity of the liquid",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.3,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "S",
        "label": "Allowable stress",
        "type": "number",
        "default": 160,
        "unit": "MPa",
        "min": 0.000001,
        "max": 500,
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
        "min": 0.5,
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
        "key": "tmin",
        "label": "Minimum shell thickness",
        "type": "number",
        "default": 6,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hc",
        "label": "Course (plate) height",
        "type": "number",
        "default": 2,
        "unit": "m",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoS",
        "label": "Steel density",
        "type": "number",
        "default": 7850,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "milling-cost-per-part",
    "name": "Milling Time and Cost per Part with Tool Life",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How long does this milling operation take and what does it cost per part, including tool wear and set-up?",
    "description": "Cost of a milling operation per part: cutting time from the volume to remove and the removal rate (from width, depth and table feed), tool edges used from the tool life at those conditions, tool change time and edge cost, non-cutting time, set-up spread over the batch, and the machine rate, with the cost breakdown.",
    "keywords": [
      "MAKEOS",
      "milling cost",
      "cost per part",
      "machining time",
      "tool cost",
      "metal removal rate",
      "insert cost"
    ],
    "fields": [
      {
        "key": "Vol",
        "label": "Volume to remove",
        "type": "number",
        "default": 120,
        "unit": "cm³",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ae",
        "label": "Radial width of cut",
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
        "key": "ap",
        "label": "Axial depth of cut",
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
        "key": "vf",
        "label": "Table feed",
        "type": "number",
        "default": 573,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tl",
        "label": "Tool life at these conditions",
        "type": "number",
        "default": 45,
        "unit": "min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "z",
        "label": "Inserts (edges) per change",
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
        "key": "edge",
        "label": "Cost per edge",
        "type": "number",
        "default": 3,
        "unit": "$",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tch",
        "label": "Time to change all edges",
        "type": "number",
        "default": 3,
        "unit": "min",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tnc",
        "label": "Non-cutting time per part",
        "type": "number",
        "default": 1.5,
        "unit": "min",
        "min": 0,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rate",
        "label": "Machine and labour rate",
        "type": "number",
        "default": 110,
        "unit": "$/h",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "setup",
        "label": "Set-up time per batch",
        "type": "number",
        "default": 60,
        "unit": "min",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "batch",
        "label": "Batch quantity",
        "type": "number",
        "default": 50,
        "unit": "",
        "min": 1,
        "max": 100000000,
        "step": 1,
        "integer": true,
        "sens": false
      }
    ]
  }
]);
