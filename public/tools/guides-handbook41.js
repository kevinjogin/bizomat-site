// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook41).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "casting-pour-plan": {
    "purpose": "Plan of a gravity sand casting: casting and riser moduli, solidification times by Chvorinov’s rule and the modulus ratio (as the casting solidification tool), riser volume against the feed volume the casting shrinkage needs at your riser efficiency, metal poured including riser and gating, casting yield, choke area and sprue diameter for the pour time (as the gating choke area tool), pattern dimension with shrinkage, and the ladle capacity check.",
    "uses": [
      "Plan the riser and gating for a new casting",
      "Check a ladle for a heavier casting",
      "Estimate metal poured per mould"
    ],
    "users": [
      "Foundry engineers",
      "Pattern makers",
      "Casting buyers"
    ],
    "inputs": {
      "Vc": "Volume of the casting.",
      "Ac": "Surface area through which the casting loses heat.",
      "rho": "Density of the poured metal (about 7.0 cast iron, 7.8 steel, 2.4–2.7 aluminium alloys).",
      "B": "Mould constant in Chvorinov’s rule for the metal and mould (from trials; your value).",
      "shrinkV": "Liquid and solidification shrinkage the riser must make up (about 1–2% grey iron, 3–7% steel and aluminium; your value).",
      "Dr": "Diameter of a cylindrical riser.",
      "Hr": "Height of the riser.",
      "ratioReq": "Least ratio of riser to casting modulus (often 1.2).",
      "effR": "Share of the riser volume that can actually feed (about 14% open cylindrical, more with insulating sleeves).",
      "gatePct": "Mass of the gating system as a share of the casting.",
      "t": "Time to pour the mould.",
      "h": "Effective metal head above the choke.",
      "Cd": "Efficiency of flow through the gating.",
      "runner": "Runner area as a multiple of the choke.",
      "gate": "Total gate area as a multiple of the choke.",
      "ladle": "Metal the ladle holds.",
      "part": "A part dimension to scale for the pattern.",
      "shrink": "Linear shrinkage allowance for the pattern."
    },
    "outputs": [
      "Moduli, solidification times and riser feed volume",
      "Metal poured, yield and ladle check",
      "Choke area, sprue and pattern dimension"
    ],
    "method": [
      "Modulus M = V ÷ A; solidification time t = B M² (Chvorinov) for casting and riser (as the casting solidification tool).",
      "Feed volume needed = casting volume × shrinkage ÷ riser efficiency, against the riser volume.",
      "Metal poured = casting + riser + gating; yield = casting ÷ poured.",
      "Choke area A = W ÷ (ρ t C_d √(2gh)) with W the metal poured (as the gating choke area tool); pattern dimension = part × (1 + shrinkage).",
      "Example: the riser modulus ratio is 1.2156; 30.966 kg is poured (45.211% yield) through a 232.66 mm² choke."
    ],
    "limitations": [
      "Chvorinov approximation with a simple cylindrical riser; feeding distance is not checked.",
      "Gating ratios and mould constant must come from foundry practice.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A sleeve on the riser raises its efficiency and modulus, often halving the metal poured into risers."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1404–1420. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "coating-job-estimate": {
    "purpose": "Estimate of a coating job: theoretical and practical coverage and quantity per coat from the dry film thickness, volume solids or powder density and transfer efficiency (as the coating coverage tool), the quantity for all coats, thinner added, the wet film thickness to apply per coat against your sag limit, labour hours from the application rate, and cost in total and per square metre.",
    "uses": [
      "Quote a painting or powder-coating job",
      "Order paint and thinner for a project",
      "Set the wet film gauge reading for the painter"
    ],
    "users": [
      "Estimators",
      "Coating inspectors",
      "Fabrication supervisors"
    ],
    "inputs": {
      "type": "Liquid paint or powder.",
      "area": "Surface area to coat.",
      "dft": "Dry film thickness for each coat (from the specification).",
      "coats": "Number of coats of this product.",
      "vs": "Volume solids of the paint from its data sheet.",
      "density": "Density of the powder.",
      "te": "Share of the coating that ends up on the work (spray method and part shape).",
      "price": "Price of the paint per litre or powder per kilogram.",
      "thin": "Thinner added as a share of the paint volume (liquid only).",
      "pThin": "Price of the thinner.",
      "rateA": "Area one painter covers per hour for one coat.",
      "labour": "Labour rate.",
      "wftMax": "Largest wet film the paint holds on a vertical surface without sagging (from the data sheet)."
    },
    "outputs": [
      "Coverage and quantity per coat and in total",
      "Thinner, wet film thickness and labour",
      "Total cost and cost per square metre"
    ],
    "method": [
      "Liquid: theoretical coverage = 10 × volume solids ÷ DFT (m²/L); powder: 1000 ÷ (density × DFT) (m²/kg); practical = theoretical × transfer efficiency (as the coating coverage tool).",
      "Quantity per coat = area ÷ practical coverage; total = per coat × coats; thinner = paint × thinner share.",
      "Wet film (liquid) = DFT × 100 ÷ volume solids × (1 + thinner share).",
      "Labour = coats × area ÷ application rate.",
      "Example: 2 coats need 19.231 units and 5 labour hours, about 15.923 per m²; apply 137.5 µm wet."
    ],
    "limitations": [
      "Flat-surface coverage; rough, profiled or complex steel uses more.",
      "Excludes surface preparation, masking and curing time.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Transfer efficiency is the biggest lever on material cost: electrostatic or airless methods raise it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1500–1516. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "valve-closure-surge": {
    "purpose": "Water-hammer check of a pipeline: pressure wave speed from the liquid bulk modulus and the pipe diameter, wall and modulus, the critical closure time 2L ÷ a, the Joukowsky surge for fast closure and the reduced surge for the closing time used (as the water hammer tool), working pressure plus surge against the pipe or component rating, and the slowest-needed closing time that keeps the total within the rating.",
    "uses": [
      "Check a pipeline for a fast-closing valve",
      "Set an actuator closing time",
      "Decide whether a surge vessel is needed"
    ],
    "users": [
      "Hydraulic engineers",
      "Plant engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "dv": "Velocity change when the valve closes (the full flow velocity for a full closure).",
      "L": "Length of pipe from the valve to the tank or reservoir where the wave reflects.",
      "tc": "Time the valve takes to close.",
      "D": "Inside diameter of the pipe.",
      "t": "Wall thickness of the pipe.",
      "E": "Elastic modulus of the pipe (about 200 steel, 1–3 plastics).",
      "K": "Bulk modulus of the liquid (2.2 for water).",
      "rho": "Density of the liquid.",
      "p": "Steady working pressure at the valve.",
      "rating": "Pressure rating of the weakest pipe, fitting or instrument."
    },
    "outputs": [
      "Wave speed and critical closure time",
      "Surge for fast and actual closure",
      "Total pressure against the rating and the closing time needed"
    ],
    "method": [
      "Wave speed a = √[(K ÷ ρ) ÷ (1 + K D ÷ (E t))].",
      "Critical time 2L ÷ a; Joukowsky surge Δp = ρ a Δv for closure within it; slower closure reduces it roughly in proportion, Δp × (2L ÷ a) ÷ t_c (as the water hammer tool).",
      "Closing time needed so working + surge ≤ rating: t = (2L ÷ a) × Δp_J ÷ (rating − working).",
      "Example: the wave travels at 1,314.9 m/s; closing in 1 s gives 7.984 bar surge, 13.984 bar in total against 16 bar."
    ],
    "limitations": [
      "Simple rigid-column estimate for a single pipe; networks and column separation need a transient analysis.",
      "Linear valve closure assumed; most valves cut flow mainly at the end of their stroke.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Slowing the last part of the valve stroke does most of the good: the flow changes fastest near closure."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "control-valve-sizing": {
    "purpose": "Sizing of a liquid control valve: required Kv (and Cv) for the design flow and valve pressure drop (as the valve flow coefficient tool), the opening ratio of the chosen valve’s rated Kvs, the valve authority as its share of the total circuit pressure drop, and the flow the circuit passes with the valve wide open when the rest of the system’s loss rises with flow squared, against your limits.",
    "uses": [
      "Choose a control valve size for a heating or cooling loop",
      "Check an existing valve’s authority",
      "Find the maximum flow a valve can pass"
    ],
    "users": [
      "Process engineers",
      "HVAC engineers",
      "Hydraulic engineers"
    ],
    "inputs": {
      "Q": "Flow the valve must pass at design conditions.",
      "dpv": "Pressure drop allocated to the valve at design flow.",
      "dps": "Pressure drop of everything else in the controlled circuit at design flow (pipes, coil, exchanger).",
      "sg": "Specific gravity of the liquid (1 for water).",
      "Kvs": "Rated Kv of the valve fully open (from the catalogue).",
      "openMax": "Largest share of Kvs you want at design, leaving margin (your value).",
      "openMin": "Smallest share of Kvs at design, to keep good control (your value).",
      "authMin": "Least authority for good control (often 0.5)."
    },
    "outputs": [
      "Kv and Cv needed",
      "Opening ratio and authority",
      "Flow with the valve fully open"
    ],
    "method": [
      "Kv = Q √(sg ÷ Δp_v); Cv = 1.156 Kv (as the valve flow coefficient tool).",
      "Opening ratio = Kv ÷ Kvs; authority = Δp_v ÷ (Δp_v + Δp_s).",
      "With a constant total drop Δp_t = Δp_v + Δp_s and system loss ∝ Q²: Q_open = √{Δp_t ÷ [sg ÷ Kvs² + Δp_s ÷ Q²]}.",
      "Example: 10 m³/h at 0.5 bar needs Kv 14.142; a Kvs 16 valve runs at 88.388% with authority 0.5, passing 10.596 m³/h wide open."
    ],
    "limitations": [
      "Non-cavitating, non-flashing liquid; check choked flow at high pressure drops.",
      "Assumes a constant pump differential across the circuit.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A valve with low authority hands control to the rest of the circuit: increase its pressure drop or the pipe size elsewhere."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "vacuum-gripper-sizing": {
    "purpose": "Sizing of a vacuum gripper: holding force per cup and in total, the force needed with acceleration, orientation and safety factor (as the vacuum cup tool), the cup diameter needed at the cup count and the cup count needed at the cup diameter, and the time to evacuate the cups and lines to the working vacuum at the pump or ejector flow, against your cycle allowance.",
    "uses": [
      "Design a gripper for sheet, cartons or panels",
      "Check a gripper for faster robot moves",
      "Size the vacuum generator for the cycle time"
    ],
    "users": [
      "Automation engineers",
      "Machine designers",
      "Robotics engineers"
    ],
    "inputs": {
      "D": "Effective diameter of each cup.",
      "n": "Number of cups.",
      "vac": "Vacuum below atmospheric that the system holds.",
      "mass": "Mass of the part.",
      "accel": "Largest acceleration during the move.",
      "orient": "Whether the cups face down (lifting) or sideways (holding by friction).",
      "mu": "Friction between cup and part for vertical cups.",
      "sf": "Safety factor you require (often 2 horizontal, 4 vertical).",
      "Vsys": "Internal volume of the cups, hoses and manifold to evacuate.",
      "Qp": "Suction flow of the pump or ejector at free air.",
      "tMax": "Time you allow to reach working vacuum."
    },
    "outputs": [
      "Holding force and force needed",
      "Cup diameter and count needed",
      "Evacuation time"
    ],
    "method": [
      "Force per cup = vacuum × π D² ÷ 4; force needed = m (g + a) × SF, divided by μ for vertical cups (as the vacuum cup tool).",
      "Cup diameter needed = √[4 F ÷ (π × vacuum × n)]; cups needed = F ÷ force per cup (rounded up).",
      "Evacuation time ≈ V ÷ Q × ln[p_atm ÷ (p_atm − vacuum)].",
      "Example: 4 cups of 40 mm hold 301.59 N against 148.07 N; the system pulls down in 0.26906 s."
    ],
    "limitations": [
      "Flat, sealed surfaces; porous or curved parts leak and need larger flow.",
      "Ideal pump-down at constant flow; real generators lose flow as vacuum rises.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Vertical cups need about twice the holding force of horizontal ones for the same part."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "wind-load-on-post": {
    "purpose": "Check of a panel, sign or guard on a single cantilever round-tube post: dynamic pressure, surface pressure, wind force and the base overturning moment (as the wind pressure tool), the post’s second moment and section modulus, bending stress at the base, deflection at the panel centre treating the wind as a point load there, and checks against your allowable stress and deflection limit.",
    "uses": [
      "Size a post for a sign, screen or guard",
      "Check an outdoor panel for a design wind speed",
      "Check a machine guard against wind or air blast"
    ],
    "users": [
      "Design engineers",
      "Structural engineers",
      "Plant engineers"
    ],
    "inputs": {
      "V": "Design wind speed (gust) at the panel height (from the wind code for the site; your value).",
      "rho": "Air density.",
      "Cd": "Force (drag) coefficient for the panel shape (about 1.2 for a flat sign; from the wind code).",
      "A": "Area of the panel facing the wind.",
      "h": "Height from the post base to the centre of the panel.",
      "OD": "Outside diameter of the tube post.",
      "t": "Wall thickness of the post.",
      "E": "Elastic modulus of the post.",
      "allow": "Allowable bending stress for the post (your design value).",
      "dRatio": "Deflection limit expressed as height divided by this number (100 means h/100)."
    },
    "outputs": [
      "Pressure, force and base moment",
      "Post section and base bending stress",
      "Deflection at the panel against the limit"
    ],
    "method": [
      "q = ½ ρ V²; p = C_d q; F = p A; base moment M = F h (as the wind pressure tool).",
      "Tube I = π (D⁴ − d⁴) ÷ 64; Z = I ÷ (D ÷ 2); stress σ = M ÷ Z.",
      "Deflection at the panel centre δ = F h³ ÷ (3 E I).",
      "Example: 20 m/s on 2 m² gives 576 N and 1,728 N·m at the base; the post runs at 46.789 MPa and deflects 12.281 mm."
    ],
    "limitations": [
      "Single post with a rigid base; base plate, bolts and footing need their own checks.",
      "Wind on the post itself and dynamic (gust) response are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Deflection often governs tall single posts before stress does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3028, 257–277. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "noise-exposure-check": {
    "purpose": "Workplace noise exposure from up to four sources: levels combined by logarithmic addition (as the sound level tool, sum mode), reduced from the reference distance to the operator distance by the inverse-square law (as the distance mode), background noise added, the permitted time at that level from your criterion level, criterion time and exchange rate, the daily dose for the hours exposed and the equivalent eight-hour level.",
    "uses": [
      "Check whether an operator needs hearing protection",
      "See how far to move a workstation from noisy machines",
      "Estimate dose for a shift pattern"
    ],
    "users": [
      "Safety officers",
      "Plant engineers",
      "Production supervisors"
    ],
    "inputs": {
      "L1": "Sound level of the first machine measured at the reference distance.",
      "L2": "Second machine (0 if not used).",
      "L3": "Third machine (0 if not used).",
      "L4": "Fourth machine (0 if not used).",
      "r1": "Distance at which the source levels were measured.",
      "r2": "Distance from the sources to the operator’s ear (all sources taken at this distance).",
      "LB": "Background level at the operator from everything else.",
      "hours": "Hours per day the operator spends at this position.",
      "Lc": "Exposure limit level for the criterion time (from your regulation; often 85 dB(A)).",
      "Tc": "Time the criterion level may be worn (usually 8 h).",
      "ER": "Exchange rate: level change that halves or doubles the permitted time (3 dB in most of the world, 5 dB in some US rules)."
    },
    "outputs": [
      "Combined level at the sources and at the operator",
      "Permitted time and daily dose",
      "Equivalent eight-hour level"
    ],
    "method": [
      "Combined level L = 10 log₁₀ Σ 10^(Lᵢ ÷ 10) (as the sound level tool, sum mode).",
      "At the operator L₂ = L − 20 log₁₀(r₂ ÷ r₁) (as the distance mode); then add the background logarithmically.",
      "Permitted time = T_c ÷ 2^[(L − L_c) ÷ ER]; dose = hours ÷ permitted time.",
      "Equivalent level for the criterion time = L_c + ER × log₂(dose).",
      "Example: the machines combine to 91.193 dB; at 3 m the operator gets 81.938 dB, a 49.29% daily dose."
    ],
    "limitations": [
      "Point sources in open space: reflections in a room raise levels above the inverse-square estimate.",
      "Use A-weighted levels; impulse noise needs a peak check.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Every doubling of distance lowers a point source by about 6 dB, a quarter of the dose at a 3 dB exchange rate."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3455–3456. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "process-capability-check": {
    "purpose": "Capability check of a stable process from an X̄–R control chart: process standard deviation from the average range and the d₂ constant, X̄ and R control limits (as the X-bar R limits tool), capability indices Cp and Cpk against the specification limits, the predicted parts per million outside each limit from the normal distribution (as the normal out-of-spec tool), and the check against your least Cpk.",
    "uses": [
      "Check a process before a production approval",
      "Turn chart data into a reject rate",
      "Decide whether to centre the process or reduce spread"
    ],
    "users": [
      "Quality engineers",
      "Process engineers",
      "Production supervisors"
    ],
    "inputs": {
      "xbar": "Average of the subgroup averages from the chart.",
      "rbar": "Average of the subgroup ranges.",
      "n": "Number of parts in each subgroup.",
      "lsl": "Lower tolerance limit.",
      "usl": "Upper tolerance limit.",
      "cpkMin": "Least Cpk the customer or your plan requires (often 1.33 or 1.67)."
    },
    "outputs": [
      "Process σ and control limits",
      "Cp and Cpk",
      "Predicted rejects"
    ],
    "method": [
      "σ = R̄ ÷ d₂; X̄ limits = X̄ ± A₂ R̄; R limits D₃ R̄ and D₄ R̄ (as the X-bar R limits tool, standard Shewhart constants).",
      "Cp = (USL − LSL) ÷ 6σ; Cpk = min(USL − X̄, X̄ − LSL) ÷ 3σ.",
      "Rejects from the normal distribution below LSL and above USL (as the normal out-of-spec tool).",
      "Example: σ = 0.012898, Cp 1.5507, Cpk 1.5507, about 3.2873 ppm out of tolerance."
    ],
    "limitations": [
      "Valid only for a stable (in-control), roughly normal process.",
      "Short-term σ from ranges; long-term performance (Ppk) is usually lower.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If Cp is high but Cpk is low, centring the process fixes it; if both are low, the spread must come down."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 7870-2 Control charts — Shewhart control charts"
    ]
  },
  "corrosion-remaining-life": {
    "purpose": "Remaining-life assessment of a corroding wall: corrosion rate from a coupon’s mass loss (as the corrosion rate tool) or from two thickness readings, the minimum required thickness as the larger of the pressure thickness by Barlow’s formula with your allowable stress and joint factor and your structural minimum, the remaining life to that thickness, and the next inspection date as a share of the remaining life capped at your maximum interval.",
    "uses": [
      "Plan the next inspection of a corroding pipe or tank",
      "Judge whether a line can run to the next shutdown",
      "Turn coupon results into a remaining life"
    ],
    "users": [
      "Inspection engineers",
      "Maintenance engineers",
      "Plant engineers"
    ],
    "inputs": {
      "mode": "Whether the rate comes from a corrosion coupon or from two wall-thickness readings.",
      "W": "Mass lost by the coupon.",
      "Ac": "Exposed area of the coupon.",
      "hrs": "Time the coupon was exposed.",
      "rhoM": "Density of the coupon metal.",
      "t1": "Wall thickness at the earlier inspection.",
      "years": "Time between the two readings.",
      "tNow": "Wall thickness measured now (the thinnest reading).",
      "D": "Outside diameter of the pipe or shell.",
      "p": "Design pressure.",
      "S": "Allowable stress of the material at temperature (from the code).",
      "Ej": "Weld joint efficiency.",
      "tStruct": "Least thickness for structural integrity, regardless of pressure (from your code or company rule).",
      "lifeReq": "Years the equipment must still serve.",
      "share": "Share of the remaining life at which to inspect next (often half).",
      "maxInt": "Longest interval your inspection plan allows."
    },
    "outputs": [
      "Corrosion rate",
      "Minimum required thickness",
      "Remaining life and next inspection"
    ],
    "method": [
      "Coupon rate (mm/y) = 87.6 W ÷ (ρ A t), W in mg, A in cm², t in hours (as the corrosion rate tool); or (t₁ − t_now) ÷ years.",
      "Pressure thickness t = p D ÷ (2 S E) (Barlow); required minimum = the larger of that and the structural minimum.",
      "Remaining life = (t_now − t_min) ÷ rate; next inspection = min(share × life, longest interval).",
      "Example: at 0.092875 mm/y the wall reaches 2.5 mm in 37.685 years; inspect again within 5 years."
    ],
    "limitations": [
      "Uniform corrosion at a constant rate; pitting and erosion need separate assessment.",
      "Barlow thickness is a screening value; use the design code formula for the equipment.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A short-term coupon rate can be far from the long-term rate: confirm with thickness monitoring."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1500–1516, 290–294. Topic reference; no source tables or recommended settings are reproduced.",
      "ASTM G1 Standard Practice for Preparing, Cleaning, and Evaluating Corrosion Test Specimens"
    ]
  }
});
