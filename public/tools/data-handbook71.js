// BIZOMAT MAKEOS: classical thermodynamics tools (batch handbook71) within the Tools directory.
// Methods follow E. A. Guggenheim, Thermodynamics (North-Holland); no text, tables or examples are reproduced.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "trapped-liquid-pressure-check",
    "name": "Trapped Liquid Thermal Pressure Check (Blocked-In Line Heating, Pipe Stretch, Relief Need)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "If liquid is shut in between closed valves and warms up, how fast does its pressure climb, does it pass the design pressure, and how much liquid must a thermal relief let out?",
    "description": "Pressure rise of a liquid trapped full in a closed pipe or vessel when it warms: the liquid’s volumetric expansion less the growth of the pipe, divided by the liquid’s compressibility plus the stretch of the pipe wall under pressure (thin-walled pipe with closed ends, or a rigid container as the upper bound), giving the pressure rise per kelvin, the final pressure, the largest temperature rise the design pressure allows, the hoop stress at the final pressure and the volume a thermal relief must release, against the design pressure or relief setting.",
    "keywords": [
      "MAKEOS",
      "thermal relief",
      "blocked-in line",
      "trapped liquid",
      "thermal expansion",
      "bulk modulus",
      "pressure rise",
      "isothermal compressibility"
    ],
    "fields": [
      {
        "key": "beta",
        "label": "Liquid volumetric expansion coefficient",
        "type": "number",
        "default": 207,
        "unit": "×10⁻⁶ /K",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Kb",
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
        "default": 3,
        "unit": "K",
        "min": 0,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p0",
        "label": "Pressure when the section was shut in",
        "type": "number",
        "default": 5,
        "unit": "bar g",
        "min": -1,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_pipe",
        "label": "Pipe or vessel",
        "type": "heading"
      },
      {
        "key": "wall",
        "label": "Wall model",
        "type": "select",
        "default": "pipe",
        "options": [
          [
            "pipe",
            "Thin-walled pipe, closed ends, free to stretch"
          ],
          [
            "rigid",
            "Rigid container (liquid alone, upper bound)"
          ]
        ]
      },
      {
        "key": "D",
        "label": "Bore",
        "type": "number",
        "default": 52.5,
        "unit": "mm",
        "min": 0.1,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Wall thickness",
        "type": "number",
        "default": 3.91,
        "unit": "mm",
        "min": 0.01,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E",
        "label": "Wall modulus of elasticity",
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
        "label": "Wall Poisson’s ratio",
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
        "key": "al",
        "label": "Wall linear expansion coefficient",
        "type": "number",
        "default": 12,
        "unit": "µm/m·K",
        "min": 0,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Length of the trapped section",
        "type": "number",
        "default": 20,
        "unit": "m",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limit",
        "label": "Limit",
        "type": "heading"
      },
      {
        "key": "pd",
        "label": "Design pressure or relief setting",
        "type": "number",
        "default": 16,
        "unit": "bar g",
        "min": 0,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ro-concentrate-pressure-check",
    "name": "Reverse Osmosis Concentrate-End Check (Osmotic Coefficient, Concentrate Osmotic Pressure, Least Feed Pressure)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For this salty feed water and recovery, what osmotic pressure must a reverse osmosis unit overcome at the concentrate end, and is my feed pressure high enough to keep water passing the last membrane?",
    "description": "Feed pressure check for a reverse osmosis stage: the molar concentration from the dissolved solids and the salt’s molar mass, the osmotic pressure from the osmotic coefficient, ions per formula unit and absolute temperature, the permeate and concentrate concentrations from the salt rejection and recovery by a solute balance, the net driving pressure at the feed end and at the concentrate end after the element pressure drop and permeate back pressure, and the least feed pressure that keeps the required net driving pressure at the concentrate end.",
    "keywords": [
      "MAKEOS",
      "reverse osmosis",
      "osmotic pressure",
      "desalination",
      "net driving pressure",
      "recovery",
      "osmotic coefficient",
      "water treatment"
    ],
    "fields": [
      {
        "key": "tds",
        "label": "Feed dissolved solids",
        "type": "number",
        "default": 35,
        "unit": "g/L",
        "min": 0.01,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "M",
        "label": "Molar mass of the dissolved salt",
        "type": "number",
        "default": 58.44,
        "unit": "g/mol",
        "min": 1,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "nu",
        "label": "Ions released per formula unit",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 1,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "phi",
        "label": "Osmotic coefficient",
        "type": "number",
        "default": 0.92,
        "unit": "",
        "min": 0.1,
        "max": 2,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Feed temperature",
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
        "key": "h_stage",
        "label": "Membrane stage",
        "type": "heading"
      },
      {
        "key": "rec",
        "label": "Recovery",
        "type": "number",
        "default": 45,
        "unit": "%",
        "min": 1,
        "max": 95,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rej",
        "label": "Salt rejection",
        "type": "number",
        "default": 99.5,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pf",
        "label": "Feed pressure at the membrane inlet",
        "type": "number",
        "default": 60,
        "unit": "bar g",
        "min": 0,
        "max": 150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dpe",
        "label": "Pressure drop along the elements",
        "type": "number",
        "default": 1.5,
        "unit": "bar",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pp",
        "label": "Permeate back pressure",
        "type": "number",
        "default": 0.5,
        "unit": "bar g",
        "min": 0,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ndp",
        "label": "Least net driving pressure at the concentrate end",
        "type": "number",
        "default": 3,
        "unit": "bar",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "ph-electrode-calibration-check",
    "name": "pH Electrode Two-Buffer Calibration Check (Nernst Slope, Offset, Sample pH)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "After a two-buffer calibration, is my pH electrode’s slope and offset within the acceptance limits, and what pH does my sample reading give at its own temperature?",
    "description": "Two-point pH electrode calibration check: the ideal Nernst slope ln 10 × RT/F at the calibration temperature, the measured slope from the two buffer readings and its percentage of ideal, the offset (the reading at pH 7) and the pH at which the electrode reads zero, and the sample pH from its millivolt reading with the slope scaled to the sample’s absolute temperature, against the user’s slope and offset acceptance limits.",
    "keywords": [
      "MAKEOS",
      "pH meter",
      "pH electrode",
      "calibration",
      "Nernst slope",
      "offset",
      "buffer",
      "temperature compensation"
    ],
    "fields": [
      {
        "key": "pH1",
        "label": "First buffer pH at the calibration temperature",
        "type": "number",
        "default": 7,
        "unit": "pH",
        "min": 0,
        "max": 14,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E1",
        "label": "Electrode reading in the first buffer",
        "type": "number",
        "default": -3,
        "unit": "mV",
        "min": -2000,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pH2",
        "label": "Second buffer pH at the calibration temperature",
        "type": "number",
        "default": 4.01,
        "unit": "pH",
        "min": 0,
        "max": 14,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "E2",
        "label": "Electrode reading in the second buffer",
        "type": "number",
        "default": 168,
        "unit": "mV",
        "min": -2000,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Calibration temperature",
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
        "key": "h_acc",
        "label": "Acceptance limits",
        "type": "heading"
      },
      {
        "key": "sMin",
        "label": "Lowest acceptable slope",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 50,
        "max": 110,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sMax",
        "label": "Highest acceptable slope",
        "type": "number",
        "default": 102,
        "unit": "%",
        "min": 50,
        "max": 120,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "offMax",
        "label": "Largest acceptable offset at pH 7",
        "type": "number",
        "default": 30,
        "unit": "mV",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_sample",
        "label": "Sample",
        "type": "heading"
      },
      {
        "key": "Es",
        "label": "Electrode reading in the sample",
        "type": "number",
        "default": 50,
        "unit": "mV",
        "min": -2000,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ts",
        "label": "Sample temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "clausius-boiling-margin-check",
    "name": "Boiling Margin Check (Clausius–Clapeyron Vapour Pressure, Keep Liquid or Make It Boil)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "From one known boiling point and the heat of vaporisation, what is this liquid’s vapour pressure at my temperature, at what temperature does it boil at my pressure, and is there enough margin to keep it liquid (or to make it boil)?",
    "description": "Vapour pressure and boiling temperature from the integrated Clausius–Clapeyron relation, with a constant molar enthalpy of vaporisation and one known boiling point: the vapour pressure at the liquid temperature, the boiling temperature at the absolute pressure above the liquid, the temperature margin to boiling, and the pressure that gives the required margin, judged either for keeping a liquid from boiling or flashing (pump suctions, hot transfers, vacuum vessels) or for making it boil (vacuum drying, degassing, distillation).",
    "keywords": [
      "MAKEOS",
      "vapour pressure",
      "boiling point",
      "Clausius–Clapeyron",
      "flashing",
      "vacuum boiling",
      "enthalpy of vaporisation",
      "degassing"
    ],
    "fields": [
      {
        "key": "Tb",
        "label": "Known boiling temperature",
        "type": "number",
        "default": 100,
        "unit": "°C",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pb",
        "label": "Pressure at that boiling temperature",
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
        "key": "H",
        "label": "Molar enthalpy of vaporisation",
        "type": "number",
        "default": 40.66,
        "unit": "kJ/mol",
        "min": 0.1,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_op",
        "label": "Operating condition",
        "type": "heading"
      },
      {
        "key": "Top",
        "label": "Liquid temperature",
        "type": "number",
        "default": 60,
        "unit": "°C",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pop",
        "label": "Absolute pressure above the liquid",
        "type": "number",
        "default": 30,
        "unit": "kPa abs",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "goal",
        "label": "What you need",
        "type": "select",
        "default": "avoid",
        "options": [
          [
            "avoid",
            "Keep it liquid (no boiling or flashing)"
          ],
          [
            "boil",
            "Make it boil (drying, degassing, distillation)"
          ]
        ]
      },
      {
        "key": "mn",
        "label": "Required temperature margin",
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
    "id": "gas-throttling-temperature-check",
    "name": "Gas Throttling Temperature Check (Joule–Thomson Cooling, Regulator Outlet, Preheat)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "When this gas is throttled through a regulator or valve from a high to a low pressure, how cold does it come out, and how much preheat keeps the outlet above my lowest allowed temperature?",
    "description": "Temperature change of a gas throttled at constant enthalpy: the Joule–Thomson coefficient from the van der Waals second virial coefficient (2a ÷ RT − b) ÷ Cp, integrated exactly over the pressure drop, or from a known coefficient, giving the outlet temperature, the inversion temperature of the model, the inlet temperature that keeps the outlet at the lowest allowed temperature, and the preheat power for the gas flow, against the lowest acceptable outlet temperature.",
    "keywords": [
      "MAKEOS",
      "Joule–Thomson",
      "throttling",
      "regulator icing",
      "gas let-down",
      "preheat",
      "inversion temperature",
      "van der Waals"
    ],
    "fields": [
      {
        "key": "model",
        "label": "Joule–Thomson model",
        "type": "select",
        "default": "vdw",
        "options": [
          [
            "vdw",
            "van der Waals constants a and b"
          ],
          [
            "mu",
            "Known Joule–Thomson coefficient"
          ]
        ]
      },
      {
        "key": "a",
        "label": "van der Waals constant a",
        "type": "number",
        "default": 0.2303,
        "unit": "Pa·m⁶/mol²",
        "min": 0.000001,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "van der Waals constant b",
        "type": "number",
        "default": 43.1,
        "unit": "cm³/mol",
        "min": 0.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mu",
        "label": "Joule–Thomson coefficient (known model)",
        "type": "number",
        "default": 0.45,
        "unit": "K/bar",
        "min": -5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Cp",
        "label": "Molar heat capacity at constant pressure",
        "type": "number",
        "default": 35.7,
        "unit": "J/(mol·K)",
        "min": 10,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_throttle",
        "label": "Throttling",
        "type": "heading"
      },
      {
        "key": "p1",
        "label": "Inlet pressure",
        "type": "number",
        "default": 70,
        "unit": "bar abs",
        "min": 0.01,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Outlet pressure",
        "type": "number",
        "default": 7,
        "unit": "bar abs",
        "min": 0.01,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Inlet temperature",
        "type": "number",
        "default": 15,
        "unit": "°C",
        "min": -150,
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
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Q",
        "label": "Gas flow at 15 °C and 101.325 kPa",
        "type": "number",
        "default": 1000,
        "unit": "Sm³/h",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "filter-bubble-point-check",
    "name": "Filter Membrane Bubble Point Check (Integrity Test, Largest Pore, Other Wetting Liquid)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Does the bubble point I measured on this wetted filter membrane meet the maker’s minimum, corrected for my wetting liquid, and what largest pore size does it point to?",
    "description": "Bubble point integrity check of a wetted membrane filter by the Young–Laplace capillary relation: the maker’s minimum bubble point converted to the wetting liquid actually used in proportion to surface tension (both liquids fully wetting), the margin of the measured bubble point over it, and the equivalent largest capillary pore diameter 4 k γ ÷ Δp at the measured and at the minimum bubble point, against the converted minimum.",
    "keywords": [
      "MAKEOS",
      "bubble point",
      "filter integrity test",
      "membrane filter",
      "pore size",
      "surface tension",
      "Young–Laplace",
      "sterile filtration"
    ],
    "fields": [
      {
        "key": "pb",
        "label": "Measured bubble point",
        "type": "number",
        "default": 3.45,
        "unit": "bar",
        "min": 0.001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pmin",
        "label": "Maker’s minimum bubble point",
        "type": "number",
        "default": 3.2,
        "unit": "bar",
        "min": 0.001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gr",
        "label": "Surface tension of the maker’s test liquid",
        "type": "number",
        "default": 72,
        "unit": "mN/m",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gt",
        "label": "Surface tension of your wetting liquid",
        "type": "number",
        "default": 72,
        "unit": "mN/m",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Pore shape correction factor",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.1,
        "max": 1.5,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "gas-separation-energy-check",
    "name": "Gas Separation Energy Check (Ideal Mixing, Least Work, Nitrogen Generator Efficiency)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "What is the least energy any machine could use to separate this product purity from air, how does my nitrogen generator’s actual energy compare, and is it within my target?",
    "description": "Second-law benchmark of a gas separator such as a nitrogen generator: the waste-stream composition from a balance on the wanted gas, the recovery, the least separation work from the Gibbs energy of ideal mixing RT Σ x ln x of the product and waste less that of the feed, the least work for the same purity at a very large feed ratio, the second-law efficiency of the actual specific energy, and the yearly energy and cost (excluding GST), against the target specific energy.",
    "keywords": [
      "MAKEOS",
      "nitrogen generator",
      "gas separation",
      "minimum work",
      "Gibbs energy of mixing",
      "second-law efficiency",
      "specific energy",
      "PSA"
    ],
    "fields": [
      {
        "key": "xF",
        "label": "Wanted gas in the feed",
        "type": "number",
        "default": 79,
        "unit": "%",
        "min": 0.01,
        "max": 99.99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "xP",
        "label": "Product purity",
        "type": "number",
        "default": 99,
        "unit": "%",
        "min": 0.01,
        "max": 99.9999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "AF",
        "label": "Feed per unit of product (air factor)",
        "type": "number",
        "default": 3,
        "unit": "mol/mol",
        "min": 1.0001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Ambient temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -50,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_plant",
        "label": "Plant and energy",
        "type": "heading"
      },
      {
        "key": "Q",
        "label": "Product flow",
        "type": "number",
        "default": 100,
        "unit": "Nm³/h",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Eact",
        "label": "Actual specific energy",
        "type": "number",
        "default": 0.25,
        "unit": "kWh/Nm³",
        "min": 0.0001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Etgt",
        "label": "Target specific energy",
        "type": "number",
        "default": 0.3,
        "unit": "kWh/Nm³",
        "min": 0.0001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hrs",
        "label": "Running hours per year",
        "type": "number",
        "default": 4000,
        "unit": "h",
        "min": 0,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Electricity price (excluding GST)",
        "type": "number",
        "default": 0.25,
        "unit": "AUD/kWh",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
