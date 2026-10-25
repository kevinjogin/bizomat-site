// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook20).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "lever-force": {
    "purpose": "Balance of a lever about its fulcrum: the effort needed at a given arm to hold up to three loads at their distances, or the arm length needed for a given effort, with the mechanical advantage and the fulcrum reaction.",
    "uses": [
      "Size a hand lever or foot pedal",
      "Check a clamping or brake lever",
      "Find the counterweight arm for a balance lever"
    ],
    "users": [
      "Design engineers",
      "Mechanical engineers",
      "Maintenance fitters"
    ],
    "inputs": {
      "mode": "Find the effort or the effort-arm length.",
      "type": "Arrangement of fulcrum, loads and effort (sets the fulcrum reaction).",
      "x": "Distance from the fulcrum to where the effort is applied.",
      "F": "Effort available, when solving for the arm.",
      "W1": "First load.",
      "a1": "Its distance from the fulcrum.",
      "W2": "Second load.",
      "a2": "Its distance.",
      "W3": "Third load.",
      "a3": "Its distance."
    },
    "outputs": [
      "Effort or effort-arm length",
      "Mechanical advantage",
      "Fulcrum reaction"
    ],
    "method": [
      "Moments about the fulcrum: F x = W₁a₁ + W₂a₂ + W₃a₃.",
      "F = Σ W a ÷ x, or x = Σ W a ÷ F.",
      "Fulcrum reaction: F + ΣW when the fulcrum is between effort and loads, otherwise the difference of the two.",
      "Example: 800 N at 100 mm with a 600 mm effort arm needs 133.33 N."
    ],
    "limitations": [
      "Rigid, weightless lever in static balance; add the lever’s own weight as a load at its centre of gravity.",
      "Pivot friction is neglected.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A third-class lever always needs more effort than load; it trades force for movement."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 167–168. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hoist-advantage": {
    "purpose": "Effort and mechanical advantage for the handbook’s simple lifting machines: wheel and axle, a windlass driven through up to two gear pairs, a block and tackle with several parts of rope, a differential chain pulley and a Chinese (differential) windlass, with an overall efficiency.",
    "uses": [
      "Check the hand effort on a chain block or winch",
      "Compare hoisting arrangements for a lift",
      "Estimate hook travel per turn of a hand wheel"
    ],
    "users": [
      "Rigging supervisors",
      "Maintenance fitters",
      "Machine designers"
    ],
    "inputs": {
      "type": "Choose the lifting machine.",
      "W": "Weight to be lifted.",
      "R": "Wheel-and-axle wheel or crank radius; for the differential pulley and Chinese windlass, the larger sheave or drum radius.",
      "r": "Drum radius; for the differential pulley and Chinese windlass, the smaller sheave or drum radius.",
      "g1": "Speed reduction of the first gear pair.",
      "g2": "Speed reduction of the second gear pair.",
      "n": "Number of rope parts carrying the moving block.",
      "crank": "Radius of the crank turning a Chinese windlass.",
      "eff": "Overall efficiency from friction (differential pulleys are low, which keeps them self-sustaining)."
    },
    "outputs": [
      "Effort required",
      "Mechanical advantage",
      "Load travel per turn or per unit of effort travel"
    ],
    "method": [
      "Wheel and axle: F = W r ÷ R. Geared windlass: F = W r ÷ (R × gear ratios).",
      "Block and tackle: F = W ÷ n.",
      "Differential pulley: F = W (R − r) ÷ 2R. Chinese windlass: F = W (R − r) ÷ 2 × crank; the load rises half the difference of the drum circumferences per turn.",
      "Effort with friction = ideal effort ÷ efficiency.",
      "Example: a 10000 N load on a differential pulley of 150 and 135 mm needs 1,428.6 N."
    ],
    "limitations": [
      "Static lifting; acceleration and rope stiffness are excluded.",
      "Use certified lifting equipment within its rated load.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A differential pulley with low efficiency holds the load without a brake; check that the chosen machine is self-sustaining if it must be."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 170–171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "agma-bending-stress": {
    "purpose": "Tooth-root bending stress by the AGMA fundamental rating formula in metric form, from tangential load, face width, module, the bending geometry factor and the application, dynamic, size, load-distribution and rim-thickness factors, compared with your allowable bending stress.",
    "uses": [
      "Check gear tooth bending strength for a new duty",
      "Compare face width or module options",
      "Rate an existing gear pair for a higher load"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "Ft": "Transmitted tangential force at the operating pitch diameter.",
      "b": "Net face width of the narrower gear.",
      "mt": "Transverse module (normal module ÷ cos helix angle for helical gears).",
      "J": "Bending strength geometry factor from AGMA 908 or the gear design software.",
      "Ko": "Application factor for the driving and driven machinery.",
      "Kv": "Dynamic factor for pitch-line velocity and gear accuracy.",
      "Ks": "Size factor (1 unless the standard calls for more).",
      "KH": "Face load distribution factor for alignment and face width.",
      "KB": "Rim thickness factor (1 for solid gears).",
      "allow": "Allowable bending stress for the material, already adjusted for stress cycles, temperature and reliability.",
      "req": "Safety factor your design rule requires."
    },
    "outputs": [
      "Tooth bending stress",
      "Safety factor",
      "Load capacity at the required factor"
    ],
    "method": [
      "σ_F = F_t K_o K_v K_s K_H K_B ÷ (b m_t Y_J) — the metric form of the AGMA fundamental bending equation.",
      "Safety factor = allowable ÷ σ_F; capacity = F_t × safety factor ÷ required factor.",
      "Example: 3000 N on a 30 mm face, module 2.5, J = 0.35 gives 222.86 MPa."
    ],
    "limitations": [
      "All factors and the allowable come from AGMA 2001 / 2101 or ISO 6336 data for your gears.",
      "Pitting resistance is a separate check.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising the module raises bending strength fastest; wider faces help only while alignment keeps K_H low."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3304–3320. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spline-torque-capacity": {
    "purpose": "Stresses in a 30° involute spline by the handbook (Dudley) formulas: shear under the roots of the external teeth for a solid or hollow shaft, shear at the pitch diameter, and compressive stress on the tooth sides for fixed or flexible splines, using application, load-distribution, fatigue-life and wear-life factors.",
    "uses": [
      "Check a spline for a new torque or duty",
      "Find the effective length a spline needs",
      "Compare fixed and flexible spline designs"
    ],
    "users": [
      "Design engineers",
      "Gear designers",
      "Driveline engineers"
    ],
    "inputs": {
      "T": "Torque through the spline.",
      "D": "Pitch diameter.",
      "Dre": "Root (minor) diameter of the external spline.",
      "Dh": "Inside diameter of a hollow shaft.",
      "Nt": "Number of spline teeth.",
      "Le": "Effective length carrying load (limited by misalignment; never more than the engaged length).",
      "t": "Circular tooth thickness at the pitch diameter.",
      "h": "Radial depth of tooth engagement (about 0.9 module for flat root, 1 module for fillet root).",
      "kind": "A fixed spline is piloted or shrunk on so it cannot rock; a flexible spline rocks and wears.",
      "acc": "Spacing accuracy of manufacture.",
      "Ka": "Application factor for the power source and load.",
      "Km": "Load distribution factor for misalignment (1 for fixed splines).",
      "Kf": "Fatigue-life factor for the number of torque cycles.",
      "Kw": "Wear-life factor for the revolutions of a flexible spline.",
      "Ss": "Allowable shear stress for your material and hardness.",
      "Sc": "Allowable compressive stress for your material and spline type."
    },
    "outputs": [
      "Shear stress under the roots",
      "Shear stress at the pitch diameter",
      "Compressive stress on the teeth"
    ],
    "method": [
      "Root shear, solid: S_s = 16 T K_a ÷ (π D_re³ K_f); hollow: 16 T D_re K_a ÷ [π (D_re⁴ − D_h⁴) K_f].",
      "Pitch-line shear: S_s = 4 T K_a K_m ÷ (D N L_e t K_f), with 6 in place of 4 for poor spacing accuracy.",
      "Compression, flexible: S_c = 2 T K_m K_a ÷ (D N L_e h K_w); fixed: 2 T K_m K_a ÷ (9 D N L_e h K_f).",
      "Example: 500 N·m in a 24-tooth spline gives 139.2 MPa root shear."
    ],
    "limitations": [
      "30° involute splines; bursting of internal splines is a separate check.",
      "Factors and allowables are user inputs from the spline standard and material data.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If compression governs, lengthen the engagement or make the spline fixed (piloted)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2266–2270. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "internal-gear": {
    "purpose": "Proportions of an internal spur gear and its pinion by the handbook rules for 20° full-depth teeth: pitch diameters, enlarged internal diameter and pinion outside diameter to avoid interference, conventional diameters, centre distance, arc tooth thicknesses and the tooth-number difference check.",
    "uses": [
      "Lay out an internal gear drive",
      "Check tooth-number combinations for interference",
      "Size a ring gear blank"
    ],
    "users": [
      "Gear designers",
      "Machinists",
      "Maintenance engineers"
    ],
    "inputs": {
      "m": "Module (25.4 ÷ diametral pitch).",
      "Zg": "Number of teeth in the internal gear.",
      "Zp": "Number of teeth in the pinion.",
      "form": "Tooth system, which sets the minimum tooth-number difference."
    },
    "outputs": [
      "Pitch diameters and centre distance",
      "Internal diameter and pinion outside diameter",
      "Tooth thicknesses and interference check"
    ],
    "method": [
      "Pitch diameters = m Z; centre distance = m (Z_g − Z_p) ÷ 2.",
      "Enlarged internal diameter = m (Z_g − 1.2) for pinions of 16 teeth or more (conventional: m (Z_g − 2)).",
      "Enlarged pinion outside diameter = m (Z_p + 2.5) (conventional: m (Z_p + 2)).",
      "Arc tooth thickness at the pitch circle: internal gear 1.3888 m, enlarged pinion 1.7528 m (20°).",
      "Tooth-number difference at least 12 (20° full depth), 7–8 (stub) or 15 (14½°).",
      "Example: 72 teeth with a 18-tooth pinion: internal diameter 299.72 mm and pinion outside diameter 86.783 mm."
    ],
    "limitations": [
      "Rules for 20° full-depth teeth with pinions of 16 teeth or more; thicknesses apply to 20° with the enlarged diameters.",
      "Check tip interference and trimming with gear design software for unusual ratios.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A tooth-number difference below the minimum causes interference; add teeth to the gear or remove them from the pinion."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2170–2171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "film-thickness-ratio": {
    "purpose": "Film thickness ratio lambda of a rolling bearing or gear contact: the working film thickness divided by the composite roughness of the two surfaces, from RMS or average roughness, with the lubrication regime it indicates.",
    "uses": [
      "Check whether a bearing runs in full-film lubrication",
      "Judge the effect of a different oil viscosity",
      "Explain short bearing life from surface distress"
    ],
    "users": [
      "Reliability engineers",
      "Lubrication engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "h": "Minimum film thickness at the operating temperature (from an EHL calculation or the bearing maker’s data).",
      "rtype": "Whether the roughness values are RMS or arithmetic average.",
      "R1": "Roughness of the first surface (for example the raceway).",
      "R2": "Roughness of the second surface (for example the rolling element)."
    },
    "outputs": [
      "Composite roughness",
      "Film thickness ratio λ",
      "Lubrication regime"
    ],
    "method": [
      "λ = h ÷ √(R_q1² + R_q2²).",
      "Where only Ra is known, R_q ≈ 1.25 Ra for typical ground surfaces.",
      "Commonly λ < 1 indicates boundary lubrication, 1–3 mixed, and above about 3 full separation.",
      "Example: a 0.25 µm film on surfaces of 0.06 and 0.04 µm gives λ = 3.4669."
    ],
    "limitations": [
      "Film thickness must be calculated or supplied; this tool does not compute EHL film thickness.",
      "Contamination and debris dents defeat a good λ.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising viscosity at the operating temperature or improving surface finish increases λ and bearing life."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2420–2422. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "turn-of-nut-preload": {
    "purpose": "Nut rotation for a target bolt preload by the handbook’s turn-of-nut relation, using the bolt’s elastic elongation over its shank and threaded lengths, with optional joint compliance, or the preload from a specified turn angle.",
    "uses": [
      "Set an angle-tightening specification for a bolted joint",
      "Check what preload a turn angle produces",
      "Compare angle and torque tightening"
    ],
    "users": [
      "Design engineers",
      "Assembly engineers",
      "Maintenance fitters"
    ],
    "inputs": {
      "mode": "Find the angle for a preload, or the preload for an angle.",
      "Ft": "Preload required.",
      "theta": "Nut turn from the snug position.",
      "lead": "Thread lead (pitch × starts).",
      "d": "Nominal diameter, for the shank area.",
      "At": "Tensile stress area of the thread.",
      "Ls": "Length of plain shank within the grip.",
      "Lt": "Length of loaded thread within the grip (often plus about half a nut height for the thread engagement).",
      "E": "Elastic modulus of the bolt.",
      "kj": "Stiffness of the clamped parts; 0 reproduces the handbook relation, which ignores joint compression."
    },
    "outputs": [
      "Bolt elongation",
      "Turn angle or preload",
      "Bolt stiffness"
    ],
    "method": [
      "Bolt elongation B = F_t (L_s ÷ A_s + L_t ÷ A_t) ÷ E.",
      "Handbook: θ = 360 B ÷ l, with l the lead (θ = 360 F_t L_B ÷ E l).",
      "With joint compliance the nut also takes up the joint compression: θ = 360 (B + F_t ÷ k_j) ÷ l.",
      "Example: 35 kN in an M10 bolt with a 1.5 mm lead needs 22.716° from snug on a rigid joint."
    ],
    "limitations": [
      "Elastic region; yield-tightening needs empirical angles.",
      "Not valid for gaskets or soft joints without measured joint stiffness; establish angles on a simulated joint.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Find the snug point consistently; most of the scatter in angle tightening comes from where counting starts."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1522–1528. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "deep-draw-force": {
    "purpose": "Punch force for the first draw of a cylindrical shell, for a subsequent (redraw) operation from blank and punch diameters, and for ironing a drawn wall to a thinner gauge, by the handbook formulas, with the drawing ratio and press capacity check.",
    "uses": [
      "Choose a press for a drawn shell",
      "Estimate forces for each operation in a draw sequence",
      "Check whether ironing fits the available press"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "op": "Choose the operation.",
      "T": "Material thickness entering the operation.",
      "UTS": "Ultimate tensile strength of the sheet.",
      "dm": "Mean diameter of the shell after the first draw.",
      "dp": "Punch diameter for the redraw.",
      "D": "Original blank diameter.",
      "d0": "Outside diameter of the cup being ironed.",
      "c": "Radial clearance between punch and die, i.e. the wall thickness after ironing.",
      "Sc": "Compressive strength of the work-hardened wall.",
      "press": "Rated capacity of the press."
    },
    "outputs": [
      "Punch force",
      "Drawing ratio or wall reduction",
      "Press utilisation"
    ],
    "method": [
      "First draw: F₁ = π d_m T × UTS.",
      "Subsequent draw: F = π d_p T × UTS × (D ÷ d_p − 0.7).",
      "Ironing: F = π d₀ (T − c) S_c.",
      "Example: a first draw at 80 mm mean diameter in 1.5 mm sheet needs about 131.95 kN."
    ],
    "limitations": [
      "Friction and blank-holder force are not included; allow a margin on the press rating.",
      "Drawing limits depend on the material and die radii; confirm with trials.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep peak force well within the press rating at the point in the stroke where it occurs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1353–1361. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thread-roll-diameter": {
    "purpose": "Pitch diameter of a threading roll for a screw machine from the pitch diameter of the thread to be rolled, the single depth of thread and the number of starts on the roll, by the handbook formula, with the roll lead.",
    "uses": [
      "Specify a threading roll for an automatic screw machine",
      "Choose the number of starts for a practical roll diameter",
      "Check a supplied roll against the thread"
    ],
    "users": [
      "Screw machine setters",
      "Tooling engineers",
      "Machinists"
    ],
    "inputs": {
      "d": "Pitch diameter of the thread to be rolled.",
      "T": "Single depth of the thread form.",
      "Ns": "Number of single threads (starts) on the roll, chosen to give a convenient roll diameter.",
      "P": "Pitch of the screw thread."
    },
    "outputs": [
      "Roll pitch diameter",
      "Roll lead",
      "Roll diameter ratio"
    ],
    "method": [
      "D = N (d − T ÷ 2) − T, as in the handbook (a double roll for a ½-in. thread with d = 0.4500 in and T = 0.0499 in gives about 0.800 in).",
      "Roll lead = N × thread pitch, so the helix angles of roll and work nearly match.",
      "Example: a 2-start roll for a 11.43 mm pitch diameter needs a 20.325 mm pitch diameter."
    ],
    "limitations": [
      "One screw machine maker’s recommendation; follow the roll supplier where it differs.",
      "Single-start roll for external threads on screw machines.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Add starts to obtain a larger, stronger roll that still matches the work’s helix angle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2050–2051. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hobbing-time": {
    "purpose": "Hobbing time for a spur or helical gear from the number of teeth, hob starts, hob diameter and cutting speed, axial feed per work revolution, face width, helix angle, full-depth approach and overrun, for one gear or a stack.",
    "uses": [
      "Quote gear cutting time",
      "Compare single- and multi-start hobs",
      "Balance hobbing with other operations"
    ],
    "users": [
      "Gear manufacturing engineers",
      "Estimators",
      "Machinists"
    ],
    "inputs": {
      "z": "Teeth in the gear being cut.",
      "starts": "Number of threads on the hob.",
      "Dh": "Outside diameter of the hob.",
      "Vc": "Hob cutting speed for the tool and material.",
      "f": "Axial feed of the hob per revolution of the work.",
      "b": "Total face width of the gears cut in one pass.",
      "h": "Whole depth of the tooth (about 2.25 × module).",
      "beta": "Helix angle of the gear.",
      "over": "Run-out beyond the face.",
      "stack": "Number of gears cut together.",
      "load": "Handling time per cycle."
    },
    "outputs": [
      "Hob and work speeds",
      "Cutting time per gear",
      "Floor-to-floor time per gear"
    ],
    "method": [
      "Hob speed n = 1000 V_c ÷ π D_h; work speed = n × starts ÷ z.",
      "Approach for full depth ≈ √[h (D_h − h)].",
      "Travel = b ÷ cos β + approach + overrun; time = travel ÷ (feed × work speed).",
      "Example: 40 teeth with a 1-start 80 mm hob take 5.9709 min to cut."
    ],
    "limitations": [
      "Single climb or conventional pass; roughing and finishing passes add time.",
      "Feeds and speeds come from your tooling supplier and machine.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A two-start hob halves cutting time but coarsens the feed marks; check the finish needed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3347–3349. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "angle-ring-length": {
    "purpose": "Cut length of an angle, flat or other section rolled into a ring, from the diameter at the back of the section and the distance to its neutral axis, or from a handbook-style length constant, for sections placed inside or outside a tank or stack.",
    "uses": [
      "Cut stiffener rings for tanks, ducts and stacks",
      "Estimate material for rolled flanges",
      "Check rolled ring length allowances"
    ],
    "users": [
      "Fabrication supervisors",
      "Manufacturing engineers",
      "Estimators"
    ],
    "inputs": {
      "mode": "Use the section’s neutral-axis distance, or a length constant for the section.",
      "place": "Whether the section sits inside or outside the shell.",
      "D": "Diameter of the shell surface that the back of the section bears on.",
      "x": "Distance from the back of the section to its neutral axis (centroid) in the plane of bending, from section data.",
      "k": "Length constant to subtract (inside) or add (outside), equal to 2π × the neutral-axis distance."
    },
    "outputs": [
      "Cut length",
      "Neutral-axis diameter",
      "Correction to the circumference"
    ],
    "method": [
      "Neutral-axis diameter = D − 2x inside the shell, D + 2x outside.",
      "Length = π × neutral-axis diameter = π D ∓ 2π x.",
      "Handbook example: 20 ft inside diameter with a constant of 4.319 in gives 754 − 4.319 = 749.68 in.",
      "Example: 6096 mm inside a shell with 22.5 mm to the neutral axis needs 19,010 mm."
    ],
    "limitations": [
      "Neutral axis assumed at the centroid; heavy rolling can shift it slightly.",
      "Add allowance for the ends to be trimmed after rolling.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Roll a trial ring for new sections and adjust the constant from the measured result."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2593. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "perforated-open-area": {
    "purpose": "Open area percentage of perforated sheet with round holes on a 60° staggered or straight (square) pattern, holes per square metre, the solid fraction and the mass of a sheet of given size, thickness and density.",
    "uses": [
      "Specify perforated guards, screens and filters",
      "Estimate air or light flow through a perforated panel",
      "Work out perforated sheet weight"
    ],
    "users": [
      "Design engineers",
      "Fabrication supervisors",
      "Buyers"
    ],
    "inputs": {
      "pattern": "Layout of the holes.",
      "d": "Hole diameter.",
      "p": "Distance between adjacent hole centres.",
      "A": "Overall sheet area.",
      "t": "Sheet thickness.",
      "rho": "Density of the sheet material."
    },
    "outputs": [
      "Open area",
      "Holes per square metre",
      "Perforated sheet mass"
    ],
    "method": [
      "60° staggered: open area = 90.69 (d ÷ p)² %, holes per unit area = 1.1547 ÷ p².",
      "Straight rows: open area = 78.54 (d ÷ p)² %, holes per unit area = 1 ÷ p².",
      "Mass = area × thickness × density × (1 − open fraction).",
      "Example: 5 mm holes at 8 mm staggered pitch give 35.426% open area."
    ],
    "limitations": [
      "Margins and unperforated borders are not included.",
      "Strength and stiffness of perforated sheet fall faster than the open area suggests; use the supplier’s effective properties.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Open area sets flow and visibility; ligament width (pitch minus hole) sets punchability and strength."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2607–2608. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sound-level": {
    "purpose": "Noise level of a single machine from the total and background readings by the handbook method, the combined level of up to four sources, and the free-field change in level with distance from a source.",
    "uses": [
      "Measure one machine’s noise in a busy shop",
      "Predict the level when another machine is added",
      "Estimate the level at a work station further away"
    ],
    "users": [
      "Health and safety officers",
      "Maintenance engineers",
      "Plant engineers"
    ],
    "inputs": {
      "mode": "Choose the calculation.",
      "T": "Meter reading with everything running.",
      "B": "Meter reading with the machine in question switched off.",
      "L1": "Level of the first source.",
      "L2": "Level of the second source.",
      "L3": "Level of the third source.",
      "L4": "Level of the fourth source.",
      "Lr": "Level measured at the reference distance.",
      "r1": "Distance of that measurement from the source.",
      "r2": "Distance at which the level is wanted."
    },
    "outputs": [
      "Machine, combined or distant level",
      "Difference from the reference",
      "Measurement validity"
    ],
    "method": [
      "Machine alone: M = 10 log₁₀(10^(T/10) − 10^(B/10)), as in the handbook (51 and 49 dB give 46.7 dB).",
      "Combined: L = 10 log₁₀ Σ 10^(Lᵢ/10).",
      "Distance (free field, point source): L₂ = L₁ − 20 log₁₀(r₂ ÷ r₁).",
      "Example: 51 dB total with 49 dB background puts the machine at 46.671 dB."
    ],
    "limitations": [
      "Levels must be on the same weighting (for example dBA).",
      "Distance law holds in a free field; reverberant shops fall off more slowly.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "When background is 10 dB or more below the total, the total reading is effectively the machine’s level."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3455–3456. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "equivalent-stiffness-thickness": {
    "purpose": "Wall or plate thickness needed in a substitute material (for example plastic replacing metal) for the same bending stiffness and for the same bending strength as the original, the governing thickness, and the resulting mass ratio.",
    "uses": [
      "Replace a metal panel or housing with plastic or composite",
      "Compare aluminium and steel panel thicknesses",
      "Estimate weight saving from a material change"
    ],
    "users": [
      "Design engineers",
      "Product engineers",
      "Materials engineers"
    ],
    "inputs": {
      "t1": "Thickness of the existing part.",
      "E1": "Elastic modulus of the existing material.",
      "S1": "Allowable bending stress of the existing material.",
      "rho1": "Density of the existing material.",
      "E2": "Elastic modulus of the new material at service temperature (use a creep modulus for sustained loads on plastics).",
      "S2": "Allowable bending stress of the new material for the service conditions.",
      "rho2": "Density of the new material."
    },
    "outputs": [
      "Thickness for equal stiffness",
      "Thickness for equal strength",
      "Mass ratio at the governing thickness"
    ],
    "method": [
      "Plates and walls of the same width in bending: stiffness ∝ E t³, so t₂ = t₁ (E₁ ÷ E₂)^(1/3).",
      "Strength ∝ S t², so t₂ = t₁ √(S₁ ÷ S₂).",
      "Governing thickness is the larger; mass ratio = ρ₂ t₂ ÷ ρ₁ t₁.",
      "Example: 2 mm of the original needs 8.1096 mm of the new material for equal stiffness."
    ],
    "limitations": [
      "Same shape and width, bending only; ribs and section changes are usually a better route for plastics.",
      "Plastics creep: use the long-term modulus for sustained loads.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the stiffness thickness is impractical, add ribs or place material away from the neutral axis instead."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 575–580. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "matrix-3x3": {
    "purpose": "Determinant, adjoint (adjugate) and inverse of a 3 × 3 matrix by cofactors, as set out in the handbook’s matrix operations, with a check that the matrix times its inverse returns the identity.",
    "uses": [
      "Invert a transformation or stiffness matrix",
      "Check whether a set of equations has a unique solution",
      "Teach or verify hand matrix work"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Engineering students"
    ],
    "inputs": {
      "a11": "Row 1, column 1.",
      "a12": "Row 1, column 2.",
      "a13": "Row 1, column 3.",
      "a21": "Row 2, column 1.",
      "a22": "Row 2, column 2.",
      "a23": "Row 2, column 3.",
      "a31": "Row 3, column 1.",
      "a32": "Row 3, column 2.",
      "a33": "Row 3, column 3."
    },
    "outputs": [
      "Determinant",
      "Adjoint",
      "Inverse"
    ],
    "method": [
      "Determinant by expansion along the first row.",
      "Adjoint = transpose of the matrix of cofactors.",
      "Inverse = adjoint ÷ determinant (exists only when the determinant is not zero).",
      "Example: the default matrix has a determinant of 1."
    ],
    "limitations": [
      "A determinant near zero relative to the entries means an ill-conditioned matrix; small input errors give large changes in the inverse.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Multiply the inverse by the right-hand side vector to solve the three equations."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 122–125. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "wood-moisture-density": {
    "purpose": "Moisture content of wood from its wet and oven-dry mass, and the density of wood at any moisture content from its specific gravity by the handbook formula, with the mass of a piece at that moisture content.",
    "uses": [
      "Check timber for crating, patterns or jigs before use",
      "Estimate the weight of timber at delivery moisture",
      "Track drying of seasoned stock"
    ],
    "users": [
      "Pattern makers",
      "Packaging and crating supervisors",
      "Buyers"
    ],
    "inputs": {
      "wet": "Mass of the sample as received.",
      "dry": "Mass after oven drying to constant weight.",
      "G": "Specific gravity of the species (oven-dry mass ÷ volume at the stated moisture, from wood property data).",
      "M": "Moisture content at which density is wanted.",
      "V": "Volume of a piece for its mass."
    },
    "outputs": [
      "Moisture content of the sample",
      "Density at the moisture content",
      "Mass of the piece"
    ],
    "method": [
      "Moisture content = (wet − oven-dry) ÷ oven-dry × 100%.",
      "Density ρ = 1000 G (1 + M ÷ 100) ÷ (1 + 0.009 G M) kg/m³ — the handbook’s 62.4 G (1 + M/100) ÷ (1 + G × 0.009 × M) lb/ft³.",
      "Example: 12.5 g drying to 10 g is 25% moisture; at 12% the wood weighs 531.31 kg/m³."
    ],
    "limitations": [
      "The density formula applies below fibre saturation, about 30% moisture.",
      "Specific gravity varies within a species; use measured values for weight-critical work.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Timber for patterns and jigs should be dried close to the moisture it will live at to avoid movement."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 386–387, 3019. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
