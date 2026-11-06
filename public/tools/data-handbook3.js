// BIZOMAT MAKEOS handbook tools: bearings, chain, belt, screw, pipe, pump, alignment, expansion and cylinder volume.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "bearing-l10-life",
    "name": "Bearing L10 Life",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "How many hours will this rolling bearing run before 10% of a group would be expected to fail?",
    "description": "Calculate basic rating life L10 in revolutions and hours from the dynamic load rating, equivalent load and speed, for ball or roller bearings.",
    "keywords": [
      "MAKEOS",
      "bearing life",
      "L10",
      "rating life",
      "rolling bearing",
      "ball bearing",
      "roller bearing"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Bearing type",
        "type": "select",
        "default": "ball",
        "options": [
          [
            "ball",
            "Ball bearing · exponent 3"
          ],
          [
            "roller",
            "Roller bearing · exponent 10/3"
          ]
        ]
      },
      {
        "key": "C",
        "label": "Basic dynamic load rating C",
        "type": "number",
        "default": 30,
        "unit": "kN",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Equivalent dynamic bearing load P",
        "type": "number",
        "default": 10,
        "unit": "kN",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Constant rotational speed",
        "type": "number",
        "default": 1000,
        "unit": "rpm",
        "min": 0.1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "bearing-static-ratio",
    "name": "Bearing Static Load Ratio",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "How does the static load on this bearing compare with its static rating?",
    "description": "Calculate the static safety factor s0 of a rolling bearing from its basic static load rating C0 and the equivalent static load P0.",
    "keywords": [
      "MAKEOS",
      "static safety factor",
      "s0",
      "static load rating",
      "C0",
      "rolling bearing"
    ],
    "fields": [
      {
        "key": "C0",
        "label": "Basic static load rating C0",
        "type": "number",
        "default": 35,
        "unit": "kN",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P0",
        "label": "Equivalent static bearing load P0",
        "type": "number",
        "default": 12,
        "unit": "kN",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "chain-linear-speed",
    "name": "Chain Linear Speed",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How fast does this roller chain run, and how much does its speed fluctuate?",
    "description": "Calculate average roller chain speed from pitch, sprocket teeth and speed, with the chordal speed variation caused by the sprocket polygon.",
    "keywords": [
      "MAKEOS",
      "chain speed",
      "roller chain",
      "sprocket",
      "chordal action",
      "chain velocity"
    ],
    "fields": [
      {
        "key": "pitch",
        "label": "Chain pitch",
        "type": "number",
        "default": 12.7,
        "unit": "mm",
        "min": 1,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "teeth",
        "label": "Sprocket teeth",
        "type": "number",
        "default": 20,
        "unit": "teeth",
        "min": 3,
        "max": 500,
        "step": "any",
        "integer": true,
        "sens": false
      },
      {
        "key": "rpm",
        "label": "Sprocket speed",
        "type": "number",
        "default": 600,
        "unit": "rpm",
        "min": 0.01,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pulley-speed-ratio",
    "name": "Pulley Speed Ratio",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What speed will the driven pulley run at, ignoring belt slip?",
    "description": "Calculate the ideal driven pulley speed, speed ratio and belt speed from pitch diameters and driver speed, assuming no slip.",
    "keywords": [
      "MAKEOS",
      "pulley ratio",
      "belt drive",
      "driven speed",
      "pitch diameter",
      "belt speed"
    ],
    "fields": [
      {
        "key": "driver",
        "label": "Driver pulley pitch diameter",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 1,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "driven",
        "label": "Driven pulley pitch diameter",
        "type": "number",
        "default": 250,
        "unit": "mm",
        "min": 1,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Driver speed",
        "type": "number",
        "default": 1500,
        "unit": "rpm",
        "min": 0.01,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "leadscrew-speed",
    "name": "Lead Screw Travel Speed",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "How fast does the nut travel at this screw speed?",
    "description": "Calculate linear travel speed of a lead screw or ball screw from its lead and rotational speed.",
    "keywords": [
      "MAKEOS",
      "lead screw speed",
      "ball screw",
      "linear speed",
      "screw lead",
      "travel speed"
    ],
    "fields": [
      {
        "key": "lead",
        "label": "Screw lead (travel per revolution)",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.01,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Screw speed",
        "type": "number",
        "default": 300,
        "unit": "rpm",
        "min": 0.01,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "leadscrew-torque",
    "name": "Lead Screw Input Torque",
    "category": "Power Transmission",
    "collection": "MAKEOS",
    "question": "What torque is needed to drive this axial load through a lead screw?",
    "description": "Calculate the input torque to drive a steady axial load through a lead screw or ball screw, from load, lead and overall efficiency.",
    "keywords": [
      "MAKEOS",
      "lead screw torque",
      "ball screw torque",
      "screw efficiency",
      "axial load",
      "drive torque"
    ],
    "fields": [
      {
        "key": "force",
        "label": "Axial load",
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
        "key": "lead",
        "label": "Screw lead (travel per revolution)",
        "type": "number",
        "default": 5,
        "unit": "mm",
        "min": 0.01,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "efficiency",
        "label": "Overall screw efficiency (as a fraction)",
        "type": "number",
        "default": 0.3,
        "unit": "fraction 0–1",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pipe-flow-velocity",
    "name": "Pipe Flow Velocity",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What is the mean velocity of this flow in a pipe of this bore?",
    "description": "Calculate mean liquid velocity in a full circular pipe from volumetric flow in L/min and internal bore diameter in mm.",
    "keywords": [
      "MAKEOS",
      "pipe velocity",
      "flow velocity",
      "pipe sizing",
      "L/min to m/s",
      "bore diameter"
    ],
    "fields": [
      {
        "key": "flow",
        "label": "Volumetric flow",
        "type": "number",
        "default": 100,
        "unit": "L/min",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "diameter",
        "label": "Internal bore diameter",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "darcy-pipe-drop",
    "name": "Darcy Pipe Pressure Drop",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How much pressure is lost to friction along this straight pipe?",
    "description": "Calculate Darcy–Weisbach friction pressure drop and head loss in a straight circular pipe from the Darcy friction factor, length, bore, velocity and density.",
    "keywords": [
      "MAKEOS",
      "Darcy-Weisbach",
      "pressure drop",
      "friction loss",
      "head loss",
      "pipe friction factor"
    ],
    "fields": [
      {
        "key": "friction",
        "label": "Darcy friction factor f",
        "type": "number",
        "default": 0.025,
        "unit": "dimensionless",
        "min": 0.001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "length",
        "label": "Straight pipe length",
        "type": "number",
        "default": 20,
        "unit": "m",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "diameter",
        "label": "Internal bore diameter",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "velocity",
        "label": "Mean flow velocity",
        "type": "number",
        "default": 2,
        "unit": "m/s",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "density",
        "label": "Fluid density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 0.01,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pump-shaft-power",
    "name": "Pump Shaft Power",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "What shaft power does a pump need for this flow and head?",
    "description": "Calculate hydraulic power and pump shaft power from flow in L/min, total head in metres, fluid density and pump efficiency.",
    "keywords": [
      "MAKEOS",
      "pump power",
      "shaft power",
      "hydraulic power",
      "pump head",
      "pump efficiency"
    ],
    "fields": [
      {
        "key": "flow",
        "label": "Pump flow",
        "type": "number",
        "default": 120,
        "unit": "L/min",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "head",
        "label": "Total dynamic head",
        "type": "number",
        "default": 30,
        "unit": "m",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "density",
        "label": "Liquid density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 1,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "efficiency",
        "label": "Overall pump efficiency (as a fraction)",
        "type": "number",
        "default": 0.7,
        "unit": "fraction 0–1",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "shaft-angular-offset",
    "name": "Shaft Angular Offset",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "What angular misalignment does this offset across a known span represent?",
    "description": "Convert an offset change across an axial span into angular misalignment in degrees, milliradians and millimetres per 100 mm.",
    "keywords": [
      "MAKEOS",
      "shaft alignment",
      "angular misalignment",
      "coupling alignment",
      "mrad",
      "mm per 100 mm"
    ],
    "fields": [
      {
        "key": "difference",
        "label": "Relative offset change across the span",
        "type": "number",
        "default": 0.15,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "span",
        "label": "Axial span between measurement planes",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": 0.1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "differential-expansion",
    "name": "Differential Thermal Expansion",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "How does a fit clearance change when the bore and shaft materials expand differently?",
    "description": "Calculate the change in diametral clearance between a bore and shaft of different materials for a uniform temperature change.",
    "keywords": [
      "MAKEOS",
      "differential expansion",
      "thermal expansion",
      "fit clearance",
      "shrink fit",
      "expansion coefficient"
    ],
    "fields": [
      {
        "key": "diameter",
        "label": "Nominal fit diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 0.1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "boreAlpha",
        "label": "Bore (housing) expansion coefficient",
        "type": "number",
        "default": 23,
        "unit": "×10⁻⁶ /°C",
        "min": 0,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "shaftAlpha",
        "label": "Shaft expansion coefficient",
        "type": "number",
        "default": 12,
        "unit": "×10⁻⁶ /°C",
        "min": 0,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "deltaT",
        "label": "Uniform temperature change from assembly",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -250,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cylinder-swept-volume",
    "name": "Pneumatic Cylinder Swept Volume",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What volume does a double-acting cylinder sweep in one complete cycle?",
    "description": "Calculate the geometric swept volume of a double-acting cylinder for the extend stroke, retract stroke and complete cycle from bore, rod and stroke.",
    "keywords": [
      "MAKEOS",
      "cylinder volume",
      "swept volume",
      "double-acting cylinder",
      "pneumatic cylinder",
      "air volume"
    ],
    "fields": [
      {
        "key": "bore",
        "label": "Bore diameter",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rod",
        "label": "Rod diameter",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "stroke",
        "label": "Stroke",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0.1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
