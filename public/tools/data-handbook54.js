// BIZOMAT MAKEOS: Machinery’s Handbook topic tools (batch handbook54) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "heating-coil-plan",
    "name": "Tank Heating or Cooling Coil Plan (Area, Tube Length, Turns, Pressure Drop)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How many turns of tube does my tank heating or cooling coil need for the duty, how long is the tube, and what pressure drop will the water see through it?",
    "description": "Plan for a helical tube coil in a tank: heat-transfer area needed for the duty from the overall coefficient and mean temperature difference, the tube length and turns that give it, the developed length of the coil you choose with its straight ends (as the helix length tool), the area it provides, and the velocity, friction factor and pressure drop of the fluid through the tube (as the pipe friction tool), checked against the duty and your pressure-drop limit.",
    "keywords": [
      "MAKEOS",
      "heating coil",
      "cooling coil",
      "tank coil",
      "helical coil",
      "heat transfer area",
      "tube length"
    ],
    "fields": [
      {
        "key": "Q",
        "label": "Heat duty",
        "type": "number",
        "default": 20,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "U",
        "label": "Overall heat-transfer coefficient",
        "type": "number",
        "default": 500,
        "unit": "W/(m²·K)",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTm",
        "label": "Mean temperature difference",
        "type": "number",
        "default": 40,
        "unit": "K",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_coil",
        "label": "Coil",
        "type": "heading"
      },
      {
        "key": "Dc",
        "label": "Mean coil diameter",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p",
        "label": "Coil pitch",
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
        "key": "turns",
        "label": "Turns",
        "type": "number",
        "default": 14,
        "unit": "turns",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ends",
        "label": "Straight ends (total)",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "OD",
        "label": "Tube outside diameter",
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
        "key": "t",
        "label": "Tube wall",
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
        "key": "h_fluid_in_the_tube",
        "label": "Fluid in the tube",
        "type": "heading"
      },
      {
        "key": "flow",
        "label": "Flow",
        "type": "number",
        "default": 20,
        "unit": "L/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Kinematic viscosity",
        "type": "number",
        "default": 1,
        "unit": "cSt",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Density",
        "type": "number",
        "default": 998,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Tube roughness",
        "type": "number",
        "default": 0.0015,
        "unit": "mm",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Sum of fitting loss coefficients",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dpMax",
        "label": "Largest pressure drop",
        "type": "number",
        "default": 0.5,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "polygon-milling-setup",
    "name": "Polygon Milling Set-up (Stock Size, Depth of Cut, Indexing)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "To mill a hexagon (or any regular polygon) on round bar, what stock diameter do I need for sharp corners, how deep is each flat, and what index setting moves between flats?",
    "description": "Set-up for milling a regular polygon on round stock with a dividing head: side length, across-flats and across-corners sizes (as the regular polygon tool), whether the stock is large enough for full corners, depth of cut to each flat and the passes for your largest depth of cut, and the simple indexing setting between flats (as the simple indexing tool).",
    "keywords": [
      "MAKEOS",
      "polygon milling",
      "hexagon",
      "across flats",
      "across corners",
      "dividing head",
      "indexing"
    ],
    "fields": [
      {
        "key": "sides",
        "label": "Number of sides",
        "type": "number",
        "default": 6,
        "unit": "",
        "min": 3,
        "max": 100,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "flats",
        "label": "Across flats",
        "type": "number",
        "default": 24,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stock",
        "label": "Round stock diameter",
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
        "key": "maxDoc",
        "label": "Largest depth of cut per pass",
        "type": "number",
        "default": 2,
        "unit": "mm",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ratio",
        "label": "Dividing head worm ratio",
        "type": "number",
        "default": 40,
        "unit": ":1",
        "min": 1,
        "max": 200,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "plates",
        "label": "Index plates available",
        "type": "select",
        "default": "bs",
        "options": [
          [
            "bs",
            "Brown & Sharpe plates 1–3"
          ],
          [
            "cin",
            "Cincinnati standard plate (both sides)"
          ]
        ]
      }
    ]
  },
  {
    "id": "bolt-circle-inspection",
    "name": "Bolt Circle Inspection from Three Holes (Fitted Diameter, Centre Position)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From the measured centres of three holes on a bolt circle, what diameter and centre do they actually lie on, and are the circle size and its centre position within tolerance?",
    "description": "Inspection of a bolt circle from three measured hole centres: the circle through the three points, its centre and diameter (as the circle through three points tool), the deviation of the diameter from nominal, and the position of the circle’s centre from the datum origin as a diametral position value (as the true position tool, regardless of feature size), against the diameter tolerance and position tolerance, with a check of how widely the holes are spread.",
    "keywords": [
      "MAKEOS",
      "bolt circle",
      "pitch circle diameter",
      "inspection",
      "true position",
      "three points",
      "hole pattern"
    ],
    "fields": [
      {
        "key": "x1",
        "label": "Hole 1 X",
        "type": "number",
        "default": 0.02,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Hole 1 Y",
        "type": "number",
        "default": 50.03,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "Hole 2 X",
        "type": "number",
        "default": -43.3,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Hole 2 Y",
        "type": "number",
        "default": -24.99,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x3",
        "label": "Hole 3 X",
        "type": "number",
        "default": 43.31,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Hole 3 Y",
        "type": "number",
        "default": -25.02,
        "unit": "mm",
        "min": -1000000,
        "max": 1000000,
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
        "key": "nom",
        "label": "Nominal bolt circle diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolD",
        "label": "Diameter tolerance (±)",
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
        "key": "tolPos",
        "label": "Position tolerance of the circle centre (diameter)",
        "type": "number",
        "default": 0.1,
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
    "id": "oval-tank-capacity",
    "name": "Oval Tank Capacity and Weight (Elliptical Section, Shell Plate, Full Mass)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "How much does this oval (elliptical) tank hold, how much plate does it take, and what will it weigh full?",
    "description": "Check of a horizontal or vertical tank with an elliptical cross-section and flat ends: section area and perimeter (as the ellipse tool), capacity, shell and end plate area and mass for the plate thickness, the contents at the fill level, and the full weight on its supports, checked against the capacity you need and the support capacity.",
    "keywords": [
      "MAKEOS",
      "oval tank",
      "elliptical tank",
      "tank capacity",
      "plate area",
      "tank weight",
      "fuel tank"
    ],
    "fields": [
      {
        "key": "major",
        "label": "Major axis (full width)",
        "type": "number",
        "default": 1600,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minor",
        "label": "Minor axis (full height)",
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
        "key": "L",
        "label": "Tank length",
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
        "key": "t",
        "label": "Plate thickness",
        "type": "number",
        "default": 4,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rhoS",
        "label": "Plate density",
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
        "key": "rhoL",
        "label": "Contents density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fill",
        "label": "Fill level (share of volume)",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_requirements",
        "label": "Requirements",
        "type": "heading"
      },
      {
        "key": "need",
        "label": "Capacity needed",
        "type": "number",
        "default": 3500,
        "unit": "L",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "support",
        "label": "Support capacity",
        "type": "number",
        "default": 5000,
        "unit": "kg",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bent-bracket-plan",
    "name": "Bent Bracket Plan (Flat Blank, Bend Force, Springback)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "For this bent sheet-metal bracket, what flat blank do I cut, what press brake force do the bends need, and to what angle must I bend to allow for springback?",
    "description": "Plan for a press-braked bracket with one or two bends: bend allowances, setbacks, bend deductions and the flat blank length from the outside flange dimensions (as the sheet-metal flat pattern tool), the air-bending force for the bend length in your V-die against the press capacity (as the press brake force tool), and the angle to bend to so the bend springs back to the drawing angle (as the bending springback tool), with blank mass.",
    "keywords": [
      "MAKEOS",
      "press brake",
      "flat pattern",
      "bend allowance",
      "springback",
      "sheet metal bracket",
      "bend force"
    ],
    "fields": [
      {
        "key": "t",
        "label": "Thickness",
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
        "label": "Inside bend radius",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.1,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kf",
        "label": "K-factor",
        "type": "number",
        "default": 0.4,
        "unit": "",
        "min": 0.2,
        "max": 0.55,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_flanges_outside_dimensions_and_bends",
        "label": "Flanges (outside dimensions) and bends",
        "type": "heading"
      },
      {
        "key": "L1",
        "label": "Flange 1",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A1",
        "label": "Bend 1 angle",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 1,
        "max": 175,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "Flange 2",
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
        "key": "A2",
        "label": "Bend 2 angle (0 = one bend)",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0,
        "max": 175,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L3",
        "label": "Flange 3",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Bend length (part width)",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_material_and_press",
        "label": "Material and press",
        "type": "heading"
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
        "key": "YS",
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
        "key": "V",
        "label": "V-die opening",
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
        "key": "k",
        "label": "Die factor",
        "type": "number",
        "default": 1.33,
        "unit": "",
        "min": 0.5,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cap",
        "label": "Press brake capacity",
        "type": "number",
        "default": 100,
        "unit": "kN",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "minFl",
        "label": "Least end flange for the die",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rMin",
        "label": "Least inside radius (× thickness)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "guard-band-acceptance",
    "name": "Guard-Banded Acceptance Decision (Uncertainty Budget, Accept, Reject or Indeterminate)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Given my gauge’s measurement uncertainty, can I accept this part from its reading, must I reject it, or is it too close to the limit to decide?",
    "description": "Acceptance decision for a measured part that allows for measurement uncertainty: the uncertainty budget from calibration, resolution, repeatability, Abbe error and temperature, the expanded uncertainty and test uncertainty ratio, and the guard-banded acceptance zone (as the measurement uncertainty budget tool), then the deviation of the reading from nominal compared with the guard-banded and the tolerance limits to accept, reject or flag it as indeterminate.",
    "keywords": [
      "MAKEOS",
      "guard band",
      "measurement uncertainty",
      "conformance decision",
      "test uncertainty ratio",
      "acceptance",
      "inspection"
    ],
    "fields": [
      {
        "key": "nominal",
        "label": "Nominal size",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Tolerance band (total, symmetric)",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": 0.0001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "reading",
        "label": "Measured size",
        "type": "number",
        "default": 25.012,
        "unit": "mm",
        "min": -100000,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_uncertainty_contributors",
        "label": "Uncertainty contributors",
        "type": "heading"
      },
      {
        "key": "Ucal",
        "label": "Calibration uncertainty of the gauge (expanded, k = 2)",
        "type": "number",
        "default": 2,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "res",
        "label": "Resolution of the gauge",
        "type": "number",
        "default": 1,
        "unit": "µm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "srep",
        "label": "Repeatability (standard deviation of repeat readings)",
        "type": "number",
        "default": 1.5,
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
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tilt",
        "label": "Tilt of the moving element",
        "type": "number",
        "default": 20,
        "unit": "arcsec",
        "min": 0,
        "max": 3600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length measured",
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
        "key": "alpha",
        "label": "Part expansion coefficient",
        "type": "number",
        "default": 11.5,
        "unit": "µm/m·K",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Uncertainty of the temperature difference",
        "type": "number",
        "default": 0.5,
        "unit": "K",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Coverage factor",
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
        "key": "turMin",
        "label": "Least test uncertainty ratio",
        "type": "number",
        "default": 4,
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
    "id": "rotary-axis-feed-plan",
    "name": "Rotary Axis Feed Plan (Inverse-Time Feed and Axis Rate Limits)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "For this combined linear and rotary move, what inverse-time feed gives my cutter feed, do the rotary and linear axes stay within their rate limits, and what feed is actually achievable?",
    "description": "Feed plan for a 4th-axis or rotary-table move: arc length at the cutting radius, path length at the cutter, block time and inverse-time F value for the wanted feed (as the inverse time feed tool), the rotary rate in degrees per minute and the linear axis rate, checked against the machine’s axis rate limits, with the largest achievable cutter feed and its inverse-time value if a limit governs.",
    "keywords": [
      "MAKEOS",
      "inverse time feed",
      "rotary axis",
      "4th axis",
      "G93",
      "rotary table feed",
      "CNC programming"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Move",
        "type": "select",
        "default": "combined",
        "options": [
          [
            "combined",
            "Combined linear and rotary"
          ],
          [
            "rotary",
            "Rotary move at a radius"
          ],
          [
            "linear",
            "Linear move"
          ]
        ]
      },
      {
        "key": "dist",
        "label": "Linear length of the move",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "angle",
        "label": "Rotary angle of the move",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "radius",
        "label": "Cutting radius on the rotary axis",
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
        "key": "feed",
        "label": "Wanted feed at the cutter",
        "type": "number",
        "default": 300,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_machine_limits",
        "label": "Machine limits",
        "type": "heading"
      },
      {
        "key": "rotMax",
        "label": "Largest rotary axis rate",
        "type": "number",
        "default": 2000,
        "unit": "°/min",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "linMax",
        "label": "Largest linear axis feed",
        "type": "number",
        "default": 10000,
        "unit": "mm/min",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "column-formula-compare",
    "name": "Column Formula Comparison (Rankine, Euler and Classic Safe Load)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "How do the Rankine, Euler and classic working-stress column formulas compare for this strut, and does it carry my load by each?",
    "description": "Comparison of column formulas for a concentrically loaded strut: slenderness ratio, Euler buckling load, Rankine–Gordon crippling load and safety factor (as the Rankine column tool), and the classic working-stress safe unit stress and safe load for a main or secondary member (as the classic column safe stress tool), with checks of the Rankine factor and the classic safe load.",
    "keywords": [
      "MAKEOS",
      "column formula",
      "Rankine",
      "Euler",
      "strut",
      "slenderness",
      "safe load"
    ],
    "fields": [
      {
        "key": "A",
        "label": "Cross-section area",
        "type": "number",
        "default": 1500,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Least radius of gyration",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length",
        "type": "number",
        "default": 2500,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
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
        "min": 0.1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Sc",
        "label": "Crushing (compressive) strength",
        "type": "number",
        "default": 320,
        "unit": "MPa",
        "min": 0.000001,
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
        "key": "aRank",
        "label": "Rankine constant (0 = theoretical)",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "member",
        "label": "Member type (classic formula)",
        "type": "select",
        "default": "main",
        "options": [
          [
            "main",
            "Main member"
          ],
          [
            "secondary",
            "Bracing or secondary member"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Applied concentric load",
        "type": "number",
        "default": 60,
        "unit": "kN",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required Rankine safety factor",
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
    "id": "hollow-shaft-conversion",
    "name": "Hollow Shaft Conversion (Brittle Material, Size, Weight, Twist)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "If I make this cast-iron (brittle) shaft hollow, what outside and bore diameters keep it as strong, how much weight do I save, and does it still fit and stay stiff enough?",
    "description": "Conversion of a solid shaft in a brittle material to a hollow one of equal strength: the solid diameter by the maximum-normal-stress method with shock factors and the hollow outside and bore diameters for the bore ratio (as the brittle and hollow shaft tool), wall thickness, mass per metre of both, angle of twist per metre for the torque, and checks against the largest outside diameter that fits, the least wall and your twist limit.",
    "keywords": [
      "MAKEOS",
      "hollow shaft",
      "brittle shaft",
      "cast iron shaft",
      "weight saving",
      "torsional stiffness",
      "shaft sizing"
    ],
    "fields": [
      {
        "key": "M",
        "label": "Bending moment",
        "type": "number",
        "default": 300,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Torque",
        "type": "number",
        "default": 500,
        "unit": "N·m",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Km",
        "label": "Shock factor, bending",
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
        "key": "Kt",
        "label": "Shock factor, torsion",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 1,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "St",
        "label": "Allowable tensile stress",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Bore ratio (inside ÷ outside)",
        "type": "number",
        "default": 0.6,
        "unit": "",
        "min": 0,
        "max": 0.95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_material_and_limits",
        "label": "Material and limits",
        "type": "heading"
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
        "key": "G",
        "label": "Shear modulus",
        "type": "number",
        "default": 40,
        "unit": "GPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dmax",
        "label": "Largest outside diameter that fits",
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
        "key": "tMin",
        "label": "Least wall thickness",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "twMax",
        "label": "Largest twist",
        "type": "number",
        "default": 1,
        "unit": "°/m",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
