// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook46) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "tank-calibration-chart",
    "name": "Horizontal Tank Calibration Chart (Shell and Heads, Volume by Depth)",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "How much liquid is in this horizontal cylindrical tank with dished heads at my dip reading, what is the full capacity, and what does the depth chart look like?",
    "description": "Contents of a horizontal cylindrical tank with flat, 2:1 ellipsoidal or hemispherical heads: liquid volume in the shell at a depth (as the tank volume tool), the liquid in both heads at the same depth (the two heads together form a sphere or a half-depth spheroid), total and full capacity (full matching the vessel head volume tool), percentage full, liquid mass, the time to fill the rest at a pump rate, and a calibration chart every tenth of the diameter.",
    "keywords": [
      "MAKEOS",
      "tank calibration",
      "dip chart",
      "horizontal tank volume",
      "partial volume",
      "ellipsoidal heads",
      "tank gauging"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Inside diameter",
        "type": "number",
        "default": 1200,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
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
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "head",
        "label": "Heads",
        "type": "select",
        "default": "ell",
        "options": [
          [
            "ell",
            "2:1 ellipsoidal"
          ],
          [
            "hemi",
            "Hemispherical"
          ],
          [
            "flat",
            "Flat"
          ]
        ]
      },
      {
        "key": "h",
        "label": "Liquid depth (dip)",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 100,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qp",
        "label": "Filling pump rate",
        "type": "number",
        "default": 100,
        "unit": "L/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "guillotine-shear-check",
    "name": "Guillotine Shear Check (Cutting Force, Energy, Power, Thickest Sheet)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "Can this guillotine shear cut my sheet: what force and energy does each cut take, does the motor keep up at my stroke rate, and what is the thickest sheet it can cut in this material?",
    "description": "Check of a sheet-metal guillotine with a raked (inclined) or parallel blade: shearing force and the machine force with the 1.3 allowance (as the shearing blade force tool), energy per cut from the force for parallel blades over the penetration, motor power at the stroke rate and drive efficiency, the sheet width against the blade length, and the thickest sheet the machine capacity allows in this material at this rake.",
    "keywords": [
      "MAKEOS",
      "guillotine shear",
      "shearing force",
      "rake angle",
      "shear capacity",
      "sheet thickness",
      "cutting energy"
    ],
    "fields": [
      {
        "key": "blades",
        "label": "Blade arrangement",
        "type": "select",
        "default": "inclined",
        "options": [
          [
            "inclined",
            "Inclined (raked) blade"
          ],
          [
            "parallel",
            "Parallel blades"
          ]
        ]
      },
      {
        "key": "T",
        "label": "Sheet thickness",
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
        "key": "b",
        "label": "Width of cut",
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
        "key": "tau",
        "label": "Shear strength of the sheet",
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
        "key": "UTS",
        "label": "Tensile strength of the sheet",
        "type": "number",
        "default": 400,
        "unit": "MPa",
        "min": 0.000001,
        "max": 2500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Rake angle",
        "type": "number",
        "default": 2,
        "unit": "°",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Penetration coefficient",
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
        "key": "k",
        "label": "Strength ratio factor",
        "type": "number",
        "default": 0.75,
        "unit": "",
        "min": 0.3,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Relative penetration at fracture",
        "type": "number",
        "default": 0.6,
        "unit": "",
        "min": 0.1,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Machine force capacity",
        "type": "number",
        "default": 300,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "blade",
        "label": "Blade length",
        "type": "number",
        "default": 2500,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cpm",
        "label": "Cuts per minute",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pm",
        "label": "Motor power",
        "type": "number",
        "default": 5.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eta",
        "label": "Drive efficiency",
        "type": "number",
        "default": 70,
        "unit": "%",
        "min": 20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "machine-axis-error-budget",
    "name": "Machine Axis Error Budget (Positioning, Abbe, Thermal, Fixture)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Can this machine axis hold my tolerance once positioning error, repeatability, Abbe error, thermal growth of the screw and fixture error are added up?",
    "description": "Error budget for a dimension made or measured along one machine axis: positioning accuracy and repeatability from the machine test, the Abbe error from the offset between the work and the scale and the axis tilt (as the Abbe error tool), the uncompensated part of the screw or scale thermal growth (as the thermal growth tool), and the fixture or set-up error, combined by worst-case sum and by root-sum-square, against the share of the tolerance you allow the machine.",
    "keywords": [
      "MAKEOS",
      "error budget",
      "machine accuracy",
      "positioning accuracy",
      "Abbe error",
      "thermal growth",
      "capability"
    ],
    "fields": [
      {
        "key": "tol",
        "label": "Tolerance band on the dimension",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0.0005,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "share",
        "label": "Share of the tolerance allowed for the machine",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "acc",
        "label": "Positioning accuracy (from the axis test)",
        "type": "number",
        "default": 8,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rep",
        "label": "Repeatability",
        "type": "number",
        "default": 3,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "offset",
        "label": "Abbe offset",
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
        "key": "tilt",
        "label": "Axis pitch or yaw over the travel",
        "type": "number",
        "default": 5,
        "unit": "arcsec",
        "min": 0,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ls",
        "label": "Screw or scale length in use",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Screw expansion coefficient",
        "type": "number",
        "default": 11.5,
        "unit": "µm/m·K",
        "min": 0,
        "max": 40,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Screw temperature rise",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "comp",
        "label": "Share of thermal growth compensated",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fix",
        "label": "Fixture and set-up error",
        "type": "number",
        "default": 5,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "plastic-gear-drive-check",
    "name": "Plastic Gear Drive Check (Power Rating and Backlash at Temperature)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "Will this plastic gear carry the power, and will the mesh still have backlash when the gears warm up and absorb moisture inside a metal housing?",
    "description": "Check of a plastic spur, helical or bevel gear in a metal housing: power rating by the handbook plastic gear formula with the service factor (as the plastic gear power tool) against the power required, the growth of the gear pitch radii from temperature and moisture swell against the growth of the housing centre distance (the plastic–metal mismatch, as the plastic thermal mismatch tool), the resulting loss of backlash through the pressure angle, and the backlash left at the hot, wet condition.",
    "keywords": [
      "MAKEOS",
      "plastic gear",
      "backlash",
      "moisture swell",
      "thermal expansion",
      "nylon gear",
      "acetal gear"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Gear type",
        "type": "select",
        "default": "spur",
        "options": [
          [
            "spur",
            "Spur"
          ],
          [
            "helical",
            "Helical"
          ],
          [
            "bevel",
            "Bevel"
          ]
        ]
      },
      {
        "key": "F",
        "label": "Face width",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Lewis form factor",
        "type": "number",
        "default": 0.308,
        "unit": "",
        "min": 0.1,
        "max": 0.6,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.2,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ss",
        "label": "Safe stress for the plastic",
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
        "key": "d1",
        "label": "Pinion pitch diameter",
        "type": "number",
        "default": 45,
        "unit": "mm",
        "min": 0.000001,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d2",
        "label": "Gear pitch diameter",
        "type": "number",
        "default": 90,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Pinion speed",
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
        "key": "C",
        "label": "Cone distance (bevel)",
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
        "key": "Preq",
        "label": "Power to transmit",
        "type": "number",
        "default": 100,
        "unit": "W",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_backlash",
        "label": "Backlash",
        "type": "heading"
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
        "key": "j0",
        "label": "Backlash at assembly",
        "type": "number",
        "default": 0.3,
        "unit": "mm",
        "min": 0,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Plastic expansion coefficient",
        "type": "number",
        "default": 80,
        "unit": "µm/m·K",
        "min": 0,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "am",
        "label": "Housing expansion coefficient",
        "type": "number",
        "default": 23,
        "unit": "µm/m·K",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Temperature rise in service",
        "type": "number",
        "default": 40,
        "unit": "K",
        "min": -50,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "swell",
        "label": "Linear swell from moisture",
        "type": "number",
        "default": 0.2,
        "unit": "%",
        "min": 0,
        "max": 3,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "jMin",
        "label": "Least backlash allowed",
        "type": "number",
        "default": 0.02,
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
    "id": "set-screw-hub-check",
    "name": "Set-Screw Hub Retention (Torque, Axial Hold, Screws Needed)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "Will set screws hold this hub on its shaft for the power and axial load, how many are needed, and when should I use a key instead?",
    "description": "Check of a hub, collar or pulley held by cup-point set screws: power, torque and holding force per screw by the handbook empirical rule (as the set-screw holding tool), the torque needed with your safety factor, the number of screws needed, the torque and axial capacity of the screws you fit, and the advice to change to a key or clamp collar when more than two screws would be needed.",
    "keywords": [
      "MAKEOS",
      "set screw",
      "hub retention",
      "holding power",
      "cup point",
      "collar",
      "pulley on shaft"
    ],
    "fields": [
      {
        "key": "D",
        "label": "Shaft diameter",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Set-screw diameter",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Shaft speed",
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
        "key": "P",
        "label": "Power transmitted",
        "type": "number",
        "default": 2.237,
        "unit": "kW",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SF",
        "label": "Safety factor",
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
        "key": "n",
        "label": "Set screws fitted",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 8,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "Fax",
        "label": "Axial load on the hub",
        "type": "number",
        "default": 1000,
        "unit": "N",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "tank-wall-panel-check",
    "name": "Tank Wall Panel under Liquid Pressure (Force, Plate Stress, Deflection)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What liquid pressure and force act on this flat tank wall, and is a panel between stiffeners thick enough in stress and deflection?",
    "description": "Check of a flat-walled (rectangular) tank: pressure at the bottom, the resultant force on the wall and its centre of pressure (as the hydrostatic force tool), and a rectangular panel between stiffeners treated as simply supported under the bottom pressure (conservative), with its bending stress and centre deflection (as the rectangular plate tool), the thickness needed for the allowable stress, and checks against the allowable stress and deflection limit.",
    "keywords": [
      "MAKEOS",
      "tank wall",
      "hydrostatic pressure",
      "rectangular plate",
      "stiffener spacing",
      "panel thickness",
      "water tank"
    ],
    "fields": [
      {
        "key": "h",
        "label": "Liquid depth",
        "type": "number",
        "default": 2,
        "unit": "m",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Liquid density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 100,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Wall width",
        "type": "number",
        "default": 3,
        "unit": "m",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ps",
        "label": "Gas pressure above the liquid",
        "type": "number",
        "default": 0,
        "unit": "kPa",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Panel long side (between stiffeners)",
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
        "key": "l",
        "label": "Panel short side",
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
        "key": "t",
        "label": "Plate thickness",
        "type": "number",
        "default": 7,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
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
        "max": 400,
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
        "label": "Largest panel deflection",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "crane-wheel-rail-check",
    "name": "Crane or Trolley Wheel on Rail (Contact Stress, Wheel Pressure, Travel Force)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "Is this crane or trolley wheel big enough for its load on the rail, and what force and power does it take to roll the machine along?",
    "description": "Check of a steel wheel on a flat-headed rail: Hertz line-contact half-width, peak contact pressure and the depth of the largest shear stress for a cylinder on a flat (as the Hertz contact tool), the mean wheel pressure W ÷ (D b) against your limit, rolling resistance per wheel from the coefficient of rolling friction (as the rolling resistance tool), the total travel force and power for all wheels, and checks of contact pressure and wheel pressure.",
    "keywords": [
      "MAKEOS",
      "crane wheel",
      "rail contact stress",
      "Hertz line contact",
      "wheel load",
      "rolling resistance",
      "travel drive"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Load on one wheel",
        "type": "number",
        "default": 50,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nW",
        "label": "Number of wheels",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 1,
        "max": 64,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "D",
        "label": "Wheel diameter",
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
        "key": "b",
        "label": "Effective rail head width (contact length)",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E1",
        "label": "Wheel modulus",
        "type": "number",
        "default": 210,
        "unit": "GPa",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu1",
        "label": "Wheel Poisson’s ratio",
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
        "key": "E2",
        "label": "Rail modulus",
        "type": "number",
        "default": 210,
        "unit": "GPa",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu2",
        "label": "Rail Poisson’s ratio",
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
        "key": "p0Max",
        "label": "Largest contact pressure",
        "type": "number",
        "default": 1000,
        "unit": "MPa",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pMeanMax",
        "label": "Largest mean wheel pressure W ÷ (D b)",
        "type": "number",
        "default": 5,
        "unit": "MPa",
        "min": 0.000001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "f",
        "label": "Coefficient of rolling friction",
        "type": "number",
        "default": 0.5,
        "unit": "mm",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "v",
        "label": "Travel speed",
        "type": "number",
        "default": 0.5,
        "unit": "m/s",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bar-stock-plan",
    "name": "Bar Stock Plan for Bar-Fed Parts (Bars, Yield, Material Cost, Machine Time)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "How many bars do I need for this batch of bar-fed parts, how much of the bar ends up as parts, what does the material cost, and how long will the run take?",
    "description": "Material and time plan for parts made from bar on a lathe or screw machine: length per part with cut-off and facing allowance, parts per bar, bars to order and stock length and mass (as the screw machine stock tool), material yield, material cost per part, machine hours from the cycle time and bar change time, and shifts needed.",
    "keywords": [
      "MAKEOS",
      "bar stock",
      "screw machine",
      "bar feeder",
      "material yield",
      "parts per bar",
      "cut-off allowance"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Part length",
        "type": "number",
        "default": 25.4,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Cut-off tool width",
        "type": "number",
        "default": 1.57,
        "unit": "mm",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "face",
        "label": "Facing allowance per part",
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
        "key": "bar",
        "label": "Bar length",
        "type": "number",
        "default": 3048,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rem",
        "label": "Remnant (unusable end)",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qty",
        "label": "Parts needed",
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
        "key": "kgm",
        "label": "Bar mass per metre",
        "type": "number",
        "default": 1.2,
        "unit": "kg/m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Material price",
        "type": "number",
        "default": 3,
        "unit": "$/kg",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cycle",
        "label": "Cycle time per part",
        "type": "number",
        "default": 45,
        "unit": "s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "change",
        "label": "Bar change time",
        "type": "number",
        "default": 60,
        "unit": "s",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shift",
        "label": "Hours per shift",
        "type": "number",
        "default": 8,
        "unit": "h",
        "min": 0.000001,
        "max": 24,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "yMin",
        "label": "Least material yield accepted",
        "type": "number",
        "default": 75,
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
    "id": "stockpile-haulage-plan",
    "name": "Stockpile Haulage Plan (Pile Mass, Truck Loads, Loading Time, Ground Pressure)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How much material is in this stockpile, how many truck loads and loader passes will it take to move it, and is the ground under the pile strong enough?",
    "description": "Plan for moving a conical or ridge-shaped stockpile of bulk material: pile height from the angle of repose, volume and mass (as the stockpile weight tool), truck loads at the payload, loader bucket passes at the bucket size and fill factor, loading time at the cycle time, and the peak ground pressure under the highest point of the pile against the allowable bearing pressure.",
    "keywords": [
      "MAKEOS",
      "stockpile",
      "bulk material",
      "truck loads",
      "loader cycles",
      "angle of repose",
      "ground bearing pressure"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Pile shape",
        "type": "select",
        "default": "circle",
        "options": [
          [
            "circle",
            "Conical (round base)"
          ],
          [
            "rect",
            "Ridge (rectangular base)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Base diameter (cone)",
        "type": "number",
        "default": 10,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Base width (ridge)",
        "type": "number",
        "default": 6,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Base length (ridge)",
        "type": "number",
        "default": 20,
        "unit": "m",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "theta",
        "label": "Angle of repose",
        "type": "number",
        "default": 35,
        "unit": "°",
        "min": 10,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Bulk density",
        "type": "number",
        "default": 1600,
        "unit": "kg/m³",
        "min": 100,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pay",
        "label": "Truck payload",
        "type": "number",
        "default": 20,
        "unit": "t",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "bucket",
        "label": "Loader bucket size",
        "type": "number",
        "default": 2,
        "unit": "m³",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fill",
        "label": "Bucket fill factor",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 30,
        "max": 120,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cycleL",
        "label": "Loader cycle time",
        "type": "number",
        "default": 40,
        "unit": "s",
        "min": 0.000001,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qAllow",
        "label": "Allowable ground bearing pressure",
        "type": "number",
        "default": 100,
        "unit": "kPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
