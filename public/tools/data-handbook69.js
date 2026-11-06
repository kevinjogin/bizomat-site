// BIZOMAT MAKEOS: thermodynamics tools from Fermi’s Thermodynamics (batch handbook69) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "vapour-pressure-boiling-check",
    "name": "Vapour Pressure and Boiling Check (Clausius–Clapeyron, Boiling Point at Pressure, Margin)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "At this pressure, at what temperature will the liquid boil, what is its vapour pressure at the working temperature, and is there enough margin to stop it boiling or flashing?",
    "description": "Vapour pressure and boiling point of a liquid from one known point on its vapour-pressure curve and its latent heat, by the integrated Clausius–Clapeyron equation (vapour treated as an ideal gas, liquid volume neglected, latent heat constant): the boiling temperature at the working pressure, the vapour pressure at the liquid temperature (the value the NPSH tools ask for), the slope of the curve, and the margin between the liquid temperature and the boiling point, against the margin you require.",
    "keywords": [
      "MAKEOS",
      "vapour pressure",
      "boiling point",
      "Clausius-Clapeyron",
      "vacuum degassing",
      "flashing",
      "NPSH"
    ],
    "fields": [
      {
        "key": "h_known_point_on_the_vapour_pressure_curve",
        "label": "Known point on the vapour-pressure curve",
        "type": "heading"
      },
      {
        "key": "T1",
        "label": "Reference temperature",
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
        "key": "p1",
        "label": "Vapour pressure at the reference temperature",
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
        "min": 0.000001,
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
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_working_condition",
        "label": "Working condition",
        "type": "heading"
      },
      {
        "key": "p",
        "label": "Working pressure on the liquid",
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
        "key": "Tw",
        "label": "Liquid temperature",
        "type": "number",
        "default": 45,
        "unit": "°C",
        "min": -200,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Margin required below the boiling point",
        "type": "number",
        "default": 10,
        "unit": "K",
        "min": 0,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "real-gas-cylinder-contents",
    "name": "Real Gas Cylinder Contents Check (Van der Waals, Compressibility, Ideal-Gas Error)",
    "category": "Pneumatics",
    "collection": "MAKEOS",
    "question": "How much gas is really in this cylinder or receiver at its pressure and temperature, how far off is the ideal-gas estimate, and is it enough for the job?",
    "description": "Contents of a gas cylinder, bank or receiver by the van der Waals equation of state with the gas constants you enter: the molar volume from the gas root of the cubic, the moles and mass held, the compressibility factor, the ideal-gas mass and its error, and the critical temperature and pressure implied by the constants (with a warning below the critical temperature, where the gas may condense), against the mass you need.",
    "keywords": [
      "MAKEOS",
      "van der Waals",
      "real gas",
      "compressibility factor",
      "gas cylinder",
      "cylinder contents",
      "high pressure gas"
    ],
    "fields": [
      {
        "key": "V",
        "label": "Internal (water) volume",
        "type": "number",
        "default": 50,
        "unit": "L",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "pg",
        "label": "Gauge pressure",
        "type": "number",
        "default": 200,
        "unit": "bar",
        "min": 0,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T",
        "label": "Gas temperature",
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
        "key": "patm",
        "label": "Atmospheric pressure",
        "type": "number",
        "default": 101.325,
        "unit": "kPa",
        "min": 50,
        "max": 110,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_gas_constants_from_data_tables_",
        "label": "Gas constants (from data tables)",
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
        "key": "a",
        "label": "Van der Waals constant a",
        "type": "number",
        "default": 0.137,
        "unit": "Pa·m⁶/mol²",
        "min": 0,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Van der Waals constant b",
        "type": "number",
        "default": 38.7,
        "unit": "cm³/mol",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_requirement",
        "label": "Requirement",
        "type": "heading"
      },
      {
        "key": "mreq",
        "label": "Mass of gas needed",
        "type": "number",
        "default": 10,
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
    "id": "ro-pressure-check",
    "name": "Reverse Osmosis Pressure Check (Osmotic Pressure, Net Driving Pressure, Permeate Flow)",
    "category": "Hydraulics",
    "collection": "MAKEOS",
    "question": "For a reverse osmosis unit on this feed water, how much osmotic pressure must the pump overcome, what net driving pressure is left, will the concentrate end still produce water, and does it make the permeate flow I need?",
    "description": "Pressure check of a reverse osmosis system: the feed osmotic pressure of a dilute solution from van ’t Hoff’s law with the dissolved solids, molar mass and dissociation factor you enter, the feed-side mean osmotic pressure from the log-mean concentration factor at the recovery, the net driving pressure, the osmotic and net driving pressure at the concentrate end, the permeate flow from the membrane water permeability and area, and the feed pressure needed for the permeate flow you want.",
    "keywords": [
      "MAKEOS",
      "reverse osmosis",
      "osmotic pressure",
      "net driving pressure",
      "RO membrane",
      "recovery",
      "water treatment"
    ],
    "fields": [
      {
        "key": "h_feed_water",
        "label": "Feed water",
        "type": "heading"
      },
      {
        "key": "Cf",
        "label": "Dissolved solids in the feed",
        "type": "number",
        "default": 2000,
        "unit": "mg/L",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ms",
        "label": "Molar mass of the dissolved salt",
        "type": "number",
        "default": 58.44,
        "unit": "g/mol",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "i",
        "label": "Dissociation (van ’t Hoff) factor",
        "type": "number",
        "default": 1.8,
        "unit": "",
        "min": 0.1,
        "max": 10,
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
        "key": "h_system",
        "label": "System",
        "type": "heading"
      },
      {
        "key": "rec",
        "label": "Recovery (permeate ÷ feed)",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 1,
        "max": 99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pf",
        "label": "Feed pressure",
        "type": "number",
        "default": 15,
        "unit": "bar gauge",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dP",
        "label": "Pressure drop, feed to concentrate",
        "type": "number",
        "default": 1.5,
        "unit": "bar",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pp",
        "label": "Permeate pressure",
        "type": "number",
        "default": 0.5,
        "unit": "bar gauge",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Membrane water permeability",
        "type": "number",
        "default": 3,
        "unit": "L/(m²·h·bar)",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Am",
        "label": "Total membrane area",
        "type": "number",
        "default": 222,
        "unit": "m²",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qreq",
        "label": "Permeate flow needed",
        "type": "number",
        "default": 4,
        "unit": "m³/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "battery-heat-check",
    "name": "Battery Pack Heat Check (Irreversible and Reversible Heat, Temperature Rise, Cooling)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "How much heat does this battery pack make while charging or discharging at this current, how much of it is reversible, and how hot will it get with the cooling it has?",
    "description": "Heat generation of a battery pack by Bernardi’s energy balance: the irreversible (resistive) heat I²R in each cell, the reversible (entropic) heat from the cell’s open-circuit voltage temperature coefficient, which the reversible-cell equation of Helmholtz relates to the heat the cell exchanges with its surroundings, the pack total, the heat left after cooling, and the temperature rise over the duty with the cells’ heat capacity, against the largest rise you allow, with the cooling needed to stay within it.",
    "keywords": [
      "MAKEOS",
      "battery heat",
      "entropic heat",
      "Bernardi",
      "battery thermal management",
      "lithium-ion",
      "forklift battery"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Operation",
        "type": "select",
        "default": "dis",
        "options": [
          [
            "dis",
            "Discharging"
          ],
          [
            "chg",
            "Charging"
          ]
        ]
      },
      {
        "key": "I",
        "label": "Current through each cell",
        "type": "number",
        "default": 60,
        "unit": "A",
        "min": 0,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Rint",
        "label": "Cell internal resistance",
        "type": "number",
        "default": 1.5,
        "unit": "mΩ",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dUdT",
        "label": "Entropic coefficient (dU/dT of open-circuit voltage)",
        "type": "number",
        "default": 0.1,
        "unit": "mV/K",
        "min": -5,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Cell temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -40,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_pack_and_duty",
        "label": "Pack and duty",
        "type": "heading"
      },
      {
        "key": "Nc",
        "label": "Cells in the pack",
        "type": "number",
        "default": 100,
        "unit": "cells",
        "min": 1,
        "max": 100000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "mc",
        "label": "Mass of each cell",
        "type": "number",
        "default": 1,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Specific heat of the cells",
        "type": "number",
        "default": 1000,
        "unit": "J/(kg·K)",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t",
        "label": "Duration of the duty",
        "type": "number",
        "default": 30,
        "unit": "min",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Pcool",
        "label": "Heat removed by cooling",
        "type": "number",
        "default": 200,
        "unit": "W",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTmax",
        "label": "Largest temperature rise allowed",
        "type": "number",
        "default": 15,
        "unit": "K",
        "min": 0.000001,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "heat-pump-cop-check",
    "name": "Heat Pump and Chiller COP Check (Carnot Limit, Second-Law Efficiency, Running Cost)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "Is the COP claimed or measured for this heat pump or chiller possible at these temperatures, how close is it to the Carnot limit, and what does it cost to run?",
    "description": "Check of a heat pump or chiller’s coefficient of performance against the second law: evaporating and condensing temperatures from the source and sink temperatures and the approach temperatures you enter, the Carnot (reversible) COP for heating or cooling, the actual COP from the duty and electrical input, the second-law efficiency, the yearly electricity cost, and the input power at your minimum efficiency, against the Carnot limit and the minimum efficiency you accept.",
    "keywords": [
      "MAKEOS",
      "heat pump COP",
      "chiller COP",
      "Carnot",
      "second-law efficiency",
      "refrigeration",
      "running cost"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Duty",
        "type": "select",
        "default": "heat",
        "options": [
          [
            "heat",
            "Heating (heat delivered to the sink)"
          ],
          [
            "cool",
            "Cooling (heat taken from the source)"
          ]
        ]
      },
      {
        "key": "Tsrc",
        "label": "Source (cold-side) temperature",
        "type": "number",
        "default": 7,
        "unit": "°C",
        "min": -100,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tsink",
        "label": "Sink (hot-side) temperature",
        "type": "number",
        "default": 45,
        "unit": "°C",
        "min": -100,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTe",
        "label": "Evaporator approach (source minus evaporating)",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "dTc",
        "label": "Condenser approach (condensing minus sink)",
        "type": "number",
        "default": 5,
        "unit": "K",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_performance_and_cost",
        "label": "Performance and cost",
        "type": "heading"
      },
      {
        "key": "Q",
        "label": "Duty (heating or cooling output)",
        "type": "number",
        "default": 50,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Electrical input",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etaMin",
        "label": "Lowest second-law efficiency accepted",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Electricity price (incl. GST)",
        "type": "number",
        "default": 0.3,
        "unit": "AUD/kWh",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hrs",
        "label": "Running hours per year",
        "type": "number",
        "default": 2000,
        "unit": "h/year",
        "min": 0,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "waste-heat-recovery-limit",
    "name": "Waste Heat Recovery Limit Check (Heat Released, Exergy, Claimed Power against the Second-Law Limit)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "How much heat does this waste stream give up, what is the most power any machine could make from it, and is the power claimed for a heat recovery unit believable?",
    "description": "Second-law limit on power recovered from a waste heat stream cooled from one temperature to another: the heat released, the exergy (the most work any reversible machine could make, integrating the Carnot efficiency over the cooling with the surroundings as the cold reservoir), the mean Carnot efficiency, the claimed power as a share of the heat and of the exergy, and the yearly value of the claimed power, against the exergy and the largest share of it you consider realistic.",
    "keywords": [
      "MAKEOS",
      "waste heat recovery",
      "exergy",
      "second law",
      "Carnot",
      "organic Rankine cycle",
      "heat to power"
    ],
    "fields": [
      {
        "key": "mdot",
        "label": "Mass flow of the stream",
        "type": "number",
        "default": 1.5,
        "unit": "kg/s",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "cp",
        "label": "Specific heat of the stream",
        "type": "number",
        "default": 4.18,
        "unit": "kJ/(kg·K)",
        "min": 0.000001,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Stream temperature in",
        "type": "number",
        "default": 90,
        "unit": "°C",
        "min": -50,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Stream temperature out (after recovery)",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": -50,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T0",
        "label": "Surroundings (cooling) temperature",
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
        "key": "h_claim",
        "label": "Claim",
        "type": "heading"
      },
      {
        "key": "W",
        "label": "Power claimed",
        "type": "number",
        "default": 15,
        "unit": "kW",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "share",
        "label": "Largest realistic share of the exergy",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hrs",
        "label": "Running hours per year",
        "type": "number",
        "default": 6000,
        "unit": "h/year",
        "min": 0,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "price",
        "label": "Value of electricity (incl. GST)",
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
  }
]);
