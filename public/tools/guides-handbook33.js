// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook33).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "spline-joint-design": {
    "purpose": "Design of a metric-module involute spline joint (30° flat-root proportions): pitch, minor diameter, tooth thickness and working depth from module and tooth count, root shear stress of the shaft, the engagement length needed for tooth shear at the pitch line and for tooth compression (fixed or flexible spline), and the stresses at the length chosen, by the same method as the spline torque capacity tool.",
    "uses": [
      "Size the engagement length of a splined hub",
      "Check a splined shaft end for a torque increase",
      "Compare fixed and flexible (sliding) splines"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "T": "Torque the joint transmits.",
      "m": "Module of the spline (pitch diameter ÷ teeth).",
      "Nt": "Number of spline teeth.",
      "Le": "Length over which the teeth of shaft and hub engage.",
      "Dh": "Bore diameter if the shaft is hollow.",
      "kind": "A fixed spline does not slide; a flexible spline slides or accepts misalignment and is limited by wear.",
      "acc": "Accuracy of tooth spacing, which sets how many teeth share the load.",
      "Ka": "Application factor for shock in the drive.",
      "Km": "Load distribution factor for misalignment along the length.",
      "Kf": "Fatigue life factor for the number of torque cycles.",
      "Kw": "Wear life factor for flexible splines.",
      "Ss": "Allowable shear stress of the spline material (your design value).",
      "Sc": "Allowable compressive stress on the tooth flanks (your design value)."
    },
    "outputs": [
      "Spline proportions from module and teeth",
      "Root shear stress",
      "Engagement length needed and stresses at the length chosen"
    ],
    "method": [
      "Pitch diameter D = m N; external minor diameter D_re = m (N − 1.35); tooth thickness t = π m ÷ 2; working depth h = m (30° flat-root proportions).",
      "Root shear S_s = 16 T K_a ÷ (π D_re³ K_f) for a solid shaft (hollow: 16 T D_re K_a ÷ [π (D_re⁴ − D_h⁴) K_f]).",
      "Tooth shear at the pitch line S = k T K_a K_m ÷ (D N L t K_f), k = 4 (good spacing) or 6; compressive S_c = 2 T K_m K_a ÷ (9 D N L h K_f) fixed, or 2 T K_m K_a ÷ (D N L h K_w) flexible.",
      "Length needed = the larger of the lengths that bring tooth shear and compression to their allowables.",
      "Example: 500 N·m on a 20-tooth module 2 spline needs 4.7746 mm of engagement; the root shear stress is 58.884 MPa."
    ],
    "limitations": [
      "Simplified method; full spline rating uses the standard’s factors and tooth geometry.",
      "Flat-root proportions; fillet-root splines have a slightly larger minor diameter.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Engagement beyond about one pitch diameter adds little: misalignment concentrates the load at one end."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2255–2282. Topic reference; no source tables or recommended settings are reproduced.",
      "ANSI B92.1 Involute Splines and Inspection; ISO 4156 Straight cylindrical involute splines"
    ]
  },
  "ballscrew-axis-stiffness": {
    "purpose": "Axial stiffness of a ball-screw feed axis: screw shaft stiffness for thrust bearings at one end or both ends, combined in series with the nut and support bearing stiffnesses, deflection under the largest axial load, the preload needed so the preloaded nut does not unload (load ÷ 2.83), preload drag torque, preload as a share of the dynamic rating and the axial natural frequency of the moving mass on the axis stiffness.",
    "uses": [
      "Check a machine axis for positioning stiffness",
      "Choose a preload class for a ball nut",
      "Compare one-end and both-end thrust bearing layouts"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d0": "Nominal (ball circle) diameter of the screw.",
      "dr": "Root diameter of the screw thread.",
      "l": "Lead of the screw.",
      "ends": "Whether thrust is taken at one end only or at both ends.",
      "L": "For both ends: distance between the thrust bearings (the screw is weakest with the nut at mid-span). For one end: distance from the thrust bearing to the farthest nut position.",
      "E": "Elastic modulus of the screw steel.",
      "kn": "Axial stiffness of the ball nut at its preload (from the catalogue).",
      "kb": "Combined axial stiffness of the support bearings and housing.",
      "F": "Largest axial load in service (cutting plus acceleration).",
      "dAllow": "Elastic deflection you accept at the largest load.",
      "Fp": "Preload applied to the nut.",
      "Ca": "Dynamic load rating of the ball nut.",
      "pMax": "Upper limit on preload as a share of the dynamic rating (your design value).",
      "mt": "Mass moved by the axis.",
      "fReq": "Least axial natural frequency you need for the servo tuning."
    },
    "outputs": [
      "Screw, nut and bearing stiffness combined",
      "Deflection at the largest load",
      "Preload checks, drag torque and axial frequency"
    ],
    "method": [
      "Screw stiffness k_s = A E ÷ L (one end), or 4 A E ÷ L at mid-span (both ends), with A = π d_r² ÷ 4.",
      "Axis stiffness 1 ÷ k = 1 ÷ k_s + 1 ÷ k_n + 1 ÷ k_b; deflection = F ÷ k.",
      "A preloaded double nut unloads at about 2.83 F_p, so F_p ≥ F ÷ 2.83.",
      "Preload drag torque T_p = K F_p l ÷ 2π with K = 0.05 ÷ √(tan β) and tan β = l ÷ (π d₀); axial frequency f = √(k ÷ m) ÷ 2π.",
      "Example: the axis has 208.93 N/µm of stiffness and deflects 14.359 µm under 3000 N; the axial frequency is 162.67 Hz."
    ],
    "limitations": [
      "Static axial stiffness only; torsional wind-up of the screw adds lag in dynamic moves.",
      "The preload torque coefficient is the usual catalogue estimate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thrust bearings at both ends quadruple the weakest screw stiffness; the nut and bearings then often govern."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2561–2568. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tank-heater-sizing": {
    "purpose": "Sizing of an electric immersion heater for a tank: energy to heat the liquid and the vessel (as the heating energy tool), average surface loss during heat-up and holding loss at temperature from an overall loss coefficient, the power needed for the heat-up time with a margin, the heat-up time with the installed heater, holding duty and the element surface watt density against your limit for the liquid.",
    "uses": [
      "Size a heater for a wash, plating or oil tank",
      "Check an existing heater’s heat-up time",
      "Check watt density so oil or solutions do not burn on the elements"
    ],
    "users": [
      "Plant engineers",
      "Maintenance engineers",
      "Process engineers"
    ],
    "inputs": {
      "V": "Volume of liquid heated.",
      "rho": "Density of the liquid.",
      "c": "Specific heat of the liquid (4.18 water, about 1.9–2.1 oils).",
      "mv": "Mass of tank steel that heats up with the liquid.",
      "cv": "Specific heat of the vessel material (about 0.5 steel).",
      "T0": "Temperature at the start of heat-up.",
      "Ts": "Working temperature.",
      "Tamb": "Surrounding air temperature.",
      "A": "Outside area of walls, bottom and liquid surface that lose heat.",
      "U": "Overall loss coefficient (about 1–2 insulated, 5–10 bare steel in still air; an open liquid surface loses far more).",
      "th": "Time allowed to reach the set temperature.",
      "marg": "Margin on the power found.",
      "Pinst": "Rated power of the heater fitted or considered.",
      "n": "Number of heater elements.",
      "Ae": "Heated (sheath) surface of one element.",
      "wdMax": "Highest surface watt density the liquid accepts (your value from the heater maker; much lower for oils and viscous liquids than for water)."
    },
    "outputs": [
      "Heat-up energy and losses",
      "Power needed and actual heat-up time",
      "Holding duty and watt density"
    ],
    "method": [
      "Heat-up energy Q = (m c + m_v c_v)(T_s − T₀), with m = V ρ.",
      "Loss during heat-up ≈ U A [(T₀ + T_s) ÷ 2 − T_amb]; holding loss = U A (T_s − T_amb).",
      "Power needed = (Q ÷ t + heat-up loss) × (1 + margin); heat-up time with the installed heater = Q ÷ (P − heat-up loss).",
      "Watt density = installed power ÷ (elements × heated surface per element).",
      "Example: heating 1000 L from 15 to 60 °C in 3 h needs 19.848 kW; the 21 kW heater does it in 2.5734 h."
    ],
    "limitations": [
      "Uniform liquid temperature; poorly stirred tanks stratify.",
      "Evaporation from an open hot surface can dominate the losses and is not included in a simple U value.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the holding duty is very low, a smaller heater with a longer heat-up time may be acceptable."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hydraulic-line-sizing": {
    "purpose": "Sizing check of a hydraulic pressure, return or suction line: the least bore for the flow at your velocity limit (as the pipe size by velocity tool), the actual velocity, Reynolds number, friction factor and pressure drop through the line and fittings (as the pipe friction tool), the power lost, and the tube burst pressure by Barlow’s formula on the outside diameter with the working pressure rating at your design factor.",
    "uses": [
      "Choose a tube size for a new hydraulic circuit",
      "Find why a return line runs hot or noisy",
      "Check a tube’s pressure rating against a pressure increase"
    ],
    "users": [
      "Hydraulic engineers",
      "Maintenance engineers",
      "Machine designers"
    ],
    "inputs": {
      "Q": "Flow through the line (for a return line from a cylinder, include the area ratio).",
      "vmax": "Velocity limit you design to (commonly about 0.6–1.2 m/s suction, 2–4 return, 3–6 pressure lines).",
      "di": "Inside diameter of the tube.",
      "do": "Outside diameter of the tube.",
      "p": "Highest working pressure in the line.",
      "Su": "Tensile strength of the tube material.",
      "DF": "Ratio of burst to working pressure (often 4 for hydraulic tube; follow your standard).",
      "L": "Length of the line.",
      "K": "Sum of loss coefficients of bends, fittings and valves in the line.",
      "nu": "Kinematic viscosity at operating temperature.",
      "rho": "Density of the oil.",
      "eps": "Absolute roughness of the tube bore (about 0.0015 mm drawn tube).",
      "dpMax": "Pressure drop you accept along this line."
    },
    "outputs": [
      "Least bore and actual velocity",
      "Pressure drop and power lost",
      "Tube burst and working pressure rating"
    ],
    "method": [
      "Least bore d = √(4Q ÷ πv_max); velocity v = Q ÷ (π d² ÷ 4).",
      "Re = v d ÷ ν; f = 64 ÷ Re laminar, Colebrook turbulent; Δp = (f L ÷ d + ΣK) ρ v² ÷ 2 (as the pipe friction tool).",
      "Barlow burst pressure p_b = 2 S_u t ÷ D_o with t = (D_o − d) ÷ 2; working rating = p_b ÷ design factor.",
      "Example: 60 L/min in a 16 mm bore runs at 4.9736 m/s, loses 3.0261 bar and the tube is rated about 279.55 bar."
    ],
    "limitations": [
      "Straight-tube rating; fittings, hoses and welded joints have their own ratings.",
      "Viscosity must be taken at the actual oil temperature.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pressure drop rises about as velocity squared in turbulent flow: one tube size up often halves the loss."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3024–3027, 281–286. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "holding-brake-sizing": {
    "purpose": "Check of a spring-applied (fail-safe) motor brake: kinetic energy of the inertia at the motor shaft, the net decelerating torque with the load either driving through the stop (lowering, overhauling) or helping it, slip time and total stop time with the engagement delay, stopping angle, friction energy per stop and per hour against the brake’s permissible values, the brake torque needed for the required stop time, and the holding factor on the static load torque.",
    "uses": [
      "Choose a motor brake for a hoist, conveyor or axis",
      "Check a brake for more stops per hour",
      "Estimate how far a load travels after an emergency stop"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "n": "Speed of the brake shaft when braking starts (usually motor speed).",
      "J": "Motor, brake and load inertia referred to the brake shaft.",
      "TL": "Static load torque at the brake shaft (for a hoist, the load torque through the gearing).",
      "dir": "Whether the load keeps driving during the stop (overhauling) or helps to stop it.",
      "Tb": "Dynamic braking torque of the brake (from the maker).",
      "td": "Time from switching off until the brake torque builds up.",
      "treq": "Longest acceptable time from signal to standstill.",
      "SFh": "Ratio of brake torque to static load torque you require for holding.",
      "Wmax": "Largest friction energy per stop for the brake (from the maker).",
      "z": "Number of stops per hour.",
      "Wh": "Largest friction energy per hour for the brake (from the maker)."
    },
    "outputs": [
      "Net decelerating torque and stop time",
      "Stopping angle",
      "Energy per stop and per hour, torque for the required time and holding check"
    ],
    "method": [
      "ω = 2π n ÷ 60; net torque = T_b − T_L (overhauling) or T_b + T_L (assisting).",
      "Slip time t_b = J ω ÷ T_net; total stop time = t_d + t_b; stopping angle = ω t_d + ω t_b ÷ 2.",
      "Friction energy per stop W = T_b ω t_b ÷ 2 (= J ω² ÷ 2 × T_b ÷ T_net); per hour = W × stops.",
      "Torque for the required stop time = J ω ÷ (t_req − t_d) ± T_L; holding factor = T_b ÷ T_L.",
      "Example: 60 N·m stops 0.05 kg·m² from 1450 rpm in 0.2398 s, absorbing 0.86462 kJ per stop."
    ],
    "limitations": [
      "Constant brake torque; the dynamic torque falls as the lining heats and wears.",
      "Speed is taken as constant during the engagement delay; an overhauling load speeds up a little.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For hoists the overhauling case governs: the net torque is the brake torque less the load torque."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2455–2459. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "weld-preheat-check": {
    "purpose": "Screening check of a welding procedure for carbon and low-alloy steel: carbon equivalent CE (IIW) and Pcm from the composition (as the carbon equivalent tool), a preheat estimate by Séférian’s formula for the plate thickness, heat input from voltage, current, travel speed and process efficiency (as the welding heat input tool), and the cooling time from 800 to 500 °C (t8/5) for thick-plate (three-dimensional) and thin-plate (two-dimensional) heat flow, with the governing case compared to your window.",
    "uses": [
      "Screen a welding procedure before qualification",
      "See how preheat and heat input change the cooling time",
      "Check whether a thicker plate needs preheat"
    ],
    "users": [
      "Welding engineers",
      "Welding inspectors",
      "Fabrication supervisors"
    ],
    "inputs": {
      "C": "Carbon content from the mill certificate.",
      "Mn": "Manganese content.",
      "Si": "Silicon content.",
      "Cr": "Chromium content.",
      "Mo": "Molybdenum content.",
      "V": "Vanadium content.",
      "Ni": "Nickel content.",
      "Cu": "Copper content.",
      "B": "Boron content.",
      "th": "Thickness of the plate being welded.",
      "U": "Arc voltage.",
      "I": "Welding current.",
      "vt": "Travel speed of the arc.",
      "eta": "Thermal efficiency of the process (about 60% GTAW, 80% SMAW and GMAW, 100% SAW).",
      "T0": "Preheat and interpass temperature used.",
      "F3": "Joint shape factor for three-dimensional heat flow (1 for a bead on plate; lower for fillet and T joints; from your welding standard).",
      "F2": "Joint shape factor for two-dimensional heat flow (from your welding standard).",
      "CElim": "Carbon equivalent above which your code requires preheat (your value).",
      "tMin": "Shortest cooling time your procedure allows (hardness and cracking).",
      "tMax": "Longest cooling time your procedure allows (toughness)."
    },
    "outputs": [
      "Carbon equivalent and Pcm",
      "Séférian preheat estimate",
      "Heat input and t8/5 cooling time"
    ],
    "method": [
      "CE = C + Mn ÷ 6 + (Cr + Mo + V) ÷ 5 + (Ni + Cu) ÷ 15; Pcm = C + Si ÷ 30 + (Mn + Cu + Cr) ÷ 20 + Ni ÷ 60 + Mo ÷ 15 + V ÷ 10 + 5B.",
      "Séférian: C_c = (360C + 40(Mn + Cr) + 20Ni + 28Mo) ÷ 360; C_t = C_c (1 + 0.005 t); preheat ≈ 350 √(C_t − 0.25) °C.",
      "Heat input Q = η U I × 60 ÷ (v × 1000) kJ/mm.",
      "t8/5 thick plate = (6700 − 5T₀) Q [1 ÷ (500 − T₀) − 1 ÷ (800 − T₀)] F₃; thin plate = (4300 − 4.3T₀) × 10⁵ Q² ÷ d² × [1 ÷ (500 − T₀)² − 1 ÷ (800 − T₀)²] F₂; the larger governs.",
      "Example: CE 0.43933 steel 25 mm thick suggests about 128.84 °C preheat; at 1.344 kJ/mm and 150 °C, t8/5 is 10.545 s."
    ],
    "limitations": [
      "Screening estimates only; preheat must be set by the welding code (AS/NZS 1554, AWS D1.1, EN 1011-2) and a qualified procedure.",
      "Hydrogen level and restraint are not in Séférian’s formula.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising preheat and heat input both lengthen t8/5: too short risks hard, crack-prone zones; too long lowers toughness."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1431–1449. Topic reference; no source tables or recommended settings are reproduced.",
      "EN 1011-2 Welding — Recommendations for welding of metallic materials (cooling time formulas); International Institute of Welding carbon equivalent"
    ]
  },
  "snap-fit-joint-design": {
    "purpose": "Design of a cantilever snap-fit joint in plastic: the largest undercut the finger can take at the permissible strain, the assembly strain for the undercut chosen, deflection force and mating force over the lead-in angle (as the snap-fit tool), the separation force over the retaining angle (or self-locking when the retaining face cannot slide), and the bending stress at the root.",
    "uses": [
      "Design a clip for a plastic housing",
      "Decide whether a snap is separable or permanent",
      "Trade finger length against assembly force"
    ],
    "users": [
      "Product designers",
      "Plastics engineers",
      "Design engineers"
    ],
    "inputs": {
      "Y": "Height of the catch the finger must ride over.",
      "h": "Finger thickness at the root.",
      "L": "Length of the finger from root to catch.",
      "b": "Width of the finger.",
      "K": "Geometry factor for the finger’s taper (1 for constant thickness; tapering to half thickness makes it near 1.6).",
      "E": "Secant modulus of the plastic at the strain (from the material maker).",
      "eAllow": "Permissible short-term strain for a single or repeated assembly (from the material maker).",
      "mu": "Friction between the parts (plastic on plastic about 0.2–0.6).",
      "a1": "Angle of the lead-in face.",
      "a2": "Angle of the retaining face (90° makes a joint that cannot be pulled apart).",
      "Freq": "Pull-apart force the joint must resist."
    },
    "outputs": [
      "Largest undercut and the strain at the undercut chosen",
      "Deflection and assembly forces",
      "Separation force and root stress"
    ],
    "method": [
      "Strain ε = 3 Y h ÷ (2 L² K); largest undercut Y_max = 2 ε_perm L² K ÷ (3h).",
      "Deflection force P = b h² E ε ÷ (6L).",
      "Mating force W = P (μ + tan α₁) ÷ (1 − μ tan α₁); separation force uses the retaining angle α₂ and locks when μ tan α₂ ≥ 1.",
      "Root stress σ = E ε.",
      "Example: the finger takes up to 2.3437 mm of undercut; it pushes on with 6.3852 N and holds 11.724 N."
    ],
    "limitations": [
      "Elastic beam with a rigid root; a flexible base lowers forces and strain.",
      "Strain limits must come from the material maker for the temperature and number of assemblies.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A longer finger cuts strain with the square of the length, so it usually beats a thinner one."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 593–605. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "worm-gear-drive-design": {
    "purpose": "Design check of a worm gear drive: ratio, lead angle and efficiency from module, starts, teeth, worm diameter and friction (as the worm gear tool), sliding velocity, input and output torque, tangential, axial and separating forces on worm and wheel, power lost as heat and the oil temperature from the housing surface and heat transfer coefficient, and a self-locking check when the load must be held.",
    "uses": [
      "Check a worm reducer for continuous duty",
      "Find bearing loads on worm and wheel shafts",
      "Decide whether a worm drive can hold a load without a brake"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P1": "Power into the worm shaft.",
      "n1": "Speed of the worm.",
      "mx": "Axial module of the worm (equal to the wheel’s transverse module).",
      "z1": "Number of starts (threads) on the worm.",
      "z2": "Number of teeth on the wheel.",
      "d1": "Pitch diameter of the worm.",
      "alphan": "Normal pressure angle of the thread.",
      "mu": "Friction coefficient between worm and wheel at the sliding speed found (falls as sliding speed rises; your value from the gear maker).",
      "Ah": "Outside surface area of the gearbox housing.",
      "kh": "Heat transfer coefficient from housing to air (higher with a fan on the worm shaft).",
      "Tamb": "Surrounding air temperature.",
      "Tmax": "Highest oil temperature allowed for the lubricant.",
      "lock": "Whether the drive must hold the load without a brake."
    },
    "outputs": [
      "Ratio, lead angle, efficiency and sliding speed",
      "Torques and forces on worm and wheel",
      "Heat, oil temperature and self-locking checks"
    ],
    "method": [
      "Lead = π m z₁; tan γ = lead ÷ (π d₁); efficiency η = (cos αₙ − μ tan γ) ÷ (cos αₙ + μ cot γ) (as the worm gear tool).",
      "Sliding speed v_s = π d₁ n₁ ÷ (60 000 cos γ).",
      "T₁ = P₁ ÷ ω₁; T₂ = P₁ η ÷ ω₂; wheel tangential force (worm thrust) F_t2 = 2T₂ ÷ d₂; worm tangential force (wheel thrust) F_t1 = 2T₁ ÷ d₁; separating force ≈ F_t2 tan αₙ ÷ cos γ.",
      "Heat = P₁(1 − η); oil temperature = ambient + heat ÷ (k A).",
      "Example: 1.1 kW at 1450 rpm through 40:1 gives 188.13 N·m at 64.923% efficiency; the oil runs at about 51.795 °C."
    ],
    "limitations": [
      "Mesh friction only; bearing and churning losses add heat.",
      "Static self-locking is not reliable under vibration: use a brake for safety-critical holding.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More starts raise the lead angle and efficiency but lose self-locking."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2191–2194. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lifting-lug-design": {
    "purpose": "Check of a plate lifting lug with a pin or shackle: the load per sling leg from the total load, number of legs, sling angle and a dynamic factor, net-section tension across the hole, shear tear-out beyond the hole, bearing of the pin on the plate, double-shear stress in the pin (as the bolt and pin shear tool), utilisation of each against your allowables and the hole clearance.",
    "uses": [
      "Check a lifting lug on a fabricated frame",
      "Size a padeye for a new lift",
      "Review a lug when sling angles change"
    ],
    "users": [
      "Structural engineers",
      "Rigging supervisors",
      "Fabrication supervisors"
    ],
    "inputs": {
      "W": "Total weight of the load (as force).",
      "legs": "Number of sling legs that share the load (use fewer if the slings may not share evenly).",
      "ang": "Angle of each sling leg from vertical.",
      "Dyn": "Factor for snatch and acceleration during the lift (your value from the lifting code).",
      "t": "Thickness of the lug plate at the hole.",
      "R": "Distance from the hole centre to the plate edge in the direction of the pull (the edge radius for a round-ended lug).",
      "dh": "Diameter of the pin hole.",
      "dp": "Diameter of the pin or shackle pin.",
      "sA": "Allowable tensile stress of the plate (your design value).",
      "tA": "Allowable shear stress of the plate.",
      "bA": "Allowable bearing stress between pin and plate.",
      "tP": "Allowable shear stress of the pin.",
      "clr": "Largest clearance you accept between hole and pin (larger clearance concentrates bearing stress)."
    },
    "outputs": [
      "Design load per lug",
      "Net tension, tear-out and bearing stresses",
      "Pin shear and utilisations"
    ],
    "method": [
      "Load per lug F = W × dynamic factor ÷ (legs × cos θ).",
      "Net tension σ = F ÷ [(2R − d_h) t]; tear-out τ = F ÷ [2 t (R − d_h ÷ 2)].",
      "Bearing σ_b = F ÷ (d_p t); pin in double shear τ_p = F ÷ (2 × π d_p² ÷ 4).",
      "Example: 200 kN on 2 legs at 30° puts 144.34 kN on each lug; the highest utilisation is 80.188%."
    ],
    "limitations": [
      "Simplified lug checks; lifting codes add out-of-plane loads, cheek plates and weld checks.",
      "The lug weld to the structure needs its own check.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Tear-out usually governs short lugs: increase the edge distance before the plate thickness."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1535, 1720–1735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
