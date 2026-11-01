// KEVOS® MAKEOS: thermodynamics tool from Callen, Thermodynamics and an Introduction to Thermostatistics (batch callen) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "liquid-throttling-temperature-rise",
    "name": "Liquid Throttling Temperature Rise (Valve and Orifice Heating, Joule–Thomson for Liquids)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How much does hydraulic oil, water or another liquid warm as it passes through a relief valve, flow control, orifice or partly closed valve that drops its pressure without doing work?",
    "description": "Temperature rise of a liquid throttled at constant enthalpy across a valve, orifice or other restriction, from its density, expansion coefficient and specific heat and the pressure dropped (the Joule–Thomson relation applied to a liquid): the temperature rise, the pressure energy turned to heat per kilogram, the simpler estimate that ignores thermal expansion and how far the expansion term lowers it, the temperature after the restriction, and a check of the rise against your limit.",
    "keywords": [
      "MAKEOS",
      "throttling",
      "Joule–Thomson",
      "relief valve heating",
      "hydraulic oil temperature",
      "pressure drop heating",
      "orifice"
    ],
    "fields": [
      {
        "key": "h_props",
        "label": "Liquid properties",
        "type": "heading"
      },
      {
        "key": "rho",
        "label": "Density",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 1,
        "max": 25000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "beta",
        "label": "Volumetric expansion coefficient",
        "type": "number",
        "default": 700,
        "unit": "×10⁻⁶ /K",
        "min": 0,
        "max": 10000,
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
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_drop",
        "label": "Pressure drop",
        "type": "heading"
      },
      {
        "key": "T",
        "label": "Liquid temperature before the restriction",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pressure dropped across the restriction",
        "type": "number",
        "default": 300,
        "unit": "bar",
        "min": 0.000001,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "limit",
        "label": "Largest acceptable temperature rise",
        "type": "number",
        "default": 10,
        "unit": "K",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
