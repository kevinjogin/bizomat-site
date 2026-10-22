window.WORKOS_GUIDES=Object.assign(window.WORKOS_GUIDES||{},{
  "bearing-l10-life": {
    "purpose": "Basic rating life for ball bearings using exponent 3; not a reliability adjusted or lubrication-adjusted prediction.",
    "uses": [
      "Bearing L10 Life preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "C": "Enter C from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "P": "Enter P from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "rpm": "Enter rpm from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "bearing-static-ratio": {
    "purpose": "Ratio of catalogued static capacity to equivalent static load; supplier selection limits still apply.",
    "uses": [
      "Bearing Static Load Ratio preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "C0": "Enter C0 from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "P0": "Enter P0 from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "chain-linear-speed": {
    "purpose": "Average chain velocity based on chain pitch, sprocket tooth count and speed; ignores chordal action.",
    "uses": [
      "Chain Linear Speed preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "pitch": "Enter pitch from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "teeth": "Enter teeth from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "rpm": "Enter rpm from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "pulley-speed-ratio": {
    "purpose": "Ideal driven pulley speed using pitch diameters; ignores belt slip.",
    "uses": [
      "Pulley Speed Ratio preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "driver": "Enter driver from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "driven": "Enter driven from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "rpm": "Enter rpm from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "leadscrew-speed": {
    "purpose": "Linear speed from mechanical lead and revolutions per minute; ignores backlash and acceleration.",
    "uses": [
      "Lead Screw Travel Speed preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "lead": "Enter lead from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "rpm": "Enter rpm from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "leadscrew-torque": {
    "purpose": "Steady axial raising torque assuming a supplied overall efficiency fraction; excludes reverse drive checks.",
    "uses": [
      "Lead Screw Input Torque preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "force": "Enter force from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "lead": "Enter lead from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "efficiency": "Enter efficiency from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "pipe-flow-velocity": {
    "purpose": "Mean incompressible flow velocity in a circular internal bore.",
    "uses": [
      "Pipe Flow Velocity preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "flow": "Enter flow from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "diameter": "Enter diameter from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "darcy-pipe-drop": {
    "purpose": "Straight-pipe Darcy-Weisbach friction loss with supplied Darcy factor; excludes fittings and static head.",
    "uses": [
      "Darcy Pipe Pressure Drop preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "friction": "Enter friction from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "length": "Enter length from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "diameter": "Enter diameter from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "velocity": "Enter velocity from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "density": "Enter density from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "pump-shaft-power": {
    "purpose": "Hydraulic head converted to estimated shaft input power using overall efficiency; verify pump curve.",
    "uses": [
      "Pump Shaft Power preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "flow": "Enter flow from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "head": "Enter head from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "density": "Enter density from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "efficiency": "Enter efficiency from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "shaft-angular-offset": {
    "purpose": "Angular displacement corresponding to a specified relative offset across an axial span; not raw dial reading.",
    "uses": [
      "Shaft Angular Offset preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "difference": "Enter difference from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "span": "Enter span from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "differential-expansion": {
    "purpose": "Difference in bore and shaft diameter thermal growth using constant coefficients and uniform temperature.",
    "uses": [
      "Differential Thermal Expansion preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "diameter": "Enter diameter from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "boreAlpha": "Enter boreAlpha from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "shaftAlpha": "Enter shaftAlpha from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "deltaT": "Enter deltaT from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  },
  "cylinder-swept-volume": {
    "purpose": "Two-stroke double-acting cylinder volume; excludes air pressure conversion, dead volume and leakage.",
    "uses": [
      "Pneumatic Cylinder Swept Volume preliminary analysis"
    ],
    "users": [
      "Design engineers",
      "Maintenance specialists"
    ],
    "inputs": {
      "bore": "Enter bore from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "rod": "Enter rod from verified drawing, measurement or technical datasheet; see the label and confirm consistent units.",
      "stroke": "Enter stroke from verified drawing, measurement or technical datasheet; see the label and confirm consistent units."
    },
    "outputs": [
      "Primary engineering screening result",
      "Assumptions and verification requirements"
    ],
    "method": [
      "Compute idealised relation from provided inputs.",
      "Check output unit and compare with manufacturer information."
    ],
    "limitations": [
      "No certification, allowable load or complete machine-system selection is implied.",
      "Check relevant manufacturer standards, reliability, safety and application constraints."
    ],
    "interpret": [
      "Treat as a preliminary comparison, not a safe-limit decision."
    ],
    "refs": [
      "Manufacturer engineering application manuals and relevant current design standards; verify before use."
    ]
  }
});