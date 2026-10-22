window.GOCORE_TOOLS=(window.GOCORE_TOOLS||[]).concat([
  {
    "id": "bearing-l10-life",
    "name": "Bearing L10 Life",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "Basic rating life for ball bearings using exponent 3; not a reliability adjusted or lubrication-adjusted prediction.",
    "description": "Basic rating life for ball bearings using exponent 3; not a reliability adjusted or lubrication-adjusted prediction.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Bearing L10 Life"
    ],
    "fields": [
      {
        "key": "C",
        "label": "C",
        "type": "number",
        "default": 30,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "P",
        "label": "P",
        "type": "number",
        "default": 10,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "rpm",
        "label": "rpm",
        "type": "number",
        "default": 1000,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "bearing-static-ratio",
    "name": "Bearing Static Load Ratio",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "Ratio of catalogued static capacity to equivalent static load; supplier selection limits still apply.",
    "description": "Ratio of catalogued static capacity to equivalent static load; supplier selection limits still apply.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Bearing Static Load Ratio"
    ],
    "fields": [
      {
        "key": "C0",
        "label": "C0",
        "type": "number",
        "default": 35,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "P0",
        "label": "P0",
        "type": "number",
        "default": 12,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "chain-linear-speed",
    "name": "Chain Linear Speed",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Average chain velocity based on chain pitch, sprocket tooth count and speed; ignores chordal action.",
    "description": "Average chain velocity based on chain pitch, sprocket tooth count and speed; ignores chordal action.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Chain Linear Speed"
    ],
    "fields": [
      {
        "key": "pitch",
        "label": "pitch",
        "type": "number",
        "default": 12.7,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "teeth",
        "label": "teeth",
        "type": "number",
        "default": 20,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "rpm",
        "label": "rpm",
        "type": "number",
        "default": 600,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "pulley-speed-ratio",
    "name": "Pulley Speed Ratio",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Ideal driven pulley speed using pitch diameters; ignores belt slip.",
    "description": "Ideal driven pulley speed using pitch diameters; ignores belt slip.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Pulley Speed Ratio"
    ],
    "fields": [
      {
        "key": "driver",
        "label": "driver",
        "type": "number",
        "default": 100,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "driven",
        "label": "driven",
        "type": "number",
        "default": 250,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "rpm",
        "label": "rpm",
        "type": "number",
        "default": 1500,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "leadscrew-speed",
    "name": "Lead Screw Travel Speed",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Linear speed from mechanical lead and revolutions per minute; ignores backlash and acceleration.",
    "description": "Linear speed from mechanical lead and revolutions per minute; ignores backlash and acceleration.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Lead Screw Travel Speed"
    ],
    "fields": [
      {
        "key": "lead",
        "label": "lead",
        "type": "number",
        "default": 5,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "rpm",
        "label": "rpm",
        "type": "number",
        "default": 300,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "leadscrew-torque",
    "name": "Lead Screw Input Torque",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "Steady axial raising torque assuming a supplied overall efficiency fraction; excludes reverse drive checks.",
    "description": "Steady axial raising torque assuming a supplied overall efficiency fraction; excludes reverse drive checks.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Lead Screw Input Torque"
    ],
    "fields": [
      {
        "key": "force",
        "label": "force",
        "type": "number",
        "default": 2000,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "lead",
        "label": "lead",
        "type": "number",
        "default": 5,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "efficiency",
        "label": "efficiency",
        "type": "number",
        "default": 0.3,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "pipe-flow-velocity",
    "name": "Pipe Flow Velocity",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Mean incompressible flow velocity in a circular internal bore.",
    "description": "Mean incompressible flow velocity in a circular internal bore.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Pipe Flow Velocity"
    ],
    "fields": [
      {
        "key": "flow",
        "label": "flow",
        "type": "number",
        "default": 100,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "diameter",
        "label": "diameter",
        "type": "number",
        "default": 25,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "darcy-pipe-drop",
    "name": "Darcy Pipe Pressure Drop",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Straight-pipe Darcy-Weisbach friction loss with supplied Darcy factor; excludes fittings and static head.",
    "description": "Straight-pipe Darcy-Weisbach friction loss with supplied Darcy factor; excludes fittings and static head.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Darcy Pipe Pressure Drop"
    ],
    "fields": [
      {
        "key": "friction",
        "label": "friction",
        "type": "number",
        "default": 0.025,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "length",
        "label": "length",
        "type": "number",
        "default": 20,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "diameter",
        "label": "diameter",
        "type": "number",
        "default": 25,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "velocity",
        "label": "velocity",
        "type": "number",
        "default": 2,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "density",
        "label": "density",
        "type": "number",
        "default": 1000,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "pump-shaft-power",
    "name": "Pump Shaft Power",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Hydraulic head converted to estimated shaft input power using overall efficiency; verify pump curve.",
    "description": "Hydraulic head converted to estimated shaft input power using overall efficiency; verify pump curve.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Pump Shaft Power"
    ],
    "fields": [
      {
        "key": "flow",
        "label": "flow",
        "type": "number",
        "default": 120,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "head",
        "label": "head",
        "type": "number",
        "default": 30,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "density",
        "label": "density",
        "type": "number",
        "default": 1000,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "efficiency",
        "label": "efficiency",
        "type": "number",
        "default": 0.7,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "shaft-angular-offset",
    "name": "Shaft Angular Offset",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "Angular displacement corresponding to a specified relative offset across an axial span; not raw dial reading.",
    "description": "Angular displacement corresponding to a specified relative offset across an axial span; not raw dial reading.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Shaft Angular Offset"
    ],
    "fields": [
      {
        "key": "difference",
        "label": "difference",
        "type": "number",
        "default": 0.15,
        "unit": "SI",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "span",
        "label": "span",
        "type": "number",
        "default": 100,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "differential-expansion",
    "name": "Differential Thermal Expansion",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "Difference in bore and shaft diameter thermal growth using constant coefficients and uniform temperature.",
    "description": "Difference in bore and shaft diameter thermal growth using constant coefficients and uniform temperature.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Differential Thermal Expansion"
    ],
    "fields": [
      {
        "key": "diameter",
        "label": "diameter",
        "type": "number",
        "default": 50,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "boreAlpha",
        "label": "boreAlpha",
        "type": "number",
        "default": 23,
        "unit": "SI",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "shaftAlpha",
        "label": "shaftAlpha",
        "type": "number",
        "default": 12,
        "unit": "SI",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "deltaT",
        "label": "deltaT",
        "type": "number",
        "default": 60,
        "unit": "SI",
        "min": -300,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  },
  {
    "id": "cylinder-swept-volume",
    "name": "Pneumatic Cylinder Swept Volume",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "Two-stroke double-acting cylinder volume; excludes air pressure conversion, dead volume and leakage.",
    "description": "Two-stroke double-acting cylinder volume; excludes air pressure conversion, dead volume and leakage.",
    "keywords": [
      "MAKEOS",
      "design",
      "engineering",
      "Pneumatic Cylinder Swept Volume"
    ],
    "fields": [
      {
        "key": "bore",
        "label": "bore",
        "type": "number",
        "default": 50,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "rod",
        "label": "rod",
        "type": "number",
        "default": 20,
        "unit": "SI",
        "min": 0,
        "max": 100000000,
        "step": "any",
        "sens": true
      },
      {
        "key": "stroke",
        "label": "stroke",
        "type": "number",
        "default": 200,
        "unit": "SI",
        "min": 1e-7,
        "max": 100000000,
        "step": "any",
        "sens": true
      }
    ]
  }
]);