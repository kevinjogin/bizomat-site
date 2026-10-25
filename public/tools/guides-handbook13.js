// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook13).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "bearing-friction": {
    "purpose": "Approximate friction torque, power loss and heat of a rolling bearing from its load, bore and a friction coefficient for the bearing type.",
    "uses": [
      "Estimate bearing losses in a drive",
      "Check heat input to a gearbox or spindle",
      "Compare bearing types"
    ],
    "users": [
      "Maintenance engineers",
      "Reliability engineers",
      "Maintenance technicians"
    ],
    "inputs": {
      "P": "Resultant load on one bearing.",
      "d": "Bearing bore diameter.",
      "mu": "Approximate constant friction coefficient from the bearing maker for the type (deep groove ball about 0.0015, cylindrical roller about 0.0011, spherical and tapered roller about 0.0018).",
      "rpm": "Shaft speed.",
      "n": "Number of similar bearings."
    },
    "outputs": [
      "Friction torque per bearing",
      "Power loss",
      "Heat per hour"
    ],
    "method": [
      "Friction torque M = 0.5 μ P d.",
      "Power loss = M × 2πn ÷ 60 per bearing, times the number of bearings.",
      "Heat per hour = power × 3600.",
      "Example: 5000 N on a 50 mm bore at 1500 rpm loses about 58.905 W for 2 bearings."
    ],
    "limitations": [
      "Constant-coefficient approximation for normal loads and good lubrication; seals, churning and high speed add losses.",
      "Use the maker’s friction model for accurate thermal design.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Seal and lubricant drag often exceed load friction at light loads."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2365–2420. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "oil-viscosity-temperature": {
    "purpose": "Kinematic viscosity of a lubricating or hydraulic oil at any temperature from two known points (usually 40 °C and 100 °C) by the ASTM D341 (Walther) relation.",
    "uses": [
      "Find operating viscosity for bearing and gear calculations",
      "Check hydraulic oil at cold start",
      "Compare oil grades"
    ],
    "users": [
      "Maintenance engineers",
      "Reliability engineers",
      "Maintenance technicians"
    ],
    "inputs": {
      "T1": "Temperature of the first data point (40 °C on most data sheets).",
      "v1": "Kinematic viscosity at T1 from the oil data sheet.",
      "T2": "Temperature of the second data point (usually 100 °C).",
      "v2": "Kinematic viscosity at T2.",
      "T": "Temperature you need the viscosity at."
    },
    "outputs": [
      "Viscosity at the operating temperature",
      "Walther constants"
    ],
    "method": [
      "log₁₀ log₁₀(ν + 0.7) = A − B log₁₀(T), with T in kelvin.",
      "A and B are fitted through the two known points.",
      "ν(T) = 10^(10^(A − B log₁₀ T)) − 0.7.",
      "Example: an oil of 46 cSt at 40 °C and 6.8 cSt at 100 °C has about 20.623 cSt at 60 °C."
    ],
    "limitations": [
      "Valid for mineral and many synthetic oils in the normal range; not below the pour point.",
      "Multigrade and polymer-thickened oils can deviate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare with the viscosity your bearings, gears or hydraulic components need at operating temperature."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2329–2337, 2698. Topic reference; no source tables or recommended settings are reproduced.",
      "ASTM D341 Viscosity–Temperature Charts for Liquid Petroleum Products"
    ]
  },
  "rim-face-alignment": {
    "purpose": "Vertical (or horizontal) offset and angularity from rim and face dial indicator readings, and the correction at the front and back feet of the movable machine.",
    "uses": [
      "Calculate shim changes after taking rim and face readings",
      "Calculate horizontal moves from side readings",
      "Check alignment before and after correction"
    ],
    "users": [
      "Maintenance engineers",
      "Reliability engineers",
      "Maintenance technicians"
    ],
    "inputs": {
      "rim": "Total indicator reading on the movable coupling rim at the bottom, with the indicator on the stationary shaft and zeroed at the top (plunger in = positive).",
      "face": "Total indicator reading on the movable coupling face at the bottom, zeroed at the top (positive = gap closed at the bottom).",
      "dia": "Diameter of the circle the face indicator tip traces.",
      "front": "Axial distance from the coupling face (indicator plane) to the movable machine’s front feet.",
      "back": "Axial distance from the coupling face to the back feet."
    },
    "outputs": [
      "Offset at the coupling",
      "Angularity (slope)",
      "Shim change at the front and back feet"
    ],
    "method": [
      "Offset = rim ÷ 2 (positive: movable shaft low at the coupling).",
      "Slope = face ÷ face diameter (positive: movable shaft slopes down away from the coupling).",
      "Correction at a foot = offset + slope × distance to that foot; positive = add shims (raise), negative = remove.",
      "Example: rim 0.3 and face 0.1 mm: add 0.35833 mm at the front feet and 0.69167 mm at the back feet."
    ],
    "limitations": [
      "Sign convention as stated (indicator on stationary shaft, readings on the movable coupling); check yours before moving the machine.",
      "Indicator bracket sag, soft foot and thermal growth are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Correct soft foot first, then vertical, then horizontal; re-read after each move."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2645–2650. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "motor-slip": {
    "purpose": "Synchronous speed from supply frequency and poles, slip at a measured speed, and an estimate of load from slip compared with rated slip.",
    "uses": [
      "Estimate motor load from a tachometer reading",
      "Check pole count and nameplate speed",
      "Find speed at another frequency (VFD)"
    ],
    "users": [
      "Electrical and maintenance engineers",
      "Energy managers"
    ],
    "inputs": {
      "f": "Supply frequency (50 Hz in Australia).",
      "poles": "Number of poles (from the nameplate or synchronous speed).",
      "n": "Measured shaft speed with a tachometer.",
      "nRated": "Full-load speed from the nameplate."
    },
    "outputs": [
      "Synchronous speed",
      "Slip at measured and rated speed",
      "Estimated load"
    ],
    "method": [
      "Synchronous speed ns = 120 f ÷ poles.",
      "Slip = (ns − n) ÷ ns.",
      "Load ≈ measured slip ÷ rated slip × 100% (slip is roughly proportional to load below full load).",
      "Example: a 4-pole motor at 50 Hz running 1475 rpm has 1.6667% slip, about 62.5% load."
    ],
    "limitations": [
      "Slip–load proportionality is approximate and assumes rated voltage; nameplate speeds have tolerance.",
      "Not valid for synchronous or permanent-magnet motors.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Motors running well below 50% load are often oversized and less efficient."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2569–2580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "water-hammer": {
    "purpose": "Pressure wave speed in a pipe, the Joukowsky surge for a fast valve closure, the critical closure time, and the reduced surge for slower closure.",
    "uses": [
      "Check pipework for surge when a valve shuts",
      "Choose a valve closing time",
      "Decide whether surge protection is needed"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "dv": "Change in flow velocity caused by the valve (the full velocity for a complete closure).",
      "L": "Length of pipe between the valve and the nearest reservoir, tank or open end.",
      "tc": "Time the valve takes to close.",
      "D": "Inside diameter of the pipe.",
      "t": "Pipe wall thickness.",
      "E": "Elastic modulus of the pipe material (steel 200 GPa, PVC about 3 GPa).",
      "K": "Bulk modulus of the liquid (water 2.2 GPa, hydraulic oil about 1.5 GPa).",
      "rho": "Liquid density."
    },
    "outputs": [
      "Wave speed",
      "Critical closure time",
      "Joukowsky surge",
      "Estimated surge for the actual closing time"
    ],
    "method": [
      "Wave speed a = √((K/ρ) ÷ (1 + K D ÷ (E t))).",
      "Fast closure (tc ≤ 2L/a): Δp = ρ a Δv.",
      "Slow closure: Δp ≈ ρ a Δv × (2L/a) ÷ tc.",
      "Example: stopping 2 m/s of water in a 100 mm steel pipe gives up to 26.245 bar."
    ],
    "limitations": [
      "Simple estimate; valve characteristics, column separation and branches need a transient analysis.",
      "Add the surge to the steady operating pressure.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the surge plus working pressure exceeds the pipe or component rating, slow the closure or add surge protection."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "coolant-flow-heat": {
    "purpose": "Liquid flow needed to carry away a heat load at a given temperature rise, or the temperature rise for a given flow, for water, glycol mixtures or oil.",
    "uses": [
      "Size cooling water for a machine, mould or oil cooler",
      "Check temperature rise in a hydraulic return line",
      "Size a chiller circuit"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "mode": "Find the flow, or the temperature rise.",
      "kW": "Heat to be removed (machine losses, hydraulic power loss, process heat).",
      "dT": "Outlet minus inlet temperature you can accept.",
      "Q": "Available flow (rise mode).",
      "cp": "Specific heat (water 4.18, 30% glycol about 3.7, mineral oil about 1.9 kJ/kg·K).",
      "rho": "Fluid density (water 998, 30% glycol about 1040, oil about 870 kg/m³)."
    },
    "outputs": [
      "Flow or temperature rise",
      "Mass flow"
    ],
    "method": [
      "Heat Q = ṁ cp ΔT.",
      "Volume flow = heat ÷ (ρ cp ΔT), converted to L/min.",
      "Temperature rise = heat ÷ (ρ cp × flow).",
      "Example: 15 kW with a 5 K rise needs 43.148 L/min of water."
    ],
    "limitations": [
      "Steady state; fluid properties taken at the mean temperature.",
      "Heat exchanger size is a separate calculation (see the LMTD tool).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A smaller allowed temperature rise needs proportionally more flow."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–374. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "air-pipe-drop": {
    "purpose": "Pressure drop in a compressed air line from free-air flow, line pressure, pipe size and length, using the Darcy–Weisbach method with air density at line pressure and a Colebrook friction factor.",
    "uses": [
      "Size compressed air mains and drops",
      "Check pressure at a remote user",
      "Find savings from a larger main"
    ],
    "users": [
      "Maintenance engineers",
      "Energy and utilities managers",
      "Design engineers"
    ],
    "inputs": {
      "Q": "Flow of free air (at inlet conditions) through the pipe.",
      "d": "Inside diameter of the pipe.",
      "L": "Straight length plus equivalent length of fittings and valves.",
      "p": "Pressure at the start of the pipe.",
      "T": "Temperature of the compressed air.",
      "eps": "Roughness: about 0.045 mm for steel, 0.0015 mm for aluminium or plastic air pipe."
    },
    "outputs": [
      "Air velocity and Reynolds number",
      "Friction factor",
      "Pressure drop and percentage of line pressure"
    ],
    "method": [
      "Line density ρ = 1.204 × (p_abs ÷ 1.01325) × (293.15 ÷ T); actual flow = free air flow × (1.01325 ÷ p_abs) × (T ÷ 293.15).",
      "Re = ρ v d ÷ μ (μ ≈ 1.81 × 10⁻⁵ Pa·s); Colebrook friction factor.",
      "Δp = f (L ÷ d) ρ v² ÷ 2.",
      "Example: 5 m³/min at 7 bar g through 100 m of 40 mm pipe drops about 0.18438 bar."
    ],
    "limitations": [
      "Valid while the drop is a small share of the line pressure (under about 10%); otherwise calculate in sections.",
      "Equivalent lengths of fittings must be estimated from fittings data.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A common design aim is under 0.1–0.3 bar drop from compressor to the furthest user."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3036–3041, 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pneumatic-cylinder-force": {
    "purpose": "Extend and retract forces of a double-acting pneumatic cylinder, the load ratio against a recommended limit, and the smallest bore that meets it.",
    "uses": [
      "Select a cylinder bore for a load",
      "Check an existing cylinder at a lower pressure",
      "Compare push and pull forces"
    ],
    "users": [
      "Automation engineers",
      "Maintenance engineers",
      "Machine builders"
    ],
    "inputs": {
      "bore": "Cylinder bore.",
      "rod": "Piston rod diameter.",
      "p": "Minimum supply pressure at the valve.",
      "eff": "Allowance for seal friction (about 85–95%).",
      "load": "Force needed to move the load (friction, weight, process force).",
      "ratio": "Highest share of theoretical force to use; makers often recommend about 50–70% for dynamic motion and higher for slow clamping."
    },
    "outputs": [
      "Extend and retract forces",
      "Load ratio",
      "Smallest bore meeting the load ratio"
    ],
    "method": [
      "Extend F = p × π D² ÷ 4 × η; retract F = p × π(D² − d²) ÷ 4 × η (p in N/mm² = bar ÷ 10).",
      "Load ratio = load ÷ theoretical extend force.",
      "Minimum bore = √(4 × load ÷ (π p × ratio)).",
      "Example: a 50 mm bore at 6 bar pushes 1,060.3 N; a 600 N load needs at least 42.649 mm bore."
    ],
    "limitations": [
      "Static force; acceleration, cushioning and air supply flow are not included.",
      "Side loads on the rod need guides.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose the next standard bore (32, 40, 50, 63, 80, 100 mm…) above the minimum."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "vacuum-cup": {
    "purpose": "Holding force of vacuum suction cups from cup diameter, vacuum level and number of cups, compared with the force needed for horizontal lifting or vertical (shear) handling with acceleration and a safety factor.",
    "uses": [
      "Size vacuum cups for a robot or lifter",
      "Check a gripper for faster motion",
      "Compare horizontal and vertical handling"
    ],
    "users": [
      "Automation engineers",
      "Robot integrators"
    ],
    "inputs": {
      "D": "Effective suction diameter of each cup.",
      "n": "Cups sharing the load.",
      "vac": "Vacuum level achieved at the cups (e.g. 60 kPa below atmospheric for porous-free parts).",
      "mass": "Mass of the part.",
      "accel": "Peak acceleration of the gripper.",
      "orient": "Whether the cups pull straight off the part or hold it in shear.",
      "mu": "Friction between cup and part for shear loading (dry metal about 0.5; oily parts much lower).",
      "sf": "Safety factor (2 for horizontal, 4 or more for vertical handling are common)."
    },
    "outputs": [
      "Holding force per cup and in total",
      "Force required",
      "Margin"
    ],
    "method": [
      "Holding force per cup = vacuum × π D² ÷ 4 (kPa × mm² ÷ 1000 = N).",
      "Horizontal: required = m (g + a) × safety factor.",
      "Vertical (shear): required = m (g + a) ÷ μ × safety factor.",
      "Example: 4 cups of 40 mm at 60 kPa hold 301.59 N against 148.07 N required."
    ],
    "limitations": [
      "Flat, non-porous, rigid surfaces; porous, curved or oily parts reduce holding force.",
      "Cup deformation and peel loads are not considered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the cup maker’s theoretical force tables and add vacuum monitoring for safety."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "valve-flow-coefficient": {
    "purpose": "Valve flow coefficient Kv (and Cv) for a liquid from flow, pressure drop and specific gravity, or the flow through a valve of known Kv.",
    "uses": [
      "Size a control or isolation valve",
      "Find the pressure drop through a valve",
      "Convert between Kv and Cv"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "mode": "Find the Kv needed, or the flow through a valve.",
      "Q": "Liquid flow through the valve.",
      "dp": "Pressure difference across the valve.",
      "Kv": "Kv from the valve data sheet.",
      "sg": "Specific gravity (water = 1)."
    },
    "outputs": [
      "Kv",
      "Cv",
      "Flow"
    ],
    "method": [
      "Q (m³/h) = Kv √(Δp (bar) ÷ SG).",
      "Kv = Q √(SG ÷ Δp).",
      "Cv (US gal/min at 1 psi) = 1.156 Kv.",
      "Example: 10 m³/h of water at 0.5 bar drop needs Kv 14.142 (Cv 16.348)."
    ],
    "limitations": [
      "Turbulent, non-flashing, non-cavitating liquid flow; gases and choked flow need other formulas.",
      "Control valves are usually selected to run at 20–80% of their rated Kv.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose a valve whose Kv gives the required flow near the middle of its travel."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "radiant-heat": {
    "purpose": "Net radiant heat exchange between a surface and large surroundings from area, emissivity and temperatures (Stefan–Boltzmann law), with the equivalent radiation coefficient.",
    "uses": [
      "Estimate heat loss from furnace walls, ovens and hot parts",
      "Compare surface finishes (emissivity)",
      "Add radiation to convection estimates"
    ],
    "users": [
      "Process engineers",
      "Energy managers",
      "Maintenance engineers"
    ],
    "inputs": {
      "area": "Radiating surface area.",
      "eps": "Emissivity of the surface (oxidised steel about 0.8, painted 0.9, polished aluminium about 0.05).",
      "Ts": "Surface temperature.",
      "Ta": "Temperature of the surrounding walls or space (large surroundings)."
    },
    "outputs": [
      "Net radiant heat",
      "Heat flux",
      "Equivalent radiation coefficient"
    ],
    "method": [
      "Q = ε σ A (Ts⁴ − Ta⁴), with σ = 5.670 × 10⁻⁸ W/m²K⁴ and temperatures in kelvin.",
      "Equivalent coefficient h_r = Q ÷ (A (Ts − Ta)).",
      "Example: 2 m² at 300 °C with ε 0.8 radiates about 9.0736 kW."
    ],
    "limitations": [
      "Grey surface facing large surroundings; view factors for nearby surfaces are not included.",
      "Convection adds to the total loss.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Low-emissivity cladding greatly reduces radiant losses from hot equipment."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "insulated-pipe": {
    "purpose": "Heat loss per metre and in total from an insulated pipe by radial conduction and surface convection, the outer surface temperature and the yearly energy cost.",
    "uses": [
      "Choose insulation thickness for steam, hot water or oil lines",
      "Estimate savings from insulating bare pipe",
      "Check surface temperature for burn protection"
    ],
    "users": [
      "Process engineers",
      "Energy managers",
      "Maintenance engineers"
    ],
    "inputs": {
      "D": "Outside diameter of the pipe (e.g. 60.3 mm for DN50).",
      "t": "Insulation thickness; 0 for bare pipe.",
      "k": "Conductivity of the insulation at its mean temperature (mineral wool about 0.04 W/m·K).",
      "Ti": "Temperature of the pipe wall (fluid temperature).",
      "Ta": "Surrounding air temperature.",
      "h": "Combined convection and radiation coefficient at the outer surface (about 8–12 still air indoors; higher outdoors and for bare metal).",
      "L": "Length of pipe.",
      "hours": "Hours per year the line is hot.",
      "price": "Cost of heat delivered (fuel price ÷ boiler efficiency)."
    },
    "outputs": [
      "Heat loss per metre and total",
      "Outer surface temperature",
      "Energy and cost per year"
    ],
    "method": [
      "Resistance per metre R = ln(r₂ ÷ r₁) ÷ (2π k) + 1 ÷ (2π r₂ h).",
      "Heat loss per metre q = (Ti − Ta) ÷ R; total = q × L.",
      "Surface temperature = Ta + q ÷ (2π r₂ h); cost = loss × hours × price.",
      "Example: 50 mm insulation on a 60.3 mm pipe at 150 °C loses 31.794 W/m; the surface runs at 26.313 °C."
    ],
    "limitations": [
      "Steady state; the pipe wall resistance is neglected and the surface coefficient is user-estimated.",
      "Valves, flanges and supports lose much more per metre if left bare.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare the cost per year with insulation cost to find the payback; check surface temperature for safety."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lmtd-exchanger": {
    "purpose": "Log mean temperature difference for counter-flow or parallel-flow exchange, the area needed for a heat duty at an overall coefficient, and a temperature-cross check.",
    "uses": [
      "Size an oil cooler or plate heat exchanger",
      "Check an existing exchanger for a new duty",
      "Compare counter-flow and parallel flow"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "Thi": "Inlet temperature of the hot fluid.",
      "Tho": "Outlet temperature of the hot fluid.",
      "Tci": "Inlet temperature of the cold fluid.",
      "Tco": "Outlet temperature of the cold fluid.",
      "flow": "Flow arrangement (shell-and-tube with several passes needs a correction factor, not included).",
      "kW": "Heat to transfer.",
      "U": "Overall coefficient for the exchanger type and fluids (oil to water about 200–600 W/m²K)."
    },
    "outputs": [
      "Terminal temperature differences",
      "LMTD",
      "Area required"
    ],
    "method": [
      "Counter-flow: ΔT₁ = Th,in − Tc,out; ΔT₂ = Th,out − Tc,in. Parallel: ΔT₁ = Th,in − Tc,in; ΔT₂ = Th,out − Tc,out.",
      "LMTD = (ΔT₁ − ΔT₂) ÷ ln(ΔT₁ ÷ ΔT₂).",
      "Area = Q ÷ (U × LMTD).",
      "Example: the default temperatures give LMTD = 29.72 K and need 1.6824 m² for 20 kW."
    ],
    "limitations": [
      "Pure counter-flow or parallel flow; multi-pass exchangers need the F correction factor.",
      "Fouling must be included in U.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Counter-flow needs less area and allows the cold outlet to exceed the hot outlet."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "process-breakeven": {
    "purpose": "Break-even quantity between two manufacturing methods with different set-up (or tooling) and unit costs, the cost of each at a planned quantity, and the cheaper choice.",
    "uses": [
      "Choose between manual and CNC, or laser and punch, for a batch",
      "Decide when dedicated tooling pays",
      "Explain quantity effects on quotes"
    ],
    "users": [
      "Manufacturing engineers",
      "Estimators",
      "Production managers"
    ],
    "inputs": {
      "sA": "Fixed cost of method A for the batch (set-up, programming, simple tooling).",
      "cA": "Variable cost per unit by method A (machine time, labour, material differences).",
      "sB": "Fixed cost of method B (often higher for dedicated tooling or programming).",
      "cB": "Variable cost per unit by method B.",
      "qty": "Quantity to be made (including expected repeat orders if tooling is kept)."
    },
    "outputs": [
      "Break-even quantity",
      "Total and unit cost of each at the planned quantity",
      "Cheaper process"
    ],
    "method": [
      "Total cost = set-up + unit cost × quantity.",
      "Break-even quantity = (set-up B − set-up A) ÷ (unit cost A − unit cost B).",
      "Below break-even the lower set-up cost wins; above it the lower unit cost wins.",
      "Example: the default methods break even at 275 units; at 200 units process A is cheaper."
    ],
    "limitations": [
      "Linear costs; learning, capacity limits and quality differences are not included.",
      "Unit costs must be on the same basis (direct cost or full cost) for both methods.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Near the break-even quantity, choose on lead time, capacity or quality instead of cost."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 143–146. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "learning-curve": {
    "purpose": "Unit time, cumulative time and average time per unit on a Wright learning curve from the first-unit time and learning rate, with labour cost for the batch.",
    "uses": [
      "Quote new products with falling labour time",
      "Plan staffing for a ramp-up",
      "Check whether production times are improving as expected"
    ],
    "users": [
      "Estimators",
      "Production planners",
      "Industrial engineers"
    ],
    "inputs": {
      "T1": "Time for the first unit, from a trial build or estimate.",
      "rate": "Time for a doubled quantity as a percentage of the earlier time (assembly often 80–90%, machining 90–95%).",
      "n": "Number of units in the batch.",
      "cost": "Labour cost per hour."
    },
    "outputs": [
      "Time for the nth unit",
      "Cumulative and average time",
      "Labour cost of the batch"
    ],
    "method": [
      "Unit time Tₙ = T₁ n^b, with b = log₂(learning rate).",
      "Cumulative time = Σ Tᵢ for i = 1…n; average = cumulative ÷ n.",
      "Batch cost = cumulative time × labour rate.",
      "Example: at 85%, unit 50 takes 3.9962 h and the batch averages 5.1026 h per unit."
    ],
    "limitations": [
      "Learning flattens out; production standards eventually limit times.",
      "Breaks in production cause forgetting and higher times.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use average time for quoting a batch and unit time for planning the end of the run."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 146. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "xbar-r-limits": {
    "purpose": "Centre lines and upper and lower control limits for X-bar and range charts from the grand average, average range and subgroup size, with the estimated process standard deviation.",
    "uses": [
      "Set up control charts for a process",
      "Recalculate limits after a process change",
      "Estimate process sigma for capability studies"
    ],
    "users": [
      "Quality engineers",
      "Process engineers",
      "Production supervisors"
    ],
    "inputs": {
      "xbar": "Average of the subgroup averages from at least 20–25 subgroups of a stable process.",
      "rbar": "Average of the subgroup ranges.",
      "n": "Number of measurements in each subgroup."
    },
    "outputs": [
      "X-bar chart centre line and limits",
      "R chart centre line and limits",
      "Estimated process standard deviation"
    ],
    "method": [
      "X-bar limits = X̿ ± A₂ R̄.",
      "R limits: UCL = D₄ R̄, LCL = D₃ R̄.",
      "σ̂ = R̄ ÷ d₂. Constants for n = 2…10 (A₂, D₃, D₄, d₂) are the standard SPC values.",
      "Example: X̿ 25.01, R̄ 0.03, n = 5: X-bar limits 24.9927 to 25.0273; R UCL 0.06342."
    ],
    "limitations": [
      "Limits are valid only for a stable process; remove assignable causes before setting them.",
      "Control limits are not specification limits.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Points outside the limits, or non-random patterns, signal special causes to investigate."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 7870-2 Control charts — Shewhart control charts"
    ]
  },
  "sampling-oc": {
    "purpose": "Probability of accepting a lot for a single sampling plan (sample size n, acceptance number c) at a given fraction defective, with average outgoing quality and the operating characteristic at several defect levels.",
    "uses": [
      "Understand what a sampling plan really protects against",
      "Compare sampling plans",
      "Explain risk to customers and suppliers"
    ],
    "users": [
      "Quality engineers",
      "Process engineers",
      "Production supervisors"
    ],
    "inputs": {
      "n": "Number of items inspected from the lot.",
      "c": "Largest number of defectives that still accepts the lot.",
      "p": "True percentage defective in the lot to evaluate."
    },
    "outputs": [
      "Probability of acceptance",
      "Average outgoing quality (rectifying inspection)",
      "Operating characteristic table"
    ],
    "method": [
      "Pa = Σₖ₌₀..c C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ (binomial).",
      "Average outgoing quality ≈ p × Pa when rejected lots are fully sorted.",
      "Example: n = 50, c = 1 accepts a 2% defective lot 73.577% of the time."
    ],
    "limitations": [
      "Binomial model (lot much larger than the sample); small lots need the hypergeometric distribution.",
      "Assumes random sampling and perfect inspection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Read the table to see the defect levels the plan reliably rejects, not just the AQL."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 2859-1 Sampling procedures for inspection by attributes"
    ]
  },
  "weibull-reliability": {
    "purpose": "Reliability, probability of failure, hazard rate, B10 life and mean time to failure from Weibull shape and scale parameters, for a mission or maintenance interval.",
    "uses": [
      "Set preventive maintenance intervals from failure data",
      "Estimate spares demand",
      "Explain wear-out versus random failures"
    ],
    "users": [
      "Maintenance engineers",
      "Reliability engineers",
      "Maintenance technicians"
    ],
    "inputs": {
      "beta": "Shape from a Weibull analysis of failure data (below 1: early failures; 1: random; above 1: wear-out).",
      "eta": "Characteristic life: the time by which 63.2% have failed.",
      "t": "Operating time or maintenance interval to evaluate."
    },
    "outputs": [
      "Reliability at time t",
      "Probability of failure",
      "Hazard rate",
      "B10 life and MTTF"
    ],
    "method": [
      "R(t) = exp(−(t ÷ η)^β); F = 1 − R.",
      "Hazard h(t) = (β ÷ η)(t ÷ η)^(β − 1).",
      "B10 = η (−ln 0.9)^(1/β); MTTF = η Γ(1 + 1/β).",
      "Example: β 2, η 10000 h: reliability at 2000 h is 96.079%, B10 life 3,245.9 h."
    ],
    "limitations": [
      "Two-parameter Weibull (no failure-free period); parameters must come from relevant failure data.",
      "Preventive replacement only helps when β > 1 (wear-out).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With β ≤ 1, scheduled replacement does not reduce failures; use condition monitoring instead."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
