// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook47) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "melt-furnace-batch-plan",
    "name": "Melting Furnace Batch Plan (Energy, Melt Time, Melts per Shift, Cost)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How long does each melt take in this furnace, how many melts and how much metal can I get per shift, and what does the energy cost per kilogram?",
    "description": "Plan of a batch melting furnace: heat to raise the charge to its melting point, melt it and superheat to pouring temperature, energy drawn at the furnace efficiency and melt time at its power (as the melting energy tool), the cycle with charging and tapping time, melts and metal per shift against the demand, energy per tonne and energy cost per kilogram.",
    "keywords": [
      "MAKEOS",
      "melting furnace",
      "melt time",
      "melts per shift",
      "energy per tonne",
      "induction furnace",
      "foundry melting"
    ],
    "fields": [
      {
        "key": "mass",
        "label": "Charge per melt",
        "type": "number",
        "default": 500,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T0",
        "label": "Charge temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -30,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tm",
        "label": "Melting point",
        "type": "number",
        "default": 660,
        "unit": "°C",
        "min": 0.000001,
        "max": 3500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tp",
        "label": "Pouring temperature",
        "type": "number",
        "default": 720,
        "unit": "°C",
        "min": 0.000001,
        "max": 3500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cs",
        "label": "Solid specific heat",
        "type": "number",
        "default": 0.9,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Latent heat of fusion",
        "type": "number",
        "default": 397,
        "unit": "kJ/kg",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cl",
        "label": "Liquid specific heat",
        "type": "number",
        "default": 1.18,
        "unit": "kJ/kg·K",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Furnace power",
        "type": "number",
        "default": 250,
        "unit": "kW",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Furnace efficiency",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Energy price",
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
        "key": "tap",
        "label": "Charging and tapping time per melt",
        "type": "number",
        "default": 20,
        "unit": "min",
        "min": 0,
        "max": 600,
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
        "key": "demand",
        "label": "Metal needed per shift",
        "type": "number",
        "default": 2000,
        "unit": "kg",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vickers-test-check",
    "name": "Vickers Hardness Test Check (Hardness, Validity, Specification)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What Vickers hardness do these indentation diagonals give, was the test valid for the thickness, spacing and edge distance, and is the result within specification?",
    "description": "Evaluation of a Vickers hardness test from two indentation diagonals: mean diagonal, hardness HV and indentation depth, the least specimen or layer thickness of 1.5 diagonals (as the Vickers–Knoop hardness tool), the difference between the diagonals, and checks of thickness, edge distance and spacing as multiples of the diagonal (your rules), diagonal difference and the specification range.",
    "keywords": [
      "MAKEOS",
      "Vickers hardness",
      "HV",
      "microhardness",
      "hardness validity",
      "case depth",
      "indentation"
    ],
    "fields": [
      {
        "key": "F",
        "label": "Test force",
        "type": "number",
        "default": 10,
        "unit": "kgf",
        "min": 0.001,
        "max": 120,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d1",
        "label": "Diagonal 1",
        "type": "number",
        "default": 0.3,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d2",
        "label": "Diagonal 2",
        "type": "number",
        "default": 0.302,
        "unit": "mm",
        "min": 0.000001,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "thick",
        "label": "Specimen or layer thickness",
        "type": "number",
        "default": 0.6,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "edge",
        "label": "Indentation centre to edge",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "space",
        "label": "Indentation centre to the next",
        "type": "number",
        "default": 1.2,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_your_rules_and_specification",
        "label": "Your rules and specification",
        "type": "heading"
      },
      {
        "key": "kEdge",
        "label": "Least edge distance ÷ diagonal",
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
        "key": "kSpace",
        "label": "Least spacing ÷ diagonal",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "diffMax",
        "label": "Largest difference between diagonals",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0.1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hvMin",
        "label": "Specification minimum",
        "type": "number",
        "default": 180,
        "unit": "HV",
        "min": 0,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hvMax",
        "label": "Specification maximum",
        "type": "number",
        "default": 230,
        "unit": "HV",
        "min": 1,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gear-mesh-interference-check",
    "name": "Spur Gear Mesh Interference Check (Contact Start Diameters and Contact Ratio)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "Does contact on each gear of this spur pair start above its true involute form diameter, so there is no interference, and is the contact ratio enough?",
    "description": "Check of a standard spur gear pair for tip-to-root interference: the diameter on each gear where contact begins (the start of active profile) from the mating gear’s outside diameter (as the spur contact diameters tool), compared with the true involute form diameter each gear actually has after cutting, the margin above it and above the base circle, and the transverse contact ratio from the outside diameters (as the contact ratio tool for standard gears).",
    "keywords": [
      "MAKEOS",
      "gear interference",
      "start of active profile",
      "form diameter",
      "contact ratio",
      "tip interference",
      "spur gear mesh"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
        "type": "number",
        "default": 1,
        "unit": "mm",
        "min": 0.2,
        "max": 50,
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
        "min": 6,
        "max": 500,
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
        "max": 2000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "phi",
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
        "key": "do1",
        "label": "Pinion outside diameter (0 = standard)",
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
        "key": "do2",
        "label": "Gear outside diameter (0 = standard)",
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
        "key": "tif1",
        "label": "Pinion true involute form diameter",
        "type": "number",
        "default": 18.5,
        "unit": "mm",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tif2",
        "label": "Gear true involute form diameter",
        "type": "number",
        "default": 38.3,
        "unit": "mm",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "epsMin",
        "label": "Least contact ratio",
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
  },
  {
    "id": "finish-turning-setup",
    "name": "Finish Turning Set-up (Feed for Finish, Nose-Radius Compensation, Time)",
    "category": "Manufacturing",
    "collection": "MAKEOS",
    "question": "What feed gives my surface finish with this insert nose radius, how much does the nose radius distort a chamfer or taper if not compensated, and how long is the finishing pass?",
    "description": "Set-up of a finish-turning pass: the feed for a target Ra from the nose radius (as the feed for finish tool) or the Ra of a feed you choose, spindle speed from the cutting speed held to the machine maximum, cutting time for the pass (as the turning time tool), and the Z and X compensation and the profile error for a chamfer or taper at your angle if nose-radius compensation is not used (as the nose radius compensation tool).",
    "keywords": [
      "MAKEOS",
      "finish turning",
      "surface finish",
      "feed for Ra",
      "nose radius compensation",
      "tool nose radius",
      "chamfer error"
    ],
    "fields": [
      {
        "key": "R",
        "label": "Nose radius",
        "type": "number",
        "default": 0.8,
        "unit": "mm",
        "min": 0.05,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RaT",
        "label": "Ra wanted",
        "type": "number",
        "default": 1.6,
        "unit": "µm",
        "min": 0.05,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "fCh",
        "label": "Feed chosen (0 = feed for the target)",
        "type": "number",
        "default": 0,
        "unit": "mm/rev",
        "min": 0,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vc",
        "label": "Cutting speed",
        "type": "number",
        "default": 250,
        "unit": "m/min",
        "min": 0.000001,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D",
        "label": "Finished diameter",
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
        "key": "L",
        "label": "Length turned",
        "type": "number",
        "default": 80,
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
        "key": "ang",
        "label": "Chamfer or taper angle",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "errMax",
        "label": "Largest uncompensated profile error",
        "type": "number",
        "default": 0.05,
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
    "id": "coolant-tank-maintenance",
    "name": "Coolant Tank Maintenance (Concentration, Correction, Make-Up Mix, Usage)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "What is the coolant concentration from my refractometer reading, what do I add to correct it, what make-up mix keeps it on target, and how much concentrate will I use?",
    "description": "Maintenance plan for a water-mixed metalworking fluid sump: concentration from the refractometer reading and the product factor, the concentrate or water to add to bring it to target (as the refractometer concentration tool), the make-up mix strength that holds the target when water evaporates and mixed fluid is dragged out on chips and parts, the daily make-up volume, and concentrate use and cost per month.",
    "keywords": [
      "MAKEOS",
      "coolant concentration",
      "refractometer",
      "make-up mix",
      "drag-out",
      "evaporation",
      "metalworking fluid"
    ],
    "fields": [
      {
        "key": "brix",
        "label": "Refractometer reading",
        "type": "number",
        "default": 4,
        "unit": "°Brix",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "factor",
        "label": "Refractometer factor for the product",
        "type": "number",
        "default": 1.6,
        "unit": "",
        "min": 0.5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "target",
        "label": "Target concentration",
        "type": "number",
        "default": 7,
        "unit": "%",
        "min": 0.5,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "volume",
        "label": "Sump volume",
        "type": "number",
        "default": 400,
        "unit": "L",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "evap",
        "label": "Water evaporated per day",
        "type": "number",
        "default": 10,
        "unit": "L/day",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "drag",
        "label": "Mixed fluid dragged out per day",
        "type": "number",
        "default": 5,
        "unit": "L/day",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "days",
        "label": "Working days per month",
        "type": "number",
        "default": 22,
        "unit": "",
        "min": 1,
        "max": 31,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "price",
        "label": "Concentrate price",
        "type": "number",
        "default": 6,
        "unit": "$/L",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tol",
        "label": "Accepted deviation from target",
        "type": "number",
        "default": 10,
        "unit": "%",
        "min": 1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "compound-angle-sine-setup",
    "name": "Compound-Angle Sine Plate Set-up (True Angle and Stack Heights)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "For a surface with two apparent slopes, what true compound angle and direction does it have, and what gauge-block stacks set a compound sine plate to it?",
    "description": "Set-up of a compound (double) sine plate for a surface sloping in two perpendicular directions: true compound angle and its direction (as the compound angle tool), the lower plate angle equal to the first slope, the upper plate angle measured in the tilted plane, tan B′ = tan B cos A, the stack heights for each plate (as the sine bar tool), the stacks rounded to the block set, and the check of each plate angle against its limit.",
    "keywords": [
      "MAKEOS",
      "compound angle",
      "compound sine plate",
      "sine table",
      "gauge blocks",
      "double angle",
      "inspection set-up"
    ],
    "fields": [
      {
        "key": "A",
        "label": "Slope in the first vertical plane",
        "type": "number",
        "default": 20,
        "unit": "°",
        "min": 0,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "B",
        "label": "Slope in the second vertical plane (at 90°)",
        "type": "number",
        "default": 30,
        "unit": "°",
        "min": 0,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L1",
        "label": "Lower plate roller centres",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L2",
        "label": "Upper plate roller centres",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "res",
        "label": "Gauge-block set resolution",
        "type": "number",
        "default": 0.0005,
        "unit": "mm",
        "min": 0.0001,
        "max": 0.01,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "maxAng",
        "label": "Largest angle for one plate",
        "type": "number",
        "default": 45,
        "unit": "°",
        "min": 10,
        "max": 80,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "dovetail-inspection",
    "name": "Dovetail Inspection over Rods (Reading Limits, Accept or Reject)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "What reading over (or between) rods should this dovetail give at its width limits, and does my measured reading pass?",
    "description": "Inspection of a male or female dovetail with two precision rods: the reading over or between the rods for the nominal width and at both width limits (as the dovetail measurement tool), the width worked back from your measured reading, whether the rods contact the flanks within the dovetail depth, and accept or reject against the width tolerance.",
    "keywords": [
      "MAKEOS",
      "dovetail inspection",
      "measurement over rods",
      "dovetail width",
      "gib slide",
      "rod measurement",
      "accept reject"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Dovetail type",
        "type": "select",
        "default": "male",
        "options": [
          [
            "male",
            "Male (tongue) – over rods"
          ],
          [
            "female",
            "Female (slot) – between rods"
          ]
        ]
      },
      {
        "key": "angle",
        "label": "Dovetail angle (flank to base)",
        "type": "number",
        "default": 60,
        "unit": "°",
        "min": 1,
        "max": 89.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "width",
        "label": "Nominal width at the base corners",
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
        "key": "tolU",
        "label": "Upper width deviation",
        "type": "number",
        "default": 0.05,
        "unit": "mm",
        "min": -10,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "tolL",
        "label": "Lower width deviation",
        "type": "number",
        "default": -0.05,
        "unit": "mm",
        "min": -10,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rod",
        "label": "Rod diameter",
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
        "key": "depth",
        "label": "Dovetail depth",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mmeas",
        "label": "Measured reading",
        "type": "number",
        "default": 77.33,
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
    "id": "gear-tooth-caliper-setting",
    "name": "Gear Tooth Caliper Setting for Backlash (Chordal Thickness Limits)",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "What chordal tooth thickness and depth setting should my gear tooth vernier use for the backlash I want, and does the measured tooth pass?",
    "description": "Gear tooth vernier (caliper) settings for a spur gear thinned for backlash: arc tooth thickness reduced for this gear’s share of the normal backlash range, chordal thickness and chordal addendum at both limits (as the chordal tooth tool), the depth setting corrected for the measured tip diameter, and accept or reject of the measured chordal thickness.",
    "keywords": [
      "MAKEOS",
      "gear tooth vernier",
      "chordal thickness",
      "chordal addendum",
      "backlash",
      "gear inspection",
      "tooth caliper"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Module",
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
        "key": "tipMeas",
        "label": "Measured tip diameter (0 = nominal)",
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
        "key": "tcMeas",
        "label": "Measured chordal thickness",
        "type": "number",
        "default": 4.65,
        "unit": "mm",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "perforated-plate-design",
    "name": "Perforated Plate Design (Hole Size for Open Area, Punching Force, Ligament)",
    "category": "Fabrication",
    "collection": "MAKEOS",
    "question": "What hole size gives my target open area at this pitch, what force does a gang of punches need, and is the ligament between holes wide enough for the sheet?",
    "description": "Design of a perforated sheet: the hole diameter for a target open area at a pitch for 60° staggered or straight rows, open area, holes per square metre and sheet mass for the hole you choose (as the perforated open area tool), punching force for the punches working in one hit with a wear factor (as the punching force tool) against the press, and checks of the ligament and hole size relative to the sheet thickness.",
    "keywords": [
      "MAKEOS",
      "perforated sheet",
      "open area",
      "hole pitch",
      "perforating press",
      "ligament",
      "screen"
    ],
    "fields": [
      {
        "key": "pattern",
        "label": "Hole pattern",
        "type": "select",
        "default": "stag60",
        "options": [
          [
            "stag60",
            "60° staggered"
          ],
          [
            "straight",
            "Straight rows"
          ]
        ]
      },
      {
        "key": "OAt",
        "label": "Open area wanted",
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
        "key": "p",
        "label": "Hole pitch",
        "type": "number",
        "default": 8,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Hole diameter chosen",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Sheet thickness",
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
        "key": "A",
        "label": "Sheet area",
        "type": "number",
        "default": 2,
        "unit": "m²",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Sheet density",
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
        "key": "nHit",
        "label": "Holes punched per hit",
        "type": "number",
        "default": 20,
        "unit": "",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
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
        "key": "factor",
        "label": "Wear factor",
        "type": "number",
        "default": 1.2,
        "unit": "",
        "min": 1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "press",
        "label": "Press capacity",
        "type": "number",
        "default": 250,
        "unit": "kN",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kLig",
        "label": "Least ligament ÷ thickness",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.3,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "kHole",
        "label": "Least hole ÷ thickness",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.3,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
