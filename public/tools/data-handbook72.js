// KEVOS® MAKEOS: engineering thermodynamics tools (batch handbook72) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "otto-diesel-cycle-check",
    "name": "Air-Standard Otto and Diesel Cycle Check (Efficiency, Net Work, Mean Effective Pressure, Peak Pressure)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What thermal efficiency, net work, mean effective pressure and peak cylinder pressure does the ideal Otto or Diesel cycle give for this compression ratio, and is the peak pressure within the limit?",
    "description": "Cold-air-standard analysis of the ideal Otto (constant-volume heat addition) or Diesel (constant-pressure heat addition) cycle: the temperature and pressure at the end of isentropic compression, after heat addition and after expansion, the heat added and rejected per kilogram of air, the net work, the thermal efficiency, the mean effective pressure and the Carnot efficiency between the lowest and highest temperatures, with the peak pressure checked against the limit you enter.",
    "keywords": [
      "MAKEOS",
      "Otto cycle",
      "Diesel cycle",
      "air-standard cycle",
      "compression ratio",
      "cutoff ratio",
      "mean effective pressure",
      "thermal efficiency",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "cycle",
        "label": "Ideal cycle",
        "type": "select",
        "default": "otto",
        "options": [
          [
            "otto",
            "Otto (spark ignition, heat added at constant volume)"
          ],
          [
            "diesel",
            "Diesel (compression ignition, heat added at constant pressure)"
          ]
        ]
      },
      {
        "key": "r",
        "label": "Compression ratio (V₁ ÷ V₂)",
        "type": "number",
        "default": 10,
        "unit": ":1",
        "min": 1.5,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "qin",
        "label": "Heat added per kilogram of air (Otto)",
        "type": "number",
        "default": 1600,
        "unit": "kJ/kg",
        "min": 1,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rc",
        "label": "Cutoff ratio (V₃ ÷ V₂, Diesel)",
        "type": "number",
        "default": 2,
        "unit": ":1",
        "min": 1.01,
        "max": 10,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_state_at_the_start_of_compression",
        "label": "State at the start of compression",
        "type": "heading"
      },
      {
        "key": "P1",
        "label": "Pressure at the start of compression (absolute)",
        "type": "number",
        "default": 100,
        "unit": "kPa",
        "min": 10,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Temperature at the start of compression",
        "type": "number",
        "default": 30,
        "unit": "°C",
        "min": -50,
        "max": 300,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Specific heat ratio of the working gas (cp ÷ cv)",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1.05,
        "max": 1.67,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "R",
        "label": "Gas constant of the working gas",
        "type": "number",
        "default": 0.287,
        "unit": "kJ/kg·K",
        "min": 0.05,
        "max": 5,
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
        "key": "Pmax",
        "label": "Allowable peak cylinder pressure (absolute)",
        "type": "number",
        "default": 12000,
        "unit": "kPa",
        "min": 100,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "brayton-regenerator-check",
    "name": "Gas Turbine (Brayton) Cycle Check with Regenerator (Net Power, Back-Work Ratio, Efficiency)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What net power, back-work ratio and thermal efficiency does this gas-turbine cycle give with real compressor and turbine efficiencies, how much does a regenerator add, and does the net power meet the demand?",
    "description": "Cold-air-standard Brayton cycle with isentropic efficiencies for the compressor and turbine: the compressor and turbine exit temperatures, the compressor, turbine and net work per kilogram, the back-work ratio, the thermal efficiency with and without a regenerator of the effectiveness you enter, the air temperature leaving the regenerator, the exhaust temperature, the heat input and the net power for the air flow, against the power required.",
    "keywords": [
      "MAKEOS",
      "Brayton cycle",
      "gas turbine",
      "regenerator",
      "recuperator",
      "back-work ratio",
      "pressure ratio",
      "isentropic efficiency",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "T1",
        "label": "Compressor inlet temperature",
        "type": "number",
        "default": 15,
        "unit": "°C",
        "min": -50,
        "max": 200,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rp",
        "label": "Compressor pressure ratio (P₂ ÷ P₁)",
        "type": "number",
        "default": 10,
        "unit": ":1",
        "min": 1.1,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T3",
        "label": "Turbine inlet temperature",
        "type": "number",
        "default": 1100,
        "unit": "°C",
        "min": 100,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etac",
        "label": "Compressor isentropic efficiency",
        "type": "number",
        "default": 85,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etat",
        "label": "Turbine isentropic efficiency",
        "type": "number",
        "default": 88,
        "unit": "%",
        "min": 30,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eps",
        "label": "Regenerator effectiveness (0 = no regenerator)",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_gas_and_flow",
        "label": "Gas and flow",
        "type": "heading"
      },
      {
        "key": "cp",
        "label": "Specific heat of the gas at constant pressure",
        "type": "number",
        "default": 1.005,
        "unit": "kJ/kg·K",
        "min": 0.5,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Specific heat ratio of the gas (cp ÷ cv)",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1.05,
        "max": 1.67,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mdot",
        "label": "Air mass flow",
        "type": "number",
        "default": 5,
        "unit": "kg/s",
        "min": 0.001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_demand",
        "label": "Demand",
        "type": "heading"
      },
      {
        "key": "Preq",
        "label": "Net power required",
        "type": "number",
        "default": 1200,
        "unit": "kW",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "vapour-compression-cycle-check",
    "name": "Vapour-Compression Refrigeration or Heat Pump Cycle Check (COP from State Enthalpies, Carnot Limit)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "From the refrigerant enthalpies at the compressor inlet, isentropic discharge and condenser outlet, what refrigerant flow, compressor power and COP does this cycle give, how close is it to the Carnot limit, and does it meet the COP you need?",
    "description": "Single-stage vapour-compression cycle with an adiabatic throttling valve: the refrigerating effect, the actual compressor work from its isentropic efficiency, the discharge enthalpy, the heat rejected, the refrigerant mass flow for the cooling or heating duty, the compressor power, the COP as a refrigerator and as a heat pump, the reversed-Carnot COP between the evaporating and condensing temperatures and the second-law efficiency, against the COP you require.",
    "keywords": [
      "MAKEOS",
      "vapour compression",
      "refrigeration cycle",
      "heat pump",
      "COP",
      "coefficient of performance",
      "Carnot",
      "refrigerant enthalpy",
      "chiller",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Duty you are sizing for",
        "type": "select",
        "default": "cool",
        "options": [
          [
            "cool",
            "Cooling (refrigerator, chiller or air conditioner)"
          ],
          [
            "heat",
            "Heating (heat pump)"
          ]
        ]
      },
      {
        "key": "Q",
        "label": "Cooling or heating duty",
        "type": "number",
        "default": 10,
        "unit": "kW",
        "min": 0.001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_refrigerant_state_enthalpies",
        "label": "Refrigerant state enthalpies (from tables or software, one reference state)",
        "type": "heading"
      },
      {
        "key": "h1",
        "label": "Enthalpy at the compressor inlet (evaporator outlet)",
        "type": "number",
        "default": 395,
        "unit": "kJ/kg",
        "min": -500,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h2s",
        "label": "Enthalpy after isentropic compression to condensing pressure",
        "type": "number",
        "default": 425,
        "unit": "kJ/kg",
        "min": -500,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h3",
        "label": "Enthalpy at the condenser outlet (before the expansion valve)",
        "type": "number",
        "default": 255,
        "unit": "kJ/kg",
        "min": -500,
        "max": 3000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etac",
        "label": "Compressor isentropic efficiency",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 20,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_temperatures_and_target",
        "label": "Temperatures and target",
        "type": "heading"
      },
      {
        "key": "Te",
        "label": "Evaporating temperature",
        "type": "number",
        "default": -10,
        "unit": "°C",
        "min": -100,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Tc",
        "label": "Condensing temperature",
        "type": "number",
        "default": 40,
        "unit": "°C",
        "min": -50,
        "max": 150,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "COPreq",
        "label": "COP required for the selected duty",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": 0.1,
        "max": 50,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "surface-dew-point-check",
    "name": "Moist Air Dew Point and Surface Condensation Check (Humidity Ratio, Enthalpy, Dew-Point Margin)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "At this air temperature, relative humidity and pressure, what are the dew point, humidity ratio and enthalpy of the air, and will a surface at this temperature stay dry with the margin you need?",
    "description": "Moist-air properties from the dry-bulb temperature, relative humidity and total pressure: the saturation pressure from the Hyland–Wexler equations (over water at or above 0 °C, over ice below), the vapour pressure, the humidity ratio, the enthalpy per kilogram of dry air, the specific volume, the dew point (frost point below 0 °C) and the relative humidity the air would have at the surface temperature, with the surface temperature checked against the dew point plus your margin.",
    "keywords": [
      "MAKEOS",
      "dew point",
      "condensation",
      "relative humidity",
      "humidity ratio",
      "psychrometrics",
      "sweating pipe",
      "frost point",
      "moist air enthalpy",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Air dry-bulb temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": 0,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RH",
        "label": "Relative humidity of the air",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
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
        "key": "h_surface",
        "label": "Surface",
        "type": "heading"
      },
      {
        "key": "Ts",
        "label": "Surface temperature",
        "type": "number",
        "default": 22,
        "unit": "°C",
        "min": -40,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Margin required above the dew point",
        "type": "number",
        "default": 3,
        "unit": "K",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "cooling-coil-dehumidification-check",
    "name": "Cooling Coil Load with Dehumidification (Psychrometric Balance, Condensate, Sensible Heat Ratio)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "What total cooling load, condensate flow and sensible heat ratio does it take to cool and dehumidify this air flow from the inlet to the outlet state, and can the coil you have deliver it?",
    "description": "Steady-flow mass and energy balance on a cooling coil that cools moist air below its dew point: the humidity ratio, enthalpy and dew point at the inlet and outlet from temperature, relative humidity and pressure (Hyland–Wexler saturation pressure), the dry-air mass flow from the inlet volume flow, the condensate removed, the total coil load allowing for the enthalpy of the condensate, the sensible part and the sensible heat ratio, against the coil’s rated capacity.",
    "keywords": [
      "MAKEOS",
      "cooling coil",
      "dehumidification",
      "psychrometric",
      "air conditioning",
      "condensate",
      "sensible heat ratio",
      "latent load",
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
        "label": "Air volume flow at the coil inlet",
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
        "key": "h_air_entering_the_coil",
        "label": "Air entering the coil",
        "type": "heading"
      },
      {
        "key": "T1",
        "label": "Inlet dry-bulb temperature",
        "type": "number",
        "default": 30,
        "unit": "°C",
        "min": 1,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RH1",
        "label": "Inlet relative humidity",
        "type": "number",
        "default": 60,
        "unit": "%",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_air_leaving_the_coil",
        "label": "Air leaving the coil",
        "type": "heading"
      },
      {
        "key": "T2",
        "label": "Outlet dry-bulb temperature",
        "type": "number",
        "default": 14,
        "unit": "°C",
        "min": 1,
        "max": 60,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "RH2",
        "label": "Outlet relative humidity",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_coil",
        "label": "Coil",
        "type": "heading"
      },
      {
        "key": "Qcoil",
        "label": "Rated total capacity of the coil at these conditions",
        "type": "number",
        "default": 40,
        "unit": "kW",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "combustion-air-flue-gas-check",
    "name": "Hydrocarbon Combustion Air and Flue Gas Check (Air–Fuel Ratio, Flue Analysis, Water Dew Point)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "For complete combustion of this hydrocarbon fuel with this excess air, what air–fuel ratio and air flow are needed, what dry flue oxygen and carbon dioxide will an analyser read, what is the water dew point of the flue gas, and does the flue stay above it?",
    "description": "Complete combustion of a hydrocarbon CₓHᵧ with dry air (3.76 mol of nitrogen per mol of oxygen): the theoretical oxygen, the stoichiometric and actual air–fuel ratio by mass, the air and flue-gas mass flows for the fuel flow, the wet mole fractions of the products, the dry-basis oxygen and carbon dioxide an analyser reads, the water vapour partial pressure and the water dew point of the flue gas, with the lowest flue or heat-exchanger surface temperature checked against the dew point plus your margin.",
    "keywords": [
      "MAKEOS",
      "combustion",
      "air-fuel ratio",
      "excess air",
      "flue gas",
      "dew point",
      "stoichiometric",
      "O2 trim",
      "condensing boiler",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "h_fuel_c_h_",
        "label": "Fuel CₓHᵧ",
        "type": "heading"
      },
      {
        "key": "x",
        "label": "Carbon atoms in the fuel molecule (x)",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0,
        "max": 30,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y",
        "label": "Hydrogen atoms in the fuel molecule (y)",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": 0.1,
        "max": 62,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mf",
        "label": "Fuel mass flow",
        "type": "number",
        "default": 10,
        "unit": "kg/h",
        "min": 0.001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_air_and_flue",
        "label": "Air and flue",
        "type": "heading"
      },
      {
        "key": "ex",
        "label": "Excess air",
        "type": "number",
        "default": 15,
        "unit": "%",
        "min": 0,
        "max": 400,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Flue gas total pressure (absolute)",
        "type": "number",
        "default": 101.325,
        "unit": "kPa",
        "min": 50,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ts",
        "label": "Lowest flue or heat-exchanger surface temperature",
        "type": "number",
        "default": 70,
        "unit": "°C",
        "min": 0,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "margin",
        "label": "Margin required above the dew point",
        "type": "number",
        "default": 10,
        "unit": "K",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "compressor-turbine-efficiency-check",
    "name": "Gas Compressor or Turbine Isentropic Efficiency from Measured Temperatures (Power, Entropy Generation)",
    "category": "Engineering",
    "collection": "MAKEOS",
    "question": "From the measured inlet and outlet pressures and temperatures of an uncooled gas compressor, blower or turbine, what is its isentropic efficiency, shaft power and entropy generation, and does the efficiency meet the minimum you expect?",
    "description": "Ideal-gas, adiabatic, steady-flow test analysis of a compressor or turbine: the isentropic outlet temperature for the measured pressure ratio, the isentropic efficiency from the measured temperature change, the gas power absorbed or delivered for the mass flow, the specific entropy change and the entropy generation rate, with the efficiency checked against your minimum and against the physical limit of 100 %.",
    "keywords": [
      "MAKEOS",
      "isentropic efficiency",
      "compressor test",
      "blower",
      "turbine",
      "expander",
      "discharge temperature",
      "entropy generation",
      "performance test",
      "thermodynamics"
    ],
    "fields": [
      {
        "key": "machine",
        "label": "Machine",
        "type": "select",
        "default": "comp",
        "options": [
          [
            "comp",
            "Compressor or blower (pressure rises)"
          ],
          [
            "turb",
            "Turbine or expander (pressure falls)"
          ]
        ]
      },
      {
        "key": "h_measured_inlet_and_outlet",
        "label": "Measured inlet and outlet",
        "type": "heading"
      },
      {
        "key": "P1",
        "label": "Inlet pressure (absolute)",
        "type": "number",
        "default": 100,
        "unit": "kPa",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T1",
        "label": "Inlet temperature",
        "type": "number",
        "default": 20,
        "unit": "°C",
        "min": -100,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P2",
        "label": "Outlet pressure (absolute)",
        "type": "number",
        "default": 400,
        "unit": "kPa",
        "min": 1,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "T2",
        "label": "Outlet temperature",
        "type": "number",
        "default": 190,
        "unit": "°C",
        "min": -150,
        "max": 1500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_gas_flow_and_target",
        "label": "Gas, flow and target",
        "type": "heading"
      },
      {
        "key": "cp",
        "label": "Specific heat of the gas at constant pressure",
        "type": "number",
        "default": 1.005,
        "unit": "kJ/kg·K",
        "min": 0.5,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "k",
        "label": "Specific heat ratio of the gas (cp ÷ cv)",
        "type": "number",
        "default": 1.4,
        "unit": "",
        "min": 1.05,
        "max": 1.67,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "mdot",
        "label": "Gas mass flow",
        "type": "number",
        "default": 0.5,
        "unit": "kg/s",
        "min": 0.0001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "etamin",
        "label": "Minimum acceptable isentropic efficiency",
        "type": "number",
        "default": 75,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
