// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook18).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "bend-radius-limits": {
    "purpose": "Minimum inside bend radius from the material’s reduction of area in a tensile test, and the maximum radius that still produces permanent (plastic) deformation, by the handbook formulas.",
    "uses": [
      "Choose a punch radius that will not crack the bend",
      "Check whether a large-radius bend will form at all",
      "Compare materials for formability"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "t": "Sheet or plate thickness.",
      "r": "Percentage reduction of area from a tensile test of the material (from the mill certificate or material data).",
      "E": "Elastic modulus.",
      "YS": "Yield strength.",
      "R": "Inside radius you intend to use."
    },
    "outputs": [
      "Minimum bend radius",
      "Maximum bend radius for a permanent bend",
      "Check of the planned radius"
    ],
    "method": [
      "R_min = T (50 ÷ r − 1), with r the reduction of area in per cent.",
      "R_max = T E ÷ 2 YS (beyond this the outer fibres stay elastic).",
      "Example: 3 mm sheet with 40% reduction of area can be bent to 0.75 mm minimum radius."
    ],
    "limitations": [
      "Bends across the rolling direction tolerate tighter radii than bends along it.",
      "Edge condition (burrs, shearing) causes cracks at larger radii than predicted.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Allow extra radius for bends parallel to the grain and for sheared edges."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1346–1347. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "anodizing-time": {
    "purpose": "Anodic coating thickness from current density and time by the common “720 rule” for sulfuric acid anodizing of aluminium, the time for a target thickness, the build-up and penetration split, and the rectifier current.",
    "uses": [
      "Set anodizing time for a specified coating",
      "Size rectifier current for a rack",
      "Allow for dimensional build-up on toleranced parts"
    ],
    "users": [
      "Finishing supervisors",
      "Platers",
      "Design engineers"
    ],
    "inputs": {
      "J": "Anodizing current density (typically 1.2–2 A/dm² for sulfuric acid, higher for hard anodizing).",
      "thick": "Required total coating thickness.",
      "area": "Total area being anodized.",
      "eff": "Correction from your own process records (100% = textbook rule; alloys, temperature and bath age change it)."
    },
    "outputs": [
      "Time to the target thickness",
      "Build-up per surface and penetration",
      "Rectifier current"
    ],
    "method": [
      "720 rule: thickness (mil) = current density (A/ft²) × time (min) ÷ 720, which in metric is about 0.328 µm per A/dm² per minute.",
      "Time = thickness ÷ (0.328 × J × efficiency).",
      "About one third of the coating builds up on the surface and two thirds penetrates into the metal (sulfuric acid process).",
      "Example: 20 µm at 1.5 A/dm² takes about 40.682 min."
    ],
    "limitations": [
      "Rule of thumb for Type II sulfuric acid anodizing; hard anodizing and other electrolytes differ.",
      "High-silicon and high-copper alloys grow coatings more slowly.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check thickness with an eddy-current gauge and calibrate the efficiency factor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1500–1516. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gating-choke-area": {
    "purpose": "Velocity of metal at the base of the sprue from the effective head, the choke area needed to pour a casting in a set time, the equivalent round sprue diameter and gate areas for a chosen gating ratio.",
    "uses": [
      "Size sprues and gates for a new pattern",
      "Check pouring time for thin-walled castings",
      "Compare pressurised and unpressurised gating"
    ],
    "users": [
      "Foundry engineers",
      "Pattern makers"
    ],
    "inputs": {
      "W": "Mass of metal poured, including runners and risers.",
      "rho": "Density of the liquid metal (grey iron about 7000, steel about 7000, aluminium about 2400 kg/m³).",
      "h": "Effective head at the choke (for top gating, the sprue height; reduce it for bottom gating as the mould fills).",
      "t": "Target pouring time from foundry practice for the casting weight and section (often found from an empirical rule).",
      "Cd": "Flow efficiency of the gating system (about 0.7–0.9).",
      "runner": "Runner area relative to the choke (e.g. 1 : 2 : 2 unpressurised gives 2).",
      "gate": "Total gate area relative to the choke."
    },
    "outputs": [
      "Metal velocity at the choke",
      "Choke area and equivalent sprue diameter",
      "Runner and total gate areas"
    ],
    "method": [
      "Velocity v = √(2 g h).",
      "Choke area A = W ÷ (ρ t C_d v).",
      "Runner and gate areas = choke area × gating ratios; round sprue diameter = √(4A/π).",
      "Example: 40 kg poured in 12 s from 200 mm head needs a choke of 300.54 mm² (19.562 mm diameter)."
    ],
    "limitations": [
      "Simple Bernoulli model; friction, bends and turbulence are lumped into the flow efficiency.",
      "Pouring time rules and gating ratios depend on the alloy and casting; use foundry practice.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Unpressurised systems (gates larger than the choke) give calmer filling for aluminium; pressurised systems suit iron."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1404–1420. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cnc-chord-error": {
    "purpose": "Chordal deviation of straight line segments approximating an arc or contour, the longest segment for a given tolerance, and the number of segments for the arc.",
    "uses": [
      "Set CAM output tolerance",
      "Check whether a posted program meets the profile tolerance",
      "Estimate block count for a contour"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "mode": "Find the segment length for a tolerance, or the error for a segment length.",
      "R": "Radius of the arc or local radius of curvature of the contour.",
      "tol": "Allowed deviation between chord and arc.",
      "L": "Length of each straight segment (error mode).",
      "angle": "Angle of the arc, for the number of segments."
    },
    "outputs": [
      "Segment length and angle",
      "Chord error",
      "Segments for the arc"
    ],
    "method": [
      "Error e = R (1 − cos(θ/2)), where θ is the angle subtended by one segment.",
      "Segment length L = 2√(2Re − e²).",
      "Segments = arc angle ÷ θ, rounded up.",
      "Example: R 50 mm with a 0.005 mm tolerance allows 1.4142 mm segments, 56 for 90°."
    ],
    "limitations": [
      "Error on one side of the profile only (chords lie inside a convex arc); CAM systems may split the tolerance inside and outside.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Very small tolerances create huge programs; use arc output (G02/G03) or spline interpolation where the control allows."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1279–1300, 77–80. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "chip-thickness-kc": {
    "purpose": "Mean chip thickness for milling (from feed per tooth, radial engagement and lead angle) or turning, and the specific cutting force kc from the material’s kc1.1 and exponent mc, for use in power calculations.",
    "uses": [
      "Get the right kc for the milling and turning power tools",
      "See how light radial engagement thins the chip",
      "Compare feeds for efficient cutting"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "op": "Milling or turning.",
      "fz": "Feed per tooth (milling) or per revolution (turning).",
      "ae": "Width of cut across the cutter (milling).",
      "D": "Cutter diameter (milling).",
      "kappa": "Lead or entering angle of the cutting edge (90° for a square shoulder cutter).",
      "kc1": "Specific cutting force at 1 mm chip thickness and 0° rake for the material, from tooling data (steel about 1500–2100, aluminium 500–800 N/mm²).",
      "mc": "Chip thickness exponent from the same data (about 0.2–0.3).",
      "rake": "Effective rake angle of the insert (positive rake lowers the force by about 1% per degree)."
    },
    "outputs": [
      "Mean chip thickness",
      "Engagement angle (milling)",
      "Specific cutting force kc"
    ],
    "method": [
      "Milling: hm = (360 × fz × sin κr × ae) ÷ (π D φ), with engagement angle φ = arccos(1 − 2ae/D) in degrees (for ae ≤ D/2).",
      "Turning: h = f sin κr.",
      "kc = kc1.1 × h^(−mc) × (1 − rake/100).",
      "Example: 0.15 mm/tooth with 20 mm of a 50 mm cutter gives hm = 0.087627 mm and kc ≈ 3,124.6 N/mm²."
    ],
    "limitations": [
      "Engagement angle formula assumes the cutter centre outside the material (ae up to D); slotting uses full engagement.",
      "Material data vary; use the tool maker’s kc1.1 and mc for the actual grade.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thin chips raise kc; keeping hm near the tool maker’s recommendation improves tool life and efficiency."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "grinding-geometry": {
    "purpose": "Equivalent wheel diameter for external, internal or surface grinding, the geometric contact length for a depth of cut, and the grinding ratio (G-ratio) from metal removed and wheel worn.",
    "uses": [
      "Compare grinding conditions between external and internal work",
      "Track wheel wear performance",
      "Estimate contact length for burn risk"
    ],
    "users": [
      "Grinding machinists",
      "Manufacturing engineers"
    ],
    "inputs": {
      "type": "Grinding configuration.",
      "ds": "Current wheel diameter.",
      "dw": "Work diameter (ignored for surface grinding).",
      "ae": "Depth of cut per pass.",
      "Vw": "Volume of work material removed during the test.",
      "Vs": "Volume of wheel worn in the same period (from wheel diameter loss)."
    },
    "outputs": [
      "Equivalent wheel diameter",
      "Geometric contact length",
      "G-ratio"
    ],
    "method": [
      "External: De = ds dw ÷ (dw + ds); internal: De = ds dw ÷ (dw − ds); surface: De = ds.",
      "Contact length lg = √(ae De).",
      "G-ratio = work volume removed ÷ wheel volume worn.",
      "Example: a 400 mm wheel on 50 mm work has De = 44.444 mm and a contact length of 0.94281 mm."
    ],
    "limitations": [
      "Geometric contact length; real contact is longer due to wheel and work deflection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Larger equivalent diameters (internal grinding) mean longer contact, more heat and more burn risk."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1199–1268. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thread-milling-path": {
    "purpose": "Tool-centre path diameter, programmed centre-line feed for the required feed at the cutting edge, helical path length per revolution and cycle time for internal or external thread milling.",
    "uses": [
      "Program thread milling without a CAM system",
      "Correct feed for the cutter path",
      "Estimate thread milling cycle time"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "type": "Internal or external thread.",
      "D": "Major diameter of the thread (the cutting edge reaches this diameter for internal threads).",
      "P": "Thread pitch.",
      "dc": "Thread mill cutting diameter.",
      "rpm": "Spindle speed.",
      "fz": "Feed per tooth wanted at the cutting edge (from the tool maker).",
      "z": "Number of flutes.",
      "L": "Length of thread to mill (single-form cutters).",
      "passes": "Number of radial passes."
    },
    "outputs": [
      "Tool-centre path diameter",
      "Feed at the cutting edge and programmed centre feed",
      "Helical revolutions and cycle time"
    ],
    "method": [
      "Path diameter = D − dc (internal) or D + dc (external).",
      "Edge feed = rpm × z × fz; centre feed = edge feed × (D − dc)/D internal or (D + dc)/D external.",
      "Revolutions = thread length ÷ pitch per pass; time = revolutions × π × path diameter ÷ centre feed (plus entry and exit).",
      "Example: M20 × 2.5 internal with a 14 mm cutter: program 216 mm/min on a 6 mm path."
    ],
    "limitations": [
      "Single-form (one-tooth-row) thread mill; multi-form tools cut the whole length in one revolution.",
      "Arc entry and exit moves are not included in the time.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Many controls apply the centre-feed correction automatically when cutter compensation is used; check your control’s behaviour."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2063–2070, 1292–1300. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "angular-indexing": {
    "purpose": "Crank turns and holes for indexing an angle on a 40:1 (or other) dividing head, using the hole circle that gives the closest movement, with the resulting angular error.",
    "uses": [
      "Mill features at a given angle with a dividing head",
      "Find the most accurate hole circle for an angle",
      "Check the angular error of an approximate setting"
    ],
    "users": [
      "Machinists",
      "Toolmakers"
    ],
    "inputs": {
      "deg": "Whole degrees of the angle.",
      "min": "Additional minutes.",
      "ratio": "Crank turns per spindle turn (40 on most heads, so one crank turn is 9°).",
      "plates": "Index plates available."
    },
    "outputs": [
      "Crank turns",
      "Best hole circle and holes",
      "Angle obtained and error"
    ],
    "method": [
      "Crank turns = angle ÷ (360° ÷ ratio) (angle ÷ 9° for 40:1).",
      "For each hole circle, holes = fractional turns × circle, rounded; the circle with the smallest error is chosen.",
      "Error = obtained angle − required angle.",
      "Example: 17° 25′ needs 1 turns and 29 holes in the 31-hole circle, an error of 9.6774″."
    ],
    "limitations": [
      "Simple indexing only; very small angular steps need differential or vernier methods.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the error is too large, use the finer plate set or differential indexing."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2107–2121. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolted-joint-fatigue": {
    "purpose": "Alternating and mean bolt stress for a preloaded tension joint under a load cycling between zero and a maximum, and the Goodman fatigue safety factor using the bolt’s endurance strength.",
    "uses": [
      "Check cylinder head, flange and con-rod bolts under cyclic loads",
      "Show how preload and joint stiffness protect the bolt",
      "Compare rolled and cut threads"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "At": "Tensile stress area of the bolt (see the metric thread tool).",
      "Fi": "Installed preload.",
      "P": "Peak external tensile load per bolt; the load is assumed to cycle between zero and this value.",
      "C": "Joint constant from the bolted joint tool (stiff joints have small C).",
      "Se": "Fully corrected endurance strength of the bolt, including thread effects (published values for rolled threads are about 129 MPa for class 8.8, 162 MPa for 10.9).",
      "Sut": "Minimum tensile strength of the bolt.",
      "req": "Required factor of safety against fatigue."
    },
    "outputs": [
      "Alternating and mean bolt stress",
      "Preload stress",
      "Goodman fatigue safety factor"
    ],
    "method": [
      "σa = C P ÷ 2At; σm = σa + Fi ÷ At; σi = Fi ÷ At.",
      "Goodman (load line from preload): n = Se (Sut − σi) ÷ [Sut σa + Se (σm − σi)].",
      "Example: the default joint has σa = 11.862 MPa and a fatigue factor of 4.7039."
    ],
    "limitations": [
      "Concentric joint without separation; bending and prying raise bolt stress amplitudes.",
      "The endurance strength must already include thread stress concentration.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A stiffer joint (smaller C) or a softer bolt (longer, reduced shank) cuts the alternating stress."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535. Topic reference; no source tables or recommended settings are reproduced.",
      "VDI 2230 Part 1"
    ]
  },
  "machine-hour-rate": {
    "purpose": "Hourly cost of a machine from capital recovery, floor space, power, maintenance, tooling and consumables over its productive hours, with operator cost to give a full machine-and-operator rate for quoting.",
    "uses": [
      "Set shop rates for quoting",
      "Compare the cost of running old and new machines",
      "Decide whether to outsource an operation"
    ],
    "users": [
      "Engineering managers",
      "Cost estimators",
      "Finance and business analysts"
    ],
    "inputs": {
      "price": "Purchase price including installation and commissioning.",
      "salvage": "Expected resale value at the end of its economic life.",
      "life": "Years the machine will be used economically.",
      "rate": "Your cost of capital.",
      "hours": "Hours per year the machine actually produces (not attendance hours).",
      "space": "Share of building cost for the machine’s floor area.",
      "kW": "Average electrical demand while producing.",
      "elec": "Electricity price.",
      "maint": "Planned and breakdown maintenance per year.",
      "tooling": "Cutting tools, coolant and consumables per productive hour.",
      "labour": "Operator wage plus on-costs per hour (0 for machine-only rate)."
    },
    "outputs": [
      "Capital cost per hour",
      "Running cost per hour",
      "Machine rate and machine-plus-operator rate"
    ],
    "method": [
      "Capital recovery per year = (cost − salvage) × A/P(i, n) + salvage × i.",
      "Hourly cost = (capital + space + maintenance) ÷ productive hours + power × price + tooling.",
      "Machine-and-operator rate = machine rate + operator cost.",
      "Example: the default machine costs $40.90 per hour, or $106 with an operator."
    ],
    "limitations": [
      "Excludes general factory overheads (supervision, administration, quality) unless included in the inputs.",
      "Productive hours are the most sensitive input.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Under-utilised machines have high hourly rates; quote on realistic productive hours."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 134–146, 1153–1160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "benefit-cost-ratio": {
    "purpose": "Present value of annual benefits and costs, initial investment and salvage at a discount rate, the benefit–cost ratio and the net benefit.",
    "uses": [
      "Rank improvement projects",
      "Present a project case to management",
      "Compare with NPV and IRR results"
    ],
    "users": [
      "Engineering managers",
      "Cost estimators",
      "Finance and business analysts"
    ],
    "inputs": {
      "P": "Up-front cost.",
      "B": "Yearly benefits (savings, extra margin).",
      "C": "Yearly costs of running the project.",
      "S": "Value recovered at the end.",
      "n": "Years of benefits.",
      "rate": "Your organisation’s discount rate."
    },
    "outputs": [
      "Present value of benefits and costs",
      "Benefit–cost ratio (conventional and modified)",
      "Net present benefit"
    ],
    "method": [
      "PV benefits = B × P/A(i, n); PV costs = P + C × P/A(i, n) − S × P/F(i, n).",
      "Conventional B/C = PV benefits ÷ PV costs; modified B/C = (PV benefits − PV operating costs) ÷ (P − PV salvage).",
      "Accept when B/C > 1.",
      "Example: the default project has B/C = 1.1873."
    ],
    "limitations": [
      "Level annual amounts; uneven flows need the IRR tool’s year-by-year inputs.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "B/C and NPV agree on accept/reject; for ranking projects of different size, compare incremental B/C."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 140–144. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "speed-series": {
    "purpose": "Step ratio and every value of a geometric progression between a minimum and maximum, as used for machine spindle speeds, feeds and preferred-number size ranges, with the nearest Renard (R10/R20/R40) ratio.",
    "uses": [
      "Design spindle speed or feed steps for a gearbox",
      "Build a size range of preferred values",
      "Check a machine’s speed steps"
    ],
    "users": [
      "Machine designers",
      "Product designers",
      "Engineers"
    ],
    "inputs": {
      "min": "First value of the series (e.g. lowest spindle speed).",
      "max": "Last value of the series (e.g. highest spindle speed).",
      "steps": "Number of values including both ends."
    },
    "outputs": [
      "Step ratio φ",
      "Every value of the series",
      "Nearest Renard series"
    ],
    "method": [
      "φ = (max ÷ min)^(1/(n − 1)).",
      "Values: min × φ^k for k = 0 … n − 1.",
      "Renard ratios: R5 1.585, R10 1.259, R20 1.122, R40 1.059.",
      "Example: 12 speeds from 50 to 2000 rpm need a step ratio of 1.3984."
    ],
    "limitations": [
      "Geometric series only; arithmetic series have equal differences instead of equal ratios.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A ratio near 1.26 (R10) is common for machine tool speeds; smaller ratios give finer choice but more gears."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 37–39. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "factors-gcd": {
    "purpose": "Prime factorisation, greatest common divisor and least common multiple of two or three whole numbers, for gear tooth counts, hunting-tooth ratios, change gears and repeat cycles.",
    "uses": [
      "Check that a gear pair has a hunting-tooth ratio",
      "Factor a ratio into change gears",
      "Find when two cycles repeat together"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Engineers"
    ],
    "inputs": {
      "a": "First whole number (for example gear teeth).",
      "b": "Second whole number.",
      "c": "Optional third whole number."
    },
    "outputs": [
      "Prime factors of each number",
      "Greatest common divisor",
      "Least common multiple",
      "Hunting-tooth check for two gears"
    ],
    "method": [
      "Prime factors by trial division.",
      "GCD by Euclid’s algorithm; LCM = a × b ÷ GCD (extended to three numbers).",
      "Two gears form a hunting-tooth pair when their GCD is 1 (every tooth meets every other tooth).",
      "Example: 72 = 2 × 2 × 2 × 3 × 3 and 30 = 2 × 3 × 5; GCD 6, LCM 360."
    ],
    "limitations": [
      "Whole numbers up to one billion.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A GCD of 1 between gear tooth counts spreads wear evenly; a large common factor repeats the same tooth contacts."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 20–29. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rack-pinion": {
    "purpose": "Pitch diameter, travel per revolution, linear speed and thrust force of a rack and pinion from module (or diametral pitch), pinion teeth, speed and torque, with the motor speed for a required linear speed.",
    "uses": [
      "Size a rack drive for a gantry or slide",
      "Find motor speed for a traverse speed",
      "Find the pinion torque for a thrust"
    ],
    "users": [
      "Automation engineers",
      "Machine designers"
    ],
    "inputs": {
      "m": "Module of the rack and pinion (25.4 ÷ diametral pitch for inch gears).",
      "z": "Teeth on the pinion.",
      "rpm": "Pinion speed.",
      "T": "Torque at the pinion.",
      "eff": "Mesh efficiency.",
      "vreq": "Linear speed you need, to find the pinion speed."
    },
    "outputs": [
      "Pitch diameter and travel per revolution",
      "Linear speed",
      "Thrust force",
      "Pinion speed for the required linear speed"
    ],
    "method": [
      "Pitch diameter d = m z; travel per revolution = π m z.",
      "Linear speed = travel per revolution × rpm.",
      "Thrust = 2T ÷ d × efficiency.",
      "Example: module 2, 20 teeth at 300 rpm moves 37.699 m/min with 970 N thrust."
    ],
    "limitations": [
      "Mesh efficiency and torque only; guide friction and acceleration forces add to the drive load.",
      "Check rack tooth strength with the gear tooth tools.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A smaller pinion gives more thrust per unit torque but higher speed for the same travel speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
