// BIZOMAT MAKEOS: thermodynamics topic tools (batch greiner) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "blocked-in-liquid-pressure-check",
    "name": "Blocked-In Liquid Thermal Pressure Rise Check (Trapped Liquid Heated in a Pipe or Vessel)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "If a pipe or vessel completely full of liquid is closed off and then warms up, how fast does the pressure rise, what pressure does it reach, and how much warming can it take before it passes the design or relief pressure?",
    "description": "Pressure rise in a liquid trapped between closed valves (or in a sealed vessel) as it warms: the liquid’s volumetric expansion coefficient less the container’s, divided by the liquid’s compressibility (1 ÷ bulk modulus) plus the stretch of a thin pipe wall under pressure (inside diameter ÷ modulus × wall, with the restraint factor for free ends, anchored pipe or expansion joints), gives the pressure rise per kelvin; from it the pressure after the warming you enter, the warming that would reach your limit, and the hoop stress at the final pressure.",
    "keywords": [
      "MAKEOS",
      "thermal relief",
      "blocked-in liquid",
      "trapped liquid",
      "hydrostatic pressure rise",
      "thermal expansion",
      "bulk modulus"
    ],
    "fields": [
      {
        "key": "beta",
        "label": "Liquid volumetric expansion coefficient",
        "type": "number",
        "default": 210,
        "unit": "×10⁻⁶ /K",
        "min": 1,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "K",
        "label": "Liquid bulk modulus (isothermal)",
        "type": "number",
        "default": 2200,
        "unit": "MPa",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dT",
        "label": "Temperature rise of the trapped liquid",
        "type": "number",
        "default": 10,
        "unit": "K",
        "min": 0.01,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p0",
        "label": "Pressure when the liquid was blocked in",
        "type": "number",
        "default": 5,
        "unit": "bar g",
        "min": 0,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pd",
        "label": "Design pressure or relief set pressure (the limit)",
        "type": "number",
        "default": 16,
        "unit": "bar g",
        "min": 0.01,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_container",
        "label": "Container",
        "type": "heading"
      },
      {
        "key": "wall",
        "label": "Container wall",
        "type": "select",
        "default": "anch",
        "options": [
          [
            "rigid",
            "Rigid container (wall stretch ignored)"
          ],
          [
            "anch",
            "Thin-wall pipe anchored against axial movement"
          ],
          [
            "free",
            "Thin-wall pipe with closed ends free to move"
          ],
          [
            "joint",
            "Thin-wall pipe with expansion joints"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Pipe inside diameter",
        "type": "number",
        "default": 52.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "e",
        "label": "Pipe wall thickness",
        "type": "number",
        "default": 3.91,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Wall material elastic modulus",
        "type": "number",
        "default": 200,
        "unit": "GPa",
        "min": 0.1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Wall material Poisson’s ratio",
        "type": "number",
        "default": 0.3,
        "unit": "",
        "min": 0,
        "max": 0.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "aS",
        "label": "Wall material linear expansion coefficient",
        "type": "number",
        "default": 12,
        "unit": "×10⁻⁶ /K",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gas-cylinder-real-gas-duration",
    "name": "Gas Cylinder Contents and Duration Check (Peng–Robinson or van der Waals Real Gas)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "How much gas is really in a high-pressure cylinder once real-gas behaviour is allowed for, how much of it can be used down to the regulator’s minimum pressure, and will it last the time I need at my usage rate?",
    "description": "Contents of a compressed (non-liquefied) gas cylinder from its water capacity, pressure and temperature, using the compressibility factor Z of a cubic equation of state built from the gas’s critical temperature and pressure: Peng–Robinson (with the acentric factor) or van der Waals (critical constants only), the other shown for comparison, together with the ideal-gas figure. From the contents at the full and lowest usable pressures it gives the usable gas in kilograms and standard litres and how long it lasts at your usage rate, against the time it must last.",
    "keywords": [
      "MAKEOS",
      "gas cylinder contents",
      "real gas",
      "compressibility factor",
      "van der Waals",
      "Peng-Robinson",
      "cylinder duration"
    ],
    "fields": [
      {
        "key": "eos",
        "label": "Equation of state",
        "type": "select",
        "default": "pr",
        "options": [
          [
            "pr",
            "Peng–Robinson (critical constants and acentric factor)"
          ],
          [
            "vdw",
            "van der Waals (critical constants only)"
          ]
        ]
      },
      {
        "key": "V",
        "label": "Cylinder water capacity (internal volume)",
        "type": "number",
        "default": 50,
        "unit": "L",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pFull",
        "label": "Cylinder pressure now",
        "type": "number",
        "default": 200,
        "unit": "bar g",
        "min": 0.01,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pMin",
        "label": "Lowest usable cylinder pressure",
        "type": "number",
        "default": 10,
        "unit": "bar g",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Gas temperature in the cylinder",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -100,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_gas_properties",
        "label": "Gas properties",
        "type": "heading"
      },
      {
        "key": "M",
        "label": "Molar mass of the gas",
        "type": "number",
        "default": 28.014,
        "unit": "g/mol",
        "min": 1,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Critical temperature of the gas",
        "type": "number",
        "default": 126.2,
        "unit": "K",
        "min": 1,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pc",
        "label": "Critical pressure of the gas",
        "type": "number",
        "default": 33.98,
        "unit": "bar",
        "min": 0.1,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "w",
        "label": "Acentric factor of the gas (Peng–Robinson only)",
        "type": "number",
        "default": 0.037,
        "unit": "",
        "min": -0.5,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_use",
        "label": "Use",
        "type": "heading"
      },
      {
        "key": "Q",
        "label": "Gas use rate at the reference conditions",
        "type": "number",
        "default": 15,
        "unit": "L/min",
        "min": 0.001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tref",
        "label": "Reference temperature of the use rate (at 101.325 kPa)",
        "type": "number",
        "default": 15,
        "unit": "°C",
        "min": -50,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "need",
        "label": "Time the cylinder must last",
        "type": "number",
        "default": 8,
        "unit": "h",
        "min": 0.01,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pAtm",
        "label": "Atmospheric pressure",
        "type": "number",
        "default": 101.325,
        "unit": "kPa abs",
        "min": 50,
        "max": 110,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "boiling-point-at-pressure",
    "name": "Boiling Point and Vapour Pressure at Operating Pressure (Clausius–Clapeyron Check)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "At the pressure over my liquid (a vacuum, a tank at altitude or a pressurised vessel), at what temperature will it boil, what is its vapour pressure at my process temperature, and is there enough margin to keep it from boiling or flashing?",
    "description": "Boiling point and vapour pressure of a liquid away from a known point, by the integrated Clausius–Clapeyron equation (vapour treated as an ideal gas, latent heat taken as constant): from a known boiling point and its pressure, the latent heat of vaporisation and the molar mass, it gives the boiling temperature at the operating pressure, the vapour pressure at the liquid’s highest temperature, the margin between them against the margin you require, and how far the estimate is taken from its reference point.",
    "keywords": [
      "MAKEOS",
      "boiling point",
      "vapour pressure",
      "Clausius-Clapeyron",
      "vacuum drying",
      "flashing",
      "saturation temperature"
    ],
    "fields": [
      {
        "key": "Tb0",
        "label": "Known boiling point (reference)",
        "type": "number",
        "default": 100,
        "unit": "°C",
        "min": -270,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p0",
        "label": "Pressure at the known boiling point",
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
        "key": "L",
        "label": "Latent heat of vaporisation",
        "type": "number",
        "default": 2257,
        "unit": "kJ/kg",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "M",
        "label": "Molar mass of the liquid",
        "type": "number",
        "default": 18.015,
        "unit": "g/mol",
        "min": 1,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_process",
        "label": "Process",
        "type": "heading"
      },
      {
        "key": "p",
        "label": "Operating pressure over the liquid",
        "type": "number",
        "default": 20,
        "unit": "kPa abs",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tl",
        "label": "Highest liquid temperature in the process",
        "type": "number",
        "default": 50,
        "unit": "°C",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Required margin below boiling",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "carnot-limit-check",
    "name": "Heat Pump, Chiller or Heat Engine Claim Check (Carnot Limit, Second-Law Efficiency, Running Cost)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "Is the COP or efficiency claimed for this heat pump, chiller or heat engine possible between these two temperatures, how close does it come to the Carnot limit, and what does it cost to run each year?",
    "description": "Second-law check of a cyclic machine between a hot and a cold temperature: the Carnot limit for a heat pump (T_h ÷ (T_h − T_c)), a chiller (T_c ÷ (T_h − T_c)) or a heat engine (1 − T_c ÷ T_h), the actual COP or efficiency from the useful output and the input, the second-law efficiency (actual ÷ limit) against your acceptance level, and the yearly input energy and its cost; for a heat pump also the saving against heating with direct electric resistance at the same price.",
    "keywords": [
      "MAKEOS",
      "Carnot limit",
      "COP",
      "heat pump",
      "chiller",
      "second-law efficiency",
      "heat engine efficiency"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Machine",
        "type": "select",
        "default": "hp",
        "options": [
          [
            "hp",
            "Heat pump (heating is the useful output)"
          ],
          [
            "ch",
            "Chiller or refrigeration (cooling is the useful output)"
          ],
          [
            "en",
            "Heat engine (work is the useful output)"
          ]
        ]
      },
      {
        "key": "Th",
        "label": "Hot side temperature",
        "type": "number",
        "default": 55,
        "unit": "°C",
        "min": -200,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Cold side temperature",
        "type": "number",
        "default": 7,
        "unit": "°C",
        "min": -270,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "out",
        "label": "Useful output (heat delivered, cooling or work)",
        "type": "number",
        "default": 12,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "inp",
        "label": "Input (electrical or shaft power, or heat for an engine)",
        "type": "number",
        "default": 3.5,
        "unit": "kW",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etaMin",
        "label": "Lowest second-law efficiency you accept",
        "type": "number",
        "default": 30,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_running_cost",
        "label": "Running cost",
        "type": "heading"
      },
      {
        "key": "hours",
        "label": "Running hours per year at this output",
        "type": "number",
        "default": 2000,
        "unit": "h/year",
        "min": 0,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Price of the input energy (including GST)",
        "type": "number",
        "default": 0.3,
        "unit": "AUD/kWh",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "compressed-gas-stored-energy",
    "name": "Compressed Gas Stored Energy Check (Isothermal Exergy, Isentropic and Brode Burst Energy, pV Product)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "How much energy is stored in a compressed-air receiver or gas vessel, how much of it could do useful work, how much could a sudden rupture release, and is its pressure × volume above the limit my classification uses?",
    "description": "Energy stored in an ideal gas compressed in a rigid vessel and settled at the ambient temperature: the isothermal expansion work pV ln(p ÷ p₀), the useful work (exergy) after the work of pushing back the atmosphere is taken away, the isentropic expansion energy and the Brode upper bound that hazard assessments use for a sudden rupture, the atmospheric air needed to fill the vessel and the compressor energy at your specific power, the share of that energy kept as exergy, and the gauge pressure × volume product against the limit you enter.",
    "keywords": [
      "MAKEOS",
      "stored energy",
      "air receiver",
      "burst energy",
      "exergy",
      "pressure vessel hazard",
      "pV product"
    ],
    "fields": [
      {
        "key": "V",
        "label": "Vessel internal volume",
        "type": "number",
        "default": 500,
        "unit": "L",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pg",
        "label": "Gas pressure",
        "type": "number",
        "default": 10,
        "unit": "bar g",
        "min": 0.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pa",
        "label": "Atmospheric pressure",
        "type": "number",
        "default": 101.325,
        "unit": "kPa abs",
        "min": 50,
        "max": 110,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Ratio of specific heats γ of the gas",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1.01,
        "max": 1.67,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_filling_and_classification",
        "label": "Filling and classification",
        "type": "heading"
      },
      {
        "key": "sp",
        "label": "Compressor specific power (per m³/min of inlet air)",
        "type": "number",
        "default": 6.5,
        "unit": "kW/(m³/min)",
        "min": 0.01,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pVlim",
        "label": "Pressure × volume limit you apply",
        "type": "number",
        "default": 1000,
        "unit": "MPa·L",
        "min": 0.001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gas-generator-energy-check",
    "name": "Nitrogen or Oxygen Generator Energy Check (Minimum Separation Work, Second-Law Efficiency, Running Cost)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What is the least energy physics allows for making nitrogen or oxygen of my purity from air at this air factor, how does the generator’s actual specific energy compare, and what does the gas cost to make each year?",
    "description": "Second-law check of an on-site gas generator (PSA, membrane or other) treating air as a two-part oxygen–nitrogen mixture of ideal gases: the oxygen content of the waste stream from the oxygen balance, the minimum (reversible, isothermal) work of separation from the entropy of mixing, RT[Σ n x ln x] of the products less that of the feed, per cubic metre of product at your reference temperature, the lowest minimum with complete recovery, the recovery of the wanted gas, the second-law efficiency of the generator’s actual specific energy, and the yearly energy and cost at your flow, hours and tariff.",
    "keywords": [
      "MAKEOS",
      "nitrogen generator",
      "oxygen generator",
      "PSA",
      "minimum work of separation",
      "mixing entropy",
      "specific energy"
    ],
    "fields": [
      {
        "key": "xF",
        "label": "Oxygen content of the feed air",
        "type": "number",
        "default": 20.95,
        "unit": "%",
        "min": 0.01,
        "max": 99.99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "xP",
        "label": "Oxygen content of the product",
        "type": "number",
        "default": 1,
        "unit": "%",
        "min": 0.001,
        "max": 99.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "AF",
        "label": "Air factor (feed air ÷ product, by volume)",
        "type": "number",
        "default": 3,
        "unit": "×",
        "min": 1.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Separation temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -200,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_plant",
        "label": "Plant",
        "type": "heading"
      },
      {
        "key": "Q",
        "label": "Product flow",
        "type": "number",
        "default": 50,
        "unit": "m³/h",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tref",
        "label": "Reference temperature of the flows (at 101.325 kPa)",
        "type": "number",
        "default": 0,
        "unit": "°C",
        "min": -50,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "SE",
        "label": "Actual specific energy (including the air compressor)",
        "type": "number",
        "default": 0.3,
        "unit": "kWh/m³",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hours",
        "label": "Running hours per year",
        "type": "number",
        "default": 4000,
        "unit": "h/year",
        "min": 0,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Electricity price (ex GST for a GST-registered business)",
        "type": "number",
        "default": 0.25,
        "unit": "AUD/kWh",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "quench-tank-temperature-check",
    "name": "Quench Tank Temperature Check (Equilibrium Temperature per Load, Loads to the Limit, Cooling Duty)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "When a hot load is quenched into my tank, what temperature does the bath settle at, how many loads can it take without cooling before it passes its limit, and is the cooler big enough for my load rate?",
    "description": "Heat balance of a quench: the mixture (equilibrium) temperature of a hot load and the bath from their heat capacities (mass × mean specific heat) and starting temperatures, the bath temperature rise and heat released per load, the entropy generated, the number of loads in a row the bath can take before it passes its highest allowed temperature with no cooling, and the average heat input at your loads per hour against the cooler capacity.",
    "keywords": [
      "MAKEOS",
      "quench tank",
      "quench oil temperature",
      "heat treatment",
      "mixture temperature",
      "cooler sizing",
      "heat balance"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Load mass (parts plus basket or fixture)",
        "type": "number",
        "default": 150,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Mean specific heat of the load over the quench",
        "type": "number",
        "default": 600,
        "unit": "J/(kg·K)",
        "min": 1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tl",
        "label": "Load temperature entering the quench",
        "type": "number",
        "default": 850,
        "unit": "°C",
        "min": -50,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_quench_bath",
        "label": "Quench bath",
        "type": "heading"
      },
      {
        "key": "Vq",
        "label": "Quenchant volume",
        "type": "number",
        "default": 3000,
        "unit": "L",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rho",
        "label": "Quenchant density",
        "type": "number",
        "default": 870,
        "unit": "kg/m³",
        "min": 1,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cq",
        "label": "Quenchant specific heat",
        "type": "number",
        "default": 2000,
        "unit": "J/(kg·K)",
        "min": 1,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tb",
        "label": "Bath temperature before the load",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -50,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tmax",
        "label": "Highest allowed bath temperature",
        "type": "number",
        "default": 80,
        "unit": "°C",
        "min": -50,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_load_rate_and_cooling",
        "label": "Load rate and cooling",
        "type": "heading"
      },
      {
        "key": "rate",
        "label": "Loads per hour",
        "type": "number",
        "default": 2,
        "unit": "loads/h",
        "min": 0.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cool",
        "label": "Cooler capacity",
        "type": "number",
        "default": 45,
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
