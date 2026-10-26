// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook44).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "gyroscopic-bearing-load": {
    "purpose": "Bearing loads on a rotor whose axis is turned while it spins (a vehicle turning, a swinging boom or a rotating platform): rotor inertia for a disc, a ring or an entered value, angular momentum, the precession rate from a turn radius and speed or from an entered turning speed, the gyroscopic couple and the equal and opposite bearing reactions over the bearing span (as the gyroscope precession tool), the static weight share on each bearing, and the largest bearing load against your allowable.",
    "uses": [
      "Check bearings of a flywheel or fan on a vehicle or crane",
      "Find the extra bearing load on a turning machine",
      "Compare rotor speeds for gyroscopic load"
    ],
    "users": [
      "Design engineers",
      "Vehicle engineers",
      "Machine designers"
    ],
    "inputs": {
      "shape": "How the rotor inertia is found.",
      "M": "Mass of the rotor (also used for its weight on the bearings).",
      "R": "Outer radius of the disc or ring.",
      "J": "Polar inertia of the rotor if entered directly.",
      "ns": "Spin speed of the rotor.",
      "pmode": "Whether the axis turns because the vehicle turns, or at a given turning speed.",
      "vt": "Speed of the vehicle round the turn.",
      "Rt": "Radius of the turn.",
      "np": "Turning speed of the rotor axis.",
      "L": "Distance between the two bearings of the rotor.",
      "allow": "Allowable radial load per bearing (from the bearing rating and your life requirement)."
    },
    "outputs": [
      "Inertia, angular momentum and precession rate",
      "Gyroscopic couple and bearing reactions",
      "Largest bearing load against the allowable"
    ],
    "method": [
      "Disc J = M R² ÷ 2; ring J = M R²; angular momentum H = J ω_s (as the gyroscope precession tool).",
      "Precession rate Ω = v ÷ R_turn for a turning vehicle, or 2π n_p ÷ 60.",
      "Gyroscopic couple T = H Ω; bearing reaction = T ÷ L, adding to one bearing and subtracting from the other; static share = M g ÷ 2.",
      "Example: the couple is 62.832 N·m, adding 209.44 N to one bearing; the most loaded bearing carries 307.51 N."
    ],
    "limitations": [
      "Steady precession with the spin and precession axes at right angles.",
      "Rotor unbalance and shock loads must be added separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Gyroscopic load rises with both spin speed and turning rate: a faster rotor on a tighter turn sees much more."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2998. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "centrifugal-attachment-check": {
    "purpose": "Check of a mass bolted to a rotating arm, hub or drum: centrifugal force at the running speed (as the centrifugal force tool), the force at your overspeed factor, the tension per bolt for bolts loaded radially, the bolt stress on the thread stress area, the safety factor against the allowable, and the speed at which the bolts would reach the allowable.",
    "uses": [
      "Check the bolts on a counterweight, beater or blade",
      "Set an overspeed trip for a rotating attachment",
      "Choose bolt size for a rotor fitting"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Safety engineers"
    ],
    "inputs": {
      "mass": "Mass of the part held by the bolts.",
      "r": "Radius from the axis to the part’s centre of gravity.",
      "rpm": "Normal running speed.",
      "os": "Highest speed the rotor can reach as a multiple of running speed (governor or trip setting).",
      "nb": "Number of bolts sharing the outward pull.",
      "d": "Bolt diameter.",
      "P": "Thread pitch.",
      "allow": "Allowable tensile stress in the bolts (your value; allow for preload and fatigue)."
    },
    "outputs": [
      "Centrifugal force at running and overspeed",
      "Load and stress per bolt",
      "Safety factor and limiting speed"
    ],
    "method": [
      "F = m ω² r (as the centrifugal force tool); at overspeed F × factor².",
      "Load per bolt = F ÷ bolts; stress = load ÷ A_s with A_s = π ÷ 4 (d − 0.9382P)².",
      "Speed at the allowable = running speed × √(allowable ÷ running stress).",
      "Example: 2 kg at 150 mm pulls 7,402.2 N at 1500 rpm and 10,659 N at overspeed, 72.792 MPa in each bolt."
    ],
    "limitations": [
      "Bolts loaded in pure tension; shear and bending from acceleration need separate checks.",
      "The rotor itself must be checked for the overspeed too.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Force rises with the square of speed: a 20% overspeed gives 44% more pull."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 187–190, 1521–1535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ratchet-pawl-design": {
    "purpose": "Design of a ratchet and pawl holding a torque: circular pitch at the outside diameter by the handbook crane-ratchet rule and the outside diameter (as the ratchet wheel pitch tool), the tooth force at the outside diameter, the bearing stress where the pawl tip meets the tooth face, and the shear stress in the pawl pivot pin, against your allowables.",
    "uses": [
      "Design a ratchet backstop for a winch or hoist",
      "Check a pawl pin for a higher torque",
      "Choose tooth count and width for a ratchet"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "M": "Torque the ratchet must hold.",
      "L": "Width of the teeth (and of the pawl tip).",
      "S": "Safe stress used in the handbook ratchet rule for the material (your value; low values for cast iron).",
      "Nt": "Number of teeth on the ratchet wheel.",
      "h": "Depth of the tooth face the pawl tip bears on.",
      "bA": "Allowable bearing (contact) stress between pawl and tooth.",
      "dp": "Diameter of the pin the pawl pivots on.",
      "planes": "Whether the pin is in single or double shear.",
      "tA": "Allowable shear stress of the pin."
    },
    "outputs": [
      "Pitch and outside diameter",
      "Tooth force and face bearing stress",
      "Pawl pin shear stress"
    ],
    "method": [
      "Circular pitch P = √[F M ÷ (L S N)] with the tooth-number factor F (as the ratchet wheel pitch tool); outside diameter D = P N ÷ π.",
      "Tooth force at the outside = 2M ÷ D; bearing stress = force ÷ (L h).",
      "Pin shear = force ÷ (planes × π d² ÷ 4).",
      "Example: a 16-tooth wheel needs a 29.58 mm pitch (150.65 mm outside); the pawl takes 2,655.1 N."
    ],
    "limitations": [
      "Static holding torque; shock engagement can multiply the load several times.",
      "Pawl body bending is not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "More teeth give finer engagement but a smaller pitch: the face width must grow to keep the bearing stress down."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2215–2217, 1535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "torsion-member-comparison": {
    "purpose": "Side-by-side check of three shaft or link sections under the same torque: a solid round bar and a round tube by the exact polar moment (as the shaft torsion tool), and a solid rectangle by the handbook rectangular-section formulas (as the rectangular bar torsion tool), giving shear stress, twist over the length, twist per metre and mass per metre, with the chosen section checked against your allowable stress and twist limit.",
    "uses": [
      "Choose a section for a torque tube or drive link",
      "Show the weight saved by a tube",
      "Check a rectangular bar used as a torsion member"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Structural engineers"
    ],
    "inputs": {
      "T": "Torque applied.",
      "L": "Length between the torque inputs.",
      "G": "Shear modulus of the material.",
      "rho": "Density for the mass per metre.",
      "allow": "Allowable shear stress (your design value).",
      "twMax": "Largest twist per metre of length you accept (stiffness requirement).",
      "sel": "Which section to check.",
      "d": "Diameter of the solid bar.",
      "Do": "Outside diameter of the tube.",
      "t": "Wall thickness of the tube.",
      "b": "Longer side of the rectangle.",
      "c": "Shorter side of the rectangle."
    },
    "outputs": [
      "Stress, twist and mass for each section",
      "Chosen section checks",
      "Lightest section that passes"
    ],
    "method": [
      "Round sections: J = π (D⁴ − d⁴) ÷ 32; τ = T (D ÷ 2) ÷ J; twist = T L ÷ (G J) (as the shaft torsion tool).",
      "Rectangle: τ = T (3b + 1.8c) ÷ (b² c²); K = b c³ [⅓ − 0.21 (c ÷ b)(1 − c⁴ ÷ 12b⁴)]; twist = T L ÷ (K G) (as the rectangular bar torsion tool).",
      "Mass per metre = density × area.",
      "Example: solid 37.726 MPa, tube 33.296 MPa, rectangle 48.75 MPa; the tube weighs 2.7374 kg/m against 5.5488 for the bar."
    ],
    "limitations": [
      "Elastic, uniform torsion away from ends and fittings; warping of open sections is not covered.",
      "Stress concentrations at keyways and holes are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Open and rectangular sections are poor in torsion; closed round tubes give the most stiffness per kilogram."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "inertia-matching-ratio": {
    "purpose": "Gear ratio selection for accelerating a load inertia: reflected inertia, inertia ratio, motor speed, acceleration torque, load torque at the motor and peak motor torque at your chosen ratio (as the reflected inertia tool), the ratio that minimises acceleration torque (load inertia reflected equal to the motor inertia), the best ratio allowed by the motor’s top speed, the motor torque at that ratio, and checks of the chosen ratio against the motor speed and peak torque.",
    "uses": [
      "Choose a gearbox ratio for a servo axis or indexer",
      "See how far a ratio is from the optimum",
      "Check a motor’s peak torque at the ratio"
    ],
    "users": [
      "Automation engineers",
      "Machine designers",
      "Controls engineers"
    ],
    "inputs": {
      "JL": "Inertia of the load at the gearbox output.",
      "Jm": "Inertia of the motor rotor (and brake).",
      "i": "Gear ratio being considered.",
      "eff": "Gearbox efficiency.",
      "nL": "Speed the load must reach.",
      "t": "Time to reach it.",
      "TL": "Steady load torque at the output.",
      "nmMax": "Highest motor speed.",
      "Tpk": "Peak torque the motor and drive can give."
    },
    "outputs": [
      "Reflected inertia, ratio and motor torque at the chosen ratio",
      "Optimum and best usable ratio",
      "Speed and torque checks"
    ],
    "method": [
      "Reflected inertia J_r = J_L ÷ (i² η); motor speed = n_L i; α = 2π n_m ÷ (60 t) (as the reflected inertia tool).",
      "Motor torque T(i) = (J_m + J_r) α + T_L ÷ (i η).",
      "Optimum ratio for acceleration i_opt = √[J_L ÷ (η J_m)]; best usable ratio = min(i_opt, n_max ÷ n_L).",
      "Example: at 10:1 the motor needs 9.5805 N·m; the optimum would be 43.033:1 but the motor speed allows 20:1, needing 5.3558 N·m."
    ],
    "limitations": [
      "Constant acceleration and rigid transmission; compliance and backlash change real tuning.",
      "Load torque is taken as constant during acceleration.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Near the optimum ratio the torque curve is flat: a ratio within ±30% of it costs little extra torque."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 180–186, 2569–2580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-preload-verification": {
    "purpose": "Verification of bolt tightening from a measured elongation: bolt stiffness from shank and thread lengths and the member stiffness (as the bolt stretch tool), preload from the measured stretch, deviation from the target preload as a share of proof load, the nut factor implied by the applied torque (as the torque–preload relation of the bolt torque–preload tool), the torque that would give the target with that nut factor, and the turn angle that corresponds to the preload.",
    "uses": [
      "Check critical bolts after tightening",
      "Calibrate a tightening torque from stretch measurements",
      "Find the real nut factor for a lubricant"
    ],
    "users": [
      "Maintenance engineers",
      "Design engineers",
      "Quality inspectors"
    ],
    "inputs": {
      "d": "Nominal bolt diameter.",
      "P": "Thread pitch.",
      "grip": "Total thickness clamped.",
      "Lt": "Thread length within the grip.",
      "Eb": "Elastic modulus of the bolt.",
      "Em": "Elastic modulus of the clamped parts.",
      "Sp": "Proof strength of the bolt grade.",
      "pct": "Preload you aimed for as a share of proof load.",
      "tol": "Plus-or-minus deviation from the target you accept.",
      "dl": "Elongation of the bolt measured (ultrasonically or by micrometer) between loose and tight.",
      "Tq": "Torque applied to reach that stretch."
    },
    "outputs": [
      "Bolt stiffness and preload from the stretch",
      "Deviation from target",
      "Implied nut factor, torque for the target and turn angle"
    ],
    "method": [
      "k_b = 1 ÷ [(grip − L_t) ÷ (E A_d) + L_t ÷ (E A_t)]; preload F = k_b × stretch (as the bolt stretch tool).",
      "Target F_t = share × S_p A_t; deviation = (F − F_t) ÷ F_t.",
      "Nut factor K = T ÷ (F d); torque for the target = K F_t d (as the bolt torque–preload tool); turn angle = 360° (δ_bolt + δ_member) ÷ P.",
      "Example: 0.15 mm of stretch means 113.87 kN (3.3672% from target); the torque implies K = 0.21077."
    ],
    "limitations": [
      "Elastic stretch only; the measurement must exclude temperature change and bending.",
      "Stiffness uses the simplified shank-and-thread model; the nut and head add a little compliance.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If K is well above the assumed value, the lubricant or thread condition is soaking up torque: preload will be low."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spindle-speed-range-design": {
    "purpose": "Design of a stepped spindle speed range for a machine tool: lowest and highest speeds needed from the work diameter range and cutting speed range, the geometric step ratio for the number of speeds (as the speed series tool), the nearest preferred-number series, the largest cutting speed loss between neighbouring speeds, the number of speeds needed for your largest acceptable loss, and the list of speeds.",
    "uses": [
      "Lay out the speeds of a lathe or drill gearbox",
      "Check whether a stepped drive is fine enough",
      "Compare the speed loss of 12 and 18 speeds"
    ],
    "users": [
      "Machine tool designers",
      "Manufacturing engineers",
      "Process planners"
    ],
    "inputs": {
      "dmin": "Smallest diameter machined (with the highest cutting speed).",
      "dmax": "Largest diameter machined (with the lowest cutting speed).",
      "vmin": "Lowest cutting speed needed (tough materials, large diameters).",
      "vmax": "Highest cutting speed needed.",
      "z": "Number of spindle speeds the gearbox gives.",
      "lossMax": "Largest loss of cutting speed you accept when the ideal speed falls between two steps."
    },
    "outputs": [
      "Lowest and highest spindle speeds",
      "Step ratio and nearest preferred series",
      "Speed loss and speeds needed"
    ],
    "method": [
      "n_min = 1000 v_min ÷ (π d_max); n_max = 1000 v_max ÷ (π d_min); range R = n_max ÷ n_min.",
      "Step ratio φ = R^(1/(z − 1)) (as the speed series tool); largest loss = 1 − 1 ÷ φ.",
      "Speeds needed for a loss limit: z = 1 + ln R ÷ ln[1 ÷ (1 − loss)], rounded up.",
      "Example: 95.493–4,774.6 rpm in 18 speeds gives φ = 1.2587 (nearest R10) and up to 20.556% speed loss."
    ],
    "limitations": [
      "Constant step ratio; many gearboxes merge or overlap steps at the ends.",
      "Cutting speed limits only; power and torque limits at low speed need their own check.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Ratios of 1.26 (R10) suit general turning; 1.12 (R20) suits production machines where speed loss costs tool life."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 37–39. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "vacuum-tube-design": {
    "purpose": "Design of a long round tube or cylindrical shell under external pressure or vacuum: elastic collapse pressure and the yield-limited pressure for the wall left after corrosion allowance, the governing mode and safety factor (as the tube collapse tool), the least wall that gives your required factor (found by search) plus allowance, the diameter-to-thickness ratio and the mass per metre.",
    "uses": [
      "Size a vacuum pipe or vessel shell",
      "Check a heat-exchanger tube for shell-side pressure",
      "Check a submerged pipe"
    ],
    "users": [
      "Mechanical engineers",
      "Design engineers",
      "Inspection engineers"
    ],
    "inputs": {
      "D": "Outside diameter of the tube or shell.",
      "t": "Nominal wall thickness.",
      "ca": "Corrosion allowance removed before the check.",
      "E": "Elastic modulus at temperature.",
      "nu": "Poisson’s ratio.",
      "Sy": "Yield strength at temperature.",
      "p": "Net external pressure (0.1 MPa for full vacuum with atmosphere outside).",
      "req": "Safety factor on collapse you require (often 3 or more for buckling; follow your code).",
      "rho": "Density for the mass per metre."
    },
    "outputs": [
      "Elastic and yield collapse pressures, governing mode and factor",
      "Least wall for the required factor",
      "D/t and mass per metre"
    ],
    "method": [
      "Long tube elastic collapse p_cr = 2E ÷ (1 − ν²) × (t ÷ D_m)³; yield limit p_y = 2 S_y t ÷ D_m, with D_m = D − t and t after corrosion (as the tube collapse tool).",
      "Safety factor = smaller collapse pressure ÷ applied pressure.",
      "Least wall found by bisection on t for the required factor, plus corrosion allowance.",
      "Example: 2 mm (1.5 mm corroded) collapses elastically at 1.5523 MPa, a factor of 3.1047; 1.9832 mm is needed."
    ],
    "limitations": [
      "Long tube without stiffening rings; short shells between stiffeners are stronger.",
      "Out-of-roundness lowers the collapse pressure sharply: keep it within the code limit.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Collapse pressure rises with the cube of the wall ratio: a little more wall or a stiffening ring helps greatly."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 293–294. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "journal-bearing-oil-check": {
    "purpose": "Check of a plain journal bearing with a chosen oil grade: kinematic viscosity at the running temperature from the oil’s two catalogue viscosities by the ASTM D341 relation (as the oil viscosity–temperature tool), dynamic viscosity from the density, then the unit load, Sommerfeld number, Petroff friction torque and power loss (as the Petroff tool), with checks of viscosity against your minimum and of the Sommerfeld number against your limit.",
    "uses": [
      "Choose an oil grade for a plain bearing",
      "Check a bearing after its oil temperature rises",
      "Explain bearing distress after an oil change"
    ],
    "users": [
      "Maintenance engineers",
      "Lubrication engineers",
      "Design engineers"
    ],
    "inputs": {
      "T1": "Temperature of the first catalogue viscosity (usually 40 °C).",
      "v1": "Kinematic viscosity at that temperature (the ISO VG number at 40 °C).",
      "T2": "Temperature of the second catalogue viscosity (usually 100 °C).",
      "v2": "Kinematic viscosity at that temperature.",
      "Top": "Oil temperature in the bearing film when running.",
      "rho": "Density of the oil at the running temperature.",
      "vMin": "Least viscosity you accept for the bearing (from the bearing maker or your practice).",
      "W": "Radial load on the bearing.",
      "d": "Journal diameter.",
      "L": "Bearing length.",
      "c": "Radial clearance.",
      "rpm": "Shaft speed.",
      "Smin": "Smallest Sommerfeld number you accept for a safe film."
    },
    "outputs": [
      "Kinematic and dynamic viscosity at temperature",
      "Sommerfeld number and friction",
      "Viscosity and film checks"
    ],
    "method": [
      "log log(ν + 0.7) = A − B log T (T in K) through the two catalogue points (as the oil viscosity–temperature tool).",
      "Dynamic viscosity μ (mPa·s) = ν (cSt) × ρ ÷ 1000.",
      "S = (r ÷ c)² μ N ÷ p; Petroff torque = 4π² r³ L μ N ÷ c; power loss = 2π N T (as the Petroff tool).",
      "Example: the oil thins to 20.623 cSt (17.942 mPa·s) at 60 °C, giving S = 0.087606 and 54.327 W of friction."
    ],
    "limitations": [
      "Viscosity relation is reliable between and slightly beyond the catalogue points.",
      "Petroff friction for a lightly loaded concentric journal.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Viscosity roughly halves for every 15–20 K rise in a mineral oil: cooling the oil is often better than a thicker grade."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2326–2345. Topic reference; no source tables or recommended settings are reproduced.",
      "ASTM D341 Viscosity–Temperature Charts for Liquid Petroleum Products"
    ]
  }
});
