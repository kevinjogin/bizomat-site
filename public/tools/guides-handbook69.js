// MAKEOS methods, input sources and limits for the thermodynamics tools (batch handbook69).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "vapour-pressure-boiling-check": {
    "purpose": "Vapour pressure and boiling point of a liquid from one known point on its vapour-pressure curve and its latent heat, by the integrated Clausius–Clapeyron equation (vapour treated as an ideal gas, liquid volume neglected, latent heat constant): the boiling temperature at the working pressure, the vapour pressure at the liquid temperature (the value the NPSH tools ask for), the slope of the curve, and the margin between the liquid temperature and the boiling point, against the margin you require.",
    "uses": [
      "Check that a liquid will not boil in a vacuum degassing or drying chamber",
      "Find the vapour pressure to use in an NPSH check",
      "Find how far a hot liquid is from flashing at a pump suction or after a valve"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers",
      "Hydraulic and pump engineers"
    ],
    "inputs": {
      "T1": "A temperature at which the vapour pressure is known, ideally close to the working temperature (the normal boiling point is a common choice).",
      "p1": "Vapour pressure at that temperature, absolute (101.325 kPa at the normal boiling point).",
      "L": "Latent heat of vaporisation near the working temperature, from property tables such as the NIST Chemistry WebBook.",
      "M": "Molar mass of the liquid (water 18.015 g/mol).",
      "p": "Absolute pressure on the liquid surface: chamber pressure, suction pressure or the pressure after a valve.",
      "Tw": "Temperature of the liquid.",
      "margin": "Temperature margin you require below the boiling point (from your design practice)."
    },
    "outputs": [
      "Boiling temperature at the working pressure",
      "Vapour pressure at the liquid temperature and the slope of the curve",
      "Margin to boiling against the margin required"
    ],
    "method": [
      "Specific gas constant R = 8.314462618 ÷ M kJ/(kg·K); with L constant, ln (p ÷ p₁) = −(L ÷ R)(1 ÷ T − 1 ÷ T₁) (Clausius–Clapeyron, Fermi eqs 96–98).",
      "Boiling temperature at p: 1 ÷ T_b = 1 ÷ T₁ − (R ÷ L) ln (p ÷ p₁); vapour pressure at the liquid temperature p_v = p₁ exp[−(L ÷ R)(1 ÷ T_w − 1 ÷ T₁)].",
      "Slope dp/dT = L p_v ÷ (R T_w²); margin = T_b − T_w, compared with the margin required.",
      "Example: at 20 kPa the liquid boils at 58.889 °C; at 45 °C its vapour pressure is 10.515 kPa."
    ],
    "limitations": [
      "Latent heat is taken as constant and the vapour as an ideal gas, so accuracy falls the further the working temperature is from the reference point; choose a reference point near the working condition.",
      "Pure liquids only; dissolved gases and mixtures boil differently, and dissolved air comes out of solution before the liquid boils.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Vapour pressure roughly doubles for every 10 to 20 K rise for many liquids near room temperature, so a small temperature rise can remove the whole margin under vacuum."
    ],
    "refs": [
      "Fermi E., Thermodynamics (Dover Publications, 1956; first published by Prentice-Hall, 1937), pp. 63–68. Method reference; no text, examples or tables are reproduced.",
      "NIST Chemistry WebBook, NIST Standard Reference Database 69 — https://webbook.nist.gov/chemistry/ (source for vapour pressures and latent heats; values are entered by the user)."
    ]
  },
  "real-gas-cylinder-contents": {
    "purpose": "Contents of a gas cylinder, bank or receiver by the van der Waals equation of state with the gas constants you enter: the molar volume from the gas root of the cubic, the moles and mass held, the compressibility factor, the ideal-gas mass and its error, and the critical temperature and pressure implied by the constants (with a warning below the critical temperature, where the gas may condense), against the mass you need.",
    "uses": [
      "Check how much nitrogen or argon a cylinder bank really holds",
      "See how wrong the ideal-gas law is at high pressure",
      "Check a receiver holds enough gas for a purge or test"
    ],
    "users": [
      "Process and plant engineers",
      "Welding and gas supervisors",
      "Pneumatic system designers"
    ],
    "inputs": {
      "V": "Internal volume of the cylinder or receiver (the water capacity stamped on a cylinder).",
      "pg": "Gauge pressure of the gas.",
      "T": "Temperature of the gas (settled temperature, not just after filling).",
      "patm": "Local atmospheric pressure (101.325 kPa at sea level).",
      "M": "Molar mass of the gas (nitrogen 28.014 g/mol).",
      "a": "Van der Waals attraction constant for the gas, from data tables such as the CRC Handbook of Chemistry and Physics (1 L²·bar/mol² = 0.1 Pa·m⁶/mol²).",
      "b": "Van der Waals excluded-volume constant (1 L/mol = 1000 cm³/mol).",
      "mreq": "Mass of gas the job needs."
    },
    "outputs": [
      "Molar volume, moles and mass of gas held",
      "Compressibility factor and ideal-gas error",
      "Critical temperature and pressure from the constants",
      "Contents against the mass needed"
    ],
    "method": [
      "Absolute pressure p = gauge + atmospheric; van der Waals (p + a ÷ v²)(v − b) = R T (Fermi eq 99), solved as p v³ − (p b + R T) v² + a v − a b = 0 for the largest (gas) root by Newton’s method from v = b + R T ÷ p.",
      "Moles n = V ÷ v; mass = n M; compressibility Z = p v ÷ (R T); ideal-gas mass = p V M ÷ (R T) and its error against the van der Waals mass.",
      "Critical point of the constants: T_c = 8a ÷ (27 R b), p_c = a ÷ (27 b²); below T_c the gas may condense.",
      "Example: the cylinder holds 11.742 kg (Z = 1.0009); the ideal-gas law says 11.752 kg."
    ],
    "limitations": [
      "Van der Waals is a two-constant model: it is close for permanent gases at moderate pressures, but at cylinder pressures of 200 bar and above, and near the critical point, it can be several per cent out; use measured compressibility data or a better equation of state where the quantity matters.",
      "Screening aid only: cylinders, receivers and their filling are pressure equipment, and the rated pressure, regulations and qualified review govern real work.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Z above 1 means the gas is harder to compress than an ideal gas, so the cylinder holds less than the ideal-gas law predicts; Z below 1 means it holds more."
    ],
    "refs": [
      "Fermi E., Thermodynamics (Dover Publications, 1956; first published by Prentice-Hall, 1937), pp. 69–76. Method reference; no text, examples or tables are reproduced.",
      "CRC Handbook of Chemistry and Physics (CRC Press): van der Waals constants for gases; values are entered by the user."
    ]
  },
  "ro-pressure-check": {
    "purpose": "Pressure check of a reverse osmosis system: the feed osmotic pressure of a dilute solution from van ’t Hoff’s law with the dissolved solids, molar mass and dissociation factor you enter, the feed-side mean osmotic pressure from the log-mean concentration factor at the recovery, the net driving pressure, the osmotic and net driving pressure at the concentrate end, the permeate flow from the membrane water permeability and area, and the feed pressure needed for the permeate flow you want.",
    "uses": [
      "Check a feed pump can drive an RO unit at a higher recovery",
      "Estimate the effect of more saline feed water on output",
      "Sanity-check an RO supplier’s pressure and flow figures"
    ],
    "users": [
      "Plant and utilities engineers",
      "Water treatment technicians",
      "Maintenance engineers"
    ],
    "inputs": {
      "Cf": "Total dissolved solids of the feed water, from a water analysis.",
      "Ms": "Molar mass of the dominant salt (sodium chloride 58.44 g/mol).",
      "i": "Effective number of dissolved particles per formula unit; about 2 for fully dissociated sodium chloride, less in practice because of ion interactions. Take it from data or fit it to a measured osmotic pressure.",
      "T": "Feed water temperature.",
      "rec": "Share of the feed that leaves as permeate.",
      "Pf": "Feed pressure at the membrane inlet.",
      "dP": "Pressure lost along the membranes from feed to concentrate (from the unit’s gauges).",
      "Pp": "Back pressure on the permeate side.",
      "A": "Water permeability of the membrane at this temperature, from the membrane maker’s data or a performance test.",
      "Am": "Active membrane area of all elements in service.",
      "Qreq": "Permeate flow the plant needs."
    },
    "outputs": [
      "Feed and mean osmotic pressure",
      "Net driving pressure and permeate flow",
      "Concentrate-end osmotic and net driving pressure",
      "Feed pressure needed for the flow wanted"
    ],
    "method": [
      "Feed osmotic pressure π_f = i (C ÷ M) R T, the van ’t Hoff law for dilute solutions (Fermi eq 166), with C in g/m³ giving mol/m³.",
      "Log-mean concentration factor CF = ln [1 ÷ (1 − r)] ÷ r; mean osmotic pressure = CF π_f; net driving pressure NDP = P_f − ½ ΔP − CF π_f − P_p (Hydranautics normalization).",
      "Concentrate osmotic pressure ≈ π_f ÷ (1 − r) (full rejection); concentrate-end NDP = P_f − ΔP − P_p − π_c; permeate flow = A × NDP × area; feed pressure needed = Q ÷ (A × area) + ½ ΔP + CF π_f + P_p.",
      "Example: feed osmotic pressure 1.5271 bar, NDP 10.927 bar and 7.2776 m³/h of permeate."
    ],
    "limitations": [
      "Van ’t Hoff’s law is for dilute ideal solutions; it overstates the osmotic pressure of real salt solutions unless the factor i is reduced to suit, and it is unreliable for brackish-to-seawater concentrations without measured data.",
      "Single-stage average model: membrane fouling, concentration polarisation and permeate salt passage are not modelled; use the membrane maker’s design software for a full design.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising recovery concentrates the brine, so the osmotic pressure at the concentrate end climbs steeply: at 90 % recovery it is ten times the feed value."
    ],
    "refs": [
      "Fermi E., Thermodynamics (Dover Publications, 1956; first published by Prentice-Hall, 1937), pp. 118–122. Method reference; no text, examples or tables are reproduced.",
      "Hydranautics, What Is Membrane Performance Normalization? (2001), net driving pressure and log-mean concentration factor — https://www.lenntech.com/data-sheets/Hydranautics-normaliz-L.pdf"
    ]
  },
  "battery-heat-check": {
    "purpose": "Heat generation of a battery pack by Bernardi’s energy balance: the irreversible (resistive) heat I²R in each cell, the reversible (entropic) heat from the cell’s open-circuit voltage temperature coefficient, which the reversible-cell equation of Helmholtz relates to the heat the cell exchanges with its surroundings, the pack total, the heat left after cooling, and the temperature rise over the duty with the cells’ heat capacity, against the largest rise you allow, with the cooling needed to stay within it.",
    "uses": [
      "Size cooling for a forklift, AGV or storage battery pack",
      "See whether a fast charge will overheat a pack",
      "Compare resistive and entropic heat at different currents"
    ],
    "users": [
      "Electrical and mechanical design engineers",
      "Maintenance engineers",
      "Battery system integrators"
    ],
    "inputs": {
      "mode": "Whether the pack is being discharged or charged (sets the sign of the reversible heat).",
      "I": "Current through each cell: pack current divided by the number of cells in parallel.",
      "Rint": "Internal (DC) resistance of one cell at this temperature and state of charge, from the cell data sheet or a pulse test.",
      "dUdT": "Change of the cell’s open-circuit voltage with temperature, from the cell maker or published measurements; it varies with state of charge and can be negative.",
      "Tc": "Cell temperature during the duty.",
      "Nc": "Number of cells in the pack.",
      "mc": "Mass of one cell.",
      "cp": "Average specific heat of the cells, from the cell maker or a calorimeter test.",
      "t": "Length of the charge or discharge.",
      "Pcool": "Heat the cooling system removes from the pack at this temperature.",
      "dTmax": "Largest temperature rise you allow over the duty (from the cell maker’s limits)."
    },
    "outputs": [
      "Irreversible and reversible heat per cell",
      "Pack heat and heat left after cooling",
      "Temperature rise over the duty and cooling needed"
    ],
    "method": [
      "Per cell (Bernardi energy balance): heat = I² R − I_d T (dU/dT), with I_d positive on discharge and negative on charge, T in kelvin.",
      "The reversible term is the heat the cell exchanges at its terminal energy change: by Helmholtz’s reversible-cell equation v − T dv/dT = u (Fermi eq 134), T dv/dT per unit charge is heat absorbed from the surroundings.",
      "Pack heat = cells × heat per cell; temperature rise = (pack heat − cooling) × time ÷ (cells × mass × specific heat); cooling needed = pack heat − allowed rise × heat capacity ÷ time.",
      "Example: 5.4 W resistive and -1.7889 W reversible heat per cell; the pack warms 2.9 K in 30 min."
    ],
    "limitations": [
      "Lumped model: the pack is one uniform temperature; real cells have hot spots at the centre and the tabs, so the maximum cell temperature is higher than this average.",
      "Screening aid only: battery thermal limits and safety are governed by the cell maker’s data, the applicable standards and qualified review.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Resistive heat grows with the square of the current while reversible heat grows in proportion, so the entropic term matters most at low currents and can even cool the cell."
    ],
    "refs": [
      "Fermi E., Thermodynamics (Dover Publications, 1956; first published by Prentice-Hall, 1937), pp. 94–97. Method reference; no text, examples or tables are reproduced.",
      "Bernardi D., Pawlikowski E. and Newman J., A General Energy Balance for Battery Systems, Journal of the Electrochemical Society 132 (1), 5–12 (1985)."
    ]
  },
  "heat-pump-cop-check": {
    "purpose": "Check of a heat pump or chiller’s coefficient of performance against the second law: evaporating and condensing temperatures from the source and sink temperatures and the approach temperatures you enter, the Carnot (reversible) COP for heating or cooling, the actual COP from the duty and electrical input, the second-law efficiency, the yearly electricity cost, and the input power at your minimum efficiency, against the Carnot limit and the minimum efficiency you accept.",
    "uses": [
      "Test a supplier’s COP claim before buying a heat pump or chiller",
      "Check a measured COP after commissioning",
      "Show how lowering the sink temperature cuts running cost"
    ],
    "users": [
      "Mechanical and building services engineers",
      "Energy managers",
      "Plant engineers"
    ],
    "inputs": {
      "mode": "Whether the useful output is heat delivered (heat pump) or heat removed (chiller).",
      "Tsrc": "Temperature of the cold side: outdoor air or ground for a heat pump, chilled water or the cold room for a chiller.",
      "Tsink": "Temperature of the hot side: heating water for a heat pump, condenser air or cooling water for a chiller.",
      "dTe": "How far the evaporating refrigerant runs below the source (from the unit’s design data).",
      "dTc": "How far the condensing refrigerant runs above the sink.",
      "Q": "Rated or measured heating or cooling output at these temperatures.",
      "P": "Rated or measured electrical input at the same condition.",
      "etaMin": "Lowest share of the Carnot COP you accept as realistic for this kind of unit (your own benchmark).",
      "price": "Electricity price including GST, or ex GST for a GST-registered business.",
      "hrs": "Running hours at this duty per year."
    },
    "outputs": [
      "Evaporating and condensing temperatures",
      "Carnot COP and actual COP",
      "Second-law efficiency",
      "Yearly running cost and input power at your minimum efficiency"
    ],
    "method": [
      "Evaporating T_e = source − evaporator approach; condensing T_c = sink + condenser approach (kelvin).",
      "Carnot COP: heating T_c ÷ (T_c − T_e), cooling T_e ÷ (T_c − T_e), the reversed Carnot cycle (Fermi eqs 58–60).",
      "Actual COP = duty ÷ input; second-law efficiency = actual ÷ Carnot; yearly cost = input × hours × price; input at the minimum efficiency = duty ÷ (minimum × Carnot COP).",
      "Example: Carnot COP 6.7323, actual 3.3333, a second-law efficiency of 49.513 % and A$9,000 a year."
    ],
    "limitations": [
      "Uses the refrigerant’s evaporating and condensing temperatures from your approach values; a unit tested to a standard rating condition must be compared at that condition.",
      "Steady-state duty only: defrost, part-load cycling, pumps and fans outside the measured input are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The Carnot COP depends on the temperature lift, so a heat pump delivering 35 °C water rather than 55 °C can use markedly less power for the same heat."
    ],
    "refs": [
      "Fermi E., Thermodynamics (Dover Publications, 1956; first published by Prentice-Hall, 1937), pp. 31–45. Method reference; no text, examples or tables are reproduced."
    ]
  },
  "waste-heat-recovery-limit": {
    "purpose": "Second-law limit on power recovered from a waste heat stream cooled from one temperature to another: the heat released, the exergy (the most work any reversible machine could make, integrating the Carnot efficiency over the cooling with the surroundings as the cold reservoir), the mean Carnot efficiency, the claimed power as a share of the heat and of the exergy, and the yearly value of the claimed power, against the exergy and the largest share of it you consider realistic.",
    "uses": [
      "Test a supplier’s power claim for a heat-to-power unit",
      "Find the most power a hot water or flue gas stream could give",
      "Decide whether waste heat is better used as heat than turned into power"
    ],
    "users": [
      "Energy managers",
      "Process and plant engineers",
      "Engineering managers assessing proposals"
    ],
    "inputs": {
      "mdot": "Mass flow of the hot water, oil or gas stream.",
      "cp": "Mean specific heat of the stream over the temperature range (water about 4.18 kJ/(kg·K)), from property data.",
      "T1": "Temperature of the stream entering the recovery unit.",
      "T2": "Temperature it leaves at; it cannot be below the surroundings.",
      "T0": "Temperature of the surroundings or cooling medium the machine rejects heat to.",
      "W": "Net electrical or shaft power claimed for the recovery unit.",
      "share": "Largest share of the exergy you consider achievable for this kind of machine (your own benchmark).",
      "hrs": "Hours a year the stream is available at this condition.",
      "price": "Value of a kilowatt-hour of electricity to the site, including GST, or ex GST for a GST-registered business."
    },
    "outputs": [
      "Heat released",
      "Exergy and mean Carnot efficiency",
      "Claimed power as a share of heat and exergy",
      "Yearly value of the claimed power"
    ],
    "method": [
      "Heat released Q = ṁ c_p (T₁ − T₂).",
      "Each element of heat dQ at temperature T can give at most (1 − T₀ ÷ T) dQ of work (Carnot efficiency, Fermi eq 59); integrating over the cooling gives exergy E = ṁ c_p [(T₁ − T₂) − T₀ ln (T₁ ÷ T₂)], temperatures in kelvin.",
      "Mean Carnot efficiency = E ÷ Q; claim shares = W ÷ Q and W ÷ E; yearly value = W × hours × price.",
      "Example: 313.5 kW of heat holds at most 41.223 kW of power; the 15 kW claim is 36.388 % of that limit."
    ],
    "limitations": [
      "Constant specific heat and a single stream cooled steadily; phase change (condensing flue gas or steam) needs latent heat added separately.",
      "The exergy is a theoretical ceiling: real machines also lose to pumps, fans and parasitic loads, which the claim should already deduct.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Low-temperature heat holds little exergy: water at 90 °C has a mean Carnot efficiency of only about 13 % when cooled to 40 °C against 20 °C surroundings, so using it directly as heat is often worth more."
    ],
    "refs": [
      "Fermi E., Thermodynamics (Dover Publications, 1956; first published by Prentice-Hall, 1937), pp. 44, 48–58. Method reference; no text, examples or tables are reproduced.",
      "Çengel Y. A. and Boles M. A., Thermodynamics: An Engineering Approach (McGraw-Hill): exergy of a stream."
    ]
  }
});
