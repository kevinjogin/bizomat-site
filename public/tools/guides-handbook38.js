// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook38).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "rotor-balancing-check": {
    "purpose": "Two-plane balancing check of a rigid rotor: permissible residual unbalance from the balance quality grade, mass and speed, split equally between two correction planes (as the balance grade tool), the unbalance in each plane resolved from up to three known or measured unbalance masses (as the two-plane balance tool), the correction mass and angle in each plane at its correction radius, the rotating force the initial unbalance puts on the bearings, and whether the corrections fit within your largest practical correction mass.",
    "uses": [
      "Decide whether a rotor needs balancing for its grade",
      "Work out correction weights in two planes",
      "Estimate the bearing force from unbalance"
    ],
    "users": [
      "Maintenance engineers",
      "Balancing technicians",
      "Design engineers"
    ],
    "inputs": {
      "mass": "Mass of the rotor.",
      "rpm": "Highest service speed.",
      "G": "Balance quality grade for the machine type, e.g. 6.3 or 2.5 (your value from ISO 21940-11 / ISO 1940-1).",
      "L": "Axial distance between the two correction planes.",
      "rA": "Radius at which weights are added or removed in plane A.",
      "rB": "Radius at which weights are added or removed in plane B.",
      "mMax": "Largest single weight you can fit or remove at the correction radius.",
      "m1": "Mass of unbalance 1 (0 if not used).",
      "r1": "Radius of unbalance 1.",
      "a1": "Angular position of unbalance 1.",
      "z1": "Axial distance of unbalance 1 from plane A towards plane B.",
      "m2": "Mass of unbalance 2 (0 if not used).",
      "r2": "Radius of unbalance 2.",
      "a2": "Angular position of unbalance 2.",
      "z2": "Axial distance of unbalance 2 from plane A towards plane B.",
      "m3": "Mass of unbalance 3 (0 if not used).",
      "r3": "Radius of unbalance 3.",
      "a3": "Angular position of unbalance 3.",
      "z3": "Axial distance of unbalance 3 from plane A towards plane B."
    },
    "outputs": [
      "Permissible residual unbalance per plane",
      "Unbalance and corrections in each plane",
      "Bearing force from the initial unbalance"
    ],
    "method": [
      "Permissible eccentricity e = G ÷ ω; permissible unbalance U = e × mass, half to each plane (as the balance grade tool).",
      "Resolve each unbalance m r at angle a into the planes by moments about plane A (as the two-plane balance tool): U_B = −Σ m r z ÷ L, U_A = −Σ m r − U_B (as vectors).",
      "Correction mass = U ÷ correction radius, at the angle of the correcting vector.",
      "Rotating force = U ω² (U in kg·m).",
      "Example: grade G6.3 at 3000 rpm allows 250.67 g·mm per plane; plane A carries 2,704.2 g·mm and needs 27.042 g at 193.9°."
    ],
    "limitations": [
      "Rigid rotor below its first bending critical speed; flexible rotors need modal balancing.",
      "Equal split of the permissible unbalance; ISO allows an allocation by bearing distances.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Correct at the largest radius available: the correction mass falls in proportion."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 191–195. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 21940-11 Mechanical vibration — Rotor balancing — Procedures and tolerances for rotors with rigid behaviour"
    ]
  },
  "gear-tooth-measurement": {
    "purpose": "Inspection dimensions for an external involute gear cut thin for backlash: the tooth thickness reduction for this gear’s share of the normal backlash range, the number of teeth spanned and the base tangent length (span) at nominal and at both backlash limits (as the span measurement tool), the face width the anvils need on a helical gear, and for spur gears the measurement over pins at nominal and at both limits (as the gear over pins tool).",
    "uses": [
      "Set the inspection limits for a gear drawing",
      "Convert a backlash requirement into a span measurement",
      "Check a gear on the shop floor with a micrometer"
    ],
    "users": [
      "Gear engineers",
      "Inspectors",
      "Machinists"
    ],
    "inputs": {
      "mn": "Normal module.",
      "z": "Number of teeth.",
      "alphan": "Normal pressure angle.",
      "beta": "Helix angle; 0 for a spur gear (over-pins values are given for spur gears).",
      "x": "Profile shift coefficient of this gear.",
      "b": "Face width (for the span anvils on a helical gear).",
      "jnMin": "Smallest normal backlash the pair must have.",
      "jnMax": "Largest normal backlash the pair may have.",
      "share": "How much of the backlash comes from thinning this gear (50% for equal sharing).",
      "dp": "Pin or ball diameter for the over-pins check."
    },
    "outputs": [
      "Tooth thinning for the backlash limits",
      "Teeth spanned and span measurement limits",
      "Measurement over pins limits (spur gears)"
    ],
    "method": [
      "Normal backlash j_n = (Δs₁ + Δs₂) cos α_n, so this gear’s thinning Δs = share × j_n ÷ cos α_n; the span falls by share × j_n.",
      "Span W = m_n cos α_n [π(k − 0.5) + z inv α_t] + 2x m_n sin α_n with k from the usual rule (as the span measurement tool); anvils need a face width of W sin β cos α_n.",
      "Over pins (spur): solve inv φ = s ÷ d + inv α + d_p ÷ d_b − π ÷ z with the thinned tooth thickness s; M = d_b ÷ cos φ + d_p (even teeth) (as the gear over pins tool).",
      "Example: span over 4 teeth should read 32.178–32.218 mm (nominal 32.258 mm)."
    ],
    "limitations": [
      "External gears; internal gears need a different method.",
      "Over-pins values are for spur gears; helical gears need the helical over-balls formula.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The span is easier to measure on the machine and does not depend on the outside diameter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2236–2248. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thread-wire-inspection": {
    "purpose": "Three-wire inspection of a symmetrical external thread: best wire size and the wire constant for the flank angle (as the three-wire tool), the measurement over wires expected at the largest and smallest permitted pitch diameter, the pitch diameter worked back from your reading, and accept or reject against the limits (which you can take from the metric thread limits tool for the class).",
    "uses": [
      "Inspect a thread with wires and a micrometer",
      "Set over-wire limits for a thread drawing",
      "Check a thread between gauges"
    ],
    "users": [
      "Inspectors",
      "Machinists",
      "Quality engineers"
    ],
    "inputs": {
      "angle": "Included flank angle of the thread.",
      "P": "Pitch of the thread.",
      "d2max": "Upper limit of pitch diameter (for example from the metric thread limits tool).",
      "d2min": "Lower limit of pitch diameter.",
      "W": "Diameter of the wires actually used; 0 uses the best size.",
      "Mmeas": "Micrometer reading over the three wires."
    },
    "outputs": [
      "Best wire and the wire constant",
      "Over-wire limits for the pitch diameter limits",
      "Pitch diameter from the reading and the decision"
    ],
    "method": [
      "Best wire W = (P ÷ 2) ÷ cos(α ÷ 2); wire constant k = W [1 + 1 ÷ sin(α ÷ 2)] − (P ÷ 2) ÷ tan(α ÷ 2) (as the three-wire tool).",
      "Over-wire limits M = E + k at the largest and smallest pitch diameter E.",
      "Measured pitch diameter E = M_read − k; accept when it lies within the limits.",
      "Example: the reading should lie between 10.161 and 10.293 mm; 10.25 mm gives a pitch diameter of 8.951 mm."
    ],
    "limitations": [
      "No lead-angle correction; multi-start and coarse threads need it.",
      "Measuring force and wire accuracy affect the result at the micrometre level.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use wires close to the best size so they touch the flanks at the pitch line."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1990–2003, 1867–1912. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "torsion-bar-design": {
    "purpose": "Design of a solid round torsion bar spring: torque from load and arm, the least diameter for the allowable shear stress and the least for the largest twist, the governing diameter, and with the diameter you choose the shear stress, twist, torsional rate, arm-tip travel (as the torsion bar tool) and energy stored.",
    "uses": [
      "Size a torsion bar for a counterbalance or suspension",
      "Check a bar for a higher load",
      "Trade length against diameter"
    ],
    "users": [
      "Design engineers",
      "Vehicle engineers",
      "Machine designers"
    ],
    "inputs": {
      "F": "Load applied at the end of the arm.",
      "arm": "Length of the lever arm.",
      "L": "Active length of the bar between the fixed end and the arm.",
      "G": "Shear modulus of the bar.",
      "allow": "Allowable shear stress for the duty (your value; presetting raises it).",
      "thMax": "Largest twist you allow (for travel or stops).",
      "d": "Diameter you intend to use."
    },
    "outputs": [
      "Diameter needed for stress and for twist",
      "Stress, twist, rate and tip travel with the chosen diameter",
      "Energy stored"
    ],
    "method": [
      "Torque T = F × arm.",
      "Diameter for stress d = (16T ÷ π τ_allow)^⅓; for twist d = (32 T L ÷ π G θ_max)^¼.",
      "τ = 16T ÷ π d³; θ = T L ÷ G J with J = π d⁴ ÷ 32; rate = G J ÷ L; tip travel = arm × θ (as the torsion bar tool); energy = T θ ÷ 2.",
      "Example: 1000 N on a 200 mm arm needs 18.524 mm; a 20 mm bar twists 7.3595° at 127.32 MPa."
    ],
    "limitations": [
      "Solid round bar; the splined or hexagon ends need a larger diameter and their own stress check.",
      "Static stress; fatigue governs repeated loading.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A longer bar twists more for the same stress: use length, not diameter, to soften the rate."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303, 344. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tube-bending-plan": {
    "purpose": "Plan for rotary-draw or press bending of a round tube: developed length from straights and bend arcs (as the tube bend length tool), outer and inner wall thickness after bending and the thinning share (as the tube bend thinning tool), outer-fibre strain against the tube’s elongation, the centreline radius ÷ diameter and diameter ÷ wall ratios, and the angle to bend to with your springback allowance.",
    "uses": [
      "Cut tube to length for a bent part",
      "Check whether a tight bend will thin or crack the tube",
      "Set the bend angle on the bender"
    ],
    "users": [
      "Fabricators",
      "Tube bender operators",
      "Design engineers"
    ],
    "inputs": {
      "D": "Outside diameter of the tube.",
      "t": "Wall thickness before bending.",
      "R": "Radius of the bend measured to the tube centreline.",
      "angle": "Angle of each bend.",
      "bends": "Number of bends of this radius and angle.",
      "straight": "Sum of all the straight lengths between and beyond the bends.",
      "tmin": "Least wall the part may have after bending (pressure rating, code).",
      "RDmin": "Tightest radius as a multiple of diameter your tooling can bend without mandrel problems (your value).",
      "elong": "Tensile elongation of the tube material (from the certificate).",
      "spring": "Extra angle to bend beyond the target, as a share of the angle, for springback (your value from trial bends)."
    },
    "outputs": [
      "Developed (cut) length",
      "Wall thickness after bending and the thinning share",
      "Strain, ratios and the angle to bend to"
    ],
    "method": [
      "Developed length = straights + bends × π R θ ÷ 180 (as the tube bend length tool).",
      "Outer wall ≈ t R ÷ (R + D ÷ 2); inner wall ≈ t R ÷ (R − D ÷ 2) (as the tube bend thinning tool).",
      "Outer-fibre strain ≈ (D ÷ 2) ÷ R.",
      "Bend-to angle = angle × (1 + springback share).",
      "Example: cut 776.99 mm; the outside wall thins to 1.6552 mm (17.241%) with 20.833% outer strain; bend to 92.7°."
    ],
    "limitations": [
      "Simple thinning estimate; mandrels, wipers and pressure dies change the real wall.",
      "Ovality is not calculated; thin-walled tubes at tight radii need a mandrel.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Thinning and strain fall quickly as the bend radius grows: one size larger die is often the easiest fix."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1382–1386. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shaft-deflection-check": {
    "purpose": "Stiffness check of a simply supported round shaft carrying up to three transverse point loads in one plane: bearing reactions, bending moment and stress at the loads, deflection at each load and the largest deflection along the span by superposition, and the slope at each bearing, against your limits for gear mesh deflection, bearing misalignment and stress (for one load, the reactions, moment and largest deflection match the beam cases tool).",
    "uses": [
      "Check a gear shaft for mesh deflection",
      "Check bearing tilt against the bearing’s misalignment limit",
      "Choose a shaft diameter for stiffness"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Power transmission engineers"
    ],
    "inputs": {
      "d": "Diameter of the shaft (uniform).",
      "L": "Distance between the bearing centres.",
      "E": "Elastic modulus of the shaft.",
      "P1": "First load (gear force, belt pull) at right angles to the shaft.",
      "a1": "Its distance from bearing A.",
      "P2": "Second load (0 if none); use a negative value for a load in the opposite direction.",
      "a2": "Its distance from bearing A.",
      "P3": "Third load (0 if none).",
      "a3": "Its distance from bearing A.",
      "yMax": "Largest deflection you accept at a gear (a common guide for spur gears is about 0.13 mm; your value).",
      "slMax": "Largest slope you accept at the bearings (from the bearing maker for the bearing type).",
      "allow": "Allowable bending stress (your design value, allowing for fatigue)."
    },
    "outputs": [
      "Reactions and bending stress",
      "Deflection at the loads and the largest deflection",
      "Slope at each bearing"
    ],
    "method": [
      "Reactions R_A = Σ P (L − a) ÷ L, R_B = Σ P a ÷ L; bending stress σ = 32 M ÷ (π d³).",
      "Deflection at x from each load: for x ≤ a, y = P b x (L² − b² − x²) ÷ (6EIL), b = L − a; for x > a, y = P a (L − x)(2Lx − a² − x²) ÷ (6EIL); summed.",
      "Slopes θ_A = Σ P b (L² − b²) ÷ (6EIL), θ_B = Σ P a (L² − a²) ÷ (6EIL).",
      "Example: a 70 mm shaft deflects 0.11167 mm at load 1 and tilts 0.67731 mrad at bearing A; the stress is 25.737 MPa."
    ],
    "limitations": [
      "Uniform shaft, simple supports, loads in one plane; combine two planes as vectors.",
      "Bearing and housing flexibility add to the slope and deflection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Stiffness rises with the fourth power of diameter: a small diameter increase cuts deflection a lot."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 257–277, 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "electroplating-plan": {
    "purpose": "Plan of a rack or barrel electroplating job: deposition rate and time to thickness by Faraday’s law with cathode efficiency (as the electroplating thickness tool), total current for the load against the rectifier capacity and current density against your window, loads for the batch and total hours with handling time, metal deposited, electrical energy, and cost per part from metal, energy and labour.",
    "uses": [
      "Quote a plating job",
      "Check whether a rectifier can run a bigger load",
      "Estimate metal and power used per part"
    ],
    "users": [
      "Platers",
      "Estimators",
      "Process engineers"
    ],
    "inputs": {
      "metal": "Metal deposited and its valence in the bath.",
      "J": "Cathode current density.",
      "eff": "Share of current that deposits metal (cathode efficiency).",
      "thick": "Average thickness wanted.",
      "ap": "Plated area of one part.",
      "np": "Parts on one rack or in one barrel load.",
      "batch": "Parts to plate.",
      "rect": "Largest current of the rectifier.",
      "Jmin": "Low end of the current-density window for the bath (your value).",
      "Jmax": "High end of the window (your value).",
      "V": "Voltage across the tank at this current.",
      "handle": "Time to load, rinse and unload each load.",
      "pE": "Price of electricity.",
      "pM": "Price of the anode metal per kilogram.",
      "rate": "Labour and overhead per hour of line time."
    },
    "outputs": [
      "Deposition rate, time and current per load",
      "Loads, hours and metal for the batch",
      "Energy and cost per part"
    ],
    "method": [
      "Mass rate per area = J × efficiency × atomic mass ÷ (valence × 96 485); rate = mass rate ÷ density; time = thickness ÷ rate (as the electroplating thickness tool).",
      "Current = J × area per part × parts per load.",
      "Loads = batch ÷ parts per load (rounded up); hours = loads × (time + handling) ÷ 60.",
      "Cost per part = (metal × price + V I t × price of energy + hours × rate) ÷ batch.",
      "Example: 20 µm takes 25.691 min at 80 A per load; the batch needs 25 loads and costs about 0.91137 per part."
    ],
    "limitations": [
      "Average thickness; edges plate thicker and recesses thinner.",
      "Costs exclude chemicals, waste treatment and rework.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the rectifier limits the load, fewer parts per rack at the same current density keep quality and time."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1467, 1500–1516. Topic reference; no source tables or recommended settings are reproduced.",
      "Atomic masses: IUPAC Commission on Isotopic Abundances and Atomic Weights — https://ciaaw.org"
    ]
  },
  "bracket-bolt-tension": {
    "purpose": "Check of a bracket bolted to a column or wall face with the load acting at a distance from the face: the moment taken by bolt tension with the bracket pivoting about its bottom edge, tension in each bolt row in proportion to its distance from the pivot, the tension in the most loaded bolt, the shear shared equally by all the bolts (as the bolt and pin shear tool), stresses on the thread stress area and shank, and the elliptical tension–shear interaction.",
    "uses": [
      "Check the bolts of a wall or column bracket",
      "Choose bolt size and row spacing for a cantilever load",
      "Check a hoist or pipe support bracket"
    ],
    "users": [
      "Structural engineers",
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "P": "Load on the bracket, acting parallel to the bolted face (for example a vertical load on a wall bracket).",
      "e": "Distance from the bolted face to the line of the load.",
      "y1": "Height of bolt row 1 above the edge the bracket would pivot about.",
      "n1": "Number of bolts in row 1 (0 if the row is not used).",
      "y2": "Height of bolt row 2 above the edge the bracket would pivot about.",
      "n2": "Number of bolts in row 2 (0 if the row is not used).",
      "y3": "Height of bolt row 3 above the edge the bracket would pivot about.",
      "n3": "Number of bolts in row 3 (0 if the row is not used).",
      "y4": "Height of bolt row 4 above the edge the bracket would pivot about.",
      "n4": "Number of bolts in row 4 (0 if the row is not used).",
      "d": "Nominal bolt diameter.",
      "pitch": "Thread pitch.",
      "sA": "Allowable tensile stress on the stress area (your design value).",
      "tA": "Allowable shear stress on the shank (your design value)."
    },
    "outputs": [
      "Moment and tension in each row",
      "Shear per bolt",
      "Tension, shear and combined checks"
    ],
    "method": [
      "Moment M = P × e, resisted by bolt tension about the pivot edge: tension in a row = M y ÷ Σ n y² per bolt.",
      "Shear per bolt V = P ÷ Σ n (as the bolt and pin shear tool).",
      "σ = T_max ÷ A_s with A_s = π ÷ 4 (d − 0.9382p)²; τ = V ÷ (π d² ÷ 4).",
      "Interaction (σ ÷ σ_allow)² + (τ ÷ τ_allow)² ≤ 1.",
      "Example: 60 kN at 200 mm puts 17.143 kN on each top bolt and 10 kN shear on every bolt; interaction 0.24297."
    ],
    "limitations": [
      "Pivot at the bottom edge with a rigid bracket; prying from a flexible flange raises bolt tension.",
      "Preload is not credited; check the joint does not separate for fatigue loads.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising the top row away from the pivot cuts the bolt tension most."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1521–1535, 1720–1735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-centre-distance-design": {
    "purpose": "Design of an external spur gear pair to an off-standard centre distance: working pressure angle from the centre distance, the sum of profile shift coefficients from the involute function, its split between pinion and gear, tip diameters with or without tip shortening to keep the standard clearance, the contact ratio with those tips (as the contact ratio tool), the undercut limit for each gear, and the working pressure angle check against the profile shift tool.",
    "uses": [
      "Fit a gear pair into an existing housing",
      "Avoid undercut on a small pinion",
      "Check the contact ratio after shifting"
    ],
    "users": [
      "Gear engineers",
      "Design engineers",
      "Machinists"
    ],
    "inputs": {
      "m": "Module of both gears.",
      "z1": "Teeth on the pinion.",
      "z2": "Teeth on the gear.",
      "alpha": "Pressure angle of the tooling.",
      "aw": "Centre distance the housing fixes.",
      "share": "How much of the total profile shift goes on the pinion (more on the pinion helps strength and avoids undercut).",
      "short": "Whether the tip diameters are reduced so the clearance stays at the standard value.",
      "epsMin": "Least transverse contact ratio you accept."
    },
    "outputs": [
      "Working pressure angle and total profile shift",
      "Shift, tip diameter and undercut check for each gear",
      "Contact ratio"
    ],
    "method": [
      "Standard centre distance a = m (z₁ + z₂) ÷ 2; working pressure angle cos α_w = a cos α ÷ a_w.",
      "Σx = (inv α_w − inv α)(z₁ + z₂) ÷ (2 tan α); split by the share (as the profile shift tool in reverse).",
      "Centre distance factor y = (a_w − a) ÷ m; tip shortening k = Σx − y; tip radius r_a = m (z ÷ 2 + 1 + x − k).",
      "Contact ratio ε = [√(r_a1² − r_b1²) + √(r_a2² − r_b2²) − a_w sin α_w] ÷ (π m cos α) (as the contact ratio tool); no undercut if x ≥ 1 − z sin²α ÷ 2.",
      "Example: 55 mm needs Σx = 0.53289 (pinion 0.37302, gear 0.15987) at 22.69° working angle; contact ratio 1.4127."
    ],
    "limitations": [
      "External spur gears of standard full-depth proportions.",
      "Tooth tip thickness (pointing) at large shifts is not checked: verify it on the drawing.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Putting most of the positive shift on the pinion strengthens it and keeps it clear of undercut."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2141–2160. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
