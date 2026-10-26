// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook43).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "investment-appraisal": {
    "purpose": "Appraisal of an equipment purchase with uniform yearly savings and running cost: net present value of the cash flows and salvage at your interest rate, internal rate of return by search (as the IRR tool), simple and discounted payback, the benefit–cost ratio (as the benefit–cost ratio tool), and the equivalent uniform annual cost of owning and running the machine using the capital recovery factor (as the interest factors tool).",
    "uses": [
      "Justify a new machine or automation project",
      "Compare a purchase against a hurdle rate",
      "Present a capital request with the usual measures"
    ],
    "users": [
      "Engineering managers",
      "Business owners",
      "Finance analysts"
    ],
    "inputs": {
      "P": "Total first cost including installation and commissioning.",
      "S": "Yearly savings or added income the machine brings.",
      "C": "Yearly running cost (maintenance, power, consumables) of the machine.",
      "salv": "Resale or scrap value at the end of the life.",
      "n": "Years the machine is expected to serve.",
      "rate": "Interest rate or minimum acceptable rate of return.",
      "payMax": "Longest simple payback your business accepts."
    },
    "outputs": [
      "Net present value and internal rate of return",
      "Simple and discounted payback",
      "Benefit–cost ratio and equivalent annual cost"
    ],
    "method": [
      "Net yearly flow A = savings − running cost; NPV = −P + A (P/A, i, n) + salvage (P/F, i, n).",
      "IRR: the rate that makes NPV zero, found by bisection (as the IRR tool).",
      "Simple payback = P ÷ A; discounted payback = first year the discounted cumulative flow turns positive.",
      "B/C = PV of savings ÷ (P + PV of running cost − PV of salvage) (as the benefit–cost ratio tool); EUAC = (P − salvage)(A/P, i, n) + salvage i + running cost.",
      "Example: NPV 21,874 at 8%, IRR 14.619%, payback 4 years, B/C 1.1873."
    ],
    "limitations": [
      "Before tax and inflation; tax depreciation and price changes alter the result.",
      "Uniform yearly flows; uneven flows need the IRR tool directly.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A positive NPV at the hurdle rate means the project earns more than the hurdle; payback alone ignores later years."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 139–146. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "air-leak-audit": {
    "purpose": "Audit of compressed-air leaks grouped by equivalent hole size: choked flow through each hole as free air (as the air leak cost tool), the total leak flow, its share of compressor capacity, the compressor power and yearly energy cost from your specific power, and the payback of repairing the leaks at your repair cost per leak.",
    "uses": [
      "Turn a leak survey into a cost and a repair budget",
      "Show management what leaks cost",
      "Check leakage against a target share of capacity"
    ],
    "users": [
      "Maintenance engineers",
      "Energy managers",
      "Plant engineers"
    ],
    "inputs": {
      "n1": "Number of leaks in the smallest group.",
      "d1": "Equivalent orifice diameter for that group (from an ultrasonic survey estimate).",
      "n2": "Leaks in the middle group.",
      "d2": "Equivalent orifice for the middle group.",
      "n3": "Leaks in the largest group.",
      "d3": "Equivalent orifice for the largest group.",
      "p": "Gauge pressure in the line at the leaks.",
      "Cd": "Discharge coefficient of a leak (about 0.6–0.65 for sharp holes).",
      "Tair": "Air temperature in the line.",
      "spec": "Compressor input power per m³/min of free air delivered (from the compressor data sheet).",
      "Qc": "Air delivered by the running compressors, as free air.",
      "hours": "Hours per year the system stays pressurised (leaks run even when production stops).",
      "price": "Price of electricity.",
      "repair": "Average cost to repair one leak.",
      "maxPct": "Leakage share of capacity you set as acceptable (well-run systems aim below 10%)."
    },
    "outputs": [
      "Leak flow by group and in total",
      "Share of compressor capacity, power and yearly cost",
      "Repair cost and payback"
    ],
    "method": [
      "Choked flow per hole ṁ = C_d A p₀ √(k ÷ R T₀) [2 ÷ (k + 1)]^((k+1)/(2(k−1))), as free air at 1.204 kg/m³ (as the air leak cost tool).",
      "Power = free-air flow (m³/min) × specific power; cost = power × hours × price.",
      "Repair payback = leaks × repair cost ÷ yearly cost.",
      "Example: the leaks waste 65.211 L/s (7.8254% of capacity), 25.432 kW and 38,149 a year; repairs pay back in 7.1759 days."
    ],
    "limitations": [
      "Equivalent-hole estimates from surveys are rough; a drawdown or no-load test measures total leakage directly.",
      "Assumes the compressors unload efficiently; poor control makes leaks cost more.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A few large leaks usually waste more than many small ones: fix the largest first."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "two-point-lift-plan": {
    "purpose": "Planning check for lifting a load made of several items from two lifting points on a line: combined mass and centre of gravity along the line (as the combined centre of gravity tool), the share of weight at each lifting point by moments, the sling leg angles and tensions with the hook placed above the centre of gravity at a given height, leg lengths, and checks of leg load against the working load limit and leg angle against your limit (for a central load the leg tensions match the sling tension tool).",
    "uses": [
      "Plan a lift of an assembly with an off-centre heavy part",
      "Choose sling lengths so the load hangs level",
      "Check each leg against its rating"
    ],
    "users": [
      "Rigging supervisors",
      "Lifting engineers",
      "Maintenance planners"
    ],
    "inputs": {
      "m1": "Mass of item 1 (0 if not used).",
      "x1": "Position of item 1’s centre of gravity along the line of the lifting points.",
      "m2": "Mass of item 2 (0 if not used).",
      "x2": "Position of item 2’s centre of gravity along the line of the lifting points.",
      "m3": "Mass of item 3 (0 if not used).",
      "x3": "Position of item 3’s centre of gravity along the line of the lifting points.",
      "xA": "Position of the first lifting point.",
      "xB": "Position of the second lifting point.",
      "h": "Height of the hook above the lifting points (sets the sling angles).",
      "wll": "Working load limit of each sling leg at its rating (your value; reduce for the hitch type).",
      "angMax": "Largest leg angle from vertical your lifting procedure allows."
    },
    "outputs": [
      "Combined mass and centre of gravity",
      "Weight at each lifting point",
      "Leg angles, tensions and lengths with checks"
    ],
    "method": [
      "Centre of gravity X = Σ m x ÷ Σ m (as the combined centre of gravity tool).",
      "Point loads by moments: R_A = W (x_B − X) ÷ (x_B − x_A), R_B = W − R_A.",
      "With the hook vertically above X at height h: leg angle θ = tan⁻¹(|X − x| ÷ h); leg tension = R ÷ cos θ; leg length = √[(X − x)² + h²].",
      "Example: the centre of gravity is 615.38 mm along; leg A carries 1,459.2 kg at 22.306° and leg B 816.54 kg at 42.709°."
    ],
    "limitations": [
      "Rigid load and planar geometry; a third dimension or a flexible load needs a full lift plan.",
      "Dynamic factors for the crane and the load are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The leg nearer the centre of gravity carries more and hangs more vertical; the far leg is longer and more inclined."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2613–2650, 221–227. Topic reference; no source tables or recommended settings are reproduced.",
      "AS 3775 and AS 1418 series, or your national lifting standards"
    ]
  },
  "rotor-run-up-time": {
    "purpose": "Start-up check of a rotor driven by a motor: inertia of up to two discs and a ring on the shaft (as the mass moment of inertia tool) plus the motor rotor, run-up time from the average accelerating torque against the average load torque (as the angular acceleration torque tool), revolutions to speed, kinetic energy stored, the energy dissipated in an induction motor rotor during a direct-on-line start, and checks against the motor’s allowed start time and starts per hour.",
    "uses": [
      "Check a motor can start a fan, centrifuge or flywheel",
      "Find how many starts per hour a high-inertia drive can take",
      "Estimate the time to reach speed"
    ],
    "users": [
      "Electrical engineers",
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "m1": "Mass of the main disc, impeller or flywheel.",
      "D1": "Outside diameter of disc 1 (treated as a solid disc).",
      "m2": "Mass of a second disc or hub.",
      "D2": "Diameter of disc 2.",
      "m3": "Mass of a ring or rim (0 if none).",
      "Do3": "Outside diameter of the ring.",
      "Di3": "Inside diameter of the ring.",
      "Jm": "Inertia of the motor rotor (from the motor data sheet).",
      "n": "Speed to reach.",
      "Tm": "Average motor torque between standstill and full speed (from the speed–torque curve).",
      "TL": "Average load torque over the same range (fans: about a third of full-load torque).",
      "tMax": "Longest start time the motor can tolerate hot (from the maker; close to the locked-rotor time).",
      "starts": "Starts required per hour.",
      "eMax": "Rotor heat per hour the motor can dissipate (from the maker; your value)."
    },
    "outputs": [
      "Inertia of each part and in total",
      "Run-up time, revolutions and stored energy",
      "Rotor energy per start and per hour with checks"
    ],
    "method": [
      "Solid disc J = m D² ÷ 8; ring J = m (D_o² + D_i²) ÷ 8 (as the mass moment of inertia tool).",
      "Run-up time t = J ω ÷ (T_m − T_L); revolutions = ω t ÷ 4π (as the angular acceleration torque tool).",
      "Stored energy = J ω² ÷ 2; induction rotor loss during a start ≈ J ω² ÷ 2 × T_m ÷ (T_m − T_L).",
      "Example: 2.3281 kg·m² reaches 1480 rpm in 4.0092 s; each start puts 37.282 kJ into the rotor."
    ],
    "limitations": [
      "Average torques; with a falling torque curve, integrate over speed for accuracy.",
      "Rotor loss formula assumes an induction motor started direct on line.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the load torque during the start (for example a closed damper) cuts both the time and the rotor heating."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 228–240, 2569–2580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tensile-test-evaluation": {
    "purpose": "Evaluation of a round tensile specimen: original area, yield strength from the 0.2% offset load, tensile strength from the maximum load (as the nominal stress of the true stress–strain tool), elastic modulus from a load and extension in the elastic range, elongation after fracture, reduction of area from the fracture diameter, true fracture stress and strain, the yield-to-tensile ratio, and checks against the specification minimums.",
    "uses": [
      "Work up a tensile test report",
      "Check a mill certificate or test result against a specification",
      "Estimate modulus from extensometer readings"
    ],
    "users": [
      "Materials engineers",
      "Test laboratory technicians",
      "Quality engineers"
    ],
    "inputs": {
      "d0": "Diameter of the reduced section before the test.",
      "L0": "Gauge length marked before the test.",
      "Fy": "Load at the 0.2% offset yield point (or the upper yield point for steels with a sharp yield).",
      "Fmax": "Highest load reached.",
      "Ff": "Load when the specimen broke.",
      "Lf": "Gauge length measured after fitting the broken halves together.",
      "df": "Smallest diameter at the fracture.",
      "Fe": "A load well inside the straight elastic part of the curve.",
      "dLe": "Extensometer extension over the gauge length at that load.",
      "syMin": "Least yield strength in the specification.",
      "utsMin": "Least tensile strength in the specification.",
      "elMin": "Least elongation in the specification."
    },
    "outputs": [
      "Yield and tensile strength, yield ratio",
      "Elongation, reduction of area and modulus",
      "True fracture stress and strain"
    ],
    "method": [
      "A₀ = π d₀² ÷ 4; yield = F_y ÷ A₀; tensile strength = F_max ÷ A₀ (as the true stress–strain tool’s nominal stress).",
      "Elongation = (L_f − L₀) ÷ L₀; reduction of area = (A₀ − A_f) ÷ A₀ (A_f from the fracture diameter).",
      "Modulus E = (F_e ÷ A₀) ÷ (ΔL_e ÷ L₀).",
      "True fracture stress = F_f ÷ A_f; true fracture strain = ln(A₀ ÷ A_f).",
      "Example: yield 292.85 MPa, tensile 420.17 MPa, elongation 22%, reduction of area 57.75%, modulus 198.94 GPa."
    ],
    "limitations": [
      "Round specimens; flat specimens use width and thickness for the area.",
      "Modulus from a single point is approximate; use the slope of the elastic line.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A high yield-to-tensile ratio leaves little warning before failure; ductile structural steels are usually below about 0.85."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1331–1334. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "brinell-test-check": {
    "purpose": "Evaluation of a Brinell test from two perpendicular indentation diameters: mean diameter, hardness, indentation ratio, force–diameter ratio and depth (as the Brinell hardness tool), the approximate tensile strength for steel, and the validity checks against your rules for indentation ratio, least specimen thickness as a multiple of indentation depth, least edge distance and least spacing as multiples of the indentation diameter, and the specification range.",
    "uses": [
      "Check a Brinell result before reporting it",
      "Choose a load and ball for a thin part",
      "Screen castings or forgings for hardness"
    ],
    "users": [
      "Test laboratory technicians",
      "Quality inspectors",
      "Materials engineers"
    ],
    "inputs": {
      "F": "Test force in kilograms-force (3000 kgf with a 10 mm ball for steel).",
      "D": "Diameter of the ball.",
      "d1": "Indentation diameter measured in one direction.",
      "d2": "Indentation diameter measured at right angles.",
      "thick": "Thickness of the specimen under the indentation.",
      "edge": "Distance from the indentation centre to the nearest edge.",
      "space": "Distance to the centre of the nearest other indentation.",
      "rLo": "Smallest indentation ratio your test standard allows.",
      "rHi": "Largest indentation ratio allowed.",
      "kThick": "Least specimen thickness as a multiple of indentation depth (from your test standard).",
      "kEdge": "Least edge distance as a multiple of the indentation diameter (from your test standard).",
      "kSpace": "Least centre spacing as a multiple of the indentation diameter (from your test standard).",
      "hbMin": "Lowest hardness the specification allows.",
      "hbMax": "Highest hardness the specification allows."
    },
    "outputs": [
      "Mean diameter, hardness and depth",
      "Validity checks",
      "Specification and tensile estimate"
    ],
    "method": [
      "Mean d = (d₁ + d₂) ÷ 2; HB = 2F ÷ [π D (D − √(D² − d²))]; depth = [D − √(D² − d²)] ÷ 2 (as the Brinell hardness tool).",
      "Validity: d ÷ D within the limits; thickness ≥ k × depth; edge ≥ k × d; spacing ≥ k × d.",
      "Approximate tensile strength (steel) ≈ 3.45 HB MPa.",
      "Example: d = 4.01 mm gives 227.58 HBW (about 785.14 MPa); the test meets the validity rules."
    ],
    "limitations": [
      "Indentation diameters must be measured accurately; a 1% error gives about 2% in hardness.",
      "Tensile estimate is approximate and for steels only.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the indentation is too large or too small for the ball, change the force so that d ÷ D falls in range."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1406–1412. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 6506-1 Metallic materials — Brinell hardness test — Part 1: Test method"
    ]
  },
  "compressor-staging-check": {
    "purpose": "Comparison of single-stage and two-stage compression with perfect intercooling: pressure ratio, adiabatic and shaft power for one and two stages (as the compressor power tool), the best intermediate pressure √(p₁ p₂), the ideal adiabatic discharge temperature for each case (as the gas compression process tool) and the actual temperature allowing for the adiabatic efficiency, the power saved by staging, and the discharge temperature of the chosen arrangement against your limit.",
    "uses": [
      "Choose between single- and two-stage compressors",
      "Check discharge temperature for oil and valve life",
      "Estimate the power saved by an intercooler"
    ],
    "users": [
      "Plant engineers",
      "Energy managers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Q": "Air delivered, as free air at inlet conditions.",
      "p1": "Absolute pressure at the inlet.",
      "p2": "Gauge pressure at discharge.",
      "T1": "Air temperature at the inlet (and after the intercooler).",
      "k": "Ratio of specific heats (1.4 for air).",
      "eff": "Adiabatic efficiency used to turn ideal power and temperature rise into actual values.",
      "stages": "Arrangement whose discharge temperature is checked.",
      "Tmax": "Highest discharge temperature for the lubricant, valves and piping (your value from the maker)."
    },
    "outputs": [
      "Pressure ratio and best intermediate pressure",
      "Power for one and two stages and the saving",
      "Discharge temperatures and the check"
    ],
    "method": [
      "r = p₂(abs) ÷ p₁; adiabatic power = s k ÷ (k − 1) p₁ Q [r^((k−1)/(s k)) − 1] for s stages; shaft = adiabatic ÷ efficiency (as the compressor power tool).",
      "Best intermediate pressure p_i = √(p₁ p₂) (equal ratio per stage, intercooled to inlet temperature).",
      "Ideal discharge T = T₁ r_s^((k−1)/k) (as the gas compression process tool); actual T = T₁ + (ideal rise) ÷ efficiency.",
      "Example: one stage needs 63.475 kW and reaches 334.89 °C; two stages need 54.165 kW and reach 154.36 °C, saving 14.666%."
    ],
    "limitations": [
      "Perfect intercooling to inlet temperature; real intercoolers leave a temperature approach.",
      "Ideal-gas, steady-flow model; oil-flooded screw compressors control discharge temperature by injection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Above a pressure ratio of about 4–5 per stage, discharge temperatures rise fast: staging protects valves and oil as well as saving power."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spherical-vessel-design": {
    "purpose": "Design of a spherical shell under internal pressure: thin-wall membrane stress and the thick-wall maximum stress at the bore (as the spherical shell tool) with the thickness reduced by the corrosion allowance, the safety factor on yield, the least thickness for the required factor plus allowance, capacity and shell mass, and the stress at the hydrotest pressure against your share of yield.",
    "uses": [
      "Size a spherical gas receiver or tank",
      "Compare a sphere with a cylinder for the same volume",
      "Check a sphere for a hydrotest"
    ],
    "users": [
      "Mechanical engineers",
      "Design engineers",
      "Inspection engineers"
    ],
    "inputs": {
      "di": "Inside diameter of the sphere.",
      "t": "Nominal plate thickness.",
      "ca": "Corrosion allowance taken off the thickness for the stress check.",
      "p": "Internal design pressure.",
      "Sy": "Yield strength of the plate at temperature.",
      "req": "Safety factor on yield you require (code design uses allowable stresses instead; this is a screening check).",
      "hydro": "Hydrotest pressure as a multiple of the design pressure (from your code).",
      "hyLim": "Largest membrane stress during the hydrotest as a share of yield (your value).",
      "rho": "Density of the plate."
    },
    "outputs": [
      "Membrane and maximum stress, safety factor",
      "Thickness needed with allowance",
      "Capacity, shell mass and hydrotest stress"
    ],
    "method": [
      "Thin wall σ = p d_i ÷ 4t; thick wall maximum σ = p (r_o³ + 2r_i³) ÷ [2(r_o³ − r_i³)] (as the spherical shell tool), with t reduced by the corrosion allowance.",
      "Safety factor = S_y ÷ maximum stress; thickness needed = p d_i × factor ÷ (4 S_y) + allowance.",
      "Capacity = π d_i³ ÷ 6; shell mass = ρ π (d_o³ − d_i³) ÷ 6; hydrotest stress = membrane stress × hydrotest ratio.",
      "Example: 6 mm plate (5 mm after allowance) runs at 60.011 MPa, a factor of 4.1659; the sphere holds 113.1 L and weighs 54.341 kg."
    ],
    "limitations": [
      "Membrane region only; nozzles, supports and welds need code design.",
      "Pressure vessels must be designed and certified to the applicable code.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A sphere needs about half the wall of a cylinder of the same diameter and pressure."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 290–294. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "motor-efficiency-test": {
    "purpose": "Load test of a three-phase motor with a Prony brake or arm-and-scale dynamometer: net scale force, torque and shaft output at the measured speed (as the Prony brake tool), electrical input from line voltage, current and power factor (as the motor power tool), efficiency, load as a share of rated output, and the efficiency check against the nameplate within your tolerance.",
    "uses": [
      "Check a rebuilt motor’s efficiency",
      "Verify a motor’s output under load",
      "Teach or demonstrate motor testing"
    ],
    "users": [
      "Electrical engineers",
      "Maintenance engineers",
      "Test technicians"
    ],
    "inputs": {
      "L": "Distance from the shaft centre to the scale contact on the brake arm.",
      "tare": "Scale reading with the brake loading the motor.",
      "zero": "Scale reading with the brake slack (arm weight).",
      "n": "Shaft speed during the reading.",
      "V": "Line-to-line voltage during the test.",
      "I": "Average line current during the test.",
      "pf": "Power factor during the test (from a power analyser).",
      "kW": "Rated output from the nameplate.",
      "effN": "Efficiency on the nameplate at this load.",
      "tol": "How many percentage points below the nameplate you accept (test accuracy plus standard tolerance)."
    },
    "outputs": [
      "Torque and shaft output",
      "Electrical input and efficiency",
      "Load share and nameplate check"
    ],
    "method": [
      "Net force W = reading − zero; torque T = W L; output P = 2π n T ÷ 60 (as the Prony brake tool).",
      "Electrical input = √3 V I pf (as the motor power tool).",
      "Efficiency = output ÷ input; load = output ÷ rated output.",
      "Example: 70 N·m at 1460 rpm is 10.702 kW out for 11.914 kW in, 89.829% efficient at 97.294% load."
    ],
    "limitations": [
      "Power factor must be measured; nameplate power factor gives only an estimate of input.",
      "Brake friction heating changes the load during a reading: take readings quickly at steady speed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Efficiency well below the nameplate after a rewind usually points to core damage or wrong winding data."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2998–2999, 2569–2580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
