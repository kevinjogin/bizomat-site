// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook31).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "pump-operating-point": {
    "purpose": "Operating point of a centrifugal pump on a pipe system: a quadratic pump curve through shut-off head and the best-efficiency point, a system curve from static head and one known duty point, their intersection (flow, head), efficiency there from a parabolic efficiency curve, absorbed power, the position relative to the best-efficiency flow, and the speed (by the affinity laws) that gives a target flow.",
    "uses": [
      "Predict the flow a pump will deliver on a new pipe system",
      "Check that a pump runs near its best efficiency point",
      "Set a variable-speed drive for a target flow"
    ],
    "users": [
      "Plant engineers",
      "Maintenance engineers",
      "Process engineers"
    ],
    "inputs": {
      "H0": "Head at zero flow from the pump curve.",
      "Qb": "Flow at the best-efficiency point (BEP).",
      "Hb": "Head at the BEP.",
      "etab": "Efficiency at the BEP.",
      "n0": "Speed the curve applies to.",
      "Hs": "Static head of the system: level difference plus pressure difference as head.",
      "Qd": "A flow at which the system head is known (from a pipe loss calculation).",
      "Hd": "Total system head at that flow.",
      "rho": "Liquid density.",
      "Qt": "Flow you want; the tool finds the pump speed that gives it."
    },
    "outputs": [
      "Operating flow and head",
      "Efficiency, power and position against BEP",
      "Speed for the target flow"
    ],
    "method": [
      "Pump: H = H₀ − a Q², with a = (H₀ − H_BEP) ÷ Q_BEP²; system: H = H_s + k Q², with k = (H_d − H_s) ÷ Q_d².",
      "Operating flow Q = √[(H₀ − H_s) ÷ (a + k)].",
      "Efficiency η = η_BEP (2x − x²), x = Q ÷ Q_BEP; power = ρ g Q H ÷ η.",
      "Speed ratio s for a target flow (affinity laws): s² H₀ − a Q_t² = H_s + k Q_t².",
      "Example: the pump runs at 390.8 L/min and 40.455 m, 97.701% of its BEP flow."
    ],
    "limitations": [
      "Quadratic fits to the pump and system curves; use the maker’s curve near the ends of the range.",
      "Affinity laws hold for speed changes on the same impeller; static head limits how far speed can drop.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Run between about 70% and 120% of BEP flow for long seal and bearing life."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3021–3026. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "fan-drive-sizing": {
    "purpose": "Fan drive sizing: air power and shaft power from flow, fan total pressure and efficiency; the fan speed, pressure and power for a new flow by the fan laws (as the affinity tool, on a system without static pressure); motor power with belt losses and margin and the next IEC rating; and the fan pulley diameter for the motor speed and motor pulley.",
    "uses": [
      "Find the fan speed and motor needed for more airflow",
      "Size pulleys to change a belt-driven fan’s speed",
      "Estimate the power saving from slowing a fan"
    ],
    "users": [
      "Plant engineers",
      "Maintenance engineers",
      "Process engineers"
    ],
    "inputs": {
      "Q": "Airflow the fan delivers now.",
      "p": "Total pressure rise across the fan at that flow.",
      "eta": "Fan total efficiency at that point.",
      "n": "Fan speed now.",
      "Qt": "Airflow you need.",
      "eb": "Efficiency of the belt drive.",
      "marg": "Margin above the shaft power for the motor.",
      "nm": "Motor full-load speed.",
      "dm": "Pitch diameter of the motor pulley."
    },
    "outputs": [
      "Present air and shaft power",
      "Speed, pressure and power for the new flow",
      "Motor rating and fan pulley size"
    ],
    "method": [
      "Air power = Q p; shaft power = air power ÷ η.",
      "Fan laws: speed ∝ Q, pressure ∝ Q², power ∝ Q³ (same system, no static pressure).",
      "Motor = shaft power ÷ belt efficiency × (1 + margin), next IEC rating.",
      "Fan pulley = motor pulley × motor speed ÷ fan speed.",
      "Example: 6 m³/s needs the fan at 1,200 rpm, 9.8743 kW at the shaft and a 15 kW motor."
    ],
    "limitations": [
      "Fan laws assume the system curve passes through zero; systems with static pressure (filters, dampers held at pressure) need the fan curve.",
      "Check the fan’s maximum safe speed before speeding it up.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Power rises with the cube of speed: 20% more air needs about 73% more power."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2487–2536. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "machine-foundation-block": {
    "purpose": "Preliminary sizing of a concrete inertia block for a machine: block mass as a multiple of machine mass, depth for the plan area, soil bearing pressure against the allowable, vertical stiffness from the soil’s subgrade modulus, natural frequency of the machine and block on the soil, and the ratio of running frequency to natural frequency against the resonance band.",
    "uses": [
      "Size a foundation block for a press, compressor or generator",
      "Check soil bearing before pouring",
      "Avoid a foundation that resonates at running speed"
    ],
    "users": [
      "Plant engineers",
      "Civil and structural engineers",
      "Installation engineers"
    ],
    "inputs": {
      "mm": "Mass of the machine on the block.",
      "ratio": "Block mass as a multiple of machine mass (often 2–3 for rotating machines, 3–5 or more for reciprocating and impact machines).",
      "rhoc": "Density of reinforced concrete.",
      "Lb": "Plan length of the block.",
      "Wb": "Plan width of the block.",
      "qa": "Allowable bearing pressure of the soil (from a geotechnical report).",
      "ks": "Vertical modulus of subgrade reaction for the soil (from the geotechnical report).",
      "rpm": "Lowest steady running speed producing vibration."
    },
    "outputs": [
      "Block mass, volume and depth",
      "Soil bearing pressure",
      "Natural frequency and frequency ratio"
    ],
    "method": [
      "Block mass = ratio × machine mass; depth = mass ÷ (density × length × width).",
      "Bearing pressure = (machine + block) g ÷ plan area.",
      "Vertical stiffness k = subgrade modulus × plan area; natural frequency f_n = √(k ÷ m_total) ÷ 2π.",
      "Frequency ratio r = running frequency ÷ f_n; keep clear of 0.5 < r < 1.5.",
      "Example: a 5000 kg machine needs a 1.0417 m deep block, bearing 32.689 kPa on the soil."
    ],
    "limitations": [
      "Preliminary rule-of-thumb sizing; rocking modes, embedment and dynamic loads need a foundation design by a structural engineer.",
      "Subgrade modulus depends on footing size and soil; use project data.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A block running well above its natural frequency (r > 1.5) isolates best; well below (r < 0.5) is stiff and also acceptable."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3237–3238, 197–198. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "measurement-temperature-error": {
    "purpose": "Size error when a part and the gauge or machine scale measuring it are at temperatures other than the 20 °C reference: the apparent deviation from their different expansions, the size corrected to 20 °C, the share of the tolerance the error uses, and the temperature difference that would keep the error within a chosen share of tolerance.",
    "uses": [
      "Correct measurements taken on the shop floor",
      "Decide how long parts must soak before inspection",
      "Explain disagreements between shop and inspection measurements"
    ],
    "users": [
      "Quality engineers",
      "Tooling engineers",
      "Metrology technicians"
    ],
    "inputs": {
      "L": "Nominal length being measured.",
      "ap": "Expansion coefficient of the part (23 aluminium, 11.5 steel).",
      "Tp": "Temperature of the part when measured.",
      "ag": "Expansion coefficient of the gauge, scale or CMM (11.5 steel, about 0 for glass-ceramic scales).",
      "Tg": "Temperature of the gauge or scale.",
      "meas": "The reading taken (0 uses the nominal size).",
      "tol": "Total tolerance band of the dimension.",
      "share": "Share of the tolerance you allow for temperature effects."
    },
    "outputs": [
      "Apparent deviation from temperature",
      "Size corrected to 20 °C",
      "Share of tolerance used and allowable temperature difference"
    ],
    "method": [
      "Both expand from their 20 °C sizes: apparent deviation = L [α_p (T_p − 20) − α_g (T_g − 20)].",
      "Size at 20 °C = measured − deviation.",
      "For part and gauge at the same temperature, the error per kelvin is L |α_p − α_g|; allowable offset = share × tolerance ÷ (L |α_p − α_g|).",
      "Example: a 500 mm aluminium part at 28 °C measured with steel at 22 °C reads 80.5 µm large."
    ],
    "limitations": [
      "Uniform temperatures; parts straight from machining have gradients.",
      "Coefficients vary with alloy; use measured values for tight work.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Equal temperatures do not remove the error when part and gauge are different materials."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 375–378, 2660. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pressure-vessel-thickness": {
    "purpose": "Required thickness of a cylindrical shell under internal pressure and of hemispherical, 2:1 ellipsoidal and torispherical heads by the widely used ASME Section VIII Division 1 formulas, with joint efficiency and corrosion allowance, compared side by side, plus the hydrostatic test pressure — for preliminary comparison only.",
    "uses": [
      "Compare head types for weight and cost",
      "Estimate plate thickness before detailed design",
      "Check a vessel’s nominal wall against its pressure"
    ],
    "users": [
      "Mechanical engineers",
      "Process engineers",
      "Estimators"
    ],
    "inputs": {
      "p": "Internal design pressure.",
      "D": "Inside diameter of the shell.",
      "S": "Allowable tensile stress of the plate at design temperature (from the code’s material tables).",
      "E": "Weld joint efficiency for the radiography extent (1.0 full, 0.85 spot, 0.7 none for butt welds).",
      "CA": "Corrosion allowance added to the calculated thickness.",
      "tf": "Hydrostatic test pressure as a multiple of design pressure (code-dependent; also adjusted by the stress ratio)."
    },
    "outputs": [
      "Shell thickness",
      "Head thickness for three types",
      "Hydrostatic test pressure"
    ],
    "method": [
      "Cylinder (circumferential stress): t = p R ÷ (S E − 0.6p) + CA.",
      "Hemispherical head: t = p R ÷ (2 S E − 0.2p) + CA.",
      "2:1 ellipsoidal head: t = p D ÷ (2 S E − 0.2p) + CA.",
      "Torispherical head (crown radius = D, knuckle 6% D): t = 0.885 p L ÷ (S E − 0.1p) + CA.",
      "Example: 1 MPa in a 1000 mm shell needs 5.7845 mm; a 2:1 head needs 5.7662 mm."
    ],
    "limitations": [
      "Preliminary comparison only; pressure vessels must be designed, fabricated, inspected and certified to the applicable code (AS 1210, ASME VIII, EN 13445).",
      "External pressure, nozzles, supports and local loads are not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Hemispherical heads are thinnest but cost most to form; torispherical heads are cheapest but thickest."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 290–294. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "fixture-locating-error": {
    "purpose": "Locating error of a part located by a round pin and a diamond (relieved) pin in two holes: the largest diametral clearance at each pin from the hole and pin limits, the largest translation at the round pin, the largest rotation from both clearances over the pin spacing, and the resulting positional error at a feature, compared with its position tolerance.",
    "uses": [
      "Check whether pin locating holds a feature’s position tolerance",
      "Choose pin sizes and fits for a fixture",
      "Explain position scatter on fixtured parts"
    ],
    "users": [
      "Quality engineers",
      "Tooling engineers",
      "Metrology technicians"
    ],
    "inputs": {
      "h1min": "Smallest size of the hole on the round pin.",
      "h1max": "Largest size of that hole.",
      "p1min": "Smallest round pin.",
      "p1max": "Largest round pin.",
      "h2min": "Smallest size of the hole on the diamond pin.",
      "h2max": "Largest size of that hole.",
      "p2min": "Smallest locating width of the diamond pin (across its round lands).",
      "p2max": "Largest locating width.",
      "Lp": "Distance between the two pins.",
      "Lf": "Distance from the round pin to the feature being positioned.",
      "tolp": "Positional tolerance zone diameter of the feature.",
      "share": "Share of the tolerance you allow for locating error (machining takes the rest)."
    },
    "outputs": [
      "Maximum clearances",
      "Translation and rotation",
      "Position error at the feature"
    ],
    "method": [
      "Maximum clearance = largest hole − smallest pin at each pin.",
      "Translation at the round pin ≤ c₁ ÷ 2 (radial).",
      "Rotation ≤ (c₁ + c₂) ÷ (2 L_p) radians (hole 1 and hole 2 shift oppositely).",
      "Position error at the feature ≤ c₁ ÷ 2 + L_f × rotation; as a tolerance zone diameter, twice that.",
      "Example: the part can rotate 20.626″ and the feature can be 60 µm out (zone diameter)."
    ],
    "limitations": [
      "Worst-case stacking; real error is usually smaller (statistical).",
      "Pin bending, wear and part distortion are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Wider pin spacing reduces rotation; tighter pin fits reduce both errors but make loading harder."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3131–3134, 620–623. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "flange-bolt-load-check": {
    "purpose": "Bolt load check for a gasketed bolted flange by the widely used ASME Section VIII Appendix 2 approach: hydrostatic end force and gasket load at operating pressure (gasket factor m), gasket seating load (seating stress y), the required bolt area at the allowable bolt stress, the area provided by the bolts, the load per bolt and the tightening torque from the nut factor.",
    "uses": [
      "Check bolts on a pipe or vessel flange",
      "Set tightening torque for a gasketed joint",
      "Compare gaskets by the bolt load they need"
    ],
    "users": [
      "Mechanical engineers",
      "Maintenance engineers",
      "Pipefitting supervisors"
    ],
    "inputs": {
      "p": "Internal design pressure.",
      "G": "Gasket load reaction diameter (per the code: the gasket mean diameter or outside of the contact width less 2b).",
      "b": "Effective gasket seating width from the code’s basic width.",
      "mg": "Gasket factor m for the gasket type (from the code or gasket maker).",
      "y": "Minimum design seating stress y for the gasket.",
      "nb": "Number of flange bolts.",
      "d": "Bolt diameter.",
      "P": "Thread pitch.",
      "Sa": "Allowable bolt stress (at ambient for seating; at temperature for operation).",
      "K": "Nut factor for the bolt condition."
    },
    "outputs": [
      "Operating and seating bolt loads",
      "Required and provided bolt area",
      "Load and torque per bolt"
    ],
    "method": [
      "End force H = π ÷ 4 × G² p; gasket load H_p = 2π b G m p; operating W_m1 = H + H_p.",
      "Seating W_m2 = π b G y.",
      "Required bolt area A_m = max(W_m1, W_m2) ÷ S_a; provided = bolts × A_t, A_t = π ÷ 4 (d − 0.9382 P)².",
      "Load per bolt = max(W_m1, W_m2) ÷ bolts; torque = K F d.",
      "Example: the flange needs 346.83 kN of bolt load, 28.903 kN and 115.61 N·m per bolt."
    ],
    "limitations": [
      "Bolt load only; flange ring stresses, rotation and leakage tightness need the full code analysis.",
      "Gasket factors are user inputs from the code or gasket maker.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Soft gaskets need little seating load; spiral-wound and metal gaskets need much more."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1536, 3392–3404. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "chain-conveyor-sizing": {
    "purpose": "Sizing of a drag or roller chain conveyor: chain pull on the carrying run from load and chain weight with friction and lift, the return run pull, total pull with a starting factor shared between strands against the chain working load, drive sprocket pitch diameter, torque and speed, and motor power.",
    "uses": [
      "Size a chain conveyor drive and chain",
      "Check a chain conveyor for a heavier load",
      "Find drive sprocket torque and speed"
    ],
    "users": [
      "Materials-handling engineers",
      "Maintenance engineers",
      "Machine designers"
    ],
    "inputs": {
      "L": "Horizontal length of the conveyor.",
      "Hl": "Height the load rises along the conveyor.",
      "q": "Mass of conveyed material per metre of conveyor.",
      "qc": "Mass per metre of chain and attachments on one run (all strands together).",
      "mu": "Friction coefficient for the chain sliding on its track or rolling on rollers.",
      "v": "Chain speed.",
      "strands": "Number of chain strands sharing the pull.",
      "SF": "Factor for starting and duty.",
      "Wc": "Allowable working load of one chain strand (from the chain maker).",
      "z": "Teeth on the drive sprocket.",
      "p": "Chain pitch.",
      "eta": "Efficiency of the drive gearing."
    },
    "outputs": [
      "Carrying, return and total chain pull",
      "Pull per strand against the working load",
      "Sprocket torque, speed and motor power"
    ],
    "method": [
      "Carrying run: (q + q_c) g (μ L + H); return run: q_c g μ L.",
      "Design pull per strand = total pull × SF ÷ strands, against the working load.",
      "Sprocket PD = p ÷ sin(180° ÷ z); torque = pull × PD ÷ 2; speed = v ÷ π PD.",
      "Motor power = total pull × v ÷ η.",
      "Example: the conveyor needs 4.2659 kN of pull and about 1.5056 kW."
    ],
    "limitations": [
      "Steady running with a single friction coefficient; curves, scrapers and material build-up add pull.",
      "Chain selection must follow the chain maker’s ratings and wear life.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "On long conveyors friction dominates; rollers on the chain cut the pull several times over."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2537–2556. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "travel-drive-sizing": {
    "purpose": "Sizing of a rail travel drive: rolling resistance from the wheel and rail (coefficient of rolling resistance, as the rolling resistance tool) plus wheel bearing friction, a flange and skew allowance, acceleration force with a rotating-mass allowance, wheel torque and speed, motor power and the next IEC rating, and the adhesion check on the driven wheels.",
    "uses": [
      "Size the long-travel or cross-travel drive of a crane",
      "Size a transfer car or trolley motor",
      "Check whether driven wheels will slip when starting"
    ],
    "users": [
      "Materials-handling engineers",
      "Crane designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "mass": "Mass of the carriage plus its heaviest load.",
      "wheels": "Total number of wheels sharing the load equally.",
      "driven": "Wheels that are driven.",
      "D": "Wheel tread diameter.",
      "f": "Coefficient of rolling resistance (about 0.5 mm steel wheel on steel rail).",
      "dj": "Bore of the wheel bearings.",
      "mub": "Friction coefficient of the wheel bearings referred to the bore (about 0.005 for rolling bearings).",
      "flange": "Factor for flange rubbing and skewing.",
      "v": "Travel speed.",
      "a": "Acceleration when starting.",
      "rot": "Allowance for rotating parts (motor, gears, wheels) when accelerating.",
      "adh": "Adhesion between driven wheels and rail (about 0.15–0.2 dry steel, less when wet).",
      "eta": "Efficiency of the drive gearing."
    },
    "outputs": [
      "Running and accelerating resistance",
      "Wheel torque, speed and motor power",
      "Wheel slip check"
    ],
    "method": [
      "Running resistance = W (f + μ_b d ÷ 2) ÷ (D ÷ 2) × flange allowance (rolling resistance W f ÷ r plus bearing friction).",
      "Accelerating force = rotating allowance × m a; total = running + accelerating.",
      "Wheel torque = total × D ÷ 2; wheel speed = v ÷ π D; motor power = total × v ÷ η, next IEC rating.",
      "Adhesion limit = adhesion × weight on the driven wheels; must exceed the total force.",
      "Example: 20000 kg at 40 m/min needs 5.2924 kN when accelerating and a 4 kW motor."
    ],
    "limitations": [
      "Level track; gradients, wind and buffer impacts need adding for outdoor cranes.",
      "Equal load on all wheels assumed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the wheels would slip, reduce acceleration or drive more wheels."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–167, 2569–2580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
