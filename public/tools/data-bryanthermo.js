// KEVOS® MAKEOS: thermodynamics first-principles tools after Bryan’s Thermodynamics (1907) (batch bryanthermo) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "liquid-adiabatic-compression",
    "name": "Liquid Adiabatic Compression (Temperature Rise, cp − cv, Adiabatic Bulk Modulus, Wave Speed)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How much does a hydraulic oil or other liquid heat up when it is compressed quickly, and how much stiffer is it under rapid (adiabatic) compression than under slow (isothermal) compression?",
    "description": "Thermodynamics of a liquid compressed too quickly to exchange heat: the temperature rise from the expansion coefficient, density, specific heat and pressure rise, the difference and ratio of the specific heats from the isothermal bulk modulus, the adiabatic bulk modulus that governs fast pressure changes and oil-column stiffness, the speed of a pressure wave in the free liquid, and a check of the final temperature against your limit.",
    "keywords": [
      "MAKEOS",
      "bulk modulus",
      "adiabatic compression",
      "hydraulic oil",
      "temperature rise",
      "specific heat ratio",
      "speed of sound",
      "Maxwell relations",
      "high pressure",
      "water jet"
    ],
    "fields": [
      {
        "key": "rho",
        "label": "Liquid density",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 1,
        "max": 30000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Specific heat at constant pressure",
        "type": "number",
        "default": 1.9,
        "unit": "kJ/(kg·K)",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Volumetric thermal expansion coefficient",
        "type": "number",
        "default": 700,
        "unit": "×10⁻⁶ /K",
        "min": -2000,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "KT",
        "label": "Isothermal bulk modulus",
        "type": "number",
        "default": 1600,
        "unit": "MPa",
        "min": 1,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Liquid temperature before compression",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": -100,
        "max": 600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pressure rise (rapid, no heat exchange)",
        "type": "number",
        "default": 35,
        "unit": "MPa",
        "min": -1000,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Highest temperature allowed",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -100,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": false
      }
    ]
  },
  {
    "id": "gas-mixture-properties",
    "name": "Gas Mixture Properties (Dalton: Molar Mass, Gas Constant, Specific Heats, Density, Partial Pressures, Mixing Entropy)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "For a mixture of up to three perfect gases, what are its molar mass, gas constant, specific heats, ratio of specific heats, density, speed of sound and partial pressures, how much work does separating it take, and is one component’s partial pressure inside my limit?",
    "description": "Properties of a mixture of up to three perfect gases from their molar masses, specific heats and mole fractions: the mixture molar mass and mass fractions, gas constant, specific heats and their ratio, density and speed of sound at the pressure and temperature entered, each component’s partial pressure by Dalton’s law, the entropy of mixing and the least work to separate the mixture into its pure gases, and a check of one component’s partial pressure against a maximum or minimum you set.",
    "keywords": [
      "MAKEOS",
      "gas mixture",
      "Dalton",
      "partial pressure",
      "shielding gas",
      "gas constant",
      "specific heat ratio",
      "mixing entropy",
      "separation work",
      "mole fraction"
    ],
    "fields": [
      {
        "key": "h_gas_1",
        "label": "Gas 1",
        "type": "heading"
      },
      {
        "key": "M1",
        "label": "Molar mass of gas 1",
        "type": "number",
        "default": 39.948,
        "unit": "kg/kmol",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp1",
        "label": "Specific heat of gas 1 at constant pressure",
        "type": "number",
        "default": 0.5203,
        "unit": "kJ/(kg·K)",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "Mole fraction of gas 1",
        "type": "number",
        "default": 82,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_gas_2",
        "label": "Gas 2",
        "type": "heading"
      },
      {
        "key": "M2",
        "label": "Molar mass of gas 2",
        "type": "number",
        "default": 44.01,
        "unit": "kg/kmol",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp2",
        "label": "Specific heat of gas 2 at constant pressure",
        "type": "number",
        "default": 0.846,
        "unit": "kJ/(kg·K)",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Mole fraction of gas 2",
        "type": "number",
        "default": 18,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_gas_3_the_rest_of_the_mixture_",
        "label": "Gas 3 (the rest of the mixture)",
        "type": "heading"
      },
      {
        "key": "M3",
        "label": "Molar mass of gas 3",
        "type": "number",
        "default": 28.014,
        "unit": "kg/kmol",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp3",
        "label": "Specific heat of gas 3 at constant pressure",
        "type": "number",
        "default": 1.04,
        "unit": "kJ/(kg·K)",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_condition_and_check",
        "label": "Condition and check",
        "type": "heading"
      },
      {
        "key": "p",
        "label": "Mixture pressure",
        "type": "number",
        "default": 101.325,
        "unit": "kPa abs",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Mixture temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -270,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "comp",
        "label": "Component to check",
        "type": "select",
        "default": "2",
        "options": [
          [
            "1",
            "Gas 1"
          ],
          [
            "2",
            "Gas 2"
          ],
          [
            "3",
            "Gas 3"
          ]
        ]
      },
      {
        "key": "kind",
        "label": "Kind of limit",
        "type": "select",
        "default": "max",
        "options": [
          [
            "max",
            "Maximum partial pressure"
          ],
          [
            "min",
            "Minimum partial pressure"
          ]
        ]
      },
      {
        "key": "lim",
        "label": "Partial pressure limit",
        "type": "number",
        "default": 20,
        "unit": "kPa",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": false
      }
    ]
  },
  {
    "id": "thermoelectric-cooler-check",
    "name": "Thermoelectric Cooler Check (TEC Module Constants from the Datasheet, Heat Pumped, Power, COP, Hot-Side Heat)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "At my current and hot- and cold-side temperatures, how much heat do these thermoelectric modules pump, what power and voltage do they take, how much heat must the hot-side heat sink reject, and is that enough for my load?",
    "description": "Thermoelectric cooler (TEC) performance from the ideal module model: the module Seebeck coefficient, electrical resistance and thermal conductance worked out from the datasheet maximum current, maximum voltage and maximum temperature difference at the rated hot-side temperature, then at your operating current and temperatures the heat pumped from the cold side (junction heat less half the Joule heat less conduction back), the electrical power and voltage, COP, the heat to reject at the hot side, the current for the most heat pumped, and checks against the heat load and the module ratings.",
    "keywords": [
      "MAKEOS",
      "thermoelectric cooler",
      "thermoelectric module",
      "TEC",
      "Seebeck",
      "COP",
      "electronics cooling",
      "enclosure cooling",
      "heat sink",
      "Kelvin relations"
    ],
    "fields": [
      {
        "key": "h_module_rating_datasheet_",
        "label": "Module rating (datasheet)",
        "type": "heading"
      },
      {
        "key": "Imax",
        "label": "Maximum current",
        "type": "number",
        "default": 6,
        "unit": "A",
        "min": 0.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Vmax",
        "label": "Maximum voltage",
        "type": "number",
        "default": 15.4,
        "unit": "V",
        "min": 0.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTmax",
        "label": "Maximum temperature difference",
        "type": "number",
        "default": 68,
        "unit": "K",
        "min": 0.1,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Thr",
        "label": "Hot-side temperature for the ratings",
        "type": "number",
        "default": 27,
        "unit": "°C",
        "min": -100,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_operating_point",
        "label": "Operating point",
        "type": "heading"
      },
      {
        "key": "I",
        "label": "Operating current per module",
        "type": "number",
        "default": 3.5,
        "unit": "A",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Th",
        "label": "Hot-side temperature",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": -100,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Cold-side temperature",
        "type": "number",
        "default": 10,
        "unit": "°C",
        "min": -200,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of modules",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": true
      },
      {
        "key": "Qreq",
        "label": "Heat to be pumped from the cold side",
        "type": "number",
        "default": 40,
        "unit": "W",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
