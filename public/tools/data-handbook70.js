// KEVOS® MAKEOS: thermodynamics topic tools after Linder, Thermodynamics and Introductory Statistical Mechanics (batch handbook70), within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "heat-engine-second-law-check",
    "name": "Heat Engine and Heat Pump Second-Law Check (Carnot Limit, Entropy Generated, Lost Work)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "Is the efficiency or COP claimed for this engine, chiller or heat pump possible between its two temperatures, how close is it to the Carnot limit, and how much work does its irreversibility cost?",
    "description": "Second-law check of a heat engine, refrigerator or chiller, or heat pump working between a hot and a cold temperature: the actual efficiency or coefficient of performance from the heat and work rates, the Carnot limit from the absolute temperatures, the share of that limit achieved, the heat at the other reservoir from the energy balance, the entropy generated from the Clausius inequality and the lost work against an ideal reversible machine, against a credible share of the Carnot limit you set.",
    "keywords": [
      "MAKEOS",
      "Carnot efficiency",
      "coefficient of performance",
      "COP",
      "second law",
      "entropy generation",
      "heat pump",
      "chiller",
      "lost work"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Machine",
        "type": "select",
        "default": "pump",
        "options": [
          [
            "engine",
            "Heat engine (heat in, work out)"
          ],
          [
            "fridge",
            "Refrigerator or chiller (cooling, work in)"
          ],
          [
            "pump",
            "Heat pump (heating, work in)"
          ]
        ]
      },
      {
        "key": "Q",
        "label": "Heat rate: taken in (engine), cooling (chiller) or heating delivered (heat pump)",
        "type": "number",
        "default": 10,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "W",
        "label": "Work or power: delivered (engine) or taken in (chiller, heat pump)",
        "type": "number",
        "default": 2.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Th",
        "label": "Hot reservoir temperature",
        "type": "number",
        "default": 45,
        "unit": "°C",
        "min": -200,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Cold reservoir temperature",
        "type": "number",
        "default": 5,
        "unit": "°C",
        "min": -270,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "share",
        "label": "Largest credible share of the Carnot limit",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gas-throttling-cooling-check",
    "name": "Gas Pressure Reduction Cooling Check (Joule–Thomson Temperature Drop, Outlet Temperature, Preheat)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "How much does a gas cool when its pressure is reduced through a regulator or valve, does the outlet stay above the lowest temperature allowed, and how much preheat is needed if it does not?",
    "description": "Temperature change of a gas throttled at constant enthalpy through a regulator, valve or orifice: the Joule–Thomson coefficient either entered or estimated from van der Waals constants and integrated over the pressure drop, the outlet temperature and drop, the inversion temperature of the van der Waals gas, and the inlet temperature and preheat power needed to keep the outlet at the lowest temperature you allow.",
    "keywords": [
      "MAKEOS",
      "Joule-Thomson",
      "throttling",
      "pressure regulator",
      "gas preheat",
      "regulator freezing",
      "van der Waals",
      "inversion temperature"
    ],
    "fields": [
      {
        "key": "model",
        "label": "Coefficient",
        "type": "select",
        "default": "vdw",
        "options": [
          [
            "vdw",
            "Estimate from van der Waals constants"
          ],
          [
            "mu",
            "Enter a Joule–Thomson coefficient"
          ]
        ]
      },
      {
        "key": "T1",
        "label": "Inlet gas temperature",
        "type": "number",
        "default": 15,
        "unit": "°C",
        "min": -150,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P1",
        "label": "Inlet pressure (absolute)",
        "type": "number",
        "default": 70,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P2",
        "label": "Outlet pressure (absolute)",
        "type": "number",
        "default": 7,
        "unit": "bar",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_gas",
        "label": "Gas properties",
        "type": "heading"
      },
      {
        "key": "a",
        "label": "van der Waals constant a",
        "type": "number",
        "default": 1.408,
        "unit": "L²·bar/mol²",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "van der Waals constant b",
        "type": "number",
        "default": 0.03913,
        "unit": "L/mol",
        "min": 0,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cp",
        "label": "Molar heat capacity at constant pressure",
        "type": "number",
        "default": 29.1,
        "unit": "J/(mol·K)",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Joule–Thomson coefficient (entered)",
        "type": "number",
        "default": 0.25,
        "unit": "K/bar",
        "min": -5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_flow",
        "label": "Flow and limit",
        "type": "heading"
      },
      {
        "key": "mdot",
        "label": "Gas mass flow",
        "type": "number",
        "default": 100,
        "unit": "kg/h",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "M",
        "label": "Molar mass of the gas",
        "type": "number",
        "default": 28.014,
        "unit": "g/mol",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmin",
        "label": "Lowest acceptable outlet temperature",
        "type": "number",
        "default": 0,
        "unit": "°C",
        "min": -200,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vacuum-boiling-point",
    "name": "Boiling Point Under Vacuum (Clausius–Clapeyron Boiling Temperature, Pressure for a Temperature Limit)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "At what temperature will this liquid boil at the vacuum I can pull, and what pressure do I need to boil it below the highest temperature the product allows?",
    "description": "Boiling temperature of a liquid at a reduced (or raised) pressure from one known boiling point and the enthalpy of vaporisation, by the integrated Clausius–Clapeyron equation, and the absolute pressure at which it boils at the highest liquid temperature you allow, for vacuum drying, evaporation, distillation and degassing, against that temperature limit.",
    "keywords": [
      "MAKEOS",
      "Clausius-Clapeyron",
      "boiling point",
      "vacuum",
      "vapour pressure",
      "vacuum drying",
      "evaporation",
      "distillation"
    ],
    "fields": [
      {
        "key": "T1",
        "label": "Known boiling temperature",
        "type": "number",
        "default": 100,
        "unit": "°C",
        "min": -270,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P1",
        "label": "Pressure at the known boiling point (absolute)",
        "type": "number",
        "default": 101.325,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dH",
        "label": "Molar enthalpy of vaporisation",
        "type": "number",
        "default": 40.656,
        "unit": "kJ/mol",
        "min": 0.1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Operating pressure (absolute)",
        "type": "number",
        "default": 20,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Highest allowed liquid temperature",
        "type": "number",
        "default": 65,
        "unit": "°C",
        "min": -270,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "solvent-headspace-lel-check",
    "name": "Solvent Vapour Headspace Check (Raoult’s Law Partial Pressure, Saturated Concentration, Share of LEL)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "If this solvent sits in a closed tank or container until its vapour saturates the space above it, how close does the vapour come to the lower explosive limit, and at what liquid temperature does it reach my limit?",
    "description": "Screening of the saturated vapour above a solvent or solvent solution in a closed space: the pure-solvent vapour pressure at the liquid temperature from a reference value by the Clausius–Clapeyron equation, the solvent’s partial pressure by Raoult’s law, the equilibrium headspace concentration and its share of the lower explosive limit, and the liquid temperatures at which the headspace reaches your limit and the LEL itself, against the share of LEL you allow.",
    "keywords": [
      "MAKEOS",
      "Raoult’s law",
      "lower explosive limit",
      "LEL",
      "solvent vapour",
      "headspace",
      "vapour pressure",
      "flammable atmosphere"
    ],
    "fields": [
      {
        "key": "x",
        "label": "Mole fraction of the solvent in the liquid",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ps",
        "label": "Vapour pressure of the pure solvent at the reference temperature",
        "type": "number",
        "default": 3.8,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tref",
        "label": "Reference temperature for that vapour pressure",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -100,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dH",
        "label": "Molar enthalpy of vaporisation",
        "type": "number",
        "default": 38,
        "unit": "kJ/mol",
        "min": 0.1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Liquid temperature",
        "type": "number",
        "default": 35,
        "unit": "°C",
        "min": -100,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ptot",
        "label": "Total pressure in the headspace (absolute)",
        "type": "number",
        "default": 101.325,
        "unit": "kPa",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limit",
        "label": "Flammability limit",
        "type": "heading"
      },
      {
        "key": "LEL",
        "label": "Lower explosive limit of the solvent vapour",
        "type": "number",
        "default": 1.1,
        "unit": "%",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lim",
        "label": "Largest allowed share of the LEL",
        "type": "number",
        "default": 25,
        "unit": "%",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ro-osmotic-pressure-check",
    "name": "Reverse Osmosis Pressure Check (van ’t Hoff Osmotic Pressure, Concentrate End, Net Driving Pressure)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "Is the feed pressure of this reverse osmosis unit enough to keep water passing through the membrane at the concentrate end, where the dissolved solids, and so the osmotic pressure, are highest?",
    "description": "Thermodynamic pressure check of a reverse osmosis stage: the osmotic pressure of the feed, the concentrate and the permeate by the van ’t Hoff equation with your dissociation factor and osmotic coefficient, the concentrate strength from a solute mass balance at the recovery and salt passage you enter, the net driving pressure at the feed end and at the concentrate end, and the least feed pressure, against the net driving pressure you require at the concentrate end.",
    "keywords": [
      "MAKEOS",
      "reverse osmosis",
      "osmotic pressure",
      "van ’t Hoff",
      "net driving pressure",
      "recovery",
      "water treatment",
      "membrane"
    ],
    "fields": [
      {
        "key": "c",
        "label": "Dissolved solids in the feed",
        "type": "number",
        "default": 3,
        "unit": "g/L",
        "min": 0.000001,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "M",
        "label": "Molar mass of the dissolved solute",
        "type": "number",
        "default": 58.44,
        "unit": "g/mol",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Dissolved particles per formula unit (van ’t Hoff factor)",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "phi",
        "label": "Osmotic coefficient",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Water temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Recovery (permeate as a share of feed)",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 0,
        "max": 99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sp",
        "label": "Salt passage (permeate strength as a share of feed)",
        "type": "number",
        "default": 2,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_press",
        "label": "Pressures",
        "type": "heading"
      },
      {
        "key": "pf",
        "label": "Feed pressure (gauge)",
        "type": "number",
        "default": 15,
        "unit": "bar",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dp",
        "label": "Pressure drop from feed to concentrate",
        "type": "number",
        "default": 2,
        "unit": "bar",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pp",
        "label": "Permeate back pressure (gauge)",
        "type": "number",
        "default": 0.5,
        "unit": "bar",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ndpMin",
        "label": "Least net driving pressure at the concentrate end",
        "type": "number",
        "default": 1,
        "unit": "bar",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "hot-cold-water-blend-check",
    "name": "Hot and Cold Water Blending Check (Flow Split, Hot Supply, Entropy Generated, Lost Work)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "How much hot and cold water must be blended to give a set mixed temperature and flow, can the hot supply provide it, and how much work potential is lost by mixing instead of heating to the target directly?",
    "description": "Adiabatic blending of a hot and a cold water stream to a target temperature: the hot share and the hot and cold flows from the energy balance, the heating power carried by the hot stream above the cold supply, the entropy generated from the entropy change of each stream as an incompressible liquid, and the lost work at the surroundings temperature, against the hot water flow the supply can deliver.",
    "keywords": [
      "MAKEOS",
      "water blending",
      "mixing valve",
      "mixed temperature",
      "entropy generation",
      "lost work",
      "exergy",
      "hot water"
    ],
    "fields": [
      {
        "key": "Th",
        "label": "Hot supply temperature",
        "type": "number",
        "default": 65,
        "unit": "°C",
        "min": 0.01,
        "max": 99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Cold supply temperature",
        "type": "number",
        "default": 15,
        "unit": "°C",
        "min": 0.01,
        "max": 99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tt",
        "label": "Target mixed temperature",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": 0.01,
        "max": 99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Q",
        "label": "Mixed flow needed",
        "type": "number",
        "default": 30,
        "unit": "L/min",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hotCap",
        "label": "Hot water flow available",
        "type": "number",
        "default": 20,
        "unit": "L/min",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_water",
        "label": "Water and surroundings",
        "type": "heading"
      },
      {
        "key": "cp",
        "label": "Specific heat capacity of the water",
        "type": "number",
        "default": 4.18,
        "unit": "kJ/(kg·K)",
        "min": 0.1,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Water density",
        "type": "number",
        "default": 1000,
        "unit": "kg/m³",
        "min": 1,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T0",
        "label": "Surroundings temperature for the lost work",
        "type": "number",
        "default": 15,
        "unit": "°C",
        "min": -50,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
