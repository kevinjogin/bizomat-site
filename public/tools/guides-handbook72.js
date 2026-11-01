// MAKEOS methods, input sources and limits for the engineering thermodynamics tools (batch handbook72).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "otto-diesel-cycle-check": {
    "purpose": "Cold-air-standard analysis of the ideal Otto (constant-volume heat addition) or Diesel (constant-pressure heat addition) cycle: the pressure and temperature at each corner of the cycle, the heat added and rejected, the net work, the thermal efficiency, the mean effective pressure and the Carnot efficiency between the cycle’s lowest and highest temperatures, with the peak pressure checked against a limit you enter.",
    "uses": [
      "See how compression ratio, cutoff ratio and heat input change the ideal efficiency and peak pressure of an engine",
      "Set an upper bound on the efficiency a reciprocating engine can reach before comparing it with test data",
      "Explain why diesel engines need higher compression ratios and stronger cylinders than spark-ignition engines"
    ],
    "users": [
      "Mechanical engineers",
      "Engine and generator-set technicians",
      "Engineering students and trainers"
    ],
    "inputs": {
      "cycle": "Otto for spark-ignition engines, Diesel for compression-ignition engines.",
      "r": "Engine compression ratio from the maker’s data sheet (swept plus clearance volume ÷ clearance volume).",
      "qin": "Heat released per kilogram of air in the cylinder (Otto only): roughly the fuel’s heating value ÷ the air–fuel ratio for a full charge.",
      "rc": "Cutoff ratio (Diesel only): the cylinder volume when fuel injection ends ÷ the volume at top dead centre.",
      "P1": "Absolute pressure in the cylinder at the start of compression: about atmospheric for a naturally aspirated engine, boost pressure for a turbocharged one.",
      "T1": "Air temperature at the start of compression: intake temperature, or after the intercooler for a turbocharged engine.",
      "k": "Ratio of specific heats of the working gas: 1.4 for air at room temperature; lower values allow for heating of the gas.",
      "R": "Specific gas constant of the working gas: 0.287 kJ/kg·K for air.",
      "Pmax": "Allowable peak cylinder pressure from the engine maker or your design limit."
    },
    "outputs": [
      "Temperatures and pressures at the four states of the cycle",
      "Heat added, heat rejected and net work per kilogram of air",
      "Thermal efficiency and the Carnot efficiency between T₁ and T₃",
      "Mean effective pressure",
      "Peak pressure against the limit"
    ],
    "method": [
      "Isentropic compression: T₂ = T₁ r^(k−1) and P₂ = P₁ r^k, with temperatures in kelvin and cv = R ÷ (k − 1), cp = k cv.",
      "Otto: heat added at constant volume, T₃ = T₂ + q_in ÷ cv and P₃ = P₂ T₃ ÷ T₂; expansion T₄ = T₃ ÷ r^(k−1). Diesel: heat added at constant pressure, T₃ = r_c T₂, P₃ = P₂, q_in = cp (T₃ − T₂); expansion T₄ = T₃ (r_c ÷ r)^(k−1).",
      "Heat rejected at constant volume q_out = cv (T₄ − T₁); net work w = q_in − q_out; efficiency η = w ÷ q_in, which equals 1 − 1 ÷ r^(k−1) (Otto) or 1 − (r_c^k − 1) ÷ [k (r_c − 1) r^(k−1)] (Diesel).",
      "Mean effective pressure MEP = w ÷ (v₁ − v₂) with v₁ = R T₁ ÷ P₁ and v₂ = v₁ ÷ r.",
      "Example: an Otto cycle with r = 10, 1,600 kJ/kg added, starting at 100 kPa and 30 °C, gives 60.19 % efficiency, 963 kJ/kg of net work, an MEP of 1,230 kPa and a peak of 9,868 kPa, inside a 12,000 kPa limit."
    ],
    "limitations": [
      "Ideal cycles: no friction, heat loss to the walls, finite combustion time, valve timing, pumping work, residual gas or fuel mass. Real engines reach well under these efficiencies.",
      "Constant specific heats at the value of k you enter; at combustion temperatures specific heats rise and the gas dissociates, so the ideal peak temperature and pressure are overstated.",
      "This is a screening model of the thermodynamic cycle, not an engine design or a check of cylinder, head or bearing strength; qualified review governs real engine work.",
      "Example values are illustrations. Replace them with values for your actual engine."
    ],
    "interpret": [
      "Efficiency climbs steeply at low compression ratios and flattens above about 8 to 10, while peak pressure keeps rising, which is why gains from very high ratios are small.",
      "For the same compression ratio the Otto cycle is more efficient than the Diesel; diesels win in practice because they can run much higher compression ratios without knock."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 9 (sections 9-3 to 9-6: air-standard assumptions, Otto and Diesel cycles, mean effective pressure). Method reference; no tables, figures or examples are reproduced.",
      "Heywood J. B., Internal Combustion Engine Fundamentals (McGraw-Hill): ideal cycle analysis and the difference between ideal and real engine cycles."
    ],
    "verify": [
      "Compare the ideal efficiency with the engine’s measured brake thermal efficiency from fuel use and output.",
      "Check the allowable peak cylinder pressure with the engine maker before changing compression ratio, boost or timing."
    ]
  },
  "brayton-regenerator-check": {
    "purpose": "Cold-air-standard gas-turbine (Brayton) cycle with real compressor and turbine efficiencies and an optional regenerator: the temperatures around the cycle, the compressor, turbine and net work, the back-work ratio, the thermal efficiency with and without the regenerator, the heat input and the net power for the air flow, against the power you need.",
    "uses": [
      "Screen the net power and efficiency of a small gas turbine or microturbine at a pressure ratio and firing temperature",
      "See whether a recuperator or regenerator is worth fitting at a given pressure ratio",
      "Show how compressor and turbine efficiencies eat into net work when the back-work ratio is high"
    ],
    "users": [
      "Mechanical and energy engineers",
      "Cogeneration and power-plant engineers",
      "Engineering students and trainers"
    ],
    "inputs": {
      "T1": "Air temperature at the compressor inlet: ambient air temperature at the intake.",
      "rp": "Compressor pressure ratio from the machine data sheet (outlet ÷ inlet absolute pressure).",
      "T3": "Turbine inlet (firing) temperature from the maker’s data or the control system.",
      "etac": "Compressor isentropic efficiency from the maker’s performance data or a test.",
      "etat": "Turbine isentropic efficiency from the maker’s performance data or a test.",
      "eps": "Regenerator (recuperator) effectiveness from its data sheet: the share of the largest possible temperature rise of the compressed air that it achieves. Enter 0 for no regenerator.",
      "cp": "Specific heat of the gas at constant pressure: 1.005 kJ/kg·K for air at room temperature.",
      "k": "Ratio of specific heats: 1.4 for air at room temperature.",
      "mdot": "Air mass flow through the machine from the maker’s data or measurement.",
      "Preq": "Net shaft power you need from the cycle."
    },
    "outputs": [
      "Compressor outlet, turbine exhaust, air-to-combustor and final exhaust temperatures",
      "Compressor, turbine and net work per kilogram and the back-work ratio",
      "Thermal efficiency with and without the regenerator",
      "Heat input and net power against the demand"
    ],
    "method": [
      "Compressor: T₂ₛ = T₁ r_p^((k−1)/k) and T₂ = T₁ + (T₂ₛ − T₁) ÷ η_c; turbine: T₄ₛ = T₃ ÷ r_p^((k−1)/k) and T₄ = T₃ − η_t (T₃ − T₄ₛ), temperatures in kelvin.",
      "Work: w_c = cp (T₂ − T₁), w_t = cp (T₃ − T₄), w_net = w_t − w_c; back-work ratio = w_c ÷ w_t.",
      "Regenerator (only when T₄ > T₂): air to the combustor T₅ = T₂ + ε (T₄ − T₂); heat input q_in = cp (T₃ − T₅); exhaust after the regenerator T₆ = T₄ − (T₅ − T₂).",
      "Efficiency η = w_net ÷ q_in; net power = ṁ w_net; heat input = ṁ q_in.",
      "Example: 5 kg/s of air at 15 °C, a pressure ratio of 10, 1,100 °C at the turbine, 85 % and 88 % component efficiencies and a 75 % regenerator give 1,341.6 kW net at 42.43 % efficiency (34.7 % without the regenerator), meeting a 1,200 kW demand."
    ],
    "limitations": [
      "Cold-air standard: constant specific heats, no fuel mass added, no pressure loss in the combustor, regenerator, intake or exhaust, and no cooling or leakage air.",
      "Real gas turbines also lose output at high ambient temperatures and altitudes through lower air density, which only the mass flow you enter allows for.",
      "A screening model of the cycle, not a turbine selection or performance guarantee; the maker’s performance data and qualified review govern real plant.",
      "Example values are illustrations. Replace them with values for your actual machine."
    ],
    "interpret": [
      "A back-work ratio near or above 50 % means small losses in the compressor or turbine take a large share of the net work.",
      "A regenerator helps most at low pressure ratios, where the turbine exhaust is much hotter than the compressed air; at high pressure ratios the tool reports that it would cool the air instead."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 9 (sections 9-8 and 9-9: Brayton cycle, deviation from the ideal cycle, regeneration) and section 7-12 (isentropic efficiencies). Method reference; no tables, figures or examples are reproduced.",
      "Saravanamuttoo H. I. H., Rogers G. F. C. and Cohen H., Gas Turbine Theory (Pearson): simple and recuperated cycle performance with component efficiencies."
    ],
    "verify": [
      "Compare with the maker’s rated output and heat rate at site conditions.",
      "Check that the recuperator’s pressure losses, which this model ignores, do not wipe out the gain."
    ]
  },
  "vapour-compression-cycle-check": {
    "purpose": "Single-stage vapour-compression refrigeration or heat-pump cycle from the refrigerant enthalpies at the compressor inlet, after isentropic compression and at the condenser outlet: the refrigerating effect, the actual compressor work, the heat rejected, the refrigerant flow and compressor power for the duty, the COP as a refrigerator and as a heat pump, and the comparison with the reversed-Carnot COP, against the COP you need.",
    "uses": [
      "Check a chiller, cold room or heat pump selection against a COP target",
      "Work out refrigerant mass flow and compressor power from a duty and refrigerant table values",
      "Show how much of the Carnot limit a real cycle reaches at a given lift"
    ],
    "users": [
      "Refrigeration and air-conditioning engineers and technicians",
      "Mechanical services designers",
      "Energy auditors"
    ],
    "inputs": {
      "mode": "Cooling sizes the refrigerant flow on the heat absorbed; heating sizes it on the heat delivered.",
      "Q": "The cooling load (cooling) or the heat to be delivered (heating), from your load calculation.",
      "h1": "Refrigerant enthalpy leaving the evaporator: saturated or superheated vapour at the evaporating pressure, from refrigerant tables or property software.",
      "h2s": "Enthalpy at the condensing pressure and the same entropy as the compressor inlet, from the superheated table or software.",
      "h3": "Enthalpy of the liquid leaving the condenser: saturated or subcooled liquid at the condensing pressure.",
      "etac": "Compressor isentropic efficiency from the compressor maker’s data at this pressure ratio.",
      "Te": "Evaporating (saturation) temperature in the evaporator.",
      "Tc": "Condensing (saturation) temperature in the condenser.",
      "COPreq": "The COP the duty must reach, for example from the specification, an energy target or the existing plant."
    },
    "outputs": [
      "Refrigerating effect, compressor work and heat rejected per kilogram",
      "Actual discharge enthalpy",
      "Refrigerant mass flow, compressor power and both heat flows",
      "COP as a refrigerator and heat pump, reversed-Carnot COP and second-law efficiency",
      "COP against the target"
    ],
    "method": [
      "Throttling is at constant enthalpy, so h₄ = h₃; refrigerating effect q_L = h₁ − h₄.",
      "Compressor work w = (h₂ₛ − h₁) ÷ η_c; actual discharge h₂ = h₁ + w; heat rejected q_H = h₂ − h₃ = q_L + w.",
      "COP_R = q_L ÷ w and COP_HP = q_H ÷ w; refrigerant flow ṁ = duty ÷ q_L (cooling) or duty ÷ q_H (heating); compressor power = ṁ w.",
      "Reversed-Carnot limits with T in kelvin: COP_R,max = T_L ÷ (T_H − T_L), COP_HP,max = T_H ÷ (T_H − T_L); second-law efficiency = COP ÷ COP_max.",
      "Example: enthalpies of 395, 425 and 255 kJ/kg with a 75 % compressor give a COP of 3.5 for cooling, 2.857 kW of compressor power and 0.0714 kg/s of refrigerant for 10 kW, 66.5 % of the reversed-Carnot COP of 5.263 between −10 °C and 40 °C."
    ],
    "limitations": [
      "One-stage cycle with an adiabatic compressor and expansion valve; no pressure drops in pipes and heat exchangers, no heat gains to the suction line, and no motor, drive or fan power. Real system COPs are lower.",
      "The enthalpies must come from one table or program with one reference state; mixing sources gives wrong results without any warning.",
      "A screening calculation, not a plant selection; the equipment maker’s data, AS/NZS 5149 and licensed refrigeration trades govern real systems.",
      "Example values are illustrations shaped like a common refrigerant cycle. Replace them with values for your refrigerant and conditions."
    ],
    "interpret": [
      "The heat-pump COP is always the refrigerator COP plus one for the same cycle, because the compressor work also ends up as heat delivered.",
      "Each degree less lift between evaporating and condensing temperatures raises the Carnot COP, which is why clean condensers and correct evaporating temperatures save energy."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 11 (sections 11-1 to 11-4: COP, reversed Carnot cycle, ideal and actual vapour-compression cycles) and section 6-12. Method reference; no tables, figures or examples are reproduced.",
      "AS/NZS 5149 Refrigerating systems and heat pumps: safety and environmental requirements (named by number and scope only).",
      "NIST Chemistry WebBook, thermophysical properties of fluid systems (webbook.nist.gov): one source of refrigerant enthalpies; note its reference state."
    ],
    "verify": [
      "Check the result against the compressor maker’s rated capacity and power at the same evaporating and condensing temperatures.",
      "Measure suction and discharge pressures and temperatures on the running plant to confirm the states assumed."
    ]
  },
  "surface-dew-point-check": {
    "purpose": "Moist-air properties from the dry-bulb temperature, relative humidity and pressure (vapour pressure, humidity ratio, enthalpy, specific volume and dew or frost point), and a check of whether a surface at a given temperature stays above the dew point with the margin you need.",
    "uses": [
      "Check whether cold pipes, ducts, tanks or walls will sweat",
      "Check whether an electrical enclosure, machine or store needs heating or dehumidifying",
      "Find the dew point and humidity ratio of air for psychrometric work"
    ],
    "users": [
      "Mechanical services and maintenance engineers",
      "Electrical and controls engineers",
      "Building and facility managers"
    ],
    "inputs": {
      "T": "Air temperature from a thermometer or the hygrometer’s temperature reading.",
      "RH": "Relative humidity of the air from a calibrated hygrometer, relative to saturation over liquid water.",
      "P": "Barometric (total) pressure: 101.325 kPa at sea level, lower at altitude; local weather data gives it.",
      "Ts": "Temperature of the coldest surface the air touches: a contact thermometer, an infrared reading corrected for emissivity, or a heat-transfer calculation.",
      "margin": "How far above the dew point the surface must stay to allow for sensor error and changes in conditions; your own specification or practice."
    },
    "outputs": [
      "Dew point (frost point below 0 °C) and margin of the surface above it",
      "Relative humidity the air would have at the surface temperature",
      "Humidity ratio, enthalpy, specific volume, vapour and saturation pressure"
    ],
    "method": [
      "Saturation pressure of water vapour from the Hyland–Wexler equations (ASHRAE Fundamentals, chapter 1): over liquid water at or above 0 °C, over ice below; they match the steam-table values in Çengel’s Table A-4 to within 0.02 % between 0.01 and 100 °C.",
      "Vapour pressure p_v = φ p_sat(T); humidity ratio ω = 0.622 p_v ÷ (P − p_v); enthalpy h = 1.005 T + ω (2500.9 + 1.82 T) kJ/kg of dry air; specific volume v = 0.287 (T + 273.15) ÷ (P − p_v).",
      "Dew point: the temperature at which p_sat equals p_v, solved by bisection; below 0 °C this is the frost point over ice.",
      "Margin = surface temperature − dew point: at or above the required margin the surface stays dry; between zero and the margin the margin is too small; at or below zero water (or frost) forms.",
      "Example: air at 25 °C and 60 % at sea-level pressure has a dew point of 16.7 °C and 11.896 g/kg of moisture; a surface at 22 °C stays 5.3 K above it, more than the 3 K required."
    ],
    "limitations": [
      "Uniform air and steady conditions; real condensation often happens where air is trapped against a cold surface, at night, or when warm humid air enters a cool enclosure.",
      "Air temperatures from 0 to 90 °C; relative humidity is taken over liquid water.",
      "Hygrometers are often only accurate to a few per cent of relative humidity, which moves the dew point by about a degree; the margin should cover this.",
      "Example values are illustrations. Replace them with values for your actual site."
    ],
    "interpret": [
      "High relative humidity at the surface, short of 100 %, can already support mould growth and corrosion on dusty or salty surfaces before liquid water appears.",
      "The dew point depends only on the moisture in the air; heating the air does not change it, but heating the surface does."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 14 (sections 14-1 to 14-3: dry and atmospheric air, specific and relative humidity, dew-point temperature). Method reference; no tables, figures or examples are reproduced.",
      "ASHRAE Handbook—Fundamentals (SI), chapter 1 Psychrometrics: Hyland–Wexler saturation pressure equations over ice and liquid water.",
      "National Construction Code (Australian Building Codes Board), condensation management provisions for buildings."
    ],
    "verify": [
      "Log temperature and humidity over a full day and night: the worst case is usually not when you visit."
    ]
  },
  "cooling-coil-dehumidification-check": {
    "purpose": "Steady-flow mass and energy balance on a cooling coil that cools and dehumidifies moist air: the humidity ratio, enthalpy and dew point in and out, the dry-air mass flow, the condensate removed, the total coil load, its sensible and latent parts and the sensible heat ratio, against the coil’s rated capacity.",
    "uses": [
      "Size or check a cooling coil in an air-handling unit or process air cooler",
      "Estimate the condensate a coil produces for drain and pump sizing",
      "Split a cooling load into sensible and latent parts"
    ],
    "users": [
      "Mechanical services designers",
      "HVAC and refrigeration technicians",
      "Process and facility engineers"
    ],
    "inputs": {
      "P": "Barometric (total) pressure: 101.325 kPa at sea level, lower at altitude.",
      "V1": "Volume flow of air entering the coil from the fan schedule or a flow measurement.",
      "T1": "Dry-bulb temperature of the air entering the coil (after mixing outdoor and return air).",
      "RH1": "Relative humidity of the air entering the coil.",
      "T2": "Dry-bulb temperature of the air leaving the coil, from the design or a measurement.",
      "RH2": "Relative humidity of the air leaving the coil; typically 85 to 95 % for a coil that removes moisture.",
      "Qcoil": "Total (sensible plus latent) capacity of the coil at these air and coolant conditions, from the coil maker’s selection."
    },
    "outputs": [
      "Total, sensible and latent coil load and the sensible heat ratio",
      "Condensate removed",
      "Dry-air mass flow",
      "Humidity ratio, enthalpy and dew point in and out",
      "Coil capacity against the load"
    ],
    "method": [
      "Each state from temperature and relative humidity: p_v = φ p_sat(T) (Hyland–Wexler), ω = 0.622 p_v ÷ (P − p_v), h = 1.005 T + ω (2500.9 + 1.82 T) kJ/kg of dry air.",
      "Dry-air mass flow ṁ_a = V̇₁ ÷ v₁ with v₁ = 0.287 (T₁ + 273.15) ÷ (P − p_v1); condensate ṁ_w = ṁ_a (ω₁ − ω₂).",
      "Energy balance: Q = ṁ_a (h₁ − h₂) − ṁ_w h_w, with the condensate leaving at the outlet air temperature, h_w = 4.18 T₂ kJ/kg.",
      "Sensible part Q_s = ṁ_a (1.005 + 1.82 ω₁)(T₁ − T₂); latent part = Q − Q_s; sensible heat ratio = Q_s ÷ Q.",
      "Example: 1 m³/s of air cooled from 30 °C and 60 % to 14 °C and 95 % at sea-level pressure needs 37.22 kW (sensible heat ratio 0.505) and removes 26.88 kg/h of water; a 40 kW coil can meet it."
    ],
    "limitations": [
      "Steady flow with no fan heat, duct gains or bypass; the outlet state must be one a real coil can reach, which the coil maker’s selection confirms.",
      "Temperatures from 1 to 60 °C at the coil; the condensate enthalpy uses the specific heat of liquid water, 4.18 kJ/kg·K.",
      "A screening balance, not a coil selection; coil performance depends on fins, rows, face velocity and coolant temperature, which only the maker’s data covers.",
      "Example values are illustrations. Replace them with values for your actual air-handling unit."
    ],
    "interpret": [
      "A sensible heat ratio well below 0.7 means much of the load is drying the air; the coil and the chilled-water or refrigerant temperature must be cold enough to do that.",
      "Condensate in kilograms per hour is close to litres per hour for drain sizing."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 14 (sections 14-2 and 14-7: humidity, air-conditioning processes, cooling with dehumidification). Method reference; no tables, figures or examples are reproduced.",
      "ASHRAE Handbook—Fundamentals (SI), chapter 1 Psychrometrics: saturation pressure and moist-air relations.",
      "AHRI Standard 410, Forced-Circulation Air-Cooling and Air-Heating Coils (named by number and scope only)."
    ],
    "verify": [
      "Check the coil selection at the same entering and leaving conditions with the coil maker.",
      "Measure entering and leaving temperature and humidity on the running unit to confirm the load."
    ]
  },
  "combustion-air-flue-gas-check": {
    "purpose": "Complete combustion of a hydrocarbon fuel CₓHᵧ with dry air: the stoichiometric and actual air–fuel ratios, the air and flue-gas flows, the wet flue composition, the dry oxygen and carbon dioxide an analyser reads, the water vapour partial pressure and the water dew point of the flue gas, with the lowest flue or exchanger surface checked against the dew point plus your margin.",
    "uses": [
      "Work out the combustion air a burner needs at a chosen excess air",
      "Predict the dry O₂ and CO₂ readings to expect from a flue-gas analyser",
      "Check whether a flue, economiser or heat-recovery exchanger will run wet"
    ],
    "users": [
      "Combustion and boiler engineers",
      "Gas fitters and burner technicians",
      "Energy auditors"
    ],
    "inputs": {
      "x": "Carbon atoms in one molecule of the fuel: 1 for methane, 3 for propane, 4 for butane; an average formula for a gas mixture or liquid fuel from its analysis.",
      "y": "Hydrogen atoms in one molecule of the fuel: 4 for methane, 8 for propane, 10 for butane, 2 for hydrogen.",
      "mf": "Fuel mass flow at the firing rate, from the gas meter (volume × density) or the burner data.",
      "ex": "Air supplied above the theoretical (stoichiometric) amount, as a percentage of it, from the burner setting or an analyser.",
      "P": "Absolute pressure of the flue gas: atmospheric for most appliances.",
      "Ts": "Temperature of the coldest surface the flue gas touches: flue liner, economiser tubes or heat-recovery exchanger.",
      "margin": "How far above the water dew point the coldest surface must stay, from your specification or the appliance maker."
    },
    "outputs": [
      "Stoichiometric and actual air–fuel ratio by mass",
      "Combustion air and flue-gas mass flows",
      "Wet flue composition and the dry O₂ and CO₂ analyser readings",
      "Water vapour partial pressure and the flue-gas water dew point",
      "Margin of the coldest surface above the dew point"
    ],
    "method": [
      "Theoretical oxygen per kmol of fuel a_th = x + y ÷ 4; air supplies (1 + e) a_th kmol O₂ with 3.76 kmol N₂ per kmol O₂.",
      "Products per kmol of fuel: x CO₂, y ÷ 2 H₂O, e a_th O₂ and 3.76 (1 + e) a_th N₂; the dry basis leaves out the water.",
      "Air–fuel ratio by mass = 4.76 (1 + e) a_th × 28.97 ÷ (12.011 x + 1.008 y), with molar masses of air, carbon and hydrogen.",
      "Water vapour partial pressure p_v = (y ÷ 2) ÷ N_total × P; dew point where the Hyland–Wexler saturation pressure equals p_v.",
      "Example: methane (CH₄) with 15 % excess air needs 19.77 kg of air per kg of fuel (17.191 at stoichiometric); the dry flue reads 3.02 % O₂ and 10.05 % CO₂ and the water dew point is 56.54 °C, 13.46 K below a 70 °C surface."
    ],
    "limitations": [
      "Complete combustion with dry air: carbon monoxide, unburnt fuel, sulfur, nitrogen oxides, dissociation and the moisture carried in by humid air or a wet fuel are ignored. Humid air raises the dew point a little.",
      "Fuels containing sulfur form acid that condenses well above the water dew point; this tool does not predict the acid dew point.",
      "A screening calculation; burner setting, flue design and appliance approval follow AS/NZS 5601 and AS 3814 and the work of licensed gas fitters.",
      "Example values are illustrations. Replace them with values for your actual fuel and burner."
    ],
    "interpret": [
      "Each extra 10 % of excess air lowers the dew point only a little but carries more heat up the flue; analysers read O₂ on a dry basis, as reported here.",
      "Condensing boilers and heat-recovery units are designed to run below the dew point to recover latent heat; other flues must stay above it."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 15 (sections 15-1 and 15-2: fuels and combustion, theoretical and actual combustion, air–fuel ratio, dew point of products) and Table A-1 molar masses. Method reference; no tables, figures or examples are reproduced.",
      "ASHRAE Handbook—Fundamentals (SI), chapter 1 Psychrometrics: Hyland–Wexler saturation pressure.",
      "AS/NZS 5601 Gas installations and AS 3814 Industrial and commercial gas-fired appliances (named by number and scope only)."
    ],
    "verify": [
      "Compare the predicted dry O₂ and CO₂ with a calibrated flue-gas analyser reading.",
      "Measure the flue and exchanger surface temperatures at low fire, when they are coldest."
    ]
  },
  "compressor-turbine-efficiency-check": {
    "purpose": "Isentropic efficiency of an uncooled gas compressor, blower, turbine or expander from measured inlet and outlet pressures and temperatures: the isentropic outlet temperature, the efficiency, the gas power absorbed or delivered, the ideal power, and the entropy change and generation rate, against the minimum efficiency you expect.",
    "uses": [
      "Check a blower, centrifugal compressor or turbine against its expected efficiency from site readings",
      "Track performance decline from fouling or wear between overhauls",
      "Catch faulty gauges or thermometers when the result exceeds 100 %"
    ],
    "users": [
      "Maintenance and reliability engineers",
      "Plant and commissioning engineers",
      "Rotating-equipment technicians"
    ],
    "inputs": {
      "machine": "Compressor or blower when the pressure rises; turbine or expander when it falls.",
      "P1": "Absolute pressure at the inlet: gauge reading plus atmospheric pressure.",
      "T1": "Gas temperature at the inlet, measured in the flow close to the flange.",
      "P2": "Absolute pressure at the outlet: gauge reading plus atmospheric pressure.",
      "T2": "Gas temperature at the outlet, measured in the flow before any cooler.",
      "cp": "Specific heat of the gas at constant pressure: 1.005 kJ/kg·K for air near room temperature.",
      "k": "Ratio of specific heats of the gas: 1.4 for air and nitrogen.",
      "mdot": "Gas mass flow from a flow meter or the maker’s curve at the operating point.",
      "etamin": "The lowest isentropic efficiency you accept, from the maker’s data, the commissioning test or your trend."
    },
    "outputs": [
      "Isentropic efficiency and outlet temperature",
      "Gas power absorbed or delivered and the ideal power",
      "Pressure ratio",
      "Entropy change and generation rate",
      "Efficiency against the minimum"
    ],
    "method": [
      "Isentropic outlet temperature T₂ₛ = T₁ (P₂ ÷ P₁)^((k−1)/k), temperatures in kelvin and pressures absolute.",
      "Compressor η = (T₂ₛ − T₁) ÷ (T₂ − T₁); turbine η = (T₁ − T₂) ÷ (T₁ − T₂ₛ).",
      "Gas power = ṁ cp |T₂ − T₁|; ideal power = ṁ cp |T₂ₛ − T₁|.",
      "Entropy change Δs = cp ln(T₂ ÷ T₁) − R ln(P₂ ÷ P₁) with R = cp (k − 1) ÷ k; generation rate ṁ Δs, which must be positive in an adiabatic machine.",
      "Example: air compressed from 100 to 400 kPa absolute and from 20 to 190 °C has an isentropic outlet of 162.47 °C and an efficiency of 83.81 %, absorbing 85.425 kW at 0.5 kg/s: above a 75 % minimum."
    ],
    "limitations": [
      "Adiabatic machines only: oil-injected, water-jacketed or intercooled compressors lose heat, so their outlet temperature understates the work and the efficiency comes out too high.",
      "Ideal gas with constant specific heats; kinetic energy changes and heat loss from the casing are neglected. Temperature sensors must sit in the gas stream, not on the pipe surface.",
      "A field screening check, not an acceptance test; ISO 5389, ASME PTC 10 and ISO 1217 set the test procedures and corrections for contractual tests.",
      "Example values are illustrations. Replace them with readings from your actual machine."
    ],
    "interpret": [
      "A falling efficiency at the same pressure ratio and flow usually points to fouling, wear or internal leakage; compare at the same operating point.",
      "An efficiency above 100 % is impossible: it means heat is being removed or a reading is wrong."
    ],
    "refs": [
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach, 5th edition (McGraw-Hill, 2006), chapter 7 (sections 7-9 and 7-12: entropy change and isentropic processes of ideal gases, isentropic efficiencies of turbines and compressors). Method reference; no tables, figures or examples are reproduced.",
      "ISO 5389 Turbocompressors: performance test code; ASME PTC 10 Axial and Centrifugal Compressors and Exhausters; ISO 1217 Displacement compressors: acceptance tests (named by number and scope only)."
    ],
    "verify": [
      "Check gauges and thermometers for calibration and position before acting on a low result.",
      "Compare with the maker’s performance curve at the measured flow and speed."
    ]
  }
});
