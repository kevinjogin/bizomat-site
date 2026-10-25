// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook9).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "helix-length": {
    "purpose": "Developed length, helix angle and lead of a helix such as a coil, spring, cooling coil or spiral guard, from its mean diameter, pitch and number of turns.",
    "uses": [
      "Estimate tube length for a cooling or heating coil",
      "Find wire length for a spring or guard",
      "Find the helix angle of a coil"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "D": "Diameter to the centre of the wire or tube.",
      "p": "Axial distance between adjacent turns, centre to centre.",
      "turns": "Number of complete (or fractional) turns.",
      "ends": "Extra straight length for tails and connections."
    },
    "outputs": [
      "Length per turn",
      "Developed length",
      "Helix angle",
      "Coil height"
    ],
    "method": [
      "Length per turn = √((π D)² + p²).",
      "Developed length = turns × length per turn + end allowance.",
      "Helix angle (from a plane normal to the axis) = atan(p ÷ π D); coil height = turns × p.",
      "Example: 10 turns at 300 mm diameter and 50 mm pitch need 9.438 m."
    ],
    "limitations": [
      "Uniform helix; transitions at the ends are covered only by the end allowance.",
      "Bending stretches the outside and compresses the inside; the centre-line length is used.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Add cutting and bending allowances before ordering material."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2060–2062, 304–320. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "vessel-head-volume": {
    "purpose": "Volume of a cylindrical vessel with flat, 2:1 ellipsoidal, hemispherical, torispherical or conical ends, with the head and shell volumes shown separately.",
    "uses": [
      "Find capacity of a receiver, tank or hopper with dished ends",
      "Compare head types",
      "Estimate fill quantities"
    ],
    "users": [
      "Process engineers",
      "Fabrication estimators",
      "Maintenance planners"
    ],
    "inputs": {
      "D": "Inside diameter of the shell.",
      "L": "Length of the straight cylindrical part between head tangent lines.",
      "head": "Head shape from the vessel drawing.",
      "heads": "2 for a closed vessel, 1 for a vertical tank with one dished end.",
      "coneAngle": "Half-angle of a conical head measured from the axis (conical heads only)."
    },
    "outputs": [
      "Volume of each head",
      "Shell volume",
      "Total volume"
    ],
    "method": [
      "Shell V = π D² L ÷ 4.",
      "Head volumes: 2:1 ellipsoidal π D³ ÷ 24; hemispherical π D³ ÷ 12; torispherical (crown radius D, knuckle 6% D) ≈ 0.0809 D³; conical π D³ ÷ (24 tan α); flat 0.",
      "Total = shell + number of heads × head volume.",
      "Example: 1000 mm × 2000 mm with two 2:1 ellipsoidal heads holds 1,832.6 L."
    ],
    "limitations": [
      "Inside dimensions; straight flanges of heads are counted in the shell length only if included there.",
      "The torispherical value is an approximation for standard flanged and dished proportions.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the head maker’s volume tables for exact capacities."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 68–69, 82–87. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "linear-interpolation": {
    "purpose": "Straight-line interpolation (or extrapolation) between two known points, in either direction, for reading engineering tables and charts.",
    "uses": [
      "Read a value between two rows of a data table",
      "Find the input that gives a target output",
      "Check a chart reading"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Estimators"
    ],
    "inputs": {
      "mode": "Interpolate forwards (y from x) or backwards (x from y).",
      "x1": "x value of the first table row.",
      "y1": "Value at x₁.",
      "x2": "x value of the second table row.",
      "y2": "Value at x₂.",
      "x": "The x value you need (forward mode).",
      "y": "The y value you need (backward mode)."
    },
    "outputs": [
      "Interpolated value",
      "Slope",
      "Whether the point lies inside the table range"
    ],
    "method": [
      "y = y₁ + (x − x₁)(y₂ − y₁) ÷ (x₂ − x₁).",
      "x = x₁ + (y − y₁)(x₂ − x₁) ÷ (y₂ − y₁).",
      "Example: between (20, 4.18) and (40, 4.179), x = 25 gives y = 4.17975."
    ],
    "limitations": [
      "Assumes a straight line between the points; strongly curved data needs closer points or another method.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Avoid extrapolating far beyond the table; the relation may change."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 121. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "circle-three-points": {
    "purpose": "Centre coordinates, radius and diameter of the circle through three points, for checking arcs, bores and bolt circles from coordinate measurements.",
    "uses": [
      "Find a bore or boss centre from three probe points",
      "Check an arc radius from coordinates",
      "Lay out a radius through known points"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "x1": "X coordinate of the first point.",
      "y1": "Y coordinate of the first point.",
      "x2": "X of the second point.",
      "y2": "Y of the second point.",
      "x3": "X of the third point.",
      "y3": "Y of the third point. Spread the points well around the arc for accuracy."
    },
    "outputs": [
      "Centre X and Y",
      "Radius and diameter",
      "Arc spread of the points"
    ],
    "method": [
      "Solve the perpendicular bisectors: D = 2[x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)].",
      "Centre X = [(x₁² + y₁²)(y₂ − y₃) + (x₂² + y₂²)(y₃ − y₁) + (x₃² + y₃²)(y₁ − y₂)] ÷ D, and similarly for Y.",
      "Radius = distance from the centre to any point.",
      "Example: the default points give a centre at (0, 0) and a radius of 50 mm."
    ],
    "limitations": [
      "Exactly three points define a circle but give no estimate of form error; use more points and a best fit for inspection.",
      "Points close together make the result very sensitive to measurement error.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Points spread over 120° or more give a reliable centre."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 40–48. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "true-position": {
    "purpose": "Diametral true-position deviation from measured X and Y deviations, with bonus tolerance at maximum or least material condition, and size limit checks.",
    "uses": [
      "Accept or reject holes and pins from CMM or layout results",
      "Explain bonus tolerance to the shop",
      "Check a fixture or gauge design"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "feature": "Hole or pin.",
      "mod": "Modifier in the feature control frame.",
      "dx": "Measured X location minus basic (true) X.",
      "dy": "Measured Y location minus basic (true) Y.",
      "tol": "Diametral position tolerance stated in the feature control frame.",
      "size": "Measured actual mating size of the feature.",
      "lower": "Lower size limit from the drawing.",
      "upper": "Upper size limit from the drawing."
    },
    "outputs": [
      "Actual position (diameter)",
      "Bonus tolerance",
      "Total allowed position tolerance",
      "Size within limits"
    ],
    "method": [
      "Actual position = 2√(dx² + dy²).",
      "MMC bonus: hole = size − lower limit; pin = upper limit − size. LMC bonus: hole = upper limit − size; pin = size − lower limit. RFS: no bonus.",
      "Allowed = stated tolerance + bonus; the feature passes if position ≤ allowed and the size is within limits.",
      "Example: deviations of 0.06 and 0.08 mm give a position of 0.2 mm against 0.32 mm allowed."
    ],
    "limitations": [
      "Two-dimensional position relative to the datum frame used for measurement; datum shift (mobility) is not included.",
      "Uses the measured size as the actual mating size; form errors affect real gauging.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A functional gauge accepts exactly what MMC position allows; use it for production checking where possible."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 615–627. Topic reference; no source tables or recommended settings are reproduced.",
      "ASME Y14.5-2018 Dimensioning and Tolerancing"
    ]
  },
  "taper-balls": {
    "purpose": "Included angle and diameter at the top face of an internal taper from the depths to the tops of two precision balls of different sizes.",
    "uses": [
      "Inspect tapered bores, valve seats and Morse sockets",
      "Measure a taper without a taper gauge",
      "Check the diameter at the gauge line"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "d1": "Measured diameter of the smaller precision ball (it sits deeper).",
      "d2": "Measured diameter of the larger ball.",
      "h1": "Depth gauge reading from the top face down to the top of the small ball.",
      "h2": "Depth reading to the top of the large ball (negative if it stands above the face)."
    },
    "outputs": [
      "Included taper angle",
      "Taper per unit length on diameter",
      "Diameter at the top face"
    ],
    "method": [
      "With radii R₁ < R₂ and H = h₁ − h₂: sin(α/2) = (R₂ − R₁) ÷ (H − (R₂ − R₁)).",
      "Taper on diameter = 2 tan(α/2).",
      "Large ball centre lies R₂ ÷ sin(α/2) from the apex; diameter at the face = 2 tan(α/2) × (that distance + R₂ + h₂).",
      "Example: the default readings give an included angle of 23.074° and 28.577 mm at the top face."
    ],
    "limitations": [
      "Straight, round taper; both balls must touch the conical wall all round.",
      "Ball diameter and depth errors are magnified for small angles.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use balls as far apart in size as the taper allows to reduce error."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 682–691. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "go-nogo-gauge": {
    "purpose": "Go and no-go gauge sizes for a hole (plug gauges) or shaft (ring or snap gauges) by Taylor’s principle, with gauge tolerance and wear allowance placed inside the work tolerance.",
    "uses": [
      "Specify limit gauges for production",
      "Check a purchased gauge against the part limits",
      "Decide gauge tolerance and wear allowance"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "feature": "Hole or shaft.",
      "lower": "Smallest permitted size from the drawing.",
      "upper": "Largest permitted size from the drawing.",
      "gpct": "Gauge-maker’s tolerance as a share of the work tolerance (10% is a common rule; gauge standards set exact classes).",
      "wpct": "Allowance on the go gauge for wear (0 if your system does not use one)."
    },
    "outputs": [
      "Go gauge size range",
      "No-go gauge size range",
      "Work tolerance used by the gauges"
    ],
    "method": [
      "Work tolerance T = upper − lower; gauge tolerance G = % × T; wear W = % × T.",
      "Hole: go plug = lower + W to lower + W + G; no-go plug = upper − G to upper.",
      "Shaft: go ring = upper − W − G to upper − W; no-go ring = lower to lower + G.",
      "All gauge tolerances lie inside the work limits, so a good gauge never accepts a bad part.",
      "Example: a 25–25.021 mm hole needs a go plug of 25.0011 to 25.0031 mm and a no-go plug of 25.0189 to 25.021 mm."
    ],
    "limitations": [
      "Inward (conservative) placement only; some standards allow other placements.",
      "Gauge form, temperature and measuring force must also be controlled.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Calibrate gauges regularly and withdraw go gauges when worn past the low (or high) limit."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 661–663, 705–708. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "toggle-joint": {
    "purpose": "Output (resisting) force and mechanical advantage of an equal-arm toggle joint from the applied force and the link angle, for clamps, presses and crushers.",
    "uses": [
      "Size toggle clamps and press linkages",
      "Show how force rises near the straight position",
      "Check actuator force for a toggle"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Machine builders"
    ],
    "inputs": {
      "F": "Force applied to the central joint, at right angles to the line along which the output moves.",
      "angle": "Angle between each link and the output line; it falls towards zero as the links straighten."
    },
    "outputs": [
      "Output force",
      "Mechanical advantage",
      "Force on each link"
    ],
    "method": [
      "From the handbook relation 2R sin α = P cos α: output R = P ÷ (2 tan α).",
      "Each link carries P ÷ (2 sin α).",
      "Example: 500 N at 10° gives 1,417.8 N output, a mechanical advantage of 2.8356."
    ],
    "limitations": [
      "Frictionless pins and rigid links; near the straight position, elasticity and clearances limit the real force.",
      "The output force grows without limit as the angle approaches zero in theory only.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Design the frame and pins for the force at the smallest working angle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 172–174. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "wedge-force": {
    "purpose": "Force to drive and to withdraw a wedge that raises a guided load, with friction on both wedge faces, and the self-locking check.",
    "uses": [
      "Size wedge levelling mounts and jacks",
      "Check that a wedge or taper key stays in place",
      "Estimate force to remove a taper key"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Machine builders"
    ],
    "inputs": {
      "W": "Load the wedge supports or lifts, perpendicular to its base.",
      "angle": "Angle between the two wedge faces (taper angle).",
      "mu": "Friction coefficient for the wedge faces, assumed equal on both faces."
    },
    "outputs": [
      "Force to drive the wedge",
      "Force to withdraw it",
      "Self-locking or not"
    ],
    "method": [
      "Friction angle φ = atan μ.",
      "Driving force P = W tan(α + 2φ).",
      "Withdrawal force P′ = W tan(2φ − α); if 2φ > α the wedge is self-locking.",
      "Example: a 6° wedge under 10000 N needs 4,257.4 N to drive and 1,955 N to withdraw."
    ],
    "limitations": [
      "Simple wedge with the load guided perpendicular to the base; guide friction is not included.",
      "Friction varies widely; vibration can release a nominally self-locking wedge.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use a small wedge angle for fine adjustment and self-locking; it needs more travel."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 169–171. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "power-screw-torque": {
    "purpose": "Torque to raise and to lower a load with a square, Acme or trapezoidal power screw, including thrust-collar friction, with efficiency and self-locking.",
    "uses": [
      "Size the handle or motor for a screw jack",
      "Compare collar bearings and lubrication",
      "Check whether a jack holds its load"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Machine builders"
    ],
    "inputs": {
      "F": "Load to raise or lower.",
      "dm": "Mean thread diameter = nominal − pitch ÷ 2 (approximately).",
      "lead": "Axial advance per turn (pitch × starts).",
      "flank": "Thread profile.",
      "mu": "Thread friction for the materials and lubrication (about 0.1–0.15 lubricated steel on bronze).",
      "dc": "Mean diameter of the thrust collar or washer; 0 if a rolling bearing makes collar friction negligible.",
      "muc": "Friction coefficient at the collar."
    },
    "outputs": [
      "Torque to raise",
      "Torque to lower",
      "Efficiency raising",
      "Self-locking"
    ],
    "method": [
      "Raise: T = F dm/2 × (L + π μ dm sec α) ÷ (π dm − μ L sec α) + F μc dc/2.",
      "Lower: T = F dm/2 × (π μ dm sec α − L) ÷ (π dm + μ L sec α) + F μc dc/2.",
      "Efficiency = F L ÷ (2π T_raise); self-locking when the thread part of the lowering torque is positive.",
      "Example: 20000 N on a 30 mm, 6 mm lead trapezoidal screw needs 110.82 N·m to raise."
    ],
    "limitations": [
      "Uses the flank half-angle in the axial plane (sec α approximation).",
      "Starting friction is higher than running friction.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the screw must hold a load reliably, add a brake; vibration can back-drive a self-locking screw."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1921–1928, 2561–2568. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "band-brake": {
    "purpose": "Tight and slack band tensions, lever force and maximum lining pressure of a simple band brake from the braking torque, drum size, wrap angle and friction.",
    "uses": [
      "Size a band brake for a winch or hoist drum",
      "Check lever or actuator force",
      "Check lining pressure"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Machine builders"
    ],
    "inputs": {
      "T": "Torque the brake must hold or absorb, including your service factor.",
      "D": "Drum diameter at the lining.",
      "wrap": "Angle of band contact on the drum.",
      "mu": "Lining friction coefficient from the maker (use a conservative value).",
      "a": "Distance from the lever pivot to where the force is applied.",
      "b": "Distance from the pivot to the slack-side band attachment (simple band brake with the tight end anchored at the pivot).",
      "w": "Width of the band lining."
    },
    "outputs": [
      "Tight and slack tensions",
      "Lever force",
      "Maximum lining pressure"
    ],
    "method": [
      "Net band force T₁ − T₂ = 2T ÷ D; T₁ ÷ T₂ = e^(μθ).",
      "T₂ = (T₁ − T₂) ÷ (e^(μθ) − 1); lever force = T₂ b ÷ a.",
      "Maximum pressure p = T₁ ÷ (r w).",
      "Example: 400 N·m on a 400 mm drum needs a 64.284 N lever force, with T₁ = 2,642.8 N."
    ],
    "limitations": [
      "Simple band brake rotating so the anchored end is the tight side; reversing the drum greatly increases lever force.",
      "Heat dissipation and lining wear are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Keep peak pressure within the lining maker’s limit and check heat for repeated stops."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2455–2457. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shoe-brake": {
    "purpose": "Normal force, lever force and shoe pressure of a short single-shoe brake on a drum, for either direction of rotation, with the self-locking check.",
    "uses": [
      "Size a shoe brake for a drum or wheel",
      "Check the effect of rotation direction",
      "Avoid unintended self-locking"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Machine builders"
    ],
    "inputs": {
      "T": "Braking torque required.",
      "D": "Drum diameter.",
      "mu": "Lining friction coefficient.",
      "a": "Lever length from pivot to the applied force.",
      "b": "Perpendicular distance from the pivot to the line of the shoe’s normal force.",
      "c": "Perpendicular distance from the pivot to the line of the friction force (tangent at the shoe).",
      "dir": "Whether friction drags the shoe onto the drum (self-energising) or off it, for this rotation direction.",
      "area": "Contact area of the shoe lining."
    },
    "outputs": [
      "Normal force on the shoe",
      "Lever force",
      "Shoe pressure",
      "Self-locking check"
    ],
    "method": [
      "Friction force = T ÷ r; normal force N = T ÷ (μ r).",
      "Lever force: self-energising F = N(b − μc) ÷ a; de-energising F = N(b + μc) ÷ a.",
      "Self-locking when b ≤ μc in the self-energising direction; shoe pressure = N ÷ area.",
      "Example: 200 N·m on a 300 mm drum needs N = 3,809.5 N and a lever force of 1,417.1 N."
    ],
    "limitations": [
      "Short-shoe assumption (uniform pressure); long shoes need integration over the shoe arc.",
      "Heat capacity not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Avoid self-locking geometry unless it is deliberate; it makes the brake grab."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2455–2459. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "cone-clutch": {
    "purpose": "Torque capacity of a cone clutch by the uniform-wear assumption, the axial force to hold it engaged, and the higher force needed during engagement.",
    "uses": [
      "Size a cone clutch or synchroniser",
      "Choose the cone angle",
      "Find spring force for a given torque"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers",
      "Machine builders"
    ],
    "inputs": {
      "Do": "Outer (large) diameter of the friction surface.",
      "Di": "Inner (small) diameter of the friction surface.",
      "alpha": "Half-angle of the cone from its axis (often 8–15°; below about 8° the cone tends to stick).",
      "mu": "Friction coefficient of the lining.",
      "F": "Axial force holding the clutch engaged (spring force).",
      "Treq": "Torque to transmit, multiplied by your service factor."
    },
    "outputs": [
      "Torque capacity (uniform wear)",
      "Force needed during engagement",
      "Margin over required torque"
    ],
    "method": [
      "T = μ F (D + d) ÷ (4 sin α).",
      "Engaging force (slipping in) = F (sin α + μ cos α) ÷ sin α.",
      "Margin = capacity ÷ required.",
      "Example: 1500 N on a 12° cone carries 162.33 N·m; engaging needs 3,264.2 N."
    ],
    "limitations": [
      "Uniform-wear assumption; new linings carry slightly more torque.",
      "Small cone angles may jam and need a release force.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Cone angles below about 8° tend to stick; above about 15° the axial force rises."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2446–2449. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "wire-rope-reeving": {
    "purpose": "Line pull at the drum for a load reeved over several parts of line with sheave friction, the rope safety factor against its minimum breaking load, and the sheave-to-rope diameter ratio.",
    "uses": [
      "Check hoist rope and drum pull for a block",
      "Choose the number of parts of line",
      "Check sheave size against the rope"
    ],
    "users": [
      "Lifting engineers",
      "Maintenance engineers",
      "Crane and hoist designers"
    ],
    "inputs": {
      "mass": "Mass lifted including the hook block and slings.",
      "n": "Number of rope falls between the upper and lower blocks.",
      "eta": "Efficiency of each sheave (about 98% for rolling bearings, 96% for plain bushes).",
      "mbl": "Minimum breaking load from the rope certificate.",
      "req": "Rope design factor required by your crane or hoist code (often 5 or more).",
      "D": "Pitch diameter of the smallest sheave.",
      "d": "Nominal rope diameter.",
      "ratioReq": "Minimum sheave-to-rope ratio from the code or rope maker."
    },
    "outputs": [
      "Line pull at the drum",
      "Rope safety factor",
      "Reeving efficiency",
      "Sheave D/d ratio"
    ],
    "method": [
      "Line pull F = W (1 − η) ÷ (1 − ηⁿ), with W = m g.",
      "Reeving efficiency = W ÷ (n F).",
      "Safety factor = MBL ÷ F; D/d = sheave ÷ rope diameter.",
      "Example: 5000 kg on 4 parts gives 12.632 kN line pull and a safety factor of 9.4995."
    ],
    "limitations": [
      "Hoisting at steady speed; acceleration, dynamic and wind loads must be added per the code.",
      "Lead and equaliser sheaves outside the block are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Lifting equipment must meet its design code and be certified by a competent person."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2613–2650. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
