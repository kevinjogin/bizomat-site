// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook36).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "deep-drawing-plan": {
    "purpose": "Plan for drawing a cylindrical shell: blank diameter from the shell diameter, height, corner radius and any flange (as the shell blank tool), the diameter after each draw from your first and later drawing ratios (as the draw reductions tool), the drawing force for each draw by the handbook-style formula F = π d t UTS (D ÷ d − 0.7) (as the deep draw force tool), the blank-holder force on the flange annulus at your holding pressure, and the press check for the heaviest draw.",
    "uses": [
      "Plan the draws and tooling for a drawn shell",
      "Choose a press for a deep-drawn part",
      "See how the drawing ratios change the number of draws"
    ],
    "users": [
      "Press tool designers",
      "Sheet-metal engineers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "d": "Mean diameter of the finished shell.",
      "h": "Height of the finished shell.",
      "r": "Corner radius at the bottom of the shell.",
      "flange": "Outside diameter of a flange left on the shell (0 for no flange).",
      "t": "Sheet thickness.",
      "uts": "Tensile strength of the sheet.",
      "m1": "Largest reduction in the first draw as a ratio of cup to blank diameter (your value for the material; lower is more severe).",
      "m2": "Ratio for each redraw (your value for the material and annealing).",
      "pBH": "Pressure on the flange from the blank holder (your value; roughly 1–3 MPa for steel, less for aluminium).",
      "rd": "Radius of the die entry, which sets the inner edge of the flange under the holder.",
      "press": "Rated capacity of the press."
    },
    "outputs": [
      "Blank diameter and first drawing ratio",
      "Diameter and force for each draw",
      "Blank-holder force and press check"
    ],
    "method": [
      "Blank D = √(d_f² + 4 d h − 0.5 r d), with d_f the flange diameter or d (as the shell blank tool).",
      "Draw diameters: d₁ = max(m₁ D, d), then dₙ = max(m₂ dₙ₋₁, d) until the shell diameter is reached.",
      "Drawing force Fₙ = π dₙ t UTS (dₙ₋₁ ÷ dₙ − 0.7) with d₀ = D (as the deep draw force tool).",
      "Blank-holder force = p_BH × π ÷ 4 × [dₙ₋₁² − (dₙ + 2r_d)²] where positive; press load = drawing + holder force.",
      "Example: a 60 × 50 mm shell needs a 124.42 mm blank and 2 draws; the first draw takes 101.83 kN with the holder."
    ],
    "limitations": [
      "Thin-wall cups without ironing; ironing and tapered shells need other formulas.",
      "Drawing ratios are material- and lubricant-dependent: use your proven values.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the first draw is close to the press capacity, a lower blank-holder pressure or a larger first ratio helps."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1353–1361. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "broaching-plan": {
    "purpose": "Plan of an internal or surface broaching operation: tooth pitch from chip space and machine capacity (as the broach pitch tool), teeth engaged at once, the cutting force from the rise per tooth, width of cut and specific cutting resistance, the number of cutting teeth for the stock plus finishing teeth, the toothed length and stroke, and the floor-to-floor time from cutting and return speeds.",
    "uses": [
      "Lay out a broach for a keyway, spline or flat",
      "Check a broaching machine’s pull and stroke",
      "Estimate broaching cycle time"
    ],
    "users": [
      "Tool designers",
      "Process planners",
      "Manufacturing engineers"
    ],
    "inputs": {
      "L": "Length of the surface being broached in the direction of travel.",
      "stock": "Total depth of material removed.",
      "rise": "Increase in height from one cutting tooth to the next.",
      "fin": "Number of teeth at the end with no rise, for size and finish.",
      "b": "Width cut by each tooth.",
      "kc": "Resistance per unit chip area for the material at broaching chip thicknesses (your value).",
      "Fp": "Ratio of gullet space to chip volume the tooth must hold (about 3–5).",
      "cap": "Pull or push capacity of the broaching machine.",
      "appr": "Extra stroke for approach and clearance.",
      "strokeMax": "Longest stroke the machine allows.",
      "v": "Cutting speed of the broach.",
      "vr": "Return speed.",
      "load": "Time to load and unload a part."
    },
    "outputs": [
      "Tooth pitch and teeth engaged",
      "Cutting force against the machine",
      "Broach length, stroke and time per part"
    ],
    "method": [
      "Pitch from chip space p = 3√(L × rise × F_p); pitch for capacity p = rise × L × b × k_c ÷ (9810 × capacity); the larger (and at least 5 mm) is used (as the broach pitch tool).",
      "Teeth engaged at most = ⌈L ÷ p⌉; force = teeth engaged × rise × b × k_c.",
      "Cutting teeth = stock ÷ rise (rounded up); toothed length = (cutting + finishing teeth) × p; stroke = toothed length + L + approach.",
      "Time = stroke ÷ v + stroke ÷ v_return + load time.",
      "Example: a 9.4868 mm pitch keeps 6 teeth cutting at 12 kN; the broach is 322.55 mm long and a part takes 0.38505 min."
    ],
    "limitations": [
      "Constant rise per tooth; progressive and rotor-cut broaches differ.",
      "Cutting resistance depends strongly on material, rise and sharpness.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A finer pitch puts more teeth in the cut, raising force but improving guidance and finish."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 980–990. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shaft-critical-speed-check": {
    "purpose": "First whirling (critical) speed of a simply supported shaft carrying up to three concentrated masses: the shaft’s own critical speed and each mass’s critical speed from its static deflection, combined by Dunkerley’s formula (a lower, conservative estimate; for one central mass it equals the critical speed tool), a Rayleigh estimate for the masses from their static deflection curve, and the running speed checked against your margin.",
    "uses": [
      "Check a fan or pump shaft with several impellers",
      "Find whether a speed increase approaches resonance",
      "Compare bearing spans for a line shaft"
    ],
    "users": [
      "Design engineers",
      "Rotating equipment engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Diameter of the shaft (uniform).",
      "L": "Distance between the two bearings (simple supports).",
      "E": "Elastic modulus of the shaft.",
      "rho": "Density of the shaft material.",
      "m1": "First disc, pulley or impeller mass.",
      "a1": "Its distance from the left bearing.",
      "m2": "Second mass (0 if none).",
      "a2": "Its distance from the left bearing.",
      "m3": "Third mass (0 if none).",
      "a3": "Its distance from the left bearing.",
      "rpm": "Operating speed.",
      "margin": "Separation you want between running speed and the critical speed."
    },
    "outputs": [
      "Shaft-alone and single-mass critical speeds",
      "Dunkerley and Rayleigh critical speeds",
      "Running speed against the margin"
    ],
    "method": [
      "Shaft alone ω_s = (π ÷ L)² √(EI ÷ ρA).",
      "Each mass alone: influence coefficient α = a² b² ÷ (3EIL), ω_i = 1 ÷ √(m_i α).",
      "Dunkerley 1 ÷ ω² = 1 ÷ ω_s² + Σ 1 ÷ ω_i² (conservative).",
      "Rayleigh (masses only) ω² = g Σ m y ÷ Σ m y² using the static deflections y at the masses.",
      "Example: the shaft whirls at about 965.78 rpm (Dunkerley); running at 600 rpm is 62.126% of it."
    ],
    "limitations": [
      "Simple supports and a uniform shaft; overhangs and stepped shafts need a fuller model.",
      "Bearing and housing flexibility lower the real critical speed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Dunkerley under-predicts and Rayleigh over-predicts: the true first critical lies between them."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 197, 302. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "geneva-drive-design": {
    "purpose": "Dynamic check of an external Geneva indexing drive: crank radius, index and dwell times and peak wheel speed (as the Geneva mechanism tool), the wheel’s angular velocity and acceleration through the indexing stroke found point by point, the torque to accelerate the wheel and load inertia plus friction, the force on the roller in the slot, and the driver torque by power balance, checked against your roller and drive ratings.",
    "uses": [
      "Size the drive for a Geneva index table",
      "Check the roller and slot loads",
      "Compare slot numbers for smoother indexing"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "n": "Number of slots in the Geneva wheel (indexes per turn).",
      "C": "Distance between the driver and wheel centres.",
      "rpm": "Speed of the driving crank (one index per turn).",
      "roller": "Diameter of the drive roller.",
      "J": "Inertia of the wheel, table and load about the wheel axis.",
      "Tf": "Friction torque resisting the wheel.",
      "Fallow": "Allowable load on the roller and its pin (your value from the bearing or pin rating).",
      "Td": "Torque rating of the gearbox or motor driving the crank."
    },
    "outputs": [
      "Geometry, timing and peak wheel speed",
      "Peak angular acceleration and wheel torque",
      "Roller force and driver torque"
    ],
    "method": [
      "λ = sin(π ÷ n); crank radius a = λC; index angle of the driver 180° − 360° ÷ n (as the Geneva mechanism tool).",
      "With crank angle θ from the line of centres: ω_w ÷ ω = λ(cos θ − λ) ÷ (1 − 2λ cos θ + λ²); α_w ÷ ω² = λ(λ² − 1) sin θ ÷ (1 − 2λ cos θ + λ²)².",
      "Wheel torque = J |α_w| + T_f; roller force = wheel torque ÷ (C √(1 − 2λ cos θ + λ²)); driver torque = wheel torque × ω_w ÷ ω, each taken at its peak through the stroke.",
      "Example: a 4-slot wheel at 60 rpm peaks at 213.46 rad/s²; the roller sees 352.16 N and the driver needs 21.746 N·m."
    ],
    "limitations": [
      "Rigid parts and no clearance; impact at roller entry is not included.",
      "Friction treated as constant.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More slots lower the acceleration for the same index time but leave a shorter dwell."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "friction-grip-joint": {
    "purpose": "Check of a friction-grip (slip-resistant) bolted joint in shear: bolt stress area and preload as a share of proof load with the tightening torque (as the bolt torque–preload tool), clamp force left after any applied tension per bolt, slip resistance from the friction coefficient and number of faying surfaces with your slip safety factor, and the bearing-type backup check of bolt shear and plate bearing if the joint slips (as the bolt and pin shear tool).",
    "uses": [
      "Design a slip-resistant splice or bracket connection",
      "Check a joint that must not move under reversing loads",
      "Find the tightening torque for the clamp needed"
    ],
    "users": [
      "Structural engineers",
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "n": "Number of bolts sharing the shear.",
      "d": "Nominal bolt diameter.",
      "P": "Thread pitch.",
      "Sp": "Proof strength of the bolt grade (for example about 600 MPa for 8.8, 830 for 10.9).",
      "pct": "Preload as a share of the proof load.",
      "K": "Nut factor for the thread condition (about 0.2 dry steel, 0.15 lubricated).",
      "mu": "Slip coefficient of the prepared faying surfaces (your value from the surface class).",
      "planes": "Number of contact surfaces the shear crosses (1 for a lap joint, 2 for a double cover plate).",
      "SFs": "Factor you require against slip.",
      "V": "Shear force on the whole joint.",
      "Ft": "External tension per bolt, which reduces clamp force.",
      "t": "Thinnest plate the bolts bear on if the joint slips.",
      "tauA": "Allowable shear stress of the bolt for the bearing-type backup.",
      "bA": "Allowable bearing stress of the plate."
    },
    "outputs": [
      "Preload and tightening torque",
      "Slip resistance against the shear load",
      "Bearing-type backup if slip occurs"
    ],
    "method": [
      "Stress area A_s = π ÷ 4 (d − 0.9382P)²; preload F_p = share × S_p A_s; torque T = K F_p d (as the bolt torque–preload tool).",
      "Clamp left per bolt = F_p − F_t (applied tension taken fully off the clamp, conservative).",
      "Slip resistance = n × planes × μ × clamp ÷ slip factor.",
      "Backup: bolt shear τ = V ÷ (n × planes × π d² ÷ 4); bearing σ = V ÷ (n d t) (as the bolt and pin shear tool).",
      "Example: 4 M16 bolts at 75% proof clamp 70.501 kN each and resist 67.681 kN against 40 kN; torque 225.6 N·m."
    ],
    "limitations": [
      "Nut factor scatter makes torque-controlled preload uncertain by ±25% or more.",
      "Structural friction-grip joints must follow the steel code for bolt grade, surface class and inspection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Surface preparation sets the slip coefficient: blasted, unpainted surfaces grip far better than painted ones."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535, 1720–1735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "flexible-coupling-selection": {
    "purpose": "Selection check of a flexible shaft coupling: running torque from power and speed, torque with the service factor against the coupling’s nominal rating, starting or peak torque against its maximum rating, speed, the combined misalignment as the sum of angular, parallel and axial shares of their allowances, bore against the largest bore, and the hub key stresses (as the key stress tool).",
    "uses": [
      "Choose a coupling size for a motor and pump",
      "Check whether measured misalignment is acceptable",
      "Check that the bore and key carry the torque"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P": "Power transmitted.",
      "n": "Speed of the coupling.",
      "SF": "Service factor for the driver and driven machine (from the coupling maker).",
      "kpk": "Starting or peak torque as a multiple of running torque (motor starting torque, shock).",
      "Tn": "Nominal (continuous) torque rating of the coupling.",
      "Tmax": "Maximum (peak) torque rating of the coupling.",
      "nmax": "Maximum speed rating of the coupling.",
      "ang": "Measured or expected angular misalignment.",
      "angA": "Allowed angular misalignment for the coupling size.",
      "par": "Measured or expected parallel offset.",
      "parA": "Allowed parallel offset.",
      "ax": "Measured or expected axial displacement.",
      "axA": "Allowed axial displacement.",
      "d": "Diameter of the shaft in the hub.",
      "dmax": "Largest bore the hub accepts.",
      "w": "Key width.",
      "h": "Key height.",
      "Lh": "Key length engaged in the hub.",
      "tauA": "Allowable shear stress of the key.",
      "sigA": "Allowable crushing stress of the key or keyway."
    },
    "outputs": [
      "Running, service and peak torques against the ratings",
      "Speed and combined misalignment",
      "Bore and key checks"
    ],
    "method": [
      "Running torque T = P ÷ ω; required nominal = T × SF; peak = T × peak factor.",
      "Combined misalignment = angular ÷ allowed + parallel ÷ allowed + axial ÷ allowed (keep the sum at or below 100%).",
      "Key force F = 2 T SF ÷ d; shear τ = F ÷ (w L); crushing σ = F ÷ (h ÷ 2 × L) (as the key stress tool).",
      "Example: 15 kW at 1460 rpm needs 147.16 N·m nominal against 200 N·m; misalignment uses 80% of the allowance."
    ],
    "limitations": [
      "The combined misalignment rule is a common simplification; follow the maker’s own interaction chart.",
      "Torsional vibration and resonance need a separate check for engines and variable-speed drives.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Misalignment, not torque, is the usual reason flexible couplings wear out early."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 302–304, 2460–2486. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "punching-operation-plan": {
    "purpose": "Plan of a piercing or blanking operation: cut perimeter for a round or rectangular punch, cutting force with a factor for tool wear (as the punching force tool), stripping force as a share of it, total press load for the punches working together, compressive stress in the punch against your allowable and the smallest round punch for the thickness, die clearance per side from your percentage of thickness, the die opening, and the energy per hit from the penetration before breakthrough.",
    "uses": [
      "Size a press for a piercing tool",
      "Check a small punch for crushing",
      "Set die clearance for a material thickness"
    ],
    "users": [
      "Press tool designers",
      "Sheet-metal engineers",
      "Press operators"
    ],
    "inputs": {
      "shape": "Round or rectangular punch.",
      "dp": "Diameter of a round punch.",
      "a": "Length of a rectangular punch.",
      "bb": "Width of a rectangular punch.",
      "nh": "Number of punches that cut at the same moment.",
      "t": "Sheet thickness.",
      "tau": "Shear strength of the sheet (often about 0.7–0.8 of tensile strength).",
      "factor": "Allowance for punch and die wear (as in the punching force tool).",
      "strip": "Force to strip the sheet off the punch as a share of the cutting force (your value; typically 5–20%).",
      "sigA": "Allowable compressive stress for the punch steel and hardness (your value).",
      "clr": "Clearance between punch and die on each side as a share of thickness (your value for the material and edge quality).",
      "pen": "Share of the thickness the punch enters before the slug breaks out.",
      "press": "Rated capacity of the press."
    },
    "outputs": [
      "Cutting, stripping and total press force",
      "Punch stress and smallest round punch",
      "Clearance, die opening and energy"
    ],
    "method": [
      "Perimeter: π d (round) or 2(a + b) (rectangular); cutting force F = perimeter × t × τ × wear factor (as the punching force tool).",
      "Stripping = share × F; press load = (F + stripping) × punches.",
      "Punch stress = F ÷ punch area; smallest round punch d_min = 4 t τ × factor ÷ σ_allow.",
      "Clearance per side = share × t; die opening = punch + 2 × clearance; energy per hit ≈ F × penetration × t.",
      "Example: a 20 mm hole in 2 mm sheet takes 45.239 kN plus 4.5239 kN stripping; the punch runs at 144 MPa."
    ],
    "limitations": [
      "Flat-faced punches; shear angles on the punch or die lower the peak force.",
      "Clearance shares vary by material and the edge quality wanted.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When the punch diameter nears the sheet thickness, the punch itself becomes the weak link."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1338–1346. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "toggle-clamp-design": {
    "purpose": "Design check of a symmetric toggle clamp driven by a pneumatic cylinder: cylinder push force from bore, pressure and efficiency (as the pneumatic cylinder force tool), the toggle output force and link force at the clamping angle (as the toggle joint tool), the angle at which the required clamping force is reached, the output travel left from that angle to straight, the input travel, and the link stress against your allowable.",
    "uses": [
      "Design a pneumatic toggle clamp for a fixture",
      "Find the angle to set for a clamping force",
      "Check the links of a toggle press"
    ],
    "users": [
      "Fixture designers",
      "Automation engineers",
      "Machine designers"
    ],
    "inputs": {
      "bore": "Bore of the pneumatic cylinder driving the toggle joint.",
      "p": "Supply pressure.",
      "eff": "Share of the theoretical force delivered after seal friction.",
      "ang": "Angle of each link from the straight (dead-centre) line when the clamp closes on the part.",
      "Rreq": "Clamping force needed on the part.",
      "L": "Length of each toggle link (pin to pin).",
      "A": "Smallest cross-section of a link.",
      "sA": "Allowable stress of the link material (your design value)."
    },
    "outputs": [
      "Cylinder force",
      "Clamping and link forces at the angle",
      "Angle for the required force, travels and link stress"
    ],
    "method": [
      "Cylinder force F = p × π D² ÷ 4 × efficiency (as the pneumatic cylinder force tool).",
      "Toggle output R = F ÷ (2 tan α); link force = F ÷ (2 sin α) (as the toggle joint tool).",
      "Angle for the required force α = tan⁻¹[F ÷ (2R_req)].",
      "Output travel from α to straight = 2L(1 − cos α); input travel = L sin α; link stress = link force ÷ area.",
      "Example: a 50 mm cylinder at 6 bar gives 6.0596 kN at 5°; the required 5 kN is reached at 6.0524°."
    ],
    "limitations": [
      "Rigid, frictionless links: near the straight position, elasticity and pin clearance set the real force.",
      "Symmetric toggle with equal links.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Clamping force rises steeply as the links straighten, so small part-size changes alter the clamp force a lot."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 172–174. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cylindrical-grinding-planner": {
    "purpose": "Plan of an external traverse cylindrical grinding operation: wheel surface speed against the wheel’s marked maximum, work speed from the work surface speed, speed ratio, equivalent diameter and contact length (as the grinding geometry tool), traverse rate from the share of wheel width per work revolution, removal rate and grinding power from your specific grinding energy, and passes and time for the stock with spark-out (as the grinding cycle time tool).",
    "uses": [
      "Plan a cylindrical grinding operation",
      "Check spindle power and wheel speed",
      "Estimate grinding time for a shaft diameter"
    ],
    "users": [
      "Grinding machinists",
      "Process planners",
      "Manufacturing engineers"
    ],
    "inputs": {
      "ds": "Diameter of the grinding wheel.",
      "ns": "Wheel spindle speed.",
      "vsMax": "Maximum operating speed marked on the wheel; never exceed it.",
      "dw": "Diameter of the work.",
      "vw": "Surface speed of the work.",
      "bw": "Width of the grinding wheel.",
      "frac": "Axial traverse per work revolution as a share of wheel width (about 1/2–2/3 roughing, 1/4–1/3 finishing).",
      "Lw": "Length of the ground diameter.",
      "ae": "Infeed per pass on the radius.",
      "stock": "Total stock on the radius.",
      "spark": "Passes without infeed at the end.",
      "u": "Specific energy to grind the material with this wheel (your value).",
      "Pm": "Rated power of the wheel spindle motor.",
      "eta": "Share of motor power available at the wheel."
    },
    "outputs": [
      "Wheel and work speeds, speed ratio, contact length",
      "Traverse rate, removal rate and power",
      "Passes and grinding time"
    ],
    "method": [
      "Wheel speed v_s = π d_s n_s ÷ 60 000; work speed n_w = 1000 v_w ÷ (π d_w); speed ratio = v_s ÷ v_w.",
      "Equivalent diameter D_e = d_s d_w ÷ (d_s + d_w); contact length l_g = √(a_e D_e) (as the grinding geometry tool).",
      "Traverse rate = share × b × n_w; removal rate Q = π d_w a_e × traverse rate; power = u Q.",
      "Passes = stock ÷ a_e (rounded up) + spark-out; time = passes × (L + b) ÷ traverse rate (as the grinding cycle time tool).",
      "Example: the wheel runs at 33.51 m/s; traversing at 1,909.9 mm/min removes 50 mm³/s with 1.5 kW; the job takes 1.1938 min."
    ],
    "limitations": [
      "External traverse grinding; plunge and internal grinding differ.",
      "Specific energy varies strongly with wheel sharpness and depth of cut.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A finer traverse improves finish and roundness but lengthens every pass."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1199–1268. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
