// MAKEOS methods, input sources and limits for the thermodynamics first-principles tools (batch bryanthermo).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "liquid-adiabatic-compression": {
    "purpose": "Thermodynamics of a liquid compressed too quickly to exchange heat: the temperature rise from the expansion coefficient, density, specific heat and pressure rise, the difference and ratio of the specific heats from the isothermal bulk modulus, the adiabatic bulk modulus that governs fast pressure changes and oil-column stiffness, the speed of a pressure wave in the free liquid, and a check of the final temperature against your limit.",
    "uses": [
      "Estimate oil heating in a press, intensifier or accumulator charged quickly",
      "Use the right bulk modulus for hydraulic natural frequency and stiffness estimates",
      "Estimate the pressure wave speed in a liquid for water hammer screening"
    ],
    "users": [
      "Hydraulic and fluid power engineers",
      "Machine designers",
      "High-pressure equipment engineers"
    ],
    "inputs": {
      "rho": "Density of the liquid at the starting temperature and pressure, from the fluid supplier’s data sheet.",
      "cp": "Specific heat at constant pressure, from the fluid data sheet or property tables.",
      "alpha": "Volumetric (cubical) thermal expansion coefficient, three times the linear coefficient, from the data sheet; water below 4 °C has a negative value.",
      "KT": "Isothermal (slow-compression) bulk modulus of the liquid at this temperature and pressure, from the supplier or property tables; quote whether it is secant or tangent.",
      "T": "Temperature of the liquid just before the rapid pressure change.",
      "dp": "Pressure rise applied quickly enough that no heat leaves the liquid; a negative value is a rapid pressure drop.",
      "Tmax": "Your temperature limit for the liquid, seals or process after compression."
    },
    "outputs": [
      "Temperature rise and final temperature",
      "c_p − c_v, c_v and the ratio γ = c_p ÷ c_v",
      "Adiabatic bulk modulus",
      "Wave speed in the free liquid, adiabatic and isothermal",
      "Verdict on the temperature limit"
    ],
    "method": [
      "A Maxwell relation gives the temperature change on adiabatic compression: (∂T ÷ ∂p)_s = T (∂v ÷ ∂T)_p ÷ c_p = T α ÷ (ρ c_p) (Bryan §114, relation (131)).",
      "With α, ρ and c_p held constant this integrates to T₂ = T₁ exp[α Δp ÷ (ρ c_p)]; for small rises it equals T α Δp ÷ (ρ c_p).",
      "The specific heats differ by c_p − c_v = T α² K_T ÷ ρ (Bryan §116), so γ = c_p ÷ c_v.",
      "The adiabatic and isothermal moduli are in the ratio of the specific heats, K_s = γ K_T (Bryan §33, equation (35)), and the wave speed is √(K_s ÷ ρ) (Bryan §121).",
      "Example: an oil at 870 kg/m³, 1.9 kJ/(kg·K), 700 × 10⁻⁶ /K and 1600 MPa compressed rapidly by 35 MPa from 40 °C warms by 4.68 K; γ = 1.174 and K_s = 1879 MPa."
    ],
    "limitations": [
      "Properties are taken as constant over the pressure and temperature change; over large pressure rises use property data at the mean condition or step the calculation.",
      "The liquid alone: entrained air, hose and pipe wall flexibility lower the effective bulk modulus and wave speed far below these values.",
      "Rapid compression with no heat exchange; in practice the liquid then cools towards the surroundings.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The adiabatic modulus is never below the isothermal one (17 % higher in the example), so using the isothermal value understates the stiffness of a fast-acting circuit.",
      "Water has a small γ near room temperature and γ = 1 at its density maximum, where rapid compression causes no temperature change."
    ],
    "refs": [
      "Bryan G. H., Thermodynamics: An Introductory Treatise Dealing Mainly with First Principles and Their Direct Applications (B. G. Teubner, Leipzig, 1907), Chapter III §33 (adiabatic and isothermal moduli in the ratio of the specific heats, equation (35)), Chapter XI §§113–116 (Maxwell’s relations; specific heats and moduli in terms of the potentials) and Chapter XII §121 (wave speed), pp. 22, 108–113, 119. Public-domain source; the method is restated in original words and no text, tables or figures are reproduced.",
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach (McGraw-Hill): thermodynamic property relations, c_p − c_v and the isothermal compressibility."
    ],
    "verify": [
      "Confirm whether the supplier quotes an isothermal or adiabatic, secant or tangent bulk modulus."
    ]
  },
  "gas-mixture-properties": {
    "purpose": "Properties of a mixture of up to three perfect gases from their molar masses, specific heats and mole fractions: the mixture molar mass and mass fractions, gas constant, specific heats and their ratio, density and speed of sound at the pressure and temperature entered, each component’s partial pressure by Dalton’s law, the entropy of mixing and the least work to separate the mixture into its pure gases, and a check of one component’s partial pressure against a maximum or minimum you set.",
    "uses": [
      "Find γ, R and density of a shielding, process or fuel gas blend for flow and compressor calculations",
      "Check a component’s partial pressure against a process, exposure or corrosion limit",
      "Estimate the least work any separation (membrane, PSA) can take"
    ],
    "users": [
      "Process and pneumatic engineers",
      "Welding and fabrication engineers",
      "Gas system designers"
    ],
    "inputs": {
      "M1": "Molar mass of the first gas, from its chemical formula or a property table.",
      "cp1": "Specific heat of the first gas at constant pressure per kilogram at the mixture temperature, from property tables.",
      "y1": "Share of the first gas by moles (equal to its share by volume for perfect gases), from the gas specification or analysis.",
      "M2": "Molar mass of the second gas.",
      "cp2": "Specific heat of the second gas at constant pressure per kilogram.",
      "y2": "Share of the second gas by moles; gas 3 makes up the rest to 100 %.",
      "M3": "Molar mass of the third gas, which makes up the rest of the mixture.",
      "cp3": "Specific heat of the third gas at constant pressure per kilogram.",
      "p": "Total absolute pressure of the mixture.",
      "T": "Temperature of the mixture.",
      "comp": "Which gas’s partial pressure is checked against your limit.",
      "kind": "Whether your limit is a maximum (the gas must stay below it) or a minimum (the gas must stay above it).",
      "lim": "Your partial pressure limit for that gas, from the process specification, an exposure standard or a corrosion criterion."
    },
    "outputs": [
      "Molar mass and mass fractions",
      "Gas constant, c_p, c_v and γ",
      "Density and speed of sound",
      "Partial pressures",
      "Entropy of mixing and least separation work",
      "Verdict on the partial pressure limit"
    ],
    "method": [
      "Gas 3 mole fraction y₃ = 100 % − y₁ − y₂; molar mass M = Σ yᵢ Mᵢ and mass fractions xᵢ = yᵢ Mᵢ ÷ M.",
      "Gas constant R = R̄ ÷ M, equal to Σ xᵢ Rᵢ (Bryan §124, equation (166)); c_p = Σ xᵢ c_p,ᵢ and c_v = c_p − R (Bryan §124, equations (168)–(169), and §121, c_p − c_v = R); γ = c_p ÷ c_v.",
      "Dalton’s law: each partial pressure pᵢ = yᵢ p (Bryan §124); density ρ = p ÷ (R T); speed of sound a = √(γ R T) (Bryan §121).",
      "Entropy of mixing per kilogram Δs = −R Σ yᵢ ln yᵢ, the constant C of Bryan §127 equation (179); the least work to separate the mixture into its pure gases at T is T Δs (Bryan §§126–128).",
      "Example: 82 % argon and 18 % carbon dioxide at 101.325 kPa and 20 °C has M = 40.68 kg/kmol, R = 0.2044 kJ/(kg·K), γ = 1.539, ρ = 1.691 kg/m³ and a CO₂ partial pressure of 18.24 kPa."
    ],
    "limitations": [
      "Perfect gases with constant specific heats: at high pressure, low temperature or near condensation of a component use real-gas data.",
      "The least separation work is for complete separation into pure gases; a process taking out one product at partial recovery has a different (smaller) minimum.",
      "Specific heats must be entered for the mixture temperature; they are not looked up.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Mixing a monatomic gas such as argon with a polyatomic one lowers γ from 1.67 towards the polyatomic value, which changes nozzle and compressor behaviour.",
      "The separation work is the reason gas separation always needs energy input; a real membrane or PSA unit uses much more than this minimum."
    ],
    "refs": [
      "Bryan G. H., Thermodynamics: An Introductory Treatise Dealing Mainly with First Principles and Their Direct Applications (B. G. Teubner, Leipzig, 1907), Chapter XII §§121, 124–128 (specific heats and adiabatics of perfect gases; gas mixtures, Dalton’s law, gain of entropy and loss of available energy by diffusion), pp. 119, 121–126. Public-domain source; the method is restated in original words and no text, tables or figures are reproduced.",
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach (McGraw-Hill): gas mixtures, Dalton’s law and properties of ideal-gas mixtures.",
      "NIST Chemistry WebBook, https://webbook.nist.gov/chemistry/: molar masses and specific heats of the component gases."
    ],
    "verify": [
      "Confirm the mixture analysis from the gas supplier’s certificate before using a partial pressure for a safety decision."
    ]
  },
  "thermoelectric-cooler-check": {
    "purpose": "Thermoelectric cooler (TEC) performance from the ideal module model: the module Seebeck coefficient, electrical resistance and thermal conductance worked out from the datasheet maximum current, maximum voltage and maximum temperature difference at the rated hot-side temperature, then at your operating current and temperatures the heat pumped from the cold side (junction heat less half the Joule heat less conduction back), the electrical power and voltage, COP, the heat to reject at the hot side, the current for the most heat pumped, and checks against the heat load and the module ratings.",
    "uses": [
      "Size thermoelectric modules for an electronics or sensor enclosure, a sample cooler or a small cold plate",
      "Find the hot-side heat the heat sink must reject",
      "Choose an operating current between capacity and COP"
    ],
    "users": [
      "Electronics and product designers",
      "Thermal engineers",
      "Instrument and test rig designers"
    ],
    "inputs": {
      "Imax": "Current at which the module reaches its maximum temperature difference, from the datasheet (I_max).",
      "Vmax": "Voltage across the module at the maximum current, from the datasheet (V_max).",
      "dTmax": "Largest temperature difference the module can hold with no heat load, from the datasheet (ΔT_max).",
      "Thr": "Hot-side temperature at which the datasheet ratings are given, usually 25 °C, 27 °C or 50 °C.",
      "I": "Current through each module at the operating point, from your driver design.",
      "Th": "Temperature of the module’s hot face, which depends on the heat sink: heat sink temperature plus the interface rise.",
      "Tc": "Temperature of the module’s cold face, a little below the temperature of the part or air being cooled.",
      "n": "Number of identical modules sharing the load, all at the same current and temperatures.",
      "Qreq": "Total heat that must be removed from the cooled side: the electronics dissipation plus heat leaking in through insulation and seals."
    },
    "outputs": [
      "Module Seebeck coefficient, resistance and conductance",
      "Heat pumped per module and in total",
      "Voltage, power and COP",
      "Hot-side heat to reject",
      "Verdict against the heat load and the ratings"
    ],
    "method": [
      "At a junction between two conductors the heat absorbed or released by a current is proportional to the absolute temperature, Π = S T (Bryan §164, equations (301)–(303); the Kelvin relations), with S the module Seebeck coefficient.",
      "Ideal module model: cold-side heat Q_c = S I T_c − ½ I² R − K ΔT, power P = S I ΔT + I² R, voltage V = S ΔT + I R, hot-side heat Q_h = Q_c + P and COP = Q_c ÷ P, with ΔT = T_h − T_c.",
      "From the datasheet point (Q_c = 0 at I_max and ΔT_max, hot side at T_hr): S = V_max ÷ T_hr, R = (T_hr − ΔT_max) V_max ÷ (T_hr I_max) and K = (T_hr − ΔT_max) V_max I_max ÷ (2 T_hr ΔT_max), all temperatures absolute.",
      "The current for the most heat pumped is S T_c ÷ R.",
      "Example: a 6 A, 15.4 V, 68 K module at 3.5 A between 40 °C and 10 °C pumps 22.9 W for 29.7 W of power (COP 0.77) and rejects 52.6 W; two modules pump 45.8 W."
    ],
    "limitations": [
      "Constant S, R and K fitted at one rated point; real module properties vary with temperature and the Thomson effect is neglected.",
      "The hot- and cold-face temperatures are inputs: the heat sink, interface materials and insulation must be designed so they are reached.",
      "Steady state only; condensation on the cold side below the dew point must be prevented separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "COP falls steeply as current rises towards the maximum: running below the current for maximum heat pumped, with more modules, usually saves power and heat sink size.",
      "The heat sink must reject the heat pumped plus all the electrical power, in the example more than twice the heat pumped."
    ],
    "refs": [
      "Bryan G. H., Thermodynamics: An Introductory Treatise Dealing Mainly with First Principles and Their Direct Applications (B. G. Teubner, Leipzig, 1907), Chapter XVI §§164–166 (junction and Kelvin thermoelectric effects; junction coefficient proportional to absolute temperature), pp. 167–173. Public-domain source; the method is restated in original words and no text, tables or figures are reproduced.",
      "Rowe D. M. (editor), CRC Handbook of Thermoelectrics (CRC Press, 1995): thermoelectric refrigeration, module performance equations.",
      "Ioffe A. F., Semiconductor Thermoelements and Thermoelectric Cooling (Infosearch, London, 1957)."
    ],
    "verify": [
      "Compare the result with the module maker’s performance curves at your hot-side temperature."
    ]
  }
});
