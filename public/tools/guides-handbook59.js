// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook59).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "buttress-thread-inspection": {
    "purpose": "Three-wire inspection of an external 7°/45° buttress thread: the basic form and the internal and external major, pitch and minor diameters with any allowance (as the buttress thread tool), the wire size that touches at the pitch line and the reading over wires at the largest and smallest allowed pitch diameter (as the taper and buttress three-wire tool), and the pitch diameter from your measured reading against your tolerance.",
    "uses": [
      "Inspect a buttress thread on a press screw, breech or vice",
      "Set the wire readings before cutting a buttress thread",
      "Check a worn buttress screw"
    ],
    "users": [
      "Inspectors",
      "Machinists",
      "Toolmakers"
    ],
    "inputs": {
      "D": "Basic major diameter of the thread.",
      "p": "Pitch (25.4 ÷ threads per inch).",
      "G": "Allowance on the external thread from its class (0 for basic size).",
      "tol": "How far below the largest pitch diameter the external thread may be (your class tolerance).",
      "W": "Diameter of the wires you have (0 uses the size that touches at the pitch line).",
      "Mmeas": "Micrometer reading over the three wires."
    },
    "outputs": [
      "Thread form and diameters",
      "Wire size and readings at the pitch diameter limits",
      "Pitch diameter from the reading and the decision"
    ],
    "method": [
      "h = 0.6p; internal pitch E_n = D − h; external pitch E_s = D − h − G; external minor K_s = D − 1.32542p − G (as the buttress thread tool).",
      "Included angle 52° with a 7° load flank: wire = p cos 7° ÷ (1 + cos 52°); M = E − [p ÷ (tan 7° + tan 45°) − W (1 + cos 19° ÷ sin 26°)] (as the taper and buttress three-wire tool).",
      "Pitch diameter from a reading = M + the same constant, against E_s − tolerance to E_s.",
      "Example: external pitch diameter 48.26 mm; read 52.699 to 52.579 mm over 2.6005 mm wires; 52.65 mm gives 48.211 mm."
    ],
    "limitations": [
      "Single-start thread; the lead-angle effect is ignored.",
      "Wires must touch both flanks; very small or large wires sit on the crest or root.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The load is carried on the 7° flank, so wear shows mainly there; one reading over wires averages both flanks."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1945–1952, 2005–2007. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "unified-tapped-hole-check": {
    "purpose": "Plan and check of a tapped hole for a Unified inch thread: the basic pitch and minor diameters and tensile stress area (as the Unified thread tool), the tap drill for your percentage of thread and tap type (as the tap drill tool), and the length of engagement needed so the internal thread does not strip before the screw breaks, with the strength ratio of the screw and the tapped material (as the thread engagement tool), against the engagement you have.",
    "uses": [
      "Check a tapped hole in aluminium or cast iron",
      "Pick a tap drill and thread percentage",
      "Find how deep a tapped hole must be"
    ],
    "users": [
      "Design engineers",
      "Machinists",
      "Draftspeople"
    ],
    "inputs": {
      "D": "Nominal (basic major) diameter of the thread.",
      "n": "Threads per inch.",
      "pct": "Percentage of full thread height the tapped hole is to have (often 60–75%).",
      "tap": "Cutting taps need a smaller drill than forming taps for the same thread percentage.",
      "L": "Length of full thread the screw engages in the hole.",
      "Sub": "Ultimate tensile strength of the screw.",
      "Sun": "Ultimate tensile strength of the material being tapped."
    },
    "outputs": [
      "Pitch, diameters and tensile stress area",
      "Tap drill",
      "Engagement needed and the decision"
    ],
    "method": [
      "p = 1 ÷ n; E = D − 0.649519p; minor = D − 1.082532p; A_t = 0.7854 (D − 0.9743p)² (as the Unified thread tool).",
      "Drill = D − k × % thread × p with k 0.01299 for cutting and 0.0068 for forming taps (as the tap drill tool).",
      "L_e = 2A_t ÷ [πK_n(½ + 0.57735n(E_s − K_n))]; J = A_s S_ue ÷ (A_n S_un); required = J L_e when J > 1 (as the thread engagement tool, at basic diameters).",
      "Example: drill 0.42506 in for 75% thread; 0.56008 in of engagement needed (strength ratio 1.9127)."
    ],
    "limitations": [
      "Basic diameters; the thread class limits lengthen the engagement needed slightly.",
      "Static tensile load; vibration and repeated assembly call for inserts or more length.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "In a material much weaker than the screw the engagement needed passes 1.5–2 diameters; a thread insert is often the better answer."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1806–1866, 2029–2036, 1586–1590. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "weldment-cost-estimate": {
    "purpose": "Cost estimate of all the fillet welds on a weldment: for each weld run the weld metal per metre from the leg size and excess, then arc time from the deposition rate, paid time from the operating factor, and labour, filler and shielding gas costs (as the weld cost tool, run by run), summed with any fit-up and handling time, against the price you have quoted for the welding.",
    "uses": [
      "Price the welding on a frame or bracket",
      "Compare leg sizes on cost",
      "Check a welding quote"
    ],
    "users": [
      "Estimators",
      "Fabrication engineers",
      "Welding supervisors"
    ],
    "inputs": {
      "n": "How many different weld runs (sizes) to include.",
      "leg1": "Fillet leg size of weld run 1.",
      "len1": "Total length of weld run 1 on the weldment.",
      "leg2": "Fillet leg size of weld run 2.",
      "len2": "Total length of weld run 2.",
      "leg3": "Fillet leg size of weld run 3.",
      "len3": "Total length of weld run 3.",
      "leg4": "Fillet leg size of weld run 4.",
      "len4": "Total length of weld run 4.",
      "excess": "Allowance for convexity and spatter over the plain triangle.",
      "rho": "Density of the weld metal (7.85 for steel).",
      "dep": "Weld metal deposited per hour of arc time.",
      "of": "Share of paid time the arc is on.",
      "eff": "Share of the filler bought that ends up in the weld.",
      "rate": "Labour and overhead per paid hour.",
      "wire": "Price of filler wire or rod.",
      "gasFlow": "Shielding gas flow while the arc is on (0 for self-shielded processes).",
      "gasPrice": "Price of shielding gas.",
      "fit": "Time for fit-up, tacking, turning and handling, charged at the labour rate.",
      "quote": "The price allowed for the welding."
    },
    "outputs": [
      "Weld metal, arc and paid time by run",
      "Labour, filler and gas cost",
      "Total against the quote"
    ],
    "method": [
      "Weld metal per metre = ½ leg² × (1 + excess) × density; arc time = mass ÷ deposition rate; paid time = arc time ÷ operating factor (as the weld cost tool).",
      "Labour = paid time × rate; filler = mass ÷ efficiency × price; gas = arc minutes × flow × gas price.",
      "Each run multiplied by its length; fit-up time at the labour rate added.",
      "Example: 1.0752 kg of weld metal, 2.6946 h paid including fit-up, $267 in all."
    ],
    "limitations": [
      "Fillet welds only; groove welds have a different cross-section.",
      "Deposition rate and operating factor vary widely with process, position and shop.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Weld metal grows with the square of the leg: one size up on a long run usually costs more than all the short runs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1438–1441. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "brazed-sleeve-joint-plan": {
    "purpose": "Plan of a brazed or soldered sleeve (socket) joint on a tube: the overlap that makes the joint as strong as the tube wall with a safety factor (as the lap joint length tool, with the joint width taken as the tube circumference), the joint and tube capacities against your load, the diametral clearance against the filler’s range, and the volume and mass of filler to fill the gap.",
    "uses": [
      "Size the socket depth for a brazed tube joint",
      "Check a soldered copper joint under load",
      "Estimate filler rings or wire per joint"
    ],
    "users": [
      "Fabrication engineers",
      "Design engineers",
      "Brazing technicians"
    ],
    "inputs": {
      "OD": "Outside diameter of the tube going into the sleeve.",
      "t": "Wall thickness of the tube.",
      "sm": "Tensile strength of the tube material (annealed by brazing).",
      "tau": "Shear strength of the brazed or soldered joint, from the filler supplier.",
      "factor": "Factor on the overlap over the length that just matches the tube wall.",
      "L": "Overlap of the tube in the sleeve.",
      "load": "Axial pull or push on the joint.",
      "gap": "Diametral clearance between tube and sleeve bore.",
      "gapMin": "Smallest clearance the filler supplier gives for capillary flow.",
      "gapMax": "Largest clearance the filler supplier gives.",
      "rhoF": "Density of the filler metal."
    },
    "outputs": [
      "Overlap needed",
      "Joint and tube capacity against the load",
      "Clearance and filler quantity"
    ],
    "method": [
      "Overlap needed = factor × t × S_tube ÷ τ_joint (as the lap joint length tool).",
      "Joint capacity = π OD × L × τ_joint; tube capacity = π (OD − t) t × S_tube.",
      "Filler volume = π OD × L × clearance ÷ 2 (the annular gap).",
      "Example: 5.625 mm overlap is needed; at 10 mm the joint carries 54.978 kN and takes 0.35343 g of filler."
    ],
    "limitations": [
      "Uniform shear along the overlap; very long overlaps do not gain in proportion.",
      "Strengths are for a sound, fully filled joint; voids and flux pockets cut capacity.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A joint whose overlap is about three wall thicknesses or more is usually stronger than the annealed tube beside it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1423–1430. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gear-train-output-check": {
    "purpose": "Check of a simple or compound spur gear train against its duty: the overall ratio from up to four meshes, the output speed, direction and torque with the mesh efficiency (as the gear train tool), compared with the output speed and torque you need, and the torsional shear stress in the output shaft and the diameter needed for your allowable stress.",
    "uses": [
      "Check a gear train for a conveyor or mixer drive",
      "Pick change gears for a target speed",
      "Size the output shaft of a gearbox"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Millwrights"
    ],
    "inputs": {
      "nin": "Speed of the input shaft.",
      "Tin": "Torque into the input shaft.",
      "eff": "Efficiency of each gear mesh (about 98% for spur gears).",
      "a1": "Teeth on the driving gear of mesh 1.",
      "b1": "Teeth on the driven gear of mesh 1.",
      "a2": "Teeth on the driving gear of mesh 2.",
      "b2": "Teeth on the driven gear of mesh 2.",
      "a3": "Teeth on the driving gear of mesh 3.",
      "b3": "Teeth on the driven gear of mesh 3.",
      "a4": "Teeth on the driving gear of mesh 4.",
      "b4": "Teeth on the driven gear of mesh 4.",
      "nreq": "Output speed the job needs.",
      "tol": "How far the output speed may differ from the required speed.",
      "Treq": "Output torque the job needs.",
      "d": "Diameter of the output shaft (at keyways, use the reduced section).",
      "tauA": "Allowable torsional shear stress for the shaft material and duty."
    },
    "outputs": [
      "Ratio, output speed, direction and torque",
      "Speed and torque against the duty",
      "Output shaft stress and diameter needed"
    ],
    "method": [
      "Ratio = Π (driven ÷ driver); output speed = input ÷ ratio; output torque = input torque × ratio × efficiency^meshes (as the gear train tool).",
      "Speed error = (output − required) ÷ required.",
      "Shaft stress τ = 16T ÷ (π d³); diameter needed = (16T ÷ π τ_allow)^⅓.",
      "Example: ratio 9 gives 161.11 rpm and 172.87 N·m; the output shaft runs at 32.609 MPa."
    ],
    "limitations": [
      "Steady torque; shock and starting loads need a service factor on the torque.",
      "Gear tooth strength is not checked here; use the gear tooth tools for each mesh.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Each extra mesh reverses the direction and costs about 2% of the torque."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2122–2160, 299–304. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "linear-move-drive-check": {
    "purpose": "Check of a horizontal screw-driven (or belt-driven) linear axis: the trapezoidal or triangular move profile, move time, peak speed and acceleration force (as the move profile tool), the friction force, the motor speed and the accelerating, running and decelerating torques through the screw lead and efficiency, the RMS torque over an out-and-back cycle with dwells, against the motor’s speed, peak and continuous torque and your cycle time.",
    "uses": [
      "Size a motor for a pick-and-place axis",
      "Check whether a faster cycle is possible",
      "Pick a screw lead for a linear stage"
    ],
    "users": [
      "Automation engineers",
      "Machine designers",
      "Controls engineers"
    ],
    "inputs": {
      "distance": "Length of each move.",
      "vmax": "Highest speed allowed for the carriage.",
      "accel": "Acceleration and deceleration used.",
      "mass": "Mass of everything that moves with the carriage.",
      "mu": "Rolling or sliding friction coefficient of the guides.",
      "dwell": "Time stopped at each end of the move.",
      "cycleReq": "Time allowed for one move out, one move back and both dwells.",
      "lead": "Carriage travel for one revolution of the motor (screw lead, or pulley circumference for a belt).",
      "effD": "Efficiency of the screw or belt drive.",
      "nMax": "Highest speed of the motor.",
      "Tpk": "Peak (intermittent) torque the motor can give.",
      "Tcont": "Continuous (RMS) torque the motor can give."
    },
    "outputs": [
      "Move profile, time and peak speed",
      "Motor speed and torques",
      "RMS torque and cycle time against the motor and target"
    ],
    "method": [
      "Trapezoidal if L ≥ V² ÷ a: t = L ÷ V + V ÷ a; otherwise t = 2√(L ÷ a); acceleration force = m a (as the move profile tool).",
      "Friction F_f = μ m g; motor torque T = F × lead ÷ (2π η); motor speed = peak speed ÷ lead.",
      "T_rms = √(Σ T² t ÷ cycle) with accelerating (m a + F_f), running (F_f) and decelerating (m a − F_f) torques and zero torque in the dwells.",
      "Example: each move takes 0.7 s; the motor turns 2,400 rpm with 0.52881 N·m peak and 0.2637 N·m RMS over a 2.4 s cycle."
    ],
    "limitations": [
      "Horizontal axis; on a vertical axis gravity adds to the torque one way and needs a brake.",
      "Rotor and screw inertia are not included; add their share to the moving mass for a servo sizing.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the acceleration time doubles the accelerating torque; a coarser lead trades motor torque for motor speed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 175–180, 155–162. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "plate-lift-plan": {
    "purpose": "Lift plan for a cut plate or flat panel: the area, perimeter and centroid of the outline from its corner coordinates (as the polygon area tool), the mass from thickness and density, and the load on each of two lift points from where the centre of gravity falls along the line joining them, with the sideways offset that makes the plate hang tilted, against the working load limit of each lift point.",
    "uses": [
      "Plan a lift of a profile-cut plate",
      "Place lifting lugs so the load shares evenly",
      "Check shackle and lug ratings on a panel lift"
    ],
    "users": [
      "Riggers",
      "Fabrication supervisors",
      "Lifting engineers"
    ],
    "inputs": {
      "n": "Number of corners of the outline (the first n are used, in order round the shape).",
      "x1": "X of corner 1.",
      "y1": "Y of corner 1.",
      "x2": "X of corner 2.",
      "y2": "Y of corner 2.",
      "x3": "X of corner 3.",
      "y3": "Y of corner 3.",
      "x4": "X of corner 4.",
      "y4": "Y of corner 4.",
      "x5": "X of corner 5.",
      "y5": "Y of corner 5.",
      "x6": "X of corner 6.",
      "y6": "Y of corner 6.",
      "x7": "X of corner 7.",
      "y7": "Y of corner 7.",
      "x8": "X of corner 8.",
      "y8": "Y of corner 8.",
      "t": "Thickness of the plate.",
      "rho": "Density of the plate material (7850 for steel).",
      "xA": "X of lift point A.",
      "yA": "Y of lift point A.",
      "xB": "X of lift point B.",
      "yB": "Y of lift point B.",
      "wll": "Rated load of each lug, shackle or clamp."
    },
    "outputs": [
      "Area, perimeter and centre of gravity",
      "Mass and weight",
      "Load on each lift point and the hang offset"
    ],
    "method": [
      "Shoelace area and centroid from the corners (as the polygon area tool).",
      "Mass = area × thickness × density; weight = mass × g.",
      "Share at B = projection of the CG along A→B ÷ |AB|; A takes the rest; the perpendicular offset of the CG from AB is how far the plate swings to hang.",
      "Example: the plate weighs 565.2 kg with its CG at X 1,200, Y 760; A takes 2.4249 kN and B 3.1178 kN."
    ],
    "limitations": [
      "Flat plate of uniform thickness without holes; subtract cut-outs as separate shapes.",
      "Vertical lift from both points; inclined slings add load and need the sling tools.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With only two lift points the plate always hangs with its CG under the line between them; a large offset means it hangs steeply tilted."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 40–48, 66–76, 221–227. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tapered-pad-footing-check": {
    "purpose": "Check of a square or rectangular pad footing with a straight base block and a tapered (frustum) top: the volume of the taper by the prismoidal formula (as the prismoidal volume tool) plus the base block, the self-weight, the bearing pressure under the base from the column load and self-weight against your allowable ground pressure, the base area needed, and the concrete to order with a waste allowance.",
    "uses": [
      "Size a pad for a column or machine leg",
      "Order concrete for tapered footings",
      "Check a footing for a heavier load"
    ],
    "users": [
      "Site engineers",
      "Plant engineers",
      "Builders"
    ],
    "inputs": {
      "a1": "Length of the footing base.",
      "b1": "Width of the footing base.",
      "hb": "Depth of the vertical-sided block at the bottom.",
      "a2": "Length of the flat top where the column or plinth sits.",
      "b2": "Width of the flat top.",
      "h": "Height of the sloping part above the base block.",
      "P": "Load the column brings down onto the footing.",
      "rhoC": "Density of the concrete (about 2400 for reinforced concrete).",
      "qa": "Allowable bearing pressure of the ground, from site investigation.",
      "waste": "Extra concrete to order for spillage and over-excavation."
    },
    "outputs": [
      "Taper, block and total volume",
      "Self-weight and bearing pressure",
      "Base area needed and concrete to order"
    ],
    "method": [
      "Taper volume V = h (A₁ + 4A_m + A₂) ÷ 6 with the middle section from the averaged sides (as the prismoidal volume tool).",
      "Block volume = a₁ b₁ h_b; self-weight = volume × density × g.",
      "Bearing pressure = (P + self-weight) ÷ (a₁ b₁); base area needed = (P + self-weight) ÷ allowable pressure.",
      "Example: 0.63733 m³ of concrete weighing 15 kN; the ground carries 218.75 kPa."
    ],
    "limitations": [
      "Concentric vertical load; moments or horizontal loads make the pressure uneven.",
      "Reinforcement, punching shear and settlement need a structural design.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Tapering the top saves concrete with little effect on the bearing pressure, which depends on the base area."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 66. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-circle-pin-check": {
    "purpose": "Inspection of a bolt circle (pitch circle) of equally spaced holes with close-fitting plugs: the pitch circle diameter from a micrometer or caliper reading over two alternate or adjacent plugs and the size across opposite plugs (as the bolt circle over plugs tool), the readings that correspond to the nominal pitch circle and its tolerance limits, and the accept or reject decision.",
    "uses": [
      "Inspect the PCD of a flange or hub hole pattern",
      "Set up a go/no-go reading for a hole circle",
      "Check a drilled pattern before tapping"
    ],
    "users": [
      "Inspectors",
      "Machinists",
      "Quality engineers"
    ],
    "inputs": {
      "n": "Number of equally spaced holes.",
      "d": "Diameter of the plugs fitted in the holes.",
      "mode": "Whether the reading is over two plugs with one hole between (alternate) or two neighbouring plugs (adjacent).",
      "m": "Reading over the outsides of the two plugs.",
      "pcd": "Pitch circle diameter on the drawing.",
      "tol": "Plus-or-minus tolerance on the pitch circle diameter."
    },
    "outputs": [
      "Pitch circle from the reading and size across",
      "Readings at nominal and the limits",
      "Decision"
    ],
    "method": [
      "Alternate plugs: PCD = (m − d) ÷ sin (360° ÷ n); adjacent plugs: PCD = (m − d) ÷ sin (180° ÷ n) (as the bolt circle over plugs tool).",
      "Across opposite plugs = PCD + d for an even number of holes.",
      "Reading at a pitch circle = PCD × sin + d, at nominal and at each limit.",
      "Example: the reading gives a PCD of 100.02 mm (nominal reading 96.603 mm)."
    ],
    "limitations": [
      "Equally spaced holes; the reading checks the circle, not the spacing of each hole.",
      "Plug clearance in the holes adds directly to the error.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Measure several pairs round the circle: a spread between pairs shows a spacing or roundness error, not only a size error."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 686. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
