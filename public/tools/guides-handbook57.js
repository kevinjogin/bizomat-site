// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook57).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "acme-lead-screw-check": {
    "purpose": "Check of a metric trapezoidal lead screw and its nut: pitch and root diameters, lead and root area (as the Acme and trapezoidal thread tool), raising and lowering torque with collar friction, efficiency and self-locking (as the power screw torque tool), the direct stress at the root, and the bearing pressure on the nut flanks from the number of threads engaged, against your allowable stress and nut pressure.",
    "uses": [
      "Size a lead screw for a jack, press or slide",
      "Choose the nut length for a bronze nut",
      "Check whether a screw will hold its load"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Major (nominal) diameter of the trapezoidal thread.",
      "P": "Pitch of the thread.",
      "starts": "Number of starts (lead = starts × pitch).",
      "F": "Axial load the screw lifts or holds.",
      "mu": "Friction coefficient between screw and nut.",
      "dc": "Mean diameter of the thrust collar; 0 if a rolling thrust bearing is used.",
      "muc": "Friction coefficient at the collar.",
      "Lnut": "Length of thread engagement in the nut.",
      "pAllow": "Allowable bearing pressure on the nut thread for the nut material and speed (bronze nuts are often 7–15 MPa for slow motion).",
      "sAllow": "Allowable direct stress at the screw root."
    },
    "outputs": [
      "Pitch and root diameters, lead and root area",
      "Raising and lowering torque, efficiency, self-locking",
      "Root stress and nut bearing pressure"
    ],
    "method": [
      "Pitch diameter d₂ = d − P ÷ 2; root diameter d₃ = d − 2(P ÷ 2 + clearance); lead = starts × P (as the Acme and trapezoidal thread tool).",
      "Raising torque = F d₂ ÷ 2 × (L + π μ d₂ sec 15°) ÷ (π d₂ − μ L sec 15°) + collar friction; self-locking if the lowering torque is positive (as the power screw torque tool).",
      "Root stress = F ÷ (π d₃² ÷ 4); nut pressure = F ÷ (π d₂ × P ÷ 2 × threads engaged).",
      "Example: lifting 10000 N needs 35.703 N·m (17.831% efficient); the root sees 52.996 MPa and the nut 8.8419 MPa."
    ],
    "limitations": [
      "Static or slow motion; wear rates at speed are governed by p × v of the nut.",
      "Buckling of long compression screws is not checked here.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A longer nut lowers the bearing pressure; a finer pitch raises self-locking margin but lowers efficiency."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1921–1946. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-shaft-sizing": {
    "purpose": "Sizing of a shaft carrying an overhung spur or helical gear: tangential, radial and axial gear forces from the power, speed and pitch diameter (as the gear forces tool), the resultant bending moment at the bearing from the overhang and the axial-force couple, the diameter needed by the ASME-style shock-factor method with a keyway allowance (as the shaft diameter tool), and the combined axial, bending and torsional stress and safety factor of the chosen diameter (as the combined shaft stress tool).",
    "uses": [
      "Size a pinion shaft on a gearbox or motor",
      "Check a shaft after a power increase",
      "Show the effect of overhang on shaft size"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Students"
    ],
    "inputs": {
      "kW": "Power through the gear.",
      "rpm": "Speed of the shaft.",
      "dg": "Pitch diameter of the gear on this shaft.",
      "alphan": "Normal pressure angle of the teeth.",
      "beta": "Helix angle; 0 for a spur gear.",
      "a": "Distance from the centre of the nearest bearing to the gear’s mid-face.",
      "d": "Diameter of the shaft at the bearing (the critical section).",
      "Km": "Combined shock and fatigue factor on bending.",
      "Kt": "Combined shock and fatigue factor on torsion.",
      "tauA": "Allowable shear stress for the shaft method.",
      "keyway": "Whether a keyway is cut at the section.",
      "Sy": "Yield strength of the shaft.",
      "req": "Safety factor on yield you need for the combined stress."
    },
    "outputs": [
      "Gear forces and torque",
      "Bending moment at the bearing",
      "Diameter needed and the stress in the chosen diameter"
    ],
    "method": [
      "T = 9549 P ÷ n; F_t = 2T ÷ d; F_r = F_t tan α_n ÷ cos β; F_a = F_t tan β (as the gear forces tool).",
      "Moment at the bearing M = √[(F_t a)² + (F_r a + F_a d ÷ 2)²].",
      "Diameter d = ∛[16 √((K_m M)² + (K_t T)²) ÷ π τ] with τ × 0.75 for a keyway (as the shaft diameter tool); combined stress σ = F ÷ A + M ÷ Z, τ = T ÷ 2Z, von Mises (as the combined shaft stress tool).",
      "Example: the gear pushes 2,469.6 N tangentially and 930.59 N radially; the shaft needs 35.91 mm, and at 40 mm the stress gives a factor of 11.405."
    ],
    "limitations": [
      "Moment taken at the bearing nearest the gear; check other sections and deflection separately.",
      "Shock-factor method; detailed fatigue design uses endurance limits and notch factors.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the overhang halves the bending moment: keep gears close to their bearings."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2131–2160, 2195–2200, 295–303, 212–218. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "face-milling-power-plan": {
    "purpose": "Plan for a face milling cut: the number of teeth for the teeth wanted in the cut (as the milling cutter teeth tool), spindle speed and table feed, the engagement angle and mean chip thickness and the specific cutting force corrected for it (as the chip thickness and kc tool), and metal removal rate, cutting and motor power and torque (as the milling power tool), against the spindle power.",
    "uses": [
      "Choose a face mill and feed for a machine’s power",
      "Check heavy roughing on a small spindle",
      "Explain why thin chips need more power per cm³"
    ],
    "users": [
      "Machinists",
      "CNC programmers",
      "Process planners"
    ],
    "inputs": {
      "D": "Diameter of the face mill.",
      "W": "Width of the surface being milled.",
      "ap": "Axial depth of cut.",
      "zc": "How many teeth you want cutting at once for smooth cutting.",
      "zUse": "Teeth on the cutter you have; 0 uses the suggested number.",
      "vc": "Cutting speed.",
      "fz": "Feed per tooth.",
      "kappa": "Entering angle of the inserts (90° square shoulder, 45° face mill).",
      "kc1": "Specific cutting force of the material at 1 mm chip thickness.",
      "mc": "Chip-thickness exponent of the material.",
      "rake": "Effective rake angle of the inserts.",
      "eta": "Efficiency of the spindle drive.",
      "Pavail": "Spindle motor power."
    },
    "outputs": [
      "Suggested teeth and spindle speed",
      "Engagement, mean chip thickness and kc",
      "Removal rate, power and torque"
    ],
    "method": [
      "Teeth = 6.3 D ÷ W × teeth in cut ÷ 2 (as the milling cutter teeth tool); n = 1000 v_c ÷ π D; table feed = f_z × z × n.",
      "Engagement φ = cos⁻¹(1 − 2 a_e ÷ D); mean chip h_m = 360 f_z sin κ a_e ÷ (π D φ); k_c = k_c1.1 h_m^(−m_c)(1 − γ ÷ 100) (as the chip thickness and kc tool).",
      "Q = a_e a_p v_f; P_c = a_e a_p v_f k_c ÷ 6×10⁷; motor power = P_c ÷ efficiency (as the milling power tool).",
      "Example: a 10-tooth cutter at 509.3 rpm feeds 763.94 mm/min; k_c = 2,997 N/mm² and the cut needs 11.448 kW."
    ],
    "limitations": [
      "Symmetric face milling with the cutter centred on the width.",
      "k_c data from the tool maker or handbook for the material.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Reducing feed per tooth thins the chip and raises k_c, so power falls less than the feed does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 808–809, 1084–1101. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ballscrew-duty-life": {
    "purpose": "Life of a ball screw working through a duty cycle of up to four load–speed steps: the time-weighted mean speed and the cubic mean load (as the bearing duty cycle tool, ball exponent), the rated life in revolutions and hours at that mean load with the load factor, and the travel in kilometres (as the ball screw life tool), against the life you need.",
    "uses": [
      "Check a ball screw for a machine’s real duty cycle",
      "Compare screws for a new axis",
      "Estimate replacement intervals"
    ],
    "users": [
      "Design engineers",
      "Machine builders",
      "Maintenance engineers"
    ],
    "inputs": {
      "Ca": "Dynamic load rating of the ball screw nut from the maker.",
      "fw": "Load factor for shock and vibration (1.0–1.2 smooth, up to 2 or more with shock).",
      "lead": "Lead of the screw.",
      "req": "Life the screw must reach.",
      "P1": "Axial load in step 1 (including preload effect).",
      "n1": "Screw speed in step 1.",
      "t1": "Share of operating time in step 1.",
      "P2": "Axial load in step 2.",
      "n2": "Speed in step 2.",
      "t2": "Share of time in step 2.",
      "P3": "Axial load in step 3.",
      "n3": "Speed in step 3.",
      "t3": "Share of time in step 3.",
      "P4": "Axial load in step 4 (0 if unused).",
      "n4": "Speed in step 4.",
      "t4": "Share of time in step 4."
    },
    "outputs": [
      "Mean speed and cubic mean load",
      "Life in revolutions, hours and travel",
      "Check against the required life"
    ],
    "method": [
      "Mean speed n_m = Σ nᵢ tᵢ ÷ Σ tᵢ; mean load F_m = [Σ Fᵢ³ nᵢ tᵢ ÷ Σ nᵢ tᵢ]^(1/3) (as the bearing duty cycle tool with exponent 3).",
      "Life L = (C_a ÷ f_w F_m)³ × 10⁶ revolutions; hours = L ÷ (60 n_m); travel = L × lead (as the ball screw life tool).",
      "Example: the screw runs at a mean 1,800 rpm and 4.1857 kN, giving 9,133.6 h (9,864.3 km of travel)."
    ],
    "limitations": [
      "Basic rating life at 90% reliability; poor lubrication or contamination shortens it.",
      "Preload must be included in the step loads.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Life varies with the cube of load: a step with double the load uses up life eight times as fast."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2400–2420, 2561–2568. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "turn-of-nut-fatigue-check": {
    "purpose": "Check of a bolt tightened by the turn-of-nut method in a fluctuating-load joint: bolt stiffness from the shank and threaded lengths in the grip and the preload from the nut rotation past snug with the joint stiffness (as the turn-of-nut preload tool), the joint constant, the preload as a share of proof load, and the fatigue safety factor of the bolt under the cyclic external load by the Goodman line (as the bolted joint fatigue tool).",
    "uses": [
      "Set a turn angle for a fatigue-loaded joint",
      "Check preload scatter from angle tightening",
      "Check a bolted joint under cyclic load"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Fitters"
    ],
    "inputs": {
      "theta": "Nut rotation after the joint is snug.",
      "lead": "Lead (pitch for single-start) of the thread.",
      "d": "Nominal diameter of the bolt shank.",
      "At": "Tensile stress area of the thread.",
      "Ls": "Length of plain shank within the clamped grip.",
      "Lt": "Length of thread within the grip.",
      "E": "Elastic modulus of the bolt.",
      "kj": "Stiffness of the clamped parts (from a frustum estimate or test).",
      "P": "External tensile load on the joint, cycling between zero and this value.",
      "Sp": "Proof strength of the bolt grade.",
      "pMax": "Highest preload you accept as a share of the proof load.",
      "Se": "Fully corrected endurance strength of the bolt thread.",
      "Sut": "Tensile strength of the bolt.",
      "req": "Fatigue safety factor you need."
    },
    "outputs": [
      "Bolt stiffness, preload and joint constant",
      "Preload as a share of proof load",
      "Fatigue safety factor"
    ],
    "method": [
      "Bolt flexibility = (L_s ÷ A_s + L_t ÷ A_t) ÷ E; preload F = (θ ÷ 360) × lead ÷ (bolt flexibility + joint flexibility) (as the turn-of-nut preload tool).",
      "Joint constant C = k_b ÷ (k_b + k_j).",
      "σ_a = C P ÷ 2A_t; σ_i = F ÷ A_t; n = S_e (S_ut − σ_i) ÷ [S_ut σ_a + S_e (σ_m − σ_i)] (as the bolted joint fatigue tool).",
      "Example: 25° past snug gives 29.445 kN (84.612% of proof); the joint constant is 0.23556 and the fatigue factor 4.2702."
    ],
    "limitations": [
      "Angle measured from a true snug condition; gaps and soft gaskets take up rotation before preload builds.",
      "Fully corrected endurance strength from your data.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Stiff clamped parts (low joint constant) shield the bolt from the cyclic load: keep gaskets thin and hard."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535. Topic reference; no source tables or recommended settings are reproduced.",
      "VDI 2230 Part 1"
    ]
  },
  "unified-thread-wire-limits": {
    "purpose": "Three-wire inspection limits for a Unified (UN) external thread: basic major and pitch diameter limits for the class and length of engagement (as the Unified thread limits tool), the best-size wire and the measurement over wires at the maximum and minimum pitch diameter (as the three-wire measurement tool), and the pitch diameter worked back from your measured reading, accepted or rejected against the limits.",
    "uses": [
      "Inspect a UN bolt or screw with thread wires",
      "Write wire-reading limits on an inspection sheet",
      "Check a thread cut on a lathe"
    ],
    "users": [
      "Inspectors",
      "Machinists",
      "Quality technicians"
    ],
    "inputs": {
      "D": "Basic major diameter of the thread.",
      "n": "Threads per inch.",
      "cls": "Class of the external thread.",
      "LE": "Length of engagement for the tolerance (0 uses the standard length).",
      "W": "Diameter of the wires you have (0 uses the best size).",
      "Mmeas": "Micrometer reading over the three wires."
    },
    "outputs": [
      "Pitch diameter limits for the class",
      "Wire size and readings at the limits",
      "Pitch diameter from the reading and the decision"
    ],
    "method": [
      "Pitch diameter limits from the allowance and tolerance formulas for the class (as the Unified thread limits tool).",
      "Best wire = (P ÷ 2) ÷ cos 30°; M = E + W (1 + 1 ÷ sin 30°) − (P ÷ 2) ÷ tan 30° (as the three-wire measurement tool).",
      "Pitch diameter from a reading E = M − [W (1 + 1 ÷ sin 30°) − (P ÷ 2) ÷ tan 30°].",
      "Example: with 0.044412 in wires the reading must lie between 0.51012 and 0.51512 in; 0.5126 in means a pitch diameter of 0.44598 in."
    ],
    "limitations": [
      "Lead and flank angle errors are assumed small; they bias three-wire readings.",
      "External threads only; internal threads are checked with gauges.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use wires close to the best size: then flank angle errors hardly affect the reading."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1813–1866, 1990–2003. Topic reference; no source tables or recommended settings are reproduced.",
      "ASME B1.1 Unified Inch Screw Threads (UN and UNR Thread Form)"
    ]
  },
  "change-gear-threading-setup": {
    "purpose": "Set-up for single-point screw cutting on a lathe with change gears: the ratio needed from the thread lead, leadscrew and fixed headstock ratio, the best simple and compound gear trains from the gear set with their pitch errors (as the change gears tool), and the thread height, pitch diameter and number of passes for a constant-area infeed from your first-pass depth (as the metric thread tool for thread depth), checked against the pitch error you accept.",
    "uses": [
      "Cut a metric thread on an imperial lathe",
      "Check a gear train’s pitch error",
      "Plan passes for single-point threading"
    ],
    "users": [
      "Machinists",
      "Toolroom staff",
      "Apprentices"
    ],
    "inputs": {
      "d": "Nominal diameter of the metric thread.",
      "P": "Pitch of the thread to cut.",
      "screwUnit": "Whether the leadscrew is inch (threads per inch) or metric (pitch).",
      "screw": "Leadscrew threads per inch or pitch.",
      "fixed": "Ratio between spindle and stud gear fixed inside the headstock.",
      "set": "Change gears you have.",
      "tolPct": "Largest pitch error you accept from the gear train.",
      "a1": "Depth of the first pass; later passes get shallower to keep the chip area constant."
    },
    "outputs": [
      "Ratio needed and best gear trains with their errors",
      "Thread height and pitch diameter",
      "Passes for the constant-area infeed"
    ],
    "method": [
      "Ratio = thread lead ÷ (leadscrew lead × fixed ratio); best two- and four-gear trains from the set (as the change gears tool).",
      "External thread height h₃ = 0.6134P; pitch diameter d₂ = d − 0.6495P (as the metric thread tool).",
      "Constant-area infeed: depth after pass k = a₁ √k, so passes = ⌈(h₃ ÷ a₁)²⌉.",
      "Example: fit drivers 20 and 75, driven 25 and 127 (error 0%); cut 0.92015 mm deep in 10 passes."
    ],
    "limitations": [
      "Gear fit on the quadrant and the idler arrangement must be checked on the machine.",
      "Infeed passes are a starting plan; the last passes are often spring passes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Metric threads on an inch leadscrew need a 127-tooth gear for an exact ratio; without it, check the error over the thread length."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2043–2049, 1867–1890. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "panel-material-substitution": {
    "purpose": "Substitution of a bending plate, cover or panel with another material: the thickness for equal bending stiffness and for equal bending strength, the governing thickness (as the equivalent stiffness thickness tool), mass per square metre and cost of the original and the new panel, the panel mass and cost over its area, and checks against the thickest stock available and whether the change saves weight.",
    "uses": [
      "Swap a steel cover for aluminium or plastic",
      "Estimate weight saving from a material change",
      "Check a plastic guard against the steel original"
    ],
    "users": [
      "Design engineers",
      "Product designers",
      "Value engineers"
    ],
    "inputs": {
      "t1": "Thickness of the existing panel.",
      "E1": "Elastic modulus of the existing material.",
      "S1": "Allowable stress of the existing material.",
      "rho1": "Density of the existing material.",
      "p1": "Price of the existing material.",
      "E2": "Elastic modulus of the new material.",
      "S2": "Allowable stress of the new material.",
      "rho2": "Density of the new material.",
      "p2": "Price of the new material.",
      "tMax": "Thickest sheet or plate of the new material you can get.",
      "area": "Area of the panel."
    },
    "outputs": [
      "Thickness for equal stiffness and for equal strength",
      "Mass and cost per square metre, old and new",
      "Panel mass and cost"
    ],
    "method": [
      "Equal bending stiffness: t₂ = t₁ ∛(E₁ ÷ E₂); equal bending strength: t₂ = t₁ √(S₁ ÷ S₂); the larger governs (as the equivalent stiffness thickness tool).",
      "Mass per m² = density × thickness; cost = mass × price.",
      "Panel mass and cost = per m² × area.",
      "Example: the new panel must be 2.838 mm (stiffness 2.838, strength 2.582 mm); it weighs 48.806% of the original and costs 57.469 $ against 47.1 $."
    ],
    "limitations": [
      "Bending of flat panels; in-plane loads and buckling scale differently.",
      "Same shape and supports; ribbing or forming can save more than thickness.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Lower-modulus materials need disproportionately more thickness for stiffness, so weight savings are smaller than density alone suggests."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 575–580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cone-clutch-engagement": {
    "purpose": "Check of a cone clutch starting a load: torque capacity from the axial holding force, friction and cone geometry and the force to engage it (as the cone clutch tool), the slip time to accelerate the load inertia against its load torque at the clutch torque (as the torque to accelerate a rotating load tool), the heat generated by slip in each engagement, the temperature rise of the cone, and the engagements per hour the cone can shed, against the required torque and your temperature limit.",
    "uses": [
      "Check a cone clutch for a heavier load",
      "Estimate clutch heating per start",
      "Size the spring or actuator that engages a clutch"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Do": "Largest diameter of the friction cone.",
      "Di": "Smallest diameter of the friction cone.",
      "alpha": "Half-angle of the cone.",
      "mu": "Friction coefficient of the lining.",
      "F": "Axial force holding the clutch engaged (spring force).",
      "Treq": "Torque the clutch must carry once engaged, with service factor.",
      "J": "Moment of inertia of the driven load referred to the clutch shaft.",
      "n": "Speed of the driving side.",
      "Tl": "Resisting torque of the load while it accelerates.",
      "mc": "Mass of the cone or drum that soaks up the slip heat.",
      "cpc": "Specific heat of that part.",
      "dTmax": "Largest temperature rise per engagement you accept."
    },
    "outputs": [
      "Torque capacity and engaging force",
      "Slip time and slip energy",
      "Temperature rise per engagement"
    ],
    "method": [
      "Torque capacity T = μ F (D_o + D_i) ÷ 4 ÷ sin α; engaging force = F (sin α + μ cos α) ÷ sin α (as the cone clutch tool).",
      "Slip time t = J ω ÷ (T − T_load) (as the torque to accelerate a rotating load tool, solved for time).",
      "Slip energy = T ω t ÷ 2 (the clutch slips at a falling relative speed); temperature rise = energy ÷ (m c).",
      "Example: the clutch carries 162.33 N·m with 3,264.2 N to engage; it slips 0.42803 s and heats 1.9772 K each start."
    ],
    "limitations": [
      "Constant friction coefficient and uniform wear; new linings bed in.",
      "All slip heat into the cone; repeated starts accumulate heat.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Heat per start equals the load’s kinetic energy plus the work against load torque: high-inertia loads need large cones."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2446–2449, 176–181. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
