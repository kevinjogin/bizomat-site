// MAKEOS methods, input sources and limits for the thermodynamics topic tools (batch greiner).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "blocked-in-liquid-pressure-check": {
    "purpose": "Pressure rise in a liquid trapped between closed valves (or in a sealed vessel) as it warms: the liquid’s volumetric expansion coefficient less the container’s, divided by the liquid’s compressibility (1 ÷ bulk modulus) plus the stretch of a thin pipe wall under pressure (inside diameter ÷ modulus × wall, with the restraint factor for free ends, anchored pipe or expansion joints), gives the pressure rise per kelvin; from it the pressure after the warming you enter, the warming that would reach your limit, and the hoop stress at the final pressure.",
    "uses": [
      "Decide whether a section of pipe that can be isolated needs a thermal relief valve",
      "Check a sealed hydraulic line, heat-transfer oil line or water-filled vessel left in the sun",
      "Explain to operators why a full, closed line must not be heated"
    ],
    "users": [
      "Piping and process engineers",
      "Hydraulic and maintenance engineers",
      "Commissioning and operations staff"
    ],
    "inputs": {
      "beta": "Volumetric expansion coefficient of the liquid over the temperature range, from the fluid supplier’s data sheet or property data (water near 20 °C about 210, mineral hydraulic oil several times larger).",
      "K": "Isothermal bulk modulus of the liquid at the working pressure and temperature, from the fluid data sheet (compressibility is its inverse).",
      "dT": "How much the trapped liquid can warm after it is blocked in: sun, tracing, a hot process or a warm room.",
      "p0": "Gauge pressure of the liquid at the moment the valves were closed.",
      "pd": "The lower of the design pressure of the weakest component in the blocked section and the set pressure of any relief device.",
      "wall": "How the container responds: rigid (no wall stretch, conservative) or a thin-wall pipe with its axial restraint.",
      "D": "Inside diameter of the pipe (not used for a rigid container).",
      "e": "Wall thickness of the pipe, less any corrosion allowance you want to ignore (not used for a rigid container).",
      "E": "Elastic modulus of the pipe material at the working temperature (steel about 200 GPa).",
      "nu": "Poisson’s ratio of the pipe material (steel about 0.3).",
      "aS": "Linear expansion coefficient of the pipe or vessel material (carbon steel about 12); the container’s volume grows three times as fast."
    },
    "outputs": [
      "Pressure rise per kelvin of warming",
      "Pressure rise and final pressure for the warming entered",
      "Warming that reaches the limit",
      "Hoop stress at the final pressure"
    ],
    "method": [
      "For a liquid, V(T, p) = V₀[1 + β(T − T₀) − κ(p − p₀)] with κ = 1 ÷ K, so at constant volume (∂p/∂T)ᵥ = β ÷ κ (Greiner eqs 1.37–1.39 and 4.142–4.143).",
      "The container also grows: its volume rises by 3αₛ per kelvin, and a thin pipe’s volume grows by c₁ D ÷ (E e) per unit pressure, the volumetric strain 2ε_θ + ε_z from Hooke’s law with hoop stress pD ÷ (2e) and the axial stress set by the restraint: c₁ = 1 − ν² anchored (no axial strain), 5/4 − ν with closed ends free (axial stress pD ÷ 4e) and 1 − ν/2 with expansion joints (no axial stress); a rigid container takes c₁ = 0.",
      "Pressure rise per kelvin = (β − 3αₛ) ÷ (1 ÷ K + c₁ D ÷ (E e)); final pressure = p₀ + rate × ΔT; warming to the limit = (limit − p₀) ÷ rate; hoop stress = p D ÷ (2e).",
      "Example: the pressure rises 3.3745 bar for every kelvin, so 10 K of warming takes it to 38.745 bar g against a limit of 16 bar g; the limit is reached after 3.2598 K."
    ],
    "limitations": [
      "The section must be completely full of liquid: a gas or vapour pocket absorbs the expansion and the real rise is far smaller; even a small pocket matters.",
      "Coefficients are taken as constant over the range; for large warming or pressures of several hundred bar, use the average β and K over the range.",
      "Thin-wall elastic pipe; valves, flanges, hoses and fittings in the section stretch differently, and yielding or leakage past valve seats is ignored.",
      "Screening aid only: relief requirements for real pressure systems are set by the applicable code and a qualified engineer.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Because liquids are nearly incompressible, a few kelvin of warming can add tens of bar; this is why a blocked-in liquid section normally needs thermal relief or a procedure that never leaves it full and closed.",
      "The “liquid share of the stiffness” shows whether the liquid or the pipe wall controls the rise: for steel pipe the liquid usually dominates, so making the pipe stronger does not remove the problem."
    ],
    "refs": [
      "Greiner W., Neise L. and Stöcker H., Thermodynamics and Statistical Mechanics (Springer-Verlag, New York, 1995), pp. 22, 111: linear equation of state of a liquid (expansion coefficient α and compressibility κ, eqs 1.37–1.39) and (∂p/∂T)ᵥ = α ÷ κ (eqs 4.142–4.143). Method reference; no text, tables or worked examples are reproduced.",
      "Timoshenko S. P. and Gere J. M., Mechanics of Materials (PWS Publishing): thin-walled cylindrical pressure vessels and the generalised Hooke’s law used for the volumetric strain of the pipe.",
      "API Standard 521, Pressure-relieving and Depressuring Systems: hydraulic (thermal) expansion of blocked-in liquid as an overpressure cause; requirements are not reproduced here."
    ]
  },
  "gas-cylinder-real-gas-duration": {
    "purpose": "Contents of a compressed (non-liquefied) gas cylinder from its water capacity, pressure and temperature, using the compressibility factor Z of a cubic equation of state built from the gas’s critical temperature and pressure: Peng–Robinson (with the acentric factor) or van der Waals (critical constants only), the other shown for comparison, together with the ideal-gas figure. From the contents at the full and lowest usable pressures it gives the usable gas in kilograms and standard litres and how long it lasts at your usage rate, against the time it must last.",
    "uses": [
      "Check how long a nitrogen, argon or oxygen cylinder lasts on a purge, shielding or test duty",
      "See how far the ideal gas law misstates the contents at high pressure",
      "Decide whether a shift needs a spare cylinder or a manifold"
    ],
    "users": [
      "Maintenance and process engineers",
      "Welding and fabrication supervisors",
      "Laboratory and test staff"
    ],
    "inputs": {
      "eos": "Peng–Robinson is the better general choice for simple gases; van der Waals needs only the critical constants and is mainly for comparison.",
      "V": "Water capacity stamped on the cylinder (internal volume), for example 50 L for a large industrial cylinder.",
      "pFull": "Gauge pressure on the cylinder contents gauge now (or the filled pressure on the label).",
      "pMin": "Lowest cylinder gauge pressure at which the regulator still delivers your outlet pressure and flow, or the residual pressure your supplier asks you to leave.",
      "T": "Temperature of the gas in the cylinder, normally the room or outdoor temperature once the cylinder has settled.",
      "M": "Molar mass of the gas, from property data (nitrogen 28.014, argon 39.948, oxygen 31.999).",
      "Tc": "Critical temperature of the gas, from the NIST Chemistry WebBook or a property data book.",
      "pc": "Critical pressure of the gas, from the same source as the critical temperature.",
      "w": "Acentric factor of the gas, from the same property data book (nitrogen about 0.037, argon about 0).",
      "Q": "Gas used per minute, measured or set on a flowmeter, expressed at the reference temperature and 101.325 kPa (standard litres per minute).",
      "Tref": "Temperature that defines your standard litres; 15 °C and 0 °C are both in use, so check the flowmeter or supplier basis.",
      "need": "How long the job, shift or test must run on this cylinder.",
      "pAtm": "Local atmospheric pressure, used to turn gauge pressures into absolute (101.325 kPa at sea level)."
    },
    "outputs": [
      "Compressibility factor and contents now (kg), with the ideal-gas and other-equation figures",
      "Usable gas down to the lowest pressure (kg and standard litres)",
      "Running time at the use rate against the time needed"
    ],
    "method": [
      "Real gas: pV = Z n R T, with Z the largest root of the cubic equation of state at the absolute pressure and temperature. van der Waals (Greiner eq. 1.33): Z³ − (1 + B)Z² + AZ − AB = 0 with a = 27R²T꜀² ÷ (64p꜀) and b = RT꜀ ÷ (8p꜀) from the critical point (Greiner eqs 3.25–3.27).",
      "Peng–Robinson: a = 0.45724 R²T꜀² ÷ p꜀ × [1 + κ(1 − √(T ÷ T꜀))]², b = 0.07780 RT꜀ ÷ p꜀, κ = 0.37464 + 1.54226ω − 0.26992ω², and Z³ − (1 − B)Z² + (A − 3B² − 2B)Z − (AB − B² − B³) = 0, with A = ap ÷ (RT)² and B = bp ÷ (RT).",
      "Usable moles = n(full) − n(lowest); standard litres = moles × R T_ref ÷ 101.325 kPa; running time = standard litres ÷ use rate.",
      "Example: Z = 1.0228, so the cylinder holds 11.294 kg (ideal gas 11.552 kg); 8,995.9 standard litres are usable, lasting 9.9954 h against 8 h needed."
    ],
    "limitations": [
      "Compressed gases above their critical temperature only; liquefied gases (CO₂, LPG, ammonia) are refused, because their contents are set by weight and vapour pressure.",
      "Cubic equations of state are approximations: they are least reliable near the critical point and for hydrogen and helium; for custody transfer or safety-critical quantities use the supplier’s contents data or a reference equation of state.",
      "The gas is taken at one uniform temperature; fast withdrawal cools the cylinder and lowers the pressure, so the gauge reads low until it warms again.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "At the same gauge reading, a gas with Z above 1 (nitrogen, hydrogen at room temperature) holds less than the ideal gas law suggests, and one with Z below 1 (argon, oxygen, methane) holds more.",
      "When the two equations of state disagree by more than a few per cent, treat the contents as uncertain and confirm them by weighing or with the supplier’s data."
    ],
    "refs": [
      "Greiner W., Neise L. and Stöcker H., Thermodynamics and Statistical Mechanics (Springer-Verlag, New York, 1995), pp. 17–20, 67–70: van der Waals equation of state (eq. 1.33) and its critical constants (eqs 3.23–3.28). Method reference; no text, tables or worked examples are reproduced.",
      "Peng D.-Y. and Robinson D. B., A New Two-Constant Equation of State, Industrial & Engineering Chemistry Fundamentals 15 (1976) 59–64.",
      "Poling B. E., Prausnitz J. M. and O’Connell J. P., The Properties of Gases and Liquids, 5th edition (McGraw-Hill, 2001): critical constants and acentric factors; no values are reproduced here.",
      "NIST Chemistry WebBook, NIST Standard Reference Database 69 (webbook.nist.gov): a source for the property values you enter; no data are reproduced here."
    ]
  },
  "boiling-point-at-pressure": {
    "purpose": "Boiling point and vapour pressure of a liquid away from a known point, by the integrated Clausius–Clapeyron equation (vapour treated as an ideal gas, latent heat taken as constant): from a known boiling point and its pressure, the latent heat of vaporisation and the molar mass, it gives the boiling temperature at the operating pressure, the vapour pressure at the liquid’s highest temperature, the margin between them against the margin you require, and how far the estimate is taken from its reference point.",
    "uses": [
      "Set the vacuum for drying, degassing or distillation without boiling the liquid",
      "Check that a hot liquid will not flash where the pressure drops",
      "Estimate the boiling point at a site’s lower atmospheric pressure"
    ],
    "users": [
      "Process and chemical engineers",
      "Maintenance engineers",
      "Laboratory and quality staff"
    ],
    "inputs": {
      "Tb0": "A boiling point you trust: the normal boiling point at 101.325 kPa from property data, or a measured point nearer the operating condition.",
      "p0": "The absolute pressure that goes with that boiling point.",
      "L": "Latent heat of vaporisation near the temperatures of interest, from property data (water 2257 kJ/kg at 100 °C, larger at lower temperatures).",
      "M": "Molar mass of the liquid (water 18.015 g/mol).",
      "p": "Absolute pressure above the liquid surface: vacuum gauge reading in absolute terms, local atmospheric pressure or the vessel pressure.",
      "Tl": "Highest temperature the liquid reaches in the process, at the point where the pressure is lowest.",
      "margin": "How far below its boiling point you want the liquid to stay, to allow for measurement error, hot spots and the approximation."
    },
    "outputs": [
      "Boiling point at the operating pressure",
      "Vapour pressure at the liquid temperature",
      "Margin to boiling against the margin required"
    ],
    "method": [
      "Clausius–Clapeyron with the vapour as an ideal gas and the liquid volume neglected: dp/dT = p ΔH ÷ (R T²) (Greiner eqs 3.13–3.14), with ΔH = L × M the molar latent heat.",
      "Integrated between the known point and the operating point (Greiner eq. 3.15): 1/T_b = 1/T₀ − (R ÷ ΔH) ln(p ÷ p₀) and p_v(T) = p₀ exp[−(ΔH ÷ R)(1/T − 1/T₀)].",
      "Margin = T_b − T_liquid; the slope of the vapour-pressure curve at the boiling point, p ΔH ÷ (R T_b²), shows how much the boiling point moves for a small pressure change.",
      "Example: at 20 kPa abs the liquid boils at 58.889 °C; at 50 °C its vapour pressure is 13.338 kPa abs, a margin of 8.8895 K."
    ],
    "limitations": [
      "Latent heat is taken as constant and the vapour as ideal, so the error grows with the distance from the reference point and near the critical point; for water the estimate from 100 °C runs about 1 K low at 20 kPa abs. Use steam tables (IAPWS-IF97) or measured vapour-pressure data where accuracy matters.",
      "Pure liquids only: dissolved solids raise and volatile components lower the boiling point, and mixtures boil over a range.",
      "The pressure is the pressure at the liquid surface; hydrostatic head raises the boiling point lower in a deep vessel.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Under vacuum the boiling point falls fast: halving the absolute pressure lowers it by tens of kelvin for water near room temperature, which is why vacuum drying works at low temperature.",
      "A margin of zero or less means the liquid boils or flashes at the stated conditions; small margins are easily lost to temperature errors or local hot spots."
    ],
    "refs": [
      "Greiner W., Neise L. and Stöcker H., Thermodynamics and Statistical Mechanics (Springer-Verlag, New York, 1995), pp. 64–67: Clausius–Clapeyron equation (eqs 3.13–3.14) and the vapour pressure of a liquid with constant evaporation heat (Exercise 3.2, eq. 3.15). Method reference; no text, tables or worked examples are reproduced.",
      "NIST Chemistry WebBook, NIST Standard Reference Database 69 (webbook.nist.gov): a source for the property values you enter; no data are reproduced here.",
      "IAPWS-IF97, Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam (International Association for the Properties of Water and Steam): reference saturation data for water."
    ]
  },
  "carnot-limit-check": {
    "purpose": "Second-law check of a cyclic machine between a hot and a cold temperature: the Carnot limit for a heat pump (T_h ÷ (T_h − T_c)), a chiller (T_c ÷ (T_h − T_c)) or a heat engine (1 − T_c ÷ T_h), the actual COP or efficiency from the useful output and the input, the second-law efficiency (actual ÷ limit) against your acceptance level, and the yearly input energy and its cost; for a heat pump also the saving against heating with direct electric resistance at the same price.",
    "uses": [
      "Test a supplier’s COP or efficiency claim against what physics allows",
      "Compare heat pumps or chillers on how close they come to the limit",
      "Estimate running cost and the saving of a heat pump over resistance heating"
    ],
    "users": [
      "Mechanical and building services engineers",
      "Energy and facilities managers",
      "Buyers comparing quotations"
    ],
    "inputs": {
      "mode": "What the machine is for: a heat pump delivers heat, a chiller removes heat, an engine turns heat into work.",
      "Th": "Temperature at which heat is delivered (heat pump, chiller) or taken in (engine): the water or air leaving the hot side at the rating point.",
      "Tc": "Temperature at which heat is taken in (heat pump, chiller) or rejected (engine): the source water or outdoor air at the rating point.",
      "out": "Rated or measured useful output at these temperatures: heating capacity, cooling capacity or shaft work.",
      "inp": "Rated or measured input at the same conditions: electrical power for a heat pump or chiller, heat (fuel) input for an engine.",
      "etaMin": "The second-law efficiency below which you would question the machine or the claim; set it from your own comparisons.",
      "hours": "Equivalent full-load hours a year at this output.",
      "price": "What one kilowatt-hour of the input energy costs you, including GST for a household (exclude it for a GST-registered business)."
    },
    "outputs": [
      "Actual COP or efficiency and the Carnot limit",
      "Second-law efficiency against your acceptance level",
      "Yearly input energy and cost (and, for a heat pump, the saving over direct electric heating)"
    ],
    "method": [
      "Carnot efficiency of a reversible engine between T_h and T_c: η = 1 − T_c ÷ T_h, in kelvin (Greiner eq. 2.56); reversed, the same cycle is the best possible heat pump, COP_h = T_h ÷ (T_h − T_c), or chiller, COP_c = T_c ÷ (T_h − T_c) (Greiner eqs 2.63–2.65).",
      "Actual COP or efficiency = useful output ÷ input; second-law efficiency = actual ÷ Carnot limit. Above 100 % the claim breaks the second law as stated.",
      "Yearly input energy = input × hours; cost = energy × price; heat pump saving = output × hours × price − input cost (direct resistance heating needs one kilowatt-hour per kilowatt-hour of heat).",
      "Example: actual 3.4286 against a Carnot limit of 6.8365, a second-law efficiency of 50.151 %; 7,000 kWh a year costs A$2,100."
    ],
    "limitations": [
      "The Carnot limit is the absolute ceiling for the temperatures entered; real machines also lose to the temperature differences across their heat exchangers, so use the source and sink temperatures at the rating point.",
      "One operating point: seasonal performance depends on how the temperatures and load vary through the year.",
      "Ratings to compare must be at the same conditions; heat pump and air-conditioner ratings in Australia follow the AS/NZS 3823 series of test conditions.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Real vapour-compression machines fall well short of the Carnot limit because of heat-exchanger temperature differences and compressor losses; a claim close to the limit deserves its test conditions checked, and one above 100 % is impossible as stated.",
      "The limit falls as the temperature lift grows, so lowering the delivery temperature or raising the source temperature improves the COP more than most equipment choices."
    ],
    "refs": [
      "Greiner W., Neise L. and Stöcker H., Thermodynamics and Statistical Mechanics (Springer-Verlag, New York, 1995), pp. 52–58: thermodynamic engines, the Carnot efficiency (eq. 2.56) and heating with a heat pump against electricity (Exercise 2.7, eqs 2.63–2.65). Method reference; no text, tables or worked examples are reproduced.",
      "AS/NZS 3823 series, Performance of electrical appliances — Air conditioners and heat pumps: rating and test conditions; requirements are not reproduced here."
    ]
  },
  "compressed-gas-stored-energy": {
    "purpose": "Energy stored in an ideal gas compressed in a rigid vessel and settled at the ambient temperature: the isothermal expansion work pV ln(p ÷ p₀), the useful work (exergy) after the work of pushing back the atmosphere is taken away, the isentropic expansion energy and the Brode upper bound that hazard assessments use for a sudden rupture, the atmospheric air needed to fill the vessel and the compressor energy at your specific power, the share of that energy kept as exergy, and the gauge pressure × volume product against the limit you enter.",
    "uses": [
      "Show how much energy a receiver or test vessel holds before a pressure test or a change of size",
      "Compare the useful energy stored with the electricity used to fill it",
      "Check the pressure × volume product against the limit your classification or site rule uses"
    ],
    "users": [
      "Mechanical and pressure-equipment engineers",
      "Maintenance and safety staff",
      "Compressed-air system auditors"
    ],
    "inputs": {
      "V": "Internal (water) volume of the receiver or vessel from its nameplate or drawing.",
      "pg": "Gauge pressure of the gas: the working pressure, or the test pressure if the test is pneumatic.",
      "pa": "Local atmospheric pressure (101.325 kPa at sea level).",
      "k": "Ratio of specific heats of the gas (air and nitrogen about 1.4, argon and helium about 1.67).",
      "sp": "Compressor input power per cubic metre per minute of air delivered, measured at inlet conditions, from the compressor data sheet (for example a CAGI sheet) or an audit.",
      "pVlim": "The gauge pressure × volume above which your classification, standard or site rule treats the vessel differently; take it from that rule."
    },
    "outputs": [
      "Isothermal expansion work and exergy (useful work)",
      "Isentropic and Brode burst energies",
      "Air and compressor energy to fill, and the share kept as exergy",
      "pV product against your limit"
    ],
    "method": [
      "At constant temperature the reversible work equals the change in free energy (Greiner eq. 4.45); for an ideal gas expanding from p to p₀ this is W = pV ln(p ÷ p₀). Pushing back the atmosphere takes (p − p₀)V of it, leaving the exergy X = pV ln(p ÷ p₀) − (p − p₀)V.",
      "A sudden release is closer to adiabatic: isentropic expansion energy E = pV ÷ (γ − 1) × [1 − (p₀ ÷ p)^((γ − 1) ÷ γ)], and the Brode upper bound E_B = (p − p₀)V ÷ (γ − 1).",
      "Air to fill from atmospheric = (p − p₀)V ÷ p₀; fill energy = specific power × air volume ÷ 60 (kWh); pV product = gauge pressure (MPa) × volume (L).",
      "Example: 813.85 kJ of exergy (0.22607 kWh), 680.4 kJ isentropic and 1,250 kJ by Brode; pV = 500 MPa·L against a limit of 1000."
    ],
    "limitations": [
      "Ideal gas in a rigid vessel at ambient temperature; at high pressures real-gas behaviour changes the amount of gas stored (see the gas cylinder contents tool).",
      "Burst energies are upper-bound estimates of the energy released; how much becomes blast, fragment or thermal energy depends on the failure and is not modelled.",
      "Screening aid only: pressure equipment design, testing and classification follow the applicable standards (for example AS 4343 hazard levels and AS 1210) and a qualified engineer.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The Brode figure is the largest of the three and is the cautious one for hazard screening; the exergy is the most a perfect air motor could ever recover.",
      "A pneumatic test stores far more energy than a hydrostatic test at the same pressure, because a liquid stores almost none; this is why hydrostatic testing is preferred."
    ],
    "refs": [
      "Greiner W., Neise L. and Stöcker H., Thermodynamics and Statistical Mechanics (Springer-Verlag, New York, 1995), pp. 52–53, 91–95: reversible and irreversible expansion work (eq. 2.50) and the free energy as the reversible work at constant temperature (eqs 4.45 and 4.53). Method reference; no text, tables or worked examples are reproduced.",
      "Crowl D. A. and Louvar J. F., Chemical Process Safety: Fundamentals with Applications (Prentice Hall): energy of a compressed gas release by the Brode, isothermal, isentropic and thermodynamic-availability expressions.",
      "AS 4343, Pressure equipment — Hazard levels: hazard level depends on the pressure, volume and contents; levels are not reproduced here.",
      "Compressed Air and Gas Institute (CAGI) performance data sheets: compressor specific power."
    ]
  },
  "gas-generator-energy-check": {
    "purpose": "Second-law check of an on-site gas generator (PSA, membrane or other) treating air as a two-part oxygen–nitrogen mixture of ideal gases: the oxygen content of the waste stream from the oxygen balance, the minimum (reversible, isothermal) work of separation from the entropy of mixing, RT[Σ n x ln x] of the products less that of the feed, per cubic metre of product at your reference temperature, the lowest minimum with complete recovery, the recovery of the wanted gas, the second-law efficiency of the generator’s actual specific energy, and the yearly energy and cost at your flow, hours and tariff.",
    "uses": [
      "Check a supplier’s specific energy claim for a nitrogen or oxygen generator",
      "Compare generators of different purity and air factor on the same basis",
      "Estimate the yearly electricity cost of on-site gas"
    ],
    "users": [
      "Process and utilities engineers",
      "Energy managers",
      "Buyers comparing generator quotations"
    ],
    "inputs": {
      "xF": "Oxygen content of the air drawn in; dry air is 20.95 % by volume, and argon is counted with the nitrogen here.",
      "xP": "Oxygen content of the product: the residual oxygen for a nitrogen generator (1 % for 99 % nitrogen) or the purity for an oxygen generator.",
      "AF": "Volume of air the generator takes in for each volume of product, from the supplier’s data at your purity (it rises steeply for higher purity).",
      "T": "Temperature at which the separation takes place, normally near ambient for PSA and membrane units.",
      "Q": "Product flow at the reference conditions.",
      "Tref": "Temperature that defines the cubic metres of the flow and specific energy (0 °C for normal cubic metres, 15 or 20 °C in some data sheets).",
      "SE": "Electrical energy per cubic metre of product, including the air compressor and dryer, from the supplier’s data or your own meter readings.",
      "hours": "Hours a year the generator runs at this flow.",
      "price": "Electricity price per kilowatt-hour on one GST basis."
    },
    "outputs": [
      "Oxygen content of the waste stream and recovery of the wanted gas",
      "Minimum separation work at this air factor and with complete recovery",
      "Second-law efficiency of the actual specific energy",
      "Yearly energy and cost"
    ],
    "method": [
      "Mixing different ideal gases at the same temperature and pressure raises the entropy by ΔS = −nR Σ xᵢ ln xᵢ (Greiner eq. 5.40); at constant temperature the reversible work to undo it is the rise in free energy, T ΔS (Greiner eq. 4.45).",
      "Per mole of product with air factor AF: waste oxygen x_W = (AF x_F − x_P) ÷ (AF − 1); W_min = RT[g(x_P) + (AF − 1) g(x_W) − AF g(x_F)], with g(x) = x ln x + (1 − x) ln(1 − x). As AF grows without limit the minimum falls to RT[g(x_P) − g(x_F) − (x_P − x_F) ln(x_F ÷ (1 − x_F))].",
      "Per cubic metre of product: W_min × 101.325 kPa ÷ (R T_ref); second-law efficiency = W_min ÷ actual specific energy; yearly energy = flow × hours × specific energy.",
      "Example: the minimum is 0.0074574 kWh/m³ against 0.3 kWh/m³ actual, a second-law efficiency of 2.4858 %; 60,000 kWh a year costs A$15,000."
    ],
    "limitations": [
      "Air is treated as a two-part ideal mixture of oxygen and nitrogen, with argon counted as nitrogen; real nitrogen generators pass most of the argon into the product, and oxygen generators pass part of it.",
      "The minimum work assumes products and waste leave at the feed temperature and pressure; product delivered at pressure needs further compression work that is not included.",
      "The actual specific energy must include the air compressor, since that is where nearly all the energy goes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Practical generators use many times the minimum work, because the air is compressed and then most of it is vented; a low second-law efficiency is normal, but comparing generators on it at the same purity shows which wastes least.",
      "Raising the purity raises the air factor steeply, so specifying higher purity than the process needs is the most common avoidable cost."
    ],
    "refs": [
      "Greiner W., Neise L. and Stöcker H., Thermodynamics and Statistical Mechanics (Springer-Verlag, New York, 1995), pp. 132–134, 91–93: entropy of mixing of different ideal gases (Gibbs’ paradox, eq. 5.40) and the free energy as the reversible work at constant temperature (eq. 4.45). Method reference; no text, tables or worked examples are reproduced.",
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach (McGraw-Hill): exergy and the minimum work of separating a mixture."
    ]
  },
  "quench-tank-temperature-check": {
    "purpose": "Heat balance of a quench: the mixture (equilibrium) temperature of a hot load and the bath from their heat capacities (mass × mean specific heat) and starting temperatures, the bath temperature rise and heat released per load, the entropy generated, the number of loads in a row the bath can take before it passes its highest allowed temperature with no cooling, and the average heat input at your loads per hour against the cooler capacity.",
    "uses": [
      "Size a quench tank or check an existing one for a heavier load",
      "Check whether the oil cooler keeps up with the load rate",
      "Plan how many loads can go in before the bath must cool"
    ],
    "users": [
      "Heat-treatment engineers and supervisors",
      "Maintenance engineers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "m": "Mass of everything that goes into the bath hot: parts, basket, fixtures and grids.",
      "c": "Mean specific heat of the load between the quench-in and bath temperatures, from material data; for steel include the heat of transformation if your data give it separately.",
      "Tl": "Temperature of the load as it enters the bath (the furnace temperature less any cooling in transfer).",
      "Vq": "Volume of quenchant in the tank at its working level.",
      "rho": "Density of the quenchant at its working temperature, from the supplier’s data sheet.",
      "cq": "Specific heat of the quenchant at its working temperature, from the supplier’s data sheet.",
      "Tb": "Temperature of the bath just before the load goes in.",
      "Tmax": "Highest bath temperature allowed by the quenchant supplier, the process specification or the fire-safety margin below the flash point.",
      "rate": "Average number of loads quenched per hour.",
      "cool": "Heat the bath cooler can remove at the working bath temperature, from its data sheet (0 if there is no cooler)."
    },
    "outputs": [
      "Equilibrium bath temperature and rise per load",
      "Heat released and entropy generated per load",
      "Loads in a row before the limit with no cooling",
      "Average heat input against the cooler capacity"
    ],
    "method": [
      "With no work and no heat loss, the heat given up by the load equals the heat taken by the bath: T_f = (C_L T_L + C_B T_B) ÷ (C_L + C_B), with C = mass × specific heat (Greiner Exercise 2.6, the “mixture temperature” of an irreversible process).",
      "Entropy generated = C_L ln(T_f ÷ T_L) + C_B ln(T_f ÷ T_B) in kelvin, always positive (Greiner Exercise 2.6); heat per load Q = C_L (T_L − T_f).",
      "Loads in a row: repeat the balance from each new bath temperature until it passes the limit; average heat input = Q × loads per hour ÷ 3600 against the cooler capacity.",
      "Example: the bath settles at 73.39 °C, a rise of 13.39 K; each load releases 69.895 MJ, an average 38.831 kW against a 45 kW cooler."
    ],
    "limitations": [
      "Uniform, well-mixed bath and no loss to the tank, air or evaporation, so the rise is slightly overstated; local temperatures near the load are much higher, which matters for flash point and vapour.",
      "The load is taken all the way to the bath temperature; with short quench times the parts leave warmer and less heat goes into the bath.",
      "Mean specific heats only: the specific heat of steel changes strongly with temperature and through transformation.",
      "Fire safety of oil quenching (flash point, lid, extinguishing, agitation) is governed by the quenchant supplier’s data and the applicable rules; this is a screening aid.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A rise of more than a few kelvin per load means the bath is small for the load; a larger volume or a cooler sized from the average heat input keeps the quench repeatable.",
      "The entropy generated shows how irreversible the quench is; it is large because heat falls across hundreds of kelvin, the same reason the quench cools so fast."
    ],
    "refs": [
      "Greiner W., Neise L. and Stöcker H., Thermodynamics and Statistical Mechanics (Springer-Verlag, New York, 1995), pp. 55–56: mixture temperatures of two systems with constant heat capacities and the entropy changes of an irreversible mixing (Exercise 2.6). Method reference; no text, tables or worked examples are reproduced.",
      "ASM Handbook, Volume 4A: Steel Heat Treating Fundamentals and Processes (ASM International, 2013): quenching and quenchants."
    ]
  }
});
