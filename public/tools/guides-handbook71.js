// MAKEOS methods, input sources and limits for the classical thermodynamics tools (batch handbook71).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "trapped-liquid-pressure-check": {
    "purpose": "Pressure rise of a liquid trapped full in a closed pipe or vessel when it warms: the liquid’s volumetric expansion less the growth of the pipe, divided by the liquid’s compressibility plus the stretch of the pipe wall under pressure (thin-walled pipe with closed ends, or a rigid container as the upper bound), giving the pressure rise per kelvin, the final pressure, the largest temperature rise the design pressure allows, the hoop stress at the final pressure and the volume a thermal relief must release, against the design pressure or relief setting.",
    "uses": [
      "Decide whether a pipe section shut in between valves needs a thermal relief valve",
      "Check a hydraulic line or hose left blocked in while it warms in the sun",
      "Size the volume a thermal relief has to pass, and show how little that is"
    ],
    "users": [
      "Piping and process engineers",
      "Hydraulic engineers",
      "Maintenance and commissioning engineers"
    ],
    "inputs": {
      "beta": "Volumetric expansion coefficient of the liquid over the temperature range, from its property data.",
      "Kb": "Isothermal bulk modulus of the liquid (the reciprocal of its isothermal compressibility).",
      "dT": "How much the trapped liquid warms after it is shut in.",
      "p0": "Gauge pressure at the moment the valves were closed.",
      "wall": "Thin-walled pipe with closed ends that can stretch, or a rigid container for the upper bound.",
      "D": "Bore of the pipe.",
      "t": "Wall thickness of the pipe, less any corrosion allowance.",
      "E": "Modulus of elasticity of the pipe material.",
      "nu": "Poisson’s ratio of the pipe material.",
      "al": "Linear thermal expansion coefficient of the pipe material.",
      "L": "Length of pipe between the closed valves.",
      "pd": "Design pressure of the weakest component, or the relief valve setting."
    },
    "outputs": [
      "Pressure rise per kelvin and final pressure",
      "Largest temperature rise within the limit",
      "Trapped volume and volume a relief must release",
      "Hoop stress at the final pressure"
    ],
    "method": [
      "At constant volume the pressure rises at (∂p/∂T)_V = α ÷ κ, the volumetric expansion coefficient over the isothermal compressibility (Guggenheim §1.46); κ = 1 ÷ K.",
      "A thin-walled pipe with closed ends grows by 3α_w per kelvin and stretches by (D ÷ E t)(5/4 − ν) per unit pressure (hoop stress pD ÷ 2t, axial stress pD ÷ 4t), so Δp = (β − 3α_w) ΔT ÷ (1/K + (D ÷ E t)(5/4 − ν)). A rigid container drops the wall terms.",
      "Largest rise = (design pressure − initial pressure) ÷ rise per kelvin; relief volume = V [(β − 3α_w) ΔT − (p_d − p_0)(1/K + wall stretch)].",
      "Example: water shut in at 5 bar g in 20 m of DN50 steel pipe gains 3.2991 bar per kelvin, so 3 K takes it to 14.897 bar g against 16 bar g; 3.3342 K is the most it can take."
    ],
    "limitations": [
      "The liquid must fill the section with no gas or vapour; a gas pocket lowers the rise a great deal.",
      "Liquid properties are taken as constant over the rise; for large rises use mean values over the range.",
      "Thin-walled elastic pipe with free ends; flanges, fittings, valves, hoses and restrained buried pipe stretch differently.",
      "This is a screening aid: pressure piping design and relief are governed by AS 4041 and a qualified engineer’s review.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Liquids are nearly incompressible, so a few kelvin of warming can raise the pressure by tens of bar; the relief volume needed is only millilitres, which is why a small thermal relief valve is enough.",
      "The rigid-container result is the upper bound; pipe stretch and growth lower it (by about 28 % for the example’s water in steel pipe)."
    ],
    "refs": [
      "E. A. Guggenheim, Thermodynamics: An Advanced Treatment for Chemists and Physicists, 5th revised edition (North-Holland, 1967), §1.46 (thermal expansivity and isothermal compressibility). Method reference; no text, tables or examples are reproduced.",
      "Thin-walled cylinder strains from Hooke’s law with hoop stress pD ÷ 2t and axial stress pD ÷ 4t (standard elasticity).",
      "AS 4041, Pressure piping (Standards Australia): design pressure and pressure relief of piping. Scope reference only."
    ],
    "verify": [
      "Take β and K for the actual liquid at the working temperature; both change with temperature and, for oils, with grade."
    ]
  },
  "ro-concentrate-pressure-check": {
    "purpose": "Feed pressure check for a reverse osmosis stage: the molar concentration from the dissolved solids and the salt’s molar mass, the osmotic pressure from the osmotic coefficient, ions per formula unit and absolute temperature, the permeate and concentrate concentrations from the salt rejection and recovery by a solute balance, the net driving pressure at the feed end and at the concentrate end after the element pressure drop and permeate back pressure, and the least feed pressure that keeps the required net driving pressure at the concentrate end.",
    "uses": [
      "Check whether a high-pressure pump can reach the recovery you want",
      "See how much osmotic pressure rises as recovery increases",
      "Estimate the least feed pressure for a new feed water"
    ],
    "users": [
      "Water treatment engineers",
      "Process engineers",
      "Plant operators"
    ],
    "inputs": {
      "tds": "Total dissolved solids of the feed from a water analysis.",
      "M": "Molar mass of the salt the dissolved solids are counted as (sodium chloride for seawater-like water).",
      "nu": "Ions each formula unit releases in solution (2 for sodium chloride).",
      "phi": "Osmotic coefficient of the solution, from property data for the salt and concentration.",
      "T": "Feed water temperature.",
      "rec": "Permeate flow as a share of feed flow.",
      "rej": "Share of the salt the membrane holds back.",
      "pf": "Gauge pressure at the membrane inlet.",
      "dpe": "Pressure lost along the elements from feed to concentrate.",
      "pp": "Gauge pressure on the permeate side.",
      "ndp": "Least net driving pressure the membrane maker wants at the last element."
    },
    "outputs": [
      "Feed, concentrate and permeate osmotic pressures",
      "Net driving pressure at both ends",
      "Least feed pressure"
    ],
    "method": [
      "Molar concentration c = TDS ÷ M; osmotic pressure Π = φ ν c R T, the dilute-solution form of the osmotic pressure relation with the osmotic coefficient φ (Guggenheim §5.10, §5.16, §5.28).",
      "Permeate c_p = (1 − rejection) c_f; concentrate c_c = (c_f − r c_p) ÷ (1 − r) for recovery r, by a salt balance.",
      "Net driving pressure at the concentrate end = p_f − Δp_elements − p_permeate − (Π_c − Π_p); least feed pressure = required NDP + Δp_elements + p_permeate + Π_c − Π_p.",
      "Example: 35 g/L of sodium chloride at 25 °C has 27.318 bar of osmotic pressure; at 45 % recovery the concentrate reaches 49.557 bar, leaving 8.5797 bar of driving pressure from 60 bar g; 54.42 bar g is the least feed pressure."
    ],
    "limitations": [
      "One osmotic coefficient for all streams; it changes with concentration, so use a value for the concentrate where it matters.",
      "Salt at the membrane surface is more concentrated than the bulk (concentration polarisation), so the real osmotic pressure there is higher.",
      "Mixed waters are treated as one salt; this is a screening check, and the membrane maker’s design program governs the final design.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The concentrate end sets the pressure: osmotic pressure there rises as 1 ÷ (1 − recovery), so the last few percent of recovery cost the most pressure.",
      "A negative driving pressure at the concentrate end means the last elements make no water."
    ],
    "refs": [
      "E. A. Guggenheim, Thermodynamics: An Advanced Treatment for Chemists and Physicists, 5th revised edition (North-Holland, 1967), §5.10 (osmotic coefficient), §5.16 (osmotic pressure), §5.28 (volume concentrations), §7.06–7.08 (electrolyte solutions). Method reference; no text, tables or examples are reproduced."
    ],
    "verify": [
      "Compare the least feed pressure with the membrane maker’s projection for the same water analysis and temperature."
    ]
  },
  "ph-electrode-calibration-check": {
    "purpose": "Two-point pH electrode calibration check: the ideal Nernst slope ln 10 × RT/F at the calibration temperature, the measured slope from the two buffer readings and its percentage of ideal, the offset (the reading at pH 7) and the pH at which the electrode reads zero, and the sample pH from its millivolt reading with the slope scaled to the sample’s absolute temperature, against the user’s slope and offset acceptance limits.",
    "uses": [
      "Accept or reject a pH electrode after its routine calibration",
      "Work out a sample pH from a millivolt reading by hand",
      "Record calibration evidence for a quality system"
    ],
    "users": [
      "Laboratory and quality technicians",
      "Water and wastewater operators",
      "Instrument technicians"
    ],
    "inputs": {
      "pH1": "First buffer’s pH at the calibration temperature, from its certificate.",
      "E1": "Millivolt reading in the first buffer.",
      "pH2": "Second buffer’s pH at the calibration temperature.",
      "E2": "Millivolt reading in the second buffer.",
      "Tc": "Temperature of the buffers during calibration.",
      "sMin": "Lowest slope your procedure accepts, as a percentage of ideal.",
      "sMax": "Highest slope your procedure accepts.",
      "offMax": "Largest offset at pH 7 your procedure accepts.",
      "Es": "Millivolt reading in the sample.",
      "Ts": "Temperature of the sample."
    },
    "outputs": [
      "Ideal and measured slope, and slope percentage",
      "Offset and zero-reading pH",
      "Sample pH at its own temperature"
    ],
    "method": [
      "Ideal slope S = ln 10 × R T ÷ F, from the Nernst relation for the electrochemical potential of the hydrogen ion (Guggenheim ch. 8); R and F are exact SI constants, giving 59.159 mV per pH at 25 °C.",
      "Measured slope = (E₂ − E₁) ÷ (pH₁ − pH₂); offset = E₁ + S (pH₁ − 7); zero-reading pH = pH₁ + E₁ ÷ S.",
      "Sample pH = zero-reading pH − E_s ÷ S_s, where S_s = S × T_s ÷ T_c in kelvin (temperature compensation of the slope).",
      "Example: 171 mV across pH 7.00 and 4.01 is 57.191 mV per pH, 96.672 % of ideal at 25 °C with −3 mV offset; a 50 mV sample reads pH 6.0733."
    ],
    "limitations": [
      "Straight-line response between and near the buffers; two points cannot show non-linearity.",
      "The slope is scaled about the zero-reading point; the true isothermal intersection of a real electrode may differ slightly.",
      "Temperature compensation corrects the electrode slope only, not the real change of the sample’s pH with temperature.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A slope well below ideal usually means a dirty, dehydrated or ageing glass membrane; a large offset points to the reference junction or filling solution.",
      "Bracket the sample: calibrate with buffers either side of the pH you expect."
    ],
    "refs": [
      "E. A. Guggenheim, Thermodynamics: An Advanced Treatment for Chemists and Physicists, 5th revised edition (North-Holland, 1967), ch. 8, §8.03 (electrochemical potentials), §8.11 (general treatment of electromotive force), §8.12 (temperature dependence). Method reference; no text, tables or examples are reproduced.",
      "R. P. Buck et al., Measurement of pH. Definition, standards, and procedures (IUPAC Recommendations 2002), Pure and Applied Chemistry 74(11), 2169–2200.",
      "BIPM, The International System of Units (SI Brochure), 9th edition (2019): the Boltzmann and Avogadro constants and the elementary charge are exact, so R and F are exact."
    ]
  },
  "clausius-boiling-margin-check": {
    "purpose": "Vapour pressure and boiling temperature from the integrated Clausius–Clapeyron relation, with a constant molar enthalpy of vaporisation and one known boiling point: the vapour pressure at the liquid temperature, the boiling temperature at the absolute pressure above the liquid, the temperature margin to boiling, and the pressure that gives the required margin, judged either for keeping a liquid from boiling or flashing (pump suctions, hot transfers, vacuum vessels) or for making it boil (vacuum drying, degassing, distillation).",
    "uses": [
      "Check that a hot liquid will not flash in a vessel or suction line",
      "Find the vacuum needed to boil off a solvent or water at a set temperature",
      "Estimate a vapour pressure where no table is at hand"
    ],
    "users": [
      "Process engineers",
      "Mechanical engineers",
      "Plant operators"
    ],
    "inputs": {
      "Tb": "A temperature at which the liquid’s vapour pressure is known, such as its normal boiling point.",
      "pb": "The vapour pressure at that temperature (101.325 kPa for the normal boiling point).",
      "H": "Molar enthalpy of vaporisation, preferably a mean over the temperature range used.",
      "Top": "Temperature of the liquid.",
      "pop": "Absolute pressure in the vapour space above the liquid.",
      "goal": "Whether the liquid must stay liquid or must boil.",
      "mn": "Temperature margin your design needs between the liquid and its boiling point."
    },
    "outputs": [
      "Vapour pressure at the liquid temperature",
      "Boiling temperature at the operating pressure",
      "Temperature margin and pressure for the margin"
    ],
    "method": [
      "Clapeyron’s relation applied to a saturated vapour, neglecting the liquid volume and treating the vapour as a perfect gas, gives d ln p ÷ dT = ΔH ÷ R T² (Guggenheim §3.37–3.39).",
      "With ΔH constant: ln(p ÷ p_b) = −(ΔH ÷ R)(1/T − 1/T_b), so the vapour pressure at T and the boiling temperature at p follow directly.",
      "Margin = boiling temperature − liquid temperature (keep liquid), or the reverse (make it boil); the pressure for the margin is the vapour pressure at the liquid temperature plus (or minus) the margin.",
      "Example: water from 100 °C at 101.325 kPa with 40.66 kJ/mol has 21.006 kPa of vapour pressure at 60 °C and boils at 68.29 °C under 30 kPa, a margin of 8.2895 K."
    ],
    "limitations": [
      "The enthalpy of vaporisation falls with temperature, so accuracy drops far from the known point (water at 60 °C reads about 5 % high from the 100 °C value).",
      "The vapour is treated as a perfect gas; near the critical point the relation fails.",
      "Pure liquids only; mixtures boil over a range.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Vapour pressure rises steeply with temperature, so a modest temperature rise can make a liquid flash in a vacuum vessel or suction line.",
      "Where accuracy matters, take the known point close to the operating temperature."
    ],
    "refs": [
      "E. A. Guggenheim, Thermodynamics: An Advanced Treatment for Chemists and Physicists, 5th revised edition (North-Holland, 1967), §3.37–3.39 (Clapeyron’s relation and its application to saturated vapour). Method reference; no text, tables or examples are reproduced."
    ],
    "verify": [
      "Check the vapour pressure against measured data for the liquid at the operating temperature."
    ]
  },
  "gas-throttling-temperature-check": {
    "purpose": "Temperature change of a gas throttled at constant enthalpy: the Joule–Thomson coefficient from the van der Waals second virial coefficient (2a ÷ RT − b) ÷ Cp, integrated exactly over the pressure drop, or from a known coefficient, giving the outlet temperature, the inversion temperature of the model, the inlet temperature that keeps the outlet at the lowest allowed temperature, and the preheat power for the gas flow, against the lowest acceptable outlet temperature.",
    "uses": [
      "Check a gas pressure regulator or let-down valve for freezing at the outlet",
      "Size the preheater for a gas pressure reduction station",
      "See whether a gas cools or warms when throttled"
    ],
    "users": [
      "Gas and process engineers",
      "Mechanical engineers",
      "Instrument and maintenance technicians"
    ],
    "inputs": {
      "model": "Calculate the coefficient from van der Waals constants, or enter a known coefficient.",
      "a": "van der Waals attraction constant of the gas, from property data.",
      "b": "van der Waals co-volume of the gas, from property data.",
      "mu": "Joule–Thomson coefficient measured or tabulated for the gas over the range (used by the known-coefficient model).",
      "Cp": "Molar heat capacity of the gas at constant pressure in the low-pressure (perfect gas) limit.",
      "p1": "Absolute pressure before the regulator or valve.",
      "p2": "Absolute pressure after it.",
      "T1": "Gas temperature before the regulator.",
      "Tmin": "Lowest outlet temperature allowed by the pipe material, seals, freezing or hydrate formation.",
      "Q": "Gas flow in standard cubic metres per hour at 15 °C and 101.325 kPa."
    },
    "outputs": [
      "Joule–Thomson coefficient and inversion temperature",
      "Outlet temperature and temperature change",
      "Inlet temperature and preheat power needed"
    ],
    "method": [
      "Throttling keeps enthalpy constant, and for a slightly imperfect gas the Joule–Thomson coefficient is μ = (T dB/dT − B) ÷ C_p (Guggenheim §3.11, §3.20).",
      "With the van der Waals second virial coefficient B = b − a ÷ RT, μ = (2a ÷ RT − b) ÷ C_p, which changes sign at the inversion temperature 2a ÷ R b (§3.21–3.22).",
      "dT ÷ dp depends only on T, so the drop integrates exactly: Δp = C_p ∫ T ÷ (2a/R − bT) dT, solved for the outlet temperature; with a known coefficient, ΔT = μ Δp.",
      "Preheat = molar flow × C_p × (inlet temperature needed − actual inlet temperature).",
      "Example: methane at 15 °C let down from 70 to 7 bar abs cools to −13.048 °C; keeping the outlet at 0 °C needs 26.52 °C at the inlet, 4.8315 kW for 1000 Sm³/h."
    ],
    "limitations": [
      "Guggenheim notes that no two-constant formula such as van der Waals fits the second virial coefficient quantitatively; treat the result as an estimate and compare with measured data.",
      "The second virial (slightly imperfect gas) form is a low-to-moderate pressure approximation; at high pressure use an equation of state or measured enthalpy data.",
      "Constant heat capacity; no heat gained from the surroundings; kinetic energy changes neglected.",
      "This is a screening aid: gas pressure reduction stations are designed and approved by qualified gas engineers to the applicable codes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Most gases cool on throttling at ordinary temperatures; hydrogen and helium warm because they are above their inversion temperatures.",
      "Frost on a regulator body is a sign the outlet is below 0 °C; moisture and hydrates can block it."
    ],
    "refs": [
      "E. A. Guggenheim, Thermodynamics: An Advanced Treatment for Chemists and Physicists, 5th revised edition (North-Holland, 1967), §3.11 (throttling), §3.20 (Joule–Thomson coefficient), §3.21 (temperature dependence of the second virial coefficient), §3.22 (Boyle and inversion temperatures). Method reference; no text, tables or examples are reproduced."
    ],
    "verify": [
      "Compare the outlet temperature with a measured Joule–Thomson coefficient or enthalpy data for the gas at the actual pressures."
    ]
  },
  "filter-bubble-point-check": {
    "purpose": "Bubble point integrity check of a wetted membrane filter by the Young–Laplace capillary relation: the maker’s minimum bubble point converted to the wetting liquid actually used in proportion to surface tension (both liquids fully wetting), the margin of the measured bubble point over it, and the equivalent largest capillary pore diameter 4 k γ ÷ Δp at the measured and at the minimum bubble point, against the converted minimum.",
    "uses": [
      "Accept a filter cartridge or disc after a bubble point integrity test",
      "Convert the maker’s water bubble point to an alcohol-wetted test",
      "Estimate the largest equivalent pore from a measured bubble point"
    ],
    "users": [
      "Quality and validation staff",
      "Process technicians",
      "Laboratory technicians"
    ],
    "inputs": {
      "pb": "Gas pressure difference across the wetted membrane when bulk gas flow begins.",
      "pmin": "Lowest bubble point the filter maker specifies for an intact membrane.",
      "gr": "Surface tension of the liquid the maker’s minimum refers to, at the test temperature.",
      "gt": "Surface tension of the liquid you wetted the membrane with, at the test temperature.",
      "k": "Correction factor for non-cylindrical pores; 1 for the ideal cylindrical capillary."
    },
    "outputs": [
      "Minimum bubble point in your wetting liquid",
      "Margin over the minimum",
      "Equivalent largest pore at the measured and minimum bubble points"
    ],
    "method": [
      "Across a curved liquid surface the pressure difference is γ (1/r₁ + 1/r₂) (Guggenheim §1.60–1.61); a fully wetting liquid in a cylindrical pore of diameter d holds gas back up to Δp = 4 γ ÷ d.",
      "The largest pore empties first, so the bubble point gives the equivalent largest pore d = 4 k γ ÷ Δp.",
      "For the same pores the bubble point scales with surface tension: minimum in your liquid = maker’s minimum × γ_test ÷ γ_maker.",
      "Example: 3.45 bar measured against a 3.2 bar minimum, both with water at 72 mN/m, passes with 7.8125 % margin; the equivalent largest pore is 0.83478 µm."
    ],
    "limitations": [
      "Both liquids must fully wet the membrane (zero contact angle); a partly wetting liquid gives a falsely low bubble point.",
      "The capillary pore diameter is an equivalent value, not the filter’s retention rating.",
      "The maker’s specified test method, temperature and liquid govern acceptance; this is a screening aid where sterile or regulated filtration is involved.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A bubble point well below the minimum points to a damaged membrane, a bad seal or O-ring, or incomplete wetting.",
      "Lower-surface-tension liquids such as alcohols give proportionally lower bubble points for the same pores."
    ],
    "refs": [
      "E. A. Guggenheim, Thermodynamics: An Advanced Treatment for Chemists and Physicists, 5th revised edition (North-Holland, 1967), §1.60 (interfacial tension of a curved interface), §1.61 (pressure within a bubble). Method reference; no text, tables or examples are reproduced.",
      "ASTM F316, Standard Test Methods for Pore Size Characteristics of Membrane Filters by Bubble Point and Mean Flow Pore Test. Scope reference only; no values are reproduced."
    ]
  },
  "gas-separation-energy-check": {
    "purpose": "Second-law benchmark of a gas separator such as a nitrogen generator: the waste-stream composition from a balance on the wanted gas, the recovery, the least separation work from the Gibbs energy of ideal mixing RT Σ x ln x of the product and waste less that of the feed, the least work for the same purity at a very large feed ratio, the second-law efficiency of the actual specific energy, and the yearly energy and cost (excluding GST), against the target specific energy.",
    "uses": [
      "Benchmark a nitrogen generator’s energy against the thermodynamic least",
      "Show what a higher purity set point costs",
      "Compare a generator’s energy with a supplier’s target"
    ],
    "users": [
      "Energy and utilities engineers",
      "Plant engineers",
      "Business owners comparing gas supply options"
    ],
    "inputs": {
      "xF": "Share of the wanted gas in the feed (nitrogen with argon is about 79 % of dry air).",
      "xP": "Purity of the product gas.",
      "AF": "Moles (or normal cubic metres) of feed per unit of product, from the generator data.",
      "T": "Ambient temperature at which the separation takes place.",
      "Q": "Product flow in normal cubic metres per hour (0 °C, 101.325 kPa).",
      "Eact": "Measured or quoted energy per normal cubic metre of product.",
      "Etgt": "Specific energy you are aiming for or were promised.",
      "hrs": "Hours a year the generator runs at this flow.",
      "price": "Electricity price excluding GST (registered businesses claim the GST back)."
    },
    "outputs": [
      "Waste composition and recovery",
      "Least work and least specific energy",
      "Second-law efficiency and yearly energy and cost"
    ],
    "method": [
      "Waste composition from the balance x_W = (AF x_F − x_P) ÷ (AF − 1); recovery = x_P ÷ (AF x_F).",
      "For ideal gas mixtures the Gibbs energy of mixing is RT Σ x ln x per mole (Guggenheim §4.18–4.20); the least separation work per mole of product = RT [g(x_P) + (AF − 1) g(x_W) − AF g(x_F)], with g(x) = x ln x + (1 − x) ln(1 − x).",
      "As AF grows very large this falls to RT [g(x_P) − g(x_F) − (x_P − x_F) ln(x_F ÷ (1 − x_F))], the least for that purity; one normal cubic metre is 101 325 ÷ (R × 273.15) mol.",
      "Second-law efficiency = least specific energy ÷ actual specific energy; yearly energy = flow × hours × specific energy.",
      "Example: 99 % nitrogen from air at an air factor of 3 needs at least 603.66 J/mol, 0.0074812 kWh/Nm³; at 0.25 kWh/Nm³ the generator is 2.9925 % efficient."
    ],
    "limitations": [
      "Two components (wanted gas and the rest) and ideal gases at ambient temperature; real air has several components.",
      "The least work is a thermodynamic floor that no real separator approaches; low second-law efficiency is normal for small generators.",
      "The actual and target energies must use the same boundary (compressor input, dryers, boosters) and the same reference conditions.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the result to compare options and set points, not to expect the minimum: the compressor’s own losses dominate the real energy.",
      "Raising purity raises the air factor, so energy rises faster than the least work suggests."
    ],
    "refs": [
      "E. A. Guggenheim, Thermodynamics: An Advanced Treatment for Chemists and Physicists, 5th revised edition (North-Holland, 1967), §4.18–4.20 (ideal mixtures and their thermodynamic functions). Method reference; no text, tables or examples are reproduced."
    ]
  }
});
