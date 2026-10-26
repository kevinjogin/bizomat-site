// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook58).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "eccentric-bracket-bolt-check": {
    "purpose": "Check of a bolted bracket with an eccentric load in the plane of the bolts: the centroid of the bolt group, the moment of the load about it, the direct and torsional force on each bolt and the most heavily loaded bolt (as the eccentric bolt group tool), then the shear stress in that bolt and the bearing stress it puts on the plate (as the bolt shear and bearing tool), against your allowable stresses.",
    "uses": [
      "Check a bracket carrying an offset load",
      "Find the critical bolt in a connection",
      "Choose bolt size and plate thickness for a bracket"
    ],
    "users": [
      "Design engineers",
      "Structural detailers",
      "Fabrication engineers"
    ],
    "inputs": {
      "n": "Number of bolts in the group (the first n positions are used).",
      "x1": "X position of bolt 1.",
      "y1": "Y position of bolt 1.",
      "x2": "X position of bolt 2.",
      "y2": "Y position of bolt 2.",
      "x3": "X position of bolt 3.",
      "y3": "Y position of bolt 3.",
      "x4": "X position of bolt 4.",
      "y4": "Y position of bolt 4.",
      "x5": "X position of bolt 5.",
      "y5": "Y position of bolt 5.",
      "x6": "X position of bolt 6.",
      "y6": "Y position of bolt 6.",
      "Px": "Horizontal component of the load.",
      "Py": "Vertical component of the load (negative downwards).",
      "lx": "X position of the load’s line of action.",
      "ly": "Y position of the load’s line of action.",
      "d": "Bolt diameter where it is sheared (shank or thread).",
      "planes": "Whether each bolt is sheared once or twice.",
      "t": "Thickness of the thinnest plate the bolts bear on.",
      "tauAllow": "Allowable shear stress of the bolts.",
      "bAllow": "Allowable bearing stress of the plate."
    },
    "outputs": [
      "Group centroid and moment",
      "Force on each bolt and the critical bolt",
      "Shear and bearing stress of the critical bolt"
    ],
    "method": [
      "Centroid of the bolts; polar moment J = Σ r²; moment of the load about the centroid (as the eccentric bolt group tool).",
      "Each bolt: direct share P ÷ n plus M r ÷ J perpendicular to its radius; the largest resultant governs.",
      "Shear stress = F ÷ (planes × π d² ÷ 4); bearing stress = F ÷ (d t) (as the bolt shear and bearing tool).",
      "Example: bolt 2 carries 21.506 kN, giving 106.96 MPa shear and 134.41 MPa bearing."
    ],
    "limitations": [
      "Elastic method with rigid plates; the instantaneous-centre method gives more capacity.",
      "Bolts in bearing (no slip-critical friction).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Spreading the bolts further from the centroid cuts the moment share faster than adding bolts near it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1535, 1720–1735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pulley-shaft-bush-check": {
    "purpose": "Check of the plain (sleeve) bearings carrying an overhung pulley: the belt pull from the power, speed and pulley diameter with a belt tension factor, the reactions at the near and far bushes from the overhang and bush spacing, and the projected-area pressure, sliding velocity and PV value of each bush (as the plain bearing PV tool), against the limits of the bush material.",
    "uses": [
      "Check bronze or polymer bushes on a pulley shaft",
      "Find the bush length needed for a belt drive",
      "Check a speed or power increase on a bushed shaft"
    ],
    "users": [
      "Maintenance engineers",
      "Design engineers",
      "Machine designers"
    ],
    "inputs": {
      "P": "Power transmitted by the belt.",
      "rpm": "Speed of the shaft.",
      "Dp": "Pitch diameter of the pulley.",
      "kb": "Shaft load as a multiple of the effective belt pull (about 1.5 for V-belts, 2 or more for flat belts).",
      "a": "Distance from the centre of the bush nearest the pulley to the pulley centre.",
      "Lb": "Distance between the two bush centres.",
      "d": "Diameter of the shaft in the bushes.",
      "L": "Length of each bush.",
      "Pmax": "Highest projected-area pressure the bush material allows.",
      "Vmax": "Highest sliding speed the bush material allows.",
      "PVmax": "Highest PV the bush material allows."
    },
    "outputs": [
      "Torque, effective pull and shaft load",
      "Bush reactions",
      "P, V and PV of each bush"
    ],
    "method": [
      "Torque = 9549 P ÷ n; effective pull = 2T ÷ D_p; shaft load = factor × effective pull.",
      "Near bush R₁ = F (L_b + a) ÷ L_b; far bush R₂ = F a ÷ L_b.",
      "P = R ÷ (d L); V = π d n; PV (as the plain bearing PV tool).",
      "Example: the belt loads the shaft with 613.88 N; the near bush carries 859.44 N at PV 1.05 MPa·m/s."
    ],
    "limitations": [
      "Steady belt load; start-up and shock raise the pull.",
      "Uniform bush pressure; shaft deflection concentrates load at the bush end near the pulley.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A short overhang and widely spaced bushes keep the near bush load close to the belt pull itself."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2314–2337, 2473–2490. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "torque-tube-end-weld-check": {
    "purpose": "Check of a closed thin-walled tube carrying torque and the fillet weld around its end: shear stress, torsional constant and angle of twist of the tube (as the thin-walled tube torsion tool), the shear flow at the end weld from the area it encloses, the weld throat stress and the leg size needed (as the fillet weld strength tool, with the shear flow around the full perimeter), against the allowable stresses and your twist limit.",
    "uses": [
      "Check a torque tube, drive arm or frame member in torsion",
      "Size the weld of a tube to its flange",
      "Compare round and box sections for twist"
    ],
    "users": [
      "Design engineers",
      "Fabrication engineers",
      "Structural detailers"
    ],
    "inputs": {
      "shape": "Shape of the tube section.",
      "b": "Outside diameter (round) or outside width (rectangular).",
      "h": "Outside height of a rectangular tube.",
      "t": "Wall thickness.",
      "T": "Torque carried.",
      "L": "Length of the tube between the torque points.",
      "G": "Shear modulus of the tube.",
      "allow": "Allowable shear stress of the tube.",
      "twMax": "Largest angle of twist per metre you accept.",
      "leg": "Leg size of the fillet weld all round the tube end.",
      "tauW": "Allowable shear stress on the weld throat."
    },
    "outputs": [
      "Tube shear stress, torsional constant and twist",
      "Shear flow at the weld and weld throat stress",
      "Weld leg needed"
    ],
    "method": [
      "Shear stress = T ÷ (2 A_m t); J = 4 A_m² t ÷ s; twist = T L ÷ (G J) with A_m and s on the wall mid-line (as the thin-walled tube torsion tool).",
      "Shear flow at the weld q = T ÷ (2 A_w), A_w = area enclosed by the outside of the tube.",
      "Weld load = q × perimeter, carried by one weld of that length (as the fillet weld strength tool); throat stress = q ÷ (0.707 × leg).",
      "Example: the tube sees 42.459 MPa and twists 0.98646°/m; the weld throat sees 42.426 MPa (leg needed 1.463 mm)."
    ],
    "limitations": [
      "Closed thin walls; corner radii and stress raisers at the weld toe are ignored.",
      "Pure torque; bending at the end plate needs adding separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Closed tubes are many times stiffer in torsion than open channels of the same weight."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303, 1476–1486. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "arc-segmentation-feed-check": {
    "purpose": "Check of a curved toolpath output as short linear moves: the segment length that keeps the chord error within your tolerance on the arc radius, the angle per segment and number of segments over the arc (as the CNC chord error tool), the block rate the control must process at the programmed feed, the largest feed the control’s block processing rate allows, and the time for the arc.",
    "uses": [
      "Set CAM tolerance without starving the control",
      "Explain why a contour runs slower than programmed",
      "Choose between arcs (G2/G3) and segments"
    ],
    "users": [
      "CNC programmers",
      "Manufacturing engineers",
      "Machinists"
    ],
    "inputs": {
      "R": "Radius of the curve being machined.",
      "tol": "Largest chord error allowed between segment and true arc.",
      "angle": "Angle of the arc.",
      "feed": "Feed programmed along the path.",
      "rate": "Blocks per second the control can read and execute (from the control maker; look-ahead settings change it)."
    },
    "outputs": [
      "Segment length, angle and number",
      "Block rate needed at the programmed feed",
      "Largest feed for the control and arc time"
    ],
    "method": [
      "Segment length for a chord error e: L = 2√(2Re − e²); angle per segment = 2 sin⁻¹(L ÷ 2R); segments = ⌈arc angle ÷ segment angle⌉ (as the CNC chord error tool).",
      "Blocks per second = feed ÷ (60 L).",
      "Largest feed = rate × 60 × L; arc time = arc length ÷ the lower of the two feeds.",
      "Example: 0.005 mm tolerance gives 1.4142 mm segments (56 over the arc); at 3000 mm/min the control needs 35.356 blocks/s and can hold 8,485.1 mm/min."
    ],
    "limitations": [
      "Constant radius; tight curvature in freeform paths needs the smallest local radius.",
      "Block rate only: acceleration limits can slow the feed further.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the tolerance shortens the segments by about √2, raising the block rate needed by the same factor."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1279–1300, 77–80. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "involute-spline-design": {
    "purpose": "Check of a side-fit or major-diameter-fit involute spline: pitch, major, minor, root and form diameters and the basic tooth thickness for the diametral pitch, tooth count and type (as the involute spline tool), the depth of engagement from the external major and internal minor diameters, then the shear stress under the roots, the shear at the pitch diameter and the tooth compressive stress with application, load-distribution, fatigue and wear factors (as the spline torque capacity tool), against the allowable shear and compressive stresses.",
    "uses": [
      "Check a spline for a new torque",
      "Choose spline length for a hub",
      "Get spline diameters for a drawing"
    ],
    "users": [
      "Design engineers",
      "Gear and spline designers",
      "Machine designers"
    ],
    "inputs": {
      "Pd": "Diametral pitch of the spline (the first number of the pitch fraction).",
      "Nt": "Number of teeth.",
      "type": "Root form and fit.",
      "T": "Torque transmitted.",
      "Le": "Length of the spline engagement.",
      "Dh": "Bore of a hollow shaft.",
      "kind": "Fixed splines do not slide; flexible ones allow misalignment or sliding.",
      "acc": "Spacing accuracy of the teeth.",
      "Ka": "Application factor for the driver and load.",
      "Km": "Load distribution factor for misalignment.",
      "Kf": "Fatigue life factor.",
      "Kw": "Wear life factor for flexible splines.",
      "Ss": "Allowable shear stress of the shaft and teeth.",
      "Sc": "Allowable compressive (bearing) stress on the teeth."
    },
    "outputs": [
      "Pitch, major, minor and root diameters",
      "Tooth thickness and depth of engagement",
      "Root shear, pitch shear and compressive stress"
    ],
    "method": [
      "Pitch diameter D = N ÷ P; external major, internal minor and root diameters and the basic tooth thickness π ÷ 2P for the type (as the involute spline tool), converted to millimetres.",
      "Depth of engagement h = (external major − internal minor) ÷ 2.",
      "Root shear = 16 T K_a ÷ (π D_re³ K_f); pitch shear = 4 T K_a K_m ÷ (D N L_e t K_f); compressive = 2 T K_m K_a ÷ (9 D N L_e h K_f) for fixed splines (as the spline torque capacity tool).",
      "Example: D = 31.75 mm, root 29.607 mm; root shear 70.647 MPa and tooth compression 3.1744 MPa."
    ],
    "limitations": [
      "Dudley spline formulas with the factors you enter.",
      "Basic dimensions; tolerances and fit classes come from the standard.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Lengthening a spline beyond about one pitch diameter adds little capacity because load concentrates at one end."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2255–2282. Topic reference; no source tables or recommended settings are reproduced.",
      "ANSI B92.1 Involute Splines and Inspection"
    ]
  },
  "balance-correction-check": {
    "purpose": "Single-plane balancing of a narrow rotor: the resultant unbalance and its angle from the known masses, the correction mass at your correction radius and its angle opposite, and the centrifugal force of the unbalance (as the plane balancing tool); the permissible residual unbalance for the rotor’s mass, speed and balance grade (as the balance grade tool); and the residual left when the correction mass is rounded to your weight steps and placed with an angle error.",
    "uses": [
      "Balance a fan, pulley or flywheel in one plane",
      "Check that the weights available can reach the grade",
      "Show the effect of placement error"
    ],
    "users": [
      "Maintenance technicians",
      "Vibration analysts",
      "Machinists"
    ],
    "inputs": {
      "m1": "Known unbalance mass 1 (or the trial-run equivalent).",
      "r1": "Radius of mass 1.",
      "a1": "Angle of mass 1.",
      "m2": "Mass 2.",
      "r2": "Radius of mass 2.",
      "a2": "Angle of mass 2.",
      "m3": "Mass 3.",
      "r3": "Radius of mass 3.",
      "a3": "Angle of mass 3.",
      "m4": "Mass 4 (0 if unused).",
      "r4": "Radius of mass 4.",
      "a4": "Angle of mass 4.",
      "rc": "Radius at which the correction mass is fitted.",
      "step": "Smallest step of the balance weights you have.",
      "angErr": "Likely error in placing the weight at the correct angle.",
      "mass": "Mass of the rotor.",
      "rpm": "Highest speed the rotor runs at.",
      "grade": "Balance quality grade required."
    },
    "outputs": [
      "Resultant unbalance and correction mass and angle",
      "Permissible residual for the grade",
      "Residual after rounding and placement error"
    ],
    "method": [
      "Unbalance U = |Σ mᵢ rᵢ ∠aᵢ|; correction mass = U ÷ r_c at the opposite angle; force = U ω² (as the plane balancing tool).",
      "Permissible residual U_per = G × 1000 ÷ ω × rotor mass (g·mm) (as the balance grade tool).",
      "Residual = |U − m_rounded r_c ∠(angle error)| by the law of cosines.",
      "Example: add 32 g at 209.91° and 100 mm; the residual 116.02 g·mm is within 802.14 g·mm."
    ],
    "limitations": [
      "Single plane for narrow rotors; long rotors need two-plane balancing.",
      "Known masses or a trial-weight result; measurement error is not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Angle error matters more than mass rounding: 10° error leaves about 17% of the original unbalance."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 191–196. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 21940-11:2016 Mechanical vibration — Rotor balancing — Part 11: Procedures and tolerances for rotors with rigid behaviour"
    ]
  },
  "bend-feasibility-check": {
    "purpose": "Feasibility check of a press-brake bend: the smallest inside radius the material takes without cracking from its tensile reduction of area, and the largest radius beyond which the bend stays elastic (as the bend radius limits tool), the radius and angle after springback and the angle to bend to (as the bending springback tool), and the air-bending force for the bend length and V-die against the press capacity (as the press brake force tool).",
    "uses": [
      "Check a tight bend in plate before trying it",
      "Choose a radius for a high-strength steel",
      "Set the press brake for a new material"
    ],
    "users": [
      "Press brake operators",
      "Fabrication engineers",
      "Sheet-metal designers"
    ],
    "inputs": {
      "t": "Thickness of the sheet or plate.",
      "R": "Inside radius you want after bending.",
      "angle": "Angle the finished bend must have.",
      "rA": "Reduction of area from the material’s tensile test (a measure of ductility).",
      "YS": "Yield strength.",
      "uts": "Tensile strength.",
      "E": "Elastic modulus.",
      "L": "Length of the bend line.",
      "V": "Opening of the V-die.",
      "k": "Die factor for air bending.",
      "cap": "Rated force of the press brake."
    },
    "outputs": [
      "Smallest and largest workable radius",
      "Radius after springback and angle to bend to",
      "Bending force and press use"
    ],
    "method": [
      "Smallest radius = t (50 ÷ r − 1) with r the reduction of area %; largest = t E ÷ 2S_y (as the bend radius limits tool).",
      "Springback from R S_y ÷ (E t); final radius and bend-to angle (as the bending springback tool).",
      "Force = k L t² UTS ÷ V (as the press brake force tool).",
      "Example: radii from 0.75 to 1,200 mm are workable; bend to 90.329° for 90°, needing 224.44 kN."
    ],
    "limitations": [
      "Bend across the rolling direction; bends along the grain need a larger radius.",
      "Air bending; bottoming and coining need more force.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "High-strength steels need both a larger minimum radius and much more overbend for springback."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1346–1353. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "whitworth-wire-inspection": {
    "purpose": "Three-wire inspection of a 55° Whitworth external thread: thread depth and basic pitch and minor diameters (as the Whitworth thread tool), the best-size wire and the reading over wires at the basic pitch diameter (as the three-wire measurement tool for 55°), the reading corrected for the helix (lead) angle (as the three-wire lead angle tool), and the pitch diameter from your measured reading against the pitch diameter tolerance.",
    "uses": [
      "Inspect a Whitworth thread on restoration or legacy machinery",
      "Set wire readings for a BSW or BSF thread",
      "See how much the lead angle matters"
    ],
    "users": [
      "Inspectors",
      "Machinists",
      "Restoration engineers"
    ],
    "inputs": {
      "D": "Major (nominal) diameter of the Whitworth thread.",
      "n": "Threads per inch.",
      "tol": "How far below basic the pitch diameter may be (the external thread tolerance for your class).",
      "W": "Diameter of the wires you have (0 uses the best size).",
      "Mmeas": "Micrometer reading over the three wires."
    },
    "outputs": [
      "Thread depth, pitch and minor diameters",
      "Wire size and reading at basic, with lead-angle correction",
      "Pitch diameter from the reading and the decision"
    ],
    "method": [
      "Depth h = 0.6403p; pitch diameter = D − h; minor = D − 2h (as the Whitworth thread tool).",
      "Best wire = (p ÷ 2) ÷ cos 27.5°; M = E + W (1 + 1 ÷ sin 27.5°) − (p ÷ 2) ÷ tan 27.5° (as the three-wire measurement tool).",
      "Lead-angle reading from the normal-plane flank angle (as the three-wire lead angle tool); pitch diameter from a reading by the simple formula.",
      "Example: basic pitch diameter 0.44664 in; read 0.5153 in over 0.046974 in wires (1.4076 × 10⁻⁴ in lead-angle effect); 0.5138 in gives 0.44514 in."
    ],
    "limitations": [
      "Rounded crests and roots do not affect the wire reading when wires touch the flanks.",
      "Single-start threads; lead-angle effect is small for fine pitches.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For single-start Whitworth threads the lead-angle effect is usually well under a tenth of a thou and can be ignored."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1980–1989, 1990–2003. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "casting-pattern-plan": {
    "purpose": "Pattern plan for a rectangular block casting: casting dimensions with machining allowance on the machined faces of each dimension and pattern dimensions enlarged for shrinkage (as the pattern shrinkage tool, applied to length, width and height), casting volume less cores and casting mass, the metal to pour for the casting yield (gates and risers), and a check against the ladle or furnace capacity.",
    "uses": [
      "Make a pattern for a simple block casting",
      "Estimate metal to melt for a casting",
      "Check a ladle can pour a casting"
    ],
    "users": [
      "Pattern makers",
      "Foundry engineers",
      "Estimators"
    ],
    "inputs": {
      "Lx": "Finished length of the part.",
      "fx": "Number of machined faces across the length (0, 1 or 2).",
      "Ly": "Finished width.",
      "fy": "Machined faces across the width.",
      "Lz": "Finished height.",
      "fz": "Machined faces across the height.",
      "mach": "Machining allowance on each machined face.",
      "shrink": "Pattern-maker’s shrinkage for the metal (from your foundry data).",
      "rhoM": "Density of the cast metal.",
      "cores": "Volume removed by cores.",
      "yld": "Share of the poured metal that ends up in the casting (the rest is gates, risers and runners).",
      "ladle": "Capacity of the ladle or furnace."
    },
    "outputs": [
      "Casting and pattern dimensions",
      "Casting volume and mass",
      "Metal to pour and the capacity check"
    ],
    "method": [
      "Casting dimension = finished + allowance × machined faces; pattern dimension = casting × (1 + shrinkage) (as the pattern shrinkage tool, for each dimension).",
      "Casting volume = product of casting dimensions − cores; mass = volume × density.",
      "Metal to pour = casting mass ÷ yield.",
      "Example: make the pattern 309.18 × 208.14 × 104.07 mm; the casting weighs 46.747 kg and needs 77.912 kg poured."
    ],
    "limitations": [
      "Rectangular block; draft, fillets and core prints are added by the pattern maker.",
      "Uniform shrinkage; hindered contraction in complex castings is less.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A low yield means heavy risers: better feeding design often saves more metal than trimming allowances."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1414, 1419. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
