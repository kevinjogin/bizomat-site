// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook34).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "helical-gear-set-design": {
    "purpose": "Design check of a parallel-axis helical gear pair from power and speed: transverse module, pitch diameters, centre distance, transverse pressure angle, virtual teeth and overlap ratio (as the helical gear tool), the tangential, axial and separating forces the bearings must carry, pitch-line velocity and the Lewis bending stress in the normal plane with the velocity factor (as the Lewis bending tool), using the form factor for the virtual number of teeth.",
    "uses": [
      "Size a helical gear pair for a reducer",
      "Find the thrust load for bearing selection",
      "Compare helix angles for smoothness against thrust"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P": "Power through the gear pair.",
      "n1": "Speed of the pinion.",
      "mn": "Normal module (the hob or cutter module).",
      "beta": "Helix angle at the pitch diameter.",
      "alphan": "Normal pressure angle.",
      "z1": "Number of teeth on the pinion.",
      "z2": "Number of teeth on the gear.",
      "b": "Face width in mesh.",
      "Y": "Lewis form factor read for the pinion’s virtual number of teeth (z ÷ cos³β), shown in the results.",
      "make": "Manufacturing quality, which sets the velocity factor.",
      "allow": "Allowable bending stress of the pinion material (your design value).",
      "ebMin": "Least overlap (face contact) ratio you want for smooth running (often at least 1)."
    },
    "outputs": [
      "Gear geometry and centre distance",
      "Tangential, axial and separating forces",
      "Bending stress and overlap checks"
    ],
    "method": [
      "m_t = m_n ÷ cos β; d = z m_t; a = (d₁ + d₂) ÷ 2; tan α_t = tan α_n ÷ cos β; virtual teeth z_v = z ÷ cos³β; overlap ratio ε_β = b sin β ÷ (π m_n).",
      "T₁ = P ÷ ω₁; tangential force F_t = 2T₁ ÷ d₁; axial F_a = F_t tan β; separating F_r = F_t tan α_t.",
      "Lewis bending σ = K_v F_t ÷ (b m_n Y) with K_v from the pitch-line velocity (as the Lewis bending tool).",
      "Example: 7.5 kW at 1450 rpm gives a 1,590.3 N tangential force and 426.13 N of thrust; the bending stress is 73.895 MPa."
    ],
    "limitations": [
      "Lewis method for a first sizing; full ratings use AGMA or ISO 6336 factors and pitting resistance.",
      "Form factor must be read for the virtual number of teeth.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger helix angle runs smoother but raises the thrust the bearings must take."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2195–2210, 2131–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bevel-gear-set-design": {
    "purpose": "Design check of a straight bevel gear pair from power and speed: pitch cone angles, pitch diameters and outer cone distance (as the bevel gear tool), face width against your limit as a share of the cone distance, the mean pitch diameter and the tangential, axial and radial forces on pinion and gear at the mean diameter, and the Lewis bending stress for bevel teeth with the face-width correction (L − b) ÷ L and the velocity factor.",
    "uses": [
      "Size a bevel pair for a right-angle drive",
      "Find the axial and radial loads for the bearings",
      "Check a face width against the cone distance"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P": "Power through the bevel pair.",
      "n1": "Speed of the pinion.",
      "m": "Module at the outer (large) end.",
      "z1": "Number of teeth on the pinion.",
      "z2": "Number of teeth on the gear.",
      "shaft": "Angle between the shafts (90° for a right-angle drive).",
      "alphan": "Pressure angle of the teeth.",
      "b": "Face width along the cone.",
      "shareMax": "Largest face width as a share of the outer cone distance you design to (a third is common).",
      "Y": "Lewis form factor for the formative (equivalent spur) number of teeth.",
      "make": "Manufacturing quality, which sets the velocity factor.",
      "allow": "Allowable bending stress of the pinion material (your design value)."
    },
    "outputs": [
      "Cone angles, diameters and cone distance",
      "Forces on pinion and gear at the mean diameter",
      "Bending stress and face-width checks"
    ],
    "method": [
      "tan δ₁ = sin Σ ÷ (z₂ ÷ z₁ + cos Σ); δ₂ = Σ − δ₁; d = m z; outer cone distance L = d₂ ÷ (2 sin δ₂) (as the bevel gear tool).",
      "Mean pitch diameter d_m1 = d₁ (1 − 0.5 b ÷ L); F_t = 2T₁ ÷ d_m1; pinion axial F_a1 = F_t tan α sin δ₁ and radial F_r1 = F_t tan α cos δ₁ (the gear’s axial and radial forces swap these).",
      "Lewis bending σ = K_v F_to L ÷ [b m Y (L − b)], with F_to = 2T₁ ÷ d₁ at the large end.",
      "Example: 3 kW at 1450 rpm puts 635.67 N tangential load at the mean diameter; the bending stress is 47.393 MPa."
    ],
    "limitations": [
      "Lewis method for a first sizing; AGMA 2003 or ISO 10300 give full ratings.",
      "Straight bevel teeth; spiral bevels have different force directions that depend on hand and rotation.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Face width beyond about a third of the cone distance adds little strength because the inner teeth are small."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2181–2190, 2131–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "journal-bearing-design": {
    "purpose": "First design of a full-film hydrodynamic journal bearing: unit load on the projected area, length-to-diameter ratio, surface speed, Sommerfeld number, Petroff friction torque, friction coefficient and power loss (as the Petroff tool), and the oil flow to carry the heat at an allowed temperature rise, with checks of unit load, L/D and Sommerfeld number against your limits.",
    "uses": [
      "Size a plain bearing for a pump, fan or turbine shaft",
      "Estimate bearing heat and oil supply",
      "Compare clearances and oil grades"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "W": "Radial load on the bearing.",
      "d": "Diameter of the journal.",
      "L": "Length of the bearing.",
      "c": "Radial clearance (half the diametral clearance).",
      "rpm": "Shaft speed.",
      "mu": "Dynamic viscosity of the oil at its working film temperature.",
      "dT": "Temperature rise of the oil through the bearing.",
      "cp": "Specific heat of the oil.",
      "rho": "Density of the oil.",
      "pMax": "Largest unit load for the bearing material and duty (your value).",
      "ldMin": "Smallest length-to-diameter ratio you design to.",
      "ldMax": "Largest length-to-diameter ratio you design to.",
      "Smin": "Smallest Sommerfeld number you accept, so the film stays thick enough (your value)."
    },
    "outputs": [
      "Unit load, L/D and surface speed",
      "Sommerfeld number and Petroff friction",
      "Power loss and oil flow"
    ],
    "method": [
      "Unit load p = W ÷ (L d); surface speed V = π d n ÷ 60 000.",
      "Sommerfeld S = (r ÷ c)² μ N ÷ p, with N in rev/s.",
      "Petroff torque T = 4π² r³ L μ N ÷ c; f = 2π² (μ N ÷ p)(r ÷ c); power loss = 2π N T (as the Petroff tool).",
      "Oil flow = power loss ÷ (ρ c_p ΔT).",
      "Example: 5000 N on a 50 × 50 mm bearing gives 2 MPa, S = 0.12207, and 75.699 W of friction needing 0.27477 L/min of oil."
    ],
    "limitations": [
      "Petroff assumes a concentric, lightly loaded journal; at heavy load use the design charts for film thickness.",
      "Oil flow here carries heat only; the bearing’s own side leakage must also be supplied.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A low Sommerfeld number means a thin film: raise viscosity or speed, or cut the clearance or unit load."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2326–2345. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "extension-spring-designer": {
    "purpose": "Design check of a helical extension spring with standard loop hooks: rate, load at the working extension, body shear stress with the Wahl factor (as the extension spring tool), the initial-tension stress against your range, hook bending stress at the loop and torsional stress at the bend radius (Wahl hook formulas), and the natural frequency of the spring fixed at both ends.",
    "uses": [
      "Design an extension spring for a return or counterbalance",
      "Find why springs break at the hook",
      "Check a spring for surge at a cycling frequency"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Diameter of the spring wire.",
      "D": "Mean diameter of the coils.",
      "Na": "Number of active coils (for loop ends, about the body coils).",
      "G": "Shear modulus of the wire.",
      "Fi": "Initial tension wound into the spring.",
      "x": "Extension from the free position at the working load.",
      "allow": "Allowable body shear stress at the working load (your value from the spring maker).",
      "r1": "Mean radius of the hook loop (usually half the mean coil diameter).",
      "r2": "Mean radius of the bend where the hook leaves the body.",
      "sbA": "Allowable bending stress in the hook (your value).",
      "thA": "Allowable torsional stress at the hook bend (your value).",
      "tiMin": "Low end of the initial-tension stress the maker can wind for this index.",
      "tiMax": "High end of the initial-tension stress the maker can wind for this index.",
      "rhoW": "Density of the spring wire."
    },
    "outputs": [
      "Rate, working load and body stress",
      "Hook bending and torsional stresses",
      "Initial-tension stress and natural frequency"
    ],
    "method": [
      "Rate k = G d⁴ ÷ (8 D³ N_a); working load F = F_i + k x; body stress τ = K_w 8 F D ÷ (π d³) with the Wahl factor (as the extension spring tool).",
      "Hook bending σ_A = F [K₁ 16 D ÷ (π d³) + 4 ÷ (π d²)], K₁ = (4C₁² − C₁ − 1) ÷ [4C₁(C₁ − 1)], C₁ = 2r₁ ÷ d.",
      "Hook torsion τ_B = K₂ 8 F D ÷ (π d³), K₂ = (4C₂ − 1) ÷ (4C₂ − 4), C₂ = 2r₂ ÷ d.",
      "Natural frequency (both ends fixed) f = ½ √(k ÷ m_a), m_a = ρ π² d² D N_a ÷ 4.",
      "Example: the spring carries 56.993 N at 25 mm; the body runs at 509.11 MPa and the hook at 972.48 MPa bending."
    ],
    "limitations": [
      "Static design stresses; fatigue needs the stress range and the maker’s fatigue data.",
      "Hook formulas are for standard full loops; other end types differ.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Hooks usually fail first: a larger bend radius r₂ lowers the hook torsional stress the most."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 325–340. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "motor-duty-cycle-check": {
    "purpose": "Duty-cycle sizing of a motor for a repeated trapezoidal move: acceleration, running, deceleration and dwell segments from the inertia at the motor, the top speed and the segment times, segment torques including friction or load torque, the RMS torque over the cycle (as the RMS torque tool) against the continuous rating, the peak torque against the peak rating, the inertia ratio and the energy returned on each deceleration.",
    "uses": [
      "Size a servo motor for an indexing or pick-and-place axis",
      "Check a motor for a faster cycle",
      "Estimate the braking resistor energy per stop"
    ],
    "users": [
      "Automation engineers",
      "Machine designers",
      "Controls engineers"
    ],
    "inputs": {
      "J": "Inertia of the load and transmission referred to the motor shaft (divide load inertia by the ratio squared).",
      "Jm": "Inertia of the motor rotor (and brake, if fitted).",
      "nmax": "Top speed of the move at the motor.",
      "ta": "Time to accelerate from rest to top speed.",
      "tr": "Time at top speed.",
      "td": "Time to decelerate to rest.",
      "tw": "Rest time before the next move.",
      "Tf": "Torque for friction and load while the axis moves (positive, opposing motion).",
      "Th": "Torque the motor holds at rest (for a vertical axis without a brake).",
      "Tc": "Continuous torque rating of the motor (from the maker).",
      "Tp": "Peak torque rating of the motor and drive (from the maker).",
      "nMot": "Maximum speed of the motor.",
      "jrMax": "Largest inertia ratio you accept for good servo tuning (your value)."
    },
    "outputs": [
      "Segment torques",
      "RMS and peak torque against the ratings",
      "Inertia ratio and energy returned per stop"
    ],
    "method": [
      "ω = 2π n ÷ 60; total inertia J_t = J + J_m.",
      "Acceleration torque = J_t ω ÷ t_a + T_f; running = T_f; deceleration = T_f − J_t ω ÷ t_d (negative = braking); dwell = holding torque.",
      "RMS = √(Σ T² t ÷ Σ t) (as the RMS torque tool); peak = the largest |T|.",
      "Inertia ratio = J ÷ J_m; energy returned per stop ≈ J_t ω² ÷ 2 − T_f ω t_d ÷ 2.",
      "Example: the move needs 15.566 N·m to accelerate; the RMS torque is 5.4835 N·m against 6 N·m continuous."
    ],
    "limitations": [
      "Trapezoidal profile with constant acceleration; S-curves lower the peak slightly.",
      "Motor heating also depends on speed; check the maker’s speed-torque curve.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Longer dwell lowers RMS torque; shorter acceleration raises the peak sharply."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2569–2580, 180–186. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "timing-belt-drive-design": {
    "purpose": "Design of a synchronous (timing) belt drive: pulley pitch diameters from the pitch and tooth counts, exact pitch length for the centre distance, rounding to a whole number of belt teeth and the centre distance that belt gives, teeth in mesh on the small pulley (as the timing belt tool), belt speed, effective pull from the power with a service factor, and the belt width needed from your allowable working tension per millimetre of width.",
    "uses": [
      "Lay out a timing belt drive for a machine axis or pump",
      "Choose a belt width for a power",
      "Check teeth in mesh for a small pulley"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P": "Power transmitted.",
      "n1": "Speed of the small pulley.",
      "SF": "Service factor for the driven machine and running hours (from the belt maker).",
      "p": "Pitch of the belt teeth.",
      "z1": "Teeth on the small pulley.",
      "z2": "Teeth on the large pulley.",
      "C": "Centre distance you would like; the tool finds the nearest belt.",
      "Ta": "Allowable working tension per mm of belt width at this speed and pulley size (your value from the belt maker).",
      "b": "Belt width being considered.",
      "meshMin": "Least teeth in mesh on the small pulley (the belt maker’s rule, often 6).",
      "vMax": "Largest belt speed for the belt and pulleys."
    },
    "outputs": [
      "Pitch diameters, belt length and actual centre distance",
      "Teeth in mesh and belt speed",
      "Effective pull and belt width needed"
    ],
    "method": [
      "Pitch diameter = z p ÷ π; pitch length L = 2√[C² − ((D − d) ÷ 2)²] + π(D + d) ÷ 2 + (D − d) sin⁻¹[(D − d) ÷ 2C]; belt teeth = round(L ÷ p); centre distance found for that belt (as the timing belt tool).",
      "Wrap on the small pulley = 180° − 2 sin⁻¹[(D − d) ÷ 2C]; teeth in mesh = z₁ × wrap ÷ 360.",
      "Belt speed v = π d n ÷ 60 000; effective pull F_e = P × SF ÷ v; width needed = F_e ÷ allowable tension per mm.",
      "Example: a 110-tooth belt sets the centres at 199.36 mm; 9.4912 teeth mesh and the belt needs 11.586 mm of width."
    ],
    "limitations": [
      "Width from a single allowable tension per mm; makers’ rating tables include speed and pulley-size effects.",
      "Shaft loads depend on installation tension: follow the maker’s tensioning method.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If too few teeth mesh, use a larger small pulley or a wider belt rating with a mesh correction."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2473–2535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "heat-exchanger-sizing": {
    "purpose": "Sizing check of a liquid-to-liquid heat exchanger: duty from the hot stream’s flow, specific heat and temperature drop, the cold stream outlet temperature from the energy balance, the log-mean temperature difference for counterflow or parallel flow (as the heat exchanger LMTD tool), the area needed with your overall coefficient, and checks of the installed area and the closest approach temperature.",
    "uses": [
      "Size an oil or coolant cooler for a machine",
      "Find the water outlet temperature of a cooler",
      "Check whether an existing exchanger has enough area"
    ],
    "users": [
      "Plant engineers",
      "Hydraulic engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Qh": "Volume flow of the hot stream.",
      "rhoh": "Density of the hot fluid.",
      "cph": "Specific heat of the hot fluid (about 1.9–2.1 for mineral oil).",
      "Thi": "Hot stream inlet temperature.",
      "Tho": "Hot stream outlet temperature wanted.",
      "Qc": "Volume flow of the cooling stream.",
      "rhoc": "Density of the cold fluid.",
      "cpc": "Specific heat of the cold fluid.",
      "Tci": "Cold stream inlet temperature.",
      "flow": "Whether the streams run in opposite directions (counterflow) or the same direction.",
      "U": "Overall heat transfer coefficient for the exchanger type and fluids, including fouling (from the maker or your data).",
      "Ainst": "Heat transfer area of the exchanger fitted or offered.",
      "appMin": "Smallest temperature difference you accept between the streams at either end."
    },
    "outputs": [
      "Duty and cold outlet temperature",
      "LMTD and area needed",
      "Area and approach checks"
    ],
    "method": [
      "Duty = ṁ_h c_ph (T_hi − T_ho), ṁ = flow × density.",
      "Cold outlet T_co = T_ci + duty ÷ (ṁ_c c_pc).",
      "LMTD = (ΔT₁ − ΔT₂) ÷ ln(ΔT₁ ÷ ΔT₂) with the end differences for the flow arrangement (as the LMTD tool).",
      "Area needed = duty ÷ (U × LMTD).",
      "Example: cooling 30 L/min from 70 to 50 °C moves 41.8 kW; the water leaves at 35 °C and 3.5161 m² is needed."
    ],
    "limitations": [
      "Pure counterflow or parallel flow; shell-and-tube with several passes needs an LMTD correction factor.",
      "Constant specific heats and no phase change.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Counterflow needs less area for the same duty and lets the cold outlet exceed the hot outlet."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "surface-grinding-planner": {
    "purpose": "Plan of a reciprocating surface grinding operation with the wheel covering the work width: wheel surface speed against the wheel’s maximum operating speed, speed ratio, contact length (as the grinding geometry tool), equivalent chip thickness, specific removal rate and removal rate, grinding power from your specific grinding energy against the spindle power, and passes and time for the stock with spark-out passes.",
    "uses": [
      "Plan a surface grinding operation",
      "Check the spindle power for a deeper cut",
      "Check a wheel speed against its marked maximum"
    ],
    "users": [
      "Grinding machinists",
      "Process planners",
      "Manufacturing engineers"
    ],
    "inputs": {
      "ds": "Diameter of the grinding wheel.",
      "ns": "Spindle speed.",
      "vsMax": "Maximum operating speed marked on the wheel; never exceed it.",
      "vw": "Table (work) speed.",
      "ae": "Down-feed per pass.",
      "bw": "Width of the ground surface (the wheel covers it in each pass).",
      "L": "Length of the work.",
      "over": "Overtravel beyond the work at each end.",
      "stock": "Total depth to remove.",
      "spark": "Passes with no down-feed at the end.",
      "u": "Specific energy to grind the material with this wheel (your value from tests or the wheel maker; much higher for fine finishing cuts).",
      "Pm": "Rated power of the spindle motor.",
      "eta": "Share of motor power available at the wheel."
    },
    "outputs": [
      "Wheel speed, speed ratio and contact length",
      "Removal rate and grinding power",
      "Passes and grinding time"
    ],
    "method": [
      "Wheel speed v_s = π d_s n_s ÷ 60 000; speed ratio = v_s ÷ v_w.",
      "Contact length l_g = √(a_e d_s) (as the grinding geometry tool); equivalent chip thickness h_eq = a_e v_w ÷ v_s.",
      "Removal rate Q = a_e b_w v_w; power = u Q.",
      "Passes = stock ÷ a_e (rounded up) + spark-out; time = passes × (L + 2 overtravel) ÷ v_w.",
      "Example: the wheel runs at 34.034 m/s; removing 100 mm³/s takes 3 kW and the job takes 0.51333 min."
    ],
    "limitations": [
      "One stroke per pass (wheel at least as wide as the work); cross-fed grinding needs more strokes.",
      "Specific energy varies strongly with wheel sharpness and depth of cut.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the depth per pass halves the power but doubles the passes; a faster table can keep the time down."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1199–1268. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "compression-strut-sizing": {
    "purpose": "Sizing of a pin-ended or end-restrained compression strut in solid round bar or round tube: the slenderness ratio and transition slenderness, buckling by the Euler formula for slender struts or the Johnson parabola for intermediate ones (as the column buckling tool), the least outside diameter that meets the safety factor (found by search), and the safety factor, stress and mass per metre of the size you choose.",
    "uses": [
      "Size a push rod, brace or prop",
      "Compare bar and tube for weight",
      "Check a strut after a length change"
    ],
    "users": [
      "Design engineers",
      "Structural engineers",
      "Fabrication supervisors"
    ],
    "inputs": {
      "P": "Axial compressive load.",
      "L": "Length between the end supports.",
      "K": "Effective length factor for the end conditions (1 pinned–pinned, 0.7 fixed–pinned, 0.5 fixed–fixed, 2 fixed–free; designers often use larger practical values).",
      "E": "Elastic modulus of the material.",
      "Sy": "Yield strength of the material.",
      "SF": "Safety factor against buckling you require.",
      "sec": "Solid bar or tube.",
      "Dt": "For a tube, the ratio of outside diameter to wall thickness (kept constant while sizing).",
      "Dc": "Outside diameter you intend to use.",
      "rho": "Density for the mass per metre."
    },
    "outputs": [
      "Least diameter for the safety factor",
      "Slenderness and buckling mode",
      "Safety factor, stress and mass of the chosen size"
    ],
    "method": [
      "Slenderness λ = K L ÷ r with r = √(I ÷ A); transition C_c = π √(2E ÷ S_y).",
      "Euler (λ ≥ C_c): σ_cr = π² E ÷ λ²; Johnson (λ < C_c): σ_cr = S_y − (S_y λ ÷ 2π)² ÷ E (as the column buckling tool).",
      "Safety factor = σ_cr A ÷ P; the least diameter is found by bisection for the required factor.",
      "Example: 50 kN over 2000 mm needs at least 47.661 mm; a 50 mm bar gives a factor of 3.028."
    ],
    "limitations": [
      "Concentric load; eccentric loads need the secant formula.",
      "Thin-walled tubes can also fail by local buckling.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For the same mass a tube is far stiffer against buckling than a solid bar."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 281–287. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
