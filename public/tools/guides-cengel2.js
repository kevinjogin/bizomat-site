// MAKEOS methods, input sources and limits for the second Çengel thermodynamics batch (cengel2).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "rankine-cycle-check": {
    "purpose": "Simple steam Rankine cycle from steam-table values: the feed pump and turbine work with their isentropic efficiencies, the heat added and rejected, the thermal efficiency, back-work ratio and heat rate, the steam flow and boiler and condenser duties for the net power you need, and the dryness of the turbine exhaust against your minimum.",
    "uses": [
      "Screen a small steam turbine or back-up generating set before asking for quotations",
      "Estimate steam flow, boiler duty and condenser duty for a net power output",
      "Check whether turbine exhaust moisture is acceptable for a chosen superheat and condenser pressure"
    ],
    "users": [
      "Mechanical and power engineers",
      "Boiler and steam plant engineers",
      "Engineering students and trainers"
    ],
    "inputs": {
      "Pb": "Boiler outlet (turbine inlet) pressure, absolute, from the boiler or turbine data sheet.",
      "h3": "Enthalpy of the steam entering the turbine at its pressure and temperature, from the superheated steam table or IAPWS-IF97 software.",
      "h4s": "Enthalpy at condenser pressure with the same entropy as the turbine inlet (isentropic expansion), from the steam table or software.",
      "etat": "Turbine isentropic efficiency from the turbine maker or a test.",
      "Pc": "Condenser pressure, absolute, from the condenser design or a gauge reading plus atmospheric pressure.",
      "hf": "Saturated liquid enthalpy at the condenser pressure (the condensate leaving the condenser).",
      "hfg": "Enthalpy of vaporisation at the condenser pressure, used for the exhaust dryness.",
      "vf": "Specific volume of saturated liquid at the condenser pressure, used for the pump work.",
      "etap": "Feed pump isentropic efficiency from the pump maker’s curve.",
      "Pnet": "Net electrical or shaft power the cycle must deliver.",
      "xmin": "Lowest dryness fraction the turbine maker accepts at the exhaust (1 minus the moisture fraction)."
    },
    "outputs": [
      "Thermal efficiency, heat rate and back-work ratio",
      "Turbine, pump and net work per kilogram",
      "Steam flow and boiler and condenser duties for the net power",
      "Turbine exhaust dryness against the minimum"
    ],
    "method": [
      "Pump: w_p = v_f (P_b − P_c) ÷ η_p (kPa × m³/kg = kJ/kg); feed water enthalpy h₂ = h_f + w_p.",
      "Turbine: w_t = η_t (h₃ − h₄ₛ); exhaust enthalpy h₄ = h₃ − w_t; exhaust dryness x₄ = (h₄ − h_f) ÷ h_fg.",
      "Net work w_net = w_t − w_p; heat added q_in = h₃ − h₂; heat rejected q_out = h₄ − h_f; efficiency η = w_net ÷ q_in; heat rate = 3,600 ÷ η kJ/kWh.",
      "Steam flow ṁ = net power ÷ w_net; boiler duty ṁ q_in; condenser duty ṁ q_out.",
      "Example: steam at 3 MPa with an inlet enthalpy of 3,116.1 kJ/kg, expanding to 10 kPa with an isentropic exit enthalpy of 2,136.1 kJ/kg, an 87 % turbine and an 85 % pump, gives 29.07 % efficiency, 5.889 kg/s of steam for 5,000 kW and an exhaust dryness of 0.8661, above a 0.85 minimum."
    ],
    "limitations": [
      "Simple cycle only: no reheat, regenerative feed heating, pressure losses in pipes and boiler, heat losses or auxiliary loads; real plant heat rates are higher.",
      "All steam values must come from one table or program with the same reference state; the tool cannot check them.",
      "A screening calculation, not a turbine selection or boiler design; pressure equipment and turbine work follow the maker’s data and qualified review.",
      "Example values are steam-table values chosen as an illustration. Replace them with values for your actual plant."
    ],
    "interpret": [
      "A small back-work ratio is the reason steam cycles produce a lot of net work per kilogram: pumping a liquid takes little work.",
      "Lower condenser pressure and higher superheat both raise efficiency; superheat also keeps the exhaust drier, while lower condenser pressure makes it wetter."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 10 (sections 10-2 to 10-4: the ideal Rankine cycle, deviations from it, raising its efficiency). Method reference; no tables, figures or examples are reproduced.",
      "IAPWS Industrial Formulation 1997 for the thermodynamic properties of water and steam (IAPWS-IF97): the basis of current steam tables and software."
    ],
    "verify": [
      "Compare the steam flow and heat rate with the turbine maker’s heat balance at the same conditions."
    ]
  },
  "steam-dryness-throttling-check": {
    "purpose": "Dryness fraction of wet steam in a line from a throttling calorimeter reading: the throttled sample keeps its enthalpy, so the enthalpy found from the calorimeter’s pressure and temperature gives the line steam’s dryness, with a check that the sample is superheated enough for the method to be valid.",
    "uses": [
      "Check the dryness of steam supplied to a process, steriliser or turbine",
      "Investigate wet steam from boiler carryover, poor trapping or missing separators",
      "Teach constant-enthalpy throttling with a practical measurement"
    ],
    "users": [
      "Steam plant and boiler engineers",
      "Maintenance technicians",
      "Process engineers in food, pharmaceutical and hospital plants"
    ],
    "inputs": {
      "P1": "Absolute pressure of the steam line at the sampling point (gauge reading plus atmospheric pressure).",
      "hf1": "Saturated liquid enthalpy at the line pressure, from the saturated steam table.",
      "hfg1": "Enthalpy of vaporisation at the line pressure, from the saturated steam table.",
      "P2": "Absolute pressure inside the calorimeter after throttling, usually close to atmospheric.",
      "T2": "Steam temperature measured inside the calorimeter.",
      "Tsat2": "Saturation temperature at the calorimeter pressure, from the steam table.",
      "h2": "Enthalpy of superheated steam at the calorimeter pressure and temperature, from the superheated table (interpolated) or software.",
      "sup": "Least superheat in the calorimeter you accept as proof the sample is fully evaporated; your test procedure.",
      "xreq": "Lowest dryness fraction the process or equipment needs, from its specification."
    },
    "outputs": [
      "Dryness fraction and moisture content of the line steam",
      "Superheat in the calorimeter and whether the reading is valid",
      "Dryness against the requirement"
    ],
    "method": [
      "Throttling through a valve or orifice with no heat or work transfer keeps the enthalpy constant: h₁ = h₂.",
      "With the calorimeter steam superheated, h₂ follows from its pressure and temperature; the line steam’s dryness is x = (h₂ − h_f1) ÷ h_fg1 at the line pressure.",
      "The reading is valid only if the calorimeter temperature is above the saturation temperature at its pressure by at least the superheat you set.",
      "Example: steam at 1 MPa (h_f 762.51, h_fg 2,014.6 kJ/kg) throttled to 100 kPa reads 150 °C (h 2,776.6 kJ/kg, 50.39 K of superheat): dryness 0.9997, above 0.97."
    ],
    "limitations": [
      "Steam wetter than about 0.95 at moderate pressures does not superheat on throttling to atmospheric pressure, so the throttling calorimeter cannot measure it; a separating calorimeter is used ahead of it.",
      "Heat lost from the sampling line and calorimeter makes steam look wetter than it is; insulate both and sample from a proper probe.",
      "One sample at one moment; carryover and wetness vary with boiler load.",
      "Example values are steam-table values chosen as an illustration. Replace them with your own readings and table values."
    ],
    "interpret": [
      "A dryness of 0.97 means 3 % of the mass is water droplets, which carry no latent heat and erode valves and turbine blades.",
      "If the reading is not valid, the steam is wetter than the method can measure: that is itself a finding."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 3 (section 3-5: saturated liquid–vapour mixtures and quality) and chapter 5 (section 5-4: throttling valves). Method reference; no tables, figures or examples are reproduced.",
      "IAPWS-IF97 for steam properties."
    ],
    "verify": [
      "Repeat the test at the boiler’s normal and peak loads, and check the thermometer and gauge calibration."
    ]
  },
  "cogeneration-saving-check": {
    "purpose": "Energy performance of a combined heat and power (CHP) plant: electrical and heat efficiencies, utilisation factor, power-to-heat ratio, and the fuel that separate production would need at your reference efficiencies, giving the fuel saved and the primary energy saving against your target.",
    "uses": [
      "Screen a gas-engine or turbine CHP proposal for a factory, hospital or campus",
      "Check a supplier’s claimed savings against your own reference efficiencies",
      "Show how much of the saving depends on actually using the recovered heat"
    ],
    "users": [
      "Energy engineers and managers",
      "Facility and plant managers",
      "Engineering consultants"
    ],
    "inputs": {
      "Qf": "Fuel energy supplied to the CHP unit per unit time, from the gas meter and the gas heating value (state whether higher or lower heating value).",
      "We": "Net electrical output after the unit’s own auxiliaries, from the maker’s data or the export meter.",
      "Qh": "Heat actually used on site from the unit: hot water, steam or absorption chilling; not heat dumped to a radiator.",
      "etaE": "Efficiency of the electricity the CHP displaces (grid or on-site generation), on the same heating-value basis as the fuel input.",
      "etaH": "Efficiency of the boiler whose heat the CHP displaces, on the same heating-value basis.",
      "pesReq": "Primary energy saving the project must achieve, from your business case or a funding scheme.",
      "hrs": "Hours a year the unit runs at this load."
    },
    "outputs": [
      "Primary energy saving and fuel saved",
      "Utilisation factor, electrical and heat efficiencies",
      "Power-to-heat ratio",
      "Yearly fuel used and saved"
    ],
    "method": [
      "Electrical efficiency η_e = W ÷ Q_fuel; heat efficiency η_h = Q_heat ÷ Q_fuel; utilisation factor = (W + Q_heat) ÷ Q_fuel.",
      "Fuel for separate production F_sep = W ÷ η_E,ref + Q_heat ÷ η_H,ref.",
      "Fuel saved = F_sep − Q_fuel; primary energy saving PES = 1 − Q_fuel ÷ F_sep.",
      "Example: 2,500 kW of fuel giving 900 kW of electricity and 1,100 kW of used heat has a utilisation factor of 80 % and saves 29.46 % of primary energy against 40 % power and 85 % boiler references, above a 10 % target."
    ],
    "limitations": [
      "One steady load point; real CHP savings depend on how many hours the heat is actually needed, which this point cannot show.",
      "All efficiencies must use the same heating-value basis (higher or lower); mixing bases moves the result by about 10 % for natural gas.",
      "Energy only: costs, tariffs, maintenance and emissions factors are not included, so a saving does not by itself make a business case.",
      "Example values are illustrations. Replace them with values for your actual site and unit."
    ],
    "interpret": [
      "A high utilisation factor with a low primary energy saving usually means the heat is credited but cheap to make in a boiler; the electricity is where CHP earns its saving.",
      "If the heat is not used, CHP is just an inefficient power station: check the heat demand profile first."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 10 (section 10-8: cogeneration and the utilisation factor). Method reference; no tables, figures or examples are reproduced.",
      "Directive 2012/27/EU on energy efficiency, Annex II: calculation of primary energy savings for high-efficiency cogeneration (method only; its reference values are not reproduced, enter your own)."
    ],
    "verify": [
      "Check the site’s heat demand by hour and season against the unit’s heat output before relying on the yearly figures."
    ]
  },
  "air-stream-mixing-check": {
    "purpose": "Adiabatic mixing of two moist-air streams, such as outdoor and return air in an air-handling unit: each stream’s humidity ratio, enthalpy and dry-air flow, the mixed temperature, humidity ratio, relative humidity and dew point, the outdoor share by mass, and a check that the mixture stays clear of fog.",
    "uses": [
      "Find the mixed-air condition entering a coil from outdoor and return air",
      "Check for fog or frosting risk when cold, humid outdoor air meets warm return air",
      "Set minimum outdoor air or economiser limits"
    ],
    "users": [
      "Mechanical services designers",
      "HVAC technicians and commissioning engineers",
      "Facility engineers"
    ],
    "inputs": {
      "P": "Barometric pressure at the site: 101.325 kPa at sea level.",
      "T1": "Dry-bulb temperature of the first stream, often outdoor air at the design condition.",
      "RH1": "Relative humidity of the first stream.",
      "V1": "Volume flow of the first stream at its own temperature, from the damper or fan schedule.",
      "T2": "Dry-bulb temperature of the second stream, often return air from the space.",
      "RH2": "Relative humidity of the second stream.",
      "V2": "Volume flow of the second stream at its own temperature.",
      "rhMax": "Highest mixed relative humidity you accept before fogging, wet filters or condensation become a risk."
    },
    "outputs": [
      "Mixed temperature, relative humidity, dew point, humidity ratio and enthalpy",
      "Dry-air mass flows and the first stream’s share",
      "Fog and near-saturation check"
    ],
    "method": [
      "Each stream: p_v = φ p_sat(T) (Hyland–Wexler), ω = 0.622 p_v ÷ (P − p_v), h = 1.005 T + ω (2,500.9 + 1.82 T), v = 0.287 (T + 273.15) ÷ (P − p_v) and ṁ_a = V̇ ÷ v.",
      "Mixed state: ω₃ and h₃ are averages weighted by dry-air mass flow (mass and energy balances).",
      "Mixed temperature T₃ = (h₃ − 2,500.9 ω₃) ÷ (1.005 + 1.82 ω₃); vapour pressure p_v3 = ω₃ P ÷ (0.622 + ω₃); relative humidity = p_v3 ÷ p_sat(T₃).",
      "Example: 0.5 m³/s at 5 °C and 80 % mixed with 1.5 m³/s at 22 °C and 50 % gives 17.56 °C at 57.7 % (dew point 9.14 °C), clear of fog."
    ],
    "limitations": [
      "Perfect, adiabatic mixing; real mixing boxes stratify, so coils and filters can see colder or wetter air than the average.",
      "Air temperatures from 0 to 60 °C; relative humidity is taken over liquid water.",
      "When the result shows fog, the true mixed state is saturated with some water condensed; the reported state is the unrealisable straight-line mix.",
      "Example values are illustrations. Replace them with values for your actual system."
    ],
    "interpret": [
      "On a psychrometric chart the mixed state lies on the straight line between the two streams, closer to the larger one.",
      "Fog appears when that line crosses the saturation curve, most often with very cold, humid outdoor air."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 14 (sections 14-2 and 14-7: humidity and adiabatic mixing of airstreams). Method reference; no tables, figures or examples are reproduced.",
      "ASHRAE Handbook—Fundamentals (SI), chapter 1 Psychrometrics: Hyland–Wexler saturation pressure."
    ],
    "verify": [
      "Measure the mixed-air temperature at several points across the coil face to check for stratification."
    ]
  },
  "evaporative-cooler-check": {
    "purpose": "Direct evaporative (swamp) cooler: the wet-bulb temperature of the entering air from the adiabatic saturation balance, the leaving temperature from the pad’s saturation effectiveness, the leaving humidity, the water evaporated, the sensible cooling of the air, and whether it reaches the supply temperature you need.",
    "uses": [
      "Size or check an evaporative cooler for a factory, warehouse or plant room",
      "Estimate water use for an evaporative cooling system",
      "See on which days direct evaporative cooling can reach a target temperature"
    ],
    "users": [
      "Mechanical services designers",
      "Facility and maintenance managers",
      "HVAC contractors"
    ],
    "inputs": {
      "P": "Barometric pressure at the site: 101.325 kPa at sea level.",
      "T1": "Dry-bulb temperature of the air entering the cooler, usually the outdoor design temperature.",
      "RH1": "Relative humidity of the air entering the cooler at that time.",
      "V": "Volume flow of air entering the cooler, from the fan rating.",
      "eps": "Saturation effectiveness of the pads from the maker’s data: the share of the dry-bulb to wet-bulb difference the cooler achieves.",
      "Treq": "Supply air temperature the space or process needs."
    },
    "outputs": [
      "Wet-bulb temperature and leaving air temperature",
      "Leaving relative humidity and humidity ratio",
      "Water evaporated",
      "Sensible cooling of the air",
      "Leaving temperature against the target"
    ],
    "method": [
      "Wet-bulb T_wb from the adiabatic saturation balance (Çengel 14-14): ω₁ = [1.005 (T_wb − T₁) + ω_s(T_wb) h_fg(T_wb)] ÷ [h_g(T₁) − h_f(T_wb)], solved by bisection, with h_g = 2,500.9 + 1.82 T and h_f = 4.18 T.",
      "Leaving temperature T₂ = T₁ − ε (T₁ − T_wb).",
      "Leaving humidity from the same balance with make-up water at the wet-bulb temperature: ω₂ = (h₁ − ω₁ h_f − 1.005 T₂) ÷ (h_g(T₂) − h_f); water evaporated = ṁ_a (ω₂ − ω₁).",
      "Sensible cooling = ṁ_a (1.005 + 1.82 ω₁)(T₁ − T₂).",
      "Example: 3 m³/s of air at 38 °C and 20 % has a wet-bulb of 20.76 °C; 80 % effective pads cool it to 24.21 °C at 73.6 %, evaporating 69.2 kg/h of water for 47.26 kW of sensible cooling, below a 26 °C target."
    ],
    "limitations": [
      "Direct evaporative cooling adds moisture: it suits dry climates and spaces that tolerate humid supply air, not humidity-controlled rooms.",
      "The water evaporated excludes bleed-off, which is needed to control dissolved salts and can be a large share of the total water use.",
      "Pads and sumps need maintenance to manage Legionella risk; check your state’s public health requirements. This tool does not cover water treatment.",
      "Example values are illustrations. Replace them with values for your actual site and cooler."
    ],
    "interpret": [
      "No direct evaporative cooler can cool air below its wet-bulb temperature; humid days narrow the gap.",
      "The cooling the space receives is less than the sensible cooling shown if the supply air is warmer than the space it enters needs."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 14 (section 14-4: adiabatic saturation and wet-bulb temperatures; section 14-7: evaporative cooling). Method reference; no tables, figures or examples are reproduced.",
      "ASHRAE Handbook—Fundamentals (SI), chapter 1 Psychrometrics: Hyland–Wexler saturation pressure."
    ],
    "verify": [
      "Check the design wet-bulb for your location from local climate data, not a single day’s reading."
    ]
  },
  "heating-humidification-check": {
    "purpose": "Steady-flow balance for heating air and adding moisture: the moisture the humidifier must add, the energy that steam or spray water brings in, the heater load that remains, and both checked against the heater and humidifier capacities.",
    "uses": [
      "Size the heater and humidifier for a cleanroom, laboratory, museum or printing room",
      "Check winter humidification for static control or comfort",
      "Compare steam injection with spray humidification for the same duty"
    ],
    "users": [
      "Mechanical services designers",
      "HVAC technicians",
      "Facility engineers"
    ],
    "inputs": {
      "P": "Barometric pressure at the site: 101.325 kPa at sea level.",
      "V1": "Volume flow of air entering the unit at the entering temperature.",
      "T1": "Dry-bulb temperature of the air entering, usually winter outdoor or mixed air.",
      "RH1": "Relative humidity of the air entering.",
      "T3": "Dry-bulb temperature the leaving air must have.",
      "RH3": "Relative humidity the leaving air must have.",
      "kind": "Steam injection adds moisture and heat; spray or pad humidification adds liquid water that cools the air as it evaporates.",
      "hw": "Enthalpy of the steam or water added: about 2,675 kJ/kg for steam near atmospheric pressure (steam table), or 4.18 × water temperature for liquid water.",
      "Qcap": "Rated output of the heater or heating coil at these conditions.",
      "Mcap": "Rated output of the humidifier in kilograms of water per hour."
    },
    "outputs": [
      "Heater load",
      "Water or steam added and the energy it brings",
      "Humidity ratio, enthalpy and dew point in and out",
      "Heater and humidifier capacity checks"
    ],
    "method": [
      "Each state: p_v = φ p_sat(T) (Hyland–Wexler), ω = 0.622 p_v ÷ (P − p_v), h = 1.005 T + ω (2,500.9 + 1.82 T); dry-air mass flow ṁ_a = V̇₁ ÷ v₁.",
      "Water added ṁ_w = ṁ_a (ω₃ − ω₁).",
      "Heater load Q = ṁ_a (h₃ − h₁) − ṁ_w h_w; when the steam brings more heat than needed, the heater load is zero.",
      "Example: 1 m³/s of air from 5 °C and 40 % to 22 °C and 45 % needs 23.87 kg/h of steam at 2,675 kJ/kg and a 20.81 kW heater; a 25 kW heater and 30 kg/h humidifier meet it."
    ],
    "limitations": [
      "All added water is assumed absorbed; spray humidifiers that leave droplets or wet the duct deliver less, and their water treatment matters.",
      "Air temperatures from 0 to 60 °C; relative humidity is taken over liquid water.",
      "Steady design point only; controls, duct losses and fan heat are not included.",
      "Example values are illustrations. Replace them with values for your actual system."
    ],
    "interpret": [
      "Spray humidification needs more heater capacity than steam for the same leaving state, because the water takes its latent heat from the air.",
      "Cold outdoor air holds little moisture, so even modest indoor humidity targets need a lot of added water in winter."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 14 (section 14-7: heating with humidification). Method reference; no tables, figures or examples are reproduced.",
      "ASHRAE Handbook—Fundamentals (SI), chapter 1 Psychrometrics: Hyland–Wexler saturation pressure."
    ],
    "verify": [
      "Check the humidifier maker’s absorption distance in the duct before placing coils, filters or bends downstream."
    ]
  }
});
