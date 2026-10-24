// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook8).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "orifice-flow": {
    "purpose": "Flow through a sharp-edged orifice, jet or restrictor from the discharge coefficient, diameter and pressure difference, or the pressure drop for a given flow.",
    "uses": [
      "Size a damping or flow-control orifice",
      "Estimate leakage through a hole",
      "Check pressure drop across a jet or nozzle"
    ],
    "users": [
      "Hydraulic and process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "mode": "Find the flow for a pressure drop, or the drop for a flow.",
      "d": "Smallest diameter of the orifice.",
      "Cd": "Discharge coefficient (about 0.6–0.65 for sharp-edged orifices, up to about 0.95 for rounded nozzles); measured values are best.",
      "dp": "Pressure difference across the orifice (flow mode).",
      "Q": "Flow through the orifice (pressure-drop mode).",
      "rho": "Density of the fluid at the working temperature (mineral hydraulic oil about 870 kg/m³, water about 998 kg/m³)."
    },
    "outputs": [
      "Flow",
      "Pressure drop",
      "Jet velocity"
    ],
    "method": [
      "Q = Cd × A × √(2Δp ÷ ρ), with A = πd²/4, Δp in Pa.",
      "Δp = ρ ÷ 2 × (Q ÷ (Cd A))².",
      "Example: a 2 mm orifice at 50 bar passes 12.529 L/min of oil."
    ],
    "limitations": [
      "Turbulent flow through a short orifice; at low Reynolds numbers (cold oil, tiny holes) Cd falls.",
      "Cavitation at large pressure drops limits the flow.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use a measured Cd for accurate flow control; small manufacturing changes alter Cd."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027, 352–368. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "accumulator-size": {
    "purpose": "Nominal gas volume of a bladder or piston accumulator to deliver a required oil volume between minimum and maximum working pressures, for isothermal or adiabatic gas behaviour.",
    "uses": [
      "Size an accumulator for emergency or peak flow",
      "Check the precharge pressure",
      "Compare slow and fast discharge"
    ],
    "users": [
      "Hydraulic and process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "dV": "Oil volume needed between maximum and minimum pressure.",
      "p0": "Nitrogen precharge (often about 90% of the minimum working pressure).",
      "p1": "Lowest pressure at which the system still works.",
      "p2": "Highest working pressure (relief or pump cut-out).",
      "n": "1.0 for slow (isothermal) cycles over several minutes; 1.4 for fast (adiabatic) discharges in seconds."
    },
    "outputs": [
      "Required nominal gas volume",
      "Gas volumes at each pressure",
      "Precharge ratio"
    ],
    "method": [
      "Absolute pressures: P = gauge + 1.013 bar.",
      "V₀ = ΔV ÷ ((P₀ ÷ P₁)^(1/n) − (P₀ ÷ P₂)^(1/n)).",
      "Gas volume at a pressure = V₀ (P₀ ÷ P)^(1/n).",
      "Example: 2 L between 100 and 200 bar with 90 bar precharge needs about 5.5488 L of accumulator."
    ],
    "limitations": [
      "Ideal gas; real nitrogen deviates at high pressure, so allow a margin.",
      "Temperature changes between charging and operating alter the precharge.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose the next larger standard size; pressure vessels must comply with your pressure equipment regulations."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 352–368. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pipe-friction": {
    "purpose": "Reynolds number, Darcy friction factor (laminar 64/Re or Colebrook–White for turbulent flow), pressure drop and head loss for a straight pipe plus fittings.",
    "uses": [
      "Size hydraulic, coolant and water lines",
      "Find the pressure drop to a remote user",
      "Compare pipe sizes and materials"
    ],
    "users": [
      "Hydraulic and process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "Q": "Volume flow through the pipe.",
      "d": "Inside diameter (not nominal size).",
      "L": "Length of straight pipe.",
      "nu": "Kinematic viscosity at the operating temperature (1 cSt = 1 mm²/s; ISO VG 32 oil is 32 cSt at 40 °C, water about 1 cSt).",
      "rho": "Density of the fluid at the working temperature (mineral hydraulic oil about 870 kg/m³, water about 998 kg/m³).",
      "eps": "Absolute roughness: about 0.0015 mm for drawn tube, 0.045 mm for commercial steel.",
      "K": "Sum of loss coefficients for bends, tees and valves from fittings data."
    },
    "outputs": [
      "Velocity and Reynolds number",
      "Flow regime and friction factor",
      "Pressure drop and head loss"
    ],
    "method": [
      "v = Q ÷ A; Re = v d ÷ ν.",
      "Laminar (Re < 2300): f = 64 ÷ Re. Turbulent: 1/√f = −2 log₁₀(ε/3.7d + 2.51/(Re√f)) solved iteratively.",
      "Δp = (f L ÷ d + ΣK) × ρ v² ÷ 2.",
      "Example: 100 L/min of 15 cSt oil in a 25 mm pipe gives Re = 5,658.8, f = 0.03816 and 1.6814 bar."
    ],
    "limitations": [
      "Fully developed, incompressible flow; the transition region (Re about 2300–4000) is uncertain.",
      "Viscosity of oil changes strongly with temperature; use the operating value.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the drop is too high, a larger diameter is far more effective than any other change (Δp ∝ 1/d⁵ in turbulent flow)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pump-affinity": {
    "purpose": "Flow, head (pressure) and power of a centrifugal pump or fan at a new speed or trimmed impeller diameter by the affinity laws, with the power saving.",
    "uses": [
      "Estimate savings from a variable speed drive",
      "Predict the effect of trimming an impeller",
      "Re-rate a fan at a new pulley ratio"
    ],
    "users": [
      "Hydraulic and process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "Q1": "Flow at the present operating point, from the pump curve or a flow meter.",
      "H1": "Head (or fan pressure) at that point.",
      "P1": "Shaft power at that point, from the curve or measured input × motor efficiency.",
      "n1": "Present speed.",
      "n2": "New speed (e.g. with a VSD or new pulleys).",
      "D1": "Present impeller diameter.",
      "D2": "New (trimmed) impeller diameter; equal to the present one for speed changes only."
    },
    "outputs": [
      "New flow, head and power",
      "Power saving"
    ],
    "method": [
      "Q₂ = Q₁ (n₂/n₁)(D₂/D₁).",
      "H₂ = H₁ (n₂/n₁)²(D₂/D₁)².",
      "P₂ = P₁ (n₂/n₁)³(D₂/D₁)³.",
      "Example: slowing from 2900 to 2400 rpm cuts power from 7 to 3.9677 kW."
    ],
    "limitations": [
      "Applies along a system curve with no static head; with static head, the operating point and savings are smaller.",
      "Impeller trimming beyond about 10–20% departs from the laws and lowers efficiency.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Plot the new pump curve against the system curve to find the real operating point."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "npsh-available": {
    "purpose": "Net positive suction head available from suction surface pressure, vapour pressure, static height and suction losses, compared with the pump’s required NPSH plus a margin.",
    "uses": [
      "Check a pump installation for cavitation",
      "Decide pump elevation or tank level",
      "Assess hot liquid duties"
    ],
    "users": [
      "Hydraulic and process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "ps": "Absolute pressure on the liquid surface (atmospheric about 101.3 kPa at sea level; tank pressure for closed vessels).",
      "pv": "Vapour pressure of the liquid at its temperature (water 2.34 kPa at 20 °C, 47.4 kPa at 80 °C).",
      "rho": "Liquid density at its temperature.",
      "z": "Height of the liquid surface above the pump centreline; negative for suction lift.",
      "hf": "Friction and fitting losses in the suction line at duty flow (see the pipe friction tool).",
      "npshr": "NPSH required from the pump curve at the duty flow.",
      "margin": "Safety margin your standard requires above NPSHr."
    },
    "outputs": [
      "NPSH available",
      "Margin over NPSH required"
    ],
    "method": [
      "NPSHa = (p_s − p_v) ÷ (ρ g) + z − h_f, pressures in Pa.",
      "Margin = NPSHa − NPSHr.",
      "Example: water at 20 °C with a 2 m suction lift gives NPSHa = 7.3113 m."
    ],
    "limitations": [
      "NPSHr on pump curves corresponds to a 3% head drop; cavitation damage can begin above it.",
      "Dissolved gas and temperature rise reduce the real margin.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raise the tank, lower the pump, enlarge the suction pipe or cool the liquid to gain NPSH."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hydraulic-motor": {
    "purpose": "Output torque, speed and power of a hydraulic motor from displacement, pressure difference, flow and volumetric and mechanical efficiencies.",
    "uses": [
      "Select a hydraulic motor for a winch, wheel or conveyor",
      "Check pump flow for a motor speed",
      "Estimate output power"
    ],
    "users": [
      "Hydraulic and process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "Vd": "Geometric displacement per revolution from the motor data sheet.",
      "dp": "Inlet pressure minus outlet (case or return) pressure.",
      "Q": "Flow supplied to the motor.",
      "ev": "Volumetric efficiency at this speed and pressure, from the maker.",
      "em": "Mechanical (hydromechanical) efficiency from the maker."
    },
    "outputs": [
      "Output torque",
      "Output speed",
      "Output and hydraulic power",
      "Overall efficiency"
    ],
    "method": [
      "Torque T = Vd × Δp × η_m ÷ 20π (cm³, bar → N·m).",
      "Speed n = Q × 1000 × η_v ÷ Vd (rpm).",
      "Hydraulic power = Q × Δp ÷ 600 (kW); output = 2π n T ÷ 60 000.",
      "Example: 100 cm³/rev at 150 bar and 60 L/min gives 219.63 N·m at 570 rpm."
    ],
    "limitations": [
      "Efficiencies vary with speed, pressure and oil viscosity; starting torque is lower than running torque.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check starting torque against breakaway load using the maker’s starting efficiency."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 352–368. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pipe-size-velocity": {
    "purpose": "Minimum inside diameter of a pipe, tube or hose for a flow at a chosen mean velocity, and the velocity in a selected actual bore.",
    "uses": [
      "Size hydraulic suction, pressure and return lines",
      "Size coolant and water pipes",
      "Check an existing hose for velocity"
    ],
    "users": [
      "Hydraulic and process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "Q": "Maximum flow in the line.",
      "v": "Design velocity for the line type (typical hydraulic guidance: suction 0.6–1.2 m/s, return 1.5–3 m/s, pressure 3–6 m/s).",
      "dActual": "Inside diameter of a proposed or existing pipe or hose."
    },
    "outputs": [
      "Minimum inside diameter",
      "Velocity in the actual bore"
    ],
    "method": [
      "d = √(4Q ÷ (π v)), Q in m³/s.",
      "Velocity in a bore = Q ÷ (π d² ÷ 4).",
      "Example: 80 L/min at 4 m/s needs at least 20.601 mm bore."
    ],
    "limitations": [
      "Velocity guidance is not a pressure-drop check; long lines need the pipe friction tool too.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose the next standard size at or above the minimum bore."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hydrostatic-force": {
    "purpose": "Pressure at depth, resultant force on a vertical rectangular wall and its centre of pressure, and the force on the tank floor, for any liquid.",
    "uses": [
      "Size tank walls, doors and bund panels",
      "Find bolt loads on an inspection door",
      "Check floor loading of a tank"
    ],
    "users": [
      "Hydraulic and process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "h": "Depth of liquid at the wall.",
      "rho": "Liquid density (water 1000, seawater 1025, coolant emulsion about 1000 kg/m³).",
      "w": "Width of the vertical wall panel.",
      "floor": "Area of the tank floor.",
      "ps": "Gauge pressure of gas above the liquid; 0 for an open tank."
    },
    "outputs": [
      "Pressure at the bottom",
      "Resultant force on the wall and its height",
      "Force on the floor"
    ],
    "method": [
      "Bottom pressure p = p_s + ρ g h.",
      "Wall force (open tank) F = ρ g w h² ÷ 2 acting at h ÷ 3 above the bottom; a gas pressure adds p_s × w × h acting at mid-height.",
      "Floor force = p × floor area.",
      "Example: 2 m of water on a 3 m wide wall gives 58.84 kN, acting 0.66667 m above the floor."
    ],
    "limitations": [
      "Static liquid only; sloshing, filling surges and wind are not included.",
      "Wall design must also consider support conditions and deflection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Design wall stiffeners for the force distribution, which is greatest at the bottom."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "compressor-power": {
    "purpose": "Theoretical isothermal and adiabatic power to compress a flow of free air in one or more intercooled stages, and the shaft power with an overall efficiency.",
    "uses": [
      "Estimate compressor motor size for a demand",
      "Compare single and two-stage compression",
      "Estimate specific power for energy studies"
    ],
    "users": [
      "Maintenance engineers",
      "Energy and utilities managers",
      "Design engineers"
    ],
    "inputs": {
      "Q": "Flow of air measured at inlet conditions (free air delivery).",
      "p2": "Discharge pressure at the compressor outlet.",
      "p1": "Absolute inlet pressure (1.013 bar at sea level; lower at altitude or with inlet filter loss).",
      "stages": "Number of stages with perfect intercooling and equal pressure ratios.",
      "k": "1.4 for air.",
      "eff": "Ratio of theoretical adiabatic power to shaft power, from the compressor maker (often 65–85%)."
    },
    "outputs": [
      "Pressure ratio",
      "Isothermal power",
      "Adiabatic power",
      "Shaft power and specific power"
    ],
    "method": [
      "Isothermal: P = p₁ Q ln(p₂ ÷ p₁).",
      "Adiabatic with N stages: P = N × k/(k − 1) × p₁ Q [(p₂ ÷ p₁)^((k − 1)/(N k)) − 1].",
      "Shaft power = adiabatic ÷ efficiency; specific power = shaft kW ÷ flow (m³/min).",
      "Example: 10 m³/min to 7 bar g in one stage needs about 63.475 kW at the shaft."
    ],
    "limitations": [
      "Theoretical power with an overall efficiency; real compressors also lose energy at part load and in dryers.",
      "Moisture in the air is ignored.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare specific power with maker data (kW per m³/min) to judge an existing compressor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "air-leak-cost": {
    "purpose": "Air lost through a leak hole by choked-flow theory (or a measured leak flow), the compressor power it uses and its yearly energy cost.",
    "uses": [
      "Prioritise leaks found in a leak survey",
      "Justify a leak repair programme",
      "Estimate savings from lowering line pressure"
    ],
    "users": [
      "Maintenance engineers",
      "Energy and utilities managers",
      "Design engineers"
    ],
    "inputs": {
      "d": "Diameter of a round hole with the same leakage (estimate from an ultrasonic survey).",
      "p": "Pressure in the line at the leak.",
      "Cd": "Discharge coefficient of the leak path (about 0.6–0.8).",
      "Tair": "Temperature of the air in the line.",
      "measured": "Leak flow measured by a flow meter or leak-down test, in litres per second of free air; 0 to estimate from the hole.",
      "spec": "Compressor package power per m³/min of free air delivery, from the compressor data sheet or an air audit (about 6–7 for many screw compressors at 7 bar).",
      "hours": "Hours per year the system is under pressure.",
      "price": "Electricity price per kWh."
    },
    "outputs": [
      "Leak flow in free air",
      "Compressor power wasted",
      "Energy and cost per year"
    ],
    "method": [
      "Choked mass flow ṁ = Cd A p₀ √(k ÷ (R T₀)) × (2 ÷ (k + 1))^((k + 1)/(2(k − 1))), with p₀ absolute, k = 1.4, R = 287 J/kg·K.",
      "Flow of free air = ṁ ÷ ρ_free (1.204 kg/m³ at 1.013 bar, 20 °C).",
      "Power = free air (m³/min) × specific power; cost = power × hours × price.",
      "Example: a 3 mm leak at 7 bar wastes 7.1573 L/s, about 2.7914 kW, costing $4,187 a year."
    ],
    "limitations": [
      "Choked flow applies when line pressure exceeds about 0.9 bar gauge; real leak paths vary widely.",
      "Compressor part-load behaviour may mean savings are lower than the average specific power suggests.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Fix the largest leaks first; a leak survey usually pays back within months."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "air-receiver": {
    "purpose": "Receiver volume needed to supply an air deficit (demand above compressor output) for a given time while the pressure falls between two limits, and the time a chosen receiver lasts.",
    "uses": [
      "Size a receiver for a peak demand",
      "Reduce compressor cycling",
      "Check how long a receiver covers a compressor trip"
    ],
    "users": [
      "Maintenance engineers",
      "Energy and utilities managers",
      "Design engineers"
    ],
    "inputs": {
      "deficit": "Demand (as free air) that exceeds what the compressors can deliver during the event.",
      "t": "How long the deficit lasts.",
      "p1": "Receiver pressure at the start of the event (compressor cut-out pressure).",
      "p2": "Lowest pressure at which users still work.",
      "Vactual": "Volume of an existing or proposed receiver (m³; 1 m³ = 1000 L)."
    },
    "outputs": [
      "Required receiver volume",
      "Time an actual receiver can cover",
      "Air stored in the pressure band"
    ],
    "method": [
      "V = t × Q_deficit × p_atm ÷ (p₁ − p₂) (isothermal, pressures in bar).",
      "Time covered = V (p₁ − p₂) ÷ (p_atm × Q_deficit).",
      "Example: a 2 m³/min deficit for 1 min with 8→6.5 bar needs 1.351 m³."
    ],
    "limitations": [
      "Isothermal draw-down; a fast draw-down cools the air and gives slightly less.",
      "Pipework volume adds a little storage not counted here.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Receivers are pressure vessels and must comply with your pressure equipment regulations."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gas-law": {
    "purpose": "Ideal gas conversion of a gas volume or flow between two sets of pressure and temperature, including gauge-to-absolute conversion and free-air to compressed volume.",
    "uses": [
      "Convert free air delivery to compressed volume",
      "Correct a gas flow to reference conditions",
      "Estimate the pressure in a heated closed vessel"
    ],
    "users": [
      "Maintenance engineers",
      "Energy and utilities managers",
      "Design engineers"
    ],
    "inputs": {
      "V1": "Volume or volume flow at the first condition.",
      "p1": "Gauge pressure at the first condition (0 for free air).",
      "T1": "Temperature at the first condition.",
      "p2": "Gauge pressure at the second condition.",
      "T2": "Temperature at the second condition.",
      "patm": "Local atmospheric pressure (1.013 bar at sea level)."
    },
    "outputs": [
      "Volume or flow at state 2",
      "Absolute pressures and temperatures",
      "Volume ratio"
    ],
    "method": [
      "Absolute P = gauge + atmospheric; T in kelvin = °C + 273.15.",
      "V₂ = V₁ × (P₁ ÷ P₂) × (T₂ ÷ T₁).",
      "Example: 1 m³ of free air at 20 °C occupies 0.13073 m³ at 7 bar g and 30 °C."
    ],
    "limitations": [
      "Ideal gas; at very high pressures or low temperatures real gases deviate.",
      "Humidity and condensation are not considered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Always state the reference conditions with a gas volume or flow."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "depreciation-schedule": {
    "purpose": "Year-by-year depreciation and book value of an asset by straight-line, sum-of-the-years’-digits or double-declining-balance methods.",
    "uses": [
      "Compare depreciation methods for an equipment purchase",
      "Estimate book value at disposal",
      "Build cash-flow tables for a business case"
    ],
    "users": [
      "Engineering managers",
      "Project engineers",
      "Finance and business analysts"
    ],
    "inputs": {
      "cost": "Installed cost of the asset.",
      "salvage": "Expected value at the end of its life.",
      "life": "Useful (or effective) life in years.",
      "method": "Method to schedule; tax depreciation must follow the tax authority’s rules (in Australia, ATO effective life and methods)."
    },
    "outputs": [
      "Depreciation each year",
      "Book value each year",
      "First-year depreciation"
    ],
    "method": [
      "Straight line: D = (cost − salvage) ÷ life.",
      "Sum of digits: D_t = (cost − salvage) × (life − t + 1) ÷ (life(life + 1) ÷ 2).",
      "Double declining: D_t = 2 ÷ life × opening book value, not taken below salvage.",
      "Example: $18,000 in year 1 by the selected method, leaving $10,000 at the end."
    ],
    "limitations": [
      "Accounting illustration; tax depreciation rules differ by country and asset class.",
      "Declining balance does not reach salvage exactly unless a switch to straight line is made.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the method your accountant or tax authority requires for reporting."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 139–140. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "euac-compare": {
    "purpose": "Equivalent uniform annual cost (EUAC) and capitalised cost of two alternatives with different first costs, running costs, salvage values and lives, at a discount rate.",
    "uses": [
      "Compare machines with different lives",
      "Decide between repair and replacement",
      "Compare a cheap short-life option with a durable one"
    ],
    "users": [
      "Engineering managers",
      "Project engineers",
      "Finance and business analysts"
    ],
    "inputs": {
      "rate": "Your organisation’s approved discount rate (real or nominal, consistent with the costs).",
      "pA": "Installed cost of option A.",
      "aA": "Yearly running cost of A (energy, maintenance, labour).",
      "sA": "Value of A at the end of its life.",
      "nA": "Life of A in years.",
      "pB": "Installed cost of option B.",
      "aB": "Yearly running cost of B.",
      "sB": "Value of B at the end of its life.",
      "nB": "Life of B in years."
    },
    "outputs": [
      "EUAC of each option",
      "Annual saving of the cheaper option",
      "Capitalised cost (perpetual service)"
    ],
    "method": [
      "Capital recovery A/P = i(1 + i)ⁿ ÷ ((1 + i)ⁿ − 1); sinking fund A/F = i ÷ ((1 + i)ⁿ − 1).",
      "EUAC = P × (A/P) + annual cost − S × (A/F).",
      "Capitalised cost = EUAC ÷ i (perpetual like-for-like replacement).",
      "Example: EUAC is $23,671 for A and $19,232 for B at 8%."
    ],
    "limitations": [
      "Assumes each option is repeated like-for-like at the end of its life, with constant costs.",
      "Taxes, inflation and financing are not modelled unless built into the inputs.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose the lower EUAC if both options meet the technical need equally."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 134–146. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "irr-uneven": {
    "purpose": "Internal rate of return, NPV at a hurdle rate and payback for an investment with up to eight uneven yearly cash flows, solved by bisection.",
    "uses": [
      "Evaluate an equipment or improvement project with uneven savings",
      "Compare a project with the hurdle rate",
      "Check a supplier’s ROI claims"
    ],
    "users": [
      "Engineering managers",
      "Project engineers",
      "Finance and business analysts"
    ],
    "inputs": {
      "P": "Up-front cost at year 0.",
      "hurdle": "Your organisation’s required rate of return.",
      "cf1": "Net cash inflow (savings minus costs) in year 1.",
      "cf2": "Net cash flow in year 2.",
      "cf3": "Net cash flow in year 3.",
      "cf4": "Net cash flow in year 4.",
      "cf5": "Net cash flow in year 5 (include salvage in the final year).",
      "cf6": "Net cash flow in year 6 (0 if none).",
      "cf7": "Net cash flow in year 7.",
      "cf8": "Net cash flow in year 8."
    },
    "outputs": [
      "Internal rate of return",
      "NPV at the hurdle rate",
      "Simple payback"
    ],
    "method": [
      "NPV(i) = −P + Σ CFₜ ÷ (1 + i)ᵗ.",
      "IRR is the rate where NPV = 0, found by bisection between −99% and 1000%.",
      "Payback = year in which cumulative cash flow turns positive (interpolated).",
      "Example: the default project has an IRR of 10.946% and an NPV of $3,108 at 10%."
    ],
    "limitations": [
      "Cash flows with several sign changes can have more than one IRR; check the NPV instead.",
      "Year-end cash flows; tax and inflation only as built into the inputs.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Accept when IRR exceeds the hurdle rate (equivalently, NPV > 0) and the risks are acceptable."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 140–144. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "interest-factors": {
    "purpose": "Single-payment, uniform-series and gradient compound interest factors (F/P, P/F, A/P, P/A, A/F, F/A, A/G, P/G) and the effective annual rate for a nominal rate and compounding frequency.",
    "uses": [
      "Convert between present, future and annual amounts",
      "Check engineering economics calculations",
      "Convert a nominal rate to an effective rate"
    ],
    "users": [
      "Engineering managers",
      "Project engineers",
      "Finance and business analysts"
    ],
    "inputs": {
      "rate": "Nominal annual interest or discount rate.",
      "n": "Number of years.",
      "m": "Compounding frequency (1 annual, 12 monthly).",
      "amount": "An amount used to illustrate each factor."
    },
    "outputs": [
      "Effective annual rate",
      "Table of interest factors and converted amounts"
    ],
    "method": [
      "Effective annual rate i = (1 + r/m)^m − 1.",
      "F/P = (1 + i)ⁿ; P/A = ((1 + i)ⁿ − 1) ÷ (i(1 + i)ⁿ); A/F = i ÷ ((1 + i)ⁿ − 1); others are reciprocals.",
      "A/G = 1/i − n ÷ ((1 + i)ⁿ − 1); P/G = (P/A − n(1 + i)^−n) ÷ i.",
      "Example: at 8% over 10 years, P/A = 6.7101 and A/P = 0.14903."
    ],
    "limitations": [
      "End-of-period cash flows; beginning-of-period (annuity due) amounts are larger by (1 + i).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Multiply a known amount by the factor for the conversion you need (e.g. P × A/P = equivalent annual amount)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 134–139. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "normal-out-of-spec": {
    "purpose": "Fraction and parts per million below the lower and above the upper specification limit for a normally distributed characteristic, with Z values and expected yield.",
    "uses": [
      "Predict scrap from a process mean and spread",
      "Compare centring and spread improvements",
      "Estimate ppm for a customer quality agreement"
    ],
    "users": [
      "Quality engineers",
      "Process engineers",
      "Test engineers"
    ],
    "inputs": {
      "mean": "Average of the characteristic from a stable, representative sample.",
      "sd": "Standard deviation (within-process for short-term, overall for long-term performance).",
      "lsl": "Lower limit from the drawing or specification.",
      "usl": "Upper limit from the drawing or specification.",
      "qty": "Number of parts to estimate the count out of tolerance."
    },
    "outputs": [
      "Z values to each limit",
      "Fraction below, above and total out of tolerance",
      "Parts per million and expected count",
      "Yield"
    ],
    "method": [
      "Z_L = (mean − LSL) ÷ σ; Z_U = (USL − mean) ÷ σ.",
      "Fraction below = Φ(−Z_L); fraction above = Φ(−Z_U), with Φ the standard normal distribution.",
      "ppm = total fraction × 10⁶.",
      "Example: mean 10.02, σ 0.03 within 9.9–10.1 gives about 3,862.1 ppm out of tolerance."
    ],
    "limitations": [
      "Assumes a stable, normal distribution; tails of real processes often differ from the normal model.",
      "Uses the standard deviation as entered; short-term σ understates long-term ppm.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Centring the process usually cuts ppm faster than reducing spread when the mean is off-centre."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sample-size-mean": {
    "purpose": "Minimum number of tests or measurements to estimate a mean within a chosen margin of error at a confidence level, with an optional finite-population correction.",
    "uses": [
      "Plan how many test pieces to make",
      "Size a measurement study",
      "Justify an inspection sample"
    ],
    "users": [
      "Quality engineers",
      "Process engineers",
      "Test engineers"
    ],
    "inputs": {
      "sd": "Estimate of the standard deviation from earlier data or a pilot study, in the units of the measurement.",
      "E": "Half-width of the confidence interval you need, in the same units.",
      "conf": "Confidence that the true mean lies within the margin.",
      "pop": "Total lot or population size for a finite-population correction; 0 if large or ongoing."
    },
    "outputs": [
      "Required sample size",
      "z value used"
    ],
    "method": [
      "n₀ = (z σ ÷ E)², with z = 1.645, 1.960 or 2.576 for 90, 95 and 99%.",
      "Finite population: n = n₀ ÷ (1 + (n₀ − 1) ÷ N).",
      "Round up to a whole number.",
      "Example: σ 0.05 and a ±0.02 margin at 95% need 25 measurements."
    ],
    "limitations": [
      "Uses the normal z value; for small samples with σ estimated from the same data, a t-based size is slightly larger.",
      "A poor σ estimate gives a poor sample size.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the sample is too large to afford, accept a wider margin or reduce variation first."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 130–132. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "two-sample-t": {
    "purpose": "Welch’s two-sample t-test comparing the means of two groups (machines, suppliers, before and after) from their means, standard deviations and sample sizes.",
    "uses": [
      "Check whether a process change really improved the average",
      "Compare two suppliers or machines",
      "Support a trial report with statistics"
    ],
    "users": [
      "Quality engineers",
      "Process engineers",
      "Test engineers"
    ],
    "inputs": {
      "m1": "Average of group 1.",
      "s1": "Sample standard deviation of group 1.",
      "n1": "Number of independent results in group 1.",
      "m2": "Average of group 2.",
      "s2": "Sample standard deviation of group 2.",
      "n2": "Number of independent results in group 2.",
      "alpha": "Probability of wrongly declaring a difference that is not real (0.05 is common)."
    },
    "outputs": [
      "Difference of means and its standard error",
      "t statistic and degrees of freedom",
      "Two-sided p-value",
      "Confidence interval of the difference"
    ],
    "method": [
      "SE = √(s₁²/n₁ + s₂²/n₂); t = (m₁ − m₂) ÷ SE.",
      "Welch–Satterthwaite degrees of freedom: ν = SE⁴ ÷ ((s₁²/n₁)²/(n₁ − 1) + (s₂²/n₂)²/(n₂ − 1)).",
      "p = 2 × P(T_ν > |t|), from the regularised incomplete beta function.",
      "Significant when p < α.",
      "Example: the default groups differ by 2.2 with t = 2.5006, ν = 22.09 and p = 0.020303."
    ],
    "limitations": [
      "Independent random samples from roughly normal populations; strongly skewed data or small samples need care.",
      "Statistical significance is not practical importance: judge the size of the difference too.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A significant result with a tiny difference may not matter; a large but non-significant difference may need more data."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 130–133. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
