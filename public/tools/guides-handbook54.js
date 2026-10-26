// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook54).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "heating-coil-plan": {
    "purpose": "Plan for a helical tube coil in a tank: heat-transfer area needed for the duty from the overall coefficient and mean temperature difference, the tube length and turns that give it, the developed length of the coil you choose with its straight ends (as the helix length tool), the area it provides, and the velocity, friction factor and pressure drop of the fluid through the tube (as the pipe friction tool), checked against the duty and your pressure-drop limit.",
    "uses": [
      "Size a heating or cooling coil for a tank or bath",
      "Check an existing coil for a new duty",
      "Find the pressure drop through a coil"
    ],
    "users": [
      "Plant engineers",
      "Process engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Q": "Heat to transfer.",
      "U": "Overall coefficient for the coil, tube and fluids (from your heat-transfer data).",
      "dTm": "Log-mean (or mean) temperature difference between the fluid in the tube and the tank.",
      "Dc": "Mean diameter of the coil.",
      "p": "Axial pitch of the coil.",
      "turns": "Number of turns you plan.",
      "ends": "Total length of the straight inlet and outlet legs.",
      "OD": "Outside diameter of the tube.",
      "t": "Wall thickness of the tube.",
      "flow": "Flow of the heating or cooling fluid through the tube.",
      "nu": "Kinematic viscosity of that fluid.",
      "rho": "Density of that fluid.",
      "eps": "Roughness of the tube bore.",
      "K": "Loss coefficients for the entry, exit and fittings.",
      "dpMax": "Largest pressure drop you accept across the coil."
    },
    "outputs": [
      "Area and tube length needed, turns needed",
      "Developed length and area provided",
      "Velocity and pressure drop"
    ],
    "method": [
      "Area needed = Q ÷ (U ΔT_m); tube length needed = area ÷ (π × tube OD).",
      "Developed length = turns × √[(π D_c)² + p²] + ends (as the helix length tool); area provided = π × OD × length.",
      "Pressure drop = (f L ÷ d + ΣK) ρ v² ÷ 2 with the Colebrook friction factor for the tube bore (as the pipe friction tool).",
      "Example: 20 kW needs 1 m², about 12.961 turns; 14 turns give 1.077 m² of 13.713 m tube with 0.085323 bar drop."
    ],
    "limitations": [
      "Straight-tube friction factor; coil curvature raises the pressure drop somewhat.",
      "Overall coefficient must allow for fouling and the tank side agitation.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the drop is too high, split the coil into parallel circuits rather than shortening it."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2060–2062, 3024–3027, 371–378. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "polygon-milling-setup": {
    "purpose": "Set-up for milling a regular polygon on round stock with a dividing head: side length, across-flats and across-corners sizes (as the regular polygon tool), whether the stock is large enough for full corners, depth of cut to each flat and the passes for your largest depth of cut, and the simple indexing setting between flats (as the simple indexing tool).",
    "uses": [
      "Mill a hexagon or square on a bar end",
      "Choose stock size for a polygon",
      "Prepare the index setting for flats"
    ],
    "users": [
      "Machinists",
      "Toolroom staff",
      "Maintenance fitters"
    ],
    "inputs": {
      "sides": "Number of flats on the polygon.",
      "flats": "Distance across opposite flats (or a flat and the opposite corner for odd numbers, measured as the inscribed circle diameter).",
      "stock": "Diameter of the round bar.",
      "maxDoc": "Deepest cut you take in one pass.",
      "ratio": "Worm ratio of the dividing head.",
      "plates": "Index plates you have."
    },
    "outputs": [
      "Side, across-flats and across-corners sizes",
      "Stock check, depth of cut and passes",
      "Index setting"
    ],
    "method": [
      "Side = across flats × tan(180° ÷ n); across corners = side ÷ sin(180° ÷ n) (as the regular polygon tool).",
      "Full corners need stock ≥ across corners; depth of cut to each flat = (stock − across flats) ÷ 2; passes = ⌈depth ÷ largest cut⌉.",
      "Crank turns between flats = ratio ÷ n (as the simple indexing tool).",
      "Example: a 24 mm hexagon needs 27.713 mm across corners; cut 3 mm deep in 2 passes; index 6 turns and 10 holes in the 15-hole circle."
    ],
    "limitations": [
      "Sharp corners; chamfered corners allow smaller stock.",
      "Simple indexing only.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Stock between the across-flats and across-corners sizes gives a polygon with rounded corners, which is often acceptable for nuts and keys."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 76, 81–82, 2107–2121. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bolt-circle-inspection": {
    "purpose": "Inspection of a bolt circle from three measured hole centres: the circle through the three points, its centre and diameter (as the circle through three points tool), the deviation of the diameter from nominal, and the position of the circle’s centre from the datum origin as a diametral position value (as the true position tool, regardless of feature size), against the diameter tolerance and position tolerance, with a check of how widely the holes are spread.",
    "uses": [
      "Check a drilled flange on a CMM or height gauge",
      "Find the actual pitch circle from hole coordinates",
      "Check the pattern centre against a datum bore"
    ],
    "users": [
      "Inspectors",
      "Quality engineers",
      "Machinists"
    ],
    "inputs": {
      "x1": "Measured X of hole 1 from the datum origin (the datum bore centre).",
      "y1": "Measured Y of hole 1.",
      "x2": "Measured X of hole 2.",
      "y2": "Measured Y of hole 2.",
      "x3": "Measured X of hole 3.",
      "y3": "Measured Y of hole 3.",
      "nom": "Nominal bolt circle diameter.",
      "tolD": "Plus-or-minus tolerance on the bolt circle diameter.",
      "tolPos": "Diametral position tolerance of the pattern centre relative to the datum."
    },
    "outputs": [
      "Fitted centre and diameter",
      "Diameter deviation",
      "Centre position and spread of the points"
    ],
    "method": [
      "Circle through three points: centre from the perpendicular bisectors, radius to any point (as the circle through three points tool).",
      "Diameter deviation = 2r − nominal.",
      "Centre position = 2√(c_x² + c_y²) from the datum origin (as the true position tool, regardless of feature size).",
      "Example: the holes lie on 100.03 mm (+0.027648 mm) with its centre 0.042354 mm (diametral) from the datum."
    ],
    "limitations": [
      "Three holes define the circle exactly, so hole position errors show up as circle errors; more holes need a best fit.",
      "Measurements in the drawing’s datum reference frame.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pick three holes spread at least 120° apart; close holes make the centre very sensitive to errors."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 40–48, 615–627. Topic reference; no source tables or recommended settings are reproduced.",
      "ASME Y14.5-2018 Dimensioning and Tolerancing"
    ]
  },
  "oval-tank-capacity": {
    "purpose": "Check of a horizontal or vertical tank with an elliptical cross-section and flat ends: section area and perimeter (as the ellipse tool), capacity, shell and end plate area and mass for the plate thickness, the contents at the fill level, and the full weight on its supports, checked against the capacity you need and the support capacity.",
    "uses": [
      "Size a fuel or water tank to fit under a chassis or in a corner",
      "Estimate plate for an oval tank",
      "Check supports for the full weight"
    ],
    "users": [
      "Fabrication supervisors",
      "Design engineers",
      "Estimators"
    ],
    "inputs": {
      "major": "Full length of the major axis of the ellipse.",
      "minor": "Full length of the minor axis.",
      "L": "Length of the tank between its flat ends.",
      "t": "Thickness of the shell and end plates.",
      "rhoS": "Density of the plate.",
      "rhoL": "Density of the contents.",
      "fill": "How full the tank is normally filled, as a share of its volume.",
      "need": "Capacity the tank must have.",
      "support": "Load the supports or mounting can carry."
    },
    "outputs": [
      "Section area, perimeter and capacity",
      "Plate area and mass",
      "Contents and full weight"
    ],
    "method": [
      "Area = π a b; perimeter by Ramanujan’s approximation (as the ellipse tool).",
      "Capacity = area × length; plate area = perimeter × length + 2 × section area.",
      "Plate mass = plate area × thickness × density; full weight = plate mass + capacity × fill × contents density.",
      "Example: the tank holds 3,769.9 L; 14.929 m² of plate weighs 468.78 kg; full it weighs 4,050.2 kg."
    ],
    "limitations": [
      "Flat ends; dished ends add volume and change plate area.",
      "Flat oval shells need stiffeners or baffles against pressure and slosh: not checked here.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "An oval section stores less than a circle of the same perimeter, but fits low spaces."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 48–50, 70–75. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bent-bracket-plan": {
    "purpose": "Plan for a press-braked bracket with one or two bends: bend allowances, setbacks, bend deductions and the flat blank length from the outside flange dimensions (as the sheet-metal flat pattern tool), the air-bending force for the bend length in your V-die against the press capacity (as the press brake force tool), and the angle to bend to so the bend springs back to the drawing angle (as the bending springback tool), with blank mass.",
    "uses": [
      "Prepare a blank and brake set-up for a bracket",
      "Check a press brake can bend a part",
      "Set the overbend for springback"
    ],
    "users": [
      "Press brake operators",
      "Sheet-metal designers",
      "Fabrication supervisors"
    ],
    "inputs": {
      "t": "Sheet thickness.",
      "R": "Inside radius of the bends.",
      "Kf": "K-factor locating the neutral axis in the bend.",
      "L1": "First flange, outside dimension.",
      "A1": "Angle of the first bend.",
      "L2": "Second flange, outside dimension.",
      "A2": "Angle of the second bend (0 for a single bend).",
      "L3": "Third flange, outside dimension (used with two bends).",
      "W": "Length of the bend line (the width of the part).",
      "uts": "Tensile strength of the sheet.",
      "YS": "Yield strength of the sheet.",
      "E": "Elastic modulus.",
      "rho": "Density of the sheet.",
      "V": "Opening of the V-die.",
      "k": "Die factor for air bending.",
      "cap": "Rated force of the press brake.",
      "minFl": "Shortest flange that sits across the V-die.",
      "rMin": "Smallest inside radius the material bends to without cracking, as a multiple of thickness."
    },
    "outputs": [
      "Flat blank length and mass",
      "Bend force and press use",
      "Angle to bend to for springback"
    ],
    "method": [
      "Bend allowance = θ (R + K t); setback = (R + t) tan(θ ÷ 2); deduction = 2 × setback − allowance; flat length = Σ flanges − Σ deductions (as the sheet-metal flat pattern tool).",
      "Force = k L t² UTS ÷ V (as the press brake force tool).",
      "Springback ratio from R S_y ÷ (E t); bend-to angle = final angle ÷ K_s (as the bending springback tool).",
      "Example: cut the blank 101.94 × 300 mm (0.48013 kg); each bend needs 44.888 kN; bend to 90.382° for 90°."
    ],
    "limitations": [
      "One radius and K-factor for all bends; air bending in a V-die.",
      "Springback from elastic–plastic theory; confirm with a trial bend.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A wider V-die lowers the force but raises the inside radius and springback."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1346–1353. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "guard-band-acceptance": {
    "purpose": "Acceptance decision for a measured part that allows for measurement uncertainty: the uncertainty budget from calibration, resolution, repeatability, Abbe error and temperature, the expanded uncertainty and test uncertainty ratio, and the guard-banded acceptance zone (as the measurement uncertainty budget tool), then the deviation of the reading from nominal compared with the guard-banded and the tolerance limits to accept, reject or flag it as indeterminate.",
    "uses": [
      "Decide whether a borderline part passes",
      "Set guard-banded acceptance limits on an inspection plan",
      "Show a customer how the decision was made"
    ],
    "users": [
      "Inspectors",
      "Quality engineers",
      "Metrologists"
    ],
    "inputs": {
      "nominal": "Nominal size of the feature (mid-tolerance).",
      "tol": "Total tolerance band, placed symmetrically about the nominal.",
      "reading": "Size measured on the part.",
      "Ucal": "Expanded uncertainty from the gauge’s calibration certificate.",
      "res": "Smallest step the gauge displays.",
      "srep": "Standard deviation of repeated readings on the same part.",
      "offset": "Distance between the measuring line and the scale line (Abbe offset).",
      "tilt": "Possible tilt of the moving jaw or slide.",
      "L": "Length being measured.",
      "alpha": "Expansion coefficient of the part.",
      "dT": "Uncertainty in the temperature difference between part and gauge.",
      "k": "Coverage factor for the expanded uncertainty (2 for about 95%).",
      "turMin": "Least ratio of tolerance to measurement uncertainty you accept."
    },
    "outputs": [
      "Uncertainty budget, expanded uncertainty and test uncertainty ratio",
      "Guard-banded acceptance zone",
      "Accept, reject or indeterminate"
    ],
    "method": [
      "Standard uncertainties: calibration U ÷ 2, resolution ÷ √12, repeatability, Abbe and temperature errors ÷ √3; combined by root sum of squares; expanded = k × combined (as the measurement uncertainty budget tool).",
      "Test uncertainty ratio = tolerance ÷ 2U; acceptance zone = ±(tolerance ÷ 2 − U) about nominal.",
      "Accept inside the acceptance zone; reject outside the tolerance; otherwise indeterminate.",
      "Example: U = 5.9696 µm, so accept within ±19.03 µm; the part is 12 µm from nominal."
    ],
    "limitations": [
      "Symmetric tolerance and uncorrelated contributors.",
      "Simple guard band of one expanded uncertainty; your standard may use a different rule.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Indeterminate parts need a better measurement, not a coin toss: re-measure with a more capable gauge."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 709–735. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO/IEC Guide 98-3 Uncertainty of measurement (GUM)"
    ]
  },
  "rotary-axis-feed-plan": {
    "purpose": "Feed plan for a 4th-axis or rotary-table move: arc length at the cutting radius, path length at the cutter, block time and inverse-time F value for the wanted feed (as the inverse time feed tool), the rotary rate in degrees per minute and the linear axis rate, checked against the machine’s axis rate limits, with the largest achievable cutter feed and its inverse-time value if a limit governs.",
    "uses": [
      "Program a wrapped or helical rotary move",
      "Check a rotary feed against the axis limit",
      "Find why a rotary move runs slower than programmed"
    ],
    "users": [
      "CNC programmers",
      "Machinists",
      "Manufacturing engineers"
    ],
    "inputs": {
      "mode": "Kind of move.",
      "dist": "Linear travel of the move.",
      "angle": "Rotation of the move.",
      "radius": "Radius on the part where the cutter works.",
      "feed": "Feed you want at the cutter.",
      "rotMax": "Highest rate the rotary axis can move at in feed moves.",
      "linMax": "Highest feed the linear axis allows."
    },
    "outputs": [
      "Path length, block time and inverse-time F",
      "Rotary and linear axis rates",
      "Achievable feed"
    ],
    "method": [
      "Arc = π r × angle ÷ 180; path = linear, arc or √(linear² + arc²); block time = path ÷ feed; F = 1 ÷ time (as the inverse time feed tool).",
      "Rotary rate = angle ÷ time; linear rate = distance ÷ time.",
      "Achievable feed = wanted feed × the smallest of 1, rotary limit ÷ rotary rate and linear limit ÷ linear rate.",
      "Example: program F3.7361 (inverse time); the rotary axis turns at 336.25 °/min, within its 2000 °/min limit."
    ],
    "limitations": [
      "Constant feed through the block; acceleration at block ends is not included.",
      "Cutting radius taken as constant over the move.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Near the centre of rotation the rotary rate limit rarely matters; far out it often sets the feed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1288–1289. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "column-formula-compare": {
    "purpose": "Comparison of column formulas for a concentrically loaded strut: slenderness ratio, Euler buckling load, Rankine–Gordon crippling load and safety factor (as the Rankine column tool), and the classic working-stress safe unit stress and safe load for a main or secondary member (as the classic column safe stress tool), with checks of the Rankine factor and the classic safe load.",
    "uses": [
      "Check an existing strut by more than one method",
      "Teach how column formulas compare",
      "Check old steelwork designed by working stress"
    ],
    "users": [
      "Structural designers",
      "Maintenance engineers",
      "Students"
    ],
    "inputs": {
      "A": "Area of the strut section.",
      "r": "Least radius of gyration of the section.",
      "L": "Length between end restraints.",
      "K": "Effective length factor for the end conditions.",
      "Sc": "Crushing strength of the material (for the Rankine formula).",
      "E": "Elastic modulus.",
      "aRank": "Empirical Rankine constant; 0 uses S_c ÷ π²E.",
      "member": "Whether the strut is a main member or bracing (classic formula).",
      "P": "Concentric load on the strut.",
      "req": "Safety factor you need by the Rankine formula."
    },
    "outputs": [
      "Slenderness ratio",
      "Euler and Rankine loads and factors",
      "Classic safe stress and load"
    ],
    "method": [
      "Slenderness = K L ÷ r; Euler load = π² E A ÷ (K L ÷ r)².",
      "Rankine crippling load = S_c A ÷ [1 + a (K L ÷ r)²] (as the Rankine column tool).",
      "Classic safe unit stress from the slenderness by the working-stress formulas, × area for the safe load (as the classic column safe stress tool).",
      "Example: KL/r = 100; Euler 296.09 kN, Rankine 183.13 kN (factor 3.0521), classic safe load 125.66 kN."
    ],
    "limitations": [
      "Concentric load and straight member; eccentric loads need the secant formula.",
      "The classic formula is a historic working-stress method; use the current steel code for new designs.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Euler overestimates short columns; Rankine blends crushing and buckling, so it is lower than both at every length."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 281–287. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hollow-shaft-conversion": {
    "purpose": "Conversion of a solid shaft in a brittle material to a hollow one of equal strength: the solid diameter by the maximum-normal-stress method with shock factors and the hollow outside and bore diameters for the bore ratio (as the brittle and hollow shaft tool), wall thickness, mass per metre of both, angle of twist per metre for the torque, and checks against the largest outside diameter that fits, the least wall and your twist limit.",
    "uses": [
      "Lighten a cast-iron or brittle shaft",
      "Check a hollow shaft fits its bearings",
      "Compare twist of solid and hollow shafts"
    ],
    "users": [
      "Design engineers",
      "Machine designers",
      "Students"
    ],
    "inputs": {
      "M": "Bending moment on the shaft.",
      "T": "Torque on the shaft.",
      "Km": "Shock and fatigue factor on bending.",
      "Kt": "Shock and fatigue factor on torsion.",
      "St": "Allowable tensile stress of the brittle material.",
      "k": "Bore diameter as a fraction of the outside diameter.",
      "rho": "Density of the shaft material.",
      "G": "Shear modulus of the material (cast iron about 40 GPa).",
      "Dmax": "Largest outside diameter the bearings or housing allow.",
      "tMin": "Thinnest wall you accept for casting or machining.",
      "twMax": "Largest angle of twist per metre you accept."
    },
    "outputs": [
      "Solid and hollow diameters",
      "Wall, mass per metre and saving",
      "Twist per metre of each"
    ],
    "method": [
      "Solid diameter D³ = 5.1 ÷ S_t × [K_m M + √((K_m M)² + (K_t T)²)]; hollow outside = B × solid with B = ∛[1 ÷ (1 − k⁴)] (as the brittle and hollow shaft tool).",
      "Wall = (outside − bore) ÷ 2; mass per metre = area × density.",
      "Twist per metre = T ÷ (G J) with J = π (D⁴ − d⁴) ÷ 32.",
      "Example: solid 52.311 mm or hollow 54.788/32.873 mm; the hollow shaft weighs 10.863 kg/m against 15.474 kg/m and twists 0.93022°/m."
    ],
    "limitations": [
      "Maximum-normal-stress theory for brittle materials; fatigue and stress raisers need separate checks.",
      "Equal strength in combined bending and torsion.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A moderate bore (k about 0.5 to 0.6) saves a quarter to a third of the weight for a small increase in diameter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
