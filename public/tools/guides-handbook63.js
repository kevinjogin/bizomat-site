// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook63).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "gear-tooth-top-land-check": {
    "purpose": "Check of a spur gear tooth form: the pitch and base radii, the tooth thickness at the pitch circle with profile shift, the tip radius, the involute function at the pressure angle and at the tip (as the trigonometric functions tool), the tooth thickness at the tip (top land), the radius at which the tooth would come to a point found from the involute value (as the same tool, angle from an involute value), and the least profile shift that avoids undercut, against your least top land.",
    "uses": [
      "Check a small pinion with profile shift",
      "Find the largest profile shift before teeth point",
      "Check a gear with long addendum"
    ],
    "users": [
      "Gear designers",
      "Design engineers",
      "Gear cutters"
    ],
    "inputs": {
      "m": "Module of the gear.",
      "z": "Number of teeth.",
      "phi": "Standard pressure angle.",
      "x": "Profile shift coefficient (positive moves the tooth outwards, thickening it at the root).",
      "ha": "Addendum as a multiple of the module (1 for standard teeth).",
      "saMin": "Least tooth thickness at the tip as a multiple of the module (often 0.25–0.4 for hardened gears)."
    },
    "outputs": [
      "Pitch, base and tip radii, tooth thickness",
      "Top land and pointed radius",
      "Undercut and top land checks"
    ],
    "method": [
      "r = m z ÷ 2; r_b = r cos φ; tooth thickness s = m (π ÷ 2 + 2x tan φ); tip radius r_a = r + m (h_a + x).",
      "inv φ = tan φ − φ (as the trigonometric functions tool); φ_a = acos (r_b ÷ r_a); top land s_a = 2r_a (s ÷ 2r + inv φ − inv φ_a).",
      "Pointed when inv φ_p = s ÷ 2r + inv φ, solved for φ_p (as the same tool) at r_p = r_b ÷ cos φ_p; no undercut when x ≥ h_a − z sin² φ ÷ 2.",
      "Example: top land 0.87148 mm (0.43574 m); the tooth would point at 15.117 mm against a 14.6 mm tip."
    ],
    "limitations": [
      "Rack-generated involute teeth; shaper-cut and tip-relieved teeth differ.",
      "Undercut limit for a full rack without tip rounding.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Profile shift cures undercut on small pinions but thins the top land; the two limits set the useful range of shift."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 95–114, 2141–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "relief-valve-spring-check": {
    "purpose": "Check of the spring of a direct-acting poppet or ball relief valve: the spring rate, installed load and shear stress at the closed length (as the compression spring tool), the cracking pressure from the installed load over the seat area, the pressure at full lift from the extra spring load, the overpressure (accumulation) between them, the stress at full lift and the clearance to solid, against the set pressure and tolerance wanted, the allowed overpressure and the allowable stress.",
    "uses": [
      "Set the spring for a small relief or check valve",
      "Find why a relief valve chatters or overpressures",
      "Re-shim a valve to a new set pressure"
    ],
    "users": [
      "Hydraulic engineers",
      "Valve designers",
      "Maintenance engineers"
    ],
    "inputs": {
      "ds": "Diameter of the seat where the poppet or ball seals (the area the pressure acts on).",
      "lift": "How far the poppet opens at full flow.",
      "preq": "Pressure the valve should start to open at.",
      "tolP": "How far the cracking pressure may be from the wanted pressure.",
      "overMax": "Largest rise above cracking pressure allowed at full lift.",
      "d": "Wire diameter.",
      "D": "Mean coil diameter.",
      "Na": "Active coils.",
      "ends": "End type of the spring.",
      "G": "Shear modulus of the spring wire.",
      "L0": "Length of the spring with no load.",
      "Lw": "Length of the spring fitted in the valve with the valve shut.",
      "allow": "Allowable shear stress for the spring wire and duty."
    },
    "outputs": [
      "Spring rate, installed load and stress",
      "Cracking and full-lift pressure, overpressure",
      "Checks against the set pressure, stress and solid"
    ],
    "method": [
      "k = G d⁴ ÷ (8 D³ N_a); load F = k (L₀ − L); τ = K 8 F D ÷ (π d³) with the Wahl factor (as the compression spring tool).",
      "Seat area A = π d_s² ÷ 4; cracking pressure = F_installed ÷ A; full-lift pressure = k (L₀ − L_w + lift) ÷ A.",
      "Overpressure = full-lift ÷ cracking − 1; length at full lift against the solid length.",
      "Example: cracks at 0.92439 MPa, 1.0168 MPa at full lift (10% over); 481.58 MPa in the spring."
    ],
    "limitations": [
      "Static balance on the seat area; flow forces on an open poppet change the full-lift pressure.",
      "Spring at room temperature; hot oil lowers G slightly.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A softer spring (more coils) cuts the overpressure but needs more installed compression for the same set pressure."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–324. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pipe-support-span-check": {
    "purpose": "Check of the span between pipe supports: the section area, second moment of area and section modulus of the pipe, the weight per metre of pipe, contents and insulation, then the bending moment, stress and sag for simply supported, fixed or one-end-fixed spans under the uniform load (closed forms, the fixed cases as the beam cases tool), and the longest span that keeps both stress and sag within your limits.",
    "uses": [
      "Space hangers for a water or process line",
      "Check an existing pipe rack span",
      "See how insulation or a heavier fluid shortens the span"
    ],
    "users": [
      "Piping designers",
      "Plant engineers",
      "Mechanical contractors"
    ],
    "inputs": {
      "OD": "Outside diameter of the pipe.",
      "t": "Wall thickness (less corrosion allowance for a design check).",
      "rhoP": "Density of the pipe material.",
      "rhoF": "Density of the contents (0 for empty gas lines; 1000 for water).",
      "mIns": "Mass per metre of insulation, cladding and trace heating.",
      "E": "Modulus of elasticity of the pipe.",
      "ends": "How the span is restrained by the supports and neighbouring spans.",
      "L": "Distance between supports.",
      "sA": "Allowable bending stress for sustained loads (often well below the material allowable, to leave room for pressure stress).",
      "dA": "Largest sag at mid-span you accept (small values avoid pockets that do not drain)."
    },
    "outputs": [
      "Pipe section and weight per metre",
      "Moment, stress and sag",
      "Longest span for stress and sag"
    ],
    "method": [
      "A = π (D² − d²) ÷ 4; I = π (D⁴ − d⁴) ÷ 64; Z = 2I ÷ D; weight w = g (A ρ_pipe + π d² ρ_fluid ÷ 4 + insulation).",
      "Simply supported: M = wL² ÷ 8, sag = 5wL⁴ ÷ 384EI; fixed both ends and fixed–supported as the beam cases tool for a uniform load.",
      "Stress grows with L² and sag with L⁴, so the longest spans are L √(σ_allow ÷ σ) and L (δ_allow ÷ δ)^¼.",
      "Example: 7.6006 kg/m gives 9.1387 MPa and 1.4208 mm sag; the span may be up to 3,455.2 mm."
    ],
    "limitations": [
      "Straight horizontal span with uniform load; valves, flanges and branches add point loads.",
      "Sustained weight only; pressure, thermal and seismic stresses are separate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For small pipes the sag limit usually governs; for large pipes the stress does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 234–246, 257–277. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cart-push-force-check": {
    "purpose": "Check of a manually pushed cart, trolley or dolly: the rolling resistance from the load, wheel radius and coefficient of rolling resistance (as the rolling resistance tool), the force to push the load up the slope (as the inclined plane tool, with rolling instead of sliding), the force to accelerate it from rest, the starting and keep-moving push forces, and the load on each wheel with the number sharing the load on an uneven floor, against your push force limits and the wheel rating.",
    "uses": [
      "Check a trolley design against push force limits",
      "Choose wheel size and type for a floor",
      "See how a ramp changes the push force"
    ],
    "users": [
      "Design engineers",
      "Safety advisers",
      "Materials handling engineers"
    ],
    "inputs": {
      "mass": "Mass of the cart and its load.",
      "n": "Number of wheels or castors.",
      "nShare": "Wheels that carry the load when the floor is uneven (often one fewer than fitted for four wheels).",
      "Dw": "Wheel diameter.",
      "f": "Coefficient of rolling resistance (lever arm, mm) for the wheel tread and floor; soft treads and soft floors are higher.",
      "slope": "Slope of the floor or ramp.",
      "acc": "Acceleration from rest when starting the push.",
      "Fstart": "Largest force a person should apply to start the cart (from your manual handling guidance).",
      "Fkeep": "Largest force to keep it moving.",
      "wheelRating": "Load rating of each wheel or castor."
    },
    "outputs": [
      "Rolling, slope and acceleration forces",
      "Starting and keep-moving push",
      "Wheel load"
    ],
    "method": [
      "Rolling resistance F = W cos θ × f ÷ r (as the rolling resistance tool).",
      "Slope force = W sin θ (as the inclined plane tool with no sliding friction); acceleration force = m a.",
      "Start = rolling + slope + acceleration; keep moving = rolling + slope; wheel load = W ÷ wheels sharing.",
      "Example: 212.28 N to start and 122.28 N to keep moving; each wheel carries 980.66 N."
    ],
    "limitations": [
      "Swivel castor alignment and bearing friction add to the starting force.",
      "Push forces only; pulling, turning and stopping on slopes need separate checks.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Doubling the wheel diameter halves the rolling resistance; on a ramp the slope force soon dominates."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "taper-turning-setup": {
    "purpose": "Set-up of a lathe to turn a taper: the taper per unit length and per foot on diameter, the half angle and included angle from the tangent (as the trigonometric functions tool), the tailstock offset for turning between centres over the whole length of the work, and the compound slide setting, against the largest tailstock offset the lathe and centres allow.",
    "uses": [
      "Set over the tailstock for a long gentle taper",
      "Set the compound for a short steep taper",
      "Convert a drawing taper to an angle"
    ],
    "users": [
      "Machinists",
      "Apprentices",
      "Toolmakers"
    ],
    "inputs": {
      "D": "Diameter at the large end of the taper.",
      "d": "Diameter at the small end.",
      "l": "Length of the tapered part along the axis.",
      "Lw": "Overall length of the work between the centre points (the offset method tapers the whole length).",
      "offMax": "Largest set-over the tailstock and centre holes allow without damage."
    },
    "outputs": [
      "Taper per unit length and per foot",
      "Half and included angle",
      "Tailstock offset and compound setting"
    ],
    "method": [
      "Taper = (D − d) ÷ l on diameter; per foot = 12 × that.",
      "Half angle α = atan ((D − d) ÷ 2l) (as the trigonometric functions tool); included angle 2α; the compound slide is set to α.",
      "Tailstock offset = (D − d) ÷ 2 × L_w ÷ l.",
      "Example: 1 per foot, half angle 2.3859°; offset the tailstock 6.25 mm."
    ],
    "limitations": [
      "Offset method assumes the centres sit in the centre holes at the set-over; large offsets wear the centre holes.",
      "Taper attachments and CNC turning avoid both limits.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The tailstock offset suits long gentle tapers; the compound suits short steep ones because its travel is short."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 95–114, 682–691. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "wall-jib-crane-check": {
    "purpose": "Check of a wall jib crane with a pinned I-section jib supported at its outer end by a tie: the section area, second moment and section modulus of the jib (as the section shapes tool), the tie tension and beam compression with the load at the end, the bending moment and deflection with the load at mid-reach (as the beam cases tool for a central point load), the combined bending and axial stress, the tie rod stress, and the wall pull shared by the top bolts, against your allowable stresses, deflection limit and bolt capacity.",
    "uses": [
      "Check a workshop wall jib",
      "Size the tie rod and wall bolts",
      "Check a jib for a heavier hoist"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Structural detailers"
    ],
    "inputs": {
      "W": "Rated load plus hoist, trolley and an allowance for dynamic effects.",
      "L": "Distance from the wall pin to where the tie meets the jib.",
      "ang": "Angle between the tie and the jib.",
      "H": "Overall depth of the jib section.",
      "B": "Flange width.",
      "tf": "Flange thickness.",
      "tw": "Web thickness.",
      "E": "Modulus of elasticity.",
      "sA": "Allowable combined bending and axial stress.",
      "dlim": "Largest deflection as a fraction of the reach.",
      "dt": "Tie rod diameter at its weakest section (thread root).",
      "tA": "Allowable tensile stress in the tie.",
      "nb": "Bolts at the top wall bracket that take the tie’s horizontal pull.",
      "Fb": "Allowable tension in each wall bolt or anchor."
    },
    "outputs": [
      "Jib section properties",
      "Tie tension, beam moment, stresses and deflection",
      "Tie rod and wall bolt checks"
    ],
    "method": [
      "A, I and Z of the I-section (as the section shapes tool).",
      "Load at the end: tie T = W ÷ sin θ; wall pull = T cos θ. Load at mid-reach: M = W L ÷ 4 and deflection W L³ ÷ 48EI (as the beam cases tool), with axial compression W cos θ ÷ (2 sin θ).",
      "Combined stress = M ÷ Z + N ÷ A; tie stress = T ÷ (π d² ÷ 4); bolt load = wall pull ÷ bolts.",
      "Example: tie 20 kN; jib 43.816 MPa and 1.5239 mm deflection; 4,330.1 N per wall bolt."
    ],
    "limitations": [
      "Pinned jib and tie, load on the jib centre line; lateral-torsional buckling of the jib and trolley wheel loads on the flange are not checked.",
      "Static load including the dynamic allowance you add to it.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A steeper tie (larger angle) cuts the tie tension and the jib compression sharply."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 234–246, 257–277, 153–163. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "step-cone-pulley-design": {
    "purpose": "Design of matched step (cone) pulleys driven by a crossed belt: output speeds in geometric progression between the lowest and highest speed with the step ratio fitted to the number of steps (as the progression tool), the driver and driven diameter of each step with a constant diameter sum so the same crossed belt fits every step, and the belt length and wrap (as the crossed belt length tool), against the smallest pulley diameter you allow.",
    "uses": [
      "Lay out step pulleys for a drill press or lathe",
      "Replace a worn cone pulley pair",
      "Choose speeds for a belt-driven machine"
    ],
    "users": [
      "Machine builders",
      "Restorers",
      "Design engineers"
    ],
    "inputs": {
      "nIn": "Speed of the driving shaft.",
      "nMin": "Slowest output speed wanted.",
      "nMax": "Fastest output speed wanted.",
      "k": "Number of steps on each pulley.",
      "S": "Driver plus driven diameter, the same for every step with a crossed belt.",
      "C": "Distance between the shaft centres.",
      "dMin": "Smallest diameter the belt can bend round without damage."
    },
    "outputs": [
      "Speed ratio and output speeds",
      "Diameters of each step",
      "Belt length and smallest pulley"
    ],
    "method": [
      "Step ratio r = (n_max ÷ n_min)^(1 ÷ (k − 1)); speeds n_i = n_min r^i (as the progression tool).",
      "Driver d₁ = S n_i ÷ (n_in + n_i); driven d₂ = S n_in ÷ (n_in + n_i), so d₁ + d₂ = S on every step.",
      "Crossed belt length depends only on the diameter sum, so one belt fits every step (as the crossed belt length tool).",
      "Example: step ratio 2; the smallest step is 80 mm and the belt 1,895.6 mm long."
    ],
    "limitations": [
      "Crossed belt for exact equal lengths; with an open belt the diameter sums differ slightly between steps.",
      "Belt slip of a few per cent lowers each output speed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Speeds in geometric progression give the same percentage step everywhere, which suits cutting speeds on a range of diameters."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 37–39, 2473–2490. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hydraulic-hand-jack-check": {
    "purpose": "Check of a hand-operated hydraulic jack or press: the force on the pump plunger from the handle effort and lever arms (as the lever force tool), the pressure from the plunger area, the lifting force of the ram with an efficiency, the effort needed for the rated load, and the number of pump strokes to raise the ram by the lift height from the ratio of displaced volumes, against the load, the system pressure rating and a limit on strokes.",
    "uses": [
      "Check a bottle jack or workshop press",
      "Choose plunger and ram sizes for a hand pump",
      "Find the handle effort for a given load"
    ],
    "users": [
      "Design engineers",
      "Maintenance fitters",
      "Engineering students"
    ],
    "inputs": {
      "F": "Force the operator applies at the end of the handle.",
      "x": "Distance from the handle pivot to the hand position.",
      "a": "Distance from the handle pivot to the plunger pin.",
      "dp": "Diameter of the pump plunger.",
      "Dr": "Diameter of the lifting ram.",
      "eff": "Overall efficiency of the pump and ram (seal friction and leakage).",
      "Wreq": "Load the jack must lift.",
      "pRated": "Highest pressure the jack is rated for (relief valve setting).",
      "h": "Height the ram must rise.",
      "sp": "Stroke of the pump plunger per handle stroke.",
      "maxStrokes": "Most handle strokes acceptable for the lift."
    },
    "outputs": [
      "Plunger force and pressure",
      "Lifting force and effort for the load",
      "Pressure and strokes for the lift"
    ],
    "method": [
      "Plunger force = effort × handle length ÷ pivot distance (as the lever force tool).",
      "Pressure p = plunger force ÷ (π d_p² ÷ 4); lifting force = p × π D_r² ÷ 4 × efficiency.",
      "Pressure for the load = W ÷ (π D_r² ÷ 4 × η); strokes = D_r² h ÷ (d_p² s_p), rounded up.",
      "Example: 33.157 MPa lifts 37.5 kN; 84 strokes raise it 150 mm."
    ],
    "limitations": [
      "Static balance; seal friction varies with pressure and is taken in the efficiency.",
      "Leakage past the check valves adds strokes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The force multiplication is the lever ratio times the area ratio; the strokes needed grow with the same area ratio."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 167–168, 3024–3027. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "capstan-rope-turns-check": {
    "purpose": "Check of rope turns on a bollard, capstan, winch drum or post: the ratio of tight to slack tension from the friction coefficient and wrap angle (as the belt friction tool, capstan equation), the holding force needed with the turns used, the turns needed for the holding force a person can apply, and the rope working load from its breaking strength and safety factor, against the load.",
    "uses": [
      "Find the turns needed to snub a load on a post",
      "Check a capstan winch line pull",
      "Lower a load by hand round a bollard"
    ],
    "users": [
      "Riggers",
      "Arborists",
      "Marine and rescue crews"
    ],
    "inputs": {
      "T1": "Tension on the load side of the rope.",
      "T2max": "Force the person tending the rope can safely hold.",
      "mu": "Friction coefficient between the rope and the post or drum (wet, glazed or rope-on-rope contact is lower).",
      "turns": "Complete turns of rope around the post (one turn = 360° of wrap).",
      "MBL": "Minimum breaking load of the rope.",
      "SF": "Safety factor applied to the breaking load for the working load."
    },
    "outputs": [
      "Tension ratio for the turns used",
      "Holding force needed and turns needed",
      "Rope working load"
    ],
    "method": [
      "T₁ ÷ T₂ = e^{μθ} with θ = 2π × turns (as the belt friction tool).",
      "Holding force = T₁ ÷ e^{μθ}; turns needed = ln (T₁ ÷ T₂) ÷ (2π μ).",
      "Working load = breaking load ÷ safety factor.",
      "Example: 3 turns give a ratio of 111.32; hold 179.67 N; at least 2.6736 turns are needed."
    ],
    "limitations": [
      "Rope fully bedded on a round post; rope stiffness and crossing turns change the friction.",
      "Static holding; surging a rope round a capstan heats and wears it.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Each extra turn multiplies the holding power by the same large factor, which is why a few turns hold a heavy load."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 165–168, 2473–2490. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
