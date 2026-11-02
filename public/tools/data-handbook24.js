// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook24) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "plastic-gear-power",
    "name": "Plastics Gear Power Rating",
    "category": "Gears",
    "collection": "MAKEOS",
    "question": "How much power can this nylon, acetal or other plastics gear transmit?",
    "description": "Power rating of plastics spur, helical and straight bevel gears by the handbook’s Lewis-type formulas in metric form, from face width, tooth form factor, module, safe bending stress, pitch-line velocity and service factor, with the corresponding torque.",
    "keywords": [
      "MAKEOS",
      "plastic gear",
      "nylon gear",
      "acetal gear",
      "gear power rating",
      "Lewis formula",
      "molded gear"
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
            "Spur (internal or external)"
          ],
          [
            "helical",
            "Helical"
          ],
          [
            "bevel",
            "Straight bevel"
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
        "label": "Tooth form factor Y",
        "type": "number",
        "default": 0.308,
        "unit": "",
        "min": 0.1,
        "max": 1,
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
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ss",
        "label": "Safe bending stress for the plastic",
        "type": "number",
        "default": 40,
        "unit": "MPa",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Pitch diameter",
        "type": "number",
        "default": 45,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rpm",
        "label": "Speed",
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
        "min": 0.5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "C",
        "label": "Pitch cone distance (bevel)",
        "type": "number",
        "default": 60,
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
    "id": "plastic-thermal-mismatch",
    "name": "Thermal Stress and Movement in Plastic–Metal Assemblies",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What stress builds up in a plastic part restrained by metal when the temperature changes, and how much do they move relative to each other?",
    "description": "Thermal stress in a plastics part fully restrained by a metal part, σ = (α_m − α_p) E_p ΔT, and the relative movement between unrestrained plastic and metal parts, from their expansion coefficients, the plastic’s modulus at temperature (or an apparent creep modulus from a creep curve) and the temperature change.",
    "keywords": [
      "MAKEOS",
      "thermal stress",
      "plastic metal assembly",
      "coefficient of expansion",
      "creep modulus",
      "apparent modulus",
      "differential expansion"
    ],
    "fields": [
      {
        "key": "am",
        "label": "Expansion coefficient of the metal",
        "type": "number",
        "default": 11.7,
        "unit": "µm/m·K",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ap",
        "label": "Expansion coefficient of the plastic",
        "type": "number",
        "default": 80,
        "unit": "µm/m·K",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "emode",
        "label": "Plastic modulus",
        "type": "select",
        "default": "entered",
        "options": [
          [
            "entered",
            "Modulus at the temperature"
          ],
          [
            "creep",
            "Apparent (creep) modulus from a creep curve"
          ]
        ]
      },
      {
        "key": "Ep",
        "label": "Tensile modulus of the plastic",
        "type": "number",
        "default": 2000,
        "unit": "MPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sc",
        "label": "Stress on the creep curve",
        "type": "number",
        "default": 10,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ec",
        "label": "Strain on the creep curve at the time of interest",
        "type": "number",
        "default": 1,
        "unit": "%",
        "min": 0.001,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Temperature change",
        "type": "number",
        "default": 40,
        "unit": "K",
        "min": -300,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length between fixings",
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
        "key": "allow",
        "label": "Allowable stress for the plastic",
        "type": "number",
        "default": 20,
        "unit": "MPa",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "set-screw-holding",
    "name": "Set-Screw Holding Power and Torque",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "How much power and torque can set screws hold on this shaft, and how many do I need?",
    "description": "Safe power and torque a cup-point set screw can transmit without slipping by the handbook’s empirical formulas, the corresponding holding force at the shaft surface, and the number of set screws needed for a required power.",
    "keywords": [
      "MAKEOS",
      "set screw",
      "grub screw",
      "holding power",
      "shaft collar",
      "pulley hub",
      "torque capacity"
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
        "label": "Power to transmit",
        "type": "number",
        "default": 2.237,
        "unit": "kW",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
