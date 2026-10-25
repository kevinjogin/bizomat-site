// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook28).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "keyed-hub-design": {
    "purpose": "Design of a parallel-keyed shaft-to-hub connection from the power and speed: design torque with service factor, force at the shaft surface, key length for shear and for crushing on the half-depth bearing face, the effect of a second key, the hub length needed, and the shaft torsional stress against 75% of the allowable as the handbook recommends for keyed shafts.",
    "uses": [
      "Size a key for a pulley, gear or coupling",
      "Decide between a longer hub and a second key",
      "Check a keyed shaft after a power increase"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "P": "Power transmitted.",
      "n": "Shaft speed.",
      "SF": "Service factor for shock and starting loads.",
      "d": "Shaft diameter at the key.",
      "w": "Key width (from the key standard for the shaft size).",
      "h": "Key height.",
      "hubL": "Length of the hub bore.",
      "nk": "One key, or two keys at 180° (assumed to share the load at 75% effectiveness).",
      "tauK": "Allowable shear stress for the key material.",
      "sigC": "Allowable bearing (crushing) stress of the weakest of key, shaft and hub.",
      "tauS": "Allowable shear stress for the shaft without a keyway."
    },
    "outputs": [
      "Design torque and force at the shaft surface",
      "Key length for shear and crushing",
      "Hub length and keyed shaft stress"
    ],
    "method": [
      "T = P ÷ ω × SF; force F = 2T ÷ d.",
      "Shear length L_s = F ÷ (w τ); crushing length L_c = F ÷ (h ÷ 2 × σ_c).",
      "Two keys: required length ÷ 1.5 (each key assumed 75% effective).",
      "Keyed shaft: τ = 16T ÷ πd³ against 75% of the unkeyed allowable (handbook rule for a standard keyway).",
      "Example: 15 kW at 1450 rpm on a 40 mm shaft needs a 18.522 mm long 12 × 8 key."
    ],
    "limitations": [
      "Uniform load along the key; long keys (beyond about 1.5 d) carry load unevenly.",
      "Fatigue and fretting of keyed joints need separate attention for reversing loads.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the key would exceed about 1.5 shaft diameters, use two keys, a spline or a shrink fit instead."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2460–2486, 301. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "band-brake-stop-design": {
    "purpose": "Design of a simple band brake to stop a rotating inertia: braking torque to stop in the target time against a load that resists or overhauls (as in hoist lowering), design torque with a service factor, band tensions from the Euler relation, lever force and lining pressure, actual stopping time and angle, energy per stop, drum temperature rise and average heat.",
    "uses": [
      "Size a band brake for a winch, hoist or flywheel",
      "Check stopping time and heating at a new duty",
      "Find the lever force an operator or actuator must apply"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "J": "Inertia of everything being stopped, referred to the drum shaft.",
      "n": "Drum speed when braking starts.",
      "t": "Time within which it must stop.",
      "TL": "Torque from the load (friction or gravity).",
      "dir": "Whether the load torque resists rotation or drives it (overhauling loads make stopping harder).",
      "SF": "Factor on torque for lining variation.",
      "D": "Brake drum diameter.",
      "wrap": "Angle of drum covered by the band.",
      "mu": "Lining friction coefficient.",
      "a": "Lever arm from the fulcrum to the applied force.",
      "b": "Lever arm from the fulcrum to the band’s slack end.",
      "w": "Width of the band.",
      "Fmax": "Force the operator, spring or actuator can apply at the lever (about 250–300 N for a hand lever).",
      "pall": "Allowable pressure for the lining material.",
      "mass": "Mass of the drum that soaks up the heat.",
      "cp": "Specific heat of the drum (460 J/kg·K for steel).",
      "sph": "How often the brake stops the load."
    },
    "outputs": [
      "Braking torque and design torque",
      "Band tensions, lever force and lining pressure",
      "Stopping time, energy and heat"
    ],
    "method": [
      "Torque to stop in time T = J ω ÷ t ± load torque (+ when overhauling); design torque = SF × T.",
      "Band brake: net pull = T ÷ r; slack tension T₂ = net ÷ (e^(μθ) − 1); tight T₁ = T₂ + net; lever force = T₂ b ÷ a; peak pressure = T₁ ÷ (r w) (handbook band brake formulas).",
      "Actual stopping time = J ω ÷ (T_design ∓ T_L); angle = ω t ÷ 2.",
      "Energy = ½ J ω² ± T_L × angle; temperature rise = energy ÷ m c_p.",
      "Example: stopping 5 kg·m² from 600 rpm in 2 s needs 258.85 N·m and 41.6 N on the lever."
    ],
    "limitations": [
      "Anchored end is the tight side for the rotation shown; reverse rotation needs much more lever force.",
      "Constant friction; fade at high temperature is not modelled.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For hoists, size for the overhauling case with the heaviest load lowering at full speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2455–2458. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "conveyor-drive-sizing": {
    "purpose": "Simplified sizing of a belt conveyor drive: load per metre from the throughput and speed, effective belt tension from idler and belt resistance (an overall friction factor) plus lift, power at the drive pulley and at the motor, minimum slack-side tension for the drive pulley’s wrap and friction (Euler), tight-side tension, pulley torque and speed.",
    "uses": [
      "Estimate motor size for a belt conveyor",
      "Set take-up tension to stop belt slip",
      "Check a conveyor after raising its throughput"
    ],
    "users": [
      "Materials-handling engineers",
      "Plant engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Q": "Material conveyed per hour.",
      "v": "Belt speed.",
      "L": "Horizontal length between pulley centres.",
      "Hl": "Height the material is lifted (negative for a decline).",
      "qm": "Mass per metre of belt (both runs) plus the rotating parts of the idlers.",
      "f": "Overall resistance factor for idlers, belt flexing and material (about 0.02–0.03 for well-aligned conveyors).",
      "mu": "Friction between belt and drive pulley (about 0.35 lagged, 0.25 bare and dry).",
      "wrap": "Angle of the drive pulley covered by the belt.",
      "D": "Diameter of the drive pulley.",
      "eta": "Efficiency of the gearbox and couplings.",
      "marg": "Margin above the calculated power for the motor."
    },
    "outputs": [
      "Material load and effective tension",
      "Power at pulley and motor",
      "Belt tensions, pulley torque and speed"
    ],
    "method": [
      "Material load q = Q ÷ (3.6 v) kg/m.",
      "Effective tension T_e = f g L (q + q_m) + q g H.",
      "Power = T_e v; motor = power ÷ η × (1 + margin).",
      "No slip: slack tension T₂ ≥ T_e ÷ (e^(μθ) − 1); tight tension T₁ = T₂ + T_e (Euler); pulley torque = T_e D ÷ 2.",
      "Example: 100 t/h at 1.5 m/s over 50 m with 5 m lift needs about 2.7551 kW at the motor."
    ],
    "limitations": [
      "Single overall friction factor; detailed design uses the full DIN 22101 or CEMA method.",
      "Starting tensions are higher; check belt strength at start-up.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "On long horizontal conveyors friction dominates; on short steep ones lift dominates."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2487–2512. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "fixture-clamp-force": {
    "purpose": "Clamping force needed to hold a workpiece in a fixture against cutting forces, either by friction alone or with the cutting force taken by a positive stop, with a safety factor; the force per clamp, the screw force for a strap clamp from its lever geometry, the screw tightening torque from the nut factor and the screw stress.",
    "uses": [
      "Size clamps for a milling or drilling fixture",
      "Decide whether a positive stop is needed",
      "Set clamp screw torques for operators"
    ],
    "users": [
      "Tooling engineers",
      "Machinists",
      "Manufacturing engineers"
    ],
    "inputs": {
      "mode": "Whether a solid stop takes the cutting force, or friction alone must hold it.",
      "Fcut": "Largest cutting force acting along the locating surface.",
      "Flift": "Largest force trying to lift the work off its locators.",
      "n": "Safety factor on holding (2–3 for interrupted cuts).",
      "mu1": "Friction between clamp and workpiece.",
      "mu2": "Friction between workpiece and locators or base.",
      "nc": "Number of clamps sharing the load.",
      "A": "Distance from the clamp screw to where the strap presses the work.",
      "B": "Distance from the clamp screw to the heel support.",
      "d": "Clamp screw diameter.",
      "P": "Clamp screw pitch.",
      "K": "Nut factor for the screw (about 0.2 dry, 0.15 oiled).",
      "Sp": "Proof strength of the clamp screw or stud."
    },
    "outputs": [
      "Total and per-clamp clamping force",
      "Screw force and tightening torque",
      "Screw stress"
    ],
    "method": [
      "Friction only: clamping force = n F_cut ÷ (μ₁ + μ₂) + n F_lift (friction acts at both faces).",
      "With a stop: clamping force = n F_lift (the stop carries the cutting force).",
      "Strap clamp: screw force = clamp force × (A + B) ÷ B; torque = K × screw force × d.",
      "Screw stress = screw force ÷ A_t, with A_t = π ÷ 4 (d − 0.9382 P)².",
      "Example: 2000 N of cutting force held by friction needs 13,933 N of clamping in total and 33.44 N·m on each screw."
    ],
    "limitations": [
      "Static force balance; vibration and chatter may need extra margin.",
      "Clamping should press the work onto its locators, not between them.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A positive stop against the cutting force usually cuts the clamping force needed several-fold and reduces distortion."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3131–3134, 1522–1532. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "lifting-beam-design": {
    "purpose": "Check of a below-the-hook beam: a lifting beam (one top lug, load hung from two points, beam in bending) for bending stress and deflection, or a spreader beam (top slings to the ends, beam in compression) for the compression from the sling angle and Euler buckling, with the sling leg tensions, using a dynamic factor on the load.",
    "uses": [
      "Check a fabricated lifting beam before use",
      "Choose a section for a spreader bar",
      "Find sling tensions for a two-point lift"
    ],
    "users": [
      "Rigging supervisors",
      "Structural engineers",
      "Lifting equipment designers"
    ],
    "inputs": {
      "type": "A lifting beam carries the load in bending from one central lug; a spreader beam keeps slings apart and is in compression.",
      "mass": "Mass of the load (plus rigging below the beam).",
      "dyn": "Factor for lifting dynamics (from the lifting standard; about 1.1–1.3).",
      "S": "Distance between the two load lift points.",
      "theta": "Angle of each top sling leg from vertical (spreader beams).",
      "Z": "Section modulus of the beam about the bending axis.",
      "I": "Second moment of area (the least one for spreader buckling).",
      "E": "Elastic modulus of the beam.",
      "allow": "Allowable stress from the lifting equipment standard.",
      "A": "Cross-section area of a spreader.",
      "nb": "Factor required against Euler buckling."
    },
    "outputs": [
      "Design load and sling tension",
      "Bending stress and deflection (lifting beam)",
      "Compression and buckling factor (spreader)"
    ],
    "method": [
      "Design load W = mass × g × dynamic factor; each load point carries W ÷ 2.",
      "Lifting beam: M = W S ÷ 4; stress = M ÷ Z; deflection = W S³ ÷ 48 E I (central lug, end loads, equivalent to a centrally loaded simple span).",
      "Spreader: top sling tension = W ÷ (2 cos θ); compression = (W ÷ 2) tan θ; buckling P_cr = π² E I ÷ S² (pinned ends).",
      "Example: a 5000 kg load on a 3000 mm lifting beam gives 153.23 MPa bending stress."
    ],
    "limitations": [
      "Lifting equipment must be designed, proof-tested and certified to the applicable standard.",
      "Lug, weld and local flange checks are separate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Flatter top slings (larger angles) raise both sling tension and spreader compression quickly."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2613–2625, 281–285. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "beam-sizing": {
    "purpose": "Required section properties for a beam carrying a uniform load and a point load together: maximum bending moment by superposition (sampled along a simple span, or at the critical sections of a cantilever or fixed-ended beam), the section modulus for the allowable stress, the second moment of area for a span-over deflection limit, and the utilisation of a chosen section.",
    "uses": [
      "Choose a steel or aluminium section for a frame member",
      "Check whether strength or stiffness governs",
      "Compare an available section against the loads"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Engineering managers"
    ],
    "inputs": {
      "sup": "Support arrangement.",
      "L": "Span (or cantilever length).",
      "w": "Uniformly distributed load including self-weight.",
      "P": "Concentrated load.",
      "a": "Position of the point load (ignored for fixed ends, where it is taken at mid-span).",
      "allow": "Allowable bending stress for the material and code.",
      "E": "Elastic modulus of the beam material.",
      "lim": "Deflection limit as span divided by this number (360 for floors, 180–250 for many machine frames).",
      "Zc": "Section modulus of a section you want to check.",
      "Ic": "Second moment of area of that section."
    },
    "outputs": [
      "Maximum moment and its position",
      "Required section modulus and second moment of area",
      "Utilisation of the chosen section"
    ],
    "method": [
      "Simple span: M(x) = w x (L − x) ÷ 2 + point-load moment, maximum found along the span; deflection = 5wL⁴ ÷ 384EI + P b (L² − b²)^1.5 ÷ (9√3 L E I) (sum of the two maxima, conservative).",
      "Cantilever: M = wL² ÷ 2 + P a; tip deflection = wL⁴ ÷ 8EI + P a² (3L − a) ÷ 6EI.",
      "Fixed ends: M = wL² ÷ 12 + PL ÷ 8; deflection = wL⁴ ÷ 384EI + PL³ ÷ 192EI.",
      "Required Z = M ÷ allowable; required I from the deflection limit.",
      "Example: the default beam needs Z ≥ 79,545 mm³ and I ≥ 6,348,600 mm⁴; both checks governs the choice."
    ],
    "limitations": [
      "Elastic, laterally restrained beam; slender beams also need a lateral-torsional buckling check.",
      "Shear and local bearing at supports and loads are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If stiffness governs, a deeper section is far more effective than a stronger material."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 258–275. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "compressed-air-system-sizing": {
    "purpose": "Sizing a compressed-air system from the average demand: compressor free-air delivery with leakage and growth allowances, theoretical compression power with an overall efficiency (the same method as the compressor power tool), receiver volume to cover a peak deficit within the pressure band, the main pipe bore that keeps the pressure drop within a limit (Darcy–Weisbach, as the air line tool), and the annual energy cost of leakage.",
    "uses": [
      "Plan a compressor, receiver and ring main for a workshop",
      "Show the energy cost of leaks to justify a leak survey",
      "Check a plant after adding air users"
    ],
    "users": [
      "Plant engineers",
      "Compressed-air engineers",
      "Maintenance managers"
    ],
    "inputs": {
      "Q": "Average free-air demand of all users together (after diversity).",
      "leak": "Air lost to leaks, as a share of demand (often 20–30% in unsurveyed plants).",
      "growth": "Allowance for future users.",
      "deficit": "Short-term demand above what the compressor supplies.",
      "tpk": "How long that peak lasts.",
      "p": "Pressure needed at the users.",
      "p1": "Pressure at which the compressor unloads.",
      "p2": "Lowest acceptable receiver pressure.",
      "L": "Length of the main pipe run, plus an allowance for fittings.",
      "dpMax": "Largest pressure drop you accept along the main.",
      "T": "Temperature of the air in the main.",
      "eps": "Pipe roughness.",
      "eff": "Overall efficiency relating theoretical adiabatic power to shaft power.",
      "hours": "Hours the system is pressurised each year.",
      "price": "Cost of electricity."
    },
    "outputs": [
      "Compressor capacity and power",
      "Receiver volume",
      "Main pipe bore and leak cost"
    ],
    "method": [
      "Compressor FAD = Q × (1 + leak) × (1 + growth).",
      "Power = single-stage adiabatic k = 1.4 from 1.013 bar to (p₁ + 1.013) bar ÷ efficiency.",
      "Receiver V = deficit × time × 1.013 ÷ (p₁ − p₂).",
      "Main bore found so the Darcy–Weisbach drop with Colebrook friction at working pressure equals the limit.",
      "Leak cost = leak flow × specific power × hours × price.",
      "Example: 5 m³/min of demand needs a 6.9 m³/min compressor of about 47.156 kW, a 1,351 L receiver and a 50.922 mm main."
    ],
    "limitations": [
      "Single-stage power estimate; real compressors publish their own specific power.",
      "Pipe bore is the minimum internal bore; choose the next larger standard pipe.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Fixing leaks is usually the cheapest capacity increase available."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3030–3037, 3421–3425. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "vibration-isolator-selection": {
    "purpose": "Selection of resilient mounts for a machine: the frequency ratio needed for a target isolation efficiency with damping, the natural frequency, static deflection and stiffness per mount that achieve it, and, for a chosen mount stiffness, the actual natural frequency, transmissibility and isolation, with a warning near resonance.",
    "uses": [
      "Choose anti-vibration mounts for a compressor, fan or pump",
      "Check whether existing mounts isolate or amplify",
      "Explain why soft mounts are needed for slow machines"
    ],
    "users": [
      "Maintenance engineers",
      "Plant engineers",
      "Design engineers"
    ],
    "inputs": {
      "mass": "Mass carried by the mounts (machine plus base frame).",
      "nm": "Number of mounts sharing the weight equally.",
      "rpm": "Lowest steady speed producing vibration (use the lowest forcing frequency).",
      "iso": "Share of the vibrating force you want kept out of the structure.",
      "zeta": "Damping ratio (about 0.05 for rubber, 0.01 for steel springs).",
      "k": "Vertical stiffness of the mount you are considering."
    },
    "outputs": [
      "Required frequency ratio and natural frequency",
      "Static deflection and stiffness per mount",
      "Performance of the chosen mount"
    ],
    "method": [
      "Transmissibility T = √{[1 + (2ζr)²] ÷ [(1 − r²)² + (2ζr)²]}, with r = forcing ÷ natural frequency; isolation = 1 − T.",
      "Required r solved for the target isolation; natural frequency f_n = forcing frequency ÷ r.",
      "Static deflection δ = g ÷ (2π f_n)²; stiffness per mount = (m ÷ n)(2π f_n)².",
      "Example: 90% isolation at 1500 rpm needs 4.5931 mm of static deflection, about 266.88 N/mm per mount."
    ],
    "limitations": [
      "Single-degree-of-freedom vertical model; rocking modes and a flexible floor change the result.",
      "Mount stiffness varies with load and temperature; use the maker’s loaded stiffness.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Isolation only starts above √2 times the natural frequency; stiff mounts on a slow machine amplify vibration."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 197–198, 304–316. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "motor-gearbox-selection": {
    "purpose": "Selection of an induction motor and gearbox for a load: ratio from the motor speed (pole count and slip) and load speed, running torque and power through the gearbox efficiency, reflected inertia and the acceleration torque to reach speed in the time required (the same method as the reflected inertia tool), the next standard IEC motor rating with a service factor, and its starting torque against the starting requirement.",
    "uses": [
      "Choose a gearmotor for a conveyor, mixer or turntable",
      "Check that a motor can start a high-inertia load",
      "Compare 4-pole and 6-pole motor options"
    ],
    "users": [
      "Design engineers",
      "Electrical and mechanical engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "TL": "Torque the load needs at its own shaft.",
      "nL": "Required load speed.",
      "JL": "Load inertia at the load shaft.",
      "t": "Time allowed to reach speed.",
      "poles": "Motor pole count (synchronous speed at 50 Hz).",
      "slip": "Slip at full load (from the motor data).",
      "eff": "Gearbox efficiency.",
      "Jm": "Motor rotor inertia (from the motor data; estimate first and re-check).",
      "SF": "Service factor applied to the running power.",
      "start": "Locked-rotor (starting) torque as a multiple of rated torque, from the motor data."
    },
    "outputs": [
      "Gear ratio and motor speed",
      "Running power and chosen motor rating",
      "Starting torque check and inertia ratio"
    ],
    "method": [
      "Motor speed = synchronous speed × (1 − slip); ratio i = motor speed ÷ load speed.",
      "Running torque at the motor = T_L ÷ (i η); power = T_L ω_L ÷ η.",
      "Reflected inertia J_L ÷ (i² η); acceleration torque = (J_m + J_r) α_m; starting torque needed = running + acceleration torque.",
      "Motor rating = next standard IEC output ≥ SF × power; starting torque available = multiple × rated torque.",
      "Example: 200 N·m at 150 rpm with a 4-pole motor needs a 9.7:1 gearbox and a 5.5 kW motor."
    ],
    "limitations": [
      "Constant load torque during start; fans and pumps (torque rising with speed) start more easily.",
      "Supply frequency of 50 Hz assumed for the pole speeds.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A high inertia ratio is acceptable for induction motors on simple drives, but servo drives usually need it below about 10:1."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2569–2580, 3408–3412. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
