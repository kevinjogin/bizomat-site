// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook62).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "intermittent-fillet-weld-plan": {
    "purpose": "Plan of a fillet-welded joint along a given length: the throat and leg needed with a continuous weld and its cost (as the fillet weld joint design tool), then intermittent segments of a chosen length at the minimum leg for the plate thickness — the total length needed, the number of segments so that the clear gap between them stays within your limit, the pitch, and the cost of the intermittent weld (as the same tool for the shorter total length), with the saving against the continuous weld.",
    "uses": [
      "Replace a continuous weld on a lightly loaded stiffener",
      "Set out stitch welds on a frame",
      "Cut weld cost and distortion on long joints"
    ],
    "users": [
      "Fabrication engineers",
      "Welding supervisors",
      "Design engineers"
    ],
    "inputs": {
      "F": "Load the welds carry along the joint.",
      "Lj": "Length of the joint that can be welded.",
      "tau": "Allowable shear stress on the weld throat.",
      "amin": "Smallest fillet leg for the plate thickness from your welding code.",
      "t": "Thickness of the thinner plate (the leg should not exceed it).",
      "ls": "Length of each intermittent segment.",
      "gapMax": "Largest clear gap allowed between segments (from your code; often a multiple of the plate thickness).",
      "excess": "Allowance for convexity and overfill.",
      "rho": "Density of the weld metal.",
      "dep": "Weld metal deposited per hour of arc time.",
      "of": "Share of paid time the arc is on.",
      "eff": "Share of filler bought that ends up in the weld.",
      "rate": "Labour and overhead per paid hour.",
      "wire": "Price of filler."
    },
    "outputs": [
      "Continuous weld leg and cost",
      "Intermittent segments, pitch and gap",
      "Cost saving"
    ],
    "method": [
      "Throat = F ÷ (L τ); leg = throat ÷ 0.707, rounded up to a whole millimetre and not below the minimum; cost from weld metal, arc time, labour and filler (as the fillet weld joint design tool).",
      "Intermittent length needed at the minimum leg = F ÷ (0.707 a τ); segments = the larger of that length ÷ segment length and the number that keeps the gap within the limit.",
      "Pitch = (joint length − segment) ÷ (segments − 1); cost as the same tool for the total segment length.",
      "Example: continuous needs a 5 mm leg; 4 segments of 50 mm at 183.33 mm pitch save 66.667%."
    ],
    "limitations": [
      "Static load spread evenly along the joint; fatigue loading and sealed joints need continuous welds.",
      "Segments of equal length; end segments at the joint ends.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Intermittent welds pay off when the minimum leg already gives far more strength than the load needs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1433–1486. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "acme-nut-bore-inspection": {
    "purpose": "Inspection and drill choice for the minor diameter of an internal Acme thread: the smallest and largest minor diameter for general-purpose or centralizing classes, and the drill size range allowing for the drill cutting oversize (as the Acme tap drill tool), the nearest fractional (64ths) drill within that range, and the measured bore against the minor diameter limits.",
    "uses": [
      "Choose the drill for an Acme nut blank",
      "Inspect the bore of an Acme nut before threading",
      "Check a centralizing Acme nut bore"
    ],
    "users": [
      "Machinists",
      "Inspectors",
      "Toolmakers"
    ],
    "inputs": {
      "D": "Basic major diameter of the Acme thread.",
      "tpi": "Threads per inch.",
      "cls": "Class of thread (general purpose or centralizing).",
      "over": "How much larger than its size the drill is expected to cut.",
      "Bm": "Measured diameter of the bore (the nut minor diameter)."
    },
    "outputs": [
      "Minor diameter limits",
      "Drill range and fractional drill",
      "Measured bore decision"
    ],
    "method": [
      "Minimum minor = D − p (general purpose), D − 0.9p (centralizing 2C–4C) or D − 0.025√D − 0.9p (5C–6C); maximum = minimum + 0.05p (as the Acme tap drill tool).",
      "Drill range = minor limits − probable oversize.",
      "Fractional drill = smallest 64th at or above the lower drill limit, used if it is within the upper limit.",
      "Example: the bore must be 0.8 to 0.81 in; a 0.79688 in drill fits; 0.805 in passes."
    ],
    "limitations": [
      "Drilled or bored holes; reamed or bored holes do not need the oversize allowance.",
      "Fractional drills only; number and letter drills give more choices.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The band for an Acme minor diameter is only a twentieth of the pitch wide, so boring is often safer than drilling."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 944–947, 1921–1946. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "form-tool-profile-plan": {
    "purpose": "Plan of a form tool profile with up to four steps measured from the largest diameter of the work: for a flat tool with front clearance, the depth and angle of each step on the tool (as the forming tool depth tool, flat mode); for a circular tool with its face below centre, the radius of the tool at each step (as the same tool, circular mode), against the usable depth of the flat tool or the smallest radius the circular tool can have.",
    "uses": [
      "Grind a flat form tool for a stepped part",
      "Lay out a circular form tool profile",
      "Check a profile is not too deep for the tool"
    ],
    "users": [
      "Toolmakers",
      "Machinists",
      "Screw machine setters"
    ],
    "inputs": {
      "mode": "Flat (dovetail) form tool or circular form tool.",
      "C": "Front clearance angle of the flat tool.",
      "Rt": "Radius of the circular tool at the largest work diameter.",
      "off": "How far the cutting face is below the tool centre (gives the circular tool its clearance).",
      "D1": "Radial depth of step 1 below the largest diameter of the work.",
      "A1": "Angle of the step 1 flank on the work (flat tool).",
      "D2": "Radial depth of step 2.",
      "A2": "Angle of the step 2 flank.",
      "D3": "Radial depth of step 3.",
      "A3": "Angle of the step 3 flank.",
      "D4": "Radial depth of step 4 (0 if unused).",
      "A4": "Angle of the step 4 flank.",
      "hMax": "Deepest profile the flat tool blank allows.",
      "rMin": "Smallest radius the circular tool may have (bore and wall)."
    },
    "outputs": [
      "Depth and angle of each step on the tool",
      "Deepest step or smallest radius",
      "Against the tool limits"
    ],
    "method": [
      "Flat tool: depth on the tool = depth on the work × cos C; angle on the tool = atan (tan A × cos C) (as the forming tool depth tool).",
      "Circular tool: k = √(R_t² − offset²); radius at a step = √((k − depth)² + offset²) (as the same tool).",
      "Deepest tool depth or smallest tool radius against the limit.",
      "Example: the deepest step is 7.7274 mm on the tool."
    ],
    "limitations": [
      "Steps measured radially from the largest work diameter; axial positions are unchanged on the tool.",
      "Zero top rake; a raked tool changes the depths (use the rake mode of the forming tool depth tool).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Clearance shortens every depth on the tool by the same factor, so a profile ground to work depths cuts too deep."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 797–801. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "taper-disc-gauge-check": {
    "purpose": "Set-up and check of a two-disc taper gauge: the centre distance of the discs for a taper per foot along the centre line (as the taper discs tool), the reading over the outsides of the discs at that distance, the actual taper and included angle from a measured reading over the discs (as the same tool from diameters and centre distance), and the error against your tolerance on the taper.",
    "uses": [
      "Set a disc gauge for a Morse or other taper",
      "Check a disc gauge setting before use",
      "Convert a measured setting to taper and angle"
    ],
    "users": [
      "Toolmakers",
      "Inspectors",
      "Machinists"
    ],
    "inputs": {
      "D": "Diameter of the large disc.",
      "d": "Diameter of the small disc.",
      "T": "Taper per foot on diameter the gauge is to represent.",
      "tolT": "Plus-or-minus tolerance on the taper per foot.",
      "Mm": "Measurement over the outsides of the two discs along the line of centres."
    },
    "outputs": [
      "Centre distance and reading for the taper",
      "Taper and angle from the measured setting",
      "Decision"
    ],
    "method": [
      "Centre distance for a taper T: C = (D − d) ÷ 2 × √(1 + (T ÷ 24)²) ÷ (T ÷ 24) (as the taper discs tool).",
      "Reading over the discs = C + (D + d) ÷ 2; measured centre distance = reading − (D + d) ÷ 2.",
      "K = (D − d) ÷ 2C; taper = 24K ÷ √(1 − K²); angle = 2 asin K (as the taper discs tool).",
      "Example: set the discs 8.0039 in apart (9.2539 in over them); 9.255 in gives 0.7499 in/ft."
    ],
    "limitations": [
      "Discs touching straight edges tangent to both; disc roundness and edge straightness are not included.",
      "Taper measured along the centre line, not from one side.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A small error in centre distance moves the taper very little: disc gauges are forgiving to set but need accurate discs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 684–685. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "composite-rotor-inertia": {
    "purpose": "Inertia and energy of a rotating assembly of up to three bodies: the moment of inertia of each body about its own axis or a diameter, moved to the rotation axis by its offset (as the more mass moments of inertia tool), the total inertia and radius of gyration, the kinetic energy at speed and the energy released for the allowed speed drop, against the energy each cycle of the duty needs.",
    "uses": [
      "Find the inertia of a built-up flywheel or rotor",
      "Check a rotor stores enough energy for a punch or shear",
      "Size a motor start from the total inertia"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Engineering students"
    ],
    "inputs": {
      "shape1": "Shape of body 1 and the axis its inertia is taken about.",
      "m1": "Mass of body 1 (0 to leave it out).",
      "A1": "Dimension A of body 1 (see the shape).",
      "B1": "Dimension B of body 1.",
      "C1": "Dimension C of body 1.",
      "o1": "Distance between body 1’s axis and the rotation axis (parallel axis).",
      "shape2": "Shape of body 2.",
      "m2": "Mass of body 2.",
      "A2": "Dimension A of body 2.",
      "B2": "Dimension B of body 2.",
      "C2": "Dimension C of body 2.",
      "o2": "Offset of body 2.",
      "shape3": "Shape of body 3.",
      "m3": "Mass of body 3.",
      "A3": "Dimension A of body 3.",
      "B3": "Dimension B of body 3.",
      "C3": "Dimension C of body 3.",
      "o3": "Offset of body 3.",
      "n": "Running speed.",
      "drop": "How far the rotor may slow while giving up energy.",
      "Ereq": "Energy the duty takes from the rotor each cycle."
    },
    "outputs": [
      "Inertia of each body and in total",
      "Stored energy and energy released",
      "Against the duty"
    ],
    "method": [
      "Inertia of each shape about its axis (as the more mass moments of inertia tool), plus m × offset² (parallel axis).",
      "Total J and radius of gyration √(J ÷ m).",
      "Stored energy = ½ J ω²; released for a drop from ω₁ to ω₂ = ½ J (ω₁² − ω₂²).",
      "Example: J = 0.42263 kg·m² stores 5,213.9 J and gives up 990.65 J for a 10% drop."
    ],
    "limitations": [
      "Rigid bodies of uniform density; hubs, spokes and bolts add inertia not counted.",
      "Energy drawn faster than the motor can replace it.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Mass at large radius dominates: a thin rim or torus gives far more inertia per kilogram than a solid disc."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 228–240, 182–186. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "preferred-size-selection": {
    "purpose": "Selection of preferred sizes from a Renard series (R5 to R80) for up to five requirements: the ratio of the series and the preferred numbers around each requirement (as the preferred numbers tool), the smallest preferred number at or above each requirement and its rounded value, the oversize of each choice, and the number of distinct sizes, against the largest oversize you accept.",
    "uses": [
      "Choose tank, motor or pulley sizes from a preferred series",
      "Rationalise a product range",
      "See how a coarser series changes the oversize"
    ],
    "users": [
      "Design engineers",
      "Product managers",
      "Standards engineers"
    ],
    "inputs": {
      "series": "Renard series to choose from (finer series give smaller steps).",
      "r1": "First required size or rating.",
      "r2": "Second requirement.",
      "r3": "Third requirement.",
      "r4": "Fourth requirement.",
      "r5": "Fifth requirement.",
      "maxOver": "Largest amount a chosen size may exceed its requirement."
    },
    "outputs": [
      "Preferred size for each requirement",
      "Oversize of each",
      "Distinct sizes and decision"
    ],
    "method": [
      "Series ratio = 10^(1/n); preferred numbers 10^(i/n) (as the preferred numbers tool).",
      "Chosen size = 10^(⌈n log₁₀ r⌉ ÷ n), the smallest preferred number at or above the requirement; rounded to three figures as usually listed.",
      "Oversize = chosen ÷ required − 1.",
      "Example: the largest oversize is 11.111% with 5 distinct sizes."
    ],
    "limitations": [
      "Exact series values; the rounded values used in standards differ slightly (for example 3.15 for 3.162).",
      "Each requirement taken as a minimum; round down instead when the requirement is a maximum.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The worst oversize of a series is its step: about 58% for R5, 26% for R10, 12% for R20."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 672. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "stacked-solid-cg": {
    "purpose": "Centre of gravity of an upright stack of up to three round solid parts — cylinders, frustums, cones and hemispheres, either way up — from the bottom upwards: the volume and centroid height of each part (as the centroid of shapes tool), its mass from its density, the combined mass and centre of gravity height including any height of legs or base below, and the angle of tilt at which the centre of gravity passes over the edge of the base, against your least acceptable tipping angle.",
    "uses": [
      "Find the CG of a full hopper on legs",
      "Check a column or vessel is stable on its base",
      "Estimate the weight of a filled bin"
    ],
    "users": [
      "Design engineers",
      "Riggers",
      "Plant engineers"
    ],
    "inputs": {
      "type1": "Shape of the bottom part.",
      "Da1": "Diameter of part 1 (base, or top for a cone point down).",
      "Db1": "Top diameter of part 1 (frustums only).",
      "h1": "Height of part 1.",
      "rho1": "Density of part 1 (of the contents for a filled vessel).",
      "type2": "Shape of part 2, sitting on part 1.",
      "Da2": "Diameter of part 2.",
      "Db2": "Top diameter of part 2 (frustums only).",
      "h2": "Height of part 2.",
      "rho2": "Density of part 2.",
      "type3": "Shape of part 3, sitting on part 2.",
      "Da3": "Diameter of part 3.",
      "Db3": "Top diameter of part 3 (frustums only).",
      "h3": "Height of part 3.",
      "rho3": "Density of part 3.",
      "z0": "Height of legs or plinth below the stack.",
      "Wb": "Width of the base across the edge it would tip over.",
      "thMin": "Smallest tilt the stack must survive without tipping."
    },
    "outputs": [
      "Volume, mass and centroid of each part",
      "Combined mass and CG height",
      "Tipping angle"
    ],
    "method": [
      "Centroid heights: cone h ÷ 4 from its base; frustum h (R² + 2Rr + 3r²) ÷ 4(R² + Rr + r²) from the large end; hemisphere 3r ÷ 8 from the flat face (as the centroid of shapes tool); cylinder h ÷ 2.",
      "Mass = volume × density; CG height = Σ m z ÷ Σ m plus the base height.",
      "Tipping angle = atan ((base width ÷ 2) ÷ CG height).",
      "Example: 1,649.3 kg with its CG 1,892.9 mm up; it tips at 17.588°."
    ],
    "limitations": [
      "Solid, uniformly dense parts; for a vessel, add the shell as separate parts or masses.",
      "Static tilt; wind, sloshing and acceleration reduce the margin.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Raising a full hopper on taller legs lowers the tipping angle quickly; widening the leg spread restores it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 221–227, 66–76. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "three-point-support-loads": {
    "purpose": "Load share of a rigid body on three supports from up to three vertical loads: the three equilibrium equations (total load, and moments about the X and Y axes) solved by inverting the 3 × 3 matrix of support positions (as the 3 × 3 matrix tool), giving each support reaction, then the check that every reaction is upward (the combined load lies inside the support triangle) and within its capacity.",
    "uses": [
      "Find the load on each foot of a three-legged machine or table",
      "Place a heavy item on a three-point base",
      "Check a kinematic mount or levelling feet"
    ],
    "users": [
      "Design engineers",
      "Riggers",
      "Machine installers"
    ],
    "inputs": {
      "sx1": "X of support 1.",
      "sy1": "Y of support 1.",
      "sx2": "X of support 2.",
      "sy2": "Y of support 2.",
      "sx3": "X of support 3.",
      "sy3": "Y of support 3.",
      "W1": "Load 1 (weight, downward).",
      "wx1": "X of load 1.",
      "wy1": "Y of load 1.",
      "W2": "Load 2.",
      "wx2": "X of load 2.",
      "wy2": "Y of load 2.",
      "W3": "Load 3.",
      "wx3": "X of load 3.",
      "wy3": "Y of load 3.",
      "cap": "Load each support (foot, mount, jack) can carry."
    },
    "outputs": [
      "Total load and where it acts",
      "Reaction at each support",
      "Uplift and capacity checks"
    ],
    "method": [
      "Equilibrium: R₁ + R₂ + R₃ = ΣW; Σ R x = Σ W x; Σ R y = Σ W y.",
      "Matrix of [1 1 1; x₁ x₂ x₃; y₁ y₂ y₃] inverted (as the 3 × 3 matrix tool); reactions = inverse × [ΣW, ΣWx, ΣWy].",
      "A negative reaction means the load lies outside the support triangle and that support lifts.",
      "Example: supports carry 2,712.5, 1,912.5 and 2,375 N."
    ],
    "limitations": [
      "Rigid body and supports at one level; three supports always share load statically, four or more do not.",
      "Vertical loads only.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With three supports the share depends only on where the loads are, not on stiffness, which is why precision instruments stand on three feet."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 122–125, 153–163. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "sine-bar-dms-setup": {
    "purpose": "Sine bar set-up for a drawing angle in degrees, minutes and seconds: the angle converted to decimal degrees and radians (as the degrees, minutes and seconds tool), then the exact height difference, the gauge block stack rounded to the set’s resolution, the angle the stack sets, the rounding error, the angle change per micrometre and the total error with the stack tolerance (as the sine bar set-up tool), with the set angle shown back in degrees, minutes and seconds, and the angle given by a measured stack.",
    "uses": [
      "Set a sine bar to a drawing angle in degrees and minutes",
      "Check the angle a built stack gives",
      "Convert set-up angles for an inspection report"
    ],
    "users": [
      "Inspectors",
      "Toolmakers",
      "Machinists"
    ],
    "inputs": {
      "d": "Whole degrees of the angle.",
      "mi": "Minutes of the angle.",
      "s": "Seconds of the angle.",
      "L": "Distance between the sine bar roller centres.",
      "res": "Smallest step the gauge block set can build.",
      "tolS": "Combined tolerance of the blocks in the stack.",
      "angTol": "Tolerance on the angle in seconds of arc.",
      "Hm": "Height of a stack already built, to find the angle it gives (0 to skip)."
    },
    "outputs": [
      "Angle in decimal degrees",
      "Gauge block stack and set angle",
      "Set-up error and decision"
    ],
    "method": [
      "Decimal degrees = degrees + minutes ÷ 60 + seconds ÷ 3600 (as the degrees, minutes and seconds tool).",
      "Height = L sin θ; stack rounded to the set’s resolution; set angle = asin (stack ÷ L); error per micrometre = 0.001 ÷ (L cos θ) (as the sine bar set-up tool).",
      "Set and measured angles converted back to degrees, minutes and seconds.",
      "Example: 12° 30′ 15″ is 12.504°; build a 43.302 mm stack (error 0.39331″)."
    ],
    "limitations": [
      "Bar, rollers and surface plate taken as perfect.",
      "Angles above 45° are better set as their complement on an angle plate.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "On a 200 mm bar one micrometre of stack is about one second of arc at small angles."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 103–104, 676–682, 705–708. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
