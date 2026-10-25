// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook27).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "ballscrew-axis-sizing": {
    "purpose": "Sizing of a ball-screw driven axis over a move cycle: screw speed, axial forces while accelerating, running and decelerating, motor torque in each phase from the handbook driving-torque relation plus rotor and screw inertia, RMS torque over the cycle, critical speed and buckling load for the end fixity, cubic-mean load and rating life in hours.",
    "uses": [
      "Choose a ball screw and servo motor for a linear axis",
      "Check an existing axis for a faster cycle",
      "Find whether speed, buckling, torque or life limits the axis"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "m": "Mass of the carriage and load.",
      "mu": "Friction coefficient of the linear guides.",
      "Fx": "Process or external force opposing motion.",
      "v": "Top linear speed.",
      "ta": "Time to reach top speed (the same for stopping).",
      "tc": "Time at constant speed in each move.",
      "tdw": "Stationary time per cycle.",
      "lead": "Screw lead (travel per revolution).",
      "dr": "Root diameter of the screw.",
      "Ls": "Unsupported length between bearings.",
      "ends": "Mounting of the screw ends.",
      "eff": "Ball-screw efficiency (about 90%).",
      "Jm": "Rotor plus coupling inertia.",
      "Ca": "Dynamic load rating of the ball nut.",
      "fw": "Load factor for vibration and shock.",
      "req": "Life you need in hours of this cycle.",
      "speedPct": "Share of critical speed allowed.",
      "loadPct": "Share of buckling load allowed.",
      "E": "Elastic modulus of the screw.",
      "rho": "Density of the screw."
    },
    "outputs": [
      "Screw speed, forces and motor torques",
      "Critical speed and buckling checks",
      "Cubic-mean load and life"
    ],
    "method": [
      "Screw speed n = v ÷ lead; acceleration a = v ÷ t_a; axial force = external + μ m g ± m a.",
      "Drive torque T = F × lead ÷ (2π e) (handbook ball-screw driving torque) plus (J_motor + J_screw) α when accelerating.",
      "RMS torque = √[Σ T² t ÷ cycle time]; critical speed and buckling as the screw-limits tool (same end-fixity factors).",
      "Cubic-mean load weighted by travel; life = (C_a ÷ f_w F_m)³ × 10⁶ revolutions.",
      "Example: 200 kg at 500 mm/s on a 10 mm lead needs 2.3109 N·m peak and 1.0149 N·m RMS."
    ],
    "limitations": [
      "Horizontal axis; vertical axes add the load weight to every phase.",
      "Screw inertia uses the root diameter (slightly low).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If critical speed limits, use a coarser lead, a stiffer end support, or a rotating nut."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2561–2563. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "v-belt-drive-design": {
    "purpose": "Design of an open belt drive: driven pulley size and speed, belt speed, exact pitch length, wrap angle, tension ratio from the friction coefficient and groove angle (Euler), design power with service factor, centrifugal tension, tight and slack side tensions, the number of belts for an allowable tension per belt, and the resultant shaft load.",
    "uses": [
      "Design a V-belt drive for a motor and driven machine",
      "Check the shaft and bearing load from belt tension",
      "Decide whether to add a belt or enlarge the pulleys"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P": "Power to transmit.",
      "n1": "Speed of the driving pulley.",
      "d1": "Pitch diameter of the driving pulley.",
      "ratio": "Driver speed ÷ driven speed (above 1 reduces speed).",
      "C": "Distance between shaft centres.",
      "SF": "Service factor for the driver and driven machine.",
      "groove": "V-belt (wedging in a 38° groove) or flat belt.",
      "mu": "Friction coefficient between belt and pulley.",
      "mass": "Mass per metre of one belt.",
      "Tmax": "Allowable tight-side tension of one belt (from the belt maker’s rating)."
    },
    "outputs": [
      "Driven pulley, belt speed, length and wrap",
      "Tensions and number of belts",
      "Shaft load"
    ],
    "method": [
      "d₂ = d₁ × ratio; v = π d₁ n₁ ÷ 60,000; φ = asin[(d₂ − d₁) ÷ 2C]; length = 2C cos φ + π (d₁ + d₂) ÷ 2 + φ (d₂ − d₁); wrap = 180° − 2φ.",
      "Tension ratio e^(μ′θ), with μ′ = μ ÷ sin 19° for V-belts.",
      "Effective pull F_e = P × SF ÷ v; centrifugal tension T_c = m v²; belts n = ⌈F_e e^(μθ) ÷ (e^(μθ) − 1) ÷ (T_max − T_c)⌉.",
      "Shaft load = n √(t₁² + t₂² + 2 t₁ t₂ cos 2φ) with t = belt tension less centrifugal tension.",
      "Example: 7.5 kW at 1450 rpm on a 125 mm pulley needs 3 belts of 1,704.9 mm."
    ],
    "limitations": [
      "Uses an allowable tension per belt rather than the maker’s power rating tables; check with the belt catalogue.",
      "Open drive with two pulleys.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Larger pulleys raise belt speed and cut tension, often saving a belt."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2487–2536. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "roller-chain-drive-design": {
    "purpose": "Design check of a roller chain drive: sprocket pitch diameters, chain speed, design power with service factor against the per-strand rating and multi-strand factor, working pull and its safety factor on breaking load, chain length rounded to an even number of links, the exact centre distance for it, wrap on the small sprocket and chordal speed variation.",
    "uses": [
      "Select a roller chain for a conveyor or machine drive",
      "Lay out sprockets and centre distance",
      "Check an existing chain against a power increase"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P": "Power transmitted.",
      "n1": "Speed of the small sprocket.",
      "z1": "Teeth on the small sprocket.",
      "z2": "Teeth on the large sprocket.",
      "p": "Chain pitch.",
      "Cp": "Preferred centre distance in pitches (30–50 is common).",
      "SF": "Service factor for the driver and load.",
      "Pr": "Power rating of one strand at the small sprocket speed and tooth count (from the chain maker or standard).",
      "msf": "Factor for multiple strands (from the chain maker).",
      "Fb": "Minimum breaking load of the chain.",
      "kgm": "Mass per metre of the chain."
    },
    "outputs": [
      "Pitch diameters, speeds and chain pull",
      "Rating and breaking-load checks",
      "Chain length, centre distance, wrap and chordal action"
    ],
    "method": [
      "PD = p ÷ sin(180° ÷ z); chain speed v = z₁ p n₁ ÷ 60,000.",
      "Design power = P × SF against rating × multi-strand factor; pull = P ÷ v + m v²; safety factor = breaking load ÷ pull.",
      "Links L = 2C + (z₁ + z₂) ÷ 2 + [(z₂ − z₁) ÷ 2π]² ÷ C, rounded up to even; exact C = p ÷ 4 {L − (z₁ + z₂) ÷ 2 + √[(L − (z₁ + z₂) ÷ 2)² − 8 ((z₂ − z₁) ÷ 2π)²]}.",
      "Chordal speed variation = 1 − cos(180° ÷ z₁).",
      "Example: 5.5 kW at 300 rpm on 19/57 teeth needs 120 links at 643.72 mm centres."
    ],
    "limitations": [
      "Ratings depend on lubrication; the per-strand rating must match your lubrication method.",
      "Two-sprocket drive without idlers.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Small sprockets under 17 teeth run rough and wear fast; more teeth smooth the drive."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2537–2556. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bearing-selection-check": {
    "purpose": "Selection check of a ball or roller bearing: dynamic equivalent load from radial and axial loads, required dynamic rating for the life at the chosen reliability (Weibull reliability factor) and life modification factor, the life of the chosen bearing, static equivalent load and safety factor, and speed against the limiting speed.",
    "uses": [
      "Pick a bearing size for a shaft load and life",
      "Check a bearing against a higher reliability requirement",
      "Confirm static safety for shock loads"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "type": "Ball or roller bearing (life exponent 3 or 10/3).",
      "Fr": "Radial load.",
      "Fa": "Axial load.",
      "X": "Radial load factor for the bearing type and Fa/Fr ratio (from the bearing catalogue).",
      "Y": "Axial load factor (from the catalogue; use X = 1, Y = 0 when Fa/Fr is below e).",
      "n": "Rotational speed.",
      "Lreq": "Life required in hours.",
      "rel": "Required reliability (90% is the basic rating).",
      "basis": "ISO 281:2007 gives slightly higher factors than the older ANSI/ABMA values printed in the handbook; bearing makers now use ISO 281.",
      "aiso": "Life modification factor for lubrication and contamination (from the bearing maker’s method; 1 for basic life).",
      "C": "Dynamic load rating of the chosen bearing.",
      "C0": "Static load rating.",
      "X0": "Static radial factor.",
      "Y0": "Static axial factor.",
      "s0": "Static safety factor required (higher for shock and quiet running).",
      "nlim": "Limiting speed of the bearing with its lubrication."
    },
    "outputs": [
      "Equivalent load and required rating",
      "Life of the chosen bearing",
      "Static safety and speed checks"
    ],
    "method": [
      "P = max(F_r, X F_r + Y F_a); life exponent p = 3 (ball) or 10/3 (roller).",
      "Reliability factor: ANSI/ABMA 1990 a₁ = [ln(1 ÷ R) ÷ ln(1 ÷ 0.9)]^(2/3) (handbook values 0.62 at 95%, 0.21 at 99%); ISO 281:2007 a₁ = 0.95 × that + 0.05 (0.64 at 95%, 0.25 at 99%).",
      "Life L_h = a₁ a_ISO (C ÷ P)^p × 10⁶ ÷ 60n; required C = P [L_h,req 60n ÷ (10⁶ a₁ a_ISO)]^(1/p).",
      "Static: P₀ = max(F_r, X₀ F_r + Y₀ F_a); s₀ = C₀ ÷ P₀.",
      "Example: 4 kN radial and 1.5 kN axial at 1500 rpm need C ≥ 65.568 kN for 20000 h at 95% reliability."
    ],
    "limitations": [
      "X, Y and the life modification factor come from the bearing maker for the exact bearing.",
      "Fatigue life only; wear, lubrication failure and contamination often end bearings sooner.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising reliability from 90% to 99% cuts the expected life to about a fifth."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2365–2422. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "fillet-weld-joint-design": {
    "purpose": "Design of a fillet-welded joint loaded in shear on the throat: the throat and leg size required for the load, weld length and allowable throat stress, the leg used after a minimum size for the plate, utilisation, then weld metal mass, arc time, welder time and cost from deposition rate, operating factor, filler efficiency and rates.",
    "uses": [
      "Size and cost the welds on a bracket or frame",
      "Avoid over-welding that adds cost and distortion",
      "Quote welding labour and consumables"
    ],
    "users": [
      "Fabrication supervisors",
      "Welding engineers",
      "Estimators"
    ],
    "inputs": {
      "F": "Total load the welds carry, treated as shear on the throat.",
      "L": "Total effective length of fillet welds sharing the load.",
      "tau": "Allowable shear stress on the throat for the electrode and code.",
      "amin": "Smallest leg your code permits for the thicker plate joined.",
      "t": "Thickness of the thinner part (a leg larger than this is wasted).",
      "excess": "Extra metal for convexity and overfill.",
      "rho": "Density of the weld metal.",
      "dep": "Deposition rate of the process and wire.",
      "of": "Share of the welder’s time with the arc on.",
      "eff": "Share of filler bought that ends up in the weld.",
      "rate": "Cost of welder time including overhead.",
      "wire": "Price of the filler metal."
    },
    "outputs": [
      "Required and chosen leg size",
      "Utilisation",
      "Weld mass, time and cost"
    ],
    "method": [
      "Required throat = F ÷ (L τ); leg = throat ÷ 0.7071; chosen leg = max(required, minimum), rounded up to the next millimetre.",
      "Weld metal = leg² ÷ 2 × (1 + excess) × L × density.",
      "Arc time = mass ÷ deposition rate; welder time = arc time ÷ operating factor; cost = welder time × rate + mass ÷ efficiency × filler price.",
      "Example: 60 kN on 200 mm of weld needs a 3.5355 mm leg; a 5 mm weld costs about 1.5351."
    ],
    "limitations": [
      "Uniform shear on the throat; eccentric weld groups need a polar moment analysis.",
      "Structural welds must be designed to the applicable welding code.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Weld cost rises with the square of leg size: a longer smaller weld is usually cheaper than a short large one."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1433–1486. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cam-follower-design": {
    "purpose": "Design check of a radial cam with a translating roller follower held by a spring: follower displacement, velocity and acceleration through the rise for simple harmonic, cycloidal or constant-acceleration motion, the maximum pressure angle, the contact force through the cycle from inertia, spring and external load, and the spring preload needed to keep contact with a margin.",
    "uses": [
      "Size the return spring for a cam follower",
      "Check a cam for follower jump at a higher speed",
      "Choose base circle size for the pressure angle"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "law": "Motion law used for the rise (the return is assumed symmetric).",
      "h": "Total lift.",
      "beta": "Cam rotation over which the rise happens.",
      "rpm": "Cam speed.",
      "Rb": "Base circle radius of the cam.",
      "Rr": "Radius of the follower roller.",
      "mf": "Moving mass reduced to the follower.",
      "Fext": "Constant external force the follower works against.",
      "k": "Return spring rate.",
      "F0": "Spring force with the follower at the bottom of its travel.",
      "margin": "Factor on the preload needed just to keep contact.",
      "limit": "Largest pressure angle you accept (about 30° for translating followers)."
    },
    "outputs": [
      "Peak velocity, acceleration and pressure angle",
      "Minimum contact force through the rise",
      "Spring preload needed"
    ],
    "method": [
      "Follower motion y(θ), y′(θ), y″(θ) for the chosen law; velocity = y′ω, acceleration = y″ω².",
      "Pressure angle = atan[y′ ÷ (R_b + R_r + y)], maximum found over the rise.",
      "Contact force N = F₀ + k y + F_ext + m a; the follower jumps where N < 0.",
      "Preload needed = margin × max(−m a − F_ext − k y) over the rise.",
      "Example: a 20 mm cycloidal rise over 120° at 600 rpm peaks at 113.1 m/s² and needs 142.44 N of preload."
    ],
    "limitations": [
      "Rigid follower train; at high speed elasticity adds vibration and needs a dynamic model.",
      "Symmetric return assumed; dwell periods are not modelled.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cycloidal motion has no jerk spikes and is preferred at speed; a larger base circle lowers the pressure angle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2284–2310. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "clutch-engagement-design": {
    "purpose": "Sizing a multi-plate or single-plate friction clutch for an inertia start: torque to accelerate the load in the target time plus load torque with a service factor, clamp force for the friction faces (uniform wear), peak lining pressure against the allowable, actual slip time at the design torque, energy dissipated per engagement, temperature rise of the plates and average heat at the engagement rate.",
    "uses": [
      "Size a clutch or brake for starting a flywheel, conveyor or spindle",
      "Check clutch heating at a higher cycle rate",
      "Choose plates and actuator force"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "J": "Inertia of everything being started, referred to the clutch shaft.",
      "n": "Speed of the driving side (assumed constant).",
      "TL": "Resisting load torque while starting.",
      "t": "Time you want the start to take.",
      "SF": "Factor on the torque for wear and variation.",
      "Do": "Outside diameter of the friction surface.",
      "Di": "Inside diameter of the friction surface.",
      "faces": "Number of friction interfaces (2 for a single plate between two faces).",
      "mu": "Friction coefficient of the lining.",
      "pall": "Allowable pressure for the lining material.",
      "mass": "Mass of the parts that soak up the heat of one engagement.",
      "cp": "Specific heat of the plates (about 460 J/kg·K for steel).",
      "eph": "How often the clutch engages."
    },
    "outputs": [
      "Design torque and clamp force",
      "Lining pressure and slip time",
      "Energy, temperature rise and average heat"
    ],
    "method": [
      "Torque to start: T = J ω ÷ t + T_L; design torque = SF × T.",
      "Uniform wear: T = μ F faces (D_o + D_i) ÷ 4, so F = 4T ÷ [μ faces (D_o + D_i)]; peak pressure p = F ÷ [2π r_i (r_o − r_i)].",
      "Slip time at the design torque = J ω ÷ (T_design − T_L); energy per engagement = T_design ω² J ÷ 2(T_design − T_L).",
      "Temperature rise = energy ÷ (m c_p); average heat = energy × engagements per hour ÷ 3600.",
      "Example: starting 2 kg·m² to 1000 rpm in 1 s needs 7.17 kN of clamp force and makes 11.643 kJ per start."
    ],
    "limitations": [
      "Constant driving speed and constant friction; real engagement curves vary.",
      "Heat soak assumes the plate mass absorbs each engagement before cooling.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Slip energy is set by inertia and speed: a faster start does not reduce it, a lower slip speed does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2446–2458. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "screw-jack-design": {
    "purpose": "Complete check of a screw jack or power screw with Acme or trapezoidal thread: raising and lowering torque with collar friction, efficiency and self-locking, the force at the lever, nut bearing pressure from the engaged threads, combined direct and torsional stress at the screw root, and Euler buckling of the screw column.",
    "uses": [
      "Design a lifting screw or press screw",
      "Check a jack for self-locking and lever effort",
      "Size the nut length for wear"
    ],
    "users": [
      "Machine designers",
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "W": "Axial load lifted.",
      "d": "Major diameter of the screw.",
      "p": "Thread pitch.",
      "starts": "Number of thread starts.",
      "flank": "Half the thread angle (15° for 29° Acme and 30° trapezoidal threads; 0 for square threads).",
      "mu": "Thread friction coefficient (about 0.1–0.15 lubricated steel on bronze).",
      "dc": "Mean diameter of the thrust collar or bearing face.",
      "muc": "Collar friction coefficient (about 0.01 with a thrust ball bearing).",
      "R": "Length of the lever or handle.",
      "Ln": "Length of thread engaged in the nut.",
      "pall": "Allowable bearing pressure between screw and nut threads (low for slow-moving bronze nuts).",
      "Sy": "Yield strength of the screw.",
      "Lb": "Unsupported length of the screw acting as a column.",
      "Kb": "Effective length factor (2 for a jack with a free top).",
      "E": "Elastic modulus of the screw."
    },
    "outputs": [
      "Raising and lowering torque, efficiency and lever force",
      "Self-locking and nut bearing pressure",
      "Screw stress and buckling factor"
    ],
    "method": [
      "Pitch diameter d₂ ≈ d − p ÷ 2, root d₃ ≈ d − p; lead l = starts × p.",
      "Raise: T = W d₂ ÷ 2 × (l + π μ d₂ sec α) ÷ (π d₂ − μ l sec α) + W μ_c d_c ÷ 2; lower with the signs reversed (handbook jack formulas with collar friction).",
      "Self-locking when π μ d₂ sec α > l; efficiency = W l ÷ 2π T_raise.",
      "Nut pressure = W ÷ (π d₂ (p ÷ 2) n), n = nut length ÷ pitch; root stress by von Mises from W ÷ A₃ and the thread torque; buckling P_cr = π² E I ÷ (K L)².",
      "Example: 20 kN on a Tr40×7 screw needs 128.14 N·m to raise, or 427.15 N on a 300 mm lever."
    ],
    "limitations": [
      "Approximate thread diameters; use the thread standard for final dimensions.",
      "Static load; wear life of the nut depends on speed and lubrication.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A thrust ball bearing at the collar can halve the raising torque."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 171, 2561. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pump-system-design": {
    "purpose": "Design of a simple pumping system: pipe velocity, Reynolds number and Darcy friction factor (Colebrook–White), friction and fitting losses, total head from static lift, pressure difference and losses, hydraulic, shaft and motor power, and net positive suction head available from the suction conditions compared with the pump’s requirement.",
    "uses": [
      "Specify a pump duty point and motor size",
      "Check whether a suction arrangement will cavitate",
      "Choose a pipe size by velocity and running cost"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers",
      "Hydraulic engineers"
    ],
    "inputs": {
      "Q": "Flow rate at the duty point.",
      "dz": "Height difference between the delivery and suction liquid levels.",
      "dp": "Pressure on the delivery surface minus pressure on the suction surface.",
      "d": "Internal diameter of the pipe (suction pipe assumed the same size).",
      "L": "Total length of pipe including suction.",
      "K": "Sum of fitting and valve loss coefficients, including entry and exit.",
      "eps": "Absolute roughness of the pipe (0.045 mm commercial steel).",
      "rho": "Liquid density.",
      "nu": "Kinematic viscosity (1 mm²/s for water at 20 °C).",
      "ps": "Absolute pressure on the suction liquid surface (atmospheric for an open tank).",
      "pv": "Vapour pressure of the liquid at the pumping temperature.",
      "zs": "Height of the suction surface above the pump centre line.",
      "Ls": "Length of the suction line.",
      "Ks": "Fitting losses in the suction line.",
      "npshr": "NPSH the pump needs at this flow (from its curve).",
      "eta": "Pump efficiency at the duty point.",
      "marg": "Margin above shaft power for the motor."
    },
    "outputs": [
      "Velocity, friction factor and losses",
      "Total head, power and motor size",
      "NPSH available against required"
    ],
    "method": [
      "v = Q ÷ A; Re = v d ÷ ν; f from Colebrook–White (64 ÷ Re if laminar).",
      "Losses h_f = (f L ÷ d + ΣK) v² ÷ 2g; total head H = Δz + Δp ÷ ρg + h_f.",
      "Hydraulic power = ρ g Q H; shaft power = hydraulic ÷ η; motor = shaft × (1 + margin).",
      "NPSH_a = (p_s − p_v) ÷ ρg + z_s − suction losses.",
      "Example: 300 L/min through 80 m of 50 mm pipe needs 28.936 m of head and a 2.331 kW motor."
    ],
    "limitations": [
      "Single pipe size and steady flow; branched systems need a network calculation.",
      "Pump efficiency and NPSH required come from the pump curve at the duty flow.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If NPSH margin is short, raise the suction level, shorten the suction line or enlarge its bore."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3021–3026, 3036. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
