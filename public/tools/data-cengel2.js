// KEVOS® MAKEOS: engineering thermodynamics tools, second Çengel batch (cengel2) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "rankine-cycle-check",
    "name": "Steam Rankine Cycle Check (Efficiency, Steam Flow, Heat Rate, Turbine Exhaust Dryness)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "From steam-table values for the boiler outlet and condenser, what thermal efficiency, steam flow, heat rate and boiler and condenser duties does this steam cycle give for the power needed, and is the steam leaving the turbine dry enough?",
    "description": "Simple Rankine cycle with a feed pump and turbine of the isentropic efficiencies you enter: the pump work from the liquid specific volume and pressure rise, the turbine work from the isentropic enthalpy drop, the net work, the heat added in the boiler and rejected in the condenser, the thermal efficiency, the back-work ratio, the heat rate, the steam flow and boiler and condenser duties for the net power, and the dryness (quality) of the turbine exhaust against the minimum you set.",
    "keywords": [
      "MAKEOS",
      "Rankine cycle",
      "steam turbine",
      "steam power plant",
      "heat rate",
      "turbine exhaust quality",
      "condenser duty",
      "feed pump",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "h_turbine_inlet",
        "label": "Boiler outlet and turbine",
        "type": "heading"
      },
      {
        "key": "Pb",
        "label": "Boiler (turbine inlet) pressure (absolute)",
        "type": "number",
        "default": 3000,
        "unit": "kPa",
        "min": 20,
        "max": 40000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h3",
        "label": "Steam enthalpy at the turbine inlet",
        "type": "number",
        "default": 3116.1,
        "unit": "kJ/kg",
        "min": 100,
        "max": 4500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h4s",
        "label": "Enthalpy after isentropic expansion to the condenser pressure",
        "type": "number",
        "default": 2136.1,
        "unit": "kJ/kg",
        "min": 100,
        "max": 4500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etat",
        "label": "Turbine isentropic efficiency",
        "type": "number",
        "default": 87,
        "unit": "%",
        "min": 20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_condenser_saturation_values",
        "label": "Condenser (saturation values at condenser pressure)",
        "type": "heading"
      },
      {
        "key": "Pc",
        "label": "Condenser pressure (absolute)",
        "type": "number",
        "default": 10,
        "unit": "kPa",
        "min": 0.7,
        "max": 20000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hf",
        "label": "Saturated liquid enthalpy at condenser pressure",
        "type": "number",
        "default": 191.81,
        "unit": "kJ/kg",
        "min": 0,
        "max": 2100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hfg",
        "label": "Enthalpy of vaporisation at condenser pressure",
        "type": "number",
        "default": 2392.1,
        "unit": "kJ/kg",
        "min": 1,
        "max": 2600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vf",
        "label": "Saturated liquid specific volume at condenser pressure",
        "type": "number",
        "default": 0.00101,
        "unit": "m³/kg",
        "min": 0.0009,
        "max": 0.004,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etap",
        "label": "Feed pump isentropic efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_duty_and_limit",
        "label": "Duty and limit",
        "type": "heading"
      },
      {
        "key": "Pnet",
        "label": "Net power required",
        "type": "number",
        "default": 5000,
        "unit": "kW",
        "min": 0.1,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "xmin",
        "label": "Minimum dryness at the turbine exhaust",
        "type": "number",
        "default": 0.85,
        "unit": "",
        "min": 0.5,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "steam-dryness-throttling-check",
    "name": "Wet Steam Dryness by Throttling Calorimeter (Dryness Fraction, Calorimeter Validity)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "From a throttling calorimeter reading, what is the dryness fraction of the wet steam in the line, is the reading valid (steam superheated after throttling), and is the steam as dry as the process needs?",
    "description": "Throttling calorimeter analysis of wet steam: a sample is throttled at constant enthalpy to a low pressure where it becomes superheated, so its enthalpy follows from the measured calorimeter pressure and temperature; the dryness fraction of the line steam is then the enthalpy above saturated liquid divided by the enthalpy of vaporisation at line pressure. The tool checks that the calorimeter steam is superheated by the margin you set (otherwise the steam is too wet for this method), reports the moisture content, and compares the dryness with the minimum you need.",
    "keywords": [
      "MAKEOS",
      "steam dryness fraction",
      "steam quality",
      "throttling calorimeter",
      "wet steam",
      "process steam",
      "moisture in steam",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "h_line_steam_saturation_values_",
        "label": "Line steam (saturation values at line pressure)",
        "type": "heading"
      },
      {
        "key": "P1",
        "label": "Line pressure (absolute)",
        "type": "number",
        "default": 1000,
        "unit": "kPa",
        "min": 110,
        "max": 22000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hf1",
        "label": "Saturated liquid enthalpy at line pressure",
        "type": "number",
        "default": 762.51,
        "unit": "kJ/kg",
        "min": 0,
        "max": 2100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "hfg1",
        "label": "Enthalpy of vaporisation at line pressure",
        "type": "number",
        "default": 2014.6,
        "unit": "kJ/kg",
        "min": 1,
        "max": 2600,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_calorimeter_reading",
        "label": "Calorimeter reading",
        "type": "heading"
      },
      {
        "key": "P2",
        "label": "Calorimeter pressure (absolute)",
        "type": "number",
        "default": 100,
        "unit": "kPa",
        "min": 1,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Steam temperature in the calorimeter",
        "type": "number",
        "default": 150,
        "unit": "°C",
        "min": 0,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tsat2",
        "label": "Saturation temperature at calorimeter pressure",
        "type": "number",
        "default": 99.61,
        "unit": "°C",
        "min": 0,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h2",
        "label": "Superheated steam enthalpy at calorimeter pressure and temperature",
        "type": "number",
        "default": 2776.6,
        "unit": "kJ/kg",
        "min": 2400,
        "max": 3300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_limits",
        "label": "Limits",
        "type": "heading"
      },
      {
        "key": "sup",
        "label": "Least superheat for a valid reading",
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
        "key": "xreq",
        "label": "Minimum dryness fraction required",
        "type": "number",
        "default": 0.97,
        "unit": "",
        "min": 0.5,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cogeneration-saving-check",
    "name": "Cogeneration (CHP) Utilisation and Primary Energy Saving Check",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For a combined heat and power plant with this fuel input, electrical output and useful heat, what is its utilisation factor and power-to-heat ratio, how much fuel would separate power and heat production use, and does it save the share of primary energy you require?",
    "description": "Energy performance of a cogeneration (combined heat and power) plant: the electrical and heat efficiencies, the utilisation factor (useful power plus useful heat over fuel energy), the power-to-heat ratio, the fuel that separate production would need at the reference electrical and heat efficiencies you enter, the fuel saved and the primary energy saving, and, over the running hours, the energy amounts, against the saving you require.",
    "keywords": [
      "MAKEOS",
      "cogeneration",
      "CHP",
      "combined heat and power",
      "utilisation factor",
      "primary energy saving",
      "power to heat ratio",
      "trigeneration",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "Qf",
        "label": "Fuel energy input rate",
        "type": "number",
        "default": 2500,
        "unit": "kW",
        "min": 1,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "We",
        "label": "Net electrical output",
        "type": "number",
        "default": 900,
        "unit": "kW",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qh",
        "label": "Useful heat delivered to the process or buildings",
        "type": "number",
        "default": 1100,
        "unit": "kW",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_reference_separate_production",
        "label": "Reference separate production",
        "type": "heading"
      },
      {
        "key": "etaE",
        "label": "Reference efficiency of separate power generation",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 5,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etaH",
        "label": "Reference efficiency of separate heat production (boiler)",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 5,
        "max": 110,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_target_and_hours",
        "label": "Target and hours",
        "type": "heading"
      },
      {
        "key": "pesReq",
        "label": "Primary energy saving required",
        "type": "number",
        "default": 10,
        "unit": "%",
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
        "default": 6000,
        "unit": "h/year",
        "min": 0,
        "max": 8784,
        "step": "any",
        "integer": false,
        "sens": false
      }
    ]
  },
  {
    "id": "air-stream-mixing-check",
    "name": "Adiabatic Mixing of Two Air Streams (Mixed Temperature, Humidity, Dew Point, Fog Risk)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "When outdoor and return air (or any two moist-air streams) mix without heat transfer, what temperature, humidity ratio, relative humidity and dew point does the mixed air have, and does the mixture stay clear of fog?",
    "description": "Steady adiabatic mixing of two moist-air streams: the humidity ratio, enthalpy and dry-air mass flow of each stream from its temperature, relative humidity and volume flow (Hyland–Wexler saturation pressure), the mixed humidity ratio and enthalpy as dry-air mass-weighted averages, the mixed dry-bulb temperature, relative humidity and dew point, the outdoor-air share by mass, and a check that the mixed air stays below saturation (no fog) with the margin you set.",
    "keywords": [
      "MAKEOS",
      "air mixing",
      "mixed air temperature",
      "outdoor air",
      "return air",
      "psychrometric",
      "economiser",
      "fog",
      "AHU",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Total (barometric) pressure",
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
        "key": "h_stream_1_for_example_outdoor_air_",
        "label": "Stream 1 (for example outdoor air)",
        "type": "heading"
      },
      {
        "key": "T1",
        "label": "Stream 1 dry-bulb temperature",
        "type": "number",
        "default": 5,
        "unit": "°C",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RH1",
        "label": "Stream 1 relative humidity",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V1",
        "label": "Stream 1 volume flow",
        "type": "number",
        "default": 0.5,
        "unit": "m³/s",
        "min": 0,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_stream_2_for_example_return_air_",
        "label": "Stream 2 (for example return air)",
        "type": "heading"
      },
      {
        "key": "T2",
        "label": "Stream 2 dry-bulb temperature",
        "type": "number",
        "default": 22,
        "unit": "°C",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RH2",
        "label": "Stream 2 relative humidity",
        "type": "number",
        "default": 50,
        "unit": "%",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V2",
        "label": "Stream 2 volume flow",
        "type": "number",
        "default": 1.5,
        "unit": "m³/s",
        "min": 0,
        "max": 1000,
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
        "key": "rhMax",
        "label": "Highest acceptable mixed relative humidity",
        "type": "number",
        "default": 90,
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
    "id": "evaporative-cooler-check",
    "name": "Direct Evaporative Cooler Check (Wet-Bulb, Supply Temperature, Water Use, Cooling Capacity)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "How cool will a direct evaporative cooler make this air, how much water will it evaporate and how much sensible cooling will it give, and will it reach the supply temperature you need?",
    "description": "Direct evaporative (swamp) cooler as an adiabatic saturation process: the wet-bulb temperature of the entering air from the adiabatic saturation energy balance (Hyland–Wexler saturation pressure), the leaving dry-bulb temperature from the saturation effectiveness, the leaving humidity ratio and relative humidity at constant enthalpy, the dry-air mass flow, the water evaporated, the sensible cooling of the air, and the leaving temperature against the supply temperature you need.",
    "keywords": [
      "MAKEOS",
      "evaporative cooling",
      "swamp cooler",
      "wet-bulb temperature",
      "saturation effectiveness",
      "adiabatic cooling",
      "water consumption",
      "industrial cooling",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Total (barometric) pressure",
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
        "key": "T1",
        "label": "Entering air dry-bulb temperature",
        "type": "number",
        "default": 38,
        "unit": "°C",
        "min": 1,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RH1",
        "label": "Entering air relative humidity",
        "type": "number",
        "default": 20,
        "unit": "%",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V",
        "label": "Air volume flow entering the cooler",
        "type": "number",
        "default": 3,
        "unit": "m³/s",
        "min": 0.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Saturation effectiveness of the cooler pads",
        "type": "number",
        "default": 80,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Treq",
        "label": "Supply temperature needed",
        "type": "number",
        "default": 26,
        "unit": "°C",
        "min": -10,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "heating-humidification-check",
    "name": "Heating with Humidification (Heater Load, Water or Steam Needed, Equipment Check)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "To bring cold, dry air to the temperature and humidity you need, how much heat must the heater supply and how much water or steam must the humidifier add, and are the heater and humidifier big enough?",
    "description": "Steady-flow mass and energy balance for heating moist air and adding moisture: the humidity ratio and enthalpy of the entering and leaving air (Hyland–Wexler saturation pressure), the dry-air mass flow from the entering volume flow, the water the humidifier must add, the enthalpy that water brings in as steam or as liquid spray, the heater load that remains, and both against the heater and humidifier capacities you enter.",
    "keywords": [
      "MAKEOS",
      "humidification",
      "steam humidifier",
      "heating coil",
      "winter air conditioning",
      "cleanroom humidity",
      "psychrometric",
      "AHU",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "P",
        "label": "Total (barometric) pressure",
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
        "key": "V1",
        "label": "Air volume flow entering",
        "type": "number",
        "default": 1,
        "unit": "m³/s",
        "min": 0.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_air_entering",
        "label": "Air entering",
        "type": "heading"
      },
      {
        "key": "T1",
        "label": "Entering dry-bulb temperature",
        "type": "number",
        "default": 5,
        "unit": "°C",
        "min": 0,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RH1",
        "label": "Entering relative humidity",
        "type": "number",
        "default": 40,
        "unit": "%",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_air_leaving",
        "label": "Air leaving",
        "type": "heading"
      },
      {
        "key": "T3",
        "label": "Leaving dry-bulb temperature",
        "type": "number",
        "default": 22,
        "unit": "°C",
        "min": 0,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RH3",
        "label": "Leaving relative humidity",
        "type": "number",
        "default": 45,
        "unit": "%",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_humidifier_and_capacities",
        "label": "Humidifier and capacities",
        "type": "heading"
      },
      {
        "key": "kind",
        "label": "Humidifier type",
        "type": "select",
        "default": "steam",
        "options": [
          [
            "steam",
            "Steam injection"
          ],
          [
            "spray",
            "Water spray or evaporative pad (adiabatic)"
          ]
        ]
      },
      {
        "key": "hw",
        "label": "Enthalpy of the steam or water added",
        "type": "number",
        "default": 2675,
        "unit": "kJ/kg",
        "min": 0,
        "max": 3500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Qcap",
        "label": "Heater capacity",
        "type": "number",
        "default": 25,
        "unit": "kW",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Mcap",
        "label": "Humidifier capacity",
        "type": "number",
        "default": 30,
        "unit": "kg/h",
        "min": 0,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
